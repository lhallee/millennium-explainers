---
id: explicit-formula
title: "The explicit formula: each zero is a wave"
part: 1
summary: Derive von Mangoldt's exact formula for the prime-power staircase $\psi(x)$, and read each pair of zeros of zeta as one wave in $\log x$.
needs: [zeros]
---

:::: plain
The count of primes can be written exactly as a smooth main term plus a sum with one term for every zero of the zeta function. Each pair of zeros contributes a single wave, whose speed is the height of the zero and whose size grows like a power of $x$ set by the zero's real part. Adding the waves one pair at a time turns a smooth line into the jagged staircase of the primes.
::::

Chapter [[zeros]] located the zeros, and chapter [[counting-primes]] set the question, which is how far the staircase $\psi(x)=\sum_{n\le x}\Lambda(n)$ strays from the line $y=x$. This chapter connects the two. The tool is a short chain of ideas. A contour integral can act as a switch that turns terms of a Dirichlet series on and off, the series $-\zeta'/\zeta(s)=\sum_n\Lambda(n)n^{-s}$ from chapter [[euler-product]] has the primes built into its coefficients, and moving the integration contour to the left collects the poles of $\zeta'/\zeta$, which are the zeros. The result, von Mangoldt's explicit formula, is the hinge between the arithmetic of primes and the analysis of zeros, and every later result on this page, including both proofs, is an application of some version of it.

## The goal: an exact formula for $\psi$ {#s-ef-goal}

We want an identity, not an estimate. Chapter [[counting-primes]] introduced $\psi(x)$ as the sum of $\Lambda(n)$ over $n\le x$, which jumps by $\log p$ at each prime power $p^k$ and is flat in between. For instance $\psi(7)=\log2+\log3+\log2+\log5+\log7=6.0403$ counts the prime powers $2,3,4,5,7$, and at $x=8$ it jumps by $\log2$ to $\psi(8)=6.7334$. The staircase is discontinuous, and a formula built out of waves is continuous at every finite stage, so exact agreement at a jump is impossible and the natural statement is that the formula takes the midpoint of the jump.

