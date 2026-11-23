/* The Mellin transform of a function u on the critical line z = iy: |Mu(iy)| on a log scale for y in [0, 50], with
   the first ten zero ordinates of zeta as teal lines. For the theta sums V_{g_star} (Mu = 2 xi(1/2 + iy)) and
   V_{g_c} (Mu = 2 zeta(s) s (s - 1) M bump(s), s = 1/2 + iy) the curve falls to the floor at every teal line; for
   the log-Gaussian u_sigma (Mu = exp(-sigma^2 y^2 / 2)) it does not; and u_sigma + lambda V_{g_star} keeps the
   log-Gaussian's value exactly at the teal lines. 2 xi(1/2 + iy) = -(1/4 + y^2) pi^{-1/4} |Gamma(1/4 + iy/2)| Z(y)
   is real and comes from the kit's Gamma and Z; |M bump| is a table from mpmath (below). */
Kit.register('theta-mellin-zeros', {
  tex: { t: 't', y: 'y', critS: '\\Re z=0', crit:'z=iy,\\ \\text{the critical line }\\Re z=0', Mu: '\\lvert Mu(iy)\\rvert', zeros: '\\zeta(\\tfrac12+iy)=0',
    Vs: 'u=V_{g_\\star}', Vc: 'u=V_{g_c}', lg: 'u=u_\\sigma', sum: 'u=u_\\sigma+\\lambda V_{g_\\star}', us: 'u_\\sigma', lam: '\\lambda', sig: '\\sigma' },
  init: function (fig) {
    var M = Kit.math, fmt = Kit.fmt, Z = Kit.zeros, NZ = 10, PI = Math.PI, FLOOR = 1e-16, U = 3, NT = 601;
    /* log10(|s| |M bump(s)|) at s = 1/2 + iy, y = 0, 0.5, ..., 50 (mpmath, 20 digits; M bump(s) = integral over (0, 1) of
       exp(-1/(1 - x^2)) x^s dx/x). The factor |s| removes the pole at s = 0, so cubic interpolation is good to 0.001
       in log10 (checked against mpmath at 14 midpoints). */
    var LB = [-0.55165, -0.55902, -0.57954, -0.60949, -0.64496, -0.683, -0.72183, -0.76047, -0.79845, -0.83554, -0.8717, -0.90691, -0.9412, -0.97463, -1.00723, -1.03905, -1.07015, -1.10057, -1.13034, -1.15951, -1.18811, -1.21617, -1.24373, -1.2708, -1.29741, -1.32358, -1.34934, -1.37471, -1.3997, -1.42433, -1.44862, -1.47257, -1.49621, -1.51954, -1.54258, -1.56533, -1.58782, -1.61004, -1.63201, -1.65374, -1.67523, -1.69649, -1.71753, -1.73836, -1.75898, -1.7794, -1.79962, -1.81965, -1.8395, -1.85917, -1.87867, -1.898, -1.91716, -1.93616, -1.955, -1.97369, -1.99223, -2.01063, -2.02888, -2.047, -2.06498, -2.08283, -2.10054, -2.11813, -2.1356, -2.15295, -2.17018, -2.18729, -2.20428, -2.22117, -2.23794, -2.25461, -2.27118, -2.28764, -2.304, -2.32026, -2.33642, -2.35249, -2.36846, -2.38434, -2.40013, -2.41583, -2.43145, -2.44698, -2.46242, -2.47778, -2.49306, -2.50825, -2.52337, -2.53841, -2.55337, -2.56826, -2.58307, -2.59781, -2.61248, -2.62708, -2.6416, -2.65606, -2.67045, -2.68477, -2.69903];
    function logBump(y) {                                          // Catmull-Rom in y; the table is even in y
      var i = Math.min(99, Math.floor(y / 0.5)), u = y / 0.5 - i;
      var p0 = LB[i > 0 ? i - 1 : 1], p1 = LB[i], p2 = LB[i + 1], p3 = LB[Math.min(100, i + 2)];
      return 0.5 * (2 * p1 + (p2 - p0) * u + (2 * p0 - 5 * p1 + 4 * p2 - p3) * u * u + (3 * p1 - p0 - 3 * p2 + p3) * u * u * u);
    }
    // The y grid: steps of 0.025 with the ten zero ordinates inserted, where the theta sums are exactly 0.
    var ys = [], isZero = [];
    for (var j = 0, k = 0; j <= 2000; j++) {
      var y = j * 0.025;
      while (k < NZ && Z[k] < y) { ys.push(Z[k]); isZero.push(true); k++; }
      ys.push(y); isZero.push(false);
    }
    var NY = ys.length, curR = new Float64Array(NY), prevR = new Float64Array(NY), outR = new Float64Array(NY);
    var tab = fig.job(function* () {
      var xi2 = new Float64Array(NY), gcm = new Float64Array(NY), c = Math.pow(PI, -0.25);
      for (var i = 0; i < NY; i++) {
        var yy = ys[i];
        if (!isZero[i]) {
          var z = M.Z(yy), q = 0.25 + yy * yy;
          xi2[i] = -q * c * Math.exp(M.lgamma(M.C(0.25, yy / 2)).re) * z;
          gcm[i] = 2 * Math.abs(z) * Math.sqrt(q) * Math.pow(10, logBump(yy));
        }
        if (i % 40 === 39) yield i / NY;
      }
      return { xi2: xi2, gcm: gcm };
    }, { budget: 2 });

    // Left side: u on the log t grid. V_{g_star} and V_{g_c} from their theta sums.
    var ts = new Float64Array(NT), Vs = new Float64Array(NT), Vc = new Float64Array(NT), curL = new Float64Array(NT), prevL = new Float64Array(NT), outL = new Float64Array(NT);
    for (var i = 0; i < NT; i++) ts[i] = Math.exp(-U + 2 * U * i / (NT - 1));
    var left = fig.job(function* () {
      for (var i = 0; i < NT; i++) {
        var t = ts[i], s1 = 0, s2 = 0, n;
        for (n = 1; n * t < 7; n++) { var q = PI * n * n * t * t; s1 += (4 * q * q - 6 * q) * Math.exp(-q); }
        for (n = 1; n * t < 1; n++) { var x2 = n * n * t * t, r = 1 - x2; s2 += 2 * x2 * (x2 * x2 + 4 * x2 - 3) / (r * r * r * r) * Math.exp(-1 / r); }
        Vs[i] = 2 * Math.sqrt(t) * s1; Vc[i] = 2 * Math.sqrt(t) * s2;
        if (i % 60 === 59) yield i / NT;
      }
    }, { budget: 1 });

    var mode = fig.select({ label: 'Function u', value: 'gs', options: [['gs', 'V of g⋆ (theta sum)'], ['gc', 'V of the compact g (theta sum)'],
      ['lg', 'log-Gaussian (not a theta sum)'], ['sum', 'log-Gaussian + λ · V of g⋆']] });
    var sig = fig.slider({ label: 'Width', tex: 'sig', min: 0.05, max: 0.3, step: 0.01, value: 0.2 });
    var lam = fig.slider({ label: 'Multiple', tex: 'lam', min: -2, max: 2, step: 0.05, value: 1 });
    var mix = fig.tween(1), lastMode = mode.value, ly0 = fig.follow(-0.2), ly1 = fig.follow(2);
    var wideBox = function (a, b) { return function (w, h) { var s = Math.round(0.38 * w); return w < 560 ? [0, Math.round(a * h), w, Math.round(b * h)] : [a ? s : 0, 0, a ? w : s, h]; }; };
    var Lp = fig.plane({ x: [Math.exp(-U), Math.exp(U)], y: [-0.2, 2], xLog: true, pad: { t: 12, r: 12, b: 24, l: 40 }, box: wideBox(0, 0.42) });
    var Rp = fig.plane({ x: [0, 50], y: [FLOOR, 10], yLog: true, pad: { t: 12, r: 14, b: 26, l: 46 }, box: wideBox(0.42, 1) });
    var Y_TICKS = [10, 1, 1e-4, 1e-8, 1e-12, 1e-16];

    function fill(m, s, l, data) {                                // current target curves for mode m
      var a = s * s / 2, i;
      for (i = 0; i < NT; i++) {
        var lt = Math.log(ts[i]), lgv = Math.exp(-lt * lt / (2 * s * s)) / (s * Math.sqrt(2 * PI));
        curL[i] = m === 'gs' ? Vs[i] : m === 'gc' ? Vc[i] : m === 'lg' ? lgv : lgv + l * Vs[i];
      }
      for (i = 0; i < NY; i++) {
        var e = Math.exp(-a * ys[i] * ys[i]), v;
        if (m === 'lg') v = e;
        else if (!data) v = FLOOR;
        else v = m === 'gs' ? Math.abs(data.xi2[i]) : m === 'gc' ? data.gcm[i] : Math.abs(e + l * data.xi2[i]);
        curR[i] = Math.log10(Math.max(v, FLOOR));
      }
    }
    function f4(v) { return v === 0 ? '0' : Math.abs(v) >= 1e-3 ? fmt(v, Math.max(0, 3 - Math.floor(Math.log10(Math.abs(v))))) : fmt.sci(v, 2); }

    return function draw() {
      var m = mode.value, s = sig.value, l = lam.value, narrow = fig.w < 560;
      sig.show(m === 'lg' || m === 'sum'); lam.show(m === 'sum');
      if (m !== lastMode) { lastMode = m; prevL.set(outL); prevR.set(outR); mix.set(0); mix.to(1, 400); }
      fill(m, s, l, tab.done ? tab.result : null);
      var w = mix.value, lo = Infinity, hi = -Infinity, i;
      for (i = 0; i < NT; i++) { outL[i] = prevL[i] + (curL[i] - prevL[i]) * w; if (curL[i] < lo) lo = curL[i]; if (curL[i] > hi) hi = curL[i]; }
      for (i = 0; i < NY; i++) outR[i] = Math.pow(10, prevR[i] + (curR[i] - prevR[i]) * w);
      if (hi - lo < 1e-9) hi = lo + 1;
      var pad = 0.08 * (hi - lo);
      Lp.view.y0 = ly0.to(Math.min(-0.05 * hi, lo - pad)).value; Lp.view.y1 = ly1.to(hi + pad + 0.25 * (hi - lo)).value; Lp.update();

      // Left: u(t) on a log t axis.
      Lp.grid({ xTicks: [0.1, 1, 10] });
      Lp.hline(0, { color: 'muted', width: 1 });
      Lp.axes({ edge: true, xTicks: [0.05, 0.1, 0.2, 0.5, 1, 2, 5, 10, 20], xLabel: 't', xFormat: String });
      if (left.done) {
        if (m === 'sum') Lp.plot(function (t) { var lt = Math.log(t); return Math.exp(-lt * lt / (2 * s * s)) / (s * Math.sqrt(2 * PI)); }, { color: 'muted', width: 1.5, dash: [5, 4] });
        Lp.path(ts, outL, { color: 'gold', width: 2.4 });
      }
      fig.legend([{ color: 'gold', tex: m === 'gs' ? 'Vs' : m === 'gc' ? 'Vc' : m }, m === 'sum' && { color: 'muted', tex: 'us', dash: [5, 4] }],
        { plane: Lp, at: 'nw', size: narrow ? 11.5 : 12.5, dir: narrow ? 'row' : 'col' });

      // Right: |Mu(iy)| on the critical line, with the zeros of zeta.
      var rb = Rp.box;
      Rp.grid({ xStep: 10, yTicks: Y_TICKS });
      Rp.rug(Z, { color: 'teal', end: NZ, width: 1.5, alpha: 0.75 });
      Rp.axes({ edge: true, xStep: 10, yTicks: Y_TICKS, xLabel: 'y' });
      fig.line(rb.l, rb.b + 0.5, rb.r, rb.b + 0.5, { color: 'violet', width: 2.5 });
      if (m === 'sum') Rp.plot(function (y) { return Math.max(FLOOR, Math.exp(-s * s * y * y / 2)); }, { color: 'muted', width: 1.5, dash: [5, 4] });
      Rp.path(ys, outR, { color: 'gold', width: 1.8 });
      if (!tab.done && m !== 'lg') fig.text('computing ζ on the line: ' + Math.round(100 * tab.progress) + '%', rb.r - 8, rb.t + 14, { color: 'muted', size: 12, align: 'right' });
      if (m === 'sum') for (i = 0; i < NZ; i++) { var e = Math.exp(-s * s * Z[i] * Z[i] / 2); if (e > FLOOR) Rp.point(Z[i], e, { color: 'teal', r: 3.6 }); }
      fig.label(narrow ? 'critS' : 'crit', rb.l + 4, rb.b - 4, { anchor: 'sw', color: 'violet', size: narrow ? 11.5 : 12.5 });
      var rows = [];
      for (i = 0; i < (narrow ? 3 : 5); i++) {
        var v = m === 'gs' || m === 'gc' ? 0 : Math.exp(-s * s * Z[i] * Z[i] / 2);   // the theta sum adds exactly 0 at a zero
        rows.push(['γ' + fmt.sub(i + 1) + ' = ' + fmt(Z[i], 2), f4(v), v ? 'fg' : 'teal']);
      }
      fig.panel(rows, { plane: Rp, prefer: ['ne', 'se'], id: 'atzeros', hint: '|Mu(iγ)| at the zeros', compact: false });   // the hint says what the numbers are
    };
  }
});
