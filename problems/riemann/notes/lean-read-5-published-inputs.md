# Lean reader 5: the published inputs

Region: the theorems that the proof takes from the existing literature, as they appear in the Lean tree
(`sources/riemann/lean/lean/src/`). Read 2026-11-21 with the index and `spine.py`. Nothing in `sources/` was
built or run.

Conventions in this file.

- Paths are relative to the tree root. Seven prefixes are abbreviated: `AVT/` is `Development/AbelianVarietyTheory/`,
  `AS/` is `Development/AutomorphicSpectrum/`, `WB/` is `Development/WeilBound/`, `AA/` is
  `Development/AutomorphicArithmetic/`, `RT/` is `ReciprocityTheory/`, `GT/` is `GroundTheory/`, and `TPL/` is
  `Development/AutomorphicArithmetic/ThetaCorrespondence/ThetaPairLifts/ThirdPlaceSeries/`.
- `file:N` is the line where the declaration starts, from the index.
- Lean quotations are copied from the source. Where a statement is long it is cut at `...`, and where it is shown
  on one line the source's line breaks were collapsed to single spaces (the words are unchanged).
- "Dependency cone" sizes come from running `spine.py` with depth 80 and no fan-out cap from the proof's top
  theorem, then summing the line counts of the distinct files that hold the declarations reached. They count whole
  files, so they overstate what is needed, and the tool cannot see references through field notation, instances
  or `simp` sets, so they can also understate. They overlap, so they must not be added. Where the tool visibly
  missed the main step I say so.
- Classical names are my identification from the shape of the statements, not the tree's. Authors are named
  only where I am sure.

## 0. The finding that reorganizes this region

The structure `OpenLiteratureStatements` is not a list of the published theorems the proof uses. It has three
fields, and all three are proved in the tree.

```lean
structure UpperTheory.LiteratureTheorems.OpenLiteratureStatements : Prop where
  caraianiLocalGlobalDual : _root_.UpperTheory.One.M.Row
  localLanglandsExists : _root_.UpperTheory.Zero.LLC.RecTExists
  galoisRepOfPolarizedPairLit : _root_.UpperTheory.One.M.Row
```