:::: definition {#d-ef-psi0 title="The midpoint value of the staircase"}
For $x>1$ let $\psi_0(x)$ be $\psi(x)$ when $x$ is not a prime power, and $\psi(x)-\tfrac12\Lambda(x)$ when $x$ is a prime power, so that $\psi_0(x)=\tfrac12\bigl(\psi(x^-)+\psi(x^+)\bigr)$. It is the same staircase with the value at each jump replaced by the midpoint of the jump, not a different function, and it agrees with $\psi$ at every $x$ that is not a prime power.
::::

At $x=8$ the left limit is $\psi(8^-)=6.0403$ and the right value is $\psi(8)=6.7334$, so $\psi_0(8)=6.3868$. At $x=10$, which is not a prime power, $\psi_0(10)=\psi(10)=7.8320$. These two numbers will be our test cases.

## Perron's switch {#s-ef-perron}

The Dirichlet series $\sum_n\Lambda(n)n^{-s}$ knows about every prime power, but it does not know about the cutoff $n\le x$, and we need a device that reads off the partial sums. The device is the following integral, which takes the value 1 when its parameter $y$ is larger than 1 and the value 0 when $y$ is smaller. Applied to $y=x/n$ it equals 1 exactly when $n<x$.

:::: definition {#d-ef-perron-switch title="The Perron switch"}
For $c>0$, $y>0$, and $T>0$ define
$$
I_T(y)=\frac1{2\pi i}\int_{c-iT}^{c+iT}\frac{y^s}{s}\,\dd s ,
$$ {#eq-ef-switch}
the integral along the vertical segment $\Re s=c$ from height $-T$ to height $T$. It is a smooth function of $y$ that, as $T\to\infty$, approaches the step function that is 1 for $y>1$, $\tfrac12$ for $y=1$, and 0 for $0<y<1$. It is not itself a step function for any finite $T$, and its limit does not depend on $c$.
::::

:::: idea
The integrand $y^s/s$ is analytic except for a simple pole at $s=0$ with residue 1. If $y>1$ then $\lvert y^s\rvert=y^{\sigma}$ decays as $\sigma\to-\infty$, so we can push the contour far to the left and pick up the residue 1 from the pole at 0. If $y<1$ then $y^\sigma$ decays as $\sigma\to+\infty$, so the contour can be pushed to the right, where it meets no pole and the integral is 0. The switch is the statement that the pole at $s=0$ is on the left of the contour, and $y$ decides which way the integral can be closed.
::::

::::: card {#t-ef-perron kind="lemma" title="The truncated Perron integral is within $y^c/(\pi T\lvert\log y\rvert)$ of the step function" source="davenport"}
:::: statement
For $c>0$, $T>0$, and $y>0$ with $y\ne1$,
$$
\Bigl\lvert I_T(y)-\mathbf 1_{y>1}\Bigr\rvert\le\frac{y^c}{\pi T\lvert\log y\rvert},
$$ {#eq-ef-perron-bound}
and $I_T(1)=\frac1\pi\arctan(T/c)\to\tfrac12$ as $T\to\infty$.
::::
:::: plain
The sharp edge of a step function can be produced by integrating $y^s/s$ along a long vertical line, and the error shrinks like $1/T$ except right next to the step, where $y$ is close to 1.
::::
:::: why
Sums with the cutoff $n\le x$ are what we want, and Dirichlet series have no cutoff. The switch converts one into the other, and the bound says how long a segment is needed to simulate it, which later becomes the error term of the explicit formula.
::::
:::: idea
Close the segment into a rectangle in the direction where $y^\sigma$ decays, and bound the two horizontal sides, whose integrand is small because $\lvert1/s\rvert\le1/T$ there.
::::
:::: proof
Suppose first $y>1$. Take the rectangle with corners $c\pm iT$ and $-U\pm iT$ for a large number $U>0$. The only pole inside is $s=0$ with residue $y^0=1$, so the integral over the full boundary is $2\pi i$. On the two horizontal sides $\lvert y^s/s\rvert\le y^\sigma/T$, and $\int_{-U}^{c}y^\sigma\,\dd\sigma\le y^c/\log y$, so those sides together contribute at most $\frac1{2\pi}\cdot2\cdot\frac{y^c}{T\log y}=\frac{y^c}{\pi T\log y}$. On the left side $\lvert s\rvert\ge U$ and $\lvert y^s\rvert=y^{-U}$, so that side contributes at most $\frac{1}{2\pi}\cdot2T\cdot y^{-U}/U$, which tends to 0 as $U\to\infty$ because $y>1$. Letting $U\to\infty$ gives $\lvert I_T(y)-1\rvert\le y^c/(\pi T\log y)$.

If $0<y<1$ close the rectangle to the right instead, with corners $c\pm iT$ and $U\pm iT$. There is no pole inside, so the full boundary integral is 0, the horizontal sides contribute at most $\frac1{2\pi}\cdot2\cdot\frac{y^c}{T\lvert\log y\rvert}$ because $\int_c^Uy^\sigma\,\dd\sigma\le y^c/\lvert\log y\rvert$, and the right side tends to 0 as $U\to\infty$ since $y^U\to0$. Hence $\lvert I_T(y)\rvert\le y^c/(\pi T\lvert\log y\rvert)$. For $y=1$ the integrand is $1/s$, and $\frac1{2\pi i}\int_{-T}^{T}\frac{i\,\dd t}{c+it}=\frac1{2\pi}\int_{-T}^T\frac{c\,\dd t}{c^2+t^2}=\frac1\pi\arctan\frac Tc$, since the odd part cancels.
::::
:::: example
Take $c=1$. For $y=2$ the true value of the switch is 1, and numerical integration gives $I_{10}(2)=0.9261$ and $I_{100}(2)=0.9910$, with errors $0.074$ and $0.009$ against the bounds $0.092$ and $0.0092$ from [[eq-ef-perron-bound]]. For $y=\tfrac12$ the true value is 0, and the integrals are $0.0201$ at $T=10$ and $0.00226$ at $T=100$, against the bounds $0.0230$ and $0.00230$. At $y=1$ the integral at $T=100$ is $0.49682$, which equals $\frac1\pi\arctan(100)$ and approaches $\tfrac12$.
::::
:::: used
Section [[s-ef-perron-psi]] applies the switch to every term $\Lambda(n)(x/n)^s$ of the series for $-\zeta'/\zeta$, and chapter [[what-rh-says]] applies a version with kernel $1/(s(s-1))$ in which the integral converges absolutely.
::::
:::::

::::: figure {#f-ef-perron viz="perron-switch" height="380"}
A vertical line integral of $y^s/s$ builds a step function out of smooth waves, and a longer line gives a sharper step.

```vizspec
Purpose: show the Perron switch I_T(y) converging to the step function, with the overshoot near y=1.
Scene: axes y in [0.25, 4] horizontally on a log scale (so that y and 1/y are symmetric), value in [-0.2, 1.2]
  vertically. Draw the exact step function (0 for y<1, 1 for y>1, with an open circle at 1/2) as a pale gold
  line. Draw I_T(y) = Re (1/2 pi) integral_{-T}^{T} y^(c+it)/(c+it) dt as a bright teal curve (sample y at
  about 400 points, evaluate the integral by 400-point trapezoid rule in t). Draw the envelope
  y^c/(pi T |log y|) above and below the step as two thin red dashed curves.
Controls: slider T from 1 to 100 (log scale, default 10); slider c from 0.2 to 3 (default 1); a toggle
  "show bound".
Motion: as T grows the curve steepens at y=1 and the oscillations compress and shrink away from y=1, and the
  a small overshoot (up to about 9% of the step when c is small, the Gibbs overshoot) sits next to y=1 and
  its width shrinks.
Reader takeaway: a smooth integral over a vertical line acts as a switch that is on for y>1 and off for
  y<1, and the line only needs to be long enough compared with 1/|log y|.
Data: none beyond the formula.
```
:::::

## Applying the switch to the primes {#s-ef-perron-psi}

We now have a way to turn the cutoff $n\le x$ into an integral, and the series that knows the primes is $-\zeta'/\zeta(s)=\sum_n\Lambda(n)n^{-s}$, which converges absolutely for $\sigma>1$. Choose $c>1$; any such $c$ gives the identity below, and for the error estimate we take $c=1+1/\log x$, so that $x^c=e\,x$ stays of size $x$. For each $n$ we apply the switch with $y=x/n$, which is greater than 1 exactly when $n<x$, and the identity $(x/n)^s=x^sn^{-s}$ lets us sum over $n$ after the integral. Writing $\mathbf 1_{n\le x}$ for the indicator of the cutoff, and treating $n=x$ as the midpoint case,
$$
\psi_0(x)=\sum_n\Lambda(n)\,\mathbf 1_{n\le x}\ \approx\ \sum_n\Lambda(n)\frac1{2\pi i}\int_{c-iT}^{c+iT}\Bigl(\frac xn\Bigr)^s\frac{\dd s}{s}=\frac1{2\pi i}\int_{c-iT}^{c+iT}\Bigl(-\frac{\zeta'}{\zeta}(s)\Bigr)\frac{x^s}{s}\,\dd s .
$$ {#eq-ef-perron-psi}
The sum and integral can be exchanged because on the line $\sigma=c$ the sum $\sum_n\Lambda(n)n^{-c}=-\zeta'/\zeta(c)$ converges absolutely and the segment has finite length. Combined with [[eq-ef-perron-bound]], the difference between the two sides of [[eq-ef-perron-psi]] is at most $\sum_n\Lambda(n)(x/n)^c\min\bigl(1,\tfrac1{\pi T\lvert\log(x/n)\rvert}\bigr)$, which with $c=1+1/\log x$ is of size $O(x\log^2x/T+\log x)$ for large $T$, the last term coming from the prime powers closest to $x$ (this estimate is carried out in Davenport [@davenport]). So $\psi_0(x)$ is the limit as $T\to\infty$ of the integral on the right. The integral now involves only the function $\zeta'/\zeta$ and the kernel $x^s/s$, which means that all arithmetic information about the primes sits in the poles and growth of $\zeta'/\zeta$.

## Moving the contour left {#s-ef-residues}

An integral over a vertical line equals the sum of residues of everything between that line and another one, plus the integral over the new line, and the plan is to drag the line to the left as far as it will go. Fix $x>1$, take a large $T$ that is not an ordinate of a zero, and take a large odd number $U$ so that the line $\sigma=-U$ avoids the trivial zeros. The rectangle with corners $c\pm iT$ and $-U\pm iT$ contains the singularities of the integrand $F(s)=-\frac{\zeta'}{\zeta}(s)\frac{x^s}{s}$. The residues are the following, and they rest on the fact that $\zeta'/\zeta$ has a simple pole with residue $m$ at each zero of multiplicity $m$, a simple pole with residue $-1$ at $s=1$, and no other poles, so that $-\zeta'/\zeta$ has residue $-m$ at each zero and $+1$ at $s=1$.

:::: steps
1. At $s=1$ the function $-\zeta'/\zeta$ has a simple pole with residue $+1$, because $\zeta(s)\sim1/(s-1)$ gives $\zeta'/\zeta\sim-1/(s-1)$, so the residue of $F$ is $x^1/1=x$.
2. At each nontrivial zero $\rho$ of multiplicity $m$ the function $-\zeta'/\zeta$ has residue $-m$, so $F$ contributes $-m\,x^\rho/\rho$. Counting zeros with multiplicity, this is one term $-x^\rho/\rho$ for every zero.
3. At $s=0$ the factor $1/s$ has a pole. Since $\zeta(0)=-\tfrac12$ and $\zeta'(0)=-\tfrac12\log2\pi$, the value $-\zeta'(0)/\zeta(0)=-\log2\pi$ is finite, so the residue of $F$ is $-\log2\pi$.
4. At each trivial zero $s=-2k$ with $k\ge1$ the function $-\zeta'/\zeta$ has residue $-1$, so $F$ contributes $-x^{-2k}/(-2k)=+x^{-2k}/(2k)$, and summing over $k$ gives $\sum_{k\ge1}\frac{x^{-2k}}{2k}=-\tfrac12\log(1-x^{-2})$.
::::

Adding the four contributions gives the sum of residues,
$$
x-\sum_{\lvert\gamma\rvert<T}\frac{x^\rho}{\rho}-\log2\pi-\tfrac12\log\bigl(1-x^{-2}\bigr),
$$ 
where the last term uses all the trivial zeros and the sum over $\rho$ is over the zeros inside the rectangle. What remains is to show that the other three sides of the rectangle contribute something that disappears. The left side at $\sigma=-U$ tends to 0 as $U\to\infty$ because $\lvert x^s\rvert=x^{-U}\to0$ for $x>1$ while the logarithmic derivative of $\zeta$ grows only like $\log U$ there, by the functional equation. The two horizontal sides need more care, since $\zeta'/\zeta$ is large near zeros. A standard estimate from Hadamard's product, $\frac{\zeta'}{\zeta}(s)=\sum_{\lvert t-\gamma\rvert<1}\frac1{s-\rho}+O(\log\lvert t\rvert)$, shows that for each large $T$ one can choose a height $T'$ within 1 of $T$ whose distance from every ordinate is at least a constant times $1/\log T$, and on that height $\lvert\zeta'/\zeta\rvert\ll\log^2T$. The horizontal sides are then $O\bigl(x\log^2(xT)/T\bigr)$, which tends to 0 as $T\to\infty$. We state what comes out.

::::: card {#t-ef-von-mangoldt kind="theorem" title="Each zero of $\zeta$ is one wave in the count of primes" source="vonmangoldt1895-formula"}
:::: statement
For every real $x>1$,
$$
\psi_0(x)=x-\sum_{\rho}\frac{x^\rho}{\rho}-\log2\pi-\tfrac12\log\bigl(1-x^{-2}\bigr),
$$ {#eq-ef-von-mangoldt}
where the sum runs over all nontrivial zeros $\rho$ with multiplicity and is understood as the limit
$$
\sum_\rho\frac{x^\rho}\rho=\lim_{T\to\infty}\sum_{\lvert\gamma\rvert<T}\frac{x^\rho}{\rho}.
$$ {#eq-ef-symmetric}
For $x\ge2$ and $T\ge2$ the truncated sum satisfies $\psi(x)=x-\sum_{\lvert\gamma\rvert\le T}\frac{x^\rho}{\rho}+O\bigl(\tfrac xT\log^2(xT)+\log x\bigr)$.
::::
:::: plain
The staircase of primes equals the line $y=x$, minus a correction with one term for each zero of zeta, minus a small constant and a small correction that fades as $x$ grows. There is no approximation in the formula, only in how many terms one is willing to add.
::::
:::: why
This is the first formula in which a statement about primes is exactly a statement about zeros. If every zero has real part $\tfrac12$, every term of the sum has size about $\sqrt x/\lvert\rho\rvert$, and the truncated version of the formula keeps the staircase within about $\sqrt x\log^2x$ of the line. If some zero had real part larger than $\tfrac12$, its term would grow faster than $\sqrt x$ and would eventually dominate. Chapter [[what-rh-says]] makes this precise.
::::
:::: idea
The switch turns the partial sum into an integral of $-\zeta'/\zeta\cdot x^s/s$ along a vertical line, and shifting the line left picks up a residue at every pole of $\zeta'/\zeta$, which are the zeros of $\zeta$. The pole at 1 gives the main term $x$, each nontrivial zero gives one term, and the pole of $1/s$ at the origin and the trivial zeros give the small corrections.
::::
:::: sketch {source="vonmangoldt1895-formula"}
This is the argument of the preceding sections. Apply [[eq-ef-perron-psi]] with $c>1$, shift the contour to $\sigma=-U$ collecting the four families of residues listed above, and estimate the horizontal and left sides as described, which gives [[eq-ef-von-mangoldt]] in the limit and the truncated version at finite $T$. Von Mangoldt gave the first complete proof in 1895, for a formula of this kind that Riemann had announced for $\pi(x)$ in 1859 [@riemann1859; @vonmangoldt1895-formula]. Textbook accounts are in Davenport [@davenport], Ingham [@ingham-prime], and Edwards [@edwards].
::::
:::: example
We test [[eq-ef-von-mangoldt]] with the first $N$ zero pairs $\tfrac12\pm i\gamma_n$, computed with `mpmath`. A pair contributes $-2\Re(x^\rho/\rho)$ to the right side, and the base value $x-\log2\pi-\tfrac12\log(1-x^{-2})$ is the right side with no zeros. The columns give the formula with $N$ pairs of zeros, with the exact $\psi_0$ in the last column.

| $x$ | $N=0$ | $N=1$ | $N=10$ | $N=100$ | $N=1000$ | exact $\psi_0(x)$ |
| --- | --- | --- | --- | --- | --- | --- |
| 8 | 6.1700 | 6.5356 | 6.3279 | 6.3442 | 6.3865 | 6.3868 |
| 10 | 8.1671 | 7.7561 | 7.7868 | 7.8265 | 7.8272 | 7.8320 |
| 100 | 98.1622 | 97.1042 | 95.0403 | 93.6700 | 94.0113 | 94.0453 |

At $x=8$, which is a jump of the staircase, the formula converges to the midpoint $\psi_0(8)=6.3868$ and not to either side, $\psi(8^-)=6.0403$ or $\psi(8)=6.7334$. At $x=10$, which is not a jump, the smooth part alone gives $8.167$ while the truth is $7.832$, and the first pair of zeros alone moves it to $7.756$. The convergence is slow in the last column, as expected from the error term $x\log^2(xT)/T$, and one thousand pairs (all zeros up to height $1419$) leave an error of $0.005$ at $x=10$ and $0.034$ at $x=100$.
::::
:::: used
Chapter [[what-rh-says]] turns the truncated version into a bound on $\psi(x)-x$ in terms of $\Theta$, and chapter [[weil-positivity]] generalizes the formula from the kernel $x^s/s$ to an arbitrary test function.
::::
:::::

Two remarks on [[eq-ef-von-mangoldt]] are needed before we read it. The last two terms, $-\log2\pi-\tfrac12\log(1-x^{-2})$, are the correction from the pole of $1/s$ and the trivial zeros, and they are small and almost constant, lying between $-1.84$ and $-1.69$ for $x\ge2$ and within $0.01$ of $-\log2\pi=-1.8379$ once $x\ge10$, so the bulk of the structure sits in the sum over the nontrivial zeros. The second remark is about the sum itself, which converges only conditionally, and section [[s-ef-sum]] explains what that means.

## A dictionary from the plane to the real line {#s-ef-dictionary}

Looking back over the four residues, the same pattern appears each time, and stating it once makes the whole formula easier to remember. Every singularity $s_0$ of $-\zeta'/\zeta$ contributes a term proportional to $x^{s_0}$, and writing $s_0=\sigma_0+it_0$ turns that into $x^{\sigma_0}e^{it_0\log x}$. The real part $\sigma_0$ of the position sets how fast the term grows or decays as $x$ increases, and the imaginary part $t_0$ sets how fast it oscillates in $\log x$. A position in the plane is therefore a pair of numbers, a growth rate and a frequency, and the formula reads each singularity as one behavior of the staircase.

| singularity of $-\zeta'/\zeta$ | where | term in $\psi_0(x)$ | growth | frequency |
| --- | --- | --- | --- | --- |
| the pole of $\zeta$ | $s=1$ | $+x$ | $x^1$ | 0 |
| a nontrivial zero | $s=\beta+i\gamma$ | $-x^\rho/\rho$ | $x^\beta$ | $\gamma$ |
| the pole of $1/s$ | $s=0$ | $-\log2\pi$ | constant | 0 |
| a trivial zero | $s=-2k$ | $+\dfrac{x^{-2k}}{2k}$ | $x^{-2k}$, decaying | 0 |

The table organizes the whole chapter. The pole at $s=1$ is the loudest component because it is the farthest to the right, and it is the line $y=x$ that the staircase follows on average, which is the prime number theorem in this language. The nontrivial zeros sit strictly to its left, by the theorem of chapter [[zeros]] that no zero lies on $\sigma=1$, and so each has a wave that grows like $x^\beta$ with $\beta<1$, which is smaller than $x$ by the factor $x^{\beta-1}$. The prime number theorem $\psi(x)\sim x$ therefore says that the sum of these waves is of smaller order than $x$, and the question of how much smaller is the question about $\beta$ that the Riemann Hypothesis answers. The trivial zeros sit far to the left and have no oscillation, so they contribute decaying powers and not waves, which is why the formula treats them separately in the closed form $-\tfrac12\log(1-x^{-2})$.

The table also gives a way to see why the formula is exact and not approximate. We never discard a singularity, so every statement about $\psi_0(x)$ is a statement about the complete list of singularities of $\zeta'/\zeta$, and conversely knowing $\psi_0(x)$ for all $x$ determines all of them. In the variable $u=\log x$ the staircase is a sum of point masses of weight $\Lambda(n)$ at the positions $u=\log n$, and its frequencies are the zeros, which is a Fourier-type duality between two lists of numbers, the logarithms of prime powers on one side and the ordinates of zeros on the other. Chapter [[weil-positivity]] makes the duality symmetric by replacing the sharp cutoff with an arbitrary test function.

## What the sum over zeros means {#s-ef-sum}

The terms of $\sum_\rho x^\rho/\rho$ do not decay fast enough for the series to converge absolutely, and the formula is true only because of cancellation among oscillating terms. A single term has absolute value $x^\beta/\lvert\rho\rvert\approx x^{1/2}/\lvert\gamma\rvert$, so the sum of absolute values is a constant times $\sqrt x\sum1/\lvert\gamma\rvert$, and that diverges because the zeros accumulate faster than $1/\gamma$ decays. By the count of chapter [[zeros]] there are about $\frac{T}{2\pi}\log T$ zeros below height $T$, and the partial sums $2\sum_{n\le N}1/\lvert\rho_n\rvert$ over zeros of both signs equal $0.67$ at $N=10$, $2.06$ at $N=100$, and $4.64$ at $N=1000$, so they keep growing like a constant times $\log^2T$.

:::: definition {#d-ef-conditional title="Conditionally convergent series and symmetric truncation"}
A series is **conditionally convergent** when it converges but the series of absolute values diverges. Its value then depends on the order of summation, so a rule is needed. The **symmetric truncation** in [[eq-ef-symmetric]] adds all zeros with $\lvert\gamma\rvert<T$, in particular a zero and its conjugate together, and lets $T\to\infty$. It is a rule about the order of terms, and it is not a statement that the terms can be rearranged freely.
::::

Pairing $\rho$ with its conjugate $\bar\rho$ makes every term real, since $x^{\bar\rho}/\bar\rho=\overline{x^\rho/\rho}$, so
$$
\sum_{\lvert\gamma\rvert<T}\frac{x^\rho}{\rho}=2\sum_{0<\gamma<T}\Re\frac{x^\rho}{\rho}.
$$
The partial sums settle down because the phases $x^{i\gamma}=e^{i\gamma\log x}$ rotate at different speeds and the contributions of high zeros average out, much as the Fourier series of a step function converges although its coefficients decay only like $1/n$. Near a jump of the staircase the convergence is slow and the partial sums overshoot, the Gibbs phenomenon familiar from Fourier series, and at the jump itself the series converges to the midpoint $\psi_0$, which is why the theorem is stated for $\psi_0$.

## One pair of zeros is one wave {#s-ef-wave}

The formula becomes useful when we read its terms one pair at a time. Fix a zero $\rho=\beta+i\gamma$ with $\gamma>0$. The two terms from $\rho$ and $\bar\rho$ are complex conjugates, so their sum is real, and writing $x^\rho=x^\beta e^{i\gamma\log x}$ and $\rho=\lvert\rho\rvert e^{i\arg\rho}$ gives
$$
-\frac{x^\rho}{\rho}-\frac{x^{\bar\rho}}{\bar\rho}=-2\Re\frac{x^\rho}\rho=-\frac{2\,x^{\beta}}{\lvert\rho\rvert}\cos\bigl(\gamma\log x-\arg\rho\bigr).
$$ {#eq-ef-wave}
This is a cosine in the variable $u=\log x$ with three numbers attached. The **frequency** is $\gamma$, meaning that the wave repeats every $2\pi/\gamma$ units of $\log x$. The **amplitude** is $2x^\beta/\lvert\rho\rvert$, which grows like the power $x^\beta=e^{\beta u}$. The **phase** is $\arg\rho=\arctan(\gamma/\beta)$, which is within $0.04$ of $\pi/2$ for every zero in our table.

:::: definition {#d-ef-zero-wave title="The wave of a zero"}
For a nontrivial zero $\rho=\beta+i\gamma$ with $\gamma>0$, its **wave** is the real function $W_\rho(x)=-\frac{2x^\beta}{\lvert\rho\rvert}\cos(\gamma\log x-\arg\rho)$ of $x>1$, the sum of the terms of $\rho$ and $\bar\rho$ in [[eq-ef-von-mangoldt]]. It is the contribution of one zero to the count of primes, and it is a wave in $\log x$, not in $x$, so successive crests are spaced by a constant factor of $x$ and not by a constant distance.
::::

For the first zero, $\rho_1=\tfrac12+14.134725i$, the amplitude is $2x^{1/2}/\lvert\rho_1\rvert=0.1414\,\sqrt x$ since $\lvert\rho_1\rvert=14.1436$, the phase is $\arg\rho_1=1.5354$, and the period in $\log x$ is $2\pi/14.134725=0.44452$, so the crests are spaced by the factor $e^{0.44452}=1.5597$ in $x$. At $x=10$ the wave equals $-0.4110$, which is exactly the shift from $8.1671$ to $7.7561$ in the table of the previous section. To see this by hand, note that $\log10=2.302585$, so the argument of the cosine is $14.134725\times2.302585-1.5354=31.0110$, which is $4.9355$ turns of $2\pi$ and so, reduced modulo $2\pi$, is the angle $-0.4050$ with cosine $0.9191$. The amplitude at $x=10$ is $2\sqrt{10}/14.1436=0.4472$, and $-0.4472\times0.9191=-0.4110$. The second zero, $\rho_2=\tfrac12+21.022040i$, has amplitude $0.09511\sqrt x$ and crests spaced by the factor $1.3484$, and the third has $0.07995\sqrt x$ with spacing factor $1.2856$. The weights $2/\lvert\rho_n\rvert$ of the first five zeros are $0.1414$, $0.0951$, $0.0799$, $0.0657$, and $0.0607$, so they decay slowly, like $1/\gamma$.

The importance of $\beta$ appears when we compare the waves with $\sqrt x$. If $\beta=\tfrac12$ the wave oscillates with amplitude $2\sqrt x/\lvert\rho\rvert$, a fixed multiple of $\sqrt x$ that shrinks as $\lvert\rho\rvert$ grows. If a zero had $\beta=0.7$, its amplitude would be $2x^{0.7}/\lvert\rho\rvert$, which at $x=10^{6}$ is already $x^{0.2}=15.8$ times larger than the same wave on the critical line, and the ratio keeps growing as $x^{\beta-1/2}$. A zero off the line always comes with its mirror $1-\beta+i\gamma$ from chapter [[zeros]], whose wave has amplitude $x^{1-\beta}$ and so is the smaller of the two, and the larger wave $x^\beta$ is the one that would show. Dividing the formula by $\sqrt x$ gives the cleanest way to see the hypothesis in this chapter. If all zeros are on the line,
$$
\frac{\psi_0(x)-x}{\sqrt x}=-\sum_{\gamma>0}\frac{2}{\lvert\rho\rvert}\cos\bigl(\gamma\log x-\arg\rho\bigr)-\frac{\log2\pi+\tfrac12\log(1-x^{-2})}{\sqrt x},
$$ {#eq-ef-normalized}
a sum of cosines in $u=\log x$ with fixed weights $2/\lvert\rho\rvert$, summed in order of increasing $\gamma$, plus a term that decays like $1/\sqrt x$. In the $u$ variable the normalized error is therefore a superposition of cosines of different frequencies $\gamma_n$, which never settles down. It is typically of size about one, but it is not bounded: Littlewood proved in 1914 that $(\psi(x)-x)/\sqrt x$ is larger than a constant times $\log\log\log x$ in absolute value, with each sign, for arbitrarily large $x$ [@littlewood1914]. The rare large excursions come from many waves briefly falling into phase.

::::: figure {#f-ef-one-wave viz="zero-wave" height="420"}
A zero at height $\gamma$ contributes a cosine in $\log x$ whose amplitude grows like $x^\beta$, so a zero to the right of the critical line would eventually outgrow the $\sqrt x$ envelope.

```vizspec
Purpose: show how the real part of a zero sets the growth of its wave, to make the stakes of the hypothesis visible.
Scene: horizontal axis u = log x from 0.5 to 8 (with a secondary tick row showing x = e^u at 2, 10, 100, 1000);
  vertical axis the wave value W(x) = -(2 x^beta / |rho|) cos(gamma u - arg rho) with rho = beta + i gamma,
  in y range that auto-scales but is clipped to [-60, 60]. Draw the wave in teal. Draw the envelope
  +-2 x^beta/|rho| as thin teal dashed curves. Draw the reference envelope +-2 sqrt(x)/|rho| in violet (the
  critical-line envelope) and shade the region where the wave's envelope exceeds it in red.
Controls: slider beta from 0.30 to 0.90 in steps of 0.01 (default 0.50, tick at 0.5 in violet); slider gamma from
  5 to 80 (default 14.134725, with snap marks at the first 10 zero ordinates from the kit); a toggle
  "show mirror zero 1-beta" that adds the wave of 1-beta+i gamma in gold with amplitude x^(1-beta).
Motion: dragging beta rescales the envelope smoothly; the red region appears for beta>0.5 and grows with u, and
  the mirror wave shrinks as the main wave grows.
Reader takeaway: at beta=1/2 the wave stays inside the sqrt(x) envelope forever, at beta>1/2 it escapes by a
  factor x^(beta-1/2), and the symmetry of zeros forces the pairing beta, 1-beta.
Data: first 200 zero ordinates (kit provides them).
```
:::::

## The primes as a chord {#s-ef-chord}

Put the pieces together and the formula says that the staircase of primes is a sum of waves, one pair of zeros per wave, each with its own frequency $\gamma_n$ and a volume that falls off slowly with $\gamma_n$. This is where the phrase "the music of the primes" becomes a literal statement. The frequencies are the heights of the zeros, which are not integer multiples of a fundamental, so the chord is not harmonic in the way a violin note is, and the notes are the list $14.134725$, $21.022040$, $25.010858$, $30.424876$, $32.935062$, and so on, that we computed in chapter [[zeros]]. The pitch axis is $\log x$, and the staircase is the sound that those notes make. Reading from the lowest note upward, the first wave gives a slow rise and fall that repeats every factor of $1.56$ in $x$, the second adds a faster ripple, and each further note sharpens the detail.

:::: definition {#d-ef-spectrum title="The spectrum of the primes"}
The **spectrum of the primes** is the multiset of frequencies $\{\gamma\}$ with which the waves in [[eq-ef-wave]] oscillate in $\log x$, that is the ordinates of the nontrivial zeros, with the amplitude of each given by $2x^\beta/\lvert\rho\rvert$. It is our name for the set of zeros read as a set of frequencies, and it is a statement about the explicit formula and not a separate theorem.
::::

The picture explains why the formula needs infinitely many zeros. The staircase has a vertical jump of height $\log p$ at each prime power, and a sum of finitely many cosines is smooth, so only the full infinite chord can make a jump. At $x=p^k$ the waves must add up to a rise of $\log p$ at once, and between prime powers they must cancel to leave a flat stretch. Adding zeros one pair at a time is like adding notes to a chord until the sound becomes a sharp click. The sharpness is limited by the highest note included. A wave of frequency $\gamma$ cannot resolve features narrower than about $2\pi/\gamma$ in $\log x$, so with the first 200 zeros, whose highest ordinate is $\gamma_{200}=396.38$, the resolution is $2\pi/396.38=0.0159$ in $\log x$, which at $x=60$ is a window of about $0.95$ in $x$ itself. That is why the figure below stops at $x=60$, where consecutive primes such as $59$ and $61$ are still just separated, and why it would take many more zeros to draw the staircase cleanly at $x=10^6$, where consecutive primes differ by a relative amount of about $10^{-5}$.

The chord also explains the stakes of the next chapter. The loudness of a note is $x^\beta/\lvert\rho\rvert$. With every $\beta=\tfrac12$ each note grows like $\sqrt x$, and chapter [[what-rh-says]] shows that the whole chord then grows like $\sqrt x$ up to a factor $\log^2x$, which is the quietest it can be given that the zeros exist at all. A zero with $\beta>\tfrac12$ would be a note whose volume grows faster than $\sqrt x$, a note that sooner or later outshouts all the others.

::::: figure {#f-ef-rebuild viz="rebuild-staircase" height="520"}
Adding the waves of the zeros one pair at a time turns the smooth line $y=x$ into the staircase of the prime powers, with each new wave sharpening the steps.

```vizspec
Purpose: the centerpiece of Part I, showing the explicit formula rebuilding psi(x) from its zeros.
Scene: main panel with x on the horizontal axis in [2, 60] and y in [0, 62]. Draw psi_0(x) (the staircase, computed
  from primes up to 60) in pale gold, with a thin gold dot at the midpoint of each jump. Draw the line y=x
  in blue dashed. Draw the partial explicit formula
  f_N(x) = x - log(2 pi) - (1/2) log(1 - x^-2) - 2 sum_{n<=N} Re(x^{rho_n}/rho_n)
  as a bright teal curve, sampled at 1500 points. Below it, a second panel on the same x axis shows the single
  current wave W_{rho_N}(x) = -2 Re(x^{rho_N}/rho_N) in teal, y range [-1.2, 1.2] (the largest weight is
  about 0.14 times sqrt(60) = 1.1). A third narrow strip at the bottom is the "spectrum": a horizontal axis of
  gamma from 0 to 400 with a vertical tick at each of the first 200 zero ordinates, the first N ticks lit in
  teal, the N-th tick highlighted in red, and the others dim.
Controls: slider N from 0 to 200 (default 0), play/pause button that steps N upward at about 6 steps per
  second, a step-back and step-forward button, a checkbox "show the wave of the current zero", a checkbox
  "show the error curve f_N - psi_0" in red at the bottom of the main panel, and a readout of N, gamma_N,
  and the maximum of |f_N - psi_0| over x in [2, 60] excluding 0.5 around each jump.
Motion: when N changes the teal curve morphs to the new partial sum over about 200 ms, the current wave is
  drawn in the second panel, and the tick for gamma_N lights up; the curve at N=0 is a smooth near-line, at
  N=10 shows the first steps, and at N=200 sits on the staircase except for a Gibbs overshoot at each jump.
Reader takeaway: the staircase of primes is the sum of the waves of the zeros, and higher zeros fill in finer
  detail, with the steps sitting at the prime powers.
Data: first 200 zero ordinates, primes, psi (kit provides them).
```
:::::

::::: figure {#f-ef-contour viz="contour-shift" height="440"}
Dragging the integration line leftward collects one residue at each pole of $\zeta'/\zeta$, and the running total is the explicit formula.

```vizspec
Purpose: make the contour shift visible and show where each term of the explicit formula comes from.
Scene: the complex s-plane with sigma in [-5, 3] and t in [-40, 40] (t axis compressed). Draw the vertical line
  Re s = c as a gold line, initially c = 2. Mark the pole at s=1 with a blue dot, the pole at s=0 with a
  muted dot, the trivial zeros -2 and -4 as hollow circles, and the first 12 pairs of zeros at sigma=1/2
  as teal dots (kit list). The region between the draggable line and the original line c=2 is shaded
  lightly. A right panel lists, for a chosen value of x (slider, default 10), the running total of residues
  collected so far, split into: the pole at 1 (blue), zeros collected (teal), the pole at 0 and trivial zeros
  (muted), and the target psi_0(x) as a horizontal gold marker.
Controls: a draggable vertical line with sigma from 2.5 down to -4; a slider for x in [2, 60]; a slider
  "height cutoff T" from 20 to 400 (the horizontal sides appear at +-T and zeros above T are not collected).
Motion: as the line crosses a pole, a ring pulses around it and its residue is added to the right panel with
  a short animation; the total slides toward psi_0(x).
Reader takeaway: each term of the explicit formula is the residue of -zeta'/zeta x^s/s at one pole, and the
  zeros between the original line and the left edge are exactly the ones collected.
Data: first 200 zero ordinates and psi (kit provides them).
```
:::::

:::: aside
Riemann's own formulation in 1859 was for $\pi(x)$ and not for $\psi(x)$. He defined $J(x)=\sum_{n\ge1}\pi(x^{1/n})/n$, found $J(x)=\operatorname{li}(x)-\sum_\rho\operatorname{li}(x^\rho)-\log2+\int_x^\infty\frac{\dd t}{t(t^2-1)\log t}$ for $x>1$, and recovered $\pi(x)$ by Möbius inversion, so that his wave is the integral logarithm $\operatorname{li}(x^\rho)$ in place of $x^\rho/\rho$. The two versions carry the same information, and the one for $\psi$ is simpler because $-\zeta'/\zeta$ already has $\Lambda$ as its coefficients, which is why this page uses it. Edwards [@edwards] follows Riemann's route in detail.
::::

:::: recap
The reader now has the following.

- The switch $\frac1{2\pi i}\int_{c-i\infty}^{c+i\infty}y^s\frac{\dd s}{s}$ equals 1 for $y>1$ and 0 for $y<1$, with a truncation error of $y^c/(\pi T\lvert\log y\rvert)$.
- Applied to $-\zeta'/\zeta$ it gives $\psi_0(x)$ as a contour integral, and moving the contour left collects residues at $s=1$, at each nontrivial zero, at $s=0$, and at the trivial zeros.
- Von Mangoldt's formula $\psi_0(x)=x-\sum_\rho x^\rho/\rho-\log2\pi-\tfrac12\log(1-x^{-2})$, with the sum read as a symmetric limit, was tested numerically at $x=8$, $10$, and $100$.
- A pair of zeros is one real wave $-\frac{2x^\beta}{\lvert\rho\rvert}\cos(\gamma\log x-\arg\rho)$ in $\log x$, of frequency $\gamma$ and amplitude growing like $x^\beta$, so the position of the zeros decides how fast the waves can grow.

Chapter [[what-rh-says]] converts this picture into a theorem on the size of $\psi(x)-x$, and reads the hypothesis as the statement that the staircase is as quiet as it can be.
::::
