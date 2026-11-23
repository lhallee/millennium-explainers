// Builds one problem folder into one self-contained HTML page.

import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import * as yaml from 'js-yaml';
import { createMarkdown, splitFrontMatter } from './markdown.mjs';
import { MathRenderer } from './math.mjs';
import { indexChapter, installRenderer, wrapSections, newStats, readSvg, escapeHtml, slugify } from './render.mjs';
import { assemblePage } from './page.mjs';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
// MX_SHARED points the build at another copy of shared/, so a change to the runtime, styles, or kit can be built and
// measured in a scratch folder before it replaces the shared copy that every author builds with.
const SHARED = process.env.MX_SHARED ? path.resolve(process.env.MX_SHARED) : path.join(ROOT, 'shared');
const KIT_FILES = [path.join(SHARED, 'viz', 'kit.js'), path.join(SHARED, 'viz', 'zeros.js')];

const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
export const roman = (n) => ROMAN[n - 1] || String(n);

function readYaml(file, ctx) {
  try {
    return yaml.load(fs.readFileSync(file, 'utf8'));
  } catch (err) {
    ctx.report(ctx.relPath(file), err.mark ? err.mark.line + 1 : 0, `YAML: ${err.reason || err.message}`);
    return null;
  }
}

// Control characters in a source file: any other than line ends, and a TAB inside math (where one once replaced the
// backslash of \text). Math is found by its $ and $$ delimiters, outside code spans and fenced code.
function checkControls(rel, text, ctx) {
  let inMath = false, display = false, inCode = false, fence = false, line = 1;
  for (let i = 0; i < text.length; i++) {
    const c = text.charCodeAt(i);
    if (c === 10) {
      line++;
      if (!display) inMath = false;
      inCode = false;
      if (/^[ \t]*(```|~~~)/.test(text.slice(i + 1, i + 9))) fence = !fence;
      continue;
    }
    if (c === 13 && text.charCodeAt(i + 1) === 10) continue;
    if ((c < 32 && c !== 9) || c === 127) { ctx.report(rel, line, `control character U+${c.toString(16).toUpperCase().padStart(4, '0')}`); continue; }
    if (fence) continue;
    const ch = text[i];
    if (ch === '\\') { i++; continue; }
    if (ch === '`' && !inMath) { inCode = !inCode; continue; }
    if (inCode) continue;
    if (ch === '$') {
      if (text[i + 1] === '$') { display = !display; inMath = display; i++; } else if (!display) inMath = !inMath;
      continue;
    }
    if (c === 9 && inMath) ctx.report(rel, line, 'TAB inside math (a lost backslash?)');
  }
}
// A $ left in rendered prose is math that did not parse as math.
function checkDollars(rel, html, ctx) {
  const text = html.replace(/<(k-m|k-d|code|pre|script|style)\b[^>]*>[\s\S]*?<\/\1>/g, '').replace(/<[^>]+>/g, ' ');
  const at = text.indexOf('$');
  if (at >= 0) ctx.report(rel, 0, `a $ is left in the rendered text (math that did not parse?): "...${text.slice(Math.max(0, at - 40), at + 40).replace(/\s+/g, ' ')}..."`);
}

// A list that continues an earlier one (start="n", as when a display equation splits a list of steps) sets the
// steps counter to n - 1, so a steps block numbers its items 1 to n across its lists.
function continueLists(html) {
  return html.replace(/<ol start="(\d+)">/g, (all, n) => `<ol start="${n}" style="counter-set:step ${Number(n) - 1}">`);
}

function deepEqual(a, b) {
  return JSON.stringify(a, Object.keys(a || {}).sort()) === JSON.stringify(b, Object.keys(b || {}).sort());
}

export function buildProblem({ problemDir, draft = false }) {
  const errors = [];
  const warnings = [];
  const ctx = {
    dir: problemDir,
    draft,
    errors,
    warnings,
    relPath: (file) => path.relative(ROOT, file).split(path.sep).join('/'),
    report(file, line, msg) { errors.push({ file, line, msg }); },
    warn(file, line, msg) { warnings.push({ file, line, msg }); },
    registry: new Map(),
    references: new Map(),
    referenceFile: new Map(),
    citeOrder: new Map(),
    terms: [],
    vizUsed: new Map(),
    missingFigures: [],
    svgs: new Map(),
  };

  const problemFile = path.join(problemDir, 'problem.yml');
  if (!fs.existsSync(problemFile)) {
    ctx.report(ctx.relPath(problemDir), 0, 'no problem.yml');
    return { errors, warnings };
  }
  const problem = readYaml(problemFile, ctx) || {};
  const problemRel = ctx.relPath(problemFile);
  for (const key of ['id', 'title', 'parts', 'chapters']) if (!problem[key]) ctx.report(problemRel, 0, `problem.yml needs "${key}"`);
  if (!Array.isArray(problem.sources) || problem.sources.length === 0) {
    ctx.report(problemRel, 0, 'problem.yml needs "sources": a list of { key, read } naming the reference keys of the sources and the date each was read, for the lede');
  }

  let macros = {};
  const macroFile = path.join(problemDir, 'macros.yml');
  if (fs.existsSync(macroFile)) macros = readYaml(macroFile, ctx) || {};
  ctx.math = new MathRenderer(macros);
  // Elements in the rendering of formula id, for the build's estimate of how much a piece of a section costs to draw.
  const elementCounts = new Map();
  const formulaElements = (id) => {
    let n = elementCounts.get(id);
    if (n === undefined) { n = (ctx.math.byId[id].match(/<span/g) || []).length; elementCounts.set(id, n); }
    return n;
  };
  ctx.md = createMarkdown();
  installRenderer(ctx.md, ctx);

  ctx.register = (id, entry) => {
    const prev = ctx.registry.get(id);
    if (prev) {
      ctx.report(entry.file, entry.line, `duplicate id "${id}", first used at ${prev.file}:${prev.line}`);
      return;
    }
    ctx.registry.set(id, entry);
  };
  ctx.lineOf = (ch, bodyLine) => ch.lineBase + bodyLine + 1;
  ctx.renderEnv = (ch, extra = {}) => ({
    file: ch.rel,
    lineBase: ch.lineBase,
    report: (line, msg) => ctx.report(ch.rel, line, msg),
    noTerms: 0,
    termUsed: new Set(),
    termsLeft: ctx.terms.length,
    stats: newStats(),
    secStats: [],
    pendingCaption: null,
    ...extra,
  });
  ctx.requireReference = (key, file, line) => {
    if (!ctx.references.has(key)) ctx.report(file, line, `unknown reference key "${key}"`);
  };
  ctx.citeHtml = (items, file, line) => {
    const parts = [];
    for (const { key, loc } of items) {
      if (!ctx.references.has(key)) {
        ctx.report(file, line, `citation of unknown reference key "${key}"`);
        parts.push(`<span class="cite-broken">${escapeHtml(key)}</span>`);
        continue;
      }
      if (!ctx.citeOrder.has(key)) ctx.citeOrder.set(key, ctx.citeOrder.size + 1);
      const n = ctx.citeOrder.get(key);
      parts.push(`<a href="#ref-${key}">${n}${loc ? `, ${escapeHtml(loc)}` : ''}</a>`);
    }
    return `<span class="cite">[${parts.join('; ')}]</span>`;
  };
  ctx.useViz = (name, file, line) => {
    const moduleFile = path.join(problemDir, 'viz', `${name}.js`);
    if (fs.existsSync(moduleFile)) {
      if (!ctx.vizUsed.has(name)) ctx.vizUsed.set(name, moduleFile);
      return 'ok';
    }
    if (draft) { ctx.missingFigures.push({ name, file, line }); return 'missing'; }
    ctx.report(file, line, `figure module viz/${name}.js does not exist (build with --draft to show a placeholder)`);
    return 'missing';
  };
  ctx.useSvg = (name, file, line) => {
    const svgFile = path.join(problemDir, 'viz', name);
    if (!fs.existsSync(svgFile)) {
      if (draft) { ctx.missingFigures.push({ name, file, line }); return 'missing'; }
      ctx.report(file, line, `static figure viz/${name} does not exist (build with --draft to show a placeholder)`);
      return 'missing';
    }
    try {
      if (!ctx.svgs.has(name)) ctx.svgs.set(name, readSvg(svgFile));
      return 'ok';
    } catch (err) {
      ctx.report(file, line, err.message);
      return 'missing';
    }
  };

  // References: one file per chapter, merged. Equal duplicates are fine; conflicting ones are errors.
  const refDir = path.join(problemDir, 'references');
  for (const file of listFiles(refDir, '.yml')) {
    checkControls(ctx.relPath(file), fs.readFileSync(file, 'utf8'), ctx);
    const data = readYaml(file, ctx);
    if (data == null) continue;
    const rel = ctx.relPath(file);
    if (typeof data !== 'object' || Array.isArray(data)) { ctx.report(rel, 0, 'a references file is a mapping from key to entry'); continue; }
    for (const [key, entry] of Object.entries(data)) {
      if (!entry || typeof entry !== 'object') { ctx.report(rel, 0, `reference "${key}" is not a mapping`); continue; }
      for (const field of ['authors', 'title']) if (!entry[field]) ctx.report(rel, 0, `reference "${key}" needs "${field}"`);
      for (const field of Object.keys(entry)) if (!['authors', 'title', 'year', 'where', 'url'].includes(field)) ctx.report(rel, 0, `reference "${key}" has an unknown field "${field}"`);
      const prev = ctx.references.get(key);
      if (prev && !deepEqual(normalizeRef(prev), normalizeRef(entry))) {
        ctx.report(rel, 0, `reference key "${key}" conflicts with the entry in ${ctx.referenceFile.get(key)}; two entries with one key must be identical`);
        continue;
      }
      if (!prev) { ctx.references.set(key, entry); ctx.referenceFile.set(key, rel); }
    }
  }

  // Chapters.
  const chapterNames = Array.isArray(problem.chapters) ? problem.chapters : [];
  const chapters = [];
  const chapterDir = path.join(problemDir, 'chapters');
  const listed = new Set(chapterNames.map((n) => `${n}.md`));
  for (const file of listFiles(chapterDir, '.md')) {
    if (!listed.has(path.basename(file))) ctx.warn(ctx.relPath(file), 0, 'chapter file is not listed in problem.yml and is not built');
  }
  for (const name of chapterNames) {
    const file = path.join(chapterDir, `${name}.md`);
    const rel = ctx.relPath(file);
    if (!fs.existsSync(file)) {
      if (draft) ctx.warn(rel, 0, 'chapter listed in problem.yml does not exist yet; skipped in this draft');
      else ctx.report(rel, 0, 'chapter listed in problem.yml does not exist');
      continue;
    }
    const raw = fs.readFileSync(file, 'utf8');
    if (raw.includes('\r')) ctx.warn(rel, 0, 'CRLF line ends; the contract asks for LF');
    checkControls(rel, raw, ctx);
    const split = splitFrontMatter(raw);
    if (split.error || split.front == null) { ctx.report(rel, 1, split.error || 'no front matter'); continue; }
    let front;
    try {
      front = yaml.load(split.front) || {};
    } catch (err) {
      ctx.report(rel, (err.mark ? err.mark.line : 0) + 2, `front matter YAML: ${err.reason || err.message}`);
      continue;
    }
    for (const key of ['id', 'title', 'part', 'summary']) if (front[key] == null || front[key] === '') ctx.report(rel, 1, `front matter needs "${key}"`);
    for (const key of Object.keys(front)) if (!['id', 'title', 'part', 'summary', 'needs'].includes(key)) ctx.report(rel, 1, `front matter has an unknown field "${key}"`);
    if (front.id && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(front.id)) ctx.report(rel, 1, `chapter id "${front.id}" is not kebab-case`);
    if (front.part != null && !(Number.isInteger(front.part) && front.part >= 1 && front.part <= (problem.parts || []).length)) {
      ctx.report(rel, 1, `part ${front.part} is not an index into the ${(problem.parts || []).length} parts of problem.yml`);
    }
    if (front.needs != null && !Array.isArray(front.needs)) ctx.report(rel, 1, 'needs is a list of chapter ids');
    chapters.push({ name, file, rel, front, body: split.body, lineBase: split.lineBase, sections: [] });
  }
  chapters.forEach((ch, i) => {
    ch.num = chapterNames.indexOf(ch.name) + 1;
    ch.index = i;
    ch.isLast = ch.name === chapterNames[chapterNames.length - 1];
    if (ch.front.id) ctx.register(ch.front.id, { kind: 'chapter', text: escapeHtml(ch.front.title || ''), file: ch.rel, line: 2, chapter: ch });
  });
  for (const ch of chapters) {
    for (const need of ch.front.needs || []) {
      const target = chapters.find((c) => c.front.id === need);
      if (!target) {
        const pending = draft && !chapters.some((c) => c.front.id === need);
        (pending ? ctx.warn : ctx.report)(ch.rel, 1, `needs "${need}", which is not a chapter id${pending ? ' (it may not be written yet)' : ''}`);
      } else if (target.num >= ch.num) ctx.report(ch.rel, 1, `needs "${need}", which comes later (chapter ${target.num}); a chapter builds only on earlier ones`);
    }
  }

  // Glossary: one file per chapter, merged.
  const glossary = [];
  const glossaryByTerm = new Map();
  for (const file of listFiles(path.join(problemDir, 'glossary'), '.yml')) {
    checkControls(ctx.relPath(file), fs.readFileSync(file, 'utf8'), ctx);
    const data = readYaml(file, ctx);
    if (data == null) continue;
    const rel = ctx.relPath(file);
    if (!Array.isArray(data)) { ctx.report(rel, 0, 'a glossary file is a list of entries'); continue; }
    for (const entry of data) {
      const name = entry && entry.term;
      for (const field of ['term', 'pattern', 'definition', 'anchor']) if (!entry || !entry[field]) ctx.report(rel, 0, `glossary entry "${name || '?'}" needs "${field}"`);
      if (!entry || !entry.term || !entry.pattern) continue;
      for (const field of Object.keys(entry)) if (!['term', 'pattern', 'definition', 'anchor'].includes(field)) ctx.report(rel, 0, `glossary entry "${name}" has an unknown field "${field}"`);
      const prev = glossaryByTerm.get(entry.term.toLowerCase());
      if (prev) {
        if (!deepEqual(prev.entry, entry)) ctx.report(rel, 0, `glossary term "${entry.term}" conflicts with the entry in ${prev.rel}`);
        continue;
      }
      let re;
      try {
        re = new RegExp(`(?<![A-Za-z0-9])(?:${entry.pattern})(?![A-Za-z0-9])`, 'i');
      } catch (err) {
        ctx.report(rel, 0, `glossary term "${entry.term}": pattern does not compile: ${err.message}`);
        continue;
      }
      if (re.test('')) { ctx.report(rel, 0, `glossary term "${entry.term}": pattern matches the empty string`); continue; }
      const item = { k: glossary.length, entry, rel, re };
      glossaryByTerm.set(entry.term.toLowerCase(), item);
      glossary.push(item);
    }
  }
  ctx.terms = glossary;

  // Parse and index every chapter before rendering any, so that references can point forward.
  for (const ch of chapters) {
    const env = ctx.renderEnv(ch, { curLine: ch.lineBase + 1 });
    ch.tokens = ctx.md.parse(ch.body, env);
  }
  for (const ch of chapters) indexChapter(ch, ctx);

  // Fixed anchors of the page.
  for (const id of ['top', 'contents', 'notation', 'references']) ctx.registry.set(id, { kind: 'page', text: id, file: '(page)', line: 0 });
  for (const key of ctx.references.keys()) ctx.registry.set(`ref-${key}`, { kind: 'reference', text: key, file: ctx.referenceFile.get(key), line: 0 });

  // Notation appendix from NOTATION.md: everything from the first "##" heading on.
  let notation = null;
  const notationFile = path.join(problemDir, 'NOTATION.md');
  if (fs.existsSync(notationFile)) {
    const text = fs.readFileSync(notationFile, 'utf8').replace(/\r\n?/g, '\n');
    const at = text.search(/^## /m);
    const body = at >= 0 ? text.slice(at) : '';
    const lineBase = at >= 0 ? text.slice(0, at).split('\n').length - 1 : 0;
    const pseudo = { rel: ctx.relPath(notationFile), lineBase, front: { id: 'notation', title: 'Notation' }, num: 'N', sections: [] };
    const env = ctx.renderEnv(pseudo, { noTerms: 1, curLine: lineBase + 1 });
    const tokens = ctx.md.parse(body, env);
    for (let i = 0; i < tokens.length; i++) {
      const t = tokens[i];
      if (t.type === 'heading_open') {
        if (!t.meta.id) t.meta.id = `notation-${slugify(tokens[i + 1].content)}`;
        t.meta.num = '';
        const entry = { kind: 'section', text: ctx.md.renderer.renderInline(tokens[i + 1].children, ctx.md.options, ctx.renderEnv(pseudo, { noTerms: 1 })), file: pseudo.rel, line: t.meta.line };
        if (t.tag === 'h2') pseudo.sections.push({ id: t.meta.id, num: '', entry });
        ctx.register(t.meta.id, entry);
      }
    }
    notation = { pseudo, tokens, env };
  } else {
    ctx.warn(ctx.relPath(problemDir), 0, 'no NOTATION.md, so the page has no notation appendix');
  }

  for (const item of glossary) {
    if (item.entry.anchor && !ctx.registry.has(item.entry.anchor)) ctx.report(item.rel, 0, `glossary term "${item.entry.term}" points to anchor "${item.entry.anchor}", which does not exist`);
  }

  // Render. Citations are numbered in order of first appearance on the page.
  const ledeEnv = ctx.renderEnv({ rel: problemRel, lineBase: 0 }, { noTerms: 1 });
  const lede = problem.lede ? ctx.md.render(String(problem.lede), ledeEnv) : '';
  const sources = [];
  for (const src of Array.isArray(problem.sources) ? problem.sources : []) {
    if (!src || !src.key) { ctx.report(problemRel, 0, 'each entry of sources needs key (a reference key) and read (a date)'); continue; }
    if (!ctx.references.has(src.key)) { ctx.report(problemRel, 0, `source "${src.key}" is not a reference key`); continue; }
    if (!src.read) ctx.report(problemRel, 0, `source "${src.key}" needs read: the date it was read`);
    ctx.citeHtml([{ key: src.key, loc: '' }], problemRel, 0);
    sources.push({ key: src.key, read: src.read instanceof Date ? src.read.toISOString().slice(0, 10) : String(src.read || ''), entry: ctx.references.get(src.key) });
  }

  for (const ch of chapters) {
    const env = ctx.renderEnv(ch, { curLine: ch.lineBase + 1 });
    const html = ctx.md.renderer.render(ch.tokens, ctx.md.options, env);
    env.secStats.push(env.stats);
    checkDollars(ch.rel, html, ctx);
    ch.html = wrapSections(continueLists(html), ch, env.secStats, formulaElements);
    ch.termCount = ctx.terms.length - env.termsLeft;
  }
  if (notation) {
    let html = ctx.md.renderer.render(notation.tokens, ctx.md.options, notation.env);
    html = html.replace(/\u0000SEC ([^\u0000]+)\u0000<h3 class="sec-title"><span class="sec-no"><\/span>/g, '<h3 class="sec-title" id="$1">');
    html = html.replace(/<code>(gold|blue|teal|red|violet|muted)<\/code>/g, '<code class="swatch" style="--sw:var(--viz-$1)">$1</code>');
    notation.html = html;
  }

  for (const key of ctx.references.keys()) {
    if (!ctx.citeOrder.has(key)) {
      ctx.warn(ctx.referenceFile.get(key), 0, `reference "${key}" is never cited; it is listed after the cited ones`);
      ctx.citeOrder.set(key, ctx.citeOrder.size + 1);
    }
  }

  // Figure modules: evaluate each with the kit to read its registration and its TeX labels.
  const viz = loadVizModules(ctx);

  if (ctx.math.warnings.length) for (const w of new Set(ctx.math.warnings)) ctx.warn('(math)', 0, `KaTeX strict: ${w}`);

  const glossaryData = glossary.map((item) => ({
    t: item.entry.term,
    d: ctx.md.renderInline(String(item.entry.definition || ''), ctx.renderEnv({ rel: item.rel, lineBase: 0 }, { noTerms: 1, rawMath: true })),
    a: item.entry.anchor,
    at: ctx.registry.get(item.entry.anchor) ? ctx.registry.get(item.entry.anchor).text : '',
  }));

  if (errors.length) return { errors, warnings, missingFigures: ctx.missingFigures };

  const page = assemblePage({ problem, chapters, notation, ctx, lede, sources, glossaryData, viz, kitFiles: KIT_FILES, sharedDir: SHARED });
  return { errors, warnings, missingFigures: ctx.missingFigures, html: page.html, sizes: page.sizes, problem, stats: { chapters: chapters.length, formulas: ctx.math.count, figures: ctx.vizUsed.size, terms: glossary.length, references: ctx.references.size } };
}

function normalizeRef(entry) {
  const out = {};
  for (const [k, v] of Object.entries(entry || {})) if (v != null && v !== '') out[k] = String(v).trim();
  return out;
}

function listFiles(dir, ext) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((f) => f.endsWith(ext)).sort().map((f) => path.join(dir, f));
}

// Runs the kit and each module in a sandbox. A module's top level only registers; the sandbox has no DOM.
function loadVizModules(ctx) {
  const modules = [];
  if (ctx.vizUsed.size === 0) return { modules, kit: null };
  const sandbox = vm.createContext({ console });
  for (const file of KIT_FILES) vm.runInContext(fs.readFileSync(file, 'utf8'), sandbox, { filename: file });
  const Kit = sandbox.Kit;
  for (const [name, file] of ctx.vizUsed) {
    const rel = ctx.relPath(file);
    const code = fs.readFileSync(file, 'utf8');
    const before = new Set(Object.keys(Kit.modules));
    try {
      vm.runInContext(code, sandbox, { filename: file });
    } catch (err) {
      ctx.report(rel, 0, `figure module fails to load: ${err.message}`);
      continue;
    }
    const added = Object.keys(Kit.modules).filter((k) => !before.has(k));
    if (added.length !== 1 || added[0] !== name) {
      ctx.report(rel, 0, `figure module must call Kit.register('${name}', ...) exactly once; it registered ${added.length ? added.join(', ') : 'nothing'}`);
      continue;
    }
    const spec = Kit.modules[name];
    if (typeof spec.init !== 'function') ctx.report(rel, 0, 'figure module has no init(fig) function');
    const tex = {};
    for (const [key, source] of Object.entries(spec.tex || {})) {
      const r = ctx.math.render(String(source), false);
      if (r.error) ctx.report(rel, 0, `KaTeX in tex.${key}: ${r.error}`);
      else tex[key] = r.html;
    }
    modules.push({ name, code, tex });
  }
  return { modules };
}
