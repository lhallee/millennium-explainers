---
id: multiplicity-from-lifts
title: "Multiplicity without derivatives: a chain of length about the square root"
part: 4
summary: Read the chain of theta lifts in the formal proof as Stepanov's ledger over the integers, with the product formula as the degree budget, periods and interlacing as the way a form becomes a number, the seesaw as an exchange of sums, and the chain length m between the square root of x to the power 1 - eps/8 and twice that.
needs: [counting-primes, stepanov, definite-forms]
---

::: plain
Stepanov proved the Riemann Hypothesis for curves by building a function that vanishes many times at every point being counted while keeping its degree small. Over the integers there is no derivative to count "many times", so the new proof manufactures multiplicity another way: it lifts an automorphic form through a chain of about $\sqrt x$ unitary groups, one step at a time, and measures the result by how often a prime divides a number. The role of the degree is played by the product formula, which says that a nonzero number cannot be divisible by more primes than its size allows.
:::

The note that announced the proof describes it as a descendant of Stepanov's argument and locates the difficulty in one place, that "multiplicity is hard to find over the integers", and it says that a chain of theta lifts, "each mimicking multiplicity", supplies it [@alpoge-note]. This chapter is the center of Route A because it is where that sentence becomes declarations of the formal proof [@alpoge-lean]. It sets up Stepanov's ledger from [[stepanov]] column by column, fills each cell with what the code states, and leaves a cell open where nothing was found. It uses the objects of [[definite-forms]] (lattice classes, forms as functions on finitely many classes, the theta lift as a matrix) and adds what is specific to the chain, namely its length, the periods through which a form becomes a number, the seesaw that computes those periods, and the sizes the chain must respect. What the note says is cited to it, what the code states names its declaration, and our reading, which connects the two, is marked where it starts.

## Stepanov's ledger {#ml-ledger}

