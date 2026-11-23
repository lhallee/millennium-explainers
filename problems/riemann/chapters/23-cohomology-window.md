---
id: cohomology-window
title: "The arithmetic residue: a window in Galois cohomology"
part: 4
summary: Read the input `VWin` as a size bound on locally trivial Galois cohomology of an explicit abelian CM field, see why it is a weak form of Vandiver's conjecture, and follow how Iwasawa theory and a pigeonhole over scales produce the windows on which the endgame runs.
needs: [landau-endgame, integrality-and-galois]
---

:::: plain
The proof needs a certain family of number fields to be free of large hidden obstructions. The obstructions are finite groups that generalize the ideal class group, the classical measure of how far a number field is from having unique factorization. Showing that they are all trivial would be far beyond present knowledge, and some of them are not trivial, so the proof only shows that, taken all together, they are not too large: the sum of the logarithms of their sizes is bounded. It shows this only on certain stretches of scales, which a counting argument guarantees exist.
::::

The chain of theta lifts of [[multiplicity-from-lifts]] produces integers that must be divisible by large prime powers, and [[integrality-and-galois]] follows a record of divisibility and slope inequalities to the upper bound that the endgame of [[landau-endgame]] consumes. One cost is left to this chapter. In the code, a bound on divisibility exponents carries an additive term, the sum over primes $\ell$ of $\log\ell$ times the lengths of certain Galois cohomology groups (`LinkN_at`), so the proof needs an input that bounds that total, which the code calls `VWin` [@alpoge-lean]. In our reading, these groups are the note's classes "that we couldn't kill by twisting", and `VWin` is the code's form of what the note's step 17 calls "a significant weakening of Vandiver" [@alpoge-note]. We build the objects from the class group up, state `VWin` exactly, follow its proof as far as it has been unfolded, and end with the reason the endgame runs only on windows of scales.

## What plays the role of the constant field {#cw-question}

In Stepanov's proof of [[stepanov]] the curve was fixed, but the field was not. The proof of [[t-st-rh-curves]] passed from $\FF_q$ to the extensions $\FF_{q^{n}}$ with $n$ a multiple of a convenient $n_0$, so that the field size was a square and as large as needed, and [[t-ff-rh-from-bound]] needed the bound only for large $n$. Passing to $\FF_{q^n}$ cost nothing, because the rational points over $\FF_{q^n}$ are as easy to handle as those over $\FF_q$. The note's step 11 reads "Iwasawa tower via analogy to pigeonhole on $\FF_{q^n}/\FF_q$" [@alpoge-note].

Our reading of that analogy, which the code supports but does not state, is the following. The formal proof also works over a tower, the tower of 2-power roots of unity, and at each scale $x$ it chooses a layer of degree about $x^{2+8\varepsilon}$. Unlike Stepanov's tower this one is not free, because each layer carries cohomology groups that can spoil the divisibility argument and whose total size must be bounded. The bound can fail at a few exceptional scales, and a pigeonhole over scales finds long stretches, the windows, where it holds. So the layer plays the role of $\FF_{q^n}$, the scale $x$ the role of $n$, and the window is the set of $n$ on which the argument is run.

## The class group, the first obstruction {#cw-class-group}

::: recall {title="Number fields, rings of integers, ideals"}
A number field $F$ is a finite extension of $\QQ$, and its ring of integers $\mathfrak o_F$ is the set of elements that satisfy a monic polynomial with integer coefficients. In $\mathfrak o_F$ every nonzero ideal factors uniquely into prime ideals, even when elements do not factor uniquely. In $\ZZ[\sqrt{-5}]$, the ring of integers of $\QQ(\sqrt{-5})$, the number $6$ factors as $2\cdot3$ and as $(1+\sqrt{-5})(1-\sqrt{-5})$, while the ideal $(6)$ factors uniquely as $\mathfrak p_2^2\,\mathfrak p_3\,\mathfrak p_3'$ with $\mathfrak p_2 = (2, 1+\sqrt{-5})$ [@neukirch-ant, ch. I].
:::

