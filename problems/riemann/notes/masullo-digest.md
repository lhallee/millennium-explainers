# Digest: Masullo, "The Music of the Primes" (Route M)

Source: A. M. Masullo, "The Music of the Primes", 940-page draft, `sources/riemann/masullo.pdf`, read 2026-11-20.
Page numbers are PDF pages, which equal printed pages. "Ch." means a chapter of the monograph; "III.n" means a
chapter proposed here for the explainer. Statements marked **(our reading)** or **(ours)** are this digest's
interpretation or construction, not the author's words.

Notation warning for writers. The source reuses letters. In Ch. 1 and the letter (pp. 11 to 55) the Sobolev degree
is called $s$ or $b$, and the strip is $I=[-a,a]$. In Ch. 10 to 12, $a$ is instead the weight exponent of the
$\theta$-functions (always $a=1/2$ in the end), the strip is $I=[-\alpha,\alpha]$, and $s$ is the Sobolev degree,
which collides with the complex variable. This digest writes $I=[-a,a]$ for the strip, $\sigma_0$ for the Sobolev
degree, $z$ for the complex variable on the shifted plane (so a zero $\rho$ of $L(s,\chi)$ sits at $z=\rho-1/2$),
and keeps the weight at $1/2$.

---

## 1. Main theorems

**Main Theorem (GRH for Hecke L-functions).** For every number field $F$ and every continuous unitary character
$\chi$ of the idele class group $C_F=\mathrm{GL}_1(\mathbb A_F)/F^\times$, the completed Hecke $L$-function
$L(s,\chi)$ has no zeros with $\operatorname{Re}s\ne 1/2$.

- Where stated: only in prose. The conclusion is drawn on p. 30 (end of 1.4.5) and p. 55 (1.8.5.1): $L_f'/L_f(s+1/2,\chi)$
  is holomorphic on $\operatorname{Re}s>0$ except possibly at $s=1/2$, hence $L(s,\chi)$ has no zeros in
  $\operatorname{Re}s>1/2$, and by the functional equation none in $\operatorname{Re}s<1/2$. The generality "all number
  fields, all unitary Hecke characters" is asserted in the acknowledgements (p. 6). Ch. 13, which should state and
  prove it, is a stub (pp. 521 to 522; see Section 9). The normalization is non-unitary: for $\chi$ with
  $\chi(\tau(t))=t^{ix_0}$ the line of symmetry and the "central point" sit at $s=1/2-ix_0$ (p. 529); "the line"
  means $\operatorname{Re}s=1/2$ in every component.
- Cases included: $\chi=1$ gives the Dedekind zeta function $\zeta_F$, $F=\mathbb Q$ with $\chi$ of finite order gives
  Dirichlet $L$-functions, and infinite-order Grössencharacters are included (the CM example on pp. 531 to 532 uses one).
- Where proved: the deduction is pp. 28 to 30 and 53 to 55 from the Trace Formula below.

**Theorem 12.5.1.1 (Trace Formula), p. 519, proof p. 520.** Let $F$ be a number field and $\varphi\in\mathcal D(C_F)$
(smooth, compactly supported) with $\varphi(C_F^1)=0$, where $C_F^1$ is the norm-one subgroup. Then
$$
\sum_{v\ \mathrm{real}}\tfrac12\int'_{F_v^\times}\frac{\varphi(g_v)|g_v|_v^{1/2}}{|1-g_v|}\,d\mu_v
+\sum_{v\ \mathrm{complex}}\tfrac1{2\pi}\int'_{F_v^\times}\frac{\varphi(g_v)|g_v|_v^{1/2}}{|1-g_v|}\,d\mu_v
+\sum_{v\ \mathrm{finite}}\frac{\log q_v}{\mu_v(\mathcal O_{F_v}^\times)}\int'_{F_v^\times}\frac{\varphi(g_v)|g_v|_v^{1/2}}{|1-g_v|_v}\,d\mu_v
$$
$$
=M(\varphi)(|\cdot|_F^{1/2})+M(\varphi)(|\cdot|_F^{-1/2})-\sum_{c\in\Omega(C_F)_I,\ L(c)=0}N(c)\,M(\varphi)(c\,|\cdot|_F^{-1/2}),
$$
where $M(\varphi)(c)=\int_{C_F}\varphi(g)c(g)\,d\bar\mu(g)$, $\int'$ is Weil's principal value, $N(c)$ is the
multiplicity of the zero $c$, and the zero sum runs only over zeros in the interior of the strip
$\Omega(C_F)_I=\{c:\sigma(c)\in 1/2+I\}$. The statement does not fix $I$ or the Sobolev degree; the proof (p. 520)
takes $I=[-\alpha,\alpha]$. The left side is exactly the "geometric side" of Weil's explicit formula, which the
source proves separately as Theorem B.4.4.7 (p. 623) with the zero sum over **all** zeros. The whole content of
the work is that the zero sum can be cut down to a strip of arbitrary width.

**Character-by-character form, p. 28 (1.4.1) and p. 53 (1.8.4.1).** For $\varphi$ of weight $\bar\chi$ on $C_F^1$ the
finite-place term becomes the prime sum
$$
\sum_{v\ \mathrm{finite}}\log q_v\sum_{m\ge1}\Big(\frac{\chi(\pi_v^m)}{q_v^{m/2}}\varphi(q_v^m)+\frac{\bar\chi(\pi_v^m)}{q_v^{m/2}}\varphi(q_v^{-m})\Big),
$$
and the zero sum is $\sum_{\rho,I}N(\rho)\int_{C_F}\chi(g)\varphi(g)|g|_F^{\rho-1/2}\,d\bar\mu(g)$ over zeros with
$\rho-1/2$ in the open strip $|\operatorname{Re}z|<a$.

**Spectral side, Theorems 10.3.1.1 (p. 448), 10.3.2.1 (p. 453), 10.4.2.2 (p. 460), 10.4.2.8 (p. 463).** On the
Hardy-Sobolev completion (Section 4), the convolution operator descends to the quotient by the closure of the
$\theta$-functions, is nuclear there, and its trace is $\sum N_{I,\sigma_0}(\rho)\,M(\varphi)(\dots)$ over zeros in the
strip, with full multiplicity inside the open strip and multiplicity
$\min\{N(\rho),[(\sigma_0-1)/2+1]\}$ on its edges (Theorem 10.2.2.1, p. 446). Truncated versions converge to this
trace as the cutoff grows (10.4.2.2, 10.4.2.8).

**Chapter 13 version, Theorem 13.3.1.1, p. 522 (footnote: "Correct statement").** A second form of the trace
formula, on the line itself ($I=\{0\}$, Sobolev degree $2[F:\mathbb Q]$): for test functions whose Mellin
transforms vanish to order $[F:\mathbb Q]$ at every central point (condition 13.3.1.2), the zero side is
$\sum_{\sigma(c)=1/2}N_{\rm spec}(c)M(\varphi)(\dots)$ with $N_{\rm spec}=\min\{N(c),[F:\mathbb Q]\}$. Theorem 13.3.1.2
("Divisor of $L(s,\chi)$") is announced but blank ("Insert statement"). Section 14.1.2 (p. 528) describes it as:
every nontrivial zero lies on the line, and every non-central zero has multiplicity at most $[F:\mathbb Q]$. See
Section 9 for why writers should not use this version.

**Secondary results stated in the letter.** Theorem 1.7.1.1 on polar multiplicities (p. 35; proved as Theorem
7.1.3.2, p. 324): local Euler factors at places of distinct residue characteristic share at most one pole.
Expectation 1.7.1 on multiplicities (p. 38) is labeled an expectation, not a theorem.

---

## 2. The proof in one page

Fix $F$ and a unitary character $\chi$. Tate's thesis writes $L(s,\chi)$ as the Mellin transform of an adelic
$\theta$-function $\Phi_F(f)(g)=\sum_{\xi\in F^\times}f(\xi g)$, a function on $C_F$ built from a Schwartz-Bruhat
function $f$ on the adeles. If $f(0)=\hat f(0)=0$ these $\theta$-functions decay exponentially in $\log|g|$, and the
space they span is a closed, translation-invariant subspace of the exponentially decaying functions $S_E(C_F)$. Under
the Mellin transform this subspace becomes "entire functions divisible by $L$", so the quotient
$H_F=S_E(C_F)/|\cdot|^{1/2}\{\theta\text{-functions}\}$ is, after Mellin, the space of jets of functions at the zeros
of $L(s+1/2,\chi)$: the divisor exact sequence (pp. 13, 45). Convolution by a test function $\varphi$ acts on $H_F$
with trace $\sum_\rho N(\rho)M(\varphi)(\rho-1/2)$; this is Connes's spectral realization of the zeros, and in this fine
topology it only reproduces Weil's explicit formula, with every zero present (pp. 39, 46 to 47).

The new move is to complete everything in a coarse Hilbert norm, the Hardy-Sobolev norm with weight
$\max(|g|^{2a},|g|^{-2a})$, whose Mellin side is a Hardy space of holomorphic functions on the strip $|\operatorname{Re}z|<a$.
In that space evaluation at $z_0$ is continuous only if $z_0$ lies in the strip (Corollary 9.2.2.5, p. 414). So the
quotient by the closure of the $\theta$-functions only remembers zeros $\rho$ with $|\operatorname{Re}\rho-1/2|<a$,
and the spectral trace is the zero sum restricted to the strip (Ch. 10). The zeros outside are not excluded by any
argument about zeros; they are "victims of the topology" (pp. 35 to 36).

