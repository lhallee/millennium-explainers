/* The seesaw on finite class sets (ml-seesaw): the array A(a, a', b) = w(a) w(a') w(b) u1(a) K1(a, b) u2(a') K2(a', b)
   of eq-ml-array, drawn as three 2 x 2 slices (one per b), summed in two orders. Summing a and a' first folds each
   slice into w(b) theta1(b) theta2(b), the inner product of the lifts; summing b first folds each fiber (a, a') into
   w(a) w(a') u1(a) u2(a') G(a, a'), the pairing against the kernel G on the small side. Both totals are 5/108 for the
   chapter's data. All arithmetic is in integers: w(a) = WA/6, w(b) = WB/12, theta = t/6, G = g/12, and every entry
   and term is k/432 with 432 = 6 * 6 * 12. */
Kit.register('ml-seesaw-array', {
  tex: { lhs: '\\langle\\theta_1,\\theta_2\\rangle' },
  init: function (fig) {
    var fmt = Kit.fmt, MINUS = fmt.minus, DEN = 432;
    var WA = [3, 1], WB = [3, 6, 1], K1 = [[1, 2, 0], [3, 1, 1]], K2 = [[2, 0, 1], [1, 1, 4]], WAS = ['1/2', '1/6'], WBS = ['1/4', '1/2', '1/12'];
    function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var r = a % b; a = b; b = r; } return a; }
    function frac(k, d) { if (!k) return '0'; var g = gcd(k, d); k /= g; d /= g; return (k < 0 ? MINUS : '') + Math.abs(k) + (d === 1 ? '' : '/' + d); }
    function signed(k, d) { return (k > 0 ? '+' : '') + frac(k, d); }
    /* Everything the figure shows, for forms u1, u2, in integers. */
    function compute(u1, u2) {
      var A = [], t1 = [], t2 = [], G = [[0, 0], [0, 0]], left = [], right = [[0, 0], [0, 0]], a, c, b;
      for (b = 0; b < 3; b++) {
        t1.push(WA[0] * u1[0] * K1[0][b] + WA[1] * u1[1] * K1[1][b]);
        t2.push(WA[0] * u2[0] * K2[0][b] + WA[1] * u2[1] * K2[1][b]);
        left.push(WB[b] * t1[b] * t2[b]);
        A.push([[0, 0], [0, 0]]);
        for (a = 0; a < 2; a++) for (c = 0; c < 2; c++) { A[b][a][c] = WA[a] * WA[c] * WB[b] * u1[a] * K1[a][b] * u2[c] * K2[c][b]; G[a][c] += WB[b] * K1[a][b] * K2[c][b]; }
      }
      for (a = 0; a < 2; a++) for (c = 0; c < 2; c++) right[a][c] = WA[a] * WA[c] * u1[a] * u2[c] * G[a][c];
      var sum = function (xs) { return xs.reduce(function (s, x) { return s + x; }, 0); };
      return { A: A, t1: t1, t2: t2, G: G, left: left, right: right, L: sum(left), R: sum(right[0]) + sum(right[1]) };
    }
    // Self-checks: the chapter's numbers, and agreement of the two orders for every pair of forms the sliders reach.
    var d0 = compute([1, -1], [2, 1]);
    if (d0.t1.join() !== '0,5,-1' || d0.t2.join() !== '13,1,10' || d0.G.join() !== '6,15,19,19' || d0.L !== 20 || d0.R !== 20 ||
      d0.right.join() !== '108,45,-114,-19' || frac(d0.L, DEN) !== '5/108') console.error('ml-seesaw-array: the default data disagree with the chapter');
    fig.job(function* () {
      for (var i0 = 0; i0 < 2401; i0++) {
        var q = [i0 % 7 - 3, ((i0 / 7) | 0) % 7 - 3, ((i0 / 49) | 0) % 7 - 3, ((i0 / 343) | 0) - 3], dq = compute([q[0], q[1]], [q[2], q[3]]);
        if (dq.L !== dq.R) console.error('ml-seesaw-array: the two orders differ at u = ' + q);
        if (i0 % 49 === 48) yield i0 / 2401;
      }
    });

    var order = fig.select({ label: 'Sum first over', value: 'aa', options: [['aa', 'a and a′: lift, then pair'], ['b', 'b: pair kernels, then integrate']],
      onInput: function () { play.set(0); if (Kit.reducedMotion) play.set(1); else play.play(); } });
    var play = fig.player({ label: 'Fold', duration: 6, autoplay: true, reduced: 1, format: function (v) { return Math.round(100 * v) + '%'; } });
    var U = [['u₁(1)', 1], ['u₁(2)', -1], ['u₂(1)', 2], ['u₂(2)', 1]].map(function (s) { return fig.slider({ label: s[0], min: -3, max: 3, step: 1, value: s[1] }); });

    function tile(x, y, s, k, alpha) {                               // one entry k/432 as a square of side s centered at (x, y)
      var mag = Math.abs(k) / 108;
      if (k) fig.rect(x - s / 2, y - s / 2, s, s, { fill: k > 0 ? 'teal' : 'red', alpha: alpha * (0.14 + 0.5 * Math.min(1, mag)) });
      else fig.rect(x - s / 2, y - s / 2, s, s, { color: 'muted', width: 1, alpha: alpha });
    }

    return function draw() {
      var D = compute([U[0].value, U[1].value], [U[2].value, U[3].value]), byB = order.value === 'aa', n = byB ? 3 : 4;
      var w = fig.w, h = fig.h, narrow = w < 700, fs = narrow ? 10.5 : 12, i, a, c, b;
      var s = play.value * n, done = Math.min(n, Math.floor(s + 1e-9)), f = done >= n ? 1 : Kit.ease.inOutCubic(Kit.clamp((s - done) * (6 / n) / 0.4, 0, 1));
      var folded = function (g) { return g < done || (g === done && f >= 1); };
      var txt = function (str, x, y, color, align, alpha) { fig.text(str, x, y, { color: color || 'fg', size: fs, weight: 600, align: align, alpha: alpha }); };
      var sign = function (k) { return k > 0 ? 'teal' : k < 0 ? 'red' : 'muted'; };

      // regions: left panel, block, right panel; on narrow stages the block and the panel of the chosen order
      var pw = narrow ? 0.46 * w : 0.25 * w, bl = narrow ? 0 : pw, br = w - pw, foot = 30, top = 52, rowH = (h - foot - top - 26) / 3;
      var PL = { x0: narrow ? w - pw + 4 : 8, x1: narrow ? w - 8 : pw - 4, show: !narrow || byB }, PR = { x0: w - pw + 4, x1: w - 8, show: !narrow || !byB };

      // the block: three slices b = 1, 2, 3 (rows a, columns a'), stepping back and up, joined at their corners
      var T = Math.min((br - bl - (narrow ? 34 : 80)) / 6.2, (h - foot - 64) / 4.4, 64), bx = Math.max(bl + (narrow ? 34 : 40), (bl + br) / 2 - 3.1 * T), by = (h - foot) / 2 + 0.2 * T + 6;
      var cardX = function (k) { return bx + k * 2.1 * T; }, cardY = function (k) { return by - k * 1.2 * T; };
      var tc = function (k, a, c) { return [cardX(k) + (c + 0.5) * T, cardY(k) + (a + 0.5) * T]; };
      var ctx = fig.ctx;
      fig.stroke({ color: 'muted', width: 1, dash: [2, 3], alpha: 0.7 });
      ctx.beginPath();
      for (var cn = 0; cn < 4; cn++) { var ox = (cn % 2) * 2 * T, oy = (cn >> 1) * 2 * T; ctx.moveTo(cardX(0) + ox, cardY(0) + oy); ctx.lineTo(cardX(2) + ox, cardY(2) + oy); }
      ctx.stroke(); ctx.setLineDash([]);
      var showFrac = T >= 46, moving = [];
      for (b = 2; b >= 0; b--) {
        txt('b = ' + (b + 1), cardX(b) + T, cardY(b) - 7, 'muted', 'center');
        for (a = 0; a < 2; a++) for (c = 0; c < 2; c++) {
          var g = byB ? b : 2 * a + c, p = tc(b, a, c), k = D.A[b][a][c], gone = folded(g);
          if (g === done && f > 0 && !gone) { moving.push([p, k, g]); tile(p[0], p[1], T - 4, k, 0.25); continue; }
          tile(p[0], p[1], T - 4, k, gone ? 0.3 : 1);
          fig.text(showFrac ? frac(k, DEN) : String(k).replace('-', MINUS), p[0], p[1] + 4, { color: sign(k), size: Math.min(fs, 0.36 * T), weight: 600, align: 'center', alpha: gone ? 0.4 : 1 });
        }
      }
      if (!byB && done < n) {                                            // the fiber being summed runs through all three slices
        var f0 = tc(0, done >> 1, done % 2), f2 = tc(2, done >> 1, done % 2);
        fig.line(f0[0], f0[1], f2[0], f2[1], { color: 'fg', width: 1.5, alpha: 0.4 });
      }
      txt('a = 1', cardX(0) - 6, cardY(0) + 0.5 * T + 4, 'muted', 'right');
      txt('a = 2', cardX(0) - 6, cardY(0) + 1.5 * T + 4, 'muted', 'right');
      txt(narrow ? '1' : 'a′ = 1', cardX(0) + 0.5 * T, cardY(0) + 2 * T + 16, 'muted', 'center');
      txt(narrow ? '2' : 'a′ = 2', cardX(0) + 1.5 * T, cardY(0) + 2 * T + 16, 'muted', 'center');
      if (narrow) txt('a′', cardX(0) - 6, cardY(0) + 2 * T + 16, 'muted', 'right');
      if (!showFrac) txt('entries in units of 1/432', (bl + br) / 2, 14, 'muted', 'center');

      // where each group lands
      var cw = (PR.x1 - PR.x0 - 34) / 2, chh = Math.min(cw, rowH * 1.25);
      function target(g) { return byB ? [PL.x1 - 16, top + g * rowH + 12] : [PR.x0 + 34 + ((g % 2) + 0.5) * cw, top + 20 + ((g >> 1) + 0.5) * chh + 10]; }
      moving.forEach(function (q) {                                      // tiles on their way to the panel
        var tg = target(q[2]), x = Kit.lerp(q[0][0], tg[0], f), y = Kit.lerp(q[0][1], tg[1], f);
        tile(x, y, (T - 4) * (1 - 0.7 * f), q[1], 1 - 0.5 * f);
      });
      var runL = 0, runR = 0;
      for (i = 0; i < n; i++) if (folded(i)) { if (byB) runL += D.left[i]; else runR += D.right[i >> 1][i % 2]; }
      if (!byB) runL = D.L; else runR = D.R;

      if (PL.show) {                                                    // lift, then pair
        fig.label('lhs', PL.x0, 36, { anchor: 'w', color: 'muted', size: fs + 1 });
        var all = D.t1.concat(D.t2), pos = Math.max.apply(null, all.concat([0])), neg = -Math.min.apply(null, all.concat([0]));
        var bs = (PL.x1 - PL.x0 - 74) / Math.max(1, pos + neg), zx = PL.x0 + 26 + neg * bs;
        for (b = 0; b < 3; b++) {
          var ry = top + b * rowH;
          txt('b = ' + (b + 1) + ',  w = ' + WBS[b], PL.x0, ry + 12, 'muted');
          txt(byB && !folded(b) ? '·' : signed(D.left[b], DEN), PL.x1, ry + 12, sign(D.left[b]), 'right');
          [D.t1[b], D.t2[b]].forEach(function (t, j) {
            var yb = ry + 26 + j * 14, len = t * bs;
            txt('θ' + fmt.sub(j + 1), PL.x0, yb + 4);
            fig.line(zx, yb - 6, zx, yb + 6, { color: 'muted', width: 1 });
            if (t) fig.rect(Math.min(zx, zx + len), yb - 4, Math.abs(len), 8, { fill: t > 0 ? 'teal' : 'red', alpha: j ? 0.55 : 0.85 });
            txt(frac(t, 6), zx + Math.max(len, 0) + 5, yb + 4);
          });
        }
        txt((byB && done < n ? 'running total ' : 'total ') + frac(runL, DEN), PL.x0, h - foot - 4, byB ? 'fg' : 'muted');
      }
      if (PR.show) {                                                    // pair kernels, then integrate
        var rf = 'Σ w(a)w(a′)u₁(a)u₂(a′)G(a, a′)';
        if (fig.measure(rf, fs, 600) < PR.x1 - PR.x0) txt(rf, PR.x0, 40, 'muted');
        for (a = 0; a < 2; a++) for (c = 0; c < 2; c++) {
          var cx = PR.x0 + 34 + (c + 0.5) * cw, cy = top + 20 + (a + 0.5) * chh, gi = 2 * a + c, tk = D.right[a][c];
          fig.rect(cx - cw / 2 + 2, cy - chh / 2 + 2, cw - 4, chh - 4, { color: 'muted', width: 1 });
          txt('G = ' + frac(D.G[a][c], 12), cx, cy - 4, 'fg', 'center');
          txt(!byB && !folded(gi) ? '·' : signed(tk, DEN), cx, cy + 14, sign(tk), 'center');
        }
        txt(narrow ? '1' : 'a′ = 1', PR.x0 + 34 + 0.5 * cw, top + 14, 'muted', 'center');
        txt(narrow ? '2' : 'a′ = 2', PR.x0 + 34 + 1.5 * cw, top + 14, 'muted', 'center');
        txt('a = 1', PR.x0 + 30, top + 20 + 0.5 * chh + 4, 'muted', 'right');
        txt('a = 2', PR.x0 + 30, top + 20 + 1.5 * chh + 4, 'muted', 'right');
        txt('w(a) = ' + WAS.join(', '), PR.x0, top + 20 + 2 * chh + 16, 'muted');
        txt((!byB && done < n ? 'running total ' : 'total ') + frac(runR, DEN), PR.x0, h - foot - 4, byB ? 'muted' : 'fg');
      }
      // headers and both totals, in the larger font
      var big = { size: fs + 1, weight: 700 };
      if (PL.show) fig.text('lift, then pair', PL.x0, 16, big);
      if (PR.show) fig.text(narrow ? 'pair kernels first' : 'pair kernels, then integrate', PR.x0, 16, big);
      var ready = done >= n, nameL = narrow ? 'a, a′ first' : 'lift, then pair', nameR = narrow ? 'b first' : 'pair kernels, then integrate';
      var line = ready ? nameL + ' ' + frac(runL, DEN) + '  =  ' + frac(runR, DEN) + ' ' + nameR + (D.L && !narrow ? '   (' + fmt(D.L / DEN, 6) + ')' : '')
        : (byB ? nameL : nameR) + ' so far: ' + frac(byB ? runL : runR, DEN) + '   ·   other order: ' + frac(byB ? runR : runL, DEN);
      fig.text(line, w / 2, h - 9, { size: fs + 1, weight: 700, align: 'center', color: ready ? 'teal' : 'fg' });
    };
  }
});
