---
id: trace-to-grh
title: From the Trace Formula to the hypothesis
part: 3
summary: After this chapter you can derive the Riemann Hypothesis from the Trace Formula in two ways, say why Weil's positivity is never used, explain in what sense the hypothesis becomes a statement about topology, and retrace Route M as one chain from the adeles to the end.
needs: [trace-formula]
---

::: plain
Feed the Trace Formula a family of test functions that turns its prime side into the logarithmic derivative of zeta. That function has a pole at every zero of zeta, while the other side of the formula only has poles at the zeros inside the strip. A zero outside the strip would be a pole with nowhere to come from, so there is none, and since the strip can be as thin as we like, every zero lies on the critical line.
:::

Chapter [[trace-formula]] proved an identity whose left side is Weil's complete prime sum and whose right side counts only the zeros with $\lvert\beta-\tfrac12\rvert<a$. This chapter draws the consequence. The source does it in its introduction and in a letter to P. Sarnak, with a holomorphic family of test functions, a mollifier, and Montel's theorem [@masullo, §§1.4.2 to 1.4.5, pp. 28 to 30, and §§1.8.4.2 to 1.8.5.1, pp. 53 to 55]. We give that argument with each limit named and located, in a form over $\QQ$ in which every limit converges without passing to a subsequence. Then we give a shorter route of our own, which subtracts the Trace Formula from Weil's explicit formula and needs neither the prime sum nor the archimedean term. After the proof come three things the source says about it: that positivity is never used, that the hypothesis appears as a topological phenomenon, and that the method does not reach function fields, where chapters [[function-fields]] and [[stepanov]] proved the hypothesis by a different mechanism. The chapter ends with Route M on one page.

## The family that turns primes into a logarithmic derivative {#s-tg-family}

The prime side of the Trace Formula is $\sum_n\Lambda(n)n^{-1/2}\bigl(\varphi(n)+\varphi(1/n)\bigr)$. Chapter [[euler-product]] showed that $\sum_n\Lambda(n)n^{-s}=-\zeta'(s)/\zeta(s)$ for $\Re s>1$, so a test function that equals $t^{-z}$ on the integers $n\ge2$ and vanishes on their reciprocals turns the prime side into $-\zeta'/\zeta(z+\tfrac12)$, a function with a pole at every zero of $\zeta$. The source's family does exactly this [@masullo, §1.4.2, p. 28].

