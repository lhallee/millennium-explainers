---
id: tate-theta
title: "Tate's thesis as theta and zeta: functions modulo theta functions"
part: 3
summary: After this chapter you can build a theta sum from any even Schwartz function, compute its Mellin transform as zeta times a factor, say exactly which functions on the positive reals are theta sums, and read the quotient of all functions by the theta sums as the list of jets of Mellin transforms at the zeros of zeta.
needs: [adeles, zeta-continued, weil-positivity]
---

::: plain
Riemann proved his functional equation by adding up a Gaussian over the integers. Nothing in that proof needs the Gaussian: any even, rapidly decreasing function gives a sum with the same symmetry, and its Mellin transform is the zeta function times a simple factor. Collect all of these sums into one space. A function on the positive reals belongs to that space exactly when its Mellin transform vanishes at every zero of zeta, so what remains of a function after the theta sums are removed is precisely its behavior at the zeros.
:::

This chapter opens Route M, the proof of A. M. Masullo [@masullo]. Its plan is to compute one trace in two ways. The trace is that of a convolution operator acting on "all functions modulo theta sums", a space whose only content, as this chapter shows, is one number (or a few numbers) for each zero of $\zeta$. Computed through the zeros, the trace is a sum over zeros; computed through the primes, it is the prime side of Weil's explicit formula. Chapters [[primes-as-circles]] to [[trace-to-grh]] change the space so that zeros off the critical line drop out of the first computation and not of the second. Here we build the space, in its original, fine form, and see that in that form the two computations give back Weil's explicit formula of [[weil-positivity]] and nothing more.

Everything is over $\QQ$ with the trivial character, on the half-line $\RR_{>0}$ with the measure $\dd t/t$. By [[t-ad-class-group]], that is the idele class group $C_\QQ$ seen through the norm. The adeles of [[adeles]] appear for one purpose: to explain why the operations used here are the natural ones.

## Riemann's proof, read again {#s-tt-riemann}

Recall the proof in [[zeta-continued]]. Riemann summed the Gaussian $e^{-\pi n^2 t}$ over $n\in\ZZ$ to get the theta function $\theta(t)$, used Poisson summation to prove $\theta(1/t)=\sqrt t\,\theta(t)$, took the Mellin transform of $\omega(t)=\tfrac12(\theta(t)-1)$ to get $\pi^{-s/2}\Gamma(s/2)\zeta(s)$, cut the integral at $t=1$, and used the symmetry to turn the part near $0$ into a second integral near $\infty$. The result was an entire $\xi(s)$ with $\xi(s)=\xi(1-s)$.

