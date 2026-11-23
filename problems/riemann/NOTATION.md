# Riemann Hypothesis: notation

One meaning per symbol for the whole page. The main session owns this file. If you need a symbol that is not
here, use the standard one, and list it in your report so it can be added.

## Numbers and counts

| Symbol | Meaning |
| --- | --- |
| $p$ | a prime number |
| $n, m, k$ | positive integers |
| $x, X$ | a real number, usually large: how far we count |
| $\pi(x)$ | the number of primes $p \le x$ |
| $\mathrm{Li}(x)$ | $\int_2^x \dd t/\log t$ |
| $\Lambda(n)$ | von Mangoldt function: $\log p$ if $n = p^k$, and 0 otherwise |
| $\psi(x)$ | Chebyshev function $\sum_{n \le x} \Lambda(n)$ |
| $\mu(n)$ | Moebius function |
| $\log$ | natural logarithm |
| $f(x) = O(g(x))$ | $\lvert f(x)\rvert \le C g(x)$ for a constant $C$ and all large $x$ |
| $f \sim g$ | $f/g \to 1$ |
| $\vartheta(x)$ | Chebyshev's first function $\sum_{p \le x} \log p$ (the letter $\theta$ is kept for Jacobi's theta) |
| $\gamma_E$ | Euler's constant $0.5772\ldots$ (the letter $\gamma$ is kept for the height of a zero) |
| $E(x)$ | the error $\psi(x) - x$ |
| $E_\pi(x)$ | the error $\pi(x) - \Li(x)$ |
| $J(x)$ | Riemann's count $\sum_{k \ge 1} \pi(x^{1/k})/k$, which weights a prime power $p^k$ by $1/k$ |
| $M$ | Mertens's constant $0.2614\ldots$ in $\sum_{p \le x} 1/p = \log\log x + M + o(1)$ (chapters 1 and 2 only) |
| $\phi(q)$ | Euler's totient, the number of residues modulo $q$ coprime to $q$ (the test function of Part III is $\varphi$) |

## Complex analysis

| Symbol | Meaning |
| --- | --- |
| $s = \sigma + it$ | the complex variable, real part $\sigma$, imaginary part $t$ |
| $\rho = \beta + i\gamma$ | a nontrivial zero of $\zeta$ or of an L-function |
| $\zeta(s)$ | the Riemann zeta function |
| $\Gamma(s)$ | the Gamma function |
| $\xi(s)$ | the completed zeta function $\tfrac12 s(s-1)\pi^{-s/2}\Gamma(s/2)\zeta(s)$ |
| $\theta(t)$ | Jacobi theta function $\sum_{n \in \ZZ} e^{-\pi n^2 t}$ for $t > 0$ |
| $\hat f$ | Fourier transform, $\hat f(y) = \int_{\RR} f(x) e^{-2\pi i x y}\,\dd x$ |
| $N(T)$ | the number of nontrivial zeros with $0 < \gamma \le T$ |
| $\Theta$ | the supremum of the real parts of the nontrivial zeros |
| $\eta(s)$ | the alternating series $\sum_{n \ge 1} (-1)^{n-1} n^{-s}$ |
| $\mathcal S(\RR)$ | the Schwartz class: smooth functions that decay, with all derivatives, faster than any power |
| $\mathcal M f(s)$ | Mellin transform $\int_0^\infty f(x)\,x^{s}\,\dd x/x$ |
| $\operatorname{wind}(\kappa, a)$ | the winding number of a closed contour $\kappa$ around the point $a$ |
| $\Pi_N(s)$ | the partial Euler product over the first $N$ primes |
| $P(s)$ | the prime zeta function $\sum_p p^{-s}$ |
| $S_N(s)$ | the partial sum $\sum_{n \le N} n^{-s}$ |
| $\omega(t)$ | $\sum_{n \ge 1} e^{-\pi n^2 t} = \tfrac12(\theta(t) - 1)$ |
| $\Phi(s)$ | $\pi^{-s/2}\Gamma(s/2)\zeta(s)$, the completed zeta function before the factor $\tfrac12 s(s-1)$ |
| $\int_{(c)}$ | the integral up the vertical line $\Re s = c$ |
| $\varphi \star f$ | multiplicative convolution $\int_0^\infty \varphi(t) f(x/t)\,\dd t/t$ |
| $\theta_{\mathrm{RS}}(t)$ | the Riemann and Siegel phase, the argument of $\pi^{-it/2}\Gamma(\tfrac14 + \tfrac{it}{2})$ |
| $Z(t)$ | Hardy's function $e^{i\theta_{\mathrm{RS}}(t)}\zeta(\tfrac12 + it)$, real for real $t$ |
| $E_N(T)$ | the remainder in the count of zeros, $\tfrac1\pi \arg\zeta(\tfrac12 + iT)$ (often written $S(T)$; here $S$ is the smoothed sum) |
| $S(X)$ | the smoothed sum $\sum_{n \le X} \Lambda(n)(X/n - 1)$ of chapter 7 |

