---
id: inputs-and-assembly
title: What the proof stands on
part: 4
summary: After this chapter you can say what a Lean proof checks and what it assumes, name the published theorems that the formal proof of the hypothesis restates and proves, read the assembly theorem where its three inputs meet, and trace any declaration of the Lean tree yourself.
needs: [route-a-plan]
---

::: plain
The second proof of 2026 exists as a computer-checked proof in the language Lean. It uses many famous theorems, and none of them is simply assumed: each is written out as a statement and then proved inside the same files, which contain no placeholders and no new axioms. This chapter shows what that means, what it rests on, and how to check it yourself.
:::

Stepanov's proof in [[stepanov]] stood on textbook theorems ([[st-used]]). Chapters [[route-a-plan]] to [[cohomology-window]] replaced its multiplicity with a chain of theta lifts and, in our reading, its other ingredients with arithmetic ones such as Chebotarev's theorem, arithmetic Hilbert and Samuel theory, and Hecke $L$-functions. Each is a large published theorem, and there are dozens more, so the last question is the one this chapter answers: what does the proof stand on, and how would one check any of it?

The numbers about the tree come from this repository's index of the Lean files, read on 2026-11-20 and 2026-11-21. The classical names given to Lean statements are our identifications, made in our reading of the published inputs from the shape of the statements, since the tree contains no comments and names no authors.

## What a formal proof is {#s-ia-formal}

