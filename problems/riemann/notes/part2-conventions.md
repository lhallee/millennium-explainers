# Part II conventions: the explicit formula, W, and the curve case

Owner: writer W4 (chapters 8 to 10). Every later chapter that uses the explicit formula, Weil's functional, or the
function-field objects uses these normalizations, or states its conversion from them.

## Test functions and transforms (chapter 8)

- **Test function class.** $C_c^\infty(0,\infty)$: smooth $f\colon(0,\infty)\to\CC$, complex valued, vanishing
  outside some $[a,b]$ with $0<a<b<\infty$ (`d-wp-test`). The converse of Weil's criterion also uses
  $f_a(x)=x^{-1/2-ic}(\log x)e^{-(\log x)^2/(4a)}$, reached by truncation (step 1 of the proof of `t-wp-criterion`).
- **Transform.** Mellin, multiplicative, measure $\dd x/x$: $\mathcal Mf(s)=\int_0^\infty f(x)x^{s}\,\dd x/x$
  (`eq-wp-mellin`), the same as chapter 3's `d-ct-mellin`. $\hat f$ stays the Fourier transform on $\RR$ per
  `NOTATION.md`. Inversion on every line: $f(x)=\frac1{2\pi i}\int_{(c)}\mathcal Mf(s)x^{-s}\,\dd s$. Plancherel lives
  on $\Re s=\tfrac12$ for $L^2((0,\infty),\dd x)$.
- **Why multiplicative.** Prime powers enter as $f(n)$; the note's weight $(X/n-1)_+$ and the monograph's
  $\int\phi(t)t^s\,\dd t/t$ are both in this language.
- **Convolution.** $(f*h)(x)=\int_0^\infty f(x/y)h(y)\,\dd y/y$; $\mathcal M(f*h)=\mathcal Mf\cdot\mathcal Mh$.
- **Transposed conjugate.** $\tilde f(x)=x^{-1}\overline{f(1/x)}$ (`d-wp-tilde`). Then
  $\mathcal M\tilde f(s)=\overline{\mathcal Mf(1-\bar s)}$ and $\mathcal M(f*\tilde f)(s)=\mathcal Mf(s)\overline{\mathcal Mf(1-\bar s)}$
  (`eq-wp-reflection`); $(f*\tilde f)(x)=\int_0^\infty f(xy)\overline{f(y)}\,\dd y$, which is Bombieri's
  $g(x)=\int f(xy)\bar f(y)\,\dd y$ in the Clay description.
- **Euler's constant** is $\gamma_E$ (as in chapters 1 to 7), never $\gamma$, which is $\Im\rho$.

## Weil's functional (chapter 8)

$W$ is **linear** in $g$. With $W_p$ and $W_\infty$ as in `d-wp-local-terms`:

$$
W(g)=\mathcal Mg(0)+\mathcal Mg(1)-\sum_p W_p(g)-W_\infty(g),
$$
$$
W_p(g)=\log p\sum_{k\ge1}\bigl(g(p^k)+p^{-k}g(p^{-k})\bigr),\qquad \sum_pW_p(g)=\sum_n\Lambda(n)\bigl(g(n)+g(1/n)/n\bigr),
$$
$$
W_\infty(g)=(\log4\pi+\gamma_E)\,g(1)+\int_1^\infty\bigl(g(x)+x^{-1}g(1/x)-2x^{-1}g(1)\bigr)\frac{\dd x}{x-x^{-1}}.
$$

- **Explicit formula** (`t-wp-explicit`, `eq-wp-explicit`): $\sum_\rho\mathcal Mg(\rho)=W(g)$ for $g\in C_c^\infty$,
  all nontrivial zeros with multiplicity, absolutely convergent. This is Bombieri's Clay form.
