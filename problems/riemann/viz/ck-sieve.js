/* The divisorial stratification as a sieve on the theta sum Theta_g(t) = 2 sum_{n >= 1} g(nt), with
   g(x) = x^2 (exp(-pi x^2) - 8 exp(-4 pi x^2)). Removing the primes p_1 < p_2 < ... beyond Y deletes the n with a
   factor p_i; the sieved sums settle on the sum over the Y-smooth n. Each n is grouped by the index of its least
   prime factor beyond Y (0 if Y-smooth), so Theta^(j) = 2 (B_0 + sum_{i > j} B_i). For t >= 0.03 the terms with
   n t > 7 are below 1e-60, so n runs to 233 and only the primes up to 233 matter. At t = 0.1, Y = 3 this gives the
   chapter's 0.000000, -0.145345, -0.347276, and limit -0.418800 (checked against mpmath). */
Kit.register('ck-sieve', {
  tex: {
    th: '\\Theta_g^{(j)}(t)', th0: '\\Theta_g(t)', lim: '\\lim_{j\\to\\infty}\\Theta_g^{(j)}(t)', t: 't', tR: 't=1/R',
    head: '2\\zeta(s)\\,Mg(s)', f3: '(1-3^{-s})', f5: '(1-5^{-s})', f7: '(1-7^{-s})', f11: '(1-11^{-s})', f13: '(1-13^{-s})',
    f17: '(1-17^{-s})', f19: '(1-19^{-s})', f23: '(1-23^{-s})', f29: '(1-29^{-s})', f31: '(1-31^{-s})'
  },
  init: function (fig) {
    var fmt = Kit.fmt, NT = 300, T0 = 0.03, T1 = 1.5, NMAX = 233, J0 = 2;
    var g = function (x) { var x2 = x * x; return x2 * (Math.exp(-Math.PI * x2) - 8 * Math.exp(-4 * Math.PI * x2)); };
    var ts = new Float64Array(NT), nOf = new Int32Array(NT), gv = null;
    for (var k = 0; k < NT; k++) { ts[k] = T0 * Math.pow(T1 / T0, k / (NT - 1)); nOf[k] = Math.floor(7 / ts[k]); }
    var PR = [], i, n;
    for (n = 2; n <= NMAX; n++) { for (i = 0; i < PR.length && n % PR[i]; i++); if (i === PR.length) PR.push(n); }
    // g(n t_k) for every t_k and n <= 7 / t_k, about 20,000 values, built in slices
    var table = fig.job(function* () {
      var off = 0, out = new Float64Array(nOf.reduce(function (s, v) { return s + v; }, 0));
      for (var kk = 0; kk < NT; kk++) { for (var m = 1; m <= nOf[kk]; m++) out[off++] = g(m * ts[kk]); if (kk % 20 === 19) yield kk / NT; }
      return out;
    }, { onDone: function (r) { gv = r; regroup(); } });

    var Yset = fig.select({ label: 'Y', options: [['2', '2'], ['3', '3'], ['5', '5'], ['7', '7']], value: '3', onInput: function () { regroup(); morph(); } });
    var j = J0, Q = [], first = new Int32Array(NMAX + 1), curves = null, shown = new Float64Array(NT), from = new Float64Array(NT);
    var mix = fig.tween(1), flash = fig.tween(0);
    var next = fig.button({ label: 'Remove next prime', onClick: function () { if (j < Q.length) { j++; morph(); flash.set(1); flash.to(0, 900, 'outQuad'); } } });
    fig.onReset = function () { j = J0; regroup(); mix.set(1); flash.set(0); };

    // Q: the primes beyond Y; first[n]: 1-based index in Q of the least prime factor of n beyond Y, 0 if Y-smooth
    function regroup() {
      var Y = Number(Yset.value);
      Q = PR.filter(function (p) { return p > Y; });
      for (n = 1; n <= NMAX; n++) { first[n] = 0; for (i = 0; i < Q.length; i++) if (n % Q[i] === 0) { first[n] = i + 1; break; } }
      j = Math.min(j, Q.length);
      if (!gv) return;
      var J = Q.length, B = new Float64Array((J + 1) * NT);
      curves = new Float64Array((J + 1) * NT);
      for (var kk = 0, off = 0; kk < NT; kk++) for (var m = 1; m <= nOf[kk]; m++) B[first[m] * NT + kk] += gv[off++];
      for (kk = 0; kk < NT; kk++) {
        curves[J * NT + kk] = 2 * B[kk];
        for (var q = J - 1; q >= 0; q--) curves[q * NT + kk] = curves[(q + 1) * NT + kk] + 2 * B[(q + 1) * NT + kk];
      }
    }
    regroup();
    function morph() { from.set(shown); mix.set(0); mix.to(1, 300, 'inOutCubic'); }
    function exact(t, upto) {          // 2 sum over n <= 7/t with first[n] = 0 or > upto (upto < 0: no removal)
      var s = 0;
      for (var m = 1; m <= Math.min(NMAX, 7 / t); m++) if (upto < 0 || first[m] === 0 || first[m] > upto) s += g(m * t);
      return 2 * s;
    }

    var TOP = function (w) { return w < 560 ? 78 : 52; };     // height of the row (or two rows) of dots
    var P = fig.plane({ x: [T0, T1], y: [-1, 0.3], xLog: true, pad: { t: 8, r: 14, b: 26, l: 46 },
      box: function (w, h) { return [0, TOP(w) + 24, w, h]; } });
    fig.probe({ plane: P, snap: function (x) { return [x, exact(x, j)]; },
      rows: function (x) { return [[{ tex: 't' }, fmt(x, 3)], [{ tex: 'th0' }, f6(exact(x, -1)), 'muted'], [{ tex: 'th' }, f6(exact(x, j)), 'gold'], [{ tex: 'lim' }, f6(exact(x, Q.length)), 'blue']]; } });
    function f6(v) { return fmt(Math.abs(v) < 5e-7 ? 0 : v, 6); }

    function dots() {
      var w = fig.w, two = w < 560, per = two ? 30 : 60, sp = (w - 40) / per, r = Math.min(5, sp * 0.3), x0 = 20 + sp / 2;
      for (n = 1; n <= 60; n++) {
        var row = two ? Math.floor((n - 1) / 30) : 0, x = x0 + ((n - 1) % per) * sp, y = 20 + row * 40;
        var f = first[n], gone = f > 0 && f <= j, fresh = gone && f === j;
        if (n % 5 === 0 || n === 1) fig.text(String(n), x, y - 9, { color: 'muted', size: 10, align: 'center' });
        if (!gone) { fig.circle(x, y, r, { fill: f === 0 ? 'gold' : 'muted', alpha: f === 0 ? 1 : 0.55 }); continue; }
        var rr = r * (1 + (fresh ? 0.7 * flash.value : 0)), al = fresh ? 1 : 0.5;
        fig.circle(x, y, rr, { fill: 'red', alpha: al * 0.35 });
        fig.line(x - rr, y - rr, x + rr, y + rr, { color: 'red', width: 1.6, alpha: al });
        fig.line(x - rr, y + rr, x + rr, y - rr, { color: 'red', width: 1.6, alpha: al });
        if (fresh) fig.text(String(Q[j - 1]), x, y + r + 11, { color: 'red', size: 10, align: 'center' });
      }
      return TOP(w);
    }

    return function draw() {
      next.enable(j < Q.length);
      var yLine = dots() + 12, J = Q.length;
      // the Mellin factor: 2 zeta(s) Mg(s) times one reciprocal Euler factor per removed prime, as many as fit
      var parts = ['Mellin transform  ', { tex: 'head' }], width = fig.measure(parts[0], 12, 500) + fig.labelSize('head', 13).w, room = fig.w - 24;
      var list = Q.slice(0, j).join(', '), tail = j ? '   removed: ' + list : '   nothing removed';
      if (fig.w >= 560 && fig.measure(tail, 12, 500) < room * 0.4) room -= fig.measure(tail, 12, 500); else tail = '';
      for (i = 0; i < j; i++) {
        var key = 'f' + Q[i], fw = fig.tex[key] ? fig.labelSize(key, 13).w : Infinity;
        if (width + fw + 24 > room) { parts.push(' ⋯ (' + (j - i) + ' more)'); break; }
        parts.push({ tex: key }); width += fw;
      }
      parts.push(tail);
      fig.mathText(parts, 12, yLine, { size: 12, color: 'muted' });

      P.fillBetween(0.3, -1, T0, 0.1, { color: 'muted', alpha: 0.13 });
      P.grid();
      P.axes({ edge: true, xLabel: 't', yStep: 0.2, xTicks: [[0.03, '0.03'], [0.05, '0.05'], [0.1, '0.1'], [0.2, '0.2'], [0.5, '0.5'], [1, '1'], [1.5, '1.5']] });
      P.vline(0.1, { color: 'muted', width: 1, dash: [4, 4] });
      var pb = P.box, nar = fig.w < 560;
      fig.text('outside the shell', (pb.l + P.X(0.1)) / 2, pb.t + 14, { color: 'muted', size: nar ? 10 : 11, align: 'center' });
      P.label('tR', 0.1, 0.3, { anchor: 'nw', color: 'muted', dx: 4, dy: 2, size: 12 });
      if (!curves) { fig.text('summing: ' + Math.round(100 * table.progress) + '%', pb.r - 8, pb.t + 16, { color: 'muted', align: 'right', size: 12 }); return; }
      for (var kk = 0; kk < NT; kk++) shown[kk] = Kit.lerp(from[kk], curves[j * NT + kk], mix.value);
      P.path(ts, curves.subarray(0, NT), { color: 'muted', width: 1.4, alpha: 0.55 });
      P.path(ts, curves.subarray(J * NT, (J + 1) * NT), { color: 'blue', width: 1.6, dash: [6, 4] });
      P.path(ts, shown, { color: 'gold', width: 2.6 });
      fig.legend([{ color: 'gold', tex: 'th', width: 2.6 }, { color: 'blue', tex: 'lim', dash: [6, 4], width: 1.6 }, { color: 'muted', tex: 'th0', width: 1.4 }],
        { plane: P, at: 'se', margin: nar ? 14 : 22, size: nar ? 10.5 : 13 });
    };
  }
});
