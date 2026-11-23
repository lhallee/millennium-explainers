---
id: zeta-plane
title: Zeta on the complex plane
part: 2
summary: You can read a domain coloring of zeta and locate its first zeros on the critical line.
needs: [weighted-count]
---

::: plain
A complex function can be drawn by painting every point with a color for the direction of its value and a
brightness for its size. Drawn that way, zeta shows black dots where it vanishes, and the first ones all sit on
one vertical line.
:::

The explicit formula of [[weighted-count]] needs the zeros. This chapter shows where they are, which tests the
domain-colored figure, a static figure, and the remaining block kinds.

## Painting a complex function {#zp-coloring}

A domain coloring is a picture of a function $f : \CC \to \CC$, not a graph: the graph would need four real
dimensions. Each point $s$ is painted with the hue of $\arg f(s)$ and a lightness that grows with $\abs{f(s)}$,
so a zero is a black point that every hue surrounds once, and the pole at $s = 1$ is a white point.

:::: figure {#f-plane viz="demo-plane" height="440"}
Every hue meets at each black point on the violet line, so each one is a simple zero of zeta on the critical line.

```vizspec
Purpose: let the reader move along the critical strip and read zeta at a point.
Scene: sigma in [-2, 3], t in a window of height 24 around a center chosen by a slider.
Controls: slider for the window center, a draggable point s with the value of zeta printed.
Reader takeaway: the black points sit on Re s = 1/2.
```
::::

:::: figure {#f-kit viz="demo-kit" height="460"}
Primes up to $x$ hug $\Li(x)$ on a logarithmic scale, while the strip and the inset show the zero heights up to $T$.

```vizspec
Purpose: exercise every figure-kit helper added after the pilot figures.
Scene: pi(x) and Li(x) for x up to a log-scale slider value, with the band Li(x) +- sqrt(x); a strip of fixed
  pixel height under it with the zero ordinates up to T (or the stems of Lambda(n)); an inset of the critical strip.
Controls: log slider for x with marks and snapping, slider for T snapping to zero heights, a player for N zeros,
  a band toggle, a strip mode select. Hover reads the values; a click marks an x.
Reader takeaway: the kit draws all of this within the frame budget.
```
::::

## The zeros {#zp-zeros}

:::: lemma {#t-symmetry title="The zeros come in symmetric sets" source="titchmarsh" loc="Chapter 2"}
If $\rho$ is a nontrivial zero, then so are $\bar\rho$, $1 - \rho$, and $1 - \bar\rho$.
::::

::: sketch {source="titchmarsh" loc="Chapter 2"}
$\zeta(\bar s) = \overline{\zeta(s)}$ because the Dirichlet series has real coefficients, and the functional
equation relates $\zeta(s)$ to $\zeta(1 - s)$ by a factor with no zeros in the critical strip.
:::

:::: corollary {#c-line title="A zero off the line has a partner"}
A nontrivial zero with $\Re \rho \neq \tfrac12$ comes with a second zero $1 - \bar\rho$ at the same height on the
other side of the critical line.
::::

:::: proposition {#p-first title="The first zero" source="edwards"}
The nontrivial zero with the smallest positive imaginary part is $\rho_1 = \tfrac12 + i\gamma_1$ with
$\gamma_1 = 14.134725\ldots$
::::

:::: conjecture {#c-rh-demo title="The Riemann Hypothesis" source="riemann1859"}
Every nontrivial zero of $\zeta$ has real part $\tfrac12$.
::::

::::: card {#t-pole kind="proposition" title="Zeta has a single pole, at s = 1, with residue 1" source="titchmarsh" loc="Chapter 2"}
:::: statement
$\zeta(s) - \frac{1}{s - 1}$ extends to an entire function.
::::
:::: plain
Near $s = 1$ zeta behaves like $1/(s - 1)$, and nowhere else does it blow up.
::::
:::: why
The residue $x$ in the explicit formula comes from this pole.
::::
:::: idea
Compare the sum $\sum n^{-s}$ with the integral $\int_1^\infty u^{-s} \dd u = \frac{1}{s - 1}$.
::::
:::: proof {collapsed}
For $\Re s > 0$, $\zeta(s) - \frac{1}{s-1} = \sum_{n \ge 1} \int_n^{n+1} \left(n^{-s} - u^{-s}\right) \dd u$, and the
$n$th term is at most $\abs{s} n^{-\Re s - 1}$ in size, so the sum converges and is holomorphic there. The
functional equation carries this to the whole plane.
::::
:::::

:::: figure {#f-map svg="demo-map.svg" height="150"}
The primes determine zeta, and zeta determines its zeros, which return to count the primes.

::::

::: recap
You can read a domain coloring ([[zp-coloring]]), name the symmetries of the zeros ([[t-symmetry]]), and state
the hypothesis ([[c-rh-demo]]) whose truth sharpens the count of [[t-explicit]].
:::
