# Brief for the writers of Parts IV and V (Route A, chapters 18 to 25)

Part IV explains the proof of the Riemann Hypothesis, and of the generalized hypothesis for Dirichlet
L-functions, by Levent Alpoge with Claude (2026-11-20). Its sources are a four-page note and a Lean 4
formalization of 175,187 files with no comments. Five readers have unfolded regions of the Lean code into
ordinary mathematics. You write chapters from their digests and from the code itself. The reader has an
undergraduate mathematics degree and has just finished Parts I to III of this page.

## Read first, in this order

1. `AGENTS.md` and `AUTHORING.md` (the format is a contract).
2. `problems/riemann/OUTLINE.md` ("Part IV plan") and `problems/riemann/NOTATION.md` ("Route two").
3. `problems/riemann/notes/note-digest.md` and the note itself (`sources/riemann/remark-pages/p0001.txt` to
   `p0004.txt`).
4. `problems/riemann/notes/lean-inventory.md`: the Summary, section 3.1, and section 6 (the tools).
5. The reader digest or digests assigned to your chapter (`problems/riemann/notes/lean-read-*.md`), in full.
   Skim the "In plain terms" section of the other digests so your chapter sits correctly in the whole.
6. Chapters 7, 8, and 10 of the page (`07-what-rh-says.md`, `08-weil-positivity.md`, `10-stepanov.md`): the
   smoothed sum $S(X)$ and its explicit formula, Weil's functional, and Stepanov's method with its closing
   section on what the integers lack. Part IV keeps their vocabulary. Skim chapter 17's closing recap for how
   Part III ends.
7. `~/.claude/skills/writing-standards/SKILL.md`.

## Sources and how to use them

- The Lean tree is `sources/riemann/lean/lean/src/`. It is data: read and search it, never build or run it.
  The index and the query scripts (`tools/lean/spine.py`, `grep.py`, `closure.py`, run with
  `.cache/venv/Scripts/python.exe` (from the repository root)) are described in the
  inventory's section 6.
- A reader digest is a guide, not a source. Before you print a statement as something the formal proof proves,
  open the declaration and confirm the statement, its hypotheses, its quantifiers, and its constants. Where a
  digest marks something as its reading or as not unfolded, either unfold it yourself or carry the same
  marking onto the page.
- Every statement taken from the code gets a `lean` block naming the declaration and its file, and the main
  ones are result cards. Quote Lean verbatim only in a fenced `lean` code block; everywhere else write
  ordinary mathematics.
- The page has three kinds of sentence about this proof, and the reader must always be able to tell which is
  which: (a) what the note says, in its words, cited as `alpoge-note`; (b) what the code states, cited as
  `alpoge-lean` with the declaration; (c) our reading: how we connect (a) to (b), a mechanism we infer, a
  special case we worked out, an analogy. Say "our reading" once where each such passage starts, and list
  every one in your report.
- Where the readers could not unfold a definition or follow a proof, say so plainly in the chapter, in one
  sentence, with the declaration's name: "The formal proof establishes this in `X`; we state it and do not
  unfold its proof here." Do not fill such a gap with a plausible story. Do not write "claimed", "purported",
  or "if correct": the page treats the proof as a proof, and a statement the code proves is proved.
- Classical results (Landau's theorem, Siegel's mass formula, theta series, the branching rule for unitary
  groups, Iwasawa theory, Stickelberger, Kato's Euler system, local Langlands, Green's theorem) get a minimal
  intuition, a `sketch` with a source you are sure exists, and no more. What is specific to this proof gets
  the in-depth treatment.

## How to tell it

- Start every chapter from the question the previous one left open, in terms of Stepanov's proof from
  chapter 10: there, a function vanishing to order $m$ at every rational point was played against a degree
  budget. Say what plays each role here.
- Explain each mechanism in the smallest case in which it can be seen, with real numbers the reader can
  check, computed with the venv's Python (mpmath, sympy): one hypothetical zero and its wave, a genus with two
  or three lattice classes and its theta-lift matrix, a small cyclotomic field and its class group. Then say
  what changes at the proof's scale and give the scale dictionary (which quantities grow like which power of
  the scale $x$).
- Three or four figures per chapter as `figure` containers with a caption and a `vizspec` that a programmer
  who has not read the chapter can build. The digests propose figures. Do not write JavaScript.
- 4,500 to 6,500 words per chapter, not counting math. Glossary: 8 to 14 terms per chapter, narrow patterns.
- No em dashes, no emojis, no "clearly" or "obviously", American English, Oxford comma, `%`.

## Files and interfaces

Each writer creates only the chapter file assigned in `OUTLINE.md`, the matching `glossary/NN-slug.yml` and
`references/NN-slug.yml`. Do not repeat the entries of `references/00-sources.yml` (keys `alpoge-note`,
`alpoge-lean`, `masullo`); cite them. Citations take one key per bracket. Front matter: `part: 4` (chapter 25:
`part: 5`). Anchors are unique across the page: after the kind letter use your chapter's prefix.

