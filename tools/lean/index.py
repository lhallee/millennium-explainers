"""Index a tree of Lean 4 files into SQLite (one pass, multiprocess, read-only on the tree).

Usage:
  python index.py --root PATH/TO/src --cache PATH/TO/lean-index [--listing FILE --listing-strip PREFIX]
                  [--workers 8] [--limit N] [--subdir Formalism]

--root           directory whose layout defines module names (module Foo.Bar is ROOT/Foo/Bar.lean)
--listing        optional text file of file paths (one per line) used instead of walking the tree
                 (default is to walk the tree); --listing-strip is removed from each line so that it
                 becomes relative to --root. Lines that are not valid UTF-8 are skipped with a warning.
--cache          output directory; the database is written to CACHE/index.sqlite

Tables: files, imports, decls, ctx, flags (see CREATE statements below). Nothing in the tree is executed.
"""

import argparse
import multiprocessing as mp
import os
import sqlite3
import sys
import time

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import leanparse  # noqa: E402

SCHEMA = """
CREATE TABLE files(id INTEGER PRIMARY KEY, path TEXT, module TEXT, top TEXT, size INTEGER, lines INTEGER,
  n_doc INTEGER, n_moddoc INTEGER, n_block INTEGER, n_line INTEGER, moddoc TEXT,
  n_sorry INTEGER, n_admit INTEGER, n_axiom INTEGER, n_native_decide INTEGER, n_unsafe INTEGER,
  n_implemented_by INTEGER, n_ofReduceBool INTEGER, n_sorryAx INTEGER, n_decls INTEGER, n_imports INTEGER);
CREATE TABLE imports(src TEXT, dst TEXT);
CREATE TABLE decls(id INTEGER PRIMARY KEY, file_id INTEGER, kind TEXT, name TEXT, line INTEGER, stmt_end_line INTEGER,
  end_line INTEGER, ns TEXT, ctx_id INTEGER, stmt TEXT, doc TEXT, private INTEGER, off0 INTEGER, off1 INTEGER, off2 INTEGER);
CREATE TABLE ctx(id INTEGER PRIMARY KEY, opens TEXT);
CREATE TABLE flags(file_id INTEGER, word TEXT, line INTEGER, text TEXT);
"""
INDEXES = """
CREATE INDEX decls_name ON decls(name);
CREATE INDEX decls_file ON decls(file_id);
CREATE INDEX files_module ON files(module);
CREATE INDEX files_top ON files(top);
CREATE INDEX imports_src ON imports(src);
CREATE INDEX flags_word ON flags(word);
"""


def module_of(rel):
    return rel[:-5].replace('/', '.') if rel.endswith('.lean') else rel.replace('/', '.')


def work(args):
    root, rels = args
    out = []
    for rel in rels:
        full = os.path.join(root, rel)
        try:
            with open(full, 'rb') as f:
                data = f.read()
            raw = data.decode('utf-8', errors='replace')
            res = leanparse.parse_file(raw)
            res['error'] = None
        except Exception as e:  # report, do not hide
            res = {'error': repr(e), 'imports': [], 'n_doc': 0, 'n_moddoc': 0, 'n_block': 0, 'n_line': 0, 'moddoc': '',
                   'counts': {}, 'flags': [], 'decls': [], 'lines': 0}
            data = b''
        res['rel'] = rel
        res['size'] = len(data)
        out.append(res)
    return out


