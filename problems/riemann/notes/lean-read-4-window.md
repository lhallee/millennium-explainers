# Lean reader 4: the automorphic window `VWin` and base change

Source: the Lean tree `sources/riemann/lean/lean/src/` (archive of the proof by Levent Alpoge with Claude), read
2026-11-21 through the index `.cache/lean-index/index.sqlite` and the Read tool. Nothing was built or run. File paths
below are relative to the tree root. Statements in Lean blocks are verbatim; everything else is a paraphrase, and a
sentence that is our interpretation rather than a reading of the code says so.

Headline: `VWin` is not a statement about prime sums. It is a bound on Galois cohomology. For every primitive
character $\psi$ it says that, on a window of scales $x\in[Y,Y^2]$, an explicit abelian CM field
$E=E_{\psi,e(x),q,d}$ of degree about $x^{2+8\varepsilon}$ has
$\prod_{\ell}\prod_{1\le k<x^{401}}\#\text{Ш}^1(E,\mathbb Q_\ell/\mathbb Z_\ell(-k))\le e^{x^{\varepsilon}/2}$.
These are the groups $H^1(\mathfrak o_E[1/\ell],\mathbb Q_\ell/\mathbb Z_\ell(-e))$ of the note's step 17, and
`VWin` is the code's form of the "significant weakening of Vandiver". The window exists because finitely many
twists $k$ can be exceptional ($\ell$-adically close to a zero of an Iwasawa power series), and a pigeonhole over
scales finds a window that avoids them. Base change from unitary groups to $\mathrm{GL}_n$ and the
Galois-representation statement `Row0b` enter only as tools inside the automorphy arguments that bound the
"plus" part of these groups.

## 1. What this region proves

### 1.1 `VWin`

`UpperTheory.Top.VWin`, `Development/AutomorphicArithmetic/CharacterBoxes/ExistsPageN.lean:49`, with its pieces from
the same file:

```lean
def VVle (E : Type) [Field E] [NumberField E] (t : ℕ) (B : ℝ) : Prop :=
  ∀ (Ω : Type) [Field Ω] [Algebra E Ω] [IsAlgClosure E Ω] (ld : ∀ (p : ℕ) [Fact p.Prime], Formalism.GaloisCohomology.LData E Ω p),
    (∀ (p : ℕ) [Fact p.Prime] (e : ℕ), 0 < e → e < t → Formalism.GaloisCohomology.shaLen (ld p) (e : ℤ) ≠ ⊤) ∧
    ∀ S : Finset Nat.Primes,
      ∑ l ∈ S, Real.log (l : ℕ) *
        ∑ e ∈ Finset.Ico 1 t, ((@Formalism.GaloisCohomology.shaLen E Ω _ _ _ _ _ l ⟨l.2⟩ (@ld l ⟨l.2⟩) (e : ℤ)).toNat : ℝ) ≤ B

def IsChiField (ψ : PChar) (e q d : ℕ) (E : Type) [Field E] [NumberField E] : Prop :=
  ∃ (N : ℕ) (_ : NeZero N) (j : E →ₐ[ℚ] CyclotomicField N ℚ) (ζ : CyclotomicField N ℚ),
    2 ^ (e + 2) ∣ N ∧ ψ.N ∣ N ∧ q ∣ N ∧ d ∣ N ∧ IsPrimitiveRoot ζ N ∧
    ∀ (τ : CyclotomicField N ℚ ≃ₐ[ℚ] CyclotomicField N ℚ) (a : ℕ), τ ζ = ζ ^ a →
      ((∀ x : E, τ (j x) = j x) ↔
        (a ≡ 1 [MOD 2 ^ (e + 2)] ∨ a + 1 ≡ 0 [MOD 2 ^ (e + 2)]) ∧ ψ.val a = 1 ∧
          jacobiSym (a : ℤ) q = 1 ∧ jacobiSym (a : ℤ) d = 1)

structure WinPair (eps Y : ℝ) (q d : ℕ) : Prop where
  q_prime : q.Prime
  q_mod : q % 8 = 3
  q_lo : Y ^ (eps / 5) / 2 < Real.log q
  q_up : Real.log q ≤ Y ^ (eps / 5)
  d_prime : d.Prime
  d_mod : d % 16 = 7
  d_lo : Y ^ (eps / 5) * Real.log Y ^ 2 / 2 < Real.log d
  d_up : Real.log d ≤ Y ^ (eps / 5) * Real.log Y ^ 2
  d_q : q ∣ d + 1
  d_small : ∀ p : ℕ, p.Prime → p ≠ 2 → (p : ℝ) ≤ Y ^ (eps / 5) → p ∣ d + 1

def PageN (eps x : ℝ) (e : ℕ) : Prop := x ^ (2 + 8 * eps) ≤ (2 : ℝ) ^ e ∧ (2 : ℝ) ^ e ≤ 2 * x ^ (2 + 8 * eps)

def VAt (ψ : PChar) (eps Ct : ℝ) (q d e : ℕ) (x : ℝ) : Prop :=
  ∀ (E : Type) [Field E] [NumberField E], IsChiField ψ e q d E → VVle E ⌊x ^ Ct⌋₊ (Real.sqrt (Real.exp (x ^ eps)))

def VWinAt (ψ : PChar) (Ct : ℝ) : Prop :=
  ∀ eps : ℝ, 0 < eps → eps < 1 / 52 → ∀ e : ℝ → ℕ, (∀ x ≥ (1 : ℝ), PageN eps x (e x)) →
    ∃ J : ℝ, 1 ≤ J ∧ ∃ X0 : ℝ, ∀ X ≥ X0, ∀ q d : ℕ, WinPair eps (X ^ (1 / J)) q d →
      ∃ Y : ℝ, X ^ (1 / J) ≤ Y ∧ Y ^ (2 : ℝ) ≤ X ∧ ∀ x : ℝ, Y ≤ x → x ≤ Y ^ (2 : ℝ) → VAt ψ eps Ct q d (e x) x

def VWin : Prop := ∀ ψ : PChar, VWinAt ψ 401
```

**In ordinary mathematics.** Fix a primitive Dirichlet character $\psi$ of conductor $N_\psi$. For every
$\varepsilon\in(0,\tfrac1{52})$ and every function $e:\mathbb R\to\mathbb N$ with
$x^{2+8\varepsilon}\le 2^{e(x)}\le 2x^{2+8\varepsilon}$ for $x\ge1$, there are $J\ge1$ and $X_0$ such that the
following holds. Let $X\ge X_0$, put $Y_0=X^{1/J}$, and let $q,d$ be primes with

- $q\equiv3\pmod 8$ and $\tfrac12Y_0^{\varepsilon/5}<\log q\le Y_0^{\varepsilon/5}$,
- $d\equiv7\pmod{16}$ and $\tfrac12Y_0^{\varepsilon/5}(\log Y_0)^2<\log d\le Y_0^{\varepsilon/5}(\log Y_0)^2$,
- $q\mid d+1$, and every odd prime $p\le Y_0^{\varepsilon/5}$ divides $d+1$.

Then there is $Y$ with $X^{1/J}\le Y$ and $Y^2\le X$ such that for every $x\in[Y,Y^2]$, with $t=\lfloor x^{401}\rfloor$
and $E=E_{\psi,e(x),q,d}$ (the field defined in 2.3):

1. for every prime $\ell$ and every $1\le k<t$, the group $\text{Ш}^1(E,\mathbb Q_\ell/\mathbb Z_\ell(-k))$ is finite;
2. $\displaystyle\sum_{\ell}\log\ell\sum_{k=1}^{t-1}\operatorname{len}_{\mathbb Z_\ell}\text{Ш}^1(E,\mathbb Q_\ell/\mathbb Z_\ell(-k))\le\sqrt{e^{x^{\varepsilon}}}=e^{x^\varepsilon/2}.$

The code states (2) for every finite set of primes, which is the same as the full sum. A finite
$\mathbb Z_\ell$-module of length $n$ has $\ell^n$ elements, so (2) says exactly

$$\prod_{\ell}\ \prod_{k=1}^{t-1}\#\,\text{Ш}^1\big(E,\mathbb Q_\ell/\mathbb Z_\ell(-k)\big)\ \le\ e^{x^\varepsilon/2}.$$

