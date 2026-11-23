"""Transitive import closure of a Lean module, from the SQLite index built by index.py.

Usage:
  python closure.py --cache PATH/TO/lean-index [--start Main] [--prefix-depth 1]

Breadth-first over the `imports` table starting at --start (a module name). Writes the table
`closure(module, depth)` into the same database (replacing any earlier one for this start, kept in
`closure_start`), and prints how many project files are reachable and how many are not, by top-level
directory (or by the first --prefix-depth path components). Imports of modules that are not files in
the index (for example Mathlib.*) are counted as external and not followed.
"""

import argparse
import collections
import os
import sqlite3
import sys

sys.stdout.reconfigure(encoding='utf-8')


def load_graph(db):
    mods = {m: (fid, top, lines) for fid, m, top, lines in db.execute('SELECT id, module, top, lines FROM files')}
    edges = collections.defaultdict(list)
    for s, d in db.execute('SELECT src, dst FROM imports'):
        edges[s].append(d)
    return mods, edges


def closure(mods, edges, start):
    """BFS. Returns {module: depth} for project modules and a set of external module names reached."""
    assert start in mods, 'start module %s is not in the index' % start
    depth = {start: 0}
    external = set()
    frontier = [start]
    while frontier:
        nxt = []
        for m in frontier:
            for d in edges.get(m, ()):
                if d in mods:
                    if d not in depth:
                        depth[d] = depth[m] + 1
                        nxt.append(d)
                else:
                    external.add(d)
        frontier = nxt
    return depth, external


def group_key(path, n):
    parts = path.split('/')
    if len(parts) == 1:
        return '(root)'
    return '/'.join(parts[:min(n, len(parts) - 1)])


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('--cache', required=True)
    ap.add_argument('--start', default='Main')
    ap.add_argument('--prefix-depth', type=int, default=1)
    a = ap.parse_args()
    db = sqlite3.connect(os.path.join(a.cache, 'index.sqlite'))
    mods, edges = load_graph(db)
    depth, external = closure(mods, edges, a.start)
    db.execute('DROP TABLE IF EXISTS closure')
    db.execute('CREATE TABLE closure(module TEXT PRIMARY KEY, depth INTEGER)')
    db.executemany('INSERT INTO closure VALUES(?,?)', depth.items())
    db.execute('DROP TABLE IF EXISTS closure_start')
    db.execute('CREATE TABLE closure_start(module TEXT)')
    db.execute('INSERT INTO closure_start VALUES(?)', (a.start,))
    db.commit()
    paths = {m: p for m, p in db.execute('SELECT module, path FROM files')}
    tot = collections.Counter()
    reach = collections.Counter()
    tot_l = collections.Counter()
    reach_l = collections.Counter()
    for m, (fid, top, lines) in mods.items():
        k = group_key(paths[m], a.prefix_depth)
        tot[k] += 1
        tot_l[k] += lines
        if m in depth:
            reach[k] += 1
            reach_l[k] += lines
    print('start %s: %d of %d project files reachable (%d not); max depth %d; %d external modules imported'
          % (a.start, len(depth), len(mods), len(mods) - len(depth), max(depth.values()), len(external)))
    print('%-40s %9s %9s %9s %12s %12s' % ('directory', 'files', 'reached', 'not', 'lines', 'lines reached'))
    for k in sorted(tot, key=lambda x: -tot[x]):
        print('%-40s %9d %9d %9d %12d %12d' % (k, tot[k], reach[k], tot[k] - reach[k], tot_l[k], reach_l[k]))
    byd = collections.Counter(depth.values())
    print('files by depth: ' + ', '.join('%d:%d' % (d, byd[d]) for d in sorted(byd)))
    ext_top = collections.Counter(e.split('.')[0] for e in external)
    print('external top-level packages: ' + ', '.join('%s (%d modules)' % kv for kv in ext_top.most_common(10)))


if __name__ == '__main__':
    main()
