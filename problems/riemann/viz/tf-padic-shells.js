/* The p-adic local term, shell by shell (lemma tf-local-prime). Q_p^x is cut into the shells p^m Z_p^x, drawn as rings
   with |y|_p = p^(-m) growing outward; m = 0 is the unit shell, in blue as in chapter 11. On a shell with m != 0 the factor
   |y|_p^(1/2) / |1 - y|_p is the constant p^(-|m|/2) (blue bars), and the integrand is phi(p^(-m)) p^(-|m|/2) (gold
   bars). The strip shows phi(t) = u(1+u) bump(u/L), u = log t, with a tick at each t = p^k. The readout sums the gold
   bars times log p and, separately, the chapter's formula log p sum_{m>=1} p^(-m/2) (phi(p^m) + phi(p^(-m))). */
Kit.register('tf-padic-shells', {
  tex: {
    fac: 'p^{-\\lvert m\\rvert/2}', con: '\\varphi(p^{-m})\\,p^{-\\lvert m\\rvert/2}', m: 'm', u: '\\log t', phi: '\\varphi(t)',
    phi1: '\\varphi(1)=0', shells: '\\log p\\sum_{m\\ne0}\\varphi(p^{-m})\\,p^{-\\lvert m\\rvert/2}',
    direct: '\\log p\\sum_{m\\ge1}p^{-m/2}\\bigl(\\varphi(p^m)+\\varphi(p^{-m})\\bigr)', L: 'L'
  },
  init: function (fig) {
    var fmt = Kit.fmt, MS = 4, U = 2.5, L8 = Math.log(8), hover = null;
    function phiU(u, L) { var x = u / L; return Math.abs(x) < 1 ? u * (1 + u) * Math.exp(-1 / (1 - x * x)) : 0; }

    var pSel = fig.select({ label: 'Prime', options: [['2', 'p = 2'], ['3', 'p = 3'], ['5', 'p = 5'], ['7', 'p = 7'], ['11', 'p = 11']], value: '2' });
    var Ls = fig.slider({ label: 'Support half-width', tex: 'L', min: 0.3, max: U, step: 0.01, value: L8, snap: [L8],
      marks: [{ at: L8, title: 'L = log 8' }], format: function (v) { return Math.abs(v - L8) < 1e-12 ? 'log 8' : v.toFixed(2); } });

    function stripH(h) { return Kit.clamp(0.24 * h, 58, 96); }
    function ringSide(w, h) { return Math.min(h - stripH(h) - 8, (w < 560 ? 0.4 : 0.34) * w); }
    var R = fig.plane({ x: [-1.04, 1.04], y: [-1.04, 1.04], equal: true, pad: 4,
      box: function (w, h) { var s = ringSide(w, h); return [0, 0, s, Math.min(s, h - stripH(h))]; } });
    var B = fig.plane({ x: [-MS - 0.6, MS + 0.6], y: [-0.2, 1.35], pad: { t: 8, r: 14, b: 24, l: 40 },
      box: function (w, h) { return [ringSide(w, h) + 6, 0, w, h - stripH(h)]; } });
    var S = fig.plane({ x: [-U, U], y: [-0.3, 1], pad: { t: 6, r: 14, b: 20, l: 40 },
      box: function (w, h) { return [0, h - stripH(h), w, h]; } });
    function shellOfRing(x, y) { var k = Math.floor(Math.hypot(x, y) * (2 * MS + 1)); return k >= 0 && k <= 2 * MS ? MS - k : null; }
    var rp = fig.probe({ plane: R, crosshair: false, marker: false,
      rows: function (x, y) { var m = shellOfRing(x, y); return m == null ? null : rowsFor(m); } });
    var bp = fig.probe({ plane: B, crosshair: false, marker: false,
      rows: function (x) { var m = Math.round(x); return Math.abs(m) <= MS ? rowsFor(m) : null; } });
    var cur = { p: 2, L: L8 };
    function rowsFor(m) {
      var p = cur.p, t = Math.pow(p, -m), ph = phiU(-m * Math.log(p), cur.L), f = Math.pow(p, -Math.abs(m) / 2);
      if (m === 0) return [['shell', 'm = 0, unit shell'], [{ tex: 'phi1' }, '']];
      return [['shell', 'm = ' + fmt(m)], [{ tex: 'absy' }, p + fmt.sup(-m)], ['factor', fmt(f, 4), 'blue'], [{ tex: 'phim' }, fmt(ph, 7)], ['product', fmt(ph * f, 7), 'gold']];
    }

    return function draw() {
      var ctx = fig.ctx, p = Number(pSel.value), L = Ls.value, lp = Math.log(p), m, k;
      cur.p = p; cur.L = L;
      hover = rp.active ? shellOfRing(rp.x, rp.y) : bp.active && Math.abs(Math.round(bp.x)) <= MS ? Math.round(bp.x) : null;
      var con = [], fac = [], sumShell = 0, maxC = 1e-9, minC = 0;
      for (m = -MS; m <= MS; m++) {
        var f = Math.pow(p, -Math.abs(m) / 2), c = m === 0 ? 0 : phiU(-m * lp, L) * f;
        fac.push(f); con.push(c); sumShell += c; maxC = Math.max(maxC, Math.abs(c)); minC = Math.min(minC, c);
      }
      var direct = 0;
      for (k = 1; k * lp < L; k++) direct += Math.pow(p, -k / 2) * (phiU(k * lp, L) + phiU(-k * lp, L));

      // rings: shell m has |y|_p = p^(-m); larger |y|_p is farther out
      var rb = R.box, cx = R.X(0), cy = R.Y(0), rw = (R.X(1) - cx) / (2 * MS + 1), every = rw >= 11 ? 1 : 4;
      for (k = 0; k <= 2 * MS; k++) {
        m = MS - k;
        var col = m === 0 ? 'blue' : con[m + MS] !== 0 ? 'gold' : 'muted';
        var a = m === 0 ? 0.55 : con[m + MS] !== 0 ? 0.25 + 0.6 * Math.abs(con[m + MS]) / maxC : 0.13;
        ctx.beginPath(); ctx.arc(cx, cy, (k + 0.5) * rw, 0, 2 * Math.PI);
        fig.stroke({ color: col, width: Math.max(1, rw - 1.5), alpha: a }); ctx.stroke();
        if (hover === m) { ctx.beginPath(); ctx.arc(cx, cy, (k + 1) * rw - 0.5, 0, 2 * Math.PI); fig.stroke({ color: 'fg', width: 1.5 }); ctx.stroke(); ctx.beginPath(); ctx.arc(cx, cy, Math.max(0.5, k * rw + 0.5), 0, 2 * Math.PI); ctx.stroke(); }
      }
      fig.circle(cx, cy, 2, { fill: 'fg' });
      for (k = 0; k <= 2 * MS; k++) {
        m = MS - k;
        if (k % every !== 0 && m !== 0) continue;
        var lab = m === 0 ? '1' : p + fmt.sup(-m), ly = cy - (k + 0.5) * rw, lw = fig.measure(lab, 10.5, 600) + 4;
        fig.rect(cx - lw / 2, ly - 6.5, lw, 13, { fill: 'stage', alpha: 0.75 });
        fig.text(lab, cx, ly, { color: m === 0 ? 'blue' : 'fg', size: 10.5, weight: 600, align: 'center', baseline: 'middle' });
      }

      // bars: the factor and the integrand on each shell
      B.view.y0 = Math.min(-0.12, 1.25 * minC); B.update();
      var bb = B.box;
      var narrow = fig.w < 560;
      B.grid({ yStep: 0.2, xTicks: [] });
      B.axes({ edge: true, yStep: 0.2, xTicks: [-4, -3, -2, -1, 0, 1, 2, 3, 4].map(function (v) { return [v, fmt(v)]; }), xLabel: narrow ? null : 'm' });
      B.hline(0, { color: 'muted', width: 1 });
      var bw = Math.min(0.36, 14 / B.sx);
      for (m = -MS; m <= MS; m++) {
        var hi = hover === m ? 1 : 0.85;
        if (m === 0) {
          fig.rect(B.X(-0.3), B.Y(0.3), B.X(0.3) - B.X(-0.3), B.Y(0) - B.Y(0.3), { color: 'muted', width: 1.5 });
          continue;
        }
        fig.rect(B.X(m - bw - 0.02), B.Y(fac[m + MS]), B.X(m - 0.02) - B.X(m - bw - 0.02), B.Y(0) - B.Y(fac[m + MS]), { fill: 'blue', alpha: 0.55 * hi });
        var c0 = con[m + MS], yT = B.Y(Math.max(0, c0)), yB = B.Y(Math.min(0, c0));
        fig.rect(B.X(m + 0.02), yT, B.X(m + bw + 0.02) - B.X(m + 0.02), Math.max(1, yB - yT), { fill: 'gold', alpha: hi });
        if (hover === m) fig.rect(B.X(m - bw - 0.12), bb.t + 2, B.X(m + bw + 0.12) - B.X(m - bw - 0.12), bb.h - 2, { color: 'fg', width: 1, alpha: 0.5 });
      }
      B.label('phi1', 0, narrow ? 0.76 : 0.3, { anchor: 's', color: 'muted', dy: -3, size: narrow ? 11 : 13 });
      fig.legend([{ color: 'blue', fill: true, alpha: 0.55, tex: 'fac' }, { color: 'gold', fill: true, alpha: 1, tex: 'con' }],
        narrow ? { plane: R, x: 0, y: R.outer.b + 2, size: 10.5, bg: false } : { plane: B, at: 'nw' });
      fig.panel([[narrow ? 'shells' : { tex: 'shells' }, fmt(lp * sumShell, 7), 'gold'], [narrow ? 'direct' : { tex: 'direct' }, fmt(lp * direct, 7), 'fg']],
        { plane: B, at: 'ne', id: 'sum' });

      // strip: phi on the log scale, the support, and the powers of p
      var sb = S.box, ymax = 0.05, ymin = -0.05;
      for (k = 0; k <= 120; k++) { var v = phiU(-L + 2 * L * k / 120, L); ymax = Math.max(ymax, v); ymin = Math.min(ymin, v); }
      S.view.y0 = ymin * 1.25; S.view.y1 = ymax * 1.25; S.update();
      S.fillBetween(function () { return S.v.y1; }, function () { return S.v.y0; }, -L, L, { color: 'gold', alpha: 0.06 });
      S.vline(-L, { color: 'muted', width: 1, dash: [3, 4] }); S.vline(L, { color: 'muted', width: 1, dash: [3, 4] });
      S.hline(0, { color: 'muted', width: 1 });
      S.plot(function (u) { return phiU(u, L); }, { color: 'gold', width: 2.2 });
      var reach = -1e9;
      for (k = -Math.floor(U / lp); k * lp <= U; k++) {
        var x = S.X(k * lp), inside = k !== 0 && Math.abs(k * lp) < L, hv = hover === -k;
        fig.line(x, sb.b, x, sb.b - 8, { color: k === 0 ? 'blue' : hv ? 'fg' : inside ? 'gold' : 'muted', width: hv ? 2.5 : 1.6 });
        if (inside || hv) S.point(k * lp, phiU(k * lp, L), { color: hv ? 'fg' : 'gold', r: 3 });
        var tl = k === 0 ? '1' : p + (k === 1 ? '' : fmt.sup(k)), half = fig.measure(tl, 10.5) / 2;
        if (x - half > reach + 3) { fig.text(tl, x, sb.b + 12, { color: inside ? 'gold' : k === 0 ? 'blue' : 'muted', size: 10.5, align: 'center', weight: hv ? 700 : 500 }); reach = x + half; }
      }
      fig.label('phi', sb.l - 8, (sb.t + sb.b) / 2, { anchor: 'e', color: 'gold', size: 12 });
    };
  }
});
