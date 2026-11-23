/* The staircase pi(x) blurring into a smooth curve as the range grows, with Li(x) and x / log x as overlays.
   The range is a log-scale slider (50 to 1,000,000) that a tween follows, so zooming out is a smooth motion. */
Kit.register('prime-staircase', {
  tex: { pi: '\\pi(x)', Li: '\\operatorname{Li}(x)', xlog: '\\dfrac{x}{\\log x}' },
  init: function (fig) {
    var M = Kit.math, LIM = 1000000, steps = null, sieve = null; // jump points of pi, built once the sieve job is done
    // The sieve job starts in the first draw, so that it runs from the second frame: a slice of it took a third of
    // the first frame at 4x CPU slowdown.
    function startSieve() { if (!sieve) sieve = fig.job(M.sieveTask(LIM), { onDone: function () { steps = M.piSteps(LIM); } }); }
    var T0 = Kit.reducedMotion ? 0.4 : 0;                        // reduced motion starts at a representative range
    var frac = 0.7, running = false;                             // cursor position as a fraction of the range
    var fmt = function (v) { return Kit.fmt(Math.round(v)); };
    var xmaxOf = function (t) { return 50 * Math.pow(20000, t); };
    var clamp01 = function (v) { return Kit.clamp(v, 0, 1); };

    var cam = fig.tween(T0);                                     // the range the axes show
    var run = fig.tween(0);                                      // drives the slider during "Zoom out"
    var S = fig.slider({ label: 'Largest x', min: 0, max: 1, step: 0.001, value: T0,
      format: function (t) { return fmt(xmaxOf(t)); },
      onInput: function (t) { running = false; run.set(t); cam.to(t, 300); } });
    var showLi = fig.toggle({ label: 'Show Li(x)', value: true });
    var showXL = fig.toggle({ label: 'Show x / log x', value: false });
    fig.button({ label: 'Zoom out', onClick: function () { S.set(0); cam.set(0); run.set(0); running = true; run.to(1, 6000, 'inOutSine'); } });
    fig.onReset = function () { running = false; run.set(S.value); cam.set(S.value); frac = 0.7; };
    if (!Kit.reducedMotion) { running = true; run.to(1, 6000, 'inOutSine'); }

    var P = fig.plane({ x: [0, 50], y: [0, 17], pad: { t: 14, r: 16, b: 34, l: 56 } });
    var cur = fig.drag({ plane: P, x: 35, y: 11, r: 6, color: 'fg',
      constrain: function (x) {
        var d = x - cur.x, r = Math.round(x);                    // an arrow-key step of exactly half a unit still moves one
        if (Math.abs(Math.abs(d) - 0.5) < 1e-6) r = d > 0 ? Math.ceil(x - 1e-9) : Math.floor(x + 1e-9);
        r = Kit.clamp(r, 2, Math.floor(P.v.x1));
        return [r, M.pi(r)];
      },
      onDrag: function (x) { frac = x / P.v.x1; } });

    return function draw() {
      startSieve();
      if (running) { S.set(run.value); cam.set(run.value); if (!run.active) running = false; }
      var xmax = xmaxOf(cam.value), ctx = fig.ctx, b = P.box;
      var st = steps || M.piSteps(Math.ceil(xmax));                // until the job is done, a short table for this range
      P.view.x1 = xmax; P.view.y1 = 1.06 * M.Li(xmax); P.update();
      P.grid({ xStep: M.niceStep(xmax, b.w, 90) });
      P.axes({ x: false, format: fmt });

      // x axis: numbers, and for short ranges the primes themselves. The two rows share one line, so the prime names
      // fade out completely (x from 100 to 130) before the numbers fade in (x from 130 to 160): never both at once.
      var aTick = clamp01((260 - xmax) / 60), aName = clamp01((130 - xmax) / 30), aNum = clamp01((xmax - 130) / 30);
      fig.line(b.l, b.b + 0.5, b.r, b.b + 0.5, { color: 'muted', width: 1 });
      var step = M.niceStep(xmax, b.w, 90), v, px, edge = -1e9;
      for (v = step; v <= xmax * 1.0001; v += step) {
        px = Math.round(P.X(v)) + 0.5;
        fig.line(px, b.b - 3, px, b.b + 3, { color: 'muted', width: 1 });
        var name = fmt(v), half = 3.3 * name.length, nx = Math.min(px, fig.w - 4 - half);
        if (aNum > 0 && nx - half > edge + 6) { fig.text(name, nx, b.b + 17, { color: 'muted', size: 11.5, align: 'center', alpha: aNum }); edge = nx + half; }
      }
      if (aTick > 0) {
        var reach = -1e9;
        for (var i = 0; i < st.xs.length && st.xs[i] <= xmax; i++) {
          var p = st.xs[i];
          px = P.X(p);
          fig.line(px, b.b, px, b.b - 7, { color: 'gold', width: 1.5, alpha: aTick });
          var half = 3.2 * String(p).length;
          if (aName > 0 && px - half > reach + 3) { fig.text(String(p), px, b.b + 16, { color: 'gold', size: 10.5, align: 'center', alpha: aName }); reach = px + half; }
        }
      }

      if (showXL.value) P.plot(function (x) { return x / Math.log(x); }, { color: 'blue', width: 1.5, dash: [6, 4], from: 2 });
      if (showLi.value) P.plot(function (x) { return M.Li(x); }, { color: 'blue', width: 3.5, alpha: 0.8, from: 2 });

      // pi(x): the true staircase while steps are wider than a pixel, else one vertical stroke per pixel column
      if (M.pi(xmax) <= 1.5 * b.w) {
        P.stairs(st.xs, st.ys, { color: 'gold', width: 2.2, to: xmax });
      } else {
        fig.stroke({ color: 'gold', width: 1.8 });
        ctx.beginPath();
        var cols = Math.floor(b.w), lo = M.pi(0);
        for (var c = 0; c < cols; c++) {
          var hi = M.pi(xmax * (c + 1) / cols), cx = b.l + c + 0.5;
          ctx.moveTo(cx, P.Y(lo)); ctx.lineTo(cx, P.Y(hi)); lo = hi;
        }
        ctx.stroke();
      }

      P.label('pi', xmax * 0.9, M.pi(xmax * 0.9), { anchor: 'nw', color: 'gold', dx: 6, dy: 12 });
      if (showLi.value) P.label('Li', xmax * 0.5, M.Li(xmax * 0.5), { anchor: 'se', color: 'blue', dx: -6, dy: -8 });
      if (showXL.value) P.label('xlog', xmax * 0.6, xmax * 0.6 / Math.log(xmax * 0.6), { anchor: 'nw', color: 'blue', dx: 8, dy: 12 });

      // cursor and readout
      cur.x = Math.max(2, Math.round(frac * xmax)); cur.y = M.pi(cur.x);
      P.segment(cur.x, 0, cur.x, cur.y, { color: 'fg', width: 1, alpha: 0.4, dash: [3, 4] });
      var rows = [['x', fmt(cur.x)], ['π(x)', fmt(M.pi(cur.x))]];
      var li = M.Li(cur.x), d = li - M.pi(cur.x);
      rows.push(['Li(x)', Kit.fmt(li, 2)]);
      rows.push(['Li − π', (d >= 0 ? '+' : '−') + Kit.fmt(Math.abs(d), 2)]);
      var wide = fig.w >= 560, bw = wide ? 150 : 138, bh = wide ? 82 : 66, bx = b.r - bw - 6, by = b.b - bh - 12, rh = wide ? 15 : 14;
      fig.rect(bx, by, bw, bh, { fill: 'stage', alpha: 0.88 });
      for (var r = 0; r < rows.length; r++) {
        fig.text(rows[r][0], bx + 10, by + 19 + rh * r, { color: 'muted', size: 11.5, mono: true });
        fig.text(rows[r][1], bx + bw - 10, by + 19 + rh * r, { color: r === 3 ? 'red' : 'fg', size: 11.5, mono: true, align: 'right' });
      }
      if (wide) fig.text('drag the dot', bx + 10, by + 19 + 15 * 4 - 1, { color: 'muted', size: 10.5 });
    };
  }
});