Here $\text{Ш}^1(E,\mathbb Q_\ell/\mathbb Z_\ell(-k))$ is the kernel of
$H^1(G_{E,S},\mathbb Q_\ell/\mathbb Z_\ell(-k))\to\prod_{v\mid\ell}H^1(E_v,\mathbb Q_\ell/\mathbb Z_\ell(-k))$, with
$S$ the places above $\ell$ and $\infty$ (unfolded in 2.1). The quantity is a number, the inequality is about an
explicit finite sum of logarithms of orders of cohomology groups; it is not a sum over primes of the kind
$\sum\Lambda(n)$.

### 1.2 `vwin_of_row`

`UpperTheory.One.vwin_of_row`,
`Development/AutomorphicArithmetic/AutomorphicVarieties/ModularityArgument/ThresholdArguments/DenseThresholdCases/VwinOfRow.lean:4`:

```lean
theorem UpperTheory.One.vwin_of_row (h : UpperTheory.GalStar.Row0b fun h rc => UpperTheory.Zero.LLC.IsRecT h rc) : UpperTheory.Top.VWin :=
  UpperTheory.One.Join.automorphic_window_of_inputs (UpperTheory.LiteratureTheorems.OpenImageCondition.mk h) UpperTheory.BaseChangeIdentities.baseChangeN h
```

In words: if every regular algebraic polarized cuspidal automorphic representation of $\mathrm{GL}_a$ over a CM field
has an attached $\ell$-adic Galois representation with the properties `PropsB` (this is `Row0b`, reader 3), then
`VWin` holds. The base-change input is not a hypothesis: it is the theorem `baseChangeN`.

### 1.3 `automorphic_window_of_inputs`

`TopMainZj.lean:76` in the same folder:

```lean
theorem UpperTheory.One.Join.automorphic_window_of_inputs (O : _root_.UpperTheory.LiteratureTheorems.OpenImageCondition)
 (bc : _root_.PositivityTheory.Rg.BcN.BaseChangeIsobaricN) (gal : _root_.UpperTheory.V.Z.Win.RowT) :
    UpperTheory.Top.VWin :=
  _root_.UpperTheory.One.Join.v_window_of_depth_zero_residual_bc_cm O bc gal (_root_.UpperTheory.One.Join.cm_abelian_inputs_from_literature O)
```

`RowT` is by definition `Row0b fun h rc => IsRecT h rc` (`.../AutomorphyLifting/WeakOfAtt.lean:47`), so `vwin_of_row`
passes the same hypothesis twice.

### 1.4 `BaseChangeIsobaricN`

`PositivityTheory.Rg.BcN.BaseChangeIsobaricN`,
`Development/WeilBound/RepresentationTheoryGL/ArchimedeanBaseChange/ArchimedeanBaseChangeProof/BaseChangeIsobaricNOf.lean:39`:

```lean
def BaseChangeIsobaricN : Prop :=
  ∀ (E : Type) [Field E] [NumberField E] [IsCMField E],
    (∀ w : HeightOneSpectrum (𝓞 E), Algebra.IsUnramifiedAt (𝓞 (maximalRealSubfield E)) w.asIdeal) →
    ∀ n : ℕ, 1 ≤ n → ∀ π : Submodule ℂ (UA E n → ℂ), IsAutRepU π →
      ∃ (c : ℕ) (N : Fin c → ℕ) (h : ∑ i, N i = n) (V : ∀ i, Submodule ℂ (Sm E (N i)))
        (σ : ∀ i (w : HeightOneSpectrum (𝓞 E)), SmIrr (GL (Fin (N i)) (w.adicCompletion E)))
        (m : Fin c → (E →+* ℂ) → Multiset ℂ)
        (P : ∀ w : HeightOneSpectrum (𝓞 E), SmIrr (GL (Fin n) (w.adicCompletion E))), IsBaseChangeN π h V σ m P
```

In words: let $E$ be a CM field with $E/E^+$ unramified at every finite place, and $\pi$ an automorphic
representation of the unitary group in $n$ variables attached to $E/E^+$ (`UA E n`, `IsAutRepU`; the group was not
unfolded beyond its name and the "definite unitary" wording of `BcSpeh`, see 2.8). Then there are a partition
$n=N_1+\dots+N_c$ and discrete automorphic representations $V_i$ of $\mathrm{GL}_{N_i}(\mathbb A_E)$, each
conjugate self-dual and built from a unitary cuspidal one (`CsdAsc`), such that the base change of $\pi$ is the
isobaric sum $V_1\boxplus\dots\boxplus V_c$: at every finite place the local component $P_w$ of the base change is a
subquotient of the product of the local components $\sigma_{i,w}$; it is spherical where $\pi$ is unramified; at
inert unramified places its Satake parameter is the base-change image `bcParam` of $\pi$'s; at split places it is
$\pi_w$ read through $U(n)(E^+_v)\cong\mathrm{GL}_n(E_w)$; and the infinitesimal characters add up to $\pi$'s
weight. This is the standard statement of weak base change from unitary groups to $\mathrm{GL}_n$ (known results of
Labesse, Mok, and Kaletha, Minguez, Shin, and White; we did not check which one the code follows, and there is no
citation in the tree).

## 2. Definitions unfolded

### 2.1 The cohomology groups

All in `Formalism/GaloisCohomology/Statement.lean` and `ReciprocityTheory/GaloisValuations/`.

- `QZ l` (line 15): the discrete group $\mathbb Q_\ell/\mathbb Z_\ell$, a $\mathbb Z_\ell$-module.
- `LData F Ω l` (line 54, a structure): the finite set $S$ of places of $F$ above $\ell$, a choice of a place of
  $\bar F$ above each, and a character $\chi:G_{F,S}\to\mathbb Z_\ell^\times$ whose pullback to $G_F$ is the
  $\ell$-adic cyclotomic character `cycZ`. Here `GS Ω S` (`ReciprocityTheory/GaloisValuations/Global.lean:141`) is
  $G_F$ modulo the closed normal subgroup generated by the inertia groups at finite places outside $S$. Infinite
  places have no inertia group in this construction, so $G_{F,S}$ is the Galois group of the maximal extension
  unramified outside $\ell\infty$, and $H^1(G_{F,S},M)=H^1(\mathfrak o_F[1/\ell],M)$.
- `qzTw D e` (line 67): $\mathbb Q_\ell/\mathbb Z_\ell$ with $G_{F,S}$ acting by $\chi^{-e}$, that is
  $\mathbb Q_\ell/\mathbb Z_\ell(-e)$.
- `H1` (`.../SeparatedDvrSecondCohomologyMem.lean:66`): continuous 1-cocycles modulo coboundaries, the usual
  continuous cohomology.
- `Sha D e` (line 75): `Sha1` (`ContinuousConstSMulQuotient.lean:168`) is the intersection over $v\in S$ of the
  kernels of restriction to the decomposition groups. So
  $\text{Sha}(D,e)=\ker\big(H^1(G_{F,S},\mathbb Q_\ell/\mathbb Z_\ell(-e))\to\prod_{v\mid\ell}H^1(G_{F_v},\mathbb Q_\ell/\mathbb Z_\ell(-e))\big)$.
- `shaLen D e` (line 78): its length as a $\mathbb Z_\ell$-module, in $\mathbb N\cup\{\infty\}$.

`VVle E t B` is then the proposition of 1.1: finiteness of these groups for $0<k<t$ and all $\ell$, and the
weighted sum of lengths at most $B$. It is a proposition about one number field. The quantifier over the auxiliary
choices `Ω`, `ld` is harmless: the lengths do not depend on them (`Indep`, line 122, is proved elsewhere; we did not
trace that proof).

### 2.2 The plus and minus parts

`Development/AutomorphicArithmetic/AutomorphicVarieties/LengthEqAddEigen.lean`. For a CM field $E$ complex
conjugation $c$ acts on $\text{Ш}^1$. `ShaPlus D e` is the $(-1)^e$-eigenspace and `ShaMinus D e` the
$(-1)^{e+1}$-eigenspace; `shaLen_eq_add` proves $\text{len}=\text{len}^++\text{len}^-$ for $\ell\ne2$ (2 is a unit).
`VVplusLe`, `VVminusLe` are `VVle` with `plusLen`, `minusLen` and only odd $\ell$. `VVat l E t B` is the single-prime
version, and `BoundedHeightTwoPlaceCondition E t B := VVat 2 E t B` is the prime 2.