- **Sign.** Pole terms enter with $+$, every place ($p$ and $\infty$) with $-$. The zero sum is on the left alone.
- **Equivalent forms of the term at infinity**, all checked numerically to $10^{-8}$:
  $W_\infty(g)=(\log\pi)g(1)-\frac1{2\pi}\int_{\RR}\mathcal Mg(\tfrac12+it)\,\Re\frac{\Gamma'}{\Gamma}(\tfrac14+\tfrac{it}2)\,\dd t$
  (for real $g$), and per place $W_v(g)=\frac1{2\pi i}\int_{(c)}(\mathcal Mg(s)+\mathcal Mg(1-s))(-L_v'/L_v)(s)\,\dd s$ with
  $L_\infty=\pi^{-s/2}\Gamma(s/2)$ (`eq-wp-local`).
- **Quadratic form.** $W(f*\tilde f)=\sum_\rho\mathcal Mf(\rho)\overline{\mathcal Mf(1-\bar\rho)}$ (`eq-wp-quadratic`).
  Weil's criterion (`t-wp-criterion`): RH iff $W(f*\tilde f)\ge0$ for all $f\in C_c^\infty(0,\infty)$.
- **Check values.** Bump $f(x)=\phi(\log x)$, $\phi(u)=\exp(1-1/(1-(u/\log10)^2))$: $W(f)=0.0070064592$, equal to the
  zero side with 100 pairs. $\mathbf 1_{(0,1]}$: $\sum_\rho1/(\rho(1-\rho))=2+\gamma_E-\log4\pi=0.0461914$.

## Reading the note's "W(1_S)"

Our reading, not stated in the note: the note's $W(\mathbf 1_S)\ge0$ most plausibly means the quadratic form
$W(\mathbf 1_S*\widetilde{\mathbf 1_S})=\sum_\rho\mathcal M\mathbf 1_S(\rho)\overline{\mathcal M\mathbf 1_S(1-\bar\rho)}$, because for
$S=(0,1]$ this is $2+\gamma_E-\log4\pi>0$, a known positive constant. Indicators are outside $C_c^\infty$: their
transforms have poles at $0$ (and $\tilde{}$ at $1$), so the zero side converges but the prime side of
`eq-wp-explicit` needs regularization. Whoever writes Part IV must check the Lean definition of `W` against this
before using our symbol, and say which it is. Chapter 8 never writes $W(\mathbf 1_S)$; it writes $W(f*\tilde f)$, and
it says only that the note writes several steps as inequalities $W(\cdot)\ge0$, not that the second proof establishes
Weil's criterion (the Lean inventory did not find $W(\mathbf 1_S)$, and the formal endgame it located is a one-sided
bound on the smoothed sum and Landau's lemma, `Formalism.LandauStep`). Chapter 10 quotes the note's "$W(1_S)\ge0$ via a
determinant" verbatim and labels the link to multiplicity one as our reading.

## Mapping to the monograph's Appendix B.4 (Theorem B.4.2.2, PDF p. 616)

- Same transform: $\Phi(s)=\int\phi(t)t^s\,\dd t/t$.
- **Centered normalization.** Masullo evaluates at $\rho-\tfrac12$. Dictionary: $\phi(t)=t^{1/2}f(t)$, so
  $\Phi(s-\tfrac12)=\mathcal Mf(s)$; his $-\Phi(-\tfrac12)-\Phi(\tfrac12)+\sum_\rho\Phi(\rho-\tfrac12)$ is our
  $\sum_\rho\mathcal Mf(\rho)-\mathcal Mf(0)-\mathcal Mf(1)$, and his
  $\frac{\log Np}{Np^{m/2}}(\phi(Np^m)+\phi(Np^{-m}))$ is our $\log p\,(f(p^m)+p^{-m}f(p^{-m}))$ for $\chi=1$.
- He has the conductor term $\phi(1)\log A_\chi$, which is $0$ for $\zeta$, and characters $\chi(\mathfrak p)^m$,
  $\bar\chi(\mathfrak p)^m$ on the two prime terms. We treat only $\zeta$ over $\QQ$.
- **Archimedean term.** As printed in B.4.2.2 it does not converge: the summand $N_v\phi(1)/x$ is not integrable at
  $\infty$, and the kernel $e^{(2/N_v-1/2)x}/(1-e^{-2x/N_v})$ grows for $N_v=1$. The draft's own footnotes 14 and 15
  flag the formula for checking. Our derived form in his centered variable, checked numerically against the Gamma
  integral, is (real place, $\chi=1$):
  $$-(\log\pi)\phi(1)+\int_0^\infty\Bigl(\frac{\phi(1)e^{-2v}}{v}-\bigl(\phi(e^v)+\phi(e^{-v})\bigr)\frac{e^{-v/2}}{1-e^{-2v}}\Bigr)\dd v,$$
  which equals $-W_\infty(f)$. Part III writers should cite our form or Barner/Lang, not the printed B.4.2.2 line.
- The idelic form B.4.4.16 (Weil's principal values $\int'\phi(g)\abs g_v^{1/2}/\abs{1-g}_v\,\dd^\times g$ at every place)
  agrees with ours at finite places: on $\QQ_p^\times$ with $\phi$ depending only on $\abs x_p$ and units of volume
  $\log p$, it gives $\log p\sum_{k\ge1}p^{-k/2}(\phi(p^k)+\phi(p^{-k}))=W_p(f)$. We did not verify Masullo's
  archimedean principal-value constants.

## Additive (Guinand) form

$h(u)=f(e^u)e^{u/2}$, $H(t)=\mathcal Mf(\tfrac12+it)=\int h(u)e^{itu}\,\dd u$. Zero $\tfrac12+i\gamma$ contributes
$H(\gamma)$; poles give $H(i/2)+H(-i/2)$; prime powers give $\Lambda(n)n^{-1/2}(h(\log n)+h(-\log n))$. Note $H$ uses
$e^{+itu}$, so $H(t)=\hat h(-t/2\pi)$ with the page's Fourier convention.

## Function fields (chapters 9 and 10)

- $q=p^k$, $u=q^{-s}$, $Z(C,u)=\exp\sum N_nu^n/n=L(u)/((1-u)(1-qu))$, $L(u)=\prod_{i=1}^{2g}(1-\alpha_iu)$,
  $N_n=q^n+1-\sum\alpha_i^n$ (`eq-ff-explicit`). Functional equation: $\{\alpha_i\}$ stable under $\alpha\mapsto q/\alpha$.
- $\alpha_i=q^{\rho_i}$ with $\Re\rho_i=\tfrac12\iff\abs{\alpha_i}=\sqrt q$. The terms $q^n$ and $1$ are the poles at
  $s=1$ and $s=0$, the analogs of $\mathcal Mf(1)$ and $\mathcal Mf(0)$.
- `t-ff-rh-from-bound`: $\abs{N_n-q^n-1}\le Cq^{n/2}$ for large $n$, any $C$, forces $\abs{\alpha_i}=\sqrt q$. It uses that
  the multiplicities are positive (no cancellation of inverse roots).
- Chapter 10 (Bombieri's form): $q=p^{2\mu}$, $\sqrt q=p^\mu$, $q>(g+1)^4$, $A=\sqrt q-1$, $B=\sqrt q+2g$;
  auxiliary $F=\sum_ie_i^{p^\mu}b_i^q$ with $\sum_ie_i^{p^\mu}b_i\equiv0$; upper bound $N_1\le q+(2g+1)\sqrt q$
  (which implies Bombieri's $q+1+(2g+1)\sqrt q$). Twisted counts $N_\sigma=\#\{P:\Frob P=\sigma P\}$.
- Vocabulary set up for Part IV in `st-used`: the *multiplicity* of a Stepanov-type argument is the number of
  linear conditions each counted point imposes; *multiplicity one* is plain vanishing; the *determinant form* is
  the statement that the auxiliary function exists iff a square minor of the system vanishes, and over $\ZZ$ that
  determinant is an integer, which is $0$ once shown divisible by a large prime power and smaller than it.

## Symbols introduced that NOTATION.md lacks

$\mathcal Mf$; $C_c^\infty(0,\infty)$; $\int_{(c)}$; $W_p$, $W_\infty$, $W_v$; $L_p$, $L_\infty$; $\gamma_E$ (used
already in chapters 1 to 7); $\mathbf 1_S$; $f^\vee(x)=x^{-1}f(1/x)$ (inside one proof only); $I_n$ (irreducibles of
degree $n$); $\abs f=q^{\deg f}$; $a_d$ (closed points of degree $d$); $L(u)$; $\Frob$; $L(D)$, $\ell(D)$, $P_0$,
$p^\mu$, $A$, $B$, $N_\sigma$ (chapter 10).
