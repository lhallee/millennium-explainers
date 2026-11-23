# Lean inventory of the RH formalization

Source: `sources/riemann/lean/lean/src/` (extracted archive), indexed 2026-11-20 with the scripts in `tools/lean/`. Nothing in `sources/` was built or run. All numbers below come from the index in `.cache/lean-index/index.sqlite` unless stated; statements are copied from the source files by offset, not retyped.

## Summary

- The tree is 175,187 `.lean` files, 17,374,215 lines, 1.03 GB, with 1,061,425 indexed declarations (784,092 `theorem`, 34,663 `lemma`, 212,819 `def`, 13,202 `abbrev`, 8,286 `structure`, 8,199 `instance`, 121 `inductive`, 43 `class`). Index counts of a few kinds can be off by a small margin (see Tool notes).
- Every one of the 175,187 files is reachable from `Main` through `import`. There is no dead code in the tree: 0 files are outside the import closure. Every file is at most 43 import steps from `Main` (the breadth-first depth of the farthest file is 43; this bounds shortest import paths, not the longest chain). External imports are 344 `Mathlib.*` modules, 3 `Lean.*` modules and 1 `Batteries.*` module.
- The tree contains no comments of any kind. The index found 0 doc comments (`/--`), 0 module docs (`/-!`), 0 plain block comments and 0 line comments (`--`) in all files, and an independent `grep -rlE '/-|--'` over the whole tree returned no file. So there are no module docs to read; the only prose in the tree is in names.
- `sorry`, `admit`, `axiom`, `native_decide`, `unsafe`, `implemented_by`, `sorryAx` and `ofReduceBool` occur 0 times as code tokens, in every directory and in the closure of `Main`. An independent `grep -rlwE` over the tree for the same eight words also returned nothing.
- The final theorem is a thin chain. `riemannHypothesis` is `rhOfAll`, which is `Formalism.VW.rh_of_every allChi`. `allChi` is `UpperTheory.EveryCharacter` (no zero of any Dirichlet L-function with real part above 1/2) and is proved by `UpperTheory.FinalTheorems.everyCharacter`. That in turn reduces to three inputs, named in the Lean code: a Galois-representation statement `Row0b` for polarized regular algebraic cuspidal representations of GL over CM fields, a theta-lift existence statement `TLiftK`, and an "automorphic window" statement `VWin` (see section 3).
- The note's steps are only partly named in the code. Of the 20 steps, 8 are located (5, 6, 7, 8, 9, 12, 19, 20), 10 are partial (1, 2, 3, 4, 10, 11, 13, 15, 16, 18) and 2 have no convincing match (14, 17). The names Stepanov, Guinand, Bost, Vandiver and relative trace do not occur anywhere in the tree. Section 4 gives the evidence.

## 1. Layout

Appendix A lists every depth-2 directory with its file and line counts. Reading the tables: "Reached" is the number of files in the closure of `Main`, and it equals "Files" in every row. "What it holds" is read from directory, file and declaration names and from a few sampled files; there are no docs to quote, so it is the reader's best inference, not the author's description.

Two things to know before reading paths. First, directory names and Lean namespaces do not line up. Declarations in `Development/AbelianVarietyTheory` live in namespace `GlobalTheory` (455,903 of its 457,031 declarations); `Development/AutomorphicArithmetic` holds `UpperTheory` (55,649) and `PositivityTheory` (3,908); `Development/WeilBound` holds `PositivityTheory` (42,981) and `CrystallineSemistableComparison` (4,583); `Development/AutomorphicSpectrum` holds `GlobalTheory` (69,227); `Formalism/PeriodIntegrals` holds `PI` (27,504); `Development/EtaleCohomology` holds `LateralTheory`; `Development/ResolutionOfSingularities` holds `FunctorialResolution`. So `GlobalTheory.T.foo` usually names a theorem in `Development/AbelianVarietyTheory/Proofs/` (47,882 declarations are `GlobalTheory.T.*`, 39,077 of them in that folder). Second, the names `Formalism.MainNotions`, `Formalism.BasicNotions`, `UpperTheory.Top`, `UpperTheory.Gal`, `UpperTheory.TP` and `GlobalTheory.Fc` recur as cross-directory vocabulary and are worth learning early.



**Depth 1**

| Directory | Files | Lines | Decls | Reached from Main | What it holds (from names) |
|---|---:|---:|---:|---:|---|
| `Development` | 141,928 | 12,232,663 | 692,993 | 141,928 | The bulk of the tree (81% of files). Four large subtrees plus three small ones. Namespaces `GlobalTheory`, `UpperTheory`, `PositivityTheory`, `CrystallineSemistableComparison`, `LateralTheory`, `FunctorialResolution`. |
| `Formalism` | 18,254 | 3,200,748 | 240,099 | 18,254 | Analytic and lattice-theoretic estimate packages; holds the zero-free machinery (`Formalism.HC`, `Formalism.ZF`) and the last step from every Dirichlet character to RH (`GammaFactorNonvanishing`). Namespaces `Formalism`, `PI`. |
| `GroundTheory` | 8,507 | 1,119,138 | 75,102 | 8,507 | Background theory restated as Lean: heights and theta functions, automorphic forms, profinite and Tate cohomology, global and local fields, p-adic Hodge theory. Namespace `GroundTheory`. |
| `ReciprocityTheory` | 3,845 | 563,016 | 36,446 | 3,845 | Reductive groups (arithmetic geometry, Arakelov geometry, discrete series), L2 d-bar estimates, analytic forms, class field theory, Chebotarev. Namespace `ReciprocityTheory`. |
| `CompanionTheory` | 2,027 | 194,218 | 11,775 | 2,027 | Spectral geometry, automorphic theory (Pieri rules, Bessel wave grids), real groups, Harish-Chandra modules. |
| `PositivityTheory` | 449 | 55,130 | 4,746 | 449 | One subtree, `AutomorphicForms/PublishedInputs`, stated positivity inputs. |
| `Lemmata` | 167 | 9,232 | 251 | 167 | 167 one-lemma folders with opaque names such as `GeneralBFactSecondBisAlt`; each file starts `namespace Bl.<Name>` and proves `goal1`. |
| `(root)` | 2 | 28 | 9 | 2 | `Main.lean` and `Statements.lean`. |
| `Supplements` | 3 | 22 | 4 | 3 | `Kernels/MainTheorems.lean`, `MainTheoremsAll.lean`, `MainTheoremsCritical.lean`: the kernel theorems `rhOfAll`, `allChi`, `claimAll`, `critAll`. |
| `BuildAid` | 5 | 20 | 0 | 5 | Five files `D1`..`D5`; `run_cmd` lines that add namespaces to `Lean.LibrarySuggestions.nameDenyListExt`. No declarations. |

**Depth 2 (directories with at least 170 files, plus the named ones)**

| Directory | Files | Lines | Decls | Reached from Main | What it holds (from names) |
|---|---:|---:|---:|---:|---|
| `CompanionTheory/SpectralGeometry` | 1,254 | 105,437 | 5,870 | 1,254 | `LocalGlobalProofs` (1,250), `CountingDefinitions`. |
| `CompanionTheory/AutomorphicTheory` | 457 | 47,957 | 2,806 | 457 | Pieri rules, Bessel wave grids, place separation, p-adic cyclotomic fields. |
| `Development/AbelianVarietyTheory` | 99,187 | 8,142,960 | 457,031 | 99,187 | Namespace `GlobalTheory`. `Proofs` (95,418 files; 46,610 files repo-wide are named `...Statement.lean`, a statement file paired with a proof file), `Definitions`, `BlockTheory`, `PublishedTheorems`, `Counterexamples`, `Statements`. |
| `Development/AutomorphicArithmetic` | 18,431 | 1,776,375 | 91,512 | 18,431 | Namespaces `UpperTheory`, `PositivityTheory`. The main chain: `CharacterBoxes` (final assembly), `AutomorphicVarieties/ModularityArgument`, `Foundations/GaloisRepresentations`, `ThetaCorrespondence/ThetaPairLifts`, `IntegralCasts`. |
| `Development/AutomorphicSpectrum` | 15,147 | 1,195,844 | 69,254 | 15,147 | Namespace `GlobalTheory.CompanionTheory`. Mostly `Proofs/BlockDecomposition`, `GeometryProofs`, `MetricProofs` (Arakelov metrics, Poincare-Lelong). |
| `Development/WeilBound` | 7,051 | 848,547 | 55,463 | 7,051 | Namespace `PositivityTheory`. `CoreStatements` (Moriwaki bigness, Poincare-Lelong, p-adic Hodge comparison), `RepresentationTheoryGL` (archimedean base change, Siegel-Weil, unitary dual), `ThetaLifts`. |
| `Development/ResolutionOfSingularities` | 499 | 140,709 | 8,050 | 499 | Namespace `FunctorialResolution`: embedded resolution in characteristic zero. |
| `Development/EtaleCohomology` | 1,398 | 104,525 | 10,302 | 1,398 | Namespace `LateralTheory`: etale sheaves, Tate twists. |
| `Development/DiscreteGroups` | 215 | 23,703 | 1,381 | 215 | 215 files, namespace `DiscreteGroups`. |
| `Formalism/LocalToGlobal` | 5,501 | 955,843 | 73,273 | 5,501 | Siegel lattice theory (2,085), torsion integrality, indefinite real, global theory, columns, projective lattices. |
| `Formalism/SharpRestriction` | 3,093 | 709,436 | 54,648 | 3,093 | Growth bounds, level-letter cocycles, cusp-span norm bounds, divisibility, global Schur bounds, `RamificationFrobenius/TotientGaloisClasses` (home of `Formalism.HC.ZeroFreeAll`). |
| `Formalism/HermitianCurvature` | 1,922 | 460,802 | 35,958 | 1,922 | `HermitianCurvatureProofs` (1,854 files) and a few dozen single-file topics (Bessel nonvanishing, Capelli determinants). |
| `Formalism/PeriodIntegrals` | 4,350 | 451,856 | 32,699 | 4,350 | Namespace `PI`. `UnitaryGroupMassFormula` (3,615 files), `ExplicitFormula`, `BesselPeriodGGP`, orbital bounds. |
| `Formalism/GL3MeanSquares` | 440 | 78,320 | 4,153 | 440 | Genus mean asymptotics, hook formula torsion, box counts, cumulant estimates. |
| `Formalism/ThetaLogCoordinates` | 292 | 54,555 | 4,209 | 292 | Uniform theta substitution, Fock resolution, Jacobi path weights. |
| `Formalism/WachLatticeTwists` | 262 | 38,367 | 1,582 | 262 | Wach modules and lattice twists; `SandwichH1Classes` (Galois H^1 classes). |
| `Formalism/LocalRingCardinality` | 173 | 35,348 | 3,323 | 173 | Local ring counting data files `Data*.lean`. |
| `GroundTheory/HeightsAndTheta` | 6,410 | 641,322 | 37,829 | 6,410 | `Heights` (6,348 files: Hilbert-Samuel, Arakelov, orbit limits) and `Theta` (62). |
| `GroundTheory/AutomorphicForms` | 542 | 150,005 | 10,968 | 542 | 237 topic folders: GL2, multiplicity one, Whittaker, Harish-Chandra centre, tensor product theorem. |
| `GroundTheory/ProfiniteCohomology` | 450 | 84,902 | 6,262 | 450 | children: RestrictedRamification, GlobalClassFormation, GlobalEulerCharacteristic, RealPlaces, LocalEulerCharacteristic |
| `GroundTheory/GlobalFields` | 384 | 72,305 | 5,830 | 384 | children: ComplexMultiplication, TateThesis, IdeleGroups, Artin, NormResidueSymbol |
| `GroundTheory/PAdicHodge` | 226 | 64,317 | 5,360 | 226 |  |
| `GroundTheory/ArithmeticGeometry` | 218 | 45,046 | 3,770 | 218 | children: SchemeCohomology, AbelianVarieties, ModularCurves, ToricVarieties, EtaleCompletion |
| `PositivityTheory/AutomorphicForms` | 445 | 54,970 | 4,741 | 445 | `PublishedInputs` (445 files). |
| `ReciprocityTheory/ReductiveGroups` | 2,799 | 409,976 | 26,331 | 2,799 | `ArithmeticGeometry` (1,623: Arakelov, birational geometry, toroidal compactification, chart restriction), `DiscreteSeries` (1,021). |
| `ReciprocityTheory/AnalyticForms` | 192 | 36,680 | 2,328 | 192 | children: RegularLocalRings, PotentialTheory, PlurisubharmonicFunctions, LeviForms, AnalyticCharts |
| `ReciprocityTheory/L2DbarEstimates` | 227 | 33,734 | 1,877 | 227 | children: PlurisubharmonicCharts, LeviForms, Localization, WeakHolomorphy, SkodaWeights |
| `ReciprocityTheory/DualLattices` | 183 | 24,554 | 1,489 | 183 |  |

Depth-2 directories not listed above (small ones, grouped by top level):

| Top level | Directories | Files | Lines | Decls | Reached |
|---|---:|---:|---:|---:|---:|
| `CompanionTheory` | 4 | 316 | 40,824 | 3,099 | 316 |
| `Formalism` | 99 | 2,212 | 415,772 | 30,183 | 2,212 |
| `GroundTheory` | 6 | 277 | 61,241 | 5,083 | 277 |
| `Lemmata` | 167 | 167 | 9,232 | 251 | 167 |
| `PositivityTheory` | 2 | 4 | 160 | 5 | 4 |
| `ReciprocityTheory` | 20 | 444 | 58,072 | 4,421 | 444 |
| `Supplements` | 1 | 3 | 22 | 4 | 3 |

**Depth 3 (directories with at least 400 files)**

| Directory | Files | Lines | Decls | Reached from Main | What it holds (from names) |
|---|---:|---:|---:|---:|---|
| `Development/AbelianVarietyTheory/Proofs` | 95,418 | 7,436,698 | 374,269 | 95,418 | Divisor proofs (42,424), inertia eigenvalues, Iwasawa decomposition, twisted operators, decorated lattice proofs, flag measures, Satake parameters. |
| `Development/AutomorphicSpectrum/Proofs` | 14,864 | 1,163,468 | 65,581 | 14,864 | `BlockDecomposition` (8,354), `GeometryProofs`, `MetricProofs`, `AlgebraProofs`. |
| `Development/AutomorphicArithmetic/AutomorphicVarieties` | 7,959 | 848,614 | 44,773 | 7,959 | 59 folders; `ModularityArgument` (2,515: threshold arguments, induction estimates), literature results, patching modules, Shimura theory. |
| `GroundTheory/HeightsAndTheta/Heights` | 6,348 | 626,821 | 36,383 | 6,348 | Arithmetic Hilbert-Samuel, Moriwaki bigness targets, heights of sets. |
| `Development/AbelianVarietyTheory/Definitions` | 2,198 | 508,569 | 61,246 | 2,198 | Definitions: divisors, automorphic membership, non-Galois descent, lattice frames, twisted inner products. |
| `Development/WeilBound/CoreStatements` | 3,746 | 455,457 | 27,894 | 3,746 | 51 folders: automorphic kernels (Moriwaki bigness), published theorems, p-adic Hodge comparison, Poincare-Lelong. |
| `Formalism/HermitianCurvature/HermitianCurvatureProofs` | 1,854 | 437,211 | 30,889 | 1,854 | Single-proof files for the Hermitian curvature estimates. |
| `Formalism/PeriodIntegrals/UnitaryGroupMassFormula` | 3,615 | 430,489 | 29,791 | 3,615 | Mass formula for unitary groups, many single-lemma files. |
| `Development/AutomorphicArithmetic/Foundations` | 4,413 | 419,572 | 25,217 | 4,413 | `GaloisRepresentations` (2,965), `Convolution`, `BaseChangeIdentities`, `LocalLanglands`. |
| `Formalism/LocalToGlobal/SiegelLatticeTheory` | 2,085 | 339,004 | 22,772 | 2,085 | Siegel lattice theory, Poincare series on lattices. |
| `Development/WeilBound/RepresentationTheoryGL` | 2,486 | 274,147 | 19,647 | 2,486 | Archimedean base change (798), Siegel-Weil proof (635), unitary dual proof (300), regularised Siegel-Weil, residual spectrum. |
| `ReciprocityTheory/ReductiveGroups/ArithmeticGeometry` | 1,623 | 239,112 | 14,899 | 1,623 | children: FundamentalDomains, ArakelovVolumes, BirationalGeometry, HeightTheory, PullbackSections |
| `Formalism/SharpRestriction/GrowthBounds` | 1,210 | 231,225 | 16,141 | 1,210 | Growth bounds (1,210 files). |
| `Development/AutomorphicArithmetic/ThetaCorrespondence` | 3,201 | 178,983 | 6,610 | 3,201 | `ThetaPairLifts` (2,998), Howe duality, Bessel models, Fock models. |
| `Formalism/SharpRestriction/LevelLetterCocycles` | 758 | 170,849 | 10,764 | 758 | Level-letter cocycles. |
| `ReciprocityTheory/ReductiveGroups/DiscreteSeries` | 1,021 | 154,332 | 10,329 | 1,021 | children: LaplaceOperators, MultiplicityOne, FormalDegree, ExceptionalGroupG2, TensorRepresentations |
| `Development/ResolutionOfSingularities/EmbeddedResolution` | 477 | 135,525 | 7,561 | 477 | Embedded resolution. |
| `Development/AutomorphicArithmetic/IntegralCasts` | 907 | 123,617 | 4,134 | 907 | Integral casts, Capelli identities. |
| `Development/WeilBound/ThetaLifts` | 788 | 115,848 | 7,677 | 788 | Reductions, lattice basics, Levi determinants, eigenvalue endgame, tower models. |
| `CompanionTheory/SpectralGeometry/LocalGlobalProofs` | 1,250 | 104,890 | 5,787 | 1,250 | children: AdelicAnalysis, StableLattices, ConvexCones, WeylGroupActions, SmoothMorphisms |
| `Development/AbelianVarietyTheory/BlockTheory` | 753 | 104,027 | 14,148 | 753 | Twisted discrete series, divisor base, global signature, CM moduli, theta-lift geometry. |
| `Formalism/LocalToGlobal/IndefiniteReal` | 435 | 78,821 | 7,020 | 435 | children: FinitePlaces, LevelTypeEquivalence, SobolevIteration, RealSeparation, FockTheta |
| `Formalism/LocalToGlobal/TorsionIntegrality` | 489 | 70,444 | 6,058 | 489 | children: UniformGaussModels, EisensteinTranslationProducts, FrobeniusFibreCurves, GaussSumParity, QuadraticSemicharacters |
| `Development/AbelianVarietyTheory/PublishedTheorems` | 493 | 56,194 | 4,394 | 493 | children: Divisors₂, TwistedTraceFormula, GaloisCohomology₂, AutomorphicForms₂, GaloisGeometry₂ |
| `PositivityTheory/AutomorphicForms/PublishedInputs` | 445 | 54,970 | 4,741 | 445 | children: JacquetLanglands, CuspidalContinuity, NonzeroTypes, RealGaloisRepresentations, HilbertEisenstein |
| `Development/EtaleCohomology/EtaleSheaves` | 688 | 51,640 | 4,784 | 688 | children: KummerSequence, EtaleSpreading, IntegralNormalization, CokernelKilling, SpectrumLimits |
| `Development/AutomorphicArithmetic/CommutativeAlgebra` | 432 | 48,495 | 3,357 | 432 | children: EtaleCohomology |


**Conventions, documentation and naming**

- **Documentation: none.** 0 of 175,187 files have a module doc, a doc comment, a block comment or a line comment. The `BuildAid`, `Lemmata` and `Supplements` folders are as bare as the rest. A reader gets no prose from the files; use names, namespaces and the order of imports.
- **File granularity.** The median file has 58 lines; 49,487 files (28%) have 20 lines or fewer; the mean is 99 lines and 6.1 declarations per file; the largest file is `Formalism/HermitianCurvature/HermitianCurvatureProofs/IsAdmissibleSplittingCharPairMulTwist.lean` (17,981 lines). 174 files declare nothing (imports only or `run_cmd`).
- **Statement and proof files.** 46,610 files have a module name ending in `Statement`. In `Development/AbelianVarietyTheory/Proofs/` a file `FooStatement.lean` states a `_root_.GlobalTheory.T.foo` theorem and a neighbouring file `Foo.lean` proves a version of it; the statement files are the quickest way to read what is claimed. 1,004 files end in `Holds`. 8,204 declarations contain `Statement` in the name and 5,571 end in `_holds`. A common idiom is `def X : Prop := ...` in a statement file and `theorem x_holds : X` (or `X_of_...`) in a proof file; 97,282 declaration names contain `_of_`.
- **Hypotheses as arguments.** Many major theorems take their inputs as explicit `Prop` arguments named after the statement, for example `seedFinOdd_of (hD : DivAll) (hC : CplMem) ... (hG : GeoOne) : SeedFinOdd`. The proof tree is therefore a tree of named propositions; each `X_holds : X` closes one leaf.
- **Names.** File and declaration names are descriptive in the large directories (`ExistsCompleteDVRReadingCentredValuationStatement.lean`, `JointRowWeightBoundsDualWeylModule.lean`), with an average full declaration name of 44 characters. They are opaque in three places: (i) the namespace prefixes are short codes (`TP`, `Gal.Int`, `Fc`, `HC`, `LLC`, `L2.Th1`, `PI`); (ii) `Lemmata/` uses names like `GeneralBFactSecondBisAlt`, `B1959r`; (iii) several `Formalism` and `CharacterBoxes` files use two- to five-letter abbreviations (`ExS`, `DesWin`, `KitS`, `HostWW`, `TwistAny`). 23,536 declarations have no dot in the name and 65,566 are `private`.
- **Prop-valued names to learn.** `EveryCharacter`, `VWin`/`VWinAt`, `ZeroFreeAll`/`ZeroFreeOn`, `Row0`/`Row0b`, `TLift`/`TLiftK`, `GeoOne`, `Green`, `RecTExists`, `PChar`, `Level`, `FamP`, `D7` (a record type from `Formalism.BasicNotions` that appears in thousands of statements; its definition was not read).
- **Build.** `lakefile.toml` sets `autoImplicit = false`, `maxHeartbeats = 4000000`, `--tstack=400000` and a Mathlib revision `0df444a360eaa60ab8c11dca51a86af692955474`. 136,266 files `import Mathlib` directly. `BuildAid/D1.lean` to `D5.lean` contain only `run_cmd Lean.modifyEnv ... nameDenyListExt.addEntry env "<Namespace>"` (a library-suggestions deny list, no declarations).

## 2. Integrity counts

Counted on code text with comments and strings removed, per file, by `index.py`. Every count is 0.

| Token | Whole tree | Closure of `Main` (all files) | Any single directory |
|---|---:|---:|---:|
| `sorry` | 0 | 0 | 0 |
| `admit` | 0 | 0 | 0 |
| `axiom` (token) | 0 | 0 | 0 |
| `native_decide` | 0 | 0 | 0 |
| `unsafe` | 0 | 0 | 0 |
| `implemented_by` | 0 | 0 | 0 |
| `sorryAx` | 0 | 0 | 0 |
| `ofReduceBool` | 0 | 0 | 0 |

