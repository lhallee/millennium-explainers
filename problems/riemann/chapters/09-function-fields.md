---
id: function-fields
title: "The world where it was already true: curves over finite fields"
part: 2
summary: Read the zeta function of a curve over a finite field, see its zeros as the eigenvalues of Frobenius, and state the Riemann Hypothesis for curves as a square-root bound on point counts.
needs: [counting-primes, euler-product, explicit-formula, what-rh-says, weil-positivity]
---

::: plain
Replace whole numbers by polynomials whose coefficients come from a finite field, and the theory of prime numbers acquires an exact copy in which irreducible polynomials play the primes. In that copy, and in its geometric extension to curves, the Riemann Hypothesis has been a theorem since the 1940s: the number of solutions of an equation over a finite field differs from its expected value by at most a fixed multiple of a square root. The reason is a map called Frobenius, whose fixed points are the solutions being counted and whose eigenvalues are the zeros.
:::

One of the two proofs of 2026 descends from a proof of this function-field theorem, Stepanov's, and [[stepanov]] gives that proof in full. Before it can be read, the reader needs the objects it counts (curves, their points over the fields $\FF_{q^n}$, and the zeta function that packages those counts) and the precise sense in which a bound on point counts is the Riemann Hypothesis. The chapter also makes concrete what the integers lack, because over a finite field the explicit formula of [[weil-positivity]] becomes a finite identity with an actual operator behind it.

Throughout this chapter and the next, $q$ is a power of a prime $p$ and not a modulus.

## Integers and polynomials {#ff-dictionary}

The ring $\FF_q[T]$ of polynomials in one variable $T$ with coefficients in the finite field $\FF_q$ shares with $\ZZ$ the property that elementary number theory runs on, division with remainder: for $f$ and a nonzero $g$ there are unique $a$ and $r$ with $f = ag + r$ and $\deg r < \deg g$. Euclid's algorithm and unique factorization then follow word for word as they do for integers. The units of $\FF_q[T]$ are the $q-1$ nonzero constants, which play the role of $\pm 1$, and just as one picks the positive representative of $\pm n$, one picks the monic representative (leading coefficient $1$) of each polynomial up to a constant factor.

The size of a polynomial is chosen so that it counts residues. The quotient $\ZZ/n\ZZ$ has $n$ elements and the quotient $\FF_q[T]/(f)$ has $q^{\deg f}$ elements, one for each remainder of degree below $\deg f$, so we set
$$
\abs{f} = q^{\deg f}.
$$
With this size the two worlds line up entry by entry, and $\deg f$, the logarithm of $\abs{f}$ to base $q$, plays the part of $\log n$.

| Integers | Polynomials over $\FF_q$ |
| --- | --- |
| $\ZZ$ | $\FF_q[T]$ |
| positive integer $n$ | monic polynomial $f$ |
| size $n = \#(\ZZ/n\ZZ)$ | size $\abs{f} = q^{\deg f} = \#(\FF_q[T]/(f))$ |
| about $X$ integers of size at most $X$ | exactly $q^n$ monic polynomials of degree $n$ |
| prime $p$ | monic irreducible polynomial $P$ |
| unique factorization | unique factorization |
| $\log n$ | $\deg f$ |
| Chebyshev's budget $\log n = \sum_p v_p(n)\log p$ ([[eq-cp-budget]]) | $\deg f = \sum_P v_P(f)\deg P$: irreducible factors weighted by degree |
| prime power $p^k$ as a periodic orbit of length $\log p^k$ ([[wp-trace]]) | prime of degree $d$ as a Frobenius orbit of length $d$ ([[ff-refresher]]) |
| $\zeta(s) = \sum_{n} n^{-s} = \prod_p (1-p^{-s})^{-1}$ | $\zeta_{\FF_q[T]}(s) = \sum_{f} \abs{f}^{-s} = \prod_P (1-\abs{P}^{-s})^{-1}$ |
| $\psi(x) = x - \sum_\rho x^\rho/\rho - \cdots$ | $\sum_{d \mid n} d\, I_d = q^n$ exactly |
| $\pi(x) \approx \Li(x)$ | $I_n \approx q^n/n$ |