## Characters and L-functions

| Symbol | Meaning |
| --- | --- |
| $\chi$ | a Dirichlet character modulo $q$, and later a Hecke character |
| $L(s, \chi)$ | its L-function $\sum_n \chi(n) n^{-s}$ |
| $\psi(x; q, a)$ | $\sum_{n \le x,\ n \equiv a \bmod q} \Lambda(n)$ |
| $\chi_{5,j}$ | the characters modulo 5 in the worked example of chapter 7 |
| $\xi(s, \chi)$, $\xi_K(s)$ | the completed L-function of a character, and the completed Dedekind zeta function of a field $K$ |

## Finite fields and curves (chapters 9 and 10)

In these chapters $q$ is a prime power and not a modulus.

| Symbol | Meaning |
| --- | --- |
| $\FF_q$ | the field with $q$ elements |
| $C$ | a smooth projective curve over $\FF_q$ |
| $g$ | its genus |
| $N_n$ | the number of points of $C$ with coordinates in $\FF_{q^n}$ |
| $Z(C, u)$ | the zeta function of $C$ in the variable $u = q^{-s}$ |
| $\alpha_1, \dots, \alpha_{2g}$ | the inverse roots of the numerator of $Z(C, u)$ |

## Test functions (chapter 8 onward)

| Symbol | Meaning |
| --- | --- |
| $f, h$ | test functions |
| $\tilde f$ | the transposed conjugate fixed in chapter 8 |
| $f * h$ | convolution |
| $W(f)$ | Weil's functional |
| $\mathcal M f(s)$ | Mellin transform $\int_0^\infty f(x)\,x^s\,\dd x/x$ of a test function |
| $W_p(f)$, $W_\infty(f)$ | the term of Weil's functional at a prime $p$, and at the infinite place |
| $\mathbf 1_S$ | the indicator function of a set $S$ |

## Route one: the trace formula (chapters 11 to 17)

The source for this route (Masullo) reuses letters. The page fixes the following, and every chapter of Part III
uses exactly these. Where a symbol differs from the source, the "source" column says how.

