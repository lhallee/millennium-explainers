---
id: cutting-the-kernel
title: Cutting the kernel along the primes
part: 3
summary: Compute the trace of the convolution operator a second time, as the mass of a kernel on its diagonal, by cutting the kernel one prime at a time until only the places in a finite set S carry any mass.
needs: [primes-as-circles, strip-topology]
---

:::: plain
A trace can be computed in two ways: add up the eigenvalues, or add up the numbers on the diagonal of the matrix. Chapter 14 did the first and found only the zeros inside a strip. This chapter starts the second. It cuts the operator into pieces, one piece for each prime beyond a cutoff, and shows that every such piece has nothing on its diagonal, so that everything is concentrated on finitely many primes.
::::

Chapter [[strip-topology]] ended with a trace that sees too little. In the coarse space $W_a$, convolution by a test function $\varphi$ descends to the quotient by the closed span of the weighted theta sums, and its trace there is $\sum_{\lvert\beta-1/2\rvert<a}m_\rho\,M\varphi(\rho-\tfrac12)$, a sum over the zeros in the strip $\lvert\Re z\rvert<a$ and over no others. That is a sum of eigenvalues. A trace has a second expression, the sum of the diagonal entries, and for an integral operator the diagonal entries become the values of its kernel $k(x,x)$ on the diagonal. If we can compute that second expression inside the same space $W_a$ and get the full prime side of Weil's explicit formula, then chapter [[trace-to-grh]] has a comparison to make: Weil's formula pairs the prime side with all the zeros, the new formula pairs the same prime side with the zeros in the strip, and the zeros outside the strip have nowhere to go. This chapter carries the diagonal computation to the point where only finitely many places are left, and chapter [[trace-formula]] finishes it. The source calls the bases that make this possible "the crux of the matter" (p. 31), and the argument here is where they are used.

## The problem: a second computation of the same trace {#s-ck-problem}

