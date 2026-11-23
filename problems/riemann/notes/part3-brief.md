# Brief for the writers of Part III (Route M, chapters 11 to 17)

Part III explains the proof in A. M. Masullo, "The Music of the Primes" (draft of 2026-11-20): a trace formula
on the idele class group whose zero side can be cut down to a strip of any width around the critical line,
while its prime side stays Weil's complete sum. The reader has an undergraduate mathematics degree and has
just finished Parts I and II of this page.

## Read first, in this order

1. `AGENTS.md` and `AUTHORING.md` (the format is a contract: containers, cards, references, citations,
   glossary files, figure containers with `vizspec` blocks).
2. `problems/riemann/OUTLINE.md`, including "Part III plan", and `problems/riemann/NOTATION.md`, section
   "Route one". Use exactly that notation. It differs from the source on purpose.
3. `problems/riemann/notes/masullo-digest.md`, all of it. Section 3 is the chain, Section 5 the specialization
   to $\zeta$, Section 9 the state of the source, and Section 10 has your chapter's brief and reading list
   (III.1 to III.7 are chapters 11 to 17).
4. The source pages your chapter's brief lists: `sources/riemann/masullo-pages/pNNNN.txt` (one text file per
   PDF page; formulas lose their layout) and, whenever a formula or a statement matters, the PDF page itself:
   Read `sources/riemann/masullo.pdf` with the `pages` parameter (at most 20 pages per call).
5. `C:\Users\Logan Hallee\.claude\skills\writing-standards\SKILL.md`.
6. Whatever exists of Parts I and II under `problems/riemann/chapters/` (other agents are still writing
   them), to match voice and to know what the reader has: at least skim `04-zeta-continued.md`,
   `06-explicit-formula.md`, and `08-weil-positivity.md` if present, and `notes/part2-conventions.md` if
   present. Refer to earlier chapters by chapter id (see `problem.yml`), not by anchors inside them.

## How to tell it

- Tell the whole argument for $\mathbb Q$ and the trivial character, on $\mathbb R_{>0}$ with $\dd t/t$, where
  every object is a function of one positive real variable, a sum over integers, or an integral. Introduce the
  general objects only as far as they explain why a step is natural. End each chapter with a short section
  "What changes in general" (number fields, Hecke characters), from the digest's Section 5.
- The digest's Section 7 says what to state in one sentence with a pointer (the functional-analytic
  machinery) and what is the new heart that deserves the in-depth treatment. Follow it. A reader should be
  able to verify each new idea on $\mathbb R_{>0}$ with a concrete function.
- Every statement that comes from the source carries its location, written in prose or in the `source`
  attribute as `masullo` with `loc="Theorem 12.5.1.1, p. 519"`. A specialization, a reformulation, or a
  shortcut that is ours says so once where it appears ("In our notation", "Our compression"), and is listed
  in your report.
- The page treats the proof as a proof. Do not write "claimed", "purported", or "if correct". Where the source
  text is a draft (a missing section, a sketched limit), write the mathematics as the source's introduction
  and letter give it and point there; do not editorialize about the draft. Do not use the line version of
  the endgame or any multiplicity statement (digest, Section 9).
- Results proved before this work (Tate's thesis, Poisson summation, Weil's explicit formula, Connes's local
  computation, facts about nuclear spaces) get a `sketch` with a source and a minimal `idea`. Results new in
  this work get full `card` treatment with the most complete proof the source allows for the $\mathbb Q$ case,
  written out step by step.
- Check every formula you print. Where a formula can be tested numerically, test it with
  `"/c/Users/Logan Hallee/Desktop/millennium-explainers/.cache/venv/Scripts/python.exe"` (mpmath, sympy):
  Poisson identities, the trace on the circle $\log\lambda\sum_k\varphi(\lambda^k)$, Mellin transforms of your
  example functions, the explicit formula with a concrete $\varphi$ against the first few hundred zeros. The
  digest warns that its archimedean constants over $\mathbb Q$ are its own specialization: verify them against
  the source's Theorem B.4.4.7 (p. 623) and numerically before printing them.
- Three or four figures per chapter as `figure` containers with a caption and a `vizspec` complete enough for
  a programmer who has not read the chapter. The digest lists candidates per chapter. Prefer figures the
  reader can drag. Do not write JavaScript. Figure colors follow `NOTATION.md`.
- 4,000 to 6,000 words per chapter, not counting math. Glossary: 8 to 14 terms per chapter, narrow patterns.
- Citations only to works you are sure exist. The source: key `masullo`. Others the digest names: Tate's
  thesis in Cassels and Frohlich; Weil 1952; Connes, Selecta Math. 5 (1999); Meyer; Deninger. Add an entry
  only with details you are sure of.
- No em dashes, no emojis, no "clearly" or "obviously", American English, Oxford comma, `%`.

## Files