The difficulty is to compute the same trace another way, the geometric way, inside that coarse space, and still get
the full prime sum of Weil's explicit formula. Write the convolution kernel $\varphi(xy^{-1})$, which vanishes on the
diagonal when $\varphi(1)=0$, as spectral kernel plus geometric kernel; the diagonal mass of the geometric kernel is
minus the spectral trace (p. 15). Lift the geometric kernel to the ideles, where the restricted-product structure is
visible, and cut it along the strata "$g_v$ is a unit at the first $k$ primes". Restricting a $\theta$-function to the
next stratum replaces $1_{\mathcal O_v}$ by $1_{\mathcal O_v^\times}$, which on the Mellin side multiplies by the
reciprocal Euler factor $1-\chi(\pi_v)q_v^{-s}$ (Weil's identity, p. 25). Each successive difference therefore acts on a
quotient "functions modulo multiples of $1-q_v^{-s}$", which is a space of functions on a circle
$\mathbb R_{>0}/q_v^{\mathbb Z}$ of length $\log q_v$, with an explicit exponential Schauder basis. In that basis the
trace is computed like a matrix trace, and Poisson summation turns it into $\log q_v\sum_{k}\varphi(\pi_v^k)$, which is
zero as soon as $q_v$ exceeds the support of $\varphi$ (pp. 17 to 19, 51 to 52). So all primes beyond a finite set $S$
contribute nothing, and the bases can be made to live in the coarse completion. What is left is an $S$-local kernel,
whose diagonal mass Connes computed in 1998 with the $S$-adelic Fourier transform: it is Weil's local principal value at
each place of $S$, and the weight $1/2$ is exactly what turns the multiplicative measure into the additive one in that
computation (p. 16). This is the Trace Formula: Weil's full prime-and-place side equals the poles minus the zeros in
the strip.

Finally feed in the holomorphic family $\varphi_z(t)=t^{-z}\mathbf 1_{t>1}$ (smoothed and truncated). The prime side
becomes $-L_f'/L_f(z+1/2,\chi)$, the archimedean terms and the zero sum over the strip are holomorphic for
$\operatorname{Re}z>a$, so $L_f'/L_f(z+1/2)$ continues holomorphically there apart from $z=\pm1/2$. A zero with
$\operatorname{Re}\rho-1/2>a$ would be a pole; there is none. Since $a>0$ is arbitrary, GRH follows (pp. 28 to 30).
Positivity of Weil's functional is never used (p. 30). The inputs about $L$ beyond Tate's thesis are classical:
non-vanishing and polynomial growth of $1/L_f$ on $\operatorname{Re}s=1$, the convexity bound, the count of zeros up to
height $T$, and horizontal lines of controlled growth (pp. 31, 45, 47).

---

## 3. The chain

Difficulty shares are our estimate of where the 940 pages and the new ideas are spent.

**Step 1. Adelic $\theta$-functions and their Mellin transforms.**
Claim: for $f\in\mathcal S(\mathbb A_F)$, $\Phi_F(f)(g)=\sum_{\xi\in F^\times}f(\xi g)$ is continuous on $C_F$, satisfies
the adelic Riemann-Roch identity $\Phi_F(f)(g)=|g|^{-1}\Phi_F(\hat f)(g^{-1})+|g|^{-1}\hat f(0)-f(0)$ (Theorem 2.2.3.2,
p. 82), decays rapidly, and if $f(0)=\hat f(0)=0$ decays like $e^{-N|\log|g||}$ for all $N$ (p. 12; Theorem 2.2.3.4,
p. 82). Its Mellin transform is Tate's zeta integral, meromorphic with simple poles at $c=1,|\cdot|_F$ and the
functional equation $Z(f,c)=Z(\hat f,\hat c)$ (Theorem 3.2.2.1, p. 124). S-local analogs over the S-units (2.3, p. 98).
Uses: nothing earlier. Where: Ch. 2 and 3.1 to 3.3 (pp. 57 to 140). Classical: Tate's thesis [CF, Ch. XV], Poisson
summation, Riemann's $\theta$ proof of the functional equation (p. 117). Difficulty: small (reformulation).

**Step 2. Topology of the spaces of $\theta$-functions (Structure Theorems I to V).**
Claim: $H_{0,\rm cont}(F^\times,\mathcal S(\mathbb A_F))=\mathcal S(\mathbb A_F)/\ker\Phi_F$ and its S-local analog are
complete nuclear Montel strict LF-spaces, colimits of the S-local ones (Theorem 5.2.1.1, p. 230); their isotypes are
nuclear Fréchet (Theorem 5.2.3.1, p. 233; Corollary 6.2.1.2, p. 295); Mellin embeds the S-local isotypes as pairs
of functions tied by the S-local functional equation (Theorem 5.4.1.1, p. 265); strong duals are generated by
eigendistributions $\Delta_F(c)$ (Theorem 5.5.3.4, p. 285); the image of the S-local space is the
$\prod_{v\notin S}\mathcal O_v^\times$-invariants (Theorem 6.1.2.1, p. 288), and for $S$ large with
$\mathrm{Pic}(\mathcal O_{F,S})=1$ the map $p_S$ is an isomorphism on each isotype, so every global $\theta$-function of
weight $\chi$ is $\Phi_F(f_S\otimes\bigotimes_{v\notin S}1_{\mathcal O_v})$ (Fifth Structure Theorem 6.2.1.1, p. 295;
used on pp. 25, 44, 48). Uses: Step 1, Weil's principal value operators (5.3, p. 240), App. C and D. Where: Ch. 5 and 6
(pp. 221 to 310). New as a systematic study (Meyer had the bornologies only, p. 32). Difficulty: large in pages, routine
in ideas.

**Step 3. Divisor exact sequence (global converse theorem).**
Claim: for $\chi|_{C^1}\ne1$ the Mellin transform identifies the weight-$\chi$ $\theta$-functions with
$L(s,\chi)\mathcal O(\mathbb C)\cap AS(\mathbb C)$, and with $((s+it_0)(1-s-it_0))L(s,\chi)\mathcal O(\mathbb C)\cap AS(\mathbb C)$
if $\chi|_{C^1}=1$, where $AS(\mathbb C)$ is the space of entire functions Schwartz on vertical strips (Theorem 6.3.2.1,
p. 304). Hence the exact sequence
$0\to|\cdot|^{1/2}H_{0,\rm cont}(\chi|_{C^1},\mathcal S_0)\to S_E(C_F)(\chi|_{C^1})\to H_F(\chi|_{C^1})\to0$ becomes
$0\to L(s+\tfrac12,\chi)((s+\tfrac12)(s-\tfrac12))^\delta\mathcal O(\mathbb C)\cap AS\to AS\to\prod_{L(z,\chi)=0}\mathbb C^{N(z)}\to0$
(pp. 13, 45), and the dual of the quotient is spanned by jets $\delta_z^{(m)}$ at the zeros (Theorem 7.1.4.2, p. 326).
Uses: Steps 1 and 2; convexity bound (B.1, p. 588); horizontal segments on which $1/L_f$ grows polynomially
(Titchmarsh-type, p. 31); Bohr almost periodicity, Bagchi, or Kronecker-Weyl for finite Euler products (p. 45; B.5,
p. 626). Where: 6.3 and 7.1 (pp. 302 to 332). Classical precursor: Connes's spectral realization (in $L^2$); the
locally convex version is new. Difficulty: moderate.

**Step 4. Periodic Schauder bases (the toy model).**
Claim: for $\gamma>1$, $\mathcal S(\mathbb R_{>0}/\gamma^{\mathbb Z})\cong S_E(\mathbb R_{>0})/\ker\Phi_\gamma$, with
$\Phi_\gamma\phi(x)=\sum_k\phi(\gamma^kx)$, corresponds under Mellin to $AS/(1-\gamma^{-s})AS$; it has the absolute
Schauder basis $t^{2\pi im/\log\gamma}$; convolution by $\varphi$ is nuclear with trace
$\sum_mM(\varphi)(2\pi im/\log\gamma)=\log\gamma\sum_{k\in\mathbb Z}\varphi(\gamma^k)$ by Poisson summation, which is $0$ if
$\operatorname{supp}\varphi\subset(1,\gamma)$ (Example 1.8.1.1, pp. 40 to 41; also pp. 16 to 17, where the factor
$\log\gamma$ is missing). Versions with multiplicity and support conditions on modulated groups (4.4 to 4.6).
Uses: nothing deep. Where: Ch. 4 (pp. 155 to 220). Classical core (Fourier series on a circle, Poisson summation,
Dynin-Mityagin on bases in nuclear spaces, Theorem 4.1.2.6, p. 161). Difficulty: small, but it is the model for
Steps 5 and 11.

**Step 5. Orbital Schauder bases and orbital traces.**
Claim: for $p$ with $S_p\subset S$ ($S_p$ = places above $p$), the orbital subquotient
$E_{S_p}=H_{0,\rm cont}/\mathrm{PV}_{S_p}H_{0,\rm cont}$, where $\mathrm{PV}_v f(x)=f(x)-f(\pi_v^{-1}x)$, carries an
absolute Schauder basis that is a twisted copy of the exponential system, because on the Mellin side $\mathrm{PV}_{S_p}$
is multiplication by $\prod_{v|p}L_v(\chi_v|\cdot|^s_v)^{-1}$ (p. 18; Theorem 7.3.1.6, p. 344; on Paley-Wiener levels,
Theorem 7.3.3.4, p. 360). The trace of convolution on it is
$\sum_{\varepsilon_p}N(\chi|\cdot|^{\varepsilon_p})\int\varphi\chi|g|^{\varepsilon_p}=\sum_{v|p}\frac{\log q_v}{\mu_v(\mathcal O_v^\times)}\sum_{k\in\mathbb Z}\varphi(\pi_v^k)$
(pp. 18 to 19; Theorem 7.4.2.1, p. 367). Two inputs make the basis exist and be global: the polar multiplicity
theorem (Theorem 7.1.3.2, p. 324: Euler factors at distinct residue characteristics share at most one pole, by
$\mathbb Q$-linear independence of the $\log p$), and strong co-primality (Theorem 7.5.0.1, p. 374: the orbital quotient of
$\theta$-functions equals the corresponding quotient of all of $S_E(C_F)$), which uses non-vanishing of $L_f$ on
$\operatorname{Re}s=1$ and polynomial growth of $1/L_f$ there (pp. 30 to 31, 311; Theorem B.6.1.6, p. 640). Archimedean
analog (Theorem 7.4.3.1, p. 368) is "not used" (p. 19). Uses: Steps 2 to 4. Where: Ch. 7 (pp. 311 to 380). New.
Difficulty: large; with Step 11 this is the heart.

**Step 6. Periodic orbits and fixed points.**
Claim: dual basis elements of $E_{S_p}$ are derivatives of eigendistributions supported on the hyperplanes
$H_v^\times=\{x_v=0,\ x_w\ne0\ (w\ne v)\}$, so their "equivariant supports" are quotient stacks
$[\mathbb R_{>0}/F_v^\times]$ with coarse space a loop of length $\log N(\mathfrak p_v)$; archimedean ones are fixed points
$BU_v$ (pp. 20 to 21; Theorems 8.1.0.1, p. 382, and 8.3.0.1, p. 387; App. E). Uses: Step 5. Where: Ch. 8 (pp. 381 to
394). New, realizing Deninger's "local traces". Difficulty: small for the logic; the author says the orbit picture
"helps to organize the trace calculation. Logically, it is not needed" (p. 33). Black-box candidate.

**Step 7. Hardy-Sobolev completions.**
Claim: $W^{\sigma_0}_I(G)$, the completion of $S_E(G)$ in
$\|\phi\|^2=\int_G|\phi|^2\max\{|g|^{-2a},|g|^{2a}\}(1+|\log|g||^2)^{\sigma_0/2}d\mu$, is a Hilbert space whose Mellin
image is a Hardy-Sobolev space of holomorphic functions on the open strip $\mathbb C_{(-a,a)}$ with boundary values
(Proposition 9.2.2.4, p. 414). Point evaluations $u\mapsto u^{(k)}(z_0)$ are continuous for $z_0$ in the open strip,
continuous on the edges only for $k\le[(\sigma_0-1)/2]$ (Corollary 9.2.2.5, p. 414), and not otherwise. The truncated
convolution $M_\rho A(\varphi)$ is nuclear with trace $2\log\Lambda\,\mu_1(G^1)\varphi(1)+o(1)$ (Theorem 9.3.3.5, p. 429).
Uses: App. B and D. Where: Ch. 9 (pp. 395 to 431). The spaces are claimed new (p. 12); the case $I=\{0\}$ is Connes's
Sobolev space (p. 44). Difficulty: moderate.

**Step 8. Spectral side in the coarse topology. (The hypothesis is forced here, part 1.)**
Claim: in $W_I$ the quotient $\mathcal H_{F,I}=W_I(C_F)/\overline{|\cdot|^{1/2}H_{0,\rm cont}}$ has a Markushevich basis
whose coefficient functionals are $\chi(g)|g|^{b+it}(\log|g|)^m$ for zeros $\rho=1/2+b+it$ with $|b|\le a$ only
(Theorem 10.2.2.1, p. 446); convolution is nuclear on it with trace
$\sum_{|\operatorname{Re}\rho-1/2|<a}N(\rho)M(\varphi)(\rho-1/2)$ plus capped edge terms (Theorems 10.3.2.1, p. 453;
10.4.2.2, p. 460; 10.4.2.8, p. 463). Zeros outside the strip do not appear because their jets are discontinuous
functionals on $W_I$ (p. 31, 1.4.8; pp. 35 to 36). Uses: Steps 3 and 7; zero count $O(\log T)$ in boxes (p. 47;
p. 455). Where: Ch. 10 (pp. 433 to 474). New. Difficulty: moderate. This is where an off-line zero is "filtered out".

**Step 9. Kernels and the proto-trace formula.**
Claim: the convolution kernel $\varphi(xy^{-1})$ splits as $k_{\rm spec}+k_{\rm geom}$, with $k_{\rm spec}$ an
$L^2(\nu\otimes\nu^\vee)$ limit of explicit finite-rank kernels and $k_{\rm geom}$ a kernel for $A_I(\varphi)\circ P_\theta$
(pp. 14 to 15, 47 to 48; Theorem 10.4.3.1, p. 466; Definition 10.4.3.7, p. 473). Both have diagonal "smoothenings"
defined by Lebesgue differentiation on LCA groups, and if $\varphi(1)=0$ then
$\int_{C_F}\tilde k_{\rm geom}(x,x)\,d\mu=-\sum_{\rho,I}N(\rho)M(\varphi)(\rho-1/2)$ (1.8.3.6, p. 48; Theorem 12.1.1.3,
p. 502). Uses: Steps 7 and 8; Hardy-Littlewood maximal theorem and Lebesgue differentiation for LCA groups
(Theorems A.5.3.7 and A.5.4.1, p. 582; Hewitt-Ross Vol. II, §44). Where: 10.4, 12.1, 12.2 (pp. 455 to 513).
Classical tools, new use. Difficulty: moderate (measure theory).

**Step 10. Lifting to the ideles and the divisorial stratification.**
Claim: lift $k_{\rm geom}$ to $\mathrm{GL}_1(\mathbb A_F)\times\mathrm{GL}_1(\mathbb A_F)$ with an indentation (a fundamental-domain
cutoff for $F^\times$), so that the diagonal mass becomes $\int_D\sum_{\xi\in F^\times}\tilde K(x,\xi x)\,d\mu$ (1.3.1.12,
p. 24). Cut the lifted kernel by the indicators $\alpha_k$ of the strata
$\{g:g_v\in\mathcal O_v^\times\ \forall v\mid p,\ p\in T_k\}$, $T_k$ the first $k$ primes outside $S$ (pp. 25 to 27,
49 to 51; 11.3.1.1, p. 491). Multiplying a representative $f_S\otimes\bigotimes1_{\mathcal O_v}$ by $\alpha_k$ multiplies its
zeta function by the reciprocal Euler factors at the primes of $T_k$ (Weil's identity, Theorem 3.4.1.1, p. 143), so each
slice $(\alpha_{k+1}-\alpha_k)K$ acts on a copy of $E_{S_{p_{k+1}}}$. The "shell structure" (11.1, pp. 475 to 483) proves the
needed $L^p$ convergence of this degeneration on truncated regions $\{|g|\ge1/\Lambda\}$. Uses: Steps 2, 5, 9. Where:
1.3 (pp. 21 to 27), Ch. 11 (pp. 475 to 496). New (called "infinite excision" a decade ago, p. 32). Difficulty: large.

**Step 11. Orbital traces vanish.**
Claim: for $\varphi$ supported in $C_F^{>1}$ and every prime $p$ with no place in $S$, the slice $k_p$ has diagonal mass
$\frac{\log q_v}{\mu_v(\mathcal O_v^\times)}\sum_{k\in\mathbb Z}\varphi(\pi_v^k)$, which is $0$ because $S$ was chosen so that
$|\operatorname{supp}\varphi|\subset(1/T,T)$ with $T<N\mathfrak p_v$ for all $v\notin S$ (Theorem 11.3.2.1, p. 495; Theorem 11.2.2.1,
p. 490; proof of 12.5.1.1, p. 520). Sobolev degree $\sigma_0\ge2[F:\mathbb Q]$ ensures the jets at all Euler-factor zeros
are continuous (Remark 11.2.2.2, p. 491). The author calls this "a massive cancellation phenomenon" that concentrates
the geometric side on $S$ (p. 32). Uses: Steps 4, 5, 10. Where: 11.2 to 11.3. New. Difficulty: the largest single share;
the author names the orbital bases "the crux of the matter" (p. 31).

**Step 12. The S-local trace (Connes). (Where the $1/2$ enters.)**
Claim: the remnant kernel $k_S$ factors through $\mathrm{GL}_1(\mathbb A_{F,S})\times C_F$; its diagonal mass, computed with the
$S$-adelic Fourier transform and Parseval, is
$\sum_{v\in S}(\text{Weil local principal value at }v)+\varphi(1)\log(\lambda\lambda')+o(1)$ (Theorem 12.4.1.1,
pp. 514 to 519). The weight: the product $|x|^{a}|y|^{a}$ becomes $|x|^{2a}$ on the diagonal, and only for $a=1/2$ does
$|x|\,d\mu_S$ become the additive measure $d\nu_S$ (up to $c_S$), which makes the volume computation work. The author:
"This forces the 1/2 in the very statement of GRH" (pp. 16, 52; p. 519). Uses: Steps 2, 9, 10. Where: 12.4. Classical:
Connes 1999, §VII, Theorem 4, reprised by Meyer [Me1, §3] (p. 514); Weil's principal values (B.4.4, pp. 620 to 623).
Difficulty: moderate (adaptation).

**Step 13. The Trace Formula.**
Claim: Theorem 12.5.1.1 (p. 519), by adding Step 12 to Step 11 and equating with Step 9 (p. 520). The assembly section
12.3 is missing (p. 514). Uses: Steps 8 to 12. Extension from $\operatorname{supp}\varphi\subset C^{\ge1+\varepsilon}$ to
$C^{\le1-\varepsilon}$ and then to all $\varphi$ with $\varphi(C^1)=0$ by continuity (p. 30). New. Difficulty: small given
the steps.

**Step 14. From the trace formula to GRH. (The hypothesis is forced here, part 2.)**
Claim: approximate $\chi\cdot\varphi_z(|g|)$, $\varphi_z(t)=t^{-z}\mathbf 1_{t>1}$ (value $1/2$ at $t=1$), by smooth
compactly supported $\varphi_{h,\varepsilon,z}=h\cdot(\rho_\varepsilon*\varphi_z)$ (p. 28). For $z$ in a compact $K\subset\{\operatorname{Re}z>a\}$
meeting $\{\operatorname{Re}z>1\}$, the archimedean terms are uniformly bounded, so by Montel's theorem a subsequence
converges to a holomorphic limit; the zero sum over the strip tends to a function holomorphic on $\operatorname{Re}z>a$
(each term is $N(\rho)/(z-(\rho-1/2))$ in the limit); the prime sum tends to $L_f'/L_f(z+1/2,\chi)$ on
$\operatorname{Re}z>1$ (p. 29; with the source's sign convention; for $\chi=1$ it is
$\sum_n\Lambda(n)n^{-1/2-z}=-\zeta'/\zeta(z+1/2)$). Result (1.4.5, p. 29):
$$\text{holomorphic on }\operatorname{Int}K+\frac{L_f'(z+\tfrac12,\chi)}{L_f(z+\tfrac12,\chi)}=\delta\Big(\frac1{z+\tfrac12}+\frac1{z-\tfrac12}\Big)-\text{holomorphic on }\mathbb C_{>a}.$$
By analytic continuation $L_f'/L_f(z+1/2)$ is holomorphic on $\operatorname{Re}z>a$ except at $z=1/2$; $a$ is arbitrary;
the functional equation reflects (p. 30).
**The contradiction, exactly:** suppose $L(\rho,\chi)=0$ with $\beta=\operatorname{Re}\rho>1/2$. Choose $a<\beta-1/2$.
Then $z_0=\rho-1/2$ lies in $\operatorname{Re}z>a$, and $L_f'/L_f(z+1/2)$ has a simple pole at $z_0$ with residue
$N(\rho)\ge1$ ($\rho$ is in the critical strip, so it is a zero of $L_f$ too). But the trace formula for this $a$ expresses
$L_f'/L_f(z+1/2)$ near $z_0$ as a sum of terms each holomorphic at $z_0$: archimedean integrals, the two pole terms at
$\pm1/2$, and $N(\rho')/(z-\rho'+1/2)$ for zeros $\rho'$ with $|\operatorname{Re}\rho'-1/2|<a$, none of which is at $z_0$.
The zero $\rho$ is absent from the right side because of Step 8, while it is present on the left because the left side is
Weil's prime sum, which "knows" every zero. Uses: Step 13; Montel; functional equation. Where: 1.4.2 to 1.4.5 (pp. 28 to
30), 1.8.4.2 to 1.8.5.1 (pp. 53 to 55); not in Ch. 13. Classical tools. Difficulty: small, but the limit
$(h,\varepsilon)\to(\mathbf 1_{(1,\infty)},0)$ inside the zero sum is only sketched ("A similar reasoning", p. 29).

**Where it bites, in one sentence.** Steps 8 and 14 together: the coarse topology removes off-strip zeros from the
spectral side, Steps 10 to 12 show the geometric side is still Weil's complete prime sum, and Weil's prime sum has a pole
at every zero.

---

## 4. Objects

Over $\mathbb Q$ with $\chi=1$: $C_{\mathbb Q}\cong\mathbb R_{>0}\times\hat{\mathbb Z}^\times$, $C^1_{\mathbb Q}\cong\hat{\mathbb Z}^\times$, and
a $\chi=1$ function on $C_{\mathbb Q}$ is a function of $t=|g|\in\mathbb R_{>0}$.

| Object | What kind of thing | What it is not | Over $\mathbb Q$, $\chi=1$ | Defined |
| --- | --- | --- | --- | --- |
| Adeles $\mathbb A_F$, ideles $\mathrm{GL}_1(\mathbb A_F)$, $C_F$, $J_{F,S}=\mathrm{GL}_1(\mathbb A_{F,S})/\mathcal O_{F,S}^\times$ | Locally compact abelian groups (restricted products and quotients) | $\mathrm{GL}_1(\mathbb A_F)$ does not carry the subspace topology from $\mathbb A_F$ | $\mathbb A_{\mathbb Q}=\mathbb R\times\prod'\mathbb Q_p$; $C_{\mathbb Q}=\mathbb R_{>0}\times\hat{\mathbb Z}^\times$; $S=\{\infty\}$: $J=\mathbb R^\times/\{\pm1\}$ | p. 7; App. A.1 (p. 539) |
| Schwartz-Bruhat $\mathcal S(G)$; $S_I(G)$, $S_E(G)$ | Nuclear test-function spaces; $S_E$ = exponentially decaying in $\log|g|$ | Not compactly supported; $S_E$ is not $\mathcal S(C_F)$ | $f_\infty\otimes\bigotimes_p1_{\mathbb Z_p}$; $S_E(\mathbb R_{>0})$: $\phi$ with $t^a\phi$ Schwartz for all $a$ | pp. 11, 42; App. D |
| $\Phi_F$, adelic $\theta$-function | Linear operator $\mathcal S(\mathbb A_F)\to C(C_F)$, $f\mapsto\sum_{\xi\in F^\times}f(\xi g)$ | Not a modular form; a $\mathrm{GL}_1$ periodization, not a theta lift | $f=f_\infty\otimes1_{\hat{\mathbb Z}}$: $\sum_{n\ne0}f_\infty(nt)$; Gaussian gives $\theta(t^2)-1$ with $\theta(x)=\sum_ne^{-\pi n^2x}$ | Def. 2.2.3.1, p. 81; p. 12 |
| $\Phi_{F,S}$ | Same, periodizing over S-units on $\mathbb A_{F,S}$ | Not over $F^\times$ | $S=\{\infty\}$: $f_\infty(t)+f_\infty(-t)$ | Def. 2.3.1.1, p. 99; p. 12 |
| $H_{0,\rm cont}(F^\times,\mathcal S(\mathbb A_F))$, its $\mathcal S_0$ part, isotypes; S-local $H_{0,\rm cont}(\mathcal O^\times_{F,S},\mathcal S(\mathbb A_{F,S}))$ | Topological vector space of continuous coinvariants $=\mathcal S/\ker\Phi$; strict LF; isotypes nuclear Fréchet | Not a Hilbert space until completed (Step 7) | Sums $\sum_{n\ne0}g(nt)$, $g$ even Schwartz on $\mathbb R$ ($\mathcal S_0$, i.e. $f(0)=\hat f(0)=0$, means $g(0)=0$ and $\int_{\mathbb R}g=0$ for $f=g\otimes1_{\hat{\mathbb Z}}$) | Def. 5.1.1.1, p. 223; p. 12 |
| $p_S$ (S-local to global) | Isomorphism on isotypes for large $S$; Mellin: multiplication by $L^S(s,\chi)$ | Not onto all of $H_0$ without isotype restriction | $f_\infty\mapsto\sum_{n\ne0}f_\infty(nt)$; Mellin: multiply by $\zeta(s)$ | pp. 30, 44; Thm. 6.2.1.1, p. 295 |
| Idelic zeta $Z(f,c)$, global $Z$-function $L(f,c)$ | Meromorphic functions on $\Omega(C_F)$ (Tate integrals) | Not $L(s,\chi)$ itself: $L(s,\chi)$ times an entire factor | $\int_0^\infty\sum_{n\ne0}f_\infty(nt)t^s\frac{dt}t=2\zeta(s)\int_0^\infty f_\infty(t)t^s\frac{dt}t$ | Thm. 3.2.2.1, p. 124 |
| $\Omega(C_F)$, Riemann surface of quasi-characters | Complex manifold, components $\{\chi|\cdot|^s\}\cong\mathbb C$, indexed by characters of $C^1_F$ | Not a single plane; in function fields components are annuli (p. 33) | One component per Dirichlet-type character of $\hat{\mathbb Z}^\times$; $\chi=1$: $|\cdot|^s$, $s\in\mathbb C$ | 3.1, p. 118; p. 45 |
| Mellin $M$, Schwartz-Bergman space $AS(\mathbb C)$ | Isomorphism $S_E(\mathbb R_{>0})\to AS(\mathbb C)$ (entire, Schwartz on vertical strips) | Not the Fourier transform on $\mathbb R$ (it is, after $t=e^u$) | $M\phi(s)=\int_0^\infty\phi(t)t^s\,dt/t$ | p. 40; App. D.3 |
| Divisor exact sequence; $H_F$ | Short exact sequence of nuclear spaces; $H_F$ = functions modulo $\theta$-functions | Not an $L^2$ space (Connes's version is) | Quotient $\cong$ jets at zeros of $\xi(s+1/2)$, $\xi$ Riemann's xi | pp. 13, 45; Thm. 6.3.2.1 |
| Eigendistributions $\Delta_F(c)$ | $F^\times$-invariant $c$-homogeneous tempered distributions $f\mapsto Z(f,c)$ | Not functions | $f\mapsto Z(f,|\cdot|^s)$ | 5.5, p. 277 |
| Weil's principal value operators $\mathrm{PV}_v$ | $f(x)\mapsto f(x)-f(\pi_v^{-1}x)$; Mellin: times $L_v^{-1}$ | Not Weil's principal value integral $\int'$ (same name, B.4.4) | $\mathrm{PV}_p$: Mellin times $1-p^{-s}$; replaces $1_{\mathbb Z_p}$ by $1_{\mathbb Z_p^\times}$ | 5.3, p. 240; p. 18 |
| Orbital subquotients $E_{S_p}$, $E_{S_\infty}$ | Nuclear Fréchet quotients $H_0/\mathrm{PV}_{S_p}H_0$ | Not subspaces | $E_p\cong\mathcal S(\mathbb R_{>0}/p^{\mathbb Z})$, functions on a circle of length $\log p$ | pp. 18 to 19; Def. 7.3.1.3, p. 343 |
| Periodic Schauder basis | Absolute basis of exponentials on $\mathcal S(G/\gamma^{\mathbb Z})$ | Not orthonormal in general; in nuclear Fréchet space | $t^{2\pi im/\log\gamma}$, dual: Fourier coefficients | Ch. 4; p. 17 |
| Orbital Schauder bases | Bases of $E_{S_p}$ with dual basis = jets at zeros of $\prod_{v\mid p}L_v^{-1}$ | Not bases of the whole $\theta$-space | $t^{2\pi im/\log p}$; dual: $\hat\delta$ at $s=2\pi im/\log p$ | Thm. 7.3.1.6, p. 344 |
| Paley-Wiener levels | Subquotients with a support condition on Fourier transforms making $|\cdot|^a$ continuous | Not needed to understand the idea (author, p. 51) | (Not worked out over $\mathbb Q$ in the source) | 7.3.2, p. 350; 11.2.1, p. 487 |
| Markushevich bases (spectral, orbital) | Complete biorthogonal systems in the Hilbert completions | Weaker than Schauder bases | Spectral: $|g|^{b+it}(\log|g|)^m$ at zeros in strip | Thm. 10.2.2.1, p. 446; Thm. 11.2.0.2, p. 485 |
| Hardy-Sobolev $W^{\sigma_0}_I(G)$ | Hilbert completion of $S_E(G)$, weight $\max(|g|^{\pm2a})(1+\log^2|g|)^{\sigma_0/2}$ | Not the usual Sobolev space unless $I=\{0\}$ | $\int_0^\infty|\phi|^2\max(t^{2a},t^{-2a})(1+\log^2t)^{\sigma_0/2}dt/t$; Mellin: Hardy-Sobolev functions on $|\operatorname{Re}z|<a$ | p. 11; Def. 9.2.2.3, p. 414 |
| $\mathcal H_{F,a,I}$, $P^{\rm geom}$, $P^{\rm spec}$ | Quotient by closure of weighted $\theta$-functions; orthogonal projections onto that closure and its complement | $P^{\rm geom}$ does not commute with $A(\varphi)$ (p. 458) | Jets at zeros of $\xi$ with $|\operatorname{Re}\rho-\frac12|<a$ | Def. 10.4.1.1, p. 456; Lemma 10.4.1.2 |
| Spectral kernel $k_{\rm spec}$ | Measurable kernel on $C_F\times C_F$, $L^2(\nu\otimes\nu^\vee)$ limit of finite-rank kernels | Not continuous; diagonal defined by Lebesgue differentiation | $\sum_{\rho,m}t^{\rho-1/2}(\log t)^m\otimes\psi_{\rho,m}$ | p. 14; Thm. 10.4.3.1, p. 466 |
| Geometric kernel $k_{\rm geom}=\varphi(xy^{-1})-k_{\rm spec}$ | Kernel of $A_I(\varphi)\circ P_\theta$ (neither trace class nor Hilbert-Schmidt) | Not the kernel of a trace-class operator | Same on $\mathbb R_{>0}$ | p. 15, 48; Def. 10.4.3.7, p. 473 |
| Indentation $u_0$; smoothening | Cutoff whose $H$-average is 1; average over shrinking $D'$-sequences | Not a partition of unity in general | Fundamental domain of $\mathbb Q^\times$ in ideles: $\mathbb R_{>0}\times\hat{\mathbb Z}^\times$ | pp. 21 to 24; 12.1, 12.2 |
| Divisorial (primary) stratification | Open-closed filtration of $\mathrm{GL}_1(\mathbb A_F)$ by "unit at the first $k$ primes" | Defined on ideles only, lost in $C_F$ | $g_p\in\mathbb Z_p^\times$ for $p\in T_k$; on $\theta$: $\sum_{\xi}$ restricted to $\xi$ coprime to $T_k$ (sieve) | pp. 25 to 27; 11.3.1.1, p. 491 |
| Shell structure | $L^p$-convergent degeneration $1_{\mathcal O_v}\to1_{\mathcal O_v^\times}$ for all $v\notin S$ on $\{|g|\ge1/\Lambda\}$ | The intro's paragraph on it is unwritten (p. 27) | $\sum_{\xi\in\mathbb Z[1/S]\setminus0}\to\sum_{\xi\in\mathbb Z[1/S]^\times}$ on $t\ge1/\Lambda$ | 11.1, p. 475 |
| Orbital kernels $k_p$, orbital traces | Slices $(\alpha_{k+1}-\alpha_k)K$; their diagonal masses | Not the local terms of the final formula (those come from $k_S$) | Mass $\log p\sum_k\varphi(p^k)=0$ for $p>T$ | pp. 15, 27; Thm. 11.3.2.1, p. 495 |
| S-local kernel $k_S$ | Remnant supported on $\mathrm{GL}_1(\mathbb A_{F,S})\times\hat{\mathcal O}^\times$ | Not global | $S=\{\infty\}\cup\{p\le T\}$ | p. 27; Thm. 12.4.1.1 |
| Periodic orbits, fixed points | Topological quotient stacks $[\mathbb R_{>0}/F_v^\times]$, $BU_v$ | No 3-manifold, foliation, or foliated cohomology (p. 16) | Loop of length $\log p$; $BU_\infty$ | 1.2.11, p. 20; Ch. 8; App. E |
| Trace formula, two sides | Geometric: Weil's local terms over all places; spectral: zeros in the strip | Not Weil's explicit formula (whose spectral side has all zeros) | See Section 5 | Thm. 12.5.1.1, p. 519 |
| Polar multiplicities $m_\chi$ | Max pole order of $\prod_{v\mid p}L_v$ over $p$; $\le[F:\mathbb Q]$ | Not multiplicities of zeros of $L$ | $1$ (each $1-p^{-s}$ has simple zeros) | p. 37; Thm. 7.1.3.2 |

---

## 5. Specialization to $\zeta(s)$: $F=\mathbb Q$, $\chi=1$

Everything below lives on $\mathbb R_{>0}$ with $dt/t$. Constants in the archimedean term are our specialization of
1.4.1 (p. 28) and should be checked against Theorem B.4.4.7 (p. 623) and the measure normalizations of Remark B.4.4.2
before numbers are printed **(our reading)**.

1. **$\theta$-functions.** Take $g$ even and Schwartz on $\mathbb R$. The global $\theta$-function is
   $\Theta_g(t)=\sum_{n\ne0}g(nt)=2\sum_{n\ge1}g(nt)$. Since $\mathrm{Pic}(\mathbb Z)=1$, $S=\{\infty\}$ already satisfies the
   hypotheses of the Fifth Structure Theorem, so for $\chi=1$ every global $\theta$-function is of this form (p. 44; Theorem
   6.2.1.1). Its Mellin transform is $2\zeta(s)G(s)$ with $G(s)=\int_0^\infty g(t)t^s\,dt/t$; for $g=e^{-\pi x^2}$ this is
   $\pi^{-s/2}\Gamma(s/2)\zeta(s)$, Riemann's completed zeta. The conditions $f(0)=\hat f(0)=0$ remove the poles at
   $s=0,1$ (Theorem 3.2.2.1, p. 124).
2. **Divisor sequence.** Inside $S_E(\mathbb R_{>0})$ (functions with $t^a\phi$ Schwartz for all $a$) the weighted
   $\theta$-functions $t^{1/2}\Theta_g(t)$ have Mellin transforms $=\xi(z+1/2)\cdot h(z)$, $h$ entire, where
   $\xi(s)=\frac12s(s-1)\pi^{-s/2}\Gamma(s/2)\zeta(s)$. So "functions on $\mathbb R_{>0}$ modulo $\theta$-functions" is
   "jets at the points $\rho-1/2$" (pp. 13, 45).
3. **Coarse space.** $W_{[-a,a]}(\mathbb R_{>0})$ with norm $\int_0^\infty|\phi|^2\max(t^{2a},t^{-2a})\,dt/t$ ($\sigma_0=0$).
   Mellin maps it onto functions holomorphic on $|\operatorname{Re}z|<a$ with $L^2$ boundary values on $\operatorname{Re}z=\pm a$
   (Proposition 9.2.2.4). The quotient by the closure of the $\theta$-functions sees only zeros with
   $|\beta-1/2|<a$ (Corollary 9.2.2.5; Theorem 10.2.2.1).
4. **The operator.** $A(\varphi)\psi(x)=\int_0^\infty\varphi(t)\psi(x/t)\,dt/t$ for $\varphi\in C_c^\infty((0,\infty))$,
   $\varphi(1)=0$; on a zero's jet it acts by $M\varphi(\rho-1/2)$ (Jordan blocks of size $N(\rho)$, p. 14).
5. **Primes as circles.** $\mathrm{PV}_p$ replaces $1_{\mathbb Z_p}$ by $1_{\mathbb Z_p^\times}$; on $\theta$-functions it deletes
   the terms with $p\mid n$: $\sum_{n\ne0}g(nt)\mapsto\sum_{p\nmid n}g(nt)$; on the Mellin side it multiplies by
   $1-p^{-s}$. The quotient is $\mathcal S(\mathbb R_{>0}/p^{\mathbb Z})$, functions on a circle of length $\log p$, with basis
   $t^{2\pi im/\log p}$. Trace of $A(\varphi)$ there: $\sum_mM\varphi(2\pi im/\log p)=\log p\sum_{k\in\mathbb Z}\varphi(p^k)$
   (Poisson). **(Ours, a framing to record in `framing.md`.)** The divisorial stratification is a sieve of Eratosthenes run
   on the $\theta$-sum: with $S=\{\infty\}\cup\{p\le T\}$, the global sum runs over $S$-integers $\xi\in\mathbb Z[1/S]\setminus0$,
   and removing the primes $p>T$ one at a time leaves the sum over $S$-units $\xi=\pm\prod_{p\le T}p^{e_p}$ (pp. 25 to 27,
   38, 41, 483). Each removal is one orbital slice, with trace $\log p\sum_k\varphi(p^k)=0$ because $p>T$ and
   $\operatorname{supp}\varphi\subset(1/T,T)$.
6. **S-local remnant.** Connes's computation on $\mathbb A_{\mathbb Q,S}=\mathbb R\times\prod_{p\le T}\mathbb Q_p$ gives the local terms.
   At $p$: $\log p\int'_{\mathbb Q_p^\times}\varphi(g)|g|^{1/2}/|1-g|_p\,d\mu_p=\log p\sum_{m\ge1}p^{-m/2}(\varphi(p^m)+\varphi(p^{-m}))$
   when $\varphi(1)=0$ (because $|g|^{1/2}/|1-g|_p=p^{-|m|/2}$ for $g\in p^m\mathbb Z_p^\times$, $m\ne0$; unit terms vanish).
7. **The trace formula over $\mathbb Q$.** For $\varphi\in C_c^\infty((0,\infty))$ with $\varphi(1)=0$ and any $a>0$:
   $$
   \tfrac12\,\mathrm{PV}\!\!\int_0^\infty\varphi(t)\,t^{1/2}\Big(\frac1{|1-t|}+\frac1{1+t}\Big)\frac{dt}t
   +\sum_{n\ge2}\frac{\Lambda(n)}{\sqrt n}\big(\varphi(n)+\varphi(1/n)\big)
   =M\varphi(\tfrac12)+M\varphi(-\tfrac12)-\sum_{|\beta-1/2|<a}N(\rho)\,M\varphi(\rho-\tfrac12),
   $$
   $M\varphi(z)=\int_0^\infty\varphi(t)t^z\,dt/t$ (measure normalized as $\bar\mu$). The classical Guinand-Weil formula is the
   same identity with the sum over all zeros.
8. **Endgame over $\mathbb Q$.** $\varphi_z(t)=t^{-z}\mathbf 1_{t>1}$: prime side $\sum_n\Lambda(n)n^{-1/2-z}=-\zeta'/\zeta(z+1/2)$;
   $M\varphi_z(\rho-1/2)=1/(z-\rho+1/2)$; $M\varphi_z(\pm1/2)=1/(z\mp1/2)$. So $-\zeta'/\zeta(z+1/2)$ equals
   $\frac1{z-1/2}+\frac1{z+1/2}-\sum_{|\beta-1/2|<a}\frac{N(\rho)}{z-\rho+1/2}$ minus an archimedean term holomorphic in the
   region. A zero with $\beta>1/2+a$ would be a pole on the left and not on the right.

What changes in general: $\mathbb R_{>0}$ becomes $C_F$ with its compact part $C_F^1$, so one works isotype by isotype in
$\chi|_{C^1}$; finitely many archimedean places of two kinds; $\log p$ becomes $\log q_v$ with volumes $\mu_v(\mathcal O_v^\times)$;
several places above one $p$ share a residue characteristic, which is why strata are taken over whole fibers $S_p$ and why
Sobolev degree $2[F:\mathbb Q]$ appears; class groups force $S$ large with $\mathrm{Pic}(\mathcal O_{F,S})=1$; the central point
moves to $1/2-ix_0$.

---

## 6. Prerequisites

Ranked by how much is truly needed, with what can be replaced by the $\mathbb Q$ instance. Each line names the steps of
Section 3 it serves.

**Essential, can be taught concretely over $\mathbb Q$:**
1. Mellin transform on $\mathbb R_{>0}$, Mellin inversion, Paley-Wiener ideas (compact support in $\log t$ means entire of
   exponential type), Hardy spaces on a strip. Steps 3, 4, 7, 8, 14. Needed in full; over $\mathbb Q$ it is all there is.
2. Poisson summation on $\mathbb R$ and on a circle; Fourier series as a basis. Steps 1, 4, 5, 11.
3. Riemann's $\theta$ proof of the functional equation (Part I chapter 4 of this page). Step 1.
4. Weil's explicit formula with principal values (Part II chapter 8). Steps 12 to 14.
5. Trace-class operators on Hilbert space, trace as a sum of eigenvalues (Lidskii) and as the integral of a kernel on
   the diagonal. Steps 8, 9, 11. Needed as statements; the Jordan-block picture is enough.
6. Montel's theorem and analytic continuation. Step 14.

**Needed as language, one section each:**
7. $p$-adic numbers, $\mathbb Z_p^\times$, uniformizers, Haar measure on $\mathbb Q_p$. Steps 5, 10, 12. Can stay at
   "$1_{\mathbb Z_p}$ versus $1_{\mathbb Z_p^\times}$".
8. Adeles, ideles, $C_{\mathbb Q}\cong\mathbb R_{>0}\times\hat{\mathbb Z}^\times$, Schwartz-Bruhat functions as finite sums of products.
   Steps 1, 10. Needed for the lifting step; the rest can be told on $\mathbb R_{>0}$.
9. Characters, Pontryagin duality, Fourier transform on $\mathbb A_{\mathbb Q}$ with $\mathbb Q$ self-dual. Steps 1, 12.
10. Tate's thesis: local and global zeta integrals, the functional equation. Steps 1 to 3. State and cite.
11. Hecke characters, $\Omega(C_F)$. Needed only for the general statement; over $\mathbb Q$ use Dirichlet characters.
12. Lebesgue differentiation and the Hardy-Littlewood maximal function on $\mathbb R$. Step 9. The LCA version can be cited.

**Black box, statement only:**
13. Locally convex spaces, Fréchet, LF and nuclear spaces, Montel spaces, strong duals, Open Mapping Theorem for LF
    spaces. Step 2. Replace by "the space of rapidly decaying functions with its natural topology".
14. Schauder and Markushevich bases in Banach and nuclear spaces. Steps 4, 5, 8. One paragraph: a basis with continuous
    coefficient functionals; Markushevich = only biorthogonal and complete.
15. Topological stacks, coarse spaces, inertia. Step 6. Replace by "a circle of length $\log p$".
16. Bohr almost periodicity, Kronecker-Weyl, Bagchi; classical zero-free regions; convexity bound. Steps 3, 5. Cite.
17. Weil groups, Artin-Weil $L$-functions. Only for Ch. 14.1, which the explainer does not need.

---

## 7. Compression

**State and cite (classical, proved elsewhere):**
- Tate's thesis: [CF] J. W. S. Cassels and A. Fröhlich (eds.), Algebraic Number Theory, Ch. XV (Tate). Steps 1 and the
  local zeta integrals.
- Weil's explicit formula: A. Weil, "Sur les 'formules explicites' de la théorie des nombres premiers" (1952); the
  source's own idelic form is Theorem B.4.4.7 (p. 623).
- Connes's S-local computation: A. Connes, "Trace formula in noncommutative geometry and the zeros of the Riemann zeta
  function", Selecta Math. 5 (1999), §VII, Theorem 4, as cited on p. 514; R. Meyer's reprise [Me1, §3].
- Lebesgue differentiation on LCA groups: Hewitt and Ross, Abstract Harmonic Analysis II, Ch. XI, §44 (cited p. 22).
- Nuclear spaces and kernels: Trèves, Topological Vector Spaces, Distributions and Kernels, Part III (cited as [Tre]).
- Analytic inputs on $L$: non-vanishing on $\operatorname{Re}s=1$, convexity, $N(T+1)-N(T)=O(\log T)$ (App. B; any text such
  as Iwaniec-Kowalski, Analytic Number Theory, Ch. 5).

**Black-box within the source (state precisely, prove nothing):** Structure Theorems I to V (Step 2) collapse to one
sentence over $\mathbb Q$: every weight-$\chi$ $\theta$-function is $\sum_{\xi}f_S\otimes\bigotimes1_{\mathbb Z_p}(\xi g)$ and the Mellin
image is $L$ times entire functions. Ch. 8 (periodic orbits, stacks) as picture only. The measure theory of Step 9 and the
shell-structure convergence of Ch. 11.1. Paley-Wiener levels: say they exist to make $|\cdot|^a$ continuous (p. 51).

**The new heart (in-depth treatment):**
1. The divisor exact sequence and the observation that a coarse strip topology keeps only zeros in the strip (Steps 3,
   7, 8). This is where the reader sees why off-line zeros could vanish from a trace formula.
2. Orbital bases and the orbital trace $\log p\sum_k\varphi(p^k)$, done fully over $\mathbb Q$ (Steps 4, 5, 11).
3. The sieve-like stratification and the reduction to the S-local piece (Step 10), with the remark that this is where
   Meyer needed infinite Euler products and therefore fine topologies, and Masullo goes one prime at a time (pp. 39 to
   41).
4. The endgame (Step 14), short.

**A shorter route for the endgame (ours).** The source already proves Weil's explicit formula over all zeros (Theorem
B.4.4.7, p. 623) and absolute convergence of the zero sums over any subset of zeros (Lemma B.4.4.9, p. 624). Subtracting
Theorem 12.5.1.1 from B.4.4.7, for each $a>0$ and each $\varphi\in\mathcal D(C_F)$ with $\varphi(C_F^1)=0$,
$$\sum_{|\operatorname{Re}\rho-1/2|\ge a}N(\rho)\,M(\varphi)(\chi|\cdot|^{\rho-1/2})=0$$
(edge terms aside). Over $\mathbb Q$, with $t=e^u$, this says the distribution $T=\sum N(\rho)e^{(\rho-1/2)u}$ vanishes on
$C_c^\infty(\mathbb R\setminus\{0\})$. Testing against translates $\psi_0(u-u_0)$ with $u_0$ large and taking a Laplace
transform in $u_0$ gives a meromorphic function $\sum N(\rho)\Psi_0(\rho-1/2)e^{(\rho-1/2-z)U}/(z-\rho+1/2)\equiv0$ whose residues
$N(\rho)\Psi_0(\rho-1/2)$ cannot all vanish if a zero exists (choose $\psi_0$ with $\Psi_0(\rho-1/2)\ne0$). This replaces the
holomorphic family, mollifiers, and Montel argument of pp. 28 to 29, and it makes the logic transparent to a reader who
has just met the explicit formula in Part II: the new trace formula and the old explicit formula have the same left side;
their right sides differ by the zeros outside the strip; so there are none. The author's own Ch. 13 outline ("Recollections
on the Explicit Formulas", p. 522) suggests he intended a comparison of this kind. We have not checked the edge terms for
$\sigma_0>0$; with $\sigma_0=0$ there are none (p. 13).

**A shorter route for exposition (ours).** Tell Steps 3 to 11 entirely on $\mathbb R_{>0}$ with $\theta$-sums
$\sum_{n}g(nt)$, using the sieve picture of Section 5 item 5, and introduce the adeles only to justify that the "remove
the prime $p$" operation and the stratification are canonical. The S-local step can then be quoted from Connes.

---

## 8. Relations

**Tate.** Ch. 2 and 3 rewrite Tate's zeta integrals as Mellin transforms of $\theta$-functions on $C_F$, explicitly
following Riemann's use of Jacobi's $\theta$ (p. 117). Tate introduced an $L^1$ version of the weighted spaces
(p. 43). The section heading "A wonderful exercise: Tate's Thesis" (1.1.1, p. 11) is empty.

**Weil.** The geometric side of the Trace Formula is "identical to that from the Explicit Formulas", while the spectral
side is not (p. 36). Weil's positivity criterion is not used and cannot be: the trace formula requires $\varphi(C^1)=0$, and
the only $\varphi=\psi*\tilde\psi$ satisfying this is zero (p. 35). Compared to Deligne avoiding positivity of the
intersection pairing (pp. 30, 35). Exception to flag: Section 14.1.2 (p. 528) says Theorem 13.3.1.2 follows from "the
Trace Formula combined with the Positivity Criterion (in its form from Theorem ??)"; this conflicts with pp. 30 and 35.

**Connes.** The divisor exact sequence was "initially envisioned by Connes", who used $L^2$ completions (p. 13). Connes's
spectral interpretation is the special case $I=\{0\}$, with Sobolev degree equal to Connes's $\delta$ (p. 32). The
S-local computation is Connes's (pp. 16, 39, 514). Connes never used the locally convex spaces of $\theta$-functions
(p. 32). Connes's expectation that the S-adelic Fourier transform forces the $1/2$ is "correct" (p. 16).

**Meyer.** Meyer degenerated global to S-local with infinite Euler-product operators, which converge only in fine
(bornological) topologies; there every zero's evaluation is continuous, so his trace formula is Weil's explicit formula
(pp. 32, 39, 535). Mertens' theorem obstructs infinite Euler products in the critical strip ("a herald for GRH", p. 40).
Masullo's change: one prime at a time, with bases tracking what each step loses (p. 41).

**Deninger.** Periodic orbits of length $\log N\mathfrak p$ and archimedean fixed points are realized as supports of dual basis
elements, and Deninger's local traces as actual traces on orbital subquotients (pp. 20, 33). But "there is no
3-manifold, nor foliation, nor foliated cohomology theory" (p. 16). The flow is $J_{F,S}/J^1_{F,S}\cong\mathbb R_{>0}$ restricted
to $\mathbb R_{>1}$ (p. 20). Sarnak's long horocycles (1981) is the stated analogy (pp. 21, 33).

**Function fields (14.2, pp. 534 to 536; 1.7.1, pp. 33 to 35).** The method does not give GRH there. Ch. 2 to 5 adapt;
Ch. 6 and 7 do not. All residue fields have size a power of $q$, so the Euler factors share infinitely many poles and
Theorem 7.1.3.2 fails; components of $\Omega$ are annuli, not simply connected; correcting the overlap would need test
functions vanishing to infinite order. The only workable topology is non-normable and yields only Weil's explicit formula,
as in Meyer [Me, §5]. The multiplicity analog fails for maximal curves (multiplicity $2g$, gonality $g+1$, p. 535). The
reasons offered for number fields: archimedean places, "solenoid" quotients $(\mathbb R^N\times A)/\Gamma_0$, and
$\mathbb Q$-linear independence of the $\log p$ (pp. 33 to 35).

**Contacts with Route A (the four-page note), only where both texts say something.**
- Theta functions: the note's thetas are theta lifts between totally definite unitary groups and $\theta$ on covers of
  $\mathrm{GL}_2$ and $\mathrm{GL}_5$ (note pp. 3 to 4, items 3, 8, 12). Masullo's are $\mathrm{GL}_1$ periodizations
  $\sum_{\xi\in F^\times}f(\xi g)$. Both descend from Poisson summation, but they are different objects; the explainer should
  not suggest one is a case of the other.
- Weil's explicit formula: both pass through it. The note works with positivity of Weil's functional $W$ on chosen test
  functions (items 4, 6, 7) and the smoothed sum $\sum_{n\le X}\Lambda(n)(X/n-1)$ (item 5). Masullo uses the explicit-formula
  side as the geometric side and avoids positivity (pp. 30, 35). **(Ours.)** Both feed the formula one-sided test functions
  in the multiplicative variable: $\mathbf 1_{(0,1]}$ and $\mathbf 1_{(0,1/X]}$ in the note (item 6), and $t^{-z}\mathbf 1_{t>1}$
  approximated by functions vanishing on the unit locus in Masullo (pp. 28 to 30). That is a real shared feature of the
  texts, not a shared argument.
- Function fields: opposite stances. The note's argument "is a descendant of Stepanov's" proof over function fields and
  seeks a substitute for multiplicity (note p. 1). Masullo argues his method is specific to number fields and gives only the
  explicit formula over function fields (14.2). The word "multiplicity" means different things: order of vanishing of an
  auxiliary function in the note; multiplicity of zeros of $L$ and pole orders of Euler factors in Masullo.
- Deligne: both invoke Deligne (note p. 2 to 3 on "sign-only" proofs; Masullo on non-vanishing at the edge and avoiding
  positivity, pp. 30, 35). Sarnak is named in both.

---

## 9. State of the text

The author says: introduction unfinished, mathematics complete, writing missing in several parts, known "glitches"
(p. 6). Factual inventory:

**Fully written (with scattered "Return here" footnotes):** Ch. 2 to 8 (pp. 57 to 394), Ch. 9 (some proofs deferred,
pp. 414 to 415), Ch. 10 (the proof of 10.4.2.8 ends "Return here and complete proof", p. 464), Ch. 11 (footnotes at
pp. 475, 483), 12.1, 12.2, 12.4, 12.5 (pp. 498 to 520), 14.1 and 14.2, App. A to D. App. E is marked "Complete this
Appendix, correcting it and shortening it" (p. 823). B.4 has notes "the right side should be double-checked" and "Need some
hypothesis on $\mathcal Z$" (pp. 623 to 624).

**Stubs and gaps:**
- Ch. 1: 1.2.4, 1.2.5, 1.2.6 are headings only (p. 16); 1.3.3 and 1.3.4 end in "Finish!" (p. 27); 1.6.1, 1.6.2 empty
  (p. 33); dangling references ("Caveat ??" p. 33; "§5.1" p. 29; equation numbers from Ch. 11 and 12 used in Ch. 1).
  Part of p. 29 is in red draft text.
- 12.3 "Putting the pieces together" is empty ("Include section", p. 514), though 12.5's proof cites what it needs.
- Ch. 13 (pp. 521 to 522): 13.1 and 13.2 are empty; Theorem 13.3.1.1 is flagged "Correct statement"; Theorem 13.3.1.2
  is "Insert statement"; a footnote reads "State and prove the Main Theorems, also explaining how to deduce them by
  approximation $\varphi\to e^{-s|\log t|}$ as $\operatorname{Re}(s)>1$". **So the deduction of GRH exists only in the
  introduction and letter, pp. 28 to 30 and 53 to 55.**
- 14.1.2 is flagged "Correct this subsection" (p. 528); 14.3 is a stub ("Say a few words on $\mathrm{GL}_n$", p. 536).

**Two versions of the endgame.** Writers must take the one in the introduction and letter.
- Introduction and letter: strip $I=[-a,a]$ with $a>0$, Sobolev degree 0, holomorphic family plus Montel, positivity
  not used. The letter says the degenerate case $a=0$ "does not lead to a Trace Formula anymore" (p. 36), that
  conclusions on multiplicities "cannot be obtained through the trace formula" (p. 36), and that the multiplicity part
  "will not be a part of my paper" (p. 37), stated only as Expectation 1.7.1 (p. 38).
- Ch. 10 to 14 body: much of the machinery is built "on the 0-line" ($I=\{0\}$, Sobolev degree $\ge2[F:\mathbb Q]$:
  Theorems 10.3.1.1, 11.2.0.2, 11.2.2.1), while 11.3.2.1 and 12.5.1.1 allow $I=[-\alpha,\alpha]$, $\alpha\ge0$. Theorem
  13.3.1.1 is the 0-line form with extra vanishing at central points, and 14.1.2 reads it as all zeros on the line with
  non-central multiplicity at most $[F:\mathbb Q]$. For $F=\mathbb Q$ that would be simplicity of every nontrivial zero of
  $\zeta$ other than $1/2$. The letter calls this an expectation; the chapter calls it a theorem with a correction flag.

**Small inconsistencies to correct silently when transcribing:** the toy-example trace lacks the factor $\log\gamma$ on
p. 17 (correct on p. 41); the edge multiplicity is written $\max\{N(\rho),(s-1)/2\}$ on pp. 13 and 46 but
$\min\{N,[(s-1)/2+1]\}$ in Theorems 10.2.2.1 and 10.3.1.1; the strip is $\sigma(c)\in I$ on p. 28 but $\sigma(c)\in1/2+I$ on
pp. 53 and 519; the family is $t^{-z}$ on p. 28 but $t^s$ on p. 30; the prime sum's limit is written $+L_f'/L_f$ (p. 29)
where for $\chi=1$ it is $-\zeta'/\zeta$; the "Sobolev degree" letter changes between $s$ and $b$.

---

## 10. Proposed chapters (Part III, Route M)

Each assumes Part I and II (complex toolkit, $\theta$ and the functional equation, explicit formula, Weil positivity).

**III.1 The adeles: all completions at once.**
Brief: $p$-adic numbers as a second way to measure size; $\mathbb Z_p$, units, Haar measure; adeles and ideles of $\mathbb Q$ as
restricted products; $\mathbb Q$ sits discretely in $\mathbb A_{\mathbb Q}$, and $C_{\mathbb Q}=\mathbb R_{>0}\times\hat{\mathbb Z}^\times$; Schwartz-Bruhat
functions $f_\infty\otimes\bigotimes1_{\mathbb Z_p}$; characters, Fourier transform, Poisson summation on $\mathbb A/\mathbb Q$; one
paragraph on number fields and Hecke characters as characters of $C_F$. Read: pp. 7, 11, 42 to 44; App. A.1 (pp. 539
to 545), A.3 (p. 555); 2.1 (pp. 59 to 74) skim. Prerequisites: Part I only.
Figures: a rational number as a vector of all its completions (drag $x$, watch $|x|_p$ for each $p$ and the product
formula); the idele class group as $\mathbb R_{>0}\times$ a profinite "fiber"; $\mathbb Z_p$ as a tree of residues; a
Schwartz-Bruhat function as a bump times indicators.

**III.2 Tate's thesis as theta and zeta.**
Brief: $\Phi(f)(g)=\sum_{\xi\in\mathbb Q^\times}f(\xi g)$ and over $\mathbb Q$ the sum $\sum_{n\ne0}g(nt)$; adelic Riemann-Roch as
Poisson summation; Mellin transform gives $\zeta(s)$ times a local factor; the functional equation in one line; S-local
$\theta$-functions over S-units; the Mellin image of all $\theta$-functions is "$L$ times entire functions"; the divisor
exact sequence and Connes's spectral realization; why this fine topology only reproduces Weil's explicit formula. Read:
pp. 11 to 13, 38 to 47; Ch. 2 openings (pp. 57, 81 to 83), 3.2 (pp. 122 to 128), 3.4.1 (p. 143), 6.3.2 (pp. 303 to
310), Theorem 6.2.1.1 (p. 295). Prerequisites: III.1.
Figures: a lattice $n t$ and the theta sum as $t$ is dragged, with its $t\mapsto1/t$ symmetry; a test function and its
Mellin transform side by side; "functions modulo $\theta$-functions" as jets at zeros (a plane with zeros lit up);
Weil's identity: switching $1_{\mathbb Z_p}$ to $1_{\mathbb Z_p^\times}$ multiplies by $1-p^{-s}$.

**III.3 Primes as circles: orbital bases and traces.**
Brief: the toy model $\mathcal S(\mathbb R_{>0}/\gamma^{\mathbb Z})$, its exponential basis, the trace of convolution by
Poisson as $\log\gamma\sum_k\varphi(\gamma^k)$, and its vanishing when the support is inside $(1,\gamma)$; the operator
$\mathrm{PV}_p$ and the orbital quotient at $p$ as a circle of length $\log p$; why primes do not interfere (independence of
$\log p$, Theorem 7.1.3.2); why the quotient of $\theta$-functions equals the quotient of all functions (strong
co-primality, using no zeros on $\operatorname{Re}s=1$); periodic orbits and archimedean fixed points as Deninger's picture,
told as an aside. Read: pp. 16 to 21, 35, 40 to 42; 4.2 (pp. 161 to 174), 4.4.2 (pp. 191 to 197); 7.1.3 (pp. 323 to
326), 7.3.1 (pp. 340 to 350), 7.4.2 (p. 367), 7.5 (pp. 374 to 380); Ch. 8 opening (pp. 381 to 382). Prerequisites: III.2.
Figures: a function on $\mathbb R_{>0}$ wrapped onto a circle of length $\log p$, with Fourier modes; the trace
$\sum_mM\varphi(2\pi im/\log p)$ versus $\log p\sum_k\varphi(p^k)$ balancing as $\varphi$'s support is dragged; orbits of
lengths $\log 2,\log3,\log5,\dots$ against a support window, primes going dark as they leave it; the zeros of
$1-p^{-s}$ on a vertical line for several $p$, meeting only at $0$.

**III.4 Choosing the topology: what a strip can see.**
Brief: Hardy-Sobolev norms, their Mellin picture as Hardy spaces on $|\operatorname{Re}z|<a$; point evaluations continuous
only inside the strip; the quotient by the closure of $\theta$-functions keeps only zeros in the strip; the spectral trace
as a sum over those zeros with Jordan blocks; contrast with Connes ($a=0$, $L^2$) and Meyer (fine topology, all zeros).
The zeros play no role in choosing the topology (pp. 35 to 36). Read: pp. 11 to 14, 31, 35 to 37, 44 to 47; 9.2
(pp. 403 to 419, statements), 10.1 (p. 434), 10.2.2 (pp. 445 to 447), 10.3 (pp. 447 to 455, statements), 10.4.1 to 10.4.2
(pp. 455 to 464, statements). Prerequisites: III.2.
Figures: the weight $\max(t^{2a},t^{-2a})$ and the strip on the Mellin side, with zeros inside and outside highlighted as
$a$ is dragged; a function whose Mellin transform is sampled at a point outside the strip, blowing up in norm (the
discontinuity of $\delta_{z_0}$); trace as the sum of diagonal entries of Jordan blocks.

**III.5 Cutting the kernel along the primes.**
Brief: kernels, the diagonal, and Lebesgue differentiation; spectral and geometric kernels and the proto-trace formula;
lifting to the ideles with a fundamental domain; the divisorial stratification as a sieve on the $\theta$-sum; each slice
acts on an orbital quotient; its trace vanishes for primes beyond the support; the shell structure as the convergence
statement; what is left is S-local. This is the chapter on the new heart; it should do the $\mathbb Q$ case in full. Read:
pp. 14 to 16, 21 to 27, 31 to 33, 47 to 52; 11.1 (pp. 475 to 483), 11.2 (pp. 483 to 491), 11.3 (pp. 491 to 496); 12.1
and 12.2 (pp. 497 to 513, statements); A.5 (statements, pp. 566 to 586). Prerequisites: III.3, III.4.
Figures: the sieve, with $\xi\in\mathbb Z[1/S]$ crossed out prime by prime and the $\theta$-sum changing; the idele strata as
nested boxes "unit at $2$, at $3$, at $5$"; the kernel on $\mathbb R_{>0}\times\mathbb R_{>0}$ with its diagonal and the slices'
diagonal masses summing to zero.

**III.6 The S-local trace and the Trace Formula.**
Brief: Connes's computation with the S-adelic Fourier transform; why the weight must be $1/2$ (the measure
$|x|\,d^\times x=dx$); Weil's local principal values at the places of $S$; assembly into Theorem 12.5.1.1; side-by-side
with Weil's explicit formula B.4.4.7: same left side, right side cut to the strip. Read: pp. 16, 27 to 28, 52 to 53; 12.4
and 12.5 (pp. 514 to 520); B.4.4 (pp. 620 to 626). Prerequisites: III.5; Part II chapter 8.
Figures: the two sides of the trace formula balancing for a chosen $\varphi$ (prime sum plus archimedean integral against
poles minus zeros in the strip), with $a$ adjustable; the local factor $|g|^{1/2}/|1-g|_p$ on $p^m\mathbb Z_p^\times$; how
$|x|^{1/2}|y|^{1/2}$ on the diagonal turns $d^\times x$ into $dx$.

**III.7 From the trace formula to GRH.**
Brief: the holomorphic family $t^{-z}\mathbf 1_{t>1}$, the prime side becomes $-L'/L(z+1/2)$, the strip-zero sum is
holomorphic outside the strip, so a zero outside the strip is a pole with nowhere to come from; $a\to0$; the functional
equation. Present the author's Montel argument and the shorter subtraction from Weil's formula (Section 7, ours). Then:
why positivity is not needed and cannot be used; "GRH is a topological phenomenon" (p. 31); what the work says about
function fields and why it fails there (14.2); the status of multiplicity claims (Section 9), stated neutrally. Read:
pp. 28 to 32, 35 to 38, 53 to 55; Ch. 13 (pp. 521 to 522); 14.1.2 (pp. 528 to 533) skim; 14.2 (pp. 534 to 536).
Prerequisites: III.6.
Figures: $-\zeta'/\zeta(z+1/2)$ as a landscape of poles, with the strip edge dragged and the right side's poles appearing
only inside it; the holomorphic family $\varphi_z$ and its smoothed truncations converging; a vertical strip in the
number-field case beside an annulus in the function-field case, with Euler-factor zeros piling up on the annulus.

---

Doubts recorded in place: the two endgames (Section 9); the limit inside the zero sum in Step 14 is only sketched
(p. 29); the over-$\mathbb Q$ constants in Section 5 are our specialization; Section 14.1.2's mention of a "Positivity
Criterion" conflicts with pp. 30 and 35.
