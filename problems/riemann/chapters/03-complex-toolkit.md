---
id: complex-toolkit
title: The complex analysis we need
part: 1
summary: After this chapter you can read a domain-coloring picture, continue a function off its series, count zeros with a contour integral, and use the Gamma function, the Fourier transform, Poisson summation, and the Mellin transform with its inversion.
needs: [euler-product]
---

::: plain
Complex analysis is the study of functions of a complex variable that can be differentiated in the complex sense. That one condition makes them rigid: a function that is known on a tiny patch is known everywhere, and its zeros can be counted by walking around a loop. The zeta function will turn out to be one of these functions, so every tool here is a way of reading it.
:::

The previous chapters worked with $\zeta(s)=\sum n^{-s}$ for real $s>1$. To see the primes through their zeros, $s$ must be allowed to move through the whole complex plane, and the formula has to survive the trip. This chapter is the refresher that makes that trip possible. It states each tool, draws it, tests it on the smallest example, and says where on the page it will be used. Proofs appear only when they are short.

## Complex numbers and the arrow $n^{-s}$ {#s-ct-plane}

::: recall
**Complex numbers.** A complex number $z=x+iy$ is the point $(x,y)$ in the plane, with $i^2=-1$. Its length is $\abs{z}=\sqrt{x^2+y^2}$. Its polar form is $z=re^{i\phi}$ with $r=\abs z$ and $e^{i\phi}=\cos\phi+i\sin\phi$. Multiplying two complex numbers multiplies their lengths and adds their angles, because $e^{a+b}=e^ae^b$. The exponential $e^{x+iy}=e^x e^{iy}$ has length $e^x$ and angle $y$.
:::

Write the complex variable as $s=\sigma+it$, with $\sigma=\Re s$ and $t=\Im s$. We need a meaning for $n^{-s}$ when $s$ is not a real number.