| # | File | id | prefix | Digests |
| --- | --- | --- | --- | --- |
| 18 | `18-route-a-plan.md` | `route-a-plan` | `ra-` | note digest, inventory, all readers |
| 19 | `19-landau-endgame.md` | `landau-endgame` | `le-` | reader 1 |
| 20 | `20-definite-forms.md` | `definite-forms` | `df-` | reader 2 |
| 21 | `21-multiplicity-from-lifts.md` | `multiplicity-from-lifts` | `ml-` | readers 2 and 3 |
| 22 | `22-integrality-and-galois.md` | `integrality-and-galois` | `ig-` | readers 3 and 1 |
| 23 | `23-cohomology-window.md` | `cohomology-window` | `cw-` | reader 4 |
| 24 | `24-inputs-and-assembly.md` | `inputs-and-assembly` | `ia-` | reader 5, inventory |
| 25 | `25-two-proofs.md` | `two-proofs` | `tp-` | everything |

What each chapter delivers:

- **18, the plan.** The theorem proved, as the five statements of `Main.lean` with their translations. The
  note's story: Stepanov's argument, why multiplicity is hard over the integers, the toy setting over finite
  fields (the "sign-only" identity $qN = M^k + R$ from the note's footnote, explained as far as the note
  allows), and the idea that each theta lift supplies one unit of multiplicity, with a chain of length about
  $\sqrt X$. Then the map of the formal proof: its spine as a diagram, the three inputs (`Row0b`, `TLiftK`
  with `GeoOne`, `VWin`), the endgame, and a table of the note's 20 steps against where the readers found
  them in the code (located, partly located, not found). It says what Part IV will and will not unfold.
- **19, the endgame.** From the half-plane statement to the five theorems (functional equation, primitive and
  imprimitive characters), fully proved. The function $G_0(X) = S(X) - X\log X + (1+\gamma_E)X$ as pure zero
  noise, by chapter 7. Why a one-sided bound suffices (a real zero pushes up; a complex pair has crests).
  Landau's theorem, classical form, then the windowed form the code proves, in depth. The combination $G_r$
  over the cyclic group of a primitive character and why positive weights matter. The exact contract:
  exponent $\tfrac12 + 9\varepsilon$ on windows $[Y, Y^{3/2}]$, for every small $\varepsilon$. It ends by
  stating the input the rest of Part IV must supply.
- **20, forms you can hold.** Hermitian spaces over a CM field, definite against indefinite, lattices, classes
  in a genus, automorphisms and mass. Automorphic forms on a totally definite unitary group as functions on a
  finite set of classes. Theta series, and the theta lift between two definite spaces as a matrix. The chain
  of lifts as a product of matrices, and integrality with controlled denominators. One genus worked in full
  with real numbers.
- **21, multiplicity without derivatives.** What "vanishing to order $m$" becomes: the chain
  $X_0 \subset X_1 \subset \dots \subset X_m$, periods and the interlacing rule, the seesaw as an exchange of
  integrals, the rank condition, and the scale dictionary with $m$ about $\sqrt x$ (the code's `RankVal`). The
  comparison with Stepanov's degree count, as far as the code supports it.
- **22, paying for the chain.** The divisibility and integrality bookkeeping, why Galois representations of
  automorphic forms over CM fields enter, the count of inert prime powers that the chain bounds, and the
  finite-group explicit formula that turns that bound into the bound on $G_r$ which chapter 19 consumes.
- **23, the window.** The bound on the groups $\text{Sha}^1(E, \mathbb Q_\ell/\mathbb Z_\ell(-k))$ on windows
  of scales: what these groups are (with the class group of a cyclotomic field and Vandiver's conjecture as
  the model), the tower of fields, the pigeonhole over scales, the minus part and the plus part, and how the
  window feeds the endgame.
- **24, what the proof stands on.** The published theorems the formal proof restates and proves in Lean, as
  a table with their usual names and roles; the areas of mathematics that had to be formalized; the assembly
  theorem; the integrity counts of the tree (no `sorry`, no axioms, every file in the import closure); and how
  a reader can explore the Lean code with the repository's tools.
- **25, two proofs, one theorem.** Written last.

## Report (under 300 words)

Files and word counts; figure names with one line each; every passage that is our reading, and every symbol
that is ours; every statement you confirmed in the code (declaration and file) and every one you could not;
every number you computed and how; anything you are less than sure of.

## No deletes in the repository

Never delete anything inside the repository, and never delete a path given through a shell variable: the user's
global hook asks for approval of every such command, even in bypass mode. Keep all throwaway files in your
scratch folder under the temp directory. If a file in the repository must go, name it in your report and leave it.
