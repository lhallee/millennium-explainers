// KaTeX at build time: HTML output only, shared and problem macros, a cache, and the CSS with only the fonts the
// rendered math uses.

import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import katex from 'katex';

const require = createRequire(import.meta.url);
const KATEX_DIR = path.dirname(require.resolve('katex/dist/katex.min.css'));

// Shared macros, available to every problem (AUTHORING.md, "Math").
export const SHARED_MACROS = {
  '\\RR': '\\mathbb{R}',
  '\\CC': '\\mathbb{C}',
  '\\ZZ': '\\mathbb{Z}',
  '\\QQ': '\\mathbb{Q}',
  '\\NN': '\\mathbb{N}',
  '\\FF': '\\mathbb{F}',
  '\\Re': '\\operatorname{Re}',
  '\\Im': '\\operatorname{Im}',
  '\\abs': '\\left\\lvert #1\\right\\rvert',
  '\\norm': '\\left\\lVert #1\\right\\rVert',
  '\\floor': '\\left\\lfloor #1\\right\\rfloor',
  '\\ceil': '\\left\\lceil #1\\right\\rceil',
  '\\dd': '\\mathop{}\\!\\mathrm{d}',
  '\\eps': '\\varepsilon',
};

export class MathRenderer {
  constructor(macros) {
    this.macros = { ...SHARED_MACROS, ...macros };
    this.cache = new Map();
    this.classes = new Set();
    this.classCounts = new Map();
    this.byId = [];
    this.warnings = [];
    this.count = 0;
  }

  countClasses(html) {
    for (const m of html.matchAll(/class="([^"]+)"/g)) {
      for (const c of m[1].split(/\s+/)) this.classCounts.set(c, (this.classCounts.get(c) || 0) + 1);
    }
  }

  // Short names for KaTeX's classes, most frequent first ("k0", "k1", ...). The stylesheet is renamed with the same
  // map, so nothing drawn changes. Names in keep (words of the page's own CSS, template, and scripts) stay.
  classMap(keep) {
    const map = new Map();
    const names = [...this.classCounts.entries()].sort((a, b) => b[1] - a[1]).map(([n]) => n).filter((n) => !keep.has(n));
    names.forEach((n, i) => map.set(n, `k${i.toString(36)}`));
    return map;
  }

  // The page holds a placeholder per formula: the TeX source as text, and the id of the distinct rendering. The build
  // replaces each id by its index in the compressed formula table (page.mjs), and the runtime fills it in.
  placeholder(r, tex, display) {
    const src = String(tex).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]).trim();
    return display ? `<k-d i="T${r.id}" style="--mh:${r.mh}">${src}</k-d>` : `<k-m i="T${r.id}">${src}</k-m>`;
  }

  // Returns { html, id, mh } or { error }. id numbers the distinct (TeX, display) pairs; mh is the tallest strut of
  // a display formula in em, used to reserve its height before it is filled in.
  render(tex, display) {
    const key = (display ? 'D' : 'I') + tex;
    const hit = this.cache.get(key);
    if (hit) { this.count++; return hit; }
    let result;
    try {
      const html = katex.renderToString(tex, {
        displayMode: display,
        output: 'html',
        throwOnError: true,
        trust: false,
        macros: { ...this.macros },
        strict: (code, message) => { this.warnings.push(`${code}: ${message} in "${tex}"`); return 'ignore'; },
      });
      for (const m of html.matchAll(/class="([^"]+)"/g)) for (const c of m[1].split(/\s+/)) this.classes.add(c);
      let mh = 1;
      for (const m of html.matchAll(/class="katex-strut" style="height:([\d.]+)em/g)) mh = Math.max(mh, Number(m[1]));
      result = { html: compact(html), id: this.byId.length, mh: Math.round(mh * 100) / 100 };
      this.byId.push(result.html);
      this.countClasses(result.html);
    } catch (err) {
      result = { error: String(err.message || err).replace(/^KaTeX parse error: /, '') };
    }
    this.cache.set(key, result);
    this.count++;
    return result;
  }

  // KaTeX's stylesheet with only the @font-face rules for fonts the rendered math needs, each inlined as base64
  // woff2. Returns { css, fonts: [file names], fontBytes }.
  css() {
    const source = fs.readFileSync(path.join(KATEX_DIR, 'katex.min.css'), 'utf8');
    const faces = [];
    const body = source.replace(/@font-face\{([^}]*)\}/g, (all, decl) => { faces.push(decl); return ''; });
    const used = usedFonts(body, this.classes);
    let fontBytes = 0;
    const fonts = [];
    const kept = [];
    for (const decl of faces) {
      const family = /font-family:"?([\w]+)"?/.exec(decl)[1];
      const style = /font-style:(\w+)/.exec(decl)[1];
      const weight = /font-weight:(\d+)/.exec(decl)[1];
      if (!used.has(`${family}|${weight}|${style}`)) continue;
      const file = /url\(fonts\/([^)]+\.woff2)\)/.exec(decl)[1];
      const data = fs.readFileSync(path.join(KATEX_DIR, 'fonts', file));
      fontBytes += data.length;
      fonts.push(file);
      kept.push(`@font-face{font-display:block;font-family:${family};font-style:${style};font-weight:${weight};src:url(data:font/woff2;base64,${data.toString('base64')}) format("woff2")}`);
    }
    return { css: kept.join('') + unlayer(body), fonts, fontBytes };
  }
}