There are no example lines to show. The declaration kind `axiom` also has 0 declarations, and the kind `opaque` has 0. An independent `grep -rlwE 'sorry|admit|axiom|native_decide|unsafe|implemented_by|sorryAx|ofReduceBool'` over the raw tree returned no file (it took about 11 minutes on this machine). Not counted: `decide +native`/`+kernel` option forms, `Classical.choice` use, `set_option` lines, `private`/`protected` modifiers, `@[reducible]`, and metaprograms other than the `run_cmd` lines in `BuildAid`. The five theorems in `Main.lean` take no hypotheses: their statements are Mathlib's `RiemannHypothesis` and the four `Prop` defs in `Statements.lean`.


## 3. The spine

### 3.1 The chain from `Main`, in prose

`Main.lean` imports `Statements` and `Supplements.Kernels.MainTheoremsAll`. The kernel file `Supplements/Kernels/MainTheorems.lean` (16 lines) defines the four starting points:

- `rhOfAll : RiemannHypothesis := Formalism.VW.rh_of_every allChi`
- `allChi : UpperTheory.EveryCharacter := UpperTheory.FinalTheorems.everyCharacter`
- `critAll ... : s.re = 1 / 2 := Formalism.VW.critLine allChi N χ hχ s h0 h1 hz` (zeros of a primitive L-function in the strip lie on the critical line)
- `claimAll : Claim.HalfPlane ∧ Claim.Strip ∧ Claim.Zeta := ⟨allChi, Claim.strip allChi, Claim.zeta allChi⟩`

All four rest on one proposition, `UpperTheory.EveryCharacter`: for every Dirichlet character `χ` and every `s` with `1/2 < s.re` (and `χ ≠ 1 ∨ s ≠ 1`), `L(χ, s) ≠ 0`. The functional-equation steps from this to RH, to the critical-line statements and to the strip are short and elementary (`Formalism/GammaFactorNonvanishing/CritLine.lean` 32 lines, `RhOfRight.lean` 62 lines, `CharacterBoxes/ClaimStrip.lean` 104 lines).

`EveryCharacter` is proved in `Development/AutomorphicArithmetic/CharacterBoxes/MainConclusion.lean` (14 lines):

```
everyCharacter_of_row (h : Row0b (fun h rc => IsRecT h rc)) : EveryCharacter
  := every_character_of_literature_of_vWin ⟨h, recTExists, h⟩ (vwin_of_row h)
everyCharacter : EveryCharacter
  := everyCharacter_of_row galoisLocalGlobalStrong_recParameter
```

So three inputs carry everything. Written with the code's names:

1. **`Row0b recT`** (Galois side). For a CM field `E`, an `l`-adic embedding, a regular algebraic cuspidal automorphic representation `π` of `GL_a(A_E)` with a polarization pair, there is an `l`-adic Galois representation `r : G_E → GL_a(Qbar_l)` with properties `PropsB`. It is proved by `galoisLocalGlobalStrong_of_geometry_lift geo up` from `GeoOne` (a geometric-realization statement for weight one, itself from `HolomorphicLefschetzFormula`, `KSAll`, `PlanEx`, `Steps`) and `TLiftK` (the theta-lift existence statement).
2. **`recTExists`** (local Langlands for `GL_n`, in the form `RecTExists`): for every place a Weil-Deligne parameter map exists. Proved in `Foundations/LocalLanglands/LocalCentralUnits/` from local Artin reciprocity, Langlands exhaustion and multisegments.
3. **`vwin_of_row h : VWin`**. `VWin` is `∀ ψ : PChar, VWinAt ψ 401`, an "automorphic window" statement about primitive characters `ψ`: for every `eps` in `(0, 1/52)`, some `J ≥ 1` and all large `X`, whenever `WinPair eps (X^(1/J)) q d` holds there is `Y` with `X^(1/J) ≤ Y`, `Y^2 ≤ X` and `VAt ψ eps Ct q d (e x) x` for all `x` in `[Y, Y^2]` (the meaning of `VAt` and `WinPair` was not read). It comes from `automorphic_window_of_inputs (OpenImageCondition.mk h) baseChangeN h`, using the base-change identity `BaseChangeIsobaricN` (proved via `bci_of` from `FrameEx`, `FrameBound`, `FrameRead`).

`every_character_of_literature_of_vWin` (814 lines) is a long assembly that builds, from the structure `OpenLiteratureStatements` (three fields: `caraianiLocalGlobalDual`, `localLanglandsExists`, `galoisRepOfPolarizedPairLit`), about twenty named published results (resolution and principalisation in characteristic 0, Poincare-Lelong, Moriwaki bigness, Fargues exactness, Zarhin, toroidal compactifications, Grothendieck deformation, Siegel-Weil), and then calls `UpperTheory.Lit.every_character_of_theta_integrals_local_matching`, which calls `UpperTheory.Top.every_character_of_green_v_win (hG : Green) (hV : VWin) (h : Nonempty (HypsAlt ... DefiniteSideCondition))`. That theorem is two steps: `zero_free_all_of_green_v_win` gives `Formalism.HC.ZeroFreeAll` (every primitive character `ψ` has `ψ.ZeroFreeAbove (1/2)`), and `UpperTheory.Top.imprimitive` passes from primitive to all characters using `L(χ, s) = L(χ_prim, s) * ∏_{p | N} (1 - χ_prim(p) p^{-s})`.

The analytic mechanism sits in `Formalism`. In `UpperTheory.Top.plugWin` (same hypotheses as `every_character_of_green_v_win`) `ZeroFreeAll` is obtained by `zeroFreeAll_of_topG`, which feeds `zeroFreeOn_of_tiedWin_cyc` and the inequality `ChebyshevInequalityOnWindows`: `Λ.Gm x ≤ x ^ (1/2 + (eD + eL + 7) * eps)` on windows. The link between such an upper bound on a smoothed prime sum and zero-freeness is Landau's lemma in the root of `Formalism` (`LandauStep`, `RHofG`, section 4, steps 5 and 6).

### 3.2 Major nodes, verbatim

Each block is `name (kind) file:line`, the declaration text from the source (statement, and for `def`/`abbrev`/`structure` the first lines of the body), and the project names its body cites (at most eight, most theorem-like first). Every node is in the import closure of `Main`. Nodes that look like major intermediate results (short conclusion, long hypotheses, named positivity or zero-free or exponent bounds): `EveryCharacter`, `rh_of_right`, `imprimitive`, `ZeroFreeOn`/`ZeroFreeAll`, `ChebyshevInequalityOnWindows`, `zeroFreeOn_of_tiedWin_cyc`, `TopG`, `VWin`/`VWinAt`, `every_character_of_theta_integrals_local_matching`, `Row0b`, `TLiftK`, `GeoOne`, `Green`, `RecTExists`, `OpenLiteratureStatements`, `BaseChangeIsobaricN`, `MoriwakiBigStatement`, `PoincareLelong`, `seedFinOdd_of`.


**`rhOfAll` (theorem) `Supplements/Kernels/MainTheorems.lean:9`**
```lean
theorem rhOfAll : RiemannHypothesis
```
cites: `Formalism.VW.rh_of_every`, `allChi`

**`Formalism.VW.rh_of_every` (theorem) `Formalism/GammaFactorNonvanishing/CritLine.lean:29`**
```lean
theorem Formalism.VW.rh_of_every (h : UpperTheory.EveryCharacter) : RiemannHypothesis
```
cites: `Formalism.VW.rh_of_right`

**`Formalism.VW.rh_of_right` (theorem) `Formalism/GammaFactorNonvanishing/RhOfRight.lean:5`**
```lean
theorem Formalism.VW.rh_of_right (hz : ∀ s : ℂ, 1 / 2 < s.re → s ≠ 1 → riemannZeta s ≠ 0) : RiemannHypothesis
```
cites: (Mathlib only)

**`allChi` (theorem) `Supplements/Kernels/MainTheorems.lean:7`**
```lean
theorem allChi : UpperTheory.EveryCharacter
```
cites: `UpperTheory.FinalTheorems.everyCharacter`

**`UpperTheory.EveryCharacter` (def) `Development/AutomorphicArithmetic/CharacterBoxes/EveryCharacter.lean:13`**
```lean
def UpperTheory.EveryCharacter : Prop
:=
  ∀ (N : ℕ) [NeZero N] (χ : DirichletCharacter ℂ N) (s : ℂ), 1 / 2 < s.re → (χ ≠ 1 ∨ s ≠ 1) → DirichletCharacter.LFunction χ s ≠ 0
```

**`UpperTheory.FinalTheorems.everyCharacter` (theorem) `Development/AutomorphicArithmetic/CharacterBoxes/MainConclusion.lean:10`**
```lean
theorem UpperTheory.FinalTheorems.everyCharacter : UpperTheory.EveryCharacter
```
cites: `UpperTheory.Gal.Int.galoisLocalGlobalStrong_recParameter`, `UpperTheory.FinalTheorems.everyCharacter_of_row`

**`UpperTheory.FinalTheorems.everyCharacter_of_row` (theorem) `Development/AutomorphicArithmetic/CharacterBoxes/MainConclusion.lean:7`**
```lean
theorem UpperTheory.FinalTheorems.everyCharacter_of_row (h : UpperTheory.GalStar.Row0b fun h rc => UpperTheory.Zero.LLC.IsRecT h rc) : UpperTheory.EveryCharacter
```
cites: `UpperTheory.LiteratureTheorems.every_character_of_literature_of_vWin`, `UpperTheory.Zero.LLC.recTExists`, `UpperTheory.One.vwin_of_row`

**`UpperTheory.Gal.Int.galoisLocalGlobalStrong_recParameter` (theorem) `Development/AutomorphicArithmetic/Foundations/GaloisRepresentations/IntegralStructures/RowSrc.lean:6`**
```lean
theorem galoisLocalGlobalStrong_recParameter : UpperTheory.GalStar.Row0b recT
```
cites: `UpperTheory.Gal.Int.galoisRepresentations_of_thetaLift`, `UpperTheory.TP.K.tLiftK`

**`UpperTheory.Gal.Int.galoisRepresentations_of_thetaLift` (theorem) `Development/AutomorphicArithmetic/Foundations/GaloisRepresentations/IntegralStructures/GaloisRepresentationsOfThetaLift.lean:6`**
```lean
theorem galoisRepresentations_of_thetaLift (up : UpperTheory.TP.TLiftK) : UpperTheory.GalStar.Row0b recT
```
cites: `UpperTheory.Gal.Int.galoisLocalGlobalStrong_of_geometry_lift`, `UpperTheory.Gal.Int.Geo.geoOne_holds`

**`UpperTheory.GalStar.Row0b` (def) `Development/AutomorphicArithmetic/Foundations/GaloisRepresentations/TypeConditions/WeightsConjBis.lean:69`**
```lean
def Row0b : Prop
:=
  ∀ (E Ω : Type) [Field E] [NumberField E] [IsCMField E] [Field Ω] [Algebra E Ω] [IsAlgClosure E Ω]
    (l : ℕ) [Fact l.Prime] (ι : Qbar l ≃+* ℂ) (a : ℕ), 1 ≤ a →
    ∀ (π : CuspSub E a) (χ : HChar (maximalRealSubfield E)), (CG.mk π).IsRegAlg → GlobalTheory.ContraPair.PolarizedPair π χ →
      ∃ (r : G E Ω →* GL (Fin a) (Qbar l)) (wt : ℤ) (HT : (E →+* Qbar l) → Multiset ℤ), PropsB Rc π ι r wt HT
```

**`UpperTheory.TP.TLiftK` (def) `Development/AutomorphicArithmetic/Foundations/GaloisRepresentations/ThetaParseval/HalfIndexLattices/TLiftK.lean:12`**
```lean
def TLiftK : Prop
:=
  ∀ (E : Type) [Field E] [NumberField E] [IsCMField E] (B : Base (maximalRealSubfield E) E), W.GoodK (cj E) B →
    ∀ (n : ℕ), 1 ≤ n → ∀ X : Spc (maximalRealSubfield E) E n, X.J = 1 → X.IsHerm (cj E) B n 0 →
    ∃ d₀ : ℕ, ∀ d, d₀ ≤ d → ∀ (W : Spc (maximalRealSubfield E) E d) (δ : E), W.J = δ • (1 : Matrix (Fin d) (Fin d) E) →
      W.IsSkew (cj E) B d 0 → ∀ (χX χW : Chr (maximalRealSubfield E) E) (mX mW : InfinitePlace (maximalRealSubfield E) → ℤ),
      IsHecke (maximalRealSubfield E) E χX → IsHecke (maximalRealSubfield E) E χW →
      ResEtaPow (Units.map (algebraMap (maximalRealSubfield E) (AF (maximalRealSubfield E))).toMonoidHom).range χX n →
      ResEtaPow (Units.map (algebraMap (maximalRealSubfield E) (AF (maximalRealSubfield E))).toMonoidHom).range χW d →
      HasExp B.emb χX mX → HasExp B.emb χW mW →
      ∀ (U : Submodule ℂ (GlobalTheory.UnitaryBC.UA E n  ...[cut]
```

**`UpperTheory.Gal.Int.Geo.GeoOne` (def) `Development/AutomorphicArithmetic/Foundations/GaloisRepresentations/IntegralStructures/GeometricFlagBases/HodgeTrAt.lean:79`**
```lean
def GeoOne : Prop
:=
  ∀ (E Ω : Type) [Field E] [NumberField E] [IsCMField E] [Field Ω] [Algebra E Ω] [IsAlgClosure E Ω] (l : ℕ) [Fact l.Prime] (ι : Qbar l ≃+* ℂ)
    (a : ℕ), Odd a → ∀ d : ℕ, FieldOK E l d → ∀ x : E, x ^ 2 = -(d : E) →
    ∀ T : Finset (HeightOneSpectrum (𝓞 E)), NonSplitSet T → ∀ w₀ v' : HeightOneSpectrum (𝓞 E), ((l : ℕ) : 𝓞 E) ∈ w₀.asIdeal → ((l : ℕ) : 𝓞 E) ∈ v'.asIdeal → Apart v' w₀ → OneK x w₀ v' →
    ∀ (S : Finset (HeightOneSpectrum (𝓞 E))) (U : Submodule ℂ (UA E a → ℂ)), AutOffT T U → GlobalTheory.CongW.TyEll E l a w₀ U → SphOffU w₀ S U →
    (∃ B, SatU U v' B) → LacWtAt ι v' U →
    (∃ (dd : ℕ) (ρ : G E Ω →* GL (Fin dd) (Qbar l)), VBase ι d U ρ) ∧
    (∀ w, UsPl d w → ((l : ℕ) : 𝓞 E) ∉ w.asIdeal → (∃ B, SatU U w B) →
      ∃ (dd : ℕ) (ρ : G E Ω →* GL (Fin dd) (Qbar l)), VBase ι d U ρ ∧ ∀ B, SatU U w B → ESAt ι ρ w (algSat a (normV w) B)) ∧
    ∀ w, ((l : ℕ) : 𝓞 E ...[cut]
```

**`UpperTheory.LiteratureTheorems.OpenLiteratureStatements` (structure) `Development/AutomorphicArithmetic/ThetaCorrespondence/ThetaPairLifts/ThirdPlaceSeries/EveryCharacterOfLiteratureOfVWin.lean:215`**
```lean
structure UpperTheory.LiteratureTheorems.OpenLiteratureStatements : Prop
where
  caraianiLocalGlobalDual : _root_.UpperTheory.One.M.Row
  localLanglandsExists : _root_.UpperTheory.Zero.LLC.RecTExists
  galoisRepOfPolarizedPairLit : _root_.UpperTheory.One.M.Row
```

**`UpperTheory.LiteratureTheorems.OpenImageCondition` (structure) `Development/AutomorphicArithmetic/AutomorphicVarieties/ModularityArgument/ThresholdArguments/DenseThresholdCases/TemperedProductOfSquareIntegrable.lean:207`**
```lean
structure UpperTheory.LiteratureTheorems.OpenImageCondition : Prop
where
  galoisRepOfPolarizedPairLit : _root_.UpperTheory.V.Z.Win.RowT
```

**`UpperTheory.LiteratureTheorems.every_character_of_literature_of_vWin` (theorem) `Development/AutomorphicArithmetic/ThetaCorrespondence/ThetaPairLifts/ThirdPlaceSeries/EveryCharacterOfLiteratureOfVWin.lean:810`**
```lean
theorem UpperTheory.LiteratureTheorems.every_character_of_literature_of_vWin (O : _root_.UpperTheory.LiteratureTheorems.OpenLiteratureStatements) (hV : UpperTheory.Top.VWin) : UpperTheory.EveryCharacter
```
cites: `UpperTheory.Lit.every_character_of_theta_integrals_local_matching`, `SelfIntersectionVolumeEstimates.topCovolSlim2_use_alt_alt`, `PositivityTheory.Pf1.HilbertSamuelMoriwaki.hsUse_outright`, `PositivityTheory.Pf1.HilbertSamuelMoriwaki.moriwakiBig_outright`, `UpperTheory.LiteratureTheorems.published_results_eigen`, `UpperTheory.LiteratureTheorems.published_results_first`, `UpperTheory.LiteratureTheorems.theta_integrals_agree_and_local_matching_of_literature`, `UpperTheory.LiteratureTheorems.resolution_char_zero_of_literature` (+13 more)

**`UpperTheory.One.vwin_of_row` (theorem) `Development/AutomorphicArithmetic/AutomorphicVarieties/ModularityArgument/ThresholdArguments/DenseThresholdCases/VwinOfRow.lean:4`**
```lean
theorem UpperTheory.One.vwin_of_row (h : UpperTheory.GalStar.Row0b fun h rc => UpperTheory.Zero.LLC.IsRecT h rc) : UpperTheory.Top.VWin
```
cites: `UpperTheory.One.Join.automorphic_window_of_inputs`, `UpperTheory.BaseChangeIdentities.baseChangeN`, `UpperTheory.LiteratureTheorems.OpenImageCondition`

**`UpperTheory.One.Join.automorphic_window_of_inputs` (theorem) `Development/AutomorphicArithmetic/AutomorphicVarieties/ModularityArgument/ThresholdArguments/DenseThresholdCases/TopMainZj.lean:71`**
```lean
theorem UpperTheory.One.Join.automorphic_window_of_inputs (O : _root_.UpperTheory.LiteratureTheorems.OpenImageCondition)
 (bc : _root_.PositivityTheory.Rg.BcN.BaseChangeIsobaricN) (gal : _root_.UpperTheory.V.Z.Win.RowT) :
    UpperTheory.Top.VWin
```
cites: `UpperTheory.One.Join.v_window_of_depth_zero_residual_bc_cm`, `UpperTheory.One.Join.cm_abelian_inputs_from_literature`

**`UpperTheory.Top.VWin` (def) `Development/AutomorphicArithmetic/CharacterBoxes/ExistsPageN.lean:49`**
```lean
def VWin : Prop
:= ∀ ψ : PChar, VWinAt ψ 401
```

**`UpperTheory.Top.VWinAt` (def) `Development/AutomorphicArithmetic/CharacterBoxes/ExistsPageN.lean:44`**
```lean
def VWinAt (ψ : PChar) (Ct : ℝ) : Prop
:=
  ∀ eps : ℝ, 0 < eps → eps < 1 / 52 → ∀ e : ℝ → ℕ, (∀ x ≥ (1 : ℝ), PageN eps x (e x)) →
    ∃ J : ℝ, 1 ≤ J ∧ ∃ X0 : ℝ, ∀ X ≥ X0, ∀ q d : ℕ, WinPair eps (X ^ (1 / J)) q d →
      ∃ Y : ℝ, X ^ (1 / J) ≤ Y ∧ Y ^ (2 : ℝ) ≤ X ∧ ∀ x : ℝ, Y ≤ x → x ≤ Y ^ (2 : ℝ) → VAt ψ eps Ct q d (e x) x
```

**`UpperTheory.Lit.every_character_of_theta_integrals_local_matching` (theorem) `Development/AutomorphicArithmetic/ThetaCorrespondence/ThetaPairLifts/ThirdPlaceSeries/SiegelEisensteinSecondTermHypotheses.lean:69`**
```lean
theorem every_character_of_theta_integrals_local_matching (P : _root_.GlobalTheory.Fc.S0.UnitaryGroupThirdPlaceHypotheses) (F : _root_.GlobalTheory.FunPr.ThetaLocalInputs) (hA : GlobalTheory.IndefiniteRowSideFullHecke.WeilTensorModels.ThetaIntegralsAgree)
    (hM : GlobalTheory.IndefiniteRowSideFullHecke.WeilTensorModels.LocalMatching) (hX : _root_.GlobalTheory.CovTop.CovolumeBoundOfX) (hL : _root_.UpperTheory.Zero.LLC.RecTExists) (hV : VWin) :
    UpperTheory.EveryCharacter
```
cites: `UpperTheory.Top.every_character_of_green_v_win`, `GlobalTheory.GreenBridge.green_of_regular`, `UpperTheory.N.boundAtTwoThree_linked_of_recT`, `UpperTheory.Lit.nonempty_hyps_definite_side_of_closed_bound`, `GlobalTheory.Mem.Top.Bl.parametersOfDependence`

**`UpperTheory.Top.every_character_of_green_v_win` (theorem) `Development/AutomorphicArithmetic/ThetaCorrespondence/ThetaPairLifts/ThirdPlaceSeries/TopPlug.lean:16`**
```lean
theorem UpperTheory.Top.every_character_of_green_v_win (hG : GlobalTheory.GLq.Green) (hV : UpperTheory.Top.VWin)
    (h : Nonempty (_root_.GlobalTheory.Fc.HypsAlt (fun 𝒞 => Closed 𝒞 fun Fm _ => LinkN Fm) _root_.GlobalTheory.Fc.DefiniteSideCondition)) : UpperTheory.EveryCharacter
```
cites: `UpperTheory.Top.imprimitive`, `UpperTheory.Top.zero_free_all_of_green_v_win`

**`UpperTheory.Top.zero_free_all_of_green_v_win` (theorem) `Development/AutomorphicArithmetic/ThetaCorrespondence/ThetaPairLifts/ThirdPlaceSeries/TopPlug.lean:12`**
```lean
theorem UpperTheory.Top.zero_free_all_of_green_v_win (hG : GlobalTheory.GLq.Green) (hV : UpperTheory.Top.VWin)
    (h : Nonempty (_root_.GlobalTheory.Fc.HypsAlt (fun 𝒞 => Closed 𝒞 fun Fm _ => LinkN Fm) _root_.GlobalTheory.Fc.DefiniteSideCondition)) : Formalism.HC.ZeroFreeAll
```
cites: `UpperTheory.Top.zeroFreeAll_of_topG`, `GlobalTheory.Fc.forall_goal_of_shape_of_hyps`, `UpperTheory.Top.shape_closed_link_n_of_green`, `UpperTheory.Top.supplyChi`