Since $c$ acts on $\mathbb Z_\ell(1)$ by $-1$, it acts on $\mathbb Q_\ell/\mathbb Z_\ell(-k)$ by $(-1)^k$. So the
"plus" part is where the twist and the field's own conjugation agree. Our reading: the plus part plays the role of
the real (Vandiver) part of a cyclotomic class group, the minus part the role of the relative class group controlled
by Bernoulli numbers. This matches the proofs: the minus part is bounded through `stickBound` (Stickelberger), the
plus part through automorphy (section 3).

### 2.3 The field $E_{\psi,e,q,d}$

`IsChiField ψ e q d E` says: $E$ embeds in $\mathbb Q(\zeta_N)$ for some $N$ divisible by $2^{e+2}$, $N_\psi$, $q$, $d$,
and $\sigma_a:\zeta\mapsto\zeta^a$ fixes $E$ exactly when

$$a\equiv\pm1\pmod{2^{e+2}},\qquad \psi(a)=1,\qquad \Big(\frac aq\Big)=1,\qquad \Big(\frac ad\Big)=1 .$$

So $E$ is the fixed field of $H=\{a\}$ in $(\mathbb Z/N)^\times$, which is the compositum of the fixed fields of the
four conditions:

$$E\;=\;\mathbb Q(\zeta_{2^{e+2}})^+\cdot K_\psi\cdot\mathbb Q(\sqrt{-q})\cdot\mathbb Q(\sqrt{-d}),$$

where $\mathbb Q(\zeta_{2^{e+2}})^+$ is the $e$-th layer of the cyclotomic $\mathbb Z_2$-extension of $\mathbb Q$
(degree $2^e$), $K_\psi$ is the cyclic field cut out by $\ker\psi$, and $\mathbb Q(\sqrt{-q})$, $\mathbb Q(\sqrt{-d})$
come from the Legendre symbols because $q\equiv d\equiv3\pmod4$. The compositum formula is our reading of the
definition; the code confirms its pieces: `HostRaw` carries `sqd` with `sqd ^ 2 = -(d : E)`, and the 2-adic part is
`Formalism.TwoAdicCyclotomicDecomposition.IsLayer n q d ζ a b`
(`Formalism/TameInertiaTowers/StatementField.lean:11`), the field $\mathbb Q(\zeta_{2^n},\sqrt{-q},\sqrt{-d})$ with
Galois group $\{\pm1\}^2\times(\mathbb Z/2^{n})^\times$ (`LayerGalois`). $E$ is CM because it contains
$\mathbb Q(\sqrt{-q})$ (`isCMField_of_isChiField`, which uses $q\equiv3\pmod4$). Its conductor satisfies
$\mathrm{cond}(E)\le2^{e+2}N_\psi qd$ (`conductor_bounds_of_isChiField`). On the consuming side the field is the
"host" of a `Frame` whose Galois group has order `ord` $=c\cdot2^e$ with $x^{2+8\varepsilon}\le$ `ord`
$\le2x^{2+8\varepsilon}$ (`fieldChi`, `RankVal`), so $[E:\mathbb Q]\asymp x^{2+8\varepsilon}$.

### 2.4 The auxiliary primes `WinPair`

A proposition about $(\varepsilon,Y,q,d)$, listed in 1.1. Consequences used later (`pairHyp`,
`CharacterBoxes/PairHyp.lean:24`, and `qdRows_kron_two` in `PairRows.lean:228`): $(-d/p)=1$ for every odd prime
$p\le Y^{\varepsilon/5}$ and for $p=2$ (because $-d\equiv9\pmod{16}$), and $(-d/q)=1$. So every prime up to
$Y^{\varepsilon/5}$, and $q$ itself, splits in $\mathbb Q(\sqrt{-d})$. The sizes make $q$ and $d$ enormous
($\log q\approx Y^{\varepsilon/5}$) but keep $\log\mathrm{cond}(E)\le2x^{\varepsilon/4}$, which is what lets a
polynomial in the conductor fit under $e^{x^\varepsilon/2}$ (3, step 5).

### 2.5 The constants

- $\varepsilon<1/52$: the global range of the scale parameter (`Scale.eps_lt` in
  `Formalism/LocalRingCardinality/DataParams₂.lean`). Nothing in this region needs 52.
- `PageN`: $2^{e}\in[x^{2+8\varepsilon},2x^{2+8\varepsilon}]$, the level of the 2-adic tower, matched to
  `RankVal`'s $n\in[x^{2+8\varepsilon},2x^{2+8\varepsilon}]$.
- $Ct=401$, so $t=\lfloor x^{401}\rfloor$ twists. On the consuming side the number of twists is `R.t`, and
  `eventually_rank_le_rpow_of_lt_one_div_fiftytwo` (`CharacterBoxes/EventuallyRankLeRpowOfLtOneDivFiftytwo.lean:5`)
  proves `R.t ≤ x^400` from `RankVal` ($r+t=8fr+4+\lceil x^{377}\rceil\cdot n_W$). `winPairs` rescales $x=kx'$ by a
  constant $k\ge1$ and uses $\lfloor (kx')^{400}\rfloor\le\lfloor x'^{401}\rfloor$ once $k^{400}\le x'$. So
  $401=400+1$ is slack for this rescaling.
- $J$: produced by the window theorem, $J=2^{R+2}(2C_KCt/\varepsilon)^R$ (`BConst.J`), where $R$ counts the
  possible exceptional twists (3, step 6).
- The bound $\sqrt{\exp(x^\varepsilon)}$: on the consuming side it is $\sqrt{s.b}$ with `Scale.b = exp(x^eps)`.

### 2.6 The window statements on the proof side

`Development/AutomorphicArithmetic/AutomorphicVarieties/PrimeSetBoundDataOfPrimitiveChar.lean`:

- `AbF` (in `StmtFields.lean:11`): an abelian field given by a modulus $m$ and a subgroup $H\le(\mathbb Z/m)^\times$.
  `AbF.ofChar ψ` is $K_\psi$; `AbF.cyc m` is $\mathbb Q(\zeta_m)$; `IsCompField M e q d E` is `IsChiField` with $K_\psi$
  replaced by $M$ (`isCompField_ofChar` proves they agree).
- `InRange J X Y` $:\iff X^{1/J}\le Y\wedge Y^2\le X$.
- `BaAt M ε e t q d x`: the 2-part bound `VVat 2 E (t x) (exp(x^(4ε/5)))` for every compositum field $E$.
- `BbAt`: for each odd $\ell$ in a finite set $B'$, the same bound for the $\ell$-cyclotomic layers $L_1/L_0$ of degree
  $\ell^{\lfloor\log_\ell R_\ell\rfloor+3}$ over an abelian base $L_0$.
- `BShape`, `ThmBab K Ct`: for all $M,B',L$ and $\varepsilon\in(0,1/52)$ there is $X_0$ such that for all admissible
  $e,t$, all $X\ge X_0$, all `PrimePair` $q,d$ with $\log(qd)\le X^{\varepsilon/(4J)}$, there is $Y$ with
  `InRange J X Y` and `BaAt ∧ BbAt` for all $x\in[Y,Y^2]$.
- `ThmHV K Ct`: the plus-part bound `VVplusLe E (t x) ((cond(E)·t x)^C + C·exp(x^(4ε/5)))` on the same windows,
  for $q,d$ larger than $2X^{Ct}+1$ and than a finite list of constants of $\psi$.
- `ThmBc Ct`, `ThmBcFree`: the minus-part bound `VVminusLe E t (minusBound C deg(M) [E:ℚ] cond(E) t)`, for all
  $e,t,q,d$, with no window, where

  $$\mathrm{minusBound}(C,o,n,N,t)=3nt^2\log(tN)+C\sum_{\ell\mid o,\ \ell\ne2}\ell\,n^2t^2\log(t\ell N)^2 .$$

- `JointWin Ct`: `BaAt ∧ HVAt` on a common window, for each $\psi$.

### 2.7 The Iwasawa-theoretic inputs

- `LemmaK CK` (`GeneratorCountTuples/LemmaK.lean:13`): for a totally complex $L$ containing $\mu_\ell$ ($\mu_4$ if
  $\ell=2$), $H^2(G_{L,S},\mathbb Z_\ell(k+1))$ is finite with
  $\log\#H^2\le\exp((2kn)^{C_K}\log(2|D_L|))$, $n=[L:\mathbb Q]$.
- `Tower.IsTower l L R` (`NumberFieldTowers/XTwApplyApply.lean:120`): $L$ totally complex, contains $\mu_\ell$
  ($\mu_4$), and the module `XP l L` (an Iwasawa module of the cyclotomic $\mathbb Z_\ell$-tower over $L$; its
  definition `XN` was not unfolded) is generated by at most $R$ elements over $\mathbb Z_\ell$.
- `ABound l R L₀` (`LayeredIsomorphisms/SecondBound.lean:19`): there are a finite extension $K/\mathbb Q_\ell$ and
  $R'\le R$ elements $s_1,\dots,s_{R'}\in K$ such that for every layer $L_1$ of degree $\ell^m$ over $L_0$ and every
  twist $k\ge1$: if $|s_i-k|_\ell\ge\ell^{-B}$ for all $i$, then
  $\operatorname{len}\text{Ш}^1(L_1,\mathbb Q_\ell/\mathbb Z_\ell(-k))\le R'(\max(m,j_0)+c+B)$, where $\ell^c$ is
  the largest power with $\mu_{\ell^c}\subset L_0$ and $j_0=\lfloor\log_\ell R\rfloor+3$. Plus `SecondBound`, which
  controls higher layers by the base and $H^2$ (`VLen`).