Recall the objects. A test function $\varphi$ is smooth with compact support in $(0,\infty)$, the operator $A(\varphi)$ is multiplicative convolution, $(A(\varphi)\psi)(x)=\int_0^\infty\varphi(t)\,\psi(x/t)\,\dd t/t$, and on the Mellin side it multiplies by $M\varphi(z)=\int_0^\infty\varphi(t)t^z\,\dd t/t$. Throughout this chapter we follow the source's standing assumption in the introduction (p. 15) that $\varphi$ is supported strictly to the right of 1, and we fix a number $Y>1$ with
$$
\operatorname{supp}\varphi\subset(1,Y).
$$ {#eq-ck-support}
In particular $\varphi(1)=0$. The source extends the final formula to every $\varphi$ with $\varphi(1)=0$ by a reflection and a continuity argument (p. 30), and chapter [[trace-formula]] does that step.

Chapter [[strip-topology]] gives the left side of the identity we are after. As there, write $\overline{\mathcal V}$ for the closure in $W_a$ of the space $\mathcal V$ of weighted theta sums $V_g(t)=t^{1/2}\Theta_g(t)$ and $\mathcal H_a=W_a/\overline{\mathcal V}$ for the quotient. Write $P^{\mathrm{geom}}$ for the orthogonal projection of $W_a$ onto $\overline{\mathcal V}$, $P^{\mathrm{spec}}=1-P^{\mathrm{geom}}$ for the projection onto its orthogonal complement (the source's names, p. 456), and $A_{\mathrm{spec}}(\varphi)$ for the operator that $A(\varphi)$ induces on $\mathcal H_a$. Then
$$
\Tr A_{\mathrm{spec}}(\varphi)=\sum_{\lvert\beta-1/2\rvert<a}m_\rho\,M\varphi(\rho-\tfrac12).
$$ {#eq-ck-spectral}
The plan has four steps, one per section below. First we turn this trace into the mass of a kernel on the diagonal of $\RR_{>0}\times\RR_{>0}$ and isolate the piece of the kernel that still has to be computed. Second we lift that piece to the ideles of chapter [[adeles]], where each prime has its own coordinate. Third we cut the lifted kernel along the primes beyond $Y$, one at a time, and identify each cut with the orbital quotient of chapter [[primes-as-circles]]. Fourth we show that every cut has diagonal mass zero, so that only an $S$-local kernel is left, with $S=\{\infty\}\cup\{p\le Y\}$.

::: warning
The whole computation happens inside $W_a$, the coarse space. Doing it in the fine topology of chapter [[tate-theta]] is easy and gives Weil's explicit formula with every zero, which proves nothing new. The difficulty, and the content of this chapter, is that every step must survive the coarse completion.
:::

## Kernels and the diagonal on the positive reals {#s-ck-kernels}

For a square matrix $B$ the trace has two expressions, $\sum_iB_{ii}=\sum_i\lambda_i$, the diagonal entries and the eigenvalues counted with algebraic multiplicity. An integral operator is the continuous version of a matrix, with the kernel in place of the entries.

::: definition {#d-ck-kernel title="Kernel and diagonal mass on the positive reals"}
A kernel is a measurable function $k(x,y)$ on $\RR_{>0}\times\RR_{>0}$. It defines the operator $(T\psi)(x)=\int_0^\infty k(x,y)\,\psi(y)\,\dd y/y$, and we call $k$ the kernel of $T$. When the restriction of $k$ to the diagonal makes sense (see [[s-ck-smoothening]]), its diagonal mass is
$$
\operatorname{mass}(k)=\int_0^\infty\tilde k(t,t)\,\frac{\dd t}{t}.
$$
A kernel is a function of two variables, not an operator: different kernels that agree off a null set define the same operator, which is why the value on the diagonal, itself a null set, needs a definition.
:::

The convolution operator has an explicit kernel. Substituting $y=x/t$ in the definition of $A(\varphi)$, so that $t=x/y$ and $\dd t/t$ becomes $\dd y/y$,
$$
(A(\varphi)\psi)(x)=\int_0^\infty\varphi\!\left(\frac xy\right)\psi(y)\,\frac{\dd y}{y},
$$ {#eq-ck-kernel}
so the kernel of $A(\varphi)$ is $\varphi(x/y)$, the source's $\varphi(xy^{-1})$ (p. 15). On the diagonal it equals $\varphi(1)$ at every point. For our test functions $\varphi(1)=0$, so the kernel of $A(\varphi)$ vanishes identically on the diagonal, and its diagonal mass is $0$. In logarithmic coordinates $u=\log x$, $v=\log y$ the kernel is $\varphi(e^{u-v})$, constant along every line parallel to the diagonal, a band whose position is set by the support of $\varphi$ and which never touches the diagonal itself ([[f-ck-kernel-band]]).

That number 0 is not a trace on all of $\RR_{>0}$, because $A(\varphi)$ on the whole line has a continuous family of eigenfunctions $x^{iy}$ and is not trace class. It becomes useful once the operator is split along an invariant subspace, and a finite example shows how.

::: example {title="A zero diagonal splits a trace into two equal and opposite halves"}
This analogy is ours. On $\ZZ/4\ZZ$ take the convolution matrix $C_{ij}=c_{i-j}$ with $c=(c_0,c_1,c_2,c_3)=(0,1,2,0)$, the finite counterpart of the kernel $\varphi(x/y)$ with $\varphi(1)=0$. Its diagonal is $c_0=0$, so $\Tr C=0$. Its eigenvectors are the characters $v_k=(i^{jk})_j$, the counterparts of $t^z$, with eigenvalues $3$, $-2-i$, $1$, and $-2+i$ for $k=0,1,2,3$, which add to 0. The span $U$ of $v_0$ and $v_2$ is invariant. The trace on $U$ is $3+1=4$, and the trace on the quotient by $U$ is $(-2-i)+(-2+i)=-4$. Because the diagonal of $C$ is zero, the trace on the subspace is minus the trace on the quotient. Replace $U$ by the theta sums and the quotient by the zeros in the strip, and this is the identity of [[t-ck-proto]].
:::

### Spectral and geometric kernels {#s-ck-two-kernels}

The quotient trace [[eq-ck-spectral]] comes with a kernel of its own. Chapter [[strip-topology]] computed it with a basis of the quotient whose dual elements are the jets at the zeros in the strip. Lifting the basis elements to $W_a$ and writing $A(\varphi)$ as a limit of finite-rank operators, one per zero and jet order, gives a kernel built from the functions $t^{\rho-1/2}(\log t)^m$ (p. 14).

::: definition {#d-ck-spec-geom title="Spectral kernel and geometric kernel"}
The spectral kernel $k_{\mathrm{spec}}(x,y)$ is the kernel of $A(\varphi)\circ P^{\mathrm{spec}}$ on $W_a$. It is the limit, in the trace norm and in $L^2$ against the weights of $W_a$, of explicit finite-rank kernels, one for each zero $\rho$ with $\lvert\beta-\tfrac12\rvert<a$ and each jet order $m<m_\rho$ (pp. 14 to 15; Theorems 10.4.3.1, p. 466, and 10.4.3.5, p. 472). The geometric kernel is the difference
$$
k_{\mathrm{geom}}(x,y)=\varphi(x/y)-k_{\mathrm{spec}}(x,y),
$$
the kernel of $A(\varphi)\circ P^{\mathrm{geom}}$ (p. 48; Definition 10.4.3.7, p. 473). It is a measurable function, not the kernel of a trace-class operator: $A(\varphi)\circ P^{\mathrm{geom}}$ is neither trace class nor Hilbert-Schmidt (p. 48; Remark 12.1.1.4, p. 503).
:::

On theta sums the geometric kernel acts as $A(\varphi)$ itself, since $P^{\mathrm{geom}}$ is the identity there (Theorem 10.4.3.6, p. 473). So $k_{\mathrm{geom}}$ is the part of the convolution kernel that lives on the theta sums, the analog of $C$ restricted to $U$ in the example, and its diagonal mass is the trace that the zeros do not see.

### Making sense of a kernel on the diagonal {#s-ck-smoothening}

The diagonal of $\RR_{>0}\times\RR_{>0}$ has measure zero, and $k_{\mathrm{spec}}$ is only defined up to null sets, so $k_{\mathrm{spec}}(t,t)$ has no meaning until we choose one. The source chooses it by averaging over small squares. In logarithmic coordinates, with $B_\delta=[e^{-\delta},e^\delta]$,
$$
\tilde k(t,t)=\lim_{\delta\to0}\frac1{(2\delta)^2}\int_{tB_\delta}\int_{tB_\delta}k(x,y)\,\frac{\dd x}{x}\,\frac{\dd y}{y},
$$
which the source calls the smoothening (Definition 12.1.1.1, p. 498). For a continuous kernel such as $\varphi(x/y)$ it returns the value $\varphi(1)$ at every point. Two classical theorems, in versions for locally compact abelian groups, make it work for $k_{\mathrm{spec}}$ (Theorems A.5.3.7 and A.5.4.1, p. 582, after Hewitt and Ross [@hewitt-ross, Vol. II, Ch. XI, §44]). The diagonal is a null set, so Lebesgue's theorem alone says nothing about it; it is applied to the factors $a_i(x)$ and $b_i(y)$ of a finite-rank kernel $\sum_ia_i(x)b_i(y)$, whose smoothening on the diagonal is then $\sum_ia_i(t)b_i(t)$ at almost every $t$. The Hardy-Littlewood maximal theorem controls all the averages at once by one integrable function, so that for a trace-norm limit of finite-rank kernels the smoothened diagonal still exists at almost every $t$, is the limit of the finite-rank diagonals, and integrates to the trace (Theorem 12.1.1.2, p. 499).

::::: card {#t-ck-proto kind="theorem" title="The geometric kernel carries minus the spectral trace on its diagonal" source="masullo" loc="(1.8.3.6), p. 48; Theorem 12.1.1.3, p. 502"}
:::: statement
Let $a>0$ and let $\varphi$ be smooth with $\operatorname{supp}\varphi\subset(1,Y)$. The smoothened diagonal $\tilde k_{\mathrm{geom}}(t,t)$ exists for almost every $t$, it is integrable against $\dd t/t$, and
$$
\operatorname{mass}(k_{\mathrm{geom}})=-\operatorname{mass}(k_{\mathrm{spec}})=-\sum_{\lvert\beta-1/2\rvert<a}m_\rho\,M\varphi(\rho-\tfrac12).
$$ {#eq-ck-proto}
::::
:::: plain
The convolution kernel is zero on its diagonal. Split it into the part that the zeros in the strip see and the part that lives on the theta sums: the two parts must have opposite diagonal masses, and the first one is the sum over the zeros in the strip.
::::
:::: why
This identity, the source's proto-trace formula, turns the remaining work into a computation of $\operatorname{mass}(k_{\mathrm{geom}})$ by any means other than its definition. Whatever that computation returns equals minus the zero sum over the strip. Without it there is no second expression to compare with the first.
::::
:::: idea
This is the $4\times4$ example in infinite dimensions: a kernel with zero diagonal, split along an invariant subspace, puts opposite traces on the subspace and on the quotient. The only new issue is that the pieces are measurable functions, and the diagonal has to be read by averaging.
::::
:::: proof
The kernel $\varphi(x/y)$ is continuous, so every point of the diagonal is regular for it and its smoothening there is $\varphi(1)=0$. Since $k_{\mathrm{spec}}$ is a trace-norm limit of finite-rank kernels, its smoothening exists at almost every point of the diagonal by section [[s-ck-smoothening]], so the smoothening of the difference $k_{\mathrm{geom}}$ exists at those points too, and $\tilde k_{\mathrm{geom}}(t,t)=\varphi(1)-\tilde k_{\mathrm{spec}}(t,t)=-\tilde k_{\mathrm{spec}}(t,t)$ almost everywhere (Theorem 12.1.1.3(1) and (3), pp. 502 to 503). Integrate against $\dd t/t$. The operator $A(\varphi)\circ P^{\mathrm{spec}}$ is nuclear, $k_{\mathrm{spec}}$ is a trace-norm limit of finite-rank kernels, and Theorem 12.1.1.2 (p. 499) says that for such a kernel the integral of the smoothened diagonal exists and equals the trace. That trace is the trace of $A_{\mathrm{spec}}(\varphi)$ on the quotient, because $A(\varphi)$ preserves the closure of the theta sums, and chapter [[strip-topology]] evaluated it as [[eq-ck-spectral]]. Hence $\operatorname{mass}(k_{\mathrm{geom}})=-\Tr A_{\mathrm{spec}}(\varphi)$, which is [[eq-ck-proto]].
::::
:::: used
Section [[s-ck-remnant]] combines it with the vanishing of the slices, and chapter [[trace-formula]] evaluates the left side.
::::
:::::

::: aside
The source's body states these results with an extra Sobolev factor $(1+\lvert\log t\rvert^2)^{\sigma_0/2}$ in the norm of $W_a$, with $\sigma_0\ge3$ in Definition 10.4.3.7 and Theorem 12.1.1.3. The introduction and the letter take $\sigma_0=0$ (p. 27), and we follow them. Nothing in the pictures of this chapter depends on $\sigma_0$, which only adds a slowly growing weight in $\log t$.
:::

:::: figure {#f-ck-kernel-band viz="ck-kernel-band" height="400"}
The kernel of convolution by $\varphi$ is a band parallel to the diagonal, and when $\varphi(1)=0$ the band misses the diagonal entirely.

```vizspec
Purpose: show that the kernel phi(x/y) of convolution is constant along lines parallel to the diagonal and vanishes on the diagonal when phi(1)=0.
Scene: a square heat map in logarithmic coordinates u = log x and v = log y, both in [-2.5, 2.5]. Color each pixel by
  phi(exp(u - v)), where phi is the bump phi(t) = exp(-1/(1 - w^2)) for |w| < 1 and 0 otherwise, with
  w = (log t - c)/r, center c and half-width r set by the controls. Positive values in gold, zero transparent.
  Draw the diagonal u = v as a thin red line. To the right of the square draw a small plot of phi(e^w) against
  w in [-2.5, 2.5], with the point w = 0 (t = 1) marked by a red dot and the support interval shaded muted.
Controls: slider "left end of support" a in log units from -1.5 to 1.5 (default 0.3); slider "right end" b from
  -1 to 2 (default 1.1), kept above a + 0.1. The bump uses c = (a + b)/2, r = (b - a)/2.
Readout: the value phi(1) printed beside the red line, and the text "kernel on the diagonal = phi(1)".
Motion: none beyond the redraw on drag.
Reader takeaway: the band moves off the diagonal exactly when the support of phi avoids t = 1, and then the
  kernel is zero on the diagonal.
Data: none beyond the formula.
```
::::

## Why the ideles {#s-ck-ideles}

We now have to compute $\operatorname{mass}(k_{\mathrm{geom}})$ another way, and the plan is to cut $k_{\mathrm{geom}}$ along the primes. On $\RR_{>0}$ there is nothing to cut with. A point of $\RR_{>0}$ is a point of the idele class group $C_\QQ\cong\RR_{>0}\times\hat\ZZ^\times$ with its compact part forgotten, and a class contains ideles of every kind at a given prime $p$: if $x$ has a unit at $p$, then $px$ is in the same class and does not. "Being a unit at $p$" is a property of an idele, not of a class, and the source makes exactly this point: the restricted product structure of the ideles does not survive the quotient by $\QQ^\times$ (p. 24).

On the ideles each prime has its own coordinate, and the theta sum already uses it. Recall from chapters [[adeles]] and [[tate-theta]] that $\Theta_g$ is the periodization of the adelic function $f=g\otimes\bigotimes_p\mathbf 1_{\ZZ_p}$ over $\QQ^\times$. At the idele $\tau(t)=(t,1,1,\dots)$, with $t$ at the real place and $1$ at every prime,
$$
\sum_{\xi\in\QQ^\times}f(\xi\,\tau(t))=\sum_{\xi\in\QQ^\times}g(\xi t)\prod_p\mathbf 1_{\ZZ_p}(\xi)=\sum_{n\ne0}g(nt)=\Theta_g(t),
$$
because a rational number lies in every $\ZZ_p$ exactly when it is an integer. Each factor $\mathbf 1_{\ZZ_p}(\xi)$ is a separate condition on the coordinate at $p$. Replace one of them by $\mathbf 1_{\ZZ_p^\times}$ and the sum keeps only the integers not divisible by $p$, which is $D_p\Theta_g$ from chapter [[tate-theta]]. On the ideles the operation "remove the prime $p$" is multiplication of the adelic function by an indicator, and a kernel can be multiplied by the same indicator.

To use this we need to move a kernel from $C_\QQ$ to the ideles and back without changing its diagonal mass. Over $\QQ$ the set
$$
\mathcal D=\RR_{>0}\times\hat\ZZ^\times\subset\AA^\times
$$
is a fundamental domain for $\QQ^\times$: every idele is $\xi d$ for exactly one $\xi\in\QQ^\times$ and $d\in\mathcal D$, since $\xi$ must clear every $p$-adic valuation and fix the sign at the real place. This is the source's $\tau(\RR_{>0})\cdot E^1_F$ (p. 24). The convolution kernel lifts as $\tilde\varphi(xy^{-1})$, where $\tilde\varphi$ is a smooth compactly supported function on the ideles whose periodization $\sum_\xi\tilde\varphi(\xi x)$ is $\varphi(\lvert x\rvert)$, and the spectral kernel lifts with an indentation, a cutoff function whose $\QQ^\times$-average is 1, such as the indicator of $\mathcal D$ (pp. 21 to 22). The difference is the lifted geometric kernel
$$
K(x,y)=\tilde\varphi(xy^{-1})-\Psi(k_{\mathrm{spec}})(x,y),
$$
a function on $\AA^\times\times\AA^\times$ invariant under $(x,y)\mapsto(\xi x,\xi y)$ for $\xi\in\QQ^\times$ (p. 24). Here $\Psi$ is the source's $\Psi^\Delta_{u_0}$, the lift with the indentation $u_0$.

::::: card {#t-ck-skewered kind="proposition" title="The diagonal mass on the class group is a sum over the skewered diagonals of the ideles" source="masullo" loc="(1.3.1.12), p. 24; Proposition 12.2.2.2, p. 508"}
:::: statement
With $\mathcal D$, $K$, and smoothenings as above,
$$
\operatorname{mass}(k_{\mathrm{geom}})=\int_{\mathcal D}\sum_{\xi\in\QQ^\times}\tilde K(x,\xi x)\,\dd\mu(x),
$$ {#eq-ck-skewer}
the double integral converges absolutely, and its value depends neither on the lift $\tilde\varphi$ nor on the indentation.
::::
:::: plain
To add up a kernel on the diagonal of a quotient, add up the lifted kernel on every shifted copy of the diagonal, but only over one fundamental domain.
::::
:::: why
After the lift, the indicator of "unit at $p$" is a function of the second variable $y$, and multiplying $K$ by it is meaningful. Formula [[eq-ck-skewer]] guarantees that cutting $K$ into pieces and adding their skewered masses returns the mass we want.
::::
:::: idea
The model case is a circle, and the analogy is ours. A kernel on $\RR/\ZZ$ that is the periodization $k(x,y)=\sum_nK(x,y+n)$ of a kernel on $\RR$ has diagonal mass $\int_0^1k(x,x)\,\dd x=\int_0^1\sum_{n\in\ZZ}K(x,x+n)\,\dd x$, where $[0,1)$ is a fundamental domain and $x+n$ runs over the translates of $x$. Replace $\RR$ by the ideles, $\ZZ$ by $\QQ^\times$, and $[0,1)$ by $\mathcal D$. For $K(x,y)=h(x-y)$ the right side is $\sum_nh(n)$, which by Poisson summation is $\sum_m\hat h(m)$, the sum of the eigenvalues of convolution on the circle: the two ways of computing a trace meet again.
::::
:::: sketch {source="masullo" loc="Proposition 12.2.2.2, p. 508; Proposition 12.2.2.4, p. 512"}
Unfold the integral over $C_\QQ=\AA^\times/\QQ^\times$ into an integral over $\mathcal D$ and a sum over $\QQ^\times$, as for any discrete subgroup with a fundamental domain, and use the fact that smoothening on the ideles at a point equals smoothening on the quotient at its image (part (4) of the source's list on p. 23). Absolute convergence of the double integral comes from integrability of the smoothened diagonal on the quotient, and Fubini then allows the sum and the integral to be taken in either order, which gives the four equal expressions (1.3.1.6) to (1.3.1.9) on p. 23.
::::
:::: used
Section [[s-ck-sieve]] cuts $K$ by indicators in the variable $y$, and Theorem [[t-ck-slices-vanish]] evaluates each piece in the form [[eq-ck-skewer]].
::::
:::::

## The stratification is a sieve {#s-ck-sieve}

Fix the finite set of places
$$
S=\{\infty\}\cup\{p\le Y\},
$$
and list the primes beyond $Y$ in increasing order, $p_1<p_2<p_3<\cdots$. For $Y=3$ this is $S=\{\infty,2,3\}$ and $p_1=5$, $p_2=7$, $p_3=11$. The plan is to remove $p_1$, then $p_2$, and so on, never touching the primes in $S$.

::: definition {#d-ck-strata title="The divisorial stratification over the rationals"}
For $j\ge0$ the $j$-th stratum is the set of ideles that are units at the first $j$ primes beyond $Y$,
$$
\AA^\times_j=\{x\in\AA^\times:\ x_{p_i}\in\ZZ_{p_i}^\times\ \text{for}\ 1\le i\le j\},
$$
and $\alpha_j$ is its indicator function, with $\alpha_0=1$. The strata are open and closed, and they decrease, $\AA^\times_0\supset\AA^\times_1\supset\AA^\times_2\supset\cdots$. The set $\AA^\times_{j-1}\setminus\AA^\times_j$ consists of the ideles that are units at $p_1,\dots,p_{j-1}$ and not at $p_j$. A stratum is a subset of the ideles, not of $C_\QQ$: it is not stable under multiplication by $\QQ^\times$. Over $\QQ$ the source's primary stratification and its divisorial stratification coincide, because each prime has exactly one place above it (pp. 25 to 26; Section 11.3.1.1, p. 491).
:::

The strata were chosen to match the theta sums. For an adelic function $f=g\otimes\bigotimes_p\mathbf 1_{\ZZ_p}$, multiplying by $\alpha_j$ changes the factor at each of $p_1,\dots,p_j$ from $\mathbf 1_{\ZZ_{p_i}}$ to $\mathbf 1_{\ZZ_{p_i}}\mathbf 1_{\ZZ_{p_i}^\times}=\mathbf 1_{\ZZ_{p_i}^\times}$ and leaves the rest alone (p. 26). We call what this does to the theta sum a sieve of Eratosthenes run on the theta sum. The name is our framing, not the source's, and the next statement makes it precise.

::::: card {#t-ck-sieve kind="proposition" title="Restricting to the $j$-th stratum deletes the multiples of the first $j$ primes beyond $Y$ from the theta sum" source="masullo" loc="p. 26; Weil's identity, Theorem 3.4.1.1, p. 143"}
:::: statement
Let $g$ be even and Schwartz with $g(0)=0$ and $\int_\RR g=0$, and $f=g\otimes\bigotimes_p\mathbf 1_{\ZZ_p}$. The periodization of $\alpha_jf$ is the sieved theta sum
$$
\Theta_g^{(j)}(t)=\sum_{\substack{n\ne0\\ p_1\nmid n,\dots,\,p_j\nmid n}}g(nt)=D_{p_j}\cdots D_{p_1}\Theta_g(t),
$$ {#eq-ck-sieve}
and its Mellin transform is
$$
\int_0^\infty\Theta_g^{(j)}(t)\,t^s\,\frac{\dd t}{t}=\prod_{i=1}^j\bigl(1-p_i^{-s}\bigr)\cdot2\zeta(s)\,Mg(s),\qquad Mg(s)=\int_0^\infty g(t)\,t^s\,\frac{\dd t}{t}.
$$
Consecutive sieved sums differ by the multiples of $p_j$: $\Theta_g^{(j-1)}(t)-\Theta_g^{(j)}(t)=\Theta_g^{(j-1)}(p_jt)$.
::::
:::: plain
Cutting the adelic function down to the $j$-th stratum is the same as crossing out, in the sum $\sum_ng(nt)$, every $n$ that some removed prime divides. On the Mellin side each crossing-out multiplies by one reciprocal Euler factor.
::::
:::: why
It translates the stratification, which lives on the ideles, into operations on functions of one variable that chapters [[tate-theta]] and [[primes-as-circles]] already understand, and it tells us which quotient each cut of the kernel acts on.
::::
:::: idea
The periodization evaluates $f$ along the orbit $\xi\,\tau(t)$, whose coordinate at $p$ is the rational number $\xi$ itself. The factor $\mathbf 1_{\ZZ_p^\times}(\xi)$ asks that $\xi$ be a $p$-adic unit, and for an integer $n$ that means $p\nmid n$.
::::
:::: proof
At the idele $\tau(t)$ the periodization of $\alpha_jf$ is $\sum_{\xi\in\QQ^\times}g(\xi t)\prod_{i\le j}\mathbf 1_{\ZZ_{p_i}^\times}(\xi)\prod_{p\ne p_1,\dots,p_j}\mathbf 1_{\ZZ_p}(\xi)$. The product over all primes forces $\xi\in\ZZ\setminus\{0\}$, and for an integer $\xi=n$ the condition $n\in\ZZ_{p_i}^\times$ means $p_i\nmid n$. This gives the first expression in [[eq-ck-sieve]]. For the operator form, recall that $D_p\psi(t)=\psi(t)-\psi(pt)$ on theta sums. For any set of conditions not involving $p_j$, the integers satisfying them and divisible by $p_j$ are $p_jn'$ with $n'$ satisfying them, so $\Theta_g^{(j-1)}(t)-\Theta_g^{(j)}(t)=\sum_{n'}g(p_jn't)=\Theta_g^{(j-1)}(p_jt)$, which says $\Theta_g^{(j)}=D_{p_j}\Theta_g^{(j-1)}$ and also gives the last claim. Induction on $j$ gives the second expression. For the Mellin transform, the substitution $t\mapsto t/p$ gives $\int_0^\infty\psi(pt)t^s\,\dd t/t=p^{-s}\int_0^\infty\psi(t)t^s\,\dd t/t$, so each $D_{p_i}$ multiplies by $1-p_i^{-s}$, starting from $2\zeta(s)Mg(s)$ (chapter [[tate-theta]]). In the source's language, $\mathbf 1_{\ZZ_p^\times}$ in place of $\mathbf 1_{\ZZ_p}$ multiplies the local zeta integral by the reciprocal Euler factor, which is Weil's identity (Theorem 3.4.1.1, p. 143; pp. 25 and 49).
::::
:::: example
Take $Y=3$ and $g(x)=x^2\bigl(e^{-\pi x^2}-8e^{-4\pi x^2}\bigr)$. It is even, $g(0)=0$, and $\int_\RR g=\tfrac1{2\pi}-\tfrac{8}{2\pi\cdot8}=0$. From $\int_0^\infty t^{s+1}e^{-\pi ct^2}\,\dd t=\tfrac12\Gamma(\tfrac s2+1)(\pi c)^{-s/2-1}$ one finds $Mg(s)=\tfrac12\Gamma(\tfrac s2+1)\pi^{-s/2-1}(1-2^{1-s})$, so $2\zeta(s)Mg(s)=\pi^{-s/2-1}\Gamma(\tfrac s2+1)\,\eta(s)$ with $\eta$ the alternating series of chapter [[zeta-continued]], an entire function. The first removal is $p_1=5$: cross out $5,10,15,\dots$. The second is $p_2=7$: cross out $7,14,21,28,\dots$ among the survivors, so $35$ was already gone. At $t=0.1$ the four sums are
$$
\Theta_g(0.1)=0.000000,\quad\Theta_g^{(1)}(0.1)=-0.145345,\quad\Theta_g^{(2)}(0.1)=-0.347276,\quad\lim_j\Theta_g^{(j)}(0.1)=-0.418800,
$$
where $\Theta_g(0.1)$ is about $10^{-8}$ because theta sums with $g(0)=\int g=0$ decay fast as $t\to0$, and $\Theta_g^{(1)}(0.1)=\Theta_g(0.1)-\Theta_g(0.5)$ is minus $\Theta_g(0.5)=0.145345$. At $s=2$ the Mellin transforms are $\eta(2)\Gamma(2)\pi^{-2}=\tfrac1{12}$, then $(1-\tfrac1{25})\tfrac1{12}=\tfrac2{25}$, then $(1-\tfrac1{49})\tfrac2{25}=\tfrac{96}{1225}$. We checked the first two against numerical Mellin integrals of the sums, at $s=2$ and at $s=\tfrac12+3i$, to eight digits.
::::
:::: used
The flag [[eq-ck-flag]] is built from these sums, and Proposition [[t-ck-shell]] studies their limit.
::::
:::::

### The flag of sieved theta sums and the slices {#s-ck-flag}

Let $U_j$ be the closure in $W_a$ of the weighted sieved sums $t^{1/2}\Theta_g^{(j)}(t)$, over all admissible $g$. Since every $D_p$ multiplies the Mellin transform by a function of $z$ and so does $A(\varphi)$, they commute, and every $U_j$ is invariant under $A(\varphi)$. The spaces form a decreasing chain
$$
U_0\supset U_1\supset U_2\supset\cdots,\qquad U_0=\overline{\mathcal V}.
$$ {#eq-ck-flag}
On the Mellin side, in the variable $z=s-\tfrac12$, the elements of $U_j$ have transforms $\prod_{i\le j}(1-p_i^{-z-1/2})\,\xi(z+\tfrac12)\,h(z)$ with $h$ entire of the class of chapter [[tate-theta]]. Dividing by the common factor identifies the quotient $U_{j-1}/U_j$ with functions $h$ modulo multiples of $1-p_j^{-z-1/2}$, which is the orbital quotient $E_{p_j}$ of chapter [[primes-as-circles]], shifted by $\tfrac12$ because of the weight: functions on the circle $\RR_{>0}/p_j^\ZZ$ of length $\log p_j$, with dual basis the evaluations at the zeros
$$
z_m=-\tfrac12+\frac{2\pi i m}{\log p_j},\qquad m\in\ZZ,
$$
of $1-p_j^{-z-1/2}$. These zeros are simple. The source identifies the subquotient with the orbital quotient and its orbital Schauder basis on p. 27. That the theta quotient equals the quotient of all functions is the strong co-primality of chapter [[primes-as-circles]] (Theorem 7.5.0.1, p. 374), and that the circle at $p_j$ meets the earlier ones only at $s=0$ is the polar multiplicity theorem (Theorem 7.1.3.2, p. 324).

The slices of the kernel follow the flag. Define, on $\AA^\times\times\AA^\times$,
$$
k_{p_j}(x,y)=\bigl(\alpha_{j-1}(y)-\alpha_j(y)\bigr)K(x,y),\qquad j\ge1,
$$
the part of $K$ whose second variable is a unit at $p_1,\dots,p_{j-1}$ but not at $p_j$. The source writes the same difference in the other order, $(\alpha_{k+1}-\alpha_k)K$ (p. 27; (11.3.1.4), p. 494); the sign is irrelevant for a mass that will turn out to be zero. Acting on the adelic function $f$, the cut kernel $K\alpha_j(y)$ sees only $\alpha_jf$, so by [[t-ck-sieve]] the slice $k_{p_j}$ turns the sieved sum $\Theta^{(j-1)}_g$ into $A(\varphi)$ applied to the deleted multiples $\Theta^{(j-1)}_g(p_jt)$. It kills $U_j$, whose elements have nothing left to delete at $p_j$, and on $U_{j-1}$ its Mellin multiplier is $M\varphi(z)\,p_j^{-z-1/2}$. At the zeros $z_m$ the factor $p_j^{-z_m-1/2}$ equals 1, so on the quotient $U_{j-1}/U_j$ the slice induces exactly the operator that $A(\varphi)$ induces. This paragraph is our account, over $\QQ$, of the source's description on pp. 26 to 27 and 50 to 51.

For a finite flag of invariant subspaces of a matrix, the trace is additive over the successive quotients, $\Tr(B|_{U_0})=\sum_{j=1}^J\Tr(B\text{ on }U_{j-1}/U_j)+\Tr(B|_{U_J})$, because the matrix is block upper triangular in a basis adapted to the flag. The telescoping identity $\alpha_0=\sum_{j=1}^J(\alpha_{j-1}-\alpha_j)+\alpha_J$ is the kernel version of the same bookkeeping:
$$
K=\sum_{j=1}^Jk_{p_j}+\alpha_J(y)K.
$$ {#eq-ck-telescope}
The analogy with block triangular matrices is ours. Two things remain: the mass of each slice, and the limit of $\alpha_J(y)K$ as $J\to\infty$.

::: symbols
| Symbol | What it is | Kind | Where it lives |
| --- | --- | --- | --- |
| $P^{\mathrm{geom}}$, $P^{\mathrm{spec}}$ | orthogonal projections of $W_a$ onto $\overline{\mathcal V}$ and onto its complement | operators | [[s-ck-problem]] |
| $k_{\mathrm{spec}}$, $k_{\mathrm{geom}}$ | kernels of $A(\varphi)P^{\mathrm{spec}}$ and $A(\varphi)P^{\mathrm{geom}}$ | kernels | [[d-ck-spec-geom]] |
| $p_1<p_2<\cdots$ | the primes beyond $Y$, in order | primes | [[s-ck-sieve]] |
| $\alpha_j$ | indicator of the ideles that are units at $p_1,\dots,p_j$ | function on $\AA^\times$ | [[d-ck-strata]] |
| $\Theta_g^{(j)}$ | theta sum with the multiples of $p_1,\dots,p_j$ deleted | function on $\RR_{>0}$ | [[t-ck-sieve]] |
| $U_j$ | closure in $W_a$ of the weighted $\Theta_g^{(j)}$ | closed subspace | [[eq-ck-flag]] |
| $K$ | lifted geometric kernel | function on $\AA^\times\times\AA^\times$ | [[s-ck-ideles]] |
| $k_{p_j}$ | slice of $K$ at $p_j$ | kernel | [[s-ck-flag]] |
| $k_S$ | the $S$-local remnant of $K$ | kernel | [[s-ck-remnant]] |
| $\operatorname{mass}(k)$ | smoothened diagonal integral | number | [[d-ck-kernel]] |
:::

:::: figure {#f-ck-sieve viz="ck-sieve" height="440"}
Removing the primes beyond $Y$ one at a time crosses integers out of the theta sum, and the sum settles on the sum over the integers built from the primes up to $Y$.

```vizspec
Purpose: show the divisorial stratification as a sieve on the theta sum.
Scene: top panel, a row of dots for n = 1 to 60 (two rows of 30 if narrow), labeled every 5. Dots for n whose
  prime factors are all at most Y are gold and never removed; other surviving dots are muted; dots crossed out by
  the removal of prime p are drawn red with a cross, and a small label "p" sits under the newest crossings.
  Bottom panel, axes t in [0.03, 1.5] on a log scale horizontally and value in [-0.8, 0.3] vertically. Draw
  Theta^(j)(t) = 2 * sum over surviving n >= 1 of g(n t) as a bright gold curve, where
  g(x) = x^2 (exp(-pi x^2) - 8 exp(-4 pi x^2)) and n runs to 20000 (precompute on 300 log-spaced t values).
  Draw the limit (n with all prime factors at most Y) as a thin blue dashed curve, and the original Theta_g as a
  pale muted curve. Shade the region t < 1/R in muted gray with R = 10, labeled "outside the shell".
Controls: buttons "remove next prime" and "reset"; a selector Y in {2, 3, 5, 7} (default 3). The next prime is
  the smallest prime above Y not yet removed. Show the list of removed primes and the Mellin factor
  "2 zeta(s) Mg(s) times (1 - 5^-s)(1 - 7^-s)..." as text.
Motion: on each removal the crossed dots flash red and the gold curve morphs over 300 ms to its new shape.
Reader takeaway: each removal deletes the multiples of one prime; on t >= 1/R the curve reaches the dashed
  limit after a handful of removals, while near t = 0 the limit does not decay.
Data: none beyond the formula. Reference values at t = 0.1 with Y = 3: 0.000000, -0.145345, -0.347276, limit -0.418800.
```
::::

## Every slice beyond Y has zero mass {#s-ck-vanishing}

The slice at $p_j$ acts on the orbital quotient at $p_j$, and chapter [[primes-as-circles]] computed traces there. The theorem below is that computation transported to the slice, with the weight $t^{1/2}$ carried along.

::::: card {#t-ck-slices-vanish kind="theorem" title="For a test function supported in $(1,Y)$, every slice at a prime beyond $Y$ has diagonal mass zero" source="masullo" loc="Theorem 11.3.2.1, p. 495"}
:::: statement
Let $a>0$, let $\varphi$ be smooth with $\operatorname{supp}\varphi\subset(1,Y)$, and let $p_j>Y$. The slice $k_{p_j}$ has diagonal mass, in the skewered form [[eq-ck-skewer]],
$$
\operatorname{mass}(k_{p_j})=\sum_{m\in\ZZ}M\varphi\Bigl(-\tfrac12+\frac{2\pi im}{\log p_j}\Bigr)=\log p_j\sum_{k\in\ZZ}p_j^{-k/2}\,\varphi(p_j^k),
$$ {#eq-ck-slice}
and this number is $0$.
::::
:::: plain
Each slice is convolution on a circle of length $\log p$. Its trace is a sum of samples of $\varphi$ at the powers of $p$, and when $p$ is beyond the support of $\varphi$ no power of $p$ lands in the support.
::::
:::: why
Every slice is a piece of $\operatorname{mass}(k_{\mathrm{geom}})$ that could have carried information about zeros outside the strip. Its vanishing is what concentrates the whole geometric side on the finitely many places in $S$, a cancellation of the kernel's mass along the diagonal that the source singles out on p. 32.
::::
:::: idea
On the quotient $U_{j-1}/U_j$ the slice acts as $A(\varphi)$ on functions on a circle, so its matrix in the exponential basis is diagonal with entries $M\varphi(z_m)$. Poisson summation on the circle turns the sum of those entries into a sum over the points $p^k$ of the dual lattice, the same computation as the toy circle of chapter [[primes-as-circles]].
::::
:::: proof
We give the argument over $\QQ$ step by step and name, at each step, where the source proves the functional-analytic part.

::: steps
1. The slice vanishes on $U_j$ and induces on $U_{j-1}/U_j$ the operator induced by $A(\varphi)$ ([[s-ck-flag]]), so its trace is the trace of $A(\varphi)$ on the orbital quotient at $p_j$, with dual basis the evaluations at the simple zeros $z_m$ of $1-p_j^{-z-1/2}$.
2. In that basis $A(\varphi)$ is diagonal, because $M(A(\varphi)\psi)=M\varphi\cdot M\psi$ multiplies the functional "evaluate the Mellin transform at $z_m$" by $M\varphi(z_m)$. So the trace of $A(\varphi)$ on $U_{j-1}/U_j$ is $\sum_{m\in\ZZ}M\varphi(z_m)$.
3. The sum converges absolutely. With $u=\log t$ and $h(u)=\varphi(e^u)e^{-u/2}$, a smooth function with compact support, $M\varphi(z_m)=\int_\RR h(u)e^{2\pi imu/\log p_j}\,\dd u=\hat h(-m/\log p_j)$, which decays faster than any power of $m$.
4. Poisson summation for the lattice $L\ZZ$ with $L=\log p_j$ gives $\sum_m\hat h(m/L)=L\sum_kh(kL)$, and $h(k\log p_j)=p_j^{-k/2}\varphi(p_j^k)$, so $\sum_{m\in\ZZ}M\varphi(z_m)=\log p_j\sum_{k\in\ZZ}p_j^{-k/2}\varphi(p_j^k)$.
5. For $k\ge1$ the point $p_j^k\ge p_j>Y$, and for $k\le0$ the point $p_j^k\le1$. Neither lies in $(1,Y)$, so every term vanishes and $\operatorname{mass}(k_{p_j})=0$.
:::

Steps 2 to 5 are complete as written. Step 1 and the identification of the trace with the diagonal mass are where the source's functional analysis is needed, because the points $z_m$ lie on the line $\Re z=-\tfrac12$, outside the strip $\lvert\Re z\rvert<a$ when $a<\tfrac12$, so evaluation there is not continuous on $W_a$ (chapter [[strip-topology]]). The source builds the orbital bases on the unweighted theta sums, where the points are $s=2\pi im/\log p_j$ on the line $\Re s=0$: Theorem 11.2.0.2 (p. 485) gives a Markushevich basis of the orbital quotient with dual elements $t^{\varepsilon}$ at the zeros $\varepsilon$ of $1-p^{-s}$, and Theorem 11.2.2.1 (p. 490) proves that $A(\varphi)$ is nuclear there with trace $\sum_\varepsilon M\varphi(\varepsilon)$. Both carry a Sobolev factor of degree at least 2, which makes evaluation on that line continuous (Remark 11.2.2.2, p. 491). The weight $t^{1/2}$ is then carried through Paley-Wiener levels, closed subspaces defined by a support condition on Fourier transforms on which multiplication by $t^a$ is continuous, whose union recovers the whole trace in the limit (Section 11.2.1, p. 487; Theorem 11.2.1.2, p. 488; p. 51). On those levels the slice is a trace-norm limit of the finite-rank kernels built from the basis, so its truncated diagonal mass is the trace of a nuclear operator (Theorem 12.1.1.2, p. 499; Proposition 12.2.2.2, p. 508), and the truncations are removed in the limit (proof of Theorem 11.3.2.1, pp. 495 to 496). The weighted evaluation points $\varepsilon-\tfrac12$ are the source's own, in (11.3.2.5) on p. 496.
::::
:::: example
Take $p_j=5$ and for $\varphi$ the bump $\varphi(t)=\operatorname{bump}\bigl((\log t-c)/r\bigr)$ of chapter [[tate-theta]], with $\operatorname{bump}(x)=e^{-1/(1-x^2)}$ for $\lvert x\rvert<1$, which is supported on $(e^{c-r},e^{c+r})$. For $\operatorname{supp}\varphi=(1.5,4)$ every sample $5^k$ misses the support and both sides of [[eq-ck-slice]] are 0; summing $M\varphi(z_m)$ over $\lvert m\rvert\le60$ numerically leaves $6.5\times10^{-7}$, the tail of the series. Widen the support to $(1.5,6)$, which violates the hypothesis because $5\in(1.5,6)$: now the sum over $m$ gives $0.0806542$ and the right side gives $\log5\cdot5^{-1/2}\varphi(5)=0.0806542$, so the slice at 5 is no longer zero, as it should not be.
::::
:::: used
Corollary [[t-ck-remnant]] adds the slices up, and chapter [[trace-formula]] uses the result through the $S$-local kernel.
::::
:::::

The source prints the right side of [[eq-ck-slice]] as $\frac{\log q_v}{\mu_v(\mathcal O_v^\times)}\sum_k\varphi(\pi_v^k)$, which over $\QQ$ is $\log p\sum_k\varphi(p^k)$, the unweighted trace of chapter [[primes-as-circles]] (Theorem 11.3.2.1, p. 495; pp. 19 and 52). In our notation we have carried the weight $t^{1/2}$ of the source's proof, its points $\varepsilon_p-\tfrac12$ in (11.3.2.5), through the Poisson step, which multiplies the $k$-th term by $p^{-k/2}$. Every term in either form contains the factor $\varphi(p^k)$, so the vanishing is the same.

::: aside {title="The slice is the prime's own term in Weil's formula"}
This observation is ours. For $\varphi$ supported in $(1,\infty)$ only $k\ge1$ contributes to [[eq-ck-slice]], and the slice mass is $\sum_{k\ge1}\log p\cdot p^{-k/2}\varphi(p^k)=\sum_{k\ge1}\Lambda(p^k)(p^k)^{-1/2}\varphi(p^k)$, which is exactly the contribution of the prime $p$ to the prime side $\sum_n\Lambda(n)n^{-1/2}\bigl(\varphi(n)+\varphi(1/n)\bigr)$ that the Trace Formula over $\QQ$ shares with Weil's explicit formula (chapter [[trace-formula]]). The source reads the orbital traces as the local traces that Deninger anticipated (p. 33). So a slice vanishes exactly when its prime has nothing to contribute to the prime side, and cutting the slices away for $p>Y$ removes nothing from the final formula.
:::

:::: figure {#f-ck-slice-spectra viz="ck-slice-spectra" height="460"}
Each removed prime adds a column of eigenvalue points on the line $\Re z=-\tfrac12$, outside the strip, and the eigenvalues in each column add up to zero when the prime is beyond the support of $\varphi$.

```vizspec
Purpose: show where the slices' spectra sit relative to the strip, and that each slice trace vanishes.
Scene: left panel, the complex z-plane with Re z in [-0.8, 0.8] and Im z in [-30, 30]. Shade the strip |Re z| < a
  in pale violet, draw Re z = 0 as a violet line. Plot the zeros rho - 1/2 of zeta (first 10 ordinates above and
  below, at Re z = 0) as teal dots. For each removed prime p, draw the points -1/2 + 2 pi i m / log p for
  |Im| <= 30 as small gold dots in a column on Re z = -1/2, slightly offset horizontally per prime (by 0.03 per
  prime) so the columns are distinguishable, each column labeled with its p.
  Right panel, the test function phi(t) = bump on (exp(c - r), exp(c + r)) plotted against log t in [0, 3.5],
  with vertical gold ticks at log p^k for k = 1, 2, 3 and each removed p. Below it a readout table: for each
  removed p, the partial sum over |m| <= 40 of M phi(-1/2 + 2 pi i m / log p) (computed by quadrature in u = log t)
  and log p * sum_k p^(-k/2) phi(p^k).
Controls: slider a from 0.05 to 0.45 (default 0.2); slider Y from 2 to 12 (default 3), which sets the support
  of phi to (1.2, Y) in t; buttons "remove next prime" (next prime above Y) and "reset".
Motion: new column fades in over 300 ms.
Reader takeaway: the slice spectra live outside the strip; when the ticks log p^k all fall outside the support,
  the readout for that p is zero; if Y is raised past a removed prime the readout becomes nonzero in red.
Data: first 10 zero ordinates of zeta (kit provides).
```
::::

## The shell structure: where the infinite limit is taken {#s-ck-shell}

The telescoping identity [[eq-ck-telescope]] holds for each finite $J$. To conclude, we need $J\to\infty$: the remnant $\alpha_J(y)K$ should converge to a kernel that sees only the places in $S$, and the sum of the slice masses should converge to the mass of the slices. On the theta sums the limit is concrete. As $J\to\infty$ the sieve deletes every integer with a prime factor beyond $Y$, and what is left is the sum over the $Y$-smooth integers, those whose prime factors are all at most $Y$. In adelic terms it is the $S$-local theta sum, the periodization of $g\otimes\bigotimes_{p\le Y}\mathbf 1_{\ZZ_p}\otimes\bigotimes_{p>Y}\mathbf 1_{\ZZ_p^\times}$. With a general $S$-local function $f_S$ in place of $g\otimes\bigotimes_{p\le Y}\mathbf 1_{\ZZ_p}$ it is a sum over the $S$-units $\pm\prod_{p\le Y}p^{e_p}$, $e_p\in\ZZ$ (p. 483).

The limit does not hold everywhere. The sieved sums $\Theta^{(j)}_g$ decay rapidly as $t\to0$, like $\Theta_g$, but their limit does not: there are only on the order of $(\log X)^{\pi(Y)}$ smooth integers below $X$, too few for the cancellation that Poisson summation forces in $\Theta_g$. The example of [[t-ck-sieve]] shows it at $t=0.05$, where $\Theta_g$, $\Theta^{(1)}_g$, and $\Theta^{(2)}_g$ are $0.000000$, $-0.000107$, and $-0.017364$, while the limit is $-0.710081$. The source therefore takes the limit on shells $\{t\ge1/R\}$ with $R>0$, which give its Chapter 11 its name (the source writes $\Lambda$ for $R$; on this page $\Lambda$ is von Mangoldt's function).

::::: card {#t-ck-shell kind="proposition" title="On every shell $t\ge1/R$, the sieved theta sums converge to the $S$-local theta sum" source="masullo" loc="Proposition 11.1.1.2, p. 476; Theorem 11.1.2.1, p. 480"}
:::: statement
Let $g$ be even and Schwartz, $R>0$, $r\ge1$, and $w(t)$ a weight of at most polynomial growth in $\log t$, such as $(1+\lvert\log t\rvert^2)^{\sigma_0/2}$. Then
$$
\Theta_g^{(j)}(t)\ \longrightarrow\ \sum_{\substack{n\ne0\\ p\mid n\Rightarrow p\le Y}}g(nt)\qquad(j\to\infty)
$$
pointwise for every $t>0$, and in $L^r\bigl([1/R,\infty),\,w(t)\,\dd t/t\bigr)$.
::::
:::: plain
Removing the primes beyond $Y$ one at a time makes the theta sums converge, on any region bounded away from $t=0$, to the sum over the integers built from the primes up to $Y$.
::::
:::: why
It is the convergence that lets the infinitely many cuts add up: the remnant $\alpha_J(y)K$ acts on theta sums through the sieved sums, and this proposition says that their limit is the $S$-local theta sum, so the remnant converges to a kernel that sees only $S$.
::::
:::: idea
Each integer $n$ is either eventually crossed out, if it has a prime factor beyond $Y$, or never crossed out. So the sums converge term by term, and one fixed summable majorant makes the convergence uniform enough.
::::
:::: proof
Fix $t>0$. For each $n\ge1$ the indicator that $n$ survives the first $j$ removals is eventually constant in $j$: it is $1$ forever if all prime factors of $n$ are at most $Y$, and it becomes $0$ once the least prime factor of $n$ beyond $Y$ has been removed. Every surviving term is bounded by $\lvert g(nt)\rvert$, and $\sum_{n\ge1}\lvert g(nt)\rvert<\infty$ because $g$ is Schwartz, so dominated convergence over $n$ gives the pointwise limit. For the $L^r$ limit we need one majorant in $t$. Every sieved sum and the limit are bounded by $J(t)=2\sum_{n\ge1}\lvert g(nt)\rvert$. Since $g$ is Schwartz, $\lvert g(x)\rvert\le C(1+x^2)^{-1}$, so $J(t)\le2C\sum_{n\ge1}(1+n^2t^2)^{-1}\le2C\bigl(1+\tfrac{\pi}{2t}\bigr)$, which is at most $2C(1+\pi R/2)$ on $[1/R,\infty)$. For $t\ge1$ the bound $\lvert g(x)\rvert\le C_N\lvert x\rvert^{-N-2}$ gives $J(t)\le2C_N\zeta(N+2)\,t^{-N-2}$ for every $N$. So $J^rw$ is integrable against $\dd t/t$ on the shell, and dominated convergence in $t$ gives the convergence in $L^r$. Near $t=0$ the bound $J(t)$ grows like $1/t$, and no single majorant works there, which is why the statement is restricted to shells. This is the source's Proposition 11.1.1.2 (p. 476) specialized to $\QQ$, where its majorant $J_F(\alpha)$ is our $J$ and its fractional ideal is $\ZZ$.
::::
:::: example
With $Y=3$, $R=10$, the function $g$ of the earlier example, and $w=1$, the distance in $L^2([0.1,20],\dd t/t)$ between $\Theta^{(j)}_g$ and its limit, after removing all primes up to $P$, is $0.113$ for $P=5$, $0.0187$ for $P=7$, $1.3\times10^{-4}$ for $P=13$, $8\times10^{-8}$ for $P=19$, and below $10^{-12}$ from $P=29$ on: on this shell $g(nt)$ is negligible once $nt$ exceeds about 6.
::::
:::: used
Corollary [[t-ck-remnant]] uses it to pass to the limit in [[eq-ck-telescope]], and chapter [[trace-formula]] starts from the $S$-local theta sums it produces.
::::
:::::

The source's Theorem 11.1.2.1 (p. 480) says more, in the completed space. For any order in which the places outside $S$ are removed, the closed subspaces of truncated sieved theta sums decrease to a limit that does not depend on the order, each removal of a new prime shrinks the subspace strictly, and the limit is the closure of the span of the truncated $S$-local theta sums $\mathbf 1_{t\ge1/R}\sum_\xi(f_S\otimes\bigotimes_{p\notin S}\mathbf 1_{\ZZ_p^\times})(\xi\,\cdot)$. Strictness comes from the orbital bases, which separate consecutive spaces, and the description of the limit uses the fact that the evaluation $\hat\delta_0$ at zero of the Fourier transform is discontinuous for the truncated norm. The passage from functions to diagonal masses is Proposition 12.2.2.4 (p. 512): for an increasing family of open subgroups $G_J$ exhausting the ideles, here the ideles that are units at every prime beyond the $J$-th one, with each quotient $G_{J+1}/G_J$ free of rank one, the part of the lifted kernel whose second variable lies outside the $J$-th subgroup has skewered mass tending to 0. Over $\QQ$ the reason is the absolute convergence in [[t-ck-skewered]]: each term of the double integral eventually leaves that part, and dominated convergence does the rest.

## Why one prime at a time {#s-ck-one-at-a-time}

There is an obvious shortcut, and the source explains why it fails in a coarse topology. Remove all the primes beyond $Y$ at once. On the Mellin side that is multiplication by the infinite product
$$
\prod_{p>Y}\bigl(1-p^{-s}\bigr),
$$
which turns $2\zeta(s)Mg(s)$ into $2Mg(s)\prod_{p\le Y}(1-p^{-s})^{-1}$. This is Meyer's route, as the source paraphrases it (pp. 32, 39): degenerate a global operator into an $S$-local one with operators that become infinite reciprocal Euler products, compute the $S$-local trace following Connes, and show that what was left behind contributes nothing. The product converges absolutely exactly where $\sum_pp^{-\sigma}<\infty$, that is for $\sigma>1$. At $\sigma=1$ Mertens's theorem of chapter [[euler-product]] says that $\sum_{p\le x}1/p$ grows like $\log\log x$ [@mertens1874], and inside the critical strip there is no absolute convergence at all. So Meyer's operators converge only in topologies at least as fine as uniform convergence of the Mellin transforms on vertical strips in $\Re s>1$, and, through the functional equation, in $\Re s<0$ (p. 39). In such a fine topology every evaluation at every zero is continuous, every zero enters the spectral side, and the trace formula that comes out is Weil's explicit formula again (pp. 32, 39). The source calls Mertens's theorem "a herald for GRH" (p. 40): running into it means that the infinite product has to be avoided.

The source's change is to take the steps one at a time and keep track of what each step loses (pp. 40 to 41). Each step is finite: one reciprocal Euler factor $1-p^{-s}$, whose zeros are explicit and simple, so the lost piece $U_{j-1}/U_j$ is a circle with an explicit basis, and its trace is computed exactly, as in [[t-ck-slices-vanish]]. The only infinite limit is taken on the function side, in the sense of [[t-ck-shell]]: pointwise and in $L^r$ on shells, which the rapid decay of Schwartz functions provides with no Euler product in sight. The source describes this as a weaker, approximate form of Meyer's Euler product convergence, asserted only on relatively compact regions, for which the bases compensate (pp. 32 to 33). The example makes the contrast concrete. The $S$-local theta sum $\sum_{n\ Y\text{-smooth}}g(nt)$ is a perfectly good limit at each $t>0$, and its Mellin transform $2Mg(s)\prod_{p\le Y}(1-p^{-s})^{-1}$ converges for every $\Re s>0$, yet the multiplier $\prod_{p>Y}(1-p^{-s})$ that would produce it from $2\zeta(s)Mg(s)$ converges absolutely only for $\Re s>1$.

:::: figure {#f-ck-euler-vs-sieve viz="ck-euler-vs-sieve" height="420"}
Inside the critical strip the Euler product no longer converges absolutely, and over the 200 primes drawn its partial products are still drifting, while the sieved theta sum at a fixed point settles within a few primes.

```vizspec
Purpose: contrast Meyer's infinite Euler product with the one-prime-at-a-time sieve.
Scene: left panel, horizontal axis P (number of primes removed beyond Y = 3, from 0 to 200, i.e. primes from 5
  up to the 202nd prime), vertical axis in [0, 3]. Plot |prod_{3 < p <= P} (1 - p^(-s))| for s = sigma + i tau
  as a red curve. Draw the value |zeta(s)^-1 (1 - 2^-s)^-1 (1 - 3^-s)^-1| as a blue horizontal line when
  sigma > 1 (the limit), and no line when sigma <= 1.
  Right panel, same horizontal axis P from 0 to 40 primes; plot Theta^(j)(t0) for the function
  g(x) = x^2 (exp(-pi x^2) - 8 exp(-4 pi x^2)) at the fixed point t0 as a gold curve with dots, and its limit
  (sum over 3-smooth n) as a blue dashed horizontal line.
Controls: slider sigma from 0.3 to 2 (default 0.6); slider tau from 0 to 30 (default 14.13); slider t0 from
  0.05 to 1 (default 0.1).
Motion: none beyond redraw.
Reader takeaway: for sigma <= 1 the red curve keeps drifting (to 0 at sigma = 1, tau = 0, by Mertens), while the
  gold curve reaches its limit after finitely many removals at every t0.
Data: primes up to 1300 (kit or computed).
```
::::

## What is left: the S-local kernel {#s-ck-remnant}

Let $J\to\infty$ in [[eq-ck-telescope]]. The remnant $\alpha_J(y)K$ converges to the source's $S$-local kernel
$$
k_S=\lim_{J\to\infty}\alpha_J(y)\,K(x,y),
$$
which acts on theta sums through the $S$-local theta sums of [[t-ck-shell]]. In the source's terms, $k_S$ is supported, in its effect on theta functions, on $\AA_{\QQ,S}^\times\times\prod_{p>Y}\ZZ_p^\times$ in the variable $y$, is invariant under $\prod_{p>Y}\ZZ_p^\times$ there, and factors through a kernel on $\AA^\times_{\QQ,S}\times C_\QQ$ with the same diagonal mass, where $\AA_{\QQ,S}=\RR\times\prod_{p\le Y}\QQ_p$ (pp. 16, 27, 52). It is a kernel about the finitely many completions in $S$, nothing more.

::::: card {#t-ck-remnant kind="corollary" title="Only the $S$-local kernel carries diagonal mass, and its mass is minus the zero sum over the strip" source="masullo" loc="pp. 16 and 52; proof of Theorem 12.5.1.1, p. 520"}
:::: statement
Let $a>0$, $\varphi$ smooth with $\operatorname{supp}\varphi\subset(1,Y)$, and $S=\{\infty\}\cup\{p\le Y\}$. Then
$$
\operatorname{mass}(k_S)=\operatorname{mass}(k_{\mathrm{geom}})=-\sum_{\lvert\beta-1/2\rvert<a}m_\rho\,M\varphi(\rho-\tfrac12).
$$ {#eq-ck-remnant}
::::
:::: plain
After every prime beyond $Y$ has been cut away at no cost, the small piece of the kernel that knows only about the real numbers and the primes up to $Y$ still carries the full diagonal mass, which is minus the sum over the zeros in the strip.
::::
:::: why
It reduces the global problem to an $S$-local one. Computing $\operatorname{mass}(k_S)$ is a problem about $\RR\times\prod_{p\le Y}\QQ_p$ alone, which Connes solved, and the source describes this reduction as what the whole work is about (p. 16).
::::
:::: idea
Telescoping, then vanishing of every slice, then the shell limit, then the proto-trace formula.
::::
:::: proof
By [[t-ck-skewered]] and linearity, the masses of the pieces in [[eq-ck-telescope]] add up: $\operatorname{mass}(k_{\mathrm{geom}})=\sum_{j=1}^J\operatorname{mass}(k_{p_j})+\operatorname{mass}(\alpha_JK)$ for every $J$. Each $p_j$ exceeds $Y$, so every slice mass is 0 by [[t-ck-slices-vanish]], and $\operatorname{mass}(\alpha_JK)=\operatorname{mass}(k_{\mathrm{geom}})$ for every $J$. As $J\to\infty$, $\operatorname{mass}(\alpha_JK)\to\operatorname{mass}(k_S)$ by the shell structure ([[t-ck-shell]]; Theorem 11.1.2.1, p. 480) and Proposition 12.2.2.4 (p. 512). Hence $\operatorname{mass}(k_S)=\operatorname{mass}(k_{\mathrm{geom}})$, and [[t-ck-proto]] gives the value. The source states the result on pp. 16 and 52 and uses it in this form in the proof of Theorem 12.5.1.1 (p. 520).
::::
:::: used
Chapter [[trace-formula]] computes $\operatorname{mass}(k_S)$ with Connes's $S$-local method, which is where the weight $\tfrac12$ becomes necessary, and turns [[eq-ck-remnant]] into the Trace Formula. Chapter [[trace-to-grh]] uses the result.
::::
:::::

Here is what chapter [[trace-formula]] receives. The left side of [[eq-ck-remnant]] is a diagonal mass on $\AA^\times_{\QQ,S}$, to be computed with the $S$-adelic Fourier transform as Connes did in 1998 [@connes1999] (Theorem 12.4.1.1, p. 514). It will come out as Weil's local terms at $\infty$ and at each $p\le Y$, minus the two pole terms $M\varphi(\tfrac12)+M\varphi(-\tfrac12)$. The local terms at the primes $p>Y$ vanish for our $\varphi$ by the same argument as the slices, since they are also sums of samples $\varphi(p^{\pm k})$, so the result is Weil's complete prime side. The right side has only the zeros in the strip. Every step leading here was done inside $W_a$, which is what the source means by "GRH is a topological phenomenon" (p. 31).

## What changes in general {#s-ck-general}

For a number field $F$ and a unitary Hecke character $\chi$, the class group $C_F$ has a compact part $C_F^1$, and the computation runs one isotype $\chi|_{C_F^1}$ at a time. The set $S$ must contain the archimedean places, the places where $F$ or $\chi$ ramifies, and enough places for $\mathrm{Pic}(\mathcal O_{F,S})=1$, so that every theta function has the form $f_S\otimes\bigotimes_{v\notin S}\mathbf 1_{\mathcal O_v}$ (Fifth Structure Theorem, Theorem 6.2.1.1, p. 295; pp. 25, 48), and $S$ is chosen so that the support of $\varphi$ lies in $(1/T,T)$ with $T<N\mathfrak p_v$ for every finite $v\notin S$ (proof of Theorem 12.5.1.1, p. 520). Several places can lie above one prime $p$. The source therefore removes whole fibers $S_p$ at a time, the primary divisorial stratification (pp. 26, 49 to 50), so that each slice acts on the orbital quotient $E_{S_p}$ with dual basis at the zeros of $\prod_{v\mid p}L_v(\chi_v\lvert\cdot\rvert_v^s)^{-1}$. These factors can share up to $[F:\QQ]$ zeros, which is why the Sobolev degree is taken at least $2[F:\QQ]$ (Remark 11.2.2.2, p. 491; Theorem 7.1.3.2, p. 324). The slice mass becomes $\sum_{v\mid p}\frac{\log q_v}{\mu_v(\mathcal O_v^\times)}\sum_k\varphi(\pi_v^k)$ in the source's normalization, with twists by $\chi(\pi_v)$ inside the exponential bases, and it vanishes for the same reason: $q_v$ exceeds the support. The strata are still defined on the ideles $\GL_1(\AA_F)$ and lost in $C_F$, and the lift uses the fundamental domain $\tau(\RR_{>0})\cdot E_F^1$ (p. 24).

:::: recap
- The trace of chapter [[strip-topology]] is minus the diagonal mass of the geometric kernel $k_{\mathrm{geom}}=\varphi(x/y)-k_{\mathrm{spec}}$, because the convolution kernel vanishes on the diagonal when $\varphi(1)=0$ ([[t-ck-proto]]). Lebesgue differentiation defines the diagonal values, and the maximal theorem makes their integral equal the trace.
- Lifted to the ideles with the fundamental domain $\RR_{>0}\times\hat\ZZ^\times$, the diagonal mass becomes a sum over skewered diagonals ([[t-ck-skewered]]), and the kernel can be cut by the indicators $\alpha_j$ of "unit at $p_1,\dots,p_j$".
- Cutting at $p_j$ is the sieve step $D_{p_j}$ on the theta sum, multiplication by $1-p_j^{-s}$ on the Mellin side ([[t-ck-sieve]]), and the slice acts on the orbital quotient at $p_j$.
- Every slice at a prime beyond $Y$ has mass $\log p\sum_kp^{-k/2}\varphi(p^k)=0$ ([[t-ck-slices-vanish]]), the removals converge on shells ([[t-ck-shell]]), and the $S$-local kernel carries the whole mass ([[t-ck-remnant]]). Chapter [[trace-formula]] computes that mass, and chapter [[trace-to-grh]] compares the result with Weil's explicit formula.
::::
