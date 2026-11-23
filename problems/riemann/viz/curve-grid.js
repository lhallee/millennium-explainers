/* The points of y^2 = x^3 + a x + b on the p-by-p grid F_p x F_p, their count N_1 (affine points plus the point at
   infinity) on a number line against the Hasse interval [p + 1 - 2 sqrt p, p + 1 + 2 sqrt p], and a strip of
   a_p / (2 sqrt p) for every prime 5 <= p <= 199 where the curve is smooth. Counts are exact: for each x the number of
   y with y^2 = f(x) mod p comes from a table of squares per prime, built once for all 42 primes (about 4,000 entries).
   init checks the chapter's values for (a, b) = (1, 1) and throws on a mismatch. The a and b sliders run over 0..p-1
   for the chosen p (setRange on a change of field), keeping their values where they fit. */
Kit.register('curve-grid', {
  tex: { N1: 'N_1', ap: 'a_p', ratio: 'a_p/2\\sqrt{p}', p1: 'p+1', x: 'x', y: 'y', fx: 'x^3+ax+b', p: 'p' },
  init: function (fig) {
    var fmt = Kit.fmt, PR = [], PS = [], ROOTS = {};
    for (var n = 5; n <= 199; n++) {
      var isP = true;
      for (var d = 2; d * d <= n; d++) if (n % d === 0) { isP = false; break; }
      if (!isP) continue;
      PS.push(n); if (n <= 97) PR.push(n);
      var r = new Int16Array(n).fill(-1);                              // r[v]: the smaller y with y^2 = v, or -1
      for (var y = n - 1; y >= 0; y--) r[y * y % n] = Math.min(y, n - y);
      ROOTS[n] = r;
    }
    var f = function (x, a, b, p) { return ((x * x % p) * x + a * x + b) % p; };
    var smooth = function (a, b, p) { return (4 * a * a % p * a + 27 * b * b) % p !== 0; };
    function count(a, b, p) { var N = 1, R = ROOTS[p]; for (var x = 0; x < p; x++) { var v = f(x, a, b, p); N += R[v] < 0 ? 0 : v === 0 ? 1 : 2; } return N; }
    [[5, 9], [7, 5], [47, 60], [97, 97]].forEach(function (c) { if (count(1, 1, c[0]) !== c[1]) throw new Error('curve-grid: N_1 over F_' + c[0] + ' is ' + count(1, 1, c[0]) + ', chapter says ' + c[1]); });

    var Psel = fig.select({ label: 'Field', options: PR.map(function (p) { return [String(p), 'p = ' + p]; }), value: '5',
      onInput: function (v) { var p = +v; A.setRange(0, p - 1, 1); B.setRange(0, p - 1, 1); A.set(Math.min(ai, p - 1)); B.set(Math.min(bi, p - 1)); } });
    var ai = 1, bi = 1, idx = function (v) { return Math.round(v); };
    var A = fig.slider({ label: 'Coefficient a', min: 0, max: 4, step: 1, value: 1 });
    var B = fig.slider({ label: 'Coefficient b', min: 0, max: 4, step: 1, value: 1 });
    fig.onReset = function () { A.setRange(0, 4, 1); B.setRange(0, 4, 1); };

    function geom(w, h) {
      var wide = w >= 640, side = Math.min(h - 8, wide ? 0.5 * w : 0.54 * w), rl = side + (wide ? 36 : 14);
      return { side: side, rl: rl, nlB: 0.36 * h, stT: (wide ? 0.6 : 0.58) * h };
    }
    var G = fig.plane({ x: [-0.5, 4.5], y: [-0.5, 4.5], pad: { t: 8, r: 6, b: 22, l: 26 }, box: function (w, h) { var g = geom(w, h); return [0, 0, g.side, g.side + 8]; } });
    var NL = fig.plane({ x: [0, 12], y: [0, 1], pad: { t: 26, r: 12, b: 24, l: 12 }, box: function (w, h) { var g = geom(w, h); return [g.rl, 0, w, g.nlB]; } });
    var ST = fig.plane({ x: [0, 200], y: [-1.25, 1.25], pad: { t: 22, r: 12, b: 22, l: 32 }, box: function (w, h) { var g = geom(w, h); return [g.rl - 20, g.stT, w, h]; } });
    var mark = fig.follow(9, { tau: 0.1 }), fade = fig.tween(1), shown = null, prev = null, stripKey = '', strip = [];

    function pointsOf(p, a, b) {
      var pts = [], R = ROOTS[p];
      for (var x = 0; x < p; x++) { var v = f(x, a, b, p); if (R[v] >= 0) { pts.push([x, R[v]]); if (v) pts.push([x, p - R[v]]); } }
      return { key: p + ',' + a + ',' + b, p: p, pts: pts };
    }
    function drawPts(set, alpha, rad) {
      var pts = set.pts, i;
      for (i = 0; i < pts.length; i++) if (pts[i][1] > 0 && pts[i][1] * 2 < set.p) G.segment(pts[i][0], pts[i][1], pts[i][0], set.p - pts[i][1], { color: 'gold', width: 1.2, alpha: 0.3 * alpha });
      for (i = 0; i < pts.length; i++) {
        var X = G.X(pts[i][0]), Y = G.Y(pts[i][1]);
        if (pts[i][1] === 0) fig.circle(X, Y, rad, { fill: 'stage', ring: 'gold', ringWidth: 1.8, alpha: alpha });
        else fig.circle(X, Y, rad, { fill: 'gold', alpha: alpha });
      }
    }
    fig.probe({ plane: G, snap: function (x) { var p = +Psel.value, c = Kit.clamp(Math.round(x), 0, p - 1); return [c, -0.5]; },
      rows: function (x) {
        var p = +Psel.value, v = f(x, ai, bi, p), r = ROOTS[p][v];
        return [[{ tex: 'x' }, String(x)], [{ tex: 'fx' }, String(v)], [{ tex: 'y' }, r < 0 ? 'none' : v === 0 ? '0' : r + ', ' + (p - r), r < 0 ? 'muted' : 'gold']];
      } });

    return function draw() {
      var p = +Psel.value, a = ai = idx(A.value), b = bi = idx(B.value), sq = 2 * Math.sqrt(p), ok = smooth(a, b, p);
      var key = p + ',' + a + ',' + b;
      if (!shown || shown.key !== key) {
        prev = shown && shown.p === p ? shown : null;
        shown = pointsOf(p, a, b);
        if (prev) { fade.set(0); fade.to(1, 200, 'outQuad'); } else fade.set(1);
      }
      var N = shown.pts.length + 1;

      // The grid: faint dots at every (x, y), each row one dashed stroke, then the points of the curve.
      G.view.x0 = G.view.y0 = -0.5; G.view.x1 = G.view.y1 = p - 0.5; G.update();
      var sp = G.X(1) - G.X(0), ds = Kit.clamp(sp * 0.2, 1.2, 3), ctx = fig.ctx;
      fig.stroke({ color: 'muted', width: ds, alpha: 0.55, dash: [ds, sp - ds] });
      ctx.lineCap = 'butt'; ctx.beginPath();
      for (var j = 0; j < p; j++) { ctx.moveTo(G.X(0) - ds / 2, G.Y(j)); ctx.lineTo(G.X(p - 1) + ds, G.Y(j)); }
      ctx.stroke(); ctx.setLineDash([]);
      G.axes({ edge: true, xTicks: [0, p - 1], yTicks: [0, p - 1], size: 10.5 });
      fig.label('x', G.X((p - 1) / 2), G.box.b + 12, { anchor: 'c', color: 'muted', size: 12 });
      fig.label('y', G.box.l - 12, G.Y((p - 1) / 2), { anchor: 'c', color: 'muted', size: 12 });
      var rad = Kit.clamp(sp * 0.3, 1.8, 6);
      if (prev && fade.active) drawPts(prev, 1 - fade.value, rad);
      drawPts(shown, prev && fade.active ? fade.value : 1, rad);

      // The number line: the Hasse interval in blue, p + 1, and the count.
      var lo = p + 1 - sq, hi = p + 1 + sq, nb = NL.box, yA = nb.t + nb.h * 0.55;
      NL.view.x0 = lo - 3; NL.view.x1 = hi + 3; NL.update();
      fig.rect(NL.X(lo), yA - 9, NL.X(hi) - NL.X(lo), 18, { fill: 'blue', alpha: 0.16 });
      fig.line(NL.X(lo), yA - 9, NL.X(lo), yA + 9, { color: 'blue', width: 1.4 }); fig.line(NL.X(hi), yA - 9, NL.X(hi), yA + 9, { color: 'blue', width: 1.4 });
      fig.line(nb.l, yA, nb.r, yA, { color: 'muted', width: 1 });
      var step = NL.X(1) - NL.X(0) >= 5 ? 1 : 5;
      for (var t = Math.ceil(lo - 3); t <= hi + 3; t++) if (t % step === 0) fig.line(NL.X(t), yA - 3, NL.X(t), yA + 3, { color: 'muted', width: 1 });
      fig.line(NL.X(p + 1), yA - 13, NL.X(p + 1), yA + 13, { color: 'blue', width: 2.4 });
      fig.text(fmt(lo, 1), NL.X(lo), yA + 23, { size: 10.5, color: 'blue', align: 'center' });
      fig.text(fmt(hi, 1), NL.X(hi), yA + 23, { size: 10.5, color: 'blue', align: 'center' });
      fig.label('p1', NL.X(p + 1), yA + 16, { anchor: 'n', color: 'blue', size: 12 });
      var mx = NL.X(mark.to(N).value), col = ok ? 'gold' : 'red';
      fig.circle(mx, yA, 6.5, { fill: col, ring: 'stage', ringWidth: 2 });
      fig.mathText([{ tex: 'N1', color: col }, ' = ' + N], mx, yA - 22, { size: 13, color: col, align: 'center', mono: true });

      var ap = p + 1 - N, rows = [[{ tex: 'N1' }, String(N), col], [{ tex: 'ap' }, fmt(ap)], [{ tex: 'ratio' }, fmt(ap / sq, 2), ok ? 'fg' : 'red']];
      var pan = fig.panel(rows, { x: geom(fig.w, fig.h).rl, y: nb.b + 6, compact: fig.w < 640 });
      if (!ok) (fig.w < 640 ? ['singular: the curve has', 'a node or cusp'] : ['singular: the curve has a node or cusp']).forEach(function (s, i) { fig.text(s, geom(fig.w, fig.h).rl, pan.y + pan.h + 14 + 15 * i, { size: 12, color: 'red', weight: 600 }); });

      // The strip: a_p / 2 sqrt p for every prime up to 199 at which the curve is smooth.
      var skey = a + ',' + b;
      if (skey !== stripKey) {
        stripKey = skey; strip = [];
        for (var i = 0; i < PS.length; i++) { var q = PS[i], aq = a % q, bq = b % q; if (smooth(aq, bq, q)) strip.push([q, (q + 1 - count(aq, bq, q)) / (2 * Math.sqrt(q))]); }
      }
      ST.grid({ yStep: 1 });
      ST.axes({ edge: true, xTicks: [5, 50, 100, 150, 199], yTicks: [-1, 0, 1], size: 10.5 });
      ST.hline(1, { color: 'blue', width: 1.4 }); ST.hline(-1, { color: 'blue', width: 1.4 });
      for (i = 0; i < strip.length; i++) ST.point(strip[i][0], strip[i][1], { color: 'teal', r: 2.6, ring: 'stage', ringWidth: 1 });
      if (ok) fig.circle(ST.X(p), ST.Y(ap / sq), 5.5, { fill: 'stage', alpha: 0, ring: col, ringWidth: 2 });
      fig.label('ratio', ST.box.l + 4, ST.box.t - 10, { anchor: 'w', color: 'teal', size: 12 });
      fig.label('p', ST.box.l - 14, ST.box.b + 14, { anchor: 'c', color: 'muted', size: 12 });
    };
  }
});
