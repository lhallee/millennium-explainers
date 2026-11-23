---
id: trace-formula
title: The local trace and the Trace Formula
part: 3
summary: After this chapter you can compute the S-local diagonal mass place by place, say why the weight has to be one half, state the Trace Formula over Q with its constants, and set it beside Weil's explicit formula, from which it differs only in which zeros it counts.
needs: [cutting-the-kernel, weil-positivity]
---

::: plain
After the sieve of the previous chapter, everything that is left of the prime side lives at finitely many places: the real numbers and the primes up to the reach of the test function. This chapter computes that remnant. At each place the answer is one integral, and at a prime it can be done by hand and gives back the prime-power terms of the explicit formula. Put next to the spectral side, this is the Trace Formula: the complete prime sum of Weil equals the poles minus only those zeros that lie in a strip around the critical line, however thin the strip is.
:::

Chapter [[cutting-the-kernel]] ended with an equation whose right side is the spectral trace of chapter [[strip-topology]], minus the sum of $M\varphi(\rho-\tfrac12)$ over the zeros in the strip $\lvert\Re z\rvert<a$, and whose left side is the diagonal mass of a kernel that sees only the places in a finite set $S$. Nothing about zeros is left to do. What remains is a computation with the primes $p\le Y$ and the real place, and the source takes it from A. Connes, who did it in 1998 for a different purpose [@masullo, §12.4, p. 514] [@connes1999]. We do it in three passes. First a single place, the real line, where the whole computation fits in a paragraph and shows where the shape $1/\lvert1-t\rvert$ comes from. Then the general $S$, where the additive Fourier transform turns a trace into a volume, and where the weight $\tfrac12$ is forced. Then the local terms by hand. The chapter ends with the Trace Formula over $\QQ$, checked against several hundred zeros, its general statement, and a line-by-line comparison with Weil's explicit formula from chapter [[weil-positivity]].

## Where the sieve left the calculation {#s-tf-where}

Fix the data that every statement in this chapter uses. The test function $\varphi$ is smooth on $\RR_{>0}$, has compact support inside $(1/Y,Y)$ for a real number $Y>1$, and satisfies $\varphi(1)=0$. The sieve of chapter [[cutting-the-kernel]] was run under the source's standing assumption that the support lies in $(1,Y)$, to the right of $1$. The local computations of this chapter do not care on which side of $1$ the support lies, and the last step of the proof of [[t-tf-trace-formula]] removes the assumption, as the source does. The finite set of places is $S=\{\infty\}\cup\{p\le Y\}$, the real place together with every prime up to $Y$. The strip has half-width $a>0$, and the coarse Hilbert space is the space $W_a$ of chapter [[strip-topology]], in which only the zeros with $\lvert\beta-\tfrac12\rvert<a$ survive in the quotient by the closure of the weighted theta sums.

