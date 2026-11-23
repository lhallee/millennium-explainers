# Review queue

Issues the main session collected from writers' reports, for the review pass. Remove an item when it is fixed.

## Notation clashes across chapters

- Reference keys shared between chapter files (`apostol`, `davenport`, `edwards`, `titchmarsh`, `hardywright`,
  `mertens1874`) must be identical entries. The build checks this.

## Facts to verify or soften

- None open.

## Part III

- Chapters 11 to 14 are unified (reviewer of 11 to 14): weighted theta sum $V_g=t^{1/2}\Theta_g$, its space
  $\mathcal V$, quotients $\mathcal H=S_E/\mathcal V$ and $\mathcal H_a=W_a/\overline{\mathcal V}$, the bump
  $\operatorname{bump}(x)=e^{-1/(1-x^2)}$ (never $\beta$, which is $\Re\rho$), and $Mg$ for the Mellin transform of
  $g$. Chapters 15 to 17 now use the same symbols (reviewer of 15 to 17). `NOTATION.md` needs them, and also
  chapter 15's $P^{\mathrm{geom}}$, $P^{\mathrm{spec}}$ (projections onto $\overline{\mathcal V}$ and its complement),
  the shell parameter $R$ (the source's $\Lambda$, which on this page is von Mangoldt's), chapter 16's $\AA_S$, $J_S$,
  $\omega$ (an $S$-unit), $\nu_S$, $\mu_S$, $c_S$, and chapter 17's mollifier $J_\varepsilon$ (the source's
  $\rho_\varepsilon$), $h_0$, $\kappa$, $\tilde b$, $H$, $E_\infty$, $Z_a(z)$, $Z^{\mathrm{off}}_a$.

## From the review of chapters 1 to 4 (done 2026-11-21)

- Symbols to add to `NOTATION.md`: $E_\pi(x) = \pi(x) - \Li(x)$, $J(x)$ (Riemann's count), $\Pi_N(s)$ (partial
  Euler product), $P(s)$ (prime zeta function), $M$ (Mertens's constant; note it sits near Part III's
  $M\varphi$), $\omega(t)$, $\Phi(s)$, $S_N(s)$, $\varphi \star f$ (multiplicative convolution), $\int_{(c)}$.
- Figure specs changed: `zeta-real` (series must stop at $n < 2000$), `zeta-arrows` (stated accuracy $10^{-5}$).
  The figure authors of chapters 2 and 4 must follow the revised specs.
- Still unsure: Euler's exact wording; that Paley and Wiener is in Stein and Shakarchi, Complex Analysis, Ch. 4.

## From the build agent's report (2026-11-21)

- `12-tate-theta.md` lines 308 to 328: a `warning` block inside card `t-tt-divisor`, and a three-colon fence that
  closes a four-colon one, so the next proof never closes. With the reviewer of chapters 11 to 14.
- `glossary/04-zeta-continued.yml`: the term "partial summation" underlines "Abel summation", which is the other
  sense. Narrow the pattern.

## Part IV (from the writers' reports, 2026-11-21; closing edit of chapters 18 to 25 done the same day)

- Glossary patterns in chapters 1 to 17 that underline a different sense in Part IV: `residue` (ch. 3) in "residue
  field", "residue characteristic", "norm residue theorem"; `holomorphic` (ch. 3) in "holomorphic Lefschetz";
  `theta function` (ch. 4) for the theta functions of the Weil representation; `zeta function` (ch. 2) inside
  "Dedekind zeta function"; `trace formula` (ch. 8) in "relative trace formula" and "comparing trace formulas";
  `jet` (ch. 12) for the jets $J(y)$ of `ThmP`.
- Citations with several keys in one bracket appear in chapters 10 and 22; the build accepts them. Leave them.
- Chapter 17 (`s-tg-positivity`) says the source does not use Weil's criterion, citing the introduction (pp. 30,
  35). The body's subsection 14.1.2 (p. 528, flagged by its author for correction) and p. 533 call the main theorem
  a consequence of the Trace Formula "combined with the Positivity Criterion". Chapter 25 now says so; chapter 17
  should mention it in one sentence.
- About fifteen card titles in chapters 18 to 25 carry formulas as plain text; convert them in one sweep when the
  build accepts `$...$` in titles.
