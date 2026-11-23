---
id: two-proofs
title: Two proofs, one theorem
part: 5
summary: After this chapter you can say exactly what each of the two proofs of 2026 establishes, set them side by side step by step with a pointer to where the page showed each step, name the few places where they touch, say how far this page unfolded each, list the open ends their sources name, and answer the question of chapter 1 with numbers.
needs: [trace-to-grh, inputs-and-assembly]
---

::: plain
Two proofs of the Riemann Hypothesis appeared on the same day, built from different mathematics. The first computes the trace of one operator twice, in a topology too coarse to see zeros far from the critical line, and finds that nothing was lost. The second bounds a smoothed count of primes from above, using a chain of transformations between spaces of automorphic forms in place of the derivative that the whole numbers lack. This chapter sets the two side by side, says how far this page took each, and answers the question the page began with.
:::

A reader who has come this far holds two proofs of one theorem and will ask what each proves, how they differ, whether they are secretly one argument, and how much of each the reader has actually followed. This chapter answers those questions and introduces no new mathematics. Every statement in it points to the chapter where the page established it. The sources are the ones the page has used throughout: A. M. Masullo's draft monograph for the first route [@masullo], and for the second the four-page note of L. Alpoge [@alpoge-note] with the Lean formalization by Alpoge and Claude [@alpoge-lean]. The monograph and the note were read on 2026-11-20, and the Lean tree on 2026-11-20 and 2026-11-21. As in Part III, the first route is called Route M, and as in Part IV the second is called Route A.

The comparison itself is ours. Which steps we set beside each other, and what we say the two routes share, is the page's synthesis and not a claim of either source. Each section below says so where its synthesis begins. Where a sentence only places two results of the page next to each other, it cites both and adds nothing.

## One theorem, two reaches {#tp-reach}

Both proofs end at the same sentence about $\zeta$: every nontrivial zero has real part $\tfrac12$ ([[t-tg-rh]], [[t-ra-main]]). Both also prove it for every Dirichlet L-function. They differ in how far beyond that they reach, and in the form in which the statement exists.

| | Route M (Part III) | Route A (Part IV) |
| --- | --- | --- |
| Source | A draft monograph of 940 pages [@masullo] | A four-page note [@alpoge-note] and a Lean 4 formalization of 175,187 files [@alpoge-lean] |
| Functions covered | $L(s,\chi)$ for every unitary Hecke character $\chi$ of every number field $F$: $\zeta$, every Dirichlet L-function, every Dedekind zeta function, and the L-functions of Hecke's Grössencharaktere | $\zeta$ and $L(s,\chi)$ for every Dirichlet character $\chi$ of every modulus, primitive or not |
| The statement | Every nontrivial zero of $L(s,\chi)$ has real part $\tfrac12$ ([[s-tg-general]]) | The five theorems of `Main.lean`, carried by one: $L(s,\chi)\ne0$ for $\Re s>\tfrac12$, except $s=1$ for the principal character ([[ra-proved]]) |
| Where the source states it | In prose, in the introduction and in a letter to P. Sarnak [@masullo, pp. 28 to 30, 53 to 55], with the generality asserted on p. 6; the chapter meant to state it is a stub ([[tp-form]]) | As five Lean theorems with no hypotheses [@alpoge-lean] |
| Rungs of the ladder of [[s-rh-table]] | All four | The first two |
| Consequences for primes | Primes up to $x$ ([[t-rh-von-koch]]) and in progressions ([[t-rh-ap]]) to within $\sqrt x$ up to logarithms; prime ideals of every number field and Chebotarev's theorem with errors of the same size ([[s-rh-fields]]) | The first two of these |

The rungs are those of the closing table of chapter [[what-rh-says]]: the hypothesis for $\zeta$, the generalized hypothesis for Dirichlet characters ([[d-rh-grh]]), and the two forms of the extended hypothesis ([[d-rh-erh]]). Chapter [[route-a-plan]] adds, as a remark of its own and not of the code, that Route A also gives the hypothesis for the Dedekind zeta function of every abelian number field, a product of Dirichlet L-functions ([[eq-rh-dedekind-gauss]] is the smallest case). On the extended hypothesis the note says only "I expect, with more time, the Extended Riemann Hypothesis too" [@alpoge-note].

## Side by side {#tp-side}

This section is our comparison. The table gives it in one view, and the subsections that follow take its rows in turn, each pointing to where the page showed what it says.

| | Route M | Route A |
| --- | --- | --- |
| What it studies | Functions on the idele class group modulo theta sums ([[t-tt-divisor]]) | Automorphic forms on definite unitary groups ([[d-df-forms]]); Galois representations and Galois cohomology ([[t-ig-row0b]], [[t-cw-vwin]]) |
| Where the hypothesis is forced | A topology that sees only the zeros in a strip, against a complete prime side ([[t-sp-spectral-trace]], [[t-tf-trace-formula]]) | A one-sided bound on windows, fed to a windowed Landau theorem ([[t-le-windowed]]) |
| Where the one half comes from | The weight that matches the two measures ([[s-tf-half]]) | The square-root bound and a chain of length about $\sqrt x$ ([[t-le-contract]], [[d-ml-rankval]]) |
| What plays Weil's explicit formula | The geometric side of the Trace Formula ([[s-tf-weil]]) | The explicit formula of the smoothed sum ([[t-rh-smooth]], [[t-le-poles]]) |
| Positivity | Not used, and not usable, by the introduction; one subsection that the author flags for correction says otherwise ([[tp-positivity]]) | In the note's words; in the code, an upper bound ([[ra-steps]]) |
| Function fields | The method does not apply ([[s-tg-function-fields]]) | Descends from Stepanov ([[ra-descendant]]) |
| Size | 940 pages | 175,187 files ([[s-ia-shape]]) |
| Form | A draft with a stub for its last chapter ([[tp-form]]) | A formal proof read through its statements ([[s-ia-coverage]]) |

