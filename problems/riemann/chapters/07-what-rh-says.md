---
id: what-rh-says
title: What the hypothesis says about primes, and its generalizations
part: 1
summary: Read the hypothesis as the statement that the primes fluctuate as little as they can, see the same statement for sums with a smooth cutoff, and meet the versions for Dirichlet characters, number fields, and Hecke characters.
needs: [explicit-formula]
---

:::: plain
The position of the zeros of the zeta function decides how far the primes can stray from their smooth average. If the zeros sit on the center line, the staircase of primes stays within about the square root of its height of the line it follows, which is exactly the size of the wobble of a long run of fair coin flips. The same statement is believed for the families of zeta-like functions attached to arithmetic progressions and to other number systems, and the Riemann Hypothesis is the first rung of that ladder.
::::

Chapter [[explicit-formula]] showed that every zero contributes a wave to the count of primes, with amplitude $x^\beta$ for a zero of real part $\beta$. This chapter turns that observation into two theorems, one saying that the largest real part of a zero fixes the size of the error exactly, and the other saying what the error is when every zero lies on the critical line. It then explains why the square root is the natural size, tests this on real numbers, introduces a smoothed version of the sum that Part IV will use, lists equivalent statements, and follows the same pattern into the Dirichlet characters, the number fields, and the Hecke characters. It is the logical center of Part I because it says what the hypothesis is for, and the later parts of the page are about how it is proved.

## The size of the error is decided by the farthest zero {#s-rh-theta}

The explicit formula expresses the error $\psi(x)-x$ as a sum of waves, and the loudest wave is the one with the largest real part. Write $\Theta$ for the supremum of the real parts $\beta$ of the nontrivial zeros. We know three things about it already. It is at most 1, since every zero lies in the open strip. It is at least $\tfrac12$, since zeros come in pairs $\rho$ and $1-\bar\rho$ and so at least one of $\beta$ and $1-\beta$ is at least $\tfrac12$. And the hypothesis is the statement $\Theta=\tfrac12$. The theorem below says that $\Theta$ is exactly the exponent of the error, in both directions.

