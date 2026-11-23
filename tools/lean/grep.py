"""Keyword or regex search over declaration names, statements, doc comments and file paths in the index.

Usage:
  python grep.py TERM [TERM ...] --cache PATH/TO/lean-index [--regex] [--any] [--fields name,stmt,doc,path]
                 [--kinds theorem,def] [--depth 3] [--top 20] [--stmt-cap 220] [--in-closure] [--case]

TERMs are plain substrings (case-insensitive) that must all occur in the searched fields (use --any for
"at least one"); with --regex each TERM is a Python regular expression. Fields are searched joined
by a space, so a term can match across name and statement. Output: hit counts by directory at --depth
(declarations and distinct files), then the --top best declarations with file and line.
Ranking: name hits first, then statement hits, then theorems, then shorter statements.
--in-closure keeps only declarations in files reachable from the closure start (needs closure.py to
have been run against the same cache). Module docs are searched with --fields moddoc (file level).
"""

import argparse
import collections
import os
import re
import sqlite3
import sys

sys.stdout.reconfigure(encoding='utf-8')

COLS = {'name': 'd.name', 'stmt': 'd.stmt', 'doc': 'd.doc', 'path': 'f.path'}


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('terms', nargs='+')
    ap.add_argument('--cache', required=True)
    ap.add_argument('--regex', action='store_true')
    ap.add_argument('--any', action='store_true')
    ap.add_argument('--case', action='store_true')
    ap.add_argument('--fields', default='name,stmt,doc')
    ap.add_argument('--kinds', default='')
    ap.add_argument('--depth', type=int, default=2)
    ap.add_argument('--top', type=int, default=20)
    ap.add_argument('--stmt-cap', type=int, default=220)
    ap.add_argument('--in-closure', action='store_true')
    ap.add_argument('--min-depth-count', type=int, default=1, help='hide directories with fewer hits')
    a = ap.parse_args()

    db = sqlite3.connect(os.path.join(a.cache, 'index.sqlite'))
    flags = 0 if a.case else re.I
    if a.regex:
        pats = [re.compile(t, flags) for t in a.terms]
    else:
        pats = [re.compile(re.escape(t), flags) for t in a.terms]
    fields = a.fields.split(',')

    if fields == ['moddoc']:
        n = 0
        by = collections.Counter()
        shown = []
        for path, lines, md in db.execute('SELECT path, lines, moddoc FROM files WHERE moddoc != ""'):
            hits = [bool(p.search(md)) for p in pats]
            if (any(hits) if a.any else all(hits)):
                n += 1
                by['/'.join(path.split('/')[:a.depth])] += 1
                shown.append((path, md[:a.stmt_cap]))
        print('%d files with matching module docs' % n)
        for k, v in by.most_common(30):
            print('  %6d  %s' % (v, k))
        for p, m in shown[:a.top]:
            print('%s: %s' % (p, m.replace('\n', ' ')))
        return

    cols = [COLS[f] for f in fields]
    expr = " || ' ' || ".join('coalesce(%s,"")' % c for c in cols)
    db.create_function('re_match', 2, lambda s, i: 1 if pats[i].search(s or '') else 0, deterministic=True)
    conds = ['re_match(%s, %d)' % (expr, i) for i in range(len(pats))]
    where = (' OR ' if a.any else ' AND ').join(conds)
    if a.kinds:
        where = '(%s) AND d.kind IN (%s)' % (where, ','.join("'%s'" % k for k in a.kinds.split(',')))
    join = 'JOIN files f ON f.id = d.file_id'
    if a.in_closure:
        join += ' JOIN closure c ON c.module = f.module'
    q = 'SELECT d.name, d.kind, d.line, d.stmt, f.path, f.lines FROM decls d %s WHERE %s' % (join, where)
    rows = db.execute(q).fetchall()
    by_dir = collections.Counter()
    files_by_dir = collections.defaultdict(set)
    scored = []
    for name, kind, line, stmt, path, flines in rows:
        k = '/'.join(path.split('/')[:a.depth])
        by_dir[k] += 1
        files_by_dir[k].add(path)
        nh = sum(1 for p in pats if p.search(name))
        sh = sum(1 for p in pats if p.search(stmt))
        scored.append((-nh, -sh, 0 if kind == 'theorem' else 1, len(stmt), name, kind, path, line, stmt))
    scored.sort()
    print('%d matching declarations in %d files' % (len(rows), len({r[4] for r in rows})))
    print('%-60s %8s %8s' % ('directory (depth %d)' % a.depth, 'decls', 'files'))
    for k, v in by_dir.most_common(40):
        if v >= a.min_depth_count:
            print('%-60s %8d %8d' % (k, v, len(files_by_dir[k])))
    print('\ntop %d declarations:' % min(a.top, len(scored)))
    for s in scored[:a.top]:
        stmt = s[8]
        if len(stmt) > a.stmt_cap:
            stmt = stmt[:a.stmt_cap] + ' ...'
        print('%s [%s] %s:%d\n    %s' % (s[4], s[5], s[6], s[7], stmt))


if __name__ == '__main__':
    main()
