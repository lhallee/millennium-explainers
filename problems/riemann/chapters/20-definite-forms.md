---
id: definite-forms
title: "Forms you can hold: definite unitary groups and theta lifts as matrices"
part: 4
summary: Compute with automorphic forms on a totally definite unitary group as lists of numbers indexed by lattice classes, with Hecke operators and theta lifts as explicit matrices, and read the formal proof's chain of lifts as a product of such matrices whose denominators stay under control.
needs: [route-a-plan, landau-endgame]
---

::: plain
On most groups that matter in number theory, an automorphic form is an analytic function on an infinite space, and nobody can write one down in full. On a unitary group whose form is positive under every complex embedding, an automorphic form is a finite list of numbers, one for each shape of lattice in a fixed family. The operators that act on these lists are integer matrices that count how lattices meet, and passing a form to a larger group, a theta lift, is one more such matrix. The formal proof's chain of about $\sqrt x$ theta lifts is then a product of matrices, and this chapter computes the smallest cases completely.
:::

Chapter [[landau-endgame]] ended with the input that the rest of Part IV must supply, a one-sided bound on a combination of smoothed prime sums on windows of scales. The proof gets it by what the note calls a descendant of Stepanov's argument, whose auxiliary object is an automorphic form on a totally definite unitary group carried through a chain of theta lifts [@alpoge-note]. This chapter builds those objects from linear algebra and one imaginary quadratic field, computes them in genera small enough for a table, and states the code's definitions of the chain exactly.

## The question Stepanov leaves {#df-question}

In [[stepanov]] the auxiliary function lived in a finite-dimensional space of functions on a curve with poles bounded at one point, its coefficients were the unknowns of a linear system, Frobenius forced its order of vanishing at every rational point up to $p^\mu$ for free, and the count of Riemann and Roch capped how much vanishing a nonzero function could afford. The note says that over the integers this multiplicity corresponds to "something like differentiating whole numbers", and it replaces the derivative by a chain of theta lifts, "each mimicking multiplicity" [@alpoge-note].

In our reading of the roles, which the next two chapters refine, the functions with bounded poles become automorphic forms on the unitary group of a totally definite Hermitian space, a finite-dimensional space because such a form is a function on a finite set. The coefficients become the values of the form, whose integrality replaces coefficients in $\FF_q$. One more order of vanishing becomes one more theta lift, to a space of larger rank, and the degree budget becomes the bookkeeping of sizes and denominators in [[multiplicity-from-lifts]] and [[integrality-and-galois]].

## Two model rings {#df-rings}

The coefficients of everything in this part come from a field with a built-in complex conjugation.

