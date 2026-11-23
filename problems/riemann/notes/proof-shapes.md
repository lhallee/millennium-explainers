# The shapes figure: every node and link with its source

This file backs figure `f-tp-shapes` in chapter 25 (`viz/tp-shapes.js`), which draws the two proofs as one graph
of uses. It was compiled on 2026-11-23 from the page's chapters, the Lean notes in this folder
(`lean-inventory.md`, `lean-read-1-endgame.md` to `lean-read-5-published-inputs.md`), and Masullo's monograph as
digested in `masullo-digest.md`. The framings that are ours are also recorded in `framing.md`, under "Chapter 25,
the shapes figure".

## Rules of the drawing

- A link from u to v means that the proof of v, as this page presents it or as the Lean declaration states it,
  uses u. Links point up the page.
- One node per step that the page states as a card, after the merges listed below. Route M has 10 nodes of its own
  and Route A has 10, beside 4 results both use, 5 results that one route takes from the literature, the theorem,
  and Route M's extension to Hecke characters.
- A link already implied by another drawn path is left out, with one exception, the functional equation into Route
  M's endgame (see "Links").
- Not drawn: the analysis and the library that every step uses. That covers Fourier and Mellin analysis, Hilbert
  and Sobolev spaces, Mathlib, and the zero count of von Mangoldt (`t-ze-riemann-von-mangoldt`). Route M uses the
  count in three places: to make the trace of chapter 12 converge, to make the eigenvalues of the spectral trace
  summable (`t-sp-spectral-trace`, "there are $O(\log T)$ zeros with $T\le\abs\gamma\le T+1$"), and in the zero
  sums of the Trace Formula and the endgame. An earlier draft had a "Zero count" node feeding the circle. It was
  replaced because the circle step uses only the absence of zeros on the line $\Re s=1$.
- The module checks, when it starts, that every link points up, that the graph is connected, that each ring marks a
  waist, and how many pieces remain without the shared results and the theorem.

## Nodes

The table is generated from the module's `NODES` array, so it lists exactly what the figure shows. "Waist" marks a
result through which every own result of its route below it reaches the theorem.

