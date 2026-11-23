/* The contour shift behind the explicit formula. The line Re s = c sweeps left from the original line Re s = 2; each
   pole it passes adds its residue of -(zeta'/zeta)(s) x^s / s to a waterfall on the right: x at s = 1, -x^rho/rho for
   every zero below the cutoff T (all on Re s = 1/2, so they arrive together), -log 2 pi at s = 0, and x^{-2k}/(2k)
   at the trivial zeros. The height axis is linear up to |t| = 60 and logarithmic beyond, so T can reach 397. */
Kit.register('contour-shift', {
  tex: { psi: '\\psi_0(x)', re: '\\Re s', im: '\\Im s' },
  init: function (fig) {
    var M = Kit.math, Z = Kit.zeros, NZ = Z.length, CMIN = -4.6, LOG2PI = Math.log(2 * Math.PI);
    var play = fig.player({ duration: 12, label: 'Line', format: function (v) { return 'Re s = ' + (2 - 6.6 * v).toFixed(2); } });
    var xs = fig.slider({ label: 'Evaluate at', min: 2, max: 60, step: 0.5, value: 10, format: function (v) { return 'x = ' + v.toFixed(1); } });
    var Ts = fig.slider({ label: 'Height cutoff', min: 20, max: 397, step: 1, value: 100, format: function (v) { return 'T = ' + v; } });
    var P = fig.plane({ x: [-5, 3], y: [-78, 78], pad: { t: 10, r: 8, b: 24, l: 42 }, box: [0, 0, 0.62, 1] });
    var dOf = function (t) { return t <= 60 ? t : 60 + 8.43 * Math.log(t / 60); };
    var handle = fig.drag({ plane: P, x: 2, y: 68, r: 7, color: 'gold',
      constrain: function (x) { return [Kit.clamp(x, CMIN, 2), 68]; },
      onDrag: function (x) { play.pause(); play.set((2 - x) / 6.6); } });
    var amt = [0, 0, 0, 0, 0].map(function () { return fig.tween(0); }), pulse = [0, 0, 0, 0, 0].map(function () { return fig.tween(1); });
    var seen = [false, false, false, false, false], kt = fig.tween(0), kTarget = -1;
    var prefix = new Float64Array(NZ + 1), prefixKey = '', zd = new Float64Array(NZ);
    for (var k = 0; k < NZ; k++) zd[k] = dOf(Z[k]);
    var POLES = [[1, 'blue'], [0.5, 'teal'], [0, 'muted'], [-2, 'muted'], [-4, 'muted']];

    return function draw() {
      var x = xs.value, T = Ts.value, c = 2 - 6.6 * play.value, L = Math.log(x), dT = dOf(T);
      handle.x = c; handle.y = 68;
      var W = fig.w, PW = W < 560 ? 0.64 : 0.62;
      P.frac = [0, 0, PW, 1]; P.update();
      var flags = [c < 1, c < 0.5, c < 0, c < -2, c < -4], n = 0;
      for (var i = 0; i < 5; i++) if (flags[i] !== seen[i]) {
        seen[i] = flags[i]; amt[i].to(flags[i] ? 1 : 0, 450);
        if (flags[i]) { pulse[i].set(0); pulse[i].to(1, 800, 'outCubic'); }
      }
      for (var z = 0; z < NZ; z++) if (Z[z] < T) n++;
      var target = flags[1] ? n : 0;
      if (target !== kTarget) { kTarget = target; kt.to(target, 250 + 4 * Math.abs(target - kt.value)); }
      if (prefixKey !== String(x)) {
        prefixKey = String(x);
        for (var j = 0; j < NZ; j++) prefix[j + 1] = prefix[j] - 2 * Math.sqrt(x) * (0.5 * Math.cos(Z[j] * L) + Z[j] * Math.sin(Z[j] * L)) / (0.25 + Z[j] * Z[j]);
      }

      // The plane: the shaded box between the original line and the moving one, the poles, the zeros.
      var b = P.box;
      P.grid({ xStep: 1, yStep: 1000 });
      for (var s = -5; s <= 3; s++) fig.text(String(s), P.X(s), b.b + 15, { color: 'muted', size: 11.5, align: 'center' });
      [20, 40, 100, 400].forEach(function (t) {
        [1, -1].forEach(function (sg) { fig.text(Kit.fmt(sg * t), b.l - 6, P.Y(sg * dOf(t)) + 4, { color: 'muted', size: 11, align: 'right' }); });
      });
      fig.text('0', b.l - 6, P.Y(0) + 4, { color: 'muted', size: 11, align: 'right' });
      P.hline(0, { color: 'muted', width: 1 });
      [60, -60].forEach(function (d) { P.hline(d, { color: 'muted', width: 1, dash: [2, 4], alpha: 0.7 }); });
      fig.rect(b.l + 3, P.Y(-60) + 2, 94, 13, { fill: 'stage', alpha: 0.85 });
      fig.text('log scale beyond 60', b.l + 6, P.Y(-60) + 12, { color: 'muted', size: 10 });
      fig.label('re', b.l - 14, b.b + 13, { anchor: 'e', color: 'muted', size: 12 });
      fig.label('im', b.l + 6, b.t + 6, { anchor: 'nw', color: 'muted', size: 12 });
      if (c < 2) P.path([[c, -dT], [2, -dT], [2, dT], [c, dT]], { close: true, fill: 'gold', fillAlpha: 0.1, color: null });
      [2, c].forEach(function (s0) {
        P.segment(s0, -78, s0, 78, { color: 'gold', width: 1.2, alpha: 0.3 });
        P.segment(s0, -dT, s0, dT, { color: 'gold', width: 2.4, dash: s0 === 2 ? [6, 4] : null });
      });
      if (c < 2) { P.segment(c, dT, 2, dT, { color: 'gold', width: 1.4, dash: [4, 4] }); P.segment(c, -dT, 2, -dT, { color: 'gold', width: 1.4, dash: [4, 4] }); }
      for (var q = 0; q < NZ; q++) {
        var zs = { color: 'teal', r: q < 12 ? 3.4 : 1.7, alpha: q + 0.5 < kt.value ? 1 : 0.28, ring: q < 12 ? 'stage' : false, ringWidth: 1 };
        P.point(0.5, zd[q], zs); P.point(0.5, -zd[q], zs);
      }
      P.point(1, 0, { color: 'blue', r: 5.5 }); P.point(0, 0, { color: 'muted', r: 4.5 });
      P.point(-2, 0, { color: 'stage', ring: 'muted', r: 4.5, ringWidth: 2 }); P.point(-4, 0, { color: 'stage', ring: 'muted', r: 4.5, ringWidth: 2 });
      for (var p = 0; p < 5; p++) if (pulse[p].value < 1) {
        var ring = fig.color(POLES[p][1], 1 - pulse[p].value), rr = 6 + 20 * pulse[p].value;
        if (p === 1) for (var u = 0; u < 6; u++) [1, -1].forEach(function (sg) { fig.circle(P.X(0.5), P.Y(sg * zd[u]), rr, { fill: false, ring: ring, ringWidth: 2 }); });
        else fig.circle(P.X(POLES[p][0]), P.Y(0), rr, { fill: false, ring: ring, ringWidth: 2 });
      }

      // The ledger: a waterfall of the residues collected so far.
      var left = W * PW + 10, right = W - 8, top = 10;
      var kf = Math.min(Math.floor(kt.value), NZ - 1), zeroSum = prefix[kf] + (kt.value - kf) * (prefix[kf + 1] - prefix[kf]);
      var parts = [x * amt[0].value, zeroSum, -LOG2PI * amt[2].value, amt[3].value * Math.pow(x, -2) / 2 + amt[4].value * Math.pow(x, -4) / 4];
      var total = parts[0] + parts[1] + parts[2] + parts[3];
      var psi0 = M.psi(x) - (x === Math.floor(x) ? M.vonMangoldt(x) / 2 : 0);
      fig.text('total = ' + Kit.fmt(total, 4), left, top + 12, { size: 12, mono: true });
      fig.text('ψ₀(x) = ' + Kit.fmt(psi0, 4), left, top + 29, { size: 12, mono: true, color: 'gold' });
      fig.text('gap = ' + Kit.fmt(psi0 - total, 4), left, top + 46, { size: 12, mono: true, color: 'muted' });
      var cy0 = top + 62, cy1 = fig.h - 26, R = Math.max(6, 0.2 * x), y0 = psi0 - R, sc = (cy1 - cy0) / (2 * R);
      var Y = function (v) { return Kit.clamp(cy1 - (v - y0) * sc, cy0, cy1); };
      var gx0 = left + 32, bw = (right - gx0) / 4, tk = M.niceStep(2 * R, cy1 - cy0, 38);
      for (var tv = Math.ceil(y0 / tk) * tk; tv <= psi0 + R; tv += tk) {
        fig.line(gx0 - 4, Y(tv), right, Y(tv), { color: 'grid', width: 1 });
        fig.text(Kit.fmt.step(tk)(tv), gx0 - 8, Y(tv) + 4, { color: 'muted', size: 11, align: 'right' });
      }
      var level = 0, colors = ['blue', 'teal', 'muted', 'muted'], names = ['1', 'ρ', '0', '−2k'];
      for (var bi = 0; bi < 4; bi++) {
        var nxt = level + parts[bi], bx = gx0 + bi * bw + bw * 0.19, ya = Y(Math.max(level, nxt)), yb = Y(Math.min(level, nxt));
        fig.rect(bx, ya, bw * 0.62, Math.max(1.5, yb - ya), { fill: colors[bi], alpha: bi === 3 ? 1 : 0.9 });
        if (bi === 0 && y0 > 0) { fig.line(bx - 2, cy1 - 7, bx + bw * 0.62 + 2, cy1 - 12, { color: 'stage', width: 3 }); }
        if (bi < 3) fig.line(bx + bw * 0.62, Y(nxt), bx + bw * 1.38, Y(nxt), { color: 'muted', width: 1, dash: [3, 3] });
        fig.text(names[bi], bx + bw * 0.31, cy1 + 15, { color: colors[bi], size: 12, align: 'center', weight: 600 });
        level = nxt;
      }
      fig.line(gx0, Y(psi0), right, Y(psi0), { color: 'gold', width: 2.2 });
      fig.line(gx0 + 4 * bw * 0.96, Y(total), right, Y(total), { color: 'fg', width: 2 });
      fig.circle(right - 2, Y(total), 3.4, { fill: 'fg' });
      fig.label('psi', right, Y(psi0) - 5, { anchor: 'se', color: 'gold', size: 12 });
    };
  }
});
