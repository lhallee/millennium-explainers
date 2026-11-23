---
id: strip-topology
title: "Choosing the topology: what a strip can see"
part: 3
summary: After this chapter you can say which values of a Mellin transform a norm can see, prove that the Hardy-Sobolev norm of half-width a sees exactly the open strip of half-width a, and explain why the quotient by the theta sums then carries only the zeros inside that strip.
needs: [tate-theta]
---

::: plain
A norm is a choice of what counts as small. Change the norm and some measurements stop making sense, because functions that the norm calls tiny can still give that measurement a large value. The proof measures functions with a norm under which the value of the Mellin transform at a point makes sense only inside a vertical strip around the critical line. Zeros of zeta outside that strip then leave no trace in the space, not because anything was assumed about them, but because the space has no way to see them.
:::

[[tate-theta]] turned the zeros of $\zeta$ into the spectrum of convolution on the quotient of all functions by the weighted theta sums. In the topology used there every zero is visible, and the trace of convolution is the zero side of Weil's explicit formula, so computing it again by geometry can only give Weil's explicit formula back. The new idea of this chapter is to change the topology before taking the quotient. In the Hardy-Sobolev space $W_a$ the quotient remembers only the zeros $\rho$ with $\lvert\beta-\tfrac12\rvert<a$, and the trace of convolution becomes a sum over those zeros. [[cutting-the-kernel]] and [[trace-formula]] then compute the same trace by geometry inside $W_a$ and find Weil's complete prime side, and [[trace-to-grh]] compares the two. The source calls the zeros outside the strip "victims" of the topology [@masullo, p. 36].

## A norm decides which measurements exist {#s-sp-norms}

In finite dimensions every linear functional is continuous, so every linear measurement of a vector is stable under small changes. In infinite dimensions this fails, and which measurements survive depends on the norm. The standard example is evaluation at a point. On continuous functions on $[0,1]$ with the sup norm, $f\mapsto f(\tfrac12)$ is continuous, since $\abs{f(\tfrac12)}\le\sup\abs f$. With the $L^2$ norm it is not: a tent of height $1$ at $\tfrac12$ and width $\eps$ has $L^2$ norm $\sqrt{\eps/3}$, which tends to $0$, while its value at $\tfrac12$ stays $1$.

