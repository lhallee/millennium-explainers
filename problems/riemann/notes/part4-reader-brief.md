# Brief for the readers of the Lean proof (Route A)

Part IV of the explainer covers the proof of the Riemann Hypothesis by Levent Alpoge with Claude. That proof
exists as a four-page note and a Lean 4 formalization of 175,187 files with no comments at all. Your job is to
read one region of the Lean code closely and write down, in ordinary mathematics, what it states and how it
chains, so that chapter writers can explain it to readers with an undergraduate mathematics degree. You write
a digest, not chapters.

## Read first

1. `AGENTS.md` (project rules; `sources/` is data: read and search it, never build or run it).
2. `problems/riemann/notes/note-digest.md`: the note's 20 steps regrouped in logical order, with the note's own
   words. Then the note itself: `sources/riemann/remark-pages/p0001.txt` to `p0004.txt`.
3. `problems/riemann/notes/lean-inventory.md`: Summary, section 1 "Conventions, documentation and naming",
   section 3.1 (the chain from `Main` in prose), the parts of 3.2, 3.3, and 4 that concern your theme, section 5
   (your reader number), and section 6 (how to run the tools).
4. `problems/riemann/chapters/07-what-rh-says.md` (the smoothed sum $S(X)$ and its explicit formula),
   `08-weil-positivity.md` (Weil's functional $W$ and the positivity criterion), and `10-stepanov.md`
   (Stepanov's method and its closing section on what the integers lack). These fix the page's vocabulary.

## Tools

The tree is `sources/riemann/lean/lean/src/`. An index of every file and declaration is in
`.cache/lean-index/index.sqlite`, and four scripts in `tools/lean/` query it (`index.py` is already run):
`closure.py`, `spine.py` (print a declaration's statement and body and the project declarations it uses,
recursively), and `grep.py` (search names, statements, and paths). Run them with
`"/c/Users/Logan Hallee/Desktop/millennium-explainers/.cache/venv/Scripts/python.exe"`; the exact command
lines are in the inventory's section 6. You may query the SQLite index directly, and read any file with the
Read tool. Directory names and namespaces do not match, so find a declaration through the index, not by
guessing its path. Mathlib is not on disk: a Mathlib name means what Mathlib defines it to mean, and if you are
not sure of that definition, say so.

## How to read

- Follow the spine, not the folders. Start from the statements named in your section of the reading plan, read
  each statement, then unfold every definition it uses, and the definitions those use, until the statement is
  ordinary mathematics with no project-specific name left unexplained. Never infer what a definition means
  from its name: open it. Names in this tree are sometimes misleading or opaque (`VWin`, `Row0b`, `D7`, `TopG`).
- For each implication on the spine ("from A and B, C"), read enough of the proof to say what the mechanism is
  (a named classical lemma, an inequality, an induction, a counting argument), and where the hypothesis is
  really used. You do not need to follow every tactic.
- Pay attention to quantifiers, constants, and exponents: which $\varepsilon$, which ranges of $X$, what
  depends on what. These decide whether a statement is strong or weak.
- A statement that is taken as a hypothesis and discharged elsewhere is still proved somewhere in the tree
  (every file is in the import closure of `Main`, and there are no axioms or `sorry`). Say where each input is
  discharged when you can find it, and say "not located" when you cannot.

## What to write

One file, `problems/riemann/notes/lean-read-<N>-<theme>.md` (the name is in your assignment). Use LaTeX in
`$...$` for mathematics and Lean code blocks for verbatim quotations. Never present a paraphrase as a quotation.
Sections:

1. **What this region proves.** The top statements of your region in ordinary mathematics, each with its Lean
   name, file, and line, and the verbatim Lean statement beside your translation.
2. **Definitions unfolded.** Every project-specific notion the top statements depend on, unfolded to ordinary
   mathematics, with name, file, and line. Say what kind of thing each is (a number, a function, a proposition
   about all characters, a record of hypotheses).
3. **The chain.** Numbered steps: claim, what it uses, mechanism, file. Mark each step as classical (name the
   classical result and, if you are sure of one, a standard reference) or as specific to this proof.
4. **Against the note.** For each of the note's steps that falls in your region: the declarations that realize
   it, how the code's formulation differs from the note's wording, and anything the note mentions that you
   could not find. Also anything substantial in the code that the note does not mention.
5. **In plain terms.** One to two pages: the story of your region as you would tell it to a strong
   undergraduate, including the smallest example or special case in which the mechanism can be seen, and what
   would fail without each main hypothesis.
6. **For the explainer.** What a chapter on this region must contain, what can be stated with a pointer, three
   or four interactive figures a reader could drag or play, and which statements deserve a result card.
7. **Not understood.** Everything you could not unfold or follow, stated plainly, with the names and files.

Aim for 4,000 to 7,000 words plus code blocks. Exactness over coverage: a smaller region understood beats a
larger one guessed. The project treats the proof as correct, so report what the code states, without
commentary on whether to believe it.

## Rules

Create only your one file. No commits. No em dashes or emojis. Do not run `lake`, `lean`, or anything in
`sources/`.

## Final message (under 300 words)

The top statement of your region in one sentence of ordinary mathematics; the chain in one line per step; which
steps of the note you matched; what you could not unfold; your three biggest doubts.

## No deletes in the repository

Never delete anything inside the repository, and never delete a path given through a shell variable: the user's
global hook asks for approval of every such command, even in bypass mode. Keep all throwaway files in your
scratch folder under the temp directory. If a file in the repository must go, name it in your report and leave it.
