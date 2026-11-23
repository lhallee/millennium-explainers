/* The Siegel and Weil identity for the genus G_1 of rank-two Hermitian lattices over Q(sqrt -23) (chapter 20,
   df-theta). Nine classes L_1..L_9 carry five distinct series r_L(n), n = 1..24. The gold bars are the weighted
   mean sum w_i r_i(n) / sum w_i over the selected classes; the blue ticks are the Eisenstein coefficients
   e(n) = (12/11) sum_{d | n, 23 not dividing d} d. All arithmetic is exact: weights are kept as integers over 24,
   so the mean is num/den and the gap to e(n) is (11 num - 12 sigma den) / (11 den). With all nine classes and the
   weights 1/|Aut| every gap is 0; dropping a class or using equal weights breaks it (red segments). */
Kit.register('genus-theta-average', {
  tex: { n: 'n', r: 'r_L(n)' },
  init: function (fig) {
    var fmt = Kit.fmt, N = 24;
    var SER = [
      [4, 4, 0, 4, 8, 8, 16, 12, 20, 24, 0, 40, 24, 32, 16, 36, 24, 44, 16, 40, 16, 32, 4, 80],
      [2, 2, 6, 8, 4, 10, 8, 18, 16, 24, 12, 32, 18, 28, 20, 30, 24, 40, 20, 44, 32, 40, 2, 70],
      [0, 4, 4, 8, 8, 16, 8, 16, 12, 16, 16, 28, 12, 24, 32, 36, 16, 44, 24, 48, 40, 40, 0, 60],
      [0, 6, 0, 6, 12, 18, 12, 12, 12, 12, 12, 30, 12, 24, 36, 42, 12, 48, 24, 48, 36, 36, 0, 60],
      [0, 0, 12, 12, 0, 12, 0, 24, 12, 24, 24, 24, 12, 24, 24, 24, 24, 36, 24, 48, 48, 48, 0, 60]];
    var OF = [0, 1, 1, 2, 2, 2, 3, 3, 4];                 // the series of L_1 .. L_9
    var AUT = [8, 4, 4, 8, 8, 4, 12, 12, 12];
    var OFF = [-0.3, -0.15, 0, 0.15, 0.3];                // a small sideways offset per series, so the dots separate
    var SIG = [0], n, i;                                  // SIG[n]: sum of the divisors of n not divisible by 23
    for (n = 1; n <= N; n++) { var s = 0; for (var d = 1; d <= n; d++) if (n % d === 0 && d % 23) s += d; SIG.push(s); }
    var gcd = function (a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var t = a % b; a = b; b = t; } return a; };
    var frac = function (p, q) { var g = gcd(p, q) || 1; p /= g; q /= g; return q === 1 ? fmt(p) : fmt(p) + '/' + q; };

    /* Exact statistics for a set of classes: weights as integers W_i (24 w_i, or 1 for equal weights). */
    function stats(sel, equal) {
      var den = 0, num = new Array(N + 1).fill(0), gap = new Array(N + 1).fill(0), worst = 0, k = 0;
      for (i = 0; i < 9; i++) if (sel[i]) { var W = equal ? 1 : 24 / AUT[i]; den += W; k++; for (n = 1; n <= N; n++) num[n] += W * SER[OF[i]][n - 1]; }
      for (n = 1; n <= N && den; n++) { gap[n] = 11 * num[n] - 12 * SIG[n] * den; worst = Math.max(worst, Math.abs(gap[n])); }
      return { num: num, den: den, gap: gap, worst: worst, k: k, eq: equal };
    }

    // self-check against the chapter: mass 11/8, the first six means, and the identity for every n <= 24
    var all = [1, 1, 1, 1, 1, 1, 1, 1, 1], st0 = stats(all, false), want = ['12/11', '36/11', '48/11', '84/11', '72/11', '144/11'];
    var bad = frac(st0.den, 24) !== '11/8' || st0.worst !== 0 || frac(stats(all, true).worst, 99) !== '136/99';
    for (n = 1; n <= 6; n++) if (frac(st0.num[n], st0.den) !== want[n - 1]) bad = true;
    if (bad) console.error('genus-theta-average: the genus data no longer reproduce the chapter (mass 11/8, means 12/11, 36/11, ...)');

    var cur = st0, from = new Float64Array(N + 1), to = new Float64Array(N + 1), disp = new Float64Array(N + 1);
    for (n = 1; n <= N; n++) to[n] = disp[n] = cur.num[n] / cur.den;
    var morph = fig.tween(1), match = fig.tween(1), btns = [];
    function update() {
      var sel = btns.map(function (b) { return b.pressed; });
      cur = stats(sel, wts.value === 'equal');
      for (n = 1; n <= N; n++) { from[n] = disp[n]; to[n] = cur.den ? cur.num[n] / cur.den : 0; }
      morph.set(0); morph.to(1, 200, 'outCubic');
      match.to(cur.den && cur.worst === 0 ? 1 : 0, 300, 'inOutCubic');
    }
    for (i = 0; i < 9; i++) (function (i) {
      var b = fig.button({ label: 'L' + fmt.sub(i + 1), pressed: true, onClick: function () { b.press(!b.pressed); update(); } });
      btns.push(b);
    })(i);
    var wts = fig.select({ label: 'Weights', options: [['aut', '1 / |Aut|'], ['equal', 'equal']], value: 'aut', onInput: update });
    fig.onReset = function () { btns.forEach(function (b) { b.press(true); }); update(); };

    var X = [1, 4, 8, 12, 16, 20, 24];
    var P = fig.plane({ x: [0.35, 24.65], y: [0, 92], pad: { t: 14, r: 14, b: 28, l: 40 }, box: [0, 0, 1, '100% - 62px'] });
    var D = fig.plane({ x: [0.35, 24.65], y: [-1, 1], pad: { t: 6, r: 14, b: 6, l: 40 }, box: [0, '100% - 62px', 1, 1] });   // mean minus e(n), magnified
    var dmax = fig.follow(0.5);
    fig.probe({ plane: P, crosshair: false,
      snap: function (x) { var k = Kit.clamp(Math.round(x), 1, N); return [k, disp[k]]; },
      rows: function (x) {
        var k = Math.round(x), e = 12 * SIG[k];
        return [[{ tex: 'n' }, String(k)], cur.den ? ['mean', frac(cur.num[k], cur.den), 'gold'] : null, ['Eisenstein', frac(e, 11), 'blue'],
          cur.den ? ['gap', cur.gap[k] ? frac(cur.gap[k], 11 * cur.den) : '0', cur.gap[k] ? 'red' : 'blue'] : null];
      } });

    return function draw() {
      var t = morph.value, b = P.box, narrow = b.w < 480, half = 0.31, mt = match.value;
      for (n = 1; n <= N; n++) disp[n] = from[n] + (to[n] - from[n]) * t;
      P.view.x1 = D.view.x1 = 24.45 + 16 * 24.1 / b.w; P.view.y1 = narrow ? 128 : 92; P.update(); b = P.box;   // room for the n label and, on a phone, the key
      P.grid({ xTicks: X, yStep: 20 });
      P.axes({ edge: true, xTicks: X, yStep: 20, xLabel: 'n', yLabel: 'r' });
      var base = P.Y(0), rd = narrow ? 1.8 : 2.6;
      for (n = 1; n <= N; n++) {
        var x0 = P.X(n - half), x1 = P.X(n + half), y = P.Y(disp[n]);
        if (cur.den) {
          fig.rect(x0, y, x1 - x0, base - y, { fill: 'gold', alpha: 0.72 });
          if (mt > 0.01) fig.rect(x0, y, x1 - x0, base - y, { color: 'blue', width: 1.5, alpha: mt });
        }
        for (var s = 0; s < 5; s++) {
          var on = false;
          for (i = 0; i < 9; i++) if (OF[i] === s && btns[i].pressed) on = true;
          fig.circle(P.X(n + OFF[s]), P.Y(SER[s][n - 1]), rd, { fill: 'muted', alpha: on ? 0.95 : 0.3, ring: 'stage', ringWidth: 1 });
        }
        var ye = P.Y(12 * SIG[n] / 11);
        if (cur.den && Math.abs(y - ye) > 1.5) fig.line(P.X(n), y, P.X(n), ye, { color: 'red', width: narrow ? 2 : 2.5 });
        fig.line(P.X(n - 0.42), ye, P.X(n + 0.42), ye, { color: 'blue', width: narrow ? 2 : 2.6 });
      }
      // the strip: the gap mean(n) - e(n), on a scale about fifty times finer than the plot above
      var gm = 0;
      for (n = 1; n <= N; n++) gm = Math.max(gm, Math.abs(disp[n] - 12 * SIG[n] / 11));
      var dm = dmax.to(cur.den ? Math.max(0.5, 1.2 * gm) : 0.5).value;
      D.view.y0 = -dm; D.view.y1 = dm; D.update();
      D.hline(0, { color: 'blue', width: 2 });
      if (cur.den) for (n = 1; n <= N; n++) {
        var dg = disp[n] - 12 * SIG[n] / 11;
        if (Math.abs(D.Y(dg) - D.Y(0)) > 0.5) D.segment(n, 0, n, dg, { color: 'red', width: narrow ? 3 : 5 });
      }
      fig.text(narrow ? 'mean − e(n)' : 'mean − Eisenstein', D.box.l + 4, D.box.t + 2, { color: 'muted', size: 11, baseline: 'top' });
      fig.text('±' + fmt(dm, 2), D.box.l - 4, D.box.t + 2, { color: 'muted', size: 10, align: 'right', baseline: 'top' });
      var lg = fig.legend([{ color: 'muted', dot: true, text: narrow ? 'class' : 'one class' }, { color: 'gold', fill: true, alpha: 0.72, text: narrow ? 'mean' : 'weighted mean' },
        { color: 'blue', text: 'Eisenstein' + (narrow ? '' : ' series') }, cur.worst && cur.den ? { color: 'red', text: 'gap' } : null],
        { plane: P, x: b.l + 4, y: b.t + 18, dir: narrow ? 'row' : 'col', size: narrow ? 12 : 13 });
      var g = !cur.den ? 'no class' : cur.worst === 0 ? '0' : frac(cur.worst, 11 * cur.den);
      var rows = [['classes', cur.k + ' of 9'], [cur.eq ? 'weight sum' : 'mass', cur.den ? frac(cur.den, cur.eq ? 1 : 24) : '0'],
        ['largest gap', g, !cur.den ? 'muted' : cur.worst ? 'red' : 'blue']];
      if (narrow) fig.panel(rows, { plane: P, x: b.l + 4, y: lg.y + lg.h + 2, compact: true });
      else fig.panel(rows, { plane: P, at: 'auto', prefer: ['n', 'ne'], hint: 'hover a column to read it' });
    };
  }
});
