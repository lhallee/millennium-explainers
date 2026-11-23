# Lean reading 3: theta-lift existence, the Galois-representation side, and the integrality bookkeeping

Reader 3 of the reading plan in `lean-inventory.md` (section 5). Source tree: `sources/riemann/lean/lean/src/`, read
2026-11-21 through the index in `.cache/lean-index/index.sqlite`, the scripts in `tools/lean/`, and direct reads of the
files named below. Paths are relative to the source tree. Nothing in `sources/` was built or run.

Two methods were used beyond reading. (1) Text search restricted to the files that import a given module, to find who
cites a declaration. (2) A declaration-level reachability search from `UpperTheory.FinalTheorems.everyCharacter`
(statement and body references, resolved by namespace and `open` lists as `spine.py` does, with no fan-out cap), to
decide whether a statement is a logical dependency of the final theorem or only sits in the import closure. Every
file is imported by `Main`, but import is not use: section 7 lists the statements that are imported and not used.
Reachability results are marked "reached from `everyCharacter`" with the chain; the resolver over-approximates
(an ambiguous name counts every candidate), so a "reached" chain was also checked by reading its links, and a "not
reached" verdict is only as good as the resolver.

## Summary of findings

1. **`Row0b` is the existence theorem for Galois representations attached to regular algebraic polarized cuspidal
   representations of $\mathrm{GL}_a$ over a CM field, with a weakened form of local-global compatibility.** The tree
   proves it from scratch. The theta lift `TLiftK` enters it in one place only: to raise an even rank $n$ to an odd rank
   $n+t$ (two lifts with disjoint auxiliary characters, then subtraction of the characters). `GeoOne` supplies
   Galois representations from the étale cohomology of a variety with Hecke correspondences.
2. **The folders `ZetaCharacterDivisibility` and `CongruenceOddLevel` are not the $p$-adic divisibility engine of
   the note.** `ZetaCharacterDivisibility` is divisibility of characteristic polynomials: it cuts an $a$-dimensional
   Galois representation out of a larger geometric one ("division"). `CongruenceOddLevel` produces $\ell$-adic
   congruences between automorphic forms on definite unitary groups, used to construct Galois representations as
   $\ell$-adic limits. Both serve `Row0b`.
3. **The $p$-adic divisibility engine of the note's steps 2 and 10 is `ThmP` and its neighbours**, reached from
   `everyCharacter` through reader 2's theta-integral assembly. Its constants are $\gamma_\ell = \ell/(\ell^2-1) =
   \sum_{k \text{ odd}} \ell^{-k}$ and $\rho_\ell = 1/(\ell^2-1)$, the series of the note's step 2
   ($p^{a/p + a/p^3 + \cdots - O(\log a)}$), built from $\ell^i$-th powers of variables and the Cayley operator
   $\det(\partial)$ applied to powers of determinants. The size side it is compared with, on the spine, is the
   product formula (`norm_height_bound`); the Arakelov slope inequality `DivIneqObjU` and `TheoremM` are in the tree
   but not reached from `everyCharacter`.
4. **Step 17 is located**: `UpperTheory.V.SmallClassNumbers.bound` bounds, polynomially in $e$, the total
   $\log$-size over primes $\ell$ of the group of everywhere unramified classes in
   $H^1(\mathbb Q, \mathcal O\otimes\mathbb Q_\ell/\mathbb Z_\ell(-e))$. It is proved and imported by `Main`, but
   it is **not** a logical dependency of `riemannHypothesis` (section 4, step 17).
