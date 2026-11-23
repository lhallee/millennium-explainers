/* Bombieri's partition in the hyperelliptic case. For f(x) = x^3 + a x + b over F_p and d the least nonsquare mod p,
   each x in F_p gives two points to E: y^2 = f(x) when f(x) is a nonzero square, two to the twist E': d y^2 = f(x) when
   it is a nonsquare, and one to each when f(x) = 0; each curve has one point at infinity, so N(E) + N(E') = 2p + 2.
   The stacked bar on the right has that fixed height. The Hasse interval p + 1 +- 2 sqrt p is symmetric about half the
   total, so the one blue band holds the boundary between the counts exactly when both obey Hasse's bound.
   a and b are sliders over 0..p - 1 (setRange), and changing p keeps a and b modulo the new p. The figure works over
   the prime fields F_p, so it writes p where the caption's general statement has q. Chapter check, (a, b) = (1, 1):
   p = 5 gives 9 and 3, p = 7 gives 5 and 11. */
Kit.register('twist-split', {
  tex: { p: 'p', a: 'a', b: 'b', x: 'x', fx: 'f(x)' },
  init: function (fig) {
    var PR = [5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61], lastP = 7, SUP = Kit.fmt.sup;
    var coef = function (v) { return Math.round(v); };
    var ps = fig.slider({ label: 'Prime', tex: 'p', values: PR, value: 7, format: String, onInput: function (p) {
      var a = coef(as.value) % p, b = coef(bs.value) % p;
      lastP = p; as.setRange(0, p - 1, 1); bs.setRange(0, p - 1, 1); as.set(a); bs.set(b);
    } });
    var as = fig.slider({ label: 'Coefficient', tex: 'a', min: 0, max: 6, step: 1, value: 1 });
    var bs = fig.slider({ label: 'Coefficient', tex: 'b', min: 0, max: 6, step: 1, value: 1 });

    var sq = new Uint8Array(64), st = new Int8Array(64), fv = new Int32Array(64);
    var from = new Float64Array(130), to = new Float64Array(130), cur = new Float64Array(130);
    var C = { p: 0, a: 0, b: 0, d: 0, NE: 0, NT: 0, sing: false }, key = '', slide = fig.tween(1), NEf = fig.follow(5, { tau: 0.08 });
    fig.onReset = function () { lastP = 7; as.setRange(0, 6, 1); bs.setRange(0, 6, 1); };
    function solve(p, a, b) {
      var x, y, NE = 1, NT = 1;
      sq.fill(0);
      for (y = 1; y < p; y++) sq[y * y % p] = 1;
      for (y = 2; sq[y]; y++);
      for (x = 0; x < p; x++) {
        var f = (x * x * x + a * x + b) % p;
        fv[x] = f; st[x] = f === 0 ? 0 : sq[f] ? 1 : -1;
        NE += st[x] === 0 ? 1 : st[x] > 0 ? 2 : 0; NT += st[x] === 0 ? 1 : st[x] < 0 ? 2 : 0;
        to[2 * x] = st[x] < 0 ? -1 : 1; to[2 * x + 1] = st[x] === 0 ? -1 : 2 * st[x];
      }
      to[2 * p] = 1; to[2 * p + 1] = -1;
      if (NE + NT !== 2 * p + 2) throw new Error('twist-split: counts ' + NE + ' + ' + NT + ' at p = ' + p);
      C.p = p; C.a = a; C.b = b; C.d = y; C.NE = NE; C.NT = NT; C.sing = (4 * a * a * a + 27 * b * b) % p === 0;
    }
    [[5, 9, 3], [7, 5, 11]].forEach(function (c) {             // the chapter's numbers for y^2 = x^3 + x + 1
      solve(c[0], 1, 1);
      if (C.NE !== c[1] || C.NT !== c[2]) throw new Error('twist-split: p = ' + c[0] + ' gives ' + C.NE + ', ' + C.NT);
    });
    var poly = function (a, b) { return 'x³' + (a ? ' + ' + (a > 1 ? a : '') + 'x' : '') + (b ? ' + ' + b : ''); };

    var P = fig.plane({ x: [-0.7, 8], y: [-1, 1], pad: { t: 40, r: 8, b: 40, l: 40 },
      box: function (w, h) { return [0, 0, w - (w < 560 ? 100 : 150), h]; } });
    fig.probe({ plane: P, marker: false,
      snap: function (x) { var p = C.p; return x > p - 0.35 ? [p + 0.3, 0] : [Kit.clamp(Math.round(x), 0, p - 1), 0]; },
      rows: function (x) {
        if (x > C.p) return [['x', '∞'], ['points', 'one on each curve']];
        var s = st[x];
        return [['x', String(x)], [{ tex: 'fx' }, String(fv[x]), s > 0 ? 'gold' : s < 0 ? 'teal' : 'fg'],
          ['points', s > 0 ? 'two on E' : s < 0 ? 'two on E′' : 'one on each', s > 0 ? 'gold' : s < 0 ? 'teal' : 'fg']];
      } });

    return function draw() {
      var p = ps.value, a = coef(as.value), b = coef(bs.value), k = p + ',' + a + ',' + b, n = 2 * p + 2, i;
      if (k !== key) {
        var sameP = C.p === p && key !== '';
        if (sameP) from.set(cur);
        solve(p, a, b); key = k;
        if (sameP) { slide.set(0); slide.to(1, 250, 'inOutCubic'); } else { slide.set(1); NEf.set(C.NE); }
      }
      var u = slide.value;
      for (i = 0; i < n; i++) cur[i] = u >= 1 ? to[i] : from[i] + (to[i] - from[i]) * u;
      P.view.x1 = p + 0.9; P.update();

      var B = P.box, mid = (B.t + B.b) / 2, half = mid - B.t, cw = P.sx, r = Kit.clamp(cw * 0.3, 1.8, 6);
      var g1 = Math.max(26, half * 0.5), g2 = Math.min(2.6 * r + 5, half * 0.3), labels = cw >= 15, fs = cw >= 22 ? 12 : 10.5;
      var Y = function (s) { var m = Math.abs(s); return mid - Math.sign(s) * (m <= 1 ? m * g1 : g1 + (m - 1) * g2); };
      for (i = 0; i <= p; i++) {
        var px = P.X(i < p ? i : p + 0.3);
        fig.line(px, Y(2), px, Y(-2), { color: 'grid', width: 1 });
        if (labels && i < p) {
          fig.text(String(i), px, mid - 6, { color: 'muted', size: fs, align: 'center' });
          fig.text(String(fv[i]), px, mid + 14, { color: st[i] > 0 ? 'gold' : st[i] < 0 ? 'teal' : 'fg', size: fs, align: 'center', weight: 600 });
        }
        for (var j = 0; j < 2; j++) {
          var s = cur[2 * i + j], ring = i < p && st[i] === 0 && u >= 1;
          fig.circle(px, Y(s), r, ring ? { fill: 'stage', ring: s > 0 ? 'gold' : 'teal', ringWidth: Math.max(1.5, r * 0.45) } : { fill: s > 0 ? 'gold' : 'teal', ring: 'stage', ringWidth: 1.5 });
        }
      }
      if (labels) { fig.label('x', B.l - 8, mid - 10, { anchor: 'e', color: 'muted', size: 12 }); fig.label('fx', B.l - 8, mid + 10, { anchor: 'e', size: 12 }); }
      else fig.line(B.l, mid, P.X(p - 1), mid, { color: 'muted', width: 1 });
      fig.text('∞', P.X(p + 0.3), labels ? mid + 4 : mid - 6, { color: 'muted', size: 13, align: 'center' });
      var nar = fig.w < 560, ls = nar ? 11.5 : 13;
      fig.text('E: y² = ' + poly(a, b) + ' mod ' + p, B.l, B.t - 22, { color: 'gold', size: ls, weight: 600 });
      fig.text('E′: ' + C.d + 'y² = ' + poly(a, b), B.l, B.b + (nar ? 20 : 30), { color: 'teal', size: ls, weight: 600 });
      fig.text(C.d + ' is the least nonsquare mod ' + p, nar ? B.l : B.r, B.b + (nar ? 35 : 30), { color: 'muted', size: ls - 1.5, align: nar ? 'left' : 'right' });
      if (C.sing) fig.text('singular: 4a³ + 27b² ≡ 0 mod p', nar ? B.l : B.r, B.t - (nar ? 7 : 22), { color: 'red', size: ls, weight: 700, align: nar ? 'left' : 'right' });

      // the stacked bar: N(E) from the top in gold, N(E') below it in teal, total 2p + 2, Hasse band in blue
      var bw = fig.w < 560 ? 16 : 22, bx = fig.w - (fig.w < 560 ? 88 : 128), top = B.t, H = B.b - B.t, sc = H / n;
      var NE = NEf.to(C.NE).value, cut = top + NE * sc, hb = 2 * Math.sqrt(p) * sc;
      fig.rect(bx - 5, mid - hb, bw + 10, 2 * hb, { fill: 'blue', alpha: C.sing ? 0.08 : 0.2 });
      fig.line(bx - 5, mid - hb, bx + bw + 5, mid - hb, { color: 'blue', width: 1, dash: [3, 3] });
      fig.line(bx - 5, mid + hb, bx + bw + 5, mid + hb, { color: 'blue', width: 1, dash: [3, 3] });
      fig.rect(bx, top, bw, cut - top, { fill: 'gold', alpha: 0.9 });
      fig.rect(bx, cut, bw, B.b - cut, { fill: 'teal', alpha: 0.9 });
      fig.rect(bx, top, bw, H, { color: 'fg', width: 1.5 });
      var ty1 = Kit.clamp((top + cut) / 2, top + 6, B.b - 22), ty2 = Math.max((cut + B.b) / 2, ty1 + 16);
      fig.text('N(E) = ' + C.NE, bx + bw + 7, ty1 + 4, { color: 'gold', size: ls - 1, weight: 600 });
      fig.text('N(E′) = ' + C.NT, bx + bw + 7, ty2 + 4, { color: 'teal', size: ls - 1, weight: 600 });
      fig.text('total 2p + 2 = ' + n, bx + bw / 2, B.b + 18, { color: 'muted', size: ls - 2, align: 'center' });
      fig.text('p + 1 ± 2√p', bx + bw / 2, top - 8, { color: 'blue', size: ls - 2, align: 'center' });
    };
  }
});