::: definition {#d-df-cm title="CM field"}
A CM field is a number field $E$ that is a totally imaginary quadratic extension of a totally real number field $E^+$. Totally real means that every embedding $E^+ \to \CC$ lands in $\RR$, and totally imaginary means that no embedding $E \to \CC$ does. The nontrivial automorphism of $E$ over $E^+$, written $a \mapsto \bar a$, then agrees with complex conjugation under every embedding of $E$, so $a\bar a$ is a totally positive element of $E^+$ for every $a \ne 0$. An arbitrary automorphism of order two is not enough, because it must be complex conjugation under every complex embedding at once.
:::

The smallest CM fields have $E^+ = \QQ$ and $E$ imaginary quadratic, and we use two of them. The first is $E = \QQ(i)$ with ring of integers $\ZZ[i]$, norm $N(a+bi) = a^2 + b^2$, and units $\pm 1, \pm i$. Every ideal of $\ZZ[i]$ is principal, so this ring is the place to check a definition when no arithmetic should get in the way.

The second is $E = \QQ(\sqrt{-23})$, whose ring of integers is $\mathcal O_E = \ZZ[\omega]$ with
$$
\omega = \frac{1 + \sqrt{-23}}{2}, \qquad \omega^2 = \omega - 6, \qquad N(a + b\omega) = a^2 + ab + 6b^2 .
$$
Its only units are $\pm 1$. The prime $2$ splits as $2\mathcal O_E = \mathfrak p\bar{\mathfrak p}$ with $\mathfrak p = (2, \omega)$ and $\bar{\mathfrak p} = (2, \bar\omega) = (2, 1 - \omega)$. As sets, $\mathfrak p = \{a + b\omega : a \text{ even}\}$ and $\bar{\mathfrak p} = \{a + b\omega : a + b \text{ even}\}$. The ideal $\mathfrak p$ is not principal, because $4N(a + b\omega) = (2a + b)^2 + 23b^2$ cannot equal $8$. Its cube is principal, because $1 + \omega$ has norm $8$, lies in $\bar{\mathfrak p}$ and not in $\mathfrak p$, and so generates $\bar{\mathfrak p}^3$. The class group is therefore cyclic of order $3$, with classes $[\mathcal O_E]$, $[\mathfrak p]$, and $[\bar{\mathfrak p}] = [\mathfrak p]^{-1}$, which is the classical statement that the class number of discriminant $-23$ is $3$ [@cox1989]. This ring is the model for everything below.

::: lean {decl="Formalism.BasicNotions.CMData" file="Formalism/LocalRingCardinality/DataSpaces.lean"}
The code's CM data ask for $F$ totally real, $[E:F] = 2$, conjugation with fixed field $F$, and `IsCMUnram E`, which makes $E$ unramified over $F$ at every finite prime. No imaginary quadratic field qualifies, since $\QQ(i)$ ramifies at $2$ and $\QQ(\sqrt{-23})$ at $23$, so our two fields are teaching models, not fields the proof uses.
:::

## Hermitian forms, definite and indefinite {#df-hermitian}

A Hermitian form is an inner product over a CM field, and this chapter turns on whether it is positive everywhere.

::: definition {#d-df-hermitian title="Hermitian form and its matrix"}
Let $X$ be a vector space of dimension $n$ over a CM field $E$. A Hermitian form on $X$ is a map $h\colon X \times X \to E$ that is linear in the second variable and satisfies $h(y, x) = \overline{h(x, y)}$. It is therefore conjugate-linear in the first variable, $h(ax, y) = \bar a\, h(x, y)$, so it is not a bilinear form over $E$. In a basis $e_1, \dots, e_n$ its matrix $J = (h(e_i, e_j))$ satisfies $\bar J^{\mathsf T} = J$, and $h(x, y) = \bar x^{\mathsf T} J y$. The value $h(x, x)$ equals its own conjugate, so it lies in $E^+$. The form is nondegenerate when $\det J \ne 0$, and the pair $(X, h)$ is a Hermitian space.
:::

Under an embedding $\iota\colon E \to \CC$ the matrix $\iota(J)$ is a complex Hermitian matrix, with real eigenvalues, and by Sylvester's law of inertia the numbers $(r, s)$ of positive and negative eigenvalues do not depend on the basis. The pair $(r, s)$ is the signature of $X$ at $\iota$.

::: definition {#d-df-definite title="Totally definite Hermitian space"}
A Hermitian space of dimension $n$ is totally definite when its signature is $(n, 0)$ or $(0, n)$ at every embedding of $E$, and totally positive definite when it is $(n, 0)$ at every embedding. Otherwise it is indefinite at some embedding. For $E$ imaginary quadratic there is only one embedding up to conjugation, and definite means that $h(x, x) > 0$ for all $x \ne 0$, or $h(x, x) < 0$ for all $x \ne 0$.
:::

Over $\ZZ[i]$, the form with matrix $\operatorname{diag}(1, 1)$ has $h(x, x) = \abs{x_1}^2 + \abs{x_2}^2$ and is positive definite, while $\operatorname{diag}(1, -1)$ has $h((1,1),(1,1)) = 0$ and signature $(1,1)$. When $E^+ = \QQ(\sqrt 2)$, the form $\operatorname{diag}(1, \sqrt 2)$ is definite under one embedding and indefinite under the other, which is why the definition asks for every embedding.

The unitary group of the space is the group of linear maps that keep the form,
$$
U(X) = \{g \in \GL(X) : h(gx, gy) = h(x, y) \text{ for all } x, y\} = \{g : \bar g^{\mathsf T} J g = J\}.
$$
At an embedding of signature $(n, 0)$ the real points of $U(X)$ form the compact group $U(n)$. At signature $(1,1)$ they do not, and the difference shows up in the integer points. The matrix
$$
g = \begin{pmatrix} 1+i & 1 \\ 1 & 1-i \end{pmatrix}
$$
has entries in $\ZZ[i]$, satisfies $\bar g^{\mathsf T} \operatorname{diag}(1,-1)\, g = \operatorname{diag}(1,-1)$, and has $(g - I)^2 = 0$, so $g^k = I + k(g - I)$ and its powers are all distinct, an infinite group of integer points. For a totally definite space the integer points form a discrete subgroup of a product of compact groups, hence a finite group, and that one fact makes every object in this chapter finite.

::: lean {decl="Formalism.BasicNotions.HSpace.IsDefinite" file="Formalism/LocalRingCardinality/DataSpaces.lean"}
An `HSpace E` carries a form `hT : V →ₗ⋆[E] V →ₗ[E] E`, conjugate-linear in the first argument as above, with `herm : hT.IsSymm`, a signature `sig τ` at each embedding `τ`, and a unimodular lattice `L0`, and `IsDefinite` asks that `sig τ` be `(rank, 0)` or `(0, rank)` for every `τ`.
:::

## Lattices, classes, and genera {#df-lattices}

Lattices are to a Hermitian space what $\ZZ^n$ is to $\RR^n$, and the arithmetic lives in how many different ones there are.

::: definition {#d-df-lattice title="Hermitian lattice, dual, unimodular"}
A Hermitian lattice in $X$ is a finitely generated $\mathcal O_E$-submodule $L \subset X$ that spans $X$ over $E$, considered together with $h$. It need not be free over $\mathcal O_E$. Its dual is $L^\# = \{y \in X : h(y, x) \in \mathcal O_E \text{ for all } x \in L\}$. The lattice is integral when $L \subset L^\#$ and unimodular when $L = L^\#$.
:::

The rank-one lattices over $\mathcal O_E$ already show everything. For a nonzero ideal $\mathfrak a$, give $X = E$ the form $h_{\mathfrak a}(x, y) = \bar x y / N(\mathfrak a)$ and take $L = \mathfrak a$. Because $\mathfrak a \bar{\mathfrak a} = N(\mathfrak a)\mathcal O_E$, the dual of $\mathfrak a$ is $N(\mathfrak a)\bar{\mathfrak a}^{-1} = \mathfrak a$, so $(\mathfrak a, h_{\mathfrak a})$ is unimodular. We write it simply as $\mathfrak a$.

::: definition {#d-df-class-genus title="Isometry, class, and genus"}
Two lattices $L, M$ in $X$ are isometric when $gL = M$ for some $g \in U(X)$, and the isometry class of $L$ is the set of lattices isometric to it. They are in the same genus when, for every prime $\mathfrak q$ of $\mathcal O_E$, the completions $L_{\mathfrak q}$ and $M_{\mathfrak q}$ are carried onto each other by an element of the unitary group of $X_{\mathfrak q}$. A genus of lattices is a union of isometry classes. The automorphism group of $L$ is $\operatorname{Aut}(L) = \{g \in U(X) : gL = L\}$.
:::

The classical model is the theory of binary quadratic forms. A positive definite form $ax^2 + bxy + cy^2$ of discriminant $b^2 - 4ac = -23$ is equivalent under $\mathrm{SL}_2(\ZZ)$ to exactly one reduced form with $\abs b \le a \le c$, and the reduced forms are $x^2 + xy + 6y^2$, $2x^2 + xy + 3y^2$, and $2x^2 - xy + 3y^2$ [@cox1989]. The dictionary with ideals sends $\mathfrak a$ with $\ZZ$-basis $\alpha, \beta$ to the form $N(x\alpha + y\beta)/N(\mathfrak a)$, which is $h_{\mathfrak a}(v, v)$ for $v = x\alpha + y\beta$. In our ring, $\mathcal O_E = \ZZ + \ZZ\omega$ gives $x^2 + xy + 6y^2$, $\mathfrak p = 2\ZZ + \omega\ZZ$ gives $2x^2 + xy + 3y^2$, and $\bar{\mathfrak p} = 2\ZZ + (\omega - 1)\ZZ$ gives $2x^2 - xy + 3y^2$.

As Hermitian lattices, the three are pairwise non-isometric. An isometry of the line $E$ is multiplication by some $u$ with $u\bar u = 1$, and it carries $\mathfrak a$ onto $\mathfrak b$ only if $u\mathfrak a = \mathfrak b$, so the classes are the three ideal classes. All three lie in one genus, which for the binary forms is Gauss's statement that a discriminant with a single prime factor has a single genus [@cox1989]. The automorphism group of each is $\{u \in \mathcal O_E^\times\} = \{\pm 1\}$, of order $2$.

::: warning
Counted as quadratic forms up to $\mathrm{GL}_2(\ZZ)$ there are only two classes, because $(x, y) \mapsto (x, -y)$ carries $2x^2 + xy + 3y^2$ to $2x^2 - xy + 3y^2$. That substitution is complex conjugation on $E$, which is not $E$-linear, so it is not an isometry of Hermitian lattices. For Hermitian lattices the count is three, and the unitary group, not the orthogonal group of the trace form, decides it.
:::

::::: card {#t-df-finite kind="theorem" title="In a totally definite space every lattice has a finite automorphism group and its genus contains finitely many classes" source="borel-harishchandra1962"}
:::: statement
Let $X$ be a totally definite Hermitian space over a CM field $E$ and $L \subset X$ a lattice. Then $\operatorname{Aut}(L)$ is finite, and the genus of $L$ is the union of finitely many isometry classes.
::::
:::: plain
A definite form leaves only finitely many lattice vectors of bounded length, and a symmetry must permute them. The same short vectors give every lattice in the genus a basis with bounded integer inner products, and there are finitely many such tables.
::::
:::: why
Without it a form would be a function on an infinite set and nothing in this chapter would be a matrix. For an indefinite space the automorphism group is infinite, as the matrix $g$ of [[df-hermitian]] shows.
::::
:::: idea
Viewed over $\ZZ$, $L$ has rank $n[E:\QQ]$ and carries the quadratic form $\Tr_{E/\QQ} h(x, x)$, positive definite when $X$ is totally positive definite, and everything is then a statement about short vectors.
::::
:::: sketch {source="borel-harishchandra1962"}
An automorphism is determined by the images of a basis, which lie in the finite set of lattice vectors no longer than the basis vectors. For the classes, reduction theory in the style of Hermite and Minkowski gives every lattice a basis of vectors bounded in terms of its covolume, which is constant on a genus, so its Gram matrix has bounded integer entries. Borel and Harish-Chandra proved the general finiteness of such double cosets for arithmetic groups.
::::
:::: example
Over $\mathcal O_E$ with $E = \QQ(\sqrt{-23})$, the rank-one genus of $\mathcal O_E$ has three classes, each with automorphism group $\{\pm1\}$. Over $\ZZ[i]$, the rank-one genus of $\ZZ[i]$ has one class, with automorphism group $\{\pm 1, \pm i\}$ of order $4$, because every ideal is principal.
::::
:::: lean {decl="Formalism.HermitianLatticesTheory.autFinite" file="Formalism/HermitianLattices/HermitianLatticesProofs/AutFinite.lean"}
`autFinite` proves `AutFinite` and `classSetFinite` proves `ClassSetFinite` (both statements in the folder `Formalism/HermitianLattices`), each for a Hermitian form with $\Tr_{E/\QQ} h(x,x) > 0$ for all $x \ne 0$. `ClassRepsDefinite` in `Formalism/ThetaLiftIndependence/Statement.lean`, proved by `classRepsDefinite`, adds that a finite set of class representatives exists, that each weight is $1/n$ for a positive integer $n$, and that one integer $D > 0$ clears all of them.
::::
:::: used
- The space of forms is finite-dimensional: [[d-df-forms]].
- The class sets of the chain in the formal proof: [[df-code]] and [[multiplicity-from-lifts]].
::::
:::::

## Weights and the mass of a genus {#df-mass}

Each class is weighted by one over the size of its symmetry group, and the reason is the orbit-counting formula. When a finite group $H$ acts on a finite set $Y$, the orbits partition $Y$ and the orbit of $y$ has $\abs H/\abs{\operatorname{Stab}(y)}$ points, so
$$
\frac{\abs Y}{\abs H} = \sum_{\text{orbits}} \frac{1}{\abs{\operatorname{Stab}}} .
$$ {#eq-df-orbit}
The lattices of a genus are not a finite set, but in adelic language they are the points of $U(X)(\AA_f)/K_L$, with $K_L$ the stabilizer of the completions of $L$, and the classes are the orbits of $U(X)(\QQ)$, with stabilizers the automorphism groups. Then [[eq-df-orbit]] says that the volume of $U(X)(\QQ)\backslash U(X)(\AA_f)$, in units of the volume of $K_L$, is the sum of $1/\abs{\operatorname{Aut}}$ over the classes, so a class with many symmetries is a smaller piece of the space of lattices.

::: definition {#d-df-mass title="Weight and mass"}
The weight of a lattice is $w(L) = 1/\abs{\operatorname{Aut}(L)}$, which depends only on its class. The mass of a genus $\mathcal G$ is $\operatorname{mass}(\mathcal G) = \sum_{L} w(L)$, the sum over one representative of each class. It is a positive rational number, not an integer, and it is not the number of classes.
:::

For the rank-one genus over $\mathcal O_E$ the mass of the genus is $\tfrac12 + \tfrac12 + \tfrac12 = \tfrac32$, and Siegel found that it is computable from local data alone.

::: theorem {#t-df-siegel-mass title="Siegel's mass formula: the mass of a definite genus is a product of local factors" source="siegel1935"}
For a genus $\mathcal G$ of positive definite quadratic lattices of rank at least $2$, $\operatorname{mass}(\mathcal G)$ equals a factor depending only on the rank and the determinant times a product over all primes $p$ of factors computed from the completion $L \otimes \ZZ_p$ of any one lattice of $\mathcal G$. For the primes not dividing twice the determinant the factor depends only on the rank and the determinant.
:::

::: sketch {source="siegel1935"}
Siegel compared the weighted average number of representations of one form by the genus with the number of solutions modulo prime powers, a product of local densities. Conway and Sloane state the formula for unimodular lattices [@conway-sloane1999, ch. 16], and Weil recast the theorem in terms of the Tamagawa measure of the classical groups, unitary groups included [@weil1965].
:::

Two cases of the formula can be checked with a few lines of arithmetic. For even unimodular lattices of rank $n = 8k$ it reads
$$
\operatorname{mass} = \frac{\abs{B_{n/2}}}{n}\prod_{j=1}^{n/2-1}\frac{\abs{B_{2j}}}{4j},
$$
with $B_j$ the Bernoulli numbers [@conway-sloane1999, ch. 16]. In rank $8$ it gives $1/696{,}729{,}600$, one over the number of automorphisms of $E_8$, the only class. In rank $16$ the two classes are $E_8 \oplus E_8$, with $2 \cdot 696{,}729{,}600^2$ automorphisms, and $D_{16}^+$, with $2^{15}\cdot 16!$, and in exact rational arithmetic
$$
\frac{1}{2\cdot 696{,}729{,}600^2} + \frac{1}{2^{15}\cdot 16!} = \frac{691}{277{,}667{,}181{,}515{,}243{,}520{,}000},
$$
which is the formula's value for $n = 16$. For rank-one Hermitian lattices over an imaginary quadratic field of discriminant $-d$ with $w$ units, the mass is the class number over $w$, and Dirichlet's class number formula $h = w\sqrt d\, L(1, \chi_{-d})/(2\pi)$ makes it $\sqrt d\, L(1, \chi_{-d})/(2\pi)$ [@davenport]. Here $\chi_{-23}(n)$ is the Legendre symbol $(n/23)$, with values $1, 1, 1, 1, -1, 1, -1, 1, 1, -1, -1, 1$ for $n = 1, \dots, 12$. We computed $L(1, \chi_{-23}) = 1.9652020541$ as $-\tfrac1{23}\sum_{a=1}^{22}\chi_{-23}(a)\,\psi(a/23)$, with $\psi$ the digamma function, and then $\sqrt{23}\cdot 1.9652020541/(2\pi) = 1.5000000000$, the mass of the three classes of weight $\tfrac12$.

::: lean {decl="Formalism.HermitianLatticesTheory.SiegelMassRatio" file="Formalism/HermitianLattices/StatementMass.lean"}
The code defines `mass h L` as the sum of $1/\abs{\operatorname{Aut}}$ over class representatives (`massBasic` proves it positive and independent of the representatives) and uses Siegel's formula as the ratio `SiegelMassRatio` of the masses of the lattices $I_M$ and $I_{M-1}$ with orthonormal bases, over a CM field unramified over its real subfield and for $M \ge 3$, proved by `GlobalTheory.Mass.siegelMassRatio_holds` in `Development/AbelianVarietyTheory/Proofs/FlagMeasures/SiegelMassRatioUnimodularDefinite.lean` and stated in full in [[t-ml-mass]]. The product form `MassTelescope` is defined in the same file, and no statement in the tree proves or uses it.
:::

## The genus of rank two, worked in full {#df-rank-two}

Rank one is too small to show much, so we do rank two. Let $X_1 = E^2$ with $h(x, y) = \bar x_1 y_1 + \bar x_2 y_2$ over $E = \QQ(\sqrt{-23})$, and let $\mathcal G_1$ be the genus of $\mathcal O_E^2$, the unimodular lattices of $X_1$ that are locally isometric to $\mathcal O_E^2$ at every prime. We also write $\mathcal G_0$ for the rank-one genus of the last two sections, in the space $X_0 = E$.

We found the classes of $\mathcal G_1$ by computer with the neighbor method of [[df-hecke]], closing up $\mathcal O_E^2$ under neighbors at the four primes above $2$ and $3$. Each lattice is stored as the Gram matrix of $\Tr_{E/\QQ} h$ on a $\ZZ$-basis with the matrix of multiplication by $\omega$, and a search over short vectors decides isometry. There are nine classes.

| Class | Lattice | $\abs{\operatorname{Aut}}$ | $w$ | $r(1)$ | $r(2)$ | $r(3)$ | $r(4)$ | $r(5)$ | $r(6)$ |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| $L_1$ | $\mathcal O_E \perp \mathcal O_E$ | 8 | 1/8 | 4 | 4 | 0 | 4 | 8 | 8 |
| $L_2$ | $\mathcal O_E \perp \mathfrak p$ | 4 | 1/4 | 2 | 2 | 6 | 8 | 4 | 10 |
| $L_3$ | $\mathcal O_E \perp \bar{\mathfrak p}$ | 4 | 1/4 | 2 | 2 | 6 | 8 | 4 | 10 |
| $L_4$ | $\mathfrak p \perp \mathfrak p$ | 8 | 1/8 | 0 | 4 | 4 | 8 | 8 | 16 |
| $L_5$ | $\bar{\mathfrak p} \perp \bar{\mathfrak p}$ | 8 | 1/8 | 0 | 4 | 4 | 8 | 8 | 16 |
| $L_6$ | $\mathfrak p \perp \bar{\mathfrak p}$ | 4 | 1/4 | 0 | 4 | 4 | 8 | 8 | 16 |
| $L_7$ | indecomposable | 12 | 1/12 | 0 | 6 | 0 | 6 | 12 | 18 |
| $L_8$ | indecomposable | 12 | 1/12 | 0 | 6 | 0 | 6 | 12 | 18 |
| $L_9$ | indecomposable | 12 | 1/12 | 0 | 0 | 12 | 12 | 0 | 12 |
| Weighted mean | | | 11/8 | 12/11 | 36/11 | 48/11 | 84/11 | 72/11 | 144/11 |

The column $r(n)$ counts the vectors of $L$ with $h(x, x) = n$, and the last row gives the sum of the weights in the $w$ column and, in the $r$ columns, the mean $\sum_L w(L) r_L(n)/\operatorname{mass}(\mathcal G_1)$. Six classes are orthogonal sums of the rank-one lattices of [[df-lattices]], for example $\mathcal O_E \perp \mathcal O_E$ with its four sign changes and the swap. The other three are not, and $L_9$ has no vector of norm $1$ or $2$. The mass of the genus is
$$
\operatorname{mass}(\mathcal G_1) = 3\cdot\tfrac18 + 3\cdot\tfrac14 + 3\cdot\tfrac1{12} = \tfrac{11}{8}.
$$
This value comes from our enumeration: it is the sum of $1/\abs{\operatorname{Aut}}$ over the nine classes we found, with each automorphism group counted by the short-vector search. The identity of the next section checks it without the enumeration. It checks the list and the ratios of the weights, since a missing class or a wrong automorphism count would break it, and in [[t-df-siegel-weil]] we derive $\tfrac{11}8$ a second time from the rank-one genus alone.

## Theta series and the average over a genus {#df-theta}

The theta series of a lattice is the generating function of its norms, and it is the bridge between lattices and modular forms.

::: definition {#d-df-theta title="Theta series and representation numbers"}
For an integral positive definite lattice $L$ over an imaginary quadratic ring, the representation number $r_L(n)$ is the number of $x \in L$ with $h(x, x) = n$, finite because the form is definite. The theta series of $L$ is the function of $\tau$ in the upper half-plane
$$
\theta_L(\tau) = \sum_{x \in L} e^{2\pi i \tau h(x,x)} = \sum_{n \ge 0} r_L(n)\, e^{2\pi i n \tau}.
$$
It depends only on the class of $L$, and it is a generating function of counts, not a single number.
:::

For a unimodular lattice of rank $k$ over $\mathcal O_E$, $\theta_L$ is a modular form of weight $k$ for $\Gamma_0(23)$ with character $\chi_{-23}^k$, because over $\ZZ$ the lattice is even of rank $2k$ and level $23$ [@iwaniec1997]. The code's `thetaL` is the same series, written with $\Tr_{E/\QQ} h(x,x) = 2h(x,x)$ and $\pi i\tau$ in the exponent. For the rank-one genus:

| $n$ | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| $r_{\mathcal O_E}(n)$ | 2 | 0 | 0 | 2 | 0 | 4 | 0 | 4 | 2 | 0 | 0 | 4 |
| $r_{\mathfrak p}(n) = r_{\bar{\mathfrak p}}(n)$ | 0 | 2 | 2 | 2 | 0 | 2 | 0 | 2 | 2 | 0 | 0 | 4 |
| mean | 2/3 | 4/3 | 4/3 | 2 | 0 | 8/3 | 0 | 8/3 | 2 | 0 | 0 | 4 |

Each row is irregular, while the mean is the divisor sum $\tfrac23\sum_{d \mid n}\chi_{-23}(d)$ in every column, as Siegel discovered and Weil explained.

::::: card {#t-df-siegel-weil kind="theorem" title="Averaged with the weights of the classes, the theta series of a definite genus is an Eisenstein series" source="siegel1935"}
:::: statement
Let $\mathcal G$ be a genus of positive definite lattices, quadratic over $\ZZ$ or Hermitian over the ring of integers of an imaginary quadratic field. Then
$$
\frac{1}{\operatorname{mass}(\mathcal G)}\sum_{L \in \mathcal G} w(L)\, r_L(n)
$$
is, for every $n \ge 1$, a product over the primes $p$ of local densities that count solutions of $h(x,x) = n$ in $L \otimes \ZZ_p$, times a factor at infinity. As a series in $e^{2\pi i n\tau}$, this weighted mean of the theta series is an Eisenstein series.
::::
:::: plain
One lattice's counts fluctuate in a way no simple formula describes. Averaged over all lattices of the genus, each weighted by one over its number of symmetries, the counts become as regular as divisor sums, because the genus knows only local information.
::::
:::: why
In this chapter it is the test that our lists of classes are complete and that the weights are right. In the formal proof the Siegel and Weil formula is one of the two inputs of `theoremK_head2`, which proves the identity `ThetaIntegralsAgree` that fixes the constants of the theta integrals between the spaces of the construction.
::::
:::: idea
The genus is defined by local conditions, so any average over the whole genus can only depend on local counts. The individual series differ from the average by cusp forms, which have no constant term and do not survive the averaging.
::::
:::: sketch {source="siegel1935"}
Siegel proved the identity for quadratic forms by computing the number of representations modulo prime powers and comparing with the weighted average [@siegel1935]. Weil reinterpreted it for the classical groups as an identity of automorphic forms, in which the integral of a theta kernel over the adelic quotient of the orthogonal or unitary group equals the value of an Eisenstein series [@weil1965].
::::
:::: example
For the rank-one genus the mean is $\tfrac23\sum_{d \mid n}\chi_{-23}(d)$, checked for $n \le 12$ in the table above, and the difference $\theta_{\mathcal O_E} - \theta_{\mathfrak p}$ has coefficients $2, -2, -2, 0, 0, 2, 0, 2, 0, 0, 0, 0$ for $n = 1, \dots, 12$, which agree with those of $2\eta(\tau)\eta(23\tau)$, the classical cusp form of weight one attached to the polynomial $x^3 - x - 1$ [@serre1977-weight-one]. For the rank-two genus $\mathcal G_1$ the space of Eisenstein series of weight $2$ for $\Gamma_0(23)$ is one-dimensional, so the identity predicts the mean exactly:
$$
\frac{1}{\operatorname{mass}(\mathcal G_1)}\sum_{L\in\mathcal G_1} w(L)\, r_L(n) = \frac{12}{11}\sum_{d \mid n,\ 23 \nmid d} d .
$$
We checked this for every $n \le 24$, and the last row of the table of [[df-rank-two]] shows the first six values. The nine differences $\theta_{L_i}$ minus the mean span a space of dimension $2$, the space of cusp forms of weight $2$ for $\Gamma_0(23)$.

The identity also gives the mass without the enumeration. A vector $v$ with $h(v, v) = 1$ spans a unimodular line, which splits off, so a lattice of $\mathcal G_1$ with a chosen norm-one vector is the same as a lattice $\mathcal O_E v \perp M'$ with $M'$ unimodular of rank one, a class of $\mathcal G_0$, and the automorphisms that fix $v$ are those of $M'$. The orbit count [[eq-df-orbit]] then gives $\sum_L w(L)\,r_L(1) = \operatorname{mass}(\mathcal G_0) = \tfrac32$, and the identity at $n = 1$ says that the same sum is $\tfrac{12}{11}\operatorname{mass}(\mathcal G_1)$. So $\operatorname{mass}(\mathcal G_1) = \tfrac32 \cdot \tfrac{11}{12} = \tfrac{11}8$, in agreement with the enumeration.
::::
:::: lean {decl="GlobalTheory.ThK.Dbl.SiegelWeilStd" file="Development/WeilBound/ThetaLifts/LatticeBasics/HypothesesS.lean"}
For a definite space $V$ of rank $a$ paired with a space $V'$ of rank $b$ over a CM field (the code's `A` and `Y`), one of the two Hermitian and the other skew-Hermitian, and a Hecke character with the restriction property `ResEtaPow` that the formula requires, the Siegel Eisenstein series of the Siegel and Weil section is holomorphic at $s_0 = (a-b)/2$, and its value there is the mean of the theta function over a fundamental domain for $U(V)$, times $1$ if $b < a$ and times $2$ otherwise. It is proved by `siegelWeilStd` in `Development/WeilBound/CoreStatements/AutomorphicKernels/SiegelWeilFormula/SiegelWeilStandard/SiegelWeilStd.lean`.
::::
:::: used
- The constants of the theta integrals of the construction, through `ThetaIntegralsAgree`: [[multiplicity-from-lifts]] and [[inputs-and-assembly]].
- The adjoint lift of the constant function: [[t-df-lift-constant]].
::::
:::::

::: figure {#f-df-theta-average viz="genus-theta-average" height="440"}
The representation numbers of single classes wander, but their mean with weights one over the automorphism orders lands exactly on the divisor sums of an Eisenstein series, and only the complete genus with these weights does.

```vizspec
Purpose: show the Siegel and Weil identity in numbers for a genus of nine classes of rank-two Hermitian lattices.
Data (n = 1..24; nine classes, four distinct series; weights w):
  A (classes L1, weight 1/8): 4,4,0,4,8,8,16,12,20,24,0,40,24,32,16,36,24,44,16,40,16,32,4,80
  B (classes L2 and L3, weight 1/4 each): 2,2,6,8,4,10,8,18,16,24,12,32,18,28,20,30,24,40,20,44,32,40,2,70
  C (classes L4 and L5 weight 1/8 each, L6 weight 1/4): 0,4,4,8,8,16,8,16,12,16,16,28,12,24,32,36,16,44,24,48,40,40,0,60
  D (classes L7 and L8, weight 1/12 each): 0,6,0,6,12,18,12,12,12,12,12,30,12,24,36,42,12,48,24,48,36,36,0,60
  E (class L9, weight 1/12): 0,0,12,12,0,12,0,24,12,24,24,24,12,24,24,24,24,36,24,48,48,48,0,60
  Eisenstein prediction: e(n) = (12/11) * (sum of the divisors d of n with 23 not dividing d).
Scene: x axis n = 1..24, y axis 0..80. For each of the nine classes draw its r(n) as small muted dots
  (classes with the same series overlap). Draw the weighted mean mean(n) = sum_i w_i r_i(n) / sum_i w_i over
  the selected classes as gold bars, and e(n) as blue horizontal ticks on top of each bar.
Controls: nine checkboxes L1..L9 (all on by default) that include or exclude a class from the mean; a toggle
  "weights 1/|Aut|" versus "equal weights". A readout shows max over n of |mean(n) - e(n)|.
Motion: bars animate (200 ms) to new heights when a control changes. When the readout is 0, the bars turn from
  gold to a gold-and-blue match state.
Reader takeaway: with all nine classes and the weights 1/|Aut| the bars sit exactly on the ticks; removing any
  class or using equal weights breaks the match.
```
:::

## Automorphic forms are vectors {#df-forms}

On a definite group an automorphic form, a function on the adelic points invariant under the rational points and a compact open subgroup, collapses to a function on the finite set of classes, because the real points form a compact group and contribute only a choice of finite-dimensional representation [@gross1999].

::: definition {#d-df-forms title="Automorphic forms on a definite unitary group"}
Let $\mathcal G$ be a genus in a totally definite Hermitian space, with classes $L_1, \dots, L_h$. A scalar automorphic form of level $\mathcal G$ is a function $f\colon \{L_1, \dots, L_h\} \to \CC$, and the space of all of them is $\mathcal A(\mathcal G) \cong \CC^h$. Its inner product is
$$
\langle f, g\rangle = \sum_{i=1}^{h} w(L_i)\, \overline{f(L_i)}\, g(L_i).
$$
A vector-valued form takes at each $L_i$ a value in a fixed finite-dimensional space, fixed by $\operatorname{Aut}(L_i)$. A form is not a function on $X$ or on any space with a topology, and it carries no analytic condition.
:::

By [[eq-df-orbit]], the weights make this the natural measure on the adelic quotient. The constant function $\mathbf 1$ has $\langle \mathbf 1, \mathbf 1\rangle = \operatorname{mass}(\mathcal G)$, and it and the other forms that factor through a determinant play the role of Eisenstein series, while the forms orthogonal to them carry the arithmetic.

For the rank-one genus, $\mathcal A(\mathcal G_0) = \CC^3$. Write $\xi$ for the class group character with $\xi(\mathfrak p) = e^{2\pi i/3}$, so $\xi(\mathcal O_E) = 1$ and $\xi(\bar{\mathfrak p}) = e^{-2\pi i/3}$. Then $\mathbf 1$, $\xi$, and $\bar\xi$ are orthogonal, for example $\langle \xi, \mathbf 1\rangle = \tfrac12(1 + e^{2\pi i/3} + e^{-2\pi i/3}) = 0$, and $\langle \xi, \xi\rangle = \tfrac32$. They are the unramified Hecke characters of $E$ of trivial infinity type, seen as forms on the one-dimensional unitary group. For the rank-two genus, $\mathcal A(\mathcal G_1) = \CC^9$.

::: lean {decl="Formalism.BasicNotions.ColumnChain" file="Formalism/LocalRingCardinality/DataKernels.lean"}
The record that carries the formal proof's forms has, for each level $i$, a finite type `cls i` of classes, a finite group `stab i c` for each class, a positive integer `DGam` divisible by every `Nat.card (stab i c)` with $i \le m$, and index types `Y i`. Forms are functions `cls i → Y i → ℂ`, so at each class a form takes a value in the space of functions on `Y i`, and the weight is `wt i c = (Nat.card (stab i c))⁻¹`.
:::

In `Formalism/ThetaLiftIndependence/Statement.lean` the weighted sums have the same shape: `latLift h s f Θ` is $\sum_{L \in s} w(L) f(L)\Theta(L)$ over a set $s$ of class representatives, `latIp` is the inner product above, and `thetaLift` is the case $\Theta(L) = \theta_L(\tau)$.

## Hecke operators are neighbor matrices {#df-hecke}

The operators that act on these vectors come from comparing lattices that differ at a single prime, a method Kneser introduced to enumerate genera [@kneser1957].

::: definition {#d-df-neighbor title="Kneser neighbors at a split prime"}
Let $\mathfrak p\bar{\mathfrak p} = p\mathcal O_E$ be a split prime, and $L, M$ unimodular lattices in $X$. Then $M$ is a $\mathfrak p$-neighbor of $L$ when $L_{\mathfrak q} = M_{\mathfrak q}$ at every prime $\mathfrak q \ne \mathfrak p, \bar{\mathfrak p}$, when $L/(L \cap M) \cong \mathcal O_E/\bar{\mathfrak p}$, and when $M/(L \cap M) \cong \mathcal O_E/\mathfrak p$. Kneser neighbors at a prime are lattices that differ there by the smallest possible step in each direction, and nowhere else.
:::

Neighbors are easy to make. For $x \in L$ with $x \notin \mathfrak pL$ and $h(x, x) \in \mathfrak p\bar{\mathfrak p}$,
$$
M = \mathfrak p^{-1}x + \{z \in L : h(x, z) \in \bar{\mathfrak p}\}
$$ {#eq-df-neighbor}
is a unimodular $\mathfrak p$-neighbor of $L$. In our computations at $\mathfrak p = (2, \omega)$, each of the $2^k - 1$ nonzero classes of $L/\mathfrak pL \cong \FF_2^k$, for $L$ of rank $k$, gave one neighbor, and in rank two several representatives $x$ of each class gave the same neighbor. A lattice of rank two therefore has three $\mathfrak p$-neighbors, and the neighbor matrix
$$
A_{\mathfrak p}(L_i, L_j) = \#\{\text{$\mathfrak p$-neighbors of $L_i$ isometric to $L_j$}\}
$$
acts on forms by $(A_{\mathfrak p} f)(L_i) = \sum_j A_{\mathfrak p}(L_i, L_j) f(L_j)$, the sum of $f$ over the neighbors of $L_i$. These are the Hecke operators of the definite group [@gross1999].

::: lean {decl="Formalism.HermitianLatticesTheory.NeighbourConstruct" file="Formalism/HermitianLattices/NeighbourConstruct.lean"}
`IsNeighbour P L M` in `StatementLat.lean` is the definition above, with the code's ideal `P` in the role of $\mathfrak p$, and `NeighbourConstruct`, proved by `neighbourConstruct` in `HermitianLatticesProofs/NeighbourConstruct.lean`, says that for unimodular $L$, a nonzero maximal ideal $\mathfrak p$ (split or not), $x \in L \setminus \mathfrak pL$ and $h(x,x) \in \mathfrak p\bar{\mathfrak p}$, the lattice `neighbourOf h P L x` of [[eq-df-neighbor]] is unimodular, a $\mathfrak p$-neighbor of $L$, and meets $L$ in $\{z \in L : h(x,z) \in \bar{\mathfrak p}\}$.
:::

For the rank-two genus $\mathcal G_1$ the matrix is the following, with rows the classes $L_i$ and columns the classes of their neighbors.

| | $L_1$ | $L_2$ | $L_3$ | $L_4$ | $L_5$ | $L_6$ | $L_7$ | $L_8$ | $L_9$ |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| $L_1$ | 0 | 2 | 0 | 0 | 1 | 0 | 0 | 0 | 0 |
| $L_2$ | 0 | 0 | 1 | 1 | 0 | 0 | 1 | 0 | 0 |
| $L_3$ | 1 | 0 | 0 | 0 | 0 | 1 | 0 | 0 | 1 |
| $L_4$ | 1 | 0 | 0 | 0 | 0 | 2 | 0 | 0 | 0 |
| $L_5$ | 0 | 0 | 2 | 1 | 0 | 0 | 0 | 0 | 0 |
| $L_6$ | 0 | 1 | 0 | 0 | 1 | 0 | 0 | 1 | 0 |
| $L_7$ | 0 | 0 | 0 | 0 | 0 | 3 | 0 | 0 | 0 |
| $L_8$ | 0 | 0 | 3 | 0 | 0 | 0 | 0 | 0 | 0 |
| $L_9$ | 0 | 3 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |

Every row sums to $3$, so $A_{\mathfrak p}\mathbf 1 = 3\cdot\mathbf 1$. The matrix is not symmetric, because its symmetry involves the weights and the conjugate prime.

::::: card {#t-df-adjoint kind="proposition" title="The neighbor operators at a prime and at its conjugate are adjoint for the inner product weighted by one over the automorphism orders"}
:::: statement
For classes $L_i, L_j$ of a genus in a totally definite space and a split prime $\mathfrak p$,
$$
w(L_i)\, A_{\mathfrak p}(L_i, L_j) = w(L_j)\, A_{\bar{\mathfrak p}}(L_j, L_i),
$$
equivalently $\langle A_{\mathfrak p} f, g\rangle = \langle f, A_{\bar{\mathfrak p}} g\rangle$ for all forms $f, g$.
::::
:::: plain
Counting neighbor pairs from either end gives the same number, provided each lattice counts with one over its number of symmetries.
::::
:::: why
Adjointness makes $A_{\mathfrak p} + A_{\bar{\mathfrak p}}$ self-adjoint, with real eigenvalues and an orthogonal basis of eigenforms, and it is why the weights $w(L)$, and no others, belong in the inner product. The same counting gives the adjoint of a theta lift in [[df-lift]].
::::
:::: idea
Count pairs of lattices $(L', M')$ with $L'$ in the class of $L_i$, $M'$ in the class of $L_j$, and $M'$ a $\mathfrak p$-neighbor of $L'$, up to the action of $U(X)$, and apply [[eq-df-orbit]] once with $L'$ fixed and once with $M'$ fixed.
::::
:::: proof
Let $\mathcal P$ be the set of such pairs. Isometries preserve classes and the neighbor relation, so $U(X)$ acts on $\mathcal P$. Every orbit contains pairs with first entry the representative $L_i$, and two such pairs $(L_i, M')$ and $(L_i, M'')$ lie in one orbit exactly when some element of $\operatorname{Aut}(L_i)$ carries $M'$ to $M''$. So the orbits of $U(X)$ on $\mathcal P$ correspond to the orbits of the finite group $\operatorname{Aut}(L_i)$ on the set $N_i$ of $\mathfrak p$-neighbors of $L_i$ in the class of $L_j$, a set with $A_{\mathfrak p}(L_i, L_j)$ elements. For an orbit $o$ let $s(o)$ be the order of the stabilizer in $U(X)$ of one of its pairs, a subgroup of $\operatorname{Aut}(L_i)$. Then [[eq-df-orbit]] gives $A_{\mathfrak p}(L_i, L_j)/\abs{\operatorname{Aut}(L_i)} = \sum_o 1/s(o)$.

The relation is symmetric with the primes exchanged: the conditions $L'/(L' \cap M') \cong \mathcal O_E/\bar{\mathfrak p}$ and $M'/(L' \cap M') \cong \mathcal O_E/\mathfrak p$ say exactly that $L'$ is a $\bar{\mathfrak p}$-neighbor of $M'$. Fixing the second entry to be the representative $L_j$ in the same way identifies the orbits with the orbits of $\operatorname{Aut}(L_j)$ on the $\bar{\mathfrak p}$-neighbors of $L_j$ in the class of $L_i$, and gives $A_{\bar{\mathfrak p}}(L_j, L_i)/\abs{\operatorname{Aut}(L_j)} = \sum_o 1/s(o)$. The two sums are the same sum. For the inner products, $\langle A_{\mathfrak p}f, g\rangle = \sum_{i,j} w(L_i)A_{\mathfrak p}(L_i, L_j)\overline{f(L_j)}g(L_i)$ and $\langle f, A_{\bar{\mathfrak p}}g\rangle = \sum_{i,j} w(L_j)A_{\bar{\mathfrak p}}(L_j, L_i)\overline{f(L_j)}g(L_i)$, which agree term by term.
::::
:::: example
From the table, $w(L_1)A_{\mathfrak p}(L_1, L_2) = \tfrac18\cdot 2 = \tfrac14$, and our computed $A_{\bar{\mathfrak p}}(L_2, L_1) = 1$ gives $w(L_2)A_{\bar{\mathfrak p}}(L_2, L_1) = \tfrac14$. We checked the identity for all $81$ pairs, and that $A_{\mathfrak p}$ and $A_{\bar{\mathfrak p}}$ commute.
::::
:::: lean {decl="Formalism.ThetaLiftIndependence.KerAdjoint" file="Formalism/ThetaLiftIndependence/Statement.lean"}
`KerAdjoint` states the general adjointness of a weighted kernel operator and its conjugate transpose, and it is used in no other statement. We found no declaration that states the proposition for neighbor matrices, so the proof above is ours.
::::
:::: used
- Real spectra and orthogonal eigenforms in the next paragraph, and the adjoint lift in [[df-lift]].
::::
:::::

The spectrum of $A_{\mathfrak p}$ on $\mathcal A(\mathcal G_1)$ is the set of the nine products
$$
\{3,\ a_+,\ a_-\} \cdot \{1,\ e^{2\pi i/3},\ e^{-2\pi i/3}\}, \qquad a_\pm = \frac{-1 \pm \sqrt5}{2},
$$
which we computed exactly, and the self-adjoint operator $A_{\mathfrak p} + A_{\bar{\mathfrak p}}$ has the real eigenvalues $6$, $-1 \pm \sqrt5$, $-3$ twice, and $\tfrac12(1 \pm \sqrt5)$ twice each. Both factors have a meaning. Every lattice has a Steinitz class $\operatorname{st}(L)$, the class of $\mathfrak a_1\mathfrak a_2$ when $L \cong \mathfrak a_1 \oplus \mathfrak a_2$ as a module, and a sublattice $L' \subset L$ with $L/L' \cong \mathcal O_E/\mathfrak q$ has $\operatorname{st}(L') = \operatorname{st}(L)[\mathfrak q]$. Applied to the two indices in the definition of a neighbor, this gives $\operatorname{st}(M) = \operatorname{st}(L)[\bar{\mathfrak p}][\mathfrak p]^{-1} = \operatorname{st}(L)[\mathfrak p]$ for every $\mathfrak p$-neighbor $M$ of $L$, since $[\mathfrak p]$ has order $3$. So $\xi \circ \operatorname{st}$ is an eigenform with eigenvalue $3\xi(\mathfrak p) = 3e^{2\pi i/3}$, and its conjugate has eigenvalue $3e^{-2\pi i/3}$. The values $a_\pm$ are also the eigenvalues of the classical Hecke operator $T_2$ on the cusp forms of weight $2$ for $\Gamma_0(23)$, which we computed independently from the nine theta series. A matrix that counts lattices carries the Hecke eigenvalues of classical cusp forms, an instance of the theta correspondence that we observe in numbers and do not prove.

::: figure {#f-df-neighbors viz="neighbor-averaging" height="460"}
Averaging a form over Kneser neighbors keeps its weighted mean and shrinks everything else, so repeated averaging flattens any form onto the constant, at a rate set by the second-largest eigenvalue.

```vizspec
Purpose: make the Hecke operator of a definite unitary group visible as averaging over a graph of nine lattice classes.
Data: nine nodes L1..L9 with weights w = (1/8, 1/4, 1/4, 1/8, 1/8, 1/4, 1/12, 1/12, 1/12). Directed neighbor
  counts A (row i, column j, number of P-neighbors of Li in class Lj):
  L1: 0 2 0 0 1 0 0 0 0 | L2: 0 0 1 1 0 0 1 0 0 | L3: 1 0 0 0 0 1 0 0 1 | L4: 1 0 0 0 0 2 0 0 0 |
  L5: 0 0 2 1 0 0 0 0 0 | L6: 0 1 0 0 1 0 0 1 0 | L7: 0 0 0 0 0 3 0 0 0 | L8: 0 0 3 0 0 0 0 0 0 |
  L9: 0 3 0 0 0 0 0 0 0. The conjugate operator is B(i, j) = w_j A(j, i) / w_i. T = (A + B) / 6.
Scene: left half, the nine nodes on a circle, each a disc with area proportional to w; directed edges from Li
  to Lj with thickness proportional to A(i, j), in muted color, with arrowheads. Right half, a bar chart of
  the current form f (one bar per class, colored blue above 0 and red below), a horizontal gold line at the
  weighted mean sum_i w_i f_i / sum_i w_i, and a readout of the weighted distance to the mean,
  sqrt(sum_i w_i (f_i - mean)^2).
Controls: drag any bar to set f; buttons "delta at L9" (f = indicator of L9), "random"; button "average once"
  applies f <- T f; a play toggle applies it every 600 ms; a toggle shows P-edges, Pbar-edges, or both.
Motion: bars ease to new heights (300 ms) after each application; the edges out of each node flash briefly
  in proportion to the mass they carry.
Reader takeaway: the gold line never moves, the bars converge to it, and the distance shrinks by a factor
  of about 0.54 per step, which is (1 + sqrt 5) / 6, the largest eigenvalue size of A + B other than 6,
  divided by 6.
```
:::

## The theta lift is a matrix {#df-lift}

A theta lift between two definite genera needs a kernel that compares a lattice of the smaller space with a lattice of the larger. We use the most classical one, the count of embeddings, and this choice of kernel for the illustration is ours.

::: definition {#d-df-lift title="Embedding kernel and the lift it defines"}
Let $X \subset X'$ be totally definite Hermitian spaces with genera $\mathcal G$ in $X$ and $\mathcal G'$ in $X'$. For $L \in \mathcal G$ and $M \in \mathcal G'$, let $K(L, M)$ be the number of $\mathcal O_E$-linear maps $L \to M$ that preserve $h$. The lift matrix of the pair is $(K(L, M))$, and the lift is the linear map $\mathcal L_K\colon \mathcal A(\mathcal G) \to \mathcal A(\mathcal G')$,
$$
(\mathcal L_K f)(M) = \sum_{L \in \mathcal G} w(L)\, f(L)\, K(L, M).
$$
It is a linear map between spaces of functions on finite sets, not an integral transform, and its entries are counts, not values of an analytic kernel.
:::

The entries are theta coefficients. An embedding of $\mathcal O_E$ into $M$ is fixed by the image $v$ of $1$, with $h(v, v) = 1$, so $K(\mathcal O_E, M) = r_M(1)$. In general $K(L, M)$ counts the tuples of vectors of $M$ with the Gram matrix of a basis of $L$, a Fourier coefficient of a theta series of $M$ in several variables.

For $X_0 = E \subset X_1 = E^2$ and the genera $\mathcal G_0$ and $\mathcal G_1$, the lift matrix has the following nonzero columns, and the columns $L_7$, $L_8$, $L_9$ are zero, because a unimodular sublattice of rank one splits off and those three are not orthogonal sums.

| | $L_1$ | $L_2$ | $L_3$ | $L_4$ | $L_5$ | $L_6$ |
| --- | --- | --- | --- | --- | --- | --- |
| $\mathcal O_E$ | 4 | 2 | 2 | 0 | 0 | 0 |
| $\mathfrak p$ | 0 | 2 | 0 | 4 | 0 | 2 |
| $\bar{\mathfrak p}$ | 0 | 0 | 2 | 0 | 4 | 2 |

The row of $\mathcal O_E$ is the column $r(1)$ of the table in [[df-rank-two]], as it should be. With all source weights equal to $\tfrac12$, the lift of the constant function is $\mathcal L_K\mathbf 1 = (2, 2, 2, 2, 2, 2, 0, 0, 0)$, and the lift of the class group character $\xi$ is
$$
\mathcal L_K\xi = \big(2,\ e^{\pi i/3},\ e^{-\pi i/3},\ 2e^{2\pi i/3},\ 2e^{-2\pi i/3},\ -1,\ 0,\ 0,\ 0\big).
$$
The lift of the constant is not constant. Its projection onto $\mathbf 1$ is $\langle \mathcal L_K\mathbf 1, \mathbf 1\rangle/\langle\mathbf 1,\mathbf 1\rangle = (9/4)/(11/8) = 18/11$ times $\mathbf 1$.

::::: card {#t-df-lift-constant kind="proposition" title="For the lift from rank one to rank two, the adjoint sends the constant function to three halves of itself, so lifts of forms orthogonal to constants stay orthogonal to constants"}
:::: statement
With the weighted inner products, the adjoint of $\mathcal L_K$ is $(\mathcal L_K^* g)(L) = \sum_{M \in \mathcal G'} w(M)\, g(M)\, K(L, M)$. For the lift from $\mathcal G_0$ to $\mathcal G_1$, $\mathcal L_K^*\mathbf 1 = \tfrac32\,\mathbf 1$, and therefore $\langle \mathcal L_K f, \mathbf 1\rangle = \tfrac32\langle f, \mathbf 1\rangle$ for every form $f$ on $\mathcal G_0$.
::::
:::: plain
Each rank-one lattice sits inside the rank-two lattices the same number of times on average, once those are weighted by their symmetries, so a form with mean zero lifts to a form with mean zero.
::::
:::: why
The chain's information is carried by forms orthogonal to the constants, and a lift that mixed them with the constant would let the trivial part of the space contaminate the chain.
::::
:::: idea
The value $\mathcal L_K^*\mathbf 1(L) = \sum_M w(M)K(L,M)$ is a weighted count of the embeddings of $L$ into the whole genus. A unimodular image splits off, so an embedding of $L$ into $M$ is the same as a decomposition $M = L \perp M''$ with $M''$ unimodular of rank one, and by [[eq-df-orbit]] the weighted count is $\sum_{M''} 1/\abs{\operatorname{Aut}(M'')} = \operatorname{mass}(\mathcal G_0)$, whatever $L$ is.
::::
:::: proof
The formula for the adjoint is the computation $\langle \mathcal L_K f, g\rangle = \sum_{L, M} w(L)w(M)\overline{f(L)}K(L,M)g(M) = \langle f, \mathcal L_K^* g\rangle$, since $K$ is real. For the numbers, $\mathcal L_K^*\mathbf 1(\mathcal O_E) = \tfrac18\cdot4 + \tfrac14\cdot 2 + \tfrac14\cdot 2 = \tfrac32$, $\mathcal L_K^*\mathbf 1(\mathfrak p) = \tfrac14\cdot2 + \tfrac18\cdot4 + \tfrac14\cdot 2 = \tfrac32$, and the same for $\bar{\mathfrak p}$. Then $\langle \mathcal L_K f, \mathbf 1\rangle = \langle f, \mathcal L_K^*\mathbf 1\rangle = \tfrac32\langle f, \mathbf 1\rangle$.
::::
:::: example
For $f = \xi$, $\langle \xi, \mathbf 1\rangle = 0$, so $\mathcal L_K\xi$ is orthogonal to the constant, which the vector above confirms, since $\tfrac18\cdot 2 + \tfrac14(e^{\pi i/3} + e^{-\pi i/3}) + \tfrac18(2e^{2\pi i/3} + 2e^{-2\pi i/3}) - \tfrac14 = \tfrac14 + \tfrac14 - \tfrac14 - \tfrac14 = 0$. For the next step of the chain, from $\mathcal G_1$ to the rank-three genus $\mathcal G_2$ of [[df-chain]], we found $\mathcal L_K^*\mathbf 1 = \tfrac32\,\mathbf 1$ again, on all nine classes, as the idea predicts, since the complement of a rank-two lattice in a rank-three one is again a class of $\mathcal G_0$.
::::
:::: used
- The composite of a lift and its adjoint, in the next paragraph, and the chain in [[df-chain]].
::::
:::::

The composite $\mathcal L_K^*\mathcal L_K$ is an operator on $\mathcal A(\mathcal G_0)$, and its matrix is
$$
\mathcal L_K^*\mathcal L_K = \begin{pmatrix} 2 & \tfrac12 & \tfrac12 \\ \tfrac12 & 2 & \tfrac12 \\ \tfrac12 & \tfrac12 & 2 \end{pmatrix},
$$
with eigenvalue $3$ on $\mathbf 1$ and $\tfrac32$ on $\xi$ and on $\bar\xi$. So $\lVert\mathcal L_K\mathbf 1\rVert^2 = \tfrac92 = 3\cdot\tfrac32$ and $\lVert\mathcal L_K\xi\rVert^2 = \tfrac94 = \tfrac32\cdot\tfrac32$. Our reading is that this is the shape of the Rallis inner product formula, in which the norm of a theta lift is the norm of the form times a constant built from an L-value, though we do not identify $3$ and $\tfrac32$ with L-values. The code states this pattern as `RallisAdj`, in which $\theta^*\theta$ acts by a scalar, and a seesaw identity for lattice lifts as `LatSeeSaw`, both in `Formalism/ThetaLiftIndependence/Statement.lean`, and no statement in the index uses either.

::: figure {#f-df-lift viz="lift-matrix" height="460"}
A theta lift between definite groups is a matrix: a form on three classes becomes a form on nine, and lifting back with the adjoint returns each class group character multiplied by its own constant.

```vizspec
Purpose: show the theta lift from a rank-one genus (3 classes) to a rank-two genus (9 classes) as a weighted
  matrix product, and the scalars of the lift followed by its adjoint.
Data: source classes O, p, pbar with weights 1/2 each; target classes L1..L9 with weights
  (1/8, 1/4, 1/4, 1/8, 1/8, 1/4, 1/12, 1/12, 1/12). Kernel K (rows O, p, pbar; columns L1..L9):
  O: 4 2 2 0 0 0 0 0 0 | p: 0 2 0 4 0 2 0 0 0 | pbar: 0 0 2 0 4 2 0 0 0.
  Lift: g(Lj) = sum_i (1/2) f(i) K(i, j). Adjoint: (f')(i) = sum_j w_j g(Lj) K(i, j).
Scene: left, three draggable bars for f on O, p, pbar (values may be complex; show real part as bar height
  and the phase as a small dial on top of each bar). Middle, a 3 x 9 heat map of K with cell labels.
  Right, nine bars for g = lift(f), same encoding. Bottom, three ghost bars for the adjoint lift of g next to
  the original f bars.
Controls: drag the three source bars (real values from -2 to 2); preset buttons "1" (f = 1, 1, 1),
  "xi" (f = 1, e^(2 pi i/3), e^(-2 pi i/3)), "xi bar".
Motion: when f changes, highlight the heat-map cells in proportion to their contribution and ease the target bars.
Reader takeaway: preset "1" returns 3 times f after lift and adjoint, presets "xi" and "xi bar" return
  1.5 times f, and columns L7, L8, L9 never receive anything.
```
:::

## The general theory behind the matrices {#df-weil}

The matrices of this chapter are the definite, finite shadow of a general construction. For a Hermitian space and a skew-Hermitian space, the tensor product carries a symplectic form, and its symplectic group acts projectively on functions on a Lagrangian subspace by the Weil representation, which Weil built from the Heisenberg group and the uniqueness of its irreducible representation with a given central character [@weil1964]. Restricted to the two unitary groups, which commute inside the symplectic group, it is the representation that the code's theta integral `Model.I` integrates. Summing over rational points gives a theta function in two variables, and integrating it against a form on one group gives a form on the other, the global theta lift. When the first group is definite the integral is a finite sum over classes with weights $1/\abs{\operatorname{Aut}}$, which in our reading is what the matrix $K$ records.

Howe duality says that this correspondence is a bijection at each place between the irreducible representations of the two groups that occur as quotients of the Weil representation. Howe proved it for real groups [@howe1989], and Gan and Takeda, after Waldspurger's proof in odd residue characteristic, proved it for nonarchimedean local fields of characteristic other than $2$ in every residue characteristic [@gan-takeda2016]. The seesaw principle, which exchanges the order of two theta integrals among four groups, computes periods of lifted forms [@kudla1984]. The formal proof uses all three through named published statements, among them `HoweDualityReal` and `WeilRepresentationUnitaryPair`, and [[multiplicity-from-lifts]] explains the seesaw it needs.

## A chain of lifts is a product of matrices {#df-chain}

Iterating lifts multiplies matrices, and the code's chain is an iterated weighted kernel operator.

```lean
def kerOp {R ι κ : Type*} [CommSemiring R] [Fintype ι] (w : ι → R) (K : ι → κ → R)
    (f : ι → R) : κ → R :=
  fun j => ∑ i, w i * f i * K i j

def chainOp {R : Type*} [CommSemiring R] {ι : ℕ → Type*} [∀ j, Fintype (ι j)]
    (w : ∀ j, ι j → R) (K : ∀ j, ι j → ι (j + 1) → R) : (m : ℕ) → (ι 0 → R) → (ι m → R)
  | 0, f => f
  | m + 1, f => kerOp (w m) (K m) (chainOp w K m f)

def ChainInt : Prop :=
  ∀ (R : Type) [CommRing R] (S : Subring R) (ι : ℕ → Type) [∀ j, Fintype (ι j)]
    (w : ∀ j, ι j → R) (K : ∀ j, ι j → ι (j + 1) → R) (D : ℕ → R),
    (∀ j i, D j * w j i ∈ S) → (∀ j a b, K j a b ∈ S) →
    ∀ f : ι 0 → R, (∀ i, f i ∈ S) → ∀ (m : ℕ) (y : ι m),
      (∏ j ∈ Finset.range m, D j) * chainOp w K m f y ∈ S
```

In words, `kerOp` is the lift $\mathcal L_K$ of [[d-df-lift]] with weights $w$, and `chainOp w K m` applies $m$ such lifts in turn, from functions on the finite set $\iota_0$ to functions on $\iota_m$. Writing a form as a row vector $f$ and $W_j$ for the diagonal matrix of the weights on $\iota_j$,
$$
\mathrm{chainOp}_m(f) = f\, W_0 K_0\, W_1 K_1 \cdots W_{m-1} K_{m-1}.
$$ {#eq-df-chain}

::::: card {#t-df-chain kind="proposition" title="An $m$-fold chain of lifts is a product of $m$ weighted kernel matrices, and a common denominator for each step's weights clears the whole chain"}
:::: statement
Let $S$ be a subring of a commutative ring $R$, let $\iota_0, \dots, \iota_m$ be finite sets, and let $w_j\colon \iota_j \to R$ and $K_j\colon \iota_j \times \iota_{j+1} \to R$ satisfy $D_j w_j(i) \in S$ and $K_j(a, b) \in S$ for elements $D_j \in R$. If $f$ takes values in $S$, then $\big(\prod_{j<m} D_j\big)\,\mathrm{chainOp}_m(f)$ takes values in $S$, and $\mathrm{chainOp}_m(f)$ is given by [[eq-df-chain]].
::::
:::: plain
Each lift multiplies by integer counts and divides by automorphism orders. If one number clears the automorphism orders at each step, the product of those numbers clears the whole chain, however long it is.
::::
:::: why
In our reading, integrality is what replaces vanishing to high order over the integers, because a nonzero integer is at least $1$ in size, and [[multiplicity-from-lifts]] plays divisibility against size through the product formula. A chain of about $\sqrt x$ lifts would be useless for that if its denominators could grow without control.
::::
:::: idea
Induct on $m$. One more step multiplies by $D_m$, and $D_m w_m(i)$ times an element of $S$ times $K_m(i, y)$ is in $S$.
::::
:::: proof
For $m = 0$ there is nothing to prove. Suppose $P_m = \prod_{j<m}D_j$ and $P_m\,\mathrm{chainOp}_m(f)(i) \in S$ for all $i \in \iota_m$. By definition,
$$
P_{m+1}\,\mathrm{chainOp}_{m+1}(f)(y) = \sum_{i \in \iota_m} \big(D_m w_m(i)\big)\big(P_m\,\mathrm{chainOp}_m(f)(i)\big)K_m(i, y),
$$
using commutativity of $R$, and each term is a product of three elements of $S$. Unwinding the recursion with $f$ as a row vector gives [[eq-df-chain]].
::::
:::: example
For the two-step chain $\mathcal G_0 \to \mathcal G_1 \to \mathcal G_2$, with $\mathcal G_2$ the genus of $\mathcal O_E^3$, the common denominators are $D_0 = 2$ and $D_1 = 24$, the least common multiple of $8, 4, 12$, so the proposition guarantees that $48$ times the chain of an integer-valued form is integral. The actual chain matrix $W_0K_0W_1K_1$, of size $3 \times 30$, has integer entries, six nonzero in each row, and the lift of $\mathbf 1$ is $6$ on ten classes of $\mathcal G_2$ and $0$ on the other $20$. The bound is not sharp here because $\operatorname{Aut}(L)$ acts freely on the embeddings of $L$, so $w(L)K(L, M)$ is already an integer. Kernels twisted by characters and normalizing factors, as in the code, need not behave this way.
::::
:::: lean {decl="Formalism.ThetaLiftIndependence.ChainInt" file="Formalism/ThetaLiftIndependence/Statement.lean"}
`ChainInt` is the statement of this card. It is defined in the tree, never proved, and used in no other statement. The two comparison lemmas that our first reading of the region attributed to it, in `Development/AbelianVarietyTheory/Proofs/JetHarmonics/AddCharMemValuationSubring.lean`, concern a different proposition with the same short name, `GlobalTheory.IndefiniteRowSideFullHecke.PerfectPairings.ChainInt`. The proof above is ours.
::::
:::: used
- The integrality of the formal proof's chain and its periods (`FactWtInt`, `chain_ge`, `PeriodClassSumWeyl`), at the end of this section.
- The rank condition and the budget for the chain: [[multiplicity-from-lifts]].
::::
:::::

The rank-three genus $\mathcal G_2$, computed the same way from neighbors at $\mathfrak p$, has $30$ classes, with automorphism groups of order $8$ for three classes and of orders $16$, $24$, and $48$ for nine classes each, so its mass is $\tfrac38 + \tfrac9{16} + \tfrac9{24} + \tfrac9{48} = \tfrac32$. The weighted mean of $r_L(n)$ for $n = 1, \dots, 10$ is $\tfrac{11}{12}, \tfrac{55}{12}, \tfrac{55}{6}, \tfrac{77}{4}, 24, \tfrac{275}{6}, 48, \tfrac{935}{12}, \tfrac{1001}{12}, 120$, and as [[t-df-siegel-weil]] predicts these ten numbers equal
$$
-\frac{1}{24}\sum_{d \mid n}\chi_{-23}(d)\,d^2 + \frac{23}{24}\sum_{d \mid n}\chi_{-23}(n/d)\,d^2,
$$
a combination of the two Eisenstein series of weight $3$ for $\Gamma_0(23)$ with character $\chi_{-23}$, whose first coefficient $-\tfrac1{24} = -6/B_{3,\chi_{-23}}$, with the generalized Bernoulli number $B_{3,\chi_{-23}} = 144$, is the standard normalization of the series with constant term $1$. Each lattice $M$ of $\mathcal G_1$ embeds into exactly three classes of $\mathcal G_2$, the sums $M \perp \mathcal O_E$, $M \perp \mathfrak p$, and $M \perp \bar{\mathfrak p}$.

The proof carries integrality place by place. `FactWtInt`, proved by `factWtInt` in `Formalism/LocalRingCardinality/RankBoundMonotoneInDimension.lean`, states $\mathrm{DGam}\cdot w_i(c) \in \ZZ$ for every class $c$ at every level. The working version of [[t-df-chain]] is `chain_ge` in `Formalism/SharpRestriction/Divisibility/OrbitPlaces.lean`, used by `compose`: if step $j$ carries every lattice point to a multiple of a point integral at a place $w$, by a scalar of valuation at least $e_w s_j$ at $w$, with $e_w$ the ramification index recorded for $w$, then the $m$-fold chain does the same with valuation at least $e_w(s_1 + \dots + s_m)$. `PeriodClassSumWeyl` (in `Formalism/SharpRestriction/Divisibility/WeightDegreeSizes.lean`, the field `aPer0` of the record `HypsAlt`) says that every value $y$ of the period pairing at the points of a lattice `ptLat` fixed by the datum, against the forms of a fixed space, is an algebraic number with, at every place $w$ of the datum's set of places, of residue characteristic $p$, either $y = 0$ or valuation at least $-e_w\, v_p(\mathrm{DGam})$. Our reading is that $\mathrm{DGam}$ times every such period is integral at those places. How the chain's divisibility and integrality (`ThmP`, `DGam`, `chain_ge`, `PeriodClassSumWeyl`, and the exponents of `LeafDepthGood`) feed the divisibility inequality `DIV` of the record `SizeData₂` was not traced, in this chapter, in [[multiplicity-from-lifts]], or in [[integrality-and-galois]].

## Where the formal proof's chain lives {#df-code}

The formal proof builds its chain on spaces of the same kind as $X_0$, $X_1$, $X_2$, over a CM field that is part of the datum at each scale, and with ranks that grow by much more than one at each step. Unlike the toy chain, the record contains no embedding of $X_j$ in $X_{j+1}$: the spaces are tied together only by the kernels of the lifts.

```lean
  X : ℕ → HSpace E
  X_sig : ∀ j, (X j).SigOK
  X_rank : ∀ j, j ≤ R.m → (X j).rank = R.N j
  X_def : ∀ j, j ≤ R.m → (X j).IsDefinite
```

::: lean {decl="Formalism.BasicNotions.Spaces" file="Formalism/LocalRingCardinality/DataSpaces.lean"}
The record `Spaces` asks for Hermitian spaces $X_j$ over $E$ that are totally definite of rank $N_j = N_0 + j(c+1)$ for $0 \le j \le m$, where `Ranks.N j = R.k + j * (R.t + 1)` in `Formalism/LocalRingCardinality/Params.lean`, so that $N_0$ is the code's `R.k` and $c$ is the code's odd integer `t` (the page keeps $k$, $t$, and $T$ for other things), together with indefinite spaces (the fields `Y j`, `W j`, `V j`) used for the periods and the rows.
:::

The forms on the classes of $X_j$ and the kernels are fields of `ColumnChain`, and the chain is `chainOpM`, the version of `chainOp` whose kernel entries are linear maps between value spaces.

```lean
noncomputable def wt (i : ℕ) (c : C.cls i) : ℂ := ((Nat.card (C.stab i c) : ℕ) : ℂ)⁻¹

noncomputable def Kmap (i : ℕ) (L : C.cls i) (L' : C.cls (i + 1)) :
    (C.Y i → ℂ) →ₗ[ℂ] (C.Y (i + 1) → ℂ) :=
  (C.rhoDet i L * C.rhoDet' i L') • ((C.divDe i).comp ((C.unf i L L').comp (C.sharp i)))

noncomputable def col (φ : C.cls 0 → C.Y 0 → ℂ) : C.cls R.m → C.Y R.m → ℂ :=
  Formalism.ThetaLiftIndependence.chainOpM C.wt C.Kmap R.m φ
```

In ordinary terms, the weight of a class $c$ at level $i$ is $1/\abs{\mathrm{stab}_i(c)}$, and the kernel from class $L$ at level $i$ to class $L'$ at level $i+1$ is
$$
K_i(L, L') = \rho_i(L)\,\rho'_i(L')\cdot \Delta_{i+1}^{-1}\circ \mathrm{unf}_i(L, L') \circ \Delta_i^{\sharp},
$$
where $\rho_i, \rho'_i$ have absolute value $1$, $\Delta_i^\sharp$ and $\Delta_{i+1}$ multiply each coordinate by products of powers of the nonzero normalizing numbers `de`, and $\mathrm{unf}_i(L, L')$ is a linear map between the value spaces. So `col φ` is [[eq-df-chain]] with vector values, and `colTo_eq` in `Development/AbelianVarietyTheory/Definitions/LatticeFrames/FiniteDimensionalMram.lean` proves that iterating the one-step lift $j$ times gives `chainOpM C.wt C.Kmap j`. The datum fixes $\rho_i(c) = \tilde\mu_{i+1}(\det c)^{-1}\chi_D(\det c)^{-N_{i+1}/2}$ and $\rho'_i(c) = \tilde\mu_{i+1}(\det c)\,\chi_D(\det c)^{N_i/2}$ (`D7.rhoDet_eq_inv_muTilde_chiD_pow`), characters of a group of determinant classes.

Our reading, which the code does not state, is that $\mathrm{unf}_i(L, L')$ is the theta kernel between the class $L$ of $X_i$ and the class $L'$ of $X_{i+1}$, a matrix-valued version of the embedding counts $K(L, M)$ of [[df-lift]], and that the characters $\tilde\mu_{i+1}$ are the Hecke characters $\mu_j$ of the note's $\pi \mapsto \pi \boxplus \mu_j[t]$. The field `unf` is an abstract field of the record `ColumnChain`, and we found neither a theorem that identifies it with a coefficient of a theta series nor one that builds the datum's chain from actual lattices in the spaces $X_j$. What the page can say with the code behind it is that the chain has finite class sets, weights $1/\abs{\mathrm{stab}}$ cleared by `DGam`, a kernel of the shape of `Kmap`, and the integrality properties above.

The sizes are set by `RankVal` in `Development/AbelianVarietyTheory/Definitions/GlobalTwisting/PairRowIffQdRows.lean`, which ties the ranks to the scale $x$ of [[landau-endgame]], with $\delta_1 = x^{-\varepsilon/8}$:

```lean
def RankVal (s : Scale) (R : Ranks) : Prop :=
  (s.x ^ (2 + 8 * s.eps) ≤ (R.n : ℝ) ∧ (R.n : ℝ) ≤ 2 * s.x ^ (2 + 8 * s.eps)) ∧
  (Real.sqrt (s.x * s.delta1) ≤ (R.m : ℝ) ∧ (R.m : ℝ) ≤ 2 * Real.sqrt (s.x * s.delta1)) ∧
  (s.x ^ (9 / 2 + 10 * s.eps) ≤ (R.k : ℝ) ∧ (R.k : ℝ) ≤ 2 * s.x ^ (9 / 2 + 10 * s.eps)) ∧
  R.r + R.t = 8 * R.f * R.r + 4 + TOv s * nWv R s
```

| Quantity | In this chapter's toy chain | In the formal proof at scale $x$ |
| --- | --- | --- |
| CM field $E$ | $\QQ(\sqrt{-23})$ | part of the datum at each scale, unramified over $E^+$ at every finite prime (`CMData`) |
| length of the chain $m$ | $2$ | between $x^{1/2-\varepsilon/16}$ and $2x^{1/2-\varepsilon/16}$ |
| rank of $X_0$ | $1$ | $N_0$, between $x^{9/2+10\varepsilon}$ and $2x^{9/2+10\varepsilon}$ |
| rank added per step | $1$ | $c + 1$, fixed by $(N_0+m-1) + c = 16n(N_0+m-1) + 4 + \lceil x^{377}\rceil\, n_W$, about $x^{398.5+58\varepsilon}$ |
| classes at level $0$ | $3$ | $\mathrm{mass}_I(N_0)\cdot\mathrm{idx}(g_0, g_1)\cdot(P^{N_0} - 1)^{2n}$ under the hypotheses of `ClassNumberFormula₂` |
| weights | $\tfrac12, \tfrac18, \tfrac14, \tfrac1{12}, \dots$ | $1/\abs{\mathrm{stab}}$, cleared by `DGam` |

Here $n$, between $x^{2+8\varepsilon}$ and twice that, is the order of the datum's finite abelian frame group $A$, defined in [[d-ml-rankval]] (`Frame.ord`, which `RankVal` reads as `R.n`); earlier in this chapter $n$ was a dimension or an index, and from here on in Part IV it is this order. And $n_W$ is the explicit integer `nWv` that [[d-ml-rankval]] writes out. The fourth row is our arithmetic from `RankVal`, up to constant factors: the term $\lceil x^{377}\rceil n_W$ dominates, and it is about $40n^2N_0^4x^{377+2\varepsilon}/m$. The top rank $N_m = N_0 + m(c+1)$ is then about $x^{399+58\varepsilon}$, as in the full scale dictionary [[ml-scales]]. The class counts are of the size of $(P^{N_0} - 1)^{2n}$, with $P$ the large auxiliary prime (the code's `T`) of that dictionary. No one will write these matrices down, and the formal proof states only their shape, their integrality, and the ranks of the maps they define.

::: figure {#f-df-scale viz="chain-scale" height="380"}
At the proof's scale the chain is short compared with the spaces it connects: about the square root of the scale many lifts, between spaces whose ranks are large powers of the scale.

```vizspec
Purpose: give the scale dictionary of the chain of definite spaces as a picture.
Scene: log-log axes, horizontal log10(x) from 2 to 12, vertical log10 of a quantity from 0 to 120. Draw four
  bands (lower and upper bound shaded between them): chain length m between x^(1/2 - eps/16) and
  2 x^(1/2 - eps/16) (teal); starting rank N_0 between x^(9/2 + 10 eps) and 2 x^(9/2 + 10 eps) (blue);
  frame order n between x^(2 + 8 eps) and 2 x^(2 + 8 eps) (muted); the rank added per step, about
  40 x^(398.5 + 58 eps) (gold dashed line, the value 40 n^2 N_0^4 x^(377 + 2 eps) / m at the lower ends of
  n, N_0, and m, clipped at the top edge with an upward arrow labeled
  "x^398.5" once it leaves the plot). Draw sqrt(x) as a thin violet reference line.
Controls: slider eps from 0.001 to 1/52 (default 0.01); a draggable vertical cursor at log10(x) that shows the
  four values in a readout, in scientific notation.
Motion: bands redraw as eps changes.
Reader takeaway: the chain length stays near sqrt(x) while the ranks it connects grow like x^(9/2) and,
  after one step, like x^398.5.
```
:::

## What the chain is for {#df-next}

Forms are now vectors, lifts are matrices, and a chain of $m$ lifts is the product [[eq-df-chain]]. Nothing here says why the chain has length about $\sqrt x$, or how a product of matrices stands in for a function vanishing to order $m$. That is the subject of [[multiplicity-from-lifts]], which reads the output of the chain through periods, restrictions of the last form to a smaller unitary group, and turns Stepanov's degree count into a statement about the rank of the map from forms on $X_0$ to those periods.

::: symbols
| Symbol | What it is | Kind | Where it lives |
| --- | --- | --- | --- |
| $E$, $E^+$, $\bar a$ | CM field, its totally real subfield, conjugation | field, automorphism | [[d-df-cm]] |
| $\omega$ | $(1+\sqrt{-23})/2$, with $\omega^2 = \omega - 6$ | algebraic integer | [[df-rings]] |
| $\mathfrak p, \bar{\mathfrak p}$ | the primes $(2, \omega)$ and $(2, 1-\omega)$ above $2$ | ideals of $\mathcal O_E$ | [[df-rings]] |
| $h$, $J$ | Hermitian form and its matrix | form, matrix | [[d-df-hermitian]] |
| $U(X)$ | unitary group of $X$ | group | [[df-hermitian]] |
| $L, M$, $\operatorname{Aut}(L)$ | lattices, automorphism group | module, finite group | [[d-df-lattice]], [[d-df-class-genus]] |
| $h_{\mathfrak a}$ | the form $\bar xy/N(\mathfrak a)$ on the ideal $\mathfrak a$ | form | [[df-lattices]] |
| $w(L)$, $\operatorname{mass}(\mathcal G)$ | $1/\abs{\operatorname{Aut}(L)}$, and its sum over a genus | rational numbers | [[d-df-mass]] |
| $\mathcal G_0, \mathcal G_1, \mathcal G_2$ | genera of $\mathcal O_E$, $\mathcal O_E^2$, $\mathcal O_E^3$ | finite sets of classes | [[df-rank-two]], [[df-chain]] |
| $r_L(n)$, $\theta_L$ | representation numbers and theta series | integers, modular form | [[d-df-theta]] |
| $\chi_{-23}$ | the character $n \mapsto (n/23)$ | Dirichlet character | [[df-mass]] |
| $\mathcal A(\mathcal G)$, $\langle\cdot,\cdot\rangle$ | forms on a genus, weighted inner product | vector space, inner product | [[d-df-forms]] |
| $\xi$ | class group character with $\xi(\mathfrak p) = e^{2\pi i/3}$ | function on 3 classes | [[df-forms]] |
| $A_{\mathfrak p}$ | neighbor matrix at $\mathfrak p$ | integer matrix | [[d-df-neighbor]] |
| $a_\pm$ | $(-1 \pm \sqrt5)/2$ | real numbers | [[df-hecke]] |
| $K(L, M)$, $\mathcal L_K$ | embedding count, lift | integer matrix, linear map | [[d-df-lift]] |
| $W_j$, $D_j$ | diagonal weight matrix, common denominator | matrix, integer | [[eq-df-chain]], [[t-df-chain]] |
| $N_0$, $c$, $N_j$ | rank of $X_0$ (the code's `R.k`), the odd integer with rank step $c+1$ (the code's `t`), rank $N_0 + j(c+1)$ of $X_j$ | integers | [[df-code]] |
| $n$, $A$ | order of the frame group $A$ (`Frame.ord`), from [[df-code]] on | integer, finite abelian group | [[df-code]], [[d-ml-rankval]] |
| $P$ | the large auxiliary prime (the code's `T`) | prime | [[df-code]] |
:::

::: recap
- A CM field has a conjugation that is complex conjugation under every embedding, and a Hermitian space over it is totally definite when its form is definite under every embedding. Then every lattice has finitely many automorphisms and every genus finitely many classes ([[t-df-finite]]).
- Each class carries the weight $1/\abs{\operatorname{Aut}}$, the weights sum to the mass, and Siegel's formula computes the mass from local data ([[t-df-siegel-mass]]). For the three rank-one classes over $\QQ(\sqrt{-23})$ the mass is $\tfrac32$, which is Dirichlet's class number formula.
- The weighted mean of the theta series of a genus is an Eisenstein series ([[t-df-siegel-weil]]), checked here for genera with $3$, $9$, and $30$ classes.
- An automorphic form on a definite unitary group is a vector indexed by classes ([[d-df-forms]]). Hecke operators are neighbor matrices, adjoint for the weighted inner product ([[t-df-adjoint]]), and a theta lift is a lift matrix of embedding counts whose adjoint sends constants to constants ([[t-df-lift-constant]]).
- The formal proof's chain `col = chainOpM wt Kmap m` is a product of $m$ weighted kernels on the class sets of totally definite spaces $X_0, X_1, \dots, X_m$ (`Spaces.X_def`), integral after one denominator per step ([[t-df-chain]]), and the identification of its kernel `unf` with a theta kernel is our reading. [[multiplicity-from-lifts]] reads the chain through periods and plays its divisibility against size.
:::
