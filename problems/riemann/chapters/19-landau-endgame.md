---
id: landau-endgame
title: "The last mile: a one-sided bound on windows forbids zeros"
part: 4
summary: Follow the formal proof from an upper bound on a smoothed prime sum, known only on sparse windows of scales, to the absence of zeros to the right of one half, and from there to the five theorems of Main.lean.
needs: [what-rh-says, route-a-plan]
---

:::: plain
Every zero of an L-function to the right of the critical line would leave a wave in the primes that grows faster than the square root, and the waves of such zeros always rise above any square-root-sized ceiling somewhere. So it is enough to show that one smoothed count of primes never rises far above its expected value, and it is even enough to show this only on long stretches that recur, with gaps between them. This chapter proves that implication completely, with elementary analysis, and then proves that it gives the Riemann Hypothesis and its version for every Dirichlet L-function.
::::

Everything else in Part IV, the definite unitary groups, the chain of theta lifts, the Galois representations, the bound in Galois cohomology, is spent to produce one inequality: an upper bound $x^{1/2+9\varepsilon}$ on a combination of smoothed prime sums at the scales $x$ of certain windows. Here we take that inequality as given, show how the code turns it into zero-freeness to the right of $\tfrac12$ and then into the five theorems of `Main.lean`, and reconstruct the one new piece of analysis, the windows, as a complete proof. The chapter ends with the inequality stated as the contract the next four chapters must honor.

## The question this chapter answers {#le-question}

Stepanov's proof in chapter [[stepanov]] ended in two moves. The auxiliary function gave a bound on point counts, $\abs{N_n - q^n - 1} \le C q^{n/2}$, and then [[t-ff-rh-from-bound]] turned the bound into the location of the zeros: the generating function $\sum_n (q^n + 1 - N_n)u^n$ converges on a disc whose radius is set by the bound, so no pole can sit inside it. The warning after that lemma made a point that returns here: the poles are weighted by positive multiplicities, so none can hide behind another.

Over the integers the point count becomes a smoothed count of prime powers with its main term removed, combined with the same sums twisted by the powers of one character. The bound becomes an upper bound $x^{1/2+9\varepsilon}$, on one side only. The disc of convergence becomes a half-plane where a Laplace transform is analytic, and the positive multiplicities become positive weights. One feature has no counterpart over a finite field: the bound is known only on windows $[Y, Y^{3/2}]$ of scales, for $Y$ tending to infinity, and not between them. The auxiliary function and its multiplicity, which produce the bound, are chapters [[definite-forms]] to [[cohomology-window]]; this chapter is the analogue of [[st-zeros]].

What the note says is cited as [@alpoge-note]; what the code states is cited as [@alpoge-lean] and quoted only in `lean` blocks, with paths relative to the formalization's `src` folder; what we worked out ourselves is marked "ours" or "our reading" where it starts.

## From one half-plane to five theorems {#le-five}

We begin at the top, because it is short and shows which statement the analysis must deliver.

::: lean {decl="riemannHypothesis" file="Main.lean"}
The five final theorems, and the four propositions of `Statements.lean` that they prove, verbatim.

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
:::

The first two say, once in Mathlib's wording and once spelled out, that every zero of $\zeta$ other than $-2, -4, -6, \dots$ has real part $\tfrac12$ ($s = 1$ is excluded only because Mathlib gives $\zeta$ a value at its pole). The third says $L(s,\chi) \ne 0$ for $\Re s > \tfrac12$, for every Dirichlet character of every modulus except at the pole of a principal character; the fourth and fifth say that zeros in the open strip lie on the critical line, for all $\chi$ and for primitive $\chi$. Here $L(s,\chi)$ is Mathlib's continuation of $\sum \chi(n) n^{-s}$ ([[d-rh-l-function]]).

All five follow from one statement about primitive characters. A primitive character, recall from [[t-rh-l-fe]], is one not induced from a smaller modulus; the trivial character modulo $1$ counts as primitive, and its L-function is $\zeta$.

::: lean {decl="Formalism.HC.ZeroFreeAll" file="Formalism/SharpRestriction/RamificationFrobenius/TotientGaloisClasses/ExplicitFormulaErrorOfHostConditions.lean"}
The zero-free statement for primitive characters; `PChar` packages a primitive character with its conductor.

```lean
def PChar.ZeroFreeAbove (ψ : PChar) (θ : ℝ) : Prop :=
  ∀ s : ℂ, θ < s.re → DirichletCharacter.LFunction ψ.χ s ≠ 0

def ZeroFreeOn (Q : PChar → Prop) : Prop := ∀ ψ : PChar, Q ψ → ψ.ZeroFreeAbove (1 / 2)

def ZeroFreeAll : Prop := ZeroFreeOn fun _ => True
```
:::

