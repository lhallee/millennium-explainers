# Lean reader 2: the theta-integral assembly and the unitary-group inputs

Read 2026-11-21 from `sources/riemann/lean/lean/src/` with the index in `.cache/lean-index/`. Nothing in `sources/` was
built or run. Paths below are relative to that `src/` folder. Two labels are used throughout:

- **Verified**: I opened the definition and the translation follows its text.
- **Reading**: my interpretation of what a verified statement means in the literature, or of an unopened definition
  from its use. Readings are not quotations and should be checked before they become claims on the page.

## 1. What this region proves

### 1.1 The top statement

`UpperTheory.Lit.every_character_of_theta_integrals_local_matching` (theorem),
`Development/AutomorphicArithmetic/ThetaCorrespondence/ThetaPairLifts/ThirdPlaceSeries/SiegelEisensteinSecondTermHypotheses.lean:69`

```lean
theorem every_character_of_theta_integrals_local_matching (P : _root_.GlobalTheory.Fc.S0.UnitaryGroupThirdPlaceHypotheses) (F : _root_.GlobalTheory.FunPr.ThetaLocalInputs) (hA : GlobalTheory.IndefiniteRowSideFullHecke.WeilTensorModels.ThetaIntegralsAgree)
    (hM : GlobalTheory.IndefiniteRowSideFullHecke.WeilTensorModels.LocalMatching) (hX : _root_.GlobalTheory.CovTop.CovolumeBoundOfX) (hL : _root_.UpperTheory.Zero.LLC.RecTExists) (hV : VWin) :
    UpperTheory.EveryCharacter :=
  _root_.UpperTheory.Top.every_character_of_green_v_win (GlobalTheory.GreenBridge.green_of_regular P.greenRegularCharacters) hV
    (_root_.UpperTheory.Lit.nonempty_hyps_definite_side_of_closed_bound P F hA hM hX hL fun cDep => _root_.UpperTheory.N.boundAtTwoThree_linked_of_recT P.nLink (_root_.GlobalTheory.Mem.Top.Bl.parametersOfDependence hL cDep))
```

In words (verified): given (i) a record `P` of 60 published theorems about unitary groups, automorphic forms and
Galois representations, (ii) a record `F` of 53 published local theta-correspondence inputs, (iii) a global
identity `hA` between theta integrals over two complementary hermitian spaces, (iv) a local matching statement `hM`
for those integrals, (v) a covolume bound `hX`, (vi) local Langlands for $\mathrm{GL}_n$ (`hL`), and (vii) the automorphic
window `hV` (reader 4), every Dirichlet $L$-function is nonzero on $\operatorname{Re}s>1/2$.

