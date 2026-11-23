// Numbering and rendering of parsed chapters. Pass one (indexChapter) walks every chapter's tokens, validates
// containers and cards, numbers theorem-like blocks, figures, and equations, and registers every anchor. Pass two
// (renderChapter) writes HTML and resolves references, citations, and glossary terms.

import fs from 'node:fs';
import path from 'node:path';

export const NUMBERED = {
  definition: 'Definition',
  theorem: 'Theorem',
  proposition: 'Proposition',
  lemma: 'Lemma',
  corollary: 'Corollary',
  conjecture: 'Conjecture',
};

// Unnumbered blocks: label outside a card, label as a card part, the attributes and flags each accepts.
const BLOCKS = {
  statement: { label: 'Statement', part: 'Statement', attrs: [], cardOnly: true },
  plain: { label: 'In plain terms', part: 'In plain terms', attrs: [] },
  why: { label: 'Why we need it', part: 'Why it is needed', attrs: [] },
  idea: { label: 'The idea', part: 'Idea', attrs: ['title'] },
  proof: { label: 'Proof', part: 'Proof', attrs: ['title'], flags: ['collapsed'] },
  sketch: { label: 'Proof sketch', part: 'Proof sketch', attrs: ['title', 'source', 'loc'], flags: ['collapsed'] },
  steps: { label: 'Steps', part: 'Steps', attrs: ['title'], flags: ['collapsed'] },
  example: { label: 'Example', part: 'Example', attrs: ['title'], flags: ['collapsed'] },
  symbols: { label: 'Symbols', part: 'Symbols', attrs: ['title'], flags: ['collapsed'] },
  recall: { label: 'Recall', part: 'Recall', attrs: ['title'], flags: ['collapsed', 'open'] },
  aside: { label: 'Aside', part: 'Aside', attrs: ['title'], flags: ['collapsed'] },
  warning: { label: 'A common misreading', part: 'Misreading', attrs: ['title'] },
  used: { label: 'Used later', part: 'Used in', attrs: [] },
  lean: { label: 'In the Lean formalization', part: 'In Lean', attrs: ['decl', 'file'], required: ['decl', 'file'] },
  recap: { label: 'Recap', part: 'Recap', attrs: [] },
};

const CARD_PARTS = new Set(['statement', 'plain', 'why', 'idea', 'proof', 'sketch', 'example', 'lean', 'used']);

export function escapeHtml(s) {
  return String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
}

export function slugify(s) {
  return String(s).toLowerCase().replace(/<[^>]+>/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60);
}