:::: definition {#d-ct-power title="the complex power $n^{-s}$"}
For a positive integer $n$ and a complex number $s$, define
$$
n^{-s} = e^{-s\log n},
$$
where $\log n$ is the real natural logarithm. This is a complex number, a definition and not a repeated multiplication, because $n$ cannot be multiplied by itself $-s$ times when $s$ is complex. It agrees with the usual power when $s$ is an integer, and it keeps the rule $(mn)^{-s}=m^{-s}n^{-s}$, since $\log mn=\log m+\log n$.
::::

Split $s$ into its parts:
$$
n^{-s} = e^{-\sigma\log n}\,e^{-it\log n} = n^{-\sigma}\,e^{-it\log n}.
$$ {#eq-ct-arrow}
So $n^{-s}$ is an arrow in the plane with length $n^{-\sigma}$ and angle $-t\log n$. The real part $\sigma$ sets how fast the arrows shrink as $n$ grows. The imaginary part $t$ sets how fast they turn, and it turns them at a rate that slows down logarithmically: the arrows for $n=1,2,3,\dots$ sweep through angles $0,\,-t\log 2,\,-t\log 3,\dots$. This one equation is the picture behind everything later.

::: example
Take $s=2+3i$. The first five arrows, computed from [[eq-ct-arrow]], are:

| $n$ | length $n^{-2}$ | angle $-3\log n$ (radians) | $n^{-s}$ |
| --- | --- | --- | --- |
| 1 | 1 | 0 | $1$ |
| 2 | 0.25 | $-2.0794$ | $-0.1217-0.2184i$ |
| 3 | 0.1111 | $-3.2958$ | $-0.1098+0.0171i$ |
| 4 | 0.0625 | $-4.1589$ | $-0.0329+0.0532i$ |
| 5 | 0.04 | $-4.8283$ | $0.0046+0.0397i$ |

The arrow for $6$ is the product of the arrows for $2$ and $3$: its angle is $-5.3753=-2.0794-3.2958$ and its length is $1/36=\tfrac14\cdot\tfrac19$. Adding the first 1,000 arrows head to tail ends at $0.79834-0.11374i$, and $\zeta(2+3i)=0.79802-0.11374i$.
:::

Two facts follow at once. First, $\abs{n^{-s}}=n^{-\sigma}$ does not depend on $t$, so $\sum n^{-s}$ converges absolutely exactly when $\sigma>1$, by comparison with the series $\sum n^{-\sigma}$. Second, because the arrow for $mn$ is the product of the arrows for $m$ and for $n$, the factorization of integers into primes becomes a factorization of arrows. That is the Euler product of [[euler-product]], now with a rotation attached to each prime.

:::: figure {#f-ct-arrows viz="complex-arrows" height="440"}
The arrow $n^{-s}$ has length $n^{-\sigma}$ and turns by $-t\log n$, so the arrow for a product is the product of the arrows.

```vizspec
Purpose: make n^{-s} = n^{-sigma} e^{-i t log n} a thing the reader can move, and show that the arrow for a product is the product of arrows.
Scene: two panels. Left, the s-plane with sigma in [-1, 3] and t in [-30, 30], axes and the line sigma = 1 drawn in muted, a draggable point s (start 2+3i). Right, the complex plane of values with a unit circle in muted. From the origin draw the arrows n^{-s} for n = 1..12, each colored by n along a sequential ramp and labeled with n at the tip. Arrows for primes 2, 3, 5, 7, 11 are drawn solid, composite arrows dashed.
Controls: drag the point s in the left panel (the right panel updates live). Click two prime arrows, say 2 and 3; the arrow for 6 is highlighted and a ghost copy of arrow 3 is drawn from the tip of arrow 2, showing it lands on the tip of arrow 6. A checkbox "log scale for t" is off by default.
Motion: while dragging, arrows shrink as sigma grows and swing around as t grows, the arrow for n swinging log n times as fast as the arrow for e. A short ease animation moves arrows to a new position when s is set by a preset button (s = 2+3i, s = 1/2+14.1347i, s = 3).
Reader takeaway: sigma controls the lengths and t controls the angles; angle(mn) = angle(m) + angle(n) and length(mn) = length(m) length(n).
Data: none. Compute n^{-s} directly with exp(-s log n).
```
::::

::: used
- The sum of these arrows, head to tail, is the series for $\zeta(s)$ studied in [[s-zc-converges]] and [[s-zc-fails]].
- The multiplicativity of the arrows is the Euler product used in [[euler-product]] and again for the zero-free line in [[zeros]].
:::

## Holomorphic functions and how to see one {#s-ct-holomorphic}

A function of a complex variable can be differentiated in the ordinary way, but the limit now ranges over a complex increment, which can approach $0$ from every direction in the plane at once.

:::: definition {#d-ct-holomorphic title="holomorphic function"}
Let $U\subseteq\CC$ be open. A function $f:U\to\CC$ is *holomorphic* on $U$ if for every $z\in U$ the limit
$$
f'(z)=\lim_{h\to 0}\frac{f(z+h)-f(z)}{h}
$$
exists, where $h$ is a complex number tending to $0$ along any path. It is *entire* if $U=\CC$. This is a much stronger requirement than being differentiable as a map from the real plane to itself. A real-differentiable map has a $2\times2$ derivative matrix, and complex differentiability forces that matrix to be a rotation followed by a scaling, namely multiplication by the single complex number $f'(z)$ (these are the Cauchy-Riemann equations). So $\bar z$, $\abs z$, and $\Re z$ are not holomorphic anywhere, while polynomials, $e^z$, and $n^{-s}$ as a function of $s$ are holomorphic everywhere.
::::

The consequence for pictures is that a holomorphic function with $f'(z)\neq0$ preserves angles: it turns and stretches a small patch around each point without shearing it. That is why the graphs in this chapter look like smoothly bent grids.

A holomorphic function takes complex inputs to complex outputs, so its graph lives in four real dimensions and cannot be drawn. Domain coloring avoids the problem by spending two dimensions on the input plane and encoding the output as a color.

:::: definition {#d-ct-domain-coloring title="domain coloring"}
*Domain coloring* paints each point $z$ of the input plane with a color chosen from $w=f(z)$. The hue is the angle of $w$: red for positive reals, then around the color wheel once as the angle goes from $0$ to $2\pi$. The brightness is the size of $w$: dark where $\abs w$ is small and bright where it is large. It is a picture of the input plane, colored by the output, and not a graph of $f$.
::::

How to read it: at a zero of order $m$ the picture is dark and the colors run around the point $m$ times counterclockwise. At a pole of order $m$ it is bright and the colors run $m$ times clockwise. At a point where $f$ is neither zero nor infinite the colors vary slowly.

::: example
Three functions, each with its signature. The function $z^2$ has a double zero at $0$: the color wheel runs twice counterclockwise around a dark point, because $\arg z^2=2\arg z$. The function $1/z$ has a simple pole at $0$: the wheel runs once clockwise around a bright point, because $\arg(1/z)=-\arg z$. The function $e^z$ has neither: its hue depends only on $\Im z$ and repeats every $2\pi$, giving horizontal bands, and it gets brighter to the right because $\abs{e^z}=e^{\Re z}$.
:::

:::: figure {#f-ct-domain viz="domain-coloring" height="440"}
Counting how many times the color wheel winds around a point, and in which direction, reads off the order of a zero or a pole.

```vizspec
Purpose: teach the reader to read domain coloring and to see zeros as dark whirls and poles as bright whirls of the opposite handedness.
Scene: a square region [-2, 2] x [-2, 2] of the z-plane, rendered per pixel on a canvas at about 300 x 300 internal resolution and scaled up. Hue = arg f(z) mapped to the standard color wheel (red at arg 0). Brightness = 0.5 + atan(log|f(z)|)/pi, so zeros are black and poles are white. A faint grid of lines Re z, Im z = integers in muted. A small color-wheel key in the corner.
Controls: a selector with f in { z, z^2, z^3, 1/z, e^z, (z^2 - 1)/(z^2 + 1), sin z }. A draggable small circle (radius slider 0.1 to 1.5) that can be moved over the plane. Hovering shows f(z) as a number.
Motion: when the circle sits on a zero or pole, a thin arrow rides around the circle and a second arrow in a side swatch shows the hue of f at that point; the side swatch's hue turns m times per lap, and a counter next to it displays the signed number of turns (+2 for z^2 at 0, -1 for 1/z at 0).
Reader takeaway: the signed number of turns of the color wheel around a loop equals zeros minus poles inside it; this is the argument principle of the next sections.
Data: none. All functions are evaluated per pixel in complex arithmetic.
```
::::

::: used
- The same coloring of $\zeta(s)$ itself appears in [[f-zc-zeta-domain]], where the zeros are the dark points.
- Zeros of the completed zeta function are located in [[zeros]] by exactly this winding count.
:::

## Power series and the rigidity of holomorphic functions {#s-ct-series}

::: recall
**Power series.** A power series $\sum_{k\ge0}c_k(z-a)^k$ converges for $\abs{z-a}<R$ and diverges for $\abs{z-a}>R$, where $R\in[0,\infty]$ is its *radius of convergence*. Inside the disc it can be differentiated and integrated term by term. The geometric series $\sum z^k=1/(1-z)$ for $\abs z<1$ is the model case, with $R=1$.
:::

:::: theorem {#t-ct-taylor title="A holomorphic function equals its power series on every disc inside its domain" source="ss-complex"}
If $f$ is holomorphic on an open set $U$ and the disc $\abs{z-a}<R$ lies in $U$, then
$$
f(z)=\sum_{k\ge0}c_k(z-a)^k,\qquad c_k=\frac{f^{(k)}(a)}{k!},
$$
and the series converges on the whole disc.
::::

::: sketch {source="ss-complex" loc="Chapter 2"}
Write $f(z)$ by the Cauchy integral formula ([[t-ct-cauchy-formula]]) on a circle around $a$, and expand the kernel $\frac1{w-z}=\sum_k\frac{(z-a)^k}{(w-a)^{k+1}}$ as a geometric series. Integrating term by term gives the coefficients $c_k$. For $z$ in the disc, choose a circle of radius $r$ with $\abs{z-a}<r<R$. The series then converges like a geometric series with ratio $\abs{z-a}/r<1$.
:::

The radius is limited only by the nearest point where $f$ fails to be holomorphic. For $1/(1-z)$ centered at $0$ that point is $z=1$, which is why $R=1$. A holomorphic function is therefore locally a polynomial of infinite degree, and that fact makes it rigid.

::::: card {#t-ct-identity kind="theorem" title="Two holomorphic functions that agree on a set with a limit point agree everywhere on a connected domain"}
::: statement
Let $\Omega\subseteq\CC$ be open and connected, and let $f,g$ be holomorphic on $\Omega$. If $f=g$ on a set that has a limit point in $\Omega$, for example a short segment or a convergent sequence of points, then $f=g$ on all of $\Omega$.
:::
::: plain
A holomorphic function is determined by its values on any tiny patch, even a sequence of points piling up at one spot. If you know $e^z$ only for real numbers between $0$ and $0.001$, you know $e^z$ everywhere in the plane.
:::
::: why
Every later step will build a function in one region and then declare that it is "the same function" in a larger region. This theorem is what makes that declaration meaningful: there can be at most one such extension, so the value of $\zeta(-1)$, for instance, is forced and not a matter of taste.
:::
::: idea
Near a point where the difference $h=f-g$ vanishes, $h$ is a power series. If it is not zero, its first nonzero term $c_m(z-a)^m$ dominates near $a$, so $h$ has no other zeros nearby. Zeros of a nonzero holomorphic function therefore cannot pile up. A pile-up forces $h=0$ near that point, and connectedness spreads this to all of $\Omega$.
:::
::: proof
Let $h=f-g$, and let $a\in\Omega$ be a limit point of the set where $h=0$. By continuity $h(a)=0$. Expand $h(z)=\sum c_k(z-a)^k$ on a disc around $a$. If some $c_k\neq0$, let $m$ be the smallest such index. Then $h(z)=(z-a)^m u(z)$ with $u$ holomorphic and $u(a)=c_m\ne0$, so $u\neq0$ on a smaller disc and $h$ has no zeros there except $a$, contradicting that zeros accumulate at $a$. So all $c_k=0$ and $h=0$ on a disc around $a$.

Now let $A$ be the set of points of $\Omega$ near which $h$ vanishes identically. By the argument just given $A$ is open. It is also closed in $\Omega$: a limit point of $A$ in $\Omega$ is a limit of zeros of $h$, so by the same argument $h$ vanishes on a disc around it. Since $\Omega$ is connected and $A$ is not empty, $A=\Omega$.
:::
::: used
- Uniqueness of continuation: [[t-ct-uniqueness]].
- Two continuations of $\zeta$, one from the alternating series and one from the theta function, must agree: [[s-zc-alternating]] and [[s-zc-functional-equation]].
- The zeros of a function that is not identically zero are isolated, so they can be counted one at a time: [[s-ct-argument]].
:::
:::::

The proof gave a useful by-product. If $h$ is not identically zero and $h(a)=0$, then $h(z)=(z-a)^m u(z)$ for a unique integer $m\ge1$ and a holomorphic $u$ with $u(a)\ne0$. We call $m$ the *order* of the zero at $a$, written $\ord_a h=m$. A zero of order 1 is *simple*.

## Analytic continuation {#s-ct-continuation}

A power series defines a function only on its disc of convergence. The function it defines may make sense on a much larger set.

:::: definition {#d-ct-continuation title="analytic continuation"}
Let $U\subseteq V$ be connected open sets and let $f$ be holomorphic on $U$. An *analytic continuation* of $f$ to $V$ is a holomorphic function $F$ on $V$ with $F=f$ on $U$. It is the same function seen on a larger stage and not a new one. It is not a formula that happens to agree with $f$ on $U$ and then does something else: it is required to be holomorphic on all of $V$.
::::

:::: theorem {#t-ct-uniqueness title="An analytic continuation is unique"}
If $F_1$ and $F_2$ are analytic continuations of $f$ to the connected open set $V$, then $F_1=F_2$.
::::

::: proof
$F_1-F_2$ is holomorphic on the connected set $V$ and vanishes on the nonempty open set $U$. By [[t-ct-identity]] it vanishes on $V$.
:::

Uniqueness is what lets us talk about *the* value of a function outside the region where its defining formula works.

::: example
The model case. For $\abs z<1$ the geometric series gives $f(z)=\sum_{k\ge0}z^k=\dfrac1{1-z}$. At $z=2$ the partial sums are $1,3,7,15,31,\dots$, which diverge. But the function $F(z)=\dfrac1{1-z}$ is holomorphic on $\CC\setminus\{1\}$ and equals $f$ on the unit disc, so it is the unique continuation, and $F(2)=-1$. This value is not a statement about the divergent sum. It is a statement about the function.

The continuation can also be carried out one disc at a time, with nothing but power series. Re-expanding at the center $-1$ gives
$$
\frac1{1-z}=\sum_{k\ge0}\frac{(z+1)^k}{2^{k+1}},\qquad \abs{z+1}<2.
$$
This disc reaches points the first disc does not. At $z=-2.5$ the series sums to $\tfrac12/(1+0.75)=2/7=0.2857$, and $1/(1-(-2.5))=2/7$ as well. The radius at a center $c$ is always $\abs{c-1}$, the distance to the pole, so a disc can never swallow the pole. To reach $z=2$ one walks around it: the centers $0,\ 0.8i,\ 1+i,\ 1.6+0.5i$ have radii $1,\ 1.28,\ 1,\ 0.781$, each center lies inside the previous disc, and $2$ lies inside the last one, at distance $0.640$ from its center.
:::

:::: figure {#f-ct-discs viz="continuation-discs" height="440"}
A power series can be re-expanded at a new center, and a chain of overlapping discs carries $1/(1-z)$ around its pole to values the original series never reaches.

```vizspec
Purpose: show analytic continuation as a chain of power series, and show that the pole is what stops each disc.
Scene: the complex plane with x in [-3, 3], y in [-2.5, 2.5], axes in muted. A red point at z = 1 (the pole). The unit disc about 0 filled lightly in blue. A draggable target point T (start at 2, drawn as a gold diamond) with a label "1/(1-T) = ..." showing the exact value in a text readout.
Controls: a button "Add disc" which, starting from the last center, moves the next center toward T by at most the distance that keeps it inside the previous disc, and draws the new disc (center c, radius |c - 1|) with a lighter fill. A button "Reset". A drag handle on T. A checkbox "show partial sums" that prints, for the current disc, the first 6 partial sums of the re-expanded series at T when T lies inside it.
Motion: each new disc grows from its center out to radius |c - 1| over 400 ms. The previous discs stay as faint outlines. The pole stays fixed and every disc's boundary touches it.
Reader takeaway: every disc is exactly as large as the distance to the pole, the discs overlap and agree where they overlap, and walking around the pole reaches z = 2 where the original series diverges.
Data: none. For the readout, use the series sum_k (T - c)^k / (1 - c)^(k+1) for the current center c.
```
::::

Two warnings apply to continuation in general. It does not make a divergent series converge, because it changes the function's description and not the series. And continuation along different routes can disagree when the route goes around a point where the function is multivalued, as it does for $\sqrt z$ and $\log z$. In this chapter the only singularities that matter are poles, and around a pole the answer is single-valued. The zeta function will turn out to be a single formula valid on the whole plane, so no routes need to be tracked.

::: used
- The Dirichlet series for $\zeta$ is a series valid on $\sigma>1$ only. Its continuation is the whole of [[zeta-continued]].
- $\Gamma$ is continued by the same idea, in [[s-ct-gamma]] below.
:::

## Contour integrals and Cauchy's theorem {#s-ct-cauchy}

::: recall
**Path integrals.** A path is a continuous, piecewise differentiable map $\kappa:[a,b]\to\CC$. The integral of $f$ along it is
$$
\int_\kappa f(z)\,\dd z=\int_a^b f(\kappa(\tau))\,\kappa'(\tau)\,\dd\tau.
$$
Reversing the path changes the sign. The estimate $\bigl\lvert\int_\kappa f\,\dd z\bigr\rvert\le\max_\kappa\abs f\cdot\text{length}(\kappa)$ is used constantly to show that an integral is small. A *closed* path ends where it begins. A *contour* is a closed path made of finitely many smooth pieces.
:::

::: example
The computation that drives the rest of the chapter. Let $\kappa$ be the unit circle, $\kappa(\tau)=e^{i\tau}$ for $0\le\tau\le2\pi$, so $\kappa'(\tau)=ie^{i\tau}$. For an integer $k$,
$$
\oint_\kappa z^k\,\dd z=\int_0^{2\pi}e^{ik\tau}\,ie^{i\tau}\,\dd\tau=i\int_0^{2\pi}e^{i(k+1)\tau}\,\dd\tau=
\begin{cases}2\pi i,&k=-1,\\0,&k\ne-1.\end{cases}
$$ {#eq-ct-circle}
Every power integrates to zero over the circle except $1/z$, which integrates to $2\pi i$. The same holds for a circle of any radius around any center $a$, with $z$ replaced by $z-a$.
:::

:::: theorem {#t-ct-cauchy title="Cauchy's theorem: holomorphic functions integrate to zero around loops that bound no hole" source="ss-complex"}
If $f$ is holomorphic on an open disc, or more generally on an open set with no holes, and $\kappa$ is a closed path in it, then $\oint_\kappa f\,\dd z=0$.
::::

::: sketch {source="ss-complex" loc="Chapter 2"}
A holomorphic function on a disc has a primitive $F$ with $F'=f$; this is the substantive step, proved by Goursat's lemma for triangles. The integral along $\kappa$ is then $F(\kappa(b))-F(\kappa(a))=0$ for a closed path.
:::

The words "no holes" matter. The function $1/z$ is holomorphic on $\CC\setminus\{0\}$, which has a hole at $0$, and its integral around the unit circle is $2\pi i$, not $0$ by [[eq-ct-circle]].

:::: theorem {#t-ct-cauchy-formula title="Cauchy's integral formula: values inside a circle are determined by values on it" source="ss-complex"}
Let $f$ be holomorphic on an open set containing a closed disc, let $C$ be its boundary circle traversed counterclockwise, and let $a$ be a point inside. Then
$$
f(a)=\frac1{2\pi i}\oint_C\frac{f(z)}{z-a}\,\dd z.
$$ {#eq-ct-cauchy-formula}
::::

::: sketch {source="ss-complex" loc="Chapter 2"}
The function $f(z)/(z-a)$ is holomorphic except at $a$. By Cauchy's theorem applied to the region between $C$ and a tiny circle of radius $\varepsilon$ about $a$, the integral over $C$ equals the integral over the tiny circle. There $f(z)=f(a)+O(\varepsilon)$, and $\oint\frac{\dd z}{z-a}=2\pi i$ by [[eq-ct-circle]]. Let $\varepsilon\to0$.
:::

Test it on the smallest case, $f\equiv1$ and $a=0$ on the unit circle: the right side is $\frac1{2\pi i}\oint\frac{\dd z}{z}=1$. Cauchy's formula is what produces the power series of [[t-ct-taylor]], and through that the identity theorem.

::: used
- Perron's formula in [[explicit-formula]] expresses the sum $\psi(x)$ as a contour integral, and the contour is then moved across poles using Cauchy's theorem.
:::

## Poles, residues, and the residue theorem {#s-ct-residues}

:::: definition {#d-ct-pole title="pole, residue, meromorphic function"}
A function $f$ has a *pole of order $m\ge1$* at $a$ if $f(z)=g(z)/(z-a)^m$ near $a$, with $g$ holomorphic and $g(a)\neq0$. Near $a$ it then has an expansion with finitely many negative powers,
$$
f(z)=\sum_{k\ge -m}c_k(z-a)^k,
$$
and the coefficient $c_{-1}$ is the *residue* of $f$ at $a$, written $\Res_a f$. A function holomorphic on an open set except at isolated poles is *meromorphic* there. A residue is a number attached to a point and not a function, and it is zero where $f$ is holomorphic.
::::

::: example
The function $1/(z-a)$ has a simple pole at $a$ with residue $1$. The function $e^z/z^2=z^{-2}+z^{-1}+\tfrac12+\dots$ has a double pole at $0$ with residue $1$. The Gamma function, introduced below, has residue $(-1)^n/n!$ at $-n$.
:::

The name residue is earned by integration. Integrate the expansion term by term over a small circle about $a$. By [[eq-ct-circle]] every term dies except $c_{-1}/(z-a)$, so
$$
\oint_{\abs{z-a}=\varepsilon}f(z)\,\dd z=2\pi i\,\Res_a f.
$$

Before the theorem we need a word for how many times a loop goes around a point.

:::: definition {#d-ct-winding title="winding number"}
For a closed path $\kappa$ and a point $a$ not on it, the *winding number* is
$$
\operatorname{wind}(\kappa,a)=\frac1{2\pi i}\oint_\kappa\frac{\dd z}{z-a}.
$$
It is an integer: the net number of counterclockwise laps that $\kappa$ makes around $a$. A counterclockwise circle has winding number $1$ around each point inside it and $0$ around each point outside; a clockwise circle has $-1$.
::::

:::: theorem {#t-ct-residue title="The residue theorem: a contour integral is a sum of residues" source="ss-complex"}
Let $f$ be meromorphic on an open set $U$ and let $\kappa$ be a closed path in $U$ that avoids the poles of $f$ and bounds no hole of $U$. Then
$$
\oint_\kappa f(z)\,\dd z=2\pi i\sum_{a}\operatorname{wind}(\kappa,a)\,\Res_a f,
$$
where the sum runs over the finitely many poles $a$ that $\kappa$ winds around. For a simple counterclockwise contour, each winding number is $1$ and the sum is over the poles inside.
::::

::: proof
Subtract from $f$ its principal part at each pole inside. The principal part at $a$ is $\sum_{k<0}c_k(z-a)^k$. What remains is holomorphic inside the contour, so its integral is $0$ by [[t-ct-cauchy]]. Each principal part integrates to $2\pi i\,\operatorname{wind}(\kappa,a)\,c_{-1}$ by [[eq-ct-circle]], since the terms with $k<-1$ integrate to $0$.
:::

::: example
Take $f(z)=\dfrac{e^z}{z(z-1)}$ on the circle $\abs z=2$. The poles are at $0$ and $1$, both inside. The residues are $\dfrac{e^0}{0-1}=-1$ at $0$ and $\dfrac{e^1}{1}=e$ at $1$. So the integral is $2\pi i(e-1)=10.7963\,i$. Numerical integration around the circle gives the same.
:::

::: used
- The residue of $\zeta$ at its pole $s=1$ is computed in [[t-zc-continuation-strip]], and the Gamma poles are used in [[t-zc-trivial-zeros]].
- In [[explicit-formula]], $\psi(x)$ is rebuilt as a sum of residues, one for each zero of $\zeta$.
:::

## The logarithmic derivative and the argument principle {#s-ct-argument}

Chapter 2 turned a product over primes into a sum by taking a logarithm and differentiating. The same move works for any meromorphic function.

:::: definition {#d-ct-logderiv title="logarithmic derivative"}
The *logarithmic derivative* of a meromorphic function $f$ is $f'/f$. It is the derivative of $\log f$ wherever a branch of the logarithm exists, but it is defined with no logarithm and no branch choice. It turns products into sums: $(fg)'/(fg)=f'/f+g'/g$.
::::

The key local fact is how $f'/f$ behaves at a zero or a pole. Let $\ord_a f=m$ for a zero of order $m\ge1$ and $\ord_a f=-m$ for a pole of order $m$. Then near $a$ we can write $f(z)=(z-a)^{\ord_a f}g(z)$ with $g$ holomorphic and $g(a)\ne0$, and
$$
\frac{f'(z)}{f(z)}=\frac{\ord_a f}{z-a}+\frac{g'(z)}{g(z)}.
$$
The second term is holomorphic near $a$. So $f'/f$ has a simple pole at every zero and every pole of $f$, and its residue there is exactly $\ord_a f$. The logarithmic derivative converts multiplicities into residues.

::::: card {#t-ct-argument kind="theorem" title="The number of zeros minus poles inside a contour equals how many times the image of the contour winds around $0$"}
::: statement
Let $f$ be meromorphic on an open set containing a simple closed contour $\kappa$ traversed counterclockwise and the region it encloses, with no zeros or poles on $\kappa$. Let $Z$ and $P$ be the numbers of zeros and poles of $f$ inside, counted with multiplicity. Then
$$
\frac1{2\pi i}\oint_\kappa\frac{f'(z)}{f(z)}\,\dd z=Z-P=\operatorname{wind}(f\circ\kappa,\,0).
$$
:::
::: plain
Walk once around a loop and watch where the output $f(z)$ goes. The output draws a closed curve in the plane. The number of times that curve circles the origin, counted with sign, is the number of zeros inside the loop minus the number of poles.
:::
::: why
The whole page counts zeros of $\zeta$. We cannot list them one at a time, but we can measure a loop. Counting the zeros of $\zeta$ in the critical strip up to a height $T$ is a statement about how many times a curve winds, and that is what this theorem converts it into.
:::
::: idea
Each zero contributes a residue of $+1$ per unit of multiplicity to $f'/f$, and each pole contributes $-1$. The residue theorem adds them up. The same integral is also the integral of $\dd w/w$ along the image curve, which counts laps around $0$.
:::
::: proof
By the local fact above, $f'/f$ is meromorphic with simple poles at the zeros and poles of $f$ and residue $\ord_a f$ at each. The residue theorem [[t-ct-residue]] gives $\oint_\kappa f'/f\,\dd z=2\pi i\sum_a\ord_a f=2\pi i(Z-P)$. For the second equality put $w=f(z)$, so $\dd w=f'(z)\,\dd z$ and $\frac{f'}{f}\dd z=\frac{\dd w}{w}$. Then $\oint_\kappa\frac{f'}{f}\dd z=\oint_{f\circ\kappa}\frac{\dd w}{w}=2\pi i\operatorname{wind}(f\circ\kappa,0)$.
:::
::: example
Let $f(z)=\dfrac{z^2-1}{z-i/2}$, with zeros at $\pm1$ and a pole at $i/2$. On the circle $\abs z=1.5$ all three points are inside, so $Z-P=2-1=1$. On $\abs z=0.75$ only the pole is inside, so $Z-P=-1$. On the circle of radius $0.5$ centered at $1$ only the zero at $1$ is inside, so $Z-P=1$. A direct numerical winding count of the image curve returns $1$, $-1$, and $1$. For $f(z)=z^3$ on the unit circle the image goes three times around, and $Z-P=3$.
:::
::: used
- Counting the zeros of $\xi$ up to height $T$ in [[zeros]].
- Showing in [[zeros]] and [[explicit-formula]] that the zeros of $\zeta$ are exactly the singularities of $\zeta'/\zeta$, which is the series of [[euler-product]].
:::
:::::

:::: figure {#f-ct-winding viz="winding-count" height="460"}
As a loop in the input plane is dragged over zeros and poles, the image curve winds around the origin once for each zero minus each pole inside.

```vizspec
Purpose: make the argument principle something the reader can feel by dragging a loop across zeros and poles.
Scene: two side-by-side panels. Left, the z-plane [-2.5, 2.5] x [-2.5, 2.5] with the zeros of the chosen f drawn as teal dots and poles as red crosses; a draggable closed loop (a circle with a center handle and a radius handle) in violet, with a small arrowhead showing counterclockwise direction. Right, the w-plane, auto-scaled, with the origin marked, showing the image curve f(loop) in gold with a marker that moves along it in step with a marker on the loop.
Controls: selector for f in { (z^2 - 1)/(z - i/2), z^3, 1/z, (z^2 + 1)/(z^2 - 1/4), e^z - 1 }. Center and radius handles on the loop. A play button that walks the markers around once.
Motion: the markers travel together along the loop and its image; a running counter on the right shows the accumulated change of arg f divided by 2 pi, ending at an integer when the lap closes.
Readout: a panel showing "zeros inside Z = ..", "poles inside P = ..", "Z - P = ..", and "winding of the image around 0 = ..", all four live. The two numbers Z - P and winding must agree at all times, in teal if they do (they always do), and the readout flags a loop that touches a zero or pole in red because the count is undefined there.
Reader takeaway: the number of times the image curve circles the origin equals zeros minus poles inside the loop.
Data: zeros and poles are hard-coded per function.
```
::::

## The Gamma function {#s-ct-gamma}

The Gamma function turns up because the integral $\int_0^\infty e^{-x}x^{s}\,\dd x/x$ is how a power $n^{-s}$ is manufactured from an exponential, and exponentials are what Poisson summation sums.

:::: definition {#d-ct-gamma title="Gamma function"}
For $\Re s>0$ define
$$
\Gamma(s)=\int_0^\infty e^{-x}x^{s-1}\,\dd x.
$$
It is a holomorphic function of $s$ on $\Re s>0$ that interpolates the factorial, with $\Gamma(n)=(n-1)!$ for a positive integer $n$. The integral diverges at $x=0$ for $\Re s\le0$, so this formula is not the function there; the function is continued beyond it. Other functions also equal $(n-1)!$ at the integers. $\Gamma$ is singled out as the only log-convex solution of $f(x+1)=xf(x)$ with $f(1)=1$ on $(0,\infty)$ (the Bohr-Mollerup theorem).
::::

:::: theorem {#t-ct-gamma-props title="$\Gamma$ satisfies a recursion, is meromorphic with simple poles at the nonpositive integers, and $\Gamma(\tfrac12)=\sqrt\pi$"}
1. $\Gamma(s+1)=s\Gamma(s)$ for $\Re s>0$.
2. $\Gamma$ extends to a meromorphic function on $\CC$ whose poles are the points $0,-1,-2,\dots$. They are simple, and the residue at $-n$ is $(-1)^n/n!$.
3. $\Gamma(\tfrac12)=\sqrt\pi$.
::::

::: proof
For part 1, integrate by parts: $\int_0^\infty e^{-x}x^{s}\,\dd x=\bigl[-e^{-x}x^s\bigr]_0^\infty+s\int_0^\infty e^{-x}x^{s-1}\,\dd x$, and the boundary term is $0$ for $\Re s>0$.

For part 2, iterate part 1 to get
$$
\Gamma(s)=\frac{\Gamma(s+n+1)}{s(s+1)\cdots(s+n)}.
$$
The right side is meromorphic on $\Re s>-n-1$ and agrees with $\Gamma$ on $\Re s>0$, so it is the continuation there; let $n$ grow. The only possible poles are at $s=0,-1,\dots,-n$. At $s=-n$ the numerator is $\Gamma(1)=1$ and the factors other than $s+n$ give $(-n)(-n+1)\cdots(-1)=(-1)^nn!$, so the residue is $1/((-1)^nn!)=(-1)^n/n!$.

For part 3, substitute $x=u^2$: $\Gamma(\tfrac12)=\int_0^\infty e^{-x}x^{-1/2}\dd x=2\int_0^\infty e^{-u^2}\dd u=\sqrt\pi$.
:::

::: example
The recursion gives $\Gamma$ at half-integers beyond the integral: $\Gamma(-\tfrac12)=\Gamma(\tfrac12)/(-\tfrac12)=-2\sqrt\pi=-3.5449$ and $\Gamma(-\tfrac32)=\Gamma(-\tfrac12)/(-\tfrac32)=\tfrac43\sqrt\pi=2.3633$. At an integer to the left, say $s=-2$, the function has a pole with residue $1/2!=\tfrac12$.
:::

::: recall
**The Gaussian integral.** $\int_{-\infty}^\infty e^{-u^2}\,\dd u=\sqrt\pi$. Substituting $u=\sqrt\pi\,x$ gives the form used below: $\int_{-\infty}^{\infty}e^{-\pi x^2}\,\dd x=1$.
:::

Two more facts about $\Gamma$ will be used without proof. First, $\Gamma$ has no zeros, so $1/\Gamma$ is entire. This follows from the reflection formula $\Gamma(s)\Gamma(1-s)=\pi/\sin\pi s$ [@ss-complex, Chapter 6]. Second, Stirling's formula tells us how fast $\Gamma$ grows. For each fixed $\delta>0$, as $\abs s\to\infty$ with $\abs{\arg s}\le\pi-\delta$,
$$
\log\Gamma(s)=\Bigl(s-\tfrac12\Bigr)\log s-s+\tfrac12\log2\pi+O\!\left(\frac1{\abs s}\right).
$$ {#eq-ct-stirling}
For a feel of the accuracy, at $s=10$ we have $\Gamma(10)=362{,}880$ and the right side exponentiates to $359{,}870$, a ratio of $1.0084$, close to the next correction $1+1/(12\cdot10)$ [@ahlfors, Chapter 5].

::: used
- The factor $\Gamma(s/2)$ is part of the completed zeta function in [[s-zc-integral]], and its poles produce the trivial zeros of $\zeta$ in [[t-zc-trivial-zeros]].
- Stirling's formula controls the growth of $\Gamma(s/2)$ along vertical lines, and so the count of zeros up to height $T$ in [[zeros]].
:::

## The Fourier transform and the Gaussian {#s-ct-fourier}

:::: definition {#d-ct-schwartz title="Schwartz class"}
The *Schwartz class* $\mathcal S(\RR)$ is the set of infinitely differentiable functions $f:\RR\to\CC$ such that $\sup_x\abs{x}^a\abs{f^{(b)}(x)}<\infty$ for all integers $a,b\ge0$. In words, $f$ and every derivative decay faster than any power of $x$. It contains the Gaussians and every smooth function with bounded support. It is much smaller than the set of integrable functions: $\mathcal S(\RR)$ is a space of well-behaved test functions that is closed under differentiation, products, and the Fourier transform.
::::

:::: definition {#d-ct-fourier title="Fourier transform"}
For $f\in\mathcal S(\RR)$ the *Fourier transform* is
$$
\hat f(y)=\int_{-\infty}^{\infty}f(x)\,e^{-2\pi ixy}\,\dd x.
$$
It measures how much of the pure wave $e^{2\pi ixy}$ of frequency $y$ is contained in $f$. It is again in $\mathcal S(\RR)$ and it is invertible: $f(x)=\int\hat f(y)e^{2\pi ixy}\,\dd y$ [@ss-fourier, Chapter 5].
::::

Take the one function we can transform by hand.

:::: theorem {#t-ct-gaussian title="The Gaussian is its own Fourier transform"}
For $f(x)=e^{-\pi x^2}$, $\hat f(y)=e^{-\pi y^2}$.
::::

::: proof
Let $g(y)=\int e^{-\pi x^2}e^{-2\pi ixy}\,\dd x$. Differentiating under the integral and noting $-2\pi i x\,e^{-\pi x^2}=i\,\frac{\dd}{\dd x}e^{-\pi x^2}$, we get
$$
g'(y)=i\int\Bigl(\tfrac{\dd}{\dd x}e^{-\pi x^2}\Bigr)e^{-2\pi ixy}\,\dd x=-i\int e^{-\pi x^2}\,\tfrac{\dd}{\dd x}e^{-2\pi ixy}\,\dd x=-2\pi y\,g(y),
$$
where the middle step integrates by parts with no boundary term. This differential equation has the solution $g(y)=g(0)e^{-\pi y^2}$, and $g(0)=\int e^{-\pi x^2}\dd x=1$.
:::

Squeezing the Gaussian in $x$ spreads it in $y$. For $t>0$, substitute $x=u/\sqrt t$:
$$
\int_{-\infty}^\infty e^{-\pi tx^2}e^{-2\pi ixy}\,\dd x=\frac1{\sqrt t}\,e^{-\pi y^2/t}.
$$ {#eq-ct-gauss-dilation}
A Gaussian of width about $1/\sqrt t$ has a transform of width about $\sqrt t$, and the factor $t^{-1/2}$ keeps the total mass in balance. As a check, at $t=2$ and $y=0.7$ both sides equal $0.3275$ when the left side is integrated numerically.

::: used
- The theta function of [[s-zc-theta]] is a sum of such Gaussians, and its symmetry $t\mapsto1/t$ is [[eq-ct-gauss-dilation]] summed over the integers.
- Test functions in the explicit formula of [[weil-positivity]] are taken from this class.
:::

## Poisson summation {#s-ct-poisson}

::::: card {#t-ct-poisson kind="theorem" title="The sum of a Schwartz function over the integers equals the sum of its Fourier transform over the integers"}
::: statement
For every $f\in\mathcal S(\RR)$,
$$
\sum_{n\in\ZZ}f(n)=\sum_{n\in\ZZ}\hat f(n).
$$ {#eq-ct-poisson}
:::
::: plain
Add up the values of a function at the whole numbers, and you get the same answer as adding up the values of its Fourier transform at the whole numbers. A sum over points equals a sum over frequencies.
:::
::: why
Our zeta function is a sum over integers, $\sum n^{-s}$. If we can write it as a sum over the integers of something that also has a Fourier transform, Poisson summation will swap the sum for a different sum. That swap, applied to Gaussians, is the source of the symmetry $s\leftrightarrow1-s$.
:::
::: idea
Make $f$ periodic by adding up all its shifts by integers. A periodic function is its own Fourier series. The Fourier coefficients of the periodized function are exactly the values $\hat f(k)$, and evaluating the series at $0$ gives the formula.
:::
::: proof
Set $F(x)=\sum_{n\in\ZZ}f(x+n)$. Because $f$ and $f'$ decay faster than any power, the sums converge uniformly on $[0,1]$ together with their derivatives, so $F$ is smooth, and $F(x+1)=F(x)$. Its Fourier coefficients are
$$
c_k=\int_0^1F(x)e^{-2\pi ikx}\,\dd x=\sum_n\int_0^1f(x+n)e^{-2\pi ik(x+n)}\,\dd x=\int_{-\infty}^\infty f(x)e^{-2\pi ikx}\,\dd x=\hat f(k),
$$
using $e^{-2\pi ikn}=1$ and joining the intervals $[n,n+1]$. A smooth periodic function equals its Fourier series at every point [@ss-fourier, Chapter 3], so $F(0)=\sum_kc_k$. That says $\sum_nf(n)=\sum_k\hat f(k)$.
:::
::: example
Apply it to $f(x)=e^{-2\pi x^2}$, whose transform is $2^{-1/2}e^{-\pi y^2/2}$ by [[eq-ct-gauss-dilation]] with $t=2$. The left side is $\sum_ne^{-2\pi n^2}=1.0037349$. The right side is $2^{-1/2}\sum_ne^{-\pi n^2/2}=1.4194955/1.4142136=1.0037349$. The two sums agree to every digit shown, though one converges at a rate $e^{-2\pi n^2}$ and the other at $e^{-\pi n^2/2}$.
:::
::: used
- With $f(x)=e^{-\pi tx^2}$ for all $t>0$ this is the symmetry $\theta(1/t)=\sqrt t\,\theta(t)$: [[t-zc-theta-symmetry]].
- The explicit formula of [[explicit-formula]] and the positivity criterion of [[weil-positivity]] are duality statements of the same shape: a sum over primes on one side, a sum over zeros on the other.
:::
:::::

## The Mellin transform {#s-ct-mellin}

The Fourier transform is built for the additive group $\RR$, where the building blocks are the waves $e^{2\pi ixy}$. Zeta lives on the multiplicative group of positive reals, where numbers multiply and the building blocks are the powers $x^{it}$.

:::: definition {#d-ct-mellin title="Mellin transform"}
For a function $f$ on $(0,\infty)$ that decays fast enough at $0$ and at $\infty$, its *Mellin transform* is
$$
(\mathcal Mf)(s)=\int_0^\infty f(x)\,x^{s}\,\frac{\dd x}{x}.
$$
It is a function of the complex variable $s$, defined where the integral converges, usually on a vertical strip. The measure $\dd x/x$ is the one that does not change when $x$ is rescaled to $ax$, just as $\dd x$ does not change under translation. The powers $x^{it}$ are the characters of the multiplicative group, since $(xy)^{it}=x^{it}y^{it}$, as $e^{2\pi ixy}$ are for addition.
::::

Substituting $x=e^u$ shows that this is the Fourier transform in disguise:
$$
(\mathcal Mf)(\sigma+it)=\int_{-\infty}^\infty\bigl(f(e^u)e^{\sigma u}\bigr)e^{itu}\,\dd u.
$$
With $g(u)=f(e^u)e^{\sigma u}$ this reads $(\mathcal Mf)(\sigma+it)=\hat g\bigl(-t/(2\pi)\bigr)$: the Fourier transform of $g$, with the frequency rescaled by $2\pi$ and reflected. The real part $\sigma$ tilts the function by an exponential so that the integral converges. The same $\sigma$ will decide where $\sum n^{-s}$ converges.

::: example
The model computation. For $a>0$ substitute $y=ax$ in the Mellin transform of $e^{-ax}$:
$$
\int_0^\infty e^{-ax}x^{s}\,\frac{\dd x}{x}=a^{-s}\int_0^\infty e^{-y}y^{s}\,\frac{\dd y}{y}=a^{-s}\,\Gamma(s).
$$
So the Gamma function is the Mellin transform of $e^{-x}$, and the power $a^{-s}$ appears. Now sum over $a=n=1,2,3,\dots$ using $\sum_{n\ge1}e^{-nx}=1/(e^x-1)$:
$$
\int_0^\infty\frac{x^{s-1}}{e^x-1}\,\dd x=\Gamma(s)\,\zeta(s),\qquad\Re s>1.
$$
At $s=2$ the left side, evaluated numerically, is $1.6449340668$, and $\Gamma(2)\zeta(2)=\pi^2/6=1.6449340668$. An exponential sum has become the Dirichlet series $\sum n^{-s}$ times $\Gamma$. Chapter 4 does the same with Gaussians.
:::

The Fourier transform can be undone, so the Mellin transform can be too: the values of $\mathcal Mf$ on one vertical line determine $f$. Write $\int_{(c)}$ for the integral up the line $\Re s=c$.

:::: theorem {#t-ct-mellin-inversion title="Mellin inversion recovers $f$ from its transform on a vertical line" source="ss-fourier"}
Let $c$ be real, and let $f$ be a function on $(0,\infty)$ for which $u\mapsto f(e^u)e^{cu}$ is in $\mathcal S(\RR)$. Then for every $x>0$,
$$
f(x)=\frac1{2\pi i}\int_{(c)}(\mathcal Mf)(s)\,x^{-s}\,\dd s.
$$ {#eq-ct-mellin-inversion}
::::

::: proof
Put $g(u)=f(e^u)e^{cu}$, so that $(\mathcal Mf)(c+it)=\hat g(-t/2\pi)$. Fourier inversion for $g\in\mathcal S(\RR)$ [@ss-fourier, Chapter 5], with the substitution $y=-t/2\pi$, gives $g(u)=\frac1{2\pi}\int_{-\infty}^\infty(\mathcal Mf)(c+it)\,e^{-itu}\,\dd t$. Multiply by $e^{-cu}$, put $x=e^u$ and $s=c+it$, so that $\dd s=i\,\dd t$ and $e^{-cu}e^{-itu}=x^{-s}$.
:::

Test it on $f(x)=e^{-x}$ with $c=1$, where $\mathcal Mf=\Gamma$: the formula says $e^{-x}=\frac1{2\pi i}\int_{(1)}\Gamma(s)x^{-s}\,\dd s$, and at $x=1$ numerical integration up the line gives $0.3678794=e^{-1}$.

### Compact support gives an entire transform {#s-ct-paley-wiener}

Part III of this page works with test functions $\varphi$ that are smooth on $(0,\infty)$ and vanish outside a closed interval $[1/Y,Y]$, that is, with compact support in $\log t$. For those, the Mellin transform is far better behaved than a general one: it is defined on the whole plane, and on every vertical strip it decays faster than any power. This is the idea behind the Paley and Wiener theorem. We need one general fact first, the one that makes an integral of holomorphic functions holomorphic.

:::: lemma {#l-ct-holomorphic-integral title="An integral of holomorphic functions, dominated on compact sets, is holomorphic" source="ss-complex"}
Let $U\subseteq\CC$ be open, let $I\subseteq\RR$ be an interval, and let $F(t,s)$ be continuous on $I\times U$ and holomorphic in $s$ for each $t$. Suppose that for each compact $K\subset U$ there is an integrable $h_K$ on $I$ with $\abs{F(t,s)}\le h_K(t)$ for all $s\in K$. Then $s\mapsto\int_IF(t,s)\,\dd t$ is holomorphic on $U$.
::::

::: sketch {source="ss-complex" loc="Chapter 2"}
Over a closed bounded subinterval of $I$ the integral is holomorphic: it is continuous, and its integral around every small triangle vanishes by Fubini and Cauchy's theorem, so Morera's theorem applies. The bound $h_K$ makes these truncated integrals converge uniformly on $K$ as the subinterval grows to $I$, and a locally uniform limit of holomorphic functions is holomorphic.
:::

:::: proposition {#p-ct-paley-wiener title="A smooth function with compact support in $(0,\infty)$ has an entire Mellin transform that decays fast on every vertical strip"}
Let $Y>1$ and let $\varphi$ be smooth on $(0,\infty)$ with $\varphi(t)=0$ outside $[1/Y,Y]$. Then $(\mathcal M\varphi)(z)=\int_{1/Y}^{Y}\varphi(t)\,t^{z}\,\dd t/t$ is an entire function of $z$, and for every integer $k\ge0$
$$
\abs{z}^k\,\abs{(\mathcal M\varphi)(z)}\le Y^{\abs{\Re z}}\int_0^\infty\Bigl\lvert\Bigl(t\frac{\dd}{\dd t}\Bigr)^k\varphi(t)\Bigr\rvert\,\frac{\dd t}t.
$$ {#eq-ct-paley-wiener}
So on each strip $\abs{\Re z}\le a$ the transform decays faster than any power of $\abs{\Im z}$, Mellin inversion holds on every vertical line, and the line of integration can be moved freely.
::::

::: proof
The integrand $\varphi(t)t^{z-1}$ is continuous, entire in $z$, and zero outside $[1/Y,Y]$, where $\abs{t^{z}}=t^{\Re z}\le Y^{\abs{\Re z}}$. So [[l-ct-holomorphic-integral]] applies and $\mathcal M\varphi$ is entire, and the case $k=0$ of the bound is the same estimate. For $k\ge1$, integrate by parts: $\int_0^\infty t\varphi'(t)\,t^{z}\,\frac{\dd t}t=\int_0^\infty\varphi'(t)\,t^z\,\dd t=-z\int_0^\infty\varphi(t)\,t^{z}\,\frac{\dd t}t$, with no boundary terms because $\varphi$ vanishes near $1/Y$ and $Y$. So the operator $t\frac{\dd}{\dd t}$ becomes multiplication by $-z$, and $k$ applications give $(-z)^k(\mathcal M\varphi)(z)=\bigl(\mathcal M(t\tfrac{\dd}{\dd t})^k\varphi\bigr)(z)$, which the case $k=0$ bounds. For inversion, $u\mapsto\varphi(e^u)e^{cu}$ is smooth and vanishes outside $[-\log Y,\log Y]$, so it is in $\mathcal S(\RR)$ for every $c$, and [[t-ct-mellin-inversion]] applies on every line. To move the line from $\Re z=c_1$ to $\Re z=c_2$, apply Cauchy's theorem to the rectangle with corners $c_1\pm iT$ and $c_2\pm iT$: the transform has no poles, and its horizontal sides tend to $0$ as $T\to\infty$ by [[eq-ct-paley-wiener]].
:::

The smallest case shows what each hypothesis buys. Drop smoothness and take $\varphi$ to be $1$ on $[1/Y,Y]$ and $0$ elsewhere. Then $(\mathcal M\varphi)(z)=\int_{1/Y}^Yt^{z-1}\,\dd t=(Y^z-Y^{-z})/z$. It is still entire, because the zero of the denominator at $z=0$ is canceled and the value there is $2\log Y$. It grows like $Y^{\abs{\Re z}}$ to the left and right, as the bound says. But on a vertical line it decays only like $1/\abs z$: with $Y=2$, the value at $z=1$ is $1.5$, and at $z=10i$ it is $\sin(10\log2)/5=0.1208$. The jumps of $\varphi$ at $1/2$ and $2$ cost the fast decay; smoothing them restores it. Compact support is what makes the transform entire; smoothness is what makes it decay.

The converse also holds: an entire function with bounds of the shape [[eq-ct-paley-wiener]] is the Mellin transform of a smooth function that vanishes outside $[1/Y,Y]$. In Fourier language this is the Paley and Wiener theorem [@ss-complex, Chapter 4], and Part III uses it only in the direction proved here.

The Mellin transform also turns multiplicative convolution into multiplication, as the Fourier transform does for ordinary convolution. If $(\varphi\star f)(x)=\int_0^\infty\varphi(t)\,f(x/t)\,\dd t/t$, then substituting $x=ty$ in the double integral gives
$$
\mathcal M(\varphi\star f)(z)=(\mathcal M\varphi)(z)\,(\mathcal Mf)(z)
$$
wherever both transforms converge absolutely.

::: used
- Riemann's integral for $\zeta$ in [[s-zc-integral]] is the Mellin transform of a sum of Gaussians, and [[l-ct-holomorphic-integral]] makes its continuation entire in [[t-zc-functional-equation]].
- Perron's formula in [[explicit-formula]] is the same inversion applied to the step function that jumps at $x=1$. That function is not smooth, so [[explicit-formula]] proves the version it needs directly.
- The test functions of [[weil-positivity]] and of Part III have compact support in $\log t$, so their transforms are entire and decay on strips by [[p-ct-paley-wiener]]. Part III writes $M\varphi(z)$ for $(\mathcal M\varphi)(z)$, and its convolution operator $A(\varphi)$ is $f\mapsto\varphi\star f$.
:::

::: recap
You now have the following tools, and where each one is used.

- The arrow $n^{-s}=n^{-\sigma}e^{-it\log n}$ and its multiplicativity: the series for $\zeta$ in [[zeta-continued]], and the Euler product throughout.
- Holomorphic functions, domain coloring, and the order of a zero: reading pictures of $\xi$ and $\zeta$.
- The identity theorem and uniqueness of analytic continuation: every extension of $\zeta$ is the same function.
- Cauchy's theorem and formula, residues, and the residue theorem: the pole of $\zeta$ at $1$ and, in [[explicit-formula]], the sum over zeros.
- The logarithmic derivative and the argument principle: counting zeros in [[zeros]].
- The Gamma function, with its poles, its lack of zeros, and Stirling's formula: the completion factor of $\xi$ and the trivial zeros.
- The Fourier transform, the self-dual Gaussian, Poisson summation, and the Mellin transform: the theta function and Riemann's integral in the next chapter.
- Mellin inversion, holomorphic integrals, and the entire, fast-decaying transforms of compactly supported test functions: Riemann's integral, Weil's explicit formula in [[weil-positivity]], and Part III.
:::
