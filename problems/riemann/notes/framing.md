# Framings, analogies, and symbols that are ours

The page's sources do not contain these. Each was introduced by a writer to explain a step, and is recorded here
so that a reader can tell our exposition from the sources' mathematics. The main session keeps this file from
the writers' reports.

## Chapter 1, counting primes

- The coin-flip picture for a square-root sized error.
- "Rare and tall cancel": the weight $\log p$ makes the expected density of the weighted count equal to 1.
- $\psi$ against $\vartheta$, with the prime powers repairing a bias of about $\sqrt x$.

## Chapter 2, Euler's product

- Existence and uniqueness of factorization as the two inequalities in the proof of the Euler product.
- Integers lighting up as primes are multiplied into the product.
- The $4k+1$ example ($693 = 9\cdot 77 = 21\cdot 33$) of a system without unique factorization.

## Chapter 3, complex toolkit

- $n^{-s}$ as an arrow whose length and angle multiply.
- Poisson summation as the first prototype of the duality in the explicit formula.

## Chapter 4, zeta continued

- Zeta "announcing a pole" as $\sigma \to 1^+$.
- Partial sums circling $\zeta(s)$ along $N^{1-s}/(1-s)$.
- The factor $\pi^{-s/2}\Gamma(s/2)$ as an Euler factor at infinity.

## Part III, Route M (from the digest)

- The whole argument told for $\mathbb Q$ and the trivial character on $\mathbb R_{>0}$, with the constants of the
  archimedean term specialized by us from the source's general statement.
- The divisorial stratification described as a sieve of Eratosthenes run on the theta sum.
- The shorter endgame: subtract the Trace Formula from Weil's explicit formula.
- Notation that differs from the source on purpose: $m_\rho$, $Y$, $\lambda$, $D_p$, $W_a$, $\Theta_g$
  (see `NOTATION.md`, "Route one").

## Chapters 5 to 7, zeros, explicit formula, what the hypothesis says

- The primes as a chord whose notes are the zeros, and "the spectrum of the primes".
- The dictionary from the position of a singularity in the plane to a growth rate and a frequency.
- The coin-flip and Moebius random-walk heuristic for square-root cancellation.
- A zero on the line as one real equation (a sign change of $Z(t)$).

## Chapter 15, cutting the kernel

- The 4 by 4 circulant matrix as the finite analogy for the proto-trace formula.
- The circle analogy for the formula that sums the kernel along shifted diagonals (source 1.3.1.12).
- The block-triangular reading of a trace along a flag of subspaces.
- A slice described as $A(\varphi)$ acting on $U_{j-1}/U_j$, with Mellin multiplier $M\varphi(z)\,p^{-z-1/2}$.
- The remark that a slice's diagonal mass equals that prime's term in Weil's prime sum.
- Symbols: $p_1 < p_2 < \cdots$ (the primes above $Y$), $\alpha_j$, $\Theta_g^{(j)}$, $U_j$, $K$, $k_{p_j}$, $k_S$,
  $\operatorname{mass}(k)$, $G(s)$.

## Chapters 11 and 12, adeles and Tate's thesis

- Every specialization to $\mathbb Q$. The main one is a self-contained proof of the converse theorem over
  $\mathbb Q$ (the source proves it through $S$-local spaces, Theorem 6.3.2.1): the maximum modulus principle on
  rectangles between horizontal segments where $1/\zeta$ is controlled.
- Finite-jet interpolation with $P(z)e^{z^2}$.
- The local terms of Weil's formula written on $\mathbb R_{>0}$.
- The example functions $g_\star$ and $g_c$, the name $W_g$ for the weighted theta sum, and the reading of
  $\tfrac12 s(s-1)$ as the Mellin image of a differential operator.
- Symbols: $Mg$, $Z_g$, $W_g$, $\mathcal T$, $\mathcal H$, $J_\rho$, $S_E$, $AS(\mathbb C)$, $\mathbf e_v$,
  $\{x\}_p$, $v_p$, $\hat{\mathbb Z}$, $\dd^\times x$, $g_\star$, $g_c$, $\mathcal O(\mathbb C)$.

## Chapters 13 and 14, primes as circles and the strip topology

- The example $g_\star(x) = (4\pi^2x^4 - 6\pi x^2)e^{-\pi x^2}$, whose theta sum has Mellin transform $2\xi(s)$.
- The weighted circle trace, with a factor $\lambda^{-ck}$ at each orbit point. The source's weighted orbital
  trace (p. 51) omits the factor $p^{-k/2}$; the page prints the version verified numerically.
