---
id: zeros
title: The zeros and the hypothesis
part: 1
summary: Locate every zero of zeta to within a strip, see the symmetry that pairs them, count them, and state exactly what the Riemann Hypothesis says about where in the strip they sit.
needs: [zeta-continued]
---

:::: plain
The function $\zeta$ vanishes at infinitely many points that are not the obvious ones, and all of them lie in a vertical strip of width 1. They come in mirror-image pairs, they get denser as you climb, and the first one sits at height $14.1347\ldots$. The Riemann Hypothesis says that every one of them lies exactly on the center line of the strip.
::::

The previous chapters built the machine. $\zeta$ is a function on the whole plane, it has one pole at $s=1$, it obeys the functional equation $\xi(s)=\xi(1-s)$, and it vanishes at $-2,-4,-6,\dots$ for a reason that the Gamma function explains. What the machine does not yet tell us is where else it vanishes, and that is the question the rest of the page depends on. Chapter [[explicit-formula]] will show that each zero is one wave in the count of primes, so the position of the zeros is the position of the waves, and the size of the primes' fluctuations is decided by how far to the right of the center line a zero can sit. This chapter locates the zeros as far as classical methods can, shows that the center line is the natural place for them, and then states the hypothesis in one sentence.

## Where a zero cannot be {#s-ze-no-zeros-right}