function stripTags(html) {
  return html.replace(/<[^>]+>/g, '').replace(/&[a-z]+;|&#\d+;/g, ' ');
}

// ---------------------------------------------------------------------------------------------------------------
// Pass one

export function indexChapter(ch, ctx) {
  const { tokens } = ch;
  const c = ch.num;
  let thm = 0;
  let fig = 0;
  let eq = 0;
  let sec = 0;
  const stack = [];
  const err = (line, msg) => ctx.report(ch.rel, line, msg);
  const titleEnv = (line) => ctx.renderEnv(ch, { noTerms: 1, curLine: line });

  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i];
    const top = stack[stack.length - 1];
    if (top && top.name === 'card' && t.level === top.level + 1 && t.nesting !== -1 && t.type !== 'container_open') {
      if (!top.strayReported) {
        err(t.map ? ctx.lineOf(ch, t.map[0]) : top.meta.line, `card "${top.meta.id || ''}" holds content outside its parts; everything in a card goes inside statement, plain, why, idea, proof or sketch, example, lean, and used`);
        top.strayReported = true;
      }
    }
    if (t.type === 'heading_open') {
      const level = Number(t.tag.slice(1));
      const line = t.meta.line;
      const children = tokens[i + 1].children;
      const titleSrc = tokens[i + 1].content;
      const entry = lazyText({ kind: 'section', file: ch.rel, line, chapter: ch }, () => ctx.md.renderer.renderInline(children, ctx.md.options, titleEnv(line)).trim());
      if (level === 1) err(line, 'a "#" heading in a chapter body: the chapter title comes from the front matter, and sections start at "##"');
      if (level === 2) {
        if (stack.length || t.level !== 0) err(line, 'a "##" section heading must not sit inside a container');
        if (!t.meta.id) {
          err(line, `the "##" heading "${titleSrc}" needs an anchor: "## Title {#id}"`);
          t.meta.id = `${ch.front.id || 'chapter'}-${slugify(titleSrc)}`;
        }
        sec++;
        t.meta.num = `${c}.${sec}`;
        ctx.register(t.meta.id, entry);
        ch.sections.push({ id: t.meta.id, num: t.meta.num, entry });
      } else if (level >= 3) {
        if (!t.meta.id) t.meta.id = `${ch.sections.length ? ch.sections[ch.sections.length - 1].id : ch.front.id}-${slugify(titleSrc)}`;
        ctx.register(t.meta.id, entry);
      }
      continue;
    }

    if (t.type === 'math_block') {
      if (t.meta.id) {
        eq++;
        t.meta.num = `${c}.${eq}`;
        ctx.register(t.meta.id, { kind: 'equation', text: `Equation (${t.meta.num})`, file: ch.rel, line: t.meta.line, chapter: ch });
      }
      continue;
    }

    if (t.type === 'fence' && t.info.trim().split(/\s+/)[0] === 'vizspec') {
      if (!top || top.name !== 'figure') err(ctx.lineOf(ch, t.map[0]), 'a vizspec block belongs inside a figure container');
      continue;
    }

    if (t.type === 'inline') {
      for (const child of t.children) {
        if (child.type === 'image') err(ctx.lineOf(ch, t.map ? t.map[0] : 0), 'Markdown images are not supported: use a figure container with viz or svg');
      }
      continue;
    }

    if (t.type === 'container_close') {
      const frame = stack.pop();
      if (frame && frame.name === 'card') {
        const problem = checkCardParts(frame.parts, ch.isLast);
        if (problem) err(frame.meta.line, `card "${frame.meta.id || ''}": ${problem}`);
      }
      if (frame && frame.name === 'steps' && !frame.hasOrderedList) err(frame.meta.line, 'a steps block holds a numbered list ("1. ...")');
      if (frame && frame.name === 'symbols') {
        if (!frame.tableColumns) err(frame.meta.line, 'a symbols block wraps a Markdown table');
        else if (frame.tableColumns !== 4) err(frame.meta.line, `a symbols table has the four columns symbol, what it is, kind, where it lives; this one has ${frame.tableColumns}`);
      }
      if (frame && frame.name === 'figure' && !frame.hasCaption) err(frame.meta.line, 'a figure needs a caption that states the one claim it makes');
      continue;
    }

    if (top && top.name === 'steps' && t.type === 'ordered_list_open') top.hasOrderedList = true;
    if (top && top.name === 'symbols' && t.type === 'table_open') {
      let cols = 0;
      for (let j = i + 1; j < tokens.length && tokens[j].type !== 'tr_close'; j++) if (tokens[j].type === 'th_open') cols++;
      top.tableColumns = cols;
    }
    if (top && top.name === 'figure' && t.type === 'paragraph_open') top.hasCaption = true;

    if (t.type !== 'container_open') continue;

    const m = t.meta;
    const name = m.name;
    const frame = { name, level: t.level, meta: m, parts: [] };
    const parentCard = top && top.name === 'card' && t.level === top.level + 1 ? top : null;
    m.cardPart = Boolean(parentCard);
    const allowAttrs = (list, flags = [], required = []) => {
      for (const k of Object.keys(m.attrs)) if (!list.includes(k)) err(m.line, `container "${name}" does not take the attribute ${k}="..."`);
      for (const f of m.flags) if (!flags.includes(f)) err(m.line, `container "${name}" does not take the flag "${f}"`);
      for (const k of required) if (!m.attrs[k]) err(m.line, `container "${name}" needs ${k}="..."`);
    };
    const titleOf = (s) => () => ctx.md.renderInline(s, titleEnv(m.line));

    if (parentCard) {
      if (!CARD_PARTS.has(name)) err(m.line, `"${name}" is not a card part; a card holds statement, plain, why, idea, proof or sketch, example, lean, and used`);
      parentCard.parts.push(name);
      m.cardSource = parentCard.meta.attrs.source;
    }

    if (NUMBERED[name] || name === 'card') {
      if (name === 'card') {
        allowAttrs(['title', 'kind', 'source', 'loc'], [], ['title', 'kind']);
        if (!m.id) err(m.line, 'a card needs an anchor {#id}');
        if (m.attrs.kind && !NUMBERED[m.attrs.kind]) err(m.line, `card kind="${m.attrs.kind}" is not one of ${Object.keys(NUMBERED).join(', ')}`);
        if (stack.some((f) => f.name === 'card')) err(m.line, 'a card cannot sit inside another card');
      } else {
        allowAttrs(['title', 'source', 'loc']);
      }
      thm++;
      m.num = `${c}.${thm}`;
      m.kindLabel = NUMBERED[name === 'card' ? m.attrs.kind : name] || 'Result';
      m.titleFn = m.attrs.title ? titleOf(m.attrs.title) : () => '';
      if (m.attrs.source) ctx.requireReference(m.attrs.source, ch.rel, m.line);
      if (m.id) ctx.register(m.id, { kind: 'block', text: `${m.kindLabel} ${m.num}`, file: ch.rel, line: m.line, chapter: ch });
    } else if (name === 'figure') {
      allowAttrs(['viz', 'svg', 'height']);
      if (!m.id) err(m.line, 'a figure needs an anchor {#f-...}');
      if (Boolean(m.attrs.viz) === Boolean(m.attrs.svg)) err(m.line, 'a figure takes exactly one of viz="name" or svg="file.svg"');
      if (m.attrs.viz && !m.attrs.height) err(m.line, 'a viz figure needs height="..." in CSS pixels');
      if (m.attrs.height && !/^\d+$/.test(m.attrs.height)) err(m.line, `figure height="${m.attrs.height}" is not a whole number of pixels`);
      fig++;
      m.num = `${c}.${fig}`;
      if (m.id) ctx.register(m.id, { kind: 'figure', text: `Figure ${m.num}`, file: ch.rel, line: m.line, chapter: ch });
      if (m.attrs.viz) m.vizState = ctx.useViz(m.attrs.viz, ch.rel, m.line, m);
      if (m.attrs.svg) m.svgState = ctx.useSvg(m.attrs.svg, ch.rel, m.line, m);
    } else if (BLOCKS[name]) {
      const spec = BLOCKS[name];
      allowAttrs(spec.attrs, spec.flags || [], spec.required || []);
      if (spec.cardOnly && !parentCard) err(m.line, `"${name}" is only used as the first part of a card`);
      if (name === 'sketch') {
        if (!m.attrs.source && !m.cardSource) err(m.line, 'a sketch needs source="key" (or a card with a source) to point to the full proof');
        if (m.attrs.source) ctx.requireReference(m.attrs.source, ch.rel, m.line);
      }
      m.titleFn = m.attrs.title ? titleOf(m.attrs.title) : () => '';
      if (m.id) ctx.register(m.id, lazyText({ kind: 'block', file: ch.rel, line: m.line, chapter: ch }, () => m.titleFn() || `${spec.label} in ${escapeHtml(ch.front.title)}`));
    } else if (name !== 'invalid') {
      err(m.line, `unknown container "${name}"`);
      m.unknown = true;
    }
    stack.push(frame);
  }
}

