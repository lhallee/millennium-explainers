---
id: counting-primes
title: Counting primes
part: 1
summary: State the prime number theorem, see in real numbers how good its estimate is, and name the question the whole page answers, how large the error can be.
needs: []
---

::: plain
A prime is a whole number above 1 that only 1 and itself divide. Primes show up with no visible pattern, yet the
count of them up to $x$ follows a smooth curve very closely: at $x = 10^9$ there are 50,847,534 primes, and the curve
is off by about 1,700. The Riemann Hypothesis is a statement about how large that error can be. This chapter builds
the count, the curve, and the sharpest form of the question.
:::

Every later chapter studies one function that has the primes folded inside it. Before we can build it, we need to be
exact about what must be folded in, and about the right way to weigh each prime. That is the job here. We define the
staircase that counts primes, Gauss's smooth guess for it, and the theorem that the guess is right in the long run.
Then we measure the guess against real counts, ask how large the leftover error is, and switch to a second count,
weighted by $\log p$, in which the formulas of the next chapters come out clean.

## What we are counting {#cp-primes}

The primes begin 2, 3, 5, 7, 11, 13, and there are 25 of them below 100:

2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97.

Euclid showed over two thousand years ago that the list never ends (Book IX, Proposition 20 of the *Elements*). He
did not say how fast it grows. The first honest question about the primes is a counting question: how many are there
up to a given size? We give that count a name.