**`UpperTheory.Top.imprimitive` (theorem) `Development/AutomorphicArithmetic/CharacterBoxes/Imprimitive.lean:5`**
```lean
theorem UpperTheory.Top.imprimitive :
    ZeroFreeAll → ∀ (N : ℕ) [NeZero N] (χ : DirichletCharacter ℂ N) (s : ℂ), 1 / 2 < s.re → (χ ≠ 1 ∨ s ≠ 1) →
      DirichletCharacter.LFunction χ s ≠ 0
```
cites: `Formalism.HC.PChar.of`

**`Formalism.HC.ZeroFreeAll` (def) `Formalism/SharpRestriction/RamificationFrobenius/TotientGaloisClasses/ExplicitFormulaErrorOfHostConditions.lean:18`**
```lean
def ZeroFreeAll : Prop
:= ZeroFreeOn fun _ => True
```

**`Formalism.HC.ZeroFreeOn` (def) `Formalism/SharpRestriction/RamificationFrobenius/TotientGaloisClasses/ExplicitFormulaErrorOfHostConditions.lean:14`**
```lean
def ZeroFreeOn (Q : PChar → Prop) : Prop
:= ∀ ψ : PChar, Q ψ → ψ.ZeroFreeAbove (1 / 2)
```

**`UpperTheory.Top.zeroFreeAll_of_topG` (theorem) `Development/AutomorphicArithmetic/CharacterBoxes/ZeroFreeAllOfTopG.lean:26`**
```lean
theorem zeroFreeAll_of_topG {la : ℝ} (hla : 1 < la) (h : TopG) (hS : ∀ ψ : PChar, HostExW la (GChi ψ).req) : ZeroFreeAll
```
cites: `Formalism.HC.zeroFreeOn_of_tiedWin_cyc`, `UpperTheory.Comparison₂.level_gm_le_on_family_scales`, `UpperTheory.Comparison₂.formB`, `UpperTheory.Top.hypV_of_cls`, `UpperTheory.Top.eFamC_of_cls`, `Formalism.HC.ZeroFreeOn`, `Formalism.BasicNotions.Fam`, `Formalism.MainNotions.FamP` (+2 more)

**`UpperTheory.Top.TopG` (def) `Development/AutomorphicArithmetic/CharacterBoxes/ZeroFreeAllOfTopG.lean:12`**
```lean
def TopG : Prop
:=
  ∀ (la : ℝ) (G : FReq), 1 < la → HostExW la G.req →
    (∀ {eps : ℝ} (Fm : FamP eps), G.cls la Fm → HypV Fm.toFamCore) → FamilyClassConnected (G.cls la)
```

**`Formalism.HC.zeroFreeOn_of_tiedWin_cyc` (theorem) `Formalism/SharpRestriction/RamificationFrobenius/TotientGaloisClasses/TopWin.lean:90`**
```lean
theorem zeroFreeOn_of_tiedWin_cyc {Q : PChar → Prop} {la : ℝ} (hla : 1 < la)
    (h112 : ∀ ψ, Q ψ → ChebyshevInequalityOnWindows @core @Tied (Level.cyc ψ)) (hB : ∀ ψ, Q ψ → (Level.cyc ψ).FormB)
    (h : ∀ ψ, Q ψ → ChebyshevInequalityAtWindowScale @core @Tied la (Level.cyc ψ)) : ZeroFreeOn Q
```
cites: `Formalism.HC.Level.mem_cyc`, `Formalism.HC.zeroFreeOn_of_tiedWin`

**`Formalism.HC.ChebyshevInequalityOnWindows` (def) `Formalism/SharpRestriction/RamificationFrobenius/TotientGaloisClasses/TopWin.lean:26`**
```lean
def ChebyshevInequalityOnWindows (Λ : Level) : Prop
:=
  ∀ (eD eL eps : ℝ), 0 < eps → ∀ Fm : Fam eps, EFamC Λ (core Fm) → ChebyshevInequalityOnFamilyWindows @core @Tied Fm eD eL →
    ∃ x1 : ℝ, ∀ x ≥ x1, x ∈ (core Fm).Win → Λ.Gm x ≤ x ^ ((1 : ℝ) / 2 + (eD + eL + 7) * eps)
```

**`GlobalTheory.GLq.Green` (def) `Development/AbelianVarietyTheory/Definitions/NonGaloisDescent/LabelDatum.lean:108`**
```lean
def Green : Prop
:=
  ∀ (g : ℕ) [Fact g.Prime] (L : LabelDatum g) (d : ℕ), 0 < d → ∃ τ : (ZMod g)[X] → Gn g d → ℂ,
    (∀ P, IsPrimeLab d P → IsCuspOf L P (τ P) ∧ τ P 1 = ∏ i ∈ Finset.Ico 1 d, ((g : ℂ) ^ i - 1)) ∧
    (∀ P P', IsPrimeLab d P → IsPrimeLab d P' → τ P = τ P' → P = P') ∧
    ∀ χ : Gn g d → ℂ, IsCusp χ → ∃ P, IsPrimeLab d P ∧ χ = τ P
```

**`UpperTheory.Zero.LLC.RecTExists` (def) `Development/AutomorphicArithmetic/Foundations/LocalLanglands/IsRecTOfIsRec.lean:78`**
```lean
def RecTExists : Prop
:=
  ∀ (E Ω : Type) [Field E] [NumberField E] [Field Ω] [Algebra E Ω] [IsAlgClosure E Ω] (A : ValuationSubring Ω)
    (w : HeightOneSpectrum (𝓞 E)) (h : IsPlaceOver A w), ∃ rc, IsRecT h rc
```

**`UpperTheory.Zero.LLC.recTExists` (theorem) `Development/AutomorphicArithmetic/Foundations/LocalLanglands/LocalCentralUnits/RecTExists.lean:20`**
```lean
theorem UpperTheory.Zero.LLC.recTExists :
    UpperTheory.Zero.LLC.RecTExists
```
cites: `UpperTheory.Zero.LLC.artEx`, `UpperTheory.Zero.LLC.cuspEx`, `GlobalTheory.LocLanglands.exists_isLExt`, `UpperTheory.Zero.LLC.Pr.exh`, `UpperTheory.Zero.LLC.Pr.multi`, `UpperTheory.Zero.LLC.extDim`, `UpperTheory.Zero.LLC.extTw`, `GlobalTheory.LocGL.IrrGL.isCusp_ofChar` (+10 more)

**`Claim.HalfPlane` (def) `Development/AutomorphicArithmetic/CharacterBoxes/HalfPlane.lean:3`**
```lean
def Claim.HalfPlane : Prop
:=
  ∀ (N : ℕ) [NeZero N] (χ : DirichletCharacter ℂ N) (s : ℂ), 1 / 2 < s.re → (χ ≠ 1 ∨ s ≠ 1) → DirichletCharacter.LFunction χ s ≠ 0
```

**`Claim.Strip` (def) `Development/AutomorphicArithmetic/CharacterBoxes/HalfPlane.lean:6`**
```lean
def Claim.Strip : Prop
:=
  ∀ (N : ℕ) [NeZero N] (χ : DirichletCharacter ℂ N) (s : ℂ), 0 < s.re → s.re < 1 → DirichletCharacter.LFunction χ s = 0 → s.re = 1 / 2
```

**`Claim.Zeta` (def) `Development/AutomorphicArithmetic/CharacterBoxes/HalfPlane.lean:9`**
```lean
def Claim.Zeta : Prop
:=
  ∀ s : ℂ, riemannZeta s = 0 → (¬ ∃ n : ℕ, s = -2 * (n + 1)) → s ≠ 1 → s.re = 1 / 2
```

**`Claim.strip` (theorem) `Development/AutomorphicArithmetic/CharacterBoxes/ClaimStrip.lean:59`**
```lean
theorem strip (h : HalfPlane) : Strip
```
cites: `Claim.prim_zero`, `Claim.prim_reflect`, `Claim.HalfPlane`

**`Claim.zeta` (theorem) `Development/AutomorphicArithmetic/CharacterBoxes/ClaimStrip.lean:75`**
```lean
theorem zeta (h : HalfPlane) : Zeta
```
cites: `Claim.strip`

**`Formalism.VW.critLine` (theorem) `Formalism/GammaFactorNonvanishing/CritLine.lean:11`**
```lean
theorem Formalism.VW.critLine (h : UpperTheory.EveryCharacter) (N : ℕ) [NeZero N] (χ : DirichletCharacter ℂ N) (hχ : χ.IsPrimitive) (s : ℂ)
    (h0 : 0 < s.re) (h1 : s.re < 1) (hz : LFunction χ s = 0) : s.re = 1 / 2
```
cites: `Formalism.VW.gammaFactor_ne_zero`

**`UpperTheory.Gal.Int.Geo.weight_one_geometric_realization` (theorem) `Development/AutomorphicArithmetic/Foundations/GaloisRepresentations/IntegralStructures/GeometricFlagBases/WeightOneGeometricRealization.lean:7`**
```lean
theorem weight_one_geometric_realization : LocalSmoothExtension.HolomorphicLefschetzFormula
```
cites: `GlobalTheory.T.lefschetz_fixedPoint_finite_etale_correspondence`, `UpperTheory.Gal.LocalSmoothExtension.HolomorphicLefschetzFormula`

**`UpperTheory.Gal.LocalSmoothExtension.HolomorphicLefschetzFormula` (def) `Development/AutomorphicArithmetic/Foundations/GaloisRepresentations/LefschetzSigmaSums/HodgeTraceFromLefschetzAndGroupSide.lean:102`**
```lean
def HolomorphicLefschetzFormula : Prop
:=
  ∀ (Z : Scheme.{0}) (s : Z ⟶ Sp ℂ) (d : ℕ) [SmoothOfRelativeDimension d s], IsProjOver s →
  ∀ (Y : Scheme.{0}) (s' : Y ⟶ Sp ℂ) (c1 c2 : Y ⟶ Z) (h1 : c1 ≫ s = s') (h2 : c2 ≫ s = s') [IsFinite c1] [Etale c1],
  IsFinite c2 → Etale c2 →
  ∀ (F : Finset (CxPts s' (RingHom.id ℂ))), (∀ y, y ∈ F ↔ y.1 ≫ c1 = y.1 ≫ c2) →
  ∀ A : CxPts s' (RingHom.id ℂ) → Matrix (Fin d) (Fin d) ℂ,
    (∀ y ∈ F, GlobalTheory.W1.IsTan d c1 c2 h1 h2 y (A y) ∧ (1 - A y).det ≠ 0) →
  ∀ a : ℕ, (∀ b, FiniteDimensional ℂ (hodgeH s a b)) ∧
    ∑ b ∈ Finset.range (d + 1), (-1 : ℂ) ^ b * LinearMap.trace ℂ _ (hodgeTrace h1 a b ∘ₗ hodgePull h2 a b) =
      ∑ y ∈ F, (Matrix.det (1 + (Polynomial.X : Polynomial ℂ) • (A y).map Polynomial.C)).coeff a / (1 - A y).det
```

**`PositivityTheory.Pf1.HilbertSamuelMoriwaki.hsChain` (theorem) `Development/WeilBound/CoreStatements/AutomorphicKernels/MoriwakiBigness/MoriwakiBigTheorem/HSChain.lean:180`**
```lean
theorem hsChain (hResK : ReciprocityTheory.ChartRestriction.G.Geo.ResK.ResKStatement) (hAIS : ReciprocityTheory.ChartRestriction.G.Geo.ArithIntersectionSystemStatement)
    (hDBH : GroundTheory.Heights₂.Heights.IndefiniteRowSideFullHecke.HeightsSet.DenseBoundedHeight.Statement) :
    GroundTheory.Heights₂.Heights.HilbertSamuel.ArithmeticVolumeBig.Statement ∧ GroundTheory.Heights₂.Heights.Targets.MoriwakiBigCurve.Statement ∧
      GroundTheory.Heights₂.Heights.HilbertSamuel.ArithKleiman.Statement ∧ GroundTheory.Heights₂.Heights.HilbertSamuel.G7.Statement ∧
      GroundTheory.Heights₂.Heights.HilbertSamuel.ArithmeticVolumeNef.Statement
```
cites: `GroundTheory.Heights₂.Heights.HilbertSamuel.NefOnGenericOfSemipos.proof`, `GroundTheory.Heights₂.Heights.HilbertSamuel.ChartDenominator.proof`, `GroundTheory.Heights₂.Heights.HilbertSamuel.SectionSupBound.proof`, `GroundTheory.Heights₂.Heights.HilbertSamuel.KodairaSection.proof`, `GlobalTheory.CompanionTheory.Ar.Giv.degreeGeneric_of_degree`, `GlobalTheory.CompanionTheory.Ar.Giv.degree_of_system`, `GlobalTheory.T.kodaira_generic_of_ample_section_count`, `GlobalTheory.T.kleiman_input_nef_ample_section_count` (+183 more)

**`ReciprocityTheory.ChartRestriction.G.ArakelovGeometry.MoriwakiBigStatement` (def) `ReciprocityTheory/ReductiveGroups/ArithmeticGeometry/ArakelovGeometry/MoriwakiSt.lean:29`**
```lean
def MoriwakiBigStatement : Prop
:=
  ∀ (K : Type) [Fintype K] (ι : K → Type) [∀ k, Fintype (ι k)] (Ω : Type) [Field Ω]
    (y : (Σ k, ι k) → Ω) (D : ℕ) (A : HermLine ι) (P0 : Ideal (MRing ι)) (II : IntersectionSystem),
    IsIntersectionSystem II → IsArithVar (mCoordIdeal y) (D + 1) → Birational y →
    P0 ≤ mCoordIdeal y → IsSemipositiveRel P0 (mCoordIdeal y) A → IsConjInvariantH A →
    NefOnFibres (mCoordIdeal y) A.a → NefOnGeneric (mCoordIdeal y) A →
    II K ι (mCoordIdeal y) (D + 1) (fun _ => A) ≤
      arVolP (IsSmallH (mCoordIdeal y) y A) (chartLat y A.a) 1 D
```

**`GlobalTheory.CompanionTheory.Ar.Pub.PoincareLelong` (def) `Development/AutomorphicSpectrum/PublishedTheorems/Metrics₂/PoincareLelong.lean:6`**
```lean
def PoincareLelong : Prop
:=
  ReciprocityTheory.ChartRestriction.G.Geo.ArithmeticPoincareLelongFormula
```

**`PositivityTheory.Rg.BcN.BaseChangeIsobaricN` (def) `Development/WeilBound/RepresentationTheoryGL/ArchimedeanBaseChange/ArchimedeanBaseChangeProof/BaseChangeIsobaricNOf.lean:39`**
```lean
def BaseChangeIsobaricN : Prop
:=
  ∀ (E : Type) [Field E] [NumberField E] [IsCMField E],
    (∀ w : HeightOneSpectrum (𝓞 E), Algebra.IsUnramifiedAt (𝓞 (maximalRealSubfield E)) w.asIdeal) →
    ∀ n : ℕ, 1 ≤ n → ∀ π : Submodule ℂ (UA E n → ℂ), IsAutRepU π →
      ∃ (c : ℕ) (N : Fin c → ℕ) (h : ∑ i, N i = n) (V : ∀ i, Submodule ℂ (Sm E (N i)))
        (σ : ∀ i (w : HeightOneSpectrum (𝓞 E)), SmIrr (GL (Fin (N i)) (w.adicCompletion E)))
        (m : Fin c → (E →+* ℂ) → Multiset ℂ)
        (P : ∀ w : HeightOneSpectrum (𝓞 E), SmIrr (GL (Fin n) (w.adicCompletion E))), IsBaseChangeN π h V σ m P
```

**`UpperTheory.Gal.Int.Div.seedFinOdd_of` (theorem) `Development/AutomorphicArithmetic/Foundations/GaloisRepresentations/IntegralStructures/ZetaCharacterDivisibility/SeedFinOddOf.lean:44`**
```lean
theorem seedFinOdd_of (hD : DivAll) (hC : CplMem) (hS : SameOr) (hSat : SatConj) (hTy : TyConj) (hLac : LacConj) (hGap : GapLac)
    (hGen : DGenMul) (hG : GeoOne) : SeedFinOdd
```
cites: `GlobalTheory.Cong.exists_weight_of_isAutRepU`, `GlobalTheory.RoadWGeo.card_wtJumps`, `GlobalTheory.RoadWGeo.wtJumps_val`, `UpperTheory.Gal.Int.Div.move`, `UpperTheory.Gal.Int.Div.apart_symm`, `GlobalTheory.RoadWGeo.LacWtAt`, `UpperTheory.Gal.Int.Div.SameK`, `GlobalTheory.Cong.Apart` (+7 more)

**`UpperTheory.Gal.Int.Cong.congFinOdd_of_ex` (theorem) `Development/AutomorphicArithmetic/Foundations/GaloisRepresentations/IntegralStructures/CongruenceOddLevel/CongFinOddOfLvLac.lean:15`**
```lean
theorem congFinOdd_of_ex (H : WtLacEx) : CongFinOdd
```
cites: `UpperTheory.Gal.Int.Cong.CongUWG.congUW4`, `UpperTheory.Gal.Int.Cong.congFinG_of_ex`



### 3.3 The tree to level 8 (170 declarations)

Produced by `spine.py rhOfAll allChi claimAll critAll --depth 8 --fanout 5 --max-nodes 170`. Each line is `name [kind] file:line`; indentation is the level; at most 5 children are kept per node (theorems first, then other-file declarations, then order of appearance), the rest are counted as "more references not shown". The same declaration is expanded once. The tree is wide below level 4 (for example `hsChain` has 191 references), so beyond the nodes in 3.2 a reader should expand a branch on demand with `spine.py NAME --depth 2 --fanout 20 --stmt`.