// An entry whose link text is rendered on first use, after every chapter has been indexed.
function lazyText(entry, fn) {
  let value;
  Object.defineProperty(entry, 'text', { get() { if (value === undefined) value = fn(); return value; }, enumerable: true });
  return entry;
}

function checkCardParts(parts, isLast) {
  const order = ['statement', 'plain', 'why', 'idea'];
  for (let i = 0; i < order.length; i++) {
    if (parts[i] !== order[i]) {
      return `parts begin with statement, plain, why, idea in that order; found ${parts.join(', ') || 'no parts'}`;
    }
  }
  let i = 4;
  if (parts[i] !== 'proof' && parts[i] !== 'sketch') return `after idea comes exactly one proof or sketch; found ${parts.slice(4).join(', ') || 'nothing'}`;
  i++;
  while (parts[i] === 'example' || parts[i] === 'lean') i++;
  if (parts[i] === 'used') i++;
  else if (!isLast && i >= parts.length) return 'a used part is required except in the last chapter';
  if (i < parts.length) return `part "${parts[i]}" is out of place; the order is statement, plain, why, idea, proof or sketch, then example and lean, then used (found ${parts.join(', ')})`;
  return null;
}

// ---------------------------------------------------------------------------------------------------------------
// Pass two: renderer rules. The env passed to markdown-it is made by ctx.renderEnv(ch).

