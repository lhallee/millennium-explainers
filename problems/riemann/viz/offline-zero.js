/* Weil's quadratic form for the Gaussian test function f_a of the criterion's proof: Q(f_a)/C_a^2 is the sum over
   zeros of T(rho) = -Re(w^2 e^{2a w^2}), w = rho - 1/2 - ic. Left: the critical strip with the true zeros and one
   hypothetical zero rho* = 1/2 + delta + i gamma* with its mirror image. Right: one horizontal bar per zero at its
   height, on a symlog axis; a zero on the line gives tau^2 e^{-2a tau^2} >= 0 with tau = gamma - c, the off-line pair
   gives -2 e^{2a(delta^2 - tau^2)} [(delta^2 - tau^2) cos(4a delta tau) - 2 delta tau sin(4a delta tau)].
   The total sums all 200 kit zeros and their conjugates; bars are drawn for the first 12. */
Kit.register('offline-zero', {
  tex: { re: '\\Re s', im: '\\Im s', rho: '\\rho^*', mir: '1-\\bar\\rho^*', T: 'T(\\rho)', Q: 'Q(f_a)/C_a^2', c: 'c' },
  init: function (fig) {
    var Z = Kit.zeros, fmt = Kit.fmt, NB = 12, V0 = 1e-3;
    var sl = function (v) { return (v < 0 ? -1 : 1) * Math.log10(1 + Math.abs(v) / V0); };   // symlog
    var line = function (t, a) { return t * t * Math.exp(-2 * a * t * t); };                   // T for a zero on the line
    var pair = function (d, t, a) {
      var e = d * d - t * t; if (2 * a * e < -700) return 0;
      return -2 * Math.exp(2 * a * e) * (e * Math.cos(4 * a * d * t) - 2 * d * t * Math.sin(4 * a * d * t));
    };
    var cS = fig.slider({ label: 'Center', tex: 'c', min: 10, max: 55, step: 0.01, value: 30, format: function (v) { return 'c = ' + v.toFixed(2); } });
    fig.button({ label: 'Center on ρ*', onClick: function () { if (!off.value) cS.set(rho.y); } });
    var aS = fig.slider({ label: 'Concentration', min: 0.3, max: 30, scale: 'log', value: 10, marks: [1, 10],
      format: function (v) { return 'a = ' + fmt.sig(v); } });
    var off = fig.toggle({ label: 'Remove the hypothetical zero', value: false });
    var box = function (left) {
      return function (w, h) { var s = Math.round(w * (w < 560 ? 0.42 : 0.36)); return left ? [0, 0, s, h - 44] : [s, 0, w, h - 44]; };
    };
    var S = fig.plane({ x: [-0.08, 1.08], y: [0, 60], pad: { t: 12, r: 6, b: 22, l: 34 }, box: box(true) });
    var R = fig.plane({ x: [-3, 3], y: [0, 60], pad: { t: 12, r: 16, b: 22, l: 26 }, box: box(false) });
    var rho = fig.drag({ plane: S, x: 0.7, y: 30, r: 7, color: 'red', label: 'rho', labelAnchor: 'sw',
      constrain: function (x, y) { return [Kit.clamp(x, 0.5, 0.95), Kit.clamp(y, 10, 55)]; } });
    var keep = [0.7, 30], xcam = fig.follow(-3), TB = new Float64Array(NB);

    return function draw() {
      var c = cS.value, a = aS.value, gone = off.value, i;
      if (gone && rho.x > -1) { keep = [rho.x, rho.y]; rho.x = -99; rho.y = -99; }           // park the handle off the stage
      if (!gone && rho.x < -1) { rho.x = keep[0]; rho.y = keep[1]; }
      var d = rho.x - 0.5, gs = rho.y, Tp = gone ? 0 : pair(d, gs - c, a) + pair(d, -gs - c, a), tot = Tp, lo = Math.min(0, Tp);
      for (i = 0; i < Z.length; i++) {
        var v = line(Z[i] - c, a) + line(-Z[i] - c, a);
        tot += v; if (i < NB) TB[i] = v;
      }
      lo = Math.min(lo, tot);
      R.view.x0 = xcam.to(-Math.max(3, 1.1 * sl(-lo))).value; R.view.x1 = 3; R.update();
      var hw = 1 / Math.sqrt(2 * a), sb = S.box, rb = R.box;

      // The strip, the Gaussian's band, the zeros.
      S.critical({});
      for (var t = 0; t <= 60; t += 10) fig.text(String(t), sb.l - 6, S.Y(t) + 4, { color: 'muted', size: 11, align: 'right' });
      [0, 0.5, 1].forEach(function (x) { fig.text(x === 0.5 ? '½' : String(x), S.X(x), sb.b + 15, { color: 'muted', size: 11.5, align: 'center' }); });
      fig.label('im', sb.l + 4, sb.t + 2, { anchor: 'nw', color: 'muted', size: 12 });
      fig.rect(sb.l, S.Y(c + hw), rb.r - sb.l, S.Y(c - hw) - S.Y(c + hw), { fill: 'blue', alpha: 0.16 });
      fig.line(sb.l, S.Y(c), rb.r, S.Y(c), { color: 'blue', width: 1.2, dash: [5, 4], alpha: 0.8 });
      fig.label('c', rb.r - 2, S.Y(c) - 3, { anchor: 'se', color: 'blue', size: 12.5 });
      S.zeros({ count: NB, mirror: false });
      if (!gone) {
        S.segment(1 - rho.x, gs, rho.x, gs, { color: 'red', width: 1.4, dash: [4, 3] });
        fig.circle(S.X(1 - rho.x), S.Y(gs), 6, { fill: 'stage', ring: 'red', ringWidth: 2 });
        if (d > 0.08) fig.label('mir', S.X(1 - rho.x) - 8, S.Y(gs) - 6, { anchor: 'se', color: 'red', size: 12 });
        fig.text('hypothetical', S.X(rho.x) + 4, S.Y(gs) + 17, { color: 'red', size: 10.5, weight: 600 });
      }

      // The bars, one per zero at its height, on a symlog axis.
      var ticks = [-1e6, -1e4, -100, -1, -0.01, 0, 0.01, 1], edge = -1e9;
      for (i = 0; i < ticks.length; i++) {
        var tx = R.X(sl(ticks[i])), lab = Math.abs(ticks[i]) >= 1e4 ? (ticks[i] < 0 ? '−' : '') + fmt.sci(Math.abs(ticks[i])) : fmt(ticks[i]);
        if (tx < rb.l - 1 || tx > rb.r + 1) continue;
        fig.line(tx, rb.t, tx, rb.b, { color: 'grid', width: 1 });
        var hl = fig.measure(lab, 11) / 2;
        if (tx - hl > edge + 6) { fig.text(lab, tx, rb.b + 15, { color: 'muted', size: 11, align: 'center' }); edge = tx + hl; }
      }
      fig.line(R.X(0), rb.t, R.X(0), fig.h - 6, { color: 'muted', width: 1 });
      fig.label('T', rb.r - 2, rb.t + 2, { anchor: 'ne', color: 'muted', size: 12.5 });
      var bh = Kit.clamp(rb.h / 70, 3, 7);
      for (i = 0; i < NB; i++) {
        var x1 = R.X(sl(TB[i])), y = S.Y(Z[i]);
        fig.rect(Math.min(R.X(0), x1), y - bh / 2, Math.max(1, Math.abs(x1 - R.X(0))), bh, { fill: 'teal', alpha: 0.9 });
      }
      if (!gone) {
        var xp = R.X(sl(Tp)), yp = S.Y(gs);
        fig.rect(Math.min(R.X(0), xp), yp - bh * 0.7, Math.max(1, Math.abs(xp - R.X(0))), bh * 1.4, { fill: 'red', alpha: 0.9 });
        var ptxt = Math.abs(Tp) < 1e-3 ? fmt.sci(Tp, 1) : fmt.signed(Tp, Math.abs(Tp) < 10 ? 3 : 0);
        fig.text(ptxt, Kit.clamp(Math.min(xp, R.X(0)), rb.l, rb.r - fig.measure(ptxt, 11.5, 500, true)), yp - bh - 3, { color: 'red', size: 11.5, mono: true });
      }

      // The total, under the bars.
      var yt = fig.h - 20, xt = R.X(sl(tot)), neg = tot < 0, col = neg ? 'red' : 'gold';
      fig.rect(Math.min(R.X(0), xt), yt - 6, Math.max(1.5, Math.abs(xt - R.X(0))), 12, { fill: col, alpha: 0.9 });
      var at = Math.abs(tot), txt = at >= 1e-3 && at < 100 ? fmt.signed(tot, 4) : at >= 100 && at < 1e5 ? fmt.signed(tot, 0) : fmt.sci(tot, 2);
      fig.mathText([{ tex: 'Q' }, ' = ' + txt], sb.l - 28, yt, { color: col, size: 12.5, mono: true });
    };
  }
});