::: definition {#d-tg-family title="The holomorphic family"}
For $z\in\CC$ let $\varphi_z(t)=t^{-z}$ for $t>1$, $\varphi_z(t)=0$ for $0<t<1$, and $\varphi_z(1)=\tfrac12$. It is a family of functions on $\RR_{>0}$ that depends holomorphically on $z$ at each fixed $t$. It is not a test function in the sense of chapter [[trace-formula]]: it jumps at $t=1$, its value there is not $0$, and it does not have compact support.
:::

Its Mellin transform is a single pole. For $\Re z>\Re w$,
$$
M\varphi_z(w)=\int_1^\infty t^{w-z}\,\frac{\dd t}{t}=\frac1{z-w}.
$$ {#eq-tg-mellin-family}
So the pole terms of the Trace Formula become $M\varphi_z(\tfrac12)+M\varphi_z(-\tfrac12)=\frac1{z-1/2}+\frac1{z+1/2}$, a zero $\rho$ contributes $\frac1{z-(\rho-1/2)}$, and the prime side becomes $\sum_n\Lambda(n)n^{-1/2-z}=-\frac{\zeta'}{\zeta}(z+\tfrac12)$ for $\Re z>\tfrac12$. If [[eq-tf-trace-formula]] could be applied to $\varphi_z$ as it stands, it would read
$$
(\text{archimedean term})-\frac{\zeta'}{\zeta}\bigl(z+\tfrac12\bigr)=\frac1{z-\frac12}+\frac1{z+\frac12}-\sum_{\lvert\beta-1/2\rvert<a}\frac{m_\rho}{z-(\rho-\frac12)},
$$ {#eq-tg-heuristic}
with an archimedean term that is holomorphic in a half-plane. The left side has a pole at $z=\rho-\tfrac12$ for every zero $\rho$, with residue $-m_\rho$, because $-\zeta'/\zeta$ has residue $-m$ at a zero of order $m$. The right side has poles only at the zeros in the strip. A zero with $\beta-\tfrac12>a$ would put a pole on the left at a point where the right side is holomorphic. That is the whole idea, and the rest of this section and the next make it a proof by replacing $\varphi_z$ with honest test functions and controlling the limits.

The same equation with the sum over all zeros is the classical partial-fraction expansion of $-\zeta'/\zeta$ that comes from Hadamard's product for $\xi$ (chapter [[zeros]]), and in that form it says nothing about where the zeros are. Every pole on the left is matched by a term on the right. The Trace Formula breaks the matching by removing the terms of the zeros outside the strip from the right side while leaving the left side, built from primes, untouched.

::::: figure {#f-tg-poles viz="tg-pole-landscape" height="480"}
The logarithmic derivative of zeta has a pole at every zero, while the right side of the Trace Formula has poles only at the zeros inside the strip, so a zero outside the strip would be a pole with nowhere to come from.

```vizspec
Purpose: show the mismatch of poles that the endgame exploits.
Scene: the z-plane, Re z in [-1, 1.5], Im z in [0, 50]. Two panels side by side (stacked at phone width).
  Left panel "primes": a domain-colored or contour plot of log |-zeta'/zeta(z + 1/2)| (bright at poles), with
  the poles at z = i gamma for the zeros (teal dots on the violet line Re z = 0) and at z = 1/2 (blue dot).
  Right panel "strip": the same plot for the right side 1/(z - 1/2) + 1/(z + 1/2) - sum over zeros in the
  strip of 1/(z - (rho - 1/2)), with the strip |Re z| < a shaded pale teal and its edges as dashed lines.
  A toggle adds a hypothetical zero at z0 = 0.3 + 25 i together with its mirror images (-0.3 + 25 i, and the
  conjugates if Im were shown). It is drawn as a red dot. On the left panel it is always a pole; on the right
  panel it is a pole only when 0.3 < a.
Controls: slider a from 0.01 to 0.6 (strip half-width, drag the strip edge directly); toggle "hypothetical
  zero"; hover shows the value of both sides at the cursor.
Motion: dragging a below 0.3 with the hypothetical zero on makes its pole vanish from the right panel while it
  stays on the left; a red ring flashes there to mark the contradiction.
Reader takeaway: the prime side knows every zero, the strip side only those inside the strip, so no zero can
  live outside any strip.
Data: first 100 zero ordinates of zeta (kit provides them); -zeta'/zeta evaluated by the kit or approximated by
  1/(z-1/2) + 1/(z+1/2) - sum over the first 100 zeros of 2 z' / (z'^2 + gamma^2), z' = z, plus a smooth
  background, which is enough for the picture.
```
:::::

## The source's argument, limit by limit {#s-tg-source}

The source makes [[eq-tg-heuristic]] honest in eight steps, tied to the numbered paragraphs of its introduction [@masullo, pp. 28 to 30]. We follow them for $\QQ$ and the trivial character, writing $\varphi$ for a function of the norm. Step 2 contains a bound that fails as stated; the warning after the list says what goes wrong, and [[t-tg-rh]] gives a version over $\QQ$ that does not need it.

1. **Smoothed truncations** (§1.4.2, pp. 28 to 29). Let $J_\varepsilon$ be a mollifier on $\RR_{>0}$ (the source's $\rho_\varepsilon$; on this page $\rho$ is a zero) and $h$ a smooth bump with values in $[0,1]$ supported in $(1,\infty)$, and put $\varphi_{h,\varepsilon,z}=h\cdot(J_\varepsilon*\varphi_z)$. Each $\varphi_{h,\varepsilon,z}$ is smooth, compactly supported in $(1,\infty)$, so it vanishes at $1$, and it is a legitimate test function for [[t-tf-trace-formula]]. As $\varepsilon\to0$ and $h$ increases to $\mathbf 1_{(1,\infty)}$, $\varphi_{h,\varepsilon,z}(t)\to\varphi_z(t)$ for every $t\ne1$.
2. **Archimedean term, by Montel's theorem** (§1.4.3, p. 29). Fix a compact set $K$ in the half-plane $\Re z>a$ whose interior meets $\Re z>1$. The archimedean integrals are holomorphic in $z$, and the source asserts that they are bounded on $K$ by one constant independent of $h$ and $\varepsilon$. Granting that, by Montel's theorem a sequence of $(\varepsilon,h)$ can be extracted along which they converge uniformly on compact discs inside $K$, and the limit is holomorphic [@ss-complex, Ch. 8].
3. **Zero sum** (§1.4.3, p. 29, by the same reasoning as step 2). The sums $\sum_{\lvert\beta-1/2\rvert<a}m_\rho M\varphi_{h,\varepsilon,z}(\rho-\tfrac12)$ converge to a function holomorphic for $z$ in the interior of $K$ off the strip. Each term tends to $1/(z-(\rho-\tfrac12))$ by [[eq-tg-mellin-family]], which is holomorphic in $\Re z>a$ because $\Re(\rho-\tfrac12)<a$.
4. **Prime sum** (§1.4.4, p. 29). Since $\varphi_{h,\varepsilon,z}$ vanishes on $(0,1]$, all the terms $\varphi(1/n)$ are $0$, and $\sum_n\Lambda(n)n^{-1/2}\varphi_{h,\varepsilon,z}(n)$ tends to $\sum_n\Lambda(n)n^{-1/2-z}=-\frac{\zeta'}{\zeta}(z+\tfrac12)$ uniformly on compact subsets of $\Re z>1$. (The source writes the limit as $L_f'/L_f$; for $\zeta$ the prime sum is $-\zeta'/\zeta$, and we use that sign throughout.)
5. **Assembly** (§1.4.5, p. 29). On the interior of $K$, $-\frac{\zeta'}{\zeta}(z+\tfrac12)$ equals $\frac1{z-1/2}+\frac1{z+1/2}$ minus a function holomorphic on $\Re z>a$ minus a function holomorphic on the interior of $K$. The source singles this out as the main consequence of the Trace Formula, from which everything else follows.
6. **Continuation** (p. 30). Since $K$ was any compact set of this kind, $-\frac{\zeta'}{\zeta}(z+\tfrac12)-\frac1{z-1/2}-\frac1{z+1/2}$ is holomorphic on $\Re z>a$, first on $\Re z>1$ and then by analytic continuation on all of $\Re z>a$. So $\zeta'/\zeta(s)$ has no pole in $\Re s>\tfrac12+a$ other than $s=1$.
7. **Shrinking the strip** (p. 30). The half-width $a>0$ is arbitrary, so $\zeta'/\zeta(s)$ is holomorphic on $\Re s>\tfrac12$ except at $s=1$, and $\zeta$ has no zero with $\Re s>\tfrac12$.
8. **Reflection** (p. 30). The functional equation $\xi(s)=\xi(1-s)$ of chapter [[zeta-continued]] sends a zero $\rho$ to the zero $1-\rho$, so there is no zero with $\Re s<\tfrac12$ either.

The contradiction at the heart of step 6 can be stated exactly. Suppose $\zeta(\rho_0)=0$ with $\beta_0>\tfrac12$, and choose $0<a<\beta_0-\tfrac12$. Then $z_0=\rho_0-\tfrac12$ lies in $\Re z>a$, and $-\zeta'/\zeta(z+\tfrac12)$ has a pole at $z_0$ with residue $-m_{\rho_0}\ne0$. But the Trace Formula with this $a$ expresses the same function near $z_0$ as a sum of terms that are each holomorphic at $z_0$: the archimedean limit, the two pole terms at $\pm\tfrac12$, and the terms $m_\rho/(z-(\rho-\tfrac12))$ of the zeros in the strip, none of which sits at $z_0$. The zero $\rho_0$ is absent from the right side because of the topology of chapter [[strip-topology]], and present on the left because the left side is Weil's prime sum, which has a pole at every zero.

::: warning
The bound in step 2 fails as stated, and this is the one place where we depart from the source. If $h$ increases to $\mathbf 1_{(1,\infty)}$, the left end $1+\delta$ of its support tends to $1$, and just to the right of that end $J_\varepsilon*\varphi_z$ is close to a number between $\tfrac12$ and $1$, not to $0$. The archimedean integral $\tfrac12\int\varphi\,t^{1/2}\lvert1-t\rvert^{-1}\,\dd t/t$ then contains a piece comparable to $\int_{1+\delta}^2\dd t/(t-1)=\log(1/\delta)$, so it is unbounded as $\delta\to0$. The prime sum and the pole terms stay bounded, so the Trace Formula forces the zero sum to diverge at the same rate with the opposite sign. The growing part comes from $t$ near $1$, where $t^{-z}$ is close to $1$, so to leading order it does not depend on $z$, and one could move it from the archimedean term to the zero sum. That rescues Montel's theorem for the archimedean term, but step 3 then has to show that the renormalized zero sum tends to a function holomorphic on all of $\Re z>a$, and this is no longer a statement about single terms: the termwise limit $\sum m_\rho/(z-(\rho-\tfrac12))$ does not converge absolutely, because $\sum_\rho1/\lvert\rho\rvert$ diverges. The source's text gives no argument for this step. Over $\QQ$ the difficulty disappears with a fixed cutoff: no prime power lies strictly between $1$ and $2$, so the test functions can vanish on $(0,\tfrac32]$ for good without changing the prime side, and then every limit converges outright. That is the version we prove next, and section [[s-tg-general]] notes that the same choice works over every number field.
:::

::::: card {#t-tg-rh kind="theorem" title="Every nontrivial zero of $\zeta$ has real part one half" source="masullo" loc="§§1.4.2 to 1.4.5, pp. 28 to 30"}
:::: statement
Every nontrivial zero $\rho=\beta+i\gamma$ of $\zeta$ has $\beta=\tfrac12$.
::::
:::: plain
Choose test functions that turn the prime side of the Trace Formula into the logarithmic derivative of zeta. Then the formula expresses that function, which has a pole at every zero, as a sum of pieces whose only poles are at the zeros inside a strip around the critical line. So there are no zeros outside the strip, and the strip can be as thin as we like.
::::
:::: why
This is the theorem the whole of Part III is for. Every earlier chapter of the route contributes one ingredient of [[eq-tf-trace-formula]], and this chapter only reads it off.
::::
:::: idea
Use the family $h_0(t)\,t^{-z}$, where $h_0$ is $0$ near $1$ and $1$ from $t=2$ on. Since no prime power lies in $(1,2)$, the prime side is exactly the Dirichlet series of $-\zeta'/\zeta(z+\tfrac12)$, and every other term converges to an explicit function whose poles we can list. The identity then continues analytically from $\Re z>\tfrac12$ to $\Re z>a$, where the two sides have different poles unless no zero lies to the right of the strip.
::::
:::: proof
*Setup (our choice over $\QQ$).* Fix a fixed cutoff $h_0$, smooth on $\RR_{>0}$ with $h_0=0$ on $(0,\tfrac32]$ and $h_0=1$ on $[2,\infty)$, and $\kappa$ smooth with $\kappa=1$ on $(0,1]$ and $\kappa=0$ on $[2,\infty)$. Put $b(u)=\frac{\dd}{\dd u}h_0(e^u)$, a smooth function supported in $[\log\tfrac32,\log2]$ with $\int_\RR b=1$, and
$$
\tilde b(w)=\int_\RR b(u)\,e^{-wu}\,\dd u,\qquad H(w)=\frac{\tilde b(w)}{w}.
$$ {#eq-tg-H}
$\tilde b$ is entire with $\tilde b(0)=1$, and integrating by parts $k$ times shows $\lvert\tilde b(w)\rvert\le C_{k,B}(1+\lvert\Im w\rvert)^{-k}$ for $\lvert\Re w\rvert\le B$. So $H$ is meromorphic on $\CC$ with one simple pole, at $w=0$, of residue $1$, and decays rapidly on vertical strips. For $\Re w>0$ one integration by parts gives $H(w)=\int_1^\infty h_0(t)\,t^{-w}\,\dd t/t$. Fix $a\in(0,\tfrac12)$.

*Step 1, test functions.* For $R\ge2$ and $z\in\CC$ let $\varphi_{R,z}(t)=h_0(t)\,\kappa(t/R)\,t^{-z}$. It is smooth with compact support in $[\tfrac32,2R]\subset(1,\infty)$, so $\varphi_{R,z}(1)=0$, and [[t-tf-trace-formula]] applies to it; it even satisfies the standing assumption $\operatorname{supp}\varphi\subset(1,Y)$ of chapter [[cutting-the-kernel]] with $Y=2R+1$. It is complex valued, and the Trace Formula holds for complex $\varphi$ because both sides are linear in $\varphi$ and it holds for the real and imaginary parts.

*Step 2, prime side.* For $n\ge2$, $h_0(n)=1$ and $\varphi_{R,z}(1/n)=0$, so the prime side is $\sum_n\Lambda(n)n^{-1/2-z}\kappa(n/R)$. For $\Re z>\tfrac12$ the series converges absolutely, and by dominated convergence it tends to $-\frac{\zeta'}{\zeta}(z+\tfrac12)$ as $R\to\infty$. This is the source's limit of §1.4.4 without the mollifier.

*Step 3, pole terms.* $M\varphi_{R,z}(\pm\tfrac12)=\int h_0(t)\kappa(t/R)t^{\pm1/2-z}\,\dd t/t$ tends to $H(z\mp\tfrac12)$ for $\Re z>\tfrac12$.

*Step 4, archimedean term.* It tends to
$$
E_\infty(z)=\frac12\int_{3/2}^\infty h_0(t)\,t^{1/2-z}\Bigl(\frac1{t-1}+\frac1{t+1}\Bigr)\frac{\dd t}{t},
$$
which converges absolutely and is holomorphic for $\Re z>-\tfrac12$, because the integrand vanishes near $t=1$ and is $O(t^{-\Re z-3/2})$ at infinity. This replaces the source's Montel step: with $h_0$ fixed near $t=1$ no subsequence is needed.

*Step 5, zero sum.* Write $u=\log t$ and $v=\rho-\tfrac12-z$. Then $M\varphi_{R,z}(\rho-\tfrac12)=\int G_R(u)e^{vu}\,\dd u$ with $G_R(u)=h_0(e^u)\kappa(e^u/R)$. For $z$ in a compact set $Q\subset\{\Re z>a\}$ and $\rho$ in the strip, $\Re v\le-\delta<0$ for some $\delta=\delta(Q)$. Two integrations by parts in $u$, with no boundary terms since $G_R$ has compact support, give $\lvert M\varphi_{R,z}(\rho-\tfrac12)\rvert\le\lvert v\rvert^{-2}\int\lvert G_R''(u)\rvert e^{-\delta u}\,\dd u$, where $\lvert v\rvert\ge\max(\delta,\lvert\gamma-\Im z\rvert)\ge c_Q(1+\lvert\gamma\rvert)$, and the last integral is bounded independently of $R$ because $G_R''$ is bounded uniformly in $R$ and supported in $[\log\tfrac32,\log2]\cup[\log R,\log2R]$. Each term converges, uniformly on $Q$: the difference between $M\varphi_{R,z}(\rho-\tfrac12)$ and its limit $\int_1^\infty h_0(t)\,t^{v}\,\dd t/t=H(-v)$ is at most $\int_R^\infty t^{-\delta}\,\dd t/t=R^{-\delta}/\delta$. Since $\sum_\rho m_\rho(1+\lvert\gamma\rvert)^{-2}<\infty$ by the count $N(T)=O(T\log T)$ of chapter [[zeros]], dominated convergence gives, uniformly on $Q$,
$$
\sum_{\lvert\beta-1/2\rvert<a}m_\rho\,M\varphi_{R,z}\bigl(\rho-\tfrac12\bigr)\ \longrightarrow\ Z_a(z)=\sum_{\lvert\beta-1/2\rvert<a}m_\rho\,H\bigl(z-(\rho-\tfrac12)\bigr),
$$
a function holomorphic on $\Re z>a$, since each term is and the convergence is locally uniform. This is the limit of the zero sum in §1.4.3 of the source.

*Step 6, the identity.* Letting $R\to\infty$ in [[eq-tf-trace-formula]] for $\Re z>\tfrac12$,
$$
E_\infty(z)-\frac{\zeta'}{\zeta}\bigl(z+\tfrac12\bigr)=H\bigl(z-\tfrac12\bigr)+H\bigl(z+\tfrac12\bigr)-Z_a(z).
$$ {#eq-tg-identity}
This is the source's (1.8.5.1) over $\QQ$.

*Step 7, continuation.* Put $F(z)=-\frac{\zeta'}{\zeta}(z+\tfrac12)-\frac{\tilde b(z-1/2)}{z-1/2}$. It is meromorphic on $\CC$, and the pole of $-\zeta'/\zeta(s)$ at $s=1$ with residue $1$ is canceled at $z=\tfrac12$ because $\tilde b(0)=1$. By [[eq-tg-identity]], on $\Re z>\tfrac12$,
$$
F(z)=H\bigl(z+\tfrac12\bigr)-Z_a(z)-E_\infty(z),
$$
and the right side is holomorphic on the connected half-plane $\Re z>a$, because the only pole of $H(z+\tfrac12)$ is at $z=-\tfrac12$. By uniqueness of analytic continuation, $F$ is holomorphic on $\Re z>a$.

*Step 8, no zero right of the strip.* If $\zeta(\rho_0)=0$ with $\beta_0>\tfrac12+a$, then $-\zeta'/\zeta(z+\tfrac12)$ has a pole at $z_0=\rho_0-\tfrac12$ with residue $-m_{\rho_0}\ne0$, and $\tilde b(z-\tfrac12)/(z-\tfrac12)$ is holomorphic there since $z_0\ne\tfrac12$. So $F$ has a pole in $\Re z>a$, which Step 7 excludes. Hence every zero has $\beta\le\tfrac12+a$. A zero exactly on the edge, $\beta=\tfrac12+a$, contributes no term to $Z_a$ and gives a point $z_0$ on the line $\Re z=a$, outside the region where Step 7 applies, so this $a$ says nothing about it, but every smaller $a$ excludes it. Since $a\in(0,\tfrac12)$ was arbitrary, $\beta\le\tfrac12$.

*Step 9, reflection.* The zeros are symmetric under $\rho\mapsto1-\rho$ by the functional equation ([[zeta-continued]]), so $\beta\ge\tfrac12$ as well, and $\beta=\tfrac12$.
::::
:::: example
The identity [[eq-tg-identity]] can be checked with numbers, with the known zeros, all on the line, standing in for the strip. Take $h_0(e^u)=S\bigl((u-\log\tfrac32)/\log\tfrac43\bigr)$ with the smooth step $S(x)=e^{-1/x}/(e^{-1/x}+e^{-1/(1-x)})$ on $(0,1)$. At $z=2$, $-\zeta'/\zeta(\tfrac52)=0.2887406856$, while $H(\tfrac32)=0.29319455$, $H(\tfrac52)=0.10201852$, and $E_\infty(2)=0.12741720$, so the zero sum must be $-0.0209448$, and the first 500 pairs of zeros give it to $5\times10^{-12}$. Rewritten as $-\zeta'/\zeta(z+\tfrac12)=H(z-\tfrac12)+H(z+\tfrac12)-Z_a(z)-E_\infty(z)$, the identity can also be tested where the Dirichlet series diverges and the left side means its continuation. At $z=0.25+3i$, $-\zeta'/\zeta(0.75+3i)=-0.3392087731+0.0433329351\,i$, and the right side agrees to $10^{-11}$ with 500 pairs. At $z=0.05+14i$, near the first zero at $z=14.1347\,i$, $-\zeta'/\zeta(0.55+14i)=-2.0236013-6.4357089\,i$, the right side agrees to $10^{-11}$, and the first pair alone already gives $-1.93-6.51\,i$. (Computed with mpmath and Gauss-Legendre quadrature from the first 1,500 zeros.)
::::
:::: used
- Section [[s-tg-route]]: the last link of the chain.
::::
:::::

::::: figure {#f-tg-family viz="tg-family" height="420"}
The family $t^{-z}$ cut off below $t=1$ and smoothed turns the prime side into the Dirichlet series of $-\zeta'/\zeta(z+\tfrac12)$, and since no prime power lies between 1 and 2 the cutoff near 1 can stay fixed.

```vizspec
Purpose: show the holomorphic family, its smoothed truncations, and why the integers ignore what happens
  in (1, 2).
Scene: horizontal axis t in [0.5, 30] on a log scale, vertical axis [-1.2, 1.2]. Draw the sharp family
  phi_z(t) = t^(-z) for t > 1 (real part solid, imaginary part dashed) in blue, with an open dot at t = 1 of
  height 1/2. Draw the truncation phi_{R,z}(t) = h0(t) kappa(t/R) t^(-z) in gold, with h0 the smooth step
  from 0 at t = 3/2 to 1 at t = 2 and kappa(t/R) the smooth cutoff from 1 at t = R to 0 at t = 2R. Mark the
  prime powers 2, 3, 4, 5, 7, 8, 9, 11, 13, 16, ... with gold ticks and show at each the value t^(-z) (they
  are identical for both curves). Shade the interval (1, 2) pale violet with the label "no prime power here".
  A second mode ("source's version") replaces h0 by a bump h whose left edge 1 + delta can be dragged toward
  1, and the mollified step J_eps * phi_z near t = 1; show a readout of the archimedean integral, which
  grows like log(1/delta), in red.
Controls: sliders Re z in [0.6, 3], Im z in [-10, 10]; slider R from 4 to 400 (log scale); mode toggle; in the
  source's mode, sliders delta in [0.001, 0.4] (log scale) and eps in [0.01, 0.3].
Motion: as R grows the gold curve fills out to the blue one on [2, infinity) while the prime ticks never move;
  in the source's mode, dragging delta to 0 makes the red readout climb.
Reader takeaway: the prime side sees only the integers, so the test functions can be chosen to vanish near 1
  without changing it.
Data: none beyond the formulas.
```
:::::

## A shorter route: subtract Weil's formula {#s-tg-subtraction}

The argument above computes the prime sum, the archimedean term, and the pole terms for a family of test functions, only to watch them cancel against the left side of an identity. Chapter [[trace-formula]] already noted that Weil's explicit formula [[eq-tf-weil]] has the same left side as the Trace Formula, term for term. Subtracting one from the other removes every term built from primes, places, and poles at once, and leaves a statement about the zeros alone. This is our compression of the endgame, suggested by the source's own plan for its Chapter 13, whose first section is titled "Recollections on the Explicit Formulas" [@masullo, p. 522]. We checked each step, including the convergence of the zero sums and the zeros on the edges of the strip.

::::: card {#t-tg-subtraction kind="proposition" title="For each $a>0$ the zeros with $\lvert\beta-\tfrac12\rvert\ge a$ contribute a Mellin sum of zero to every admissible test function, and therefore there are none" source="masullo" loc="Theorem 12.5.1.1, p. 519; Theorem B.4.4.7, p. 623; Lemma B.4.4.9, p. 624"}
:::: statement
Let $a>0$ and let $Z^{\mathrm{off}}_a$ be the set of nontrivial zeros $\rho$ of $\zeta$ with $\lvert\beta-\tfrac12\rvert\ge a$. Then:

1. For every $\varphi$ smooth with compact support in $\RR_{>0}$ and $\varphi(1)=0$,
$$
\sum_{\rho\in Z^{\mathrm{off}}_a}m_\rho\,M\varphi\bigl(\rho-\tfrac12\bigr)=0,
$$ {#eq-tg-difference}
with the sum absolutely convergent.
2. $Z^{\mathrm{off}}_a$ is empty.
::::
:::: plain
Weil's formula and the Trace Formula have the same left side, so their right sides are equal. Weil's right side has every zero, and the Trace Formula's has only the zeros in the strip, so the zeros outside the strip add up to zero against every test function. A single family of test functions turns that sum into a function with a pole at each such zero, and a function that is identically zero has no poles.
::::
:::: why
It isolates the one fact that the new trace formula contributes, a statement about the off-strip zeros alone, and shows that this fact already contains the hypothesis. A reader who has the explicit formula from chapter [[weil-positivity]] sees the endgame as one subtraction.
::::
:::: idea
After subtraction the prime side is gone, so the family need not produce $\zeta'/\zeta$. It only needs Mellin transforms with a pole, which a test function that is $t^{-z}$ out to infinity provides.
::::
:::: proof
*Step 1, the two formulas.* Weil's explicit formula [[eq-tf-weil]] holds for every $\varphi$ in question with the zero sum over all nontrivial zeros, absolutely convergent [@masullo, Theorem B.4.4.7, p. 623]. The Trace Formula [[eq-tf-trace-formula]] holds for the same $\varphi$ with the zero sum over the open strip $\lvert\beta-\tfrac12\rvert<a$. With the Sobolev degree $0$ that the source uses for the endgame, the strip is open and there are no edge terms [@masullo, p. 13]: a zero with $\lvert\beta-\tfrac12\rvert=a$ appears in Weil's sum and not in the Trace Formula, so it belongs to $Z^{\mathrm{off}}_a$.

*Step 2, convergence.* Every subsum of the zero sum converges absolutely. The source proves this for any set of zeros [@masullo, Lemma B.4.4.9, p. 624]. Over $\QQ$ it is direct: in $u=\log t$, $M\varphi(\rho-\tfrac12)=\int\varphi(e^u)e^{(\rho-1/2)u}\,\dd u$, two integrations by parts bound it by $C(1+\lvert\gamma\rvert)^{-2}$ uniformly for $0\le\beta\le1$, and $\sum_\rho m_\rho(1+\lvert\gamma\rvert)^{-2}<\infty$ by $N(T)=O(T\log T)$.

*Step 3, subtraction.* The left sides of the two formulas are identical, so the right sides are equal. The pole terms cancel, and by Step 2 the zero sums can be subtracted term by term, which leaves [[eq-tg-difference]]. This proves part 1.

*Step 4, a family.* Take $h_0$, $\kappa$, $\tilde b$, and $H$ as in the proof of [[t-tg-rh]], and apply [[eq-tg-difference]] to $\varphi_{R,z}(t)=h_0(t)\kappa(t/R)t^{-z}$. For $\Re z>\tfrac12$ every $\rho$ has $\Re\bigl(\rho-\tfrac12-z\bigr)<0$, and the integration by parts of Step 5 of that proof bounds $\lvert M\varphi_{R,z}(\rho-\tfrac12)\rvert$ by $C(1+\lvert\gamma\rvert)^{-2}$ uniformly in $R$. Letting $R\to\infty$,
$$
\Delta(z)=\sum_{\rho\in Z^{\mathrm{off}}_a}m_\rho\,H\bigl(z-(\rho-\tfrac12)\bigr)=\sum_{\rho\in Z^{\mathrm{off}}_a}m_\rho\,\frac{\tilde b(z-\rho+\frac12)}{z-\rho+\frac12}=0\qquad(\Re z>\tfrac12).
$$

*Step 5, continuation.* For $z$ in a compact set $Q\subset\CC$, the real parts of $z-\rho+\tfrac12$ are bounded, so $\lvert\tilde b(z-\rho+\tfrac12)\rvert\le C_Q(1+\lvert\gamma\rvert)^{-2}$, and the series for $\Delta$ converges absolutely and uniformly on $Q$ once the finitely many terms with $\rho-\tfrac12$ in or near $Q$ are set aside. So $\Delta$ is meromorphic on $\CC$, and its poles are the points $\rho-\tfrac12$ with $\rho\in Z^{\mathrm{off}}_a$. At such a point only one term is singular, with residue $m_\rho\tilde b(0)=m_\rho\ge1$, so the pole is really there. But $\Delta=0$ on the open set $\Re z>\tfrac12$, hence on all of $\CC$ minus its poles, which is connected, and a function that is identically zero near a point cannot have a pole there. So $Z^{\mathrm{off}}_a$ is empty, which is part 2.

*Step 6, conclusion.* Since $a>0$ is arbitrary, every nontrivial zero has $\beta=\tfrac12$.
::::
:::: used
- Section [[s-tg-route]], as the alternative last link.
::::
:::::

Three remarks place this shortcut. First, it uses less than the source's argument: no mollifier, no Montel, no limit of the prime sum, no archimedean term, and no separate appeal to the functional equation, because the zeros on both sides of the line are in $Z^{\mathrm{off}}_a$ and Weil's formula already contains the functional equation. What it uses instead is Weil's explicit formula for the same test functions, a classical theorem with a separate proof [@weil1952], which the source also proves in its own normalization. Second, the two routes are the same mathematics seen from two sides: in the source's argument the prime sum stands in for "all zeros" through the poles of $-\zeta'/\zeta$, and in ours Weil's formula says so outright. Third, any family whose Mellin transforms have a pole that can be moved to an arbitrary point would serve; we use $h_0(t)t^{-z}$ because it shows the poles directly through [[eq-tg-H]] and is already at hand from [[t-tg-rh]].

## Why positivity is never used {#s-tg-positivity}

Chapter [[weil-positivity]] reduced the hypothesis to an inequality: by Weil's criterion [[t-wp-criterion]], the hypothesis holds exactly when $W(f*\tilde f)\ge0$ for every test function $f$. Route A, in Part IV, is built on an inequality: its note speaks of the positivity of $W$ on particular test functions, and its formal proof establishes a one-sided upper bound on a smoothed sum over primes ([[landau-endgame]]). Route M proves no inequality at all, and the source stresses in a paragraph of its own that Weil's criterion is not used [@masullo, §1.4.6, p. 30], and explains elsewhere why it could not be [@masullo, p. 35]. The body of the draft is not consistent with its introduction on this point: a later subsection on multiplicities, whose footnote says it needs correcting, calls the main theorem on zeros a consequence of the Trace Formula "combined with the Positivity Criterion" [@masullo, §14.1.2, p. 528], and p. 533 says the same. This page follows the introduction, whose endgame is the one given in this chapter and uses no positivity.

The reason is structural, and over $\QQ$ it is one line. The Trace Formula needs $\varphi(1)=0$. Weil's criterion is about the functions $f*\tilde f$, which in chapter [[weil-positivity]] satisfy $(f*\tilde f)(x)=\int_0^\infty f(xy)\overline{f(y)}\,\dd y$. Translated to this part's normalization by [[eq-tf-conversion]], the function is $\varphi(t)=t^{1/2}(f*\tilde f)(t)$, and
$$
\varphi(1)=(f*\tilde f)(1)=\int_0^\infty\lvert f(y)\rvert^2\,\dd y,
$$
which is positive unless $f=0$. So the only function of Weil's form to which the Trace Formula applies is $0$ [@masullo, p. 35]. The source adds that the condition $\varphi(C_F^1)=0$ cannot be removed before the hypothesis is proved: the Trace Formula does hold for every test function once all zeros are known to be on the line, but only a posteriori [@masullo, p. 30].

The contrast with chapter [[weil-positivity]] is between a quadratic form and a linear identity. Weil's criterion asks for a sign of $\sum_\rho M\varphi(\rho-\tfrac12)$ on a cone of test functions, and an off-line zero would show up as a negative value. The Trace Formula asks for nothing of the sort: it is an equality, and an off-line zero would show up as a term present in one formula and absent from another. The source compares the avoidance of positivity to Deligne's proof of the Weil conjectures, which went through families instead of the positivity of an intersection pairing [@masullo, pp. 30, 35]. In the same comparison, the input that plays the role of Deligne's non-vanishing on the edge of the critical strip is the non-vanishing of $\zeta$ on $\Re s=1$ from chapter [[zeros]], which the route uses to pass from $S$-local to global statements [@masullo, §1.4.7, pp. 30 to 31].

## The hypothesis as a statement about topology {#s-tg-topology}

The source titles one paragraph of its introduction "GRH is a topological phenomenon" [@masullo, §1.4.8, p. 31]. The proof above shows what this means. Two trace formulas have the same geometric side, because in each of the topologies involved the geometric side comes out as Weil's sum over the places. They differ in their spectral sides, because the spectral side is the trace on functions modulo theta sums, and which zeros survive in that quotient depends on which point evaluations $M\phi\mapsto M\phi(\rho-\tfrac12)$ are continuous. In a fine topology, the one in which R. Meyer had earlier computed the trace by infinite Euler products, every evaluation is continuous, every zero survives, and the trace formula is Weil's explicit formula [@masullo, p. 32]. In the coarse Hilbert space $W_a$ of chapter [[strip-topology]], only the evaluations inside the strip are continuous, and only those zeros survive. The geometric side is the same in both. So the zeros outside the strip have to contribute nothing in the fine topology too, and the two proofs above show that this means there are none.

The source insists on the order of the logic. The topology is not chosen by looking at zeros: the norms with weight $\max(t^{2a},t^{-2a})$ are chosen by asking what the computation of the geometric side truly needs [@masullo, p. 36], and the orbital bases and the $S$-local cutoffs have to live in the completed space. The source says that the zeros are never an input to any construction, that they stay passive, and that they are casualties of the topology of the normed space [@masullo, pp. 35 to 36]. The degenerate case $a=0$, the line itself, no longer leads to a trace formula [@masullo, p. 36], which is why the endgame works with strips of positive width that shrink, and never with the line.

Read this way, the hypothesis is the statement that the coarse topology loses nothing. A zero off the line would be a functional that the fine topology sees and every thin strip does not, and the Trace Formula says that the geometric side cannot tell the two topologies apart. The source compares the shrinking of the strip to Deligne's tensor-power trick, which enlarges a zero-free region step by step [@masullo, p. 31].

## Why the method stops at function fields {#s-tg-function-fields}

For a curve $C$ over a finite field $\FF_q$, chapter [[function-fields]] stated the hypothesis as the bound $\lvert N_n-q^n-1\rvert\le2g\,q^{n/2}$, and chapter [[stepanov]] proved it by Stepanov's method: an auxiliary function that vanishes to high order at every rational point, a degree count, and the Frobenius map, which turns the points over $\FF_{q^n}$ into the fixed points of an algebraic map. The source asks whether its own method gives a second proof there, and answers no [@masullo, §14.2, pp. 534 to 536].

The reason is in the Euler product. For a function field the local factors are $(1-\lvert k(x)\rvert^{-s})^{-1}$ over the closed points $x$ of the curve, and every residue field size $\lvert k(x)\rvert$ is a power $q^{d}$ of $q$. So every reciprocal factor $1-q^{-ds}$ vanishes at all the points $s=2\pi ik/\log q$, $k\in\ZZ$, and the factors share infinitely many zeros. Over $\QQ$, chapter [[primes-as-circles]] showed that $1-p^{-s}$ and $1-p'^{-s}$ share only $s=0$ for distinct primes, because the logarithms of primes are linearly independent over $\QQ$ ([[t-pc-polar]]). That fact is what lets the orbital quotients of different primes be cut one at a time without interfering. Over a function field the overlaps would have to be corrected by test functions whose Mellin transforms vanish to unbounded order at a point, and the only such holomorphic function is $0$. The source concludes that the topology which makes the computation possible there is not normable, and that the resulting trace formula would give back Weil's explicit formula and nothing more, as R. Meyer's representation-theoretic proof of the explicit formula does [@masullo, p. 535].

The geometry of the plane changes too. Over a function field the Mellin variable lives on $q^{-s}$, so the vertical strips of this route become annuli of finite area, and the components of the space of quasi-characters are not simply connected [@masullo, p. 33]. The source's broader reasons for "yes" over number fields and "no" over function fields are the archimedean place, which gives the function spaces their analysis, the solenoid quotients built from it, and the linear independence of the $\log p$ [@masullo, pp. 33 to 35].

So the two settings trade places. For curves over $\FF_q$ the hypothesis has a proof, by Weil and in Stepanov's elementary form, whose engine is Frobenius, an operator the integers lack, as chapter [[stepanov]] emphasized at its end. Over $\QQ$, Route M gets its proof from the very features a function field lacks: an archimedean place and primes whose logarithms do not line up. Route A, in Part IV, takes the other path and looks for a substitute for Stepanov's mechanism over $\ZZ$.

::::: figure {#f-tg-annulus viz="tg-strip-annulus" height="440"}
Over the rationals the reciprocal Euler factors $1-p^{-s}$ of different primes share only the point $s=0$, while over a function field all the factors $1-q^{-ds}$ share every point $2\pi ik/\log q$, which on the annulus of $q^{-s}$ is one point repeated forever.

```vizspec
Purpose: contrast the zero sets of the reciprocal Euler factors in the two settings.
Scene: two panels.
  Left panel "number field": the vertical line Re s = 0, Im s in [-40, 40]. For each prime p in a chosen set
  draw the zeros 2 pi i k / log p of 1 - p^(-s) as dots in that prime's color (2, 3, 5, 7, 11 in five muted
  shades), slightly offset horizontally per prime so overlaps are visible. Mark s = 0, the only common point,
  with a red ring.
  Right panel "function field": the same line for the factors 1 - q^(-d s), d = 1..6 (closed points of degree
  d), with zeros 2 pi i k / (d log q). Points shared by all factors, 2 pi i k / log q, get red rings; there are
  infinitely many. Below it, an inset of the annulus: the map s -> q^(-s) sends the strip 0 <= Re s <= 1 to the
  annulus 1/q <= |w| <= 1; draw it with the images of the zeros, where all shared points land on w = 1 and pile
  up there (a growing red dot as d increases).
Controls: checkboxes for the primes on the left; slider q in {2, 3, 4, 5, 7, 8, 9} and slider max degree d
  from 1 to 12 on the right; slider for the visible height.
Motion: adding primes on the left never adds a red ring beyond s = 0; raising d on the right adds dots but every
  red ring stays and the annulus dot grows.
Reader takeaway: independence of the log p keeps the primes from interfering over Q; over a function field all closed
  points share the same circle, which is why the one-prime-at-a-time sieve cannot be run there.
Data: none beyond the formulas.
```
:::::

## What changes in general {#s-tg-general}

For a number field $F$ and a unitary Hecke character $\chi$ the endgame is the same with three changes [@masullo, pp. 28 to 30, 53 to 55]. The test functions transform by $\bar\chi$ on $C_F^1$, and the family is $\chi\cdot(\varphi_{h,\varepsilon,z}\circ\lvert\cdot\rvert_F)$, so the prime side becomes $\sum_v\log q_v\sum_{m\ge1}\chi(\pi_v^m)q_v^{-m/2-mz}$, the logarithmic derivative of the finite part $L_f(z+\tfrac12,\chi)$ of the Hecke $L$-function, up to sign. The fixed cutoff of [[t-tg-rh]] can replace the source's family here too, which is our observation: the norm $q_v$ of every prime ideal is at least $2$, so no $q_v^m$ lies in $(1,2)$, the prime side is unchanged by $h_0$, and the archimedean integrals, real and complex, see the test function only where $\lvert y\rvert_v\ge\tfrac32$, away from the singularity at $y=1$. The pole terms are present only when $\chi$ is trivial on $C_F^1$, which the source records with $\delta\in\{0,1\}$ in (1.4.5) and (1.8.5.1). And the reflection uses the functional equation of the completed Hecke $L$-function from Tate's thesis [@tate1967]. The conclusion is that $L(s,\chi)$ has no zero with $\Re s\ne\tfrac12$, for every number field and every unitary Hecke character. The source does not normalize characters to be unitary in the strong sense, so for a character with $\chi(\tau(t))=t^{ix_0}$ the point of symmetry on the line sits at $s=\tfrac12-ix_0$; the line itself is still $\Re s=\tfrac12$ [@masullo, p. 529]. The analytic inputs beyond the Trace Formula are classical in every case: non-vanishing and polynomial growth of $1/L_f$ on $\Re s=1$, the convexity bound, the count of zeros up to height $T$, and horizontal segments on which $1/L_f$ grows polynomially [@masullo, pp. 30 to 31].

## Route M in one page {#s-tg-route}

The whole route, for $\zeta$ over $\QQ$, is a chain of ten links. Each names the chapter where it is explained and the source's location.

1. **Adeles** ([[adeles]]). Every completion of $\QQ$ at once: $\RR$ and the $\QQ_p$, the adeles $\AA$ and ideles, and the idele class group $C_\QQ\cong\RR_{>0}\times\hat\ZZ^\times$, on which a function of the norm is a function on $\RR_{>0}$ [@masullo, App. A.1].
2. **Theta sums and zeta** ([[tate-theta]]). $\Theta_g(t)=\sum_{n\ne0}g(nt)$ is the adelic theta function of $g\otimes\bigotimes_p\mathbf 1_{\ZZ_p}$, its symmetry is Poisson summation, and its Mellin transform is $2\zeta(s)Mg(s)$. Weighted by $t^{1/2}$ and with $g(0)=0=\int g$, the theta sums $V_g=t^{1/2}\Theta_g$ have Mellin transforms $\xi(z+\tfrac12)$ times entire functions, a function in $S_E(\RR_{>0})$ is such a sum exactly when the jets of its Mellin transform at the points $\rho-\tfrac12$ vanish, and convolution by $\varphi$ acts on those jets with eigenvalues $M\varphi(\rho-\tfrac12)$ [@masullo, pp. 13, 45, Theorem 6.3.2.1].
3. **Primes as circles** ([[primes-as-circles]]). Deleting the multiples of $p$ from a theta sum multiplies its Mellin transform by $1-p^{-s}$, and the quotient is the space of functions on a circle of length $\log p$, where the trace of convolution is $\log p\sum_k\varphi(p^k)$, which is $0$ when $p$ is beyond the support of $\varphi$. Different primes do not interfere [@masullo, Ch. 7].
4. **The strip topology** ([[strip-topology]]). In the Hilbert space $W_a$, evaluation of Mellin transforms is continuous exactly inside the strip $\lvert\Re z\rvert<a$, so the quotient by the closure of the theta sums keeps only the zeros with $\lvert\beta-\tfrac12\rvert<a$, and the spectral trace is $\sum_{\lvert\beta-1/2\rvert<a}m_\rho M\varphi(\rho-\tfrac12)$ [@masullo, Ch. 9 and 10].
5. **The kernel and its diagonal** ([[cutting-the-kernel]]). The kernel $\varphi(x/y)$ splits into spectral and geometric parts, and the diagonal mass of the geometric part is minus the spectral trace [@masullo, §12.1].
6. **The sieve** ([[cutting-the-kernel]]). Lifted to the ideles, the geometric kernel is cut along the strata "unit at the first $k$ primes", each slice acts on an orbital quotient, and every slice for $p>Y$ has trace $0$. What remains is an $S$-local kernel [@masullo, Ch. 11].
7. **The $S$-local trace** ([[trace-formula]]). By Connes's computation, the $S$-local diagonal mass is the sum of Weil's local terms at the places of $S$, with the weight $\tfrac12$ forced by the match between additive and multiplicative measures [@masullo, Theorem 12.4.1.1, p. 514].
8. **The Trace Formula** ([[trace-formula]]). Weil's prime sum plus the archimedean term equals the pole terms minus the zeros in the strip, for every test function with $\varphi(1)=0$ and every $a>0$ [@masullo, Theorem 12.5.1.1, p. 519].
9. **The endgame** ([[trace-to-grh]]). The family $h_0(t)t^{-z}$ turns the prime side into $-\zeta'/\zeta(z+\tfrac12)$, which has a pole at every zero, while the other side has poles only in the strip; or, in our shorter route, subtracting the Trace Formula from Weil's formula leaves the off-strip zeros summing to zero against every test function, which forces them to be absent [@masullo, pp. 28 to 30].
10. **The conclusion.** No zero lies outside any strip of positive width around the critical line, so every nontrivial zero of $\zeta$ has real part $\tfrac12$, and the same chain proves the hypothesis for every Hecke $L$-function of every number field.

Classical results enter at four points: Weil's explicit formula ([[weil-positivity]]) for the left side and for the shorter route, the functional equation ([[zeta-continued]]) for the reflection, the count of zeros and the absence of zeros on $\Re s=1$ ([[zeros]]) for convergence and for passing from $S$-local to global, and Montel's theorem in the source's form of the endgame.

::::: figure {#f-tg-route viz="tg-route-map" height="460"}
Route M is a chain in which every link but the last computes one side of a single trace, and the last compares the result with Weil's explicit formula.

```vizspec
Purpose: a dependency map of Route M that the reader can click through.
Scene: ten nodes in a vertical chain (two columns at desktop width, one at phone width), labeled 1 Adeles,
  2 Theta sums and zeta, 3 Primes as circles, 4 Strip topology, 5 Kernel and diagonal, 6 Sieve, 7 S-local
  trace, 8 Trace Formula, 9 Endgame, 10 Conclusion. Edges: 1->2, 2->3, 2->4, 3->6, 4->5, 5->6, 6->7, 7->8,
  4->8 (spectral side), 8->9, 9->10. Side nodes for classical inputs in muted gray: "Weil's explicit formula"
  -> 8 and 9, "Functional equation" -> 9, "Zero count, no zeros on Re s = 1" -> 3 and 9, "Connes's local
  computation" -> 7. Color the spectral path (2, 4, 5) teal, the geometric path (3, 6, 7) gold, and the
  meeting point 8 and the endgame 9, 10 violet.
Controls: hover or tap a node to show a two-line summary and the chapter it lives in; a toggle "shorter route"
  that reroutes 9 to draw an edge from "Weil's explicit formula" directly and greys out the archimedean and
  prime-limit sub-steps.
Motion: none beyond highlighting the path from the hovered node to node 10.
Reader takeaway: the spectral and geometric computations meet once, in the Trace Formula, and the hypothesis
  follows from a single comparison with Weil's formula.
Data: the node texts above.
```
:::::

::: recap
- The family $t^{-z}\mathbf 1_{t>1}$ turns the prime side into $-\zeta'/\zeta(z+\tfrac12)$, with a pole at every zero; the Trace Formula gives the same function poles only at the zeros in the strip ([[eq-tg-heuristic]]).
- The source's endgame runs through smoothed truncations, Montel's theorem, the limit of the prime sum, analytic continuation, $a\to0$, and the functional equation (pp. 28 to 30). Over $\QQ$, a truncation that stays fixed near $t=1$ makes every limit converge outright, and [[t-tg-rh]] proves the hypothesis.
- Our shorter route [[t-tg-subtraction]] subtracts the Trace Formula from Weil's explicit formula: the off-strip zeros sum to zero against every test function, and the family $h_0(t)t^{-z}$ shows that this forces them to be absent.
- Positivity is never used, and cannot be, because Weil's functions $f*\tilde f$ never vanish at $1$. The proof is an identity compared with an identity.
- The hypothesis appears as a statement about topology: the geometric side cannot tell a thin strip from the whole plane, so the zeros outside every strip are absent.
- The method does not reach function fields, where the Euler factors share infinitely many zeros, and where chapters [[function-fields]] and [[stepanov]] proved the hypothesis with Frobenius instead.
- Route M is the ten-link chain of section [[s-tg-route]]. Part IV follows Route A, which rests on a one-sided inequality where Route M uses none.
:::
