/* The finite-group explicit formula for Q(i), both sides computed independently on 20 <= X <= 20,000:
     left   A_4(X) - M_4(X), with A_4 summed over the inert prime powers alone (p = 3 mod 4, odd exponent, weight 2 Lambda)
            and M_4(X) = X log X - (1 + gamma_E) X - X log 2 + X L'/L(1, chi_4);
     right  G_0(X) - g_{chi_4}(X) - (B_2(X) - X log 2), from all prime powers and the character sum,
   with L'/L(1, chi_4) = gamma_E + 2 log 2 + 3 log pi - 4 log Gamma(1/4) = 0.24560958... (mpmath). Prefix sums over
   n <= 20,000 are built once in a job, so each X costs O(1). The strip above counts the odd primes up to X, split
   (gold) and inert (red). After the job, the chapter's table and counts are compared and a mismatch is logged. */
Kit.register('inert-balance', {
  tex: { ex: 'A_4-M_4', G0: 'G_0', g4: 'g_{\\chi_4}', rhs: 'G_0-g_{\\chi_4}-(B_2-X\\log 2)', A4: 'A_4', M4: 'M_4', B2: 'B_2-X\\log 2',
    X: 'X', rs: '\\text{right side}' },
  init: function (fig) {
    var M = Kit.math, fmt = Kit.fmt, TOP = 20000, X0 = 20, NS = 1500, EG = 0.5772156649015329, LD = 0.24560958477731417, L2 = Math.LN2;
    var X = fig.slider({ label: 'Largest n', tex: 'X', min: X0, max: TOP, scale: 'log', value: 1000, marks: [100, 1000, 10000],
      snap: [100, 1000, 10000], format: function (v) { return 'X = ' + fmt(Math.round(v)); } });
    var showG = fig.toggle({ label: 'Show', tex: 'G0', value: true });
    var showg = fig.toggle({ label: 'Show', tex: 'g4', value: true });
    var showR = fig.toggle({ label: 'Show the right side', value: true });

    var D = null;                                                  // prefix sums, prime lists, and sampled curves
    function at(D, x) {                                            // every quantity at a real x, in O(1)
      var k = Math.floor(x), lx = Math.log(x), K = 0;
      while (2 << K <= x) K++;                                    // K = floor(log2 x), as 2^(K+1) = 2 << K
      var A = x * D.i1[k] - D.i0[k], Mm = x * lx - (1 + EG) * x - x * L2 + x * LD;
      var G = x * D.l1[k] - D.l0[k] - x * lx + (1 + EG) * x, g = x * D.c1[k] - D.c0[k] + x * LD;
      var B = x * L2 * (1 - Math.pow(2, -K)) - K * L2 - x * L2;
      return { A: A, M: Mm, ex: A - Mm, G: G, g: g, B: B, rs: G - g - B };
    }
    fig.job(M.sieveTask(TOP));
    fig.job(function* () {
      while (M.sieveLimit() < TOP) yield 0;
      var lam = new Float64Array(TOP + 1), w2 = new Float64Array(TOP + 1), ps = M.primes(TOP), split = [], inert = [], i, n, pk, k;
      for (i = 0; i < ps.length; i++) {
        if (i % 500 === 499) yield 0;
        for (pk = ps[i], k = 1; pk <= TOP; pk *= ps[i], k++) {   // w2: weight 2 log p on p^k with p = 3 mod 4 and k odd
          lam[pk] = Math.log(ps[i]); if (ps[i] % 4 === 3 && k % 2 === 1) w2[pk] = 2 * lam[pk];
        }
        if (ps[i] % 4 === 1) split.push(ps[i]); else if (ps[i] % 4 === 3) inert.push(ps[i]);
      }
      var d = { split: split, inert: inert };
      ['l1', 'l0', 'c1', 'c0', 'i1', 'i0'].forEach(function (key) { d[key] = new Float64Array(TOP + 1); });
      for (n = 1; n <= TOP; n++) {
        var L = lam[n], ch = n % 2 === 0 ? 0 : n % 4 === 1 ? 1 : -1;
        d.l1[n] = d.l1[n - 1] + L / n; d.l0[n] = d.l0[n - 1] + L;
        d.c1[n] = d.c1[n - 1] + ch * L / n; d.c0[n] = d.c0[n - 1] + ch * L;
        d.i1[n] = d.i1[n - 1] + w2[n] / n; d.i0[n] = d.i0[n - 1] + w2[n];
        if (n % 1000 === 0) yield n / TOP / 2;
      }
      d.xs = new Float64Array(NS); ['ex', 'G', 'g', 'rs'].forEach(function (key) { d[key + 's'] = new Float64Array(NS); });
      var worst = 0;
      for (i = 0; i < NS; i++) {
        var x = X0 * Math.pow(TOP / X0, i / (NS - 1)), v = at(d, Math.min(x, TOP));
        d.xs[i] = x; d.exs[i] = v.ex; d.Gs[i] = v.G; d.gs[i] = v.g; d.rss[i] = v.rs;
        worst = Math.max(worst, Math.abs(v.ex - v.rs));
        if (i % 150 === 149) yield 0.5 + i / NS / 2;
      }
      if (worst > 1e-7) console.error('inert-balance: the two sides differ by ' + worst);
      [[100, 'A', 264.9575], [100, 'M', 258.0417], [100, 'G', 1.7217], [100, 'g', 0.0478], [100, 'B', -5.2419], [1000, 'ex', 9.6400],
        [1000, 'G', 1.5309], [1000, 'g', -0.5169], [1000, 'B', -7.5921], [10000, 'ex', 4.6111], [10000, 'G', 1.7493], [10000, 'g', 6.9953],
        [10000, 'B', -9.8570], [10000, 'A', 71860.4822]].forEach(function (c) {
        var got = at(d, c[0])[c[1]];
        if (Math.abs(got - c[2]) > 6e-5) console.error('inert-balance: ' + c[1] + '(' + c[0] + ') = ' + got + ', chapter says ' + c[2]);
      });
      [[1000, 167, 87], [10000, 1228, 619]].forEach(function (c) {
        var a = Kit.upperBound(split, c[0]) + Kit.upperBound(inert, c[0]), b = Kit.upperBound(inert, c[0]);
        if (a !== c[1] || b !== c[2]) console.error('inert-balance: up to ' + c[0] + ', ' + a + ' odd primes and ' + b + ' inert; chapter says ' + c[1] + ' and ' + c[2]);
      });
      D = d;
    });

    function geom(w, h) { var narrow = w < 560; return { narrow: narrow, strip: narrow ? 46 : 62, side: w >= 640 ? 214 : 0 }; }   // side: a column for the values
    var pad = { t: 8, r: 14, b: 26, l: 40 };
    var T = fig.plane({ x: [X0, TOP], y: [0, 1], xLog: true, pad: { t: 20, r: 14, b: 3, l: 40 },
      box: function (w, h) { var g = geom(w, h); return [0, 0, w - g.side, g.strip]; } });
    var P = fig.plane({ x: [X0, TOP], y: [-22, 24], xLog: true, pad: pad,
      box: function (w, h) { var g = geom(w, h); return [0, g.strip + (g.narrow ? 40 : 26), w - g.side, h]; } });

    return function draw() {
      var g = geom(fig.w, fig.h), x = X.value, b = P.box, sz = g.narrow ? 10.5 : 12;
      if (P.view.y0 !== (g.side ? -12 : -22)) { P.view.y0 = g.side ? -12 : -22; P.update(); }   // on a phone the values sit under the curves
      P.grid();
      P.axes({ edge: true, xLabel: 'X', yStep: g.narrow ? 10 : 5, size: g.narrow ? 10.5 : 11.5 });
      P.hline(0, { color: 'muted', width: 1 });
      fig.line(T.box.l, T.Y(0.5), T.box.r, T.Y(0.5), { color: 'muted', width: 1, alpha: 0.5 });
      fig.text('split', 4, T.Y(0.75), { color: 'gold', size: sz - 0.5, baseline: 'middle' });
      fig.text('inert', 4, T.Y(0.25), { color: 'red', size: sz - 0.5, baseline: 'middle' });
      if (!D) {
        fig.text('summing over prime powers up to 20,000', b.l + 12, b.t + 20, { color: 'muted', size: 12 });
        return;
      }
      var v = at(D, x);

      // The strip: the odd primes up to X, split above and inert below, and their counts.
      var ns = Kit.upperBound(D.split, x), ni = Kit.upperBound(D.inert, x);
      T.rug(D.split, { color: 'gold', width: 1, y0: 0.55, y1: 0.95, end: ns, alpha: 0.9 });
      T.rug(D.inert, { color: 'red', width: 1, y0: 0.05, y1: 0.45, end: ni, alpha: 0.9 });
      var parts = [['split ' + fmt(ns), 'gold'], ['inert ' + fmt(ni), 'red'], ['half ' + fmt((ns + ni) / 2, 1), 'blue']], cx = T.box.r;
      for (var i = parts.length - 1; i >= 0; i--) {
        fig.text(parts[i][0], cx, T.box.t - 7, { color: parts[i][1], size: sz, align: 'right', mono: true });
        cx -= fig.measure(parts[i][0], sz, 500, true) + (g.narrow ? 10 : 16);
      }

      // The two sides, and the two zero-noise terms of the right side.
      if (showG.value) P.path(D.xs, D.Gs, { color: 'teal', width: 1.6 });
      if (showg.value) P.path(D.xs, D.gs, { color: 'teal', width: 1.6, dash: [2, 3] });
      // with the right side shown, the gold curve is wider and lighter, so the red dashes along it stay visible
      P.path(D.xs, D.exs, showR.value ? { color: 'gold', width: 5, alpha: 0.45 } : { color: 'gold', width: 3.4, alpha: 0.85 });
      if (showR.value) P.path(D.xs, D.rss, { color: 'red', width: 1.5, dash: [6, 5] });
      P.vline(x, { color: 'fg', width: 1, alpha: 0.45, dash: [3, 4] });
      if (showG.value) P.point(x, v.G, { color: 'teal', r: 3.5 });
      if (showg.value) P.point(x, v.g, { color: 'teal', r: 3.5 });
      P.point(x, v.ex, { color: 'gold', r: 4.5 });
      fig.legend([{ color: 'gold', tex: 'ex', width: 3.4 }, showG.value && { color: 'teal', tex: 'G0', width: 1.6 },
        showg.value && { color: 'teal', tex: 'g4', width: 1.6, dash: [2, 3] }, showR.value && { color: 'red', tex: g.narrow ? 'rs' : 'rhs', width: 1.5, dash: [6, 5] }],
        { plane: P, dir: 'row', bg: false, size: g.narrow ? 11 : 13, x: b.l - 8, y: P.outer.t - (g.narrow ? 40 : 26), id: 'lg' });

      // The values at X: a count of size X log X whose excess is a handful.
      var rows = [['X', fmt(Math.round(x))], g.narrow ? null : [{ tex: 'A4' }, fmt(v.A, 4), 'gold'], g.narrow ? null : [{ tex: 'M4' }, fmt(v.M, 4), 'blue'],
        [{ tex: 'ex' }, fmt(v.ex, 4), 'gold'], [{ tex: 'G0' }, fmt(v.G, 4), 'teal'], [{ tex: 'g4' }, fmt(v.g, 4), 'teal'],
        [{ tex: 'B2' }, fmt(v.B, 4)], [g.narrow ? 'right' : 'right side', fmt(v.rs, 4), 'red']];
      if (g.side) fig.panel(rows, { plane: P, x: fig.w - g.side + 6, y: b.t, compact: false, id: 'vals' });
      else fig.panel(rows, { plane: P, at: 'sw', compact: true, id: 'vals' });   // below the curves, which stay above -8
    };
  }
});
