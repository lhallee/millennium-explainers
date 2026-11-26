# Riemann Hypothesis: outline and status

The main session owns this file. It fixes the curriculum, who writes what, and where each chapter stands.

## Sources

| Key | What | Where | Read |
| --- | --- | --- | --- |
| note | L. Alpoge, untitled four-page remark announcing a proof of RH and GRH with Claude | `sources/riemann/remark.pdf`, text in `remark-pages/`; https://alpo.ge/remark.pdf | 2026-11-20 |
| lean | The Lean 4 formalization, 14 archive parts, 175,187 files | https://alpo.ge/lean.tar.gz.part01 to part14; `sources/riemann/lean/lean/` (Lean 4.33.1, Mathlib rev `0df444a360ea`); joined archive 239,275,554 bytes, SHA-256 `9631b4f020199e580ba86178cb56c6e9b09f690c2369a80dc4334aa93f49c7fc` | 2026-11-20 and 2026-11-21 |
| masullo | A. M. Masullo, "The Music of the Primes", 940-page draft proving GRH for all number fields and unitary Hecke characters | `sources/riemann/masullo.pdf`, text in `masullo-pages/pNNNN.txt` (PDF page numbers); announced at https://math216.wordpress.com/2026/11/20/hurried-announcement-alessandro-masullo-grh/ | 2026-11-20 |
| grh-lean | A shorter rewrite of the Lean proof by colleagues at Anthropic with Claude, two editions: `grh` (805 files, about 300,000 lines of code) and `grh-compact` (796 files, about 76,000) | https://github.com/lsernau/grh-lean, commit `72fead1` of 2026-11-25; `sources/riemann/grh-lean/` (shallow clone; Lean 4.35.0, Mathlib `56a00585`); digest in `notes/grh-lean-digest.md` | 2026-11-26 |

`sources/` is ignored by git. The text files are a machine extraction: formulas lose their layout, so read the
PDF page itself (the Read tool takes a `pages` range) whenever a formula matters.

## The two routes

- **Route M (Masullo).** Tate's thesis done in families: adelic theta functions, idelic zeta functions, and a
  trace formula on the idele class group whose spectral side sums over zeros of Hecke L-functions and whose
  geometric side sums over places. The zeros are located by feeding the trace formula holomorphic families of
  test functions. Written, human, 940 pages with an overview in its Chapter 1.
- **Route A (Alpoge and Claude).** A descendant of Stepanov's proof for curves over finite fields. The note
  speaks of positivity of Weil's functional on chosen test functions; the formal proof establishes a one-sided
  upper bound on a smoothed sum over primes on windows of scales, and a windowed form of Landau's theorem turns
  that bound into the hypothesis. The multiplicity that Stepanov's argument needs is supplied by a chain of
  about sqrt(x) theta lifts between totally definite unitary groups. Lean only, with a 20-step timeline in the
  note.

Both pass through Weil's explicit formula, so that chapter is the hinge of the page.

## Curriculum

All five parts are written. Status as of 2026-11-23; "refereed" means a second agent checked the chapter's
mathematics against its sources and recomputed its numbers. All 95 figures are built and were reviewed at
phone and desktop width in both themes. The reviewing session's first pass (19 items, 2026-11-21) is applied;
the second pass (2026-11-23) rechecked those items on the final text and read chapters 20 and 24 in full. The
one limit not met with margin is the worst scroll frame at 4x CPU slowdown, recorded in `AGENTS.md`.

Added 2026-11-24 at Logan's request, by the main session and not yet refereed by a second agent: chapter 1's
section `cp-chebyshev` (Chebyshev's budget: the binomial window bound with proof, the lower bound, and Chebyshev's
1852 number with his constants, checked against the 1852 paper's citation data and Gantumur's review, every number
recomputed) and its figure `chebyshev-budget`, the 96th; bridges to it in chapters 10 and 21; two rows of chapter
9's dictionary; a paragraph in chapter 13 on what Route M borrows from the function-field picture; and a table in
the two-proofs chapter's `tp-function-fields` (then chapter 25, now 26) pairing each route with a function-field
proof. The framings are in `notes/framing.md`.

