/* The budget behind Stepanov's method. A nonzero R of degree D that vanishes to order m at N points has mN <= D
   (t-st-roots). "A polynomial" draws R(x) = c prod_j (x - r_j)^m Q(x) on [0, 10], with c making max |R| = 1. The zeros
   r_j = 5 - 5 cos((2j + 1) pi / 2N) are the Chebyshev nodes, so prod_j (x - r_j) is a multiple of T_N((x - 5) / 5)
   and every hump has the same height: with evenly spaced zeros the middle humps are thousands of times lower than
   the outer ones and vanish from the drawing. The filler Q(x) = ((x - 5)^2 + 1600)^floor(k/2) (x + 40)^(k mod 2),
   k = D - mN, has no zero on [0, 10] and keeps every hump within 33% of the tallest. "The curve over F_25" is the chapter's
   example: the 26 affine points of y^2 = x^3 + x + 1 over F_25 = F_5(t), t^2 = 3, each a zero of F of order at least
   sqrt q = 5 (t-st-vanishing), against the pole of F at P_0 = P_infinity, of order at most
   A sqrt q + B q = 4 * 5 + 7 * 25 = 195. So 5 (N_1 - 1) <= 195 and N_1 <= 40 (t-st-upper). */
Kit.register('multiplicity-budget', {
  tex: { R: 'R(x)', D: 'D', m: 'm', N: 'N', mN: 'mN', N1: 'N_1 - 1', sqN: '\\sqrt q\\,(N_1 - 1)', bud: 'A\\sqrt q + Bq',
    lf: '\\lfloor', rf: '\\rfloor', ord: '\\ord_P(F)', E25: 'E(\\FF_{25})', x25: 'x \\in \\FF_{25}', y25: 'y \\in \\FF_{25}' },
  init: function (fig) {
    var G = 481, X1 = 10, BAR = 102, SQ = 5, A = 4, B = 7, BUD = A * SQ + B * SQ * SQ, TRUE_N1 = 27;
    var mode = fig.select({ label: 'Example', options: [['poly', 'A polynomial on the line'], ['curve', 'The curve y² = x³ + x + 1 over F₂₅']], value: 'poly' });
    var Ds = fig.slider({ label: 'Degree', tex: 'D', min: 4, max: 24, step: 1, value: 12 });
    var ms = fig.slider({ label: 'Order', tex: 'm', min: 1, max: 6, step: 1, value: 2 });
    var Ns = fig.slider({ label: 'Points', tex: 'N', min: 1, max: 12, step: 1, value: 5 });
    var Ks = fig.slider({ label: 'Rational points', tex: 'N1', min: 1, max: 45, step: 1, value: TRUE_N1 - 1 });

    // E(F_25): the element a + b t has index a + 5 b.
    var mul = function (u, v) { return [(u[0] * v[0] + 3 * u[1] * v[1]) % 5, (u[0] * v[1] + u[1] * v[0]) % 5]; };
    var el = function (i) { return [i % 5, (i / 5) | 0]; };
    var name = function (i) { var a = i % 5, b = (i / 5) | 0; return b === 0 ? String(a) : (a ? a + ' + ' : '') + (b > 1 ? b : '') + 't'; };
    var pts = [], i, j;
    for (i = 0; i < 25; i++) {
      var x = el(i), fx = mul(mul(x, x), x);
      fx = [(fx[0] + x[0] + 1) % 5, (fx[1] + x[1]) % 5];
      for (j = 0; j < 25; j++) { var yy = mul(el(j), el(j)); if (yy[0] === fx[0] && yy[1] === fx[1]) pts.push([i, j]); }
    }
    if (pts.length !== TRUE_N1 - 1 || BUD !== 195) throw new Error('multiplicity-budget: E(F_25) has ' + pts.length + ' affine points');

    var top = fig.plane({ x: [0, X1], y: [-1.2, 1.2], box: [0, 0, 1, '-' + BAR + 'px'], pad: { t: 26, r: 16, b: 10, l: 20 } });
    var grid = fig.plane({ x: [-0.5, 24.5], y: [-0.5, 24.5], equal: true, pad: { t: 22, r: 6, b: 24, l: 34 },
      box: function (w, h) { var H = h - BAR; return [8, 0, 8 + Math.min(H + 28, 0.56 * w), H]; } });
    fig.probe({ plane: grid, crosshair: false,
      snap: function (x, y) {
        if (mode.value !== 'curve') return null;
        var best = null, bd = 1.2;
        pts.forEach(function (p) { var d = Math.hypot(p[0] - x, p[1] - y); if (d < bd) { bd = d; best = p; } });
        return best;
      },
      rows: function (x, y, pr) {
        if (mode.value !== 'curve' || !pr.snapped) return null;
        return [['x', name(x)], ['y', name(y)], [{ tex: 'ord' }, '≥ ' + SQ, 'gold']];
      } });

    // the polynomial, sampled once per change of D, m, N
    var xs = new Float64Array(G), tgt = new Float64Array(G), from = new Float64Array(G), disp = new Float64Array(G), out = new Float64Array(G);
    for (i = 0; i < G; i++) xs[i] = X1 * i / (G - 1);
    var root = function (N, j) { return 5 - 5 * Math.cos((2 * j + 1) * Math.PI / (2 * N)); };
    function shape(D, m, N) {
      var k = Math.max(0, D - m * N), k2 = k >> 1, k1 = k & 1, qmax = Math.pow(1625 / 1600, k2) * Math.pow(50 / 40, k1);
      for (var i = 0; i < G; i++) {
        var x = xs[i], T = Math.cos(N * Math.acos(Kit.clamp((x - 5) / 5, -1, 1)));
        tgt[i] = Math.pow(T, m) * Math.pow(((x - 5) * (x - 5) + 1600) / 1600, k2) * Math.pow((x + 40) / 40, k1) / qmax;
      }
    }
    var key = '', oldN = Ns.value, newN = Ns.value, morph = fig.tween(1), amp = fig.tween(1), scale = fig.follow(24, { tau: 0.1 });
    var floor = fig.follow(ms.value % 2 ? -1.2 : -0.3);           // an even m makes R >= 0, so the lower half goes
    shape(Ds.value, ms.value, Ns.value); disp.set(tgt);
    fig.onReset = function () { key = ''; };

    function wrap(str, maxW, size) {
      var words = str.split(' '), lines = [], cur = '';
      words.forEach(function (w) { var t = cur ? cur + ' ' + w : w; if (cur && fig.measure(t, size) > maxW) { lines.push(cur); cur = w; } else cur = t; });
      if (cur) lines.push(cur);
      return lines;
    }
    // the budget bar: n blocks of m units against a budget of D units; blocks from index `real` on are hypothetical
    function bar(U, D, m, n, real, y) {
      var l = 20, s = (fig.w - 16 - l) / U, h = 20, gap = m * s > 6 ? 1.5 : 0.6, u;
      fig.rect(l, y, D * s, h, { fill: 'muted', alpha: 0.18 });
      for (var j = 0; j < n; j++) {
        var a = j * m, over = a + m > D;
        fig.rect(l + a * s + gap / 2, y, m * s - gap, h, { fill: over ? 'red' : 'gold', alpha: j < real ? 0.92 : 0.42 });
      }
      if (s >= 6) for (u = 1; u < Math.max(D, m * n); u++) if (u % m) fig.line(l + u * s, y + 3, l + u * s, y + h - 3, { color: 'stage', width: 1, alpha: 0.6 });
      fig.rect(l, y, D * s, h, { color: 'fg', width: 1.5 });
      fig.line(l + D * s, y - 6, l + D * s, y + h + 6, { color: 'fg', width: 2 });
      var st = Kit.math.niceStep(U, fig.w - 36, 70);              // a ruler in units of degree, or of pole order
      for (u = 0; u <= U + 1e-9; u += st) { fig.line(l + u * s, y + h + 2, l + u * s, y + h + 6, { color: 'muted', width: 1 }); if (u) fig.text(Kit.fmt(u), l + u * s, y + h + 16, { color: 'muted', size: 10, align: 'center' }); }
    }

    return function draw() {
      var curve = mode.value === 'curve', D = Ds.value, m = ms.value, N = Ns.value, K = Ks.value;
      Ds.show(!curve); ms.show(!curve); Ns.show(!curve); Ks.show(curve);
      var yb = fig.h - BAR, narrow = fig.w < 520, fs = narrow ? 11.5 : 12.5;

      if (!curve) {
        var k = D + ',' + m + ',' + N;
        if (k !== key) {
          if (key) { from.set(disp); oldN = newN; morph.set(0); morph.to(1, 320, 'inOutCubic'); }
          key = k; newN = N; shape(D, m, Math.max(1, N));
          amp.to(m * N > D ? 0 : 1, m * N > D ? 400 : 250, 'inOutCubic');
        }
        var t = morph.value, a = amp.value, over = m * N > D;
        for (var i = 0; i < G; i++) { disp[i] = from[i] + (tgt[i] - from[i]) * t; out[i] = disp[i] * a; }
        top.view.y0 = floor.to(m % 2 ? -1.2 : -0.3).value; top.update();
        top.hline(0, { color: 'muted', width: 1 });
        top.path(xs, out, { color: over ? 'red' : 'blue', width: 2.4 });
        fig.label('R', top.box.l + 2, top.box.t - 4, { anchor: 'sw', color: over ? 'red' : 'blue' });
        for (var j = 0; j < Math.max(oldN, newN); j++) {
          var xo = j < oldN ? root(oldN, j) : 0, xn = j < newN ? root(newN, j) : 0;
          var px = j < oldN && j < newN ? xo + (xn - xo) * t : j < newN ? xn : xo, al = j < oldN && j < newN ? 1 : j < newN ? t : 1 - t;
          if (al > 0.02) fig.circle(top.X(px), top.Y(0), 5, { fill: 'gold', alpha: al, ring: 'stage', ringWidth: 2 });
        }
        var mN = m * N, U = scale.to(Math.max(24, mN)).value;
        fig.mathText([{ tex: 'mN' }, ' = ' + m + ' × ' + N + ' = ' + mN + (over ? '  >  ' : '  ≤  '), { tex: 'D' }, ' = ' + D], 20, yb + 16, { size: fs });
        bar(U, D, m, N, N, yb + 30);
        if (over) fig.text('only R = 0 fits', 20, yb + 88, { color: 'red', size: fs + 0.5, weight: 700 });
        // The floor brackets are math labels: as canvas text they are outside the page's text fonts and cost about
        // 20 ms of font fallback at 4x CPU slowdown on first use.
        else fig.mathText(['room for at most ', { tex: 'lf' }, D + '/' + m, { tex: 'rf' }, ' = ' + Math.floor(D / m) + ' points of order ' + m], 20, yb + 88 - 0.3 * fs, { color: 'muted', size: fs });
        return;
      }

      // the curve over F_25
      var gb = grid.box, cs = grid.sx, r = Kit.clamp(cs * 0.34, 2.2, 5);
      for (var c = 0; c < 25; c++) {
        grid.segment(c, -0.5, c, 24.5, { color: 'grid', width: 1 });
        grid.segment(-0.5, c, 24.5, c, { color: 'grid', width: 1 });
      }
      [0, 5, 10, 15, 20].forEach(function (v) {
        fig.text(name(v), grid.X(v), gb.b + 13, { color: 'muted', size: 10.5, align: 'center' });
        fig.text(name(v), gb.l - 5, grid.Y(v) + 4, { color: 'muted', size: 10.5, align: 'right' });
      });
      fig.label('x25', gb.r, gb.b + 16, { anchor: 'ne', color: 'muted', size: 12 });
      fig.label('y25', gb.l - 30, gb.t - 4, { anchor: 'sw', color: 'muted', size: 12 });
      pts.forEach(function (p) { fig.circle(grid.X(p[0]), grid.Y(p[1]), r, { fill: 'gold', ring: 'stage', ringWidth: 1.5 }); });

      var tx = grid.outer.r + 14, tw = fig.w - tx - 12, ty = gb.t + 14, ls = narrow ? 11 : 12.5, lh = ls * 1.45;
      fig.mathText([{ tex: 'E25' }], tx, ty, { size: ls + 1 });
      ty += lh + 4;
      var lines = [['gold', narrow ? '26 points, zeros of F of order ≥ 5' : '26 affine points, each a zero of F of order at least √q = 5'],
        ['muted', narrow ? 'P₀ = P∞: the only pole, order ≤ 195' : 'P₀ = P∞ is not drawn: it is the only pole of F, of order at most A√q + Bq = 195'],
        ['muted', 'hover a point to read it']];
      lines.forEach(function (ln, n) {
        if (n === 2 && narrow) return;
        if (n < 2) fig.circle(tx + 5, ty - ls * 0.35, n ? 4.5 : r, n ? { fill: 'stage', ring: 'muted', ringWidth: 1.5 } : { fill: 'gold', ring: 'stage', ringWidth: 1.5 });
        wrap(ln[1], tw - 18, ls).forEach(function (s) { fig.text(s, tx + 16, ty, { color: n === 2 ? 'muted' : 'fg', size: ls }); ty += lh; });
        ty += 6;
      });

      var used = SQ * K, overC = used > BUD, Uc = scale.to(Math.max(200, used + SQ)).value;
      fig.mathText([{ tex: 'sqN' }, ' = 5 × ' + K + ' = ' + used + (overC ? '  >  ' : '  ≤  '), { tex: 'bud' }, ' = ' + BUD], 20, yb + 16, { size: fs });
      bar(Uc, BUD, SQ, K, TRUE_N1 - 1, yb + 30);
      if (overC) fig.text('only F = 0 fits', 20, yb + 88, { color: 'red', size: fs + 0.5, weight: 700 });
      else fig.text((narrow ? '' : 'room for ' + Math.floor(BUD / SQ) + ' points besides P₀, ') + 'so N₁ ≤ 1 + 39 = 40; the true N₁ is ' + TRUE_N1, 20, yb + 88, { color: 'muted', size: fs });
    };
  }
});
