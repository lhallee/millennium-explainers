/* Z_p as the paths down a p-ary tree of residues, depth 0 (the root) to 5 (a band of p^5 leaf cells of width p^-5).
   A node at depth k is a residue class mod p^k, placed so that its subtree covers an interval of width p^-k: the
   leaf index reads the digits a_0 a_1 ... with a_0 most significant. The element x is a gold path; the ball
   x + p^k Z_p is a red subtree; the units (a_0 != 0) are shaded blue. Digits are exact: x = n/d is reduced modulo
   p^6 with a modular inverse of d. */
Kit.register('padic-tree', {
  tex: { Z2: '\\ZZ_2', Z3: '\\ZZ_3', Z5: '\\ZZ_5', U2: '\\ZZ_2^\\times', U3: '\\ZZ_3^\\times', U5: '\\ZZ_5^\\times',
    P2: '2\\ZZ_2', P3: '3\\ZZ_3', P5: '5\\ZZ_5' },
  init: function (fig) {
    var fmt = Kit.fmt, MINUS = fmt.minus, DEPTH = 5;
    var XS = { '0': [0, 1], '1': [1, 1], '-1': [-1, 1], '1/3': [1, 3], '-1/2': [-1, 2], '7': [7, 1], '600': [600, 1] };
    function inverse(a, m) {                                     // a^-1 mod m by the extended Euclidean algorithm
      var r0 = m, r1 = a, t0 = 0, t1 = 1;
      while (r1) { var q = Math.floor(r0 / r1), r = r0 - q * r1, t = t0 - q * t1; r0 = r1; r1 = r; t0 = t1; t1 = t; }
      if (r0 !== 1) throw new Error('padic-tree: ' + a + ' is not invertible mod ' + m);
      return ((t0 % m) + m) % m;
    }
    function mod(a, m) { return ((a % m) + m) % m; }
    /* The first DEPTH + 1 digits of n/d in Z_p, lowest first, or null when p divides d. */
    function digits(n, d, p) {
      if (d % p === 0) return null;
      var m = Math.pow(p, DEPTH + 1), r = mod(n, m) * inverse(mod(d, m), m) % m, out = [];
      for (var j = 0; j <= DEPTH; j++) { out.push(r % p); r = Math.floor(r / p); }
      return out;
    }
    function name(key) { return key.replace('-', MINUS); }
    /* Index of the depth-k node on the path, counting from the left: the digits a_0 ... a_(k-1), a_0 most significant. */
    function index(a, p, k) { var i = 0; for (var j = 0; j < k; j++) i = i * p + a[j]; return i; }
    /* The residue mod p^k of the depth-k node with index i. */
    function residue(i, p, k) { var r = 0; for (var j = k - 1; j >= 0; j--) { r += (i % p) * Math.pow(p, j); i = Math.floor(i / p); } return r; }

    var from = null, path = new Float64Array(DEPTH + 1), shown = new Float64Array(DEPTH + 1);
    var move = fig.tween(1);
    function retarget(animate) { from = animate ? Float64Array.from(shown) : null; move.set(0); move.to(1, 650, 'inOutCubic'); }
    var Ps = fig.select({ label: 'Prime', options: [['2', 'p = 2'], ['3', 'p = 3'], ['5', 'p = 5']], value: '2', onInput: function () { retarget(false); } });
    var Xs = fig.select({ label: 'Element', options: Object.keys(XS).map(function (k) { return [k, 'x = ' + name(k)]; }), value: '1/3',
      onInput: function () { retarget(true); } });
    var K = fig.slider({ label: 'Ball depth', min: 0, max: DEPTH, step: 1, value: 2, format: function (v) { return 'k = ' + v; } });
    var ballL = fig.follow(0), ballR = fig.follow(1), ballK = fig.follow(K.value);
    fig.onReset = function () { from = null; move.set(1); };

    var P = fig.plane({ x: [0, 1], y: [-DEPTH, 0], pad: { t: 56, r: 14, b: 50, l: 62 } });

    return function draw() {
      var p = Number(Ps.value), xk = Xs.value, q = XS[xk], a = digits(q[0], q[1], p), k = K.value;
      var ctx = fig.ctx, b = P.box, bandH = Kit.clamp(b.h * 0.08, 10, 18), yBand = P.Y(-DEPTH), bt = yBand - bandH / 2, bb = yBand + bandH / 2;
      var X = function (u) { return b.l + u * b.w; }, i, j, lv;

      // units: every subtree whose first digit is nonzero
      fig.rect(X(1 / p), P.Y(-1) - 10, X(1) - X(1 / p), bb - P.Y(-1) + 10, { fill: 'blue', alpha: 0.1 });

      // edges, level by level: lines while children are at least 3 px apart, filled fans below that
      for (lv = 0; lv < DEPTH; lv++) {
        var nPar = Math.pow(p, lv), gap = b.w / (nPar * p), y0 = P.Y(-lv), y1 = lv + 1 === DEPTH ? bt : P.Y(-lv - 1);
        ctx.beginPath();
        for (i = 0; i < nPar; i++) {
          var px = X((i + 0.5) / nPar);
          if (gap >= 3) for (j = 0; j < p; j++) { ctx.moveTo(px, y0); ctx.lineTo(X((i * p + j + 0.5) / (nPar * p)), y1); }
          else { ctx.moveTo(px, y0); ctx.lineTo(X((i + 0.04) / nPar), y1); ctx.lineTo(X((i + 0.96) / nPar), y1); ctx.closePath(); }
        }
        if (gap >= 3) { fig.stroke({ color: 'muted', width: 1, alpha: 0.75 }); ctx.stroke(); }
        else { ctx.fillStyle = fig.color('muted', 0.28); ctx.fill(); }
      }
      // nodes and their residues (depth 3 at most), where they fit
      for (lv = 0; lv < DEPTH; lv++) {
        var n = Math.pow(p, lv), sp = b.w / n;
        if (sp < 6) break;
        ctx.beginPath();
        for (i = 0; i < n; i++) { ctx.moveTo(X((i + 0.5) / n) + 3, P.Y(-lv)); ctx.arc(X((i + 0.5) / n), P.Y(-lv), 3, 0, 2 * Math.PI); }
        ctx.fillStyle = fig.color('muted'); ctx.fill();
        if (lv >= 1 && lv <= 3 && sp >= fig.measure(String(Math.pow(p, lv) - 1), 10.5, 500, true) + 10) {
          for (i = 0; i < n; i++) {
            var s = String(residue(i, p, lv)), tw = fig.measure(s, 10.5, 500, true), cx = X((i + 0.5) / n) + 5, cy = P.Y(-lv) - 7;
            fig.rect(cx - 1, cy - 9, tw + 2, 11, { fill: 'stage', alpha: 0.85 });
            fig.text(s, cx, cy, { color: 'fg', size: 10.5, mono: true });
          }
        }
      }
      // the band of leaves: p^5 cells, each of width p^-5
      var cells = Math.pow(p, DEPTH), cw = b.w / cells;
      fig.rect(b.l, bt, b.w, bandH, { fill: 'muted', alpha: 0.18, color: 'muted', width: 1 });
      if (cw >= 3) { ctx.beginPath(); for (i = 1; i < cells; i++) { ctx.moveTo(X(i / cells), bt); ctx.lineTo(X(i / cells), bb); } fig.stroke({ color: 'muted', width: 1, alpha: 0.6 }); ctx.stroke(); }
      fig.line(X(1 / p), bt - 4, X(1 / p), bb + 4, { color: 'blue', width: 1.5 });

      // row names: the modulus of each level
      fig.label('Z' + p, b.l - 10, P.Y(0), { anchor: 'e', color: 'fg', size: 14 });
      for (lv = 1; lv <= DEPTH; lv++) fig.text('mod ' + fmt(Math.pow(p, lv), { sep: false }), b.l - 10, P.Y(-lv) + 4, { color: 'muted', size: 10.5, align: 'right' });

      // measure labels under the band
      var narrow = b.w < 420, ly = bb + 15;
      fig.label('P' + p, X(0.5 / p), ly, { anchor: 'c', color: 'fg', size: 13 });
      fig.text(narrow ? '1/' + p : 'measure 1/' + p, X(0.5 / p), ly + 19, { color: 'muted', size: 11.5, align: 'center' });
      fig.label('U' + p, X((1 + 1 / p) / 2), ly, { anchor: 'c', color: 'blue', size: 13 });
      fig.text((narrow ? '' : 'units, measure ') + '1 ' + MINUS + ' 1/' + p + ' = ' + (p - 1) + '/' + p, X((1 + 1 / p) / 2), ly + 19, { color: 'blue', size: 11.5, align: 'center' });

      // readout
      var mk = Math.pow(p, k), meas = 'measure ' + p + fmt.sup(-k) + ' = ' + (k ? '1/' + fmt(mk, { sep: false }) : '1');
      if (!a) {
        fig.mathText([name(xk) + ' is not in ', { tex: 'Z' + p }, ': ' + p + ' divides its denominator'], 8, 18, { size: 13 });
        fig.text('a ball at depth k: ' + meas, 8, 42, { color: 'red', size: 12.5, weight: 600, mono: true });
        return;
      }
      fig.mathText([name(xk) + ' in ', { tex: 'Z' + p }, ':  ' + a.join(' ') + ' …'], 8, 18, { size: 13, mono: true });
      var res = 'x mod ' + p + fmt.sup(k) + ' = ' + residue(index(a, p, k), p, k);
      fig.text(res, 8, 42, { color: 'fg', size: 12.5, mono: true });
      fig.text(meas, Math.max(8 + fig.measure(res, 12.5, 500, true) + 18, fig.w - 8 - fig.measure(meas, 12.5, 600, true)), 42, { color: 'red', size: 12.5, weight: 600, mono: true });

      // the ball x + p^k Z_p as a subtree, its edges following the slider
      var L = ballL.to(index(a, p, k) / mk).value, R = ballR.to((index(a, p, k) + 1) / mk).value, kk = ballK.to(k).value;
      var ay = Math.min(P.Y(-kk), bt), ax = X((L + R) / 2);
      ctx.beginPath(); ctx.moveTo(ax, ay - 6);
      ctx.lineTo(X(R) + 2, Math.max(ay, bt)); ctx.lineTo(X(R) + 2, bb + 3); ctx.lineTo(X(L) - 2, bb + 3); ctx.lineTo(X(L) - 2, Math.max(ay, bt)); ctx.closePath();
      ctx.fillStyle = fig.color('red', 0.1); ctx.fill(); fig.stroke({ color: 'red', width: 2 }); ctx.stroke();

      // the gold path of x, sliding from the previous element when x changes
      for (lv = 0; lv <= DEPTH; lv++) {
        path[lv] = (index(a, p, lv) + 0.5) / Math.pow(p, lv);
        shown[lv] = from ? Kit.lerp(from[lv], path[lv], Kit.clamp(move.value * 1.6 - lv * 0.12, 0, 1)) : path[lv];
      }
      ctx.beginPath();
      for (lv = 0; lv <= DEPTH; lv++) ctx[lv ? 'lineTo' : 'moveTo'](X(shown[lv]), P.Y(-lv));
      fig.stroke({ color: 'gold', width: 3 }); ctx.stroke();
      fig.rect(X(shown[DEPTH]) - Math.max(cw, 3) / 2, bt, Math.max(cw, 3), bandH, { fill: 'gold' });
      for (lv = 0; lv < DEPTH; lv++) fig.circle(X(shown[lv]), P.Y(-lv), 4.5, { fill: 'gold', ring: 'stage', ringWidth: 1.5 });
    };
  }
});
