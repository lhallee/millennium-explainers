# Figure kit

`shared/viz/kit.js` draws the interactive figures of every explainer. A figure author writes one file,
`problems/<problem>/viz/<name>.js`, that registers one figure with the kit. This document is everything that file
needs. A complete module is at the end; working ones are in `problems/_demo/viz/` (`demo-kit.js` uses nearly
every helper below).

## How a figure gets onto the page

A chapter declares the figure (AUTHORING.md, "Figures"):

```
:::: figure {#f-zero-waves viz="zero-waves" height="420"}
Caption: the one claim the figure makes.
::::
```

The build then

1. checks that `viz/zero-waves.js` exists (with `--draft`, a missing module becomes a visible placeholder);
2. runs the module once in Node with the kit loaded, and fails unless it calls `Kit.register('zero-waves', ...)`
   exactly once with an `init` function;
3. renders every string in the module's `tex` field with KaTeX, the same way as the page's math, with the shared
   macros and the problem's `macros.yml` (so `'\\Li(x)'` works wherever the chapters can write `\Li(x)`);
4. inlines `kit.js`, `zeros.js`, and each used module once, in the order the figures first appear.

The page holds `<div class="viz" data-viz="zero-waves">` (the stage) and an empty controls row under it. The
stage is as wide as the figure box (at most 64rem) and `height` CSS pixels tall at desktop width. On a narrower
column the height shrinks in proportion, down to 60% of `height` on a phone.

## The module

```js
Kit.register('zero-waves', {
  tex: { psi: '\\psi(x)' },          // optional: math labels, rendered by KaTeX at build time
  reset: true,                        // optional: false hides the automatic Reset button
  init: function (fig) {              // called once, when the figure first comes near the screen
    // create planes, controls, draggable points, tweens, jobs, and state here; return within a few ms
    return function draw(fig) {       // called for every frame the kit decides to draw
      // draw everything, every time, from the current state
    };
  }
});
```

Rules:

- The top level calls `Kit.register` and nothing else. All state lives inside `init`. No timers, no
  `requestAnimationFrame`, no event listeners on `window` or `document`, no DOM work outside the kit's API.
- `draw` redraws the whole stage from state. The kit has already cleared the canvas, set the device-pixel
  transform, and updated every plane. Coordinates are CSS pixels.
- Use the named colors below and nothing else, so one color means one thing across the page.
- Figures have no title inside the drawing; the caption carries the claim.
- Backslashes in `tex` strings are doubled because they are JavaScript strings: `'\\zeta(s)'`.

## Lifecycle