In this setting chapter [[cutting-the-kernel]] split the geometric kernel into the $S$-local remnant $k_S$ and one orbital slice $k_p$ for each prime $p>Y$, showed that each orbital slice has diagonal mass $\log p\sum_kp^{-k/2}\varphi(p^k)=0$ ([[t-ck-slices-vanish]]), and proved that the geometric diagonal mass is minus the spectral trace of chapter [[strip-topology]] ([[t-ck-proto]]). Together these give
$$
\int_0^\infty k_S(x,x)\,\frac{\dd x}{x}=-\sum_{\lvert\beta-1/2\rvert<a}m_\rho\,M\varphi\bigl(\rho-\tfrac12\bigr),
$$ {#eq-tf-reduction}
which is [[t-ck-remnant]] and the equation displayed at the top of the source's §1.2.3 [@masullo, p. 16], specialized to $\QQ$ and the trivial character. The source is explicit that this reduction is the whole difficulty: once the calculation has been brought down to the $S$-local diagonal mass, it regards the problem as solved [@masullo, p. 16]. The rest is a computation with finitely many places, none of which knows anything about zeros.

Two features of [[eq-tf-reduction]] decide how the computation goes. The left side is an integral of a kernel along the diagonal, so we need the kernel $k_S$ and not only the operator it represents. And the kernel is $S$-local, meaning that once it is lifted to the ideles it depends on the coordinates at the places of $S$ only, and is invariant under the units $\ZZ_p^\times$ at every prime outside $S$ [@masullo, p. 27]. So the natural home for the computation is the product of the completions at the places of $S$, and that is where we go next.

## The S-local stage {#s-tf-stage}

The adeles of chapter [[adeles]] keep one coordinate for every place. Keeping only the coordinates in $S$ gives a ring of the same kind that is a finite product, and it carries an additive Fourier transform exactly as $\RR$ does.

::: definition {#d-tf-s-adeles title="$S$-adeles, $S$-units, and the $S$-idele class group"}
The *$S$-adeles* are the finite product $\AA_S=\RR\times\prod_{p\le Y}\QQ_p$, a locally compact ring with componentwise operations, and the *$S$-ideles* are its units $\AA_S^\times=\RR^\times\times\prod_{p\le Y}\QQ_p^\times$, with the norm $\lvert x\rvert_S=\lvert x_\infty\rvert\prod_{p\le Y}\lvert x_p\rvert_p$. The *$S$-units* are the rational numbers $\omega=\pm\prod_{p\le Y}p^{e_p}$ with integer exponents $e_p$ of either sign, embedded diagonally in $\AA_S^\times$. They form a discrete subgroup, and the product formula of [[adeles]] gives $\lvert\omega\rvert_S=1$. The quotient $J_S=\AA_S^\times/\{S\text{-units}\}$ is the *$S$-idele class group*. It is a group, not a ring, and it is not the idele class group $C_\QQ$ of [[adeles]], although for our test functions the two give the same integrals.
:::

Every class in $J_S$ has a representative whose coordinate at each $p\le Y$ is a unit, because multiplying by $p^{e_p}$ moves $x_p$ into $\ZZ_p^\times$, and multiplying by $\pm1$ makes $x_\infty$ positive. So $J_S\cong\RR_{>0}\times\prod_{p\le Y}\ZZ_p^\times$, with the norm as the projection to $\RR_{>0}$, which is the $S$-local copy of $C_\QQ\cong\RR_{>0}\times\hat\ZZ^\times$. A function of the norm alone, such as our $\varphi$, is a function on $J_S$ that ignores the compact factor.

::: definition {#d-tf-measures title="The additive and multiplicative measures on the $S$-adeles"}
The additive measure $\nu_S$ on $\AA_S$ is the product of $\dd x$ on $\RR$ and the Haar measure $\dd x_p$ on each $\QQ_p$ with $\int_{\ZZ_p}\dd x_p=1$. It is self-dual for the character $\mathbf e_S(x)=\mathbf e_\infty(x_\infty)\prod_{p\le Y}\mathbf e_p(x_p)$ of [[adeles]], so the Fourier transform $\mathcal F_Sf(y)=\int_{\AA_S}f(x)\,\mathbf e_S(xy)\,\dd\nu_S(x)$ is inverted by the same formula with $\mathbf e_S(-xy)$. The multiplicative measure $\mu_S$ on $\AA_S^\times$ is the product of $\dd x/\lvert x\rvert$ on $\RR^\times$ and $\dd^\times x_p$ on each $\QQ_p^\times$, normalized by $\int_{\ZZ_p^\times}\dd^\times x_p=1$ as in [[adeles]]. The two are related by
$$
\dd\mu_S(x)=c_S\,\frac{\dd\nu_S(x)}{\lvert x\rvert_S},\qquad c_S=\prod_{p\le Y}\frac{p}{p-1}.
$$ {#eq-tf-measures}
:::

The relation [[eq-tf-measures]] is the source's (12.4.1.17) [@masullo, p. 518], and it is the place-by-place identity [[eq-ad-mult-measure]] multiplied out. For $Y=8$ the places are $\infty,2,3,5,7$, the $S$-units are $\pm2^{e_2}3^{e_3}5^{e_5}7^{e_7}$, and $c_S=2\cdot\tfrac32\cdot\tfrac54\cdot\tfrac76=4.375$. For $1<Y<2$ there is no prime in $S$, so $\AA_S=\RR$, the $S$-units are $\pm1$, $J_S=\RR^\times/\{\pm1\}\cong\RR_{>0}$, and $c_S=1$.

The functions on which the $S$-local operator acts are $S$-local theta sums. A Schwartz-Bruhat function $f$ on $\AA_S$ is summed over the $S$-units, $\sum_\omega f(\omega x)$, and weighted by $\lvert x\rvert_S^{1/2}$, the $S$-local version of the weighted theta sums $t^{1/2}\Theta_g(t)$ of chapter [[tate-theta]] [@masullo, pp. 16, 514 to 515]. For $f=g\otimes\bigotimes_{p\le Y}\mathbf 1_{\ZZ_p}$ and $x=(t,1,\dots,1)$, only the $S$-units that are integers at every $p\le Y$ survive, so the sum is $\sum_n\bigl(g(nt)+g(-nt)\bigr)$ over the positive integers $n$ with no prime factor above $Y$. This is what the sieve of chapter [[cutting-the-kernel]] leaves of $\Theta_g(t)=\sum_{n\ne0}g(nt)$ after every prime beyond $Y$ has been removed. For $Y<2$ it is the single pair $g(t)+g(-t)$.

## One place first: the trace of a dilation {#s-tf-one-place}

Take $1<Y<2$, so that $S=\{\infty\}$ and the support of $\varphi$ lies in $(1/2,2)$. Then no prime power meets the support, the prime side of everything below is empty, and the $S$-local space is made of even functions on $\RR$: $g(t)+g(-t)$ is all that an $S$-local theta sum can be. The operator is convolution by $\varphi$ acting on $\lvert x\rvert^{1/2}$ times such functions, which after dividing out the weight reads
$$
(A g)(x)=\int_0^\infty\varphi(y)\,y^{-1/2}\,g\Bigl(\frac xy\Bigr)\,\frac{\dd y}{y},
$$ {#eq-tf-one-place-operator}
a superposition of the dilations $(U_yg)(x)=g(x/y)$ with weights $\varphi(y)y^{-1/2}$. A trace of $A$ is therefore a superposition of traces of dilations, and a dilation of the line has a trace that can be computed once the infinite volume of the line is cut off. Cut it off in space, by restricting to $\lvert x\rvert\le R$, and in frequency, by keeping only the Fourier modes with $\lvert\eta\rvert\le R'$. (The source writes $\lambda,\lambda'$ for the two cutoffs; on this page $\lambda$ is the period of the toy circle.)

::: proposition {#t-tf-dilation title="Cut off in space and in frequency, the dilation by $y$ of the line has trace tending to $\lvert y\rvert/\lvert1-y\rvert$, its fixed-point weight" source="connes1999"}
For $y\in\RR^\times$, $y\ne1$, let $T=P_RU_y\hat P_{R'}$, where $\hat P_{R'}g=\mathcal F^{-1}(\mathbf 1_{\lvert\eta\rvert\le R'}\,\mathcal Fg)$ keeps the frequencies up to $R'$ and $P_R$ multiplies by $\mathbf 1_{\lvert x\rvert\le R}$. The kernel $K$ of $T$ is continuous and, with $c=y^{-1}-1$,
$$
\int_\RR K(x,x)\,\dd x=\frac{2}{\pi\lvert c\rvert}\,\mathrm{Si}\bigl(2\pi\lvert c\rvert RR'\bigr)\ \longrightarrow\ \frac1{\lvert c\rvert}=\frac{\lvert y\rvert}{\lvert1-y\rvert}\qquad(RR'\to\infty),
$$ {#eq-tf-dilation-trace}
where $\mathrm{Si}(v)=\int_0^v\sin w\,\dd w/w$ tends to $\pi/2$. For $y=1$ the same integral is $4RR'$.
:::

::: proof
The kernel of $\hat P_{R'}$ is $k(w,v)=\int_{-R'}^{R'}e^{2\pi i(w-v)\eta}\,\dd\eta$, since $\mathcal F^{-1}(\mathbf 1\cdot\mathcal Fg)(w)=\int_{\lvert\eta\rvert\le R'}e^{2\pi iw\eta}\int g(v)e^{-2\pi iv\eta}\,\dd v\,\dd\eta$. Composing with $U_y$ and $P_R$ gives $K(x,v)=\mathbf 1_{\lvert x\rvert\le R}\,k(x/y,v)$, so on the diagonal
$$
\int_\RR K(x,x)\,\dd x=\int_{-R}^{R}\int_{-R'}^{R'}e^{2\pi icx\eta}\,\dd\eta\,\dd x=\int_{-R}^{R}\frac{\sin(2\pi cR'x)}{\pi cx}\,\dd x=\frac{2}{\pi\lvert c\rvert}\,\mathrm{Si}\bigl(2\pi\lvert c\rvert RR'\bigr).
$$
For $y=1$, $c=0$ and the integrand is $1$ on a box of area $4RR'$.
:::

The limit has a geometric meaning, and it is the one Connes emphasized [@connes1999]. The map $x\mapsto x/y$ has one fixed point on the line, $x=0$, and near it the map is linear with derivative $1/y$. The classical fixed-point formula of Atiyah and Bott weights an isolated fixed point by $1/\lvert1-(\text{derivative})\rvert$, which here is $1/\lvert1-y^{-1}\rvert=\lvert y\rvert/\lvert1-y\rvert$. The cutoffs are what make the trace of an operator on an infinite-dimensional space a finite number, and the proposition says that in the limit the answer is the fixed-point weight and nothing else. At $y=1$ every point is fixed, and the trace is the area $4RR'$ of the box in the plane of position and frequency, which grows without bound. This is the only place where the cutoffs leave a trace, and it is multiplied by $\varphi(1)$.

For a number, take $y=\tfrac13$, so $c=2$ and the limit is $\tfrac12$. At $RR'=1$, $10$, and $1000$ the trace [[eq-tf-dilation-trace]] is $0.47497$, $0.49747$, and $0.49997$. For $y=\tfrac23$, where $c=\tfrac12$ and the limit is $2$, the values are $2.35796$, $1.95955$, and $1.99959$, the overshoot at $RR'=1$ being the familiar Gibbs bump of $\mathrm{Si}$.

Now restrict to even functions. The projection onto even functions is $\tfrac12(1+U_{-1})$, and $U_yU_{-1}=U_{-y}$, so the trace of $P_RU_y\hat P_{R'}$ on even functions is the average of [[eq-tf-dilation-trace]] at $y$ and at $-y$. For $y>0$ the second fixed point weight is $1/\lvert1+y^{-1}\rvert=y/(1+y)$. Feeding this into the superposition [[eq-tf-one-place-operator]] and letting $RR'\to\infty$, the trace of $A$ on even functions tends to
$$
\int_0^\infty\varphi(y)\,y^{-1/2}\cdot\frac12\Bigl(\frac{y}{\lvert1-y\rvert}+\frac{y}{1+y}\Bigr)\frac{\dd y}{y}=\frac12\int_0^\infty\varphi(y)\,y^{1/2}\Bigl(\frac1{\lvert1-y\rvert}+\frac1{1+y}\Bigr)\frac{\dd y}{y}.
$$ {#eq-tf-arch-from-trace}
The exchange of the limit and the integral is legitimate because $\lvert\varphi(y)\rvert\le C\lvert1-y\rvert$ near $y=1$ (this is where $\varphi(1)=0$ enters) while the trace at $y$ is at most a constant times $1/\lvert c\rvert$, so the integrand is bounded uniformly in $RR'$. The right side of [[eq-tf-arch-from-trace]] is the archimedean term of Weil's explicit formula, with its factor $\tfrac12$ and its companion term $1/(1+y)$. Both come from the evenness: $\tfrac12$ is the averaging over $\pm1$, and $1/(1+y)$ is the fixed point of the dilation composed with the reflection $x\mapsto-x$.

One more step turns this into a trace formula. The functions that build theta sums satisfy two linear conditions, $g(0)=0$ and $\int_\RR g=0$ (chapter [[tate-theta]]), so the operator that the kernel $k_S$ represents acts on a subspace of codimension two, and its trace is the trace on all even functions minus the trace on the two-dimensional piece that the conditions remove. That piece is spanned by the two functionals $g\mapsto g(0)$ and $g\mapsto\int g$, and $A$ multiplies each by a number,
$$
(Ag)(0)=\int_0^\infty\varphi(y)y^{-1/2}\,\frac{\dd y}{y}\;g(0)=M\varphi(-\tfrac12)\,g(0),\qquad\int_\RR Ag=\int_0^\infty\varphi(y)y^{1/2}\,\frac{\dd y}{y}\int_\RR g=M\varphi(\tfrac12)\int_\RR g.
$$
So the trace on the subspace is [[eq-tf-arch-from-trace]] minus $M\varphi(\tfrac12)+M\varphi(-\tfrac12)$. This is exactly how the source's proof of the Trace Formula uses the $S$-local computation: the diagonal mass of $k_S$ is the left side of (12.5.1.1) with the two pole terms subtracted [@masullo, p. 520]. The identification of the two pole terms with the functionals $g(0)$ and $\int g$ is our gloss on that line. Combined with [[eq-tf-reduction]] it gives, for every $\varphi$ supported in $(1,2)$, and then by the extension in Step 6 of the proof of [[t-tf-trace-formula]] for every $\varphi$ supported in $(\tfrac12,2)$ with $\varphi(1)=0$,
$$
\frac12\int_0^\infty\varphi(t)\,t^{1/2}\Bigl(\frac1{\lvert1-t\rvert}+\frac1{1+t}\Bigr)\frac{\dd t}{t}=M\varphi(\tfrac12)+M\varphi(-\tfrac12)-\sum_{\lvert\beta-1/2\rvert<a}m_\rho\,M\varphi\bigl(\rho-\tfrac12\bigr),
$$ {#eq-tf-one-place-formula}
the Trace Formula for test functions too short to reach any prime. Section [[s-tf-numbers]] checks it with numbers.

::::: figure {#f-tf-dilation viz="tf-dilation-trace" height="420"}
Cut off in space and in frequency, the trace of a dilation of the line converges to the weight of its single fixed point, $\lvert y\rvert/\lvert1-y\rvert$, everywhere except at $y=1$, where every point is fixed and the trace grows like the area of the cutoff box.

```vizspec
Purpose: show the trace of a cut-off dilation converging to the fixed-point weight |y|/|1-y|, and the
  blow-up at y = 1 that phi(1) = 0 removes.
Scene: two panels side by side (stacked at phone width).
  Left panel: the plane of position x (horizontal, [-R, R]) and frequency eta (vertical, [-R', R']) as a muted
  rectangle. Inside it, a heat map of cos(2 pi c x eta) with c = 1/y - 1, colored teal for positive and red
  for negative, pale. Its integral over the rectangle is the trace.
  Right panel: horizontal axis y in [0.05, 4] on a log scale, vertical axis [0, 6]. Draw the limit curve
  y/|1-y| for y > 0 in blue, and the finite trace (2/(pi |c|)) Si(2 pi |c| Lambda) with Lambda = R R' in gold,
  where Si(v) = integral_0^v sin(w)/w dw. Mark y = 1 with a vertical violet line. Draw a draggable gold dot at
  the current y on the gold curve with a readout "trace = ..., limit = ...". Optionally (toggle "even
  functions") replace both curves by their averages with the reflected dilation: limit
  (1/2)(y/|1-y| + y/(1+y)), finite trace (1/2)(T(c) + T(c')) with c' = -1/y - 1.
Controls: slider Lambda = R R' from 0.3 to 300 (log scale, default 3); drag the dot along y; toggle "even
  functions".
Motion: as Lambda grows the gold curve settles onto the blue one away from y = 1 while its peak at y = 1 rises
  like 4 Lambda; the heat map's fringes tighten.
Reader takeaway: the trace of a dilation is a fixed-point count, finite except at y = 1, and a test function
  vanishing at 1 never feels the divergence.
Data: none beyond the formulas.
```
:::::

## All the places of S: Connes's computation {#s-tf-connes}

With primes in $S$ the same idea works with $\AA_S$ in place of $\RR$, and the source carries it out in the form Connes gave it [@masullo, Theorem 12.4.1.1, pp. 514 to 519] [@connes1999]. Two things change. The dilation by an $S$-idele $y$ acts on all coordinates at once, so a fixed point must be found in a product, and the space of $S$-local theta sums is a quotient by the $S$-units, so the dilations by $y$ and by $\omega y$ for an $S$-unit $\omega$ are the same operator. Connes's geometric picture of the answer is that the fixed points of this action on $\AA_S$ modulo $S$-units are the classes with exactly one vanishing coordinate, one family for each place $v\in S$, and that each family contributes the fixed-point weight of its place integrated against $\varphi$ [@connes1999]. These are the periodic orbits of length $\log p$ and the fixed point at infinity that chapter [[primes-as-circles]] met as the supports of dual basis vectors. The source's proof does not count fixed points, though. It turns the trace into a volume.

::::: card {#t-tf-s-local kind="theorem" title="The $S$-local diagonal mass is the sum over the places of $S$ of Weil's local principal values, plus $\varphi(1)$ times the logarithm of the cutoffs" source="connes1999"}
:::: statement
Let $\varphi$ be smooth with compact support in $\RR_{>0}$, viewed as a function on $J_S$ through the norm, and let $k^{\mathrm{PW}}_{S,\varphi,R,R'}$ be the kernel of the $S$-local operator truncated in space at $\lvert x\rvert_S\le R$ and in $S$-adelic frequency at $R'$. With the measures of [[d-tf-measures]], and as $R,R'\to\infty$,
$$
\int_{J_S}k^{\mathrm{PW}}_{S,\varphi,R,R'}(x,x)\,\dd\mu_S(x)=\frac12\int'_{\RR^\times}\frac{\varphi(y)\lvert y\rvert^{1/2}}{\lvert1-y\rvert}\frac{\dd y}{\lvert y\rvert}+\sum_{p\le Y}\log p\int'_{\QQ_p^\times}\frac{\varphi(y)\lvert y\rvert_p^{1/2}}{\lvert1-y\rvert_p}\,\dd^\times y+\varphi(1)\log(RR')+o(1).
$$ {#eq-tf-s-local}
Here $\varphi(y)$ for $y\in\QQ_v^\times$ means $\varphi$ at the norm of $y$, and $\int'$ is Weil's principal value, which for $\varphi(1)=0$ is the ordinary absolutely convergent integral.
::::
:::: plain
Once the operator is cut off in space and in frequency, its trace is a sum of one integral for each place of $S$, plus a term that grows with the cutoffs. That growing term is multiplied by $\varphi(1)$, so it disappears for the test functions of this route.
::::
:::: why
This is the whole content of the left side of [[eq-tf-reduction]]. The sieve reduced the infinitely many primes to the finitely many in $S$, and this theorem evaluates what is left as Weil's local terms, which is what makes the geometric side of the new formula identical to the prime side of the old one.
::::
:::: idea
Write the trace as an integral over the diagonal with respect to the additive measure, apply Parseval for the $S$-adelic Fourier transform, and change variables $w=xu$ in the product of position and frequency. The integral over $x$ becomes the multiplicative volume of the annulus $\{\lvert w\rvert_S/R'\le\lvert x\rvert_S\le R\}$ in $J_S$, which is $\log(RR')-\log\lvert w\rvert_S$. The constant $\log(RR')$ produces the $\varphi(1)$ term. The logarithm $\log\lvert w\rvert_S=\sum_{v\in S}\log\lvert w_v\rvert_v$ splits into places, and the Fourier transform of $\log\lvert\cdot\rvert_v$ is the distribution that defines Weil's principal value at $v$.
::::
:::: sketch {source="masullo" loc="Theorem 12.4.1.1, pp. 514 to 519"}
*Lift.* Choose $\tilde\varphi$ smooth with compact support on $\AA_S^\times$ with $\sum_\omega\tilde\varphi(\omega y)=\varphi(y)$, the sum over $S$-units, which exists because the $S$-units are discrete ((12.4.1.4), p. 515). The operator to trace is $f\mapsto\int\tilde\varphi(y)\lvert y\rvert_S^{-1/2}f(y^{-1}x)\,\dd\mu_S(y)$ on Schwartz-Bruhat functions $f$ on $\AA_S$, the $S$-local form of [[eq-tf-one-place-operator]], with Schwartz kernel $\int\lvert y\rvert_S^{-1/2}\tilde\varphi(y)\,\delta(v-y^{-1}x)\,\dd\mu_S(y)$ ((12.4.1.5) to (12.4.1.7), p. 516).

*Truncate.* Multiply by a smoothed $\mathbf 1_{\lvert x\rvert_S\le R}$ on the left and by the Fourier cutoff $\mathcal F_S^{-1}\mathbf 1_{\lvert\eta\rvert_S\le R'}\mathcal F_S$ on the right, whose kernel is a convolution kernel ((12.4.1.8) to (12.4.1.10), p. 517).

*Parseval.* Integrate the kernel along the diagonal, shifted by each $S$-unit, with respect to $\nu_S$, and apply Parseval in the second variable. After the substitution $y\omega-1=z$ and the relation [[eq-tf-measures]] the inner integral becomes $c_S\,\hat\eta_\omega(xu)$ for an explicit compactly supported $\eta_\omega$ built from $\lvert y\rvert_S^{1/2}\tilde\varphi(y^{-1})$ ((12.4.1.11) to (12.4.1.21), pp. 517 to 518).

*Volume.* The remaining double integral over $\lvert x\rvert_S\le R$ and $\lvert u\rvert_S\le R'$ is rewritten with $w=xu$. The product $\dd\nu_S(x)\,\dd\nu_S(u)$ becomes $\dd\nu_S(x)/\lvert x\rvert_S\otimes\dd\nu_S(w)$, and $c_S\,\dd\nu_S(x)/\lvert x\rvert_S=\dd\mu_S(x)$, so the $x$-integral is the multiplicative volume of an annulus, $\log(RR')-\log\lvert w\rvert_S$ ((12.4.1.22) to (12.4.1.24), p. 518).

*Connes's lemma.* Summing over $S$-units, the $\log(RR')$ part gives $\varphi(1)\log(RR')$, and the $\log\lvert w\rvert_S$ part gives Weil's principal value at each place, by Connes's computation together with the source's Lemmas B.4.4.3, B.4.4.5, and B.4.3.2 on the Fourier transform of $\log\lvert\cdot\rvert_v$. The result has $\varphi(y^{-1})$, and the local terms are unchanged under $y\mapsto y^{-1}$, which gives [[eq-tf-s-local]] with $\varphi(y)$ (p. 519) [@connes1999].
::::
:::: used
- [[t-tf-trace-formula]], which adds the pole terms and combines with [[eq-tf-reduction]].
- Section [[s-tf-half]], which reads the weight $\tfrac12$ off the volume step.
::::
:::::

The truncations in the statement are the source's Paley-Wiener levels, subspaces cut out by a support condition on Fourier transforms on which multiplication by $\lvert x\rvert^{a}$ is continuous. Over $\QQ$ they can be read as the two cutoffs of [[t-tf-dilation]], and we do not need more about them [@masullo, p. 51]. The normalization factor $1/\mu_{S,1}(J_S^1)$ of the source's statement is $1$ here, because the compact part $\prod_{p\le Y}\ZZ_p^\times$ of $J_S$ has volume $1$ in our measure.

## Why the weight is one half {#s-tf-half}

The theta sums of chapter [[tate-theta]] were weighted by $t^{1/2}$ before the strip topology was applied, and chapter [[strip-topology]] measured the strip from the line $\Re z=0$, that is from $\Re s=\tfrac12$. The source carries the exponent of the weight as a parameter $w>0$ through the earlier steps, with the zeros then sitting at $z=\rho-w$ and the strip centered on $\Re s=w$, and it locates the one step that needs $w=\tfrac12$ in the $S$-local computation, explaining it in a sentence about measures [@masullo, pp. 16, 52].

The step is the volume step of [[t-tf-s-local]]. The trace that Parseval computes is an integral along the diagonal against the additive measure $\nu_S$, because Fourier analysis on $\AA_S$ lives on the additive group. The diagonal mass that [[eq-tf-reduction]] needs is an integral against the multiplicative measure $\mu_S$, because the kernel $k_S$ lives on the idele class group. In the source's words, the product $\lvert x\rvert_S^{w}\lvert y\rvert_S^{w}$ that appears in the kernel becomes $\lvert x\rvert_S^{2w}$ on the diagonal, and $\lvert x\rvert_S^{2w}\,\dd\mu_S$ is a multiple of $\dd\nu_S$ exactly when $2w=1$, by [[eq-tf-measures]]. Only then does the additive trace equal the multiplicative diagonal mass, and only then does the $x$-integral in the volume step become the volume of an annulus. The source draws the conclusion in one line: "This forces the 1/2 in the very statement of GRH" [@masullo, p. 16]. It adds that Connes had expected the $S$-adelic Fourier transform to play exactly this role.

On $\RR$ the statement is an identity anyone can check. The map $g\mapsto\lvert x\rvert^{w}g$ sends functions on the line to functions on $\RR^\times$, and
$$
\int_{\RR^\times}\bigl\lvert\,\lvert x\rvert^{w}g(x)\bigr\rvert^2\,\frac{\dd x}{\lvert x\rvert}=\int_\RR\lvert g(x)\rvert^2\,\lvert x\rvert^{2w-1}\,\dd x,
$$ {#eq-tf-unitary}
which equals $\int\lvert g\rvert^2\,\dd x$ for every $g$ exactly when $w=\tfrac12$. So $g\mapsto\lvert x\rvert^{1/2}g$ is the unique power weight that is a unitary map from $L^2(\RR,\dd x)$, where the Fourier transform is unitary by Plancherel, to $L^2(\RR^\times,\dd x/\lvert x\rvert)$, where dilations act. The same identity at a prime holds up to the constant $p/(p-1)$. It is the same fact that chapter [[weil-positivity]] recorded as the reason the critical line is special for the Mellin transform: square integrability against $\dd x$ is measured on $\Re s=\tfrac12$ and nowhere else.

The weight is also visible in the answer. The local factor of [[eq-tf-s-local]] is $\lvert y\rvert^{1/2}/\lvert1-y\rvert$, and under $y\mapsto y^{-1}$ it becomes $\lvert y\rvert^{-1/2}/\lvert1-y^{-1}\rvert=\lvert y\rvert^{1/2}/\lvert1-y\rvert$ again. The last line of the source's proof uses exactly this invariance to replace $\varphi(y^{-1})$ by $\varphi(y)$ [@masullo, p. 519]. With the weight $\lvert y\rvert^{-w}$ in the operator, the fixed-point weight of [[t-tf-dilation]] would give $\lvert y\rvert^{1-w}/\lvert1-y\rvert$, whose image under inversion is $\lvert y\rvert^{w}/\lvert1-y\rvert$, and the two agree only at $w=\tfrac12$. The symmetry $y\leftrightarrow y^{-1}$ of the local terms is the symmetry $z\leftrightarrow-z$ of the functional equation, seen at one place.

::: aside
A consistency check that is ours. Suppose a version of the Trace Formula held with the weight $w$ in place of $\tfrac12$. Its zero side would run over the zeros with $\lvert\beta-w\rvert<a$, and the argument of chapter [[trace-to-grh]] would show that every zero has $\beta\le w$, and with the functional equation $\beta\ge1-w$. For $w<\tfrac12$ these two bounds contradict each other, while the zero $\tfrac12+14.1347\,i$ exists, so no such formula can hold. For $w>\tfrac12$ the bounds say only that the zeros lie in $1-w\le\beta\le w$, a zero-free region that is weaker than the hypothesis and, for $w\ge1$, already known. The weight $\tfrac12$ is the only one at which the method can give the hypothesis, and the $S$-local computation is the step that selects it.
:::

::::: figure {#f-tf-weight viz="tf-weight" height="400"}
Only the weight one half makes the multiplicative and additive measures agree and makes the local factor symmetric under $t\mapsto1/t$.

```vizspec
Purpose: show that the weight w = 1/2 is singled out twice: the density |x|^(2w-1) relating weighted
  multiplicative to additive measure is flat, and the local factor t^(1-w)/|1-t| equals its mirror image
  under t -> 1/t.
Scene: two panels.
  Top panel: horizontal axis x in (0, 4], vertical axis [0, 3]. Draw the density x^(2w-1) in gold and the
  constant 1 (the additive measure) as a dashed blue line. Shade the region between them in pale red.
  Bottom panel: horizontal axis log t in [-2.5, 2.5] (labels at t = 1/10, 1/3, 1, 3, 10), vertical axis [0, 4].
  Draw the local factor F(t) = t^(1-w)/|1-t| in gold and its mirror F(1/t) = t^(w-1)/|1-1/t| in teal. Mark
  t = 1 with a violet vertical line (the singularity). Shade the difference between the two curves in pale red.
Controls: slider w from 0 to 1 (default 0.3, step 0.01), with a snap point at 0.5 that shows the label
  "w = 1/2".
Motion: as w moves to 1/2 the gold density flattens onto the blue line and the gold and teal curves in the
  bottom panel merge; both red shadings vanish at w = 1/2 and reappear on either side.
Reader takeaway: one half is the unique weight at which the additive Fourier analysis and the multiplicative
  trace agree.
Data: none beyond the formulas.
```
:::::

## The local terms by hand {#s-tf-local}

With $\varphi(1)=0$ every term of [[eq-tf-s-local]] is an ordinary integral, and each can be computed for a function of the norm.

::: lemma {#t-tf-local-prime title="At a prime $p$, the local term is $\log p\sum_{m\ge1}p^{-m/2}\bigl(\varphi(p^m)+\varphi(p^{-m})\bigr)$" source="masullo" loc="Lemma B.4.4.3, p. 620; §1.4.1, p. 28"}
For $\varphi$ smooth with compact support in $\RR_{>0}$ and $\varphi(1)=0$,
$$
\log p\int_{\QQ_p^\times}\frac{\varphi(\lvert y\rvert_p)\,\lvert y\rvert_p^{1/2}}{\lvert1-y\rvert_p}\,\dd^\times y=\log p\sum_{m\ge1}p^{-m/2}\bigl(\varphi(p^m)+\varphi(p^{-m})\bigr).
$$ {#eq-tf-local-prime}
:::

::: proof
Split $\QQ_p^\times$ into the shells $p^m\ZZ_p^\times$ of [[eq-ad-shells]], each of multiplicative volume $1$. On the unit shell $m=0$ the norm is $1$, so the integrand is $\varphi(1)\cdot\lvert1-y\rvert_p^{-1}=0$ there, and the singularity of $1/\lvert1-y\rvert_p$ at $y=1$ never matters. This is the reason the principal value reduces to an ordinary integral, which the source states as Lemma B.4.4.3. On a shell with $m\ge1$ the element $y$ lies in $p\ZZ_p$, so $1-y$ is a unit and $\lvert1-y\rvert_p=1$, while $\lvert y\rvert_p=p^{-m}$. The integrand is the constant $\varphi(p^{-m})p^{-m/2}$. On a shell with $m=-k\le-1$, $\lvert y\rvert_p=p^{k}$ and the ultrametric inequality gives $\lvert1-y\rvert_p=\lvert y\rvert_p=p^{k}$, so the integrand is the constant $\varphi(p^{k})p^{k/2}p^{-k}=\varphi(p^{k})p^{-k/2}$. Summing the shells gives [[eq-tf-local-prime]]. Only finitely many terms are nonzero, those with $p^m<Y$.
:::

Summed over the primes, the local terms are the familiar prime sum,
$$
\sum_p\log p\sum_{m\ge1}p^{-m/2}\bigl(\varphi(p^m)+\varphi(p^{-m})\bigr)=\sum_{n\ge2}\frac{\Lambda(n)}{\sqrt n}\bigl(\varphi(n)+\varphi(1/n)\bigr),
$$ {#eq-tf-prime-side}
because $\Lambda(p^m)=\log p$. The primes $p>Y$ contribute nothing to it, which is the same vanishing that killed the orbital slices of chapter [[cutting-the-kernel]], now seen in the formula. The factor $\log p$ in front is the length of the circle of chapter [[primes-as-circles]]: in the source's general statement it appears as $\log q_v/\mu_v(\mathcal O_v^\times)$, the ratio that turns any Haar measure into the canonical measure on $\QQ_p^\times$, in which the annulus $1\le\lvert x\rvert<T$ has volume $\log T+O(1)$ [@masullo, Remark B.4.4.2, p. 620].

At the real place the integral is over $\RR^\times$ with $\dd y/\lvert y\rvert$. For a function of the norm the negative half-line contributes $\varphi(t)t^{1/2}/(1+t)$ at $y=-t$, so
$$
\frac12\int_{\RR^\times}\frac{\varphi(\lvert y\rvert)\lvert y\rvert^{1/2}}{\lvert1-y\rvert}\frac{\dd y}{\lvert y\rvert}=\frac12\int_0^\infty\varphi(t)\,t^{1/2}\Bigl(\frac1{\lvert1-t\rvert}+\frac1{1+t}\Bigr)\frac{\dd t}{t},
$$ {#eq-tf-arch}
the term already found in [[eq-tf-arch-from-trace]]. The constants need care, because the source states them for a general number field with its own measures, and because Weil's principal value at infinity carries constants $\log2\pi+\gamma_{\mathrm E}$ when $\varphi(1)\ne0$. We checked three things. The source's Theorem B.4.4.7 has the real place with coefficient $1/M_v=\tfrac12$ and the measure $\mu_v=\dd y/\lvert y\rvert$, whose canonical normalization is $\mu_v/2$ [@masullo, Remark B.4.4.2, p. 620, and Theorem B.4.4.7, p. 623], which matches the $\tfrac12$ of the Trace Formula. Weil's principal value at the real place is defined through the Fourier transform of $\log\lvert x\rvert$, and its constant terms all multiply $f(0)$, where $f(x)=\varphi(1+x)\lvert1+x\rvert^{-1/2}$, so $f(0)=\varphi(1)=0$ removes them and leaves the integral [[eq-tf-arch]] [@masullo, (B.4.3.13), p. 619, and (B.4.4.2), p. 620]. Finally, numerically, [[eq-tf-arch]] agrees with the Gamma-function form of the archimedean term,
$$
\frac12\int_0^\infty\varphi(t)\,t^{1/2}\Bigl(\frac1{\lvert1-t\rvert}+\frac1{1+t}\Bigr)\frac{\dd t}{t}=-\frac1{2\pi}\int_{-\infty}^{\infty}M\varphi(ir)\,\Re\frac{\Gamma'}{\Gamma}\Bigl(\frac14+\frac{ir}2\Bigr)\dd r\qquad(\varphi(1)=0,\ \varphi\text{ real}),
$$ {#eq-tf-arch-gamma}
to ten digits for both test functions of section [[s-tf-numbers]]: $0.4404763838$ on both sides for the first, and $0.0412165516$ for the second.

::::: figure {#f-tf-shells viz="tf-padic-shells" height="420"}
At a prime $p$ the local term reads the test function only on the shells $p^m\ZZ_p^\times$ with $m\ne0$, where the factor $\lvert y\rvert_p^{1/2}/\lvert1-y\rvert_p$ is the constant $p^{-\lvert m\rvert/2}$.

```vizspec
Purpose: make the hand computation of the p-adic local term visible, shell by shell.
Scene: left, a set of concentric rings (the shells p^m Z_p^x for m = -4..4, drawn as rings with radius
  increasing with -m so that larger |y|_p is outside; the unit shell m = 0 in violet). Each ring is labeled
  by |y|_p = p^(-m). Right, a bar chart with one bar per m in -4..4: bar height p^(-|m|/2) in blue (the local
  factor on that shell), and next to it a gold bar phi(p^(-m)) times p^(-|m|/2) (the contribution). The bar
  at m = 0 is drawn as an empty violet box labeled "phi(1) = 0". Below, a readout of the total
  log p * sum of the gold bars, and of log p * sum_{m>=1} p^(-m/2) (phi(p^m) + phi(p^-m)) computed directly,
  which must agree.
  Under both, a strip showing log t in [-2.5, 2.5] with the test function phi(t) = u(1+u) bump(u/L), u = log t,
  bump(x) = exp(-1/(1-x^2)) on |x| < 1, in gold, and tick marks at t = p^m.
Controls: selector p in {2, 3, 5, 7, 11}; slider L (half-width of the support in log t) from 0.3 to 2.5;
  hovering a ring highlights its bar and its tick mark.
Motion: as L shrinks below log p the ticks leave the support and every gold bar drops to zero.
Reader takeaway: the p-adic local term is a finite sum over the powers of p inside the support, each weighted
  by p^(-|m|/2), and nothing happens on the unit shell.
Data: none beyond the formulas.
```
:::::

## The Trace Formula over Q {#s-tf-statement}

Everything is now in place, and the main result of Part III over $\QQ$ follows by adding up.

::::: card {#t-tf-trace-formula kind="theorem" title="For every test function vanishing at $1$ and every strip half-width $a>0$, Weil's prime sum plus the archimedean term equals the two pole terms minus the zeros in the strip" source="masullo" loc="Theorem 12.5.1.1, p. 519; §1.4.1, p. 28"}
:::: statement
Let $\varphi$ be smooth with compact support in $\RR_{>0}$ and $\varphi(1)=0$, and let $a>0$. Then
$$
\frac12\int_0^\infty\varphi(t)\,t^{1/2}\Bigl(\frac1{\lvert1-t\rvert}+\frac1{1+t}\Bigr)\frac{\dd t}{t}+\sum_{n\ge2}\frac{\Lambda(n)}{\sqrt n}\bigl(\varphi(n)+\varphi(1/n)\bigr)=M\varphi(\tfrac12)+M\varphi(-\tfrac12)-\sum_{\lvert\beta-1/2\rvert<a}m_\rho\,M\varphi\bigl(\rho-\tfrac12\bigr),
$$ {#eq-tf-trace-formula}
where the last sum runs over the nontrivial zeros $\rho=\beta+i\gamma$ of $\zeta$ in the open strip, counted with multiplicity, and converges absolutely.
::::
:::: plain
Weigh the prime powers and their reciprocals by a test function that vanishes at 1, add a smooth term that comes from the real numbers, and you get two simple numbers from the pole of zeta, minus one number for each zero that lies close to the critical line. How close is up to you: the formula holds for every width of the strip, and the zeros outside it simply do not appear.
::::
:::: why
The left side is the prime side of Weil's explicit formula, the side that knows every zero, because the explicit formula holds with all zeros on its right. The right side knows only the zeros in the strip. Chapter [[trace-to-grh]] turns this mismatch into the hypothesis.
::::
:::: idea
Compute one diagonal mass two ways inside the coarse space $W_a$. Spectrally it is minus the zeros in the strip (chapter [[strip-topology]]). Geometrically, the sieve leaves only the places of $S$ (chapter [[cutting-the-kernel]]), the $S$-local trace is a sum of fixed-point weights computed by Fourier analysis on $\AA_S$ ([[t-tf-s-local]]), and two linear conditions on theta sums subtract the pole terms.
::::
:::: proof
Suppose first that $\operatorname{supp}\varphi\subset(1,Y)$, and put $S=\{\infty\}\cup\{p\le Y\}$. Step 6 removes this assumption.

*Step 1, reduction.* By chapter [[cutting-the-kernel]], the geometric kernel is $k_S+\sum_{p>Y}k_p$ with $\int k_p(x,x)\,\dd x/x=0$ for every $p>Y$ ([[t-ck-slices-vanish]]), and the geometric diagonal mass is minus the spectral trace of chapter [[strip-topology]] ([[t-ck-proto]]). This is [[eq-tf-reduction]] [@masullo, proof of Theorem 12.5.1.1, p. 520, using Theorems 11.3.2.1 and 10.4.2.8].

*Step 2, the $S$-local trace.* By [[t-tf-s-local]] with $\varphi(1)=0$, the cutoff term vanishes and the $S$-local trace on all Schwartz-Bruhat functions tends to the sum of the local terms at the places of $S$.

*Step 3, the pole terms.* The theta sums are built from functions with the two conditions $f(0)=0$ and $\hat f(0)=0$, which over $\QQ$ are $g(0)=0$ and $\int g=0$. The source's proof records that the diagonal mass of $k_S$ is the sum of the local terms minus $M\varphi(\tfrac12)+M\varphi(-\tfrac12)$ (p. 520). In our gloss of section [[s-tf-one-place]], these are the eigenvalues of the operator on the two functionals the conditions remove.

*Step 4, local terms.* By [[t-tf-local-prime]] and [[eq-tf-prime-side]] the finite places give the prime sum, and by [[eq-tf-arch]] the real place gives the archimedean term. Primes $p>Y$ add zeros to the prime sum, so it may be written over all $n\ge2$.

*Step 5, assembly.* Steps 2 to 4 say that the left side of [[eq-tf-reduction]] is the left side of [[eq-tf-trace-formula]] minus the two pole terms. Setting this equal to minus the strip sum and moving the pole terms across gives [[eq-tf-trace-formula]].

*Step 6, the support.* The source performs the trace calculation for $\varphi$ supported in $[1+\varepsilon,\infty)$, extends it to $\varphi$ supported in $(0,1-\varepsilon]$, and then to every $\varphi$ with $\varphi(1)=0$ by continuity [@masullo, §1.4.6, p. 30]. Over $\QQ$ both extensions can be checked directly, and the following is our account of them. Put $\varphi^\vee(t)=\varphi(1/t)$. The archimedean term and the prime sum of [[eq-tf-trace-formula]] do not change when $\varphi$ is replaced by $\varphi^\vee$, the two pole terms trade places because $M\varphi^\vee(z)=M\varphi(-z)$, and the zero sum is unchanged because $M\varphi^\vee(\rho-\tfrac12)=M\varphi\bigl((1-\rho)-\tfrac12\bigr)$ and $\rho\mapsto1-\rho$ permutes the zeros in the strip with their multiplicities (chapter [[zeta-continued]]). So the formula for $\varphi$ supported in $(0,1)$ follows from the formula for $\varphi^\vee$. For a general $\varphi$ with $\varphi(1)=0$, let $\psi_\varepsilon(t)=\psi(\log t/\varepsilon)$ with $\psi$ smooth, equal to $1$ near $0$, and supported in $(-1,1)$. Then $\varphi(1-\psi_\varepsilon)$ is a sum of a function supported in $(1,\infty)$ and one supported in $(0,1)$, and every term of the formula for $\varphi\psi_\varepsilon$ tends to $0$ as $\varepsilon\to0$: no prime power lies in its support once $\varepsilon<\log2$, the archimedean term is at most a constant times $\varepsilon$ because $\lvert\varphi(t)\rvert\le C\lvert\log t\rvert$ near $1$, the pole terms are $O(\varepsilon^2)$, and in $u=\log t$ two integrations by parts give $\lvert M(\varphi\psi_\varepsilon)(\rho-\tfrac12)\rvert\le C\min(\varepsilon^2,\lvert\gamma\rvert^{-2})$, whose sum over the zeros is $O(\varepsilon\log(1/\varepsilon))$ by the count of chapter [[zeros]]. Absolute convergence of the strip sum is the source's Lemma B.4.4.9 (p. 624); over $\QQ$ it follows from $\lvert M\varphi(\rho-\tfrac12)\rvert\le C_k(1+\lvert\gamma\rvert)^{-k}$ (integration by parts in $u=\log t$, uniformly for $\lvert\beta-\tfrac12\rvert\le\tfrac12$) and the count $N(T)=O(T\log T)$ of chapter [[zeros]].
::::
:::: example
For $Y=8$ and $\varphi(e^u)=u(1+u)\operatorname{bump}(u/\log8)$ with $\operatorname{bump}(x)=e^{-1/(1-x^2)}$ on $\lvert x\rvert<1$, the prime powers in the support are $2,3,4,5,7$, the left side is $0.4404763838+1.0652276403=1.5057040241$, the pole terms are $1.0852426053+0.4149972171=1.5002398224$, and the zero sum is $-0.0054642016$, so the right side is $1.5057040241$. Section [[s-tf-numbers]] gives the details and says what this check does and does not show.
::::
:::: used
- [[trace-to-grh]]: the endgame feeds a holomorphic family of test functions into [[eq-tf-trace-formula]], and the shorter route subtracts it from Weil's formula.
- Section [[s-tf-weil]]: the side-by-side comparison with chapter [[weil-positivity]].
::::
:::::

There is no Lean block here: the formalization behind this page belongs to the other route, and the source of this route is the monograph alone.

## The general statement {#s-tf-general-statement}

The source states the Trace Formula for every number field and every test function on the idele class group, all characters at once.

::: theorem {#t-tf-general title="Trace Formula on the idele class group of a number field" source="masullo" loc="Theorem 12.5.1.1, p. 519"}
Let $F$ be a number field and $\varphi$ a smooth compactly supported function on the idele class group $C_F$ with $\varphi(C_F^1)=0$. Then
$$
\begin{aligned}
&\sum_{v\ \mathrm{real}}\frac12\int'_{F_v^\times}\frac{\varphi(y)\lvert y\rvert_v^{1/2}}{\lvert1-y\rvert_v}\,\dd\mu_v(y)+\sum_{v\ \mathrm{complex}}\frac1{2\pi}\int'_{F_v^\times}\frac{\varphi(y)\lvert y\rvert_v^{1/2}}{\lvert1-y\rvert_v}\,\dd\mu_v(y)+\sum_{v\ \mathrm{finite}}\frac{\log q_v}{\mu_v(\mathcal O_v^\times)}\int'_{F_v^\times}\frac{\varphi(y)\lvert y\rvert_v^{1/2}}{\lvert1-y\rvert_v}\,\dd\mu_v(y)\\
&\qquad=M\varphi(\lvert\cdot\rvert^{1/2})+M\varphi(\lvert\cdot\rvert^{-1/2})-\sum_{c}m_c\,M\varphi(c\,\lvert\cdot\rvert^{-1/2}),
\end{aligned}
$$
where $M\varphi(c)=\int_{C_F}\varphi\,c\,\dd\bar\mu$ for a quasi-character $c$ of $C_F$, and the last sum runs over the zeros $c$ of the Hecke $L$-functions of $F$ in the interior of the strip $\Re c\in\tfrac12+[-a,a]$, with multiplicity $m_c$.
:::

The dictionary to [[eq-tf-trace-formula]] is short. Over $\QQ$ there is one real place and no complex place, the finite places are the primes with $q_v=p$, and with $\mu_p(\ZZ_p^\times)=1$ the finite term is [[eq-tf-local-prime]]. A test function on $C_\QQ\cong\RR_{>0}\times\hat\ZZ^\times$ that is invariant under $\hat\ZZ^\times$ is a function of $t=\lvert y\rvert$, the condition $\varphi(C_\QQ^1)=0$ is $\varphi(1)=0$, and only the trivial character of $\hat\ZZ^\times$ has nonzero Mellin transform against it, so the zeros $c$ are $\lvert\cdot\rvert^{\rho}$ for the zeros $\rho$ of $\zeta$ and $M\varphi(c\lvert\cdot\rvert^{-1/2})=M\varphi(\rho-\tfrac12)$ once $\hat\ZZ^\times$ has volume $1$. The source writes $N(c)$ for the multiplicity and $g_v$ for the variable, and states the strip as $\sigma(c)\in\tfrac12+I$ with $I=[-\alpha,\alpha]$ in Chapter 12 and $[-a,a]$ in Chapter 1 [@masullo, pp. 28, 519]. Test functions that transform by a character $\bar\chi$ of $C_F^1$ pick out the zeros of $L(s,\chi)$, and the finite term becomes $\log q_v\sum_{m\ge1}q_v^{-m/2}\bigl(\chi(\pi_v^m)\varphi(q_v^m)+\bar\chi(\pi_v^m)\varphi(q_v^{-m})\bigr)$ [@masullo, §1.4.1, p. 28], which is the form used in chapter [[trace-to-grh]] for general $L$-functions.

## Both sides in numbers {#s-tf-numbers}

A formula of this kind can be tested, and the test shows something real, but less than the theorem. Take the bump $\operatorname{bump}(x)=e^{-1/(1-x^2)}$ for $\lvert x\rvert<1$ and $0$ otherwise, as in chapter [[tate-theta]], and $\varphi(t)=u(1+u)\operatorname{bump}(u/\log Y)$ with $u=\log t$. This is smooth, supported in $(1/Y,Y)$, vanishes at $t=1$, and is not symmetric under $t\mapsto1/t$, so both $\varphi(n)$ and $\varphi(1/n)$ enter. We computed every term of [[eq-tf-trace-formula]] for $Y=8$ and for $Y=2$: the integrals by Gauss-Legendre quadrature with the interval split at $t=1$, and the zero sum from the first 1,500 zeros of $\zeta$, whose ordinates were computed with mpmath and checked against `zetazero` at five indices.

For $Y=8$ the prime terms are, at $n=2,3,4,5,7$,
$$
0.1529009,\quad0.3824281,\quad0.2201944,\quad0.3079172,\quad0.0017869,
$$
from the values $\varphi(2)=0.3810122$ and $\varphi(\tfrac12)=-0.0690517$, $\varphi(3)=0.5758691$ and $\varphi(\tfrac13)=0.0270597$, and so on. Their sum is $1.0652276403$, the archimedean term [[eq-tf-arch]] is $0.4404763838$, and the left side is $1.5057040241$. On the right, $M\varphi(\tfrac12)=1.0852426053$ and $M\varphi(-\tfrac12)=0.4149972171$. The zero sum, with each pair $\pm\gamma$ contributing $2\Re M\varphi(i\gamma)$, settles quickly:

| zeros used | zero sum | left side minus right side |
| --- | --- | --- |
| 1 pair | $-0.0062873666$ | $-8.2\times10^{-4}$ |
| 10 pairs | $-0.0054637958$ | $4.1\times10^{-7}$ |
| 100 pairs | $-0.0054642018$ | $-1.3\times10^{-10}$ |
| 500 pairs | $-0.0054642016$ | below $10^{-12}$ |
| 1,500 pairs | $-0.0054642016$ | below $10^{-12}$ |

For $Y=2$ there is no prime term, as in section [[s-tf-one-place]], and [[eq-tf-one-place-formula]] reads $0.0412165516=0.0356193861+0.0120833266-0.0064861611$, with a difference of $10^{-15}$ at 1,500 pairs. The zero sum converges fast because $\varphi$ is smooth, so $M\varphi(i\gamma)$ decays faster than any power of $\gamma$.

What this shows is that the two sides agree for these test functions when the zero side is evaluated with the first 1,500 zeros. All of these zeros lie on the critical line, as every computed zero does, so every one of them is inside the strip for every $a>0$, and the computation cannot tell [[eq-tf-trace-formula]] apart from Weil's explicit formula, which sums over all zeros. What the theorem adds is exactly what no computation of this kind can see: the identity holds for every admissible $\varphi$, and with the zero sum restricted to the strip $\lvert\beta-\tfrac12\rvert<a$ for every $a>0$, whatever zeros there are, including zeros far beyond any computed height. The content of the theorem is a statement about zeros that no one has computed.

::::: figure {#f-tf-balance viz="tf-balance" height="480"}
For a concrete test function the prime side plus the archimedean term balances the pole terms minus the zeros, and the zero sum settles after a few dozen zeros, all of which sit inside every strip.

```vizspec
Purpose: let the reader see the Trace Formula balance for a concrete phi, term by term, and see what a
  strip does to the zero side.
Scene: top, the test function phi(t) = u(1+u) bump(u/log Y), u = log t, bump(x) = exp(-1/(1-x^2)) on |x| < 1, drawn in
  gold over log t in [-2.5, 2.5], with gold ticks at the prime powers n and 1/n inside the support and their
  values. Middle, a horizontal balance bar: on the left a stacked bar of the archimedean term (blue) and one
  segment per prime-power term Lambda(n) n^(-1/2) (phi(n) + phi(1/n)) (gold, labeled n); on the right a
  stacked bar of M phi(1/2) and M phi(-1/2) (blue) minus the zero sum (teal). Show both totals and their
  difference in red. Bottom, the zero sum's partial sums against the number of zero pairs N (log scale, 1 to
  1500), teal, converging to a horizontal line.
  Right inset: the strip |Re z| < a in the z-plane, imaginary part 0 to 60, with the critical line Re z = 0 in
  violet and the zeros as teal dots on it; the strip shaded pale teal.
Controls: slider Y from 1.2 to 12 (sets the support; the prime ticks appear as Y passes 2, 3, 4, 5, 7, 8, 9,
  11); slider a from 0.01 to 0.5 (strip half-width); slider N of zero pairs from 1 to 1500; toggle
  "hypothetical zero" that adds an extra teal dot at z = 0.3 + 25i (and its mirror images) to the inset and, if
  it lies outside the strip, draws it hollow and excludes it from the trace-formula zero sum while including it
  in a second readout labeled "Weil's sum over all zeros".
Motion: moving a changes nothing in the balance (all real zeros are on the line), which is the honest point;
  with the hypothetical zero on, moving a across 0.3 moves that zero in and out of the trace-formula sum only.
Reader takeaway: numerically the formula balances, and the strip only matters for zeros off the line, which the
  numbers cannot exhibit and the theorem rules on.
Data: first 1500 zero ordinates of zeta (kit provides them); M phi(i gamma) computed by quadrature in u.
```
:::::

## Beside Weil's explicit formula {#s-tf-weil}

Chapter [[weil-positivity]] proved Weil's explicit formula [[t-wp-explicit]] in the normalization of Bombieri, with a test function $f$ on $(0,\infty)$, the transform $\mathcal Mf(s)=\int_0^\infty f(x)x^s\,\dd x/x$, and the local terms $W_p$ and $W_\infty$ of [[d-wp-local-terms]]. This part centers everything at $s=\tfrac12$, and the conversion between the two is exact. Set
$$
\varphi(t)=t^{1/2}f(t),\qquad\text{so that}\qquad M\varphi(z)=\mathcal Mf\bigl(z+\tfrac12\bigr),
$$ {#eq-tf-conversion}
and the zeros, poles, and local terms translate one by one. A zero $\rho$ gives $\mathcal Mf(\rho)=M\varphi(\rho-\tfrac12)$. The poles give $\mathcal Mf(0)+\mathcal Mf(1)=M\varphi(-\tfrac12)+M\varphi(\tfrac12)$. At a prime, $W_p(f)=\log p\sum_{k\ge1}\bigl(f(p^k)+p^{-k}f(p^{-k})\bigr)=\log p\sum_{k\ge1}p^{-k/2}\bigl(\varphi(p^k)+\varphi(p^{-k})\bigr)$, which is [[eq-tf-local-prime]]. At infinity, $\varphi(1)=f(1)$, and when this vanishes
$$
W_\infty(f)=\int_1^\infty\Bigl(f(x)+\frac{f(1/x)}{x}\Bigr)\frac{\dd x}{x-x^{-1}}=\frac12\int_0^\infty\varphi(t)\,t^{1/2}\Bigl(\frac1{\lvert1-t\rvert}+\frac1{1+t}\Bigr)\frac{\dd t}{t},
$$ {#eq-tf-winf}
as one sees by splitting the right side at $t=1$. Since $\varphi(t)t^{1/2}/t=f(t)$, the right side is $\int_1^\infty f(t)\,\frac{t\,\dd t}{t^2-1}+\int_0^1f(t)\,\frac{\dd t}{1-t^2}$. The first piece is $\int_1^\infty f(x)\,\dd x/(x-x^{-1})$, and the substitution $t=1/x$ turns the second into $\int_1^\infty f(1/x)\,\dd x/(x^2-1)=\int_1^\infty x^{-1}f(1/x)\,\dd x/(x-x^{-1})$. The constant $(\log4\pi+\gamma_{\mathrm E})f(1)$ and the subtraction $2x^{-1}f(1)$ of [[eq-wp-Winf]] vanish with $f(1)$. With [[eq-tf-conversion]], Weil's formula $\sum_\rho\mathcal Mf(\rho)=\mathcal Mf(0)+\mathcal Mf(1)-\sum_pW_p(f)-W_\infty(f)$ becomes, for $\varphi(1)=0$,
$$
\frac12\int_0^\infty\varphi(t)\,t^{1/2}\Bigl(\frac1{\lvert1-t\rvert}+\frac1{1+t}\Bigr)\frac{\dd t}{t}+\sum_{n\ge2}\frac{\Lambda(n)}{\sqrt n}\bigl(\varphi(n)+\varphi(1/n)\bigr)=M\varphi(\tfrac12)+M\varphi(-\tfrac12)-\sum_{\text{all }\rho}m_\rho\,M\varphi\bigl(\rho-\tfrac12\bigr).
$$ {#eq-tf-weil}
This is also the source's idelic form of the explicit formula, Theorem B.4.4.7, specialized to $\QQ$ [@masullo, p. 623] [@weil1952]. The numbers of section [[s-tf-numbers]] check [[eq-tf-weil]] as much as they check [[eq-tf-trace-formula]], and the Gamma form [[eq-tf-arch-gamma]] is $W_\infty(f)$ written through the factor $\pi^{-s/2}\Gamma(s/2)$ from which chapter [[weil-positivity]] derives it.

Side by side, the two formulas are:

| | Weil's explicit formula [[eq-tf-weil]] | Trace Formula [[eq-tf-trace-formula]] |
| --- | --- | --- |
| test functions | every $\varphi$ in $C_c^\infty(\RR_{>0})$ (with extra constants if $\varphi(1)\ne0$) | $\varphi(1)=0$ |
| archimedean term | $\tfrac12\int\varphi\,t^{1/2}\bigl(\lvert1-t\rvert^{-1}+(1+t)^{-1}\bigr)\dd t/t$ | the same |
| prime side | $\sum_n\Lambda(n)n^{-1/2}(\varphi(n)+\varphi(1/n))$ | the same |
| pole terms | $M\varphi(\tfrac12)+M\varphi(-\tfrac12)$ | the same |
| zero side | every nontrivial zero | only the zeros with $\lvert\beta-\tfrac12\rvert<a$, for any $a>0$ |
| where the zeros come from | contour shift past every pole of $\zeta'/\zeta$ | point evaluations that are continuous on $W_a$ |
| proved by | complex analysis of $\zeta$ | traces on theta sums in a coarse topology |

The left sides agree term for term. The source makes the same observation: the side made of places and poles is identical to that of the explicit formula, while the side made of zeros is not [@masullo, p. 36]. Subtracting one formula from the other leaves the sum of $M\varphi(\rho-\tfrac12)$ over the zeros outside the strip, set equal to zero, for every $\varphi$ with $\varphi(1)=0$. Chapter [[trace-to-grh]] shows that this forces the set of such zeros to be empty.

::: warning
The Trace Formula is not the explicit formula with some terms dropped by hand. Both identities are true at once, for the same $\varphi$ and the same left side. If a zero $\rho_0$ with $\lvert\beta_0-\tfrac12\rvert\ge a$ existed, [[eq-tf-weil]] would contain its term and [[eq-tf-trace-formula]] would not, and the only way both could hold for every admissible $\varphi$ is that the terms of all such zeros cancel. The next chapter shows they cannot.
:::

## What changes in general {#s-tf-changes}

For a number field $F$ the $S$-local computation runs on $\AA_{F,S}=\prod_{v\in S}F_v$, and three things change. The set $S$ must contain the archimedean places, the places that ramify over $\QQ$, the places where the character ramifies, and enough places that the ring of $S$-integers has trivial class group, $\mathrm{Pic}(\mathcal O_{F,S})=1$, so that every idele class has a representative that is a unit at every place outside $S$, and a test function invariant under those units is a function on the $S$-idele class group $J_{F,S}$ [@masullo, Theorem 12.4.1.1 and proof of Theorem 12.5.1.1, pp. 514, 520]. The archimedean places come in two kinds: a real place contributes with the factor $\tfrac12$ as over $\QQ$, and a complex place with $\frac1{2\pi}$, where $2\pi$ is the volume of the unit circle of $\CC^\times$ in its measure, and the fixed point of a dilation of $\CC$ has the weight $1/\lvert1-y\rvert_v$ with $\lvert\cdot\rvert_v$ the square of the usual absolute value. At a finite place the local term is $\log q_v/\mu_v(\mathcal O_v^\times)$ times the local integral, and for a test function of weight $\bar\chi$ it is $\log q_v\sum_{m\ge1}q_v^{-m/2}\bigl(\chi(\pi_v^m)\varphi(q_v^m)+\bar\chi(\pi_v^m)\varphi(q_v^{-m})\bigr)$. The pole terms appear only for the isotype of the trivial character on $C_F^1$ [@masullo, §1.4.1, p. 28], and the normalization of the global Mellin transform gives $C_F^1$ volume $1$, which is how the source's Theorem B.4.4.7 divides by $\mu_1(C_F^1)$ (p. 623). The weight is $\tfrac12$ for the same reason in every case: $\lvert x\rvert_{F,S}\,\dd\mu_S$ is a constant times the additive measure $\dd\nu_S$, and no other power is [@masullo, p. 16].

::: symbols
| Symbol | What it is | Kind | Where it lives |
| --- | --- | --- | --- |
| $\AA_S$, $\AA_S^\times$ | $S$-adeles $\RR\times\prod_{p\le Y}\QQ_p$ and their units | locally compact ring and group | [[d-tf-s-adeles]] |
| $\omega$ | an $S$-unit $\pm\prod_{p\le Y}p^{e_p}$ | rational number | [[d-tf-s-adeles]] |
| $J_S$ | $S$-idele class group, $\cong\RR_{>0}\times\prod_{p\le Y}\ZZ_p^\times$ | locally compact group | [[d-tf-s-adeles]] |
| $\nu_S$, $\mu_S$, $c_S$ | additive and multiplicative measures, $c_S=\prod_{p\le Y}p/(p-1)$ | measures, constant | [[d-tf-measures]] |
| $\mathbf e_S$, $\mathcal F_S$ | standard character and Fourier transform on $\AA_S$ | function, operator | [[d-tf-measures]] |
| $U_y$ | dilation $g(x)\mapsto g(x/y)$ | operator | [[s-tf-one-place]] |
| $R$, $R'$ | cutoffs in space and in frequency | positive reals | [[t-tf-dilation]] |
| $\mathrm{Si}$ | sine integral $\int_0^v\sin w\,\dd w/w$ | function | [[t-tf-dilation]] |
| $\tilde\varphi$ | lift of $\varphi$ to $\AA_S^\times$ | test function | [[t-tf-s-local]] |
| $\int'$ | Weil's principal value | linear functional | [[t-tf-s-local]] |
:::

::: recap
- Chapter [[cutting-the-kernel]] reduced the geometric side to the $S$-local diagonal mass [[eq-tf-reduction]], with $S$ the real place and the primes up to $Y$.
- On one place the trace of a dilation, cut off in space and frequency, is the fixed-point weight $\lvert y\rvert/\lvert1-y\rvert$ ([[t-tf-dilation]]). Averaging over $\pm1$ gives the archimedean term with its $\tfrac12$ and its $1/(1+t)$, and the two conditions on theta sums subtract the pole terms.
- On all of $S$, Connes's computation [[t-tf-s-local]] turns the trace into the volume $\log(RR')-\log\lvert w\rvert_S$ and splits it into Weil's local terms, place by place.
- The weight $\tfrac12$ is the one power for which $\lvert x\rvert^{2w}\,\dd\mu_S$ is the additive measure, which is the source's explanation of the $\tfrac12$ in the hypothesis (section [[s-tf-half]]).
- At a prime the local term is $\log p\sum_{m\ge1}p^{-m/2}(\varphi(p^m)+\varphi(p^{-m}))$ ([[t-tf-local-prime]]), and the archimedean constants agree with the source's Theorem B.4.4.7 and with the Gamma form.
- The Trace Formula over $\QQ$ [[t-tf-trace-formula]] has Weil's left side and only the zeros of the strip on the right. It checks to better than $10^{-12}$ against 1,500 zeros, and its content lies beyond any such check. Chapter [[trace-to-grh]] uses the difference from [[eq-tf-weil]].
:::
