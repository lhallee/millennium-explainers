/* The scale dictionary of chapter 21 (ml-scales) on a log-log plot. Horizontal: u = log10 x from 2 to 12. Vertical:
   log10 of each quantity from 0 to 40. Bands run from a lower end to twice it: m between x^(1/2 - eps/16) and twice
   that (teal), N_0 between x^(9/2 + 10 eps) and twice that (blue), n between x^(2 + 8 eps) and twice that (muted), in
   the colors of chapter 20's chain-scale. sqrt x is dashed ink, the auxiliary prime P at its lower bound log P = (m_low / 2) x^eps is drawn as log10 P (ink), and
   a = x e^(x^eps) is red. The strip underneath shows m / sqrt x, whose band starts at x^(-eps/16), just below 1.
   On wide stages a table lists every row of the chapter's dictionary at the cursor; the rank step c + 1 and the top
   rank N_m use the chapter's approximations x^(398.5 + 58 eps) and x^(399 + 58 eps). */
Kit.register('ml-chain-scales', {
  tex: { m: 'm', sq: '\\sqrt x', N0: 'N_0', n: 'n', P: 'P', a: 'a', ratio: 'm/\\sqrt x', c1: 'c+1\\approx x^{398.5+58\\varepsilon}',
    eps: '\\varepsilon', tRest: 'm\\ \\text{(RestSize)}', tN: 'n=\\abs A,\\ 2^{\\nu}', tP: '\\log P', tC: 'c+1', tNm: 'N_m',
    tA: 'a=xe^{x^{\\varepsilon}}', tMar: '3x^{\\varepsilon}', tQd: '\\log(\\mathsf q\\mathsf d)', tK: '\\text{twists } k',
    tSha: '\\textstyle\\sum\\log\\#\\text{Sha}^1', tG: 'G_r(x)' },
  init: function (fig) {
    var fmt = Kit.fmt, LN10 = Math.LN10, LG2 = Math.log10(2), YTOP = 40, pw = Math.pow;
    /* Every size at u = log10 x and exponent e, as log10 of the quantity unless named otherwise. */
    function sizes(u, e) {
      var mLo = (0.5 - e / 16) * u, xe = pw(10, e * u), logP = pw(10, mLo) / 2 * xe;
      return { mLo: mLo, sq: u / 2, rLo: (0.5 - e) * u, rHi: (0.5 + e / 2) * u, N0: (4.5 + 10 * e) * u, n: (2 + 8 * e) * u,
        logP: logP, P: logP / LN10, c1: (398.5 + 58 * e) * u, Nm: (399 + 58 * e) * u, a: u + xe / LN10, mar: 3 * xe,
        qd: pw(xe, 0.25), k: 401 * u, sha: Math.exp(xe / 2), G: (0.5 + 9 * e) * u, ratio: pw(10, -e * u / 16) };
    }
    // Self-check against the chapter: eps = 0.01 at x = 10^6 and 10^8.
    var c6 = sizes(6, 0.01), c8 = sizes(8, 0.01);
    if (Math.abs(pw(10, c6.mLo) - 991.40) > 0.01 || Math.abs(2 * pw(10, c6.mLo) - 1982.80) > 0.01 || Math.abs(c6.logP - 569.14) > 0.01 ||
      Math.abs(pw(10, c6.a) / 3.1524e6 - 1) > 1e-4 || Math.round(pw(10, c8.mLo)) !== 9886 || Math.round(2 * pw(10, c8.mLo)) !== 19771 ||
      Math.abs(c6.N0 - 27.6) > 1e-9 || Math.abs(c6.n - 12.48) > 1e-9) console.error('ml-chain-scales: sizes disagree with the chapter');

    function big(lg, d) { return lg < 5 ? fmt(pw(10, lg), d == null ? 0 : d) : lg < 300 ? fmt.sci(pw(10, lg), 2) : fmt.pow10(Math.round(lg)); }
    var E = fig.slider({ label: 'Exponent', tex: 'eps', min: 0.001, max: 0.019, step: 0.001, value: 0.01, format: function (v) { return v.toFixed(3); } });
    var ef = fig.follow(0.01, { tau: 0.1 });
    var wide = function (w) { return w >= 760; };
    var TW = function (w) { return wide(w) ? Kit.clamp(0.4 * w, 340, 420) : 0; };
    var SH = function (h) { return Kit.clamp(0.24 * h, 58, 96); };
    var RL = function (w) { return wide(w) ? 0 : 20; };               // the readout line between plot and strip
    var M = fig.plane({ x: [2, 12], y: [0, YTOP], pad: { t: 10, r: 14, b: 22, l: 46 }, box: function (w, h) { return [0, 0, w - TW(w), h - SH(h) - RL(w)]; } });
    var S = fig.plane({ x: [2, 12], y: [0.95, 1.05], pad: { t: 6, r: 14, b: 16, l: 46 }, box: function (w, h) { return [0, h - SH(h), w - TW(w), h]; } });
    var snapU = function (x) { x = Kit.clamp(x, 2, 12); return Math.abs(x - Math.round(x)) < 0.06 ? Math.round(x) : x; };
    var cur = fig.drag({ plane: S, x: 6, y: 0.95, r: 7, color: 'fg', constrain: function (x) { return [snapU(x), 0.95]; } });
    [M, S].forEach(function (P) { fig.probe({ plane: P, crosshair: false, pick: function (x) { cur.set(x, 0.95); } }); });
    var XT = [2, 4, 6, 8, 10, 12].map(function (k) { return [k, fmt.pow10(k)]; }), YT = [[0, '1'], [10, fmt.pow10(10)], [20, fmt.pow10(20)], [30, fmt.pow10(30)], [40, fmt.pow10(40)]];
    var BX = [2, 12, 12, 2];
    function band(P, k0, k1, off, color, alpha) {                   // the region between two lines through the origin, k u and k u + off
      P.path(BX, [2 * k0, 12 * k0, 12 * k1 + off, 2 * k1 + off], { close: true, fill: color, fillAlpha: alpha, color: color, width: 1, alpha: 0.8 });
    }
    function exitAt(f) { var lo = 2, hi = 12; if (f(hi) < YTOP) return null; for (var i = 0; i < 30; i++) { var mid = (lo + hi) / 2; if (f(mid) < YTOP) lo = mid; else hi = mid; } return lo; }

    return function draw() {
      var e = ef.to(E.value).value, u = cur.x, z = sizes(u, e), narrow = fig.w < 560, ls = narrow ? 11.5 : 13;
      var mb = M.box, sb = S.box, km = 0.5 - e / 16, kN = 4.5 + 10 * e, kn = 2 + 8 * e, LAB = 11.2;
      var fP = function (t) { return pw(10, km * t + e * t) / 2 / LN10; }, fa = function (t) { return t + pw(10, e * t) / LN10; };

      M.grid({ xTicks: [2, 4, 6, 8, 10, 12], yTicks: [0, 10, 20, 30, 40] });
      M.axes({ edge: true, xTicks: narrow ? XT.filter(function (q, i) { return i % 2 === 0; }) : XT, yTicks: YT, size: narrow ? 10.5 : 11.5 });
      band(M, kN, kN, LG2, 'blue', 0.3);
      band(M, kn, kn, LG2, 'muted', 0.3);
      band(M, km, km, LG2, 'teal', 0.55);
      M.path([2, 12], [1, 6], { color: 'fg', width: 1.6, dash: [6, 4] });
      M.plot(fP, { color: 'fg', width: 1.8 });
      M.plot(fa, { color: 'red', width: 2 });

      // where a curve leaves the top, an arrow and its name; the rank step c + 1 is above the plot everywhere
      [['N0', function (t) { return kN * t; }, 'blue'], ['P', fP, 'fg']].forEach(function (q) {
        var ux = exitAt(q[1]);
        if (ux == null) { M.label(q[0], LAB, q[1](LAB) + LG2, { anchor: 's', color: q[2], dy: -3, size: ls }); return; }
        fig.arrow(M.X(ux), mb.t + 16, M.X(ux), mb.t + 2, { color: q[2], width: 1.5, head: 7 });
        fig.label(q[0], M.X(ux) + 5, mb.t + 11, { anchor: 'w', color: q[2], size: ls });
      });
      var cx = M.X(11.6);
      fig.arrow(cx, mb.t + 44, cx, mb.t + 2, { color: 'gold', width: 1.5, head: 7 });
      fig.label('c1', cx - 6, mb.t + (narrow ? 26 : 34), { anchor: 'e', color: 'gold', size: narrow ? 11 : 12.5 });
      M.label('n', LAB, kn * LAB + LG2, { anchor: 's', color: 'muted', dy: -3, size: ls });
      M.label('a', LAB, fa(LAB), { anchor: 's', color: 'red', dy: -4, size: ls });
      M.label('m', narrow ? 10.2 : LAB, km * (narrow ? 10.2 : LAB) + LG2, { anchor: 's', color: 'teal', dy: -2, size: ls });
      M.label('sq', LAB, LAB / 2, { anchor: 'n', color: 'fg', dy: 4, size: ls });

      // the cursor and the values it reads
      M.segment(u, 0, u, YTOP, { color: 'fg', width: 1, dash: [3, 4], alpha: 0.5 });
      [[z.mLo, 'teal'], [z.sq, 'fg'], [z.n, 'muted'], [z.N0, 'blue'], [z.P, 'fg'], [z.a, 'red']].forEach(function (q) {
        if (q[0] <= YTOP) fig.circle(M.X(u), M.Y(q[0]), 3.5, { fill: q[1], ring: 'stage', ringWidth: 1.5 });
      });

      // the strip: m / sqrt x starts just below 1 and drifts down as x^(-eps/16)
      var r2 = pw(10, -e * 12 / 16), steps = 24, xs = [], ys = [];
      for (var i = 0; i <= steps; i++) { var t = 2 + 10 * i / steps; xs.push(t); ys.push(pw(10, -e * t / 16)); }
      S.path(xs.concat([12, 2]), ys.concat([1.05, 1.05]), { close: true, fill: 'teal', fillAlpha: 0.5, color: null });
      S.path(xs, ys, { color: 'teal', width: 2 });
      S.hline(1, { color: 'fg', width: 1.6, dash: [6, 4] });
      S.axes({ x: false, yAt: 'left', yTicks: [[1, '1'], [0.97, '0.97']], size: narrow ? 10.5 : 11.5 });
      fig.line(sb.l, sb.b + 0.5, sb.r, sb.b + 0.5, { color: 'muted', width: 1 });
      S.segment(u, 0.95, u, 1.05, { color: 'fg', width: 1, dash: [3, 4], alpha: 0.5 });
      fig.circle(S.X(u), S.Y(z.ratio), 3.5, { fill: 'teal', ring: 'stage', ringWidth: 1.5 });
      fig.text(fmt(z.ratio, 3), S.X(u) + (u > 10 ? -9 : 9), S.Y(z.ratio) - 7, { color: 'fg', size: 11.5, mono: true, align: u > 10 ? 'right' : 'left' });
      fig.label('ratio', sb.l + 6, sb.t + 1, { anchor: 'nw', color: 'teal', size: narrow ? 11.5 : 12.5 });
      if (!narrow && r2 < 1) fig.text('the band goes on up to 2', sb.r - 4, sb.t + 12, { color: 'muted', size: 11.5, align: 'right' });

      if (!wide(fig.w)) {                                             // one line of readings under the plot
        var yl = M.outer.b + RL(fig.w) / 2 - 1, d = narrow ? 0 : 1;
        fig.mathText([{ tex: 'm', color: 'teal' }, ' ' + big(z.mLo, d) + ' to ' + big(z.mLo + LG2, d) + '   ', { tex: 'sq', color: 'fg' }, ' ' + big(z.sq) + '   ',
          { tex: 'tP' }, ' ≥ ' + fmt(z.logP, d) + '   ', { tex: 'a', color: 'red' }, ' ' + big(z.a)], 8, yl, { size: narrow ? 11 : 12.5 });
        return;
      }
      // the whole dictionary at the cursor
      var tx = fig.w - TW(fig.w) + 12, tr = fig.w - 8, rh = Math.min(22, (fig.h - 40) / 15), ty = 16;
      fig.text('at x = ' + (Math.abs(u - Math.round(u)) < 1e-9 ? fmt.pow10(Math.round(u)) : fmt.sci(pw(10, u), 2)) + ', ε = ' + e.toFixed(3), tx, ty, { size: 12.5, weight: 600 });
      ty += rh + 4;
      [['eps', e.toFixed(3) + ' < 1/52', 'fg'], ['m', big(z.mLo, 1) + ' to ' + big(z.mLo + LG2, 1), 'teal'], ['sq', big(z.sq, z.sq < 2 ? 1 : 0), 'fg'],
        ['tRest', big(z.rLo) + ' to ' + big(z.rHi), 'fg'], ['N0', big(z.N0) + ' to ' + big(z.N0 + LG2), 'blue'], ['tN', big(z.n) + ' to ' + big(z.n + LG2), 'fg'],
        ['tP', '≥ ' + fmt(z.logP, 1), 'fg'], ['tC', '≈ ' + fmt.pow10(Math.round(z.c1)), 'fg'], ['tNm', '≈ ' + fmt.pow10(Math.round(z.Nm)), 'fg'],
        ['tA', big(z.a), 'red'], ['tMar', fmt(z.mar, 2) + ' ≤ m − 1', 'fg'], ['tQd', '≤ ' + fmt(z.qd, 3), 'fg'], ['tK', '< ' + fmt.pow10(Math.round(z.k)), 'fg'],
        ['tSha', '≤ ' + fmt(z.sha, 2), 'fg'], ['tG', '≤ ' + big(z.G), 'fg']].forEach(function (q) {
        fig.label(q[0], tx, ty, { anchor: 'w', color: q[2], size: 12.5, id: 'row-' + q[0] });
        fig.text(q[1], tr, ty, { color: q[2], size: 11.5, mono: true, align: 'right', baseline: 'middle' });
        ty += rh;
      });
    };
  }
});