export function installRenderer(md, ctx) {
  const rules = md.renderer.rules;

  rules.math_inline = (tokens, idx, opts, env) => {
    const t = tokens[idx];
    const r = ctx.math.render(t.content, Boolean(t.meta.display));
    env.stats.text += t.content.length * 0.5;
    if (r.error) { ctx.report(env.file, t.meta.line, `KaTeX: ${r.error}`); return `<code class="math-error">${escapeHtml(t.content)}</code>`; }
    return env.rawMath ? r.html : ctx.math.placeholder(r, t.content, Boolean(t.meta.display));
  };

  rules.math_block = (tokens, idx, opts, env) => {
    const t = tokens[idx];
    const r = ctx.math.render(t.content, true);
    let body;
    if (r.error) { ctx.report(env.file, t.meta.line, `KaTeX: ${r.error}`); body = `<code class="math-error">${escapeHtml(t.content)}</code>`; }
    else body = env.rawMath ? r.html : ctx.math.placeholder(r, t.content, true);
    env.stats.eqs++;
    const id = t.meta.id ? ` id="${t.meta.id}"` : '';
    const no = t.meta.num ? `<span class="eq-no">(${t.meta.num})</span>` : '';
    return `<div class="eq${t.meta.num ? ' eq-numbered' : ''}"${id}><div class="eq-math">${body}</div>${no}</div>\n`;
  };

  rules.xref = (tokens, idx, opts, env) => {
    const { id, line } = tokens[idx].meta;
    const target = ctx.registry.get(id);
    if (!target) { ctx.report(env.file, line, `broken reference [[${id}]]`); return `<span class="xref-broken">[[${escapeHtml(id)}]]</span>`; }
    return `<a class="xref" href="#${id}">${target.text}</a>`;
  };

  rules.cite = (tokens, idx, opts, env) => {
    const { items, line } = tokens[idx].meta;
    return ctx.citeHtml(items, env.file, line);
  };

  rules.container_orphan = () => '';

  rules.text = (tokens, idx, opts, env) => { env.stats.text += tokens[idx].content.length; return linkTerms(tokens[idx].content, env, ctx); };

  rules.tr_open = (tokens, idx, opts, env, self) => { env.stats.rows++; return self.renderToken(tokens, idx, opts); };

  const defaultLinkOpen = rules.link_open || ((tokens, idx, opts, env, self) => self.renderToken(tokens, idx, opts));
  rules.link_open = (tokens, idx, opts, env, self) => {
    env.noTerms++;
    const t = tokens[idx];
    const href = t.attrGet('href') || '';
    if (href.startsWith('#')) {
      if (!ctx.registry.has(href.slice(1))) ctx.report(env.file, env.curLine, `broken link target "${href}"`);
    } else if (/^https?:\/\//.test(href)) {
      t.attrSet('rel', 'noopener');
    } else {
      ctx.report(env.file, env.curLine, `link "${href}" is neither an #anchor nor an http(s) URL; the page must stand alone`);
    }
    return defaultLinkOpen(tokens, idx, opts, env, self);
  };
  rules.link_close = (tokens, idx, opts, env, self) => { env.noTerms--; return self.renderToken(tokens, idx, opts); };

  rules.image = () => '';

  rules.table_open = () => '<div class="tablebox"><table>\n';
  rules.table_close = () => '</table></div>\n';

  rules.paragraph_open = (tokens, idx, opts, env, self) => {
    env.stats.paras++;
    if (env.pendingCaption) {
      const head = env.pendingCaption;
      env.pendingCaption = null;
      return `<p>${head} `;
    }
    return self.renderToken(tokens, idx, opts);
  };

  const defaultFence = rules.fence;
  rules.fence = (tokens, idx, opts, env, self) => {
    const info = tokens[idx].info.trim().split(/\s+/)[0];
    if (info === 'vizspec') return '';
    return defaultFence(tokens, idx, opts, env, self);
  };

  rules.heading_open = (tokens, idx, opts, env) => {
    const t = tokens[idx];
    const level = Number(t.tag.slice(1));
    env.noTerms++;
    const id = t.meta.id;
    if (level === 2) {
      env.secStats.push(env.stats);
      env.stats = newStats();
      // The title is one span, so that inline math in it stays in the line instead of becoming a flex item of its own.
      return `\u0000SEC ${id}\u0000<h3 class="sec-title"><span class="sec-no">${t.meta.num}</span><span class="sec-name">`;
    }
    const tag = `h${Math.min(6, level + 1)}`;
    return `<${tag} class="sub-title" id="${id}">`;
  };
  rules.heading_close = (tokens, idx, opts, env) => {
    const t = tokens[idx];
    const open = tokens[idx - 2];
    env.noTerms--;
    const level = Number(t.tag.slice(1));
    const tag = level === 2 ? 'h3' : `h${Math.min(6, level + 1)}`;
    const anchor = `<a class="anchor" href="#${open.meta.id}" aria-label="Link to this section">#</a>`;
    return level === 2 ? `${anchor}</span></h3>\n` : `${anchor}</${tag}>\n`;
  };

  rules.container_open = (tokens, idx, opts, env) => {
    const m = tokens[idx].meta;
    const html = openContainer(m, env, ctx);
    return html;
  };
  rules.container_close = (tokens, idx) => tokens[idx].meta.closeHtml || '</div>\n';
}