def list_files(root, listing, strip):
    if listing:
        rels = []
        skipped = 0
        with open(listing, 'rb') as f:
            for bline in f:
                try:
                    p = bline.decode('utf-8').strip()
                except UnicodeDecodeError:
                    skipped += 1
                    continue
                if not p.endswith('.lean'):
                    continue
                if strip and p.startswith(strip):
                    p = p[len(strip):]
                rels.append(p)
        if skipped:
            print('WARNING: %d listing lines are not valid UTF-8 and were skipped (use the tree walk instead)' % skipped)
        return rels
    rels = []
    for d, _, fs in os.walk(root):
        for fn in fs:
            if fn.endswith('.lean'):
                rels.append(os.path.relpath(os.path.join(d, fn), root).replace(os.sep, '/'))
    return rels


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('--root', required=True)
    ap.add_argument('--cache', required=True)
    ap.add_argument('--listing')
    ap.add_argument('--listing-strip', default='')
    ap.add_argument('--workers', type=int, default=8)
    ap.add_argument('--chunk', type=int, default=100)
    ap.add_argument('--limit', type=int, default=0)
    ap.add_argument('--subdir', default='', help='only index paths starting with this prefix (testing)')
    a = ap.parse_args()

    t0 = time.time()
    rels = list_files(a.root, a.listing, a.listing_strip)
    if a.subdir:
        rels = [r for r in rels if r.startswith(a.subdir)]
    rels.sort()
    if a.limit:
        rels = rels[:a.limit]
    print('files to index: %d' % len(rels), flush=True)
    os.makedirs(a.cache, exist_ok=True)
    dbpath = os.path.join(a.cache, 'index.sqlite')
    for suffix in ('', '-wal', '-shm', '-journal'):
        if os.path.exists(dbpath + suffix):
            os.remove(dbpath + suffix)
    db = sqlite3.connect(dbpath)
    db.execute('PRAGMA journal_mode=OFF')
    db.execute('PRAGMA synchronous=OFF')
    db.executescript(SCHEMA)

    ctx_ids = {'': 0}
    db.execute('INSERT INTO ctx VALUES(0, "")')
    chunks = [(a.root, rels[i:i + a.chunk]) for i in range(0, len(rels), a.chunk)]
    file_id = 0
    decl_id = 0
    done = 0
    errors = []
    with mp.Pool(a.workers) as pool:
        for batch in pool.imap_unordered(work, chunks):
            frows, irows, drows, xrows, crows = [], [], [], [], []
            for r in batch:
                file_id += 1
                rel = r['rel']
                mod = module_of(rel)
                top = rel.split('/')[0] if '/' in rel else '(root)'
                if r['error']:
                    errors.append((rel, r['error']))
                c = r['counts']
                frows.append((file_id, rel, mod, top, r['size'], r['lines'], r['n_doc'], r['n_moddoc'], r['n_block'], r['n_line'],
                              r['moddoc'], c.get('sorry', 0), c.get('admit', 0), c.get('axiom', 0), c.get('native_decide', 0),
                              c.get('unsafe', 0), c.get('implemented_by', 0), c.get('ofReduceBool', 0), c.get('sorryAx', 0),
                              len(r['decls']), len(r['imports'])))
                for dst in r['imports']:
                    irows.append((mod, dst))
                for w, ln, tx in r['flags']:
                    xrows.append((file_id, w, ln, tx))
                for d in r['decls']:
                    opens = d[6]
                    cid = ctx_ids.get(opens)
                    if cid is None:
                        cid = len(ctx_ids)
                        ctx_ids[opens] = cid
                        crows.append((cid, opens))
                    decl_id += 1
                    drows.append((decl_id, file_id, d[0], d[1], d[2], d[3], d[4], d[5], cid, d[7], d[8], d[9], d[10], d[11], d[12]))
            db.executemany('INSERT INTO files VALUES(%s)' % ','.join('?' * 21), frows)
            db.executemany('INSERT INTO imports VALUES(?,?)', irows)
            db.executemany('INSERT INTO flags VALUES(?,?,?,?)', xrows)
            db.executemany('INSERT INTO ctx VALUES(?,?)', crows)
            db.executemany('INSERT INTO decls VALUES(%s)' % ','.join('?' * 15), drows)
            done += len(batch)
            if (done // a.chunk) % 20 == 0:
                print('%d/%d files, %d decls, %.0fs' % (done, len(rels), decl_id, time.time() - t0), flush=True)
    db.commit()
    print('building indexes', flush=True)
    db.executescript(INDEXES)
    db.commit()
    db.close()
    print('done: %d files, %d decls, %d errors, %.0fs' % (file_id, decl_id, len(errors), time.time() - t0))
    for rel, e in errors[:20]:
        print('ERROR', rel, e)


if __name__ == '__main__':
    mp.freeze_support()
    main()