```

- rhOfAll [theorem] Supplements/Kernels/MainTheorems.lean:9
  - Formalism.VW.rh_of_every [theorem] Formalism/GammaFactorNonvanishing/CritLine.lean:29
    - Formalism.VW.rh_of_right [theorem] Formalism/GammaFactorNonvanishing/RhOfRight.lean:5
  - allChi [theorem] Supplements/Kernels/MainTheorems.lean:7
    - UpperTheory.FinalTheorems.everyCharacter [theorem] Development/AutomorphicArithmetic/CharacterBoxes/MainConclusion.lean:10
      - UpperTheory.Gal.Int.galoisLocalGlobalStrong_recParameter [theorem] Development/AutomorphicArithmetic/Foundations/GaloisRepresentations/IntegralStructures/RowSrc.lean:6
        - UpperTheory.Gal.Int.galoisRepresentations_of_thetaLift [theorem] Development/AutomorphicArithmetic/Foundations/GaloisRepresentations/IntegralStructures/GaloisRepresentationsOfThetaLift.lean:6
          - UpperTheory.Gal.Int.galoisLocalGlobalStrong_of_geometry_lift [theorem] Development/AutomorphicArithmetic/Foundations/GaloisRepresentations/IntegralStructures/Development.lean:30
            - UpperTheory.GalStar.Row0.row0b [theorem] Development/AutomorphicArithmetic/Foundations/GaloisRepresentations/TypeConditions/WeightsConjBis.lean:84
            - UpperTheory.Gal.Int.galoisLocalGlobal_of_geometry_lift [theorem] Development/AutomorphicArithmetic/Foundations/GaloisRepresentations/IntegralStructures/Development.lean:27
              - UpperTheory.Gal.Int.Div.seedFinOdd_of_geoOne [theorem] Development/AutomorphicArithmetic/Foundations/GaloisRepresentations/IntegralStructures/ZetaCharacterDivisibility/MainFin.lean:13
              - UpperTheory.Gal.Int.Cong.congFinOdd_of_ex [theorem] Development/AutomorphicArithmetic/Foundations/GaloisRepresentations/IntegralStructures/CongruenceOddLevel/CongFinOddOfLvLac.lean:15
              - UpperTheory.Gal.Wt.wtLacEx_holds [theorem] Development/AutomorphicArithmetic/Foundations/GaloisRepresentations/WeightCharacters/LadicWeightEmbeddingOverPlace.lean:73
              - UpperTheory.Gal.Int.rest [theorem] Development/AutomorphicArithmetic/Foundations/GaloisRepresentations/IntegralStructures/Development.lean:24
              - UpperTheory.Gal.Int.coreAll_of [theorem] Development/AutomorphicArithmetic/Foundations/GaloisRepresentations/IntegralStructures/Development.lean:20
            - UpperTheory.Gal.Int.recT [def] Development/AutomorphicArithmetic/Foundations/GaloisRepresentations/IntegralStructures/Development.lean:18
              - UpperTheory.Zero.LLC.IsRecT [def] Development/AutomorphicArithmetic/Foundations/LocalLanglands/IsRecTOfIsRec.lean:76
          - UpperTheory.Gal.Int.Geo.geoOne_holds [theorem] Development/AutomorphicArithmetic/Foundations/GaloisRepresentations/IntegralStructures/GeometricFlagBases/WeightOneGeometricRealization.lean:11
            - UpperTheory.Gal.Int.Geo.geometric_realization_of_weight_one [theorem] Development/AutomorphicArithmetic/Foundations/GaloisRepresentations/IntegralStructures/GeometricFlagBases/GeometricRealizationOfWeightOne.lean:25
              - UpperTheory.Gal.Int.Geo.geoOne_of_parts [theorem] Development/AutomorphicArithmetic/Foundations/GaloisRepresentations/IntegralStructures/GeometricFlagBases/GeoOneOfParts.lean:7
              - UpperTheory.Gal.Int.Geo.Pl.planEx_holds [theorem] Development/AutomorphicArithmetic/Foundations/GaloisRepresentations/IntegralStructures/GeometricFlagBases/PrimeLevelLocalization/SpecTopHolds.lean:9
              - UpperTheory.Gal.Int.Geo.steps_holds [theorem] Development/AutomorphicArithmetic/Foundations/GaloisRepresentations/IntegralStructures/GeometricFlagBases/GeometricRealizationOfWeightOne.lean:20
              - UpperTheory.Gal.Int.Geo.kodaira_spencer_of_weight_one [theorem] Development/AutomorphicArithmetic/Foundations/GaloisRepresentations/IntegralStructures/GeometricFlagBases/GeometricRealizationOfWeightOne.lean:22
            - UpperTheory.Gal.Int.Geo.weight_one_geometric_realization [theorem] Development/AutomorphicArithmetic/Foundations/GaloisRepresentations/IntegralStructures/GeometricFlagBases/WeightOneGeometricRealization.lean:7
              - GlobalTheory.T.lefschetz_fixedPoint_finite_etale_correspondence [theorem] Development/AbelianVarietyTheory/Proofs/SatakeParameters/LefschetzFixedPointFiniteEtaleCorrespondence.lean:8
              - UpperTheory.Gal.LocalSmoothExtension.HolomorphicLefschetzFormula [def] Development/AutomorphicArithmetic/Foundations/GaloisRepresentations/LefschetzSigmaSums/HodgeTraceFromLefschetzAndGroupSide.lean:102
        - UpperTheory.TP.K.tLiftK [theorem] Development/AutomorphicArithmetic/Foundations/GaloisRepresentations/ThetaParseval/ThetaKernels/TLiftK.lean:4
          - UpperTheory.TP.tLift_holds_k [theorem] Development/AutomorphicArithmetic/Foundations/GaloisRepresentations/ThetaParseval/ThetaKernels/TPGHolds.lean:58
            - UpperTheory.TP.tLift_of_tools_k [theorem] Development/AutomorphicArithmetic/Foundations/GaloisRepresentations/ThetaParseval/ThetaKernels/TPGTop.lean:46
              - UpperTheory.TP.tLift_of_k [theorem] Development/AutomorphicArithmetic/Foundations/GaloisRepresentations/ThetaParseval/ThetaKernels/GalTPDefs.lean:141
              - UpperTheory.TP.brEx [theorem] Development/AutomorphicArithmetic/Foundations/GaloisRepresentations/ThetaParseval/BlockDeterminants/MemClosureOf.lean:409
              - UpperTheory.TP.hgtFst_k [theorem] Development/AutomorphicArithmetic/Foundations/GaloisRepresentations/ThetaParseval/ThetaKernels/TPGHgtFst.lean:30
              - UpperTheory.TP.realPair_k [theorem] Development/AutomorphicArithmetic/Foundations/GaloisRepresentations/ThetaParseval/ThetaKernels/TPGRealPair.lean:29
              - UpperTheory.TP.nonVan_k [theorem] Development/AutomorphicArithmetic/Foundations/GaloisRepresentations/ThetaParseval/ThetaKernels/TPGNonVan.lean:26
              (+11 more references not shown)
            - GlobalTheory.ThK.Dbl.hgtEx_of_k [theorem] Development/AutomorphicArithmetic/Foundations/GaloisRepresentations/ThetaParseval/ThetaKernels/ThkBaseHgtInt.lean:15
              - GlobalTheory.ThK.Dbl.Hgt.hgtEx_core_k [theorem] Development/AutomorphicArithmetic/Foundations/GaloisRepresentations/ThetaParseval/ThetaKernels/ThkBaseHgtExA.lean:62
              - GlobalTheory.ThK.Dbl.Hgt.isStab2_stab2 [theorem] Development/WeilBound/ThetaLifts/LatticeBasics/HgtExA.lean:160
            - GlobalTheory.ThK.Dbl.stab2Cpt_k [theorem] Development/AutomorphicArithmetic/Foundations/GaloisRepresentations/ThetaParseval/ThetaKernels/Stab2CptK.lean:18
              - GlobalTheory.ThK.Dbl.St.exists_section [theorem] Development/WeilBound/ThetaLifts/LatticeBasics/IsCompactOfUnits.lean:207
              - GlobalTheory.ThK.Dbl.St.fin_bound [theorem] Development/WeilBound/ThetaLifts/LatticeBasics/IsCompactOfUnits.lean:180
              - GlobalTheory.ThK.Dbl.cartan_bound2 [theorem] Development/WeilBound/ThetaLifts/LatticeBasics/CartanBound2.lean:17
              - GlobalTheory.Grow.continuous_infEmb_compInf [theorem] Development/AbelianVarietyTheory/Definitions/TwistedInnerProducts/ExistsHeightLeTwoMulQuotHeight.lean:74
              - GlobalTheory.ThK.Dbl.St.isCompact_latHat [theorem] Development/WeilBound/ThetaLifts/LatticeBasics/IsCompactOfUnits.lean:109
              (+12 more references not shown)
            - UpperTheory.TP.tools_holds_k [theorem] Development/AutomorphicArithmetic/Foundations/GaloisRepresentations/ThetaParseval/ThetaKernels/TPGHolds.lean:39
              - GlobalTheory.ThK.Dbl.siegelWeilAniso_of_k [theorem] Development/AutomorphicArithmetic/Foundations/GaloisRepresentations/ThetaParseval/ThetaKernels/ThkBaseSWStd.lean:62
              - PositivityTheory.SiegelWeilFormula.Fin.siegelWeilStd_k [theorem] Development/AutomorphicArithmetic/Foundations/GaloisRepresentations/ThetaParseval/ThetaKernels/SiegelWeilFinFinal.lean:15
              - GlobalTheory.ThK.Dbl.frameConj_k [theorem] Development/AutomorphicArithmetic/Foundations/GaloisRepresentations/ThetaParseval/ThetaKernels/ThkBaseFrameConj.lean:25
              - GlobalTheory.ThK.Dbl.finLevel_k [theorem] Development/AutomorphicArithmetic/Foundations/GaloisRepresentations/ThetaParseval/ThetaKernels/ThkBaseFinLevel.lean:15
              - GlobalTheory.ThK.Dbl.stab2Cpt_k [theorem] Development/AutomorphicArithmetic/Foundations/GaloisRepresentations/ThetaParseval/ThetaKernels/Stab2CptK.lean:18  (shown above)
              (+28 more references not shown)
      - UpperTheory.FinalTheorems.everyCharacter_of_row [theorem] Development/AutomorphicArithmetic/CharacterBoxes/MainConclusion.lean:7
        - UpperTheory.LiteratureTheorems.every_character_of_literature_of_vWin [theorem] Development/AutomorphicArithmetic/ThetaCorrespondence/ThetaPairLifts/ThirdPlaceSeries/EveryCharacterOfLiteratureOfVWin.lean:810
          - UpperTheory.Lit.every_character_of_theta_integrals_local_matching [theorem] Development/AutomorphicArithmetic/ThetaCorrespondence/ThetaPairLifts/ThirdPlaceSeries/SiegelEisensteinSecondTermHypotheses.lean:69
            - UpperTheory.Top.every_character_of_green_v_win [theorem] Development/AutomorphicArithmetic/ThetaCorrespondence/ThetaPairLifts/ThirdPlaceSeries/TopPlug.lean:16
              - UpperTheory.Top.imprimitive [theorem] Development/AutomorphicArithmetic/CharacterBoxes/Imprimitive.lean:5
              - UpperTheory.Top.zero_free_all_of_green_v_win [theorem] Development/AutomorphicArithmetic/ThetaCorrespondence/ThetaPairLifts/ThirdPlaceSeries/TopPlug.lean:12
            - GlobalTheory.GreenBridge.green_of_regular [theorem] Development/AbelianVarietyTheory/Proofs/InertiaEigenvalues/SumRangeEqRoots.lean:225
              - GlobalTheory.GreenExists.rootsBar_eq [theorem] Development/AbelianVarietyTheory/Proofs/InertiaEigenvalues/CuspidalCharExistsOfGreen.lean:68
              - GlobalTheory.GreenExists.pow_eq_self_iff [theorem] Development/AbelianVarietyTheory/Proofs/InertiaEigenvalues/CuspidalCharExistsOfGreen.lean:60
              - GlobalTheory.GreenBridge.rootOf_spec [theorem] Development/AbelianVarietyTheory/Proofs/InertiaEigenvalues/SumRangeEqRoots.lean:189
              - GlobalTheory.GreenBridge.regular_iff [theorem] Development/AbelianVarietyTheory/Proofs/InertiaEigenvalues/SumRangeEqRoots.lean:207
              - GlobalTheory.GreenBridge.root_unit [theorem] Development/AbelianVarietyTheory/Proofs/InertiaEigenvalues/SumRangeEqRoots.lean:197
              (+22 more references not shown)
            - UpperTheory.N.boundAtTwoThree_linked_of_recT [theorem] Development/AutomorphicArithmetic/ThetaCorrespondence/ThetaPairLifts/ThirdPlaceSeries/At23OfAll.lean:24
              - UpperTheory.N.boundAtTwoThree_n_linked [theorem] Development/AutomorphicArithmetic/ThetaCorrespondence/ThetaPairLifts/ThirdPlaceSeries/At23OfAll.lean:21
              - UpperTheory.N.at23_family_alt [theorem] Development/AutomorphicArithmetic/ThetaCorrespondence/ThetaPairLifts/ThirdPlaceSeries/At23OfAll.lean:19
            - UpperTheory.Lit.nonempty_hyps_definite_side_of_closed_bound [theorem] Development/AutomorphicArithmetic/ThetaCorrespondence/ThetaPairLifts/ThirdPlaceSeries/SiegelEisensteinSecondTermHypotheses.lean:44
              - UpperTheory.Lit.functionalsSeparate_of_howeUnram_of_siegelWeil [theorem] Development/AutomorphicArithmetic/ThetaCorrespondence/ThetaPairLifts/LocalTypeDictionary/FunctionalsSeparateOfHoweUnramOfSiegelWeil.lean:17
              - GlobalTheory.Hk3.howeUnram_holds [theorem] Development/AbelianVarietyTheory/Proofs/SatakeParameters/RhoMemOfMkEq.lean:250
              - GlobalTheory.Mem.LiteralAutomorphy.rowRatW_of_rowTest [theorem] Development/AbelianVarietyTheory/Proofs/IwasawaDecomposition/RowRatWOfRowTest.lean:9
              - GlobalTheory.T.test_vector_assembly_holds [theorem] Development/AutomorphicArithmetic/ThetaCorrespondence/ThetaPairLifts/LocalTypeDictionary/TestVectorAtDatumOfJoin.lean:39
              - GlobalTheory.BigTop.Fun.Close.fourier_coefficient_fit_of_join_alt [theorem] Development/AutomorphicArithmetic/ThetaCorrespondence/ThetaPairLifts/ThirdPlaceSeries/FourierCoefficientFitOfJoin.lean:12
              (+24 more references not shown)
            - GlobalTheory.Mem.Top.Bl.parametersOfDependence [def] Development/AutomorphicArithmetic/ThetaCorrespondence/ThetaPairLifts/ThirdPlaceSeries/Prm1.lean:20
              - GlobalTheory.Mem.Top.Bl.parametersOfExtension [def] Development/AutomorphicArithmetic/ThetaCorrespondence/ThetaPairLifts/ThirdPlaceSeries/CoreAltAltBis.lean:61
              - GlobalTheory.HeightCounting.Up.extensionWithList [def] Development/AutomorphicArithmetic/ThetaCorrespondence/ThetaPairLifts/ThirdPlaceSeries/SettingsFormsExistList.lean:20
              - GlobalTheory.Mem.Top.Bl.SExt.none [def] Development/AbelianVarietyTheory/Definitions/AutomorphicMembership/ThetaChr.lean:22
              - GlobalTheory.Mem.Top.Bl.geoCl [def] Development/AbelianVarietyTheory/Definitions/AutomorphicMembership/NotGeoClFalse.lean:26
              - GlobalTheory.Mem.Top.Bl.anyGeometry [def] Development/AbelianVarietyTheory/Definitions/AutomorphicMembership/OverIx.lean:19
          - SelfIntersectionVolumeEstimates.topCovolSlim2_use_alt_alt [theorem] Development/AutomorphicArithmetic/ThetaCorrespondence/ThetaPairLifts/ThirdPlaceSeries/TopCovolSlim2Use.lean:16
            - GlobalTheory.GreenBridge.green_of_regular [theorem] Development/AbelianVarietyTheory/Proofs/InertiaEigenvalues/SumRangeEqRoots.lean:225  (shown above)
            - GlobalTheory.greenRegularCharacters_holds [theorem] Development/AbelianVarietyTheory/Proofs/InertiaEigenvalues/GreenCuspidalCharsByRegularCharsProof.lean:137
              - GlobalTheory.T.exists_cuspidalCharacter_of_regularCharacter_GLn [theorem] Development/AbelianVarietyTheory/Proofs/InertiaEigenvalues/ExistsCuspidalCharacterOfRegularCharacterGLnStatement.lean:8
              - GlobalTheory.GreenRegularCharactersInertiaEigenvalues.family [theorem] Development/AbelianVarietyTheory/Proofs/InertiaEigenvalues/GreenCuspidalCharsByRegularCharsProof.lean:23
              - GlobalTheory.GreenRegularCharactersInertiaEigenvalues.isPrimeLab_pos [theorem] Development/AbelianVarietyTheory/Proofs/InertiaEigenvalues/GreenCuspidalCharsByRegularCharsProof.lean:18
              - GlobalTheory.GreenRegularCharactersInertiaEigenvalues.count [theorem] Development/AbelianVarietyTheory/Proofs/InertiaEigenvalues/GreenCuspidalCharsByRegularCharsProof.lean:56
              - GlobalTheory.GLq.Gn [abbrev] Development/AbelianVarietyTheory/Definitions/NonGaloisDescent/LabelDatum.lean:11
              (+5 more references not shown)
            - FubiniStudyChowHeightFormula₂.fubiniStudy_chowHeight_formula [theorem] Development/AutomorphicArithmetic/ThetaCorrespondence/ThetaPairLifts/HodgeBundleWeights/FubiniStudyChowHeightFormula.lean:17
              - FubiniStudyChowHeightFormula₂.fubiniStudyChowHeight_of [theorem] Development/WeilBound/CoreStatements/AbelianHeightsDuality/FubiniStudyChowHeight/FubiniStudyChowHeightOfArExists.lean:152
            - PositivityTheory.Prw.toroidalChartsForFan_of [theorem] Development/WeilBound/CoreStatements/AbelianHeightsDuality/PublishedTheoremStatements/BridgesMore.lean:54
              - GlobalTheory.toroidalChartsForFan_of_toroidalForFanKS [theorem] Development/AbelianVarietyTheory/Proofs/IwasawaDecomposition/ToroidalChartsForFanOfToroidalForFanKS.lean:5
            - GlobalTheory.Published.toroidalCharts_of_siegel_of_forFan [theorem] Development/AbelianVarietyTheory/Proofs/DivisorProofs/ToroidalChartsOfSiegelOfForFan.lean:8
              - GlobalTheory.PolFan.exists_fine_invariant_fan [theorem] Development/AbelianVarietyTheory/Proofs/IwasawaDecomposition/ExistsFineInvariantFan.lean:17
            (+9 more references not shown)
          - PositivityTheory.Pf1.HilbertSamuelMoriwaki.hsUse_outright [theorem] Development/WeilBound/CoreStatements/AutomorphicKernels/MoriwakiBigness/MoriwakiBigTheorem/Outright.lean:13
            - PositivityTheory.Pf1.HilbertSamuelMoriwaki.hsUse_of_hypotheses [theorem] Development/WeilBound/CoreStatements/AutomorphicKernels/MoriwakiBigness/MoriwakiBigTheorem/HSChain.lean:376
              - PositivityTheory.Pf1.HilbertSamuelMoriwaki.hsChain [theorem] Development/WeilBound/CoreStatements/AutomorphicKernels/MoriwakiBigness/MoriwakiBigTheorem/HSChain.lean:180
            - PositivityTheory.ResPlug.FromRes.resK [theorem] Development/WeilBound/CoreStatements/ResolutionCharZero/PlugResK.lean:7
              - PositivityTheory.ResPlug.resK_of_weak [theorem] Development/WeilBound/CoreStatements/ResolutionCharZero/WeakPair.lean:68
              - PositivityTheory.ResPlug.FromRes.resW [theorem] Development/WeilBound/CoreStatements/ResolutionCharZero/PlugResW.lean:7
              - PositivityTheory.ResPlug.FromRes.princW [theorem] Development/WeilBound/CoreStatements/ResolutionCharZero/PlugPrincW.lean:7
            - GlobalTheory.T.arith_intersection_system_of_poincare_lelong [theorem] Development/AutomorphicSpectrum/Proofs/MetricProofs/ArithIntersectionSystemOfPoincareLelongStatement.lean:11
              - GlobalTheory.CompanionTheory.Ar.Pub.arithIntersectionSystem_of_poincareLelong_resK [theorem] Development/AutomorphicSpectrum/Proofs/MetricProofs/ArithIntersectionSystemOfPoincareLelong.lean:42
            - PositivityTheory.Tls2.Pl.poincareLelong [theorem] Development/WeilBound/CoreStatements/TemperedRepresentationTheory/PoincareLelong/PoincareLelongInv.lean:13
              - PositivityTheory.Tls2.Pl.poincareLelong_of_leaves [theorem] Development/WeilBound/CoreStatements/TemperedRepresentationTheory/PoincareLelong/Development.lean:86
              - GlobalTheory.CompanionTheory.Ar.Pub.CxAbs.ptsAbsIntegrable [theorem] Development/AutomorphicSpectrum/Proofs/BlockDecomposition/IntegrableAbsFibreSumOfIsCxVar.lean:153
              - GlobalTheory.CompanionTheory.Ar.SegreChart.Chart.SegreChartIntegral [theorem] Development/AutomorphicSpectrum/Proofs/BlockDecomposition/SegreChartIntegralHolds.lean:100
              - GlobalTheory.CompanionTheory.Ar.chartDivisorCompare [theorem] Development/AutomorphicSpectrum/Proofs/BlockDecomposition/ChartDivisorCompare.lean:11
              - GlobalTheory.CompanionTheory.ComplexSets.divisorGeneralPointBranches [theorem] Development/AutomorphicSpectrum/Proofs/BlockDecomposition/DivisorGeneralPointBranches.lean:27
              (+3 more references not shown)
            - PositivityTheory.MbAis.DenseCurves.main [theorem] Development/WeilBound/CoreStatements/AutomorphicKernels/MoriwakiBigness/MoriwakiSymmetry/EqMapSymm.lean:23
              - GroundTheory.Heights₂.Heights.DenseBoundedHeight.main [theorem] GroundTheory/HeightsAndTheta/Heights/HeightsOfSets/HeightsSetAll.lean:22
              - GroundTheory.Heights₂.Heights.HeightComparison.main [theorem] GroundTheory/HeightsAndTheta/Heights/HeightsOfSets/HeightsSetAll.lean:20
              - GroundTheory.Heights₂.Heights.zariskiDense_iff_orbitIdeal [theorem] GroundTheory/HeightsAndTheta/Heights/HeightsOfSets/MemMCoordIdealIffOfIsWeightedHomogeneous.lean:128
              - CoverDenseAlt.Rename₂.homog_ren [theorem] Development/WeilBound/CoreStatements/AmpleLineBundles/PtsIntegralMap.lean:23
              - GroundTheory.Heights₂.Heights.mem_map_ringEquiv_iff [theorem] GroundTheory/HeightsAndTheta/Heights/Antisymmetric/PNefOnFibresRelabel.lean:15
              (+36 more references not shown)
          - PositivityTheory.Pf1.HilbertSamuelMoriwaki.moriwakiBig_outright [theorem] Development/WeilBound/CoreStatements/AutomorphicKernels/MoriwakiBigness/MoriwakiBigTheorem/Outright.lean:9
            - PositivityTheory.Pf1.HilbertSamuelMoriwaki.moriwakiBig_of_classicalTheorems [theorem] Development/WeilBound/CoreStatements/AutomorphicKernels/MoriwakiBigness/MoriwakiBigTheorem/HSChain.lean:367
              - GroundTheory.Heights₂.Heights.Targets.MoriwakiBig.of_found [theorem] GroundTheory/HeightsAndTheta/Heights/OrbitLimits/MoriwakiBig.lean:11
              - PositivityTheory.Pf1.HilbertSamuelMoriwaki.hsChain [theorem] Development/WeilBound/CoreStatements/AutomorphicKernels/MoriwakiBigness/MoriwakiBigTheorem/HSChain.lean:180  (shown above)
            - PositivityTheory.ResPlug.FromRes.resK [theorem] Development/WeilBound/CoreStatements/ResolutionCharZero/PlugResK.lean:7  (shown above)
            - GlobalTheory.T.arith_intersection_system_of_poincare_lelong [theorem] Development/AutomorphicSpectrum/Proofs/MetricProofs/ArithIntersectionSystemOfPoincareLelongStatement.lean:11  (shown above)
            - PositivityTheory.Tls2.Pl.poincareLelong [theorem] Development/WeilBound/CoreStatements/TemperedRepresentationTheory/PoincareLelong/PoincareLelongInv.lean:13  (shown above)
            - PositivityTheory.MbAis.DenseCurves.main [theorem] Development/WeilBound/CoreStatements/AutomorphicKernels/MoriwakiBigness/MoriwakiSymmetry/EqMapSymm.lean:23  (shown above)
          - UpperTheory.LiteratureTheorems.published_results_eigen [theorem] Development/AutomorphicArithmetic/ThetaCorrespondence/ThetaPairLifts/ThirdPlaceSeries/EveryCharacterOfLiteratureOfVWin.lean:666
            - UpperTheory.LiteratureTheorems.clozel_cohomological_of_literature [theorem] Development/AutomorphicArithmetic/ThetaCorrespondence/ThetaPairLifts/ThirdPlaceSeries/EveryCharacterOfLiteratureOfVWin.lean:327
              - PositivityTheory.Rg.Cz.clozelCohomological [theorem] Development/WeilBound/RepresentationTheoryGL/CasimirAlgebra/KugaCoordinates/ClozelCohomological.lean:8
            - UpperTheory.LiteratureTheorems.green_cuspidal_of_literature [theorem] Development/AutomorphicArithmetic/ThetaCorrespondence/ThetaPairLifts/ThirdPlaceSeries/EveryCharacterOfLiteratureOfVWin.lean:397
              - PositivityTheory.Stage1.PM.greenCuspidal [theorem] Development/WeilBound/CoreStatements/StandardPublishedResults/StandardTheoremStatements/HarishChandraModules.lean:12
            - UpperTheory.LiteratureTheorems.hecke_l_adic_character_of_literature [theorem] Development/AutomorphicArithmetic/ThetaCorrespondence/ThetaPairLifts/ThirdPlaceSeries/EveryCharacterOfLiteratureOfVWin.lean:419
              - PositivityTheory.Stage1.PM.heckeLAdicCharacter [theorem] Development/WeilBound/CoreStatements/StandardPublishedResults/StandardTheoremStatements/GlobalArtinReciprocity.lean:14
            - UpperTheory.LiteratureTheorems.chebotarev_degree_one_of_literature [theorem] Development/AutomorphicArithmetic/ThetaCorrespondence/ThetaPairLifts/ThirdPlaceSeries/EveryCharacterOfLiteratureOfVWin.lean:323
              - GlobalTheory.Published.chebotarevDegreeOne' [theorem] Development/AbelianVarietyTheory/Proofs/InertiaEigenvalues/ChebotarevDegreeOne.lean:17
            - UpperTheory.LiteratureTheorems.cusp_u_of_literature [theorem] Development/AutomorphicArithmetic/ThetaCorrespondence/ThetaPairLifts/ThirdPlaceSeries/EveryCharacterOfLiteratureOfVWin.lean:389
              - UpperTheory.GalS.bridgeStar_alt [theorem] Development/AutomorphicArithmetic/ThetaCorrespondence/ThetaPairLifts/ThirdPlaceSeries/SOneRow.lean:11
              - UpperTheory.LiteratureTheorems.gelfand_kazhdan_dual_of_literature [theorem] Development/AutomorphicArithmetic/ThetaCorrespondence/ThetaPairLifts/ThirdPlaceSeries/EveryCharacterOfLiteratureOfVWin.lean:291
              - UpperTheory.LiteratureTheorems.pair_u_of_literature [theorem] Development/AutomorphicArithmetic/ThetaCorrespondence/ThetaPairLifts/ThirdPlaceSeries/EveryCharacterOfLiteratureOfVWin.lean:285
            (+55 more references not shown)
          (+16 more references not shown)
        - UpperTheory.Zero.LLC.recTExists [theorem] Development/AutomorphicArithmetic/Foundations/LocalLanglands/LocalCentralUnits/RecTExists.lean:20
          - UpperTheory.Zero.LLC.artEx [theorem] Development/AutomorphicArithmetic/Foundations/LocalLanglands/LocalCentralUnits/ArtEx.lean:7
            - GlobalTheory.localArtinExists_holds [theorem] Development/AbelianVarietyTheory/Proofs/InertiaEigenvalues/LocalArtinExistsHolds.lean:56
              - GlobalTheory.globalArtinReciprocity_holds [theorem] Development/AbelianVarietyTheory/Proofs/IwasawaDecomposition/GlobalArtinReciprocityHolds.lean:5
              - GlobalTheory.T.exists_inverse_localArtin_weilGroup_hom [theorem] Development/AbelianVarietyTheory/Proofs/InertiaEigenvalues/ExistsInverseLocalArtinWeilGroupHomStatement.lean:11
              - GlobalTheory.T.inverseLocalArtin_continuousOn_inertia [theorem] Development/AbelianVarietyTheory/Proofs/InertiaEigenvalues/InverseLocalArtinContinuousOnInertiaStatement.lean:11
              - GlobalTheory.T.smoothWeilChar_eq_one_of_toAbsGaloisAb_eq_one [theorem] Development/AbelianVarietyTheory/Proofs/InertiaEigenvalues/SmoothWeilCharEqOneOfToAbsGaloisAbEqOneStatement.lean:11
              (+2 more references not shown)
            - GlobalTheory.globalArtinReciprocity_holds [theorem] Development/AbelianVarietyTheory/Proofs/IwasawaDecomposition/GlobalArtinReciprocityHolds.lean:5  (shown above)
            - GlobalTheory.ArtinLocalInj.artin_localIdele_injective [theorem] Development/AbelianVarietyTheory/Proofs/InertiaEigenvalues/GlobalArtinLocalIdeleInjective.lean:23
            - GlobalTheory.Published.chevalleyUnits' [theorem] Development/AbelianVarietyTheory/Proofs/InertiaEigenvalues/ChevalleyUnits.lean:174
          - UpperTheory.Zero.LLC.cuspEx [theorem] Development/AutomorphicArithmetic/Foundations/LocalLanglands/LocalCentralUnits/CuspEx.lean:168
            - UpperTheory.Zero.LLC.goodMap [theorem] Development/AutomorphicArithmetic/Foundations/LocalLanglands/LocalCentralUnits/GoodMap.lean:144
            - UpperTheory.Zero.LLC.expo [theorem] Development/AutomorphicArithmetic/Foundations/LocalLanglands/LocalCentralUnits/ExponentMulAbsPow.lean:63
            - UpperTheory.Zero.LLC.junkEx [theorem] Development/AutomorphicArithmetic/Foundations/LocalLanglands/LocalCentralUnits/JunkEx.lean:257
            - UpperTheory.Zero.LLC.wDBasic [theorem] Development/AutomorphicArithmetic/Foundations/LocalLanglands/LocalCentralUnits/WDBasic.lean:148
            - UpperTheory.Zero.LLC.clBasic [theorem] Development/AutomorphicArithmetic/Foundations/LocalLanglands/LocalCentralUnits/ClBasic.lean:135
            (+23 more references not shown)
          - GlobalTheory.LocLanglands.exists_isLExt [theorem] Development/AbelianVarietyTheory/Proofs/InertiaEigenvalues/LanglandsExtensionUniqueOnCuspidal.lean:34
            - GlobalTheory.LocGL.single_spec [theorem] Development/AbelianVarietyTheory/Definitions/NonGaloisDescent/NonemptyEquivMultiProdOne.lean:710
            - GlobalTheory.WeilDeligne.WD.lpSum_zero [theorem] Development/AbelianVarietyTheory/Proofs/IwasawaDecomposition/Mono0OfLpDimEqOne.lean:35
            - GlobalTheory.WeilDeligne.charPol_lpTw_lpChar_lpSp [theorem] Development/AbelianVarietyTheory/Proofs/InertiaEigenvalues/WeilDeligneCharpolyTwistSpecial.lean:56
            - GlobalTheory.LocLanglands.LangExt.charZero_adicCompletion [theorem] Development/AbelianVarietyTheory/Proofs/InertiaEigenvalues/LanglandsExtensionUniqueOnCuspidal.lean:27
            - GlobalTheory.LocLanglands.LangExt.sumList_perm [theorem] Development/AbelianVarietyTheory/Proofs/InertiaEigenvalues/LanglandsExtensionUniqueOnCuspidal.lean:22
            (+3 more references not shown)
          - UpperTheory.Zero.LLC.Pr.exh [theorem] Development/AutomorphicArithmetic/Foundations/LocalLanglands/Multi.lean:11
            - PositivityTheory.Exh.langlandsExhaustionGL_holds [theorem] Development/WeilBound/CoreStatements/AutomorphicKernels/LanglandsExhaustion/Outright.lean:8
          - UpperTheory.Zero.LLC.Pr.multi [theorem] Development/AutomorphicArithmetic/Foundations/LocalLanglands/Multi.lean:12
            - PositivityTheory.Exh.langlandsMultisegments_holds [theorem] Development/WeilBound/CoreStatements/AutomorphicKernels/LanglandsExhaustion/Outright.lean:10
          (+13 more references not shown)
        - UpperTheory.One.vwin_of_row [theorem] Development/AutomorphicArithmetic/AutomorphicVarieties/ModularityArgument/ThresholdArguments/DenseThresholdCases/VwinOfRow.lean:4
          - UpperTheory.One.Join.automorphic_window_of_inputs [theorem] Development/AutomorphicArithmetic/AutomorphicVarieties/ModularityArgument/ThresholdArguments/DenseThresholdCases/TopMainZj.lean:71
            - UpperTheory.One.Join.v_window_of_depth_zero_residual_bc_cm [theorem] Development/AutomorphicArithmetic/AutomorphicVarieties/ModularityArgument/ThresholdArguments/DenseThresholdCases/TopMainZj.lean:55
            - UpperTheory.One.Join.cm_abelian_inputs_from_literature [theorem] Development/AutomorphicArithmetic/AutomorphicVarieties/ModularityArgument/ThresholdArguments/DenseThresholdCases/TopMainZj.lean:59
          - UpperTheory.BaseChangeIdentities.baseChangeN [theorem] Development/AutomorphicArithmetic/Foundations/BaseChangeIdentities/DefiniteNHolds.lean:5
            - UpperTheory.BaseChangeIdentities.baseChangeN_of [theorem] Development/AutomorphicArithmetic/Foundations/BaseChangeIdentities/FillPre.lean:7
            - UpperTheory.HeckeLevelFrameExistence.candFin [theorem] Development/AutomorphicArithmetic/Foundations/BaseChangeIdentities/FrameMatching/HeckeEigenvalueFiniteness/FrameEx.lean:15
          - UpperTheory.LiteratureTheorems.OpenImageCondition [structure] Development/AutomorphicArithmetic/AutomorphicVarieties/ModularityArgument/ThresholdArguments/DenseThresholdCases/TemperedProductOfSquareIntegrable.lean:207
            - UpperTheory.V.Z.Win.RowT [def] Development/AutomorphicArithmetic/AutomorphicVarieties/ModularityArgument/AutomorphyLifting/WeakOfAtt.lean:47
- allChi [theorem] Supplements/Kernels/MainTheorems.lean:7  (shown above)
- claimAll [theorem] Supplements/Kernels/MainTheorems.lean:15
  - Claim.strip [theorem] Development/AutomorphicArithmetic/CharacterBoxes/ClaimStrip.lean:59
    - Claim.prim_zero [theorem] Development/AutomorphicArithmetic/CharacterBoxes/ClaimStrip.lean:23
      - Claim.factor_ne_zero [theorem] Development/AutomorphicArithmetic/CharacterBoxes/ClaimStrip.lean:7
    - Claim.prim_reflect [theorem] Development/AutomorphicArithmetic/CharacterBoxes/ClaimStrip.lean:42
      - Claim.gamma_ne_zero [theorem] Development/AutomorphicArithmetic/CharacterBoxes/ClaimStrip.lean:35
    - Claim.HalfPlane [def] Development/AutomorphicArithmetic/CharacterBoxes/HalfPlane.lean:3
  - Claim.zeta [theorem] Development/AutomorphicArithmetic/CharacterBoxes/ClaimStrip.lean:75
    - Claim.strip [theorem] Development/AutomorphicArithmetic/CharacterBoxes/ClaimStrip.lean:59  (shown above)
  - allChi [theorem] Supplements/Kernels/MainTheorems.lean:7  (shown above)
- critAll [theorem] Supplements/Kernels/MainTheorems.lean:11
  - Formalism.VW.critLine [theorem] Formalism/GammaFactorNonvanishing/CritLine.lean:11
    - Formalism.VW.gammaFactor_ne_zero [theorem] Formalism/GammaFactorNonvanishing/CritLine.lean:6
  - allChi [theorem] Supplements/Kernels/MainTheorems.lean:7  (shown above)

```

