// Assembles the single-file page from the rendered parts and the shared template, styles, runtime, and figure kit.

import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { escapeHtml } from './render.mjs';

const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
const roman = (n) => ROMAN[n - 1] || String(n);

// JSON inside a script element: "<" is escaped so that no "</script>" can end the element early.
export function scriptJson(value) {
  return JSON.stringify(value).replace(/</g, '\\u003c').replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029');
}

function inlineScript(code) {
  if (/<\/script/i.test(code)) throw new Error('an inlined script contains "</script"');
  return code;
}

function fill(template, values) {
  return template.replace(/\{\{(\w+)\}\}/g, (all, key) => {
    if (!(key in values)) throw new Error(`template placeholder {{${key}}} has no value`);
    return values[key];
  });
}

function refHtml(n, key, entry) {
  const parts = [];
  if (entry.authors) parts.push(`${escapeHtml(entry.authors)}.`);
  if (entry.title) parts.push(`<i>${escapeHtml(entry.title)}</i>.`);
  const tail = [entry.where, entry.year].filter((x) => x != null && x !== '').map((x) => escapeHtml(String(x))).join(', ');
  if (tail) parts.push(`${tail}.`);
  if (entry.url) parts.push(`<a class="ref-url" href="${escapeHtml(entry.url)}" rel="noopener">${escapeHtml(entry.url)}</a>`);
  return `<li id="ref-${key}"><span class="ref-n">[${n}]</span><span class="ref-body">${parts.join(' ')}</span></li>`;
}

