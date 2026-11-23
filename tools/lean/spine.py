"""Declaration-level dependency tracing over the SQLite index built by index.py (heuristic).

Usage:
  python spine.py NAME [NAME ...] --cache PATH/TO/lean-index --root PATH/TO/src
                  [--depth 4] [--fanout 10] [--max-nodes 300] [--stmt] [--stmt-cap 600] [--body] [--md]

For each NAME (a fully qualified declaration name as indexed) it prints the statement and, with --body,
the proof body, then lists the project declarations that the body mentions and recurses breadth-first.

How references are found: the body is read from the file with comments and strings blanked out, every
identifier-like token is collected, and each token (and each token with trailing components stripped,
for field-style uses such as `foo.symm`) is looked up in the declaration index under the namespace
chain of the enclosing declaration and its `open` list. A match counts only if its module is in the
transitive import closure of the declaration's module (private names only in their own file). A leading
`_root_.` pins the name to the root namespace. It cannot
see: generalized field notation on locals (`h.le`), names produced by macros or `deriving`, instances
found by typeclass search, simp lemmas used implicitly, notations, and identifiers shadowed by local
binders. It over-reports when a local variable has the same name as a declaration in scope.

When a declaration mentions more than --fanout project declarations, the kept ones are ranked:
theorems and lemmas first, then declarations in a different file from the parent, then order of first
appearance in the body. The cut count is printed. The same declaration is expanded only once.
"""

import argparse
import collections
import os
import sqlite3
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import closure as closure_mod  # noqa: E402
import leanparse  # noqa: E402

sys.stdout.reconfigure(encoding='utf-8')


class Index:
    def __init__(self, cache, root):
        self.root = root
        self.db = sqlite3.connect(os.path.join(cache, 'index.sqlite'))
        self.files = {}
        for fid, path, module in self.db.execute('SELECT id, path, module FROM files'):
            self.files[fid] = (path, module)
        self.module_fid = {m: fid for fid, (p, m) in self.files.items()}
        self.by_name = collections.defaultdict(list)
        self.decl_file = {}
        self.decl_kind = {}
        self.decl_private = {}
        for did, name, fid, kind, priv in self.db.execute('SELECT id, name, file_id, kind, private FROM decls'):
            self.by_name[name].append(did)
            self.decl_file[did] = fid
            self.decl_kind[did] = kind
            self.decl_private[did] = priv
        mods, edges = closure_mod.load_graph(self.db)
        self.edges = edges
        self.mods = mods
        self._closures = {}
        self._raw = {}

    def closure_of(self, module):
        c = self._closures.get(module)
        if c is None:
            c = set(closure_mod.closure(self.mods, self.edges, module)[0])
            self._closures[module] = c
        return c

    def decl_row(self, did):
        r = self.db.execute('SELECT d.id, d.name, d.kind, d.line, d.stmt_end_line, d.end_line, d.ns, c.opens, d.stmt, d.doc, d.private,'
                            ' d.off0, d.off1, d.off2, d.file_id FROM decls d JOIN ctx c ON c.id = d.ctx_id WHERE d.id = ?', (did,)).fetchone()
        keys = ['id', 'name', 'kind', 'line', 'stmt_end_line', 'end_line', 'ns', 'opens', 'stmt', 'doc', 'private', 'off0', 'off1', 'off2', 'file_id']
        d = dict(zip(keys, r))
        d['path'], d['module'] = self.files[d['file_id']]
        return d

    def raw(self, fid):
        t = self._raw.get(fid)
        if t is None:
            with open(os.path.join(self.root, self.files[fid][0]), 'rb') as f:
                t = f.read().decode('utf-8', errors='replace')
            if len(self._raw) > 50:
                self._raw.clear()
            self._raw[fid] = t
        return t

    def statement(self, d):
        return self.raw(d['file_id'])[d['off0']:d['off1']].strip()

    def body(self, d):
        return self.raw(d['file_id'])[d['off1']:d['off2']].rstrip()

    def find(self, name):
        ids = self.by_name.get(name, [])
        return [self.decl_row(i) for i in ids]

    def references(self, d, with_stmt=False):
        """Project declarations mentioned in d's body. Returns a list of (decl_id, ambiguous_count) in order of first appearance."""
        raw = self.raw(d['file_id'])
        text = raw[d['off0'] if with_stmt else d['off1']:d['off2']]
        masked, _ = leanparse.mask(text)
        toks = leanparse.identifiers(masked)
        ns_parts = d['ns'].split('.') if d['ns'] else []
        prefixes = ['.'.join(ns_parts[:i]) for i in range(len(ns_parts), -1, -1)]
        opens = d['opens'].split() if d['opens'] else []
        clos = self.closure_of(d['module'])
        out = []
        seen = set()
        for t in toks:
            rooted = t.startswith('_root_.')
            if rooted:
                t = t[7:]
            parts = t.split('.')
            found = None
            for k in range(len(parts), 0, -1):
                v = '.'.join(parts[:k])
                cands = []
                for p in ([''] if rooted else prefixes):
                    cands.append(p + '.' + v if p else v)
                    for o in ([] if rooted else opens):
                        cands.append((p + '.' + o if p else o) + '.' + v)
                for c in cands:
                    ids = self.by_name.get(c)
                    if not ids:
                        continue
                    ok = [i for i in ids if (self.files[self.decl_file[i]][1] in clos) and
                          (not self.decl_private[i] or self.decl_file[i] == d['file_id'])]
                    ok = [i for i in ok if i != d['id']]
                    if ok:
                        same = [i for i in ok if self.decl_file[i] == d['file_id']]
                        found = ((same or ok)[0], len(ok))
                        break
                if found:
                    break
            if found and found[0] not in seen:
                seen.add(found[0])
                out.append(found)
        return out