function idAttr(m) {
  return m.id ? ` id="${m.id}"` : '';
}

function openContainer(m, env, ctx) {
  const name = m.name;
  if (m.titleFn && m.titleHtml === undefined) m.titleHtml = m.titleFn();
  const src = (key, loc) => (key ? ` <span class="src">${ctx.citeHtml([{ key, loc: loc || '' }], env.file, m.line)}</span>` : '');

  if (name === 'card') {
    env.stats.blocks += 2;
    m.closeHtml = '</div></article>\n';
    return `<article class="card card-${escapeHtml(m.attrs.kind || '')}"${idAttr(m)}><header class="card-head"><span class="card-num">${m.kindLabel} ${m.num}</span><h4 class="card-title">${m.titleHtml}</h4>${src(m.attrs.source, m.attrs.loc)}</header><div class="card-parts">\n`;
  }
  if (NUMBERED[name]) {
    env.stats.blocks++;
    m.closeHtml = '</div></div>\n';
    const title = m.titleHtml ? ` <span class="thm-title">${m.titleHtml}</span>` : '';
    return `<div class="thm thm-${name}"${idAttr(m)}><div class="thm-head"><span class="thm-num">${m.kindLabel} ${m.num}</span>${title}${src(m.attrs.source, m.attrs.loc)}</div><div class="thm-body">\n`;
  }
  if (name === 'figure') return openFigure(m, env, ctx);
  const spec = BLOCKS[name];
  if (!spec) { m.closeHtml = '</div>\n'; return `<div class="blk blk-unknown">`; }
  env.stats.blocks++;

  const qed = name === 'proof' ? '<span class="qed" aria-label="End of proof"></span>' : '';
  let extra = '';
  if (name === 'sketch') extra = src(m.attrs.source || m.cardSource, m.attrs.loc);
  if (name === 'lean') extra = ` <span class="lean-decl"><code>${escapeHtml(m.attrs.decl || '')}</code> in <code>${escapeHtml(m.attrs.file || '')}</code></span>`;
  const collapsed = name === 'recall' ? !m.flags.has('open') : m.flags.has('collapsed');

  if (m.cardPart) {
    const label = `<div class="part-label">${spec.part}</div>`;
    if (collapsed) {
      m.closeHtml = `${qed}</div></details></div>\n`;
      return `<div class="part part-${name}">${label}<details class="part-body"><summary>Show the ${name}</summary>${extra ? `<p class="part-meta">${extra}</p>` : ''}<div class="part-inner">\n`;
    }
    m.closeHtml = `${qed}</div></div>\n`;
    return `<div class="part part-${name}">${label}<div class="part-body">${extra ? `<p class="part-meta">${extra}</p>` : ''}\n`;
  }

  const title = m.titleHtml ? `<span class="blk-title">${m.titleHtml}</span>` : '';
  const head = `<span class="blk-label">${spec.label}</span>${title}${extra}`;
  if (collapsed) {
    m.closeHtml = `${qed}</div></details>\n`;
    return `<details class="blk blk-${name}"${idAttr(m)}><summary>${head}</summary><div class="blk-body">\n`;
  }
  m.closeHtml = `${qed}</div></div>\n`;
  return `<div class="blk blk-${name}"${idAttr(m)}><div class="blk-head">${head}</div><div class="blk-body">\n`;
}

