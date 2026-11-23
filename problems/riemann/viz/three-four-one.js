/* The 3-4-1 trick. Left: 3, 4 cos theta, and cos 2 theta, and their sum, which is the square 2(1 + cos theta)^2 and
   never negative. Right: the three factors zeta(sigma)^3, |zeta(sigma + it)|^4, |zeta(sigma + 2it)| on a log axis,
   as bars from 1, and their product, which the sum's positivity keeps at or above 1. The colors pair each cosine term
   with the factor it comes from. */
Kit.register('three-four-one', {
  tex: { theta: '\\theta', sigma: '\\sigma', t: 't', sum: '3+4\\cos\\theta+\\cos2\\theta', sq: '2(1+\\cos\\theta)^2',
    c4: '4\\cos\\theta', c2: '\\cos2\\theta', three: '3',
    f1: '\\zeta(\\sigma)^3', f2: '\\lvert\\zeta(\\sigma+it)\\rvert^4', f3: '\\lvert\\zeta(\\sigma+2it)\\rvert', f4: '\\text{product}',
    m2pi: '-2\\pi', mpi: '-\\pi', pi: '\\pi', p2pi: '2\\pi' },
  init: function (fig) {
    var M = Kit.math, fmt = Kit.fmt, PI = Math.PI, TW = 2 * PI, YT = [-4, -2, 2, 4, 6, 8];
    var sig = fig.slider({ label: 'Real part', tex: 'sigma', min: 1.001, max: 2, value: 1.1,
      scale: { to: function (u) { return 1 + Math.pow(10, -3 + 3 * u); }, from: function (v) { return (Math.log10(v - 1) + 3) / 3; } },
      marks: [1.01, 1.1], format: function (v) { return fmt(v, v < 1.01 ? 4 : 3); } });
    var tt = fig.slider({ label: 'Height', tex: 't', min: 0.5, max: 40, step: 0.01, value: Kit.zeros[0], format: function (v) { return fmt(v, 2); } });
    function narrow() { return fig.w < 560; }
    var L = fig.plane({ x: [-TW, TW], y: [-4.6, 12.2], pad: { t: 10, r: 10, b: 26, l: 30 },
      box: function (w, h) { return [0, 0, w * (w < 560 ? 0.5 : 0.56), h]; } });
    var R = fig.plane({ x: [0, 4], y: [0.1, 10], yLog: true, pad: { t: 22, r: 8, b: 44, l: 46 },
      box: function (w, h) { return [w * (w < 560 ? 0.5 : 0.59), 0, w, h]; } });
    function sum(x) { return 3 + 4 * Math.cos(x) + Math.cos(2 * x); }
    var mark = fig.drag({ plane: L, x: 2 * PI / 3, y: sum(2 * PI / 3), r: 7, color: 'red',
      constrain: function (x) { x = Kit.clamp(x, -TW, TW); return [x, sum(x)]; } });
    var lo = fig.follow(-1), hi = fig.follow(1), zv = [0, 0];
    var COLORS = ['blue', 'teal', 'gold', 'red'], KEYS = ['f1', 'f2', 'f3', 'f4'];
    function absZ(s, t) { M.zetaInto(s, t, zv); return Math.hypot(zv[0], zv[1]); }
    function num(v) { return v >= 1e5 || v < 1e-3 ? fmt.sci(v, 2) : v >= 1 ? fmt(v, v >= 1000 ? 0 : v >= 100 ? 1 : 2) : fmt(v, 2 - Math.floor(Math.log10(v))); }

    return function draw() {
      var th = mark.x, s = sig.value, t = tt.value, nar = narrow();
      // left: the three cosine terms, their sum, and the square it equals
      L.grid({ xStep: PI, yTicks: YT });
      L.axes({ xTicks: [{ at: -TW, tex: 'm2pi' }, { at: -PI, tex: 'mpi' }, { at: PI, tex: 'pi' }, { at: TW, tex: 'p2pi' }], yTicks: YT, size: 11 });
      L.fillBetween(sum, 0, -TW, TW, { color: 'red', alpha: 0.13 });
      L.plot(function () { return 3; }, { color: 'blue', width: 1.4, alpha: 0.85 });
      L.plot(function (x) { return 4 * Math.cos(x); }, { color: 'teal', width: 1.4, alpha: 0.85 });
      L.plot(function (x) { return Math.cos(2 * x); }, { color: 'gold', width: 1.4, alpha: 0.85 });
      L.plot(sum, { color: 'red', width: 2.8 });
      L.plot(function (x) { var c = 1 + Math.cos(x); return 2 * c * c; }, { color: 'fg', width: 1.4, dash: [7, 6] });
      L.segment(th, 0, th, sum(th), { color: 'red', width: 1, dash: [3, 4], alpha: 0.7 });
      L.point(th, 3, { color: 'blue', r: 3.5 }); L.point(th, 4 * Math.cos(th), { color: 'teal', r: 3.5 }); L.point(th, Math.cos(2 * th), { color: 'gold', r: 3.5 });
      // the legend sits in the empty band above the curves; the sum's value rides beside the marker
      fig.legend(nar ? [{ color: 'red', tex: 'sum', width: 2.8 }, { color: 'fg', tex: 'sq', dash: [7, 6], width: 1.4 }]
        : [{ color: 'blue', tex: 'three', width: 1.4 }, { color: 'teal', tex: 'c4', width: 1.4 }, { color: 'gold', tex: 'c2', width: 1.4 },
          { color: 'red', tex: 'sum', width: 2.8 }, { color: 'fg', tex: 'sq', dash: [7, 6], width: 1.4 }],
        { plane: L, at: 'n', margin: 2, dir: 'row', size: nar ? 10.5 : 12, id: 'cos' });
      var val = '= ' + fmt(sum(th), 3), vw = fig.measure(val, 12, 600, true) + 8;
      var vx = L.X(th) + 10 + vw <= L.box.r ? L.X(th) + 10 : L.X(th) - 10 - vw, vy = Math.max(L.box.t, L.Y(sum(th)) - 26);
      fig.rect(vx, vy, vw, 17, { fill: 'stage', alpha: 0.85 });
      fig.text(val, vx + 4, vy + 12.5, { color: 'red', size: 12, mono: true, weight: 600 });

      // right: the factors and their product, as bars from 1 on a log axis
      var f = [Math.pow(absZ(s, 0), 3), Math.pow(absZ(s, t), 4), absZ(s, 2 * t)];
      f.push(f[0] * f[1] * f[2]);
      var vmin = Math.min.apply(null, f), vmax = Math.max.apply(null, f);
      lo.to(Math.floor(Math.log10(Math.min(0.3, vmin / 4)) * 2) / 2);
      hi.to(Math.ceil(Math.log10(Math.max(3, vmax * 4)) * 2) / 2);
      R.view.y0 = Math.pow(10, lo.value); R.view.y1 = Math.pow(10, hi.value); R.update();
      var b = R.box;
      R.grid();
      R.axes({ yAt: 'left', x: false, size: 11 });
      var bw = Math.min(0.62, 46 / R.sx);
      for (var i = 0; i < 4; i++) {
        var cx = i + 0.5, y0 = R.Y(1), y1 = Kit.clamp(R.Y(f[i]), b.t, b.b);
        fig.rect(R.X(cx - bw / 2), Math.min(y0, y1), R.X(cx + bw / 2) - R.X(cx - bw / 2), Math.max(1.5, Math.abs(y1 - y0)), { fill: COLORS[i], alpha: i === 3 ? 0.95 : 0.8 });
        fig.text(num(f[i]), R.X(cx), f[i] >= 1 ? y1 - 6 : y1 + 13, { color: COLORS[i], size: nar ? 10 : 11.5, mono: true, align: 'center', weight: 600 });
        var row = i % 2;                                // staggered, so neighboring labels never touch
        fig.label(KEYS[i], R.X(cx), b.b + 6 + row * 17, { anchor: 'n', color: COLORS[i], size: nar ? 10.5 : 12 });
      }
      R.hline(1, { color: 'fg', width: 1.5 });
      fig.text(f[3] >= 1 ? 'product ≥ 1' : 'product < 1', b.r - 2, b.t - 8, { color: 'red', size: 11.5, align: 'right', weight: 600 });
    };
  }
});