The proof is two lines. Green's theorem on cuspidal characters of $\mathrm{GL}_d(\mathbb F_g)$ is extracted from `P`; the
other six inputs build an inhabitant of the record type `HypsAlt ... DefiniteSideCondition`; and
`every_character_of_green_v_win` (reader 1's entry point) finishes.

### 1.2 The constructor

`UpperTheory.Lit.nonempty_hyps_definite_side_of_closed_bound` (theorem), same file, line 44

```lean
theorem nonempty_hyps_definite_side_of_closed_bound : _root_.GlobalTheory.Fc.S0.UnitaryGroupThirdPlaceHypotheses → _root_.GlobalTheory.FunPr.ThetaLocalInputs → GlobalTheory.IndefiniteRowSideFullHecke.WeilTensorModels.ThetaIntegralsAgree → GlobalTheory.IndefiniteRowSideFullHecke.WeilTensorModels.LocalMatching → _root_.GlobalTheory.CovTop.CovolumeBoundOfX → ∀ (hL : _root_.UpperTheory.Zero.LLC.RecTExists), (∀ cDep : ℝ, _root_.GlobalTheory.Fc.RL.LinkedAt (_root_.GlobalTheory.Mem.Top.Bl.parametersOfDependence hL cDep) (fun Q L => _root_.GlobalTheory.Fc.R1.SlotNormCondition Q L fun 𝒞 => Formalism.MainNotions.Closed 𝒞 fun Fm _ => _root_.GlobalTheory.NLink.BoundAtTwoThreeFamilyFonAlt Fm)) → Nonempty (_root_.GlobalTheory.Fc.HypsAlt S0.NL _root_.GlobalTheory.Fc.DefiniteSideCondition)
```

Its body (32 lines) is where the theta inputs `hA` and `hM` are spent. They enter five lemmas:
`test_vector_assembly_holds`, `fourier_coefficient_fit_of_join_alt`, `evaluation_grid_of_join`,
`twisted_local_factors_match`, and `twisted_square_theta_integrals_eq`. The last one converts the
`WeilTensorModels` form of the identity into the form used on the datum `D7` (section 2.6), via
`exists_placewise_seesaw_triple_over_hermitian`. The output is fed to
`hypotheses_nonempty_of_unramified_exponents_alt`, which assembles the record.

### 1.3 Where the record goes

`UpperTheory.Top.every_character_of_green_v_win` (theorem), `.../ThirdPlaceSeries/TopPlug.lean:16`

```lean
theorem UpperTheory.Top.every_character_of_green_v_win (hG : GlobalTheory.GLq.Green) (hV : UpperTheory.Top.VWin)
    (h : Nonempty (_root_.GlobalTheory.Fc.HypsAlt (fun 𝒞 => Closed 𝒞 fun Fm _ => LinkN Fm) _root_.GlobalTheory.Fc.DefiniteSideCondition)) : UpperTheory.EveryCharacter
```

Inside, `zero_free_all_of_green_v_win` (line 12) calls `zeroFreeAll_of_topG` with $\lambda = 3/2$, and the statement
`TopG` is supplied by `shape_closed_link_n_of_green hG` applied to the fields of the record (through
`forall_goal_of_shape_of_hyps`, `ShapeOf.lean:31`). That is the upward interface (section 3, step 12).

### 1.4 How the inputs are discharged

All seven inputs are supplied in `every_character_of_literature_of_vWin`
(`.../ThirdPlaceSeries/EveryCharacterOfLiteratureOfVWin.lean:810`) from the structure `OpenLiteratureStatements`:
`P := published_results_eigen O` (line 666), `F := published_results_first O` (line 727),
`⟨hA, hM⟩ := theta_integrals_agree_and_local_matching_of_literature O` (line 565), which is

```lean
  PositivityTheory.ThKR.theoremK_head2 (_root_.UpperTheory.LiteratureTheorems.eis_bl_of_literature O) (_root_.UpperTheory.LiteratureTheorems.siegel_weil_std_of_literature O)
```

`hX` is `SelfIntersectionVolumeEstimates.topCovolSlim2_use_alt_alt` applied to fifteen arithmetic-geometry inputs,
and `hL` is local Langlands. Many `..._of_literature` lemmas ignore `O` and cite a proof in the tree (for example
`logDerivOne` is `logDerOne_holds`); the three fields of `O` (each an instance of `Row0b`, reader 3) enter through
`pair_u_of_literature`, `carU_local_global_of_literature`, `local_langlands_recT_exists_of_literature` and the record
at line 618.

## 2. Definitions unfolded

### 2.1 The global theta identity `ThetaIntegralsAgree` and `LocalMatching`

Both live in `Development/AbelianVarietyTheory/BlockTheory/DivisorBase/WeilTensorModels.lean` (606 lines, read
in full). They are propositions quantified over all number fields.

**The setting** (verified).

- `Base F E` (line 140) is a record: an additive character $\psi$ of $\mathbb A_F$, an embedding $E\to\mathbb C$ over each
  infinite place $w$ of $F$, two integer families $m_\alpha(w), m_\beta(w)$, a finite set $P$ of finite places with an
  $F$-embedding $E\to F_v$ for $v\in P$ (so $v$ splits), and a distinguished split place $v_1$. `Base.IsGood`
  (line 350): $E/F$ is a CM extension with conjugation $\sigma$, $E/\mathbb Q$ is Galois, $\mathcal O_E/\mathcal O_F$ is unramified,
  $\psi$ is the standard character (trivial on $F$, equal to $e^{-2\pi i\operatorname{tr}x}$ at infinity), and every inert
  $v$ has $v\nmid 2$, $Nv>3$ and $\psi_v$ unramified.
- `Spc F E n` (line 160): a Gram matrix $J\in M_n(E)$, an $\mathcal O_E$-lattice $L\subset E^n$, a matrix $\theta_w$ at each
  infinite place, and a basis at each finite place. `Spc.IsHerm σ B X r s` (line 182): $J$ is hermitian, of
  signature $(r,s)$ at every infinite place, $L$ is a lattice equal to its own dual ($y\in L$ iff $\langle y,x\rangle$
  is integral for all $x\in L$), $\theta_w$ is a Cartan involution, and the bases at $P$ are split bases.
  `Spc.IsSkew` (line 192) is the same with $J$ skew-hermitian and the signature that of $iJ$.
- `Geo σ a a'` (line 314): $V$ of rank $a$, $V'$ of rank $a'$, $W$ of rank $a+a'$, and Weil-representation models
  $M$ for $(V,W)$ and $M'$ for $(V',W)$. `Geo.IsGood` (line 360): $a'<a$; $a+a'$ even;
  $a+a' < m_\alpha(w)-m_\beta(w)$ at every infinite place; $2(p+q)+1 < (a-a')/2$ and $2(p+q)+1<a'$; $V$ hermitian of
  signature $(a-p,p)$, $V'$ hermitian of signature $(q,a'-q)$, $W$ skew-hermitian of signature
  $(a+a'-p-q,\,p+q)$.
- `Chars F E` (line 332): two characters $\alpha,\beta$ of $\mathbb A_E^\times$ with values in the unit circle and two
  disjoint finite sets $S_0,Q$; $\nu=\alpha/\beta$, $T=S_0\cup Q$. `Chars.IsGood` (line 374): $\alpha,\beta$ are Hecke
  characters; $\alpha|_{\mathbb A_F^\times}=\eta^{a'}$ and $\beta|_{\mathbb A_F^\times}=\eta^{a}$ with $\eta$ the quadratic character of
  $E/F$ (`ResEtaPow`: value 1 on $F^\times N(\mathbb A_E^\times)$, else $(-1)^n$); their infinity types are $m_\alpha,m_\beta$
  (`HasExp`: on ideles that are 1 at all finite places, $\chi(z)=\prod_w(z_w/|z_w|)^{m(w)}$); $T\subseteq P$; $\nu$ is
  ramified above every place of $T$; $\alpha,\beta$ are unramified off $T$; $v_1\notin T$.
- `IsTriple B G X ω ω'` (line 388): all of the above, with $\omega$ a Weil representation of
  $U(V)(\mathbb A)\times U(W)(\mathbb A)$ for the splitting characters $(\beta,\beta/\alpha)$ and $\omega'$ one of
  $U(V')(\mathbb A)\times U(W)(\mathbb A)$ for $(\alpha,\alpha/\beta)$ (`IsUWeilPair`, not opened).

**The theta integral** (verified). With $\theta(\Phi)=\sum_{\xi\in F^{n\times d}}\Phi(\xi)$ (`thetaSum`), the code sets
`theta ω Φ g h = thetaSum (ω (g, h) Φ)` (line 286) and

$$
I_V(\Phi)(h)=\int_{\mathcal D}\theta\big(\omega(g,h)\Phi\big)\,d\mu(g)\qquad(\texttt{Model.I},\ \text{line 288}),
$$

an integral over a fundamental domain $\mathcal D$ for $U(V)(F)$ in $U(V)(\mathbb A)$. The integrand contains no
automorphic form on $U(V)$: $I_V(\Phi)$ is the global theta lift of the constant function $1$ from $U(V)$ to $U(W)$.

**Matching** (verified). `RealMaps` and `FinMaps` (lines 397 and 409) are linear maps from the two Weil
representations onto common target spaces $\Pi_\infty$ and $\Pi_v$. `IsMatched` (line 493) requires: at infinity
both maps are onto from the polynomial Fock spaces, kill the Lie algebra of $U(V)$ (resp. $U(V')$), are invariant
under its maximal compact, are compatible with the $U(W)$ action, and $\Pi_\infty$ is nontrivial and irreducible under
$U(W)$; at each finite $v$ both maps are onto, vanish on the augmentation space
$\mathrm{span}\{\omega(g,1)\varphi-\varphi : g\in U(V)(F_v)\}$ (`augAt`, line 307), are $U(W)(F_v)$-compatible, $\Pi_v$ is
irreducible, the spherical vectors have equal nonzero images off $T$, and at $v\in T$ a local zeta-integral identity
`IsZetaAt` holds. `Match Φ Φ'` (line 483) says that $\Phi,\Phi'$ are finite sums of pure tensors whose images in
$\Pi_\infty\otimes\bigotimes_{v\in T'}\Pi_v$ agree (up to a limiting procedure at infinity), with $\Phi'$ in a subspace
`So` of Schwartz functions whose local component at $v_1$ has a partial Fourier transform supported on matrices of
full rank (`SoLoc`, line 275).

Reading: since the maps kill the $U(V_v)$-augmentation, $\Pi_v$ is a quotient of the big theta lift of the trivial
representation of $U(V_v)$, so `LocalMatching` asserts that the theta lifts of the trivial representation from $V$
and from $V'$ to $U(W)$ share an irreducible quotient at every place, compatibly.

**`LocalMatching`** (line 581, verified):

```lean
def LocalMatching : Prop :=
  ∀ (F E : Type) [Field F] [NumberField F] [Field E] [NumberField E] [Algebra F E] (σ : E →ₐ[F] E) (B : Base F E) (a a' : ℕ)
    (G : Geo σ a a') (X : Chars F E) om om', IsTriple B G X om om' → ∃ R Rf, IsMatched B G X om om' R Rf
```

**`ThetaIntegralsAgree`** (line 585, verified) is a conjunction of three statements.

1. For every triple: (`Decay`, line 498) $I_V(\Phi)$ converges for every Schwartz $\Phi$; for $\Phi'\in$ `So` the theta
   function is rapidly decreasing in $g$ (for every $N$ it is at most $C\,\mathrm{ht}(h)^k/\mathrm{ht}(g)^N$), its
   integral converges and has moderate growth. For every matching $(R,R_f)$: (`OneConst`, line 503) some
   $\Phi'\in$ `So` has $I_{V'}(\Phi')\ne0$, and there is exactly one constant $c$, and it is nonzero, such that
   $I_V(\Phi)(h)=c\,I_{V'}(\Phi')(h)$ for all matched $(\Phi,\Phi')$ and all $h$ (`IsConst`, line 491); and (`Coinv`,
   line 507) at good places the local maps have kernel exactly the augmentation space and every
   $U(V'_v)$-invariant functional factors through them.
2. `StepBeta` (line 559): if $V'=V'_1\oplus H$ with $H$ a hyperbolic plane (`Plane.IsAdapted`, line 532: $x,y$ isotropic,
   $\langle x,y\rangle=1$, orthogonal complement $V'_1$, lattice split compatibly), then there is $C\ne0$ depending only
   on the geometry such that the constants $c$ (for $V'$) and $c_1$ (for $V'_1$) satisfy
   $c\cdot L^{S_0}\!\big(\nu,\tfrac{a-(b+2)}2+1\big)=u\,c_1$ with $u\,C\,\mathrm{stepFac}=1$.
3. `StepAlpha` (line 571): the same for $V=V_1\oplus H$ when $q=0$:
   $c=C\cdot\mathrm{stepFac}\cdot L^{S_0}\!\big(\nu,\tfrac{b+2-a'}2\big)\cdot c_1$.

Here $L^{S_0}(\nu,s)$ is `charL X.ν S₀ s` (defined through `LS`, which I did not open; reading: the Hecke $L$-function
of $\nu$ with the Euler factors at $S_0$ removed), and `stepFac` (line 552) is
$\nu(\mathfrak b)^{e_1}\nu(\mathfrak c)^{e_2}\prod_{v\in P\cap T}\nu_v(s)\,\varepsilon(\psi_v,\nu_v,z)$, a product of character
values on two fractional ideals and of local epsilon factors built from Gauss sums (`gauss`, `eps`, lines 125 and
131), with universal signs $e_1,e_2,s\in\{\pm1\}$.

Reading: the pair $(V,V')$ with $\dim V+\dim V'=\dim W$ is the "complementary spaces" configuration of the
regularized Siegel and Weil formula (Kudla and Rallis for orthogonal groups; Ichino, *On the regularized
Siegel-Weil formula*, J. reine angew. Math. 539 (2001) and later papers for unitary groups): both theta integrals
are values of the same Siegel Eisenstein series on $U(W)$ at symmetric points, related by the functional
equation. Clauses 2 and 3 then say that the constant changes by exactly one partial Hecke $L$-value of $\nu=\alpha/\beta$
(and explicit local factors) when one hyperbolic plane is added to either side of the tower. I did not read the
proof `theoremK_head2_of_mod`, so the mechanism is inferred from its two inputs (section 2.5).

### 2.2 The two records `P` and `F`

`UnitaryGroupThirdPlaceHypotheses` (structure, `.../ThirdPlaceSeries/BernsteinUnitaryProductIrreducible.lean:22`)
is a `Prop` record of 60 fields, and `ThetaLocalInputs`
(`.../LocalTypeDictionary/BernsteinUnitaryProductIrreducible.lean:6`) one of 53. Nearly every field is a named
published theorem `GlobalTheory.Published.*`. By theme (field names verified, contents mostly not opened):

- Weil representation and theta: `WeilRepresentationUnitaryPair`, `WeilRepresentationExists`, `StoneVonNeumann`,
  `MetaplecticRepresentation`, `RealMetaplecticRepresentation`, `KudlaSplittingSplitUnitary`, `HoweDualityReal`,
  `GLHoweDuality`, `ThetaRationalInvariance`.
- Siegel and Weil, Rallis, doubling: `WeilSiegelFormulaUnitary`, `SiegelWeilUnitaryConvergent` (twice),
  `SiegelWeilUnitarySchrodinger`, `SiegelEisensteinContinuation`, `RallisInnerProductConvergent`,
  `DoublingMethodLocalZetaIntegrals`, `UnramifiedDoublingGL`.
- Real groups: discrete series (`DiscreteSeriesExists`, `Classification`, `Cover`, `LowestKType`, `HermitianUnique`,
  `UpqExists`), `HarishChandraModules`, `CasselmanWallach`, `FormalDegreeCompactDual`, `SiegelSetUnitary`.
- $p$-adic groups and $\mathrm{GL}_n$: Bernstein and Zelevinsky finiteness and irreducibility, Jacquet and Shalika,
  depth-zero Jacquet injectivity and support, generic unitary dual, standard cosocle.
- Automorphic forms: cusp forms of rapid decay, bounded, trace class; Flath and Dixmier and Malliavin
  factorisation; strong approximation for $SU$.
- Galois side: `galoisRepOfPolarizedCuspidal : CuspUAlt`, `localGlobalAboveL : CarUAlt`, Clozel's cohomological
  and purity theorems, Bhatt and Scholze crystalline lattices, de Rham implies potentially semistable,
  Chebotarev, Artin reciprocity, ray class fields, local Tate duality and Euler characteristic.
- Three project-internal records: `litN` (`NonEndoscopicHypothesesAlt`), `toHypothesesX`
  (`GeometricGaloisRepCompatibility`), and `nLink` (`NLink.Hypotheses₂`, which yields the local bounds at the primes 2
  and 3 used in the last argument of the constructor).

Five fields matter most for this region and were unfolded.

- `WeilSiegelFormulaUnitary` (`.../TwistedTraceFormula/WeilSiegelFormulaUnitary.lean:56`): Weil's convergent
  Siegel-Weil formula. If $2\,\mathrm{rk}A<\mathrm{rk}B$ (and $B$ anisotropic or $\mathrm{rk}A+$ Witt index $<\mathrm{rk}B$), the
  Siegel Eisenstein sum over cosets of the Siegel parabolic of $U(A\oplus -A)$ of the Siegel-Weil section converges
  and equals the average over $[U(B)]$ of the theta kernel.
- `SiegelWeilUnitaryConvergent` (`.../SiegelWeil₂/SiegelWeilUnitaryConvergent.lean:18`): the same identity as an
  Eisenstein value `EisValueAt` at $s_0$ for $\mathrm{rk}A<\mathrm{rk}B\le2\,\mathrm{rk}A$.
- `RallisInnerProductConvergent` (`.../TwistedTraceFormula/LowerLiftsZeroOfWittIdxEqZero.lean:41`): for cusp forms
  $f_1,f_2$ in an irreducible cuspidal $U$ on $U(A)$ whose lifts to all smaller spaces vanish
  (`LowerLiftsZero`), $\mathrm{vol}^{-1}\langle\theta(f_1,\Phi_1),\theta(f_2,\Phi_2)\rangle$ equals the doubling zeta integral
  $Z(s_0,f_1,f_2,\Phi(\delta(\Phi_1,\Phi_2)))$. This is the Rallis inner product formula. In the tree it is proved
  (`rallis_of_dm`) from the doubling method, Siegel-Weil and theta convergence.
- `CuspUAlt` (`.../ThirdPlaceSeries/WeightsConj.lean:50`) and `CarUAlt` (line 55): for a CM field $E$, a regular
  algebraic polarized (resp. conjugate self-dual) cuspidal $\pi$ of $\mathrm{GL}_a(\mathbb A_E)$ there is an $\ell$-adic Galois
  representation with the expected Hodge-Tate data, and for `CarUAlt` local-global compatibility at places above
  $\ell$. They are built from `O.galoisRepOfPolarizedPairLit` and `O.caraianiLocalGlobalDual`, both of type
  `One.M.Row`, which is `Row0b IsRecT` (reader 3).

### 2.3 `Green`

`GlobalTheory.GLq.Green` (def), `Development/AbelianVarietyTheory/Definitions/NonGaloisDescent/LabelDatum.lean:108`

```lean
def Green : Prop
:=
  ∀ (g : ℕ) [Fact g.Prime] (L : LabelDatum g) (d : ℕ), 0 < d → ∃ τ : (ZMod g)[X] → Gn g d → ℂ,
    (∀ P, IsPrimeLab d P → IsCuspOf L P (τ P) ∧ τ P 1 = ∏ i ∈ Finset.Ico 1 d, ((g : ℂ) ^ i - 1)) ∧
    (∀ P P', IsPrimeLab d P → IsPrimeLab d P' → τ P = τ P' → P = P') ∧
    ∀ χ : Gn g d → ℂ, IsCusp χ → ∃ P, IsPrimeLab d P ∧ χ = τ P
```

Verified translation. `Gn g d` is $\mathrm{GL}_d(\mathbb F_g)$; `IsCusp χ` says $\chi$ is an irreducible character whose
parabolic restrictions vanish (cuspidal); `IsPrimeLab d P` says $P$ is monic irreducible of degree $d$ with $P(0)\ne0$.
The statement: the cuspidal irreducible characters of $\mathrm{GL}_d(\mathbb F_g)$ are in bijection with such $P$ (equivalently
with Frobenius orbits of regular characters of $\mathbb F_{g^d}^\times$), each has degree $\prod_{i=1}^{d-1}(g^i-1)$, and on an
element $y$ with irreducible characteristic polynomial and root $z$ its value is
$(-1)^{d-1}\sum_{i<d}\theta(z^{g^i})$. This is Green's theorem (J. A. Green, *The characters of the finite general
linear groups*, Trans. AMS 80 (1955)). `green_of_regular` (`.../InertiaEigenvalues/SumRangeEqRoots.lean:225`) turns
the published form `GreenRegularCharacters` into this labelled form by an explicit Galois-orbit argument. Green
is used in `closed_linkIRR_of_join_count` (an irreducibility link inside `shape_closed_link_n_of_green`). Reading:
the two auxiliary primes $g_0,g_1$ of the host (section 2.6) carry depth-zero types built from these characters.

### 2.4 `CovolumeBoundOfX`

`GlobalTheory.CovTop.CovolumeBoundOfX` (def), `.../ThirdPlaceSeries/LiftLambdaBound.lean:60`

```lean
def CovolumeBoundOfX : Prop := Closed FamHyp fun Fm CH =>
  ∃ C0 : ℝ, 0 ≤ C0 ∧ _root_.GlobalTheory.CovTop.EventuallyAtAllPoints Fm fun _ _ _ p => ∀ C, C0 ≤ C → (p.S false).L3 (p.N C CH)
```

Verified shape: along every family in the class `FamHyp`, for small $\varepsilon$ and large scale, an `L3` covolume
bound holds at all points. `L3` is the same predicate as the `covol` field of the definite-side records below. I
did not unfold `L3`; it is discharged by the Arakelov-geometry route of reader 5 (Moriwaki bigness, Hilbert and
Samuel).

### 2.5 The proof of `hA ∧ hM`

`PositivityTheory.ThKR.theoremK_head2` (`Development/WeilBound/ThetaLifts/Reductions/FiniteClosure/TheoremKOfMod.lean:26`)
proves `ThetaIntegralsAgree ∧ LocalMatching` from two statements, both proved in the tree.

- `GlobalTheory.ThK.Dbl.SiegelWeilStd` (`Development/WeilBound/ThetaLifts/LatticeBasics/HypothesesS.lean:11`): for $A$
  definite ($\min(r,s)=0$) of rank $m$ in a doubling pair with $Y$ of rank $n$, the Siegel Eisenstein series of the
  Siegel-Weil section is holomorphic at $s_0=(m-n)/2$ and its value there equals $\kappa$ times the average of the theta
  function over $[U(A)]$, with $\kappa=1$ if $n<m$ and $\kappa=2$ otherwise. This is the Siegel and Weil formula for a
  definite space, with the familiar factor 2 at the boundary.
- `GlobalTheory.ThK.Dbl.EisBL` (`.../LatticeBasics/HypothesesE.lean:46`): the Siegel Eisenstein series converges for
  $\operatorname{Re}s$ large and continues meromorphically, with a finite-order pole at every point after which pairing
  against any moderate-growth functional is holomorphic.

### 2.6 The datum `D7` and its unitary groups

The automorphic objects of the whole argument hang off one record, `Formalism.BasicNotions.D7`
(`Formalism/LocalRingCardinality/RhoDetPrimeEqMuTildeMulChiPow.lean:76`), with about 100 fields. The parts that
answer "which groups" (verified):

- `Ranks` (`Formalism/LocalRingCardinality/Params.lean:6`): natural numbers $k$ (even), $m$ (even, $\ge2$), $t$ (odd), and
  $\mathrm{ord}$, with $m+3\le k$, $k+m+4\le t$, $3m<t$, $m\le2\,\mathrm{ord}\le k$, $m^2\le k+m(t+1)$. Derived:
  $n=\mathrm{ord}$, $f=2n$, $r=k+m-1$, $N_j=k+j(t+1)$, `rankY j` $=r+jt$, $\mathrm{rk}X'=r+mt$, $n_V=r+t$, $r_S=m/2-1$,
  `sigW j` $=(k+j-1,\,m-j)$, `sigY0` $=(k+r_S,\,r_S+1)$.
- `CMData` (`DataSpaces.lean:14`): $F$ totally real, $[E:F]=2$, the star on $E$ is complex conjugation with fixed field
  $F$, and $E$ is a CM field unramified over $F$ at all finite primes (`IsCMUnram`, `StatementMass.lean:44`).
- `HSpace E` (`DataSpaces.lean:26`): a hermitian space over $E$ with a basis, signatures at each embedding, and a
  unimodular lattice $L_0$. `IsDefinite` (line 62): signature $(\mathrm{rk},0)$ or $(0,\mathrm{rk})$ at every embedding.
- `Spaces` (`DataSpaces.lean:77`): hermitian spaces $X_j$ with $X_j$ **totally definite of rank $N_j=k+j(t+1)$ for
  $0\le j\le m$**; $X'$ of rank $r+mt$ with $X_m=X'\oplus\langle z\rangle$, $z$ anisotropic; $Y_j\supseteq X_j$ of rank
  $r+jt$, with $Y_m\cong X'$ and $Y_0=X_0\oplus\langle z_m\rangle\oplus H^{r_S}$ of signature $(k+r_S,r_S+1)$ ($H$ a hyperbolic
  plane, $\langle z_m,z_m\rangle=-T$); $W_j$ ($1\le j\le m$) of rank $r$ and signature $(k+j-1,m-j)$, each isometric to $Y_0$
  at all finite adeles (so the $W_j$ are inner forms differing only at infinity); $V_j$ of rank $r+t$ with a standard
  orthonormal lattice.
- `HCParam` (`Params.lean:50`): Harish-Chandra data $u\in\mathbb Q^k$ (half-integers), $v\in\mathbb Q^{k-1}$ (integers), $b,e\in\mathbb Z^m$
  with $u_0>v_0>u_1>v_1>\dots>v_{k-2}>u_{k-1}$ (interlacing), $-b_0<u_{k-1}$, and gaps $e_j-b_j\ge(t+3)/2$,
  $b_{j+1}-e_j\ge(t+3)/2$. A family of these is indexed by `Tau`, a set of $f$ elements in bijection with a subgroup
  `R.Psi` of $\mathrm{Gal}(E/\mathbb Q)$.
- `Host R` (`DataHost.lean:39`): the CM field $E$ (Galois over $\mathbb Q$, with group identified with a fixed finite group),
  integers $q,d$ with $\sqrt{-q},\sqrt{-d}\in E$, a CM type, two auxiliary primes $g_0\ne g_1$, two more primes
  $p_{de},p'_{de}\equiv1\pmod{15}$, a set of level primes, and many coprimality and splitting conditions.

So the unitary groups are $U(X_j)$ for the totally definite $X_j$ (the "columns"), the indefinite $U(W_j)$ and $U(Y_0)$
(the "rows"), and the auxiliary $U(V_j)$, all over one CM field $E$ unramified over its totally real subfield $F$.

### 2.7 Automorphic forms on the definite groups, the kernel, and `chainOp`

**Forms on a definite group are functions on finitely many classes** (verified in three places).

1. `ColumnChain R ι hc` (`Formalism/LocalRingCardinality/DataKernels.lean:14`): for each level $i$ a finite type
   `cls i` of classes, a finite group `stab i c` per class, an index set `Y i`, and forms are functions
   `cls i → Y i → ℂ`, that is, vector-valued functions on a finite set. `DGam` is a common multiple of all
   stabilizer orders.
2. `Formalism.ThetaLiftIndependence` (`Formalism/ThetaLiftIndependence/Statement.lean`): automorphic forms
   `Formalism.UG.AMF` are functions on $G$ left-equivariant under $\Gamma$ and right-invariant under $K$; their lifts
   are sums over the finite double-coset set `ClassSet Γ K` weighted by $1/|\mathrm{stab}|$ (`thetaLiftAMF`, line 80).
   For hermitian lattices, `latLift h s f Θ` $=\sum_{L\in s}|\mathrm{Aut}L|^{-1}f(L)\Theta(L)$ over class representatives $s$
   of a genus, and `thetaLift` (line 148) takes $\Theta(L)=\theta_L(\tau)=\sum_{x\in L}e^{\pi i\tau\operatorname{tr}h(x,x)}$
   (`thetaL`, `StatementTheta.lean:23`). `ClassRepsDefinite` (line 175, proved as `classRepsDefinite`): for a
   positive-definite hermitian lattice, class representatives exist, each weight is $1/n$ with $n$ a positive
   integer, and a common denominator $D$ makes every $D\cdot\mathrm{wt}$ an integer.
3. `ClassNumberFormula₂` (`Formalism/SharpRestriction/GlobalSchurBounds/StandardLattice.lean:453`): in the datum,
   $|\texttt{cls }0|=\mathrm{mass}_I(k)\cdot\mathrm{idx}(g_0,g_1)\cdot(T^k-1)^f$. So `cls 0` is the class set of $U(X_0)$ at a level
   structure at $g_0,g_1$ and $T$.

**The kernel and the chain** (verified). `chainOp` (`Statement.lean:24`):

```lean
def chainOp {R : Type*} [CommSemiring R] {ι : ℕ → Type*} [∀ j, Fintype (ι j)]
    (w : ∀ j, ι j → R) (K : ∀ j, ι j → ι (j + 1) → R) : (m : ℕ) → (ι 0 → R) → (ι m → R)
  | 0, f => f
  | m + 1, f => kerOp (w m) (K m) (chainOp w K m f)
```

with `kerOp w K f j = ∑ i, w i * f i * K i j`. So $\mathrm{chainOp}_m f=T_{m-1}\circ\dots\circ T_0 f$, where
$(T_jf)(y)=\sum_x w_j(x)f(x)K_j(x,y)$: $m$ applications of a weighted kernel operator from functions on the finite set
$\iota_j$ to functions on $\iota_{j+1}$. The vector-valued version `chainOpM` is what the datum uses:
`ColumnChain.col φ = chainOpM C.wt C.Kmap R.m φ` (`DataKernels.lean:70`), with weights
$w_i(c)=1/|\mathrm{stab}_i(c)|$ and kernel

$$
K_i(L,L')=\rho_i(L)\,\rho'_i(L')\cdot\Big(\prod_\tau de_{i+1}(\cdot,\tau)^{-s^{\rm div}_i(\tau)}\Big)\circ \mathrm{unf}_i(L,L')\circ\Big(\prod_\tau de_i(\cdot,\tau)^{s^\sharp_i(\tau)}\Big)
$$

(`Kmap`, line 63), where $\rho,\rho'$ have modulus 1, the exponents are $s^\sharp_i=e_i-N_{i+1}/2$ and
$s^{\rm div}_i=e_i-N_i/2$ (they differ by $(t+1)/2$), and `unf i L L'` is a linear map between the value spaces. The
datum fixes $\rho_i(c)=\tilde\mu_{i+1}(\det c)^{-1}\chi_D(\det c)^{-N_{i+1}/2}$ and
$\rho'_i(c)=\tilde\mu_{i+1}(\det c)\,\chi_D(\det c)^{N_i/2}$ (`D7.rhoDet_eq_inv_muTilde_chiD_pow`), with characters
$\tilde\mu_j$ and $\chi_D$ of a group of determinant classes. `colTo_eq`
(`Development/AbelianVarietyTheory/Definitions/LatticeFrames/FiniteDimensionalMram.lean:52`) proves that iterating
the one-step lift $m$ times is `chainOpM`.

Reading: $\mathrm{unf}_i(L,L')$ is the theta kernel between a class $L$ of $X_i$ and a class $L'$ of $X_{i+1}$ (I found no
theorem that names it so; it is an abstract field of the record), and $\tilde\mu_{i+1}$ is the Hecke character
$\mu_{i+1}$ of the note's "$\pi\mapsto\pi\boxplus\mu_j[t]$". So `col φ` is the form on $U(X_m)$ obtained from a form $\varphi$ on
$U(X_0)$ by $m$ twisted theta lifts.

**The ramified subspace and the period map** (verified). `ColumnsAtT` (`DataKernels.lean:104`): a prime $T$, a set of
$f$ places with residue field $\mathbb F_T$, nontrivial additive characters, an action $\rho_T$ of each $\mathbb F_v^\times$ on forms
on $X_0$, and a finite-dimensional invariant subspace $M_{u0}$. Then
$M_{\rm ram}=M_{u0}\cap\bigcap_v\ker\big(\sum_{c\in\mathbb F_v^\times}\rho_T(c)\big)$ (`Mram`, line 149) and $d_u=\dim M_{\rm ram}$
(line 152). `PeriodMap` (line 163): linear maps $\mathrm{ev}_z$ from forms on $X_m$, a `lowerMap`, and a bilinear `period`
into $\mathbb C$, with `PtilCol φ F = period (lowerMap (evz (col φ))) F` (line 195). In `FiniteDimensionalMram.lean`:

```lean
def PhiC : A.Mram →ₗ[ℂ] Module.Dual ℂ P.Mt := P.period ∘ₗ PsiC C A P
def rkC : ℕ := Module.finrank ℂ (LinearMap.range (PhiC C A P))
def RKC : Prop := A.du < 2 * rkC C A P
```

`RKC` (line 69) says that the period map $\Phi_C:\varphi\mapsto\big(F\mapsto\mathrm{period}(\mathrm{ev}_z(\mathrm{col}\,\varphi),F)\big)$ on $M_{\rm ram}$
has rank greater than $d_u/2$; equivalently $2\dim\ker\Phi_C<d_u$ (`rkc_iff_ker`, line 83). Two `example`s in the file
record that $\Phi_C=0$ violates it and an injective $\Phi_C$ satisfies it. The rows datum identifies its period
columns with these: `D7.perCol_base_eq_PtilCol` and, for each twist $\mu\ne\mu_0$, `D7.perCol_tie`, which equates
`perCol u μ` with `PtilCol` of the twisted chain `chTw u μ` (`ColumnChain.twist`, `DataKernels.lean:91`, replaces
$\rho,\rho'$ and `unf`). Reading: $\mathrm{ev}_z$ restricts to $U(X')\subset U(X_m)$ through $X_m=X'\oplus\langle z\rangle$, so these
periods are Bessel (GGP) periods of the iterated lift.

### 2.8 Scales: where $m$ is tied to $x$

`Scale` (`Formalism/LocalRingCardinality/DataParams₂.lean:9`, verified): reals $x>1$, $0<\varepsilon<1/52$, $J\ge1$, and
derived $L=x^\varepsilon$, $b=e^{L}$, $a=xb$, $X'=\exp(x^{\varepsilon/3})$, $b'=a/X'$, $\delta_1=x^{-\varepsilon/8}$. A family
`Fam eps` (line 256) assigns to each scale $x$ a datum `D x : D7` and size data `L x` with `(L x).sc.x = x`;
`FamP eps` (`Formalism/SharpRestriction/ParConsts.lean:31`) indexes several data per $x$.

`GlobalTheory.EX.RankVal` (def), `Development/AbelianVarietyTheory/Definitions/GlobalTwisting/PairRowIffQdRows.lean:28`

```lean
def RankVal (s : Scale) (R : Ranks) : Prop :=
  (s.x ^ (2 + 8 * s.eps) ≤ (R.n : ℝ) ∧ (R.n : ℝ) ≤ 2 * s.x ^ (2 + 8 * s.eps)) ∧
  (Real.sqrt (s.x * s.delta1) ≤ (R.m : ℝ) ∧ (R.m : ℝ) ≤ 2 * Real.sqrt (s.x * s.delta1)) ∧
  (s.x ^ (9 / 2 + 10 * s.eps) ≤ (R.k : ℝ) ∧ (R.k : ℝ) ≤ 2 * s.x ^ (9 / 2 + 10 * s.eps)) ∧
  R.r + R.t = 8 * R.f * R.r + 4 + TOv s * nWv R s
```

So **the chain length is $m\asymp\sqrt{x\,\delta_1}=x^{1/2-\varepsilon/16}$** (between one and two times that), with
$n\asymp x^{2+8\varepsilon}$, $k\asymp x^{9/2+10\varepsilon}$, and $t\approx8fr$. `exists_ranks_cyclic_frame`
(`.../GlobalInterpolation/ExistsRanksRankValFrame.lean:101`) constructs ranks with `RankVal` for every large $x$, and
`exists_sizeData_explicit` (`.../GlobalInterpolation/ExistsExplicitParameters.lean:74`) builds size data under it.
`three_L_le` (`.../DecoratedLatticeProofs/TypeFrameAllMembers.lean:80`) derives $3x^\varepsilon\le m-1$.

`SizeData₂` (`DataParams₂.lean:76`) adds: an integer $a_T\in[a,\,a+a/(kx^{13})]$ with top Harish-Chandra entry
$u_0=a_T+(k-1)/2$; $\log\Gamma_P=C_\Gamma m^5fL$; the size condition `SizeData₂.TuGe`, $b^{m/2}\le T$ for the auxiliary prime
$T$ (a `Prop` in the same file; the degree hypotheses `HypAt.evP_hypL` require it, but I did not confirm it is imposed
on every datum); $t\le x^{C_t}$; and the
quantities

$$
\mathrm{MAIN}=\sum_t\Big(m\big(a_T\log a_T-a_T-a_T\log\Omega\big)-a_T\log T\Big),\qquad
\log\Omega=\gamma+\log\frac{2\pi}{\mathrm{rd}_E}-\operatorname{Re}\frac{L'}{L}(1,\chi_d),
$$

(`MAIN`, `logOm`; $\mathrm{rd}_E$ is the root discriminant, `DataHost.lean:140`). The same file defines
`Gfun y` $=\sum_{n\le y}\Lambda(n)(y/n-1)-y\log y+(1+\gamma)y$ (line 61), the note's step 5 function.

Reading: the right side of `logOm` is the right side of the Chowla and Selberg formula (`chowla_selberg_eta` in
`.../HomogeneousIdeals/DedekindZetaEqSumRealEisenstein.lean:222` has $\gamma+\log(2\pi/\sqrt d)-L'/L(1,\chi)$), so $\Omega$ is a
CM period, and `MAIN` is the logarithmic size of $m$ copies of an $a_T$-th derivative normalized by $\Omega^{a_T}$, against
$T^{a_T}$. This is the note's "$D^a\theta(0)/\Omega^a$" bookkeeping.

### 2.9 Periods

`PI.BesselPeriodGGP.InterlacingCondition` (`Formalism/PeriodIntegrals/BesselPeriodGGP.lean:27`), verified:
$v_i<u_i$ and $u_{i+1}<v_i$ for $i<k-1$, and $-b_0<u_{k-1}$. `HalfIntegralDifference` (line 32): every $u_i-\lambda_s\in\mathbb Z+\tfrac12$
where $\lambda=$ `lam48 k r v b` $=(v_0,\dots,v_{k-2},-b_0,\dots,-b_{2r+1})$.

`BesselPeriodGGP` (def, line 105), verified shape: for $U(p,q)$ of rank $2r+k+1$ (matrices `Mat k r`), a discrete series
$\sigma$ with Harish-Chandra parameter `lam48 k r v b` and a lowest-$K$-type vector $w$, a finite-dimensional
representation $\pi$ of the subgroup $U_W$ (stabilizer of $z$) of type $u$, and Haar measures on $U_W$ and on the
unipotent $N$: if $u$ interlaces $(v,-b)$ and the differences are half-integers, then for some $x,x_0$

$$
\int_{U_W\times N}\langle\sigma(x_0)w,\ \sigma(hn)\sigma(x)w\rangle\ \overline{\psi(n)}\ \pi(h)^{-1}\,d(h,n)\ne0 .
$$

This is nonvanishing of a local archimedean Bessel (GGP) functional for discrete series of a real unitary group
under interlacing. Reading: the branching rule behind it is the interlacing rule for $U(k)\downarrow U(k-1)$ (multiplicity
1 if interlacing, 0 if not), and the global GGP periods of the note's step 7 are its global counterparts. The `Prop`
appears in one statement only, `besselPeriod_iff` (`.../JetHarmonics/SymmetricMeasureL2NormEqResolutionL2.lean:382`),
as equivalent to `BesselPeriodNeZero`. `interlace_of` (`.../UnitaryHaarProducts/WFLUnit.lean:307`) derives
`InterlacingCondition R.k R.rS` from two `HCParam`s with equal $v,b$, so the datum's parameters always interlace in
the first $k$ slots.

**Seesaw.** `GlobalTheory.T.seesaw_fubini_two_lifts_moderate_growth_kernels`
(`.../DecoratedLatticeProofs/SeesawFubiniTwoLiftsModerateGrowthKernelsStatement.lean:15`), verified: for continuous
kernels $K_1,K_2$ on $U(A)(\mathbb A)\times U(B)(\mathbb A)$, left $U(A)(F)$-invariant, square-integrable in the second variable,
of moderate growth, and rapidly decreasing $u_1,u_2$ on $[U(A)]$, the lifts
$\theta_i(h)=\int_{[U(A)]}K_i(g,h)u_i(g)\,dg$ are square-integrable and
$\langle\theta_1,\theta_2\rangle_{[U(B)]}=\iint_{[U(A)]^2}\langle K_1(q_1,\cdot),K_2(q_2,\cdot)\rangle\,u_1(q_1)\overline{u_2(q_2)}$. This is the
Fubini step of every seesaw argument.

The seesaw for the iterated lift is `GlobalTheory.RowChain.iter_colPer`
(`Development/AbelianVarietyTheory/Proofs/TwistedOperators/QEqColPer.lean:73`):

```lean
theorem iter_colPer (hM : M.Is t) (d : PureT G (downPath t D.R.m D.R.m)) (hd : AllTheta G Wl t d) (F : Fn G (.grid D.R.m D.R.m))
    (hF : IsContAut _ F) (φ : GA D (G.V (.top 0)) → ℂ) (hφ : IsContAut _ φ)
    (hR : (chain G Wl t hM).Rapid (chainData G Wl t hM d) F) :
    (chain G Wl t hM).Iter (colPer Wl hM _ 0 top_idx (topVN hM) (chainData G Wl t hM d) F φ 1)
      ((topLev G hM).per Wl.ψ φ ((chain G Wl t hM).down (chainData G Wl t hM d) F))
```

Verified shape: the Bessel period (`BesLev.per`, a Bessel period against $\varphi$ on the subgroup $U(A)\ltimes N$) of the
iterated lift `Chain.down F` equals an iterated quotient integral (`Chain.Iter`) of an explicit unfolded integrand
`colPer`. `Chain` (`.../LatticeFrames/IsThetaFam.lean:149`) is an inductive type: a chain alternates Bessel levels
(`BesLev`, line 45: $V=V_0\oplus H^\rho$, $V_0=A\oplus L$ with a line vector $\zeta\in L$) and Fourier-Jacobi levels
(`JacLev`, line 58), joined by theta steps (`Step`, line 85, a Weil representation for each pair), and ends in a lift
from a fixed space $T$. The steps are indexed by $j+2\sigma+2=m$.

**Rallis.** Besides `RallisInnerProductConvergent` (section 2.2): `rallisInnerProduct_convergent_of_weilSiegelFormula`
and `thetaInnerProductFormulaDefinite_of_rallisConvergent` (inventory, section 4.C) and
`unitary_theta_innerProduct_formula_convergent_range`
(`.../DecoratedLatticeProofs/UnitaryThetaInnerProductFormulaConvergentRangeStatement.lean`), which states
`petersson B mH (up om m Φ₁ u₁) (up om m Φ₂ u₂) = volQ B mH * ∫ g, wcoef om ν 𝓕 Φ₁ Φ₂ g * rcoef m u₁ u₂ g ∂m` in the
convergent range. Reading (`wcoef`, `rcoef` not opened): $\langle\theta(\Phi_1,u_1),\theta(\Phi_2,u_2)\rangle=\mathrm{vol}\cdot\int_{U(A)}\langle\omega(g)\Phi_1,\Phi_2\rangle\langle\pi(g)u_1,u_2\rangle\,dg$,
the unfolded Rallis formula. In the definite-side records the field `seeIso : SEEIso sEE`
(`Formalism/LocalToGlobal/IndefiniteReal/IsometricPeriodsOfHypotheses.lean:114`) says a map from the rows space into
a space of cusp forms is a scaled isometry ($n_P\|s(e)\|^2=\|e\|^2$) onto a subspace of equal dimension. Reading: that
is the Rallis inner product formula used as an isometry statement.

### 2.10 Sizes

All in `Formalism/HermitianLattices/StatementMass.lean` unless noted; verified.

- `mass h L` (line 11) $=\sum_{M}|\mathrm{Aut}(M)|^{-1}$ over class representatives of the genus of $L$ (0 if none).
- `IsOrthoLattice h L n` (line 18): $L$ has an orthonormal $\mathcal O_K$-basis of size $n$.
- `massRatioRightSide K M` (line 40) $=\dfrac{\big((M-1)!\,(v_K/\pi)^M\big)^{[K^+:\mathbb Q]}}{\sqrt{(2v_K)^{[K^+:\mathbb Q]}}}\cdot L_\eta(M)$,
  with $v_K=|d_K|^{1/(2[K^+:\mathbb Q])}/2$ and $L_\eta(M)=\prod_P e_P$, $e_P=(1-(-1)^M\sqrt{NP}^{-M})^{-1}$ for conjugation-stable
  $P$ and $(1-NP^{-M})^{-1/2}$ otherwise. Reading: $L_\eta(M)=L(M,\eta^M)$ for $\eta$ the quadratic character of $K/K^+$.
- `SiegelMassRatio` (line 67): for $K$ CM unramified over $K^+$ and $M\ge3$,
  $\mathrm{mass}(I_M)/\mathrm{mass}(I_{M-1})=$ `massRatioRightSide K M`, where $I_M$ is the standard odd unimodular lattice of rank
  $M$. Proved: `GlobalTheory.Mass.siegelMassRatio_holds`
  (`.../FlagMeasures/SiegelMassRatioUnimodularDefinite.lean:9`). Used as a hypothesis in 58 statements (counts of
  embedded pairs, row bounds, level-prime sizes).
- `MassTelescope` (line 78): the product formula
  $\mathrm{mass}(I_r)=\mathrm{mass}(I_k)\prod_{M=k+1}^{r}$`massRatioRightSide K M`, assuming `SiegelMassRatio`. **No statement in
  the tree uses it** (0 hits); it is a defined but idle `Prop`.
- `GenusMassAt D n` (`Formalism/LocalToGlobal/GlobalTheory/GL5/DiscreteSeriesOfFormalDegree.lean:112`): every totally
  positive-definite $W$ of rank $n$ has $\mathrm{mass}(L_0)=\mathrm{mass}_I(n)$; `genusMassAt_two` proves it for $n=2$, and it is a
  field `hG` of `HypsAlt`. `MassRatioUnderVolume` (field `hU`) is proved from `SiegelWeilUnitaryConvergent`
  (`VolRatioFromSiegelWeil.volumeRatio`).
- `PeriodClassSumWeyl D` (`Formalism/SharpRestriction/Divisibility/WeightDegreeSizes.lean:723`, field `aPer0` of
  `HypsAlt`): every period value $\mathrm{period}(x,F)$ for lattice points is an algebraic number $y$ with
  $v_w(y)\ge-\mathrm{ur}(w,v_w(\mathrm{DGam}))$ at every place $w$. This is the integrality of periods with denominators
  controlled by the stabilizer orders.
- `ChainInt` (`Statement.lean:40`): if $D_jw_j$ and $K_j$ are $S$-integral then $\prod_{j<m}D_j\cdot\mathrm{chainOp}_m f$ is
  $S$-integral. `FactWtInt` (`DataKernels.lean`): $\mathrm{DGam}\cdot w_i(c)\in\mathbb Z$. I found `ChainInt` in two statements only,
  both comparisons; I did not see it on the spine.

### 2.11 `HypsAlt` and `DefiniteSideCondition`

`GlobalTheory.Fc.HypsAlt N DR` (structure, `.../ThirdPlaceSeries/Hyps.lean:22`) is **data** (`Type 1`, not `Prop`):
a class $\mathcal A$ of families `FamP eps`, a selection `σ : RawSel BundleCondition 𝒜` that picks for each family,
scale $x$ and index a "bundle" (base level choice, spectral condition, column choice, indefinite realisation), a
function `cT`, and about 45 proof fields. Each proof field is a statement of the form `Closed 𝒜' (fun Fm CH => ...)`
(`Closed`, `Formalism/SharpRestriction/ParamsHeightRankConstant.lean:159`: there is $\varepsilon_1>0$ such that for every
$0<\varepsilon\le\varepsilon_1$ a threshold $K$ exists beyond which every family in the class satisfies the property) or a
pointwise statement along the selection. By theme: rows bounded and divisible (`hRB`, `hDivG`, `hDcPtG`), twists
(`hTw`), primitive rows and type separation (`hPA`), low weights (`hLamP`), sizes (`hTu`, `hc30`, `h30`), the class
number formula (`hn4`), the Wu decay estimate (`hWu`), finite-dimensional rows (`hRF`), frames (`hTF`), the
definite-side rows (`rRows`), admissibility of twisted points and periods (`aPt0` to `aC2`, including
`PeriodClassSumWeyl`), irreducibility counts (`irrC`), surjectivity of lattice projections (`zL`), real-place ties
(`tie`), the two mass statements (`hU`, `hG`), and `nRest : N (D3 3 𝒜)`.

`DefiniteSideCondition` (def, `.../ThirdPlaceSeries/DefiniteSideCondition.lean:25`) is a predicate on a datum $D$, an
object $O$, a bundle $b$ and constants $C, C_H$: given type conditions (`Ok3`, `TypesSep3`), the
`CovolumeOntoIsometryConditions` (covolume `L3`, onto `ON`, low weights `L6`, the seesaw isometry `SEEIso`, `MIstar2`,
`FUN`) and `PassIn3` for the indefinite realisation, numerical facts on the letters of $O$, sublattices $N_u$, and
three-sided division compatibility data `I` with `DivTied3 ...`, the rows predicate `RowsU` holds for every word
$u$. It enters through `rRows : SelectionDefiniteRows DR 𝒜 σ`, together with
`IndefiniteRealisationConstantBounds` (`CountsIrreducibilityConstants.lean:35`). I did not unfold `RowsU`, `DivTied3`
or `PassIn3` (section 7).

## 3. The chain

1. **Siegel and Weil for definite spaces, Eisenstein continuation** (classical; Weil, *Sur la formule de Siegel dans la
   théorie des groupes classiques*, Acta Math. 113 (1965); Ichino for unitary groups). `SiegelWeilStd`, `EisBL`,
   proved in `PositivityTheory.SiegelWeilFormula` and `PositivityTheory.RgEis`.
2. **Theta integrals over complementary spaces agree, with tower constants given by partial Hecke $L$-values.**
   `theoremK_head2` gives `ThetaIntegralsAgree ∧ LocalMatching` (sections 2.1, 2.5). Mechanism not read (reading:
   both integrals are Eisenstein values at $\pm s_0$, compared by the functional equation, with local matching of
   Rallis sections). Classical in substance (Kudla and Rallis), stated here in a project-specific normalisation.
3. **Transfer to the datum.** `twisted_square_theta_integrals_eq` converts it to `SquareSt.ThetaIntegralsAgree`
   (`Development/AbelianVarietyTheory/Statements/HeckeThetaIntegrals/ThetaIntegralsAgree.lean:36`) for spaces `HSp D`,
   using `exists_placewise_seesaw_triple_over_hermitian`, Howe duality at the real place, and a coinvariant passage
   lemma. Specific to this proof.
4. **Separation of functionals and test vectors.** `functionalsSeparate_of_howeUnram_of_siegelWeil` (from unramified
   Howe duality and Siegel-Weil convergence); `test_vector_assembly_holds` (uses `hA`, `hM`); `rowRatW_of_rowTest`
   gives rationality of rows. Specific.
5. **Fourier coefficients fit and the evaluation grid.** `fourier_coefficient_fit_of_join_alt` and
   `evaluation_grid_of_join`, which use `hA`, `hM`, twisted Weil convergence and `twisted_local_factors_match`, and
   produce the constants `CF0, CF1` and the grid `GridA`. Specific.
6. **The definite chain.** For each scale $x$ the datum carries $m\asymp x^{1/2-\varepsilon/16}$ totally definite spaces of
   ranks $k+j(t+1)$ (`Spaces`, `RankVal`) and the iterated twisted lift `col = chainOpM wt Kmap m` on functions on
   class sets (`ColumnChain`). Specific in design; the lattice-theta formalism is classical (Siegel, Eichler).
7. **Integrality.** Weights are reciprocals of stabilizer orders dividing `DGam`; periods of lattice points are
   algebraic with controlled denominators (`PeriodClassSumWeyl`); the class count is
   $\mathrm{mass}_I(k)\,\mathrm{idx}\,(T^k-1)^f$ (`ClassNumberFormula₂`). Specific, using Siegel's mass formula (classical).
8. **Sizes.** Siegel mass ratios (`SiegelMassRatio`, proved), genus masses, volume ratios from Siegel-Weil; the
   Chowla and Selberg period $\Omega$ in `logOm` and `MAIN`. Classical inputs, project-specific bookkeeping.
9. **Seesaw for the iterated lift.** `iter_colPer`: the Bessel period of the $m$-fold lift is an iterated integral of an
   explicit kernel; `seesaw_fubini` is the analytic step. Classical mechanism (seesaw duality, Kudla, *Seesaw dual
   reductive pairs*, 1984), specific chain.
10. **Rank of the period map and the rows.** `RKC`: the GGP-period map on the ramified forms has rank above half the
    dimension; `SEEIso` makes the rows map an isometry. These are packed into `DefiniteSideCondition` and the
    fields of `HypsAlt`. Specific. I did not trace where `RK` is proved for the datum.
11. **Assembly.** `hypotheses_nonempty_of_unramified_exponents_alt` builds `Nonempty (HypsAlt S0.NL DefiniteSideCondition)`
    from steps 4 to 10, `open0_of_unitary_group_hypotheses`, `open_and_linked_of_stronger_extension_alt`,
    `linked_bundles_l3_of_open_alt` (which uses `hX`), and the 2 and 3 local bounds from `P.nLink`. Specific.
12. **Upward.** `shape_closed_link_n_of_green` turns `Green` and the record into `TopG`; inside, `topDesWin`
    (`Development/AutomorphicArithmetic/CharacterBoxes/DesWin.lean:11`) combines the links `LinkN`, `LinkEta`,
    `LinkIRR` (Green), `LinkDIVt` (division), `LinkG`, `LinkS`, `LinkGLOBAL`, a rank statement
    (`NuFullF ∧ J.MuRank`) and `HypV` into `FamilyClassConnected`: for small $\varepsilon$ some family exists with
    `ChainTied Fm ... x` for every large $x$ in its window (`ChainTied`,
    `Formalism/SharpRestriction/GlobalSchurBounds/TieGlobal.lean:97`), which contains
    `GrowthInequalityRemainingHyps`, the growth data consumed by reader 1's `GrowthBoundGivesRiemannHypothesis`
    route. Then `zeroFreeAll_of_topG` and `imprimitive` (reader 1).

**Interfaces.** Downward, this region takes from the Galois and integrality side exactly: `CuspUAlt` and `CarUAlt`
(both built from `Row0b`), local Langlands `RecTExists`, the 2 and 3 local bounds `NLink.Hypotheses₂`, the
non-endoscopy and Galois-compatibility records `litN` and `toHypothesesX`, and `hX` (Arakelov covolumes). `TLiftK`
does not appear in the statement of the top theorem; it reaches the argument only through `Row0b`. Upward, it gives
`Nonempty (HypsAlt S0.NL DefiniteSideCondition)` and `Green`, from which `TopG` and then the per-scale
`ChainTied` data follow.

## 4. Against the note

**Step 7** ("Determinants for $W(\cdot)$'s containing the desired periods, indeed GGP periods, with values 0, 1 meaning
interlacing weights, or up to $m$ non-interlacing ones"). Realized by: `InterlacingCondition` and `BesselPeriodGGP`
(local nonvanishing under interlacing); `HCParam` (each datum's parameters interlace in the first $k$ slots and carry
$m$ extra pairs $(b_j,e_j)$ separated by gaps $\ge(t+3)/2$); `PeriodMap`, `PtilCol`, `PhiC`, `RKC`; `D7.perCol_*` and
`Rows.Data.Bu`. Difference: no declaration computes a determinant whose entries are GGP periods. The code states a
rank condition (`RKC`: $\operatorname{rank}\Phi_C>d_u/2$) on the linear map whose matrix entries are the periods, and the
rows record `Rows.Data` (`Formalism/LocalRingCardinality/DataRows.lean:36`) has a rows space `EE` of dimension
$(1-\delta_p)D_{\rm all}$ and pairings `Bu u : Mu u → EE → ℂ` and `perCol u μ : Mu u → Amb μ → ℂ`. Reading: the
"determinant" is the minor structure of these pairings, and "up to $m$ non-interlacing weights" corresponds to the
$m$ parameters $b_j$ beyond the interlacing block. The value "0, 1" (branching multiplicity) is not stated as such.

**Step 8** ("Iterated theta lifts $U(X_0)\to\dots\to U(X_m)$ between totally definite unitary groups,
$\pi\mapsto\pi\boxplus\mu_j[t]$, wins multiplicity $m$. Time to take $m$ like $\sqrt X$"). Realized by: `Spaces.X_def`
(each $X_j$, $j\le m$, totally definite), `ColumnChain` and `chainOpM` (the iterated lift on class functions),
`D7.rhoDet_eq_inv_muTilde_chiD_pow` (the twisting characters $\tilde\mu_j$), and `RankVal`
($\sqrt{x\delta_1}\le m\le2\sqrt{x\delta_1}$). Differences: (i) ranks grow by $t+1$ per step, with $t$ odd, while
$\mu_j[t]$ suggests a block of dimension $t$ (doubt 1, section 7); (ii) $m\asymp x^{1/2-\varepsilon/16}$, slightly below
$\sqrt x$, where $x$ is the window scale `Scale.x`, which equals the $x$ of reader 1's endgame through
`Fam.L_x`; (iii) each datum also contains a much longer length $a_T\approx xe^{x^\varepsilon}$ (top Harish-Chandra entry,
`MAIN`), and I could not settle which of $x$ and $a_T$ is the note's "$X$". The phrase "wins multiplicity $m$" has no
single declaration.

**Step 9** ("Norms of the lifts and level and cancellation of order-$m$ terms with proven divisibility via Chowla and
Selberg, Weyl, and Siegel mass"). Realized by: `SiegelMassRatio` (proved), `MassTelescope` (defined, unused),
`GenusMassAt`, `MassRatioUnderVolume`, `ClassNumberFormula₂`, `PeriodClassSumWeyl`, `DGam` and `FactWtInt`, the
Rallis formulas, `SEEIso`, and `logOm`/`MAIN` (Chowla and Selberg). Not located: an explicit "cancellation of
order-$m$ terms". "Weyl" most likely refers to `PeriodClassSumWeyl` and the Weyl branching law in `F.weylBranching`
(reading).

**Step 12** ("Seesaw: the period of the iterated lift is a Bessel period independent of the Hecke characters,
Rallis"). Realized by: `iter_colPer` and `Q_eq_colPer` (Bessel period of the iterated lift as an unfolded
integral), `seesaw_fubini`, the `Chain` inductive type, `seesaw_triple_implicit_unfolding` and
`seesaw_evaluation_haar_unfolding` (statement files in `.../DivisorProofs/`), the Rallis statements. Not located:
an explicit theorem that the period is independent of the Hecke characters. The nearest are (a) `StepBeta` and
`StepAlpha`, which make the dependence on $\nu=\alpha/\beta$ fully explicit (one partial $L$-value and Gauss-sum factors
per tower step, times a constant $C$ independent of the characters), and (b) `D7.perCol_tie`, which equates the
twisted period columns with periods of the twisted chain.

**Also in my region but not in the note.** Green's theorem on cuspidal characters of $\mathrm{GL}_d(\mathbb F_g)$; the
indefinite inner forms $W_j$ of signature $(k+j-1,m-j)$ that move one sign at a time; the auxiliary prime $T$ (of size
at least $e^{mx^\varepsilon/2}$ under `TuGe`) with $f$ places of residue field $\mathbb F_T$ and the Gauss-sum operators on the ramified part (`GaussOp`, proved as
`final_gaussOp`); the Kudla and Rallis style complementary-space identity with explicit tower constants
(`ThetaIntegralsAgree`).

## 5. In plain terms

The integers have no derivative, so the argument manufactures "vanishing to order $m$" another way. Fix a CM field
$E$ (think $\mathbb Q(i)$, but in the code its degree grows with the scale) and a chain of positive-definite hermitian
spaces $X_0\subset X_1\subset\dots\subset X_m$ over it, each $t+1$ dimensions larger than the last. On a positive-definite
space the arithmetic group is finite modulo the compact part, so an automorphic form is nothing more than a list of
numbers, one per isometry class of lattice in a genus (Siegel and Eichler's picture). A theta lift from $X_j$ to $X_{j+1}$
is then a matrix: the $(L,L')$ entry counts, with weights, how lattice $L$ sits against lattice $L'$, and the lift of a
form $f$ is $f\mapsto\sum_L f(L)K(L,L')/|\mathrm{Aut}L|$. Iterating $m$ times is a product of $m$ such matrices, which is
`chainOp`.

The smallest case to see is $m=1$ with scalar values: forms on $X_0$ are vectors $f\in\mathbb C^{h_0}$ ($h_0$ classes), the
kernel is an $h_0\times h_1$ matrix $K$, and the lift is $f\mapsto(\sum_L w_Lf_LK_{L,L'})_{L'}$. Every weight $w_L$ is $1/n$ with
$n$ dividing a fixed `DGam`, so if the kernel entries are integral then $\mathrm{DGam}^m$ times the $m$-fold lift is
integral (the abstract statement `ChainInt`): integrality survives the iteration with a controlled denominator. In
the code this control appears as `PeriodClassSumWeyl` and `FactWtInt`. Each lift adds a block to the Langlands
parameter (reading of the note's $\pi\boxplus\mu_j[t]$), and the parameters in `HCParam` record the shape: an interlacing
block $(u,v)$ for the starting form and one pair $(b_j,e_j)$ per lift, kept far apart.

The output is read through periods. Restricting the last form from $U(X_m)$ to $U(X')$ with $X_m=X'\oplus\langle z\rangle$ gives
a Bessel (Gan, Gross and Prasad) period. At a real place these periods are nonzero exactly when weights interlace,
the branching rule for $U(k)\supset U(k-1)$; that is the "0 or 1". The seesaw identity converts the period of the
iterated lift into an integral of the starting form against an explicit kernel (`iter_colPer`), so it can be
computed one step at a time. The global theta identity `ThetaIntegralsAgree` controls the constants: adding a
hyperbolic plane on either side multiplies the constant by one partial Hecke $L$-value and Gauss sums, nothing
else. Siegel's mass formula and its ratio form give the sizes; the Chowla and Selberg period $\Omega$ normalizes the
derivative-like terms.

Where the multiplicity becomes a bound: the linear map "form on $X_0$ $\mapsto$ its periods after $m$ lifts" must have rank
more than half the dimension of the space of forms ramified at an auxiliary prime $T$ (`RKC`). Combined with
divisibility (integrality with denominators) and size (masses, Rallis norms), the data in `HypsAlt` feed the
"design" argument of `topDesWin`, which delivers, at each scale $x$, the growth inequality data that reader 1 turns
into the Chebyshev-type bound $\Lambda.G_m(x)\le x^{1/2+O(\varepsilon)}$ and then into zero-freeness.

What fails without each hypothesis: without total definiteness there are no finite class sets and the lift is not a
finite matrix; without the interlacing and half-integrality conditions the local Bessel functional can vanish and
the period map can drop rank; without the complementary-space identity the constants of the tower are not
explicit and cannot be compared across characters; without Siegel-Weil and Rallis there is no control of norms;
without Green's theorem the irreducibility link `LinkIRR` is missing; and without $m\asymp\sqrt x$ the gain from
multiplicity does not match the loss in the analytic endgame (reading of the note, not checked in code).

## 6. For the explainer

**A chapter on this region must contain.** (1) Hermitian spaces over a CM field, signatures, definite versus
indefinite, unitary groups. (2) Automorphic forms on a definite unitary group as functions on lattice classes in a
genus, with weights $1/|\mathrm{Aut}|$ and the mass. (3) The theta series of a lattice and the theta lift between two
definite spaces as a kernel matrix; `chainOp` as matrix multiplication. (4) The Weil representation only as far as
needed to state $I_V(\Phi)=\int\theta$ and Siegel-Weil. (5) The complementary-space identity with its tower constants
(`StepBeta`, `StepAlpha`), stated precisely. (6) Bessel periods, the interlacing rule, and the local nonvanishing
`BesselPeriodGGP`. (7) Seesaw as Fubini, and the iterated-lift seesaw. (8) The rank condition `RKC`. (9) The scale
dictionary: $m\asymp x^{1/2-\varepsilon/16}$, $k\asymp x^{9/2+10\varepsilon}$, $n\asymp x^{2+8\varepsilon}$, and $T\ge e^{mx^\varepsilon/2}$ under `TuGe`.

**Can be stated with a pointer.** Green's theorem; the Siegel and Weil formula and the Rallis inner product
formula; Siegel's mass formula and the ratio `SiegelMassRatio`; Chowla and Selberg; Howe duality; local Langlands.
These are classical and proved or cited in the tree.

**Interactive figures.**

1. *Lattice classes and the lift matrix.* A small genus of positive-definite binary hermitian lattices over
   $\mathbb Z[i]$ drawn as points with weights $1/|\mathrm{Aut}|$; the reader drags a form (bar heights on classes) and watches its
   lift to the next space through a kernel heat map, then iterates.
2. *Interlacing.* Two rows of beads $u_0>\dots>u_{k-1}$ and $v_0>\dots>v_{k-2}$ on a line; the reader drags the $v$'s, and the
   branching multiplicity (1 or 0) and a period meter light up when the beads interlace.
3. *Tower constants.* A Witt tower ladder for $V$ and $V'$ with $\dim V+\dim V'=\dim W$; clicking "add hyperbolic plane"
   multiplies the constant by $L^{S_0}(\nu,s)$ at the right point, shown on a plot of $|L(\nu,s)|$.
4. *Scales.* A slider for $x$ (log scale) showing $m$, $k$, $n$ from `RankVal` and the lower bound for $\log T$ from
   `TuGe`, against $\sqrt x$.

**Result cards.** `every_character_of_theta_integrals_local_matching` (shape only); `ThetaIntegralsAgree` with
`StepBeta`/`StepAlpha`; `chainOp` and `colTo_eq`; `RankVal`; `InterlacingCondition` and `BesselPeriodGGP`;
`iter_colPer`; `SiegelMassRatio`; `RKC`; `Green`.

## 7. Not understood

1. **The kernel `unf` is abstract.** `ColumnChain.unf` is a field of the record; I found no theorem identifying it
   with a theta series coefficient between lattice classes, nor where the datum's chain is built from actual
   lattices in `Spaces.X j`. The identification is a reading. Likewise `Y i` and `de` (the normalizing values) were not
   unfolded.
2. **Ranks grow by $t+1$, the note says $\mu_j[t]$.** $N_{j+1}-N_j=t+1$ with $t$ odd, and the kernel exponents differ by
   $(t+1)/2$. I could not reconcile this with a block of dimension $t$; the extra dimension may be a character, or the
   note's notation may differ.
3. **Which length is the note's $X$.** $m\asymp\sqrt{x}$ for the window scale $x$, but the datum also contains
   $a_T\approx xe^{x^\varepsilon}$ and sums of length $a_T$ (`MAIN`, `vonMangoldtClassSum`). Not settled.
4. **`HypsAlt` and `DefiniteSideCondition` are not unfolded to ordinary mathematics.** I list their fields by theme
   only. `RowsU`, `DivTied3`, `PassIn3`, `L3`, `ON`, `L6`, `FUN`, `MIstar2`, `TupleData`, `BundleCondition`,
   `RawSel`, `FamClass` operators `D3`, `WithTw`, `WithSm`, `WithChN` were not opened.
5. **Where `RK`/`RKC` is proved for the datum, and how it feeds `TopG`.** I saw `MuRank` (positive rank of `div.Nu u`)
   and `NuFullF` in `topDesWin` but did not connect them to `RKC`.
6. **The proof of `theoremK_head2`** (`theoremK_head2_of_mod`, `PositivityTheory.Sph.modSt2`) was not read, so the
   Eisenstein-functional-equation mechanism in section 2.1 is inferred.
7. **`IsUWeilPair`, `IsZetaAt` (`bigP`, `smallP`), `LS`, `colPer`, `besPer`, `fjSrcKer`** were not opened.
8. **Independence of the Hecke characters** (note step 12) was not found as a theorem.
9. **`RankVal` on the spine.** I verified that the explicit family constructions assume `RankVal`, not that every family
   class reaching `TopG` satisfies it.
10. **The role of `ChainInt`, `MassTelescope`, `LatSeeSaw`, `RallisAdj`, `ChainScalar`, `KerAdjoint`, `DetChain`.** All are
    defined `Prop`s in the import closure; `MassTelescope`, `LatSeeSaw`, `RallisAdj`, `ChainScalar`, `KerAdjoint`,
    `DetChain` occur in no statement, and `ChainInt` in two comparison lemmas. They look like an earlier, finite-group
    formulation of the same ideas (adjoint lifts, Rallis as $\theta^*\theta=c$, iterated scalars, determinants of
    block-diagonal maps) that the final proof does not use.
11. **The interpretation of `R.f`, `Tau`, `R.Psi`.** $f=2\,\mathrm{ord}$ counts the Harish-Chandra parameter slots and the
    split places above $T$; I did not confirm that it equals $[F:\mathbb Q]$.
