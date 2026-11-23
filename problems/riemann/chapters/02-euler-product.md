---
id: euler-product
title: "Euler's product: primes inside one function"
part: 1
summary: Build the zeta function for real s above 1, prove that it equals a product over the primes, and read the primes out of it, including the identity that puts the weights of the last chapter into its logarithmic derivative.
needs: [counting-primes]
---

::: plain
Raise each whole number $n$ to the power $-s$ and add them all up, with $s$ a real number bigger than 1: the total is a
number we call $\zeta(s)$. Euler noticed that the same number comes out if you multiply together one simple factor for each
prime. That equality is unique factorization written as an equation, and it is the door through which the primes enter
calculus.
:::

Chapter [[counting-primes]] left us with a count of the primes, a smooth estimate for it, and a question about the
size of the error. To say anything about that error we need a tool that can see all the primes at once. A sum over
the primes is hard to handle. A function is easy to handle: we can differentiate it, bound it, and ask where it is zero. This chapter builds a function that has the primes folded
into it, and proves that it does. It uses nothing beyond real numbers and series, and it stays on the real line. Complex
values of $s$ come in the next chapters.

## The zeta function for real $s > 1$ {#ep-zeta}

The simplest series that mentions every whole number is $1 + \tfrac12 + \tfrac13 + \cdots$, and it diverges. Raising each
term to a power fixes this. The terms $n^{-s}$ shrink faster, and the sum is finite when $s$ is large enough. We
want to know exactly when, and how big the sum is.

