---
id: weil-positivity
title: Weil's explicit formula and the positivity criterion
part: 2
summary: State and derive Weil's explicit formula for an arbitrary test function, name its spectral, prime, and archimedean terms, and prove that the Riemann Hypothesis holds exactly when Weil's functional is nonnegative on every function of the form f * f~.
needs: [complex-toolkit, zeta-continued, zeros, explicit-formula, what-rh-says]
---

::: plain
The formula for counting primes from the previous part used one particular way of counting, a sharp cutoff at $x$. Any smooth way of weighting the primes works as well, and for every weighting the weighted sum over prime powers equals a sum over the zeros of zeta. André Weil noticed that when the weighting has a special "square" form, the sum over zeros is a sum of squares exactly when the Riemann Hypothesis holds. So the hypothesis is equivalent to a list of inequalities that mention only primes.
:::

Both proofs of 2026 pass through this chapter. Both use the explicit formula in Weil's general form, a duality between a sum over zeros and a sum over prime powers valid for every test function: the monograph behind one of them states it in this form [@masullo], and the note behind the other writes several of its steps as inequalities $W(\cdot) \ge 0$ for Weil's functional on chosen test functions, the kind of inequality that [[t-wp-criterion]] is about [@alpoge-note]. The chapter fixes the conventions that the later parts use: the class of test functions, the Mellin transform, the operation $f \mapsto \tilde f$, and the exact terms of Weil's functional $W$. It also explains in what sense the formula is a trace formula, which is the form in which [[function-fields]] finds it already proved for curves over finite fields.

## From one cutoff to every test function {#wp-test-functions}

Chapter [[explicit-formula]] proved von Mangoldt's formula $\psi_0(x) = x - \sum_\rho x^\rho/\rho - \log 2\pi - \tfrac12\log(1-x^{-2})$ by writing $\psi(x)$ as an integral of $-\zeta'/\zeta$ against the kernel $x^s/s$ and moving the line of integration to the left. The same argument applies to any weighting of the prime powers once the weighting is written in the right coordinates. Write the sharp cutoff as a function of $n$, $f(n) = 1$ for $n \le X$ and $0$ otherwise, so that $f = \mathbf 1_{(0,X]}$ and
$$
\psi(X) = \sum_{n \ge 1} \Lambda(n) f(n).
$$
The kernel $X^s/s$ of [[explicit-formula]] is then the Mellin transform of $f$, since $\int_0^X x^{s}\, \dd x/x = X^s/s$ for $\Re s > 0$, and Perron's formula is Mellin inversion of this transform evaluated at the integers $n$.

So the argument is a recipe with $f$ as its input. Take a function $f$ on $(0,\infty)$, form the weighted prime sum $\sum_n \Lambda(n) f(n)$, write it as an integral of $-\zeta'/\zeta$ against the Mellin transform of $f$, and move the line. Each pole of $-\zeta'/\zeta$ leaves a residue: the pole at $s = 1$ gives the transform of $f$ at $1$, each nontrivial zero $\rho$ gives minus the transform at $\rho$, and the trivial zeros give the transform at $-2, -4, \dots$. Von Mangoldt's formula is the case $f = \mathbf 1_{(0,X]}$, whose transform has an extra pole at $s = 0$ that produces the constant $-\log 2\pi$.

The sharp cutoff is the worst possible input. Its transform $X^s/s$ decays only like $1/\abs{t}$ along vertical lines, so the sum over zeros converges only conditionally and the formula holds at the jumps only in the averaged sense of $\psi_0$. Chapter [[what-rh-says]] replaced the cutoff by the ramp $f(x) = (X/x - 1)_+$, with transform $X^s/(s(s-1))$, and obtained for the smoothed sum $S(X)$
$$
\sum_{n \le X} \Lambda(n)\Bigl(\frac{X}{n} - 1\Bigr) = X\log X - (1+\gamma_E)X + \log 2\pi - \sum_\rho \frac{X^\rho}{\rho(\rho-1)} - \sum_{k \ge 1}\frac{X^{-2k}}{2k(2k+1)},
$$
with an absolutely convergent sum over zeros, where $\gamma_E = 0.5772\ldots$ is Euler's constant. At $X = 100$ the left side is $304.5171$, the main term $X\log X - (1+\gamma_E)X$ is $302.7955$, and the first 1000 pairs of zeros contribute $\sum_\rho X^\rho/(\rho(\rho-1)) = 0.1162$, which with $\log 2\pi = 1.8379$ reproduces the left side to within $7 \times 10^{-5}$. This smoothed sum, minus its main term, is the quantity the 2026 note works with [@alpoge-note].

A smoother $f$ gives faster convergence. If $f$ is infinitely differentiable with compact support in $(0,\infty)$, its transform decays faster than any power of $\abs{t}$, every sum in sight converges absolutely, and the formula holds with no averaging. That is the setting Guinand and Weil chose, and the one this chapter fixes [@guinand1948; @weil1952].

## The setting {#wp-setting}

The test functions live on the multiplicative group $(0,\infty)$, where the prime powers $n$ sit as points, and the transform is the Mellin transform of [[complex-toolkit]].