Also added 2026-11-24 at Logan's request, by a side session and not yet refereed by a second agent: the two-proofs
chapter's figure `tp-shapes`, the 97th, which draws both proofs as one graph of uses. Its nodes and links, each with
a source, are in `notes/proof-shapes.md`, and its framings are in `notes/framing.md`.

Added 2026-11-26 at Logan's request, by the main session and not yet refereed by a second agent: chapter 25,
`25-route-a-compressed.md` (id `route-a-compressed`), on the shorter rewrite of the Lean proof in `grh-lean`, and
its figure `covolume-squeeze`, the 98th. It states the rewrite's main inequality and derives the theorem from it,
proves the two lattice facts in their simplest form, explains the size and divisibility ledger and the exact
cancellation of the L-value, and sets the rewrite's entries beside Stepanov's ledger. The two-proofs chapter is now
chapter 26; its file keeps the name `25-two-proofs.md`, because renaming it would delete the old path. Short
pointers to the new chapter were added in chapters 1, 18, 19, 21, 24, and 26. The facts read from the rewrite are in
`notes/grh-lean-digest.md`, and the framings are in `notes/framing.md`.

Also fixed 2026-11-26, in the figure kit (`shared/viz/kit.js`, `start` and `FP.restore`): at 4x CPU slowdown the
browser can deliver two visibility entries for one figure in a single batch, "on screen" and then "far away". The kit
acted on each entry in turn, so it released the figure and then gave the canvas back on the stale entry, and the
check found a figure 26 screens away still holding its canvas. The kit now acts only on the last entry for each
figure, and it never restores a figure that is more than 7 screens away. A test that hands the kit's callbacks
these batches directly fails on the old kit and passes on the new one.

| # | File | Chapter | Part | Owner | Status |
| --- | --- | --- | --- | --- | --- |
| 1 | `01-counting-primes.md` | Counting primes | I | writer W1 | written, refereed, figures built |
| 2 | `02-euler-product.md` | Euler's product: primes inside one function | I | writer W1 | written, refereed, figures built |
| 3 | `03-complex-toolkit.md` | The complex analysis we need | I | writer W2 | written, refereed, figures built |
| 4 | `04-zeta-continued.md` | Zeta on the whole plane | I | writer W2 | written, refereed, figures built |
| 5 | `05-zeros.md` | The zeros and the hypothesis | I | writer W3 | written, refereed, figures built |
| 6 | `06-explicit-formula.md` | The explicit formula: each zero is a wave | I | writer W3 | written, refereed, figures built |
| 7 | `07-what-rh-says.md` | What the hypothesis says about primes, and its generalizations | I | writer W3 | written, refereed, figures built |
| 8 | `08-weil-positivity.md` | Weil's explicit formula and the positivity criterion | II | writer W4 | written, refereed, figures built |
| 9 | `09-function-fields.md` | The world where it was already true: curves over finite fields | II | writer W4 | written, refereed, figures built |
| 10 | `10-stepanov.md` | Stepanov's proof | II | writer W4 | written, refereed, figures built |
| 11 | `11-adeles.md` | The adeles: all completions at once | III | writer M1 | written, refereed, figures built |
| 12 | `12-tate-theta.md` | Tate's thesis as theta and zeta: functions modulo theta functions | III | writer M1 | written, refereed, figures built |
| 13 | `13-primes-as-circles.md` | Primes as circles: orbital bases and their traces | III | writer M2 | written, refereed, figures built |
| 14 | `14-strip-topology.md` | Choosing the topology: what a strip can see | III | writer M2 | written, refereed, figures built |
| 15 | `15-cutting-the-kernel.md` | Cutting the kernel along the primes | III | writer M3 | written, refereed, figures built |
| 16 | `16-trace-formula.md` | The local trace and the Trace Formula | III | writer M4 | written, refereed, figures built |
| 17 | `17-trace-to-grh.md` | From the Trace Formula to the hypothesis | III | writer M4 | written, refereed, figures built |
| 18 | `18-route-a-plan.md` | Stepanov over the integers: the plan and the map of the formal proof | IV | writer A1 | written, refereed, figures built |
| 19 | `19-landau-endgame.md` | The last mile: a one-sided bound on windows forbids zeros | IV | writer A2 | written, refereed, figures built |
| 20 | `20-definite-forms.md` | Forms you can hold: definite unitary groups and theta lifts as matrices | IV | writer A3 | written, refereed, figures built |
| 21 | `21-multiplicity-from-lifts.md` | Multiplicity without derivatives: a chain of length about the square root | IV | writer A4 | written, refereed, figures built |
| 22 | `22-integrality-and-galois.md` | Paying for the chain: integrality, Galois representations, and the count that is bounded | IV | writer A5 | written, refereed, figures built |
| 23 | `23-cohomology-window.md` | The arithmetic residue: a window in Galois cohomology | IV | writer A6 | written, refereed, figures built |
| 24 | `24-inputs-and-assembly.md` | What the proof stands on | IV | writer A7 | written, refereed, figures built |
| 25 | `25-route-a-compressed.md` | The second proof, shortened: one covolume squeezed from both sides | IV | main session, 2026-11-26 | written, figure built, not refereed |
| 26 | `25-two-proofs.md` | Two proofs, one theorem | V | writer A8 | written, refereed, figures built |
### What each fixed chapter must contain

