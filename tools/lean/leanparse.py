"""Shared regex-level Lean 4 parsing helpers for the tools in this folder.

Nothing here runs Lean. A file is read as text, comments and string literals are blanked out
(offsets and newlines preserved), and declarations, namespaces and opens are found with regular
expressions. The results are heuristic: see the notes in each tool.
"""

import bisect
import re

KINDS = ("theorem", "lemma", "def", "abbrev", "structure", "class", "instance", "inductive", "axiom", "opaque")

_CODE_TOK = re.compile(r'/-|--|"(?:\\.|[^"\\])*"|\'"\'', re.S)
_COMMENT_TOK = re.compile(r'/-|-/')
_BLANK = re.compile(r'[^\n]')

COUNT_WORDS = ("sorry", "admit", "axiom", "native_decide", "unsafe", "implemented_by", "ofReduceBool", "sorryAx")
_COUNT_RE = re.compile(r'\b(' + '|'.join(COUNT_WORDS) + r')\b')

_MODS = r'(?:(?:@\[[^\]\n]*\]|private|protected|noncomputable|unsafe|partial|nonrec|scoped|local|public|meta)[ \t]+)*'
_EVENT = re.compile(
    r'^(?:'
    r'(?P<ns>namespace[ \t]+(?P<nsname>\S+))'
    r'|(?P<sec>section\b[ \t]*(?P<secname>\S*))'
    r'|(?P<end>end\b[ \t]*(?P<endname>\S*))'
    r'|(?P<open>open\b(?P<opentext>[^\n]*(?:\n[ \t]+\S[^\n]*)*))'
    r'|(?P<decl>(?P<pre>' + _MODS + r')(?P<kind>theorem|lemma|def|abbrev|structure|class[ \t]+inductive|class|instance|inductive|axiom|opaque)\b[ \t]*)'
    r')', re.M)

_CMD = re.compile(
    r'^(?:@\[|theorem\b|lemma\b|def\b|abbrev\b|structure\b|class\b|instance\b|inductive\b|axiom\b|opaque\b|namespace\b|section\b|end\b|open\b|'
    r'variable\b|universe\b|attribute\b|set_option\b|noncomputable\b|private\b|protected\b|mutual\b|macro\b|notation\b|syntax\b|local\b|'
    r'scoped\b|example\b|unsafe\b|partial\b|nonrec\b|#|export\b|elab\b|initialize\b|alias\b|import\b|deriving\b|infix|prefix|postfix)', re.M)

_STMT_END = re.compile(
    r'[(\[{⟨⦃)\]}⟩⦄]|:=|\bwhere\b|\n[ \t]*\|(?!\|)|\n(?=(?:theorem|lemma|def|abbrev|structure|class|instance|inductive|axiom|opaque|namespace|section|end|open|@\[|variable|universe|attribute|set_option|noncomputable|private|protected|mutual|example)\b)')
_OPENERS = "([{⟨⦃"
_CLOSERS = ")]}⟩⦄"
_NAME = re.compile(r'[^\s:({\[⦃⟨]+')
_PRIORITY = re.compile(r'\(priority\s*:=[^)]*\)\s*')
_IMPORT = re.compile(r'^import[ \t]+(?:all[ \t]+)?(\S+)', re.M)
_IDENT = re.compile(r"[A-Za-z_\u0370-\u03ff\u2100-\u214f\u1d00-\u1dbf«][\w'!?.\u0370-\u03ff\u2100-\u214f\u1d00-\u1dbf\u2080-\u209c«»]*")


def mask(text):
    """Blank out comments and string literals. Returns (masked, comments).

    masked has the same length and newlines as text. comments is a list of
    (kind, start, end) with kind one of '/--' (doc), '/-!' (module doc), '/-' (plain block), '--' (line).
    """
    out = []
    comments = []
    pos = 0
    last = 0
    n = len(text)
    while pos < n:
        m = _CODE_TOK.search(text, pos)
        if m is None:
            break
        tok = m.group()
        s = m.start()
        if tok == '--':
            e = text.find('\n', s)
            if e < 0:
                e = n
            out.append(text[last:s])
            out.append(' ' * (e - s))
            comments.append(('--', s, e))
            last = pos = e
        elif tok == '/-':
            depth = 1
            p = m.end()
            while depth and p < n:
                c = _COMMENT_TOK.search(text, p)
                if c is None:
                    p = n
                    break
                if c.group() == '/-':
                    depth += 1
                else:
                    depth -= 1
                p = c.end()
            third = text[s + 2:s + 3]
            kind = '/--' if third == '-' else '/-!' if third == '!' else '/-'
            out.append(text[last:s])
            out.append(_BLANK.sub(' ', text[s:p]))
            comments.append((kind, s, p))
            last = pos = p
        else:
            e = m.end()
            if tok != '\'"\'':
                out.append(text[last:s])
                out.append(_BLANK.sub(' ', text[s:e]))
                last = e
            pos = e
    out.append(text[last:])
    return ''.join(out), comments


def clean_doc(raw):
    """Strip the /-- ... -/ or /-! ... -/ delimiters from a comment."""
    t = raw
    if t.startswith('/--') or t.startswith('/-!'):
        t = t[3:]
    elif t.startswith('/-'):
        t = t[2:]
    if t.endswith('-/'):
        t = t[:-2]
    return t.strip()