Chapter [[stepanov]] ended with a ledger. An auxiliary function $F$ on a curve vanishes to order at least $m$ at each of $N$ rational points, and it has a single pole of order at most $D$, so [[t-st-degree]] (a nonzero function has as many zeros as poles) gives
$$
mN \le D.
$$ {#eq-ml-stepanov}
Four other facts make the inequality useful. Frobenius turns "rational point" into an equation the auxiliary function can exploit ([[t-st-vanishing]]), $p$-th powers make the multiplicity free, the pole orders at one point keep $F$ from vanishing identically ([[t-st-nonzero]]), and the Riemann and Roch count guarantees that $F$ exists ([[t-st-existence]]). The closing section [[st-used]] observed that over $\ZZ$ "vanishing to order $m$ at $p$" can only mean divisibility by $p^m$, and that no derivative detects it.

The table below sets up the same ledger for the formal proof. Each cell in the third column is filled only from declarations that we opened. Where nothing was found the cell says so.

| Role | Over a curve ([[stepanov]]) | In the formal proof | Status |
| --- | --- | --- | --- |
| What is counted | rational points $P \ne P_0$ | prime powers inert in an auxiliary abelian field, in the reading of [[integrality-and-galois]]; the per-place budgets of `LeafDepthGood` run over prime ideals $w$, one budget per lift $j$ | partly located; the count is chapter [[integrality-and-galois]]'s |
| Auxiliary object | the function $F$ of [[eq-st-F]] | not located in the code as a single object; the quantities whose divisibility is measured are jets $J(y)$ (`LamP`) and periods of the iterated lift (`PeriodMap.PtilCol`) | partly located |
| Multiplicity $m$ | $\ord_P F \ge p^\mu$ | $\ell$-adic valuation, per place $w$ and per lift $j$ (exponents $e_0(w,j)$ in `LeafDepthGood`), with $m$ lifts | located |
| The source of multiplicity | $p^\mu$-th powers, $\frac{\dd}{\dd x}x^{jp} = 0$ | $\ell^i$-th powers of variables with an explicit factor $-\ell^{-e(\ell,i)}$ (`IncomingBounds.zetaP`, `hP`) | located; the analogy is our reading |
| Degree budget $D$ | pole order at $P_0$ | archimedean size, $\log^+\abs{\sigma x}$ averaged over embeddings | located |
| Zeros at most poles | [[t-st-degree]] | the product formula (`DivisionValues.prod_formula'`) and its consequence `AtG.norm_height_bound` | located, on the spine |
| Nonvanishing | [[t-st-nonzero]] | an upper bound on the valuation of some jet in every window of orders (`ThmP`), and a rank condition on the period map (`RKC`) | located; the role is our reading |
| Existence by counting dimensions | Riemann and Roch, [[t-st-existence]] | not located in the code | open |
| Frobenius | $h(P)^q = h(\Frob P)$ | not located in the code | open |
| Slope form of the budget | Bost's slope inequality, named in the note's step 13 | `DivisorInequality.DivIneqObjU` and `TheoremM` exist and are proved or stated, but are not reached from the final theorem | in the tree, off the spine |

The sixth and last rows carry the main finding of our reading of the theta lifts and the integrality bookkeeping. On the declarations that the final theorem actually uses, "a polynomial of degree $D$ has at most $D$ zeros" is played by the product formula, through `Formalism.AtG.norm_height_bound`, while two statements that look like the note's step 13, "Bost slope inequality" [@alpoge-note], were not reached by a dependency search from `UpperTheory.FinalTheorems.everyCharacter`. They are `DivIneqObjU` in `Formalism/DivisorInequality/DivIneqTopAnchorU.lean`, which compares a Harder and Narasimhan slope with the heights and local indices of $m$ lifted lattices, the shape of a slope inequality [@bost1996], and `TheoremM` in `Formalism/MahlerMeasure/StatementTM.lean` (proved as `Formalism.CountingSumsFrames.Top.theoremM`), an averaged bound on highly divisible elementary divisors of Gram matrices. Whether they record an earlier route the code does not say.

A shorter rewrite of the formal proof, read in chapter [[route-a-compressed]], has counterparts for several cells that are open here, Frobenius and the count of dimensions among them, and it puts the slope form of the budget on its spine. Section [[rc-ledger]] sets its entries beside these rows.

## The degree budget over the integers {#ml-product}

Chapter [[adeles]] proved the product formula for a nonzero rational number, $\abs x_\infty \prod_p \abs x_p = 1$ ([[t-ad-product-formula]]). Take logarithms and write $\abs x_p = p^{-v_p(x)}$, and it reads
$$
\sum_p v_p(x)\log p = \log\abs x_\infty .
$$ {#eq-ml-pf-q}
Read the primes as points and $v_p(x)$ as the order of vanishing of $x$ at $p$. Then the left side counts zeros with multiplicity, weighted by $\log p$, and the right side, the size of $x$ at the one archimedean place, plays the pole at infinity. A polynomial of degree $D$ on the projective line has zeros adding up to $D$, the order of its pole at infinity, and a nonzero integer has prime factors adding up to $\log\abs x$. The integer $1000 = 2^3 5^3$ has $3\log 2 + 3\log 5 = \log 1000$, as $x^3(x-1)^3$ has six zeros and a pole of order six at infinity.

The same holds in a number field, with one refinement. Let $F$ be a number field, $\mathcal O_F$ its ring of integers, and $w$ a nonzero prime ideal of $\mathcal O_F$ with norm $N(w) = \abs{\mathcal O_F/w}$. For $x \in F$ nonzero, $v_w(x) \in \ZZ$ is the exponent of $w$ in the factorization of the fractional ideal $x\mathcal O_F$. The norm $N_{F/\QQ}(x)$ is the product of the images $\sigma(x)$ over the $[F:\QQ]$ embeddings $\sigma\colon F \to \CC$, and its absolute value is $\prod_w N(w)^{v_w(x)}$. Taking logarithms gives the product formula of $F$,
$$
\sum_w v_w(x)\log N(w) = \sum_{\sigma\colon F\to\CC} \log\abs{\sigma(x)} ,
$$ {#eq-ml-pf}
which is a finite sum on the left because only finitely many $v_w(x)$ are nonzero.

::: example
In the Gaussian integers $\ZZ[i]$, take $x = 3 + 4i$. Since $(2+i)^2 = 4 + 4i + i^2 = 3 + 4i$, the only prime ideal that divides $x$ is $w = (2+i)$, of norm $5$, with $v_w(x) = 2$. The left side of [[eq-ml-pf]] is $2\log 5$. The two embeddings send $x$ to $3 \pm 4i$, each of absolute value $5$, so the right side is $2\log 5$ too.

Divisibility forces size. Suppose a nonzero integer $x$ with $\abs x \le H = 10^6$ is divisible by $p^2$ for each of $N$ distinct primes $p \ge 11$. Then [[eq-ml-pf-q]] gives $2N\log 11 \le \log 10^6$, so $N \le 13.82/4.80 = 2.88$, and $N \le 2$. Indeed $11^2\cdot 13^2 = 20{,}449$ fits under $10^6$, while $11^2\cdot13^2\cdot17^2 = 5{,}909{,}761$ does not. Multiplicity $m = 2$, points $N$, and budget $D = \log H/\log 11$ obey $mN \le D$, the inequality [[eq-ml-stepanov]].
:::

Chebyshev's budget of [[cp-chebyshev]] is [[eq-ml-pf-q]] for $x = \binom{2n}{n}$: every prime of the window $(n, 2n]$
divides $x$ once, and the binomial theorem bounds $\log\abs x$ by $n\log 4$, which bounds the window's weight. That
argument reaches the order of magnitude of $\psi$ and stops there, because each prime is paid for only once. The
formal proof keeps the inequality and changes two things, which the rest of this chapter describes: its numbers live in
a number field and are measured prime ideal by prime ideal, and the multiplicity that Chebyshev's numbers lack comes from
the chain of theta lifts ([[ml-chain]]). The bound its endgame consumes keeps his name, `ChebyshevInequalityOnWindows`
([[eq-le-interface]]).

The code's form of the budget allows denominators, because the numbers it measures are algebraic with controlled poles at finitely many primes, and it uses the weights $\varpi_w = \log N(w)/[F:\QQ]$ (the code's `lw`) and the mean over embeddings, and it states the product formula for a totally complex field $F$ as
$$
\frac{2}{[F:\QQ]}\sum_{v} \log\lVert v(x)\rVert = \sum_w \varpi_w\, v_w(x),
$$ {#eq-ml-pf-code}
where $v$ runs over the $[F:\QQ]/2$ complex places and $\lVert v(x)\rVert$ is the absolute value of $x$ under an embedding that defines $v$ (`Formalism.DivisionValues.ProdFormula`, proved as `prod_formula'`; the code calls the field `K`). Dividing [[eq-ml-pf]] by $[F:\QQ]$ and grouping each embedding with its conjugate gives exactly this.

::::: card {#t-ml-height kind="theorem" title="A nonzero algebraic number with bounded denominators is divisible by primes only as far as its archimedean size allows" source="alpoge-lean"}
:::: statement
Let $F$ be a totally complex number field and $x \in F$ nonzero. Let $\delta_w \ge 0$ be numbers attached to the prime ideals $w$ of $\mathcal O_F$ with $v_w(x) \ge -3\delta_w$ for every $w$ and $\sum_{w \in S}\varpi_w\delta_w \le B_\delta$ for every finite set $S$ of prime ideals. Then
$$
\sum_w \varpi_w\,\abs{v_w(x)} \;\le\; \frac{2}{[F:\QQ]}\sum_v \log^+\lVert v(x)\rVert + 6B_\delta ,
$$ {#eq-ml-height}
with $\log^+ t = \max(\log t, 0)$.
::::
:::: plain
A number's prime factors, counted with multiplicity and weighted by the logarithm of their size, cannot outweigh the logarithm of the number itself, once its denominators are paid for.
::::
:::: why
The formal proof uses it where Stepanov used "a nonzero function has as many zeros as poles". Without it, divisibility of a nonzero quantity could not be played against an analytic bound on its size.
::::
:::: idea
Write $\abs t = t + 2\max(0, -t)$. The signed sum is the archimedean mean by the product formula, and the negative parts are the denominators.
::::
:::: proof
::: steps
1. For every integer $t$, $\abs t = t + 2\max(0,-t)$. Apply it to $t = v_w(x)$ and sum with the weights $\varpi_w$, over the finitely many $w$ with $v_w(x) \ne 0$.
$$
\sum_w \varpi_w\abs{v_w(x)} = \sum_w \varpi_w v_w(x) + 2\sum_w\varpi_w \max(0, -v_w(x)).
$$
2. The first sum on the right is the archimedean mean by [[eq-ml-pf-code]], and $\log t \le \log^+ t$.
$$
\sum_w \varpi_w v_w(x) = \frac{2}{[F:\QQ]}\sum_v\log\lVert v(x)\rVert \le \frac{2}{[F:\QQ]}\sum_v\log^+\lVert v(x)\rVert .
$$
3. The hypothesis $v_w(x) \ge -3\delta_w$ gives $\max(0,-v_w(x)) \le 3\delta_w$, and the finite sum of $\varpi_w\delta_w$ is at most $B_\delta$.
$$
2\sum_w\varpi_w\max(0,-v_w(x)) \le 6\sum_w \varpi_w\delta_w \le 6B_\delta .
$$
:::
Adding the three lines gives [[eq-ml-height]]. This is the proof the code gives, through the abstract inequality `Formalism.ValuationGridEstimates.AbsValuationSumBound` (proved as `height_bound_alt`) applied to the product formula.
::::
:::: lean {decl="Formalism.AtG.norm_height_bound" file="Formalism/LocalToGlobal/ExponentGrids/ExponentGridsProofs/FrameHeightOfDualSlope.lean"}
Proves `DisjointUnionFactorProduct` (stated in `Formalism/LocalToGlobal/ExponentGrids/ScaledCoordinatesValuationLemma.lean`), the statement above, with $\varpi_w$ and $v_w$ defined as `lw` and `vw` in `Formalism/QuotientMetricDivisors/Statement.lean`.
::::
:::: used
It is the degree side of the closing ledger [[ml-closing]], and it is reached from the final theorem through `Formalism.L2.Indef.Tree.functional_lower_bound_of_conditions`.
::::
:::::

The formal proof applies this inequality in `functional_lower_bound_of_conditions`, a 940-line proof that we did not unfold, so the page cannot say which algebraic number $x$ (a period, a Fourier coefficient, a determinant) is measured there.

::: figure {#f-ml-budget viz="ml-product-budget" height="420"}
For a nonzero algebraic integer, the prime factors weighted by the logarithm of their norm always add up to the logarithm of the norm, so piling more divisibility onto a number forces its archimedean size up.

```vizspec
Purpose: show the product formula as "zeros equal poles" for Gaussian integers, and divisibility as a cost
  paid in size.
Scene: left panel, the Gaussian integer lattice Z[i] for |re|, |im| <= 12 as muted dots; the current x = a + b i
  is a gold dot with a thin line to the origin, its absolute value |x| printed beside it.
  Right panel, two stacked bars of equal total height on a common vertical axis (units of log):
  left bar "primes": one segment per prime ideal w dividing x, of height v_w(x) * log N(w), colored by prime
  (use teal shades; label each segment "(2+i)^2" style with N(w) and v_w);
  right bar "size": one segment of height 2 log |x| in blue (two embeddings, each log |x|).
  The two bars always have equal height (this is [[eq-ml-pf]] with [F:Q] = 2).
Controls: drag the gold dot to any nonzero lattice point (snap to integers); buttons "multiply by (1+i)",
  "multiply by (2+i)", "multiply by 3" that replace x by the product and animate both bars growing.
  Factorization in Z[i]: factor N(x) = a^2 + b^2 over the integers, then for each rational prime p:
  p = 2 gives the prime (1+i); p = 3 mod 4 gives the prime (p) with N = p^2; p = 1 mod 4 splits as
  p = pi * conj(pi), decide which of pi, conj(pi) divides x by testing divisibility in Z[i].
Motion: bars animate over 300 ms when x changes.
Reader takeaway: every extra prime factor raises the "primes" bar and the "size" bar by the same amount;
  a number cannot be highly divisible and small at once.
Check: x = 3 + 4i gives one segment (2+i) with v = 2, height 2 log 5 = 3.219; size bar 2 log 5.
  x = 1 + i gives (1+i) with height log 2.
```
:::

## The chain in the code {#ml-chain}

The note states the plan in one line of its timeline. Step 8 reads "iterated theta lifts $U(X_0)\to U(X_1)\to\dots\to U(X_m)$ between totally definite unitary groups, $\pi\mapsto\pi\boxplus\mu_j[t]$, wins multiplicity $m$", and it adds "time to take $m$ like $\sqrt X$" [@alpoge-note]. Its main text says that for "the von Mangoldt sum of length $X$" the suggested length of the chain was $\sqrt X$, "in view of each mimicking multiplicity" [@alpoge-note]. In the usual notation, which is our reading of the note's symbol, $\pi\boxplus\mu_j[t]$ adds to the Langlands parameter of $\pi$ the block $\mu_j[t]$, the character $\mu_j$ tensored with the $t$-dimensional irreducible representation of $\mathrm{SL}_2$. The code fixes each part of this line, as follows.

::: definition {#d-ml-spaces title="The spaces of the chain"}
A datum of the proof fixes a CM field $E$ with totally real subfield $E^+$, unramified over $E^+$ at every finite prime, and Hermitian spaces $X_0, X_1, \dots, X_m$ over $E$. Each $X_j$ is totally definite, meaning that at every embedding $E \to \CC$ its form has signature $(\operatorname{rank}, 0)$ or $(0, \operatorname{rank})$, and its rank is
$$
\operatorname{rank} X_j = N_j = N_0 + j(c+1), \qquad 0 \le j \le m,
$$ {#eq-ml-ranks}
with $N_0$ and $m$ even and $c$ odd ($N_0$ is the code's `k` and $c$ its `t`). The last space splits as $X_m = X' \oplus \langle z\rangle$ with $z$ anisotropic, so $X'$ has rank one less. A space $X_j$ is a vector space with a Hermitian form, not a lattice. The record contains no embedding of $X_j$ in $X_{j+1}$: its only isometric embeddings are $X_j \to Y_j$ into the indefinite spaces of the periods ($j < m$) and $X' \to X_m$, so the chain is a sequence of spaces with prescribed ranks, tied together by the kernels of the lifts and not by inclusion.
:::

::: lean {decl="Formalism.BasicNotions.Spaces" file="Formalism/LocalRingCardinality/DataSpaces.lean"}
The fields `X_rank` and `X_def` state the rank and the total definiteness of $X_j$ for $j \le m$, `iX'`, `z`, `z_anis`, and `z_orth` state the splitting, and the integers come from `Ranks` in `Formalism/LocalRingCardinality/Params.lean`, where `N j = k + j * (t + 1)`.
:::

Because each $X_j$ is totally definite, its unitary group is compact at every real place, and [[definite-forms]] showed what follows: an automorphic form on $U(X_j)$ is a function on a finite set $\mathcal C_j$ of lattice classes, a class $a$ carries the weight $w_j(a) = 1/\abs{\operatorname{Aut}(a)}$, and a theta lift is a matrix. The code builds the chain from exactly these pieces.

::: definition {#d-ml-chainop title="The chain operator"}
Let $\mathcal C_0, \dots, \mathcal C_m$ be finite sets with weights $w_j\colon\mathcal C_j\to\CC$ and kernels $K_j\colon \mathcal C_j\times\mathcal C_{j+1}\to\CC$. One step of the chain sends a function $f$ on $\mathcal C_j$ to the function on $\mathcal C_{j+1}$
$$
(\mathcal L_j f)(b) = \sum_{a\in\mathcal C_j} w_j(a)\,f(a)\,K_j(a,b),
$$ {#eq-ml-step}
and the chain of length $m$ is the composite $\mathcal L_{m-1}\circ\dots\circ \mathcal L_0$. In matrix terms, with $W_j$ the diagonal matrix of weights, a form on $\mathcal C_0$ is a row vector $f$ and the chain is $f\,W_0K_0\,W_1K_1\cdots W_{m-1}K_{m-1}$, the product [[eq-df-chain]] of [[definite-forms]]. The vector-valued version lets $f(a)$ lie in a finite-dimensional space and $K_j(a,b)$ be a linear map. It is a linear map on functions, not a correspondence between classes.
:::

```lean
def chainOp {R : Type*} [CommSemiring R] {ι : ℕ → Type*} [∀ j, Fintype (ι j)]
    (w : ∀ j, ι j → R) (K : ∀ j, ι j → ι (j + 1) → R) : (m : ℕ) → (ι 0 → R) → (ι m → R)
  | 0, f => f
  | m + 1, f => kerOp (w m) (K m) (chainOp w K m f)
```

::: lean {decl="Formalism.ThetaLiftIndependence.chainOpM" file="Formalism/ThetaLiftIndependence/Statement.lean"}
`kerOp w K f j = ∑ i, w i * f i * K i j` is one step [[eq-ml-step]] and `chainOpM` is the vector-valued chain, which the datum uses as `ColumnChain.col φ = chainOpM C.wt C.Kmap R.m φ` (in `Formalism/LocalRingCardinality/DataKernels.lean`, with weights `1 / Nat.card (stab i c)`), and `colTo_eq` proves that iterating the one-step lift $m$ times gives it.
:::

The datum's kernel `ColumnChain.Kmap` is a linear map `unf i L L'` between value spaces, multiplied by two scalars of absolute value $1$ that depend on the determinant classes of the two lattices, and multiplied before and after by powers of normalizing values, with exponents that differ by $(c+1)/2$ ([[df-code]] writes it out). The scalars are fixed through characters $\tilde\mu_j$ (`D7.rhoDet_eq_inv_muTilde_chiD_pow`), which we read as the $\mu_j$ of the note's $\pi\boxplus\mu_j[t]$. The map `unf` is an abstract field of the record, and no declaration found identifies it with a theta coefficient between classes of $X_j$ and $X_{j+1}$, so that identification, which is how [[definite-forms]] presents the lift, is a reading for this datum.

Integrality survives the chain because every weight is the reciprocal of a stabilizer order dividing one integer `DGam` (`FactWtInt`). If $D\,w_j(a)$ and $K_j(a,b)$ are integral, then $D^m$ times the $m$-fold lift of an integral form is integral ([[t-df-chain]]). The code states this as `ChainInt`, a proposition that is defined but never proved or used. On the spine the same control appears as `chain_ge` and `PeriodClassSumWeyl` (periods of lattice points are algebraic with denominators bounded through `DGam`), both stated in [[df-chain]].

### How long the chain is {#ml-length}

The length $m$ is tied to the scale $x$ at which the construction is made. A `Scale` is a real $x > 1$ with $0 < \varepsilon < 1/52$, and it defines $b = e^{x^\varepsilon}$, $a = x\,b$, and $\delta_1 = x^{-\varepsilon/8}$, with $x^\varepsilon$ itself named `L` in the code (`Formalism.BasicNotions.Scale` in `Formalism/LocalRingCardinality/DataParams₂.lean`).

::: definition {#d-ml-rankval title="The rank conditions at scale $x$"}
For a scale $x$ with exponent $\varepsilon$ and ranks $(N_0, m, c, n)$, the condition $\mathrm{RankVal}$ holds when
$$
\begin{aligned}
x^{2+8\varepsilon} &\le n \le 2x^{2+8\varepsilon},\\
\sqrt{x^{1-\varepsilon/8}} &\le m \le 2\sqrt{x^{1-\varepsilon/8}},\\
x^{9/2+10\varepsilon} &\le N_0 \le 2x^{9/2+10\varepsilon},
\end{aligned}
$$ {#eq-ml-rankval}
and the rank step $c$ is fixed by one more equation, $(N_0+m-1) + c = 8\cdot 2n\,(N_0+m-1) + 4 + \lceil x^{377}\rceil\, n_W$, with $n_W$ an explicit integer given below. Here $\sqrt{x\delta_1} = \sqrt{x^{1-\varepsilon/8}} = x^{1/2-\varepsilon/16}$. The integer $n$ is `Frame.ord`, the order of the datum's finite abelian "frame" group $A$ (`Formalism.HC.Frame.A`). The frame comes with a surjection `Frame.h` from $A$ onto $(\ZZ/2^{e+2})^\times/\{\pm1\}$, the Galois group of the real cyclotomic field $\QQ(\zeta_{2^{e+2}})^+$, for an integer $e$ of the frame; in the ranks that `exists_ranks_cyclic_frame` builds, $A$ is cyclic of order $n = 2^e$ (`cyclicFrame`) and this surjection is an isomorphism. The host of the datum identifies the Galois group of its CM field $E$ over $\QQ$ with $\{\pm1\}\times\{\pm1\}\times A$ (the field `gal` of `Formalism.HC.HostRaw`, whose target is `Frame.GG`), the second sign recording the action on $\sqrt{-\mathsf d}$ for the auxiliary prime $\mathsf d$ of [[integrality-and-galois]] (`gal_sqd`), so $[E:\QQ] = 4n$, and $2n$ counts the Harish-Chandra slots of the datum and the places above the auxiliary prime. Chapter [[integrality-and-galois]] works with this whole group $\{\pm1\}^2\times A$ and its subgroup that fixes $\sqrt{-\mathsf d}$.
:::

```lean
def RankVal (s : Scale) (R : Ranks) : Prop :=
  (s.x ^ (2 + 8 * s.eps) ≤ (R.n : ℝ) ∧ (R.n : ℝ) ≤ 2 * s.x ^ (2 + 8 * s.eps)) ∧
  (Real.sqrt (s.x * s.delta1) ≤ (R.m : ℝ) ∧ (R.m : ℝ) ≤ 2 * Real.sqrt (s.x * s.delta1)) ∧
  (s.x ^ (9 / 2 + 10 * s.eps) ≤ (R.k : ℝ) ∧ (R.k : ℝ) ≤ 2 * s.x ^ (9 / 2 + 10 * s.eps)) ∧
  R.r + R.t = 8 * R.f * R.r + 4 + TOv s * nWv R s
```

::: lean {decl="GlobalTheory.EX.RankVal" file="Development/AbelianVarietyTheory/Definitions/GlobalTwisting/PairRowIffQdRows.lean"}
In the code `R.k` is $N_0$, `R.n` is `Frame.ord`, `R.r = k + m - 1`, `R.f = 2 * n`, `TOv s = ⌈x ^ 377⌉`, and `nWv R s = 8 * ⌈10 r (f + f^2 (k-1)^3 L^2 / m) / 8⌉` with `L` $= x^\varepsilon$, and `exists_ranks_cyclic_frame` in `Development/AbelianVarietyTheory/Proofs/GlobalInterpolation/ExistsRanksRankValFrame.lean` proves that for every $\varepsilon \in (0, 1/52)$ ranks satisfying `RankVal` exist at every large enough scale.
:::

So the chain length is between one and two times $x^{1/2-\varepsilon/16}$, a hair below $\sqrt x$, and the code proves such ranks exist for all large $x$. We verified that the explicit family constructions assume `RankVal`. That every family reaching the top of the argument satisfies it was not confirmed, and the page carries that mark.

Which length is the note's $X$ is a question the page leaves open. Two facts bear on it. First, the window scale `Scale.x` is the $x$ of the endgame in [[landau-endgame]], so $m \asymp \sqrt x$ for the scale at which the bound on smoothed prime sums is proved. Second, every datum also contains a much longer length, an integer $a_T$ with $a \le a_T \le a + a/(N_0 x^{13})$, so $a_T \approx x\,e^{x^\varepsilon}$, and sums of length $a_T$ appear in it. One of them, as our reading, has the shape of a von Mangoldt sum: `SizeData₂.vonMangoldtClassSum` is $\sum_{i \text{ odd}} \max(0, a_T/p^i - w_{j,p,i})$ with each $w_{j,p,i} \ge 1$, and lemmas such as `Formalism.LFunctionChainParameters.DeficitSplitLemmas.ask_eq` weight it by $\log p$ over sets of primes, which resembles $\sum_{n\le a_T}\Lambda(n)\,a_T/n$ restricted to odd prime powers. If the note's $X$ were $a_T$, the chain length would be far below $\sqrt X$. If it were $x$, the length matches. The code does not say which, and we do not decide it for the original tree. The shorter rewrite of chapter [[route-a-compressed]] decides it in its own notation, where $x$ is "the length of the prime sum" and $a = xb$ is "the order of the derivative" ([[rc-half]]).

A second detail does not match the note's notation exactly. The ranks grow by $c + 1$ per step ([[eq-ml-ranks]]) with $c$ odd, while $\mu_j[t]$ suggests a block of dimension $t$. We could not reconcile the two.

### The scale dictionary {#ml-scales}

The table collects how each size of Part IV grows with the scale $x$. It is the full dictionary: chapters [[route-a-plan]], [[definite-forms]], [[integrality-and-galois]], and [[cohomology-window]] repeat the rows they use. The rows marked "ours" are our computation from the declarations, up to constant factors.

| Quantity | Size in terms of $x$ | Where it is fixed |
| --- | --- | --- |
| range of $\varepsilon$ | $0 < \varepsilon < \tfrac1{52}$ | `Scale`, `VWinAt` |
| chain length $m$ | $x^{1/2-\varepsilon/16}$ to $2x^{1/2-\varepsilon/16}$ | `RankVal`, second clause |
| chain length allowed where the count is bounded | $x^{1/2-\varepsilon}$ to $x^{1/2+\varepsilon/2}$ | `RestSize`, `ch_core` |
| rank $N_0$ of $X_0$ | $x^{9/2+10\varepsilon}$ to $2x^{9/2+10\varepsilon}$ | `RankVal`, third clause |
| frame order $n = \abs A$ (and $2n$ slots) | $x^{2+8\varepsilon}$ to $2x^{2+8\varepsilon}$ | `RankVal`, first clause |
| level $2^\nu$ of the 2-adic tower of [[cohomology-window]] ($\nu$ is the code's `e` there, not the small exponent of [[landau-endgame]]) | $x^{2+8\varepsilon}$ to $2x^{2+8\varepsilon}$, the range of $n$ | `PageN` |
| auxiliary prime $P$ (the code's `T`) | $\log P \ge \tfrac m2 x^{\varepsilon}$, so $\log P \gtrsim \tfrac12 x^{1/2+15\varepsilon/16}$ | `SizeData₂.TuGe`, $b^{m/2} \le P$ |
| rank step $c+1$ (ours) | about $40\,n^2N_0^4x^{377+2\varepsilon}/m \approx x^{398.5+58\varepsilon}$ | last clause of `RankVal` |
| top rank $N_m = N_0 + m(c+1)$ (ours) | about $x^{399+58\varepsilon}$ | [[eq-ml-ranks]] at $j = m$ |
| long length $a_T$ | $x\,e^{x^\varepsilon}$, within a factor $1 + 1/(N_0x^{13})$ | `SizeData₂.aT_win` |
| margin | $3x^\varepsilon \le m - 1$ for $x \ge 256$ | `three_L_le` |
| auxiliary primes $\mathsf q$, $\mathsf d$ of [[integrality-and-galois]] | $\log\mathsf q \approx Y_0^{\varepsilon/5}$, $\log\mathsf d \approx Y_0^{\varepsilon/5}(\log Y_0)^2$ with $Y_0 \le x$, and $\log(\mathsf q\mathsf d) \le x^{\varepsilon/4}$ | `WinPair`, `log_mul_le_rpow_of_winPair` |
| Tate twists covered by the window bound | $1 \le k < \lfloor x^{401}\rfloor$ | `VWin` |
| $\sum_\ell\sum_k \log\#\text{Sha}^1$ over those twists | at most $e^{x^\varepsilon/2}$ | `VAt` |
| the bound the endgame consumes | $G_r(x) \le x^{1/2+9\varepsilon}$ on windows $[Y, Y^{3/2}]$ | `ChebyshevInequalityOnWindows` |

`TuGe` is a condition defined in `Formalism/LocalRingCardinality/DataParams₂.lean` and required by the degree hypotheses `HypAt.evP_hypL`. We did not confirm that it is imposed on every datum. The frame order $n$ is not the order of the whole Galois group of $E$, which is $4n$ by [[d-ml-rankval]].

::: example
At $\varepsilon = 0.01$ and $x = 10^6$, so $\sqrt x = 1000$, the chain length lies between $991.4$ and $1982.8$, the starting rank $N_0$ is about $10^{27.6}$, the frame order $n$ about $10^{12.5}$, and the auxiliary prime has $\log P \ge 569$. The long length is $a = 10^6 e^{10^{0.06}} \approx 3.15\times10^6$. At $x = 10^8$ the chain length lies between $9{,}886$ and $19{,}771$ against $\sqrt x = 10^4$. The formal proof makes no attempt to keep these sizes small, and the note expects large simplifications [@alpoge-note].
:::

::: figure {#f-ml-scales viz="ml-chain-scales" height="400"}
As the scale grows, the chain length tracks the square root of the scale from just below, while the ranks of the spaces and the auxiliary prime grow far faster.

```vizspec
Purpose: show the scale dictionary of RankVal on a log-log plot.
Scene: horizontal axis log10 x from 2 to 12. Vertical axis log10 of the plotted quantity, from 0 to 40
  (clip anything above; draw an arrow at the top edge with the label "x^398.5" for the rank step).
  Draw: sqrt(x) as a dashed blue line; the band for m between sqrt(x^(1-eps/8)) and 2 sqrt(x^(1-eps/8))
  as a gold band; the band for N_0 between x^(9/2+10 eps) and 2 x^(9/2+10 eps) in muted; the band for n
  between x^(2+8 eps) and twice that in muted; the lower bound for log P, (m_low/2) x^eps, as a teal line
  (plotted as log10 of log P); the long length a = x e^(x^eps) as a red line.
  A vertical cursor at the current x with a readout panel listing m range, sqrt(x), N_0, n, log P lower
  bound, a, each with three significant digits.
Controls: slider eps from 0.001 to 0.019 (default 0.01); drag the cursor along the x axis.
Motion: the bands redraw as eps changes; the gap between the gold band's lower edge and the dashed line
  widens slowly as x grows (it is a factor x^(-eps/16)).
Reader takeaway: the chain has length about sqrt(x), while the long length a grows faster than any power
  of x, which is why the note's X could mean either.
Check: eps = 0.01, x = 1e6: m in [991.4, 1982.8], log P >= 569.1, a = 3.152e6.
```
:::

## Reading a form as a number: periods {#ml-periods}

After $m$ lifts the chain holds a form on $U(X_m)$, a function on a finite set of classes with values in a vector space. To be compared with an integer budget it must become a number, and the standard way is a period: restrict the form to a smaller group and integrate it against a form there. The rule that decides when such an integral can be nonzero is the branching rule.

### Restriction from U(k) to U(k-1) {#ml-branching}

An irreducible representation of the compact unitary group $U(k)$ is determined by its highest weight, a non-increasing sequence of integers $\lambda = (\lambda_1 \ge \lambda_2 \ge \dots \ge \lambda_k)$. Restricting it to $U(k-1)$, embedded as the matrices that fix the last basis vector, gives a representation of the smaller group, which breaks into irreducibles.

::::: card {#t-ml-branching kind="theorem" title="Restricting an irreducible representation of $U(k)$ to $U(k-1)$ contains each irreducible exactly once if its weight interlaces and not at all otherwise" source="goodman-wallach"}
:::: statement
The restriction of the irreducible representation of $U(k)$ with highest weight $\lambda$ to $U(k-1)$ is the direct sum, each with multiplicity one, of the irreducible representations with highest weights $\mu = (\mu_1\ge\dots\ge\mu_{k-1})$ satisfying
$$
\lambda_1 \ge \mu_1 \ge \lambda_2 \ge \mu_2 \ge \dots \ge \mu_{k-1} \ge \lambda_k .
$$ {#eq-ml-interlace}
Every other $\mu$ occurs with multiplicity zero.
::::
:::: plain
When a big symmetry group shrinks by one dimension, each irreducible piece of the small group appears once or not at all, and the test is whether its weights sit between the big group's weights.
::::
:::: why
A period pairs the restriction of a form on the big group with a form on the small one. The branching rule says when the pairing can be nonzero (multiplicity one) and when it must vanish (multiplicity zero), which is the "values 0, 1" of the note's step 7.
::::
:::: idea
Characters of $U(k)$ are Schur polynomials, and setting the last variable to $1$ expands $s_\lambda(x_1,\dots,x_{k-1},1)$ as the sum of $s_\mu(x_1,\dots,x_{k-1})$ over interlacing $\mu$. Iterating down to $U(1)$ gives a basis indexed by triangular arrays of interlacing rows, the Gelfand and Tsetlin patterns.
::::
:::: sketch {source="goodman-wallach" loc="ch. 8"}
The branching law for $U(k) \downarrow U(k-1)$ goes back to Weyl and is proved in Goodman and Wallach's chapter on branching laws, by the character identity in the idea.
::::
:::: example
Take $k = 3$ and $\lambda = (2,1,0)$, the adjoint representation twisted by the determinant, of dimension $8$ by Weyl's formula $\prod_{i<j}(\lambda_i - \lambda_j + j - i)/(j-i) = 2\cdot2\cdot2$. The interlacing $\mu = (\mu_1, \mu_2)$ satisfy $2 \ge \mu_1 \ge 1 \ge \mu_2 \ge 0$, so they are $(2,1)$, $(2,0)$, $(1,1)$, $(1,0)$, of dimensions $\mu_1 - \mu_2 + 1 = 2, 3, 1, 2$. These add up to $8$, and we checked the identity $s_{(2,1,0)}(x_1,x_2,1) = s_{(2,1)} + s_{(2,0)} + s_{(1,1)} + s_{(1,0)}$ with sympy. The weight $(3,0)$ fails $2 \ge \mu_1$ and the weight $(2,2)$ fails $1 \ge \mu_2$, so each occurs zero times.
::::
:::: used
It explains the interlacing condition of [[d-ml-interlacing]] and the reading of step 7 in [[ml-step7]].
::::
:::::

The code writes the interlacing in a shifted form. A Harish-Chandra parameter is the highest weight plus half the sum of the positive roots, which for $U(k)$ adds $\tfrac{k+1}{2} - i$ to $\lambda_i$. Write $u_i = \lambda_i + \tfrac{k+1}2 - i$ for $U(k)$ and $v_i = \mu_i + \tfrac k2 - i$ for $U(k-1)$. Since $\lambda_i,\mu_i$ are integers, $\lambda_i \ge \mu_i$ holds exactly when $u_i > v_i$, and $\mu_i\ge\lambda_{i+1}$ exactly when $v_i > u_{i+1}$, so weak interlacing of weights is strict interlacing of parameters, and every difference $u_i - v_j$ lies in $\ZZ + \tfrac12$. For $\lambda = (2,1,0)$ the parameter is $u = (3, 1, -1)$, and $\mu = (2,0)$ gives $v = (\tfrac52, -\tfrac12)$, with $3 > \tfrac52 > 1 > -\tfrac12 > -1$. This computation is ours. Since the shift is half-integral on a group of even rank and integral on one of odd rank, it also explains why the code's $u$ (on a group of even rank $k$) are half-integers, its $v$ (on a group of odd rank) are integers, and its inequalities are strict.

::: figure {#f-ml-interlacing viz="ml-interlacing" height="380"}
A weight of the smaller group occurs in the restriction exactly when its beads sit in the gaps between the larger group's beads, and then it occurs once.

```vizspec
Purpose: make the branching rule U(3) -> U(2) and the strict interlacing of Harish-Chandra parameters
  visible and checkable.
Scene: a horizontal number line from -3 to 5 with half-integer ticks. Top row: three gold beads at the
  Harish-Chandra parameter u = (lambda1 + 1, lambda2, lambda3 - 1) of U(3). Bottom row: two teal beads at
  v = (mu1 + 1/2, mu2 - 1/2) of U(2). Between the rows, thin muted lines from each v bead up to the gap it
  must occupy. A readout: "multiplicity 1" in teal when u1 > v1 > u2 > v2 > u3, otherwise "multiplicity 0"
  in red, with the violated inequality highlighted in red on the line.
  Right side panel: the list of all interlacing mu for the current lambda, each with its dimension
  mu1 - mu2 + 1, their sum, and the dimension of lambda from Weyl's formula
  (lambda1-lambda2+1)(lambda2-lambda3+1)(lambda1-lambda3+2)/2; the two numbers must agree.
Controls: three integer steppers for lambda (kept non-increasing, values -2..4); drag the two teal beads,
  which snap so that mu stays a non-increasing integer pair.
Motion: beads slide with easing when snapped; the readout color changes immediately.
Reader takeaway: each mu appears once or not at all, and the interlacing ones fill the whole representation.
Check: lambda = (2,1,0): u = (3,1,-1); interlacing mu are (2,1),(2,0),(1,1),(1,0), dimensions 2,3,1,2, sum 8.
  mu = (3,0) gives v = (7/2,-1/2): fails u1 > v1, multiplicity 0.
```
:::

### Bessel periods {#ml-bessel}

The automorphic counterpart of the branching rule is a period. Let $V$ be a Hermitian space and $W \subset V$ a nondegenerate subspace whose orthogonal complement has odd dimension $2r+1$ and is split as far as possible. The Bessel subgroup is $U(W)\ltimes N$, with $N$ a unipotent group built from a flag in the complement and carrying a character $\psi$.

::: definition {#d-ml-bessel title="Bessel period"}
For an automorphic form $\varphi$ on $U(V)$ and an automorphic form $\phi$ on $U(W)$, the Bessel period is the number
$$
\mathcal P(\varphi,\phi) = \int_{[U(W)]}\int_{[N]} \varphi(nh)\,\overline{\phi(h)}\,\overline{\psi(n)}\,\dd n\,\dd h ,
$$
where $[G]$ denotes the quotient of the adelic points of $G$ by its rational points. When $\dim V = \dim W + 1$ the group $N$ is trivial and $\mathcal P$ is the integral of $\varphi\,\overline\phi$ over $[U(W)]$. It is a number attached to a pair of forms, not a form, and it is linear in $\varphi$.
:::

Gan, Gross, and Prasad organized these periods for all classical groups [@ggp2012]. Locally, for $\dim V = \dim W + 1$, the space of $U(W)$-equivariant functionals from an irreducible representation of $U(V)$ to one of $U(W)$ has dimension at most one, a theorem of Aizenbud, Gourevitch, Rallis, and Schiffmann over $p$-adic fields and of Sun and Zhu over the reals [@agrs2010] [@sunzhu2012], and Gan, Gross, and Prasad reduce the general Bessel case over $p$-adic fields to this one [@ggp2012]. That is the local form of "multiplicity 0 or 1". For a definite group with $\dim V - \dim W = 1$ the period is a finite sum $\sum_c w(c)\,\varphi(\iota c)\,\overline{\phi(c)}$ over classes of $W$, with $\iota$ sending a class of $W$ to one of $V$. The splitting $X_m = X'\oplus\langle z\rangle$ of [[d-ml-spaces]] is of this kind, and as our reading, the period map of the datum restricts the last form of the chain to $U(X')$ and pairs it there.

The code states the archimedean half of the rule precisely, for discrete series of a real unitary group of rank $2r + k + 1$ restricted to the subgroup of rank $k$.

::: definition {#d-ml-interlacing title="The code's interlacing condition and the local Bessel nonvanishing"}
Let $u \in \RR^k$, $v \in \RR^{k-1}$, and $b \in \RR^{2r+2}$. The interlacing condition is
$$
v_i < u_i \ \text{and}\ u_{i+1} < v_i \quad (0 \le i \le k-2), \qquad -b_0 < u_{k-1},
$$ {#eq-ml-code-interlace}
that is, $u_0 > v_0 > u_1 > \dots > v_{k-2} > u_{k-1} > -b_0$. The half-integrality condition asks that every $u_i - \lambda_s$ lie in $\ZZ + \tfrac12$, where $\lambda = (v_0,\dots,v_{k-2},-b_0,\dots,-b_{2r+1})$. The proposition `BesselPeriodGGP` states: for even $k \ge 2$, if $u$ and $\lambda$ are Harish-Chandra parameters satisfying both conditions, $\sigma$ is a discrete series representation with parameter $\lambda$ of the real unitary group of rank $2r+k+1$ (with the signature fixed by the code's sign pattern), $w$ a unit vector in its lowest $K$-type, and $\pi$ the finite-dimensional representation of the subgroup $U_W$ with parameter $u$, then for some group elements $g, g_0$
$$
\int_{U_W\times N}\big\langle\sigma(g_0)w,\ \sigma(hn)\sigma(g)w\big\rangle\,\overline{\psi(n)}\;\pi(h)^{-1}\,\dd(h,n) \ne 0 .
$$
It is a statement about one real place: a matrix coefficient of $\sigma$ integrated over the Bessel subgroup is a nonzero operator.
:::

::: lean {decl="PI.BesselPeriodGGP.BesselPeriodGGP" file="Formalism/PeriodIntegrals/BesselPeriodGGP.lean"}
`InterlacingCondition` and `HalfIntegralDifference` are defined in the same file, and the only statement that mentions `BesselPeriodGGP` is `GlobalTheory.BesselPeriodCompare.besselPeriod_iff`, which proves it equivalent to `BesselPeriodNeZero`. We did not find where either is proved, so we state the proposition and claim no more.
:::

```lean
def InterlacingCondition (k r : ℕ) (u : Fin k → ℝ) (v : Fin (k - 1) → ℝ) (b : Fin (2 * r + 2) → ℝ) : Prop :=
  (∀ i : Fin (k - 1), v i < u ⟨i.val, by have := i.isLt; omega⟩ ∧
      u ⟨i.val + 1, by have := i.isLt; omega⟩ < v i) ∧
    ∀ h : 0 < k, -b ⟨0, by omega⟩ < u ⟨k - 1, by omega⟩
```

::: example
The code checks that its smallest instance satisfies the hypotheses of `BesselPeriodGGP`, in `Formalism.L2.SG.LitS.besselNV_numeric_example`: $k = 2$, $r = 0$, $u = (\tfrac32, -\tfrac12)$, $v = (1)$, $b = (1, 10^{11})$. Interlacing reads $\tfrac32 > 1 > -\tfrac12 > -1$, and the differences $u_i - \lambda_s$ with $\lambda = (1, -1, -10^{11})$ are all half-integers. Here the subgroup $U_W$ has rank $2$ and $u = (\tfrac32,-\tfrac12)$ is the highest weight $(1,0)$ shifted by $(\tfrac12,-\tfrac12)$, the standard representation, while $\lambda = (1,-1,-10^{11})$ is the parameter of a discrete series of a real unitary group of rank $3$. Two of its entries interlace with $u$ and the third sits far below everything. Note that the roles are the reverse of [[t-ml-branching]]. There the $k$ weights of the larger group enclose the $k-1$ weights of the smaller one. Here the $k$ entries of $u$, the parameter of the smaller group $U_W$, enclose the $k-1$ entries of $v$, which belong to the parameter of the larger group.
:::

The code also states local multiplicity one, `Formalism.L2.SG.LitS.BesselMultOne` (any two Bessel functionals on the same pair are linearly dependent), and derives it in `besselMultOne_of_uniq` from a uniqueness statement we did not follow.

### The note's step 7 and the rank condition {#ml-step7}

Step 7 of the note reads "determinants for $W(\cdot)$'s containing the desired periods, indeed GGP periods", with "values 0, 1 meaning interlacing weights, or up to $m$ non-interlacing ones" [@alpoge-note]. In our reading the code realizes it as follows. The datum's Harish-Chandra data `HCParam` consist of an interlacing block $u_0 > v_0 > \dots > v_{k-2} > u_{k-1}$ and $m$ further pairs $(b_j, e_j)$, one per lift, separated by gaps of at least $(c+3)/2$, and `interlace_of` derives `InterlacingCondition` for them. The block is where the multiplicity is $0$ or $1$, and the $m$ pairs beyond it are the "up to $m$ non-interlacing" weights.

We found no declaration that computes a determinant whose entries are Bessel periods. What the code states is a rank condition on the linear map whose matrix entries are those periods.

::: definition {#d-ml-rkc title="The period map and the rank condition"}
Let $M_{\rm ram}$ be the space of forms, inside a fixed finite-dimensional space of forms on the first class set, that are ramified at the auxiliary prime $P$, meaning killed by the sum of the action of $\FF_P^\times$ at each of the $2n$ chosen places, and let $d_u = \dim M_{\rm ram}$. The period map $\mathcal P_C$ (the code's `PhiC`) sends $\varphi \in M_{\rm ram}$ to the linear functional $F \mapsto \operatorname{period}\big(\operatorname{low}(\operatorname{ev}_z(\mathrm{col}\,\varphi)), F\big)$, where $\mathrm{col}$ is the chain [[d-ml-chainop]] and $\operatorname{ev}_z$, the lowering map $\operatorname{low}$, and the pairing are linear maps fixed by the datum. The rank condition $\mathrm{RKC}$ is
$$
d_u < 2\operatorname{rank}\mathcal P_C, \qquad\text{equivalently}\qquad 2\dim\ker\mathcal P_C < d_u .
$$ {#eq-ml-rkc}
It says that the periods of the lifted forms detect more than half of the ramified forms. It is a statement about the rank of a linear map, not about the value of a determinant.
:::

```lean
def PhiC : A.Mram →ₗ[ℂ] Module.Dual ℂ P.Mt := P.period ∘ₗ PsiC C A P
def rkC : ℕ := Module.finrank ℂ (LinearMap.range (PhiC C A P))
def RKC : Prop := A.du < 2 * rkC C A P
```

::: lean {decl="GlobalTheory.Core.Rk.RKC" file="Development/AbelianVarietyTheory/Definitions/LatticeFrames/FiniteDimensionalMram.lean"}
`rkc_iff_ker` proves the equivalence in [[eq-ml-rkc]], two `example`s record that $\mathcal P_C = 0$ violates the condition and an injective $\mathcal P_C$ satisfies it when $d_u > 0$, and `PhiC_apply` identifies $\mathcal P_C$ with the column periods `PeriodMap.PtilCol`.
:::

As our reading, a rank lower bound is the statement that some maximal minor of the matrix of $\mathcal P_C$, a determinant of periods, is nonzero, which is how the note's "determinants for $W(\cdot)$'s containing the desired periods" and `RKC` say the same thing. Where `RKC` is proved for the datum was not traced.

## The seesaw: two orders of summation {#ml-seesaw}

A period of the $m$-fold lift is a sum over the top class set of a form that was itself built by $m$ sums. A seesaw identity, in Kudla's sense, compares two dual pairs that share one theta kernel and rearranges those sums so that the period can be computed one level at a time [@kudla1984]. On finite sets it is nothing but the statement that a finite sum can be taken in either order.

Take two finite class sets, $\mathcal C$ with weights $w(a)$ and $\mathcal C'$ with weights $w(b)$, two kernels $K_1, K_2\colon \mathcal C\times\mathcal C'\to\CC$, and two forms $u_1, u_2$ on $\mathcal C$. Lift each form to $\mathcal C'$ by [[eq-ml-step]], $\theta_i(b) = \sum_a w(a)u_i(a)K_i(a,b)$, and take the inner product on $\mathcal C'$. The result is the sum of the three-index array
$$
A(a, a', b) = w(a)\,w(a')\,w(b)\;u_1(a)\,K_1(a,b)\;\overline{u_2(a')\,K_2(a',b)}
$$ {#eq-ml-array}
over all $(a, a', b)$. Contracting $a$ and $a'$ first gives $\langle\theta_1,\theta_2\rangle_{\mathcal C'} = \sum_b w(b)\theta_1(b)\overline{\theta_2(b)}$, an inner product of lifts on the big side. Contracting $b$ first gives $\sum_{a,a'} w(a)w(a')\,u_1(a)\overline{u_2(a')}\,G(a,a')$ with $G(a,a') = \sum_b w(b)K_1(a,b)\overline{K_2(a',b)}$, a pairing of the original forms against a kernel on the small side. The two contractions agree.

::: example
Let $\mathcal C$ have two classes with weights $(\tfrac12,\tfrac16)$ and $\mathcal C'$ three classes with weights $(\tfrac14,\tfrac12,\tfrac1{12})$. These are toy numbers, not a real genus. Take
$$
K_1 = \begin{pmatrix}1&2&0\\3&1&1\end{pmatrix},\quad K_2 = \begin{pmatrix}2&0&1\\1&1&4\end{pmatrix},\quad u_1 = (1,-1),\quad u_2 = (2,1).
$$
The lifts are $\theta_1 = (0, \tfrac56, -\tfrac16)$ and $\theta_2 = (\tfrac{13}6, \tfrac16, \tfrac53)$, and $\langle\theta_1,\theta_2\rangle_{\mathcal C'} = \tfrac12\cdot\tfrac56\cdot\tfrac16 - \tfrac1{12}\cdot\tfrac16\cdot\tfrac53 = \tfrac5{108}$. In the other order, $G = \begin{pmatrix}\tfrac12 & \tfrac54\\ \tfrac{19}{12}&\tfrac{19}{12}\end{pmatrix}$, and $\sum_{a,a'}w(a)w(a')u_1(a)u_2(a')G(a,a') = \tfrac14 + \tfrac5{48} - \tfrac{19}{72} - \tfrac{19}{432} = \tfrac{5}{108}$. The common denominator of the weights is $6$, and $6\theta_1 = (0,5,-1)$ and $6\theta_2 = (13,1,10)$ are integral, which is the integrality of [[d-ml-chainop]] for one step.
:::

The code states a finite form for lattice classes, `LatSeeSaw` in `Formalism/ThetaLiftIndependence/Statement.lean` (lifting $f$ along a kernel and pairing with $g$ equals pairing $f$ with the lift of $g$ along the conjugate kernel), but no statement uses it. The version the proof uses is analytic.

::::: card {#t-ml-seesaw kind="theorem" title="The inner product of two theta lifts equals a double integral of the starting forms against the inner product of the kernels" source="alpoge-lean"}
:::: statement
Let $V$ and $V'$ be Hermitian spaces of the datum, with Haar measures on $U(V)(\AA)$ and $U(V')(\AA)$. Let $K_1, K_2\colon U(V)(\AA)\times U(V')(\AA)\to\CC$ be continuous, left invariant under $U(V)$ of the rationals in the first variable, square-integrable on $[U(V')]$ in the second, and of moderate growth, and let $u_1, u_2$ be rapidly decreasing on $[U(V)]$. Then the lifts $\theta_i(h) = \int_{[U(V)]}K_i(g,h)\,u_i(g)\,\dd g$ are square-integrable on $[U(V')]$, and
$$
\langle\theta_1,\theta_2\rangle_{[U(V')]} = \iint_{[U(V)]^2}\big\langle K_1(q_1,\cdot),K_2(q_2,\cdot)\big\rangle_{[U(V')]}\,u_1(q_1)\,\overline{u_2(q_2)}\;\dd q_1\,\dd q_2 .
$$ {#eq-ml-seesaw}
::::
:::: plain
Lifting two forms and comparing them upstairs gives the same number as comparing their kernels upstairs first and then integrating the forms downstairs.
::::
:::: why
It is the analytic step of every seesaw argument in the proof, the step that lets a period of a lifted form be rewritten as an integral over the smaller group, where it can be computed.
::::
:::: idea
The left side is the integral of the array [[eq-ml-array]] over three variables, first over $q_1$ and $q_2$ and then over $h$. The right side integrates over $h$ first. Fubini's theorem allows the exchange once the absolute integral converges, which is what rapid decrease of $u_i$ and moderate growth of $K_i$ provide.
::::
:::: proof
On finite class sets the identity is the exchange of two finite sums shown above. In general the integrand $\abs{K_1(q_1,h)K_2(q_2,h)u_1(q_1)u_2(q_2)}$ is integrable on $[U(V)]^2\times[U(V')]$: by Cauchy and Schwarz in $h$ the inner integral is at most $\lVert K_1(q_1,\cdot)\rVert\,\lVert K_2(q_2,\cdot)\rVert$, which grows moderately in $q_1, q_2$, and the rapid decrease of $u_1, u_2$ makes the outer integral finite. Fubini's theorem then exchanges the order. The formal proof is `GlobalTheory.Core.Rk.Seesaw.seesaw_fubini`, which we did not read line by line.
::::
:::: lean {decl="GlobalTheory.T.seesaw_fubini_two_lifts_moderate_growth_kernels" file="Development/AbelianVarietyTheory/Proofs/DecoratedLatticeProofs/SeesawFubiniTwoLiftsModerateGrowthKernelsStatement.lean"}
States the theorem with the hypotheses as written. Its conclusion includes, besides the identity, the integrability over $[U(V)]$ of each integrand $K_i(\cdot, h)u_i$ and the membership of each $\theta_i$ in $L^2([U(V')])$. It is proved by `seesaw_fubini`.
::::
:::: used
Its iterated form is [[t-ml-iter]].
::::
:::::

The chain needs the identity once per level. The code's `Chain` (in `Development/AbelianVarietyTheory/Definitions/LatticeFrames/IsThetaFam.lean`) is an inductive type that alternates Bessel levels and Fourier and Jacobi levels, joined by theta steps, starting from a lift out of a fixed space. `Chain.down` lifts a form through all the steps, and `Chain.Iter q z` says that the number $z$ is the iterated quotient integral of $q$, one pair of variables per step.

::::: card {#t-ml-iter kind="theorem" title="The Bessel period of the $m$-fold lift is an iterated integral, one level at a time, of an explicit unfolded integrand" source="alpoge-lean"}
:::: statement
For the datum's chain of length $m$, with theta functions at every step, a continuous automorphic form $F$ on the space the chain starts from, a continuous automorphic form $\varphi$ on the subgroup of the Bessel level where it ends, and the rapid-decrease conditions `Rapid` along the chain, the Bessel period of the lifted form against $\varphi$ satisfies
$$
\mathrm{Iter}\big(\mathrm{colPer}(F,\varphi),\ \mathcal P(\mathrm{down}\,F,\varphi)\big),
$$
that is, $\mathcal P(\mathrm{down}\,F,\varphi)$ equals the iterated integral, step by step down the chain, of the explicit integrand $\mathrm{colPer}$.
::::
:::: plain
The number read off the last form of the chain can be computed one level at a time, instead of building the whole lifted form first.
::::
:::: why
Without it the period of a form built by $m$ lifts is an integral of $m$ nested integrals, with no control level by level.
::::
:::: idea
Apply the seesaw [[t-ml-seesaw]] at the top step to move the pairing with $\varphi$ one level down, where $\varphi$ is replaced by its theta transform (the code's `hand`, built from `handBF` and `handFB`). Repeat $m$ times.
::::
:::: sketch {source="alpoge-lean"}
`iter_colPer` is obtained from `iter_chain` and `chain_Q_eq`, which identifies the chain's unfolded integrand `Chain.Q` with `colPer` through `Q_eq_colPer`, and the unfoldings themselves are `GlobalTheory.Unf.unfoldings_of_chain`. The integrand `colPer` and the functional `besPer` were not opened, so we state the shape of the identity and do not unfold it.
::::
:::: lean {decl="GlobalTheory.RowChain.iter_colPer" file="Development/AbelianVarietyTheory/Proofs/TwistedOperators/QEqColPer.lean"}
The theorem uses the path `downPath t D.R.m D.R.m`, so its steps are indexed by the chain length $m$ of [[d-ml-rankval]].
::::
:::: used
The note's step 12, discussed next, and, as our reading, the periods of the period map [[d-ml-rkc]].
::::
:::::

The note's step 12, headed "Seesaw", says that the period of the iterated lift is "a Bessel period independent of the Hecke characters" and names Rallis [@alpoge-note]. The first half is [[t-ml-iter]]. For the second half we found no theorem stating independence of the Hecke characters $\mu_j$. The nearest statements make the dependence explicit instead. The global identity `ThetaIntegralsAgree` (its clauses `StepBeta` and `StepAlpha`, in `Development/AbelianVarietyTheory/BlockTheory/DivisorBase/WeilTensorModels.lean`) says that adding one hyperbolic plane on either side of a tower multiplies a theta-integral constant by one partial Hecke $L$-value and explicit Gauss-sum factors, times a constant independent of the characters, and `D7.perCol_tie` equates the twisted period columns with periods of the twisted chain.

::: figure {#f-ml-seesaw viz="ml-seesaw-array" height="420"}
The same three-index array summed in two orders gives the same number, which is all a seesaw identity says on finite class sets.

```vizspec
Purpose: show the seesaw as two contractions of one array, with the exact numbers of the chapter's example.
Scene: center, a 2 x 2 x 3 block of cubes (index a in {1,2}, a' in {1,2}, b in {1,2,3}) drawn in light
  isometric projection; each cube shows the value of the array
  A(a,a',b) = w(a) w(a') w(b) u1(a) K1(a,b) u2(a') K2(a',b) as a fraction, with color intensity by
  magnitude (teal for positive, red for negative). Data: w_A = (1/2, 1/6), w_B = (1/4, 1/2, 1/12),
  K1 = [[1,2,0],[3,1,1]], K2 = [[2,0,1],[1,1,4]], u1 = (1,-1), u2 = (2,1).
  Left panel "lift, then pair": bars theta1 = (0, 5/6, -1/6) and theta2 = (13/6, 1/6, 5/3) over the three
  b classes, and the running total of w(b) theta1(b) theta2(b).
  Right panel "pair kernels, then integrate": the 2 x 2 matrix G = [[1/2, 5/4],[19/12, 19/12]] and the
  running total of w(a) w(a') u1(a) u2(a') G(a,a').
  Bottom: both totals, which end at 5/108 = 0.046296.
Controls: a toggle "order: (a, a') first / b first"; a play button that collapses the block along the chosen
  axes one slice at a time; sliders for u1 and u2 entries (integers -3..3) that recompute everything.
Motion: slices fold into the side panel over 400 ms each.
Reader takeaway: whatever the forms and kernels, the two totals agree.
Check: with the default data both totals equal 5/108.
```
:::

## The sizes {#ml-sizes}

The chain must be compared with a budget, so the sizes of its pieces must be known: how many classes there are, how large a lifted form is, how large the normalizing periods are, and how divisible the derivative-like quantities are. The note's step 9 names the tools, "Chowla-Selberg, Weyl, and Siegel mass" [@alpoge-note].

### Siegel's mass formula as a ratio {#ml-mass}

The mass of a genus of definite lattices is $\sum_L 1/\abs{\operatorname{Aut}L}$ over class representatives, the total weight of the class set on which forms live. Siegel's mass formula computes it as a product of local densities [@siegel1935], and for Hermitian lattices over CM fields exact forms are in Gan, Hanke, and Yu [@ganhankeyu2001]. The code uses it as a ratio between consecutive ranks.

:::: theorem {#t-ml-mass title="The mass of the standard Hermitian lattice of rank $M$ divided by that of rank $M-1$ is an explicit factorial times an L-value" source="alpoge-lean"}
Let $E$ be a CM field unramified over its totally real subfield $E^+$ at all finite primes (the code writes $K$), $n_E = [E^+:\QQ]$, $v_E = \abs{d_E}^{1/(2n_E)}/2$ with $d_E$ the discriminant of $E$, and $I_M$ the lattice with an orthonormal basis of size $M$. For $M \ge 3$,
$$
\frac{\operatorname{mass}(I_M)}{\operatorname{mass}(I_{M-1})} = \frac{\big((M-1)!\,(v_E/\pi)^M\big)^{n_E}}{\sqrt{(2v_E)^{n_E}}}\;L_E(M),
$$ {#eq-ml-mass}
where $L_E(M) = \prod_\mathfrak p e_\mathfrak p$ over the maximal ideals of $\mathcal O_E$, with $e_\mathfrak p = (1 - (-1)^M N\mathfrak p^{-M/2})^{-1}$ when $\mathfrak p$ is stable under conjugation and $e_\mathfrak p = (1 - N\mathfrak p^{-M})^{-1/2}$ otherwise.
::::

::: sketch {source="siegel1935"}
The mass is a product of local densities times archimedean volumes [@ganhankeyu2001]. Adding one dimension changes the archimedean volume by a $\Gamma(M)$-type factor, which gives $(M-1)!$ and the powers of $\pi$, and changes each local density by one Euler factor, which together give $L_E(M)$. This account and the following identification are our reading: comparing Euler factors, $L_E(M)$ is the Hecke $L$-function of $E^+$ at $M$ of the character $\chi_{E/E^+}^M$, with $\chi_{E/E^+}$ the quadratic character of $E/E^+$.
:::

::: lean {decl="GlobalTheory.Mass.siegelMassRatio_holds" file="Development/AbelianVarietyTheory/Proofs/FlagMeasures/SiegelMassRatioUnimodularDefinite.lean"}
Proves `SiegelMassRatio` of `Formalism/HermitianLattices/StatementMass.lean`, a hypothesis of 58 statements by our count, while `MassTelescope`, the product of the ratios over a range of ranks, is used by none.
:::

Each extra dimension multiplies the symmetry-weighted number of classes by a factorial, a power of the discriminant, and an $L$-value, and the chain adds $c+1$ dimensions at each of its $m$ steps. The class count of the first space, $\abs{\mathcal C_0} = \operatorname{mass}_I(N_0)\cdot\mathrm{idx}\cdot(P^{N_0}-1)^{2n}$, is the condition `ClassNumberFormula₂`, which `level_rank_of_trivial_stabilisers` uses to compute the dimension of the space of forms on $\mathcal C_0$.

### The Rallis inner product formula {#ml-rallis}

A theta lift can vanish, and the chain needs its size. The Rallis inner product formula computes the inner product of two theta lifts of cusp forms as an integral of the forms against a Siegel Eisenstein series on the doubled group [@rallis1984]. In the later language of the doubling method of Piatetski-Shapiro and Rallis this is a doubling zeta integral, which factors as a value of a standard $L$-function times local factors.

:::: theorem {#t-ml-rallis title="The inner product of two theta lifts of cusp forms is a doubling zeta integral of the forms" source="alpoge-lean"}
Let $V$ and $V'$ be Hermitian spaces of the datum with $\operatorname{rank}V < \operatorname{rank}V' \le 2\operatorname{rank}V$, and $V'$ anisotropic or $\operatorname{rank}V + (\text{Witt index of }V') < \operatorname{rank}V'$. For cusp forms $f_1, f_2$ in an irreducible cuspidal representation of $U(V)$ whose lifts vanish to every smaller space of the Witt tower of $V'$ (the spaces obtained from $V'$ by removing hyperbolic planes), and theta functions $\Xi_1, \Xi_2$, the lifts converge and are square-integrable, and
$$
\frac{1}{\operatorname{vol}[U(V')]}\,\big\langle\theta(f_1,\Xi_1),\theta(f_2,\Xi_2)\big\rangle = Z\big(s_0, f_1, f_2, \Xi(\delta(\Xi_1,\Xi_2))\big),
$$
the doubling zeta integral at the Siegel and Weil point $s_0$.
::::

::: sketch {source="rallis1984"}
Expand the inner product of two theta integrals, exchange the order of integration, and recognize the inner integral as a Siegel Eisenstein series on the doubled group by the Siegel and Weil formula. Rallis did this for orthogonal and symplectic groups, and the statement above is the code's version for unitary groups in the convergent range. Regularized versions for unitary groups followed from Kudla and Rallis and later authors [@gan-qiu-takeda2014]. In the tree the formula is proved as `rallis_of_dm` from the doubling method, the Siegel and Weil formula, and convergence of theta integrals.
:::

::: lean {decl="GlobalTheory.Published.RallisInnerProductConvergent" file="Development/AbelianVarietyTheory/PublishedTheorems/TwistedTraceFormula/LowerLiftsZeroOfWittIdxEqZero.lean"}
The field `RallisInnerProductConvergent` of the record of published theorems states the formula with the hypotheses above, and the definite-side records use it as the isometry `seeIso : SEEIso`, so that norms of lifts are known multiples of norms of the original forms.
:::


### Chowla and Selberg {#ml-chowla-selberg}

The Chowla and Selberg formula expresses the periods of an elliptic curve with complex multiplication by an imaginary quadratic field through values of the Gamma function, and its logarithmic form is the Kronecker limit formula averaged over the class group [@chowlaselberg1967]. The tree proves it in the form `chowla_selberg_eta` (in `Development/AbelianVarietyTheory/Proofs/HomogeneousIdeals/DedekindZetaEqSumRealEisenstein.lean`): for an imaginary quadratic field of discriminant $-d$ with class number $h$, character $\chi$, and one CM point $\tau_c$ in the upper half-plane for each ideal class $c$,
$$
\frac1h\sum_c \log\big(4\pi\,\Im\tau_c\,\abs{\eta(\tau_c)}^4\big) = \gamma_E + \log\frac{2\pi}{\sqrt d} - \frac{L'(1,\chi)}{L(1,\chi)},
$$ {#eq-ml-cs}
with $\eta$ Dedekind's eta function. For $d = 7$, with $h = 1$ and $\tau = (-1+\sqrt{-7})/2$, both sides equal $1.42650196679$, and for $d = 23$, with $h = 3$ and $\tau = (-1+\sqrt{-23})/2, (\mp1+\sqrt{-23})/4$, both equal $1.26946657138$ (we computed both with mpmath). The datum uses the right side as a normalizing period: `SizeData₂.logOm` is $\gamma_E + \log(2\pi/\mathrm{rd}_E) - \Re\,L'/L(1,\chi_{\mathsf d})$ with $\mathrm{rd}_E$ the root discriminant of $E$ and $\chi_{\mathsf d}$ the quadratic character modulo the datum's auxiliary prime $\mathsf d$ (the code's `d`, with $\sqrt{-\mathsf d} \in E$), and the quantity `MAIN` adds, over the indices $t$ of the datum, $m(a_T\log a_T - a_T - a_T\log\Omega) - a_T\log P$. As our reading, this is the logarithmic size of $m$ copies of an $a_T$-th derivative normalized by $\Omega^{a_T}$, set against $P^{a_T}$, the bookkeeping of the note's "$D^a\theta(0)/\Omega^a$".

### Divisibility as multiplicity: the odd-level series {#ml-thmp}

The note's step 2 is the stand-in for differentiation: "$D^p \equiv 0$ on a CM curve for $p$ inert in $K$", with $D$ an invariant derivation, and $D^a\theta(0)/\Omega^a$ is divisible by $p^{a/p + a/p^3 + \cdots - O(\log a)}$ [@alpoge-note]. Our reading of the integrality bookkeeping located its arithmetic engine in the declaration `ThmP`, whose constants are the odd-level series
$$
\gamma_\ell = \sum_{k\ \mathrm{odd}}\ell^{-k} = \frac{\ell}{\ell^2-1}, \qquad \rho_\ell = \sum_{k\ \mathrm{even},\,k\ge2}\ell^{-k} = \frac{1}{\ell^2-1}, \qquad \gamma_\ell + \rho_\ell = \frac1{\ell-1},
$$ {#eq-ml-gamma}
stated and proved as `Formalism.IncomingBounds.Constants` (in `Formalism/IncomingBounds/IncomingBound.lean`, proved as `constants`).

| $\ell$ | $\gamma_\ell$ | $\rho_\ell$ | $\gamma_\ell+\rho_\ell = \frac1{\ell-1}$ | $\frac1\ell + \frac1{\ell^3} + \frac1{\ell^5}+\frac1{\ell^7}$ |
| --- | --- | --- | --- | --- |
| 2 | $2/3 = 0.6667$ | $1/3$ | $1$ | $0.6641$ |
| 3 | $3/8 = 0.375$ | $1/8$ | $1/2$ | $0.37494$ |
| 5 | $5/24 = 0.20833$ | $1/24$ | $1/4$ | $0.2083328$ |

The note's exponent is $a/p + a/p^3 + \cdots = a\gamma_p$, minus $O(\log a)$. Legendre's formula $v_p(a!) = \sum_{k\ge1}\lfloor a/p^k\rfloor \approx a/(p-1)$ shows where it sits, as the odd levels $a\gamma_p$ of a budget whose even levels are $a\rho_p$. For $a = 1000$ and $p = 5$ the terms $\lfloor 1000/5^k\rfloor$ are $200, 40, 8, 1$, so $v_5(1000!) = 249$, the odd levels give $200 + 8 = 208$ against $1000\gamma_5 = 208.33$, and the even levels give $41$ against $1000\rho_5 = 41.67$. The note's exponent keeps the odd levels only.

Fix $n_0 \ge 1$ and two $n_0\times n_0$ matrices of variables, $X_L$ and $X_R$. For a polynomial $Q$ and a power series $g$ in these variables, the jet $Q(\partial)g(0)$ applies the differential operator with the coefficients of $Q$ to $g$ at the origin. For a prime $\ell$, an odd $i$, and $e(\ell,i) = 1 + \ell\sum_{0\le s<(i-1)/2}\ell^{2s}$, set
$$
h = -\ell^{-e(\ell,i)}\sum_{b,c}X_L(b,c)^{\ell^i}X_R(b,c) + h_1, \qquad J(y) = \big[\det(\partial_L)^{\ell^iy}\det(\partial_R)^{y}\,e^{h}\big](0),
$$ {#eq-ml-jet}
with $h_1$ a power series satisfying a weight condition. Only $\ell^i$-th powers of the left variables enter, and they come with an explicit negative power of $\ell$. As our reading, this is the analog of the note's "$D^p\equiv0$": in characteristic $p$ a derivation kills $p$-th powers, and here the $\ell^i$-th powers are what the left determinant operator sees.

::::: card {#t-ml-thmp kind="theorem" title="In every window of length $S_0$ there is an order $y$ at which the jet $J(y)$ is divisible by at most the predicted power of $\ell$" source="alpoge-lean"}
:::: statement
Let $C$ be a field of characteristic $0$ with an additive valuation $v$ such that $v(\ell) = 1$, where $\ell \ge 5$ is prime, let $i$ be odd, $1 \le n_1$, $n_0 \le n_1$, and let $h_1$ satisfy the weight condition $v(\text{coefficient of } X^\alpha) + \deg_L(\alpha)(r_1 - \delta) + \deg_R(\alpha)(r_2 - \delta) \ge \frac1{\ell-1}$ for every monomial $X^\alpha$, with $r_1 = \rho_\ell + \tfrac1{2\ell^i}$, $r_2 = \rho_\ell + \tfrac12$, $\delta = \tfrac1{8\ell^i}$, and have every nonzero monomial of degree at least $1$ in $X_R$. If $n_0 \ge 1$, then for every $Y_0$ there is an integer $y$ with $Y_0 \le y < Y_0 + S_0$, where $S_0 = \lceil 64n_0^2(i + 3 + 3\log_\ell(n_0+1))\rceil$, such that
$$
v\big(J(y)\big) \le n_0\,y\,\big((\ell^i+1)\gamma_\ell - 1\big) + n_1(\log_\ell n_1 + 1).
$$ {#eq-ml-thmp}
If $n_0 = 0$ then $J(y) = 1$ for every $y$.
::::
:::: plain
The derivative-like quantities $J(y)$ are not more divisible by $\ell$ than the formula predicts, at least once in every stretch of orders of a fixed length.
::::
:::: why
An upper bound on a valuation is a statement that the quantity is not zero and not too divisible. As our reading, it plays the role of [[t-st-nonzero]] in Stepanov's argument: without it, the quantity that carries the multiplicity could vanish identically and bound nothing.
::::
:::: idea
Expand $J(y)$ exactly as a binomial-type sum $(-\ell^{-e})^{n_0y}\,\mathrm{cap}(n_0, \ell^iy)\sum_s\binom ys a_s$, using the Cayley identity $\det(\partial)\det^{s+1} = (s+1)\cdots(s+n_0)\det^s$ to compute the derivatives of powers of determinants. Legendre's formula gives the valuation of the factorial product $\mathrm{cap}$. The coefficients $a_s$ have valuation growing like $s/8$, and a Newton-polygon argument finds, in every window of length $S_0$, a $y$ at which the binomial sum has valuation at most $0$.
::::
:::: sketch {source="alpoge-lean"}
`ThmP` is proved by `GlobalTheory.OddBlock.WindowValuationBound.main` and exported as `GlobalTheory.OddBlock.windowBound`, both in `Development/AbelianVarietyTheory/Proofs/UnramifiedDepth/SumEqOfIsHomogeneous.lean`. The proof starts from the exact expansion `GlobalTheory.OddBlock.BinomialValue.main`, then uses a Newton-polygon step, Legendre's formula for $v_\ell(N!)$, and a Capelli bound, and the file of the statement also defines the corresponding propositions `CoefficientExpansionLambda`, `P7`, `F2`, `F3`, and `CayleyId`. We state the theorem and its mechanism and do not unfold the Newton-polygon step.
::::
:::: example
Take $n_0 = n_1 = 1$ and $h_1 = 0$, which satisfies both conditions. Then $h = -\ell^{-e}X_L^{\ell^i}X_R$, and only the term $h^y/y!$ of $e^h$ contains $X_L^{\ell^iy}X_R^y$, so
$$
J(y) = (\ell^iy)!\,y!\cdot\frac{(-\ell^{-e})^y}{y!} = (-\ell^{-e})^{y}\,(\ell^iy)!,
$$
which we also checked by direct differentiation for $\ell = 5$, $i = 1$, $y = 1, 2$ (values $-24$ and $145{,}152$). By Legendre, $v_\ell(J(y)) = \frac{\ell^iy - s_\ell(y)}{\ell-1} - e\,y$, with $s_\ell(y)$ the sum of the base-$\ell$ digits of $y$. For $\ell = 5$ and $i = 3$, $e = 6$ and the slope of [[eq-ml-thmp]] is $(126)\tfrac5{24} - 1 = 25.25$. The valuations for $y = 1, \dots, 6$ are $25, 50, 75, 100, 126, 151$, against $25.25y = 25.25, 50.5, 75.75, 101, 126.25, 151.5$. For $i = 1$ the slope is $(\ell+1)\gamma_\ell - 1 = \tfrac1{\ell-1}$, and $v_\ell(J(y)) = v_\ell(y!)$ exactly. In this case the bound holds at every $y$, not only once per window.
::::
:::: lean {decl="Formalism.L2.FormalSeriesBounds.ThmP" file="Formalism/LocalToGlobal/CharacterGerms/BiadditiveInSingleVariables.lean"}
The definitions `LamP`, `hP`, `expE`, `gam`, and `rho` are in `Formalism/IncomingBounds/StatementThmP.lean` and `IncomingBound.lean`, and while a near-copy `Formalism.IncomingBounds.ThmP` is not reached from the final theorem, this one is, through `content_and_window` and `oddLevelBlock_bound_attained` down to the depth conditions `LeafDepthGood`.
::::
:::: used
The depth conditions `LeafDepthGood`, through `content_and_window` and `oddLevelBlock_bound_attained`, and the multiplicity column of [[ml-closing]].
::::
:::::

Now compare with the note. Write $a = \ell^iy$ for the order of the left derivatives, the note's $a$ and not the scale $a = x\,b$ of [[ml-scales]]. The main term of [[eq-ml-thmp]] is
$$
n_0 y\big((\ell^i+1)\gamma_\ell - 1\big) = n_0\big(a\gamma_\ell - y(1-\gamma_\ell)\big) = n_0\Big(\frac a\ell + \frac a{\ell^3} + \cdots\Big) - n_0(1-\gamma_\ell)\frac{a}{\ell^i},
$$
so up to a correction of relative size $\ell^{-i}$ it is the note's exponent $a/p + a/p^3 + \cdots$ with $p = \ell$, times $n_0$. In the example above, $a = 125$ and $y = 1$ give $a\gamma_5 = 26.04$, and the correction $1-\gamma_5 = 0.79$ brings it to $25.25$. The note's step 2 asserts a lower bound on divisibility, while `ThmP` is an upper bound. A lower bound of the same shape is in the tree, `GlobalTheory.T.determinantPairing_quotient_valuation_lower_bound`, and we did not trace which of the two feeds the per-lift exponents $e_0(w,j)$.

Here is our reading of how this relates to multiplicity. Over the integers the counterpart of "vanishes to order $m$ at $p$" is "divisible by $p^m$", as [[st-used]] noted, and by the note's step 2 the divisible quantities are jets, derivatives of a theta function at a CM point divided by a period. Each of the $m$ lifts contributes its own exponents, one per place and per lift (the $e_0(w,j)$ of `LeafDepthGood`), which is the sense in which the lifts are, in the note's words, "each mimicking multiplicity". The definition `vonMangoldtClassSum` of [[ml-length]] adds, for each lift and each prime $p$, the odd levels $a_T/p^i$ minus at least $1$ per level, which has the form of the note's $a/p + a/p^3 + \cdots - O(\log a)$ with $a = a_T$.

## The closing ledger {#ml-closing}

The chain provides multiplicity, about $x^{1/2-\varepsilon/16}$ lifts, each contributing exponents $e_0(w,j)$ at each place, with `ThmP` bounding the valuations of the jets from above in every window of orders. It provides numbers, the periods of the lifted forms, computable level by level ([[t-ml-iter]]), detecting more than half of the ramified forms (`RKC`), and algebraic with denominators controlled by stabilizer orders (`PeriodClassSumWeyl`). And it comes with a budget, [[t-ml-height]], by which a nonzero algebraic number cannot carry more divisibility than its archimedean size allows.

The chain costs size. The ranks reach about $x^{399+58\varepsilon}$, the class sets grow by the mass ratios [[eq-ml-mass]] at each added dimension, the auxiliary prime has $\log P \gtrsim x^{1/2+15\varepsilon/16}$ wherever `TuGe` holds, the norms of the lifts are fixed by the Rallis formula, and `MAIN` charges $m\,a_T\log\Omega$ for the Chowla and Selberg period. The note's step 14 says that a precise count of the cost of each lift showed "one would stop at 2/3 a priori" without a further idea [@alpoge-note]. We found no declaration matching that count, and the page does not reconstruct it.

Chapter [[integrality-and-galois]] takes the chain from here, with the Galois representations of automorphic forms over CM fields and the count of inert prime powers that the chain bounds through a record of divisibility and slope inequalities (its `SizeData₂`, with the divisibility inequality `DIV`), which its finite-group explicit formula turns into a bound on the combination $G_r$ of smoothed prime sums. How the chain's divisibility and integrality (`ThmP`, `DGam`, `chain_ge`, `PeriodClassSumWeyl`, and the exponents of `LeafDepthGood`) feed the divisibility inequality `DIV` of that record was not traced, in this chapter, in [[definite-forms]], or in [[integrality-and-galois]]. Chapter [[landau-endgame]] consumes that bound, $G_r(X) \le X^{1/2+9\varepsilon}$ on windows of scales $[Y, Y^{3/2}]$, which forbids zeros to the right of $\tfrac12 + 9\varepsilon$. The scale $x$ of [[d-ml-rankval]] is the scale of those windows, with the same $\varepsilon$.

## What could not be unfolded {#ml-gaps}

The formal proof establishes each of the following, and we did not unfold them, so the page names them and fills no gap.

- The kernel `ColumnChain.unf`, an abstract field with no theorem identifying it with a theta coefficient between classes of $X_j$ and $X_{j+1}$, and where the datum's chain is built from lattices in `Spaces.X j`.
- `HypsAlt`, the record of about 45 proof fields that the definite side supplies to the endgame, and `DefiniteSideCondition` with `RowsU`, `DivTied3`, and `PassIn3`, known by theme only.
- Where `RKC` is proved for the datum, and how it reaches `TopG`.
- The proof of `functional_lower_bound_of_conditions`, the integrand `colPer`, the functional `besPer`, and the proof of `theoremK_head2`.
- Which of `ThmP` and `determinantPairing_quotient_valuation_lower_bound` feeds $e_0(w,j)$, whether `TuGe` holds on every datum, and whether every family reaching the top satisfies `RankVal`.
- How the chain's divisibility and integrality (`ThmP`, `DGam`, `chain_ge`, `PeriodClassSumWeyl`, and the exponents of `LeafDepthGood`) feed the divisibility inequality `DIV` of the record `SizeData₂`, from which [[integrality-and-galois]] follows the count to the bound on $G_r$.

In the shorter rewrite of chapter [[route-a-compressed]], the link that the last item leaves open is its main inequality, [[t-rc-main]].

::: symbols
| Symbol | What it is | Kind | Where it lives |
| --- | --- | --- | --- |
| $v_w(x)$, $N(w)$, $\varpi_w$ | valuation at a prime ideal, its norm, the weight $\log N(w)/[F:\QQ]$ | integer, integer, real | [[ml-product]] |
| $F$ | a number field, totally complex in [[t-ml-height]] | field | [[ml-product]] |
| $X_j$, $X'$, $z$ | totally definite Hermitian spaces of the chain, the last split as $X'\oplus\langle z\rangle$ | vector spaces with forms | [[d-ml-spaces]] |
| $N_0$, $c$, $N_j$ | rank of $X_0$ (the code's `k`), the odd integer with rank step $c+1$ (the code's `t`), the rank $N_0 + j(c+1)$ of $X_j$ | integers | [[eq-ml-ranks]] |
| $\mathcal C_j$, $w_j$, $K_j$, $\mathcal L_j$ | class set, weights, kernel, one step of the chain | finite set, functions, linear map | [[d-ml-chainop]] |
| $A$, $n$, $n_W$ | the datum's finite abelian frame group (`Frame.A`), its order (`Frame.ord`), the integer `nWv` of `RankVal` | group, integers | [[d-ml-rankval]] |
| $P$ | the large auxiliary prime (the code's `T`) | prime | [[ml-scales]] |
| $E$, $E^+$, $\chi_{E/E^+}$, $L_E(M)$ | CM field, its totally real subfield, the quadratic character of $E/E^+$, the Euler product of the mass ratio | fields, character, real | [[t-ml-mass]] |
| $a$, $a_T$ | $x\,e^{x^\varepsilon}$ and the integer near it | reals, integer | [[ml-length]] |
| $\lambda$, $\mu$, $u$, $v$ | highest weights and Harish-Chandra parameters | integer and half-integer vectors | [[ml-branching]] |
| $\mathcal P$ | Bessel period | number | [[d-ml-bessel]] |
| $\mathcal P_C$, $d_u$ | period map and the dimension of ramified forms | linear map, integer | [[d-ml-rkc]] |
| $\gamma_\ell$, $\rho_\ell$ | odd-level and even-level series of $\ell$ | rationals | [[eq-ml-gamma]] |
| $J(y)$, $e(\ell,i)$ | jet of determinant powers and its exponent shift | element of $C$, integer | [[eq-ml-jet]] |
:::

::: recap
- Stepanov's inequality $mN \le D$ has a counterpart in the formal proof whose degree side is the product formula, used as [[t-ml-height]], while the slope inequality `DivIneqObjU` and `TheoremM` are in the tree but off the spine.
- The chain is $m$ applications of a weighted kernel operator on functions on class sets of totally definite spaces of ranks $N_0 + j(c+1)$ ([[d-ml-spaces]], [[d-ml-chainop]]), with $\sqrt{x^{1-\varepsilon/8}} \le m \le 2\sqrt{x^{1-\varepsilon/8}}$ ([[d-ml-rankval]]). Whether the note's $X$ is $x$ or $a_T \approx x e^{x^\varepsilon}$ is open for the original tree, and the rewrite of [[route-a-compressed]] calls $x$ the length of the prime sum.
- Forms are read as numbers through Bessel periods, whose local multiplicity is $0$ or $1$, as the branching rule [[t-ml-branching]] shows for compact groups. The code states the interlacing condition, the local nonvanishing `BesselPeriodGGP`, and a rank condition `RKC` on the period map, not a determinant.
- The seesaw is an exchange of the order of summation ([[t-ml-seesaw]]), and it computes the period of the $m$-fold lift level by level ([[t-ml-iter]]). No theorem states independence of the Hecke characters.
- The sizes come from Siegel's mass ratio [[t-ml-mass]], the Rallis inner product formula [[t-ml-rallis]], and the Chowla and Selberg period [[eq-ml-cs]]. The multiplicity is $\ell$-adic divisibility of jets with the odd-level series $\gamma_\ell = \ell/(\ell^2-1)$ of `ThmP` ([[t-ml-thmp]]), the note's $a/p + a/p^3 + \cdots$.
- Chapter [[integrality-and-galois]] bounds the count of inert prime powers, and chapter [[landau-endgame]] turns the resulting bound into zero-freeness.
:::
