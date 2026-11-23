---
id: zeta-continued
title: Zeta on the whole plane
part: 1
summary: After this chapter you can state and prove the continuation of zeta to the whole complex plane and its functional equation, and you know where the trivial zeros and the pole come from.
needs: [complex-toolkit]
---

::: plain
The zeta function starts life as a sum that only makes sense when the real part of $s$ is larger than 1. Riemann rewrote that sum as an integral of the theta function, a sum of Gaussians, and the integral makes sense for every $s$ except 1. The same step reveals a hidden symmetry: the function looks the same when $s$ is replaced by $1-s$. That symmetry explains the trivial zeros and confines all other zeros to a vertical strip.
:::

The Euler product turned primes into a function, but only on the half-plane where the series converges. The primes will be read off the zeros of that function, and the zeros we care about sit at real part between 0 and 1, outside the half-plane. So this chapter is where the object of the whole page is built. Everything here uses the tools of [[complex-toolkit]]: the arrow $n^{-s}$, uniqueness of continuation, the Gamma function, the Fourier transform, Poisson summation, and the Mellin transform.

## Where the series converges {#s-zc-converges}

:::: definition {#d-zc-zeta title="the Riemann zeta function on the right half-plane"}
For $s=\sigma+it$ with $\sigma>1$ put
$$
\zeta(s)=\sum_{n=1}^\infty n^{-s}.
$$
So far this is a function on the half-plane $\{\sigma>1\}$ and nowhere else. It is a Dirichlet series, a sum of the arrows $n^{-s}$ of [[eq-ct-arrow]], and it agrees with the real-variable function of [[euler-product]] when $t=0$. It is not yet a function on the plane, and a formula for it elsewhere is what this chapter supplies.
::::

:::: theorem {#t-zc-converges title="The series converges absolutely for $\sigma>1$ and defines a holomorphic function there"}
For every $\delta>0$, the series $\sum n^{-s}$ converges absolutely and uniformly on $\{\sigma\ge1+\delta\}$. Hence $\zeta$ is holomorphic on $\{\sigma>1\}$, and $\abs{\zeta(s)}\le\zeta(\sigma)$.
::::

::: proof
Since $\abs{n^{-s}}=n^{-\sigma}\le n^{-1-\delta}$ and $\sum_n n^{-1-\delta}\le1+\int_1^\infty x^{-1-\delta}\,\dd x=1+1/\delta<\infty$, the Weierstrass M-test gives absolute and uniform convergence. A uniform limit of holomorphic functions is holomorphic [@ss-complex, Chapter 2], and each term $n^{-s}=e^{-s\log n}$ is entire. The bound is the triangle inequality: $\abs{\sum n^{-s}}\le\sum n^{-\sigma}$.
:::

The Euler product also survives the passage from real to complex $s$, because its proof in [[euler-product]] used only two things: absolute convergence and the rule $(mn)^{-s}=m^{-s}n^{-s}$.

:::: theorem {#t-zc-euler-product title="The Euler product holds for $\sigma>1$, and $\zeta$ has no zeros there"}
For $\sigma>1$,
$$
\zeta(s)=\prod_p\frac1{1-p^{-s}},
$$
the product converging absolutely, and $\zeta(s)\neq0$.
::::

::: proof
Fix $\sigma>1$ and a bound $P$. Each factor is a geometric series, $\frac1{1-p^{-s}}=\sum_{k\ge0}p^{-ks}$, with $\abs{p^{-s}}<1$. Multiplying the finitely many factors with $p\le P$ and using unique factorization, the product equals $\sum n^{-s}$ over the $n$ whose prime factors are all at most $P$. Every $n\le P$ is of that form, so
$$
\Bigl\lvert\zeta(s)-\prod_{p\le P}\frac1{1-p^{-s}}\Bigr\rvert\le\sum_{n>P}n^{-\sigma}\xrightarrow[P\to\infty]{}0.
$$
For the zeros: $\sum_p\abs{p^{-s}}<\infty$, so $\prod_p(1-p^{-s})$ converges to some $L$, and $L\cdot\zeta(s)=\lim_P\prod_{p\le P}(1-p^{-s})\cdot\prod_{p\le P}(1-p^{-s})^{-1}=1$. Since $L\cdot\zeta(s)=1$, $\zeta(s)\ne0$.
:::

Test it on $s=2+3i$. The first thousand arrows added head to tail give $0.79834-0.11374i$ (the example in [[s-ct-plane]]), and $\zeta(2+3i)=0.79802-0.11374i$ to the digits shown, with $\abs{\zeta(2+3i)}=0.806\le\zeta(2)=1.645$. The second theorem will matter immediately: it says no zero of $\zeta$ lies to the right of the line $\sigma=1$.

## Where the series stops, and why the function does not {#s-zc-fails}

At $\sigma\le 0$ the terms $\abs{n^{-s}}=n^{-\sigma}\ge1$ do not even tend to zero, so the sum cannot converge. At $s=1$ it is the harmonic series, which diverges. Approaching that edge from the right, the sum grows without bound but in an orderly way: $\zeta(1.5)=2.6124$, $\zeta(1.1)=10.5844$, and $\zeta(1.01)=100.5779$, close to $1/(\sigma-1)$ plus a constant near $0.58$. The sum is announcing a pole, and a pole is a perfectly good point for a holomorphic function to have nearby. On $0<\sigma\le1$ the arrows do shrink, but they shrink too slowly: [[t-zc-partial-sums]] will show how the partial sums behave there. In every case the series fails.

A formula that stops working is a statement about the formula. The geometric series $\sum z^k$ stops at $\abs z=1$, and the function $1/(1-z)$ it came from carries on, unaffected, for every $z\ne1$ ([[s-ct-continuation]]). The same may be true of $\zeta$. By [[t-ct-uniqueness]] there is at most one way to continue it, so the question is only whether a continuation exists and whether we can write it down. Riemann answered both in 1859 [@riemann1859]. We follow his route in two stages: a quick step into the strip $\sigma>0$, then the theta function for the whole plane.

## The first step in: an alternating series {#s-zc-alternating}

Many of the arrows in $\sum n^{-s}$ point in nearly the same direction, and their sum is large. Subtracting the even terms twice flips their sign, and the resulting arrows partly cancel.

:::: definition {#d-zc-eta title="the alternating zeta series"}
For $\sigma>0$ define
$$
\eta(s)=\sum_{n=1}^\infty(-1)^{n-1}n^{-s}=1-2^{-s}+3^{-s}-4^{-s}+\cdots.
$$
It is a different function from $\zeta$, with a different series. It is related to $\zeta$ by an exact formula where both converge, and it is the relation, and not equality, that gives the continuation.
::::

For $\sigma>1$ both series converge absolutely, and removing the even terms twice gives
$$
\eta(s)=\sum_n n^{-s}-2\sum_{n\ \mathrm{even}}n^{-s}=\zeta(s)-2\cdot2^{-s}\zeta(s)=(1-2^{1-s})\,\zeta(s).
$$ {#eq-zc-eta}

::::: card {#t-zc-continuation-strip kind="theorem" title="$\zeta$ extends to the half-plane $\sigma>0$ with a single simple pole at $s=1$, of residue $1$"}
:::: statement
The function $\zeta$ has an analytic continuation to $\{\sigma>0\}$ that is holomorphic except at $s=1$, where it has a simple pole of residue $1$. Away from the points $1+2\pi ik/\log2$ with $k\in\ZZ$, it is given there by $\zeta(s)=\eta(s)/(1-2^{1-s})$.
::::
:::: plain
Alternating the signs makes the series converge a bit further left, all the way to the imaginary axis. Dividing by $1-2^{1-s}$ undoes the damage, and the one place where the division is by zero, $s=1$, is where $\zeta$ blows up like $1/(s-1)$.
::::
:::: why
The nontrivial zeros of $\zeta$ lie at real part between 0 and 1. Before this step, the strip where they live is a region where $\zeta$ is not even defined. After it, the right half of the strip is covered, and we see the pole at 1, which is the analytic form of the divergence of $\sum 1/n$ and of the infinitude of the primes.
::::
:::: idea
The series for $\eta$ converges for $\sigma>0$ because its terms alternate and shrink. By [[eq-zc-eta]] the quotient $\eta/(1-2^{1-s})$ equals $\zeta$ on $\sigma>1$, so by uniqueness it is the continuation. The only worry is the points where the denominator vanishes; a second identity, with $3$ in place of $2$, shows that they are harmless except at $s=1$.
::::
:::: proof
*The series for $\eta$ converges and is holomorphic on $\sigma>0$.* The partial sums of $(-1)^{n-1}$ are $1,0,1,0,\dots$, bounded. Also $\abs{n^{-s}-(n+1)^{-s}}=\bigl\lvert s\int_n^{n+1}x^{-s-1}\,\dd x\bigr\rvert\le\abs s\,n^{-\sigma-1}$, which is summable for $\sigma>0$, and $n^{-s}\to0$. By Dirichlet's test, summation by parts, the series converges, uniformly on compact subsets of $\{\sigma>0\}$, so $\eta$ is holomorphic there.

*The quotient continues $\zeta$.* The function $\eta(s)/(1-2^{1-s})$ is meromorphic on $\sigma>0$, with possible poles at the zeros of $1-2^{1-s}$, which are $s_k=1+2\pi ik/\log2$ for $k\in\ZZ$. By [[eq-zc-eta]] it equals $\zeta$ on $\sigma>1$, so by [[t-ct-uniqueness]] it is the continuation of $\zeta$ wherever it is holomorphic.

*No pole at $s_k$ for $k\ne0$.* Remove the multiples of $3$ three times: $(1-3^{1-s})\zeta(s)=\sum_nb_nn^{-s}$ on $\sigma>1$, where $b_n=1$ if $3\nmid n$ and $b_n=-2$ if $3\mid n$. The partial sums of $b_n$ are $1,2,0,1,2,0,\dots$, bounded, so the same test shows this series converges on $\sigma>0$. Hence $\zeta$ also equals $\sum b_nn^{-s}/(1-3^{1-s})$, with possible poles only at $s'_{k'}=1+2\pi ik'/\log3$. A point in both lists satisfies $k\log3=k'\log2$, that is $3^k=2^{k'}$, which by unique factorization forces $k=k'=0$. So at each $s_k$ with $k\ne0$ one of the two expressions is holomorphic, and $\zeta$ has no pole there.

*The pole at $s=1$.* Near $s=1$ the denominator is $1-2^{1-s}=(s-1)\log2+O((s-1)^2)$, and $\eta(1)=1-\tfrac12+\tfrac13-\cdots=\log2$. So $\zeta(s)=\dfrac{\log 2+O(s-1)}{(s-1)\log2\,(1+O(s-1))}=\dfrac1{s-1}+O(1)$, a simple pole of residue $1$.
::::
:::: example
At $s=\tfrac12$: $\eta(\tfrac12)=0.6048986$ and $1-2^{1/2}=-0.4142136$, so $\zeta(\tfrac12)=-1.4603545$. The real series $\sum n^{-1/2}$ diverges to $+\infty$, but the continuation takes a negative value there. Near the pole, $\zeta(1.001)=1000.5773=1/0.001+0.5773$. The constant is Euler's constant $\gamma_E=\lim_N(1+\tfrac12+\dots+\tfrac1N-\log N)=0.5772157$, the next term of the expansion $\zeta(s)=\frac1{s-1}+\gamma_E+O(s-1)$, proved in [[t-zc-euler-constant]] below.
::::
:::: used
- The pole fixes the main term $x$ in the count $\psi(x)=x-\cdots$ of [[explicit-formula]]: the residue of $\zeta$ at $1$ is the origin of the "$x$".
- The full continuation, which this one is only the first step toward: [[t-zc-functional-equation]].
::::
:::::

The step cannot continue past $\sigma=0$ by this method. The alternating series genuinely diverges there, and each further correction costs another new identity.

### What the partial sums do below the line

Now that $\zeta$ has a value at every $s$ with $\sigma>0$, we can say exactly how the series fails there.

:::: theorem {#t-zc-partial-sums title="For $\sigma>0$ the partial sums miss $\zeta$ by a spiral of size $N^{1-\sigma}$"}
Let $S_N(s)=\sum_{n\le N}n^{-s}$. For $\sigma>0$ and $s\ne1$,
$$
S_N(s)=\zeta(s)+\frac{N^{1-s}}{1-s}+O\!\left(N^{-\sigma}\right)
$$ {#eq-zc-partial-sums}
as $N\to\infty$, with the implied constant depending on $s$.
::::

::: proof {collapsed}
For $\sigma>1$, write $\sum_{n>N}n^{-s}=\int_N^\infty x^{-s}\,\dd x+E_N(s)$ with $E_N(s)=\sum_{n>N}\bigl(n^{-s}-\int_{n-1}^nx^{-s}\,\dd x\bigr)$, and $\int_N^\infty x^{-s}\,\dd x=N^{1-s}/(s-1)$. For $x\in[n-1,n]$ we have $\abs{n^{-s}-x^{-s}}\le\abs s(n-x)(n-1)^{-\sigma-1}$, so each term of $E_N$ is at most $\tfrac12\abs s(n-1)^{-\sigma-1}$. Summing over $n>N$ bounds $\abs{E_N(s)}$ by $\tfrac12\abs s\,(N^{-\sigma-1}+N^{-\sigma}/\sigma)=O(N^{-\sigma})$, and the series defining $E_N$ converges locally uniformly for all $\sigma>0$, so $E_N$ is holomorphic there. Thus on $\sigma>1$
$$
\zeta(s)=S_N(s)+\frac{N^{1-s}}{s-1}+E_N(s),
$$
and the right side is holomorphic on $\sigma>0$ except for the pole at $1$. By uniqueness of continuation it is the continuation of $\zeta$. Rearrange to get [[eq-zc-partial-sums]].
:::

Three cases follow, and the arrows show all of them. For $\sigma>1$ the extra term $N^{1-s}/(1-s)$ has size $N^{1-\sigma}/\abs{1-s}\to0$, and the partial sums converge to $\zeta(s)$. For $\sigma=1$ with $t\ne0$ its size is $1/\abs t$ forever: the partial sums circle $\zeta(s)$ at a fixed radius, and never settle. For $0<\sigma<1$ its size grows like $N^{1-\sigma}$, so the partial sums spiral outward and diverge.

:::example
At $s=1+i$ the distance $\abs{S_N-\zeta(s)}$ is $1.0004,\ 1.000004,\ 1.00000004$ for $N=10,\,100,\,1000$, and $1/\abs{1-s}=1$. At $s=\tfrac12$ the partial sums are $5.02,\ 18.59,\ 61.80,\ 198.54$ for $N=10,\ 10^2,\ 10^3,\ 10^4$, tracking $2\sqrt N+\zeta(\tfrac12)$, where $\zeta(\tfrac12)=-1.46$ is the value the continuation assigns. The sharpest case is a zero of the continued function, $s=\tfrac12+14.1347i$, where $\zeta(s)=0$. The partial sums have size $0.709,\ 2.236,\ 7.071,\ 22.36,\ 70.70$ for $N=10^2,\dots,10^6$, growing by $\sqrt{10}$ for each factor of $10$ in $N$, in agreement with $\sqrt N/\abs{1-s}=\sqrt N/14.14$.
:::

:::: figure {#f-zc-partial-sums viz="zeta-arrows" height="460"}
Adding the arrows $n^{-s}$ head to tail spirals into $\zeta(s)$ for $\sigma>1$, circles it for $\sigma=1$, and spirals away from it for $0<\sigma<1$.

```vizspec
Purpose: show the series sum n^{-s} converging, failing, and spiraling, and that the continuation value zeta(s) sits at the center of the spiral.
Scene: two panels. Left, the s-plane with sigma in [0.1, 3], t in [-40, 40], the line sigma = 1 drawn in violet, with a draggable point s (start 2+3i). Right, the complex plane of partial sums, auto-fitted to the path. The path is the polyline 0, S_1, S_2, ..., S_N in gold, with the first 60 arrows drawn individually as thin arrows head to tail (each colored by n) and the rest as a thin line. A blue dot marks zeta(s). A red circle centered at zeta(s) with radius |N^{1-s}/(1-s)|, the predicted offset from equation (partial sums), is drawn and updated with N.
Controls: drag s in the left panel. A slider N from 1 to 20000 on a log scale, with a play button that increases N. Preset buttons: s = 2+3i, s = 1+i, s = 1/2, s = 1/2 + 14.1347i (the first zero, where the blue dot is at the origin).
Motion: moving N grows or shrinks the polyline. Dragging s across sigma = 1 makes the spiral open from a convergent coil into a circle and then into a growing coil, with the camera easing to fit.
Reader takeaway: the series fails at sigma <= 1 in a precise way, S_N = zeta(s) + N^{1-s}/(1-s) + small, and zeta(s) is the center around which the partial sums wind, defined even where they do not converge.
Data: zeta(s) for sigma >= 0.1 by Euler-Maclaurin, zeta(s) = sum_{n<M} n^{-s} + M^{1-s}/(s-1) + M^{-s}/2 + s M^{-s-1}/12 - s(s+1)(s+2) M^{-s-3}/720 with M = 50 (error below 1e-5 for |t| <= 40, sigma >= 0.1).
```
::::

The same formula pins down the constant term at the pole, which [[euler-product]] left as a promise.

:::: theorem {#t-zc-euler-constant title="The constant term of $\zeta$ at its pole is Euler's constant"}
$$
\zeta(s)=\frac1{s-1}+\gamma_E+O(s-1)\qquad\text{as }s\to1,\qquad\gamma_E=\lim_{N\to\infty}\Bigl(\sum_{n\le N}\frac1n-\log N\Bigr).
$$
::::

::: proof
Subtract $\frac1{s-1}$ from $\zeta(s)=S_N(s)+\frac{N^{1-s}}{s-1}+E_N(s)$ and let $s\to1$ with $N$ fixed. The terms converge: $S_N(s)\to H_N=\sum_{n\le N}\frac1n$, then $\frac{N^{1-s}-1}{s-1}\to-\log N$, and $E_N(s)\to E_N(1)$. So the constant term $c$ of the Laurent expansion at $1$ satisfies $c=H_N-\log N+E_N(1)$ for every $N$. By the bound in the previous proof, $\abs{E_N(1)}\le\tfrac12(N^{-2}+N^{-1})\to0$. Letting $N\to\infty$ gives $c=\lim_N(H_N-\log N)=\gamma_E$.
:::

For example, $H_{10000}-\log10000=0.5772657$ against $\gamma_E=0.5772157$, and the gap $0.00005$ is of the size $\tfrac1{2N}$ that the bound allows.

## The theta function {#s-zc-theta}

The alternating series reached only the half-plane $\sigma>0$. To go all the way we need an expression for $\zeta$ that has the symmetry hidden inside it built in. It comes from a sum of Gaussians.

:::: definition {#d-zc-theta title="Jacobi theta function"}
For real $t>0$ the *theta function* is
$$
\theta(t)=\sum_{n\in\ZZ}e^{-\pi n^2t}=1+2\sum_{n\ge1}e^{-\pi n^2t}.
$$
It is a function of the real variable $t$, a sum of Gaussians centered at $0$ and sampled at the integers. It is not a Dirichlet series: the exponent is $n^2$ and $n$ is in the exponent of $e$, not in the base of a power. It is the sum of $f(n)$ over the integers for the function $f(x)=e^{-\pi tx^2}$ of [[s-ct-fourier]].
::::

Its values show two regimes. For large $t$ only $n=0,\pm1$ matter: $\theta(2)=1.0037349$ and $\theta(4)=1.0000070$, both close to $1+2e^{-\pi t}$. For small $t$ the Gaussian is wide and many terms contribute: $\theta(1)=1.0864348$, and $\theta(0.01)=10.0000000$, where the direct sum needs $\abs n$ up to about $50$ before $e^{-\pi n^2/100}$ falls below $10^{-34}$. The ten in $\theta(0.01)=10$ is no accident.

::::: card {#t-zc-theta-symmetry kind="theorem" title="The theta function satisfies $\theta(1/t)=\sqrt t\,\theta(t)$" source="ss-fourier"}
:::: statement
For every $t>0$,
$$
\theta\!\left(\frac1t\right)=\sqrt t\,\theta(t).
$$ {#eq-zc-theta-symmetry}
::::
:::: plain
Playing the sum of Gaussians at speed $t$ is the same, up to a factor $\sqrt t$, as playing it at speed $1/t$. A function that is very sharply peaked on the integers is very flat in frequency, and the symmetry says that the lattice of integers looks the same from both sides.
::::
:::: why
This is the one new analytic input of the chapter. Everything else, the continuation to the plane, the functional equation, and the trivial zeros, follows by moving $t\mapsto1/t$ through Riemann's integral.
::::
:::: idea
Poisson summation says that a sum over the integers equals the same sum for the Fourier transform. The Fourier transform of a Gaussian of width $1/\sqrt t$ is a Gaussian of width $\sqrt t$, and the sum of those is $\theta(1/t)$ up to a constant.
::::
:::: proof
Apply [[t-ct-poisson]] to $f(x)=e^{-\pi tx^2}\in\mathcal S(\RR)$. The left side is $\sum_nf(n)=\theta(t)$. By [[eq-ct-gauss-dilation]], $\hat f(k)=t^{-1/2}e^{-\pi k^2/t}$, so the right side is $t^{-1/2}\sum_ke^{-\pi k^2/t}=t^{-1/2}\theta(1/t)$. Hence $\theta(t)=t^{-1/2}\theta(1/t)$, which is [[eq-zc-theta-symmetry]].
::::
:::: example
At $t=4$ the identity says $\theta(\tfrac14)=2\,\theta(4)$. Numerically $\theta(\tfrac14)=2.0000139$ and $2\theta(4)=2.0000139$. At $t=100$ it says $\theta(0.01)=10\,\theta(100)=10(1+2e^{-100\pi})$, so $\theta(0.01)$ differs from $10$ by less than $10^{-135}$. The symmetry replaced a sum of fifty terms by a single one.
::::
:::: used
- Riemann's integral and the functional equation: [[s-zc-integral]] and [[t-zc-functional-equation]].
- The bridge to the 2026 proofs, where this step reappears on adeles: [[s-zc-bridge]].
::::
:::::

::: aside
In the variable $\tau=it$, the function $\sum e^{\pi in^2\tau}$ is a modular form of weight $\tfrac12$ and $t\mapsto1/t$ is the inversion $\tau\mapsto-1/\tau$ restricted to the imaginary axis [@ss-complex, Chapter 10]. Riemann used only the real symmetry, and that is all we need.
:::

:::: figure {#f-zc-theta viz="theta-gaussians" height="440"}
The same sum of Gaussians can be added up over positions or over frequencies, and the two totals differ by exactly the factor $\sqrt t$.

```vizspec
Purpose: make theta(1/t) = sqrt(t) theta(t) visible as Poisson summation applied to a Gaussian, so the reader sees why a narrow Gaussian forces a wide transform.
Scene: two stacked panels sharing the horizontal axis x in [-6, 6]. Top panel, with the axis note "positions": the Gaussian g(x) = exp(-pi t x^2) as a blue curve and vertical gold bars of height g(n) at each integer n from -6 to 6, with a running sum printed as "theta(t) = ...". Bottom panel, labeled "frequencies": the transform ghat(y) = t^{-1/2} exp(-pi y^2 / t) as a teal curve and teal bars of height ghat(k) at each integer k, with a running sum printed as "t^{-1/2} theta(1/t) = ...". Between the panels, an equals sign that turns green when the two sums agree to 6 digits (always).
Controls: slider for t on a log scale from 0.05 to 20, with default t = 1. A button "t -> 1/t" that swaps to the reciprocal value and animates. A checkbox that shows the individual bar heights as numbers for |n| <= 3.
Motion: as t decreases the top Gaussian widens and more gold bars become tall, while the bottom Gaussian narrows and only the central teal bar survives. The reverse for increasing t. The bar totals change but their ratio stays fixed.
Reader takeaway: wide in position means narrow in frequency, and summing at the integers on one side equals summing at the integers on the other side.
Data: none. Use the closed forms.
```
::::

## Riemann's integral {#s-zc-integral}

Let $\omega(t)=\sum_{n\ge1}e^{-\pi n^2t}=\tfrac12(\theta(t)-1)$, the theta function with the constant term removed. The number $\omega(t)$ is small when $t$ is large, about $e^{-\pi t}$.

We now build a Mellin transform of $\omega$ and read off the zeta function. This is the model computation of [[s-ct-mellin]] with Gaussians in place of exponentials. Put
$$
\Phi(s)=\pi^{-s/2}\,\Gamma\!\left(\frac s2\right)\zeta(s).
$$

:::: theorem {#t-zc-riemann-integral title="For $\sigma>1$, $\Phi(s)$ is the Mellin transform of $\omega$ at $s/2$" source="riemann1859"}
For $\sigma>1$,
$$
\pi^{-s/2}\,\Gamma\!\left(\frac s2\right)\zeta(s)=\int_0^\infty\omega(t)\,t^{s/2}\,\frac{\dd t}t.
$$ {#eq-zc-riemann-integral}
::::

::: proof
1. The Mellin transform of one Gaussian. By the example in [[s-ct-mellin]] with $a=\pi n^2$ and $s/2$ in place of $s$, $\int_0^\infty e^{-\pi n^2t}t^{s/2}\,\frac{\dd t}t=(\pi n^2)^{-s/2}\Gamma(s/2)=\pi^{-s/2}n^{-s}\Gamma(s/2)$.
2. Sum over $n$. The sum of absolute values of the terms is $\sum_n\pi^{-\sigma/2}n^{-\sigma}\Gamma(\sigma/2)$, finite exactly when $\sigma>1$. So sum and integral may be exchanged (Tonelli, then Fubini).
3. Conclude. Exchanging them gives $\int_0^\infty\omega(t)t^{s/2}\frac{\dd t}t=\pi^{-s/2}\Gamma(s/2)\sum_nn^{-s}$, which is the left side.
:::

Why does the integral hold only for $\sigma>1$ and what is gained by writing it? A Mellin transform is a sum over scales: the number $\omega(t)$ records how much of the lattice sum lives at scale $t$, and the weight $t^{s/2}$ asks how much that scale matters. At large $t$ the Gaussians are narrow and almost all vanish, and the contribution is exponentially small for any $s$. At small $t$ there are many terms, and how fast they grow is what the weight must beat. The same computation with $e^{-nx}$ in place of $e^{-\pi n^2t}$ would give $\Gamma(s)\zeta(s)=\int_0^\infty\frac{x^{s-1}}{e^x-1}\,\dd x$, which also has a bad end at $x=0$, but it has no symmetry to exploit there. The Gaussian does, and that is why Riemann used it.

Test it at $s=2$. The left side is $\pi^{-1}\Gamma(1)\zeta(2)=\pi/6=0.5235988$, and numerical integration of the right side gives $0.5235988$. At $s=3$ both sides are $0.1913133$, and at $s=4$ both are $0.1096623$.

The condition $\sigma>1$ is no coincidence. Near $t=0$ the symmetry [[eq-zc-theta-symmetry]] gives $\theta(t)\approx t^{-1/2}$, so $\omega(t)\approx\tfrac12t^{-1/2}$ and the integrand behaves like $\tfrac12t^{(\sigma-3)/2}$, which is integrable at $0$ exactly when $\sigma>1$. The integral fails where the Dirichlet series fails. The difficulty has moved from a sum that diverges to an integral that diverges at one end, and at that end we have a tool, the symmetry $t\mapsto1/t$, which trades the end near $0$ for the end near $\infty$.

## The functional equation {#s-zc-functional-equation}

:::: definition {#d-zc-xi title="the completed zeta function"}
The *completed zeta function* is
$$
\xi(s)=\tfrac12\,s(s-1)\,\pi^{-s/2}\,\Gamma\!\left(\frac s2\right)\zeta(s)=\tfrac12\,s(s-1)\,\Phi(s).
$$
It is zeta multiplied by three factors: the polynomial $\tfrac12s(s-1)$ cancels the poles at $0$ (from $\Gamma(s/2)$) and $1$ (from $\zeta$); the poles of the Gamma factor at $-2,-4,\dots$ cancel the zeros of $\zeta$ there; and $\pi^{-s/2}$ is the factor that makes the symmetry exact. It is not $\zeta$, and what makes it better is that it is entire and symmetric. Its zeros are exactly the nontrivial zeros of $\zeta$, as [[t-zc-trivial-zeros]] shows.
::::

::::: card {#t-zc-functional-equation kind="theorem" title="$\zeta$ continues to the whole plane, and its completion $\xi$ is entire and symmetric under $s\mapsto1-s$" source="riemann1859"}
:::: statement
1. The function $\xi(s)$ extends to an entire function.
2. $\xi(s)=\xi(1-s)$ for all $s\in\CC$.
3. Consequently $\zeta(s)=\dfrac{2\pi^{s/2}\,\xi(s)}{s(s-1)\,\Gamma(s/2)}$ is meromorphic on $\CC$. Its only pole is a simple pole at $s=1$, of residue $1$, and $\zeta(0)=-\tfrac12$.
::::
:::: plain
Zeta, dressed with Gamma and a polynomial, is the same when you swap $s$ and $1-s$. Everything the function does on the right half of the plane is mirrored on the left half. The plane has no new corners to explore: knowing zeta for $\sigma\ge\tfrac12$ means knowing it everywhere.
::::
:::: why
Two things need this theorem. The zeros of $\zeta$ will be counted and located, and the symmetry cuts the work in half and makes the line $\sigma=\tfrac12$ special. And both 2026 proofs begin from generalizations of the theta-function step that produces it ([[s-zc-bridge]]).
::::
:::: idea
Riemann's integral is a Mellin transform in $t$. Cut it at $t=1$. The piece $\int_1^\infty$ is fine for all $s$ because $\omega$ decays like $e^{-\pi t}$. The piece $\int_0^1$ is turned, by $t\mapsto1/t$ and the theta symmetry, into another $\int_1^\infty$, with $s$ replaced by $1-s$, and two elementary terms. Everything is then visibly symmetric.
::::
:::: proof
Work with $\sigma>1$ and track each step. The first five steps turn the integral from $0$ to $1$ into an integral from $1$ to $\infty$ and two elementary terms.

::: steps
1. Cut the integral [[eq-zc-riemann-integral]] at $t=1$: $\Phi(s)=\int_1^\infty\omega(t)t^{s/2}\frac{\dd t}t+\int_0^1\omega(t)t^{s/2}\frac{\dd t}t$.
2. Substitute $t=1/u$ in the second piece: $\int_0^1\omega(t)t^{s/2}\frac{\dd t}t=\int_1^\infty\omega(1/u)\,u^{-s/2}\frac{\dd u}u$.
3. Rewrite $\omega(1/u)$ using [[eq-zc-theta-symmetry]] and $\theta=1+2\omega$: $\omega(1/u)=\tfrac12\bigl(\sqrt u\,\theta(u)-1\bigr)=\sqrt u\,\omega(u)+\tfrac12(\sqrt u-1)$.
4. Insert it: the second piece becomes $\int_1^\infty\omega(u)\,u^{(1-s)/2}\frac{\dd u}u+\tfrac12\int_1^\infty\bigl(u^{(1-s)/2}-u^{-s/2}\bigr)\frac{\dd u}u$. The split is allowed because each integral converges on its own: the first because $\omega(u)$ decays like $e^{-\pi u}$ (step 6), the second because $\sigma>1$.
5. Evaluate the elementary integral, using $\int_1^\infty u^{-a-1}\,\dd u=1/a$ for $\Re a>0$ with $a=(s-1)/2$ and $a=s/2$: $\tfrac12\bigl(\tfrac2{s-1}-\tfrac2s\bigr)=\tfrac1{s-1}-\tfrac1s$.
:::

Putting the steps together gives
$$
\Phi(s)=\frac1{s-1}-\frac1s+\int_1^\infty\omega(t)\bigl(t^{s/2}+t^{(1-s)/2}\bigr)\frac{\dd t}t.
$$ {#eq-zc-phi-split}

::: steps
6. The integral in [[eq-zc-phi-split]] is an entire function of $s$. For $t\ge1$, $n^2\ge n$ gives $\omega(t)\le\sum_{n\ge1}e^{-\pi nt}=\frac{e^{-\pi t}}{1-e^{-\pi t}}\le1.05\,e^{-\pi t}$. On a compact set of $s$ with $\abs\sigma\le R$ we have $\abs{t^{s/2}}+\abs{t^{(1-s)/2}}\le2t^{(R+1)/2}$, so the integrand is at most $2.1\,t^{(R+1)/2-1}e^{-\pi t}$, an integrable function of $t$ on $[1,\infty)$ that does not depend on $s$. The integrand is continuous and entire in $s$, so [[l-ct-holomorphic-integral]] applies.
7. Hence the right side of [[eq-zc-phi-split]] is meromorphic on $\CC$, with poles at most at $0$ and $1$. It agrees with $\Phi$ on $\sigma>1$, so by [[t-ct-uniqueness]] it is the continuation of $\Phi$, and $\zeta(s)=\pi^{s/2}\Phi(s)/\Gamma(s/2)$ continues too.
8. The right side of [[eq-zc-phi-split]] is unchanged under $s\mapsto1-s$: the first two terms go to $\frac1{-s}-\frac1{1-s}=\frac1{s-1}-\frac1s$, and the two terms $t^{s/2},t^{(1-s)/2}$ swap. Hence $\Phi(s)=\Phi(1-s)$.
9. Multiply by $\tfrac12s(s-1)$. The polynomial is unchanged under $s\mapsto1-s$ because $(1-s)(-s)=s(s-1)$, and it cancels the two poles, since $s(s-1)\bigl(\frac1{s-1}-\frac1s\bigr)=s-(s-1)=1$. So $\xi(s)=\tfrac12+\tfrac12s(s-1)\int_1^\infty\omega(t)\bigl(t^{s/2}+t^{(1-s)/2}\bigr)\frac{\dd t}t$, which is entire (part 1), and $\xi(s)=\xi(1-s)$ (part 2).
10. Solve for $\zeta$: $\zeta(s)=2\pi^{s/2}\xi(s)/\bigl(s(s-1)\Gamma(s/2)\bigr)$. The function $1/\Gamma$ is entire ([[s-ct-gamma]]), and $\xi$ is entire, so the only possible poles are the zeros of $s(s-1)$.
11. At $s=0$: $\Gamma(s/2)\sim2/s$, so $s\,\Gamma(s/2)\to2$ and $\zeta(0)=\dfrac{2\cdot\xi(0)}{(-1)\cdot2}=-\tfrac12$, using $\xi(0)=\tfrac12$, which is the formula of step 9 at $s=0$. There is no pole at $0$.
12. At $s=1$: $\zeta(s)\sim\dfrac{2\pi^{1/2}\,\xi(1)}{(s-1)\,\Gamma(1/2)}=\dfrac{2\cdot\frac12\sqrt\pi}{\sqrt\pi\,(s-1)}=\dfrac1{s-1}$, a simple pole of residue $1$, using $\xi(1)=\xi(0)=\tfrac12$ and $\Gamma(\tfrac12)=\sqrt\pi$.
:::
::::
:::: example
Numerically, $\xi(0)=\xi(1)=\tfrac12$ and $\xi(\tfrac12)=0.4971208$. Take $s=0.3+2i$. Then $\xi(s)=0.453449-0.008437i$, and $\xi(1-s)=\xi(0.7-2i)$ equals it to twenty digits. The integral formula in step 9 gives the same value of $\xi(s)$, so the continuation agrees with $\zeta$ computed independently. The residue at $s=1$ is the same $1$ found in the strip theorem, as it must be by [[t-ct-uniqueness]].
::::
:::: used
- Zeros of $\zeta$ in the strip and their symmetry: [[s-zc-reflection]] and [[zeros]].
- The location of the trivial zeros: [[t-zc-trivial-zeros]].
- The explicit formula of [[explicit-formula]] needs $\zeta'/\zeta$ on the whole plane, which this theorem provides.
::::
:::::

Two independent continuations now exist on $\sigma>0$, one from the alternating series and one from Riemann's integral, and by [[t-ct-uniqueness]] they must agree. They do. At $s=\tfrac12$ the alternating series gave $\zeta(\tfrac12)=-1.4603545$. The formula of part 3 gives $\zeta(\tfrac12)=\dfrac{2\pi^{1/4}\,\xi(\tfrac12)}{\tfrac12\cdot(-\tfrac12)\,\Gamma(\tfrac14)}=\dfrac{2(1.3313354)(0.4971208)}{-0.25\cdot3.6256099}=-1.4603545$. Two different calculations, with different convergence regions and different ingredients, produce the same eight digits because there is only one holomorphic function to find.

The functional equation is often quoted in an asymmetric form, with $\zeta(s)$ on one side and $\zeta(1-s)$ on the other. Substituting the definition of $\xi$ into $\xi(s)=\xi(1-s)$ and using the duplication and reflection formulas for $\Gamma$ gives
$$
\zeta(s)=2^s\pi^{s-1}\sin\!\Bigl(\frac{\pi s}2\Bigr)\Gamma(1-s)\,\zeta(1-s),
$$
which is the form in [@titchmarsh, §2.1]. At $s=0.3+2i$ both sides equal $0.385310-0.282528i$. We keep the symmetric form $\xi(s)=\xi(1-s)$, which has no Gamma factors to carry.

::: symbols
| symbol | what it is | kind | where it lives |
| --- | --- | --- | --- |
| $\eta(s)$ | the alternating series $\sum(-1)^{n-1}n^{-s}$ | function | holomorphic on $\sigma>0$ |
| $S_N(s)$ | the partial sum $\sum_{n\le N}n^{-s}$ | function | entire |
| $\gamma_E$ | Euler's constant $0.5772157\dots$ | real number | constant term of $\zeta$ at $s=1$ |
| $\omega(t)$ | $\sum_{n\ge1}e^{-\pi n^2t}=\tfrac12(\theta(t)-1)$ | function | $t>0$ |
| $\Phi(s)$ | $\pi^{-s/2}\Gamma(s/2)\zeta(s)$ | function | meromorphic on $\CC$, poles at $0,1$ |
| $\xi(s)$ | $\tfrac12s(s-1)\Phi(s)$ | function | entire |
:::

## The symmetry as geometry {#s-zc-reflection}

What does $\xi(s)=\xi(1-s)$ look like in the plane? The map $s\mapsto1-s$ takes the point $\sigma+it$ to $(1-\sigma)-it$. It is the half-turn about the point $s=\tfrac12$ on the real axis: a rotation by $180^\circ$, and not a reflection in a line.

A second symmetry comes from the formula in step 9. The function $\omega$ is real, and $\overline{t^{s/2}}=t^{\bar s/2}$ for real $t>0$, so $\xi(\bar s)=\overline{\xi(s)}$. Combining the two,
$$
\xi(1-\bar s)=\xi(\bar s)=\overline{\xi(s)},\qquad\text{so}\qquad\abs{\xi(1-\bar s)}=\abs{\xi(s)}.
$$ {#eq-zc-mirror}
The map $s\mapsto1-\bar s$ is the *reflection in the vertical line $\sigma=\tfrac12$*: it fixes the line and swaps the sides. So $\abs\xi$ is a mirror-symmetric landscape with the mirror at $\sigma=\tfrac12$, and a domain coloring of $\xi$ is mirrored in the line with the hues reversed.

On the line itself, $1-\bar s=s$. Taking $s=\tfrac12+it$ in $\xi(s)=\xi(1-s)$ gives $\xi(\tfrac12+it)=\xi(\tfrac12-it)=\overline{\xi(\tfrac12+it)}$, so $\xi(\tfrac12+it)$ is a real number. As a check, $\xi(\tfrac12+10i)=0.0379679$, with imaginary part zero to 21 decimal places. A real function of one variable $t$ changes sign at each simple zero, and so a sign change between two values of $t$ proves a zero in between. That is how zeros on the line are caught numerically: the first one, at $t=14.134725$, is where $\xi(\tfrac12+it)$ crosses $0$. The symmetry also halves the work: knowing $\xi$ on $\sigma\ge\tfrac12$ and $t\ge0$ gives it on the whole plane.

The symmetries also act on zeros. If $\rho$ is a zero of $\xi$ then so are $1-\rho$, $\bar\rho$, and $1-\bar\rho$. Off the line these four points are distinct (no zero is real, as [[zeros]] shows) and a zero comes with three partners. On the line, $\bar\rho=1-\rho$ and the quadruple collapses to a pair, $\rho$ and $\bar\rho$. The Riemann Hypothesis is the assertion that every quadruple collapses, and it is taken up in [[zeros]].

:::: figure {#f-zc-reflection viz="xi-mirror" height="460"}
The map $s\mapsto1-\bar s$ is the reflection in the line $\sigma=\tfrac12$, and $\abs{\xi}$ takes the same value at a point and its mirror image.

```vizspec
Purpose: show the symmetry xi(s) = xi(1 - s) as a half-turn about 1/2, show |xi| as a mirror image in the critical line, and show that the zeros come in sets of four off the line and pairs on it.
Scene: domain coloring of xi(s) on sigma in [-3, 4], t in [-25, 25]. Hue = arg xi (standard color wheel, red at arg 0), brightness = 0.5 + atan(log|xi|)/pi. The critical line sigma = 1/2 drawn in violet, the real axis in muted. A draggable point s (start 1.4 + 6i) drawn as a ring, and three linked rings: 1 - s (the half-turn image about 1/2), conj(s), and 1 - conj(s) (the mirror image in the line sigma = 1/2). The nontrivial zeros with |t| <= 25 are teal dots: 1/2 +- 14.1347i and 1/2 +- 21.0220i.
Controls: drag s anywhere. Three toggles: "show 1 - s", "show conj s", "show 1 - conj s". A switch "colors: xi / zeta" that recolors the same window with zeta, which is visibly not symmetric.
Motion: when a toggle is turned on, the corresponding ring travels from s to its image in 500 ms: along a half-circle about 1/2 for 1 - s, a horizontal slide through the line for 1 - conj s, a vertical flip for conj s.
Readout: a table of xi at s, 1 - s, conj s, and 1 - conj s to 6 digits, with lines stating whether xi(s) = xi(1 - s) (true) and |xi(1 - conj s)| = |xi(s)| (true). A tick on the critical line shows that xi(1/2 + it) is a real number.
Reader takeaway: xi is invariant under the half-turn, |xi| is invariant under the mirror in sigma = 1/2, xi is real on that line, and a zero off the line has three partners.
Data: xi on the quarter plane sigma in [1/2, 4], t in [0, 25] at spacing 0.02, computed offline with mpmath at 30 digits and shipped as float32 real and imaginary parts. The rest of the plane is generated from xi(s) = xi(1 - s) and xi(conj s) = conj xi(s), which is the lesson. The zeta coloring needs a second grid of zeta on sigma in [-3, 4], t in [0, 25], with conjugate symmetry for t < 0. No complex Gamma is computed in the browser.
```
::::

## The trivial zeros {#s-zc-trivial}

The functional equation settles the zeros of $\zeta$ outside a vertical band.

:::: definition {#d-zc-trivial-zero title="trivial and nontrivial zeros"}
The *trivial zeros* of $\zeta$ are the points $s=-2,-4,-6,\dots$. Every other zero of $\zeta$ is a *nontrivial zero*. Trivial means that the zero is accounted for by a known factor, here the Gamma function. It does not mean that the zero is uninteresting, only that it carries no arithmetic information.
::::

:::: theorem {#t-zc-trivial-zeros title="Outside the closed strip $0\le\sigma\le1$, the only zeros of $\zeta$ are the trivial zeros, and they are simple"}
$\zeta(s)=0$ for $s=-2,-4,-6,\dots$, each zero is simple, and $\zeta(s)\ne0$ for every other $s$ with $\sigma>1$ or $\sigma<0$. Hence every nontrivial zero lies in the closed strip $0\le\sigma\le1$.
::::

::: proof
For $\sigma>1$ there are no zeros by [[t-zc-euler-product]]. Now let $\sigma<0$. By [[t-zc-functional-equation]], $\zeta(s)=2\pi^{s/2}\xi(s)/\bigl(s(s-1)\Gamma(s/2)\bigr)$ and $\xi(s)=\xi(1-s)$. Write out $\xi(1-s)=\tfrac12(1-s)(-s)\,\pi^{-(1-s)/2}\,\Gamma\!\bigl(\tfrac{1-s}2\bigr)\,\zeta(1-s)$. Here $\Re(1-s)>1$, so $\zeta(1-s)\neq0$ by [[t-zc-euler-product]], $\Gamma\bigl(\tfrac{1-s}2\bigr)$ is finite because its argument has positive real part and nonzero because $\Gamma$ has no zeros ([[s-ct-gamma]]), and $s\ne0,1$. So $\xi(s)\ne0$ on $\sigma<0$, and the zeros of $\zeta(s)$ there are exactly the zeros of $1/\Gamma(s/2)$. Those are at $s/2=0,-1,-2,\dots$, and $s=0$ is excluded since $\sigma<0$. Each is a simple zero because $\Gamma$ has a simple pole there ([[t-ct-gamma-props]]).
:::

Test it. The values $\zeta(-2)=\zeta(-4)=0$, while $\zeta(-2.5)=0.0085169$ is not zero. The first nontrivial zeros are at heights $14.134725$, $21.022040$, $25.010858$, $30.424876$, $32.935062$ on the line $\sigma=\tfrac12$, and $\zeta$ has exactly three zeros with $0<t\le30$ (counted by the argument principle, as [[zeros]] will do). The theorem leaves open what happens inside the strip. The strip is the entire content of the Riemann Hypothesis, and [[zeros]] will show that no zero sits on $\sigma=0$ or $\sigma=1$.

:::: figure {#f-zc-zeta-domain viz="zeta-domain" height="520"}
Domain coloring of $\zeta$ shows one pole at $s=1$, trivial zeros on the negative real axis, and the nontrivial zeros as dark points on the line $\sigma=\tfrac12$.

```vizspec
Purpose: show the whole analytic structure of zeta in one picture: a pole at 1, simple zeros at -2, -4, -6, and the nontrivial zeros stacked up the line sigma = 1/2, with no zeros to the right of sigma = 1.
Scene: domain coloring of zeta(s) on sigma in [-8, 4], t in [-3, 36]. Hue = arg zeta, brightness = 0.5 + atan(log|zeta|)/pi, standard color wheel (red at arg 0). The line sigma = 1 and the line sigma = 1/2 drawn as thin violet lines, the real axis as a muted line. The pole at s = 1 is a bright white point with the wheel running clockwise; zeros are dark points with the wheel running counterclockwise. Labels appear on hover: "pole, residue 1", "trivial zero -2k", "nontrivial zero 1/2 + 14.1347i".
Controls: drag-to-pan and a zoom slider; a toggle "show convergence region sigma > 1" that tints the right half-plane in gold and labels it "series converges"; a toggle "show strip" that tints 0 <= sigma <= 1 in violet; a probe point that prints zeta(s) to 6 digits, with a thin circle around it whose hue winds are counted.
Motion: toggling the tint cross-fades in 300 ms. Dragging the probe loop over a zero changes the winding counter from 0 to 1.
Reader takeaway: the right half-plane where the series converges is a small part of the picture; the continuation has one pole, trivial zeros on the negative axis, and nontrivial zeros inside the strip.
Data: zeta on a grid of spacing 0.02 computed offline with mpmath at 20 digits, stored as 8-bit hue and 8-bit brightness arrays per pixel (about 120 KB). Zero positions: the first five ordinates, all inside the window, from mpmath: 14.134725, 21.022040, 25.010858, 30.424876, 32.935062.
```
::::

## Values at negative integers, and what they do not mean {#s-zc-values}

The continuation has values at every integer. Some come from the formula by a short calculation.

:::example
*The value at 0.* Step 11 of the proof gave $\zeta(0)=-\tfrac12$.

*The value at $-1$.* Use $\xi(-1)=\xi(2)=\tfrac12\cdot2\cdot1\cdot\pi^{-1}\Gamma(1)\zeta(2)=\zeta(2)/\pi=\pi/6$, where $\zeta(2)=\pi^2/6=1.6449341$ is Euler's value. Then
$$
\zeta(-1)=\frac{2\pi^{-1/2}\,\xi(-1)}{(-1)(-2)\,\Gamma(-\tfrac12)}=\frac{2\pi^{-1/2}\cdot\pi/6}{2\cdot(-2\sqrt\pi)}=-\frac1{12},
$$
using $\Gamma(-\tfrac12)=-2\sqrt\pi$ from [[t-ct-gamma-props]].

*The value at $-3$.* The same computation with $\xi(-3)=\xi(4)=\pi^2/15$ and $\Gamma(-\tfrac32)=\tfrac43\sqrt\pi$ gives $\zeta(-3)=\tfrac1{120}$. In general $\zeta(1-2k)=-B_{2k}/(2k)$, with $B_{2k}$ the Bernoulli numbers [@edwards]. Every one of these was checked numerically: $\zeta(-1)=-0.0833333$, $\zeta(-3)=0.0083333$, $\zeta(-5)=-0.0039683$.
:::

::: warning
**"$1+2+3+\cdots=-\tfrac1{12}$" does not say what it seems to say.** What is true is that the unique continuation of $\sum n^{-s}$ takes the value $-\tfrac1{12}$ at $s=-1$. At $s=-1$ the series itself is $1+2+3+\cdots$, with partial sums $N(N+1)/2$ that diverge to $+\infty$. So:

- It is *not* a statement that the partial sums approach $-\tfrac1{12}$, or that the sum is $-\tfrac1{12}$ in the usual sense. The partial sums go to infinity.
- It is *not* the Abel sum or the Cesàro sum. Abel summation (the limit of $\sum nx^n$ as $x\to1^-$) and Cesàro summation both diverge to $+\infty$ here.
- It *is* the same kind of statement as $1+2+4+8+\cdots=-1$, which is $\tfrac1{1-z}$ at $z=2$ in [[s-ct-continuation]]: the value of a function at a point where its defining series diverges.
- It *is* forced, by [[t-ct-uniqueness]]: any holomorphic function equal to $\sum n^{-s}$ on $\sigma>1$ has the value $-\tfrac1{12}$ at $-1$.
- It *does* have a sum-like meaning with a cutoff. With the smooth cutoff $e^{-\varepsilon n}$, $\sum ne^{-\varepsilon n}=1/\varepsilon^2-\tfrac1{12}+O(\varepsilon^2)$. For $\varepsilon=0.1$ this is $99.916708$ against $100-\tfrac1{12}=99.916667$. The divergent part $1/\varepsilon^2$ is what the cutoff throws away, and $-\tfrac1{12}$ is the finite part left over.
:::

## The bridge to the proofs {#s-zc-bridge}

Look back at where the symmetry came from. Not from the Dirichlet series, and not from the Euler product, which sees only the primes. It came from the theta function, a sum over the integers, and from Poisson summation, which says that the integers are their own dual. The Gamma factor $\pi^{-s/2}\Gamma(s/2)$ is the price of turning that sum into a Mellin transform, and it plays the role of an Euler factor for a "prime at infinity".

Both 2026 proofs begin from far-reaching generalizations of exactly this step. Masullo's proof generalizes the single sum over $\ZZ$ to adelic theta functions, which is Tate's thesis carried out in families. The proof of Alpoge with Claude generalizes it to theta lifts between totally definite unitary groups. Parts III and IV of this page return to those objects. For now the point is that the function whose zeros encode the primes, and its symmetry, have the same source: a Gaussian sum over a lattice, and its Fourier transform.

::: recap
You now have the following, and where each is used.

- $\zeta(s)=\sum n^{-s}$ is holomorphic on $\sigma>1$, equals the Euler product there, and has no zeros there ([[t-zc-converges]], [[t-zc-euler-product]]): used for the zero-free half-plane in [[zeros]].
- The series fails at $\sigma\le1$, and the partial sums spiral around $\zeta(s)$ by $N^{1-s}/(1-s)$ ([[t-zc-partial-sums]]).
- $\zeta$ continues to $\sigma>0$ with a simple pole of residue $1$ at $s=1$ ([[t-zc-continuation-strip]]): the main term in [[explicit-formula]].
- The theta symmetry $\theta(1/t)=\sqrt t\,\theta(t)$ is Poisson summation on a Gaussian ([[t-zc-theta-symmetry]]).
- Riemann's integral and the functional equation: $\xi$ is entire and $\xi(s)=\xi(1-s)$, and $\zeta$ is meromorphic on $\CC$ ([[t-zc-functional-equation]]).
- The symmetry is a half-turn about $\tfrac12$; $\abs\xi$ is mirrored in the line $\sigma=\tfrac12$; $\xi$ is real on it; zeros come in quadruples ([[s-zc-reflection]]).
- The trivial zeros are at $-2,-4,\dots$, and all other zeros lie in the closed strip ([[t-zc-trivial-zeros]]).
- $\zeta(0)=-\tfrac12$ and $\zeta(-1)=-\tfrac1{12}$ are values of a continuation and not sums ([[s-zc-values]]).
:::