def _parse_open(text):
    """Namespaces named by the text after `open`, ignoring (..) lists and hiding/renaming clauses."""
    text = re.sub(r'\([^)]*\)', ' ', text)
    text = re.split(r'\b(?:hiding|renaming)\b', text)[0]
    text = re.sub(r'\bin\b.*$', '', text, flags=re.S)
    return [t for t in text.split() if t != 'scoped']


def parse_file(raw, stmt_cap=1500, doc_cap=600, moddoc_cap=4000):
    """Parse one Lean file's text.

    Returns a dict with imports, doc counts, the first module doc, sorry-style counts and example lines,
    and the declaration tuples
    (kind, full_name, line, stmt_end_line, body_end_line, namespace, opens, stmt, doc, private, off0, off1, off2)
    where off0..off2 are character offsets of the keyword line start, the end of the statement, and the end of the body.
    """
    masked, comments = mask(raw)
    nl = [m.start() for m in re.finditer('\n', raw)]

    def line_of(off):
        return bisect.bisect_left(nl, off) + 1

    n_doc = sum(1 for c in comments if c[0] == '/--')
    n_mod = sum(1 for c in comments if c[0] == '/-!')
    n_block = sum(1 for c in comments if c[0] == '/-')
    n_line = sum(1 for c in comments if c[0] == '--')
    moddoc = ''
    for k, s, e in comments:
        if k == '/-!':
            moddoc = clean_doc(raw[s:e])[:moddoc_cap]
            break
    docs = [(e, raw[s:e]) for k, s, e in comments if k == '/--']
    doc_ends = [d[0] for d in docs]
    imports = _IMPORT.findall(masked)

    counts = {}
    flags = []
    per_word = {}
    for m in _COUNT_RE.finditer(masked):
        w = m.group(1)
        counts[w] = counts.get(w, 0) + 1
        if per_word.get(w, 0) < 5:
            per_word[w] = per_word.get(w, 0) + 1
            ln = line_of(m.start())
            a = nl[ln - 2] + 1 if ln >= 2 else 0
            b = nl[ln - 1] if ln - 1 < len(nl) else len(raw)
            flags.append((w, ln, raw[a:b].strip()[:200]))

    cmd_starts = [m.start() for m in _CMD.finditer(masked)]
    decls = []
    stack = []  # entries: [kind, name, opens_added]
    top_opens = []
    temp_opens = []

    def cur_ns():
        return '.'.join(e[1] for e in stack if e[0] == 'ns')

    def cur_opens():
        res = list(top_opens)
        for e in stack:
            res.extend(e[2])
        res.extend(temp_opens)
        return res

    for m in _EVENT.finditer(masked):
        if m['ns']:
            stack.append(['ns', m['nsname'], []])
        elif m['sec'] is not None:
            stack.append(['sec', m['secname'], []])
        elif m['end'] is not None:
            if stack:
                stack.pop()
        elif m['open'] is not None:
            text = m['opentext']
            names = _parse_open(text)
            if re.search(r'\bin\b', text):
                temp_opens = names
            elif stack:
                stack[-1][2].extend(names)
            else:
                top_opens.extend(names)
        elif m['decl'] is not None:
            kw = m['kind']
            kind = 'inductive' if kw.startswith('class') and 'inductive' in kw else kw
            kstart = m.start('kind')
            p = m.end()
            pm = _PRIORITY.match(masked, p)
            if pm:
                p = pm.end()
            line = line_of(kstart)
            nm = _NAME.match(masked, p)
            if nm:
                name = nm.group()
                name_end = nm.end()
            else:
                name = 'instance@%d' % line
                name_end = p
            if name.startswith('_root_.'):
                full = name[7:]
            else:
                ns = cur_ns()
                full = ns + '.' + name if ns else name
            private = 1 if 'private' in m['pre'] else 0
            depth = 0
            q = name_end
            while True:
                t = _STMT_END.search(masked, q)
                if t is None:
                    s_end = len(masked)
                    break
                tok = t.group()
                if tok in _OPENERS:
                    depth += 1
                elif tok in _CLOSERS:
                    depth = max(0, depth - 1)
                elif depth == 0:
                    s_end = t.start()
                    break
                q = t.end()
            i = bisect.bisect_right(cmd_starts, kstart)
            b_end = cmd_starts[i] if i < len(cmd_starts) else len(raw)
            if b_end < s_end:
                b_end = s_end
            stmt = ' '.join(raw[name_end:s_end].split())[:stmt_cap]
            di = bisect.bisect_right(doc_ends, kstart) - 1
            doc = ''
            if di >= 0:
                gap = masked[doc_ends[di]:kstart]
                if all((not ln_.strip()) or ln_.strip().startswith('@[') for ln_ in gap.split('\n')):
                    doc = clean_doc(docs[di][1])[:doc_cap]
            decls.append((kind, full, line, line_of(max(s_end - 1, kstart)), line_of(max(b_end - 1, kstart)), cur_ns(),
                          ' '.join(cur_opens()), stmt, doc, private, m.start(), s_end, b_end))
            temp_opens = []
    return {'imports': imports, 'n_doc': n_doc, 'n_moddoc': n_mod, 'n_block': n_block, 'n_line': n_line,
            'moddoc': moddoc, 'counts': counts, 'flags': flags, 'decls': decls,
            'lines': len(nl) + (0 if (not raw or raw.endswith('\n')) else 1)}


def identifiers(masked_body):
    """Distinct identifier-like tokens (dotted names kept whole) in masked Lean text."""
    seen = {}
    for m in _IDENT.finditer(masked_body):
        t = m.group().rstrip('.')
        if t:
            seen[t] = None
    return list(seen)
