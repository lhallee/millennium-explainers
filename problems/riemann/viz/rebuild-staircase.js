/* The explicit formula rebuilding psi_0(x) from zeros. Rows[k] holds the partial sum f_k on a grid of 1800 points,
   uniform in log x so that even the 200th zero (period 0.016 in log x) gets seven or more points per cycle. A row is
   the previous row plus one wave, so filling the table costs 1800 cos and sin per zero, a few rows per frame in the
   background. Any N after that is a lookup, and the morph between N values is a blend of two neighbouring rows, so
   dragging is instant even at N = 200. Three panels share the x axis: the sum against psi_0, the newest wave, and the
   spectrum of zero ordinates. */
Kit.register('rebuild-staircase', {
  tex: { psi: '\\psi_0(x)', line: 'y=x', wave: 'W_{\\rho_N}(x)', err: '\\text{formula}-\\psi_0(x)', gamma: '\\gamma', gN: '\\gamma_N', x: 'x' },
  init: function (fig) {
    var M = Kit.math, Z = Kit.zeros, NZ = Z.length, X0 = 2, X1 = 60, G = 1800, YB = -7;
    // Playback: 6 zeros per second up to N = 20, then growing 30% per second so that N = 200 comes in 11 s.
    var KNEE = 20, RATE = 6, GROW = 0.3, T0 = KNEE / RATE, DUR = T0 + Math.log(NZ / KNEE) / GROW;
    var Nf = function (v) { var t = v * DUR; return t <= T0 ? RATE * t : KNEE * Math.exp(GROW * (t - T0)); };
    var vOf = function (N) { return (N <= KNEE ? N / RATE : T0 + Math.log(N / KNEE) / GROW) / DUR; };

    var play = fig.player({ duration: DUR, label: 'Zero pairs', format: function (v) { return String(Math.round(Nf(v))); } });
    var curN = function () { return Kit.clamp(Math.round(Nf(play.value)), 0, NZ); };
    var step = function (d) { play.pause(); play.set(vOf(Kit.clamp(curN() + d, 0, NZ))); };
    fig.button({ label: 'Step back', onClick: function () { step(-1); } });
    fig.button({ label: 'Step forward', onClick: function () { step(1); } });
    var showWave = fig.toggle({ label: 'Show the wave of the current zero', value: true });
    var showErr = fig.toggle({ label: 'Show the error curve', value: false });

    var main = fig.plane({ x: [X0, X1], y: [0, 62], pad: { t: 8, r: 12, b: 2, l: 42 } });
    var wp = fig.plane({ x: [X0, X1], y: [-1.2, 1.2], pad: { t: 2, r: 12, b: 20, l: 42 } });
    var sp = fig.plane({ x: [0, 400], y: [0, 1], pad: { t: 6, r: 12, b: 16, l: 42 } });
    var a = fig.tween(0), yLow = fig.tween(0), lastN = -1, lastErr = false;

    // The table: gx, rows (Float32, (NZ + 1) x G), psi0 on the grid, and the mask of points 0.5 or more from a jump.
    var steps = M.psiSteps(X1), gx = new Float64Array(G), lx = new Float64Array(G), sq = new Float64Array(G);
    var rows = new Float32Array((NZ + 1) * G), psi0 = new Float64Array(G), far = new Uint8Array(G);
    for (var i = 0; i < G; i++) {
      var x = X0 * Math.pow(X1 / X0, i / (G - 1)), dmin = Infinity;
      gx[i] = x; lx[i] = Math.log(x); sq[i] = Math.sqrt(x); psi0[i] = M.psi(x);
      for (var j = 0; j < steps.xs.length; j++) dmin = Math.min(dmin, Math.abs(x - steps.xs[j]));
      far[i] = dmin > 0.5 ? 1 : 0;
      rows[i] = x - Math.log(2 * Math.PI) - 0.5 * Math.log(1 - 1 / (x * x));
    }
    var mid = new Float64Array(steps.xs.length);
    for (var m = 0; m < mid.length; m++) mid[m] = steps.ys[m] - (steps.ys[m] - (m ? steps.ys[m - 1] : 0)) / 2;
    var filled = 1, cur = new Float64Array(G), wv = new Float64Array(G), err = new Float64Array(G);
    function fill() {
      var deadline = performance.now() + 2;
      while (filled <= NZ && performance.now() < deadline) {
        var g = Z[filled - 1], den = 0.25 + g * g, o = filled * G, p = o - G;
        for (var i = 0; i < G; i++) {
          var ph = g * lx[i];
          rows[o + i] = rows[p + i] - 2 * sq[i] * (0.5 * Math.cos(ph) + g * Math.sin(ph)) / den;
        }
        filled++;
      }
      if (filled <= NZ) fig.more();
    }
    function ticks(pred, color, alpha, width, p) {
      fig.stroke({ color: color, alpha: alpha, width: width });
      fig.ctx.beginPath();
      for (var k = 1; k <= NZ; k++) if (pred(k)) { var px = Math.round(p.X(Z[k - 1])) + 0.5; fig.ctx.moveTo(px, p.box.t); fig.ctx.lineTo(px, p.box.b); }
      fig.ctx.stroke();
    }

    return function draw() {
      fill();
      var Nt = play.playing ? Nf(play.value) : curN();
      if (play.playing) { a.set(Nt); lastN = Nt; } else if (Nt !== lastN) { lastN = Nt; a.to(Nt, 220, 'outCubic'); }
      if (showErr.value !== lastErr) { lastErr = showErr.value; yLow.to(lastErr ? YB : 0, 300); }
      var pos = Math.min(a.value, filled - 1), k0 = Math.min(Math.floor(pos), NZ - 1), fr = pos - k0;
      var settled = !play.playing && Math.abs(pos - Nt) < 1.5;
      var kk = settled || play.playing ? Math.ceil(pos - 1e-9) : Math.round(Nt), amp = settled || play.playing ? pos - (kk - 1) : 1;
      kk = Kit.clamp(kk, 0, Math.min(NZ, filled - 1));

      var H = fig.h, sH = Kit.clamp(H * 0.11, 34, 52), wH = Kit.clamp(H * 0.28, 72, 120), a1 = (H - sH - wH) / H, a2 = (H - sH) / H;
      main.frac = [0, 0, 1, a1]; wp.frac = [0, a1, 1, a2]; sp.frac = [0, a2, 1, 1];
      main.view.y0 = yLow.value; main.update(); wp.update(); sp.update();

      var o0 = k0 * G, o1 = (k0 + 1) * G, maxErr = 0;
      for (var i = 0; i < G; i++) {
        cur[i] = rows[o0 + i] + fr * (rows[o1 + i] - rows[o0 + i]);
        err[i] = cur[i] - psi0[i];
        if (far[i] && Math.abs(err[i]) > maxErr) maxErr = Math.abs(err[i]);
        wv[i] = kk > 0 ? amp * (rows[kk * G + i] - rows[(kk - 1) * G + i]) : 0;
      }

      // Main panel: the staircase, the line, the partial sum.
      var b = main.box;
      main.grid({ xStep: 10, yStep: 10 });
      main.axes({ origin: [X0, 0], x: false, yStep: 10 });
      main.hline(0, { color: 'muted', width: 1 });
      main.plot(function (x) { return x; }, { color: 'blue', width: 1.6, dash: [6, 5], from: X0 });
      main.stairs(steps.xs, steps.ys, { color: 'gold', width: 2.2, alpha: 0.9, to: X1 });
      for (var s = 0; s < mid.length; s++) main.point(steps.xs[s], mid[s], { color: 'gold', r: 2.6, ringWidth: 1 });
      if (showErr.value) main.path(gx, err, { color: 'red', width: 1.6 });
      main.path(gx, cur, { color: 'teal', width: 2.4 });
      main.label('line', 36, 36, { anchor: 'se', color: 'blue', dx: -4, dy: -6 });
      main.label('psi', 50, M.psi(50), { anchor: 'nw', color: 'gold', dx: 12, dy: 12 });
      if (showErr.value) main.label('err', X1 - 0.5, YB + 0.5, { anchor: 'se', color: 'red' });
      var Nd = Math.round(pos), gN = Nd > 0 ? Z[Nd - 1] : 0;
      // the teal curve named in words (the chapter's prose has no symbol for the partial sum)
      var name = fig.w < 520 ? 'formula' : 'explicit formula', nw = fig.measure(name, 12.5, 500, true) + 10;
      var bw = Math.max(232, 18 + nw + fig.measure('N = 200,  ', 12.5, 500, true) + fig.labelSize('gN', 12.5).w + fig.measure(' = 396.38', 12.5, 500, true));
      fig.rect(b.l + 8, b.t + 6, bw, 42, { fill: 'stage', alpha: 0.86 });
      fig.text(name, b.l + 16, b.t + 18, { color: 'teal', size: 12.5, mono: true, baseline: 'middle' });   // the readout's font: no extra font per frame
      fig.mathText(Nd ? ['N = ' + Nd + ',  ', { tex: 'gN' }, ' = ' + gN.toFixed(2)] : ['N = 0'], b.l + 16 + nw, b.t + 18, { size: 12.5, mono: true });
      fig.text('max error ' + maxErr.toFixed(2) + ' off the jumps', b.l + 16, b.t + 41, { size: 12, color: 'muted' });

      // Wave panel: the newest wave, with a guide at every prime power.
      var w = wp.box;
      wp.grid({ xStep: 10, yStep: 1 });
      wp.axes({ origin: [X0, -1.2], xStep: 10, yStep: 1 });
      fig.stroke({ color: 'gold', alpha: 0.28, width: 1 });
      fig.ctx.beginPath();
      for (var q = 0; q < steps.xs.length; q++) { var px = Math.round(wp.X(steps.xs[q])) + 0.5; fig.ctx.moveTo(px, w.t); fig.ctx.lineTo(px, w.b); }
      fig.ctx.stroke();
      wp.hline(0, { color: 'muted', width: 1 });
      if (showWave.value && kk > 0) { wp.path(gx, wv, { color: 'teal', width: 2 }); wp.label('wave', X0 + 0.8, 1.15, { anchor: 'nw', color: 'teal', dy: 2 }); }
      fig.label('x', w.l - 8, w.b + 12, { anchor: 'e', color: 'muted', size: 13 });

      // Spectrum strip: the first N ordinates lit, the newest in red.
      var c = sp.box, lit = Math.floor(pos + 1e-9);
      ticks(function (k) { return k > lit && k !== kk; }, 'muted', 0.45, 1, sp);
      ticks(function (k) { return k <= lit && k !== kk; }, 'teal', 0.95, 1.4, sp);
      if (kk > 0) ticks(function (k) { return k === kk; }, 'red', 1, 2.6, sp);
      fig.line(c.l, c.b + 0.5, c.r, c.b + 0.5, { color: 'muted', width: 1 });
      [0, 100, 200, 300, 400].forEach(function (v) { fig.text(String(v), sp.X(v), c.b + 13, { color: 'muted', size: 11, align: 'center' }); });
      fig.label('gamma', c.l - 8, c.t + c.h / 2, { anchor: 'e', color: 'muted', size: 13 });
    };
  }
});
