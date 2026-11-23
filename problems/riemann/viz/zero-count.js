/* N(T), the number of zeros with 0 < gamma <= T, as a staircase over the first 200 zero ordinates, against the smooth
   count (T/2pi) log(T/2pi) - T/2pi + 7/8. The strip below plots E_N(T) = N(T) - theta_RS(T)/pi - 1, a sawtooth that
   jumps by 1 at each zero and falls with slope theta'/pi between them; it is tabulated once, in a job. */
Kit.register('zero-count', {
  tex: { N: 'N(T)', smooth: '\\tfrac{T}{2\\pi}\\log\\tfrac{T}{2\\pi}-\\tfrac{T}{2\\pi}+\\tfrac78',
    smooth0: '\\tfrac{T}{2\\pi}\\log\\tfrac{T}{2\\pi}-\\tfrac{T}{2\\pi}', E: 'E_N(T)', T: 'T', n: 'n', g: '\\gamma_n',
    mean: '2\\pi/\\log\\tfrac{\\gamma_n}{2\\pi}', gap: '\\gamma_n-\\gamma_{n-1}' },
  init: function (fig) {
    var M = Kit.math, fmt = Kit.fmt, Z = Kit.zeros, TOP = 300, TAU = 2 * Math.PI;
    var Tmax = fig.slider({ label: 'Largest height', tex: 'T', min: 30, max: TOP, step: 1, value: 100 });
    var shift = fig.tween(1), cam = fig.follow(Tmax.value, { tau: 0.15 });
    var drop = fig.toggle({ label: 'Without the 7/8', value: false, onInput: function (v) { shift.to(v ? 0 : 1, 500); } });
    fig.onReset = function () { shift.set(1); };
    var counts = new Float64Array(Z.length);
    for (var i = 0; i < Z.length; i++) counts[i] = i + 1;
    var nTop = Kit.upperBound(Z, TOP);                            // 138 zeros up to height 300

    function split(w, h) { return Math.round(h * (w < 560 ? 0.5 : 0.66)); }   // a phone gives the E_N strip more of its height
    var P = fig.plane({ x: [0, TOP], y: [0, 150], box: function (w, h) { return [0, 0, w, split(w, h)]; }, pad: { t: 10, r: 16, b: 4, l: 44 } });
    var Q = fig.plane({ x: [0, TOP], y: [-1.5, 1.5], box: function (w, h) { return [0, split(w, h), w, h]; }, pad: { t: 18, r: 16, b: 24, l: 44 } });
    fig.probe({ plane: P, crosshair: 'x',
      snap: function (x) {
        var k = Kit.lowerBound(Z, x);
        if (k > 0 && (k >= Z.length || x - Z[k - 1] < Z[k] - x)) k--;
        return Z[k] <= P.v.x1 ? [Z[k], k + 1] : null;
      },
      rows: function (x, y) {
        var n = Math.round(y), g = Z[n - 1];
        return [[{ tex: 'n' }, String(n)], [{ tex: 'g' }, fmt(g, 6), 'teal'], [{ tex: 'mean' }, fmt(TAU / Math.log(g / TAU), 2), 'blue'],
          n > 1 ? [{ tex: 'gap' }, fmt(g - Z[n - 2], 2)] : null];
      } });

    // E_N on [0, gamma_1] and on each [gamma_k, gamma_{k+1}], sampled densely enough that a chord is within 1e-3
    var err = fig.job(function* () {
      var xs = [], ys = [];
      for (var k = 0; k <= nTop; k++) {
        var a = k === 0 ? 0 : Z[k - 1], b = Z[k], m = k === 0 ? 80 : 14;
        for (var j = 0; j <= m; j++) { var t = a + (b - a) * j / m; xs.push(t); ys.push(k - M.rsTheta(t) / Math.PI - 1); }
        yield k / nTop;
      }
      return { xs: new Float64Array(xs), ys: new Float64Array(ys) };
    }, { budget: 2 });
    function smooth(T) { var u = T / TAU; return u * Math.log(u) - u + 0.875 * shift.value; }

    return function draw() {
      var T = cam.to(Tmax.value).value, nT = Kit.upperBound(Z, T);
      P.view.x1 = T; P.view.y1 = Math.max(4, 1.1 * Math.max(nT, smooth(T))); P.update();
      Q.view.x1 = T; Q.update();

      P.grid(); P.axes({ edge: true, x: false });
      P.stairs(Z, counts, { color: 'gold', width: 2.4, y0: 0 });
      P.plot(smooth, { color: 'blue', width: 1.8, from: 2, alpha: 0.95 });
      fig.legend([{ color: 'gold', tex: 'N' }, { color: 'blue', tex: drop.value ? 'smooth0' : 'smooth' }], { plane: P, at: 'nw', size: 12.5 });
      fig.text('N(' + fmt(T, 0) + ') = ' + nT, P.box.r - 6, P.box.b - 10, { color: 'gold', size: 12, mono: true, align: 'right' });

      var qb = Q.box;
      Q.grid({ xStep: Q.xStep(), yTicks: [-1, 0, 1] });
      Q.hline(0, { color: 'muted', width: 1.2 });
      if (err.done) {
        var R = err.result, e = Math.min(R.xs.length, Kit.upperBound(R.xs, T) + 1);
        Q.path(R.xs.subarray(0, e), R.ys.subarray(0, e), { color: 'red', width: 1.8 });
      } else fig.text('tabulating θ: ' + Math.round(100 * err.progress) + '%', qb.r - 6, qb.t + 14, { color: 'muted', size: 11, align: 'right' });
      Q.axes({ edge: true, yTicks: [-1, 0, 1], xLabel: 'T' });
      fig.label('E', qb.l + 6, qb.t - 3, { anchor: 'sw', color: 'red', size: 12.5 });
    };
  }
});