(`TPL/EveryCharacterOfLiteratureOfVWin.lean:215`.) `UpperTheory.One.M.Row` is, by its definition
(`AA/Foundations/UnitarySphericalFixing/SatakeParameters/RecT.lean:6`), `Row0b recT`, the statement that every
regular algebraic polarized cuspidal automorphic representation of $GL_a$ over a CM field has an $\ell$-adic Galois
representation with the properties `PropsB` (reader 3's region). The assembly
`everyCharacter_of_row` (`AA/CharacterBoxes/MainConclusion.lean:7`) feeds the structure as
`⟨h, recTExists, h⟩` with `h = galoisLocalGlobalStrong_recParameter`, which the tree proves from `TLiftK` and
`GeoOne`. So at the root of the proof nothing is assumed.

The file `TPL/EveryCharacterOfLiteratureOfVWin.lean` (814 lines, 208 imports) contains 195 `theorem` lines. The
185 of them with the signature `(O : OpenLiteratureStatements) : T := <proof>` are one-line wrappers: each states
a published theorem $T$ (a `def T : Prop` in a `PublishedTheorems` folder) and discharges it by a proof
elsewhere in the tree. The argument `O` is used in four places only (lines 284, 286, 460, 618): three wrappers and one bundle, to
extract the three fields. The other 182 wrappers ignore it. The remaining theorems assemble these into bundles
(`published_results_eigen`, `_first`, `_arithmetic`, `_analytic`, `_local`, `literature_local`,
`literature_automorphy`, `literature_cohomology`, `literature_nonexistence`), and
`every_character_of_literature_of_vWin` (line 810) hands the bundles to
`every_character_of_theta_integrals_local_matching`. One slot, `siegel_eisenstein_simple_pole`, is
`UnusedSlot72 := True` (line 505), a placeholder.

So the word "literature" names the standard theorems whose statements the project wrote down first and then
proved; it does not mark an assumption. The task of this reader reduces to a catalog:

1. what each statement says;
2. whether it is the standard theorem;
3. where it is proved and how big that proof is.

The three families of source folders to know:

| Folder | Files | Lines | What it holds |
| --- | ---: | ---: | --- |
| `AVT/PublishedTheorems/` | 493 | 56,194 | Statements `def X : Prop` of most published theorems, with small supporting lemmas |
| `WB/CoreStatements/PublishedTheorems/` | 540 | 48,718 | Statements and proofs for Clozel purity, Poitou-Tate, Jacquet-Shalika, finiteness, nef numerics and others |
| `AS/PublishedTheorems/` | 23 | 1,543 | Statements for Fargues exactness, Zarhin, Poincare-Lelong, resolution, principalisation |

## 1. What this region proves

Every statement below is a `Prop`; the proof of each is in the tree. Entry fields: Lean name and place, statement,
ordinary mathematics, classical identity and match, where proved, use on the spine.

### The bundles that the assembly consumes

`every_character_of_literature_of_vWin` (`TPL/EveryCharacterOfLiteratureOfVWin.lean:810`):

```lean
theorem UpperTheory.LiteratureTheorems.every_character_of_literature_of_vWin (O : _root_.UpperTheory.LiteratureTheorems.OpenLiteratureStatements) (hV : UpperTheory.Top.VWin) : UpperTheory.EveryCharacter
```

Its body calls `UpperTheory.Lit.every_character_of_theta_integrals_local_matching` with seven arguments, each
built from the wrappers:

| Argument | Built by | What it is | Size |
| --- | --- | --- | --- |
| `P : UnitaryGroupThirdPlaceHypotheses` | `published_results_eigen` (:666) | record of 60 fields: Clozel, Green, Hecke $\ell$-adic characters, Chebotarev, Galois representations of polarized cusp forms, base change, Siegel-Weil, doubling, Bernstein-Zelevinsky, Artin, de Rham, and others | 60 fields |
| `F : ThetaLocalInputs` | `published_results_first` (:727) | record of 53 fields: Green series, Linnik, complex multiplication, Weil representation, Siegel-Weil, Rallis, Hecke $L$, Howe duality, metaplectic, Stone-von Neumann, and others | 53 fields |
| `hA : ThetaIntegralsAgree`, `hM : LocalMatching` | `theta_integrals_agree_and_local_matching_of_literature` (:565) | from `eis_bl` (Eisenstein continuation with growth) and `siegel_weil_std` through `PositivityTheory.ThKR.theoremK_head2` | 2 inputs |
| `hX : CovolumeBoundOfX` | `topCovolSlim2_use_alt_alt` (`TPL/TopCovolSlim2Use.lean:16`) | from 15 geometric inputs, listed next | 15 inputs, one of them the 28-field bundle |
| `hL : RecTExists` | `local_langlands_gl_recT_exists_of_literature` (:313) | local Langlands, see entry E3 | 1 |
| `hV : VWin` | argument | reader 4's region | |

The 15 inputs of `topCovolSlim2_use_alt_alt`, in the order of its hypotheses: `ResolutionCharZero`,
`PrincipalisationCharZero`, `PoincareLelongInv`, `HSUse` (arithmetic Kleiman, an arithmetic Hilbert-Samuel
statement and nef volume), `MoriwakiBigStatement`, `FarguesExact`, `ZarhinStatement`, `NefRR`,
`SiegelToroidalIntegral`, `ToroidalForFanKS`, `SemiAbelianLieSeminegative`, `PointSeparationPair`, `ArDegree`,
`PublishedHodgeBundleTheorems`, `GrothendieckDeformation`. The 28-field bundle
`PublishedHodgeBundleTheorems` (`AA/ThetaCorrespondence/ThetaPairLifts/HodgeBundleWeights/ToKnownTheoremsOf.lean:7`)
has fields `p1`..`p26` and `q1`..`q18` (toroidal compactification, volume bounds, Arakelov calculus, abelian de Rham
cohomology, ray class fields, semistable reduction, strong approximation, Green series, Chern-Weil, Landherr, Hasse
norm, semiabelian extension, lowest alcove, principal polarization, torsion count, Grothendieck-Messing, prismatic
Dieudonne, Kawamata-Viehweg, nef numerics, $L^2$ extension, arithmetic Hilbert-Samuel, Chow forms, cycle heights,
Serre sections, Nadel vanishing, principalization, formal algebraization). This is the "roughly twenty" of the
assignment: it is 28 in the code.

The output `CovolumeBoundOfX` (`TPL/LiftLambdaBound.lean:60`) is a statement `L3` about the covolume
of a lattice attached to a family on the Siegel and unitary toroidal compactifications, "eventually at all points"
of a family. I did not unfold `L3` or `FamHyp`; they belong to reader 2.

### E1. `OpenLiteratureStatements` and `Row`

Shown in section 0. Role: the interface by which `RecTExists` and `Row0b` enter. Proved by
`recTExists` (E3) and `galoisLocalGlobalStrong_recParameter` (reader 3).

### E2. Wrapper theorems

Shown in section 0.

### E3. Local Langlands for $GL_n$: `RecTExists`

Where: `UpperTheory.Zero.LLC.RecTExists`, `AA/Foundations/LocalLanglands/IsRecTOfIsRec.lean:78`.

```lean
def RecTExists : Prop :=
  ∀ (E Ω : Type) [Field E] [NumberField E] [Field Ω] [Algebra E Ω] [IsAlgClosure E Ω] (A : ValuationSubring Ω)
    (w : HeightOneSpectrum (𝓞 E)) (h : IsPlaceOver A w), ∃ rc, IsRecT h rc

def IsRecT (rc : IrrGL (w.adicCompletion E) → WD h) : Prop := ∃ a ha, LawsT (h := h) a ha rc
```

Ordinary mathematics. $E$ is a number field, $\Omega$ an algebraic closure, $A$ a valuation ring of $\Omega$
over a finite place $w$ of $E$, so the data are a local field $F=E_w$ and a decomposition group. `IrrGL F` is the
set of pairs $(n,[\pi])$ of an integer $n\ge 1$ and an isomorphism class of an irreducible smooth representation
$\pi$ of $GL_n(F)$. `WD h` is the set of isomorphism classes of Weil-Deligne representations of the Weil group
attached to $A$. `RecTExists` says: there is a map $\mathrm{rc}:\{\pi\}\to\{\text{Weil-Deligne representations}\}$
and a local Artin map $a:W_F\to F^\times$ (`IsLocalArtin`) such that the following laws `LawsT`
(`IsRecTOfIsRec.lean:55`) hold:

- `dim`: $\dim \mathrm{rc}(\pi)=n$.
- `one`: for a character $\chi$, $\mathrm{rc}(\chi)=\chi\circ a$.
- `langlands`: if $\pi$ is the Langlands quotient of a multiset of segments, $\mathrm{rc}(\pi)$ is the sum over
  segments of the corresponding twisted special representations.
- `cusp`: $\mathrm{rc}(\pi)$ is irreducible when $\pi$ is cuspidal.
- `nu`: $\mathrm{rc}(\pi\,|\det|^s)=\mathrm{rc}(\pi)\otimes|\cdot|^s$.
- `absCentral`: $|\det \mathrm{rc}(\pi)(\sigma)| = |\omega_\pi(a(\sigma))|$.
- `twist`, `central`, `dual` (contragredient), `inj` (injectivity), `depth` (depth zero gives tame): these five are
  required only when $\pi$ is `Good`.
- `type` (`TypeLaw`, :35): a compatibility between inertial restriction and Green's cuspidal characters.

`Good` (:24) means that the cuspidal support of $\pi$ consists of characters or of twists $y_0\otimes\chi$ of
representations $y_0$ having a nonzero vector fixed by the first congruence subgroup $K_1$ (depth zero), and that in
the second case the local field is $\mathbb{Q}_g$ for a prime $g$ (`GoodCusp`, :20).

Classical identity and match. This is the local Langlands correspondence for $GL_n$ over a $p$-adic field (Harris
and Taylor, *The geometry and cohomology of some simple Shimura varieties*, Ann. of Math. Studies 151, 2001;
Henniart, Invent. Math. 139, 2000; Scholze, Invent. Math. 192, 2013). The Lean statement is not that theorem. The
full statement is in the tree too, as `GlobalTheory.LocLanglands.Laws` and `IsRec`
(`AVT/PublishedTheorems/AutomorphicForms₂/LocalLanglandsGL.lean:29,76`): it adds `bij` (the map is a bijection),
`eps` (agreement of pair $\varepsilon$-factors with Rankin-Selberg theory), `det`, `prod`, `supp`, and requires
`twist`, `central`, `dual` for all $\pi$. `LawsT` drops bijectivity and the $\varepsilon$-factor law, and
restricts five laws to `Good` representations. It is a weakening, designed to be provable by a direct route: the
map is built from the local Artin map, on the cuspidal representations that are `Good` by Green's theorem (E4)
and the depth-zero type theory, and on the other cuspidals by an arbitrary choice ("junk": `r x = (J x.1).lpTw (e x)`
in `cuspEx`, `AA/Foundations/LocalLanglands/LocalCentralUnits/CuspEx.lean:168`), then extended to all
representations by the Langlands classification. The `Good` restriction, with $F=\mathbb{Q}_g$, is exactly what the
global argument needs, as far as I can tell; I did not trace where the `Good` hypothesis is consumed.

Proved: yes, `UpperTheory.Zero.LLC.recTExists`
(`AA/Foundations/LocalLanglands/LocalCentralUnits/RecTExists.lean:20`, 47 lines of proof). Steps:
`artEx` (local Artin map from the global one, `.../ArtEx.lean:7`, using global Artin reciprocity (E5), the
injectivity of local ideles into the Galois group (which needs Chevalley's units lemma, E13), and local
uniqueness); `cuspEx` (the map on cuspidals, built on `goodMap`, `.../GoodMap.lean:144`);
`GlobalTheory.LocLanglands.exists_isLExt` (extension from cuspidals to all through the Langlands classification
and the multisegment statements `LanglandsExhaustionGL`, `LanglandsMultisegments`, E15); then `extDim`, `extTw`,
`extDual`, `extInj`, `extDepth`, `typeIff` (the laws). Dependency cone: 11,067 declarations, 1,790 files,
236,746 lines (788 files in `AVT`, 421 in `AS`, 138 in `GT/GlobalFields`, 120 in `WB`).

Use: `hL` in `every_character_of_literature_of_vWin`; the second field of `OpenLiteratureStatements`; the
parametrization `Rc` in `PropsB.away` of `Row0b` (reader 3), through `recT`.

### E4. Green's theorem: `Green`

Where: `GlobalTheory.GLq.Green`, `AVT/Definitions/NonGaloisDescent/LabelDatum.lean:108`. The published form
`GreenCuspidal := Green` is `AVT/PublishedTheorems/GaloisCohomology₂/GreenCuspidalIff.lean:8`.

```lean
def Green : Prop
:=
  ∀ (g : ℕ) [Fact g.Prime] (L : LabelDatum g) (d : ℕ), 0 < d → ∃ τ : (ZMod g)[X] → Gn g d → ℂ,
    (∀ P, IsPrimeLab d P → IsCuspOf L P (τ P) ∧ τ P 1 = ∏ i ∈ Finset.Ico 1 d, ((g : ℂ) ^ i - 1)) ∧
    (∀ P P', IsPrimeLab d P → IsPrimeLab d P' → τ P = τ P' → P = P') ∧
    ∀ χ : Gn g d → ℂ, IsCusp χ → ∃ P, IsPrimeLab d P ∧ χ = τ P
```

Ordinary mathematics. $G_n(g)=GL_n(\mathbb{F}_g)$ with $g$ prime. `LabelDatum` (:81) fixes an embedding
`teich` of $\overline{\mathbb{F}}_g^\times$ into $\mathbb{C}^\times$ and a compatible system of generators `gen d` of
$\mathbb{F}_{g^d}^\times$. `IsPrimeLab d P` (:91) says $P\in\mathbb{F}_g[X]$ is monic, irreducible, has nonzero
constant term, and degree $d$. `IsCusp` (:64) says the class function is the character of an irreducible
representation and has zero restriction to every proper parabolic: `0 < a < d → res a (d-a) χ 1 1 = 0`.
`IsCuspOf L P χ` (:93) adds that on every elliptic element with characteristic polynomial irreducible of degree $d$ and
root $z$, $\chi(y)=(-1)^{d-1}\sum_{i<d}\theta_x(z^{g^i})$ where $x$ is a root of $P$ and $\theta_x$ is the
character of $\overline{\mathbb F}_g^\times$ given by `teich` and `gen`. The theorem: for each $d$ there is a map
$P\mapsto\tau_P$ from such polynomials to characters, with $\tau_P$ cuspidal of degree $\prod_{i=1}^{d-1}(g^i-1)$,
injective, and onto the set of all cuspidal irreducible characters.

Classical identity and match. This is Green's classification of the cuspidal characters of $GL_n(\mathbb{F}_q)$
(J. A. Green, Trans. Amer. Math. Soc. 80, 1955), restricted to prime $q=g$: the cuspidal irreducible characters are
indexed by Galois orbits of regular characters of $\mathbb{F}_{q^d}^\times$, equivalently by degree-$d$ irreducible
polynomials with nonzero constant term. The values on elliptic elements and the degree are the standard ones. The
restriction to prime fields is a special case, and is all that `Good` ($F=\mathbb{Q}_g$, residue field $\mathbb{F}_g$)
needs. A sibling statement `GreenRegularCharacters` (`AVT/PublishedTheorems/GaloisCohomology₂/GreenRegularCharacters.lean:13`)
is the same for general $K$ with $|K|=g^d$ and characters $\theta$ of $K^\times$.

Proved: yes. `PositivityTheory.GreenCharacters.green`
(`WB/CoreStatements/FiniteTypeHarishChandra/GreenCuspLabels/GreenCuspidal.lean:268`, `greenCuspidal` at :303).
Dependency cone: 582 declarations, 224 files, 17,396 lines, so it is a small input.

Use: field `greenCuspidal` and `greenRegularCharacters` of `P`, `greenSeriesSt` of `F`, `GreenBridge.green_of_regular`
in `every_character_of_theta_integrals_local_matching`, and the type law of E3. This is also one of the two
hypotheses of `every_character_of_green_v_win` (reader 1's chain: `hG : Green`).

### E5. Global Artin reciprocity

Where: `GlobalTheory.Published.GlobalArtinReciprocity`,
`AVT/PublishedTheorems/AutomorphicForms₂/ExistsUniqueHcharOfFiniteOrder.lean:70`; `IsGlobalArtin` at :25.

```lean
def GlobalArtinReciprocity : Prop := ∀ (E Ω : Type) [Field E] [NumberField E] [Field Ω] [Algebra E Ω] [IsAlgClosure E Ω], ∃ art : Ideles E →* Gab E Ω, IsGlobalArtin art

structure IsGlobalArtin (art : Ideles E →* Gab E Ω) : Prop where
  quot : IsOpenQuotientMap art
  ker : art.ker = ((diagUnits E).range ⊔ infConn E).topologicalClosure
  ine : ∀ (v : HeightOneSpectrum (𝓞 E)) (A : ValuationSubring Ω), IsPlaceOver A v → ∀ g : Gab E Ω, (∃ x, IsUnitAt v x ∧ art (localIdele E v x) = g) ↔ ∃ σ ∈ Ine (F := E) A, toAb E Ω σ = g
  frob : ∀ (v : HeightOneSpectrum (𝓞 E)) (A : ValuationSubring Ω), IsPlaceOver A v → ∀ g : Gab E Ω, (∃ x, IsUnifAt v x ∧ art (localIdele E v x) = g) ↔ ∃ σ : G E Ω, IsFrob (F := E) A (normV v) σ ∧ toAb E Ω σ⁻¹ = g
  dec : ∀ (v : HeightOneSpectrum (𝓞 E)) (A : ValuationSubring Ω), IsPlaceOver A v → (art.comp (localIdele E v)).range.topologicalClosure = (Dec (F := E) A).map (toAb E Ω)
```

(The `structure` is shown with its fields laid out on lines; the source has the same fields.)

Ordinary mathematics. `Gab E Ω` is the topological abelianization of the absolute Galois group. There is a
continuous homomorphism from the idele group onto $G_E^{ab}$, open as a quotient map, whose kernel is the closure
of $E^\times\cdot C_\infty$ (the connected component of the identity of the infinite ideles), such that local
units go to inertia, local uniformizers go to inverses of arithmetic Frobenius elements (so the convention is
geometric Frobenius for uniformizers), and the closure of the image of $E_v^\times$ is the decomposition group.

Classical identity and match. Artin reciprocity in idelic form with the local-global compatibilities, as in
Cassels-Frohlich, *Algebraic Number Theory* (the chapters on global class field theory). The Lean form is a standard one and includes the
existence theorem (open quotient plus kernel). Equivalent: it matches.

Proved: yes. `GlobalTheory.globalArtinReciprocity_holds`
(`AVT/Proofs/IwasawaDecomposition/GlobalArtinReciprocityHolds.lean:5`) is one line:
`CompanionTheory.FamInh.globalArtin` (`CompanionTheory/AutomorphicTheory/PlaceSeparation/IsOpenQuotientMapArt0.lean:233`),
built on `art0` (:19), from `GT.Global.artinMap` and `GT.LocalField.topologicalAbelianizationEquiv`. I cannot inspect Mathlib (it is not on disk), but the tree
contains its own class field theory: dependency cone 2,755 declarations, 235 files, 50,213 lines (132
files in `GT/GlobalFields`, 84 in `GT/LocalFields`). The tree also holds the Tate-thesis tower (E7), `RT/ClassFieldTheory`
(91 files, 11,830 lines).

Use: field `globalArtinReciprocity` of `P`; local Artin map in E3; `rayClassFieldSt`, `rayCharacterArtin`,
`heckeLAdicCharacter` (Hecke characters give $\ell$-adic characters, E7) are derived from it
(`PositivityTheory.Stage1.PM`, `WB/CoreStatements/StandardPublishedResults/StandardTheoremStatements/GlobalArtinReciprocity.lean:8-15`).

### E6. Chebotarev

Where: `GlobalTheory.Published.ChebotarevDegreeOne`,
`AVT/PublishedTheorems/GaloisCohomology₂/ChebotarevDegreeOneIffCheb.lean:12`.

```lean
def ChebotarevDegreeOne : Prop := ∀ (F Ω : Type) [Field F] [NumberField F] [Field Ω] [Algebra F Ω] [IsAlgClosure F Ω] (L : IntermediateField F Ω) [FiniteDimensional F L] [IsGalois F L] (g : L ≃ₐ[F] L) (S : Set (HeightOneSpectrum (𝓞 F))), S.Finite → ∃ v : HeightOneSpectrum (𝓞 F), v ∉ S ∧ v.asIdeal.inertiaDeg ℤ = 1 ∧ ∃ B : ValuationSubring Ω, IsPlaceOver B v ∧ Ine (F := F) B ≤ L.fixingSubgroup ∧ ∃ σ : G F Ω, IsFrob B (normV v) σ ∧ AlgEquiv.restrictNormalHom L σ = g
```

Ordinary mathematics. For a finite Galois extension $L/F$ of number fields, any $g\in\mathrm{Gal}(L/F)$ and any
finite set $S$ of places, there is a place $v\notin S$ with residue degree one over $\mathbb Q$ ($f(v/p)=1$),
unramified in $L$, and a Frobenius element at a place above $v$ restricting to $g$.

Classical identity and match. Chebotarev's density theorem implies it (positive density of such $v$). The Lean
statement keeps only the existence of one degree-one prime outside a finite set: strictly weaker, a corollary. A
twin `TwSys.Cheb` (`AVT/Definitions/NonGaloisDescent/GaloisSideTwistedSelmerAuxiliaryPrimes.lean:11`) is the same
with $U$ an open normal subgroup of $G_F$.

Proved: yes, by a route that avoids the density theorem. `GlobalTheory.Published.chebotarevDegreeOne'`
(`AVT/Proofs/InertiaEigenvalues/ChebotarevDegreeOne.lean:17`, 49 lines) uses a cyclotomic crossing field (a prime
$m\equiv 1\bmod [L:F]$ with $\Phi_m$ irreducible over $F$, `exists_prime_dvd_sub_one_irreducible_cyclotomic`,
`ChebCross.cross`) and the existence of primes of $F$ of prime norm in a prescribed class mod $m$
(`CyclotomicPrimes.exists_prime_absNorm_eq_of_irreducible_cyclotomic`, `.../ExistsPrimeAbsNormEqOfIrreducibleCyclotomic.lean:20`).
The latter is a Dirichlet-type argument for number fields: it uses the Dedekind zeta Euler product with
$(s-1)\zeta_F$ entire and nonvanishing at $1$ of norm-twisted $L$-functions (Tate-thesis material, E7) and
summability of $\sum N\mathfrak p^{-1}$ over primes of non-prime norm. Dependency cone: 224 declarations, 66
files, 6,536 lines. The full density theorem is also in the tree:
`GT/GlobalFields/TateThesis/Chebotarev.lean:198` (`hasDirichletDensity_chebotarevSet`: Dirichlet density
$|C|/|G|$ for a conjugation-stable $C$, and :239 for the set of unramified primes with Frobenius in $C$), with
`ChebotarevAbelian`, `ChebotarevCount`, `ChebotarevFrobenius`, and `RT/Chebotarev/` (47 files, 4,382 lines). I
did not decide which of the two routes the published statement ultimately calls.

Use: field `chebotarevDegreeOne` of `P`; `cheb` of the twisted-Selmer system (Galois-cohomology bookkeeping,
reader 3). Note: the note's step 11 (the Iwasawa tower) and step 17 (the cohomology classes that cannot be killed)
need auxiliary primes; the use of Chebotarev there is my reading, not checked.

### E7. Tate's thesis and the Hecke $L$-functions

Where: `AVT/PublishedTheorems/Divisors₂/HeckeTateFunctionalEquationCM.lean:244`,
`.../TwistedTraceFormula/HeckeLEntireAndNonzeroAtOne.lean:28`, `.../TwistedTraceFormula/HeckeLPartialContinuationHolds.lean:15`.

```lean
def HeckeTateFunctionalEquation : Prop := ∀ (E : Type) [Field E] [NumberField E] [IsTotallyComplex E] (I : Type) [Fintype I] (φ : I → E →+* ℂ), IsCMType φ → ∀ (χ : HChar E) (n : I → ℤ) (a : HeightOneSpectrum (𝓞 E) →₀ ℕ), IsUnitary χ → Formalism.L2.Host.HChar.HasInf χ φ n → (∃ i, n i ≠ 0) → (∀ w, ExpAt χ w (a w)) → ∃ Λ Λ' : ℂ → ℂ, IsCompletedL χ n Λ ∧ IsCompletedL χ⁻¹ (fun i => -n i) Λ' ∧ ∀ s : ℂ, Λ s = archEps n * finEps χ a s * Λ' (1 - s)

def HeckeLEntireAndNonzeroAtOne : Prop := ∀ (K : Type) [Field K] [NumberField K] (χ : HChar K), χ.IsUnitary → ((¬ ∃ t : ℝ, IsNormPow χ t) → ∃ Λ : ℂ → ℂ, IsHeckeL χ Λ) ∧ (χ ≠ 1 → ∃ Λ : ℂ → ℂ, IsContAtOne χ Λ ∧ Λ 1 ≠ 0)
```

Ordinary mathematics. For a Hecke character $\chi$ of a number field: unless $\chi$ is a power of the norm, $L(\chi,s)$ continues
to an entire function; for $\chi\ne1$ it is continuous at $s=1$ with $L(\chi,1)\neq0$. The first statement is the
functional equation of the completed $L$-function of a unitary Hecke character of a totally complex field $E$
of infinity type $(n_i)$ relative to a CM type $\varphi$, with explicit $\varepsilon$-factors `archEps` and `finEps`.

Classical identity and match. Hecke's theorem and the functional equation of Hecke $L$-functions, in the adelic
proof of Tate (Tate's thesis, 1950, reprinted in Cassels-Frohlich). The entire/nonvanishing form is the
standard one. The functional equation is stated only for totally complex $E$ and characters with an infinity type
compatible with a CM type, with an explicit $\varepsilon$: a special case of the general one.

Proved: yes, and this is a ground-up Tate thesis. `GT/GlobalFields/TateThesis/` is 77 files, 16,795 lines:
adele Poisson summation (`AdelePoisson`, `LatticePoisson`), Gaussians and Schwartz-Bruhat functions, local Euler
factors, the global zeta integral `GlobalZeta`, `TateMain` (differentiable except at the two poles, residues,
`tateZeta F χ s = tateZeta (adelicFourier K F) χ⁻¹ (1-s)`, `TateMain.lean:341`), `HeckeTheorem*` (completed $L$-function with
a root number, `HeckeTheoremFE.lean:19-104`), `Nonvanishing*` (nonvanishing on $\mathrm{Re}\,s=1$), `DedekindZetaContinuation`.
The published statement is closed by `GlobalTheory.CompanionTheory.HeckeFE.heckeTateFunctionalEquation`
(`AS/Proofs/GlobalProofs/HeckeTateFunctionalEquation.lean:254`) and `HeckeLEntireAndNonzeroAtOne_holds`
(`AVT/Proofs/TwistedOperators/HeckeLEntireAndNonzeroAtOneHolds.lean:112`; dependency cone 277 declarations, 59 files,
8,678 lines). For the functional equation the tool reported a cone of only 5 declarations because the main step is
reached through field notation; I take the size to be the `TateThesis` folder, 77 files, 16,795 lines.

Use: fields `heckeLEntireAndNonzeroAtOne`, `heckeLPartialContinuation`, `heckeTateFunctionalEquation'` of the
bundles (`literature_nonexistence.fe`); and, as just seen, through Dirichlet-type prime existence in E6 and
E11 (Linnik).

### E8. Siegel-Weil and the Eisenstein inputs

Where. Four statements and one Eisenstein input:

| Name | Place | What |
| --- | --- | --- |
| `GlobalTheory.ThK.Dbl.SiegelWeilStd` | `WB/ThetaLifts/LatticeBasics/HypothesesS.lean:11` | Siegel-Weil, definite case, used to get `ThetaIntegralsAgree` |
| `GlobalTheory.Published.WeilSiegelFormulaUnitary` | `AVT/PublishedTheorems/TwistedTraceFormula/WeilSiegelFormulaUnitary.lean:56` | Siegel-Weil for unitary groups, Weil's range |
| `GlobalTheory.Published.SiegelWeilUnitaryConvergent` | `AVT/PublishedTheorems/SiegelWeil₂/SiegelWeilUnitaryConvergent.lean:18` | convergent range, with Eisenstein value |
| `GlobalTheory.Published.SiegelWeilUnitarySchrodinger` | `AVT/PublishedTheorems/SiegelWeil₂/SiegelWeilUnitarySchrodinger.lean:107` | Schrodinger-model form |
| `GlobalTheory.ThK.Dbl.EisBL` | `WB/ThetaLifts/LatticeBasics/HypothesesE.lean:46` | continuation and moderate growth of the Siegel Eisenstein series on the doubled unitary group |

```lean
def SiegelWeilStd : Prop := ∀ (F E : Type) [Field F] [NumberField F] [Field E] [NumberField E] [Algebra F E] (σ : E →ₐ[F] E) (B : Base F E) (m n : ℕ) (A : Spc F E m) (Y : Spc F E n) r s r' s', B.IsGood σ → 1 ≤ m → 1 ≤ n → min r s = 0 → (A.IsHerm σ B r s ∧ Y.IsSkew σ B r' s' ∨ A.IsSkew σ B r s ∧ Y.IsHerm σ B r' s') → ∀ χ : Chr F E, IsHecke F E χ → ResEtaPow (Units.map (algebraMap F (AF F)).toMonoidHom).range χ m → ∀ (κ : Type) [Fintype κ] dd om S l, IsDbl (σ := σ) (A := A) (Y := Y) (κ := κ) B.ψ dd χ om S l → ∀ b K a, IsFrame2 σ Y b → IsStdK (σ := σ) (Y := Y) B b K → IsHgt K a → ∀ (μ : Measure (UA σ A.J)) (D : Set (UA σ A.J)), μ.IsHaarMeasure → IsFundamentalDomain (ratU σ A.J) D μ → ∀ Φ ∈ schA F κ, FiniteDimensional ℂ (Submodule.span ℂ (Set.range fun k : K => om k.1 Φ)) → EisValueAt (flat a (fun x => l (om x Φ)) (((m : ℂ) - n) / 2)) (((m : ℂ) - n) / 2) fun x => (if n < m then 1 else 2) * ⨍ g in D, thetaSum F (om x (S g Φ)) ∂μ
```

Ordinary mathematics (for `SiegelWeilStd`). $E/F$ is a CM extension of number fields with involution $\sigma$.
$A$ and $Y$ are lattices-with-form of ranks $m$ and $n$ (`Spc`), one Hermitian of signature $(r,s)$ with
$\min(r,s)=0$ (I read this as the definite case, in which the unitary group is compact at the real places; I did not unfold `IsHerm`) and the other skew-Hermitian.
`IsDbl` packages the doubled Weil representation, a splitting and a linear form $l$ producing a flat section of the
induced representation; `EisValueAt f s₀ val` (`HypothesesS`-side, `WB/ThetaLifts/LatticeBasics/Hypotheses2.lean:76`)
says that the Eisenstein series $\sum_\gamma f(s)(\gamma x)$ converges for $\mathrm{Re}\,s$ large, continues
meromorphically, is analytic at $s_0=(m-n)/2$, and takes the value `val` there. The statement: that value equals
$\kappa$ times the mean over the compact quotient $U(A)\backslash U(A)(\mathbb A)$ of the theta sum, with
$\kappa=1$ if $n<m$ and $2$ otherwise. In words: the average of the theta lift over a definite unitary group is a
Siegel-Eisenstein series at the central point.

The other three are in Weil's convergent range. `SiegelWeilUnitaryConvergent` takes spaces $A,B$ with
$\mathrm{rk}A<\mathrm{rk}B\le 2\,\mathrm{rk}A$ and $\mathrm{rk}A+\mathrm{wittIdx}\,B<\mathrm{rk}B$ and asserts
integrability of the theta kernel over $U(B)\backslash U(B)(\mathbb A)$ and equality of its mean with the Eisenstein
value `EisValueAt A (flat ...) (sZero A B)`. `WeilSiegelFormulaUnitary` asserts the same integrability with a
continuous-seminorm bound, and, when $2\,\mathrm{rk}A<\mathrm{rk}B$, the identity of the coset sum with the mean
of the theta kernel.

Classical identity and match. The Siegel-Weil formula (Weil, "Sur la formule de Siegel dans la theorie des groupes
classiques", Acta Math. 113, 1965) in the convergent range, and its form for unitary groups (Kudla and Rallis,
*On the Weil-Siegel formula*, J. reine angew. Math. 387, 1988, for the regularized extension beyond the range).
`SiegelWeilStd` is the Siegel-Weil formula restricted to definite groups, which is the classical "mass formula"
case; the conditions of the Lean statements match Weil's range. The three variants state the same identity in
different models. They are special cases of the general formula, not different results.

Proved: yes. `PositivityTheory.SiegelWeilFormula.Fin.siegelWeilStd`
(`WB/CoreStatements/AutomorphicKernels/SiegelWeilFormula/SiegelWeilStandard/SiegelWeilStd.lean:8`) comes from
`siegelWeilStd_pre (hP : TW.Poisson) (hCT : CTSplit)`: Poisson summation for the Weil representation plus a
constant-term splitting `CTSplit`, itself from `IndepDom`, `CptDom`, `AbsConv`, `FirstEq`, `SecLaw`. The
convergent forms are `UpperTheory.Lit.Sw47.convergent` and `weilUnitary`
(`AA/ThetaCorrespondence/FockModels/FockAnisoFree.lean:10,12`) and
`PositivityTheory.SiegelWeilCoefficients.field` (`WB/RepresentationTheoryGL/EisensteinSeries/.../CoefND.lean:24`).
`EisBL` is `PositivityTheory.RgEis.Hd.eisBL` (`.../SiegelMultOf.lean:101`), through `SiegelEisensteinSeries.BRoad.eisBL_of`
from `EisHalf` (half-plane convergence), `SiegelMult` and `OneVarFactor`. Dependency cones: `siegelWeilStd` 20,451
declarations, 3,333 files, 397,791 lines (1,038 in `WB`, 776 in `AS`, 587 in `CompanionTheory/SpectralGeometry`, 513 in
`AVT`); `eisBL` 2,913 declarations, 385 files, 58,584 lines.

Use: `hA`, `hM` of the assembly (through `theoremK_head2`), and fields `weilSiegelFormulaUnitary`,
`siegelWeilUnitaryConvergent`, `siegelWeilUnitarySchrodinger`, `rallisInnerProductConvergent`, `doublingMethod`
of `P` and `F`. The note's steps 8 and 12 (iterated theta lifts, seesaw, Rallis) rest on these.

### E9. Moriwaki bigness: `MoriwakiBigStatement`

Where: `ReciprocityTheory.ChartRestriction.G.ArakelovGeometry.MoriwakiBigStatement`,
`RT/ReductiveGroups/ArithmeticGeometry/ArakelovGeometry/MoriwakiSt.lean:29`.

```lean
def MoriwakiBigStatement : Prop :=
  ∀ (K : Type) [Fintype K] (ι : K → Type) [∀ k, Fintype (ι k)] (Ω : Type) [Field Ω]
    (y : (Σ k, ι k) → Ω) (D : ℕ) (A : HermLine ι) (P0 : Ideal (MRing ι)) (II : IntersectionSystem),
    IsIntersectionSystem II → IsArithVar (mCoordIdeal y) (D + 1) → Birational y →
    P0 ≤ mCoordIdeal y → IsSemipositiveRel P0 (mCoordIdeal y) A → IsConjInvariantH A →
    NefOnFibres (mCoordIdeal y) A.a → NefOnGeneric (mCoordIdeal y) A →
    II K ι (mCoordIdeal y) (D + 1) (fun _ => A) ≤
      arVolP (IsSmallH (mCoordIdeal y) y A) (chartLat y A.a) 1 D
```

Ordinary mathematics (definitions in section 2). The arithmetic variety is the prime ideal $P=\ker(\mathbb Z[x_{k,i}]\to\Omega)$
of a multi-homogeneous polynomial ring over $\mathbb Z$ (a closed integral subscheme of a product of projective
spaces over $\mathbb Z$), of arithmetic dimension $D+1$. $A$ is a smooth hermitian line bundle on it. The hypotheses:
$A$ is relatively semipositive (its curvature form, computed from $\log h_A$, is nonnegative on tangent vectors to the
complex points), invariant under complex conjugation, has nonnegative degree on every curve in a fibre
(`NefOnFibres`) and nonnegative degree on every horizontal arithmetic surface contained in $V(P)$, that is, on every curve of the generic fibre (`NefOnGeneric`). The
conclusion: the arithmetic self-intersection number $\widehat{\deg}(A^{D+1})$ (the abstract `II`, an intersection
system satisfying the axioms `IsIntersectionSystem`) is at most the arithmetic volume
$\mathrm{arVolP}=\limsup_k \log\#\{\text{small sections of }A^{\otimes k}\}\big/\big(k^{D+1}/(D+1)!\big)$.
"Small" (`IsSmallH`) means that the section has sup norm at most 1 at every complex point. In short: arithmetic
bigness of a nef hermitian line bundle with positive self-intersection, in the form of a lower bound on the number of
small sections. A sibling `MoriwakiHSStatement` (:18) adds the hypothesis `HeightsNonneg` and asserts the limit
exists and equals $\widehat{\deg}(A^{D+1})$ (the arithmetic Hilbert-Samuel formula).

Classical identity and match. This is the arithmetic Hilbert-Samuel / arithmetic bigness theorem for nef
hermitian line bundles: the lower bound $\widehat{\mathrm{vol}}(A)\ge\widehat{\deg}(A^{D+1})$, in the lineage of Gillet-Soulé's arithmetic
Hilbert-Samuel for ample bundles, Zhang's extension to nef ones, and Moriwaki's and Yuan's bigness work (the code
attributes it to Moriwaki; I cannot confirm the exact source theorem and give no reference). The shape differs from the standard
formulation in three ways: (i) varieties are not abstract schemes but prime ideals in a multi-graded polynomial ring
(`IsArithVar`), so only subvarieties of products of projective spaces appear; (ii) intersection numbers are not
constructed, they are an arbitrary system `II` satisfying axioms, so the statement is conditional on `II`, and the
existence of one is a separate input (`ArithIntersectionSystemStatement`); (iii) volume uses `limsup` over multiples
$ak$ with $a=1$ and counts small sections of `chartLat`, a lattice of sections on charts, not of global sections of a
line bundle.

Proved: yes. `PositivityTheory.Pf1.HilbertSamuelMoriwaki.moriwakiBig_outright`
(`WB/CoreStatements/AutomorphicKernels/MoriwakiBigness/MoriwakiBigTheorem/Outright.lean:9`) is
`moriwakiBig_of_classicalTheorems (hResK) (hAIS) (hDBH)` (`HSChain.lean:367`), which passes through `hsChain`
(`HSChain.lean:180`, 191 references: arithmetic volume bigness, Moriwaki bigness on curves, arithmetic Kleiman, ...).
The three inputs are discharged in the tree:

- `hResK` (`ResKStatement`, `RT/.../BlowupProjections/BlowupProjStatement.lean:66`): resolution of singularities in
  characteristic $0$ for subvarieties of projective space with chosen coordinates. Proved by
  `PositivityTheory.ResPlug.FromRes.resK` (`WB/CoreStatements/ResolutionCharZero/PlugResK.lean:7`), from weak resolution
  and principalization (E10).
- `hAIS` (`ArithIntersectionSystemStatement`, `.../InterNamed.lean:40`: $\exists\,II$ with `IsFullIntersectionSystem`):
  proved by `GlobalTheory.T.arith_intersection_system_of_poincare_lelong` from the Poincare-Lelong formula (E10b).
- `hDBH` (`DenseBoundedHeight.Statement`, `GT/HeightsAndTheta/Heights/HeightsOfSets/IsSaturatedFirstCoordinateLine.lean:76`):
  for a smooth hermitian $H$ of degree one there exist a constant $C$ and a Zariski dense set of closed points of $P$ of height at most $C$ (a
  Northcott-Bogomolov-type input, in the spirit of Zhang's successive minima; my identification). Proved by
  `PositivityTheory.MbAis.DenseCurves.main` (`WB/.../MoriwakiSymmetry/EqMapSymm.lean:23`) from
  `GroundTheory...DenseBoundedHeight.main` and `HeightComparison.main`.

Dependency cone: 20,447 declarations, 2,985 files, 479,232 lines (1,974 files in `GT/HeightsAndTheta`, 463 in
`Development/ResolutionOfSingularities`, 202 in `AS`, 154 in `RT/ReductiveGroups`). This is the second largest
published input after the toroidal compactification (E14), and larger than Siegel-Weil (E8) in lines.

Use: the fifth hypothesis (`hBig`) of `topCovolSlim2_use_alt_alt`, hence `CovolumeBoundOfX`. Role: lower bound for the
number of small sections of the Hodge bundle on the toroidal compactification; the Arakelov-geometric half of
the covolume computation. The note's step 13 (Bost's slope inequality) is the nearest step; see section 4.

### E10. Poincare-Lelong and the Arakelov calculus

Where: `GlobalTheory.CompanionTheory.Ar.Pub.PoincareLelong`,
`AS/PublishedTheorems/Metrics₂/PoincareLelong.lean:6`, defined as `ArithmeticPoincareLelongFormula`
(`RT/ReductiveGroups/ArithmeticGeometry/BirationalGeometry/InterSt.lean:76`). The version the assembly uses is
`PoincareLelongInv` (`AS/PublishedTheorems/Metrics₂/PoincareLelongInv.lean:9`), the same with conjugation-invariance
hypotheses on the metrics.

```lean
def ArithmeticPoincareLelongFormula : Prop := ∀ (K : Type) [Fintype K] (ι : K → Type) [∀ k, Fintype (ι k)] (P : Ideal (MRing ι)) (n : ℕ) (L : Fin n → HermLine ι) (A B : HermLine ι) (s : MRing ι), IsArithVar P (n + 2) → (∀ j, IsSmoothHerm (L j)) → IsSmoothHerm A → IsSmoothHerm B → B.a = 0 → IsSectionOn P A s → ptsIntegral P (Fin.cons (fun z => Real.log (B.h z)) (pot L)) (logNorm A s) = (∑ᶠ (W) (_ : W ∈ divSupp P s ∧ IsHorizontal W), (multAt (P ⊔ Ideal.span {s}) W : ℝ) * ptsIntegral W (pot L) (fun z => Real.log (B.h z))) - ptsIntegral P (Fin.cons (fun z => Real.log (A.h z)) (pot L)) (fun z => Real.log (B.h z))
```

Ordinary mathematics. Let $X(\mathbb C)$ be the complex points of the arithmetic variety $P$ (of relative dimension $n+1$ over
$\mathbb Z$), $s$ a section of $A$ that does not vanish identically on $P$, $L_1,\dots,L_n$ smooth hermitian line bundles, and $B$ a smooth
metric on the trivial bundle (`B.a = 0`). Write $c_1(L,h)=dd^c\log h$ (the potential of $L_j$ is `pot L j = log (L j).h`) and
$\|s\|_A=|s|/h_A$ (`logNorm A s z = log (‖s(z)‖ / h_A z)`). Then, up to the normalization of $dd^c$,
$$\int_{X(\mathbb C)}\log\|s\|_A\ c_1(B)\wedge c_1(L_1)\wedge\dots\wedge c_1(L_n)\;=\;\sum_{W\subset\mathrm{div}\,s\ \text{horizontal}}\mathrm{mult}_W\int_{W(\mathbb C)}\log h_B\ c_1(L_1)\wedge\dots\wedge c_1(L_n)\;-\;\int_{X(\mathbb C)}\log h_B\ c_1(A)\wedge c_1(L_1)\wedge\dots\wedge c_1(L_n).$$
In Lean `ptsIntegral P φ g` is $\int g\cdot dd^c\varphi_1\wedge\dots\wedge dd^c\varphi_e$ over $X(\mathbb C)$, written without differential forms: it
integrates, over a good linear projection $\Psi$ to $\mathbb C^{e+1}$ (`IsGoodProj`), the sum over the sheets above each point of $g$ times the
Monge-Ampere density `maDensity` of the potentials along the sheet (`sheetDensity`, `IsIntersectionFamily.lean:125`), and is $0$ if no good projection exists.
The identity is the Poincare-Lelong equation $dd^c\log\|s\|^2=\delta_{\mathrm{div}(s)}-c_1(A,h_A)$ tested against $\log h_B\wedge c_1(L)^n$, with the
symmetry of the pairing (Green's identity) moving $dd^c$ from $\log h_B$ to $\log\|s\|$. I verified the form of `ptsIntegral` from `sheetDensity`; the
normalization constants in `maDensity` I did not read.

Classical identity and match. The Poincare-Lelong formula, in the integrated form used to define the recursion of
arithmetic intersection numbers (Gillet-Soule, Bost). It is a special case of the usual statement: the test form is
restricted to $\log h_B\wedge$ powers of first Chern forms, and the varieties are those cut out in multiprojective space.

Proved: yes. `PositivityTheory.Tls2.Pl.poincareLelongInv`
(`WB/CoreStatements/TemperedRepresentationTheory/PoincareLelong/PoincareLelongInv.lean:19`) via
`poincareLelongInv_of_leaves (hAbs hSCI hCDC hBr hLim ...)` (`Development.lean:95`): integrability of the absolute
fibre sum, a chart-divisor comparison, branches of a divisor at a general point, the Lelong limit at branches, a local order, a regularized mass
estimate, Stokes on charts (`StokesOnChart`). Dependency cone of `poincareLelong`: 3,864 declarations, 889 files,
108,474 lines (699 in `GT/HeightsAndTheta`, 70 in `AS`, 41 in `RT/AnalyticForms`).

Use: `hPL` of `topCovolSlim2_use_alt_alt`; the construction of the arithmetic intersection system for E9; the
Arakelov calculus `ArCalc` and `CycleHeights` (fields `p4`, `q11`), from `arCalc_direct` and `cycleHeights_direct`
(`WB/.../ArakelovCycleHeights/CycleHeightFormulas/CycleHeightsDirect.lean:138,144`; cone of `cycleHeights_direct`: 6,495
declarations, 1,194 files, 181,377 lines).

### E11. Resolution of singularities and principalization

Where: `GlobalTheory.CompanionTheory.Hypotheses₂.ResolutionCharZero`
(`AS/PublishedTheorems/Geometry₂/ConclusionOfSmooth.lean:53`),
`PrincipalisationCharZero` (`AS/PublishedTheorems/Geometry₂/NotSubsetOfDenseCompl.lean:57`), and
`GlobalTheory.Published.Principalisation` (`AVT/PublishedTheorems/Divisors₂/GeometricallyConnectedOfIsIsoRestrict.lean:118`).

```lean
def ResolutionCharZero : Prop :=
  ∀ (k : Type) [Field k] [CharZero k] (X : Scheme.{0}) (g : X ⟶ Sp k) [LocallyOfFiniteType g], QuasiCompact g → IsSeparated g → IsReduced X →
    ∃ (X' : Scheme.{0}) (s : X' ⟶ X), IsBlowupSeq s ∧ Smooth (s ≫ g) ∧ IsIso (s ∣_ g.smoothLocus) ∧
        FinalTheorems.Snc (preRed s (g.smoothLocus : Set X)ᶜ g.smoothLocus.isOpen.isClosed_compl)
```

Ordinary mathematics. Over a field $k$ of characteristic $0$, every reduced separated scheme of finite type has a
sequence of blow-ups $X'\to X$ with $X'$ smooth over $k$, an isomorphism over the smooth locus, and the preimage of
the singular locus a simple normal crossings divisor. `PrincipalisationCharZero` is the strong form (Hironaka's
principalization): for a smooth $X$ over $k$ with an ideal sheaf $I$ not vanishing on any irreducible component and
a snc divisor $E$, there is a sequence of blow-ups with smooth centers in snc position making $I$ an effective
Cartier divisor with snc support, an isomorphism off $V(I)$. `Principalisation` is the same for integral projective
smooth $Y$ and a nonzero $I$.

Classical identity and match. Hironaka's theorem on resolution of singularities and principalization of ideals in
characteristic zero (H. Hironaka, Ann. of Math. 79, 1964). The Lean forms are the standard ones and are
"strong" in the blow-up sense (explicit sequences of blow-ups, not just a birational map). In the tree the
theorem is stated for $k$ with `CharZero` and schemes `Scheme.{0}`.

Proved: yes. `PositivityTheory.Resplug.ResolutionBlowup.resolutionCharZero`
(`WB/CoreStatements/ResolutionCharZero/ResolutionCharZero.lean:6`) via `resolutionCharZero_of_top`, from
`FunctorialResolution.EmbeddedResolution.strongResolutionOfSingularitiesCharZero`
(`Development/ResolutionOfSingularities/EmbeddedResolution/HironakaTheorem.lean:69`). The principalization is
`principalisationCharZero_closed` (`.../PrincipalisationCharZeroClosed.lean:7`) from `GBoundary` (`RqGbnd.lean:777`) and
`GEff` (`RqGend.lean:141`). So Hironaka's theorem is formalized in `Development/ResolutionOfSingularities` (499 files,
140,709 lines, namespace `FunctorialResolution`), with the plug files in `WB/CoreStatements/ResolutionCharZero`
(17 files, 2,779 lines). Dependency cones: resolution 6,145 declarations, 467 files, 134,960 lines; principalization 5,160
declarations, 393 files, 114,992 lines.

Use: hypotheses 1 and 2 of `topCovolSlim2_use_alt_alt`; `ResKStatement` of E9; `Principalisation`
$\Rightarrow$ `NadelVanishingPair`, `IsolatedNonKltDivisor` (E12), $\Rightarrow$ `ArithHilbertSamuel`
(`arithHilbertSamuel_of_principalisation`, `AVT/Proofs/DivisorProofs/ArithHilbertSamuelOfPrincipalisation.lean:11`;
cone 6,127 declarations, 1,457 files, 163,762 lines, including 63 files of `RT/L2DbarEstimates`).

### E12. Nadel vanishing and point separation

Where: `GlobalTheory.Published.NadelVanishingAndNonKltDivisor := NadelVanishingPair ∧ IsolatedNonKltDivisor`,
`AVT/PublishedTheorems/Divisors₂/IsLogCanonicalMultipleCanonical.lean:545,557,574`.

```lean
def NadelVanishingPair : Prop := ∀ (X : Scheme.{0}) [IsIntegral X] [IsLocallyNoetherian X] [GlobalTheory.IsNormalScheme X] (p : X ⟶ Sp ℂ) (n : ℕ), IsProjOver p → topologicalKrullDim X = n → letI := algebraΓOfHom p ∀ (N : LB X) (Δ : X → ℚ) (m : ℕ) (G : CartierDiv X) (r : ℕ) (M₀ : LB X), N.IsLB → IsEffQDiv Δ → 0 < m → IsLogCanonicalMultiple p n Δ m G → 0 < r → IsNef ℂ M₀ → IsBig ℂ M₀ → (∀ C : Closeds X, IsCompleteCurve ℂ C → (interNumRed ℂ C ![N] : ℚ) = interNumRed ℂ C ![toLB G] / m + interNumRed ℂ C ![M₀] / r) → ∃ J : X.IdealSheafData, (∀ x : X, x ∈ J.support ↔ ¬ KltAt p n Δ x) ∧ ∀ i, 0 < i → Subsingleton (coh (twist (idealModule J) N) i)
```

Ordinary mathematics. For a normal projective variety $X$ over $\mathbb C$, an effective $\mathbb Q$-divisor $\Delta$
such that $K_X+\Delta$ is $\mathbb Q$-Cartier (`IsLogCanonicalMultiple`, numerical equivalence of $N$ with $K+\Delta+$ nef
and big), there is an ideal sheaf $J$ (the multiplier ideal) whose zero set is the non-klt locus of $(X,\Delta)$ and
$H^i(X,J\otimes N)=0$ for $i>0$. `IsolatedNonKltDivisor` is the Angehrn-Siu-type construction (my identification) of an effective
divisor making a point an isolated non-klt center, under a volume condition on all subvarieties through the point.
Together they give `PointSeparationPair` (`AVT/PublishedTheorems/Divisors₂/PointSeparationPair.lean:15`),
effective separation of points by adjoint bundles.

Classical identity and match. Nadel's vanishing theorem for multiplier ideals (A. Nadel, Ann. of Math. 132, 1990) in
the algebraic form (Lazarsfeld, *Positivity in Algebraic Geometry II*, section 9.4), with the numerical
characterization of $N$ in place of a hermitian metric; and the Angehrn-Siu point-separation lemma. The Lean statement
is the algebraic form for varieties over $\mathbb C$, a standard formulation.

Proved: yes. `NadelVanishingSeparation.NSI.nadelVanishingAndNonKltDivisor`
(`WB/CoreStatements/AutomorphicKernels/NadelVanishing/TopNSI.lean:7`, a 4-file, 38-line wrapper) uses
`nadelVanishingPair_of_principalisation` (`WB/CoreStatements/PublishedTheorems/NadelVanishingPairs/NadelVanishingLemmas/NadelVanishingPairsOfPrincipalisation.lean:16`,
49 lines) and `isolatedNonKltDivisor_of_principalisation` (`AVT/Proofs/DivisorProofs/IsolatedNonKltDivisorOfPrincipalisation.lean:17`),
both from `Principalisation` (E11). The vanishing step passes through a Kawamata-Viehweg-type vanishing in `AVT/Proofs/DivisorProofs/KawamataViehwegVanishingNumberFieldTwist.lean`
(`vanishFrom_adj : Quoted → ...`; I did not trace `Quoted`). Conversely `KawamataViehweg` is derived from the Nadel pair:
`kawamataViehweg_of_nadelVanishingPair` (`.../KawamataViehwegOfNadelVanishingPair.lean:62`). Dependency cone of Nadel: 9,757
declarations, 1,518 files, 240,897 lines (13,572 references into `EmbeddedResolution`); it uses no `L2DbarEstimates`.

Use: `hSep` (`PointSeparationPair`) in `HypothesesX`; fields `q6` (Kawamata-Viehweg), `q15` (Nadel) of the 28-field bundle.

### E13. Fargues exactness, Zarhin, Grothendieck-Messing, formal algebraization

These four are the arithmetic-geometry statements named in the reading plan.

**Fargues exactness.** `GlobalTheory.CompanionTheory.Ar.HT.FarguesExact`
(`AS/PublishedTheorems/Algebra₂/FarguesExact.lean:10`).

```lean
def FarguesExact : Prop := ∀ (p : ℕ) [Fact p.Prime] (C : Type) [Field C] [IsAlgClosed C] [CharZero C] (v : Valuation C NNReal) (O : Type) [CommRing O] [Algebra O C] [Algebra ℤ_[p] O], v.Integers O → v (p : C) < 1 → IsAdicComplete (Ideal.span {(p : O)}) O → ∀ G : PDivGroup p O, ∀ (ζ : ℕ → O) (h0 : ζ 0 = 1) (h : ∀ n, ζ (n + 1) ^ p = ζ n), ζ 1 ≠ 1 → ∀ B : O ⊗[ℤ_[p]] G.Tate →ₗ[O] O ⊗[ℤ_[p]] G.dual.Tate →ₗ[O] O, (∀ (x : G.Tate) (χ : G.dual.Tate), ∃ a : ℤ_[p], pairing G O x χ = a • muTate O ζ h0 h ∧ B (1 ⊗ₜ x) (1 ⊗ₜ χ) = algebraMap ℤ_[p] O a) → ∀ x, hodgeTateLinear G x = 0 ↔ ∀ y, dlogLinear G y = 0 → B x y = 0
```

Mathematics. $O$ is the ring of integers of an algebraically closed complete valued field $C$ of mixed
characteristic, $G$ a $p$-divisible group over $O$ with Tate module $T_pG$, dual $G^\vee$, $\omega$ the module of invariant
differentials. $\mathrm{HT}:O\otimes T_pG\to\omega_{G^\vee}$ and $\mathrm{dlog}:O\otimes T_pG^\vee\to\omega_G$ are the
Hodge-Tate maps. With $B$ the perfect pairing induced by Weil pairing $T_pG\times T_pG^\vee\to\mathbb Z_p(1)$ after
choosing a compatible system $\zeta_{p^n}$: $\ker\mathrm{HT}=(\ker\mathrm{dlog})^\perp$. This is exactness of the Hodge-Tate
sequence $0\to\mathrm{Lie}\,G(1)\to T_pG\otimes O\to\omega_{G^\vee}\to0$ in the middle.
Classical: Fargues' theorem on exactness of the Hodge-Tate sequence of a $p$-divisible group over $O_C$ (I give no reference);
matches in content, stated through the pairing rather than as a short exact sequence. Proved: yes, `UpperTheory.Lit.farguesExact`
(`AA/ThetaCorrespondence/PrismaticDieudonne/PrismaticDieudonneHodge.lean:27`) from `farguesExact_of_hodge` and the
published statement `PrismaticDieudonneHodge` (`AVT/PublishedTheorems/Divisors₂/InjectiveOfSmulMemRange.lean:62`), which is
proved in the same file (:19-26) from window matrices over Fontaine's $A_{\inf}$ (`window_lift_to_fontaineAinf_matrices`,
`hasDatum_of_matrices`, `exists_bFrame`). That is the Bhatt-Scholze prismatic Dieudonne theory input. Cone 2,531 declarations, 702
files, 54,462 lines (686 in `AVT`).

**Zarhin.** `GlobalTheory.CompanionTheory.Ar.GR.ZarhinStatement`
(`AS/PublishedTheorems/Algebra₂/ZarhinStatement.lean:21`).

```lean
def ZarhinStatement : Prop :=
  ∀ (C : Type) [Field C] [IsAlgClosed C] (v : Valuation C NNReal) (R : Type) [CommRing R]
    [Algebra R C], v.Integers R →
    ∀ (A : Over (Spec (CommRingCat.of R))) [GrpObj A] (L : LB A.left),
      IsAbelianScheme A → L.IsLB → Out.RelAmple A L →
      ∃ (P : Out.PolAV (Spec (CommRingCat.of R))) (i : A ⟶ P.A) (r : P.A ⟶ A),
        IsMonHom i ∧ IsMonHom r ∧ i ≫ r = 𝟙 A
```

Mathematics. Over the valuation ring $R$ of an algebraically closed valued field, an abelian scheme $A$ with a
relatively ample line bundle is a direct factor (homomorphisms $i:A\to P$, $r:P\to A$ with $ri=\mathrm{id}$) of an abelian scheme $P$ carrying a
`PolAV` structure (rigidified, symmetric, relatively ample line bundle, with trivial kernel condition `KTriv`, which I read as
principal polarization; I did not unfold `KTriv`). Classical: Zarhin's trick ($(A\times A^\vee)^4$ is principally
polarized), here over a valuation ring. Matches in content. Proved: `PositivityTheory.HtPt.Narrow.zarhin`
(`WB/CoreStatements/HodgeTatePoints/ZarTop.lean:6`) from `zarhinStatement_of_dual_cube` (dual abelian scheme and the theorem of the cube,
`WB/CoreStatements/AbelianHeightsDuality/ZarhinTrick/ZarhinStatementOfDualCubeQiR.lean:68`). Cone 6,056 declarations, 808 files, 145,999 lines.

**Grothendieck-Messing deformation.** `GlobalTheory.Published.GrothendieckDeformation`
(`AVT/PublishedTheorems/Divisors₂/GrothendieckDeformation.lean:12`).

```lean
def GrothendieckDeformation : Prop :=
  ∀ (R : Type) [CommRing R] (I : Ideal R) (κ : DividedPowers I), IsNilDP κ →
    ∀ (R₀ : Type) [CommRing R₀] (π : R →+* R₀), Function.Surjective π → RingHom.ker π = I →
      GrothendieckMessing.At κ π
```

Mathematics. For a surjection $R\to R_0=R/I$ with a nilpotent divided power structure $\kappa$ on $I$, `At κ π` is
`Canonical ∧ LiftObj ∧ LiftHom`: the crystalline cohomology of an abelian scheme over $R_0$ is canonically the de Rham
cohomology of any lift (`Canonical`), every admissible Hodge filtration in $H^1_{dR}(A')$ comes from a lift of the abelian scheme
(`LiftObj`), and a morphism of reductions lifts uniquely iff it preserves the filtrations (`LiftHom`). Classical: the
Grothendieck-Messing deformation theorem, for abelian schemes (Messing's thesis treats $p$-divisible groups; I do not
give a reference). The Lean statement is the abelian-scheme version without a $p$-nilpotence hypothesis for the first
form; `GrothendieckMessing` (`CanonicalOfAbelianDeRham.lean:59`) adds $p$ nilpotent in $R$ and is derived from it
(`grothendieckMessing`, `GrothendieckDeformation.lean:22`). Proved: `grothendieckDeformation_of_lifting`
(`AVT/Proofs/DivisorProofs/GrothendieckDeformationOfLifting.lean:9`) from `AbelianDeRham` (`PositivityTheory.DualRT.abelianDeRham`) and
`AbelianLifting` (`abelianScheme_hom_lifting_nilpotent_dividedPowers`, `AVT/Proofs/DivisorProofs/AbelianSchemeHomLiftingNilpotentDividedPowers.lean:19`),
which in turn is built from Hodge-de Rham degeneration, the dual abelian scheme with biduality, Poincare-de Rham duality, unobstructedness and the theorem of
the cube. Cone of `AbelianLifting`: 10,185 declarations, 2,234 files, 231,458 lines (2,081 in `AVT`); of `AbelianDeRham`: 7,882 declarations, 1,130 files, 168,166 lines; of `dualAbelianScheme`: 7,095 declarations, 1,416 files, 167,785 lines.

**Formal algebraization.** `GlobalTheory.Published.FormalAlgebraisation := Morphisms ∧ Schemes`
(`AVT/PublishedTheorems/Divisors₂/FormalAlgebraisation.lean:17,28,43`).

```lean
def Morphisms : Prop := ∀ (R : Type) [CommRing R] [IsNoetherianRing R] (I : Ideal R), IsAdicComplete I R → ∀ (X Z : Over (Spec (CommRingCat.of R))), IsProper X.hom → IsSeparated Z.hom → LocallyOfFiniteType Z.hom → QuasiCompact Z.hom → ∀ (Y : ∀ e : ℕ, Over (Spec (CommRingCat.of (R ⧸ I ^ (e + 1))))) (β : ...) (b : ...), (∀ e, IsPullback (b e) (Y e).hom X.hom (thick R I e)) → (∀ e, β e ≫ b (e + 1) = b e) → ∀ f : ∀ e, (Y e).left ⟶ Z.left, (...) → (∀ e, β e ≫ f (e + 1) = f e) → ∃! g : X ⟶ Z, ∀ e, b e ≫ g.left = f e
```

Mathematics. For $R$ Noetherian and $I$-adically complete, a compatible family of morphisms from the thickenings of a proper $X$
to a separated $Z$ of finite type is induced by a unique morphism $X\to Z$ (`Morphisms`); a compatible system of proper schemes $Y_e$
over $R/I^{e+1}$ with compatible line bundles, the first relatively ample, is the system of thickenings of a proper
scheme with a relatively ample bundle (`Schemes`). Classical: Grothendieck's existence theorem (EGA III, 5.1.4 and
5.4.1; I give the identification, not a quotation of numbering from the tree). The statement is the ample-bundle version of
the existence theorem and the full-faithfulness half, both standard. Proved:
`PositivityTheory.FormalThickening.formalAlgebraisation`
(`WB/CoreStatements/TemperedRepresentationTheory/FormalAlgebraisation/Development.lean:17`) from `GEClosed`, `GEClosedProj`
(`AS/Proofs/BlockDecomposition/GrothendieckExistenceClosed*.lean`), `IsoOfThick` (`IsoOfThickenings.lean:363`) and the
uniqueness `eq_of_comp_thickenings_eq`. Cone 3,708 declarations, 486 files, 77,826 lines (3,711 references into
`GT/ArithmeticGeometry/SchemeCohomology`).

Use of the four: hypotheses 6, 7, 15 of `topCovolSlim2_use_alt_alt` (Fargues, Zarhin, Grothendieck deformation), field `q18`
(formal algebraization), `q1` (Grothendieck-Messing), `q4` (prismatic Dieudonne). Role: the integrality and bounded-ramification
control of the Hodge bundle: Zarhin to reduce to principally polarized abelian schemes, Fargues and prismatic Dieudonne for
the $p$-adic period map on the integral model, Grothendieck-Messing and formal algebraization to build and compare integral models.
I did not trace the individual uses; this role is inferred from the statements.

### E14. Toroidal compactifications

Where: `GlobalTheory.Published.ToroidalCompactification` (`AVT/PublishedTheorems/Divisors₂/DenseInterior.lean:146`),
`ToroidalForFanKS` (`.../ToroidalCompactificationBis.lean:45`), `SiegelToroidalIntegral`
(`AVT/PublishedTheorems/AutomorphicForms₂/SiegelToroidalIntegral.lean:145`). Statements in section 1 above (copied from the
source in the order given). In brief:

```lean
def ToroidalCompactification : Prop := ∀ (E : Type) [Field E] [NumberField E] [IsCMField E] (H : Host E) (Dw : Datum H), 1 ≤ Dw.p + Dw.q → ∀ (l : Level H) (Xo : Moduli Dw l) (c : Coeff l), ∃ Y : Model Xo c (RingHom.id c.F), SmoothOfRelativeDimension Dw.dim Y.s ∧ ReciprocityTheory.AnForm.R.FinalTheorems.Snc (boundary Y) ∧ HasLogKS Y.t Y.s (interior Y)
```

Mathematics. For a CM field $E$ and a unitary Shimura datum of signature $(p,q)$ with level $l$, the moduli scheme $X_0$ has a
smooth compactification $Y$ over the coefficient ring whose boundary is a simple normal crossings divisor and for which the
Kodaira-Spencer map extends to a logarithmic isomorphism (`HasLogKS`). `ToroidalForFanKS` refines this for an invariant polyhedral
fan $\varphi$ without self-intersections, adding Mumford charts and ampleness of a polarization bundle. `SiegelToroidalIntegral`
is the Siegel case ($g\ge1$): for each odd $n\ge3$ a projective smooth scheme over $\mathbb Z[\zeta_n,1/n]$ (`cycAway n`) with a semiabelian extension of the universal
abelian scheme, the boundary an effective Cartier divisor with toric charts, the Hodge bundle $\omega=\det$ generated by sections and a twist by
the dual of the boundary ample.
Classical: toroidal compactifications of Shimura varieties and their integral models, in the Siegel case Faltings-Chai (*Degeneration of
abelian varieties*, 1990) via Mumford and Ash-Mumford-Rapoport-Tai, and for unitary (PEL) type K.-W. Lan (*Arithmetic compactifications of
PEL-type Shimura varieties*, 2013); this is my identification. The Lean statements are sharpened to exactly what is used (odd level away from
$n$, fixed invariant fan, existence only). Proved: `GlobalTheory.toroidalCompactification_holds`
(`AVT/Proofs/DivisorProofs/ToroidalCompactificationHolds.lean:10`) from fans `exists_inv_smooth_fan_noSelfInt`,
`exists_fine_invariant_fan`, and `ToroidalForFanKS` (`TorKSField.toroidalForFanKS`, `.../ToroidalCompactificationFanLogKodairaSpencerIso.lean:8`); `siegelToroidalIntegral_holds`
(`AVT/Proofs/DivisorProofs/SiegelToroidalIntegralHolds.lean:14`). Cone size: the tool stopped at its cap of 40,000 declarations, with 10,289 files and 1,051,258 lines already reached (9,787 files in `AVT`), so the true cone is larger; this is the largest input in the region.

Use: hypotheses 9 and 10 of `topCovolSlim2_use_alt_alt`, field `p1`. Role: the compact moduli space on which the Hodge bundle is
bounded, so that Arakelov volume (E9, E10) can be applied.

### E15. Other standard inputs, in one table each

The remaining wrappers are listed with the classical theorem that I recognize, whether the Lean form is the standard one, and
the proof's place. All are proved in the tree. For lack of space only the statement head is shown; every one was read
in the index, but not every body was unfolded, and I did not trace proofs below the first layer except where noted.

**Holomorphic Lefschetz formula.** `UpperTheory.Gal.LocalSmoothExtension.HolomorphicLefschetzFormula`
(`AA/Foundations/GaloisRepresentations/LefschetzSigmaSums/HodgeTraceFromLefschetzAndGroupSide.lean:102`):

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

Mathematics. $Z$ is a smooth projective variety of dimension $d$ over $\mathbb C$; $c_1,c_2:Y\to Z$ is a finite étale correspondence. The fixed
points $F=\{y: c_1(y)=c_2(y)\}$ are finite, with tangent matrices $A_y$ (`IsTan`, the derivative of $c_1^{-1}c_2$ at $y$) such that $1-A_y$
is invertible. Then for each $a$, the alternating sum $\sum_b(-1)^b\,\mathrm{tr}\big(c_{1*}c_2^*\ \text{on}\ H^b(Z,\Omega^a)\big)$
equals $\sum_{y\in F}[X^a]\det(1+XA_y)/\det(1-A_y)$. This is the Atiyah-Bott holomorphic Lefschetz fixed point formula
(M. Atiyah and R. Bott, Ann. of Math. 86, 1967; 88, 1968) with coefficients in $\Omega^a$, extended from an endomorphism ($c_1=\mathrm{id}$) to a finite
étale correspondence. The Lean form is a generalization and an algebraic one (Hodge cohomology of schemes), not a quotation.
Proved: `weight_one_geometric_realization` (`AA/Foundations/GaloisRepresentations/IntegralStructures/GeometricFlagBases/WeightOneGeometricRealization.lean:7`)
from `GlobalTheory.T.lefschetz_fixedPoint_finite_etale_correspondence` (`AVT/Proofs/SatakeParameters/LefschetzFixedPointFiniteEtaleCorrespondence.lean:8`)
$\to$ `UpperTheory.Cb.lefschetz_fixedPoint_finite_etale_correspondence` (`AA/Foundations/EtaleClopenDescent/LefschetzFixedPointFiniteEtaleCorrespondence.lean:255`,
reduction to integral $Z$ by a clopen decomposition) $\to$ `holomorphic_lefschetz_finiteEtale_correspondence` (`.../HolomorphicLefschetzFiniteEtaleCorrespondence.lean:43`)
$\to$ `HolomorphicLefschetzFiniteEtaleIntegral`. Cone 3,785 declarations, 524 files, 82,938 lines. Use: `GeoOne` (reader 3): the weight-one geometric
realization needed to construct Galois representations for $Row0b$.

**Brauer's theorem** (`BrauerDegreeZero`, `AVT/PublishedTheorems/GaloisCohomology₂/BrauerDegreeZero.lean:12`; proof
`GlobalTheory.BrauerZero.brauerDegreeZero`, `AVT/Proofs/InertiaEigenvalues/BrauerDegreeZero.lean:203`; cone 113 declarations, 61 files, 4,332 lines):
for a finite group $G$ and complex representation $\rho$ there are subgroups $H_i$, characters $\chi_i$ and integers $c_i$ with
$\mathrm{tr}\rho(g)-\dim\rho=\sum c_i(\mathrm{Ind}_{H_i}^G\chi_i-\mathrm{Ind}_{H_i}^G1)(g)$. This is the degree-zero form of Brauer's induction theorem,
with arbitrary subgroups (the classical statement takes elementary subgroups), so the Lean form is weaker. Use: Artin $L$-functions as
quotients of Hecke $L$-functions; `local_langlands_gl_recT_exists_of_literature`.

