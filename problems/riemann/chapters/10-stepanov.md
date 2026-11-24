---
id: stepanov
title: Stepanov's proof
part: 2
summary: Follow Stepanov's method in Bombieri's form from the auxiliary function to the Riemann Hypothesis for curves, and name the four ingredients, Frobenius, cheap multiplicity, Riemann and Roch, and the Galois trick, that the integers do not supply directly.
needs: [counting-primes, function-fields, weil-positivity]
---

::: plain
To show that an equation has few solutions, build a polynomial that vanishes at every solution, many times over, while keeping its degree small. A polynomial cannot vanish more times than its degree, so the solutions must be few. Over a finite field this trick is cheap, because raising to the power $p$ makes a function vanish $p$ times at once, and it proves the Riemann Hypothesis for curves with nothing more than linear algebra and a count of dimensions.
:::

The note behind the second proof of 2026 calls its argument a descendant of Stepanov's. It says that Stepanov's argument uses multiplicity, that multiplicity is what is hard to find over the integers, and it lists a "Stepanov determinant" in its timeline [@alpoge-note]. This chapter gives the function-field argument completely, in the form Bombieri gave Stepanov's method in 1973, so that every later use of the words "auxiliary function", "multiplicity", and "Stepanov determinant" refers to something the reader has seen work [@stepanov1969; @bombieri1974]. A textbook account of the same proof is the appendix of Rosen's book [@rosen2002, appendix]. Each step is shown in parallel on the curve $y^2 = x^3 + x + 1$, the elliptic curve of [[function-fields]].

## The idea: vanish too often {#st-idea}

The whole method rests on the fact that a nonzero polynomial cannot have more roots than its degree, counted with multiplicity.

