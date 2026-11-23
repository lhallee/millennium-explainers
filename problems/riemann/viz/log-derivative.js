/* The Dirichlet series of Lambda(n) building up -zeta'(s)/zeta(s). Left: a stem Lambda(n) n^-s at each prime power
   n <= N (primes solid, higher powers lighter) and, on a second scale at the right edge, the running total climbing
   to the target, the remaining gap shaded red. Right: -zeta'/zeta for 1 < s <= 4 hugging 1/(s-1) - gamma_E near the
   pole. The target comes from the kit's zeta: zeta' = g' - 1/(s-1)^2 with g(s) = zeta(s) - 1/(s-1) smooth, and g'
   a central difference with step 1e-4; this agrees with mpmath to better than 1e-8 for 1.05 <= s <= 4. */
Kit.register('log-derivative', {
  tex: {
    term: '\\Lambda(n)\\,n^{-s}', total: '\\textstyle\\sum_{n\\le N}\\Lambda(n)\\,n^{-s}', target: '-\\zeta\'(s)/\\zeta(s)',
    pole: '1/(s-1)-\\gamma_E', n: 'n', s: 's'
  },
  init: function (fig) {
    var M = Kit.math, fmt = Kit.fmt, EG = 0.5772156649015329, NMAX = 2000, YR = 8, S0 = 1.05;
    var g = function (t) { return M.zeta(t, 0).re - 1 / (t - 1); };
    var target = function (s) { var d = (g(s + 1e-4) - g(s - 1e-4)) / 2e-4 - 1 / ((s - 1) * (s - 1)); return -d / M.zeta(s, 0).re; };

    var S = fig.slider({ label: 'Exponent', tex: 's', min: 1.2, max: 4, step: 0.01, value: 2 });
    var logN = Kit.scale('log', 10, NMAX);
    var play = fig.player({ label: 'Terms up to', min: 10, max: NMAX, scale: 'log', duration: 8, autoplay: false,
      value: logN.from(100), reduced: logN.from(100), format: function (v) { return 'N = ' + fmt(Math.round(v)); } });
    var sCam = fig.follow(S.value, { tau: 0.05 }), nCam = fig.follow(100, { tau: 0.06 });

    // prime powers up to 2000 from the shared sieve, with their labels p^k
    var pp = null;
    fig.job(M.sieveTask(NMAX), { onDone: function () {
      var xs = [], lam = [], prime = [], lab = [];
      for (var n = 2; n <= NMAX; n++) {
        var L = M.vonMangoldt(n);
        if (!L) continue;
        var p = Math.round(Math.exp(L)), k = Math.round(Math.log(n) / L);
        xs.push(n); lam.push(L); prime.push(k === 1); lab.push(p + (k > 1 ? fmt.sup(k) : ''));
      }
      pp = { xs: Float64Array.from(xs), lam: Float64Array.from(lam), prime: prime, lab: lab, tot: new Float64Array(xs.length),
        px: Float64Array.from(xs.filter(function (x, i) { return prime[i]; })), qx: Float64Array.from(xs.filter(function (x, i) { return !prime[i]; })) };
    } });
    // the right panel's curve, denser near the pole
    var tab = null;
    fig.job(function* () {
      var n = 240, xs = new Float64Array(n), ys = new Float64Array(n);
      for (var i = 0; i < n; i++) { var u = i / (n - 1); xs[i] = S0 + (4 - S0) * u * u; ys[i] = target(xs[i]); if (i % 20 === 19) yield i / n; }
      return { xs: xs, ys: ys };
    }, { onDone: function (r) { tab = r; } });

    var split = function (w, h) { return w >= 600 ? [0.62 * w, 0] : [0, 0.5 * h]; };
    var boxL = function (w, h) { var q = split(w, h); return [0, 0, q[0] || w, q[1] || h]; };
    var L = fig.plane({ x: [0, 101], y: [0, 0.2], pad: { t: 26, r: 52, b: 24, l: 46 }, box: boxL });
    var T = fig.plane({ x: [0, 101], y: [0, 0.65], pad: { t: 26, r: 52, b: 24, l: 46 }, box: boxL });
    var R = fig.plane({ x: [1, 4], y: [0, YR], pad: { t: 8, r: 16, b: 24, l: 36 }, box: function (w, h) { var q = split(w, h); return [q[0], q[1], w, h]; } });
    var lastS = NaN, tgt = 0;

    return function draw() {
      var s = sCam.to(S.value).value, Nr = play.mapped, N = play.playing ? Nr : Math.round(Nr), narrow = fig.w < 600;
      var xw = nCam.to(N).value + 0.5;
      if (s !== lastS) { lastS = s; tgt = target(s); }
      var top = Math.max(Math.log(2) * Math.pow(2, -s), Math.log(3) * Math.pow(3, -s));
      L.view.x1 = T.view.x1 = xw; L.view.y1 = 1.15 * top; T.view.y1 = 1.12 * tgt; L.update(); T.update();
      var b = L.box, total = 0, i;

      L.grid();
      if (pp) {
        var tot = pp.tot;
        for (i = 0; i < pp.xs.length; i++) { total += pp.lam[i] * Math.pow(pp.xs[i], -s); tot[i] = total; }
        var term = function (x) { return M.vonMangoldt(x) * Math.pow(x, -s); }, wd = Kit.clamp(0.45 * b.w / xw, 1, 3);
        L.stems(pp.qx, term, { color: 'gold', width: wd, alpha: 0.45, to: N });
        L.stems(pp.px, term, { color: 'gold', width: wd, to: N });
        if (xw <= 64) {                                           // p^k above each stem, skipped where it would touch another
          var placed = [];
          for (i = 0; i < pp.xs.length && pp.xs[i] <= N; i++) {
            var lx = L.X(pp.xs[i]), ly = L.Y(term(pp.xs[i])) - 5, half = 3 + 3.2 * pp.lab[i].length, free = true;
            for (var q = 0; q < placed.length && free; q++) free = Math.abs(placed[q][0] - lx) > placed[q][2] + half + 2 || Math.abs(placed[q][1] - ly) > 13;
            if (free) { fig.text(pp.lab[i], lx, ly, { color: 'gold', size: 10.5, align: 'center', alpha: pp.prime[i] ? 1 : 0.7 }); placed.push([lx, ly, half]); }
          }
        }
        var upto = Kit.upperBound(pp.xs, N), sumN = upto ? tot[upto - 1] : 0;
        var totalAt = function (x) { var j = Kit.upperBound(pp.xs, x); return j ? tot[j - 1] : 0; };
        T.fillBetween(tgt, totalAt, 1, N, { color: 'red', alpha: 0.13 });
        T.stairs(pp.xs, tot, { color: 'blue', width: 2.3, to: N });
      }
      T.hline(tgt, { color: 'blue', width: 1.6, dash: [6, 4] });
      L.axes({ edge: true, xLabel: 'n', format: function (v) { return fmt(v); } });
      // the second scale, for the running total, on the right edge
      var st = Kit.math.niceStep(T.view.y1, b.h, 44), f = fmt.step(st);
      fig.line(b.r + 0.5, b.t, b.r + 0.5, b.b, { color: 'blue', width: 1, alpha: 0.6 });
      for (var v = 0; v <= T.view.y1 + 1e-9; v += st) {
        var y = Math.round(T.Y(v)) + 0.5;
        fig.line(b.r, y, b.r + 4, y, { color: 'blue', width: 1 });
        fig.text(f(v), b.r + 7, y + 4, { color: 'blue', size: 11.5 });
      }
      fig.label('term', b.l - 4, b.t - 5, { anchor: 'sw', color: 'gold', size: 12.5 });
      fig.label('total', b.r + 4, b.t - 5, { anchor: 'se', color: 'blue', size: 12.5 });
      // on a phone the gap sits mid-width over the target line, clear of the total's label at the top right
      if (pp && narrow) fig.text('gap ' + fmt(tgt - sumN, 4), b.l + 0.55 * b.w, T.Y(tgt) - 4, { color: 'red', size: 11.5, weight: 600, align: 'center' });
      else if (pp) fig.panel([
        ['sum to N', fmt(sumN, 5), 'blue'],
        ['−ζ′(s)/ζ(s)', fmt(tgt, 5), 'blue'],
        ['gap', fmt(tgt - sumN, 5), 'red']
      ], { plane: L, at: 'auto', prefer: ['e', 'se', 'ne'], id: 'sum' });

      // right: the target as a function of s
      var c = R.box;
      R.grid({ xStep: 1, yStep: narrow ? 4 : 2 });
      R.plot(function (t) { return 1 / (t - 1) - EG; }, { color: 'muted', width: 1.6, dash: [6, 4], from: 1.001 });
      if (tab) R.path(tab.xs, tab.ys, { color: 'blue', width: 2.4 });
      R.axes({ edge: true, xStep: 1, yStep: narrow ? 4 : 2, xLabel: 's' });
      R.segment(s, 0, s, tgt, { color: 'fg', width: 1, alpha: 0.45, dash: [3, 4] });
      R.point(s, tgt, { color: 'blue', r: 5.5 });
      if (!narrow) {
        var px = R.X(s), tw = fig.labelSize('target', 12.5).w + fig.measure(' = ' + fmt(tgt, 4), 12.5, 500, true), right = px + 12 + tw <= c.r;
        var ty = Math.max(c.t + 10, R.Y(tgt) - 16);
        fig.rect(right ? px + 8 : px - tw - 14, ty - 10, tw + 6, 20, { fill: 'stage', alpha: 0.85 });
        fig.mathText([{ tex: 'target' }, ' = ' + fmt(tgt, 4)], right ? px + 11 : px - 11, ty, { size: 12.5, mono: true, color: 'blue', align: right ? 'left' : 'right' });
      }
      fig.legend([{ color: 'blue', tex: 'target', width: 2.4 }, { color: 'muted', tex: 'pole', dash: [6, 4], width: 1.6 }],
        { plane: R, at: 'ne', size: narrow ? 11.5 : 12.5, dir: narrow ? 'row' : 'col', id: 'rl' });
    };
  }
});