:::: definition {#d-cp-pi title="The prime counting function"}
For a real number $x$, let $\pi(x)$ be the number of primes $p$ with $p \le x$.
It is a function of a real variable, defined for every $x \ge 0$, with $\pi(x) = 0$ for $x < 2$. It is a step
function: it stays constant between consecutive primes and jumps up by exactly 1 at each prime. It is not a formula
for the primes, and it is not the constant $3.14159\ldots$ that happens to share its letter.
::::

Test it on the smallest cases. Four primes lie at or below 10, so $\pi(10) = 4$. The next prime is 11, so
$\pi(10.9) = 4$ and $\pi(11) = 5$: the function sits at 4 for the whole stretch from 7 to 11, then jumps. The same
counting gives $\pi(100) = 25$ and $\pi(1000) = 168$.

It helps to read $\pi(x)/x$ as the share of the numbers up to $x$ that are prime. That share is 40% up to 10, 25% up
to 100, 16.8% up to 1000, 7.85% up to a million, and 5.1% up to a billion. It keeps falling and never reaches 0, and
the fall slows down: each tenfold step in $x$ takes a smaller bite. Primes thin out, but gently. The shares sit close to
$1/\log x$: that is 7.2% at a million, against the true 7.85%, and 4.8% at a billion, against 5.1%. A share that
falls like the reciprocal of a logarithm is what Gauss spotted in his tables, and the next section follows his lead.

The graph of $\pi$ is a staircase with one step per prime. [[f-cp-staircase]] lets you stand at different distances
from it. Near $x = 50$ you see each step. Pull back to $x = 10^6$ and the 78,498 steps blur into a smooth, bending
curve. That blurring is the phenomenon this chapter explains.

:::: figure {#f-cp-staircase viz="prime-staircase" height="420"}
Zoom out far enough and the jagged staircase of the primes turns into a smooth curve, which the logarithmic integral
$\Li(x)$ follows.

```vizspec
Purpose: let the reader feel the staircase pi(x) smooth out as the range grows, and see Li(x) ride along with it.
Scene: one plot, linear axes, x horizontal from 0 to Xmax, y vertical from 0 to 1.05 * pi(Xmax). Draw pi(x) in
  gold as a true staircase: a horizontal segment at height k on [p_k, p_{k+1}) and a vertical riser at each prime
  p_k. When Xmax is above about 2000, steps are narrower than a pixel, so draw one vertical line per pixel column
  from the minimum to the maximum of pi over that column (keeps the drawing cost fixed). For Xmax <= 200 put a
  small tick on the baseline at each prime, and for Xmax <= 100 print the prime under the tick. Optional overlays
  in blue: Li(x), a smooth curve; and x / log x as a thinner dashed curve. Both overlays start off.
Controls: a slider for Xmax on a logarithmic scale from 50 to 1,000,000 (position t in [0,1] maps to
  Xmax = 50 * 20000^t), with the current value printed beside it. Two checkboxes, "show Li(x)" and "show x / log x".
  A button "zoom out" that moves the slider from 50 to the maximum over 6 seconds. Hovering a point on the plot
  shows x, pi(x), Li(x), and Li(x) - pi(x) in a readout.
Motion: when the slider moves, the axes rescale with a 300 ms ease so that steps visibly shrink and merge.
  Nothing runs while the figure is off screen. With reduced motion, the button jumps to the end instead.
Reader takeaway: the staircase has an average slope that falls slowly as x grows (primes thin out), and a smooth
  curve, Li(x), follows it so closely that at x = 10^6 the two are indistinguishable at plot scale.
Data: sieve of Eratosthenes in the browser up to 1,000,000 (a 1 MB byte array). Li(x) tabulated at 2000 points
  with Simpson's rule on the substitution u = log t, from t = 2 to 1,000,000, then interpolated.
```
::::

## Gauss's guess: a density of $1/\log x$ {#cp-gauss}

We want a formula for the height of the smooth curve. Start from a local question: if you pick a whole number near
$x$, how likely is it to be prime? Count in short windows and compare to $1/\log x$, where $\log$ is the natural
logarithm.

| window | length | primes found | length / $\log$(middle of window) |
| --- | --- | --- | --- |
| 100 to 200 | 100 | 21 | 19.96 |
| $10^6$ to $10^6 + 1000$ | 1000 | 75 | 72.38 |
| $10^9$ to $10^9 + 1000$ | 1000 | 49 | 48.25 |

The agreement is rough in each window, and nothing in any one window should be exact, because a window holds only a
few dozen primes. But across three orders of magnitude the pattern holds: the chance that a number near $x$ is prime
is about $1/\log x$, which is the same as saying the average gap between consecutive primes near $x$ is about
$\log x$. Near a million primes are about 14 numbers apart. Near $10^9$ they are about 21 apart.

A heuristic explains why the answer is a logarithm, and not only that it is. A number $n$ near $x$ is prime exactly
when none of the primes up to $\sqrt{x}$ divides it. A fraction $1 - 1/p$ of all numbers escapes a given prime $p$,
so if divisibility by different primes were independent, the fraction of survivors would be the product of
$1 - 1/p$ over $p \le \sqrt{x}$. Mertens proved that such a product up to $y$ behaves like $e^{-\gamma_E}/\log y$
[@mertens1874], where $\gamma_E = 0.5772\ldots$ is Euler's constant. With $y = \sqrt{x}$ this predicts a density of
$2e^{-\gamma_E}/\log x = 1.123/\log x$. The shape is right and the constant is 12% too high, because divisibility by
primes close to $\sqrt{x}$ is not independent. We use the heuristic only as a reason to expect a logarithm. The true
density, $1/\log x$, is what the prime number theorem will deliver.

::: aside
Gauss wrote to Encke in 1849 that he had arrived at the $1/\log x$ density from tables of primes in the 1790s, as a
teenager. He never published a proof, and none existed until 1896. Legendre had published a different formula in
1808, $\pi(x) \approx x/(\log x - 1.08366)$, with the constant fitted to the tables he had. We test both below.
:::

This is a guess from data, not a derivation, and we say so. What we do with it is turn it into a formula. If the
density of primes at height $t$ is $1/\log t$, then the count up to $x$ should be the accumulated density, an integral.

:::: definition {#d-cp-li title="The logarithmic integral"}
For a real number $x \ge 2$, define
$$
\Li(x) = \int_2^x \frac{\dd t}{\log t}.
$$ {#eq-cp-li}
It is a smooth, increasing function of a real variable, given by an integral. It is not a step function and it has no
closed form in elementary functions. It is not $\pi(x)$: it is the estimate we compare $\pi(x)$ to.
::::

The lower limit is 2 because $1/\log t$ blows up at $t = 1$. Many books integrate from 0 instead and call the result
$\li(x)$. The two differ by the constant $\li(2) = 1.0452\ldots$, which does not matter for anything below.

Test it on the smallest cases, with every number computed. $\Li(100) = 29.08$ while $\pi(100) = 25$, and $\Li(1000) =
176.56$ while $\pi(1000) = 168$. The simpler guess $x/\log x$ gives 21.71 and 144.76 at the same two points, so it
undershoots where $\Li$ overshoots.

Why is $\Li$ the better estimate? Integrate by parts once, using that $\log t$ differentiates to $1/t$:
$$
\Li(x) = \frac{x}{\log x} - \frac{2}{\log 2} + \int_2^x \frac{\dd t}{\log^2 t}.
$$ {#eq-cp-li-parts}
So $\Li(x)$ is $x/\log x$ plus a correction that is itself an integral of the same shape one power of $\log$ down.
Repeating the step peels off $x/\log^2 x$, then $2x/\log^3 x$, and so on. At $x = 10^6$ the pieces climb toward the
truth: $x/\log x = 72{,}382$, adding $x/\log^2 x$ gives 77,622, adding $2x/\log^3 x$ gives 78,380, against
$\Li(10^6) = 78{,}627$ and $\pi(10^6) = 78{,}498$. The leading term $x/\log x$ throws away the corrections, and at this
size they are still 8% of the answer.

## The prime number theorem {#cp-pnt}

We now want the statement that makes Gauss's guess a theorem. It should say that the relative error disappears as $x$
grows. Two pieces of shorthand: $f \sim g$ means $f(x)/g(x) \to 1$ as $x \to \infty$, and $f = O(g)$ means
$\lvert f \rvert \le C g$ for some constant $C$ and all large $x$.

::: recall
**Asymptotic notation.** $f \sim g$ says the ratio tends to 1, so $x^2 + x \sim x^2$, because $(x^2 + x)/x^2 = 1 + 1/x
\to 1$. The statement $f = O(g)$ only bounds the size, so $\sin x = O(1)$, and $\sin x$ is not asymptotic to anything
that tends to a nonzero constant. Writing $\pi(x) = \Li(x) + O(h(x))$ says the difference between the two counts, not
their ratio, is at most a constant times $h(x)$.
:::

::::: card {#t-cp-pnt kind="theorem" title="The number of primes up to $x$ is asymptotic to $x/\log x$" source="hadamard1896"}
:::: statement
As $x \to \infty$,
$$
\pi(x) \sim \frac{x}{\log x}, \qquad \text{equivalently} \qquad \pi(x) \sim \Li(x).
$$
More precisely there is a constant $c > 0$ with
$$
\pi(x) = \Li(x) + O\!\left(x\, e^{-c\sqrt{\log x}}\right).
$$
::::
:::: plain
Divide the true count by the estimate and the ratio tends to 1. At any fixed finite $x$ the estimate is still off, but
the fraction by which it is off shrinks to nothing.
::::
:::: why
It turns the data pattern of the last section into a fact about all large $x$. Everything after it is about the rate: how fast does the relative
error go to 0, and what does the size of the error depend on? The Riemann Hypothesis answers that precisely.
::::
:::: idea
Chapter [[euler-product]] packs the primes into one function, $\zeta(s)$, and the logarithmic derivative of $\zeta$ has the weighted
prime count of [[cp-lambda]] as its coefficients. Counting primes then becomes a contour integral of $\zeta'/\zeta$.
The integral is controlled by where $\zeta$ vanishes. The qualitative theorem needs only that $\zeta$ never vanishes
on the line $\Re s = 1$. The error term above comes from a slightly wider zero-free region. The sharp error needs
no zero to the right of the line $\Re s = 1/2$, and that is exactly the Riemann Hypothesis.
::::
:::: sketch {source="davenport"}
Main line. (1) By the dictionary of [[cp-dictionary]], $\pi(x) \sim x/\log x$ is equivalent to $\psi(x) \sim x$, where
$\psi$ is the weighted count of [[cp-lambda]]. (2) The generating series of the weights is $-\zeta'(s)/\zeta(s)$
([[t-ep-logderiv]]). (3) After continuing $\zeta$ to the complex plane ([[zeta-continued]]) one shows it has no zero on
$\Re s = 1$ ([[zeros]]). (4) A contour integral (Perron's formula, [[explicit-formula]]) converts that into
$\psi(x) \sim x$. Hadamard and de la Vallée Poussin proved the theorem this way in 1896, independently
[@hadamard1896; @vallee1896]. The error term came in 1899, when de la Vallée Poussin widened the zero-free region
to the left of $\Re s = 1$. Textbook proofs are in [@davenport] and [@apostol, Ch. 13].
::::
:::: used
The statement is the target of chapters [[zeta-continued]] through [[explicit-formula]]. Its error term is the subject
of [[what-rh-says]].
::::
:::::

::: aside
Gauss and Legendre had both guessed forms of the theorem, and Chebyshev proved around 1850 that $\pi(x)$ stays between
two constant multiples of $x/\log x$ (section [[cp-chebyshev]] gives his argument), and that if $\pi(x)/(x/\log x)$ has
a limit then the limit is 1. Proving that the
limit exists took the complex analysis of Riemann's 1859 paper [@edwards, Ch. 1], and the proofs came in 1896.
:::

## How good is the estimate? {#cp-table}

The theorem is a statement about infinity, so it is worth seeing what it does at sizes we can compute. Every entry
below was computed from a sieve and from numerical integration.

| $x$ | $\pi(x)$ | $\Li(x)$ | $\Li(x) - \pi(x)$ | $\pi(x) / (x/\log x)$ | $\lvert\Li(x) - \pi(x)\rvert / \pi(x)$ |
| --- | --- | --- | --- | --- | --- |
| $10$ | 4 | 5.12 | 1.12 | 0.921 | 0.28 |
| $10^2$ | 25 | 29.08 | 4.08 | 1.151 | 0.16 |
| $10^3$ | 168 | 176.56 | 8.56 | 1.161 | 0.051 |
| $10^4$ | 1,229 | 1,245.09 | 16.09 | 1.132 | 0.013 |
| $10^5$ | 9,592 | 9,628.76 | 36.76 | 1.104 | 0.0038 |
| $10^6$ | 78,498 | 78,626.50 | 128.50 | 1.084 | 0.0016 |
| $10^7$ | 664,579 | 664,917.36 | 338.36 | 1.071 | 0.00051 |
| $10^8$ | 5,761,455 | 5,762,208.33 | 753.33 | 1.061 | 0.00013 |
| $10^9$ | 50,847,534 | 50,849,233.91 | 1,699.91 | 1.054 | 0.000033 |

Three facts stand out. First, $x/\log x$ is only slowly converging: at $10^9$ the true count is still 5.4% above it.
Second, $\Li(x)$ is spectacular: at $10^9$ the relative error is three parts in a hundred thousand, and the estimate
agrees with the truth in its first four digits. Third, in every row $\Li(x)$ is larger than $\pi(x)$. That is a feature of this range and not a
law. Littlewood proved in 1914 that the sign of $\Li(x) - \pi(x)$ changes infinitely often [@littlewood1914], though the first
change is far beyond any computation we can do here.

:::: figure {#f-cp-ratio viz="prime-ratio" height="380"}
The ratio of the true count to $x/\log x$ creeps toward 1 so slowly that it is still 5% off at $10^9$, while the ratio
to $\Li(x)$ is within 0.2% of 1 by $10^6$.

```vizspec
Purpose: show that Li(x) is a far better estimate than x / log x, even though both are asymptotic to pi(x).
Scene: horizontal axis log10(x) from 1 to 9 (ticks at each integer, labeled 10, 100, ..., 10^9); vertical axis
  from 0.85 to 1.25. A horizontal line y = 1 in muted. Three curves:
  (a) pi(x) / (x / log x) in red,
  (b) pi(x) / Li(x) in blue,
  (c) optional: pi(x) / (x / (log x - 1.08366)) (Legendre's guess) as a dashed muted curve, shown only when its
      checkbox is on.
  For log10(x) up to 6, evaluate on a fine grid using the sieve. Beyond 6, place a dot at each of 10^7, 10^8,
  10^9 using the table values pi(10^7) = 664579, pi(10^8) = 5761455, pi(10^9) = 50847534, and join them to the
  curve with straight lines.
Controls: checkbox "show Legendre's x / (log x - 1.08366)". Hovering shows x and the three ratios. A slider
  "right end" for the largest log10(x) shown, from 2 to 9.
Motion: the curves redraw with a short ease when the right end changes. Nothing else moves.
Reader takeaway: x / log x is right in the limit but converges so slowly it is useless as an estimate at ordinary
  sizes; Li(x) is on top of the truth almost at once; Legendre's fitted constant works at 10^6 and then drifts
  away because the true constant in that formula, in the limit, is 1.
Data: sieve up to 10^6 in the browser, plus the three table values above. Li(x) tabulated as in the previous
  figure, extended to 10^9 by the same substitution.
```
::::

Legendre's formula is a good test of the table. With his constant 1.08366 it predicts 78,543 primes up to $10^6$,
only 45 too many, a better result than $\Li$ gives there. At $10^9$ it predicts 50,917,519, which is 69,985 too many,
against $\Li$'s error of 1,700. A constant fitted to a range fits the range. The true constant in that kind of formula, in the limit, is 1, which the integration by parts above
makes plain.

## The question: how large is the error? {#cp-question}

Write
$$
\pi(x) = \Li(x) + E_\pi(x)
$$
for the error. The first form of the prime number theorem says only that $E_\pi(x)$ is small compared with $\Li(x)$
itself. That is a weak statement: it permits $E_\pi$ to be as large as $x/\log^{10} x$, and even the error term in
[[t-cp-pnt]] exceeds $x^{0.99}$ for all large $x$. The data say far less. The relative errors in the table shrink so fast that they suggest an absolute error nearer $\sqrt{x}$.

How near? Compare with $\sqrt{x}/\log x$:

| $x$ | $\lvert E_\pi(x)\rvert$ | $\sqrt{x}$ | $\lvert E_\pi(x)\rvert / \sqrt{x}$ | $\lvert E_\pi(x)\rvert / (\sqrt{x}/\log x)$ |
| --- | --- | --- | --- | --- |
| $10^3$ | 8.56 | 31.6 | 0.27 | 1.87 |
| $10^5$ | 36.76 | 316.2 | 0.12 | 1.34 |
| $10^7$ | 338.36 | 3,162.3 | 0.11 | 1.72 |
| $10^9$ | 1,699.91 | 31,622.8 | 0.054 | 1.11 |

The error is a tiny fraction of $\sqrt{x}$ and a modest multiple of $\sqrt{x}/\log x$. Nothing in these numbers is
a proof, but it shows what size to look for.

Part of the gap has a simple source. In [[cp-dictionary]] below we will meet Riemann's count $J(x)$, which counts a
prime square as one half of a prime, a cube as one third, and so on. It is $J$, not $\pi$, that $\Li$ tracks most
closely. At $x = 10^6$ the prime power terms of $J$ add up to $99.1$ (the largest is $\tfrac12\pi(1000) = 84$), so $\pi(10^6)$
sits 99.1 below $J(10^6)$. Of the 128.5 by which $\Li$ overshoots $\pi$ there, 99.1 is this bookkeeping, and only 29.4 is
a genuine difference between $J$ and $\Li$. The remainder is closer to the part that fluctuates, which is what the Riemann
Hypothesis controls.

A coin-flip picture explains why a square root is natural. Pretend each number $t$ is prime independently with
probability $1/\log t$. The number of primes up to $x$ then has mean $\Li(x)$ and typical fluctuation of size
$\sqrt{x/\log x}$, which is smaller than $\sqrt{x}$. Primes are not coin flips (the dependence is exactly what the zeta
function encodes), but the picture says a square root is what pure chance looks like. The Riemann Hypothesis says the
primes are never wilder than that, up to a power of $\log x$. We state the precise version now as the question the
whole page is organized around.

::: warning
The Riemann Hypothesis is not the statement that $\pi(x)$ is close to $\Li(x)$ in some loose sense, which the prime
number theorem already gives. It says the closeness is of square-root size, the size a random count would show.
Precisely, it holds exactly when $\pi(x) = \Li(x) + O(x^{1/2 + \eps})$ for every $\eps > 0$, an equivalence we
return to in [[what-rh-says]]. Von Koch showed the forward direction in 1901, with the bound
$O(\sqrt{x}\,\log x)$ [@vonkoch1901].
:::

:::: figure {#f-cp-error viz="prime-error" height="420"}
The error $\pi(x) - \Li(x)$ wanders inside a band a few multiples of $\sqrt{x}/\log x$ wide, which is far narrower
than the count itself.

```vizspec
Purpose: show the size and shape of E(x) = pi(x) - Li(x) against the scale sqrt(x).
Scene: horizontal axis x from 2 to Xmax (linear). Vertical axis symmetric about 0. Draw E(x) in red as a
  stepped curve (it jumps up by 1 at each prime and slopes down between primes because Li increases). Behind it,
  two muted guide bands: the lighter one is +/- sqrt(x), the darker one is +/- sqrt(x) / log(x). A thin horizontal
  line at 0.
Controls: a slider for Xmax on a log scale from 100 to 1,000,000. A toggle between two views: "raw error"
  (the plot above) and "error / sqrt(x)", where the vertical axis is fixed to [-1, 1], the guide bands become the
  lines +/- 1 and +/- 1/log(x), and the red curve is E(x)/sqrt(x). Hovering shows x, E(x), E(x)/sqrt(x).
Motion: when the slider moves or the view toggles, the axes rescale with a 300 ms ease. No autoplay.
Reader takeaway: the error is a small multiple of sqrt(x) / log x and shrinks relative to sqrt(x), and its shape is
  slowly drifting, not erratic noise.
Data: sieve up to 10^6 in the browser; Li tabulated as in the first figure.
```
::::

## A better count: weight each prime by its logarithm {#cp-lambda}

The estimate $\Li(x)$ has an awkward feature: the density $1/\log t$ keeps changing. Every time we write a formula we
must carry logarithms around. Here is a count in which the density is 1. If the chance that $n$ is prime is
about $1/\log n$, then giving each prime $p$ the weight $\log p$ makes the expected weight per integer about
$\frac{1}{\log n} \cdot \log n = 1$. The weighted count up to $x$ should then be about $x$, a clean straight line.

There is a second, deeper reason, which chapter [[euler-product]] will make precise. The numbers that appear when we expand the
product $1/(1 - p^{-s}) = 1 + p^{-s} + p^{-2s} + \cdots$ are not only the primes but also their powers $p^2, p^3, \ldots$.
These are the natural "atoms" of multiplication, so the natural count includes them. We give a prime power the same
weight $\log p$ as the prime itself.

:::: definition {#d-cp-lambda title="The von Mangoldt function"}
For a positive integer $n$, let
$$
\Lambda(n) = \begin{cases} \log p & \text{if } n = p^k \text{ for a prime } p \text{ and an integer } k \ge 1, \\ 0 & \text{otherwise.} \end{cases}
$$
It is a function on the positive integers, not on the reals. Its nonzero values are all logarithms of primes: the same
value $\log p$ at $p$, $p^2$, $p^3$, and so on. It is not multiplicative, and $\Lambda(1) = 0$.
::::

Its first sixteen values:

| $n$ | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| $\Lambda(n)$ | 0 | 0.693 | 1.099 | 0.693 | 1.609 | 0 | 1.946 | 0.693 | 1.099 | 0 | 2.398 | 0 | 2.565 | 0 | 0 | 0.693 |

The values 0.693 at $n = 2, 4, 8, 16$ are all $\log 2$ (each of 2, 4, 8, 16 is a power of the prime 2), and $\Lambda(6) = 0$ because 6
is not a prime power. The weights have a property that the next chapter uses constantly: they split $\log n$
among the prime powers dividing $n$.

:::: lemma {#l-cp-lam-sum title="Splitting the logarithm"}
For every positive integer $n$,
$$
\sum_{d \mid n} \Lambda(d) = \log n.
$$ {#eq-cp-lam-sum}
::::

Test it on $n = 12$. Its divisors are 1, 2, 3, 4, 6, 12, and the nonzero weights are $\Lambda(2) = \log 2$, $\Lambda(3) =
\log 3$, $\Lambda(4) = \log 2$. Their sum is $2 \log 2 + \log 3 = \log 12$. The general proof is the same count.

::: proof
Factor $n = p_1^{a_1} \cdots p_r^{a_r}$. A divisor $d$ of $n$ has $\Lambda(d) \ne 0$ only if $d = p_i^j$ for some $i$ and
some $1 \le j \le a_i$, and then $\Lambda(d) = \log p_i$. So the sum is $\sum_i a_i \log p_i = \log n$.
:::

Look at what the weights do to the picture of the staircase. A prime near $x$ is rare, about one number in $\log x$, but
when it appears it now carries a step of height $\log x$ instead of 1. Rare and tall cancel on average: between
$x$ and $x + h$ we expect about $h/\log x$ steps of height about $\log x$, which is a rise of $h$. So the weighted
staircase should climb at slope 1, and the question "how many primes" becomes the question "how far does a slope-1
staircase wander from its straight line".

Now add the weights up.

:::: definition {#d-cp-psi title="The Chebyshev function"}
For a real number $x$, let
$$
\psi(x) = \sum_{n \le x} \Lambda(n).
$$
It is a function of a real variable and a step function like $\pi$: it jumps by $\log p$ at each prime $p$ and at each
higher power $p^2, p^3, \ldots$. It is not the plain weighted prime count $\vartheta(x) = \sum_{p \le x} \log p$, which skips the
higher powers.
::::

Test: $\psi(10)$ collects $2, 4, 8$ (three copies of $\log 2$), $3, 9$ (two copies of $\log 3$), 5, and 7:
$$
\psi(10) = 3\log 2 + 2\log 3 + \log 5 + \log 7 = \log 2520 = 7.832.
$$
There is a pleasant fact hiding here: $\psi(n) = \log \operatorname{lcm}(1, 2, \ldots, n)$. The least common multiple of
$1, \ldots, 10$ is $2520$, and the exponent of each prime $p$ in it is the largest $k$ with $p^k \le 10$, which is exactly the number of
times $\log p$ appears in $\psi(10)$.

The point of the weighting shows up in numbers. Here is $\psi(x)$ against $x$:

| $x$ | $\psi(x)$ | $\psi(x) - x$ | $(\psi(x) - x)/\sqrt{x}$ | $\vartheta(x) - x$ |
| --- | --- | --- | --- | --- |
| $10^2$ | 94.05 | $-5.95$ | $-0.60$ | $-16.27$ |
| $10^3$ | 996.68 | $-3.32$ | $-0.10$ | $-43.75$ |
| $10^4$ | 10,013.40 | $+13.40$ | $+0.13$ | $-104.01$ |
| $10^5$ | 100,051.56 | $+51.56$ | $+0.16$ | $-314.61$ |
| $10^6$ | 999,586.60 | $-413.40$ | $-0.41$ | $-1,515.82$ |

The count $\psi(x)$ tracks the line $y = x$ with no visible drift, and its error changes sign. The plain weighted count
$\vartheta(x)$ sits below the line every time, by between 0.99 and 1.63 times $\sqrt{x}$ in these rows, a bias with a cause: $\psi(x) - \vartheta(x) = \vartheta(x^{1/2}) + \vartheta(x^{1/3}) + \cdots$
is about $\sqrt{x}$, and including the prime powers repairs it. At $x = 10^6$ the repair is 1,102.4 against $\sqrt{x} = 1000$.
So $\psi$ is the count with the cleanest error, and the one that formulas will want.

:::: figure {#f-cp-psi viz="chebyshev-psi" height="440"}
The weighted count $\psi(x)$ climbs along the line $y = x$, each prime power adding a step of height $\log p$, and the
dictionary below rebuilds $\pi(x)$ from it.

```vizspec
Purpose: show Lambda as spikes at prime powers, psi as their running total hugging the line y = x, and then
  how pi(x) is recovered from psi (the dictionary of the next section).
Scene, mode "psi": top panel is a stem plot of Lambda(n) for n = 1..N: a vertical line of height Lambda(n) at each
  n, in gold; stems at primes are solid, stems at prime powers p^k with k >= 2 are lighter gold with the label
  p^k above (labels only when N <= 100). Bottom panel: psi(x) as a gold staircase, the diagonal y = x in blue,
  and a muted band around the diagonal of half-width sqrt(x). A vertical cursor ties the two panels together: it
  highlights the stem at n and the corresponding step.
Scene, mode "dictionary": one panel. Draw pi(x) in gold as a staircase. Draw J(x) = pi(x) + pi(x^(1/2))/2 +
  pi(x^(1/3))/3 + ... as a thinner gold dashed staircase just above it. Draw R(x) = psi(x)/log x +
  integral from 2 to x of psi(t) / (t (log t)^2) dt as a blue curve, computed from the psi staircase. R(x) lies
  exactly on J(x) at every x; make that visible by a small readout of J(x) - R(x), which stays below 1e-9.
Controls: a mode switch ("psi" / "dictionary"); slider N from 10 to 1000 (default 100) that sets the right
  end; in mode psi, a checkbox "show theta(x) = sum over primes only" that draws theta as a red staircase under
  psi so the sqrt(x) gap is visible.
Motion: as N grows, new stems drop in left to right at 20 per second when a play button is pressed; the slider
  jumps without animation otherwise.
Reader takeaway: psi follows y = x with no systematic drift once prime powers are included, and pi can be
  rebuilt exactly from psi by partial summation.
Data: sieve to 1000 in the browser (tiny). The integral in R(x) is exact on each interval between integers
  because psi is constant there: the integral of 1/(t log^2 t) is -1/log t.
```
::::

## The dictionary between $\pi$ and $\psi$ {#cp-dictionary}

If $\psi$ is the count we will use and $\pi$ is the count we care about, we need a precise way to move between them.
The tool is partial summation, the discrete cousin of integration by parts. It turns a sum with a smooth weight into
an integral against the running total.

:::: lemma {#l-cp-abel title="Partial summation"}
Let $a_n$ be numbers with $a_n = 0$ for $n < 2$, let $A(t) = \sum_{n \le t} a_n$, and let $f$ be continuously
differentiable on $[2, x]$. Then
$$
\sum_{n \le x} a_n f(n) = A(x) f(x) - \int_2^x A(t) f'(t)\, \dd t.
$$ {#eq-cp-abel}
::::

::: proof
For each $n \le x$, $f(n) = f(x) - \int_n^x f'(t)\,\dd t$. Multiply by $a_n$ and add over $n \le x$:
$$
\sum_{n \le x} a_n f(n) = A(x) f(x) - \int_2^x \Bigl( \sum_{n \le t} a_n \Bigr) f'(t)\, \dd t,
$$
because $a_n \int_n^x f'(t)\,\dd t = \int_2^x a_n \mathbf{1}[t \ge n]\, f'(t)\,\dd t$, and summing these finitely many integrands
gives $A(t)$.
:::

Test it with $a_n = 1$ for $n \ge 2$, $f(t) = t$, and $x = 3$. The left side is $2 + 3 = 5$. On the right, $A(3) = 2$ and
$A(t) = 1$ for $2 \le t < 3$, so the right side is $2 \cdot 3 - \int_2^3 1\,\dd t = 6 - 1 = 5$.

Apply it with $a_n = \Lambda(n)$ and $f(t) = 1/\log t$. Then $A = \psi$ and $f'(t) = -1/(t \log^2 t)$. The left side
is $\sum_{n \le x} \Lambda(n)/\log n$. The terms that survive are the prime powers $p^k$, each contributing
$\log p / \log p^k = 1/k$, so the left side counts each prime once, each square of a prime one half, each cube one
third, and so on. Call this Riemann's count, since his 1859 paper uses exactly this combination:
$$
J(x) = \sum_{n \le x} \frac{\Lambda(n)}{\log n} = \pi(x) + \tfrac12 \pi(x^{1/2}) + \tfrac13 \pi(x^{1/3}) + \cdots. 
$$
The sum is finite: $\pi(x^{1/k}) = 0$ once $2^k > x$. The result is the dictionary:
$$
J(x) = \frac{\psi(x)}{\log x} + \int_2^x \frac{\psi(t)}{t \log^2 t}\, \dd t.
$$ {#eq-cp-dictionary}

Test it at $x = 10$. The left side is $J(10) = \pi(10) + \tfrac12\pi(3.16) + \tfrac13\pi(2.15) = 4 + \tfrac{2}{2} + \tfrac13 = 5.3333$. On the right,
$\psi(10)/\log 10 = 7.832/2.3026 = 3.4014$ and the integral comes to 1.9319, which together make 5.3333. At $x = 100$ both sides equal
$28.5333$: the left is $25 + 2 + \tfrac23 + \tfrac12 + \tfrac15 + \tfrac16$, and on the right $\psi(100)/\log 100 = 20.4217$ and the integral is $8.1117$. The identity is
exact, not approximate.

Now put $\psi(t) = t + E(t)$, so that $E$ is the error of $\psi$. The $t$ part of the right side of [[eq-cp-dictionary]] is $x/\log x + \int_2^x \dd t/\log^2 t$, and by [[eq-cp-li-parts]]
that equals $\Li(x) + 2/\log 2$. So
$$
J(x) = \Li(x) + \frac{2}{\log 2} + \frac{E(x)}{\log x} + \int_2^x \frac{E(t)}{t \log^2 t}\, \dd t.
$$
Everything in $J(x) - \Li(x)$ is now built from $E$ alone. Subtracting the prime power terms $\tfrac12 \pi(x^{1/2}) + \cdots$, which total $O(\sqrt{x})$, gives $\pi(x)$.

:::: proposition {#p-cp-transfer title="An error bound for $\psi$ gives one for $\pi$"}
Suppose $\lvert \psi(t) - t\rvert \le C \sqrt{t}\, \log^2 t$ for all $t \ge 2$. Then
$$
\pi(x) = \Li(x) + O(\sqrt{x}\, \log x).
$$
::::

::: proof
In the display above, $\lvert E(x)\rvert / \log x \le C \sqrt{x} \log x$. The integral is at most $C \int_2^x t^{-1/2}\, \dd t \le 2C\sqrt{x}$. The constant
$2/\log 2$ is bounded. The prime power terms are $O(\sqrt{x})$: since $\pi(y) \le y$, the term with $k = 2$ is at most $\sqrt{x}/2$, and the at most
$\log_2 x$ terms with $k \ge 3$ are each at most $x^{1/3}$. Adding, the total is $O(\sqrt{x} \log x)$.
:::

The converse also holds. Apply [[eq-cp-abel]] to the indicator of the primes with $f(t) = \log t$, which gives
$\vartheta(x) = \pi(x)\log x - \int_2^x \pi(t)\,\dd t/t$. Together with $\psi(x) - \vartheta(x) = O(\sqrt{x})$, this turns $\pi(x) = \Li(x) + O(\sqrt{x}\log x)$ back into $\psi(x) = x + O(\sqrt{x}\log^2 x)$.
So the two questions are one question, and we will ask it for $\psi$, where it is cleanest. The same identity gives the easy half of the prime number theorem:
if $\psi(t) \sim t$ then the integral in [[eq-cp-dictionary]] is $O(x/\log^2 x)$, so $J(x) \sim x/\log x$, and $\pi(x) \sim J(x)$ because the prime power terms are $O(\sqrt{x})$. The equivalence of $\pi(x) \sim x/\log x$ and
$\psi(x) \sim x$ is standard [@apostol, Ch. 4].

## Chebyshev's budget: a number that knows its primes {#cp-chebyshev}

The aside in [[cp-pnt]] said that Chebyshev proved, around 1850, that $\pi(x)$ stays between two constant multiples
of $x/\log x$. His argument needs nothing beyond unique factorization, and its shape returns at the far end of the
page: in Stepanov's proof for curves over finite fields (chapter [[stepanov]]) and in the second proof of 2026 (Part IV).
So we give it here, first in the form textbooks use and then in his own sharper form.

The plan is to find one whole number about which we know two things: roughly how large it is, and which primes divide
it. Unique factorization ties the two together. Write $v_p(N)$ for the exponent of the prime $p$ in a positive integer
$N$, so that $N = \prod_p p^{v_p(N)}$. Taking logarithms,
$$
\log N = \sum_p v_p(N) \log p .
$$ {#eq-cp-budget}
This is [[eq-cp-lam-sum]] with its terms grouped by prime. Read it as a budget. Each prime factor of $N$ costs $\log p$
every time it divides, and together the factors spend exactly $\log N$, no more and no less. So an upper bound on $N$
caps the total weight of any set of primes that we know divide it.

The textbook choice of $N$ is the middle binomial coefficient $\binom{2n}{n} = (2n)!/(n!)^2$, a whole number because
it counts the ways of choosing $n$ objects from $2n$.

:::: theorem {#t-cp-window title="The primes between $n$ and $2n$ weigh less than $n\log 4$" source="apostol"}
For every integer $n \ge 1$,
$$
\vartheta(2n) - \vartheta(n) = \sum_{n < p \le 2n} \log p < n \log 4 .
$$ {#eq-cp-window}
::::

:::: proof
::: steps
1. By the binomial theorem, $4^n = (1+1)^{2n}$ is the sum of the $2n+1$ positive numbers $\binom{2n}{k}$, and
   $\binom{2n}{n}$ is one of them.
$$
\binom{2n}{n} < 4^n .
$$
2. A prime $p$ with $n < p \le 2n$ divides exactly one of the numbers $1, 2, \ldots, 2n$, namely $p$ itself, because
   $2p > 2n$, and it divides none of $1, \ldots, n$. So it divides $(2n)!$ once and $(n!)^2$ not at all.
$$
v_p\bigl(\tbinom{2n}{n}\bigr) = 1 \qquad (n < p \le 2n).
$$
3. In [[eq-cp-budget]] for $N = \binom{2n}{n}$, the primes of the window contribute $\log p$ each, and every other
   term is at least $0$.
$$
\sum_{n < p \le 2n} \log p \;\le\; \log \binom{2n}{n} \;<\; n \log 4 .
$$
:::
::::

Test it at $n = 10$. Here $\binom{20}{10} = 184{,}756 = 2^2 \cdot 11 \cdot 13 \cdot 17 \cdot 19$. The window's primes
11, 13, 17, and 19 weigh $\log(11 \cdot 13 \cdot 17 \cdot 19) = \log 46{,}189 = 10.74$, the factor $2^2$ adds $1.39$,
and the total $\log 184{,}756 = 12.13$ sits under the ceiling $10 \log 4 = 13.86$. The primes 3, 5, and 7 do not divide
$\binom{20}{10}$ at all, because each divides $20!$ exactly as often as it divides $(10!)^2$.

:::: figure {#f-cp-budget viz="chebyshev-budget" height="420"}
The prime factors of a number spend exactly its logarithm, so the primes of the window, each dividing it once, can weigh
no more than the number's size allows.

```vizspec
Purpose: show the budget log N = sum_p v_p(N) log p as columns of prime factors against the size of N, for the
  middle binomial coefficient and for Chebyshev's 1852 number.
Scene: left, one column at each prime p up to the top of the window (2n, or x), stacked with one block of height
  log p for each time p divides N; gold for the primes of the window (n, 2n] (or the prime powers of (x/6, x]),
  muted for the other factors; a pale gold band over the window; a tick under the axis at every prime, so a prime
  that does not divide N is a tick with no column; a dotted line at log 2n (or log x), above which no column rises.
  Right, two bars in units of log: "primes", the gold window under the muted rest, and "size", log N in blue, equal
  by the budget; in the binomial mode a dashed blue ceiling at n log 4. A line across the top gives N's
  factorization when it fits, and otherwise its number of digits.
Controls: a select between "The middle binomial coefficient" and "Chebyshev's 1852 number"; slider n from 2 to 100
  (default 10); slider x from 30 to 600 (default 60). Hovering a column reads p, v_p(N), and v_p(N) log p.
Motion: the scales follow the slider smoothly; columns and bars redraw at once.
Reader takeaway: every prime of the window must be paid for out of log N, and log N is known; that is the whole
  argument.
Check: n = 10 gives 184,756 = 2^2 * 11 * 13 * 17 * 19, window 10.74, log N 12.13, ceiling 13.86; x = 60 gives
  psi(60) - psi(10) = 49.70, log T(60) = 52.34, psi(60) = 57.53.
```
::::

Windows add up to a bound for every $x$. For $x = 2^k$, split the primes up to $2^k$ among the windows
$(2^{j-1}, 2^j]$ and apply [[eq-cp-window]] with $n = 2^{j-1}$:
$$
\vartheta(2^k) = \sum_{j=1}^{k} \bigl(\vartheta(2^j) - \vartheta(2^{j-1})\bigr) < \sum_{j=1}^{k} 2^{j-1} \log 4 < 2^k \log 4 .
$$
For $2^{k-1} \le x < 2^k$ this gives $\vartheta(x) \le \vartheta(2^k) < 2^k \log 4 \le 2x \log 4$, so
$\vartheta(x) < 2.78\,x$ for every $x \ge 1$. The difference $\psi(x) - \vartheta(x) = \vartheta(x^{1/2}) +
\vartheta(x^{1/3}) + \cdots$ has at most $\log_2 x$ nonzero terms, each now below $2.78\sqrt{x}$, so $\psi(x)$ is also
at most a constant times $x$.

The same number gives a bound in the other direction, because none of its prime powers is large. The exponent of $p$
in $m!$ is $\lfloor m/p \rfloor + \lfloor m/p^2 \rfloor + \cdots$, since each multiple of $p$ up to $m$ gives one factor
$p$, each multiple of $p^2$ one more, and so on. So
$$
v_p\bigl(\tbinom{2n}{n}\bigr) = \sum_{j \ge 1} \Bigl( \Bigl\lfloor \frac{2n}{p^j} \Bigr\rfloor - 2 \Bigl\lfloor \frac{n}{p^j} \Bigr\rfloor \Bigr),
$$
and each term is $0$ or $1$, as $\lfloor 2y \rfloor - 2\lfloor y \rfloor$ is for every real $y$, and is $0$ once
$p^j > 2n$. Hence $p^{v_p} \le 2n$ for every prime $p$, as $2^2 = 4 \le 20$ in the example. In [[eq-cp-budget]] at
most $\pi(2n)$ primes then contribute at most $\log 2n$ each, while $\binom{2n}{n}$, the largest of the $2n+1$ numbers
that add up to $4^n$, is at least $4^n/(2n+1)$. Together,
$$
\pi(2n) \log 2n \;\ge\; \log \binom{2n}{n} \;\ge\; n \log 4 - \log(2n+1),
$$
a constant times $2n/\log 2n$ from below. At $n = 10$ it says $\pi(20) \ge 3.6$, and in fact $\pi(20) = 8$.

### Chebyshev's own number {#cp-chebyshev-1852}

A better number gives better constants. Chebyshev's choice in 1852 was [@chebyshev1852]
$$
T(x) = \frac{\lfloor x \rfloor! \, \lfloor x/30 \rfloor!}{\lfloor x/2 \rfloor! \, \lfloor x/3 \rfloor! \, \lfloor x/5 \rfloor!} .
$$
Its prime factorization can be read off with $\Lambda$. Summing [[eq-cp-lam-sum]] over the integers up to $y$ counts
$\Lambda(n)$ once for every multiple of $n$ up to $y$, so
$$
\log \lfloor y \rfloor! = \sum_{n \le y} \Lambda(n) \lfloor y/n \rfloor ,
$$ {#eq-cp-log-factorial}
and applying this to the five factorials gives
$$
\log T(x) = \sum_{n \le x} \Lambda(n) \, \nu(x/n), \qquad \nu(y) = \lfloor y \rfloor - \lfloor y/2 \rfloor - \lfloor y/3 \rfloor - \lfloor y/5 \rfloor + \lfloor y/30 \rfloor .
$$ {#eq-cp-cheb-T}
The step function $\nu$ repeats with period 30, because adding 30 to $y$ changes it by $30 - 15 - 10 - 6 + 1 = 0$. It is
constant between consecutive integers, where all five floors are, and checking the thirty integers $0, 1, \ldots, 29$
shows that it takes only the values $0$ and $1$, with $\nu(y) = 1$ for $1 \le y < 6$ [@gantumur2025]. Three facts
follow.

- Every exponent of $T(x)$ is a sum of values of $\nu$, so it is at least $0$, and $T(x)$ is a whole number.
- Since $\nu \le 1$, $\log T(x) \le \psi(x)$.
- Since $\nu = 1$ on $[1, 6)$ and $\nu \ge 0$, every prime power in the window $(x/6, x]$ is paid for in full:
  $\psi(x) - \psi(x/6) \le \log T(x)$.

The size of $T(x)$ comes from comparing $\log m! = \sum_{k \le m} \log k$ with $\int_1^m \log t \, \dd t = m \log m - m + 1$,
which gives $\log m! = m \log m - m + O(\log m)$. In $\log T(x)$ the terms in $x \log x$ and in $x$ cancel, because
$1 - \tfrac12 - \tfrac13 - \tfrac15 + \tfrac1{30} = 0$, and what is left is
$$
\log T(x) = A x + O(\log x), \qquad A = \frac{\log 2}{2} + \frac{\log 3}{3} + \frac{\log 5}{5} - \frac{\log 30}{30} = 0.92129 .
$$
The second fact then gives $\psi(x) \ge Ax - O(\log x)$. The third, applied at $x, x/6, x/36, \ldots$ and added, gives
$\psi(x) \le \tfrac65 A x + O(\log^2 x)$. So for all large $x$
$$
0.921 < \frac{\psi(x)}{x} < 1.106 ,
$$
which is Chebyshev's theorem with his constants [@chebyshev1852; @diamond1982, §3]. At $x = 60$ the three quantities
are $\psi(60) - \psi(10) = 49.70$, $\log T(60) = 52.34$, and $\psi(60) = 57.53$, in the order the facts require.

### What the budget can and cannot see {#cp-chebyshev-limits}

Better numbers keep improving the constants without changing the argument. Sylvester's larger numbers brought them to
0.957 and 1.044, and Diamond and Erdős showed that numbers of this kind exist with constants as close to 1 as one
likes, although their proof uses estimates equivalent to the prime number theorem [@gantumur2025]. What the method
gives is the order of magnitude: $\psi(x)$ is a constant times $x$. It says nothing about the error at the scale
$\sqrt{x}$, the question of [[cp-question]].

Two features of the budget explain where it stops, and both come back later. First, it is one-sided. Divisibility caps
how much prime weight a number of known size can carry and says nothing about how little; the lower bound above needed
a second fact, the cap on each prime power. Chapter [[landau-endgame]] shows that for the hypothesis an upper bound
alone is enough. Second, in Chebyshev's numbers each prime of the window divides only once. A number that every prime
of a window divided $m$ times would be charged $m$ times the window's weight in [[eq-cp-budget]], so a bound on its size
would cap that weight at $1/m$ of the bound. The art is to build such a number while keeping its size from growing $m$
times as fast. Over a finite field this is exactly how the hypothesis for curves is proved: chapter [[stepanov]] builds
a polynomial that vanishes to high order at every point being counted and plays its degree against the number of
points, with degree in place of size and roots in place of prime factors. Over the integers there is no derivative to
make a number vanish twice, and the second proof of 2026 manufactures the multiplicity from a chain of theta lifts
(chapter [[multiplicity-from-lifts]]). The inequality its endgame consumes, an upper bound on a smoothed sum over primes
on windows of scales ([[eq-le-interface]]), carries Chebyshev's name in the formal proof:
`ChebyshevInequalityOnWindows`. A shorter rewrite of that proof says the same in its comments, listing
"Chebyshev-order bounds" first among the "earlier bounds for sums over primes by size against divisibility", and
chapter [[route-a-compressed]] reads its main inequality as this budget for a lattice.

## What we carry forward {#cp-carry}

::: symbols
| Symbol | What it is | Kind | Where it lives |
| --- | --- | --- | --- |
| $\pi(x)$ | the number of primes $p \le x$ | step function of a real $x$ | [[d-cp-pi]] |
| $\Li(x)$ | $\int_2^x \dd t/\log t$, the smooth estimate | smooth function of a real $x \ge 2$ | [[d-cp-li]] |
| $\Lambda(n)$ | $\log p$ if $n = p^k$, else 0 | function on integers | [[d-cp-lambda]] |
| $\psi(x)$ | $\sum_{n \le x} \Lambda(n)$ | step function of a real $x$ | [[d-cp-psi]] |
| $\vartheta(x)$ | $\sum_{p \le x} \log p$, primes only | step function of a real $x$ | [[d-cp-psi]] |
| $J(x)$ | $\pi(x) + \tfrac12\pi(x^{1/2}) + \cdots$, Riemann's count | step function of a real $x$ | [[cp-dictionary]] |
| $v_p(N)$ | the exponent of the prime $p$ in the positive integer $N$ | nonnegative integer | [[cp-chebyshev]] |
| $T(x)$ | Chebyshev's number $\lfloor x\rfloor!\,\lfloor x/30\rfloor!/(\lfloor x/2\rfloor!\,\lfloor x/3\rfloor!\,\lfloor x/5\rfloor!)$ | positive integer for each $x \ge 1$; this chapter only | [[cp-chebyshev-1852]] |
:::

Here is the road from this chapter to the question. Chapter [[euler-product]] builds $\zeta(s)$ from the primes, for real
$s > 1$, and shows that its logarithmic derivative has the weights $\Lambda(n)$ as coefficients. Chapters
[[complex-toolkit]] and [[zeta-continued]] extend $\zeta$ to complex $s$. Chapter [[zeros]] locates its zeros, and
chapter [[explicit-formula]] shows that each zero adds one wave to $\psi(x) - x$. Chapter [[what-rh-says]] reads off
the size of the error from the position of the zeros. That last step is the one the whole page is built to take.

Two facts will do most of the work in the chapters ahead. The estimate $\Li$ tells us what the count of primes should be.
The count $\psi$ is a cleaner version of the same count, in which the expected value is $x$ and the question is how
far from $x$ it strays. In the next chapter a single function, built from the primes by multiplication, will have
$\sum \Lambda(n)\, n^{-s}$ as its logarithmic derivative, and the weights we just defined will turn out to be the only
ones that make that identity true.

::: recap
You now have the staircase $\pi(x)$, its smooth estimate $\Li(x)$, and the prime number theorem as the statement
that their ratio tends to 1. You have a table of how good the estimate is (four leading digits at $10^9$) and the question that
organizes everything after: how large is $\pi(x) - \Li(x)$, with $\sqrt{x}$ as the natural scale. You have the weights $\Lambda(n)$, the count
$\psi(x)$ whose expected density is 1, the identity $\sum_{d \mid n} \Lambda(d) = \log n$, and an exact dictionary,
[[eq-cp-dictionary]], that moves error bounds between $\pi$ and $\psi$. You also have Chebyshev's budget
[[eq-cp-budget]]: a number of known size can be divisible by the primes of a window only as far as its logarithm
allows. With each prime of the window dividing once, it bounds $\psi(x)$ by a constant times $x$ and reaches no
further.
Chapter [[euler-product]] uses $\Lambda$ at once. The dictionary is used again in [[what-rh-says]]. The budget returns
with degree in place of size in [[stepanov]], and over number fields in [[multiplicity-from-lifts]].
:::
