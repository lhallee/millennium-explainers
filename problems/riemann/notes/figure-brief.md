# Brief for figure authors

Each chapter of the explainer declares its interactive figures as `figure` containers with a `viz="name"`
attribute, a caption, and a `vizspec` block that describes the figure. You implement the figures of the
chapters assigned to you, one JavaScript module per figure, on the shared figure kit.

## Read first

1. `AGENTS.md`: requirements, especially "Hard limits on the built page".
2. `shared/viz/README.md`, all of it: the kit's interface, lifecycle, performance rules, palette, controls, math
   helpers, and a complete minimal module. Then the two working modules in `problems/_demo/viz/`.
3. `problems/riemann/NOTATION.md`, section "Colors in figures": the same color means the same thing in every
   figure of the page.
4. Your chapters under `problems/riemann/chapters/`: every `figure` container with its `vizspec`, and the text
   around it, so that the figure uses the chapter's symbols and shows exactly the claim its caption makes.

## What to deliver

`problems/riemann/viz/<name>.js` for every `viz="name"` in your chapters, and nothing else. Do not edit chapter
files, the kit, or the build. If a spec cannot be built as written (it needs something the kit lacks, or it is
mathematically off), build the closest faithful version, and say what you changed and why in your report.

## The bar

- The look is 3Blue1Brown and manim: a calm dark stage, few colors used for meaning, crisp lines, smooth eased
  motion, generous spacing, nothing decorative. Every figure should make one idea visible, and the reader should
  be able to move something (a slider, a draggable point) and watch the consequence.
- Mathematical labels use the module's `tex` field so they match the page's math. Numbers that change every
  frame are drawn as canvas text. No title inside the drawing: the caption carries it.
- Correct numbers. Use the kit's math helpers. Where you compute something yourself (a sum over zeros, a
  transform, a count of points on a curve), check several values against
  `"/c/Users/Logan Hallee/Desktop/millennium-explainers/.cache/venv/Scripts/python.exe"` (mpmath, sympy) and
  against the numbers printed in the chapter. A figure that contradicts its chapter is a bug.
- Performance: nothing runs until the kit calls you; precompute heavy data once in `init` (or lazily on first
  use) and never per frame; keep a frame under about 4 ms; cap work per frame when a slider is dragged; reuse
  typed arrays; no timers of your own, no listeners on `window` or `document` beyond what the kit offers.
- Works at 400 px and at 1,920 px window width, in the light and the dark theme, with reduced motion (show the
  final or a representative state and keep the controls working), with touch and with mouse.
- Controls are few and named in plain words. Defaults show the figure's point without any interaction.
- Keep each module small and readable: roughly 100 to 250 lines, no dependencies, state inside the module's
  function. Shared constants are fine; copy-pasted helpers across your own modules are not, so ask in your
  report if several figures need a helper the kit should own.

## How to test

Build and check into a scratch folder of your own, so that parallel authors do not overwrite each other:

```
node build/build.mjs riemann --draft --out <scratch>/out
node build/check.mjs --file <scratch>/out/riemann/index.html --figures --out <scratch>/shots
```

`<scratch>` is a folder you create under
`C:\Users\LOGANH~1\AppData\Local\Temp\claude\2171e01994828ad9\d19dc8fd-5de5-4942-aa9a-02a63d36904c\scratchpad`
with a name of your own. `--draft` turns figures that other authors have not written yet into placeholders. The
check captures every figure at 400 and 1,920 px in both themes: open the captures of your figures with the Read
tool and look at them. Fix clipped or overlapping labels, low contrast, cramped controls, empty space, and
anything that does not match the spec, then capture again. Also read the check's console-error and long-task
report. Another agent is changing the build's internals at the moment, so if a build fails for a reason outside
your files, wait a minute and retry before reporting it.

## Since the pilot (2026-11-21)

The kit was extended after the first eight figures were written, and `shared/viz/README.md` documents all of it.
These points bind every author:

