# Brief for mathematical reviewers

The chapters you are assigned were written by other agents in parallel. You are the referee and the editor:
find what is wrong or unclear and fix it in place. The reader has an undergraduate mathematics degree, and the
page's first requirement is that its mathematics is right.

## Read first

1. `AGENTS.md` and `AUTHORING.md`.
2. `problems/riemann/OUTLINE.md`, `problems/riemann/NOTATION.md`, and `problems/riemann/notes/review-queue.md`
   (known issues: fix those that fall in your chapters and delete each item you resolve).
3. `C:\Users\Logan Hallee\.claude\skills\writing-standards\SKILL.md`.
4. Your chapters, their glossary and reference files, and the last section of the chapter before yours and
   the first of the chapter after yours, so that the handoffs meet.

## What to check, in this order

1. **Correctness.** Read every definition, statement, proof, and formula as a skeptical referee. Check
   hypotheses, quantifiers, signs, constants, ranges of convergence, and the direction of every inequality.
   Rederive anything that looks off. Recompute printed numbers and test printed identities numerically with
   `"/c/Users/Logan Hallee/Desktop/millennium-explainers/.cache/venv/Scripts/python.exe"` (mpmath, sympy):
   sample at least a third of the numbers in each chapter, and every number in a table or a worked example
   that a later argument relies on. A proof labeled as complete must be complete; if a step is missing, supply
   it or relabel the proof as a `sketch` with a source.
2. **Honesty about sources.** A known result carries a citation to a work that exists, with a location only
   when it is certain. Remove or soften any attribution, date, quotation, or page range that you cannot stand
   behind (the review queue lists the ones the writers flagged). For chapters that follow a source (the note,
   the monograph), check the statements against the source pages cited and fix mismatches. The page treats the
   2026 proofs as proofs: no "claimed", "purported", or "if correct".
3. **Order of ideas.** Each chapter uses only what earlier chapters explained. Where something is used before
   it is defined, define it or add a pointer. Every symbol is defined before use and agrees with `NOTATION.md`;
   where two chapters use different symbols for one thing, make them agree (the review queue lists known
   clashes) and report the symbol so the notation file can be updated.
4. **Explanation.** Every formal statement is preceded by what it will say and why we want it, and followed by
   a smallest case. Where the reader would get lost (a jump in a derivation, an undefined term, an unmotivated
   step), add the missing sentence or equation. Cut repetition and filler. Do not flatten the writers' voice
   and do not rewrite what already works.
5. **Format and prose rules.** Cards have their required parts; containers and references follow
   `AUTHORING.md`; no em dashes, no emojis, no "clearly" or "obviously", American English, Oxford comma, `%`.
   Glossary patterns are narrow and their definitions stand alone.
6. **Figures.** Do not rename a figure (`viz="..."`) or an anchor. Read each `vizspec` for mathematical errors
   and for anything that contradicts the chapter. If you change a spec, list the figure in your report, because
   its module may already be written.

## How to work

Edit the chapter files directly, with the smallest change that fixes each problem. Keep the build clean: after
your edits run

```
node build/build.mjs riemann --draft --out <scratch>/out
```

with `<scratch>` a folder of your own under
`C:\Users\LOGANH~1\AppData\Local\Temp\claude\2171e01994828ad9\d19dc8fd-5de5-4942-aa9a-02a63d36904c\scratchpad`,
and fix every error it reports in your files (ignore the page-size error and missing figure modules; another
agent is changing the build's internals, so retry if it fails for a reason outside your files). Edit only your
assigned chapters and their glossary and reference files, plus the review queue. No commits.

## Report (under 400 words)

Every mathematical error you found, with chapter and anchor, and what you did; every statement you weakened or
relabeled; every citation or attribution you removed or changed; notation you unified, and symbols to add to
`NOTATION.md`; figures whose specs you changed; and what you are still unsure of after review.

## No deletes in the repository

Never delete anything inside the repository, and never delete a path given through a shell variable: the user's
global hook asks for approval of every such command, even in bypass mode. Keep all throwaway files in your
scratch folder under the temp directory. If a file in the repository must go, name it in your report and leave it.
