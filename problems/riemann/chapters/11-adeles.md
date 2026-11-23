---
id: adeles
title: "The adeles: all completions at once"
part: 3
summary: After this chapter you can compute the p-adic size of a rational number, integrate over the p-adic numbers, describe the adeles, the ideles, and the idele class group of Q, and say why a function on that class group with trivial character is a function of one positive real variable.
needs: [euler-product, complex-toolkit, zeta-continued]
---

::: plain
A fraction has an ordinary size, and it also has one size for every prime: a number divisible by a high power of 3 counts as small for the prime 3. These sizes are tied together by one rule, that their product is always 1. The adeles are the space that records all of these sizes at once. The proof in this part of the page lives there, because it removes the primes from a sum one at a time, and the adeles are where "one prime at a time" has a precise meaning.
:::

Part III follows the proof of A. M. Masullo [@masullo]. Its objects are sums like Riemann's theta function, and its main move is to delete from such a sum all terms divisible by one prime $p$, look at what the deletion lost, and repeat for the next prime. Over $\QQ$ every object can be written as a function of one positive real variable, and that is how chapters [[tate-theta]] to [[trace-to-grh]] will write them. But the deletion step, and the reason it changes the Mellin transform by exactly one Euler factor, is clearest in a space where each prime has its own coordinate. That space is the adele ring. This chapter builds it over $\QQ$ and keeps only what Part III uses: the $p$-adic numbers with their measure and Fourier transform, the adeles and ideles, the idele class group $C_\QQ\cong\RR_{>0}\times\hat\ZZ^\times$, the functions $g\otimes\bigotimes_p\mathbf 1_{\ZZ_p}$, and Poisson summation on $\AA/\QQ$.

There is a short way to see why the adeles are forced on us. In [[zeta-continued]] the completed zeta function was a product of the Gamma factor $\pi^{-s/2}\Gamma(s/2)$ and the Euler factors $(1-p^{-s})^{-1}$, and the chapter called the Gamma factor the Euler factor of a "prime at infinity". By the end of this chapter each of these factors will be the same kind of integral, taken over a different completion of $\QQ$: the Gamma factor over $\RR$, and the factor at $p$ over the $p$-adic numbers $\QQ_p$. A product of integrals over all completions is one integral over their product, and that product is the adeles.

## A second way to measure size {#s-ad-sizes}

The ordinary absolute value measures how far a number is from 0 on the line. A prime gives a different notion of nearness: two integers are close for the prime $p$ when their difference is divisible by a high power of $p$. This is the notion behind congruences, and it has an absolute value of its own.

