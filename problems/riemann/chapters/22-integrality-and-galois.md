---
id: integrality-and-galois
title: "Paying for the chain: integrality, Galois representations, and the count that is bounded"
part: 4
summary: After this chapter you can say what a Galois representation attached to an automorphic form is, state the theorem Row0b that the formal proof re-proves and the five steps by which it does so, and follow how a weighted count of inert prime powers, bounded by the chain of theta lifts, becomes the one-sided bound on G_r that the endgame consumes.
needs: [multiplicity-from-lifts, landau-endgame]
---

::: plain
Over a finite field, Frobenius ties each point of a curve to an equation, and the count of points is bounded by an auxiliary function. Over the integers the proof needs two substitutes. The first is a Galois representation, which lets every prime act as a Frobenius on a vector space built from an automorphic form, and the proof builds these representations from scratch. The second is a count of primes of a special kind, which the chain of theta lifts bounds from above, and which a finite version of the explicit formula turns into the bound on prime sums that rules out zeros.
:::

In Stepanov's proof, as [[stepanov]] gave it, an auxiliary function that vanishes to order $m$ at every rational point is played against a degree budget, so the count of rational points is bounded from above ([[t-st-upper]]), twisted counts over a Galois cover give the bound from below ([[t-st-lower]]), and Frobenius makes "rational point" an equation. Chapters [[definite-forms]] and [[multiplicity-from-lifts]] built the integer substitute for the auxiliary function, a chain of totally definite Hermitian spaces $X_0,\dots,X_m$ of ranks $N_0+j(c+1)$, with $m$ about $\sqrt x$ and no inclusion of one space in the next in the code's record `Spaces`, and [[landau-endgame]] showed what the chain must deliver, an upper bound $G_r(x)\le x^{1/2+9\varepsilon}$ on windows of scales. In our reading, the rational points become prime powers inert in an auxiliary abelian field, counted with the ramp weight of the smoothed sum, the vanishing to order $m$ becomes divisibility of the $m$-fold lift, the degree budget becomes an inequality between slopes of lattices, the Galois trick becomes orthogonality of characters on a finite abelian group, and Frobenius returns through the Galois representations attached to automorphic forms. The first half of the chapter explains those representations and the theorem `Row0b` that supplies them, and the second half follows the count from the chain to $G_r$.

## Frobenius comes back: Galois representations {#ig-galois}

The integers have no Frobenius, as [[st-used]] recorded: the only ring endomorphism of $\ZZ$ is the identity. A prime $p$ does have a Frobenius in a different sense, as an element of a Galois group, and a Galois representation is the device that lets that element act on a vector space, where it has eigenvalues and a trace.

