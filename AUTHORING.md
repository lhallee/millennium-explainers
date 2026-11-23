# Authoring format

This is the contract between chapter writers, figure authors, and the build. The build implements exactly
this. If you need something it does not offer, say so in your report and do not invent syntax.

## Chapter files

`problems/<problem>/chapters/NN-slug.md`, one chapter per file, UTF-8, LF line ends. The file starts with
front matter:

```
---
id: zeta-continued          # unique, kebab-case, used as the anchor of the chapter
title: Zeta on the whole plane
part: 1                     # 1-based index into the parts list of problem.yml
summary: One sentence that says what the reader can do after this chapter.
needs: [complex-toolkit]    # ids of the chapters this one relies on
---
```

The body is CommonMark. The chapter title is not repeated in the body. Sections are `##` headings with an
explicit anchor, and subsections are `###`:

```
## The functional equation {#functional-equation}
```

Anchors are unique across the whole problem, so prefix them when in doubt.

Every chapter opens with a `plain` box of two to four sentences that a reader outside the field could
repeat, then a short paragraph that says why the chapter is needed for the proof, and ends with a `recap`
box that lists what the reader now has and where it will be used.

## Math

- Inline `$...$` and display `$$...$$`, with the display delimiters on their own lines. KaTeX renders it at
  build time, so use only KaTeX-supported LaTeX. `\begin{aligned}` works. `\label`, `\eqref`, and custom
  packages do not.
- To number an equation and link to it, put an anchor after the closing delimiters: `$$ {#eq-euler-product}`.
  Refer to it with `[[eq-euler-product]]`.
- Shared macros live in `problems/<problem>/macros.yml`. Use them and do not define macros in a chapter.
  Available for every problem: `\RR \CC \ZZ \QQ \NN \FF`, `\Re \Im`, `\abs{x}`, `\norm{x}`, `\floor{x}`,
  `\ceil{x}`, `\dd` (upright d for differentials), `\eps`.
- Follow the problem's `NOTATION.md`. A new symbol is added there by the main session, so list any symbol
  you needed in your report.

## Blocks

Blocks use fenced containers. An outer container uses more colons than the ones inside it. Attributes go in
braces: an anchor, then `key="value"` pairs.

```
:::: theorem {#t-euler-product title="Euler product" source="euler1737"}
For $\Re s > 1$,
$$
\zeta(s) = \prod_p \frac{1}{1 - p^{-s}}.
$$
::::
```

Theorem-like blocks are numbered by the build as chapter.counter (one counter for all kinds):

| Container | Use |
| --- | --- |
| `definition` | Introduces an object. Say what kind of thing it is and what it is not. |
| `theorem`, `proposition`, `lemma`, `corollary` | A statement. `title` states the claim in words. `source` is a reference key when the result is known. |
| `conjecture` | An open statement. |

Unnumbered blocks:

| Container | Use |
| --- | --- |
| `plain` | "In plain terms." Two to four sentences with no symbols beyond the simplest. |
| `why` | Why the proof needs this, and what would fail without it. |
| `idea` | The intuition for a statement or a proof, before the details. |
| `proof` | A complete proof. Add `collapsed` in the braces when it is long: `::: proof {collapsed}`. |
| `sketch` | The main line of a proof with a pointer to the full one: `::: sketch {source="titchmarsh" loc="§2.6"}`. |
| `steps` | A numbered procedure. Each item is one plain sentence, then the equation for the next named quantity. |
| `example` | Worked numbers. Small cases chosen so that each outcome appears once. |
| `symbols` | Wraps a Markdown table with the columns: symbol, what it is, kind, where it lives. |
| `recall` | A refresher on prerequisite material. Collapsed by default. |
| `aside` | History or a remark the main line does not need. |
| `warning` | A common misreading, stated and corrected. |
| `used` | Where this result is used later, as links. |
| `lean` | Where the statement lives in the formalization: `::: lean {decl="riemannHypothesis" file="Main.lean"}` with one sentence. |
| `recap` | End of chapter: what the reader now has. |

### Result cards

A main result is a `card`, the counterpart of an experiment card in the paper explainers. Every card has
the same parts in the same order. A card is numbered like a theorem.

```
::::: card {#t-explicit-formula kind="theorem" title="Each zero of zeta is one wave in the count of primes" source="vonmangoldt1895"}
:::: statement
...
::::
:::: plain
...
::::
:::: why
...
::::
:::: idea
...
::::
:::: proof {collapsed}
...
::::
:::: used
...
::::
:::::
```