::::: card {#t-le-five kind="theorem" title="If no primitive Dirichlet L-function vanishes to the right of one half, then all five theorems of Main.lean hold"}
:::: statement
Assume that $L(s,\chi) \ne 0$ for every primitive Dirichlet character $\chi$ (including the trivial character modulo $1$) and every $s$ with $\Re s > \tfrac12$. Then:

1. for every Dirichlet character $\chi$ modulo any $N \ge 1$ and every $s$ with $\Re s > \tfrac12$, $L(s,\chi) \ne 0$ unless $\chi$ is principal and $s = 1$;
2. every zero $s \ne 1$ of $\zeta$ other than $-2, -4, -6, \dots$ has real part $\tfrac12$ (the point $s = 1$ is excluded only because Mathlib gives $\zeta$ a value there);
3. every zero of every $L(s,\chi)$ with $0 < \Re s < 1$ has real part $\tfrac12$, and in particular so does every such zero for primitive $\chi$.
::::
:::: plain
Once the primitive L-functions are known to have no zero to the right of the critical line, the rest is bookkeeping: imprimitive L-functions differ from primitive ones by factors that never vanish there, and the mirror symmetry $s \leftrightarrow 1 - s$ carries the zero-free half-plane to the left half of the strip.
::::
:::: why
It isolates the one statement that needs new mathematics; the whole of Part IV aims at its hypothesis.
::::
:::: idea
Three classical moves. Euler factors $1 - \chi^*(p)p^{-s}$ have absolute value at least $1 - p^{-\Re s} > 0$. The functional equation of $\zeta$, or of a completed primitive L-function, sends a zero at $s$ to a zero at $1 - s$ (for the conjugate character). The gamma factors that appear in the functional equation never vanish where they are used.
::::
:::: proof
::: steps
1. Imprimitive characters (`UpperTheory.Top.imprimitive`). Let $\chi$ be a character modulo $N$ and $\chi^*$ the primitive character inducing it, of conductor $N^* \mid N$. Mathlib's `LFunction_changeLevel` gives, whenever $\chi^* \ne 1$ or $s \ne 1$,
$$
L(s,\chi) = L(s,\chi^*) \prod_{p \mid N} \bigl(1 - \chi^*(p)\,p^{-s}\bigr).
$$
For $\Re s > 0$ each factor is nonzero, because $\abs{\chi^*(p)p^{-s}} \le p^{-\Re s} < 1$. For $\Re s > \tfrac12$ the first factor is nonzero by hypothesis. If $\chi \ne 1$ then $\chi^* \ne 1$, so the only excluded case is $\chi$ principal and $s = 1$. This is statement 1, which is `LFunction_ne_zero_of_half_lt_re` and the proposition the code calls `UpperTheory.EveryCharacter`.
$$
L(s,\chi) \ne 0 \quad (\Re s > \tfrac12,\ \chi \ne 1 \text{ or } s \ne 1).
$$
2. The zeta function (`Formalism.VW.rh_of_every`, `Formalism.VW.rh_of_right`). Statement 1 with $N = 1$ and $\chi = 1$, together with Mathlib's `LFunction_modOne_eq` ($L(s, 1) = \zeta(s)$ modulo 1), gives $\zeta(s) \ne 0$ for $\Re s > \tfrac12$, $s \ne 1$. Now let $\zeta(s) = 0$ with $\Re s < \tfrac12$ and $s$ not a trivial zero. Then $s \ne 0$, since $\zeta(0) = -\tfrac12$. Mathlib's functional equation `riemannZeta_one_sub`, applied at $1 - s$, reads
$$
\zeta(s) = 2(2\pi)^{-(1-s)}\,\Gamma(1-s)\cos\Bigl(\frac{\pi(1-s)}{2}\Bigr)\zeta(1-s).
$$
The Gamma function has no zeros, and the cosine vanishes only when $1 - s = 2k+1$ for an integer $k$, that is $s = -2k$: $k < 0$ contradicts $\Re s < \tfrac12$, $k = 0$ is $s = 0$, and $k \ge 1$ is a trivial zero. So $\zeta(1-s) = 0$ with $\Re(1-s) > \tfrac12$ and $1 - s \ne 1$, which contradicts the first sentence. With $\Re s = \tfrac12$ remaining, this is statement 2, the theorems `riemannHypothesis` and `riemannZeta_eq_zero_re`.
$$
\zeta(s) = 0,\ s \notin \{-2,-4,\dots\},\ s \ne 1 \implies \Re s = \tfrac12.
$$
3. The strip (`Claim.strip`, `Formalism.VW.critLine`). Let $L(s,\chi) = 0$ with $0 < \Re s < \tfrac12$. By the factorization of step 1 and the nonvanishing of Euler factors for $\Re s > 0$, $L(s,\chi^*) = 0$ (`Claim.prim_zero`). Mathlib writes $L(s,\chi^*) = \Lambda(s,\chi^*)/\Gamma_\chi(s)$ with $\Lambda$ the completed L-function and $\Gamma_\chi(s)$ equal to $\Gamma_\RR(s)$ or $\Gamma_\RR(s+1)$ by parity, where $\Gamma_\RR(s) = \pi^{-s/2}\Gamma(s/2)$; it is nonzero for $\Re s > 0$, so $\Lambda(s,\chi^*) = 0$. The functional equation of the completed L-function of a primitive character (Mathlib's `IsPrimitive.completedLFunction_one_sub`, the statement of [[t-rh-l-fe]]) makes $\Lambda(1-s, \overline{\chi^*})$ a constant multiple of $\Lambda(s,\chi^*)$, hence zero, and dividing by the nonzero gamma factor at $1 - s$ gives $L(1-s, \overline{\chi^*}) = 0$ (`Claim.prim_reflect`). But $\overline{\chi^*}$ is primitive and $\Re(1-s) > \tfrac12$, which contradicts the hypothesis. Zeros with $\tfrac12 < \Re s < 1$ are excluded by step 1. This is `LFunction_eq_zero_re`, and `critLine` runs the same argument without the passage to $\chi^*$ for the primitive version.
$$
L(s,\chi) = 0,\ 0 < \Re s < 1 \implies \Re s = \tfrac12.
$$
:::
::::
:::: lean {decl="UpperTheory.Top.imprimitive" file="Development/AutomorphicArithmetic/CharacterBoxes/Imprimitive.lean"}
Step 1; step 2 is in `Formalism/GammaFactorNonvanishing/RhOfRight.lean` and `CritLine.lean`, step 3 in `Development/AutomorphicArithmetic/CharacterBoxes/ClaimStrip.lean`.

```lean
theorem UpperTheory.Top.imprimitive :
    ZeroFreeAll → ∀ (N : ℕ) [NeZero N] (χ : DirichletCharacter ℂ N) (s : ℂ), 1 / 2 < s.re → (χ ≠ 1 ∨ s ≠ 1) →
      DirichletCharacter.LFunction χ s ≠ 0
```
::::
:::: used
The rest of the chapter proves the hypothesis, `ZeroFreeAll`, from an inequality on windows ([[t-le-contract]]), and [[t-le-interface]] says where that inequality comes from.
::::
:::::

The classical background for steps 2 and 3 is in Titchmarsh [@titchmarsh, ch. 2] and Davenport [@davenport, ch. 9].

## The smoothed sum is pure zero noise {#le-noise}

The object at the center of the endgame is the smoothed sum of chapter [[what-rh-says]] with its main term removed. For real $X \ge 1$,
$$
G_0(X) = S(X) - X\log X + (1+\gamma_E)X,\qquad S(X) = \sum_{n \le X}\Lambda(n)\Bigl(\frac Xn - 1\Bigr).
$$ {#eq-le-g0}
It is a real number for each $X$, continuous in $X$, and it is not a count: it is a count minus its expected size. Subtracting the main term from [[eq-rh-smoothed-formula]] leaves only the zeros, the constant $\log 2\pi$, and a tail that dies like $X^{-2}$:
$$
G_0(X) = \log 2\pi - \sum_\rho \frac{X^\rho}{\rho(\rho-1)} - \sum_{k \ge 1}\frac{X^{-2k}}{2k(2k+1)}.
$$ {#eq-le-g0-formula}
This is the note's step 5 exactly: "definitively switch to" $\sum_{n \le X}\Lambda(n)(X/n-1)_+ - X\log X + (1+\gamma)X$ [@alpoge-note], where the note writes $\gamma$ for Euler's constant, which this page calls $\gamma_E$. The code defines the same function twice, as `Formalism.Gz` and as `An.G`, and proves them equal (`GzEq.lean` in `Development/AutomorphicArithmetic/PrimitiveCosets`).

::: lean {decl="Formalism.Gz" file="Formalism/StatementOC.lean"}
The smoothed sum and the function $G_0$.

```lean
def Sz (x : ℝ) : ℝ := ∑ n ∈ Finset.Icc 1 ⌊x⌋₊, Λ n * (x / n - 1)

def Gz (x : ℝ) : ℝ := Sz x - x * Real.log x + (1 + Real.eulerMascheroniConstant) * x
```
:::

The same construction works for a character. Its main term is different: a nonprincipal $L(s,\chi)$ has no pole at $s = 1$, so the twisted sum has no term $X\log X$, but it does have a linear term, and the code removes it.

::: definition {#d-le-g title="The twisted smoothed sum with its linear term removed"}
For a Dirichlet character $\chi \ne 1$ and real $X \ge 1$,
$$
g_\chi(X) = \sum_{n \le X}\Lambda(n)\chi(n)\Bigl(\frac Xn - 1\Bigr) + X\,\frac{L'}{L}(1,\chi).
$$ {#eq-le-gchi}
It is a complex number in general and real when $\chi$ is real. It is not $\psi(X,\chi)$ of chapter [[what-rh-says]], and its correction term $X\,L'(1,\chi)/L(1,\chi)$ is a constant times $X$, with $L(1,\chi) \ne 0$ by Dirichlet's theorem. For the trivial character modulo $1$ the code uses $G_0$ in its place (`An.gChi`, `Deduction.Gchi`).
:::

::: lean {decl="Formalism.HC.An.gChi" file="Formalism/SharpRestriction/RamificationFrobenius/TotientGaloisClasses/Analytic.lean"}
The code's $g_\chi$; `abelian₂ n` is `ArithmeticFunction.vonMangoldt n`.

```lean
def logDerivativeAtOne {N : ℕ} [NeZero N] (χ : DirichletCharacter ℂ N) : ℂ :=
  deriv (DirichletCharacter.LFunction χ) 1 / DirichletCharacter.LFunction χ 1

def gChi {N : ℕ} [NeZero N] (χ : DirichletCharacter ℂ N) (y : ℝ) : ℂ :=
  if χ = 1 then ((G y : ℝ) : ℂ) else sumLamChi χ y + (y : ℂ) * logDerivativeAtOne χ
```
:::

The next statement and its proof are ours: the code never writes an explicit formula for $g_\chi$, and uses only its transform, in `poleData` below. We include it because it shows that $g_\chi$ is, like $G_0$, nothing but the waves of the zeros.

::::: card {#t-le-twisted kind="proposition" title="For a primitive character, the twisted smoothed sum with its linear term removed is a constant, at most a logarithm, and an absolutely convergent sum over zeros"}
:::: statement
Let $\chi$ be a primitive character modulo $q > 1$ with parity $a \in \{0,1\}$. For $\Re s > 1$,
$$
\int_1^\infty g_\chi(y)\,y^{-s-1}\,\dd y = \frac{-\frac{L'}{L}(s,\chi)}{s(s-1)} + \frac{\frac{L'}{L}(1,\chi)}{s-1},
$$ {#eq-le-gchi-mellin}
and for $X > 1$, with $\rho$ running over the nontrivial zeros of $L(s,\chi)$ with multiplicity,
$$
g_\chi(X) = \begin{cases}
\dfrac{L'}{L}(0,\chi) - \displaystyle\sum_\rho \frac{X^\rho}{\rho(\rho-1)} - \sum_{k \ge 0}\frac{X^{-2k-1}}{(2k+1)(2k+2)} & (a = 1),\\[3ex]
\log X + 1 - C_\chi - \displaystyle\sum_\rho \frac{X^\rho}{\rho(\rho-1)} - \sum_{k \ge 1}\frac{X^{-2k}}{2k(2k+1)} & (a = 0),
\end{cases}
$$ {#eq-le-gchi-formula}
where $C_\chi$ is the constant term of $-\frac{L'}{L}(s,\chi)$ at its simple pole $s = 0$.
::::
:::: plain
Twisting by a character changes only the bookkeeping near $s = 0$ and $s = 1$. After the linear term is removed, what is left is a constant, a slowly growing $\log X$ for even characters, and one wave $X^\rho/(\rho(\rho-1))$ for each zero.
::::
:::: why
The endgame reads $G_0$ and every $g_\chi$ through the poles of their transforms; these are exactly the zeros, with residue $-1/(\rho(\rho-1))$ per zero, once the linear term removes the pole at $s = 1$.
::::
:::: idea
Repeat the proof of [[t-rh-smooth]] with $-\frac{L'}{L}(s,\chi)$ in place of $-\frac{\zeta'}{\zeta}(s)$. The pole at $s = 1$ is now simple and comes only from the kernel $1/(s(s-1))$, with residue $-X\frac{L'}{L}(1,\chi)$, which the correction cancels. At $s = 0$ the kernel's pole meets either a regular value (odd $\chi$) or the trivial zero at $0$ (even $\chi$), which produces $\log X$.
::::
:::: proof {collapsed}
The transform follows from $\int_n^\infty (y/n - 1)y^{-s-1}\,\dd y = n^{-s}/(s(s-1))$, summed against $\Lambda(n)\chi(n)$, whose Dirichlet series is $-\frac{L'}{L}(s,\chi)$ by [[d-rh-l-function]], together with $\int_1^\infty y\cdot y^{-s-1}\,\dd y = 1/(s-1)$. Mellin inversion then writes the twisted sum as $\frac1{2\pi i}\int_{(c)}(-\frac{L'}{L}(s,\chi))X^s\,\dd s/(s(s-1))$ for $c > 1$, an absolutely convergent integral, and we shift the line to the left exactly as in [[t-rh-smooth]], collecting residues.

::: steps
1. At $s = 1$, $L(1,\chi) \ne 0$, so the only pole is the kernel's, with residue $-X\frac{L'}{L}(1,\chi)$. Adding $X\frac{L'}{L}(1,\chi)$ removes it.
2. At a nontrivial zero $\rho$ of multiplicity $m_\rho$, $-\frac{L'}{L}$ has residue $-m_\rho$, so the contribution is $-m_\rho X^\rho/(\rho(\rho-1))$.
3. At $s = 0$ for odd $\chi$, $L(0,\chi) \ne 0$ and the kernel has residue $X^0/(0 - 1) = -1$, so the contribution is $\frac{L'}{L}(0,\chi)$. At the trivial zeros $s = -2k-1$, $k \ge 0$, the residue of $-\frac{L'}{L}$ is $-1$ and the kernel is $X^{-2k-1}/((2k+1)(2k+2))$.
4. For even $\chi$, $L(s,\chi)$ has a simple trivial zero at $0$, so $-\frac{L'}{L}(s,\chi) = -1/s + B_\chi + O(s)$, while $X^s/(s-1) = -1 - s(\log X + 1) + O(s^2)$. The product with $1/s$ has residue $\log X + 1 - B_\chi$. The other trivial zeros $s = -2k$, $k \ge 1$, give $-X^{-2k}/(2k(2k+1))$ as for $\zeta$.
:::

The horizontal and left integrals vanish in the limit by the bounds for $L'/L$ in Davenport [@davenport], as for $\zeta$, and the sum over $\rho$ converges absolutely because the number of zeros up to height $T$ is $O(T\log qT)$.
::::
:::: example
For $\chi_4$, the odd character modulo 4, mpmath gives $L(0,\chi_4) = \tfrac12$, and numerical differentiation gives $\frac{L'}{L}(1,\chi_4) = 0.2456096$ and $\frac{L'}{L}(0,\chi_4) = 0.7831888$. We found the 92 zeros of $L(s,\chi_4)$ with $0 < \gamma < 160$ as sign changes of the completed function on the critical line (the first are $6.020949$, $10.243770$, $12.988098$, matching chapter [[what-rh-says]], and the count matches the formula $\frac{T}{2\pi}\log\frac{4T}{2\pi e} = 92.3$). Summing a sieve of $\Lambda$ up to $2\times10^7$ gives the left column; the right columns use [[eq-le-gchi-formula]] truncated to the first 10 or 92 zero pairs.

| $X$ | $g_{\chi_4}(X)$ from primes | 10 pairs | 92 pairs |
| --- | --- | --- | --- |
| $10$ | $0.790212$ | $0.789319$ | $0.790685$ |
| $10^2$ | $0.047769$ | $0.076091$ | $0.043453$ |
| $10^3$ | $-0.516934$ | $-0.482469$ | $-0.513997$ |
| $10^4$ | $6.995268$ | $6.635104$ | $7.064647$ |
| $10^6$ | $-18.850393$ | $-17.313096$ | $-18.694840$ |

Including the zeros up to height 160 instead of the first ten shrinks the error by a factor between 2 (at $X = 10$, where both errors are below $10^{-3}$) and 12, as a truncated absolutely convergent sum should; what remains is the contribution of the zeros above height 160, which grows with $X$. The same check for $G_0$ with the first 1000 zero pairs of $\zeta$ (from mpmath) gives agreement to $4\times10^{-6}$ at $X = 10$ and $4\times10^{-3}$ at $X = 10^6$, where $G_0(10^6) = 11.040436$.

The even case carries the constant $1 - C_\chi$, which comes from the double pole at $s = 0$, so we tested it on two real even characters. For the quadratic character modulo 5, $C_\chi = -L''(0,\chi)/(2L'(0,\chi)) = 0.0220247$ and $\frac{L'}{L}(1,\chi) = 0.8276795$; with its 98 zeros of height below 160, [[eq-le-gchi-formula]] gives $3.095068$ at $X = 10$ and $7.367647$ at $X = 10^3$, against $3.095318$ and $7.375421$ from the primes. For the character $\chi(n) = (2/n)$ modulo 8, $C_\chi = 0.2964638$, and with 110 zeros the formula gives $3.104367$ and $4.570891$ against $3.104313$ and $4.574974$. A wrong constant, such as $-1 - C_\chi$, would be off by $2$.
::::
:::: used
The transform [[eq-le-gchi-mellin]] is the input to the pole computation of [[t-le-poles]].
::::
:::::

## Which way a zero pushes {#le-sign}

By [[eq-le-g0-formula]] a zero $\rho = \beta + i\gamma$ adds the wave $-X^\rho/(\rho(\rho-1))$, of size $X^\beta/\abs{\rho(\rho-1)}$, to $G_0$. If every $\beta = \tfrac12$ the waves together are at most $c_0\sqrt X$, $c_0 = 0.0461914$ ([[eq-rh-zero-sum-bound]]); a zero with $\beta > \tfrac12$ adds a wave growing like $X^\beta$. Since the proof's bound is an upper bound only, the direction of the wave matters. Take the smallest examples.

A real zero $\beta \in (0,1)$. Then $\rho(\rho-1) = \beta(\beta - 1) < 0$, so the wave is $+X^\beta/(\beta(1-\beta))$, positive at every $X$. A hypothetical real zero at $\beta = 0.8$ adds $6.25\,X^{0.8}$. It pushes $G_0$ up and never down, so any upper bound $G_0(X) \le CX^\alpha$ with $\alpha < 0.8$ fails for large $X$.

A complex pair $\rho = 0.8 \pm 14i$. Together they add $2\Re\bigl(-X^\rho/(\rho(\rho-1))\bigr) = 0.010186\,X^{0.8}\cos(14\log X + \phi)$ for a fixed phase $\phi$. This wave swings both ways, but its crests come once every $2\pi/14 = 0.449$ units of $\log X$, and at a crest it equals $0.010186\,X^{0.8}$. It passes $X^{0.6}$ once $X^{0.2} > 98.2$, that is for $X > 9.1\times10^9$, and from then on every crest breaks the bound. The small amplitude only delays the crossing.

So an upper bound sees every kind of off-line zero: real zeros push up everywhere, and complex zeros push up at their crests. Compare the unsmoothed count: in von Mangoldt's formula $\psi(x) - x = -\sum_\rho x^\rho/\rho + \dots$ a real zero contributes $-x^\beta/\beta < 0$, a push down, which an upper bound on $\psi(x) - x$ cannot see. The kernel $1/(s(s-1))$ of the smoothing is negative on $(0,1)$, and that flips the sign. This is why the endgame works with $G_0$ and not with $\psi$.

::: warning
"One-sided" does not refer to one side of the critical line. It means that $G(X) \le CX^\alpha$ bounds the function from above and says nothing about how negative it becomes; the argument below never uses a lower bound.
:::

:::: figure {#f-le-push viz="zero-push" height="440"}
A hypothetical zero to the right of the critical line adds a wave that eventually rises above any ceiling $CX^\alpha$ with $\alpha$ below its real part, while a real zero rises above it everywhere.

```vizspec
Purpose: show that an upper bound C X^alpha is violated by the wave of any zero with real part beta > alpha,
  and that the true G_0 stays far below it.
Scene: horizontal axis log10 X from 1 to 16. Vertical axis is the value divided by sqrt(X), on a symmetric
  log-like scale (asinh(v/0.05)) labeled at 0, +-0.05, +-0.5, +-5, +-50, +-500.
  Gold curve: (G_0(X) - log(2 pi))/sqrt(X) for X from 10 to 10^6, computed from the kit's sieve with
  G_0(X) = sum_{n<=X} Lambda(n)(X/n - 1) - X log X + (1 + 0.5772156649) X. Beyond 10^6 draw instead a pale gold
  band of half-width c0 = 0.0461914 (the proved size of the zero noise when all zeros are on the line).
  Teal curve: the hypothetical wave divided by sqrt(X): w(X)/sqrt(X) with
  w(X) = -2 Re( X^rho / (rho (rho - 1)) ) for rho = beta + i gamma (gamma > 0), and w(X) = -X^beta/(beta(beta-1))
  when gamma = 0 (a single real zero).
  Red dashed curve: the ceiling C X^alpha / sqrt(X) = C X^(alpha - 1/2).
  Mark with small red dots the crests of the teal curve that lie above the red curve.
Controls: slider beta in [0.5, 0.99] (default 0.8); slider gamma in [0, 40] (default 14; 0 means a real zero);
  slider alpha in [0.5, 0.95] (default 0.6); slider log10 C in [-2, 2] (default 0).
  Readout: "first violation at X = ..." computed as the first crest (or, for gamma = 0, the first X) where
  w(X) > C X^alpha, or "none below 10^16".
Motion: the curves redraw when a slider moves; no animation.
Reader takeaway: when beta > alpha the teal crests always cross the red ceiling, at X > 9.1 * 10^9 for the
  defaults, and the small amplitude of a complex pair only delays the crossing; a real zero (gamma = 0) is
  positive everywhere.
Check: beta 0.8, gamma 14: amplitude 2/|rho(rho-1)| = 0.010186; with C = 1, alpha = 0.6 the crest envelope
  crosses at X = 9.1e9.
```
::::

## Landau's theorem, the classical form {#le-classical}

For a bound that holds at every large $X$, the step from a one-sided bound to a zero-free half-plane is a theorem of Landau from 1905 [@landau1905]. Its content is that positivity forbids cancellation in a transform, so the transform converges until it meets a singularity on the real axis.

::::: card {#t-le-landau-classical kind="theorem" title="A Mellin integral of a nonnegative function is analytic to the right of its abscissa of convergence and singular at that real point" source="landau1905"}
:::: statement
Let $H$ be measurable on $[1,\infty)$, bounded on bounded intervals, and $H(x) \ge 0$ for $x \ge x_0$. Let $\sigma_c$ be the infimum of the real $\sigma$ for which $F(\sigma) = \int_1^\infty H(x)\,x^{-\sigma-1}\,\dd x$ converges (the abscissa of convergence), and suppose $\sigma_c < \infty$. Then $F(s)$ is analytic for $\Re s > \sigma_c$, and if $\sigma_c > -\infty$, $F$ has no analytic continuation to any disc around the real point $\sigma_c$.
::::
:::: plain
If you average a function that is eventually nonnegative against $x^{-s}$, the average converges until the first point on the real axis where the continued function breaks down. No cancellation can carry it past that point.
::::
:::: why
It is the classical engine, formalized as `Formalism.landauEq` (`Formalism/ZetaNonvanishing/LandauEq.lean`) and used in the unwindowed endgame `landau_entire`, off the path from `Main`. The windowed theorem replaces it.
::::
:::: idea
Expand $F$ in a Taylor series at a real point $\sigma_1 > \sigma_c$. Its coefficients are $\int H(x)(\log x)^k x^{-\sigma_1-1}\,\dd x/k!$, which are nonnegative. If $F$ were analytic on a disc around $\sigma_c$, the series would converge at a real point $\sigma_2 < \sigma_c$, and with nonnegative terms one may exchange the sum and the integral, which shows that the integral itself converges at $\sigma_2$, a contradiction.
::::
:::: sketch {source="montgomeryvaughan" loc="ch. 15"}
For $\sigma_2 < \sigma_c < \sigma_1$ with $F$ analytic on a disc around $\sigma_c$ containing $\sigma_2$, the series $F(\sigma_2) = \sum_k \frac{(\sigma_1 - \sigma_2)^k}{k!}\int_1^\infty H(x)(\log x)^k x^{-\sigma_1-1}\,\dd x$ converges, and Tonelli's theorem turns this double sum of nonnegative terms into $\int_1^\infty H(x)x^{-\sigma_2-1}\,\dd x < \infty$ [@montgomeryvaughan, ch. 15].
::::
:::: used
[[t-le-classical-zero-free]] applies it, and [[t-le-windowed]] replaces it with a version that needs positivity only on windows.
::::
:::::

Applied to a smoothed prime sum with an allowance subtracted, it gives the classical consequence. We state it for $G_0$ and for $\psi$ to show the role of the sign; both are classical, and the proof is our arrangement.

::::: card {#t-le-classical-zero-free kind="corollary" title="A one-sided bound on the prime sums at every large $X$ excludes zeros to the right of its exponent" source="montgomeryvaughan"}
:::: statement
Let $0 < \alpha < 1$.

1. If $G_0(X) \le CX^\alpha$ for all $X \ge X_0$, then $\zeta(s) \ne 0$ for $\Re s > \alpha$.
2. If $\psi(x) - x \ge -Cx^\alpha$ for all $x \ge x_0$, then $\zeta(s) \ne 0$ for $\Re s > \alpha$. The same conclusion follows from $\psi(x) - x \le Cx^\alpha$, but only because $\zeta$ has no real zero in $(0,1)$.
::::
:::: plain
A smoothed count that never runs far ahead of its expected value, or an unsmoothed count that never falls far behind it, leaves no room for a zero to the right of the allowance's exponent.
::::
:::: why
This is the unwindowed endgame, which the proof would use if its bound held at every scale ([[le-why-windows]] explains why it does not).
::::
:::: idea
The allowance minus the function is nonnegative. Its transform has a pole at $\alpha$ and one at each zero; at a real zero the residue's sign would drive the transform to $-\infty$, which a nonnegative integrand forbids, and Landau's theorem does the rest.
::::
:::: proof
*Part 1.* Since $G_0$ is bounded on $[1, X_0]$, after enlarging $C$ we may assume $H(x) = Cx^\alpha - G_0(x) \ge 0$ for all $x \ge 1$. By [[t-rh-smooth]]'s transform $\int_1^\infty S(x)x^{-s-1}\,\dd x = -\frac{\zeta'}{\zeta}(s)/(s(s-1))$ and the transform $(s-1)^{-2} - (1+\gamma_E)(s-1)^{-1}$ of the main term, for $\Re s > 1$
$$
F(s) = \int_1^\infty H(x)x^{-s-1}\,\dd x = \frac{C}{s-\alpha} - \Phi_0(s),\qquad \Phi_0(s) = \frac{-\frac{\zeta'}{\zeta}(s)}{s(s-1)} - \frac{1}{(s-1)^2} + \frac{1+\gamma_E}{s-1}.
$$
The Laurent expansions $-\frac{\zeta'}{\zeta}(s) = \frac1{s-1} - \gamma_E + O(s-1)$ and $\frac{1}{s(s-1)} = \frac{1}{s-1} - 1 + O(s-1)$ show that $\Phi_0$ is regular at $s = 1$, so on $\Re s > 0$ its only poles are the zeros $\rho$ of $\zeta$, each with residue $-m_\rho/(\rho(\rho-1))$. On the real half-line $(\alpha, \infty)$, then, $F$ is analytic except at real zeros. If $\beta$ were the largest real zero above $\alpha$, Landau's theorem would make $\beta = \sigma_c$, and as $\sigma \downarrow \beta$, $F(\sigma) \approx -\frac{m_\beta}{\beta(1-\beta)}\cdot\frac{1}{\sigma - \beta} \to -\infty$, impossible for an integral of a nonnegative function. So there is no real zero above $\alpha$, $F$ is analytic on $(\alpha,\infty)$, Landau's theorem gives $\sigma_c \le \alpha$, $F$ is analytic on $\Re s > \alpha$, and so is $\Phi_0$, which leaves no room for a zero there.

*Part 2.* By [[eq-rh-mellin]], $H(x) = \psi(x) - x + Cx^\alpha \ge 0$ has transform $F(s) = \frac{C}{s-\alpha} + \frac1s\bigl(-\frac{\zeta'}{\zeta}(s) - \frac{s}{s-1}\bigr)$, and a real zero $\beta > \alpha$ gives $F(\sigma) \approx -\frac{m_\beta}{\beta(\sigma - \beta)} \to -\infty$, so part 1's argument applies. For the upper bound the residue changes sign, and real zeros must be excluded by the separate fact $\zeta(\sigma) < 0$ on $(0,1)$ ([[s-ze-symmetry]]).
::::
:::: lean {decl="Formalism.zetaLandau" file="Formalism/ZetaNonvanishing/ZetaLandau.lean"}
The single-function form for $G_0$, the proposition `Formalism.ZetaLandau` of `Formalism/StatementU.lean`, proved as `Formalism.zetaLandau`; it accepts a bound on either side ($s_0 = \pm1$), the lower side being usable because $\zeta$ has no real zero in $(0,1)$, as in part 2. The family form is `Formalism.HC.Landau.landau_family` in `.../TotientGaloisClasses/Landau.lean`. Neither is on the path from `Main`.

```lean
def ZetaLandau : Prop :=
  ∀ s₀ : ℝ, (s₀ = 1 ∨ s₀ = -1) → ∀ θ : ℝ, 0 < θ → θ < 1 →
  (∃ C x₀ : ℝ, ∀ x : ℝ, x₀ ≤ x → s₀ * Gz x ≤ C * x ^ θ) →
  ∀ s : ℂ, θ < s.re → riemannZeta s ≠ 0
```
::::
:::: used
The windowed theorem [[t-le-windowed]] has the same conclusion as part 1, from a hypothesis on windows only.
::::
:::::

The allowance $Cx^\alpha$ enters only through the pole $C/(s - \alpha)$ of its transform. That is the whole role of the exponent: a pole at $\alpha$ is harmless, and a pole to its right is not.

## Why windows, and what they cost {#le-why-windows}

The proof does not deliver a bound at every large $x$. It delivers, for each primitive character and each small $\varepsilon$, a bound
$$
G_r(x) \le x^{1/2 + 9\varepsilon}\qquad\text{for every large } x \text{ in a window } [Y, Y^{3/2}],
$$ {#eq-le-window-bound}
for a sequence of $Y$ tending to infinity, and nothing between the windows. ($G_r$ is the combination of [[d-le-gr]]; for now read it as $G_0$.) The reason is upstream. The bound comes from a construction at the scale $x$ whose arithmetic input, the code's `VWin`, bounds certain Galois cohomology groups of abelian number fields cut out of cyclotomic fields only for $x$ in windows $[Y, Y^2]$ found by a pigeonhole over finitely many exceptional twists (chapter [[cohomology-window]]). The code cuts windows $[Z, Z^{3/2}]$ out of those (`winPairs`), hence the exponent $\tfrac32$. Between windows the proof knows nothing about $G_r$.

::: lean {decl="Formalism.HC.HasWindows" file="Formalism/SharpRestriction/RamificationFrobenius/TotientGaloisClasses/Window.lean"}
A set of reals has windows of exponent `la` when it contains $[Y, Y^{\mathtt{la}}]$ for arbitrarily large $Y$; on the spine `la` is $\tfrac32$.

```lean
def HasWindows (S : Set ℝ) (la : ℝ) : Prop :=
  ∀ y : ℝ, ∃ Y : ℝ, y ≤ Y ∧ ∀ x : ℝ, Y ≤ x → x ≤ Y ^ la → x ∈ S
```
:::

Landau's classical argument cannot use such a bound: its transform integrates $Cx^\alpha - G(x)$ over all of $[1,\infty)$, and between windows that difference may be negative.

For a single zero the windows are enough. In $u = \log x$ a window $[Y, Y^{3/2}]$ is $[U, \tfrac32 U]$ with $U = \log Y$, of length $\tfrac12 U$, growing with $Y$. The wave of a pair $\beta \pm i\gamma$, divided by the allowance $e^{\alpha u}$, is $A e^{(\beta - \alpha)u}\cos(\gamma u + \phi)$, with a crest every $2\pi/\gamma$ units of $u$. Once $\tfrac12 U > 2\pi/\gamma$ every window contains a crest, and once $A e^{(\beta-\alpha)U}$ exceeds the rest, that crest breaks the bound inside the window. For $\gamma = 14$ a window starting at $Y = 10^{10}$, of length $11.5$, contains about 25 crests.

With infinitely many zeros the waves might conspire to stay low exactly on the windows. Ruling that out needs a tool that reads $G$ on one window only and still sees the poles of the transform. The code's tool is the sequence of Taylor coefficients of the Laplace transform at a real point.

:::: figure {#f-le-windows viz="log-windows" height="380"}
On the logarithmic scale the windows $[Y, Y^{3/2}]$ grow in length, so once they are long enough every window contains a crest of the wave of any zero to the right of the allowance's exponent.

```vizspec
Purpose: show why bounds on sparse, growing windows suffice to see one off-line zero.
Scene: horizontal axis u = log x from 0 to 80. Vertical axis from -3 to 3.
  Teal curve: the normalized wave v(u) = e^{(beta - alpha)(u - u0)} cos(gamma u), clipped to [-3, 3],
  where u0 is chosen so that the envelope equals 1 at u = 40.
  Red horizontal dashed line at height 1 (the allowance after normalization).
  Shaded muted-blue vertical bands: the windows [U_j, (1 + delta) U_j] for a sparse sequence
  U_j = 5 * 2.2^j (j = 0, 1, 2, ...) intersected with the axis range.
  Inside each window, red dots on every crest of the teal curve that lies above the red line; outside the
  windows the teal curve is drawn at 40% opacity (the proof knows nothing there).
Controls: slider gamma in [1, 40] (default 14); slider beta - alpha in [0.01, 0.4] (default 0.2);
  slider delta in [0.05, 1] (default 0.5, which is the exponent 3/2); slider for the window spacing
  factor in [1.6, 4] (default 2.2).
Motion: none beyond redraw.
Reader takeaway: every window of length delta U eventually contains several crests above the line, however
  sparse the windows are; making delta tiny or gamma small only postpones this.
```
::::

## The windowed one-sided Landau theorem {#le-windowed}

This section is the reconstruction the chapter promised. The code proves it in 28 of the 32 files of the folder `Development/AutomorphicArithmetic/DedekindLFunctions/LandauTheorems`; the other four (`ChCore`, `ChTop`, `ChBalance`, `mertensUpper`) are not part of this argument. We follow the code's argument step by step and name the declaration at each step. Where a step is ours (an explanation, a choice of words, a numerical check), we say so.

The theorem is stated for a finite family of characters with positive weights, because that is how the code uses it.

::: definition {#d-le-family title="A weighted family of characters and its combined sum"}
A weighted family is a finite list of Dirichlet characters $\chi_1, \dots, \chi_n$, each either the trivial character modulo $1$ or nontrivial (of any modulus), with weights $a_1, \dots, a_n > 0$. Write $G_\chi = G_0$ when $\chi$ is trivial modulo 1 and $G_\chi = g_\chi$ otherwise (the code's `Gchi`). The combined sum is the real-valued function
$$
G(y) = \sum_{i=1}^n a_i\,\Re\,G_{\chi_i}(y)\qquad(y \ge 1).
$$ {#eq-le-family}
It is not a count of primes with positive weights in general, since $\Re\chi_i(n)$ can be negative; what is positive is each weight $a_i$ on a whole sum.
:::

::: lean {decl="Deduction.CharFamily" file="Development/AutomorphicArithmetic/DedekindLFunctions/CharFamily.lean"}
The family, its combined sum `Gm`, and the zero-free conclusion.

```lean
structure CharFamily where
  ι : Type
  [fin : Fintype ι]
  N : ι → ℕ
  [nz : ∀ i, NeZero (N i)]
  χ : ∀ i, DirichletCharacter ℂ (N i)
  a : ι → ℝ
  a_pos : ∀ i, 0 < a i
  adm : ∀ i, N i = 1 ∨ χ i ≠ 1

def Gm (F : CharFamily) (y : ℝ) : ℝ := ∑ i, F.a i * (Gchi (F.χ i) y).re

def ZeroFree (F : CharFamily) (θ : ℝ) : Prop :=
  ∀ i, ∀ s : ℂ, θ < s.re → DirichletCharacter.LFunction (F.χ i) s ≠ 0
```
:::

::::: card {#t-le-windowed kind="theorem" title="An upper bound $C\,y^\alpha$ on windows $[Y,Y^{1+\delta}]$ for arbitrarily large $Y$ excludes every zero of the family to the right of $\alpha$"}
:::: statement
Let $G$ be the combined sum of a weighted family $(\chi_i, a_i)$. Let $0 < \alpha < 1$, $\delta > 0$, and $C \in \RR$. Suppose that for every $Y_0$ there is $Y \ge Y_0$ with
$$
G(y) \le C\,y^\alpha\qquad\text{for all } y \in [Y, Y^{1+\delta}].
$$ {#eq-le-windowed-hyp}
Then $L(s,\chi_i) \ne 0$ for every $i$ and every $s$ with $\Re s > \alpha$.
::::
:::: plain
If a positively weighted combination of smoothed prime sums stays below a ceiling $y^\alpha$ on stretches $[Y, Y^{1+\delta}]$ that recur as far out as we like, then none of its L-functions has a zero to the right of $\alpha$. Nothing is assumed between the stretches, or about how negative the combination becomes.
::::
:::: why
This is where the hypothesis is forced. Upstream produces the bound [[eq-le-window-bound]] only on windows, and without a windowed form of Landau's theorem that bound would prove nothing.
::::
:::: idea
Pass to the logarithmic scale and take the Laplace transform $\Phi$. Its Taylor coefficients at a real point $\sigma$ are integrals of $G$ against Gamma kernels $u^k e^{-\sigma u}/k!$, which for a well chosen $k$ put almost all their mass on one window. On the window the one-sided bound controls the coefficients, through the identity $\abs t + t = 2\max(t,0)$, at the rate $(\sigma - \alpha)^{-k}$. A zero to the right of $\alpha$ is a pole of $\Phi$ closer than $\sigma - \alpha$ to some point of the line $\Re s = \sigma$, and a pole at distance $d$ makes the coefficients grow like $d^{-k}$. The two rates are incompatible.
::::
:::: proof
The proof assembles the five lemmas of the subsections below, in the order of the code's `lemmaL` and `landau_window`. Let $\mathsf G(u) = G(e^u)$ and let $\Phi$ be its Laplace transform ([[t-le-poles]]); let $\mathcal Z$ be the set of its poles. Suppose some $L(s_0,\chi_i) = 0$ with $\Re s_0 > \alpha$.

::: steps
1. Mathlib's nonvanishing of Dirichlet L-functions on $\Re s \ge 1$ (`charFamily_LFunction_ne_zero_of_one_le_re`) gives $\Re s_0 < 1$, so $s_0 \in \mathcal Z$ by [[t-le-poles]].
$$
s_0 \in \mathcal Z,\qquad \alpha < \Re s_0 < 1.
$$
2. The hypothesis [[eq-le-windowed-hyp]] gives, through `windowHyp_of_rpow` and `windowHypU_of_windowHyp`, for every $\nu > 0$ arbitrarily large $U = \log Y$ with $\mathsf G(u) \le R(u) = \abs C e^{\alpha u}$ on $[U, (1+\delta)U]$ and $\int_U^{(1+\delta)U} R(u)e^{-\alpha u}\,\dd u = \abs C\delta U \le e^{\nu U}$.
$$
\int_U^{(1+\delta)U} R(u)\,e^{-\alpha u}\,\dd u \le e^{\nu U}.
$$
3. [[t-le-key]] turns this into an upper bound for the coefficients: there are $\sigma > 2$ and $C_2$ such that for every $\nu > 0$ there are arbitrarily large $U$ and $k \ge U$ with, for all real $\gamma$,
$$
\abs{b_k(\sigma + i\gamma)} + b_k(\sigma) \le C_2\,e^{\nu U}(\sigma - \alpha)^{-k}.
$$
4. Every pole has real part below $1 < \sigma$ (`landau_pole_re_le` gives at most $2$ in general), so [[t-le-lower]] applies and turns the pole $s_0$ into a lower bound: there are $\gamma$, $C_3 > 0$, $C_4 \ge 0$, and $0 < d < d' \le \sigma - \alpha$ such that for every $k$,
$$
\abs{b_k(\sigma + i\gamma)} + b_k(\sigma) \ge C_3\,d^{-k} - C_4\,d'^{-k}.
$$
5. Combining steps 3 and 4 and multiplying by $d^k$: $C_3 \le C_4(d/d')^k + C_2 e^{\nu U}(d/(\sigma-\alpha))^k \le (C_4 + C_2)\,e^{\nu k}(d/d')^k$, using $U \le k$ and $d' \le \sigma - \alpha$. Choose $\nu = \tfrac12\log(d'/d) > 0$ in step 3. Then the right side is $(C_4 + C_2)(d/d')^{k/2}$, which tends to $0$ as $U$, and with it $k$, tends to infinity (`landau_growth_contra`, `landau_window_contra`). This contradicts $C_3 > 0$.
$$
C_3 \le (C_4 + C_2)\Bigl(\frac{d}{d'}\Bigr)^{k/2} \to 0.
$$
:::

So no $L(s,\chi_i)$ vanishes for $\Re s > \alpha$. The order of choices matters and is the code's: $\sigma$ and $C_2$ are fixed by step 3 before any zero is considered, $d$ and $d'$ are then fixed by the poles near the line $\Re s = \sigma$, and only then is $\nu$ chosen; step 3 holds for every $\nu$.
::::
:::: lean {decl="Deduction.zeroFree_of_rpow_window" file="Development/AutomorphicArithmetic/DedekindLFunctions/LandauTheorems/ZeroFreeOfRpowWindow.lean"}
The theorem, with `θ` for $\alpha$, proved by `lemmaL` (`lemmaL.lean`) from `landau_window` (`landauWindow.lean`).

```lean
theorem zeroFree_of_rpow_window (F : CharFamily) {θ δ C : ℝ} (hθ : 0 < θ) (hθ1 : θ < 1) (hδ : 0 < δ)
    (h : ∀ Y₀ : ℝ, ∃ Y : ℝ, Y₀ ≤ Y ∧ ∀ y ∈ Set.Icc Y (Y ^ (1 + δ)), Gm F y ≤ C * y ^ θ) :
    ZeroFree F θ :=
  lemmaL F hθ hθ1 hδ (windowHyp_of_rpow F hδ h)
```
::::
:::: used
[[t-le-contract]] applies it with $\delta = \tfrac12$ and $C = 1$ to the cyclic combination $G_r$ of [[d-le-gr]].
::::
:::::

We did not find this windowed form in the standard references: their statements of Landau's theorem, and of its uses for oscillation of error terms, assume a one-sided bound at every large $x$ [@montgomeryvaughan, ch. 15]. The literature on oscillation theorems also has results that locate sign changes in bounded ranges of scales, and we have not compared them with this one. As stated here, with its Taylor-coefficient proof, the windowed form is the code's.

### The Laplace transform and its poles {#le-laplace}

On the logarithmic scale $u = \log y$, put $\mathsf G(u) = G(e^u)$ for $u \ge 0$ (the code's `gm`), and let
$$
\Phi(s) = \int_0^\infty \mathsf G(u)\,e^{-su}\,\dd u = \int_1^\infty G(y)\,y^{-s-1}\,\dd y.
$$ {#eq-le-laplace}
This is the Laplace transform of $\mathsf G$, which is the Mellin transform of chapter [[what-rh-says]] written in $u$; it is the code's `Φ`, and not the function $\Phi(s)$ of chapter [[zeta-continued]]. The code uses only a crude size bound, $\abs{\mathsf G(u)} \le C_0e^{2u}$ for $u \ge 0$ (`Gchi_growth`), so the integral converges absolutely for $\Re s > 2$. Everything about $\Phi$ that the proof uses is packaged in one structure.

::: lean {decl="Deduction.PoleData" file="Development/AutomorphicArithmetic/DedekindLFunctions/LandauZeroFreeCriterion.lean"}
The properties of $\Phi$ used by the argument: measurability, the growth bound, the Laplace formula for $\Re s > 2$, continuation to $\Re s > 0$ off the set `Z`, isolation of `Z`, and a simple pole at each point of `Z`, with a positive real residue at real points.

```lean
structure PoleData (g : ℝ → ℝ) (Φ : ℂ → ℂ) (Z : Set ℂ) : Prop where
  meas : Measurable g
  growth : ∃ C : ℝ, ∀ u : ℝ, 0 ≤ u → |g u| ≤ C * Real.exp (2 * u)
  laplace : ∀ s : ℂ, 2 < s.re → Φ s = ∫ u in Ioi (0 : ℝ), (g u : ℂ) * cexp (-s * u)
  pos : ∀ ρ ∈ Z, 0 < ρ.re
  diff : DifferentiableOn ℂ Φ ({s : ℂ | 0 < s.re} \ Z)
  iso : ∀ z : ℂ, 0 < z.re → ∀ᶠ w in 𝓝[≠] z, w ∉ Z
  pole : ∀ ρ ∈ Z, ∃ c : ℂ, c ≠ 0 ∧ (ρ.im = 0 → 0 < c.re ∧ c.im = 0) ∧
    ∃ h : ℂ → ℂ, AnalyticAt ℂ h ρ ∧ ∀ᶠ s in 𝓝[≠] ρ, Φ s = c / (s - ρ) + h s
```
:::

::::: card {#t-le-poles kind="lemma" title="The transform of a positively weighted family is analytic on $\Re s>0$ except for simple poles at the zeros, with a positive residue at every real zero"}
:::: statement
For a weighted family, $\Phi$ continues analytically to $\{\Re s > 0\}$ minus the set
$$
\mathcal Z = \{\rho : \Re\rho > 0,\ L(\rho,\chi_i) = 0 \text{ or } L(\bar\rho,\chi_i) = 0 \text{ for some } i\},
$$
which has no accumulation point in $\Re s > 0$. At each $\rho \in \mathcal Z$ it has a simple pole with residue
$$
c_\rho = -\frac{w_\rho}{\rho(\rho-1)},\qquad w_\rho = \sum_{i=1}^n \frac{a_i}{2}\Bigl(\operatorname{ord}_{s=\rho}L(s,\chi_i) + \operatorname{ord}_{s=\rho}L(s,\overline{\chi_i})\Bigr) > 0.
$$ {#eq-le-residue}
In particular $c_\rho \ne 0$, and $c_\rho > 0$ when $\rho$ is real.
::::
:::: plain
The transform has a pole at every zero of every L-function in the family and nowhere else to the right of the imaginary axis, with strength the total weighted multiplicity, positive because every weight is.
::::
:::: why
Poles are what the coefficients detect, and the sign at a real pole is what makes a one-sided bound enough; with mixed weights, zeros could cancel or a real pole could carry a negative residue.
::::
:::: idea
Take the real part of $g_\chi$ as $\tfrac12(g_\chi + g_{\bar\chi})$, which holds because $\overline{g_\chi(y)} = g_{\bar\chi}(y)$. Each piece has the transform [[eq-le-gchi-mellin]] (or $\Phi_0$ for $\zeta$), whose only poles in $\Re s > 0$ are the zeros, with residue $-\operatorname{ord}/(\rho(\rho-1))$, because the main term cancels the pole at $s = 1$. Add with the weights $a_i/2$.
::::
:::: proof
For each $\chi$ of the family the code builds the continuation in `poleData_char` from an abstract lemma, `poleData_abstract`, applied to $P(s) = (s-1)\zeta(s)$ for the trivial character and to $P(s) = L(s,\chi)$ otherwise: the function $-\bigl(P'(s)/P(s) - s P'(1)/P(1)\bigr)/(s(s-1))$, plus the term $1/s$ for $\zeta$ only, which matches its main term, is analytic wherever $s \ne 0$ and $P(s) \ne 0$, including $s = 1$, and has a simple pole of residue $-m_\rho/(\rho(\rho-1))$ at a zero of order $m_\rho \ge 1$ (`logDeriv_local` gives the local form of $P'/P$). For $\zeta$ the value $P'(1) = \gamma_E$ comes from Mathlib's `tendsto_riemannZeta_sub_one_div`, which is how $(1+\gamma_E)X$ enters. The identity $\overline{g_\chi(y)} = g_{\bar\chi}(y)$ is `Gchi_conj`, and $\overline{L(\bar s,\chi)} = L(s,\bar\chi)$ is in `LFunctionConj.lean`. Then `poleData` defines $\Phi = \sum_i \frac{a_i}{2}(\Phi_{\chi_i} + \Phi_{\bar\chi_i})$, so the residues add to [[eq-le-residue]], and positivity of $w_\rho$ is the single inequality $0 < \frac{a_{i_0}}{2}(\operatorname{ord} + \operatorname{ord})$ for an index $i_0$ at which $\rho$ is a zero, plus nonnegativity of the other terms. For real $\rho \in (0,1)$, $\rho(\rho-1) < 0$, so $c_\rho = w_\rho/(\rho(1-\rho)) > 0$. We read the statements of these declarations and the assembly in `poleData` (`poleData.lean`, 404 lines); the residue computation is classical and is the one in the proof of [[t-le-twisted]].
::::
:::: lean {decl="Deduction.poleData" file="Development/AutomorphicArithmetic/DedekindLFunctions/LandauTheorems/poleData.lean"}
`theorem poleData (F : CharFamily) : ∃ Φ : ℂ → ℂ, PoleData (gm F) Φ (zeroSet F)`, where `gm F u = Gm F (Real.exp u)` and `zeroSet F` is the set $\mathcal Z$.
::::
:::: used
The residue enters the lower bound [[t-le-lower]]; its positivity at real points is used in case (a) there.
::::
:::::

Now the coefficients. For a point $z$ with $\Re z > 2$ define
$$
b_k(z) = \frac{(-1)^k\,\Phi^{(k)}(z)}{k!},\qquad\text{so that}\qquad \Phi(z - w) = \sum_{k \ge 0} b_k(z)\,w^k
$$ {#eq-le-bk}
near $w = 0$: they are the Taylor coefficients of $\Phi$ expanded leftward from $z$, toward the poles. Differentiating under the integral (`iteratedDeriv_laplace`, legitimate because of the growth bound) gives the formula the argument runs on, `landau_coeff`:
$$
b_k(z) = \int_0^\infty \mathsf G(u)\,\frac{u^k e^{-zu}}{k!}\,\dd u\qquad(\Re z > 2).
$$ {#eq-le-coeff}
Write $z = \sigma + i\gamma$. The kernel is $K_k(u)e^{-i\gamma u}$ with
$$
K_k(u) = \frac{u^k\,e^{-\sigma u}}{k!} \ge 0.
$$ {#eq-le-kernel}

### The kernel is a window {#le-kernel}

The kernel $K_k$ is, up to the factor $\sigma^{k+1}$, the Gamma probability density with shape $k+1$ and rate $\sigma$: its total mass is $\int_0^\infty K_k = \sigma^{-(k+1)}$ (`kernel_integral`), its mean is $(k+1)/\sigma$, and its standard deviation is $\sqrt{k+1}/\sigma$. So when $k$ is large it lives on a stretch of relative width about $1/\sqrt k$ around $u = k/\sigma$. Choosing $k$ proportional to $\sigma U$ puts it on the window $[U, (1+\delta)U]$. This is the mechanism that lets the argument read $\mathsf G$ on one window only.

Two estimates make this precise, and both are in the code.

*On the window, the kernel is at most a pure exponential.* For every $a > 0$ and $u \ge 0$,
$$
\frac{u^k e^{-au}}{k!} \le a^{-k},
$$ {#eq-le-kernel-max}
because $(au)^k/k! \le e^{au}$ (one term of the exponential series). This is `landau_kernel_max`. With $a = \sigma - \alpha$ it gives $K_k(u) \le (\sigma - \alpha)^{-k}e^{-\alpha u}$, so the kernel, against the allowance $e^{\alpha u}$, costs at most $(\sigma - \alpha)^{-k}$ per unit length.

*Off the window, the kernel is exponentially smaller.* The tail lemma `landau_tails` says: for every $\delta > 0$ there are $\sigma > 2$ and $C_1$ such that for every $U \ge 1$ there is an integer $k \ge U$ with
$$
\int_{(0,\infty)\setminus[U,(1+\delta)U]} \frac{u^k e^{-(\sigma-2)u}}{k!}\,\dd u \le C_1\,\sigma^{-k}.
$$ {#eq-le-tails}
The exponent $\sigma - 2$ instead of $\sigma$ absorbs the crude growth $e^{2u}$ of $\mathsf G$. The code's choices are $\lambda = 2 + 6/\delta$, $\kappa  = \lambda(1+\delta)$ (the code's `M`), $\sigma = \kappa (2 + \lambda)$, and $k = \lceil (1 + \delta/2)\sigma U\rceil$, which puts the kernel's mean at about $(1 + \delta/2)U$, the midpoint of the window.

::: proof {title="Proof of the tail bound, following landau_tails"}
Write $\sigma' = \sigma - 2$ and $V = (1+\delta)U$. For $u$ outside $[U,V]$ one of the exponents $\lambda(u - V)$, $\lambda(U - u)$ is nonnegative, so $1 \le e^{\lambda(u - V)} + e^{\lambda(U - u)}$ (`landau_tails_chernoff`; this is a Chernoff bound [@chernoff1952]). Multiplying the kernel by this and integrating exactly with `kernel_integral`,
$$
\text{tail} \le e^{-\lambda V}(\sigma' - \lambda)^{-(k+1)} + e^{\lambda U}(\sigma' + \lambda)^{-(k+1)}.
$$
To compare each term with $\sigma^{-k}$ the code uses $(\sigma/a)^k \le e^{k(\sigma - a)/a}$ for $a > 0$ (from $1 + t \le e^t$) in `landau_tails_pow`. The arithmetic, which we checked by hand, rests on two identities that follow from the choices: $(1 + \delta/2)(2 + \lambda) = \kappa  - 1$ and $(1 + \delta/2)(\lambda - 2) = \lambda + 1$. For the first term, $\sigma - (\sigma' - \lambda) = 2 + \lambda$ and $\sigma' - \lambda = (\kappa -1)(2+\lambda)$, so it is at most $\exp\bigl(-\lambda V + k/(\kappa -1)\bigr)\,\sigma^{-k}/(\sigma'-\lambda)$; since $k \le (1+\delta/2)\sigma U + 1 = \kappa (\kappa -1)U + 1$ and $\lambda V = MU$, the exponent is at most $1/(\kappa -1) \le 1$. For the second term, the exponent is $\lambda U - k(\lambda - 2)/(\sigma' + \lambda)$, which is at most $0$ because $k(\lambda - 2) \ge (\lambda + 1)\sigma U \ge \lambda(\sigma' + \lambda)U$, the last step being $\lambda^2 - 2\lambda \le \sigma$. Hence $C_1 = e/(\sigma - 2 - \lambda) + 1/(\sigma - 2 + \lambda)$ works, and $k \ge (1 + \delta/2)\sigma U \ge U$.
:::

::: example
On the spine $\delta = \tfrac12$, so $\lambda = 14$, $\kappa  = 21$, $\sigma = 336$, $k = \lceil 420\,U\rceil$, and $C_1 = 0.011368$. With mpmath's incomplete Gamma function: at $U = 1$, $k = 420$, the kernel $u^k e^{-334u}/k!$ has mean $1.2605$, standard deviation $0.061$, and a fraction $1.1\times10^{-4}$ of its mass outside $[1, 1.5]$; the tail integral is $3.6\times10^{-1067}$, below $C_1\sigma^{-k} = 9.8\times10^{-1064}$ and far below the window rate $(\sigma - 0.6)^{-k} = 1.8\times10^{-1061}$. At $U = 10$ the fraction outside is $3.0\times10^{-32}$. The large $\sigma$ is what narrows the kernel: at $U = 10$ with $k = \lceil 1.25\sigma U\rceil$, the fraction outside $[10, 15]$ is $0.28$ for $\sigma = 2.5$, $0.027$ for $\sigma = 10$, and $1.5\times10^{-6}$ for $\sigma = 50$.
:::

::: aside
Our reading: $\sigma^{k+1}b_k(\sigma)$ is the Gamma-kernel average of $\mathsf G$ around $u = k/\sigma$, and its limit as $k, \sigma \to \infty$ with $k/\sigma = u$ fixed is $\mathsf G(u)$, the Post and Widder inversion formula for the Laplace transform [@post1930] [@widder1941]. The code never takes the limit and uses only the concentration estimates above. The reading explains the choice of instrument: Taylor coefficients at a real point can be localized on the $u$-axis, and they are also what a pole controls.
:::

:::: figure {#f-le-kernel viz="gamma-kernel" height="400"}
The kernel $u^k e^{-\sigma u}/k!$ concentrates on the window $[U, (1+\delta)U]$ when $k$ is chosen proportional to $\sigma U$, so the $k$-th Taylor coefficient reads the sum on one window only.

```vizspec
Purpose: show the Gamma kernel's concentration on a window and the mass outside it.
Scene: horizontal axis u from 0 to 2.2 U_max (U_max = 20). Vertical axis: the normalized kernel
  sigma^(k+1) u^k e^(-sigma u) / k! (a probability density; compute in logs with lgamma to avoid overflow),
  drawn as a blue filled curve. The window [U, (1 + delta) U] shaded in pale teal with its endpoints labeled
  U and (1+delta)U. The part of the curve outside the window filled in red.
  A readout in the corner: "mass outside the window = ..." in scientific notation (regularized incomplete
  Gamma: P(k+1, sigma U) + 1 - P(k+1, sigma (1+delta) U); use a continued fraction or series in log space),
  and "mean = (k+1)/sigma, sd = sqrt(k+1)/sigma".
Controls: slider U in [1, 20] (default 8); slider delta in [0.1, 1] (default 0.5); slider sigma on a log scale
  in [2.5, 400] (default 10); slider k in [1, 5000] (default 100); a toggle "lock k to the code's choice"
  (default on) that sets k = ceil((1 + delta/2) sigma U) and disables the k slider.
Motion: the curve morphs smoothly (0.3 s ease) when a slider moves.
Reader takeaway: with k locked, raising sigma narrows the kernel around the window's midpoint and drives the
  outside mass to zero; with k free, the kernel slides along the axis, so k chooses where on the u-axis the
  coefficient reads the function.
Check values: sigma 2.5, U 10, delta 0.5, locked k = 32: outside 0.28. sigma 10: k = 125, outside 0.027.
  sigma 50: k = 625, outside 1.5e-6.
```
::::

### The one-sided inequality {#le-one-sided}

Here the one-sidedness enters, through one line of algebra. For real $t$, $\abs t + t = 2\max(t, 0)$.

::::: card {#t-le-key kind="lemma" title="On a window where the sum is below its ceiling, the absolute value of a Taylor coefficient off the axis plus the real coefficient on the axis is at most the ceiling's cost"}
:::: statement
Suppose $\abs{\mathsf G(u)} \le C_0e^{2u}$ for $u \ge 0$, let $\sigma$, $C_1$ be as in [[eq-le-tails]], and let $0 < \alpha < 1$. If $\mathsf G \le R$ on $[U, (1+\delta)U]$ with $R \ge 0$ there, then for the $k \ge U$ of [[eq-le-tails]] and every real $\gamma$,
$$
\abs{b_k(\sigma + i\gamma)} + b_k(\sigma) \le \frac{2}{(\sigma-\alpha)^k}\int_U^{(1+\delta)U} R(u)\,e^{-\alpha u}\,\dd u + \frac{2C_0C_1}{\sigma^k}.
$$ {#eq-le-key}
::::
:::: plain
The size of a coefficient at any height plus the real coefficient on the axis sees only where the function is positive. On the window that part is below the ceiling, and off the window the kernel is negligible.
::::
:::: why
It is the only use of the hypothesis, and the windowed replacement for the nonnegativity of $Cx^\alpha - G(x)$ in Landau's proof.
::::
:::: idea
Since $\mathsf G$ and $K_k$ are real, $b_k(\sigma) = \int\mathsf G K_k$, and $\abs{b_k(\sigma + i\gamma)} \le \int\abs{\mathsf G}K_k$ because $\abs{e^{-i\gamma u}} = 1$. Adding, the integrand becomes $(\abs{\mathsf G} + \mathsf G)K_k = 2\max(\mathsf G, 0)K_k$.
::::
:::: proof
By [[eq-le-coeff]] and the two remarks of the idea,
$$
\abs{b_k(\sigma + i\gamma)} + b_k(\sigma) \le \int_0^\infty \bigl(\abs{\mathsf G(u)} + \mathsf G(u)\bigr)K_k(u)\,\dd u.
$$
Split the integral at the window. On $[U,(1+\delta)U]$, $\abs{\mathsf G} + \mathsf G = 2\max(\mathsf G,0) \le 2R$ because $\mathsf G \le R$ and $R \ge 0$, and $K_k(u) \le (\sigma - \alpha)^{-k}e^{-\alpha u}$ by [[eq-le-kernel-max]] with $a = \sigma - \alpha$; this gives the first term. Off the window, $\abs{\mathsf G} + \mathsf G \le 2\abs{\mathsf G} \le 2C_0e^{2u}$ and $e^{2u}K_k(u) = u^ke^{-(\sigma-2)u}/k!$, whose integral there is at most $C_1\sigma^{-k}$ by [[eq-le-tails]]; this gives the second term. The code's statement, `landau_window_ineq`, is this inequality before the tail bound is inserted, and `landau_window_key` combines it with `landau_tails` and the window hypothesis.
::::
:::: lean {decl="Deduction.landau_window_key" file="Development/AutomorphicArithmetic/DedekindLFunctions/LandauTheorems/landauWindow.lean"}
The combined upper bound, with `θ` for $\alpha$ and `η` for our $\nu$.

```lean
theorem landau_window_key {g : ℝ → ℝ} {Φ : ℂ → ℂ} {Z : Set ℂ} (hP : PoleData g Φ Z) {θ δ : ℝ}
    (hθ : 0 < θ) (hθ1 : θ < 1) (hδ : 0 < δ) (hW : WindowHypU g θ δ) :
    ∃ σ : ℝ, 2 < σ ∧ ∃ C : ℝ, ∀ η : ℝ, 0 < η → ∀ U₀ : ℝ, ∃ U : ℝ, U₀ ≤ U ∧ ∃ k : ℕ, U ≤ k ∧ ∀ γ : ℝ,
      ‖(-1) ^ k * iteratedDeriv k Φ ((σ : ℂ) + γ * I) / (k.factorial : ℂ)‖ +
        ((-1) ^ k * iteratedDeriv k Φ (σ : ℂ) / (k.factorial : ℂ)).re ≤
        C * Real.exp (η * U) / (σ - θ) ^ k
```
::::
:::: used
Step 3 of the proof of [[t-le-windowed]], with $R(u) = \abs C e^{\alpha u}$, so that the window integral is $\abs C\delta U \le e^{\nu U}$ for large $U$, and $\sigma^{-k} \le e^{\nu U}(\sigma - \alpha)^{-k}$; together the constant is $C_2 = 2 + 2C_0C_1$ in the code's normalization.
::::
:::::

### What a pole does to the coefficients {#le-poles}

The other side of the comparison is complex analysis. If $\Phi$ has a simple pole $c/(s - \rho)$ near $z$ and is otherwise analytic on a disc around $z$, then the pole term contributes $c\,(z - \rho)^{-k-1}$ to $b_k(z)$, exactly, since $(-1)^k\frac{\dd^k}{\dd s^k}(s - \rho)^{-1}/k! = (s-\rho)^{-k-1}$, and the analytic remainder contributes at most $B\,d'^{-k}$ for any $d'$ smaller than a radius on which it is analytic, by the Cauchy estimates [@ss-complex]. This is `landau_pole_asym` and `landau_cauchy`. So the nearest pole sets the growth rate of the coefficients: distance $d$ means growth $d^{-k}$.

The difficulty is the word "nearest": if the pole nearest to the real point $\sigma$ is complex, $b_k(\sigma)$ collects rotating phases from a conjugate pair and can be small. The code handles this with a dichotomy.

::::: card {#t-le-lower kind="lemma" title="A pole of the transform to the right of $\alpha$ forces the off-axis plus on-axis coefficient to grow faster than $(\sigma-\alpha)^{-k}$"}
:::: statement
Let $\Phi$ satisfy the properties of [[t-le-poles]], let $\sigma > 2$ exceed the real part of every pole, and suppose some $\rho_0 \in \mathcal Z$ has $\Re\rho_0 > \alpha$. Then there are a real $\gamma$, constants $C_3 > 0$ and $C_4 \ge 0$, and radii $0 < d < d' \le \sigma - \alpha$ such that for every $k \ge 0$
$$
\abs{b_k(\sigma + i\gamma)} + b_k(\sigma) \ge C_3\,d^{-k} - C_4\,d'^{-k}.
$$ {#eq-le-lower}
::::
:::: plain
A zero to the right of $\alpha$ is a pole of the transform closer than $\sigma - \alpha$ to some point of the line $\Re s = \sigma$. At that point the coefficients grow at the rate set by the pole, and the coefficient on the real axis cannot cancel this growth.
::::
:::: why
It is the lower bound that the window bound [[t-le-key]] contradicts. It uses the residue's sign exactly once, for a real pole.
::::
:::: idea
Look at the poles in the closed disc of radius $\sigma - \alpha$ about $\sigma$; there are finitely many (`landau_finite`). Either the pole nearest to $\sigma$ is real and nothing else is as close, and then $b_k(\sigma)$ itself grows with the positive residue; or some pole is horizontally closer to the line $\Re s = \sigma$ than any pole is to $\sigma$, and then a point $\sigma + i\gamma$ at its height has it as unique nearest pole, while $b_k(\sigma)$ stays small because $\sigma$ is farther from every pole.
::::
:::: proof
`landau_dichotomy` splits into two cases.

*(a) The nearest pole is real.* Every pole $\rho$ satisfies $\sigma - \Re\rho \ge D$, where $D$ is the distance from $\sigma$ to the nearest pole $\rho_s$. Then $D = \abs{\sigma - \rho_s} \ge \sigma - \Re\rho_s \ge D$, so $\rho_s = \beta$ is real (`eq_ofReal_sub_of_dist_le_of_le_sub_re`), and $D = \sigma - \beta < \sigma - \alpha$ because $\rho_0$ has $\sigma - \Re\rho_0 < \sigma - \alpha$. By finiteness there is $r > \sigma - \beta$ with no other pole within $r$ of $\sigma$. Take $\gamma = 0$, $d = \sigma - \beta$, and $d' \in (d, \min(r, \sigma-\alpha))$. By the pole expansion, $\abs{b_k(\sigma) - c_\beta(\sigma - \beta)^{-k-1}} \le C_4\,d'^{-k}$, and $c_\beta$ is real and positive by [[t-le-poles]]. So, using only $\abs{b_k(\sigma)} \ge 0$ (as the code does), $\abs{b_k(\sigma)} + b_k(\sigma) \ge c_\beta d^{-k-1} - C_4\,d'^{-k}$, and we take $C_3 = c_\beta/d$.

*(b) Some pole is horizontally closer.* Otherwise there are $D \le \sigma - \alpha$ with no pole within $D$ of $\sigma$ and a pole $\rho_1$ with $\sigma - \Re\rho_1 < D$. `landau_nearest` picks $\gamma$ close to $\Im\rho_1$ and outside the finitely many heights at which two poles of the relevant disc are equidistant from $\sigma + i\gamma$ (`landau_nearest_equi`). Then $z = \sigma + i\gamma$ has a unique nearest pole $\rho$, at distance $d = \abs{z - \rho} < D$, and no other pole within some $r \in (d, D]$. With $d' = (d + r)/2$, the pole expansion gives $\abs{b_k(z)} \ge \abs{c_\rho}\,d^{-k-1} - C_4\,d'^{-k}$, and since $\Phi$ is analytic on the disc of radius $D > d'$ about $\sigma$, the Cauchy estimate gives $\abs{b_k(\sigma)} \le C_4'\,d'^{-k}$. So $\abs{b_k(z)} + b_k(\sigma) \ge \abs{c_\rho}d^{-k-1} - (C_4 + C_4')d'^{-k}$, and we take $C_3 = \abs{c_\rho}/d$, which is positive because $c_\rho \ne 0$.

In both cases $d < d' \le \sigma - \alpha$.
::::
:::: lean {decl="Deduction.landau_window" file="Development/AutomorphicArithmetic/DedekindLFunctions/LandauTheorems/landauWindow.lean"}
The windowed theorem for an abstract transform, which contains both cases of this lemma and the final comparison.

```lean
theorem landau_window {g : ℝ → ℝ} {Φ : ℂ → ℂ} {Z : Set ℂ} (hP : PoleData g Φ Z) {θ δ : ℝ}
    (hθ : 0 < θ) (hθ1 : θ < 1) (hδ : 0 < δ) (hW : WindowHypU g θ δ) : ∀ ρ ∈ Z, ρ.re ≤ θ
```
::::
:::: used
Step 4 of the proof of [[t-le-windowed]].
::::
:::::

::: warning
The sign of the residue is used only in case (a), and there it is essential. If a real pole had a negative residue, then $b_k(\sigma) \approx -\abs{c_\beta}d^{-k-1}$ would be negative, and since $b_k(\sigma)$ is real, $\abs{b_k(\sigma)} + b_k(\sigma) = 0$: the functional would see nothing. This is the same fact as in [[le-sign]], that an upper bound sees a real zero because a real zero pushes $G_0$ up, now in the language of transforms. The explanation of why the code splits into two cases, and the description of case (b) as the case where the real point is "farther from every pole", are ours.
:::

:::: figure {#f-le-poles viz="nearest-pole" height="460"}
The $k$-th Taylor coefficient at a point grows at the rate set by the nearest pole, so a pole closer than $\sigma - \alpha$ eventually beats any bound of size $(\sigma - \alpha)^{-k}$.

```vizspec
Purpose: show that the Taylor coefficients at z = sigma + i gamma are dominated by the nearest pole.
Scene: left panel, the complex plane with Re s in [-0.5, 3] and Im s in [0, 40]. The critical line Re s = 1/2
  in violet. Teal dots at the first zeros of zeta 1/2 + i gamma_n (gamma_n from the kit, n <= 8). One red
  draggable dot rho* = beta + i gamma* (default 0.8 + 14i). The point z = sigma + i gamma_z as a white ring on
  the vertical line Re s = sigma (default sigma = 2.5, gamma_z = 14), and a dashed blue vertical line at
  Re s = alpha (default 0.6). Draw circles centered at z through rho* (red) and through the nearest teal zero
  (teal), and a blue circle of radius sigma - alpha.
  Right panel: horizontal axis k from 0 to 200; vertical axis log10 of
  (sigma - alpha)^k * |term|, for
    teal: the zeta zeros' total |sum_n c_n (z - rho_n)^(-k-1) + conj terms| with c_n = -1/(rho_n (rho_n - 1)),
      rho_n = 1/2 +- i gamma_n over the kit's 200 zeros, plus log(2 pi) z^(-k-1);
    red: |c* (z - rho*)^(-k-1) + conj(c*) (z - conj(rho*))^(-k-1)| with c* = -1/(rho* (rho* - 1));
    gold: the sum of both, which is b_k(z) for G_0 plus the hypothetical wave.
  A horizontal blue line at 0 marks the window bound's rate (sigma - alpha)^(-k) times a constant.
  Compute powers in log space (exp(-(k+1) log(z - rho))) to avoid overflow.
Controls: drag rho*; slider sigma in [2.1, 4]; slider gamma_z in [0, 40]; slider alpha in [0.5, 0.95];
  toggle "remove hypothetical zero".
Motion: the right panel redraws as controls move.
Reader takeaway: when |z - rho*| < sigma - alpha the red and gold curves climb linearly in k on this log scale,
  with slope log10((sigma - alpha)/|z - rho*|), while the teal curve falls (the zeros on the line are all
  farther than sigma - 1/2 > sigma - alpha); without the hypothetical zero nothing climbs.
Check values (sigma 2.5, alpha 0.6, z = 2.5 + 14i, rho* = 0.8 + 14i): |z - rho*| = 1.7, nearest true zero at
  distance 2.0045; (sigma - alpha)^k (|b_k(z)| + b_k(sigma)) for G_0 alone is 0.796, 0.0487, 3.05e-4,
  4.74e-7 at k = 0, 10, 40, 160, and with the wave added 0.796, 0.0575, 0.256, 1.60e5.
```
::::

## The mechanism in numbers {#le-numbers}

We tested each step on the real primes, with one hypothetical zero added. The computation is ours; it uses a sieve of $\Lambda$ up to $2\times10^7$, the first 1000 zero pairs of $\zeta$ from mpmath, and Simpson's rule on $u \in [0, \log(2\times10^7)]$ with step $10^{-4}$.

::: example {title="The coefficient formula, from primes and from zeros"}
Take $\mathsf G(u) = G_0(e^u)$ and $\sigma = 2.5$. The transform has the closed form $\Phi_0(s)$ of [[t-le-classical-zero-free]], and mpmath gives $\Phi_0(2.5) = 0.6840302$. The integral [[eq-le-coeff]] computed from the primes gives $b_0(2.5) = 0.6840302$. Integrating [[eq-le-g0-formula]] term by term gives a second formula,
$$
b_k(z) = \frac{\log 2\pi}{z^{k+1}} - \sum_\rho \frac{1}{\rho(\rho-1)(z - \rho)^{k+1}} - \sum_{m \ge 1}\frac{1}{2m(2m+1)(z + 2m)^{k+1}},
$$ {#eq-le-bk-zeros}
in which every zero is visibly a pole with residue $-1/(\rho(\rho-1))$. The two sides agree:

| $k$ | $z$ | from primes | from zeros |
| --- | --- | --- | --- |
| $0$ | $2.5$ | $0.6840302$ | $0.6840317$ |
| $5$ | $2.5$ | $7.507132\times10^{-3}$ | $7.507132\times10^{-3}$ |
| $10$ | $2.5$ | $7.707521\times10^{-5}$ | $7.707522\times10^{-5}$ |
| $5$ | $2.5 + 14i$ | $(7.07482 + 3.00983i)\times10^{-5}$ | $(7.07482 + 3.00983i)\times10^{-5}$ |
| $10$ | $2.5 + 14i$ | $(1.75842 + 1.60517i)\times10^{-6}$ | $(1.75841 + 1.60517i)\times10^{-6}$ |

(The small difference at $k = 0$ is the tail of the 1000-zero truncation. For $k \ge 20$ the kernel reaches beyond $u = 16.8$, where the sieve stops, and the prime side loses accuracy, so the table stops at $k = 10$.)
:::

::: example {title="A hypothetical zero, detected"}
Now add the wave of a hypothetical pair $\rho^* = 0.8 \pm 14i$ to $\mathsf G$, take $\alpha = 0.6$, $\sigma = 2.5$, and $z = 2.5 + 14i$. The hypothetical pole is at distance $\abs{z - \rho^*} = 1.7$ from $z$, closer than $\sigma - \alpha = 1.9$, while the nearest true zero, $\tfrac12 + 14.1347i$, is at distance $2.0045$, farther than $1.9$. The prime-side integral sees the added wave: at $k = 5$ it gives $b_5(z) = (2.81563 + 0.39126i)\times10^{-4}$, 3.7 times the size of the value without the wave, and agrees with [[eq-le-bk-zeros]] plus the two extra poles to a relative error below $10^{-7}$. The table shows the functional of [[t-le-key]] measured in units of the window bound's rate, $\mathcal N_k = (\sigma - \alpha)^k\bigl(\abs{b_k(z)} + b_k(\sigma)\bigr)$, from [[eq-le-bk-zeros]]:

| $k$ | $0$ | $10$ | $20$ | $40$ | $80$ | $160$ | $320$ |
| --- | --- | --- | --- | --- | --- | --- | --- |
| $\mathcal N_k$, true zeros only | $0.796$ | $0.0487$ | $3.89\times10^{-3}$ | $3.05\times10^{-4}$ | $3.44\times10^{-5}$ | $4.74\times10^{-7}$ | $9.0\times10^{-11}$ |
| $\mathcal N_k$, with $\rho^*$ | $0.796$ | $0.0575$ | $0.0309$ | $0.256$ | $21.9$ | $1.60\times10^{5}$ | $8.59\times10^{12}$ |

Without the hypothetical zero, $\mathcal N_k$ decays, eventually like $(1.9/2.0045)^k$, as the window bound allows. With it, $\mathcal N_k$ grows like $(1.9/1.7)^k = 1.118^k$ from $k \approx 20$ on, and from $k = 40$ on it agrees to within $0.2\%$ with the pole term alone, $\abs{c^*}1.9^k/1.7^{k+1}$ with $\abs{c^*} = 1/\abs{\rho^*(\rho^*-1)} = 0.005093$. No constant in front of the window bound can survive this growth, which is the contradiction of step 5. The moderate $\sigma = 2.5$ is our choice for visibility; the code's $\sigma = 336$ gives the same picture with a slower rate per step, $(335.4/335.2)^k$, over far more steps, $k = 420U$.
:::

## One character at a time: the combination $G_r$ {#le-gr}

The code does not apply the windowed theorem to $\zeta$ alone, nor to one L-function at a time. It applies it, for each primitive character $\chi$, to a combination over the cyclic group that $\chi$ generates.

::: definition {#d-le-gr title="The cyclic combination"}
Let $\chi$ be a primitive Dirichlet character of order $r$ (the smallest $r \ge 1$ with $\chi^r = 1$). For $1 \le j \le r-1$ let $(\chi^j)^*$ be the primitive character inducing $\chi^j$; the $r$ characters $(\chi^0)^* = 1, (\chi^1)^*, \dots, (\chi^{r-1})^*$ are distinct. The cyclic combination is the real-valued function
$$
G_r(X) = G_0(X) + \frac{1}{3r+1}\sum_{j=1}^{r-1}\Re\,g_{(\chi^j)^*}(X).
$$ {#eq-le-gr}
It is the combined sum [[eq-le-family]] of the weighted family with weight $1$ on the trivial character modulo $1$ and weight $1/(3r+1)$ on each $(\chi^j)^*$, $j \ne 0$. For $r = 1$ ($\chi$ trivial) it is $G_0$. It depends on $\chi$ through the group it generates, and the code calls this bookkeeping object the cyclic level of $\chi$.
:::

::: lean {decl="Formalism.HC.Level.Gm" file="Formalism/SharpRestriction/RamificationFrobenius/TotientGaloisClasses/ExplicitFormulaErrorOfHostConditions.lean"}
The weights and the combination. `Level.cyc ψ` is `Level.ofSub (Subgroup.zpowers ψ.χ)`, whose `KEPT` is the image of the cyclic group under "primitive character inducing", whose exceptional slot `psK` is `none`, and whose `o` is the order of the group. With `psK = none`, every weight `wt` is $1/(3o+1)$.

```lean
def Nt : Finset PChar := Λ.KEPT.erase PChar.one

def wt (ψ : PChar) : ℝ := if Λ.psK = some ψ then 1 else (3 * (Λ.o : ℝ) + 1)⁻¹

def Gm (y : ℝ) : ℝ := Formalism.Gz y + ∑ ψ ∈ Λ.Nt, Λ.wt ψ * (An.gChi ψ.χ y).re
```
:::

We confirmed the weights in the code: $1$ on $G_0$ (the term `Formalism.Gz y`, outside the sum) and $(3r+1)^{-1}$ on every other kept character, since on the spine the exceptional slot is always empty. The code's `level_family` (`Development/AutomorphicArithmetic/PrimitiveCosets/LevelFamily.lean`) shows that every such level is a weighted family in the sense of [[d-le-family]], with the same sum and the same zero-free conclusion, and `formB` then applies the windowed theorem.

**Why positive weights let one inequality control every L-function at once.** By [[t-le-poles]], the transform of $G_r$ has at each $\rho$ the residue $-w_\rho/(\rho(\rho-1))$ with
$$
w_\rho = \operatorname{ord}_{s=\rho}\zeta(s) + \frac{1}{3r+1}\sum_{j=1}^{r-1}\operatorname{ord}_{s=\rho}L\bigl(s,(\chi^j)^*\bigr),
$$
since the set $\{(\chi^j)^*\}$ is closed under conjugation and the halves in [[eq-le-residue]] recombine. Every term is nonnegative, so $w_\rho > 0$ as soon as any one of the $r$ functions vanishes at $\rho$: one inequality on $G_r$ excludes the zeros of all of them, and none can hide behind another. With mixed signs, in $G_0 - g_\chi$ say, a common zero of $\zeta$ and $L(s,\chi)$ of equal order would leave no pole, and a real zero of $L(s,\chi)$ alone would leave a negative residue that [[t-le-lower]] cannot see. This is the integer counterpart of the warning after [[t-ff-rh-from-bound]]. Why the code uses the whole cyclic group with these weights is decided upstream, where exactly these characters are "kept" in a finite abelian group (chapter [[integrality-and-galois]]); on the endgame side any positive weights would do.

::: example {title="The weights as a count"}
For $n$ coprime to the modulus of $\chi$, $(\chi^j)^*(n) = \chi^j(n)$, and $\sum_{j=0}^{r-1}\chi^j(n) = r$ if $\chi(n) = 1$ and $0$ otherwise. So, apart from the powers of the finitely many primes dividing the modulus, the prime-power part of $G_r$ is $\sum_{n \le X}\Lambda(n)\,w(n)\,(X/n - 1)$ with
$$
w(n) = 1 + \frac{r\,\mathbf 1[\chi(n) = 1] - 1}{3r+1} = r\cdot\begin{cases}\dfrac{4}{3r+1} & \chi(n) = 1,\\[2ex] \dfrac{3}{3r+1} & \chi(n) \ne 1,\end{cases}
$$
taking the real parts. For $\chi_4$ ($r = 2$) the weights are $8/7$ on $n \equiv 1 \bmod 4$ and $6/7$ on $n \equiv 3 \bmod 4$; for a character of order 4 modulo 5 they are $16/13$ on $n \equiv 1 \bmod 5$ and $12/13$ on the other classes. Our reading: the numbers $4/(3r+1)$ and $3/(3r+1)$, one of the first and $r-1$ of the second, add to $1$, and they are exactly the coset proportions $(4 \text{ or } 3)/(3o+1)$ that the code's `Frame.lam` prescribes upstream, which fits the view that this weighting is what makes an averaged finite-group sum reproduce $G_r$ (chapter [[integrality-and-galois]]). For $\chi_4$ at $X = 10^6$, $G_0 = 11.0404$ and $g_{\chi_4} = -18.8504$, so $G_2 = 11.0404 - 18.8504/7 = 8.3475$, against $\sqrt{X} = 1000$.
:::

## The contract: from $x^{1/2+9\varepsilon}$ on windows to the half-plane {#le-contract}

The windowed theorem needs a fixed exponent $\alpha$. The proof supplies a family of bounds, one for each small $\varepsilon$, with exponent $\tfrac12 + 9\varepsilon$, and the code turns the family into the half-plane in one step, with no iteration.

::::: card {#t-le-contract kind="theorem" title="If for every small $\varepsilon$ the cyclic combination is at most $x^{1/2+9\varepsilon}$ on windows $[Y,Y^{3/2}]$, then neither $\zeta$ nor any $L(s,\chi^j)$ vanishes to the right of one half"}
:::: statement
Let $\chi$ be a primitive character of order $r$. Suppose there is $\varepsilon_1 > 0$ such that for every $\varepsilon \in (0, \varepsilon_1)$ there are a threshold $x_1$ and a set of scales containing windows $[Y, Y^{3/2}]$ for arbitrarily large $Y$, with
$$
G_r(x) \le x^{1/2 + 9\varepsilon}\qquad\text{for every scale } x \ge x_1 \text{ in the set.}
$$ {#eq-le-contract}
Then $\zeta(s) \ne 0$ and $L(s, (\chi^j)^*) \ne 0$ for every $j$ and every $s$ with $\Re s > \tfrac12$.
::::
:::: plain
A bound slightly worse than the square root, on long recurring stretches of scales, for every degree of "slightly", is exactly as good as the Riemann Hypothesis for the characters involved.
::::
:::: why
Applied to every primitive $\chi$, which is one of its own $(\chi^j)^*$, it gives `ZeroFreeAll`, the hypothesis of [[t-le-five]].
::::
:::: idea
Given a target point $s$ with $\Re s > \tfrac12$, choose $\varepsilon$ so small that $\tfrac12 + 9\varepsilon$ is below $\Re s$ with room to spare, and apply the windowed theorem once with that exponent.
::::
:::: proof
This follows `level_of_tiedWin`. Let $\Re s > \tfrac12$ and $\Delta = \min(\Re s - \tfrac12, \tfrac12) > 0$. Choose $\varepsilon \in (0, \varepsilon_1)$ with $9\varepsilon \le \Delta/2$ (`exists_small_eps`), and put $\alpha = \tfrac12 + \Delta/2$, so that $\tfrac12 < \alpha < 1$ and $\alpha < \Re s$. For $x \ge \max(x_1, 1)$ in the set, $G_r(x) \le x^{1/2+9\varepsilon} \le x^\alpha$. So the set $\{x : G_r(x) \le x^\alpha\}$ has windows of exponent $\tfrac32$ (`HasWindows.mono`), and [[t-le-windowed]] with $\delta = \tfrac12$, $C = 1$, and the family of [[d-le-gr]] (this is `formB` via `level_family` and `zeroFree_of_rpow_window`) gives $L(s', (\chi^j)^*) \ne 0$ for all $\Re s' > \alpha$, in particular at $s$.
::::
:::: lean {decl="Formalism.HC.level_of_tiedWin" file="Formalism/SharpRestriction/RamificationFrobenius/TotientGaloisClasses/TopWin.lean"}
The code states the hypothesis as two propositions about the level, with exponent $\tfrac12 + (e_D + e_L + 7)\varepsilon$; on the spine `topDesWin` is called with $e_D = 2$, $e_L = 0$ (the arguments `2 3 2 0` in `TopShape.lean` are $C_{\mathrm{abs}}, C_0, e_D, e_L$), so the exponent is $\tfrac12 + 9\varepsilon$.

```lean
theorem level_of_tiedWin {Λ : Level} {la : ℝ} (h112 : ChebyshevInequalityOnWindows @core @Tied Λ) (hB : Λ.FormBAt la)
    (h : ChebyshevInequalityAtWindowScale @core @Tied la Λ) : Λ.ZeroFreeLevel
```
::::
:::: used
[[t-le-interface]] states where the hypothesis comes from.
::::
:::::

There is no bootstrap here: each half-plane $\Re s > \tfrac12 + \Delta/2$ comes directly from one $\varepsilon$. The note's step 4 ends with "bootstrap!!" [@alpoge-note], and on the path from `Main` nothing in this region iterates a weaker zero-free region into a stronger one, so we cannot say where the bootstrap lives in the code.

The scale dictionary is short. The window $[Y, Y^{3/2}]$ is $[U, \tfrac32U]$ in $u = \log x$, the allowance is $x^{1/2+9\varepsilon}$, and the Taylor index is $k = \lceil 420\,U\rceil$, proportional to $\log Y$. At that $k$ a zero at $\beta > \alpha$ wins by a factor of roughly $((\sigma - \alpha)/(\sigma - \beta))^k \approx e^{1.25(\beta - \alpha)U}$, so the contradiction appears once $\log Y$ is a large multiple of $1/(\beta - \alpha)$.

## What the rest of Part IV must supply {#le-interface}

Everything above is unconditional analysis. What remains is the hypothesis of [[t-le-contract]], for every primitive $\chi$. The page names three inputs for the whole of Part IV, the inputs of `UpperTheory.EveryCharacter` as the code has them (`MainConclusion.lean`): `Row0b`, Galois representations attached to the automorphic representations that the chain uses (chapter [[integrality-and-galois]]); `TLiftK` with `GeoOne`, from which the tree proves `Row0b` (`galoisLocalGlobalStrong_recParameter`); and `VWin`, the bound on Galois cohomology on windows of scales, which the tree proves from `Row0b` (`vwin_of_row`, chapter [[cohomology-window]]). The endgame meets them one level down, through a theorem whose three hypotheses are cut differently: `Green`, `VWin`, and a `HypsAlt` record. On the way from the three inputs the tree proves `Green` (`green_of_regular`) and the `HypsAlt` record (`nonempty_hyps_definite_side_of_closed_bound`), in `every_character_of_theta_integrals_local_matching`, so the card below states the interface at that level. We describe `Green` and `HypsAlt` only as far as we unfolded them; chapters [[definite-forms]] to [[cohomology-window]] open the construction further, and chapter [[inputs-and-assembly]] traces the inputs to published theorems. A shorter rewrite of the formal proof meets the same endgame through a different interface, a one-sided bound for a single residue class with a second cut-off in place of windows ([[rc-endgame]]).

::::: card {#t-le-interface kind="theorem" title="From Green, VWin, and the HypsAlt record, every cyclic combination is at most $x^{1/2+9\varepsilon}$ on windows $[Y,Y^{3/2}]$, and every Dirichlet L-function is zero-free to the right of one half"}
:::: statement
Assume (i) `GlobalTheory.GLq.Green`, (ii) `UpperTheory.Top.VWin`, and (iii) that a record of type `HypsAlt (Closed · LinkN) DefiniteSideCondition` exists. Then for every primitive Dirichlet character $\chi$ of order $r$ there is $\varepsilon_1 > 0$ such that for every $\varepsilon \in (0, \varepsilon_1)$ there is a family of data at scales $x$ whose set of scales has windows $[Y, Y^{3/2}]$ for arbitrarily large $Y$, and
$$
G_r(x) \le x^{1/2 + 9\varepsilon}\qquad\text{at every large scale } x \text{ of the family.}
$$ {#eq-le-interface}
Consequently `ZeroFreeAll` holds, and with it the five theorems of `Main.lean`.
::::
:::: plain
The rest of the proof is a machine that, given a primitive character and a small $\varepsilon$, finds long recurring stretches of scales on which the cyclic combination is at most $x^{1/2+9\varepsilon}$, and this chapter showed that such a machine proves the hypothesis for every Dirichlet L-function.
::::
:::: why
The inequality [[eq-le-interface]], with its exponent, windows, and quantifiers, is exactly what chapters [[definite-forms]] to [[cohomology-window]] must produce.
::::
:::: idea
The code splits the inequality in two: for each small $\varepsilon$ a family exists whose scales have windows and whose data are "tied" there (from `Green`, `VWin`, and `HypsAlt`), and tied data at a scale $x$ force $G_r(x) \le x^{1/2+9\varepsilon}$ (a finite-group explicit formula).
::::
:::: proof
The code's route, step by step (`zero_free_all_of_green_v_win` and `zeroFreeAll_of_topG`); the last two steps are where this chapter's proofs take over.

::: steps
1. Hosts on windows (`UpperTheory.Top.supplyChi`). From `VWinAt ψ 401` the code builds, for every $\varepsilon < 1/52$, "hosts" at all scales of some windows of exponent $\tfrac32$ satisfying the requirement `GChi ψ`: the explicit-formula conditions `EAtH` for the cyclic level with constant 4, and the cohomology bound `VVle`. `VWin` asks, for each primitive character and certain abelian CM fields $E$ built from it, that the sum, over all primes $\ell$ and all Tate twists of $\QQ_\ell/\ZZ_\ell$ below $x^{401}$, of $\log\#\text{Sha}^1$ of $E$ with those coefficients be at most $\exp(x^\varepsilon/2)$, at every scale $x$ of a window $[Y, Y^2]$ (chapter [[cohomology-window]] defines these groups). (The code writes this as the $\ZZ_\ell$-length of each group times $\log\ell$, which is the logarithm of its order.) This is the input of chapter [[cohomology-window]].
$$
\text{\texttt{VWin}} \implies \text{hosts at the scales of windows } [Z, Z^{3/2}].
$$
2. A tied chain on those windows (`TopG`, from `shape_closed_link_n_of_green`). From `Green` and the `HypsAlt` record the code proves that whenever such hosts exist on windows, for each small $\varepsilon$ some family of data carries a "tied" chain at every large scale of its windows, with $(e_D, e_L) = (2, 0)$ (`topDesWin`). `Green` reads as Green's parametrization of the cuspidal characters of $GL_d(\FF_g)$, of degree $\prod_{i<d}(g^i - 1)$ [@green1955]; that reading is from the shape of the statement, whose structures `LabelDatum`, `IsPrimeLab`, `Gn`, and `IsCuspOf` were not unfolded. `HypsAlt` is a record of about 45 closure properties of a class of families (rows, twists, divisibility, ties, mass ratios, genus masses, counting constants), whose field `nRest` with the parameter `Closed · LinkN` bounds a sum by a size term plus the same Galois-cohomology lengths. `DefiniteSideCondition` is a predicate on bundles of definite-side data that was not unfolded.
$$
\text{\texttt{Green}},\ \text{\texttt{HypsAlt}} \implies \text{tied data at every large window scale}.
$$
3. The window inequality (`level_gm_le_on_family_scales`, from `UpperTheory.Comparison₂.core_gm`). At each large window scale $x$ the tied data give $G_r(x) \le x^{1/2 + (e_D + e_L + 7)\varepsilon}$: the code rewrites $G_r$ as a weighted sum over the additive characters of a finite abelian group (`gmA_eq`), bounds the part from characters outside the cyclic group by $4r\,x^{1/2+\varepsilon}$ using the hosts' bounds $\abs{g_\psi(x)} \le x^{1/2+\varepsilon}$ for those characters (`sigA_le`), and bounds the rest by `ch_core`, whose input is an upper bound on a weighted count of inert prime powers against its expected value. Chapter [[integrality-and-galois]] unfolds `core_gm`, `ch_core` (`Development/AutomorphicArithmetic/DedekindLFunctions/LandauTheorems/ChCore.lean`), and `ch_top` in [[t-ig-core]]; the tied-chain property `ChainTied` is defined in `Formalism/SharpRestriction/GlobalSchurBounds/TieGlobal.lean` and supplied by step 2.
$$
G_r(x) \le x^{1/2+9\varepsilon}.
$$
4. The endgame. [[t-le-contract]] gives `ZeroFreeAll`, and [[t-le-five]] gives the five theorems.
:::
::::
:::: lean {decl="UpperTheory.Top.zero_free_all_of_green_v_win" file="Development/AutomorphicArithmetic/ThetaCorrespondence/ThetaPairLifts/ThirdPlaceSeries/TopPlug.lean"}
The theorem with the three hypotheses, and its consequence for every character.

```lean
theorem UpperTheory.Top.zero_free_all_of_green_v_win (hG : GlobalTheory.GLq.Green) (hV : UpperTheory.Top.VWin)
    (h : Nonempty (_root_.GlobalTheory.Fc.HypsAlt (fun 𝒞 => Closed 𝒞 fun Fm _ => LinkN Fm) _root_.GlobalTheory.Fc.DefiniteSideCondition)) : Formalism.HC.ZeroFreeAll
theorem UpperTheory.Top.every_character_of_green_v_win (hG : GlobalTheory.GLq.Green) (hV : UpperTheory.Top.VWin)
    (h : Nonempty (_root_.GlobalTheory.Fc.HypsAlt (fun 𝒞 => Closed 𝒞 fun Fm _ => LinkN Fm) _root_.GlobalTheory.Fc.DefiniteSideCondition)) : UpperTheory.EveryCharacter
```
::::
:::: lean {decl="Formalism.HC.ChebyshevInequalityOnWindows" file="Formalism/SharpRestriction/RamificationFrobenius/TotientGaloisClasses/TopWin.lean"}
The two halves of the interface for a level `Λ`; on the spine `Tied` is `ChainTied` and $(e_D, e_L) = (2, 0)$.

```lean
def ChebyshevInequalityOnWindows (Λ : Level) : Prop :=
  ∀ (eD eL eps : ℝ), 0 < eps → ∀ Fm : Fam eps, EFamC Λ (core Fm) → ChebyshevInequalityOnFamilyWindows @core @Tied Fm eD eL →
    ∃ x1 : ℝ, ∀ x ≥ x1, x ∈ (core Fm).Win → Λ.Gm x ≤ x ^ ((1 : ℝ) / 2 + (eD + eL + 7) * eps)

def ChebyshevInequalityAtWindowScale (la : ℝ) (Λ : Level) : Prop :=
  ∃ eD eL ε₁ : ℝ, 0 < ε₁ ∧ ∀ eps : ℝ, 0 < eps → eps < ε₁ → ∃ Fm : Fam eps, EFamC Λ (core Fm) ∧
    (core Fm).Windows la ∧ ChebyshevInequalityOnFamilyWindows @core @Tied Fm eD eL
```
::::
:::: used
Chapters [[definite-forms]] and [[multiplicity-from-lifts]] describe the chain behind step 2, whose proof `TopG` the page states and does not unfold ([[ml-gaps]]); chapter [[integrality-and-galois]] unfolds step 3 from the tied data to the bound; and chapter [[cohomology-window]] proves the input of step 1.
::::
:::::

::: aside {title="How this matches the note's step 6, in our reading"}
The note's step 6 reads "$W(\mathbb 1_{(0,1]} + (\sim X^\eta)\,\mathbb 1_{(0,1/X]}) \ge 0$ gives $> 1-\eta$" [@alpoge-note], with $W$ Weil's functional of [[d-wp-functional]]. On the path from `Main` the code states no positivity of Weil's functional and uses no indicator test functions; it proves the upper bound [[eq-le-interface]] with an allowance. Our reading of the correspondence: for $f = \mathbf 1_{(0,1]}$, chapter [[weil-positivity]] found $f * \tilde f = \min(1, 1/x)$ with transform $1/(s(1-s))$, which is minus the smoothing kernel $1/(s(s-1))$. The function $\min(1, X/x)$ has transform $X^s/(s(1-s))$, so the zero side of $W$ there is $\sum_\rho X^\rho/(\rho(1-\rho))$, which by [[eq-le-g0-formula]] is $G_0(X) - \log 2\pi$ up to the trivial-zero tail (the prime side needs the regularization chapter [[weil-positivity]] mentions, because the transform has poles at $0$ and $1$). So $W$ on indicator-built functions, scaled to $X$, speaks about $G_0(X)$. The note's test function is a sum of two indicators rather than such a convolution, and in it the piece of size about $X^\eta$ plays the allowance, whose transform $C/(s-\alpha)$ has its pole at $\alpha$ and so limits the conclusion to $\Re s > \alpha$, as "$> 1 - \eta$" limits the note's. On this reading the note's $1 - \eta$ corresponds to the code's $\tfrac12 + 9\varepsilon$. Both are inequalities about primes with no zero in them, as in [[t-wp-criterion]].
:::

::: symbols
| Symbol | What it is | Kind | Where it lives |
| --- | --- | --- | --- |
| $G_0(X)$ | smoothed sum minus $X\log X - (1+\gamma_E)X$ | real function | [[eq-le-g0]] |
| $g_\chi(X)$ | twisted smoothed sum plus $X\,\frac{L'}{L}(1,\chi)$ | complex function | [[d-le-g]] |
| $C_\chi$ | constant term of $-\frac{L'}{L}(s,\chi)$ at $s = 0$, even $\chi$ | complex number | [[t-le-twisted]] |
| $G$, $a_i$ | combined sum of a weighted family, and its weights | real function, positive reals | [[d-le-family]] |
| $G_r$ | cyclic combination for a primitive $\chi$ of order $r$ | real function | [[d-le-gr]] |
| $\alpha$ | exponent of the allowance $Cx^\alpha$ | real in $(0,1)$ | [[t-le-windowed]] |
| $\delta$, $U$ | window $[Y, Y^{1+\delta}] = [e^U, e^{(1+\delta)U}]$; $\delta = \tfrac12$ on the spine | positive reals | [[t-le-windowed]] |
| $\mathsf G(u)$ | $G(e^u)$, the sum on the logarithmic scale | real function of $u \ge 0$ | [[le-laplace]] |
| $\Phi(s)$ | Laplace transform of $\mathsf G$ | meromorphic on $\Re s > 0$ | [[eq-le-laplace]] |
| $\mathcal Z$, $c_\rho$, $w_\rho$ | poles of $\Phi$, residue, weighted multiplicity | set, complex, positive real | [[t-le-poles]] |
| $b_k(z)$ | $(-1)^k\Phi^{(k)}(z)/k!$ | complex number | [[eq-le-bk]] |
| $K_k(u)$ | Gamma kernel $u^ke^{-\sigma u}/k!$ | positive function | [[eq-le-kernel]] |
| $\sigma$, $k$ | real point and Taylor index; code: $\sigma = 336$, $k = \lceil 420U\rceil$ | real, integer | [[le-kernel]] |
| $\lambda$, $\kappa$, $C_1$ | constants of the tail bound ($\lambda$ is not the prime $\ell$ of Galois cohomology) | reals | [[eq-le-tails]] |
| $C_0$, $C_2$ | growth constant $\lvert\mathsf G(u)\rvert \le C_0e^{2u}$, and the constant of the window bound | reals | [[t-le-key]] |
| $C_3$, $C_4$ | constants of the lower bound $C_3\,d^{-k} - C_4\,d'^{-k}$ | positive and nonnegative reals | [[t-le-lower]] |
| $\nu$ | small exponent in $e^{\nu U}$ (the code's `η`) | positive real | [[t-le-windowed]] |
| $d$, $d'$ | distance to the nearest pole, and a slightly larger radius | positive reals | [[t-le-lower]] |
:::

::: recap
- The five theorems of `Main.lean` follow from `ZeroFreeAll`, by Euler factors and the functional equation ([[t-le-five]]).
- $G_0$ and $g_\chi$ are a constant, at most $\log X$, and one wave $-X^\rho/(\rho(\rho-1))$ per zero ([[t-le-twisted]]); real zeros push up and complex zeros have crests, so an upper bound sees every off-line zero ([[le-sign]]).
- Landau's theorem turns a one-sided bound at every large $X$ into a zero-free half-plane ([[t-le-classical-zero-free]]); the proof's bound holds only on windows, because its cohomological input does ([[le-why-windows]]).
- The windowed theorem ([[t-le-windowed]]) uses Taylor coefficients of the Laplace transform: Gamma kernels localize them on a window ([[le-kernel]]), $\abs t + t = 2\max(t,0)$ bounds them there by $(\sigma-\alpha)^{-k}$ ([[t-le-key]]), and a zero right of $\alpha$ makes them grow like $d^{-k}$, $d < \sigma - \alpha$ ([[t-le-lower]]), with positive weights making every residue count ([[t-le-poles]]).
- Applied to $G_r$ for each primitive $\chi$, a bound $x^{1/2+9\varepsilon}$ on windows for every small $\varepsilon$ gives the half-plane ([[t-le-contract]]). That bound, [[eq-le-interface]], is what chapters [[definite-forms]] to [[cohomology-window]] supply, through `Green`, `VWin`, and `HypsAlt` ([[t-le-interface]]), from the three inputs `Row0b`, `TLiftK` with `GeoOne`, and `VWin`.
:::
