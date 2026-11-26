---
id: route-a-compressed
title: "The second proof, shortened: one covolume squeezed from both sides"
part: 4
summary: After this chapter you can state the whole of Route A as one inequality, the covolume of a lattice of automorphic forms bounded above by short vectors and below by the product formula, say what one derivative costs in size and gains in divisibility and why the two main terms cancel exactly, see that the exponent one half is one over the number of lifts, and name the open cells of Stepanov's ledger that a shorter rewrite of the formal proof fills.
needs: [counting-primes, stepanov, landau-endgame, multiplicity-from-lifts, inputs-and-assembly]
---

::: plain
Five days after the second proof appeared, a rewrite of its formal proof was published that is about 150 times shorter and says in comments what each file is for. It shows the whole argument as Chebyshev's budget for a lattice: many short vectors, each divisible by many primes, span a box whose volume the product formula bounds from below. The main terms of size and divisibility cancel exactly, so what is left is the error in counting primes multiplied by the number of lifts, and that number is about the square root of the scale.
:::

The formal proof of chapters [[route-a-plan]] to [[inputs-and-assembly]] is a tree of 175,187 files with no comments, and those chapters reconstructed its argument from declaration names, which left several links of the chain untraced ([[ml-gaps]]). On 2026-11-25 a rewrite of it appeared in the repository `grh-lean`. Its README calls it "a shorter rewriting of Levent Alpöge's Lean proof" that "follows that proof's method", with many steps "proved by other arguments", and says that its Lean text and documents were written by Claude [@grh-lean]. Its files open with comments that say what each step is for, and its main inequality comes with a list of its inputs, of what cancels, of the scales, and of the errors. This chapter reads that account. It states the main inequality and derives the theorem from it in the order the code does, explains each side with the tools of Part I and of chapters [[stepanov]] and [[multiplicity-from-lifts]], and sets the result beside Stepanov's ledger of [[ml-ledger]]. Statements about the rewrite cite its files, our reading is marked where it starts, and nothing here replaces the account of the original tree in the chapters before.

## What the rewrite is {#rc-source}

The repository holds two editions of one proof, each its own Lean project built on Mathlib [@grh-lean]. The readable edition, in the folder `grh`, has about 300,000 lines of code by its authors' count, and the compact edition, `grh-compact`, about 76,000. Both prove the five theorems of [[ra-proved]], and the file `NOTICE` says that the statements file and the names and types of the five theorems are taken from the original unchanged. The table sets the three side by side. We counted the files and lines of the two editions ourselves, every line of every `.lean` file, the same rule by which chapter [[s-ia-shape]] counted the original.

| | Original tree | Readable edition | Compact edition |
| --- | --- | --- | --- |
| Lean files | 175,187 | 805 | 796 |
| Lines in all | 17,374,215 | 477,151 | 112,854 |
| Lines of code, by the authors' count | not stated | about 300,000 | about 76,000 |
| Comments | none | a head on all but two files in `src`, and docstrings | a head on all but two files in `src`, and docstrings |
| Lean and Mathlib | 4.33.1 and `0df444a360ea` | 4.35.0 and `56a00585` | 4.35.0 and `56a00585` |

Each edition splits its files in two. The folder `Lib` holds background results "classed as known in the literature" that Mathlib lacks, with their proofs, and it imports nothing from the folder `New`, which holds the set-up and the steps of the argument (`GUIDE.md` of each edition). The compact edition's README says its proofs "are written to be short, not to be easy to read", and the readable edition's guide gives the reading order this chapter follows.

The README of the compact edition reports three machine checks, and we repeat them as reports, since we read the rewrite and did not build it, as we did with the original ([[s-ia-integrity]]). Every file compiles with the pinned Lean and Mathlib without errors or `sorry` and was replayed through Lean's kernel. For each of the five theorems, `#print axioms` lists only propositional extensionality, the axiom of choice, and the soundness of quotients. And the tool Comparator, which checks the proved theorems against a separate file that states them with `sorry` in place of proofs, accepted the proofs. Lean checks statements and proofs, and the authors point out that it checks "neither comments nor this guide" (`GUIDE.md` of the compact edition). So this chapter takes the comments as the authors' account and checks each statement it relies on against the code.

## The whole argument in one inequality {#rc-spine}

For each large scale $x$ the rewrite fixes a bundle of choices that it calls admissible data, and the whole proof is an inequality about one bundle. The pieces that the inequality mentions are few.