::: definition {#d-ig-galrep title="Galois representation"}
Let $K$ be a number field with algebraic closure $\overline K$, and let $\ell$ be a prime. An $\ell$-adic Galois representation of $K$ of dimension $n$ is a continuous homomorphism $\varrho\colon\Gal(\overline K/K)\to\GL_n(\overline{\QQ}_\ell)$. It is unramified at a prime $\mathfrak p$ of $K$ when it is trivial on the inertia groups above $\mathfrak p$. Then the Frobenius elements above $\mathfrak p$, which form one conjugacy class $\Frob_{\mathfrak p}$, have a well-defined characteristic polynomial $\det(X-\varrho(\Frob_{\mathfrak p}))$. It is a homomorphism into matrices, not a number attached to a prime and not an automorphic form, although the point of this section is that the two kinds of object determine each other's numbers.
:::

The smallest example has dimension one. $\Gal(\overline\QQ/\QQ)$ acts on the $\ell^n$-th roots of unity by $\zeta\mapsto\zeta^{c}$ for a unit $c$ modulo $\ell^n$, and letting $n$ grow gives the cyclotomic character $\chi_{\mathrm{cyc}}\colon\Gal(\overline\QQ/\QQ)\to\ZZ_\ell^\times$. For $p\ne\ell$ the Frobenius at $p$ raises these roots of unity to the power $p$, since it does so modulo a prime above $p$ and they stay distinct modulo $p$. So
$$
\chi_{\mathrm{cyc}}(\Frob_p)=p .
$$ {#eq-ig-cyc}
For $\ell=5$ and $p=2$, Frobenius sends a primitive fifth root of unity $\zeta$ to $\zeta^2$, then $\zeta^4$, $\zeta^3$, and back to $\zeta$, so it has order $4$, the order of $2$ in $(\ZZ/5\ZZ)^\times$, and its trace is the prime itself.

The next example has dimension two and is the one [[function-fields]] already met. For an elliptic curve $E$ over $\FF_q$ and a prime $\ell\nmid q$, the points of order dividing $\ell^k$ form a group $E[\ell^k]\cong(\ZZ/\ell^k)^2$, and Frobenius acts on it by a $2\times2$ matrix whose trace is congruent to $a=q+1-\#E(\FF_q)$ modulo $\ell^k$ (section [[ff-frobenius]]). The limit over $k$ is the Tate module $T_\ell E\cong\ZZ_\ell^2$, on which Frobenius has characteristic polynomial $X^2-aX+q$ exactly [@silverman2009, ch. III and V].

::: example
Take $E\colon y^2=x^3+x+1$ over $\FF_5$, the curve of [[function-fields]], with $\#E(\FF_5)=9$ and $a=-3$, so the characteristic polynomial of Frobenius is $X^2+3X+5$.

- Modulo $2$ it is $X^2+X+1$. The points of order $2$ are $(e_i,0)$ with $e_i$ the roots of $x^3+x+1$, which has no root in $\FF_5$ (its values at $0,\dots,4$ are $1,3,1,1,4$), so Frobenius permutes the three roots cyclically. In the basis $P_1=(e_1,0)$, $P_2=(e_2,0)$, with $P_1+P_2=(e_3,0)$, it sends $P_1\mapsto P_2\mapsto P_1+P_2$, the matrix $\begin{pmatrix}0&1\\1&1\end{pmatrix}$ with trace $1\equiv-3$ and determinant $-1\equiv5$ modulo $2$.
- Modulo $3$ it is $X^2-1=(X-1)(X+1)$, so Frobenius fixes one line of $E[3]$ and negates another. The fixed line is $E(\FF_5)[3]$: by direct computation $E(\FF_5)$ is cyclic of order $9$, with two points of order $3$ and six of order $9$.

The same integer $-3$ is seen through every $\ell$ at once, as a trace modulo $\ell^k$ for every $k$.
:::

For an elliptic curve over $\QQ$ the action of $\Gal(\overline\QQ/\QQ)$ on $T_\ell E$ is a two-dimensional $\ell$-adic Galois representation, unramified at every prime $p$ of good reduction with $p\ne\ell$, and the Frobenius at such a $p$ acts through the reduction modulo $p$, so its trace is $a_p=p+1-\#E(\FF_p)$ [@silverman2009, ch. VII]. The theorem that connects this to automorphic forms says that these traces are also the Hecke eigenvalues of a modular form, and that, conversely, modular forms produce Galois representations.

::::: card {#t-ig-eichler-shimura kind="theorem" title="A weight-two newform has a Galois representation whose Frobenius traces are its Hecke eigenvalues" source="diamond-shurman"}
:::: statement
Let $f=\sum_{n\ge1}a_nq^n$ be a normalized cuspidal newform of weight $2$ for $\Gamma_0(N)$ with rational coefficients. There is an elliptic curve $E_f$ over $\QQ$ such that for every prime $p\nmid N$
$$
a_p=p+1-\#E_f(\FF_p),
$$ {#eq-ig-es}
and so for every prime $\ell$ the representation on $T_\ell E_f$ is unramified at every $p\nmid N\ell$ with $\Tr\varrho(\Frob_p)=a_p$ and $\det\varrho(\Frob_p)=p$. For newforms of weight $k\ge2$ for $\Gamma_0(N)$ with arbitrary coefficients, Deligne constructed an $\ell$-adic representation with the same property, trace $a_p$ and determinant $p^{k-1}$.
::::
:::: plain
A modular form is a list of numbers $a_p$, one for each prime. There is a geometric object, an elliptic curve in the simplest case, whose number of points modulo $p$ is $p+1-a_p$, and a Galois group acting on it in which the Frobenius at $p$ has trace $a_p$.
::::
:::: why
`Row0b` below is the generalization of this theorem from $\GL_2$ over $\QQ$ to $\GL_n$ over CM fields, and this case shows what its clauses say before they are stated in full.
::::
:::: idea
The Jacobian of the modular curve $X_0(N)$ carries the Hecke operators as endomorphisms, and modulo $p$ the operator $T_p$ becomes Frobenius plus its dual, the Verschiebung (the Eichler and Shimura congruence relation). So on the Tate module the trace of Frobenius is the eigenvalue of $T_p$, and $f$ cuts an elliptic curve out of the Jacobian.
::::
:::: sketch {source="diamond-shurman" loc="ch. 8 and 9"}
The congruence relation is due to Eichler and Shimura and is proved in Diamond and Shurman's book, which also constructs the Galois representations of weight two [@diamond-shurman, ch. 8]. Deligne's construction for higher weight uses the étale cohomology of Kuga and Sato varieties [@deligne1971].
::::
:::: example
The eigenform $f=q\prod_{n\ge1}(1-q^n)^2(1-q^{11n})^2$ of level $11$ and the curve $y^2+y=x^3-x^2$ give, by expanding the product and by counting points modulo $p$,

| $p$ | 2 | 3 | 5 | 7 | 13 | 17 | 19 | 23 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| $a_p$ from the $q$-expansion | $-2$ | $-1$ | $1$ | $-2$ | $4$ | $-2$ | $0$ | $-1$ |
| $p+1-\#E(\FF_p)$ | $-2$ | $-1$ | $1$ | $-2$ | $4$ | $-2$ | $0$ | $-1$ |

At $p=2$ the Frobenius eigenvalues are the roots of $X^2+2X+2$, namely $-1\pm i$, of absolute value $\sqrt2$, which is the Riemann Hypothesis of [[t-ff-rh-curves]] for the curve modulo $2$.
::::
:::: used
The language of this card is the language of [[t-ig-row0b]].
::::
:::::

The roots of $X^2-a_pX+p$ are the Satake parameters of $f$ at $p$, up to normalization. For an automorphic representation $\pi$ of $\GL_n$ unramified at a place $w$, the Satake parameters are $n$ nonzero complex numbers that record all its Hecke eigenvalues at $w$. The code's `algSat` multiplies the unitary Satake parameters by $q_w^{(n-1)/2}$, with $q_w$ the size of the residue field, and its `FrobEig` says that $\varrho$ is unramified at $w$ and that for a Frobenius element $\sigma$ at $w$,
$$
\det\bigl(X-\varrho(\sigma^{-1})\bigr)=\prod_{\alpha}\Bigl(X-q_w^{(n-1)/2}\alpha\Bigr),
$$ {#eq-ig-frobeig}
the product over the Satake parameters $\alpha$ [@alpoge-lean]. The inverse $\sigma^{-1}$ is the geometric Frobenius, the usual convention for Galois representations found in étale cohomology.

::: lean {decl="UpperTheory.V.Af.FrobEig" file="Development/AutomorphicArithmetic/AutomorphicVarieties/AutomorphicForms/BlochKatoSelmerVanishes.lean"}
`FrobEig ι r w B` says that `r` is trivial on inertia at `w` and that the characteristic polynomial of `r σ⁻¹`, for every Frobenius `σ` at `w`, is the product of `X - b` over the multiset `B`, and `algSat n q B` multiplies each Satake parameter by `q ^ ((n - 1) / 2)`.
:::

:::: figure {#f-ig-eigen-trace viz="hecke-traces" height="440"}
For the level 11 form, the coefficient of q^p in a product of theta-like factors equals p + 1 minus the number of points of a cubic curve modulo p, prime by prime.

```vizspec
Purpose: show that Hecke eigenvalues read from a q-expansion are Frobenius traces read from point counts.
Scene: left panel, a p-by-p grid of faint muted dots for (x, y) in F_p x F_p; points with
  y^2 + y = x^3 - x^2 (mod p) drawn as gold dots. Under the grid print N_p (affine points + 1),
  and a_p = p + 1 - N_p.
  Right panel, horizontal axis primes p from 2 to 199 (skip p = 11), vertical axis in [-30, 30].
  For each prime: a blue bar of height a_p computed from the q-expansion of
  q * prod_{n >= 1} (1 - q^n)^2 (1 - q^{11 n})^2 (expand up to q^200 with integer arithmetic once),
  and a gold dot at p + 1 - N_p from point counting. The dot always sits on the top of the bar.
  The curves y = +-2 sqrt(p) in violet bound all bars.
Controls: a slider over the primes 2..97 except 11 (default p = 7) that selects the prime shown in the
  left panel and highlights its bar in red outline.
Motion: changing p redraws the grid with a 200 ms fade and slides the highlight.
Reader takeaway: one list of integers, two origins, an automorphic product and a count of points, agreeing
  at every prime and bounded by 2 sqrt(p).
Check values: a_2 = -2, a_3 = -1, a_5 = 1, a_7 = -2, a_13 = 4, a_17 = -2, a_19 = 0, a_23 = -1.
```
::::

## The theorem `Row0b` {#ig-row0b}

The formal proof needs the generalization of [[t-ig-eichler-shimura]] to automorphic representations of $\GL_n$ over a CM field. A CM field is a totally imaginary quadratic extension $E$ of a totally real field $E^+$, such as $\QQ(i)$ over $\QQ$, and complex conjugation $c$ is then a well-defined automorphism of $E$. The theorem is stated in the code as a proposition named `Row0b`, and it is proved there.

```lean
def Row0b : Prop :=
  ∀ (E Ω : Type) [Field E] [NumberField E] [IsCMField E] [Field Ω] [Algebra E Ω] [IsAlgClosure E Ω]
    (l : ℕ) [Fact l.Prime] (ι : Qbar l ≃+* ℂ) (a : ℕ), 1 ≤ a →
    ∀ (π : CuspSub E a) (χ : HChar (maximalRealSubfield E)), (CG.mk π).IsRegAlg → GlobalTheory.ContraPair.PolarizedPair π χ →
      ∃ (r : G E Ω →* GL (Fin a) (Qbar l)) (wt : ℤ) (HT : (E →+* Qbar l) → Multiset ℤ), PropsB Rc π ι r wt HT
```

The record `PropsB` has six fields, `cont`, `ss`, `away`, `weights`, `weights_conj`, and `above`, and `Rc` is instantiated to `recT`, the local parametrization whose laws [[inputs-and-assembly]] states. The card translates every clause. We write $n$ for the code's rank `a` and $\varrho$ for its representation `r`, because the page reserves $r$ for the order of a character. This $n$ is local to the Galois sections of the chapter and is not the frame order $n$ of [[d-ml-rankval]].

::::: card {#t-ig-row0b kind="theorem" title="Every regular algebraic polarized cuspidal representation of $\GL_n$ over a CM field has an $\ell$-adic Galois representation whose Frobenius data are its local data" source="blggt2014"}
:::: statement
Let $E$ be a CM field with maximal totally real subfield $E^+$ and algebraic closure $\overline E$, let $\ell$ be a prime, $\iota\colon\overline\QQ_\ell\to\CC$ a field isomorphism, and $n\ge1$. Let $\pi$ be a cuspidal automorphic representation of $\GL_n(\AA_E)$ that is regular algebraic, and $\chi$ a Hecke character of $E^+$ such that $(\pi,\chi)$ is a polarized pair: $\chi_v(-1)=(-1)^n$ at every real place $v$ of $E^+$ (`sign`), and $\pi$ twisted by $(\chi\circ N_{E/E^+})^{-1}$ is paired with $\pi$ through complex conjugation, the code's form of "the dual of $\pi$ is its complex conjugate up to the twist by $\chi\circ N_{E/E^+}$" (`dual`). Then there are a representation $\varrho\colon\Gal(\overline E/E)\to\GL_n(\overline\QQ_\ell)$, an integer $w_0$, and for each embedding $\tau\colon E\to\overline\QQ_\ell$ a multiset $\mathrm{HT}_\tau$ of $n$ integers, such that:

1. (`cont`, `ss`) $\varrho$ is continuous and semisimple.
2. (`weights`) $\mathrm{HT}_\tau=\{\tfrac{n-1}2-z\}$, as $z$ runs over the infinitesimal character of $\pi$ at the complex place $\iota\circ\tau$.
3. (`weights_conj`) $\mathrm{HT}_{\tau\circ c}=w_0-\mathrm{HT}_\tau$.
4. (`away`) At every finite place $w\nmid\ell$, and for every local parametrization $\mathrm{rec}$ that satisfies the laws of `recT`, the Weil and Deligne representation of $\varrho$ restricted to a decomposition group at $w$ has the dimension of $\mathrm{rec}(\pi_w)$, the parameter attached to the normalized local component (`dim`). It equals $\mathrm{rec}(\pi_w)$ whenever $\mathrm{rec}(\pi_w)$ is trivial on commutators of the Weil group and has zero monodromy (`tor`). When $E_w\cong\QQ_g$ for a prime $g>16n^2$ (or $n=1$), and $\mathrm{rec}(\pi_w)$ has zero monodromy, is trivial on wild inertia (characteristic polynomial $(X-1)^n$ there), and at a tame generator of inertia has no repeated eigenvalue other than $(q_w-1)$-th roots of unity, the representation of $\varrho$ has zero monodromy and the same characteristic polynomial as $\mathrm{rec}(\pi_w)$ at every element of inertia (`tame0`).
5. (`above`) For every choice of the $\ell$-adic period data over which the code quantifies (`LocPrime`, `LocAinf`, `LocTied`), the following holds at every place $w\mid\ell$. Where $\pi_w$ is spherical, $\varrho$ restricted to a decomposition group is crystalline and de Rham with Hodge and Tate weights $\mathrm{HT}$ (`crys`). Under either set of hypotheses of item 4 on $\mathrm{rec}(\pi_w)$ (with $g>16n^2$ read for the rank $n$), it is potentially semistable and de Rham with the same weights, and its Weil and Deligne representation, built by Fontaine's functor, relates to $\mathrm{rec}(\pi_w)$ as in item 4 (`nice`).
::::
:::: plain
For a large class of automorphic representations over CM fields there is a Galois representation whose Frobenius eigenvalues at almost every prime are the representation's local data, whose behavior above $\ell$ is set by the weights at infinity, and whose behavior at the remaining primes matches the local data in a weakened, explicit sense.
::::
:::: why
The proof uses it twice. It is the input of the cohomological window bound `VWin` of [[cohomology-window]], and it fills two fields of the record of published statements that the theta-integral assembly consumes. Without it neither input exists ([[ig-uses]]).
::::
:::: idea
At a place $w$ where $\pi_w$ is unramified, $\mathrm{rec}(\pi_w)$ is an unramified representation of the Weil group, which factors through the abelian quotient by inertia, so it is trivial on commutators and has zero monodromy. Item 4 then says that the local Galois representation equals $\mathrm{rec}(\pi_w)$, and in our reading of how the laws of `recT` combine, that is the statement that the Frobenius eigenvalues are the Satake parameters, as in [[eq-ig-frobeig]]. Items 2 and 3 are the higher-dimensional form of "the determinant is $p^{k-1}$": the weights at infinity of $\pi$ become Hodge and Tate weights, and the polarization makes them symmetric about $w_0/2$. The tame clause with $g>16n^2$ is the weakening: at ramified places compatibility is promised only in the listed cases.
::::
:::: sketch {source="blggt2014"}
The existence of $\varrho$ with items 1 to 4 at unramified places and item 5 at spherical places is due to work of Clozel, Kottwitz, Harris and Taylor, Shin, and Chenevier and Harris, among others [@shin2011; @chenevier-harris2013]. The form for polarized pairs follows Barnet-Lamb, Gee, Geraghty, and Taylor [@blggt2014], and compatibility at ramified places is in the direction of Caraiani's theorem [@caraiani2012]. The code obtains `Row0b` from a stronger `Row0` of the same shape, with no size condition on $g$, by forgetting that condition (`Row0.row0b`), and it proves `Row0` from scratch, as the next section describes.
::::
:::: lean {decl="UpperTheory.GalStar.Row0b" file="Development/AutomorphicArithmetic/Foundations/GaloisRepresentations/TypeConditions/WeightsConjBis.lean"}
The definition is at line 69. It is proved as `UpperTheory.Gal.Int.galoisLocalGlobalStrong_recParameter : Row0b recT` in `IntegralStructures/RowSrc.lean`, and consumed by `UpperTheory.FinalTheorems.everyCharacter_of_row` in `CharacterBoxes/MainConclusion.lean`.
::::
:::: used
Proved in [[t-ig-assembly]]. Used in [[ig-uses]] and in [[cohomology-window]].
::::
:::::

"Cuspidal" excludes representations induced from smaller ones. "Regular algebraic" asks that the infinitesimal character at each complex place be that of an algebraic representation shifted by $\tfrac{n-1}2$, with distinct entries, which makes the weights of item 2 distinct integers. We did not unfold the code's `IsRegAlg`, and its use in `weights` fits this meaning. "Polarized" is what lets $\pi$ descend to a unitary group, and `PolarizedPair` has exactly the fields `sign` and `dual` of the card. The local map `recT` satisfies a smaller list of laws than the local Langlands correspondence, which [[inputs-and-assembly]] states.

::: warning
`Row0b` is not used to prove integrality of theta periods, and its proof is not where the note's $p$-adic divisibility lives. The folder `ZetaCharacterDivisibility` below is about divisibility of polynomials, and the congruences of `CongruenceOddLevel` are used to construct Galois representations, not to bound the chain. Our reading of the integrality bookkeeping traced the $\ell$-adic valuation engine of the note's steps 2 and 10 to a separate statement, `ThmP`, which [[multiplicity-from-lifts]] states ([[t-ml-thmp]]).
:::

## How the formal proof builds them {#ig-construction}

The assembly of `Row0b` sits in one file, `IntegralStructures/Development.lean`, and it reads as a five-step recipe. Before the steps, the classical recipe they follow.

::: aside
Background. A standard way to construct the Galois representation of an automorphic form that does not appear in the cohomology of any variety is by congruences and limits. One finds forms $f_k$ that do appear in cohomology and whose Hecke eigenvalues are congruent to those of $f$ modulo $\ell^k$, takes their Galois representations, and passes to the limit $k\to\infty$ through their traces, which converge $\ell$-adically. Wiles used this for ordinary forms through Hida families, with two-dimensional pseudo-representations to turn a limit of traces into a Galois representation [@wiles1988], and Taylor extended pseudo-representations to every dimension and applied the method to Siegel forms of low weight [@taylor1991]. A second standard device changes the rank: when the forms of rank $n$ are not reachable, one adds characters to reach a rank where they are and removes the characters afterwards. Chenevier and Harris complete the construction for $\GL_n$ over CM fields along these lines [@chenevier-harris2013]. The formal proof follows both devices, with theta lifts between totally definite unitary groups in the role of the rank change.
:::

The formal proof works on totally definite unitary groups, where, as [[definite-forms]] showed, an automorphic form is a vector of numbers indexed by finitely many lattice classes, so that congruences are congruences between vectors of integers. Its five steps are geometry for forms of a special type and odd rank (`GeoOne`), division of a large representation down to the right dimension (`DivAll`), congruences to every form of odd rank (`CongFinOdd`), an $\ell$-adic limit (`LimFinOdd`), and two theta lifts for even rank (`TLiftK`). Then `rest` passes to `Row0` by local and global compatibility at spherical and Iwahori levels, and `Row0.row0b` weakens `Row0` to `Row0b`. Each step below gets its declaration and a paragraph that says what was and was not read.

::: lean {decl="UpperTheory.Gal.Int.galoisLocalGlobalStrong_of_geometry_lift" file="Development/AutomorphicArithmetic/Foundations/GaloisRepresentations/IntegralStructures/Development.lean"}
The file chains `seedFinOdd_of_geoOne`, `congFinOdd_of_ex`, `limFinOdd_of`, `toCoreK`, `coreAll_of_core`, `rest`, and `Row0.row0b`, and `galoisLocalGlobalStrong_recParameter` applies the result to `geoOne_holds` and `tLiftK`.
:::

### Step 1: geometry {#ig-geoone}

For a form $U$ of odd rank and of a special type at an auxiliary $\ell$-adic place, `GeoOne` gives a semisimple $\varrho^{\mathrm{big}}$, usually of dimension larger than $n$, whose Frobenius eigenvalues at almost every usable place include the Satake parameters of $U$, with crystalline versions at the $\ell$-adic places whose crystalline Frobenius has a characteristic polynomial dividing a power of the Satake polynomial. It is proved as `geometric_realization_of_weight_one`, from a record `Steps` of seventeen lemmas, a record `KSAll`, and a statement `PlanEx`, and its one named published input is the holomorphic Lefschetz formula of Atiyah and Bott, which the tree proves. The representation is a piece of the étale cohomology of a variety $Z$ with Hecke correspondences: `HTower` is a scheme $Z$ with pairs of maps $Y_g\rightrightarrows Z$, and `Nice` asks that $Z$ be smooth and projective and the maps finite étale, so that the Lefschetz formula computes Hodge numbers of the pieces from fixed points. Which variety $Z$ is was not unfolded: a `Plan` attaches to $U$ a prime $p$, a datum `Datum p`, a group `HTGroup p`, and a tower, and a lemma is named `kodaira_spencer_of_weight_one`, but we did not identify $Z$. The formal proof establishes `GeoOne` in `geometric_realization_of_weight_one`. We state it and do not unfold its proof here.

::: lean {decl="UpperTheory.Gal.Int.Geo.GeoOne" file="Development/AutomorphicArithmetic/Foundations/GaloisRepresentations/IntegralStructures/GeometricFlagBases/HodgeTrAt.lean"}
Its conclusion gives, for odd rank, representations `ρ` of some dimension `dd` with `VBase ι d U ρ`, at split places Frobenius eigenvalues containing `algSat a (normV w) B`, and at `ℓ`-adic places crystallinity, occurring jumps, and `PhiKilled`.
:::

### Step 2: division {#ig-divall}

`DivAll` takes one representation with the properties `VBase` and returns $\varrho$ of dimension $n$ with `IsDivRep`: on a dense open set of Frobenius elements, $\det(X-\varrho(\sigma^{-1}))$ is the product of $X-b$ over the normalized Satake parameters $b$, as in [[eq-ig-frobeig]]. The proof `divAll_holds` combines a determinant character (`DetEx`), its divisibility (`DivDet`), a division lemma (`DivOne`), uniqueness (`DivUniq`), and a seed for the crystalline Frobenius (`PhiSeed`). The clause `PhiKilled` asks that the characteristic polynomial of the crystalline Frobenius of $\varrho^{\mathrm{big}}$ divide a power of the Satake polynomial, and `Inside r ρ` says that $\varrho$ embeds in $\varrho^{\mathrm{big}}$ through an intertwining matrix of rank $n$. In a small example of ours, a five-dimensional $\varrho^{\mathrm{big}}$ with Frobenius polynomial $(X^2+2X+2)^2(X-1)$ at $p=2$ and a form with Satake polynomial $X^2+2X+2$ would give the two-dimensional piece with that polynomial.

::: warning
The divisibility of the note's steps 2, 9, and 10 is the divisibility of numbers by powers of a prime, the integer form of vanishing to high order. The divisibility of `ZetaCharacterDivisibility` is the divisibility of one polynomial by another, the algebraic form of "this representation contains that one". The two are unrelated in the code, and only the first is the multiplicity of Stepanov's argument.
:::

::: lean {decl="UpperTheory.Gal.Int.Div.DivAll" file="Development/AutomorphicArithmetic/Foundations/GaloisRepresentations/IntegralStructures/ZetaCharacterDivisibility/InsideRefl.lean"}
Proved as `divAll_holds` in `DivisionOneGeometricRepresentation.lean`, and fed with `GeoOne` and seven lemmas into `seedFinOdd_of` to give `SeedFinOdd`.
:::

### Step 3: congruences {#ig-congfinodd}

`CongFinOdd` is the odd-rank instance of `CongUW4`. For $U$ of odd rank and two auxiliary $\ell$-adic places it gives a level and nonzero constants such that the system $\theta_U$ of Hecke eigenvalues of $U$, extended by weighted powers of Satake parameters at the $\ell$-adic places, satisfies `PolyApprox`: it lies in the $\ell$-adic closure of the polynomial expressions in eigenvalue systems of forms $U'$ of the special type `TyEll`, with the same level and weight away from the auxiliary places. The type `TyEll` asks for a vector on which a pro-$\ell$ subgroup at an auxiliary place acts through a character of order $\ell^m$, chosen so that every representation containing it is supercuspidal there. In the finite picture of [[definite-forms]] a congruence is concrete. If the integer matrix $T=\begin{pmatrix}1&2\\3&0\end{pmatrix}$ stands in for a Hecke operator on a genus with two classes, then $f=(1,1)$ has $Tf=3f$ and $f'=(2,-3)$ has $Tf'=-2f'$. Modulo $5$, $f'\equiv2f$ and $-2\equiv3$, and this is forced: $\lambda'f'=Tf'\equiv2Tf=2\lambda f\equiv\lambda f'$, and an entry of $f'$ is a unit modulo $5$. The classical instance is Ramanujan's congruence $\tau(p)\equiv1+p^{11}\pmod{691}$ between $\Delta$ and an Eisenstein series, for instance $\tau(2)=-24\equiv2049$ modulo $691$ [@ramanujan1916]. The formal proof establishes `CongFinOdd` in `congFinOdd_of_ex` from `WtLacEx`. We state it and do not unfold its proof here.

::: lean {decl="GlobalTheory.CongL.CongFinOdd" file="Development/AbelianVarietyTheory/Definitions/GaloisGeometry/LimWU4OfLimWU3.lean"}
`CongFinOdd := CongUW4 Odd GlobalTheory.CongW.TyEll (GlobalTheory.CongW.GenOf DGen) WtLac`, proved by `UpperTheory.Gal.Int.Cong.congFinOdd_of_ex` in `CongruenceOddLevel/CongFinOddOfLvLac.lean`.
:::

### Step 4: the $\ell$-adic limit {#ig-limfinodd}

`LimFinOdd` is the conclusion of `SeedFinOdd` for every form of odd rank: an $n$-dimensional $\varrho$ with `FrobEig` at every usable place away from $\ell$, crystalline and de Rham at the other $\ell$-adic places, and with crystalline Frobenius data approximated $\ell$-adically by crystalline representations (`JointApprox`). It is proved in one line, `limWU4_of _ _ _ _ h h'`, in a folder named `TraceLimits`. An $\ell$-adic limit is a limit in the topology in which $\ell^k$ is small: $1,3,7,15,\dots,2^k-1$ converges $2$-adically to $-1$, because the differences $2^k$ tend to $0$. Eigenvalue systems that agree modulo higher and higher powers of $\ell$ converge in the same way, and so do the characteristic polynomials of their Galois representations, coefficient by coefficient. That the code passes to the limit through traces, as pseudo-representations do, is our inference from the folder name and the shape of `LimWU4`, and the proof of `limWU4_of` was not unfolded.

::: lean {decl="UpperTheory.Gal.Lim.limFinOdd_of" file="Development/AutomorphicArithmetic/Foundations/GaloisRepresentations/TraceLimits/LimFinOddOf.lean"}
`theorem limFinOdd_of (h : SeedFinOdd) (h' : CongFinOdd) : LimFinOdd`, at line 197.
:::

### Step 5: the single use of `TLiftK` {#ig-twoup}

`TLiftK`, the existence of theta lifts between totally definite unitary groups that [[definite-forms]] and [[multiplicity-from-lifts]] discuss, enters this region exactly once, in `twoUpOK_of_steps`. For even $n$ and an automorphic $U$ on the unitary group in $n$ variables over a CM field $E$ of the kind `TwoUpAll` allows ($E$ unramified over $E^+$ at every finite place, $[E^+:\QQ]$ even), the code takes $d_0$ from `TLiftK`, sets $t=2(d_0+n)+1$, which is odd so that $n+t$ is odd, chooses two families $\psi_1=(\psi_{1,1},\dots,\psi_{1,t})$ and $\psi_2$ of Hecke characters of $E$ with no character in common, and lifts $U$ twice to the unitary group in $n+t$ variables. The record `IsUp` describes each lift $U_i$: it is automorphic, its weights move by an explicit rule, and at every split place $w$ where everything is unramified its Satake parameters, normalized by `algSat` as in [[eq-ig-frobeig]] (for rank $n+t$ on the left and rank $n$ on the right), are
$$
\operatorname{algSat}_w(U_i)=\kappa(w)^{-1}\cdot\operatorname{algSat}_w(U)\ \cup\ \{\psi_{i,1}(w),\dots,\psi_{i,t}(w)\},
$$ {#eq-ig-isup}
as multisets, with $\kappa$ a fixed algebraic Hecke character. By step 4 each $U_i$, of odd rank, has a Galois representation $\varrho_{U_i}$, which contains $\varrho_U\otimes\kappa^{-1}$ and $t$ characters. Because no character occurs in both families, the part common to $\varrho_{U_1}$ and $\varrho_{U_2}$ is $\varrho_U\otimes\kappa^{-1}$, and the code's `Subtract` turns this into the representation of $U$. The statement `rowDef_of_odd` records the logic: even rank from odd rank, through `Subtract` and `TwoUpAll`.

::: example
Take $n=2$ with the Satake parameters $\{-1+i,\,-1-i\}$ of the level 11 form at $p=2$, ignore the twist $\kappa$, and take $t=3$ for the picture (the code's $t=2(d_0+2)+1$ is larger) with character values $\{2,3,5\}$ for the first lift and $\{7,11,13\}$ for the second at the same place. The two odd-rank representations have Frobenius eigenvalues $\{-1+i,-1-i,2,3,5\}$ and $\{-1+i,-1-i,7,11,13\}$, and the common part is $\{-1+i,-1-i\}$, as it should be. If the second family reused the value $5$, the common part would be $\{-1+i,-1-i,5\}$, three-dimensional, and the subtraction could not tell the form's part from a character. This is why `TwoUp` demands $\psi_{1,i}\ne\psi_{2,j}$ for all $i,j$. The numbers $2,3,5,7,11,13$ are placeholders of ours, not values of actual Hecke characters.
:::

::: lean {decl="UpperTheory.Gal.TP.twoUpOK_of_steps" file="Development/AutomorphicArithmetic/Foundations/GaloisRepresentations/ThetaParseval/TwoUpOKOfSteps.lean"}
Sets `t := 2 * (d₀ + n) + 1`, applies `TLiftK` twice, and returns two `IsUp` lifts with `∀ i j, ψ₁ i ≠ ψ₂ j`; `IsUp` and `Subtract` are in `SplitLineSubtraction/RowDefOfOdd.lean`, and `toCoreK` in `CrystallineDescent/ToCoreK.lean` is the only caller.
:::

The shape [[eq-ig-isup]] is the note's step 8, $\pi\mapsto\pi\boxplus\mu_j[t]$, but here it is used once, for parity, while the note's chain of $m$ lifts lives in the theta-integral assembly. Theta lifts between unitary groups are a classical construction, and when a lift is nonzero is studied through the Rallis inner product formula and the doubling method [@harris-kudla-sweet1996]. The formal proof establishes `TLiftK` as the theorem `tLiftK`; we state it and do not unfold its proof here.

:::: figure {#f-ig-parity viz="parity-subtraction" height="400"}
Two lifts of an even-rank form share only the form's own parameters, so subtracting what they do not share recovers the form, unless a character is reused.

```vizspec
Purpose: make the parity trick of TwoUp visible as a set intersection.
Scene: three horizontal rows of colored dots. Row "form" (gold): two dots labeled -1+i and -1-i.
  Row "lift 1": the two gold dots plus three blue dots labeled with character values (default 2, 3, 5).
  Row "lift 2": the two gold dots plus three teal dots (default 7, 11, 13). Below, a panel "common part"
  shows the dots that occur in both lift rows. A caption line under the panel prints its size.
Controls: the six character dots are draggable between a palette of 8 values {2, 3, 5, 7, 11, 13, 17, 19}
  shown at the bottom; dropping a value on a lift row replaces one of its three dots. A toggle "rank of the
  form" switches between 2 (two gold dots) and 4 (four gold dots labeled a, b, c, d, with t = 5 dots per lift
  and a palette of 12 values).
Motion: when the rows change, matching dots slide into the common-part panel over 300 ms.
Reader takeaway: when the two character families are disjoint, the common part is exactly the form's
  parameters; a shared character enlarges it, drawn in red, and the subtraction fails.
```
::::

### What the steps assemble {#ig-assembly}

::::: card {#t-ig-assembly kind="theorem" title="From GeoOne and TLiftK the formal proof derives Row0b" source="alpoge-lean"}
:::: statement
`GeoOne` and `TLiftK` imply `Row0b recT`. Both hypotheses are proved in the tree (`geoOne_holds`, `tLiftK`), so `Row0b recT` holds.
::::
:::: plain
Galois representations for all the relevant automorphic forms over CM fields follow from two things: geometry provides them for forms of a special shape and odd rank, and theta lifts move every form into reach.
::::
:::: why
It closes the first of the three inputs of the proof named in [[route-a-plan]], and with it the formal proof contains no unproved statement from the theory of Galois representations.
::::
:::: idea
Geometry for special forms of odd rank, division to the right dimension, congruences and an $\ell$-adic limit for all forms of odd rank, two theta lifts for even rank, and local and global compatibility at the end.
::::
:::: proof {collapsed}
In the code: `seedFinOdd_of_geoOne geo : SeedFinOdd` (steps 1 and 2), `congFinOdd_of_ex wtLacEx_holds : CongFinOdd` (step 3), `limFinOdd_of seed cong : LimFinOdd` (step 4), `toCoreK up congPhi_holds descOffT lim : Core`, which calls `twoUpOK_of_k up` (step 5), `coreAll_of_core : CoreAll` (from conjugate self-dual representations to all polarized pairs by twisting), `rest : Row0 recT` (local and global compatibility at spherical and Iwahori levels), and `Row0.row0b : Row0b recT`. We read every link of this chain in the code. The statements `ClosedPhi`, `DescOffT`, `CoreAll`, and the proof of `rest` were not unfolded, and the content of `rest` is classical local and global compatibility.
::::
:::: lean {decl="UpperTheory.Gal.Int.galoisRepresentations_of_thetaLift" file="Development/AutomorphicArithmetic/Foundations/GaloisRepresentations/IntegralStructures/GaloisRepresentationsOfThetaLift.lean"}
`galoisRepresentations_of_thetaLift up := galoisLocalGlobalStrong_of_geometry_lift geoOne_holds up`.
::::
:::: used
Gives the hypothesis of `everyCharacter_of_row`; see [[ig-uses]] and [[inputs-and-assembly]].
::::
:::::

## What the Galois representations are used for {#ig-uses}

A reader of the note might expect the Galois representations to pay for the integrality of the chain, but the code uses them elsewhere. `Row0b` is consumed in one file, `CharacterBoxes/MainConclusion.lean`, by `everyCharacter_of_row h := every_character_of_literature_of_vWin ⟨h, recTExists, h⟩ (vwin_of_row h)`, which gives it two consumers.

- **The window bound.** `vwin_of_row` passes `Row0b` to `automorphic_window_of_inputs`, which proves `VWin`, the bound of [[cohomology-window]] on the groups $\text{Sha}^1$ of locally trivial Galois cohomology classes. Our reading of the window `VWin` found that the plus part of those groups, where Vandiver's conjecture speaks, is bounded through automorphy of Galois representations, and that `Row0b` and the base change statement `BaseChangeIsobaricN` enter there. We confirmed the calls in `VwinOfRow.lean` and did not follow the plus-part argument.
- **The literature record.** `Row0b` fills the fields `caraianiLocalGlobalDual` and `galoisRepOfPolarizedPairLit` of `OpenLiteratureStatements`. We followed them, by names and fields only, into a package of automorphy and Galois cohomology statements that supplies the theta-integral assembly with a hypothesis that certain representations are not endoscopic (`NonEndoscopicHypothesesAlt`).

The digests support no use of `Row0b` for integrality or for congruences in the chain. The congruences of `CongFinOdd` are between forms on one unitary group and serve to build Galois representations, not the note's step 18 "congruences between lifts and forms", and `TLiftK` is used only inside the construction of `Row0b`, so the $m$-fold chain does not go through it [@alpoge-lean].

## The count that is bounded {#ig-count}

We now turn from what the chain stands on to what it delivers. Chapter [[landau-endgame]] needs, for each primitive character of order $r$, an upper bound on
$$
G_r(X)=G_0(X)+\frac1{3r+1}\sum_{j=1}^{r-1}\Re\,g_{(\chi^j)^*}(X)
$$
at every scale in windows $[Y,Y^{3/2}]$. A smoothed prime sum cannot be bounded above by looking at it, because its size is decided by the zeros. The formal proof bounds a different quantity, a count of prime powers of a special kind, and converts. In Stepanov's terms, and as our reading, this count plays the part of the number of rational points, the quantity that the auxiliary construction bounds from above.

### The smallest case: primes inert in $\QQ(i)$ {#ig-toy}

An odd prime $p$ is inert in $\QQ(i)$ when $p\equiv3\pmod4$, that is, when $\chi_4(p)=-1$ for the character $\chi_4$ of [[what-rh-says]], and split when $p\equiv1\pmod4$. By Dirichlet's theorem about half of the odd primes are inert. Up to $1000$ there are $167$ odd primes, $87$ inert against $83.5$ expected, and up to $10{,}000$ there are $1228$, with $619$ inert against $614$. The excess is the zero noise of $L(s,\chi_4)$, and the smoothed version makes this exact in a worked case of ours, before the code's general statement.

Count, with the ramp weight of the smoothed sum and with weight $2$, the odd prime powers $n=p^i$ with $\chi_4(n)=-1$, which are the powers $p^i$ with $p\equiv3\pmod4$ and $i$ odd:
$$
A_4(X)=\sum_{\substack{n\le X\\ n\ \text{odd},\ \chi_4(n)=-1}}2\Lambda(n)\Bigl(\frac Xn-1\Bigr).
$$ {#eq-ig-toy-count}
For odd $n$, $2\cdot\mathbf 1[\chi_4(n)=-1]=1-\chi_4(n)$, the orthogonality of the two characters modulo 4 ([[eq-rh-orthogonality]]). Summing against $\Lambda(n)(X/n-1)$ over odd $n$ gives $A_4(X)=S(X)-B_2(X)-\sum_{n\le X}\chi_4(n)\Lambda(n)(X/n-1)$, where $B_2(X)=\sum_{2^k\le X}\log2\,(X/2^k-1)$ removes the powers of $2$. Write $S(X)=X\log X-(1+\gamma_E)X+G_0(X)$ as in [[landau-endgame]], and $\sum_n\chi_4(n)\Lambda(n)(X/n-1)=g_{\chi_4}(X)-X\frac{L'}{L}(1,\chi_4)$ by the definition of $g_\chi$. With the expected size
$$
M_4(X)=X\log X-(1+\gamma_E)X-X\log2+X\,\frac{L'}{L}(1,\chi_4),
$$
the count's excess over its expected size is
$$
A_4(X)-M_4(X)=G_0(X)-g_{\chi_4}(X)-\bigl(B_2(X)-X\log2\bigr).
$$ {#eq-ig-toy-balance}
The last term is $O(\log X)$, because $B_2(X)=X\log2\,(1-2^{-K})-K\log2$ with $K=\lfloor\log_2X\rfloor$. The constant is $\frac{L'}{L}(1,\chi_4)=\gamma_E+2\log2+3\log\pi-4\log\Gamma(\tfrac14)=0.2456096$, which we checked against a numerical derivative of $L(s,\chi_4)$.

::: example
Both sides of [[eq-ig-toy-balance]], computed independently, the left from the inert prime powers alone and the right from all prime powers and the character sum, with mpmath at 30 digits:

| $X$ | $A_4(X)$ | $M_4(X)$ | $A_4-M_4$ | $G_0(X)$ | $g_{\chi_4}(X)$ | $B_2(X)-X\log2$ | right side |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 100 | 264.9575 | 258.0417 | 6.9158 | 1.7217 | 0.0478 | $-5.2419$ | 6.9158 |
| 1000 | 4892.6420 | 4883.0020 | 9.6400 | 1.5309 | $-0.5169$ | $-7.5921$ | 9.6400 |
| 10000 | 71860.4822 | 71855.8711 | 4.6111 | 1.7493 | 6.9953 | $-9.8570$ | 4.6111 |

The count is about $X\log X$ in size and its excess is a handful, of the size of the zero noise $G_0$ and $g_{\chi_4}$ and of the logarithm from the prime $2$. An upper bound on the count of the form $A_4(X)\le M_4(X)+X^{\theta}$ is therefore the same as an upper bound $G_0(X)-g_{\chi_4}(X)\le X^\theta+O(\log X)$.
:::

The toy shows both the mechanism and its difficulty. The count controls a combination of smoothed sums, the one picked out by orthogonality on the group $\Gal(\QQ(i)/\QQ)$, and the combination carries the character $\chi_4$ with a minus sign. Landau's argument of [[landau-endgame]] needs positive weights, so in the toy a bound on the count bounds $G_0$ from above only if $\lvert g_{\chi_4}\rvert$ is already known to be small. The formal proof meets this difficulty in its general form, and in our reading resolves it in two ways that the next sections confirm in the code: it averages over a large finite group so that the characters it wants appear with positive weights, and it chooses the auxiliary field so that the characters that keep an uncontrolled sign are twists by Jacobi symbols of huge auxiliary primes, for which a square-root bound is available by averaging ([[ig-pairgood]]).

:::: figure {#f-ig-inert-balance viz="inert-balance" height="460"}
The excess of the weighted count of inert prime powers over its expected size equals the zero noise of zeta minus the zero noise of the L-function of the character modulo 4, at every X.

```vizspec
Purpose: verify the finite-group explicit formula for Q(i) numerically and show what an upper bound on the
  count controls.
Scene: top strip, the odd primes up to X as tick marks on a log axis, gold for p = 1 mod 4 (split) and red
  for p = 3 mod 4 (inert); counts of each printed at the right, with half the total in blue.
  Main panel, horizontal axis log X for X in [20, 20000], vertical axis in [-15, 15]. Curves:
  A4(X) - M4(X) as a thick gold curve, computed directly from the inert prime powers with
  A4(X) = sum over odd prime powers n <= X with chi4(n) = -1 of 2 Lambda(n) (X/n - 1) and
  M4(X) = X log X - (1 + gamma_E) X - X log 2 + X * 0.2456096 (the value of L'/L(1, chi4));
  G0(X) = sum_{n <= X} Lambda(n)(X/n - 1) - X log X + (1 + gamma_E) X as a thin blue curve;
  g4(X) = sum_{n <= X} chi4(n) Lambda(n)(X/n - 1) + 0.2456096 X as a thin teal curve;
  the right side G0 - g4 - (B2(X) - X log 2), B2(X) = sum_{2^k <= X} log 2 (X/2^k - 1), as a dashed red curve
  that lies on the gold one. Precompute prefix sums over n up to 20000 once, so each X costs O(1).
Controls: slider X (log scale, 20 to 20000, default 1000); toggles to show or hide each curve.
Motion: a vertical cursor at the slider's X with the five values printed beside it.
Reader takeaway: the excess of the inert count is exactly a signed combination of two zero-noise terms
  plus a logarithm; it is tiny compared with the count itself.
Check values: X = 100: A4 = 264.9575, M4 = 258.0417, G0 = 1.7217, g4 = 0.0478, B2 - X log 2 = -5.2419;
  X = 1000: A4 - M4 = 9.6400, G0 = 1.5309, g4 = -0.5169; X = 10000: A4 - M4 = 4.6111, g4 = 6.9953.
  Unweighted: up to 1000 there are 167 odd primes, 87 of them 3 mod 4.
```
::::

### The general count in the code {#ig-ask}

The code's count lives on a finite abelian group $\mathcal G=(\ZZ/2\ZZ)^2\times A$, where $A$ is the frame group of [[d-ml-rankval]] (the code writes `E0 × H`, with `H` the frame group), supplied with the chain data at each scale. The subgroup $\Phi\subset\mathcal G$ of elements whose first coordinate is $0$ has index $2$ (`InPhi`, `PhiSet`), the character $\chi_C$ that is $-1$ off $\Phi$ is the code's `chC`, and a record `ArithData` assigns to every prime $p$ a Frobenius element $f_p\in\mathcal G$ and an inertia subgroup, together with two auxiliary primes $\mathsf q_1$ and $\mathsf d$. A prime $p\ne2,\mathsf q_1,\mathsf d$ is inert (`IsInert`) when $f_p\notin\Phi$. This $\mathcal G$ is not the genus of [[definite-forms]], and this $\Phi$ is a subgroup, not the function $\Phi(s)$ of [[zeta-continued]]. On the spine the record is not abstract. The host's `arith` builds it by class field theory (`cftData`, in `RamificationTwoAndConjugationAtQAndD.lean`) from the host's CM field $E$, with $\mathsf q_1$ the host's prime $\mathsf q$ and $f_p$ the image of $p$ under the Artin map, and the identifications `HostRaw.gal` and `Comparison₂.toE` make $\mathcal G$ the Galois group of $E$ over $\QQ$, the group $\{\pm1\}^2\times A$ of [[d-ml-rankval]]. Under them $\Phi$ is the subgroup that fixes $\sqrt{-\mathsf d}$ (`inPhi_iff`), $\chi_C$ is the quadratic character of $\QQ(\sqrt{-\mathsf d})$, and a prime is inert exactly when it is inert in $\QQ(\sqrt{-\mathsf d})$. The hypotheses `HostFacts` (unramified outside $2,\mathsf q_1,\mathsf d$, ramified at $\mathsf d$ with inertia of order two) and the field `ReadsKept`, in which the values of kept Dirichlet characters at $n$ are computed from the group through `primVal`, are the abstract record's form of the same facts.

For a scale $a>0$, an element $t\in A$, a positive weight function $\mathsf w$ on $\Phi$, and a cutoff $N$, the count is
$$
\mathrm{ASK}=\sum_{\substack{p\le N\\ p\ \text{inert}}}2\log p\sum_{\substack{1\le i\le N\\ i f_p\notin\Phi}}\Bigl(\frac a{p^i}-\mathsf w\bigl(\text{partner}_t(i f_p)\bigr)\Bigr)_+\ +\ \log\mathsf d\cdot(\text{the same sum at the ramified prime }\mathsf d),
$$ {#eq-ig-ask}
where $\text{partner}_t(g)=g+((1,1),0)+((0,0),t)$ is a bijection from the complement of $\Phi$ onto $\Phi$ (`PartnerBij`). It is the toy count [[eq-ig-toy-count]] with two changes: the ramp $(a/p^i-\mathsf w)_+$ has a cutoff that depends, through $\mathsf w$, on where the Frobenius of $p^i$ sits in the group, and the weight $2\log p$ appears with the same factor $2$. The expected size is
$$
\mathrm{MAIN}=a\Bigl(\log a-1-\gamma_E+\mathrm{ld}(\chi_C)-\frac1{\lvert\Phi\rvert}\sum_{\rho\in\Phi}\log\mathsf w(\rho)\Bigr),
$$
where $\mathrm{ld}$, the code's `ell`, assigns to each character of $\mathcal G$ a complex number, which for the characters that come from Dirichlet characters is $\frac{L'}{L}(1,\chi)$ (a clause of `TieArith` in `ChainTied`). For each character $\psi$ of $\mathcal G$ the code forms the smoothed sum `GPsi`, which is $G_0(y)$ for $\psi$ trivial and $\sum_{n\le y}\Lambda(n)\,\mathrm{primVal}(\psi,n)(y/n-1)+y\,\mathrm{ld}(\psi)$ otherwise, the sum $g_\chi$ of the Dirichlet character $\chi$ that $\psi$ defines through the Frobenius map.

::::: card {#t-ig-balance kind="theorem" title="The excess of the inert count over its expected size is an exact combination of smoothed prime sums over the characters of the auxiliary group" source="alpoge-lean"}
:::: statement
Assume `HostFactsS D S`. For every $a>0$, every $t\in A$, every weight $\mathsf w>0$ on $\Phi$, and every cutoff $N$ with $a/\mathsf w(\rho)\le N$ for all $\rho\in\Phi$,
$$
\mathrm{ASK}-\mathrm{MAIN}=\frac1{\lvert\Phi\rvert}\sum_{g\notin\Phi}\ \sum_{\psi\in\widehat{\mathcal G}}\overline{\psi(g)}\ \mathsf w\bigl(\text{partner}_t(g)\bigr)\ \mathrm{GPsi}\Bigl(\psi,\frac{a}{\mathsf w(\text{partner}_t(g))}\Bigr),
$$ {#eq-ig-balance}
where $\widehat{\mathcal G}$ is the group of characters of $\mathcal G$. The right side is the code's `De`.
::::
:::: plain
Counting prime powers whose Frobenius lands in a given part of a finite group, with the ramp weight, gives its expected size plus a sum of smoothed prime sums, one for each character of the group, each rescaled to its own cutoff.
::::
:::: why
It is the bridge from an arithmetic count, which the chain can bound, to the smoothed sums $g_\chi$ that Landau's argument reads. Without it an upper bound on the count would say nothing about zeros.
::::
:::: idea
Orthogonality of characters writes the indicator of "Frobenius of $p^i$ equals $g$" as $\frac1{\lvert\Phi\rvert}\sum_\psi\overline{\psi(g)}\psi(f_{p^i})$, up to the factor $2$ that matches the $2\log p$, at unramified primes (`OrthoUnram`) and as an average over the inertia coset at ramified ones (`OrthoRam`). Summing over $g\notin\Phi$ and $i$ rewrites the count as a sum over characters of twisted smoothed sums with cutoffs $a/\mathsf w$. Each twisted sum is its `GPsi` minus its main term, and the main terms add up, by `ColourSum`, to `MAIN`, because only the trivial character and $\chi_C$ survive the sum over $g\notin\Phi$.
::::
:::: proof {collapsed}
The code proves the identity as `Deduction.ch_balance` (`DedekindLFunctions/LandauTheorems/ChBalance.lean`, line 200). It first applies `askExp`, the proved instance of `AskExpansion`, which states
$$
\mathrm{ASK}=\frac1{\lvert\Phi\rvert}\sum_{g\notin\Phi}\sum_\psi\overline{\psi(g)}\sum_{n\le N}\Lambda(n)\,\mathrm{primVal}(\psi,n)\Bigl(\frac an-\mathsf w(\text{partner}_t(g))\Bigr)_+ ,
$$
with lemmas for the unramified primes, the split primes $2$ and $\mathsf q_1$, and the ramified prime $\mathsf d$. With $\mathsf w_g=\mathsf w(\text{partner}_t(g))$, the identity $\sum_n\Lambda(n)(a/n-\mathsf w_g)_+=\mathsf w_g\sum_{n\le a/\mathsf w_g}\Lambda(n)\bigl(\frac{a/\mathsf w_g}n-1\bigr)$ turns each inner sum into $\mathsf w_g\cdot\mathrm{GPsi}(\psi,a/\mathsf w_g)$ plus a main term (`sum_cut`, `inner_eq`), and `ColourSum`, which says that $\sum_{g\notin\Phi}\overline{\psi(g)}$ is $\lvert\Phi\rvert$, $-\lvert\Phi\rvert$, or $0$ as $\psi$ is trivial, $\chi_C$, or neither, adds the main terms up to `MAIN`. We read the statement and the top level of the proof, and the lemmas by their statements.
::::
:::: example
For $\mathcal G=\Gal(\QQ(i)/\QQ)$ of order $2$, $\mathsf w\equiv1$, and the prime $2$ removed by hand, the identity becomes [[eq-ig-toy-balance]], which the table above checks. This specialization is ours: in the code the smallest group is $(\ZZ/2\ZZ)^2$ and the prime $2$ splits.
::::
:::: lean {decl="Formalism.LFunctionChainParameters.characterSumData.AskMainBalance" file="Formalism/SizeWindowBrackets/FirstPrimeNeSecondPrime.lean"}
`ASK`, `MAIN`, `De`, and `AskMainBalance` are defined at lines 84 to 98 under `HostFacts`, and the version used on the spine is the theorem `Deduction.ch_balance` under `HostFactsS`.
::::
:::: used
Used in [[t-ig-core]].
::::
:::::

```lean
def ASK (D : ArithData H) (N : ℕ) (a : ℝ) (t : H) (w : E0 × H → ℝ) : ℝ := by
  classical
  exact (∑ p ∈ (range (N + 1)).filter (IsInert D), 2 * Real.log p * askP D N a t w p)
    + Real.log D.d * askD D N a t w

def MAIN (ell : AddChar (E0 × H) ℂ → ℂ) (a : ℝ) (w : E0 × H → ℝ) : ℂ :=
  (a : ℂ) * (((Real.log a - 1 - Real.eulerMascheroniConstant : ℝ) : ℂ) + ell chC
    - (((1 / ((PhiSet (H := H)).card : ℝ)) * ∑ ρ ∈ PhiSet (H := H), Real.log (w ρ) : ℝ) : ℂ))
```

## From the count to $G_r$ {#ig-to-gr}

The identity [[eq-ig-balance]] holds for one value of $t$ and one weight $\mathsf w$. The chain supplies an upper bound on the excess $\mathrm{ASK}-\Re\,\mathrm{MAIN}$ summed over a set $\mathcal T\subseteq A$ of values of $t$ (the code's `TT`, whose elements we call shifts) and over the $m$ steps $j$ of the chain, each with its own weight $\mathsf w_j$. The code calls this sum the gap,
$$
\mathrm{gapA}(u_0)=\sum_{t\in \mathcal T}\sum_{j=1}^{m}\Bigl(\mathrm{ASK}\bigl(a_t,t,\mathsf w_{u_0,j}\bigr)-\Re\,\mathrm{MAIN}\bigl(a_t,\mathsf w_{u_0,j}\bigr)\Bigr),
$$
with one gap for each element $u_0$ of a subgroup $A_0\subseteq A$ (the code's `Frame.A0`), and it turns gaps into a bound on $G_r$ in the theorem `core_gm`.

::::: card {#t-ig-core kind="theorem" title="A small gap between the inert count and its expected size, at a scale $x$, bounds $G_r(x)$ by $x^{1/2+O(\varepsilon)}$" source="alpoge-lean"}
:::: statement
For every level $\mathsf L$, every $e_D,e_L,K,c_{HH},e_K,C$, and every $\varepsilon>0$ there is $x_1$ such that for every $x\ge x_1$, every frame $\varphi$ with a host satisfying the axioms `HostAx`, and every finite set $\mathcal T$ in the frame's group, if the host satisfies the explicit-formula conditions `EAtH` with constant $C$ at $x$ and the chain conditions `CoreAtH` with constants $e_D,e_L,K,c_{HH},e_K$ at $x$, then
$$
G_{\mathsf L}(x)\le x^{1/2+(e_D+e_L+7)\varepsilon}.
$$
For the cyclic level of a primitive character $\chi$ of order $r$, $G_{\mathsf L}$ is the function $G_r$ of [[landau-endgame]].
::::
:::: plain
If, at a scale $x$, the weighted count of inert prime powers never exceeds its expected size by much, and the characters that are not kept are already known to be small, then the combination of smoothed prime sums that Landau's argument needs is at most $x^{1/2}$ times a small power of $x$.
::::
:::: why
This is the one-sided bound that [[landau-endgame]] consumes at each scale of each window. It is the last place where the chain of theta lifts enters the proof.
::::
:::: idea
Apply [[t-ig-balance]] to every $t$, every step $j$, and every coset representative $u_0$, and add. Averaging over $u_0\in A_0$ is orthogonality on the subgroup $A_0$: it kills every character that is not trivial on $A_0$ and multiplies the rest by $\lvert A_0\rvert$. Among the survivors, the kept characters, those that come from the cyclic group of $\chi$, appear with weight $1$ for the trivial character and $\frac1{3r+1}$ for the others, because the set $\mathcal T$ meets each coset of $A_0$ in that proportion. The remaining survivors are bounded in absolute value by $x^{1/2+\varepsilon}$, and the gap is bounded by the chain. What is left is $G_r(x)$ against a power of $x$. In our reading this is Bombieri's twisted count of [[t-st-lower]] turned around. There, upper bounds for all twists but one bound the last one from below, and here an upper bound on one count, together with bounds on every twist that is not kept, bounds the kept combination from above.
::::
:::: proof {collapsed}
We read the proofs of `core_gm`, `ch_core`, `core`, and `ch_top` in full and the statements of the lemmas they call. The argument has five moves.

1. `core_gm` (`PrimitiveCosets/CoreGm.lean`) unpacks `CoreAtH` into a data record `Dd`, the arithmetic data, a set $T_2$, sizes $a_t$, weights $\mathsf w$, and the identification `IdentU` of the record's abstract fields `Dd.ASK` and `Dd.Main` with the arithmetic `ASK` and `MAIN`, and it applies `Deduction.ch_core` with $C=e_D+e_L+3$, the weight $\frac1{3r+1}$, the kept set `keptA` at the level, and the character conditions `charsA`.
2. The gap hypothesis of `ch_core` comes from `ch_top` (`LandauTheorems/ChTop.lean`), which uses `IdentU` and `ch_top_main_eq` to write $\mathrm{gapA}(u)=\mathrm{Dd.ASK}(u)-\mathrm{Dd.Main}(u)$, then `each_unit_bound_statement` to bound this by $\mathrm{ErrX5at}(u)$ from the record `SizeData₂` of [[ig-sizedata]], and finally `ErrWindows` and `BNBoundsU` to bound $\mathrm{ErrX5at}(u)$ by $x^{C_{\mathrm{Err}}\varepsilon}$ times the bracket, with $C_{\mathrm{Err}}\le e_D+e_L+3$.
3. The lemma `core` (`LandauTheorems/ChCore.lean`, line 283) adds [[t-ig-balance]] over $t$ and $j$, moves each term to the common scale $a_t/b$ at a cost $2b/x$ (`th_le`), and averages over $u_0\in A_0$, where `sum_A` keeps exactly the characters trivial on $A_0$. It bounds $\lvert \mathcal T\rvert\,m\,b\,\frac{\delta_2}{2}\,Y$ by $\mathrm{Err}+2\lvert \mathcal T\rvert mb/x$ for any $Y$ below the averaged character sum.
4. The lemma `one_char` bounds the character sum from below one character at a time: $G_0$ for the trivial character, $\frac1{3r+1}\Re\,\mathrm{GPsi}$ for a kept one up to the equidistribution error of `CharsA`, and $-\lVert\mathrm{GPsi}\rVert$ for an unkept one. Taking $Y=\mathrm{GmA}-\mathrm{SigA}-4x^{1/2+\varepsilon}$ and `proposition_size_bound` gives the conclusion of `ch_core`, $\mathrm{GmA}(x)\le x^{1/2+(C+3)\varepsilon}+\mathrm{SigA}(x)$.
5. `core_gm` finishes with `gmA_eq`, which identifies the frame sum `GmA` with $G_{\mathsf L}$, and `sigA_le`, which bounds the unkept part by $4r\,x^{1/2+\varepsilon}$ using the bounded characters of `EAtH`, so that $G_{\mathsf L}(x)\le(1+4r)\,x^{1/2+(e_D+e_L+6)\varepsilon}$, which is at most $x^{1/2+(e_D+e_L+7)\varepsilon}$ once $x^\varepsilon\ge1+4r$.

Moves 1 to 4 are confirmed in the code. In move 5 we confirmed the calls, and the statements of `gmA_eq` and `sigA_le` are as our reading of the endgame gives them.
::::
:::: lean {decl="UpperTheory.Comparison₂.core_gm" file="Development/AutomorphicArithmetic/PrimitiveCosets/CoreGm.lean"}
Proved by `ch_core` with the gap bound from `ch_top`; used by `windowInequality_of_artinInputs` and `level_gm_le_on_family_scales`, which proves `ChebyshevInequalityOnWindows` for every level.
::::
:::: used
Gives the hypothesis `h112` of `zeroFreeOn_of_tiedWin_cyc` in [[landau-endgame]].
::::
:::::

The chain's length appears in this region in two hypotheses: `ch_core` assumes $m\le x^{1/2+\varepsilon/2}$ and `RestSize` assumes $x^{1/2-\varepsilon}\le m$, and `RankVal` of [[multiplicity-from-lifts]] fixes $m$ between $x^{1/2-\varepsilon/16}$ and twice that, which satisfies both: the note's $\sqrt X$. The scales of this region are the following, and the full dictionary is in [[ml-scales]].

| Quantity | Size at scale $x$ | Where |
| --- | --- | --- |
| chain length $m$ | allowed between $x^{1/2-\varepsilon}$ and $x^{1/2+\varepsilon/2}$; fixed between $x^{1/2-\varepsilon/16}$ and twice that | `ch_core`, `RestSize`; `RankVal` |
| number of shifts $\lvert \mathcal T\rvert$ | at least $x^{-\varepsilon/8}\lvert A\rvert/2$ | `RestSize` |
| weight of a kept nontrivial character | $\frac1{3r+1}$ | `core_gm`, `CharsA` |
| unkept characters | $\lvert g_\chi(x)\rvert\le x^{1/2+\varepsilon}$ | `EAtH`, `PairGood` |
| gap allowed | $x^{(e_D+e_L+3)\varepsilon}$ times a bracket | `ch_top` |
| result | $G_r(x)\le x^{1/2+(e_D+e_L+7)\varepsilon}$, with $(e_D,e_L)=(2,0)$ on the spine | `core_gm` |
| windows | $[Y,Y^{3/2}]$ | [[landau-endgame]] |

### Where the chain's divisibility is paid {#ig-sizedata}

In the code the upper bound on the count follows from a record of eleven inequalities on abstract data `Dd`, `SizeData₂`: ranges (`HidaSetting`, `FParams`), a divisibility inequality `DIV` in which the chain length $m$ multiplies the main term, comparisons (`EComp5`, `HComp`), a count `Count5`, bounds on slopes of lattices (`Slopes`, `QuotientSlopeBoundsWith`, `SlopeIneq`), a loss bound `LossBounds` containing $\mathrm{Dd.ASK}(u)-\mathrm{Dd.Ga}(u)\le\mathrm{LoP}$, and `HHBound`. The theorem `each_unit_bound_statement` bounds $\mathrm{Dd.Ga}$ from above with the divisibility, slope, and count conditions (`Ga_bound5`) and adds the loss. As our reading, `DIV` is the order of vanishing, the slopes are the degree budget, and the conclusion is [[t-st-upper]]. The record is a conjunct of `ChainTied`, which [[landau-endgame]] requires at every large scale of a window. Which lattices enter `DIV` and the slopes was not traced, and neither was how the chain's divisibility and integrality (`ThmP`, `DGam`, `chain_ge`, `PeriodClassSumWeyl`, and the exponents of `LeafDepthGood`) feed the divisibility inequality `DIV`, in this chapter, in [[definite-forms]], or in [[multiplicity-from-lifts]].

::: lean {decl="Formalism.LFunctionChainParameters.LChain.SizeData₂" file="Formalism/SizeWindowBrackets/SChain.lean"}
`SizeData₂ Dd C Xpp := Dd.HidaSetting C ∧ Dd.DIV C ∧ EComp5 Dd C ∧ Dd.HComp C ∧ Count5 Dd C ∧ Dd.Slopes C ∧ QuotientSlopeBoundsWith Dd C Xpp ∧ LossBounds Dd C ∧ Dd.SlopeIneq ∧ Dd.HHBound C ∧ Dd.FParams`; the theorem `each_unit_bound_statement` is in `ChainSlopeWindows/LevelOfCongruence.lean`.
:::

## Characters that get their bound for free {#ig-pairgood}

The unkept characters of [[t-ig-core]] need $\lvert g_\chi(y)\rvert\le y^{1/2+\varepsilon}$ before the argument starts, and that is a statement of the strength of the hypothesis itself. The code arranges that every such character is a twist $\xi\cdot(\cdot/\mathsf q)^i(\cdot/\mathsf d)^j$ with $(i,j)\ne(0,0)$, where $\xi$ is a character of the modulus $M$ of $\chi$ and $(\cdot/\mathsf q)$, $(\cdot/\mathsf d)$ are Jacobi symbols of two auxiliary primes (`boundedTw`, `CharacterBoxes/BoundedTw.lean`), and it supplies the bound for these twists through `PairGood`.

```lean
structure PairGood (M : ℕ) (eps Y X : ℝ) (q d : ℕ) : Prop where
  pair : WinPair eps Y q d
  coprime : Nat.Coprime M (q * d)
  bounds : ∀ (ξ : DirichletCharacter ℂ M) (i j : Fin 2), (i ≠ 0 ∨ j ≠ 0) →
    ∀ (N : ℕ) [NeZero N] (χ : DirichletCharacter ℂ N), An.Induces χ (tw (fun a => ξ (a : ZMod M)) q d i j) (2 * M * q * d) →
      ∀ y : ℝ, Y ≤ y → y ≤ X → ‖An.gChi χ y‖ ≤ y ^ ((1 : ℝ) / 2 + eps / 2) ∧ ‖An.logDerivativeAtOne χ‖ ≤ 4 * Real.log y
  boxes : ∀ ρ : PChar, ρ.IsReal → ρ.N ∣ 8 * M → ∀ i j : Fin 2, (i ≠ 0 ∨ j ≠ 0) →
    ∀ (N : ℕ) [NeZero N] (χ : DirichletCharacter ℂ N), An.Induces χ (tw ρ.val q d i j) (2 * M * q * d) →
      ZeroBox (height M eps Y j) χ
```

::::: card {#t-ig-pairex kind="theorem" title="For every modulus and every small $\varepsilon$ there are auxiliary primes $\mathsf q$ and $\mathsf d$ whose Jacobi twists satisfy square-root bounds on a long range" source="alpoge-lean"}
:::: statement
For every $M\ge1$, every $\varepsilon\in(0,\tfrac1{52})$, and every $A\ge1$ there is $Y_1$ such that for every $Y\ge Y_1$ there are primes $\mathsf q,\mathsf d$ with `PairGood M ε Y (Y^A) q d`: $\mathsf q\equiv3\pmod8$ and $\mathsf d\equiv7\pmod{16}$ in the size ranges of `WinPair` (with $\log \mathsf q$ about $Y^{\varepsilon/5}$ and $\log \mathsf d$ about $Y^{\varepsilon/5}\log^2Y$), $M$ coprime to $\mathsf q\mathsf d$, and for every character $\xi$ modulo $M$, every $(i,j)\ne(0,0)$, the primitive character $\chi$ inducing $\xi\cdot(\cdot/\mathsf q)^i(\cdot/\mathsf d)^j$ satisfies
$$
\lvert g_\chi(y)\rvert\le y^{1/2+\varepsilon/2},\qquad\Bigl\lvert\frac{L'}{L}(1,\chi)\Bigr\rvert\le4\log y\qquad(Y\le y\le Y^A),
$$
and for every real primitive character $\rho$ of conductor dividing $8M$ and every $(i,j)\ne(0,0)$, the primitive character inducing $\rho\cdot(\cdot/\mathsf q)^i(\cdot/\mathsf d)^j$ has no zero with $\Re s>1-\tfrac1{400}$ and $\lvert\Im s\rvert$ up to a prescribed height (`ZeroBox`).
::::
:::: plain
We do not know that every character's prime sum has square-root size. But among all primes $\mathsf q$ of a given size, the twisted prime sums are of square-root size on average, so most $\mathsf q$ are good, and the proof only needs one good pair of primes, which it is free to choose.
::::
:::: why
Without it the characters that [[t-ig-core]] cannot keep would carry an uncontrolled sign, as $\chi_4$ does in [[eq-ig-toy-balance]], and the gap would bound nothing.
::::
:::: idea
Expand the mean square over many moduli $\mathsf q$ of $S_{\mathsf q}(y)=\sum_{n}\Lambda(n)\min(1,y/n)(n/\mathsf q)$. The diagonal, the pairs with $nn'$ a square, gives about $y\log y$ per modulus, and the off-diagonal terms $\sum_{\mathsf q}(nn'/\mathsf q)$ are small because by quadratic reciprocity they are sums of a fixed character over primes in a progression. So $\lvert S_{\mathsf q}(y)\rvert^2$ is about $y\log y$ on average, and by Chebyshev's inequality few $\mathsf q$ have $\lvert S_{\mathsf q}(y)\rvert$ much larger than $\sqrt y$. A separate count shows that few $\mathsf q$ have a twisted L-function with a zero near $1$, and $\mathsf q$ is picked outside both bad sets, then $\mathsf d$ the same way. This is the mean-square form of the large sieve for real characters [@heathbrown1995; @iwaniec-kowalski-ant, ch. 7], and as far as the statements show, it is what the code does.
::::
:::: sketch {source="alpoge-lean"}
`UpperTheory.Top.PairEx` is proved as `QH.pairEx` (`Development/AutomorphicArithmetic/MeanSquareBounds/pairEx.lean`, line 112) from `pair_exists`, which gives primes $\mathsf q,\mathsf d$ in the ranges of `Rows` with `GoodQ` and `GoodD`, that is, with every twisted character in a `Box`: zero-free in the box, $\lvert\frac{L'}{L}(1,\chi)\rvert\le C\log Y$, and $\lvert g_\chi(y)\rvert\le y^{1/2+\tau}$ on $[Y,X]$. `pair_exists` comes from `pair_share`, which makes a share at least $1-\eta$ of the admissible $\mathsf q$ good and, for each good $\mathsf q$, a share at least $1-\eta$ of the admissible $\mathsf d$. Its inputs, read by statement, are `meanSqK` (the mean square $\sum_{\mathsf q\in P}\lvert S\rvert^2\le Cy\log y\cdot\lvert P\rvert$ for $y\in[Y,Y^K]$ over primes $\mathsf q$ in a progression), `meanSq_abs` (the expansion of the square, with the hypothesis that $\lvert\sum_{\mathsf q\in P}(\mathsf q/s)\rvert\le\eta\lvert P\rvert$ for odd squarefree $s$ in range), `bad_share` (Chebyshev: the share of $\mathsf q$ with $\lvert S_{\mathsf q}(y)\rvert>y^{1/2+\tau}/2$ for some $y\in[Y,X]$ is at most $\eta$), `count_bad` (at most $CQ^{1/4}$ primes $\mathsf q$ carry a primitive twist with a zero in the box), and `small_zeros` (no real zero within a fixed distance of $1$ for characters of bounded modulus). We state these and do not unfold their proofs.
::::
:::: example
With the sharp cutoff $n\le y$ in place of the weight $\min(1,y/n)$, a simpler variant of ours, and for $y=1000$, $2000$, and $5000$ and the $221$ primes $\mathsf q\equiv3\pmod8$ between $100{,}000$ and $110{,}000$, the sums $S_{\mathsf q}(y)=\sum_{n\le y}\Lambda(n)(n/\mathsf q)$ have root mean square $2.65\sqrt y$, $2.69\sqrt y$, and $2.66\sqrt y$, a mean square of $1.02$, $0.95$, and $0.83$ times $y\log y$, and a largest value of $6.5\sqrt y$, $6.2\sqrt y$, and $7.1\sqrt y$, against $\psi(y)\approx y$ for the untwisted sum. Between $13.6\%$ and $15.8\%$ of these $\mathsf q$ have $\lvert S_{\mathsf q}(y)\rvert>4\sqrt y$. The prime $\mathsf q=100{,}003$ gives $S_{\mathsf q}(5000)=4.28\sqrt{5000}$.
::::
:::: lean {decl="UpperTheory.Top.PairEx" file="Development/AutomorphicArithmetic/CharacterBoxes/PairGood.lean"}
Consumed through `supplyChi`, `hostOfField`, and `winPairs`, and by `boundedTw`, which gives `BoundedCharsPointwise` for the unkept frame characters.
::::
:::: used
Supplies the bounded characters of `EAtH` in [[t-ig-core]].
::::
:::::

:::: figure {#f-ig-mean-square viz="twist-mean-square" height="440"}
Across hundreds of auxiliary primes, prime sums twisted by a quadratic character have square-root size on average, so a good prime is easy to find even though no single one is guaranteed.

```vizspec
Purpose: show the averaging over auxiliary primes behind PairGood.
Scene: left panel, horizontal axis y in [100, 5000] (log scale), vertical axis S_q(y)/sqrt(y) in [-8, 8],
  where S_q(y) = sum over prime powers n <= y of Lambda(n) * (n/q) (Legendre symbol). One thin muted curve
  per prime q = 3 mod 8 in [100000, 110000] (221 curves), the selected q in gold, the band |S| <= 4 sqrt(y)
  in blue. For contrast a red dashed curve psi(y)/sqrt(y) = sqrt(y) roughly, clipped at the top.
  Right panel, a histogram of S_q(y0)/sqrt(y0) over all 221 primes at the slider value y0, with the root
  mean square printed.
  Precompute once: the 711 prime powers up to 5000 with Lambda, and for each q the Legendre symbols of the
  711 prime powers (about 157,000 modular exponentiations), then cumulative sums along the prime powers.
Controls: slider y0 over [100, 5000]; selector for the highlighted q (default 100003).
Motion: moving y0 slides a vertical cursor on the left and redraws the histogram.
Reader takeaway: the twisted sums wander at size sqrt(y), a few primes wander further, and the untwisted sum
  is a different order of magnitude.
Check values: rms of S_q(y)/sqrt(y) over the 221 primes: 2.648 at y = 1000, 2.692 at y = 2000, 2.655 at
  y = 5000; max |S_q(y)|/sqrt(y): 6.518, 6.190, 7.123; q = 100003 at y = 5000: 4.279.
```
::::

## Steps 14 and 15 of the note {#ig-missing}

The note's step 14 is the "precise computation of the 'cost' of each lift, showing that one would stop at 2/3 a priori", with a "need for 'division'", and step 15 is to "glue together an integral structure across Hecke characters for a 'gcd'", which it glosses as "extra averaging" [@alpoge-note]. Our readings of the endgame and of the integrality bookkeeping did not locate them, and a second search by content did not either. A search of the index for $\tfrac23$ returns a few dozen statements, and none that we inspected is recognizably a cost of lifts: they include elementary inequalities such as $\lvert\log(1+x)-x\rvert\le\tfrac23x^2$, local bounds on $\zeta'/\zeta$ and $L'/L$ in discs of radius $\tfrac23$, and a bound involving real zeros with $\beta\ge\tfrac23$. The declarations named for a greatest common divisor, such as `binomGcd`, `SymplGcd`, and `gcdSum`, concern, by their names and folders, binomial coefficients, heights, and a Rankin and Selberg sum. For "division", `ZetaCharacterDivisibility` is the unrelated division of Galois representations of [[ig-divall]]. What follows are candidates, not findings. For step 14, a candidate is the pair `LinkN_at` and `divinN_at`. `LinkN_at` bounds, for each lift $j$, a weighted sum `etaSum` of exponents at places $w$ by a size term plus the total log-length $\sum_\ell$ `vvTerm` of the groups $\text{Sha}^1$ of [[cohomology-window]], and `divinN_at`, reached through `divinN_of_hypV`, uses the bound of `VVle` on that log-length to turn it into `DIVinN_at`, a bound by a size term alone. This matches the note's "kill via twisting" and "division" in shape, but not in any statement we could check, and no $\tfrac23$ appears in it. For step 15, a candidate is the average over the subgroup $A_0$ in the proof of [[t-ig-core]], an average across characters of the frame group that lets the kept characters appear with positive weights; that it is the note's "extra averaging" is our conjecture. The page did not locate these two steps in the code.

## The chain of Route A {#ig-route}

Each joint names its declaration and a marking. **Confirmed** means the statement and the proof's calls were read in the code, **statements** means only the statements were read, and **our reading** marks an interpretation.

1. Theta chain data. `HypsAlt` and `Green` give `TopG` (`shape_closed_link_n_of_green`, `topDesWin`), whose `FamilyClassConnected` provides a family that is `ChainTied` at every large scale of its windows ([[t-le-interface]], step 2; its proof is not unfolded, [[ml-gaps]]). Statements, from our reading of the endgame and our reading of the theta-integral assembly.
2. Hosts on windows. `VWin` gives `HostExW (3/2) (GChi ψ).req` through `supplyChi` and `winPairs`, with auxiliary primes from `PairEx` ([[t-ig-pairex]]). Statements, from our reading of the endgame, with `PairGood`, `PairEx`, and `boundedTw` confirmed.
3. `Row0b` gives `VWin` by `vwin_of_row` ([[cohomology-window]]). Confirmed at the call.
4. `GeoOne` and `TLiftK` give `Row0b` by `galoisLocalGlobalStrong_of_geometry_lift` ([[t-ig-assembly]]). Confirmed.
5. `ChainTied` contains `SizeData₂` and `Ident`, which ties the record's count to `ASK`. Confirmed. That the record's numbers are the divisibility and slopes of the $m$ lifts is our reading.
6. `each_unit_bound_statement`: $\mathrm{Dd.ASK}\le\mathrm{Dd.Main}+\mathrm{ErrX5at}$. Confirmed.
7. `ch_top`: $\mathrm{gapA}\le x^{C_{\mathrm{Err}}\varepsilon}$ times the bracket. Confirmed.
8. `ch_balance`: $\mathrm{ASK}-\mathrm{MAIN}=\mathrm{De}$ ([[t-ig-balance]]). Confirmed.
9. `core` and `ch_core`: $\mathrm{GmA}\le x^{1/2+(C+3)\varepsilon}+\mathrm{SigA}$. Confirmed.
10. `core_gm`: $G_r(x)\le x^{1/2+(e_D+e_L+7)\varepsilon}$ ([[t-ig-core]]). Confirmed, with `gmA_eq` and `sigA_le` as statements.
11. `level_gm_le_on_family_scales` proves `ChebyshevInequalityOnWindows` for every level. Confirmed.
12. `zeroFreeOn_of_tiedWin_cyc`, `formB`, and `zeroFree_of_rpow_window` turn the bound on windows $[Y,Y^{3/2}]$, exponent $\tfrac12+9\varepsilon$ with $(e_D,e_L)=(2,0)$, into `ZeroFreeAll`, and `imprimitive` and `rh_of_every` finish ([[landau-endgame]]). Statements, from our reading of the endgame.
13. Joints 5 to 10 as Stepanov's argument: inert prime powers for rational points, divisibility of the lifts for vanishing order, slopes for degree, orthogonality for the Galois trick. Our reading.

::: symbols
| Symbol | What it is | Kind | Where it lives |
| --- | --- | --- | --- |
| $\varrho$, $\varrho^{\mathrm{big}}$ | an $\ell$-adic Galois representation of rank $n$, and a larger one from geometry | homomorphisms $\Gal(\overline E/E)\to\GL(\overline\QQ_\ell)$ | [[d-ig-galrep]], [[ig-geoone]] |
| $\chi_{\mathrm{cyc}}$ | the cyclotomic character | character to $\ZZ_\ell^\times$ | [[eq-ig-cyc]] |
| $T_\ell E$ | the Tate module of an elliptic curve | $\ZZ_\ell$-module of rank 2 | [[ig-galois]] |
| $a_p$ | Hecke eigenvalue and Frobenius trace | integer | [[t-ig-eichler-shimura]] |
| $\mathrm{HT}_\tau$, $w_0$ | Hodge and Tate weights at $\tau$, and the weight of the polarization | multiset of integers, integer | [[t-ig-row0b]] |
| $\mathrm{rec}(\pi_w)$ | the local parameter given by `recT` | Weil and Deligne representation | [[t-ig-row0b]] |
| $\kappa$, $\psi_{i,k}$ | twist and auxiliary characters of the two lifts | Hecke characters of $E$ | [[eq-ig-isup]] |
| $A_4$, $M_4$, $B_2$ | toy count of inert prime powers in $\QQ(i)$, its expected size, the prime-2 term | functions of $X$ | [[eq-ig-toy-count]] |
| $\mathcal G$, $\Phi$, $\chi_C$ | the group $(\ZZ/2)^2\times A$ with $A$ the frame group (`E0 × H`), which is $\Gal(E/\QQ)$ of the host's CM field; its index-two subgroup fixing $\sqrt{-\mathsf d}$; the character off $\Phi$ | finite abelian group, subgroup, character | [[ig-ask]] |
| $f_p$ | Frobenius element of $p$ in $\mathcal G$ | group element | [[ig-ask]] |
| $\mathsf w$ | weights on $\Phi$ | positive function | [[eq-ig-ask]] |
| $\mathrm{ASK}$, $\mathrm{MAIN}$, $\mathrm{gapA}$ | inert count, expected size, summed excess | real numbers | [[eq-ig-ask]], [[ig-to-gr]] |
| $\mathcal T$, $A_0$, $u_0$ | set of shifts, averaging subgroup (`Frame.A0`), one of its elements | subset of $A$, subgroup of $A$, element | [[t-ig-core]] |
| $\mathsf L$, $G_{\mathsf L}$ | a level and its combined prime sum, which is $G_r$ for the cyclic level of $\chi$ | level, function | [[t-ig-core]] |
| $\mathsf q$, $\mathsf q_1$, $\mathsf d$ | auxiliary primes of `PairGood`; $\mathsf q_1$ is the host's $\mathsf q$ as recorded in `ArithData` | primes | [[ig-ask]], [[t-ig-pairex]] |
:::

::: recap
- A Galois representation lets a prime act as a Frobenius on a vector space. The cyclotomic character has trace $p$ at $p$, an elliptic curve has trace $a_p=p+1-\#E(\FF_p)$, and a weight-two newform has a representation with trace $a_p$ ([[t-ig-eichler-shimura]]).
- `Row0b` attaches to every regular algebraic polarized cuspidal representation of $\GL_n$ over a CM field an $\ell$-adic representation with Frobenius data matching its local data, Hodge and Tate weights from its weights at infinity, and a weakened compatibility at ramified places ([[t-ig-row0b]]). It is used for the window bound of [[cohomology-window]] and for the literature record of the theta-integral assembly, not for integrality.
- The code proves `Row0b` from `GeoOne` and `TLiftK`: geometry, division of polynomials, congruences, an $\ell$-adic limit, and one double theta lift for even rank ([[t-ig-assembly]]).
- A weighted count of inert prime powers minus its expected size is exactly a combination of smoothed prime sums over the characters of a finite group ([[t-ig-balance]]), checked for $\QQ(i)$ in [[eq-ig-toy-balance]].
- The chain bounds that count through a record of divisibility and slope inequalities, and averaging over a subgroup turns the bound into $G_r(x)\le x^{1/2+9\varepsilon}$ ([[t-ig-core]]), which [[landau-endgame]] converts into zero-freeness. The characters that cannot be kept are twists by Jacobi symbols of auxiliary primes, bounded by averaging over the primes ([[t-ig-pairex]]).
- The note's steps 14 and 15 were not located in the code.
:::