::: definition {#d-st-order title="Order of vanishing"}
A polynomial $R$ vanishes to order at least $m$ at a point $r$ when $(x - r)^m$ divides $R$, equivalently when $R$ and its first $m - 1$ derivatives vanish at $r$ in characteristic $0$. On a curve, the order $\ord_P(h)$ of a function $h$ at a point $P$ is the exponent of a local parameter in $h$: positive at a zero, negative at a pole, and $0$ otherwise. It is an integer attached to a point, not a value of the function.
:::

::: theorem {#t-st-roots title="A nonzero polynomial of degree $D$ that vanishes to order at least $m$ at $N$ distinct points satisfies $mN\le D$"}
If $R \ne 0$ has degree $D$ and $(x - r_i)^m$ divides $R$ for $N$ distinct $r_1, \dots, r_N$, then $mN \le D$.
:::

::: proof
The factors $(x - r_i)^m$ are pairwise coprime, so their product, of degree $mN$, divides $R$.
:::

This is Chebyshev's budget of [[cp-chebyshev]] read through the dictionary of [[ff-dictionary]], where $\deg f$ plays
$\log n$ and a monic irreducible polynomial plays a prime. A root $r$ in the field is the prime $x - r$ of degree 1, so
"$R$ vanishes to order $m$ at $r$" is "$(x - r)^m$ divides $R$", the counterpart of $p^m$ dividing an integer, and
[[eq-cp-budget]] becomes the statement that the irreducible factors of $R$, counted with multiplicity and weighted by
their degrees, add up to $\deg R$. Chebyshev's $\binom{2n}{n}$ is divisible by each prime of its window only once.
Stepanov's whole advance lies in the exponent $m$: an auxiliary function that vanishes to order $m$ at every point it
counts is charged $m$ times for each one.

On its own this bounds the number of roots of $R$, which is useless if the set we care about is described by a polynomial of large degree. Stepanov's point is to bound a set $S$ by building, for the occasion, an auxiliary $R$ that vanishes on $S$ to high order $m$ while its degree $D$ grows more slowly than $m$ times the true size of $S$. Then $\abs S \le D/m$, and the art is to make $D/m$ close to the truth.

::: example
Count the $x \in \FF_{101}$ for which $f(x) = x^3 + x + 1$ is a nonzero square. They are the roots of $f(x)^{50} - 1$, since by Euler's criterion $a^{50} = 1$ exactly for nonzero squares in $\FF_{101}$. That polynomial has degree $150$, so the obvious bound is $150$, while the true count is $52$ (and the curve has $N_1 = 2\cdot 52 + 1 = 105$ points, as $f$ has no root modulo 101). The expected count is about $p/2 = 50.5$. Stepanov's elementary argument builds an auxiliary polynomial of the shape
$$
R(x) = f(x)^K \sum_{j} \bigl( r_j(x) + s_j(x)\, f(x)^{(p-1)/2} \bigr) x^{jp}
$$
with unknown polynomials $r_j, s_j$ of small degree, and imposes vanishing to order $K$ at every $x$ in the set. The factor $x^{jp}$ is invisible to the first $p - 1$ derivatives, because $\frac{\dd}{\dd x} x^{jp} = jp\,x^{jp-1} = 0$ in characteristic $p$, and on the set itself $x^p = x$ and $f(x)^{(p-1)/2} = 1$. So the vanishing conditions become conditions on the few coefficients of the $r_j$ and $s_j$ alone, a small linear system, and the result is a bound $p/2 + O(\sqrt p)$, with the implied constant depending only on $\deg f$ [@iwaniec-kowalski-ant, §11.6; @schmidt1976, ch. I].
:::

The rest of the chapter replaces polynomials in $x$ by functions on a curve, which removes all special features of $y^2 = f(x)$, and replaces derivatives by $p$-th powers, which removes the need to compute any derivative at all.

::: figure {#f-st-multiplicity viz="multiplicity-budget" height="420"}
A polynomial of fixed degree can touch the axis at more points only by touching each one less deeply, and once the total of multiplicities exceeds the degree the only possibility is the zero polynomial.

```vizspec
Purpose: make the inequality m N <= D visible as a budget.
Scene: top, axes x in [0, 10], y in [-1.2, 1.2]. Draw R(x) = c * prod_{i=1..N} (x - r_i)^m * Q(x), where
  r_i = i * 10 / (N + 1) are evenly spaced roots marked as gold dots on the axis, Q(x) is a fixed
  nonvanishing filler polynomial of degree D - m N (use Q(x) = 1 + 0.1 (x - 5)^2 raised to the needed
  power, or a product of shifted quadratics with no real roots), and c normalizes the max of |R| on [0, 10]
  to 1. Draw the curve in blue. Near each root, a small zoom inset (optional) shows that order m means the
  curve is flat to order m - 1: for m even it touches without crossing, for m odd it crosses.
  Bottom, a horizontal bar of length D (the degree budget) divided into N blocks of length m (gold) and
  a remainder of length D - m N (muted).
Controls: slider D from 4 to 24 (default 12); slider m from 1 to 6; slider N from 1 to 12.
Motion: when m N <= D the curve redraws smoothly. When m N > D the bar overflows in red, the curve
  collapses to the zero line over 400 ms, and the caption line under the bar reads "only R = 0 fits".
Reader takeaway: high-order vanishing at many points costs degree, and a nonzero function of degree D
  cannot afford more than D / m points of order m.
```
:::

## Functions on a curve and the Riemann and Roch count {#st-riemann-roch}

On a curve the role of the degree is played by the poles. A rational function on $C$ is a quotient of polynomials in the coordinates, taken modulo the equation of $C$. These functions form a field $\FF_q(C)$, the function field of $C$, and every nonzero $h$ in it has finitely many zeros and poles.

::: theorem {#t-st-degree title="A nonzero rational function on a smooth projective curve has as many zeros as poles, counted with multiplicity" source="hartshorne1977"}
For $h \in \FF_q(C)$ nonzero, $\sum_P \ord_P(h) = 0$, the sum running over the points of $C$ over $\overline{\FF}_q$.
:::

This is the curve version of [[t-st-roots]]. A polynomial of degree $D$ in $x$, seen as a function on the projective line, has a pole of order $D$ at infinity and nowhere else, so it has $D$ zeros counted with multiplicity [@hartshorne1977, ch. II, §6]. On a curve, a function whose only pole is at one point $P_0$, of order at most $k$, has at most $k$ zeros counted with multiplicity. So the space of such functions is the space of "polynomials of degree at most $k$" on $C$, and we need its dimension.

::: definition {#d-st-L title="Riemann and Roch space"}
For a point $P_0 \in C(\FF_q)$ and an integer $k \ge 0$, $L(kP_0)$ is the set of $h \in \FF_q(C)$ that are regular everywhere except possibly at $P_0$, where the pole has order at most $k$, together with $h = 0$. It is a finite-dimensional vector space over $\FF_q$, and $\ell(k) = \dim L(kP_0)$. It is not a ring, since products add pole orders, and it is not the space of all functions with poles bounded by $k$ somewhere. More generally, for a formal sum $D = \sum n_P P$ of points, $L(D)$ is the space of $h$ with $\ord_P(h) \ge -n_P$ at every $P$.
:::

::::: card {#t-st-rr kind="theorem" title="Functions with a single pole of order at most $k$ form a space of dimension at least $k+1-g$, with equality once $k\ge2g-1$" source="hartshorne1977"}
:::: statement
Let $C$ be a smooth projective curve of genus $g$ over $\FF_q$, $P_0 \in C(\FF_q)$, and $D$ a divisor of degree $d$ defined over $\FF_q$. Then $\ell(D) \le d + 1$ when $d \ge 0$, $\ell(D) \ge d + 1 - g$, and $\ell(D) = d + 1 - g$ when $d \ge 2g - 1$. For $D = kP_0$ the spaces are nested, $L((k-1)P_0) \subseteq L(kP_0)$, with $\ell(k) - \ell(k-1) \in \{0, 1\}$, so $L(kP_0)$ has a basis of functions with pairwise distinct pole orders at $P_0$.
::::
:::: plain
On a curve of genus $g$ there are about as many functions with a pole of order at most $k$ at one point as there are polynomials of degree at most $k$, minus $g$, and the shortfall of exactly $g$ is reached once $k$ reaches $2g - 1$.
::::
:::: why
Stepanov's argument creates an auxiliary function by solving a linear system whose unknowns and equations are dimensions of such spaces. Without this count there is no way to know that unknowns outnumber equations.
::::
:::: idea
The genus measures how many pole orders are missing. Each step $k - 1 \to k$ either adds a function with a pole of exact order $k$ or adds nothing, and the theorem says that exactly $g$ steps add nothing, all of them at $k \le 2g - 1$. The equality comes from the full Riemann and Roch theorem, $\ell(D) - \ell(K - D) = d + 1 - g$ with $K$ a canonical divisor of degree $2g - 2$, since $\ell(K - D) = 0$ once $d > 2g - 2$.
::::
:::: sketch {source="hartshorne1977" loc="ch. IV, §1"}
The Riemann and Roch theorem and its consequences listed here are in Hartshorne [@hartshorne1977, ch. IV, §1]. The nesting statement follows because a function in $L(kP_0)$ is determined modulo $L((k-1)P_0)$ by one coefficient, its leading term in a local parameter at $P_0$. Choosing one function at each step where the dimension rises gives the basis with distinct pole orders.
::::
:::: example
For $y^2 = f(x)$ with $f$ squarefree of odd degree $2g + 1$ and $P_\infty$ the point at infinity, $x$ has a pole of order $2$ at $P_\infty$ and $y$ a pole of order $2g + 1$, and neither has other poles. The functions $x^i$ (pole order $2i$) and $x^i y$ (pole order $2i + 2g + 1$) have distinct pole orders, hence are linearly independent. The orders reached are every even number and every odd number from $2g + 1$ on, so the missing orders, the gaps, are $1, 3, \dots, 2g - 1$, exactly $g$ of them. This agrees with the theorem and confirms the genus $g = \lfloor (d-1)/2 \rfloor$ claimed in [[function-fields]]. For the elliptic curve $y^2 = x^3 + x + 1$ ($g = 1$):

| $k$ | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| new basis function | $1$ | none | $x$ | $y$ | $x^2$ | $xy$ | $x^3$ | $x^2y$ |
| $\ell(k)$ | 1 | 1 | 2 | 3 | 4 | 5 | 6 | 7 |
| $k + 1 - g$ | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 |

From $k = 1 = 2g - 1$ on, $\ell(k) = k + 1 - g$ exactly.
::::
:::: used
The counts enter [[t-st-existence]] and the choice of parameters in [[t-st-upper]].
::::
:::::

::: figure {#f-st-ladder viz="pole-ladder" height="440"}
On a curve of genus g exactly g pole orders are missing, and that small loss is why the unknowns of Stepanov's system outnumber its equations once q exceeds (g+1) to the fourth. That condition is sufficient, not necessary: for genus 3 and 4 the count already succeeds when the square root of q is 3.

```vizspec
Purpose: show the pole-order ladder of a hyperelliptic curve and the dimension count that powers the proof.
Scene: top panel, a number line of pole orders k = 0..40 as small boxes. For genus g, boxes at even k
  and at odd k >= 2g + 1 are filled blue and labeled with the basis function x^i or x^i y; gap boxes
  1, 3, ..., 2g - 1 are outlined in red. Above the line, the staircase l(k) as gold steps and the line
  k + 1 - g in blue, meeting from k = 2g - 1 on.
  Bottom panel, the count: with r = sqrt(q), A = r - 1, B = r + 2g, draw two bars:
  unknowns = l(A) * l(B) (gold) and equations = l(A r + B) (muted), using l(k) = k + 1 - g for
  k >= 2g - 1 and the exact ladder below. Mark the threshold r = (g + 1)^2 where unknowns first exceed
  equations: unknowns - equations = r - (g + 1)^2 for r large.
Controls: slider g from 1 to 4; slider r = sqrt(q) over integers from 2 to 40 (state q = r^2, and note
  q must be a square of a prime power for the theorem; the bars are pure arithmetic for any r).
Motion: the ladder rebuilds when g changes; the bars grow with r and the unknown bar overtakes the
  equation bar at r = (g + 1)^2 + 1, turning gold.
Reader takeaway: g missing pole orders cost about g^2 + 2g + 1 against a gain of r, so the method works
  once sqrt(q) > (g + 1)^2.
Check: g = 1: r = 4 gives 18 unknowns vs 18 equations (fails); r = 5 gives 28 vs 27 (works).
```
:::

## Frobenius turns being rational into an equation {#st-frobenius}

The set Stepanov counts, $C(\FF_q)$, must be described by an equation that the auxiliary function can use. Frobenius provides it. A function $h \in \FF_q(C)$ has coefficients in $\FF_q$, and $a^q = a$ for those coefficients, so raising $h$ to the power $q$ raises its arguments instead,
$$
h(P)^q = h\bigl(\Frob(P)\bigr) \qquad \text{for every point } P \text{ at which } h \text{ is regular},
$$ {#eq-st-frobenius}
where $\Frob$ raises each coordinate of $P$ to the power $q$. At a rational point $\Frob(P) = P$, so $h(P)^q = h(P)$. Being a rational point, a property defined by which field the coordinates lie in, becomes an identity between the function $h^q$ and the function $h$ that holds at those points.

::: example
On $y^2 = x^3 + x + 1$ over $\FF_q$, at every rational affine point $x^q = x$ and $y^q = y$. As functions on the curve $x^q$ and $x$ differ, but $y^q = y\cdot(y^2)^{(q-1)/2} = y\, f(x)^{(q-1)/2}$, so the condition $y^q = y$ at a point with $y \ne 0$ says $f(x)^{(q-1)/2} = 1$, the Euler criterion of the example in [[st-idea]]. Frobenius has turned "$f(x)$ is a square in $\FF_q$" into a polynomial identity at the point.
:::

The second gift of characteristic $p$ is that $p$-th powers vanish deeply. Because $(a + b)^p = a^p + b^p$, the map $h \mapsto h^{p^\mu}$ respects sums, and orders of vanishing multiply: $\ord_P(h^{p^\mu}) = p^\mu \ord_P(h)$. So if $h$ is regular at $P$ and $h(P) = 0$, then $h^{p^\mu}$ vanishes at $P$ to order at least $p^\mu$. In the language of derivatives, $\frac{\dd}{\dd x}\bigl(h^{p}\bigr) = p\,h^{p-1}h' = 0$, so a $p$-th power has vanishing derivative everywhere and any zero of it is automatically a multiple zero. Multiplicity, which in characteristic $0$ costs one linear condition per derivative, is free.

## The auxiliary function {#st-auxiliary}

Fix from now on a smooth projective curve $C$ of genus $g$ over $\FF_q$ with $q = p^{2\mu}$ a square, so $\sqrt q = p^\mu$, and a rational point $P_0 \in C(\FF_q)$ (if there is none, $N_1 = 0$ and there is nothing to bound). Fix integers $A, B \ge 0$, and let $e_1, \dots, e_r$ be a basis of $L(AP_0)$ with distinct pole orders, as in [[t-st-rr]], so $r = \ell(A)$. The auxiliary function will be
$$
F = \sum_{i=1}^{r} e_i^{p^\mu}\, b_i^{q}, \qquad b_1, \dots, b_r \in L(BP_0),
$$ {#eq-st-F}
with the $b_i$ chosen so that the companion function $\sum_i e_i^{p^\mu} b_i$, in which $b_i^q$ is replaced by $b_i$, vanishes identically. Three lemmas say that $F$ then vanishes to order $p^\mu$ at every rational point other than $P_0$, that $F$ is not zero, and that such $b_i$ exist.

::::: card {#t-st-vanishing kind="lemma" title="If the companion sum $\sum_i e_i^{p^\mu}b_i$ is identically zero, then $F$ vanishes to order at least $p^\mu$ at every rational point other than $P_0$" source="bombieri1974"}
:::: statement
If $b_1, \dots, b_r \in L(BP_0)$ satisfy $\sum_{i} e_i^{p^\mu} b_i = 0$ in $\FF_q(C)$, then the function $F$ of [[eq-st-F]] lies in $L\bigl((Ap^\mu + Bq)P_0\bigr)$, it equals $\bigl(\sum_i e_i\, b_i^{p^\mu}\bigr)^{p^\mu}$, and $\ord_P(F) \ge p^\mu$ for every $P \in C(\FF_q)$ with $P \ne P_0$.
::::
:::: plain
Replace $b_i^q$ by $b_i$ and the sum becomes zero by construction. At a rational point the replacement changes nothing, so $F$ is zero there, and because $F$ is a $p^\mu$-th power, it is zero there $p^\mu$ times over.
::::
:::: why
This is where the count of rational points enters: every one of them is forced to be a deep zero of one function with a bounded pole.
::::
:::: idea
Frobenius makes $b_i^q$ and $b_i$ agree at rational points, so $F$ agrees there with the companion sum, which is zero. The power structure gives the multiplicity.
::::
:::: proof
Each $e_i^{p^\mu}$ has a pole of order at most $Ap^\mu$ at $P_0$ and each $b_i^q$ one of order at most $Bq$, with no other poles, so $F \in L((Ap^\mu + Bq)P_0)$. Since $q = p^\mu \cdot p^\mu$, we have $b_i^q = (b_i^{p^\mu})^{p^\mu}$, and $h \mapsto h^{p^\mu}$ respects sums, so $F = \bigl(\sum_i e_i b_i^{p^\mu}\bigr)^{p^\mu}$. Let $P \ne P_0$ be rational. All $e_i$ and $b_i$ are regular at $P$, and by [[eq-st-frobenius]] $b_i(P)^q = b_i(P)$. Hence
$$
F(P) = \sum_i e_i(P)^{p^\mu}\, b_i(P)^q = \sum_i e_i(P)^{p^\mu}\, b_i(P) = \Bigl(\sum_i e_i^{p^\mu} b_i\Bigr)(P) = 0.
$$
So $h = \sum_i e_i b_i^{p^\mu}$ satisfies $h(P)^{p^\mu} = F(P) = 0$, hence $h(P) = 0$, $\ord_P(h) \ge 1$, and $\ord_P(F) = p^\mu \ord_P(h) \ge p^\mu$.
::::
:::: used
Combined with [[t-st-nonzero]] and [[t-st-degree]] it gives the bound of [[t-st-upper]].
::::
:::::

The function $F$ might still be zero, and then the lemma says nothing. The next lemma excludes this when $A$ is small, by looking at pole orders at $P_0$.

::::: card {#t-st-nonzero kind="lemma" title="If $A<p^\mu$ and some $b_i$ is nonzero, then the auxiliary function is not zero" source="bombieri1974"}
:::: statement
Suppose $A < p^\mu$. If $b_1, \dots, b_r \in \FF_q(C)$ are not all zero, then $\sum_i e_i\, b_i^{p^\mu} \ne 0$, and therefore $F \ne 0$.
::::
:::: plain
The basis functions $e_i$ have different pole orders, all smaller than $p^\mu$, while $p^\mu$-th powers have pole orders divisible by $p^\mu$. The terms of the sum therefore have different pole orders and cannot cancel.
::::
:::: why
Without it the auxiliary function could vanish identically and bound nothing. It is the only place where the size of $A$ is restricted, and it is what forces $q$ to be a square.
::::
:::: idea
Look at the order of each term at $P_0$. Two integers $-n_i + p^\mu k$ and $-n_j + p^\mu k'$ with $0 \le n_i \ne n_j < p^\mu$ are never equal, so at most one term attains the smallest order, and a sum whose terms have distinct orders has the smallest of them as its order.
::::
:::: proof
Let $n_i$ be the pole order of $e_i$ at $P_0$, so $\ord_{P_0}(e_i) = -n_i$ with $0 \le n_i \le A < p^\mu$, and the $n_i$ are distinct. For $b_i \ne 0$, $\ord_{P_0}(e_i b_i^{p^\mu}) = -n_i + p^\mu \ord_{P_0}(b_i) \equiv -n_i \pmod{p^\mu}$. The nonzero terms therefore have pairwise distinct orders at $P_0$. For functions with distinct orders at a point, the order of the sum is the minimum of the orders, which is finite, so the sum is not zero. Then $F = (\sum_i e_i b_i^{p^\mu})^{p^\mu} \ne 0$.
::::
:::: used
Used in [[t-st-upper]] and in the twisted counts of [[t-st-lower]].
::::
:::::

It remains to find $b_i$, not all zero, with $\sum_i e_i^{p^\mu} b_i = 0$. This is linear algebra over $\FF_q$.

::::: card {#t-st-existence kind="lemma" title="When the product of the dimensions of $L(AP_0)$ and $L(BP_0)$ exceeds the dimension of $L((Ap^\mu+B)P_0)$, the auxiliary function exists" source="bombieri1974"}
:::: statement
If $\ell(A)\,\ell(B) > \ell(Ap^\mu + B)$, there are $b_1, \dots, b_r \in L(BP_0)$, not all zero, with $\sum_i e_i^{p^\mu} b_i = 0$.
::::
:::: plain
There are more unknown coefficients than conditions, so a nonzero solution exists.
::::
:::: why
This is where Riemann and Roch is used, and the inequality decides how large $q$ must be compared with $g$.
::::
:::: idea
The map $(b_1, \dots, b_r) \mapsto \sum_i e_i^{p^\mu} b_i$ is linear over $\FF_q$, from a space of dimension $\ell(A)\ell(B)$ into $L((Ap^\mu + B)P_0)$.
::::
:::: proof
For fixed $e_i$ the map $b \mapsto e_i^{p^\mu} b$ is $\FF_q$-linear, so $\Phi(b_1, \dots, b_r) = \sum_i e_i^{p^\mu} b_i$ is a linear map from $L(BP_0)^r$, of dimension $r\,\ell(B) = \ell(A)\ell(B)$, to $\FF_q(C)$. Each term has poles only at $P_0$, of order at most $Ap^\mu + B$, so $\Phi$ takes values in $L((Ap^\mu + B)P_0)$, of dimension $\ell(Ap^\mu + B)$. A linear map from a larger space to a smaller one has a nonzero kernel.
::::
:::: example
For $E: y^2 = x^3 + x + 1$ over $\FF_{25}$ (so $p = 5$, $\mu = 1$, $p^\mu = 5$, $g = 1$), take $A = 4$ and $B = 7$, with $e_1, \dots, e_4 = 1, x, y, x^2$ and $L(7P_\infty)$ spanned by $1, x, y, x^2, xy, x^3, x^2y$. There are $4 \cdot 7 = 28$ unknown coefficients, and $\Phi$ lands in $L(27P_\infty)$, of dimension $27$. Solving the $27 \times 28$ system over $\FF_{25}$ (we used $\FF_{25} = \FF_5(t)$ with $t^2 = 3$) gives a kernel of dimension exactly $1$. The system has coefficients in $\FF_5$, so the kernel is spanned by a solution with coefficients in $\FF_5$:
$$
b_1 = 2 + x + 2x^2 + x^3,\quad b_2 = 2x + 4x^2 + 3x^3,\quad b_3 = (3 + 4x^2)\,y,\quad b_4 = x.
$$
The identity $b_1 + x^5 b_2 + y^5 b_3 + x^{10} b_4 = 0$ holds in $\FF_5[x, y]/(y^2 - x^3 - x - 1)$: with $y^6 = (x^3 + x + 1)^3$ it becomes a polynomial identity in $x$ modulo 5, which we checked. The function $h = \sum_i e_i b_i^5$ is then a polynomial in $x$ alone of degree $19$, so its pole order at $P_\infty$ is $38 \le A + B\sqrt q = 39$, and it vanishes at all $26$ affine points of $E(\FF_{25})$, as [[t-st-vanishing]] predicts. The auxiliary function is $F = h^5$.
::::
:::: used
The inequality is checked for the chosen $A$ and $B$ in [[t-st-upper]].
::::
:::::

## The upper bound {#st-upper}

The three lemmas combine into a bound once $A$ and $B$ are chosen. The choice $A = \sqrt q - 1$ is the largest that [[t-st-nonzero]] allows, and $B = \sqrt q + 2g$ is the smallest that makes the dimension count work for large $q$.

::::: card {#t-st-upper kind="theorem" title="A curve of genus $g$ over a square field with $q>(g+1)^4$ has at most $q+1+(2g+1)\sqrt q$ rational points" source="bombieri1974"}
:::: statement
Let $C$ be a smooth projective curve of genus $g$ over $\FF_q$, with $q$ a square and $q > (g+1)^4$. Then
$$
N_1 \le q + (2g + 1)\sqrt q \;\le\; q + 1 + (2g+1)\sqrt q.
$$ {#eq-st-upper}
::::
:::: plain
On a curve of genus $g$ over a large enough field, the number of points exceeds $q$ by at most $2g + 1$ square roots of $q$.
::::
:::: why
This is the upper half of the Riemann Hypothesis for curves, with a constant $2g + 1$ instead of $2g$, which [[t-ff-rh-from-bound]] shows is good enough.
::::
:::: idea
The auxiliary function has a pole of order at most $A\sqrt q + Bq$ at $P_0$, and a zero of order at least $\sqrt q$ at each of the other $N_1 - 1$ rational points. Dividing by $\sqrt q$ gives $N_1 - 1 \le A + B\sqrt q$, which is about $q + 2g\sqrt q$.
::::
:::: proof
::: steps
1. Set the parameters $A = \sqrt q - 1$ and $B = \sqrt q + 2g$, so that $A < p^\mu = \sqrt q$, as [[t-st-nonzero]] requires. Both $B$ and $Ap^\mu + B$ are at least $2g - 1$, so [[t-st-rr]] gives their dimensions exactly, and $A + 1 - g = \sqrt q - g > 0$ because $\sqrt q > (g+1)^2$.
$$
A\sqrt q + B = q - \sqrt q + \sqrt q + 2g = q + 2g.
$$
2. Count dimensions with [[t-st-rr]]: $\ell(A) \ge A + 1 - g = \sqrt q - g$, $\ell(B) = B + 1 - g = \sqrt q + g + 1$, and $\ell(A\sqrt q + B) = q + g + 1$.
$$
\ell(A)\ell(B) - \ell(A\sqrt q + B) \ge (\sqrt q - g)(\sqrt q + g + 1) - (q + g + 1) = \sqrt q - (g+1)^2 > 0.
$$
3. By [[t-st-existence]] there are $b_i \in L(BP_0)$, not all zero, with $\sum_i e_i^{p^\mu}b_i = 0$. By [[t-st-nonzero]] the function $F$ of [[eq-st-F]] is not zero, and by [[t-st-vanishing]] it has order at least $\sqrt q$ at each of the $N_1 - 1$ rational points $P \ne P_0$ and a pole only at $P_0$, of order at most $A\sqrt q + Bq$.
$$
\sqrt q\,(N_1 - 1) \le \sum_{P \ne P_0} \ord_P(F) \le A\sqrt q + Bq,
$$
where the second inequality is [[t-st-degree]]: the zeros of $F$, counted with multiplicity, number at most its poles.
4. Divide by $\sqrt q$ and insert the parameters.
$$
N_1 \le 1 + A + B\sqrt q = 1 + (\sqrt q - 1) + (q + 2g\sqrt q) = q + (2g+1)\sqrt q.
$$
:::
::::
:::: example
For $E$ over $\FF_{25}$, $g = 1$ and $q = 25 > 16 = (g+1)^4$. The parameters are $A = 4$ and $B = 7$, as in the example of [[t-st-existence]], with $28 > 27$, and the bound is $N_1 \le 25 + 3 \cdot 5 = 40$. The true count is $27$, and Hasse's bound is $26 + 2\cdot 5 = 36$. At $q = 16$ the count gives $\ell(3)\ell(6) = 18$ against $\ell(18) = 18$, no strict inequality, and at $q = 9$ it gives $10$ against $11$: the method genuinely needs $\sqrt q > (g+1)^2$. Over $\FF_{25^n}$ the bound is $25^n + 3\cdot 5^n$, which is $q^n + O(q^{n/2})$, the shape the Riemann Hypothesis needs.
::::
:::: used
Applied over every field $\FF_{q^n}$ in [[t-st-rh-curves]], and to twisted counts in [[t-st-lower]].
::::
:::::

::: warning
The bound $N_1 \le q + (2g+1)\sqrt q$ is weaker than Weil's $q + 1 + 2g\sqrt q$ for a single field, and it says nothing when $q \le (g+1)^4$. Neither matters. The theorem is applied to $\FF_{q^n}$ for all large $n$, where both conditions hold, and [[t-ff-rh-from-bound]] converts any constant into the exact statement $\abs{\alpha_i} = \sqrt q$, from which Weil's bound for every $n$ follows.
:::

## The lower bound through a Galois cover {#st-lower}

An auxiliary function can only bound a count from above, because it shows that zeros cannot be too many. To bound $N_1$ from below, Bombieri counted the points that a curve misses and showed that they are themselves the rational points of other curves, to which the upper bound applies [@bombieri1974]. The hyperelliptic case shows the whole idea with no Galois theory.

::: example
Let $d \in \FF_q$ be a nonsquare and let $E'\colon d\,y^2 = f(x)$ be the quadratic twist of $E\colon y^2 = f(x)$, with $\deg f$ odd and $q$ odd. Each $x \in \FF_q$ with $f(x) = 0$ gives one point on each curve. Each $x$ with $f(x)$ a nonzero square gives two points on $E$ and none on $E'$, and each $x$ with $f(x)$ a nonsquare gives none on $E$ and two on $E'$, since then $f(x)/d$ is a square. With one point at infinity on each,
$$
N_1(E) + N_1(E') = 2q + 2.
$$
So the upper bound for $E'$ is a lower bound for $E$: $N_1(E) \ge 2q + 2 - \bigl(q + (2g+1)\sqrt q\bigr) = q + 2 - (2g+1)\sqrt q$. For $y^2 = x^3 + x + 1$ over $\FF_5$ the twist $2y^2 = x^3 + x + 1$ has $3$ points and $9 + 3 = 12$, and over $\FF_7$ the twist $3y^2 = x^3 + x + 1$ has $11$ points and $5 + 11 = 16$.
:::

In the language of Frobenius the twist counts points $P$ of $E$ over $\overline{\FF}_q$ with $\Frob(P) = \iota(P)$, where $\iota(x, y) = (x, -y)$: such a point has $x \in \FF_q$ and $y^q = -y$, so $y \notin \FF_q$ unless $y = 0$, while $y^2 = f(x) \in \FF_q$. The two curves share the map $x$ to the projective line, whose group of symmetries is $\{1, \iota\}$, and every rational point of the line lifts to points fixed by either $\Frob$ or $\iota^{-1}\Frob$. The general argument replaces $\{1, \iota\}$ by the Galois group of a cover.

::: definition {#d-st-twisted title="Twisted point count"}
Let $C'$ be a curve over $\FF_q$ and $\sigma$ an automorphism of $C'$ defined over $\FF_q$, so that $\sigma$ commutes with $\Frob$. The twisted count is
$$
N_\sigma = \#\{P \in C'(\overline{\FF}_q) : \Frob(P) = \sigma(P)\}.
$$
For $\sigma = 1$ it is $N_1(C')$. It is a count of points of $C'$ over $\overline{\FF}_q$, not of points over $\FF_q$, and it is the number of rational points of the twist of $C'$ by $\sigma$, a curve of the same genus.
:::

::::: card {#t-st-twisted kind="lemma" title="Every twisted count obeys the same upper bound as the curve itself, up to one extra point" source="bombieri1974"}
:::: statement
Let $C'$ have genus $g'$ and a point $P_0 \in C'(\FF_q)$, with $q$ a square and $q > (g'+1)^4$. For every automorphism $\sigma$ of $C'$ defined over $\FF_q$,
$$
N_\sigma \le q + 1 + (2g'+1)\sqrt q.
$$
::::
:::: plain
Points that Frobenius moves by a symmetry instead of fixing are no more numerous than the fixed ones could be.
::::
:::: why
The lower bound for $C$ subtracts these counts from a total, so each needs an upper bound of the same quality.
::::
:::: idea
Run the same argument with $b_i \circ \sigma$ in place of $b_i$ in the companion sum. At a point with $\Frob(P) = \sigma(P)$, [[eq-st-frobenius]] gives $b_i(P)^q = b_i(\sigma P)$, which is what the companion sum evaluates.
::::
:::: proof
Take $e_i$, $A$, $B$ as in [[t-st-upper]], and replace the companion condition by $G_\sigma = \sum_i e_i^{p^\mu}\,(b_i\circ\sigma) = 0$. The point $\sigma^{-1}(P_0)$ is rational because $\sigma$ commutes with $\Frob$, so $G_\sigma$ lies in $L(D)$ with $D = Ap^\mu P_0 + B\,\sigma^{-1}(P_0)$, a divisor over $\FF_q$ of degree $Ap^\mu + B$, and the dimension count of [[t-st-upper]] goes through unchanged. If $\Frob(P) = \sigma(P)$ and $P \ne P_0$, $\sigma(P) \ne P_0$, then $F(P) = \sum_i e_i(P)^{p^\mu}b_i(\sigma P) = G_\sigma(P) = 0$, and $F \ne 0$ by [[t-st-nonzero]], which does not involve $\sigma$. Counting zeros as before, with at most two excluded points, gives $N_\sigma \le 2 + A + B\sqrt q = q + 1 + (2g'+1)\sqrt q$.
::::
:::: used
Used in [[t-st-lower]].
::::
:::::

::::: card {#t-st-lower kind="theorem" title="A curve has at least $q$ minus a constant times $\sqrt q$ rational points, by counting the points that its Galois twists catch" source="bombieri1974"}
:::: statement
Let $C$ be a smooth projective curve over $\FF_q$ and $x\colon C \to \mathbb P^1$ a nonconstant separable function of degree $d$. Let $C' \to \mathbb P^1$ be the Galois closure, with group $G$, and $H \subseteq G$ the subgroup with $C = C'/H$, so $d = \abs G/\abs H$. Assume $\FF_q$ is algebraically closed in the function field of $C'$, that $C'$ has a rational point, and that $q$ is a square with $q > (g'+1)^4$, where $g'$ is the genus of $C'$. If $r$ is the number of branch points of $C' \to \mathbb P^1$ over $\overline{\FF}_q$, then
$$
N_1(C) \ge q + 1 - d\,r - (d - 1)(2g'+1)\sqrt q.
$$
::::
:::: plain
Every rational point of the line has rational points above it on exactly one of several twisted copies of the curve. The copies together have as many points as they should, and each copy has at most its share plus a square root, so no copy, including $C$ itself, can have much less than its share.
::::
:::: why
The upper bound alone cannot locate the zeros. The lower bound, with any constant, completes the two-sided estimate that [[t-ff-rh-from-bound]] needs.
::::
:::: idea
Over an unramified rational point $t$ of the line, the $\abs G$ points of $C'$ form one orbit of $G$, and $\Frob$ maps the orbit to itself, so it acts on each point as some $\sigma \in G$. Summing $N_\sigma$ over all $\sigma \in G$ counts the line's points $\abs G$ times, while the sum over $\sigma \in H$ counts the points of $C$ at most $\abs H$ times. Subtract.
::::
:::: proof {collapsed}
Write $\pi\colon C' \to \mathbb P^1$ and $\varrho\colon C' \to C$ for the quotient maps, both defined over $\FF_q$, with $\pi\circ\sigma = \pi$ for $\sigma \in G$ and $\varrho\circ\sigma = \varrho$ for $\sigma \in H$.

::: steps
1. The sum over $G$ counts the line. Let $t \in \mathbb P^1(\FF_q)$ not be a branch point. Its fiber $\pi^{-1}(t)$ has $\abs G$ points permuted simply transitively by $G$, and $\Frob$ preserves it because $\pi(\Frob P) = \Frob(\pi P) = t$. So each $P$ in the fiber satisfies $\Frob(P) = \sigma(P)$ for exactly one $\sigma \in G$, and the fiber contributes exactly $\abs G$ to the sum below. At most $r$ rational points of the line are branch points.
$$
\sum_{\sigma \in G} N_\sigma \ge \abs G\,(q + 1 - r).
$$
2. The sum over $H$ counts $C$. If $\Frob(P) = \sigma(P)$ with $\sigma \in H$, then $Q = \varrho(P)$ satisfies $\Frob(Q) = \varrho(\sigma P) = Q$, so $Q \in C(\FF_q)$. The fiber $\varrho^{-1}(Q)$ is one $H$-orbit, and for $P$ in it the set of $\sigma \in H$ with $\Frob(P) = \sigma(P)$ is empty or a coset of the stabilizer of $P$. Since the fiber size times the stabilizer size is $\abs H$, each $Q$ contributes at most $\abs H$.
$$
\sum_{\sigma \in H} N_\sigma \le \abs H\, N_1(C).
$$
3. The other twists are bounded above. By [[t-st-twisted]], $N_\sigma \le q + 1 + (2g'+1)\sqrt q$ for each of the $\abs G - \abs H$ elements $\sigma \notin H$. Combining with steps 1 and 2,
$$
\abs H\, N_1(C) \ge \abs G(q + 1 - r) - (\abs G - \abs H)\bigl(q + 1 + (2g'+1)\sqrt q\bigr).
$$
4. Divide by $\abs H$ and use $d = \abs G/\abs H$.
$$
N_1(C) \ge q + 1 - d\,r - (d-1)(2g'+1)\sqrt q.
$$
:::

For $y^2 = f(x)$ and the function $x$, $C' = C$, $G = \{1, \iota\}$, $H = \{1\}$, and $d = 2$, and step 1 holds with equality including the ramified points, which gives the exact identity of the example above.
::::
:::: used
Used in [[t-st-rh-curves]].
::::
:::::

::: figure {#f-st-twist viz="twist-split" height="420"}
Each value of x feeds its points either to the curve or to its twist, never to both unless f(x) is zero, so the two counts always add up to 2q + 2.

```vizspec
Purpose: show the partition behind Bombieri's lower bound in the hyperelliptic case.
Scene: a row of p columns, one per x in F_p (x = 0..p-1), each labeled with f(x) mod p for
  f(x) = x^3 + a x + b. Above the row, the curve E: y^2 = f(x); below it, the twist E': d y^2 = f(x)
  with d the least nonsquare mod p. In column x draw two gold dots above if f(x) is a nonzero square,
  two teal dots below if it is a nonsquare, one dot above and one below (rings) if f(x) = 0. A final
  column "infinity" with one dot above and one below.
  To the right, two stacked bars: N(E) gold and N(E') teal, summing to a fixed outline of height 2p + 2,
  with the Hasse interval [p + 1 - 2 sqrt(p), p + 1 + 2 sqrt(p)] shaded blue on each.
Controls: p selector over primes 5..61; sliders a, b over 0..p-1; when 4a^3 + 27b^2 = 0 mod p show
  "singular" in red.
Motion: changing a or b moves dots between the top and bottom rows with a 250 ms slide; the bars trade
  height while their sum stays 2p + 2.
Reader takeaway: an upper bound for the twist is a lower bound for the curve, because what one misses
  the other catches.
Check: p = 5, (a, b) = (1, 1), d = 2: N(E) = 9, N(E') = 3. p = 7, d = 3: N(E) = 5, N(E') = 11.
```
:::

## From the bounds to the zeros {#st-zeros}

The two bounds hold over every large enough field, and [[t-ff-rh-from-bound]] turns them into the statement about zeros.

::::: card {#t-st-rh-curves kind="theorem" title="Every inverse root of the zeta function of a curve over $\FF_q$ has absolute value $\sqrt q$" source="weil1948"}
:::: statement
For every smooth projective curve $C$ of genus $g$ over $\FF_q$, the inverse roots of $Z(C, u)$ satisfy $\abs{\alpha_i} = \sqrt q$, and $\abs{N_n - q^n - 1} \le 2g\,q^{n/2}$ for every $n \ge 1$.
::::
:::: plain
The Riemann Hypothesis holds for every curve over every finite field.
::::
:::: why
This is the statement [[t-ff-rh-curves]] announced, now with a complete proof that uses only linear algebra on the curve, Frobenius, and the Riemann and Roch count.
::::
:::: idea
Pass to a field $\FF_{q^{n_0}}$ over which every hypothesis of the two bounds holds, apply them over all its extensions, and let [[t-ff-rh-from-bound]] convert the two-sided bound into the location of the inverse roots.
::::
:::: proof
::: steps
1. Choose a separating function $x$ on $C$ (one exists because $\FF_q$ is perfect), and let $C'$ be the Galois closure of $C \to \mathbb P^1$, with genus $g'$. Its field of constants is a finite extension $\FF_{q^{k}}$, and $C'$ has a point over some $\FF_{q^{j}}$. Let $n_0$ be a common multiple of $2$, $k$, and $j$. Over $\FF_{q^{n_0 m}}$ for every $m \ge 1$, the field size is a square, $C'$ is a curve with a rational point and constant field the base field, and for $m \ge m_0$ the size exceeds $(g'+1)^4 \ge (g+1)^4$.
$$
Q_m = q^{n_0 m}, \qquad \sqrt{Q_m} = q^{n_0 m/2}.
$$
2. Over $\FF_{Q_m}$, [[t-st-upper]] (which holds trivially if $C$ has no rational point there) and [[t-st-lower]] give, for $m \ge m_0$,
$$
-d\,r - (d-1)(2g'+1)\sqrt{Q_m} \le N_{n_0 m} - Q_m - 1 \le (2g+1)\sqrt{Q_m}.
$$
3. Hence $\abs{N_{n_0 m} - Q_m - 1} \le c\,Q_m^{1/2}$ for a constant $c$ and all $m \ge m_0$. By [[eq-ff-explicit]], $N_{n_0 m} = Q_m + 1 - \sum_i (\alpha_i^{n_0})^m$, so the numbers $\beta_i = \alpha_i^{n_0}$ are the inverse roots of $C$ over $\FF_{q^{n_0}}$, and they satisfy the functional equation with $q^{n_0}$ in place of $q$. By [[t-ff-rh-from-bound]] applied over $\FF_{q^{n_0}}$, $\abs{\alpha_i^{n_0}} = q^{n_0/2}$.
$$
\abs{\alpha_i} = \sqrt q.
$$
4. The bound $\abs{N_n - q^n - 1} = \abs{\sum_i \alpha_i^n} \le 2g\,q^{n/2}$ follows from the triangle inequality.
:::
::::
:::: used
This completes [[t-ff-rh-curves]]. Part IV adapts the shape of the argument to the integers.
::::
:::::

::: aside
Weil's own proofs of 1948 went differently, and they connect this chapter to [[weil-positivity]]. In the first, the graph $\Gamma$ of Frobenius and the diagonal $\Delta$ are curves on the surface $C \times C$, their intersection number $\Gamma\cdot\Delta$ is $N_1$, and the Castelnuovo and Severi inequality, a positivity statement for intersection numbers on a surface, applied to combinations $a\Gamma + b\Delta$, makes a certain quadratic form in $a$ and $b$ nonnegative. Its discriminant condition is exactly $\abs{N_1 - q - 1} \le 2g\sqrt q$ [@weil1948; @hartshorne1977, ch. V, ex. 1.10]. The second proof uses the positivity of the Rosati involution on endomorphisms of the Jacobian. In both, the Riemann Hypothesis for curves is the nonnegativity of a quadratic form, which is the shape of [[t-wp-criterion]]. Stepanov's method avoids the surface entirely and bounds the counts directly, which is why it, and not Weil's geometry, is the model for an argument over the integers, where no surface $\mathrm{Spec}\,\ZZ \times \mathrm{Spec}\,\ZZ$ with the needed intersection theory is known.
:::

## What the proof used {#st-used}

Four ingredients did the work. For each, the integers offer something and lack something. The note behind the second proof of 2026 names integer substitutes for some of them, and this section records the ingredients in the vocabulary Part IV uses. The comparisons with the integers below are our reading except where the note is quoted.

**Frobenius.** The identity $h(P)^q = h(\Frob P)$ turned "the coordinates of $P$ lie in $\FF_q$" into the algebraic statement $b^q = b$ at $P$, which a function can be built to exploit. The integers have no such map. The only ring endomorphism of $\ZZ$ is the identity, and modulo a prime $p$ the Frobenius $a \mapsto a^p$ is the identity of $\FF_p$ by Fermat's theorem, so it cuts out nothing. In [[weil-positivity]] the absence appears as the missing operator of the Hilbert and Polya idea: over a curve the zeros are eigenvalues of Frobenius, and over $\ZZ$ there is no known operator with the zeros as spectrum.

**Derivatives and $p$-th powers.** Vanishing to order $m$ was free, because a $p^\mu$-th power that vanishes at a point vanishes there to order $p^\mu$, and in Stepanov's elementary version because $x^{jp}$ is invisible to derivatives of order below $p$. Over the integers the natural notion of "vanishing to order $m$ at $p$" is divisibility by $p^m$, and there is no derivative to detect it: every additive map $\delta\colon\ZZ\to\ZZ$ with $\delta(ab) = a\delta(b) + b\delta(a)$ is zero, because $\delta(1) = \delta(1\cdot 1) = 2\delta(1)$ forces $\delta(1) = 0$ and then $\delta(n) = n\delta(1) = 0$. The note behind the second proof describes the difficulty in these terms, saying that over the integers multiplicity corresponds to "something like differentiating whole numbers" [@alpoge-note]. One partial substitute is Buium's theory of arithmetic derivatives, in which the Fermat quotient $n \mapsto (n - n^p)/p$ plays the role of a derivative with respect to $p$ [@buium2005]. The note takes a different route, a chain of theta lifts, "each mimicking multiplicity", with about $\sqrt X$ lifts for the von Mangoldt sum of length $X$ [@alpoge-note]. Part IV describes it.

**Riemann and Roch.** The count $\ell(D) = \deg D + 1 - g$ guaranteed that unknowns outnumbered equations. Over the integers, "functions with bounded poles" become integers or lattice vectors of bounded size, and the count becomes a count of lattice points. Its standard form for linear systems is Siegel's lemma: a system of $M$ linear equations in $K > M$ unknowns with integer coefficients of absolute value at most $H$ has a nonzero integer solution with every entry at most $(KH)^{M/(K-M)}$ in absolute value [@siegel1929]. Arakelov geometry refines such counts into an arithmetic Riemann and Roch theory, and one of its tools, Bost's slope inequality, appears in the timeline of the second proof [@bost1996; @alpoge-note].

**The Galois trick.** The lower bound came from summing over twists: the twisted counts $N_\sigma$ over all $\sigma \in G$ add up to a known total, so upper bounds for all but one give a lower bound for the last. Over the integers the analog of summing over twists is summing over characters, as in the orthogonality relation for Dirichlet characters in [[what-rh-says]], which recovers primes in one progression from sums over all characters. This analogy is ours.

The method can also be phrased with determinants, the form in which the integer version is built. Choose points $P_1, \dots, P_K$ and functions $\varphi_1, \dots, \varphi_K$, and form the $K\times K$ matrix $\bigl(\varphi_j(P_i)\bigr)$. Its determinant $\Delta$ vanishes exactly when some nonzero combination $\sum_j c_j\varphi_j$ vanishes at every $P_i$, that is, exactly when an auxiliary function through the points exists. Here each point imposes one condition, vanishing, and we say the argument has multiplicity one. To demand vanishing to order $m$, each point contributes $m$ rows, its value and $m - 1$ derivatives (or, in characteristic $p$, the condition is absorbed by $p$-th powers as above), and the argument has multiplicity $m$. Stepanov's gain is entirely in the multiplicity: with multiplicity one the same count only shows that $N_1$ is at most the degree of an auxiliary function, which gives nothing better than the trivial bound.

Over $\ZZ$, with integer points and integer-valued $\varphi_j$, the determinant $\Delta$ is an integer, and a nonzero integer has absolute value at least $1$. So if one can show that $\Delta$ is divisible by a large power $p^e$ (because the points agree modulo $p$, which is the arithmetic form of high multiplicity) and also that $\abs\Delta < p^e$ (an analytic size estimate), then $\Delta = 0$ and the auxiliary function exists. This is the determinant method of Bombieri and Pila, in its real form, and of Heath-Brown, in its $p$-adic form [@bombieri1989; @heathbrown2002]. The timeline in the note behind the second proof lists a "Stepanov determinant" as its first item, and it describes a step that proves "$W(1_S) \ge 0$ via a determinant", with $W$ Weil's functional of [[weil-positivity]] and $1_S$ the indicator of a set $S$, as "Stepanov with multiplicity one again" [@alpoge-note]. In the terms of this section, and as our reading rather than the note's words, the first is an auxiliary-function determinant of the kind just described, and the second is an argument of this shape in which each point imposes a single condition.

::: symbols
| Symbol | What it is | Kind | Where it lives |
| --- | --- | --- | --- |
| $\ord_P(h)$ | order of vanishing of $h$ at $P$ | integer | [[d-st-order]] |
| $\FF_q(C)$ | function field of $C$ | field | [[st-riemann-roch]] |
| $L(D)$, $\ell(D)$ | functions with poles bounded by $D$, and its dimension | vector space, integer | [[d-st-L]] |
| $P_0$ | a fixed rational point | point of $C$ | [[st-auxiliary]] |
| $p^\mu$ | $\sqrt q$, with $q = p^{2\mu}$ | integer | [[st-auxiliary]] |
| $A$, $B$ | pole bounds of the $e_i$ and $b_i$ | integers | [[t-st-upper]] |
| $e_i$, $b_i$, $F$ | basis of $L(AP_0)$, unknowns, auxiliary function | functions on $C$ | [[eq-st-F]] |
| $N_\sigma$ | twisted count | integer | [[d-st-twisted]] |
| $G$, $H$, $d$, $r$ | Galois group, subgroup, degree, branch points | group, integers | [[t-st-lower]] |
:::

::: recap
- An auxiliary function that vanishes to order $m$ at $N$ points and has degree, or pole order, $D$ forces $mN \le D$ ([[t-st-roots]], [[t-st-degree]]).
- Frobenius makes rational points satisfy $b^q = b$, and $p$-th powers make vanishing automatically deep ([[t-st-vanishing]]), pole orders at $P_0$ keep $F$ nonzero ([[t-st-nonzero]]), and Riemann and Roch gives enough unknowns ([[t-st-existence]]).
- With $A = \sqrt q - 1$ and $B = \sqrt q + 2g$, the bound is $N_1 \le q + (2g+1)\sqrt q$ for square $q > (g+1)^4$ ([[t-st-upper]]).
- Twisted counts over a Galois cover give the lower bound ([[t-st-lower]]), and [[t-ff-rh-from-bound]] turns the two-sided bound into $\abs{\alpha_i} = \sqrt q$ ([[t-st-rh-curves]]).
- The integers lack a Frobenius and a derivative, and offer Siegel's lemma for Riemann and Roch and characters for twists. Over $\ZZ$ an auxiliary determinant is an integer, which vanishes once it is divisible by a large prime power yet smaller than it. Parts III and IV take it from here.
:::