| Event | What the kit does |
| --- | --- |
| Page load | The kit runs. Each module's code and math labels are stored in the page deflate-compressed, like the formula table, and nothing of a module runs yet. In idle time the kit reads the palette once for the page, then prepares the canvas fonts figures use most (below). |
| Figure within 600 px of the window, and the reader slows down | Waits until the figure has been near for 150 ms while the page scrolls slower than 600 px/s, or the page has stood still for 120 ms; a reader scrolling past at reading-skim speed never starts it, and its stage stays empty at its final size. A jump to an anchor starts every figure that comes near in the next 1.5 s at once. Then unpacks and runs its module, which registers itself (the figure's `data-state` is `loading` meanwhile). Then, in one task, creates the canvas and the label layer and parses the module's own math labels, which the browser measures in its next layout; in a later task, calls `init(fig)` once. A module that fails to load or register sets `data-state="error"` and logs the error. |
| Figure on screen | Draws when something changed: a control, a drag, the pointer over a probe, a resize, a theme change, or a running player, tween, follow, job, or `fig.animate()`. |
| Figure off screen, or tab hidden | Draws nothing and runs no job. A playing player keeps its place and resumes when visible again. |
| Figure more than 7 screens away | Releases its canvas memory and domain-coloring caches; its state, tables, and finished jobs stay. It resizes and redraws the next time it is on screen, so draw must not assume the canvas kept its pixels. |
| Resize | Resizes the canvas (device pixel ratio capped at 2) and redraws. |
| Theme change | Rereads the palette and redraws. Math labels follow the theme by themselves. |
| Page fonts finish loading | Measures math labels again (legends, panels, `mathText`) and redraws. |
| `prefers-reduced-motion: reduce` | Players do not autoplay and start at their `reduced` value; tweens and follows jump to their target; `fig.animate()` draws once. Every control still works, and pressing Play still plays. |

All figures share one `requestAnimationFrame` loop, and a figure that has nothing to change requests no frames.
The stage is fully contained (`contain: strict`) and the controls row contains its layout and style, so what a
figure changes (its canvas, moving labels, readouts) never makes the browser lay out or restyle the rest of the
page. The kit writes a control's text only when the text changes.

## Performance rules

- **Budget: about 4 ms per frame at 4x CPU slowdown**, the project's stand-in for ordinary hardware.
  `npm run check <problem> -- --figures [names]` measures each figure in the middle of a 1240 px window and prints
  its setup apart from its frames: its canvas and math labels, the module's `init`, its first frame (each one task),
  and the kit's one-time page setup; then
  the median and 95th percentile of its steady frames (every frame after the first, except one right after a
  resize) while it animates (its players play and it draws every frame) and, if it has a draggable point, while
  that point is dragged, at 1x and at 4x. The check fails a figure whose median steady frame is above 4 ms at
  1x, whose 95th percentile is above 16 ms at 4x, or whose labels, `init`, or first frame take more than 50 ms
  at 4x: 50 ms is a long task, one that holds back the frames of a scrolling page. In a page, `Kit.stats()` gives
  the same numbers (`prepareMs`, `initMs`, `firstMs`, `steadyN`, `medianMs`, `p95Ms`, `pageSetupMs`) and
  `Kit.resetStats()` starts a new window of steady frames.
- **The first frame is usually the costly one.** The kit keeps its own part of it small: canvas fonts are prepared
  in idle time, text widths are cached for the page, and math labels are measured before `init`. What remains is
  the module's draw: text in a size, weight, or face the kit did not prepare (below), many distinct words to
  measure (each new word costs about a hundredth of a millisecond at full speed to shape), and tables computed in the first draw.
  Compute tables in a job, and prefer the common text sizes.
- **`init` returns within a few milliseconds.** It runs while the reader scrolls, so 50 ms there is a visible
  stall (and 200 ms on a slow machine). Put any precomputation over about 2 ms in a job (below): the first
  frame draws at once with what is ready (axes, the smooth curve, "counting primes: 40%"), and the figure
  refines as the job finishes.
- **Shared tables are built once for the page.** The prime sieve (`Kit.math.sieve`, and `pi`, `psi`, `primes`,
  `vonMangoldt` built on it) is shared by every figure. Ask for the largest limit your figure needs, once, and
  as a job: `fig.job(Kit.math.sieveTask(1e6))`. A synchronous `M.sieve(1e6)` costs about 50 ms at full speed,
  and any call above the current limit rebuilds the sieve at the larger of the request and twice the old limit.
  For a table of your own that other figures could reuse, use `Kit.task(key, gen)` with a key that names it.
- Never per frame: sieves, tables of partial sums, sample grids. Fill an expensive table in a job, or a few rows
  per frame within about 2 ms with `fig.more()` until it is complete (see `demo-waves.js`).
- Draw dense data per pixel column, not per point: `P.stairs` does this by itself when the steps are denser than
  the pixels, and `P.columns` does it for any function.
- `Kit.math.Li(x)` costs about 0.4 microseconds; zeta about 3 to 17. A curve of 1,000 samples of something that
  costs 2 microseconds is 2 ms: tabulate it once when the window does not change.
- Do not read layout (`getBoundingClientRect`, `offsetWidth`) in `draw`. Use `fig.w`, `fig.h`, and plane boxes.
- Canvas text goes through `fig.text`, `fig.measure`, and the overlays, which set `ctx.font` only when it changes
  and use absolute pixel sizes and literal families. Setting `ctx.font` on the page's canvas makes the browser
  bring the page's style up to date first, so a module that sets it itself uses `fig.font(size, weight, mono)`,
  sets it once per font, and changes no DOM in `draw` (the kit writes labels and readouts after `draw` returns).
  The fonts the kit prepares are body text in 10.5 to 13 px at weights 500 and 600, 11.5 to 12.5 px at 700, and
  monospace in 11 to 12.5 px at 500; any other size costs 1 to 4 ms at full speed the first time it is used.
- Canvas text uses only characters the page's text fonts cover: printable ASCII, Latin-1, Greek letters,
  punctuation, simple arrows, super- and subscript digits, and the common operators (`− × · … ≤ ≥ ≈ ≠ ∞ √ ∑ ∫ ∂ ∈`).
  Any other character (a double-struck `𝔽`, a script letter, a rare operator) sends the browser through the system's
  fonts on first use, about 70 ms at 4x CPU slowdown; put it in a math label (`tex`) instead. The kit warns in the
  console, once per character, when `fig.text` or `fig.measure` meets one.
- Do not allocate in inner loops. `Kit.math.zetaInto(s, t, out)` writes into an array you keep.
- Numbers that change every frame are canvas text, not math labels. To put a changing number beside a math
  symbol, use `fig.mathText`, a panel row, or a legend (below).

## The figure object

| Member | What it is |
| --- | --- |
| `fig.ctx` | the 2D canvas context, in CSS pixels |
| `fig.w`, `fig.h` | stage size in CSS pixels |
| `fig.c` | the palette: `fig.c.gold` is a color string |
| `fig.t`, `fig.dt` | seconds of animation so far, and since the last frame (at most 0.05) |
| `fig.redraw()` | draw once more (controls, drags, probes, and jobs call it for you) |
| `fig.animate(on)` | draw every frame while on screen; `fig.t` advances. Use for continuous motion only |
| `fig.more()` | ask for one more frame from inside `draw`, for work spread over frames |
| `fig.onReset` | optional function called after Reset restores controls, drags, and views |
| `fig.onRelease`, `fig.onRestore` | optional functions called when the figure, more than 7 screens away, gives back its canvas memory, and when it comes back (before it resizes and redraws). A module that keeps an offscreen canvas or image data drops it in `onRelease` (set it to `null`) and rebuilds it in `draw` when it finds it missing; `fig.released` is true in between |
| `fig.activeDrag` | the draggable point being dragged with the pointer, or `null`: read it in `draw` to mark the held point |
| `fig.goTo(id, push)` | scroll the page to the element with that id, as a link to it does, and add it to the history unless `push` is `false`; throws if there is no such element. `window.MX.goTo(id, push)` still works |

### Colors

Names, from the problem's `NOTATION.md`, with the stage and ink. Each has a light-theme and a dark-theme value,
defined once in `shared/style.css` as `--viz-<name>`:

| Name | Meaning | Light stage `#fbfaf7` | Dark stage `#0c1016` |
| --- | --- | --- | --- |
| `gold` | the true arithmetic object: primes, pi, psi | `#9a6200` | `#f2c14e` |
| `blue` | the smooth estimate or main term | `#1d64a8` | `#5ab4e6` |
| `teal` | zeros and what they contribute | `#0b7a64` | `#3fcfae` |
| `red` | error, difference, a thing to notice | `#c23a2c` | `#ff6b5e` |
| `violet` | the critical line | `#7041d0` | `#b799ff` |
| `muted` | axes, grids, supporting geometry | `#6a7482` | `#8c97a6` |
| `fg` | ink: text and neutral marks | `#1b222c` | `#e8edf3` |
| `stage` | the background | `#fbfaf7` | `#0c1016` |
| `grid` | grid lines | 17% muted | 16% muted |

Every named color has a contrast ratio of at least 4.5 to 1 against its stage, so it works for text as well
as lines. `fig.color('teal', 0.3)` gives a translucent version. Any style field that takes a color takes a name.

### Canvas helpers (screen coordinates)

```js
fig.line(x0, y0, x1, y1, { color: 'muted', width: 1, dash: [4, 4], alpha: 1 });
fig.arrow(x0, y0, x1, y1, { color: 'red', width: 2, head: 9 });
fig.circle(x, y, r, { fill: 'teal', ring: 'stage', ringWidth: 2 });
fig.rect(x, y, w, h, { fill: 'stage', alpha: 0.85, color: 'muted' });   // fill and/or outline
fig.text('N = 12', x, y, { color: 'fg', size: 13, weight: 600, align: 'left', baseline: 'alphabetic', mono: false });
fig.label('psi', x, y, { anchor: 'sw', color: 'gold', dx: 4, dy: -4, size: 16, alpha: 1, id: 'psi-2' });
fig.mathText([{ tex: 'gN' }, ' = ' + Kit.fmt(g, 2)], x, y, { size: 12.5, mono: true, align: 'right' });
fig.measure('10,000', 11.5, 500, true);   // width in px of canvas text: (str, size, weight, mono), cached for the page
fig.wrap(str, 220, 11.5, 500);            // word wrap to 220 px: an array of lines; '\n' breaks; cached per figure
fig.wrapParts(['The zero ', { tex: 'rho' }, ' adds a wave'], 220, { size: 12 });   // lines of parts for mathText
fig.labelSize('psi', 13);                 // { w, h } in px of tex.psi at font size 13, cached
```

`fig.label(key, ...)` places the KaTeX rendering of `tex[key]` as an HTML overlay, so it matches the page's math.
`anchor` names the side of the label that sits at the point: `c`, `n`, `s`, `e`, `w`, `ne`, `nw`, `se`, `sw`
(`sw` puts the label's lower left corner on the point, so the label is up and to the right). A label not placed
in a frame is hidden. To show one key twice, give each a different `id`. Labels have a soft halo in the stage
color, so they read over lines.

**Superscript and subscript digits in monospace text.** Monospace faces lack most of `⁰¹²³⁴⁵⁶⁷⁸⁹⁻⁺` and
`₀₁₂₃₄₅₆₇₈₉₋₊`, so in monospace canvas text (`mono: true`, panel rows, probe readouts) the kit draws them itself as
smaller raised or lowered digits, and `fig.measure` gives the matching width. `Kit.fmt.sci(3.53e-4)` reads right in
a panel.

**Math symbols in canvas text.** Canvas text cannot set a subscript: `'γ_N = 14.13'` prints the underscore. Use
`fig.mathText(parts, x, y, opts)`, which lays out strings (canvas text) and `{ tex: key }` items (math labels) on
one line whose middle is at `y`, and returns its width; or a panel row with a `{ tex: key }` label. Its `alpha`
applies to the math labels as well as the text (a part may carry its own `alpha`). `fig.wrapParts(parts, width,
opts)` breaks such a run into lines at the spaces of its strings, never inside a `{ tex: key }` part, and returns an
array of lines to draw one by one with `fig.mathText(line, x, y, opts)`, with the same `opts`. It is not cached:
wrap again only when the width or the text changes. Plain Unicode
is safe for Greek letters (`π ψ ζ γ ρ Λ ϑ`), for `− × ≤ ≥ ≈ √ ∞`, and for digits only in super- and subscripts
(`Kit.fmt.sup(2)` is `²`, `Kit.fmt.sub(0)` is `₀`). Anything else with a sub- or superscript goes through `tex`.

### Diagrams: nodes, edges, and the selected state

A diagram of named steps and the links between them (a dependency map, a proof route, an input ledger) follows
`problems/riemann/viz/tg-route-map.js`, so the page's diagrams read alike:

- **Layout.** Positions are computed from `fig.w` and `fig.h` in `draw`, one layout for a wide stage and one for a
  phone (under 640 px), not from a plane's world coordinates. Keep the geometry of the frame in one object
  (`G[id] = { x, y, w, h }`) that drawing and hit testing both read.
- **Nodes.** A rounded rectangle (radius 6) filled with `fig.color('stage', 0.96)` and outlined in the node's
  color, 1.7 px; supporting or classical inputs are `muted`, 1.2 px, dashed `[4, 3]`. The name is `fig.text` in
  `fg` at 12 px (11 on a phone), weight 600, wrapped with `fig.wrap` to the box width; a side input's name is
  `muted`, 10.5 to 11 px, weight 500; a step number is weight 700 in the node's color.
- **Colors.** By role, from the named colors: one color per path or kind (in the route map `teal` for the spectral
  path, `gold` for the geometric path, `violet` for the end, `fg` for the start, `muted` for side inputs), and the
  same color for a node and the links that leave it.
- **Edges.** A polyline with an arrowhead (`fig.arrow`, head 8, 6 on a phone), 1.6 px, drawn over a stage-colored
  halo 4 px wider, so a link that crosses another stays readable. Links from side inputs are dashed.
- **Selected state.** Hovering (`fig.probe` with `crosshair: false, marker: false`) or tapping (its `pick`) selects
  a node; a tap pins it until tapped again. The selected node's outline is 2.6 px; the nodes and links that
  depend on it keep full strength, links on the path 2.4 px, and everything else fades: other nodes to alpha 0.3,
  other links to 0.22, and a link a control has made unnecessary to 0.3. A box at the top or bottom, away from the node, shows the node's name, its
  chapter, and one wrapped sentence; with nothing selected it shows a one-line hint in `muted`.
- **Links into the page.** A button that jumps to the section a node stands for calls `fig.goTo(id)`.

### Numbers: `Kit.fmt`

Every number shown to the reader goes through `Kit.fmt`, so the page has one style: thousands separators, the
minus sign `−` (U+2212), and powers of ten with superscripts. Axes and slider readouts use it by default.

| Call | Gives |
| --- | --- |
| `Kit.fmt(1234567)`, `Kit.fmt(-1234.567, 2)` | `1,234,567`, `−1,234.57` (default: 0 decimals for integers, else 2) |
| `Kit.fmt(v, { digits: 1, sign: true, sep: false })` | options form; `sign` adds `+`, `sep: false` drops separators |
| `Kit.fmt.signed(13.2, 1)` | `+13.2` (zero has no sign) |
| `Kit.fmt.sci(1.5e6)`, `Kit.fmt.sci(1e6)` | `1.5×10⁶`, `10⁶` |
| `Kit.fmt.pow10(-3)` | `10⁻³` |
| `Kit.fmt.compact(v, digits)` | plain digits from 0.001 to 100,000, `sci` outside |
| `Kit.fmt.sig(v)` | about three significant digits: `1,127`, `45.3`, `0.123`, `0.0278`, `1.13×10⁵`; below 0.01 as a power of ten, `2.78×10⁻³` |
| `Kit.fmt.step(0.5)` | a formatter with as many decimals as the step has: `−1.0`, `2.5` for 0.5, `0.75` for 0.25 |
| `Kit.fmt.complex(0.5, -14.13, 2)` | `0.50 − 14.13i`; with `'sig'` for the digits, each part by `fmt.sig`: `0.0278 − 1.13×10⁵i` |
| `Kit.fmt.sup(n)`, `Kit.fmt.sub(n)` | superscript and subscript digits and signs; any other character throws |

### Planes (world coordinates)

```js
var P = fig.plane({
  x: [0, 40], y: [0, 44],                 // the visible window in world units
  pad: { t: 14, r: 16, b: 28, l: 44 },    // room for tick labels, in CSS pixels (a number pads all sides)
  equal: false,                           // true: one unit is as long on both axes; the window grows to fit
  xLog: false, yLog: false,               // true: a logarithmic axis (its window must be above 0)
  box: [0, 0, 1, 1],                      // optional: the part of the stage the plane (with its pad) takes
  panZoom: false                          // true: drag to pan, Ctrl+wheel and Zoom buttons to zoom
});
```

**Boxes.** Each of the four edges `[left, top, right, bottom]` is a number (a fraction of the stage width or
height) or a string in pixels: `'48px'` from the left or top, `'-48px'` from the right or bottom, or a mix such
as `'50% + 10px'` or `'100% - 44px'`. For a layout that needs arithmetic, `box` may be a function
`(w, h) => [l, t, r, b]` in pixels, called every frame. Change a box later with `P.setBox(box)`.

```js
// a main plot over a strip 60 px tall, at every stage size
var main = fig.plane({ x: [2, 60], y: [0, 62], box: [0, 0, 1, '-60px'] });
var strip = fig.plane({ x: [0, 400], y: [0, 1], box: [0, '-60px', 1, 1], pad: { t: 6, r: 16, b: 18, l: 44 } });
// an inset in the upper left, at most 180 x 150 px
var inset = fig.plane({ x: [-0.5, 1.5], y: [0, 60], pad: { t: 6, r: 6, b: 18, l: 26 },
  box: function (w, h) { return [60, 16, 60 + Math.min(180, 0.3 * w), 16 + Math.min(150, 0.38 * h)]; } });
```

| Method | Draws or returns |
| --- | --- |
| `P.X(x)`, `P.Y(y)` | screen position of a world coordinate |
| `P.toWorld(px, py)` | `[x, y]` for a screen point |
| `P.box` | `{ l, t, r, b, w, h }` in screen pixels inside the pad; `P.outer` is the same with the pad; `P.v` is the window actually shown |
| `P.view` | the window to change for motion (`P.view.y0 = c - 12`); call `P.update()` after changing it in `draw` |
| `P.grid({ xStep, yStep, xTicks, yTicks })` | grid lines in `grid` color at the axes' ticks (minor log ticks fainter) |
| `P.axes(opts)` | axes, ticks, and number labels; options below |
| `P.plot(f, { color, width, dash, alpha, from, to, step })` | `y = f(x)`, sampled adaptively: pieces split while the midpoint is more than half a pixel off the chord, up to 6 times. `NaN` or `Infinity` breaks the curve |
| `P.path(xs, ys, style)` or `P.path([[x, y], ...], style)` | a polyline; `close: true` and `fill: 'blue'` shade it |
| `P.stairs(xs, ys, { y0, from, to, columns, ...style })` | a staircase that steps to `ys[i]` at `xs[i]` (ascending; see `Kit.math.psiSteps`). When more than 1.5 steps fall in a pixel it draws one stroke per pixel column from the column's lowest to highest value; `columns: true` or `false` forces the choice |
| `P.columns(fn, style)` | one stroke per pixel column: `fn(xa, xb, out, c)` writes the lowest and highest value over `[xa, xb]` into `out[0]`, `out[1]` (leave `NaN` to skip). For anything denser than the pixels, such as an error term with a jump at every prime |
| `P.stems(xs, ys, { base, dot, from, to, ...style })` | a line from `base` (default 0) up to each `ys[i]` at `xs[i]`, for a discrete function such as Lambda(n); `ys` may be a function of x; `dot: 2.5` adds tips |
| `P.rug(values, { color, width, alpha, start, end, y0, y1 })` | a tick at each value of an ascending list over the box's height (or world `y0` to `y1`): a spectrum of zero ordinates. `start` and `end` pick an index range, for example the first N |
| `P.fillBetween(top, bottom, a, b, { color, alpha, edges })` | shaded region; `top` and `bottom` are functions or numbers; `edges: true` (or a style) strokes both boundaries |
| `P.segment(x0, y0, x1, y1, style)`, `P.vline(x, style)`, `P.hline(y, style)` | lines, clipped to the box |
| `P.arrow(x0, y0, x1, y1, style)` | arrow in world coordinates |
| `P.point(x, y, { color, r, ring })` | a dot with a ring in the stage color |
| `P.text(str, x, y, style)`, `P.label(key, x, y, opts)` | canvas text and math labels at world coordinates |
| `P.frame({ fill, alpha, color })` | a background and border on `P.outer`: draw it first for an inset over another plane |
| `P.critical({ strip, line, label, width })` | the critical strip `0 < Re s < 1` lightly shaded with dashed edges, and the critical line `Re s = 1/2` in `violet` over a halo; `label` is a tex key placed at the line's top |
| `P.zeros({ count, color, r, sigma, mirror })` | the nontrivial zeros `1/2 + i gamma` from `Kit.zeros` inside the window (the first `count`), with their conjugates below 0 unless `mirror: false` |
| `P.clip(fn)` | run `fn` clipped to the box |
| `P.zoom(k, x, y)`, `P.pan(dpx, dpy)` | zoom by `k` about a world point, or shift by a drag in pixels (log axes zoom in log units) |
| `P.domain(f, opts)` | domain coloring, below (linear axes only) |

Curves and fills are clipped to the box; axes and tick labels are not.

**Axes.** `P.axes(opts)`, all optional:

| Option | Effect |
| --- | --- |
| `origin: [x, y]` | where the axes cross (default `(0, 0)`, held inside the window) |
| `edge: true`, or `xAt: 'bottom'`, `yAt: 'left'` | put the x axis on the box's bottom edge and the y axis on its left edge, with ticks pointing out, whatever the origin |
| `yAt: 'right'` | put the y axis on the box's right edge, ticks and labels pointing out to the right (give them room with the plane's right pad); for a second scale, call `axes` twice, once with `x: false` |
| `x: false`, `y: false`, `ticks: false` | drop an axis, or the ticks and labels |
| `xStep`, `yStep` | tick spacing (default: a 1, 2, 5 step near 90 px apart on x and 60 px on y) |
| `xTicks`, `yTicks` | custom ticks: numbers, `[value, 'text']`, `{ at, text }`, or `{ at, tex: key }` for a math label |
| `format`, `xFormat`, `yFormat` | `function (value, step)` for the labels (default `Kit.fmt.step(step)`; log axes `Kit.fmt.compact`) |
| `xLabel`, `yLabel` | tex keys naming the axes, at the right end of the x axis and the top of the y axis |
| `color`, `size` | color name (default `muted`) and label size (default 11.5) |

A tick label that would overlap the one before it is skipped, and an x label that would leave the stage is
moved inside (give the y labels room with the plane's left pad). On a log axis the ticks are the powers of
ten, with 2 and 5 (or 3) between them when a decade is wide and every second or third power when decades are
narrow.

```js
var P = fig.plane({ x: [2, 1e6], y: [0, 80000], xLog: true, pad: { t: 10, r: 16, b: 26, l: 56 } });
P.grid();
P.axes({ edge: true, xLabel: 'x' });                       // 10, 100, 1,000, 10,000, 1.0×10⁵ ... on the bottom
P.axes({ xTicks: [[0, '0'], { at: 0.5, tex: 'half' }, [1, '1']], yStep: 10 });
```

### Domain coloring

```js
P.domain(function (x, y, w) { Kit.math.zetaInto(x, y, w); }, { rev: 'zeta' });
```

`f(x, y, w)` writes Re and Im of the value at `x + iy` into `w[0]` and `w[1]`. Hue is the argument (red for
positive reals, then yellow, green, cyan, blue, magenta), and lightness is `0.5 + 0.42 tanh(0.7 log |w|)`: zeros
are black, poles white, and `|w| = 1` is the pure hue. Faint bands mark each doubling of `|w|`.

The image is computed into cached offscreen canvases: first a coarse grid of at most `coarse` samples (default
400) in one frame, then grids of half the spacing down to `finest` CSS pixels (default 2), spending at most
`budget` ms (default 2.5) per frame. A change shows at once and sharpens over the next frames, so sliders and drags
stay smooth. The cache is reused until the window, the box size, or `rev` changes: pass in `rev` anything the
function depends on (`rev: a.value + ',' + b.value`). Moving a point drawn over the coloring costs nothing.
Options: `rev`, `key` (for two colorings in one plane), `finest`, `coarse`, `budget`, `alpha`, `saturation`, and
`mode: 'modulus'`, which draws only the lightness of `|w|` (with its bands) in grey, no hue. With `alpha` below 1 the
image shows only finished levels, so a translucent image never darkens where a level in progress overlaps one below.

### Legends and readout panels

```js
fig.legend([
  { color: 'gold', tex: 'pi' },                            // a line sample and a math label
  { color: 'blue', tex: 'Li', dash: [6, 4], width: 1.5 },
  showBand.value && { color: 'muted', fill: true, text: 'band' },   // falsy items are skipped
  { color: 'teal', dot: true, text: 'zeros' }
], { plane: P, dir: 'col', at: 'auto', prefer: ['ne', 'nw', 'se', 'sw'] });

fig.panel([
  ['x', Kit.fmt(x)],                                       // [label, value, color]
  [{ tex: 'pi' }, Kit.fmt(M.pi(x)), 'gold'],               // a math label
  narrow ? null : [{ tex: 'diff' }, Kit.fmt.signed(d, 2), 'red']   // null rows are skipped
], { plane: P, at: 'se', hint: 'drag the dot' });
```

Both return their rectangle `{ x, y, w, h }`. Draw them last in `draw`: they are placed against what was drawn
before them.

- **Placement** (legends, panels, and probe readouts): `at` is a corner or side of the plane's box (`'nw'`,
  `'n'`, `'ne'`, `'e'`, `'se'`, `'s'`, `'sw'`, `'w'`) or `'auto'` (the default), which takes the corner in
  `prefer` whose area holds the fewest drawn curves, points, panels, legends, and draggable points, and keeps it
  until another is clearly better, so it does not flicker. `x`, `y` place the top left corner exactly; `margin`
  (default 8) sets the gap to the box. Marks the kit did not draw itself (an image, a grid of canvas text) count
  only when the module says so: `fig.occRect(x, y, w, h)` and `fig.occSeg(x0, y0, x1, y1)` mark a rectangle or
  a segment of the stage, in screen pixels, as drawn in this frame; call them in `draw` before the legend or panel.
- **Legend items**: `color`, `tex` or `text`, and the sample: a line (default, with `width`, `dash`, `alpha`),
  `dot: true`, or `fill: true`. `labelColor` overrides the label's color. `dir: 'row'` lays the items in a row
  that wraps at the plane's width, which suits a phone; `size` (default 13); `bg: false` drops the backing.
- **Panel rows**: labels are muted monospace text or `{ tex: key }` math in the row's color; values are
  right-aligned monospace in the row's color (default `fg`). A row with a tall math label (a fraction, a
  superscript on a tall base) is as tall as the label; the panel is as wide as its hint. The value column keeps its widest width so the
  panel does not jitter as numbers change. `compact` (default: when the plane is under 480 px wide) uses a
  smaller font and lays more than three rows in two columns, so six rows fit at phone width; `hint` adds a
  muted line (dropped when compact); `id` keeps two panels apart.