::: definition {#d-ia-formal title="Formal proof, Lean's kernel, and Mathlib"}
In Lean 4, a theorem is a pair: a *statement*, which is a type in a precise logical language, and a *proof*, which is a term of that type [@moura2021lean4]. Lean elaborates the text a person writes into such a term, and a small program, *Lean's kernel*, checks that the term has the stated type. A *formal proof* is a statement together with a term that the kernel accepts. *Mathlib* is Lean's community library of mathematics, with definitions and theorems from undergraduate algebra and analysis up to parts of research mathematics [@mathlib2020]. A formal proof is not a program that searches for a proof, and it is not a numerical check: the kernel verifies a complete derivation from the axioms of Lean's logic.
:::

The smallest example, ours and not from the tree, is `theorem two_add_two : 2 + 2 = 4 := rfl`: the statement is `2 + 2 = 4`, the proof term is `rfl` (reflexivity), and the kernel accepts it because both sides compute to the same natural number. A proof of the Riemann Hypothesis is the same kind of object, only longer.

::: definition {#d-ia-holes title="Placeholders and axioms in a Lean file"}
Two words let a Lean file assert something without proving it. `sorry` (and its synonym `admit`) closes any goal at once, and Lean accepts the file with a warning and records the gap as a use of the axiom `sorryAx`. `axiom` declares a new statement to be true with no proof. A file free of both still uses the axioms built into Lean's logic, chief among them the axiom of choice, which ordinary mathematics uses too. Further escape hatches exist: `native_decide` asks the compiler rather than the kernel to evaluate a decision procedure, through the axiom `ofReduceBool`, and `implemented_by` and `unsafe` let compiled code differ from what the kernel sees.
:::

### The five statements {#s-ia-five}

`Main.lean` proves five theorems with no hypotheses, from `rhOfAll`, `allChi`, `claimAll`, and `critAll` in `Supplements/Kernels/MainTheorems.lean`. Four of their statements are the short definitions of `Statements.lean`, printed and translated in [[ra-proved]]. The fifth is Mathlib's own definition of the Riemann Hypothesis, which is not in the archive. The project imports Mathlib at the revision `0df444a360eaa60ab8c11dca51a86af692955474`, and we read the definition from Mathlib's repository at that revision, in `Mathlib/NumberTheory/LSeries/RiemannZeta.lean`.

```lean
def RiemannHypothesis : Prop :=
  ∀ (s : ℂ) (_ : riemannZeta s = 0) (_ : ¬∃ n : ℕ, s = -2 * (n + 1)) (_ : s ≠ 1), s.re = 1 / 2
```

::: lean {decl="riemannHypothesis" file="Main.lean"}
`Main.lean` proves `riemannHypothesis : RiemannHypothesis` and the four theorems whose statements are the definitions of `Statements.lean`.
:::

It says that every zero $s$ of $\zeta$ that is not a trivial zero $-2, -4, -6, \dots$ and is not $1$ has real part $\tfrac12$. Lean's functions are total, so Mathlib's `riemannZeta` has some value at the pole $s = 1$ by convention, and the condition $s \neq 1$ removes that point. Because all five statements are built from Mathlib's `riemannZeta`, `DirichletCharacter`, and `DirichletCharacter.LFunction` alone, a reader who trusts those three definitions can check what the theorems say without reading anything else in the tree.

## The integrity counts, and what they do not show {#s-ia-integrity}

The first thing to measure is whether the tree hides an assumption. The repository's indexer reads every file with comments and strings blanked out and counts the eight escape words of [[d-ia-holes]] as code tokens, and an independent `grep` over the raw files, which took about eleven minutes, found none of them either.

| Token | Whole tree | Import closure of `Main` |
| --- | ---: | ---: |
| `sorry`, `admit`, `sorryAx` | 0 | 0 |
| `axiom` (as a word, and as a kind of declaration) | 0 | 0 |
| `native_decide`, `ofReduceBool` | 0 | 0 |
| `unsafe`, `implemented_by` | 0 | 0 |
| Metaprograms, not escape words: `elab`; `macro` or `macro_rules`; `run_cmd` or `run_tac` | 4; 87; 37 | 4; 87; 37 |

The search for escape words does not cover metaprograms, code that runs while Lean reads the files, so we counted them separately. The tree has 4 `elab` declarations in 3 files, 87 `macro` or `macro_rules` lines, and 37 uses of `run_cmd` or `run_tac`. Five of the `run_cmd` lines, in `BuildAid/D1.lean` to `D5.lean`, add folder names to the deny list of Lean's library-suggestion tool, and no other file modifies the environment directly. The command `cpt_copy_thms` of `Formalism/HermitianCurvature/HermitianCurvatureProofs/CutCptCopy.lean`, run once in `CutMainCpt.lean`, makes the tree's only two `addDecl` calls: they copy definitions and theorems under new names ending in `Cpt`, which `CutMainCpt.lean` uses, and `addDecl` passes each copy to the kernel. `axiomDecl` occurs nowhere and no `debug.` option is set, so no metaprogram in the text adds an axiom or skips the kernel. The declaration counts of this chapter and the cones traced by the tools count declarations written in the text, not generated ones such as these copies.

::: definition {#d-ia-closure title="Import closure"}
Every Lean file begins with `import` lines naming other files. The *import closure* of a file is the set of files reachable from it by following imports. It is the set of files whose declarations a proof in that file can use.
:::

The import closure of `Main` is the whole tree: all 175,187 files are reachable from `Main`, and every file is at most 43 import steps from `Main` along its shortest chain, some exactly 43. The tree's files also import 348 outside modules by name, 344 of Mathlib (among them `Mathlib` itself, which brings in the whole library), 3 of Lean, and 1 of Batteries, a library Mathlib depends on. So the text search covers every file that the proof can use, and it finds no escape word in any of them. Whether any statement enters the proof as an assumption is settled by the build of the warning below, not by the search.

The tree also contains no comments at all, by the indexer and by the same `grep`; the only prose in it is in the names of files and declarations.

::: warning
These counts are facts about the source files, not the verdict of Lean's kernel. The repository did not build the project: nothing in the archive was compiled or run, for this page or for any reading behind it. A text search cannot show that every file compiles, that every proof term type-checks, or that no macro or tactic changes what a line means.
:::

Building the tree would add three things; what follows is what we expect a build to show, not something we observed. With Lean 4.33.1 (pinned in `lean-toolchain`) and Mathlib at revision `0df444a360ea` (pinned in `lakefile.toml`), `lake build` would make the kernel check every proof term in all 175,187 files, which is the actual guarantee a formal proof offers. `#print axioms riemannHypothesis` would list every axiom the final theorem depends on, including those reached through Mathlib; one expects exactly the three of Lean's standard library, propositional extensionality, the axiom of choice, and the soundness of quotients. And a build confirms that each statement elaborates to the meaning we read off its text, for example that `1 / 2` in `s.re = 1 / 2` is the real number one half. The note says that its authors "formalized the arguments without assumptions" [@alpoge-note]. The counts above are consistent with that, and a build is what would certify it.

## The shape of the tree {#s-ia-shape}

The tree is large because it proves its inputs. It has 175,187 `.lean` files, 17,374,215 lines, and 1,061,425 declarations found by the indexer (784,092 theorems, 34,663 lemmas, 212,819 definitions, and smaller numbers of abbreviations, structures, instances, inductive types, and classes). The table gives the top-level folders.

| Folder | Files | Lines | Declarations | What it holds, read from names |
| --- | ---: | ---: | ---: | --- |
| `Development` | 141,928 | 12,232,663 | 692,993 | The bulk: abelian varieties, automorphic arithmetic, the automorphic spectrum, the Weil bound, resolution of singularities, étale cohomology |
| `Formalism` | 18,254 | 3,200,748 | 240,099 | Analytic estimates, lattices, the zero-free machinery and the last step to the hypothesis |
| `GroundTheory` | 8,507 | 1,119,138 | 75,102 | Background theory: heights, automorphic forms, Galois and Tate cohomology, global and local fields, $p$-adic Hodge theory |
| `ReciprocityTheory` | 3,845 | 563,016 | 36,446 | Reductive groups, Arakelov geometry, analytic estimates, class field theory, Chebotarev |
| `CompanionTheory` | 2,027 | 194,218 | 11,775 | Spectral geometry, real groups, Harish-Chandra modules |
| `PositivityTheory` | 449 | 55,130 | 4,746 | One subtree of stated automorphic inputs |
| `Lemmata` | 167 | 9,232 | 251 | One-lemma folders with opaque names |
| `BuildAid` | 5 | 20 | 0 | Build settings for Lean's library-suggestion tool |
| `Supplements` | 3 | 22 | 4 | The four kernel theorems `rhOfAll`, `allChi`, `claimAll`, `critAll` |
| root | 2 | 28 | 9 | `Main.lean` and `Statements.lean` |

One level down, `Development/AbelianVarietyTheory` alone has 99,187 files (57%), including `PublishedTheorems` (493 files), where most published theorems are stated, and `Development/AutomorphicArithmetic` (18,431 files) holds the main chain of the argument, including `CharacterBoxes`, where the final assembly lives. These descriptions are inferred from names.

Files are short: the median has 58 lines, 28% have 20 lines or fewer, the mean is 99 lines with about 6 declarations, and the longest has 17,981 lines. Three conventions make the tree navigable.

- **Statement files paired with proof files.** 46,610 files have a module name ending in `Statement`; the idiom is `def X : Prop := ...` in one file and `theorem x_holds : X` in a neighbor, and 5,571 declarations end in `_holds`.
- **Hypotheses as named propositions.** A major theorem takes its inputs as arguments whose types are named statements, such as `(hG : Green) (hV : VWin)`, and another theorem closes each one, so reading the proof means following names.
- **Namespaces do not follow folders.** `Development/AbelianVarietyTheory` uses the namespace `GlobalTheory`, `Development/AutomorphicArithmetic` mostly `UpperTheory`, and `Development/WeilBound` mostly `PositivityTheory`.

:::: figure {#f-ia-tree viz="ia-tree-map" height="440"}
One folder, `Development`, holds 70% of the lines, and the folder that contains the final assembly is a tenth of the tree.

```vizspec
Purpose: show the size of the Lean tree by region, and where the final assembly sits in it.
Scene: a squarified treemap filling the drawing area. Level one: the ten top-level folders of the table below, each a rectangle with area proportional to the selected metric and a label "name, value" when the rectangle is wide enough (else on hover). Level two, drawn inside its parent with thin borders: the depth-2 folders listed below; the remainder of a parent is one rectangle labeled "other". Colors: muted gray for every rectangle, except the rectangle `Development/AutomorphicArithmetic` outlined in gold (it holds CharacterBoxes, the final assembly) and `Development/AbelianVarietyTheory` outlined in blue (it holds PublishedTheorems).
Controls: a three-way toggle for the metric: files, lines, declarations. Tap or click a level-one rectangle to zoom into it (its children fill the area); a "back" button returns.
Motion: when the metric changes, rectangles animate to their new sizes over 400 ms. Respect prefers-reduced-motion by switching instantly.
Readout: under the treemap, one line: "selected folder: files, lines, declarations, share of the tree in %".
Reader takeaway: the tree is dominated by the proofs of its inputs, not by the new argument.
Data (files, lines, declarations). Level one: Development 141928, 12232663, 692993; Formalism 18254, 3200748, 240099; GroundTheory 8507, 1119138, 75102; ReciprocityTheory 3845, 563016, 36446; CompanionTheory 2027, 194218, 11775; PositivityTheory 449, 55130, 4746; Lemmata 167, 9232, 251; BuildAid 5, 20, 0; Supplements 3, 22, 4; root 2, 28, 9.
  Level two inside Development: AbelianVarietyTheory 99187, 8142960, 457031; AutomorphicArithmetic 18431, 1776375, 91512; AutomorphicSpectrum 15147, 1195844, 69254; WeilBound 7051, 848547, 55463; EtaleCohomology 1398, 104525, 10302; ResolutionOfSingularities 499, 140709, 8050; DiscreteGroups 215, 23703, 1381.
  Inside Formalism: LocalToGlobal 5501, 955843, 73273; PeriodIntegrals 4350, 451856, 32699; SharpRestriction 3093, 709436, 54648; HermitianCurvature 1922, 460802, 35958; GL3MeanSquares 440, 78320, 4153.
  Inside GroundTheory: HeightsAndTheta 6410, 641322, 37829; AutomorphicForms 542, 150005, 10968; ProfiniteCohomology 450, 84902, 6262; GlobalFields 384, 72305, 5830; PAdicHodge 226, 64317, 5360.
  Inside ReciprocityTheory: ReductiveGroups 2799, 409976, 26331; L2DbarEstimates 227, 33734, 1877; AnalyticForms 192, 36680, 2328.
  Inside CompanionTheory: SpectralGeometry 1254, 105437, 5870; AutomorphicTheory 457, 47957, 2806.
```
::::

## Restate, then prove: how the tree treats the literature {#s-ia-literature}

A formalization cannot cite a published theorem, because the kernel checks only what is proved in the files it is given, so it must either carry the theorem as a hypothesis to the end or prove it. The tree looks at first as if it does the first, because of a structure whose name suggests a list of assumptions, and on inspection it does the second.

```lean
structure UpperTheory.LiteratureTheorems.OpenLiteratureStatements : Prop where
  caraianiLocalGlobalDual : _root_.UpperTheory.One.M.Row
  localLanglandsExists : _root_.UpperTheory.Zero.LLC.RecTExists
  galoisRepOfPolarizedPairLit : _root_.UpperTheory.One.M.Row
```

::: lean {decl="UpperTheory.LiteratureTheorems.OpenLiteratureStatements" file="Development/AutomorphicArithmetic/ThetaCorrespondence/ThetaPairLifts/ThirdPlaceSeries/EveryCharacterOfLiteratureOfVWin.lean"}
A record of three statements, of which the first and the third are the same proposition `Row`, defined in `.../SatakeParameters/RecT.lean` as `Row0b` with the local parametrization `IsRecT`.
:::

The file that defines it, 814 lines long, contains 195 theorems, and every one takes an argument `(O : OpenLiteratureStatements)`. Most are one or two lines: the statement is a published theorem, written in the tree as `def T : Prop`, and the proof names a theorem proved elsewhere in the tree. Two examples from the file:

```lean
theorem UpperTheory.LiteratureTheorems.chebotarev_degree_one_of_literature (O : _root_.UpperTheory.LiteratureTheorems.OpenLiteratureStatements) : GlobalTheory.Published.ChebotarevDegreeOne :=
  (GlobalTheory.Published.chebotarevDegreeOne' )
theorem UpperTheory.LiteratureTheorems.resolution_char_zero_of_literature (O : _root_.UpperTheory.LiteratureTheorems.OpenLiteratureStatements) : GlobalTheory.CompanionTheory.Hypotheses₂.ResolutionCharZero :=
  PositivityTheory.Resplug.ResolutionBlowup.resolutionCharZero
```

::: definition {#d-ia-wrapper title="Wrapper theorem"}
A *wrapper theorem* in this file states a published theorem $T$ and proves it by naming a proof of $T$ elsewhere in the tree. Its argument `O` is present in the signature but, in all but a few cases, not used.
:::

Only two theorems of the file read a field of `O`: the wrapper at line 284 returns `O.localLanglandsExists`, and a bundle at line 618 uses `O.caraianiLocalGlobalDual`; the third field is never read. A few wrappers, such as those at lines 286 and 460, are built from other wrappers and pass `O` along. One slot, `siegel_eisenstein_simple_pole`, has the statement `UnusedSlot72`, defined to be `True`, a placeholder that asserts nothing. The remaining theorems collect the wrappers into nine bundles, and the last, `every_character_of_literature_of_vWin`, hands them to the theta-integral assembly.

The structure itself is then filled with proofs, `⟨h, recTExists, h⟩` with `h` a proof of `Row0b` ([[s-ia-assembly]]), so no hypothesis from the literature is left at the root: the word "literature" in these names marks standard theorems that the project wrote down first and then proved.

### The published theorems, by area {#s-ia-table}

The table lists published theorems on the spine confirmed in the code: the declaration exists, it is a `def ... : Prop` of the shape described, and a wrapper, an argument of the covolume theorem, or (for the holomorphic Lefschetz formula) the proof of `GeoOne` proves it by a named theorem in the tree. The usual names are our identifications, and the size column is the *dependency cone* of the proof.

::: definition {#d-ia-cone title="Dependency cone"}
The *dependency cone* of a theorem is the set of declarations its proof mentions, then the declarations their proofs mention, and so on. Its size here is the number of distinct files holding them and the sum of their line counts, measured by the repository's `spine.py` at depth 80 with no cap on the branching. Counting whole files overstates, and uses through field notation, instances, or `simp` sets are invisible, which understates; cones overlap and must not be added. Two of the measurements were repeated and reproduced exactly (Green's theorem and Chebotarev in degree one); the others were made once.
:::

The covolume theorem `topCovolSlim2_use_alt_alt` takes 15 published statements and returns `CovolumeBoundOfX`, a bound on the covolume of a lattice attached to a family on toroidal compactifications of Siegel and unitary Shimura varieties. The formal proof establishes this bound, whose statement `L3` we did not unfold, and we state it and do not unfold it here. "Field $p_k$" or "$q_k$" refers to the 28 fields of the record `PublishedHodgeBundleTheorems`, one of the 15 inputs.

| Usual name | Lean declaration | Role on the spine | Cone: files, lines |
| --- | --- | --- | ---: |
| **Resolution of singularities and vanishing theorems** | | | |
| Resolution in characteristic $0$ (Hironaka) [@hironaka1964] | `ResolutionCharZero` | Input 1 of the covolume theorem; feeds everything in the Hodge-bundle package | 467; 134,960 |
| Principalization of ideals (Hironaka) | `PrincipalisationCharZero`, `Principalisation` | Input 2; yields Nadel vanishing and arithmetic Hilbert and Samuel | 393; 114,992 |
| Nadel vanishing, with point separation | `NadelVanishingAndNonKltDivisor` [@nadel1990] | Gives `PointSeparationPair`, input 12, and field $q_{15}$ | 1,518; 240,897 |
| Kawamata and Viehweg vanishing | `KawamataViehweg` [@lazarsfeld2004] | Field $q_6$, derived from the Nadel pair | 137; 46,073, given Nadel |
| **Arakelov geometry, heights, and integral models** | | | |
| Poincaré and Lelong formula | `PoincareLelongInv` | Input 3; builds the arithmetic intersection numbers | 889; 108,474 |
| Arithmetic bigness, a lower bound on small sections (the code's name: Moriwaki) | `MoriwakiBigStatement` | Input 5; counts small sections of the Hodge bundle | 2,985; 479,232 |
| Arithmetic Hilbert and Samuel formula | `ArithHilbertSamuel` | Field $q_9$ | 1,457; 163,762 |
| Heights of cycles | `CycleHeights` | Field $q_{11}$ | 1,194; 181,377 |
| Toroidal compactification of Shimura varieties [@faltingschai1990] [@lan2013] | `ToroidalCompactification`, `SiegelToroidalIntegral`, `ToroidalForFanKS` | Field $p_1$, inputs 9 and 10: the compact moduli space for the Hodge bundle | at least 10,289; 1,051,258 |
| Exactness of the Hodge and Tate sequence (Fargues) | `FarguesExact` | Input 6 | 702; 54,462 |
| Zarhin's trick | `ZarhinStatement` | Input 7: reduction to principal polarizations | 808; 145,999 |
| Grothendieck and Messing deformation theory [@messing1972] | `GrothendieckDeformation` | Input 15: integral models and their lifts | 2,234; 231,458, through `AbelianLifting` |
| Grothendieck's existence theorem [@ega3] | `FormalAlgebraisation` | Field $q_{18}$: algebraic models from formal ones | 486; 77,826 |
| **Tate's thesis, class field theory, and Chebotarev** | | | |
| Hecke $L$-functions are entire and nonzero at $1$ [@tate1967] | `HeckeLEntireAndNonzeroAtOne` | Field of `ThetaLocalInputs`; Dirichlet-type primes in number fields | 59; 8,678 |
| Functional equation of Hecke $L$-functions, CM case | `HeckeTateFunctionalEquation` | Field `fe` of the bundle `literature_nonexistence` | folder `TateThesis`: 77; 16,795 |
| Artin reciprocity [@neukirch-ant, Ch. VI] | `GlobalArtinReciprocity` | Local Artin maps for [[t-ia-llc]]; ray class characters | 235; 50,213 |
| Chevalley's theorem on units | `ChevalleyUnits` | Injectivity of the local-to-global Artin map | 73; 7,151 |
| Chebotarev, one degree-one prime | `ChebotarevDegreeOne` | Field of `UnitaryGroupThirdPlaceHypotheses`; auxiliary primes | 66; 6,536 |
| Linnik's theorem [@iwaniec-kowalski-ant] | `Linnik` | Field `linnik`: least auxiliary primes in progressions | 101; 14,814 |
| Brauer induction, degree-zero form [@serre1977] | `BrauerDegreeZero` | Used to build the local Langlands map | 61; 4,332 |
| **Local Langlands** | | | |
| Local Langlands for $\GL_n$, weak form | `RecTExists` | Second field of `OpenLiteratureStatements`; argument `hL` of the assembly | 1,790; 236,746 |
| Langlands classification | `LanglandsExhaustionGL`, `LanglandsMultisegments` | Extends the map from cuspidal to all representations | proof folder: 24; 1,381 |
| **Siegel and Weil** | | | |
| Siegel and Weil formula, definite case [@weil1965] | `SiegelWeilStd` | With `EisBL`, proves `ThetaIntegralsAgree` and `LocalMatching` | 3,333; 397,791 |
| Siegel and Weil formula, convergent range for unitary groups | `WeilSiegelFormulaUnitary`, `SiegelWeilUnitaryConvergent` | Fields of both bundles | not measured |
| Continuation of the Siegel Eisenstein series | `EisBL` | Input of the definite Siegel and Weil formula | 385; 58,584 |
| **Green's theorem** | | | |
| Cuspidal characters of $\GL_d(\FF_g)$ (Green) [@green1955] | `Green`, `GreenCuspidal` | First hypothesis of `every_character_of_green_v_win`; the type law of [[t-ia-llc]] | 224; 17,396 |
| **Atiyah and Bott** | | | |
| Holomorphic Lefschetz formula [@atiyahbott1967] | `HolomorphicLefschetzFormula` | Proves `GeoOne`, hence the Galois representations of `Row0b` | 524; 82,938 |

The cone of `ToroidalCompactification` stopped at the tool's cap of 40,000 declarations, so its true size is larger. The cone of `HeckeTateFunctionalEquation` came out cut to 5 declarations, because its main step is reached through field notation, so the table gives the size of the folder `GroundTheory/GlobalFields/TateThesis` instead. We sorted the remaining wrappers by name and statement head, roughly into class field theory and number theory (about 33), local representation theory of $\GL_n$ (34), real groups, theta correspondence, and automorphic forms (69), Galois cohomology and $p$-adic Hodge theory (18), and algebraic geometry (32), and followed most of their proofs no further than the first layer.

Three rows deserve the expert's question "is this the theorem?". The local Langlands row is answered in [[s-ia-llc]]: the code's statement is weaker than the full correspondence. The Chebotarev row is answered in [[s-ia-chebotarev]]: the code's statement is a corollary of the density theorem, and the density theorem is in the tree too. For arithmetic bigness, we recorded three differences from the textbook form: only subvarieties of products of projective spaces occur, intersection numbers are any system obeying stated axioms (whose existence is proved separately), and the volume counts small sections of a lattice built on charts. The code's name attributes the statement to Moriwaki, and we give no reference for it, because we could not confirm the exact source theorem.

:::: figure {#f-ia-fan viz="ia-input-fan" height="520"}
Every published theorem on the spine reaches the final statement through one input of the assembly theorem, the covolume bound, the local Langlands map, the theta-integral identities, or the two bundles of published results, or through `Row0b`.

```vizspec
Purpose: a dependency fan from the final statement down to the published theorems, sized by how much code proves each.
Scene: a layered graph read top to bottom. Layer 0: one node "EveryCharacter" (violet). Layer 1: "every_character_of_literature_of_vWin" (violet outline). Layer 2: its seven inputs as nodes: "P: 60 published results", "F: 53 published results", "ThetaIntegralsAgree", "LocalMatching", "CovolumeBoundOfX", "RecTExists", "VWin" (VWin gold, the others muted). Layer 3: leaves (blue), each a circle whose area is proportional to its cone lines: under CovolumeBoundOfX: ResolutionCharZero 134960, PrincipalisationCharZero 114992, PoincareLelongInv 108474, MoriwakiBigStatement 479232, FarguesExact 54462, ZarhinStatement 145999, ToroidalCompactification 1051258 (draw with a dashed rim meaning "at least"), GrothendieckDeformation 231458, NadelVanishing 240897; under ThetaIntegralsAgree and LocalMatching (both): SiegelWeilStd 397791, EisBL 58584; under RecTExists: GlobalArtinReciprocity 50213, ChevalleyUnits 7151, BrauerDegreeZero 4332, Green 17396; under P: ChebotarevDegreeOne 6536, GreenCuspidal 17396, WeilSiegelFormulaUnitary (size unknown, small fixed circle); under F: HeckeLEntireAndNonzeroAtOne 8678, Linnik 14814. A side node "Row0b" (gold) with edges to VWin, to RecTExists' parent record (label "OpenLiteratureStatements"), and a node "HolomorphicLefschetzFormula 82938" (blue) below Row0b via "GeoOne".
Controls: hover or tap a leaf to show its usual name, Lean name, cone files and lines, and to highlight its path to the top. A toggle "size by files / by lines".
Motion: highlighting only; no continuous animation.
Reader takeaway: the inputs fan out widely but meet in one theorem, and the geometric package for the covolume bound is by far the largest.
Data: the numbers above (cone lines; files available from the chapter's table if the toggle is used: Resolution 467, Principalisation 393, PoincareLelong 889, Moriwaki 2985, Fargues 702, Zarhin 808, Toroidal 10289, GrothendieckDeformation 2234, Nadel 1518, SiegelWeilStd 3333, EisBL 385, Artin 235, Chevalley 73, Brauer 61, Green 224, Chebotarev 66, Hecke 59, Linnik 101, Lefschetz 524).
```
::::

### Local Langlands in the form the proof needs {#s-ia-llc}

The local Langlands correspondence for $\GL_n$ over a $p$-adic field $F$ matches irreducible smooth representations of $\GL_n(F)$ with $n$-dimensional Weil and Deligne representations of $F$, so that $L$-factors and $\varepsilon$-factors of pairs agree. It was proved by Harris and Taylor and by Henniart, and later by Scholze with a different method [@harristaylor2001] [@henniart2000] [@scholze2013]. The tree states the full correspondence too, as the structure `Laws` in `.../AutomorphicForms₂/LocalLanglandsGL.lean`, but the proof uses a weaker statement that it proves by a direct route.

::::: card {#t-ia-llc kind="theorem" title="At every finite place of every number field there is a map from irreducible representations of $\GL_n$ to Weil-Deligne representations that obeys the laws LawsT" source="alpoge-lean"}
:::: statement
Let $E$ be a number field and $w$ a finite place of $E$, with completion $F = E_w$, and fix a decomposition group at $w$ inside the absolute Galois group of $E$. Then there exist a local Artin map $a$ from the Weil group $W_F$ to $F^\times$, compatible with every global Artin map, and a map $\mathrm{rc}$ from the set of pairs $(n, [\pi])$, with $\pi$ an irreducible smooth representation of $\GL_n(F)$, to Weil and Deligne representations of $W_F$, with these laws:

- For all $\pi$: $\mathrm{rc}(\pi)$ has dimension $n$, $\mathrm{rc}(\chi) = \chi\circ a$ on characters, $\mathrm{rc}$ is additive along the Langlands classification by segments, $\mathrm{rc}(\pi)$ is irreducible when $\pi$ is cuspidal, $\mathrm{rc}(\pi\,\abs{\det}^s) = \mathrm{rc}(\pi)\otimes\abs\cdot^s$, and $\abs{\det\mathrm{rc}(\pi)(\sigma)}$ equals $\abs{\omega_\pi(a(\sigma))}$ for the central character $\omega_\pi$.
- For $\pi$ that are *good*: compatibility with twists, central characters equal to determinants, contragredients sent to duals, injectivity at $\pi$, and depth zero sent to tame.
- A type law tying the restriction to inertia to Green's cuspidal characters ([[s-ia-table]]).

Here $\pi$ is good when its cuspidal support consists of characters, or of twists of depth-zero representations when $F = \QQ_g$ for a prime $g$.
::::
:::: plain
At every prime of every number field the code builds a dictionary from representations of matrix groups to Galois data that obeys the rules the proof uses, and only those.
::::
:::: why
The local components of automorphic representations have to be read as Galois data at each prime, both to state `Row0b` ([[s-ia-assembly]]) and to compare automorphic and Galois sides in [[integrality-and-galois]]. The full correspondence would serve, but its proofs need the cohomology of Shimura varieties or a long induction, while the weak form needs only class field theory, Green's theorem, and the Langlands classification.
::::
:::: idea
Build the map on characters from the local Artin map, on good cuspidal representations from Green's classification of cuspidal characters over the residue field, and on the remaining cuspidals by any choice of the right dimension. Then extend to all representations through the Langlands classification, which writes every irreducible representation in terms of cuspidal ones, and check the laws.
::::
:::: sketch {source="alpoge-lean"}
The proof `recTExists` (line 20 of `.../LocalCentralUnits/RecTExists.lean`) follows the idea in order. `artEx` obtains the local Artin map from Artin reciprocity and Chevalley's theorem on units, `cuspEx` defines the map on cuspidal representations (through `goodMap` for the good ones, and by a fixed choice of the right dimension for the others, which no law constrains), `exists_isLExt` extends it through the Langlands classification, and lemmas such as `extDim` and `typeIff` verify the laws.
::::
:::: lean {decl="UpperTheory.Zero.LLC.RecTExists" file="Development/AutomorphicArithmetic/Foundations/LocalLanglands/IsRecTOfIsRec.lean"}
`RecTExists` says that for every number field, algebraic closure, and finite place with a chosen place above it, some map `rc` satisfies `IsRecT`, which asks for an Artin map and the structure `LawsT`.
::::
:::: used
- The argument `hL` of the assembly and the second field of `OpenLiteratureStatements`: [[t-ia-assembly]].
- The parametrization inside `Row0b`, through `recT`: [[integrality-and-galois]].
::::
:::::

```lean
def RecTExists : Prop :=
  ∀ (E Ω : Type) [Field E] [NumberField E] [Field Ω] [Algebra E Ω] [IsAlgClosure E Ω] (A : ValuationSubring Ω)
    (w : HeightOneSpectrum (𝓞 E)) (h : IsPlaceOver A w), ∃ rc, IsRecT h rc
```

The statement is not the local Langlands correspondence, and this is our main caveat for the region. Compared with `Laws`, the structure `LawsT` drops bijectivity, the agreement of $\varepsilon$-factors of pairs, and the laws for determinants, products, supports, spherical representations, and Satake parameters; it keeps the cuspidal and depth laws in one direction only, and asks for the twist, central character, dual, injectivity, and depth laws only at good representations. The code proves that the full correspondence implies the weak one, given a published statement on depth-zero types (`lawsT_of_laws`, `isRecT_of_isRec`). Where the hypothesis `Good` is consumed was not traced, so whether the weak form is exactly what the global argument needs, or merely sufficient, is open.

:::: figure {#f-ia-laws viz="ia-llc-laws" height="460"}
The weak local Langlands statement keeps eleven of the full correspondence's laws in some form, drops seven, and asks five of them only for good representations.

```vizspec
Purpose: compare, law by law, the full local Langlands structure Laws with the weak structure LawsT that the proof uses.
Scene: a two-column table drawn on the canvas, one row per law, rows in this order with these entries (left column "Laws", right column "LawsT"):
  bij: "bijective" | "dropped"
  dim: "dim rc(π) = n" | "same"
  one: "characters go through the Artin map" | "same"
  eps: "ε-factors of pairs agree" | "dropped"
  twist: "twists" | "only for good π"
  central: "central character = determinant" | "only for good π"
  dual: "contragredient goes to dual" | "only for good π"
  cusp: "cuspidal iff irreducible" | "cuspidal implies irreducible"
  langlands: "additive on segments" | "same"
  det, prod, supp, sph, sat: one row each | "dropped"
  depth: "depth zero iff tame" | "depth zero implies tame, only for good π"
  inj (LawsT only): "follows from bij" | "only for good π"
  nu (LawsT only): "follows from twist" | "for all π"
  absCentral (LawsT only): "follows from central" | "for all π"
  type (LawsT only): "from the published depth-zero type statement" | "required"
  Cell colors: "same" muted, "dropped" red, "only for good π" gold, one-directional teal.
Controls: a toggle "π is good / π is not good". When "not good" is selected, the rows that LawsT asks only for good π fade in the right column, showing which laws the weak statement imposes on such π. Hover a row to show the Lean field text from the chapter.
Motion: fade over 250 ms; none under prefers-reduced-motion.
Reader takeaway: for representations that are not good, the weak map is constrained only by dimension, characters, segments, cuspidality, twisting by powers of the norm, and the absolute value of the central character.
Data: the table above.
```
::::

## Three inputs in a page each {#s-ia-three}

Three published inputs have a small case with numbers a reader can check, and each connects to something earlier on this page.

### Chebotarev's density theorem {#s-ia-chebotarev}

Reduced modulo a prime $p$, a cubic can have three roots, one, or none, and which happens looks random. Chebotarev's theorem says it is random in a precise sense, with frequencies read off from a finite group.

::: definition {#d-ia-density title="Frobenius class and Dirichlet density"}
Let $L/F$ be a finite Galois extension of number fields with group $\Gal(L/F)$, and $\mathfrak p$ a prime of $F$ unramified in $L$. For a prime $\mathfrak P$ of $L$ above $\mathfrak p$ there is a unique $\sigma\in\Gal(L/F)$ with $\sigma(x)\equiv x^{N\mathfrak p}\pmod{\mathfrak P}$ for every integer $x$ of $L$, where $N\mathfrak p$ is the size of the residue field of $\mathfrak p$. Changing $\mathfrak P$ conjugates $\sigma$, so $\mathfrak p$ has a well-defined conjugacy class $\Frob_{\mathfrak p}$, its Frobenius class. A set $S$ of primes of $F$ has *Dirichlet density* $\delta$ when
$$
\lim_{s\to1^+}\frac{\sum_{\mathfrak p\in S}N\mathfrak p^{-s}}{\log\frac1{s-1}}=\delta.
$$
:::

::::: card {#t-ia-chebotarev kind="theorem" title="The primes whose Frobenius class lies in a conjugation-stable set $C$ have Dirichlet density $\lvert C\rvert/\lvert G\rvert$" source="neukirch-ant"}
:::: statement
Let $L/F$ be a finite Galois extension of number fields and $C\subseteq\Gal(L/F)$ a union of conjugacy classes. The set of primes $\mathfrak p$ of $F$, unramified in $L$, with $\Frob_{\mathfrak p}\subseteq C$ has Dirichlet density $\abs C/\abs{\Gal(L/F)}$.
::::
:::: plain
Every element of the Galois group occurs as a Frobenius equally often, so the share of primes with a given splitting behavior is the share of group elements of the matching type.
::::
:::: why
The proof needs auxiliary primes with a prescribed Frobenius, outside any finite set of bad primes, to build its fields and twists. Without a theorem of this kind, there is no guarantee such primes exist at all.
::::
:::: idea
Write the indicator function of $C$ as a combination of characters of $\Gal(L/F)$. By Brauer's induction theorem each Artin $L$-function is a quotient of Hecke $L$-functions of intermediate fields; the trivial character contributes the pole of $\zeta_F$ at $s=1$, every other contributes a function finite and nonzero there ([[t-ia-hecke]]), and taking logarithms leaves the trivial term, weighted by $\abs C/\abs{\Gal(L/F)}$.
::::
:::: sketch {source="neukirch-ant" loc="Ch. VII, §13"}
For cyclic extensions the result follows from class field theory and the nonvanishing of Hecke $L$-functions at $s=1$. The general case reduces to the cyclic one by restricting to the cyclic subgroup generated by an element of $C$ and its fixed field. Chebotarev's original proof is [@chebotarev1926].
::::
:::: example
Take $F = \QQ$ and $L = \QQ(\sqrt[3]2, \zeta_3)$, the splitting field of $x^3 - 2$, with $\Gal(L/\QQ)\cong S_3$. Only $2$ and $3$ ramify. For any other prime $p$, the cycle type of $\Frob_p$ on the three roots is the factorization pattern of $x^3-2$ modulo $p$: the identity gives three roots, a transposition gives exactly one, and a 3-cycle gives none. The predicted densities are $\tfrac16$, $\tfrac12$, and $\tfrac13$. For $5\le p<60$ the numbers of roots are

| $p$ | 5 | 7 | 11 | 13 | 17 | 19 | 23 | 29 | 31 | 37 | 41 | 43 | 47 | 53 | 59 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| roots | 1 | 0 | 1 | 0 | 1 | 0 | 1 | 1 | 3 | 0 | 1 | 3 | 1 | 1 | 1 |

and over all $78{,}496$ primes with $5\le p<10^6$ the counts are $13{,}032$ with three roots, $39{,}265$ with one, and $26{,}199$ with none, fractions $0.1660$, $0.5002$, and $0.3338$. Half of the pattern has a one-line reason: when $p\equiv2\pmod3$, cubing is a bijection of $\FF_p$, so $x^3=2$ has exactly one root. We computed the counts with Python, testing $2^{(p-1)/3}\equiv1\pmod p$ for $p\equiv1\pmod3$ and checking against a direct count of roots for $p<2000$.
::::
:::: lean {decl="GlobalTheory.Published.ChebotarevDegreeOne" file="Development/AbelianVarietyTheory/PublishedTheorems/GaloisCohomology₂/ChebotarevDegreeOneIffCheb.lean"}
The statement used on the spine, printed below; the density theorem itself is `GroundTheory.Global.hasDirichletDensity_chebotarevSet` in `GroundTheory/GlobalFields/TateThesis/Chebotarev.lean`.
::::
:::: used
- The field `chebotarevDegreeOne` of the bundle `UnitaryGroupThirdPlaceHypotheses`, and the field `cheb` of a twisted Selmer system: [[t-ia-assembly]].
- The auxiliary primes of [[integrality-and-galois]] and [[cohomology-window]].
::::
:::::

The form on the spine is weaker than density:

```lean
def ChebotarevDegreeOne : Prop :=
  ∀ (F Ω : Type) [Field F] [NumberField F] [Field Ω] [Algebra F Ω] [IsAlgClosure F Ω]
    (L : IntermediateField F Ω) [FiniteDimensional F L] [IsGalois F L] (g : L ≃ₐ[F] L)
    (S : Set (HeightOneSpectrum (𝓞 F))), S.Finite →
    ∃ v : HeightOneSpectrum (𝓞 F), v ∉ S ∧ v.asIdeal.inertiaDeg ℤ = 1 ∧
      ∃ B : ValuationSubring Ω, IsPlaceOver B v ∧ Ine (F := F) B ≤ L.fixingSubgroup ∧
        ∃ σ : G F Ω, IsFrob B (normV v) σ ∧ AlgEquiv.restrictNormalHom L σ = g
```

In words: for every finite Galois $L/F$, every $g\in\Gal(L/F)$, and every finite set $S$ of primes of $F$, there is a prime $v\notin S$ of residue degree one over $\QQ$, unramified in $L$, whose Frobenius at some place above it is $g$. Its proof `chebotarevDegreeOne'` avoids the density theorem: it picks a prime $m\equiv1\pmod{[L:F]}$ with $\Phi_m$ irreducible over $F$ and uses a Dirichlet-type theorem for primes of $F$ of prime norm in a residue class modulo $m$, which rests on Hecke $L$-functions. The full density theorem is in the tree as well.

```lean
theorem hasDirichletDensity_chebotarevSet (C : Set Gal(L/K))
    (hC : ∀ σ ∈ C, ∀ τ : Gal(L/K), τ * σ * τ⁻¹ ∈ C) :
    (chebotarevSet C).HasDirichletDensity (Nat.card C / Nat.card Gal(L/K)) := by
```

Here `chebotarevSet C` is the set of primes of $K$ all of whose primes above are unramified with arithmetic Frobenius in $C$. We traced the cyclotomic route from the published statement and did not decide whether any use on the spine calls the density theorem.

:::: figure {#f-ia-chebotarev viz="ia-chebotarev-split" height="400"}
As more primes are counted, the share of primes at which $x^3-2$ has three, one, or no roots settles on $\tfrac16$, $\tfrac12$, and $\tfrac13$, the shares of the identity, the transpositions, and the 3-cycles in $S_3$.

```vizspec
Purpose: watch Chebotarev's frequencies emerge for x^3 - 2 over Q.
Scene: left, a horizontal strip listing the primes p from 5 to the current bound B as small tiles colored by the number of roots of x^3 - 2 mod p (3 roots gold, 1 root blue, 0 roots teal); when B is large, the strip shows only the first 200 tiles and a count. Right, three vertical bars, the fractions of primes in [5, B) with 3, 1, 0 roots, colored as the tiles, each with a violet horizontal tick at its target 1/6, 1/2, 1/3. Axis 0 to 0.7, muted.
Controls: slider for B on a logarithmic scale from 10 to 10^6; a play button that sweeps B upward over 6 seconds. A checkbox "split by p mod 3" that divides each bar into the part from p ≡ 1 mod 3 and the part from p ≡ 2 mod 3, showing that all one-root primes with p ≡ 2 mod 3 account for the bar's lower half.
Computation: on first approach to the viewport, sieve primes below 10^6 (Eratosthenes, Uint8Array) and classify each p >= 5: if p mod 3 == 2 then 1 root; else 3 roots if 2^((p-1)/3) mod p == 1 (modular exponentiation in doubles is exact since p^2 < 2^53), else 0 roots. Store prefix counts so the slider is constant time.
Motion: bars move with the slider; the play button respects prefers-reduced-motion by jumping to B = 10^6.
Reader takeaway: a finite group predicts the statistics of primes.
Check values: at B = 10^6 the counts are 13032, 39265, 26199 out of 78496.
```
::::

### Siegel's mass formula and the Siegel and Weil formula {#s-ia-siegel-weil}

Chapter [[definite-forms]] stated Siegel's mass formula and the Siegel and Weil identity for a Hermitian genus ([[t-df-siegel-mass]], [[t-df-siegel-weil]]). Here is the classical case with numbers a reader can check, and the form the tree proves.

::::: card {#t-ia-siegel kind="theorem" title="Averaged over a genus of definite lattices with weights one over the order of the automorphism group, the theta series is an Eisenstein series, and the weights sum to an explicit mass" source="siegel1935"}
:::: statement
Let $n$ be a multiple of $8$ and consider the positive definite even unimodular lattices $L\subset\RR^n$, which form a single genus with finitely many isometry classes. Write $\operatorname{Aut}(L)$ for the finite group of isometries of $L$, $B_k$ for the Bernoulli numbers, and $\theta_L(q)=\sum_{v\in L}q^{v\cdot v/2}$ for the theta series. Then
$$
\sum_{[L]}\frac1{\abs{\operatorname{Aut}(L)}}=\frac{\abs{B_{n/2}}}{n}\prod_{j=1}^{n/2-1}\frac{\abs{B_{2j}}}{4j},
$$ {#eq-ia-mass}
the sum running over the classes, and the weighted average of the theta series is the Eisenstein series of weight $n/2$,
$$
\frac{\sum_{[L]}\theta_L/\abs{\operatorname{Aut}(L)}}{\sum_{[L]}1/\abs{\operatorname{Aut}(L)}}=1-\frac{n}{B_{n/2}}\sum_{m\ge1}\sigma_{n/2-1}(m)\,q^m,
$$ {#eq-ia-siegel}
where $\sigma_k(m)=\sum_{d\mid m}d^k$.
::::
:::: plain
No single lattice in a genus has a simple formula for its number of vectors of each length, but the average over the genus does, with each lattice weighted by one over its number of symmetries.
::::
:::: why
In the proof, the average of a theta lift over a definite unitary group must be computed exactly, to control the constants along the chain of lifts of [[multiplicity-from-lifts]]. The Siegel and Weil formula computes that average as a value of an Eisenstein series, which is explicit.
::::
:::: idea
The coefficient of $q^m$ in $\theta_L$ counts the vectors of $L$ with $v\cdot v=2m$, and its weighted average over the genus is a product of local densities, one for each prime and one for the real place, which is the $m$-th coefficient of the Eisenstein series.
::::
:::: sketch {source="siegel1935"}
Siegel proved the formula for quadratic forms. Weil reformulated it as an identity between an integral of a theta function over an adelic quotient and an Eisenstein series, and proved it for classical groups in the range where the integral converges [@weil1965]. The even unimodular case, with Bernoulli numbers and the lattices $E_8$ and $D_{16}^+$, is discussed in [@serre1973, Ch. VII].
::::
:::: example
For $n=8$ there is one class, the lattice $E_8$, and [[eq-ia-mass]] gives
$$
\frac{\abs{B_4}}8\cdot\frac{\abs{B_2}}4\cdot\frac{\abs{B_4}}8\cdot\frac{\abs{B_6}}{12}=\frac1{240}\cdot\frac1{24}\cdot\frac1{240}\cdot\frac1{504}=\frac1{696{,}729{,}600},
$$
the reciprocal of the order of the Weyl group of $E_8$, which is $\abs{\operatorname{Aut}(E_8)}$. For $n=16$ there are two classes, $E_8\oplus E_8$ with $\abs{\operatorname{Aut}}=2\cdot696{,}729{,}600^2$ and $D_{16}^+$ with $\abs{\operatorname{Aut}}=2^{15}\cdot16!$. Their weights are $1/970{,}864{,}271{,}032{,}320{,}000$ and $1/685{,}597{,}979{,}049{,}984{,}000$, which add up to $691/277{,}667{,}181{,}515{,}243{,}520{,}000$, the value of [[eq-ia-mass]] for $n=16$, and the second lattice carries $59\%$ of the mass. The Eisenstein series in [[eq-ia-siegel]] is $1+480q+61{,}920q^2+\dots$, since $-16/B_8=480$ and $\sigma_7(2)=129$. Count the vectors with $v\cdot v=4$ in $D_{16}^+$, the integer vectors with even coordinate sum together with the vectors whose coordinates are all $\pm\tfrac12$ with an even number of minus signs: $32$ of the form $(\pm2,0,\dots)$, $\binom{16}4\cdot16=29{,}120$ of the form $(\pm1,\pm1,\pm1,\pm1,0,\dots)$, and $2^{15}=32{,}768$ half-integral ones, $61{,}920$ in all. The theta series of $E_8\oplus E_8$, the square of $1+240\sum\sigma_3(m)q^m$, has coefficients $1, 480, 61{,}920, 1{,}050{,}240, 7{,}926{,}240, 37{,}500{,}480$, equal to those of the Eisenstein series through $q^5$. Here both classes have the Eisenstein series as their theta series, so the average is that series trivially; in a genus whose classes have different theta series, only the average is. We computed these numbers with sympy in exact rational arithmetic.
::::
:::: lean {decl="GlobalTheory.ThK.Dbl.SiegelWeilStd" file="Development/WeilBound/ThetaLifts/LatticeBasics/HypothesesS.lean"}
The tree's version is for unitary groups of a CM extension: when one of the two spaces is definite, the mean of the theta sum over the compact quotient equals $\kappa$ times the value of a Siegel Eisenstein series at $s_0=(m-n)/2$, with $\kappa=1$ if $n<m$ and $\kappa=2$ otherwise, and it is proved by `PositivityTheory.SiegelWeilFormula.Fin.siegelWeilStd`.
::::
:::: used
- With the Eisenstein input `EisBL`, through `theoremK_head2`: the identities `ThetaIntegralsAgree` and `LocalMatching` of the assembly, [[t-ia-assembly]].
- The constants of the chain of lifts: [[definite-forms]] and [[multiplicity-from-lifts]].
::::
:::::

In the tree, $E/F$ is a CM extension, and one of the two spaces is Hermitian of signature $(r,s)$ with $\min(r,s)=0$, which we read as definiteness without unfolding `IsHerm`. As our reading, when the unitary group is compact at every real place, the adelic integral is a finite sum over the classes of a genus with weights $1/\abs{\operatorname{Aut}}$, which is how [[eq-ia-siegel]] arises as a special case of Weil's form.

### Tate's thesis and Hecke $L$-functions {#s-ia-tate}

Chapters [[adeles]] and [[tate-theta]] proved the functional equation of $\zeta$ by Poisson summation on the adeles of $\QQ$. Tate's thesis does the same for every number field and every Hecke character, and the tree contains a full formalization of it.

::::: card {#t-ia-hecke kind="theorem" title="The L-function of a unitary Hecke character continues to an entire function unless the character is a power of the norm, and for a nontrivial character it does not vanish at $s=1$" source="tate1967"}
:::: statement
Let $K$ be a number field and $\chi$ a unitary Hecke character of $K$. If $\chi$ is not of the form $\abs\cdot^{it}$ for real $t$, its completed $L$-function continues to an entire function of $s$. If $\chi$ is not trivial, its completed $L$-function is continuous at $s=1$ and nonzero there.
::::
:::: plain
The $L$-functions of number fields behave like the Dirichlet $L$-functions of [[what-rh-says]]: they extend to the whole plane without poles, unless they are the zeta function of the field in disguise, and they never vanish at the edge point $s=1$.
::::
:::: why
Nonvanishing at $s=1$ is what makes primes with a prescribed behavior exist in number fields, as in the proof of `ChebotarevDegreeOne` and in Linnik's theorem. Without it the auxiliary primes of the proof could fail to exist.
::::
:::: idea
Write $L(s,\chi)$ as an integral over the ideles of a Schwartz-Bruhat function against $\chi\abs\cdot^s$, the global zeta integral, and split it at norm $1$. Poisson summation on the adeles exchanges the two halves, exactly as for $\zeta$ in [[t-tt-functional-equation]], and leaves boundary terms that are present only when $\chi$ is a power of the norm. The local integrals at each prime are the Euler factors, as in [[t-ad-local-zeta]].
::::
:::: sketch {source="tate1967"}
Tate's thesis proves the continuation and the functional equation for all Hecke characters by adelic Fourier analysis, and Hecke's original proof used theta functions in several variables [@hecke1918-zeta]. Nonvanishing at $s=1$ follows from the continuation by the argument that [[t-ze-nonvanishing-one]] gives for $\zeta$, applied to the Dedekind zeta function of $K$ and its twists.
::::
:::: example
Over $\QQ$, the nontrivial character $\chi_{-4}$ of conductor $4$ is a unitary Hecke character, and the theorem applies to $L(s,\chi_{-4})=1-3^{-s}+5^{-s}-7^{-s}+\dots$. Its value at $s=1$ is Leibniz's series, $\pi/4=0.785398\ldots$, which is not zero. The completed function of [[eq-rh-l-completed]], here $\xi(s,\chi_{-4})=(4/\pi)^{(s+1)/2}\Gamma(\tfrac{s+1}2)L(s,\chi_{-4})$, takes the value $0.983778071651644$ at both $s=0.3$ and $s=0.7$, and $0.464212485506419-0.062063637135177i$ at both $s=0.25+3i$ and $s=0.75-3i$, as the functional equation with root number $1$ requires. The same character shows how number fields enter: the Dedekind zeta function of $\QQ(i)$ factors as $\zeta(s)L(s,\chi_{-4})$, so its residue at $s=1$ is $L(1,\chi_{-4})=\pi/4$, which is what the class number formula gives for $\QQ(i)$, $2\pi hR/(w\sqrt{\abs d})$ with $h=R=1$, $w=4$, and $d=-4$. We computed the values with mpmath at 30 digits.
::::
:::: lean {decl="GlobalTheory.Published.HeckeLEntireAndNonzeroAtOne" file="Development/AbelianVarietyTheory/PublishedTheorems/TwistedTraceFormula/HeckeLEntireAndNonzeroAtOne.lean"}
The statement quantifies over every number field and unitary Hecke character, as in the card, and is proved by `PositivityTheory.Stage1.PM.heckeLEntireAndNonzeroAtOne`.
::::
:::: used
- The field `heckeLEntireAndNonzeroAtOne` of the bundle `ThetaLocalInputs`, and the existence of primes of prime norm in residue classes behind `ChebotarevDegreeOne`: [[t-ia-chebotarev]].
::::
:::::

```lean
def HeckeLEntireAndNonzeroAtOne : Prop :=
  ∀ (K : Type) [Field K] [NumberField K] (χ : HChar K), χ.IsUnitary →
    ((¬ ∃ t : ℝ, IsNormPow χ t) → ∃ Λ : ℂ → ℂ, IsHeckeL χ Λ) ∧
    (χ ≠ 1 → ∃ Λ : ℂ → ℂ, IsContAtOne χ Λ ∧ Λ 1 ≠ 0)
```

The folder `GroundTheory/GlobalFields/TateThesis`, 77 files and 16,795 lines, formalizes Tate's thesis from Poisson summation on adeles to the functional equation `TateMain` and nonvanishing on $\Re s=1$. The second published statement of this family, `HeckeTateFunctionalEquation`, gives the functional equation with explicit $\varepsilon$-factors only for totally complex fields and characters whose infinity type is compatible with a CM type, so the example above illustrates the first statement only. As our reading, this is where the two routes of the page touch: Route M in Part III is Tate's thesis done in families, and Route A uses it as one input among many.

## Where everything meets {#s-ia-assembly}

The proof of the hypothesis has a single theorem where the published theorems of [[s-ia-table]] meet the inputs of `EveryCharacter` named in [[ra-map]]: `Row0b`, `TLiftK` with `GeoOne`, and `VWin`. The assembly theorem takes `Row0b` and `VWin` as hypotheses, together with the published local Langlands statement `RecTExists`, and `TLiftK` with `GeoOne` discharge `Row0b` afterwards. Everything below it is the endgame of [[landau-endgame]], and everything above it is input.

::::: card {#t-ia-assembly kind="theorem" title="If polarized cuspidal forms over CM fields have Galois representations and the window bound holds, then no Dirichlet L-function vanishes to the right of one half" source="alpoge-lean"}
:::: statement
Assume `Row0b`: for every CM field $E$, prime $\ell$, identification of $\overline{\QQ}_\ell$ with $\CC$, and $a\ge1$, every regular algebraic cuspidal automorphic representation $\pi$ of $\GL_a$ over $E$ that is polarized by a Hecke character of the maximal totally real subfield $E^+$ has an $\ell$-adic Galois representation $r\colon\Gal(\overline E/E)\to\GL_a(\overline{\QQ}_\ell)$ with the properties `PropsB`, which, in the reading of [[integrality-and-galois]], tie $r$ at almost every place to $\pi$ through every local parametrization that obeys the laws of [[t-ia-llc]]. Assume `VWin`: the window bound of [[cohomology-window]] holds for every primitive Dirichlet character with the constant $401$. Assume `RecTExists`. Then for every $N\ge1$, every Dirichlet character $\chi$ modulo $N$, and every $s$ with $\Re s>\tfrac12$, except $s=1$ for trivial $\chi$, $L(s,\chi)\neq0$.
::::
:::: plain
Given a dictionary between automorphic forms and Galois representations, a local dictionary at each prime, and a bound on certain Galois cohomology groups on a window of scales, the chain of theta lifts and the endgame show that no Dirichlet $L$-function has a zero to the right of the critical line.
::::
:::: why
It is the interface between the parts of the proof: chapters [[definite-forms]] to [[integrality-and-galois]] produce the bound on $G_r$ from its inputs, [[cohomology-window]] produces `VWin`, and [[landau-endgame]] turns the one-sided bound into zero-freeness.
::::
:::: idea
Feed `Row0b` and `RecTExists` into the record `OpenLiteratureStatements`, build from its wrappers the nine bundles of published theorems, and pass them with the covolume bound and `VWin` to the theta-integral assembly. That assembly produces the record of hypotheses `HypsAlt` needed by the chain of theta lifts, takes Green's theorem from the bundle, and calls the endgame.
::::
:::: proof
The code proves the statement in three layers, and we follow it line by line.

1. `every_character_of_literature_of_vWin (O) (hV : VWin) : EveryCharacter` calls `every_character_of_theta_integrals_local_matching` with seven arguments, six of them built from `O`: the record `P` of 60 published results (`published_results_eigen`), the record `F` of 53 (`published_results_first`), the identities `hA : ThetaIntegralsAgree` and `hM : LocalMatching` from `theoremK_head2` applied to `EisBL` and `SiegelWeilStd`, the covolume bound `hX : CovolumeBoundOfX` from `topCovolSlim2_use_alt_alt` and its 15 geometric inputs, the local map `hL : RecTExists` from `local_langlands_gl_recT_exists_of_literature`, and `hV`.
2. `every_character_of_theta_integrals_local_matching` derives Green's theorem from the field `greenRegularCharacters` of `P` through `GreenBridge.green_of_regular`, builds a nonempty record `HypsAlt ... DefiniteSideCondition` from `P`, `F`, `hA`, `hM`, `hX`, and `hL` by `nonempty_hyps_definite_side_of_closed_bound`, and applies `every_character_of_green_v_win`.
3. `every_character_of_green_v_win (hG : Green) (hV : VWin) (h : Nonempty (HypsAlt ...))` proves `ZeroFreeAll`, no zero of $L(s,\chi)$ with $\Re s>\tfrac12$ for primitive $\chi$, by the windowed Landau argument of [[landau-endgame]], and passes to all characters through the finitely many Euler factors that separate $L(s,\chi)$ from $L(s,\chi^*)$.

The final step removes the hypotheses: `everyCharacter_of_row` applies the theorem to `⟨h, recTExists, h⟩` and to `vwin_of_row h`, and `everyCharacter` supplies `h` as `galoisLocalGlobalStrong_recParameter`, proved from `TLiftK` and `GeoOne` ([[ra-map]]). The record `HypsAlt` and the condition `DefiniteSideCondition` were read by field names only. That tied data bound a weighted count of inert prime powers from above, and that the bound gives $G_r(x)\le x^{1/2+9\varepsilon}$, was confirmed in the code along `each_unit_bound_statement`, `ch_core`, and `core_gm` ([[t-ig-core]]). The proof that the record yields a family that is `ChainTied` on windows (`TopG`) was read as a statement only: the formal proof establishes it, and we state it and do not unfold its proof here.
::::
:::: lean {decl="UpperTheory.LiteratureTheorems.every_character_of_literature_of_vWin" file="Development/AutomorphicArithmetic/ThetaCorrespondence/ThetaPairLifts/ThirdPlaceSeries/EveryCharacterOfLiteratureOfVWin.lean"}
The assembly theorem, at line 810 of the file, with the hypotheses discharged in `Development/AutomorphicArithmetic/CharacterBoxes/MainConclusion.lean`.
::::
:::: used
- The final theorems of `Main.lean`: [[s-ia-five]].
- The endgame it calls: [[landau-endgame]].
::::
:::::

In the code the assembly theorem reads as follows, and its discharge in `MainConclusion.lean` is printed in [[ra-map]].

```lean
theorem UpperTheory.LiteratureTheorems.every_character_of_literature_of_vWin (O : _root_.UpperTheory.LiteratureTheorems.OpenLiteratureStatements) (hV : UpperTheory.Top.VWin) : UpperTheory.EveryCharacter
```

The Galois input, in `.../TypeConditions/WeightsConjBis.lean`:

```lean
def Row0b : Prop :=
  ∀ (E Ω : Type) [Field E] [NumberField E] [IsCMField E] [Field Ω] [Algebra E Ω] [IsAlgClosure E Ω]
    (l : ℕ) [Fact l.Prime] (ι : Qbar l ≃+* ℂ) (a : ℕ), 1 ≤ a →
    ∀ (π : CuspSub E a) (χ : HChar (maximalRealSubfield E)), (CG.mk π).IsRegAlg → GlobalTheory.ContraPair.PolarizedPair π χ →
      ∃ (r : G E Ω →* GL (Fin a) (Qbar l)) (wt : ℤ) (HT : (E →+* Qbar l) → Multiset ℤ), PropsB Rc π ι r wt HT
```

This is, in the reading of [[integrality-and-galois]], the theorem that regular algebraic polarized cuspidal representations over CM fields have Galois representations ([[t-ig-row0b]]), with a weakened compatibility at ramified places, and the tree proves it from scratch. The window input `VWin`, printed verbatim in [[t-cw-vwin]], finds for every primitive character $\chi$ and every $\varepsilon$ in $(0,\tfrac1{52})$ windows $[Y,Y^2]$ of scales on which, for the abelian CM field $E$ built from $\chi$, the tower level $\nu(x)$, and two auxiliary primes $\mathsf q$, $\mathsf d$,
$$
\sum_{\ell}\ \sum_{k=1}^{\lfloor x^{401}\rfloor-1}\log\#\,\text{Sha}^1\big(E,\QQ_\ell/\ZZ_\ell(-k)\big)\ \le\ e^{x^\varepsilon/2},
$$
the sum running over all primes $\ell$. It is a bound on the sum of the logarithms of the orders, so on the product of the orders it says only $\prod_\ell\prod_k\#\text{Sha}^1\le\exp(e^{x^\varepsilon/2})$. The third input, `RecTExists`, is [[t-ia-llc]].

## Exploring the code yourself {#s-ia-explore}

Every Lean statement on this page can be checked against the files. The archive is linked from the note, in 14 parts, and joined it is 239,275,554 bytes with SHA-256 `9631b4f020199e580ba86178cb56c6e9b09f690c2369a80dc4334aa93f49c7fc` [@alpoge-lean]. This repository keeps the extracted tree at `sources/riemann/lean/lean/src/`, outside version control, and its folder `tools/lean/` has four Python scripts that need only the standard library. They read the files and never compile or run anything from the tree.

- `index.py` reads every file once, blanks comments and strings, and records every file, import, and declaration in one SQLite database (about two and a half minutes on eight processes).
- `closure.py` follows imports from a starting module, breadth first, and reports which files are reachable and at what depth.
- `grep.py` searches declaration names, statements, and paths and ranks the hits.
- `spine.py` traces a declaration downward through the project declarations its proof mentions.

The first two steps, from the repository's root, are these.

```sh
SRC="sources/riemann/lean/lean/src"
CACHE=".cache/lean-index"
python -I -B -X utf8 tools/lean/index.py --root "$SRC" --cache "$CACHE" --workers 8
python -I -B -X utf8 tools/lean/closure.py --cache "$CACHE" --start Main --prefix-depth 1
```

The second command printed, on 2026-11-21, the first line and the reachability table below (the table of files by depth is omitted).

```text
start Main: 175187 of 175187 project files reachable (0 not); max depth 43; 348 external modules imported
directory                                    files   reached       not        lines lines reached
Development                                 141928    141928         0     12232663     12232663
Formalism                                    18254     18254         0      3200748      3200748
GroundTheory                                  8507      8507         0      1119138      1119138
ReciprocityTheory                             3845      3845         0       563016       563016
CompanionTheory                               2027      2027         0       194218       194218
PositivityTheory                               449       449         0        55130        55130
Lemmata                                        167       167         0         9232         9232
BuildAid                                         5         5         0           20           20
Supplements                                      3         3         0           22           22
(root)                                           2         2         0           28           28
```

To find a published statement by name, search the names of definitions; this query lists those containing "Chebotarev".

```sh
python -I -B -X utf8 tools/lean/grep.py Chebotarev --cache "$CACHE" --fields name --kinds def --depth 2 --top 8 --in-closure
```

It returns five definitions in five files, among them `GlobalTheory.Published.ChebotarevDegreeOne` at `.../GaloisCohomology₂/ChebotarevDegreeOneIffCheb.lean:12` and `GroundTheory.Global.chebotarevSet` at `GroundTheory/GlobalFields/TateThesis/ChebotarevCount.lean:17`, the two forms of [[s-ia-chebotarev]].

The worked example traces the final theorem two levels down. The command and its complete output, run on 2026-11-21, are these.

```sh
python -I -B -X utf8 tools/lean/spine.py rhOfAll --cache "$CACHE" --root "$SRC" --depth 2 --fanout 8 --stmt
```

```text
- rhOfAll [theorem] Supplements/Kernels/MainTheorems.lean:9
    | theorem rhOfAll : RiemannHypothesis
  - Formalism.VW.rh_of_every [theorem] Formalism/GammaFactorNonvanishing/CritLine.lean:29
      | theorem Formalism.VW.rh_of_every (h : UpperTheory.EveryCharacter) : RiemannHypothesis
    - Formalism.VW.rh_of_right [theorem] Formalism/GammaFactorNonvanishing/RhOfRight.lean:5
        | theorem Formalism.VW.rh_of_right (hz : ∀ s : ℂ, 1 / 2 < s.re → s ≠ 1 → riemannZeta s ≠ 0) : RiemannHypothesis
  - allChi [theorem] Supplements/Kernels/MainTheorems.lean:7
      | theorem allChi : UpperTheory.EveryCharacter
    - UpperTheory.FinalTheorems.everyCharacter [theorem] Development/AutomorphicArithmetic/CharacterBoxes/MainConclusion.lean:10
        | theorem UpperTheory.FinalTheorems.everyCharacter : UpperTheory.EveryCharacter

5 declarations in the tree
```

Read it as a proof outline. One branch, `rh_of_every`, turns `EveryCharacter` into the Riemann Hypothesis by way of `rh_of_right`, whose proof uses only Mathlib. The other, `allChi`, proves `EveryCharacter` through `everyCharacter` of [[s-ia-assembly]]. Depth 3 adds `galoisLocalGlobalStrong_recParameter` and `everyCharacter_of_row`, and depth 4 reaches `galoisRepresentations_of_thetaLift`, `tLiftK`, `every_character_of_literature_of_vWin`, `recTExists`, and `vwin_of_row`, twelve declarations in all; `--body` prints each proof. The tool reads identifiers in a proof's text, so it cannot see uses through field notation, instances, or `simp`: a missing child means "not visible in the text", not "not used", and the authority on what a proof uses is Lean, after a build.

## What Part IV unfolded, and what it did not {#s-ia-coverage}

The table follows what chapters [[landau-endgame]] to [[cohomology-window]] say they unfolded and did not. A statement the code proves is proved whether or not this page unfolded it; the table says only how far this page's explanation reaches.

| Region (chapter) | Unfolded into ordinary mathematics | Read as statements only | Not opened |
| --- | --- | --- | --- |
| Endgame ([[landau-endgame]]) | `EveryCharacter` to the five theorems; the windowed Landau argument along `zeroFreeOn_of_tiedWin_cyc` to `zeroFree_of_rpow_window`; the combination $G_r$ and the window contract | `Green` (read from its shape); the fields of `HypsAlt`; `TopG`, which gives a `ChainTied` family on windows | `DefiniteSideCondition`; the structures inside `Green`; where the zero-free box `ZeroBox` is consumed |
| Theta lifts and periods ([[definite-forms]], [[multiplicity-from-lifts]]) | Forms on definite groups as vectors, lifts as matrices, `chainOp`; interlacing for Bessel periods; `RankVal` with $m$ about $\sqrt x$ | `HypsAlt` and `DefiniteSideCondition` by field theme; `BesselPeriodGGP`, whose proof was not found; `theoremK_head2` and the kernel `unf`, which no theorem identifies with a theta coefficient; `functional_lower_bound_of_conditions` | `colPer`, `besPer`; where the rank condition `RKC` is proved for the datum; which valuation bound feeds the per-lift exponents |
| Lifts, integrality, Galois ([[integrality-and-galois]]) | `Row0b` from `GeoOne` and `TLiftK`, with the parity trick; the chain from the record `SizeData₂` through `each_unit_bound_statement`, `ch_top`, `ch_balance`, and `ch_core` to `core_gm` and $G_r(x)\le x^{1/2+9\varepsilon}$; `PairGood` and `QH.pairEx` down to its mean-square inputs | `gmA_eq`, `sigA_le`; the mean-square inputs `meanSqK`, `bad_share`, `count_bad`, `small_zeros`; `ClosedPhi`, `DescOffT`, `CoreAll`, `IsRegAlg`; the proof of `rest` | How the chain's divisibility and integrality (`ThmP`, `DGam`, `chain_ge`, `PeriodClassSumWeyl`, and the exponents of `LeafDepthGood`) feed the divisibility inequality `DIV` of `SizeData₂`; steps 14 and 15 of the note |
| Window ([[cohomology-window]]) | `VWin`, the field $E$ and the tower, the pigeonhole over scales, the split into minus and plus parts, and the gluing | `LemmaK`; `aBound_of_isTower`; the statements of the plus-part cases; base change `BaseChangeIsobaricN` | The proofs of the plus-part cases |
| Published inputs (this chapter) | `OpenLiteratureStatements` and the wrappers; `RecTExists` against `Laws`; Green; Artin reciprocity; Chebotarev; Hecke $L$-functions; `SiegelWeilStd`; arithmetic bigness; Poincaré and Lelong; resolution; Nadel; Fargues; Zarhin; Grothendieck and Messing; formal algebraization; toroidal compactification; holomorphic Lefschetz | About 160 further wrappers, by statement head and first proof layer | `CovolumeBoundOfX` and its `L3`; the hypothesis `Quoted` inside the vanishing proof; where `Good` is consumed; `KTriv`; extra axioms of `IsFullIntersectionSystem`; the 445 files of `PositivityTheory/AutomorphicForms/PublishedInputs` |

Two gaps stand out. The first is between the theta lifts and the inequalities they feed: the page confirmed that the record of divisibility and slope inequalities bounds the count of inert prime powers and so $G_r$, but not how the definite-side record `HypsAlt` produces that record from the chain (`TopG`, `DefiniteSideCondition`), nor how the chain's divisibility and integrality (`ThmP`, `DGam`, `chain_ge`, `PeriodClassSumWeyl`, and the exponents of `LeafDepthGood`) feed its divisibility inequality `DIV`. The second is the covolume bound `CovolumeBoundOfX`, whose fifteen published inputs this chapter catalogued and whose statement we did not unfold. Either name is a starting point for the tools of [[s-ia-explore]].

::: recap
- A formal proof is a statement and a term that Lean's kernel accepts. The five theorems of `Main.lean` have as statements Mathlib's `RiemannHypothesis` and four short definitions of `Statements.lean`, so they can be checked against Mathlib's definitions of $\zeta$ and $L(s,\chi)$ alone ([[s-ia-five]]).
- The tree has 175,187 files, all in the import closure of `Main` and each at most 43 import steps from it, with no `sorry`, no `axiom`, and no comments, by the repository's index and an independent search. The repository did not build the project, and a build with Lean 4.33.1 and the pinned Mathlib would add the kernel's check and the list of axioms used ([[s-ia-integrity]]).
- The "literature" statements are wrappers that state a published theorem and prove it elsewhere in the tree, and no hypothesis from the literature is left at the root ([[s-ia-literature]]). The table of [[s-ia-table]] gives 27 of them by area, with the size of each proof.
- The local Langlands statement `RecTExists` is weaker than the full correspondence ([[t-ia-llc]]), and the Chebotarev statement on the spine is a corollary of the density theorem, which the tree also proves ([[t-ia-chebotarev]]).
- Siegel's mass formula and the Siegel and Weil formula compute averages over a genus ([[t-ia-siegel]]), and Tate's thesis gives the continuation and nonvanishing of Hecke $L$-functions ([[t-ia-hecke]]).
- The assembly theorem `every_character_of_literature_of_vWin` is where `Row0b`, `VWin`, `RecTExists`, and the published bundles meet, and `everyCharacter` discharges its hypotheses: `Row0b` from `TLiftK` and `GeoOne`, `VWin` from `Row0b`, and `RecTExists` by its proof in the tree ([[t-ia-assembly]]). Chapter [[two-proofs]] sets this proof beside Route M.
:::
