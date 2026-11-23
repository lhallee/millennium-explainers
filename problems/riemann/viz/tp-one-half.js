/* Where the one half comes from, in each proof. Left (Route M, chapter 16): with the weight |x|^w the multiplicative
   measure carries the density x^(2w-1) against dx, and the two agree only at w = 1/2 (as in tf-weight). Right
   (Route A, chapters 19 and 21): every size divided by sqrt(x), on log-log axes, so the square root is the flat line
   at 1: the allowance x^(1/2 + 9 eps) of the endgame; the chain length m between x^(1/2 - eps/16) and twice that
   (RankVal); the zero noise c0 sqrt(x) of G_0 when every zero is on the line, c0 = 2 + gamma_E - log 4 pi; and, on
   request, the crest 2 x^beta / |rho (rho - 1)| of a hypothetical zero pair beta +- 14i (red, as every hypothetical
   object on the page), with the scale at which it first rises through the allowance (dashed blue, as the ceiling of
   chapter 19). Every curve on the right is a power of x, so a straight segment. */
Kit.register('tp-one-half', {
  tex: {
    dens: 'x^{2w-1}', add: '1', x: 'x', w: 'w', eps: '\\varepsilon', beta: '\\beta',
    ident: '\\int\\lvert x^w g\\rvert^2\\,\\tfrac{\\dd x}{x}=\\int\\lvert g\\rvert^2x^{2w-1}\\,\\dd x',
    same: '=\\int\\lvert g\\rvert^2\\,\\dd x\\ \\text{ for every } g',
    sq: '\\sqrt x', allow: 'x^{1/2+9\\varepsilon}', m: 'm', noise: 'c_0\\sqrt x'
  },
  init: function (fig) {
    var fmt = Kit.fmt, G = 14, C0 = 2 + 0.5772156649015329 - Math.log(4 * Math.PI), X0 = 1e2, X1 = 1e12, N = 160;
    var amp = function (b) { return 2 / (Math.hypot(b, G) * Math.hypot(b - 1, G)); };   // 2 / |rho (rho - 1)|
    var chainLo = function (x, e) { return Math.pow(x, 0.5 - e / 16); };

    // the numbers the chapter's spec prints, at eps = 0.01 and x = 10^6
    [[chainLo(1e6, 0.01), 991.4], [2 * chainLo(1e6, 0.01), 1982.8], [Math.pow(1e6, 0.59), 3467.4], [C0 * 1e3, 46.19], [amp(0.8), 0.010186]]
      .forEach(function (c) { if (Math.abs(c[0] / c[1] - 1) > 1e-4) console.error('tp-one-half: ' + c[0] + ' does not match ' + c[1]); });

    var w = fig.slider({ label: 'Weight', tex: 'w', min: 0, max: 1, step: 0.01, value: 0.3, snap: [0.5],
      marks: [{ at: 0.5, color: 'violet', title: 'w = 1/2' }],
      format: function (v) { return Math.abs(v - 0.5) < 1e-9 ? '1/2' : v.toFixed(2); } });
    var eps = fig.slider({ label: 'Slack', tex: 'eps', min: 0.001, max: 0.019, step: 0.001, value: 0.01,
      format: function (v) { return v.toFixed(3); } });
    var hyp = fig.toggle({ label: 'Hypothetical zero', value: false });
    var beta = fig.slider({ label: 'Real part', tex: 'beta', min: 0.5, max: 0.95, step: 0.01, value: 0.8,
      format: function (v) { return v.toFixed(2); } });
    var camW = fig.follow(w.value, { tau: 0.08 }), camE = fig.follow(eps.value, { tau: 0.08 });

    var L = fig.plane({ x: [0, 4], y: [0, 3], pad: { t: 26, r: 14, b: 72, l: 34 } });
    var R = fig.plane({ x: [X0, X1], y: [1e-2, 1e4], xLog: true, yLog: true, pad: { t: 26, r: 14, b: 72, l: 46 } });
    var xTicks = [2, 4, 6, 8, 10, 12].map(function (k) { return [Math.pow(10, k), fmt.pow10(k)]; });
    var yTicks = [[0.01, '0.01'], [0.1, '0.1'], [1, '1'], [10, '10'], [100, '100'], [1e3, '1,000'], [1e4, '10,000']];
    var yTicksN = [[0.01, '0.01'], [1, '1'], [100, '100']];

    // the density x^(2w-1) as a polyline and the mismatch region, rebuilt only when w moves
    var xs = new Float64Array(N), ys = new Float64Array(N), fx = new Float64Array(2 * N), fy = new Float64Array(2 * N), lastW = NaN;
    for (var i = 0; i < N; i++) { xs[i] = 4 * Math.pow((i + 1) / N, 3); fx[i] = xs[i]; fx[2 * N - 1 - i] = xs[i]; fy[2 * N - 1 - i] = 1; }
    function density(ww) {
      if (ww === lastW) return; lastW = ww;
      for (var i = 0; i < N; i++) { ys[i] = Math.min(1e3, Math.pow(xs[i], 2 * ww - 1)); fy[i] = ys[i]; }
    }
    function power(c, p, style) { R.segment(X0, c * Math.pow(X0, p), X1, c * Math.pow(X1, p), style); }   // c x^p

    return function draw() {
      var W = fig.w, wide = W >= 640, fs = wide ? 12.5 : 11;
      if (wide) { L.setBox([0, 0, 0.48, 1]); R.setBox([0.52, 0, 1, 1]); }
      else { L.setBox([0, 0, 1, 0.42]); R.setBox([0, 0.42, 1, 1]); }
      L.pad.b = R.pad.b = wide ? 72 : 34; L.pad.t = R.pad.t = wide ? 26 : 22; L.update(); R.update();
      beta.enable(hyp.value);

      // left: the two measures as densities against dx
      var ww = camW.to(w.value).value, at = Math.abs(w.value - 0.5) < 1e-9 && Math.abs(ww - 0.5) < 1e-3, lb = L.box;
      density(ww);
      fig.text('Route M: measures', L.outer.l + 8, L.outer.t + 13, { color: 'muted', size: fs, weight: 600 });
      L.grid({ xStep: 1, yStep: 1 });
      L.axes({ edge: true, xStep: 1, yStep: 1, xLabel: 'x' });
      L.path(fx, fy, { fill: 'red', fillAlpha: 0.16, close: true, color: null });
      L.path(xs, ys, { color: 'gold', width: 2.6 });
      L.hline(1, { color: 'blue', width: 2.2, dash: [7, 5] });
      fig.legend([{ color: 'gold', tex: 'dens', width: 2.6 }, { color: 'blue', tex: 'add', dash: [7, 5] }],
        { plane: L, at: 'ne', size: wide ? 13 : 11.5, dir: wide ? 'col' : 'row' });
      var ly = lb.b + (wide ? 34 : 25);
      if (wide) {
        fig.label('ident', lb.l, ly, { anchor: 'w', color: 'fg', size: 12.5 });
        if (at) fig.label('same', lb.l, ly + 22, { anchor: 'w', color: 'violet', size: 12.5 });
        else fig.text('not equal for every g', lb.l, ly + 22, { color: 'red', size: 12.5, weight: 600, baseline: 'middle' });
      } else {
        fig.text(at ? 'w = ½: the two measures agree' : 'w = ' + ww.toFixed(2) + ': the measures differ', lb.l, ly,
          { color: at ? 'violet' : 'red', size: fs, weight: 600, baseline: 'middle' });
      }

      // right: sizes divided by sqrt(x)
      var e = camE.to(eps.value).value, th = 0.5 + 9 * e, rb = R.box, yt = wide ? yTicks : yTicksN;
      fig.text('Route A: sizes ÷ √x', R.outer.l + 8, R.outer.t + 13, { color: 'muted', size: fs, weight: 600 });
      R.grid({ xTicks: xTicks, yTicks: yt });
      R.axes({ edge: true, xTicks: xTicks, yTicks: yt, xLabel: 'x' });
      R.path([[X0, Math.pow(X0, -e / 16)], [X1, Math.pow(X1, -e / 16)], [X1, 2 * Math.pow(X1, -e / 16)], [X0, 2 * Math.pow(X0, -e / 16)]],
        { fill: 'gold', fillAlpha: 0.45, close: true, color: null });
      power(1, -e / 16, { color: 'gold', width: 1.2 }); power(2, -e / 16, { color: 'gold', width: 1.2 });
      R.hline(1, { color: 'violet', width: 1.8 });
      R.hline(C0, { color: 'teal', width: 2.2 });
      power(1, 9 * e, { color: 'blue', width: 2.4, dash: [7, 5] });      // the allowance is a ceiling: dashed blue, as in chapter 19
      var cross = null, b = beta.value, a = amp(b);
      if (hyp.value) {
        power(a, b - 0.5, { color: 'red', width: 2.2 });                 // a hypothetical object is red
        if (b > th) cross = Math.pow(1 / a, 1 / (b - th));
        if (cross && cross <= X1) R.point(cross, Math.pow(cross, 9 * e), { color: 'red', r: 5 });
      }
      fig.legend([
        { color: 'blue', tex: 'allow', width: 2.4, dash: [7, 5] },
        { color: 'gold', tex: 'm', fill: true, alpha: 0.6 },
        { color: 'violet', tex: 'sq', width: 1.8 },
        { color: 'teal', tex: 'noise', width: 2.2 },
        hyp.value && { color: 'red', text: wide ? 'crest of a hypothetical zero' : 'hypothetical zero', width: 2.2 }
      ], { plane: R, at: 'nw', size: wide ? 12.5 : 10.5, dir: wide ? 'col' : 'row' });

      var ry = rb.b + (wide ? 34 : 25);
      fig.text('zero-free for Re s > ½ + 9ε = ' + th.toFixed(3), rb.l, ry, { color: 'fg', size: fs, weight: 600, baseline: 'middle' });
      if (wide && hyp.value) {
        var msg = b <= th ? 'β = ' + b.toFixed(2) + ' stays under this allowance: take a smaller ε'
          : 'its crests pass the allowance near x = ' + fmt.sci(Number(cross.toPrecision(2)));
        fig.text(msg, rb.l, ry + 22, { color: b <= th ? 'muted' : 'red', size: 12, baseline: 'middle' });
      }
    };
  }
});