### Probe: hover readouts and click-to-place

```js
var cursor = 100;
fig.probe({
  plane: P,
  snap: function (x, y) { var n = Math.round(x); return [n, M.pi(n)]; },   // optional: a point on a curve, or null
  crosshair: 'x',                                // 'x' (default), 'y', 'both', or false
  rows: function (x, y) { return [['x', Kit.fmt(x)], [{ tex: 'pi' }, Kit.fmt(y), 'gold']]; },   // the readout
  pick: function (x, y) { cursor = x; }          // optional: a click or tap inside the plane
});
```

While the pointer is over the plane, the kit draws (after `draw`, before draggable points) the crosshair, a
marker at the snapped point, and a panel of `rows` beside the pointer (or at a corner with `panel: 'ne'`). The
returned object has `active`, `x`, `y` (snapped, in world units), updated before each `draw`, so `draw` can also
highlight what the pointer is on. It costs nothing while the pointer is elsewhere: no frames are requested. On a
touch screen a tap shows the probe there and it stays until a tap outside the plane; horizontal drags move it,
vertical ones scroll the page. `pick` turns a click or tap into input, for figures where a draggable dot would
only be a cursor.

### Controls

Controls are HTML under the stage, in the order created, with a Reset button added at the end. Each returns an
object whose `.value` you read in `draw`; changing a control redraws.

