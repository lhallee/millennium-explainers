# Route A: reading of the four-page note

Source: L. Alpoge, untitled remark, `sources/riemann/remark.pdf`, read 2026-11-20. The note gives a 20-step
timeline in the order of discovery, compiled by Claude, which the author calls rough. This file regroups those
steps in logical order. The grouping and the one-line glosses are the main session's reading, to be corrected
against the Lean code (`notes/lean-map.md`). Step numbers are the note's.

## What the note states outright

- The result: RH, and by the same method GRH. The extended hypothesis is expected with more time.
- The argument "is a descendant of Stepanov's". Stepanov's proof over function fields "uses a divisor involving
  multiplicity", and "multiplicity is hard to find over the integers, corresponding to something like
  differentiating whole numbers".
- Two ideas were first combined in a toy setting, one of them new: "simple, new, Fourier-analytic ideas".
  These led to "chaining theta lifts" so that "the same tricks recur but work in a natively automorphic
  manner".
- "For the von Mangoldt sum of length $X$, Claude's suggested length of chain of theta lifts, in view of each
  mimicking multiplicity, was $\sqrt{X}$."
- The turning point: "multiplicity 2 on $O(2,n)$ via the natively-automorphic determinant", found by analogy
  with "the definite sign of the left-hand side of $qN = M^k + R$", after which "winning more multiplicity with
  more theta lifts" was the path.
- The author expects large simplifications and flags possible suboptimal choices (footnote 7 on step 19).

## Logical regrouping

### A. The toy setting: finite fields

| Step | Note's words | Gloss |
| --- | --- | --- |
| 1 | Stepanov determinant | Stepanov's auxiliary-function argument recast as a statement about a determinant. |
| 3 | $qN = M^k + R$, using $x_1 x_2 + \dots + x_{k-1}x_k$ | A "sign-only proof of Weil and Deligne" (page 2). Footnote 3: the sum $\sum_{h, x_1,\dots,x_k} t(x_1)\cdots t(x_k)\, e_q\!\big(h(x_1x_2+\dots+x_{k-1}x_k)\big)$; summing over $h$ first gives a left side of definite sign, the right side has main term $M^k$ and a remainder $R$ of square-root quality by iterating Parseval $k$ times; opposite signs mean the inverse roots cannot cancel. Gauss-sum cancellation is replaced by iterated Parseval. The "path" quadric $x_1x_2+\dots+x_{k-1}x_k$ is a simplification of a complete-graph structure. |
| 2 | $D^p \equiv 0$ on a CM curve for $p$ inert in $K$; $D^a\theta(0)/\Omega^a$ divisible by $p^{a/p + a/p^3 + \dots - O(\log a)}$ | A stand-in for differentiation and multiplicity: derivatives of theta at a CM point, divided by a period, are integers with high $p$-divisibility. |

### B. The positivity frame over the integers

| Step | Note's words | Gloss |
| --- | --- | --- |
| 4 | $W(\mathbb 1_S) \ge 0$ via a determinant, interpret as Stepanov with multiplicity one again; bootstrap | Weil's functional on an indicator function is shown nonnegative through a determinant. This is the multiplicity-one case. |
| 6 | $W\big(\mathbb 1_{(0,1]} + (\sim X^{\eta})\,\mathbb 1_{(0,1/X]}\big) \ge 0$ gives $> 1-\eta$ | Positivity on this two-piece test function yields a zero-free region to the right of $1-\eta$. Smaller $\eta$ needs more multiplicity. |
| 5 | Switch to $\sum_{n\le X}\Lambda(n)\big(\tfrac Xn - 1\big)_+ - X\log X + (1+\gamma)X$; Guinand and Weil had the sign; variance test function trick | The working object is this smoothed von Mangoldt sum. The explicit formula gives its sign structure, and a variance-type test function makes it look like a trace formula. |
| 7 | Determinants for $W(\cdot)$'s containing the desired periods, indeed GGP periods, with values 0, 1 meaning interlacing weights, or up to $m$ non-interlacing ones | The determinants' entries are periods of automorphic forms (Gan, Gross, and Prasad). Multiplicity $m$ corresponds to $m$ non-interlacing weights. |

### C. Multiplicity from theta lifts

| Step | Note's words | Gloss |
| --- | --- | --- |
| 8 | Iterated theta lifts $U(X_0)\to U(X_1)\to\dots\to U(X_m)$ between totally definite unitary groups, $\pi\mapsto \pi\boxplus\mu_j[t]$, wins multiplicity $m$. Time to take $m$ like $\sqrt X$ | Each lift adds one unit of multiplicity. Totally definite groups make automorphic forms functions on finite sets. |
| 12 | Seesaw: the period of the iterated lift is a Bessel period independent of the Hecke characters, Rallis | A seesaw identity evaluates the period of the lifted form. |
| 9 | Norms of the lifts and level and cancellation of order-$m$ terms with proven divisibility via Chowla and Selberg, Weyl, and Siegel mass | Size and integrality bookkeeping for the chain. |
| 10 | Sufficient lower bound on divisibility of the $m$-fold iterated lift | The integrality gain that plays the role of vanishing to order $m$. |
| 13 | Bost slope inequality | The Arakelov-geometry form of the auxiliary-function argument: an injective map between lattices with controlled heights and slopes. |
| 14 | Precise computation of the "cost" of each lift, showing that one would stop at 2/3 a priori; need for "division" | Without a further idea the method reaches only real part 2/3. |
| 15 | Glue together an integral structure across Hecke characters for a "gcd", extra averaging | The further idea: an integral structure shared across characters. |
| 16 | Relative trace formula; sixfold cover of $GL_5$ automorphy of $\mu$; Cauchy and Schwarz to a bound on the norm of a suitably projected Poincare series; approximate orthogonality of the columns of the integral structure | The analytic input that controls the averaged structure. |
| 18 | Computation of covolumes, theta series' index, congruences between lifts and forms | Remaining constants. |

### D. The arithmetic residue

| Step | Note's words | Gloss |
| --- | --- | --- |
| 11 | Iwasawa tower via analogy to pigeonhole on $\mathbb F_{q^n}/\mathbb F_q$ | The role of the constant-field extensions in Stepanov's argument is played by a tower of number fields. |
| 19 | Precise choice of the Iwasawa tower, specifically using Behrend | A specific tower is chosen (the author expects this to be unnecessary). |
| 17 | For the classes in $H^1\big(\mathfrak o_E[\tfrac1\ell], \mathbb Q_\ell/\mathbb Z_\ell(-e)\big)$ that we couldn't kill by twisting, fight for a significant weakening of Vandiver | An obstruction in Galois cohomology is removed by proving a weak form of Vandiver's conjecture. |
| 20 | GRH | |

## Search terms for the Lean tree

Stepanov, determinant, Weil functional or positivity or explicit formula, Guinand, vonMangoldt, theta lift,
Howe, seesaw, Rallis, Bessel, period, GGP or GanGrossPrasad, unitary, definite, Hermitian lattice, Siegel mass,
Chowla Selberg, slope, Bost, Arakelov, Poincare series, relative trace, metaplectic or cover, Iwasawa, tower,
Behrend, Vandiver, Hecke character, CM, Parseval, quadric, and the top-level names `riemannHypothesis`,
`rhOfAll`, `allChi`, `claimAll`, `critAll`.