function openFigure(m, env, ctx) {
  const num = `<span class="fig-num">Figure ${m.num}.</span>`;
  env.pendingCaption = num;
  m.closeHtml = '</figcaption></figure>\n';
  const height = Number(m.attrs.height || 0);
  if (m.attrs.viz) {
    env.stats.figPx += height + 140;
    if (m.vizState === 'missing') {
      return `<figure class="fig fig-missing"${idAttr(m)}><div class="viz-missing" style="--hn:${height}"><span>Figure module <code>${escapeHtml(m.attrs.viz)}</code> is not written yet.</span></div><figcaption>`;
    }
    return `<figure class="fig"${idAttr(m)}><div class="viz" data-viz="${escapeHtml(m.attrs.viz)}" style="--hn:${height}"></div><div class="viz-controls"></div><figcaption>`;
  }
  const svg = ctx.svgs.get(m.attrs.svg);
  env.stats.figPx += (height || 360) + 80;
  if (!svg) {
    return `<figure class="fig fig-missing"${idAttr(m)}><div class="viz-missing" style="--hn:${height || 240}"><span>Static figure <code>${escapeHtml(m.attrs.svg)}</code> is missing.</span></div><figcaption>`;
  }
  const style = height ? ` style="--hn:${height}"` : '';
  return `<figure class="fig fig-svg"${idAttr(m)}><div class="svgbox"${style}>${svg}</div><figcaption>`;
}

// Underlines the first use of each glossary term in the chapter. Skipped inside headings, links, and titles.
function linkTerms(text, env, ctx) {
  if (env.noTerms > 0 || !ctx.terms.length || env.termsLeft === 0) return escapeHtml(text);
  let out = '';
  let pos = 0;
  for (;;) {
    let best = null;
    const rest = text.slice(pos);
    for (const term of ctx.terms) {
      if (env.termUsed.has(term.k)) continue;
      const m = term.re.exec(rest);
      if (m && m[0].length && (!best || m.index < best.m.index || (m.index === best.m.index && m[0].length > best.m[0].length))) best = { term, m };
    }
    if (!best) break;
    const at = pos + best.m.index;
    out += escapeHtml(text.slice(pos, at));
    out += `<span role="button" tabindex="0" class="term" data-k="${best.term.k}" aria-expanded="false">${escapeHtml(best.m[0])}</span>`;
    env.termUsed.add(best.term.k);
    env.termsLeft--;
    env.stats.terms++;
    pos = at + best.m[0].length;
  }
  return out + escapeHtml(text.slice(pos));
}