Rules:

- `statement`, `plain`, `why`, and `idea` are required. Then exactly one of `proof` or `sketch`. `used` is
  required except in the last chapter. `example` and `lean` are optional and go before `used`.
- The title states the result as a sentence and must be true as stated. It may contain inline math,
  `title="Each zero $\rho$ of $\zeta$ adds a wave $x^{\rho}/\rho$"`, rendered like math in prose. The same holds
  for the `title` of every block that takes one. A `[[id]]` link to a numbered card or
  block reads "Theorem 6.3" and does not repeat the title; a link to an unnumbered block uses the rendered title.
- A result proved before the new proof gets a `sketch` with its source and a minimal `idea`. A result the
  new proof introduces gets a full `proof` or the most complete account the sources allow, and a `lean`
  block.

## References between places

- `[[t-explicit-formula]]` renders as a link with the right text: "Theorem 6.3", "Definition 2.1",
  "Figure 4.2", "Equation (5.7)", or the title of a chapter or section. Use it for every cross-reference.
- An ordinary Markdown link `[text](#anchor)` also works when you want your own words.
- A broken reference stops the build.

## Citations

`[@titchmarsh]` or `[@titchmarsh, §2.6]`. Entries live in `problems/<problem>/references/NN-slug.yml`, one
file per chapter so that parallel writers do not collide. The build merges the files, and two entries with
the same key must be identical.

```
titchmarsh:
  authors: E. C. Titchmarsh, revised by D. R. Heath-Brown
  title: The Theory of the Riemann Zeta-function
  year: 1986
  where: Oxford University Press, 2nd edition
  url:            # optional
```

Cite only works you are sure exist, with locations you are sure of. If you are not sure of a section number,
cite the chapter or the work alone.

## Glossary terms

`problems/<problem>/glossary/NN-slug.yml`. The page underlines the first use of each term in each chapter
and opens the definition in a drawer.

```
- term: analytic continuation
  pattern: "analytic continuations?|analytically continue[sd]?"   # a regular expression, case-insensitive
  definition: One or two sentences that stand alone.
  anchor: d-analytic-continuation      # where it is explained in full
```

Keep patterns narrow. A pattern on an ordinary word catches ordinary uses of it.

## Figures

A figure is a container with an anchor, a figure name, and a caption. The caption states the one claim the
figure makes.

```
:::: figure {#f-zero-waves viz="zero-waves" height="420"}
Adding the wave of each zero, one at a time, turns the smooth curve into the staircase of the primes.

```vizspec
Purpose: show that the explicit formula converges to psi(x) as zeros are added.
Scene: axes x in [2, 60], y in [0, 60]. Draw psi(x) as a pale staircase. Draw the partial explicit
  formula with N zero pairs as a bright curve.
Controls: slider N from 0 to 200, a play button that steps N upward.
Motion: the curve morphs as N changes.
Reader takeaway: more zeros means sharper steps, and the steps sit at prime powers.
Data: first 200 zero ordinates (kit provides them).
```
::::
```

- A chapter writer writes the figure container, the caption, and the `vizspec` block. The build removes the
  `vizspec` block from the page. A figure author later implements `problems/<problem>/viz/<name>.js` from
  it.
- `height` is the drawing height in CSS pixels at desktop width. The width is the column width.
- A static figure uses `svg="file.svg"` in place of `viz`, with the file in `problems/<problem>/viz/`.
- Plan two to four figures per chapter. Put one where a picture carries the idea better than a paragraph:
  a function's shape, a geometric construction, a limit forming, a count against its estimate, a
  dependency map. Prefer a figure the reader can move (a slider, a draggable point) to one that only plays.
- A good spec names every drawn object, its coordinates or formula, each control with its range, what moves,
  and the one thing the reader should see. A figure author must be able to build it without reading the
  chapter.

## Figure modules

`problems/<problem>/viz/<name>.js` registers one figure with the shared kit. The kit's interface is
documented in `shared/viz/README.md`. A module draws with the kit's canvas helpers and theme colors, keeps
all state inside its function, and does nothing until the kit calls it. Figures across the page use the same
color for the same meaning, as listed in the kit's palette section and the problem's `NOTATION.md`.

## Voice

- Write to one reader who has a mathematics degree and has forgotten half of it. Remind, then use.
- Before each formal statement, say in a sentence what it will say and why we want it.
- After each formal statement, test it on the smallest case.
- Prefer a concrete number to an adjective.
- Never write "clearly", "obviously", or "it is easy to see".
