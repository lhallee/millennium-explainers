/* The pole-order ladder of y^2 = f(x), deg f = 2g + 1, at P_infinity: x^i has pole order 2i and x^i y has 2i + 2g + 1,
   so the orders 1, 3, ..., 2g - 1 are missing and l(k) = k + 1 - g from k = 2g - 1 on (t-st-rr). Below it, the dimension
   count of t-st-upper as arithmetic in sqrt q: A = sqrt q - 1, B = sqrt q + 2g, unknowns l(A) l(B), equations
   l(A sqrt q + B) = l(q + 2g), with l read from the exact ladder. Their difference is sqrt q - (g + 1)^2 once
   A >= 2g - 1, and larger before. Departures from the spec: the spec calls sqrt q "r", which the chapter already uses
   for l(A), so the figure writes sqrt q; the ladder runs to k = 20 (14 on a phone) instead of 40, because at 40 the
   staircase and the line sit within a pixel of each other and the boxes are too narrow for their labels; and the
   two bars, which differ by a few units out of hundreds, are joined by a plot of their difference for every sqrt q. */
Kit.register('pole-ladder', {
  tex: { ell: '\\ell(k)', line: 'k + 1 - g', sq: '\\sqrt q', g: 'g', kk: 'k = 2g - 1', thr: '\\sqrt q = (g+1)^2',
    unk: '\\ell(A)\\,\\ell(B)', eq: '\\ell(A\\sqrt q + B)', form: '\\sqrt q - (g+1)^2' },
  init: function (fig) {
    var S0 = 2, S1 = 40, KM = 20, SUP = Kit.fmt.sup, fmt = Kit.fmt, i;
    var ell = function (k, g) { return k < 0 ? 0 : k >= 2 * g - 1 ? k + 1 - g : Math.floor(k / 2) + 1; };
    var count = function (s, g) { var A = s - 1, B = s + 2 * g; return { A: A, B: B, lA: ell(A, g), lB: ell(B, g), u: ell(A, g) * ell(B, g), n: A * s + B, e: ell(A * s + B, g) }; };
    [[3, 10, 11], [4, 18, 18], [5, 28, 27]].forEach(function (c) {             // the chapter's numbers for g = 1
      var r = count(c[0], 1);
      if (r.u !== c[1] || r.e !== c[2]) throw new Error('pole-ladder: count at sqrt q = ' + c[0] + ' is ' + r.u + ' vs ' + r.e);
    });
    var isPP = function (n) { for (var p = 2; p <= n; p++) if (n % p === 0) { while (n % p === 0) n /= p; return n === 1; } return false; };
    var fname = function (k, g) {
      if (k % 2 === 0) return k === 0 ? '1' : 'x' + (k > 2 ? SUP(k / 2) : '');
      if (k < 2 * g + 1) return null;
      var j = (k - 2 * g - 1) / 2;
      return (j === 0 ? '' : 'x' + (j > 1 ? SUP(j) : '')) + 'y';
    };

    var gs = fig.slider({ label: 'Genus', tex: 'g', min: 1, max: 4, step: 1, value: 1 });
    var ss = fig.slider({ label: 'Square root of q', tex: 'sq', min: S0, max: S1, step: 1, value: 5,
      format: function (v) { return v + ' (q = ' + fmt(v * v) + (isPP(v) ? ')' : ', no such field)'); } });

    // vertical layout: staircase, ladder, the count, a legend row, the difference plot
    var L = function (w, h) {
      // the ladder needs a second row of names when its boxes are narrower than 34 px (see `one` in draw)
      var nar = w < 640, st = Math.round(0.36 * h), lad = nar || (w - 52) / (KM + 1) < 34 ? 48 : 36, cnt = nar ? 24 : 40;
      return { nar: nar, st: st, lad: lad, surT: st + lad + cnt + 22 };
    };
    var stair = fig.plane({ x: [-0.5, KM + 0.5], y: [0, KM + 1], pad: { t: 12, r: 16, b: 20, l: 36 }, box: function (w, h) { return [0, 0, w, L(w, h).st]; } });
    var sur = fig.plane({ x: [S0 - 0.5, S1 + 0.5], y: [-4, 37], pad: { t: 6, r: 16, b: 22, l: 36 }, box: function (w, h) { return [0, L(w, h).surT, w, h]; } });
    fig.probe({ plane: stair, crosshair: false,
      snap: function (x) { var k = Kit.clamp(Math.round(x), 0, Math.round(stair.v.x1 - 0.5)); return [k, ell(k, gs.value)]; },
      rows: function (k) { var g = gs.value, f = fname(k, g); return [['k', String(k)], ['basis', f || 'none: a gap', f ? 'blue' : 'red'], [{ tex: 'ell' }, String(ell(k, g)), 'gold'], [{ tex: 'line' }, fmt(k + 1 - g), 'blue']]; } });
    fig.probe({ plane: sur,
      snap: function (x) { var s = Kit.clamp(Math.round(x), S0, S1), c = count(s, gs.value); return [s, c.u - c.e]; },
      rows: function (s) { var c = count(s, gs.value); return [[{ tex: 'sq' }, String(s)], ['unknowns', fmt(c.u), 'gold'], ['equations', fmt(c.e)], ['difference', fmt.signed(c.u - c.e), c.u > c.e ? 'gold' : 'red']]; },
      pick: function (x) { ss.set(Kit.clamp(Math.round(x), S0, S1)); } });

    var lOld = new Float64Array(KM + 1), lNew = new Float64Array(KM + 1), xs = new Float64Array(KM + 1), ys = new Float64Array(KM + 1);
    var gOld = gs.value, gNew = gs.value, morph = fig.tween(1), yLo = fig.follow(-5), yHi = fig.follow(40), bu = fig.follow(28), be = fig.follow(27);
    for (i = 0; i <= KM; i++) { lNew[i] = lOld[i] = ell(i, gNew); xs[i] = i - 0.5; }

    return function draw() {
      var g = gs.value, s = ss.value, lay = L(fig.w, fig.h), nar = lay.nar, K = nar ? 14 : KM;
      if (g !== gNew) {
        for (i = 0; i <= KM; i++) { lOld[i] += (lNew[i] - lOld[i]) * morph.value; lNew[i] = ell(i, g); }
        gOld = gNew; gNew = g; morph.set(0); morph.to(1, 700, 'inOutCubic');
      }
      var u = morph.value;
      for (i = 0; i <= KM; i++) ys[i] = lOld[i] + (lNew[i] - lOld[i]) * u;

      // the staircase l(k) and the line k + 1 - g, which meet from k = 2g - 1 on
      stair.pad.t = nar ? 26 : 12; stair.pad.b = nar ? 4 : 20;        // a phone puts the legend above the plot and k in the boxes
      stair.view.x1 = K + 0.5; stair.view.y1 = K + 1; stair.update();
      var b = stair.box, kg = 2 * g - 1;
      stair.grid({ xStep: nar ? 2 : 1, yStep: 5 });
      stair.axes({ edge: true, x: !nar, xStep: 1, yStep: 5 });
      if (nar) stair.hline(0, { color: 'muted', width: 1 });
      stair.vline(kg, { color: 'muted', width: 1, dash: [3, 4] });
      if (!nar) fig.label('kk', stair.X(kg) + 5, b.t + 1, { anchor: 'nw', color: 'muted', size: 12 });
      stair.stairs(xs, ys, { color: 'gold', width: 2.6, to: K + 0.5 });
      stair.plot(function (x) { return x + 1 - g; }, { color: 'blue', width: 1.8, dash: [7, 5] });
      for (i = 0; i <= K; i++) stair.point(i, ys[i], { color: 'gold', r: nar ? 2.2 : 3 });
      fig.legend([{ color: 'gold', tex: 'ell', width: 2.6 }, { color: 'blue', tex: 'line', dash: [7, 5], width: 1.8 }, nar && { color: 'muted', tex: 'kk', dash: [3, 4], width: 1 }],
        nar ? { plane: stair, id: 'stair', x: b.l - 6, y: 0, dir: 'row', bg: false, size: 11.5 } : { plane: stair, id: 'stair', at: 'se', size: 13 });

      // the ladder: a blue box for each pole order that a basis function reaches, a red outline for each gap
      var cw = stair.sx, bh = nar ? 14 : 15, y0 = lay.st + 2, ls = nar ? 9.5 : 11, one = cw >= 34;
      for (i = 0; i <= K; i++) {
        var px = stair.X(i), v = Kit.clamp(u * 1.6 - 0.6 * i / K, 0, 1);
        var on = (fname(i, gOld) ? 1 - v : 0) + (fname(i, gNew) ? v : 0), nm = fname(i, g);
        if (on > 0.01) fig.rect(px - cw / 2 + 1, y0, cw - 2, bh, { fill: 'blue', alpha: 0.85 * on });
        if (nar) fig.text(String(i), px, y0 + bh - 2.5, { color: on > 0.5 ? 'stage' : 'red', size: 9.5, align: 'center', weight: 700 });
        if (on < 0.99) fig.rect(px - cw / 2 + 1.5, y0 + 0.5, cw - 3, bh - 1, { color: 'red', width: 1.5, alpha: 1 - on });
        if (nm) fig.text(nm, px, y0 + bh + (one || i % 2 === 0 ? 13 : 25), { color: 'fg', size: ls, align: 'center', alpha: fname(i, gOld) === nm ? 1 : v });
      }

      // the count for this sqrt q: unknowns against equations
      var c = count(s, g), ok = c.u > c.e, yc = lay.st + lay.lad;
      if (nar) {
        fig.mathText([{ tex: 'unk' }, ' = ' + c.lA + ' × ' + c.lB + ' = ' + fmt(c.u) + (ok ? ' > ' : c.u === c.e ? ' = ' : ' < '), { tex: 'eq' }, ' = ' + fmt(c.e)],
          16, yc + 12, { size: 11.5, color: ok ? 'gold' : 'red' });
      } else {
        var ts = 11.5, lw = fig.labelSize('eq', 12).w, l0 = 16 + lw + 8;
        var tu = 'ℓ(' + c.A + ') ℓ(' + c.B + ') = ' + c.lA + ' × ' + c.lB + ' = ' + fmt(c.u), te = 'ℓ(' + fmt(c.n) + ') = ' + fmt(c.e);
        var rT = fig.w - 22 - Math.max(fig.measure(tu, ts, 500, true), fig.measure(te, ts, 500, true));
        var sc = (rT - l0) / Math.max(bu.to(c.u).value, be.to(c.e).value, 1);
        fig.label('unk', l0 - 8, yc + 10, { anchor: 'e', color: ok ? 'gold' : 'red', size: 12 });
        fig.label('eq', l0 - 8, yc + 27, { anchor: 'e', color: 'muted', size: 12 });
        fig.rect(l0, yc + 4, bu.value * sc, 12, { fill: ok ? 'gold' : 'red', alpha: 0.9 });
        fig.rect(l0, yc + 21, be.value * sc, 12, { fill: 'muted', alpha: 0.55 });
        fig.text(tu, l0 + bu.value * sc + 6, yc + 14, { color: ok ? 'gold' : 'red', size: ts, mono: true });
        fig.text(te, l0 + be.value * sc + 6, yc + 31, { color: 'muted', size: ts, mono: true });
      }

      // the difference for every sqrt q, the formula, and the threshold
      var lo = 1e9, hi = -1e9, d, sq, t = (g + 1) * (g + 1);
      for (sq = S0; sq <= S1; sq++) { d = count(sq, g); lo = Math.min(lo, d.u - d.e); hi = Math.max(hi, d.u - d.e); }
      sur.view.y0 = yLo.to(Math.min(lo, -2) - 3).value; sur.view.y1 = yHi.to(hi + 4).value; sur.update();
      sur.grid({ xStep: 5 });
      sur.axes({ edge: true, xStep: 5, xLabel: 'sq' });
      sur.hline(0, { color: 'muted', width: 1 });
      sur.vline(t, { color: 'muted', width: 1, dash: [3, 4] });
      sur.plot(function (x) { return x - t; }, { color: 'blue', width: 1.6, dash: [6, 4] });
      for (sq = S0; sq <= S1; sq++) {
        d = count(sq, g); var dv = d.u - d.e, col = dv > 0 ? 'gold' : 'red';
        sur.segment(sq, 0, sq, dv, { color: col, width: 2, alpha: 0.85 });
        sur.point(sq, dv, { color: col, r: sq === s ? 5.5 : 2.6 });
      }
      fig.label('thr', sur.X(t) + 5, sur.box.t + 1, { anchor: 'nw', color: 'muted', size: 12 });
      // for g >= 3 the count already succeeds at a small sqrt q below the threshold: ring it and say why that is no contradiction
      var early = [];
      for (sq = S0; sq < t; sq++) { d = count(sq, g); if (d.u > d.e) early.push(sq); }
      if (early.length) {
        early.forEach(function (e) { var de = count(e, g); fig.circle(sur.X(e), sur.Y(de.u - de.e), 8, { fill: false, ring: 'fg', ringWidth: 1.4 }); });
        var nl = ['√q = ' + early.join(', ') + ' also works: the theorem\'s condition', 'is sufficient, not necessary'];
        var room = sur.X(t) - sur.box.l - 16;
        if (fig.measure(nl[0], 11, 600) > room) nl = fig.wrap(nl.join(' '), Math.max(room, 110), 11, 600);
        nl.forEach(function (s, i) { fig.text(s, sur.box.l + 6, sur.box.t + 11 + 13 * i, { color: 'fg', size: 11, weight: 600 }); });
      }
      fig.legend([{ color: 'gold', dot: true, text: 'unknowns − equations' }, { color: 'blue', dash: [6, 4], width: 1.6, tex: 'form' }],
        { plane: sur, id: 'sur', x: sur.box.l - 6, y: lay.surT - 24, dir: 'row', bg: false, size: nar ? 11.5 : 13 });
    };
  }
});
