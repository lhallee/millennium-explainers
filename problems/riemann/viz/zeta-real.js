/* The integral test for zeta(s) on the real line. Left: the curve t^-s over unit rectangles of height n^-s, either on
   [n, n+1) (above the curve; all of them together add to zeta(s)) or on [n-1, n) (below it; together zeta(s) - 1), with
   the area 1/(s-1) under the curve shaded. Right: zeta(s) squeezed between 1/(s-1) and s/(s-1), clipped at 12. zeta is
   the kit's (Euler-Maclaurin, about 15 digits), tabulated once in a job for the right panel. */
Kit.register('zeta-real', {
  tex: { t: 't', s: 's', curve: 't^{-s}', zeta: '\\zeta(s)', lo: '1/(s-1)', hi: 's/(s-1)' },
  init: function (fig) {
    var M = Kit.math, fmt = Kit.fmt, YMAX = 12, S0 = 1.05;
    var zetaOf = function (s) { return M.zeta(s, 0).re; };
    var S = fig.slider({ label: 'Exponent', tex: 's', min: S0, max: 4, step: 0.01, value: 2 });
    var mode = fig.select({ label: 'Rectangles', options: [['upper', 'upper: on [n, n+1), above the curve'], ['lower', 'lower: on [n−1, n), below the curve']], value: 'upper' });
    var cam = fig.follow(S.value, { tau: 0.05 });

    // stacked on a phone, the lower panel gets the larger share: its curves crowd near the pole
    var split = function (w, h) { return w >= 600 ? [0.57 * w, 0] : [0, 0.46 * h]; };
    var L = fig.plane({ x: [1, 10], y: [0, 1.05], pad: { t: 10, r: 14, b: 24, l: 40 },
      box: function (w, h) { var q = split(w, h); return [0, 0, q[0] || w, q[1] || h]; } });
    var R = fig.plane({ x: [1, 4], y: [0, YMAX], pad: { t: 8, r: 16, b: 24, l: 40 },
      box: function (w, h) { var q = split(w, h); return [q[0], q[1], w, h]; } });

    // the right panel's zeta curve, denser near the pole at s = 1
    var tab = null;
    fig.job(function* () {
      var n = 400, xs = new Float64Array(n), ys = new Float64Array(n);
      for (var i = 0; i < n; i++) {
        var u = i / (n - 1);
        xs[i] = 1.02 + 2.98 * u * u; ys[i] = zetaOf(xs[i]);
        if (i % 50 === 49) yield i / n;
      }
      return { xs: xs, ys: ys };
    }, { onDone: function (r) { tab = r; } });

    var probe = fig.probe({ plane: R, crosshair: false, marker: false, panel: 'e',
      snap: function (x) { var s = Kit.clamp(Math.round(x * 100) / 100, S0, 4); return [s, Math.min(zetaOf(s), YMAX)]; },
      rows: function (x) {
        return [[{ tex: 's' }, fmt(x, 2)], [{ tex: 'zeta' }, fmt(zetaOf(x), 4), 'gold'], [{ tex: 'lo' }, fmt(1 / (x - 1), 4), 'blue'], [{ tex: 'hi' }, fmt(x / (x - 1), 4), 'blue']];
      },
      pick: function (x) { S.set(Kit.clamp(Math.round(x * 100) / 100, S0, 4)); } });

    return function draw() {
      var s = cam.to(probe.active ? probe.x : S.value).value, up = mode.value === 'upper', narrow = fig.w < 600;
      var z = zetaOf(s), lo = 1 / (s - 1), curve = function (t) { return Math.pow(t, -s); };

      // left: rectangles, the area under the curve, the curve
      var b = L.box, shown = 0;
      L.grid({ xStep: 1, yStep: 0.5 });
      L.fillBetween(curve, 0, 1, 10, { color: 'blue', alpha: 0.13 });
      for (var n = up ? 1 : 2; n <= (up ? 9 : 10); n++) {
        var hgt = Math.pow(n, -s), x0 = up ? n : n - 1;
        shown += hgt;
        fig.rect(L.X(x0), L.Y(hgt), L.X(x0 + 1) - L.X(x0), L.Y(0) - L.Y(hgt), { fill: 'gold', alpha: 0.2, color: 'gold', width: 1.3 });
        fig.occRect(L.X(x0), L.Y(hgt), L.X(x0 + 1) - L.X(x0), L.Y(0) - L.Y(hgt));
      }
      L.plot(curve, { color: 'blue', width: 2.4 });
      L.axes({ edge: true, xStep: 1, yStep: 0.5, xLabel: 't' });
      L.label('curve', 1.6, curve(1.6), { anchor: 'sw', color: 'blue', dx: up ? 46 : 8, dy: up ? 4 : -4 });
      fig.panel([
        [(narrow ? '' : 'rectangles ') + (up ? 'n = 1 to 9' : 'n = 2 to 10'), fmt(shown, 4), 'gold'],
        [(narrow ? '' : up ? 'all n ≥ 1: ' : 'all n ≥ 2: ') + (up ? 'ζ(s)' : 'ζ(s) − 1'), fmt(up ? z : z - 1, 4), 'gold'],
        [(narrow ? '' : 'area under curve: ') + '1/(s − 1)', fmt(lo, 4), 'blue']
      ], { plane: L, at: 'ne', id: 'sums' });

      // right: zeta between 1/(s-1) and s/(s-1)
      var c = R.box;
      R.grid({ xStep: 1, yStep: narrow ? 4 : 2 });
      R.fillBetween(function (t) { return 1 / (t - 1); }, function (t) { return t / (t - 1); }, 1.001, 4, { color: 'blue', alpha: 0.09 });
      R.plot(function (t) { return t / (t - 1); }, { color: 'blue', width: 1.6, dash: [6, 4], from: 1.001 });
      R.plot(function (t) { return 1 / (t - 1); }, { color: 'blue', width: 2, from: 1.001 });
      if (tab) R.path(tab.xs, tab.ys, { color: 'gold', width: 2.6 });
      R.axes({ edge: true, xStep: 1, yStep: narrow ? 4 : 2, xLabel: 's' });
      var px = R.X(s);
      R.segment(s, 0, s, Math.min(z, YMAX), { color: 'fg', width: 1, alpha: 0.45, dash: [3, 4] });
      if (z <= YMAX) R.point(s, z, { color: 'gold', r: 5.5 });
      else fig.arrow(px, c.t + 22, px, c.t + 3, { color: 'gold', width: 2, head: 8 });
      var tx = fig.labelSize('zeta', 12.5).w + fig.measure(' = ' + fmt(z, 4), 12.5, 500, true);
      var ty = z <= YMAX ? R.Y(z) - 16 : c.t + 12, right = px + 12 + tx <= c.r;
      fig.rect(right ? px + 8 : px - tx - 14, ty - 10, tx + 6, 20, { fill: 'stage', alpha: 0.85 });
      fig.mathText([{ tex: 'zeta' }, ' = ' + fmt(z, 4)], right ? px + 11 : px - 11, ty, { size: 12.5, mono: true, color: 'gold', align: right ? 'left' : 'right' });
      fig.legend([{ color: 'gold', tex: 'zeta', width: 2.6 }, { color: 'blue', tex: 'lo', width: 2 }, { color: 'blue', tex: 'hi', dash: [6, 4], width: 1.6 }],
        { plane: R, at: 'ne', dir: narrow ? 'row' : 'col', size: 12.5 });
    };
  }
});