We start with the easiest region, the half plane where the Euler product converges. Chapter [[euler-product]] showed that for $\sigma>1$ the product over primes converges to $\zeta(s)$, and the plan is to turn that product into an exponential of a series, because an exponential is never zero. For $\sigma>1$ and each prime $p$ we have $\lvert p^{-s}\rvert = p^{-\sigma}<1$, so the Taylor series of the logarithm applies to each factor,
$$
-\log\bigl(1-p^{-s}\bigr) = \sum_{k\ge 1}\frac{p^{-ks}}{k}.
$$
Exponentiating and multiplying over $p$ turns the Euler product into
$$
\zeta(s)=\exp\Bigl(\sum_{p}\sum_{k\ge1}\frac{p^{-ks}}{k}\Bigr)\qquad(\sigma>1). 
$$ {#eq-ze-log-euler}
The double series converges absolutely, because its absolute value is at most $\sum_p\sum_k p^{-k\sigma}/k\le\sum_{n\ge1}n^{-\sigma}=\zeta(\sigma)<\infty$, where the middle inequality holds since every pair $(p,k)$ gives a different integer $n=p^k$. A convergent exponential is a nonzero complex number, so $\zeta(s)\neq0$ whenever $\sigma>1$.

The same argument gives a quantitative statement that we will use again. Taking absolute values in the Euler product and using $\lvert 1-p^{-s}\rvert\le 1+p^{-\sigma}$ gives $\lvert\zeta(s)\rvert\ge\prod_p(1+p^{-\sigma})^{-1}$, and since $(1+p^{-\sigma})^{-1}=(1-p^{-\sigma})/(1-p^{-2\sigma})$ the right side telescopes into a ratio of zeta values,
$$
\lvert\zeta(s)\rvert\ \ge\ \frac{\zeta(2\sigma)}{\zeta(\sigma)}\qquad(\sigma>1).
$$
At $s=2+14.1347i$ the bound says $\lvert\zeta(s)\rvert\ge\zeta(4)/\zeta(2)=0.6580$, and the true value is $0.6908$, so the bound is tight when $\sigma$ is as large as 2. It becomes weak as $\sigma\to1$, because $\zeta(\sigma)\to\infty$ while the true value stays finite. At $s=1.1+14.1347i$ the bound gives $0.1408$ against a true value of $0.3771$.

Next we transfer the statement to the left half plane, using the functional equation as a mirror. Recall $\xi(s)=\tfrac12 s(s-1)\pi^{-s/2}\Gamma(s/2)\zeta(s)$, an entire function with $\xi(s)=\xi(1-s)$. For $\sigma>1$ every factor of $\xi$ is nonzero, because $\Gamma$ has no zeros, $s(s-1)\ne0$ there, and $\zeta(s)\ne0$ by the previous paragraph, so $\xi$ has no zero with $\sigma>1$. If $\sigma<0$ then $1-s$ has real part greater than 1, so $\xi(s)=\xi(1-s)\ne0$ as well. Together these facts say that every zero of $\xi$ has $0\le\sigma\le1$. The zeros of $\zeta$ outside that strip are exactly the ones in the factor $1/\Gamma(s/2)$, namely the trivial zeros at $-2,-4,-6,\dots$ from the previous chapter.

:::: definition {#d-ze-nontrivial-zero title="Nontrivial zero, critical strip, critical line"}
A **nontrivial zero** of $\zeta$ is a zero of the entire function $\xi$. It is a complex number $\rho=\beta+i\gamma$ at which $\zeta(\rho)=0$ and which is not one of $-2,-4,-6,\dots$. The **critical strip** is the set of $s=\sigma+it$ with $0\le\sigma\le1$, and the **critical line** is the vertical line $\sigma=\tfrac12$ through its middle. A nontrivial zero is counted with **multiplicity**, meaning the order $m$ of vanishing, so that $\xi(s)=(s-\rho)^m h(s)$ with $h(\rho)\ne0$.

Nontrivial is a name and not a claim about difficulty, and the word "zero" here never means a zero of $\zeta$ on the negative real axis. Whether a nontrivial zero can have $\beta\ne\tfrac12$ is exactly what the Riemann Hypothesis addresses.
::::

## The four mirror images of a zero {#s-ze-symmetry}

Two symmetries of $\xi$ act on the set of zeros, and together they force a four-fold pattern. The first symmetry is the functional equation $\xi(s)=\xi(1-s)$, which reflects the plane in the point $s=\tfrac12$ and therefore sends $\rho=\beta+i\gamma$ to $1-\rho=(1-\beta)-i\gamma$. The second comes from the fact that $\zeta(s)$ is real for real $s$ and is given by series with real coefficients. The Schwarz reflection principle then gives $\xi(\bar s)=\overline{\xi(s)}$, so $\rho$ is a zero exactly when its conjugate $\bar\rho=\beta-i\gamma$ is, with the same multiplicity. Composing the two gives the third image, $1-\bar\rho=(1-\beta)+i\gamma$, which is the reflection of $\rho$ in the critical line.

$$
\rho=\beta+i\gamma,\qquad \bar\rho=\beta-i\gamma,\qquad 1-\rho=(1-\beta)-i\gamma,\qquad 1-\bar\rho=(1-\beta)+i\gamma .
$$ {#eq-ze-four}

A zero on the critical line is its own reflection in that line, because $\beta=\tfrac12$ makes $1-\bar\rho=\rho$, so there the four images collapse to the two points $\tfrac12\pm i\gamma$. A hypothetical zero off the line would come with three companions. If $\zeta$ vanished at $0.7+14.1347i$, it would also vanish at $0.7-14.1347i$, at $0.3+14.1347i$, and at $0.3-14.1347i$, forming the corners of a rectangle straddling the critical line. This is the first reason the critical line is natural, because it is the only vertical line that the symmetry maps to itself. If a zero is on that line, it needs no partner to the left or right.

One more fact about zeros fixes where the pairs sit vertically. For real $\sigma$ between 0 and 1 the alternating series from chapter [[zeta-continued]] shows that $(1-2^{1-\sigma})\zeta(\sigma)=\eta(\sigma)>0$, while $1-2^{1-\sigma}<0$ on that interval, so $\zeta(\sigma)<0$ there. For instance $\zeta(\tfrac12)=-1.4603545\ldots$. Hence no zero has $\gamma=0$, every nontrivial zero comes with a conjugate on the other side of the real axis, and it suffices to list the zeros with $\gamma>0$ in increasing order.

::::: figure {#f-ze-strip viz="zero-strip" height="460"}
The zero set is carried to itself by two mirrors, the real axis and the critical line, so a zero off the line would force four zeros, while a zero on the line forces only two.

```vizspec
Purpose: let the reader see the four-fold symmetry of the zero set and the regions where zeta cannot vanish.
Scene: complex plane, sigma on the horizontal axis from -2.5 to 3.5, t on the vertical axis from -55 to 55
  (equal pixel scaling not required; the t axis is compressed). Shade the half plane sigma>1 and the half plane
  sigma<0 in muted red with the label "no nontrivial zeros". Shade the strip 0<sigma<1 very lightly in muted
  blue. Draw the critical line sigma=1/2 as a violet vertical line. Draw the real axis as a muted horizontal
  line. Mark the trivial zeros -2,-4,-6 on the real axis as small hollow circles. Mark the first 20 zero
  ordinates (from the kit's list of 200) as teal dots at sigma=1/2 and at both t=+gamma and t=-gamma.
Controls: a draggable "probe" point, initially at sigma=0.5, t=14.13 (snapped to the first zero). While
  dragged it is drawn in gold. A toggle "show images" (default on). A toggle "|zeta| landscape" that paints
  the strip background with log|zeta(s)| as a heat map (dark where |zeta| is small), computed at low
  resolution (about 60 by 200 cells) and cached.
Motion: when the probe moves, its three mirror images (conjugate, reflection in the critical line, and both)
  move with it as gold-outlined hollow dots, joined to the probe by thin dashed segments forming a rectangle.
  When the probe is exactly on the critical line the rectangle collapses to a vertical segment and the
  dashed lines fade.
Reader takeaway: reflection in the critical line and in the real axis map the zero set to itself, and the
  dark pits of the landscape (the zeros) all line up on the violet line.
Data: first 200 zero ordinates and zeta for complex arguments (kit provides them).
```
:::::

## The first ten zeros {#s-ze-first-ten}

Before saying anything about all zeros it helps to hold a few of them. The ten smallest ordinates, computed to six decimals with the arbitrary-precision zero finder in `mpmath`, are listed below together with the gap to the previous one.

| $n$ | $\gamma_n$ | gap |
| --- | --- | --- |
| 1 | 14.134725 | |
| 2 | 21.022040 | 6.887315 |
| 3 | 25.010858 | 3.988818 |
| 4 | 30.424876 | 5.414018 |
| 5 | 32.935062 | 2.510186 |
| 6 | 37.586178 | 4.651116 |
| 7 | 40.918719 | 3.332541 |
| 8 | 43.327073 | 2.408354 |
| 9 | 48.005151 | 4.678078 |
| 10 | 49.773832 | 1.768681 |

The average gap over these ten zeros is $(49.7738-14.1347)/9=3.96$, and we will see in a moment that the expected spacing near height 30 is $2\pi/\log(30/2\pi)=4.02$, so the numbers are typical of what the theory predicts. The gaps are far from regular, ranging from $1.77$ to $6.89$ in the table, and the first zero is the lowest of all, so the strip is free of zeros below height $14.13$. In the language of the previous section, these are the points $\tfrac12\pm i\gamma_n$.

### Why a zero on the line is one real equation, not two {#s-ze-hardy-z}

To find a zero of an arbitrary complex function at a point $s$ one has to solve two real equations, $\Re\zeta=0$ and $\Im\zeta=0$, in two unknowns $\sigma$ and $t$, and that is a codimension two coincidence that gives no help from the intermediate value theorem. On the critical line the situation is much better, and the reason is the symmetry of the previous section. For real $t$ the functional equation gives $\xi(\tfrac12+it)=\xi(\tfrac12-it)$ and the reflection principle gives $\xi(\tfrac12-it)=\overline{\xi(\tfrac12+it)}$, so $\xi(\tfrac12+it)$ equals its own conjugate and is a real number. Since $\zeta(s)$ is $\xi(s)$ times the factor $2\pi^{s/2}/(s(s-1)\Gamma(s/2))$, which has no zero or pole on the critical line, the value $\zeta(\tfrac12+it)$ is a real number times a unit complex number that rotates slowly with $t$. The rotation is recorded by the Riemann-Siegel theta function, a real phase that has nothing to do with Jacobi's theta function $\theta(t)$ of chapter [[zeta-continued]] or with Chebyshev's function $\vartheta(x)$ of chapter [[counting-primes]], so we give it its own subscript,

$$
\theta_{\mathrm{RS}}(t)=\Im\log\Gamma\bigl(\tfrac14+\tfrac{it}{2}\bigr)-\tfrac{t}{2}\log\pi ,
$$ {#eq-ze-theta}

and the real function that remains after undoing the rotation is the Hardy function $Z(t)=e^{i\theta_{\mathrm{RS}}(t)}\zeta(\tfrac12+it)$.

:::: definition {#d-ze-hardy-z title="Hardy's $Z$ function"}
$Z(t)=e^{i\theta_{\mathrm{RS}}(t)}\zeta(\tfrac12+it)$ for real $t$ is a real-valued function of one real variable with $\lvert Z(t)\rvert=\lvert\zeta(\tfrac12+it)\rvert$. It is a rotated copy of $\zeta$ along the critical line, not a new function with different zeros, and its zeros are exactly the ordinates of the nontrivial zeros of $\zeta$ that lie on the critical line.
::::

A sign change of $Z$ forces a zero by the intermediate value theorem, and this is how zeros on the line are certified. At $t=14.0$ we get $Z(14.0)=-0.1056$ and at $t=14.3$ we get $Z(14.3)=+0.1328$, so there is a zero in between, and it is the first one at $14.134725$. Likewise $Z(20.9)=+0.1395$ and $Z(21.2)=-0.2000$ bracket the second zero at $21.022040$. The picture to keep in mind is the path $t\mapsto\zeta(\tfrac12+it)$ in the plane. Because the value is always a real multiple of a rotating unit vector, the path passes through the origin exactly at the zeros on the critical line, and at a simple zero it passes straight through, because $Z$ changes sign there.

::::: figure {#f-ze-critical-path viz="zeta-path" height="440"}
The curve $t\mapsto\zeta(\sigma+it)$ passes through the origin at each zero when $\sigma=\tfrac12$, and as soon as $\sigma$ leaves $\tfrac12$ the curve misses the origin.

```vizspec
Purpose: show a zero as the curve of zeta through the origin, and show that the miss distance opens up off the line.
Scene: the complex plane (value of zeta), real axis horizontal in [-3, 3], imaginary axis vertical in [-3, 3],
  with a muted grid and a small gold dot at the origin. Draw the curve s(t)=sigma+it for t in [0, T] mapped
  through zeta, as a polyline of about 2000 points, in teal. Mark the current point (t = current time) with a
  bright dot and draw a faint trail of the last few seconds in lighter teal.
Controls: slider "t max" from 0 to 60 (default 30) that sets how much of the path is drawn, a play button that
  grows t max, and a slider "sigma" from 0.30 to 0.70 in steps of 0.01 (default 0.50, a tick at 0.5
  highlighted in violet). A readout shows sigma, the current t, and the minimum distance from the curve to
  the origin over the drawn range, in red when it is above 0.01.
Motion: when sigma moves off 0.5 the curve deforms smoothly (re-evaluate with debounce) and the loops that used
  to pass through the origin slide off it; at sigma=0.5 they hit it again at t = 14.13, 21.02, 25.01,
  30.42, 32.94, ...; a short flash marks each crossing.
Reader takeaway: on the critical line the curve has to pass through the origin at each zero, and a zero off
  the line would need the curve to hit the origin by accident.
Data: zeta for complex arguments, first 200 zero ordinates (kit provides them).
```
:::::

## How many zeros are there below height $T$? {#s-ze-counting}

We want to know how fast the zeros accumulate, because the formula of chapter [[explicit-formula]] sums a wave for every one of them, and whether that sum behaves depends on how many there are. Riemann stated the answer without proof in 1859 and von Mangoldt proved it in 1905. Here $N(T)$ is the number of nontrivial zeros $\rho$ with $0<\gamma\le T$, counted with multiplicity.

::::: card {#t-ze-riemann-von-mangoldt kind="theorem" title="The number of zeros up to height $T$ is about $\frac{T}{2\pi}\log\frac{T}{2\pi}-\frac{T}{2\pi}$" source="vonmangoldt1905-nullstellen"}
:::: statement
For $T\ge2$ not equal to the ordinate of a zero,
$$
N(T)=\frac{\theta_{\mathrm{RS}}(T)}{\pi}+1+E_N(T),\qquad E_N(T)=\frac1\pi\arg\zeta\bigl(\tfrac12+iT\bigr)=O(\log T),
$$ {#eq-ze-theta-N}
where $\arg\zeta(\tfrac12+iT)$ is defined by continuous change of argument along the path from $2$ to $2+iT$ to $\tfrac12+iT$. Most texts write $S(T)$ for the remainder $E_N(T)$; this page keeps the letter $S$ for the smoothed sum of chapter [[what-rh-says]]. Since $\theta_{\mathrm{RS}}(T)=\tfrac T2\log\tfrac T{2\pi}-\tfrac T2-\tfrac\pi8+O(1/T)$, this gives
$$
N(T)=\frac{T}{2\pi}\log\frac{T}{2\pi}-\frac{T}{2\pi}+O(\log T).
$$ {#eq-ze-N-asym}
::::
:::: plain
Up to height $T$ there are about $\frac{T}{2\pi}\log\frac{T}{2\pi}$ zeros, a little fewer once the correction $-\frac{T}{2\pi}$ is applied, and the true count never strays from that smooth curve by more than a constant times $\log T$. The zeros therefore get denser as you climb, with an average gap of $2\pi/\log(T/2\pi)$ near height $T$.
::::
:::: why
Chapter [[explicit-formula]] adds a wave for each zero, and it needs to know that the sum of $1/\lvert\rho\rvert$ over zeros up to $T$ grows only like $\log^2T$. That fact follows from this count by partial summation, and it is the reason the explicit formula can be truncated and controlled.
::::
:::: idea
The argument principle says that $N$ equals the winding number of $\xi$ around a large rectangle. The symmetries of the previous section make the four quarters of the boundary contribute equally, and on the one quarter that matters the change in the argument of $\xi$ is dominated by the argument of the Gamma factor, which Stirling's formula evaluates. What remains is the argument of $\zeta$ itself, which is small because $\zeta$ cannot wind around the origin many times on a segment where it has few zeros of its real part.
::::
:::: sketch {source="vonmangoldt1905-nullstellen"}
Apply the argument principle from chapter [[complex-toolkit]] to $\xi$ on the rectangle with corners $2\pm iT$ and $-1\pm iT$, which contains exactly the nontrivial zeros with $\lvert\gamma\rvert<T$. By $\xi(s)=\xi(1-s)$ and $\xi(\bar s)=\overline{\xi(s)}$ the change of $\arg\xi$ along each of the four quarters of the boundary is the same, so $2N(T)=\frac{1}{2\pi}\cdot4\Delta$, that is $N(T)=\Delta/\pi$, where $\Delta$ is the change of $\arg\xi$ along the path $2\to2+iT\to\tfrac12+iT$. Write $\xi(s)=\tfrac12 s(s-1)\cdot\pi^{-s/2}\Gamma(s/2)\cdot\zeta(s)$ and add the three changes. The factor $s(s-1)$ turns from the positive number $2$ to the negative number $-(\tfrac14+T^2)$ and so contributes $\pi$, which is the "$+1$" in the theorem. The middle factor contributes exactly $\theta_{\mathrm{RS}}(T)$, because it starts at the positive number $\pi^{-1}\Gamma(1)$ at $s=2$ and its argument at $s=\tfrac12+iT$ is $\Im\log\Gamma(\tfrac14+\tfrac{iT}2)-\tfrac T2\log\pi$. For the last factor, $\arg\zeta$ is bounded on $2\to2+iT$ because $\zeta$ is close to 1 there, and on the horizontal segment from $2+iT$ to $\tfrac12+iT$ one shows that the change of $\arg\zeta$ is $O(\log T)$ by bounding the number of zeros of $\Re\zeta(\sigma+iT)$ with a Jensen-type estimate. The expansion of $\theta_{\mathrm{RS}}$ is Stirling's formula for $\Gamma(\tfrac14+\tfrac{iT}2)$. The full argument is in Davenport [@davenport] and Titchmarsh [@titchmarsh], and Edwards [@edwards] follows von Mangoldt's original route.
::::
:::: example
The formula can be tested against exact counts, which `mpmath` produces by evaluating the argument principle numerically. The columns give the true count $N(T)$, the smooth part $\frac{T}{2\pi}\log\frac T{2\pi}-\frac T{2\pi}$, and the exact main term $\theta_{\mathrm{RS}}(T)/\pi+1$ of [[eq-ze-theta-N]], whose difference from $N(T)$ is $E_N(T)$.

| $T$ | $N(T)$ | $\frac{T}{2\pi}\log\frac T{2\pi}-\frac T{2\pi}$ | $\theta_{\mathrm{RS}}(T)/\pi+1$ | $E_N(T)$ |
| --- | --- | --- | --- | --- |
| 20 | 1 | 0.502 | 1.378 | $-0.378$ |
| 50 | 10 | 8.548 | 9.423 | $+0.577$ |
| 100 | 29 | 28.127 | 29.002 | $-0.002$ |
| 200 | 79 | 78.318 | 79.193 | $-0.193$ |
| 500 | 269 | 268.712 | 269.587 | $-0.587$ |
| 1000 | 649 | 647.741 | 648.616 | $+0.384$ |

The exact main term exceeds the smooth part by $0.875$ in every row, which is the constant $\tfrac78$ in the refinement $N(T)=\frac{T}{2\pi}\log\frac{T}{2\pi e}+\tfrac78+E_N(T)+O(1/T)$. After that constant is added the remaining error is $E_N(T)$, which stays between $-0.6$ and $+0.6$ in the table, much smaller than the bound $O(\log T)$ would allow. At $T=1000$ the average gap is $2\pi/\log(1000/2\pi)=1.24$.
::::
:::: used
Chapter [[explicit-formula]] uses this count to bound the sum of $1/\lvert\rho\rvert$ and to control the truncation of the explicit formula, and chapter [[what-rh-says]] uses it to turn the explicit formula into the bound $\psi(x)=x+O(\sqrt x\log^2x)$.
::::
:::::

::::: figure {#f-ze-counting viz="zero-count" height="400"}
The number of zeros up to height $T$ is a staircase that follows the smooth curve $\frac{T}{2\pi}\log\frac{T}{2\pi}-\frac{T}{2\pi}+\frac78$ to within about one zero.

```vizspec
Purpose: show N(T) as a staircase tracking its smooth estimate, so that the O(log T) error is seen to be tiny.
Scene: axes T in [0, 300] horizontally, count in [0, 130] vertically. Draw N(T) as a gold staircase with a
  step of 1 at each of the first 200 zero ordinates (kit list). Draw the smooth curve
  (T/2pi) log(T/2pi) - T/2pi + 7/8 in blue. A lower panel shares the T axis and plots E_N(T)=N(T)-theta_RS(T)/pi-1
  in red with a zero line, y range [-1.5, 1.5].
Controls: a slider "T max" from 30 to 300; a toggle "without the 7/8" that redraws the blue curve without the
  constant, so the small constant offset appears as a visible gap; a hover tooltip on the staircase giving
  n, gamma_n, and the local mean gap 2pi/log(gamma/2pi).
Motion: when T max changes the view zooms smoothly; the toggle animates the blue curve by 7/8 vertically.
Reader takeaway: the zero count is as regular as a smooth curve can make it, and the density of zeros grows
  like log T.
Data: first 200 zero ordinates and the Riemann-Siegel theta function (kit provides them).
```
:::::

## The zeros determine the function {#s-ze-hadamard}

A polynomial is determined, up to a constant, by its zeros, and the Hadamard product says that the same holds for $\xi$ even though it has infinitely many. We want this statement because it makes the zeros the complete description of the function, so that facts about $\zeta$ can be turned into facts about its zeros, which is exactly what the explicit formula does. The theorem uses the fact that $\xi$ is entire of order 1, which means $\lvert\xi(s)\rvert\le\exp(C\lvert s\rvert\log\lvert s\rvert)$, and that fact comes from Stirling's estimate for $\Gamma$.

::::: card {#t-ze-hadamard kind="theorem" title="The function $\xi$ is the product of its zeros" source="hadamard1893-fonction"}
:::: statement
With the nontrivial zeros $\rho$ listed with multiplicity,
$$
\xi(s)=\xi(0)\prod_{\rho}\Bigl(1-\frac{s}{\rho}\Bigr),\qquad \xi(0)=\tfrac12 ,
$$ {#eq-ze-hadamard}
where the product is taken in pairs of zeros $\rho,\,1-\rho$ (or in the order of increasing $\lvert\gamma\rvert$), and then converges for every $s$.
::::
:::: plain
Knowing the location of every nontrivial zero is enough to rebuild $\xi$ exactly, and hence $\zeta$, because the only constant needed is the value $\tfrac12$ at the origin. The function carries no information beyond its zeros.
::::
:::: why
The explicit formula is obtained by taking the logarithmic derivative of $\zeta$, and Hadamard's product turns that logarithmic derivative into a sum over zeros, which is how the zeros enter the count of primes.
::::
:::: idea
An entire function of order 1 differs from the product over its zeros only by a factor $e^{A+Bs}$, and the functional equation $\xi(s)=\xi(1-s)$ forces the linear term to cancel when zeros are grouped in the pairs $\rho,\,1-\rho$, leaving the constant $\xi(0)$.
::::
:::: sketch {source="hadamard1893-fonction"}
Hadamard's factorization theorem for entire functions of order 1 gives $\xi(s)=e^{A+Bs}\prod_\rho(1-s/\rho)e^{s/\rho}$ with $\sum_\rho\lvert\rho\rvert^{-1-\varepsilon}<\infty$ for each $\varepsilon>0$. Setting $s=0$ gives $e^{A}=\xi(0)=\tfrac12$. The symmetry of $\xi$ then shows that $B=-\sum_\rho\Re(1/\rho)=-\sum_\rho 1/\rho$ with the zeros paired as $\rho,\bar\rho$ so that the imaginary parts cancel, and hence the exponential factors $e^{Bs}\prod_\rho e^{s/\rho}$ multiply to 1, which leaves the product in [[eq-ze-hadamard]]. The details are in Davenport [@davenport] and Edwards [@edwards].
::::
:::: example
Two numerical tests of the product. First, take logarithmic derivatives of [[eq-ze-hadamard]] at $s=0$ to get $\xi'(0)/\xi(0)=-\sum_\rho 1/\rho$. The functional equation gives $\xi'(0)/\xi(0)=-\xi'(1)/\xi(1)$, and from the definition of $\xi$ one computes $\xi'(1)/\xi(1)=1+\gamma_E+\tfrac12\bigl(\tfrac{\Gamma'}{\Gamma}(\tfrac12)\bigr)-\tfrac12\log\pi$. Here the logarithmic derivative of $\xi$ is $\frac1s+\frac1{s-1}-\frac12\log\pi+\frac12\frac{\Gamma'}{\Gamma}(\frac s2)+\frac{\zeta'}{\zeta}(s)$; at $s=1$ the term $\frac1s$ gives the $1$, and $\frac1{s-1}+\frac{\zeta'}{\zeta}(s)\to\gamma_E$, where $\gamma_E=0.5772\ldots$ is Euler's constant, the constant term of the Laurent series $\zeta(s)=\frac1{s-1}+\gamma_E+\cdots$ at the pole. Finally $\Gamma'(\tfrac12)/\Gamma(\tfrac12)=-\gamma_E-2\log2$. Therefore
$$
\sum_\rho\frac1\rho=1+\frac{\gamma_E}{2}-\frac12\log(4\pi)=0.0230957\ldots ,
$$ {#eq-ze-sum-inv-rho}
where the sum is over all nontrivial zeros, paired. A pair $\tfrac12\pm i\gamma$ contributes $\frac{1}{1/2+i\gamma}+\frac1{1/2-i\gamma}=\frac{1}{1/4+\gamma^2}$, so for zeros on the line the total is $\sum_{\gamma>0}1/(\tfrac14+\gamma^2)$. The ten zeros of the table above contribute $0.01354$, which is 58.6% of the total, the first 100 zeros give $0.01998$ (86.5%), and the first 1000 zeros, which reach height $1419.42$, give $0.02238$ (96.9%). The convergence is slow because the tail beyond height $T$ is about $(\log(T/2\pi)+1)/(2\pi T)$, which is $0.0007$ at $T=1419$ and brings the partial sum to $0.0231$. Second, at $s=2$ the definition gives $\xi(2)=\zeta(2)/\pi=\pi/6=0.52360$, while the pairs $\tfrac12\pm i\gamma_n$ give factors $1+2/(\tfrac14+\gamma_n^2)$ in [[eq-ze-hadamard]], and $\tfrac12\prod_{n\le N}\bigl(1+2/(\tfrac14+\gamma_n^2)\bigr)$ equals $0.51368$ for $N=10$, $0.52035$ for $N=100$, and $0.52285$ for $N=1000$, which is within $0.15\%$ of $\pi/6$. The product rebuilds a value of $\xi$ that was never used as an input.
::::
:::: used
Chapter [[explicit-formula]] differentiates this product to write $\zeta'/\zeta$ as a sum over zeros. Chapter [[what-rh-says]] uses the number $0.0462=2\sum_\rho\Re(1/\rho)$ to state the smoothed explicit formula with an explicit constant.
::::
:::::

## No zeros on the line $\sigma=1$ {#s-ze-three-four-one}

Everything so far leaves open whether a zero could sit on the boundary of the strip, at $\sigma=1$ or $\sigma=0$, and this is the first place where a real argument is needed, since the Euler product no longer converges there. The statement matters because it is the input that proves the prime number theorem, as Hadamard [@hadamard1896] and de la Vallée Poussin [@vallee1896] showed independently in 1896, and the argument below is the standard textbook one. It uses a trick of positivity. The Euler product tells us about $\log\lvert\zeta\rvert$ as a sum with cosines, and a particular nonnegative combination of three cosines beats a hypothetical zero.

::::: card {#t-ze-nonvanishing-one kind="theorem" title="$\zeta$ has no zero on the line $\sigma=1$" source="vallee1896"}
:::: statement
$\zeta(1+it)\ne0$ for every real $t\ne0$, and consequently $\xi$ has no zero on the lines $\sigma=1$ and $\sigma=0$, so every nontrivial zero lies in the open strip $0<\beta<1$.
::::
:::: plain
Zeta cannot vanish on the right edge of the critical strip. The proof shows that if it did, three sizes that the Euler product ties together would multiply to something smaller than 1, which they are forbidden to do.
::::
:::: why
Without this theorem the zeros could lie on the boundary of the strip, and the explicit formula would then contain a term as large as $x$ itself, destroying the asymptotic $\psi(x)\sim x$. The prime number theorem is exactly the statement that no such term exists.
::::
:::: idea
The Euler product writes $\log\lvert\zeta(\sigma+it)\rvert$ as $\sum_{p,k}\frac{p^{-k\sigma}}{k}\cos(kt\log p)$. A zero on $\sigma=1$ would make this very negative as $\sigma\downarrow1$, while at $t=0$ the pole makes it very positive. The weights $3,4,1$ are chosen so that the combination of cosines is never negative, which forbids a zero at $1+it$ because $4$ times the zero's order of vanishing would outweigh the pole of order $3$ by $4-3=1$.
::::
:::: proof
Fix $\sigma>1$ and real $t$. Taking the real part of the exponent in [[eq-ze-log-euler]] gives
$$
\log\lvert\zeta(\sigma+it)\rvert=\sum_p\sum_{k\ge1}\frac{p^{-k\sigma}}{k}\cos\bigl(kt\log p\bigr),
$$
because $p^{-ks}=p^{-k\sigma}e^{-ikt\log p}$ has real part $p^{-k\sigma}\cos(kt\log p)$. Write $\theta=kt\log p$. The trigonometric identity $\cos2\theta=2\cos^2\theta-1$ gives
$$
3+4\cos\theta+\cos2\theta=2+4\cos\theta+2\cos^2\theta=2(1+\cos\theta)^2\ \ge\ 0.
$$ {#eq-ze-341-poly}
Form the combination $3\log\zeta(\sigma)+4\log\lvert\zeta(\sigma+it)\rvert+\log\lvert\zeta(\sigma+2it)\rvert$ of the three sums with $t$ replaced by $0$, $t$, and $2t$. The cosine arguments are $0$, $\theta$, and $2\theta$, so the combination equals
$$
\sum_p\sum_{k\ge1}\frac{p^{-k\sigma}}{k}\bigl(3+4\cos\theta+\cos2\theta\bigr)\ \ge\ 0 ,
$$
and exponentiating gives the inequality
$$
\zeta(\sigma)^3\,\lvert\zeta(\sigma+it)\rvert^4\,\lvert\zeta(\sigma+2it)\rvert\ \ge\ 1\qquad(\sigma>1,\ t\in\RR).
$$ {#eq-ze-341-ineq}
Now suppose $\zeta(1+it_0)=0$ for some real $t_0\neq0$, and let $\sigma\downarrow1$ with $t=t_0$. The factor $\zeta(\sigma)\sim1/(\sigma-1)$ has a simple pole, so $\zeta(\sigma)^3$ is of size $(\sigma-1)^{-3}$. Since $\zeta$ is differentiable at $1+it_0$ and vanishes there, $\lvert\zeta(\sigma+it_0)\rvert\le C(\sigma-1)$ for some constant $C$ and $\sigma$ near 1, so the fourth power is of size at most $(\sigma-1)^4$. The remaining factor $\lvert\zeta(\sigma+2it_0)\rvert$ stays bounded, because $2t_0\ne0$ and $\zeta$ is analytic at $1+2it_0$. The left side of [[eq-ze-341-ineq]] is therefore at most a constant times $(\sigma-1)^{-3+4}=(\sigma-1)$, which tends to $0$ and contradicts being at least 1. Hence $\zeta(1+it_0)\ne0$.

For the left edge, $\xi(it)=\xi(1-it)=\xi(1+(-t)i)$ and $\xi(1+iu)\neq0$ for $u\ne0$ by what we just proved together with the nonvanishing of the factors of $\xi$ away from $s=0,1$, while $\xi(0)=\xi(1)=\tfrac12\ne0$. So there are no zeros of $\xi$ on $\sigma=0$ or $\sigma=1$.
::::
:::: example
Take $\sigma=1.1$ and $t=14.134725$, the height of the first zero. Then $\zeta(\sigma)^3\lvert\zeta(\sigma+it)\rvert^4\lvert\zeta(\sigma+2it)\rvert=44.35$, comfortably above 1. Moving $\sigma$ toward 1 at the same $t$ gives $2.38\times10^4$ at $\sigma=1.01$ and $2.22\times10^7$ at $\sigma=1.001$, so the left side blows up like $(\sigma-1)^{-3}$ because $\zeta(1+14.13i)$ is not zero. A hypothetical zero would have made it shrink instead. Other points confirm that the bound holds with room to spare. At $\sigma=2$ and $t=0.5$ the value is $27.19$, at $\sigma=1.1$ and $t=1$ it is $1485.6$, and at $\sigma=1.01$ and $t=3$ it is $156{,}187$. The polynomial in [[eq-ze-341-poly]] vanishes only at $\theta=\pi$ modulo $2\pi$, so a term of the double series is zero only for a prime power $p^k$ with $kt\log p$ an odd multiple of $\pi$, and no choice of $t$ can arrange this for every prime at once.
::::
:::: used
This theorem puts the zeros strictly inside the strip, so in the explicit formula of chapter [[explicit-formula]] every zero term has size at most $x^{\beta}$ with $\beta<1$, and chapter [[what-rh-says]] measures how much smaller than $x$ the zero terms can be.
::::
:::::

::::: figure {#f-ze-341 viz="three-four-one" height="380"}
The combination $3+4\cos\theta+\cos2\theta$ equals $2(1+\cos\theta)^2$ and so never goes below zero, which is the whole reason there is no zero on $\sigma=1$.

```vizspec
Purpose: make the positivity trick visible, and show the pole-versus-zero exponent count.
Scene: left panel, theta on the horizontal axis from -2pi to 2pi, three thin curves 3, 4cos(theta), cos(2theta) in
  muted colors (blue, teal, gold) and their sum in red with the filled area under it shaded, and the
  curve 2(1+cos theta)^2 drawn as a dashed overlay that coincides with the sum. Right panel, a bar chart in
  log scale of the three factors zeta(sigma)^3, |zeta(sigma+it)|^4, |zeta(sigma+2it)| and their product, as
  functions of sigma.
Controls: left panel, a draggable theta marker; right panel, a slider for sigma in [1.001, 2] on a log scale
  and a slider for t in [0.5, 40] (default 14.134725). The product is shown with a horizontal line at 1.
Motion: dragging theta moves the marker along the sum and updates the numerical value of 3+4cos+cos2; changing
  sigma resizes the bars, and the first bar grows like (sigma-1)^(-3) as sigma goes to 1 while the second
  stays moderate.
Reader takeaway: the product always exceeds 1, so the second factor cannot go to zero fast enough, and no
  zero can sit at 1+it.
Data: zeta for complex arguments (kit provides it).
```
:::::

## The statement of the hypothesis {#s-ze-rh}

We have now fenced the zeros in. They lie in the open strip $0<\sigma<1$, they come in symmetric sets of two or four, they are denser and denser as one climbs, and everything we computed lies on one vertical line, the line that the symmetry maps to itself. Riemann wrote in 1859 that it is very probable that all the roots of $\xi$ are real in his variable $t$, which in our variable $s=\tfrac12+it$ says the same thing, and that he had not proved this after a few brief attempts because it was not needed for his immediate aim [@riemann1859]. The statement has carried his name ever since, and the 2026 proofs are the subject of Parts III and IV of this page.

::::: card {#t-ze-rh kind="theorem" title="Every nontrivial zero of $\zeta$ has real part $\tfrac12$" source="riemann1859"}
:::: statement
Let $\rho=\beta+i\gamma$ be a nontrivial zero of $\zeta$. Then $\beta=\tfrac12$. Equivalently, every zero of $\xi$ lies on the critical line, and the supremum $\Theta$ of the real parts of the nontrivial zeros equals $\tfrac12$.
::::
:::: plain
All the interesting zeros of the zeta function sit on one straight line, the center of the critical strip. The statement is Riemann's guess of 1859, and the proofs that make it a theorem are the subject of Parts III and IV.
::::
:::: why
The real part of a zero sets the size of the wave it contributes to the count of primes, as chapter [[explicit-formula]] shows, so the hypothesis is the statement that primes fluctuate as little as the functional equation allows. Everything in Parts II to V is organized around what this one sentence means and how it is proved.
::::
:::: idea
The symmetries of this chapter permit a zero at $\beta+i\gamma$ only together with $1-\beta+i\gamma$, so $\beta=\tfrac12$ is the single position that needs no partner. The theorem says that every zero takes that position, and that the four-fold orbits of the symmetry never occur.
::::
:::: sketch {source="masullo"}
This chapter does not prove the statement. Its proofs are the subject of Parts III and IV, which follow two routes that both pass through Weil's explicit formula, introduced in chapter [[weil-positivity]]. Part III follows Masullo [@masullo], who proves the hypothesis for the L-functions of all unitary Hecke characters of all number fields, of which $\zeta$ is the simplest. Part IV follows Alpoge with Claude [@alpoge-note; @alpoge-lean], who prove it for $\zeta$ and for the Dirichlet L-functions of chapter [[what-rh-says]]. What this chapter does show is that the zeros lie in the open strip, that the symmetries pair them, and that their number below height $T$ is given by [[eq-ze-N-asym]].
::::
:::: used
Chapters [[explicit-formula]] and [[what-rh-says]] read the statement as a bound on how far the prime counts can stray from their smooth estimates. Chapter [[weil-positivity]] rewrites it as a positivity statement about primes.
::::
:::::

The rest of this chapter records what was known about the hypothesis before 2026, because that record shows what the proofs had to be consistent with. Hardy proved in 1914 that infinitely many zeros lie on the critical line [@hardy1914-zeros], by showing that $Z(t)$ changes sign somewhere beyond every height. Selberg showed in 1942 that a positive proportion of zeros lie on the line, Levinson showed in 1974 that more than a third do, and Conrey showed in 1989 that at least two fifths do. On the computational side, Platt and Trudgian verified in 2021 that every zero with $0<\gamma\le3\cdot10^{12}$ lies on the line, by a rigorous computation of the kind described in the section on Hardy's function, which compares the number of sign changes with the count $N(T)$ [@platt2021-3e12]. A zero off the line would have appeared as a four-fold set of counterexamples, and none was ever found.

:::: warning
The count $N(T)$ in [[eq-ze-N-asym]] counts all nontrivial zeros, on the line or not, so it cannot by itself rule out a zero off the line. The numerical verifications work by showing that the number of sign changes of $Z$ on $[0,T]$ equals $N(T)$, and the equality leaves no room for any other zero. That certifies a finite range, which is why the record stops at a height while the statement does not.
::::

:::: recap
The reader now has the following.

- Zeta has no zero with $\sigma>1$, by writing it as an exponential, and no zero with $\sigma<0$ except the trivial ones, by the functional equation. Together with the $3+4\cos\theta+\cos2\theta$ argument for $\sigma=1$, this puts every nontrivial zero in the open strip $0<\sigma<1$.
- The zero set is symmetric under $\rho\mapsto\bar\rho$ and $\rho\mapsto1-\rho$, so zeros come in pairs on the critical line and in quadruples off it. On the critical line a zero is one real equation for the real function $Z(t)$.
- The first ten zeros begin at $14.134725$, and $N(T)=\frac{T}{2\pi}\log\frac T{2\pi}-\frac{T}{2\pi}+O(\log T)$, with average gap $2\pi/\log(T/2\pi)$.
- The product $\xi(s)=\tfrac12\prod_\rho(1-s/\rho)$ says the zeros determine the function, and the number $\sum_\rho1/\rho=0.0230957\ldots$ is an exact check of it.
- The Riemann Hypothesis, $\beta=\tfrac12$ for every nontrivial zero.

Chapter [[explicit-formula]] uses the Hadamard product and the count $N(T)$ to show how each zero becomes a wave in the staircase of the primes.
::::
