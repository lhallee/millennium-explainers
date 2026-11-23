/* One list of integers from two origins. Left: the points of y^2 + y = x^3 - x^2 on the p-by-p grid F_p x F_p, with
   N_p (affine points plus the point at infinity) and p + 1 - N_p. Right: for every prime p <= 199 except 11, a blue
   bar of height a_p, the coefficient of q^p in q prod_{n >= 1} (1 - q^n)^2 (1 - q^{11n})^2 (expanded once with
   integer arithmetic up to q^200), and a gold dot at p + 1 - N_p from counting points; both sit inside +-2 sqrt(p).
   init compares the two lists at every prime and the chapter's table at p <= 23, and logs a console error on a
   mismatch. */
Kit.register('hecke-traces', {
  tex: { Np: 'N_p', ptr: 'p+1-N_p', ap: 'a_p', x: 'x', y: 'y', p: 'p', bound: '\\pm 2\\sqrt{p}',
    coef: '\\text{coefficient of } q^p', count: 'p+1-N_p' },
  init: function (fig) {
    var fmt = Kit.fmt, TOP = 200, PS = [], i, p, n, k;   // PS: the primes below 200 except 11, where the curve is singular
    for (n = 2; n < TOP; n++) { var isP = true; for (k = 2; k * k <= n; k++) if (n % k === 0) { isP = false; break; } if (isP && n !== 11) PS.push(n); }

    // The q-expansion, in exact integers (the coefficients stay far below 2^53).
    var c = new Float64Array(TOP + 1); c[1] = 1;
    function times(m) { for (var j = TOP; j >= m; j--) c[j] -= c[j - m]; }   // multiply by (1 - q^m)
    for (n = 1; n <= TOP; n++) { times(n); times(n); if (11 * n <= TOP) { times(11 * n); times(11 * n); } }

    // Point counts: cnt[v] is the number of y with y^2 + y = v (mod p).
    var cnt = new Int32Array(TOP);
    var rhs = function (x, p) { return ((x * x % p) * x - x * x % p + p) % p; };
    function tally(p) { cnt.fill(0, 0, p); for (var y = 0; y < p; y++) cnt[(y * y + y) % p]++; }
    function count(p) { tally(p); var N = 1; for (var x = 0; x < p; x++) N += cnt[rhs(x, p)]; return N; }
    var AQ = {}, AC = {};
    for (i = 0; i < PS.length; i++) { p = PS[i]; AQ[p] = c[p]; AC[p] = p + 1 - count(p); }
    var CH = { 2: -2, 3: -1, 5: 1, 7: -2, 13: 4, 17: -2, 19: 0, 23: -1 };
    for (i = 0; i < PS.length; i++) {
      p = PS[i];
      if (AQ[p] !== AC[p]) console.error('hecke-traces: at p = ' + p + ' the q-expansion gives ' + AQ[p] + ' and the point count ' + AC[p]);
      if (p in CH && AQ[p] !== CH[p]) console.error('hecke-traces: a_' + p + ' = ' + AQ[p] + ', chapter says ' + CH[p]);
    }

    var choices = PS.filter(function (q) { return q <= 97; });
    var S = fig.slider({ label: 'Prime', values: choices, value: 7, format: function (v) { return 'p = ' + v; } });

    function geom(w, h) {
      var side = Math.min(h - (w < 640 ? 86 : 96), (w < 640 ? 0.42 : 0.36) * w);
      return { side: side, gap: w < 640 ? 10 : 30 };
    }
    var G = fig.plane({ x: [-0.5, 6.5], y: [-0.5, 6.5], pad: { t: 6, r: 4, b: 18, l: 22 },
      box: function (w, h) { var g = geom(w, h); return [0, 0, g.side + 26, g.side + 24]; } });
    var B = fig.plane({ x: [0, TOP], y: [-30, 30], pad: { t: 30, r: 10, b: 24, l: 34 },
      box: function (w, h) { var g = geom(w, h); return [g.side + 26 + g.gap, w < 640 ? 18 : 0, w, h]; } });
    var hx = fig.follow(S.value, { tau: 0.08 }), fade = fig.tween(1), shown = null;

    function pointsOf(p) {
      var pts = [];
      for (var x = 0; x < p; x++) { var v = rhs(x, p); for (var y = 0; y < p; y++) if ((y * y + y) % p === v) pts.push(x, y); }
      return { p: p, pts: pts };
    }
    function drawPts(set, alpha, rad) {
      for (var j = 0; j < set.pts.length; j += 2) fig.circle(G.X(set.pts[j]), G.Y(set.pts[j + 1]), rad, { fill: 'gold', alpha: alpha });
    }

    return function draw() {
      var p = S.value, ctx = fig.ctx, narrow = fig.w < 640;
      if (!shown || shown.p !== p) {
        if (shown) { fade.set(0); fade.to(1, 200, 'outQuad'); }
        shown = pointsOf(p);
      }

      // The grid F_p x F_p: faint dots, one dashed stroke per row, then the points of the curve.
      G.view.x0 = G.view.y0 = -0.5; G.view.x1 = G.view.y1 = p - 0.5; G.update();
      var sp = G.X(1) - G.X(0), ds = Kit.clamp(sp * 0.2, 1, 3);
      fig.stroke({ color: 'muted', width: ds, alpha: 0.5, dash: [ds, Math.max(0.5, sp - ds)] });
      ctx.lineCap = 'butt'; ctx.beginPath();
      for (var j = 0; j < p; j++) { ctx.moveTo(G.X(0) - ds / 2, G.Y(j)); ctx.lineTo(G.X(p - 1) + ds, G.Y(j)); }
      ctx.stroke(); ctx.setLineDash([]); ctx.lineCap = 'round';
      G.axes({ edge: true, xTicks: [0, p - 1], yTicks: [0, p - 1], size: 10.5 });
      fig.label('x', G.X((p - 1) / 2), G.box.b + 11, { anchor: 'c', color: 'muted', size: 12 });
      fig.label('y', G.box.l - 13, G.Y((p - 1) / 2), { anchor: 'c', color: 'muted', size: 12 });
      drawPts(shown, fade.value, Kit.clamp(sp * 0.32, 1.4, 7));

      // The readout under the grid: the count and the two values of a_p.
      var N = shown.pts.length / 2 + 1;
      fig.panel([[{ tex: 'Np' }, String(N), 'gold'], [{ tex: 'ptr' }, fmt(p + 1 - N), 'gold'], [{ tex: 'ap' }, fmt(AQ[p]), 'blue']],
        { plane: G, x: 0, y: G.outer.b + 4, compact: narrow, id: 'read' });

      // The bars: a_p from the q-expansion, the point counts on top, and the bound +-2 sqrt(p).
      B.grid({ yStep: 10 });
      B.fillBetween(function (t) { return 2 * Math.sqrt(t); }, function (t) { return -2 * Math.sqrt(t); }, 0, TOP,
        { color: 'muted', alpha: 0.08, edges: { color: 'muted', width: 1.2, dash: [5, 4] } });
      B.axes({ edge: true, xTicks: [2, 50, 100, 150], yStep: 10, size: 10.5, xLabel: 'p' });
      B.hline(0, { color: 'muted', width: 1 });
      var bw = Kit.clamp((B.X(2) - B.X(0)) * 0.7, 1.6, 7), h = hx.to(p).value;
      for (i = 0; i < PS.length; i++) {
        var q = PS[i], y0 = B.Y(0), y1 = B.Y(AQ[q]);
        fig.rect(B.X(q) - bw / 2, Math.min(y0, y1), bw, Math.max(1, Math.abs(y1 - y0)), { fill: 'blue', alpha: q === p ? 0.95 : 0.6 });
      }
      var hy0 = B.Y(0), hy1 = B.Y(AQ[p]), pad = 3;
      fig.rect(B.X(h) - bw / 2 - pad, Math.min(hy0, hy1) - pad, bw + 2 * pad, Math.abs(hy1 - hy0) + 2 * pad, { color: 'red' });
      for (i = 0; i < PS.length; i++) fig.circle(B.X(PS[i]), B.Y(AC[PS[i]]), PS[i] === p ? 4 : Kit.clamp(bw * 0.55, 1.8, 3), { fill: 'gold', ring: 'stage', ringWidth: 1 });
      B.label('bound', narrow ? 90 : 125, -2 * Math.sqrt(narrow ? 90 : 125), { anchor: 'n', color: 'muted', dy: 6, size: narrow ? 11 : 12.5 });
      fig.legend([{ color: 'blue', fill: true, alpha: 0.6, tex: narrow ? 'ap' : 'coef' }, { color: 'gold', dot: true, tex: 'count' }],
        { plane: B, dir: 'row', bg: false, size: narrow ? 11 : 13, x: B.box.l - 8, y: B.box.t - (narrow ? 48 : 28), id: 'lg' });
    };
  }
});