```js
var N = fig.slider({ label: 'Zeros', tex: 'N', min: 0, max: 200, step: 1, value: 10, onInput: function (v) {} });
var X = fig.slider({ label: 'Largest x', min: 100, max: 1e6, scale: 'log', value: 1e4,
  marks: [1e3, 1e4, 1e5], snap: [1e2, 1e3, 1e4, 1e5, 1e6] });
var b = fig.slider({ label: 'Real part', min: 0.3, max: 0.9, step: 0.01, value: 0.5,
  marks: [{ at: 0.5, color: 'violet', title: 'critical line' }], format: function (v) { return 'β = ' + v.toFixed(2); } });
var g = fig.slider({ label: 'Height', min: 10, max: 100, step: 0.01, snap: zerosBelow100, marks: zerosBelow100 });
var k = fig.slider({ label: 'Modulus', values: [3, 4, 5, 7, 8, 11] });       // steps through a list
var on = fig.toggle({ label: 'Main term', value: true, onInput: function (v) {} });
var mode = fig.select({ label: 'Show', options: [['psi', 'psi'], ['pi', 'pi']], value: 'psi', onInput: function (v) {} });
var p = fig.player({ duration: 8, loop: false, autoplay: true, value: 0, reduced: 1, label: 'Time' });
var q = fig.player({ label: 'Zero pairs', min: 0, max: 200, duration: 11, pace: function (u, n) { return n < 20 ? 1 : n / 20; },
  format: function (n) { return String(Math.round(n)); } });
fig.button({ label: 'Add a zero', onClick: function () { k++; } });
var on = fig.button({ label: 'Zeros', pressed: true, onClick: function () { on.press(!on.pressed); } });   // a toggle button
```