| Symbol | Meaning | Source |
| --- | --- | --- |
| $t, x, y$ | points of $\RR_{>0}$, the multiplicative line, with measure $\dd t/t$ | $g$, $\lvert g\rvert$ |
| $z = s - \tfrac12$ | the shifted complex variable: the critical line is $\Re z = 0$ and a zero $\rho$ sits at $z = \rho - \tfrac12$ | same |
| $m_\rho$ | the multiplicity of the zero $\rho$ | $N(\rho)$ |
| $\varphi$ | a test function on $\RR_{>0}$: smooth, compactly supported, usually with $\varphi(1) = 0$ | same |
| $Y$ | a bound on the support: $\operatorname{supp}\varphi \subset (1/Y, Y)$ | $T$ |
| $M\varphi(z)$ | Mellin transform $\int_0^\infty \varphi(t)\,t^{z}\,\dd t/t$ | $M(\varphi)$ |
| $g$ | an even Schwartz function on $\RR$ | $f_\infty$ |
| $\Theta_g(t)$ | the theta sum $\sum_{n \ne 0} g(nt)$ | $\Phi_F(f)$ |
| $A(\varphi)$ | convolution: $(A(\varphi)\psi)(x) = \int_0^\infty \varphi(t)\,\psi(x/t)\,\dd t/t$ | same |
| $a > 0$ | the half-width of the strip $\lvert\Re z\rvert < a$ | $a$ in Ch. 1, $\alpha$ in Ch. 10 to 12 |
| $W_a$ | the Hilbert space with norm $\lVert\phi\rVert_a^2 = \int_0^\infty \lvert\phi(t)\rvert^2 \max(t^{2a}, t^{-2a})\,\dd t/t$ | $W^{0,2}_{[-a,a]}(\RR_{>0})$ |
| $\lambda > 1$ | the period of the toy circle $\RR_{>0}/\lambda^{\ZZ}$ | $\gamma$ |
| $D_p$ | the operator that deletes the multiples of $p$ from a theta sum: $\sum_{n\ne0} g(nt) \mapsto \sum_{p \nmid n} g(nt)$ | $\mathrm{PV}_p$ |
| $k(x, y)$ | a kernel on $\RR_{>0} \times \RR_{>0}$; $k_{\mathrm{spec}}$ and $k_{\mathrm{geom}}$ are its spectral and geometric parts | same |
| $\QQ_p$, $\ZZ_p$, $\ZZ_p^\times$, $\lvert x\rvert_p$ | the $p$-adic numbers, integers, units, and absolute value | same |
| $\AA$, $\AA^\times$ | the adeles and ideles of $\QQ$ | $\mathbf A_F$, $\mathrm{GL}_1(\mathbf A_F)$ |
| $C_\QQ$ | the idele class group $\AA^\times/\QQ^\times \cong \RR_{>0} \times \hat\ZZ^\times$ | $C_F$ |
| $S$ | a finite set of places: $\infty$ and the primes $p \le Y$ | same |
| $F$, $v$, $q_v$ | a number field, a place of it, and the size of the residue field at a finite place | same |
| $Mg$ | the Mellin transform of $g$ | same |
| $V_g = t^{1/2}\Theta_g$ | the weighted theta sum | the weight $\lvert\cdot\rvert^{1/2}$ on theta functions |
| $\mathcal V$ | the space of weighted theta sums | $\lvert\cdot\rvert^{1/2} H_{0,\mathrm{cont}}$ |
| $\mathcal H = S_E/\mathcal V$ | the fine quotient: functions modulo theta sums | $H_F$ |
| $\mathcal H_a = W_a/\overline{\mathcal V}$ | the strip quotient | $\mathcal H_{F,a,I}$ |
| $S_E$ | functions on $\RR_{>0}$ whose product with every power of $t$ is Schwartz in $\log t$ | $S_E(C_F)$ |
| $AS(\CC)$ | entire functions that are Schwartz on every vertical strip | same |
| $J_\rho$ | the jet at the zero $\rho$: the values of a Mellin transform and its first $m_\rho - 1$ derivatives at $z = \rho - \tfrac12$ | $\delta_z^{(m)}$ |
| $g_\star$, $g_c$ | the two worked example functions of chapters 12 and 13 | ours |
| $\operatorname{bump}$ | the bump function $e^{-1/(1-x^2)}$ on $(-1,1)$ | ours |
| $E_p$ | the orbital quotient at $p$: theta sums modulo the image of $D_p$ | $E_{S_p}$ |
| $z_m$, $e_m$ | the points $2\pi i m/\log\lambda$ and the basis functions $t^{z_m}$ on the circle | same |
| $P^{\mathrm{geom}}$, $P^{\mathrm{spec}}$ | the projections of $W_a$ onto $\overline{\mathcal V}$ and onto its complement | same |
| $R$ | the shell parameter: the region $t \ge 1/R$ | $\Lambda$ |
| $\AA_S$, $J_S$ | the $S$-adeles $\RR \times \prod_{p \le Y}\QQ_p$, and the $S$-ideles modulo $S$-units | $\mathbf A_{F,S}$, $J_{F,S}$ |
| $\varphi_z$ | the endgame family $t^{-z}\mathbf 1_{t>1}$ | same |
| $h_0$ | the fixed cutoff near $t = 1$ in chapter 17 | ours |
| $J_\varepsilon$ | the mollifier in the source's version of the endgame | $\rho_\varepsilon$ |

