---
id: route-a-plan
title: "Stepanov over the integers: the plan and the map of the formal proof"
part: 4
summary: After this chapter you can state exactly what the second proof of 2026 establishes, say in Stepanov's terms what its author says the idea is, follow the toy identity of the note's footnote as far as it can be made rigorous, place every node of the formal proof's spine with its Lean declaration and its chapter, and tell which of the note's twenty steps the code contains.
needs: [stepanov, weil-positivity, what-rh-says]
---

::: plain
The second proof of 2026 comes as a four-page note and a very large proof checked by a computer. The note says that the argument copies the one that settled the finite-field case, where a cleverly built function vanishes many times at every point being counted, and that the hard part over the whole numbers, making something vanish many times, is done by a chain of about the square root of X transformations between spaces of automorphic forms. This chapter states what was proved, retells the idea in the note's own words, and draws a map of the formal proof so that the next six chapters can be read as tours of its regions.
:::

Chapter [[stepanov]] ended with a list of what Stepanov's proof used and the integers lack, and the second item on that list is the one this part of the page is about: over a finite field an auxiliary function could be made to vanish to order $p^\mu$ at every rational point for free, because $p$-th powers are invisible to derivatives, while over $\ZZ$ every derivation is zero and there is nothing to count multiplicity with (section [[st-used]]). The proof released by Levent Alpoge with Claude on 2026-11-20 offers a substitute for that missing derivative, and it proves the Riemann Hypothesis and its generalization to all Dirichlet L-functions with it [@alpoge-note]. Its sources are unusual. The note is four pages long and gives the idea in a few sentences, a footnote, and a timeline of twenty steps that its author calls rough, while the formal proof is a Lean 4 tree of 175,187 files with no comments at all [@alpoge-lean]. This page's account of that tree rests on our reading of five regions of it, each unfolded into ordinary mathematics: the assembly and the analytic endgame from `Main` down to the zero-free statement, the theta-integral assembly and its unitary-group inputs, the theta lifts with the Galois-representation side and the integrality bookkeeping, the cohomological window `VWin` with base change, and the published inputs. This chapter puts those readings together into a map. It says what the code proves, what the note says the idea is, how far the toy identity of the note's footnote can be followed, how the formal proof is laid out, which of the note's steps the code contains, and what chapters [[landau-endgame]] to [[inputs-and-assembly]] will and will not unfold.

## What the formal proof proves {#ra-proved}

Everything the formal proof establishes is stated in one file of twelve lines, `Main.lean`, and every other file of the tree is there to make those five lines check. The theorems use Mathlib's definitions of $\zeta$, of Dirichlet characters, and of their L-functions, together with four propositions written out in a second short file, `Statements.lean` [@alpoge-lean]. Here are both files, verbatim except for their import lines.

```lean
theorem riemannHypothesis : RiemannHypothesis := rhOfAll

theorem riemannZeta_eq_zero_re : RiemannZetaZerosOnLine := rhOfAll

theorem LFunction_ne_zero_of_half_lt_re : DirichletLNonvanishingRightOfHalf := allChi

theorem LFunction_eq_zero_re : DirichletLZerosOnLine := claimAll.2.1

theorem LFunction_eq_zero_re_of_isPrimitive : PrimitiveDirichletLZerosOnLine := critAll
```

```lean
def RiemannZetaZerosOnLine : Prop :=
  ∀ s : ℂ, riemannZeta s = 0 → (¬∃ n : ℕ, s = -2 * ((n : ℂ) + 1)) → s ≠ 1 → s.re = 1 / 2

def DirichletLNonvanishingRightOfHalf : Prop :=
  ∀ (N : ℕ) [NeZero N] (χ : DirichletCharacter ℂ N) (s : ℂ),
    1 / 2 < s.re → (χ ≠ 1 ∨ s ≠ 1) → DirichletCharacter.LFunction χ s ≠ 0

def DirichletLZerosOnLine : Prop :=
  ∀ (N : ℕ) [NeZero N] (χ : DirichletCharacter ℂ N) (s : ℂ),
    0 < s.re → s.re < 1 → DirichletCharacter.LFunction χ s = 0 → s.re = 1 / 2

def PrimitiveDirichletLZerosOnLine : Prop :=
  ∀ (N : ℕ) [NeZero N] (χ : DirichletCharacter ℂ N), χ.IsPrimitive →
    ∀ s : ℂ, 0 < s.re → s.re < 1 → DirichletCharacter.LFunction χ s = 0 → s.re = 1 / 2
```

Read in ordinary mathematics, with $L(s,\chi)$ the analytic continuation of $\sum_n\chi(n)n^{-s}$ from chapter [[what-rh-says]], the five theorems say the following.

1. `riemannHypothesis` is the Riemann Hypothesis in Mathlib's own definition: every zero $s$ of $\zeta$ that is not one of $-2,-4,-6,\dots$ and is not $s=1$ has real part $\tfrac12$. The exclusion of $s=1$ is there only because Mathlib gives $\zeta$ a value at its pole, and it removes nothing.
2. `riemannZeta_eq_zero_re` is the same statement written out in `Statements.lean`. `Main.lean` gives the same proof term `rhOfAll` for both, so the two must agree up to unfolding of definitions.
3. `LFunction_ne_zero_of_half_lt_re` says that for every modulus $N\ge1$, every Dirichlet character $\chi$ modulo $N$, primitive or not, and every $s$ with $\Re s>\tfrac12$, the value $L(s,\chi)$ is not zero, except at the single point $s=1$ when $\chi$ is the principal character. This is the half-plane form of the Generalized Riemann Hypothesis of [[d-rh-grh]].
4. `LFunction_eq_zero_re` says that every zero of every $L(s,\chi)$ in the open strip $0<\Re s<1$ has real part $\tfrac12$. For an imprimitive $\chi$ the extra zeros contributed by the missing Euler factors lie on $\Re s=0$, outside the strip.
5. `LFunction_eq_zero_re_of_isPrimitive` is the same for primitive characters only, a special case of the fourth.

All five rest on the third, which the code also calls `UpperTheory.EveryCharacter`, and chapter [[landau-endgame]] proves the short functional-equation arguments that pass from it to the others.