:::: definition {#d-ep-zeta title="The zeta function, for now on the real line"}
For a real number $s > 1$, define
$$
\zeta(s) = \sum_{n=1}^{\infty} \frac{1}{n^s}.
$$
For now it is a function of a real variable, defined only for $s > 1$, where the series converges. It is not yet a
function of a complex variable, and the series is not the right definition for $s \le 1$ (at $s = 1$ it is the divergent
harmonic series). Chapters [[complex-toolkit]] and [[zeta-continued]] extend it.
::::

The series is an example of a Dirichlet series, the general shape $\sum a_n n^{-s}$ with a coefficient $a_n$ attached
to each integer. Here every $a_n = 1$. In section [[ep-logderiv]] the coefficients become $\Lambda(n)$.

Why does it converge, and what happens as $s$ falls toward 1? Compare the sum to an integral. The rectangle of width 1
and height $n^{-s}$ standing on $[n, n+1)$ lies above the curve $t^{-s}$, and the rectangle standing on $[n-1, n)$ lies below it.
Adding the rectangles squeezes the sum between two integrals of the same curve.

:::: proposition {#p-ep-bounds title="$\zeta$ is squeezed between two simple functions"}
For real $s > 1$,
$$
\frac{1}{s-1} < \zeta(s) < \frac{s}{s-1}.
$$
::::

::: proof
For each $n \ge 1$ and $t \in [n, n+1]$ we have $t^{-s} \le n^{-s}$, so $n^{-s} \ge \int_n^{n+1} t^{-s}\, \dd t$. Summing over
$n \ge 1$ gives $\zeta(s) > \int_1^\infty t^{-s}\, \dd t = \frac{1}{s-1}$. For $n \ge 2$ and $t \in [n-1, n]$ we have $t^{-s} \ge n^{-s}$, so $n^{-s} \le \int_{n-1}^n t^{-s}\, \dd t$. Summing over
$n \ge 2$ gives $\zeta(s) - 1 < \int_1^\infty t^{-s}\, \dd t = \frac{1}{s-1}$, which is the upper bound $\zeta(s) < 1 + \frac{1}{s-1} = \frac{s}{s-1}$.
:::

Test it. At $s = 2$ the bounds are 1 and 2, and $\zeta(2) = 1.6449$. At $s = 1.1$ they are 10 and 11, and $\zeta(1.1) = 10.584$. At
$s = 1.01$ they are 100 and 101, and $\zeta(1.01) = 100.578$. The sum is tied to $1/(s-1)$ so tightly that
$\zeta(s) - \frac{1}{s-1}$ settles down: it is 0.6449 at $s = 2$, 0.5844 at 1.1, 0.5779 at 1.01, and 0.5773 at 1.001. The limit is
Euler's constant $\gamma_E = 0.5772\ldots$, a fact chapter [[zeta-continued]] will prove. For now the lesson is that
$\zeta(s)$ blows up like $1/(s-1)$ as $s$ falls to 1, which is the real-line shadow of a pole.

Some exact values are known. Euler found in the 1730s that $\zeta(2) = \pi^2/6 = 1.6449\ldots$ and $\zeta(4) = \pi^4/90 = 1.0823\ldots$.
For $\zeta(3) = 1.2020\ldots$ no such closed form is known.

::: warning
In $\zeta(2) = \pi^2/6$ the letter $\pi$ is the constant $3.14159\ldots$, and not the prime counting function of chapter
[[counting-primes]]. The prime counting function always has an argument, as in $\pi(x)$.
:::

:::: figure {#f-ep-zeta viz="zeta-real" height="480"}
The area under the curve $t^{-s}$ is squeezed between two staircases of rectangles whose areas are $\zeta(s)$ and
$\zeta(s) - 1$, and that squeeze is why $\zeta(s)$ stays within 1 of $1/(s-1)$.

```vizspec
Purpose: make the integral test and the bounds 1/(s-1) < zeta(s) < s/(s-1) visible, and show zeta blowing up as s falls to 1.
Scene: two panels side by side (stacked on a phone). Left panel: axes t from 1 to 10 and y from 0 to 1.05. Draw the curve
  y = t^(-s) in blue. Draw rectangles of width 1: in mode "upper" the rectangle on [n, n+1) has height n^(-s)
  (n = 1..9), lying above the curve; in mode "lower" the rectangle on [n-1, n) has height n^(-s) (n = 2..10), lying
  below the curve. Rectangles are gold with a thin outline. Shade the area under the curve from t = 1 in pale blue
  and print its value 1/(s-1). Print above the panel the sum of the drawn rectangle areas (the truncated sum of n^(-s)
  over the shown n) next to the full infinite sum zeta(s). Right panel: axes s from 1 to 4 (x) and y from 0 to 12.
  Draw zeta(s) in gold, 1/(s-1) in blue, and s/(s-1) in blue dashed. Mark the current s with a dot on the gold curve
  and a vertical drop line, with the value zeta(s) printed. Clip y at 12 so the blow-up at s = 1 runs off the top.
Controls: slider for s from 1.05 to 4 (step 0.01, default 2); a two-way switch "upper rectangles" / "lower rectangles".
  Hovering the right panel moves the marker too.
Motion: when s changes, the curve and the rectangle heights morph together over 200 ms. In the right panel the dot
  slides along the gold curve. No autoplay.
Reader takeaway: for s near 1 the rectangles are tall and the tail of the series carries almost all of the sum, which is
  why zeta(s) behaves like 1/(s-1); for large s the first rectangle (height 1) dominates and zeta(s) is close to 1.
Data: zeta(s) computed in the browser as the sum of n^(-s) for n < 2000 (n = 2000 excluded) plus the Euler-Maclaurin tail
  2000^(1-s)/(s-1) + 2000^(-s)/2 + s * 2000^(-s-1)/12; accurate to better than 1e-9 for s >= 1.05.
```
::::

## Euler's product {#ep-product}

Here is the idea, before any proof. Every whole number is a product of primes in exactly one way: $12 = 2^2 \cdot 3$,
$45 = 3^2 \cdot 5$, $360 = 2^3 \cdot 3^2 \cdot 5$. Now take two primes, 2 and 3, and write down for each the geometric series of its powers, with $s = 2$:
$$
\Bigl(1 + \tfrac{1}{4} + \tfrac{1}{16} + \tfrac{1}{64} + \cdots\Bigr)\Bigl(1 + \tfrac{1}{9} + \tfrac{1}{81} + \cdots\Bigr).
$$
Multiplying out takes one term from the first bracket, say $2^{-2a}$, and one from the second, $3^{-2b}$, and the product is $(2^a 3^b)^{-2}$. Every number of the form $2^a 3^b$ appears
as a term, and appears once, because $2^a 3^b$ determines $a$ and $b$. So the product is exactly the sum of $n^{-2}$ over the numbers $n$ whose only prime factors are 2 and 3. Each bracket is a geometric series, so we can compute the product in closed form:
$$
\frac{1}{1 - 1/4} \cdot \frac{1}{1 - 1/9} = \frac43 \cdot \frac98 = \frac32.
$$
Check against the other side. The numbers $2^a 3^b$ up to 400 are 1, 2, 3, 4, 6, 8, 9, 12, 16, 18, 24, 27, 32, 36, and 17 more (31 in all). Their values of $n^{-2}$ add up to 1.49997, and the infinite sum is exactly 1.5.

Bring in 5 as well. The numbers whose only prime factors are 2, 3, and 5 are 1, 2, 3, 4, 5, 6, 8, 9, 10, 12, 15, 16, 18, 20, 24, 25, 27, 30, and on up. The product of the three
geometric series is $\frac43 \cdot \frac98 \cdot \frac{25}{24} = \frac{25}{16} = 1.5625$, and that is the sum of $n^{-2}$ over all such numbers. What is missing from
$\zeta(2) = 1.6449$ is the contribution of the numbers with a prime factor of 7 or more. The more primes we multiply in, the fewer such numbers are left, and the gap should close. We name the numbers we are collecting.

:::: definition {#d-ep-smooth title="Smooth numbers"}
For a real number $N \ge 2$, a positive integer $n$ is $N$-smooth if every prime factor of $n$ is at most $N$. The
number 1 is $N$-smooth for every $N$, since it has no prime factors.
It is a property of an integer and not a size: 360 is 5-smooth, and $2^{1000}$ is 2-smooth. A prime $p > N$ is not $N$-smooth.
::::

To state exactly what the pictures suggest, write $\Pi_N(s) = \prod_{p \le N} (1 - p^{-s})^{-1}$ for the product over the
primes up to $N$. The two steps of the argument need a fact about positive series, so we record it first.

:::: lemma {#l-ep-nonneg title="Positive series can be rearranged and multiplied freely"}
Let $a_i \ge 0$ and $b_j \ge 0$ be two convergent series indexed by countable sets. Then $\sum_i a_i$ does not depend on the order of the terms, and
$$
\Bigl(\sum_i a_i\Bigr)\Bigl(\sum_j b_j\Bigr) = \sum_{(i, j)} a_i b_j,
$$
where the double sum can be taken in any order.
::::

::: proof
For nonnegative terms the sum in any order equals the supremum of the finite partial sums over all finite sets of indices, which
refers to no order. For the product, a finite set of pairs $(i, j)$ sits inside a rectangle $I \times J$ of finite sets, and
$\sum_{I \times J} a_i b_j = (\sum_I a_i)(\sum_J b_j) \le (\sum a_i)(\sum b_j)$. Taking the supremum gives
$\sum a_i b_j \le (\sum a_i)(\sum b_j)$, and taking rectangles to start with gives the reverse.
:::

This lemma is the reason absolute convergence matters. For real $s > 1$ every term of $\sum n^{-s}$ is positive, so the
lemma applies directly. When $s$ becomes complex, the terms $n^{-s}$ are complex but their absolute values are $n^{-\sigma}$, and
the same freedom holds whenever $\sum n^{-\sigma}$ converges. That is the proper meaning of "absolute convergence",
and it is why the product below will still be true on the half-plane $\Re s > 1$.

::::: card {#t-ep-euler kind="theorem" title="$\zeta(s)$ is the product over the primes of $1/(1-p^{-s})$" source="euler1737"}
:::: statement
For every real $s > 1$,
$$
\zeta(s) = \prod_{p} \frac{1}{1 - p^{-s}} = \lim_{N \to \infty} \Pi_N(s),
$$ {#eq-ep-product}
where the product runs over all primes. The partial products increase to $\zeta(s)$, and for every $N$,
$$
0 < \zeta(s) - \Pi_N(s) \le \sum_{n > N} n^{-s}.
$$
::::
:::: plain
A sum over every whole number equals a product with one factor per prime. Multiply in the factors for 2, 3, 5, and so on, and the product climbs to the sum.
::::
:::: why
Everything that follows rests on this equality. The left side is easy to estimate and has no mention of primes. The right side is made of primes and has no mention of arbitrary integers. Their equality is the only bridge between them. Without it there
would be no way to reach the primes by analysis.
::::
:::: idea
Each factor is a geometric series of the powers of one prime. Multiplying finitely many of them out produces the term $n^{-s}$ once for each way of writing $n$ as a product of primes from the list. Unique factorization says there is exactly one way, so the product is the sum over numbers built from those primes. The numbers left out all have a large prime factor, so they are large, and their total weight is a tail of a convergent series, which tends to 0.
::::
:::: proof
Fix $s > 1$ and an integer $N \ge 2$.

Step 1. For each prime $p$, $0 < p^{-s} < 1$, so the geometric series gives $(1 - p^{-s})^{-1} = \sum_{k \ge 0} p^{-ks}$, a convergent series of positive terms.

Step 2. Multiply the finitely many series for the primes $p \le N$. By the lemma on positive series, the product equals the sum, in any order, of all products of one term from each series. These products are $\prod_{p \le N} p^{-k_p s} = \bigl(\prod_{p \le N} p^{k_p}\bigr)^{-s}$, one for each choice of exponents $(k_p)_{p \le N}$ with every $k_p \ge 0$.

Step 3. The map from the exponent choices $(k_p)$ to the integers $n = \prod_{p \le N} p^{k_p}$ is a bijection onto the $N$-smooth numbers. It is onto because a smooth number factors into primes at most $N$. It is one-to-one by unique factorization. Hence $\Pi_N(s) = \sum_{n\ N\text{-smooth}} n^{-s}$, each smooth $n$ counted exactly once.

Step 4. All terms are positive, so $\Pi_N(s) \le \zeta(s)$, and $\Pi_N(s)$ increases with $N$ because it picks up more integers. The integers that are not $N$-smooth have a prime factor greater than $N$, so they are all greater than $N$. Therefore
$$
0 < \zeta(s) - \Pi_N(s) = \sum_{n\ \text{not}\ N\text{-smooth}} n^{-s} \le \sum_{n > N} n^{-s}.
$$
The right side is the tail of a convergent series and tends to 0 as $N \to \infty$. So $\Pi_N(s) \to \zeta(s)$.
::::
:::: example
At $s = 2$ and $N = 5$: $\Pi_5(2) = \frac{25}{16} = 1.5625$, and $\zeta(2) - \Pi_5(2) = 0.0824$, which is below the tail bound $\sum_{n > 5} n^{-2} = 0.1813$.
::::
:::: used
Used in the proof that $\sum 1/p$ diverges ([[t-ep-diverge]]), in the logarithmic derivative ([[t-ep-logderiv]]), and in every chapter that continues $\zeta$ or counts its zeros.
::::
:::::

The tail bound in the theorem is crude (the tail $\sum_{n>5} n^{-2}$ is more than twice the true gap) but it is honest, and it explains the speed. Here is the product at $s = 2$, assembled prime by prime:

| primes up to | $\Pi_N(2)$ | fraction of $\zeta(2)$ | gap $\zeta(2) - \Pi_N(2)$ |
| --- | --- | --- | --- |
| 2 | 1.3333 | 0.8106 | 0.3116 |
| 3 | 1.5000 | 0.9119 | 0.1449 |
| 5 | 1.5625 | 0.9499 | 0.0824 |
| 7 | 1.5951 | 0.9697 | 0.0499 |
| 11 | 1.6083 | 0.9778 | 0.0366 |
| 29 | 1.6331 | 0.9928 | 0.0119 |
| 97 | 1.6419 | 0.9982 | 0.0030 |
| 997 | 1.64473 | 0.99987 | 0.00021 |
| 99,991 | 1.644933 | 0.9999992 | 0.0000013 |

The prime 2 alone gives 81% of $\zeta(2)$, and the first three primes give 95%. After that the primes
contribute slowly: it takes the 25 primes up to 97 to reach 99.8%. This is because each new prime $p$ multiplies in a
factor $1 + p^{-2} + \cdots$ whose excess over 1 is about $1/p^2$, and the sum of $1/p^2$ over the primes, 0.452, is finite but spread thinly.

:::: figure {#f-ep-assembly viz="euler-assembly" height="460"}
Each time a prime is multiplied into the product, exactly the integers built from the primes used so far light up, each once, and the partial product is the total weight $n^{-s}$ of the lit integers.

```vizspec
Purpose: show the Euler product assembling prime by prime, and that every integer lights up exactly once.
Scene: top region, a grid of the integers 1..120 in 6 rows of 20. Each cell shows its integer. A cell is lit gold when
  the integer is N-smooth for the current N (all prime factors are among the primes multiplied in so far) and dark
  muted otherwise. Brightness of a lit cell is proportional to n^(-s), so large integers glow faintly. Prime cells
  are outlined in white when they are not yet lit. Below the grid, a horizontal bar from 0 to zeta(s) (value printed;
  for s = 2 also print pi^2/6): the filled part is Pi_N(s) in gold and the remaining gap is outlined in red, with the gap
  value printed. A row of prime chips 2, 3, 5, 7, 11, 13, ... the chips that have been multiplied in are filled.
  Readouts: the current factor 1/(1 - p^(-s)), Pi_N(s), the gap, and the sum of n^(-s) over the lit integers up to
  120 (always a little below Pi_N(s) because the grid stops at 120).
Controls: a "multiply in the next prime" button, a "back" button, a play button that adds a prime every 700 ms up to
  p = 113, and a slider for s from 1.2 to 4 (default 2). Clicking a cell shows a tooltip with the exponent
  vector of that integer, for example "360 = 2^3 * 3^2 * 5^1", and which chip lit it.
Motion: when a prime p is added, the newly smooth integers (those with p in their factorization and no prime above
  p) flash white and settle to gold; the bar grows by the factor 1/(1 - p^(-s)) with a short ease.
Reader takeaway: no integer lights twice (unique factorization) and none is skipped (every integer factors), so the
  product of factors equals the sum over lit integers; the gap is what has not yet lit.
Data: primes up to 113, smoothness table for 1..120 built in the browser, zeta(s) as in the first figure.
```
::::

## What the product says {#ep-meaning}

Look back at the proof and ask what it used. Step 3 used one fact about the integers, that every positive integer has exactly one factorization into primes. That fact has two halves, and each half is one inequality in the identity.

Existence of a factorization says every integer shows up as a term in the expanded product. If some integer had no factorization it would be missing, and the product would come out smaller than the sum. Uniqueness says it shows up only once. If some integer had two factorizations, its term would appear twice, and the product would come out larger than the sum. The Euler product is therefore not a coincidence of formulas. It is the fundamental theorem of arithmetic written as an identity between two functions of $s$, and it holds exactly when factorization into primes exists and is unique [@hardywright, Ch. 1].

There is a way to see how much is riding on that uniqueness. Consider the numbers of the form $4k + 1$: 1, 5, 9, 13, 17, and so on, a set closed under multiplication. Call a number in it irreducible if it is not a product of two smaller ones from the set. Then $693 = 9 \cdot 77 = 21 \cdot 33$ is a product of irreducibles in two different ways, so step 3 of the proof breaks for that set: the exponent choices no longer correspond one to one with the numbers. The integers have the property that makes the identity true, and that is the sense in which the product knows unique factorization.

The two sides also see the world differently. The sum over $n$ tells us how the integers are distributed, with every integer present and nothing hidden. The product tells us how the primes are distributed, since it has one factor for each prime and the size of $\zeta(s)$ at a given $s$ records how many primes there are and how large. A statement about primes, such as "there are roughly $x/\log x$ of them up to $x$," becomes a statement about the size of the left side, which we can compute in other ways. This is the thread that the rest of the page pulls.

## The primes are many: Euler's divergence of $\sum 1/p$ {#ep-divergence}

The first use Euler made of the product, in 1737, was to show that the primes are plentiful in a sharp sense: the sum of their reciprocals diverges [@euler1737]. Euclid's theorem only says there are infinitely many primes. This says more: the reciprocals of the squares add up to a finite number, $\sum 1/n^2 = 1.6449\ldots$, so in the sense of reciprocal sums the primes are denser than the squares.

The plan is to use the product at $s$ just above 1, where the left side is huge, and to read off that the right side must be huge too. A product is awkward, so take the logarithm of it to get a sum over primes. For $0 \le u < 1$ the series $-\log(1 - u) = \sum_{k \ge 1} u^k/k$ holds, so the logarithm of each factor is
$$
-\log(1 - p^{-s}) = \sum_{k \ge 1} \frac{p^{-ks}}{k}.
$$
Applying this to $\Pi_N(s)$ and letting $N \to \infty$ (the logarithm is continuous, and all terms are positive, so the order of summation is free) gives
$$
\log \zeta(s) = \sum_p \sum_{k \ge 1} \frac{p^{-ks}}{k} = P(s) + R(s),
$$ {#eq-ep-logzeta}
where $P(s) = \sum_p p^{-s}$ collects the $k = 1$ terms, the prime zeta function, and $R(s)$ collects the rest.

The idea of the proof is that $R(s)$ is a bounded nuisance, and $P(s)$ is what we want. Here is the bound.

::::: card {#t-ep-diverge kind="theorem" title="The sum of the reciprocals of the primes diverges" source="euler1737"}
:::: statement
$$
\sum_{p} \frac{1}{p} = \infty.
$$
More precisely, for all $s > 1$ we have $\log \zeta(s) - \tfrac12 < P(s) < \log \zeta(s)$.
::::
:::: plain
The primes do not thin out fast enough for their reciprocals to add up to a finite number. Add enough of them and the total passes any bound you name, though it takes a very long time.
::::
:::: why
It is the first quantitative statement about the primes beyond Euclid, and it is proved by the method that will carry the whole page: take the product, take its logarithm, and compare with the behavior of $\zeta$ near its singular point $s = 1$.
::::
:::: idea
Taking logarithms of the Euler product turns it into a sum over primes plus a small remainder. Since $\zeta(s)$ blows up as $s \to 1^+$, the sum over primes must blow up too, and a convergent sum cannot do that.
::::
:::: proof
The upper bound holds because $R(s) > 0$. For the lower bound, take $s \ge 1$. For $k \ge 2$ we have $p^{-ks} \le p^{-k}$ and $1/k \le 1/2$, so
$$
R(s) \le \frac12 \sum_p \sum_{k \ge 2} p^{-k} = \frac12 \sum_p \frac{1}{p(p-1)} < \frac12 \sum_{n \ge 2} \frac{1}{n(n-1)} = \frac12,
$$
using the geometric sum $\sum_{k \ge 2} p^{-k} = 1/(p(p-1))$ and the telescoping $\frac{1}{n(n-1)} = \frac{1}{n-1} - \frac1n$, whose sum over $n \ge 2$ is 1. Hence $P(s) = \log\zeta(s) - R(s) > \log \zeta(s) - \frac12$.

By [[p-ep-bounds]], $\zeta(s) > 1/(s-1)$, which tends to infinity as $s \to 1^+$. So $P(s) \to \infty$ as $s \to 1^+$. Suppose $\sum_p 1/p$ converged to a finite value $S$. Then for every $s > 1$, $P(s) = \sum_p p^{-s} \le \sum_p p^{-1} = S$, which contradicts $P(s) \to \infty$. So the sum diverges.
::::
:::: example
At $s = 2$: $\log\zeta(2) = 0.4977$ and $P(2) = 0.4522$, a difference of $0.0455$. At $s = 1.01$: $\log \zeta = 4.6109$, $P = 4.3027$, difference $0.3083$.
::::
:::: used
The idea of comparing a prime sum with $\zeta$ near $s = 1$ returns, with $\Lambda$ in place of $1/p$, in [[t-ep-logderiv]] and in the proof of the prime number theorem sketched in [[t-cp-pnt]]. The weights in [[t-ep-logderiv]] come from differentiating [[eq-ep-logzeta]].
::::
:::::

Here is the proof at work on the numbers. As $s$ falls toward 1, $\log\zeta(s)$ and $P(s)$ both grow without bound while their difference $R(s)$ stays below 1/2:

| $s$ | $\log\zeta(s)$ | $P(s)$ | $R(s)$ |
| --- | --- | --- | --- |
| 3 | 0.1840 | 0.1748 | 0.0093 |
| 2 | 0.4977 | 0.4522 | 0.0455 |
| 1.5 | 0.9603 | 0.8496 | 0.1107 |
| 1.1 | 2.3594 | 2.1088 | 0.2505 |
| 1.01 | 4.6109 | 4.3027 | 0.3083 |
| 1.001 | 6.9083 | 6.5934 | 0.3150 |

The remainder creeps up to 0.3157 and no further. That limit is $\gamma_E - M$, with $\gamma_E$ Euler's constant and $M = 0.2615\ldots$ the constant that appears next. The bound of $1/2$ in the proof is not sharp, and it does not need to be.

::: aside
Euler's 1737 paper puts the result in words: the sum of the reciprocals of the primes is infinite, yet infinitely smaller than the sum of the harmonic series, of which it is roughly the logarithm. The harmonic series $\sum 1/n$ grows like $\log x$ and the prime sum grows like $\log\log x$, so the primes are much sparser than all integers and much denser than the squares.
:::

How fast does it diverge? Euler's remark is exactly right, and Mertens made it precise in 1874 [@mertens1874]. Before the card, here is the outline in plain terms. In chapter [[counting-primes]] the primes near $t$ have density $1/\log t$, so we expect $\sum_{p \le x} 1/p \approx \int_2^x \frac{\dd t}{t \log t} = \log\log x - \log\log 2$, since $\frac{\dd}{\dd t}\log\log t = \frac{1}{t\log t}$. A constant is left undetermined, and Mertens identifies it.

::::: card {#t-ep-mertens kind="theorem" title="The sum of $1/p$ up to $x$ is $\log\log x$ plus a constant" source="mertens1874"}
:::: statement
There is a constant $M = 0.2614972\ldots$ such that
$$
\sum_{p \le x} \frac{1}{p} = \log\log x + M + O\!\left(\frac{1}{\log x}\right).
$$
::::
:::: plain
Add up $1/p$ over the primes up to $x$ and you get the double logarithm of $x$ plus a fixed constant, with an error that shrinks like $1/\log x$.
::::
:::: why
It shows the density $1/\log t$ of chapter [[counting-primes]] is right at the level of sums, using only elementary information. It is also the cleanest example of passing from the weights $\Lambda(n)$ to the plain count of primes, by partial summation, the technique of [[l-cp-abel]].
::::
:::: idea
Start from the weighted sum $\sum_{n \le x} \Lambda(n)/n = \log x + O(1)$, which says that the weights average to 1 against $\dd t/t$. Dividing each term by $\log n$ and applying partial summation turns $\log x$ into $\log\log x$.
::::
:::: sketch {source="mertens1874"}
The input is Mertens's first theorem, $A(t) = \sum_{n \le t} \Lambda(n)/n = \log t + r(t)$ with $\lvert r(t)\rvert \le C$ [@apostol, Ch. 4; @montgomeryvaughan, Ch. 2]. Apply [[l-cp-abel]] with $a_n = \Lambda(n)/n$ and $f(t) = 1/\log t$:
$$
\sum_{n \le x} \frac{\Lambda(n)}{n \log n} = \frac{A(x)}{\log x} + \int_2^x \frac{A(t)}{t \log^2 t}\, \dd t = 1 + \frac{r(x)}{\log x} + \log\log x - \log\log 2 + \int_2^x \frac{r(t)}{t \log^2 t}\, \dd t.
$$
The last integral converges as $x \to \infty$ and its tail beyond $x$ is at most $C/\log x$, so the left side is $\log\log x + c_1 + O(1/\log x)$. The left side equals $\sum_{p^k \le x} 1/(k p^k)$, and the terms with $k \ge 2$ sum to a constant $c_2$ up to $O(x^{-1/2})$. Subtract: $M = c_1 - c_2$.
::::
:::: example
At $x = 10^6$ the sum is 2.88733 and $\log\log x + M = 2.88729$.
::::
:::: used
Confirms the density $1/\log t$ that stands behind [[d-cp-li]], at the level of sums.
::::
:::::

It is worth looking at the table, because the agreement is startling. Here is the partial sum $\sum_{p \le x} 1/p$ against the formula:

| $x$ | $\sum_{p \le x} 1/p$ | $\log\log x + M$ | difference |
| --- | --- | --- | --- |
| $10$ | 1.17619 | 1.09553 | 0.0807 |
| $10^2$ | 1.80282 | 1.78868 | 0.0141 |
| $10^3$ | 2.19808 | 2.19414 | 0.0039 |
| $10^4$ | 2.48306 | 2.48182 | 0.0012 |
| $10^5$ | 2.70527 | 2.70497 | 0.00030 |
| $10^6$ | 2.88733 | 2.88729 | 0.000039 |
| $10^7$ | 3.04145 | 3.04144 | 0.0000096 |

The theorem promises an error of size $1/\log x$, which is 0.07 at $x = 10^6$, and the real error is nearly two thousand times smaller. This is a fine example of the
bound being weaker than the truth. It also shows how slowly the sum diverges. The partial sum first passes 1 at $p = 5$, passes 2 at $p = 277$, and passes 3 at $p = 5{,}195{,}977$. By the formula it would reach 4 only near $x \approx 1.8 \times 10^{18}$, an estimate from the theorem and not a computation. A divergence this slow is a divergence in principle.

:::: figure {#f-ep-sumprimes viz="sum-reciprocal-primes" height="400"}
The sum of $1/p$ over primes up to $x$ grows without bound but so slowly that it follows $\log\log x + M$ to four decimal places by $x = 10^6$.

```vizspec
Purpose: show how slowly the sum of 1/p diverges, and how well log log x + M fits it.
Scene: horizontal axis log10(x) from 1 to a right end R (default 7, slider range 2 to 7), ticks at each integer. Vertical
  axis from 0 to 4. Draw S(x) = sum over primes p <= x of 1/p as a gold step curve (one step per prime; at the right
  end merge steps into a polyline per pixel column). Draw log(log x) + M in blue (M = 0.2614972128). Draw, in muted, the
  harmonic partial sum H(x) = log x + 0.5772157 (cut off at the top of the plot) so the viewer sees how much faster the
  integers diverge. Draw dotted horizontal lines at heights 1, 2, 3 with a marker on the gold curve where S first
  reaches each, labeled with the prime: p = 5, p = 277, p = 5195977.
Controls: slider for the right end R; a two-way toggle "sum and fit" / "difference": in difference mode the vertical
  axis shows S(x) - log(log x) - M from -0.02 to 0.1 in gold, with a red band +/- 1/log(x) behind it; hovering shows x,
  S(x), log log x + M, and the difference.
Motion: the curve reveals left to right over 1.5 seconds when the figure first scrolls into view, and rescales with a
  300 ms ease when R changes.
Reader takeaway: the sum is unbounded, and the divergence is a double logarithm, absurdly slow; and the fit is much better than the guaranteed 1/log x. The sum first passes 2.5 at p = 11789 and 3 at p = 5195977.
Data: sieve once up to 10^7 in idle time and store the partial sums at 800 log-spaced points plus the three marked
  primes. Nothing is computed per frame.
```
::::

## The logarithmic derivative: where the weights come from {#ep-logderiv}

We now have the product, and we have used it to learn about the primes through a logarithm. The logarithm of a product is a sum of the logarithms of the factors, and the derivative of that sum is the sum of the derivatives. Doing both at once gives a new object, a sum over primes with a weight attached to each. That weight will turn out to be the $\Lambda(n)$ of chapter [[counting-primes]]. This is the main goal of the chapter.

::: recall
**Logarithmic derivative.** For a differentiable function $f$ that is positive, the logarithmic derivative is $f'/f = (\log f)'$. It turns products into sums: $(fg)'/(fg) = f'/f + g'/g$, because $\log(fg) = \log f + \log g$. It measures the relative rate of change, so a function that grows like $e^{cs}$ has logarithmic derivative $c$.
:::

Before the formal statement, here is what it says and why we want it. The weights $\Lambda(n)$ are what remain when $\log n$ is divided among prime powers ([[l-cp-lam-sum]]). A function whose coefficients are exactly these weights would let us read $\psi(x) = \sum_{n \le x}\Lambda(n)$ out of it by partial summation. The theorem says that function is $-\zeta'/\zeta$.

::::: card {#t-ep-logderiv kind="theorem" title="Minus the logarithmic derivative of $\zeta$ is the Dirichlet series of the von Mangoldt weights" source="apostol"}
:::: statement
For every real $s > 1$,
$$
-\frac{\zeta'(s)}{\zeta(s)} = \sum_{n=1}^{\infty} \frac{\Lambda(n)}{n^s},
$$ {#eq-ep-logderiv}
with $\Lambda$ as in [[d-cp-lambda]].
::::
:::: plain
Differentiate the logarithm of the Euler product. Each prime power $p^k$ contributes $\log p$ as the coefficient of $p^{-ks}$, and nothing else is there. The resulting series is the one with the weights $\Lambda(n)$.
::::
:::: why
The primes now appear as coefficients of a series, weighted in exactly the way that made $\psi(x)$ the natural count. The error question of chapter [[counting-primes]] therefore becomes a question about how $-\zeta'/\zeta$ behaves, and that is where zeros of $\zeta$ will enter, since a zero of $\zeta$ is a pole of $\zeta'/\zeta$.
::::
:::: idea
Take the logarithm of the product and differentiate term by term. Each factor $1/(1 - p^{-s})$ has a logarithmic derivative that expands as a geometric series in $p^{-s}$, with $\log p$ in every term. Unique factorization again guarantees each $n$ appears at most once.
::::
:::: proof
Step 1. Take the logarithm of [[eq-ep-product]]: $\log\zeta(s) = -\sum_p \log(1 - p^{-s})$, as in [[eq-ep-logzeta]].

Step 2. Differentiate one term. Since $\frac{\dd}{\dd s} p^{-s} = -(\log p)\, p^{-s}$, we get $\frac{\dd}{\dd s}\bigl[-\log(1 - p^{-s})\bigr] = -\frac{(\log p)\, p^{-s}}{1 - p^{-s}}$.

Step 3. Differentiate the whole sum term by term. This is allowed when the series of derivatives converges uniformly on every interval $[\sigma_0, \infty)$ with $\sigma_0 > 1$. Here $1 - p^{-s} \ge \tfrac12$, so each term has absolute value at most $2 (\log p)\, p^{-\sigma_0}$, and $\sum_p (\log p)\, p^{-\sigma_0}$ converges because $\log n \le C n^{\delta}$ for any $\delta > 0$ and a suitable $C$, which with $\delta = (\sigma_0 - 1)/2$ bounds the series by a convergent $\sum n^{-(1 + \sigma_0)/2}$. Hence
$$
\frac{\zeta'(s)}{\zeta(s)} = -\sum_p \frac{(\log p)\, p^{-s}}{1 - p^{-s}}.
$$

Step 4. Expand each term as a geometric series, $\frac{p^{-s}}{1 - p^{-s}} = \sum_{k \ge 1} p^{-ks}$:
$$
-\frac{\zeta'(s)}{\zeta(s)} = \sum_p \sum_{k \ge 1} (\log p)\, p^{-ks}.
$$

Step 5. Every prime power $n = p^k$ with $k \ge 1$ appears exactly once in this double sum, since $p$ and $k$ are determined by $n$, and its coefficient is $\log p = \Lambda(n)$. Integers that are not prime powers appear nowhere, and $\Lambda$ is 0 there. All terms are positive, so the order of summation is free, and the double sum is $\sum_{n \ge 1} \Lambda(n) n^{-s}$.
::::
:::: example
At $s = 2$, $-\zeta'(2)/\zeta(2) = 0.93755/1.64493 = 0.56996$. The series gives $\frac{\log 2}{4} + \frac{\log 3}{9} + \frac{\log 2}{16} + \frac{\log 5}{25} + \frac{\log 7}{49} + \frac{\log 2}{64} + \frac{\log 3}{81} = 0.1733 + 0.1221 + 0.0433 + 0.0644 + 0.0397 + 0.0108 + 0.0136 = 0.4672$ for $n \le 10$, and climbs toward the target as $n$ grows, as the next table shows.
::::
:::: used
Used in [[t-cp-pnt]] (the generating series of the weights), in the contour integral of chapter [[explicit-formula]], and in the zero-free region of chapter [[zeros]].
::::
:::::

Here are the partial sums at $s = 2$, where the target is $0.5699610$:

| $N$ | $\sum_{n \le N} \Lambda(n)\, n^{-2}$ |
| --- | --- |
| 10 | 0.46716 |
| 100 | 0.55953 |
| 1,000 | 0.56896 |
| $10^6$ | 0.56996 |

At $s = 3$ the target is $0.1648227$ and the sum to $10^6$ agrees to eight digits. At $s = 1.5$ it is slower: the target is $1.50524$ and the sum to $10^6$ is $1.50323$, because as $s$ falls to 1 the tail matters more. This is the same slow behavior we saw for $\zeta(s)$.

The same identity comes out by a second route that avoids the product, and it is worth seeing because it explains the name of the weights. Differentiating $\sum n^{-s}$ term by term gives $-\zeta'(s) = \sum_n (\log n)\, n^{-s}$. Replace $\log n$ by $\sum_{d \mid n}\Lambda(d)$, which is [[l-cp-lam-sum]]. Write $n = dm$, so that the sum over $n$ and its divisors $d$ becomes a sum over pairs $(d, m)$:
$$
-\zeta'(s) = \sum_{d, m} \Lambda(d)\, (dm)^{-s} = \Bigl(\sum_d \Lambda(d)\, d^{-s}\Bigr)\Bigl(\sum_m m^{-s}\Bigr) = \Bigl(\sum_d \Lambda(d)\, d^{-s}\Bigr)\, \zeta(s).
$$
Here the lemma on positive series allows the rearrangement. Dividing by $\zeta(s)$ gives [[eq-ep-logderiv]] again. The two routes meet: the identity $\sum_{d \mid n}\Lambda(d) = \log n$ is the multiplication-of-series form of the identity $\zeta'/\zeta = \sum_p \ldots$. The weights $\Lambda$ are exactly the numbers that make $\zeta \cdot (\sum\Lambda(d)d^{-s}) = -\zeta'$ hold, and that is why they are the natural weights.

:::: figure {#f-ep-logderiv viz="log-derivative" height="500"}
Adding the terms $\Lambda(n)\, n^{-s}$ one integer at a time builds up $-\zeta'(s)/\zeta(s)$, and the prime powers are what carry the total.

```vizspec
Purpose: show the series sum of Lambda(n) n^(-s) converging to -zeta'(s)/zeta(s), and how the terms are arranged.
Scene: two panels. Left: axes n from 1 to N horizontally (N from the slider) and heights vertically. Draw a stem at
  each n whose height is the term Lambda(n) * n^(-s): gold stems at primes, lighter gold at prime powers p^k with
  k >= 2, labeled with p^k when N <= 64. Superimpose the running total as a blue curve using a second vertical scale
  on the right edge, rising to a horizontal dashed blue line at the target -zeta'(s)/zeta(s). The gap between the
  curve and the dashed line is shaded red and its value printed. Right panel: s from 1.05 to 4 horizontally, with
  the curve -zeta'(s)/zeta(s) in blue and the curve 1/(s-1) - 0.5772157 in muted dashed, which hugs it near s = 1;
  the current s is marked by a dot, tied to the left panel's target line.
Controls: slider for s from 1.2 to 4 (default 2); slider for N on a log scale from 10 to 2000 (default 100); a play
  button that raises N from 10 to 2000 over 8 seconds.
Motion: during play, stems drop in left to right and the blue curve extends; changing s rescales the stem heights with
  a 200 ms ease.
Reader takeaway: for large s the first few prime powers give nearly the whole value; as s approaches 1 the sum needs
  more and more terms and the target line shoots up like 1/(s-1), which is the pole of zeta'/zeta at s = 1.
Data: target -zeta'(s)/zeta(s) is computed in the browser as the sum of Lambda(n) n^(-s) for n <= 200000 plus the tail
  estimate 200000^(1-s)/(s-1); relative accuracy better than 1e-3 for s >= 1.2. Lambda from a sieve to 200000.
```
::::

## Why a sum over primes, turned into a function, is worth having {#ep-bridge}

A function is a tool that a sum over primes was not. Let us name what we can do with the function, and then state the one equation that makes it all concrete.

By partial summation, [[l-cp-abel]] with $a_n = \Lambda(n)$ and $f(t) = t^{-s}$ turns the series of [[eq-ep-logderiv]] into an integral of $\psi$:
$$
-\frac{\zeta'(s)}{\zeta(s)} = \sum_n \Lambda(n) n^{-s} = s \int_1^\infty \psi(t)\, t^{-s-1}\, \dd t.
$$ {#eq-ep-mellin}
The boundary term $\psi(x)\, x^{-s}$ vanishes as $x \to \infty$ because $\psi(x) \le x \log x$ and $s > 1$. Test it with the crudest guess, $\psi(t) = t$: the right side is $s\int_1^\infty t^{-s}\, \dd t = s/(s-1)$, which has a pole at $s = 1$ with residue 1, exactly the pole $-\zeta'/\zeta \approx 1/(s-1)$ that we saw numerically. Write $\psi(t) = t + E(t)$ and the right side splits as
$$
\frac{s}{s-1} + s \int_1^\infty E(t)\, t^{-s-1}\, \dd t.
$$
The first piece is the main term and carries the pole. The second piece is the error. If $E(t) = O(t^\theta)$ then the integral converges absolutely for every $s$ with real part above $\theta$, and the second piece is a perfectly good function there. This is the mechanism the chapters ahead will make rigorous. A good bound for the error of $\psi$ makes $-\zeta'/\zeta$ tame in a large region, and since a zero of $\zeta$ is a pole of $\zeta'/\zeta$, it keeps the zeros of $\zeta$ out of that region. The Riemann Hypothesis is the extreme case, $\theta$ just above $1/2$. The whole question of how far $\psi$ strays from $x$ has become a question about where a function is singular.

Here is a ledger of what each way of writing $\zeta$ buys us.

| written as | gives | used for |
| --- | --- | --- |
| the sum $\sum n^{-s}$ | estimates, the pole at $s = 1$, a function to continue | chapters [[complex-toolkit]] and [[zeta-continued]] |
| the product over primes | unique factorization as an identity, $\sum 1/p = \infty$ | this chapter |
| the logarithmic derivative | the weights $\Lambda(n)$ as coefficients, $\psi$ as an integral | chapters [[zeros]] and [[explicit-formula]] |

There is one limitation to face. Everything in this chapter was done for real $s > 1$. The series stops converging at $s = 1$, the product stops making sense there too, and the zeros that govern the primes are not on the real line at all. They sit at complex $s$ with real part at most 1. To see them, we must extend $\zeta$ to complex values of $s$, and then to the left of the line $\Re s = 1$ where the defining series has failed. Chapter [[complex-toolkit]] collects the complex analysis that makes this possible, and chapter [[zeta-continued]] does it.

::: symbols
| Symbol | What it is | Kind | Where it lives |
| --- | --- | --- | --- |
| $\zeta(s)$ | $\sum_{n \ge 1} n^{-s}$ | function of a real $s > 1$ for now | [[d-ep-zeta]] |
| $\Pi_N(s)$ | $\prod_{p \le N}(1 - p^{-s})^{-1}$, partial Euler product | function of $s$, for each $N$ | [[t-ep-euler]] |
| $N$-smooth | all prime factors at most $N$ | property of an integer | [[d-ep-smooth]] |
| $P(s)$ | $\sum_p p^{-s}$, the prime zeta function | function of a real $s > 1$ | [[eq-ep-logzeta]] |
| $\gamma_E$ | Euler's constant, $0.5772\ldots$ | constant | [[p-ep-bounds]] |
| $M$ | Mertens's constant, $0.2615\ldots$ | constant | [[t-ep-mertens]] |
:::

::: recap
You now have $\zeta(s)$ for real $s > 1$, squeezed between $1/(s-1)$ and $s/(s-1)$. You have the Euler product with a complete proof, including why a positive series may be multiplied out and rearranged, and you know it is unique factorization written as an identity. You have Euler's proof that $\sum 1/p$ diverges, and its true size, $\log\log x + 0.2615$. You have derived $-\zeta'/\zeta = \sum \Lambda(n) n^{-s}$ step by step, in two ways, and the integral form [[eq-ep-mellin]] that connects it to $\psi$. The primes now sit inside one function, and chapters [[complex-toolkit]] and [[zeta-continued]] extend that function to complex $s$.
:::