- `label` is plain text; `tex` names a key of the module's `tex` to show math after it. `onInput(value)` runs
  when the reader changes a slider, toggle, or select (not when code calls `set`).
- **Sliders** show their value live (default format `Kit.fmt.step(step)`, or `Kit.fmt.sig` on a mapped scale
  without a `step`). `scale: 'log'` (min above 0), `'sqrt'`, or `{ to: function (u) {...}, from: function (v) {...} }`
  maps the track position `u` in [0, 1] to the value; with a mapped scale, `step` rounds the value and the arrow
  keys move 1% of the track (Shift: 5%). `values: [...]` makes the slider step through an ascending list.
  `snap: [...]` pulls a dragged value onto an entry within 1.5% of the track (`snapWithin`), but not a value
  stepped with the keyboard. `marks: [...]` draws ticks under the track at values or `{ at, color, title }`.
  `S.set(v)` moves it from code. `S.setRange(min, max, step)` gives a slider made with `min` and `max` a new range
  (and, if given, a new step), keeps its value clamped to it, and moves its marks; `step` is optional.
- **Players** are a Play/Pause button and a scrubber. `p.value` is the position, from 0 to 1 over `duration`
  seconds while playing and on screen; dragging the scrubber pauses and sets it. `value` is the starting
  position (default 0). With `min` and `max` (and optionally `scale`), `p.mapped` is the value the position
  stands for, `format` receives `p.mapped`, and `p.seek(v)` moves to the position of a mapped value.
  `pace(u, mapped)` is a relative speed (any positive function): the player moves faster where it is larger and
  still takes `duration` seconds in all. `p.play()`, `p.pause()`, `p.set(u)`, `p.playing`.