::::: card {#t-ra-main kind="theorem" title="Every nontrivial zero of $\zeta$ and of every Dirichlet L-function lies on the critical line" source="alpoge-lean"}
:::: statement
Every zero of $\zeta$ other than the trivial zeros $-2,-4,-6,\dots$ has real part $\tfrac12$. For every Dirichlet character $\chi$ modulo $N\ge1$, $L(s,\chi)\ne0$ whenever $\Re s>\tfrac12$, except at $s=1$ for the principal character, and every zero of $L(s,\chi)$ with $0<\Re s<1$ has real part $\tfrac12$.
::::
:::: plain
The Riemann Hypothesis holds, and so does its generalization to every L-function of a Dirichlet character.
::::
:::: why
This is the theorem Part IV explains. Its reach, the zeta function and every Dirichlet L-function, fixes what the rest of the proof has to deliver.
::::
:::: idea
Show that no L-function of a primitive character has a zero with real part above $\tfrac12+9\varepsilon$, for every small $\varepsilon>0$, by bounding from above, on long windows of scales, the smoothed prime sum $S(X)$ of chapter [[what-rh-says]] with its main term removed, twisted by the powers of the character and combined. The bound is one-sided: the code proves an upper bound on these sums and never states the positivity of Weil's functional of which the note speaks. The bound comes from a chain of about $\sqrt x$ theta lifts between definite unitary groups and from a bound on certain Galois cohomology groups. The functional equation then gives the line.
::::
:::: sketch {source="alpoge-lean" loc="Main.lean and the spine of section ra-map"}
The section [[ra-map]] lays out the chain of declarations from `Main.lean` down to the three named inputs, and chapters [[landau-endgame]] to [[inputs-and-assembly]] take the links in turn. A text search of the tree finds no `sorry` and no `axiom`. This repository indexed and searched the tree and did not build it, so whether the five theorems rest only on Lean's foundations and Mathlib is what a build would certify; chapter [[inputs-and-assembly]] says what a build would add.
::::
:::: lean {decl="riemannHypothesis" file="Main.lean"}
The five theorems take no hypotheses and are the only statements in `Main.lean`.
::::
:::: used
The endgame [[landau-endgame]] derives the five statements from the half-plane statement, and every later chapter of Part IV explains one region of its proof.
::::
:::::

The reach of the proof is the zeta function and all Dirichlet L-functions. As our remark, not the code's, this also gives the hypothesis for the Dedekind zeta function of every abelian number field, because such a function is a product of Dirichlet L-functions, but the code states nothing about number fields or Hecke characters in general. The note goes no further either, and says of the extended hypothesis of [[d-rh-erh]] only "I expect, with more time, the Extended Riemann Hypothesis too" [@alpoge-note]. Route M of Part III already reaches every Hecke L-function of every number field, so on this page the two proofs share the Riemann Hypothesis and the Dirichlet case, and only the first reaches the extended hypothesis (section [[s-tg-general]]).

## The idea in the author's words {#ra-idea}

The note gives the idea in four sentences and asks the reader to take the Lean code as the full account [@alpoge-note]. We quote them sparingly and set each against chapter [[stepanov]], because the vocabulary of that chapter, auxiliary function, order of vanishing, degree budget, is the one the note uses.

### A descendant of Stepanov's {#ra-descendant}

The note says of its argument that it "is a descendant of Stepanov's", and it names the feature that makes the descent hard: Stepanov's argument "uses a divisor involving multiplicity" [@alpoge-note]. In chapter [[stepanov]] that divisor was the zero set of an auxiliary function $F$ that vanished to order at least $p^\mu=\sqrt q$ at every rational point but one, while its pole order at the remaining point stayed below a budget fixed by the Riemann and Roch count. The proof was then the inequality of [[t-st-roots]] in disguise, since zeros of order at least $m$ at $N$ points cost $mN$ units of degree, so that $N\le D/m$.

### What multiplicity bought, and why the integers do not sell it {#ra-multiplicity}

Multiplicity bought the whole gain. With multiplicity one, the same count only shows that the number of points is at most the degree of an auxiliary function, which gives nothing better than the trivial bound, while with multiplicity $\sqrt q$ each point uses up $\sqrt q$ units of the degree budget and the count becomes the bound $q+(2g+1)\sqrt q$ of [[t-st-upper]]. And multiplicity was free in characteristic $p$, because a $p^\mu$-th power that vanishes at a point vanishes there to order $p^\mu$ (lemma [[t-st-vanishing]]).

Over the integers the note puts the obstacle in one phrase, saying that multiplicity is hard to find, "corresponding to something like differentiating whole numbers" [@alpoge-note]. Chapter [[stepanov]] made this precise. A derivation $\delta\colon\ZZ\to\ZZ$ with $\delta(ab)=a\,\delta(b)+b\,\delta(a)$ has $\delta(1)=2\delta(1)$, so $\delta(1)=0$ and then $\delta(n)=n\,\delta(1)=0$ for every $n$. There is no derivative to make an integer vanish twice. What does exist is divisibility: an integer that is divisible by $p^m$ behaves, for counting purposes, like a function that vanishes to order $m$ at the point $p$, and a nonzero integer that is divisible by $p^e$ must be at least $p^e$ in size, which is the integer form of the degree budget (the determinant method of section [[st-used]]).

So for something else to play the role of the derivative, it has to do three things that $p$-th powers did for Stepanov. It has to manufacture high divisibility automatically, without solving for it point by point. It has to do so for many primes at once, the analogue of many rational points. And the object it acts on has to be nonzero and of controlled size, so that a product formula or a lattice count can play the degree budget. In our reading, the formal proof does all three. Divisibility is measured $\ell$-adically, prime by prime and lift by lift, with a valuation bound on jets of powers of determinants (`ThmP`, which bounds the valuation of some jet in every window of orders), and the degree budget on the spine is the product formula for a nonzero algebraic number, which says that it cannot be divisible by more prime powers than its archimedean size allows (`norm_height_bound`); both are in chapter [[multiplicity-from-lifts]]. The code names neither $D$ nor multiplicity.

### A chain of theta lifts {#ra-chain}

The note's answer to what plays the derivative is the sentence its author singles out. The "simple, new, Fourier-analytic ideas" of a toy setting led to "chaining theta lifts", so that the same tricks would recur "in a natively automorphic manner", and for the von Mangoldt sum of length $X$ the suggested length of the chain, "in view of each mimicking multiplicity, was $\sqrt X$", followed by the aside "And yet, what else could it be?" [@alpoge-note]. The timeline's step 8 says the same in formulas: iterated theta lifts $U(X_0)\to U(X_1)\to\dots\to U(X_m)$ between totally definite unitary groups, each sending a form $\pi$ to $\pi\boxplus\mu_j[t]$, win "multiplicity $m$" [@alpoge-note].

A theta lift is a map that carries an automorphic form on one group to an automorphic form on another, by integrating it against a theta function built from a Weil representation. On a totally definite unitary group, one whose Hermitian form is positive definite at every real place, an automorphic form of fixed level is a function on a finite set of lattice classes, so a theta lift between two such groups is a finite matrix and a chain of $m$ lifts is a product of $m$ matrices (chapter [[definite-forms]]). The code builds such a chain at each scale $x$ and fixes its length in the declaration `GlobalTheory.EX.RankVal` [@alpoge-lean].

```lean
def RankVal (s : Scale) (R : Ranks) : Prop :=
  (s.x ^ (2 + 8 * s.eps) ≤ (R.n : ℝ) ∧ (R.n : ℝ) ≤ 2 * s.x ^ (2 + 8 * s.eps)) ∧
  (Real.sqrt (s.x * s.delta1) ≤ (R.m : ℝ) ∧ (R.m : ℝ) ≤ 2 * Real.sqrt (s.x * s.delta1)) ∧
  (s.x ^ (9 / 2 + 10 * s.eps) ≤ (R.k : ℝ) ∧ (R.k : ℝ) ≤ 2 * s.x ^ (9 / 2 + 10 * s.eps)) ∧
  R.r + R.t = 8 * R.f * R.r + 4 + TOv s * nWv R s
```

With $\delta_1=x^{-\varepsilon/8}$ (`Scale.delta1`), the second line says $\sqrt{x^{1-\varepsilon/8}}\le m\le2\sqrt{x^{1-\varepsilon/8}}$, so $m$ is between $x^{1/2-\varepsilon/16}$ and twice that. The code has no variable named after the note's $X$. Taking $X$ to be this scale $x$, which is also the scale at which the endgame bounds its sums, makes $m$ the note's square root with an $\varepsilon$ of room, and that identification is our reading. The same datum also carries a much longer length, about $x\,e^{x^\varepsilon}$ (chapter [[multiplicity-from-lifts]]), and the code does not say which length the note means.

Why the square root? The note's aside suggests the author found it inevitable, and the code does not say. One comparison with chapter [[stepanov]] is ours and is offered only as an analogy. In Bombieri's form of Stepanov's proof the multiplicity at each rational point is $p^\mu=\sqrt q$, the square root of the size of the field whose points are counted, and the resulting error term is of size $\sqrt q$. Here the chain length, which the note says mimics multiplicity, is the square root of the scale $x$ at which primes are counted, and the target is an error of size $x^{1/2+9\varepsilon}$. In both cases the multiplicity is matched to the error the proof is aiming at.

The turning point of the discovery, by the note's account, was "multiplicity 2 on $O(2,n)$ via the 'natively-automorphic' determinant", found by analogy with "the definite sign of the left-hand side of $qN=M^k+R$" in the toy setting, after which more theta lifts won more multiplicity [@alpoge-note]. That identity is the subject of the next section.

::::: figure {#f-ra-ledger viz="ra-ledger" height="500"}
Each role in Stepanov's proof has a counterpart in the formal proof over the integers, and the ledger marks which pairings the code states and which are our reading.

```vizspec
Purpose: set Stepanov's proof for curves beside the formal proof over the integers, role by role.
Scene: a two-column ledger on the dark stage. Left column header "Stepanov, over F_q" (muted), right column
  header "The formal proof, over Z" (muted). Seven rows, each a pair of rounded cards joined by a thin
  horizontal connector. Row texts (left | right | tag):
  1. "What is counted: rational points N_1 of a curve" | "Zeros of L(s, chi), seen through the smoothed
     prime sum G_r(x)" | code
  2. "Auxiliary object: a function F on the curve with poles only at P_0" | "Automorphic forms on totally
     definite unitary groups: functions on finite sets of lattice classes" | code
  3. "Multiplicity: F vanishes to order p^mu = sqrt(q) at every rational point" | "A chain of m theta lifts,
     sqrt(x^(1-eps/8)) <= m <= 2 sqrt(x^(1-eps/8)) (RankVal), measured by l-adic divisibility (ThmP)" |
     reading
  4. "Why multiplicity is free: p-th powers are invisible to derivatives" | "No derivative on Z: each lift
     adds one block pi -> pi boxplus mu_j[t] to the parameter" | reading
  5. "Degree budget: Riemann and Roch, a nonzero F has as many zeros as poles" | "Product formula: a nonzero
     algebraic number is not divisible beyond its archimedean size (norm_height_bound)" | reading
  6. "Extensions: pass to F_(q^n) and use twists for the lower bound" | "A 2-adic cyclotomic tower, and
     windows of scales found by a pigeonhole (VWin)" | reading
  7. "Conclusion: every inverse root has absolute value sqrt(q)" | "A bound x^(1/2 + 9 eps) on windows forbids
     zeros with real part above 1/2 + 9 eps, then eps -> 0" | code
  Left cards are drawn in blue outline; right cards in gold outline. Each right card carries a small chip at
  its right edge: "in the code" (teal fill) or "our reading" (red outline).
Controls: a stepper with Previous and Next buttons and a row counter "row k of 7". Clicking or tapping a row
  also selects it. A toggle "show only what the code states" dims the rows tagged reading.
Motion: on Next, the next row slides in from below (250 ms ease-out) and the connector draws left to right;
  the selected row is highlighted with a brighter outline. Reduced motion shows all rows at once.
Reader takeaway: the shape of Stepanov's argument survives, the counted objects and the code-level statements
  are new, and the pairing of roles in rows 3 to 6 is interpretation, not a label in the code.
Layout: at widths below 600 px, stack the two cards of a row vertically with the connector vertical.
Data: the row texts above.
```
:::::

## The toy setting {#ra-toy}

The note says that the author had been "combining two quite different ideas present in a toy setting", one of them new, and that the new ideas were Fourier-analytic [@alpoge-note]. Elsewhere it calls one result of that setting a "$qN=M^k+R$ sign-only proof of Weil and Deligne", and footnote 3 describes it in a single dense paragraph [@alpoge-note]. Weil's theorem is the Riemann Hypothesis for curves of chapter [[function-fields]], and Deligne's is its extension to varieties of every dimension [@weil1948] [@deligne1974]. This section is our reconstruction of the footnote, and everything in it is our reading unless it is quoted. We take the simplest instance, prove what can be proved at the level of this page, check it with numbers, and stop where the footnote's meaning cannot be pinned down.

### The sum of the footnote {#ra-toy-sum}

In this section, as in chapters [[function-fields]] and [[stepanov]], $q$ is the size of a finite field, and we take it to be an odd prime so that additive characters are plain exponentials. The letters $k$, $t$, $h$, $M$, $N$, and $R$ are the note's, used here only inside this section, so $k$ is not the Tate twist of chapter [[cohomology-window]], $t$ is not an imaginary part, $h$ is not a test function, and $N$ is not a zero count. For $a\in\FF_q$ write $e_q(a)=e^{2\pi i a/q}$, an additive character of $\FF_q$, which is well defined because $a$ is an integer modulo $q$. Fix a positive integer $k$ and a real weight $t\colon\FF_q\to\RR$, and let
$$
Q_k(x)=x_1x_2+x_2x_3+\dots+x_{k-1}x_k ,\qquad x=(x_1,\dots,x_k)\in\FF_q^k ,
$$ {#eq-ra-path-quadric}
the quadric the note writes, which we call the path quadric because its terms follow the edges of a path through the $k$ coordinates. The footnote's sum is
$$
\Sigma=\sum_{h\in\FF_q}\ \sum_{x\in\FF_q^k} t(x_1)\cdots t(x_k)\, e_q\big(h\,Q_k(x)\big).
$$ {#eq-ra-toy-sum}
It is a finite sum of $q^{k+1}$ terms. The footnote does not say what $t$ is. We take for $t$ the simplest function whose sum $M=\sum_x t(x)$ is a quantity that Weil's theorem bounds. With $f(x)=x^3+x+1$, the curve of chapters [[function-fields]] and [[stepanov]], let $t(x)$ be the Legendre symbol of $f(x)$ modulo $q$, that is $1$ if $f(x)$ is a nonzero square, $-1$ if it is a nonsquare, and $0$ if $f(x)=0$. Each $x$ gives $1+t(x)$ affine points on $y^2=f(x)$, so with the point at infinity $N_1=q+1+M$, and by [[eq-ff-explicit]] with $n=1$,
$$
M=\sum_{x\in\FF_q}t(x)=N_1-q-1=-(\alpha_1+\alpha_2),
$$ {#eq-ra-toy-M}
minus the sum of the two inverse roots. Weil's theorem says $\lvert M\rvert\le2\sqrt q$. Over $\FF_{101}$ chapter [[stepanov]] found $N_1=105$, so $M=3$.

### Summing over h first {#ra-toy-orthogonality}

The footnote's instruction is to "sum over $h$ first for the left-hand side" [@alpoge-note]. The inner sum over $h$ is a geometric series in $e_q(Q_k(x))$, and the orthogonality of additive characters evaluates it,
$$
\sum_{h\in\FF_q}e_q(h a)=\begin{cases} q, & a=0,\\ 0, & a\ne0,\end{cases}
$$
because for $a\ne0$ the number $e_q(a)$ is a $q$-th root of unity different from 1 and the sum of its powers is $(e_q(a)^q-1)/(e_q(a)-1)=0$. Putting $a=Q_k(x)$ keeps exactly the points of the quadric,
$$
\Sigma=q\,N,\qquad N=\sum_{x\in\FF_q^k,\ Q_k(x)=0} t(x_1)\cdots t(x_k).
$$ {#eq-ra-toy-N}
So $N$ counts the solutions of $x_1x_2+\dots+x_{k-1}x_k=0$ over $\FF_q$, each weighted by the product of the weights of its coordinates. With $t\equiv1$ it is the number of points of the quadric. For even $k$ the path quadric is a nondegenerate quadratic form in $k$ variables (the determinant of the adjacency matrix of a path with an even number of vertices is $\pm1$) of the split type, and the standard count gives $q^{k-1}+q^{k/2}-q^{k/2-1}$ points [@lidl1997, ch. 6]. We checked this formula by direct count for $q\in\{5,7,11,13\}$ and $k\in\{2,4,6\}$.

### Expanding the other way {#ra-toy-parseval}

The other way to evaluate $\Sigma$ is to keep $h$ outside. For each $h$ write
$$
S_h=\sum_{x\in\FF_q^k}t(x_1)\cdots t(x_k)\,e_q\big(h\,Q_k(x)\big),
$$
so that $\Sigma=\sum_h S_h$. The term $h=0$ has no exponential and factors as $M^k$, which is what the footnote calls the "zero-mode" [@alpoge-note]. The rest is the remainder $R=\sum_{h\ne0}S_h$, and comparing with [[eq-ra-toy-N]] gives the identity of the note's step 3,
$$
q\,N = M^k + R .
$$ {#eq-ra-toy-identity}
The footnote says that $R$ has "square-root-quality" by "iterating Parseval $k$ times" [@alpoge-note]. Parseval's identity on $\FF_q$ says that for $h\ne0$ and any $v\colon\FF_q\to\CC$,
$$
\sum_{y\in\FF_q}\Big\lvert\sum_{x\in\FF_q}v(x)\,e_q(hxy)\Big\rvert^2=q\sum_{x\in\FF_q}\lvert v(x)\rvert^2 ,
$$ {#eq-ra-parseval}
which follows by expanding the square and applying orthogonality in $y$. The path structure of $Q_k$ is what lets it be iterated: $e_q(hQ_k(x))$ is a product of factors $e_q(hx_jx_{j+1})$, one per edge, so $S_h$ is a chain in which each coordinate meets only its two neighbors.

::::: card {#t-ra-toy kind="proposition" title="For every real weight bounded by $1$, the weighted count of the path quadric satisfies $qN=M^k+R$ with $\lvert R\rvert\le(q-1)\,q^{(k-1)/2}$ times the sum of the squared weights"}
:::: statement
Let $q$ be an odd prime, $k\ge2$, and $t\colon\FF_q\to\RR$ with $\lvert t\rvert\le1$. With $M$, $N$, $R$, and $S_h$ as above, $qN=M^k+R$, and for every $h\ne0$
$$
\lvert S_h\rvert\le q^{(k-1)/2}\sum_{x\in\FF_q}t(x)^2,\qquad\text{so}\qquad \lvert R\rvert\le(q-1)\,q^{(k-1)/2}\sum_{x\in\FF_q}t(x)^2\le(q-1)\,q^{(k+1)/2}.
$$ {#eq-ra-toy-bound}
::::
:::: plain
The weighted count of solutions of the path quadric, times $q$, is the $k$-th power of the plain sum of the weights plus a remainder, and the remainder is controlled by Parseval's identity alone, with no knowledge of how the weights cancel.
::::
:::: why
This is the part of the footnote's "sign-only" argument that can be proved at the level of this page. It shows how the size of $R$ comes from Fourier analysis on the path, with no Gauss sum and no algebraic geometry, which matches the footnote's phrase "Gauss sum cancellation replaced by iterated Parseval" [@alpoge-note].
::::
:::: idea
Cut the path at one edge. The two halves are vectors whose lengths grow by at most $\sqrt q$ per edge, by Parseval, and the cut edge pairs them through one more Fourier transform, so Cauchy and Schwarz finish.
::::
:::: proof
The identity is [[eq-ra-toy-identity]]. For the bound fix $h\ne0$ and define vectors on $\FF_q$ from the left end and from the right end of the path,
$$
v_1=t,\quad v_{j+1}(y)=t(y)\sum_{x}v_j(x)\,e_q(hxy);\qquad u_1=t,\quad u_{j+1}(x)=t(x)\sum_{y}e_q(hxy)\,u_j(y).
$$
::: steps
1. Unfolding the definitions, the chain splits at the edge between coordinates $a$ and $a+1$ for any $1\le a\le k-1$, and with $b=k-a$,
$$
S_h=\sum_{x,y\in\FF_q}v_a(x)\,e_q(hxy)\,u_b(y).
$$
2. Since $\lvert t\rvert\le1$, Parseval [[eq-ra-parseval]] gives $\lVert v_{j+1}\rVert_2\le\big\lVert\sum_x v_j(x)e_q(hx\,\cdot)\big\rVert_2=\sqrt q\,\lVert v_j\rVert_2$, and the same for $u$, so
$$
\lVert v_a\rVert_2\le q^{(a-1)/2}\lVert t\rVert_2,\qquad \lVert u_b\rVert_2\le q^{(b-1)/2}\lVert t\rVert_2 .
$$
3. Cauchy and Schwarz in $x$, then Parseval once more for the inner sum over $y$, give
$$
\lvert S_h\rvert\le\lVert v_a\rVert_2\,\sqrt q\,\lVert u_b\rVert_2\le q^{(k-1)/2}\lVert t\rVert_2^2 .
$$
4. Summing over the $q-1$ values $h\ne0$ and using $\lVert t\rVert_2^2=\sum_x t(x)^2\le q$ gives
$$
\lvert R\rvert\le(q-1)\,q^{(k-1)/2}\lVert t\rVert_2^2\le(q-1)\,q^{(k+1)/2}.
$$
:::
The proof applies Parseval $k-1$ times and Cauchy and Schwarz once. The footnote says $k$ times, and we take the difference to be bookkeeping.
::::
:::: example
For $t\equiv1$ everything is explicit. Then $M=q$, $N$ is the point count of [[eq-ra-toy-N]], and for even $k$ the identity reads $q\big(q^{k-1}+q^{k/2}-q^{k/2-1}\big)=q^k+(q-1)q^{k/2}$. So every $S_h$ with $h\ne0$ equals $q^{k/2}$, the square root of the zero mode $S_0=q^k$, and $R=(q-1)q^{k/2}$. For $q=5$ and $k=4$ that is $725=625+100$. The bound [[eq-ra-toy-bound]] gives $\lvert S_h\rvert\le q^{(k+1)/2}$, worse than the truth by $\sqrt q$, because Parseval does not see the Gauss sum. Our reading of the footnote's "up to an inch or so" is this loss of a fixed power of $q$, which becomes negligible after a $k$-th root.
::::
:::: used
The sign question of section [[ra-toy-sign]] and the figure [[f-ra-toy]].
::::
:::::

### Worked numbers for k = 2 and k = 4 {#ra-toy-numbers}

For $k=2$ the quadric $x_1x_2=0$ is the union of the two coordinate axes, so $N=2t(0)M-t(0)^2$ exactly, and with the Legendre weight $t(0)$ is the symbol of $f(0)=1$, which is $1$. Over $\FF_{101}$ this gives $N=2\cdot3-1=5$, and the identity reads $101\cdot5=505=9+496$, so $M^2=9$ and $R=496$. The Parseval bound for this $R$ is $100\cdot101^{1/2}\cdot101\approx1.015\times10^5$, and the largest single $\lvert S_h\rvert$ is $248.8$ against its bound $101^{3/2}\approx1015$. The case $k=2$ carries no information, since the identity is the trivial count of the two axes, and the first case with content is $k=4$.

For $k=4$ we computed $N$ exactly with integer arithmetic by a recursion along the path, which tracks the last coordinate and the partial value of $Q_4$ modulo $q$, and computed each $S_h$ separately in floating point. The identity [[eq-ra-toy-identity]] held to rounding in every case. The table lists the Legendre weight of $y^2=x^3+x+1$ for six primes. The column "bound" is $(q-1)q^{3/2}\sum_xt(x)^2$ from [[eq-ra-toy-bound]].

| $q$ | $M$ | $N$ | $qN$ | $M^4$ | $R$ | bound |
| --- | --- | --- | --- | --- | --- | --- |
| 5 | 3 | 21 | 105 | 81 | 24 | 224 |
| 7 | $-3$ | 53 | 371 | 81 | 290 | 778 |
| 11 | 2 | $-72$ | $-792$ | 16 | $-808$ | 3,648 |
| 13 | 4 | 4 | 52 | 256 | $-204$ | 6,750 |
| 37 | 10 | $-76$ | $-2{,}812$ | 10,000 | $-12{,}812$ | 291,681 |
| 101 | 3 | $-1{,}675$ | $-169{,}175$ | 81 | $-169{,}256$ | $1.025\times10^7$ |

Two things are visible. The remainder is far inside its Parseval bound, and in fact $\lvert R\rvert$ is within a factor of three of $q^{(k+1)/2}$ in every row (at $q=101$ it is $1.65$ times $101^{5/2}$), which is what square-root quality relative to the $q^{k+1}$ terms of $\Sigma$ would predict. And the sign of $qN$ changes from prime to prime, positive for $q=5$, $7$, and $13$, negative for $q=11$, $37$, and $101$.

### What a sign would give, and where we stop {#ra-toy-sign}

The footnote's claim is about that sign. Summing over $h$ first, it says, "Bertini gives a definite sign from middle cohomology, one off the one on $M^k$", and on the other side $M^k$ is the zero mode and $R$ has square-root quality, with "opposite signs meaning no cancellation of inverse roots, QED" [@alpoge-note]. The deduction that such a sign would allow is elementary, and we give it as our reading. Suppose that for some even $k$ the left side had the sign opposite to $M^k\ge0$, that is $qN\le0$. Then [[eq-ra-toy-identity]] and [[eq-ra-toy-bound]] give
$$
M^k=qN-R\le-R\le\lvert R\rvert\le(q-1)\,q^{(k+1)/2}<q^{(k+3)/2},\qquad\text{so}\qquad\lvert M\rvert<q^{\frac12+\frac{3}{2k}} .
$$ {#eq-ra-toy-sign}
The exponent tends to $\tfrac12$ as $k$ grows. Applied over every extension $\FF_{q^n}$, where by [[eq-ra-toy-M]] the sum becomes $-(\alpha_1^n+\alpha_2^n)$, a bound $\lvert\alpha_1^n+\alpha_2^n\rvert\le C\,q^{n(1/2+3/(2k))}$ for all $n$ forces $\lvert\alpha_i\rvert\le q^{1/2+3/(2k)}$ by the argument of [[t-ff-rh-from-bound]], and letting $k$ grow gives $\lvert\alpha_i\rvert\le\sqrt q$. A definite sign on one side and square-root quality on the other would therefore prove Weil's theorem for this curve with no geometry beyond the sign, which is our reading of "sign-only".

The plain sum [[eq-ra-toy-sum]] does not have that sign, and the table already shows it changing. More is true, and it is a theorem rather than an observation. Over $\FF_{37}$ the Legendre weight has $M=10$, larger than $\sqrt{37}\approx6.08$ though within Weil's $2\sqrt{37}\approx12.2$, and $\sum_xt(x)^2=36$ because $f$ has one root modulo 37. For every even $k\ge12$ the zero mode beats the Parseval bound, $10^k>36\cdot36\cdot37^{(k-1)/2}$, so [[eq-ra-toy-identity]] forces $qN>0$, the same sign as $M^k$. At $k=12$ the exact values are $qN=1{,}007{,}583{,}904{,}577$ against $M^{12}=10^{12}$ and the bound $5.47\times10^{11}$. If the plain sum had the opposite sign for every even $k$, the argument above would prove $\lvert M\rvert\le\sqrt q$ over every field, which is false here. So the definite sign of the footnote is not a property of the plain sum. It needs the ingredients the footnote names and does not explain, coefficients on the quadric ("with e.g. quadric coefficients too"), Bertini's theorem, and the middle cohomology of the resulting variety, and a cohomological sign of that kind is beyond what this page can reconstruct or check. We stop here. The footnote also says to "vectorize to go up dimensions" and traces the path quadric to a reciprocity law for normalized Gauss sums that live on a cover of $\mathrm{GL}_2$, and we do not reconstruct those remarks either.

### Is the identity in the code? {#ra-toy-lean}

We searched the index of the Lean tree for the identity, by the names and statements that would carry it: quadrics, Parseval, products of additive characters, path-shaped sums $x_i\,x_{i+1}$, and the names Deligne, Katz, Bertini, and Gabber, with special attention to `Development/WeilBound` and to the inventory's section on the toy setting. The weighted sum [[eq-ra-toy-sum]], the identity [[eq-ra-toy-identity]], and any sign argument for it do not occur. The nearest statements are an unweighted count of a quadric by the same orthogonality step, `GlobalTheory.CompanionTheory.SW.QuadricCount.count_mul_card`, and the square-root count of a nondegenerate quadric in an even number of variables, `quadric_count_even`, both in `CompanionTheory/SpectralGeometry/LocalGlobalProofs/AdelicAnalysis/FiniteFieldQuadraticFormPointCount.lean` [@alpoge-lean].

```lean
theorem count_mul_card (ψ : AddChar k ℂ) (hψ : ψ ≠ 1) (B : Matrix ι ι k) (s : k) :
    (Nat.card {x : ι → k // quadForm B x = s} : ℂ) * (Fintype.card k : ℂ) =
      ∑ t : k, ψ (-(t * s)) * ∑ x, ψ (t * quadForm B x)
```

The second is proved through Gauss sums, not iterated Parseval. Both are in the import closure of `Main`, and we did not check whether the final theorem uses them. The absence is what one would expect, since the toy setting is a finite-field model and the formal proof works over the integers.

::::: figure {#f-ra-toy viz="ra-toy-identity" height="460"}
The identity qN = M^k + R holds exactly for every prime and every k, the remainder stays inside its Parseval bound, and the sign of qN is not fixed by the identity alone.

```vizspec
Purpose: let the reader check the toy identity q N = M^k + R and see the size of R against its Parseval
  bound, for a chosen prime and path length.
Definitions: q an odd prime, F_q = {0, ..., q-1}, e_q(a) = exp(2 pi i a / q). Weight t(x) is either
  "t = 1" (constant) or "Legendre": t(x) = Legendre symbol of f(x) = x^3 + x + 1 mod q (1 if a nonzero
  square, -1 if a nonsquare, 0 if f(x) = 0 mod q). M = sum_x t(x). Path quadric
  Q_k(x) = x_1 x_2 + x_2 x_3 + ... + x_{k-1} x_k. N = sum of t(x_1)...t(x_k) over x in F_q^k with
  Q_k(x) = 0 mod q. S_h = sum over x in F_q^k of t(x_1)...t(x_k) e_q(h Q_k(x)); R = sum_{h != 0} S_h.
  Bound B = (q - 1) * q^((k-1)/2) * sum_x t(x)^2.
Computation: N exactly with BigInt by dynamic programming along the path: state (last coordinate y,
  partial value s mod q); start dp[y][0] = t(y); step dp'[y'][(s + y y') mod q] += t(y') dp[y][s]; N =
  sum_y dp[y][0]. Cost O(k q^3). S_h in floating point as a vector chain: v = t; repeat k - 1 times
  v(y) <- t(y) * sum_x v(x) e_q(h x y); S_h = sum_y v(y). Precompute once per (q, k, weight) and cache.
  Check values: q = 101, k = 4, Legendre: M = 3, N = -1675, qN = -169175, M^4 = 81, R = -169256.
  q = 37, k = 12, Legendre: M = 10, qN = 1007583904577, M^12 = 10^12, B = 5.47e11.
  q = 5, k = 4, t = 1: N = 145, qN = 725, M^4 = 625, R = 100.
Scene: four vertical bars on a signed logarithmic axis (height = sign(v) * log10(1 + |v|)), labeled
  "q N" (gold), "M^k" (blue), "R from h != 0" (red), and "q N - M^k" (red, hatched), with the exact integer
  printed above each bar (scientific notation beyond 12 digits). A muted dashed band at +-B around zero
  on the R bars, labeled "Parseval bound". Below the bars, one line of text: "q N = M^k + R holds: yes"
  computed from the two independent R values (relative difference below 1e-9). A second small panel at
  the right plots |S_h| for h = 1 .. q-1 as dots (red) against the horizontal line q^((k-1)/2) sum t^2
  (muted dashed).
Controls: a segmented choice of prime q in {5, 7, 11, 13, 37, 101}; a slider k from 2 to 12 (integers);
  for q = 101 cap k at 8 and gray out larger values; a toggle for the weight "t = 1" / "Legendre"
  (default Legendre, q = 101, k = 4).
Motion: bars ease to new heights over 300 ms when a control changes; while a slider is dragged, defer the
  recomputation until release if it would exceed 4 ms per frame.
Reader takeaway: the identity always holds, R always sits inside its Parseval bound, the sign of q N flips
  from prime to prime, and for q = 37 with k >= 12 the blue bar M^k leaves the band, which forces q N to
  have the same sign as M^k.
Data: none beyond the formulas above.
```
:::::

## The map of the formal proof {#ra-map}

The formal proof is a chain of named propositions. Many large theorems in the tree take their inputs as explicit hypotheses named after the statements they need, and a separate theorem proves each such statement, so the proof reads as a tree of propositions whose leaves are closed one by one [@alpoge-lean]. Following that tree down from `Main.lean`, every link has been read in at least one of those five regions, and the spine has nine nodes. The table gives each node in one sentence of ordinary mathematics, its Lean declaration, and the chapter that explains it. Declarations in `UpperTheory` live under `Development/AutomorphicArithmetic`, and those in `Formalism.HC` under `Formalism/SharpRestriction/RamificationFrobenius/TotientGaloisClasses`.

| Node | In ordinary mathematics | Lean declaration | Chapter |
| --- | --- | --- | --- |
| 1. Final theorems | The five statements of section [[ra-proved]]. | `riemannHypothesis` and four others, `Main.lean` | this chapter, [[landau-endgame]] |
| 2. Half-plane | No Dirichlet L-function vanishes on $\Re s>\tfrac12$, except the principal character at $s=1$. | `UpperTheory.EveryCharacter`, proved by `UpperTheory.FinalTheorems.everyCharacter` | [[landau-endgame]] |
| 3. Primitive half-plane | The same for every primitive character, from which the imprimitive case follows by the Euler factors. | `Formalism.HC.ZeroFreeAll`, `UpperTheory.Top.imprimitive` | [[landau-endgame]] |
| 4. Endgame | A positive combination of smoothed prime sums bounded above by $C y^\theta$ on windows $[Y,Y^{1+\delta}]$ for arbitrarily large $Y$ forces zero-freeness on $\Re s>\theta$. | `Deduction.zeroFree_of_rpow_window` | [[landau-endgame]] |
| 5. Inequality on windows | For each primitive $\chi$ and small $\varepsilon$, the combination $G_r$ of chapter [[landau-endgame]] satisfies $G_r(x)\le x^{1/2+9\varepsilon}$ on windows $[Y,Y^{3/2}]$. | `Formalism.HC.ChebyshevInequalityOnWindows` | [[landau-endgame]], [[integrality-and-galois]] |
| 6. Automorphic construction | At each scale $x$, a chain of about $x^{1/2-\varepsilon/16}$ theta lifts between totally definite unitary groups, with periods, integrality, and sizes, delivers the data from which node 5 follows. | `UpperTheory.Top.TopG`, from `GlobalTheory.GLq.Green` and the record `GlobalTheory.Fc.HypsAlt`, assembled in `UpperTheory.Lit.every_character_of_theta_integrals_local_matching` | [[definite-forms]], [[multiplicity-from-lifts]], [[integrality-and-galois]] |
| 7. Galois input | Every regular algebraic polarized cuspidal automorphic representation of $\mathrm{GL}_a$ over a CM field has an $\ell$-adic Galois representation with the expected local properties. | `UpperTheory.GalStar.Row0b`, proved from `UpperTheory.TP.TLiftK` and `UpperTheory.Gal.Int.Geo.GeoOne` | [[integrality-and-galois]] |
| 8. Cohomological window | On a window of scales, the locally trivial Galois cohomology groups $\text{Sha}^1$ of an explicit abelian CM field $E$, with coefficients in the Tate twists of $\QQ_\ell/\ZZ_\ell$, over all primes $\ell$ and all twists below $x^{401}$, have $\sum\log\#\text{Sha}^1\le e^{x^\varepsilon/2}$. | `UpperTheory.Top.VWin`, proved by `UpperTheory.One.vwin_of_row` | [[cohomology-window]] |
| 9. Published inputs | Published theorems restated as propositions and proved in the tree, through 185 wrapper theorems. | `UpperTheory.LiteratureTheorems.OpenLiteratureStatements` and its wrappers | [[inputs-and-assembly]] |

The assembly is the first two theorems of a file of fourteen lines, `Development/AutomorphicArithmetic/CharacterBoxes/MainConclusion.lean`; its third theorem gives a second route to the Riemann Hypothesis that `Main.lean` does not use [@alpoge-lean].

```lean
theorem UpperTheory.FinalTheorems.everyCharacter_of_row (h : UpperTheory.GalStar.Row0b fun h rc => UpperTheory.Zero.LLC.IsRecT h rc) : UpperTheory.EveryCharacter :=
  UpperTheory.LiteratureTheorems.every_character_of_literature_of_vWin ⟨h, UpperTheory.Zero.LLC.recTExists, h⟩ (UpperTheory.One.vwin_of_row h)

theorem UpperTheory.FinalTheorems.everyCharacter : UpperTheory.EveryCharacter :=
  UpperTheory.FinalTheorems.everyCharacter_of_row UpperTheory.Gal.Int.galoisLocalGlobalStrong_recParameter
```

Read from the bottom up, the half-plane statement follows from the Galois input `Row0b` alone, once local Langlands for $\mathrm{GL}_n$ (`recTExists`, also proved in the tree) is supplied. `Row0b` enters twice. It fills the literature record that builds the automorphic construction of node 6, and through `vwin_of_row` it proves the cohomological window of node 8. `Row0b` itself is proved as `galoisLocalGlobalStrong_recParameter` from two statements, `TLiftK`, which says that theta lifts exist between totally definite unitary groups in a stable range of ranks, and `GeoOne`, which finds Galois representations in the cohomology of varieties with Hecke correspondences. So the three inputs named in the code are `Row0b`, `TLiftK` with `GeoOne`, and `VWin`, and all three are proved. Our reading of the theta lifts adds a fact that shapes the next chapters. `TLiftK` is used once, to raise an even rank to an odd one on the Galois side, and the $m$-fold chain of the note's step 8 does not go through it but through the chain operators of the automorphic construction (`chainOp`, `ColumnChain`).

The endgame meets these inputs through three statements, which chapter [[landau-endgame]] states as one interface ([[t-le-interface]]). If Green's parametrization of the cuspidal characters of $\mathrm{GL}_d(\FF_g)$ holds, if the window statement `VWinAt ψ 401` holds for every primitive $\psi$, and if a record of type `HypsAlt` with the condition `DefiniteSideCondition` exists, then every primitive L-function is zero-free on $\Re s>\tfrac12$ (`UpperTheory.Top.zero_free_all_of_green_v_win`). The record has about 45 proof fields, and it is where the automorphic construction of node 6 is packed.

The quantities of the construction grow with the scale $x$ like fixed powers. The main rows of the scale dictionary are these, as the code fixes them; chapter [[multiplicity-from-lifts]] holds the full dictionary ([[ml-scales]]), and each later chapter repeats the rows it uses.

| Quantity | Size at scale $x$ | Declaration |
| --- | --- | --- |
| length $m$ of the chain of theta lifts | between $x^{1/2-\varepsilon/16}$ and twice that | `RankVal` |
| order $n$ of the frame group $A$ (`Frame.ord`); the host field $E$ has $\Gal(E/\QQ)\cong\{\pm1\}^2\times A$, so $[E:\QQ]=4n$ | between $x^{2+8\varepsilon}$ and twice that | `RankVal`, `HostRaw.gal` |
| rank $N_0$ of the first space $X_0$ (the code's `R.k`) | between $x^{9/2+10\varepsilon}$ and twice that | `RankVal` |
| rank step $c+1$ (the code's `R.t + 1`), so $X_j$ has rank $N_j=N_0+j(c+1)$ | about $x^{398.5+58\varepsilon}$ (our arithmetic) | `RankVal`, `Ranks.N` |
| level $2^\nu$ of the 2-adic cyclotomic tower | between $x^{2+8\varepsilon}$ and twice that | `PageN` |
| Tate twists covered | from $1$ to $\lfloor x^{401}\rfloor-1$ | `VWin` |
| sum over primes $\ell$ and those twists of $\log\#\text{Sha}^1$ | at most $e^{x^\varepsilon/2}$ | `VAt` |
| bound in the endgame | $G_r(x)\le x^{1/2+9\varepsilon}$ on windows $[Y,Y^{3/2}]$ | `ChebyshevInequalityOnWindows` |
| range of $\varepsilon$ | $0<\varepsilon<\tfrac1{52}$ | `Scale`, `VWinAt` |

The tree has 175,187 Lean files with 17,374,215 lines, about 1.03 GB of text, and 1,061,425 declarations, of which 784,092 are theorems [@alpoge-lean]. Every file is reachable from `Main` through imports, within at most 43 import steps, and the tree contains no comments, no `sorry`, and no axiom (chapter [[inputs-and-assembly]]). Being imported is not the same as being used, though. Tracing the declarations the final theorem actually cites finds statements that are imported and proved but not used, such as a weak form of Vandiver's conjecture over $\QQ$, and statements that are imported and never proved, such as a Behrend-type bound, and the table of section [[ra-steps]] keeps track of that difference.

::::: figure {#f-ra-spine viz="ra-spine" height="560"}
The proof of the five theorems runs through one half-plane statement, an endgame that needs only an upper bound on windows, and three named inputs, all of them proved in the tree.

```vizspec
Purpose: an interactive dependency map of the formal proof's spine, from Main.lean down to its inputs.
Scene: nine nodes as rounded rectangles, top to bottom, with arrows pointing upward from what is used to
  what uses it. Layout at desktop width (three columns where needed):
  row 1: [1] Final theorems
  row 2: [2] Half-plane
  row 3: [3] Primitive half-plane
  row 4: [4] Endgame (left), [5] Inequality on windows (right)
  row 5: [6] Automorphic construction (left), [8] Cohomological window (right)
  row 6: [7] Galois input (center), [9] Published inputs (left)
  Edges (arrow from source to target): 2->1, 3->2, 4->3, 5->3, 6->5, 8->5, 7->6, 9->6, 7->8, and a dashed
  edge 9->7 labeled "local Langlands". Two small leaf boxes under [7]: "TLiftK: theta lifts exist" and
  "GeoOne: Galois representations from geometry", each with an arrow into [7].
  Colors: nodes 1 to 4 violet outline (the analytic end), node 5 gold outline (the inequality on primes),
  nodes 6 and 7 teal outline (automorphic and Galois), node 8 teal outline, node 9 muted outline.
Node data (label | statement | Lean | chapter title and id):
  1 | Final theorems | RH in Mathlib's form; zeros of every Dirichlet L-function in 0 < Re s < 1 lie on
    Re s = 1/2 | riemannHypothesis and four others, Main.lean | this chapter (route-a-plan), The last mile
    (landau-endgame)
  2 | Half-plane | L(s, chi) != 0 for Re s > 1/2, every Dirichlet chi, except principal chi at s = 1 |
    UpperTheory.EveryCharacter | landau-endgame
  3 | Primitive half-plane | the same for primitive chi; imprimitive by Euler factors |
    Formalism.HC.ZeroFreeAll, UpperTheory.Top.imprimitive | landau-endgame
  4 | Endgame | an upper bound C y^theta on windows [Y, Y^(1+delta)] forbids zeros with Re s > theta |
    Deduction.zeroFree_of_rpow_window | landau-endgame
  5 | Inequality on windows | G_r(x) <= x^(1/2 + 9 eps) on windows [Y, Y^(3/2)] |
    Formalism.HC.ChebyshevInequalityOnWindows | landau-endgame, integrality-and-galois
  6 | Automorphic construction | a chain of about sqrt(x) theta lifts between totally definite unitary
    groups | UpperTheory.Top.TopG, GlobalTheory.Fc.HypsAlt, Green | definite-forms,
    multiplicity-from-lifts, integrality-and-galois
  7 | Galois input | Galois representations for polarized cuspidal representations over CM fields |
    UpperTheory.GalStar.Row0b (from TLiftK and GeoOne) | integrality-and-galois
  8 | Cohomological window | sum over primes l and over the Tate twists below x^401 of log #Sha^1 of the
    field E, at most e^(x^eps/2), on a window of scales |
    UpperTheory.Top.VWin | cohomology-window
  9 | Published inputs | published theorems restated as propositions and proved in the tree (185 wrappers) |
    OpenLiteratureStatements | inputs-and-assembly
Controls: tap or hover a node to open a panel under the map with its statement, its Lean name in
  monospace, and its chapter; if the kit supports in-page links, the chapter id links to #id. A button
  "trace to Main" highlights the path from the selected node up to node 1. A toggle "show the interface"
  draws a dashed box around nodes 6 and 8 with the label "what the endgame consumes: Green, VWin, HypsAlt".
Motion: the highlighted path brightens edge by edge from the node upward (60 ms per edge). Reduced motion
  highlights at once.
Reader takeaway: everything flows into one half-plane statement; the endgame is pure analysis; the three
  named inputs Row0b, TLiftK with GeoOne, and VWin are proved, and Row0b feeds both the automorphic
  construction and the window.
Layout: at widths below 600 px use a single column in the order 1, 2, 3, 4, 5, 6, 8, 7, 9.
Data: the node data above.
```
:::::

::::: figure {#f-ra-size viz="ra-tree-size" height="440"}
Four fifths of the files of the formal proof sit in one top-level folder, and every file of every folder is in the import closure of the final theorem.

```vizspec
Purpose: show how the 175,187 files and 17,374,215 lines of the Lean tree are distributed, and that all of
  it is imported by Main.
Scene: a treemap filling the drawing area. Top-level rectangles for the ten top-level folders, area
  proportional to the selected measure. The folder Development is subdivided into its seven children.
  Data (files, lines):
  Development total (141,928; 12,232,663), split into AbelianVarietyTheory (99,187; 8,142,960),
    AutomorphicArithmetic (18,431; 1,776,375), AutomorphicSpectrum (15,147; 1,195,844),
    WeilBound (7,051; 848,547), EtaleCohomology (1,398; 104,525), ResolutionOfSingularities (499;
    140,709), DiscreteGroups (215; 23,703).
  Formalism (18,254; 3,200,748). GroundTheory (8,507; 1,119,138). ReciprocityTheory (3,845; 563,016).
  CompanionTheory (2,027; 194,218). PositivityTheory (449; 55,130). Lemmata (167; 9,232).
  Supplements (3; 22). BuildAid (5; 20). Root files Main.lean and Statements.lean (2; 28).
  The tiny folders (Supplements, BuildAid, root) are drawn as a single labeled strip "Main.lean,
  Statements.lean, kernels" with a leader line, since their area is invisible.
  All rectangles are filled teal at 35% opacity (meaning "reached from Main"); outlines muted. Labels inside
  rectangles when they fit, otherwise on hover.
Controls: a toggle "files / lines". Hover or tap a rectangle to show its name, file count, line count, and
  the share of the whole as a percentage. A small fixed legend line: "175,187 of 175,187 files are in the
  import closure of Main. 0 sorry, 0 axioms."
Motion: rectangles morph over 400 ms when the measure changes.
Reader takeaway: the tree is dominated by Development/AbelianVarietyTheory, and nothing in it is dead code at
  the level of imports.
Data: the numbers above.
```
:::::

## The note's twenty steps against the code {#ra-steps}

The note's timeline was compiled by Claude "after a thorough search", and its author warns in a footnote that where Claude was the expert he is "sort of paraphrasing" a summary, and that "the Lean should suffice to clarify everything" [@alpoge-note]. The table checks the timeline against the code. Its rows follow the logical order of the page's reading of the note, grouped as the toy setting (steps 1, 3, 2), the positivity frame over the integers (4, 6, 5, 7), multiplicity from theta lifts (8, 12, 9, 10, 13, 14, 15, 16, 18), and the arithmetic residue (11, 19, 17, 20). A step is located when a declaration states essentially the step, partly located when the area and tools are there but the step itself is not identified or is used only in part, and not found otherwise. Where our readings of different regions disagreed, the table reconciles them and says so.

Three facts bound everything in the table. The names Stepanov, Guinand, Bost, and Vandiver occur nowhere in the code, neither in declaration names nor in file paths. The code never states that Weil's functional $W$ of [[weil-positivity]] is nonnegative on any test function, and the positivity it uses on the spine is an upper bound on a smoothed sum over primes. And the tree has no comments. So wherever the table connects the note's wording to a declaration, the connection is our reading, made from the shape of the statements, and it is marked as such where it is not a direct match.

| Step | The note's words | Where we found it | Status |
| --- | --- | --- | --- |
| 1 | "Stepanov determinant" | No declaration by name. By content, `ThmP` (the used copy is `Formalism.L2.FormalSeriesBounds.ThmP`), an $\ell$-adic valuation bound for jets of powers of determinants proved with the Cayley identity $\det(\partial)\det^{s+1}=(s+1)\cdots(s+n_0)\det^s$. No declaration computes a determinant whose entries are periods (our reading of the theta-integral assembly). Our reading. | partly located |
| 3 | $qN=M^k+R$, using $x_1x_2+\dots+x_{k-1}x_k$ | The weighted identity and its sign argument are absent (section [[ra-toy-lean]]). Unweighted quadric counts `count_mul_card` and `quadric_count_even` exist. The inventory counted these as partial, and we do not, since the step's content is missing. | not found |
| 2 | $D^p\equiv0$ on a CM curve; $D^a\theta(0)/\Omega^a$ divisible by $p^{a/p+a/p^3+\dots-O(\log a)}$ | The constant $\gamma_\ell=\ell/(\ell^2-1)=\ell^{-1}+\ell^{-3}+\dots$ of `ThmP` is the note's exponent series, and only $\ell^i$-th powers of variables enter, as in characteristic $p$. Iterated derivatives of a CM theta function at 0 are algebraic (`evenTheta_iteratedDeriv_zero_algebraic`). A Chowla and Selberg period appears in the size term `logOm` (our reading of the theta-integral assembly). The code names neither $D$ nor $\Omega$. Our reading. | partly located |
| 4 | $W(\mathbf 1_S)\ge0$ via a determinant, "Stepanov with multiplicity one again; bootstrap" | No Weil functional and no bootstrap on the path from `Main`, where each half-plane comes in one step from its $\varepsilon$ ([[landau-endgame]]). A signed combination of character sums, `Gsig`, sits in a file that the final theorem does not use. | not found |
| 6 | $W(\mathbf 1_{(0,1]}+(\sim X^\eta)\mathbf 1_{(0,1/X]})\ge0$ gives $>1-\eta$ | What plays its role is `zeroFree_of_rpow_window`: an upper bound $Cy^\theta$ on windows gives zero-freeness on $\Re s>\theta$, with $\theta=\tfrac12+9\varepsilon$ in place of $1-\eta$. The inventory's `LandauStep` and `RHofG` match the step's shape but are not used by the final theorem (our reading of the endgame). Our reading. | partly located |
| 5 | switch to $\sum_{n\le X}\Lambda(n)(X/n-1)_+-X\log X+(1+\gamma)X$, with the note's $\gamma$ the page's $\gamma_E$; "Guinand-Weil had the sign"; variance test function | The sum is `Formalism.Gz` and `An.G`, the function $G_0$ of chapter [[landau-endgame]], extended to characters by `An.gChi` and to $G_r$ by `Level.Gm`. Guinand is not named, and the variance trick was not identified. | located (the sum) |
| 7 | determinants of $W(\cdot)$'s containing GGP periods; values 0, 1 for interlacing weights, up to $m$ non-interlacing | `PI.BesselPeriodGGP.InterlacingCondition` and `BesselPeriodGGP` (local nonvanishing of Bessel periods under interlacing, with the roles of the two weight vectors the reverse of the compact branching rule; where it is proved was not found), and `HCParam` with $m$ extra parameters. The determinant appears as a rank condition `RKC` on the map whose entries are periods ([[multiplicity-from-lifts]]). | located (periods), determinant as rank |
| 8 | iterated theta lifts $U(X_0)\to\dots\to U(X_m)$ between totally definite unitary groups, $\pi\mapsto\pi\boxplus\mu_j[t]$, $m$ like $\sqrt X$ | `Spaces.X_def`, `ColumnChain`, `chainOpM`, and `RankVal` with $m$ between $x^{1/2-\varepsilon/16}$ and twice that. The ranks grow by `R.t + 1` per step (chapter [[multiplicity-from-lifts]]'s $c+1$), which we could not reconcile with the note's $\mu_j[t]$. | located |
| 12 | seesaw: the period of the iterated lift is a Bessel period independent of the Hecke characters; Rallis | `GlobalTheory.RowChain.iter_colPer`, `seesaw_fubini_two_lifts_moderate_growth_kernels`, and the Rallis inner product statements. Independence of the Hecke characters was not found as a theorem. | located, except the independence |
| 9 | norms, level, cancellation of order-$m$ terms; Chowla and Selberg, Weyl, Siegel mass | `SiegelMassRatio` (proved), `chowla_selberg_eta`, `PeriodClassSumWeyl`, `logOm` and `MAIN`. No explicit cancellation of order-$m$ terms. | located |
| 10 | sufficient lower bound on divisibility of the $m$-fold lift | `ThmP` is an upper bound on a valuation, a lower bound of the right shape is `determinantPairing_quotient_valuation_lower_bound`, and which of them feeds the per-lift exponents of `LeafDepthGood` was not traced (our reading of the theta lifts and the integrality bookkeeping). | partly located |
| 13 | Bost slope inequality | A slope inequality of Bost's type, `Formalism.DivisorInequality.DivIneqObjU`, is in the tree but not reached from the final theorem. On the spine the degree role is played by the product formula `norm_height_bound` (our reading of the theta lifts and the integrality bookkeeping). Our reading. | partly located |
| 14 | cost of each lift; one would stop at $2/3$; need for "division" | No declaration found. Chapter [[integrality-and-galois]] names an unconfirmed candidate for "division", `LinkN_at` with `divinN_at`, in which no $\tfrac23$ appears. | not found |
| 15 | integral structure glued across Hecke characters, a "gcd" | No declaration found. Chapter [[integrality-and-galois]] conjectures that the "extra averaging" is the average over a subgroup in the proof of `core_gm`. | not found |
| 16 | relative trace formula, sixfold cover of $\mathrm{GL}_5$, Poincaré series, approximate orthogonality | Poincaré series paired with Bessel periods (`inner_poincareSeries_eq_setIntegral_unfolding`, `conjugateRow_pairing_poincareSeries_besselPeriods`). No relative trace formula and no cover of $\mathrm{GL}_5$ by name. | partly located |
| 18 | covolumes, theta series' index, congruences between lifts and forms | The covolume bound `CovolumeBoundOfX` and lattice covolumes `Formalism.F.covol`. The congruences found (`CongFinOdd`) are between forms on the Galois side, and the index of a theta series was not found. | partly located |
| 11 | Iwasawa tower by analogy with the pigeonhole on $\FF_{q^n}/\FF_q$ | The field of `VWin` uses the layer $2^{\nu+2}$ of the 2-adic cyclotomic tower with $2^\nu$ about $x^{2+8\varepsilon}$ (`IsChiField`, `PageN`), and a pigeonhole over scales (`window1`) finds the window ([[cohomology-window]]). Our reading of the analogy. | located |
| 19 | precise choice of the Iwasawa tower "using Behrend" | `Formalism.BehrendSets.BehrendBound` is stated and never proved or used. The Behrend-type set the proof uses is `Formalism.FrobeniusOrbits.hostThickExists`, positions along Frobenius orbits with no short linear relation, reached in the endgame through `supplyChi` (our reading of the theta lifts and the integrality bookkeeping). The tower itself is chosen by congruences and sizes, with no Behrend set ([[cohomology-window]]). That `hostThickExists` is the note's step is our reading. | partly located |
| 17 | classes in $H^1(\mathfrak o_E[\tfrac1\ell],\QQ_\ell/\ZZ_\ell(-e))$ not killed by twisting; a weakening of Vandiver | `VWin` bounds the sum over all primes $\ell$ and all twists below $x^{401}$ of $\log\#\text{Sha}^1$, the locally trivial classes of $E$ with twisted coefficients, by $e^{x^\varepsilon/2}$, and the final theorem uses it ([[cohomology-window]]). A separate statement over $\QQ$, `UpperTheory.V.SmallClassNumbers.bound`, is proved and imported by `Main` but not used by the final theorem (our reading of the theta lifts and the integrality bookkeeping). | located (in `VWin`) |
| 20 | GRH | The five theorems of `Main.lean`. | located |

The count is eight steps located, eight partly located, and four not found. The pattern is informative. The steps about theta lifts, periods, masses, the tower, and the cohomology groups are in the code with recognizable names, while the steps about Weil's functional, determinants, and positivity are not, and we find in their place an upper bound on a smoothed prime sum and a rank condition on a map of periods. The toy identity of step 3 is a finite-field model and is not formalized. Steps 14 and 15, the barrier at $2/3$ and the gluing across characters, are the note's account of the hardest part of the discovery, and we did not find them; chapter [[integrality-and-galois]] names candidates only.

## How to read Part IV {#ra-read}

Part IV has three kinds of sentence about this proof. The first is what the note says, quoted and cited as the note. The second is what the code states, given with its Lean declaration and file and cited as the Lean code; a statement the code proves is proved, and the page does not hedge it. The third is our reading: every link between the first two kinds, every mechanism inferred from the shape of a statement, every special case worked out for the page, and every analogy, and each such passage says so where it starts. In this chapter the comparisons with Stepanov's proof in section [[ra-idea]], the reconstruction of the toy identity in section [[ra-toy]], the identification of the note's $X$ with the scale $x$, and the pairing of the note's steps with declarations in section [[ra-steps]] are our reading.

A region of the code is unfolded when we have opened its definitions down to statements of ordinary mathematics and checked the translation against the text. The endgame of chapter [[landau-endgame]] is unfolded completely and proved on the page. The definitions behind the theta chain, the window, and the Galois input are unfolded far enough to state what they say, and chapters [[definite-forms]] to [[cohomology-window]] explain each mechanism in its smallest case with numbers. Some parts were left as statements, and the chapters name them rather than fill them with a plausible story. Among them are the meaning of most of the roughly 45 fields of the record `HypsAlt` and of `DefiniteSideCondition`, the proof (`TopG`) that the record yields data tied to the chain on windows, how the chain's divisibility and integrality (`ThmP`, `DGam`, `chain_ge`, `PeriodClassSumWeyl`, and the exponents of `LeafDepthGood`) feed the divisibility inequality `DIV` of the record `SizeData₂`, from which chapter [[integrality-and-galois]] follows the count to the bound on $G_r$, the identification of the chain's kernel `ColumnChain.unf` with theta coefficients between lattice classes, the plus-part bounds of the window, `LemmaK`, and the proof of base change. Chapter [[inputs-and-assembly]] tabulates these gaps region by region. Where a chapter relies on one of these, it says in one sentence that the formal proof establishes it in a named declaration and that the page states it without unfolding its proof.

::: symbols
| Symbol | What it is | Kind | Where it lives |
| --- | --- | --- | --- |
| $e_q(a)$ | $e^{2\pi i a/q}$ for $a\in\FF_q$ | additive character | [[ra-toy-sum]] |
| $t$ | weight on $\FF_q$, the note's letter (here the Legendre symbol of $x^3+x+1$) | function $\FF_q\to\RR$ | [[ra-toy-sum]] |
| $Q_k$ | path quadric $x_1x_2+\dots+x_{k-1}x_k$ | quadratic form | [[eq-ra-path-quadric]] |
| $M$ | $\sum_x t(x)$, the zero mode's base | integer | [[eq-ra-toy-M]] |
| $N$ | weighted count of the points of $Q_k=0$ (local to the toy section) | integer | [[eq-ra-toy-N]] |
| $S_h$, $R$ | the $h$-th mode of the footnote's sum, and $\sum_{h\ne0}S_h$ | complex, real | [[eq-ra-toy-identity]] |
| $m$ | length of the chain of theta lifts | integer | [[ra-chain]] |
| $x$, $\varepsilon$ | scale and small exponent of the construction | reals | [[ra-map]] |
:::

::: recap
- The formal proof proves the Riemann Hypothesis in Mathlib's definition and the Generalized Riemann Hypothesis for every Dirichlet L-function, in five theorems of `Main.lean` with no hypotheses ([[t-ra-main]]). Route M of Part III reaches further, to every Hecke L-function.
- The note's idea is Stepanov's: multiplicity against a degree budget. The integers have no derivative, and the note's substitute is a chain of about $\sqrt X$ theta lifts, each mimicking one unit of multiplicity, which the code fixes as $\sqrt{x^{1-\varepsilon/8}}\le m\le2\sqrt{x^{1-\varepsilon/8}}$ in `RankVal` (section [[ra-chain]]).
- The toy identity $qN=M^k+R$ holds for every weight by orthogonality, and Parseval alone bounds $R$ by $(q-1)q^{(k-1)/2}\sum t^2$ ([[t-ra-toy]]). A definite opposite sign would give Weil's bound, but the plain sum has no such sign, and the footnote's cohomological sign is beyond this page (section [[ra-toy-sign]]). The identity is not in the code.
- The spine runs from `Main.lean` through the half-plane statement and a windowed Landau endgame to an inequality on windows, which rests on the automorphic construction and the cohomological window, and through them on `Row0b`, `TLiftK` with `GeoOne`, and `VWin`, all proved (section [[ra-map]]).
- Of the note's twenty steps, eight are located, eight partly located, and four not found. The code never states positivity of Weil's functional and never names Stepanov, Guinand, Bost, or Vandiver (section [[ra-steps]]).
- Chapter [[landau-endgame]] starts at the top of the spine and proves the endgame in full.
:::