::: definition {#d-wp-test title="Test function"}
A test function is an infinitely differentiable function $f\colon (0,\infty) \to \CC$ that vanishes outside some closed interval $[a, b]$ with $0 < a < b < \infty$. The set of test functions is written $C_c^\infty(0,\infty)$. A test function is complex valued in general, and it is not required to be positive or real. It is a way of weighting the points of $(0,\infty)$, and in the explicit formula it weights the prime powers $n$ and their reciprocals $1/n$.
:::

::: definition {#d-wp-mellin title="Mellin transform of a test function"}
For a test function $f$ the Mellin transform is
$$
\mathcal M f(s) = \int_0^\infty f(x)\, x^{s}\, \frac{\dd x}{x}, \qquad s \in \CC,
$$ {#eq-wp-mellin}
the transform of [[complex-toolkit]]. It is an entire function of $s$, and it is a different object from the Fourier transform $\hat f$, which this page reserves for functions on $\RR$. The two are related by $x = e^u$: on the line $\Re s = c$, $\mathcal M f(c + it)$ is the Fourier transform of $u \mapsto f(e^u)e^{cu}$ evaluated at $-t/2\pi$.
:::

Four properties are used below, each a short consequence of the definition. Let $f$ vanish outside $[a,b]$.

1. $\mathcal Mf$ is entire, because the integral runs over the compact interval $[a,b]$ on which $x^s$ is entire in $s$.
2. $\mathcal Mf$ decays faster than any power of $\abs{t}$ on every vertical strip. Integration by parts gives $\mathcal M[x f'(x)](s) = -s\,\mathcal Mf(s)$, so $s^k \mathcal Mf(s) = (-1)^k \mathcal M[(x\tfrac{\dd}{\dd x})^k f](s)$, which is bounded by $\int_a^b \abs{(x\tfrac{\dd}{\dd x})^k f}\, x^{\sigma - 1}\, \dd x$ uniformly for $\sigma$ in a bounded interval.
3. Mellin inversion holds on every vertical line: $f(x) = \frac{1}{2\pi i}\int_{(c)} \mathcal Mf(s)\, x^{-s}\, \dd s$ for every real $c$, where $\int_{(c)}$ denotes the integral up the line $\Re s = c$.
4. Plancherel holds on the line $\Re s = \tfrac12$: $\int_0^\infty \abs{f(x)}^2\, \dd x = \frac{1}{2\pi}\int_{-\infty}^{\infty} \abs{\mathcal Mf(\tfrac12 + it)}^2\, \dd t$. This is Fourier's Plancherel theorem applied to $u \mapsto f(e^u)e^{u/2}$, whose square integrates to $\int \abs{f(e^u)}^2 e^u\, \dd u = \int \abs{f(x)}^2\, \dd x$.

The fourth property is the reason the critical line is special for this transform. Square-integrability with respect to $\dd x$ is measured on $\Re s = \tfrac12$ and nowhere else, so positivity statements about $\int \abs{f}^2$ become statements about values on that line.

We write the formula multiplicatively, in $x$ and $\mathcal Mf$, rather than additively in $u = \log x$ with a Fourier transform. The multiplicative form is the shortest: the prime powers enter as the values $f(n)$ at the integers themselves, and the powers $x^s$ are the characters of the group on which $n^{-s}$ lives. The 2026 sources use it too: the note weights $n$ by $(X/n - 1)_+$, and the monograph behind the other proof uses the same transform $\int \phi(t) t^s\, \dd t/t$ [@alpoge-note; @masullo]. The additive form appears once below for comparison.

## Weil's explicit formula {#wp-explicit}

The formula we derive equates the sum of $\mathcal Mf$ over the nontrivial zeros with an expression built from $f$ at the prime powers, from two values of $\mathcal Mf$ at the poles, and from one term that comes from the Gamma factor. To state it, we give the three kinds of term their names.

::: definition {#d-wp-local-terms title="Local terms of Weil's functional"}
For a test function $f$ and a prime $p$, the term at $p$ is the finite sum
$$
W_p(f) = \log p \sum_{k \ge 1} \Bigl( f(p^k) + p^{-k} f(p^{-k}) \Bigr).
$$ {#eq-wp-Wp}
The term at infinity is
$$
W_\infty(f) = \bigl(\log 4\pi + \gamma_E\bigr) f(1) + \int_1^\infty \Bigl( f(x) + x^{-1}f(x^{-1}) - 2x^{-1} f(1) \Bigr) \frac{\dd x}{x - x^{-1}}.
$$ {#eq-wp-Winf}
Both are linear in $f$. The term at $p$ reads $f$ only at the powers $p^{\pm k}$, and the term at infinity reads $f$ everywhere, with the subtraction of $2x^{-1}f(1)$ making the integrand bounded near $x = 1$. Neither is a sum over zeros.
:::

::: definition {#d-wp-functional title="Weil's functional"}
Weil's functional is the linear map $W\colon C_c^\infty(0,\infty) \to \CC$,
$$
W(f) = \mathcal Mf(0) + \mathcal Mf(1) - \sum_{p} W_p(f) - W_\infty(f).
$$ {#eq-wp-W}
Only finitely many $W_p(f)$ are nonzero, those with a power $p^k$ or $p^{-k}$ in the support of $f$, so $W(f)$ is a finite computation from $f$ and the primes. It is a linear functional, not a quadratic form, and in particular $W(f)$ need not be real or positive for a general test function.
:::

In terms of the von Mangoldt function the prime part is $\sum_p W_p(f) = \sum_{n \ge 1} \Lambda(n)\bigl(f(n) + n^{-1} f(n^{-1})\bigr)$, the form in which it is usually written.

::::: card {#t-wp-explicit kind="theorem" title="For every test function, the sum of its Mellin transform over the nontrivial zeros equals Weil's functional, built from the primes" source="weil1952"}
:::: statement
For every $f \in C_c^\infty(0,\infty)$,
$$
\sum_\rho \mathcal Mf(\rho) = \mathcal Mf(0) + \mathcal Mf(1) - \sum_{n \ge 1} \Lambda(n)\Bigl(f(n) + \frac{f(1/n)}{n}\Bigr) - W_\infty(f) = W(f),
$$ {#eq-wp-explicit}
where $\rho$ runs over the nontrivial zeros of $\zeta$ counted with multiplicity, the sum converges absolutely, and $W_\infty$ is [[eq-wp-Winf]].
::::
:::: plain
Choose any smooth way of weighting the numbers between $a$ and $b$. Weigh the prime powers with it, add two simple integrals and one correction, and the total equals a sum with one term for each zero of zeta. Every choice of weighting gives one equation linking the primes to the zeros.
::::
:::: why
Both 2026 sources use this statement: the monograph states it in Weil's form, and the note names Guinand and Weil and writes its positivity steps in terms of $W$. It turns any question about zeros into a question about primes for a family of test functions large enough to detect every zero, and [[t-wp-criterion]] uses it to rewrite the Riemann Hypothesis as an inequality with no zero in it.
::::
:::: idea
Nothing beyond [[explicit-formula]] is needed. Write the zero sum as a contour integral of $\mathcal Mf$ against $\xi'/\xi$ around the critical strip. The functional equation $\xi(s) = \xi(1-s)$ folds the left side of the contour onto the right side, replacing $\mathcal Mf(s)$ by $\mathcal Mf(s) + \mathcal Mf(1-s)$. On the right side $\xi'/\xi$ splits into the two poles, the Gamma factor, and the Dirichlet series of $\zeta'/\zeta$, and each piece integrates to one term of $W$.
::::
:::: proof {collapsed}
Write $\mathcal M f(1-s) = \mathcal M f^\vee(s)$ with $f^\vee(x) = x^{-1}f(x^{-1})$, which is again a test function, by the substitution $y = 1/x$ in [[eq-wp-mellin]]. Fix $c = 2$.

::: steps
1. The prime powers come from the Dirichlet series. For $\Re s = c > 1$ we have $-\zeta'/\zeta(s) = \sum_n \Lambda(n) n^{-s}$, which converges absolutely there, and $\mathcal Mf$ is integrable on the line, so exchanging sum and integral and applying Mellin inversion at $x = n$ gives
$$
\frac{1}{2\pi i}\int_{(c)} \mathcal Mf(s) \Bigl(-\frac{\zeta'}{\zeta}(s)\Bigr)\dd s = \sum_{n \ge 1}\Lambda(n) f(n).
$$
2. The completed function collects all poles. With $\xi(s) = \tfrac12 s(s-1)\pi^{-s/2}\Gamma(s/2)\zeta(s)$ from [[zeta-continued]], entire with zeros exactly at the nontrivial zeros of $\zeta$, the logarithmic derivative is
$$
\frac{\xi'}{\xi}(s) = \frac1s + \frac{1}{s-1} - \frac12\log\pi + \frac12\frac{\Gamma'}{\Gamma}\Bigl(\frac s2\Bigr) + \frac{\zeta'}{\zeta}(s).
$$
3. A rectangle gives the zero sum. Integrate $\mathcal Mf(s)\,\xi'/\xi(s)$ around the rectangle with vertical sides $\Re s = c$ and $\Re s = 1 - c$ and horizontal sides at heights $\pm T_k$, chosen as in [[explicit-formula]] so that $\abs{\xi'/\xi} \ll \log^2 T_k$ on them. The residue at a zero of multiplicity $m$ is $m\,\mathcal Mf(\rho)$, and the horizontal sides tend to $0$ because $\mathcal Mf$ decays faster than any power while $\xi'/\xi$ grows only like $\log^2 T_k$. The zero sum converges absolutely because $\abs{\mathcal Mf(\rho)} \ll (1+\abs{\gamma})^{-2}$ and there are $O(T\log T)$ zeros up to height $T$ by [[zeros]]. Hence
$$
\sum_\rho \mathcal Mf(\rho) = \frac{1}{2\pi i}\int_{(c)} \mathcal Mf(s)\frac{\xi'}{\xi}(s)\,\dd s - \frac{1}{2\pi i}\int_{(1-c)} \mathcal Mf(s)\frac{\xi'}{\xi}(s)\,\dd s.
$$
4. The functional equation folds the left line onto the right. Differentiating $\xi(s) = \xi(1-s)$ gives $\xi'/\xi(1-s) = -\xi'/\xi(s)$, and substituting $s = 1 - w$ on the left line (which reverses its orientation) gives
$$
\sum_\rho \mathcal Mf(\rho) = \frac{1}{2\pi i}\int_{(c)} \bigl(\mathcal Mf(s) + \mathcal Mf^\vee(s)\bigr)\frac{\xi'}{\xi}(s)\,\dd s.
$$
5. The term $\zeta'/\zeta$ gives the primes. By step 1 applied to $f$ and to $f^\vee$, it contributes $-\sum_n \Lambda(n)\bigl(f(n) + f^\vee(n)\bigr) = -\sum_n \Lambda(n)\bigl(f(n) + f(1/n)/n\bigr)$.
6. The two poles give two integrals. For any test function $h$ and real $a < c$, Perron's formula from [[explicit-formula]] (the integral $\frac{1}{2\pi i}\int_{(c-a)} y^w\, \dd w/w$ equals $1$ for $y > 1$ and $0$ for $y < 1$) gives $\frac{1}{2\pi i}\int_{(c)} \mathcal Mh(s)\, \dd s/(s-a) = \int_1^\infty h(x)x^{a}\,\dd x/x$. Applied with $a = 0, 1$ and $h = f, f^\vee$, and with $x \mapsto 1/x$ in the two integrals of $f^\vee$, the terms $1/s + 1/(s-1)$ contribute
$$
\int_1^\infty \bigl(f + f^\vee\bigr)(x)\,(1 + x)\,\frac{\dd x}{x} = \int_0^\infty f(x)(1+x)\,\frac{\dd x}{x} = \mathcal Mf(0) + \mathcal Mf(1).
$$
7. The constant gives a value at $1$. By Mellin inversion at $x = 1$, $\frac{1}{2\pi i}\int_{(c)}(\mathcal Mf + \mathcal Mf^\vee)\,\dd s = f(1) + f^\vee(1) = 2f(1)$, so $-\tfrac12\log\pi$ contributes $-(\log\pi)f(1)$.
8. The Gamma factor gives an integral over $x > 1$. Gauss's integral $\frac{\Gamma'}{\Gamma}(z) = \int_0^\infty \bigl(e^{-v}/v - e^{-zv}/(1-e^{-v})\bigr)\dd v$ for $\Re z > 0$ [@whittaker1927, §12.3], with $v = 2\log x$, reads
$$
\frac12\frac{\Gamma'}{\Gamma}\Bigl(\frac s2\Bigr) = \int_1^\infty \Bigl(\frac{x^{-2}}{2\log x} - \frac{x^{-s}}{1 - x^{-2}}\Bigr)\frac{\dd x}{x}.
$$
Pairing with $\mathcal Mf + \mathcal Mf^\vee$ and using Mellin inversion at each $x$ (the combined double integral converges absolutely, so the order may be exchanged) gives
$$
\int_1^\infty \Bigl( \frac{f(1)\,x^{-2}}{\log x} - \frac{f(x) + x^{-1}f(x^{-1})}{1 - x^{-2}}\Bigr)\frac{\dd x}{x} = -\bigl(\log 4 + \gamma_E\bigr) f(1) - \int_1^\infty\Bigl(f(x) + \frac{f(x^{-1})}{x} - \frac{2f(1)}{x}\Bigr)\frac{\dd x}{x - x^{-1}},
$$
where the second form adds and subtracts $2f(1)x^{-1}/(x - x^{-1})$ and uses $\int_1^\infty \bigl(x^{-3}/\log x - 2/(x^2-1)\bigr)\dd x = \frac{\Gamma'}{\Gamma}(\tfrac12) = -\gamma_E - \log 4$, which is Gauss's integral at $z = \tfrac12$ after $x = e^{v/2}$.
:::

Steps 7 and 8 together are $-W_\infty(f)$, steps 5 and 6 are the rest of $W(f)$, and step 4 equates their sum with $\sum_\rho \mathcal Mf(\rho)$.
::::
:::: example
Take the bump $f(x) = \phi(\log x)$ with $\phi(u) = \exp\bigl(1 - 1/(1 - (u/L)^2)\bigr)$ for $\abs{u} < L$ and $\phi = 0$ otherwise, with $L = \log 10$, so that $f$ lives on $[1/10, 10]$ and $f(1) = 1$. The prime powers in its support are $2, 3, 4, 5, 7, 8, 9$. Computed by quadrature, the terms are $\mathcal Mf(0) = 2.778991$, $\mathcal Mf(1) = 4.130176$, $\sum_n \Lambda(n)(f(n) + f(1/n)/n) = 3.457861$, and $W_\infty(f) = 3.108240 + 0.336060 = 3.444300$, so
$$
W(f) = 2.778991 + 4.130176 - 3.457861 - 3.444300 = 0.0070065.
$$
The large terms nearly cancel. The zero side, computed from the zeros $\tfrac12 \pm i\gamma_n$ as $2\sum_{n \le N}\Re\,\mathcal Mf(\tfrac12 + i\gamma_n)$, gives

| $N$ | 1 | 2 | 3 | 5 | 10 | 20 | 50 | 100 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| zero side | 0.0094732 | 0.0072936 | 0.0075110 | 0.0068999 | 0.0070392 | 0.0070068 | 0.00700645 | 0.0070064592 |

and with 100 pairs it agrees with $W(f) = 0.0070064592$ to ten decimal places. The first zero alone carries the sign and the size, and later zeros contribute corrections that shrink faster than any power of $\gamma_n$, as property 2 promises.
::::
:::: used
The functional $W$ is the subject of [[t-wp-criterion]]. Its terms are compared with local factors in [[wp-terms]] and with the curve case [[eq-ff-explicit]] in [[function-fields]].
::::
:::::

::: warning
The sum over zeros includes every nontrivial zero, not only those with positive ordinate, and it does not assume the Riemann Hypothesis. When $f$ is real valued, $\mathcal Mf(\bar\rho) = \overline{\mathcal Mf(\rho)}$, so the sum is $2\sum_{\gamma > 0}\Re\,\mathcal Mf(\rho)$, which is what the example computes. For complex $f$ the two halves must be computed separately.
:::

::: aside
In the variable $u = \log x$, with $h(u) = f(e^u)e^{u/2}$ and $H(t) = \mathcal Mf(\tfrac12 + it) = \int h(u)e^{itu}\,\dd u$, the formula becomes symmetric. A zero $\rho = \tfrac12 + i\gamma$ contributes $H(\gamma)$, where $\gamma$ is complex unless $\rho$ lies on the critical line, the poles contribute $H(i/2) + H(-i/2)$, and the prime powers contribute $\Lambda(n)n^{-1/2}\bigl(h(\log n) + h(-\log n)\bigr)$. This is the form in which Guinand stated his summation formula, a sum of $H$ over the ordinates of zeros against a sum of $h$ over the logarithms of prime powers [@guinand1948]. It is also the normalization of the monograph behind the other 2026 proof, which evaluates its transform at $\rho - \tfrac12$.
:::

::: figure {#f-wp-balance viz="explicit-balance" height="480"}
For any smooth bump on the logarithmic axis, the sum over the first few zeros and the weighted count of prime powers inside the bump settle on the same number.

```vizspec
Purpose: let the reader move a test function and watch both sides of Weil's explicit formula agree.
Scene: top panel, the axis u = log x from -5 to 5 (label the integer points x = 2, 3, 4, 5, 7, 8, 9, 11,
  13, 16, ... at u = log x and their reciprocals at -log x). The test function f(e^u) = phi((u - m)/w) is
  a blue filled bump, with phi(v) = exp(1 - 1/(1 - v^2)) for |v| < 1 and 0 otherwise (so the peak is 1).
  At each prime power n with log n in [-5, 5], a gold spike at u = log n of height Lambda(n) * f(n) and a
  gold spike at u = -log n of height Lambda(n) * f(1/n) / n; spikes outside the bump have height 0 and are
  drawn as faint muted ticks.
  Bottom panel, a balance: on the left pan the zero side Z_N = 2 * sum_{k<=N} Re M(1/2 + i gamma_k) as a
  teal bar; on the right pan the prime side W = M(0) + M(1) - sum_n Lambda(n)(f(n) + f(1/n)/n) - W_inf as a
  gold bar, with its four terms shown as a stacked breakdown on hover. The beam tilts by an angle
  proportional to arctan(100 (Z_N - W) / (|W| + 0.01)) and is level when they agree. Print both numbers
  to 8 decimals.
Formulas (u-form, all integrals in u by Simpson's rule on 2000 points over the support):
  M(s) = integral of f(e^u) e^{u s} du.  f(1) = phi(-m/w).
  W_inf = (log(4 pi) + 0.5772156649) f(1) + integral_0^inf (e^u f(e^u) + f(e^-u) - 2 f(1)) /
  (e^u - e^-u) du; the integrand tends to a finite limit at u = 0, start the grid at u = 1e-6, and
  integrate up to u = 30 (the tail is -2 f(1) e^{-u} beyond the support).
Controls: drag the bump horizontally to set its center m in [-3, 3]; drag its edge or use a slider to set
  the half-width w in [0.4, 3]; slider N (number of zero pairs) from 1 to 200; zero ordinates from the kit.
Motion: the teal bar animates as N increases; the gold bar changes as a log n enters the support (smoothly,
  because the bump vanishes to all orders at its edges).
Reader takeaway: the zero side converges after a handful of zeros for a wide bump and needs more for a
  narrow one, and every change of the prime side as a prime power enters the bump is matched by the zeros.
Check value: m = 0, w = log 10 gives W = 0.0070064592 and Z_100 = 0.0070064592; Z_1 = 0.0094732.
```
:::

## Three kinds of terms {#wp-terms}

The formula has three kinds of terms, and their names come from the trace formulas discussed at the end of the chapter. The zero side $\sum_\rho \mathcal Mf(\rho)$ is the spectral side: one term for each element of a spectrum. The prime side $\sum_p W_p(f)$ has one family of terms for each prime, and within the family for $p$ one term for each power $p^k$, which in $u = \log x$ sits at distance $k\log p$ from the origin. The term at infinity $W_\infty(f)$ comes from the Gamma factor. The two values $\mathcal Mf(0) + \mathcal Mf(1)$ come from the poles of $\xi'/\xi$ at $0$ and $1$, which in turn come from the pole of $\zeta$.

The term at infinity behaves like one more prime. Step 2 of the proof splits $\xi'/\xi$ into the poles and the logarithmic derivatives of local factors: $L_p(s) = (1 - p^{-s})^{-1}$ for each prime, whose product is $\zeta(s)$, and $L_\infty(s) = \pi^{-s/2}\Gamma(s/2)$, which [[zeta-continued]] attached to make the functional equation hold. Steps 5, 7, and 8 then show that every place $v$, finite or infinite, contributes in the same way,
$$
W_v(f) = \frac{1}{2\pi i}\int_{(c)}\bigl(\mathcal Mf(s) + \mathcal Mf(1-s)\bigr)\Bigl(-\frac{L_v'}{L_v}(s)\Bigr)\dd s, \qquad v = 2, 3, 5, \dots, \infty,
$$ {#eq-wp-local}
so that $W(f) = \mathcal Mf(0) + \mathcal Mf(1) - \sum_{v} W_v(f)$, a sum over all places with the infinite one included.

The two kinds of local factor differ only in where their "prime powers" sit. For a finite prime,
$$
-\frac{L_p'}{L_p}(s) = \sum_{k \ge 1} (\log p)\,(p^k)^{-s},
$$
a point mass of weight $\log p$ at each power $x = p^k$. For the infinite place, Gauss's integral from step 8 gives
$$
-\frac{L_\infty'}{L_\infty}(s) = \frac12\log\pi + \int_1^\infty \Bigl(\frac{x^{-s}}{1 - x^{-2}} - \frac{x^{-2}}{2\log x}\Bigr)\frac{\dd x}{x},
$$
a continuous density $(1 - x^{-2})^{-1}$ against $\dd x/x$ at every $x > 1$, with a constant subtracted to tame the divergence at $x = 1$. The infinite prime is a prime whose powers fill the whole half-line $x > 1$, with density close to $1$ for large $x$ and growing like $1/(2\log x)$ near $x = 1$. This reading is ours, a direct consequence of Gauss's integral. Weil gave the precise statement: every local term, finite or infinite, is a principal-value integral of $f$ over the completion $\QQ_v$ against one kernel $\abs{x}_v^{1/2}/\abs{1-x}_v$, so the primes and the place at infinity enter the formula by one rule [@weil1952]. In [[function-fields]] the analogy becomes literal, because there the place at infinity is an ordinary point of a curve.

::: figure {#f-wp-local viz="local-weights" height="400"}
A finite prime places its weight at the isolated points log p, 2 log p, 3 log p, and so on, while the infinite prime spreads the same kind of weight over the whole half-line.

```vizspec
Purpose: compare the local distributions -L_v'/L_v as weights on the half-line u = log x > 0.
Scene: one axis u from 0 to 6. For each selected prime p, gold vertical spikes at u = k log p (k >= 1)
  of height log p. For the infinite place, a blue filled curve of height 1 / (1 - e^{-2u}) (the density
  of -L_inf'/L_inf against du, since dx/x = du); clip at height 4 near u = 0 and mark the clipped part
  with a dashed outline and the label "renormalized".
  Second state (toggle "weigh by x^(-1/2)"): multiply every height by e^{-u/2}: spikes become
  log p * p^{-k/2}, the curve becomes e^{-u/2} / (1 - e^{-2u}). These are the weights with which the
  centered test function x^{1/2} f(x) is read in the explicit formula.
Controls: checkboxes for p in {2, 3, 5, 7, 11, 13} (default 2 and 3 on), a checkbox "all primes up to 50"
  that overlays every prime power (spikes at log n of height Lambda(n)), the toggle above.
Motion: spikes grow from 0 when a prime is switched on; the curve morphs on the toggle.
Reader takeaway: each place contributes "prime powers" with weights, discrete for p and continuous for
  infinity, and the explicit formula reads the test function against all of them in the same way.
```
:::

## Convolution and the transposed conjugate {#wp-convolution}

To turn the linear identity [[eq-wp-explicit]] into a positivity statement we need test functions whose transforms are squares on the critical line. The multiplicative group supplies them through convolution and one reflection.

::: definition {#d-wp-convolution title="Multiplicative convolution"}
For test functions $f$ and $h$, their convolution is the test function
$$
(f * h)(x) = \int_0^\infty f\Bigl(\frac{x}{y}\Bigr)h(y)\,\frac{\dd y}{y}.
$$
It is the convolution of the group $(0,\infty)$ with its invariant measure $\dd y/y$, and it is not the additive convolution $\int f(x-y)h(y)\,\dd y$ (though it becomes that in $u = \log x$). If $f$ vanishes outside $[a,b]$ and $h$ outside $[a',b']$, then $f*h$ vanishes outside $[aa', bb']$, so it is again a test function, and $\mathcal M(f*h) = \mathcal Mf\cdot\mathcal Mh$ by Fubini's theorem.
:::

::: definition {#d-wp-tilde title="Transposed conjugate"}
The transposed conjugate of a test function $f$ is
$$
\tilde f(x) = \frac{1}{x}\,\overline{f\Bigl(\frac1x\Bigr)}.
$$
It is a test function, supported on $[1/b, 1/a]$ when $f$ is supported on $[a,b]$. It is neither the complex conjugate $\bar f$ nor the reflection $f(1/x)$, but both at once with the factor $1/x$, and the factor is what makes convolution by $\tilde f$ the adjoint of convolution by $f$ for the inner product $\int_0^\infty h\bar k\,\dd x$ of property 4: $\int (f*h)\,\bar k\,\dd x = \int h\,\overline{(\tilde f*k)}\,\dd x$.
:::

::::: card {#t-wp-reflection kind="lemma" title="The transform of $f*\tilde f$ at $s$ is the transform of $f$ at $s$ times the conjugate of the transform of $f$ at the mirror image of $s$ in the critical line"}
:::: statement
For every test function $f$ and every $s \in \CC$,
$$
\mathcal M\tilde f(s) = \overline{\mathcal Mf(1 - \bar s)}, \qquad \mathcal M(f * \tilde f)(s) = \mathcal Mf(s)\,\overline{\mathcal Mf(1-\bar s)}.
$$ {#eq-wp-reflection}
The map $s \mapsto 1 - \bar s$ is the reflection in the critical line $\Re s = \tfrac12$, it fixes that line pointwise, and it permutes the nontrivial zeros of $\zeta$, preserving multiplicities. In particular $\mathcal M(f * \tilde f)(\tfrac12 + it) = \abs{\mathcal Mf(\tfrac12 + it)}^2 \ge 0$, and $(f*\tilde f)(x) = \int_0^\infty f(xy)\overline{f(y)}\,\dd y$.
::::
:::: plain
Pairing a test function with its transposed conjugate is the multiplicative version of multiplying a number by its own conjugate. On the critical line the result is a squared length, and off the line it pairs each point with its mirror image.
::::
:::: why
The explicit formula applied to $f * \tilde f$ has a zero side whose terms are products of $\mathcal Mf$ at a zero and at its mirror image. Whether those products are squares depends on whether each zero is its own mirror image, which is the Riemann Hypothesis.
::::
:::: idea
The substitution $y = 1/x$ in the transform of $\tilde f$ turns $x^{s}$ into $y^{1-s}$ against $\dd y/y$ and conjugates the rest. The mirror symmetry of the zeros is the symmetry $\xi(1 - \bar s) = \overline{\xi(s)}$ of [[zeta-continued]].
::::
:::: proof
Substituting $y = 1/x$, so that $\dd x/x$ becomes $\dd y/y$,
$$
\mathcal M\tilde f(s) = \int_0^\infty \overline{f(1/x)}\,x^{s-1}\frac{\dd x}{x} = \int_0^\infty \overline{f(y)}\,y^{1-s}\frac{\dd y}{y} = \overline{\int_0^\infty f(y)\,y^{1-\bar s}\frac{\dd y}{y}} = \overline{\mathcal Mf(1-\bar s)}.
$$
The product formula then follows from $\mathcal M(f*\tilde f) = \mathcal Mf\cdot\mathcal M\tilde f$. If $s = \tfrac12 + it$ then $1 - \bar s = s$, which gives the square. Since $\xi(\bar s) = \overline{\xi(s)}$ and $\xi(s) = \xi(1-s)$, we get $\xi(1-\bar s) = \overline{\xi(s)}$, so $\xi$ vanishes at $1 - \bar\rho$ to the same order as at $\rho$. Finally, $(f*\tilde f)(x) = \int f(x/y)\,y^{-1}\overline{f(1/y)}\,\dd y/y$, and $y = 1/v$ gives $\int f(xv)\overline{f(v)}\,\dd v$.
::::
:::: example
The indicator $f = \mathbf 1_{(0,1]}$ is not a test function, but it shows the mechanism with no calculus. Its transform is $1/s$ for $\Re s > 0$, its transposed conjugate is $x^{-1}\mathbf 1_{[1,\infty)}(x)$ with transform $1/(1-s)$ for $\Re s < 1$, and $f*\tilde f(x) = \min(1, 1/x)$ with transform $1/(s(1-s))$ in the strip. The zero sum is
$$
\sum_\rho \frac{1}{\rho(1-\rho)} = 2 + \gamma_E - \log 4\pi = 0.0461914,
$$
where the closed form comes from Hadamard's product as in [[zeros]] [@davenport, ch. 12]. The first 1000 zero pairs give $0.0447523$, and the tail estimate $\int_{T}^\infty 2t^{-2}\cdot\frac{1}{2\pi}\log\frac{t}{2\pi}\,\dd t = 0.0014397$ at $T = 1419.42$ brings the total to $0.0461920$. On the critical line each term is $1/(\tfrac14 + \gamma^2) = \abs{\rho}^{-2} > 0$. Functions of this kind, indicators of sets $S \subset (0,\infty)$, reappear in Part IV. For them the transforms have poles at $0$ or $1$, so $\mathcal M(f*\tilde f)(0)$ and $\mathcal M(f*\tilde f)(1)$ are infinite and the prime side of [[eq-wp-explicit]] must be regularized, while the zero side converges as it stands.
::::
:::: used
The lemma turns [[eq-wp-explicit]] into the quadratic form of [[t-wp-criterion]].
::::
:::::

## Weil's criterion {#wp-criterion}

Applying the explicit formula to $g = f*\tilde f$ and using [[eq-wp-reflection]] gives, for every test function $f$,
$$
W(f * \tilde f) = \sum_\rho \mathcal Mf(\rho)\,\overline{\mathcal Mf(1-\bar\rho)}.
$$ {#eq-wp-quadratic}
The left side is computed from primes. The right side is a Hermitian form in $f$, and its sign is decided by where the zeros are.

::::: card {#t-wp-criterion kind="theorem" title="The Riemann Hypothesis holds exactly when Weil's functional is nonnegative on every function of the form $f*\tilde f$" source="weil1952"}
:::: statement
The following are equivalent.

1. Every nontrivial zero of $\zeta$ has real part $\tfrac12$.
2. $W(f * \tilde f) \ge 0$ for every $f \in C_c^\infty(0,\infty)$.
::::
:::: plain
The hypothesis is true if and only if a certain explicit combination of prime-power values, formed from any smooth weighting and its mirror image, is never negative. No zero appears in the inequality.
::::
:::: why
This is the hinge of the page. It converts a statement about the location of infinitely many unknown complex numbers into infinitely many inequalities, each of which involves finitely many primes. The note behind one of the 2026 proofs writes several of its steps as inequalities $W(\cdot) \ge 0$ of this kind, for test functions it chooses [@alpoge-note].
::::
:::: idea
If every zero is on the line, every zero is its own mirror image, and [[eq-wp-quadratic]] is a sum of squares $\abs{\mathcal Mf(\rho)}^2$. If a zero $\rho_0$ is off the line, it and its mirror image $1 - \bar\rho_0$ contribute a cross term $2\Re\,\mathcal Mf(\rho_0)\overline{\mathcal Mf(1-\bar\rho_0)}$ that can be negative, and a test function concentrated near $\rho_0$, with a sign change built in, makes that cross term outweigh everything else.
::::
:::: proof {collapsed}
**From 1 to 2.** If $\Re\rho = \tfrac12$ then $1 - \bar\rho = \rho$, so by [[eq-wp-quadratic]] $W(f*\tilde f) = \sum_\rho \abs{\mathcal Mf(\rho)}^2 \ge 0$.

**From 2 to 1.** Assume 2 and suppose, for a contradiction, that $\rho_0 = \tfrac12 + \delta_0 + i\gamma_0$ is a zero with $\delta_0 \ne 0$. Replacing $\rho_0$ by its mirror image if needed, $\delta_0 > 0$. Write $Q(f) = \sum_\rho \mathcal Mf(\rho)\overline{\mathcal Mf(1-\bar\rho)}$ wherever this converges absolutely, so that $Q(f) = W(f*\tilde f) \ge 0$ for test functions.

::: steps
1. Positivity extends to Gaussian test functions. Let $f$ be smooth on $(0,\infty)$ with $\int_0^\infty \abs{(x\frac{\dd}{\dd x})^k f(x)}\,x^{\sigma}\,\frac{\dd x}{x} < \infty$ for all $k \ge 0$ and $0 \le \sigma \le 1$. Cut it off, $f_n(x) = f(x)\chi(\log x/n)$ with $\chi$ smooth, equal to $1$ on $[-1,1]$, and vanishing outside $[-2,2]$. The integrals above for $f - f_n$ tend to $0$, so by the integration by parts of property 2, $(1+\abs{t})^2\abs{\mathcal M(f-f_n)(\sigma+it)} \to 0$ uniformly for $0 \le \sigma \le 1$. Then $Q(f_n) \to Q(f)$ by dominated convergence, with majorant a constant times $(1+\abs{\gamma})^{-4}$, which is summable over zeros. Hence
$$
Q(f) \ge 0 \quad\text{for every such } f.
$$
2. A Gaussian test function has an explicit transform. For a real number $c$ and $a > 0$ set
$$
f_a(x) = x^{-1/2 - ic}\,(\log x)\,e^{-(\log x)^2/(4a)},
$$
which satisfies the hypothesis of step 1. With $w = s - \tfrac12 - ic$, completing the square in $\int u\,e^{-u^2/(4a)}e^{uw}\,\dd u$ gives $\mathcal Mf_a(s) = C_a\, w\, e^{a w^2}$ with $C_a = 2a\sqrt{4\pi a} > 0$. For the mirror point, $1 - \bar s - \tfrac12 - ic = -\bar w$, so $\overline{\mathcal Mf_a(1-\bar s)} = -C_a w e^{aw^2}$, and
$$
Q(f_a) = -C_a^2 \sum_\rho w_\rho^2\, e^{2a w_\rho^2}, \qquad w_\rho = \rho - \tfrac12 - ic = \delta_\rho + i(\gamma_\rho - c),
$$
where $\delta_\rho = \Re\rho - \tfrac12$. The size of each term is $\abs{w_\rho}^2 e^{2aE(\rho)}$ with $E(\rho) = \Re(w_\rho^2) = \delta_\rho^2 - (\gamma_\rho - c)^2$.
3. A choice of $c$ isolates one pair. Only finitely many zeros have $E(\rho) > -1$ for $c$ in a bounded interval, since that forces $\abs{\gamma_\rho - c} < 5/4$. For two such zeros with different ordinates, $E(\rho) = E(\rho')$ is a linear equation in $c$ with exactly one solution. Choose $c$ with $\abs{c - \gamma_0} < \delta_0$ outside this finite set of solutions. Then $E^* = \max_\rho E(\rho) \ge E(\rho_0) > 0$, and all zeros attaining $E^*$ share one ordinate $\gamma_*$ and have $\delta_\rho^2 = E^* + (\gamma_* - c)^2 > 0$. They are $\rho_* = \tfrac12 + \delta_* + i\gamma_*$ with $\delta_* > 0$ and its mirror image $\tfrac12 - \delta_* + i\gamma_*$, each with the same multiplicity $m \ge 1$ by [[t-wp-reflection]]. Every other zero has $E(\rho) \le E^* - \eta$ for some $\eta > 0$: the values of $E$ above $-1$ form a finite set, and the remaining values are at most $-1 < E^*$.
4. The pair dominates with a negative sign. With $w = \delta_* + i\tau$ and $\tau = \gamma_* - c$, the mirror image has $w' = -\bar w$, so the pair contributes $-C_a^2 m\bigl(w^2 e^{2aw^2} + \overline{w^2 e^{2aw^2}}\bigr) = -2mC_a^2\abs{w}^2 e^{2aE^*}\cos(\theta + 4a\delta_*\tau)$ with $\theta = \arg w^2$. Choose $a_k \to \infty$ with $\cos(\theta + 4a_k\delta_*\tau) = 1$ (any $a$ works if $\tau = 0$, since then $\theta = 0$). For $a \ge 1$ the other zeros contribute at most
$$
C_a^2 \sum_{\rho} \abs{w_\rho}^2 e^{2aE(\rho)} \le C_a^2\, e^{2(a-1)(E^* - \eta)}\, K, \qquad K = \sum_\rho \abs{w_\rho}^2 e^{2E(\rho)} < \infty,
$$
where $K$ is finite because $\abs{w_\rho}^2 e^{2E(\rho)} \le (\tfrac14 + (\gamma_\rho - c)^2)\,e^{1/2 - 2(\gamma_\rho - c)^2}$ and there are $O(T\log T)$ zeros up to height $T$.
5. The contradiction. Therefore
$$
Q(f_{a_k}) \le C_{a_k}^2\Bigl(-2m\abs{w}^2 e^{2a_kE^*} + K e^{2(a_k-1)(E^*-\eta)}\Bigr) < 0
$$
for all large $k$, contradicting step 1. So no zero lies off the line.
:::

Weil proved the criterion in 1952 [@weil1952], and Bombieri's description of the problem for the Clay Institute states it in this normalization [@bombieri2000]. The argument for the second direction is our arrangement of the standard idea, that a test function concentrated near an off-line zero detects it, made explicit with Gaussians so that every step can be checked.
::::
:::: used
Part IV returns to positivity of $W$ on the test functions the note uses, and to the one-sided upper bound that the formal proof establishes in its place. Its function-field counterpart, a positivity of a quadratic form in point counts, appears in [[ff-frobenius]] and in the aside on Weil's proof in [[stepanov]].
::::
:::::

::: warning
The criterion needs $W(f*\tilde f) \ge 0$ for every test function. Positivity of $W(g)$ for a single $g$, or for all real $g$, is a different statement, and it can fail or hold for reasons unrelated to the hypothesis: the bump of [[t-wp-explicit]] gave $W(f) = 0.0070 > 0$, but that $f$ is not of the form $h * \tilde h$. Conversely, a proof of positivity must cover a family of test functions rich enough to detect every zero, as the Gaussians of step 2 are.
:::

::: figure {#f-wp-offline viz="offline-zero" height="460"}
A zero pushed off the critical line pairs with its mirror image, and a Gaussian test function centered at its height turns their joint contribution negative, which no arrangement of zeros on the line can do.

```vizspec
Purpose: show how one off-line zero would make Weil's quadratic form negative.
Scene: left panel, the critical strip 0 <= Re s <= 1 for 0 <= Im s <= 60, the critical line in violet,
  the true zeros 1/2 + i gamma_k (gamma_k from the kit, k <= 12) as teal dots. One extra draggable red
  dot rho* = 1/2 + delta + i gamma* with its mirror image 1/2 - delta + i gamma* drawn as a red ring and a
  dashed segment joining them across the line. A horizontal blue band at height c shows where the
  Gaussian test function is centered, its thickness ~ 1/sqrt(a).
  Right panel, a bar chart: one bar per zero (true zeros and the hypothetical pair), of value
  T(rho) = -Re( w^2 exp(2 a w^2) ) with w = rho - 1/2 - i c; teal bars for zeros on the line (these are
  (gamma - c)^2 exp(-2 a (gamma - c)^2) >= 0), a red bar for the pair (sum of its two terms). Under the
  bars, the total Q / C_a^2 = sum of all bars, gold if >= 0 and red if < 0, on a symlog scale.
Controls: drag rho* (delta in [0, 0.45], gamma* in [10, 55]); slider c in [10, 55] (button "center on
  rho*" sets c = gamma*); slider a on a log scale from 0.3 to 30. A toggle "remove hypothetical zero".
Motion: as a increases with c = gamma*, the red bar grows like exp(2 a delta^2) while teal bars shrink.
Reader takeaway: with every zero on the line the total is a sum of nonnegative bars; a single off-line
  pair produces a negative bar that dominates as a grows.
Check: delta = 0.2, gamma* = c = 30, a = 10: pair bar = -2 * 0.04 * e^{0.8} = -0.178; the true zero at
  30.4249 gives 0.1805 * e^{-3.61} = 0.0049; total negative.
```
:::

## Why positivity is the hinge {#wp-hinge}

The criterion changes what a proof of the Riemann Hypothesis has to look like. Before it, a proof must locate zeros, objects defined by analytic continuation and known only numerically. After it, a proof must show that a functional built from primes is nonnegative on a cone of test functions. For $f$ supported on $[a,b]$, the function $f*\tilde f$ is supported on $[a/b, b/a]$, so $W(f*\tilde f)$ involves only the prime powers up to $b/a$, the values of $f$, and the explicit term at infinity. Each inequality is finite, and the hypothesis is the infinite conjunction of them.

The inequalities are not all equally hard. When $b/a < 2$ no prime power lies in the support, the prime side vanishes, and $W(f*\tilde f)$ is the pole terms minus $W_\infty(f*\tilde f)$. In that range only the place at infinity competes with the poles. Yoshida proved that the form is positive when the support is short enough, and Bombieri gave a new proof and studied the form on longer supports [@yoshida1992; @bombieri2000lincei]. The difficulty grows with the support, because longer supports admit more primes, and the hypothesis needs every support length.

This is also where the two worlds of this part meet. In [[function-fields]] the analog of [[eq-wp-quadratic]] is a quadratic form in the point counts of a curve, and the Riemann Hypothesis for curves is equivalent to its positivity. Weil's 1948 proof for curves established a positivity of exactly this shape, from the geometry of a surface, and [[stepanov]] gives a second proof that bounds the counts directly. The integers have no surface, and the question the later parts answer is how to establish the positivity without one.

::: aside
Other positivity criteria exist. Li showed that the hypothesis holds exactly when $\lambda_n = \sum_\rho \bigl(1 - (1 - 1/\rho)^n\bigr) \ge 0$ for every $n \ge 1$, the sum taken with $\rho$ and $\bar\rho$ together [@li1997]. The first coefficient is $\lambda_1 = \sum_\rho 1/\rho = 1 + \tfrac12\gamma_E - \tfrac12\log 4\pi = 0.0230957$, half the sum in the example of [[t-wp-reflection]].
:::

## A trace formula {#wp-trace}

The explicit formula has the shape of a trace formula, an identity that computes the trace of an operator in two ways. On one side the trace is a sum over the spectrum, the eigenvalues. On the other it is a sum over the periodic orbits of an underlying dynamical system, each orbit weighted by its length. Two settings make this precise with a known operator.

The first is the Selberg trace formula for a compact surface $X$ of constant negative curvature [@selberg1956; @hejhal1976]. The spectrum is the list of eigenvalues $\tfrac14 + r_j^2$ of the Laplacian on $X$, and the orbits are the closed geodesics. For an even test function $h$ with Fourier transform $g$, it reads, in outline,
$$
\sum_j h(r_j) = (\text{area term}) + \sum_{\text{closed geodesics } \gamma} \frac{\ell(\gamma_0)}{2\sinh(\ell(\gamma)/2)}\, g\bigl(\ell(\gamma)\bigr),
$$
where $\ell(\gamma)$ is the length of the geodesic and $\ell(\gamma_0)$ the length of the primitive geodesic it repeats. In the symmetric form of the aside after [[t-wp-explicit]], the prime powers enter as $\log p\cdot p^{-k/2}\,h(\pm k\log p)$: an orbit of length $\ell = k\log p$, repeating a primitive orbit of length $\log p$, with weight $\ell(\gamma_0)e^{-\ell/2}$, the large-$\ell$ form of Selberg's weight. The zeros are the spectrum, the primes are the primitive orbits, and $\log p$ is a length. The analogy has one twist, which is that the prime terms carry a minus sign where Selberg's orbits carry a plus sign. Connes's spectral interpretation explains the sign by realizing the zeros as an absorption spectrum on a space built from the adeles [@connes1999].

The second setting is a curve over a finite field, where [[function-fields]] shows that the zeros are the eigenvalues of the Frobenius map on a finite-dimensional space, the periodic orbits are the points of the curve over the fields $\FF_{q^n}$, and the explicit formula is the Lefschetz fixed point formula. There the operator is known and the formula is a theorem with a proof that explains it.

For the integers no such operator is known. The idea that the zeros $\tfrac12 + i\gamma$ might be the eigenvalues $\gamma$ of a self-adjoint operator, which would force $\gamma$ to be real and so prove the hypothesis, is attributed to Hilbert and Polya, neither of whom published it [@conrey2003]. Weil's criterion is the shadow such an operator would cast: if the zeros were the spectrum of a self-adjoint operator $D$, then $\sum_\rho \abs{\mathcal Mf(\rho)}^2$ would be the trace of the positive operator $\mathcal Mf(D)\mathcal Mf(D)^*$, and [[t-wp-criterion]] says that positivity of this trace, computed from primes, is all one needs. One of the 2026 proofs makes a trace formula of this kind into a theorem on the idele class group, the subject of Part III.

::: symbols
| Symbol | What it is | Kind | Where it lives |
| --- | --- | --- | --- |
| $C_c^\infty(0,\infty)$ | the test functions | vector space of functions | [[d-wp-test]] |
| $\mathcal Mf(s)$ | Mellin transform $\int_0^\infty f(x)x^s\,\dd x/x$ | entire function of $s$ | [[d-wp-mellin]] |
| $\int_{(c)}$ | integral up the line $\Re s = c$ | contour integral | [[wp-setting]] |
| $\gamma_E$ | Euler's constant, $0.5772157$ | real number | [[zeta-continued]] |
| $W_p(f)$, $W_\infty(f)$ | local terms at a prime and at infinity | linear functionals | [[d-wp-local-terms]] |
| $W(f)$ | Weil's functional | linear functional | [[d-wp-functional]] |
| $f * h$ | multiplicative convolution | test function | [[d-wp-convolution]] |
| $\tilde f$ | transposed conjugate $x^{-1}\overline{f(1/x)}$ | test function | [[d-wp-tilde]] |
| $L_p$, $L_\infty$ | local factors $(1-p^{-s})^{-1}$ and $\pi^{-s/2}\Gamma(s/2)$ | meromorphic functions | [[wp-terms]] |
:::

::: recap
- Any test function $f$ gives an explicit formula, [[t-wp-explicit]]: the sum of $\mathcal Mf$ over the zeros equals Weil's functional $W(f) = \mathcal Mf(0) + \mathcal Mf(1) - \sum_p W_p(f) - W_\infty(f)$, derived by the contour argument of [[explicit-formula]] with no new input.
- The terms are a spectral side (zeros), one family per prime $p$ at the powers $p^{\pm k}$, and a term at infinity from the Gamma factor, which is a prime whose powers fill the half-line.
- The transposed conjugate $\tilde f(x) = x^{-1}\overline{f(1/x)}$ gives $\mathcal M(f*\tilde f)(\rho) = \mathcal Mf(\rho)\overline{\mathcal Mf(1-\bar\rho)}$, a square on the critical line ([[t-wp-reflection]]).
- Weil's criterion [[t-wp-criterion]]: the hypothesis holds exactly when $W(f*\tilde f) \ge 0$ for every test function, an inequality about primes alone. The note behind the second proof writes several of its steps as inequalities of this kind.
- The formula is a trace formula with the zeros as spectrum and prime powers as orbits of length $k\log p$. For curves over finite fields the operator is Frobenius, which is where [[function-fields]] goes next.
:::