- `FerreroWashington` (`PublishedTheorems/FerreroWashington.lean:7`): for $K$ abelian over $\mathbb Q$ containing
  $\mu_\ell$ ($\mu_4$), the $\ell$-rank of the class group is bounded along the cyclotomic $\mathbb Z_\ell$-tower
  (the vanishing of the $\mu$-invariant). It is proved in the tree, `UpperTheory.V.FW.ferreroWashington`
  (`GaloisLibrary/FerreroWashingtonIndex/FerreroWashington.lean:104`); we did not read the proof.

### 2.8 The automorphic inputs

- `OpenImageCondition` (`TemperedProductOfSquareIntegrable.lean:207`): a structure with one field,
  `galoisRepOfPolarizedPairLit : RowT`. It is `Row0b` under another name; the name is misleading, there is no
  open-image condition in it. All 50 or so `..._of_open O` lemmas in the same file ignore `O` and are proved
  outright from theorems elsewhere in the tree (for example
  `bernstein_zelevinsky_finiteness_of_open O := PositivityTheory.Prw.bernsteinZelevinskyFiniteness_holds`).
- `LiteratureRankNHypothesis` (`LitAut.lean:59`): a record of four records: local representation theory of
  $\mathrm{GL}_n$ (`LitLocAlt`: Bernstein, Zelevinsky, Moy and Prasad, local converse theorem, Langlands
  classification), automorphic inputs (`LiteratureAutomorphyHypothesis`: rapid decay, Jacquet and Shalika, Clozel
  purity, global Artin reciprocity, the base-change statement `bc`, the Galois statement `gal : RowT`, and others),
  Galois cohomology (`LitCoh`: Poitou and Tate, local Tate duality, Euler characteristics, Greenberg and Wiles), and
  CM theory (`LiteratureCMHypothesis`). Only `bc` and `gal` come from the arguments of
  `automorphic_window_of_inputs`; every other field is a theorem of the tree.
- `IsBaseChangeN` (`BaseChangeIsobaricNOf.lean:21`): the properties listed in 1.4.
- `BcSpeh` (`Development/AbelianVarietyTheory/Definitions/NonGaloisDescent/IsUnitarisableTrivChar.lean:37`): the
  same situation, with the conclusion that the base change is $\boxplus_i\,\mathrm{Speh}(P_i,d_i)$ with $P_i$
  cuspidal on $\mathrm{GL}_{a_i}$ and $n=\sum d_ia_i$. This is the Arthur-parameter shape $\boxplus P_i[d_i]$, the
  same notation as the note's $\mu_j[t]$. `bcSpeh_of_baseChange` derives it from `BaseChangeIsobaricN` (through
  `BaseChangeBridge.main`) and the discrete spectrum of $\mathrm{GL}$ (Moeglin and Waldspurger, by name).
- `Chain μ e lam` (`.../UniformizerValuations/FrameA.lean:23`), `Frame0`, `RunFrame`, `GBound`, `GRead`: the data of
  the base-change proof, see 3, step 10.

## 3. The chain

Each step: claim; inputs; mechanism; file. "Classical" means the content is a known theorem (named), "specific"
means it is particular to this proof.

1. **`Row0b` gives `VWin`.** `vwin_of_row` (1.2) calls `automorphic_window_of_inputs O baseChangeN h`. Specific
   (pure plumbing). `VwinOfRow.lean`.

2. **Assembly of the literature records.** `automorphic_window_of_inputs` →
   `v_window_of_depth_zero_residual_bc_cm` → `UpperTheory.V.v_window_of_literal_automorphy_n hN` with
   `hN = ⟨local_inputs_from_literature O, automorphic_inputs_from_literature O bc gal,
   galois_cohomology_from_literature O, cm_abelian_inputs_from_literature O⟩`. Mechanism: record construction. Every
   field except `bc` and `gal` is a theorem. `TopMainZj.lean`, `TemperedProductOfSquareIntegrable.lean`.

3. **Reduction to counts.** `v_window_of_literal_automorphy_n` → `v_window_of_automorphy_csd_ss_mono_odd` →
   `vwin_of_hypotheses_H_E_alt (published_hypotheses_from_patching_alt hN descWeak)` → `HV.Core.of_four_alt hN hK h1 h2 h3 h5`
   with `hK : ∃ CK, LemmaK CK` (`lemmaK_litN_alt`), `CountI` (from Kato's Euler system `katoTwoW_of_printsH` and
   `automorphyUnramified_of_litN_of_gdEnd`), `CountII ∧ CountIII` (from `SymplecticFourImageDense`, proved by
   `sp4In0_alt`), `CountV` (from `ThmS6Core_s`). `WindowBoundOfLiteratureLevel.lean`, `HVCore.lean`.

4. **The three pieces.** `of_four_alt` obtains `ThmBab K 401` from `Win.thmBab_of_lemmaK` (Poitou and Tate,
   local finiteness, local Tate duality, Ferrero and Washington, `LemmaK`), `ThmBcFree` from
   `Odd.thmBcFree_of (ML.iv ...)`, and calls `vwin_of_counts`
   (`HeightAndVanishing/JointWinOfCounts.lean:30`), which proves `ThmHV` from the counts (`thmHV_of_counts`), then
   `JointWin 401` (`jointWin_of`: intersect the window of `ThmBab` with `ThmHV`), then
   `vwin_of_joint (JointWin 401) (ThmBc 401)`. Specific.