| Id | Name | Route | Kind | Page anchor | Source |
| --- | --- | --- | --- | --- | --- |
| `rh` | Real part ½ for ζ and every Dirichlet L | both | conclusion | `tp-reach` | Route M: Masullo, §§1.4.2 to 1.4.5, pp. 28 to 30. Route A: riemannHypothesis and four others, Main.lean. |
| `hk` | and every Hecke L | M | conclusion | `s-tg-general` | Masullo, pp. 28 to 30 and 53 to 55; the generality is asserted on p. 6. |
| `pois` | Poisson summation | both | used by both | `t-ad-poisson` | Stein and Shakarchi, Fourier Analysis; on the adeles, Tate's thesis. Chapters 4, 11, and 24. |
| `tate` | Tate's thesis | both | used by both | `s-ia-tate` | Tate, thesis of 1950, in Cassels and Fröhlich (1967), ch. XV. GlobalTheory.Published.HeckeLEntireAndNonzeroAtOne, Development/AbelianVarietyTheory/PublishedTheorems/TwistedTraceFormula/HeckeLEntireAndNonzeroAtOne.lean. |
| `fe` | Functional equation | both | used by both | `t-zc-functional-equation` | Riemann 1859; for L(s, χ), Davenport, Multiplicative Number Theory. Chapters 4 and 7. |
| `ld` | Zeros are poles | both | used by both | `t-ep-logderiv` | Apostol, Introduction to Analytic Number Theory. In Route A: Deduction.poleData, Development/AutomorphicArithmetic/DedekindLFunctions/LandauTheorems/poleData.lean. |
| `dv` | Divisor sequence | M | own | `t-tt-divisor` | Masullo, Theorem 6.3.2.1, p. 304, and (1.8.3.2), p. 45; over Q the page proves the converse theorem by an argument of its own. |
| `op` | Eigenvalues | M | own | `t-tt-operator` | Masullo, (1.8.3.4), pp. 46 to 47. |
| `sq` | Strip quotient | M | own | `t-sp-quotient` | Masullo, Corollary 9.2.2.5, p. 414, and Theorem 10.2.2.1, p. 446; the page proves the first with arguments of its own. |
| `sp` | Spectral trace | M | own | `t-sp-spectral-trace` | Masullo, Theorem 10.3.2.1, p. 453, and pp. 13 to 14. |
| `pr` | Proto-trace | M | own | `t-ck-proto` | Masullo, (1.8.3.6), p. 48, and Theorem 12.1.1.3, p. 502. |
| `ot` | Primes as circles | M | own | `t-pc-orbital-trace` | Masullo, Theorem 7.5.0.1, p. 374; Theorem 7.3.1.6, p. 344; Theorem 7.4.2.1, p. 367. |
| `sv` | Sieve | M | own | `t-ck-slices-vanish` | Masullo, Theorem 11.3.2.1, p. 495. |
| `rm` | S-local remnant | M | own | `t-ck-remnant` | Masullo, pp. 16 and 52, and the proof of Theorem 12.5.1.1, p. 520. |
| `tf` | Trace Formula | M | own, waist | `t-tf-trace-formula` | Masullo, Theorem 12.5.1.1, p. 519. |
| `eg` | Endgame | M | own | `t-tg-rh` | Masullo, §§1.4.2 to 1.4.5, pp. 28 to 30, with a fixed cutoff of ours. The page's shorter route subtracts Weil's explicit formula instead. |
| `sl` | Connes's trace | M | from the literature | `t-tf-s-local` | Connes 1999; Masullo, Theorem 12.4.1.1, pp. 514 to 519. |
| `zc` | No zero on σ = 1 | M | from the literature | `t-ze-nonvanishing-one` | de la Vallée Poussin 1896. Chapters 5 and 13; Masullo, Theorem 7.5.0.1, p. 374. |
| `fv` | Five theorems | A | own | `t-le-five` | UpperTheory.Top.imprimitive, Development/AutomorphicArithmetic/CharacterBoxes/Imprimitive.lean. |
| `ct` | Contract | A | own | `t-le-contract` | Formalism.HC.level_of_tiedWin, Formalism/SharpRestriction/RamificationFrobenius/TotientGaloisClasses/TopWin.lean. |
| `wl` | Windowed Landau | A | own | `t-le-windowed` | Deduction.zeroFree_of_rpow_window, Development/AutomorphicArithmetic/DedekindLFunctions/LandauTheorems/ZeroFreeOfRpowWindow.lean. |
| `iw` | Inequality on windows | A | own, waist | `t-le-interface` | Formalism.HC.ChebyshevInequalityOnWindows, Formalism/SharpRestriction/RamificationFrobenius/TotientGaloisClasses/TopWin.lean; proved for every level by level_gm_le_on_family_scales. |
| `cb` | From count to bound | A | own | `t-ig-core` | UpperTheory.Comparison₂.core_gm, Development/AutomorphicArithmetic/PrimitiveCosets/CoreGm.lean; the identity is AskMainBalance, Formalism/SizeWindowBrackets/FirstPrimeNeSecondPrime.lean. |
| `tc` | Chain of theta lifts | A | own | `ml-chain` | UpperTheory.Top.TopG, Development/AutomorphicArithmetic/CharacterBoxes/ZeroFreeAllOfTopG.lean, from Green and the record HypsAlt. |
| `pi` | Published inputs | A | own | `t-ia-assembly` | UpperTheory.LiteratureTheorems.OpenLiteratureStatements, Development/AutomorphicArithmetic/ThetaCorrespondence/ThetaPairLifts/ThirdPlaceSeries/EveryCharacterOfLiteratureOfVWin.lean. |
| `hs` | Hosts on windows | A | own | `le-interface` | UpperTheory.Top.supplyChi, Development/AutomorphicArithmetic/CharacterBoxes/SupplyChi.lean; UpperTheory.Top.PairEx, Development/AutomorphicArithmetic/CharacterBoxes/PairGood.lean. |
| `vw` | Cohomological window | A | own | `t-cw-vwin` | UpperTheory.Top.VWin, Development/AutomorphicArithmetic/CharacterBoxes/ExistsPageN.lean; proved by vwin_of_row. |
| `rb` | Galois input (Row0b) | A | own | `t-ig-row0b` | UpperTheory.GalStar.Row0b, Development/AutomorphicArithmetic/Foundations/GaloisRepresentations/TypeConditions/WeightsConjBis.lean; derived in galoisRepresentations_of_thetaLift. |
| `sw` | Siegel and Weil | A | from the literature | `t-ia-siegel` | Siegel 1935; GlobalTheory.ThK.Dbl.SiegelWeilStd, Development/WeilBound/ThetaLifts/LatticeBasics/HypothesesS.lean. |
| `ll` | Local Langlands | A | from the literature | `t-ia-llc` | UpperTheory.Zero.LLC.RecTExists, Development/AutomorphicArithmetic/Foundations/LocalLanglands/IsRecTOfIsRec.lean. |
| `fw` | Ferrero and Washington | A | from the literature | `t-cw-iwasawa` | Washington, Introduction to Cyclotomic Fields, ch. 7 and 13; UpperTheory.V.Published.FerreroWashington, Development/AutomorphicArithmetic/AutomorphicVarieties/PublishedTheorems/FerreroWashington.lean. |