- **Reset** calls every control's `.reset()`: sliders, toggles, and selects return to their `value`; a player
  returns to its `value` and plays again if `autoplay` (with reduced motion: to `reduced`, which defaults to
  `value` if given and else 1, without playing). Then draggable points go back, plane windows are restored, and
  `fig.onReset` runs.
- **Showing and enabling**: every control has `c.show(on)` and `c.enable(on)` (buttons and draggable points too),
  cheap when nothing changes, so `draw` may call them every frame: `T.show(mode.value === 'zeros')`.
- **Buttons**: `b.setLabel(text)` changes the text (only when it differs). With `pressed: true` or `false` a button
  is a toggle button (`aria-pressed`, drawn highlighted while pressed): `b.press(on)` sets it and `b.pressed`
  reads it, so a row of buttons can act as a selector, each pressing itself and releasing the others.

### Draggable points

```js
var s = fig.drag({
  plane: P, x: 0.5, y: 14.13,          // start, in world coordinates
  r: 7, color: 'fg',
  step: [1, 0],                        // optional: round x to whole numbers (a number rounds both axes)
  label: 's', labelAnchor: 'sw',       // optional math label beside the point
  constrain: function (x, y) { return [0.5, Math.max(0, y)]; },   // optional: keep it on a line or in a region
  onDrag: function (x, y) {},          // optional
  onStart: function (x, y) {},         // optional: the pointer takes the point
  onEnd: function (x, y) {}            // optional: the pointer lets go
});
// in draw: s.x, s.y; fig.activeDrag === s while it is held
s.show(false);                         // hide it: not drawn, not draggable (s.show() shows it again)
s.enable(false);                       // grey it out and stop dragging
```

