// Render check for a built page, in headless Chrome or Edge.
//
//   node build/check.mjs <problem>            checks docs/<problem>/index.html
//   node build/check.mjs --file <page.html>   checks any built page
//   --terms              list every underlined glossary term with the words around it
//   --ids a b c          write a 1300 px tall capture starting at each element into .check/
//   --figures [names]    capture each figure module (or only those named, by module or figure id) once it has drawn
//                        at its final size, at 400 and 1920 px, in both themes; then measure each one's frame cost
//                        while it animates (and while a point is dragged, if it has one) at 1x and 4x CPU slowdown:
//                        its setup at 4x apart, then the median and 95th percentile of steady frames. A figure is over
//                        a limit with a median steady frame over 4 ms at 1x, a 95th-percentile frame over 16 ms at 4x,
//                        or a setup task (its canvas and math labels, its init, or its first frame) over 50 ms at 4x;
//                        it is then measured again on a fresh load and fails if it is over a limit again
//   --skip-scroll        skip the scroll, stability, and anchor tests (for quick captures)
//   --capture-width N    window width of --ids captures (default 1240)
//   --cpu 1,4            CPU slowdowns for the scroll tests (default 1 and 4; 4x imitates ordinary hardware)
//   --out <dir>          where captures go (default .check/)
//
// Fails (exit status 1) on sideways page scroll at 400, 900, 1240, 1920, or 2560 px, a console error, any network
// request, a page above 6 MB, a KaTeX face the math uses but the page lacks, a placeholder index outside the formula
// table, a steps block whose drawn numbers do not run 1 to n, unfilled math near the window at a scroll stop, a far figure that still draws or holds canvas memory, a page
// that moves when far chapters are emptied or refilled, an anchor jump that lands off target, and, at 4x CPU slowdown,
// a steady scroll with a 95th-percentile frame over 33 ms, a frame over 200 ms, or more than 3% of frames over 50 ms. Reports size, load timings, DOM
// nodes, long tasks, peak DOM nodes during scrolling, and the frame times of each figure.

import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer-core';
import { execFileSync } from 'node:child_process';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const BROWSERS = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
];
const WIDTHS = [400, 900, 1240, 1920, 2560];
const SIZE_LIMIT = 6_000_000;
const CAPTURE_HEIGHT = 1300;