## Links

Each row gives where the page shows the use. Anchors are this page's; a Lean name is the declaration the page
quotes.

### Route M

| Link | Where the use is shown |
| --- | --- |
| `tate` to `dv` | The theta sums and their Mellin transforms $2\zeta(s)Mg(s)$ are Tate's zeta integrals (`tate-theta`, `tp-share-tate`); the divisor sequence is a statement about them (`t-tt-divisor`, through `t-tt-mellin-iso`). |
| `fe` to `dv` | `t-tt-divisor`: the Mellin transform of a theta sum is $\xi(z+\tfrac12)$ times an entire function, which needs the theta symmetry and the functional equation (`t-tt-converse`, `t-tt-functional-equation`). Masullo (1.8.3.2), p. 45. |
| `dv` to `op` | `t-tt-operator` cites `t-tt-divisor`. |
| `dv` to `sq` | The proof of `t-sp-quotient` uses "the dual form of the divisor exact sequence" (Masullo, Theorem 7.1.4.2). |
| `tate` to `ot` | Chapter 13 builds the circle from the theta sums and the deletion operator $D_p$ of `tate-theta`, before `t-pc-orbital-circle`. |
| `fe` to `ot` | `t-pc-orbital-circle`, why: the functional equation reflects the axis $\Re s=0$, where the circle looks, onto $\Re s=1$. |
| `zc` to `ot` | Same place: $\zeta$ has no zero on $\Re s=1$ (`zeros`, `t-ze-nonvanishing-one`); the sketch cites the nonvanishing of $L$ on that line (Masullo, Theorem 7.5.0.1, p. 374). |
| `op` to `sp` | Proof of `t-sp-spectral-trace`: the matrix is block triangular "with the Jordan blocks of the idea", the eigenvalue structure of `t-tt-operator` (card location pp. 46 to 47). |
| `sq` to `sp` | `t-sp-spectral-trace` cites `t-sp-quotient`. |
| `sp` to `pr` | `t-ck-proto`: the geometric kernel carries minus the spectral trace (`eq-ck-spectral`). |
| `ot` to `sv` | `t-ck-slices-vanish` rests on chapter `primes-as-circles`. |
| `pr` to `rm`, `sv` to `rm` | `t-ck-remnant` cites `t-ck-proto` and `t-ck-slices-vanish`. |
| `rm` to `tf` | The proof of `t-tf-trace-formula` reduces to the $S$-local remnant of chapter `cutting-the-kernel` (`eq-tf-reduction`). |
| `sl` to `tf` | `t-tf-trace-formula` cites `t-tf-s-local`. |
| `tf` to `eg` | `t-tg-rh` cites `t-tf-trace-formula`. |
| `fe` to `eg` | `t-tg-rh`, step 9: the zeros are symmetric under $\rho\mapsto1-\rho$ by the functional equation. Implied by the path through `dv`, and drawn anyway, because the reflection is a separate use in the endgame and is one of the two things the endgames share (`tp-apart`). |
| `ld` to `eg` | `t-tg-rh`, steps 2 and 8: the prime side is the Dirichlet series of $-\zeta'/\zeta$ (`t-ep-logderiv`), and a zero of order $m$ is a pole with residue $-m$. |
| `eg` to `rh` | `tp-reach` cites `t-tg-rh`. |
| `eg` to `hk` | `s-tg-general` cites `t-tg-rh`; Masullo, pp. 28 to 30 and 53 to 55. |