Change the variable from $t$ to $t^2$, so that the Gaussian is evaluated at $nt$ instead of $n\sqrt t$:
$$
\theta(t^2)-1=\sum_{n\ne0}e^{-\pi(nt)^2}.
$$ {#eq-tt-riemann-sum}
In this form the proof used exactly three properties of $g(x)=e^{-\pi x^2}$. It is even and decays rapidly, so the sum converges and its Mellin transform factors as $\zeta(s)$ times the Mellin transform of $g$. Its Fourier transform is again a rapidly decaying function, here $g$ itself, so Poisson summation relates the sum at $t$ to a sum at $1/t$. And the Mellin transform of $g$ is a known function, $\tfrac12\pi^{-s/2}\Gamma(s/2)$. The first two hold for every even Schwartz function, and the third is a convenience. So the proof is one member of a family, indexed by the function $g$, and the family is the object of this chapter.

## Theta sums {#s-tt-theta-sums}

:::: definition {#d-tt-theta-sum title="the theta sum of an even Schwartz function"}
Let $g$ be an even Schwartz function on $\RR$. Its *theta sum* is the function of $t>0$
$$
\Theta_g(t)=\sum_{n\ne0}g(nt)=2\sum_{n\ge1}g(nt).
$$
It is a smooth function on $\RR_{>0}$, a sum of the values of $g$ on the lattice $t\ZZ\setminus\{0\}$. It is not a modular form, and it is not a theta lift: it is a periodization over the multiplicative group $\QQ^\times$, as the adelic description below shows. For $g(x)=e^{-\pi x^2}$ it is $\theta(t^2)-1$. We write $Mg(s)=\int_0^\infty g(t)\,t^s\,\dd t/t$ for the Mellin transform of $g$ restricted to $(0,\infty)$; it converges for $\Re s>0$.
::::

Three functions will serve as examples throughout. The Gaussian $g_0(x)=e^{-\pi x^2}$ is Riemann's. The function
$$
g_\star(x)=\bigl(4\pi^2x^4-6\pi x^2\bigr)e^{-\pi x^2}
$$ {#eq-tt-gstar}
is obtained from $g_0$ by the differential operator $(x\tfrac{\dd}{\dd x})(x\tfrac{\dd}{\dd x}+1)$, and the reason for that choice appears in [[s-tt-decay]]. The third is compactly supported. Start from the standard bump function $\operatorname{bump}(x)=e^{-1/(1-x^2)}$ for $\abs x<1$ and $\operatorname{bump}(x)=0$ otherwise, and apply the same operator:
$$
g_c(x)=\frac{2x^2\,(x^4+4x^2-3)}{(1-x^2)^4}\,e^{-1/(1-x^2)}\quad(\abs x<1),\qquad g_c(x)=0\quad(\abs x\ge1).
$$ {#eq-tt-gc}
It is smooth and even, it vanishes outside $(-1,1)$, and its largest absolute value is $5.78$, near $x=0.90$. Because $g_c(nt)=0$ as soon as $nt\ge1$, the theta sum $\Theta_{g_c}(t)$ is a finite sum, and it is identically $0$ for $t\ge1$.

### The symmetry

The theta function's symmetry came from Poisson summation on $\ZZ$. The same step works for every $g$, with two correction terms that come from the missing term $n=0$.

:::: theorem {#t-tt-riemann-roch title="The theta sum at $t$ equals the theta sum of the Fourier transform at $1/t$, divided by $t$, up to two constant terms" source="tate1967"}
For every even Schwartz function $g$ and every $t>0$,
$$
\Theta_g(t)=\frac1t\,\Theta_{\hat g}\!\left(\frac1t\right)+\frac{\hat g(0)}t-g(0).
$$ {#eq-tt-riemann-roch}
This is the adelic Riemann-Roch theorem of Tate [@tate1967, Chapter XV, Theorem 4.2.1] for the adelic function $g\otimes\bigotimes_p\mathbf 1_{\ZZ_p}$ and the idele $(t,1,1,\dots)$, in the form of [@masullo, Theorem 2.2.3.2, p. 82].
::::

::: proof
Apply Poisson summation [[t-ad-poisson]] (on $\RR$, it is the theorem of [[complex-toolkit]]) to $x\mapsto g(tx)$, whose Fourier transform is $y\mapsto t^{-1}\hat g(y/t)$. It gives $\sum_{n\in\ZZ}g(nt)=t^{-1}\sum_{k\in\ZZ}\hat g(k/t)$. Remove the term $n=0$ on the left, which is $g(0)$, and the term $k=0$ on the right, which is $t^{-1}\hat g(0)$.
:::

For the Gaussian, $\hat g_0=g_0$ and $g_0(0)=\hat g_0(0)=1$, and the identity is $\theta(t^2)-1=t^{-1}(\theta(t^{-2})-1)+t^{-1}-1$, which is Jacobi's $\theta(1/u)=\sqrt u\,\theta(u)$ at $u=t^2$. At $t=\tfrac12$ both sides equal $1.0000139$. Adelically the identity is a statement about $\QQ$ inside $\AA$, and over $\QQ$ it reduces to a statement about $\ZZ$ inside $\RR$ because, by [[l-ad-integers]], the indicators $\mathbf 1_{\ZZ_p}$ cut the sum over $\QQ$ down to $\ZZ$.

### The Mellin transform

:::: theorem {#t-tt-mellin title="The Mellin transform of a theta sum is twice $\zeta$ times the Mellin transform of $g$" source="tate1967"}
For $\Re s>1$,
$$
\int_0^\infty\Theta_g(t)\,t^s\,\frac{\dd t}t=2\,\zeta(s)\,Mg(s).
$$ {#eq-tt-mellin}
For $g=g_0$ the right side is $\pi^{-s/2}\Gamma(s/2)\zeta(s)$ [@masullo, Theorem 3.2.2.1, p. 124].
::::

::: proof
Substitute $u=nt$ in each term: $\int_0^\infty g(nt)t^s\,\dd t/t=n^{-s}Mg(s)$, because $\dd t/t=\dd u/u$. The sum over $n\ge1$ of the absolute values is $\sum_nn^{-\sigma}\int_0^\infty\abs{g(u)}u^\sigma\,\dd u/u<\infty$ for $\sigma>1$, so sum and integral can be exchanged, and the factor $2$ counts $\pm n$. For the Gaussian, $Mg_0(s)=\tfrac12\pi^{-s/2}\Gamma(s/2)$ by [[t-ad-local-zeta]].
:::

Write $Z_g(s)=2\zeta(s)Mg(s)$ for this function. The same cut at $t=1$ that proved the functional equation of $\zeta$ proves one for every $Z_g$.

:::: theorem {#t-tt-functional-equation title="Every $Z_g$ continues to the plane with at most two simple poles and satisfies $Z_g(s)=Z_{\hat g}(1-s)$" source="tate1967"}
$Z_g$ extends to a meromorphic function on $\CC$ whose only possible poles are simple poles at $s=1$, with residue $\hat g(0)$, and at $s=0$, with residue $-g(0)$. For all $s$,
$$
Z_g(s)=Z_{\hat g}(1-s).
$$ {#eq-tt-fe}
::::

::: proof
For $\Re s>1$, split the integral [[eq-tt-mellin]] at $t=1$ and substitute $t=1/u$ in the part over $(0,1)$. By [[eq-tt-riemann-roch]] at $1/u$, $\Theta_g(1/u)=u\,\Theta_{\hat g}(u)+u\,\hat g(0)-g(0)$. The two constant terms integrate against $u^{-s}\,\dd u/u$ over $(1,\infty)$ to $\hat g(0)/(s-1)$ and $-g(0)/s$. Hence
$$
Z_g(s)=\int_1^\infty\Theta_g(t)\,t^{s}\frac{\dd t}t+\int_1^\infty\Theta_{\hat g}(t)\,t^{1-s}\frac{\dd t}t+\frac{\hat g(0)}{s-1}-\frac{g(0)}s.
$$ {#eq-tt-split}
Both integrals converge for every $s$, locally uniformly, because $\Theta_g$ and $\Theta_{\hat g}$ decay faster than any power as $t\to\infty$. So the right side is the meromorphic continuation, with the stated poles. Writing the same formula for $Z_{\hat g}(1-s)$ and using $\hat{\hat g}=g$ (since $g$ is even) swaps the two integrals, and its two fractions $g(0)/((1-s)-1)-\hat g(0)/(1-s)=\hat g(0)/(s-1)-g(0)/s$ are the same two fractions, which proves [[eq-tt-fe]].
:::

For $g_0$ this is the proof of [[zeta-continued]], with the residues $1$ and $-1$ of the function called $\Phi$ there. The theorem says more than Riemann's, though, because $g$ is arbitrary: the functional equation of $\zeta$ is now a property of an entire family of Mellin transforms.

:::: figure {#f-tt-theta-sum viz="theta-sum-lattice" height="460"}
A theta sum adds up $g$ on the lattice $t\ZZ\setminus\{0\}$, and the weighted sum $t^{1/2}\Theta_g(t)$ is unchanged when $t$ is replaced by $1/t$ and $g$ by $\hat g$.

```vizspec
Purpose: show the theta sum as a lattice sum and its t -> 1/t symmetry, for three choices of g, including one with compact support.
Scene: two panels. Top panel: x in [-6, 6]. The graph of g in blue. Gold sticks at the lattice points x = n t for n = -40..40, n != 0 (sticks outside the window not drawn), each of height g(nt). The point x = 0 is marked with an open muted circle (the omitted term). A label prints Theta_g(t) = sum of the stick heights. Bottom panel: horizontal axis log t in [-3, 3] (tick labels t = 0.05 ... 20), vertical axis for the weighted sum V(t) = t^{1/2} Theta_g(t). Draw V(t) as a gold curve and the dual curve t^{1/2} Theta_{ghat}(1/t) + (correction) as a dashed blue curve, where correction = t^{-1/2} ghat(0) - t^{1/2} g(0); the two curves coincide (Riemann-Roch). A vertical marker at the current t, and a mirrored marker at 1/t.
Controls: slider for t on a log scale from 0.05 to 20 (default 0.6). A selector for g among: "Gaussian g0 = exp(-pi x^2)" (ghat = g0, g(0) = ghat(0) = 1), "g_star = (4 pi^2 x^4 - 6 pi x^2) exp(-pi x^2)" (ghat = g_star, g(0) = ghat(0) = 0), and "compact g_c" (g_c(x) = 2x^2(x^4+4x^2-3)/(1-x^2)^4 * exp(-1/(1-x^2)) for |x| < 1, else 0). For g_c the dual curve is not drawn, since its transform has no closed form; the bottom panel shows V(t) alone, which is exactly 0 for t >= 1. A button "t -> 1/t".
Motion: dragging t compresses or spreads the lattice; for g_c the sticks leave the support one by one as t grows and the sum is exactly 0 for t >= 1.
Readout: Theta_g(t) and V(t) to 6 digits. Reference values to test the implementation: for g_star, V(1) = 1.786788, V(2) = V(0.5) = 0.005487, V(1.25) = V(0.8) = 1.104776; for g_c, Theta(0.5) = -1.614126, Theta(0.1) = 2.194000, Theta(0.02) = -0.005867, Theta(0.01) = -8.699e-6.
Reader takeaway: any even rapidly decaying g gives a theta sum; when g(0) = 0 and the integral of g is 0, the weighted sum decays at both ends and is symmetric under t -> 1/t paired with g -> ghat.
Data: none; closed forms.
```
::::

### The same computation, on the adeles

Why should $\zeta(s)$ appear as a factor, independently of $g$? The adeles give the answer, and it is the content of Tate's thesis over $\QQ$. Take the adelic function $f=g\otimes\bigotimes_p\mathbf 1_{\ZZ_p}$ of [[eq-ad-standard-f]] and an idele class represented by $(t,u)\in\RR_{>0}\times\hat\ZZ^\times$. The adelic theta function of $f$ is
$$
\Phi(f)(t,u)=\sum_{\xi\in\QQ^\times}f\bigl(\xi\cdot(t,u)\bigr)=\sum_{\xi\in\QQ^\times}g(\xi t)\prod_p\mathbf 1_{\ZZ_p}(\xi u_p)=\sum_{n\ne0}g(nt)=\Theta_g(t),
$$ {#eq-tt-adelic-theta}
because $\xi u_p\in\ZZ_p$ for every $p$ exactly when $\xi\in\ZZ$ ([[l-ad-integers]]), and the result does not depend on $u$. This is the definition of the global adelic theta function in the source [@masullo, Definition 2.2.3.1, p. 81], specialized to $\QQ$.

Now compute Tate's zeta integral $\int_{\AA^\times}f(x)\abs x^s\,\dd^\times x$ in two ways. As a product over places, it is $\int_{\RR^\times}g(x)\abs x^s\,\dd x/\abs x$ times the local integrals $\int\mathbf 1_{\ZZ_p}\abs x_p^s\,\dd^\times x=(1-p^{-s})^{-1}$ of [[t-ad-local-zeta]], which is $2Mg(s)\,\zeta(s)$ by the Euler product. As an integral over the class group, fold the sum over $\QQ^\times$: by [[t-ad-class-group]], $\RR_{>0}\times\hat\ZZ^\times$ is a fundamental domain for $\QQ^\times$ in $\AA^\times$, with measure $\dd t/t$ times the probability measure on $\hat\ZZ^\times$, so the integral is $\int_0^\infty\Theta_g(t)\,t^s\,\dd t/t$. The two answers are [[eq-tt-mellin]]. So the Euler product is the zeta integral unfolded over the places, the theta sum is the same integral folded over $\QQ^\times$, and $\zeta(s)$ is the contribution of the indicators $\mathbf 1_{\ZZ_p}$, whatever $g$ is.

Is every adelic theta function of trivial character a theta sum? The source's Fifth Structure Theorem says yes: because every ideal of $\ZZ$ is principal, the set of places $S=\{\infty\}$ is already large enough, and every global theta function in the trivial isotype has the form $\Phi(f_\infty\otimes\bigotimes_p\mathbf 1_{\ZZ_p})$ [@masullo, Theorem 6.2.1.1, p. 295, and p. 44]. Symmetrizing $f_\infty$ changes nothing in the sum, so it is $\Theta_g$ for an even $g$. Over $\QQ$, then, the family $\{\Theta_g\}$ is the whole space of theta functions with trivial character, and nothing is lost by working with it.

## Removing one prime {#s-tt-remove-prime}

The adelic picture also says what it means to remove a prime. Replace the factor $\mathbf 1_{\ZZ_p}$ by $\mathbf 1_{\ZZ_p^\times}$. By [[l-ad-integers]], the sum [[eq-tt-adelic-theta]] then runs over the integers prime to $p$, and by [[t-ad-local-zeta]] the local integral at $p$ becomes $1$ instead of $(1-p^{-s})^{-1}$. On $\RR_{>0}$ the replacement is a simple operator.

:::: definition {#d-tt-dp title="the operator that deletes the multiples of $p$"}
For a prime $p$ and a function $u$ on $\RR_{>0}$, put
$$
(D_pu)(t)=u(t)-u(pt).
$$
$D_p$ is a linear operator on functions of one positive real variable. It is not a difference quotient and not a projection: applied twice, it gives $u(t)-2u(pt)+u(p^2t)$. In the source it is Weil's principal value operator $\mathrm{PV}_p$, $f(x)\mapsto f(x)-f(\pi_p^{-1}x)$, acting on the factor at $p$ [@masullo, §5.3, p. 240, and p. 18].
::::

:::: proposition {#t-tt-dp title="Deleting the multiples of $p$ from a theta sum multiplies its Mellin transform by $1-p^{-s}$" source="masullo"}
For every even Schwartz $g$,
$$
D_p\Theta_g(t)=\sum_{p\nmid n}g(nt)=\Phi\Bigl(g\otimes\mathbf 1_{\ZZ_p^\times}\otimes\bigotimes_{\ell\ne p}\mathbf 1_{\ZZ_\ell}\Bigr)(t),
$$ {#eq-tt-dp}
and, for any $u$ whose Mellin transform converges at $s$, $\int_0^\infty(D_pu)(t)\,t^s\,\dd t/t=(1-p^{-s})\int_0^\infty u(t)\,t^s\,\dd t/t$. In particular the Mellin transform of $D_p\Theta_g$ is $2(1-p^{-s})\zeta(s)Mg(s)$. This is Weil's identity [@masullo, Theorem 3.4.1.1, p. 143, and (1.8.1.3), p. 41], in our notation.
::::

::: proof
$\Theta_g(pt)=\sum_{n\ne0}g(npt)$ is the part of $\Theta_g(t)$ over the multiples of $p$, so the difference keeps the $n$ prime to $p$, which is the adelic sum with $\mathbf 1_{\ZZ_p^\times}$ at $p$ by [[l-ad-integers]]. For the Mellin transform, substitute $t\mapsto t/p$ in $\int u(pt)t^s\,\dd t/t$, which gives $p^{-s}\int u(t)t^s\,\dd t/t$.
:::

Test it at $t=0.4$ and $p=3$ with the Gaussian: $\Theta_{g_0}(0.4)-\Theta_{g_0}(1.2)=1.478307$, and $2\sum_{3\nmid n}e^{-\pi(0.4n)^2}=1.478307$. On the weighted sums $V_g(t)=t^{1/2}\Theta_g(t)$ of the next section, the same deletion reads $V_g(t)-p^{-1/2}V_g(pt)$, and its Mellin factor in the variable $z=s-\tfrac12$ is $1-p^{-1/2-z}$. The zeros of $1-p^{-s}$ are the points $s=2\pi im/\log p$, $m\in\ZZ$, evenly spaced on the imaginary axis with gap $2\pi/\log p$. Chapter [[primes-as-circles]] shows that the theta sums modulo the image of $D_p$ are functions on a circle of length $\log p$, and that these zeros are its Fourier frequencies.

:::: figure {#f-tt-delete-p viz="delete-prime" height="420"}
Replacing $\mathbf 1_{\ZZ_p}$ by $\mathbf 1_{\ZZ_p^\times}$ deletes the lattice points at multiples of $p$, and multiplies the Mellin transform by $1-p^{-s}$, whose zeros are evenly spaced on the imaginary axis.

```vizspec
Purpose: connect the three faces of "remove one prime": the adelic factor, the lattice sum, and the Euler factor on the Mellin side.
Scene: left panel: x in [0, 8]; the Gaussian g0(x) = exp(-pi x^2 / 4) in blue (wider so many sticks show); gold sticks at x = n t for n = 1..40; sticks at multiples of p turn red and drop to the axis when deletion is on. Labels show "Theta_g(t) = ..." and "D_p Theta_g(t) = ..." and the identity "Theta_g(t) - Theta_g(pt)". Right panel: the complex s-plane with Re s in [-1, 2], Im s in [-40, 40]; teal dots at the zeros of 1 - p^{-s}, s = 2 pi i m / log p for |Im s| <= 40, with the spacing 2 pi / log p printed; the line Re s = 0 drawn muted. A small inset table lists, for the chosen p, the local integral of 1_{Z_p} |x|^s (= 1/(1 - p^{-s})) and of 1_{Z_p^x} |x|^s (= 1), evaluated at s = 2.
Controls: selector p in {2, 3, 5, 7}; toggle "delete multiples of p"; slider t from 0.1 to 2 (log scale).
Motion: toggling deletion drops the red sticks over 300 ms; changing p re-spaces the teal dots (spacing 9.06 for p = 2, 5.72 for p = 3, 3.90 for p = 5, 3.23 for p = 7).
Reader takeaway: deleting the multiples of p is the operator u(t) - u(pt); on the Mellin side it multiplies by 1 - p^{-s}, an Euler factor removed, whose zeros sit on the imaginary axis.
Data: none.
```
::::

## The two conditions, and the decay they buy {#s-tt-decay}

The poles of $Z_g$ at $0$ and $1$ come from the constant terms $\hat g(0)/t$ and $-g(0)$ in [[eq-tt-riemann-roch]]. Those terms also stop $\Theta_g$ from decaying as $t\to0$: for the Gaussian, $\Theta_{g_0}(t)\approx1/t-1$ for small $t$. Both problems disappear together when the two constants are $0$.

:::: proposition {#t-tt-decay title="If $g(0)=0$ and the integral of $g$ is $0$, the theta sum decays faster than any power of $t$ at both ends" source="masullo"}
Let $g$ be even and Schwartz with $g(0)=0$ and $\int_\RR g=\hat g(0)=0$. Then for every $N$ there is $C_N$ with
$$
\abs{\Theta_g(t)}\le C_N\,e^{-N\abs{\log t}}\qquad(t>0),
$$ {#eq-tt-decay}
and the same holds for $(t\tfrac{\dd}{\dd t})^k\Theta_g$ for every $k$. Equivalently $\Theta_g(t)=O(t^N)$ as $t\to0$ and $O(t^{-N})$ as $t\to\infty$, for every $N$ [@masullo, Theorem 2.2.3.4(3), p. 83]. Then $Z_g$ is entire.
::::

::: proof
For $t\ge1$, $\abs{\Theta_g(t)}\le2\sum_{n\ge1}\abs{g(nt)}\le2C\sum_n(nt)^{-N-2}\le C't^{-N}$ since $g$ is Schwartz. For $t\le1$, [[eq-tt-riemann-roch]] with $g(0)=\hat g(0)=0$ reads $\Theta_g(t)=t^{-1}\Theta_{\hat g}(1/t)$, and the bound for $t\ge1$ applied to $\hat g$, which is again even and Schwartz, gives $\abs{\Theta_g(t)}\le C't^{-1}t^{N+1}$. For derivatives, $(t\tfrac{\dd}{\dd t})\Theta_g=\Theta_{xg'}$, and $xg'$ is even and Schwartz with value $0$ at $0$ and $\int xg'(x)\,\dd x=-\int g=0$, so the same argument applies. Finally, [[eq-tt-split]] has no fractions left, and its integrals are entire.
:::

The decay is in $\abs{\log t}$, which is the natural size on the multiplicative line: $e^{-N\abs{\log t}}=\min(t^N,t^{-N})$. The compactly supported example shows it in numbers. $\Theta_{g_c}(t)$ is exactly $0$ for $t\ge1$, and as $t$ decreases it is a sum of more and more terms that cancel:

| $t$ | $0.1$ | $0.05$ | $0.03$ | $0.02$ | $0.015$ | $0.01$ | $0.005$ |
| --- | --- | --- | --- | --- | --- | --- | --- |
| terms | $9$ | $19$ | $33$ | $49$ | $66$ | $99$ | $199$ |
| $\Theta_{g_c}(t)$ | $2.19$ | $-0.469$ | $-0.0361$ | $-0.00587$ | $-9.7\times10^{-5}$ | $-8.7\times10^{-6}$ | $-1.2\times10^{-9}$ |

The cancellation has a plain meaning: $t\,\Theta_{g_c}(t)$ is a Riemann sum for $\int g_c=0$ with step $t$, and Poisson summation says its error is $\sum_{k\ne0}\hat g_c(k/t)$, which is smaller than any power of $t$. The decay sets in late because $g_c$ is steep near $\pm1$, so $\hat g_c$ decays slowly at first: $\hat g_c(5)=-0.51$. By [[eq-tt-riemann-roch]] there is a mirror statement: $\Theta_{\hat g_c}(u)=u^{-1}\Theta_{g_c}(1/u)$, so the theta sum of $\hat g_c$ vanishes identically for $u\le1$, although $\hat g_c$ itself has no compact support.

### Where the operator in $g_\star$ comes from

The conditions $g(0)=0$ and $\int g=0$ are the vanishing of the residues of $Mg$ at $s=0$ and of $Mg(1)=\tfrac12\int g$. A differential operator can impose both. Integration by parts gives $M\bigl(x\tfrac{\dd}{\dd x}g\bigr)(s)=-s\,Mg(s)$, so
$$
M\Bigl(\bigl(x\tfrac{\dd}{\dd x}\bigr)\bigl(x\tfrac{\dd}{\dd x}+1\bigr)g\Bigr)(s)=s(s-1)\,Mg(s).
$$ {#eq-tt-operator}
Applied to the Gaussian this gives $g_\star$ of [[eq-tt-gstar]], with $Mg_\star(s)=\tfrac12s(s-1)\pi^{-s/2}\Gamma(s/2)$, and then $Z_{g_\star}(s)=s(s-1)\pi^{-s/2}\Gamma(s/2)\zeta(s)=2\xi(s)$. So Riemann's polynomial factor $\tfrac12s(s-1)$ in $\xi$, which cancels the poles, is the Mellin image of the operator that enforces the two conditions. The same operator applied to $\operatorname{bump}$ gives $g_c$, with $Mg_c(s)=s(s-1)M\operatorname{bump}(s)$. One can check that $\hat g_\star=g_\star$: the Fourier transform turns $x\tfrac{\dd}{\dd x}$ into $-(y\tfrac{\dd}{\dd y}+1)$, so it swaps the two factors of the operator, and $\hat g_0=g_0$.

### The weight $t^{1/2}$ and the space of rapidly decaying functions

The functional equation [[eq-tt-fe]] is symmetric about $s=\tfrac12$. Shifting by $\tfrac12$ puts the center at $0$, which is the shifted variable $z=s-\tfrac12$ used throughout Part III, with the critical line at $\Re z=0$. On the function side the shift is multiplication by $t^{1/2}$:
$$
V_g(t)=t^{1/2}\,\Theta_g(t),\qquad\int_0^\infty V_g(t)\,t^z\,\frac{\dd t}t=Z_g\!\left(z+\tfrac12\right).
$$ {#eq-tt-weighted}
With $g(0)=\hat g(0)=0$, [[eq-tt-riemann-roch]] becomes $V_g(1/t)=V_{\hat g}(t)$, and [[eq-tt-fe]] becomes $MV_g(z)=MV_{\hat g}(-z)$. For the self-dual $g_\star$, $V_{g_\star}(1/t)=V_{g_\star}(t)$: the values are $V_{g_\star}(1)=1.786788$, $V_{g_\star}(1.25)=V_{g_\star}(0.8)=1.104776$, and $V_{g_\star}(2)=V_{g_\star}(\tfrac12)=0.005487$. Its Mellin transform is $MV_{g_\star}(z)=2\xi(z+\tfrac12)$, which a direct numerical integration confirms: at $z=0$ both are $0.9942416$, at $z=0.3+2i$ both are $0.9077698+0.0253361i$, and at $z=14.134725i$, the first zero, the integral is $0$ to the working precision.

The weighted theta sums live in a space of functions that decay exponentially in $\abs{\log t}$, and the Mellin transform sends that space onto a space of entire functions.

:::: definition {#d-tt-spaces title="exponentially decaying functions and the Schwartz-Bergman space"}
$S_E(\RR_{>0})$ is the space of smooth functions $u$ on $\RR_{>0}$ such that for all integers $k,N\ge0$,
$$
\sup_{t>0}\,e^{N\abs{\log t}}\,\Bigl\lvert\bigl(t\tfrac{\dd}{\dd t}\bigr)^ku(t)\Bigr\rvert<\infty.
$$
$AS(\CC)$ is the space of entire functions $F$ such that for every $b>0$ and every $N$, $(1+\abs z)^N\abs{F(z)}$ is bounded on the vertical strip $\abs{\Re z}\le b$. The source calls $S_E$ the exponentially decaying Schwartz-Bruhat functions and $AS(\CC)$ the Schwartz-Bergman space [@masullo, p. 40 and Definition D.3.1.3]. Neither is a Hilbert space: their topologies are given by the infinitely many bounds above, which makes them fine. Chapter [[strip-topology]] replaces them by a coarser Hilbert space, and that replacement is the new idea of Route M.
::::

:::: theorem {#t-tt-mellin-iso title="The Mellin transform is a bijection from the exponentially decaying functions onto the Schwartz-Bergman space" source="masullo"}
The map $u\mapsto Mu$, $Mu(z)=\int_0^\infty u(t)t^z\,\dd t/t$, is a linear bijection from $S_E(\RR_{>0})$ onto $AS(\CC)$, continuous in both directions, with inverse $u(t)=\frac1{2\pi i}\int_{c-i\infty}^{c+i\infty}Mu(z)\,t^{-z}\,\dd z$ for any real $c$ [@masullo, Example 1.8.1.1, p. 40, and Appendix D.3].
::::

::: sketch {source="masullo" loc="Appendix D.3"}
With $t=e^v$, $u\in S_E$ means that $v\mapsto u(e^v)e^{xv}$ is a Schwartz function of $v$ for every real $x$, and $Mu(x+iy)$ is its Fourier transform in $v$. A Schwartz function has a Schwartz transform, uniformly for $x$ in a bounded interval, and $(t\tfrac{\dd}{\dd t})^ku$ goes to $(-z)^kMu$. The inverse is Mellin inversion of [[complex-toolkit]], and the line of integration can be moved freely because $Mu$ is entire and decays on strips.
:::

By [[t-tt-decay]], every $V_g$ with $g(0)=\hat g(0)=0$ lies in $S_E(\RR_{>0})$.

:::: definition {#d-tt-theta-space title="the space of weighted theta sums"}
$$
\mathcal V=\bigl\{V_g=t^{1/2}\Theta_g\ :\ g\text{ even Schwartz},\ g(0)=0,\ \textstyle\int_\RR g=0\bigr\}\subset S_E(\RR_{>0}).
$$
It is a linear subspace, the source's $\lvert\cdot\rvert^{1/2}H_{0,\mathrm{cont}}(F^\times,\mathcal S_0(\AA_F))$ for $F=\QQ$ and the trivial character [@masullo, p. 13]. It is not all of $S_E$: the next theorem says exactly which functions it contains.
::::

## Which functions are theta sums? {#s-tt-converse}

The weighted theta sum $V_{g_\star}$ has Mellin transform $2\xi(z+\tfrac12)$, which vanishes at every point $\rho-\tfrac12$ with $\rho$ a nontrivial zero of $\zeta$. Every other $V_g$ does too, because its Mellin transform contains the factor $\zeta(s)$. The converse is the first new viewpoint of Route M: vanishing at those points is the only condition.

::::: card {#t-tt-converse kind="theorem" title="A function in $S_E$ is a weighted theta sum exactly when its Mellin transform is $\xi(z+\tfrac12)$ times an entire function" source="masullo"}
:::: statement
The Mellin transform maps $\mathcal V$ onto
$$
M(\mathcal V)=\xi\!\left(z+\tfrac12\right)\mathcal O(\CC)\,\cap\,AS(\CC),
$$ {#eq-tt-converse}
where $\mathcal O(\CC)$ is the space of entire functions. In words: $u\in S_E(\RR_{>0})$ is a weighted theta sum $V_g$ if and only if $Mu(z)/\xi(z+\tfrac12)$ is entire. This is the Global Converse Theorem [@masullo, Theorem 6.3.2.1, p. 304] for $F=\QQ$ and the trivial character, combined with the Fifth Structure Theorem (p. 295). The proof below is ours, written directly over $\QQ$: it uses the same analytic input as the source's proof, horizontal segments on which $1/\zeta$ grows at most polynomially, but not the source's $S$-local spaces.
::::
:::: plain
Every theta sum has a Mellin transform that is zero at every zero of zeta, because the zeta function sits inside it as a factor. Conversely, any rapidly decaying function whose Mellin transform is zero at all those points, as often as zeta is, is a theta sum of some even function $g$. Nothing else distinguishes theta sums from other functions.
::::
:::: why
This theorem turns a question about zeros into a question about a subspace. The next card reads off from it that the quotient of all functions by the theta sums is a list of numbers, one block per zero. Every later chapter computes the trace of an operator on that quotient, and the trace is a sum over zeros only because of this theorem.
::::
:::: idea
One direction is the factorization $MV_g(z)=2\zeta(s)Mg(s)$ with $s=z+\tfrac12$: rewrite $2\zeta$ through $\xi$, and check that the leftover factor has no poles. The other direction runs backward: given $F$, divide by $2\zeta$ to get a candidate for $Mg$, check that it decays on vertical lines, and invert the Mellin transform. The only difficulty is that $1/\zeta$ is not controlled everywhere in the critical strip, and it is handled by horizontal segments on which it is.
::::
:::: proof {collapsed}
Write $s=z+\tfrac12$ throughout.

*Theta sums have the factor.* Let $V_g\in\mathcal V$. By [[eq-tt-weighted]] and [[t-tt-mellin]], $MV_g(z)=2\zeta(s)Mg(s)$, and by the definition of $\xi$,
$$
MV_g(z)=\xi(s)\,h(z),\qquad h(z)=\frac{4\,\pi^{s/2}\,Mg(s)}{s(s-1)\,\Gamma(s/2)}.
$$
We show that $h$ is entire. Because $g$ is even and smooth, its Taylor expansion at $0$ has only even powers, and splitting $\int_0^\infty$ at $1$ shows that $Mg$ is meromorphic on $\CC$ with at most simple poles at $s=0,-2,-4,\dots$, of residue $g^{(2k)}(0)/(2k)!$ at $s=-2k$. The factor $1/\Gamma(s/2)$ is entire with simple zeros exactly at $s=0,-2,-4,\dots$, so $Mg(s)/\Gamma(s/2)$ is entire. At $s=0$ the residue of $Mg$ is $g(0)=0$, so $Mg$ is regular there and $Mg(s)/\Gamma(s/2)$ vanishes at $0$, which cancels the factor $s$. At $s=1$, $Mg(1)=\int_0^\infty g=\tfrac12\int_\RR g=0$, which cancels $s-1$. So $h$ is entire, and $MV_g\in AS(\CC)$ by [[t-tt-decay]] and [[t-tt-mellin-iso]].

*Every such function is a theta sum.* Let $F\in AS(\CC)$ with $F(z)=\xi(s)h(z)$, $h$ entire. Define
$$
G(s)=\frac{F(s-\tfrac12)}{2\,\zeta(s)}=\tfrac14\,s(s-1)\,\pi^{-s/2}\,\Gamma(s/2)\,h\!\left(s-\tfrac12\right).
$$
1. *Poles.* By the second expression, $G$ is meromorphic with at most simple poles at $s=-2,-4,\dots$ (the pole of $\Gamma(s/2)$ at $0$ is canceled by $s$), it is regular at $0$, and $G(1)=0$.
2. *Decay on vertical strips.* We show that $(1+\abs s)^N\abs{G(s)}$ is bounded on every vertical strip, away from small discs around the poles. Fix $0<\delta<1$. By the first expression it suffices to bound $1/\zeta$ polynomially in $\abs{\Im s}$, since $F$ decays faster than any power. On $\Re s\ge1+\delta$, $\abs{1/\zeta(s)}\le\zeta(1+\delta)$ from the Euler product. On $\Re s\le-\delta$, write $\zeta(s)=\zeta(1-s)\cdot(\text{Gamma factors})$ by the functional equation: $\abs{1/\zeta(1-s)}\le\zeta(1+\delta)$, and Stirling's formula bounds the reciprocal of the Gamma factors by a power of $\abs{\Im s}$ for $\abs{\Im s}\ge1$, uniformly on bounded strips [@masullo, Appendix B.1]. In the band $-\delta\le\Re s\le1+\delta$ the zeros of $\zeta$ prevent any such bound everywhere, and the classical substitute is this: there are heights $T_n\to\pm\infty$, at least one in every interval of length $1$, with $\abs{1/\zeta(\sigma+iT_n)}\le C\abs{T_n}^A$ for all $\sigma$ in the band, for constants $C$ and $A$ [@titchmarsh, §9.7] [@masullo, Corollary B.6.1.8, p. 643]. Take two consecutive heights $T_n<T_{n+1}$ and the rectangle they cut from the band. $G$ is holomorphic on it, because its poles $-2,-4,\dots$ lie outside the band. On the two horizontal sides $\abs G\le\abs F\cdot C\abs{T_n}^A/2$, and on the two vertical sides the bounds of the previous sentences apply; since $T_{n+1}-T_n\le2$, every boundary point has $\abs{\Im s}$ within $2$ of $\abs{T_n}$, so $\abs G\le C_N\abs{T_n}^{A'-N}$ on the whole boundary, with $A'$ independent of $N$. By the maximum modulus principle the same bound holds inside, and $N$ is arbitrary.
3. *Inverse Mellin transform.* Define $g(t)=\frac1{2\pi i}\int_{c-i\infty}^{c+i\infty}G(s)t^{-s}\,\dd s$ for $t>0$ and any $c>0$; by step 2 the integral converges absolutely and does not depend on $c$. Moving $c$ to the right shows $g(t)=O(t^{-c})$ as $t\to\infty$ for every $c$. Moving it to the left past the poles gives an expansion $g(t)=\sum_{k=1}^{K}r_kt^{2k}+O(t^{2K+1})$ as $t\to0$, with $r_k$ the residue at $-2k$ and no constant term because $G$ is regular at $0$. The same holds for $(t\tfrac{\dd}{\dd t})^mg$, whose Mellin transform is $(-s)^mG(s)$, with the same powers $t^{2k}$. Since $t^j\tfrac{\dd^j}{\dd t^j}$ is a polynomial in $t\tfrac{\dd}{\dd t}$, the remainder $R_K=g-\sum_{k\le K}r_kt^{2k}$ satisfies $\tfrac{\dd^j}{\dd t^j}R_K(t)=O(t^{2K+1-j})$ for $j\le2K$. So the even extension of $g$ to $\RR$ is $C^{2K}$ at $0$ for every $K$, hence smooth, with $g(0)=0$; and the bounds at $\infty$ give the decay of every derivative, so $g$ is Schwartz.
4. *Conclusion.* $Mg=G$ by Mellin inversion, $\int_\RR g=2Mg(1)=2G(1)=0$, and $MV_g(z)=2\zeta(s)G(s)=F(z)$. By [[t-tt-mellin-iso]], the function with Mellin transform $F$ is $V_g\in\mathcal V$.

The source proves the general statement through its $S$-local spaces and the Asymptotic Residue Theorem along the same horizontal segments [@masullo, pp. 305 to 309].
::::
:::: example
For $g_\star$ the factor is the constant $h=2$, so $MV_{g_\star}=2\xi(z+\tfrac12)$ generates the whole image in the sense that every other image is $\xi$ times an entire function. For the compact example, $h_c(z)=4\pi^{s/2}M\operatorname{bump}(s)/\Gamma(s/2)$ with $M\operatorname{bump}(\tfrac12)=0.561542$, so $h_c(0)=0.824800$ and $MV_{g_c}(0)=\xi(\tfrac12)h_c(0)=0.410025$; a direct numerical integration of $\int_0^1t^{1/2}\Theta_{g_c}(t)\,\dd t/t$ gives $0.410025$. At $z=0.25+3i$ the formula and the integral both give $0.594810+0.185073i$. At $z=14.134725i$ the formula gives $8\times10^{-16}$, zero to the working precision, as it must.
::::
:::: used
- The divisor exact sequence, next: [[t-tt-divisor]].
- The image of $D_p$ on theta sums and the orbital quotient at $p$: [[primes-as-circles]].
- The closure of $\mathcal V$ in a Hilbert norm, which keeps only the zeros in a strip: [[strip-topology]].
::::
:::::

:::: figure {#f-tt-mellin viz="theta-mellin-zeros" height="440"}
The Mellin transform of every weighted theta sum vanishes at the points $i\gamma$ where $\zeta(\tfrac12+i\gamma)=0$; the transform of a function that is not a theta sum does not.

```vizspec
Purpose: show the converse theorem's content: theta sums are exactly the functions whose Mellin transforms vanish at the zeros of xi(z + 1/2).
Scene: left panel: the function u(t) on a log t axis in [-3, 3], gold. Right panel: |Mu(iy)| for y in [0, 50] on a logarithmic vertical scale (1e-8 to 10), drawn as a gold curve; teal vertical lines at the ordinates of the zeros of zeta, gamma = 14.134725, 21.022040, 25.010858, 30.424876, 32.935062, 37.586178, 40.918719, 43.327073, 48.005151, 49.773832; the critical line is the horizontal axis itself (label "z = iy, the critical line Re z = 0", violet).
Controls: selector for u among: "V of g_star" (Mu(z) = 2 xi(z + 1/2)), "V of g_c" (Mu(z) = 2 zeta(s) s (s - 1) M bump(s), s = z + 1/2, precomputed), "log-Gaussian" u(t) = exp(-(log t)^2 / (2 sigma^2)) / (sigma sqrt(2 pi)) with Mu(z) = exp(sigma^2 z^2 / 2) (a function that is not a theta sum), and "log-Gaussian plus V of g_star" with a slider lambda in [-2, 2] for the multiple of V_{g_star} added. Slider sigma in [0.05, 0.3] for the log-Gaussian.
Motion: switching u morphs the curves over 400 ms. For the theta sums, the right curve plunges to the floor at every teal line. For the log-Gaussian it does not. For the sum, the curve changes everywhere except at the teal lines, where its value stays equal to the log-Gaussian's value.
Readout: the values |Mu(i gamma_k)| for k = 1..5 as a small table.
Reader takeaway: vanishing at the zeros is what makes a function a theta sum; adding a theta sum to anything does not change its values at the zeros.
Data: |xi(1/2 + iy)| and |zeta(1/2 + iy) (1/4 + y^2) M bump(1/2 + iy)| on y in [0, 50] at spacing 0.02, precomputed with mpmath and shipped as float32 (about 20 KB).
```
::::

## The divisor exact sequence {#s-tt-divisor}

If membership in $\mathcal V$ is decided by values at the zeros, then the quotient $S_E/\mathcal V$ should be the list of those values. A zero of multiplicity $m$ needs more than a value: the factor $\xi$ vanishes to order $m$ there, so a function is divisible by it only if its first $m$ Taylor coefficients vanish.

:::: definition {#d-tt-jets title="the jet of a function at a zero"}
Let $\rho$ be a nontrivial zero of $\zeta$ with multiplicity $m_\rho$. The *jet* of $u\in S_E(\RR_{>0})$ at $\rho$ is the vector
$$
J_\rho(u)=\Bigl(\partial_z^{\,j}Mu\bigl(\rho-\tfrac12\bigr)\Bigr)_{0\le j<m_\rho}=\Bigl(\int_0^\infty u(t)\,t^{\rho-1/2}(\log t)^j\,\frac{\dd t}t\Bigr)_{0\le j<m_\rho}\in\CC^{m_\rho}.
$$
Each coordinate is a continuous linear functional on $S_E$, integration against $t^{\rho-1/2}(\log t)^j$. A jet is a finite list of numbers attached to one zero; it is not a function. The zeros listed in [[zeros]] are simple, and for a simple zero $J_\rho(u)$ is the single number $Mu(\rho-\tfrac12)$; nothing here assumes that every zero is simple.
::::

::::: card {#t-tt-divisor kind="theorem" title="Functions modulo theta sums are the jets of their Mellin transforms at the zeros of $\zeta$" source="masullo"}
:::: statement
The sequence
$$
0\longrightarrow\mathcal V\longrightarrow S_E(\RR_{>0})\xrightarrow{\ J\ }\prod_\rho\CC^{m_\rho},\qquad J(u)=\bigl(J_\rho(u)\bigr)_\rho,
$$ {#eq-tt-divisor}
with the product over the nontrivial zeros $\rho$ of $\zeta$, is exact: the kernel of $J$ is exactly $\mathcal V$. Every jet sequence with finitely many nonzero entries is $J(u)$ for some $u$. Hence the quotient $\mathcal H=S_E(\RR_{>0})/\mathcal V$ is identified, by $J$, with a space of jet sequences at the points $z=\rho-\tfrac12$: two functions are the same point of $\mathcal H$ exactly when they have the same jets at every zero. Under the Mellin transform the kernel statement reads: an element of $AS(\CC)$ lies in $\xi(z+\tfrac12)\mathcal O(\CC)\cap AS(\CC)$ exactly when its jets at all the points $\rho-\tfrac12$ vanish. This is the source's Fundamental Divisor Exact Sequence [@masullo, (1.8.3.2), p. 45, and p. 13] for $F=\QQ$, with the dual description of Theorem 7.1.4.2 (p. 326).
::::
:::: plain
Take any rapidly decaying function on the positive reals and forget everything about it that a theta sum could account for. What is left is a short list of numbers for each zero of zeta: the value of its Mellin transform there, and, at a multiple zero, a few derivatives. Any finite list can occur. So "all functions modulo theta sums" is a space whose coordinates are the zeros.
::::
:::: why
A trace of an operator on $\mathcal H$ is now a sum over the coordinates of $\mathcal H$, that is, over the zeros. This is how the zeros enter the trace formula of Route M. Masullo names the sequence after the algebraic-geometry sequence $0\to\mathcal O_X(-D)\to\mathcal O_X\to\mathcal O_D\to0$ for the divisor $D$ of $\xi(z+\tfrac12)$ on $X=\CC$: functions vanishing on $D$, all functions, and functions on $D$ [@masullo, p. 45]. The idea of using this quotient goes back to Connes, who worked in $L^2$ [@connes1999]; the source's version uses the spaces $S_E$ and $AS$ instead.
::::
:::: idea
Exactness in the middle is [[t-tt-converse]] read through jets: a function of $AS$ whose jets at all zeros vanish is divisible by $\xi(z+\tfrac12)$, and divisibility is what characterizes theta sums. That finitely many jets can be prescribed freely is an interpolation problem for entire functions that decay on strips.
::::
:::: proof
*$\mathcal V$ maps to $0$.* If $u=V_g$, then $Mu=\xi(z+\tfrac12)h$ with $h$ entire, and $\xi(z+\tfrac12)$ vanishes to order $m_\rho$ at $\rho-\tfrac12$, so the first $m_\rho$ derivatives of $Mu$ vanish there.

*The kernel of $J$ is $\mathcal V$.* If $J(u)=0$, then $Mu$ vanishes at each $\rho-\tfrac12$ to order at least $m_\rho$. The zeros of $\xi(z+\tfrac12)$ are exactly these points with exactly these orders, because $\xi$ is entire and its zeros are the nontrivial zeros of $\zeta$ ([[zeta-continued]]). So $h=Mu/\xi(z+\tfrac12)$ has only removable singularities and is entire, and $Mu\in AS(\CC)$ by [[t-tt-mellin-iso]]. By [[t-tt-converse]], $u\in\mathcal V$.

*Finite jet lists are attained.* Fix finitely many points $z_k=\rho_k-\tfrac12$, with multiplicities $m_k$, and a target jet at each; all other jets are to be $0$. Put $F_0(z)=\xi(z+\tfrac12)\prod_k(z-z_k)^{-m_k}e^{z^2}$. It is entire, it vanishes to full order at every other zero, and $F_0(z_k)\ne0$, so its jet at $z_k$ is invertible in the ring of jets. Hermite interpolation gives a polynomial $P$ whose jet at each $z_k$ is the target jet divided by that of $F_0$, and then $F=PF_0$ has the target jets at the $z_k$ and zero jets at every other zero. On a vertical strip $\xi$ grows at most polynomially (the Gamma factor decays and $\zeta$ grows polynomially), while $\abs{e^{(x+iy)^2}}=e^{x^2-y^2}$, so $F\in AS(\CC)$, and $u=M^{-1}F$ has the prescribed jets by [[t-tt-mellin-iso]].
::::
:::: example
Take the log-Gaussian $u_\sigma(t)=e^{-(\log t)^2/(2\sigma^2)}/(\sigma\sqrt{2\pi})$, which lies in $S_E$ and is not a theta sum. Its Mellin transform is $Mu_\sigma(z)=e^{\sigma^2z^2/2}$, so with $\sigma=0.1$ its first three coordinates in $\mathcal H$ are $Mu_\sigma(i\gamma)=e^{-\gamma^2/200}=0.36827$, $0.10974$, and $0.04382$ at $\gamma=14.134725$, $21.022040$, and $25.010858$ (and their conjugates at $-\gamma$). Adding $5V_{g_\star}$ to $u_\sigma$ changes the function by an amount comparable to its size, since $V_{g_\star}(1)=1.787$, but leaves all three numbers unchanged, because $MV_{g_\star}=2\xi(z+\tfrac12)$ vanishes at every $i\gamma$. In $\mathcal H$ the two functions are the same point.
::::
:::: used
- The convolution operator acts on $\mathcal H$ with eigenvalues $M\varphi(\rho-\tfrac12)$: [[t-tt-operator]].
- In the Hilbert completion of [[strip-topology]] the same quotient keeps only the jets at zeros with $\abs{\Re\rho-\tfrac12}<a$.
::::
:::::

::: warning
**Not every infinite list of jets occurs.** An element of $AS(\CC)$ decays faster than any power on the strip $\abs{\Re z}\le\tfrac12$, which contains every point $\rho-\tfrac12$, so the jets $J_\rho(u)$ of a single function tend to $0$ faster than any power of $\abs\gamma$. The constant sequence $1,1,1,\dots$ is not $J(u)$ for any $u$. The source writes the right end of its sequence as the full product $\prod\CC^{N(z)}$ "forgetting about the uniformly Schwartz condition" [@masullo, p. 13], and in its precise form (1.8.3.2) the right end is a quotient space with a Schauder basis whose dual basis is the jets at the zeros (p. 45).
:::

:::: figure {#f-tt-jets viz="jets-quotient" height="440"}
A function and the same function plus a theta sum look different on the line, but they have the same jets at the zeros, so they are the same point of the quotient.

```vizspec
Purpose: make the quotient S_E / T concrete: its coordinates are the values Mu(i gamma) at the zeros, and adding a theta sum does not move them.
Scene: left panel: log t axis in [-2, 2]; the gold curve u(t) = u_sigma(t / c) (log-Gaussian with center c) and, when lambda != 0, the blue curve u + lambda V_{g_star}. Right panel: ten small complex planes in a row (or a 2 x 5 grid), one for each of the first ten zeros gamma_k; in each, a teal arrow from the origin to Mu(i gamma_k) for the current u; a blue arrow for the perturbed function, drawn on top. The two arrows coincide in every panel.
Controls: slider sigma in [0.05, 0.25] (default 0.1); slider for log c in [-1, 1] (default 0), which rotates each arrow by the angle gamma_k log c; slider lambda in [-5, 5] for the multiple of V_{g_star} added (default 0); a button "add a random theta sum" that sets lambda to a random value and also adds mu V_{g_c} with a random mu, animating the change of the left curve.
Formulas: Mu(z) = c^z exp(sigma^2 z^2 / 2) for u(t) = u_sigma(t / c); the jets of V_{g_star} and V_{g_c} are exactly 0.
Motion: dragging lambda or pressing the button visibly changes the left curves while the arrows on the right stay fixed.
Readout: the moduli |Mu(i gamma_k)| for k = 1..10 (for sigma = 0.1, c = 1: 0.36827, 0.10974, 0.04382, ...).
Reader takeaway: everything about a function that a theta sum can change is invisible in the quotient; only the values at the zeros remain.
Data: the first ten zero ordinates (kit provides them).
```
::::

## Convolution acts on the quotient {#s-tt-operator}

The group $\RR_{>0}$ acts on functions by dilation, and averaging the dilations against a test function $\varphi$ gives the convolution operator of the whole route,
$$
\bigl(A(\varphi)u\bigr)(x)=\int_0^\infty\varphi(t)\,u(x/t)\,\frac{\dd t}t,
$$
for $\varphi$ smooth with compact support in $(0,\infty)$. It is multiplicative convolution, and the Mellin transform turns it into multiplication: substituting $x=ty$,
$$
M\bigl(A(\varphi)u\bigr)(z)=M\varphi(z)\,Mu(z).
$$ {#eq-tt-conv}

::::: card {#t-tt-operator kind="theorem" title="Convolution by a test function preserves theta sums and acts on the quotient with one eigenvalue $M\varphi(\rho-\tfrac12)$ for each zero, repeated $m_\rho$ times" source="masullo"}
:::: statement
Let $\varphi\in C_c^\infty((0,\infty))$.
1. $A(\varphi)$ maps $S_E(\RR_{>0})$ to itself and $\mathcal V$ to itself: $A(\varphi)V_g=V_{g_\varphi}$ with $g_\varphi(y)=\int_0^\infty\varphi(t)\,t^{-1/2}\,g(y/t)\,\dd t/t$.
2. On $\mathcal H=S_E/\mathcal V$, in the jet coordinates of [[t-tt-divisor]], $A(\varphi)$ acts on the jet at $\rho$ by the lower triangular matrix with entries $\binom ji(M\varphi)^{(j-i)}(\rho-\tfrac12)$, $0\le i\le j<m_\rho$. Its eigenvalue on that block is $M\varphi(\rho-\tfrac12)$, with multiplicity $m_\rho$.
3. $A(\varphi)$ is nuclear on $\mathcal H$, and its trace is
$$
\operatorname{Tr}\bigl(A(\varphi)\mid\mathcal H\bigr)=\sum_\rho m_\rho\,M\varphi\bigl(\rho-\tfrac12\bigr),
$$ {#eq-tt-trace}
an absolutely convergent sum over all nontrivial zeros [@masullo, (1.8.3.4), pp. 46 to 47, and Lemma B.4.4.9, p. 624].
::::
:::: plain
Smearing a function by dilations does not turn a theta sum into anything else, so the operation makes sense on functions modulo theta sums. There it acts on each zero's coordinates separately, by multiplying by the Mellin transform of the test function at that zero. Its trace is the sum of those multipliers over all zeros.
::::
:::: why
This is the spectral side of a trace formula: an operator whose eigenvalues are indexed by the zeros of $\zeta$. Connes proposed such a spectral realization of the zeros in 1999 [@connes1999]. The whole of Route M consists in computing the same trace a second time, through the primes, in a space where the answer is not just Weil's formula again.
::::
:::: idea
On the Mellin side, $A(\varphi)$ is multiplication by the entire function $M\varphi$. Multiplication by an entire function keeps the ideal of multiples of $\xi(z+\tfrac12)$, and on Taylor coefficients at a point it acts by the Leibniz rule, a triangular matrix whose diagonal is the value at that point.
::::
:::: proof
1. $M\varphi$ is entire, and on every vertical strip it decays faster than any power because $\varphi$ is smooth with compact support in $(0,\infty)$ (integrate by parts in $\log t$). So by [[eq-tt-conv]] $A(\varphi)$ maps $AS(\CC)$ to itself and multiples of $\xi(z+\tfrac12)$ to multiples of it, hence $S_E$ to $S_E$ and $\mathcal V$ to $\mathcal V$ by [[t-tt-converse]]. Directly: $A(\varphi)V_g(x)=\int\varphi(t)(x/t)^{1/2}\sum_{n\ne0}g(nx/t)\,\dd t/t=x^{1/2}\Theta_{g_\varphi}(x)$. The function $g_\varphi$ is even and Schwartz, $g_\varphi(0)=g(0)\int\varphi(t)t^{-1/2}\,\dd t/t=0$, and $\int g_\varphi=\int g\cdot\int\varphi(t)t^{1/2}\,\dd t/t=0$.
2. By the Leibniz rule, $\partial^j(M\varphi\cdot Mu)=\sum_{i\le j}\binom ji(M\varphi)^{(j-i)}(Mu)^{(i)}$, evaluated at $\rho-\tfrac12$.
3. The diagonal entries sum to the right side of [[eq-tt-trace]]. The sum converges absolutely because $M\varphi(i\gamma)$ decays faster than any power of $\gamma$ while the number of zeros up to height $T$ grows like $T\log T$ ([[zeros]]). That the operator is nuclear in the source's topology on $\mathcal H$, so that this sum is its trace, is proved in the source with Schauder bases [@masullo, p. 46 and Chapter 7].
::::
:::: used
- Weil's explicit formula as this trace in the fine topology: [[t-tt-weil]].
- The trace on the orbital quotient at $p$, which is a circle: [[primes-as-circles]].
- The same operator on the Hilbert quotient, whose trace keeps only zeros in a strip: [[strip-topology]] and [[cutting-the-kernel]].
::::
:::::

### In this topology, the trace formula is Weil's formula

How would one compute the trace [[eq-tt-trace]] without knowing the zeros? Weil's explicit formula of [[weil-positivity]] already does it: it expresses the sum over zeros through primes and an archimedean integral. In the multiplicative notation of this part, and for $\varphi(1)=0$, it reads as follows.

::::: card {#t-tt-weil kind="theorem" title="For a test function vanishing at $1$, the sum over all zeros of $M\varphi(\rho-\tfrac12)$ is given by the poles, the primes, and one archimedean integral" source="weil1952"}
:::: statement
For $\varphi\in C_c^\infty((0,\infty))$ with $\varphi(1)=0$,
$$
\sum_\rho m_\rho\,M\varphi\bigl(\rho-\tfrac12\bigr)=M\varphi\bigl(\tfrac12\bigr)+M\varphi\bigl(-\tfrac12\bigr)-\sum_{n\ge2}\frac{\Lambda(n)}{\sqrt n}\bigl(\varphi(n)+\varphi(1/n)\bigr)-\frac12\int_0^\infty\varphi(t)\,t^{1/2}\Bigl(\frac1{\abs{1-t}}+\frac1{1+t}\Bigr)\frac{\dd t}t.
$$ {#eq-tt-weil}
This is the source's idelic form of Weil's explicit formula [@masullo, Theorem B.4.4.7, p. 623] for $F=\QQ$; the specialization of its local terms to $\RR_{>0}$ is ours. The integral converges absolutely because $\varphi(1)=0$.
::::
:::: plain
The sum of the eigenvalues over all zeros can be computed without finding a single zero: it is two easy terms from the pole of zeta, minus a sum over prime powers, minus one integral that comes from the Gamma factor.
::::
:::: why
It shows what the fine topology of this chapter can and cannot do. Every jet at every zero is a continuous functional on $S_E$, so every zero contributes to the trace, and the trace formula for $A(\varphi)$ on $\mathcal H$ is Weil's formula and nothing more [@masullo, pp. 39 and 46 to 47]. To learn where the zeros are, Route M must change the topology so that some jets stop being continuous while the prime side survives intact. That is chapter [[strip-topology]].
::::
:::: idea
Integrate $M\varphi(z)$ against $\xi'/\xi(z+\tfrac12)$ around a tall rectangle. Inside, the residues are the zeros. On the boundary, write $\xi'/\xi$ as the sum of the logarithmic derivatives of its factors: the pole terms give $M\varphi(\pm\tfrac12)$, the Euler product gives the prime sum, and the Gamma factor gives the integral. The two kernels in the integral come from the two halves $t>0$ and $t<0$ of $\RR^\times$, the real completion of [[adeles]].
::::
:::: sketch {source="weil1952"}
The classical proof is Weil's [@weil1952]; the idelic version with Weil's local principal values at every place is [@masullo, Theorem B.4.4.7, p. 623]. At a prime $p$ the local term is $\log p\int_{\QQ_p^\times}\varphi(\abs x_p)\abs x_p^{1/2}/\abs{1-x}_p\,\dd^\times x$; on the shell $p^m\ZZ_p^\times$ with $m\ne0$ the integrand is $p^{-\abs m/2}\varphi(p^{-m})$, and the units contribute nothing when $\varphi(1)=0$, which gives $\log p\sum_{m\ge1}p^{-m/2}(\varphi(p^m)+\varphi(p^{-m}))$, the terms $n=p^m$ of the prime sum. At the real place, with weight $\tfrac12$, the integral over $\RR^\times$ splits into $x>0$ and $x<0$, which gives the two kernels.
::::
:::: example
Take $\varphi(t)=\operatorname{bump}\bigl((\log t-1)/0.6\bigr)$, with $\operatorname{bump}$ the bump of [[eq-tt-gc]], so that $\varphi$ is supported on $1.49<t<4.95$ and $\varphi(1)=0$. Then $M\varphi(\tfrac12)=0.442346$, $M\varphi(-\tfrac12)=0.162730$, the prime terms ($n=2,3,4$) total $0.416292$, and the integral term is $0.195324$, so the right side of [[eq-tt-weil]] is $-0.00653943$. Summing $2\Re M\varphi(i\gamma)$ over the first $200$ zeros with $\gamma>0$ (up to $\gamma=396.38$), computed with mpmath, gives $-0.00653944$. The agreement to about $10^{-8}$ checks the constants of the integral term. The individual zero terms are small ($-2.6\times10^{-5}$ for the first zero) and of both signs, and after $100$ zeros the partial sum $-0.0065396$ already agrees to five digits.
::::
:::: used
- The geometric side of the Trace Formula, which is this same right side: [[trace-formula]].
- The endgame compares the Trace Formula with this formula: [[trace-to-grh]].
::::
:::::

## What changes in general {#s-tt-general}

For a number field $F$ and a Schwartz-Bruhat function $f$ on $\AA_F$, the global theta function is $\Phi_F(f)(g)=\sum_{\xi\in F^\times}f(\xi g)$ on $C_F$, and the adelic Riemann-Roch identity reads $\Phi_F(f)(g)=\abs g^{-1}\Phi_F(\hat f)(g^{-1})+\abs g^{-1}\hat f(0)-f(0)$ [@masullo, Theorem 2.2.3.2, p. 82]. Its Mellin transform along a character $\chi\abs\cdot^s$ of $C_F$ is Tate's zeta integral $Z(f,\chi\abs\cdot^s)$, which is the Hecke L-function $L(s,\chi)$ times an entire factor [@masullo, Theorem 3.2.2.1, p. 124]. Functions on $C_F$ split into isotypes, one for each character of the compact group $C_F^1$, and each isotype is studied separately.

Three points need more care than over $\QQ$. First, the class group of $F$ may be nontrivial, so the source enlarges the finite set of places $S$ until the ring of $S$-integers has class number one, and then every theta function of a given isotype is $\Phi_F(f_S\otimes\bigotimes_{v\notin S}\mathbf 1_{\mathcal O_{F_v}})$ [@masullo, Theorem 6.2.1.1, p. 295]. Its $S$-local version sums over the $S$-units instead of $F^\times$; over $\QQ$ with $S=\{\infty\}$ the $S$-units are $\pm1$, and the $S$-local theta function of $f_\infty$ is just $f_\infty(t)+f_\infty(-t)$ [@masullo, p. 12]. Second, the converse theorem has the factor $L(s,\chi)$ for a nontrivial isotype and $(s+it_0)(1-s-it_0)L(s,\chi)$ for the trivial one, and the divisor exact sequence becomes jets at the zeros of $L(z+\tfrac12,\chi)$ [@masullo, Theorem 6.3.2.1, p. 304]. Third, $D_p$ becomes $\mathrm{PV}_v$ at a place $v$, with Mellin factor $1-\chi(\mathfrak p_v)q_v^{-s}$ in place of $1-p^{-s}$ [@masullo, (1.8.1.2), p. 39].

::: recap
You now have the following, and where each is used.

- The theta sum $\Theta_g(t)=\sum_{n\ne0}g(nt)$ of an even Schwartz $g$, which is the adelic theta function of $g\otimes\bigotimes_p\mathbf 1_{\ZZ_p}$ ([[d-tt-theta-sum]], [[eq-tt-adelic-theta]]); over $\QQ$ every theta function with trivial character is of this form.
- Its symmetry, adelic Riemann-Roch equals Poisson summation ([[t-tt-riemann-roch]]), its Mellin transform $2\zeta(s)Mg(s)$ ([[t-tt-mellin]]), and the functional equation $Z_g(s)=Z_{\hat g}(1-s)$ ([[t-tt-functional-equation]]).
- The operator $D_p$, which deletes the multiples of $p$ and multiplies the Mellin transform by $1-p^{-s}$ ([[t-tt-dp]]): the orbital quotients of [[primes-as-circles]] and the sieve of [[cutting-the-kernel]].
- The conditions $g(0)=0$ and $\int g=0$, the decay $e^{-N\abs{\log t}}$ they give, and the space $S_E(\RR_{>0})$ with its Mellin image $AS(\CC)$ ([[t-tt-decay]], [[t-tt-mellin-iso]]).
- The converse theorem: Mellin transforms of weighted theta sums are exactly $\xi(z+\tfrac12)$ times entire functions in $AS(\CC)$ ([[t-tt-converse]]).
- The divisor exact sequence: functions modulo theta sums are jets at the points $\rho-\tfrac12$ ([[t-tt-divisor]]): the spectral side in [[strip-topology]].
- The operator $A(\varphi)$ on the quotient, with eigenvalues $M\varphi(\rho-\tfrac12)$ and trace $\sum_\rho m_\rho M\varphi(\rho-\tfrac12)$ ([[t-tt-operator]]), and the fact that in this fine topology the trace formula is Weil's explicit formula ([[t-tt-weil]]): the reason [[strip-topology]] changes the topology.
:::