- **House style.** Read two finished modules before you write: `problems/riemann/viz/prime-staircase.js` and
  `problems/riemann/viz/zero-wave.js`. Your figures should look like they belong on the same page: the same
  stage, line weights, label sizes, control placement, and use of color.
- **Use the kit, do not hand-roll.** Axes and ticks come from `P.axes`, number formatting from `Kit.fmt`,
  legends and readouts from `fig.legend` and `fig.panel`, hover readouts from `fig.probe`, text with math from
  `fig.mathText`, dense staircases and curves from `P.stairs` and `P.columns`, zero markers from `P.zeros`, and
  smooth retargeting from `fig.follow`. Sliders take `scale: 'log'`.
- **No heavy work in `init`.** Anything that costs more than about 2 ms (a sieve, a table of sums over zeros, a
  grid of complex values) is built with `fig.job`, `Kit.task`, or `Kit.math.sieveTask`, in slices, and the
  figure draws a sensible partial state until the data is ready. The check runs at 4x CPU slowdown, where a
  100 ms `init` is a visible freeze. Shared tables (primes, zeros) come from the kit so that figures do not each
  build their own.
- **Test only your own figures.** Pass their names:
  `node build/check.mjs --file <scratch>/out/riemann/index.html --figures name-a name-b --skip-scroll --out <scratch>/shots`.
  A full check of the page is the coordinator's job.
- **Minus signs** in canvas text are the true minus sign; `Kit.fmt` does this for you.
- If the kit lacks something, build the figure with what exists and name the gap in your report. Do not edit
  `shared/`.

## What the first 64 figures taught us (2026-11-21)

- **Known kit issues, being fixed by the kit's owner right now. Do not spend time diagnosing them, and do not
  work around them in ways that will look wrong once they are fixed:** `fig.panel` rows overlap when a label has
  tall math, and a long `hint` overflows its backing; `Kit.fmt.sig` and `Kit.fmt.step` round some values
  wrongly (check what they print); superscript digits render badly in the monospace canvas font; a slider's
  range cannot change after creation; a drag handle cannot be hidden; a button's label cannot change. New
  documented helpers for these are arriving; if one you need is missing when you write, use the simplest
  workaround and name it in your report.
- **Two check numbers that are not yours.** Whichever figure the check starts first is charged about 150 ms of
  page-wide setup, and the per-frame average the check prints covers only the first few frames, which include
  label creation. Measure your own steady-state frame cost while a control is being dragged or a player runs,
  at full speed and at 4x CPU slowdown, and report those numbers. The budget is a median of 4 ms at full speed
  and no frame over 16 ms at 4x.
- **The machine is short of memory when many checks run at once.** Run one check at a time, close the browser
  when it ends, and do not leave watch loops running.
- **When a spec is mathematically off, follow the chapter and say so.** Several specs were: an arrow that added
  where the text multiplied, a truncated sum that contradicted "the two sides always agree", a wrong power in
  a dual formula. The chapter's prose and the numbers it prints are the authority; the spec is a sketch.
- **Colors mean one thing each** (`NOTATION.md`, "Colors in figures"). Violet is the critical line and nothing
  else; blue is a smooth estimate or main term; red is an error or something hypothetical. A hypothetical object
  is drawn in red and labeled as hypothetical.
- **Phone width.** Shorten or drop secondary labels instead of shrinking type; keep every panel at least about
  110 px tall; check that tick labels do not collide with data labels.
- **Self-checks.** Where a figure reproduces numbers the chapter prints, compare against them once at startup and
  log a console error on a mismatch, so the page's check catches drift.

## Rules

No commits. No em dashes or emojis in any text. Create only your figure modules.

## Report (under 250 words)

One line per figure: what it shows, its controls, and what you verified numerically. Every deviation from a
spec. Any kit limitation or bug you hit. Anything you are not satisfied with.

## No deletes in the repository

Never delete anything inside the repository, and never delete a path given through a shell variable: the user's
global hook asks for approval of every such command, even in bypass mode. Keep all throwaway files in your
scratch folder under the temp directory. If a file in the repository must go, name it in your report and leave it.
