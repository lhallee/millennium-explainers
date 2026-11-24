/* Chebyshev's budget (eq-cp-budget, t-cp-window, eq-cp-cheb-T). A nonzero integer N spends exactly log N on its prime
   factors, log p for each time p divides it. Left: one column per prime p up to the top of the window, stacked with
   one block of height log p for each time p divides N; a tick under the axis marks every prime, so a prime that does
   not divide N shows as a tick with no column. Right: the "primes" bar (the window's weight in gold, the other
   factors muted) and the "size" bar log N from log factorials, equal by eq-cp-budget.
   "C(2n, n)": N = binom(2n, n), whose exponent at p is sum_j (floor(2n/p^j) - 2 floor(n/p^j)), each term 0 or 1. The
   primes in (n, 2n] divide it exactly once and are gold, so theta(2n) - theta(n) <= log N < n log 4 (the dashed
   ceiling). "Chebyshev's 1852 number": N = T(x) = floor(x)! floor(x/30)! / (floor(x/2)! floor(x/3)! floor(x/5)!),
   whose exponent at p is sum_j nu(x/p^j) with nu(y) = floor(y) - floor(y/2) - floor(y/3) - floor(y/5) + floor(y/30).
   nu takes only the values 0 and 1 and is 1 on [1, 6), so the prime powers in (x/6, x] each divide once and are
   gold: psi(x) - psi(x/6) <= log T(x) = A x + O(log x), A = 0.92129. Its error changes sign, so no ceiling A x is
   drawn. In both modes no prime power dividing N exceeds the top of the window, so every column is at most log 2n
   (or log x) tall (the dotted line), the fact behind the lower bound.
   Self-checks: nu on one period, and at every state shown, the blocks add up to log N to 1e-8 and C(2n, n) < 4^n. */