function parseArgs(argv) {
  const env = (k) => process.env[`npm_config_${k}`] === 'true';
  const a = { problem: null, file: null, terms: env('terms'), ids: [], figures: env('figures'), figureNames: [], skipScroll: env('skip_scroll'), captureWidth: 1240, cpus: [1, 4], out: path.join(ROOT, '.check') };
  for (let i = 0; i < argv.length; i++) {
    const x = argv[i];
    if (x === '--terms') a.terms = true;
    else if (x === '--figures') { a.figures = true; while (argv[i + 1] && !argv[i + 1].startsWith('--')) a.figureNames.push(argv[++i]); }
    else if (x === '--skip-scroll') a.skipScroll = true;
    else if (x === '--file') a.file = path.resolve(argv[++i]);
    else if (x === '--capture-width') a.captureWidth = Number(argv[++i]);
    else if (x === '--cpu') a.cpus = String(argv[++i]).split(',').map(Number);
    else if (x === '--out') a.out = path.resolve(argv[++i]);
    else if (x === '--ids') { while (argv[i + 1] && !argv[i + 1].startsWith('--')) a.ids.push(argv[++i]); }
    else if (x.startsWith('--')) throw new Error(`unknown option ${x}`);
    else if (!a.problem) a.problem = x;
    else a.ids.push(x);
  }
  if (!a.file) {
    if (!a.problem) throw new Error('name a problem (npm run check riemann) or pass --file <page.html>');
    a.file = path.join(ROOT, 'docs', a.problem, 'index.html');
  }
  return a;
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const frames = (page, n = 2) => page.evaluate((k) => new Promise((res) => { let i = 0; const f = () => (++i >= k ? res() : requestAnimationFrame(f)); requestAnimationFrame(f); }), n);

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (!fs.existsSync(args.file)) throw new Error(`no page at ${args.file}; build it first`);
  const failures = [];
  const fail = (msg) => { failures.push(msg); console.log(`FAIL ${msg}`); };

  const size = fs.statSync(args.file).size;
  console.log(`page ${path.relative(ROOT, args.file)}: ${(size / 1e6).toFixed(2)} MB (${size.toLocaleString('en-US')} bytes)`);
  if (size > SIZE_LIMIT) fail(`page is ${(size / 1e6).toFixed(2)} MB, above 6 MB`);

  const executablePath = BROWSERS.find((b) => fs.existsSync(b));
  if (!executablePath) throw new Error('no Chrome or Edge at the known paths');
  // The 4x jump scroll on a 25-chapter page runs one page.evaluate for over three minutes, past the 180 s default.
  const browser = await puppeteer.launch({ executablePath, headless: true, protocolTimeout: 900000, args: ['--no-first-run', '--no-default-browser-check', '--disable-extensions', '--allow-file-access-from-files'] });
  const url = pathToFileURL(args.file).href;
  // On a busy Windows machine, MX_CHECK_PRIORITY=AboveNormal raises this browser's processes (only these) above the
  // other work, so that frame times measure the page rather than the machine's load.
  const boost = () => {
    const pri = process.env.MX_CHECK_PRIORITY;
    if (!pri || process.platform !== 'win32' || !browser.process()) return;
    const pid = browser.process().pid;
    execFileSync('powershell', ['-NoProfile', '-Command', `$ids = @(${pid}) + @(Get-CimInstance Win32_Process -Filter "ParentProcessId=${pid}" | ForEach-Object { $_.ProcessId }); foreach ($i in $ids) { try { (Get-Process -Id $i).PriorityClass = '${pri.replace(/[^A-Za-z]/g, '')}' } catch {} }`]);
  };
  try {
    const page = await browser.newPage();
    const consoleErrors = [];
    const requests = [];
    page.on('console', (m) => { if (m.type() === 'error') consoleErrors.push(m.text()); });
    page.on('pageerror', (e) => consoleErrors.push(`uncaught: ${e.message}`));
    page.on('request', (r) => {
      const u = r.url();
      if (u === url || u.startsWith('data:') || u.startsWith('blob:') || u.startsWith('about:')) return;
      requests.push(u);
    });
    await page.evaluateOnNewDocument(() => {
      window.__longTasks = [];
      document.addEventListener('DOMContentLoaded', () => { window.__nodesBefore = document.getElementsByTagName('*').length; });
      try {
        new PerformanceObserver((list) => { for (const e of list.getEntries()) window.__longTasks.push({ start: e.startTime, ms: e.duration }); }).observe({ type: 'longtask', buffered: true });
      } catch (e) { /* longtask entries unsupported */ }
    });

    const cdp = await page.createCDPSession();
    const throttle = async (rate) => { await cdp.send('Emulation.setCPUThrottlingRate', { rate }); };
    // Each test runs on its own: an error inside one is recorded as a failure and the tests after it still run, so
    // one broken test never hides the others' results, the term listing, or the captures. A test with a time limit
    // that it passes fails loudly; work it left running in the browser is not awaited.
    const stage = async (name, fn, limitS = 0) => {
      const t = Date.now();
      let timer;
      try {
        const limit = limitS ? new Promise((_, reject) => { timer = setTimeout(() => reject(new Error(`no result within ${limitS} s`)), limitS * 1000); }) : null;
        await (limit ? Promise.race([fn(), limit]) : fn());
      } catch (err) {
        fail(`${name} could not finish: ${String((err && err.message) || err).split('\n')[0]}`);
        await throttle(1).catch(() => {});
        await page.evaluate(() => document.documentElement.classList.remove('cv-off')).catch(() => {});
      } finally {
        clearTimeout(timer);
      }
      const secs = (Date.now() - t) / 1000;
      // Durations of whole tests, not of each figure's or capture's part of one.
      if (secs >= 2 && !name.includes('#')) console.log(`  (${name}: ${secs.toFixed(0)} s)`);
    };

    // Load timing, cold then warm.
    await stage('the load timing', async () => {
    await page.setViewport({ width: 1240, height: 900 });
    const timing = [];
    for (let i = 0; i < 2; i++) {
      await page.goto(url, { waitUntil: 'load' });
      if (i === 0) boost();
      await page.evaluate(() => document.fonts.ready);
      timing.push(await page.evaluate(async () => {
        await window.MX.hydration.promise;
        const n = performance.getEntriesByType('navigation')[0];
        const mark = (name) => { const m = performance.getEntriesByName(name)[0]; return m ? m.startTime : NaN; };
        const fcp = performance.getEntriesByName('first-contentful-paint')[0];
        const shown = mark('mx-initial');
        const lt = window.__longTasks.filter((t) => t.start <= shown);
        return {
          dcl: n.domContentLoadedEventEnd, load: n.loadEventEnd, fcp: fcp ? fcp.startTime : NaN, initial: shown,
          nodesBefore: window.__nodesBefore, nodesAfter: document.getElementsByTagName('*').length,
          lt: lt.length, ltMax: lt.reduce((m, t) => Math.max(m, t.ms), 0), ltTotal: lt.reduce((m, t) => m + t.ms, 0),
        };
      }));
    }
    const ms = (v) => (v == null || Number.isNaN(v) ? 'n/a' : `${v.toFixed(0)} ms`);
    for (const [i, t] of timing.entries()) {
      console.log(`load (${i ? 'warm' : 'cold'}): first paint ${ms(t.fcp)}, DOMContentLoaded ${ms(t.dcl)}, load ${ms(t.load)}, text with the nearby math shown ${ms(t.initial)}; long tasks until then ${t.lt} (longest ${t.ltMax.toFixed(0)} ms, total ${t.ltTotal.toFixed(0)} ms)`);
    }
    console.log(`DOM nodes: ${timing[1].nodesBefore.toLocaleString('en-US')} before any math is filled, ${timing[1].nodesAfter.toLocaleString('en-US')} with the starting window filled`);
    });

    // Every placeholder index must exist in the formula table.
    await stage('the formula table check', async () => {
    const tableCheck = await page.evaluate(() => {
      let total = 0;
      document.querySelectorAll('script[type="application/x-mx-math"]').forEach((el) => { total = Math.max(total, Number(el.getAttribute('data-start')) + Number(el.getAttribute('data-n'))); });
      const all = document.querySelectorAll('k-m, k-d');
      let bad = 0;
      all.forEach((el) => { const i = Number(el.getAttribute('i')); if (!(i >= 0 && i < total)) bad++; });
      return { total, placeholders: all.length, bad };
    });
    console.log(`formula table: ${tableCheck.total} distinct formulas for ${tableCheck.placeholders} placeholders`);
    if (tableCheck.bad) fail(`${tableCheck.bad} placeholder index(es) fall outside the formula table`);
    });

    // Fill everything (and stop emptying) for the overflow and font checks.
    await stage('the sideways-scroll check', async () => {
    const all = await page.evaluate(async () => { await window.MX.fillAll(); return { nodes: document.getElementsByTagName('*').length, missing: window.MX.hydration.missing, left: document.querySelectorAll('k-m:not([h]), k-d:not([h]), [h="missing"]').length }; });
    console.log(`DOM nodes with every formula filled (never the case for a reader): ${all.nodes.toLocaleString('en-US')}`);
    if (all.missing || all.left) fail(`${all.missing + all.left} formula(s) could not be filled from the table`);

    // Sideways scroll at each width, with every section drawn so that no skipped section hides an overflow.
    for (const w of WIDTHS) {
      await page.setViewport({ width: w, height: 900 });
      await page.evaluate(() => document.documentElement.classList.add('cv-off'));
      await frames(page, 3);
      const r = await page.evaluate(() => {
        const root = document.documentElement;
        const main = document.querySelector('main');
        const boxes = [...document.querySelectorAll('.tablebox, .eq-math, .svgbox, pre')].filter((el) => el.scrollWidth > el.clientWidth + 1).length;
        // Elements that stick out past the right edge of the window, outermost first, at most 12.
        const culprits = [];
        if (root.scrollWidth > root.clientWidth) {
          const edge = root.clientWidth;
          const clips = new Map();
          const clipped = (el) => {
            for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) {
              if (!clips.has(p)) clips.set(p, getComputedStyle(p).overflowX !== 'visible' && p.getBoundingClientRect().right <= edge + 0.5);
              if (clips.get(p)) return true;
            }
            return false;
          };
          for (const el of document.querySelectorAll('main *')) {
            if (culprits.length >= 12) break;
            if (el.getBoundingClientRect().right <= edge + 0.5) continue;
            if (culprits.some((c) => c.el.contains(el)) || clipped(el)) continue;
            const where = el.closest('[id]');
            culprits.push({ el, text: `${el.tagName.toLowerCase()} in #${where ? where.id : '?'}: ${(el.textContent || '').replace(/\s+/g, ' ').slice(0, 80)}` });
          }
        }
        return { client: root.clientWidth, scroll: root.scrollWidth, main: main ? Math.round(main.getBoundingClientRect().width) : 0, height: root.scrollHeight, boxes, culprits: culprits.map((c) => c.text) };
      });
      await page.evaluate(() => document.documentElement.classList.remove('cv-off'));
      const over = r.scroll > r.client;
      console.log(`width ${String(w).padStart(4)}: content ${r.scroll} of ${r.client}, text column ${r.main} px, page height ${r.height} px, inner scroll boxes ${r.boxes}${over ? '  SIDEWAYS SCROLL' : ''}`);
      for (const c of r.culprits) console.log(`    too wide: ${c}`);
      if (over) fail(`sideways page scroll at ${w} px`);
    }
    });

    // Step numbers: each steps block draws consecutive numbers down its numbered lists, also where display equations
    // split them into several lists, from 1, or from the number its first list starts at (a block that goes on from
    // an earlier one, "6. ..."). The numbers are generated by CSS counters, so they are read as drawn, from the
    // accessibility tree. Each block resets its own counter, so the blocks are copied, opened, into a small page with
    // the page's styles, and that page's accessibility tree is read once.
    await stage('the steps check', async () => {
    const copy = await page.evaluate(() => {
      const blocks = [...document.querySelectorAll('.blk-steps')].map((el, b) => {
        const c = el.cloneNode(true);
        if (c.matches('details')) c.open = true;
        c.querySelectorAll('details').forEach((d) => { d.open = true; });
        c.querySelectorAll('ol > li').forEach((li, i) => li.setAttribute('data-mx-step', `${b}.${i}`));
        // The build writes an authored start n on a list as counter-set: step n-1.
        const ol = el.querySelector('ol');
        const m = ol && /counter-set:\s*step\s+(-?\d+)/.exec(ol.getAttribute('style') || '');
        const s = el.closest('[id]');
        return { where: s ? s.id : '?', start: m ? Number(m[1]) + 1 : 1, n: c.querySelectorAll('ol > li').length, html: c.outerHTML };
      });
      return { css: [...document.querySelectorAll('style')].map((el) => el.textContent).join('\n'), blocks };
    });
    if (copy.blocks.length) {
      const probe = await browser.newPage();
      try {
        await probe.setContent(`<!doctype html><html class="cv-off"><head><meta charset="utf-8"><style>${copy.css}</style></head><body><main>${copy.blocks.map((b) => `<section class="sec">${b.html}</section>`).join('')}</main></body></html>`, { waitUntil: 'domcontentloaded' });
        const session = await probe.createCDPSession();
        const { root } = await session.send('DOM.getDocument', { depth: -1 });
        const items = new Map();
        const walk = (n) => {
          const a = n.attributes || [];
          for (let i = 0; i < a.length; i += 2) if (a[i] === 'data-mx-step') items.set(n.backendNodeId, a[i + 1]);
          for (const c of n.children || []) walk(c);
        };
        walk(root);
        const { nodes } = await session.send('Accessibility.getFullAXTree');
        const byId = new Map(nodes.map((n) => [n.nodeId, n]));
        const firstText = (n) => {
          if (!n) return null;
          const role = n.role && n.role.value;
          if (role === 'StaticText') return n.name ? String(n.name.value) : '';
          for (const id of n.childIds || []) { const t = firstText(byId.get(id)); if (t != null) return t; }
          return null;
        };
        const drawn = copy.blocks.map((b) => new Array(b.n).fill(null));
        for (const n of nodes) {
          const key = n.backendDOMNodeId != null && items.get(n.backendDOMNodeId);
          if (!key) continue;
          const [b, i] = key.split('.').map(Number);
          drawn[b][i] = firstText(n);
        }
        for (const [k, b] of copy.blocks.entries()) {
          const want = drawn[k].map((_, i) => String(b.start + i));
          if (drawn[k].join(' ') !== want.join(' ')) fail(`a steps block in #${b.where} draws ${drawn[k].map((d) => (d == null ? '?' : d)).join(', ')} instead of ${b.start} to ${b.start + b.n - 1}`);
        }
      } finally {
        await probe.close();
      }
    }
    console.log(`steps blocks checked for consecutive drawn numbers: ${copy.blocks.length}`);
    }, 120);

    // KaTeX faces: every font the math asks for must be one of the page's @font-face rules.
    await stage('the font check', async () => {
    const fontReport = await page.evaluate(() => {
      const faces = new Set();
      document.fonts.forEach((f) => faces.add(`${f.family.replace(/"/g, '')}|${f.weight === 'normal' ? '400' : f.weight === 'bold' ? '700' : f.weight}|${f.style}`));
      const want = new Map();
      for (const el of document.querySelectorAll('.katex *')) {
        if (!el.firstChild || el.firstChild.nodeType !== 3 || !el.textContent.trim()) continue;
        const cs = getComputedStyle(el);
        const fam = cs.fontFamily.split(',')[0].trim().replace(/"/g, '');
        if (!fam.startsWith('KaTeX')) continue;
        const key = `${fam}|${cs.fontWeight}|${cs.fontStyle}`;
        if (!want.has(key)) want.set(key, el.textContent.slice(0, 12));
      }
      return { faces: [...faces], missing: [...want].filter(([k]) => !faces.has(k)) };
    });
    console.log(`KaTeX faces inlined: ${fontReport.faces.filter((f) => f.startsWith('KaTeX')).length}`);
    for (const [k, sample] of fontReport.missing) fail(`math uses KaTeX face ${k} (e.g. "${sample}") but the page does not inline it`);
    });

    const fresh = async () => { await page.goto(url, { waitUntil: 'load' }); await page.evaluate(() => window.MX.hydration.promise); };
    if (!args.skipScroll) {
    // Scroll measurements, each from a fresh load, at every CPU slowdown asked for (default 1x and 4x).
    let figStats = [];
    for (const cpu of args.cpus) {
      const tag = cpu > 1 ? ` at ${cpu}x CPU slowdown` : ' at full CPU speed';
      await stage(`the scroll tests${tag}`, async () => {
      await page.setViewport({ width: 1240, height: 900 });
      // A steady reading scroll: 1,500 px per second for 8 seconds, moved every animation frame.
      await fresh();
      await throttle(cpu);
      const steady = await page.evaluate(() => new Promise((resolve) => {
        const before = window.__longTasks.length;
        const deltas = [];
        const t0 = performance.now();
        let last = t0;
        let y = 0;
        let peak = 0;
        let unfilled = 0;
        let n = 0;
        const step = (t) => {
          deltas.push(t - last);
          y += 1.5 * (t - last);
          last = t;
          scrollTo(0, y);
          if (++n % 15 === 0) { peak = Math.max(peak, document.getElementsByTagName('*').length); unfilled += window.MX.windowFilled(0) ? 1 : 0; }
          if (t - t0 < 8000) { requestAnimationFrame(step); return; }
          const lt = window.__longTasks.slice(before).filter((e) => e.start >= t0);
          const sorted = deltas.slice(1).sort((a, b) => a - b);
          resolve({ px: Math.round(y), frames: sorted.length, slow: sorted.filter((d) => d > 50).length, p95: sorted[Math.floor(sorted.length * 0.95)] || 0, worst: sorted[sorted.length - 1] || 0, longTasks: lt.length, longest: lt.reduce((m, e) => Math.max(m, e.ms), 0), peak, unfilled });
        };
        requestAnimationFrame((t) => { last = t; requestAnimationFrame(step); });
      }));
      console.log(`steady scroll${tag}: ${steady.px} px in 8 s; frames ${steady.frames}, over 50 ms ${steady.slow} (${(100 * steady.slow / Math.max(1, steady.frames)).toFixed(1)}%), 95th percentile ${steady.p95.toFixed(1)} ms, worst ${steady.worst.toFixed(0)} ms; long tasks ${steady.longTasks} (longest ${steady.longest.toFixed(0)} ms); peak DOM nodes ${steady.peak.toLocaleString('en-US')}; samples with unfilled math on screen ${steady.unfilled}`);
      // Limits at 4x. The worst frame may reach 200 ms: the browser draws the math of a section's first units in the
      // frame in which the section reaches the window, 100 to 180 ms at 4x; the ways of splitting that work tried so
      // far give more frames over 50 ms (build/lib/render.mjs, "Units"; 2026-11-21 and 2026-11-23). At most 3% of
      // frames over 50 ms keeps the relaxed worst frame from hiding a regression.
      if (cpu >= 4 && steady.p95 > 33.4) fail(`steady scroll${tag} has a 95th-percentile frame of ${steady.p95.toFixed(1)} ms (limit 33 ms)`);
      if (cpu >= 4 && steady.worst > 200) fail(`steady scroll${tag} has a ${steady.worst.toFixed(0)} ms frame (limit 200 ms)`);
      if (cpu >= 4 && steady.slow > 0.03 * steady.frames) fail(`steady scroll${tag} has ${steady.slow} of ${steady.frames} frames over 50 ms (limit 3%)`);

      // A jump scroll through the whole page: 85% of a window every 48 ms.
      await throttle(1);
      await fresh();
      await throttle(cpu);
      const jump = await page.evaluate(async () => {
        const t0 = performance.now();
        const before = window.__longTasks.length;
        const deltas = [];
        let last = performance.now();
        let running = true;
        const loop = (t) => { deltas.push(t - last); last = t; if (running) requestAnimationFrame(loop); };
        requestAnimationFrame(loop);
        const step = Math.round(innerHeight * 0.85);
        let steps = 0;
        let peak = 0;
        let lagging = 0;
        while (scrollY + innerHeight < document.documentElement.scrollHeight - 2 && steps < 5000) {
          scrollBy(0, step);
          steps++;
          await new Promise((r) => setTimeout(r, 48));
          if (window.MX.windowFilled(0)) lagging++;
          if (steps % 5 === 0) peak = Math.max(peak, document.getElementsByTagName('*').length);
        }
        await new Promise((r) => setTimeout(r, 300));
        running = false;
        const lt = window.__longTasks.slice(before).filter((t) => t.start >= t0);
        const sorted = deltas.slice(1).sort((a, b) => a - b);
        return {
          ms: performance.now() - t0, steps, peak, lagging, longTasks: lt.length, longest: lt.reduce((m, t) => Math.max(m, t.ms), 0), longTotal: lt.reduce((s, t) => s + t.ms, 0),
          frames: sorted.length, slowFrames: sorted.filter((d) => d > 50).length, p95: sorted[Math.floor(sorted.length * 0.95)] || 0, worst: sorted[sorted.length - 1] || 0,
          figs: window.Kit && window.Kit.stats ? window.Kit.stats() : [],
        };
      });
      console.log(`jump scroll${tag}: ${jump.steps} steps in ${(jump.ms / 1000).toFixed(1)} s; long tasks ${jump.longTasks} (longest ${jump.longest.toFixed(0)} ms, total ${jump.longTotal.toFixed(0)} ms); frames ${jump.frames}, over 50 ms ${jump.slowFrames}, 95th percentile ${jump.p95.toFixed(1)} ms, worst ${jump.worst.toFixed(0)} ms; peak DOM nodes ${jump.peak.toLocaleString('en-US')}; steps with unfilled math on screen 48 ms after the jump ${jump.lagging}`);

      // Scroll stops: at 25 places through the page, everything on screen and half a screen around it is filled
      // 400 ms after the stop.
      const stops = await page.evaluate(async () => {
        const H = document.documentElement.scrollHeight - innerHeight;
        const bad = [];
        for (let k = 0; k < 25; k++) {
          scrollTo(0, Math.round(H * k / 24));
          await new Promise((r) => setTimeout(r, 400));
          const n = window.MX.windowFilled(0.5);
          if (n) bad.push(`${Math.round(H * k / 24)} px: ${n}`);
        }
        return bad;
      });
      await throttle(1);
      console.log(`scroll stops${tag}: ${25 - stops.length} of 25 with every nearby formula filled`);
      for (const b of stops) fail(`unfilled math near the window 400 ms after a stop${tag}, at ${b}`);

      // Figures far from the window are paused and hold no canvas memory. A figure starts only once the reader
      // stops near it, so one met at the last stops may still be setting up: the first sample waits a second.
      await new Promise((r) => setTimeout(r, 1000));
      const far = await page.evaluate(() => (window.Kit && window.Kit.figures ? window.Kit.figures.filter((f) => f.ready).map((f) => {
        const r = f.el.getBoundingClientRect();
        const away = r.bottom < -8 * innerHeight || r.top > 9 * innerHeight;
        return { id: f.id, away, px: f.canvas.width * f.canvas.height, frames: f.stats.frames };
      }) : []));
      await new Promise((r) => setTimeout(r, 1000));
      const frames2 = new Map(await page.evaluate(() => (window.Kit && window.Kit.figures ? window.Kit.figures.filter((f) => f.ready).map((f) => [f.id, f.stats.frames]) : [])));
      const awayFigs = far.filter((f) => f.away);
      const holding = awayFigs.filter((f) => f.px > 1);
      const drawing = awayFigs.filter((f) => frames2.get(f.id) !== f.frames);
      console.log(`figures: ${far.length} initialized, ${awayFigs.length} far from the window, ${holding.length} of those holding canvas memory, ${drawing.length} still drawing`);
      for (const f of holding) fail(`figure ${f.id} is far from the window but holds a ${f.px} px canvas`);
      for (const f of drawing) fail(`figure ${f.id} is far from the window but still draws`);
      figStats = jump.figs;
      });
    }
    // Figures met during the last jump scroll: setup, and steady frames if any (a figure scrolled past draws only a few).
    for (const f of figStats) console.log(`  figure ${f.id} (${f.name}): ${f.ready ? `labels ${(f.prepareMs || 0).toFixed(1)} ms, init ${f.initMs.toFixed(1)} ms, first frame ${(f.firstMs || 0).toFixed(1)} ms, ${f.steadyN || 0} steady frames${f.steadyN ? ` (median ${f.medianMs.toFixed(2)} ms, 95th percentile ${f.p95Ms.toFixed(2)} ms)` : ''}` : 'never initialized'}`);
    if (figStats.length && figStats[0].pageSetupMs != null) console.log(`  kit page setup ${figStats[0].pageSetupMs.toFixed(1)} ms, once`);

    // Emptying and refilling far chapters does not move the page. A cold jump to the middle of the page (its size
    // never measured before), a wait while the chapters near the start are emptied, a jump to the end and back (the
    // middle is emptied and refilled), and a wait again: the target and the scroll-spy must stay put.
    await stage('the stability test', async () => {
    await page.setViewport({ width: 1240, height: 900 });
    await fresh();
    const stability = await page.evaluate(async () => {
      const secs = [...document.querySelectorAll('section.sec[id]')];
      const target = secs[Math.floor(secs.length / 2)];
      const wait = (ms) => new Promise((r) => setTimeout(r, ms));
      const spy = () => { const c = document.querySelector('nav.index .idx-ch.cur'); return c ? c.getAttribute('data-ch') : null; };
      const out = { id: target.id };
      window.MX.goTo(target.id, false);
      await wait(800);
      out.a = target.getBoundingClientRect().top; out.spyA = spy(); out.yA = scrollY;
      const e0 = window.MX.hydration.emptied;
      await wait(3500);
      out.b = target.getBoundingClientRect().top; out.spyB = spy(); out.emptied1 = window.MX.hydration.emptied - e0;
      window.MX.goTo(secs[secs.length - 1].id, false);
      await wait(3500);
      const e1 = window.MX.hydration.emptied;
      window.MX.goTo(target.id, false);
      await wait(800);
      out.c = target.getBoundingClientRect().top; out.spyC = spy();
      await wait(3500);
      out.d = target.getBoundingClientRect().top; out.spyD = spy(); out.emptied2 = window.MX.hydration.emptied - e1;
      out.want = target.getAttribute('data-ch');
      return out;
    });
    const st = stability;
    console.log(`stability at #${st.id}: top ${st.a.toFixed(1)} px after a cold jump, ${st.b.toFixed(1)} px after ${st.emptied1} formulas far away were emptied; ${st.c.toFixed(1)} px after a jump to the end and back, ${st.d.toFixed(1)} px after ${st.emptied2} more were emptied; scroll-spy chapter ${st.spyA}, ${st.spyB}, ${st.spyC}, ${st.spyD} (expected ${st.want})`);
    if (Math.abs(st.b - st.a) > 1 || Math.abs(st.d - st.c) > 1) fail('emptying far chapters moved the page');
    if (!(st.a > -3 && st.a < 40) || !(st.c > -3 && st.c < 40)) fail(`jump to #${st.id} landed off target`);
    if ([st.spyA, st.spyB, st.spyC, st.spyD].some((c) => c !== st.want)) fail('the scroll-spy moved while far chapters were emptied or refilled');
    });

    // Anchor jumps: the last section, and the last figure and numbered equation, must land at the top of the window.
    await stage('the anchor and scroll-spy tests', async () => {
    const targets = await page.evaluate(() => {
      const pick = (sel) => { const all = document.querySelectorAll(sel); return all.length ? all[all.length - 1].id : null; };
      const mid = (sel) => { const all = document.querySelectorAll(sel); return all.length ? all[Math.floor(all.length / 2)].id : null; };
      return [...new Set([pick('section.sec[id]'), pick('figure[id]'), pick('.eq[id]'), mid('.card[id], .thm[id]'), mid('section.sec[id]')].filter(Boolean))];
    });
    await page.evaluate(() => scrollTo(0, 0));
    for (const id of targets) {
      await page.evaluate((i) => window.MX.goTo(i, false), id);
      await sleep(400);
      await frames(page, 12);
      const top = await page.evaluate((i) => document.getElementById(i).getBoundingClientRect().top, id);
      const ok = top > -3 && top < 40;
      console.log(`anchor #${id}: lands ${top.toFixed(0)} px from the top${ok ? '' : '  OFF TARGET'}`);
      if (!ok) fail(`jump to #${id} lands ${top.toFixed(0)} px from the top`);
      await page.evaluate(() => scrollTo(0, 0));
    }


    // Scroll-spy: after a jump to the last section, the index marks its chapter.
    if (targets[0]) {
      await page.evaluate((i) => window.MX.goTo(i, false), targets[0]);
      await sleep(400);
      await frames(page, 12);
      const spy = await page.evaluate((i) => {
        const sec = document.getElementById(i);
        const cur = document.querySelector('nav.index .idx-ch.cur');
        return { want: sec.getAttribute('data-ch'), got: cur ? cur.getAttribute('data-ch') : null };
      }, targets[0]);
      console.log(`scroll-spy after the jump: chapter ${spy.got} marked, chapter ${spy.want} expected`);
      if (spy.got !== spy.want) fail(`scroll-spy marks chapter ${spy.got} instead of ${spy.want}`);
    }
    });
    } // end of the scroll, stability, anchor, and scroll-spy tests

    if (args.terms) await stage('the term listing', async () => {
      const lines = await page.evaluate(() => {
        const data = JSON.parse(document.getElementById('glossary-data').textContent);
        return [...document.querySelectorAll('.term')].map((el) => {
          let before = '', after = '';
          for (let n = el.previousSibling; n && before.length < 50; n = n.previousSibling) before = n.textContent + before;
          for (let n = el.nextSibling; n && after.length < 50; n = n.nextSibling) after += n.textContent;
          const owner = el.closest('[id]');
          const t = data[Number(el.getAttribute('data-k'))];
          return `${owner ? owner.id : '?'} | ${t ? t.t : '?'} | ${before.replace(/\s+/g, ' ').slice(-50)}[${el.textContent}]${after.replace(/\s+/g, ' ').slice(0, 50)}`;
        });
      });
      console.log(`\nunderlined terms: ${lines.length}`);
      for (const l of lines) console.log(`  ${l}`);
    });

    fs.mkdirSync(args.out, { recursive: true });
    if (args.ids.length) {
      await page.setViewport({ width: args.captureWidth, height: CAPTURE_HEIGHT });
      for (const id of args.ids) await stage(`the capture of #${id}`, async () => {
        const exists = await page.evaluate((i) => Boolean(document.getElementById(i)), id);
        if (!exists) { fail(`no element with id "${id}"`); return; }
        await page.evaluate((i) => window.MX.goTo(i, false), id);
        await frames(page, 12);
        await sleep(900);
        const file = path.join(args.out, `${id}-${args.captureWidth}.png`);
        await page.screenshot({ path: file });
        console.log(`capture ${path.relative(ROOT, file)}`);
      });
    }

    if (args.figures) {
      const t0 = Date.now();
      let ids = [];
      const setup = new Map();
      // Setup at 4x, as a reader meets it: from 2.5 windows above the figure, with the page settled at full speed,
      // the page is scrolled down 5% of a window per frame at 4x until the figure has started and drawn once.
      const measureSetup = async (id) => {
        const y0 = await page.evaluate((i) => Math.max(0, document.getElementById(i).getBoundingClientRect().top + scrollY - 2.5 * innerHeight), id);
        await page.evaluate((y) => { document.dispatchEvent(new Event('pointerdown')); scrollTo(0, y); }, y0);
        await sleep(700);
        await throttle(4);
        await page.evaluate((i) => new Promise((resolve) => {
          const el = document.getElementById(i), v = el.querySelector('.viz');
          let n = 0;
          const step = () => {
            const f = window.Kit && window.Kit.figures.find((x) => x.el === v);
            if ((f && f.ready && f.stats.frames > 0) || v.getAttribute('data-state') === 'error' || n++ > 600) { resolve(); return; }
            const top = el.getBoundingClientRect().top;
            if (top > 0.3 * innerHeight) scrollBy(0, Math.min(0.05 * innerHeight, top - 0.3 * innerHeight));
            requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }), id);
        await throttle(1);
        return page.evaluate((i) => {
          const v = document.querySelector(`#${CSS.escape(i)} .viz`);
          const k = window.Kit.figures.findIndex((x) => x.el === v);
          return k < 0 ? null : window.Kit.stats()[k];
        }, id);
      };
      await stage('the figure setup measurement', async () => {
      // A fresh load, so that no figure has started yet.
      await page.setViewport({ width: 1240, height: 900 });
      await page.goto(url, { waitUntil: 'load' });
      await page.evaluate(() => window.MX.hydration.promise);
      // Real figure modules only (placeholders and static SVGs have no .viz), optionally only the named ones.
      ids = await page.evaluate((names) => [...document.querySelectorAll('figure.fig[id]')]
        .filter((f) => f.querySelector('.viz[data-viz]'))
        .filter((f) => !names.length || names.includes(f.id) || names.includes(f.querySelector('.viz').getAttribute('data-viz')))
        .map((f) => f.id), args.figureNames);
      for (const id of ids) await stage(`the setup measurement of figure #${id}`, async () => { setup.set(id, await measureSetup(id)); });
      });
      console.log(`capturing ${ids.length} figure(s)`);
      for (const w of [400, 1920]) {
        await page.setViewport({ width: w, height: 1000 });
        for (const theme of ['light', 'dark']) {
          await page.evaluate((t) => window.MX.setTheme(t, false), theme);
          for (const id of ids) await stage(`the capture of figure #${id} at ${w} px, ${theme}`, async () => {
            await page.evaluate((i) => window.MX.goTo(i, false), id);
            const state = await page.waitForFunction((i) => {
              const v = document.querySelector(`#${CSS.escape(i)} .viz`);
              return !v || v.getAttribute('data-state') === 'ready' || v.getAttribute('data-state') === 'error';
            }, { timeout: 8000 }, id).then(() => 'ok', () => 'timeout');
            if (state === 'timeout') fail(`figure #${id} did not initialize within 8 s`);
            // Wait until the canvas has its final size and the figure has drawn at that size, then let it run a moment.
            const drawn = await page.waitForFunction((i) => {
              const v = document.querySelector(`#${CSS.escape(i)} .viz`);
              const fig = window.Kit && window.Kit.figures.find((x) => x.el === v);
              if (!fig || !fig.ready) return false;
              const want = Math.round(v.getBoundingClientRect().width * Math.min(2, devicePixelRatio));
              if (Math.abs(fig.canvas.width - want) > 1 || fig.released) { window.Kit.schedule(); return false; }
              // A resize marks the figure dirty; a drawn frame clears it.
              // An animating figure may be dirty again at every sample; two frames drawn at this size also count.
              window.__sized = window.__sized || new Map();
              if (!window.__sized.has(fig)) window.__sized.set(fig, fig.stats.frames);
              if (fig.dirty) window.Kit.schedule();
              const ok = (!fig.dirty && fig.stats.frames > 0) || fig.stats.frames >= window.__sized.get(fig) + 2;
              if (ok) window.__sized.delete(fig);
              return ok;
            }, { timeout: 8000, polling: 'raf' }, id).then(() => 'ok', () => 'timeout');
            if (drawn === 'timeout') fail(`figure #${id} did not draw at its final size within 8 s`);
            await sleep(300);
            // A viewport capture of the figure where it is on screen: an element capture can resize the page and clear
            // the canvas while the image is taken.
            // The page holds a jump's target in place until the reader acts; a pointerdown stands for that act.
            await page.evaluate((i) => { document.dispatchEvent(new Event('pointerdown')); document.getElementById(i).scrollIntoView({ block: 'center' }); }, id);
            await frames(page, 3);
            const box = await page.evaluate((i) => {
              const r = document.getElementById(i).getBoundingClientRect();
              const top = Math.max(0, r.top), bottom = Math.min(innerHeight, r.bottom);
              // Puppeteer takes the clip in page coordinates.
              return { x: Math.max(0, r.left) + scrollX, y: top + scrollY, width: Math.min(innerWidth, r.right) - Math.max(0, r.left), height: bottom - top };
            }, id);
            const file = path.join(args.out, `fig-${id}-${w}-${theme}.png`);
            if (!(box.width > 0 && box.height > 0)) { fail(`figure #${id} is not on screen for its capture`); return; }
            await page.screenshot({ path: file, clip: box, captureBeyondViewport: false });
            console.log(`capture ${path.relative(ROOT, file)}`);
          });
        }
      }
      await page.evaluate(() => window.MX.setTheme(null, false));
      console.log(`figure captures took ${((Date.now() - t0) / 1000).toFixed(0)} s`);

      // Frame cost. Each figure in the middle of a 1240 px window: setup (the kit's page setup once, the figure's
      // canvas and math labels, the module's init, its first frame) apart from steady frames. "animate": its players
      // play and it draws every frame for FRAMES frames; "drag": its first draggable point moves along a short path,
      // one step per frame. The median and 95th percentile of those frames' draw times (Kit.stats), at 1x and 4x CPU
      // slowdown; the limits are in the header of this file.
      const t1 = Date.now();
      const FRAMES = 40;
      await page.setViewport({ width: 1240, height: 900 });
      const rows = [];
      const measureFrames = async (id) => {
        await page.evaluate((i) => window.MX.goTo(i, false), id);
        await page.waitForFunction((i) => {
          const v = document.querySelector(`#${CSS.escape(i)} .viz`);
          const f = window.Kit && window.Kit.figures.find((x) => x.el === v);
          return Boolean(f && f.ready && !f.released && f.stats.frames > 0);
        }, { timeout: 8000, polling: 'raf' }, id).catch(() => {});
        await page.evaluate((i) => { document.dispatchEvent(new Event('pointerdown')); document.getElementById(i).scrollIntoView({ block: 'center' }); }, id);
        await frames(page, 4);
        const row = { id };
        for (const cpu of [1, 4]) {
          await throttle(cpu);
          row[cpu] = await page.evaluate((i, n) => new Promise((resolve) => {
            const v = document.querySelector(`#${CSS.escape(i)} .viz`);
            const fig = window.Kit.figures.find((x) => x.el === v);
            if (!fig || !fig.ready) { resolve(null); return; }
            const k0 = window.Kit.figures.indexOf(fig);
            const read = () => window.Kit.stats()[k0];
            const out = { name: fig.name };
            const phase = (step, done) => {
              window.Kit.resetStats();
              let k = 0;
              const tick = () => {
                step(k);
                if (++k < n) { requestAnimationFrame(tick); return; }
                requestAnimationFrame(() => requestAnimationFrame(() => { const s = read(); done({ n: s.steadyN, med: s.medianMs, p95: s.p95Ms, max: s.steadyMaxMs }); }));
              };
              requestAnimationFrame(tick);
            };
            phase((k) => { if (k === 0) fig.players.forEach((p) => { if (!p.playing) p.play(); }); fig.redraw(); }, (a) => {
              out.animate = a;
              const h = fig.drags.find((d) => !d.hidden && !d.disabled);
              const finish = () => { const s = read(); out.init = s.initMs; out.first = s.firstMs; out.page = s.pageSetupMs; fig.reset(); resolve(out); };
              if (!h) { finish(); return; }
              const P = h.plane, x0 = h.x, y0 = h.y, ax = (P.v.x1 - P.v.x0) * 0.08, ay = (P.v.y1 - P.v.y0) * 0.08;
              fig.activeDrag = h;
              if (h.onStart) h.onStart(h.x, h.y);
              phase((k) => { const t = 2 * Math.PI * k / n; h.set(x0 + ax * Math.sin(t), y0 + ay * Math.sin(2 * t)); }, (d) => {
                out.drag = d;
                fig.activeDrag = null;
                if (h.onEnd) h.onEnd(h.x, h.y);
                finish();
              });
            });
          }), id, FRAMES);
        }
        await throttle(1);
        return row;
      };
      for (const id of ids) await stage(`the frame measurement of figure #${id}`, async () => { rows.push({ ...(await measureFrames(id)), setup: setup.get(id) }); });
      const f2 = (v) => (v == null ? 'n/a' : v.toFixed(2));
      const ph = (r, k) => (r && r[k] ? `${f2(r[k].med)} / ${f2(r[k].p95)} ms (${r[k].n} frames)` : 'none');
      console.log(`figure frame costs (median / 95th percentile of steady frames), measured in ${((Date.now() - t1) / 1000).toFixed(0)} s`);
      if (rows.length && rows[0][1]) console.log(`  kit page setup ${f2(rows[0][1].page)} ms, once per page, in idle time`);
      const line = (r) => {
        const su = r.setup || {};
        return `setup at 4x: labels ${f2(su.prepareMs)} ms, init ${f2(su.initMs)} ms, first frame ${f2(su.firstMs)} ms; animate 1x ${ph(r[1], 'animate')}, 4x ${ph(r[4], 'animate')}${r[1].drag ? `; drag 1x ${ph(r[1], 'drag')}, 4x ${ph(r[4], 'drag')}` : ''}`;
      };
      const breaches = (r) => {
        const su = r.setup || {}, out = [];
        const med1 = Math.max(r[1].animate ? r[1].animate.med : 0, r[1].drag ? r[1].drag.med : 0);
        const p95 = Math.max(r[4] && r[4].animate ? r[4].animate.p95 : 0, r[4] && r[4].drag ? r[4].drag.p95 : 0);
        const task = Math.max(su.prepareMs || 0, su.initMs || 0, su.firstMs || 0);
        if (med1 > 4) out.push(`a median frame of ${med1.toFixed(2)} ms at full speed (limit 4 ms)`);
        if (p95 > 16) out.push(`a 95th-percentile frame of ${p95.toFixed(2)} ms at 4x (limit 16 ms)`);
        if (task > 50) out.push(`a ${task.toFixed(0)} ms setup task at 4x (limit 50 ms)`);
        return out;
      };
      // A figure over a limit is measured once more, alone on a fresh load, and fails only if it is over a limit again.
      // On the 4-core desktop these pages are checked on, one full run at 4x puts one to three figures over a limit by
      // chance: in four runs on 2026-11-23, ten figures went over once (a setup task up to 102 ms, a 95th-percentile
      // frame up to 19.6 ms), a different set each run, and each was within every limit in the other three runs. A
      // figure that is over every time, as padic-tree's first frame was before its fonts were warmed (45 to 62 ms on
      // every load), still fails.
      for (const r of rows) {
        if (!r[1]) { fail(`figure #${r.id} could not be measured (it never became ready)`); continue; }
        console.log(`  figure ${r.id} (${r[1].name}): ${line(r)}`);
        let over = breaches(r);
        if (!over.length) continue;
        await stage(`the second measurement of figure #${r.id}`, async () => {
          await page.setViewport({ width: 1240, height: 900 });
          await page.goto(url, { waitUntil: 'load' });
          await page.evaluate(() => window.MX.hydration.promise);
          const su = await measureSetup(r.id);
          const again = { ...(await measureFrames(r.id)), setup: su };
          if (!again[1]) { over = ['no second measurement (it never became ready)']; return; }
          console.log(`    over a limit (${over.join('; ')}); measured again on a fresh load: ${line(again)}`);
          over = breaches(again);
        });
        for (const m of over) fail(`figure #${r.id} (${r[1].name}) has ${m}`);
      }
    }

    if (requests.length) fail(`${requests.length} network request(s): ${[...new Set(requests)].slice(0, 5).join(', ')}`);
    if (consoleErrors.length) for (const e of [...new Set(consoleErrors)]) fail(`console error: ${e}`);
  } finally {
    await browser.close();
  }
  if (failures.length) {
    console.log(`\n${failures.length} failure(s):`);
    for (const f of failures) console.log(`  ${f}`);
  } else {
    console.log('\nall checks passed');
  }
  process.exit(failures.length ? 1 : 0);
}

main().catch((err) => { console.error(`error: ${err.stack || err.message}`); process.exit(1); });
