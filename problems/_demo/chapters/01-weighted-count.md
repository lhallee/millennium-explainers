---
id: weighted-count
title: Counting primes with weights
part: 1
summary: You can compute the weighted prime count psi(x) by hand and say why each zero of zeta adds a wave to it.
needs: []
---

::: plain
Instead of counting each prime once, we give every prime power a weight equal to the logarithm of its prime. The
weighted count grows almost exactly like $x$ itself. What is left over is a sum of waves, one for each zero of the
zeta function.
:::

This chapter exists to test the build. It still states true mathematics, so that the page reads as the real
explainers will: every container, a card, a numbered equation, a table, citations, glossary terms, and an animated
figure.

## The von Mangoldt weights {#wc-weights}

The count of primes jumps by 1 at each prime. A smoother count jumps at every prime power, by the logarithm of the
prime, and the von Mangoldt function records those jumps.

:::: definition {#d-von-mangoldt title="von Mangoldt function"}
The von Mangoldt function is a function from the positive integers to the reals, not a count:
$$
\Lambda(n) = \begin{cases} \log p & \text{if } n = p^k \text{ for a prime } p \text{ and some } k \ge 1, \\ 0 & \text{otherwise.} \end{cases}
$$
::::

Summing the weights up to $x$ gives Chebyshev's function,
$$
\psi(x) = \sum_{n \le x} \Lambda(n).
$$ {#eq-psi-def}

[[eq-psi-def]] is a staircase that steps up at 2, 3, 4, 5, 7, 8, 9, and so on.

::: steps
1. List the prime powers up to $x$. For $x = 10$ they are 2, 3, 4, 5, 7, 8, and 9.
2. Replace each prime power $p^k$ by the logarithm of its prime:
   $$
   \Lambda(2) = \Lambda(4) = \Lambda(8) = \log 2, \qquad \Lambda(3) = \Lambda(9) = \log 3.
   $$
3. Add them up to get the next named quantity, $\psi(10)$:
   $$
   \psi(10) = 3 \log 2 + 2 \log 3 + \log 5 + \log 7 \approx 7.832.
   $$
:::

::: example {title="The first few values"}
| $x$ | prime powers up to $x$ | $\psi(x)$ | $\psi(x)/x$ |
| --- | --- | --- | --- |
| 10 | 2, 3, 4, 5, 7, 8, 9 | 7.832 | 0.783 |
| 100 | 35 prime powers | 94.045 | 0.940 |
| 1000 | 193 prime powers | 996.68 | 0.997 |

The ratio in the last column approaches 1, which is the prime number theorem in this weighted form.
:::

::: symbols
| Symbol | What it is | Kind | Where it lives |
| --- | --- | --- | --- |
| $p$ | a prime | integer | $2, 3, 5, \dots$ |
| $\Lambda(n)$ | the weight of $n$ | function of $n$ | $[0, \infty)$ |
| $\psi(x)$ | the weighted count up to $x$ | function of $x$ | $[0, \infty)$ |
:::

::: recall {title="Logarithms of products"}
$\log(ab) = \log a + \log b$, so the logarithm of $n = p_1^{a_1} \cdots p_r^{a_r}$ is $\sum_i a_i \log p_i$.
:::

## Why these weights {#wc-why}

::: why
The weights make the count of primes the coefficient sequence of a single function, $-\zeta'/\zeta$. Without them
the zeros of $\zeta$ would enter the count of primes only through a messier route.
:::

:::: theorem {#t-log-sum title="Every logarithm splits into weights" source="davenport"}
For every positive integer $n$,
$$
\log n = \sum_{d \mid n} \Lambda(d).
$$
::::

::: idea
Each prime power $p^j$ dividing $n$ contributes $\log p$ once, and $p$ appears in $n$ exactly as many times as
there are such $j$.
:::

::: proof {collapsed}
Write $n = \prod_i p_i^{a_i}$. The divisors $d$ of $n$ with $\Lambda(d) \neq 0$ are the prime powers $p_i^j$ with
$1 \le j \le a_i$, and each contributes $\log p_i$. The sum is therefore $\sum_i a_i \log p_i = \log n$.
:::

::: warning
It is tempting to read $\Lambda(n)$ as "the logarithm of $n$ when $n$ is prime". It is the logarithm of the
underlying prime for every prime power: $\Lambda(8) = \log 2$, not $\log 8$.
:::

::: aside
Chebyshev introduced weighted counts in the 1850s and used them to show that $\psi(x)/x$ stays between two
positive constants for large $x$ [@davenport].
:::

## The explicit formula {#wc-explicit}

The next card is the main result of the chapter. It turns the staircase into a smooth main term plus waves.

::::: card {#t-explicit kind="theorem" title="Each zero of zeta adds one wave to the weighted count of primes" source="davenport"}
:::: statement
For $x > 1$, with $\psi_0(x)$ the average of $\psi$ just before and just after $x$,
$$
\psi_0(x) = x - \sum_{\rho} \frac{x^\rho}{\rho} - \log 2\pi - \tfrac12 \log\left(1 - x^{-2}\right),
$$
where $\rho$ runs over the nontrivial zeros of $\zeta$, summed in order of $\abs{\Im \rho}$.
::::
:::: plain
The weighted prime count equals $x$, minus one wave for every zero of zeta, minus two small corrections. The
more zeros we include, the sharper the steps become.
::::
:::: why
This is the bridge from zeros to primes. A bound on the real parts of the zeros becomes a bound on
$\psi(x) - x$.
::::
:::: idea
Write $\psi$ as a contour integral of $-\zeta'/\zeta$ against $x^s/s$, move the contour to the left, and collect
one residue at each pole.
::::
:::: sketch
Perron's formula gives $\psi_0(x)$ as the integral of $-\frac{\zeta'}{\zeta}(s)\frac{x^s}{s}$ on $\Re s = 2$.
Shifting the line left picks up the residue $x$ at $s = 1$, the residue $-x^\rho/\rho$ at each zero, and the terms
from $s = 0$ and the trivial zeros.
::::
:::: example
With the first 100 pairs of zeros, the sum already shows visible steps at 2, 3, 4, and 5 in [[f-waves]].
::::
:::: lean {decl="Demo.explicitFormula" file="Demo.lean"}
This demo has no formalization; the block shows how a pointer into the Lean code renders.
::::
:::: used
[[t-symmetry]] and [[c-rh-demo]] in the next chapter.
::::
:::::

:::: figure {#f-waves viz="demo-waves" height="400"}
Adding the waves of the zeros one pair at a time turns the smooth line into the staircase of the prime powers.

```vizspec
Purpose: show the explicit formula converging to psi(x).
Scene: x in [1.5, 40], y in [0, 44]. Gold staircase psi(x), blue line y = x, teal partial sum with N zero pairs.
Controls: play and scrub over N from 0 to 100.
Reader takeaway: more zeros make sharper steps, at the prime powers.
```
::::

::: used
[[eq-psi-def]] returns in [[zp-zeros]].
:::

::: recap
You can now compute $\psi(x)$ by hand ([[eq-psi-def]]), split $\log n$ into weights ([[t-log-sum]]), and read
the explicit formula ([[t-explicit]]) as a main term plus one wave per zero. The next chapter looks at where
those zeros sit.
:::