Each writer creates only the chapter files assigned in `OUTLINE.md`, the matching
`glossary/NN-slug.yml` and `references/NN-slug.yml`, and nothing else. Anchors are unique across the page:
after the kind letter use your chapter's prefix (`ad-`, `tt-`, `pc-`, `sp-`, `ck-`, `tf-`, `tg-` for chapters
11 to 17), for example `t-pc-circle-trace`, `f-sp-strip`. Front matter: `part: 3`, and `needs` lists the
chapter ids yours relies on. Chapter ids: `adeles`, `tate-theta`, `primes-as-circles`, `strip-topology`,
`cutting-the-kernel`, `trace-formula`, `trace-to-grh`.

Adjacent chapters are written in parallel by other agents. The interfaces between chapters are fixed here so
that they meet:

- Chapter 11 delivers: $\mathbb Q_p$, $\mathbb Z_p$, $\mathbb Z_p^\times$, $\lvert\cdot\rvert_p$, the product
  formula, Haar measure on $\mathbb Q_p$ and $\mathbb Q_p^\times$ in one page, the adeles and ideles of
  $\mathbb Q$, $C_\QQ \cong \RR_{>0}\times\hat\ZZ^\times$, functions $g \otimes \bigotimes_p \mathbf 1_{\ZZ_p}$,
  the Fourier transform and Poisson summation on $\AA/\QQ$ as a statement.
- Chapter 12 delivers: $\Theta_g(t) = \sum_{n\ne0} g(nt)$ as the adelic theta function of
  $g\otimes\bigotimes\mathbf 1_{\ZZ_p}$; its symmetry (adelic Riemann and Roch equals Poisson summation); its
  Mellin transform $2\zeta(s)\int_0^\infty g(t)t^s\,\dd t/t$; the conditions $g(0) = 0$ and $\int g = 0$ and
  the exponential decay they give; the theorem that Mellin transforms of the weighted theta sums
  $t^{1/2}\Theta_g(t)$ are exactly $\xi(z+\tfrac12)$ times entire functions of the right class; the divisor
  exact sequence (functions modulo theta functions are jets at the points $z = \rho - \tfrac12$); the operator
  $A(\varphi)$ acting on the quotient with eigenvalues $M\varphi(\rho-\tfrac12)$; and the remark that in this
  fine topology the resulting trace formula is Weil's explicit formula again. It also defines $D_p$ and shows
  that on the Mellin side it multiplies by $1 - p^{-s}$.
- Chapter 13 delivers: the toy circle $\RR_{>0}/\lambda^\ZZ$, its exponential basis $t^{2\pi i m/\log\lambda}$,
  the trace of $A(\varphi)$ on it, $\sum_m M\varphi(2\pi i m/\log\lambda) = \log\lambda\sum_{k\in\ZZ}\varphi(\lambda^k)$,
  which is 0 when $\operatorname{supp}\varphi\subset(1,\lambda)$; the orbital quotient at $p$ (theta sums modulo
  the image of $D_p$) as functions on the circle of length $\log p$; why different primes do not interfere;
  why the quotient of theta sums equals the quotient of all functions.
- Chapter 14 delivers: the space $W_a$, its Mellin picture as a Hardy space on $\lvert\Re z\rvert < a$,
  continuity of evaluation exactly inside the strip, the quotient of $W_a$ by the closure of the weighted
  theta sums, and the spectral trace $\sum_{\lvert\beta-1/2\rvert<a} m_\rho\,M\varphi(\rho-\tfrac12)$.
- Chapter 15 delivers: the kernel $\varphi(x/y)$, $k_{\mathrm{spec}} + k_{\mathrm{geom}}$, the diagonal mass
  of $k_{\mathrm{geom}}$ equals minus the spectral trace, the lift to the ideles, the stratification as a
  sieve, each slice acting on an orbital quotient with vanishing trace for $p > Y$, and the conclusion that
  only an $S$-local kernel is left.
- Chapter 16 delivers: the $S$-local trace (Connes's computation), why the weight is $\tfrac12$, the Trace
  Formula over $\mathbb Q$ in the form of the digest's Section 5 item 7 with verified constants, the general
  statement (Theorem 12.5.1.1), and the side-by-side with Weil's explicit formula from chapter 8.
- Chapter 17 delivers: the endgame, twice (the source's holomorphic family with Montel, then the subtraction
  from Weil's formula as our compression), the reflection by the functional equation, why positivity is not
  used, what the source says about function fields, and a one-page recap of the whole route as a chain.

## Report (under 300 words)

Files and word counts; figure names with one line each; every specialization, reformulation, shortcut,
analogy, or symbol that is ours and not the source's; every formula you verified numerically and how; every
place where you could not find the statement in the source and what you did; anything you are less than sure
of.

## No deletes in the repository

Never delete anything inside the repository, and never delete a path given through a shell variable: the user's
global hook asks for approval of every such command, even in bypass mode. Keep all throwaway files in your
scratch folder under the temp directory. If a file in the repository must go, name it in your report and leave it.
