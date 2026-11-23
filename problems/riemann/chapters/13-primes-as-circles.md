---
id: primes-as-circles
title: "Primes as circles: orbital bases and their traces"
part: 3
summary: After this chapter you can compute the trace of a convolution operator on a circle of length log p in two ways, show by Poisson summation that the two answers agree, and see why the answer is zero for every prime beyond the support of the test function.
needs: [tate-theta]
---

::: plain
Wrap the positive real line around a circle so that the numbers $1, p, p^2, p^3, \dots$ all land on the same point. Smoothing along that circle by a test function is an infinite matrix in the basis of waves on the circle, and its trace, the sum of the diagonal entries, can be read off in two ways: as a sum over the waves, or as a sum over the powers of $p$. The two answers agree, and when the test function is too short to stretch from $1$ to $p$ the trace is exactly zero. Deleting the multiples of a prime from a theta sum produces exactly this circle, so every prime larger than the test function's reach contributes nothing.
:::

The previous chapter turned the zeros of $\zeta$ into the spectrum of an operator: on the quotient of all functions by the weighted theta sums, convolution by $\varphi$ acts with eigenvalues $M\varphi(\rho-\tfrac12)$. That is one side of a trace formula. The other side has to come from the primes, and the proof gets it by taking the theta sums apart one prime at a time. This chapter computes what one such step contributes. The answer is a trace on a circle of length $\log p$, and the fact that this trace vanishes once $p$ is large is the mechanism the whole route turns on: it lets [[cutting-the-kernel]] throw away every prime beyond a finite set. The source calls these bases "the crux of the matter" [@masullo, §1.4.9, p. 31].

## A circle on the multiplicative line {#s-pc-circle}

Everything in this chapter lives on $\RR_{>0}$ with the measure $\dd t/t$, the measure that does not change when $t$ is rescaled. Fix a number $\lambda>1$, think of it as a prime $p$, and declare two positive reals equivalent when their ratio is a power of $\lambda$.