1. **Counting primes.** The primes, $\pi(x)$ as a staircase, Gauss's density guess $1/\log x$, $\mathrm{Li}(x)$,
   the prime number theorem as a statement, how good the estimate is in numbers, and the question the whole
   page answers: how large is $\pi(x) - \mathrm{Li}(x)$. Introduce $\Lambda(n)$ and $\psi(x)$ late in the chapter
   as the count that makes formulas clean, with the dictionary between $\pi$ and $\psi$.
2. **Euler's product.** $\zeta(s)$ for real $s > 1$, the Euler product with its proof, why it encodes unique
   factorization, divergence of $\sum 1/p$, the logarithmic derivative $-\zeta'/\zeta = \sum \Lambda(n) n^{-s}$,
   and why a sum over primes turned into a function is worth having.
3. **Complex toolkit.** Holomorphic functions, how to see one (domain coloring), power series, analytic
   continuation and its uniqueness, contour integrals, Cauchy's theorem, residues, the argument principle,
   the Gamma function, the Fourier transform, Poisson summation, and the Mellin transform. A refresher that
   states, illustrates, and cites, with proofs only where they are short.
4. **Zeta continued.** Convergence for $\Re s > 1$, continuation to $\Re s > 0$ by the alternating series,
   the Jacobi theta function and its symmetry from Poisson summation, Riemann's integral, the completed
   function $\xi(s)$, the functional equation with full proof, the pole at 1, and the trivial zeros.
5. **Zeros.** The critical strip, the symmetries of the zero set, the first zeros in numbers, counting zeros
   up to height $T$ (Riemann and von Mangoldt, sketch), Hadamard's product (statement), no zeros on
   $\Re s = 1$ (the 3-4-1 argument in full), and the statement of RH.
6. **Explicit formula.** Perron's formula, moving the contour, $\psi(x) = x - \sum_\rho x^\rho/\rho - \dots$,
   what a single zero contributes as a wave in $\log x$, and the staircase rebuilt from zeros.
7. **What RH says.** $\psi(x) = x + O(x^{\Theta + \varepsilon})$ exactly when no zero has real part above
   $\Theta$, RH as square-root cancellation, the smoothed sum $\sum_{n \le X} \Lambda(n)(X/n - 1)$ and why
   smoothing helps, equivalent forms, then Dirichlet characters, $L(s, \chi)$, primes in progressions, GRH,
   and one page on number fields, Dedekind zeta, Hecke characters, and the extended hypothesis.
8. **Weil positivity.** Test functions, the explicit formula as a duality between primes and zeros for any
   test function (Guinand and Weil), the functional $W$, Weil's criterion that RH holds exactly when $W$ is
   nonnegative on functions of the form $f * \tilde f$, with proof of both directions, and why it reads as a
   trace formula.
9. **Function fields.** $\mathbb F_q[T]$ beside $\mathbb Z$, irreducible polynomials as primes, the prime
   polynomial theorem with its exact formula, curves over $\mathbb F_q$, counting points, the zeta function
   of a curve, rationality and the functional equation (statements), and RH for curves as the bound
   $\lvert N_n - q^n - 1\rvert \le 2g\,q^{n/2}$.