def rank_children(ix, d, refs):
    def key(item):
        i, _ = item
        thm = 0 if ix.decl_kind[i] in ('theorem', 'lemma') else 1
        same = 1 if ix.decl_file[i] == d['file_id'] else 0
        return (thm, same)
    order = {r[0]: n for n, r in enumerate(refs)}
    return sorted(refs, key=lambda r: key(r) + (order[r[0]],))


def trace(ix, roots, depth, fanout, max_nodes):
    """Breadth-first trace. Returns (nodes, edges): nodes keyed by decl id with level and children."""
    nodes = {}
    queue = collections.deque()
    for r in roots:
        nodes[r['id']] = {'d': r, 'level': 0, 'children': [], 'cut': 0, 'parent': None}
        queue.append(r['id'])
    while queue and len(nodes) < max_nodes:
        did = queue.popleft()
        n = nodes[did]
        if n['level'] >= depth:
            continue
        refs = ix.references(n['d'])
        ranked = rank_children(ix, n['d'], refs)
        kept = ranked[:fanout]
        n['cut'] = len(ranked) - len(kept)
        n['n_refs'] = len(refs)
        for cid, amb in kept:
            if cid not in nodes:
                if len(nodes) >= max_nodes:
                    n['cut'] += 1
                    continue
                nodes[cid] = {'d': ix.decl_row(cid), 'level': n['level'] + 1, 'children': [], 'cut': 0, 'parent': did}
                queue.append(cid)
            n['children'].append(cid)
    return nodes


def print_tree(ix, nodes, roots, a):
    printed = set()

    def show(did, indent):
        n = nodes[did]
        d = n['d']
        pad = '  ' * indent
        again = did in printed
        print('%s- %s [%s] %s:%d%s' % (pad, d['name'], d['kind'], d['path'], d['line'], '  (shown above)' if again else ''))
        if again:
            return
        printed.add(did)
        if a.stmt:
            st = ix.statement(d)
            if len(st) > a.stmt_cap:
                st = st[:a.stmt_cap] + ' ...[cut]'
            if a.md:
                print('%s```lean\n%s\n%s```' % (pad, st, pad))
            else:
                for ln in st.split('\n'):
                    print('%s    | %s' % (pad, ln))
        if a.body and n['level'] == 0:
            print('%s  proof body:' % pad)
            for ln in ix.body(d).split('\n'):
                print('%s    | %s' % (pad, ln))
        for c in n['children']:
            show(c, indent + 1)
        if n['cut']:
            print('%s  (+%d more references not shown)' % (pad, n['cut']))

    for r in roots:
        show(r['id'], 0)


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('names', nargs='+')
    ap.add_argument('--cache', required=True)
    ap.add_argument('--root', required=True)
    ap.add_argument('--depth', type=int, default=4)
    ap.add_argument('--fanout', type=int, default=10)
    ap.add_argument('--max-nodes', type=int, default=300)
    ap.add_argument('--stmt', action='store_true', help='print each statement (verbatim from the file)')
    ap.add_argument('--stmt-cap', type=int, default=600)
    ap.add_argument('--body', action='store_true', help='print the proof body of the named roots')
    ap.add_argument('--md', action='store_true', help='fence statements as ```lean blocks')
    a = ap.parse_args()
    ix = Index(a.cache, a.root)
    roots = []
    for nm in a.names:
        rows = ix.find(nm)
        if not rows:
            print('NOT FOUND: %s' % nm)
            continue
        if len(rows) > 1:
            print('NOTE: %s has %d declarations, using the first (%s)' % (nm, len(rows), rows[0]['path']))
        roots.append(rows[0])
    nodes = trace(ix, roots, a.depth, a.fanout, a.max_nodes)
    print_tree(ix, nodes, roots, a)
    print('\n%d declarations in the tree' % len(nodes))


if __name__ == '__main__':
    main()