// Paint layers. Chrome gives every relatively positioned box and every box that clips its overflow a paint layer of
// its own, and pre-paint, paint, and hit testing walk them all: the Riemann page holds about 120,000 in its math.
// These four rules make about 87,000 of them and place nothing: the formula root, each base, and each vlist cell
// are positioned without an offset, and no absolutely positioned descendant takes one of them as its containing
// block (each has a positioned parent of its own); the pstrut that clips is empty, and an empty inline-block's
// baseline is its bottom margin edge either way. With them removed, every element of the filled Riemann page keeps
// its box to 1/64 px (2026-11-23). The vlist children, which are moved by top, keep position: relative.
const UNLAYER = [
  ['.katex', 'position:relative;'],
  ['.katex .katex-base', 'position:relative;'],
  ['.katex .vlist', 'position:relative;'],
  ['.katex .vlist>span>.pstrut', 'overflow:hidden;'],
];
function unlayer(css) {
  let out = css;
  for (const [selector, decl] of UNLAYER) {
    const rules = [...out.matchAll(/([^{}]+)\{([^{}]*)\}/g)].filter((m) => m[1] === selector && m[2].includes(decl));
    if (rules.length !== 1) throw new Error(`KaTeX's stylesheet has ${rules.length} rules ${selector} with ${decl}, expected 1; check the KaTeX version`);
    const m = rules[0];
    out = out.slice(0, m.index) + `${selector}{${m[2].replace(decl, '')}}` + out.slice(m.index + m[0].length);
  }
  return out;
}

// Removes empty style attributes, which cannot change what KaTeX draws, and aria-hidden: with no MathML copy,
// hiding the HTML rendering would leave a screen reader nothing.
function compact(html) {
  return html.replace(/ style=""/g, '').replace(/ aria-hidden="true"/g, '');
}

// Decide which (family, weight, style) faces the rendered classes reach, from the rules in katex.css.
function usedFonts(css, classes) {
  const used = new Set(['KaTeX_Main|400|normal']);
  for (const m of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    const selectors = m[1];
    const decl = m[2];
    const fam = /font-family:"?(KaTeX_\w+)"?/.exec(decl);
    const weight = /font-weight:(\d+|bold)/.exec(decl);
    const style = /font-style:(\w+)/.exec(decl);
    if (!fam && !weight && !style) continue;
    if (selectors.trim().startsWith('@')) continue;
    let reached = false;
    for (const sel of selectors.split(',')) {
      const names = [...sel.matchAll(/\.([\w-]+)/g)].map((x) => x[1]).filter((n) => n !== 'katex');
      if (names.length === 0) continue;
      if (names.every((n) => classes.has(n))) { reached = true; break; }
    }
    if (!reached) continue;
    const family = fam ? fam[1] : 'KaTeX_Main';
    const w = weight ? (weight[1] === 'bold' ? '700' : weight[1]) : '400';
    const s = style ? style[1] : 'normal';
    used.add(`${family}|${w}|${s}`);
    // A rule that sets only the weight or the style can combine with an inherited italic or bold.
    if (!fam && family === 'KaTeX_Main') {
      if (w === '700') used.add('KaTeX_Main|700|italic');
    }
  }
  return used;
}