Kit.register('chebyshev-budget', {
  tex: { n: 'n', x: 'x', win: '\\vartheta(2n)-\\vartheta(n)', logC: '\\log\\tbinom{2n}{n}', cap: 'n\\log 4',
    winP: '\\psi(x)-\\psi(x/6)', logT: '\\log T(x)', Ax: 'Ax', ratio: '\\psi(x)/x', top2n: '\\log 2n', topx: '\\log x',
    binN: '\\tbinom{2n}{n}', Tx: 'T(x)', vp: 'v_p(N)', wt: 'v_p(N)\\log p' },
  init: function (fig) {
    var fmt = Kit.fmt, NMAX = 100, XMAX = 600, LIM = Math.max(2 * NMAX, XMAX), LN4 = Math.log(4), LN10 = Math.log(10);
    var A = Math.log(2) / 2 + Math.log(3) / 3 + Math.log(5) / 5 - Math.log(30) / 30, i, j;
    // primes, log factorials, and psi up to LIM
    var comp = new Uint8Array(LIM + 1), P = [], lf = new Float64Array(LIM + 1), psi = new Float64Array(LIM + 1);
    for (i = 2; i * i <= LIM; i++) if (!comp[i]) for (j = i * i; j <= LIM; j += i) comp[j] = 1;
    for (i = 2; i <= LIM; i++) {
      if (!comp[i]) P.push(i);
      lf[i] = lf[i - 1] + Math.log(i);
      var q = i, p = 2; while (q % p) p++; while (q % p === 0) q /= p;
      psi[i] = psi[i - 1] + (q === 1 ? Math.log(p) : 0);
    }
    function nu(y) { return Math.floor(y) - Math.floor(y / 2) - Math.floor(y / 3) - Math.floor(y / 5) + Math.floor(y / 30); }
    for (i = 0; i < 30; i++) {                                // nu is constant on [i, i + 1): all five floors jump at integers
      var v0 = nu(i);
      if ((v0 !== 0 && v0 !== 1) || (i >= 1 && i < 6 && v0 !== 1)) throw new Error('chebyshev-budget: nu(' + i + ') = ' + v0);
    }

    var mode = fig.select({ label: 'Number', options: [['binom', 'The middle binomial coefficient'], ['cheb', 'Chebyshev\'s 1852 number']], value: 'binom' });
    var Ns = fig.slider({ label: 'Start of the window', tex: 'n', min: 2, max: NMAX, step: 1, value: 10 });
    var Xs = fig.slider({ label: 'End of the window', tex: 'x', min: 30, max: XMAX, step: 1, value: 60 });
    Xs.show(false);                                           // the binomial mode shows first, before any frame is drawn

    function compute(binom, v) {
      var top = binom ? 2 * v : v, lo = binom ? v : v / 6, cols = [], win = 0, tot = 0;
      for (var k = 0; k < P.length && P[k] <= top; k++) {
        var p = P[k], lp = Math.log(p), bl = [];
        for (var q = p; q <= top; q *= p) {
          var e = binom ? Math.floor(2 * v / q) - 2 * Math.floor(v / q) : nu(v / q);
          if (e !== 0 && e !== 1) throw new Error('chebyshev-budget: a term of the exponent at ' + q + ' is ' + e);
          if (e) { var g = binom ? q === p && p > lo : q > lo; bl.push(g); tot += lp; if (g) win += lp; }
        }
        cols.push({ p: p, lp: lp, bl: bl });
      }
      var logN = binom ? lf[2 * v] - 2 * lf[v]
        : lf[v] + lf[Math.floor(v / 30)] - lf[Math.floor(v / 2)] - lf[Math.floor(v / 3)] - lf[Math.floor(v / 5)];
      if (Math.abs(logN - tot) > 1e-8 * Math.max(1, logN)) throw new Error('chebyshev-budget: the prime factors of N do not add up to log N at ' + v);
      if (binom && !(logN < v * LN4)) throw new Error('chebyshev-budget: C(2n, n) is not below 4^n at n = ' + v);
      var fac = [], exact = 1;
      cols.forEach(function (c) { if (c.bl.length) { fac.push(c.p + (c.bl.length > 1 ? fmt.sup(c.bl.length) : '')); exact *= Math.pow(c.p, c.bl.length); } });
      return { binom: binom, v: v, top: top, lo: lo, cols: cols, win: win, logN: logN, cap: v * LN4,
        fac: fac.join(' · '), value: logN < 36 ? exact : 0, digits: Math.floor(logN / LN10) + 1 };
    }
    var cur = null, key = '';

    // Layout: the bars take a fixed width on the right, measured from the ceiling's label
    var capW = fig.labelSize('cap', 12).w;
    var right = function (w) { return w < 560 ? 30 + 6 + 24 + 12 + 24 + 6 + capW + 6 : 32 + 12 + 40 + 26 + 40 + 8 + capW + 10; };
    var L = fig.plane({ x: [0, 22], y: [0, 4], pad: { t: 34, r: 10, b: 26, l: 30 }, box: function (w, h) { return [0, 0, w - right(w), h]; } });
    var B = fig.plane({ x: [0, 1], y: [0, 15], pad: { t: 34, r: 0, b: 26, l: 30 }, box: function (w, h) { return [w - right(w), 0, w, h]; } });
    var Lx = fig.follow(22, { tau: 0.1 }), Ly = fig.follow(4, { tau: 0.1 }), By = fig.follow(15, { tau: 0.1 });

    fig.probe({ plane: L, crosshair: false,
      snap: function (x) {
        if (!cur) return null;
        var best = null, bd = Math.max(0.8, 7 / L.sx);
        cur.cols.forEach(function (c) { var d = Math.abs(c.p - x); if (d < bd) { bd = d; best = c; } });
        return best ? [best.p, best.bl.length * best.lp] : null;
      },
      rows: function (x, y, pr) {
        if (!cur || !pr.snapped) return null;
        var c = null; cur.cols.forEach(function (cc) { if (cc.p === x) c = cc; });
        var gold = c.bl.some(function (g) { return g; });
        return [['p', fmt(c.p)], [{ tex: 'vp' }, fmt(c.bl.length)], [{ tex: 'wt' }, fmt(c.bl.length * c.lp, 3), gold ? 'gold' : 'muted']];
      } });

    return function draw() {
      var binom = mode.value === 'binom', v = binom ? Ns.value : Xs.value, narrow = fig.w < 560, TS = narrow ? 10.5 : 11.5;
      Ns.show(binom); Xs.show(!binom);
      var k = mode.value + v;
      if (k !== key) { key = k; cur = compute(binom, v); }
      var c = cur, top = c.top, ltop = Math.log(top);

      // Top line: what N is
      var hk = binom ? 'binN' : 'Tx', room = fig.w - 12 - fig.labelSize(hk, 13).w, full = ' = ' + fmt(c.value) + ' = ' + c.fac, rest;
      if (c.value && fig.measure(full, 13, 500) <= room) rest = full;
      else if (fig.measure(' = ' + c.fac, 13, 500) <= room) rest = ' = ' + c.fac;
      else rest = ', a number of ' + fmt(c.digits) + ' digits';
      fig.mathText([{ tex: hk }, rest], 4, 16, { size: 13 });

      // Left: one column per prime, one block of height log p for each time p divides N
      L.view.x0 = 0; L.view.x1 = Lx.to(top + Math.max(1, 0.03 * top)).value;
      // on a narrow stage the panel takes most of the plot's width, so the columns get more headroom below it
      L.view.y0 = 0; L.view.y1 = Ly.to((narrow ? 1.95 : 1.5) * ltop).value; L.update();
      var lb = L.box, y0 = L.Y(0);
      L.fillBetween(L.v.y1, 0, c.lo, top + 0.5, { color: 'gold', alpha: 0.08 });
      L.axes({ edge: true, size: 10.5 });
      L.hline(ltop, { color: 'muted', width: 1, dash: [2, 4] });
      fig.label(binom ? 'top2n' : 'topx', narrow ? lb.r : lb.l + 4, L.Y(ltop) - 3, { anchor: narrow ? 'se' : 'sw', color: 'muted', size: 12 });
      if (!narrow) {                          // the window's name at its right end, clear of the panel in the upper left
        var wl = binom ? 'window (n, 2n]' : 'window (x/6, x]', ww = fig.measure(wl, TS, 600), wx = Math.min(L.X(top) + 4, lb.r) - 4;
        fig.text(wl, wx, lb.t + 14, { color: 'gold', size: TS, weight: 600, align: 'right' });
        fig.occRect(wx - ww, lb.t, ww, 20);
      }
      var cw = Kit.clamp(0.7 * L.sx, 1.2, 14);
      c.cols.forEach(function (col) {
        var px = L.X(col.p);
        fig.line(px, y0 + 1, px, y0 + 5, { color: 'muted', width: 1 });
        var yy = y0, h = col.lp * L.sy;
        col.bl.forEach(function (g, n) {
          fig.rect(px - cw / 2, yy - h, cw, h, { fill: g ? 'gold' : 'muted', alpha: g ? 0.92 : 0.55 });
          if (n && h > 6 && cw > 3) fig.line(px - cw / 2, yy, px + cw / 2, yy, { color: 'stage', width: 1.5 });
          yy -= h;
        });
      });

      // Right: the two bars, equal by eq-cp-budget, and in the binomial mode the ceiling n log 4
      B.view.y1 = By.to(1.12 * (binom ? c.cap : c.logN) + 1).value; B.update();
      B.axes({ x: false, yAt: 'left', size: 10.5 });
      var bb = B.box, BW = narrow ? 24 : 40, GAP = narrow ? 12 : 26, x1 = bb.l + (narrow ? 6 : 12), x2 = x1 + BW + GAP, yb = B.Y(0);
      var hw = c.win * B.sy, ht = c.logN * B.sy;
      fig.rect(x1, yb - ht, BW, ht - hw, { fill: 'muted', alpha: 0.5 });
      fig.rect(x1, yb - hw, BW, hw, { fill: 'gold', alpha: 0.92 });
      fig.rect(x2, yb - ht, BW, ht, { fill: 'blue', alpha: 0.85 });
      fig.line(x1, yb - ht, x2 + BW, yb - ht, { color: 'fg', width: 1, dash: [3, 3], alpha: 0.6 });
      if (binom) {
        var yc = B.Y(c.cap);
        fig.line(x1 - 4, yc, x2 + BW + 4, yc, { color: 'blue', width: 1.6, dash: [6, 4] });
        fig.label('cap', x2 + BW + 6, yc, { anchor: 'w', color: 'blue', size: 12 });
      }
      fig.text('primes', x1 + BW / 2, bb.b + 16, { color: 'gold', size: TS, align: 'center', weight: 600 });
      fig.text('size', x2 + BW / 2, bb.b + 16, { color: 'blue', size: TS, align: 'center', weight: 600 });

      // a narrow stage keeps the two rows of the budget; the ceiling is labeled on the bars
      fig.panel(binom ? [
        [{ tex: 'win' }, fmt(c.win, 2), 'gold'],
        [{ tex: 'logC' }, fmt(c.logN, 2)],
        narrow ? null : [{ tex: 'cap' }, fmt(c.cap, 2), 'blue']
      ] : [
        [{ tex: 'winP' }, fmt(c.win, 2), 'gold'],
        [{ tex: 'logT' }, fmt(c.logN, 2)],
        narrow ? null : [{ tex: 'Ax' }, fmt(A * v, 2), 'blue'],
        narrow ? null : [{ tex: 'ratio' }, fmt(psi[v] / v, 4), 'gold']
      ], { plane: L, at: 'auto', prefer: ['nw', 'ne'], hint: 'hover a column to read it' });
    };
  }
});