:::: definition {#d-pc-circle title="the toy circle of length $\log\lambda$"}
The *toy circle* is the quotient group $\RR_{>0}/\lambda^{\ZZ}$, in which $x$ and $\lambda^kx$ are the same point for every $k\in\ZZ$. Every point has exactly one representative in $[1,\lambda)$. The measure $\dd t/t$ on $[1,\lambda)$ gives it total length
$$
\int_1^\lambda\frac{\dd t}{t}=\log\lambda .
$$
In the coordinate $u=\log t$ it is the circle $\RR/(\log\lambda)\ZZ$. A function on the toy circle is the same thing as a function $\psi$ on $\RR_{>0}$ with $\psi(\lambda x)=\psi(x)$ for all $x$. It is not a subset of $\RR_{>0}$, and its functions do not decay: they repeat forever in both directions.
::::

The way to make a periodic function out of an ordinary one is to add up all its rescaled copies, exactly as Poisson summation periodizes a function on $\RR$ by adding its translates.

:::: definition {#d-pc-periodization title="periodization over powers of $\lambda$"}
For a function $\psi$ on $\RR_{>0}$ that decays faster than every power of $t$ at $0$ and at $\infty$ (the space $S_E(\RR_{>0})$ of [[tate-theta]]), its *periodization* is
$$
\Phi_\lambda\psi(x)=\sum_{k\in\ZZ}\psi(\lambda^kx).
$$
The sum converges with all derivatives, and $\Phi_\lambda\psi(\lambda x)=\Phi_\lambda\psi(x)$, so $\Phi_\lambda\psi$ is a smooth function on the toy circle. The operator $\Phi_\lambda$ is the source's "monogenic periodization" [@masullo, Definition 4.2.1.1, p. 162].
::::

Two different functions can have the same periodization, and the difference between them is what the circle forgets. The simplest function the circle cannot see is $\psi(x)-\psi(\lambda x)$, because its periodization telescopes: the copy $\psi(\lambda^kx)$ is added once and subtracted once.

:::: proposition {#t-pc-kernel title="Periodization forgets exactly the differences $\psi(x)-\psi(\lambda x)$, which on the Mellin side are the multiples of $1-\lambda^{-s}$" source="masullo" loc="Lemma 4.2.1.5, p. 165; Example 1.8.1.1, pp. 40 to 41"}
The map $\Phi_\lambda$ from $S_E(\RR_{>0})$ onto the smooth functions on the toy circle is continuous, surjective, and open, and its kernel is the closure of the span of the functions $x\mapsto\psi(x)-\psi(\lambda x)$. Under the Mellin transform $M\psi(s)=\int_0^\infty\psi(t)t^s\,\dd t/t$ the function $\psi(x)-\psi(\lambda x)$ becomes
$$
(1-\lambda^{-s})\,M\psi(s),
$$
so the circle is the quotient "entire functions modulo multiples of $1-\lambda^{-s}$", and such a quotient is described by the values at the zeros $s=2\pi im/\log\lambda$ of $1-\lambda^{-s}$.
::::

The Mellin identity is the substitution $t\mapsto t/\lambda$: $\int_0^\infty\psi(\lambda t)t^s\,\dd t/t=\lambda^{-s}M\psi(s)$. The source remarks that $1-\lambda^{-s}$ "is reminiscent of a reciprocal Euler factor" [@masullo, p. 41], and with $\lambda=p$ it is one: $\prod_p(1-p^{-s})^{-1}=\zeta(s)$.

The points $s=2\pi im/\log\lambda$ deserve a name, because they index everything that follows.

::: symbols
| Symbol | What it is | Kind | Where it lives |
| --- | --- | --- | --- |
| $z_m$ | $2\pi im/\log\lambda$, the $m$th zero of $1-\lambda^{-s}$ | a point on the imaginary axis | $m\in\ZZ$ |
| $e_m$ | $e_m(t)=t^{z_m}=e^{2\pi im\log t/\log\lambda}$ | a function on the toy circle | the exponential basis |
| $c_m(\psi)$ | $\frac1{\log\lambda}\int_1^\lambda\psi(t)\,t^{-z_m}\,\frac{\dd t}t$ | a number, the $m$th Fourier coefficient | a linear functional on circle functions |
| $\Phi_\lambda$ | periodization $\psi\mapsto\sum_k\psi(\lambda^k\,\cdot)$ | an operator | $S_E(\RR_{>0})\to$ circle functions |
:::

Each $e_m$ is $\lambda$-periodic because $\lambda^{z_m}=e^{2\pi im}=1$. In the coordinate $u=\log t$ the functions $e_m$ are the waves $e^{2\pi imu/\log\lambda}$ and $c_m$ is the usual Fourier coefficient, so a smooth circle function is its Fourier series, $\psi=\sum_mc_m(\psi)\,e_m$, with coefficients that decay faster than any power of $m$ [@ss-fourier, Chapter 3]. The coefficients of a periodization are values of a Mellin transform: unfolding the integral over $[1,\lambda)$ into an integral over $\RR_{>0}$,
$$
c_m(\Phi_\lambda\psi)=\frac1{\log\lambda}\sum_{k\in\ZZ}\int_1^\lambda\psi(\lambda^kt)\,t^{-z_m}\,\frac{\dd t}t=\frac1{\log\lambda}\int_0^\infty\psi(t)\,t^{-z_m}\,\frac{\dd t}t=\frac{M\psi(-z_m)}{\log\lambda},
$$ {#eq-pc-unfold}
where each substitution $t\mapsto\lambda^{-k}t$ leaves $t^{-z_m}$ unchanged because $\lambda^{kz_m}=1$. This is the concrete content of [[t-pc-kernel]]: $\Phi_\lambda\psi=0$ exactly when $M\psi$ vanishes at every $z_m$.

## What a Schauder basis buys {#s-pc-schauder}

In finite dimensions the trace of a linear map is the sum of the diagonal entries of its matrix in any basis. The circle functions form an infinite-dimensional space, and the proof needs the same bookkeeping there, so it needs a basis in a sense that survives infinite sums.

:::: definition {#d-pc-schauder title="Schauder basis"}
A *Schauder basis* of a topological vector space $E$ is a sequence $(x_m)$ in $E$ together with continuous linear functionals $(f_m)$, the *coefficient functionals*, with $f_m(x_n)=1$ if $m=n$ and $0$ otherwise, such that every $u\in E$ is the convergent sum $u=\sum_mf_m(u)\,x_m$. It is *absolute* when these sums converge absolutely for every continuous seminorm. A Schauder basis is not a Hamel basis: infinite sums are allowed, and the coefficient functionals must be continuous. It need not be orthonormal, and the space need not carry an inner product.
::::

Continuity of the coefficient functionals is the whole point: a functional that is not continuous cannot be passed through a limit, and every computation below is a limit. Once a basis with continuous coefficients exists, an operator $A$ has a matrix with entries $f_m(Ax_n)$, and for the operators that matter here (nuclear operators, the analog of trace-class operators on spaces such as $S_E$) the trace equals the sum of the diagonal entries $\sum_mf_m(Ax_m)$. The source quotes this from Litvinov and builds all of its trace computations on it [@masullo, §4.1.1, p. 158, Theorem 7.4.2.1, p. 367]. So an explicit basis lets a trace be computed like the trace of a matrix, and a basis in which the operator is diagonal makes the trace a sum of eigenvalues. Our reference for Schauder bases in locally convex spaces is Jarchow [@jarchow, Chapter 14].

:::: theorem {#t-pc-exponential title="The waves $t^{z_m}$ form an absolute Schauder basis of the smooth functions on the toy circle, with the Fourier coefficients as coefficient functionals" source="masullo" loc="Lemma 4.2.1.2, p. 162"}
For every $\lambda>1$ the functions $e_m(t)=t^{2\pi im/\log\lambda}$, $m\in\ZZ$, with coefficient functionals $c_m$, form an absolute Schauder basis of the space of smooth functions on $\RR_{>0}/\lambda^\ZZ$.
::::

::: sketch {source="masullo" loc="Lemma 4.2.1.2, p. 162; §4.1.1, p. 157"}
In the coordinate $u=\log t$ this is the classical statement that a smooth periodic function equals its Fourier series, with coefficients decaying faster than every power of $m$, so the series converges absolutely in every derivative. The source calls the result "well known" and calls the basis the exponential system.
:::

## The trace on the circle, computed twice {#s-pc-trace}

Convolution $A(\varphi)\psi(x)=\int_0^\infty\varphi(t)\psi(x/t)\,\dd t/t$, for $\varphi$ smooth and compactly supported on $\RR_{>0}$, averages rescaled copies of $\psi$. Rescaling commutes with the identification $x\sim\lambda x$, so $A(\varphi)$ maps $\lambda$-periodic functions to $\lambda$-periodic functions and commutes with $\Phi_\lambda$. It therefore acts on the toy circle, and there it can be computed in two ways, which we now do.

The first computation uses the basis. Apply $A(\varphi)$ to a wave:
$$
A(\varphi)e_m(x)=\int_0^\infty\varphi(t)\Bigl(\frac xt\Bigr)^{z_m}\frac{\dd t}t=x^{z_m}\int_0^\infty\varphi(t)\,t^{-z_m}\,\frac{\dd t}t=M\varphi(-z_m)\,e_m(x).
$$
Every wave is an eigenvector, so the matrix of $A(\varphi)$ in the exponential basis is diagonal with entries $M\varphi(-z_m)$. As $m$ runs over $\ZZ$ so does $-m$, and the sum of the diagonal is $\sum_mM\varphi(z_m)$. In the source's words, the trace "is the sum of the eigenvalues" [@masullo, p. 41].

The second computation uses the points. Write $A(\varphi)$ as an integral over the circle: substitute $y=x/t$, so that $\dd t/t=\dd y/y$, and fold $\RR_{>0}$ onto $[1,\lambda)$ using the periodicity of $\psi$,
$$
A(\varphi)\psi(x)=\int_0^\infty\varphi\Bigl(\frac xy\Bigr)\psi(y)\,\frac{\dd y}y=\int_1^\lambda k_\lambda(x,y)\,\psi(y)\,\frac{\dd y}y,\qquad k_\lambda(x,y)=\sum_{k\in\ZZ}\varphi\Bigl(\lambda^k\frac xy\Bigr).
$$
The function $k_\lambda$ is the integral kernel of $A(\varphi)$ on the circle, the continuous analog of a matrix with rows indexed by $x$ and columns by $y$, and the analog of the diagonal sum is the integral of the kernel along the diagonal $y=x$. On the diagonal $k_\lambda(x,x)=\sum_k\varphi(\lambda^k)$ does not depend on $x$, so its integral over a circle of length $\log\lambda$ is $\log\lambda\sum_k\varphi(\lambda^k)$. The points $\lambda^k$ have a geometric meaning: moving a point $x$ of the circle by the factor $t$ brings it back to itself exactly when $t\in\lambda^\ZZ$, so $\lambda^k$ is the closed orbit that winds $k$ times around the circle, and $\varphi(\lambda^k)$ is how much the test function weighs that orbit.

Nothing so far says that the diagonal sum of the matrix and the diagonal mass of the kernel agree. For a finite matrix they are the same number by definition, but here one is a sum over frequencies and the other a sum over orbit points, and the identity between them is Poisson summation.

::::: card {#t-pc-circle-trace kind="theorem" title="The trace of convolution on a circle of length $\log\lambda$ is the sum of the Mellin transform over the zeros of $1-\lambda^{-s}$, and equals $\log\lambda$ times the sum of $\varphi$ over the powers of $\lambda$" source="masullo" loc="Example 1.8.1.1, pp. 40 to 41"}
:::: statement
Let $\lambda>1$, $z_m=2\pi im/\log\lambda$, and $\varphi$ smooth with compact support in $\RR_{>0}$. On the smooth functions on $\RR_{>0}/\lambda^\ZZ$ the operator $A(\varphi)$ is diagonal in the exponential basis with eigenvalues $M\varphi(-z_m)$, these are absolutely summable, and
$$
\operatorname{Tr}A(\varphi)=\sum_{m\in\ZZ}M\varphi\Bigl(\frac{2\pi im}{\log\lambda}\Bigr)=\log\lambda\sum_{k\in\ZZ}\varphi(\lambda^k)=\int_1^\lambda k_\lambda(x,x)\,\frac{\dd x}x.
$$ {#eq-pc-circle-trace}
::::
:::: plain
The trace of smoothing along a circle can be counted by frequencies or by laps. Counting by frequencies adds up how much each wave is amplified. Counting by laps adds up how much the test function weighs each whole number of trips around the circle, times the length of the circle. Both counts give the same number.
::::
:::: why
Every orbital trace in [[cutting-the-kernel]] is this identity with $\lambda=p$. The left side is what the basis gives, and it is the side that exists inside the function spaces of the proof. The right side is what makes the answer computable and, for large $p$, zero.
::::
:::: idea
In the coordinate $u=\log t$ the test function becomes $f(u)=\varphi(e^u)$, an ordinary bump on $\RR$, the Mellin transform at $z_m$ becomes its Fourier transform at the frequency $m/\log\lambda$, and the powers $\lambda^k$ become the lattice points $k\log\lambda$. Poisson summation for the lattice $(\log\lambda)\ZZ$ says that summing $f$ over the lattice equals summing $\hat f$ over the dual lattice, divided by the lattice spacing.
::::
:::: proof
*Step 1, eigenvalues.* The computation before the statement gives $A(\varphi)e_m=M\varphi(-z_m)\,e_m$. Since the $e_m$ form a basis with coefficient functionals $c_m$ ([[t-pc-exponential]]), the diagonal entries of the matrix are $c_m(A(\varphi)e_m)=M\varphi(-z_m)$.

*Step 2, summability.* Put $f(u)=\varphi(e^u)$, a smooth function with compact support on $\RR$. Then $M\varphi(iy)=\int_\RR f(u)e^{iyu}\,\dd u$, and integrating by parts twice gives $\abs{M\varphi(iy)}\le\norm{f''}_{L^1}/y^2$ for $y\ne0$. So $\sum_m\abs{M\varphi(z_m)}<\infty$. An operator that is diagonal in a basis with absolutely summable eigenvalues is nuclear, and its trace is the sum of the eigenvalues. On the Hilbert space $L^2$ of the circle with the measure $\dd t/(t\log\lambda)$, in which the $e_m$ are orthonormal, this is the definition of a trace-class diagonal operator. The source states nuclearity on the smooth functions [@masullo, p. 41]. Reindexing $m\to-m$, $\operatorname{Tr}A(\varphi)=\sum_mM\varphi(z_m)$.

*Step 3, Fourier transform.* With $\hat f(\eta)=\int_\RR f(u)e^{-2\pi iu\eta}\,\dd u$ as in [[complex-toolkit]],
$$
M\varphi(-z_m)=\int_\RR f(u)\,e^{-2\pi imu/\log\lambda}\,\dd u=\hat f\Bigl(\frac m{\log\lambda}\Bigr).
$$

*Step 4, Poisson summation.* Apply Poisson summation $\sum_kF(k)=\sum_m\hat F(m)$ to the compactly supported smooth function $F(x)=f(x\log\lambda)$, whose transform is $\hat F(\eta)=\hat f(\eta/\log\lambda)/\log\lambda$:
$$
\sum_{k\in\ZZ}f(k\log\lambda)=\frac1{\log\lambda}\sum_{m\in\ZZ}\hat f\Bigl(\frac m{\log\lambda}\Bigr).
$$
The left side is $\sum_k\varphi(\lambda^k)$. By Step 3 the right side is $\frac1{\log\lambda}\sum_mM\varphi(-z_m)=\frac1{\log\lambda}\sum_mM\varphi(z_m)$. Multiplying by $\log\lambda$ gives the second equality of [[eq-pc-circle-trace]].

*Step 5, the kernel.* The kernel computation before the statement gives $k_\lambda(x,x)=\sum_k\varphi(\lambda^k)$ for every $x$, and $\int_1^\lambda\dd x/x=\log\lambda$, which is the third equality.
::::
:::: example
Take $\lambda=2$ and the bump $\varphi(t)=\operatorname{bump}\bigl((\log t-0.5)/0.6\bigr)$ with $\operatorname{bump}(x)=e^{-1/(1-x^2)}$ for $\abs x<1$ and $0$ otherwise, so $\varphi$ lives on $\log t\in(-0.1,1.1)$, that is on $t\in(0.905,3.004)$. Two orbit points fall in the support, $t=1$ and $t=2$, with $\varphi(1)=0.0379029$ and $\varphi(2)=0.3277162$, so the right side is $\log2\times0.3656191=0.2534278$. On the left, the $m=0$ term is $M\varphi(0)=0.2663963$, and adding the pairs $\pm m$ gives the partial sums
$$
0.2712885,\ 0.2546214,\ 0.2548982,\ 0.2529194,\ 0.2532840,\ 0.2530149,\ 0.2532958,\ 0.2532840
$$
for $\abs m\le1,\dots,8$, and the full sum over $\abs m\le60$ is $0.2534278$, agreeing with the right side to nine digits. With $\lambda=3$ and the bump on $\log t\in(-0.3,1.5)$ both sides are $0.4411483$. (Computed with mpmath by quadrature of $M\varphi$ on the imaginary axis.)
::::
:::: used
- [[t-pc-vanishing]]: the right side is zero when no orbit point meets the support.
- [[t-pc-orbital-trace]]: the same identity with $\lambda=p$ on the quotient of theta sums at $p$.
- [[cutting-the-kernel]]: the diagonal mass of each slice of the sieve.
::::
:::::

:::: figure {#f-pc-balance viz="pc-trace-balance" height="460"}
The sum over frequencies and the sum over orbit points always balance, and both are zero when the support of the test function fits between two consecutive powers of lambda.

```vizspec
Purpose: show the two sides of the circle trace formula agreeing as the test function and the circle length change.
Scene: two stacked panels sharing nothing but the readout.
  Top panel ("orbit side"): horizontal axis u = log t from -3 to 3. Draw the test function f(u) = beta((u - c)/r), beta(x) = exp(-1/(1 - x^2)) for |x| < 1, else 0, as a filled blue curve. Draw vertical gold ticks at the orbit points u = k log(lambda) for every integer k in view. At each tick draw a gold bar of height f(k log lambda) (the value phi(lambda^k)).
  Bottom panel ("frequency side"): horizontal axis m from -12 to 12. For each m draw a teal stem of height Re M(m) where M(m) = integral of f(u) exp(2 pi i m u / log lambda) du (compute by the trapezoid rule on 400 points over [c - r, c + r]; the imaginary parts cancel in pairs m, -m). Over the stems draw a muted polyline of the running symmetric partial sums S_N = sum over |m| <= N of Re M(m), N = 0..12.
Controls: slider lambda from 1.3 to 8 (default 2); drag the bump horizontally to set c in [-2.5, 2.5] (default 0.5); slider r (half-width) from 0.05 to 2 (default 0.6).
Readout: "frequency side = sum_m M(z_m) ≈ S_12" and "orbit side = log(lambda) * sum_k phi(lambda^k)", both to 5 decimals; when both are below 1e-4 in absolute value, color the readout red and add "no orbit point in the support".
Motion: everything updates live while dragging; no animation otherwise.
Reader takeaway: the two numbers always agree; when the bump sits strictly between two gold ticks the orbit side is 0 and the teal stems, though individually nonzero, cancel.
Check values: lambda = 2, c = 0.5, r = 0.6 gives 0.25343 on both sides; lambda = 2, c = log(2)/2 = 0.3466, r = 0.3 gives 0.
```
::::

## When the trace vanishes {#s-pc-vanishing}

The right side of [[eq-pc-circle-trace]] only looks at $\varphi$ on the orbit points $\lambda^k$, so a test function that misses all of them has trace zero, however large its individual eigenvalues are.

:::: corollary {#t-pc-vanishing title="The circle trace is zero when the support of $\varphi$ contains no power of $\lambda$" source="masullo" loc="Example 1.8.1.1, p. 41; pp. 17, 19"}
If $\operatorname{supp}\varphi\subset(1,\lambda)$, then $\operatorname{Tr}A(\varphi)=0$ on the toy circle. More generally, if $\varphi(1)=0$ and $\operatorname{supp}\varphi\subset(1/Y,Y)$ with $Y\le\lambda$, then $\operatorname{Tr}A(\varphi)=0$.
::::

::: proof
In the first case no $\lambda^k$ lies in $(1,\lambda)$: $\lambda^k\le1$ for $k\le0$ and $\lambda^k\ge\lambda$ for $k\ge1$. In the second case, $\lambda^k\ge\lambda\ge Y$ for $k\ge1$ and $\lambda^k\le1/\lambda\le1/Y$ for $k\le-1$, so these points lie outside the open interval $(1/Y,Y)$ that contains the support, and the term $k=0$ is $\varphi(1)=0$. In both cases every term of $\log\lambda\sum_k\varphi(\lambda^k)$ vanishes.
:::

The source states the first form. The second is the form the proof uses, because the test functions of the trace formula vanish at $1$ and have support in a window $(1/Y,Y)$ around it (in our notation; the source writes $T$ for $Y$). Read through the orbits it says something intuitive: a test function whose reach is shorter than one lap of the circle cannot see the circle close up, so it registers no closed orbit.

::: example
Take $\lambda=2$ and the bump $\varphi(t)=\operatorname{bump}\bigl((\log t-\tfrac12\log2)/0.3\bigr)$, supported on $t\in(1.047,1.910)\subset(1,2)$. The eigenvalue sum starts with $M\varphi(0)=0.1331981$, and the pairs $\pm1$ contribute $2\Re M\varphi(z_1)=-0.1395792$, so after $\abs m\le1$ the partial sum is $-0.0063811$, and the next partial sums are $-0.0200422$, $-0.0101432$, $-0.0012386$, $0.0026308$, $0.0028999$. They oscillate toward $0$, the value of the orbit side, while no single term is small. The trace vanishes by cancellation among the eigenvalues, not because any eigenvalue vanishes.
:::

The proof will apply this to functions multiplied by the weight $t^{1/2}$ of [[tate-theta]], and the vanishing survives the weight. On functions $\psi$ with $t^{-c}\psi$ periodic, for a real $c$, the basis is $t^{c+z_m}$, the eigenvalues are $M\varphi(-c-z_m)$, and the same five steps give (in our notation, by a computation of ours)
$$
\sum_{m\in\ZZ}M\varphi(-c+z_m)=\log\lambda\sum_{k\in\ZZ}\lambda^{-ck}\varphi(\lambda^k).
$$ {#eq-pc-weighted-trace}
Each orbit point now carries the factor $\lambda^{-ck}$, so the right side vanishes under the same conditions. For the first example above with $c=\tfrac12$ both sides equal $\log2\,(\varphi(1)+2^{-1/2}\varphi(2))=0.1868955$.

## Deleting the multiples of a prime {#s-pc-delete}

The toy circle becomes arithmetic when $\lambda=p$ and the periodized functions are theta sums. Recall from [[tate-theta]] the theta sum $\Theta_g(t)=\sum_{n\ne0}g(nt)$ of an even Schwartz function $g$ with $g(0)=0$ and $\int_\RR g=0$ (call such $g$ *admissible*), its Mellin transform $2\zeta(s)Mg(s)$ with $Mg(s)=\int_0^\infty g(t)t^s\,\dd t/t$, and the operator $D_p$ that deletes the multiples of $p$. The lemma below restates [[t-tt-dp]] in the form this chapter uses.

:::: lemma {#t-pc-delete title="Deleting the multiples of $p$ from a theta sum is the difference of the sum and its rescaling by $p$, and multiplies the Mellin transform by $1-p^{-s}$"}
For every prime $p$ and every admissible $g$,
$$
D_p\Theta_g(t)=\sum_{n\ne0,\ p\nmid n}g(nt)=\Theta_g(t)-\Theta_g(pt),\qquad M(D_p\Theta_g)(s)=(1-p^{-s})\,2\zeta(s)Mg(s).
$$
In particular $D_p\Theta_g=\Theta_{g-g(p\,\cdot)}$ is again a theta sum.
::::

::: proof
The integers $n\ne0$ divisible by $p$ are exactly $n=pn'$ with $n'\ne0$, so $\sum_{p\mid n}g(nt)=\sum_{n'\ne0}g(n'pt)=\Theta_g(pt)$, and subtracting from $\Theta_g(t)$ leaves the sum over $p\nmid n$. The Mellin identity is [[t-pc-kernel]] with $\lambda=p$. The function $g-g(p\,\cdot)$ is even and Schwartz, vanishes at $0$, and has integral $\int g-\tfrac1p\int g=0$.
:::

On the Mellin side the factor $1-p^{-s}$ removes the Euler factor at $p$ from $\zeta(s)=\prod_q(1-q^{-s})^{-1}$, leaving $\sum_{p\nmid n}n^{-s}$. In adelic language, [[tate-theta]] showed that $D_p$ replaces the indicator of $\ZZ_p$ by the indicator of the units $\ZZ_p^\times$, which is the source's Weil principal value operator $\mathrm{PV}_p$ [@masullo, §5.3, p. 240, p. 18].

A concrete theta sum makes every quantity checkable. Let
$$
g_\star(x)=(4\pi^2x^4-6\pi x^2)\,e^{-\pi x^2}.
$$
It is even and Schwartz, $g_\star(0)=0$, and $\int_\RR g_\star=4\pi^2\cdot\tfrac3{4\pi^2}-6\pi\cdot\tfrac1{2\pi}=0$. Its Mellin transform is $\tfrac12\pi^{-s/2}\bigl(4\Gamma(\tfrac s2+2)-6\Gamma(\tfrac s2+1)\bigr)=\tfrac12s(s-1)\pi^{-s/2}\Gamma(\tfrac s2)$, so
$$
M\Theta_{g_\star}(s)=2\zeta(s)\cdot\tfrac12s(s-1)\pi^{-s/2}\Gamma(\tfrac s2)=2\,\xi(s).
$$ {#eq-pc-gstar}
The function $g_\star$ is our choice. At $s=2$ a numerical Mellin transform of $\Theta_{g_\star}$ gives $1.0471976$ and $2\xi(2)=\pi/3=1.0471976$, and at $s=0.3+2i$ both are $0.9068972-0.0168735i$. The sum is concentrated near $t=1$: $\Theta_{g_\star}(1)=1.7867876$, $\Theta_{g_\star}(2)=0.0038797$, $\Theta_{g_\star}(0.2)=1.9\times10^{-29}$ (by [[t-tt-riemann-roch]] it equals $5\,\Theta_{g_\star}(5)$). Deleting the even terms, at $t=0.4$ both $\Theta_{g_\star}(0.4)-\Theta_{g_\star}(0.8)$ and $\sum_{2\nmid n}g_\star(0.4n)$ equal $-1.2351560$.

:::: definition {#d-pc-orbital-quotient title="orbital quotient at $p$"}
The *orbital quotient at $p$* is the quotient vector space
$$
E_p=\{\Theta_g\}\big/\{D_p\Theta_g\}
$$
of the space of theta sums by the image of $D_p$, with the quotient topology. It is a space of equivalence classes, not of functions: two theta sums are identified when their difference is a theta sum with the multiples of $p$ already deleted. It is the source's $p$-primary orbital quotient, written there for a number field and a character [@masullo, Definition 7.3.1.3, p. 343, Theorem 7.4.2.1, p. 367].
::::

The periodization $\Phi_p$ is defined on theta sums, because they decay faster than every power at both ends, and by the telescoping argument it kills $D_p\Theta_g=\Theta_g-\Theta_g(p\,\cdot)$. So it induces a map from $E_p$ to the smooth functions on the circle $\RR_{>0}/p^\ZZ$ of length $\log p$. The theorem below says that nothing is lost: the quotient of theta sums at $p$ is the circle, exactly as the quotient of all functions is.

::::: card {#t-pc-orbital-circle kind="theorem" title="The orbital quotient of theta sums at $p$ is the space of smooth functions on a circle of length $\log p$" source="masullo"}
:::: statement
Periodization over $p^\ZZ$ induces an isomorphism of topological vector spaces
$$
E_p=\{\Theta_g\}\big/\{D_p\Theta_g\}\ \xrightarrow{\ \sim\ }\ S_E(\RR_{>0})\big/\ker\Phi_p\ \xrightarrow{\ \sim\ }\ C^\infty(\RR_{>0}/p^\ZZ),
$$
which commutes with every convolution $A(\varphi)$. On the Mellin side it says that the multiples of $\xi(s)$, modulo the multiples of $(1-p^{-s})\xi(s)$, are the same as all functions modulo the multiples of $1-p^{-s}$.
::::
:::: plain
A theta sum is a very special function, built from a single $g$ sampled at all the integers. Once the multiples of $p$ are thrown out of it, what is left over can still be any smooth function on the circle of length $\log p$. The theta sums are rich enough that the circle sees them as it sees everything.
::::
:::: why
The trace of [[t-pc-circle-trace]] is a statement about the circle. The proof needs it for the orbital quotient of theta sums, because the pieces of the sieve in [[cutting-the-kernel]] act on theta sums. This theorem is the bridge.
::::
:::: idea
By [[eq-pc-unfold]] the circle image of $\Theta_g$ has Fourier coefficients $M\Theta_g(-z_m)/\log p$, and $M\Theta_g$ is $\xi(s)$ times an entire function. The points $-z_m$ lie on the imaginary axis $\Re s=0$, which the functional equation $\xi(s)=\xi(1-s)$ reflects onto the line $\Re s=1$, where $\zeta$ has no zeros ([[zeros]]). So $\xi$ never vanishes at the points the circle looks at, multiplying by $\xi$ loses nothing there, and the circle sees a theta sum as freely as it sees an arbitrary function.
::::
:::: sketch {source="masullo" loc="Theorem 7.5.0.1, p. 374; Corollary 7.5.0.3, p. 379; Lemma 4.2.1.5, p. 165"}
The second isomorphism is [[t-pc-kernel]]. For the first, the source proves injectivity by showing that the coefficient functionals of the circle, pulled back to theta sums, are the evaluations of the Mellin transform at the zeros of $1-p^{-s}$, and that these remain independent on $E_p$ because the matrix relating them to the jets of $M\Theta_g$ there is triangular with diagonal entries a power of $L(1-s_c)$, nonzero by the non-vanishing of $L$ on the line $\Re s=1$. Over $\mathbb Q$ every zero of $1-p^{-s}$ is simple, so each matrix is $1\times1$, and its entry is a value of $\zeta$ on the line $\Re s=1$ times local factors that do not vanish there. Surjectivity uses the $S$-local orbital bases of Theorem 7.3.1.6 together with the polynomial growth of $1/\zeta(1+it)$ and of the derivatives of $\zeta$ on vertical lines, which control the size of the inverse matrices so that the lifted basis still converges. A corollary is a quantitative coprimality: every $\phi$ in the Mellin image of $S_E$ is $\xi(s)u(s)+(1-p^{-s})v(s)$ with $\xi u$ and $v$ in the same class. The source notes that this theorem is not logically needed for the main trace computation, which works with the orbital bases directly, and uses it to explain the structure behind them [@masullo, §7.5, p. 374].
::::
:::: example
For $g_\star$ and $p=2$, the circle image $\Phi_2\Theta_{g_\star}$ takes the values $1.79843$, $1.20469$, $1.18159$, $1.65519$ at $x=1,1.25,1.5,1.75$. By [[eq-pc-unfold]] and [[eq-pc-gstar]] its Fourier coefficients are $c_m=\frac2{\log 2}\,\xi(-z_m)=\frac2{\log2}\,\xi(1+z_m)$. Numerically integrating the circle function gives $c_0=1.4426950=1/\log2$, $c_1=0.178620+0.045832i$, and $c_2=-0.000753-0.000294i$, matching $\frac2{\log2}\xi(1+z_m)$ to five digits. For $p=3$ the same computation gives $c_0=0.9102392=1/\log3$, $c_1=0.4146724+0.0584580i$, and $c_2=0.0245002+0.0101804i$. None of these is zero, and none can be, because $\zeta(1+it)\ne0$.
::::
:::: used
- [[t-pc-orbital-trace]]: the trace on $E_p$ is the circle trace with $\lambda=p$.
- [[cutting-the-kernel]]: each slice of the sieve acts on a copy of $E_p$.
::::
:::::

:::: figure {#f-pc-wrap viz="pc-wrap" height="440"}
Periodizing a theta sum over the powers of p wraps it onto a circle of length log p, and every Fourier mode of the wrapped function is present.

```vizspec
Purpose: show the theta sum of g_star(x) = (4 pi^2 x^4 - 6 pi x^2) exp(-pi x^2) wound onto the circle R_{>0}/p^Z.
Scene: left two thirds, a morph between a line and a circle. At wrap parameter w = 0 draw the graph of Theta(t) = 2 * sum_{n=1}^{60} g_star(n t) against u = log t for u in [-2.5, 2.5] as a gold curve on a straight muted baseline, with muted tick marks every log p along the baseline. As w goes to 1, bend the baseline so that each segment of length log p is wrapped onto a circle of circumference proportional to log p (successive segments stack as a helix that flattens onto the circle); at w = 1 draw the periodized function P(x) = sum_k Theta(p^k x) as a radial gold graph around the circle, radius = R0 + 40 * P.
  Right third: a bar chart of |c_m| for m = 0..6, where c_m are the Fourier coefficients of P over one period (sample P at 256 equally spaced points in u in [0, log p), take the discrete Fourier transform, divide by 256). Bars teal; use a logarithmic vertical scale from 1e-12 to 10.
Controls: buttons p = 2, 3, 5, 7 (default 2); slider w from 0 to 1 with a play button that animates w from 0 to 1 over 3 seconds.
Reader takeaway: the wrapped function is a smooth function on a circle whose length grows with p, and none of its Fourier coefficients vanishes.
Check values: p = 2: |c_0| = 1.4427, |c_1| = 0.1844; p = 3: |c_0| = 0.9102, |c_1| = 0.4188. Treat Theta(t) as 0 for t < 0.12 or t > 10 (it is below 1e-20 there).
```
::::

## The orbital trace and why large primes vanish {#s-pc-orbital-trace}

Everything is now in place for the statement that [[cutting-the-kernel]] uses for every prime outside a finite set.

::::: card {#t-pc-orbital-trace kind="theorem" title="Convolution by $\varphi$ on the orbital quotient at $p$ has trace $\log p$ times the sum of $\varphi$ over the powers of $p$, which is zero for every prime $p\ge Y$" source="masullo"}
:::: statement
Let $\varphi$ be smooth with compact support in $\RR_{>0}$. Then $A(\varphi)$ maps the image of $D_p$ into itself, so it acts on $E_p$, the action is nuclear, and
$$
\operatorname{Tr}\bigl(A(\varphi)\big|_{E_p}\bigr)=\sum_{m\in\ZZ}M\varphi\Bigl(\frac{2\pi im}{\log p}\Bigr)=\log p\sum_{k\in\ZZ}\varphi(p^k).
$$ {#eq-pc-orbital-trace}
If moreover $\varphi(1)=0$ and $\operatorname{supp}\varphi\subset(1/Y,Y)$, this trace is $0$ for every prime $p\ge Y$.
::::
:::: plain
Each prime has its own circle, and the convolution's trace on that circle counts how often the test function meets a power of the prime. A test function that only reaches up to $Y$ never meets a power of a prime beyond $Y$, so all those primes contribute nothing.
::::
:::: why
A sum over all primes can only be reduced to a finite computation if all but finitely many terms vanish. This theorem is where that happens: the geometric side of the trace formula, cut along the primes, collapses onto the primes below $Y$ and the archimedean place, and the source calls it "a massive cancellation phenomenon" [@masullo, §1.4.10, p. 32].
::::
:::: idea
Convolution commutes with rescaling, so it commutes with $D_p$ and descends to $E_p$. By [[t-pc-orbital-circle]] the quotient is the circle of length $\log p$, so the trace is the circle trace of [[t-pc-circle-trace]] with $\lambda=p$, and its vanishing is [[t-pc-vanishing]].
::::
:::: proof
*Invariance.* For a theta sum, $A(\varphi)\Theta_g=\Theta_{g'}$ with $g'(x)=\int_0^\infty\varphi(t)g(x/t)\,\dd t/t$, which is even and Schwartz, satisfies $g'(0)=0$, and has $\int_\RR g'=\int_0^\infty\varphi(t)\,t\,\dd t/t\cdot\int_\RR g=0$. Since $A(\varphi)$ commutes with $\psi\mapsto\psi(p\,\cdot)$, it commutes with $D_p$: $A(\varphi)D_p\Theta_g=D_pA(\varphi)\Theta_g$, which lies in the image of $D_p$. So $A(\varphi)$ induces an operator on $E_p$.

*Transport.* The isomorphism of [[t-pc-orbital-circle]] commutes with $A(\varphi)$, so the operator on $E_p$ is conjugate to $A(\varphi)$ on the circle $\RR_{>0}/p^\ZZ$, and conjugate nuclear operators have equal traces. Pulled back to $E_p$, the exponential basis has coefficient functionals $\Theta_g\mapsto M\Theta_g(-z_m)/\log p$, the evaluations of the Mellin transform at the zeros of $1-p^{-s}$. These are the source's orbital Schauder basis, and the source computes the trace in this basis [@masullo, Theorem 7.3.1.6, p. 344, Theorem 7.4.2.1, p. 367].

*Value.* [[t-pc-circle-trace]] with $\lambda=p$ gives [[eq-pc-orbital-trace]], and [[t-pc-vanishing]] with $\lambda=p\ge Y$ gives $0$.
::::
:::: example
With $Y=4.5$ and the bump $\varphi(t)=\operatorname{bump}(\log t/\log4.5)$, which is supported on $(1/4.5,4.5)$ but has $\varphi(1)=e^{-1}\ne0$, the trace on $E_5$ is $\log5\,\varphi(1)=0.5920791$ (both sides of [[eq-pc-orbital-trace]] agree to nine digits). Only the $k=0$ term survives, because $5$ and $1/5$ lie outside the support. With a test function that also vanishes at $1$, as the trace formula requires, the trace on $E_5$, $E_7$, $E_{11},\dots$ is exactly zero, while on $E_2$ and $E_3$ the points $2,4,\tfrac12,\tfrac14$ and $3,\tfrac13$ can still contribute.
::::
:::: used
- [[cutting-the-kernel]]: each slice of the sieve at a prime $p\ge Y$ has diagonal mass zero, so only the $S$-local kernel is left.
- [[trace-formula]]: the primes $p<Y$ reappear there through Connes's local computation, with the weights $\log p\,p^{-m/2}$ of Weil's explicit formula.
::::
:::::

The source states the general version of [[eq-pc-orbital-trace]] for a number field, where the right side becomes $\sum_{v\mid p}\frac{\log q_v}{\mu_v(\mathcal O_v^\times)}\sum_k\varphi(\pi_v^k)$ [@masullo, pp. 18 to 19, 51 to 52]. The source states the same right side for the orbital slices of the weighted kernel of [[cutting-the-kernel]] [@masullo, Theorem 11.3.2.1, p. 495]. If instead the weight $t^{1/2}$ is kept on the functions, as in the quotient of the weighted sums $V_g(t)-p^{-1/2}V_g(pt)$, then [[eq-pc-weighted-trace]] with $c=\tfrac12$ multiplies the $k$th orbit term by $p^{-k/2}$. Either way every term with $k\ne0$ vanishes when $p\ge Y$, and the term $k=0$ is $\varphi(1)=0$. The source's proof of that theorem evaluates at the weighted points $\varepsilon_p-\tfrac12$ [@masullo, (11.3.2.5), p. 496], so chapters [[cutting-the-kernel]] and [[trace-formula]] print the weighted form, $\log p\sum_kp^{-k/2}\varphi(p^k)$.

:::: figure {#f-pc-orbits viz="pc-orbits" height="420"}
For a test function supported in a window around 1, only the primes whose powers fall inside the window carry a nonzero orbital trace, and there are finitely many.

```vizspec
Purpose: show which primes survive the vanishing of orbital traces for a given support window.
Scene: horizontal axis u = log t from -log(60) to log(60), with a shaded blue window (-log Y, log Y). One row per prime p <= 53 (16 rows), labeled p on the left. In each row draw dots at u = k log p for k = -6..6, k != 0 (skip dots outside the axis). A dot inside the open window is gold and filled; a dot outside is muted and hollow. A row with at least one gold dot has its label gold ("lit"); a row with none has its label muted and a thin muted strike line ("dark"). The point u = 0 is drawn as a red cross in every row with the note "phi(1) = 0".
Controls: slider Y from 1.2 to 60 on a logarithmic scale (default 4.5); dragging the window edges also changes Y.
Readout: "lit primes: N" and the list of lit primes.
Motion: dots change color as the window passes them; no other animation.
Reader takeaway: the lit primes are exactly the primes below Y; every prime p >= Y has no power except 1 inside the window, so its orbital trace log p * sum_k phi(p^k) is 0.
```
::::

## Different primes do not interfere {#s-pc-independence}

The sieve of [[cutting-the-kernel]] removes primes one after another, so it needs more than one circle at a time. After deleting the multiples of $p_1,\dots,p_k$, the next step deletes the multiples of $p_{k+1}$, and on the Mellin side the slice between the two stages is
$$
\frac{\prod_{i\le k}(1-p_i^{-s})\cdot\xi(s)\cdot(\text{entire})}{\prod_{i\le k+1}(1-p_i^{-s})\cdot\xi(s)\cdot(\text{entire})}.
$$
It is described by the zeros of the new factor $1-p_{k+1}^{-s}$, and it is a faithful copy of the circle at $p_{k+1}$ provided the earlier factors do not vanish at those zeros. They almost never do.

:::: theorem {#t-pc-polar title="For distinct primes $p$ and $q$ the zero sets of $1-p^{-s}$ and $1-q^{-s}$ meet only at $s=0$" source="masullo" loc="Theorem 7.1.3.2(1), p. 324; Theorem 1.7.1.1, p. 35"}
For distinct primes $p\ne q$,
$$
\Bigl\{\frac{2\pi ik}{\log p}:k\in\ZZ\Bigr\}\cap\Bigl\{\frac{2\pi ik'}{\log q}:k'\in\ZZ\Bigr\}=\{0\},
$$
and every zero of $1-p^{-s}$ is simple. So every zero of a finite product $\prod_{p\in T}(1-p^{-s})$ other than $s=0$ is simple.
::::

::: proof
A common zero has $k/\log p=k'/\log q$, that is $k\log q=k'\log p$, that is $q^k=p^{k'}$. If $k>0$ then $k'>0$ and unique factorization forces $k=k'=0$, a contradiction, and $k<0$ reduces to this by inverting both sides. So $k=k'=0$. The zeros are simple because the derivative of $1-p^{-s}$ is $\log p\cdot p^{-s}\ne0$. The statement is the $\mathbb Q$-linear independence of $\log p$ and $\log q$, which is how the source phrases it.
:::

The zeros can come close without meeting. The near equality $2^{19}=524288\approx531441=3^{12}$ puts the zero $2\pi i\cdot12/\log2=108.7766i$ of $1-2^{-s}$ within $0.1118$ of the zero $2\pi i\cdot19/\log3=108.6648i$ of $1-3^{-s}$, and better rational approximations of $\log3/\log2$ give closer pairs, but [[t-pc-polar]] says no pair ever coincides. Part of the proof of [[zeta-continued]] used the same fact with $2$ and $3$.

What this buys can be said in our own words, as our illustration of the source's bookkeeping. At a zero $w\ne0$ of $1-p_{k+1}^{-s}$ the earlier factors are nonzero, so the slice has one coefficient functional there, the value at $w$ divided by $\prod_{i\le k}(1-p_i^{-w})$, and convolution multiplies it by $M\varphi(w)$, exactly as on the circle of $p_{k+1}$ alone. At $s=0$ all the factors vanish, so the slice remembers the $k$th derivative at $0$ instead of the value, and convolution still multiplies it by $M\varphi(0)$, because $(M\varphi\cdot F)^{(k)}(0)=M\varphi(0)F^{(k)}(0)$ when $F$ vanishes to order $k$ at $0$. So the list of eigenvalues on each slice is the list of the circle of the new prime, and its trace is $\log p_{k+1}\sum_j\varphi(p_{k+1}^j)$ again. The one shared point $s=0$ is where the order of vanishing piles up as more primes are removed, and the letter names this "infinitely repeated pole" as the obstruction to the degenerate case $a=0$ of [[strip-topology]] [@masullo, pp. 36 to 37]. Away from that one point the circles of different primes are independent.

Over a function field the picture breaks. Every residue field there has $q^d$ elements for a fixed $q$, so every zero $2\pi ik/\log q$ of $1-q^{-s}$ is also a zero of $1-q^{-ds}$, and the Euler factors share infinitely many zeros. The source identifies this as one reason the method gives only Weil's explicit formula there and not the Riemann hypothesis, which for curves was proved by other means ([[function-fields]]) [@masullo, §14.2, pp. 534 to 535].

:::: figure {#f-pc-zeros viz="pc-euler-zeros" height="440"}
The zeros of the factors 1 minus p to the minus s for different primes are evenly spaced columns on the imaginary axis that meet only at 0, though they can come very close.

```vizspec
Purpose: show the zero sets 2 pi i k / log p for several primes and their single common point.
Scene: a vertical axis for Im s from -Hmax to Hmax (the imaginary axis, violet is NOT used here; draw it muted). For each selected prime p draw a vertical column of teal dots at heights 2 pi k / log p, the columns offset horizontally by a small fixed amount per prime and labeled p at the top. At height 0 draw one red ring around all columns with the label "s = 0, shared by every prime". Within the visible range find the pair of dots from different primes with the smallest height difference (other than at 0) and connect them with a short red segment labeled with the difference to 4 decimals.
Controls: checkboxes p = 2, 3, 5, 7, 11, 13 (default 2 and 3 on); slider Hmax from 20 to 2000 on a logarithmic scale (default 120).
Readout: "closest pair in view: p = .., k = ..; q = .., k' = ..; gap = ..".
Reader takeaway: different primes share only s = 0; near misses such as 2^19 vs 3^12 (gap 0.1118 at height about 108.7) exist but never close.
Check values: p = 2, 3 with Hmax = 120: closest pair k = 12 for p = 2 (108.7766) and k' = 19 for p = 3 (108.6648).
```
::::

::: aside
The source gives the circles a geometric home that fulfills a prediction of Deninger [@deninger1993]. The dual basis elements of the orbital quotient at $p$ are distributions supported on a locus of the $S$-adeles whose quotient by the units is a loop of length $\log p$, a "periodic orbit", and the corresponding objects at the archimedean place are "fixed points" of the flow by $\RR_{>1}$ [@masullo, §1.2.11, pp. 20 to 21, Theorem 8.1.0.1, p. 382]. The orbital traces are then Deninger's local traces. The source is explicit that the picture helps organize the computation but is not logically needed, and that "there is no 3-manifold, nor foliation, nor foliated cohomology theory" [@masullo, p. 16, p. 33].
:::

## What changes in general {#s-pc-general}

For a number field $F$ and a Hecke character $\chi$ the same story runs with heavier notation [@masullo, §1.2.9, pp. 17 to 19, §7.3 and §7.4]. The operator $D_p$ becomes $\mathrm{PV}_{S_p}$, the composite of the operators $f(x)\mapsto f(x)-f(\pi_v^{-1}x)$ over all places $v$ above $p$, and on the Mellin side it multiplies by the product of reciprocal Euler factors $\prod_{v\mid p}L_v(\chi_v\lvert\cdot\rvert_v^s)^{-1}$. Each place $v$ contributes a circle $\RR_{>0}/q_v^\ZZ$ of length $\log q_v$, where $q_v$ is the size of the residue field, and the exponential basis is twisted by the character, so the zeros sit at $2\pi ik/\log q_v-it_v$. Several places above one $p$ can share zeros, so multiplicities up to $[F:\mathbb Q]$ appear, which is why the strata are taken over the whole set $S_p$ of places above $p$ at once. The orbital trace becomes $\sum_{v\mid p}\frac{\log q_v}{\mu_v(\mathcal O_v^\times)}\sum_k\varphi(\pi_v^k)$, and it still vanishes once $q_v$ exceeds the support. [[t-pc-polar]] holds for places of distinct residue characteristic with the same proof, and the shared point is the single point of the component that corresponds to $s=0$. Class groups force the finite set $S$ to be large enough that $\mathrm{Pic}(\mathcal O_{F,S})=1$, and the strong coprimality of [[t-pc-orbital-circle]] uses the non-vanishing of $L(s,\chi)$ on $\Re s=1$.

::: recap
You now have the following, and where each is used.

- The toy circle $\RR_{>0}/\lambda^\ZZ$ of length $\log\lambda$, its exponential basis $t^{2\pi im/\log\lambda}$, and the periodization $\Phi_\lambda$, whose kernel is the multiples of $1-\lambda^{-s}$: the model for every orbital quotient.
- What a Schauder basis is and why it lets a trace be computed as a sum of diagonal entries: the method of every trace computation in [[strip-topology]] and [[cutting-the-kernel]].
- The circle trace $\sum_mM\varphi(2\pi im/\log\lambda)=\log\lambda\sum_k\varphi(\lambda^k)$, proved by Poisson summation, with its weighted form, and its vanishing when no power of $\lambda$ meets the support: the diagonal mass of each slice in [[cutting-the-kernel]].
- The operator $D_p$, which deletes the multiples of $p$ and multiplies the Mellin transform by $1-p^{-s}$, and the orbital quotient $E_p$, which is the circle of length $\log p$ because $\zeta$ has no zeros on $\Re s=1$: the pieces of the sieve.
- The orbital trace $\log p\sum_k\varphi(p^k)$, zero for $p\ge Y$: why only the primes below $Y$ survive into [[trace-formula]].
- Independence of the $\log p$, so that different primes share only $s=0$: why the slices of the sieve are copies of single circles, and why the method needs a strip of positive width ([[strip-topology]]).
:::