::: definition {#d-cw-class-group title="Ideal class group and class number"}
The ideal class group $\operatorname{Cl}(F)$ of a number field $F$ is the group of nonzero fractional ideals of $\mathfrak o_F$ modulo the principal ones. It is a finite abelian group attached to the field, not a set of numbers in it, and its order $h_F$ is the class number. It is trivial exactly when every ideal is principal, which for $\mathfrak o_F$ is the same as unique factorization of elements.
:::

In $\QQ(\sqrt{-5})$ the ideal $\mathfrak p_2$ is not principal, because no $a + b\sqrt{-5}$ has norm $a^2 + 5b^2 = 2$, while $\mathfrak p_2^2 = (2)$ is principal, so the class group has an element of order 2, and in fact $h = 2$.

::: example {title="Class numbers of imaginary quadratic fields"}
Counting reduced forms $ax^2 + bxy + cy^2$ with $\abs b \le a \le c$, coprime coefficients, and $b^2 - 4ac$ the discriminant of $\QQ(\sqrt{-n})$ gives the following class numbers.

| $h(\QQ(\sqrt{-n}))$ | $n$, among those computed |
| --- | --- |
| 1 | 1, 2, 3, 7, 11, 19, 43, 163 |
| 2 | 5 |
| 3 | 23, 31, 59 |
| 5 | 47, 103 |
| 7 | 71 |
:::

Class field theory turns the class group into a Galois group. The Hilbert class field $H_F$ of $F$ is the largest abelian extension of $F$ unramified at every place, and the Artin map is an isomorphism $\operatorname{Cl}(F) \cong \Gal(H_F/F)$ that sends the class of a prime ideal to its Frobenius element, so a prime splits completely in $H_F$ exactly when it is principal [@neukirch-ant, ch. VI]. Homomorphisms from the class group to a cyclic group are therefore the same as unramified cyclic extensions, and that is the bridge to Galois cohomology.

## Cyclotomic fields, Kummer, and Vandiver {#cw-kummer}

The model for the whole chapter is the field $\QQ(\zeta_p)$ of $p$-th roots of unity, $p$ an odd prime, with Galois group $\Delta = \Gal(\QQ(\zeta_p)/\QQ) \cong (\ZZ/p)^\times$, where $a$ acts by $\zeta_p \mapsto \zeta_p^a$. Complex conjugation is the element $a = -1$. Its fixed field $\QQ(\zeta_p)^+ = \QQ(\zeta_p + \zeta_p^{-1})$ is totally real of degree $(p-1)/2$, and $\QQ(\zeta_p)$ is a totally imaginary quadratic extension of it. A field of this shape, a totally imaginary quadratic extension of a totally real field, is called a CM field.

::: definition {#d-cw-plus-minus title="Plus and minus parts"}
Let $F$ be a CM field with complex conjugation $c$, and let $\mathcal A$ be a finite abelian group of odd order on which $c$ acts, for instance the $p$-part $\mathcal A_F$ of $\operatorname{Cl}(F)$. The plus part $\mathcal A^+$ is the subgroup where $c$ acts as $+1$, and the minus part $\mathcal A^-$ is the subgroup where it acts as $-1$. Since 2 is invertible on $\mathcal A$, every $a$ is $\tfrac{1+c}{2}a + \tfrac{1-c}{2}a$, so $\mathcal A = \mathcal A^+ \oplus \mathcal A^-$. They are subgroups, not quotients, and they say nothing about the 2-part of a group.
:::

For odd $p$ the plus part of $\mathcal A_F$ is the $p$-part of the class group of the real subfield $F^+$, because extending ideals from $F^+$ and taking the norm back is squaring, which is invertible on $p$-parts, and $(1+c)a$ is the extension of the norm of $a$. So with $h^+$ the class number of $F^+$ and $h^- = h_F/h^+$ the relative class number, the $p$-part of $h^+$ is $\#\mathcal A_F^+$.

The relative class number has a formula in terms of Bernoulli numbers. For $\QQ(\zeta_p)$ it reads $h^- = 2p\prod_{\xi\ \text{odd}}\bigl(-\tfrac12 B_{1,\xi}\bigr)$, the product over the $(p-1)/2$ Dirichlet characters $\xi$ modulo $p$ with $\xi(-1) = -1$, where $B_{1,\xi} = \tfrac1p\sum_{a=1}^{p-1}\xi(a)\,a$ [@washington-cyclotomic, ch. 4]. We evaluated it numerically to 60 digits and rounded.

::: example {title="Relative class numbers of the first cyclotomic fields"}
| $p$ | $\le 19$ | 23 | 29 | 31 | 37 | 41 | 43 | 47 | 53 | 59 | 61 | 67 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| $h^-$ | 1 | 3 | 8 | 9 | 37 | 121 | 211 | 695 | 4889 | $3\cdot59\cdot233$ | $41\cdot1861$ | $67\cdot12739$ |

The class number of $\QQ(\zeta_p)$ is 1 exactly for $p \le 19$ [@washington-cyclotomic, ch. 11]. The prime $p$ itself divides $h^-$ for $p = 37$, $59$, and $67$ in this range, and for no other.
:::

Kummer found which primes $p$ divide the class number, in terms of the Bernoulli numbers $B_k$ defined by $t/(e^t - 1) = \sum_k B_k t^k/k!$.

::::: card {#t-cw-kummer kind="theorem" title="A prime $p$ divides the class number of the $p$-th cyclotomic field exactly when it divides the numerator of one of the Bernoulli numbers $B_2,B_4,\dots,B_{p-3}$" source="washington-cyclotomic" loc="ch. 5"}
:::: statement
For an odd prime $p$, $p \mid h(\QQ(\zeta_p))$ if and only if $p$ divides the numerator of $B_k$ for some even $k$ with $2 \le k \le p-3$. Such $p$ are called irregular, the others regular. Moreover, if $p \mid h^+$ then $p \mid h^-$.
::::
:::: plain
Whether unique factorization fails in a predictable way in the field of $p$-th roots of unity is decided by a finite list of rational numbers that one can compute by hand.
::::
:::: why
It is the first case in which the size of an obstruction group is read from special values of zeta functions, since $B_k = -k\,\zeta(1-k)$. The minus part of every group in this chapter is controlled the same way.
::::
:::: idea
The analytic class number formula writes $h^-$ as a product of the numbers $B_{1,\xi}$, and Kummer's congruences relate $B_{1,\omega^{k-1}}$ modulo $p$ to $B_k/k$, where $\omega$ is the Teichmüller character, the character modulo $p$ with $\omega(a) \equiv a \pmod p$. The statement about $h^+$ comes from the units of the real field.
::::
:::: sketch
Washington proves the criterion from the analytic class number formula and the congruences [@washington-cyclotomic, ch. 5], and his book also treats the statement about $h^+$, which comes from the units of the real field [@washington-cyclotomic].
::::
:::: example
The irregular primes below 200 are $37, 59, 67, 101, 103, 131, 149, 157$, found by testing $p \mid B_k$ for every even $k \le p-3$ with exact rational arithmetic. For $p = 37$ the only such $k$ is $32$, with
$$
B_{32} = -\frac{7709321041217}{510}, \qquad 7709321041217 = 37 \cdot 683 \cdot 305065927 .
$$
::::
:::: used
The eigenspace refinement below, and the reading of the minus part in [[cw-minus]].
::::
:::::

The group $\Delta$ acts on the $p$-part $\mathcal A$ of $\operatorname{Cl}(\QQ(\zeta_p))$, and since $\#\Delta = p-1$ is prime to $p$, $\mathcal A$ splits into eigenspaces $\mathcal A = \bigoplus_{i \bmod p-1} \mathcal A(\omega^i)$, where $\Delta$ acts on $\mathcal A(\omega^i)$ through $\omega^i$. Complex conjugation acts on $\mathcal A(\omega^i)$ by $\omega^i(-1) = (-1)^i$, so $\mathcal A^+$ is the sum of the even eigenspaces and $\mathcal A^-$ the sum of the odd ones. Herbrand proved, and Ribet proved the converse of, the refined criterion that for even $k$ with $2 \le k \le p-3$, $\mathcal A(\omega^{1-k}) \ne 0$ if and only if $p \mid B_k$ [@washington-cyclotomic, ch. 6] [@ribet1976]. For $p = 37$ and $k = 32$ the eigenspace is $\mathcal A(\omega^{1-32}) = \mathcal A(\omega^{5})$, odd, in the minus part.

::: conjecture {#t-cw-vandiver title="Vandiver's conjecture"}
For every prime $p$, $p$ does not divide the class number $h^+$ of $\QQ(\zeta_p)^+$. Equivalently, the plus part $\mathcal A^+$ of the $p$-part of $\operatorname{Cl}(\QQ(\zeta_p))$ is zero.
:::

The plus part is not governed by Bernoulli numbers. Instead $h^+$ equals the index of the cyclotomic units in the full unit group of $\QQ(\zeta_p)^+$ [@washington-cyclotomic, ch. 8], and no method is known that bounds this index modulo $p$ in general. The conjecture has been verified for every $p$ below 163 million [@buhler-harvey2011]. For $p = 37$ it gives $37 \nmid h^+$, so $\mathcal A = \mathcal A(\omega^5) \cong \ZZ/37$.

::: figure {#f-cw-eigenspaces viz="cyclotomic-eigenspaces" height="400"}
For an irregular prime, every Bernoulli number divisible by p lights one odd eigenspace of the class group, and the even eigenspaces, which make up the plus part, stay dark, as Vandiver's conjecture predicts.

```vizspec
Purpose: show Kummer's criterion and the Herbrand and Ribet refinement as a picture, and where Vandiver's
  conjecture sits.
Scene: two rows of p - 1 cells arranged on a circle of radius 150 px (or a straight strip at phone width),
  indexed by i = 0..p-2 (the eigenspaces, written $\mathcal A(\omega^i)$ on the page). Odd i in the outer ring (the minus part), even i in
  the inner ring (the plus part). Label every sixth cell with its index. Separately, a row of chips for
  the even k = 2, 4, ..., p-3 (the Bernoulli numbers B_k), drawn under the circle.
  For each pair (p, k) in the data, color the chip k gold and the outer cell i = (1 - k) mod (p - 1) teal,
  and draw a thin muted arc from the chip to the cell. All inner (even) cells stay muted, with the caption
  line "plus part: zero for every p below 1.63 x 10^8 (Buhler and Harvey)".
  A text box shows p, the number of gold chips, and for p <= 67 the relative class number h^- and its
  factorization.
Controls: a selector for p over 23, 29, 31, 37, 41, 43, 47, 59, 67, 101, 103, 131, 149, 157.
Motion: none beyond a 200 ms fade when p changes.
Data: irregular pairs (p, k): (37, 32), (59, 44), (67, 58), (101, 68), (103, 24), (131, 22), (149, 130),
  (157, 62), (157, 110). Lit odd eigenspaces i = 1 - k mod p - 1: 37 -> 5, 59 -> 15, 67 -> 9, 101 -> 33,
  103 -> 79, 131 -> 109, 149 -> 19, 157 -> 95 and 47. Relative class numbers h^-: 23: 3, 29: 8, 31: 9,
  37: 37, 41: 121, 43: 211, 47: 695, 59: 41241 = 3 * 59 * 233, 67: 853513 = 67 * 12739. For the regular
  primes 23 to 47 no chip is gold even when h^- > 1, because p does not divide h^-.
Reader takeaway: Bernoulli numbers see only the odd (minus) eigenspaces, and the even (plus) ones are
  Vandiver's territory.
```
:::

## Galois cohomology, as far as we need it {#cw-cohomology}

Galois cohomology asks the class-group question with coefficients that the Galois group moves, and we need only its first group. For a profinite group $G$ acting continuously on a discrete abelian group $M$, a 1-cocycle is a continuous map $f\colon G \to M$ with $f(gh) = f(g) + g\,f(h)$, and $H^1(G, M)$ is the group of 1-cocycles modulo those of the form $g \mapsto gm - m$. When $G$ acts trivially, a 1-cocycle is a continuous homomorphism, and the coboundaries are zero, so $H^1(G, M) = \operatorname{Hom}(G, M)$ [@nsw-cohomology].

Fix a number field $F$ and a prime $\ell$. Let $G_{F,S}$ be the Galois group of the largest extension of $F$ that is unramified at every finite prime not above $\ell$. The coefficient group throughout is $\QQ_\ell/\ZZ_\ell$, the $\ell$-power torsion of $\QQ/\ZZ$, whose elements are the fractions $a/\ell^n$ modulo 1. A homomorphism from a Galois group to it is a character of $\ell$-power order, and its kernel cuts out a cyclic extension of $\ell$-power degree.

::: definition {#d-cw-sha title="Locally trivial classes"}
Let $M$ be $\QQ_\ell/\ZZ_\ell$ with a continuous action of $G_{F,S}$. The group $\text{Sha}^1(F, M)$ is the kernel of the restriction map
$$
H^1(G_{F,S}, M) \longrightarrow \prod_{v \mid \ell} H^1(G_{F_v}, M),
$$ {#eq-cw-sha}
where $G_{F_v}$ is the decomposition group at the prime $v$ of $F$ above $\ell$, the Galois group of the completion. A class in it is unramified outside $\ell$ by construction and becomes trivial at every prime above $\ell$. It is a group of cohomology classes, a $\ZZ_\ell$-module, and not a group of ideals. Its length as a $\ZZ_\ell$-module is $n$ exactly when it has $\ell^n$ elements.
:::

The name comes from the Tate and Shafarevich group of an elliptic curve, defined by the same pattern. In the code this group is `Sha`, and its length is `shaLen`, in `Formalism/GaloisCohomology/Statement.lean` [@alpoge-lean].

::: proposition {#t-cw-sha-class title="With trivial coefficients, the locally trivial classes are the characters of the class group that kill the primes above $\ell$" source="neukirch-ant" loc="ch. VI"}
If $F$ is totally imaginary or $\ell$ is odd, then $\text{Sha}^1(F, \QQ_\ell/\ZZ_\ell)$ with trivial action is isomorphic to the group of homomorphisms from $\operatorname{Cl}(F)/\langle [\mathfrak l] : \mathfrak l \mid \ell\rangle$ to $\QQ_\ell/\ZZ_\ell$, and so it has as many elements as the $\ell$-part of that quotient.
:::

::: proof
With trivial action, a class is a homomorphism $f\colon G_{F,S} \to \QQ_\ell/\ZZ_\ell$, and its kernel cuts out a cyclic extension $L/F$ unramified outside $\ell$. Being trivial in $H^1(G_{F_v}, \QQ_\ell/\ZZ_\ell)$ means that $f$ vanishes on the decomposition group at $v$, so $L/F$ is unramified at $v$ and $v$ splits completely. Hence $L$ is an unramified abelian extension in which every prime above $\ell$ splits completely (the hypothesis takes care of the real places). By the Artin isomorphism of [[cw-class-group]], such extensions correspond to quotients of $\operatorname{Cl}(F)$ in which the classes of the primes above $\ell$ become trivial, and $f$ is a character of that quotient.
:::

::: example {title="Two quadratic fields at $\ell=3$"}
For $F = \QQ(\sqrt{-31})$, $h = 3$, and $3$ is inert because $-31$ is not a square modulo 3, so the only prime above 3 is $(3)$, which is principal. The proposition gives $\#\text{Sha}^1(F, \QQ_3/\ZZ_3) = 3$. For $F = \QQ(\sqrt{-23})$, also $h = 3$, the prime 3 splits as $\mathfrak p\bar{\mathfrak p}$, and $\mathfrak p$ is not principal because $x^2 + xy + 6y^2 = 3$ has no integer solution, so $[\mathfrak p]$ generates $\operatorname{Cl}(F)$ and the quotient is trivial. Here $\text{Sha}^1(F, \QQ_3/\ZZ_3) = 0$ although $3 \mid h$. The condition at $\ell$ matters.
:::

Now the twist. Let $\chi_{\mathrm{cyc}}\colon \Gal(\overline\QQ/\QQ) \to \ZZ_\ell^\times$ be the $\ell$-adic cyclotomic character of [[eq-ig-cyc]], defined by $\sigma(\zeta) = \zeta^{\chi_{\mathrm{cyc}}(\sigma)}$ for every root of unity $\zeta$ of $\ell$-power order.

::: definition {#d-cw-twist title="Tate twist"}
For an integer $k$, $\QQ_\ell/\ZZ_\ell(-k)$ is the group $\QQ_\ell/\ZZ_\ell$ on which $\sigma$ acts as multiplication by $\chi_{\mathrm{cyc}}(\sigma)^{-k}$. For $k = -1$ it is the group of $\ell$-power roots of unity, and for $k = 0$ it has the trivial action. The twist changes the action, not the group.
:::

What does $H^1$ with twisted coefficients classify? Let $f$ be a cocycle and $H$ the subgroup of $G_{F,S}$ that fixes every $\ell$-power root of unity, the Galois group over $F(\mu_{\ell^\infty})$. Since $H$ acts trivially on the coefficients, $f$ restricted to $H$ is a homomorphism, and the cocycle rule gives $f(\sigma h \sigma^{-1}) = \chi_{\mathrm{cyc}}(\sigma)^{-k} f(h)$ for every $\sigma$. So up to a small kernel, a class with coefficients $\QQ_\ell/\ZZ_\ell(-k)$ is a character of the abelian $\ell$-extensions of the fields $F(\mu_{\ell^n})$, unramified outside $\ell$, on which conjugation by the Galois group over $F$ acts through $\chi_{\mathrm{cyc}}^{-k}$. The locally trivial ones are characters of the $\ell$-parts of class groups up the tower $F(\mu_{\ell^n})$, restricted to one eigenspace that the twist $k$ selects. The twist is a dial that chooses which part of these class groups is looked at, and the smallest case shows it at work, in a computation of ours from the definitions and the facts above.

::: example {title="The dial at $p=37$"}
Take the base field $\QQ$, $\ell = p = 37$, and coefficients $\ZZ/37(-k)$, the first layer of $\QQ_{37}/\ZZ_{37}(-k)$. Let $F = \QQ(\zeta_{37})$. Since $\#\Delta = 36$ is prime to 37, restriction identifies classes over $\QQ$ with $\Delta$-invariant classes over $F$, both globally and at the prime above 37. Over $F$ the action on $\ZZ/37(-k)$ is trivial, and the only prime above 37 is $(1 - \zeta_{37})$, which is principal, so the proposition gives characters of $\mathcal A/37$. Invariance under $\Delta$ says $f(\delta a) = \omega(\delta)^{-k} f(a)$, so $f$ sees only the eigenspace $\mathcal A(\omega^{-k})$:
$$
\text{Sha}^1\bigl(\QQ, \ZZ/37(-k)\bigr) \cong \operatorname{Hom}\bigl(\mathcal A(\omega^{-k})/37,\ \ZZ/37\bigr).
$$
Since $\mathcal A = \mathcal A(\omega^5)$, this group is $\ZZ/37$ when $-k \equiv 5 \pmod{36}$, that is $k \equiv 31 \pmod{36}$, and zero for every other $k$. The twist $k = 31$ is tied to $B_{32} = B_{k+1}$, which is how the minus parts below meet Bernoulli numbers. The same computation for any $p$ shows that $\text{Sha}^1(\QQ, \ZZ/p(-k)) = 0$ for every even $k$ exactly when $\mathcal A^+ = 0$, which is Vandiver's conjecture for $p$.
:::

The code splits these groups by complex conjugation $c$, which for a CM field $E$ acts on $\text{Sha}^1(E, \QQ_\ell/\ZZ_\ell(-k))$, and on the coefficients by $\chi_{\mathrm{cyc}}(c)^{-k} = (-1)^k$.

::: definition {#d-cw-plus-sha title="Plus and minus parts of the locally trivial classes"}
For a CM field $E$ and odd $\ell$, the plus part of $\text{Sha}^1(E, \QQ_\ell/\ZZ_\ell(-k))$ is its $(-1)^k$-eigenspace for $c$, and the minus part its $(-1)^{k+1}$-eigenspace (`ShaPlus`, `ShaMinus` in `Development/AutomorphicArithmetic/AutomorphicVarieties/LengthEqAddEigen.lean`). The theorem `shaLen_eq_add` there proves that the length is the sum of the two lengths for $\ell \ne 2$ [@alpoge-lean].
:::

The sign convention makes the plus part the classes that see only the part of the class groups on which $c$ acts trivially, because $(c f)(g) = (-1)^k f(c^{-1} g c)$, so the eigenvalue $(-1)^k$ means $f(c^{-1}gc) = f(g)$. By the computation of the example, for $E = \QQ(\zeta_p)$, $\ell = p$, and coefficients $\ZZ/p(-k)$, the plus part is dual to $\mathcal A^+/p$ for every $k$. In the code's convention, then, Vandiver's conjecture for $p$ is the vanishing of the plus part over $\QQ(\zeta_p)$.

### In what sense the bound is a weak Vandiver {#cw-weak-vandiver}

`VWin`, stated in [[cw-statement]], bounds these groups for a family of abelian CM fields $E$, and we read the note's phrase "a significant weakening of Vandiver" as follows, a reading that is ours. Vandiver's conjecture asks that the plus part vanish for one field $\QQ(\zeta_p)$ and one prime $\ell = p$. `VWin` asks for something weaker in kind and wider in scope. It concerns other fields, of degree about $x^{2+8\varepsilon}$, and every prime $\ell$ and every twist $1 \le k < x^{401}$ at once, with coefficients $\QQ_\ell/\ZZ_\ell$ that see the whole tower $E(\mu_{\ell^n})$. It covers the minus part as well, which cannot vanish in general, as $p = 37$ shows. Instead of vanishing it asks only that every group be finite, that the sum of their logarithmic sizes be at most $\exp(x^\varepsilon/2)$, and only on windows of scales. The note's footnote to step 17 adds that the step is still strong, and that its author believes it implies the vanishing of several K-groups of $\ZZ$ [@alpoge-note].

::: aside {title="Duality and K-groups"}
Poitou and Tate duality identifies the length of $\text{Sha}^1$ with coefficients $\QQ_\ell/\ZZ_\ell(-k)$ with that of the locally trivial part of $H^2$ with coefficients $\ZZ_\ell(k+1)$ [@nsw-cohomology], which the code records as `PTShaAt`. For odd $\ell$ and $k \ge 1$ the groups $H^2(\mathfrak o_E[1/\ell], \ZZ_\ell(k+1))$ are the $\ell$-parts of the K-groups $K_{2k}(\mathfrak o_E)$, by the norm residue theorem of Rost and Voevodsky [@weibel-kbook]. That is why K-groups appear in the note's footnote, whose remark about K-groups of $\ZZ$ we do not check.
:::

## The field E {#cw-field}

The fields of `VWin` are cut out of a cyclotomic field by congruence conditions. Fix a primitive Dirichlet character $\chi$ of conductor $N_\chi$, the code's $\psi$, as in [[d-rh-character]]. The code's `IsChiField ψ e q d E` says that $E$ embeds in $\QQ(\zeta_N)$ for some $N$ divisible by $2^{\nu+2}$, $N_\chi$, $\mathsf q$, and $\mathsf d$, and that $\sigma_a\colon \zeta_N \mapsto \zeta_N^a$ fixes $E$ exactly when
$$
a \equiv \pm 1 \pmod{2^{\nu+2}}, \qquad \chi(a) = 1, \qquad \Bigl(\frac a{\mathsf q}\Bigr) = 1, \qquad \Bigl(\frac a{\mathsf d}\Bigr) = 1 .
$$ {#eq-cw-ischi}
Here $\nu$ is the code's `e`, renamed to keep the letter $e$ for exponentials, and $\mathsf q$, $\mathsf d$ are two large auxiliary primes, the code's `q` and `d`, set in sans-serif so that they do not collide with the prime power $q$ of [[function-fields]].

:::: lean {decl="UpperTheory.Top.IsChiField" file="Development/AutomorphicArithmetic/CharacterBoxes/ExistsPageN.lean"}
The field, the auxiliary primes, and the 2-adic level, verbatim.

```lean
def IsChiField (ψ : PChar) (e q d : ℕ) (E : Type) [Field E] [NumberField E] : Prop :=
  ∃ (N : ℕ) (_ : NeZero N) (j : E →ₐ[ℚ] CyclotomicField N ℚ) (ζ : CyclotomicField N ℚ),
    2 ^ (e + 2) ∣ N ∧ ψ.N ∣ N ∧ q ∣ N ∧ d ∣ N ∧ IsPrimitiveRoot ζ N ∧
    ∀ (τ : CyclotomicField N ℚ ≃ₐ[ℚ] CyclotomicField N ℚ) (a : ℕ), τ ζ = ζ ^ a →
      ((∀ x : E, τ (j x) = j x) ↔
        (a ≡ 1 [MOD 2 ^ (e + 2)] ∨ a + 1 ≡ 0 [MOD 2 ^ (e + 2)]) ∧ ψ.val a = 1 ∧
          jacobiSym (a : ℤ) q = 1 ∧ jacobiSym (a : ℤ) d = 1)

structure WinPair (eps Y : ℝ) (q d : ℕ) : Prop where
  q_prime : q.Prime
  q_mod : q % 8 = 3
  q_lo : Y ^ (eps / 5) / 2 < Real.log q
  q_up : Real.log q ≤ Y ^ (eps / 5)
  d_prime : d.Prime
  d_mod : d % 16 = 7
  d_lo : Y ^ (eps / 5) * Real.log Y ^ 2 / 2 < Real.log d
  d_up : Real.log d ≤ Y ^ (eps / 5) * Real.log Y ^ 2
  d_q : q ∣ d + 1
  d_small : ∀ p : ℕ, p.Prime → p ≠ 2 → (p : ℝ) ≤ Y ^ (eps / 5) → p ∣ d + 1

def PageN (eps x : ℝ) (e : ℕ) : Prop := x ^ (2 + 8 * eps) ≤ (2 : ℝ) ^ e ∧ (2 : ℝ) ^ e ≤ 2 * x ^ (2 + 8 * eps)
```
::::

::: proposition {#t-cw-compositum title="The field $E$ is the compositum of a layer of the $2$-power cyclotomic tower, the field of the character, and two imaginary quadratic fields"}
A field $E$ with [[eq-cw-ischi]] is
$$
E = \QQ(\zeta_{2^{\nu+2}})^+ \cdot K_\chi \cdot \QQ(\sqrt{-\mathsf q}) \cdot \QQ(\sqrt{-\mathsf d}),
$$ {#eq-cw-compositum}
where $K_\chi$ is the cyclic field cut out by the kernel of $\chi$, when $\mathsf q \equiv \mathsf d \equiv 3 \pmod 4$. It is an abelian CM field, $2^\nu \le [E:\QQ] \le 4\operatorname{ord}(\chi)\,2^\nu$, and its conductor is at most $2^{\nu+2}N_\chi \mathsf q \mathsf d$.
:::

::: proof
The subgroup $H$ of $(\ZZ/N)^\times$ defined by [[eq-cw-ischi]] is the intersection of four subgroups, so by Galois theory its fixed field is the compositum of their four fixed fields. The fixed field of $\{a \equiv \pm1 \bmod 2^{\nu+2}\}$ is $\QQ(\zeta_{2^{\nu+2}})^+$, of degree $2^\nu$. The fixed field of $\ker\chi$ is $K_\chi$. The fixed field of the kernel of $a \mapsto (a/\mathsf q)$ is the quadratic field of conductor $\mathsf q$, which is $\QQ(\sqrt{-\mathsf q})$ since $\mathsf q \equiv 3 \pmod 4$, and the same for $\mathsf d$. So $\Gal(E/\QQ) = (\ZZ/N)^\times/H$ embeds in a product of groups of orders $2^\nu$, $\operatorname{ord}(\chi)$, 2, and 2, and maps onto the first. $E$ is abelian and contains the imaginary field $\QQ(\sqrt{-\mathsf q})$, so it is totally imaginary, and an abelian totally imaginary field is CM. The conductor divides the least common multiple of the conductors of the four pieces.
:::

The code proves the last two facts as `isCMField_of_isChiField` and `conductor_bounds_of_isChiField` in `Development/AutomorphicArithmetic/AutomorphicVarieties/CMFieldExponentialBounds/` [@alpoge-lean]. For the trivial character the four pieces are independent by the Chinese remainder theorem, and $[E:\QQ] = 4\cdot 2^\nu$.

The conditions in `WinPair` make $\mathsf q$ and $\mathsf d$ enormous, with $\log \mathsf q$ and $\log \mathsf d$ of order $Y^{\varepsilon/5}$, so that they exceed every power of the scale, and they fix how these primes and the small primes behave. Two consequences are elementary, and we checked both by direct computation.

- Every odd prime $p \le Y^{\varepsilon/5}$ divides $\mathsf d + 1$, so $-\mathsf d \equiv 1$ is a square modulo $p$ and $p$ splits in $\QQ(\sqrt{-\mathsf d})$, and the same holds for $p = \mathsf q$ and, since $-\mathsf d \equiv 9 \pmod{16}$, for $p = 2$. For example $\mathsf d = 840839 \equiv 7 \pmod{16}$ has $\mathsf d + 1 = 2^3\cdot3\cdot5\cdot7^2\cdot11\cdot13$. The code proves these splittings in `PairHyp.lean`.
- The Galois group of $\QQ(\zeta_{2^n})^+$ is $(\ZZ/2^n)^\times/\{\pm1\}$, and a prime $r$ has as many primes above it as the index of the subgroup generated by $r$. For $r \equiv 3 \pmod 8$ that subgroup is everything, so $r$ stays prime in every layer, and for $r \equiv 7 \pmod{16}$ it has index 2, so $r$ has exactly two primes above it from $n = 3$ on. We confirmed both for $r = 3, 11, 19, 43, 7, 23, 71, 103$ and $n \le 12$.

The second fact is our guess at why the congruences were chosen, since adjoining $\sqrt{-\mathsf q}$ and $\sqrt{-\mathsf d}$ then adds only boundedly many ramified primes to every layer of the 2-power tower, and [[cw-iwasawa]] needs a bound that does not depend on $\mathsf q$ and $\mathsf d$.

The sizes of this chapter are the following, and the full scale dictionary is in [[ml-scales]].

| Quantity | Size at scale $x$ | Where in the code |
| --- | --- | --- |
| 2-adic level $2^\nu$ | between $x^{2+8\varepsilon}$ and $2x^{2+8\varepsilon}$ | `PageN` |
| degree $[E:\QQ]$ | between $2^\nu$ and $4\operatorname{ord}(\chi)2^\nu$ | our [[t-cw-compositum]] |
| $\log \mathsf q$, $\log \mathsf d$ | about $Y_0^{\varepsilon/5}$ and $Y_0^{\varepsilon/5}(\log Y_0)^2$, with $Y_0 = X^{1/J} \le x$ | `WinPair` |
| $\log(\mathsf q\mathsf d)$ | at most $x^{\varepsilon/4}$ for large scales | `log_mul_le_rpow_of_winPair` |
| $\log(\mathrm{cond}(E)\cdot\text{number of twists})$ | at most $2x^{\varepsilon/4}$ | `log_conductor_mul_height_le_of_pageN` |
| twists $k$ | $1 \le k < \lfloor x^{401}\rfloor$ | `VWin`, `VAt` |
| budget for the sum of $\log\#\text{Sha}^1$ | $\exp(x^\varepsilon/2) = \sqrt b$ with $b = \exp(x^\varepsilon)$ | `VAt`, `Scale.b` |
| chain length $m$ of [[multiplicity-from-lifts]] | between $x^{1/2-\varepsilon/16}$ and twice that | `RankVal` |

The number 401 is one more than the bound $x^{400}$ on the number of twists that the consumer needs (`eventually_rank_le_rpow_of_lt_one_div_fiftytwo`), and the extra unit absorbs a rescaling of the scale by a constant.

## The statement {#cw-statement}

We can now state the input exactly. The sizes enter through the sum of $\log\ell$ times the length over $\ZZ_\ell$, which is the logarithm of the number of elements.

::::: card {#t-cw-vwin kind="theorem" title="On a window of scales, the locally trivial cohomology of the field $E$, over all primes and all twists below $x^{401}$, has total logarithmic size at most $\exp(x^\varepsilon/2)$" source="alpoge-lean"}
:::: statement
Let $\chi$ be a primitive Dirichlet character. For every $\varepsilon$ with $0 < \varepsilon < \tfrac1{52}$ and every function $\nu\colon \RR \to \NN$ with $x^{2+8\varepsilon} \le 2^{\nu(x)} \le 2x^{2+8\varepsilon}$ for all $x \ge 1$, there are $J \ge 1$ and $X_\ast$ with the following property. For every $X \ge X_\ast$ and every pair of primes $\mathsf q, \mathsf d$ satisfying `WinPair` at level $Y_0 = X^{1/J}$, there is $Y$ with
$$
X^{1/J} \le Y, \qquad Y^2 \le X,
$$
such that for every $x \in [Y, Y^2]$ and every number field $E$ with [[eq-cw-ischi]] for $(\chi, \nu(x), \mathsf q, \mathsf d)$:

1. for every prime $\ell$ and every $1 \le k < \lfloor x^{401}\rfloor$ the group $\text{Sha}^1(E, \QQ_\ell/\ZZ_\ell(-k))$ is finite, and
2. the total logarithmic size is bounded,
$$
\sum_{\ell} \ \sum_{k=1}^{\lfloor x^{401}\rfloor - 1} \log \#\,\text{Sha}^1\bigl(E, \QQ_\ell/\ZZ_\ell(-k)\bigr) \ \le\ \exp\bigl(\tfrac12 x^{\varepsilon}\bigr).
$$ {#eq-cw-vwin}
::::
:::: plain
For every character, at every large size, some long stretch of scales exists on which the hidden obstructions of the associated field, counted over all primes and a huge range of twists, are small in total.
::::
:::: why
The bound `LinkN_at` on divisibility exponents carries an additive cost that is at most the left side of [[eq-cw-vwin]] (`vvRecord`, [[cw-used]]), and the bound makes that cost negligible. The hosts that carry the chain of lifts are built only where the bound holds, which is why the endgame of [[landau-endgame]] sees its inequality only on windows.
::::
:::: idea
Split each group by the prime 2, the minus part, and the plus part. The minus part is bounded everywhere by Bernoulli numbers. The 2-part and a few special odd primes are controlled by Iwasawa theory except at boundedly many exceptional twists, and a pigeonhole over scales finds a window avoiding them. The plus part is bounded on the same window by Euler systems and automorphy. Each bound is $\exp$ of a smaller power of $x$ than the budget.
::::
:::: sketch {source="alpoge-lean"}
The formal proof is a chain of named theorems, each of which this chapter states. (1) `thmBab_of` gives the 2-part and the layers at the special odd primes on windows, from Ferrero and Washington, `LemmaK`, and the pigeonhole `window` ([[cw-iwasawa]], [[cw-pigeonhole]]). (2) `thmBcFree_of` bounds the minus part at every scale ([[cw-minus]]). (3) `thmHV_of_counts` bounds the plus part on the same windows ([[cw-plus]]). (4) `jointWin_of` intersects the windows of (1) and (3). (5) `vwinAt_of_joint` adds the three bounds ([[t-cw-glue]]). (6) `vwin_of_row` derives `VWin` from the Galois-representation statement `Row0b`, which the tree proves ([[integrality-and-galois]]). Steps 4 to 6 are unfolded in this chapter. The proofs inside steps 1 to 3 are unfolded only where the chapter says so.
::::
:::: example
With $\varepsilon = \tfrac1{100}$, the twists run up to $x^{401}$ and the field has degree near $x^{2.08}$, while the right side of [[eq-cw-vwin]] is $\exp(x^{0.01}/2)$. At $x = 10^{100}$ that is only $e^{5} \approx 148$, and the comparisons in [[t-cw-glue]] need at least $x > 2^{500} \approx 3.3\times10^{150}$. The statement is asymptotic, and the scales at which it is used are astronomically large.
::::
:::: lean {decl="UpperTheory.Top.VWin" file="Development/AutomorphicArithmetic/CharacterBoxes/ExistsPageN.lean"}
The statement, verbatim. `VVle E t B` asks finiteness for $0 < k < t$ and the weighted sum of lengths at most $B$, for every finite set of primes, which is the full sum.

```lean
def VVle (E : Type) [Field E] [NumberField E] (t : ℕ) (B : ℝ) : Prop :=
  ∀ (Ω : Type) [Field Ω] [Algebra E Ω] [IsAlgClosure E Ω] (ld : ∀ (p : ℕ) [Fact p.Prime], Formalism.GaloisCohomology.LData E Ω p),
    (∀ (p : ℕ) [Fact p.Prime] (e : ℕ), 0 < e → e < t → Formalism.GaloisCohomology.shaLen (ld p) (e : ℤ) ≠ ⊤) ∧
    ∀ S : Finset Nat.Primes,
      ∑ l ∈ S, Real.log (l : ℕ) *
        ∑ e ∈ Finset.Ico 1 t, ((@Formalism.GaloisCohomology.shaLen E Ω _ _ _ _ _ l ⟨l.2⟩ (@ld l ⟨l.2⟩) (e : ℤ)).toNat : ℝ) ≤ B

def VAt (ψ : PChar) (eps Ct : ℝ) (q d e : ℕ) (x : ℝ) : Prop :=
  ∀ (E : Type) [Field E] [NumberField E], IsChiField ψ e q d E → VVle E ⌊x ^ Ct⌋₊ (Real.sqrt (Real.exp (x ^ eps)))

def VWinAt (ψ : PChar) (Ct : ℝ) : Prop :=
  ∀ eps : ℝ, 0 < eps → eps < 1 / 52 → ∀ e : ℝ → ℕ, (∀ x ≥ (1 : ℝ), PageN eps x (e x)) →
    ∃ J : ℝ, 1 ≤ J ∧ ∃ X0 : ℝ, ∀ X ≥ X0, ∀ q d : ℕ, WinPair eps (X ^ (1 / J)) q d →
      ∃ Y : ℝ, X ^ (1 / J) ≤ Y ∧ Y ^ (2 : ℝ) ≤ X ∧ ∀ x : ℝ, Y ≤ x → x ≤ Y ^ (2 : ℝ) → VAt ψ eps Ct q d (e x) x

def VWin : Prop := ∀ ψ : PChar, VWinAt ψ 401
```
::::
:::: used
Used by `supplyChi` in [[cw-used]], which builds the hosts for the endgame of [[landau-endgame]], and through `vvRecord` as the cost term of `LinkN_at` ([[cw-used]]).
::::
:::::

::: warning
The bound is on the sum of the logarithms of the orders, so it says $\prod_\ell\prod_k \#\text{Sha}^1 \le \exp(\exp(x^\varepsilon/2))$, not $\le \exp(x^\varepsilon/2)$. It is not a statement about sums over primes like $\sum \Lambda(n)$, and its window is a set of scales, not the support of a test function. The pieces that Bernoulli numbers control have logarithmic size polynomial in $x$ and fit easily, and what the bound excludes is a group whose logarithmic size is $\exp$ of a larger power of $x$.
:::

The order of the quantifiers carries the logic of the construction. The constant $J$ is chosen after $\varepsilon$ and $\nu$ but before $X$, $\mathsf q$, and $\mathsf d$, so it cannot depend on the auxiliary primes, which are chosen at scale $X^{1/J}$ before the window is known. Inside the window every scale works, with a field that changes with the scale, since $\nu(x)$ grows with $x$.

## Where a bound can fail: Iwasawa towers and exceptional twists {#cw-iwasawa}

The 2-part of $\text{Sha}^1$ has no plus and minus split, because 2 is not invertible, and no Bernoulli-number bound applies to it. The code handles it, and the layers at a finite set $\mathcal B_\chi$ of odd primes depending only on $\chi$, by Iwasawa theory. `TwoBase` (`LayeredIsomorphisms/SecondBound.lean`) reduces the 2-part over $E$, at a cost of one unit of length per twist, to a layer of degree $2^j$ with $j \le \nu + 2$ in the 2-power cyclotomic tower over a base field $L_0$ of degree at most $8\deg K_\chi$ that contains $\sqrt{-1}$, $\sqrt{-\mathsf q}$, and $\sqrt{-\mathsf d}$.

::: definition {#d-cw-tower title="Cyclotomic tower and Iwasawa module"}
For a number field $L$ containing $\mu_\ell$ ($\mu_4$ if $\ell = 2$), the cyclotomic tower is the sequence $L = L_0 \subset L_1 \subset \dots$ with $L_j = L(\mu_{\ell^{e_0+j}})$, where $\mu_{\ell^{e_0}}$ is the group of $\ell$-power roots of unity in $L$, each layer of degree $\ell$ over the last. The union is the cyclotomic $\ZZ_\ell$-extension, with Galois group $\Gamma \cong \ZZ_\ell$. An Iwasawa module is the inverse limit of the $\ell$-parts of class groups (or of related Galois groups) along the tower. It is a module over $\Lambda_\ell = \ZZ_\ell[[T]]$, with $1 + T$ acting as a topological generator of $\Gamma$, not a group attached to a single field.
:::

::::: card {#t-cw-iwasawa kind="theorem" title="Along a cyclotomic tower the $\ell$-part of the class number grows like $\ell$ to an exponent that is linear in $\ell^j$ and in $j$, and for abelian base fields the coefficient of $\ell^j$ is zero" source="washington-cyclotomic" loc="ch. 7 and 13"}
:::: statement
(Iwasawa) If $\ell^{t_j}$ is the $\ell$-part of $h(L_j)$, there are integers $\mu, \lambda \ge 0$ such that $t_j - \mu\,\ell^j - \lambda j$ is constant for all large $j$. (Ferrero and Washington) If $L$ is abelian over $\QQ$, then $\mu = 0$, and the $\ell$-rank of $\operatorname{Cl}(L_j)$ stays bounded as $j$ grows.
::::
:::: plain
Climbing the tower of $\ell$-power roots of unity, the $\ell$-part of the class group grows in a regular way, and over an abelian base it grows only slowly, with a bounded number of generators.
::::
:::: why
Bounded rank means the Iwasawa module is finitely generated over $\ZZ_\ell$, with at most $R$ generators. That bounds the number of exceptional twists, and that number fixes the constant $J$.
::::
:::: idea
The Iwasawa module is a finitely generated torsion $\Lambda_\ell$-module, so up to finite error it is a sum of $\Lambda_\ell/(\ell^{a})$ and $\Lambda_\ell/(f(T))$ for distinguished polynomials $f$. The first kind contributes $\ell^j$ to the exponent, the second $j\deg f$, and Ferrero and Washington showed that the first kind is absent for abelian fields.
::::
:::: sketch
Iwasawa's theorem and the structure of $\Lambda_\ell$-modules are in Washington's chapter 13, and the theorem of Ferrero and Washington, first published in 1979, is proved in his chapter 7 [@washington-cyclotomic, ch. 7, 13] [@ferrero-washington1979].
::::
:::: lean {decl="UpperTheory.V.Published.FerreroWashington" file="Development/AutomorphicArithmetic/AutomorphicVarieties/PublishedTheorems/FerreroWashington.lean"}
The code states the bounded-rank form, for $L$ abelian over $\QQ$ containing $\mu_\ell$ ($\mu_4$ for $\ell = 2$), with $\operatorname{Cl}/\operatorname{Cl}^\ell$ of size at most $\ell^r$ in every layer, and proves it as `UpperTheory.V.FW.ferreroWashington` in `GaloisLibrary/FerreroWashingtonIndex/FerreroWashington.lean`. We did not read that proof.
::::
:::: used
Used by `towerTwo` below and by its counterpart `towerFixed` for odd primes, inside `thmBab_of`.
::::
:::::

What the code takes from it is a bound $R$ on the number of $\ZZ_\ell$-generators of an Iwasawa module over the tower (`Tower.IsTower ℓ L R`, `NumberFieldTowers/XTwApplyApply.lean`). For the prime 2, `towerTwo` (`QuadraticExtensions/IsAlgClosureRat.lean`) proves from Ferrero and Washington that one $R$ works for every admissible pair $\mathsf q$, $\mathsf d$, through `baseRk` in the same file, which bounds the rank with $\sqrt{-\mathsf q}$ and $\sqrt{-\mathsf d}$ adjoined by $4(R_0 + 6\deg K_\chi)$, where $R_0$ is the rank without them. The formal proof establishes this uniformity in `baseRk`, and we state it and do not unfold its proof here. The uniformity is essential, because $\mathsf q$ and $\mathsf d$ are chosen after $J$, and $J$ is built from $R$.

From the generator bound the code passes to twists. The statement `ABound ℓ R L₀` (`LayeredIsomorphisms/SecondBound.lean`) says that there are a finite extension $K_\ell$ of $\QQ_\ell$ and at most $R$ points $s_1, \dots, s_{R'}$ in $K_\ell$ such that for every layer $L_j$ of degree $\ell^j$ over $L_0$, every twist $k \ge 1$, and every $D$ with $\abs{s_i - k}_\ell \ge \ell^{-D}$ for all $i$,
$$
\operatorname{len}\,\text{Sha}^1\bigl(L_j, \QQ_\ell/\ZZ_\ell(-k)\bigr) \le R'\,\bigl(\max(j, j_0) + e_0 + D\bigr),
$$
where $e_0$ is such that $\mu_{\ell^{e_0}} \subset L_0$ and $j_0 = \lfloor\log_\ell R\rfloor + 3$. The formal proof derives this from `IsTower` in `PropA.aBound_of_isTower` (`AdditiveValuationNorms/ABoundOfIsTower.lean`), using Poitou and Tate duality and local duality. We state it and do not unfold its proof here.

Our reading of the points $s_i$, which the code does not explain, is the following. By the twist computation of [[cw-cohomology]], the group at twist $k$ is governed by the Iwasawa module with $\Gamma$ acting through $\chi_{\mathrm{cyc}}^{-k}$, so its size is governed by the values of the module's characteristic power series at $\chi_{\mathrm{cyc}}(\gamma)^{-k} - 1$. As a function of $k$ this value is $\ell$-adic analytic, and it is small only when $k$ is $\ell$-adically close to one of its zeros. The $s_i$ would be those zeros. Away from them the length is logarithmic in the size of the twist, and near them it can be large.

::: definition {#d-cw-exceptional title="Exceptional twist"}
For a range $1 \le k \le Z$, a twist $k$ is exceptional when $\abs{s_i - k}_\ell < \ell^{-\lfloor\log_\ell Z\rfloor}$ for some $i$. Every other twist in the range obeys the bound above with $D = \lfloor\log_\ell Z\rfloor$, which is logarithmic in $Z$. An exceptional twist is a property of the pair (twist, range), not of the twist alone.
:::

The key point is that each $s_i$ spoils at most one twist, by the ultrametric inequality.

::::: card {#t-cw-near kind="lemma" title="An $\ell$-adic number is close to at most one integer of a range $[1,Z]$ at the radius $\ell^{-\lfloor\log_\ell Z\rfloor}$"}
:::: statement
Let $K_\ell$ be a field with an ultrametric absolute value extending $\abs{\cdot}_\ell$, let $s \in K_\ell$, and let $1 \le a, b \le Z$ be integers. If $\abs{s - a} < \ell^{-\lfloor\log_\ell Z\rfloor}$ and $\abs{s - b} < \ell^{-\lfloor\log_\ell Z\rfloor}$, then $a = b$.
::::
:::: plain
Two different whole numbers of a given size differ by too little to be divisible by a large power of $\ell$, so no single $\ell$-adic number can be very close to both.
::::
:::: why
It turns the bound $R$ on the points $s_i$ into a bound $R$ on the number of exceptional twists, whatever the range $Z$.
::::
:::: idea
Closeness in $\abs{\cdot}_\ell$ means agreement of many $\ell$-adic digits, and two integers below $\ell^{n+1}$ that agree in their first $n + 1$ digits are equal.
::::
:::: proof
Put $n = \lfloor\log_\ell Z\rfloor$ and suppose $a \ne b$. By the ultrametric inequality, $\abs{a - b} \le \max(\abs{s - b}, \abs{s - a}) < \ell^{-n}$. The $\ell$-adic absolute value of the nonzero integer $a - b$ is $\ell^{-v}$ with $v$ its $\ell$-adic valuation, so $v \ge n + 1$ and $\ell^{n+1}$ divides $a - b$. But the ordinary absolute value of $a - b$ is less than $Z$, and $Z < \ell^{n+1}$ by the definition of $n$, a contradiction.
::::
:::: example
Take $\ell = 3$, $Z = 50$, so $n = 3$ and the radius is $3^{-3}$. The 3-adic number $s = \tfrac12$ has expansion $2 + 1\cdot3 + 1\cdot9 + 1\cdot27 + \cdots$, so an integer $k \le 50$ is within radius $3^{-3}$ of it exactly when $k \equiv 41 \pmod{81}$, since $2\cdot41 = 82 \equiv 1$. Only $k = 41$ qualifies.
::::
:::: lean {decl="UpperTheory.V.Win.near1" file="Development/AutomorphicArithmetic/AutomorphicVarieties/LayeredIsomorphisms/Near1.lean"}
```lean
theorem UpperTheory.V.Win.near1 :
    ∀ (l : ℕ) [Fact l.Prime] (K : Type) [NormedField K] [NormedAlgebra ℚ_[l] K] [IsUltrametricDist K] (s : K) (Z a b : ℕ),
      1 ≤ a → a ≤ Z → 1 ≤ b → b ≤ Z → ‖s - (a : K)‖ < (l : ℝ) ^ (-(Nat.log l Z : ℤ)) →
        ‖s - (b : K)‖ < (l : ℝ) ^ (-(Nat.log l Z : ℤ)) → a = b
```
::::
:::: used
Used to build the exceptional set, of size at most $R$, fed to [[t-cw-window1]].
::::
:::::

::: figure {#f-cw-padic viz="padic-closeness" height="420"}
An ℓ-adic number lights up at most one integer of a range [1, Z] at the radius set by Z, because two lit integers would differ by a multiple of a power of ℓ larger than Z.

```vizspec
Purpose: make the lemma "one zero spoils at most one twist" visible on the l-adic tree.
Scene: the l-ary tree of residues, root at top, depth D = floor(log_l Z) + 1 (at most 6 levels shown).
  Level j has l^j nodes, the residues mod l^j; each node's children are its l lifts mod l^(j+1). At the
  bottom, under each leaf r (a residue mod l^D), list in small type the integers k in [1, Z] with
  k = r mod l^D (there is at most one, since Z < l^D). A path from the root, drawn teal, shows the first D
  l-adic digits of s. The leaf at the end of the path and the integer under it, if any, are drawn gold.
  A side panel shows Z, D, the radius l^(-(D-1)), and "integers within the radius: 0 or 1".
Controls: selector l in {2, 3, 5}; slider Z from 4 to 250 (D updates); s set by clicking a child at each
  level (the digit), or by presets "s = 1/2", "s = -1", "s = 7"; for l = 3 the preset 1/2 has digits
  2, 1, 1, 1, ...
Motion: when Z grows past a power of l, a new level of the tree slides in below the old leaves.
Check: l = 3, Z = 50, s = 1/2: D = 4, digits 2, 1, 1, 1, the lit integer is 41. l = 3, Z = 30, s = 1/2:
  D = 4, no integer lights, since 41 > 30.
Reader takeaway: at the radius set by Z, an l-adic number picks out at most one integer of [1, Z].
```
:::

So for each range of twists at most $R$ twists are exceptional, and every other twist has length $O(R\log x)$ at the layers in play. An exceptional twist can still be paid for if it is small. The code's `LemmaK` (`GeneratorCountTuples/LemmaK.lean`) states that for a totally imaginary field $L$ containing $\mu_\ell$ ($\mu_4$ if $\ell = 2$), of degree $n$ and discriminant $D_L$, the group $H^2(G_{L,S}, \ZZ_\ell(k+1))$ is finite with $\log\#H^2 \le \exp\bigl((2kn)^{C_K}\log(2\abs{D_L})\bigr)$, which by the duality of [[cw-weak-vandiver]] bounds $\text{Sha}^1$ at twist $k$. The formal proof establishes `LemmaK` in `ModularityArgument/ClassCounting/LemmaKOfLitN.lean`, and we state it and do not unfold its proof here. The bound is affordable when $k \le x^\eta$ with $\eta = \varepsilon/(2C_K)$, and useless when $k$ is a large power of $x$, so a scale $x$ is good when no exceptional twist lies in $(x^\eta, x^{401}]$.

## The pigeonhole over scales {#cw-pigeonhole}

On a logarithmic scale $u = \log x$, an exceptional twist $k$ spoils the scales with $x^\eta < k \le x^{401}$, that is the interval $\log k/401 \le u < \log k/\eta$, of ratio $B = 401/\eta$. At most $R$ such intervals must be avoided by a whole window $[y, 2y]$ in $u$, which is $[Y, Y^2]$ in $x$. The code's lemma `window1` finds one, losing a factor $2B$ of scale per exceptional point.

::::: card {#t-cw-window1 kind="lemma" title="If at most $R$ points each spoil an interval of ratio $B$, then below any $U$ there is a clean doubling window starting above $U/(2^{R+2}B^R)$"}
:::: statement
Let $R \in \NN$, $B \ge 1$, $U > 0$, and let $\mathcal P$ be a set of at most $R$ real numbers. There is $y$ with
$$
\frac{U}{2^{R+2}B^R} \le y, \qquad 2y \le U,
$$
such that no $a \in \mathcal P$ and no $u \in [y, 2y]$ satisfy $a \le u < Ba$.
::::
:::: plain
If a few bad spots each spoil a stretch of bounded relative length, then a clean stretch of doubling length exists that is not too far down.
::::
:::: why
Applied with $U = \log X$ and $\mathcal P = \{\log k/401\}$ over the exceptional twists, it gives the window $[Y, Y^2]$ with $Y \ge X^{1/J}$ and $J = 2^{R+2}(2C_K\cdot401/\varepsilon)^R$, a constant independent of $X$, $\mathsf q$, and $\mathsf d$.
::::
:::: idea
Look at the top window $[U/2, U]$. If no bad point lies in $(U/(2B), U]$, every bad point that is at most $u \le U$ is at most $U/(2B)$, so $Ba \le U/2 \le u$, and the top window is clean. Otherwise one bad point lies there, and everything below $U/(2B)$ is clear of it, so drop it and start again from $U/(2B)$ with one point fewer.
::::
:::: proof
Induction on $R$. For $R = 0$, $\mathcal P$ is empty and $y = U/2$ works, since $U/4 \le U/2$. Suppose the claim holds for $R$, and let $\#\mathcal P \le R + 1$.

If some $a_0 \in \mathcal P$ has $U/(2B) < a_0 \le U$, apply the claim for $R$ to $U' = U/(2B)$ and $\mathcal P \setminus \{a_0\}$. It gives $y \ge U'/(2^{R+2}B^R) = U/(2^{R+3}B^{R+1})$ with $2y \le U' \le U$ and no point of $\mathcal P\setminus\{a_0\}$ spoiling $[y, 2y]$. The point $a_0$ does not spoil it either, because $a_0 \le u$ would force $U/(2B) < u \le 2y \le U/(2B)$.

Otherwise no point of $\mathcal P$ lies in $(U/(2B), U]$. Take $y = U/2$, which satisfies $y \ge U/(2^{R+3}B^{R+1})$. If $a \in \mathcal P$ and $a \le u$ for some $u \in [U/2, U]$, then $a \le U$, so $a \le U/(2B)$ and $Ba \le U/2 \le u$, and $a$ does not spoil $u$.
::::
:::: example
Take $B = 4$ and $U = 100$ (so $X = e^{100}$), with two bad points. For $\mathcal P = \{30, 0.5\}$, the point 30 lies in $(12.5, 100]$, so the search restarts at $U' = 12.5$, where $(1.5625, 12.5]$ holds no point, and $y = 6.25$. The window $[6.25, 12.5]$ avoids the spoiled intervals $[0.5, 2)$ and $[30, 120)$, and in scales it is $x \in [e^{6.25}, e^{12.5}] \approx [518, 268337]$. For $\mathcal P = \{30, 5\}$ the second point lies in $(1.5625, 12.5]$, the search restarts at $1.5625$, and $y = 0.78125$. Each restart cost a factor $2B = 8$, and both answers respect the guaranteed floor $100/(2^4\cdot4^2) \approx 0.39$.
::::
:::: lean {decl="UpperTheory.V.Win.window1" file="Development/AutomorphicArithmetic/AutomorphicVarieties/LayeredIsomorphisms/Window1.lean"}
```lean
theorem UpperTheory.V.Win.window1 :
    ∀ (R : ℕ) (B U : ℝ) (T : Finset ℝ), 1 ≤ B → 0 < U → T.card ≤ R →
      ∃ y : ℝ, U / (2 ^ (R + 2) * B ^ R) ≤ y ∧ 2 * y ≤ U ∧ ∀ a ∈ T, ∀ u : ℝ, y ≤ u → u ≤ 2 * y → a ≤ u → B * a ≤ u
```
The translation to scales is `UpperTheory.V.Win.window` in `Window.lean`, with $B = C_t/\eta$, $\mathcal P = \{\log k / C_t\}$, and the conclusion that every $x \in [Y, Y^2]$ is `Good`, meaning every exceptional $k \le x^{C_t}$ is in fact $\le x^\eta$.
::::
:::: used
Used by `thmBab_of` with $\eta = \varepsilon/(2C_K)$ and $C_t = 401$, and through it by [[t-cw-vwin]].
::::
:::::

::: figure {#f-cw-window viz="scale-window" height="380"}
Each exceptional twist spoils one stretch of scales of fixed ratio, so with at most R of them a clean window of doubling length survives, at worst a factor 2B lower per spoiler.

```vizspec
Purpose: show the pigeonhole over scales of the lemma window1.
Scene: a horizontal axis u = log x from 0 to U (default U = 100), drawn on a logarithmic axis in u from
  U / 10^4 to U so that intervals of fixed ratio have fixed length. Each bad point a (red dot on the axis)
  shades its spoiled interval [a, B a) in pale red. The window [y, 2y] found by the recursion of window1
  is a green band. Above the axis, a ladder of the recursion: the levels U, U/(2B), U/(2B)^2, ... as
  muted tick marks, with the search interval (U/(2B), U] of each step outlined and, if a point was found
  there, that point circled. A dashed muted tick marks the guaranteed floor U / (2^(R+2) B^R).
  Under the axis, a second scale labeled x = e^u at the window ends, and a text line
  "window [Y, Y^2] = [e^y, e^(2y)]".
Controls: slider B from 1 to 16 (default 4); slider R from 0 to 5 that sets the number of bad points;
  each bad point draggable along the axis; a button "worst case" that places the points at
  U, U/(2B), U/(2B)^2, ... (just below each level) so that every step restarts.
Motion: the green band jumps to its new position with a 300 ms ease when a point is dragged.
Check: B = 4, U = 100, points {30, 0.5}: window [6.25, 12.5]. Points {30, 5}: window [0.78125, 1.5625].
Reader takeaway: the number of spoilers, not their positions, controls how far down the window can be
  pushed, so a bound R gives a fixed exponent J.
```
:::

Here the analogy of [[cw-question]] becomes concrete, in our reading. Stepanov's argument could use any large $n$, while here only the scales of a window are usable, and the window exists because the obstructions come in a bounded number, each ruling out one stretch of scales. The price, the exponent $J$, is harmless, because [[landau-endgame]] needs its inequality only on windows arbitrarily far out, and $X^{1/J}$ tends to infinity with $X$.

## The three pieces {#cw-pieces}

The proof bounds the sum [[eq-cw-vwin]] in three pieces, the prime $\ell = 2$ and the minus and plus parts for odd $\ell$. The first is `ThmBab` (`PrimeSetBoundDataOfPrimitiveChar.lean`), proved by `thmBab_of` from the results above. With $t = \lfloor x^{401}\rfloor$ it asserts that on the window $\sum_{1 \le k < t}\operatorname{len}\text{Sha}^1(E, \QQ_2/\ZZ_2(-k)) \le \exp(x^{4\varepsilon/5})$, and the same for the layers at the primes of $\mathcal B_\chi$. Unexceptional twists contribute $O(R\log x)$ each, and the few exceptional twists below $x^\eta$ are paid for by `LemmaK`.

### The minus part {#cw-minus}

The minus part is the side of Kummer and Herbrand. The code's `PsiBound` (`OddResidueBounds/ZeroMemUnrHom.lean`) states that for an abelian CM field $E$, odd $\ell$ not dividing $[E:\QQ]$, a twist $k \ge 1$, and a character $\xi$ of $\Gal(E/\QQ)$ with $\xi(-1) = (-1)^{k+1}$, the length of the $\xi$-component of the locally trivial classes is at most the $\ell$-adic valuation of a multiple of the generalized Bernoulli number
$$
B_{k+1,\xi} = f^{k}\sum_{a=1}^{f}\xi(a)\,B_{k+1}\!\Bigl(\frac af\Bigr),
$$
where $f$ is the conductor of $\xi$ and $B_{k+1}(\cdot)$ the Bernoulli polynomial (`Bprim`, `alN`). At $p = 37$, $k = 31$, and trivial $\xi$ this is the number $B_{32}$ of the dial example. The bound is proved as `ML.iv` from Poitou and Tate duality and an orthogonality statement, and `thmBcFree_of` combines it with `stickBound`, a bound named after Stickelberger's theorem, which says that an explicit element of the group ring of $\Delta$, built from the fractions $a/p$, annihilates the class group of $\QQ(\zeta_p)$, and whose eigenvalues on the minus part are the numbers $B_{1,\xi}$ [@washington-cyclotomic, ch. 6]. We state these and do not unfold their proofs here, and the role of Stickelberger is our reading of the names. The result is `ThmBcFree`, valid at every scale with no window,
$$
\sum_{\ell\ \text{odd}} \log\ell \sum_{1\le k<t} \operatorname{len}\text{Sha}^{1,-} \le 3[E:\QQ]\,t^2\log(tN) + C\sum_{\ell \mid \operatorname{ord}\chi,\ \ell \ne 2} \ell\,[E:\QQ]^2t^2\log(t\ell N)^2,
$$
with $N = \mathrm{cond}(E)$, $t$ the number of twists, and $C$ a constant (`minusBound` in `StmtFields.lean`). This is polynomial in $x$, because $\log N \le 2x^{\varepsilon/4}$.

### The plus part {#cw-plus}

The plus part is Vandiver's side, and no Bernoulli number controls it. `ThmHV` (`PrimeSetBoundDataOfPrimitiveChar.lean`) asserts that for each $\chi$ there are $C$ and two primes $r_1$, $r_2$ such that, for $\mathsf q$ and $\mathsf d$ larger than $2X^{401} + 1$ and than a finite list of integers attached to $\chi$, on every window where the 2-part and the $\mathcal B_\chi$-layers are good,
$$
\sum_{\ell\ \text{odd}}\log\ell\sum_{1 \le k < t}\operatorname{len}\text{Sha}^{1,+} \le (\mathrm{cond}(E)\,t)^C + C\exp(x^{4\varepsilon/5}).
$$
The formal proof derives it in `thmHV_of_counts` (`HeightAndVanishing/JointWinOfCounts.lean`) from counts over triples $(\ell, k, \xi)$ with $\xi$ an even character of $\Gal(E/\QQ)$. Our reading is that Shapiro's lemma splits the plus part over $E$ into pieces over $\QQ$, one for each $\xi$. The counts fall into cases in `HeightAndVanishing/DirichletPrimeToLPartMulLPowerPart.lean`, which we confirmed as definitions.

- Case I, $\ell \notin \mathcal B_\chi$ and $(\ell - 1) \nmid 2k$, is bounded through Kato's theorem that certain Bloch and Kato Selmer groups of newforms vanish (`LemmaKato`, for newforms of weight $2k + 1$), which Kato proved with his Euler system [@kato2004].
- Case Z, $\ell \notin \mathcal B_\chi$, $(\ell - 1) \mid 2k$, and $\xi = 1$, has its own statement (`PropZ`).
- Cases II and III, where $(\ell-1) \mid 2k$ or $\ell \in \mathcal B_\chi$ and $\xi$ is a nontrivial character of the kind the case names, use a statement that certain Galois representations of $\mathrm{GSp}_4$ type are automorphic with large image (`SymplecticFourImageDense`).
- Cases IV and V, $\ell \in \mathcal B_\chi$, use the layers of the Iwasawa argument and, for $k = 1$, a unitary lift.

This is where the Galois-representation input `Row0b` of [[integrality-and-galois]] and base change enter. `Row0b` attaches Galois representations to regular algebraic polarized cuspidal automorphic representations over CM fields, and the plus-part argument applies it in about a dozen files. Base change, the statement `BaseChangeIsobaricN`, transfers an automorphic representation of the unitary group in $n$ variables attached to a CM field $E$, with $E$ unramified over its real subfield at every finite place, to $\mathrm{GL}_n$ over $E$ as an isobaric sum of finitely many discrete automorphic representations, with matching local components at split places and at unramified inert places. It is a known theorem, proved by comparing trace formulas [@labesse2011], and the tree proves its own version as `baseChangeN`. We state the plus-part bound and these inputs and do not unfold the proofs of the cases, of `PointHV`, or of base change here.

:::: lean {decl="UpperTheory.One.vwin_of_row" file="Development/AutomorphicArithmetic/AutomorphicVarieties/ModularityArgument/ThresholdArguments/DenseThresholdCases/VwinOfRow.lean"}
The only hypothesis is `Row0b`. Base change enters as the theorem `baseChangeN`, not as a hypothesis.

```lean
theorem UpperTheory.One.vwin_of_row (h : UpperTheory.GalStar.Row0b fun h rc => UpperTheory.Zero.LLC.IsRecT h rc) : UpperTheory.Top.VWin :=
  UpperTheory.One.Join.automorphic_window_of_inputs (UpperTheory.LiteratureTheorems.OpenImageCondition.mk h) UpperTheory.BaseChangeIdentities.baseChangeN h
```
::::

### Adding the pieces {#cw-adding}

::::: card {#t-cw-glue kind="lemma" title="The $2$-part, the minus part, and the plus part together stay below $\exp(x^\varepsilon/2)$ for every large scale in the window"}
:::: statement
Let $0 < \varepsilon < \tfrac1{52}$, and let $C'$, $C$ be constants. For all large $x$ and every $Q \ge 1$ with $\log Q \le 2x^{\varepsilon/4}$,
$$
\log 2\cdot e^{x^{4\varepsilon/5}} + C' e^{8x^{\varepsilon/4}} + Q^C + C e^{x^{4\varepsilon/5}} \le e^{x^{\varepsilon}/2}.
$$
With $Q = \mathrm{cond}(E)\cdot t$, the three bounds above add up to a bound for [[eq-cw-vwin]].
::::
:::: plain
Each of the three pieces is an exponential of a smaller power of $x$ than the budget, so for large $x$ they fit under it with room to spare.
::::
:::: why
It is the last step from the three bounds to `VWin`, and it explains the sizes of $\mathsf q$ and $\mathsf d$. If $\log(\mathsf q\mathsf d)$ were as large as $x^{\varepsilon}$, the polynomial bounds in the conductor would no longer fit.
::::
:::: idea
Compare exponents. The budget's exponent is $\tfrac12x^{\varepsilon}$, and the others are $x^{4\varepsilon/5}$, $8x^{\varepsilon/4}$, and $2Cx^{\varepsilon/4}$, plus constants. Since $\tfrac45 < 1$ and $\tfrac14 < 1$, each is eventually a small fraction of $\tfrac12x^\varepsilon$.
::::
:::: proof
Write $w = x^{\varepsilon/20}$, so that $x^{\varepsilon/4} = w^5$, $x^{4\varepsilon/5} = w^{16}$, and $x^{\varepsilon} = w^{20}$. With $M = \max(\abs{C'}, \abs C, 1)$, each of the four terms is at most $M\exp(\max(w^{16}, 8w^5, 2Mw^5))$, using $Q^C \le e^{2\abs C w^5}$. Once $w^{16} \ge 2Mw^5$ and $w^{16} \ge 8w^5$, the left side is at most $4Me^{w^{16}}$, and once moreover $w^{20}/2 - w^{16} \ge \log(4M)$, it is at most $e^{w^{20}/2}$. All three conditions hold for large $w$. In `vwinAt_of_joint` the inputs are bounded as follows. The 2-part is at most $e^{x^{4\varepsilon/5}}$ (`BaAt`) and enters with weight $\log 2$. The minus part is at most $\mathrm{minusBound}$, which `minusBound_le_exp_of_log_le` bounds by $C'e^{8x^{\varepsilon/4}}$ because $\log(\mathrm{cond}(E)\,t) \le 2x^{\varepsilon/4}$ (`log_conductor_mul_height_le_of_pageN`, which uses $\log(\mathsf q\mathsf d) \le x^{\varepsilon/4}$ from `WinPair`). The plus part is at most $Q^C + Ce^{x^{4\varepsilon/5}}$ (`HVAt`). For odd $\ell$ the length is the plus length plus the minus length (`shaLen_eq_add`), so `vvle_of_parts` adds the three, and the inequality closes the bound.
::::
:::: lean {decl="UpperTheory.V.error_terms_le_sqrt_exp_rpow" file="Development/AutomorphicArithmetic/AutomorphicVarieties/CMFieldExponentialBounds/ErrorTermsLeSqrtExpRpow.lean"}
```lean
theorem UpperTheory.V.error_terms_le_sqrt_exp_rpow :
    ∀ eps K C : ℝ, 0 < eps → ∃ x0 : ℝ, ∀ x ≥ x0, ∀ u : ℝ, 1 ≤ u → Real.log u ≤ 2 * x ^ (eps / 4) →
      Real.exp (x ^ (4 * eps / 5)) * Real.log 2 + K * Real.exp (8 * x ^ (eps / 4)) + (u ^ C + C * Real.exp (x ^ (4 * eps / 5))) ≤
        Real.sqrt (Real.exp (x ^ eps)) := by
```
The gluing is `vwinAt_of_joint` in `CMFieldExponentialBounds/AdmissibleOfPageN.lean`, which also checks that the window found by `JointWin` at exponent $J$ gives the window of `VWinAt` at exponent $\max(J, 1)$.
::::
:::: used
Completes [[t-cw-vwin]].
::::
:::::

::: figure {#f-cw-budget viz="cohomology-budget" height="360"}
On a log-log scale every contribution is a line of slope at most four fifths of ε, while the budget has slope ε, so the budget overtakes all of them, though only at astronomically large scales.

```vizspec
Purpose: compare the exponents of the three contributions with the budget, as the gluing lemma does.
Scene: horizontal axis L = log10 x from 0 to 3000. Vertical axis log10 of the exponent (that is,
  log10 log of each quantity), from -1 to 60. Four lines:
  budget, blue: log10(x^eps / 2) = eps L - log10 2;
  2-part, gold: log10(x^(4 eps/5)) = (4 eps/5) L;
  minus part, teal: log10(8 x^(eps/4)) = (eps/4) L + log10 8;
  plus part, red: log10(2 C x^(eps/4)) = (eps/4) L + log10(2C), with C a slider.
  Shade the region of L where the blue line is above all others (more precisely where
  x^eps/2 - x^(4 eps/5) >= log 4 and x^(4 eps/5) >= max(8, 2C) x^(eps/4)); mark its left end with a
  vertical muted line labeled "large enough".
Controls: slider eps from 0.002 to 0.019 (default 0.01); slider C from 1 to 100 (default 1).
Motion: lines pivot as eps changes.
Check: eps = 0.01: the 2-part and budget lines cross where x^(eps/5) = 2, that is L = 5 log10 2 / eps,
  about 150.5.
Reader takeaway: the window bound is an asymptotic statement, and the exponent eps of the budget beats
  4 eps/5 and eps/4 only for very large x.
```
:::

## How the window is used {#cw-used}

`VWin` has exactly one consumer. The theorem `supplyChi` (`CharacterBoxes/SupplyChi.lean`) turns `VWinAt χ 401` into `HostExW (3/2) (GChi χ).req`, the statement that for every $\varepsilon < \tfrac1{52}$ some set of scales contains windows $[Z, Z^{3/2}]$ arbitrarily far out, at each of which a host exists, an arithmetic package around the field $E$ that satisfies the bound of [[t-cw-vwin]] and analytic bounds for the characters of $\Gal(E/\QQ)$ [@alpoge-lean]. The step from $[Y, Y^2]$ to $[Z, Z^{3/2}]$ is `winPairs` (`CharacterBoxes/WinPairs.lean`), which also supplies the auxiliary primes through the existence statement `PairEx`. The analytic bounds come from the choice of $\mathsf q$ and $\mathsf d$, not from this chapter.

Downstream, `vvRecord` (`CharacterBoxes/DivinNOfHypV.lean`) turns the bound into one on $\sum_\ell$ `vvTerm`, where `vvTerm D ℓ` is $\log\ell$ times the sum of the lengths over the twists, and `LinkN_at` (`Formalism/SharpRestriction/GlobalTheoremInputs.lean`) bounds a weighted sum of divisibility exponents by
$$
d_0\Bigl(C\bigl(f\,m\,b\,x^{2\varepsilon} + (\log x)^2 N_c\bigr) + \sum_\ell \mathrm{vvTerm}_\ell\Bigr), \qquad b = e^{x^\varepsilon},
$$
with $m$ the chain length, $x^{2\varepsilon}$ the square of the code's `L`, and $d_0$, $f$, $N_c$ further entries of the record. So the cohomology enters as an additive cost beside a term of order $b$, and in our reading the budget $\sqrt b$ is chosen so that this cost is small beside it. We also read this cost as the note's classes "that we couldn't kill by twisting", an identification that is ours, since the code does not use these words. How `DIVinN_at`, the bound that `divinN_at` derives from this one, enters the divisibility inequality `DIV` of the record `SizeData₂` of [[integrality-and-galois]] was not traced, here or there.

Because the hosts exist only on windows, the upper bound on the smoothed prime sums that the chain produces holds only for scales in windows. That is why the endgame of [[landau-endgame]] works from a one-sided bound on windows $[Y, Y^{3/2}]$ rather than for all large $x$, and why it needs a windowed Landau theorem at all. The windows of the whole proof originate here.

The note's step 19, a precise choice of the tower using Behrend's sets, plays no part in this region. The folder `Formalism/BehrendSets` is not in the import closure of `SupplyChi.lean`, no declaration on the path to `VWin` that we opened refers to it, and the choice of $\mathsf q$, $\mathsf d$, and $\nu$ uses only congruences and size conditions.

::: symbols
| Symbol | What it is | Kind | Where it lives |
| --- | --- | --- | --- |
| $\operatorname{Cl}(F)$, $h_F$ | ideal class group and class number | finite abelian group, integer | [[d-cw-class-group]] |
| $\mathcal A$, $\mathcal A^\pm$, $\mathcal A(\omega^i)$ | $p$-part of $\operatorname{Cl}(\QQ(\zeta_p))$, its plus and minus parts, its eigenspaces | finite $\ZZ_p$-modules | [[d-cw-plus-minus]] |
| $h^+$, $h^-$ | class number of $\QQ(\zeta_p)^+$ and relative class number | integers | [[cw-kummer]] |
| $B_k$, $B_{k,\xi}$ | Bernoulli numbers and generalized Bernoulli numbers | rational and algebraic numbers | [[t-cw-kummer]], [[cw-minus]] |
| $\omega$ | Teichmüller character modulo $p$ | Dirichlet character | [[t-cw-kummer]] |
| $\chi_{\mathrm{cyc}}$ | $\ell$-adic cyclotomic character | homomorphism to $\ZZ_\ell^\times$ | [[d-cw-twist]] |
| $\QQ_\ell/\ZZ_\ell(-k)$ | Tate twist of $\QQ_\ell/\ZZ_\ell$ | discrete Galois module | [[d-cw-twist]] |
| $G_{F,S}$ | Galois group of the largest extension unramified outside $\ell$ | profinite group | [[cw-cohomology]] |
| $\text{Sha}^1(F, M)$ | locally trivial classes | $\ZZ_\ell$-module | [[d-cw-sha]] |
| $\nu$ | level of the 2-power tower, the code's `e` | integer, $2^\nu \approx x^{2+8\varepsilon}$ | [[cw-field]] |
| $\mathsf q$, $\mathsf d$ | auxiliary primes, $\mathsf q \equiv 3 \bmod 8$, $\mathsf d \equiv 7 \bmod 16$ | primes, $\log \mathsf q \approx Y_0^{\varepsilon/5}$ | [[cw-field]] |
| $K_\chi$, $E$ | field of the character, and the field of `VWin` | abelian number fields | [[t-cw-compositum]] |
| $J$, $X_\ast$, $R$ | window exponent, threshold of [[t-cw-vwin]], and number of exceptional twists | constants | [[t-cw-vwin]], [[t-cw-window1]] |
| $L_j$, $e_0$, $t_j$ | layers of a cyclotomic tower, the exponent with $\mu_{\ell^{e_0}} \subset L_0$, the $\ell$-adic valuation of $h(L_j)$ | number fields, integers | [[d-cw-tower]], [[t-cw-iwasawa]] |
| $\mathcal B_\chi$ | finite set of special odd primes attached to $\chi$ | set of primes | [[cw-iwasawa]] |
| $s_i$, $D$, $B$, $\eta$, $C_K$ | zeros of the Iwasawa bound, its precision, ratio of a spoiled interval, small exponent, constant of `LemmaK` | $\ell$-adic numbers, integer, reals | [[cw-iwasawa]], [[cw-pigeonhole]] |
:::

::: recap
- With trivial coefficients the locally trivial classes $\text{Sha}^1$ are the characters of the class group that kill the primes above $\ell$ ([[t-cw-sha-class]]), and twisting by $\chi_{\mathrm{cyc}}^{-k}$ selects an eigenspace of the class groups up the tower of $\ell$-power roots of unity.
- For $\QQ(\zeta_p)$, Bernoulli numbers control the minus part ([[t-cw-kummer]], with $37 \mid B_{32}$), and Vandiver's conjecture ([[t-cw-vandiver]]) is the vanishing of the plus part, in the code's convention the plus part of $\text{Sha}^1$.
- `VWin` ([[t-cw-vwin]]) bounds, on a window $[Y, Y^2]$ with $X^{1/J} \le Y \le X^{1/2}$, the sum over all $\ell$ and all $k < x^{401}$ of $\log\#\text{Sha}^1(E, \QQ_\ell/\ZZ_\ell(-k))$ by $\exp(x^\varepsilon/2)$, for the abelian CM field $E$ of [[t-cw-compositum]]. In our reading it is weaker than Vandiver in kind and wider in scope.
- Ferrero and Washington bound the number of exceptional twists by $R$, uniformly in $\mathsf q$ and $\mathsf d$ ([[t-cw-iwasawa]], [[t-cw-near]]), and the pigeonhole [[t-cw-window1]] turns that into a window with $J = 2^{R+2}(2C_K\cdot401/\varepsilon)^R$.
- Bernoulli numbers bound the minus part everywhere, Kato's Euler system and automorphy bound the plus part on the windows through `Row0b` and base change, and the pieces fit under the budget ([[t-cw-glue]]).
- `VWin` feeds only `supplyChi`, the hosts on windows $[Z, Z^{3/2}]$, which is why [[landau-endgame]] works on windows. [[inputs-and-assembly]] lists the published theorems named here.
:::