Here $v_P(f)$ is the exponent of $P$ in the factorization of $f$, and $I_n$ is the number of monic irreducible
polynomials of degree $n$, the counting function this chapter is about. The two proofs of 2026 use different rows of
this table. The second descends from Stepanov's proof, which turns the budget row against a set of points (chapter
[[stepanov]]); the first builds the orbit row over the integers, as circles of length $\log p$ (chapter
[[primes-as-circles]]). The zeta function in the table is a one-line computation. There are $q^n$ monic polynomials of degree $n$, since the $n$ lower coefficients are free, and each has size $q^n$, so for $\Re s > 1$
$$
\zeta_{\FF_q[T]}(s) = \sum_{n \ge 0} q^n \cdot q^{-ns} = \frac{1}{1 - q^{1-s}},
$$ {#eq-ff-zeta-poly}
and unique factorization gives the Euler product exactly as in [[euler-product]]. Because $s$ enters only through $q^{-s}$, we write $u = q^{-s}$, and the function becomes $1/(1 - qu)$.

The function $1/(1-q^{1-s})$ has a pole at $s = 1$, repeated at $s = 1 + 2\pi i k/\log q$ because it is periodic in the imaginary direction, and it has no zeros at all. In the language of [[explicit-formula]], the prime count of $\FF_q[T]$ should then have a main term from the pole and no oscillating terms, and the next two sections confirm this by counting directly.

## A finite-field refresher {#ff-refresher}

The counts in this chapter rest on four facts about finite fields, recalled here with a source.

::: recall
For each prime power $q$ there is a field $\FF_q$ with $q$ elements, unique up to isomorphism, and every finite field has prime-power order. Its multiplicative group $\FF_q^\times$ is cyclic of order $q - 1$, so every $a \in \FF_q$ satisfies $a^q = a$. Inside an algebraic closure $\overline{\FF}_q$ the field $\FF_q$ is therefore exactly the set of roots of $T^q - T$, a polynomial of degree $q$ with $q$ roots [@lidl1997, ch. 2].
:::

::: recall
In characteristic $p$ the binomial theorem collapses to $(a + b)^p = a^p + b^p$, because every binomial coefficient $\binom{p}{k}$ with $0 < k < p$ is divisible by $p$. So the map $a \mapsto a^q$ respects sums and products. On $\overline{\FF}_q$ it is a field automorphism, the Frobenius, and by the previous recall its fixed points are exactly the elements of $\FF_q$ [@lidl1997, ch. 2].
:::

::: recall
The finite fields containing $\FF_q$ form a tower. The field $\FF_{q^n}$ is the set of roots of $T^{q^n} - T$ in $\overline{\FF}_q$, it contains $\FF_{q^m}$ exactly when $m$ divides $n$, and its automorphisms fixing $\FF_q$ form a cyclic group of order $n$ generated by Frobenius $a \mapsto a^q$ [@lidl1997, ch. 2].
:::

::: recall
An irreducible polynomial $P$ of degree $d$ over $\FF_q$ has $d$ distinct roots, all in $\FF_{q^d}$, and Frobenius permutes them in a single cycle $a, a^q, a^{q^2}, \dots, a^{q^{d-1}}$. Conversely every $a \in \overline{\FF}_q$ is a root of exactly one monic irreducible $P$ over $\FF_q$, its minimal polynomial, whose degree is the length of the Frobenius orbit of $a$ [@lidl1997, ch. 3].
:::

The last recall is the bridge between algebra and counting: a monic irreducible polynomial of degree $d$ is the same thing as a Frobenius orbit of length $d$ in $\overline{\FF}_q$. Counting primes of degree $d$ becomes counting orbits of a permutation.

## The prime polynomial theorem {#ff-ppt}

The count we want is $I_n$, and the claim is that it is $q^n/n$ with an error of size $q^{n/2}/n$, the exact analog of $\pi(x) = \Li(x) + O(\sqrt{x}\log x)$. Here the statement is an identity, not an estimate, and it comes from factoring one polynomial.

::::: card {#t-ff-ppt kind="theorem" title="Monic irreducible polynomials of degree $n$ number $q^n/n$, with an error below a square root" source="lidl1997"}
:::: statement
For every prime power $q$ and every $n \ge 1$, the numbers $I_d$ of monic irreducible polynomials of degree $d$ in $\FF_q[T]$ satisfy
$$
\sum_{d \mid n} d\, I_d = q^n,
$$ {#eq-ff-ppt-psi}
and therefore
$$
I_n = \frac{1}{n}\sum_{d \mid n} \mu(d)\, q^{n/d}, \qquad \Bigl| I_n - \frac{q^n}{n} \Bigr| < \frac{2\, q^{n/2}}{n}.
$$ {#eq-ff-ppt}
::::
:::: plain
Out of the $q^n$ monic polynomials of degree $n$, a fraction of almost exactly $1/n$ cannot be factored, just as a fraction of about $1/\log x$ of the integers near $x$ are prime. The count misses $q^n/n$ by less than twice the square root of $q^n$, divided by $n$.
::::
:::: why
This is the Riemann Hypothesis for $\FF_q[T]$, in its strongest form and with an elementary proof. It sets the scale every later statement is measured against: the error term of a prime count in a function field is a power of $q^{1/2}$, and the question for curves will be whether that stays true when zeros appear.
::::
:::: idea
Every element of $\FF_{q^n}$ is a root of $T^{q^n} - T$, and every root has a minimal polynomial whose degree divides $n$. So that one polynomial is the product of all monic irreducibles of degree dividing $n$, and comparing degrees gives the identity. The left side of [[eq-ff-ppt-psi]] is the polynomial analog of $\psi$: a prime $P$ of degree $d$ is counted with weight $d$, which is its logarithmic size, once for each power $P^k$ of degree dividing $n$.
::::
:::: proof {collapsed}
1. The polynomial $T^{q^n} - T$ has no repeated root, because its derivative is $q^n T^{q^n - 1} - 1 = -1$ in characteristic $p$, which shares no root with it. By the third recall its $q^n$ roots are exactly the elements of $\FF_{q^n}$.
2. Let $a \in \FF_{q^n}$ have minimal polynomial $P$ of degree $d$. The field $\FF_q(a)$ has $q^d$ elements and sits inside $\FF_{q^n}$, so $d$ divides $n$. Conversely, if $P$ is monic irreducible of degree $d$ dividing $n$, its roots lie in $\FF_{q^d} \subseteq \FF_{q^n}$, so $P$ divides $T^{q^n} - T$.
3. Distinct monic irreducibles have disjoint sets of roots, so steps 1 and 2 give
$$
T^{q^n} - T = \prod_{d \mid n}\ \prod_{\deg P = d} P(T).
$$
Comparing degrees on the two sides gives $q^n = \sum_{d \mid n} d\, I_d$.
4. Moebius inversion turns $G(n) = \sum_{d \mid n} g(d)$ into $g(n) = \sum_{d \mid n} \mu(d) G(n/d)$. With $g(d) = d I_d$ and $G(n) = q^n$ this is the formula for $I_n$.
5. In $n I_n - q^n = \sum_{d \mid n,\, d \ge 2} \mu(d) q^{n/d}$ every exponent $n/d$ is an integer at most $n/2$, so with $m = \lfloor n/2 \rfloor$
$$
\bigl| n I_n - q^n \bigr| \le \sum_{k=1}^{m} q^k < \frac{q^{m+1}}{q-1} \le 2 q^m \le 2 q^{n/2},
$$
using $q/(q-1) \le 2$. Dividing by $n$ gives the bound.
::::
:::: example
For $q = 2$ the formula gives the following counts, which agree with a brute-force factorization of all $2^n$ monic polynomials for $n \le 6$ (and, for $q = 3$, of all $3^n$ for $n \le 4$).

| $n$ | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| $I_n$ | 2 | 1 | 2 | 3 | 6 | 9 | 18 | 30 | 56 | 99 | 186 | 335 |
| $2^n/n$ | 2.00 | 2.00 | 2.67 | 4.00 | 6.40 | 10.67 | 18.29 | 32.00 | 56.89 | 102.40 | 186.18 | 341.33 |
| $2 \cdot 2^{n/2}/n$ | 2.83 | 2.00 | 1.89 | 2.00 | 2.26 | 2.67 | 3.23 | 4.00 | 5.03 | 6.40 | 8.23 | 10.67 |

At $n = 12$ the error is $335 - 341.33 = -6.33$, inside the bound $10.67$. The single irreducible of degree 2 is $T^2 + T + 1$, and the two of degree 3 are $T^3 + T + 1$ and $T^3 + T^2 + 1$.
::::
:::: used
The same identity reappears in [[ff-zeta]] as the point count $q^n + 1$ of the projective line, and its error structure is the template for [[t-ff-rh-curves]].
::::
:::::

The error in [[eq-ff-ppt]] does not come from zeros, since $\zeta_{\FF_q[T]}$ has none. It comes from the terms with $d \ge 2$, whose largest member, $-q^{n/2}$ for even $n$, accounts for the squares: by [[eq-ff-ppt-psi]] for $n/2$, its leading part is $\tfrac n2 I_{n/2}$, the number of squares $P^2$ of degree $n$ weighted by $\deg P$. This is the same $\sqrt{x}$ that separates $\psi(x)$ from $\sum_{p \le x} \log p$ in [[counting-primes]]. For $\FF_q[T]$ the Riemann Hypothesis is true for the trivial reason that there is nothing for it to constrain, and the theorem worth having concerns objects whose zeta functions do have zeros.

::: aside
Two remarks show where those objects come from. First, $\FF_q[T]$ omits one prime, the place at infinity, which measures a polynomial by its degree as the real absolute value measures an integer by its size. Adding its Euler factor $(1-u)^{-1}$ turns $1/(1-qu)$ into $1/((1-u)(1-qu))$, the zeta function of the projective line computed below, and only after this completion does a functional equation hold, just as $\zeta(s)$ acquires one only after the Gamma factor of [[zeta-continued]] is attached. Second, the ring $\FF_q[T]$ is the ring of functions on the line, and replacing the line by a curve of higher genus replaces $\FF_q[T]$ by a ring without unique factorization of elements, whose zeta function has $2g$ zeros.
:::

::: figure {#f-ff-sieve viz="poly-sieve" height="440"}
The sieve that finds the primes among integers finds the irreducible polynomials among polynomials, and the polynomial count sits within a square root of its main term at every degree.

```vizspec
Purpose: show the integer sieve and the polynomial sieve side by side, then compare the polynomial count I_n
  with q^n/n and the square-root band.
Scene: two panels side by side (stacked below 700 px width).
  Left panel "integers": the numbers 2..120 in a grid of 12 columns. A sieve pass for each prime p in
  order: p turns gold, its proper multiples fade to muted.
  Right panel "polynomials over F_q": all monic polynomials of degree 1..d_max in rows by degree, each drawn
  as a small chip labeled by its coefficient string (for q = 2, "1011" means T^3 + T + 1). Sieve pass for
  each irreducible P in order of degree: P turns gold, every product P*g with g monic of degree >= 1 and
  total degree <= d_max fades. Products must be computed by polynomial multiplication mod q.
  Under the right panel a bar chart: for n = 1..n_max, a gold bar of height I_n (counted chips that stayed
  gold), a blue tick at q^n/n, and a pale blue band from q^n/n - 2 q^(n/2)/n to q^n/n + 2 q^(n/2)/n.
  Because I_n grows like q^n, plot the bars as I_n / (q^n/n) with the band as 1 +- 2 q^(-n/2).
Controls: q selector {2, 3}. d_max slider: 1..10 for q = 2 (1024 chips at most), 1..6 for q = 3 (729 chips).
  A "sieve" play button that runs both sieves in step (one prime or irreducible per 300 ms), and a reset.
Motion: chips fade as they are struck; the bar for degree n grows as the sieve finishes that row.
Reader takeaway: the procedure is identical in both worlds, and the polynomial count hugs q^n/n with a
  relative error that shrinks like q^(-n/2).
Data: none external. I_n from the formula (1/n) sum_{d|n} mu(d) q^(n/d) must agree with the sieve count;
  check values for q = 2: 2, 1, 2, 3, 6, 9, 18, 30, 56, 99.
```
:::

## Curves and their points {#ff-curves}

A curve over $\FF_q$ is the solution set of polynomial equations in two variables, but the object we count is not one finite set. It is a single geometric object whose points can have coordinates in any of the fields $\FF_q \subset \FF_{q^2} \subset \FF_{q^3} \subset \cdots$, and the sequence of counts over all of them is what carries the arithmetic.

::: definition {#d-ff-curve title="Smooth projective curve over a finite field"}
A smooth projective curve $C$ over $\FF_q$ is a curve cut out by polynomial equations with coefficients in $\FF_q$, viewed over the algebraic closure $\overline{\FF}_q$, with three properties: it is one-dimensional and irreducible over $\overline{\FF}_q$; it is smooth, meaning that at every point the partial derivatives of its equations do not all vanish, so it has a tangent line everywhere; and it is projective, meaning that its points at infinity are included, so it is compact in the algebraic sense. It is not the finite set $C(\FF_q)$ of its points with coordinates in $\FF_q$, which is only the first of the sets $C(\FF_{q^n})$ it determines.
:::

The model example is a curve
$$
y^2 = f(x)
$$ {#eq-ff-hyperelliptic}
with $q$ odd and $f \in \FF_q[x]$ of degree $d \ge 3$ with no repeated root. The affine part is smooth because a singular point would need $2y = 0$ and $f'(x) = 0$ together with $y^2 = f(x)$, forcing $x$ to be a repeated root of $f$. The smooth projective model adds one point at infinity when $d$ is odd, and two when $d$ is even (both defined over $\FF_q$ when the leading coefficient of $f$ is a square in $\FF_q$, and neither otherwise). For $d = 3$ the curve is an elliptic curve.

::: definition {#d-ff-genus title="Genus"}
The genus $g$ of $C$ is a nonnegative integer that measures how far $C$ is from the projective line. Over the complex numbers it is the number of holes of the corresponding surface. Over any field it is the number of independent holomorphic differential forms on $C$, and it is also the number of gaps in the list of possible pole orders of functions that have poles only at one point, the description [[stepanov]] uses. It is not the degree of the equation: for [[eq-ff-hyperelliptic]] with $\deg f = d$ the genus is $g = \lfloor (d-1)/2 \rfloor$, so elliptic curves have genus 1 and $y^2 = x^5 - x + 1$ has genus 2.
:::

The counts that matter are
$$
N_n = \#C(\FF_{q^n}), \qquad n = 1, 2, 3, \dots,
$$
the number of points of $C$, including those at infinity, whose coordinates lie in $\FF_{q^n}$. For the projective line, $N_n = q^n + 1$: the $q^n$ values of a coordinate plus the point at infinity.

::: example
Take $C: y^2 = x^3 + x + 1$, an elliptic curve over $\FF_5$ and over $\FF_7$ (its discriminant $-16 \cdot 31$ is nonzero modulo 5 and 7). The squares modulo 5 are $0, 1, 4$ and modulo 7 they are $0, 1, 2, 4$. For each $x$ we compute $f(x)$ and count the $y$ with $y^2 = f(x)$: two if $f(x)$ is a nonzero square, one if $f(x) = 0$, none otherwise.

| $x$ | 0 | 1 | 2 | 3 | 4 | 5 | 6 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| $f(x) \bmod 5$ | 1 | 3 | 1 | 1 | 4 | | |
| points over $\FF_5$ | $(0,\pm1)$ | none | $(2,\pm1)$ | $(3,\pm1)$ | $(4,\pm2)$ | | |
| $f(x) \bmod 7$ | 1 | 3 | 4 | 3 | 6 | 5 | 6 |
| points over $\FF_7$ | $(0,\pm1)$ | none | $(2,\pm2)$ | none | none | none | none |

With the point at infinity, $N_1 = 8 + 1 = 9$ over $\FF_5$ and $N_1 = 4 + 1 = 5$ over $\FF_7$. The projective line would give $6$ and $8$. The curve over $\FF_5$ has three points more than the line, and over $\FF_7$ three fewer.
:::

::: example
Over the extension $\FF_{25}$ the same curve has $N_2 = 27$ points, and over $\FF_{125}$ it has $N_3 = 108$, both found by running through every $x$ in the larger field and testing whether $f(x)$ is a square there. The genus 2 curve $y^2 = x^5 - x + 1$ over $\FF_7$ has $N_1 = 7$ (the six points $(0, \pm 1)$, $(1, \pm 1)$, $(6, \pm 1)$ and one point at infinity), $N_2 = 49$, $N_3 = 322$, and $N_4 = 2569$, also by direct count.
:::

These counts look unrelated to each other. The zeta function shows that for a curve of genus $g$ the whole infinite sequence $N_1, N_2, N_3, \dots$ is determined by $g$ of its terms.

## The zeta function of a curve {#ff-zeta}

The zeta function of $C$ packages all the counts $N_n$ into one generating function, chosen so that it has an Euler product over the primes of $C$.

::: definition {#d-ff-zeta title="Zeta function of a curve"}
The zeta function of $C$ over $\FF_q$ is the formal power series
$$
Z(C, u) = \exp\Bigl( \sum_{n \ge 1} \frac{N_n}{n}\, u^n \Bigr),
$$ {#eq-ff-zeta-def}
which converges for $\abs{u} < 1/q$ because $N_n \le (\text{const})\, q^n$. Setting $u = q^{-s}$ gives a function $\zeta_C(s) = Z(C, q^{-s})$ of a complex variable. It is not a sum over points: its coefficients after the exponential count effective divisors, as the Euler product below shows.
:::

The primes of $C$ are its closed points. Frobenius acts on the points of $C$ over $\overline{\FF}_q$ by raising every coordinate to the $q$-th power, which maps $C$ to itself because the equations have coefficients in $\FF_q$. A closed point of degree $d$ is an orbit of this action of length $d$, the analog of a monic irreducible of degree $d$ (which by the fourth recall is an orbit of Frobenius on $\overline{\FF}_q$ of length $d$). If $a_d$ is the number of closed points of degree $d$, a point of $C(\FF_{q^n})$ is a point fixed by the $n$-th power of Frobenius, so it lies in an orbit whose length divides $n$, and
$$
N_n = \sum_{d \mid n} d\, a_d.
$$ {#eq-ff-orbits}
This is [[eq-ff-ppt-psi]] again, for the curve in place of the line. Taking $u\,\tfrac{\dd}{\dd u}\log$ of both sides shows that [[eq-ff-orbits]] is equivalent to the Euler product
$$
Z(C, u) = \prod_{\text{closed points } P} \bigl(1 - u^{\deg P}\bigr)^{-1},
$$
because $u \frac{\dd}{\dd u} \log (1 - u^d)^{-1} = \sum_{k \ge 1} d\, u^{dk}$ and $u \frac{\dd}{\dd u}\sum_n N_n u^n/n = \sum_n N_n u^n$. With $u = q^{-s}$ each factor is $(1 - \abs{P}^{-s})^{-1}$ with $\abs{P} = q^{\deg P}$, the same shape as Euler's.

::: example
For the projective line $N_n = q^n + 1$, so
$$
Z(\mathbb P^1, u) = \exp\Bigl(\sum_{n\ge1} \frac{(qu)^n + u^n}{n}\Bigr) = \frac{1}{(1-u)(1-qu)}.
$$
The factor $1/(1-qu)$ is $\zeta_{\FF_q[T]}$ from [[eq-ff-zeta-poly]], and the factor $1/(1-u)$ is the Euler factor of the single point at infinity, which has degree 1. In the function-field world the infinite prime is literally one more prime.
:::

For a general curve the zeta function is still rational, with a numerator of degree $2g$, and it satisfies a functional equation. This is the analog of the continuation and functional equation of [[zeta-continued]], and its input is the Riemann and Roch theorem, which counts functions on $C$ with prescribed poles and which [[stepanov]] uses directly.

::::: card {#t-ff-rationality kind="theorem" title="The zeta function of a curve is a rational function with a numerator of degree $2g$ and a functional equation" source="schmidt1931"}
:::: statement
Let $C$ be a smooth projective curve of genus $g$ over $\FF_q$. Then
$$
Z(C, u) = \frac{L(u)}{(1-u)(1-qu)}, \qquad L(u) = \prod_{i=1}^{2g} (1 - \alpha_i u),
$$ {#eq-ff-rational}
where $L$ is a polynomial with integer coefficients, $L(0) = 1$, and the $\alpha_i$ are nonzero algebraic integers. Moreover
$$
Z\Bigl(C, \frac{1}{qu}\Bigr) = q^{1-g}\, u^{2-2g}\, Z(C, u),
$$ {#eq-ff-functional}
equivalently, the multiset $\{\alpha_1, \dots, \alpha_{2g}\}$ is unchanged by $\alpha \mapsto q/\alpha$.
::::
:::: plain
All the point counts of a curve are controlled by a polynomial of degree $2g$, and that polynomial has a symmetry that pairs each of its roots with another.
::::
:::: why
Rationality turns the infinite list of counts into finitely many numbers $\alpha_i$, and the functional equation pairs $\alpha$ with $q/\alpha$. Both are used in [[t-ff-rh-from-bound]], where the pairing turns an upper bound $\abs{\alpha_i} \le \sqrt q$ into the equality $\abs{\alpha_i} = \sqrt q$.
::::
:::: idea
Expand the Euler product: $Z(C, u) = \sum_D u^{\deg D}$ over effective divisors $D$, that is, formal sums of closed points with nonnegative multiplicities. Group the divisors by linear equivalence class. A class of degree $m$ contains $(q^{\ell(D)} - 1)/(q-1)$ effective divisors, where $\ell(D)$ is the dimension of the space of functions with poles bounded by $D$, and Riemann and Roch gives $\ell(D) = m + 1 - g$ as soon as $m > 2g-2$. The tail of the series is then a geometric series in $qu$ plus one in $u$, which makes $Z$ rational with denominator $(1-u)(1-qu)$, and the symmetry $D \leftrightarrow K - D$ of Riemann and Roch, with $K$ a canonical divisor of degree $2g-2$, gives the functional equation.
::::
:::: sketch {source="rosen2002" loc="ch. 5"}
F. K. Schmidt proved rationality and the functional equation in 1931 by the argument in the idea [@schmidt1931]. A complete modern account is in Rosen's book, which also proves that $L$ has integer coefficients and degree exactly $2g$ [@rosen2002, ch. 5]. The finiteness of the number of divisor classes of degree 0, needed to make the sum over classes finite, is part of the same account.
::::
:::: used
The factorization [[eq-ff-rational]] gives the explicit formula [[eq-ff-explicit]] below, and the functional equation finishes [[t-ff-rh-from-bound]] and the proof of [[t-st-rh-curves]].
::::
:::::

Taking logarithms of [[eq-ff-rational]] and comparing coefficients of $u^n$ with [[eq-ff-zeta-def]] gives, since $\log(1 - \alpha u) = -\sum_n \alpha^n u^n/n$,
$$
N_n = q^n + 1 - \sum_{i=1}^{2g} \alpha_i^n \qquad (n \ge 1).
$$ {#eq-ff-explicit}
This identity is the explicit formula of the curve. Set $x = q^n$, so that $q^n$ is the main term $x$, and write each $\alpha_i = q^{\rho_i}$ for a complex number $\rho_i$. Then $\alpha_i^n = x^{\rho_i}$, and [[eq-ff-explicit]] reads $N_n = x + 1 - \sum_i x^{\rho_i}$, the shape of von Mangoldt's $\psi(x) = x - \sum_\rho x^\rho/\rho - \cdots$ with finitely many zeros. The $\rho_i$ are exactly the zeros of $\zeta_C(s) = Z(C, q^{-s})$ (up to the period $2\pi i/\log q$), because $1 - \alpha_i q^{-s} = 0$ means $q^s = \alpha_i$, and the main terms $x$ and $1$ come from the poles at $s = 1$ and $s = 0$, as the terms $\mathcal M f(1)$ and $\mathcal M f(0)$ come from the poles in [[t-wp-explicit]]. Finally,
$$
\Re \rho_i = \frac{\log \abs{\alpha_i}}{\log q}, \qquad \text{so} \qquad \Re\rho_i = \tfrac12 \iff \abs{\alpha_i} = \sqrt q.
$$

::: example
For $E: y^2 = x^3 + x + 1$ over $\FF_5$, $N_1 = 9$, so the trace $a = q + 1 - N_1 = -3$ and $L(u) = 1 - a u + q u^2 = 1 + 3u + 5u^2$. Its inverse roots are $\alpha = (-3 \pm i\sqrt{11})/2$, with $\abs{\alpha}^2 = (9 + 11)/4 = 5$, so $\abs{\alpha} = \sqrt 5$. The formula [[eq-ff-explicit]] predicts $N_2 = 25 + 1 - (\alpha_1^2 + \alpha_2^2) = 26 - (a^2 - 2q) = 27$ and $N_3 = 108$, matching the direct counts above, and continues with $N_4 = 675$, $N_5 = 3069$, $N_6 = 15552$.

For the genus 2 curve $y^2 = x^5 - x + 1$ over $\FF_7$, the counts $N_1 = 7$ and $N_2 = 49$ determine $L$: with $s_1 = \sum \alpha_i = q + 1 - N_1 = 1$ and $\sum \alpha_i^2 = q^2 + 1 - N_2 = 1$, the second elementary symmetric function is $(1^2 - 1)/2 = 0$, and the functional equation supplies the rest,
$$
L(u) = 1 - u + 0\cdot u^2 - 7u^3 + 49u^4.
$$
All four roots have absolute value $\sqrt 7 = 2.6458$ to the precision computed, and [[eq-ff-explicit]] then predicts $N_3 = 322$ and $N_4 = 2569$, the values found by direct count, so two counts have fixed infinitely many.
:::

## The Riemann Hypothesis for curves {#ff-rh}

The hypothesis for a curve says that every inverse root has the absolute value forced on it by the line $\Re s = 1/2$. By [[eq-ff-explicit]] this is the same as a square-root bound on the counts.

::::: card {#t-ff-rh-curves kind="theorem" title="For a curve of genus $g$ over $\FF_q$ every inverse root has absolute value $\sqrt q$, so point counts deviate by at most $2g$ times a square root" source="weil1948"}
:::: statement
Let $C$ be a smooth projective curve of genus $g$ over $\FF_q$ with inverse roots $\alpha_1, \dots, \alpha_{2g}$ as in [[eq-ff-rational]]. Then $\abs{\alpha_i} = \sqrt q$ for every $i$, and consequently
$$
\bigl| N_n - q^n - 1 \bigr| \le 2g\, q^{n/2} \qquad \text{for all } n \ge 1.
$$ {#eq-ff-weil-bound}
::::
:::: plain
A curve over a finite field has about as many points as a line, and the surplus or deficit is never more than $2g$ times the square root of the field size.
::::
:::: why
This is the theorem whose proof [[stepanov]] gives and which one of the 2026 proofs imitates over the integers. Its form, a statement about every zero obtained from a bound on counts, is the template for what the integer version must achieve.
::::
:::: idea
The bound [[eq-ff-weil-bound]] follows from $\abs{\alpha_i} = \sqrt q$ by the triangle inequality in [[eq-ff-explicit]]. The converse direction, from bounds on counts back to the zeros, is [[t-ff-rh-from-bound]] below, which needs only a bound of the form $C q^{n/2}$ for all large $n$. So the whole difficulty is to bound $N_n$ to within a constant times $q^{n/2}$, on both sides, by some method that does not already know the zeros.
::::
:::: sketch {source="weil1948"}
Hasse proved the case $g = 1$ in the 1930s [@hasse1936], and Weil proved the general case, announced in 1940 and published in 1948, using intersection theory on the surface $C \times C$ and, in a second proof, the Jacobian of $C$ [@weil1948]. The proof given in full in [[stepanov]] is Stepanov's method in the form Bombieri gave it, which bounds $N_n$ directly by an auxiliary function and then applies [[t-ff-rh-from-bound]] [@bombieri1974].
::::
:::: used
The statement is proved in [[t-st-rh-curves]], and its shape, a bound on counts that forces every zero onto the line, is what [[st-used]] asks of the integers.
::::
:::::

The converse direction is short, and it is the step at the end of [[stepanov]] that turns inequalities for point counts into the location of the zeros. It is worth seeing why a constant $C$ much larger than $2g$ costs nothing.

::::: card {#t-ff-rh-from-bound kind="lemma" title="A square-root bound on the point counts, with any constant, forces every inverse root onto the circle of radius $\sqrt q$"}
:::: statement
Suppose there are constants $C$ and $n_0$ with
$$
\bigl| N_n - q^n - 1 \bigr| \le C\, q^{n/2} \qquad \text{for all } n \ge n_0 .
$$
Then $\abs{\alpha_i} = \sqrt q$ for every $i$.
::::
:::: plain
If the counts never stray from $q^n + 1$ by more than a fixed multiple of $q^{n/2}$, then the curve satisfies the Riemann Hypothesis, and the constant in the bound improves itself to $2g$.
::::
:::: why
Stepanov's method produces bounds with a constant like $2g+1$ on one side and a constant that depends on an auxiliary cover on the other. This lemma shows that any constant suffices, which is why the method proves the full hypothesis rather than an approximation of it.
::::
:::: idea
The numbers $S_n = \sum_i \alpha_i^n$ are the coefficients of a rational function whose poles sit at the points $1/\alpha_i$. A bound $\abs{S_n} \le C q^{n/2}$ means the power series converges on the disc $\abs{u} < q^{-1/2}$, so no pole can lie inside it, and $\abs{\alpha_i} \le \sqrt q$. The pairing $\alpha \leftrightarrow q/\alpha$ then gives the reverse inequality.
::::
:::: proof
By [[eq-ff-explicit]], $S_n = q^n + 1 - N_n$ satisfies $\abs{S_n} \le C q^{n/2}$ for $n \ge n_0$. Group equal inverse roots: let $\beta_1, \dots, \beta_r$ be the distinct values among the $\alpha_i$, with multiplicities $m_1, \dots, m_r \ge 1$. For $\abs{u}$ small,
$$
\sum_{n \ge 1} S_n u^n = \sum_{i=1}^{2g} \frac{\alpha_i u}{1 - \alpha_i u} = \sum_{j=1}^{r} \frac{m_j \beta_j u}{1 - \beta_j u}.
$$
The bound on $S_n$ makes the left side converge, and so define a holomorphic function, on the disc $\abs{u} < q^{-1/2}$. The right side is a rational function with a pole at each $u = 1/\beta_j$, because the poles are at distinct points and each coefficient $m_j \beta_j$ is nonzero, so no two terms can cancel. The two sides agree near $u = 0$, hence on the whole disc, so no pole lies in it, which gives $\abs{1/\beta_j} \ge q^{-1/2}$, that is $\abs{\beta_j} \le \sqrt q$ for every $j$. By [[eq-ff-functional]], $q/\beta_j$ is also an inverse root, so $\abs{q/\beta_j} \le \sqrt q$ as well, which gives $\abs{\beta_j} \ge \sqrt q$.
::::
:::: used
This lemma is the last step of [[t-st-rh-curves]].
::::
:::::

::: warning
The multiplicities $m_j$ being positive integers is what prevents cancellation, and it is not a technicality. A combination $\sum c_j \beta_j^n$ with arbitrary complex $c_j$ can be small for all $n$ even when some $\abs{\beta_j} > \sqrt q$, if the coefficients conspire. Because the $\alpha_i$ come from counting, each appears with a positive weight, and a pole outside the allowed disc cannot be hidden by another.
:::

The genus 1 case can be watched in numbers. For an elliptic curve the bound [[eq-ff-weil-bound]] is Hasse's, $\abs{a} \le 2\sqrt q$ with $a = q + 1 - N_1$.

::: example
For $E: y^2 = x^3 + x + 1$ over $\FF_p$, counting points for each prime $p$ with $5 \le p \le 97$ and $p \ne 31$ (the discriminant $-16\cdot 31$ vanishes modulo 31) gives a trace $a_p$ inside the Hasse interval every time. A selection:

| $p$ | 5 | 7 | 11 | 13 | 37 | 43 | 47 | 61 | 71 | 97 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| $N_1$ | 9 | 5 | 14 | 18 | 48 | 34 | 60 | 50 | 59 | 97 |
| $a_p$ | $-3$ | 3 | $-2$ | $-4$ | $-10$ | 10 | $-12$ | 12 | 13 | 1 |
| $2\sqrt p$ | 4.47 | 5.29 | 6.63 | 7.21 | 12.17 | 13.11 | 13.71 | 15.62 | 16.85 | 19.70 |

The largest ratio in this range is $\abs{a_{47}}/(2\sqrt{47}) = 12/13.71 = 0.88$.
:::

::: figure {#f-ff-points viz="curve-grid" height="460"}
The points of an elliptic curve over a prime field look scattered, yet their number always lands within twice the square root of the field size of the projective line's count.

```vizspec
Purpose: let the reader count points of y^2 = x^3 + a x + b over F_p and see the count land in the Hasse
  interval.
Scene: left, a p-by-p grid of faint muted dots for (x, y) in F_p x F_p, x horizontal, y vertical, origin
  lower left. Points with y^2 = x^3 + a x + b (mod p) are gold dots. Pairs (x, y) and (x, p - y) are joined
  by a faint vertical segment to show the symmetry y -> -y; points with y = 0 drawn as gold rings.
  Right, a horizontal number line from p + 1 - 2 sqrt(p) - 3 to p + 1 + 2 sqrt(p) + 3: the Hasse interval
  [p + 1 - 2 sqrt(p), p + 1 + 2 sqrt(p)] as a blue band, p + 1 as a blue tick, and the count N (affine
  points + 1 for the point at infinity) as a gold marker. Print N, a = p + 1 - N, and the ratio
  a / (2 sqrt(p)).
  Below the number line, a small strip chart: for the current (a, b), the ratio a_p / (2 sqrt(p)) for every
  prime 5 <= p <= 199 at which 4a^3 + 27b^2 is nonzero mod p, as teal dots between -1 and 1.
Controls: p selector over primes 5..97 (default 5); sliders a and b over 0..p-1 (default a = 1, b = 1).
  When 4 a^3 + 27 b^2 = 0 mod p, show a red note "singular: the curve has a node or cusp" and draw the
  count in red; this is the only case where the count can leave the band.
Motion: changing a or b moves dots with a 200 ms fade; the gold marker slides along the number line.
Reader takeaway: N_1 is never further than 2 sqrt(p) from p + 1 for a smooth curve, whatever a, b, p.
Check values: (a, b) = (1, 1): p = 5 gives N = 9; p = 7 gives N = 5; p = 47 gives N = 60.
```
:::

## Frobenius, the operator behind the zeros {#ff-frobenius}

Over a finite field the zeros have an owner. The Frobenius map $\Frob\colon C \to C$, raising each coordinate to the $q$-th power, sends points of $C$ to points of $C$, and by the second recall its fixed points are exactly the points with coordinates in $\FF_q$. Its $n$-th power fixes exactly the points with coordinates in $\FF_{q^n}$, so
$$
N_n = \#\{ P \in C(\overline{\FF}_q) : \Frob^n(P) = P \}.
$$
A count of fixed points of a map is what the Lefschetz fixed point formula computes in topology, as an alternating sum of traces on cohomology groups. Weil conjectured, and Grothendieck and his school proved, that the same holds here: there are vector spaces $H^0$, $H^1$, $H^2$ (over the $\ell$-adic numbers for a prime $\ell \ne p$), of dimensions $1$, $2g$, and $1$, on which Frobenius acts by $1$, by a linear map with eigenvalues $\alpha_1, \dots, \alpha_{2g}$, and by $q$, and
$$
N_n = \sum_{i=0}^{2} (-1)^i \Tr\bigl(\Frob^n \mid H^i\bigr) = 1 - \sum_{j=1}^{2g} \alpha_j^n + q^n .
$$ {#eq-ff-lefschetz}
This is [[eq-ff-explicit]] with a proof that explains it: the $\alpha_i$ are eigenvalues of an operator, the zeros of $\zeta_C$ are the spectrum of that operator, and the identity is a trace formula [@hartshorne1977, app. C], [@deligne1974].

For an elliptic curve no cohomology is needed to see this. Frobenius is an endomorphism $\phi$ of the group $E$, and on the points of order dividing $\ell^k$, a group isomorphic to $(\ZZ/\ell^k)^2$, it acts by a $2 \times 2$ matrix whose trace is congruent to $a = q + 1 - N_1$ and whose determinant is congruent to $q$ modulo $\ell^k$ (for a prime $\ell \ne p$). The rational points are the kernel of $1 - \phi$, and $\#E(\FF_q) = \deg(1 - \phi) = \det(1 - \phi) = 1 - a + q$, while $\phi^2 - a\phi + q = 0$ shows that the two eigenvalues of $\phi$ are the inverse roots $\alpha_1, \alpha_2$ [@silverman2009, ch. V]. Here a fixed-point count is literally a characteristic polynomial evaluated at 1.

The comparison with [[weil-positivity]] can now be made exactly. In [[wp-trace]] the explicit formula was read as a trace formula with the zeros as a spectrum and the prime powers as periodic orbits of lengths $\log p^k$, each weighted by the length $\log p$ of its primitive orbit. Over a curve the periodic orbits are the closed points: a closed point of degree $d$ is a periodic orbit of Frobenius of primitive length $d$, and in [[eq-ff-orbits]] it is counted with weight $d$ by every $\Frob^n$ with $d \mid n$. The spectral side is the finite list $\alpha_1, \dots, \alpha_{2g}$, and the operator is known. For the integers neither the space nor the operator is known, and the search for them is the Hilbert and Polya idea described in [[wp-trace]].

The same comparison reaches the positivity criterion. Put $s_0 = 2g$ and $s_k = s_{-k} = q^{-k/2}\bigl(q^k + 1 - N_k\bigr)$ for $k \ge 1$, numbers computed from the counts alone, and for a finite sequence $c_1, \dots, c_K$ of complex numbers form the quadratic form
$$
Q(c) = \sum_{n, m = 1}^{K} c_n\, \overline{c_m}\, s_{n-m}.
$$
If $\abs{\alpha_i} = \sqrt q$, write $\alpha_i = \sqrt q\, e^{i\theta_i}$. The multiset of the $\alpha_i$ is closed under complex conjugation, because $L$ has integer coefficients, so [[eq-ff-explicit]] gives $s_k = \sum_i e^{ik\theta_i}$ for every integer $k$, and
$$
Q(c) = \sum_{i=1}^{2g} \Bigl| \sum_{n=1}^{K} c_n e^{i n \theta_i} \Bigr|^2 \ge 0.
$$
Conversely, if $Q(c) \ge 0$ for every $c$, then the choice $c_1 = 1$, $c_{k+1} = -e^{i\varphi}$ gives $2s_0 - 2\Re(e^{i\varphi}s_k) \ge 0$ for every angle $\varphi$, so $\abs{s_k} \le 2g$, which is [[eq-ff-weil-bound]], and [[t-ff-rh-from-bound]] turns it into $\abs{\alpha_i} = \sqrt q$. A quadratic form in the counts is nonnegative exactly when the zeros lie on the circle, which is the shape of [[t-wp-criterion]]. Weil's own proof of [[t-ff-rh-curves]] establishes such a positivity geometrically, as [[stepanov]] recalls in an aside.

::: figure {#f-ff-frobenius viz="frobenius-circle" height="460"}
Each inverse root turns on the circle of radius the square root of q, and the error in the point count is the sum of these turning arrows, so it never exceeds 2g of them.

```vizspec
Purpose: show N_n - q^n - 1 as minus the sum of the vectors alpha_i^n, each of length q^(n/2).
Scene: left, the complex plane with a violet circle of radius sqrt(q) and the inverse roots alpha_i as teal
  dots on it. Right of it, a second panel with a circle of radius q^(n/2) (rescaled to fixed screen size):
  the vectors alpha_i^n drawn tip to tail as teal arrows from the origin, and their sum S_n as a red arrow.
  Below both, a strip chart for n = 1..n_max of the normalized error (N_n - q^n - 1) / q^(n/2) = -S_n /
  q^(n/2) as gold dots, with the band [-2g, 2g] in blue.
Data (exact polynomials, inverse roots computed numerically from them):
  curve A: y^2 = x^3 + x + 1 over F_5, g = 1, L(u) = 1 + 3u + 5u^2, alpha = (-3 +- i sqrt(11)) / 2.
    N_n for n = 1..6: 9, 27, 108, 675, 3069, 15552.
  curve B: y^2 = x^5 - x + 1 over F_7, g = 2, L(u) = 1 - u - 7u^3 + 49u^4.
    N_n for n = 1..4: 7, 49, 322, 2569.
  Compute N_n = q^n + 1 - sum alpha_i^n in floating point for larger n; the values above are checks.
Controls: curve selector {A, B}; slider n from 1 to 40; play button stepping n once per 600 ms.
  A toggle "fake root" that moves one inverse root of curve A radially to radius 1.2 sqrt(q) (and its
  partner to q / that root, radius sqrt(q)/1.2): the normalized error then grows like 1.2^n and leaves the
  band within a few steps, drawn in red.
Motion: as n increases the teal arrows rotate by the angles arg(alpha_i); the red sum arrow wanders but
  stays inside the circle of radius 2g q^(n/2).
Reader takeaway: square-root error for all n is the same thing as every inverse root on the circle, and a
  single root off the circle would make the error grow without bound.
```
:::

::: recap
- $\FF_q[T]$ copies $\ZZ$: monic irreducibles are its primes, $\abs{f} = q^{\deg f}$ is its size, and its zeta function $1/(1 - q^{1-s})$ has no zeros.
- The prime polynomial theorem [[t-ff-ppt]] is an identity, $\sum_{d \mid n} d I_d = q^n$, with error below $2q^{n/2}/n$ in $I_n$.
- A smooth projective curve $C$ of genus $g$ has counts $N_n$, a zeta function $Z(C, u) = L(u)/((1-u)(1-qu))$ with $\deg L = 2g$ ([[t-ff-rationality]]), and the explicit formula $N_n = q^n + 1 - \sum \alpha_i^n$ ([[eq-ff-explicit]]).
- The Riemann Hypothesis for curves ([[t-ff-rh-curves]]) is $\abs{\alpha_i} = \sqrt q$, and by [[t-ff-rh-from-bound]] it follows from a bound $\abs{N_n - q^n - 1} \le C q^{n/2}$ with any constant.
- The $\alpha_i$ are the eigenvalues of Frobenius, whose fixed points are the counted points, so the explicit formula is a Lefschetz trace formula. [[stepanov]] proves the bound with Frobenius as its main tool.
:::