Reliability of the tree. The references are found by matching identifiers in the proof body against the declaration index (heuristic, described in `spine.py`). Spot-check: eight declarations were compared by hand with their bodies (`imprimitive`, `plugWin`, `galoisLocalGlobalStrong_of_geometry_lift`, `geoOne_of_parts`, `Claim.strip`, `vwin_of_row`, `rh_of_right`, `top_of`). Every project name a body mentions was found, no spurious name was reported, and `rh_of_right` (which uses only Mathlib) correctly had none. One systematic miss was found and fixed during the spot-check: names written with a leading `_root_.` were skipped, which left `every_character_of_literature_of_vWin` with 2 of its 22 references; the spine above was generated after the fix. Known remaining misses: hypotheses and conclusions in the statement are not scanned (so the edges `FamEx → FamProj → FamWt → WtLacEx` in the statement of `top_of` are not edges of the tree), structure projections such as `O.caraianiLocalGlobalDual`, field notation on a local (`h.le`), instances and simp lemmas found implicitly, and names inside `macro`/`notation`. Possible false positives: a local binder whose name equals a project declaration.


## 4. Where the note's steps live

Method. For each step the names listed in `note-digest.md` were searched in declaration names and file paths (`grep.py`, plus direct SQL on the index), the dense directories were opened, and the best matches were read. A "match" means the Lean statement says something close to the step as the digest glosses it; a name hit alone is not a match. All declarations quoted below are in the import closure of `Main` (every file is). Steps are in the note's numbering and the digest's logical order. Statement blocks are verbatim; for `def ... : Prop` the first lines of the body are included because the body is the proposition.

Verdict key: **located** (a declaration states essentially the step), **partial** (the area and tools are present, the exact step is not identified), **none** (no convincing match).

### A. The toy setting

**Step 1, Stepanov determinant: none by name, partial by content.** `stepanov` occurs in 0 declaration names and 0 paths. Nearby: `determinant` is in 2,361 declaration names (528 files, led by `Formalism/BranchSandwichDivisors/BranchIsometryProofs` 428 and `Formalism/FormalDegreeBessel/FormalDegreeRatio` 329); `jet` is in 6,103 names (1,219 files, mostly `Development/AbelianVarietyTheory/Proofs`); Hasse derivatives, Wronskians and vanishing orders (`hasseDeriv|wronsk|vanishingOrder|auxiliaryPoly`) are in 47 names across 19 files. The best structural candidate is `Formalism/IncomingBounds` (`StatementThmP.lean`, 74 lines), which works with the determinant `detL` of a matrix of variables, a Cayley-type differential identity, jets of a power series, and an `l`-adic valuation bound at a prime `y` just above `Y0`:

`Formalism.IncomingBounds.detL` (def), `Formalism/IncomingBounds/StatementThmP.lean:12`

```lean
def detL (C : Type) [Field C] (n0 : ℕ) : MvPolynomial (PVar n0) C
:=
  Matrix.det (Matrix.of fun b c : Fin n0 => MvPolynomial.X (Sum.inl (b, c)))
```

`Formalism.IncomingBounds.CayleyId` (def), `Formalism/IncomingBounds/StatementThmP.lean:55`

```lean
def CayleyId : Prop
:=
  ∀ (C : Type) [Field C] [CharZero C] (n0 s : ℕ),
    diffOp (detL C n0) (detL C n0 ^ (s + 1)) =
      ((∏ a ∈ Finset.range n0, ((s : C) + 1 + a))) • detL C n0 ^ s
```

`Formalism.IncomingBounds.ThmP` (def), `Formalism/IncomingBounds/StatementThmP.lean:60`

```lean
def ThmP : Prop
:=
  ∃ C0 : ℝ, ∀ (C : Type) [Field C] [CharZero C] (v : AddValuation C (WithTop ℝ)) (l : ℕ),
    l.Prime → 5 ≤ l → v (l : C) = 1 → (∀ p : ℕ, p.Prime → p ≠ l → v (p : C) = 0) →
    ∀ (i : ℕ), Odd i → ∀ (n n0 : ℕ), 1 ≤ n → n0 ≤ n →
    ∀ h1 : MvPowerSeries (PVar n0) C, MvPowerSeries.constantCoeff h1 = 0 →
      WeightCond v l i n0 h1 →
      ∀ Y0 : ℕ, ∃ y : ℕ, Y0 ≤ y ∧
        (y : ℝ) < Y0 + C0 * (n : ℝ) ^ 2 * (l : ℝ) ^ i * Real.log ((n : ℝ) * (l : ℝ) ^ i) ∧
        v (LamP C l i n0 h1 y) ≤
          ((((n0 : ℝ) * y * (((l : ℝ) ^ i + 1) * gam l - 1) + n * (Real.logb l n + 1)) : ℝ) :
            WithTop ℝ)
```


Reading: `ThmP` produces, in each window `[Y0, Y0 + C0 n^2 l^i log(n l^i))`, a `y` for which the `l`-adic valuation of a quantity `LamP` (definition not read) is bounded above. Whether this is the "determinant plus multiplicity" device is a guess; the Lean code does not say so. Treat it as a candidate.

**Step 3, `qN = M^k + R`, `x1 x2 + ... + x_{k-1} x_k`, iterated Parseval: partial.** `quadric` occurs in 69 names (25 files) and `parseval` in 173 names (77 files). The finite-field quadric count is stated:

`GlobalTheory.CompanionTheory.SW.QuadricCount.quadric_count_even` (theorem), `CompanionTheory/SpectralGeometry/LocalGlobalProofs/AdelicAnalysis/FiniteFieldQuadraticFormPointCount.lean:163`

```lean
theorem quadric_count_even : ∀ (k : Type) [Field k] [Fintype k], ringChar k ≠ 2 → ∀ (ι : Type) [Fintype ι] [DecidableEq ι] (M : ℕ), Fintype.card ι = 2 * M → 1 ≤ M → ∀ (B : Matrix ι ι k), B.IsSymm → B.det ≠ 0 → ∀ s : k, |(Nat.card {x : ι → k // (2 : k)⁻¹ * (x ⬝ᵥ (B *ᵥ x)) = s} : ℝ) - (Fintype.card k : ℝ) ^ (2 * M - 1)| ≤ (Fintype.card k : ℝ) ^ M
```

cites: `GlobalTheory.CompanionTheory.SW.QuadricCount.card_quadric_even`

`GlobalTheory.T.hua_integral_positive_definite_quadric` (theorem), `Development/AbelianVarietyTheory/Proofs/IwasawaDecomposition/HuaIntegralPositiveDefiniteQuadricStatement.lean:9`

```lean
theorem _root_.GlobalTheory.T.hua_integral_positive_definite_quadric : ∀ (p q : ℕ) (A : Matrix (Fin p ⊕ Fin q) (Fin p ⊕ Fin q) ℂ), A.PosDef → ∫⁻ v : Fin p × Fin q → ℂ, ENNReal.ofReal ((shear A (toMat v)).toBlocks₂₂.det.re ^ (-((p + q : ℕ) : ℤ))) = ENNReal.ofReal (A.det.re ^ (-(q : ℤ)) / grassConst p q)
```

cites: `GlobalTheory.HuaQuadric.quadric`


The first is a square-root-quality count `|N - q^(2M-1)| ≤ q^M` for a nondegenerate quadric over a finite field (`CompanionTheory/SpectralGeometry/LocalGlobalProofs/AdelicAnalysis/FiniteFieldQuadraticFormPointCount.lean`). Parseval statements are everywhere (`Development/AbelianVarietyTheory/Proofs` 59, `Development/AutomorphicSpectrum/Proofs` 59), and the directory `Foundations/GaloisRepresentations/ThetaParseval` is where the theta-lift existence proof lives (section 3). The sign-only argument for Weil and Deligne itself (sum over `h, x_1, ..., x_k` of `t(x_1)...t(x_k) e_q(h Q(x))`) was not found.

**Step 2, `D^p ≡ 0` on a CM curve, divisibility of `D^a θ(0)/Ω^a`: partial.** Names that pair theta functions with derivatives are 758 declarations in 314 files (255 files in `Development/AbelianVarietyTheory/Proofs`). CM theta values at the origin are treated directly:

`GlobalTheory.ThetaZeroAlg.evenTheta_iteratedDeriv_zero_algebraic` (theorem), `Development/AbelianVarietyTheory/Proofs/GlobalInterpolation/EvenThetaIteratedDerivZeroAlgebraic.lean:104`

```lean
theorem evenTheta_iteratedDeriv_zero_algebraic : ∀ (D : D7) (cc : Ideal (𝓞 D.host.K)) (δ : ℂ) (B : Base D cc δ), TaylorLogMetric.IsCurveIdeal D cc →
    TaylorLogMetric.IsDiscriminantTwelfthRootOfIdealLattice D cc δ → ∀ k : ℕ, iteratedDeriv k B.th0 0 ∈ TaylorLogMetric.Qbar
```

cites: `Formalism.L2.KerInert.AlgP.theta_null_coefficients`, `Formalism.L2.GlobalTheoryTheory.IntegralLatticeDensity.SO.half`, `GlobalTheory.ThetaZeroAlg.g₂_g₃_mem_Qbar`, `GlobalTheory.ThetaZeroAlg.kernelBase_periodLattice_sigmaTwo_algebraic`, `GlobalTheory.ThetaZeroAlg.weierstrassP_halfPeriod_algebraic`, `Formalism.MainNotions.TaylorLogMetric.Qbar`, `Formalism.L2.Th1.F.taylor0`, `Formalism.L2.Th1.F.th0`

`Formalism.GM.M.TheoremM` (def), `Formalism/MahlerMeasure/StatementTM.lean:76`

```lean
def TheoremM : Prop
:=
  ∃ C₀ : ℝ, 1 ≤ C₀ ∧ ∀ (p : ℕ) [Fact p.Prime] (N r : ℕ) [NeZero N] [NeZero r] (LL : Letters N) (T : TieData)
    (a : ℕ) (E κ : ℝ) (Yl n₀ dd : Fin T.t → ℕ) (ρ : Fin r),
    p ≠ 2 → 2 ≤ r → (ρ : ℕ) = r - 1 → T.Admissible LL →
    1 ≤ E → (∀ i, 1 ≤ Yl i ∧ 0 < dd i ∧ IsCoprime (dd i : ℤ) p) →
    (∀ i, T.S (LL.setTies T (fun i => n₀ i + dd i * (Yl i - 1))) i ≤ n₀ i) →
    (∀ x, (LL.setTies T (fun i => n₀ i + dd i * (Yl i - 1))).deg x ≤ 2 * a) → (∀ i, T.z i ≤ 2 * a) →
    ((N + 2) * r ^ 2 : ℝ) * lgV2 p a r ≤ κ →
    (∀ n ∈ Fintype.piFinset (fun i => (range (Yl i)).image (fun j => n₀ i + dd i * j)),
      HypP p (LL.setTies T n) ρ ⌈κ / (N + 2)⌉₊ ∧ HypW p (r := r) (LL.setTies T n) ⌈κ / (N + 2)⌉₊ ∧
      ∀ i, GramDeterminantGradedHypothesis p ((LL.setTies T n).takeD (T.pos  ...[cut]
```


The first says that, for a CM curve normalised by `g2^3 - 27 g3^2 = 1` over a discriminant-twelfth-root datum, all iterated derivatives of the even theta function at 0 lie in `Qbar`. `TheoremM` (`Formalism/MahlerMeasure/StatementTM.lean`, 98 lines) is a valuation-window statement for an odd prime `p` with Gram-determinant hypotheses; whether it is the divisibility `p^(a/p + a/p^3 + ...)` is not established here.

### B. The positivity frame over the integers

**Step 5, smoothed von Mangoldt sum, Guinand, variance trick: located (the sum); Guinand none by name.** The sum of the note is defined in `Formalism/Statement.lean` (50 lines):

`Formalism.S` (def), `Formalism/Statement.lean:14`

```lean
def S {N : ℕ} (χ : DirichletCharacter ℂ N) (x : ℝ) : ℝ
:=
  ∑ n ∈ Finset.Icc 1 ⌊x⌋₊, LamF χ n * (x / n - 1)
```

`Formalism.G` (def), `Formalism/Statement.lean:21`

```lean
def G {N : ℕ} [NeZero N] (χ : DirichletCharacter ℂ N) (x : ℝ) : ℝ
:=
  S χ x - x * Real.log x + (1 + gammaF χ) * x
```


`S χ x = Σ_{n ≤ x} Λ(n)(1 + Re χ(n))(x/n - 1)` and `G χ x = S χ x - x log x + (1 + γ_χ) x`; `Gz` in `StatementOC.lean` is the analogous quantity built from `Sz` (not read) with the Euler-Mascheroni constant. The weight `1 + Re χ(n)` is nonnegative for a real character. `guinand` occurs in 0 names; `mangoldt` in 84 names (36 files), concentrated in `Development/AbelianVarietyTheory/Proofs` (54) and `Formalism/LandauZeroFreeBounds/ExceptionalZeroBounds` (12).

