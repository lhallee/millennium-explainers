/* The smoothed explicit formula against the sharp one, with the same N zero pairs. Upper panel: the remainder
   R(X) = S(X) - (X log X - (1 + gamma_E) X + log 2 pi), exact (gold), and its zero sum cut after N pairs (teal),
     R_N(X) = sum_{n <= N} 2 sqrt(X) cos(gamma_n log X) / (1/4 + gamma_n^2) - sum_k X^-2k / (2k (2k + 1)),
   since X^rho / (rho (rho - 1)) = -sqrt(X) e^{i gamma log X} / (1/4 + gamma^2) on the critical line. Lower panel:
   psi(X) - X (gold) and the partial von Mangoldt sum f_N(X) - X (teal), as in rebuild-staircase. Both partial sums
   are tabulated row by row (row k = row k - 1 plus one zero) on a grid uniform in log X, in a job, so any N is a
   lookup and the morph between N values is a blend of two rows. Checked against mpmath (see the chapter's table). */
Kit.register('smoothed-sum', {
  // labels use only the chapter's symbols: S(X), psi, c_0; the module's R and R_N stay in the code
  tex: { R: 'S(X)-\\text{main term}', band: '\\pm c_0\\sqrt{X}', psi: '\\psi(X)-X', X: 'X' },
  init: function (fig) {
    var M = Kit.math, fmt = Kit.fmt, Z = Kit.zeros, NZ = Z.length, X0 = 2, X1 = 100, G = 1600;
    var EG = 0.5772156649015329, L2P = Math.log(2 * Math.PI), C0 = 2 + EG - Math.log(4 * Math.PI);

    var play = fig.player({ label: 'Zero pairs', min: 0, max: NZ, value: 5 / NZ, reduced: 5 / NZ, autoplay: false, duration: 10,
      pace: function (u, n) { return 1 + n / 6; }, format: function (n) { return 'N = ' + Math.round(n); } });
    var showBand = fig.toggle({ label: 'Show the bound c₀√X', value: true });

    var up = fig.plane({ x: [X0, X1], y: [-0.55, 0.55], box: [0, 0, 1, '53%'], pad: { t: 26, r: 14, b: 6, l: 44 } });
    var lo = fig.plane({ x: [X0, X1], y: [-8.5, 3.5], box: [0, '53%', 1, 1], pad: { t: 26, r: 14, b: 26, l: 44 } });

    // Exact values. S(X) = X * sum_{n <= X} Lambda(n) / n - psi(X), from prefix sums over n <= 100.
    var lamOverN = new Float64Array(X1 + 1), jx = [], jy = [];
    for (var n = 2; n <= X1; n++) {
      var L = M.vonMangoldt(n);
      lamOverN[n] = lamOverN[n - 1] + L / n;
      if (L > 0) { jx.push(n); jy.push(M.psi(n)); }
    }
    var triv = function (x) { var t = 1 / x; return 1 - 0.5 * Math.log(1 - t * t) - Math.atanh(t) / t; };   // sum_k x^-2k / (2k (2k+1))
    var mainS = function (x) { return x * Math.log(x) - (1 + EG) * x + L2P; };
    var R = function (x) { return x * lamOverN[Math.floor(x)] - M.psi(x) - mainS(x); };
    var px = [], py = [];                                         // psi(X) - X as a sawtooth: down between jumps, up at each
    for (var j = 0, prev = 0, at = X0; j <= jx.length; j++) {
      var to = j < jx.length ? jx[j] : X1;
      px.push(at, to); py.push(prev - at, prev - to);
      if (j < jx.length) { prev = jy[j]; at = to; }
    }

    // The grid, the exact values on it, and the tables of partial sums (row 0 holds the terms without zeros).
    var gx = new Float64Array(G), lx = new Float64Array(G), sq = new Float64Array(G), Rg = new Float64Array(G), Pg = new Float64Array(G);
    var far = new Uint8Array(G), rowsS = null, rowsP = null, filled = 0;   // filled: rows of the tables that are ready
    fig.job(function* () {
      rowsS = new Float32Array((NZ + 1) * G); rowsP = new Float32Array((NZ + 1) * G);
      for (var i = 0; i < G; i++) {
        var x = X0 * Math.pow(X1 / X0, i / (G - 1)), d = Infinity;
        gx[i] = x; lx[i] = Math.log(x); sq[i] = Math.sqrt(x); Rg[i] = R(x); Pg[i] = M.psi(x) - x;
        for (var k = 0; k < jx.length; k++) d = Math.min(d, Math.abs(x - jx[k]));
        far[i] = d >= 0.5 ? 1 : 0;
        rowsS[i] = -triv(x);
        rowsP[i] = -L2P - 0.5 * Math.log(1 - 1 / (x * x));
        if ((i & 255) === 255) yield;
      }
      for (filled = 1; filled <= NZ; filled++) {
        var g = Z[filled - 1], den = 0.25 + g * g, o = filled * G, p = o - G;
        for (var i = 0; i < G; i++) {
          var c = Math.cos(g * lx[i]), s = Math.sin(g * lx[i]);
          rowsS[o + i] = rowsS[p + i] + 2 * sq[i] * c / den;
          rowsP[o + i] = rowsP[p + i] - 2 * sq[i] * (0.5 * c + g * s) / den;
        }
        yield filled / NZ;
      }
    });

    var a = fig.tween(5), lastN = 5, curS = new Float64Array(G), curP = new Float64Array(G);
    fig.onReset = function () { a.set(5); lastN = 5; };

    return function draw() {
      var Nt = play.mapped, Nr = Math.round(Nt);
      if (play.playing) { a.set(Nt); lastN = Nr; } else if (Nr !== lastN) { lastN = Nr; a.to(Nr, 240, 'outCubic'); }
      var pos = Math.max(0, Math.min(a.value, filled - 1)), k0 = Math.min(Math.floor(pos), NZ - 1), fr = pos - k0;
      var o0 = k0 * G, o1 = (k0 + 1) * G, errS = 0, errP = 0, n = filled ? G : 0;
      if (filled < 2) fr = 0;
      for (var i = 0; i < n; i++) {
        curS[i] = rowsS[o0 + i] + fr * (rowsS[o1 + i] - rowsS[o0 + i]);
        curP[i] = rowsP[o0 + i] + fr * (rowsP[o1 + i] - rowsP[o0 + i]);
        errS = Math.max(errS, Math.abs(curS[i] - Rg[i]));
        if (far[i]) errP = Math.max(errP, Math.abs(curP[i] - Pg[i]));
      }
      var narrow = fig.w < 520, size = narrow ? 11.5 : 13;
      // A header row over each panel: the legend on the left, the largest gap between the two curves on the right.
      function header(P, items, id, text) {
        var b = P.box;
        fig.legend(items, { plane: P, id: id, dir: 'row', size: size, bg: false, x: b.l - 6, y: b.t - 25 });
        fig.text(text, b.r, b.t - 9, { color: 'teal', size: narrow ? 10.5 : 12, mono: true, align: 'right' });
      }

      // Upper panel: the smoothed remainder, rebuilt by the zeros with weights 1 / |rho|^2.
      up.grid({ xStep: 10, yStep: 0.2 });
      up.axes({ edge: true, x: false, yStep: 0.2 });
      up.hline(0, { color: 'muted', width: 1 });
      if (showBand.value) up.fillBetween(function (x) { return C0 * Math.sqrt(x); }, function (x) { return -C0 * Math.sqrt(x); }, X0, X1,
        { color: 'red', alpha: 0.1, edges: { color: 'red', width: 1.2, dash: [5, 4], alpha: 0.8 } });
      if (n) up.path(gx, Rg, { color: 'gold', width: 3.2, alpha: 0.9 }); else up.plot(R, { color: 'gold', width: 3.2, alpha: 0.9 });
      if (n) up.path(gx, curS, { color: 'teal', width: 2 });
      header(up, [{ color: 'gold', tex: 'R', width: 3.2 }, { color: 'teal', text: narrow ? 'N pairs' : 'N zero pairs' }, showBand.value && !narrow && { color: 'red', fill: true, alpha: 0.25, tex: 'band' }],
        'upper', n ? (narrow ? 'gap ' : 'largest gap ') + fmt(errS, errS < 0.01 ? 4 : 3) : '');

      // Lower panel: the sharp cutoff, with the same N.
      lo.grid({ xStep: 10, yStep: 2 });
      lo.axes({ edge: true, xStep: 10, yStep: 2, xLabel: 'X' });
      lo.hline(0, { color: 'muted', width: 1 });
      lo.path(px, py, { color: 'gold', width: 2.2, alpha: 0.9 });
      if (n) lo.path(gx, curP, { color: 'teal', width: 1.6 });
      header(lo, [{ color: 'gold', tex: 'psi' }, { color: 'teal', text: narrow ? 'N pairs' : 'N zero pairs' }], 'lower', n ? (narrow ? 'gap ' : 'largest gap off the jumps ') + fmt(errP, 2) : '');
    };
  }
});