// Splits a rendered chapter body at the section markers and wraps each part in a section element with an estimate
// of its height, used as contain-intrinsic-size while the section is skipped. secStats holds one record per part,
// counted while rendering: characters of prose, display equations, blocks, paragraphs, table rows, figure pixels.
export function wrapSections(html, ch, secStats, formulaElements) {
  const parts = html.split(/\u0000SEC ([^\u0000]+)\u0000/);
  const out = [];
  const wrap = (id, body, st) => {
    if (!id && !body.trim()) return;
    const fixed = 60 + st.eqs * 64 + st.blocks * 46 + st.paras * 14 + st.rows * 36 + st.figPx;
    const attrs = id ? ` id="${id}" data-sec="${id}"` : ' data-sec=""';
    out.push(`<section class="sec"${attrs} data-ch="${ch.num}" style="--fx:${Math.round(fixed)};--tc:${Math.round(st.text)}">${splitUnits(body, formulaElements)}</section>`);
  };
  wrap(null, parts[0], secStats[0]);
  for (let i = 1; i < parts.length; i += 2) wrap(parts[i], parts[i + 1], secStats[(i + 1) / 2]);
  return out.join('\n');
}

// Units. A section is laid out by the browser all at once when it comes near the window, and its cost follows the
// number of elements drawn: about 0.1 ms each at 4x CPU slowdown, so a section full of math costs a frame of 100 to
// 300 ms. So a section estimated above UNIT_SPLIT px or UNIT_EL * 1.5 elements is cut between its top-level blocks
// into runs of about UNIT_PX or UNIT_EL elements (div.cvu, skipped by content-visibility like the section), and a
// result card heavier than UNIT_EL is cut the same way between its parts; the browser then lays out a long section a
// unit at a time. Each unit carries the same kind of height estimate as a section. Smaller units do not help: each
// skipped box adds work to every frame, and a unit of 250 to 400 px made the slow frames more frequent.
const UNIT_SPLIT = 1200;
const UNIT_PX = 700;
const UNIT_EL = 600;
const VOID = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr']);
const TAG = /<!--[\s\S]*?-->|<(\/?)([a-zA-Z][\w:-]*)((?:\s+[^\s"'>/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s"'>]+))?)*)\s*(\/?)>/g;

// The top-level elements of an HTML fragment, each with the text before it.
function topLevelBlocks(html) {
  const blocks = [];
  let depth = 0;
  let start = 0;
  for (const m of html.matchAll(TAG)) {
    if (m[0].startsWith('<!--')) continue;
    const [all, close, name, , self] = m;
    const end = m.index + all.length;
    if (close) {
      depth--;
      if (depth < 0) throw new Error(`unbalanced </${name}> in a section`);
      if (depth === 0) { blocks.push(html.slice(start, end)); start = end; }
    } else if (self || VOID.has(name.toLowerCase())) {
      if (depth === 0) { blocks.push(html.slice(start, end)); start = end; }
    } else {
      depth++;
    }
  }
  if (depth !== 0) throw new Error('unclosed element in a section');
  const rest = html.slice(start);
  if (rest.trim()) blocks.push(rest);
  else if (blocks.length) blocks[blocks.length - 1] += rest;
  return blocks;
}

// Height estimate of a piece of rendered HTML, in the terms of a section's: fixed pixels and characters of prose.
function estimate(html) {
  const count = (re) => (html.match(re) || []).length;
  let fig = 0;
  for (const m of html.matchAll(/<figure[^>]*>[\s\S]*?--hn:(\d+)/g)) fig += Number(m[1]) + 140;
  const fixed = 20 + count(/<k-d /g) * 64 + count(/class="(?:blk|thm|card)[ "]/g) * 46 + count(/<p[ >]/g) * 14 + count(/<tr[ >]/g) * 36 + fig;
  const text = html.replace(/<[^>]+>/g, '').length;
  return { fixed, text, px: fixed + text * 0.36 };
}

// Elements the browser draws for a piece of rendered HTML: its own tags, the elements of each formula's rendering, and
// nothing inside a closed details element, which is not drawn until it is opened.
function weight(html, formulaElements) {
  let n = 0;
  let skip = 0;
  for (const m of html.matchAll(TAG)) {
    if (m[0].startsWith('<!--')) continue;
    const [, close, name, attrs, self] = m;
    const tag = name.toLowerCase();
    if (skip) {
      if (tag === 'details' && !self) skip += close ? -1 : 1;
      continue;
    }
    if (close) continue;
    if (tag === 'details' && !/\sopen(?:[\s=]|$)/.test(attrs)) { skip = 1; continue; }
    n++;
    if (tag === 'k-m' || tag === 'k-d') {
      const id = /\bi="T(\d+)"/.exec(attrs);
      if (id) n += formulaElements(Number(id[1]));
    }
  }
  return n;
}

// The end of the element that opens at html[start] (its closing tag's end).
function elementEnd(html, start) {
  const re = new RegExp(TAG.source, 'g');
  re.lastIndex = start;
  let depth = 0;
  for (let m = re.exec(html); m; m = re.exec(html)) {
    if (m[0].startsWith('<!--')) continue;
    const [all, close, name, , self] = m;
    if (self || VOID.has(name.toLowerCase())) continue;
    depth += close ? -1 : 1;
    if (depth === 0) return m.index + all.length;
  }
  throw new Error('unclosed element in a section');
}

const unitDiv = (html) => { const e = estimate(html); return `<div class="cvu" style="--fx:${Math.round(e.fixed)};--tc:${e.text}">${html}</div>`; };

// Groups blocks into runs of about UNIT_PX or UNIT_EL; a short last run joins the one before.
function groupBlocks(blocks, w) {
  const runs = [];
  let cur = '';
  for (const b of blocks) {
    cur += b;
    if (estimate(cur).px >= UNIT_PX || w(cur) >= UNIT_EL) { runs.push(cur); cur = ''; }
  }
  if (cur) {
    if (runs.length && estimate(cur).px < UNIT_PX / 3 && w(cur) < UNIT_EL / 3) runs[runs.length - 1] += cur;
    else runs.push(cur);
  }
  return runs;
}

// A result card heavier than a unit, with its parts grouped into units; null if it has too few parts to cut.
function splitCard(card, w) {
  const open = card.indexOf('<div class="card-parts">');
  if (open < 0) return null;
  const close = elementEnd(card, open);
  const innerStart = open + '<div class="card-parts">'.length;
  const innerEnd = close - '</div>'.length;
  const runs = groupBlocks(topLevelBlocks(card.slice(innerStart, innerEnd)), w);
  if (runs.length < 2) return null;
  return card.slice(0, innerStart) + runs.map(unitDiv).join('') + card.slice(innerEnd);
}

function splitUnits(body, formulaElements) {
  const w = (html) => weight(html, formulaElements);
  if (estimate(body).px <= UNIT_SPLIT && w(body) <= UNIT_EL * 1.5) return body;
  const blocks = topLevelBlocks(body);
  // A heavy card is cut inside and stands on its own between units.
  const items = blocks.map((b) => {
    const cut = w(b) > UNIT_EL && /^\s*<article class="card[ "]/.test(b) ? splitCard(b, w) : null;
    return cut ? { cut } : { html: b };
  });
  const out = [];
  let plain = [];
  const flush = () => { if (plain.length) out.push(...groupBlocks(plain, w).map((r) => ({ run: r }))); plain = []; };
  for (const it of items) {
    if (it.cut) { flush(); out.push({ cut: it.cut }); } else plain.push(it.html);
  }
  flush();
  if (out.length < 2 && !out.some((o) => o.cut)) return body;
  return out.map((o) => (o.cut ? o.cut : unitDiv(o.run))).join('');
}

export function newStats() {
  return { text: 0, eqs: 0, blocks: 0, paras: 0, rows: 0, figPx: 0, terms: 0 };
}

export function readSvg(file) {
  let svg = fs.readFileSync(file, 'utf8');
  svg = svg.replace(/<\?xml[^>]*\?>/g, '').replace(/<!DOCTYPE[^>]*>/gi, '').replace(/<!--[\s\S]*?-->/g, '').trim();
  if (!svg.startsWith('<svg')) throw new Error(`${path.basename(file)} does not start with <svg>`);
  if (/(?:href|src)\s*=\s*["']\s*(?:https?:|\/\/)/i.test(svg)) throw new Error(`${path.basename(file)} refers to an external resource`);
  if (/<script/i.test(svg)) throw new Error(`${path.basename(file)} contains a script`);
  return svg;
}