The kit draws the point after `draw`, so it is always on top, with a halo while hovered or dragged. It works with
mouse, pen, and touch: a touch that starts on a point drags it, and any other touch scrolls the page. Pressing a
point focuses the canvas; the arrow keys then move the last dragged point by one `step` (Shift: ten), or without
a step by 1% of the window (Shift: 5%). `step` rounds before `constrain` runs.

### Motion: tweens and follows

```js
var a = fig.tween(0);                 // a.value is the animated number; a.active while it moves
a.to(1, 600, 'inOutCubic');           // target, milliseconds, easing name or function
a.set(0);                             // jump

var cam = fig.follow(Math.log10(X.value), { tau: 0.12 });
// in draw: chase the slider; a changed target bends the motion from the current velocity, without a jerk
var xmax = Math.pow(10, cam.to(Math.log10(X.value)).value);
```

A tween runs a fixed course and restarts from rest when retargeted; use it for a scripted move. A follow is a
critically damped spring: `to(target)` keeps the current velocity, so a value chased by a slider, a drag, or a
player moves smoothly however often the target changes. `tau` (seconds, default 0.12) sets the pace: about 90% of
a jump in 4 tau. `to()` with an unchanged target costs nothing, so call it every frame. `set(v)` jumps; `value`,
`target`, `velocity`, `active`.

Easings in `Kit.ease`: `linear`, `inQuad`, `outQuad`, `inOutQuad`, `inOutCubic` (default), `outCubic`,
`inOutSine`, `smooth`. Also `Kit.clamp(v, lo, hi)`, `Kit.lerp(a, b, t)`, `Kit.lowerBound(arr, x)` (first index with
`arr[i] >= x`), and `Kit.upperBound(arr, x)` (first index with `arr[i] > x`) for ascending arrays.

### Jobs: precomputation in slices

```js
var steps = null;
var sieve = fig.job(Kit.math.sieveTask(1e6), { onDone: function () { steps = Kit.math.piSteps(1e6); } });
var table = fig.job(function* () {                 // a job of your own: a generator that yields now and then
  var rows = new Float64Array(200 * 1800);
  for (var k = 0; k < 200; k++) { /* fill row k */ yield k / 200; }   // yield a progress fraction, or nothing
  return rows;
});
// in draw
if (!sieve.done) fig.text('counting primes: ' + Math.round(100 * sieve.progress) + '%', x, y, { color: 'muted' });
if (table.done) P.path(xs, table.result.subarray(0, 1800), { color: 'teal' });
```

