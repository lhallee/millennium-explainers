/* The Perron switch I_T(y) = (1/2 pi i) integral of y^s/s over Re s = c, |Im s| <= T, against the step function it
   approximates, with the bound y^c / (pi T |log y|). With u = log y, d/du I_T = e^{cu} sin(Tu) / (pi u) and
   I_T(1) = arctan(T/c) / pi, so the whole curve is one cumulative integral of a smooth function (no integral over t).
   A draggable probe reads I_T at one y, to compare with the worked example in the chapter. */
Kit.register('perron-switch', {
  tex: { y: 'y', I: 'I_T(y)', step: '\\mathbf 1_{y>1}', bound: 'y^c/(\\pi T\\lvert\\log y\\rvert)', bnd: '\\text{bound}' },
  init: function (fig) {
    var LO = Math.log(0.25), HI = Math.log(4);
    var logT = fig.slider({ label: 'Half-length', min: 0, max: 2, step: 0.01, value: 1,
      format: function (v) { var T = Math.pow(10, v); return 'T = ' + (T < 10 ? T.toFixed(1) : Math.round(T)); } });
    var cc = fig.slider({ label: 'Line at Re s =', min: 0.2, max: 3, step: 0.05, value: 1, format: function (v) { return v.toFixed(2); } });
    var showBound = fig.toggle({ label: 'Show bound', value: true });
    var P = fig.plane({ x: [LO, HI], y: [-0.2, 1.2], pad: { t: 12, r: 22, b: 34, l: 40 } });
    var probe = fig.drag({ plane: P, x: Math.log(2), y: 0.9, r: 6, color: 'fg',
      constrain: function (x) { return [Kit.clamp(x, LO, HI), 0]; } });
    var xs = new Float64Array(2200), ys = new Float64Array(2200), count = 0, key = '';
    var g = function (v, T, c) { return v === 0 ? T / Math.PI : Math.exp(c * v) * Math.sin(T * v) / (Math.PI * v); };

    /* I_T at u by Simpson's rule from u = 0, with 30 nodes per period of sin(Tu). */
    function exact(u, T, c) {
      var m = 2 * Math.ceil(Math.max(20, Math.abs(u) * T * 30 / (2 * Math.PI)) / 2), h = u / m, s = g(0, T, c) + g(u, T, c);
      for (var k = 1; k < m; k++) s += (k % 2 ? 4 : 2) * g(k * h, T, c);
      return Math.atan(T / c) / Math.PI + s * h / 3;
    }
    /* The curve on a grid of step 2 pi / (40 T) (at most 0.004), by the cumulative trapezoid rule outward from u = 0. */
    function build(T, c) {
      var h = Math.min(0.004, 2 * Math.PI / (40 * T)), n = Math.ceil(HI / h), mid = n;
      count = 2 * n + 1;
      ys[mid] = Math.atan(T / c) / Math.PI; xs[mid] = 0;
      for (var j = 1; j <= n; j++) {
        var v = j * h, gv = g(v, T, c), gp = g(v - h, T, c), gm = g(-v, T, c), gq = g(-(v - h), T, c);
        xs[mid + j] = v; ys[mid + j] = ys[mid + j - 1] + h * (gp + gv) / 2;
        xs[mid - j] = -v; ys[mid - j] = ys[mid - j + 1] - h * (gq + gm) / 2;
      }
    }

    return function draw() {
      var T = Math.pow(10, logT.value), c = cc.value;
      if (key !== T + '|' + c) { key = T + '|' + c; build(T, c); }
      var b = P.box;
      [0, 0.5, 1].forEach(function (v) {
        P.hline(v, { color: 'grid', width: 1 });
        fig.text(String(v), b.l - 7, P.Y(v) + 4, { color: 'muted', size: 11.5, align: 'right' });
      });
      [0.25, 0.5, 1, 2, 4].forEach(function (v) {
        P.vline(Math.log(v), { color: v === 1 ? 'muted' : 'grid', width: 1, dash: v === 1 ? [4, 4] : null });
        fig.text(String(v), P.X(Math.log(v)), b.b + 16, { color: 'muted', size: 11.5, align: 'center' });
      });
      fig.line(b.l, b.b, b.r, b.b, { color: 'muted', width: 1 });
      fig.label('y', b.r + 12, b.b + 16, { anchor: 'c', color: 'muted' });

      if (showBound.value) {
        var env = function (sign, base) { return function (u) { return base + sign * Math.exp(c * u) / (Math.PI * T * Math.abs(u)); }; };
        [[-1, 0, LO, -1e-4], [1, 0, LO, -1e-4], [-1, 1, 1e-4, HI], [1, 1, 1e-4, HI]].forEach(function (e) {
          P.plot(env(e[0], e[1]), { color: 'red', width: 1.25, dash: [5, 4], from: e[2], to: e[3], alpha: 0.9 });
        });
      }
      P.segment(LO, 0, 0, 0, { color: 'gold', width: 2.5, alpha: 0.85 });
      P.segment(0, 1, HI, 1, { color: 'gold', width: 2.5, alpha: 0.85 });
      P.segment(0, 0, 0, 1, { color: 'gold', width: 1.5, dash: [3, 4], alpha: 0.6 });
      P.point(0, 0.5, { color: 'stage', ring: 'gold', r: 4, ringWidth: 2 });
      P.path(xs.subarray(0, count), ys.subarray(0, count), { color: 'teal', width: 2.4 });

      probe.y = exact(probe.x, T, c);
      var y = Math.exp(probe.x), truth = y > 1 ? 1 : 0, err = Math.abs(probe.y - truth), bound = Math.pow(y, c) / (Math.PI * T * Math.abs(probe.x));
      fig.rect(b.l + 8, b.t + 6, 214, showBound.value ? 50 : 34, { fill: 'stage', alpha: 0.85 });
      fig.text('y = ' + y.toFixed(2) + '   I = ' + probe.y.toFixed(4), b.l + 16, b.t + 22, { size: 12.5, mono: true });
      if (showBound.value) fig.text('error ' + err.toFixed(4) + ' ≤ bound ' + bound.toFixed(4), b.l + 16, b.t + 42, { size: 11.5, mono: true, color: 'red' });

      var narrow = b.w < 420, lx = b.r - (narrow ? 88 : 160), ly = b.b - 52;
      [['teal', 'I', null], ['gold', 'step', null], ['red', 'bound', [5, 4]]].forEach(function (r, i) {
        if (r[0] === 'red' && !showBound.value) return;
        fig.line(lx, ly + i * 20, lx + 22, ly + i * 20, { color: r[0], width: 2.2, dash: r[2] });
        fig.label(r[1] === 'bound' && narrow ? 'bnd' : r[1], lx + 28, ly + i * 20, { anchor: 'w', color: r[0], size: r[1] === 'bound' ? 12.5 : 14 });
      });
    };
  }
});
