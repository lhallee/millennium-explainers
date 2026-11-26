# Digest of the shorter rewrite `grh-lean`

Read 2026-11-26 by the main session, for chapter 25 (`route-a-compressed`). Source: https://github.com/lsernau/grh-lean,
one commit `72fead1` ("Lean proof of GRH", 2026-11-25), shallow clone in `sources/riemann/grh-lean/` (data only, never
built). Paths below are relative to that folder. Nothing here was checked by a build; the README's machine checks are
reports.

## What it is

- `README.md`: "A Lean 4 proof of the Riemann Hypothesis and of the Generalized Riemann Hypothesis for Dirichlet
  L-functions", axioms `propext`, `Classical.choice`, `Quot.sound`; "based on Levent Alpöge's, with Claude"; "a shorter
  version, produced in collaboration with my colleagues at Anthropic, and Claude"; Apache 2.0, Copyright 2026
  Anthropic, PBC. Status line: "The proof has passed machine checks only ... No mathematician has read it through,
  and no paper comes with it." Build: Lean v4.35.0, Mathlib `56a00585`, one to two hours on 12 cores, 24 GB.
- Two editions, each a Lake project: `grh/` (readable, "about 300,000 lines"; we count 805 `.lean` files, 477,151 lines
  in all; `INDEX.md`: `Lib` 495 files and 177,492 lines of code, `New` with `Main` and `Statements` 308 files and
  122,410) and `grh-compact/` (compact, "about 76,000 lines of code; 95,000 non-blank lines with comments; 113,000 lines
  in all"; we count 796 files, 112,854 lines). All but two files in each `src` open with a `/-!` head.
- `grh-compact/README.md`: "The Lean text and the documents in this project were written by Claude (AI)"; "a shorter
  rewriting of Levent Alpöge's Lean proof ... It follows that proof's method; many steps are proved by other arguments,
  and parts of it, mostly background material, were ported from there and then rewritten"; "written to be short, not
  to be easy to read". Checks: every file compiles without errors or `sorry`, replayed through the kernel; the five
  theorems depend only on the three axioms; Comparator (`comparator.json`, `Challenge.lean`) accepted the proofs.
- `NOTICE`: `src/Statements.lean` and the names and types of the five theorems are taken from Alpöge's proof unchanged.
- `grh-compact/GUIDE.md`: "Lean checks neither comments nor this guide."

## The spine (compact `src/New/Main.lean`, readable `src/New/Reduction/MainInequality.lean`)

- "One covolume is bounded from both sides": `h_main ≤ (V + 2δ)/rowDim ≤ h_main − m·remainder`, up to errors.
  Theorem A `short_forms` / `span_short_integralRamified_eq_top` and `indexLe_normalizedPoincare`; Theorem B
  `enough_forms`; Theorem C `integral_forms_long`; `star_inequality : m * rem ≤ f * a * (log b)^5` (readable).
- Errors per dimension (readable): size `f a log⁴ b`, index `20 log(1 + 2b²) · f a log³ b` (doubled), covolume
  `3 f a log⁴ b`; family has `n ≥ dim/2` members.
- What cancels: the main amount between the bounds; the gains against `log c_B`; the constant `c₁` between the period
  and `a(log(a/κ̄) + c₁)`; the excesses `a log(κ̄ M rd_E/2π)` of the `m` lifts against `a log N`; `log x`, `log x₁`, `c₁`
  in `totalRemainder_eq`.
- Literature named (MainInequality head): Pritsker 2005 (Gelfond–Schnirelman method); Granville–Stark 2000 (abc and
  Siegel zeros, negative discriminant); Bombieri 1973 (Bourbaki 430); van Frankenhuijsen 2008. Compact: "Chebyshev-order
  bounds, conditional CM heights, curves over F_q".

## Data and sizes (readable `GUIDE.md` §3, `src/New/Reduction/Data/Sizes.lean`)

- `q₀` a multiple of 18480 = 16·3·5·7·11; prime `d ≡ q₀/2 − 1 mod q₀`, so `d ≡ 7 mod 8`; `K = ℚ(√−d)`; `χ_K = (·/d)`.
- `(log b)^100 ≤ x`, `x^(10⁶) ≤ x₁`, `x₁^(10⁶) ≤ b`; `log b ∈ [x^ε, x^ε + 1]`, `x₁ = ⌊exp(x^(ε/6))⌋`.
- `m` the least power of 2 with `m ≥ √x` (`Existence.lean`, `isLeast_m`); `r ∈ [x⁵, 3x⁵]`, `k = r + 1 − m`, `t = 5r`;
  `2^s = m^22`; `x¹¹ ≤ m^22 ≤ f ≤ q₁ ≤ x¹²`; `a = xb` "the order of the derivative at the a-places"; `M = p₀p₁ ∈ [b²⁰,
  b²²]`; `log N ∈ [m log b, 30 m log b]`. `Sizes.lean`: `x` is "the length of the prime sum".
- `R_{q₀}(x) ≤ (64 φ(q₀) + 3) x^(−1/2 + 6ε)`; "the exponent comes from log⁶ b / m with log b ≤ 2x^ε". Compact Main:
  "the saving x^(−1/2) is 1/m".

## The ledger (readable `src/New/Reduction/PrimeSums.lean`, `src/New/UpperBound/Size/ArchimedeanSize.lean`)

- `jetSize j = log j! + j log(M/Ω)`, `Ω = exp(γ − Re L'/L(1, χ_K)) · 2π/rd_E` (`P.bigOmega`).
- `primeSum y τ = Σ_{n ≤ a} Λ_K(n)(y/n − κ(−nτ))₊`, `Λ_K = Λ(1 − χ_K)`; `directionAmount = Σ_τ (jetSize κ(τ) −
  primeSum κ(τ) τ)`; `mainAmount = m k directionAmount`; `mainPrimeSum = a(log a − mean log κ + c₁)`;
  `totalRemainder = Σ_{τ ∈ Φ_a}(primeSum a τ − mainPrimeSum)`.
- `re_logDerivMean_one_eq_add_re_logDeriv`: `c₁ = −1 − γ + Re L'/L(1, χ_K)` (for odd `d`).
- `jetSize_sub_mainPrimeSum_le`: `s_∞(a) − s_main ≤ a(mean log κ + log(M rd_E/2π)) + 1 + (log a)/2`, comment "The
  constant `c₁` cancels". `mul_jetSize_sub_mainPrimeSum_sub_le`: `m(s_∞(a) − s_main) − a log N ≤ 32 a log b`.
- `Data.primeRemainder_le`: `R_{q₀}(x) ≤ φ(q₀) log⁶ b/m + |R_{q₀}(x₁)| + log b |R₁(x₁)|`.
- `eventually_abs_primeRemainder_le`: `|R_q(y)| ≤ (log y)^(−B)` (Tauberian; also Siegel–Walfisz).

## Derivatives that count primes (readable `src/New/Derivatives`)

- `FormalGroup/FrobeniusCongruence.lean`: for `C` with CM by `O_K`, `d ≡ 7 mod 8`, `p` non-split:
  `θ(π_p z)/θ(z)^{q_p} ≡ 1 mod π_p` in `𝒪[[y]]` (`exists_rescale_theta_eq_pow_mul_one_add_smul`); `π_p = √−d` if
  `p = d`, else `p`; `q_p = p²` inert, `p` otherwise.
- `FormalGroup/Exponent.lean`: `θ(ϖz)` integral up to `exp(c_ϖ Ξ₁)`, `c_ϖ = ϖ^(p+1)/p`, `v(ϖ) = ρ_p = v(π_p)/(q_p − 1)`.
- `Divisibility/Count.lean`: Legendre's bound for jets; each box gains about `γ_p = 1/(p − 1) − ρ_p`.
- `Sharpness/BoundAttained.lean`: slope `p/(p² − 1)` attained; "known in the literature" for one curve.

## Endgame (readable `src/New/Reduction/Zeros/Criterion.lean`, compact `src/New/Main.lean`)

- `LFunction_ne_zero_of_primeRemainder_le`: eventual `R_q(x) ≤ x^(β−1)` for all primes `d` of a class excludes zeros of
  all `L(s, ψ)` mod `q` in `Re s > β`; "not the real zeros". Related work: Suzuki arXiv 2411.07436 (2024);
  Montgomery–Vaughan §15.1–15.2; Landau 1905.
- `New.grh` (compact): modulus `18480 q`, class `q₀/2 − 1` with square 1; parameters for every prime `d` of the class.
- Compact: `IsPolar.exists_window_sub_mul_le`, `log x₁ ∈ [t, t²]`, `t = 10⁶ log x`.

## Lattices (readable `src/New/Reduction/Lattices`)

- `TwistedLattice`: maps `Θ_ξ`, one per twist; index `IndexLe`, covolume `CovolumeLe`, `Z(ξ) = det(Θ_ξ* Θ_ξ)`;
  `covolume_add_index_nonneg` ("A twist for each prime"); related work Bost 2001, Laurent 1994.
- `Heights`: `HeightLe`; `nonneg_of_one`, "a form of the product formula". Related work Gaudron 2006,
  Bombieri–Gubler 2006.
