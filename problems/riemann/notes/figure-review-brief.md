# Brief for the visual review of the figures

All 95 interactive figures of the Riemann page exist and run without console errors. They were written by 24
authors in parallel, each seeing only their own chapter. You are the art director and the last pair of eyes for
one part of the page: look at every figure in your part as a reader would, and fix what is wrong in the figure
modules.

## Read first

1. `AGENTS.md`, especially "Hard limits on the built page".
2. `problems/riemann/notes/figure-brief.md`, all of it: it is what the authors were asked for, and its rules bind
   your edits (the bar, the color rules, performance, the no-deletes rule).
3. `shared/viz/README.md`: the kit. It gained helpers after most modules were written (`fig.wrap`, `fig.goTo`,
   `setRange`, `show`/`enable` on drag handles, alpha on labels, a table of 1,500 zeros, and others). Use them
   when you edit; do not rewrite a working module only to adopt them.
4. `problems/riemann/NOTATION.md`, section "Colors in figures".
5. For each figure: its `figure` container in the chapter (caption and `vizspec`) and the paragraph around it,
   and its module `problems/riemann/viz/<name>.js`.

## The captures

A full check on a quiet machine captured every figure in its default state at 400 px and 1,920 px window width
in the light and the dark theme:

`C:\Users\LOGANH~1\AppData\Local\Temp\claude\2171e01994828ad9\d19dc8fd-5de5-4942-aa9a-02a63d36904c\scratchpad\main\fullcheck\fig-<figure id>-<400|1920>-<light|dark>.png`

where `<figure id>` is the container's anchor (for example `fig-f-cp-staircase-400-dark.png`). Open them with
the Read tool. For every figure look at least at 400 px dark and 1,920 px light; open the other two when
anything looks theme-dependent. The same folder's parent holds `fullcheck.txt`, with each figure's measured
setup and frame costs at full speed and at 4x CPU slowdown.

## What to look for

1. **Does the default view make the caption's one claim visible without any interaction?** If the reader must
   move a control to see the point, change the default or add a short opening motion (reduced motion shows the
   end state).
2. **Is it right?** Labels, numbers, axes, and legends agree with the chapter's symbols and printed numbers. A
   label uses a symbol only if the chapter defines it; otherwise it uses plain words. A hypothetical object (a
   zero off the line, a moved root) is red and labeled hypothetical, on every figure of the page.
3. **Is it legible?** No clipped or overlapping text, tick labels that do not collide with data labels, no
   label sitting on a curve, contrast that works in both themes, type no smaller than about 11 px, panels at
   least about 110 px tall at phone width, controls that fit and are named in plain words, no empty half of a
   stage, no control row wider than the figure.
4. **Does it belong to the page?** Same stage, line weights, label sizes, and control placement as its
   neighbors; colors used for their one meaning (gold arithmetic object, blue smooth estimate or main term,
   teal zeros, red error or hypothetical, violet the critical line only, muted axes); the same object drawn the
   same way in different chapters (the critical strip, a staircase, a p-adic tree, a route map).
5. **Is anything decorative, redundant, or confusing?** Remove it.

Fix what you find by editing the module, with the smallest change that works. Keep each module's startup
self-checks. Do not change what a figure claims, and do not edit chapter files: if a caption or a spec is wrong,
or a chapter needs a sentence, write the exact proposed text in your report.

## Testing your edits

Build and capture into a scratch folder of your own (the name is in your assignment) under
`C:\Users\LOGANH~1\AppData\Local\Temp\claude\2171e01994828ad9\d19dc8fd-5de5-4942-aa9a-02a63d36904c\scratchpad`:

```
node build/build.mjs riemann --out <scratch>/out
node build/check.mjs --file <scratch>/out/riemann/index.html --figures name-a name-b --skip-scroll --out <scratch>/shots
```

Name only the figures you changed. Run one check at a time, wait for it to end, and leave no watch loops: other
agents are measuring timing and the machine must stay as quiet as possible. Look at the new captures before you
call a figure done. For a figure whose important state is not the default one (a toggle, a second mode, a
dragged point), write a short puppeteer script in your scratch folder that sets that state through the page and
takes a viewport screenshot (an element screenshot can come out blank), and look at it. The check prints each
figure's setup and frame costs: a figure fails if its 95th-percentile frame at 4x exceeds 16 ms or one setup
task at 4x exceeds 50 ms, so do not make a figure slower, and fix the ones your assignment names.

Another agent is tuning `shared/` and `build/` and keeps the kit's documented interface stable. If a build or a
check fails for a reason outside your files, wait a minute and retry.

## Rules

Edit only modules under `problems/riemann/viz/` that belong to your part. No commits. No em dashes or emojis in
any text. Never delete anything inside the repository, and never delete a path given through a shell variable;
keep throwaway files in your scratch folder.

## Report (under 400 words)

A table of every figure you changed: what was wrong and what you did. Figures you looked at and left alone need
no line; give their count. Then: proposed changes to captions, specs, or chapter text, with the exact wording;
anything about the kit; figures you are still not satisfied with, and why.
