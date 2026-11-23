// Markdown parsing for chapter files: CommonMark plus the containers, math, references, and citations of AUTHORING.md.
// Parsing only produces tokens. Numbering and rendering happen in render.mjs, so every chapter is parsed before any
// reference is resolved.

import MarkdownIt from 'markdown-it';

const COLON = 0x3a;
const DOLLAR = 0x24;

// Attribute block: {#id key="value" key='value' flag}. Returns { id, attrs, flags } or an error string.
export function parseAttrs(text) {
  const out = { id: null, attrs: {}, flags: new Set() };
  if (!text) return out;
  let rest = text.trim();
  if (!rest.startsWith('{') || !rest.endsWith('}')) return { error: `attributes must be one {...} block, got "${text}"` };
  rest = rest.slice(1, -1).trim();
  const re = /^(?:#([A-Za-z0-9_:.-]+)|([A-Za-z][\w-]*)="([^"]*)"|([A-Za-z][\w-]*)='([^']*)'|([A-Za-z][\w-]*)=([^\s"'{}]+)|([A-Za-z][\w-]*))(?:\s+|$)/;
  while (rest.length) {
    const m = re.exec(rest);
    if (!m) return { error: `cannot read attributes at "${rest}"` };
    if (m[1]) {
      if (out.id) return { error: `two anchors in one attribute block (#${out.id} and #${m[1]})` };
      out.id = m[1];
    } else if (m[2]) out.attrs[m[2]] = m[3];
    else if (m[4]) out.attrs[m[4]] = m[5];
    else if (m[6]) out.attrs[m[6]] = m[7];
    else out.flags.add(m[8]);
    rest = rest.slice(m[0].length);
  }
  return out;
}

function lineText(state, line) {
  return state.src.slice(state.bMarks[line] + state.tShift[line], state.eMarks[line]);
}

function report(state, line, message) {
  state.env.report(state.env.lineBase + line + 1, message);
}

// Fenced containers. The closing line has exactly as many colons as the opening line. An inner container uses
// fewer colons than its parent.
function containerRule(state, startLine, endLine, silent) {
  if (state.sCount[startLine] - state.blkIndent >= 4) return false;
  const start = state.bMarks[startLine] + state.tShift[startLine];
  if (state.src.charCodeAt(start) !== COLON) return false;
  const text = lineText(state, startLine);
  const head = /^(:{3,})(.*)$/.exec(text);
  if (!head) return false;
  if (silent) return true;

  const colons = head[1].length;
  const rest = head[2].trim();
  if (!rest) {
    report(state, startLine, `closing fence "${head[1]}" has no open container with ${colons} colons`);
    const token = state.push('container_orphan', '', 0);
    token.map = [startLine, startLine + 1];
    state.line = startLine + 1;
    return true;
  }

  const nameMatch = /^([A-Za-z][\w-]*)\s*(\{.*\})?\s*$/.exec(rest);
  let name = 'invalid';
  let parsed = { id: null, attrs: {}, flags: new Set() };
  if (!nameMatch) {
    report(state, startLine, `cannot read container line "${text}"`);
  } else {
    name = nameMatch[1];
    const attrs = parseAttrs(nameMatch[2]);
    if (attrs.error) report(state, startLine, attrs.error);
    else parsed = attrs;
  }

  // Find the matching close, skipping fenced code.
  let fence = null;
  let close = -1;
  let next = startLine + 1;
  for (; next < endLine; next++) {
    const lineStart = state.bMarks[next] + state.tShift[next];
    if (lineStart < state.eMarks[next] && state.sCount[next] < state.blkIndent) break;
    const s = lineText(state, next);
    const f = /^(`{3,}|~{3,})(.*)$/.exec(s);
    if (fence) {
      if (f && f[1][0] === fence[0] && f[1].length >= fence.length && !f[2].trim()) fence = null;
      continue;
    }
    if (f) { fence = f[1]; continue; }
    const c = /^(:{3,})(.*)$/.exec(s);
    if (!c) continue;
    const n = c[1].length;
    if (!c[2].trim()) {
      if (n === colons) { close = next; break; }
      if (n > colons) {
        report(state, startLine, `container "${name}" is not closed: line ${state.env.lineBase + next + 1} closes with ${n} colons, but this container opened with ${colons}`);
        break;
      }
    } else if (n >= colons) {
      report(state, next, `container "${c[2].trim().split(/[\s{]/)[0]}" is nested inside "${name}" (line ${state.env.lineBase + startLine + 1}) but does not use fewer colons`);
    }
  }
  const end = close >= 0 ? close : next;
  if (close < 0 && next >= endLine) {
    report(state, startLine, `container "${name}" opened with ${colons} colons is never closed`);
  }

  const oldParent = state.parentType;
  const oldLineMax = state.lineMax;
  state.parentType = 'container';
  state.lineMax = end;

  const open = state.push('container_open', 'div', 1);
  open.markup = head[1];
  open.info = name;
  open.block = true;
  open.map = [startLine, end + (close >= 0 ? 1 : 0)];
  open.meta = { name, id: parsed.id, attrs: parsed.attrs, flags: parsed.flags, line: state.env.lineBase + startLine + 1 };

  state.md.block.tokenize(state, startLine + 1, end);

  const shut = state.push('container_close', 'div', -1);
  shut.markup = head[1];
  shut.info = name;
  shut.block = true;
  shut.meta = open.meta;

  state.parentType = oldParent;
  state.lineMax = oldLineMax;
  state.line = close >= 0 ? close + 1 : end;
  return true;
}

// Display math: "$$" alone on a line, the formula, then "$$" alone, optionally followed by an anchor "{#eq-id}".
function mathBlockRule(state, startLine, endLine, silent) {
  if (state.sCount[startLine] - state.blkIndent >= 4) return false;
  const start = state.bMarks[startLine] + state.tShift[startLine];
  if (state.src.charCodeAt(start) !== DOLLAR || state.src.charCodeAt(start + 1) !== DOLLAR) return false;
  const text = lineText(state, startLine).trim();
  if (silent) return true;

  const token = state.push('math_block', 'div', 0);
  token.block = true;
  token.meta = { id: null, line: state.env.lineBase + startLine + 1 };

  if (text !== '$$') {
    // A one-line "$$ x $$" or "$$ x" breaks the contract: delimiters go on their own lines.
    const one = /^\$\$(.+?)\$\$\s*(\{#([A-Za-z0-9_:.-]+)\})?$/.exec(text);
    report(state, startLine, 'display math delimiters "$$" must stand on their own lines');
    if (one) {
      token.content = one[1];
      token.meta.id = one[3] || null;
      token.map = [startLine, startLine + 1];
      state.line = startLine + 1;
      return true;
    }
  }

  let next = startLine + 1;
  let closed = false;
  for (; next < endLine; next++) {
    const lineStart = state.bMarks[next] + state.tShift[next];
    if (lineStart < state.eMarks[next] && state.sCount[next] < state.blkIndent) break;
    const s = lineText(state, next).trim();
    if (s.startsWith('$$')) {
      const m = /^\$\$\s*(?:\{#([A-Za-z0-9_:.-]+)\})?\s*$/.exec(s);
      if (!m) report(state, next, `cannot read the closing display math line "${s}"; expected "$$" or "$$ {#eq-id}"`);
      else token.meta.id = m[1] || null;
      closed = true;
      break;
    }
  }
  if (!closed) report(state, startLine, 'display math "$$" is never closed');
  token.content = state.getLines(startLine + 1, next, state.blkIndent, false).trim();
  token.map = [startLine, closed ? next + 1 : next];
  state.line = closed ? next + 1 : next;
  return true;
}

function inlineLine(state, pos) {
  let n = 0;
  for (let i = 0; i < pos; i++) if (state.src.charCodeAt(i) === 0x0a) n++;
  return (state.env.curLine || 0) + n;
}

// Inline math $...$: the opening $ is not followed by a space, the closing $ is not preceded by a space and not
// followed by a digit. "\$" is a literal dollar sign.
function mathInlineRule(state, silent) {
  const src = state.src;
  const start = state.pos;
  if (src.charCodeAt(start) !== DOLLAR) return false;
  if (src.charCodeAt(start + 1) === DOLLAR) {
    if (!silent) state.env.report(inlineLine(state, start), 'inline "$$" found: display math needs "$$" on its own lines');
    if (!silent) {
      const end = src.indexOf('$$', start + 2);
      const token = state.push('math_inline', 'span', 0);
      token.content = end > 0 ? src.slice(start + 2, end) : '';
      token.meta = { line: inlineLine(state, start), display: true };
      state.pos = end > 0 ? end + 2 : src.length;
      return true;
    }
    return false;
  }
  const first = src.charCodeAt(start + 1);
  if (!first || first === 0x20 || first === 0x09 || first === 0x0a) return false;
  let i = start + 1;
  let found = -1;
  while (i < state.posMax) {
    const ch = src.charCodeAt(i);
    if (ch === 0x5c) { i += 2; continue; }
    if (ch === DOLLAR) {
      const prev = src.charCodeAt(i - 1);
      const after = src.charCodeAt(i + 1);
      if (prev !== 0x20 && prev !== 0x09 && prev !== 0x0a && !(after >= 0x30 && after <= 0x39)) { found = i; break; }
    }
    i++;
  }
  if (found < 0) {
    if (!silent) state.env.report(inlineLine(state, start), `inline math opened with "$" is never closed (write "\\$" for a dollar sign): "${src.slice(start, start + 40)}"`);
    return false;
  }
  if (!silent) {
    const token = state.push('math_inline', 'span', 0);
    token.content = src.slice(start + 1, found);
    token.meta = { line: inlineLine(state, start) };
  }
  state.pos = found + 1;
  return true;
}

// [[id]] cross-references.
function xrefRule(state, silent) {
  const src = state.src;
  const start = state.pos;
  if (src.charCodeAt(start) !== 0x5b || src.charCodeAt(start + 1) !== 0x5b) return false;
  const m = /^\[\[([^\]\s]+)\]\]/.exec(src.slice(start, Math.min(state.posMax, start + 200)));
  if (!m) return false;
  if (!silent) {
    const token = state.push('xref', 'a', 0);
    token.meta = { id: m[1], line: inlineLine(state, start) };
  }
  state.pos = start + m[0].length;
  return true;
}

// [@key] and [@key, loc], and several separated by semicolons: [@a, §2; @b].
function citeRule(state, silent) {
  const src = state.src;
  const start = state.pos;
  if (src.charCodeAt(start) !== 0x5b || src.charCodeAt(start + 1) !== 0x40) return false;
  const end = src.indexOf(']', start);
  if (end < 0 || end > state.posMax) return false;
  const body = src.slice(start + 1, end);
  const items = [];
  for (const part of body.split(';')) {
    const m = /^\s*@([A-Za-z0-9_:.-]+)\s*(?:,\s*(.+?))?\s*$/.exec(part);
    if (!m) {
      if (!silent) state.env.report(inlineLine(state, start), `cannot read citation "[${body}]"; expected [@key] or [@key, location]`);
      return false;
    }
    items.push({ key: m[1], loc: m[2] || '' });
  }
  if (!silent) {
    const token = state.push('cite', 'span', 0);
    token.meta = { items, line: inlineLine(state, start) };
  }
  state.pos = end + 1;
  return true;
}

// Heading anchors "## Title {#id}" become the heading's id.
function headingIds(state) {
  const tokens = state.tokens;
  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i];
    if (t.type !== 'heading_open') continue;
    const inline = tokens[i + 1];
    const m = /\s*\{#([A-Za-z0-9_:.-]+)\}\s*$/.exec(inline.content);
    t.meta = { id: null, line: state.env.lineBase + t.map[0] + 1 };
    if (m) {
      t.meta.id = m[1];
      inline.content = inline.content.slice(0, m.index);
    } else if (/\{[^}]*\}\s*$/.test(inline.content)) {
      state.env.report(t.meta.line, `cannot read heading anchor in "${inline.content}"; expected {#id}`);
    }
  }
}

// The core inline step, with the source line recorded so inline errors can name it.
function inlineWithLines(state) {
  for (const tok of state.tokens) {
    if (tok.type !== 'inline') continue;
    if (tok.map) state.env.curLine = state.env.lineBase + tok.map[0] + 1;
    state.md.inline.parse(tok.content, state.md, state.env, tok.children);
  }
}

export function createMarkdown() {
  const md = new MarkdownIt('commonmark', { html: false, typographer: true, quotes: '“”‘’' });
  md.enable(['table', 'strikethrough', 'smartquotes']);
  const alt = ['paragraph', 'reference', 'blockquote', 'list'];
  md.block.ruler.before('fence', 'container', containerRule, { alt });
  md.block.ruler.before('fence', 'math_block', mathBlockRule, { alt });
  md.inline.ruler.before('escape', 'math_inline', mathInlineRule);
  md.inline.ruler.before('link', 'xref', xrefRule);
  md.inline.ruler.before('link', 'cite', citeRule);
  md.core.ruler.after('block', 'heading_ids', headingIds);
  md.core.ruler.at('inline', inlineWithLines);
  return md;
}

// Splits a chapter file into front matter and body, keeping the line offset of the body.
export function splitFrontMatter(text) {
  const normalized = text.replace(/\r\n?/g, '\n');
  if (!normalized.startsWith('---\n')) return { front: null, body: normalized, lineBase: 0 };
  const end = normalized.indexOf('\n---\n', 4);
  const endAtEof = normalized.endsWith('\n---') ? normalized.length - 4 : -1;
  const stop = end >= 0 ? end : endAtEof;
  if (stop < 0) return { front: null, body: normalized, lineBase: 0, error: 'front matter is not closed with "---"' };
  const front = normalized.slice(4, stop);
  const body = normalized.slice(stop + 5);
  const lineBase = front.split('\n').length + 2;
  return { front, body, lineBase };
}