export function assemblePage({ problem, chapters, notation, ctx, lede, sources, glossaryData, viz, kitFiles, sharedDir }) {
  const parts = problem.parts || [];

  // Index: parts, then chapters, then sections.
  let index = '<details id="idx" data-mc="@MC@"><summary>Contents</summary>';
  index += '<script>if(matchMedia("(min-width: 881px)").matches)document.getElementById("idx").open=true</script>';
  let lastPart = null;
  for (const ch of chapters) {
    if (ch.front.part !== lastPart) {
      if (lastPart !== null) index += '</ol></div>';
      lastPart = ch.front.part;
      index += `<div class="idx-part"><h4><span>Part ${roman(lastPart)}</span>${escapeHtml(parts[lastPart - 1] || '')}</h4><ol>`;
    }
    const secs = ch.sections.map((s) => `<li><a href="#${s.id}" data-sec="${s.id}"><span class="n">${s.num}</span><span>${s.entry.text}</span></a></li>`).join('');
    index += `<li class="idx-ch" data-ch="${ch.num}"><a href="#${ch.front.id}" class="idx-ch-link"><span class="n">${ch.num}</span><span>${escapeHtml(ch.front.title)}</span></a>${secs ? `<ol class="idx-secs">${secs}</ol>` : ''}</li>`;
  }
  if (lastPart !== null) index += '</ol></div>';
  index += '<div class="idx-part"><h4><span>Appendix</span>Reference</h4><ol>';
  if (notation) index += '<li class="idx-ch" data-ch="N"><a href="#notation" class="idx-ch-link"><span class="n">A</span><span>Notation</span></a></li>';
  index += '<li class="idx-ch" data-ch="R"><a href="#references" class="idx-ch-link"><span class="n">B</span><span>References</span></a></li>';
  index += '</ol></div></details>';

  // Chapters, each preceded by its part's divider when the part changes.
  let main = '';
  lastPart = null;
  chapters.forEach((ch, i) => {
    if (ch.front.part !== lastPart) {
      lastPart = ch.front.part;
      main += `<div class="part-head" id="part-${lastPart}"><span class="part-no">Part ${roman(lastPart)}</span><span class="part-title">${escapeHtml(parts[lastPart - 1] || '')}</span></div>\n`;
    }
    const needs = (ch.front.needs || []).map((id) => {
      const target = chapters.find((c) => c.front.id === id);
      return target ? `<a href="#${id}">${target.num}. ${escapeHtml(target.front.title)}</a>` : '';
    }).filter(Boolean);
    const prev = chapters[i - 1];
    const next = chapters[i + 1];
    main += `<article class="chapter" id="${ch.front.id}" data-ch="${ch.num}" data-mc="@MC@">
<header class="ch-head" data-ch="${ch.num}" data-sec="">
<p class="ch-eyebrow">Chapter ${ch.num}</p>
<h2 class="ch-title">${escapeHtml(ch.front.title)}</h2>
<p class="ch-summary">${ctx.md.renderInline(String(ch.front.summary || ''), ctx.renderEnv(ch, { noTerms: 1 }))}</p>
${needs.length ? `<p class="ch-needs">Builds on ${needs.join(', ')}</p>` : ''}
</header>
${ch.html}
<nav class="ch-nav" aria-label="Chapter navigation">${prev ? `<a class="prev" href="#${prev.front.id}"><span>Previous</span>${prev.num}. ${escapeHtml(prev.front.title)}</a>` : '<span></span>'}${next ? `<a class="next" href="#${next.front.id}"><span>Next</span>${next.num}. ${escapeHtml(next.front.title)}</a>` : ''}</nav>
</article>\n`;
  });

  if (notation) {
    main += `<article class="chapter appendix" id="notation" data-ch="N" data-mc="@MC@"><header class="ch-head" data-ch="N" data-sec=""><p class="ch-eyebrow">Appendix A</p><h2 class="ch-title">Notation</h2><p class="ch-summary">Every symbol on the page has one meaning, listed here.</p></header><section class="sec sec-plain" data-ch="N" data-sec="">${notation.html}</section></article>\n`;
  }

  const refs = [...ctx.references.entries()].sort((a, b) => ctx.citeOrder.get(a[0]) - ctx.citeOrder.get(b[0]));
  main += `<article class="chapter appendix" id="references" data-ch="R" data-mc="@MC@"><header class="ch-head" data-ch="R" data-sec=""><p class="ch-eyebrow">Appendix B</p><h2 class="ch-title">References</h2></header><section class="sec sec-plain" data-ch="R" data-sec=""><ol class="refs">${refs.map(([key, entry]) => refHtml(ctx.citeOrder.get(key), key, entry)).join('\n')}</ol></section></article>\n`;

  // Lede and sources.
  const sourceList = sources.map((s) => `<a href="#ref-${s.key}">${escapeHtml(s.entry.authors)}, <i>${escapeHtml(s.entry.title)}</i></a>${s.read ? `, read ${escapeHtml(s.read)}` : ''}`);
  const header = `${problem.subtitle ? `<p class="subtitle">${escapeHtml(problem.subtitle)}</p>` : ''}
<div class="lede" data-mc="@MC@">${lede}${sourceList.length ? `<p class="sources"><b>Sources.</b> ${sourceList.join('; ')}.</p>` : ''}<p class="howto">The contents stay beside the text on a wide screen. Underlined terms open their definitions, and every figure can be played or moved.</p></div>`;

  // Styles: KaTeX (only the fonts in use) and the shared stylesheet.
  const math = ctx.math.css();
  const style = fs.readFileSync(path.join(sharedDir, 'style.css'), 'utf8');
  const css = math.css + '\n' + style;

  // Scripts: the runtime, and, if any figure uses the kit, the kit and each figure module once (packed below).
  const runtime = fs.readFileSync(path.join(sharedDir, 'runtime.js'), 'utf8');
  const vizModules = viz.modules && viz.modules.length ? viz.modules : null;
  const kitText = vizModules ? kitFiles.map((f) => fs.readFileSync(f, 'utf8')).join('\n') : '';

  const template = fs.readFileSync(path.join(sharedDir, 'template.html'), 'utf8');

  // Shorten KaTeX's class names in the markup and in the stylesheet together. Every word that the page's own
  // styles, template, or scripts contain keeps its name.
  const keep = new Set(['katex', 'katex-display', 'katex-html']);
  const ownCode = [style, runtime, template, ...kitFiles.map((f) => fs.readFileSync(f, 'utf8')), ...(viz.modules || []).map((m) => m.code)];
  for (const src of ownCode) for (const m of src.matchAll(/[A-Za-z_][\w-]*/g)) keep.add(m[0]);
  const classMap = ctx.math.classMap(keep);
  const renameNames = (names) => names.split(' ').map((n) => classMap.get(n) || n).join(' ');
  // class="..." in markup, and class=\"...\" inside JSON strings.
  const renameAttr = (text) => text
    .replace(/class="([^"\\]*)"/g, (all, names) => `class="${renameNames(names)}"`)
    .replace(/class=\\"([^"\\]*)\\"/g, (all, names) => `class=\\"${renameNames(names)}\\"`);
  const renameCss = (text) => text.replace(/\.([A-Za-z_][\w-]*)/g, (all, n) => (classMap.has(n) ? `.${classMap.get(n)}` : all));
  const description = problem.subtitle || problem.title || '';

  // The kit, each module's code, and each module's math labels, deflate-compressed like the formula table: the
  // runtime unpacks and runs the kit when the page loads, and the kit unpacks a module and its labels when its figure
  // first comes near the window. Labels are renamed before they are packed.
  const pack = (text) => zlib.deflateRawSync(Buffer.from(text, 'utf8'), { level: 9 }).toString('base64');
  let vizScripts = '';
  let vizData = '';
  const vizSizes = { kit: 0, kitRaw: 0, modules: 0, modulesRaw: 0, labels: 0, labelsRaw: 0 };
  if (vizModules) {
    const kitPacked = pack(kitText);
    vizSizes.kitRaw = Buffer.byteLength(kitText);
    vizSizes.kit = kitPacked.length;
    const mods = vizModules.map((m) => {
      const code = `/* ${m.name} */\n${m.code}`;
      const packed = pack(code);
      vizSizes.modulesRaw += Buffer.byteLength(code);
      vizSizes.modules += packed.length;
      return `<script type="application/x-mx-viz" data-viz="${m.name}">${packed}</script>`;
    });
    vizScripts = `<script type="application/x-mx-viz" data-part="kit">${kitPacked}</script>\n${mods.join('\n')}`;
    vizData = vizModules.map((m) => {
      const json = renameAttr(JSON.stringify(m.tex));
      const packed = pack(json);
      vizSizes.labelsRaw += Buffer.byteLength(json);
      vizSizes.labels += packed.length;
      return `<script type="application/x-mx-viz-tex" data-viz-tex="${m.name}">${packed}</script>`;
    }).join('\n');
  }
  const vizBytes = Buffer.byteLength(vizScripts) + Buffer.byteLength(vizData);

  // Formula table. Units are the elements marked data-mc (the lede, the index, each chapter, each appendix), in page
  // order. Each distinct formula gets the next index at its first use; the formulas a unit introduces form one
  // compressed chunk, and data-mc lists the chunks a unit needs.
  const SEP = '\u0003';
  const joined = [header, index, main].join(SEP);
  const pieces = joined.split('data-mc="@MC@"');
  const indexOf = new Map();
  const table = [];
  const chunks = [];
  const out = [pieces[0]];
  if (/<k-[md] i="T/.test(pieces[0])) throw new Error('a formula sits outside every hydration unit');
  for (let u = 1; u < pieces.length; u++) {
    const start = table.length;
    const needed = new Set();
    const body = pieces[u].replace(/<k-([md]) i="T(\d+)"/g, (all, kind, t) => {
      if (!indexOf.has(t)) { indexOf.set(t, table.length); table.push(ctx.math.byId[Number(t)]); }
      needed.add(indexOf.get(t));
      return `<k-${kind} i="${indexOf.get(t)}"`;
    });
    if (table.length > start) chunks.push({ start, end: table.length });
    const need = new Set();
    for (const i of needed) need.add(chunks.findIndex((c) => i >= c.start && i < c.end));
    out.push(`data-mc="${[...need].sort((a, b) => a - b).join(' ')}"${body}`);
  }
  const [headerN, indexN, mainN] = out.join('').split(SEP);
  let tableRaw = 0;
  const mathScripts = chunks.map((c, k) => {
    const text = table.slice(c.start, c.end).map(renameAttr).join('\u0001');
    tableRaw += Buffer.byteLength(text);
    const packed = zlib.deflateRawSync(Buffer.from(text, 'utf8'), { level: 9 }).toString('base64');
    return `<script type="application/x-mx-math" id="mxm-${k}" data-start="${c.start}" data-n="${c.end - c.start}">${packed}</script>`;
  }).join('\n');

  const html = fill(template, {
    title: escapeHtml(problem.title || ''),
    description: escapeHtml(description),
    css: renameCss(css),
    header: renameAttr(headerN),
    index: renameAttr(indexN),
    main: renameAttr(mainN),
    glossary: renameAttr(scriptJson(glossaryData)),
    mathData: mathScripts,
    vizData,
    runtime: inlineScript(runtime),
    vizScripts,
  });

  const fontBytes = Math.round(math.fontBytes * 4 / 3);
  const glossaryBytes = Buffer.byteLength(scriptJson(glossaryData));
  const refsMatch = mainN.match(/<article class="chapter appendix" id="references"[\s\S]*?<\/article>/);
  const sizes = {
    glossary: glossaryBytes,
    references: refsMatch ? Buffer.byteLength(refsMatch[0]) : 0,
    runtime: Buffer.byteLength(runtime),
    viz: vizSizes,
    total: Buffer.byteLength(html),
    prose: Buffer.byteLength(headerN) + Buffer.byteLength(indexN) + Buffer.byteLength(mainN),
    tablePacked: Buffer.byteLength(mathScripts),
    tableRaw,
    formulas: table.length,
    chunks: chunks.length,
    fonts: fontBytes,
    fontFiles: math.fonts,
    styles: Buffer.byteLength(renameCss(css)) - fontBytes,
    scripts: Buffer.byteLength(runtime) + vizBytes,
  };
  return { html, sizes };
}

export function landingPage(problems, sharedDir) {
  const style = fs.readFileSync(path.join(sharedDir, 'style.css'), 'utf8');
  const items = problems.map((p) => `<li><a href="${p.id}/index.html"><b>${escapeHtml(p.title)}</b>${p.subtitle ? `<span>${escapeHtml(p.subtitle)}</span>` : ''}</a></li>`).join('\n');
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="color-scheme" content="light dark">
<title>Millennium Prize Problems, explained</title>
<script>(function(){try{var t=localStorage.getItem('mx-theme');if(t==='light'||t==='dark')document.documentElement.setAttribute('data-theme',t);}catch(e){}})();</script>
<style>${style}</style>
</head>
<body>
<div class="wrap landing">
<header class="page-head"><h1>Millennium Prize Problems, explained</h1>
<p class="subtitle">Step-by-step explainers for readers with an undergraduate mathematics degree, from first principles to the end of the proof or to the frontier.</p></header>
<ul class="problem-list">
${items}
</ul>
</div>
</body>
</html>
`;
}
