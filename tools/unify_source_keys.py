"""Point every chapter at the canonical source entries in references/00-sources.yml.

Renames citation keys in chapters and removes a chapter's own copy of an entry whose key lives in
00-sources.yml (the build requires that two entries with one key be identical, and one copy is simpler).

Usage: unify_source_keys.py <problem dir> [old_key=new_key ...]
"""
import re
import sys
from pathlib import Path

import yaml

problem = Path(sys.argv[1])
renames = dict(pair.split("=", 1) for pair in sys.argv[2:])
canonical_path = problem / "references" / "00-sources.yml"
canonical = set(yaml.safe_load(canonical_path.read_text(encoding="utf-8")))

for chapter in sorted((problem / "chapters").glob("*.md")):
    text = chapter.read_text(encoding="utf-8")
    updated = text
    for old, new in renames.items():
        updated = re.sub(rf"(\[@|source=\"){re.escape(old)}\b", lambda m: m.group(1) + new, updated)
    if updated != text:
        chapter.write_text(updated, encoding="utf-8", newline="\n")
        print("renamed keys in", chapter.name)

ENTRY_START = re.compile(r"^([A-Za-z0-9_.-]+):\s*$")
for ref_file in sorted((problem / "references").glob("*.yml")):
    if ref_file == canonical_path:
        continue
    kept, dropping, removed = [], False, []
    for line in ref_file.read_text(encoding="utf-8").split("\n"):
        start = ENTRY_START.match(line)
        if start is not None:
            key = start.group(1)
            dropping = key in canonical or key in renames
            if dropping:
                removed.append(key)
        if not dropping:
            kept.append(line)
    if removed:
        body = re.sub(r"\n{3,}", "\n\n", "\n".join(kept)).strip("\n") + "\n"
        ref_file.write_text(body, encoding="utf-8", newline="\n")
        print("removed", removed, "from", ref_file.name)
