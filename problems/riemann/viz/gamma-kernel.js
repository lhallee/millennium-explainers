/* The Gamma kernel u^k e^(-sigma u) / k!, normalized to the density sigma^(k+1) u^k e^(-sigma u) / k!, against the window
   [U, (1 + delta) U]. Its mass outside the window is P(k+1, sigma U) + Q(k+1, sigma (1 + delta) U), the regularized
   incomplete Gamma functions, computed in logarithms (series for P below the mean, Lentz's continued fraction for Q
   above it) so that values such as 10^-79 print. With k locked to the code's choice k = ceil((1 + delta/2) sigma U),
   raising sigma narrows the kernel around the window's midpoint. Checked at startup against the chapter's numbers. */
Kit.register('gamma-kernel', {
  tex: { U: 'U', U2: '(1+\\delta)U', u: 'u', K: '\\sigma^{k+1}K_k(u)' },
  init: function (fig) {
    var M = Kit.math, fmt = Kit.fmt, UMAX = 20, NS = 240, lg = [0, 0];
    var lgam = function (a) { M.lgammaInto(a, 0, lg); return lg[0]; };
    var lse = function (p, q) { var m = Math.max(p, q); return m === -Infinity ? m : m + Math.log(Math.exp(p - m) + Math.exp(q - m)); };

    /* log P(a, x) and log Q(a, x), each accurate where it is the small one. */
    function logPQ(a, x) {
      var pre = a * Math.log(x) - x - lgam(a), i, lp, lq;
      if (x < a + 1) {
        var term = 1 / a, sum = term;
        for (i = 1; i < 100000; i++) { term *= x / (a + i); sum += term; if (term < sum * 1e-17) break; }
        lp = pre + Math.log(sum); lq = Math.log1p(-Math.exp(lp));
      } else {
        var bb = x + 1 - a, c = 1e300, dd = 1 / bb, h = dd;
        for (i = 1; i < 100000; i++) {
          var an = -i * (i - a); bb += 2;
          dd = an * dd + bb; if (Math.abs(dd) < 1e-300) dd = 1e-300;
          c = bb + an / c; if (Math.abs(c) < 1e-300) c = 1e-300;
          dd = 1 / dd; var del = dd * c; h *= del;
          if (Math.abs(del - 1) < 1e-16) break;
        }
        lq = pre + Math.log(h); lp = Math.log1p(-Math.exp(lq));
      }
      return [lp, lq];
    }
    /* log10 of the kernel's mass outside [U, (1 + d) U] for index k and rate s. */
    function logOut(k, s, U, d) { return lse(logPQ(k + 1, s * U)[0], logPQ(k + 1, s * (1 + d) * U)[1]) / Math.LN10; }
    var lockK = function (s, U, d) { return Math.ceil((1 + d / 2) * s * U); };
    // The chapter's numbers: k locked, U = 10, delta = 1/2; and the spine's sigma - 2 = 334 at U = 1 and U = 10.
    [[2.5, 10, 0.28107], [10, 10, 0.027228], [50, 10, 1.5005e-6]].forEach(function (c) {
      var got = Math.pow(10, logOut(lockK(c[0], c[1], 0.5), c[0], c[1], 0.5));
      if (!(Math.abs(got / c[2] - 1) < 1e-3)) console.error('gamma-kernel: outside mass at sigma = ' + c[0] + ' is ' + got + ', expected ' + c[2]);
    });
    [[420, 1, 1.1375e-4], [4200, 10, 2.9566e-32]].forEach(function (c) {
      var got = Math.pow(10, logOut(c[0], 334, c[1], 0.5));
      if (!(Math.abs(got / c[2] - 1) < 1e-3)) console.error('gamma-kernel: spine kernel at U = ' + c[1] + ' has outside mass ' + got + ', expected ' + c[2]);
    });

    var uS = fig.slider({ label: 'Window start', tex: 'U', min: 1, max: UMAX, step: 0.1, value: 8 });
    var dS = fig.slider({ label: 'Window length', min: 0.1, max: 1, step: 0.05, value: 0.5, format: function (v) { return 'δ = ' + v.toFixed(2); } });
    var sS = fig.slider({ label: 'Rate', min: 2.5, max: 400, scale: 'log', value: 10,
      marks: [{ at: 336, color: 'muted', title: 'the code: σ = 336' }], format: function (v) { return 'σ = ' + fmt.sig(v); } });
    var kS = fig.slider({ label: 'Taylor index', min: 1, max: 12000, scale: 'log', step: 1, value: 100, format: function (v) { return 'k = ' + fmt(v); } });
    var lock = fig.toggle({ label: "Lock k to the code's choice", value: true });

    var P = fig.plane({ x: [0, 17.6], y: [0, 1], pad: { t: 26, r: 14, b: 28, l: 46 } });
    var cS = fig.follow(Math.log(10)), cK = fig.follow(Math.log(101)), cU = fig.follow(8), cD = fig.follow(0.5), cY = fig.follow(1);
    [cS, cK, cU, cD, cY].forEach(function (f) { f.tau = 0.075; });
    var xs = new Float64Array(NS), ys = new Float64Array(NS), outKey = '', outL = 0;

    /* log density at u for index k (real, from the follows) and rate s */
    function logF(u, k, s, lgk) { return u > 0 ? (k + 1) * Math.log(s) + k * Math.log(u) - s * u - lgk : -Infinity; }
    /* One filled piece of the density over [a, b]. */
    function piece(a, b, k, s, lgk, col, alpha) {
      if (!(b > a)) return;
      for (var i = 0; i < NS; i++) { var u = a + (b - a) * i / (NS - 1); xs[i] = u; ys[i] = Math.exp(logF(u, k, s, lgk)); }
      xs[NS - 1] = b; ys[0] = 0; ys[NS - 1] = 0;
      P.path(xs, ys, { color: col, width: 1.8, fill: col, fillAlpha: alpha, close: true });
    }
    function sci10(L) {
      if (L > -2) return fmt.sig(Math.pow(10, L));
      var e = Math.floor(L), m = Math.pow(10, L - e);
      if (m >= 9.95) { m = 1; e++; }
      return m.toFixed(1) + '×10' + fmt.sup(e);
    }

    /* The hint's ceiling brackets are outside the page's text fonts, so the browser searches the system fonts for them
       the first time they are measured, about 20 ms at 4x CPU slowdown, and a panel hint takes no math labels. A job
       measures the hint after the first frame, and the panel shows it from then on. */
    var HINT = 'k = ⌈(1 + δ/2)σU⌉', hintJob = null;

    return function draw() {
      if (!hintJob) hintJob = fig.job(function* () { fig.measure(HINT, 10.5, 500); });
      var U = uS.value, d = dS.value, s = sS.value, locked = lock.value, narrow = fig.w < 560;
      if (locked) { var kl = lockK(s, U, d); if (kS.value !== kl) kS.set(kl); }
      kS.enable(!locked);
      var k = kS.value, ok = k + ',' + s + ',' + U + ',' + d;
      if (ok !== outKey) { outKey = ok; outL = logOut(k, s, U, d); }

      // the drawn curve follows the controls, so a change morphs
      var sf = Math.exp(cS.to(Math.log(s)).value), kf = Math.exp(cK.to(Math.log(k + 1)).value) - 1, Uf = cU.to(U).value, df = cD.to(d).value;
      var lgk = lgam(kf + 1), mean = (kf + 1) / sf, sd = Math.sqrt(kf + 1) / sf, mode = kf / sf;
      var peak = Math.exp(logF(Math.max(mode, 1e-9), kf, sf, lgk));
      P.view.x1 = 2.2 * Uf; P.view.y1 = cY.to(1.18 * peak).value; P.update();
      var XV = P.v.x1;
      var b = P.box;
      P.grid();
      P.axes({ edge: true, size: narrow ? 10.5 : 11.5, xLabel: 'u' });
      fig.label('K', 6, b.t - 6, { anchor: 'sw', color: 'muted', size: 12 });

      // the window
      P.fillBetween(P.v.y1, 0, Uf, (1 + df) * Uf, { color: 'muted', alpha: 0.14 });
      P.vline(Uf, { color: 'muted', width: 1.2, dash: [5, 4] }); P.vline((1 + df) * Uf, { color: 'muted', width: 1.2, dash: [5, 4] });
      fig.label('U', P.X(Uf), b.t - 2, { anchor: 'se', color: 'fg', size: 12.5, dx: -3 });
      fig.label('U2', P.X((1 + df) * Uf), b.t - 2, { anchor: 'sw', color: 'fg', size: 12.5, dx: 3 });

      // the kernel: blue on the window, red off it
      var lo = Math.max(1e-9, mean - 10 * sd - 1 / sf), hi = Math.min(XV, mean + 10 * sd + 2 / sf);
      if (lo < XV) {
        piece(lo, Math.min(Uf, hi), kf, sf, lgk, 'red', 0.35);
        piece(Math.max(Uf, lo), Math.min((1 + df) * Uf, hi), kf, sf, lgk, 'blue', 0.28);
        piece(Math.max((1 + df) * Uf, lo), hi, kf, sf, lgk, 'red', 0.35);
        P.segment(mean, 0, mean, Math.exp(logF(mean, kf, sf, lgk)), { color: 'fg', width: 1, dash: [3, 3], alpha: 0.7 });
      } else {
        fig.arrow(b.r - 60, b.t + 30, b.r - 6, b.t + 30, { color: 'red', width: 2, head: 8 });
        fig.text('kernel at u ≈ ' + fmt(mean, 0), b.r - 66, b.t + 34, { color: 'red', size: 12, align: 'right' });
      }

      fig.panel(narrow ? [['k', fmt(k)], ['outside', sci10(outL), 'red']] : [
        ['k', fmt(k)],
        ['mean (k+1)/σ', fmt((k + 1) / s, 3)],
        ['sd √(k+1)/σ', fmt(Math.sqrt(k + 1) / s, 3)],
        ['mass outside', sci10(outL), 'red']
      ], { plane: P, at: 'auto', prefer: ['ne', 'nw'], id: 'read', hint: locked && hintJob.done ? HINT : null });
    };
  }
});