**Steps 4 and 6, positivity gives a zero-free region, `W(...) ≥ 0`: step 6 located (as `LandauStep` and `RHofG`), step 4 partial (the Weil functional on `1_S` was not found).** A one-sided bound on `G` implies zero-freeness (Landau's lemma) and RH:

`Formalism.LandauStep` (def), `Formalism/Statement.lean:32`

```lean
def LandauStep : Prop
:=
  ∀ (N : ℕ) [NeZero N] (χ : DirichletCharacter ℂ N), χ ≠ 1 → (∀ n : ℕ, (χ n).im = 0) →
  ∀ σ₀ : ℝ, 0 < σ₀ → σ₀ < 1 →
  (∀ σ : ℝ, σ₀ < σ → σ < 1 → DirichletCharacter.LFunction χ σ ≠ 0) →
  (∃ C : ℝ, ∀ x : ℝ, 1 ≤ x → -C * x ^ σ₀ ≤ G χ x) →
  ∀ s : ℂ, σ₀ < s.re → riemannZeta s ≠ 0 ∧ DirichletCharacter.LFunction χ s ≠ 0
```

`Formalism.RHofG` (def), `Formalism/Statement.lean:46`

```lean
def RHofG {N : ℕ} [NeZero N] (χ : DirichletCharacter ℂ N) : Prop
:=
  (∀ ε : ℝ, 0 < ε → ∃ C : ℝ, ∀ x : ℝ, 1 ≤ x → -C * x ^ ((1 : ℝ) / 2 + ε) ≤ G χ x) →
  RiemannHypothesis ∧ ∀ s : ℂ, 1 / 2 < s.re → DirichletCharacter.LFunction χ s ≠ 0
```


The note's `η` corresponds, in the code, to the exponent slack `eps` (`eps < 1/52` in `HostExW` and `VWinAt`, exponent `1/2 + (...) eps`); this identification is a reading. The bound that the analytic engine must deliver, and its reduction to RH, are:

`Formalism.LFunctionChainParameters.ThickSetMeanBounds.GrowthBoundGivesRiemannHypothesis` (def), `Formalism/SizeWindowBrackets/GrowthBoundGivesRiemannHypothesis.lean:139`

```lean
def GrowthBoundGivesRiemannHypothesis : Prop
:=
  ∀ C ε₁ : ℝ, 0 < ε₁ → (∀ ε : ℝ, 0 < ε → ε < ε₁ → ∃ x₀ : ℝ, ∀ x : ℝ, x₀ ≤ x → GrowthInequalityDataExists C ε x) →
    RiemannHypothesis
```

`Formalism.LFunctionChainParameters.ThickSetMeanBounds.RiemannHypothesisOfBalanceAndGrowthData` (def), `Formalism/SizeWindowBrackets/GrowthBoundGivesRiemannHypothesis.lean:131`

```lean
def RiemannHypothesisOfBalanceAndGrowthData : Prop
:=
  (∀ (H : Type) [AddCommGroup H] [Fintype H] [DecidableEq H], AskMainBalance (H := H)) →
  ∀ C ε₁ : ℝ, 0 < ε₁ → (∀ ε : ℝ, 0 < ε → ε < ε₁ → ∃ x₀ : ℝ, ∀ x : ℝ, x₀ ≤ x → GrowthInequalityDataExists C ε x) →
    RiemannHypothesis
```


The classical zero-free region is also formalized (`Formalism/ZeroFreeRegion`, 34 files, 3,189 lines; `Formalism/LandauZeroFreeBounds`, at least 40 files, 4,953 lines, including Siegel's theorem lower bound `siegelLower`, `SiegelWalfisz`):

`Formalism.ZF.ZeroFreeRegion` (def), `Formalism/ZeroFreeRegion/Statement.lean:9`

```lean
def ZeroFreeRegion : Prop
:=
  ∃ c : ℝ, 0 < c ∧ ∀ s : ℂ, s ≠ 1 → 1 - c / Real.log (|s.im| + 2) ≤ s.re → riemannZeta s ≠ 0
```

`Formalism.ZeroFreeDirichlet.siegelLower` (theorem), `Formalism/LandauZeroFreeBounds/FinalSiegel.lean:17`

```lean
theorem siegelLower : SiegelLower
```

cites: `Formalism.ZeroFreeDirichlet.siegel_theorem_of`, `Formalism.ZeroFreeDirichlet.exists_product_character`, `Formalism.ZeroFreeDirichlet.exists_real_nontrivial_character`, `Formalism.ZeroFreeDirichlet.lfunction_one_upper_bound`, `Formalism.ZeroFreeDirichlet.zeta_negative_real_axis`, `Formalism.ZeroFreeDirichlet.real_lfunction_real_on_reals`, `Formalism.ZeroFreeDirichlet.lfunction_one_same_character`, `Formalism.ZeroFreeDirichlet.bqKey`


`explicitFormula` appears in 24 names (13 files): `PI.ExplicitFormula` in `Formalism/PeriodIntegrals/ExplicitFormula.lean` (28 lines) is the classical explicit formula for `ψ_0(χ, u)` with a sum over zeros below height `T`. The Weil functional on an indicator `W(1_S)` and its determinant expression were not found; the nearest are the character-sum functions `Gsig`/`GPsi` in `Formalism/SizeWindowBrackets/GrowthBoundGivesRiemannHypothesis.lean` (183 lines), where `Gsig = GPsi 0 + GPsi psC - GPsi chC - GPsi chpsC` and `CharacterSignsAtBaseClass` fixes `chC = -1`, `psC = 1`, `chpsC = -1` at the base class `sgc0`. That is a sign-combination device and plausibly the note's step 3 or 4 sign argument, but this is a reading, not a label in the code.

**Step 7, GGP periods and interlacing: located.** `GGP`/`GanGross` is in 51 names (15 files); `Bessel` in 2,640 names (805 files). `Formalism/PeriodIntegrals/BesselPeriodGGP.lean` (122 lines) states the interlacing and half-integral-difference conditions on weights:

`PI.BesselPeriodGGP.InterlacingCondition` (def), `Formalism/PeriodIntegrals/BesselPeriodGGP.lean:27`

```lean
def InterlacingCondition (k r : ℕ) (u : Fin k → ℝ) (v : Fin (k - 1) → ℝ) (b : Fin (2 * r + 2) → ℝ) : Prop
:=
  (∀ i : Fin (k - 1), v i < u ⟨i.val, by have := i.isLt; omega⟩ ∧
      u ⟨i.val + 1, by have := i.isLt; omega⟩ < v i) ∧
    ∀ h : 0 < k, -b ⟨0, by omega⟩ < u ⟨k - 1, by omega⟩
```

`PI.BesselPeriodGGP.HalfIntegralDifference` (def), `Formalism/PeriodIntegrals/BesselPeriodGGP.lean:32`

```lean
def HalfIntegralDifference (k r : ℕ) (u : Fin k → ℝ) (v : Fin (k - 1) → ℝ) (b : Fin (2 * r + 2) → ℝ) : Prop
:=
  ∀ i s, ∃ j : ℤ, u i - lam48 k r v b s = (j : ℝ) + 1 / 2
```


### C. Multiplicity from theta lifts

**Step 8, iterated theta lifts between definite unitary groups: located.** `thetaLift|tLift` is in 1,196 names (456 files); `theta` in 20,901 names (6,771 files). The existence of a lift for each polarized pair, with weights `lam'` determined from those of `X` (`IsLiftWt`), is `TLift_k`/`TLiftK`, and an `m`-fold chain of kernel operators is `chainOp`:

`UpperTheory.TP.IsLift` (structure), `Development/AutomorphicArithmetic/Foundations/GaloisRepresentations/ThetaParseval/SchurStep.lean:106`

```lean
structure IsLift {n d : ℕ} (B : Base (maximalRealSubfield E) E) (χX χW : Chr (maximalRealSubfield E) E)
    (mX mW : InfinitePlace (maximalRealSubfield E) → ℤ) (lam : InfinitePlace (maximalRealSubfield E) → DomWeight n)
    (U : Submodule ℂ (GlobalTheory.UnitaryBC.UA E n → ℂ)) (U' : Submodule ℂ (GlobalTheory.UnitaryBC.UA E d → ℂ)) : Prop
where
  aut : GlobalTheory.UnitaryBC.IsAutRepU U'
  wt : ∀ w, ∃ lam' : DomWeight d, GlobalTheory.UnitaryBC.HasWeightAt U' (B.emb w).1 lam' ∧ IsLiftWt (lam w) (mX w) (mW w) lam'
  loc : ∀ (v : Pl (maximalRealSubfield E)) (t : E →ₐ[maximalRealSubfield E] Fv (maximalRealSubfield E) v) τ τ',
    CompAt U (splitPrime t) τ → CompAt U' (splitPrime t) τ' → LocPair t χX χW τ τ'
```

`UpperTheory.TP.TLift_k` (def), `Development/AutomorphicArithmetic/Foundations/GaloisRepresentations/ThetaParseval/ThetaKernels/GalTPDefs.lean:45`

```lean
def TLift_k : Prop
:=
  ∀ (E : Type) [Field E] [NumberField E] [IsCMField E] (B : Base (maximalRealSubfield E) E), _root_.UpperTheory.TP.W.GoodK (cj E) B →
    ∀ (n : ℕ), 1 ≤ n → ∀ X : Spc (maximalRealSubfield E) E n, X.J = 1 → X.IsHerm (cj E) B n 0 →
    ∃ d₀ : ℕ, ∀ d, d₀ ≤ d → ∀ (W : Spc (maximalRealSubfield E) E d) (δ : E), W.J = δ • (1 : Matrix (Fin d) (Fin d) E) →
      W.IsSkew (cj E) B d 0 → ∀ (χX χW : Chr (maximalRealSubfield E) E) (mX mW : InfinitePlace (maximalRealSubfield E) → ℤ),
      IsHecke (maximalRealSubfield E) E χX → IsHecke (maximalRealSubfield E) E χW →
      ResEtaPow (Units.map (algebraMap (maximalRealSubfield E) (AF (maximalRealSubfield E))).toMonoidHom).range χX n →
      ResEtaPow (Units.map (algebraMap (maximalRealSubfield E) (AF (maximalRealSubfield E))).toMonoi ...[cut]
```

`Formalism.ThetaLiftIndependence.chainOp` (def), `Formalism/ThetaLiftIndependence/Statement.lean:24`

```lean
def chainOp {R : Type*} [CommSemiring R] {ι : ℕ → Type*} [∀ j, Fintype (ι j)]
    (w : ∀ j, ι j → R) (K : ∀ j, ι j → ι (j + 1) → R) : (m : ℕ) → (ι 0 → R) → (ι m → R)

  | 0, f => f
  | m + 1, f => kerOp (w m) (K m) (chainOp w K m f)
```


`TLiftK` itself is quoted in section 3.2. The chain `U(X_0) → U(X_1) → ... → U(X_m)` with `m ≈ √X` is not stated as one theorem by that shape; `TLiftK` quantifies over all large `d ≥ d₀`, and `Formalism/ThetaLiftIndependence` (10 files, 802 lines) works with chains of weighted kernel operators (`chainOp`) and ends in `final_gaussOp : GaussOp`, whose statement was not read.

**Step 12, seesaw and Rallis (Bessel period independent of Hecke characters): located.** `seesaw` is in 268 names (193 files, 258 in `Development/AbelianVarietyTheory/Proofs`), `Rallis` in 259 (71 files), `Howe` in 982 (248 files):

`GlobalTheory.T.seesaw_fubini_two_lifts_moderate_growth_kernels` (theorem), `Development/AbelianVarietyTheory/Proofs/DecoratedLatticeProofs/SeesawFubiniTwoLiftsModerateGrowthKernelsStatement.lean:15`

```lean
theorem _root_.GlobalTheory.T.seesaw_fubini_two_lifts_moderate_growth_kernels : ∀ (D : D7) (A B : HSp D) (m : Measure (GA D A)) (mH : Measure (GA D B)), m.IsHaarMeasure → mH.IsHaarMeasure → ∀ K₁ K₂ : GA D A → GA D B → ℂ, (∀ K ∈ ({K₁, K₂} : Set (GA D A → GA D B → ℂ)), Continuous (Function.uncurry K) ∧ (∀ γ ∈ GQ A, ∀ g h, K (γ * g) h = K g h) ∧ (∀ g, MemL2Quotient (GQ B) mH (K g)) ∧ (GlobalTheory.Grow.ModGrowth A fun g => petersson B mH (K g) (K g)) ∧ ∀ h, GlobalTheory.Grow.ModGrowth A fun g => K g h) → ∀ u₁ u₂ : GA D A → ℂ, GlobalTheory.Grow.RapidDec A u₁ → GlobalTheory.Grow.RapidDec A u₂ → let θ₁ : GA D B → ℂ
```

cites: `GlobalTheory.Core.Rk.Seesaw.seesaw_fubini`, `GlobalTheory.AutomorphicL2Unitary.descend`, `Formalism.L2.Theta.GQ`, `GlobalTheory.AutomorphicL2Unitary.autMeasure`, `Formalism.L2.Theta.GA`, `GlobalTheory.AutomorphicL2Unitary.MemL2Quotient`, `GlobalTheory.Cusp.petersson`, `Formalism.L2.Pj.AutQ`

`GlobalTheory.T.rallisInnerProduct_convergent_of_weilSiegelFormula` (theorem), `Development/AbelianVarietyTheory/Proofs/DecoratedLatticeProofs/RallisInnerProductConvergentOfWeilSiegelFormulaStatement.lean:21`

```lean
theorem _root_.GlobalTheory.T.rallisInnerProduct_convergent_of_weilSiegelFormula : GlobalTheory.Published.CuspRapidDecay → GlobalTheory.Published.WeilSiegelFormulaUnitary → GlobalTheory.Published.SiegelEisensteinContinuation → ∀ D : D7, GlobalTheory.IndefiniteRowSideFullHecke.SphericalVolumeLift.Convergent D
```

cites: `GlobalTheory.Proof.Corev.convergent_both_orientations`

`GlobalTheory.T.thetaInnerProductFormulaDefinite_of_rallisConvergent` (theorem), `Development/AbelianVarietyTheory/Proofs/DecoratedLatticeProofs/ThetaInnerProductFormulaDefiniteOfRallisConvergeStatement.lean:14`

```lean
theorem _root_.GlobalTheory.T.thetaInnerProductFormulaDefinite_of_rallisConvergent : GlobalTheory.Published.CuspRapidDecay → ∀ {D : D7} {G : Type} [Group G] [Fintype G] {Pl0 T : Type} {A : FamIn D.what₂.LL G Pl0 T D.R.m} {Ks : Type} [Field Ks] [NumberField Ks] [Algebra Ks D.what₂.LL] (R : RealDat D A Ks) (F : Face D A), GlobalTheory.IndefiniteRowSideFullHecke.SphericalVolumeLift.Convergent D → (∃ L : SizeData₂ D, Nonempty (ParameterChoice' D L)) → InnerProductFormulaC R F
```

cites: `GlobalTheory.IPFConv.innerProductFormulaC_of_convergent`


The independence of the period of the Hecke characters, as such, was not isolated.

**Step 9, norms, level, Chowla-Selberg, Weyl, Siegel mass: located.** `chowla` is in 336 names (71 files, 324 of them in `GroundTheory/HeightsAndTheta/Heights/ChowlaSelberg`, 40+ files, 3,575+ lines). Siegel mass is in `Formalism/HermitianLattices/StatementMass.lean` (90 lines) and in `Formalism/PeriodIntegrals/UnitaryGroupMassFormula` (3,615 files, 5,551 declarations with `massFormula` in the name):

`GlobalTheory.chowla_selberg_eta` (theorem), `Development/AbelianVarietyTheory/Proofs/HomogeneousIdeals/DedekindZetaEqSumRealEisenstein.lean:222`

```lean
theorem chowla_selberg_eta {τ : ClassGroup (𝓞 K) → ℍ} (hτ : ∀ c, IsIdealClassPoint σ c (τ c)) :
    (((∑ c, Real.log (4 * π * (τ c).im * ‖ModularForm.eta (τ c)‖ ^ 4)) / classNumber K : ℝ) : ℂ)
      = (Real.eulerMascheroniConstant + Real.log (2 * π / √d) : ℝ)
        - deriv χ.LFunction 1 / χ.LFunction 1
```

cites: `GlobalTheory.QuadraticZeta.discr_pos`, `GlobalTheory.LFunction_one_and_mean_log_eta`

`GroundTheory.Heights₂.Heights.ChowlaSelberg.KroneckerLimit.full` (theorem), `GroundTheory/HeightsAndTheta/Heights/ChowlaSelberg/Assembly.lean:32`

```lean
theorem KroneckerLimit.full : KroneckerLimit.Statement
```

cites: `GroundTheory.Heights₂.Heights.ChowlaSelberg.KroneckerLimit.proof`, `GroundTheory.Heights₂.Heights.ChowlaSelberg.KroneckerSplit.proof`, `GroundTheory.Heights₂.Heights.ChowlaSelberg.PowerIntegral.proof`, `GroundTheory.Heights₂.Heights.ChowlaSelberg.ShiftedSumIntegral.proof`, `GroundTheory.Heights₂.Heights.ChowlaSelberg.CotangentSum.proof`, `GroundTheory.Heights₂.Heights.ChowlaSelberg.LogEta.proof`, `GroundTheory.Heights₂.Heights.ChowlaSelberg.GammaZetaLimit.proof`

`Formalism.HermitianLatticesTheory.SiegelMassRatio` (def), `Formalism/HermitianLattices/StatementMass.lean:67`

```lean
def SiegelMassRatio : Prop
:=
  ∀ (K : Type) [Field K] [NumberField K] [StarRing K], IsCMUnram K →
    ∀ (M : ℕ), 3 ≤ M →
    ∀ (V V' : Type) [AddCommGroup V] [Module K V] [Module (RingOfIntegers K) V]
      [IsScalarTower (RingOfIntegers K) K V] [AddCommGroup V'] [Module K V']
      [Module (RingOfIntegers K) V'] [IsScalarTower (RingOfIntegers K) K V']
      (h : V →ₗ⋆[K] V →ₗ[K] K) (h' : V' →ₗ⋆[K] V' →ₗ[K] K)
      (L : Submodule (RingOfIntegers K) V) (L' : Submodule (RingOfIntegers K) V'),
      h.IsSymm → h'.IsSymm → IsOrthoLattice h L M → IsOrthoLattice h' L' (M - 1) →
      mass h L / mass h' L' = massRatioRightSide K M
```

`Formalism.HermitianLatticesTheory.MassTelescope` (def), `Formalism/HermitianLattices/StatementMass.lean:78`

```lean
def MassTelescope : Prop
:=
  SiegelMassRatio →
  ∀ (K : Type) [Field K] [NumberField K] [StarRing K], IsCMUnram K →
    ∀ (k r : ℕ), 2 ≤ k → k ≤ r →
    ∀ (V V' : Type) [AddCommGroup V] [Module K V] [Module (RingOfIntegers K) V]
      [IsScalarTower (RingOfIntegers K) K V] [AddCommGroup V'] [Module K V']
      [Module (RingOfIntegers K) V'] [IsScalarTower (RingOfIntegers K) K V']
      (h : V →ₗ⋆[K] V →ₗ[K] K) (h' : V' →ₗ⋆[K] V' →ₗ[K] K)
      (L : Submodule (RingOfIntegers K) V) (L' : Submodule (RingOfIntegers K) V'),
      h.IsSymm → h'.IsSymm → IsOrthoLattice h L k → IsOrthoLattice h' L' r →
      mass h' L' = mass h L * ∏ M ∈ Finset.Ico (k + 1) (r + 1), massRatioRightSide K M
```


**Step 10, divisibility lower bound for the `m`-fold lift: partial.** The divisibility vocabulary is concentrated in `Formalism/SharpRestriction/Divisibility` (274 files), `Formalism/ThetaSupremumBounds` and `Formalism/TowerValuationBounds`, and in the `ZetaCharacterDivisibility` folder (at least 40 files, 2,544 lines) of the Galois side, whose top theorem is `seedFinOdd_of` (section 3.2). A valuation-sum bound from the tower file:

`Formalism.ValuationGridEstimates.AbsValuationSumBound` (def), `Formalism/TowerValuationBounds/HermitianSumValuationBound.lean:14`

```lean
def AbsValuationSumBound : Prop
:=
  ∀ (W E : Type) [Fintype E] (lam val δ : W → ℝ) (absx : E → ℝ) (Wx : Finset W) (Bδ : ℝ),
    (∀ w, 0 ≤ lam w) → (∀ w, w ∉ Wx → val w = 0) →
    ∑ w ∈ Wx, lam w * val w = (∑ σ, Real.log (absx σ)) / Fintype.card E →
    (∑ w ∈ Wx, lam w * |val w| =
        (∑ σ, Real.log (absx σ)) / Fintype.card E + 2 * ∑ w ∈ Wx, lam w * max 0 (-val w)) ∧
    (∑ w ∈ Wx, lam w * |val w| ≤
        (∑ σ, Real.posLog (absx σ)) / Fintype.card E + 2 * ∑ w ∈ Wx, lam w * max 0 (-val w)) ∧
    ((∀ w, 0 ≤ δ w) → (∀ w, -(3 * δ w) ≤ val w) → (∀ F : Finset W, ∑ w ∈ F, lam w * δ w ≤ Bδ) →
      ∀ F : Finset W, ∑ w ∈ F, lam w * |val w| ≤
        (∑ σ, Real.posLog (absx σ)) / Fintype.card E ...[cut]
```


`ThmP` and `TheoremM` above are the other candidates. Which of these is "`p^(a/p+...)` divisibility of the `m`-fold lift" is not established.

**Step 13, Bost slope inequality: none by name, partial by content.** `bost` occurs in 0 names; `slope` in 773 names (299 files); `HarderNarasimhan` in 507 names (54 files; `Formalism/HarderNarasimhan`, 366 declarations in `HarderNarasimhanProofs`); `arakelov` in 793 names (90 files, 782 in `ReciprocityTheory/ReductiveGroups/ArithmeticGeometry`). Slopes of lattices (`-log covol / rank`), Harder-Narasimhan filtrations and the Arakelov geometry of the Moriwaki big theorem are present:

`Formalism.F.slope` (def), `Formalism/LatticeSlopes/Statement.lean:25`

```lean
def slope (L : Submodule ℤ E) : ℝ
:= deg L / (rk L : ℝ)
```

`Formalism.HN.hnCor` (theorem), `Formalism/HarderNarasimhan/FinalCor.lean:33`

```lean
theorem hnCor : HNCor
```

cites: `Formalism.HN.hnSum_isLat_mono`, `Formalism.HN.muChar`, `Formalism.HN.hnStep_spec`, `Formalism.HN.hnSlopes`, `Formalism.F.att_rk_le`, `Formalism.HN.hnSum_zl_mono`, `Formalism.HN.muMax`, `Formalism.HN.hnStep` (+2 more)

`ReciprocityTheory.ChartRestriction.G.ArakelovGeometry.MoriwakiBigStatement` (def), `ReciprocityTheory/ReductiveGroups/ArithmeticGeometry/ArakelovGeometry/MoriwakiSt.lean:29`

```lean
def MoriwakiBigStatement : Prop
:=
  ∀ (K : Type) [Fintype K] (ι : K → Type) [∀ k, Fintype (ι k)] (Ω : Type) [Field Ω]
    (y : (Σ k, ι k) → Ω) (D : ℕ) (A : HermLine ι) (P0 : Ideal (MRing ι)) (II : IntersectionSystem),
    IsIntersectionSystem II → IsArithVar (mCoordIdeal y) (D + 1) → Birational y →
    P0 ≤ mCoordIdeal y → IsSemipositiveRel P0 (mCoordIdeal y) A → IsConjInvariantH A →
    NefOnFibres (mCoordIdeal y) A.a → NefOnGeneric (mCoordIdeal y) A →
    II K ι (mCoordIdeal y) (D + 1) (fun _ => A) ≤
      arVolP (IsSmallH (mCoordIdeal y) y A) (chartLat y A.a) 1 D
```

`PositivityTheory.Pf1.HilbertSamuelMoriwaki.hsChain` (theorem), `Development/WeilBound/CoreStatements/AutomorphicKernels/MoriwakiBigness/MoriwakiBigTheorem/HSChain.lean:180`

```lean
theorem hsChain (hResK : ReciprocityTheory.ChartRestriction.G.Geo.ResK.ResKStatement) (hAIS : ReciprocityTheory.ChartRestriction.G.Geo.ArithIntersectionSystemStatement)
    (hDBH : GroundTheory.Heights₂.Heights.IndefiniteRowSideFullHecke.HeightsSet.DenseBoundedHeight.Statement) :
    GroundTheory.Heights₂.Heights.HilbertSamuel.ArithmeticVolumeBig.Statement ∧ GroundTheory.Heights₂.Heights.Targets.MoriwakiBigCurve.Statement ∧
      GroundTheory.Heights₂.Heights.HilbertSamuel.ArithKleiman.Statement ∧ GroundTheory.Heights₂.Heights.HilbertSamuel.G7.Statement ∧
      GroundTheory.Heights₂.Heights.HilbertSamuel.ArithmeticVolumeNef.Statement
```

cites: `GroundTheory.Heights₂.Heights.HilbertSamuel.NefOnGenericOfSemipos.proof`, `GroundTheory.Heights₂.Heights.HilbertSamuel.ChartDenominator.proof`, `GroundTheory.Heights₂.Heights.HilbertSamuel.SectionSupBound.proof`, `GroundTheory.Heights₂.Heights.HilbertSamuel.KodairaSection.proof`, `GlobalTheory.CompanionTheory.Ar.Giv.degreeGeneric_of_degree`, `GlobalTheory.CompanionTheory.Ar.Giv.degree_of_system`, `GlobalTheory.T.kodaira_generic_of_ample_section_count`, `GlobalTheory.T.kleiman_input_nef_ample_section_count` (+183 more)


The statement that an injection of lattices with controlled heights forces a slope inequality is `Formalism/LatticeSlopes` and `HarderNarasimhan`; the slope inequality in the exact form of Bost's theorem was not located.

**Step 14, the 2/3 barrier and "division": none convincing.** No name contains `twoThirds` or a cost-per-lift notion. `Formalism/DivisorInequality` (`DivIneqTopAnchorU.lean`, 616 lines) holds a bookkeeping inequality on constants: `DivisorIneqLarge` asserts it for `Cmax ≥ 11/5` with `C2 ≤ Cmax + 1/2`, and `DivisorIneqFailsAtTwo` exhibits parameters at `Cmax = 2` where it fails. It may be the constants computation behind the barrier, but this is a guess from the names:

`Formalism.DivisorInequality.DivisorIneqTwo` (def), `Formalism/DivisorInequality/DivIneqTopAnchorU.lean:594`

```lean
def DivisorIneqTwo : Prop
:=
  ∀ (Cmax Ch Cth c5 c6 C2 C4 : ℝ), 2 ≤ Cmax → Ch = 184 * Cmax ^ 2 →
    0 ≤ Cth → Cth ≤ Cmax → 0 ≤ c5 → c5 ≤ Cmax → 0 ≤ c6 → c6 ≤ Cmax →
    0 ≤ C2 → C2 ≤ Cmax → 0 ≤ C4 → C4 ≤ Cmax →
      2 * (Cth + c5 + 2 * c6 + 1 + 2 * C2 * (25 + 18) + 2 * C4 * (1 + 25 + 18)) ≤ Ch
```

`Formalism.DivisorInequality.DivisorIneqFailsAtTwo` (def), `Formalism/DivisorInequality/DivIneqTopAnchorU.lean:606`

```lean
def DivisorIneqFailsAtTwo : Prop
:=
  ∃ (Cth c5 c6 C2 C4 : ℝ), 0 ≤ Cth ∧ Cth ≤ 2 ∧ 0 ≤ c5 ∧ c5 ≤ 2 ∧ 0 ≤ c6 ∧ c6 ≤ 2 ∧
    0 ≤ C2 ∧ C2 ≤ 2 + 1 / 2 ∧ 0 ≤ C4 ∧ C4 ≤ 2 ∧
    (184 : ℝ) * 2 ^ 2 < 2 * (Cth + c5 + 2 * c6 + 1 + 2 * C2 * (25 + 18) + 2 * C4 * (1 + 25 + 18))
```


**Step 15, integral structure glued across Hecke characters, gcd: partial.** The integral structures of the Galois side live in `Foundations/GaloisRepresentations/IntegralStructures` (`UpperTheory.Gal.Int`: `GeometricFlagBases` at least 40 files and 3,295 lines, `ZetaCharacterDivisibility`, `CongruenceOddLevel` 8 files and 888 lines). The assembly of the local-global compatibility input is:

`UpperTheory.Gal.Int.Row.galoisLocalGlobal_of_localGlobalCompatibility` (theorem), `Development/AutomorphicArithmetic/Foundations/GaloisRepresentations/IntegralStructures/InertCharpoly/GaloisLocalGlobalOfLocalGlobalCompatibility.lean:192`

```lean
theorem galoisLocalGlobal_of_localGlobalCompatibility (C : CoreAll) (H1 : R1) (H2 : LocalGlobalCompatAtIwahoriFixedPlaces) : Row0 (fun h rc => IsRecT h rc)
```

cites: `UpperTheory.Gal.Int.Row.galoisLocalGlobal_of_placeClassCompatibility`, `UpperTheory.Gal.Int.Row.localGlobalAtPlaceClass_of_localGlobal`, `ReciprocityTheory.Gal.H1`, `ReciprocityTheory.Gal.H2`


No declaration is named for a gcd or a gluing across characters.

**Step 16, relative trace formula, sixfold cover of `GL_5`, Poincaré series, Cauchy-Schwarz: partial.** `relativeTrace|Kuznetsov` occurs in 0 names. `poincareSeries` is in 49 names (24 files) and `metaplectic` in 66 (32 files). Poincaré series paired with Bessel periods:

`GlobalTheory.T.inner_poincareSeries_eq_setIntegral_unfolding` (theorem), `Development/AbelianVarietyTheory/Proofs/DecoratedLatticeProofs/InnerPoincareSeriesEqSetIntegralUnfoldingStatement.lean:13`

```lean
theorem _root_.GlobalTheory.T.inner_poincareSeries_eq_setIntegral_unfolding : ∀ (D : D7) (X : Formalism.L2.SG.HidaSetting.HidaSetting D) (u : D.what₂.Word) (hK : X.LevelSubgroupCharacter) (Dt Fs : Set X.B.I.GA), IsReps X u Dt → InHH X u hK → IsFundamentalDomain (Srat X u) Fs (X.B.I.muA X.B.μf) → ∀ T : Cu X u hK, IntegrableOn (Ph X u hK T) Fs (X.B.I.muA X.B.μf) → ∀ (f : X.B.I.GA → ℂ) (φ : L2X X), RowFun X f → (φ : X.B.I.GA → ℂ) =ᵐ[muX X] f → ⟪star φ, PuFun X u hK Dt T⟫_ℂ = ∫ x in Fs, f x * Ph X u hK T x ∂(X.B.I.muA X.B.μf)
```

cites: `GlobalTheory.Core.Mi.inner_pser_eq_setIntegral`

`GlobalTheory.T.conjugateRow_pairing_poincareSeries_besselPeriods` (theorem), `Development/AbelianVarietyTheory/Proofs/DecoratedLatticeProofs/ConjugateRowPairingPoincareSeriesBesselPeriodsStatement.lean:13`

```lean
theorem _root_.GlobalTheory.T.conjugateRow_pairing_poincareSeries_besselPeriods : ∀ (D : D7) (X : Formalism.L2.SG.HidaSetting.HidaSetting D) (h : X.B.I = Formalism.L2.SG.InstExistsPf.instOf D) (u : D.what₂.Word) (ψ : AddChar (AF D.host.F) ℂ) (A : HSp D) (B : SBes X h u ψ A) (Y : Formalism.L2.SG.Full.Full X), IsStdChar D ψ (-1) → InHH X u Y.hK → B.PerLaw Y
```

cites: `GlobalTheory.Core.Mi.perLaw_holds`


`Development/AbelianVarietyTheory/PublishedTheorems/TwistedTraceFormula` (97 files) holds twisted trace formula inputs; the cover of `GL_5` and its automorphy of `μ` were not found by name.

**Step 18, covolumes, theta-series index, congruences between lifts and forms: partial.** Covolumes of lattices are in `ReciprocityTheory/GeometryOfNumbers/LatticeCovolumes` and in `Formalism/LatticeSlopes`:

`ReciprocityTheory.GeometryOfNumbersTheory.covol_div_covol_eq_relIndex` (theorem), `ReciprocityTheory/GeometryOfNumbers/LatticeCovolumes/CountStA.lean:11`

```lean
theorem covol_div_covol_eq_relIndex {E : Type*} [NormedAddCommGroup E] [NormedSpace ℝ E]
    [FiniteDimensional ℝ E] [MeasurableSpace E] [BorelSpace E] (μ : Measure E)
    [μ.IsAddHaarMeasure] (L₁ L₂ : Submodule ℤ E) [DiscreteTopology L₁] [IsZLattice ℝ L₁]
    [DiscreteTopology L₂] [IsZLattice ℝ L₂] (h : L₁ ≤ L₂) :
    ZLattice.covolume L₁ μ / ZLattice.covolume L₂ μ =
      L₁.toAddSubgroup.relIndex L₂.toAddSubgroup
```

cites: (Mathlib only)

`Formalism.F.covol` (def), `Formalism/LatticeSlopes/Statement.lean:15`

```lean
def covol (L : Submodule ℤ E) : ℝ
:=
  if h : DiscreteTopology L then
    haveI := h
    Real.sqrt (Matrix.gram ℝ (fun i => ((Module.finBasis ℤ L i : L) : E))).det
  else 0
```


Congruences are in `CongruenceOddLevel` (`congFinOdd_of_ex`, section 3.2). The index of a theta series was not found.

### D. The arithmetic residue

**Step 11, Iwasawa tower via pigeonhole: partial.** `iwasawa` occurs in 952 names but those are the Iwasawa *decomposition* `G = KAN` (`Iwasawa[A-Z]` 289 names, `Formalism/SatakeDualWeyl/AdelicIwasawaHecke`), not a tower. Towers of fields are `Formalism/TameInertiaTowers` (15 files, 3,127 lines: 2-adic cyclotomic layers `IsLayer n q d ζ a b` with `q % 8 = 3`, `d % 8 = 7`) and `Formalism/TowerValuationBounds`. `tower` is in 3,760 names (1,243 files).

**Step 19, Behrend: located.** `Formalism/BehrendSets` (14 files, 1,074 lines) states a Behrend-type three-term-progression-free set and a thickened version:

`Formalism.BehrendSets.BehrendFree` (def), `Formalism/BehrendSets/Statement.lean:48`

```lean
def BehrendFree (K : ℕ) (T : Finset ℕ) : Prop
:=
  ∀ α β γ : ℤ, α ≠ 0 → β ≠ 0 → γ ≠ 0 → α + β + γ = 0 →
    |α| ≤ (K : ℤ) → |β| ≤ (K : ℤ) → |γ| ≤ (K : ℤ) →
    ∀ x₁ ∈ T, ∀ x₂ ∈ T, ∀ x₃ ∈ T,
      α * (x₁ : ℤ) + β * (x₂ : ℤ) + γ * (x₃ : ℤ) = 0 → x₁ = x₂ ∧ x₂ = x₃
```

`Formalism.BehrendSets.BehrendBound` (def), `Formalism/BehrendSets/Statement.lean:54`

```lean
def BehrendBound : Prop
:= ∃ C : ℝ, 0 < C ∧ ∀ K N : ℕ, 1 ≤ K → 1 ≤ N →
  ∃ T : Finset ℕ, T ⊆ range N ∧ BehrendFree K T ∧
    (N : ℝ) * Real.exp (-C * Real.sqrt (Real.log N * Real.log ((K : ℝ) + 1))) ≤ (T.card : ℝ)
```

`Formalism.BehrendSets.ThickSet` (def), `Formalism/BehrendSets/Statement.lean:58`

```lean
def ThickSet : Prop
:= ∃ C : ℝ, 0 < C ∧ ∀ n L : ℕ, 1 ≤ L → 8 * L ≤ n →
  ∃ T : Finset ℕ, (∀ t ∈ T, 8 * L * t < n) ∧ BehrendFree (2 * L) T ∧
    (n : ℝ) / (8 * L) * Real.exp (-C * Real.sqrt (Real.log n * Real.log (2 * (L : ℝ) + 1)))
      ≤ (T.card : ℝ)
```

`Formalism.BehrendSets.TrivStab` (def), `Formalism/BehrendSets/StatementE.lean:89`

```lean
def TrivStab : Prop
:= ∀ (E : Type) [Field E] [NumberField E] (k g : ℕ), g.Prime →
  Module.finrank ℚ E * k < g - 1 →
  ∀ Γ : Subgroup (GL (Fin k) E), Finite Γ → IsPGroup g Γ → Γ = ⊥
```


`BehrendBound` has the Behrend shape `N exp(-C √(log N log(K+1)))`. `TrivStab` (a finite `g`-subgroup of `GL_k(E)` is trivial once `[E:Q] k < g - 1`) is an input from `StatementE.lean`; how the sets enter the tower choice is not visible from the statements.

**Step 17, Vandiver, `H^1(o_E[1/ℓ], Q_ℓ/Z_ℓ(-e))`: none.** `vandiver` occurs in 0 names and 0 paths. Galois `H^1` classes are in `Formalism/WachLatticeTwists/SandwichH1Classes` and in a statement:

`Formalism.MainNotions.ModuliIntegralCharts.H1.H1algStatement` (def), `Formalism/SharpRestriction/Divisibility/GeneratorPowers/H1algStatement.lean:20`

```lean
def H1algStatement : Prop
:=
  ∀ (L : SizeData₂ D) (P : ParameterChoice' D L) (Tp : ParamsT D L P) (hK : DV.KapDef D) (T : Top D) (h : LawsP T)
    (hinj : Function.Injective D.what₂.OtoLL) (EX : ErrX D) (H : WeightAlgebra.KHyp) (C2 A2 CR : ℝ) (j : ℕ) (hj : InR D j),
    j < D.R.m →
    (letI := T.Q.H.starRing; IntChartEx (T.Q.Xo j) T.Q.c) →
    (letI := T.Q.H.starRing; ChartSaturated (T.Q.Xo j) T.Q.c) →
    (∀ i, T.Q.l.Mb ≤ Ideal.span {piBarO EX i}) →
    (∃ τ : D.host.E →+* ℂ, InPsi T.Q.H τ ∧
      ∀ x : 𝓞 D.host.E, ((iE D hinj (recB h.toLawsCore) x : 𝓞 T.Q.c.F) : T.Q.c.F) = embK T.Q.c τ x) →
    WeightAlgebra.H3 L H C2 A2 CR 0 (lR Tp hK j) Tp.TO →
    (|(NumberField.discr D.host.E : ℝ)| ^ ...[cut]
```


This is not a weak Vandiver statement as far as the statement shows.

### E. The final theorem

**Step 20, GRH.** Located exactly; see section 3.

`claimAll` (theorem), `Supplements/Kernels/MainTheorems.lean:15`

```lean
theorem claimAll : Claim.HalfPlane ∧ Claim.Strip ∧ Claim.Zeta
```

cites: `Claim.strip`, `Claim.zeta`, `allChi`

`critAll` (theorem), `Supplements/Kernels/MainTheorems.lean:11`

```lean
theorem critAll (N : ℕ) [NeZero N] (χ : DirichletCharacter ℂ N) (hχ : χ.IsPrimitive) (s : ℂ)
    (h0 : 0 < s.re) (h1 : s.re < 1) (hz : LFunction χ s = 0) : s.re = 1 / 2
```

cites: `Formalism.VW.critLine`, `allChi`


### Search terms, with counts

Name hits are declaration names (case-insensitive, counted on the index), files are distinct files, "top" are the three directories with most hits at depth 3.

| Term | Name hits | Files | Where they concentrate |
|---|---:|---:|---|
| `stepanov` | 0 | 0 | none |
| `determinant` | 2,361 | 528 | `Formalism/BranchSandwichDivisors` 428, `Formalism/FormalDegreeBessel` 329, `AbelianVarietyTheory/Proofs` 252 |
| `weil` | 14,881 | 3,332 | `AbelianVarietyTheory/Proofs` 4,897, `WeilBound/CoreStatements` 4,316, `AutomorphicArithmetic/Foundations` 1,871 |
| `positiv` | 48,337 | 6,429 | `WeilBound/RepresentationTheoryGL` 18,940, `WeilBound/CoreStatements` 17,579, `WeilBound/ThetaLifts` 6,421 |
| `explicitFormula` | 24 | 13 | `AbelianVarietyTheory/Proofs` 12, `PeriodIntegrals/UnitaryGroupMassFormula` 4, `PeriodIntegrals/ExplicitFormula` 2 |
| `guinand` | 0 | 0 | none |
| `vonMangoldt` / `mangoldt` | 51 / 84 | 28 / 36 | `AbelianVarietyTheory/Proofs`, `LandauZeroFreeBounds/ExceptionalZeroBounds` 12 |
| `theta` | 20,901 | 6,771 | `AbelianVarietyTheory/Proofs` 11,485, `HeightsAndTheta/Theta` 1,446, `AutomorphicSpectrum/Proofs` 1,189 |
| `thetaLift` / `tLift` | 1,196 | 456 | `AbelianVarietyTheory/Proofs` 670, `AutomorphicArithmetic/AutomorphicVarieties` 66, `ThetaLiftIndependence` 43 |
| `howe` | 982 | 248 | `AbelianVarietyTheory/Proofs` 861, `AutomorphicArithmetic/ThetaCorrespondence` 47 |
| `seesaw` | 268 | 193 | `AbelianVarietyTheory/Proofs` 258 |
| `rallis` | 259 | 71 | `AbelianVarietyTheory/Proofs` 97, `AutomorphicArithmetic/ThetaCorrespondence` 93, `PublishedTheorems` 20 |
| `bessel` | 2,640 | 805 | `AbelianVarietyTheory/Proofs` 974, `SharpRestriction/CuspSpanNormBounds` 622 |
| `period` | 4,889 | 2,087 | `AbelianVarietyTheory/Proofs` 2,781 |
| `GGP` / `GanGross` | 51 | 15 | `PeriodIntegrals/BesselPeriodGGP` 20 |
| `unitary` | 16,455 | 4,734 | `PeriodIntegrals/UnitaryGroupMassFormula` 6,249, `AbelianVarietyTheory/Proofs` 4,155 |
| `definite` | 20,866 | 2,127 | `AbelianVarietyTheory/BlockTheory` 14,126, `HeightsAndTheta/Heights` 5,031 |
| `hermitian` | 10,308 | 2,132 | `GL3MeanSquares/GenusMeanAsymptotics` 2,626, `FlagUnipotentLattices/MinkowskiFactorialBounds` 1,116 |
| `siegel[A-Z]` | 8,610 | 1,336 | `WeilBound/CoreStatements` 4,368, `AutomorphicArithmetic/Foundations` 1,815 |
| `massFormula` | 5,966 | 740 | `PeriodIntegrals/UnitaryGroupMassFormula` 5,551 |
| `chowla` / `selberg` | 336 / 667 | 71 / 147 | `HeightsAndTheta/Heights/ChowlaSelberg` 324; `selberg` also `AutomorphicSpectrum/Proofs` 290 |
| `slope[A-Z]` | 773 | 299 | `AbelianVarietyTheory/Proofs` 177, `SizeWindowBrackets/ChainSlopeWindows` 99 |
| `bost` | 0 | 0 | none |
| `arakelov` | 793 | 90 | `ReciprocityTheory/ReductiveGroups/ArithmeticGeometry` 782 |
| `poincareSeries` | 49 | 24 | `AbelianVarietyTheory/Proofs` 21, `UnitaryGroupMassFormula` 16, `SiegelLatticeTheory` 11 |
| `relativeTrace` / `Kuznetsov` | 0 | 0 | none |
| `metaplectic` | 66 | 32 | `AbelianVarietyTheory/Proofs` 23, `PublishedTheorems` 19 |
| `iwasawa` | 952 | 341 | `AbelianVarietyTheory/Proofs` 446 (Iwasawa decomposition) |
| `tower` | 3,760 | 1,243 | `AbelianVarietyTheory/Proofs` 1,155, `WeilBound/CoreStatements` 763 |
| `behrend` | 89 | 14 | `Formalism/BehrendSets` 89 |
| `vandiver` | 0 | 0 | none |
| `heckeChar` | 771 | 265 | `GlobalFields/TateThesis` 262, `AbelianVarietyTheory/Proofs` 198 |
| `CM` forms (`CMType`, `IsCMField`, ...) | 5,823 | 1,710 | `AbelianVarietyTheory/Proofs` 2,228 |
| `parseval` | 173 | 77 | `AbelianVarietyTheory/Proofs` 59, `AutomorphicSpectrum/Proofs` 59 |
| `quadric` | 69 | 25 | `AbelianVarietyTheory/Proofs` 46 |
| `riemannHypothesis`, `rhOfAll`, `allChi`, `claimAll`, `critAll` | 1 each in `Supplements/Kernels/MainTheorems.lean` and `Main.lean` | | section 3 |

Summary of verdicts: **located** 5, 6, 7, 8, 9, 12, 19, 20 (8 steps); **partial** 1, 2, 3, 4, 10, 11, 13, 15, 16, 18 (10 steps); **none** 14, 17 (2 steps). Names that occur nowhere in the tree: Stepanov, Guinand, Bost, Vandiver, relative trace (Kuznetsov).


## 5. Reading plan

The tree has no documentation, so the plan follows the import spine from `rhOfAll` backward and puts the short statement files first. Line counts are from the index. "Statements to understand" are named in section 3.2 or 4. Readers 1 to 3 cover the spine; readers 4 and 5 cover the inputs that the spine takes from outside the new argument and can be done with pointers to the literature. The directory sizes marked "at least" come from a query that was capped at 40 files.

**Reader 1: assembly and the analytic endgame (from `Main` to the zero-free statement).** Theme: how `EveryCharacter` becomes RH, why a one-sided bound on a smoothed prime sum suffices, and what exactly `ZeroFreeAll` needs. About 2,100 lines.
1. `Main.lean` (12), `Statements.lean` (16), `Supplements/Kernels/MainTheorems.lean` (16), `MainTheoremsAll.lean` (2), `MainTheoremsCritical.lean` (4).
2. `Formalism/GammaFactorNonvanishing/CritLine.lean` (32), `RhOfRight.lean` (62).
3. `Development/AutomorphicArithmetic/CharacterBoxes/`: `HalfPlane.lean` (10), `EveryCharacter.lean` (18), `Imprimitive.lean` (35), `ZeroFreeAllOfTopG.lean` (38), `MainConclusion.lean` (14), `ClaimStrip.lean` (104), `ExistsPageN.lean` (81), `RiemannHypothesisOfEveryCharacter.lean` (231).
4. `Formalism/Statement.lean` (50), `StatementOC.lean` (73), `ZetaNonvanishing/RHofHalfPlane.lean` (61), `LandauLemma.lean` (327), `ZetaRealNonvanish.lean` (80).
5. `Formalism/SharpRestriction/RamificationFrobenius/TotientGaloisClasses/`: `ExplicitFormulaErrorOfHostConditions.lean` (168), `TopWin.lean` (140), `PrimePairSizeCondition.lean` (132).
6. `Formalism/SizeWindowBrackets/GrowthBoundGivesRiemannHypothesis.lean` (183), `FixedEpsilonConcreteGrowthBound.lean` (144); `Formalism/PeriodIntegrals/ExplicitFormula.lean` (28).
Statements to understand: `EveryCharacter`, `Formalism.G`/`S`, `LandauStep`, `RHofG`, `ZeroFreeOn`/`ZeroFreeAll`, `ChebyshevInequalityOnWindows`, `TopG`, `HostExW`, `VWinAt`, `GrowthBoundGivesRiemannHypothesis`. Optional: `Formalism/ZeroFreeRegion` (34 files, 3,189 lines) and `LandauZeroFreeBounds` (at least 40 files, 4,953 lines) as the classical comparison.

**Reader 2: the theta-integral assembly and the unitary-group inputs.** Theme: `every_character_of_theta_integrals_local_matching`, the Siegel-Weil, Rallis and seesaw inputs, definite-side hypotheses, mass formulas, GGP periods. About 2,100 lines to start.
1. `Development/AutomorphicArithmetic/ThetaCorrespondence/ThetaPairLifts/ThirdPlaceSeries/`: `TopPlug.lean` (19), `SiegelEisensteinSecondTermHypotheses.lean` (76), `At23OfAll.lean` (28), `EveryCharacterOfLiteratureOfVWin.lean` (814; read the 20 `..._of_literature` statements, not the proofs).
2. `Formalism/HermitianLattices/StatementMass.lean` (90), `Formalism/PeriodIntegrals/BesselPeriodGGP.lean` (122).
3. `Development/AbelianVarietyTheory/Proofs/DecoratedLatticeProofs/`: `SeesawFubiniTwoLiftsModerateGrowthKernels.lean` (138) and the files named `Rallis...`, `ThetaInnerProductFormulaDefinite...`, `...Poincare...`.
4. `Formalism/ThetaLiftIndependence/` (10 files, 802 lines), `Formalism/ThetaSupremumBounds/Statement*.lean`, then the directory `Development/WeilBound/ThetaLifts` (788 files).
Statements to understand: `every_character_of_theta_integrals_local_matching`, `ThetaIntegralsAgree`, `LocalMatching`, `UnitaryGroupThirdPlaceHypotheses`, `SiegelMassRatio`, `MassTelescope`, `InterlacingCondition`, `chainOp`, `Green`.

**Reader 3: theta-lift existence and the Galois-representation side (`TLiftK`, `Row0b`, integrality).** Theme: the multiplicity-by-lifting engine and the integral and divisibility bookkeeping. About 1,500 lines to start, then the large folders.
1. `Foundations/GaloisRepresentations/IntegralStructures/`: `RowSrc.lean` (8), `GaloisRepresentationsOfThetaLift.lean` (8), `Development.lean` (33); `TypeConditions/WeightsConjBis.lean` (88).
2. `Foundations/GaloisRepresentations/ThetaParseval/`: `ThetaKernels/TLiftK.lean` (5), `ThetaKernels/TPGHolds.lean` (60), `ThetaKernels/GalTPDefs.lean` (180), `SchurStep.lean` (310), `HalfIndexLattices/TLiftK.lean` (27).
3. `IntegralStructures/GeometricFlagBases/` (at least 40 files, 3,295 lines; start with `WeightOneGeometricRealization.lean`, `GeometricRealizationOfWeightOne.lean`, `GeoOneOfParts.lean`, `HodgeTrAt.lean`), `ZetaCharacterDivisibility/` (at least 40 files, 2,544 lines; `SeedFinOddOf.lean`, `MainFin.lean`), `CongruenceOddLevel/` (8 files, 888 lines), `WeightCharacters/TopOf.lean`.
4. The p-adic residue in `Formalism`: `IncomingBounds/StatementThmP.lean` (74), `MahlerMeasure/StatementTM.lean` (98), `GaussJetBounds`, `DivisorInequality/DivIneqTopAnchorU.lean` (616), `TameInertiaTowers` (3,127 lines), `BehrendSets` (1,074 lines), `TowerValuationBounds`, `SharpRestriction/Divisibility` (274 files).
Statements to understand: `Row0b`, `TLiftK`, `IsLift`, `GeoOne`, `seedFinOdd_of`, `congFinOdd_of_ex`, `ThmP`, `TheoremM`, `DivisorIneqSharp`, `BehrendBound`, `TrivStab`.

**Reader 4: the automorphic window `VWin` and base change.** Theme: what `VWin` says and how `OpenImageCondition` and `BaseChangeIsobaricN` give it. About 600 lines to start, then `FrameMatching`.
1. `Development/AutomorphicArithmetic/AutomorphicVarieties/ModularityArgument/ThresholdArguments/DenseThresholdCases/`: `VwinOfRow.lean` (5), `TopMainZj.lean` (75), `TemperedProductOfSquareIntegrable.lean` (344).
2. `Foundations/BaseChangeIdentities/`: `DefiniteNHolds.lean` (6), `FillPre.lean` (9), `FrameMatching/` (at least 40 files, 2,437 lines); `Development/WeilBound/RepresentationTheoryGL/ArchimedeanBaseChange/ArchimedeanBaseChangeProof/BaseChangeIsobaricNOf.lean` (135) and `SatakeExponents/BciOf.lean` (28).
3. The rest of `CharacterBoxes` (37 files, 2,935 lines in all: `PairRows.lean` 387, `WinPairs.lean`, `DesWin.lean`, `DesignS.lean`, `ShapeWin.lean`, `SupplyChi.lean`), then `Formalism/SizeWindowBrackets` and `Formalism/LocalToGlobal`.
Statements to understand: `VWin`, `VWinAt`, `OpenImageCondition`, `BaseChangeIsobaricN`, `automorphic_window_of_inputs`.

**Reader 5: published inputs (arithmetic geometry, local Langlands, Galois cohomology).** Theme: checking that the theorems taken from the literature are the standard ones. About 1,300 lines to start.
1. `EveryCharacterOfLiteratureOfVWin.lean` lines 250 to 790, the `..._of_literature` statements (Fargues exactness, Zarhin, Nadel vanishing, principalisation, formal algebraisation, Grothendieck deformation, toroidal compactifications).
2. Moriwaki bigness and Poincare-Lelong: `Development/WeilBound/CoreStatements/AutomorphicKernels/MoriwakiBigness/MoriwakiBigTheorem/Outright.lean` (17), `HSChain.lean` (380), `ReciprocityTheory/ReductiveGroups/ArithmeticGeometry/ArakelovGeometry/MoriwakiSt.lean` (38); `GroundTheory/HeightsAndTheta/Heights` (6,348 files; `HilbertSamuel`, `ChowlaSelberg`).
3. Local Langlands and Artin reciprocity: `Foundations/LocalLanglands/IsRecTOfIsRec.lean` (116), `LocalCentralUnits/RecTExists.lean` (66), `GlobalTheory.globalArtinReciprocity_holds`, `GlobalTheory.Published.chevalleyUnits'`; Green's theorem `Development/AbelianVarietyTheory/Definitions/NonGaloisDescent/LabelDatum.lean` (118).
Statements to understand: `OpenLiteratureStatements`, `MoriwakiBigStatement`, `PoincareLelong`, `RecTExists`, `Green`, `HolomorphicLefschetzFormula`.

Suggested order of work: readers 1 and 3 first (they define what is new), reader 2 and 4 next, reader 5 last and in the background. Reader 3's folders are large (`Foundations/GaloisRepresentations` alone has 2,965 files); ask the reader to follow `spine.py` from each named statement and not to read folders end to end.


## 6. Tool notes

All scripts are in `tools/lean/`, take the tree root and the cache path as arguments and hard-code no paths. Run them with the project interpreter as below (`-I` isolates from the environment, `-B` avoids bytecode files, `-X utf8` is needed for Lean's Unicode on the Windows console; the scripts add their own folder to `sys.path`). They only read files under `--root`; nothing is executed from the tree.

```
PY=".cache/venv/Scripts/python.exe"
SRC="sources/riemann/lean/lean/src"
CACHE=".cache/lean-index"

# 1. Index once (about 2.5 minutes for 175,187 files on 8 workers, warm disk cache)
$PY -I -B -X utf8 tools/lean/index.py --root "$SRC" --cache "$CACHE" [--workers 8] [--subdir Formalism] [--limit N]

# 2. Import closure and reachability by directory (10 s)
$PY -I -B -X utf8 tools/lean/closure.py --cache "$CACHE" --start Main --prefix-depth 2

# 3. Search statements, names, paths (8 to 10 s per query)
$PY -I -B -X utf8 tools/lean/grep.py zeroFree --cache "$CACHE" --fields name,path --depth 3 --top 20 --in-closure
$PY -I -B -X utf8 tools/lean/grep.py --regex "ZeroFree.*Above" --cache "$CACHE" --fields name,stmt --kinds theorem,def

# 4. Trace a declaration (12 to 21 s: most of it is loading the index into memory)
$PY -I -B -X utf8 tools/lean/spine.py rhOfAll allChi --cache "$CACHE" --root "$SRC" --depth 6 --fanout 8 --max-nodes 200 --stmt --md [--body]
```

**`index.py`.** One pass with a multiprocessing pool. Reads each file as bytes, blanks comments and string literals (offsets preserved), then finds declarations, `namespace`/`section`/`end`, and `open` lines with regular expressions (`leanparse.py`). Writes `CACHE/index.sqlite` (797 MB, 138 s measured; the first cold read of the tree was much slower, about 11 minutes for a grep pass, because of the file system). Tables: `files` (path, module, top directory, size, lines, counts of doc/module-doc/block/line comments, first module doc, counts of the eight tokens, number of declarations and imports), `imports` (909,822 edges), `decls` (1,061,425 rows: kind, qualified name, line, statement end line, body end line, namespace, open-list id, statement text capped at 1,500 characters, preceding doc comment, private flag, character offsets of the keyword line, statement end and body end), `ctx` (deduplicated `open` lists), `flags` (up to 5 example lines per token and file; empty here), and after `closure.py` the tables `closure` and `closure_start`. Statements are stored whitespace-collapsed; `spine.py` re-reads the file by offsets so printed statements are verbatim. A listing file (`--listing`) is supported, but the `lean-listing.txt` in `sources/riemann` contains 394 lines that are not valid UTF-8 (for example `lift_levelP_alt\xe2\202\202.lean`, a mangled subscript), so the tree walk (default) was used.

**`closure.py`.** Breadth-first over `imports`, starting at a module name; records depth in `closure`; reports reached and unreached files by directory and lists external top-level packages. Result for `Main`: 175,187 of 175,187 files reached (0 unreached), maximum depth 43.

**`grep.py`.** Substring (all terms must occur, `--any` for one) or regex search over joined fields `name`, `stmt`, `doc`, `path` (`--fields moddoc` searches module docs). Prints hits by directory prefix (`--depth`) as declaration and file counts, then the top declarations ranked by name hit, statement hit, theorem kind, shorter statement. `--in-closure` needs `closure.py` to have run.

**`spine.py`.** Described in its docstring and in section 3.3. Reads the body between the end of the statement and the next column-0 command, collects identifiers, resolves each under the namespace chain and `open` list of the declaration (a leading `_root_.` pins the root), and keeps only declarations in the import closure of the declaration's own module (private names only within their file). Ranking and fan-out cap as in 3.3. How reliable it is: see the end of 3.3 (eight declarations spot-checked by hand, one systematic miss found and fixed; no spurious references seen in the sample).

**Blind spots of the index.**
- Declarations are found only where a keyword starts a line (after attributes and modifiers). `example`, `macro`, `notation`, `syntax`, structure fields, constructors of `inductive` types and instance bodies are not indexed as declarations. 20 anonymous instances get the name `instance@<line>`.
- A statement ends at the first `:=`, `where`, a line-leading `|`, or a following command at depth 0 of brackets. 819 declarations have an empty statement (a bare `def X := ...` or `abbrev`), and 4,704 statements were cut at the 1,500-character cap.
- Body end is the next column-0 command keyword, so a body that contains an unindented non-command line runs on: 29 declarations have a body longer than 500 lines (maximum 8,000), which may include following text.
- Namespace tracking pops one entry on every `end`; a `section` without a matching `end`, or an `end` that closes something other than a section or namespace, would shift the namespace of the following declarations. `open ... in` applies to the next declaration only. `export`, `variable` and `universe` are ignored. Names declared with `_root_.` and `private` are handled as written (private names are not mangled).
- Token counts use word boundaries on comment-free text: `decide +native` and attribute forms are not seen; here every count is 0 and the raw `grep` agrees.
- 1,061,425 is a count of regex matches, not of Lean constants: declarations generated by `deriving`, `structure` projections and `instance` names that Lean auto-generates are not in it.


## Appendix A. Every depth-2 directory (except the 167 one-file folders of `Lemmata`)

Format: path, files, lines. All files in all of these directories are reached from `Main`.

```
CompanionTheory/AutomorphicTheory                                                 457     47957
CompanionTheory/EightfoldTheory                                                     9         9
CompanionTheory/HarishChandraModules                                              130     20874
CompanionTheory/RealGroups                                                        155     15797
CompanionTheory/SpectralGeometry                                                 1254    105437
CompanionTheory/ThickeningEstimates                                                22      4144
Development/AbelianVarietyTheory                                                99187   8142960
Development/AutomorphicArithmetic                                               18431   1776375
Development/AutomorphicSpectrum                                                 15147   1195844
Development/DiscreteGroups                                                        215     23703
Development/EtaleCohomology                                                      1398    104525
Development/ResolutionOfSingularities                                             499    140709
Development/WeilBound                                                            7051    848547
Formalism/AdicCompletionExports                                                     3       202
Formalism/AdmissibleDesigns                                                        93     20476
Formalism/AlgebraicWeights                                                          2       228
Formalism/AlphaUniqueness                                                           1        97
Formalism/ArtinHasse                                                                2       513
Formalism/BehrendSets                                                              14      1074
Formalism/BranchSandwichDivisors                                                   22      7889
Formalism/CMTypeGalois                                                             14      1724
Formalism/CharacterColumnKernels                                                   54      7550
Formalism/CoboundaryTransfers                                                      16      2074
Formalism/ConjugateSelfDual                                                         3       146
Formalism/CorankShare                                                               3       563
Formalism/CyclotomicNorms                                                          21      3643
Formalism/DegreeFormula                                                             5       902
Formalism/DirichletDensity                                                          8      1012
Formalism/DistinguishedUnitIdeals                                                  44     14285
Formalism/DivisorInequality                                                         5      1411
Formalism/DoubleCosetMeasures                                                      15      3487
Formalism/DropLevelBounds                                                           4       366
Formalism/EisensteinCokernelLengths                                                12      1201
Formalism/EllipticTorsion                                                          48      8816
Formalism/FilteredPoleLength                                                       36      4117
Formalism/FlagUnipotentLattices                                                    77     31383
Formalism/FockGram                                                                 14       773
Formalism/FormalDegreeBessel                                                       31      5655
Formalism/FormalGroupLog                                                            5       935
Formalism/FormalGroupWitt                                                          21      3000
Formalism/FrobeniusBaseCase                                                        12      1962
Formalism/FrobeniusContraction                                                     13      1539
Formalism/FrobeniusOrbits                                                          32      7736
Formalism/GL3MeanSquares                                                          440     78320
Formalism/GaloisCohomology                                                          6       400
Formalism/GaloisIrreducibility                                                     17      1661
Formalism/GammaFactorNonvanishing                                                   2        94
Formalism/GaussIdealIdentity                                                        2       275
Formalism/GaussJetBounds                                                           90     13581
Formalism/GaussValuationBounds                                                     16      1914
Formalism/GelfandTransference                                                       7       793
Formalism/GradedWeylDivisibility                                                  103      8125
Formalism/GrowthSums                                                               14       847
Formalism/HalfLinks                                                                 1       186
Formalism/HarderNarasimhan                                                         43     10412
Formalism/HermitianCurvature                                                     1922    460802
Formalism/HermitianLattices                                                        43      7418
Formalism/HyperbolicPlaceProducts                                                  14      1895
Formalism/IncomingBounds                                                           21      3742
Formalism/JacobiWeightFamilies                                                      2       209
Formalism/JacquetSubsetSums                                                         2       149
Formalism/JumpKernelCokernel                                                       27      1694
Formalism/LFunctionBounds                                                           7       988
Formalism/LagrangeIdealLifts                                                        9      1437
Formalism/LandauZeroFreeBounds                                                     58      6579
Formalism/LatticeLocalGlobal                                                        2       216
Formalism/LatticeRigidity                                                          12      1130
Formalism/LatticeSlopes                                                            18      1977
Formalism/LatticeTheta                                                             14      1106
Formalism/LocalRingCardinality                                                    173     35348
Formalism/LocalToGlobal                                                          5501    955843
Formalism/LogFactorialBounds                                                        5       371
Formalism/LogFactorialIndices                                                      11      1403
Formalism/LogSumExpBounds                                                          16      1744
Formalism/LogVandermondeBounds                                                     26      3995
Formalism/MahlerMeasure                                                            54     16821
Formalism/MeanHeightDescent                                                        24      3013
Formalism/MirabolicMackeyTheory                                                    26      4636
Formalism/MoebiusJetDuality                                                         5       384
Formalism/MonomialMeanResidues                                                      6      1175
Formalism/NormUnitaryBounds                                                        14      2086
Formalism/PadicSubsetSums                                                          82     15796
Formalism/PairingDivisors                                                           7       700
Formalism/PeriodIntegrals                                                        4350    451856
Formalism/PieriBlockIdeals                                                         98     29254
Formalism/PolynomialDimension                                                      41     15760
Formalism/PrimeAboveExistence                                                       1        76
Formalism/ProductFormula                                                            1       162
Formalism/QuotientMetricDivisors                                                   63     15247
Formalism/RankGapBounds                                                            17      1967
Formalism/RealPlaceAnalysis                                                        54     10653
Formalism/ResultantValuation                                                       13       842
Formalism/SatakeDualWeyl                                                           85     14777
Formalism/SelfDualUnimodular                                                        6       822
Formalism/SharpRestriction                                                       3093    709436
Formalism/SizeWindowBrackets                                                       64     28345
Formalism/SmithDeterminants                                                         6       403
Formalism/SobolevGaussianKernels                                                   12       578
Formalism/SubspaceCounting                                                         32      7069
Formalism/SuccessiveMinima                                                         15      1693
Formalism/TameInertiaTowers                                                        15      3127
Formalism/ThetaLiftIndependence                                                    10       802
Formalism/ThetaLogCoordinates                                                     292     54555
Formalism/ThetaSupremumBounds                                                      19      3287
Formalism/ThickAverageLoss                                                          5      1079
Formalism/TorsionNormIteration                                                     15      2644
Formalism/TowerValuationBounds                                                      4      1547
Formalism/TranslateCocycles                                                         7      1952
Formalism/TruncatedSeriesCounting                                                  39      3676
Formalism/TwistFamilyExistence                                                      1        87
Formalism/UnipotentAdelicQuotients                                                 44      4570
Formalism/WachLatticeTwists                                                       262     38367
Formalism/WachModuleLifts                                                           9      1239
Formalism/WeaklyAdmissibleFiltrations                                              20      2416
Formalism/WeightedDeltaMeans                                                        2       241
Formalism/WideWeightTheorem                                                         1        85
Formalism/WindowSums                                                               11      1002
Formalism/YangianSpanCharacter                                                     17      1132
Formalism/ZeroFreeRegion                                                           34      3189
Formalism/ZetaNonvanishing                                                         15      2338
GroundTheory/ArithmeticGeometry                                                   218     45046
GroundTheory/AutomorphicForms                                                     542    150005
GroundTheory/Brauer                                                                20      4723
GroundTheory/FunctionField                                                         12      3849
GroundTheory/GlobalFields                                                         384     72305
GroundTheory/HeightsAndTheta                                                     6410    641322
GroundTheory/IdeleRoots                                                            10      1870
GroundTheory/LocalFields                                                          159     40767
GroundTheory/PAdicHodge                                                           226     64317
GroundTheory/PowerSubgroups                                                        20      1277
GroundTheory/ProfiniteCohomology                                                  450     84902
GroundTheory/TateCohomology                                                        56      8755
PositivityTheory/AutomorphicForms                                                 445     54970
PositivityTheory/PublishedTheorems                                                  3       105
PositivityTheory/Representations                                                    1        55
ReciprocityTheory/AdeleApproximation                                                1       178
ReciprocityTheory/AdicCompleteness                                                  1       111
ReciprocityTheory/AnalyticForms                                                   192     36680
ReciprocityTheory/Automorphisms                                                     4       461
ReciprocityTheory/BasicDefinitions                                                  2       136
ReciprocityTheory/BurnsideSurjectivity                                              1       178
ReciprocityTheory/Chebotarev                                                       47      4382
ReciprocityTheory/ClassFieldTheory                                                 91     11830
ReciprocityTheory/CommutativeAlgebra                                               26      3014
ReciprocityTheory/DualLattices                                                    183     24554
ReciprocityTheory/EigenFrames                                                       2       136
ReciprocityTheory/GaloisValuations                                                  9      1866
ReciprocityTheory/GeneralLinearIntegers                                             1        34
ReciprocityTheory/GeometryOfNumbers                                                39      5256
ReciprocityTheory/GroupCohomology                                                  56      8227
ReciprocityTheory/Hypotheses                                                        3       476
ReciprocityTheory/L2DbarEstimates                                                 227     33734
ReciprocityTheory/NeutralLocalFields                                               20      4711
ReciprocityTheory/ReducedBases                                                      9      1217
ReciprocityTheory/ReductiveGroups                                                2799    409976
ReciprocityTheory/ResidueCardinality                                                1       151
ReciprocityTheory/SemistableReduction                                             119     14578
ReciprocityTheory/ThetaQuasiPeriods                                                 5       771
ReciprocityTheory/ThetaSummability                                                  7       359
Supplements/Kernels                                                                 3        22
```
