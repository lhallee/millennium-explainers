/* Kneser neighbors at p as a graph on the nine classes of G_1 (chapter 20, df-hecke), and repeated averaging
   T = (A_p + A_pbar) / 6 of a form f. A is the chapter's neighbor matrix; A_pbar(i, j) = w_j A(j, i) / w_i by
   t-df-adjoint, an integer matrix. T keeps the weighted mean and is self-adjoint for the weighted inner product, so
   the weighted distance to the mean shrinks toward a factor (1 + sqrt 5) / 6 = 0.539 per step: the eigenvalues of
   A + A_pbar are 6, -1 +- sqrt 5, -3 (twice), (1 +- sqrt 5) / 2 (twice each). The player shows T^k f for k = 0..12. */
Kit.register('neighbor-averaging', {
  tex: { rate: '\\tfrac{1+\\sqrt5}{6}', f: 'f' },
  init: function (fig) {
    var fmt = Kit.fmt, K = 12, i, j, k;
    var A = [[0, 2, 0, 0, 1, 0, 0, 0, 0], [0, 0, 1, 1, 0, 0, 1, 0, 0], [1, 0, 0, 0, 0, 1, 0, 0, 1], [1, 0, 0, 0, 0, 2, 0, 0, 0],
      [0, 0, 2, 1, 0, 0, 0, 0, 0], [0, 1, 0, 0, 1, 0, 0, 1, 0], [0, 0, 0, 0, 0, 3, 0, 0, 0], [0, 0, 3, 0, 0, 0, 0, 0, 0], [0, 3, 0, 0, 0, 0, 0, 0, 0]];
    var AUT = [8, 4, 4, 8, 8, 4, 12, 12, 12], w = AUT.map(function (a) { return 1 / a; }), mass = 11 / 8;
    var B = A.map(function (r, i) { return r.map(function (_, j) { return A[j][i] * AUT[i] / AUT[j]; }); });   // w_j A(j,i) / w_i

    // self-check: B integral with rows summing to 3, A_pbar(L2, L1) = 1, and the minimal polynomial of S = A + B is
    // (x - 6)(x + 3)(x^2 + 2x - 4)(x^2 - x - 1) with tr S = 0 and tr S^2 = 72, which fixes the chapter's spectrum
    var mul = function (X, Y) { return X.map(function (r) { return Y[0].map(function (_, c) { var s = 0; for (var q = 0; q < 9; q++) s += r[q] * Y[q][c]; return s; }); }); };
    var lin = function (X, a, b) { return X.map(function (r, p) { return r.map(function (v, q) { return v * a + (p === q ? b : 0); }); }); };
    var S = A.map(function (r, p) { return r.map(function (v, q) { return v + B[p][q]; }); }), S2 = mul(S, S);
    var Z = mul(mul(lin(S, 1, -6), lin(S, 1, 3)), mul(S2.map(function (r, p) { return r.map(function (v, q) { return v + 2 * S[p][q] - (p === q ? 4 : 0); }); }),
      S2.map(function (r, p) { return r.map(function (v, q) { return v - S[p][q] - (p === q ? 1 : 0); }); })));
    var tr1 = 0, tr2 = 0, ok = B[1][0] === 1;
    for (i = 0; i < 9; i++) { tr1 += S[i][i]; tr2 += S2[i][i]; var rs = 0; for (j = 0; j < 9; j++) { rs += B[i][j]; if (B[i][j] !== Math.round(B[i][j]) || Z[i][j] !== 0) ok = false; } if (rs !== 3) ok = false; }
    if (!ok || tr1 !== 0 || tr2 !== 72) console.error('neighbor-averaging: the neighbor matrix no longer has the chapter\'s spectrum');

    var f0 = [0, 0, 0, 0, 0, 0, 0, 0, 1], pow = [];              // pow[k] = T^k f0
    function powers() { pow = [f0.slice()]; for (k = 1; k <= K + 1; k++) { var p = pow[k - 1], q = []; for (i = 0; i < 9; i++) { var s = 0; for (j = 0; j < 9; j++) s += S[i][j] * p[j]; q.push(s / 6); } pow.push(q); } }
    powers();
    var meanOf = function (f) { var s = 0; for (i = 0; i < 9; i++) s += w[i] * f[i]; return s / mass; };
    var dist = function (f) { var m = meanOf(f), s = 0; for (i = 0; i < 9; i++) s += w[i] * (f[i] - m) * (f[i] - m); return Math.sqrt(s); };
    var range = function () { var lo = 0, hi = 0; f0.forEach(function (v) { lo = Math.min(lo, v); hi = Math.max(hi, v); }); var p = 0.12 * (hi - lo || 1); return [lo - (lo < 0 ? p : 0.04 * (hi - lo || 1)), hi + p]; };
    var y0 = fig.follow(range()[0]), y1 = fig.follow(range()[1]);

    var play = fig.player({ label: 'Steps', min: 0, max: K, value: 0, reduced: 3 / K, duration: 0.6 * K, format: function (v) { return String(Math.floor(v + 1e-6)); } });
    var kd = fig.follow(0, { tau: 0.07 });
    function setF(f) { f0 = f; powers(); play.pause(); play.set(0); kd.set(0); }
    fig.button({ label: 'Delta at L₉', onClick: function () { setF([0, 0, 0, 0, 0, 0, 0, 0, 1]); } });
    fig.button({ label: 'Random', onClick: function () { setF(f0.map(function () { return Math.round((Math.random() * 2 - 1) * 100) / 100; })); } });
    var once = fig.button({ label: 'Average once', onClick: function () { play.pause(); play.seek(Math.min(K, Math.floor(play.mapped + 1e-6) + 1)); } });
    var edges = fig.select({ label: 'Edges', options: [['p', 'p-neighbors'], ['pbar', 'p̄-neighbors'], ['both', 'both']], value: 'p' });
    fig.onReset = function () { setF([0, 0, 0, 0, 0, 0, 0, 0, 1]); play.reset(); kd.set(play.mapped); };

    var wide = function (W) { return W >= 600; }, NAMES = [1, 2, 3, 4, 5, 6, 7, 8, 9].map(function (q) { return 'L' + fmt.sub(q); });
    var G = fig.plane({ x: [-1.3, 1.3], y: [-1.3, 1.3], equal: true, pad: 6,
      box: function (W, H) { return wide(W) ? [0, 0, 0.46 * W, H] : [0.26 * W, 0, W, 0.5 * H]; } });
    var Pb = fig.plane({ x: [0.4, 9.6], y: [-0.1, 1.1], pad: { t: 12, r: 14, b: 26, l: 46 },
      box: function (W, H) { return wide(W) ? [0.46 * W, 0, W, H] : [0, 0.5 * H, W, H]; } });
    var cur = pow[0].slice(), handles = [];
    for (i = 0; i < 9; i++) (function (i) {
      handles.push(fig.drag({ plane: Pb, x: i + 1, y: 0, r: 5, color: 'fg',
        onStart: function () { var f = cur.slice(); setF(f); },
        constrain: function (x, y) { return [i + 1, Kit.clamp(y, Pb.v.y0, Pb.v.y1)]; },
        onDrag: function (x, y) { f0[i] = y; powers(); } }));
    })(i);

    function curve(x0, y0p, x1, y1p, r0, r1, bend, style) {   // a bent edge between two node discs, with a head
      var dx = x1 - x0, dy = y1p - y0p, L = Math.hypot(dx, dy), nx = -dy / L, ny = dx / L;
      var cx = (x0 + x1) / 2 + nx * bend * L, cy = (y0p + y1p) / 2 + ny * bend * L;
      var a0 = Math.atan2(cy - y0p, cx - x0), a1 = Math.atan2(cy - y1p, cx - x1);
      var sx = x0 + r0 * Math.cos(a0), sy = y0p + r0 * Math.sin(a0), ex = x1 + (r1 + 2) * Math.cos(a1), ey = y1p + (r1 + 2) * Math.sin(a1);
      var ctx = fig.ctx, hd = 5 + style.width * 1.4, ha = Math.atan2(ey - cy, ex - cx);
      fig.stroke(style); ctx.beginPath(); ctx.moveTo(sx, sy);
      ctx.quadraticCurveTo(cx, cy, ex - Math.cos(ha) * hd * 0.6, ey - Math.sin(ha) * hd * 0.6); ctx.stroke();
      ctx.setLineDash([]); ctx.fillStyle = fig.color(style.color, style.alpha); ctx.beginPath(); ctx.moveTo(ex, ey);
      ctx.lineTo(ex - hd * Math.cos(ha - 0.42), ey - hd * Math.sin(ha - 0.42)); ctx.lineTo(ex - hd * Math.cos(ha + 0.42), ey - hd * Math.sin(ha + 0.42));
      ctx.closePath(); ctx.fill();
    }

    return function draw() {
      var kv = kd.to(play.mapped).value, k0 = Math.min(K, Math.floor(kv + 1e-6)), u = Kit.clamp((kv - k0 - 0.25) / 0.5, 0, 1);
      u = u * u * (3 - 2 * u);
      var pa = pow[k0], pb = pow[k0 + 1], moving = u > 0 && u < 1, pulse = Math.sin(Math.PI * u);
      for (i = 0; i < 9; i++) cur[i] = pa[i] + (pb[i] - pa[i]) * u;
      if (!fig.activeDrag) { var rg = range(); Pb.view.y0 = y0.to(rg[0]).value; Pb.view.y1 = y1.to(rg[1]).value; Pb.update(); }
      once.enable(k0 < K);
      var mean = meanOf(f0), big = 1e-9, q20 = function (a) { return Math.round(20 * a) / 20; };
      for (i = 0; i < 9; i++) big = Math.max(big, Math.abs(f0[i]));

      // the graph
      var gb = G.box, R0 = Kit.clamp(Math.min(gb.w, gb.h) * 0.06, 8, 19), pos = [];
      for (i = 0; i < 9; i++) { var th = Math.PI / 2 - 2 * Math.PI * i / 9; pos.push([G.X(Math.cos(th)), G.Y(Math.sin(th)), R0 * Math.sqrt(w[i] * 4)]); }
      var mode = edges.value;
      [['p', A, null], ['pbar', B, [5, 4]]].forEach(function (E) {
        if (mode !== 'both' && mode !== E[0]) return;
        for (i = 0; i < 9; i++) for (j = 0; j < 9; j++) if (E[1][i][j]) {
          var fl = moving ? pulse * Math.abs(pa[j]) / big : 0;
          curve(pos[i][0], pos[i][1], pos[j][0], pos[j][1], pos[i][2], pos[j][2], 0.12,
            { color: fl > 0.05 ? (pa[j] >= 0 ? 'blue' : 'red') : 'muted', width: 0.7 + 0.9 * E[1][i][j], alpha: q20(0.45 + 0.55 * fl), dash: E[2] });
        }
      });
      for (i = 0; i < 9; i++) {
        var v = cur[i] - 0, a = Math.min(1, Math.abs(v) / big);
        fig.circle(pos[i][0], pos[i][1], pos[i][2], { fill: 'stage' });
        fig.circle(pos[i][0], pos[i][1], pos[i][2], { fill: v >= 0 ? 'blue' : 'red', alpha: q20(0.12 + 0.78 * a), ring: 'muted', ringWidth: 1.5 });
        var th2 = Math.PI / 2 - 2 * Math.PI * i / 9, lr = pos[i][2] + 11;
        fig.text(NAMES[i], pos[i][0] + lr * Math.cos(th2), pos[i][1] - lr * Math.sin(th2), { color: 'fg', size: 12.5, align: 'center', baseline: 'middle', weight: 600 });
      }

      // the bars
      var b = Pb.box;
      Pb.grid({ xTicks: [] });
      Pb.axes({ edge: true, xTicks: NAMES.map(function (q, k) { return [k + 1, q]; }), yLabel: 'f' });
      Pb.hline(0, { color: 'muted', width: 1 });
      var bw = Math.min(0.32 * Pb.sx, 22);
      for (i = 0; i < 9; i++) {
        var x = Pb.X(i + 1), y = Pb.Y(cur[i]), z = Pb.Y(0);
        fig.rect(x - bw, Math.min(y, z), 2 * bw, Math.abs(z - y), { fill: cur[i] >= 0 ? 'blue' : 'red', alpha: 0.8 });
        handles[i].x = i + 1; handles[i].y = Kit.clamp(cur[i], Pb.v.y0, Pb.v.y1);
      }
      Pb.hline(mean, { color: 'gold', width: 2.2 });
      var d = dist(cur), dk = dist(pow[k0]), dp = k0 ? dist(pow[k0 - 1]) : 0;
      var sig = function (q) { return q >= 0.01 ? fmt(q, 3) : q > 0 ? fmt.sci(Number(q.toPrecision(3))) : '0'; };
      var nar = !wide(fig.w), rt = k0 && dp > 1e-12 ? fmt(dk / dp, 3) : '–';
      if (nar) fig.panel([['step', String(k0)], ['distance', sig(d)], ['ratio', rt]], { x: 4, y: 6, compact: true, id: 'read' });
      else fig.panel([['step', String(k0)], ['weighted mean', fmt(mean, 3), 'gold'], ['distance to mean', sig(d)], ['ratio to last step', rt],
        [{ tex: 'rate' }, fmt((1 + Math.sqrt(5)) / 6, 3), 'muted']], { plane: Pb, at: 'ne', compact: false, hint: 'drag a bar to set the form', id: 'read' });
    };
  }
});