::::: card {#t-rh-theta kind="theorem" title="The error in the count of primes has exponent exactly $\Theta$, the largest real part of a zero" source="ingham-prime"}
:::: statement
Let $\Theta$ be the supremum of the real parts of the nontrivial zeros of $\zeta$. Then $\tfrac12\le\Theta\le1$ and
$$
\psi(x)=x+O\bigl(x^{\Theta}\log^2x\bigr).
$$ {#eq-rh-theta-bound}
Conversely, if $\psi(x)=x+O(x^{\alpha})$ for some $\alpha<1$, then every nontrivial zero has real part at most $\alpha$. Hence $\Theta$ is the infimum of all exponents $\alpha$ with $\psi(x)-x=O(x^{\alpha})$, and no exponent below $\tfrac12$ is possible.
::::
:::: plain
How big the zeros' real parts can be is exactly how big the error in counting primes can be. A zero at real part $0.7$ would rule out every bound of the form $x^{\alpha}$ with $\alpha<0.7$, and conversely an error bounded by $x^{0.6}$ would push every zero to the left of $0.6$. Because the symmetry of the zeros never allows $\Theta<\tfrac12$, the exponent $\tfrac12$ is the best that can ever be true.
::::
:::: why
This is the dictionary between the two sides of the page. It says that the arithmetic question, how regularly the primes are distributed, and the analytic question, where the zeros sit, are the same question, so that proving the hypothesis is proving that the primes are as regular as the functional equation allows.
::::
:::: idea
For the bound, apply the truncated explicit formula and replace every $x^\beta$ by $x^\Theta$, which leaves a sum of $1/\lvert\rho\rvert$ that is only $\log^2$ large. For the converse, $-\zeta'/\zeta(s)$ equals a Mellin transform of $\psi(x)-x$ plus an explicit term, and a Mellin transform of something of size $x^\alpha$ is analytic to the right of $\alpha$, which leaves no room for the poles that zeros create.
::::
:::: proof {collapsed}
*The bound.* First we bound $\sum_{\lvert\gamma\rvert\le T}1/\lvert\rho\rvert$. Since $\lvert\rho\rvert\ge\gamma$ and the zeros with $\gamma<0$ are conjugates of those with $\gamma>0$, the sum is at most $2\sum_{0<\gamma\le T}1/\gamma$. By partial summation against $N(t)$, this equals $2\bigl(N(T)/T+\int_{14}^{T}N(t)\,\dd t/t^2\bigr)$, and chapter [[zeros]] gives $N(t)\ll t\log t$, so the sum is $\ll\log T+\int_{14}^T\frac{\log t}{t}\,\dd t\ll\log^2T$. Next take $T=x$ in the truncated formula of [[t-ef-von-mangoldt]]. Each term has $\lvert x^\rho\rvert=x^\beta\le x^\Theta$, so for $x\ge2$
$$
\lvert\psi(x)-x\rvert\le x^\Theta\sum_{\lvert\gamma\rvert\le x}\frac1{\lvert\rho\rvert}+C\Bigl(\frac xx\log^2(x^2)+\log x\Bigr)\ \ll\ x^\Theta\log^2x,
$$
where the last step uses $x^\Theta\ge1$.

*The converse.* For $\sigma>1$ partial summation gives $-\frac{\zeta'}{\zeta}(s)=\sum_n\Lambda(n)n^{-s}=s\int_1^\infty\psi(x)x^{-s-1}\,\dd x$, and $\frac{s}{s-1}=s\int_1^\infty x\cdot x^{-s-1}\,\dd x$. Subtracting,
$$
-\frac{\zeta'}{\zeta}(s)-\frac{s}{s-1}=s\int_1^\infty\bigl(\psi(x)-x\bigr)x^{-s-1}\,\dd x\qquad(\sigma>1).
$$ {#eq-rh-mellin}
If $\lvert\psi(x)-x\rvert\le Cx^\alpha$, the integrand is at most $Cx^{\alpha-\sigma-1}$, so the integral on the right converges absolutely and defines an analytic function for every $\sigma>\alpha$. The left side is meromorphic on the plane and agrees with the right side for $\sigma>1$, so by uniqueness of continuation the left side is analytic on $\sigma>\alpha$; its pole at $s=1$ has been subtracted. But $\zeta'/\zeta$ has a pole at every zero of $\zeta$, so no zero has $\beta>\alpha$.

*The range.* If $\alpha<\tfrac12$ were admissible, every zero would have $\beta\le\alpha<\tfrac12$, which contradicts the existence of a zero with $\beta\ge\tfrac12$ (take any $\rho$, and use $\rho$ or $1-\bar\rho$). Combining the bound with the converse, $\Theta=\inf\{\alpha:\psi(x)-x=O(x^\alpha)\}$ because $x^\Theta\log^2x=O(x^{\Theta+\varepsilon})$ for each $\varepsilon>0$.
::::
:::: example
At $x=10^6$ a hypothetical $\Theta=0.6$ would allow errors of size $x^{0.6}=3981$, which is $3.98$ times $\sqrt x=1000$, while the actual error is $\psi(10^6)-10^6=-413.4$, which is $0.41\sqrt x$. A single value of $x$ cannot test a statement about exponents, but at this height the data sit comfortably at the exponent $\tfrac12$.
::::
:::: used
The next section specializes to $\Theta=\tfrac12$, and chapter [[weil-positivity]] reformulates the statement $\Theta=\tfrac12$ as the nonnegativity of a quadratic form.
::::
:::::

## The hypothesis as square-root cancellation {#s-rh-sqrt}

Setting $\Theta=\tfrac12$ gives the statement that is usually called the hypothesis in its arithmetic form. It was proved equivalent to Riemann's statement about zeros by von Koch in 1901 [@vonkoch1901].

::::: card {#t-rh-von-koch kind="theorem" title="The Riemann Hypothesis is equivalent to $\pi(x)=\Li(x)+O(\sqrt x\log x)$" source="vonkoch1901"}
:::: statement
The following three statements are equivalent.

1. Every nontrivial zero of $\zeta$ has real part $\tfrac12$.
2. $\psi(x)=x+O\bigl(\sqrt x\log^2x\bigr)$.
3. $\pi(x)=\mathrm{Li}(x)+O\bigl(\sqrt x\log x\bigr)$.

Under these statements, Schoenfeld showed that explicit constants are possible, namely $\lvert\psi(x)-x\rvert<\frac{\sqrt x\log^2x}{8\pi}$ for $x\ge74$ and $\lvert\pi(x)-\operatorname{li}(x)\rvert<\frac{\sqrt x\log x}{8\pi}$ for $x\ge2657$, where $\operatorname{li}(x)=\mathrm{Li}(x)+\operatorname{li}(2)$ with $\operatorname{li}(2)=1.0452$ [@schoenfeld1976-chebyshev].
::::
:::: plain
The count of primes up to $x$ differs from the smooth estimate $\mathrm{Li}(x)$ by no more than a constant times $\sqrt x\log x$ exactly when the zeros are on the line.
::::
:::: why
This is the form of the hypothesis that can be checked directly against a table of primes, and it is the form in which the hypothesis is most often quoted.
::::
:::: idea
Statements 1 and 2 are the two halves of the previous theorem with $\Theta=\tfrac12$. Statements 2 and 3 are the same information at the two weights, $\Lambda(n)$ and the indicator of primes, and move into each other by partial summation, which divides or multiplies by $\log t$.
::::
:::: proof {collapsed}
*1 and 2.* If every zero has $\beta=\tfrac12$ then $\Theta=\tfrac12$ and the previous theorem gives 2. If 2 holds then $\psi(x)=x+O(x^{1/2+\varepsilon})$ for each $\varepsilon>0$, so the converse in the previous theorem gives $\Theta\le\tfrac12+\varepsilon$ for each $\varepsilon$, hence $\Theta\le\tfrac12$, and together with $\Theta\ge\tfrac12$ and the symmetry $\rho\mapsto1-\bar\rho$ every zero has $\beta=\tfrac12$.

*2 and 3.* Let $\vartheta(x)=\sum_{p\le x}\log p$. Since $\psi(x)-\vartheta(x)=\sum_{k\ge2}\vartheta(x^{1/k})$ and Chebyshev's bound $\vartheta(y)\le Cy$ gives $\vartheta(x^{1/2})\le C\sqrt x$ and $\vartheta(x^{1/k})\le Cx^{1/3}$ for $k\ge3$ with at most $\log_2x$ values of $k$, we get $\psi(x)-\vartheta(x)=O(\sqrt x)$. Now assume 2, so $\vartheta(x)=x+O(\sqrt x\log^2x)$. Then
$$
\pi(x)=\int_{2^-}^x\frac{\dd\vartheta(t)}{\log t}=\frac{\vartheta(x)}{\log x}+\int_2^x\frac{\vartheta(t)}{t\log^2t}\,\dd t.
$$
Write $\vartheta(t)=t+E(t)$ with $E(t)=O(\sqrt t\log^2t)$. The terms in $t$ give $\frac{x}{\log x}+\int_2^x\frac{\dd t}{\log^2t}$, and since $\int_2^x\frac{\dd t}{\log^2t}=\mathrm{Li}(x)-\frac{x}{\log x}+\frac{2}{\log2}$ (integrate $\int\dd t/\log t$ by parts), these add to $\mathrm{Li}(x)+O(1)$. The error terms give $O(\sqrt x\log x)$ from $E(x)/\log x$ and $\int_2^xO(t^{-1/2})\,\dd t=O(\sqrt x)$, so $\pi(x)=\mathrm{Li}(x)+O(\sqrt x\log x)$, which is 3. Conversely assume 3 and write $\pi(t)=\mathrm{Li}(t)+F(t)$ with $F(t)=O(\sqrt t\log t)$. Partial summation the other way gives $\vartheta(x)=\pi(x)\log x-\int_2^x\frac{\pi(t)}{t}\,\dd t$, and since $\int_2^x\log t\,\dd\mathrm{Li}(t)=x-2$ we get $\vartheta(x)=x-2+F(x)\log x-\int_2^x\frac{F(t)}{t}\,\dd t=x+O(\sqrt x\log^2x)$. Adding $\psi-\vartheta=O(\sqrt x)$ gives 2.
::::
:::: example
The bound can be tested against the sieve. At $x=10^6$ there are $\pi(10^6)=78498$ primes, $\mathrm{Li}(10^6)=78626.50$, and the error is $-128.50$. Against the scale $\sqrt x\log x=13816$ this is $0.0093$. Schoenfeld's bound uses $\operatorname{li}$, and $\pi(10^6)-\operatorname{li}(10^6)=-129.55$ is $0.24$ of the allowed amount $\sqrt x\log x/(8\pi)=549.7$. For $\psi$, a sieve to $10^7$ shows that $\lvert\psi(x)-x\rvert$ is below Schoenfeld's bound at every integer $x$ from 74 to $10^7$, and the largest ratio to the bound is $0.804$, reached at $x=96$.
::::
:::: used
Section [[s-rh-coin]] explains why the exponent $\tfrac12$ is natural, and the Dirichlet-character version later in this chapter repeats statement 2 for primes in arithmetic progressions.
::::
:::::

The table below shows how the three quantities that RH controls behave at powers of ten. The columns give the error $\psi(x)-x$ with its size relative to $\sqrt x$, the error $\pi(x)-\mathrm{Li}(x)$, and the Mertens function $M(x)=\sum_{n\le x}\mu(n)$ that we meet in the next section. Every number was computed by a sieve up to $10^7$.

| $x$ | $\psi(x)-x$ | $(\psi(x)-x)/\sqrt x$ | $\pi(x)-\mathrm{Li}(x)$ | $M(x)$ | $M(x)/\sqrt x$ |
| --- | --- | --- | --- | --- | --- |
| $10$ | $-2.17$ | $-0.686$ | $-1.12$ | $-1$ | $-0.316$ |
| $10^2$ | $-5.95$ | $-0.595$ | $-4.08$ | $1$ | $0.100$ |
| $10^3$ | $-3.32$ | $-0.105$ | $-8.56$ | $2$ | $0.063$ |
| $10^4$ | $13.40$ | $0.134$ | $-16.09$ | $-23$ | $-0.230$ |
| $10^5$ | $51.56$ | $0.163$ | $-36.76$ | $-48$ | $-0.152$ |
| $10^6$ | $-413.40$ | $-0.413$ | $-128.50$ | $212$ | $0.212$ |
| $10^7$ | $-1460.60$ | $-0.462$ | $-338.36$ | $1037$ | $0.328$ |

The relative error $(\psi(x)-x)/\sqrt x$ stays between $-0.69$ and $0.16$ in the table. At the integers $2\le x\le10^7$ its largest absolute value is $0.924$, at $x=2$, and for $x\ge100$ it never exceeds $0.777$, which happens at $x=1422$. (Between integers it can be a little larger, just before a jump: it reaches $1.33$ just below $x=3$ and $0.80$ just below the prime $1423$.) So in this range the factor $\log^2x$ that the theorem allows, which is about $260$ at $x=10^7$, is never used, and the error stays within one $\sqrt x$ of the line. The data therefore suggest that the proved bound is not sharp in its logarithms, which is consistent with the theorem, because the converse pins down only the exponent and the logarithms enter through the method of proof.

::::: figure {#f-rh-band viz="error-band" height="460"}
Measured in units of $\sqrt x$, the error of the prime count wanders in a band of width about one, like a sum of fair coin flips, and stays far inside the envelope the theorem allows.

```vizspec
Purpose: show the normalized errors (psi(x)-x)/sqrt(x) and M(x)/sqrt(x) next to a coin-flip random walk, and the proved envelope.
Scene: horizontal axis log10 x from 1 to 6 (x up to 10^6, sieved by the kit on load), vertical axis from -3 to 3
  in units of sqrt(x). Draw (psi(x)-x)/sqrt(x) at every integer x in gold (decimated to about 3000 points
  with min/max per pixel column so jumps stay visible). Draw horizontal guide lines at +-1 in muted gray.
  Draw Schoenfeld's envelope +-log^2(x)/(8 pi) as two red dashed curves (clipped by the frame, so it leaves the
  frame near log10 x = 3.8). Optional second curve: M(x)/sqrt(x) in teal.
Controls: toggle "M(x)/sqrt(x)"; a button "new coin walk" that draws S_N/sqrt(N) in violet for N up to 10^6 from a
  seeded pseudo-random fair +-1 sequence (seed changes with each press); a slider for the plot window
  [log10 x_min, log10 x_max]; a hover readout of x, psi(x)-x, pi(x)-Li(x), M(x).
Motion: the coin walk is drawn growing from left to right at about 2 decades per second the first time it is
  requested; pressing again swaps in a new seed.
Reader takeaway: the primes' error and the coin walk live in the same band, order one in units of sqrt(x), and
  neither comes near the envelope.
Data: primes, psi, Li (kit provides them), Moebius function from the same sieve.
```
:::::

## Why the square root is the natural size {#s-rh-coin}

The exponent $\tfrac12$ is forced from below by the functional equation, but nothing so far says why anyone should expect the hypothesis to give exactly that. The reason is the behavior of random sums. If $\varepsilon_1,\dots,\varepsilon_N$ are independent fair coins with values $\pm1$, then $S_N=\sum\varepsilon_i$ has mean 0 and variance $N$, so its typical size is $\sqrt N$, and a deviation of three standard deviations has probability about $0.27\%$. A sum of $N$ terms of size 1 could be as large as $N$, but when the signs are unrelated almost all of it cancels and only the square root of the number of terms survives, which is called **square-root cancellation**.

The Möbius function gives the cleanest bridge from this idea to the zeta function. Recall that $\mu(n)$ is $0$ if $n$ has a repeated prime factor and otherwise $(-1)^k$ if $n$ is a product of $k$ distinct primes, and that $\sum_n\mu(n)n^{-s}=1/\zeta(s)$. The partial sums $M(x)=\sum_{n\le x}\mu(n)$ behave like a random walk if the signs of $\mu$ are unrelated to each other, in which case $M(x)$ would be of size $\sqrt{x}$ up to a constant. About $6/\pi^2=61\%$ of the integers are squarefree, so the model walk has standard deviation $\sqrt{0.61x}=0.78\sqrt x$. The table gives $M(x)/\sqrt x=-0.316$, $0.100$, $0.063$, $-0.230$, $-0.152$, $0.212$, and $0.328$, all within half a standard deviation of the model, so the data look like coin flips. For $x\ge100$ the largest value of $\lvert M(x)\rvert/\sqrt x$ up to $10^7$ is $0.567$, at $x=199$.

The link to the hypothesis is the following theorem of Littlewood from 1912 [@littlewood1912-quelques]. The hypothesis holds exactly when $M(x)=O(x^{1/2+\varepsilon})$ for every $\varepsilon>0$, which is again a statement about the zeros, because the Mellin transform of $M(x)$ is $1/(s\zeta(s))$ and $1/\zeta$ has poles at the zeros. The direction from the bound on $M$ to the zeros is the same argument as the converse above. If $M(x)=O(x^{\alpha})$ then $1/\zeta(s)=s\int_1^\infty M(x)x^{-s-1}\,\dd x$ is analytic for $\sigma>\alpha$, which leaves no room for a zero there.

:::: warning
Square-root cancellation is a heuristic that explains why $\tfrac12$ is the natural exponent, and it proves nothing, because the signs of $\mu(n)$ are not independent coins and share structure through common divisors. The conjecture of Mertens that $\lvert M(x)\rvert<\sqrt x$ for all $x>1$ was disproved by Odlyzko and te Riele in 1985 [@odlyzko1985-mertens], although every counterexample lies far beyond the range of the table, where $\lvert M(x)\rvert/\sqrt x$ stays below $0.9$. The coin model therefore captures the exponent and not the constant.
::::

The explicit formula says which conspiracy would break the square root. A wave $x^\beta\cos(\gamma\log x-\cdots)$ with $\beta>\tfrac12$ would be a systematic pattern in the primes whose strength grows faster than random noise, and a zero off the line is exactly such a pattern, so the hypothesis says that the primes hide no structure of that size.

## Smoothing the sum {#s-rh-smooth}

The sharp cutoff in $\psi(x)=\sum_{n\le x}\Lambda(n)$ makes the zero sum only conditionally convergent, because a jump needs infinitely many waves to build. Smoothing the cutoff turns jumps into kinks and lets the waves have faster decaying amplitudes. The simplest smoothing replaces the weight $1_{n\le X}$ by the continuous weight $(X/n-1)_+$, which vanishes for $n\ge X$ and grows linearly as $n$ decreases.

:::: definition {#d-rh-smoothed title="The smoothed sum"}
For real $X>1$ the **smoothed sum** is
$$
S(X)=\sum_{n\le X}\Lambda(n)\Bigl(\frac Xn-1\Bigr).
$$ {#eq-rh-smoothed}
It is a continuous, increasing, piecewise linear function of $X$ with slope $\sum_{n\le X}\Lambda(n)/n$ between prime powers, so it has no jumps. It is not the same as $\psi(X)$, and the two are related by $S(X)=X\int_1^X\psi(u)u^{-2}\,\dd u$, so $S(X)/X$ is the integral of $\psi(u)/u$ against the measure $\dd u/u$ on $[1,X]$.
::::

The relation to $\psi$ follows from $\frac{X}{n}-1=\int_n^X\frac{X}{u^2}\,\dd u$ for $n\le X$, and then exchanging the sum and the integral. As a check, $S(10)=\Lambda(2)\cdot4+\Lambda(3)\cdot\tfrac73+\Lambda(4)\cdot\tfrac32+\Lambda(5)\cdot1+\Lambda(7)\cdot\tfrac37+\Lambda(8)\cdot\tfrac14+\Lambda(9)\cdot\tfrac19$, which equals $9.114492$. The kernel behind the smoothing is $\frac1{2\pi i}\int_{(c)}y^s\frac{\dd s}{s(s-1)}$ for $c>1$, which equals $(y-1)_+$ and decays like $\lvert s\rvert^{-2}$ instead of $\lvert s\rvert^{-1}$, so that the new integral converges absolutely. To see the value, shift the contour as in section [[s-ef-perron]]. For $y>1$ shift left and collect the residues $y$ at $s=1$ and $-1$ at $s=0$, giving $y-1$, and for $y<1$ shift right and collect nothing.

::::: card {#t-rh-smooth kind="theorem" title="The smoothed prime sum equals $X\log X-(1+\gamma_E)X+\log2\pi$ minus an absolutely convergent sum over zeros" source="vonmangoldt1895-formula"}
:::: statement
For every real $X>1$,
$$
S(X)=X\log X-(1+\gamma_E)X+\log2\pi-\sum_\rho\frac{X^\rho}{\rho(\rho-1)}-\sum_{k\ge1}\frac{X^{-2k}}{2k(2k+1)},
$$ {#eq-rh-smoothed-formula}
where $\gamma_E=0.5772\ldots$ is Euler's constant, and the sum over the nontrivial zeros $\rho$ converges absolutely, so its order does not matter. Consequently $S(X)=X\log X-(1+\gamma_E)X+O(X^{\Theta})$ with no logarithmic factor, and if every zero has real part $\tfrac12$ then $\rho(\rho-1)=-\lvert\rho\rvert^2$ and
$$
\Bigl\lvert\sum_\rho\frac{X^\rho}{\rho(\rho-1)}\Bigr\rvert\le c_0\sqrt X,\qquad c_0=\sum_\rho\frac1{\lvert\rho\rvert^{2}}=2+\gamma_E-\log4\pi=0.0461914\ldots
$$ {#eq-rh-zero-sum-bound}
::::
:::: plain
Replace the sharp cutoff by a gentle ramp and the staircase of primes becomes a smooth curve with an explicit main term. The correction is a sum over zeros whose terms shrink like $1/\lvert\rho\rvert^2$, so the sum converges absolutely and is controlled by one number, $0.0462$, times $\sqrt X$.
::::
:::: why
Every difficulty in the sum over zeros of chapter [[explicit-formula]] came from the slowly decaying weights $1/\rho$. With the weights $1/(\rho(\rho-1))$ the sum can be bounded and differentiated term by term, which is the control that positivity arguments need.
::::
:::: idea
Repeat the previous chapter with the kernel $1/(s(s-1))$ in place of $1/s$. The weights $1/\rho$ become $1/(\rho(\rho-1))$, and the pole at $s=1$ becomes double, which turns the main term $x$ into $X\log X-(1+\gamma_E)X$. The same formula also follows by integrating von Mangoldt's formula against $X\,\dd u/u^2$ from $1$ to $X$, and that route checks the constant: the terms $-\log2\pi$, $\sum_\rho1/(\rho(\rho-1))=-2\sum_\rho1/\rho=-0.0461914$, and $\sum_k1/(2k(2k+1))=1-\log2=0.3068528$ each contribute their value times $X$, and they add up to $-1.5772157=-(1+\gamma_E)$, the coefficient of $X$.
::::
:::: proof {collapsed}
For $c>1$ and $X>1$, the kernel identity above together with absolute convergence of $\sum_n\Lambda(n)n^{-c}$ gives
$$
S(X)=\frac1{2\pi i}\int_{(c)}\Bigl(-\frac{\zeta'}{\zeta}(s)\Bigr)\frac{X^s}{s(s-1)}\,\dd s ,
$$
an absolutely convergent integral because $\lvert s(s-1)\rvert^{-1}\ll\lvert t\rvert^{-2}$. Let $F(s)=-\frac{\zeta'}{\zeta}(s)\frac{X^s}{s(s-1)}$. We shift the line to $\sigma=-U$ with $U$ odd and large, collecting the residues of $F$.

::: steps
1. At $s=1$ there is a double pole, because $-\zeta'/\zeta$ has a simple pole with Laurent expansion $\frac1{s-1}-\gamma_E+O(s-1)$ and the kernel has another factor $\frac1{s-1}$. The residue is the derivative of $g(s)=X^s/s$ at $s=1$ plus $-\gamma_E$ times $g(1)$, that is $X\log X-X-\gamma_EX=X(\log X-1-\gamma_E)$.
2. At each nontrivial zero $\rho$ the residue of $-\zeta'/\zeta$ is $-m$ for multiplicity $m$, so the contribution is $-m\,X^\rho/(\rho(\rho-1))$.
3. At $s=0$ the kernel has a simple pole with residue $\frac{X^0}{0-1}=-1$ and $-\zeta'/\zeta(0)=-\log2\pi$ is finite, so the contribution is $+\log2\pi$.
4. At each trivial zero $s=-2k$ the residue of $-\zeta'/\zeta$ is $-1$ and the kernel equals $\frac{X^{-2k}}{(-2k)(-2k-1)}=\frac{X^{-2k}}{2k(2k+1)}$, so the contribution is $-\frac{X^{-2k}}{2k(2k+1)}$.
:::

Summing the four contributions gives the right side of [[eq-rh-smoothed-formula]]. It remains to show that the integrals over the horizontal sides and over the left side vanish in the limit. On the horizontal sides at heights $\pm T$, chosen as in chapter [[explicit-formula]] so that $\lvert\zeta'/\zeta\rvert\ll\log^2T$ there (and by the functional equation the same bound holds to the left of $\sigma=-1$), the integrand is at most $X^\sigma\log^2T/T^2$ in size, and $\int_{-\infty}^cX^\sigma\,\dd\sigma=X^c/\log X$, so the contribution tends to 0 as $T\to\infty$. On the left side, $\lvert X^s\rvert=X^{-U}$ and $\zeta'/\zeta$ grows at most like $\log(U+\lvert t\rvert)$ by the functional equation, so that side tends to 0 as $U\to\infty$ because $X>1$. The sum over $\rho$ converges absolutely because $\lvert\rho(\rho-1)\rvert\ge\lvert\rho\rvert^2/2$ and $\sum_\rho\lvert\rho\rvert^{-2}<\infty$ by the zero count of chapter [[zeros]], and the bound by $X^\Theta$ follows from $\lvert X^\rho\rvert\le X^\Theta$.

When every $\beta=\tfrac12$, we have $\rho(\rho-1)=-\rho(1-\rho)=-\rho\bar\rho=-\lvert\rho\rvert^2$ because $1-\rho=\bar\rho$ on the critical line. Since also $\Re(1/\rho)=\beta/\lvert\rho\rvert^2=1/(2\lvert\rho\rvert^2)$, we get $\sum_\rho\lvert\rho\rvert^{-2}=2\sum_\rho\Re(1/\rho)=2\sum_\rho1/\rho=2\bigl(1+\tfrac{\gamma_E}{2}-\tfrac12\log4\pi\bigr)=2+\gamma_E-\log4\pi$ by [[eq-ze-sum-inv-rho]].
::::
:::: example
We test [[eq-rh-smoothed-formula]] with the first $N$ zero pairs. The table gives the exact $S(X)$ and the error (formula minus truth) when the sum over zeros is cut after $N$ pairs. For $N=0$ the formula keeps only the main term and the trivial-zero sum.

| $X$ | $S(X)$ | error, $N=0$ | $N=10$ | $N=100$ | $N=1000$ | $c_0\sqrt X$ |
| --- | --- | --- | --- | --- | --- | --- |
| 10 | 9.114492 | $-0.0246$ | $+0.0039$ | $+0.000025$ | $+0.0000036$ | 0.146 |
| 50 | 118.619882 | $-0.0417$ | $-0.0102$ | $-0.00053$ | $-0.0000047$ | 0.327 |
| 100 | 304.517139 | $+0.1162$ | $-0.0015$ | $-0.0030$ | $-0.000063$ | 0.462 |
| 1000 | 5332.070527 | $+0.3070$ | $-0.0456$ | $-0.0029$ | $+0.0003$ | 1.461 |

At $X=1000$ the main term with the constant, $X\log X-(1+\gamma_E)X+\log2\pi$, is $5332.3775$ against the truth $5332.0705$, and the whole zero sum is only $0.307$ in size, comfortably below the bound $c_0\sqrt X=1.46$ of [[eq-rh-zero-sum-bound]]. Ten pairs of zeros bring the error down to $0.05$ and a hundred to $0.003$, which is far faster than for $\psi$ in the previous chapter, where a thousand pairs still left errors of $0.005$ at $x=10$ and $0.034$ at $x=100$. The constant $c_0=0.0461914$ is consistent with the zeros as well, since the 1000 zero pairs below height $1419$ already give $\sum\lvert\rho\rvert^{-2}=0.04475$, and the tail adds about $0.0014$.
::::
:::: used
Chapter [[weil-positivity]] generalizes the smoothing from the kernel $(y-1)_+$ to an arbitrary test function, and Part IV works with this particular sum. The bound [[eq-rh-zero-sum-bound]] shows that under the hypothesis the smoothed sum is an almost periodic function of $\log X$ with a controlled constant.
::::
:::::

The Mellin argument of the previous theorem also works for $S$ and gives an equivalent form of the hypothesis without logarithms. Since $\int_1^\infty S(X)X^{-s-1}\,\dd X=-\frac{\zeta'}{\zeta}(s)/(s(s-1))$ for $\sigma>1$, the transform of the main term $X\log X-(1+\gamma_E)X$ is $(s-1)^{-2}-(1+\gamma_E)(s-1)^{-1}$, and the argument shows that $S(X)=X\log X-(1+\gamma_E)X+O(X^\alpha)$ for some $\alpha<1$ forces every zero to have $\beta\le\alpha$. Together with the formula above this gives the statement that the hypothesis holds exactly when $S(X)=X\log X-(1+\gamma_E)X+O(\sqrt X)$.

::::: figure {#f-rh-smooth viz="smoothed-sum" height="440"}
The smoothed sum is rebuilt by far fewer zeros than the staircase, because its zero terms shrink like $1/\lvert\rho\rvert^2$.

```vizspec
Purpose: contrast the fast convergence of the smoothed explicit formula with the slow convergence for psi.
Scene: upper panel with X on the horizontal axis in [2, 100], vertical axis the remainder
  R(X) = S(X) - (X log X - (1+gamma_E) X + log(2 pi)) in [-1.5, 1.5]. Draw the exact R(X) (computed from primes
  up to 100) as a thick gold curve (it is continuous and piecewise smooth). Draw the partial formula
  R_N(X) = - sum_{n<=N} 2 Re(X^{rho_n} / (rho_n (rho_n - 1))) - sum_{k>=1} X^{-2k}/(2k(2k+1)) as a teal curve.
  Lower panel with the same X axis shows the corresponding unsmoothed comparison: the exact psi(X)-X in gold
  (a staircase) and the partial von Mangoldt sum with the same N in teal.
Controls: slider N from 0 to 200 (default 5); a play button that increases N; a toggle "show |zero sum| <= c0 sqrt(X)"
  that draws the envelope +-0.0462 sqrt(X) as a red band on the upper panel.
Motion: as N increases the teal curve in the upper panel locks onto the gold curve already by N around 10, while
  the lower panel still shows ripples and overshoots at each jump.
Reader takeaway: smoothing the cutoff turns a conditionally convergent sum into an absolutely convergent one, and
  the first few zeros already describe the smoothed count to within a few hundredths.
Data: first 200 zero ordinates, primes (kit provides them).
```
:::::

## Other statements equivalent to the hypothesis {#s-rh-equiv}

The earlier sections proved the equivalence of the hypothesis with three of its arithmetic forms, and several more exist that look nothing like a statement about zeros. The list below marks what is proved on this page and what is cited.

1. $\pi(x)=\mathrm{Li}(x)+O(\sqrt x\log x)$, von Koch 1901, proved above.
2. $\psi(x)=x+O(\sqrt x\log^2x)$, proved above.
3. $S(X)=X\log X-(1+\gamma_E)X+O(\sqrt X)$, proved above (the converse by the Mellin argument just given).
4. $M(x)=O(x^{1/2+\varepsilon})$ for every $\varepsilon>0$, Littlewood 1912, with the direction from the bound to the zeros proved above and the other direction cited [@littlewood1912-quelques; @titchmarsh].
5. $\sigma(n)<e^{\gamma_E}n\log\log n$ for every integer $n>5040$, where $\sigma(n)$ is the sum of the divisors of $n$ (Robin 1984, cited [@robin1984-grandes]).
6. The nonnegativity of Weil's functional on test functions of the form $f*\tilde f$, which is the subject of chapter [[weil-positivity]].

Statement 5 can be checked on small cases. The inequality fails for exactly $27$ integers from $2$ up to $5040$, and $5040$ is the last of them, with $\sigma(5040)=19344$ against $e^{\gamma_E}\cdot5040\log\log5040=19237.06$, so it fails by $0.56\%$. For larger highly composite numbers it holds, with $\sigma(n)$ equal to $0.9858$ of the right side at $n=10080$ and $0.9833$ at $n=55440$, and Gronwall's theorem that $\limsup\sigma(n)/(n\log\log n)=e^{\gamma_E}$ shows that the constant cannot be improved. Robin's theorem says that if the hypothesis were false the inequality would fail for infinitely many $n$, and since it is true it holds for every $n>5040$.

## Dirichlet characters and the first generalization {#s-rh-dirichlet}

The proofs of this chapter used only an Euler product with $\Lambda$ in its logarithmic derivative, a continuation to the plane, a functional equation, and a count of zeros, and these features hold for a much larger family. The smallest extension replaces all integers by the integers in a fixed residue class, so as to count primes in arithmetic progressions, and the answer is the template for everything that follows.

:::: definition {#d-rh-character title="Dirichlet character"}
A **Dirichlet character modulo $q$** is a function $\chi:\ZZ\to\CC$ obtained from a group homomorphism $\chi:(\ZZ/q\ZZ)^\times\to\CC^\times$ by setting $\chi(n)=\chi(n\bmod q)$ when $\gcd(n,q)=1$ and $\chi(n)=0$ otherwise. It is completely multiplicative, meaning $\chi(mn)=\chi(m)\chi(n)$ for all integers, and periodic with period $q$. The **principal character** $\chi_0$ is the one with $\chi_0(n)=1$ for all $n$ coprime to $q$. It is not identically 1, since it takes the value 0 at the multiples of the primes dividing $q$.
::::

There are exactly $\varphi(q)$ characters modulo $q$, where $\varphi$ is Euler's totient function. For $q=4$ the group $(\ZZ/4\ZZ)^\times=\{1,3\}$ has two characters, the principal one and the character $\chi_4$ with $\chi_4(1)=1$ and $\chi_4(3)=-1$, which is $1,0,-1,0$ on $n\equiv1,2,3,0\bmod4$. For $q=5$ the group $(\ZZ/5\ZZ)^\times$ is cyclic of order 4 with generator 2, since $2,4,3,1$ are its successive powers, so a character is fixed by the value $\chi(2)\in\{1,i,-1,-i\}$, which gives four characters, written $\chi_{5,0},\chi_{5,1},\chi_{5,2},\chi_{5,3}$ below with $\chi_{5,j}(2)=i^j$.

| $n\bmod5$ | 1 | 2 | 3 | 4 |
| --- | --- | --- | --- | --- |
| $\chi_{5,0}$ | 1 | 1 | 1 | 1 |
| $\chi_{5,1}$ | 1 | $i$ | $-i$ | $-1$ |
| $\chi_{5,2}$ | 1 | $-1$ | $-1$ | 1 |
| $\chi_{5,3}$ | 1 | $-i$ | $i$ | $-1$ |

Characters separate the residue classes. For $\gcd(a,q)=1$ one has the orthogonality relation $\frac1{\varphi(q)}\sum_\chi\overline{\chi(a)}\chi(n)=1$ if $n\equiv a\bmod q$ and $0$ otherwise, where the sum is over all $\varphi(q)$ characters. Therefore the sum $\psi(x;q,a)=\sum_{n\le x,\,n\equiv a}\Lambda(n)$ satisfies
$$
\psi(x;q,a)=\frac1{\varphi(q)}\sum_\chi\overline{\chi(a)}\,\psi(x,\chi),\qquad\psi(x,\chi)=\sum_{n\le x}\Lambda(n)\chi(n).
$$ {#eq-rh-orthogonality}
For $q=4$ and $a=1$ this reads $\psi(x;4,1)=\tfrac12\bigl(\psi(x,\chi_0)+\psi(x,\chi_4)\bigr)$, and at $x=100$ the numbers are $\psi(100,\chi_0)=89.8864$ and $\psi(100,\chi_4)=-0.1126$, giving $\psi(100;4,1)=44.8869$, while the same formula with a minus sign gives $\psi(100;4,3)=44.9995$, in agreement with direct summation. The principal character carries the main term, and every other character carries a sum that should be small.

:::: definition {#d-rh-l-function title="Dirichlet L-function"}
For a Dirichlet character $\chi$ the **L-function** is $L(s,\chi)=\sum_{n\ge1}\chi(n)n^{-s}$ for $\sigma>1$. It is a Dirichlet series with unit-size coefficients, and for $\chi=\chi_0$ it equals $\zeta(s)\prod_{p\mid q}(1-p^{-s})$. It is not a new kind of object for $q=1$, where it is $\zeta$ itself.
::::

Because $\chi$ is completely multiplicative, the proof of the Euler product in chapter [[euler-product]] goes through unchanged and gives $L(s,\chi)=\prod_p(1-\chi(p)p^{-s})^{-1}$ for $\sigma>1$, and taking the logarithmic derivative gives $-\frac{L'}{L}(s,\chi)=\sum_n\Lambda(n)\chi(n)n^{-s}$. The same Perron argument then expresses $\psi(x,\chi)$ as a sum over the zeros of $L(s,\chi)$. For $\chi_4$ the series is the alternating Leibniz series $L(s,\chi_4)=1-3^{-s}+5^{-s}-7^{-s}+\cdots$, with $L(1,\chi_4)=\pi/4=0.785398$, and the Euler product with all primes up to $2\times10^5$ gives $L(2,\chi_4)=0.9159655948$, against the true value (Catalan's constant) $0.9159655942$. For the quadratic character $\chi_{5,2}$ modulo 5, $L(1,\chi_{5,2})=\frac{2}{\sqrt5}\log\frac{1+\sqrt5}{2}=0.43041$.

The analytic properties repeat those of $\zeta$ with small changes. For a nonprincipal character $L(s,\chi)$ has no pole, so it is entire. Chapter [[zeta-continued]] derived the functional equation of $\zeta$ from Poisson summation applied to a theta function, and the same method applied to a theta function twisted by $\chi$ gives the following statement, which we cite. Call $\chi$ primitive if it is not induced by a character of a smaller modulus, and write $a=0$ if $\chi(-1)=1$ (an even character) and $a=1$ if $\chi(-1)=-1$ (an odd character).

::::: card {#t-rh-l-fe kind="proposition" title="A primitive L-function has a completed form that is symmetric under $s\mapsto1-s$" source="davenport"}
:::: statement
Let $\chi$ be a primitive character modulo $q>1$ with parity $a\in\{0,1\}$. The completed function
$$
\xi(s,\chi)=\Bigl(\frac q\pi\Bigr)^{(s+a)/2}\Gamma\Bigl(\frac{s+a}2\Bigr)L(s,\chi)
$$ {#eq-rh-l-completed}
is entire and satisfies $\xi(s,\chi)=\varepsilon(\chi)\xi(1-s,\bar\chi)$ with $\lvert\varepsilon(\chi)\rvert=1$, where $\bar\chi$ is the conjugate character and $\varepsilon(\chi)=1$ when $\chi$ is real. The zeros of $L(s,\chi)$ outside the critical strip are the trivial zeros $s=-a-2k$ for $k\ge0$.
::::
:::: plain
The L-function of a primitive character has the same kind of mirror symmetry as zeta, with the line $\sigma=\tfrac12$ as the mirror. The only changes are a factor depending on the modulus and a small shift in the Gamma function that depends on whether the character is even or odd.
::::
:::: why
The mirror symmetry is what makes the critical line special, exactly as for $\zeta$, and so the generalized hypothesis is stated with the same line.
::::
:::: idea
The proof repeats the one for $\zeta$ with a theta function whose terms carry $\chi(n)$. Poisson summation turns $\sum\chi(n)n^ae^{-\pi n^2t/q}$ into a sum over the Fourier transform of $\chi$, which is a Gauss sum times $\bar\chi$.
::::
:::: sketch {source="davenport"}
Davenport proves this from the theta functions $\sum_n\chi(n)n^ae^{-\pi n^2t/q}$ and the Gauss sum $\tau(\chi)=\sum_{m\bmod q}\chi(m)e^{2\pi im/q}$, with $\varepsilon(\chi)=\tau(\chi)/(i^a\sqrt q)$ [@davenport]. We use only the statement.
::::
:::: example
For $\chi_4$ (odd, so $a=1$, and $q=4$) the claim is that $\xi(s,\chi_4)=(4/\pi)^{(s+1)/2}\Gamma(\tfrac{s+1}2)L(s,\chi_4)$ equals $\xi(1-s,\chi_4)$. Numerically $\xi(0.3+2i,\chi_4)=0.7132035-0.0468964i$ and $\xi(0.7-2i,\chi_4)$ is the same number to 15 digits, and the same holds at $0.7-5.5i$, where both sides equal $0.0308394-0.0158398i$. The trivial zeros of $L(s,\chi_4)$ are $-1,-3,-5,\ldots$.
::::
:::: used
The statement of the generalized hypothesis below uses the critical line $\sigma=\tfrac12$ that this symmetry singles out.
::::
:::::

The nontrivial zeros of $L(s,\chi)$ lie in the same strip and are counted the same way, with the asymptotic count $\frac{T}{2\pi}\log\frac{qT}{2\pi e}$ for the zeros of a real character with $0<\gamma\le T$ (Davenport [@davenport]). The first zeros of $L(s,\chi_4)$ are $\tfrac12+i\gamma$ with $\gamma=6.020949$, $10.243770$, $12.988098$, $16.342607$, and $18.291993$, and those of the quadratic character modulo 5 are $6.648453$, $9.831444$, $11.958846$, $16.033821$, and $17.566994$, each found as a sign change of $\xi(\tfrac12+it,\chi)$, which for these two real characters is a real function of $t$ because $\varepsilon(\chi)=1$. For $T=45$ the count formula gives $16.9$ zeros of $L(s,\chi_4)$ with $0<\gamma\le45$, and the sign changes number $17$. For a complex character the zeros are not symmetric about the real axis, since $\rho$ is a zero of $L(s,\chi)$ exactly when $\bar\rho$ is a zero of $L(s,\bar\chi)$, but the functional equation still makes them symmetric about the critical line, in the form $\rho\mapsto1-\bar\rho$.

:::: definition {#d-rh-grh title="The Generalized Riemann Hypothesis for Dirichlet characters"}
The **Generalized Riemann Hypothesis (GRH) for Dirichlet characters** is the statement that for every primitive Dirichlet character $\chi$, every nontrivial zero of $L(s,\chi)$ has real part $\tfrac12$. It is the Riemann Hypothesis for the whole family $L(s,\chi)$ at once, and it is not implied by the case of $\zeta$ alone, which is the case $q=1$ of the family. Imprimitive characters follow because their L-functions differ from the primitive ones by finitely many Euler factors, whose zeros lie on the line $\sigma=0$.
::::

The proofs of GRH are the subject of Parts III and IV. Part III proves the hypothesis for the L-functions of all unitary Hecke characters of all number fields, which include the Dirichlet L-functions, following Masullo [@masullo], and Part IV proves it for $\zeta$ and the Dirichlet L-functions, following Alpoge with Claude [@alpoge-note; @alpoge-lean]. For the arithmetic consequences we use the statement.

::::: card {#t-rh-ap kind="theorem" title="Primes in a progression are equidistributed to within the square root, when every L-function obeys the hypothesis" source="davenport"}
:::: statement
Assume GRH for Dirichlet characters. For each modulus $q$ and each $a$ coprime to $q$,
$$
\psi(x;q,a)=\frac{x}{\varphi(q)}+O\bigl(\sqrt x\log^2x\bigr),\qquad\pi(x;q,a)=\frac{\mathrm{Li}(x)}{\varphi(q)}+O\bigl(\sqrt x\log x\bigr),
$$ {#eq-rh-ap}
where the implied constants may depend on $q$.
::::
:::: plain
Each of the $\varphi(q)$ admissible residue classes receives its fair share $1/\varphi(q)$ of the primes, and the departure from a fair share is of size $\sqrt x$ up to logarithms.
::::
:::: why
Dirichlet proved in 1837 that every class that can contain infinitely many primes does contain infinitely many [@dirichlet1837-progression], and the prime number theorem for progressions gives the density $1/\varphi(q)$, but only the generalized hypothesis gives an error that small.
::::
:::: idea
By [[eq-rh-orthogonality]] the sum $\psi(x;q,a)$ splits into $\psi(x,\chi)$ over characters. The principal character gives $x$ by the explicit formula for $\zeta$, and each other character has no pole at $s=1$ and so contributes only a sum over its zeros, with no main term. If every zero is on the line, each such sum is at most $\sqrt x\log^2x$ by the same argument as for $\zeta$.
::::
:::: sketch {source="davenport"}
For primitive $\chi\ne\chi_0$ the explicit formula reads $\psi_0(x,\chi)=-\sum_\rho\frac{x^\rho}{\rho}+O(\log x)$, with no main term because $L(s,\chi)$ is entire. The truncation and the bound $\sum_{\lvert\gamma\rvert\le T}1/\lvert\rho\rvert\ll\log^2(qT)$ go through as for $\zeta$, and with $T=x$ and all $\beta=\tfrac12$ one gets $\psi(x,\chi)\ll\sqrt x\log^2x$. Summing over the $\varphi(q)$ characters in [[eq-rh-orthogonality]] gives the first claim, and partial summation as in the proof of [[t-rh-von-koch]] gives the second. The imprimitive characters differ from primitive ones by $O(\log x)$. See Davenport [@davenport] and Montgomery and Vaughan [@montgomeryvaughan].
::::
:::: example
At $x=10^6$ the primes $1\bmod4$ number $39175$ and the primes $3\bmod4$ number $39322$, and for $\psi$ the deviations from $x/2$ are $\psi(10^6;4,1)-500000=-631.2$ and $\psi(10^6;4,3)-500000=+204.6$, which are $-0.63\sqrt x$ and $+0.20\sqrt x$. For the modulus 5 the four classes $1,2,3,4$ contain $19617$, $19622$, $19665$, and $19593$ primes up to $10^6$ (plus the single prime $5$ itself), against the fair share $78497/4=19624.25$, so the deviations are $-7$, $-2$, $+41$, and $-31$. All of them are smaller than $\sqrt x/\log x\approx72$.
::::
:::: used
The race of the next paragraphs is a consequence of this explicit formula. The same template is used in the number field setting at the end of the chapter.
::::
:::::

The explicit formula for $\chi_4$ explains a famous asymmetry. The primes $3\bmod4$ are ahead of the primes $1\bmod4$ at every power of ten, and the difference $\Delta(x)=\pi(x;4,3)-\pi(x;4,1)$ equals $1,2,7,10,25,147,218$ at $x=10^k$ for $k=1,\ldots,7$. The first $x$ at which the primes $1\bmod4$ pull ahead is $26861$, and among the integers up to $10^7$ they lead at only $0.034\%$. The source of the bias is visible in the explicit formula. Under the hypothesis for $L(s,\chi_4)$, the sum $\psi(x,\chi_4)=\sum_{n\le x}\Lambda(n)\chi_4(n)$ is a sum of waves with no main term, so it oscillates around 0. But the square of every odd prime is $1\bmod4$, so the prime squares contribute $+\sum_{3\le p\le\sqrt x}\log p\approx\sqrt x$ to it with no sign changes, and the primes alone must therefore carry a sum $\sum_{p\le x}\chi_4(p)\log p$ that oscillates around $-\sqrt x$. Dividing by $\log x$ to count primes, this pushes $\Delta(x)$ up by about $\sqrt x/\log x$, which is $10.9,\,27.5,\,72.4,\,196.2$ at $x=10^4,\ldots,10^7$, close to the observed $10,\,25,\,147,\,218$ except at $10^6$, where the oscillating terms from the zeros of $L(s,\chi_4)$ add about $75$. The race is thus governed by the zeros $\tfrac12+6.020949i,\,\tfrac12+10.243770i,\ldots$ of $L(s,\chi_4)$, in the same way that the staircase of primes is governed by the zeros of $\zeta$.

::::: figure {#f-rh-race viz="prime-race" height="440"}
The primes $3\bmod4$ lead the primes $1\bmod4$ almost all the time, and the size of the lead is governed by $\sqrt x/\log x$ and the zeros of $L(s,\chi_4)$.

```vizspec
Purpose: show the prime race mod 4 (and other moduli) and its lead, as the visible effect of L-function zeros.
Scene: horizontal axis x on a log scale from 10 to 10^6 (primes from the kit). Upper panel: counts pi(x;q,a)
  for the residue classes of the chosen modulus q, one polyline per class, each a different hue, over the
  same x, plotted as pi(x;q,a) - Li(x)/phi(q) in units of sqrt(x)/log(x) (so all curves hover near 0).
  Lower panel: for q=4 the difference Delta(x) = pi(x;4,3) - pi(x;4,1) in gold, together with the smooth curve
  sqrt(x)/log(x) in blue. Mark in red the intervals where Delta < 0 (the first is x = 26861, with
  Delta = -1 up to 26863) and annotate it.
Controls: radio buttons for the modulus q in {3, 4, 5, 8}; a log-scale range slider for x; a toggle "show
  sqrt(x)/log(x)"; a hover readout of x, the class counts, and the lead.
Motion: switching the modulus morphs the curves; zooming the x range keeps the curves anchored to the data
  with min/max decimation per pixel column.
Reader takeaway: the classes stay balanced to within sqrt(x)/log(x), but one class is systematically ahead (the
  Chebyshev bias), and the lead flips only rarely.
Data: primes (kit provides them).
```
:::::

## Number fields and the Dedekind zeta function {#s-rh-fields}

Dirichlet characters generalize by changing the question from "which residue class is $p$ in" to "how does $p$ behave in a larger number system". A **number field** is a finite extension $K$ of $\QQ$, such as $\QQ(i)$, the field of numbers $a+bi$ with $a,b$ rational. Its integers form a ring $\mathcal O_K$, which for $\QQ(i)$ is the ring $\ZZ[i]$ of Gaussian integers, and instead of numbers $n$ one counts ideals. The role of the integer $n$ is played by an ideal $\mathfrak a$ and its norm $N\mathfrak a$, which is the number of elements of $\mathcal O_K/\mathfrak a$.

:::: definition {#d-rh-dedekind title="Dedekind zeta function"}
For a number field $K$ the **Dedekind zeta function** is $\zeta_K(s)=\sum_{\mathfrak a}N\mathfrak a^{-s}$, where $\mathfrak a$ runs over the nonzero ideals of $\mathcal O_K$, convergent for $\sigma>1$. It has the Euler product $\zeta_K(s)=\prod_{\mathfrak p}(1-N\mathfrak p^{-s})^{-1}$ over the prime ideals $\mathfrak p$. It is not $\zeta(s)$ of $K$ viewed as a field of numbers, and for $K=\QQ$ it equals $\zeta(s)$.
::::

For $K=\QQ(i)$ the prime ideals can be described by how a rational prime $p$ factors in $\ZZ[i]$. The prime $2$ is ramified, $2=-i(1+i)^2$, and has one prime ideal of norm $2$. Primes $p\equiv1\bmod4$ split into two distinct prime ideals of norm $p$, as $5=(2+i)(2-i)$. Primes $p\equiv3\bmod4$ stay prime (they are inert), giving one prime ideal of norm $p^2$. Matching the local factors, a split prime contributes $(1-p^{-s})^{-2}$, an inert prime contributes $(1-p^{-2s})^{-1}=(1-p^{-s})^{-1}(1+p^{-s})^{-1}$, and $2$ contributes $(1-2^{-s})^{-1}$. These are exactly the local factors of $\zeta(s)L(s,\chi_4)$, since $\chi_4(p)=1,-1,0$ for the three cases, and so
$$
\zeta_{\QQ(i)}(s)=\zeta(s)\,L(s,\chi_4).
$$ {#eq-rh-dedekind-gauss}
The coefficient of $n^{-s}$, which counts the ideals of norm $n$, is $a(n)=\sum_{d\mid n}\chi_4(d)$, and it equals $r_2(n)/4$ where $r_2(n)$ is the number of ways to write $n$ as a sum of two squares, because the four units $\pm1,\pm i$ generate the same ideal. For example $a(5)=2$ and $r_2(5)=8$, $a(3)=0$ and $r_2(3)=0$, $a(25)=3$ and $r_2(25)=12$, and $a(65)=4$ and $r_2(65)=16$, all confirmed by direct count. The residue of $\zeta_{\QQ(i)}$ at $s=1$ is $L(1,\chi_4)=\pi/4$, which agrees with the class number formula $\frac{2^{r_1}(2\pi)^{r_2}hR}{w\sqrt{\lvert d_K\rvert}}=\frac{2\pi}{4\cdot2}$ for $r_1=0$, $r_2=1$, $h=1$, $R=1$, $w=4$, $d_K=-4$ [@neukirch-ant].

Equation [[eq-rh-dedekind-gauss]] shows that the zeros of the Dedekind zeta function of $\QQ(i)$ are the zeros of $\zeta$ together with the zeros of $L(s,\chi_4)$. This is a general pattern, since the Dedekind zeta function of any abelian extension of $\QQ$ factors into the Dirichlet L-functions of the characters of the extension, and for nonabelian extensions it factors into more general Artin L-functions. For the real quadratic field $\QQ(\sqrt5)$, for instance, the same matching, with $p\equiv\pm1\bmod5$ split, $p\equiv\pm2\bmod5$ inert, and $5$ ramified, gives $\zeta_{\QQ(\sqrt5)}(s)=\zeta(s)\,L(s,\chi_{5,2})$. The functional equation also holds. With $\Gamma_{\RR}(s)=\pi^{-s/2}\Gamma(s/2)$ and $\Gamma_{\CC}(s)=2(2\pi)^{-s}\Gamma(s)$, if $K$ has $r_1$ real and $r_2$ complex places and discriminant $d_K$, the function $\xi_K(s)=\lvert d_K\rvert^{s/2}\Gamma_{\RR}(s)^{r_1}\Gamma_{\CC}(s)^{r_2}\zeta_K(s)$ satisfies $\xi_K(s)=\xi_K(1-s)$ [@neukirch-ant]. Unlike $\xi$, this completed function keeps the simple poles at $s=0$ and $s=1$, because it has no factor $s(s-1)$. For $\QQ(i)$ ($r_1=0$, $r_2=1$, $d_K=-4$) this says $4^{s/2}\cdot2(2\pi)^{-s}\Gamma(s)\zeta(s)L(s,\chi_4)$ is symmetric under $s\mapsto1-s$, and numerically its value is $-0.0728610+0.0203257i$ at both $s=0.3+2i$ and $s=0.7-2i$.

Hecke characters generalize Dirichlet characters from $\QQ$ to $K$. A Dirichlet character modulo $q$ is a character of a ray class group of $\QQ$, meaning the group of positive fractions whose numerator and denominator are prime to $q$, taken modulo those that are $1\bmod q$, and a **Hecke character** is a character of a generalized ideal class group in which, in addition, one may remember an angle at each infinite place. The finite-order ones are the characters of ray class groups, the direct analogue of Dirichlet characters, and the others are the Grössencharaktere of Hecke [@hecke1918-zeta]. On $\QQ(i)$ an example is $\chi^{(k)}\bigl((\alpha)\bigr)=(\alpha/\lvert\alpha\rvert)^{4k}$ for the ideal generated by $\alpha$, which depends only on the ideal because a unit multiplies $\alpha/\lvert\alpha\rvert$ by a fourth root of unity, and that becomes 1 after the power $4k$. Its L-function $L(s,\chi^{(k)})=\sum_{\mathfrak a}\chi^{(k)}(\mathfrak a)N\mathfrak a^{-s}$ has an Euler product, a continuation, and a functional equation like the ones above, and $\chi^{(0)}$ gives $\zeta_{\QQ(i)}$ back. Characters with values on the unit circle, like these, are called unitary, and they are the ones for which the critical line is $\sigma=\tfrac12$.

:::: definition {#d-rh-erh title="The extended Riemann Hypothesis"}
The **extended Riemann Hypothesis** for a family of L-functions is the statement that every nontrivial zero of every function in the family has real part $\tfrac12$. It is used for the family of Dedekind zeta functions $\zeta_K$ of all number fields $K$, and in its widest form for the L-functions $L(s,\chi)$ of all unitary Hecke characters $\chi$ of all number fields. It is a statement about each function in the family separately and is not a statement about the sum or product of functions, and nothing in it depends on a normalization other than the unitary one. Terminology varies, and many authors call the Dirichlet case, the Dedekind case, and the Hecke case all "the generalized Riemann Hypothesis".
::::

For counting primes, the extended hypothesis gives for number fields what the generalized hypothesis gives for progressions. Under the hypothesis for $\zeta_K$ the number of prime ideals of norm at most $x$ is $\mathrm{Li}(x)$ plus an error of size about $\sqrt x$ times logarithms of $x$ and of the discriminant $d_K$, and the Chebotarev density theorem, which says how primes split in Galois extensions, acquires a similar error term (see Iwaniec and Kowalski [@iwaniec-kowalski-ant]).

::::: figure {#f-rh-ladder viz="zero-ladder" height="420"}
The zeros of the Dedekind zeta function of $\QQ(i)$ are exactly the zeros of $\zeta$ together with those of $L(s,\chi_4)$, and every one of them lies on the critical line.

```vizspec
Purpose: show the generalization ladder at the level of zeros, and make equation (zeta_K = zeta * L) visible.
Scene: a horizontal axis for the ordinate gamma from 0 to 40, with the critical line implied (a violet baseline).
  Draw four rows of tick marks, one per function. Row 1: zeta(s), the first 12 ordinates from the kit
  (14.134725, 21.022040, 25.010858, 30.424876, 32.935062, 37.586178, ...). Row 2: L(s, chi_4): 6.020949,
  10.243770, 12.988098, 16.342607, 18.291993, 21.450611, 23.278377, 25.728756, 28.359634, 29.656384,
  32.592187, 34.199958. Row 3: L(s, chi_{5,2}), the quadratic character mod 5: 6.648453, 9.831444, 11.958846,
  16.033821, 17.566994, 19.540733, 22.227405, 24.588466, 26.776096, 28.461035, 29.707909, 33.000456.
  Row 4: zeta_K for K=Q(i), the union of rows 1 and 2 with ticks colored by their origin.
Controls: a radio selector for the field/character (Q: zeta alone; Q(i): zeta times L(chi_4); mod 5 character:
  L(chi_{5,2})); a slider for gamma_max from 10 to 40; a toggle "show spacing", which draws the gaps between
  consecutive ticks and the local mean 2 pi / log(q gamma / 2 pi) (q = 1 for zeta, 4 or 5 for the others).
Motion: when the selector changes, row 4 recomputes by merging the ticks with a short animation where the ticks
  of rows 1 and 2 slide down to row 4.
Reader takeaway: larger families have more zeros but the same shape, all on one line, and the Dedekind zeta
  function of Q(i) is literally the superposition of two spectra.
Data: first 200 zero ordinates (kit); the listed ordinates for the two L-functions are part of this spec.
```
:::::

## The three hypotheses side by side {#s-rh-table}

The ladder can now be summarized. Each rung covers a larger class of functions, all with an Euler product, a completed form with a functional equation, and zeros inside a critical strip, and each statement is the same sentence, "the nontrivial zeros have real part $\tfrac12$", about a bigger family.

| statement | functions covered | Euler product over | symmetry | trivial zeros | proved on this page in |
| --- | --- | --- | --- | --- | --- |
| Riemann Hypothesis | $\zeta(s)$ | primes $p$ | $\xi(s)=\xi(1-s)$ | $-2,-4,-6,\dots$ | Parts III and IV |
| Generalized Riemann Hypothesis (Dirichlet) | $L(s,\chi)$ for all primitive $\chi$ of all moduli $q$ | primes $p$, with $\chi(p)$ | $\xi(s,\chi)=\varepsilon\,\xi(1-s,\bar\chi)$ | $-a-2k$ | Parts III and IV |
| Extended Riemann Hypothesis (Dedekind) | $\zeta_K(s)$ for all number fields $K$ | prime ideals $\mathfrak p$, with $N\mathfrak p$ | $\xi_K(s)=\xi_K(1-s)$ | at $s=0,-1,-2,\dots$ with orders set by $r_1,r_2$ | Part III |
| Hecke version (unitary) | $L(s,\chi)$ for all unitary Hecke characters $\chi$ of all number fields | prime ideals, with $\chi(\mathfrak p)$ | $\xi(s,\chi)=\varepsilon\,\xi(1-s,\bar\chi)$ | from the infinite type | Part III |

Each line contains the previous ones, since $\zeta$ is the case $q=1$ of the Dirichlet family, a Dirichlet L-function is a factor of the Dedekind zeta function of a cyclotomic field (for $\QQ(i)$, the factor $L(s,\chi_4)$), and a Dedekind zeta function is the Hecke L-function of the trivial character. The last column records how far each proof reaches. Part III, following Masullo [@masullo], proves the last line, and with it every line above. Part IV, following Alpoge with Claude [@alpoge-note], proves the first two lines.

:::: recap
The reader now has the following.

- The exponent of the error in the count of primes is exactly $\Theta$, the largest real part of a zero, so the hypothesis is equivalent to $\psi(x)=x+O(\sqrt x\log^2x)$ and to $\pi(x)=\mathrm{Li}(x)+O(\sqrt x\log x)$.
- Square-root cancellation, the behavior of a sum of fair coins, explains why $\tfrac12$ is the natural exponent, and a sieve to $10^7$ shows $\lvert\psi(x)-x\rvert/\sqrt x$ and $\lvert M(x)\rvert/\sqrt x$ below $1$ at every integer $x\ge2$.
- The smoothed sum $S(X)=\sum_{n\le X}\Lambda(n)(X/n-1)$ has an explicit formula with an absolutely convergent zero sum, verified numerically and bounded by $0.0462\sqrt X$ under the hypothesis.
- Equivalent forms (Littlewood's bound on $M(x)$, Robin's divisor inequality, and Weil's positivity in the next chapter).
- The generalizations to Dirichlet characters, number fields, and Hecke characters, with $\zeta_{\QQ(i)}=\zeta\cdot L(s,\chi_4)$ as the example and a table that lines up the three hypotheses.

Part II takes the explicit formula as its starting point. Chapter [[weil-positivity]] replaces the sharp cutoff and the smoothed ramp by an arbitrary test function, so that the formula becomes a duality between the primes and the zeros, and it shows that the hypothesis is a statement that a certain quadratic form is nonnegative. Chapters [[function-fields]] and [[stepanov]] then turn to the one world in which the analogue was proved long ago, curves over finite fields, and explain what that proof used that the integers lack, which is where Parts III and IV begin.
::::