### Route A

| Link | Where the use is shown |
| --- | --- |
| `rb` to `vw` | `t-cw-vwin`, the formal chain, step (6): `vwin_of_row` derives `VWin` from `Row0b`; the Lean block states `UpperTheory.One.vwin_of_row (h : UpperTheory.GalStar.Row0b ...) : UpperTheory.Top.VWin`. |
| `fw` to `vw` | Same chain, step (1): `thmBab_of` gives the 2-part and the special odd primes on windows from Ferrero and Washington (`cw-iwasawa`). |
| `rb` to `pi` | `t-ia-assembly`, idea: `Row0b` and `RecTExists` are fed into the record `OpenLiteratureStatements`; the card cites `t-ig-row0b`. |
| `ll` to `pi` | Same; the card cites `t-ia-llc`. |
| `tate` to `pi` | `s-ia-table`: `HeckeLEntireAndNonzeroAtOne` is a field of `ThetaLocalInputs`, one of the bundles (`t-ia-hecke`). |
| `vw` to `hs` | `t-le-interface`, step 1: `UpperTheory.Top.supplyChi` builds hosts on windows from `VWinAt ψ 401`. |
| `pi` to `tc` | `t-le-interface`, step 2: `TopG` from `Green` and the `HypsAlt` record; `t-ia-assembly`, idea: the theta-integral assembly produces `HypsAlt` from the bundles and takes Green's theorem from a bundle. |
| `sw` to `tc` | `t-df-siegel-weil` and its paragraph: the Siegel and Weil formula is one of the two inputs of `theoremK_head2`, which proves `ThetaIntegralsAgree`, the constants of the theta integrals along the chain; `s-ia-table`, row `SiegelWeilStd`; `t-ia-siegel`, why. In the code `ThetaIntegralsAgree` enters through the assembly, so the link could also be drawn into `pi`. It is drawn into the chain because that is the use the page names. |
| `hs` to `tc` | `t-le-interface`, step 2: the tied chain exists "whenever such hosts exist on windows". |
| `tc` to `cb` | `t-le-interface`, step 3: the tied-chain property `ChainTied` used by `core_gm` "is supplied by step 2"; `t-ig-core`. |
| `cb` to `iw` | `t-le-interface` cites `t-ig-core`: `level_gm_le_on_family_scales` from `UpperTheory.Comparison₂.core_gm`. |
| `iw` to `ct`, `wl` to `ct` | `t-le-contract` cites `t-le-interface` and `t-le-windowed`. |
| `ld` to `wl` | `t-le-windowed` rests on `t-le-poles`, which the code builds in `Deduction.poleData` from $-P'/P$ (`poleData.lean`). |
| `ct` to `fv` | `t-le-five` cites `t-le-contract`. |
| `fe` to `fv` | `t-le-five` cites `t-rh-l-fe`, the functional equation of $L(s,\chi)$, to reflect the half-plane. |
| `fv` to `rh` | `tp-reach` and `t-ra-main`: the five theorems of `Main.lean`. |

### Into the shared results