:::: figure {#f-tp-chains viz="tp-two-chains" height="600"}
Both proofs start from the explicit formula that joins the primes to the zeros and end at the same statement about zeta and the Dirichlet L-functions, along two chains built from different mathematics, and only the first continues to every Hecke L-function.

```vizspec
Purpose: show the two routes as parallel chains with a shared start and a shared end, each link opening to
  its one-sentence content and the chapter where the page explains it.
Scene: a top node spanning both columns, muted outline, label "Explicit formula: primes on one side, zeros on
  the other" (chapters explicit-formula and weil-positivity). Two vertical chains of seven rounded rectangles
  below it, the left chain "Route M" with blue outlines, the right chain "Route A" with gold outlines, each
  node joined to the next by a downward arrow, and the first node of each chain joined to the top node.
  A bottom node spanning both columns, violet outline, label "Every nontrivial zero of zeta and of every
  Dirichlet L-function has real part 1/2" (anchors t-tg-rh and t-ra-main). Under the left chain only, a
  further node with a dashed blue outline joined to the bottom node by a dashed arrow, label "and every
  L-function of a unitary Hecke character of a number field" (anchor s-tg-general).
Node data (label | sentence | chapter title | anchor):
  M1 | Theta sums | Functions on the positive reals modulo weighted theta sums are the jets of Mellin
    transforms at the zeros, and convolution acts on them with one eigenvalue per zero. | Tate's thesis as
    theta and zeta | t-tt-divisor
  M2 | Strip topology | In the space W_a only the zeros with |beta - 1/2| < a survive in the quotient, so the
    spectral trace sees only the strip. | Choosing the topology | t-sp-spectral-trace
  M3 | Primes as circles | Deleting the multiples of p leaves functions on a circle of length log p, where the
    trace of convolution is log p times the sum of phi(p^k), zero beyond the support. | Primes as circles |
    t-pc-orbital-trace
  M4 | Sieve | Cutting the kernel along the primes beyond Y, one at a time, leaves only an S-local kernel. |
    Cutting the kernel along the primes | t-ck-remnant
  M5 | S-local trace | Connes's computation gives Weil's local terms at the places of S, and only the weight
    1/2 matches the two measures. | The local trace and the Trace Formula | s-tf-half
  M6 | Trace Formula | Weil's prime side equals the pole terms minus the zeros in the strip, for every
    a > 0. | The local trace and the Trace Formula | t-tf-trace-formula
  M7 | Endgame | Weil's formula has every zero and the Trace Formula only those in the strip, so no zero lies
    outside any strip. | From the Trace Formula to the hypothesis | t-tg-subtraction
  A1 | Smoothed sum | G_0 and g_chi are a constant, at most a logarithm, and one wave per zero, and a zero
    right of the line pushes them up somewhere. | The last mile | t-le-twisted
  A2 | Forms you can hold | On a totally definite unitary group a form is a vector indexed by lattice
    classes and a theta lift is a matrix. | Forms you can hold | t-df-chain
  A3 | Chain of lifts | About sqrt(x) lifts, read through periods, with the product formula as the degree
    budget. | Multiplicity without derivatives | d-ml-rankval
  A4 | Galois input and the count | Galois representations exist, and a count of inert prime powers is a
    combination of smoothed sums whose bound gives G_r(x) <= x^(1/2 + 9 eps). | Paying for the chain |
    t-ig-core
  A5 | Window | Locally trivial Galois cohomology is small on windows of scales found by a pigeonhole. |
    The arithmetic residue | t-cw-vwin
  A6 | Windowed Landau | An upper bound on windows [Y, Y^(3/2)] for every small eps forbids zeros to the
    right of 1/2. | The last mile | t-le-contract
  A7 | Assembly | The published inputs are restated and proved in the tree, and the three inputs meet in
    one theorem. | What the proof stands on | t-ia-assembly
Controls: hover or tap a node to open a panel under the drawing with its sentence, the chapter title, and a
  link to #anchor. A toggle "show contacts" draws three dotted red connectors between the chains, each with a
  small label: "functional equation" between M7 and A6, "Tate's thesis" between M1 and A7, "test functions on
  one side of 1" between M7 and A1. A second toggle "only what the two share" dims every node not touched by
  a contact.
Motion: on load the two chains draw downward node by node in step (150 ms per node); reduced motion draws at
  once. Opening a panel highlights the path from that node to the bottom node.
Layout: below 600 px, one column in the order top node, M1 to M7, the Hecke node, A1 to A7, bottom node;
  contacts become a list under the drawing.
Reader takeaway: the same start and the same end, different mathematics in between, a handful of named
  contacts, and a reach that differs only in the last box.
Data: the node data above.
```
::::

### What each route studies {#tp-objects}

Route M studies one operator on one space. Over $\QQ$ the space is the rapidly decaying functions on the positive reals modulo the weighted theta sums $V_g=t^{1/2}\Theta_g$, and the divisor exact sequence identifies that quotient with the jets of Mellin transforms at the zeros of $\zeta$ ([[t-tt-divisor]]). Convolution by a test function $\varphi$ acts there with one eigenvalue $M\varphi(\rho-\tfrac12)$ per zero ([[t-tt-operator]]), and the whole route computes the trace of that operator a second time, from the primes. For a number field the positive reals become the idele class group ([[t-ad-class-group]]).

Route A studies no single operator. At each scale $x$ it builds totally definite Hermitian spaces $X_0,\dots,X_m$ over a CM field, automorphic forms on their unitary groups, which are vectors indexed by lattice classes ([[d-df-forms]]), and a chain of $m$ theta lifts, a product of weighted matrices ([[d-ml-chainop]]). It also draws on Galois representations of cuspidal forms over CM fields (`Row0b`, [[t-ig-row0b]]) and on the groups $\text{Sha}^1(E,\QQ_\ell/\ZZ_\ell(-k))$ of abelian CM fields (`VWin`, [[t-cw-vwin]]). The function the endgame reads is the combination $G_r$ of smoothed prime sums ([[d-le-gr]]).

### Where the hypothesis is forced {#tp-forced}

In Route M the hypothesis is forced by a comparison of two identities. In the Hardy and Sobolev space $W_a$, evaluating a Mellin transform at $z_0$ is continuous exactly when $\lvert\Re z_0\rvert<a$ ([[t-sp-evaluation]]), so the quotient by the theta sums keeps only the zeros with $\lvert\beta-\tfrac12\rvert<a$ and the spectral trace sums over those alone ([[t-sp-spectral-trace]]). The geometric computation of the same trace, carried out inside $W_a$ one prime at a time, still produces Weil's complete prime side ([[t-ck-slices-vanish]], [[t-tf-trace-formula]]). That prime side knows every zero, so subtracting the Trace Formula from Weil's explicit formula leaves the zeros outside the strip summing to zero against every admissible test function, which forces them to be absent ([[t-tg-subtraction]]). The source calls the hypothesis "a topological phenomenon" [@masullo, §1.4.8, p. 31] ([[s-tg-topology]]).

In Route A the hypothesis is forced by an inequality. A zero $\rho$ adds the wave $-X^\rho/(\rho(\rho-1))$ to the smoothed sum with its main term removed, a real zero pushes the sum up at every $X$, and a complex pair pushes it up at its crests ([[le-sign]]). So an upper bound alone sees every zero to the right of its exponent. The construction delivers such a bound, $G_r(x)\le x^{1/2+9\varepsilon}$, only for scales in windows $[Y,Y^{3/2}]$ ([[le-why-windows]]), and the windowed Landau theorem, which the code proves and chapter [[landau-endgame]] reconstructs in full, turns a bound on windows into a zero-free half-plane ([[t-le-windowed]]). One application per $\varepsilon$, with no bootstrap, gives every half-plane $\Re s>\tfrac12+9\varepsilon$ ([[t-le-contract]]).

As our reading of these two pages: in Route M an off-line zero would be a term present in one formula and absent from another, which chapter [[trace-to-grh]] put as an identity compared with an identity ([[s-tg-positivity]]). In Route A an off-line zero would be a wave that eventually rises through a ceiling on some window, detected by the growth of Taylor coefficients of a Laplace transform ([[t-le-lower]]). The first is an equality that cannot hold, the second an inequality that would be broken.

### Where the one half comes from {#tp-half}

In Route M the one half is forced by one computation. The source carries the exponent of the weight on theta sums as a parameter $w$ through the earlier steps and finds that the $S$-local trace needs $w=\tfrac12$, because only then is $\lvert x\rvert^{2w}$ times the multiplicative measure the additive measure on which Fourier analysis lives ([[s-tf-half]]). The source draws the conclusion in one line: "This forces the 1/2 in the very statement of GRH" [@masullo, p. 16]. Chapter [[trace-formula]] added a consistency check of its own: a trace formula with $w<\tfrac12$ would contradict the existence of the zero $\tfrac12+14.1347i$, and one with $w>\tfrac12$ would give only a weaker zero-free region.

In Route A the endgame does not care about the one half. The windowed Landau theorem holds for every exponent $0<\alpha<1$ ([[t-le-windowed]]), and its only use of the exponent is the pole of the allowance at $\alpha$ ([[le-classical]]). The one half enters through the size of what the rest of the proof can bound. The bound that reaches the endgame is $x^{1/2+9\varepsilon}$ ([[t-le-interface]]). Inside it, the characters that cannot be kept are bounded by $x^{1/2+\varepsilon}$ because twisted prime sums have square-root size on average over auxiliary primes, a mean-square argument ([[t-ig-pairex]]), and the step from the count of inert prime powers to $G_r$ assumes a chain length between $x^{1/2-\varepsilon}$ and $x^{1/2+\varepsilon/2}$ ([[ig-to-gr]]), which `RankVal` fixes as $\sqrt{x^{1-\varepsilon/8}}\le m\le2\sqrt{x^{1-\varepsilon/8}}$ ([[d-ml-rankval]]). The note's account of the choice is that for "the von Mangoldt sum of length $X$" the chain length was $\sqrt X$, "in view of each mimicking multiplicity" [@alpoge-note]. Chapter [[route-a-plan]] compared this, as an analogy of its own, with the multiplicity $\sqrt q$ in Stepanov's proof, matched to an error of size $\sqrt q$ ([[ra-chain]]).

So the two halves have different origins, and this is our reading of what the page shows. In Route M the one half is a fact about measures, true before any estimate and the same for every L-function. In Route A it is the size of a ceiling and of a chain, and the page shows where the square root enters those sizes, not a step at which any other exponent would fail. The page did not unfold the proofs that tie the chain's length to the inequalities of the count ([[ml-gaps]]).

:::: figure {#f-tp-half viz="tp-one-half" height="460"}
In the first proof one half is the only weight at which the multiplicative measure becomes the additive one, while in the second it is the exponent of the square-root ceiling that the endgame consumes, and the chain behind that ceiling has length about the square root of the scale.

```vizspec
Purpose: set the two origins of the one half next to each other, each with its own control.
Scene: two panels side by side (stacked below 700 px), each with a small muted heading inside the panel
  area: "Route M: measures" on the left, "Route A: sizes" on the right.
  Left panel: horizontal axis x in (0, 4], vertical axis [0, 3]. Draw the density x^(2w - 1) in gold and the
  constant 1 (the additive measure) as a dashed blue line; shade the region between them pale red. Under the
  axes a readout: "integral of |x^w g|^2 dx/x = integral of |g|^2 x^(2w-1) dx", followed by "equal to the
  integral of |g|^2 dx for every g" in teal when w = 1/2 and "not equal in general" in red otherwise.
  Right panel: horizontal axis log10 x from 2 to 12, vertical axis log10 of the plotted quantity from 0 to 12.
  Draw sqrt(x) as a dashed violet line; the allowance x^(1/2 + 9 eps) as a red line; the chain length band
  between x^(1/2 - eps/16) and 2 x^(1/2 - eps/16) as a gold band; the proved size of the zero noise when all
  zeros are on the line, c0 sqrt(x) with c0 = 0.0461914, as a teal line. Optionally, when the toggle
  "hypothetical zero" is on, the amplitude of the wave of a zero pair beta +- 14i,
  2 x^beta / |rho (rho - 1)|, as a dotted teal line, with a red dot where it first exceeds the allowance.
  Under the axes a readout: "the endgame excludes every zero with real part above 1/2 + 9 eps = ...".
Controls: left, slider w from 0 to 1 (default 0.3, snap at 0.5). Right, slider eps from 0.001 to 0.019
  (default 0.01; the code requires eps < 1/52); toggle "hypothetical zero"; slider beta from 0.5 to 0.95
  (default 0.8), active only with the toggle.
Motion: as w reaches 1/2 the gold density flattens onto the blue line and the red shading vanishes. As eps
  shrinks the red allowance and the gold band close in on the violet line from above and below.
Reader takeaway: in one route the one half is the unique weight at which two measures agree; in the other it
  is the square root that the bound and the chain length both approach as eps goes to 0.
Check: eps = 0.01, x = 1e6: chain length between 991.4 and 1982.8; allowance x^0.59 = 3467; c0 sqrt(x) = 46.19.
  Amplitude for beta = 0.8, gamma = 14: 2/|rho(rho - 1)| = 0.010186.
```
::::

### What plays the role of Weil's explicit formula {#tp-explicit}

In Route M, Weil's explicit formula is the partner in the final comparison. The left side of the Trace Formula, the archimedean term plus the prime sum, is the left side of Weil's formula term for term, and the two right sides differ only in which zeros they contain ([[s-tf-weil]]). Chapter [[trace-formula]] warned that the Trace Formula is not the explicit formula with terms dropped by hand: both identities hold at once, for the same test functions.

In Route A the explicit formula is that of the smoothed sum. Chapter [[what-rh-says]] proved that $S(X)$ is $X\log X-(1+\gamma_E)X+\log2\pi$ minus an absolutely convergent sum over zeros ([[t-rh-smooth]]), so that $G_0$ is pure zero noise ([[eq-le-g0-formula]]), and the note's step 5 is exactly this function [@alpoge-note]. The code uses the formula only through its transform: the Laplace transform of a positively weighted family has a simple pole at each zero and is analytic elsewhere to the right of the imaginary axis ([[t-le-poles]]). The explicit formula for the twisted sums $g_\chi$ is ours ([[t-le-twisted]]). A second identity of the same kind sits upstream, the finite-group explicit formula, which rewrites a weighted count of inert prime powers as a combination of smoothed sums over the characters of a finite group ([[t-ig-balance]]).

### Positivity {#tp-positivity}

Route M, as the page followed it, proves no inequality. The source's introduction says in a paragraph of its own that Weil's criterion is not used, and explains why it could not be: the Trace Formula needs $\varphi(1)=0$, while every function of Weil's form $f*\tilde f$ has value $\int\lvert f\rvert^2>0$ at $1$ ([[s-tg-positivity]]). The body is not consistent with this. Its subsection 14.1.2, whose footnote says the subsection needs correcting, calls the main theorem on zeros a consequence of the Trace Formula "combined with the Positivity Criterion" [@masullo, p. 528], and p. 533 says the same. The main theorem is a stub in chapter 13 ([[tp-form]]), so the body gives no deduction to check, and the page followed the introduction, whose endgame uses no positivity.

In Route A the note writes several steps as positivity of Weil's functional $W$ of [[d-wp-functional]]: step 4, "$W(\mathbb 1_S)\ge0$ via a determinant", and step 6, "$W(\mathbb 1_{(0,1]}+(\sim X^\eta)\mathbb 1_{(0,1/X]})\ge0$ gives $>1-\eta$" [@alpoge-note]. The code never states that $W$ is nonnegative on any test function ([[ra-steps]]). What it proves on the spine is an upper bound with an allowance, and the positivity it uses is of two other kinds: every weight of the family in the windowed theorem is positive, so that no zero can cancel another ([[d-le-family]], [[le-gr]]), and Landau's principle that a transform of a function of one sign cannot cancel before its first real singularity ([[le-classical]]). Chapter [[landau-endgame]] matched the note's step 6 to the code's bound as its own reading, through the transform $1/(s(1-s))$ of the indicator paired with itself. So neither proof, as this page read it, establishes the inequality $W(f*\tilde f)\ge0$ of Weil's criterion [[t-wp-criterion]] as such. Route A proves an inequality about primes of the kind that the criterion made the goal ([[wp-hinge]]), and Route M proves an identity.

### Function fields {#tp-function-fields}

The two stances are opposite, and each source states its own. Masullo asks whether his method gives a second proof for curves over a finite field and answers no [@masullo, §14.2, pp. 534 to 536]: every Euler factor of a function field vanishes at the same points $2\pi ik/\log q$, so the orbital quotients of different primes overlap, and the only workable topology gives back Weil's explicit formula ([[s-tg-function-fields]]). Over $\QQ$, by contrast, the factors $1-p^{-s}$ of distinct primes share only $s=0$ ([[t-pc-polar]]). The note says its argument "is a descendant of Stepanov's" proof over function fields [@alpoge-note], and Part IV reads its chain of lifts as Stepanov's multiplicity rebuilt over $\ZZ$ ([[ra-descendant]], [[ml-ledger]]). Its toy setting, the identity $qN=M^k+R$, lives over a finite field and is not in the code ([[ra-toy]], [[ra-steps]]). So the first route draws its strength from what a function field lacks, an archimedean place and primes whose logarithms are independent, and the second from imitating what a function field has.

### How much mathematics, and of what kinds {#tp-size}

Pages of prose and lines of formal code that prove every published input cannot be compared directly, but rough sizes by region show where each proof spends its length. The page ranges are those of the monograph's chapters [@masullo].

| Route M: part of the monograph | Pages | What it holds |
| --- | --- | --- |
| Ch. 1, introduction and letter | 11 to 55 | The overview and the only written endgame |
| Ch. 2 to 4 | 57 to 220 | Adelic theta functions and Tate's thesis; Schauder bases on the toy circle |
| Ch. 5 and 6 | 221 to 310 | Topological vector spaces of theta functions; the divisor exact sequence |
| Ch. 7 and 8 | 311 to 394 | Orbital bases and orbital traces; periodic orbits |
| Ch. 9 and 10 | 395 to 474 | Hardy and Sobolev completions; the spectral side |
| Ch. 11 and 12 | 475 to 520 | The divisorial stratification; the $S$-local trace; the Trace Formula |
| Ch. 13 and 14 | 521 to 536 | The main theorems (a stub); complements, including function fields |
| Appendices A to E | 537 on | Background: algebraic number theory, analytic number theory with Weil's explicit formulas, locally convex topological vector spaces, Schwartz and Bruhat functions, and topological stacks |

| Route A: folder of the tree | Files | Lines | What it holds, read from names |
| --- | ---: | ---: | --- |
| `Development` | 141,928 | 12,232,663 | Abelian varieties, the automorphic arithmetic of the main chain, the automorphic spectrum, resolution of singularities, étale cohomology |
| `Formalism` | 18,254 | 3,200,748 | Analytic estimates, lattices, the zero-free machinery |
| `GroundTheory` | 8,507 | 1,119,138 | Heights, automorphic forms, Galois cohomology, global and local fields, $p$-adic Hodge theory |
| `ReciprocityTheory` | 3,845 | 563,016 | Reductive groups, Arakelov geometry, class field theory, Chebotarev |
| Other folders | 2,653 | 258,650 | Spectral geometry, real groups, stated automorphic inputs, `Main.lean` |

The second table is chapter [[inputs-and-assembly]]'s, with its five smallest folders added together ([[s-ia-shape]]). The areas differ as much as the sizes. Route M draws on Fourier analysis on the adeles, topological vector spaces and Schauder bases, Hardy spaces, measure theory on locally compact groups, Connes's $S$-local computation, and the classical analytic facts about $L$-functions: nonvanishing on $\Re s=1$, the convexity bound, and the count of zeros ([[s-tg-general]]). Route A draws on Hermitian lattices and their mass formulas, the theta correspondence and the seesaw, the branching rule of unitary groups, Galois representations of automorphic forms, Iwasawa theory and Galois cohomology, local Langlands for $\GL_n$, class field theory and Chebotarev, and a large geometric package of resolution, vanishing theorems, Arakelov geometry, and toroidal compactifications of Shimura varieties ([[s-ia-table]]). The note's own phrase is "An astounding amount of mathematics" [@alpoge-note].

### The form in which each exists {#tp-form}

Route M exists as a written draft. Its author says the introduction is unfinished and will be replaced, that writing is missing in several parts, and that "The math is complete" [@masullo, p. 6]. Chapter 13, which should state and prove the main theorems, is a stub: two of its sections are empty and its second theorem reads "Insert statement" [@masullo, pp. 521 to 522]. The section that should assemble the Trace Formula from its pieces is empty too, though the proof of the Trace Formula cites what it needs [@masullo, pp. 514, 520]. So the deduction of the hypothesis exists only in the introduction and the letter [@masullo, pp. 28 to 30, 53 to 55], and this page took its endgame from there. Chapter [[trace-to-grh]] found that one step of that endgame fails as stated, a bound on the archimedean term that grows like $\log(1/\delta)$ as the cutoff approaches $1$, and repaired it over $\QQ$ with a cutoff that stays fixed near $t=1$ ([[t-tg-rh]]). It noted that the same repair works over every number field, because every prime ideal has norm at least 2 ([[s-tg-general]]).

Route A exists as a formal proof with no prose behind it. The note explains that its author "decided to only present Lean" [@alpoge-note]. A text search of the tree finds no comments, no `sorry`, and no `axiom`, every file is in the import closure of `Main`, and the only prose in it is in the names ([[s-ia-integrity]]). This page read it through its statements: our reading unfolded five regions of it into ordinary mathematics, and chapter [[inputs-and-assembly]] lists what each region unfolded, read as statements only, or left unopened ([[s-ia-coverage]]). The repository did not build the tree, so the integrity counts are facts about the source files and not the verdict of Lean's kernel, and a build with the pinned versions is what would add that verdict ([[s-ia-integrity]]).

## What they share, and where they do not meet {#tp-share}

This section is our synthesis. It names the real points of contact, each tied to the chapters that show it, and then the places where the two routes simply do not meet. We do not claim a deeper unity than these.

### The explicit formula is the bridge in both {#tp-share-bridge}

Both proofs cross from primes to zeros on the bridge that Part I built: the explicit formula, in which each zero is a wave in the count of primes ([[explicit-formula]], [[t-wp-explicit]]). Route M uses Weil's form of it, for every test function vanishing at $1$, as the identity with which the Trace Formula is compared ([[eq-tf-weil]]). Route A uses the form for the smoothed sum, in which the waves are $-X^\rho/(\rho(\rho-1))$ ([[eq-le-g0-formula]]). Both also use the functional equation for the same purpose, to reflect a statement about the half-plane right of the line into the line itself (step 9 of [[t-tg-rh]], and [[t-le-five]]). And both reach the line through a family of half-planes indexed by a parameter that may be taken as small as we like: the half-width $a$ of the strip in Route M, and $\varepsilon$ in Route A, with each half-plane proved directly and none bootstrapped from another ([[t-tg-rh]], [[t-le-contract]]).

### Theta functions, of two different kinds {#tp-share-theta}

Both routes are built on objects called theta functions, and the shared name hides a difference. Route M's theta sums $\Theta_g(t)=\sum_{n\ne0}g(nt)$ are periodizations on the multiplicative group, functions on the positive reals or on the idele class group ([[d-tt-theta-sum]]), and their symmetry is Poisson summation ([[t-tt-riemann-roch]]). Route A's theta objects are theta series of lattices, generating functions of the norms of their vectors ([[d-df-theta]]), and theta lifts between unitary groups, built from the Weil representation of a symplectic group ([[df-weil]]). Poisson summation stands behind these too: the proof in the tree of the Siegel and Weil formula, an input of the assembly of theta integrals, runs Poisson summation for the Weil representation ([[s-ia-siegel-weil]]).

::: warning
The two kinds of theta function share an ancestor and nothing more on this page. A periodization $\sum_{n\ne0}g(nt)$ on $\RR_{>0}$ is not a theta lift between unitary groups, and a theta lift is not a periodization on the idele class group. Neither route's theta object is a special case of the other's.
:::

### Test functions on one side of 1 {#tp-share-sides}

Both routes feed the explicit formula test functions that live on one side of the point $1$ of the multiplicative line. Route M runs its sieve for test functions supported in $(1,Y)$ ([[eq-ck-support]]) and ends with the family $t^{-z}$ cut off below $t=1$ ([[d-tg-family]]). The smoothed sum of Route A has the weight $(X/n-1)_+$, which vanishes for $n\ge X$, so in the variable $n/X$ it lives on $(0,1]$; the note's step 6 writes its test functions as the indicators $\mathbb 1_{(0,1]}$ and $\mathbb 1_{(0,1/X]}$, though the code uses no indicator test functions ([[le-interface]]). This is a shared feature of the two texts, not a shared argument.

### Primes one at a time, or all at once {#tp-share-primes}

Route M handles the primes one at a time. Its sieve removes the multiples of one prime per step, each step acts on a circle of length $\log p$, and each step beyond the support has trace zero ([[t-ck-slices-vanish]]). The source explains why: an infinite Euler product, which handles all the primes at once, converges only in a fine topology, where it gives back Weil's explicit formula ([[s-ck-one-at-a-time]]). Route A handles all the prime powers at once, in one smoothed sum with the ramp weight $(X/n-1)$, combined over the characters of a cyclic group ([[d-le-gr]]) and, upstream, over the characters of a finite group ([[t-ig-balance]]). Individual primes enter Route A in a different role, as auxiliary primes chosen for their properties: the primes $\mathsf q$ and $\mathsf d$ whose twists have square-root bounds ([[t-ig-pairex]]), and the large prime $P$ at which forms are ramified ([[ml-scales]]).

### A zero is a pole in both endgames {#tp-share-poles}

In both endgames a zero shows itself as a pole of a transform of a prime sum. In Route M the prime side becomes $-\zeta'/\zeta(z+\tfrac12)$, with a pole at every zero ([[eq-tg-heuristic]]). In Route A the Laplace transform of the combined sum has a simple pole at every zero of every L-function of the family, with a positive weight ([[t-le-poles]]). What each route does with the pole differs. Route M compares with an identity whose other side is holomorphic there ([[t-tg-rh]]). Route A shows that a pole to the right of $\alpha$ makes Taylor coefficients grow faster than the bound on windows allows ([[t-le-key]], [[t-le-lower]]).

### Tate's thesis {#tp-share-tate}

Tate's thesis is the one published theory that both routes stand on. Route M is Tate's thesis done in families: its theta functions and their Mellin transforms are Tate's zeta integrals ([[tate-theta]]). Route A uses Tate's thesis as one input among many, for the continuation and nonvanishing at $s=1$ of Hecke L-functions, through the published statement `HeckeLEntireAndNonzeroAtOne` that the tree proves ([[t-ia-hecke]]). That the two routes touch here is chapter [[inputs-and-assembly]]'s reading ([[s-ia-tate]]).

### Where the routes do not meet {#tp-apart}

Most of each proof has no counterpart in the other, as far as this page shows. Route M uses no automorphic form beyond functions on the idele class group, no Galois representation, no Galois cohomology, no auxiliary function, and no count of multiplicity in Stepanov's sense. Route A uses no topology on a function space, no strip, no trace of an operator, no orbital basis, and no $S$-local computation. Even the word multiplicity means different things: in the note it is the order of vanishing of an auxiliary object, which Route A replaces by divisibility ([[ra-multiplicity]]), while in the monograph it is the multiplicity $m_\rho$ of a zero and the order of the poles of Euler factors ([[t-pc-polar]]). The two endgames share the reflection and the pole of [[tp-share-poles]], and nothing else. We know of no step of either proof that can be moved into the other.

## What this page compressed, and what it could not {#tp-ledger}

This section says exactly how far the reader's understanding now reaches. The tables list each route's main steps and whether the page proves the step in full for the rational numbers, states it with a pointer, or could not unfold it. A statement its source proves is proved either way; the tables measure only this page's explanation.

| Route M step | On this page | Where |
| --- | --- | --- |
| Adeles, the product formula, the idele class group of $\QQ$ | Product formula proved; Poisson summation on the adeles and the structure of the class group stated, after Tate and the source | [[adeles]], [[t-ad-poisson]], [[t-ad-class-group]] |
| Theta sums, their Mellin transform $2\zeta(s)Mg(s)$, and the functional equation | Proved | [[tate-theta]] |
| The converse theorem over $\QQ$ | Proved, by a proof of ours | [[t-tt-converse]] |
| The divisor exact sequence and convolution on the quotient | Proved | [[t-tt-divisor]], [[t-tt-operator]] |
| The trace on a circle, and the orbital trace that vanishes beyond the support | Proved | [[t-pc-circle-trace]], [[t-pc-orbital-trace]] |
| The orbital quotient is a circle, through strong coprimality | Stated, after the source's Theorem 7.5.0.1 | [[t-pc-orbital-circle]] |
| Evaluation is continuous exactly inside the strip | Proved, with proofs of ours | [[t-sp-evaluation]] |
| The strip quotient and the spectral trace | Stated, after the source's Ch. 10 | [[t-sp-quotient]], [[t-sp-spectral-trace]] |
| The proto-trace formula, the sieve, vanishing slices, the shell limit, the $S$-local remnant | Proved, except that identifying each slice's trace with its diagonal mass in $W_a$ is stated | [[cutting-the-kernel]], [[t-ck-slices-vanish]] |
| The skewered diagonals on the ideles | Stated | [[t-ck-skewered]] |
| Connes's $S$-local trace and the weight one half | Stated, after Connes and the source's Theorem 12.4.1.1; the one-place case computed | [[t-tf-s-local]], [[s-tf-half]] |
| The Trace Formula over $\QQ$ | Proved from the above, with the extension of the support written out by us | [[t-tf-trace-formula]] |
| The endgame | Proved twice: the source's argument with a repaired step, and a subtraction of our own | [[t-tg-rh]], [[t-tg-subtraction]] |
| Number fields and Hecke characters | Stated, in each chapter's "what changes in general" | [[s-tg-general]] |

What Route M's chapters did not unfold at all: the five Structure Theorems of the source's Ch. 5 and 6, stated in one sentence over $\QQ$; the nuclear and LF spaces, Markushevich bases, and Paley and Wiener levels that make each step legitimate in the coarse space; Lebesgue differentiation on locally compact groups; the periodic orbits of the source's Ch. 8; and the edge terms that appear with a positive Sobolev degree.

| Route A step | On this page | Where |
| --- | --- | --- |
| From the half-plane statement to the five theorems | Proved | [[t-le-five]] |
| The smoothed sums as zero noise | Proved for $G_0$; for $g_\chi$ by a formula of ours | [[t-rh-smooth]], [[t-le-twisted]] |
| Landau's theorem, classical form | Stated | [[t-le-landau-classical]] |
| The windowed Landau theorem and the contract | Proved, in our reconstruction of the code's proof | [[t-le-windowed]], [[t-le-contract]] |
| Definite forms as vectors, lifts as matrices, the chain as a product | Proved, with one genus worked in full; finiteness and the Siegel and Weil formula stated | [[t-df-chain]], [[t-df-finite]], [[t-df-siegel-weil]] |
| The product formula as degree budget; the seesaw | Proved | [[t-ml-height]], [[t-ml-seesaw]] |
| Branching, iterated Bessel periods, divisibility of jets (`ThmP`) | Stated | [[t-ml-branching]], [[t-ml-iter]], [[t-ml-thmp]] |
| `Row0b` and its derivation from `GeoOne` and `TLiftK` | The theorem stated; the derivation traced step by step | [[t-ig-row0b]], [[t-ig-assembly]] |
| The finite-group explicit formula and the bound on $G_r$ | The identity proved; the bound traced through the code's proof, given the chain's conditions `CoreAtH`, with two of its lemmas read as statements | [[t-ig-balance]], [[t-ig-core]] |
| Square-root bounds for the twists | Stated | [[t-ig-pairex]] |
| `VWin` | Stated; the pigeonhole and the final sum proved | [[t-cw-vwin]], [[t-cw-window1]], [[t-cw-glue]] |
| Published inputs and the assembly | Inputs stated with their usual names; the assembly traced | [[s-ia-table]], [[t-ia-assembly]] |

What Route A's chapters did not unfold: the roughly 45 fields of the record `HypsAlt` and the condition `DefiniteSideCondition`, through which the chain's data are shown to satisfy the inequalities that bound the count; how the chain's divisibility and integrality (`ThmP`, `DGam`, `chain_ge`, `PeriodClassSumWeyl`, and the exponents of `LeafDepthGood`) feed the divisibility inequality `DIV`; the identification of the chain's kernel `ColumnChain.unf` with theta coefficients between lattice classes; where the rank condition `RKC` is proved for the datum; the plus part of `VWin`, through Euler systems and automorphy; `LemmaK`; the proofs behind the square-root bounds for twists; and the covolume bound `CovolumeBoundOfX` with its fifteen geometric inputs ([[ml-gaps]], [[s-ia-coverage]]). And the tree was not built for this page.

The compressions that are ours, each marked where it appears: the endgame of Route M with a fixed cutoff in place of the source's mollifier and Montel's theorem ([[t-tg-rh]]); the shorter route that subtracts the Trace Formula from Weil's explicit formula ([[t-tg-subtraction]]); the self-contained proof of the converse theorem over $\QQ$, without the source's $S$-local spaces ([[t-tt-converse]]); the proofs in chapter [[strip-topology]] of the edge inequality and the explicit sequences that show discontinuity outside the strip; the reconstruction in prose of the windowed Landau theorem, whose statement and proof are the code's ([[t-le-windowed]]); the explicit formula for $g_\chi$ ([[t-le-twisted]]); and the reconstruction of the note's toy identity, which is not in the code ([[t-ra-toy]]).

In plain terms, then. A reader who has worked through Part III has followed, over $\QQ$, every step of Route M except two kinds: the functional analysis that makes the computation legitimate in the coarse space (the strip quotient and its trace, the orbital quotient as a circle, and the passage from slices to diagonal masses), and Connes's $S$-local computation. That reader has also checked the endgame in two forms. A reader who has worked through Part IV has followed Route A's analytic end completely, its automorphic and arithmetic middle as exact statements tested on their smallest cases, and its foundations as a catalog of published theorems that the tree proves. What the reader has not seen for Route A is why the chain of lifts bounds the count of inert prime powers: the page states that the formal proof establishes it, and does not show why it holds.

:::: figure {#f-tp-ledger viz="tp-coverage" height="620"}
For each route the page proved some steps in full over the rationals, stated others with a pointer to their source, and left some unopened, and the steps marked as ours are the page's own compressions.

```vizspec
Purpose: a map of how far the page took each proof, step by step.
Scene: two columns of rows, "Route M" on the left and "Route A" on the right, each row a rounded bar with a
  label and a status style: proved on this page = teal fill; stated with a pointer = gold outline, no fill;
  not unfolded = red dashed outline, no fill. A small violet star at the right end of a bar marks a
  compression of ours. A legend line above the columns explains the three styles and the star.
Rows, Route M (label | status | star | anchor):
  Adeles and the product formula | proved | no | adeles
  Poisson summation on adeles, class group of Q | stated | no | t-ad-poisson
  Theta sums and their Mellin transform | proved | no | tate-theta
  Converse theorem over Q | proved | yes | t-tt-converse
  Divisor exact sequence, convolution on the quotient | proved | no | t-tt-divisor
  Trace on a circle, orbital trace | proved | no | t-pc-orbital-trace
  Orbital quotient is a circle | stated | no | t-pc-orbital-circle
  Evaluation exactly inside the strip | proved | yes | t-sp-evaluation
  Strip quotient and spectral trace | stated | no | t-sp-spectral-trace
  Sieve, vanishing slices, S-local remnant | proved | no | t-ck-slices-vanish
  Skewered diagonals | stated | no | t-ck-skewered
  Connes's S-local trace | stated | no | t-tf-s-local
  Trace Formula over Q | proved | no | t-tf-trace-formula
  Endgame with a fixed cutoff | proved | yes | t-tg-rh
  Endgame by subtraction | proved | yes | t-tg-subtraction
  Number fields and Hecke characters | stated | no | s-tg-general
  Structure Theorems, nuclear spaces, Paley-Wiener levels | not unfolded | no | tp-ledger
Rows, Route A (label | status | star | anchor):
  Half-plane to the five theorems | proved | no | t-le-five
  Smoothed sums as zero noise | proved | yes | t-le-twisted
  Classical Landau theorem | stated | no | t-le-landau-classical
  Windowed Landau theorem and contract | proved | yes | t-le-windowed
  Forms as vectors, chain as product | proved | no | t-df-chain
  Product formula budget, seesaw | proved | no | t-ml-height
  Branching, Bessel periods, ThmP | stated | no | t-ml-thmp
  Row0b and its derivation | stated | no | t-ig-row0b
  Finite-group explicit formula (bound on G_r traced) | proved | no | t-ig-core
  Square-root bounds for twists | stated | no | t-ig-pairex
  VWin (pigeonhole proved) | stated | no | t-cw-vwin
  Published inputs and assembly | stated | no | t-ia-assembly
  HypsAlt and DefiniteSideCondition | not unfolded | no | ml-gaps
  Kernel unf as a theta kernel; RKC for the datum | not unfolded | no | ml-gaps
  Plus part of VWin, LemmaK | not unfolded | no | s-ia-coverage
  CovolumeBoundOfX | not unfolded | no | s-ia-coverage
  Toy identity qN = M^k + R (not in the code) | proved | yes | t-ra-toy
Controls: three checkboxes, one per status, to show or hide rows of that status; a toggle "stars only";
  hover or tap a row to show its anchor as a link and its chapter.
Motion: none beyond fading rows in and out (150 ms; instant under reduced motion).
Layout: below 600 px the two columns stack, Route M first.
Reader takeaway: Route M's chain is proved on the page almost link by link over Q, with its functional
  analysis stated; Route A's ends are proved and its middle is stated, with the step from the chain to the
  count left unopened.
Data: the rows above.
```
::::

## Open ends that the sources themselves name {#tp-open}

This section reports what the sources say is not done, in their words where they are short, with locations. It adds no forecast of how these will resolve.

### In the monograph {#tp-open-m}

- **Multiplicities of zeros.** The letter says that the degenerate case $a=0$, the critical line itself, does not lead to a trace formula, and that conclusions on multiplicities cannot be obtained through the trace formula [@masullo, p. 36]. It states what the author extracts from that case only as Expectation 1.7.1, an expected bound on the multiplicities of the zeros other than the central one, for algebraic Hecke characters on the condition of Schanuel's conjecture (if complex numbers $z_1,\dots,z_n$ are linearly independent over $\QQ$, then at least $n$ of the numbers $z_1,\dots,z_n,e^{z_1},\dots,e^{z_n}$ are algebraically independent over $\QQ$) and for characters of finite order without that condition, and it says that this part "will not be a part of my paper" and is reserved for a sequel [@masullo, pp. 37 to 38]. The body's chapter 14 reads a theorem of chapter 13 as giving such a bound, and that subsection is flagged by the author for correction [@masullo, p. 528]. This page followed the letter and did not use the multiplicity statements.
- **Higher rank.** Section 14.3, on cuspidal automorphic representations of $\GL_n$, states the multiplicity bound $n[F:\QQ]$ to which the method leads for generic zeros and is otherwise a placeholder: it announces a few elements and gives none, and its footnote is the author's note to himself to say a few words on $\GL_n$ and to add that the $\GL_n$ version is ongoing work with Brian Conrad [@masullo, §14.3, p. 536]. The main theorem of the monograph is about Hecke characters, the case $n=1$, and the hypothesis for $\GL_n$ with $n>1$ is not part of it.
- **Function fields.** The method does not give the hypothesis over function fields, for the reasons of [[s-tg-function-fields]] [@masullo, §14.2, pp. 534 to 536].

### In the note {#tp-open-a}

- **The extended hypothesis.** Expected "with more time", not proved [@alpoge-note]. The code states nothing beyond Dirichlet L-functions ([[ra-proved]]).
- **Simplification.** The author writes that his intuition insists the argument "will be massively simplified, likely immediately", and that he intends to write it properly [@alpoge-note].
- **Choices that may be unnecessary.** The note says the author "may have baked lots of strange suboptimal choices into the argument" and expects short arguments to follow, and its footnote on step 19, the choice of the tower "using Behrend", calls that trick one that is intuitively going to be unnecessary [@alpoge-note]. In the code the Behrend-type set actually used is `hostThickExists`, and the statement named for Behrend is never proved or used ([[ra-steps]]).

### On this page {#tp-open-page}

Of the note's twenty steps, eight were located in the code, eight partly located, and four not found: step 3, the toy identity; step 4, positivity of $W(\mathbb 1_S)$ through a determinant and its bootstrap; step 14, the cost of each lift and the barrier at $\tfrac23$; and step 15, the integral structure glued across Hecke characters ([[ra-steps]]). Chapter [[integrality-and-galois]] searched again for steps 14 and 15 by content and found one unconfirmed candidate for the "division" of step 14 and a conjectured match for the "extra averaging" of step 15, and located neither ([[ig-missing]]). Chapter [[landau-endgame]] found no bootstrap on the path from `Main`. The regions that were not unfolded are those of [[tp-ledger]], and the tree has not been built here ([[s-ia-integrity]]).

## Where to go next {#tp-next}

Each path below uses only works that the page's chapters already cite.

### Toward the first route {#tp-next-m}

1. The classical theory of zeros and explicit formulas: Davenport [@davenport] and Titchmarsh [@titchmarsh], with Edwards [@edwards] for Riemann's paper.
2. Fourier analysis on the adeles: Tate's thesis [@tate1967], and Ramakrishnan and Valenza [@ramakrishnan-valenza] for the background.
3. Weil's explicit formulas [@weil1952].
4. The spectral realization of the zeros, Connes [@connes1999], and Meyer's representation-theoretic proof of the explicit formula [@meyer2005], the two works the monograph measures itself against ([[s-sp-contrast]]).
5. The monograph itself: its introduction and letter first [@masullo, pp. 11 to 55], then Ch. 7 on orbital bases, Ch. 10 on the spectral side, Ch. 11 on the stratification, and Ch. 12 on the Trace Formula.

### Toward the second route {#tp-next-a}

1. Stepanov's method: Stepanov's paper [@stepanov1969], Bombieri's exposition [@bombieri1974], and Schmidt's book [@schmidt1976].
2. Landau's theorem and the analytic end: Montgomery and Vaughan [@montgomeryvaughan, ch. 15].
3. Automorphic forms on definite groups: Gross [@gross1999], and Siegel's mass formula [@siegel1935].
4. The theta correspondence: the seesaw [@kudla1984], Howe duality [@gan-takeda2016], the branching rule [@goodman-wallach, ch. 8], and the restriction problems of Gan, Gross, and Prasad [@ggp2012].
5. Galois representations: Diamond and Shurman [@diamond-shurman, ch. 8 and 9], then Barnet-Lamb, Gee, Geraghty, and Taylor [@blggt2014].
6. Cyclotomic fields and Iwasawa theory: Washington [@washington-cyclotomic].
7. Lean and Mathlib: [@moura2021lean4] and [@mathlib2020].

### Exploring the Lean code {#tp-next-lean}

The repository's four scripts in `tools/lean/` read the tree without compiling or running anything in it ([[s-ia-explore]]). `index.py` builds one database of every file, import, and declaration; `closure.py` reports what `Main` reaches; `grep.py` finds declarations by name, statement, or path; and `spine.py` traces a declaration downward through the declarations its proof mentions. Chapter [[inputs-and-assembly]] runs `spine.py` from `rhOfAll` down to the assembly theorem as a worked example. The two places where a reader can go furthest beyond this page are the records `HypsAlt` and `ChainTied`, where the chain of lifts meets the count, and the covolume bound `CovolumeBoundOfX`, and running `spine.py` from either name is a step this page has not taken.

## The question of chapter 1, answered {#tp-answer}

Chapter [[counting-primes]] asked how large the error in counting primes can be, and its tables could only suggest an answer: at $x=10^9$ there are 50,847,534 primes, $\Li(x)$ overshoots by 1,699.91, and that is about a twentieth of $\sqrt x$ ([[cp-question]]). The reader can now answer for every $x$, and not only for the values in a table. Both proofs give the Riemann Hypothesis, and by von Koch's theorem that is the statement $\pi(x)=\Li(x)+O(\sqrt x\log x)$; with Schoenfeld's constants it is the inequality $\lvert\pi(x)-\li(x)\rvert<\sqrt x\log x/(8\pi)$ for every $x\ge2657$ [@schoenfeld1976-chebyshev], which at $x=10^6$ allows 549.7 against an actual 129.55 ([[t-rh-von-koch]]), and at $x=10^9$ allows about 26,075 against an actual 1,701 (our arithmetic). That 1,701 is $\li(x)-\pi(x)$, larger than the overshoot of $\Li(x)$ by $\li(2)\approx1.045$. The exponent one half cannot be lowered, because the exponent of the error is exactly the largest real part of a zero ([[t-rh-theta]]) and the zeros on the line exist, so one half is both the ceiling and the floor. The same square-root regularity now holds for the primes in every residue class ([[t-rh-ap]]), by both proofs, and for the prime ideals of every number field, by the first. At the start the reader had a table and a coin-flip picture of why a square root is natural ([[cp-question]]). Now the reader has the theorem, and two complete accounts of why it is true: one in which the zeros off the line are casualties of a topology that the primes cannot tell from the finest one, and one in which a chain of about $\sqrt x$ theta lifts does over the integers what Stepanov's multiplicity did over a finite field.

::: recap
- Route M reaches every unitary Hecke L-function of every number field, Route A reaches $\zeta$ and every Dirichlet L-function ([[tp-reach]]).
- Route M forces the hypothesis by comparing two identities whose zero sides differ, Route A by an upper bound on windows and a windowed Landau theorem ([[tp-forced]]). The one half comes from measure matching in one and from the square-root size of the bound and the chain in the other ([[tp-half]]).
- Route M cannot use Weil's positivity; Route A's code proves an upper bound where its note speaks of positivity ([[tp-positivity]]). Route M does not reach function fields; Route A descends from Stepanov ([[tp-function-fields]]).
- The routes share the explicit formula, the functional equation, two different kinds of theta function, test functions on one side of 1, zeros seen as poles, and Tate's thesis, and nothing more on this page ([[tp-share]]).
- The page proved Route M over $\QQ$ almost link by link, proved Route A's analytic end, stated its automorphic middle, and left the step from the chain to the count unopened ([[tp-ledger]]). The sources' own open ends are listed in [[tp-open]].
- The error in counting primes is at most a constant times $\sqrt x\log x$, and the exponent one half is exact ([[tp-answer]]).
:::