:::: definition {#d-ad-padic-abs title="$p$-adic valuation and $p$-adic absolute value"}
Fix a prime $p$. Every nonzero rational number can be written uniquely as $x=p^{m}\,a/b$ with $m\in\ZZ$ and integers $a,b$ not divisible by $p$. The exponent $m$ is the *$p$-adic valuation* $v_p(x)$, and the *$p$-adic absolute value* is
$$
\abs{x}_p=p^{-v_p(x)},\qquad \abs{0}_p=0.
$$
It is a function from $\QQ$ to the nonnegative rationals. It is not a distance along the line: $\abs{x}_p$ is small when $x$ is divisible by a high power of $p$, whatever the ordinary size of $x$. We write $\abs{x}_\infty$ for the ordinary absolute value, so that "$v$" can range over the symbols $\infty,2,3,5,\dots$ and $\abs{x}_v$ means the matching size.
::::

Test it on $600=2^3\cdot3\cdot5^2$. Its sizes are $\abs{600}_\infty=600$, $\abs{600}_2=\tfrac18$, $\abs{600}_3=\tfrac13$, $\abs{600}_5=\tfrac1{25}$, and $\abs{600}_p=1$ for every other prime. A fraction can be large at a prime: $\abs{7/12}_2=4$ and $\abs{7/12}_3=3$, because the denominator holds $2^2$ and $3$.

Two properties make $\abs{\cdot}_p$ an absolute value. It is multiplicative, $\abs{xy}_p=\abs x_p\abs y_p$, because valuations add. And it satisfies a strong form of the triangle inequality,
$$
\abs{x+y}_p\le\max\bigl(\abs x_p,\abs y_p\bigr),
$$ {#eq-ad-ultrametric}
because if $p^m$ divides both $x$ and $y$ (in the sense of valuations), it divides their sum. This *ultrametric* inequality has a geometric consequence that will matter below: a ball $\{x:\abs{x-a}_p\le r\}$ has every one of its points as a center, and two balls are either nested or disjoint.

Are there other sizes? Ostrowski's theorem says no. Every absolute value on $\QQ$ that is not trivial is a positive power of either the ordinary one or one of the $\abs{\cdot}_p$ [@gouvea]. So the list $\infty,2,3,5,7,\dots$ is complete. These are called the *places* of $\QQ$.

The sizes of one rational number are not independent of each other. They are bound by a single identity.

:::: theorem {#t-ad-product-formula title="The product of all the sizes of a nonzero rational number is $1$"}
For every $x\in\QQ$ with $x\ne0$,
$$
\abs{x}_\infty\prod_p\abs{x}_p=1,
$$ {#eq-ad-product-formula}
where all but finitely many factors of the product are equal to $1$.
::::

::: proof
Write $x=\pm\prod_p p^{v_p(x)}$, which is unique factorization. Then $\abs x_\infty=\prod_pp^{v_p(x)}$ and $\prod_p\abs x_p=\prod_pp^{-v_p(x)}$, and the two products are inverse to each other. Only the primes dividing the numerator or the denominator give factors other than $1$.
:::

Test it on $x=-45/28$. The sizes are $\abs x_\infty=\tfrac{45}{28}$, $\abs x_2=4$, $\abs x_3=\tfrac19$, $\abs x_5=\tfrac15$, $\abs x_7=7$, and the product is $\tfrac{45\cdot4\cdot7}{28\cdot9\cdot5}=\tfrac{1260}{1260}=1$. The formula is unique factorization written as a balance: every prime that makes $x$ large at infinity makes it small at that prime by exactly the same factor. This is the same unique factorization that gave the Euler product in [[euler-product]], and it will reappear as the statement that the rational numbers have size 1 in the adeles.

:::: figure {#f-ad-sizes viz="rational-sizes" height="380"}
The sizes of a rational number at infinity and at each prime multiply to 1, so their logarithms sum to 0.

```vizspec
Purpose: show that a rational number has one size per place and that the product formula ties them together.
Scene: a horizontal row of vertical bars, one per place: infinity, then the primes 2, 3, 5, 7, 11, 13, 17, 19, 23. The height of the bar for place v is log|x|_v, drawn up for positive and down for negative from a muted zero line. The bar at infinity is blue; the prime bars are gold. At the right end, a single red bar shows the total sum of all the log-sizes, which is always exactly 0 (draw it as a thin red line at the zero level with the label "sum = 0").
Controls: two integer inputs (steppers) for the numerator a in [-5000, 5000], a != 0, and the denominator b in [1, 5000]. Six preset buttons: 600, 7/12, -45/28, 1/1024, 2^10 * 3^-6 = 1024/729, 97 (a prime). Hovering a bar prints |x|_v as an exact fraction (for example "|7/12|_2 = 4").
Motion: when the input changes, bars grow or shrink to their new heights over 250 ms.
Readout: a line printing the factorization of x, for example "-45/28 = -1 * 2^-2 * 3^2 * 5 * 7^-1", and a line printing the product of all sizes as an exact fraction, always "1".
Reader takeaway: a prime that divides the numerator makes the number small at that prime and large at infinity by the same factor, so the up and down bars always cancel.
Data: none; factor the inputs in the browser by trial division.
```
::::

## Completing: the p-adic numbers {#s-ad-qp}

The real numbers are what you get by adding to $\QQ$ the limits of all sequences that are Cauchy for $\abs\cdot_\infty$. Doing the same with $\abs\cdot_p$ gives a new field.

:::: definition {#d-ad-qp title="the $p$-adic numbers and the $p$-adic integers"}
The field $\QQ_p$ of *$p$-adic numbers* is the completion of $\QQ$ for $\abs\cdot_p$: its elements are equivalence classes of sequences of rationals that are Cauchy for $\abs\cdot_p$, and $\abs\cdot_p$ and $v_p$ extend to it. Every $x\in\QQ_p$ with $x\ne0$ has a unique expansion
$$
x=\sum_{k\ge m}a_kp^k,\qquad a_k\in\{0,1,\dots,p-1\},\ a_m\ne0,
$$ {#eq-ad-expansion}
which converges for $\abs\cdot_p$, and then $v_p(x)=m$. The ring of *$p$-adic integers* is the closed unit ball $\ZZ_p=\{x:\abs x_p\le1\}$, the expansions with $m\ge0$, and its *units* are $\ZZ_p^\times=\{x:\abs x_p=1\}$, the expansions with $a_0\ne0$. $\QQ_p$ is not a subset of $\RR$ or of $\CC$, and the expansion runs to the left, toward higher powers, not to the right as a decimal does.
::::

The expansion is the digits of a number in base $p$, allowed to continue forever toward the high powers. Ordinary integers are the finite expansions with $m\ge0$. Some familiar numbers have infinite ones. In $\ZZ_5$,
$$
-1=4+4\cdot5+4\cdot5^2+4\cdot5^3+\cdots,
$$
because adding $1$ makes every digit carry: the partial sums are $5^k-1$, and $\abs{(5^k-1)-(-1)}_5=5^{-k}\to0$. In $\ZZ_2$ the fraction $\tfrac13$ has digits $1,1,0,1,0,1,0,1,\dots$ from $2^0$ upward: its last $k$ digits are the inverse of $3$ modulo $2^k$, for example $43$ modulo $64$, and $3\cdot43=129\equiv1$ modulo $64$. So a rational number lies in $\ZZ_p$ exactly when $p$ does not divide its denominator.

That last sentence is the fact this part of the page uses most, so we record it with its global form.

:::: lemma {#l-ad-integers title="A rational number is an integer exactly when it is a $p$-adic integer for every prime $p$"}
For $x\in\QQ$: $x\in\ZZ_p$ if and only if $p$ does not divide the denominator of $x$ in lowest terms. Hence $x\in\ZZ$ if and only if $x\in\ZZ_p$ for every prime $p$, and $x\in\ZZ$ with $p\nmid x$ if and only if $x\in\ZZ_p^\times$ and $x\in\ZZ_\ell$ for every prime $\ell\ne p$.
::::

::: proof
$\abs x_p\le1$ means $v_p(x)\ge0$, which means no power of $p$ in the denominator. An integer is a rational with no prime in its denominator. For the last claim, $x\in\ZZ_p^\times$ adds the condition $v_p(x)=0$, which for an integer means $p\nmid x$.
:::

Every nonzero $x\in\QQ_p$ factors uniquely as $x=p^{v_p(x)}u$ with $u\in\ZZ_p^\times$, by pulling the lowest power out of [[eq-ad-expansion]]. So $\QQ_p^\times$ is a disjoint union of shells,
$$
\QQ_p^\times=\bigsqcup_{m\in\ZZ}p^m\ZZ_p^\times.
$$ {#eq-ad-shells}
This decomposition is the $p$-adic counterpart of writing a nonzero real number as a sign times a positive number, and it is how every integral over $\QQ_p^\times$ below is computed: one shell at a time.

The topology of $\ZZ_p$ is that of a tree. The ball $a+p^k\ZZ_p$ is the set of $p$-adic integers whose last $k$ digits agree with those of $a$; it splits into $p$ smaller balls according to the next digit. So $\ZZ_p$ is the set of infinite paths down a tree in which every node has $p$ children, and $\ZZ_p\cong\varprojlim_k\ZZ/p^k\ZZ$, a compatible choice of residue modulo every power of $p$. Each ball is both open and closed, and $\ZZ_p$ is compact: a sequence of paths always has a subsequence that agrees on longer and longer initial segments. Compactness of $\ZZ_p$ is what will make the adeles locally compact.

:::: figure {#f-ad-tree viz="padic-tree" height="440"}
The $p$-adic integers are the paths down a tree of residues, a ball is a subtree, and the Haar measure gives each subtree at depth $k$ the mass $p^{-k}$.

```vizspec
Purpose: make Z_p concrete as the set of paths in a p-ary tree, show balls as subtrees, units as the subtrees whose first digit is nonzero, and measure as width.
Scene: a tree drawn top to bottom with depth levels k = 0 to 5 (k = 0 is the root, labeled Z_p). Each node at depth k is a residue class modulo p^k, labeled by its residue (show labels for depth <= 3 only). The leaves at depth 5 are drawn as a thin horizontal band of p^5 cells, each cell's width proportional to p^-5, so the full width is 1. A selected element x is drawn as a gold path from the root down through its residues mod p, p^2, ..., p^5. The subtrees whose first digit a_0 is nonzero are shaded light blue and labeled "units Z_p^x, measure 1 - 1/p". The subtree a_0 = 0 is labeled "pZ_p, measure 1/p".
Controls: a selector for p in {2, 3, 5}. A selector for x among: 0, 1, -1, 1/3 (for p = 2 and 5), -1/2 (for p = 3 and 5), 7, 600. A depth slider k from 0 to 5 that highlights the ball x + p^k Z_p as a red-outlined subtree and prints "measure p^-k = ...".
Motion: changing x animates the gold path; changing k grows or shrinks the red subtree.
Readout: the first six digits of x in base p (lowest first), for example "1/3 in Z_2: 1 1 0 1 0 1 ...", and the residue of x modulo p^k.
Reader takeaway: p-adic closeness means sharing many low digits; a ball is a subtree; the measure of a ball halves (or divides by p) at each level; the units are everything off the zero branch.
Data: none; compute residues with modular inverses in the browser.
```
::::

## Measuring sets and integrating in $\QQ_p$ {#s-ad-haar}

To write Euler factors as integrals we need a way to integrate over $\QQ_p$. On $\RR$ the length $\dd x$ is singled out by one property: it does not change when sets are translated. The same property singles out a measure on $\QQ_p$.

:::: definition {#d-ad-haar title="Haar measure on $\QQ_p$ and on its multiplicative group"}
The *additive Haar measure* $\dd x$ on $\QQ_p$ is the unique translation-invariant measure with $\int_{\ZZ_p}\dd x=1$ [@ramakrishnan-valenza]. The *multiplicative Haar measure* on $\QQ_p^\times$ is
$$
\dd^\times x=\frac{p}{p-1}\,\frac{\dd x}{\abs x_p},
$$ {#eq-ad-mult-measure}
normalized so that $\int_{\ZZ_p^\times}\dd^\times x=1$; this is the normalization of the source [@masullo, p. 127 and Definition A.3.2.2] and of Tate [@tate1967]. On $\RR^\times$ the multiplicative measure is $\dd x/\abs x$. Neither is a probability measure on all of $\QQ_p$ or $\QQ_p^\times$: both give the whole space infinite mass.
::::

Every value of $\dd x$ follows from translation invariance and the normalization. The ball $\ZZ_p$ is the disjoint union of the $p^k$ translates $a+p^k\ZZ_p$, $0\le a<p^k$, which all have the same measure, so
$$
\int_{a+p^k\ZZ_p}\dd x=p^{-k}=\abs{p^k}_p.
$$
More generally, $\int_{aB}\dd x=\abs a_p\int_B\dd x$ for any $a\in\QQ_p^\times$ and measurable $B$ [@masullo, Lemma A.3.1.4, p. 556]: the $p$-adic absolute value is exactly the factor by which multiplication changes volume, as $\abs a_\infty$ is on $\RR$. The units are $\ZZ_p$ minus $p\ZZ_p$, so $\int_{\ZZ_p^\times}\dd x=1-\tfrac1p$, which explains the factor $\tfrac p{p-1}$ in [[eq-ad-mult-measure]]. On each shell of [[eq-ad-shells]] the factor $1/\abs x_p$ is constant, so every shell $p^m\ZZ_p^\times$ has multiplicative measure exactly $1$.

Now the computation that motivates everything. Integrate $\abs x_p^s$ against $\dd^\times x$ over the $p$-adic integers, one shell at a time:

:::: proposition {#t-ad-local-zeta title="The integral of $\abs x_p^s$ over the nonzero $p$-adic integers is the Euler factor at $p$, and over the units it is $1$" source="tate1967"}
For $\Re s>0$,
$$
\int_{\QQ_p^\times}\mathbf 1_{\ZZ_p}(x)\,\abs x_p^{s}\,\dd^\times x=\frac1{1-p^{-s}},\qquad\int_{\QQ_p^\times}\mathbf 1_{\ZZ_p^\times}(x)\,\abs x_p^{s}\,\dd^\times x=1.
$$ {#eq-ad-local-zeta}
At the real place, for the Gaussian, $\int_{\RR^\times}e^{-\pi x^2}\abs x^s\,\dd x/\abs x=\pi^{-s/2}\Gamma(s/2)$ for $\Re s>0$.
::::

::: proof
By [[eq-ad-shells]], $\ZZ_p\setminus\{0\}=\bigsqcup_{m\ge0}p^m\ZZ_p^\times$. On the shell $p^m\ZZ_p^\times$ the integrand is the constant $p^{-ms}$ and the shell has measure $1$, so the first integral is $\sum_{m\ge0}p^{-ms}=(1-p^{-s})^{-1}$, a geometric series that converges for $\Re s>0$. The second integral keeps only the shell $m=0$. For the real integral, the integrand is even, so it is $2\int_0^\infty e^{-\pi x^2}x^{s}\,\dd x/x$, and the substitution $u=\pi x^2$ turns it into $\pi^{-s/2}\int_0^\infty e^{-u}u^{s/2}\,\dd u/u=\pi^{-s/2}\Gamma(s/2)$.
:::

At $s=2$ the three factors for $p=2,3,5$ are $\tfrac43$, $\tfrac98$, and $\tfrac{25}{24}$, and the product of the factors for $p\le13$ is $1.61792$, on its way to $\zeta(2)=1.64493$. The Gaussian integral at $s=2$ is $\pi^{-1}\Gamma(1)=0.318310$, which a numerical quadrature reproduces to every digit shown. So both kinds of factor in Riemann's $\pi^{-s/2}\Gamma(s/2)\zeta(s)$ are integrals of the same shape: a nice function on a completion of $\QQ$, times $\abs x_v^s$, against the multiplicative Haar measure.

The second integral in [[eq-ad-local-zeta]] is the seed of the method of Part III. The function $\mathbf 1_{\ZZ_p}$ gives the Euler factor at $p$. Replacing it by $\mathbf 1_{\ZZ_p^\times}=\mathbf 1_{\ZZ_p}-\mathbf 1_{p\ZZ_p}$ gives $1$, so the replacement divides by that Euler factor, that is, it multiplies by $1-p^{-s}$. Chapter [[tate-theta]] reads the same replacement as "delete the multiples of $p$ from a sum over integers", and chapter [[primes-as-circles]] measures what the deletion loses.

## Characters and the Fourier transform on $\QQ_p$ {#s-ad-fourier-local}

Poisson summation on $\RR$ needed the waves $e^{2\pi ixy}$, which are the continuous homomorphisms from the additive group $\RR$ to the unit circle. $\QQ_p$ has waves too.

:::: definition {#d-ad-character title="the $p$-adic fractional part and the standard character"}
For $x\in\QQ_p$ with expansion [[eq-ad-expansion]], the *$p$-adic fractional part* is $\{x\}_p=\sum_{k<0}a_kp^k$, the part of the expansion with negative powers. It is a rational number in $[0,1)$ whose denominator is a power of $p$, and $x-\{x\}_p\in\ZZ_p$. The *standard characters* are
$$
\mathbf e_p(x)=e^{2\pi i\{x\}_p}\quad(x\in\QQ_p),\qquad\mathbf e_\infty(x)=e^{-2\pi ix}\quad(x\in\RR).
$$ {#eq-ad-characters}
Each is a continuous homomorphism from the additive group to the unit circle. $\mathbf e_p$ is equal to $1$ on all of $\ZZ_p$ and is not identically $1$ on $p^{-1}\ZZ_p$. The opposite signs at $p$ and at $\infty$ are Tate's convention [@tate1967]; they are chosen so that the product over all places is trivial on $\QQ$ ([[l-ad-character-trivial]]).
::::

The *Fourier transform* on $\QQ_p$ is $\hat f(y)=\int_{\QQ_p}f(x)\,\mathbf e_p(xy)\,\dd x$, and on $\RR$ it is $\hat f(y)=\int f(x)\mathbf e_\infty(xy)\,\dd x=\int f(x)e^{-2\pi ixy}\,\dd x$, the transform of [[complex-toolkit]]. The functions it acts on at $p$ are the *Schwartz-Bruhat functions* on $\QQ_p$: the locally constant functions with compact support, which are the finite linear combinations of indicators of balls $\mathbf 1_{a+p^k\ZZ_p}$. They play the role of the Schwartz functions on $\RR$.

:::: proposition {#t-ad-zp-selfdual title="The indicator of the $p$-adic integers is its own Fourier transform" source="tate1967"}
$\widehat{\mathbf 1_{\ZZ_p}}=\mathbf 1_{\ZZ_p}$, and more generally $\widehat{\mathbf 1_{p^k\ZZ_p}}=p^{-k}\,\mathbf 1_{p^{-k}\ZZ_p}$ for $k\in\ZZ$.
::::

::: proof
$\widehat{\mathbf 1_{\ZZ_p}}(y)=\int_{\ZZ_p}\mathbf e_p(xy)\,\dd x$. If $y\in\ZZ_p$ then $xy\in\ZZ_p$ for every $x\in\ZZ_p$, the integrand is $1$, and the integral is $\int_{\ZZ_p}\dd x=1$. If $y\notin\ZZ_p$, then $x\mapsto\mathbf e_p(xy)$ is a character of the compact group $\ZZ_p$ that is not identically $1$, since at $x=1$ it equals $e^{2\pi i\{y\}_p}$ with $\{y\}_p\in(0,1)$. Pick $x_0$ with $\mathbf e_p(x_0y)\ne1$. Translation invariance gives $I=\int\mathbf e_p((x+x_0)y)\,\dd x=\mathbf e_p(x_0y)I$, so $I=0$. The general case follows by the substitution $x\mapsto p^kx$, which multiplies $\dd x$ by $p^{-k}$ [@masullo, Example A.3.1.6, p. 557].
:::

So $\mathbf 1_{\ZZ_p}$ is to $\QQ_p$ what the Gaussian $e^{-\pi x^2}$ is to $\RR$: it is self-dual, and by [[t-ad-local-zeta]] its multiplicative integral is the local Euler factor. This parallel, which Tate made the organizing principle of his thesis [@tate1967], is the reason the Gaussian and the indicators appear side by side in the next section. The units do not share it: from the proposition, $\widehat{\mathbf 1_{\ZZ_p^\times}}=\mathbf 1_{\ZZ_p}-p^{-1}\mathbf 1_{p^{-1}\ZZ_p}$, which is not supported in $\ZZ_p$.

## All sizes at once: the adeles {#s-ad-adeles}

A rational number $x$ has all of its sizes $\abs x_\infty,\abs x_2,\abs x_3,\dots$ at once. So it is natural to look at the vector $(x,x,x,\dots)$ with one coordinate in each completion, $\RR,\QQ_2,\QQ_3,\dots$, and at the space of all such vectors. The full product $\RR\times\prod_p\QQ_p$ is too big: it is not locally compact, so it has no Haar measure and no Fourier analysis. A rational number has only finitely many primes in its denominator, so its vector lies in $\ZZ_p$ at all but finitely many places. Keeping exactly this condition gives the right space.

:::: definition {#d-ad-adeles title="the adeles of $\QQ$"}
The *adele ring* of $\QQ$ is
$$
\AA=\Bigl\{x=(x_\infty,x_2,x_3,x_5,\dots)\in\RR\times\prod_p\QQ_p:\ x_p\in\ZZ_p\text{ for all but finitely many }p\Bigr\},
$$
with componentwise addition and multiplication. Its topology is the *restricted product* topology: a basic open set is $U_\infty\times\prod_{p\in S}U_p\times\prod_{p\notin S}\ZZ_p$, with $S$ a finite set of primes and $U_v$ open in $\QQ_v$. With it, $\AA$ is a locally compact ring [@masullo, Lemma A.1.1.2, p. 539]. The rationals sit inside by the *diagonal embedding* $\xi\mapsto(\xi,\xi,\xi,\dots)$. We write $\hat\ZZ=\prod_p\ZZ_p$, a compact ring, so that $\RR\times\hat\ZZ$ is an open subring of $\AA$. The adeles are not a field and not a vector space over $\RR$; $\AA$ is not the product topology restricted from $\RR\times\prod_p\QQ_p$ either, since $\prod_p\ZZ_p$ is open in $\AA$ but not in the full product.
::::

The rationals are discrete in $\AA$, and they fill it up to a compact piece. This is the adelic form of the familiar facts that $\ZZ$ is discrete in $\RR$ with quotient a circle.

:::: theorem {#t-ad-fundamental-domain title="Every adele is a rational number plus a unique element of $[0,1)$ times the profinite integers"}
$\QQ$ is a discrete subgroup of $\AA$, and every $x\in\AA$ can be written uniquely as $x=\xi+y$ with $\xi\in\QQ$ and $y\in[0,1)\times\hat\ZZ$. Hence $\AA/\QQ$ is compact, and $[0,1)\times\hat\ZZ$ is a fundamental domain for it [@masullo, Example A.2.1.3, p. 545].
::::

::: proof
*Existence.* Only finitely many components $x_p$ lie outside $\ZZ_p$. Let $r=\sum_p\{x_p\}_p$, a finite sum of rationals. For each prime $p$, $x_p-\{x_p\}_p\in\ZZ_p$, and each other term $\{x_\ell\}_\ell$ with $\ell\ne p$ has only powers of $\ell$ in its denominator, so lies in $\ZZ_p$. Hence $x_p-r\in\ZZ_p$ for every $p$. Now subtract the integer $n=\lfloor x_\infty-r\rfloor$, which lies in every $\ZZ_p$. With $\xi=r+n$, the adele $y=x-\xi$ has $y_\infty\in[0,1)$ and $y_p\in\ZZ_p$ for all $p$.

*Uniqueness and discreteness.* If $\xi+y=\xi'+y'$, then $\xi-\xi'\in\QQ$ lies in every $\ZZ_p$, so it is an integer by [[l-ad-integers]], and it lies in $(-1,1)$, so it is $0$. The same argument shows that the open set $(-1,1)\times\hat\ZZ$ meets $\QQ$ only in $0$, which is discreteness.
:::

Try it on $x=(\tfrac{8}{3},\ \tfrac{1}{4},\ \tfrac{1}{3},\ 0,0,\dots)$, with components at $\infty$, $2$, $3$, and $0$ elsewhere. Here $\{x_2\}_2=\tfrac14$ and $\{x_3\}_3=\tfrac13$, so $r=\tfrac7{12}$, and $x_\infty-r=\tfrac{8}{3}-\tfrac{7}{12}=\tfrac{25}{12}$, so $n=2$ and $\xi=\tfrac{31}{12}$. Then $y_\infty=\tfrac1{12}$, $y_2=\tfrac14-\tfrac{31}{12}=-\tfrac73\in\ZZ_2$, and $y_3=\tfrac13-\tfrac{31}{12}=-\tfrac94\in\ZZ_3$, as promised.

The additive Haar measure on $\AA$ is the product $\dd x=\dd x_\infty\prod_p\dd x_p$ of the measures above. It gives the fundamental domain $[0,1)\times\hat\ZZ$ the volume $1\cdot\prod_p1=1$, so
$$
\operatorname{vol}(\AA/\QQ)=1.
$$ {#eq-ad-volume}
The source fixes its measures by exactly this condition, which removes all volume factors from the formulas of the next chapter [@masullo, Remark 2.2.3.3, p. 82].

The characters at each place multiply to a character of $\AA$, $\mathbf e(x)=\mathbf e_\infty(x_\infty)\prod_p\mathbf e_p(x_p)$, a finite product because $\mathbf e_p=1$ on $\ZZ_p$.

:::: lemma {#l-ad-character-trivial title="The standard character of the adeles is equal to $1$ on the rational numbers"}
For every $\xi\in\QQ$, $\mathbf e(\xi)=1$.
::::

::: proof
Let $r=\sum_p\{\xi\}_p$. As in the proof of [[t-ad-fundamental-domain]], $\xi-r$ lies in every $\ZZ_p$, so it is an integer. Then $\mathbf e(\xi)=e^{-2\pi i\xi}\prod_pe^{2\pi i\{\xi\}_p}=e^{2\pi i(r-\xi)}=1$.
:::

Test it on $\xi=\tfrac7{12}$. The partial fraction decomposition $\tfrac7{12}=\tfrac14+\tfrac13$ gives $\{\xi\}_2=\tfrac14$ and $\{\xi\}_3=\tfrac13$, and $\mathbf e(\xi)=e^{-2\pi i\cdot7/12}e^{2\pi i/4}e^{2\pi i/3}=1$. The lemma is partial fractions: every rational number is an integer plus a sum of fractions with prime-power denominators, one per prime.

### The functions Part III uses

:::: definition {#d-ad-schwartz-bruhat title="Schwartz-Bruhat functions on the adeles"}
A *Schwartz-Bruhat function* on $\AA$ is a finite linear combination of products
$$
f(x)=f_\infty(x_\infty)\prod_pf_p(x_p),
$$
written $f=f_\infty\otimes\bigotimes_pf_p$, where $f_\infty$ is a Schwartz function on $\RR$, each $f_p$ is a Schwartz-Bruhat function on $\QQ_p$, and $f_p=\mathbf 1_{\ZZ_p}$ for all but finitely many $p$, so that the product is finite at every adele. These are the adelic test functions. A Schwartz-Bruhat function is not a function on $\QQ$, although it can be restricted to $\QQ$, and that restriction is how it enters the sums of the next chapter.
::::

Over $\QQ$ with the trivial character, only one kind of product will be needed:
$$
f=g\otimes\bigotimes_p\mathbf 1_{\ZZ_p},\qquad f(x)=g(x_\infty)\,\mathbf 1_{\hat\ZZ}\bigl((x_p)_p\bigr),
$$ {#eq-ad-standard-f}
with $g$ an even Schwartz function on $\RR$. By [[l-ad-integers]], its restriction to the rationals is
$$
f(\xi)=\begin{cases}g(\xi),&\xi\in\ZZ,\\0,&\xi\in\QQ\setminus\ZZ.\end{cases}
$$ {#eq-ad-filter}
The indicators at the primes act as a filter: each $\mathbf 1_{\ZZ_p}$ removes the rationals with $p$ in the denominator, and all of them together leave exactly the integers. Changing one factor to $\mathbf 1_{\ZZ_p^\times}$ also removes the integers divisible by $p$. By [[t-ad-zp-selfdual]] the Fourier transform of [[eq-ad-standard-f]] is $\hat f=\hat g\otimes\bigotimes_p\mathbf 1_{\ZZ_p}$, another function of the same kind.

:::: figure {#f-ad-filter viz="adelic-filter" height="400"}
Restricted to the rationals, the indicator of $\ZZ_p$ removes every fraction with $p$ in its denominator, and the indicators at all primes together leave exactly the integers.

```vizspec
Purpose: show that g tensor (product of indicators of Z_p), evaluated on rational numbers, is g on the integers and 0 elsewhere; this is why sums over Q of adelic functions become sums over Z.
Scene: the real axis x in [-4, 4]. A blue curve g(x) = exp(-pi x^2 / 4) (a wide Gaussian). Every rational number with denominator <= 12 in [-4, 4] is drawn as a thin vertical stick from 0 up to g(x), colored gold. Integers get thicker sticks.
Controls: a row of toggle chips labeled 2, 3, 5, 7, 11 and one chip "all primes". When the chip p is on, every stick whose denominator (in lowest terms) is divisible by p fades to muted and drops to height 0. "All primes" turns every chip on, which leaves only the integer sticks. A second row "delete multiples of p" with chips 2, 3, 5 (enabled only when "all primes" is on): turning on chip p also removes the integer sticks at multiples of p and colors them red as they drop, previewing the next chapter.
Readout: the sum of the heights of the remaining sticks, labeled "sum over the remaining rationals", and, when "all primes" is on, the comparison value "sum over n in Z of g(n) = ..." which matches.
Motion: sticks drop over 300 ms when a chip turns on and rise back when it turns off.
Reader takeaway: the product of the indicators of Z_p is the indicator of the integers inside Q, and swapping one indicator for the units removes the multiples of p.
Data: none.
```
::::

### Poisson summation on $\AA/\QQ$

The last fact this chapter hands on is Poisson summation, now with $\QQ$ in place of $\ZZ$ and $\AA$ in place of $\RR$. It holds for the same reason: $\QQ$ is discrete in $\AA$, the quotient is compact with volume 1 by [[eq-ad-volume]], and the characters of $\AA$ that are trivial on $\QQ$ are exactly $x\mapsto\mathbf e(\xi x)$ with $\xi\in\QQ$, so $\QQ$ is its own dual lattice.

::::: card {#t-ad-poisson kind="theorem" title="The sum of a Schwartz-Bruhat function over the rationals equals the sum of its Fourier transform over the rationals" source="tate1967"}
:::: statement
Let $f$ be a Schwartz-Bruhat function on $\AA$ and $\hat f(y)=\int_\AA f(x)\mathbf e(xy)\,\dd x$ its Fourier transform. Then
$$
\sum_{\xi\in\QQ}f(\xi)=\sum_{\xi\in\QQ}\hat f(\xi).
$$ {#eq-ad-poisson}
Applied to $x\mapsto f(ax)$ for an idele $a$ (defined in the next section), it gives $\sum_{\xi\in\QQ}f(\xi a)=\abs a^{-1}\sum_{\xi\in\QQ}\hat f(\xi a^{-1})$.
::::
:::: plain
Adding up an adelic function over all fractions gives the same total as adding up its Fourier transform over all fractions. For the functions of this page, both sums reduce to sums over the ordinary integers, and the statement becomes the Poisson summation of [[complex-toolkit]].
::::
:::: why
Riemann's functional equation came from Poisson summation for the integers inside the reals. Tate's version of that proof, which the next chapter follows, uses Poisson summation for the rationals inside the adeles, and its scaled form is the "adelic Riemann-Roch theorem" [@masullo, Theorem 2.2.3.2, p. 82]. Without it there is no symmetry $t\mapsto1/t$ for the theta sums of Part III, and so no control of their decay at $0$.
::::
:::: idea
Periodize $f$ over $\QQ$ to get a function on the compact group $\AA/\QQ$, expand it in the characters of that group, which are the $\mathbf e(\xi\,\cdot)$ with $\xi\in\QQ$, and evaluate at $0$. The coefficients are the values $\hat f(\xi)$, exactly as on the circle $\RR/\ZZ$.
::::
:::: sketch {source="tate1967" loc="Chapter XV, §4.2"}
The three inputs are the discreteness and cocompactness of $\QQ$ ([[t-ad-fundamental-domain]]), $\operatorname{vol}(\AA/\QQ)=1$, and the identification of the characters of $\AA$ trivial on $\QQ$ with $\QQ$ itself through $\mathbf e$. With these, the proof is the one on the circle, with Fourier series on $\AA/\QQ$. For the function $f=g\otimes\bigotimes_p\mathbf 1_{\ZZ_p}$ one can check the statement by hand: by [[eq-ad-filter]] the left side is $\sum_{n\in\ZZ}g(n)$, and since $\hat f=\hat g\otimes\bigotimes_p\mathbf 1_{\ZZ_p}$ the right side is $\sum_{n\in\ZZ}\hat g(n)$. These agree by Poisson summation on $\RR$.
::::
:::: example
Take $g(x)=e^{-\pi x^2}$, which equals its own transform. Both sides of [[eq-ad-poisson]] are $\sum_ne^{-\pi n^2}=1.0864348$. Scale by the idele $a$ with $a_\infty=2$ and $a_p=1$ for all $p$, which has $\abs a=2$: the left side is $\sum_ne^{-4\pi n^2}=1.0000070$, and the right side is $\tfrac12\sum_ne^{-\pi n^2/4}=\tfrac12\cdot2.0000139=1.0000070$. This is the theta symmetry of [[zeta-continued]] at $t=4$.
::::
:::: used
- The adelic Riemann-Roch identity for theta sums and their decay: [[tate-theta]].
- The $S$-local Fourier transform in Connes's computation of the local terms: [[trace-formula]].
::::
:::::

## Ideles and the idele class group {#s-ad-ideles}

The sums of Part III are not over additive translates $\xi+x$ but over multiplicative ones $\xi x$, and the Mellin transform is an integral over a multiplicative group. So we need the invertible adeles.

:::: definition {#d-ad-ideles title="the ideles of $\QQ$ and their norm"}
The *idele group* $\AA^\times$ is the group of invertible adeles: tuples $x=(x_v)_v$ with every $x_v\ne0$ and $x_p\in\ZZ_p^\times$ for all but finitely many $p$. It carries the restricted product topology of the pairs $(\QQ_p^\times,\ZZ_p^\times)$, in which $\RR_{>0}\times\hat\ZZ^\times$, with $\hat\ZZ^\times=\prod_p\ZZ_p^\times$, is an open subgroup. The *norm* of an idele is
$$
\abs x=\abs{x_\infty}_\infty\prod_p\abs{x_p}_p,
$$ {#eq-ad-norm}
a finite product, and $\abs\cdot:\AA^\times\to\RR_{>0}$ is a continuous homomorphism. The rationals $\QQ^\times$ sit in $\AA^\times$ diagonally, and by the product formula [[t-ad-product-formula]] every one of them has norm $1$. The ideles are a group under multiplication, not a ring.
::::

::: warning
**The idele topology is not the topology that $\AA^\times$ inherits from $\AA$.** Let $p_k$ be the $k$-th prime and let $x^{(k)}$ be the idele with component $p_k$ at $p_k$ and $1$ at every other place. In $\AA$ the sequence converges to $1$, because $x^{(k)}-1$ is $0$ except at $p_k$, where it is $p_k-1\in\ZZ_{p_k}$, and so it lies in every basic neighborhood of $0$ once $p_k$ is outside the finite set $S$. But the inverses have component $1/p_k\notin\ZZ_{p_k}$, so they do not converge to $1$ in $\AA$. In the subspace topology inversion would not be continuous. The restricted product topology of the pairs $(\QQ_p^\times,\ZZ_p^\times)$ repairs this, and in it $x^{(k)}$ does not converge at all [@masullo, Definition A.1.3.1, p. 541].
:::

Since every rational has norm $1$, the norm passes to the quotient by $\QQ^\times$. Over $\QQ$ this quotient has a very simple shape.

:::: definition {#d-ad-class-group title="the idele class group"}
The *idele class group* of $\QQ$ is the quotient $C_\QQ=\AA^\times/\QQ^\times$, a locally compact abelian group. The norm defines a continuous surjective homomorphism $\abs\cdot:C_\QQ\to\RR_{>0}$, whose kernel $C_\QQ^1$ is compact. $C_\QQ$ is a group of classes of ideles, not a group of numbers, and it is not a subgroup of $\AA^\times$.
::::

::::: card {#t-ad-class-group kind="theorem" title="The idele class group of $\QQ$ is the positive reals times the units of the profinite integers, and the norm is the projection to the positive reals" source="masullo"}
:::: statement
Every idele $x$ can be written uniquely as $x=\xi\cdot(t,u)$ with $\xi\in\QQ^\times$, $t\in\RR_{>0}$ at the real place, and $u\in\hat\ZZ^\times$ at the finite places. Hence
$$
C_\QQ\cong\RR_{>0}\times\hat\ZZ^\times,\qquad\abs{x}=t,\qquad C_\QQ^1\cong\hat\ZZ^\times.
$$ {#eq-ad-class-group}
::::
:::: plain
Any idele can be moved, by multiplying with one well-chosen fraction, to a positive real number at infinity and a unit at every prime. That fraction is unique, so an idele class is just a positive real number and a compatible list of units. The positive real number is the norm.
::::
:::: why
This is the identification that lets every chapter of Part III work on $\RR_{>0}$ with $\dd t/t$. A function on $C_\QQ$ that does not depend on the unit part $u$ is a function of the single variable $t=\abs x$, and the Mellin transform on $\RR_{>0}$ is the Fourier analysis of $C_\QQ$ in that variable.
::::
:::: idea
The rational $\xi$ is read off from the idele: its sign is the sign of $x_\infty$, and its power of $p$ is the valuation of $x_p$. Dividing by it removes all the valuations at once. Uniqueness is [[l-ad-integers]] again: a rational number that is a unit at every prime and positive is $1$.
::::
:::: sketch {source="masullo" loc="(A.2.2.1) to (A.2.2.3), p. 546"}
*Existence.* Put $\xi=\operatorname{sgn}(x_\infty)\prod_pp^{v_p(x_p)}$, a finite product since $v_p(x_p)=0$ for almost all $p$. Then $\xi^{-1}x$ has a positive real component, and at each $p$ its component $\xi^{-1}x_p$ has valuation $v_p(x_p)-v_p(\xi)=0$, so it is a unit. *Uniqueness.* If $\xi(t,u)=\xi'(t',u')$, then $\xi/\xi'$ is a rational number that is a unit at every $p$, so it is $\pm1$ by [[l-ad-integers]], and positive at the real place, so it is $1$. *Norm.* $\abs{\xi(t,u)}=\abs\xi\cdot t\cdot\prod_p\abs{u_p}_p=1\cdot t\cdot1=t$ by the product formula. *Topology.* The map $(t,u)\mapsto$ class of $(t,u)$ is a continuous bijective homomorphism from $\RR_{>0}\times\hat\ZZ^\times$ onto $C_\QQ$, and it is open because $\RR_{>0}\times\hat\ZZ^\times$ is open in $\AA^\times$ and meets each class once.
::::
:::: example
Take the idele with $x_\infty=-3.5$, $x_2=12$, $x_3=\tfrac59$, $x_5=\tfrac15$, and $x_p=1$ for $p\ge7$. The recipe gives $\xi=-2^{2}\cdot3^{-2}\cdot5^{-1}=-\tfrac4{45}$. Dividing, the real component becomes $t=3.5\cdot\tfrac{45}4=\tfrac{315}8=39.375$, and the finite components become $-135$ at $2$, $-\tfrac{25}4$ at $3$, $-\tfrac94$ at $5$, and $-\tfrac{45}4$ at every $p\ge7$, each a unit at its prime. The norm computed directly is $\abs x=3.5\cdot\tfrac14\cdot9\cdot5=39.375=t$.
::::
:::: used
- Every function of Part III with trivial character is a function of $t=\abs x\in\RR_{>0}$: [[tate-theta]] onward.
- The idelic lift of the kernel and its stratification by "unit at the first $k$ primes" live on $\AA^\times$, not on $C_\QQ$: [[cutting-the-kernel]].
::::
:::::

:::: figure {#f-ad-idele-class viz="idele-class" height="420"}
Each idele class has exactly one representative with a positive real component and a unit at every prime, so the class group is a line of positive reals with a compact fiber of units over each point.

```vizspec
Purpose: show C_Q = R_{>0} x Zhat^x as a horizontal line with a compact fiber, and show the reduction of an arbitrary idele to its representative.
Scene: left panel, an idele drawn as a column of components: x_infinity at the top (a point on a small real line), then x_2, x_3, x_5, x_7, each drawn as a point in a small "shells" diagram for Q_p^x: concentric rings labeled by the valuation m from -3 to 3, the unit ring m = 0 highlighted in light blue. Right panel, C_Q drawn as a horizontal axis log t in [-5, 5] (muted) with, above each point, a vertical fiber representing Zhat^x as a stack of p-adic unit "digit bars" (a Cantor-like column; purely schematic, muted). The representative (t, u) appears as a gold dot on the axis at log t with a gold mark in its fiber.
Controls: in the left panel, the reader drags x_infinity along its line (range -50 to 50, nonzero) and clicks rings to choose the valuation of x_p for p in {2, 3, 5, 7} (default: x_inf = -3.5, valuations 2, -2, -1, 0, matching the example in the chapter). A button "divide by xi" computes xi = sgn(x_inf) * prod p^{v_p}, prints it as a fraction, and animates every p-adic component sliding onto its unit ring and x_infinity moving to |x_inf| / |xi| > 0; then the gold dot appears at log t on the right.
Readout: xi as a fraction, t as a decimal, and the norm |x| computed as a product of local sizes, always equal to t.
Reader takeaway: one rational number moves every component to a unit and the real component to a positive number; the norm of the class is the position on the line, and the fiber is compact.
Data: none.
```
::::

### Characters of the class group

A character of $C_\QQ$ is a continuous homomorphism to the unit circle. On $\RR_{>0}$ these are $t\mapsto t^{i\tau}$ with $\tau\in\RR$, the waves of the Mellin transform. On $\hat\ZZ^\times$ a continuous character has an open kernel, because a small enough neighborhood of $1$ in the circle contains no subgroup but $\{1\}$, and an open subgroup of $\hat\ZZ^\times$ contains all units congruent to $1$ modulo some integer $q$. So the character factors through $\hat\ZZ^\times\to(\ZZ/q\ZZ)^\times$, and it is a Dirichlet character modulo $q$ in the sense of [[what-rh-says]]. Every character of $C_\QQ$ is therefore $(t,u)\mapsto t^{i\tau}\chi(u)$ with $\chi$ a Dirichlet character. This is how the Dirichlet $L$-functions enter the adelic picture.

For the Riemann zeta function, $\chi$ is trivial. A function on $C_\QQ$ that is invariant under $\hat\ZZ^\times$ is a function of $t$ alone, and the Haar measure of $C_\QQ$, the product of $\dd t/t$ with the probability measure on $\hat\ZZ^\times$, becomes $\dd t/t$. This is the sense in which the source's statements on $C_F$, specialized to $F=\QQ$ and the trivial character, become statements on $\RR_{>0}$ [@masullo, p. 127].

## What changes in general {#s-ad-general}

For a number field $F$ the construction is the same with more places. The places of $F$ are the prime ideals $\mathfrak p$ of its ring of integers $\mathcal O_F$ and the real and complex embeddings of $F$. Each finite place $v$ has a completion $F_v$, a finite extension of some $\QQ_p$, with its ring of integers $\mathcal O_{F_v}$, a uniformizer $\pi_v$ that plays the role of $p$, and a residue field of size $q_v=N\mathfrak p$. The normalized absolute values satisfy the product formula, the adeles $\AA_F$ are the restricted product of the $(F_v,\mathcal O_{F_v})$, and the ideles are the restricted product of the $(F_v^\times,\mathcal O_{F_v}^\times)$ [@masullo, p. 7 and Appendix A.1].

Two things become harder. First, the class group $C_F=\AA_F^\times/F^\times$ still maps onto $\RR_{>0}$ with compact kernel $C_F^1$, but $C_F^1$ is no longer just a product of local units: it remembers the units of $\mathcal O_F$ and the ideal class group of $F$. A function on $C_F$ splits into isotypes, one for each character of $C_F^1$, and each isotype is again a space of functions of one positive real variable. Second, the characters of $C_F$ are the Hecke characters of [[what-rh-says]], so the trivial isotype gives the Dedekind zeta function of $F$, and the others give Hecke L-functions. Masullo's theorem covers all of them [@masullo, p. 6], and the chapters of Part III each end by naming what this costs.

::: recap
You now have the following, and where each is used.

- The $p$-adic absolute value, the places $\infty,2,3,5,\dots$ of $\QQ$, and the product formula $\abs x_\infty\prod_p\abs x_p=1$ ([[t-ad-product-formula]]): used for the norm of ideles and in the next chapter's symmetry.
- $\QQ_p$, $\ZZ_p$, $\ZZ_p^\times$, the shells $p^m\ZZ_p^\times$, and the fact that a rational number is an integer exactly when it is in every $\ZZ_p$ ([[l-ad-integers]]): the filter that turns sums over $\QQ$ into sums over $\ZZ$.
- Haar measure on $\QQ_p$ and $\QQ_p^\times$, and the local integrals $\int\mathbf 1_{\ZZ_p}\abs x_p^s\,\dd^\times x=(1-p^{-s})^{-1}$ and $\int\mathbf 1_{\ZZ_p^\times}\abs x_p^s\,\dd^\times x=1$ ([[t-ad-local-zeta]]): the reason that removing a prime multiplies by $1-p^{-s}$ in [[tate-theta]] and [[primes-as-circles]].
- The characters $\mathbf e_v$, the Fourier transform, and $\widehat{\mathbf 1_{\ZZ_p}}=\mathbf 1_{\ZZ_p}$ ([[t-ad-zp-selfdual]]).
- The adeles, the fundamental domain $[0,1)\times\hat\ZZ$, $\operatorname{vol}(\AA/\QQ)=1$, and the functions $g\otimes\bigotimes_p\mathbf 1_{\ZZ_p}$ ([[d-ad-schwartz-bruhat]]).
- Poisson summation on $\AA/\QQ$ ([[t-ad-poisson]]): the adelic Riemann-Roch identity of [[tate-theta]].
- The ideles, their norm, and $C_\QQ\cong\RR_{>0}\times\hat\ZZ^\times$ with $\abs x=t$ ([[t-ad-class-group]]): why every object of Part III is a function on $\RR_{>0}$ with $\dd t/t$, and where the lift to the ideles of [[cutting-the-kernel]] takes place.
:::