The symbol $\gamma$ stays the imaginary part of a zero, $T$ stays a height in the critical strip, and $N$ is
never a multiplicity.

## Route two: Stepanov's method over the integers (chapters 18 to 25)

The Lean code uses short names that clash with the page's symbols (it writes $\psi$ for a character, `k` for a
rank, `T` for a prime, and `e` for a tower level). The page fixes the following, and chapters 18 to 25 use exactly
these. A letter that a chapter uses only inside one section or example is declared local there and is not listed.
The scale dictionary, with every size at scale $x$, is the table [[ml-scales]] of chapter 21.

### The endgame (chapter 19)

| Symbol | Meaning | In the code |
| --- | --- | --- |
| $S(X)$ | the smoothed sum $\sum_{n \le X} \Lambda(n)(X/n - 1)$ of chapter 7 | part of `Formalism.Gz` |
| $G_0(X)$ | $S(X) - X\log X + (1+\gamma_E)X$: the smoothed sum with its main term removed | `Formalism.Gz`, `An.G` |
| $g_\chi(X)$ | for $\chi \ne 1$: $\sum_{n \le X} \chi(n)\Lambda(n)(X/n - 1) + X\,\frac{L'}{L}(1, \chi)$ | `An.gChi` |
| $G_\chi$ | $G_0$ for $\chi = 1$ and $g_\chi$ otherwise | `Gchi` |
| $\chi$, $r$ | a primitive Dirichlet character, and its order | `PChar` (the code's $\psi$), `o` |
| $(\chi^j)^*$ | the primitive character inducing $\chi^j$, $0 \le j \le r-1$ | |
| $G_r(X)$ | the cyclic combination $G_0 + \frac{1}{3r+1}\sum_{j=1}^{r-1} \Re\, g_{(\chi^j)^*}$ | `Level.Gm` |
| $G$, $a_i$ | the combined sum of a weighted family, and its positive weights | |
| $C_\chi$ | the constant term of $-\frac{L'}{L}(s,\chi)$ at $s = 0$ for even $\chi$ | |
| $\alpha$ | an exponent: a bound $CX^\alpha$, a zero-free half-plane $\Re s > \alpha$ | `θ` |
| $\varepsilon$ | a small positive number, $\varepsilon < \tfrac1{52}$; the contract is $\alpha = \tfrac12 + 9\varepsilon$ | `eps` |
| $[Y, Y^{1+\delta}]$, $U$ | a window of scales, $\delta = \tfrac12$ on the spine, and $Y = e^U$ | windows |
| $\mathsf G(u)$ | $G(e^u)$, the combined sum on the logarithmic scale | `gm` |
| $\Phi(s)$ | the Laplace transform of $\mathsf G$; in Part IV only, never the subgroup $\Phi$ of chapter 22 or a function of chapter 4 | `Φ` |
| $\mathcal Z$, $c_\rho$, $w_\rho$ | the poles of $\Phi$, a residue, a weighted multiplicity | |
| $\sigma$, $k$ | the real point of the Taylor expansion, and the Taylor index | `σ`, `k` |
| $b_k(z)$, $K_k(u)$ | $(-1)^k\Phi^{(k)}(z)/k!$, and the Gamma kernel $u^ke^{-\sigma u}/k!$ | |
| $\lambda$, $\kappa$, $C_0, \dots, C_4$ | constants of the tail, growth, window, and lower bounds | $\kappa$ is `M` |
| $\nu$ | in chapter 19 only, the small exponent in $e^{\nu U}$ | `η` |
| $d$, $d'$ | distance to the nearest pole, and a slightly larger radius | |
| $\mathcal N_k$ | a count in the numerical example of the Taylor argument | |

### Forms, lattices, and the chain (chapters 20 and 21)

| Symbol | Meaning | In the code |
| --- | --- | --- |
| $E$, $E^+$ | a CM field and its maximal totally real subfield | `E` (`K` in the mass ratio) |
| $\chi_{E/E^+}$, $L_E(M)$ | the quadratic character of $E/E^+$, and the Euler product of Siegel's mass ratio | |
| $L, L'$, $\operatorname{Aut}(L)$ | lattices, and the finite automorphism group of a definite lattice | |
| $\mathcal G$ in chapter 20 | a genus of lattices; $\mathcal A(\mathcal G)$ the forms on it | |
| $\xi$ | a class group character | |
| $X_0, \dots, X_m$ | the totally definite Hermitian spaces of the chain, $X_j$ of rank $N_j$; the record has no embedding of $X_j$ in $X_{j+1}$, only $X_j$ into $Y_j$ and $X'$ into $X_m$ | `Spaces.X` |
| $U(X_j)$ | the unitary group of $X_j$ | |
| $N_0$, $c$, $N_j$ | the rank of $X_0$, the odd integer with rank step $c+1$, and $N_j = N_0 + j(c+1)$ | `R.k`, `R.t` |
| $\mathcal C_j$, $w_j$, $K_j$, $\mathcal L_j$ | class set of $X_j$, weights $1/\lvert\operatorname{Aut}\rvert$, kernel, one step of the chain | `ColumnChain` |
| $m$ | the length of the chain, between $x^{1/2-\varepsilon/16}$ and twice that | `RankVal` |
| $x$, $b$, $a$, $a_T$ | the scale, $b = e^{x^\varepsilon}$, $a = xb$, and the integer near $a$ | `Scale.x`, `Scale.b`, `L` is $x^\varepsilon$ |
| $A$, $n$ | the datum's finite abelian frame group and its order; from chapter 20's [[df-code]] on, $n$ is this order | `Frame.A`, `Frame.ord` |
| $n_W$ | the integer `nWv` in the rank equation | `nWv` |
| $P$ | the large auxiliary prime at which forms are ramified | `T` |
| $v_w$, $N(w)$, $\varpi_w$ | valuation at a prime ideal, its norm, the weight $\log N(w)/[F:\QQ]$ | `lw` |
| $\mathcal P$, $\mathcal P_C$, $d_u$ | a Bessel period, the period map, and the dimension of ramified forms | `PhiC` |
| $\gamma_\ell$, $\rho_\ell$ | the odd-level and even-level series of $\ell$ | `gam`, `rho` |
| $J(y)$, $n_0$, $n_1$ | the jet of determinant powers of `ThmP`, and its two size parameters | `LamP` |

### The count and the Galois side (chapter 22)

| Symbol | Meaning | In the code |
| --- | --- | --- |
| $\varrho$, $n$ in the Galois sections | a Galois representation and its dimension, local to those sections | `r`, `a` |
| $\chi_{\mathrm{cyc}}$ | the $\ell$-adic cyclotomic character | |
| $\mathcal G$ in chapter 22 | the group $(\ZZ/2)^2 \times A = \Gal(E/\QQ)$ of the host's CM field | `E0 × H`, `HostRaw.gal`, `toE` |
| $\Phi$ in chapter 22 | the index-two subgroup of $\mathcal G$ that fixes $\sqrt{-\mathsf d}$ | `InPhi`, `PhiSet`, `Psi` |
| $\chi_C$ | the character that is $-1$ off $\Phi$, the quadratic character of $\QQ(\sqrt{-\mathsf d})$ | `chC` |
| $f_p$ | the Frobenius element of $p$ in $\mathcal G$ | `ArithData`, `arith` |
| $\mathsf w$, $\mathsf w_g$ | weights on $\Phi$, and one weight value | `w` |
| $\mathcal T$, $A_0$, $u_0$ | the set of shifts in $A$, the averaging subgroup, one of its elements | `TT`, `Frame.A0` |
| $\mathsf L$, $G_{\mathsf L}$ | a level, and its combined sum, which is $G_r$ for the cyclic level | `Level`, `Gm` |
| $\mathrm{ld}$ | the value $\frac{L'}{L}(1,\chi)$ attached to a character | `ell` |
| $\mathsf q$, $\mathsf q_1$, $\mathsf d$ | the auxiliary primes; $\mathsf q_1$ is the host's $\mathsf q$ in `ArithData` | `q`, `ArithData.q1`, `d` |

### The window (chapter 23)

| Symbol | Meaning | In the code |
| --- | --- | --- |
| $\ell$ | the prime of the coefficients in Galois cohomology | `l` |
| $\text{Sha}^1(F, M)$ | the locally trivial classes | `Sha`, `shaLen` |
| $\QQ_\ell/\ZZ_\ell(-k)$, $k$ | the Tate twist, and the twist index $1 \le k < \lfloor x^{401}\rfloor$ | `e` in `VVle` |
| $\nu$ in chapters 18 and 21 to 24 | the level of the 2-power tower, $2^\nu$ between $x^{2+8\varepsilon}$ and twice that | `e` (`PageN`) |
| $\mathcal A$, $\mathcal A^\pm$, $\mathcal A(\omega^i)$ | the $p$-part of a class group, its plus and minus parts, its eigenspaces | |
| $L_j$, $e_0$, $t_j$, $\mathcal B_\chi$ | layers of a cyclotomic tower, $\mu_{\ell^{e_0}} \subset L_0$, the $\ell$-adic valuation of $h(L_j)$, the special odd primes of $\chi$ | |
| $J$, $X_\ast$, $R$ | the window exponent, the threshold of `VWin`, the number of exceptional twists | `J`, `X0`, `R` |
| $s_i$, $D$, $B$, $\eta$, $C_K$ | zeros of the Iwasawa bound, its precision, the ratio of a spoiled interval, a small exponent, the constant of `LemmaK` | |

The letter $X$ without a subscript is a real number as in Part I, and $X_j$ with a subscript is a Hermitian
space. $T$ stays a height in the critical strip. The calligraphic $\mathcal G$ is a genus in chapter 20 and a Galois
group in chapter 22, and each chapter says which; the sans-serif $\mathsf G$ is the logarithmic sum of chapter 19.
The letter $k$ is the Taylor index in chapter 19 and the Tate twist from chapter 22 on. The letter $\nu$ is the
small exponent of chapter 19 and the tower level elsewhere in Part IV, as chapter 21's dictionary notes.

## Colors in figures

| Meaning | Kit color name |
| --- | --- |
| the true arithmetic object (primes, $\pi$, $\psi$) | `gold` |
| the smooth estimate or main term | `blue` |
| zeros and what they contribute | `teal` |
| error, difference, or a thing to notice | `red` |
| the critical line, and by extension the value one half it stands for (the weight $\tfrac12$, the circle of radius $\sqrt q$, the conclusion of a route map) | `violet` |
| supporting geometry, axes, grids | `muted` |