5. **Gluing the bounds.** `vwinAt_of_joint` (`CMFieldExponentialBounds/AdmissibleOfPageN.lean:41`). Take
   $t(x)=\lfloor x^{401}\rfloor$; `admissible_of_pageN` checks $2^{e(x)}\le x^4$ and $t(x)\le x^{401}$. From
   `WinPair` at scale $X^{1/J'}$ it derives `PrimePair` ($q,d$ prime, residues, coprime to $N_\psi$),
   $q,d>2X^{401}+1$, and $\log(qd)\le (X^{1/J'})^{\varepsilon/4}\le x^{\varepsilon/4}$ (`log_mul_le_rpow_of_winPair`,
   `eventually_winPair_gt_power`). For $x$ in the window and $E$ the field:
   - $\ell=2$: $\le e^{x^{4\varepsilon/5}}$ (`BaAt`);
   - $\ell$ odd, minus part: $\le\mathrm{minusBound}\le K e^{8x^{\varepsilon/4}}$, because
     $\log(\mathrm{cond}(E)\,t)\le2x^{\varepsilon/4}$ (`log_conductor_mul_height_le_of_pageN`,
     `minusBound_le_exp_of_log_le`);
   - $\ell$ odd, plus part: $\le(\mathrm{cond}(E)\,t)^C+Ce^{x^{4\varepsilon/5}}$ (`HVAt`).

   `vvle_of_parts` adds them (weight $\log2$ on the 2-part), and `error_terms_le_sqrt_exp_rpow` shows the total is
   at most $\sqrt{e^{x^\varepsilon}}$ for large $x$, since every term is $\exp(O(x^{4\varepsilon/5}))$ or
   $\exp(O(x^{\varepsilon/4}))$. Elementary.

6. **The window theorem `ThmBab`.** `Win.thmBab_of` (`LayeredIsomorphisms/ThmBabOf.lean`). Mechanism, in four parts.
   - *Bounded Iwasawa rank.* `Two.towerTwo` gives, for the 2-adic tower over a base field built from $M$, $q$, $d$
     (`base2 M q d`, with $\mathbb Q(\sqrt{-1})$, $\mathbb Q(\sqrt{-q})$, $\mathbb Q(\sqrt{-d})$ adjoined), a bound
     $R=4(g+6\deg M)$ on the number of generators of the Iwasawa module that does not depend on $q,d$. For odd
     $\ell$ (`towerFixed`) the bound depends on the fixed field only. Both rest on Ferrero and Washington. Why $R$ is
     uniform in $q,d$ was not traced (`baseRk`); our guess is that $q\equiv3\pmod8$ and $d\equiv7\pmod{16}$ make
     the primes above $q$ and $d$ finite in number along the 2-adic tower, so a Kida-type formula adds a bounded
     amount. Classical in substance (Iwasawa; Ferrero and Washington 1979).
   - *Exceptional twists.* `PropA.aBound_of_isTower` turns a generator bound into `ABound`: at most $R$ points
     $s_i\in K$ such that the cohomology of the twist $k$ is small unless $k$ is $\ell$-adically close to some
     $s_i$. Our reading: the $s_i$ are the zeros of the characteristic power series of the Iwasawa module, read as
     functions of the twist. Classical in substance (Iwasawa theory, Washington, *Introduction to Cyclotomic Fields*,
     ch. 13); the code's proof was not read.
   - *Each zero spoils at most one twist.* `near1` (`Near1.lean`): two distinct integers $a,b\in[1,Z]$ cannot both
     be within $\ell^{-\lfloor\log_\ell Z\rfloor}$ of the same $s$, because then $\ell^{\lfloor\log_\ell Z\rfloor+1}\mid a-b$.
     So `exc` produces a set of at most $R$ exceptional twists in $[1,Z]$, and every other $k\le Z$ has
     $\operatorname{len}\le R(\max(m,j_0)+c+\log_\ell Z)$, logarithmic in $Z$.
   - *Pigeonhole over scales.* `window1` (`Window1.lean`), by induction on $R$: for $B\ge1$, $U>0$ and a set $T$ of
     at most $R$ reals there is $y\ge U/(2^{R+2}B^R)$ with $2y\le U$ such that no $a\in T$ satisfies
     $a\le u<Ba$ for some $u\in[y,2y]$. Applied with $T=\{\log k/Ct\}$ and $B=Ct/\eta$ (`window`, `Window.lean`) it
     gives $Y=e^y$ with $X^{1/J}\le Y$, $Y^2\le X$ and, for all $x\in[Y,Y^2]$, `Good η Ct Exc x`: every exceptional
     $k\le x^{Ct}$ is in fact $\le x^{\eta}$, $\eta=\varepsilon/(2C_K)$. The induction removes one exceptional point
     per step, which costs a factor $2B$ in scale; hence $J=2^{R+2}(2C_KCt/\varepsilon)^R$. Elementary.

   With these, `partA` (2-part) and `partB` (odd $\ell$ in $B'$) bound the sum over $k<t$: unexceptional twists by
   $t\cdot R(\dots+\log Z)$, exceptional twists $k\le x^\eta$ by `LemmaK` applied to a layer of size controlled by
   $k$. The result is $\le e^{x^{4\varepsilon/5}}$ (`point2`, `final`). Specific in its assembly.

7. **The plus part `ThmHV`.** `HV.thmHV` (`HeightAndVanishing/ThmHV.lean:6`) from `PointHV`
   (`LayerLe.lean:39`): for every $\psi$ there are $C$ and primes $r_1,r_2$ such that for all large $q,d$ and every
   $t$, `VVplusLe E t ((N t)^C + C·B)` whenever the layers at the primes of `Bchi ψ` satisfy `VVat ... B`.
   `PointHV` is proved from counts over $(\ell,k,\xi)$, with $\xi$ running over even characters of $\mathrm{Gal}(E/\mathbb Q)$
   with values in a finite extension $O$ of $\mathbb Z_\ell$ (`Host.X`), and `Vlen` the length of $\text{Ш}$ for
   the Galois character $\xi^{-1}\chi_{\mathrm{cyc}}^{-k}$ over $\mathbb Q$ (`Chr.VS`,
   `CharacterLevelBounds/ShaFamMono.lean:32`). Our reading: Shapiro's lemma splits the plus part over $E$ into
   these components over $\mathbb Q$. The cases (`DirichletPrimeToLPartMulLPowerPart.lean:208` to `219`), with
   `Bchi ψ` the odd primes dividing $\mathrm{ord}(\psi)N_\psi p_K h^*p_1$ together with 3:
   - Case I: $\ell\notin B_\chi$, $(\ell-1)\nmid2k$. Bound $(Nt)^C$ through Kato's Euler system (`KatoTwoW`:
     vanishing of a Bloch and Kato Selmer group for newforms of weight $2k+1$) and automorphy.
   - Case Z: $\xi=1$, $(\ell-1)\mid2k$, $\ell\notin B_\chi$: `PropZ` says the group is 0 for $\ell\ge5$ and even
     $k\ge2$.
   - Cases II, III: $(\ell-1)\mid2k$ or $\ell\in B_\chi$, with conditions on $\xi$: through
     `SymplecticFourImageDense`, a statement that certain $\mathrm{GSp}_4$-type Galois representations are
     automorphic with large image.
   - Cases IV, V, Vs: $\ell\in B_\chi$; V is $k=1$, through a unitary lift; Vs uses `LemmaK`.

   This is where `Row0b` is used: `P.litN.aut.gal` is applied in about a dozen files under
   `AutomorphicVarieties/` (for example `AutomorphicForms/TemperedLocalComponents/ExistenceOfGaloisRepresentationsOfHyp.lean:50`,
   `GaloisLibrary/CrystallineBaseChange/ExistsPrimeNotMem.lean:107`, `ModularityArgument/SemisimpleLevels/LevelKO.lean:106`)
   to attach Galois representations to regular algebraic polarized cuspidal representations, and `BaseChangeIsobaricN`
   is used through `bcSpeh_of_baseChange (BaseChangeBridge.main H.litN.aut.bc ...)` (for example
   `AutomorphicForms/TemperedLocalComponents/GalUnitary.lean:48`). Specific in assembly, classical in its tools
   (Ribet-type and Euler-system bounds on Selmer groups). Mostly not read: see section 7.

8. **The minus part `ThmBcFree`.** `Odd.thmBcFree_of (h : PsiBound) := thmBc_of deg stickBound (primeBound_of h)`
   (`OddResidueBounds/ThmBcOfPsiBound.lean:295`), with `PsiBound` from Poitou and Tate and unramified orthogonality
   (`ML.iv`). Our reading from the names: Stickelberger annihilation bounds the minus part by generalized Bernoulli
   numbers, polynomially in degree, conductor, and $t$. Classical in substance; not read.

9. **`LemmaK`.** `ZK.lemmaK_litN_alt` → `ZK.lemmaK` (`ModularityArgument/ClassCounting/LemmaKOfLitN.lean:28`), a
   chain of about twenty named steps (`sChain`, `sPrism`, ..., `sFinal`). Not read.

10. **Base change.** `baseChangeN := baseChangeN_of candFin`
    (`Foundations/BaseChangeIdentities/DefiniteNHolds.lean:5`), `baseChangeN_of hCF := bci_of (frameEx_of_fin uSide hCF) frameBound frameRead`
    (`FillPre.lean:13`), and `bci_of` (`SatakeExponents/BciOf.lean:22`) feeds `fieldN_of_run (runFin_chain ...)`.
    The skeleton is visible in `BaseChangeIsobaricNOf.lean`: `RunSplit` (at split places the local component is
    right), `RunInert` (at inert unramified places the Satake parameters match through `bcParam`), and `Rigid`
    (two weak base changes agree everywhere, a strong multiplicity one statement) combine in `core_of` and
    `baseChangeIsobaricN_of`. Our reading of the "frames": `Chain.eq` is a trace identity
    $z\cdot\mathrm{geom}_U(f)=\sum_ic_i\,\mathrm{ell}(\phi_1^{(a_i)},\phi_2^{(a_i)})$ between the geometric side for
    $U(n)$ with test function $f$ and elliptic terms on $\mathrm{GL}_{a}\times\mathrm{GL}_{n-a}$ with matching test
    functions twisted by a Hecke character $\mu$ (`Match`), so the proof is a comparison of trace formulas;
    `FrameEx` asserts that the needed families of local data exist; `FrameBound` (`GBound`) is a growth bound on
    traces of $k$-th powers of Hecke operators, the usual way to separate eigenvalues; `FrameRead` (`GRead`)
    reads a Hecke eigencharacter off as a character of a commutative $C^*$-algebra (Gelfand). Classical in
    substance (base change for unitary groups via the trace formula). Not followed in detail.

11. **Consumption upward.** `zero_free_all_of_green_v_win hG hV h` (`ThetaPairLifts/ThirdPlaceSeries/TopPlug.lean:12`)
    is `zeroFreeAll_of_topG (la := 3/2) ... (fun ψ => supplyChi ψ (hV ψ))`, and `every_character_of_green_v_win` adds
    `imprimitive`. `plugWin` in `CharacterBoxes/EveryCharacter.lean:8` is the same with `Hyps` in place of `HypsAlt`.
    These are the only consumers of `VWin`. See 4.4.

## 4. Answers to the four assigned questions

### 4.1 What `VWin` states, and the window

Section 1.1 gives the inequality. The roles: $q$ and $d$ are two auxiliary primes, $e=e(x)$ is the level of the
2-adic cyclotomic tower used ($2^e\approx x^{2+8\varepsilon}$), $t=\lfloor x^{401}\rfloor$ is the number of Tate
twists covered, and $\psi$ fixes the abelian field $K_\psi$ inside $E$.

The window $[Y,Y^2]$ with $X^{1/J}\le Y\le X^{1/2}$ is a range of scales on which the bound holds for every $x$. It
is needed because the bound fails, or is not proved, at finitely many exceptional twists $k$ (at most $R$, from the
Iwasawa zeros); a scale $x$ is good when no exceptional twist lies in $(x^{\eta},x^{401}]$, and the pigeonhole
`window1` finds a whole window of good scales between $X^{1/J}$ and $X$. The analytic side only needs good windows
arbitrarily far out: `HostExW (3/2)` asks for a set `Win` of scales that contains windows $[Z,Z^{3/2}]$ beyond any
point (`GlobalTheory.EX.Scales`, `PrimeDiscriminants/Scales.lean:9`), and `winPairs` converts `VWin`'s windows
$[Y,Y^2]$ into such windows after rescaling by a constant.

Relation to the note's steps 4 to 6: none directly. Weil's functional $W$, indicator test functions, and
$\mathbf 1_{(0,1]}+X^\eta\mathbf 1_{(0,1/X]}$ do not occur in this region. The windows of `VWin` feed the windows of
`ChebyshevInequalityOnWindows` (reader 1), where an upper bound on a smoothed prime sum on windows gives
zero-freeness. So the window is the domain of $x$ on which the arithmetic residue is controlled, not a support of a
test function. Relation to step 8: the chain length lives in the same scale record. `RankVal`
(`Development/AbelianVarietyTheory/Definitions/GlobalTwisting/PairRowIffQdRows.lean:28`) fixes
$m\in[\sqrt{x\delta_1},2\sqrt{x\delta_1}]$ with $\delta_1=x^{-\varepsilon/8}$, so $m\approx x^{1/2-\varepsilon/16}$:
this is the note's $m\approx\sqrt X$ (with $x$ the scale). In the same record $n$ (the order of the host's Galois group) is
$\approx x^{2+8\varepsilon}$ and $k\approx x^{9/2+10\varepsilon}$, and the number of twists $t$ (at most $x^{400}$) is
what `VWin`'s 401 covers. That the record `Ranks` describes the theta chain is suggested by `sigW j`, `rankY j`,
`N j` indexed by the chain step, but was not checked (reader 2 or 3).

### 4.2 How `VWin` is proved

Section 3, steps 1 to 10. In one line: `VWin` = (2-part and small-layer parts on a pigeonholed window, from bounded
Iwasawa rank and Ferrero and Washington) + (minus part everywhere, from Stickelberger) + (plus part, from Euler
systems and automorphy). Base change is from the unitary group $U(n)$ attached to a CM field $E/E^+$ to
$\mathrm{GL}_n$ over $E$, and "isobaric" means the image is an isobaric sum
$V_1\boxplus\dots\boxplus V_c$ of discrete (Speh-type) representations, refined in `BcSpeh` to
$\boxplus_i P_i[d_i]$. The note's $\pi\mapsto\pi\boxplus\mu_j[t]$ is exactly this shape for the theta lift of
$\pi$; in this region, however, base change is used as a tool inside automorphy arguments, and the theta chain itself
does not appear. `Row0b` enters only through `LiteratureAutomorphyHypothesis.gal`, used to attach Galois
representations in the plus-part arguments (step 7). `OpenImageCondition` contributes nothing beyond `Row0b`.

### 4.3 The rest of `CharacterBoxes`, and the auxiliary data

The 37 files (2,935 lines) split into three groups.

*Reader 1's endgame:* `HalfPlane`, `EveryCharacter`, `Imprimitive`, `MainConclusion`, `ClaimStrip`,
`RiemannHypothesisOfEveryCharacter`, `ZeroFreeAllOfTopG`.

*Supplying a host for each $\psi$ (this region):*

- `ExistsPageN.lean`: the definitions of 1.1 and `exists_pageN`.
- `PairGood.lean`: `PairGood M ε Y X q d` is `WinPair` plus: $\gcd(M,qd)=1$; for every character $\xi$ mod $M$ and
  $(i,j)\ne(0,0)$, the primitive character $\chi$ inducing $\xi\cdot(\cdot/q)^i(\cdot/d)^j$ satisfies
  $|g_\chi(y)|\le y^{1/2+\varepsilon/2}$ for $y\in[Y,X]$ and $|L'/L(1,\chi)|\le4\log y$ (`An.gChi` is a twisted
  smoothed prime sum plus $y\,L'/L(1,\chi)$; we did not unfold `sumLamChi`); and for every real primitive $\rho$ of
  conductor dividing $8M$, the twists $\rho(\cdot/q)^i(\cdot/d)^j$ have no zero with $\Re s>1-1/400$,
  $|\Im s|\le\mathrm{height}(M,\varepsilon,Y,j)$ (`ZeroBox`). `PairEx` asserts such $q,d$ exist for all large $Y$ with
  $X=Y^A$; it is proved as `QH.pairEx` (`Development/AutomorphicArithmetic/MeanSquareBounds/pairEx.lean:112`) from
  `QH.pair_exists`. Our reading of the folder name and statement: most primes in the allowed ranges satisfy these
  bounds by a mean-square (large-sieve type) argument, and one good pair is picked.
- `PairHyp.lean`: `WinPair` implies `HostHyp q d` (`q,d` prime, $q\equiv3\ (8)$, $d\equiv7\ (16)$,
  $(-d/q)=1$), $(-d/p)=1$ for odd $p\le Y^{\varepsilon/5}$, and reciprocity identities.
- `WinPairs.lean`: `winPairs` turns `VWinAt ψ 401` and `PairEx` into `WinDatum`s on windows $[Z,Z^{3/2}]$.
- `FieldChi.lean` (`fieldChi`), with `OrdAny`, `KerChiAny`, `TwistAny`: for every large $e$ and every admissible
  $q,d$, build a `Frame` $\varphi$ (Galois group of order $c\cdot2^e$) and a host `HostAx` whose field is the
  $\psi$-field (`KerChi`), and prove `TwistForm`: every character of $\mathrm{Gal}(E/\mathbb Q)$ trivial on the
  2-adic factor is $\xi\cdot(\cdot/q)^i(\cdot/d)^j$ with $\xi\in\langle\psi\rangle$. These are the "Hecke
  characters" of the construction: Dirichlet characters, viewed as characters of the Galois group of the host.
- `IsChiField.lean`: `KerChi` implies `IsChiField`.
- `BoundedTw.lean`, `RealBox.lean`, `RealSplit.lean`, `ThinChoice.lean`, `SmallestPrimePolynomialBound.lean`
  (`hostQ`, choosing the level prime $q_0\equiv1\bmod QS\cdot q\cdot d$ of polynomial size): analytic bounds for the
  host's characters, from `PairGood`.
- `PairRows.lean` (`pairRows`): from `PairGood` and the window, the row conditions `PairRow`, `QDq`, `Boxq`, and
  $q,d>4tr+1$.
- `HostOfField.lean`, `SupplyChi.lean`: `supplyOfAdm` and `supplyChi` package all this into `HostExW (3/2) (GChi ψ).req`,
  using `hostOfField` (`UpperTheory.T3.hostOfFieldOf`, fed by `shortNorm`, primes that are norms from an imaginary
  quadratic field in short intervals, and `smallOne`, primes in progressions) for the remaining level primes
  `pde`, `pde'`, `g 0`, `g 1` of `HostGood`.

*Proving `TopG` (reader 1 and 2):* `DesWin` (`topDesWin`: `HypV` feeds `divinN_of_hypV`, which gives the
divisibility statement `DIVinN`), `DesignS`, `ShapeWin` (`shapeWin : Green → TopShape ... TopG`), `KitS`, `HostWW`,
`ExS`, `ClassSel`, `ObjCTrue`, `DivinNOfHypV`.

Auxiliary data and the note's steps 11 and 19. The tower is here: the field uses the $e$-th layer of the cyclotomic
$\mathbb Z_2$-tower with $2^e\approx x^{2+8\varepsilon}$, and the odd primes of `Bchi ψ` use $\ell$-cyclotomic layers.
The pigeonhole is here too (`window1` over scales; and Iwasawa's structure theory over the layers). So the choice of
tower in this region is the note's step 11 as we read it. Behrend's sets do not enter the choice of $q$, $d$, $e$, or
the window: `Formalism/BehrendSets` is not in the import closure of `CharacterBoxes/SupplyChi.lean`, and no declaration
on the spine of `VWin` that we read cites it. (`BehrendSets` is in the import closure of `VwinOfRow`, but that closure
holds 157,898 modules and says nothing about use.) Step 19 belongs to reader 3's `TameInertiaTowers` and `BehrendSets`.

### 4.4 The interface upward (for reader 1)

`VWin` is consumed only as `fun ψ => supplyChi ψ (hV ψ)`, giving for each $\psi$

```lean
HostExW (3 / 2) (GChi ψ).req
-- GChi ψ := fun s _ H TT t => EAtH (Level.cyc ψ) H.toHostRaw TT s.x s.eps 4 ∧ VVle H.E t (Real.sqrt s.b)
```

which is the hypothesis `hS` of `zeroFreeAll_of_topG (la := 3/2)`. Unfolded (`HostExW`,
`Development/AbelianVarietyTheory/Definitions/GlobalTwisting/ThinScalesIffHostBound.lean:120`): for every
$\varepsilon\in(0,1/52)$ there are constants and a set of scales containing arbitrarily far windows $[Z,Z^{3/2}]$
such that every scale $x$ in it carries ranks $R$ with `RankVal` (so $m\approx\sqrt x$, $n\approx x^{2+8\varepsilon}$),
a host $H$ with field $H.E=E_{\psi,e,q,d}$ satisfying `HostGood`, and (i) analytic bounds `EAtH` for the characters of
$\mathrm{Gal}(H.E/\mathbb Q)$, and (ii) `VVle H.E R.t (sqrt(exp(x^ε)))`: the cohomology bound of 1.1 with
$t=R.t\le x^{400}$ twists. Part (ii) is what `VWin` supplies; part (i) comes from `PairGood`. Downstream,
`hypV_of_cls` extracts (ii) as `HypV`, and `vvRecord` (`CharacterBoxes/DivinNOfHypV.lean:17`) turns it into
`ShaFinOdd D ∧ Summable (vvTerm D) ∧ ∑' l, vvTerm D l ≤ b`, which `divinN_at` and the "killing conditions"
(`GlobalTheory.NLink.exists_setup_large`, `localBoundZeroAtLargePrimes_of_congruenceBound`) consume. So what is handed
over is: on good windows, the classes in $H^1(\mathfrak o_E[1/\ell],\mathbb Q_\ell/\mathbb Z_\ell(-k))$ that are
locally trivial above $\ell$ are few, in total $\log$-size at most $\tfrac12x^\varepsilon$, over all $\ell$ and all
$k<x^{400}$.

## 5. Against the note

| Note step | Declarations | How the code differs | Status |
| --- | --- | --- | --- |
| 17: classes in $H^1(\mathfrak o_E[1/\ell],\mathbb Q_\ell/\mathbb Z_\ell(-e))$ not killed by twisting; weakening of Vandiver | `VWin`, `VVle`, `Sha`, `ShaPlus`/`ShaMinus`, `ThmHV`, `ThmBc`, `vvRecord`, `ShaFinOdd` | The code bounds the locally trivial part $\text{Ш}^1$, all $\ell$ and all twists $k<x^{401}$ at once, by $e^{x^\varepsilon/2}$, rather than proving vanishing. The plus/minus split under complex conjugation is the Vandiver/Stickelberger split. | located |
| 11: Iwasawa tower by analogy with $\mathbb F_{q^n}/\mathbb F_q$ | `IsChiField` (layer $\mathbb Q(\zeta_{2^{e+2}})^+$), `PageN`, `IsLayer`, `ABound`, `Tower.IsTower`, `window1` | Tower is the cyclotomic $\mathbb Z_2$-tower (and $\mathbb Z_\ell$-towers for $\ell\in B_\chi$), level $2^e\approx x^{2+8\varepsilon}$. The pigeonhole is over scales and over Iwasawa zeros. | located (our reading of the analogy) |
| 19: precise choice of tower using Behrend | none in this region | `WinPair` and `PairGood` choose $q,d$ by congruences and mean-square bounds; no Behrend. | not in region (reader 3) |
| 8: $U(X_0)\to\dots\to U(X_m)$, $\pi\mapsto\pi\boxplus\mu_j[t]$, $m\approx\sqrt X$ | `RankVal` ($m\approx x^{1/2-\varepsilon/16}$), `BcSpeh`, `IsBaseChangeN` | The base-change shape is stated and proved, but used here only inside automorphy lifting. | partial |
| 4 to 6: $W(\mathbf 1_S)\ge0$; two-piece test function | none | Window here is a set of scales, not a test function. | not in region (reader 1) |
| 15: integral structure across Hecke characters | possibly `Host.X` (sum over characters $\xi$ of $\mathrm{Gal}(E/\mathbb Q)$), `TwistForm` | Not established. | unclear |

Substantial content in the code that the note does not mention: Ferrero and Washington and bounded Iwasawa rank;
the exceptional-twist pigeonhole; Stickelberger for the minus part; Kato's Euler system and $\mathrm{GSp}_4$
automorphy with large image for the plus part; Poitou and Tate duality; a trace-formula proof of base change from
unitary groups; and the auxiliary primes $q\equiv3\ (8)$, $d\equiv7\ (16)$ with $d+1$ divisible by every small odd
prime and with RH-quality bounds for the twisted prime sums of $(\cdot/q)$, $(\cdot/d)$ on $[Y,Y^A]$.

## 6. In plain terms

Over the integers, the proof needs a count that is too small to be a coincidence: an integrality or divisibility
statement that plays the role of vanishing to high order. Such statements live inside number fields, and they can be
spoiled by an obstruction from Galois cohomology. For a number field $E$, a prime $\ell$, and a twist $k$, the
obstruction is the group of classes in $H^1(\mathfrak o_E[1/\ell],\mathbb Q_\ell/\mathbb Z_\ell(-k))$ that look trivial
at every place above $\ell$. When $E=\mathbb Q(\zeta_p)^+$ and $k$ is small this group is tied to the $p$-part of the
class group, and Vandiver's conjecture says that its "plus" part vanishes. Nobody can prove that. The proof asks for
far less: that, for the specific fields it uses, these groups are small in total.

The fields are explicit. Start with a primitive character $\psi$. Take two very large auxiliary primes
$q\equiv3\pmod8$ and $d\equiv7\pmod{16}$, chosen so that every small prime splits in $\mathbb Q(\sqrt{-d})$ and the
twisted prime sums for $(\cdot/q)$ and $(\cdot/d)$ behave as RH predicts on a long range. Take the $e$-th real layer
of the 2-power cyclotomic tower, with $2^e\approx x^{2+8\varepsilon}$. The field $E$ is the compositum of that layer,
the field of $\psi$, $\mathbb Q(\sqrt{-q})$, and $\mathbb Q(\sqrt{-d})$. It is abelian and CM.

`VWin` says: on a window of scales $x\in[Y,Y^2]$, the product of the orders of all these obstruction groups, over every
prime $\ell$ and every twist $k<x^{401}$, is at most $e^{x^\varepsilon/2}$. That is tiny compared with the degree
$x^{2+8\varepsilon}$ times the number of twists $x^{401}$, so on average almost every group is trivial.

Why a window, and not every $x$? Iwasawa theory says that as one climbs a cyclotomic tower, the cohomology for twist
$k$ is governed by a module of bounded rank, and it is large only when $k$ is $\ell$-adically close to one of at most
$R$ special numbers $s_i$. Each $s_i$ can be close to only one integer in a range $[1,Z]$, because two such integers
would differ by a multiple of a large power of $\ell$. So at most $R$ twists are exceptional. A scale $x$ is good if
no exceptional twist lies in $(x^\eta,x^{401}]$. The smallest example of the pigeonhole: with one exceptional value
$a$ (in log scale) and a log-scale range $[0,U]$, either $a$ is far below $U/(2B)$, and then $[U/2,U]$ is a good
window, or it is not, and then everything below $U/(2B)$ is clear of it. Each exceptional value costs a factor $2B$ in
the scale, so $R$ of them push the window down to $X^{1/J}$ with $J=2^{R+2}(2C_KCt/\varepsilon)^R$, a constant.

The proof then has three parts. The 2-part and a few bad odd primes are handled by this Iwasawa argument, with
Ferrero and Washington supplying the bounded rank (and with $R$ independent of the huge primes $q,d$). For odd $\ell$
the group splits under complex conjugation. The minus part is bounded by Stickelberger's theorem, polynomially in the
degree, the conductor, and the number of twists. The plus part, Vandiver's side, is bounded by modern tools: Kato's
Euler system for generic twists, and automorphy of Galois representations (with large image, of $\mathrm{GSp}_4$
type) for the twists where $\ell-1$ divides $2k$. Those automorphy arguments need two inputs that the top-level
theorem lists: Galois representations attached to polarized regular algebraic cuspidal representations over CM fields
(`Row0b`), and base change from definite unitary groups to $\mathrm{GL}_n$ in isobaric form
(`BaseChangeIsobaricN`, proved in the tree by a trace-formula comparison).

What fails without each hypothesis. Without the window, the exceptional twists could make the product of orders as
large as $\exp$ of a power of $x$ much larger than $x^\varepsilon$. Without bounded Iwasawa rank (Ferrero and
Washington) there would be no bound on the number of exceptional twists, so no $J$. Without $R$ being uniform in
$q,d$, the constant $J$ would depend on the auxiliary primes, which are chosen after $J$. Without the size conditions
on $q,d$, the conductor of $E$ could exceed $\exp(x^{\varepsilon/4})$, and the polynomial bounds for the plus and
minus parts would no longer fit under $e^{x^\varepsilon/2}$. Without `Row0b` and base change, the plus part would
have no bound at all.

## 7. For the explainer

A chapter on this region must contain:

1. The group $\text{Ш}^1(E,\mathbb Q_\ell/\mathbb Z_\ell(-k))$, defined from $H^1(\mathfrak o_E[1/\ell],\cdot)$, with
   the example $E=\mathbb Q(\zeta_p)$, $k=0$ or small, linking it to $p$-parts of class groups, and Vandiver's
   conjecture as the statement that the plus part vanishes. Pointer: Washington, ch. 6 and 8 (Stickelberger,
   Vandiver), ch. 13 (Iwasawa theory). We have not checked these locations against the book.
2. The field $E_{\psi,e,q,d}$ as a compositum, with its Galois group $(\mathbb Z/N)^\times/H$ and why it is CM.
3. The statement of `VWin` in the product form of 1.1, with the meaning of each parameter.
4. The window: Iwasawa's structure theorem (pointer), the "one zero spoils one twist" lemma (full proof, it is three
   lines), and the pigeonhole `window1` (full proof by induction).
5. The three-part decomposition (2-part, minus, plus) and the arithmetic of $e^{x^{4\varepsilon/5}}$,
   $e^{8x^{\varepsilon/4}}$, and $(\mathrm{cond}\cdot t)^C$ against $e^{x^\varepsilon/2}$.
6. Pointers only: Ferrero and Washington, Stickelberger, Kato's Euler system, Poitou and Tate, base change for unitary
   groups, the existence of Galois representations for polarized regular algebraic cuspidal representations.
7. The interface: what `HostExW (3/2)` asks for and how `VWin` fills half of it.

Interactive figures:

1. *Exceptional twists on a log-log line.* Points $\log k$ for up to $R$ exceptional twists; a draggable window
   $[\log Y,2\log Y]$ shaded green where every $x$ in it is good (no point in $(\eta\log x, Ct\log x]$); the reader
   drags points and watches the window `window1` finds jump down by a factor $2B$ per point.
2. *$\ell$-adic closeness.* Integers $1..Z$ arranged on the $\ell$-adic tree (digits base $\ell$); a draggable
   $s\in\mathbb Z_\ell$; highlight the integers within $\ell^{-\lfloor\log_\ell Z\rfloor}$; at most one lights up.
3. *Building $E$.* Sliders for $e$, the order of $\psi$, and toggles for $\sqrt{-q}$, $\sqrt{-d}$; the lattice of
   subfields of $\mathbb Q(\zeta_N)$ with $E$ highlighted, degree and conductor displayed against
   $x^{2+8\varepsilon}$ and $e^{x^{\varepsilon/4}}$.
4. *Budget bar.* A stacked bar of $\log$ of the three contributions (2-part, minus, plus) against the budget
   $x^\varepsilon/2$ as $x$ grows, showing where each becomes negligible.

Result cards: `VWin` (statement 1.1); `window1` (the pigeonhole lemma); `near1` (one zero, one twist);
`vwinAt_of_joint` (three-part gluing); `BaseChangeIsobaricN` (statement only, with pointer).

## 8. Not understood

- **The plus-part proofs** (`CountI`, `CountII`, `CountIII`, `CountV`, `CountVs`, `CountIV`, `CountZ`, `PointHV`,
  `KatoTwoW`, `SymplecticFourImageDense`, `ThmS6Core_s`, `published_hypotheses_from_patching_alt`, `descWeak`), under
  `Development/AutomorphicArithmetic/AutomorphicVarieties/HeightAndVanishing/` and `.../ModularityArgument/`. We read
  the statements of the cases, not the proofs. In particular we do not know exactly which Galois representations
  `Row0b` is applied to (the call sites take a CM field $K$, a regular $\pi$ and a polarization), nor why
  $\mathrm{GSp}_4$ appears.
- **`LemmaK`** and its twenty-step proof (`ClassCounting/LemmaKOfLitN.lean`).
- **`PropA.aBound_of_isTower`**: how the generator bound becomes the $s_i$; our identification with zeros of the
  characteristic power series is a reading, not checked. `Tower.XN` (the Iwasawa module) was not unfolded.
- **`Two.baseRk`**: why the 2-adic Iwasawa rank of the base field with $\sqrt{-q},\sqrt{-d}$ adjoined is bounded
  independently of $q,d$.
- **`Odd.thmBcFree_of`, `stickBound`, `PsiBound`**: the minus-part argument; "Stickelberger" is inferred from the name.
- **Base change** (`bci_of`, `FrameEx`, `FrameBound`, `FrameRead`, `candFin`, the 2,437 lines of `FrameMatching`):
  only the skeleton (`RunSplit`, `RunInert`, `Rigid`, `core_of`) and the shapes of `Chain.eq`, `GBound`, `GRead` were
  read. The trace-formula reading in step 10 is ours. `UA E n` and `IsAutRepU` were not unfolded, so "definite
  unitary group" rests on the name `BaseChangeDefiniteUnitary` in `bcSpeh_of_baseChange`.
- **`QH.pairEx`**: the existence of good pairs $q,d$; the mean-square reading is from the folder name and the shape of
  `pair_exists`. `An.sumLamChi` was not unfolded.
- **`Ranks`** as the theta-chain record: $m\approx\sqrt x$ is read from `RankVal`, but that $m$ is the number of lifts
  was not verified here.
- **`Formalism/SizeWindowBrackets` and `Formalism/LocalToGlobal`** (item 3 of the reading plan) were not read; nothing
  on the `VWin` spine pointed to them.

Three biggest doubts: (1) whether the plus-part bound is really a Vandiver-type statement in the note's sense, or
something weaker that only shares the cohomology groups; (2) whether the exceptional twists are the Iwasawa zeros, as
we read `ABound`; (3) whether the base change proved here (unitary to $\mathrm{GL}$, used inside automorphy) is the
same statement the theta chain of step 8 needs, or a separate use of the same theorem.