5. **The Behrend statement in `Formalism/BehrendSets` (`BehrendBound`, `ThickSet`) is stated and never proved or
   used.** The Behrend-type construction that the proof uses is `Formalism.FrobeniusOrbits.hostThickExists`, reached
   through `supplyChi`/`hostOfField` inside `zero_free_all_of_green_v_win` (reader 1's endgame): a choice of positions
   along Frobenius orbits. `Formalism/TameInertiaTowers` is the tower of CM fields
   $\mathbb Q(\zeta_{2^n}, \sqrt{-q}, \sqrt{-d})$; it is reached only through an example construction.

## 1. What this region proves

### 1.1 `Row0b`: Galois representations for polarized cuspidal representations

`UpperTheory.GalStar.Row0b` (def), `Development/AutomorphicArithmetic/Foundations/GaloisRepresentations/TypeConditions/WeightsConjBis.lean:69`

```lean
def Row0b : Prop :=
  ∀ (E Ω : Type) [Field E] [NumberField E] [IsCMField E] [Field Ω] [Algebra E Ω] [IsAlgClosure E Ω]
    (l : ℕ) [Fact l.Prime] (ι : Qbar l ≃+* ℂ) (a : ℕ), 1 ≤ a →
    ∀ (π : CuspSub E a) (χ : HChar (maximalRealSubfield E)), (CG.mk π).IsRegAlg → GlobalTheory.ContraPair.PolarizedPair π χ →
      ∃ (r : G E Ω →* GL (Fin a) (Qbar l)) (wt : ℤ) (HT : (E →+* Qbar l) → Multiset ℤ), PropsB Rc π ι r wt HT
```

In ordinary mathematics (with `Rc` instantiated to `recT`, the local Langlands correspondence, see 2.2): for every
CM field $E$ with algebraic closure $\overline E$, every prime $\ell$, every field isomorphism
$\iota:\overline{\mathbb Q}_\ell\to\mathbb C$, every $a\ge1$, every cuspidal automorphic representation $\pi$ of
$\mathrm{GL}_a(\mathbb A_E)$ that is regular algebraic, and every Hecke character $\chi$ of the maximal totally real
subfield $E^+$ such that $(\pi,\chi)$ is a polarized pair, there exist a continuous semisimple representation
$r:\mathrm{Gal}(\overline E/E)\to\mathrm{GL}_a(\overline{\mathbb Q}_\ell)$, an integer $w$ and multisets of
Hodge-Tate weights $\mathrm{HT}_\tau$ for each embedding $\tau:E\to\overline{\mathbb Q}_\ell$ satisfying `PropsB`:

- **weights**: $\mathrm{HT}_\tau = \{(a-1)/2 - z\}$ as $z$ runs over the infinitesimal character of $\pi$ at the
  complex place $\iota\circ\tau$;
- **weights_conj**: $\mathrm{HT}_{\tau\circ c} = w - \mathrm{HT}_\tau$, with $c$ complex conjugation (the
  polarization seen on Hodge-Tate weights);
- **away from $\ell$** (`away`, built from `AwayB`): at every finite place $v\nmid\ell$, the Weil-Deligne
  representation of $r|_{G_{E_v}}$ (`wdOf`) and $\mathrm{rec}(\pi_v)$ have the same dimension; they are equal when
  $\mathrm{rec}(\pi_v)$ has zero monodromy and is unipotent on commutators of the Weil group; and when $E_v\cong
  \mathbb Q_g$ for a prime $g>16a^2$ (or $a=1$), $\mathrm{rec}(\pi_v)$ is tamely ramified with square-free inertia
  polynomial and zero monodromy, then $r|_{G_{E_v}}$ has zero monodromy and the same Frobenius characteristic
  polynomials on degree-zero elements;
- **above $\ell$** (`above`, built from `AboveB`): at $v\mid\ell$, if $\pi_v$ is spherical then $r|_{G_{E_v}}$ is
  crystalline, de Rham, with Hodge-Tate weights $\mathrm{HT}$; under the analogous "tame and square-free or
  commutator-unipotent" hypotheses it is potentially semistable, de Rham, with the same weights, and its
  Weil-Deligne representation (Fontaine's functor `wdAt`) matches $\mathrm{rec}(\pi_v)$ in the weakened sense above.

This is the theorem of Chen, Harris, Harris, Taylor, Shin and Barnet-Lamb, Gee, Geraghty, Taylor, with local-global
compatibility in the direction of Caraiani, in a weakened form: `Row0b` is obtained from the stronger `Row0` (same
shape, structure `Props`, `WeightsConjAlt.lean:85`) by `Row0.row0b` (`WeightsConjBis.lean:84`), which only forgets
the condition $E_v\cong\mathbb Q_g$ with no size restriction in favour of $g>16a^2$. The code calls the field
`caraianiLocalGlobalDual` when it passes `Row0b` on (section 6.1). I am sure of the attribution of the existence
statement; the exact matching of each clause to a published theorem is reader 5's task.

### 1.2 How `Row0b` is obtained

`UpperTheory.Gal.Int.galoisLocalGlobalStrong_recParameter` (theorem), `.../GaloisRepresentations/IntegralStructures/RowSrc.lean:6`

```lean
theorem galoisLocalGlobalStrong_recParameter : UpperTheory.GalStar.Row0b recT := galoisRepresentations_of_thetaLift UpperTheory.TP.K.tLiftK
```

and `galoisRepresentations_of_thetaLift up := galoisLocalGlobalStrong_of_geometry_lift geoOne_holds up`
(`GaloisRepresentationsOfThetaLift.lean:6`). The whole proof is in `IntegralStructures/Development.lean`:

```lean
theorem coreAll_of (seed : SeedFinOdd) (cong : CongFinOdd) (up : UpperTheory.TP.TLiftK) : GlobalTheory.RoadU.CoreAll :=
  UpperTheory.Gal.Int.Inp.coreAll_of_core
    (UpperTheory.Gal.Int.Core.toCoreK up UpperTheory.Gal.ClosedPhiFromClosedTrace.congPhi_holds UpperTheory.Gal.Desc.descOffT (UpperTheory.Gal.Lim.limFinOdd_of seed cong))

theorem rest (h : GlobalTheory.RoadU.CoreAll) : UpperTheory.GalStar.Row0 recT :=
  UpperTheory.Gal.Int.Row.galoisLocalGlobal_of_localGlobalCompatibility h (UpperTheory.Gal.ToralGalois.galoisCompat_unlinkedSupport_of_spherical h) (UpperTheory.Gal.ToralGalois.R2.localGlobalCompatAtIwahoriFixed_of_unlinked (UpperTheory.Gal.ToralGalois.galoisCompat_unlinkedSupport_of_spherical h))

theorem galoisLocalGlobal_of_geometry_lift (geo : UpperTheory.Gal.Int.Geo.GeoOne) (up : UpperTheory.TP.TLiftK) : UpperTheory.GalStar.Row0 recT :=
  rest (coreAll_of (UpperTheory.Gal.Int.Div.seedFinOdd_of_geoOne geo) (UpperTheory.Gal.Int.Cong.congFinOdd_of_ex UpperTheory.Gal.Wt.wtLacEx_holds) up)

theorem galoisLocalGlobalStrong_of_geometry_lift (geo : UpperTheory.Gal.Int.Geo.GeoOne) (up : UpperTheory.TP.TLiftK) : UpperTheory.GalStar.Row0b recT :=
  UpperTheory.GalStar.Row0.row0b recT (galoisLocalGlobal_of_geometry_lift geo up)
```

So: **from `GeoOne` and `TLiftK`, `Row0b` follows** through the seed (`SeedFinOdd`, Galois representations for
forms of a good type, from geometry), the congruences (`CongFinOdd`), the $\ell$-adic limit (`LimFinOdd`), the
parity step (`TwoUpOK`, from `TLiftK`), and local-global compatibility (`rest`). Section 3 gives each step.

### 1.3 `TLiftK`: existence of theta lifts between totally definite unitary groups

`UpperTheory.TP.TLiftK` (def), `.../ThetaParseval/HalfIndexLattices/TLiftK.lean:12`, proved as `UpperTheory.TP.K.tLiftK`
(`ThetaParseval/ThetaKernels/TLiftK.lean`) by `tLift_holds_k` (`ThetaKernels/TPGHolds.lean:58`).

```lean
def TLiftK : Prop :=
  ∀ (E : Type) [Field E] [NumberField E] [IsCMField E] (B : Base (maximalRealSubfield E) E), W.GoodK (cj E) B →
    ∀ (n : ℕ), 1 ≤ n → ∀ X : Spc (maximalRealSubfield E) E n, X.J = 1 → X.IsHerm (cj E) B n 0 →
    ∃ d₀ : ℕ, ∀ d, d₀ ≤ d → ∀ (W : Spc (maximalRealSubfield E) E d) (δ : E), W.J = δ • (1 : Matrix (Fin d) (Fin d) E) →
      W.IsSkew (cj E) B d 0 → ∀ (χX χW : Chr (maximalRealSubfield E) E) (mX mW : InfinitePlace (maximalRealSubfield E) → ℤ),
      IsHecke (maximalRealSubfield E) E χX → IsHecke (maximalRealSubfield E) E χW →
      ResEtaPow (Units.map (algebraMap (maximalRealSubfield E) (AF (maximalRealSubfield E))).toMonoidHom).range χX n →
      ResEtaPow (Units.map (algebraMap (maximalRealSubfield E) (AF (maximalRealSubfield E))).toMonoidHom).range χW d →
      HasExp B.emb χX mX → HasExp B.emb χW mW →
      ∀ (U : Submodule ℂ (GlobalTheory.UnitaryBC.UA E n → ℂ)) (lam : InfinitePlace (maximalRealSubfield E) → DomWeight n),
        GlobalTheory.UnitaryBC.IsAutRepU U → (∀ w, GlobalTheory.UnitaryBC.HasWeightAt U (B.emb w).1 (lam w)) →
        (∀ w k, (d : ℤ) + mW w ≤ 2 * (lam w).w k) → ∃ U' : Submodule ℂ (GlobalTheory.UnitaryBC.UA E d → ℂ), IsLift B χX χW mX mW lam U U'
```

In ordinary mathematics. Let $E$ be a CM field with totally real subfield $F=E^+$, satisfying `GoodK` (2.3:
$E/F$ unramified at all finite places, $E\supset\mathbb Q(\sqrt{-d})$ for some positive integer $d$, conditions on
the additive character at inert places). Let $X=E^n$ with the standard Hermitian form $\sum x_i\bar y_i$, which is
positive definite at every real place of $F$ and has a self-dual lattice. Then there is $d_0$ such that for every
$d\ge d_0$ and every skew-Hermitian space $W=E^d$ with form $\delta\cdot\sum x_i\bar y_i$ (so $i\delta$ is positive
definite at every real place, and the lattice is self-dual for the trace form), every pair of unitary Hecke characters
$\chi_X,\chi_W$ of $\mathbb A_E^\times$ whose restrictions to $\mathbb A_F^\times$ are $\eta_{E/F}^n$ and
$\eta_{E/F}^d$ (`ResEtaPow`; $\eta_{E/F}$ the quadratic character of $E/F$) and whose infinity types are $z\mapsto
(z/|z|)^{m}$ (`HasExp`), and every irreducible automorphic representation $U$ of the compact unitary group
$\mathrm U_n(\mathbb A_F)$ with highest weights $\lambda_w$ at the real places such that
$d + m_W(w) \le 2\lambda_{w,k}$ for every place $w$ and index $k$: there is an irreducible automorphic
representation $U'$ of $\mathrm U_d(\mathbb A_F)$ that is a lift of $U$ (`IsLift`, 2.3), that is:

- $U'$ is automorphic and irreducible;
- at each real place $U'$ has highest weight $\lambda'$ with
  $2\lambda'_k = 2\lambda_k - d - m_W + n + m_X$ for $k<n$ and $2\lambda'_k = n+m_X$ for $n\le k<d$ (`IsLiftWt`);
- at each place of $F$ that splits in $E$, so that both unitary groups become $\mathrm{GL}_n(F_v)$ and
  $\mathrm{GL}_d(F_v)$, the local components $\tau$ of $U$ and $\tau'$ of $U'$ are related by the local theta
  correspondence for the type II dual pair $(\mathrm{GL}_n,\mathrm{GL}_d)$: there is a nonzero map from the Schwartz
  space of $n\times d$ matrices tensored with $\tau$ to $\tau'$ intertwining the Weil representation twisted by
  $(\chi_W^{-1},\chi_X)$ (`LocPair`).

Both groups are compact at infinity ("totally definite"), so automorphic forms on them are functions on finite sets
modulo level. The condition $d\ge d_0$ is a stable-range condition; the proof (3.9) takes $d_0=\max(N, 2n)$ with $N >
2t_0$, $t_0$ an integrability exponent of a height function.

### 1.4 `GeoOne`: Galois representations from geometry, for odd rank

`UpperTheory.Gal.Int.Geo.GeoOne` (def), `.../IntegralStructures/GeometricFlagBases/HodgeTrAt.lean:79`, proved by
`geoOne_holds := geometric_realization_of_weight_one weight_one_geometric_realization`
(`WeightOneGeometricRealization.lean`).

```lean
def GeoOne : Prop :=
  ∀ (E Ω : Type) [Field E] [NumberField E] [IsCMField E] [Field Ω] [Algebra E Ω] [IsAlgClosure E Ω] (l : ℕ) [Fact l.Prime] (ι : Qbar l ≃+* ℂ)
    (a : ℕ), Odd a → ∀ d : ℕ, FieldOK E l d → ∀ x : E, x ^ 2 = -(d : E) →
    ∀ T : Finset (HeightOneSpectrum (𝓞 E)), NonSplitSet T → ∀ w₀ v' : HeightOneSpectrum (𝓞 E), ((l : ℕ) : 𝓞 E) ∈ w₀.asIdeal → ((l : ℕ) : 𝓞 E) ∈ v'.asIdeal → Apart v' w₀ → OneK x w₀ v' →
    ∀ (S : Finset (HeightOneSpectrum (𝓞 E))) (U : Submodule ℂ (UA E a → ℂ)), AutOffT T U → GlobalTheory.CongW.TyEll E l a w₀ U → SphOffU w₀ S U →
    (∃ B, SatU U v' B) → LacWtAt ι v' U →
    (∃ (dd : ℕ) (ρ : G E Ω →* GL (Fin dd) (Qbar l)), VBase ι d U ρ) ∧
    (∀ w, UsPl d w → ((l : ℕ) : 𝓞 E) ∉ w.asIdeal → (∃ B, SatU U w B) →
      ∃ (dd : ℕ) (ρ : G E Ω →* GL (Fin dd) (Qbar l)), VBase ι d U ρ ∧ ∀ B, SatU U w B → ESAt ι ρ w (algSat a (normV w) B)) ∧
    ∀ w, ((l : ℕ) : 𝓞 E) ∈ w.asIdeal → OneK x w v' → Apart w w₀ → Apart w v' → (∃ B, SatU U w B) →
      (∃ (dd : ℕ) (ρ : G E Ω →* GL (Fin dd) (Qbar l)), VBase ι d U ρ ∧ CrysAt ρ w ∧ JumpsOcc U ι ρ w) ∧
      ∃ (dd : ℕ) (ρ : G E Ω →* GL (Fin dd) (Qbar l)), VBase ι d U ρ ∧ ∀ B, SatU U w B → PhiKilled ι ρ w a B
```

In ordinary mathematics: let $E$ be CM, $a$ odd, $E\ni\sqrt{-d}$, and $U$ an automorphic representation of the
definite unitary group $\mathrm U_a$ over $E^+$ of a good type at an auxiliary $\ell$-adic place $w_0$ (`TyEll`,
2.6), spherical outside a finite set, with lacunary Hodge weights at an $\ell$-adic place $v'$. Then there is a
continuous semisimple $\rho:G_E\to\mathrm{GL}_{dd}(\overline{\mathbb Q}_\ell)$ of some dimension $dd$ (not $a$) whose
Frobenius eigenvalues at almost all unramified split places contain the Satake parameters of $U$ (`VBase`, `ESAt`),
and for each $\ell$-adic place a version that is crystalline there with the Hodge-Tate weights of $U$ occurring
(`JumpsOcc`) and whose crystalline Frobenius characteristic polynomial divides a power of the Satake polynomial
(`PhiKilled`). The representation $\rho$ is a piece of the étale cohomology of a variety $Z$ cut out by Hecke
correspondences (`HTower`, `IsPiece`, 2.5); the input `HolomorphicLefschetzFormula` (the Atiyah-Bott holomorphic
Lefschetz fixed point formula for finite étale correspondences on a smooth projective complex variety) computes
Hodge numbers of the pieces from fixed points, hence Hodge-Tate weights. "Weight one" in the names suggests weight-one
cohomology (abelian varieties); I did not open `KSAll` or `PlanEx` far enough to name the variety $Z$.

### 1.5 The integrality statements

- `Formalism.L2.FormalSeriesBounds.ThmP` (def), `Formalism/LocalToGlobal/CharacterGerms/BiadditiveInSingleVariables.lean:108`;
  a near-copy is `Formalism.IncomingBounds.ThmP` (`Formalism/IncomingBounds/StatementThmP.lean:60`). Proved by
  `GlobalTheory.OddBlock.WindowValuationBound.main` and exported as `GlobalTheory.OddBlock.windowBound`
  (`Development/AbelianVarietyTheory/Proofs/UnramifiedDepth/SumEqOfIsHomogeneous.lean:917, 961`). Stated in 3.10.
- `UpperTheory.V.SmallClassNumbers.bound : Bound` (`Development/AutomorphicArithmetic/AutomorphicVarieties/SmallClassNumbers/CorGKOf.lean:27`),
  the weak Vandiver statement, stated in 4 (step 17).
- `Formalism.BehrendSets.trivStab : TrivStab` and `Formalism.FrobeniusOrbits.hostThickExists : HostThickExists`
  (section 4, steps 11 and 19).

## 2. Definitions unfolded

### 2.1 Groups, forms, representations

- **`UA E n`** (abbrev, `Development/AbelianVarietyTheory/PublishedTheorems/GaloisCohomology₂/BaseChangeDefiniteUnitary.lean:71`):
  the subgroup of $\mathrm{GL}_n(\mathbb A_E)$ preserving the standard Hermitian form, i.e. $\mathrm U_n(\mathbb A_F)$
  for $F=E^+$. A group. Compact at infinity.
- **`IsAutFormU φ`, `IsAutRepU U`** (structures, same file :108, :115): $\varphi$ is a continuous function on
  `UA E n`, left invariant by the rational points, right invariant by an open compact subgroup of the finite part,
  generating a finite-dimensional space under the compact infinite part. `IsAutRepU U` says $U$ is a nonzero
  space of such functions, stable and irreducible under right translation. An irreducible automorphic
  representation of the definite unitary group.
- **`HasWeightAt U τ lam`** (def, :139): at the complex embedding $\tau$, $U$ contains the irreducible algebraic
  representation of $\mathrm U_n(\mathbb R)\subset\mathrm{GL}_n(\mathbb C)$ of highest weight $\lambda$. Here
  `DomWeight n` (`Formalism/LocalRingCardinality/DataCoeff.lean:13`) is a non-increasing integer vector and
  `sqRep` the corresponding dual Weyl module.
- **`CuspSub E a`, `CG.IsRegAlg`** (from `Development/AbelianVarietyTheory/Definitions/AutomorphicMembership/ExpoConjOfIsCsd.lean`):
  cuspidal automorphic subrepresentations of $\mathrm{GL}_a(\mathbb A_E)$ and the regular algebraic condition on
  infinitesimal characters. I did not unfold these two; their names and the use of `infChar` in `PropsB.weights`
  fit the standard notions.
- **`PolarizedPair π χ`** (structure, `Development/AbelianVarietyTheory/Definitions/GaloisGeometry/DualIsConjByOne.lean:53`):
  `sign`: $\chi_v(-1) = (-1)^a$ at every real place $v$ of $E^+$; `dual`: $\pi^\vee \cong \pi^c\otimes(\chi\circ
  N_{E/E^+})$. The standard polarization of Barnet-Lamb, Gee, Geraghty, Taylor.

### 2.2 The Galois side

- **`RecNotion`** (abbrev, `WeightsConjAlt.lean`): a predicate on maps from irreducible smooth representations of
  $\mathrm{GL}_n(E_w)$ to Weil-Deligne representations. **`recT`** (`Development.lean:18`) is `IsRecT`, which is
  `∃ a ha, LawsT a ha rc` (`Development/AutomorphicArithmetic/Foundations/LocalLanglands/IsRecTOfIsRec.lean:76`): `rc`
  satisfies the characterizing laws of the local Langlands correspondence (dimension, compatibility with local class
  field theory for characters via the Artin map `a`, Langlands classification by segments, cuspidal to irreducible,
  twisting, central character, duals). So `Row0b recT` speaks about $\mathrm{rec}$.
- **`wdOf h hl ι r`** (`.../WeilDeligneParamMonodromyEqZeroIff.lean:352`): the Weil-Deligne representation of
  $r|_{G_{E_w}}$ at $w\nmid\ell$ (Grothendieck's monodromy theorem; `IsWDOf` with a tame character), with a trivial
  default if none exists.
- **`AwayB x y`** (`WeightsConjBis.lean:26`): `dim` equal dimensions; `tor`: if $y$ is unipotent on commutators
  (`Tor`: the characteristic polynomial of $y([s,t])$ is $(X-1)^{\dim}$) and has zero monodromy, then $x=y$;
  `tame0`: if $E_w\cong\mathbb Q_g$ with $g>16a^2$ or $a=1$ (`IsQpBig`), $y$ is tame (`TmW`: inertia acts unipotently
  on wild inertia, i.e. the inertia polynomial of wild elements is $(X-1)^{\dim}$), has square-free inertia
  polynomial up to roots of unity of order dividing $q_w-1$ (`Sqf`), and zero monodromy, then $x$ has zero monodromy
  and the same Frobenius characteristic polynomials on degree-zero elements.
- **`AboveB`** (`WeightsConjBis.lean:39`): at $\ell$-adic places, `crys` (spherical implies crystalline, de Rham, with
  the jumps `HT`) and `nice` (as above with potentially semistable and the WD comparison through `wdAt`).
- **`PropsB`** (`WeightsConjBis.lean:54`): the record listed in 1.1. A proposition about one representation $r$.
- **`Row0`** (`WeightsConjAlt.lean:85`) and **`Props`** (:66): the same with `Away` (no bound on $g$) in place of
  `AwayB`.

### 2.3 The theta-lift side

- **`Base F E`** (structure, `Development/AbelianVarietyTheory/BlockTheory/DivisorBase/WeilTensorModels.lean:140`):
  an additive character $\psi$ of $\mathbb A_F$, a choice of embedding of $E$ over each real place, integers
  $m_\alpha,m_\beta$, a finite set $P$ of places with embeddings $E\to F_v$ (split places), and one more split place.
- **`Spc F E n`** (:160): a matrix $J\in M_n(E)$, an $\mathcal O_E$-submodule $L\subset E^n$, Cartan involutions at
  infinity, local bases. **`Spc.IsHerm B X r s`** (:182): $J$ Hermitian, signature $(r,s)$ at every real place, $L$ a
  lattice equal to its dual for the form. **`IsSkew`** (:192): $J$ skew-Hermitian, $iJ$ of signature $(r,s)$, $L$
  self-dual for the trace form. `IsHerm _ _ n 0` and `IsSkew _ _ d 0` are total definiteness.
- **`W.GoodK σ B`** (structure, `.../ThetaParseval/HalfIndexLattices/SplitStab.lean:18`): $E/F$ is CM with
  complex conjugation $\sigma$; `HasK E`: $E\ni x$ with $x^2=-d$, $d>0$ an integer; $\mathcal O_E/\mathcal O_F$
  unramified; $\psi$ standard; at inert places $v$: $v\nmid 2$, $Nv>3$, $\psi$ unramified; $\psi$ unramified on $P$.
- **`Chr F E`** (:109): continuous unitary characters of $\mathbb A_E^\times$. `IsHecke` (`GlobalTheory.LFun.IsHecke`,
  `.../NotIsSplitOfIsInertAt.lean:266`): trivial on $E^\times$ (I read the signature, not the body). **`ResEtaPow K χ
  n`** (`.../HilbertNinetyQuotientHomEqIff.lean:396`): $\chi$ restricted to $\mathbb A_F^\times$ is $1$ on
  $F^\times N(\mathbb A_E^\times)$ and $(-1)^n$ elsewhere, i.e. $\chi|_{\mathbb A_F^\times}=\eta_{E/F}^n$, the
  splitting-character condition for unitary dual pairs. **`HasExp emb χ m`** (:114): on $(\mathbb A_E\otimes)^\times$
  near infinity, $\chi(z)=\prod_w (z_w/|z_w|)^{m_w}$.
- **`IsLiftWt lam mX mW lam'`** (`SchurStep.lean:103`), **`LocPair`** (:93), **`IsLift`** (:106): as in 1.3.
- **`TLift`** (`SchurStep.lean:116`) is the same statement as `TLiftK` with `B.IsGood` in place of `W.GoodK`;
  `TLift_k` (`ThetaKernels/GalTPDefs.lean:45`) is literally `TLiftK`.

### 2.4 Division and congruences (`IntegralStructures`)

- **`VBase ι d U ρ`** (`ZetaCharacterDivisibility/InsideRefl.lean:73`): $\rho$ continuous, semisimple, its
  Frobenius eigenvalues at almost all unramified "usable" places (`UsPl d`) contain the normalized Satake parameters
  of $U$ (`ESAt`, `algSat a q B`), and it has at some $\ell$-adic place a set of $a$ lacunary Hodge-Tate weights
  (`HTRichEx`). A record of properties of a big Galois representation.
- **`Inside r ρ`** (:25): $r$ is a subrepresentation of $\rho$ (an injective intertwiner of rank $a$).
- **`IsDivRep ι d U r`** (:83): $r:G_E\to\mathrm{GL}_a$ is continuous, semisimple, unramified at almost all usable
  places, and on a dense open set of Frobenius elements $\det(X-r(\mathrm{Frob}^{-1}))=\prod_{b}(X-b)$ over the Satake
  parameters $b$ of $U$. This is the Galois representation attached to $U$, of the right dimension $a$.
- **`PhiKilled ι ρ w a B`** (:57): at $\ell$-adic $w$, $\rho$ is crystalline and the characteristic polynomial of its
  crystalline Frobenius divides a power of the Satake polynomial. **"Divisibility" in the folder name means this
  divisibility of polynomials.**
- **`DivAll`** (:107): from one $\rho$ with `VBase`, produce $r$ with `IsDivRep` whose Frobenius eigenvalues,
  crystallinity and crystalline Frobenius are those predicted by $U$.
- **`SeedWU4`**, **`CongUW4`**, **`LimWU4`** (`Development/AbelianVarietyTheory/Definitions/GaloisGeometry/LimWU4OfLimWU3.lean:15, 37, 57`):
  `SeedWU4`: for $U'$ of the good type (`Ty = TyEll`, lacunary weights `WtLac`, generic at chosen places) there is the
  $a$-dimensional $r$ with the right Frobenius polynomials, crystallinity and crystalline Frobenius. `CongUW4`: for
  any $U$, a level and nonzero constants such that the Hecke eigenvalue system of $U$ (with weighted powers of Satake
  parameters at $\ell$-adic places) is an $\ell$-adic limit of polynomial expressions in eigenvalue systems of forms
  $U'$ of the good type and the same weight away from $w_0,v'$ (`PolyApprox`), with values in a finite extension of
  $\mathbb Q_\ell$. `LimWU4`: the conclusion of `SeedWU4` for every $U$. `SeedFinOdd`, `CongFinOdd`, `LimFinOdd`
  (lines 103 to 107) instantiate them to odd rank.
- **`TyEll E l a w₀ U`** (`Development/AbelianVarietyTheory/Definitions/Divisors/GenOf.lean:14`): there are an open
  compact torsion-free $J\subset\mathrm{GL}_a(E_{w_0})$, a surjection $\theta:J\to\mathbb Z/\ell^m$ and a nontrivial
  character $\chi$ of $\mathbb Z/\ell^m$ such that every smooth irreducible representation containing the
  $(J,\chi\circ\theta)$-isotypic vector is supercuspidal, and $U$ contains such a vector at $w_0$. A type forcing a
  supercuspidal local component (in the style of Harris and Taylor), so that base change to $\mathrm{GL}_a$ stays
  cuspidal.

### 2.5 Geometry

- **`HTower k`** (structure, `Development/AbelianVarietyTheory/Definitions/Divisors/IdTower.lean:9`): a scheme $Z$ over
  $k$ and, for each $g$ in an index set $\Gamma$, a correspondence $Y_g \rightrightarrows Z$ (two maps $s_g,t_g$
  over $k$). A variety with Hecke correspondences. `θ : H.Γ → Qbar l` assigns eigenvalues to the correspondences;
  `IsPiece H θ ρ` says $\rho$ is (a graded piece of) the subrepresentation where the correspondences act by $\theta$.
- **`HolomorphicLefschetzFormula`** (`.../LefschetzSigmaSums/HodgeTraceFromLefschetzAndGroupSide.lean:102`): for a
  smooth projective $Z/\mathbb C$ of dimension $d$ and a finite étale correspondence $c_1,c_2:Y\to Z$ with isolated
  nondegenerate fixed points $y$ and tangent maps $A_y$, $\sum_b (-1)^b\operatorname{tr}(c\,|\,H^{a,b}) =
  \sum_y [\text{coefficient of } X^a \text{ in } \det(1+XA_y)]/\det(1-A_y)$. The Atiyah-Bott formula. It is proved
  in the tree (`GlobalTheory.T.lefschetz_fixedPoint_finite_etale_correspondence`).

## 3. The chain

Each step: claim; inputs; mechanism; file. "Classical" names a known theorem; "specific" means specific to this
formalization's route (a re-proof of classical results by its own route still counts as classical in content).

**G1. `Row0 recT` implies `Row0b recT`.** Forget the unrestricted tame clause. Mechanism: weakening of a record
(`Props.big`). `WeightsConjBis.lean:75, 84`. Trivial.

**G2. `CoreAll` implies `Row0 recT`** (`rest`, `Development.lean:24`). Inputs: `CoreAll` (Galois representations
with the properties at spherical and Iwahori levels, for all polarized $\pi$, `.all`), local-global compatibility at
places with Iwahori-fixed vectors (`localGlobalCompatAtIwahoriFixed_of_unlinked`), and spherical compatibility. The
assembly `galoisLocalGlobal_of_localGlobalCompatibility` (`InertCharpoly/GaloisLocalGlobalOfLocalGlobalCompatibility.lean:192`).
Classical in content (Caraiani's local-global compatibility); not followed further.

**G3. `Core` implies `CoreAll`** (`coreAll_of_core`, `CrystallineInputs/CoreAllOfRowStarCore.lean:4`), from the
conjugate self-dual case `.csd` to all polarized pairs by twisting. Classical. Not followed further.

**G4. `TLiftK`, `ClosedPhi`, `DescOffT`, `LimFinOdd` imply `Core`** (`toCoreK`, `CrystallineDescent/ToCoreK.lean:7`;
`toCore`, `LimOddOfLimFinOdd.lean:61`). The one use of `TLiftK` is `twoUpOK_of_k` (`ThetaParseval/TwoUpOKOfSteps.lean:13, 33`),
which proves `TwoUpOK`: for even $n$ and an automorphic $U$ on $\mathrm U_n$, with $t = 2(d_0+n)+1$ (odd), there are
two lifts $U_1,U_2$ to $\mathrm U_{n+t}$, built with two families of Hecke characters $\psi_1,\psi_2$ with no
character in common, such that (`IsUp`, `SplitLineSubtraction/RowDefOfOdd.lean:85`) at split places
$$\text{Satake}(U_i) = \kappa^{-1}\cdot\text{Satake}(U) \;\cup\; \{\psi_{i,1}(w),\dots,\psi_{i,t}(w)\},$$
and the Hodge weights move accordingly. Mechanism: apply `TLiftK` with $d=n+t$; read the split-place Satake
parameters from `LocPair` (local theta for $\mathrm{GL}_n\times\mathrm{GL}_d$ adds characters). Then the Galois
representation of each $U_i$ (odd rank, available from `LimFinOdd`) contains $r_U\otimes\kappa^{-1}$ plus $t$
characters, and since the two character sets are disjoint the common part is $r_U$ ("split line subtraction").
This is the classical device for even rank (Chenevier and Harris add a character to pass from $n$ to $n+1$); doing it
by theta lifts between definite unitary groups is specific to this proof. It is also exactly the note's step 8 shape
$\pi\mapsto\pi\boxplus\mu_j[t]$, used here for a different purpose (section 4).

**G5. `SeedFinOdd` and `CongFinOdd` imply `LimFinOdd`** (`limFinOdd_of := limWU4_of _ _ _ _ h h'`,
`TraceLimits/LimFinOddOf.lean:197`). Mechanism: the eigenvalue system of $U$ is an $\ell$-adic limit of systems of
good-type $U'$, each of which has an $a$-dimensional Galois representation; traces (pseudocharacters) pass to the limit
(the folder name `TraceLimits` and `JointApprox` in `LimWU4`). Classical in content (Chenevier and Harris,
"Construction of automorphic Galois representations II", and Taylor's earlier limit arguments).

**G6. `GeoOne` and seven lemmas imply `SeedFinOdd`** (`seedFinOdd_of`, `ZetaCharacterDivisibility/SeedFinOddOf.lean:44`;
instantiated in `MainFin.lean` as `seedFinOdd_of_geoOne`). Inputs: `DivAll` (proved, `divAll_holds`,
`DivisionOneGeometricRepresentation.lean:54`), `CplMem`, `SameOr`, `SatConj`, `TyConj`, `LacConj`, `GapLac`,
`DGenMul`. Mechanism: given $U$ of good type, move the auxiliary $\ell$-adic places $w_0,v'$ to their complex
conjugates when needed (`move`, using that $\ell$ splits in $\mathbb Q(\sqrt{-d})$), apply `GeoOne` to get big
geometric $\rho$'s, then `DivAll` to cut out $r$ of dimension $a$. `DivAll` itself: a determinant character exists
(`DetEx`), its divisibility (`DivDet`), the division lemma `DivOne` (an $a$-dimensional sub with the right
characteristic polynomials on a dense set), uniqueness (`DivUniq`), and the crystalline Frobenius seed `PhiSeed`.
Specific route; classical in content (the standard construction cuts $r_\pi$ out of cohomology).

**G7. `WtLacEx` implies `CongFinOdd`** (`congFinOdd_of_ex`, `CongruenceOddLevel/CongFinOddOfLvLac.lean`). Inputs:
`EllSt` (existence of the type `TyEll`, `exists_ellType`), a step `StepSt`, finiteness `finU_holds`. Mechanism:
congruences mod $\ell^m$ between automorphic forms on a definite unitary group (forms are functions on a finite set,
so changing the type at $w_0$ or the weight changes the space by a lattice-level twist that is trivial mod $\ell^m$).
Classical in content.

**G8. `GeoOne` from `Steps`, `KSAll`, `PlanEx`** (`geoOne_of_parts`, `GeoOneOfParts.lean`; `geoOne_of`,
`MapInvMul.lean:89`). `Steps` is a record of 17 lemmas (`RepEx`: a semisimple piece exists for every `Nice`
tower; `ESStep`: Eichler-Shimura type congruence relation gives Frobenius eigenvalues; `CrysStep`,
`JumpStep`, `PhiStep`: crystallinity, Hodge-Tate weights, crystalline Frobenius; twisting lemmas). `KSAll` uses the
holomorphic Lefschetz formula. Classical in content; specific packaging. Not unfolded further.

**G9. `TLiftK` is proved** (`tLift_of_k`, `ThetaKernels/GalTPDefs.lean:141`, instance of `tLift_of`,
`SchurStep.lean:270`). From `Tools_k` (Siegel-Weil, doubling, compactness, Weil representation models, Lie algebra
computations at infinity; `TPGHolds.lean:39`) and `HgtEx` (a height function on the doubled group). Mechanism, from
the proof of `tLift_of`:
1. choose $t_0$ with the height integrable to power $t$ for $t\ge t_0$ (`HgtFst`), set $d_0=\max(N,2n)$, $N>2t_0$;
2. `RealPair`: a polynomial Gaussian $f_0$ in the Fock model and $\varphi\in U$ of matching $K_\infty$-type, with the
   target weight $\lambda'$ from `IsLiftWt`;
3. `NonVan`: a finite-adelic Schwartz function $\varphi_f$ with $\theta(f_0\otimes\varphi_f,\varphi)\neq0$, from
   the Rallis inner product (`Rallis`: if the lift vanishes then a doubling integral vanishes), a decomposition of the
   group, bump functions at finitely many places, and a tail estimate (`Tail`) that makes the integral nonzero
   (`AbsNe`); this is where $t_0<d/2$ (stable range) is used;
4. `LiftAut`: the theta integral is automorphic and equivariant;
5. `ProjEx`: project the nonzero automorphic form onto one irreducible constituent $U'$;
6. `ReadLift`: read off the weight at infinity and the local theta correspondence at split places.
Classical in content (nonvanishing of theta lifts in the stable range via the Rallis inner product formula; Rallis,
Kudla and Rallis, Harris, Kudla and Sweet for the splitting characters); specific in packaging.

**D1. `ThmP`: an upper bound on the $\ell$-adic valuation of a jet of a determinant power** (stated 3.10, proved by
`WindowValuationBound.main`, `SumEqOfIsHomogeneous.lean:917`). Mechanism, from the proof: `BinomialValue.main`
(`:796`, an exact expansion of $\Lambda(y)$ as a binomial-type sum, using `expBinomial` and the Cayley-Capelli
identity), a Newton-polygon step (`newtonBound_pos_and_newtonStep`) that finds, in every window of length
$S_0(\ell,i,n_0)$, a $y$ where the valuation is not larger than the bound, Legendre's formula for $v_\ell(N!)$ and a
Capelli bound (`capelli_bound`). Specific.

**D2. From `ThmP` to the depth conditions of the theta-integral assembly** (reached from `everyCharacter`; chain in
6.2): `biWindow_of` → `content_and_window` → `window_letterDet` (`OddLevelBlockBoundAttained.lean:89`) →
`oddBlock_supply` → `oddLevelBlock_bound_attained` → `goodPlaceDepthBound_proof` → … → `leafDepth_all_record`
(`DivisorProofs/LeafDepthAllRecord.lean:17`) → `geoSt_of_pageSt_alt` (`ThirdPlaceSeries/GeoStOfPageSt.lean:21`) →
`ontoX_of_hypotheses_alt_alt` → `nonempty_hyps_definite_side_of_closed_bound` →
`every_character_of_theta_integrals_local_matching`. The output is `LeafDepthGood`
(`Formalism/LocalToGlobal/IndefiniteForms/IndefiniteTree/ExampleSatisfiesConditionsAtFive.lean:305`): weighted sums
$\sum_{p\in Q} \mathrm{th}_p\log p\le C/k$ and $T\sum_{p\in Q}\mathrm{ad}_p\log p\le C\,m\,b$ over every finite set
of primes, and exponent bounds $e_0(w,j)\le F_0(w,j)+a_E(j,w)+1$ at small tame places $w$ for each lift index $j$,
$e_0=0$ at large places. Specific.

**D3. The degree side: the product formula** (reached from `everyCharacter`). The operative inequality is
`Formalism.ValuationGridEstimates.AbsValuationSumBound` (`Formalism/TowerValuationBounds/HermitianSumValuationBound.lean:14`),
proved as `height_bound_alt` (`TowerValuationProofs/SumAdditiveCharacterEqZero.lean:37`) and applied by
`Formalism.AtG.norm_height_bound` (`Formalism/LocalToGlobal/ExponentGrids/ExponentGridsProofs/FrameHeightOfDualSlope.lean:88`):
for a nonzero $x$ in a totally complex number field $K$, the product formula
$\sum_w \lambda_w v_w(x) = \frac{1}{\#\{\text{infinite places}\}}\sum_v \log\|x\|_v$ (`prod_formula'`) gives
$$\sum_w \lambda_w\,|v_w(x)| \;\le\; \frac{1}{\#\{v\}}\sum_v \log^+\|x\|_v + 6B_\delta$$
whenever $v_w(x)\ge -3\delta_w$ and $\sum_w\lambda_w\delta_w\le B_\delta$. Mechanism: $|t| = t+2\max(0,-t)$ and the
product formula. Classical (the product formula; Liouville-type inequality). Chain:
`every_character_of_theta_integrals_local_matching` → `nonempty_hyps_definite_side_of_closed_bound` →
`GlobalTheory.BigTop.Fun.Close.fourier_coefficient_fit_of_join_alt` → `fittedFunction_at_zero_close_alt` →
`fun0Fit_of_leaves_alt` → `Formalism.L2.Indef.Tree.functional_lower_bound_of_conditions`
(`Formalism/LocalToGlobal/IndefiniteForms/IndefiniteTree/FunctionalLowerBoundOfConditionsNumeric.lean:940`, conclusion
`S.FUN N`, a lower bound on a functional, reader 2's region) → `norm_height_bound` → `height_bound_alt`.

**D4. Not on the spine: the divisor inequality** (`Formalism.DivisorInequality.DivIneqObjU`,
`Formalism/DivisorInequality/DivIneqTopAnchorU.lean:19`). Its hypotheses bound local lattice indices
`idx y (M j) (matLat (θ j (μ y)) (Tl j (μ y)))` by $\mathrm{ram}_y\cdot((e_0(y,j)+v_{U_0}(y))D + \dots)$ and its
conclusion compares an Arakelov slope (`Formalism.HN.muDef`, the Harder-Narasimhan slope of a Hermitian lattice),
heights of $m=|J|$ lattices $M_j$, and the index sums: a slope inequality of the Bost type. But the reachability
search did **not** reach `DivIneqObjU`, `DivisorIneqSharp` (:583) or `TheoremM` from `everyCharacter`. They are
proved or stated parts of the tree that the final proof does not use (up to the resolver's limits). The constants
statements `DivisorIneqTwo`/`Large`/`FailsAtTwo` (:594 to :606) belong with them.

## 4. Against the note

**Step 8 (iterated theta lifts, $\pi\mapsto\pi\boxplus\mu_j[t]$).** `TLiftK` is one lift $\mathrm U_n\to\mathrm U_d$
between totally definite unitary groups, with split-place components related by local theta for
$(\mathrm{GL}_n,\mathrm{GL}_d)$; `IsUp.sat` writes the Satake parameters of the lift as those of $\pi$ (twisted by
$\kappa^{-1}$) plus $t$ Hecke character values, which is $\pi\boxplus\mu_1\boxplus\dots\boxplus\mu_t$. In this region
the lift is used **once**, not iterated, and for the Galois side (parity). The $m$-fold chain of the note is in reader
2's region (`chainOp`, the index set `J` with $|J| = m$ in `DivIneqObjU`, `D.R.m` in `leafDepth_all_record`).

**Step 2 ($D^p\equiv0$ on a CM curve for $p$ inert; $D^a\theta(0)/\Omega^a$ divisible by
$p^{a/p+a/p^3+\dots-O(\log a)}$).** Partial match by content, not by name. The exponent series appears exactly:
`Formalism.IncomingBounds.gam l = l/(l^2-1)` and `Constants` asserts $\sum_{k\ge0}\ell^{-(2k+1)}=\gamma_\ell$ and
$\rho_\ell+\gamma_\ell = 1/(\ell-1)$ (`IncomingBound.lean:8-45`). The analog of "$D^p\equiv0$" is the shift
$\zeta_P = -\ell^{-e(\ell,i)}X_L^{\ell^i}$ with $e(\ell,i) = 1+\ell\sum_{t<(i-1)/2}\ell^{2t}$ (`expE`, `zetaP`,
`DefsThmP.lean`): only $\ell^i$-th powers of the left variables enter, as in characteristic $p$ where the derivation
kills $p$-th powers. The analog of $D^a$ is the jet at $0$ of $\det(X_L)^{\ell^i y}\det(X_R)^y$, i.e. the
differential operator of this polynomial applied to $\exp(h)$; the Cayley identity
$\det(\partial)\det^{s+1}=(s+1)\cdots(s+n_0)\det^s$ (`CayleyId`) is the computation of these derivatives. In
`Formalism/BehrendSets/StatementE.lean` the series `lserE p` $=\sum_i t^{p^{2i}}/p^i$ (the logarithm of a height-two
formal group, as for a supersingular CM elliptic curve at an inert prime) and `LevelThree` (an exact $p$-adic valuation
$-(p+1)$ of one coefficient of its inverse) are the CM-curve form; I found no proof or use of `LevelThree`. The code
never names the period $\Omega$ or the derivation $D$.

**Step 10 (sufficient lower bound on divisibility of the $m$-fold lift).** Partial. `ThmP` is an **upper** bound
(there is $y$ in each window with $v_\ell(\Lambda(y))\le n_0y((\ell^i+1)\gamma_\ell-1)+n(\log_\ell n+1)$), i.e. the
jet is not divisible by more than the predicted power: the analog of Stepanov's "the auxiliary function vanishes to
order exactly $m$, not more". A **lower** bound of the right shape is
`GlobalTheory.T.determinantPairing_quotient_valuation_lower_bound`
(`Proofs/UnramifiedDepth/DeterminantPairingQuotientValuationLowerBoundStatement.lean`): if all coefficients of $Q$
have valuation at least $s/8-n_0^2(\log_\ell(n_0s)+1)$ then the ratio of the Cayley pairings
$\langle\det^{\ell^i s},Q\rangle/\langle\det^{\ell^i s},\det^{\ell^i s}\rangle$ has valuation at least
$s/8-n_0^2(3\log_\ell n_0+2\log_\ell s+i+3)$. How the per-place, per-lift exponents $e_0(w,j)$ of `LeafDepthGood`
are assembled from these over the $m$ lifts was not followed.

**Step 13 (Bost slope inequality).** Not by name. By content, `DivIneqObjU` is a slope inequality: it compares
`muDef` (an Arakelov slope) of lattices with sums over places of $\log$-weighted local indices of the $m$ lifted
lattices $M_j$ inside $\theta_j(T_j)$, plus heights. This is my reading of a statement with roughly 150 hypotheses.
The reachability search did not reach it from `everyCharacter`, so in the final proof the comparison of divisibility
with size is made by the product-formula inequality D3, not by this slope inequality. The note's step 13 dates from
10/6/26, early in the timeline; the slope inequality may be an earlier route that the final proof bypasses. That last
sentence is my conjecture. Lattice slopes do enter the final proof elsewhere: `Formalism.F.slope`
($\deg L/\operatorname{rk}L$, `Formalism/LatticeSlopes/Statement.lean:25`) is reached through the covolume bound
`topCovolSlim2_use_alt_alt` of reader 2 (section 7), while Harder-Narasimhan (`hnCor`) is not reached.

**Step 14 (cost of each lift, 2/3 a priori, need for "division").** No convincing match. Two remarks, both labelled as
guesses. (a) The flow linear program `Fnum l d D = γ_l·ΣD − maxFlow` on $\mathbb Z/d$ with odd levels
(`IncomingBound.lean`) satisfies $\rho_\ell\sum D\le\mathrm{Fnum}\le\gamma_\ell\sum D$ (`LemmaFb`, `LemmaFc`); relative
to the full Legendre budget $1/(\ell-1)$ these are the fractions $1/(\ell+1)$ and $\ell/(\ell+1)$, and
$\ell/(\ell+1)=2/3$ at $\ell=2$. `ThmP` requires $\ell\ge5$, so this is a numerical coincidence until shown otherwise.
(b) "Division" in the code (`ZetaCharacterDivisibility`, `DivAll`, `DivOne`) is the division of Galois
representations in G6, not the note's "division"; I see no link.

**Step 15 (integral structure glued across Hecke characters, a gcd).** Not located in this region. `IsUp` uses two
disjoint character families and subtracts, which is a gcd-like operation on Galois representations, but it serves the
parity step, not averaging. Reader 2's `OnObj`/`IsRec` records (`TwoRuns J G`) may hold it.

**Step 17 ($H^1(\mathfrak o_E[1/\ell],\mathbb Q_\ell/\mathbb Z_\ell(-e))$, weak Vandiver).** **Located, over
$\mathbb Q$.** In `SmallClassNumbers/ClassNumberThree.lean:13-20`:

```lean
def len (Ω : Type) [Field Ω] [CharZero Ω] (l : ℕ) [Fact l.Prime] (c : Coef l) (e : ℕ) : ℕ∞ :=
  Module.length c.O (ShaU (twist₂ l (chiO ℚ Ω l c.O ^ (-(e : ℤ)))) (l * 2) ⊤)

def Bound : Prop :=
  ∃ C A : ℕ, ∀ (Ω : Type) [Field Ω] [CharZero Ω] [IsAlgClosure ℚ Ω] (e : ℕ), 1 ≤ e → Even e →
    ∀ (c : ∀ l : Nat.Primes, Coef l) (Ls : Finset Nat.Primes), (∀ l ∈ Ls, 5 ≤ (l : ℕ) ∧ ¬ (l : ℕ) - 1 ∣ 2 * e) →
      (∀ l ∈ Ls, len Ω l (c l) e ≠ ⊤) ∧
      ∑ l ∈ Ls, Real.log (l : ℕ) * (((len Ω l (c l) e).toNat : ℝ) / ((eO l (c l).O).toNat : ℝ)) ≤ C * ((e : ℝ) + 1) ^ A
```

`len_eq_zero_iff` (`LenEqZeroIff.lean:33`) identifies `len = 0` with `Vanish` (:19): every continuous cocycle
$z:G_{\mathbb Q}\to\mathcal O\otimes\mathbb Q_\ell/\mathbb Z_\ell$ for the action $\chi_{\mathrm{cyc}}^{-e}$ that is
a coboundary on the decomposition groups at the places above $2\ell$ and on every inertia group is a global
coboundary. So `len` is the $\mathcal O$-length of the group of classes in
$H^1(G_{\mathbb Q},\mathcal O\otimes\mathbb Q_\ell/\mathbb Z_\ell(-e))$ that are trivial at $2$ and $\ell$ and
unramified everywhere, and **`Bound`** says: there are constants $C,A$ such that for every even $e\ge1$ and every
finite set of primes $\ell\ge5$ with $(\ell-1)\nmid 2e$,
$$\sum_{\ell}\frac{\log\ell\cdot \operatorname{len}_\ell(e)}{e_{\mathcal O}}\le C(e+1)^A .$$
Consequence `large_of` (`LenEqZeroIff.lean:70`): for $\log\ell > C(e+1)^A$ the group vanishes. Vandiver's conjecture
predicts vanishing for every $\ell$ (these groups are pieces of class groups of $\mathbb Q(\zeta_\ell)^+$, through
$K$-theory of $\mathbb Z$ as the note's footnote says); `Bound` is a polynomial bound on the total size, a significant
weakening, matching the note's words. The proof (`corGK_of`, `CorGKOf.lean:10`; `onePoint`, `OnePoint.lean`) uses
Kato's Euler system (`katoTwoW`), rigidity statements, automorphy of 3-dimensional representations through unitary
groups $\mathrm U(3)$ (`UnitaryThreeGroups`, `Adm3U`), patching (`published_hypotheses_from_patching_alt`), and the
imaginary quadratic field of discriminant $-3$ with class number one (`classNumber_three`); `OnePoint` turns a nonzero
class into a 3-dimensional Galois representation (a Ribet-style argument). `Row0b` enters through `litN`, which feeds
`OpenImageCondition.mk galoisLocalGlobalStrong_recParameter` into the literature package.

**Important: `bound` is not used by `riemannHypothesis`.** `SmallClassNumbers/CorGKOf.lean` is imported only by
`Supplements/Kernels/MainTheoremsAll.lean`, and `ClassNumberThree`, `LenEqZeroIff`, `OnePoint` only by
`MainTheoremsCritical.lean`; both kernel files contain only imports, and the five theorems of `Main.lean` use
`rhOfAll`, `allChi`, `claimAll`, `critAll` from `MainTheorems.lean`, which imports none of these. The only citer of
`Bound` is `large_of`. So step 17 is formalized as a proved side theorem that the RH proof does not consume. Whether
the RH chain uses a different form of the same cohomological input was not established; the reachability search
confirms that `UpperTheory.V.SmallClassNumbers.Bound` is not reached from `everyCharacter`.

**`SandwichH1Classes`** (`Formalism/WachLatticeTwists/SandwichH1Classes/StatTBW.lean`): `StatTBW` is a local torsion
bound: for a crystalline lattice with Wach module data and cyclotomic twists, $\ell^{c_{TB}}\cdot y_K$ lies in the
finite part $H^1_f$, with $c_{TB}$ explicit in the twist and the Hodge-Tate data. It is a "kill classes by twisting,
up to a bounded power of $\ell$" statement, which fits the phrase "classes that we couldn't kill by twisting", but I
did not find its consumer and it is not reached from `everyCharacter`.

**Steps 11 and 19 (Iwasawa tower, pigeonhole on $\mathbb F_{q^n}/\mathbb F_q$, Behrend).** Located by content.
(i) The tower: `Formalism.TwoAdicCyclotomicDecomposition` (`Formalism/TameInertiaTowers/StatementField.lean`): the
layer $L_n=\mathbb Q(\zeta_{2^n},\sqrt{-q},\sqrt{-d})$ with $q\equiv3$, $d\equiv7\pmod 8$ primes; its Galois group
$(\mathbb Z/2^n)^\times\times\{\pm1\}^2$ (`LayerGalois`), complex conjugation $(-1,-1,-1)$ (`LayerConj`), $L_n$ is CM
with $[L_n^+:\mathbb Q]=2^n$ (`LayerReal`), $2$ has ramification index $2^{n-1}$, residue degree $2$ and two primes in
$L_n$, one in $L_n^+$ (`LayerEFGTwo`), Frobenius at odd $p\ne q,d$ is $(p, (\tfrac{-q}{p}), (\tfrac{-d}{p}))$
(`LayerFrob`). All proved (`tower_field_foundations`, `TowerFieldFoundations.lean`). This is a $2$-adic cyclotomic
(Iwasawa) tower of CM fields; the CM fields $E$ of `TLiftK` and `Row0b` are general, so the tower is a choice made
elsewhere. (ii) Pigeonhole on Frobenius orbits: `Formalism/BehrendSets/Statement.lean` works in
$(\mathbb Z/2^{s+2})^\times/\{\pm1\}$, cyclic of order $2^s$, with `frob s l` the image of $\ell$; `ShortOrdSq`
bounds $\sum\log\ell/\ell^2$ over primes whose Frobenius has small order. (iii) Behrend: `BehrendBound` and
`ThickSet` (the Behrend bound $N e^{-C\sqrt{\log N\log(K+1)}}$ for sets with no relation $\alpha x_1+\beta x_2+\gamma
x_3=0$, small coefficients) are **defined and never proved or cited** (search over all 5,133 importing files). The
proved and used form is `Formalism.FrobeniusOrbits.HostThickExists`
(`Formalism/FrobeniusOrbits/HostThickExists.lean:30`, proved at `FrobeniusOrbitsProofs/ThickExists.lean:181` with
$C=32$): for $n$ and $L\ge2$ there is $T\subset\mathbb N$ with $4Ls<n$ for $s\in T$, no relation
$j(s_2-s_1)=i(s_3-s_1)$ with $0<|i|,|j|\le L$, $i\ne j$ (`NoRel`), and $|T|\ge n e^{-C\sqrt{\log n\log L}}/L$. It
feeds `UpperTheory.BernoulliSumsFrobeniusOrbits.thickFrame2` (`AutomorphicArithmetic/ThickFrames/ThickFrame2Large.lean:29`,
with $\varepsilon<1/52$, the same range as `VWinAt`) and `GlobalTheory.T.exists_noRel_finset_card_ge`
(`Proofs/GlobalInterpolation/ExistsThinPrimeSetStatement.lean:12`): a Behrend-type set of positions $T$ inside a
frame whose order `φ.ord` is about $x^{h_E(\varepsilon)}$ (`Formalism.HC.Frame`: a cyclic group of order `ord`
projecting onto a group `HGrp e`). So the "precise choice using Behrend" is a choice of positions along Frobenius
orbits so that every short orbit window meets $T$ in at most two points (`WindowTwo`, `Spacing`). It is reached from
`everyCharacter` through `hostOfField`, inside `zero_free_all_of_green_v_win` (reader 1's endgame), where for each
primitive character a "host" field with a good set of positions is supplied (`supplyChi`); the
`GlobalInterpolation` copy `exists_noRel_finset_card_ge` is not reached. The tower `IsLayer` is reached only through an
example construction (section 7), and `TrivStab` is not reached.

**`TrivStab`** (`StatementE.lean:89`, proved `TotientLeOfIsPrimitiveRoot.lean:65`): a finite $g$-subgroup of
$\mathrm{GL}_k(E)$ is trivial when $[E:\mathbb Q]\,k<g-1$. Classical (an element of order $g$ has eigenvalues
primitive $g$-th roots of unity, which need degree $g-1$; Minkowski, Schur). Stated in the namespace of the Behrend
folder but logically unrelated to Behrend; other `TrivStab` notions in `IwasawaDecomposition` and `GroupLattices` are
different definitions with the same short name.

**Step 18 (covolumes, theta series' index, congruences between lifts and forms).** Congruences between forms:
`CongUW4`/`CongFinOdd` (G7), but these are congruences used to build Galois representations, between forms of the
same group of different type, not between lifts and forms. Covolumes and indices: the index terms `idx` of
`DivIneqObjU`, and `TowerValuationBounds` (`TowerProductFormula`: the constant $c_{0,0}$ of an iterated construction
equals a product of transition constants and values $L(e+k)$; `AbsValuationSumBound`: the product formula
$\sum_w\lambda_w v_w(x)=\frac1{[E:\mathbb Q]}\sum_\sigma\log|\sigma x|$ and its consequence
$\sum_w\lambda_w|v_w(x)|\le\frac1{[E:\mathbb Q]}\sum_\sigma\log^+|\sigma x|+2\sum_w\lambda_w\max(0,-v_w(x))$).

**Steps 9, 12, 16** are reader 2's. **Step 20**: `Row0b` is a hypothesis of `everyCharacter_of_row`.

**Not in the note.** The note does not mention that the proof re-derives the existence of Galois representations
for polarized cuspidal representations (G1 to G9) and Caraiani-type local-global compatibility, nor the
Lefschetz-formula route to Hodge-Tate weights, nor the theta-lift parity trick.

## 5. In plain terms

The proof needs, at one point, a dictionary between automorphic forms and Galois representations. An automorphic
representation $\pi$ of $\mathrm{GL}_a$ over a CM field has, at almost every prime $w$, $a$ numbers (Satake
parameters); a Galois representation has, at almost every prime, $a$ Frobenius eigenvalues. `Row0b` says: if $\pi$ is
regular algebraic and polarized, there is a Galois representation whose Frobenius eigenvalues are the Satake
parameters, with controlled behaviour at the remaining primes and at $\ell$. This is a known and deep theorem
(2008 to 2014); the formalization proves it again along the classical road. First, move $\pi$ to a definite unitary
group, where automorphic forms are functions on a finite set, so that congruences are easy. For odd rank and forms of
a special type, find the Galois representation in the cohomology of a variety with Hecke correspondences, and cut out
the $a$-dimensional piece whose characteristic polynomials equal the Satake polynomials. Reach all forms of odd rank
by $\ell$-adic congruences and a limit. For even rank, lift by theta to odd rank twice with different auxiliary
characters, and subtract the characters.

The smallest case of the parity trick: $n=2$, so $\pi$ has Satake parameters $\{\alpha,\beta\}$ at a split prime.
A theta lift to $\mathrm U_5$ with characters $\psi_1,\psi_2,\psi_3$ has parameters
$\{\alpha,\beta,\psi_1,\psi_2,\psi_3\}$ (up to a twist). Odd rank 5 has a Galois representation $R_1$ whose
eigenvalues are these five numbers. A second lift with characters $\psi_4,\psi_5,\psi_6$, disjoint from the first,
gives $R_2$. The part common to $R_1$ and $R_2$ is the 2-dimensional representation with eigenvalues $\{\alpha,\beta\}$.
Without disjointness the subtraction could not tell $\pi$'s part from a character.

What is this dictionary used for downstream? Not for integrality of the theta periods. `Row0b` enters twice
(section 6): in reader 4's automorphic window `VWin` through an "open image condition", and in reader 2's literature
package as the Galois-representation input to an automorphy and Galois-cohomology package (Poitou-Tate,
Greenberg-Wiles, Bloch-Kato, dual Selmer cocycles), whose purpose in reader 2's chain is a non-endoscopy statement
(`NonEndoscopicHypothesesAlt`). I read the names and structure fields of that package, not its proofs.

The integrality engine is a separate story. Over a finite field, Stepanov's auxiliary function vanishes to order $m$
at many points because $p$-th powers are invisible to derivatives. Here the role of "the auxiliary function's
derivatives at a point" is played by jets of powers of determinants, $\det(X)^{\ell^i y}\det(Y)^y$, evaluated against
an exponential generating function; the role of "$p$-th powers are invisible" is played by $\ell^i$-th powers of the
variables with an explicit negative power of $\ell$ in front. The result is that these jets are divisible by a power of
$\ell$ that grows like $n_0y((\ell^i+1)\gamma_\ell-1)$, with $\gamma_\ell=1/\ell+1/\ell^3+\dots$, the series of the
note's step 2, and not by much more (`ThmP`). The role of "a polynomial of degree $D$ cannot vanish to total order more
than $D$" is played, as far as I can read, by the product formula: a nonzero algebraic number cannot be divisible by
primes more than its archimedean size allows ($\sum_w\lambda_wv_w(x)$ is fixed by $\log|x|$; `norm_height_bound`).
A lattice form of the same idea, a slope inequality (`DivIneqObjU`), is in the tree but not used by the final
proof. Section 6.3 states the correspondence precisely.

Without each hypothesis: without regular algebraicity there are no Hodge-Tate weights to match (the Galois
representation may not exist); without polarization the descent to unitary groups fails; without the stable range
$d\ge d_0$ in `TLiftK` the Rallis inner product argument cannot show the lift is nonzero; without $\ell\ge5$ and $i$
odd in `ThmP` the constants change ($\gamma_\ell$ is the odd-level sum).

## 6. For the explainer

### 6.1 Interface upward

**To the endgame (reader 1)** this region hands exactly one proposition, `Row0b recT`
(`galoisLocalGlobalStrong_recParameter`), consumed in `MainConclusion.lean`:
`everyCharacter_of_row h := every_character_of_literature_of_vWin ⟨h, recTExists, h⟩ (vwin_of_row h)`. It is used
(a) by `vwin_of_row` (`DenseThresholdCases/VwinOfRow.lean:4`) as `OpenImageCondition.mk h` and as the `gal` argument
of `automorphic_window_of_inputs` (reader 4), and (b) as the fields `caraianiLocalGlobalDual` and
`galoisRepOfPolarizedPairLit` of `OpenLiteratureStatements`, where `galoisRepOfPolarizedPairLit` becomes `PairUAlt`
(`pair_u_of_literature`, `EveryCharacterOfLiteratureOfVWin.lean:285`, via `pairU_of_star_alt`,
`ThirdPlaceSeries/SOfStar.lean:41`) and both enter `GlobalAutomorphicGaloisHypotheses'` (`gal`, `car`;
`LocalRepresentationTheoryHypotheses.lean:33`), then `NonEndoscopicHypothesesAlt` (`literature_nonexistence`, :639),
then `exists_hyp_n_of_geometric_galois_compat` (`ThetaLiftHypothesesOfNonvanishing.lean:24`), whose conclusion
includes `EllipticHypothesis`, `PublishedInputsThirdLayerAlt`, `SerN` and a local Langlands hypothesis. A grep for
`Row0b|TLiftK|galoisLocalGlobalStrong_recParameter` over the whole tree returns 21 files; outside the Galois folder
the uses are `RankTwoPatching/FrobOfProps.lean` (`rowB`), `ThirdPlaceSeries/SOfStar.lean`, `WeakOfAtt.lean`
(`RowT`), `VwinOfRow.lean`, `CorGKOf.lean`, `RecT.lean` (`One.M.Row`), `MainConclusion.lean`.

**`TLiftK` is used only inside this region** (the same grep): `ToCoreK.lean`, `TwoUpOKOfSteps.lean`,
`Development.lean`, `GaloisRepresentationsOfThetaLift.lean`, `RowSrc.lean`, and its own files. The $m$-fold chain of
theta lifts of the note does not go through `TLiftK`.

**To the theta-integral assembly (reader 2)** this region hands, besides `Row0b` above, the valuation engine
`windowBound : ThmP` and its consequences `content_and_window`, `oddLevelBlock_bound_attained`, which arrive as the
depth conditions `LeafDepthGood` used by `leafDepth_all_record` and `geoSt_of_pageSt_alt` (chain in D2, 6.2).

### 6.2 Reachability chain for `ThmP` (from the search)

```
UpperTheory.FinalTheorems.everyCharacter (CharacterBoxes/MainConclusion.lean:10)
 everyCharacter_of_row → every_character_of_literature_of_vWin → every_character_of_theta_integrals_local_matching
 → nonempty_hyps_definite_side_of_closed_bound (SiegelEisensteinSecondTermHypotheses.lean:44)
 → GlobalTheory.Fc.S0.ontoX_and_lamLow_of_unitaryGroupHypotheses' → GlobalTheory.BigOn.ontoX_of_hypotheses_alt_alt
 → geoSt_of_pageSt_alt → leafDepth_all_record → RunDepth.leafDepth_all_run → T.depthTable_goodPrimes_of_chartForm
 → leafDepthGood_of_chartForm → T.depthLeaf_goodPrimes_of_point_data → GoodDepth.leafGood_run → T.depthTable_goodPrimeLeaf
 → GoodDepth.leafGood → T.goodPlaceDepthBound_proof → GoodDepth.nuGood → T.oddLevelBlock_bound_attained
 → oddBlock_supply → MinorShiftJet.window_letterDet → OddBlock.content_and_window → biContent_and_biWindow
 → OddBlock.windowBound : Formalism.L2.FormalSeriesBounds.ThmP
```

`Formalism.IncomingBounds.ThmP` (the copy in `Formalism/IncomingBounds`) was **not** reached; the proved and used
statement is the `FormalSeriesBounds` copy.

### 6.3 Question 2 answered: what plays "order $m$" and what plays "degree"

- **Vanishing to order $m$** is $\ell$-adic divisibility, per place and per lift: for each of the $m$ lifts $j\in J$
  and each tame place $w$ of the CM field, the exponent $e_0(w,j)$ bounding the $\ell$-adic index of the lattice $M_j$
  in the lifted lattice $\theta_j(T_j)$ (`idx` in `DivIneqObjU`, `e0` in `LeafDepthGood`), where $\ell$ is the residue
  characteristic of $w$. At the level of one jet, it is $v_\ell$ of
  $\Lambda(y) = \big[\det(\partial_L)^{\ell^iy}\det(\partial_R)^{y}\exp h\big](0)$ (`LamP`), which `ThmP` pins between
  bounds of size $n_0y((\ell^i+1)\gamma_\ell-1)$. The elements are coefficients of power series over a field with an
  $\ell$-adic valuation, not integers. Which integer or lattice element they become in the global argument (a
  Bessel period, a Fourier coefficient of a lift) is in reader 2's region.
- **The degree bound** is the archimedean side of the product formula. On the spine it is `norm_height_bound`
  (D3): for nonzero $x$ in a totally complex field, $\sum_w\lambda_w|v_w(x)|\le$ the mean of $\log^+|\sigma x|$ plus
  a bounded error, i.e. a nonzero algebraic number cannot be divisible by more prime powers than its archimedean
  size allows, the exact analog of "a nonzero polynomial of degree $D$ has at most $D$ zeros with multiplicity".
  `LeafDepthGood` states the matching budgets $\sum_{p}\mathrm{th}_p\log p\le C/k$ and
  $T\sum_p\mathrm{ad}_p\log p\le Cmb$. The Arakelov slope inequality `DivIneqObjU` has the same shape for lattices but
  is not reached from `everyCharacter`.

### 6.4 What a chapter must contain

1. The statement of `Row0b` in words, as a known theorem with a pointer (Chen, Harris, Harris, Taylor; Shin;
   Barnet-Lamb, Gee, Geraghty, Taylor; Caraiani), and the remark that the formalization re-proves it. A lemma proved
   before: statement, minimal intuition, pointer.
2. Theta lifts between definite unitary groups: what $\mathrm U_n$ with a definite form is, why its automorphic forms
   are functions on a finite set, the shape $\pi\mapsto\pi\boxplus\mu_1\boxplus\dots\boxplus\mu_t$ at split places,
   the weight rule `IsLiftWt`, and nonvanishing in the stable range by the Rallis inner product (pointer). This prepares
   step 8 for reader 2's chapter.
3. The parity trick with the $n=2$ example of section 5.
4. The divisibility engine, in depth (new to this proof): the toy case $\ell$-adic valuation of $\binom{\ell^iy}{\cdot}$
   type jets, $\gamma_\ell$ as $\sum_{k\text{ odd}}\ell^{-k}$, the comparison with $D^p\equiv0$ and Stepanov's
   $x^{jp}$, `ThmP` stated, and the product formula as the degree count.
5. Weak Vandiver (`Bound`), stated and marked as proved in the tree but not used by the RH proof.

Result cards: `Row0b` (pointer), `TLiftK` (pointer plus the weight rule), `ThmP` (new), `Bound` (new, side result),
`HostThickExists` (Behrend-type, pointer to Behrend 1946 for the shape).

### 6.5 Interactive figures

1. **Parity by subtraction.** Two rows of coloured dots: the Satake parameters of $\pi$ (gold) and auxiliary
   characters (two disjoint palettes). The reader drags characters between the two lifts; the "common part" panel
   shows what survives; if a character is shared, the common part grows and the figure flags failure.
2. **The odd-level series.** A slider for $\ell$ (5 to 31) and for the odd level $i$; bars for $\ell^{-1},\ell^{-3},\dots$
   accumulating to $\gamma_\ell$, beside the Legendre budget $1/(\ell-1)$ split into $\rho_\ell+\gamma_\ell$.
3. **Valuation windows.** A plot of $v_\ell(\Lambda(y))$ against $y$ (computed for small $n_0$, e.g. $n_0=1$ where
   the jet is a product of factorial ratios) with the line $n_0y((\ell^i+1)\gamma_\ell-1)$ and sliding windows of
   length $S_0$; each window lights up a point under the line, which is what `ThmP` asserts.
4. **Product formula as degree.** A number $x$ in a quadratic field: bars for $v_w(x)\log Nw$ at finite places and
   $\log|\sigma x|$ at infinite places, summing to zero; dragging $x$ to be divisible by more primes forces the
   archimedean bar up.

## 7. Not understood, open, and doubts

- **Reachability of the residue statements from `everyCharacter`** (pruned declaration search, five runs, 45,000 to
  418,000 declarations visited each). Reached: `Formalism.L2.FormalSeriesBounds.ThmP` and `windowBound` (6.2);
  `AbsValuationSumBound` (D3); `Formalism.FrobeniusOrbits.hostThickExists` and `thickFrame2` (via
  `every_character_of_green_v_win` → `zero_free_all_of_green_v_win` → `supplyChi` → `supplyOfAdm` → `hostOfField`
  (`CharacterBoxes/HostOfField.lean:8`) → `hostOfFieldOf` → `hof_thick`, reader 1's endgame); `Formalism.F.slope`
  (via `topCovolSlim2_use_alt_alt` → `topCovolG_alt_alt` → `covolX_of_truncation_badSet_lambda_lowBound` →
  `covolX_of_lift_bounds_and_coreLe` → `lcv_le` → `CutNum.slope_good_ge` → `AllWt.slope_sq_eq`, the covolume bound
  `CovolumeBoundOfX` of reader 2); `TwoAdicCyclotomicDecomposition.IsLayer`, but only through
  `Formalism.BasicNotions.Examples₂.layer0_ex` inside `siegel_weil_unitary_schrodinger_of_literature`, which looks like
  an existence witness, so the tower's use is thin. Not reached: `Formalism.IncomingBounds.ThmP`, `DivIneqObjU`,
  `DivisorIneqSharp`, `TheoremM`, `BehrendBound`, `BehrendFree`, `Formalism.BehrendSets.TrivStab`,
  `GlobalTheory.T.exists_noRel_finset_card_ge`, `UpperTheory.V.SmallClassNumbers.Bound`, `StatTBW`, `Formalism.HN.hnCor`.
  `Row0b`, `TLiftK`, `GeoOne` are on the spine by direct citation (1.2). "Not reached" depends on the resolver, which
  misses names produced by notation, instances and field projections on local variables.
- `CuspSub`, `CG.IsRegAlg`, `IsHecke` (body), `IsCrysAt`, `IsPstAt`, `IsJumpsAt`, `wdAt`, `Sqf` in full: read by
  name and signature only.
- `KSAll`, `PlanEx`, `Steps`: the variety $Z$ of `GeoOne` and the meaning of "weight one" were not identified.
- `CoreAll`, `Ex .all`, `SphericalLevelCondition`, `ClosedPhi`, `DescOffT`, `inp_holds`: not unfolded.
- `limWU4_of`: the mechanism (pseudocharacters) is inferred from names and statement shape.
- `TheoremM` (`Formalism/MahlerMeasure/StatementTM.lean:76`; proved as `Formalism.CountingSumsFrames.Top.theoremM`,
  `Formalism/PolynomialDimension/FinalM.lean:18`): an averaged count, over a box of parameters, of "bad" Smith
  invariants (elementary divisors of $p$-adic valuation above $E+C_0\kappa$) of Gram matrices of graded polynomial
  spaces, bounded by an explicit fraction of the dimension. A statement that few elementary divisors are highly
  divisible on average; consumer `lattice_theorem_of_discharge` (`ThetaLogCoordinates/.../LatticeTheoremOfDischarge.lean:15`).
  Its place in the note's steps was not established, and it is not reached from `everyCharacter`.
- `DivIneqObjU`: its roughly 150 hypotheses were read for shape only; not reached from `everyCharacter`.
- `functional_lower_bound_of_conditions` (940 lines): only its statement and its citation of `norm_height_bound`.
- `GridValuationBoundIndexed`, `TowerValuationBoundIndexed` (`Formalism/TowerValuationBounds/TowerValuationBoundIndexed.lean`):
  read, not placed.
- `StatTBW` consumer not found.
- The note's steps 14 and 15 were not located.

Three biggest doubts. (1) Which nonzero algebraic number $x$ the product-formula step `norm_height_bound` is
applied to inside `functional_lower_bound_of_conditions` (a period, a Fourier coefficient, a determinant); I traced the
chain but did not read that 940-line proof, so the analogy "product formula = degree bound" is placed but its
object is not named. (2) Whether `ThmP`'s upper bound, rather than the lower bound
`determinantPairing_quotient_valuation_lower_bound`, is the "sufficient lower bound on divisibility" of step 10; the
two are both present and I did not trace which feeds `e_0`. (3) Whether the RH chain uses the weak Vandiver input in
another form; `bound` itself is not consumed.