**Chevalley's units lemma** (`ChevalleyUnits`, `AVT/PublishedTheorems/GaloisCohomology₂/ChevalleyUnits.lean:7`; proof `chevalleyUnits'`,
`AVT/Proofs/InertiaEigenvalues/ChevalleyUnits.lean:174`; cone 238 declarations, 73 files, 7,151 lines): for a number field $E$ and $m,b>0$ there is $a>0$ coprime to $b$
such that every unit $u\equiv1\bmod a$ is an $m$-th power. Standard (Chevalley's theorem on units, used for the local-global injectivity of the Artin map).
Use: `artin_localIdele_injective`, hence `artEx` and E3.

**Linnik's theorem** (`Linnik`, `AVT/PublishedTheorems/PublishedFoundations/PrimesInProgressionNonempty.lean:9`):
$\exists\, C,L>0$, for coprime $a,q$ the least prime $p\equiv a\bmod q$ is $\le Cq^L$. Standard. Proved: `UpperTheory.Lit.linnik`
(`AA/ThetaCorrespondence/Linnik.lean:142`) from `GlobalTheory.Lin.PrimesRel` (primes in progressions with relative error,
`AVT/Proofs/GlobalInterpolation/PrimesInProgressionsRelativeError.lean:22`) with `exists_prime_modEq_le_rpow_of_primesRel`; the work is in
zero-density and exceptional-zero data (`Lin.IsExc`, `Lin.ExcData`) and the smoothed prime sums `Formalism.HermitianLattices.GL2PrimeSums`.
Cone 508 declarations, 101 files, 14,814 lines. It is independent of RH. Use: field `linnik` of `F` (choosing auxiliary primes).

**Class field theory of CM fields** (`ComplexMultiplicationJSt`, `HilbertClassFieldJ`, `IdealInvariantsOneOrbitSt`, `WeberRayFieldSt`, `CMCurveGoodOutsidePrimeSt`,
`EllipticMainTheoremCM`, `DeligneRibet`, `SiegelKlingenDeligneRibet`, `PartialZetaFunctionalEquation`, `Landherr`, `HasseNorm`, `HermitianHassePrinciple`,
`QuadraticClassFieldTheory`, `RayClassFieldSt`): classical results on complex multiplication (the $j$-invariant of an ideal lattice generates the Hilbert class
field; its orbit under $\mathrm{Aut}(\mathbb C/K)$ is the set of class group conjugates; Weber functions generate ray class fields), the Hasse norm theorem, Landherr's
theorem and the Hasse principle for hermitian forms, the Deligne-Ribet $p$-adic $L$-function interpolation (`DeligneRibet`) with Siegel-Klingen, and a partial zeta functional
equation. `CMCurveGoodOutsidePrimeSt` is a particular existence statement: for each prime $p\equiv3\bmod4$, $p>3$, an elliptic curve with CM over a number field, good reduction
outside $p$, and minimal discriminant $-p^3$. All stated in the shape of the standard theorems; the CM statements are for imaginary quadratic fields only (`finrank ℚ K = 2`).
They are the arithmetic of CM points (note step 2: "$D^p\equiv0$ on a CM curve for $p$ inert in $K$") and the integrality of theta derivatives. I read only the heads of these statements, and did not
trace their proofs, which are in `AVT/Proofs/DivisorProofs/` (`HcfjHolds`, `CmCurveGoodOutsidePrime`) and `WB/CoreStatements/AbelianHeightsDuality/PublishedTheoremStatements/ProvedMore.lean`.

**Galois cohomology and $p$-adic Hodge theory** (about 18 statements): Poitou-Tate (`PoitouTateNormalised`, `GlobalEulerChar`, `GlobalFiniteness`,
`LocalTateDuality`, `LocalEulerChar`, `LocalFiniteness`, `UnramifiedOrthogonality`, `GreenbergWiles`, the `...K` variants for $\mathbb Q_\ell$-extensions in
`Formalism/GaloisCohomology/LocalTateDualityK.lean`), Bloch-Kato local, Fontaine's $B_{\mathrm{cris}}$ theorems (`FontaineBcris`), potential semistability of de Rham representations
(`DeRhamPotSemistable`: every de Rham representation of $G_K$ is potentially semistable; Berger), Bhatt-Scholze integral and crystalline lattices. The statements for finite coefficients
(`RT/Hypotheses/GalCoh.lean`, 273 lines) are the standard local and global duality, finiteness and Euler characteristic formulas for finite $G_F$-modules
of order a power of $\ell$. Proofs are in `AVT/Proofs/DivisorProofs/` (`LocfinHolds`, `LoceulerHolds`, `ExistsMulEquiv`) and `AVT/Proofs/InertiaEigenvalues/`
(`FontaineBcrisBasicTheoremsProof`, `DeRhamPotentiallySemistable`, `BhattScholzeIntegral`).

**Local representation theory of $GL_n$ over a $p$-adic field** (about 34 statements): Bernstein-Zelevinsky finiteness (irreducible smooth implies admissible, finite length of
induction and Jacquet functors), geometric lemma, Zelevinsky's polynomial ring (`GrothendieckRingPolynomial`, `ZelevinskyPolynomialRing`), the segment representation,
Langlands classification (`LanglandsExhaustionGL`, `LanglandsMultisegments`, `StandardCosocleGL`), local converse theorem, generic unitary dual, Moy-Prasad, depth-zero statements.
Standard statements for non-archimedean local fields `[IsNonarchimedeanLocalField k]` (usually with `[CharZero k]`). Proofs under `WB/CoreStatements/AutomorphicKernels/LanglandsExhaustion/`
(24 files, 1,381 lines), `WB/RepresentationTheoryGL/`, `AVT/Proofs/InertiaEigenvalues/`, `DiscreteGroups/GlobalIrreducibility/` (the local converse theorem).

**Real groups, discrete series, theta correspondence and automorphic forms** (about 69 statements): Harish-Chandra modules, discrete series classification and existence,
Casselman-Wallach, Howe duality, Weil representation, metaplectic representation, Stone-von Neumann, Flath factorization, rapid decay and trace class for cusp forms, Jacquet-Shalika
rigidity, Gelfand-Kazhdan duality, cuspidal multiplicity one, Clozel's purity and cohomological types, base change (`BaseChangeIsobaricTransfer`: reader 4), automorphic forms finiteness. Standard
statements, with the tree's own encodings for unitary groups $U(p,q)$ (`HSp`, `D7`, `GA`, `Spc`, `Base`). Proofs under `CompanionTheory/RealGroups/` (155 files, 15,797 lines),
`WB/CoreStatements/StandardPublishedResults/`, `WB/CoreStatements/PublishedTheorems/`, `AA/ThetaCorrespondence/` (3,201 files, 178,983 lines).

## 2. Definitions unfolded

| Name | File:line | Kind | Meaning |
| --- | --- | --- | --- |
| `MRing ι`, `MRingOver R ι` | `RT/ReductiveGroups/ArithmeticGeometry/BirationalGeometry/IsIntersectionFamily.lean:13,15` | ring | `MvPolynomial (Σ k, ι k) R`: one variable $x_{k,i}$ for each block $k$ and index $i$ |
| `IsMultiHomog s a` | `.../IsIntersectionFamily.lean:19` | proposition | $s$ is homogeneous of degree $a_k$ in block $k$ |
| `IsArithVar P d` | `.../IsIntersectionFamily.lean:34` | proposition about an ideal | `Nonempty K ∧ IsMultiProjPrime P ∧ IsHorizontal P ∧ ringKrullDim (MRing ι ⧸ P) = d + |K|`: $P$ is a multi-homogeneous prime of the flat ($\mathbb Z$-torsion free) type, of arithmetic dimension $d$ |
| `mCoordIdeal y` | `.../ArithmeticHilbertSamuelLowerBound.lean:17` | ideal | the kernel of $\mathbb Z[x_{k,i}]\to\Omega[T_k]$, $x_{k,i}\mapsto y_{k,i}T_k$: the prime ideal of the point $y$ |
| `HermLine ι` | `GT/HeightsAndTheta/Heights/HeightsOfSets/Points.lean:74` | structure | integer degrees `deg k` per block and a metric `h` on the cone, smooth, positive, with $h(cz)=\prod_k|c_k|^{\deg_k}h(z)$ |
| `IsSmoothHerm`, `IsConjInvariantH` | `.../IsIntersectionFamily.lean:97`; `.../ArithmeticHilbertSamuelLowerBound.lean:44` | propositions | $h$ is $C^\infty$ on the nonzero locus; $h(\bar z)=h(z)$ |
| `mcPts P` | `.../IsIntersectionFamily.lean:83` | set | complex points $z\in\mathbb C^{\Sigma}$ with each block nonzero and killed by $P$ |
| `IsSemipositiveRel P0 P A` | `.../ArithmeticHilbertSamuelLowerBound.lean:37` | proposition | $A$ smooth and the Levi form of $\log h_A$ is $\ge0$ on cone-tangent vectors of $P_0$ at points of `mcPts P` |
| `NefOnFibres`, `NefOnGeneric` | `.../ArithmeticHilbertSamuelLowerBound.lean:47`; `.../ArakelovGeometry/MoriwakiSt.lean:12` | propositions | $\ge0$ degree on every positive-characteristic curve of $V(P)$; $\ge0$ geometric degree `geomDeg W A 1` on every arithmetic surface $W\supseteq P$ |
| `IntersectionSystem`, `IsIntersectionSystem` | `.../ArithmeticHilbertSamuelLowerBound.lean:86,90` | type, proposition | a real-valued function `II K ι P n L` of an arithmetic variety and $n$ hermitian lines; the axioms are symmetry, additivity in tensor product, and the recursion `recR` (arithmetic degree of a divisor plus integral of $\log$ norm) |
| `arVolP P La a D` | `.../PenVol.lean:35` | real | $\limsup_k\ \log\#\{s\in La(ak): P\,(ak)\,s\}/((ak)^{D+1}/(D+1)!)$ |
| `IsSmallH P y A τ s` | `.../ArithmeticHilbertSamuelLowerBound.lean:20` | proposition | $s=g/h$ with homogeneous $g,h$ of degrees differing by $\tau\,\deg A$ and $|g(z)|\le|h(z)|\,h_A(z)^\tau$ on `mcPts P` |
| `chartLat y a τ` | `.../ArithmeticHilbertSamuelLowerBound.lean:55` | additive subgroup of $\Omega$ | $s$ with $s\prod_k y_{k,c_k}^{-\tau a_k}$ in the chart ring $\mathbb Z[y_{k,i}/y_{k,c_k}]$ for every chart $c$ |
| `ptsIntegral P φ g` | `.../IsIntersectionFamily.lean:140` | real | $\int_y\sum_{w\in\mathrm{fibre}}\mathrm{sheetDensity}$ over a good projection, `0` if no good projection exists |
| `IrrGL k` | `AVT/Definitions/NonGaloisDescent/NonemptyEquivMultiProdOne.lean:179` | type | $\Sigma_n$ (isomorphism classes of irreducible smooth representations of $GL_n(k)$) |
| `WD h` | `AVT/Definitions/AutomorphicMembership/MonodromyZeroOfWeilDeligneRepClassIff.lean:380` | type | isomorphism classes of Weil-Deligne representations of the Weil group `Weil h` |
| `Weil h` | `AVT/Definitions/AutomorphicMembership/ExistsNotCongPow.lean:149` | subgroup of $G_E$ | `weilSub A (normV w)`: elements acting on the residue field by an integer power of Frobenius |
| `IsLocalArtin h a` | `AVT/PublishedTheorems/AutomorphicForms₂/HasExponentZeroIff.lean:145` | proposition | $a:W\to E_w^\times$ surjective, continuous on inertia, $\mathrm{ord}\,a(\sigma)=-\deg\sigma$, smooth characters factor through $a$, and $a$ is compatible with every global Artin map |
| `KOne k n` | `AVT/Definitions/Foundations/MatrixMeasurableSpace.lean:27` | subgroup | $\ker(GL_n(\mathcal O_k)\to GL_n(\text{residue field}))$ |
| `Good`, `GoodCusp`, `Toral` | `AA/Foundations/LocalLanglands/IsRecTOfIsRec.lean:24,20,26` | propositions | as in E3 |
| `Row`, `Row0b recT` | `AA/Foundations/UnitarySphericalFixing/SatakeParameters/RecT.lean:6`; `.../WeightsConjBis.lean:69` | propositions | Galois representations for regular algebraic polarized cuspidal representations of $GL_a$ over CM fields |

## 3. The chain

The chain of this region is a fan, not a line. One layer is the bundle structure (steps 1 to 3); the rest is a dependency order among published inputs.

1. `OpenLiteratureStatements` is fed `⟨Row0b recT, recTExists, Row0b recT⟩` (specific to this proof's assembly; `AA/CharacterBoxes/MainConclusion.lean:7`). No assumption remains.
2. `every_character_of_literature_of_vWin` builds 9 bundles from 185 wrappers (specific to this proof; `TPL/EveryCharacterOfLiteratureOfVWin.lean`) and calls the theta-integral assembly of reader 2.
3. Each wrapper discharges a statement `def T : Prop` by a proof elsewhere. The statement is the standard theorem (classical, section 1), the proof is a formalization from foundations. The dependency order of the main fans is:
   - Hironaka (`EmbeddedResolution/HironakaTheorem`) $\Rightarrow$ `ResolutionCharZero`, `PrincipalisationCharZero`, `Principalisation` $\Rightarrow$ `ResKStatement`, `NadelVanishingPair`, `IsolatedNonKltDivisor`, `ArithHilbertSamuel`.
   - Poincare-Lelong (`poincareLelong_of_leaves`) $\Rightarrow$ arithmetic intersection system $\Rightarrow$ `MoriwakiBigStatement` (with `ResK`, `DenseBoundedHeight`).
   - Hodge-de Rham, dual abelian scheme, cube theorem, unobstructedness $\Rightarrow$ `AbelianLifting` $\Rightarrow$ `GrothendieckDeformation`.
   - Window matrices over $A_{\inf}$ $\Rightarrow$ `PrismaticDieudonneHodge` $\Rightarrow$ `FarguesExact`. Dual abelian scheme and cube $\Rightarrow$ `ZarhinStatement`.
   - Tate's thesis $\Rightarrow$ Hecke $L$-functions $\Rightarrow$ Dirichlet-type primes in number fields $\Rightarrow$ `ChebotarevDegreeOne`; separately `GT/GlobalFields/TateThesis/Chebotarev` for density.
   - Artin map in `GT/GlobalFields` $\Rightarrow$ `GlobalArtinReciprocity`; with `ChevalleyUnits` $\Rightarrow$ local Artin map $\Rightarrow$ `RecTExists` (with `Green`, Langlands classification).
   - Poisson summation on the Weil representation, constant-term splitting $\Rightarrow$ `SiegelWeilStd`; `EisHalf`, `SiegelMult` $\Rightarrow$ `EisBL`.
   - Atiyah-Bott on finite étale correspondences $\Rightarrow$ `HolomorphicLefschetzFormula` $\Rightarrow$ `GeoOne`.
4. The outputs of the geometric fan are consumed by `topCovolSlim2_use_alt_alt` (`TPL/TopCovolSlim2Use.lean:16`) which produces `CovolumeBoundOfX`. Mechanism there: a bound for the number of small sections of the Hodge bundle on the toroidal compactification (E9, E14), bounded integral structure (E13), and Chow height formulas (`FubiniStudyChowHeightFormula₂`, `ChowFormHeightComparison₂`). Specific to this proof.

## 4. Against the note

The note's wording is about the integers, theta lifts and divisibility; the published inputs appear as tools. The code's formulation:

- Step 2 ($D^p\equiv0$ on a CM curve, divisibility of $D^a\theta(0)/\Omega^a$): the CM statements of E15 (`ComplexMultiplicationJSt`, `HilbertClassFieldJ`, `IdealInvariantsOneOrbitSt`, `WeberRayFieldSt`, `CMCurveGoodOutsidePrimeSt`) and the $p$-adic Hodge and prismatic statements of E13. The note does not mention Fargues or prismatic Dieudonne. The divisibility itself is reader 3's.
- Step 8 and step 12 (iterated theta lifts, seesaw, Rallis): `WeilRepresentationUnitaryPair`, `DoublingMethodLocalZetaIntegrals`, `RallisInnerProductConvergent`, `SiegelWeilUnitaryConvergent`, `WeilSiegelFormulaUnitary`, `KudlaSplittingSplitUnitary`, `HoweDualityReal`, `ThetaRationalInvariance` (E8, E15). The note says "Rallis"; the code has Rallis's inner product formula in its convergent range only (`TwistedTraceFormula/LowerLiftsZeroOfWittIdxEqZero.lean:41`).
- Step 9 ("Chowla and Selberg, Weyl, and Siegel mass"): the nearest published inputs are Siegel-Weil (E8), `WeylBranching` and `InducedSimpleLowestAlcove` (lowest alcove for Weyl modules); this matching is by names only. The name Chowla-Selberg does occur in the index as `ChowlaSelberg` under `GT/HeightsAndTheta/Heights`; it is not in my region.
- Step 13 (Bost slope inequality): there is no theorem by that name in the tree (inventory). The nearest code is the arithmetic Hilbert-Samuel and bigness package (E9), counting small sections of lattices of charts, `ChowFormHeightComparison`, `ArCalc`, `CycleHeights`, and `arithHilbertSamuel_of_principalisation`. The slope inequality of Bost is an upper bound on the degree of an injection between hermitian bundles, which is the same circle of ideas as a lower bound on the number of small sections, but I did not find a statement of it.
- Step 11 and 19 (Iwasawa tower, Behrend): Chebotarev, Linnik, `RayClassFieldSt`, `RayCharacterArtin`, `QuadraticClassFieldTheory` (E5, E6, E15). Behrend is reader 3's (`BehrendSets`).
- Step 16 (relative trace formula, sixfold cover of $GL_5$): `GL3MeanSquares`, not mine. The published inputs related are `SiegelEisensteinContinuation`, `CuspTraceClass`, `CuspRapidDecay`, `DixmierMalliavinFactorisation`.
- Step 17 (a weak form of Vandiver): `GreenbergWiles`, `PoitouTateNormalised`, `UnramifiedOrthogonality` (E15). The note's wording "fight for a significant weakening of Vandiver" has no counterpart name in my region.
- Step 18 (covolumes): `CovolumeBoundOfX` and its geometric inputs (E9 to E14). The note says "computation of covolumes"; the code has the bound `CovolumeBoundOfX` (`L3`), obtained from the geometric package.
- Substantial in the code and not in the note: the whole algebraic-geometry package for the Hodge bundle (resolution, Nadel, Kawamata-Viehweg, Moriwaki bigness, Grothendieck-Messing, Zarhin, Fargues, toroidal compactification), 28 fields in `PublishedHodgeBundleTheorems`; and the weakened local Langlands `RecTExists`.

## 5. In plain terms

A proof of this size has to cite hundreds of theorems. A paper cites them. This formalization is different: it does not
cite, it restates and proves. For each published theorem the project wrote a `Prop` in the standard shape, and then proved it somewhere in the tree.
The proof of RH does not stop at a library boundary where Mathlib runs out; it reaches Mathlib by building what is missing: Artin reciprocity,
Tate's thesis, Hironaka's resolution, Grothendieck's existence theorem, Green's characters, a Siegel-Weil formula, the Hodge-Tate sequence.

The smallest example in which the mechanism is visible is Green's theorem in degree $d=1$: $GL_1(\mathbb F_g)=\mathbb F_g^\times$, every character is cuspidal
(there is no proper parabolic), the characters are indexed by monic irreducible polynomials of degree 1, that is, by elements $x\ne0$ of $\mathbb F_g$ via $\theta_x$,
and the degree formula is the empty product $1$. In degree 2 the cuspidal characters of $GL_2(\mathbb F_g)$ have degree $g-1$, and are indexed by the $(g^2-g)/2$ pairs $\{\theta,\theta^g\}$ of characters of $\mathbb F_{g^2}^\times$ with $\theta\ne\theta^g$,
equivalently by the monic irreducible quadratics over $\mathbb F_g$. This is the table that the local Langlands map of E3 uses to send a depth-zero cuspidal representation of
$GL_2(\mathbb Q_g)$ to a tame Weil-Deligne representation: inertia acts through the character $\theta$, so the finite-field classification is a classification of local
parameters.

What would fail without each hypothesis of the main statements:

- Without `Good` in `LawsT` (restriction to depth zero and $F=\mathbb Q_g$), the construction of `rc` would require the full local Langlands correspondence, whose proof
  (Harris-Taylor, Henniart, Scholze) is far beyond the tree's `RecTExists` route. The tree gets a smaller statement by being exact about where it is needed.
- Without the nef conditions in `MoriwakiBigStatement` the number of small sections should not be bounded below by the self-intersection (as I understand it, a line bundle of positive self-intersection
  can have negative degree on a curve, and then sections are forced to vanish there; this is my reasoning, not the code's).
- Without a smooth projective base in Atiyah-Bott, fixed points have no Hodge-cohomological meaning; without $\det(1-A_y)\ne0$ (nondegenerate fixed points) the right side is not defined.
- Without the Witt index range ($\mathrm{rk}A<\mathrm{rk}B\le2\,\mathrm{rk}A$ and $\mathrm{rk}A+\mathrm{wittIdx}B<\mathrm{rk}B$) the theta integral diverges and the Siegel-Weil formula needs regularization.
- Without characteristic zero in `ResolutionCharZero` and `PrincipalisationCharZero`, resolution is not known in general; the statements assume `[CharZero k]` throughout.

## 6. For the explainer

What a chapter on this region must contain.

- One page that explains why a long list of named theorems is on the spine and how they are used: the Hodge bundle package gives a covolume bound (E9 to E14), the
  Galois side gives local-global compatibility (E3, E5, E6), the theta side gives the Siegel-Weil and doubling identities (E8). The chapter should say, in a sentence,
  that the formalization restates each of these as a `Prop` and proves it (section 0), and give the numbers of the table below.
- A statement with a pointer, no intuition, for each classical result: Artin reciprocity, Chebotarev, Tate's thesis, Hironaka, Nadel, Kawamata-Viehweg, Grothendieck existence,
  Grothendieck-Messing, Zarhin's trick, Brauer induction, Chevalley units, Linnik, Poitou-Tate, Bernstein-Zelevinsky, Green. Each deserves one line: what it is, the standard
  reference, and the number of Lean files that prove it.
- A short account, with intuition, of the three where the Lean statement departs from the standard one: `RecTExists` (a weakened local Langlands, section E3), `MoriwakiBigStatement`
  (arithmetic volume in a concrete multiprojective model), and `ChebotarevDegreeOne` (existence of one degree-one prime). These are the places where an expert would ask
  "is this the theorem?".

Interactive figures a reader could drag or play.

1. Green's cuspidal characters of $GL_2(\mathbb F_g)$. Choose $g$ from $\{2,3,5,7\}$; the page lists the $(g^2-g)/2$ degree-two irreducible polynomials over $\mathbb F_g$ with nonzero
   constant term and the character value at the identity ($g-1$) and at an elliptic element, and shows the orbit $\{x,x^g\}$ in $\mathbb F_{g^2}^\times$. Dragging $g$ updates the table.
2. A dependency fan. The reader drags a node (for example `MoriwakiBigStatement`) and sees the statements it needs light up: `ResKStatement`, intersection system,
   `DenseBoundedHeight`, then down to Hironaka. Node sizes are the cone sizes of the table. The data are the dependency cones above (file counts per top folder).
3. Poincare-Lelong in one variable. A smooth metric $h$ on a line bundle over a disc and a section $s$ with a zero at a movable point $a$: the page plots $\log|s|^2/h$ and the
   curvature density $dd^c(-\log h)$, and shows that the Laplacian of $\log|s|$ is the point mass at $a$ minus the curvature, so the integrated identity of E10 holds with $n=0$.
4. Local Langlands laws as a checklist. A table of the laws of `LawsT` against the laws of `Laws`; the reader toggles `Good` and the page shows which laws the Lean theorem
   requires. This is the clearest way to show how the weakened statement differs.

Statements that deserve a result card: `RecTExists` (with the table of laws), `MoriwakiBigStatement`, `HolomorphicLefschetzFormula`, `Green`, `SiegelWeilStd`, `ChebotarevDegreeOne`, `GlobalArtinReciprocity`.

### The table for the page

Sizes are dependency-cone sizes in declarations, files, and lines of the whole files reached (see the conventions). They overlap, they overstate (whole files)
and the tool can miss references through field notation, instances and `simp` sets, so they must not be added.

| Input | Usual name | Role in the proof | Lean name and place | Cone (declarations, files, lines) |
| --- | --- | --- | --- | --- |
| Local Langlands for $GL_n$ (weak form) | Local Langlands correspondence (Harris-Taylor, Henniart, Scholze) | Parametrizes local components of automorphic representations; hypothesis `hL`, second field of `OpenLiteratureStatements` | `RecTExists`, `AA/Foundations/LocalLanglands/IsRecTOfIsRec.lean:78` | 11,067; 1,790; 236,746 |
| Cuspidal characters of $GL_n(\mathbb F_g)$ | Green's theorem (1955) | Depth-zero cuspidals and tame inertial types; `TypeLaw`, `GreenBridge` | `GLq.Green`, `AVT/Definitions/NonGaloisDescent/LabelDatum.lean:108` | 582; 224; 17,396 |
| Global class field theory | Artin reciprocity | Local Artin map; Hecke characters and $\ell$-adic characters | `GlobalArtinReciprocity`, `AVT/PublishedTheorems/AutomorphicForms₂/ExistsUniqueHcharOfFiniteOrder.lean:70` | 2,755; 235; 50,213 |
| Chebotarev (degree one) | Chebotarev density theorem | Auxiliary primes with prescribed Frobenius | `ChebotarevDegreeOne`, `AVT/PublishedTheorems/GaloisCohomology₂/ChebotarevDegreeOneIffCheb.lean:12` | 224; 66; 6,536 (density theorem separate in `GT/GlobalFields/TateThesis`) |
| Hecke $L$-functions | Tate's thesis; Hecke | Continuation, functional equation, nonvanishing at $1$; Dirichlet-type primes | `HeckeLEntireAndNonzeroAtOne`, `.../TwistedTraceFormula/HeckeLEntireAndNonzeroAtOne.lean:28` | 277; 59; 8,678 (`TateThesis` folder: 77 files, 16,795 lines) |
| Chevalley's units lemma | Chevalley | Injectivity of the local Artin map | `ChevalleyUnits`, `AVT/PublishedTheorems/GaloisCohomology₂/ChevalleyUnits.lean:7` | 238; 73; 7,151 |
| Brauer induction (degree zero) | Brauer's theorem | Artin $L$-functions from Hecke $L$-functions | `BrauerDegreeZero`, `AVT/PublishedTheorems/GaloisCohomology₂/BrauerDegreeZero.lean:12` | 113; 61; 4,332 |
| Primes in progressions | Linnik's theorem | Least auxiliary primes | `Linnik`, `AVT/PublishedTheorems/PublishedFoundations/PrimesInProgressionNonempty.lean:9` | 508; 101; 14,814 |
| Siegel-Weil (definite case) | Siegel-Weil formula (Weil) | Averages of theta lifts equal Eisenstein values; `ThetaIntegralsAgree` | `ThK.Dbl.SiegelWeilStd`, `WB/ThetaLifts/LatticeBasics/HypothesesS.lean:11` | 20,451; 3,333; 397,791 |
| Eisenstein continuation with growth | Langlands' continuation of Eisenstein series | Input of Siegel-Weil | `ThK.Dbl.EisBL`, `WB/ThetaLifts/LatticeBasics/HypothesesE.lean:46` | 2,913; 385; 58,584 |
| Holomorphic Lefschetz | Atiyah-Bott fixed point formula | Weight-one geometric realization of Galois representations | `HolomorphicLefschetzFormula`, `AA/Foundations/GaloisRepresentations/LefschetzSigmaSums/HodgeTraceFromLefschetzAndGroupSide.lean:102` | 3,785; 524; 82,938 |
| Resolution in characteristic $0$ | Hironaka | Everything in the Hodge-bundle package | `ResolutionCharZero`, `AS/PublishedTheorems/Geometry₂/ConclusionOfSmooth.lean:53` | 6,145; 467; 134,960 |
| Principalization | Hironaka | Nadel vanishing, arithmetic Hilbert-Samuel | `PrincipalisationCharZero`, `AS/PublishedTheorems/Geometry₂/NotSubsetOfDenseCompl.lean:57` | 5,160; 393; 114,992 |
| Poincare-Lelong | Poincare-Lelong formula | Arithmetic intersection system, Arakelov calculus | `PoincareLelong`, `AS/PublishedTheorems/Metrics₂/PoincareLelong.lean:6` | 3,864; 889; 108,474 |
| Arithmetic bigness | Arithmetic Hilbert-Samuel, bigness (code: Moriwaki) | Lower bound on small sections of the Hodge bundle | `MoriwakiBigStatement`, `RT/ReductiveGroups/ArithmeticGeometry/ArakelovGeometry/MoriwakiSt.lean:29` | 20,447; 2,985; 479,232 |
| Arithmetic Hilbert-Samuel | Gillet-Soulé, Zhang | Volume of the Hodge bundle | `ArithHilbertSamuel`, `AVT/PublishedTheorems/Divisors₂/SmallSecTensTriv.lean:14` | 6,127; 1,457; 163,762 |
| Nadel vanishing and point separation | Nadel; Angehrn-Siu | Global generation of the Hodge bundle powers | `NadelVanishingAndNonKltDivisor`, `AVT/PublishedTheorems/Divisors₂/IsLogCanonicalMultipleCanonical.lean:574` | 9,757; 1,518; 240,897 |
| Kawamata-Viehweg vanishing | Kawamata-Viehweg | Cohomology vanishing for nef and big bundles | `KawamataViehweg`, `AVT/PublishedTheorems/Divisors₂/KawamataViehweg.lean:16` | 1,435; 137; 46,073 (given Nadel pair) |
| Hodge-Tate exactness | Fargues; Hodge-Tate sequence | $p$-adic period control | `FarguesExact`, `AS/PublishedTheorems/Algebra₂/FarguesExact.lean:10` | 2,531; 702; 54,462 |
| Zarhin's trick | Zarhin | Reduction to principal polarizations | `ZarhinStatement`, `AS/PublishedTheorems/Algebra₂/ZarhinStatement.lean:21` | 6,056; 808; 145,999 |
| Grothendieck-Messing | Grothendieck-Messing deformation theory | Integral models and lifts | `GrothendieckDeformation`, `AVT/PublishedTheorems/Divisors₂/GrothendieckDeformation.lean:12` | 18; 5; 2,140 given its two inputs: `AbelianLifting` 10,185; 2,234; 231,458 and `AbelianDeRham` 7,882; 1,130; 168,166 |
| Grothendieck existence | Formal algebraization (EGA III) | Algebraic models from formal ones | `FormalAlgebraisation`, `AVT/PublishedTheorems/Divisors₂/FormalAlgebraisation.lean:43` | 3,708; 486; 77,826 |
| Toroidal compactification | Toroidal compactifications of Shimura varieties | Compact moduli for the Hodge bundle | `ToroidalCompactification`, `AVT/PublishedTheorems/Divisors₂/DenseInterior.lean:146` | at least 40,000; 10,289; 1,051,258 (tool cap reached) |
| Nef numerics | Nef cone numerics, Riemann-Roch | Used with bigness | `NefNumerics`, `AVT/PublishedTheorems/Divisors₂/ExistsAlgClosedBaseChange.lean:32` | 1,283; 181; 34,551 |
| Cycle heights and Arakelov calculus | Arithmetic intersection theory | Heights of cycles | `CycleHeights`, `AVT/PublishedTheorems/Divisors₂/ResidueDegreeOfIsClosedImmersion.lean:109` | 6,495; 1,194; 181,377 |

### Areas of mathematics the formalization had to build

From the inventory (section 1, Appendix A). The numbers are files and lines of the folders, not of a dependency cone. The brief says Mathlib lacks these; I could not check that, since Mathlib is not on disk (the tree
imports 344 `Mathlib` modules and builds on them).

| Area | Folder | Files | Lines |
| --- | --- | ---: | ---: |
| Heights, Arakelov geometry, Moriwaki bigness, Hilbert-Samuel | `GT/HeightsAndTheta` (of which `Heights` 6,348 files, 626,821 lines) | 6,410 | 641,322 |
| Arakelov volumes, birational geometry, toroidal compactification, charts | `RT/ReductiveGroups/ArithmeticGeometry` | 1,623 | 239,112 |
| Arakelov metrics, Poincare-Lelong, block decompositions | `AS` | 15,147 | 1,195,844 |
| Published-theorem statements in the Moriwaki and Poincare-Lelong bundle | `WB/CoreStatements` | 3,746 | 455,457 |
| Resolution of singularities in characteristic $0$ (Hironaka) | `Development/ResolutionOfSingularities` | 499 | 140,709 |
| $p$-adic Hodge theory | `GT/PAdicHodge` | 226 | 64,317 |
| Wach modules and lattice twists | `Formalism/WachLatticeTwists` | 262 | 38,367 |
| Étale cohomology | `Development/EtaleCohomology` | 1,398 | 104,525 |
| Profinite and Galois cohomology | `GT/ProfiniteCohomology` | 450 | 84,902 |
| Tate cohomology, Brauer groups | `GT/TateCohomology`, `GT/Brauer` | 76 | 13,478 |
| Scheme cohomology, abelian varieties, modular curves, toric varieties | `GT/ArithmeticGeometry` | 218 | 45,046 |
| Global and local fields, class field theory, Tate's thesis | `GT/GlobalFields` (TateThesis 77 files, 16,795 lines), `GT/LocalFields`, `RT/ClassFieldTheory` | 384; 159; 91 | 72,305; 40,767; 11,830 |
| Chebotarev (density) | `RT/Chebotarev` | 47 | 4,382 |
| Automorphic forms and representations (GL2, Whittaker, tensor product) | `GT/AutomorphicForms` | 542 | 150,005 |
| Automorphic theory, Harish-Chandra modules, real groups | `CompanionTheory` | 2,027 | 194,218 |
| Discrete series, formal degree, multiplicity one | `RT/ReductiveGroups/DiscreteSeries` | 1,021 | 154,332 |
| Representation theory of $GL_n$, theta lifts, archimedean base change | `WB/RepresentationTheoryGL` | 2,486 | 274,147 |
| $L^2$ $\bar\partial$ estimates, analytic forms | `RT/L2DbarEstimates`, `RT/AnalyticForms` | 227; 192 | 33,734; 36,680 |
| Jacquet-Langlands, cyclic base change, cuspidal continuity (names from the index; contents not read) | `PositivityTheory/AutomorphicForms/PublishedInputs` | 445 | 54,970 |
| Theta correspondence and Weil representation | `AA/ThetaCorrespondence` | 3,201 | 178,983 |

All of this is in the import closure of `Main` (inventory, Summary): there are no axioms, no `sorry`, and no skipped proofs, so none of it is an assumption.

## 7. Not understood

- `CovolumeBoundOfX`, `L3`, `FamHyp`, `EventuallyAtAllPoints` (`TPL/LiftLambdaBound.lean:60`): read but not unfolded, since they belong to reader 2. I do not know which quantity `L3` bounds.
- `Good` in `LawsT`: I did not locate where the `Good` restriction is consumed on the spine, so I cannot say whether the weakened local Langlands is exactly what the global argument uses or merely sufficient.
- The vanishing core behind Nadel and Kawamata-Viehweg: `vanishFrom_adj : Quoted → ...` (`AVT/Proofs/DivisorProofs/KawamataViehwegVanishingNumberFieldTwist.lean:65`). I did not find where `Quoted` is discharged. Since the whole tree has no axioms it must be, but my trace of Nadel passes through it without resolving it.
- Which of the two Chebotarev routes the published statement `ChebotarevDegreeOne` ultimately calls (the cyclotomic route in `AVT/Proofs/InertiaEigenvalues`, or the density theorem in `GT/GlobalFields/TateThesis`). The spine showed the cyclotomic route.
- `KTriv` in `PolAV`; `IsFullIntersectionSystem` axioms beyond `IsIntersectionSystem` (`IsMultilinFam`, `HasPFCoord`, `HasContractMixed`); `Canonical` in `GrothendieckMessing.At`; `IsTan`, `hodgeH`, `hodgeTrace`, `hodgePull` (read as Hodge cohomology and the trace and pullback maps of a finite étale morphism, not opened).
- The statements of the roughly 160 wrappers outside E1 to E14 were read in one-line form (name, statement head, proof's place); for most I did not follow the proof beyond its first layer. The classification into families (about 33 class field theory and number theory, about 34 local $GL_n$, about 69 real groups and theta, about 18 Galois cohomology, about 32 algebraic geometry) is mine from the names and statements and is approximate.
- The attribution of `MoriwakiBigStatement` and `DenseBoundedHeight.Statement` to published theorems (Gillet-Soulé, Zhang, Moriwaki, Yuan) is from the shape; I give no reference.
- Whether the statements in `PositivityTheory/AutomorphicForms/PublishedInputs` (445 files) are on the spine; only the folder names were read.
- Cone sizes: computed by a heuristic tool, so each is approximate; the cone of `heckeTateFunctionalEquation` was visibly cut (5 declarations).
