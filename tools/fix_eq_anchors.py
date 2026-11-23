"""Move equation anchors written on the last math line to after the closing delimiter.

AUTHORING.md puts the anchor after the closing delimiter of a display block, on the same line. Writers
sometimes put it at the end of the last line of math, which KaTeX rejects.

Usage: fix_eq_anchors.py <chapter.md> [...]
"""
import re
import sys
from pathlib import Path

ANCHOR_AT_END = re.compile(r"^(.*?)\s*(\{#eq-[A-Za-z0-9_-]+\})\s*$")
DELIMITER = "$" * 2


def fix(path: Path) -> int:
    lines = path.read_text(encoding="utf-8").split("\n")
    moved = 0
    inside_math = False
    for index, line in enumerate(lines):
        stripped = line.strip()
        if not inside_math:
            if stripped == DELIMITER:
                inside_math = True
            continue
        if stripped.startswith(DELIMITER):
            inside_math = False
            continue
        match = ANCHOR_AT_END.match(line)
        if match is None:
            continue
        closing = index + 1
        assert closing < len(lines) and lines[closing].strip() == DELIMITER, (
            f"{path}:{index + 1}: anchor is not on the last line of its display block"
        )
        lines[index] = match.group(1)
        lines[closing] = lines[closing].rstrip() + " " + match.group(2)
        moved += 1
    path.write_text("\n".join(lines), encoding="utf-8", newline="\n")
    return moved


def strip_control_characters(path: Path) -> int:
    """Repair a backslash-letter pair that was written as a control character (bell, backspace, form feed)."""
    text = path.read_text(encoding="utf-8")
    repaired = text.replace("\a", "\\a").replace("\b", "\\b").replace("\f", "\\f").replace("\v", "\\v")
    count = sum(text.count(char) for char in "\a\b\f\v")
    if count:
        path.write_text(repaired, encoding="utf-8", newline="\n")
    return count


for name in sys.argv[1:]:
    target = Path(name)
    print(name, "anchors moved:", fix(target), "control characters repaired:", strip_control_characters(target))