10. **Stepanov.** The full proof for a curve, in Bombieri's form: an auxiliary function that vanishes to
    high order at every rational point, the degree count that bounds the number of points from above, the
    Galois-cover argument for the lower bound, and the passage from the bound to the zeros. Then what the
    proof used that the integers lack: Frobenius, and a derivative with which to define multiplicity.

## Conventions for all chapters

- The complex variable is $s = \sigma + it$. A nontrivial zero is $\rho = \beta + i\gamma$.
- Follow `NOTATION.md`. Logarithms are natural. $p$ is always a prime, $n$ a positive integer.
- Chapters 1 to 7 treat the classical theory, so every result there is known: give the statement, the idea,
  and a proof when it is short or central (listed above), otherwise a sketch with a source.

## Part III plan (Route M)

The map is `notes/masullo-digest.md`: its Section 3 is the chain, Section 5 the specialization to $\zeta$,
Section 9 the state of the source text, and Section 10 the chapter briefs (III.1 to III.7 are chapters 11 to 17).

Decisions by the main session:

- The story is told for $F = \mathbb Q$ and the trivial character, on $\mathbb R_{>0}$, in the notation fixed in
  `NOTATION.md`. Each chapter ends with a short section "What changes in general" for number fields and Hecke
  characters.
- The endgame follows the source's introduction and letter (strip of half-width $a > 0$, degree 0, no
  positivity). The body's line version and its multiplicity statements are not used.
- The functional-analytic machinery (nuclear and LF spaces, Structure Theorems, Paley-Wiener levels, stacks,
  Lebesgue differentiation on groups) is stated in one sentence each with a pointer into the source. The new
  ideas get the in-depth treatment: the divisor exact sequence, the strip topology, orbital bases and traces,
  the sieve-like stratification, and the endgame.
- Chapter 17 gives the source's holomorphic-family argument and then the shorter subtraction from Weil's
  explicit formula, labeled as our compression.

## Part IV plan (Route A)

Sources: the note (`notes/note-digest.md`), the Lean inventory (`notes/lean-inventory.md`), and five reader
digests (`notes/lean-read-1-endgame.md`, `-2-theta-periods.md`, `-3-lifts-integrality.md`, `-4-window.md`,
`-5-published-inputs.md`). The writers' brief is `notes/part4-brief.md`.

What the readers established, 2026-11-21:

- All 175,187 files are in the import closure of `Main`. The tree has no comments, no `sorry`, and no axioms.
- The final theorems follow from one statement, no zero of any Dirichlet L-function with real part above
  one half, which rests on three inputs named in the code: `Row0b` (Galois representations for cuspidal forms
  over CM fields), `TLiftK` with `GeoOne` (theta lifts exist), and `VWin` (a bound in Galois cohomology on
  windows of scales).
- The endgame is a one-sided Landau theorem in a windowed form: a bound $x^{1/2+9\varepsilon}$ on a
  combination of smoothed prime sums, on windows $[Y, Y^{3/2}]$, gives zero-freeness to the right of
  $\tfrac12 + 9\varepsilon$. The smoothed sum is the note's step 5 exactly.
- The chain of theta lifts between totally definite unitary groups has length $m$ with
  $\sqrt{x^{1-\varepsilon/8}} \le m \le 2\sqrt{x^{1-\varepsilon/8}}$ (`RankVal`): the note's square root.
- `VWin` bounds the sum of the logarithms of the orders of the groups $\text{Sha}^1(E, \mathbb Q_\ell/\mathbb Z_\ell(-k))$ for an abelian CM field
  $E$ built from the character, on a window of scales found by a pigeonhole. This is the note's step 17.
- The code never states positivity of Weil's functional, and the names Stepanov, Guinand, Bost, and Vandiver
  do not occur in it. Part IV presents what the code proves and marks the link to the note's wording as our
  reading.

Decisions by the main session:

- Part IV explains each mechanism in its smallest case and states the code's theorems exactly, with their
  declarations. Where the readers could not unfold a definition or a proof, the chapter says so in one
  sentence and names the declaration. It never fills a gap with a plausible story.
- Chapter 19 (the endgame) gets the fullest treatment: it is elementary, it is where the hypothesis is forced,
  and its windowed Landau theorem is new.