| Link | Where the use is shown |
| --- | --- |
| `pois` to `tate` | `t-ia-hecke`, proof: Poisson summation on the adeles exchanges the two halves of the global zeta integral; `s-ia-tate`: the tree formalizes Tate's thesis from Poisson summation on adeles. |
| `pois` to `fe` | `t-zc-theta-symmetry`: the theta symmetry is Poisson summation on a Gaussian. |
| `pois` to `sw` | Not shown on the page. `lean-read-5-published-inputs.md`, "Classical identity and match": the tree's `PositivityTheory.SiegelWeilFormula.Fin.siegelWeilStd` comes from `siegelWeilStd_pre (hP : TW.Poisson) (hCT : CTSplit)`, Poisson summation for the Weil representation plus a constant-term splitting. Reading `TW.Poisson` as an instance of the shared node "Poisson summation" is ours. |

## Links left out as implied

These uses are real and are shown on the page, but a drawn path already carries them.

- `tate` to `sv`: the sieve lifts theta sums to the ideles (`t-ck-slices-vanish` cites `tate-theta`); implied by
  `tate` to `ot` to `sv`.
- `fe` to `tf`: implied by `fe` to `ot` to `sv` to `rm` to `tf`.
- `hs` to `cb`: step 3 of `t-le-interface` bounds the characters outside the cyclic group by the hosts' bounds
  (`sigA_le`); implied by `hs` to `tc` to `cb`.
- `tc` to `iw`: implied by `tc` to `cb` to `iw`.

## Merges

To keep each route to about ten results, these steps are drawn as one node each.

- "Divisor sequence" contains the converse theorem over $\mathbb Q$ (`t-tt-converse`).
- "Primes as circles" contains the orbital circle (`t-pc-orbital-circle`) and the orbital trace
  (`t-pc-orbital-trace`), with the vanishing beyond the support.
- "Strip quotient" contains the evaluation theorem (`t-sp-evaluation`) and the strip jets (`t-sp-strip-jets`).
- "Hosts on windows" contains `supplyChi` and the auxiliary primes `PairEx` (`t-ig-pairex`).
- "From count to bound" contains the finite-group explicit formula `AskMainBalance` (`t-ig-balance`) and
  `core_gm`.
- "Galois input (Row0b)" contains `GeoOne` and `TLiftK`, from which the tree proves `Row0b`.
- "Published inputs" stands for `OpenLiteratureStatements`, its nine bundles, and the theta-integral assembly
  that builds `HypsAlt`.

## What could not be traced

- How the divisibility of the chain reaches the count of inert prime powers. The page states `TopG` and does not
  unfold it (`ml-gaps`), so the link from the chain to "From count to bound" stands for the tied data that
  `TopG` supplies to `core_gm` through `ChainTied`, as `t-le-interface` states. No link is drawn from `ThmP` or
  the other steps inside the chain.
- The roughly 45 fields of `HypsAlt` and the predicate `DefiniteSideCondition` were not unfolded, so the link
  from "Published inputs" to the chain is drawn at the level of the record.
- Whether Route A's proof also uses a result drawn only on Route M. One candidate: the tree's formalization of
  Tate's thesis reaches the nonvanishing on $\Re s=1$ (`s-ia-tate`), but the page shows Route A using only the
  published statement `HeckeLEntireAndNonzeroAtOne`, nonvanishing at $s=1$. The shared results are the ones the
  page shows both routes using, and the figure's summary says so ("this page shows no other result that both
  use").

## Checks the module makes

- Waists, computed from the links: all 8 own results of Route M below the Trace Formula, and all 6 own results of
  Route A below the inequality on windows, reach the theorem only through it. "Windowed Landau" joins Route A
  above its waist, at the contract.
- Without the 4 shared results and the theorem, the graph falls into 2 pieces, one per route. This is a fact
  about the drawing at this grain, not a theorem about the proofs.
- The whole graph is connected, and every link points up.

## Measured on 2026-11-23

`node build/check.mjs --skip-scroll --figures tp-shapes` on the 4-core desktop, final module: setup at 4x CPU
slowdown, labels 7.0 ms, init 14.5 ms, first frame 25.9 ms; steady frames at 1x 1.1 ms median and 2.7 ms at the
95th percentile; at 4x, 5.5 ms median and 10.6 ms at the 95th percentile. All checks passed. The run before the
last edits (node `zc` renamed, the summary reworded) gave 6.5, 20.3, and 31.7 ms of setup and 9.7 ms at the 95th
percentile at 4x.