- How the sieve slices keep track of the jets at $s = 0$.
- Our own proofs of the edge inequality for $W_a$, the exact norm of evaluation, and the explicit
  counterexample sequences (the source's proof of Corollary 9.2.2.5 is a placeholder).
- The toy lemma that division by $z - z_0$ uses the kernel $t^{-z_0}\mathbf 1_{t>1}$.
- Symbols: $z_m$, $e_m$, $c_m$, $\Phi_\lambda$, $k_\lambda$, $E_p$, $u = \log t$, $\delta_{z_0}$, $\mathcal V$,
  $\mathcal H_a$.

## Chapters 8 to 10, Weil positivity, function fields, Stepanov

- The place at infinity as "a prime whose powers fill the half-line".
- Primitive orbit length as the common weight in the Selberg, Weil, and curve trace formulas.
- Twists of a curve as the counterpart of summing over characters.
- The reading of the note's "Stepanov determinant" and "multiplicity one", and of $W(\mathbf 1_S)$ as the
  quadratic form $W(\mathbf 1_S * \tilde{\mathbf 1}_S)$ (to be checked against the Lean code in Part IV).
- The arrangement of the converse of Weil's criterion with Gaussian test functions.

## Chapters 16 and 17, the Trace Formula and the endgame

- The one-place trace with the sine integral, and the evenness that produces the $\tfrac12$ and the $1/(1+t)$
  term.
- The two pole terms read as eigenvalues on the functionals $g(0)$ and $\int g$.
- The unitary identity on $\mathbb R$ and the symmetry $y \leftrightarrow 1/y$ as illustrations of the weight
  $\tfrac12$.
- The fixed cutoff $h_0$ near $t = 1$ (no prime power lies in $(1,2)$), and the normalization remark that the
  archimedean term and the zero sum grow by the same logarithm with opposite signs. The source (Section 1.4.3,
  p. 29) says the archimedean integrals stay bounded.
- The subtraction of the Trace Formula from Weil's explicit formula as a second endgame.
- The conversion $\varphi(t) = t^{1/2} f(t)$ between Part III's and chapter 8's test functions.

## Added by the review of chapters 1 to 4

- The Paley and Wiener statement in chapter 3 is given in the form the page needs (a smooth $\varphi$ supported
  in $[1/Y, Y]$ has an entire Mellin transform bounded by $Y^{\lvert\Re z\rvert}$), with our own short proof.

## Part IV, Route A (from the writers' reports)

Part IV marks each of these in place as "our reading". The code and the note do not contain them.

- Chapter 18: the three requirements for a stand-in derivative; divisibility as the measure of multiplicity with
  the product formula as the degree budget; the analogy between $\sqrt q$ in Stepanov's proof and $\sqrt x$ here;
  identifying the note's $X$ with the scale $x$; the whole reconstruction of the note's toy identity
  $qN = M^k + R$ and of what "sign-only" means; the pairing of the note's twenty steps with code declarations.
- Chapter 19: the parallel with Stepanov's last step; why a real zero pushes $G_0$ up; the Post and Widder
  reading of the kernel $u^k e^{-\sigma u}/k!$; why the code's lemma splits into two cases; the weights read as
  coset proportions; the aside matching the note's step 6 to a one-sided bound; the explicit formula for
  $g_\chi$ (the code uses only its transform).
- Chapter 20: the Stepanov role mapping; the chain's kernel `unf` read as a theta kernel and its characters as
  the note's $\mu_j$; integrality replacing vanishing; the proofs of adjointness and of the `ChainInt` statement.
- Chapter 21: the product formula as "zeros equal poles"; `vonMangoldtClassSum` read as a von Mangoldt sum; the
  period map as a restriction to a codimension-one unitary group; the note's step 7 realized by `HCParam` and
  the rank condition `RKC`; `ThmP` as Stepanov's nonvanishing lemma; how the lifts are "each mimicking multiplicity" (the note's words).
- Chapter 22: the Stepanov dictionary; the trace-limit mechanism; the specialization to $\mathbb Q(i)$; the
  candidates for the note's steps 14 and 15. (`ArithData` as the Galois group of the host's field is no longer
  ours: the code builds it by class field theory, `arith` and `cftData`, and identifies the group through
  `HostRaw.gal` and `Comparison₂.toE`; corrected 2026-11-21.)
- Chapter 23: the analogy with passing to larger finite fields in Stepanov's proof; the worked example at
  $p = 37$; the sense in which the bound is a weak form of Vandiver's statement; Stickelberger's role, read from
  declaration names; the reading of the exceptional twists as zeros of a power series.
- Chapter 24: how Stepanov's ingredients map onto the published theorems; the two routes touching at Tate's
  thesis.

## Chapter 25, the shapes figure

Figure `f-tp-shapes` (`viz/tp-shapes.js`); its nodes and links, each with a source, are in `proof-shapes.md`.
Neither source draws its proof as a graph. Everything below is ours.

- Reading each proof as a graph of uses, a link from a result up to a result whose proof uses it, and the grain:
  which steps are merged into one node, which tools are not drawn, and which implied links are left out.
- The word "waist" for a result through which every own result of its route below it reaches the theorem, and
  the reading "an identity in the first and an inequality in the second" for the two waists, the Trace Formula
  and `ChebyshevInequalityOnWindows`.
- The translucent band along each route's own links as the route's shape, and the "two funnels" reading of the
  vizspec's takeaway.
- "Zeros are poles" as one shared node for the step both endgames use: the bridge of the explicit formula, in the
  form that a zero of order $m$ is a simple pole of $-L'/L$. The sources use the fact; the shared node is ours.
- Reading `TW.Poisson` in the tree's proof of the Siegel and Weil formula as an instance of the shared node
  "Poisson summation".
- The statement that, without the shared results and the theorem, the graph falls into two pieces. It is a fact
  about this drawing at this grain, not a theorem about the proofs.
- The node names that merge steps or rename them: "Primes as circles", "Strip quotient", "Hosts on windows",
  "Chain of theta lifts", "Published inputs", "From count to bound", "Galois input (Row0b)", "Five theorems",
  "Contract", "Endgame", and the phone labels "The theorem", "Reflection", "Poles", and "Inequality".
- Left and right, the rows, and the colors are drawing choices. A row is not a depth in any formal sense.