`fig.job(task or generator function, { budget, onDone })` runs the work inside this figure's frames, at most
`budget` ms (default 3) per frame, only while the figure is on screen, and redraws when it finishes. The returned
task has `done`, `progress` (the last number yielded), and `result` (the generator's return value). Yield often
enough that a slice between yields takes well under a millisecond. `Kit.task(key, generator)` makes a task shared
by the whole page: the first figure that runs it does the work, and every figure that asks for the same key gets
the same task, finished or not. `Kit.math.sieveTask(n)` is the shared sieve as such a task; until it is done,
call `pi`, `psi`, and `primes` only below `Kit.math.sieveLimit()`, since a call above the limit sieves at once.

## Math helpers: `Kit.math`

Complex numbers are plain objects `{ re, im }`.

```js
var M = Kit.math;
var z = M.C(0.5, 14.13);
M.add(a, b); M.sub(a, b); M.mul(a, b); M.div(a, b); M.scale(a, k); M.conj(a);
M.abs(z); M.arg(z); M.exp(z); M.log(z); M.pow(a, b); M.sqrt(z); M.sin(z); M.cos(z); M.polar(r, theta);
```

| Function | Returns |
| --- | --- |
| `M.zeta(s)` or `M.zeta(sigma, t)` | zeta as `{ re, im }` |
| `M.zetaInto(sigma, t, out)` | writes zeta into `out[0]`, `out[1]`; no allocation, for loops |
| `M.gamma(z)`, `M.lgamma(z)` | Gamma and log Gamma for complex `z` |
| `M.lgammaInto(re, im, out)` | writes log Gamma into `out[0]`, `out[1]`; no allocation, for loops over pixels |
| `M.rsTheta(t)`, `M.Z(t)` | Riemann-Siegel theta and `Z(t) = e^{i theta(t)} zeta(1/2 + it)`, real; its sign changes are the zeros |
| `Kit.zeros` | ordinates of the first 200 nontrivial zeros, `14.1347251417, 21.0220396388, ...` (from mpmath) |
| `M.explicitPsi(x, N)` | `x - sum over the first N zero pairs of x^rho/rho - log(2 pi) - log(1 - x^-2)/2` |
| `M.sieve(n)`, `M.isPrime(n)`, `M.primes(n)` | prime sieve (shared, grown on demand; see the performance rules), test, and the primes up to `n` |
| `M.sieveTask(n)`, `M.sieveLimit()` | the sieve grown to `n` as a shared task for `fig.job`, and the current limit |
| `M.mertensTask(n)` | the Moebius function and the Mertens function up to `n` as a shared task: its result is `{ mu, M }`, an `Int8Array` with `mu[k]` and an `Int32Array` with `M[x] = mu(1) + ... + mu(x)` |
| `Kit.zeroOrdinates(n)` | the first `n` ordinates (default and at most 1,500) as a `Float64Array`, each the double nearest the true value, from mpmath; decoded the first time it is called, so it costs nothing until a figure asks. `Kit.zeros` stays the 200-entry table |
| `M.pi(x)`, `M.psi(x)`, `M.vonMangoldt(n)`, `M.mobius(n)` | prime counting function, Chebyshev psi, Lambda, mu |
| `M.piSteps(X)`, `M.psiSteps(X)` | `{ xs, ys }` jump points for `P.stairs` |
| `M.li(x)`, `M.Li(x)` | logarithmic integral (Ramanujan's series) and `li(x) - li(2)` |
| `M.niceStep(range, pixels, target)` | a 1, 2, or 5 times a power of ten tick spacing |
| `Kit.scale(spec, min, max)` | `{ to(u), from(v) }`, the slider and player maps: `'linear'`, `'log'`, `'sqrt'`, or custom |

```js
M.psi(10);                 // 7.8322...
M.zeta(2, 0).re;           // 1.6449...
M.Z(14.134725);            // about 0
M.li(1e6);                 // 78627.549...
```

### Methods and accuracy

- **zeta**, for `Re s >= 1/2` (and `|s| < 1/2`): Euler-Maclaurin summation with `N = ceil((|s| + 24) / 2.2)`
  terms and twelve Bernoulli corrections, so each correction shrinks by a factor of at most `0.35^2`. For
  `Re s < 1/2`: the functional equation `zeta(s) = 2^s pi^(s-1) sin(pi s/2) Gamma(1-s) zeta(1-s)`, with the factor
  computed in logarithms so that it neither overflows nor underflows at `|t| = 200`. Trivial zeros are exact.
  Cost on a laptop: about 3 microseconds per value near `t = 20`, 5 near `t = 60`, 17 near `t = 200`.
- **Gamma**: reflection for `Re z < 0`; otherwise the recurrence shifts `z` until `|z| >= 15` and Stirling's
  series with eight terms finishes. For `Re z >= 0` log Gamma is the continuous branch, which `rsTheta` relies on.
- **li**: Ramanujan's series, summed to double precision.

Tested by `npm run test:kit` against mpmath 1.3.0 at 30 digits (`build/gen_kit_data.py` writes the reference
values and the zero table), together with the number formats, the scales, and the sliced sieve. Relative error,
or absolute error where the true value is below `1e-6`:

| s | error | s | error |
| --- | --- | --- | --- |
| 2 | 0 | 1 + i | 1.0e-16 |
| 0.5 + 14.134725i (near a zero) | 1.2e-15 abs | 0 | 0 |
| 0.5 + 100i | 6.3e-15 | -2 (trivial zero) | 0 abs |
| 0.5 + 199.5i | 1.1e-14 | -3.5 - 80i | 3.9e-14 |
| 3 + 50i | 6.4e-16 | -5 + 30i | 1.8e-14 |
| 0.75 + 150i | 5.0e-14 | -10 + 0.5i | 3.3e-15 |
| 0.2 + 7i | 5.2e-15 | -10 + 200i | 1.5e-13 |
| 1.5 + 0.1i (near the pole) | 1.8e-16 | 10 + 200i | 6.7e-16 |
| 5 - 150i | 1.7e-16 | -0.3 + 120i | 8.2e-14 |

The worst error is 1.5e-13, far inside the promised 6 digits on `|t| <= 200`, `-10 <= sigma <= 10`. Gamma at six
points is within 1.0e-14, `Z(t)` at six points within 4.0e-13, and `li` at five points within 2.2e-16.

## A complete minimal module

`problems/<problem>/viz/li-vs-pi.js`, drawn by `:::: figure {#f-li viz="li-vs-pi" height="380"}`:

```js
/* The prime count against Li(x), with a slider for how far we count and a hover readout. */
Kit.register('li-vs-pi', {
  tex: { pi: '\\pi(x)', Li: '\\Li(x)', x: 'x' },
  init: function (fig) {
    var M = Kit.math, fmt = Kit.fmt, steps = null;
    fig.job(M.sieveTask(1000), { onDone: function () { steps = M.piSteps(1000); } });   // tiny here; the pattern scales
    var X = fig.slider({ label: 'Count up to', min: 20, max: 1000, step: 10, value: 200 });
    var cam = fig.follow(X.value);
    var P = fig.plane({ x: [0, 200], y: [0, 50], pad: { t: 12, r: 16, b: 26, l: 44 } });
    fig.probe({ plane: P, snap: function (x) { var n = Math.max(2, Math.round(x)); return steps ? [n, M.pi(n)] : null; },
      rows: function (x, y) { return [[{ tex: 'x' }, fmt(x)], [{ tex: 'pi' }, fmt(y), 'gold'], [{ tex: 'Li' }, fmt(M.Li(x), 1), 'blue']]; } });

    return function draw() {
      var x = cam.to(X.value).value;
      P.view.x1 = x; P.view.y1 = M.Li(x) * 1.15; P.update();   // the window follows the slider smoothly
      P.grid();
      P.axes({ edge: true });
      P.plot(function (t) { return t > 2 ? M.Li(t) : 0; }, { color: 'blue', width: 2 });
      if (steps) P.stairs(steps.xs, steps.ys, { color: 'gold', width: 2.5 });
      fig.legend([{ color: 'gold', tex: 'pi' }, { color: 'blue', tex: 'Li' }], { plane: P });
    };
  }
});
```

Check a new figure with `npm run build <problem> -- --draft` and `npm run check <problem> -- --figures`, then look
at the captures in `.check/` at 400 and 1920 px in both themes.