::: definition {#d-rc-data title="The parameters and scales of the rewrite"}
The parameters are a modulus $q_0$ that is a multiple of $18480 = 2^4\cdot3\cdot5\cdot7\cdot11$, and a prime $\mathsf d \equiv q_0/2 - 1 \pmod{q_0}$. They fix the imaginary quadratic field $K = \QQ(\sqrt{-\mathsf d})$, whose quadratic character $\chi_{\mathsf d}$ is the Legendre symbol $(\cdot/\mathsf d)$, and the weights
$$
\Lambda_{\mathsf d}(n) = \Lambda(n)\,\big(1 - \chi_{\mathsf d}(n)\big),
$$ {#eq-rc-lambda}
which count only prime powers that do not split in $K$: an inert prime $p$ contributes $2\log p$ at its odd powers and nothing at its even ones, a split prime contributes nothing, and $\mathsf d$ contributes $\log\mathsf d$. A bundle of data at the scale $x$ adds three scales $x \ll x_1 \ll b$, with $(\log b)^{100} \le x$, $x^{10^6} \le x_1$, $x_1^{10^6} \le b$, and $\log b$ about $x^\varepsilon$ for a small $\varepsilon > 0$, the long order $a = xb$ of the derivatives, and the number of theta lifts $m$, the least power of $2$ that is at least $\sqrt x$, so that $\sqrt x \le m \le 2\sqrt x$. It adds a CM field $E$ that contains $K$ and roots of unity of a large order, with $n_E$ complex places, between $x^{11}$ and $x^{12}$ of them, and a weight $\kappa_\tau$ for each complex place $\tau$ of $E$, equal to $b$ on a sparse set of places and to $a/x_1$ on the others.
:::

::: lean {decl="New.Data" file="grh/src/New/Reduction/Data/AdmissibleData.lean"}
The structure of admissible data; `New/Reduction/Data/Sizes.lean` tabulates its sizes, among them $\sqrt x \le m \le 2\sqrt x$ and $x^{11} \le n_E \le x^{12}$ (the code's `f`).
:::

Two numbers carry the arithmetic. The first is the remainder of a weighted count of non-split prime powers in the class $1$ modulo $q$,
$$
R_q(x) = \sum_{\substack{n\le x\\ n\equiv1\ (q)}} \Lambda_{\mathsf d}(n)\Big(\frac1n - \frac1x\Big) - \frac{\log x}{\varphi(q)} - c_q ,
$$ {#eq-rc-remainder}
where $c_q$ is the constant for which $R_q(x)\to0$ (`primeRemainder`). The Dirichlet series of its weights, $\sum_{n\equiv1\,(q)}\Lambda_{\mathsf d}(n)\,n^{-s}$, is an average of $-\frac{L'}{L}(s,\psi) + \frac{L'}{L}(s,\psi\chi_{\mathsf d})$ over the characters $\psi$ modulo $q$, and it has poles at the zeros of these L-functions. If those zeros lie on the critical line, then $R_q(x)$ is at most about $x^{-1/2}$ in size, as the explicit formula of chapter [[explicit-formula]] shows for $\psi(x)$. The proof goes the other way, bounding $R_{q_0}(x)$ from above by about $x^{-1/2}$ and concluding that there are no zeros to the right of the line. The second is the total remainder $\mathrm{rem}$, the prime sums of section [[rc-direction]] at a set $\Phi_a$ of complex places of $E$ less their expected value. It is a multiple of $R_{q_0}(x)$ plus terms at the much larger scale $x_1$.

::::: card {#t-rc-main kind="theorem" title="The number of lifts times the total remainder is at most $n_E\,a\,(\log b)^5$" source="grh-lean"}
:::: statement
For admissible data,
$$
m\,\mathrm{rem} \;\le\; n_E\,a\,(\log b)^5 .
$$ {#eq-rc-main}
::::
:::: plain
The error in counting non-split primes, added up over many places and multiplied by the number of lifts in the chain, is at most a fixed power of $\log b$ times the number of places times the order of the derivatives.
::::
:::: why
Everything after this inequality is a short deduction, and everything before it, the theta lifts, the theta functions with complex multiplication, the Galois representations, and the product formula, exists to prove it. It is the rewrite's form of the bound that chapter [[landau-endgame]] consumes.
::::
:::: idea
One number is bounded from both sides. Take a family of $n_F$ independent target forms, lift them by the chain of $m$ theta lifts, and let $\mathcal V$ bound the logarithm of the Gram determinant of the lifts, their squared covolume, and $\mathcal I$ bound the denominators that the family needs in order to become integral, its index. With $D_T$ the dimension of the space of target forms and $h_{\mathrm{main}}$ a main amount defined in section [[rc-direction]], up to errors,
$$
h_{\mathrm{main}} \;\lesssim\; \frac{\mathcal V + 2\,\mathcal I}{D_T} \;\lesssim\; h_{\mathrm{main}} - \frac{n_F}{D_T}\, m\,\mathrm{rem}.
$$ {#eq-rc-squeeze}
The upper bound holds because the forms are short, which is Theorems A and B of the rewrite, and the lower bound because integral forms are long, which is its Theorem C. The main amount cancels, and the remainder is left on one side.
::::
:::: proof
Write $\mathcal E = n_E\,a\,(\log b)^4$ for the unit of error and $\mathcal J = 10\log(1+2b^2)\,n_E\,a\,(\log b)^3$ for the index per dimension. The steps follow the proof of `star_inequality` in the readable edition.

::: steps
1. Theorem B gives a set $t$ of translates of a fixed map $\mathfrak p$ from the source forms to the target forms, with $\#t\cdot\dim(\text{source}) \le 5D_T\log(1+2b^2)$, whose images span at least $(1-4/b^2)D_T$ dimensions.
$$
\dim \sum_{s\in t} s\mathfrak p(\text{source}) \;\ge\; \Big(1 - \frac4{b^2}\Big)D_T .
$$
2. Theorem A(a) says that the source is spanned by integral forms $\varphi$ whose images have short lifts, at every translate $s$ and every automorphism $\sigma$ of $\CC$.
$$
\lVert \Theta_1\, s\mathfrak p\,\varphi\rVert_\sigma^2 \;\le\; \exp\big(h_{\mathrm{main}} - m\,\mathrm{rem} + \mathcal E\big).
$$
3. A basis $y_1, \dots, y_{n_F}$ of the span of these short images is a family of independent target forms with many members, since $b$ is large.
$$
n_F \;\ge\; \Big(1 - \frac4{b^2}\Big)D_T \;\ge\; \frac{D_T}2 .
$$
4. Hadamard's inequality ([[t-rc-hadamard]] below) bounds the squared covolume by the product of the squared lengths.
$$
\mathcal V = n_F\big(h_{\mathrm{main}} - m\,\mathrm{rem} + \mathcal E\big).
$$
5. Theorem A(b) bounds the index of the family by $\#t\cdot\dim(\text{source})\cdot 2n_Ea(\log b)^3$, which step 1 turns into a bound per dimension.
$$
\mathcal I = D_T\,\mathcal J .
$$
6. Theorem C, applied to the family with these bounds, says that integral forms are long.
$$
D_T\big(h_{\mathrm{main}} - 3\mathcal E\big) \;\le\; \mathcal V + 2\,\mathcal I .
$$
7. Insert steps 4 and 5 into step 6, and use $n_F \le D_T$ and $h_{\mathrm{main}} + \mathcal E \ge 0$, so that $n_F(h_{\mathrm{main}} + \mathcal E) \le D_T(h_{\mathrm{main}} + \mathcal E)$. The terms $D_T\,h_{\mathrm{main}}$ cancel.
$$
n_F\, m\,\mathrm{rem} \;\le\; D_T\big(4\mathcal E + 2\mathcal J\big).
$$
8. Divide by $n_F \ge D_T/2$. Since $\log(1+2b^2) \le 2\log b + \log 3$, the right side is at most $n_E\,a\,(\log b)^3\,(88\log b + 44)$, and $(\log b)^2 \ge 88\log b + 44$ once $\log b \ge 89$, which holds with an enormous margin.
$$
m\,\mathrm{rem} \;\le\; 8\mathcal E + 4\mathcal J \;\le\; n_E\,a\,(\log b)^5 .
$$
:::
If $\mathrm{rem} < 0$ the conclusion holds at once, so step 8 may assume $\mathrm{rem}\ge0$. The main amount is at least $x^4 n_E a$ (`le_mainAmount`), far larger than every error, and it enters both bounds with the same coefficient, which is why it can cancel. Sections [[rc-lattice]] and [[rc-gaps]] describe Theorems A, B, and C, and their proofs are not unfolded here.
::::
:::: lean {decl="New.star_inequality" file="grh/src/New/Reduction/MainInequality.lean"}
The main inequality, with Theorem A as `span_short_integralRamified_eq_top` and `indexLe_normalizedPoincare` and Theorem B as `enough_forms` in `New/Reduction/ShortAndEnough.lean`, and Theorem C as `integral_forms_long` in `New/Determinant/Twist/LongForms.lean`; the compact edition proves the same inequality as `star_inequality` in `src/New/Main.lean`.
::::
:::: used
The one-sided bound below, and through it the theorem of [[ra-proved]].
::::
:::::

The rest of the proof is short. Dividing [[eq-rc-main]] by $m$, by $a$, and by the number of places that carry the weight $b$, and using that these are at least $n_E/(\varphi(q_0)\log b)$ in number, the rewrite obtains
$$
R_{q_0}(x) \;\le\; \frac{\varphi(q_0)\,(\log b)^6}{m} + \big\lvert R_{q_0}(x_1)\big\rvert + \log b\,\big\lvert R_1(x_1)\big\rvert
$$ {#eq-rc-onesided-data}
(`Data.primeRemainder_le`). At the much larger scale $x_1$ the prime number theorem in the class $1$ modulo $q$ suffices: $\lvert R_q(x_1)\rvert \le (\log x_1)^{-B}$ for every fixed $B$ and all large $x_1$, by a Tauberian theorem or by the Siegel and Walfisz theorem (`eventually_abs_primeRemainder_le`), and the data have $\log x_1 \ge x^{\varepsilon/12}$, so the last two terms are smaller than every power of $x$. With $\log b \le 2x^\varepsilon$ and $m \ge \sqrt x$, the first term is at most $64\,\varphi(q_0)\,x^{-1/2+6\varepsilon}$, and for $0<\varepsilon<1/100$ and all large $x$,
$$
R_{q_0}(x) \;\le\; \big(64\,\varphi(q_0) + 3\big)\,x^{-1/2 + 6\varepsilon}
$$ {#eq-rc-onesided}
(`GUIDE.md` of the readable edition, section 3, and `eventually_primeRemainder_le_rpow`). A one-sided criterion of Landau's kind then turns this into the half-plane $\Re s > \tfrac12$, as section [[rc-endgame]] describes.

## Chebyshev's budget for a lattice {#rc-lattice}

The two sides of [[eq-rc-squeeze]] are a lattice version of the budget of [[cp-chebyshev]], and in the plane they can be seen. This section proves the two facts in their simplest form and then says what each becomes in the rewrite.

::: definition {#d-rc-gram title="Gram determinant and covolume"}
Let $v_1, \dots, v_n$ be vectors in $\RR^N$. Their Gram matrix is the $n\times n$ matrix $G$ with entries $G_{ij} = \langle v_i, v_j\rangle$, and their Gram determinant is $\det G$. It is a number, not a vector, and it is never negative: it is zero exactly when the vectors are dependent, and for independent vectors $\sqrt{\det G}$ is the $n$-dimensional volume of the parallelepiped they span, which for two vectors in the plane is the area $\lvert\det(v_1, v_2)\rvert$ of their parallelogram. The rewrite calls a bound for $\log\det G$ of a family of lifted forms, at every conjugate, a bound for its covolume (`TwistedLattice.CovolumeLe`).
:::

::::: card {#t-rc-hadamard kind="lemma" title="Independent integral vectors that are all divisible by $c$ have Gram determinant between $c^{2n}$ and the product of their squared lengths" source="hadamard1893-determinants"}
:::: statement
Let $v_1, \dots, v_n \in \ZZ^N$ be independent, and let $c \ge 1$ be an integer that divides every coordinate of every $v_i$. Then
$$
c^{2n} \;\le\; \det G \;\le\; \prod_{i=1}^n \lvert v_i\rvert^2 .
$$ {#eq-rc-hadamard}
::::
:::: plain
A box spanned by vectors with integer coordinates has volume at least one, and at least $c^n$ if every coordinate is a multiple of $c$, while no box is larger than the product of its edge lengths. So vectors that are highly divisible cannot all be short.
::::
:::: why
The right inequality is Hadamard's [@hadamard1893-determinants], and it is the upper bound of the rewrite: short vectors give a small covolume. The left inequality is the product formula in its simplest form, a nonzero integer has absolute value at least one, and it is the lower bound. Between them sits the budget of [[eq-cp-budget]], with $\log c$ in place of the prime factors and the lengths in place of the size.
::::
:::: idea
Gram and Schmidt replace the vectors by orthogonal ones without changing the determinant and without making any vector longer, which gives the right side. The Gram matrix has integer entries, which gives the left side after dividing by $c$.
::::
:::: proof
::: steps
1. Apply the Gram and Schmidt process: $w_1 = v_1$, and $w_i$ is $v_i$ minus its orthogonal projection onto the span of $v_1, \dots, v_{i-1}$. The matrix that takes the $v_i$ to the $w_i$ is triangular with ones on the diagonal, so it has determinant $1$, and the $w_i$ are orthogonal.
$$
\det G = \det\big(\langle w_i, w_j\rangle\big) = \prod_{i=1}^n \lvert w_i\rvert^2 .
$$
2. A projection never lengthens a vector, so $\lvert w_i\rvert \le \lvert v_i\rvert$ for every $i$, which is Hadamard's inequality.
$$
\det G \;\le\; \prod_{i=1}^n \lvert v_i\rvert^2 .
$$
3. The vectors $u_i = v_i/c$ have integer coordinates, so their Gram matrix has integer entries and an integer determinant, which is positive because the $u_i$ are independent.
$$
\det\big(\langle u_i, u_j\rangle\big) \;\ge\; 1 .
$$
4. Each entry of $G$ is $c^2$ times the corresponding entry for the $u_i$, so $\det G$ is $c^{2n}$ times their determinant.
$$
\det G = c^{2n}\det\big(\langle u_i, u_j\rangle\big) \;\ge\; c^{2n} .
$$
:::
::::
:::: example
Take $u = (6, 3)$ and $v = (3, 6)$, so $c = 3$. The Gram matrix has entries $45, 36, 36, 45$, and $\det G = 45^2 - 36^2 = 729 = 27^2$, the square of the area $\lvert\det(u, v)\rvert = 36 - 9 = 27$. The lemma reads $3^4 = 81 \le 729 \le 45\cdot45 = 2025$. Dividing by $3$ gives $(2,1)$ and $(1,2)$, with Gram determinant $25 - 16 = 9 \ge 1$. In logarithms of the area, $2\log 3 = 2.197 \le \log 27 = 3.296 \le \log 45 = 3.807$, the three bars of [[f-rc-lattice]].
::::
:::: used
Step 4 of the proof of [[t-rc-main]] uses the right side, and Theorem C is a refined form of the left side.
::::
:::::

::: figure {#f-rc-lattice viz="covolume-squeeze" height="440"}
Integral vectors that are independent and all divisible by $c$ span a parallelogram of area at least $c^2$, and the area is at most the product of their lengths, so divisibility forces length.

```vizspec
Purpose: show in the plane the two facts the rewrite's main inequality rests on, Hadamard's bound and integrality,
  and that together they make divisible vectors long.
Scene: left panel, the lattice Z^2 as muted dots in a window [-9, 9]^2 that widens when the vectors grow; two
  integral vectors u and v from the origin with draggable tips labeled u and v, their parallelogram lightly filled.
  When c = gcd of the four coordinates is above 1, the parallelogram of u/c and v/c is filled in gold with a dashed
  outline. Right panel, three bars in units of the natural logarithm on a common axis: "divisibility" 2 log c in
  gold, "area" log |det(u, v)| in a neutral fill, "lengths" log |u| + log |v| in blue, each with its value above it
  and a "<=" sign between neighbors. Top line: u, v, c, and |det(u, v)|; on wide stages the chain
  c^2 <= |det(u, v)| <= |u| |v| at the right.
Controls: drag either tip to another lattice point (snap to integers, never the origin); buttons "Multiply by 2"
  (both vectors, while the coordinates stay at most 64) and "Divide by c" (enabled when c > 1); reset.
Motion: bars grow over 300 ms when the vectors change; the window follows the vectors smoothly.
Reader takeaway: every bar moves by the same 2 log 2 under "Multiply by 2", the gold bar can never pass the area,
  and the area can never pass the lengths, so piling divisibility onto vectors forces them to be long.
Check: u = (6, 3), v = (3, 6): c = 3, |det| = 27, bars 2.197, 3.296, 3.807. Dependent vectors show "dependent:
  area 0" in red and no area bar.
Layout: below 560 px wide the bars take the right half with short labels "2 log c", "area", "lengths".
```
:::

In the rewrite the same two facts carry the proof, with every word upgraded. The vectors are the lifts $\Theta_1(s\mathfrak p\,\varphi)$ of target forms by the rewrite's chain of $m$ theta lifts (`D.Θ`, `lowerChain`), which starts from forms on a unitary group of rank $N_0 + m - 1$ that is not definite; the chains between definite spaces of [[d-ml-chainop]] enter inside Theorem A, through a seesaw identity. The lengths are measured at every automorphism $\sigma$ of $\CC$, because the lifts have algebraic values and every conjugate must be short. Integer coordinates become integrality at every $\ell$-adic place, one isomorphism $\iota\colon\CC\to\overline{\QQ}_\ell$ at a time (`integralRamified`). The common divisor $c$ becomes a normalization $c_B = \prod_\ell \ell^{-g_\ell}$ by the divisibility that the chain is guaranteed to have, its gains $g_\ell$, so that the normalized forms are still integral and are short by exactly the amount of that divisibility; Theorem A is where the gains cancel against $\log c_B$ (`span_short_integralRamified_eq_top`). A family that is integral only after bounded denominators has an index, the counterpart of the $\delta_w$ of [[t-ml-height]] (`TwistedLattice.IndexLe`).

The lower bound needs more than $\det G \ge 1$, because the lattice of integral target forms is not $\ZZ^N$: its covolume is enormous and has to be computed. Theorem C does this with what the rewrite calls a twist for each prime. The archimedean size of a Gram determinant is read from the untwisted chain, while its valuation at a prime $\ell$ is read from the chain twisted by a character $\xi_\iota$ that is allowed at $\ell$, and the product formula ties the two together through the height of the ratio $Z(1)/Z(\xi_\iota)$ of the determinants $Z(\xi) = \det(\Theta_\xi^*\Theta_\xi)$ (`TwistedLattice.covolume_add_index_nonneg`, `heightLe_chainDeterminant_one_div`). The rewrite's form of the product formula is the statement that the constant family $1$ cannot have negative height, "a form of the product formula" in its words (`HeightLe.nonneg_of_one` in `New/Reduction/Lattices/Heights.lean`). Its comments place the twisted lattices among "size-versus-divisibility bounds for a determinant" and cite Bost's paper on algebraic leaves of foliations (2001) and Laurent's paper on linear forms in two logarithms and interpolation determinants (1994) (`New/Reduction/Lattices/TwistedLattice.lean`).

## What one derivative costs {#rc-direction}

The main amount that section [[rc-spine]] left undefined is a ledger kept direction by direction, in which each entry plays size against divisibility for one derivative of a theta function, the stand-in for the derivative that the integers lack ([[ra-multiplicity]]).

::: definition {#d-rc-ledger title="Size, divisibility, and the main amount"}
For an order $j \ge 0$, the size charged to a derivative of order $j$ is
$$
s_\infty(j) = \log j! + j\log\frac{p_0p_1}{\Omega},
\qquad
\Omega = e^{\gamma_E - \Re\frac{L'}{L}(1,\chi_{\mathsf d})}\,\frac{2\pi}{\mathrm{rd}_E},
$$ {#eq-rc-size}
where $p_0$ and $p_1$ are two auxiliary primes at which the forms have principal level, $\mathrm{rd}_E$ is the root discriminant of $E$, and $\Omega$ is a period of Chowla and Selberg's kind ([[eq-ml-cs]]). The divisibility guaranteed at the place $\tau$ for the order $y$ is the prime sum
$$
s_{\mathrm{fin}}(y, \tau) = \sum_{n \le a} \Lambda_{\mathsf d}(n)\,\Big(\frac yn - \kappa_{-n\tau}\Big)_+ ,
$$ {#eq-rc-primesum}
with $t_+ = \max(t, 0)$ and $-n\tau$ the place obtained from $\tau$ by the Galois automorphism of $E$ attached to $-n$. The direction amount and the main amount are
$$
h_{\mathrm{dir}} = \sum_\tau \Big(s_\infty(\kappa_\tau) - s_{\mathrm{fin}}(\kappa_\tau, \tau)\Big),
\qquad
h_{\mathrm{main}} = m\,N_0\,h_{\mathrm{dir}},
$$ {#eq-rc-main-amount}
the sum over all $n_E$ complex places of $E$, with $N_0$ the rank of the source space, as in [[d-ml-spaces]]. The total remainder is $\mathrm{rem} = \sum_{\tau\in\Phi_a}\big(s_{\mathrm{fin}}(a, \tau) - s_{\mathrm{main}}\big)$, with the expected value $s_{\mathrm{main}} = a\,(\log(a/\bar\kappa) + c_1)$, where $\log\bar\kappa$ is the mean of $\log\kappa_\tau$ over all places.
:::

::: lean {decl="New.Data.mainAmount" file="grh/src/New/Reduction/PrimeSums.lean"}
Defines `mainAmount`, `mainPrimeSum`, and `totalRemainder`; `jetSize` is $s_\infty$, `primeSum` is $s_{\mathrm{fin}}$, and `directionAmount` is $h_{\mathrm{dir}}$.
:::

On the side of size, and as our reading, $s_\infty$ is the logarithm of Cauchy's estimate: a function holomorphic and bounded by $1$ on a disk of radius $r$ has its $j$-th derivative at the center bounded by $j!/r^j$, and $\log j! + j\log(1/r)$ is $s_\infty(j)$ with $r = \Omega/(p_0p_1)$. The rewrite calls $s_\infty(j)$ the size of a derivative of order $j$ (`jetSize`). On the other side, at an inert prime $p$ the terms of [[eq-rc-primesum]] with $n = p^k$ are $2\log p\,(y/p^k - \kappa)_+$ for odd $k$ and zero for even $k$, so the prime sum keeps the odd levels of Legendre's count of the factors $p$ in $y!$, the odd-level series $\gamma_p = p/(p^2-1)$ of [[eq-ml-gamma]], with a shift $\kappa$ at each level. The rewrite's local prime sum at $p$ is this part divided by $2\log p$ (`localPrimeSum`), and the exponent of $p$ that it asks the chain to be divisible by, the gain at $p$, is built from it (`gain`). The main amount charges this ledger $m N_0$ times: in the rewrite's glossary, each of the $m$ lifts differentiates in about $N_0$ directions, each "charged the upper bound for its size less its guaranteed divisibility" (`GUIDE.md` of the readable edition, the word "idle direction").

Stepanov's proof got its divisibility from Frobenius, through the equation $h(P)^q = h(\operatorname{Frob}P)$ for a function $h$ on a curve over $\mathbb F_q$, which chapter [[stepanov]] used in [[t-st-vanishing]]. Chapter [[multiplicity-from-lifts]] found no counterpart of that equation in the original tree, and the rewrite proves one.

::::: card {#t-rc-frobenius kind="lemma" title="At a prime that does not split in $K$, multiplying the argument of a CM theta function by $\pi_p$ raises it to the power $q_p$ modulo $\pi_p$" source="grh-lean"}
:::: statement
Let $C \subset \CC$ be a lattice with complex multiplication by the integers of $K = \QQ(\sqrt{-\mathsf d})$, with $\mathsf d \equiv 7 \pmod 8$, let $\theta$ be its theta function, normalized as in the rewrite, and let $p$ be a prime that does not split in $K$. Put $\pi_p = p$ and $q_p = p^2$ if $p$ is inert, and $\pi_p = \sqrt{-\mathsf d}$ and $q_p = \mathsf d$ if $p = \mathsf d$. Then, as power series over the ring of integers of $\CC_p$,
$$
\frac{\theta(\pi_p z)}{\theta(z)^{q_p}} \;\equiv\; 1 \pmod{\pi_p}.
$$ {#eq-rc-frobenius}
::::
:::: plain
Multiplying by $p$ on an elliptic curve with complex multiplication acts, modulo $p$, like raising to the power $p^2$. That is Frobenius, the engine of Stepanov's proof, appearing over the integers.
::::
:::: why
It is the source of the divisibility that the prime sums count. From it the rewrite proves that after a rescaling the theta function is integral up to a single exponential, so that its Taylor coefficients of degree $j$ are divisible by $p$ to an order that grows like $j\,\gamma_p$, which the prime sum [[eq-rc-primesum]] records.
::::
:::: idea
On a curve with complex multiplication, multiplication by $\pi_p$ is an endomorphism whose reduction modulo a prime above $p$ is the $q_p$-power Frobenius map, so a function composed with it is congruent to its $q_p$-th power. As our reading, this is the integer counterpart of $h(\operatorname{Frob}P) = h(P)^q$.
::::
:::: sketch {source="grh-lean" loc="grh/src/New/Derivatives/FormalGroup/FrobeniusCongruence.lean"}
The rewrite proves the congruence in the ring of power series in a local coordinate $y$ of the curve, then deduces $q_p\,g(z) - g(\pi_pz) \in \pi_p\,\mathcal O[[y]]$ for $g = -\log\theta$. The file `Exponent.lean` beside it averages $g$ over roots of unity, uses the congruence as a functional equation, and solves it degree by degree, which shows that $\theta(\varpi z)$, for an element $\varpi$ of valuation $1/(p^2-1)$ at an inert $p$, is integral up to one exponential $\exp(c_\varpi\Xi_1)$ with $c_\varpi = \varpi^{p+1}/p$. The file `Divisibility/Count.lean` turns this into the count: each degree of a jet gains about $\gamma_p = \tfrac1{p-1} - \tfrac1{p^2-1}$ in valuation, Legendre's bound less the rescaling. The rewrite also proves that this slope $p/(p^2-1)$ is attained (`Sharpness/BoundAttained.lean`), a fact it records as known for one curve.
::::
:::: lean {decl="New.CMLattice.exists_rescale_theta_eq_pow_mul_one_add_smul" file="grh/src/New/Derivatives/FormalGroup/FrobeniusCongruence.lean"}
The congruence, stated for the Taylor series of $\theta$ over $\CC_p$ along a fixed embedding.
::::
:::: used
The divisibility of the composite lift at each prime, which Theorem A uses.
::::
:::::

## What cancels {#rc-cancel}

The main amount is huge, at least $x^4 n_E a$, and the proof survives only because it appears on both sides of [[eq-rc-squeeze]]. Inside it, though, size and divisibility already nearly cancel, and the rewrite shows exactly how. For the long order $a$, the size $s_\infty(a)$ and the expected divisibility $s_{\mathrm{main}}$ agree up to an excess that does not involve any L-value.

::::: card {#t-rc-cancel kind="proposition" title="The size of an $a$-th derivative exceeds its expected divisibility only by $a\log(\bar\kappa\,p_0p_1\,\mathrm{rd}_E/2\pi)$, and the L-value cancels" source="grh-lean"}
:::: statement
With $c_1 = \Re\frac{L'}{L}(1,\chi_{\mathsf d}) - \gamma_E - 1$,
$$
s_\infty(a) - s_{\mathrm{main}} \;\le\; a\log\frac{\bar\kappa\,p_0p_1\,\mathrm{rd}_E}{2\pi} + 1 + \frac{\log a}2 .
$$ {#eq-rc-excess}
::::
:::: plain
The logarithm of the largest size an $a$-th derivative can have and the logarithm of the divisibility it is expected to have agree up to a term that only depends on the field and the weights. The constant from the L-function at $s=1$ appears in both and drops out.
::::
:::: why
Without the exact cancellation the main terms would leave a constant times $a$ per lift that no choice of parameters could absorb, and the bound would stop at the order of magnitude, as Chebyshev's did. The excess that remains does not depend on the primes, and the level pays for it.
::::
:::: idea
Stirling's formula gives $\log a! \approx a\log a - a$, and the period was built so that $\log\Omega = -1 - c_1 + \log(2\pi/\mathrm{rd}_E)$. Subtracting $s_{\mathrm{main}} = a(\log a - \log\bar\kappa + c_1)$ cancels $a\log a$, the $-a$, and $c_1$.
::::
:::: proof
::: steps
1. Stirling's formula in the form the rewrite uses, from the monotonicity of Stirling's sequence, bounds the factorial.
$$
\log a! \;\le\; a\log a - a + 1 + \frac{\log a}2 .
$$
2. For the field $K$, the constant of the prime sum is $c_1 = \Re\frac{L'}{L}(1,\chi_{\mathsf d}) - \gamma_E - 1$ (`re_logDerivMean_one_eq_add_re_logDeriv`), so the period of [[eq-rc-size]] has the logarithm below.
$$
\log\Omega = \gamma_E - \Re\frac{L'}{L}(1,\chi_{\mathsf d}) + \log\frac{2\pi}{\mathrm{rd}_E} = -1 - c_1 + \log\frac{2\pi}{\mathrm{rd}_E} .
$$
3. By definition, $s_\infty(a) = \log a! + a\log(p_0p_1) - a\log\Omega$ and $s_{\mathrm{main}} = a\log a - a\log\bar\kappa + a c_1$. Insert steps 1 and 2: the terms $a\log a$ cancel, $-a$ cancels against $+a$, and $a c_1$ cancels against $-a c_1$.
$$
s_\infty(a) - s_{\mathrm{main}} \;\le\; a\log(p_0p_1) - a\log\frac{2\pi}{\mathrm{rd}_E} + a\log\bar\kappa + 1 + \frac{\log a}2 .
$$
4. Collect the logarithms.
$$
s_\infty(a) - s_{\mathrm{main}} \;\le\; a\log\frac{\bar\kappa\,p_0p_1\,\mathrm{rd}_E}{2\pi} + 1 + \frac{\log a}2 .
$$
:::
::::
:::: lean {decl="New.Data.jetSize_sub_mainPrimeSum_le" file="grh/src/New/UpperBound/Size/ArchimedeanSize.lean"}
The inequality, with the comment "The constant `c₁` cancels" at the step where it does.
::::
:::: used
The size side of Theorem A, through `mul_jetSize_sub_mainPrimeSum_sub_le`, where the level pays for $m$ excesses.
::::
:::::

The excess of one lift is not small, and the rewrite pays for $m$ of them with the level of the target forms. It chooses a prime $\mathsf N$ with $\log\mathsf N$ just above $m\log\bar\kappa + (m-1)\log(p_0p_1\mathrm{rd}_E/2\pi) - \tfrac{15}2\log b$, so between $m\log b$ and $30\,m\log b$, and the $m$ excesses cancel against $a\log\mathsf N$:
$$
m\big(s_\infty(a) - s_{\mathrm{main}}\big) - a\log\mathsf N \;\le\; 32\,a\log b
$$ {#eq-rc-level}
(`mul_jetSize_sub_mainPrimeSum_sub_le`). What is left of the main terms is then only the fluctuation of the prime sums around their expected value, the remainder.

Here is our reading of why this matters. Chebyshev's budget for his number of 1852 is an exact identity, but the number sees $\psi$ only through the function $\nu(y)$, which is $1$ for some $y$ and $0$ for others, so the budget pins $\psi(x)/x$ only between $0.921$ and $1.106$ ([[cp-chebyshev-1852]]). In the rewrite the size of a derivative and its expected divisibility agree up to the constant term, because two different objects carry the same constant: the period of an elliptic curve with complex multiplication by $K$, through the Chowla and Selberg formula [[eq-ml-cs]], and the expected count of prime powers that do not split in $K$, through $\frac{L'}{L}(1,\chi_{\mathsf d})$. Once the main terms cancel exactly, only the error term is left to be bounded, and multiplicity can then shrink it.

## Why the exponent is one half {#rc-half}

Divide [[eq-rc-main]] by $m$, and the bound on the remainder improves in proportion to the number of lifts. Each lift adds one copy of the prime sums to the divisibility of the chain, so the main amount and the remainder both carry the factor $m$, while the errors per dimension, the unit $\mathcal E$ and the index $\mathcal J$, do not grow with $m$. In [[eq-rc-onesided-data]] this is the term $\varphi(q_0)(\log b)^6/m$, and the readable edition says it in one line: the exponent of [[eq-rc-onesided]] "comes from $\log^6 b / m$ with $\log b \le 2x^\varepsilon$" (`GUIDE.md`, section 3). With $m$ the least power of two above $\sqrt x$, the saving $1/m$ is at most $x^{-1/2}$, and the exponent one half of the Riemann Hypothesis is one over the length of the chain, measured in powers of $x$.

This is the multiplicity of the budget made literal. Section [[cp-chebyshev-limits]] noted that a number divisible $m$ times by every prime of a window caps the window's weight at $1/m$ of its size bound, and Chebyshev's numbers divide each prime only once. Chapter [[route-a-plan]] compared the length $\sqrt x$ with the multiplicity $\sqrt q$ of Stepanov's proof as an analogy ([[ra-chain]]), and chapter [[multiplicity-from-lifts]] left open whether the note's length $X$ is the scale $x$ or the long order $a = xb$ ([[ml-length]]). The rewrite settles this in its own notation: it calls $x$ "the length of the prime sum" (`New/Reduction/Data/Sizes.lean`) and $a = xb$ "the order of the derivative" (`GUIDE.md`, section 3), so the chain length is the square root of the length of the prime sum. The rewrite takes $m$ as the least power of two above $\sqrt x$ and does not discuss longer chains.

## Stepanov's ledger, filled in {#rc-ledger}

The table repeats the rows of [[ml-ledger]] that the original tree left open or off the spine, with the rewrite's counterparts. The pairing of roles is our reading; each entry in the last column names a declaration of the readable edition.

| Role | Over a curve ([[stepanov]]) | In the original tree ([[ml-ledger]]) | In the rewrite |
| --- | --- | --- | --- |
| What is counted | rational points | prime powers inert in an auxiliary field, partly located | prime powers $n\equiv1 \pmod{q_0}$ with weight $\Lambda_{\mathsf d}(n)$, through the remainder $R_{q_0}(x)$ (`primeRemainder`) |
| Auxiliary object | the function $F$ | not located as a single object | a family of short integral target forms and the Gram determinant of their lifts (`targetLattice`, `CovolumeLe`) |
| Multiplicity | $F$ vanishes to order $p^\mu$ at each point | $\ell$-adic valuations per lift | $m$ lifts, each asked for the gain at every prime, so the remainder enters $m$ times (`mainAmount`, `gain`) |
| Frobenius | $h(P)^q = h(\operatorname{Frob}P)$ | not located | $\theta(\pi_pz) \equiv \theta(z)^{q_p} \pmod{\pi_p}$, [[t-rc-frobenius]] |
| Existence by counting dimensions | Riemann and Roch | not located | Theorem B: few translates of the Poincaré map span all but a share $4/b^2$ of the target, by a second moment of Petersson's kind (`enough_forms`) |
| Degree budget | pole order at one point | archimedean size of a number | Hadamard's bound for the covolume, with sizes $s_\infty$ (`covolumeLe_of_normSqAt_le`) |
| Zeros at most poles | a nonzero function has as many zeros as poles | the product formula, on the spine | the product formula for a Gram determinant with a twist for each prime, Theorem C (`covolume_add_index_nonneg`, `integral_forms_long`) |
| Slope form of the budget | Bost's slope inequality, which the note's step 13 names | in the tree but off the spine | the spine itself: one covolume bounded from both sides, [[eq-rc-squeeze]] |

The last row is the clearest change, because chapter [[multiplicity-from-lifts]] found statements shaped like a slope inequality in the original tree that the final theorem did not reach, while in the rewrite the main inequality is a comparison of the covolume of a lattice from above and from below, which is the shape of the slope method, and its lattice file cites Bost and Laurent for size against divisibility bounds for determinants.

The comments of the main inequality also name the line of argument that the budget of [[cp-chebyshev]] began. Under "Relation to the literature" they list, as "earlier bounds for sums over primes by size against divisibility", Pritsker's paper on the Gelfond and Schnirelman method in prime number theory (2005), Granville and Stark's paper showing that the abc conjecture implies no Siegel zeros for L-functions of characters with negative discriminant (2000), Bombieri's Bourbaki exposé on counting points on curves over finite fields (1973), and van Frankenhuijsen's paper on the Riemann Hypothesis for function fields over a finite field (2008) (`New/Reduction/MainInequality.lean`). The compact edition sums the list up as "Chebyshev-order bounds, conditional CM heights, curves over $\mathbb F_q$" (`src/New/Main.lean`). The ladder from Chebyshev through Stepanov to Route A, which this page drew as its own reading in [[cp-chebyshev-limits]], is the authors' placement too.

## The endgame of the rewrite {#rc-endgame}

The rewrite's last step differs from the original's in three ways, and none of them changes the idea of chapter [[landau-endgame]]: a one-sided bound on a sum over primes forbids zeros to the right of the exponent it proves.

The quantity bounded is one residue class with the weights $\Lambda_{\mathsf d}$, the remainder $R_{q_0}$ of [[eq-rc-remainder]], instead of the combination $G_r$ of sums twisted by the powers of a character ([[le-gr]]). The criterion is `LFunction_ne_zero_of_primeRemainder_le`: an eventual bound $R_q(x) \le x^{\beta-1}$, for every prime $\mathsf d$ of a suitable class, excludes zeros $s \ne 1$ of every $L(s,\psi)$ with $\psi$ a character modulo $q$ in the half-plane $\Re s > \beta$. Its comment says that "the hypotheses concern only the remainders, for all primes $\mathsf d$ of the class, and not the real zeros", where the classical form of Landau's theorem ([[le-classical]]) needs a separate argument about real zeros. As related work it cites Suzuki's paper on variants of Chebyshev's conjecture (2024), sections 15.1 and 15.2 of Montgomery and Vaughan's book, and Landau's paper of 1905 (`New/Reduction/Zeros/Criterion.lean`). Finally, a character modulo $q$ is first passed to the modulus $q_0 = 18480\,q$, where the class $q_0/2 - 1$ has square $1$ because $4$ divides $q_0$, and parameters exist for every prime $\mathsf d$ in that class (`New.grh` in `src/New/Main.lean` of the compact edition).

The windows of scales of [[le-windowed]] are replaced by the second cut-off $x_1$. The readable edition bounds the terms at $x_1$ by the prime number theorem, as in [[eq-rc-onesided-data]], and the compact edition instead moves $\log x_1$ to a point of the window $[t, t^2]$, with $t = 10^6\log x$, at which those terms are tiny (`IsPolar.exists_window_sub_mul_le` in `src/New/Main.lean`).

## What this chapter does not unfold {#rc-gaps}

The three theorems on which [[t-rc-main]] rests are stated here and not proved, and each is large.

- **Theorem A**, short forms: the seesaw identity that writes the chain on the image of the Poincaré map as a combination of chains between definite spaces (`seesaw_identity`), the divisibility of that composite lift at each prime (`New/UpperBound/Divisibility/LocalDivisibility.lean`), the elementary divisors of Hecke operators, and the divisibility of jets of theta functions that [[t-rc-frobenius]] starts.
- **Theorem B**, enough forms: a second moment of translates of Poincaré series over the target forms, with Bessel functions at the real places, Kloosterman sums, and a sieve over all places (`New/Spanning`).
- **Theorem C**, integral forms are long: auxiliary forms that complete a family to a basis, an exchange identity for theta integrals, twists with small Selmer groups through Galois representations, and the height of $Z(1)/Z(\xi_\iota)$ (`New/Determinant`, `New/OneLift`, `New/Congruences`).

The authors say that many steps of the original are proved by other arguments, and they do not list which. So this chapter compares the two at the level of the spine and does not say which of the original's declarations of chapters [[landau-endgame]] to [[inputs-and-assembly]] survive in the rewrite.

::: symbols
| Symbol | What it is | Kind | Where it lives |
| --- | --- | --- | --- |
| $q_0$, $\mathsf d$, $K$, $\chi_{\mathsf d}$ | the modulus, a multiple of $18480$; a prime $\equiv q_0/2-1$; the field $\QQ(\sqrt{-\mathsf d})$ and its quadratic character | integers, field, character | [[d-rc-data]] |
| $\Lambda_{\mathsf d}(n)$ | $\Lambda(n)(1-\chi_{\mathsf d}(n))$, the weight of non-split prime powers | arithmetic function | [[eq-rc-lambda]] |
| $x_1$, $m$, $n_E$, $\kappa_\tau$ | the second cut-off, the number of lifts, the number of complex places of $E$, the weight at the place $\tau$ | reals, integers | [[d-rc-data]] |
| $R_q(x)$, $c_q$ | the remainder of the weighted count in the class $1 \bmod q$, and its constant | real function, real | [[eq-rc-remainder]] |
| $\mathrm{rem}$, $h_{\mathrm{main}}$, $h_{\mathrm{dir}}$ | the total remainder, the main amount, the direction amount | reals | [[d-rc-ledger]] |
| $s_\infty(j)$, $s_{\mathrm{fin}}(y,\tau)$, $s_{\mathrm{main}}$ | size charged to a derivative of order $j$, guaranteed divisibility, its expected value | reals | [[d-rc-ledger]] |
| $\Omega$, $\mathrm{rd}_E$, $p_0p_1$, $\bar\kappa$ | the period, the root discriminant of $E$, two auxiliary primes, the geometric mean of the weights | reals, integers | [[eq-rc-size]] |
| $D_T$, $n_F$, $\mathcal V$, $\mathcal I$ | dimension of the target forms, size of the family, its covolume bound and index bound | integers, reals | [[t-rc-main]] |
| $\mathcal E$, $\mathcal J$ | the unit of error $n_Ea(\log b)^4$ and the index per dimension | reals | [[t-rc-main]] |
| $G$ | the Gram matrix of a family of vectors | matrix | [[d-rc-gram]] |
| $\iota$ | an isomorphism $\CC\to\overline{\QQ}_\ell$, at which integrality is tested | field isomorphism | [[rc-lattice]] |
| $\pi_p$, $q_p$ | $p$ or $\sqrt{-\mathsf d}$, and $p^2$ or $\mathsf d$ | algebraic integer, integer | [[t-rc-frobenius]] |
| $\mathsf N$ | the prime level of the target forms | prime | [[eq-rc-level]] |
:::

::: recap
- A rewrite of the formal proof, 805 files in a readable edition and 796 in a compact one against 175,187, proves the same five theorems and comments almost every file ([[rc-source]]).
- Its spine is one inequality, $m\,\mathrm{rem} \le n_E\,a(\log b)^5$, proved by bounding one covolume from above with short forms (Theorems A and B, Hadamard) and from below with the product formula (Theorem C), so that the main amount cancels ([[t-rc-main]]).
- In the plane the two bounds are $c^{2n} \le \det G \le \prod\lvert v_i\rvert^2$: divisible integral vectors cannot all be short ([[t-rc-hadamard]], [[f-rc-lattice]]).
- Each direction is charged the size $\log j! + j\log(p_0p_1/\Omega)$ of a derivative and credited a prime sum over non-split primes, whose divisibility comes from the Frobenius congruence of CM theta functions ([[t-rc-frobenius]]).
- Stirling's formula and the Chowla and Selberg period make the main terms cancel exactly, L-value included, and the level pays the remaining excess ([[t-rc-cancel]]).
- The bound on the remainder is $\varphi(q_0)(\log b)^6/m$, so the exponent one half is one over the length $m\approx\sqrt x$ of the chain ([[rc-half]]).
- The rewrite fills the cells of Stepanov's ledger that the original left open, Frobenius and the count of dimensions, and puts the slope form on the spine ([[rc-ledger]]).
:::