:::: definition {#d-sp-continuous-functional title="continuous functional and its norm"}
A linear functional $\ell$ on a normed space $(E,\norm\cdot)$ is *continuous* when there is a constant $C$ with $\abs{\ell(u)}\le C\norm u$ for all $u\in E$. The least such $C$ is its *norm* $\norm\ell$. A continuous functional on a dense subspace extends uniquely to the completion. A functional that is not continuous has no extension: there are $u_n\to0$ with $\ell(u_n)=1$, so in the completion the limit $0$ would need two values.
::::

The completion is where the consequence becomes structural. If a closed subspace is cut out by conditions $\ell(u)=0$, the quotient by it is described by those $\ell$. In a coarser norm some $\ell$ are no longer continuous, the closure of the subspace grows, and the quotient shrinks. That is the whole mechanism of this chapter, applied to $\ell=$ "a derivative of the Mellin transform at a zero of $\zeta$".

## The Hardy-Sobolev space $W_a$ {#s-sp-wa}

:::: definition {#d-sp-wa title="the Hardy-Sobolev space $W_a$"}
For $a>0$, the space $W_a$ is the completion of $S_E(\RR_{>0})$ in the norm
$$
\norm\phi_a^2=\int_0^\infty\abs{\phi(t)}^2\max(t^{2a},t^{-2a})\,\frac{\dd t}t .
$$
It is a Hilbert space of (classes of) functions on $\RR_{>0}$. Its elements need only decay slightly faster than $t^{-a}$ at $\infty$ and slightly faster than $t^a$ at $0$, in the square-mean sense, where elements of $S_E$ decay faster than every power. It is not $L^2(\RR_{>0},\dd t/t)$ unless $a=0$, and it is not a space of smooth functions. In the source it is $W^{0,2}_{[-a,a]}(\RR_{>0})$, the Hardy-Sobolev space of base $[-a,a]$ and Sobolev degree $0$ [@masullo, §1.1.3, p. 11, §1.8.2.3, p. 44].
::::

The source's general space carries an extra factor $(1+\abs{\log t}^2)^{\sigma_0/2}$ with a Sobolev degree $\sigma_0\ge0$. The introduction and the letter fix $\sigma_0=0$ and note that this suffices for the paper [@masullo, p. 13, p. 46], and so does this page. The weight $\max(t^{2a},t^{-2a})=e^{2a\abs{\log t}}$ penalizes mass far from $t=1$ in both directions, which is exactly what makes the Mellin transform holomorphic on a strip: after $t=e^u$, the Mellin transform at $x+iy$ is the Fourier transform of $\phi(e^u)e^{xu}$, and the weight controls $e^{xu}$ precisely when $\abs x\le a$.

:::: proposition {#t-sp-hardy title="The Mellin transform identifies $W_a$ with a Hardy space of holomorphic functions on the strip of half-width $a$, normed by the two edges" source="masullo" loc="Proposition 9.2.2.4, p. 414; Lemma 9.2.2.2, p. 412"}
For $\phi\in S_E(\RR_{>0})$,
$$
\norm\phi_a^2\ \le\ \frac1{2\pi}\int_{-\infty}^{\infty}\Bigl(\abs{M\phi(a+iy)}^2+\abs{M\phi(-a+iy)}^2\Bigr)\dd y\ \le\ 2\,\norm\phi_a^2 .
$$ {#eq-sp-edges}
Consequently the Mellin transform extends from $S_E$ to an isomorphism of $W_a$ onto a Hilbert space of functions holomorphic on the open strip $\lvert\Re z\rvert<a$ with square-integrable boundary values on its two edges.
::::

::: proof
For a real $x$, put $h(u)=\phi(e^u)e^{xu}$. Then $M\phi(x+iy)=\int_\RR h(u)e^{iyu}\,\dd u=\hat h(-y/2\pi)$, and Plancherel's theorem $\int\abs{\hat h}^2=\int\abs h^2$ [@ss-fourier, Chapter 5], after the change of variable $y=2\pi\eta$, gives
$$
\frac1{2\pi}\int_\RR\abs{M\phi(x+iy)}^2\,\dd y=\int_0^\infty\abs{\phi(t)}^2\,t^{2x}\,\frac{\dd t}t .
$$
Add the cases $x=a$ and $x=-a$, and use $\max(t^{2a},t^{-2a})\le t^{2a}+t^{-2a}\le2\max(t^{2a},t^{-2a})$. The extension to $W_a$ and holomorphy on the open strip follow from the evaluation bound of [[t-sp-evaluation]] below, which makes $M\phi(z)$ continuous in $\phi$ uniformly for $z$ in compact subsets of the strip, so limits are locally uniform and therefore holomorphic. The source states the isomorphism for every Sobolev degree, and the inequality [[eq-sp-edges]] is our direct proof for degree $0$.
:::

::: example
Take $a=0.25$ and $\phi(t)=\operatorname{bump}(\log t-0.3)$ with $\operatorname{bump}(x)=e^{-1/(1-x^2)}$ for $\abs x<1$. Numerically $\norm\phi_a^2=0.161584$ and the edge integral in [[eq-sp-edges]] is $0.273060$, a ratio of $1.690$, inside $[1,2]$.
:::

:::: figure {#f-sp-strip viz="sp-strip" height="460"}
The weight max(t^2a, t^-2a) on the multiplicative line corresponds to the strip of half-width a on the Mellin side, and evaluation of the Mellin transform at a point is a bounded measurement exactly when the point lies inside the strip.

```vizspec
Purpose: connect the weight of the norm to the strip on the Mellin side and to the size of the evaluation functional.
Scene: two panels side by side (stacked below 700 px width).
  Left: horizontal axis u = log t in [-4, 4]; draw the weight exp(2 a |u|) as a blue V-shaped curve, vertical axis 0..10 (clip above). Shade under it lightly.
  Right: the z-plane, Re z in [-0.6, 0.6], Im z in [-40, 40]. Shade the open strip |Re z| < a in light blue with its two edges drawn as dashed blue lines. Draw the critical line Re z = 0 in violet. Draw the first 12 zeros of zeta at z = i*gamma and their conjugates as teal dots on the violet line (kit data). Draw one draggable point z0 (white with dark outline).
Controls: slider a from 0.02 to 0.5 (default 0.25); drag z0 anywhere in the right panel.
Readout: if |Re z0| < a: "evaluation at z0 is continuous, norm = sqrt(a / (a^2 - x0^2)) = ..." with x0 = Re z0 (3 decimals); if |Re z0| >= a: in red, "evaluation at z0 is not continuous on W_a".
Motion: the V on the left steepens as a grows while the strip on the right widens; the readout norm grows without bound as z0 approaches an edge.
Reader takeaway: a steeper weight buys a wider strip; inside the strip the size of the evaluation functional is finite and blows up at the edges.
Check values: a = 0.25: x0 = 0 gives 2.000, x0 = 0.2 gives 3.333, x0 = 0.24 gives 7.143.
```
::::

## Evaluation exists exactly inside the strip {#s-sp-evaluation}

The functionals that describe the quotient of [[tate-theta]] are the evaluations of the Mellin transform and its derivatives at the points $z=\rho-\tfrac12$. The question for $W_a$ is which of them stay continuous, and the answer is as clean as one could hope.

::::: card {#t-sp-evaluation kind="theorem" title="In $W_a$ the value of the Mellin transform at $z_0$, and each of its derivatives there, is a continuous functional exactly when $z_0$ lies in the open strip of half-width $a$" source="masullo" loc="Corollary 9.2.2.5, p. 414"}
:::: statement
Let $a>0$, $z_0=x_0+iy_0$, and $\delta^{(j)}_{z_0}(\phi)=(M\phi)^{(j)}(z_0)=\int_0^\infty\phi(t)(\log t)^jt^{z_0}\,\dd t/t$ on $S_E(\RR_{>0})$.

1. If $\abs{x_0}<a$, every $\delta^{(j)}_{z_0}$ is continuous for $\norm\cdot_a$, and for $j=0$ the norm is exactly
$$
\norm{\delta_{z_0}}=\sqrt{\frac a{a^2-x_0^2}} .
$$ {#eq-sp-dual-norm}
2. If $\abs{x_0}\ge a$, the functional $\delta_{z_0}$ is not continuous: there are $\phi_n\in S_E$ with $M\phi_n(z_0)=1$ for all $n$ and $\norm{\phi_n}_a\to0$.
::::
:::: plain
Inside the strip, the value of the Mellin transform at a point is controlled by the norm, with a constant that grows as the point nears an edge. On the edge and beyond it, there are functions as small as you like whose transform at that point is still 1, so the value at that point is not something the space can see.
::::
:::: why
The quotient of $W_a$ by the closure of the theta sums is described by the continuous functionals that vanish on the theta sums. This theorem says which zeros of $\zeta$ can supply such functionals: those with $z=\rho-\tfrac12$ inside the strip, and no others. It is the step at which zeros outside the strip leave the trace.
::::
:::: idea
Inside the strip, $t^{z_0}$ is small enough at both ends to be paired with any element of $W_a$ by Cauchy-Schwarz. Outside, push a bump far out toward $t=\infty$ (or $t=0$) and tilt it by $t^{-z_0}$: the factor $t^{z_0}$ in the Mellin integral undoes the tilt, so the value stays $1$, while the norm, which grows only like $t^{a}$, sees an exponentially small function.
::::
:::: proof
*Inside.* Write $w(t)=\max(t^{2a},t^{-2a})$. By Cauchy-Schwarz,
$$
\abs{\delta^{(j)}_{z_0}(\phi)}\le\Bigl(\int_0^\infty\abs\phi^2w\,\frac{\dd t}t\Bigr)^{1/2}\Bigl(\int_0^\infty\frac{\abs{\log t}^{2j}t^{2x_0}}{w(t)}\,\frac{\dd t}t\Bigr)^{1/2}.
$$
With $u=\log t$ the second integral is $\int_0^\infty u^{2j}\bigl(e^{-2(a-x_0)u}+e^{-2(a+x_0)u}\bigr)\dd u=(2j)!\bigl[(2(a-x_0))^{-2j-1}+(2(a+x_0))^{-2j-1}\bigr]$, finite because $a\pm x_0>0$. For $j=0$ it equals $\frac1{2(a-x_0)}+\frac1{2(a+x_0)}=\frac a{a^2-x_0^2}$. Equality in Cauchy-Schwarz holds for $\phi=\overline{t^{z_0}}/w$, which lies in $W_a$ and is approximated by elements of $S_E$, so the constant [[eq-sp-dual-norm]] is the norm.

*Right of the strip, $x_0>a$.* Fix a smooth $\operatorname{bump}_1\ge0$ supported in $(0,1)$ with $\int\operatorname{bump}_1=1$, and for $n\ge1$ put $\phi_n(t)=t^{-z_0}\operatorname{bump}_1(\log t-n)$. Then
$$
M\phi_n(z_0)=\int_0^\infty\operatorname{bump}_1(\log t-n)\,\frac{\dd t}t=\int_\RR\operatorname{bump}_1(u-n)\,\dd u=1,
$$
while $\phi_n$ lives on $t\in(e^n,e^{n+1})$, where $w(t)=t^{2a}$, so
$$
\norm{\phi_n}_a^2=\int_\RR\operatorname{bump}_1(u-n)^2e^{-2(x_0-a)u}\,\dd u\le e^{-2(x_0-a)n}\int\operatorname{bump}_1^2\ \xrightarrow[n\to\infty]{}\ 0 .
$$

*Left of the strip, $x_0<-a$.* Use $\phi_n(t)=t^{-z_0}\operatorname{bump}_1(-\log t-n)$, which lives on $t\in(e^{-n-1},e^{-n})$, and the same computation with $u\mapsto-u$.

*On an edge, $x_0=\pm a$.* The tilted bump now has norm independent of $n$, so spread it out. Take $B_N$ smooth with $0\le B_N\le1$, equal to $1$ on $[1,N-1]$ and supported in $[0,N]$, and put $\phi_N(t)=t^{-z_0}B_N(\pm\log t)/N$, with the sign of $x_0$, so that $\abs{t^{-z_0}}^2w(t)=1$ on the support. Then $M\phi_N(z_0)=\frac1N\int B_N\ge\frac{N-2}N$ and $\norm{\phi_N}_a^2=\frac1{N^2}\int B_N^2\le\frac1N$. Dividing $\phi_N$ by $M\phi_N(z_0)$ gives functions with transform $1$ at $z_0$ and norm at most $\sqrt N/(N-2)\to0$.
::::
:::: example
With $a=0.25$, [[eq-sp-dual-norm]] gives $2$ at $x_0=0$, $3.333$ at $x_0=0.2$, and $7.143$ at $x_0=0.24$, and a numerical integration of $t^{2x_0}/w$ reproduces $a/(a^2-x_0^2)=4$, $11.111$, $51.020$. For the bump $\phi$ of the previous example and $z=0.1+3i$, $\abs{M\phi(z)}=0.2043$, below the bound $0.8772$.

Outside: with $a=0.1$, $x_0=0.3$, and $\operatorname{bump}_1$ the normalized bump on $(0,1)$, the functions $\phi_n$ have $M\phi_n(0.3)=1$ for every $n$, while $\norm{\phi_n}_a=1.0526$, $0.3872$, $0.1425$, $0.0193$, $0.00035$ for $n=0,5,10,20,40$. At the interior point $z=0$ their transforms $0.862$, $0.192$, $0.043$, $0.0021$, $5.3\times10^{-6}$ shrink with them, as continuity demands. On the edge $x_0=a=0.1$, the spread functions with $N=4,16,64,256$ have $M\phi_N(a)=0.75$, $0.9375$, $0.9844$, $0.9961$ and norms $0.419$, $0.241$, $0.124$, $0.062$, close to $N^{-1/2}$.
::::
:::: used
- [[t-sp-strip-jets]]: the jets at zeros inside the strip descend to the quotient.
- [[t-sp-quotient]] and [[t-sp-spectral-trace]]: only those jets survive.
- [[trace-to-grh]]: the absence of a zero outside the strip from the spectral side is what the endgame exploits.
::::
:::::

The source also records a refinement for the edges with a positive Sobolev degree $\sigma_0$, where derivatives of order at most $(\sigma_0-1)/2$ at edge points become continuous; with $\sigma_0=0$ none do, in agreement with the edge computation above [@masullo, Corollary 9.2.2.5(2), p. 414].

The failure outside the strip uses functions that escape toward $t=\infty$ or $t=0$. Forbid one direction and that wall disappears. If every function is supported in $[1/A,\infty)$ for a fixed $A>1$, the Cauchy-Schwarz integral becomes $\int_{1/A}^1t^{2x_0+2a}\,\dd t/t+\int_1^\infty t^{2x_0-2a}\,\dd t/t$, finite for every $x_0<a$, so on such functions evaluation is continuous on the whole half-plane left of the right edge. The source proves this as a Paley-Wiener theorem for Hardy-Sobolev spaces [@masullo, Theorem 9.2.2.6 and Corollary 9.2.2.8, p. 415]. It matters for the next chapter. In the weighted picture the orbital functionals of [[primes-as-circles]] sit at the zeros of $1-p^{-(z+1/2)}$, on the line $\Re z=-\tfrac12$ (our computation), which is outside the strip when $a<\tfrac12$. The source brings them into the coarse space with support conditions of this kind, its Paley-Wiener levels [@masullo, p. 51, §7.3.2, p. 350], and [[cutting-the-kernel]] works inside them.

:::: figure {#f-sp-escape viz="sp-escape" height="440"}
A bump pushed toward infinity and tilted by t^-z0 keeps its Mellin transform at z0 equal to 1 while its W_a norm shrinks to 0, so evaluation at a point right of the strip is not a measurement W_a can make.

```vizspec
Purpose: make the discontinuity of evaluation outside the strip visible.
Scene: top panel, horizontal axis u = log t in [-2, 45]. Draw phi_n(e^u) * exp(a u) (the function as the norm sees it) as a red filled curve: it equals exp(-(x0 - a) u) * beta(u - n), with beta(v) = C exp(-1/(1 - (2v - 1)^2)) on (0, 1), C chosen so that the integral of beta is 1. Also draw, as a gold outline, phi_n(e^u) * exp(x0 u) = beta(u - n) (the function as the evaluation at x0 sees it): a bump of fixed shape that slides right with n.
  Bottom panel: three horizontal bars with numeric labels: gold "M phi_n(x0) = 1" (constant), red "||phi_n||_a" (computed as sqrt of the integral of beta(u - n)^2 exp(-2 (x0 - a) u) du by the trapezoid rule on 200 points), and blue "M phi_n(0)" (integral of beta(u - n) exp(-x0 u) du).
Controls: slider n from 0 to 40 (default 0) with a play button that sweeps n upward over 6 seconds; slider a from 0.02 to 0.45 (default 0.1); slider x0 from a to 0.8 (default 0.3). A toggle "edge mode" sets x0 = a and replaces beta(u - n) by the spread plateau B_N(u)/N with N = n + 2 (B_N = 1 on [1, N - 1], smooth ramps on [0, 1] and [N - 1, N]).
Reader takeaway: the gold bar never moves while the red bar goes to zero, exponentially fast off the strip and like N^(-1/2) on the edge; the blue bar (an interior point) goes to zero with the norm.
Check values: a = 0.1, x0 = 0.3: ||phi_n||_a = 1.0526 at n = 0, 0.1425 at n = 10, 0.0193 at n = 20.
```
::::

## The quotient remembers only the strip {#s-sp-quotient}

Recall from [[tate-theta]] the space $\mathcal V$ of weighted theta sums $V_g(t)=t^{1/2}\Theta_g(t)$ ([[d-tt-theta-space]]), whose Mellin transforms are exactly the elements of $AS(\CC)$ of the form $\xi(z+\tfrac12)$ times an entire function ([[t-tt-converse]]), and the divisor exact sequence: in $S_E(\RR_{>0})$, two functions are equal modulo $\mathcal V$ exactly when they have the same jets at the points $z=\rho-\tfrac12$, the $j$th derivative for $0\le j<m_\rho$ at each zero ([[t-tt-divisor]]). That quotient was called $\mathcal H$; its counterpart in $W_a$ gets the subscript $a$.

:::: definition {#d-sp-quotient title="the strip quotient $\mathcal H_a$"}
The *strip quotient* is the Hilbert space
$$
\mathcal H_a=W_a\big/\overline{\mathcal V},
$$
where $\overline{\mathcal V}$ is the closure in $W_a$ of the weighted theta sums. Its elements are classes of elements of $W_a$ modulo that closure, not functions. It is the source's $\mathcal H_{F,a,I}$ over $\mathbb Q$ with Sobolev degree $0$ [@masullo, §10.2.2, p. 445, p. 13].
::::

One half of the description follows at once from [[t-sp-evaluation]].

:::: proposition {#t-sp-strip-jets title="The jets of the Mellin transform at zeros inside the strip are continuous on $W_a$ and vanish on the closure of the theta sums, so they live on the quotient"}
Let $\rho=\beta+i\gamma$ be a zero of $\zeta$ with $\lvert\beta-\tfrac12\rvert<a$ and $0\le j<m_\rho$. Then $\phi\mapsto(M\phi)^{(j)}(\rho-\tfrac12)$ is a continuous functional on $W_a$ that vanishes on $\overline{\mathcal V}$, and so defines a continuous functional on $\mathcal H_a$.
::::

::: proof
The point $\rho-\tfrac12$ has real part $\beta-\tfrac12\in(-a,a)$, so the functional is continuous by [[t-sp-evaluation]]. On a weighted theta sum the Mellin transform is $\xi(z+\tfrac12)h(z)$ with $h$ entire, which vanishes to order $m_\rho$ at $z=\rho-\tfrac12$, so the functional vanishes on $\mathcal V$, and by continuity on its closure.
:::

For a zero outside the strip the same functional vanishes on $\mathcal V$ but is not continuous, so it cannot pass to the closure, and nothing forces elements of $\overline{\mathcal V}$ to keep the zero. The simplest case shows what happens instead: a forced zero outside the strip is no condition at all.

:::: lemma {#t-sp-toy title="In $W_a$ every element is a multiple of $z-z_0$ when $z_0$ lies outside the closed strip, while inside the strip the multiples form a closed subspace of codimension one"}
Let $z_0$ satisfy $\Re z_0>a$ and put $k_{z_0}(t)=t^{-z_0}\mathbf 1_{t>1}$. For every $\phi\in W_a$ the function $\psi=-A(k_{z_0})\phi$ lies in $W_a$, with
$$
\norm\psi_a\le\frac{\sqrt2}{\Re z_0-a}\norm\phi_a,\qquad M\phi(z)=(z-z_0)\,M\psi(z)\quad(\lvert\Re z\rvert<a).
$$
For $\Re z_0<-a$ the same holds with $\psi=A(k'_{z_0})\phi$ and $k'_{z_0}(t)=t^{-z_0}\mathbf 1_{t<1}$. For $\lvert\Re z_0\rvert<a$, by contrast, every multiple $(z-z_0)M\psi$ vanishes at $z_0$, and these multiples lie in the kernel of the continuous functional $\delta_{z_0}$, a closed subspace of codimension one.
::::

::: proof
For $\Re z<\Re z_0$, $Mk_{z_0}(z)=\int_1^\infty t^{z-z_0}\,\dd t/t=1/(z_0-z)$, and the Mellin transform of a convolution is the product of the transforms, so $M\psi=M\phi/(z-z_0)$ on the strip. For $\phi\in S_E$ the function $A(k_{z_0})\phi$ is smooth, decays rapidly at $0$, and behaves like $t^{-z_0}M\phi(z_0)$ at $\infty$, so it lies in $W_a$. It is not in $S_E$, but the Plancherel identity in the proof of [[t-sp-hardy]] applies to it all the same, because $u\mapsto\psi(e^u)e^{\pm au}$ is integrable and square integrable. On the edges $\lvert z-z_0\rvert\ge\Re z_0-a$, so the edge integral of $\psi$ is at most that of $\phi$ divided by $(\Re z_0-a)^2$, and [[eq-sp-edges]] gives the bound, which extends to all of $W_a$ by density. The case $\Re z_0<-a$ is the mirror image, with $Mk'_{z_0}(z)=\int_0^1t^{z-z_0}\,\dd t/t=1/(z-z_0)$ for $\Re z>\Re z_0$. The last sentence is [[t-sp-evaluation]].
:::

The lemma and its proof are ours, as an illustration of the source's mechanism. The test function $t^{-z_0}\mathbf 1_{t>1}$ will reappear in [[trace-to-grh]] as the holomorphic family that turns the trace formula into a statement about $\zeta'/\zeta$. Dividing by a linear factor is the toy case. The theta sums are multiples of $\xi(z+\tfrac12)$, which has infinitely many zeros, and dividing by all of them at once is not a bounded operation, so the full statement needs the source's machinery.

::::: card {#t-sp-quotient kind="theorem" title="An element of $W_a$ lies in the closure of the weighted theta sums exactly when the jets of its Mellin transform vanish at every zero inside the strip" source="masullo" loc="Theorem 10.2.2.1, p. 446; pp. 13, 31"}
:::: statement
An element $\phi\in W_a$ lies in $\overline{\mathcal V}$ if and only if $(M\phi)^{(j)}(\rho-\tfrac12)=0$ for every zero $\rho$ of $\zeta$ with $\lvert\beta-\tfrac12\rvert<a$ and every $0\le j<m_\rho$. Equivalently, the functionals of [[t-sp-strip-jets]], which are integration against the functions $t^{\rho-1/2}(\log t)^j$ with the measure $\dd t/t$, are the coefficient functionals of a Markushevich basis of $\mathcal H_a$, and no zero outside the strip contributes a functional.
::::
:::: plain
After completing in the strip norm and dividing by the theta sums, what is left is exactly the information about the zeros inside the strip, counted with multiplicity. A zero outside the strip, if there were one, would leave no mark on the quotient.
::::
:::: why
The trace of convolution on $\mathcal H_a$ is computed in the basis these functionals provide, so this theorem decides which zeros appear in the spectral side of the trace formula. It is why the Trace Formula of [[trace-formula]] has a zero sum restricted to the strip while its prime side is Weil's complete one.
::::
:::: idea
[[t-sp-strip-jets]] gives the strip jets as conditions on $\overline{\mathcal V}$. The content of the theorem is that there are no others, and [[t-sp-toy]] shows the mechanism: a factor of the Mellin transform whose zero lies outside the strip can be divided out inside $W_a$, so it imposes nothing after closure. A *Markushevich basis* is a biorthogonal system $(x_m,f_m)$ whose vectors span a dense subspace and whose functionals separate points. It is weaker than a Schauder basis, since expansions need not converge, and it is what the source obtains in the Hilbert completions.
::::
:::: sketch {source="masullo" loc="Theorem 10.2.2.1, p. 446; Theorem 10.2.1.1; Theorem 7.1.4.2, p. 326"}
In the fine topology the dual of the quotient is spanned by all jets $\delta^{(j)}_{\rho-1/2}$ (Theorem 7.1.4.2, the dual form of the divisor exact sequence). Passing to $W_a$, the continuous ones are those in the open strip ([[t-sp-evaluation]]), and the source shows that the orthogonal of $\overline{\mathcal V}$ in the dual of $W_a$ is spanned by them and only them. The proof follows that of Theorem 10.2.1.1 (p. 440), with the Hardy-Sobolev estimates of Theorem 9.3.2.6, and uses the classical count of $O(\log T)$ zeros in boxes of height $1$ at height $T$ ([[zeros]]). With a positive Sobolev degree, zeros on the edges also contribute, with multiplicity capped by $\min\bigl(m_\rho,[(\sigma_0-1)/2]+1\bigr)$.
::::
:::: used
- [[t-sp-spectral-trace]]: the trace on $\mathcal H_a$ in this basis.
- [[cutting-the-kernel]]: the spectral kernel is built from these basis vectors.
::::
:::::

## The spectral trace {#s-sp-trace}

Convolution by a test function preserves the theta sums and is bounded on $W_a$, so it acts on the quotient, and on the jets it acts by triangular matrices whose diagonal is the Mellin transform of $\varphi$.

::::: card {#t-sp-spectral-trace kind="theorem" title="Convolution by $\varphi$ acts on the strip quotient as a trace-class operator whose trace is the sum of $M\varphi(\rho-\tfrac12)$ over the zeros inside the strip, with multiplicity" source="masullo" loc="pp. 13 to 14, 46 to 47 (Sobolev degree 0); Theorem 10.3.2.1, p. 453 (degree above 1)"}
:::: statement
Let $a>0$ and $\varphi$ smooth with compact support in $\RR_{>0}$. Then $A(\varphi)$ is bounded on $W_a$, maps $\overline{\mathcal V}$ into itself, and induces a trace-class operator on $\mathcal H_a$ with
$$
\operatorname{Tr}\bigl(A(\varphi)\big|_{\mathcal H_a}\bigr)=\sum_{\lvert\beta-1/2\rvert<a}m_\rho\,M\varphi\bigl(\rho-\tfrac12\bigr),
$$ {#eq-sp-spectral-trace}
the sum running over the zeros $\rho=\beta+i\gamma$ of $\zeta$ in the strip and converging absolutely.
::::
:::: plain
Convolution amplifies each zero's piece of information by the Mellin transform of the test function at that zero. Its trace adds these amplifications over the zeros the space can see, counting a double zero twice.
::::
:::: why
This is the spectral side of the Trace Formula. Every later chapter of Part III computes the same trace a second way.
::::
:::: idea
A jet of order $m$ at $z_0$ is a vector $(u(z_0),u'(z_0),\dots,u^{(m-1)}(z_0))$. Convolution multiplies Mellin transforms by $M\varphi$, and by the Leibniz rule the $j$th derivative of $M\varphi\cdot u$ at $z_0$ is $M\varphi(z_0)u^{(j)}(z_0)$ plus lower derivatives of $u$. So $A(\varphi)$ acts on each jet by a triangular $m\times m$ matrix, a Jordan block, with $M\varphi(z_0)$ on the diagonal, and its trace is $m\,M\varphi(z_0)$.
::::
:::: sketch {source="masullo" loc="Theorem 10.3.2.1, pp. 453 to 454; pp. 13 to 14"}
*Bounded.* The weight $e^{2a\abs{\log t}}$ is submultiplicative, $e^{a\abs{\log x}}\le e^{a\abs{\log t}}e^{a\abs{\log(x/t)}}$, so Minkowski's inequality gives $\norm{A(\varphi)\phi}_a\le\bigl(\int_0^\infty\abs{\varphi(t)}e^{a\abs{\log t}}\,\dd t/t\bigr)\norm\phi_a$.

*Invariant.* $A(\varphi)\bigl(t^{1/2}\Theta_g\bigr)=t^{1/2}A(t^{-1/2}\varphi)\Theta_g$, and convolution maps theta sums to theta sums (as in [[t-pc-orbital-trace]]), so $\mathcal V$ is invariant, and so is its closure by continuity.

*Trace.* In the basis of [[t-sp-quotient]] the matrix of $A(\varphi)$ is block triangular with the Jordan blocks of the idea. The eigenvalues are absolutely summable: integrating by parts in $u=\log t$ gives $\abs{M\varphi(x+iy)}\le C_N(1+\abs y)^{-N}$ uniformly for $\abs x\le a$, and there are $O(\log T)$ zeros with $T\le\abs\gamma\le T+1$. The source writes the operator as a trace-norm limit of finite-rank operators built from the basis and its dual and computes the trace as the sum of the diagonal entries. Which statement this card cites matters. The theorem in the source's body, Theorem 10.3.2.1 (pp. 453 to 454), assumes a Sobolev degree above $1$, and its trace then also contains the zeros on the two edges of the strip, with capped multiplicity. The statement at degree $0$, with the open strip only and no edge terms, is the one the introduction and the letter give and use (pp. 13 to 14 and 46 to 47, where the author notes that degree $0$ suffices for the paper); this page follows it.
::::
:::: example
Suppose, as a schematic, that the strip contained a zero $z_0=\rho-\tfrac12$ of multiplicity $2$. In the coordinates $(u(z_0),u'(z_0))$ convolution acts by
$$
\begin{pmatrix}M\varphi(z_0)&0\\ M\varphi'(z_0)&M\varphi(z_0)\end{pmatrix},
$$
because $(M\varphi\cdot u)'(z_0)=M\varphi'(z_0)u(z_0)+M\varphi(z_0)u'(z_0)$. Its trace is $2M\varphi(z_0)=m_\rho M\varphi(\rho-\tfrac12)$, and the off-diagonal entry, which carries the derivative of $M\varphi$, does not enter. (The zeros of $\zeta$ computed so far are all simple; the example illustrates the algebra of multiplicity, not a known zero.)
::::
:::: used
- [[cutting-the-kernel]]: the diagonal mass of the geometric kernel equals minus this trace.
- [[trace-formula]]: the right side of the Trace Formula.
- [[trace-to-grh]]: a zero outside the strip is absent from this sum.
::::
:::::

:::: figure {#f-sp-jordan viz="sp-jordan" height="420"}
The matrix of convolution on the jets is block triangular, one Jordan block per zero in the strip, and the trace adds the diagonal entries, so each zero counts with its multiplicity and zeros outside the strip have no block at all. The points drawn off the critical line are hypothetical.

```vizspec
Purpose: show how the trace on the strip quotient is assembled from Jordan blocks.
Scene: left, a schematic z-plane: Re z in [-0.6, 0.6], Im z in [0, 50], violet critical line, blue strip |Re z| < a. Place 6 schematic points (teal), labeled as "schematic zeros" in the caption area of the figure only (not inside the drawing): at Im = 8, 15, 22, 30, 37, 45 with Re = 0, 0, 0.12, 0, -0.3, 0 and multiplicities 1, 1, 2, 1, 1, 3 (drawn as 1, 2, or 3 concentric rings).
  Right, a square matrix grid of size equal to the total multiplicity of the points inside the strip. Each point inside the strip owns a diagonal block of size equal to its multiplicity: diagonal cells teal and labeled "M(z_k)", cells below the diagonal inside the block muted and labeled with "M'", "M''/2" as appropriate, all other cells blank. Points outside the strip are drawn red and hollow on the left, and own no block.
Controls: slider a from 0.02 to 0.5 (default 0.2). As a changes, blocks appear or disappear with a short fade.
Readout: "trace = sum over points in strip of multiplicity * M(z_k)" written out symbolically, e.g. "M(z1) + M(z2) + 2 M(z3) + ...".
Reader takeaway: the trace counts each visible zero with multiplicity through the diagonal of its block; widening the strip adds blocks, and nothing else changes.
```
::::

## Why this is legitimate {#s-sp-legitimate}

A reader who has followed this far may suspect a trick: choose a norm that hides the zeros you do not want, and then of course they disappear. Three points show that nothing of the kind is happening.

The first is that nothing about the zeros entered the choice. The norm $\norm\cdot_a$ is defined by the weight $\max(t^{2a},t^{-2a})$, which knows nothing about $\zeta$: it is the same weight for every L-function and every number field, and $a$ is any positive number. The source chose it, in its own account, by asking what the geometric computation needs, namely that evaluations of Mellin transforms on the imaginary line and all their derivatives be continuous, which takes "a little bit of interior" around that line [@masullo, pp. 45 to 46]. The letter puts it bluntly: "the zeros play no role here" [@masullo, p. 36].

The second is that the theorems of this chapter are true whatever the zeros are. [[t-sp-spectral-trace]] does not say that there are no zeros outside the strip. It says that if there were one, the operator on $\mathcal H_a$ would not see it. The trace on $\mathcal H_a$ is a number attached to an honest operator on an honest Hilbert space, and changing the space changes the number, just as the trace of a matrix depends on which subspace it acts on.

The third is where the price is paid. A trace formula equates two computations of the trace of one operator on one space. The spectral computation in $W_a$ is easy and gives [[eq-sp-spectral-trace]]. The geometric computation must now also be carried out inside $W_a$, with only the functionals that are continuous there, and nothing guarantees in advance that the answer will be the full prime side of Weil's explicit formula. Meyer's earlier degeneration from global to local used infinite Euler products, which converge only in fine topologies, and in the critical strip Mertens' theorem blocks them [@masullo, pp. 39 to 40]. Masullo's answer is to remove one prime at a time with the orbital bases of [[primes-as-circles]] and to make the needed functionals continuous with support conditions, and that is the work of [[cutting-the-kernel]]. If the geometric side in $W_a$ comes out as Weil's complete prime side, it knows every zero, while the spectral side knows only the strip, and [[trace-to-grh]] turns this mismatch into the conclusion that no zero lies outside the strip. The source's slogan for this is that GRH "is a topological phenomenon" [@masullo, §1.4.8, p. 31].

## Three topologies, three trace formulas {#s-sp-contrast}

The choice of topology is the only difference between three programs that share the divisor exact sequence of [[tate-theta]].

| Topology | Which evaluations are continuous | Zeros on the spectral side | What the trace formula becomes |
| --- | --- | --- | --- |
| Fine: $S_E$, or Meyer's bornologies | at every point | all zeros | Weil's explicit formula |
| Hardy-Sobolev $W_a$, $a>0$ (Masullo) | inside the open strip $\lvert\Re z\rvert<a$ | zeros with $\lvert\beta-\tfrac12\rvert<a$ | the Trace Formula of [[trace-formula]] |
| $a=0$: Connes's Sobolev $L^2$ space | at most low-order derivatives on the line, depending on the Sobolev degree | zeros on the critical line | no trace formula by this method |

In the fine topology every jet is continuous, the quotient keeps every zero, and the trace of convolution is the zero side of Weil's explicit formula. Meyer degenerated the global kernel to a local one with infinite Euler products, which forces such topologies, and his trace formula is therefore Weil's explicit formula, a true statement with no information about where the zeros are [@meyer2005] [@masullo, pp. 32, 39].

At the other extreme, $a=0$ collapses the strip to the critical line. This is Connes's setting, with the Sobolev degree equal to his $\delta$ [@masullo, §1.5.1, p. 32, p. 44]. Connes's 1999 paper gives the zeros on the critical line as an absorption spectrum, while zeros off the line would appear only as resonances, and it reduces the Riemann hypothesis to the validity of a trace formula on the space of adele classes, in a version that no longer needs the parameter $\delta$ [@connes1999]. The letter states that the degenerate case $a=0$ does not lead to a trace formula and traces the obstruction to the one point where the Euler factors of all primes share a zero, the repeated pole of [[primes-as-circles]] [@masullo, pp. 36 to 37].

Between them, $a>0$ keeps enough interior around the critical line for the geometric side to be computed, and little enough of the plane that zeros outside the strip are invisible. Since $a$ can be as small as we like, the strip can be made as thin as we like, which is what [[trace-to-grh]] needs.

## What changes in general {#s-sp-general}

For a number field $F$ and a Hecke character $\chi$, $\RR_{>0}$ is replaced by the idele class group $C_F$, and the weight is $\max(\lvert g\rvert^{2a},\lvert g\rvert^{-2a})$ in the idelic norm $\lvert g\rvert$, so the space decomposes into isotypes under the compact group $C_F^1$, one for each character of $C_F^1$, and on each the Mellin transform is a function on one component of the space of quasi-characters [@masullo, §1.8.2.3, p. 44, §10.2.2, p. 445]. Everything in this chapter then holds isotype by isotype, with the zeros of $L(s,\chi)$ in place of those of $\zeta$, so the trace is $\sum N(\rho)\int_{C_F}\chi(g)\varphi(g)\lvert g\rvert^{\rho-1/2}\,\dd\mu(g)$ over the zeros with $\lvert\Re\rho-\tfrac12\rvert<a$ [@masullo, p. 53]. When $\chi$ has $\chi(\tau(t))=t^{ix_0}$ on a section $\tau$ of the norm, the whole picture shifts vertically by $x_0$. The body of the source works with a positive Sobolev degree, at least $2[F:\mathbb Q]$ where the orbital functionals at the places above one prime require it, and then zeros on the edges of the strip contribute with capped multiplicity.

::: recap
You now have the following, and where each is used.

- A norm decides which linear measurements are continuous, and a coarser norm makes the closure of a subspace larger and the quotient smaller: the principle behind the whole of Route M.
- The space $W_a$, with norm weighted by $\max(t^{2a},t^{-2a})$, whose Mellin picture is a Hardy space on the strip $\lvert\Re z\rvert<a$ normed by its two edges: the space in which [[cutting-the-kernel]] and [[trace-formula]] compute.
- Evaluation of the Mellin transform at $z_0$ is continuous exactly when $\lvert\Re z_0\rvert<a$, with norm $\sqrt{a/(a^2-x_0^2)}$, and explicit sequences show the failure on and beyond the edges: why zeros outside the strip leave the spectral side.
- One-sided support restores continuity on one side: how the next chapter keeps the orbital functionals of [[primes-as-circles]].
- The strip quotient $\mathcal H_a=W_a/\overline{\mathcal V}$, described by the jets at the zeros inside the strip, and the spectral trace $\sum_{\lvert\beta-1/2\rvert<a}m_\rho M\varphi(\rho-\tfrac12)$, computed through Jordan blocks: the right side of the Trace Formula in [[trace-formula]] and the zero sum in [[trace-to-grh]].
- Why the choice is legitimate (the zeros play no role in it), where the price is paid (the geometric side in [[cutting-the-kernel]]), and the contrast with Meyer's fine topology, which gives back Weil's explicit formula, and with Connes's case $a=0$.
:::
