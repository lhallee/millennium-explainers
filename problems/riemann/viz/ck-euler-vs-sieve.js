/* Meyer's infinite Euler product against the one-prime-at-a-time sieve, with Y = 3. Left: |prod_{i <= j} (1 - p_i^{-s})|
   over the primes p_1 = 5, ..., p_200 = 1231 beyond 3, and for sigma > 1 its limit |zeta(s)^{-1} (1 - 2^{-s})^{-1}
   (1 - 3^{-s})^{-1}|. Right: the sieved theta sum Theta^(j)(t0) = 2 sum over n >= 1 free of p_1, ..., p_j of g(n t0),
   g(x) = x^2 (exp(-pi x^2) - 8 exp(-4 pi x^2)), against its limit, the sum over the 3-smooth n. Terms with n t0 > 7 are
   below 1e-60, so n runs to 140 and the sum is exact to double precision after the primes up to 7 / t0 are removed. */
Kit.register('ck-euler-vs-sieve', {
  tex: {
    prod: '\\bigl\\lvert\\textstyle\\prod_{i\\le j}(1-p_i^{-s})\\bigr\\rvert', lim: '\\bigl\\lvert\\zeta(s)^{-1}(1-2^{-s})^{-1}(1-3^{-s})^{-1}\\bigr\\rvert',
    th: '\\Theta_g^{(j)}(t_0)', thl: '\\lim_j\\Theta_g^{(j)}(t_0)', j: 'j', t0: 't_0'
  },
  init: function (fig) {
    var M = Kit.math, fmt = Kit.fmt, NP = 200, NJ = 40, Q = null;
    var g = function (x) { var x2 = x * x; return x2 * (Math.exp(-Math.PI * x2) - 8 * Math.exp(-4 * Math.PI * x2)); };
    fig.job(M.sieveTask(1300), { onDone: function () { Q = M.primes(1300).filter(function (p) { return p > 3; }).slice(0, NP); } });
    var zs = Array.prototype.slice.call(Kit.zeros, 0, Kit.upperBound(Kit.zeros, 30));
    var sig = fig.slider({ label: 'Real part', min: 0.3, max: 2, step: 0.01, value: 0.6, marks: [{ at: 1, color: 'red', title: 'σ = 1' }],
      format: function (v) { return 'σ = ' + fmt(v, 2); } });
    var tau = fig.slider({ label: 'Imaginary part', min: 0, max: 30, step: 0.01, value: 14.13, snap: zs,
      marks: zs.map(function (z) { return { at: z, color: 'teal' }; }), format: function (v) { return 'τ = ' + fmt(v, 2); } });
    var T0 = fig.slider({ label: 'Point', tex: 't0', min: 0.05, max: 1, step: 0.01, value: 0.1, format: function (v) { return fmt(v, 2); } });
    var pr = new Float64Array(NP + 1), js = new Float64Array(NP + 1), th = new Float64Array(NJ + 1), jt = new Float64Array(NJ + 1), wj = new Float64Array(NJ + 1);
    for (var k = 0; k <= NP; k++) js[k] = k;
    for (k = 0; k <= NJ; k++) jt[k] = k;
    var lo = fig.follow(-0.5, { tau: 0.1 }), hi = fig.follow(0.1, { tau: 0.1 }), ymaxL = fig.follow(3, { tau: 0.1 });
    var split = function (w) { return w >= 560 ? 0.55 : 0.52; };
    var L = fig.plane({ x: [0, NP], y: [0, 3], pad: { t: 12, r: 12, b: 28, l: 34 }, box: function (w, h) { return [0, 0, split(w) * w, h]; } });
    var R = fig.plane({ x: [0, NJ], y: [-0.5, 0.1], pad: { t: 12, r: 14, b: 28, l: 48 }, box: function (w, h) { return [split(w) * w, 0, w, h]; } });

    return function draw() {
      var s = sig.value, t = tau.value, t0 = T0.value, nar = fig.w < 560, i, n;
      // left: partial products of (1 - p^{-s}) over the primes beyond 3; the window grows with them, from 3 up to 12
      var limit = null, top = 3;
      if (Q) {
        var re = 1, im = 0;
        pr[0] = 1;
        for (i = 0; i < NP; i++) {
          var lp = Math.log(Q[i]), m = Math.exp(-s * lp), ar = 1 - m * Math.cos(t * lp), ai = m * Math.sin(t * lp);
          var nr = re * ar - im * ai; im = re * ai + im * ar; re = nr;
          pr[i + 1] = Math.hypot(re, im);
          top = Math.max(top, 1.12 * pr[i + 1]);
        }
        if (s > 1) {
          var one = M.C(1, 0), ms = M.C(-s, -t);
          limit = 1 / M.abs(M.mul(M.zeta(s, t), M.mul(M.sub(one, M.pow(M.C(2, 0), ms)), M.sub(one, M.pow(M.C(3, 0), ms)))));
        }
      }
      L.view.y1 = ymaxL.to(Math.min(12, top)).value; L.update();
      L.grid({ xStep: 50 });
      L.axes({ edge: true, xStep: 50, xLabel: 'j', yStep: M.niceStep(L.v.y1, L.box.h, nar ? 40 : 55) });
      L.hline(1, { color: 'muted', width: 1, dash: [3, 4] });
      if (Q) {
        L.path(js, pr, { color: 'red', width: 2.2 });
        if (limit != null) L.hline(limit, { color: 'blue', width: 1.6 });
        fig.legend([{ color: 'red', tex: 'prod' }, limit != null && (nar ? { color: 'blue', text: 'limit' } : { color: 'blue', tex: 'lim' })],
          { plane: L, at: 'auto', prefer: ['se', 'ne', 'sw'], id: 'leftLegend', size: nar ? 11 : 12.5 });
        if (!nar) fig.panel([['s', fmt.complex(s, t, 2)], ['at j = ' + NP, fmt(pr[NP], 4), 'red'], limit != null ? ['limit', fmt(limit, 4), 'blue'] : null,
          ['absolute convergence', s > 1 ? 'yes' : 'no', s > 1 ? 'blue' : 'red']], { plane: L, at: 'auto', prefer: ['ne', 'se', 'nw'], id: 'left' });
      }

      // right: the sieved sums at t0, j = 0 to 40, against their limit
      // w[i]: the terms crossed out by the i-th removal; lim: the 3-smooth terms; rest: terms whose least prime
      // beyond 3 is past p_40 (none while t0 >= 0.05, since then n <= 140 < p_40 = 181)
      var nmax = Math.floor(7 / t0), lim = 0, rest = 0, first = 0;
      wj.fill(0);
      for (n = 1; n <= nmax && Q; n++) {
        var v = 2 * g(n * t0), c = n;
        while (c % 2 === 0) c /= 2;
        while (c % 3 === 0) c /= 3;
        if (c === 1) { lim += v; continue; }
        for (i = 0; i < NJ && c % Q[i]; i++);
        if (i < NJ) wj[i + 1] += v; else rest += v;
      }
      th[NJ] = lim + rest;
      for (k = NJ - 1; k >= 0; k--) th[k] = th[k + 1] + wj[k + 1];
      for (k = 0; k <= NJ; k++) if (Math.abs(th[k] - lim) < 5e-7) { first = k; break; }
      var ymin = Math.min(lim, 0), ymax = 0, pad;
      for (k = 0; k <= NJ; k++) { ymin = Math.min(ymin, th[k]); ymax = Math.max(ymax, th[k]); }
      pad = 0.12 * (ymax - ymin) + 0.01;
      R.view.y0 = lo.to(ymin - pad).value; R.view.y1 = hi.to(ymax + pad).value; R.update();
      R.grid({ xStep: 10 });
      R.axes({ edge: true, xStep: 10, xLabel: 'j', yStep: M.niceStep(R.v.y1 - R.v.y0, R.box.h, nar ? 40 : 55) });
      R.hline(lim, { color: 'blue', width: 1.6, dash: [6, 4] });
      if (!Q) return;
      R.path(jt, th, { color: 'gold', width: 2 });
      for (k = 0; k <= NJ; k++) R.point(k, th[k], { color: 'gold', r: nar ? 2.2 : 3, ringWidth: 1 });
      R.label('th', 0, th[0], { anchor: th[0] >= th[1] ? 'sw' : 'nw', color: 'gold', dx: 8, dy: th[0] >= th[1] ? -4 : 4, size: nar ? 11.5 : 13 });
      fig.panel([[{ tex: 'thl' }, fmt(lim, 6), 'blue'], ['reached at', 'j = ' + first, 'gold']],
        { plane: R, at: 'auto', prefer: nar ? ['e', 'se'] : ['ne', 'e', 'se'], id: 'right', compact: false, size: nar ? 10.5 : 11.5 });
    };
  }
});
