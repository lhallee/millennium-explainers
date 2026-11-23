/* Primes in the residue classes modulo q in {3, 4, 5, 8}, on a log x axis up to 10^6. Upper panel: each class's
   count minus its fair share, (pi(x;q,a) - Li(x)/phi(q)) / (sqrt(x)/log x); classes that are squares mod q in blue,
   the others in gold, so the Chebyshev bias shows as gold above blue. Lower panel: the race mod 4,
   Delta(x) = pi(x;4,3) - pi(x;4,1), against sqrt(x)/log x, with the stretches where Delta < 0 marked in red.
   Both panels are drawn per pixel column. Each class keeps, at each of its primes, the normalized count just before
   and just after the prime (between primes the count is flat and its fair share grows, so these are the extremes),
   with minima and maxima per block of 32 primes; a column is then two binary searches and a few block lookups. */
Kit.register('prime-race', {
  tex: { u: '\\bigl(\\pi(x;q,a)-\\Li(x)/\\varphi(q)\\bigr)\\big/\\bigl(\\sqrt{x}/\\log x\\bigr)', D: '\\Delta(x)=\\pi(x;4,3)-\\pi(x;4,1)',
    s: '\\sqrt{x}/\\log x', x: 'x', Dx: '\\Delta(x)' },
  init: function (fig) {
    var M = Kit.math, fmt = Kit.fmt, LIM = 1000000, QS = [3, 4, 5, 8], CLS = {}, ready = false, pr = null, runs = [], DT = null, B = 32;
    function gcd(a, b) { return b ? gcd(b, a % b) : a; }
    QS.forEach(function (q) {                                // the classes coprime to q, and which of them are squares
      var cl = [], sq = {};
      for (var a = 1; a < q; a++) { sq[a * a % q] = true; if (gcd(a, q) === 1) cl.push(a); }
      var idx = new Int8Array(q).fill(-1);
      cl.forEach(function (a, k) { idx[a] = k; });
      CLS[q] = { a: cl, idx: idx, sq: cl.map(function (a) { return Boolean(sq[a]); }), P: [], T: [], cache: { key: '', lo: null, hi: null } };
    });
    // Li on 4096 steps of log x from 10 to 10^6, interpolated linearly: off by under 0.07, far below a pixel.
    var NT = 4096, LN0 = Math.log(10), HT = (Math.log(LIM) - LN0) / NT, LiT = new Float64Array(NT + 1);
    function Li(x) {
      if (x < 10) return M.Li(x);
      var u = Math.min((Math.log(x) - LN0) / HT, NT - 1e-9), i = Math.floor(u);
      return LiT[i] + (u - i) * (LiT[i + 1] - LiT[i]);
    }
    function table(lo, hi) {                                 // block extremes: minima of lo, maxima of hi
      var nb = Math.ceil(lo.length / B), T = { lo: lo, hi: hi, bmin: new Float32Array(nb), bmax: new Float32Array(nb) };
      for (var k = 0; k < nb; k++) {
        var mn = Infinity, mx = -Infinity;
        for (var i = k * B, e = Math.min(lo.length, i + B); i < e; i++) { if (lo[i] < mn) mn = lo[i]; if (hi[i] > mx) mx = hi[i]; }
        T.bmin[k] = mn; T.bmax[k] = mx;
      }
      return T;
    }
    function query(T, a, b, out) {                           // extremes over the indices a..b, folded into out
      var i = a, k;
      for (; i <= b && i % B; i++) { if (T.lo[i] < out[0]) out[0] = T.lo[i]; if (T.hi[i] > out[1]) out[1] = T.hi[i]; }
      for (; i + B - 1 <= b; i += B) { k = i / B; if (T.bmin[k] < out[0]) out[0] = T.bmin[k]; if (T.bmax[k] > out[1]) out[1] = T.bmax[k]; }
      for (; i <= b; i++) { if (T.lo[i] < out[0]) out[0] = T.lo[i]; if (T.hi[i] > out[1]) out[1] = T.hi[i]; }
    }
    fig.job(M.sieveTask(LIM), { onDone: function () {
      fig.job(function* () {
        pr = M.primes(LIM);
        for (var t = 0; t <= NT; t++) { LiT[t] = M.Li(Math.exp(LN0 + t * HT)); if ((t & 1023) === 1023) yield; }
        var D = new Float32Array(pr.length), d = 0, start = 0, i;
        for (i = 0; i < pr.length; i++) {                     // Delta after each prime, and the stretches [start, end) with Delta < 0
          var was = d, m = pr[i] % 4;
          if (m === 3) d++; else if (m === 1) d--;
          D[i] = d;
          if (was >= 0 && d < 0) start = pr[i];
          if (was < 0 && d >= 0) runs.push([start, pr[i]]);
        }
        DT = table(D, D);
        yield;
        for (var qi = 0; qi < QS.length; qi++) {
          var q = QS[qi], C = CLS[q], nc = C.a.length, n = new Int32Array(nc), k;
          for (i = 0; i < pr.length; i++) { k = C.idx[pr[i] % q]; if (k >= 0) n[k]++; }
          var P = [], lo = [], hi = [];
          for (k = 0; k < nc; k++) { P.push(new Int32Array(n[k])); lo.push(new Float32Array(n[k])); hi.push(new Float32Array(n[k])); n[k] = 0; }
          for (i = 0; i < pr.length; i++) {
            var p = pr[i];
            k = C.idx[p % q];
            if (k < 0) continue;
            var L = Li(p) / nc, s = Math.log(p) / Math.sqrt(p), c = n[k]++;
            P[k][c] = p; lo[k][c] = (c - L) * s; hi[k][c] = (c + 1 - L) * s;
            if ((i & 16383) === 16383) yield;
          }
          C.P = P;
          for (k = 0; k < nc; k++) C.T.push(table(lo[k], hi[k]));
          yield;
        }
        ready = true;
      });
    } });
    function countAt(q, x, out) {                            // pi(x; q, a) for every class a, into out
      var C = CLS[q];
      for (var k = 0; k < C.a.length; k++) out[k] = Kit.upperBound(C.P[k], x);
    }

    var qSel = fig.select({ label: 'Modulus q', options: QS.map(function (q) { return [String(q), String(q)]; }), value: '4',
      onInput: function () { mix.set(0); mix.to(1, 600, 'inOutCubic'); } });
    var from = fig.slider({ label: 'From x', min: 10, max: 1e5, scale: 'log', value: 10, snap: [10, 100, 1e3, 1e4, 1e5],
      onInput: function (v) { if (to.value < 10 * v) to.set(10 * v); } });
    var to = fig.slider({ label: 'To x', min: 100, max: LIM, scale: 'log', value: LIM, snap: [100, 1e3, 1e4, 1e5, 1e6],
      onInput: function (v) { if (from.value > v / 10) from.set(v / 10); } });
    var showS = fig.toggle({ label: 'Show √x/log x', value: true });
    var mix = fig.tween(1), prevQ = 4, lastQ = 4, c0 = fig.follow(1), c1 = fig.follow(6);
    var yu0 = fig.follow(-3), yu1 = fig.follow(2), yl0 = fig.follow(-10), yl1 = fig.follow(170);
    fig.onReset = function () { c0.set(1); c1.set(6); mix.set(1); };

    var up = fig.plane({ x: [10, LIM], y: [-3, 2], xLog: true, box: [0, 0, 1, '52%'], pad: { t: 26, r: 64, b: 6, l: 44 } });
    var lo = fig.plane({ x: [10, LIM], y: [-10, 170], xLog: true, box: [0, '52%', 1, 1], pad: { t: 22, r: 64, b: 26, l: 44 } });
    var dc = { key: '', lo: null, hi: null }, cnt = new Int32Array(4), out = [0, 0];
    function rows(x) {
      var q = Number(qSel.value), C = CLS[q], n = Math.round(x), r = [[{ tex: 'x' }, fmt(n)]];
      if (!ready) return r;
      countAt(q, n, cnt);
      for (var k = 0; k < C.a.length; k++) r.push([C.a[k] + ' mod ' + q, fmt(cnt[k]), C.sq[k] ? 'blue' : 'gold']);
      countAt(4, n, cnt);
      r.push([{ tex: 'Dx' }, fmt.signed(cnt[1] - cnt[0]), cnt[1] < cnt[0] ? 'red' : 'fg']);
      return r;
    }
    fig.probe({ plane: up, rows: rows });
    fig.probe({ plane: lo, rows: rows });

    // Column edges, shared by the sweeps: edge[c] is the left end of column c. While the window glides, columns are
    // two pixels wide (step 2), which halves the work; once it rests they are one pixel wide again.
    var edge = new Float64Array(0), ptr = new Int32Array(4), cols = 0, step = 1;
    function edges(key, st) {
      cols = Math.floor(up.box.w); step = st;
      if (edge.length < cols + 1) edge = new Float64Array(cols + 1);
      for (var c = 0; c <= cols; c += step) edge[c] = up.wx(c);
      if (cols % step) edge[cols] = up.wx(cols);
    }
    function sweep(q, key) {                                 // per-column extremes of each class's normalized count
      var C = CLS[q], ch = C.cache, nc = C.a.length, k, c;
      if (ch.key === key) return ch;
      if (!ch.lo || ch.lo.length < nc * cols) { ch.lo = new Float32Array(nc * cols); ch.hi = new Float32Array(nc * cols); }
      var xa = edge[0], La = Li(xa) / nc, sa = Math.log(xa) / Math.sqrt(xa);
      for (k = 0; k < nc; k++) ptr[k] = Kit.upperBound(C.P[k], xa);
      for (c = 0; c < cols; c += step) {
        var xb = edge[Math.min(c + step, cols)], Lb = Li(xb) / nc, sb = Math.log(xb) / Math.sqrt(xb);
        for (k = 0; k < nc; k++) {
          var P = C.P[k], i0 = ptr[k], i1 = i0, va = (i0 - La) * sa;
          while (i1 < P.length && P[i1] <= xb) i1++;
          var vb = (i1 - Lb) * sb;
          out[0] = Math.min(va, vb); out[1] = Math.max(va, vb);
          if (i1 > i0) query(C.T[k], i0, i1 - 1, out);
          for (var j = c; j < c + step && j < cols; j++) { ch.lo[j * nc + k] = out[0]; ch.hi[j * nc + k] = out[1]; }
          ptr[k] = i1;
        }
        xa = xb; La = Lb; sa = sb;
      }
      ch.key = key;
      return ch;
    }
    function sweepDelta(key) {                               // per-column extremes of Delta(x)
      if (dc.key === key) return dc;
      if (!dc.lo || dc.lo.length < cols) { dc.lo = new Float32Array(cols); dc.hi = new Float32Array(cols); }
      var i0 = Kit.upperBound(pr, edge[0]);
      for (var c = 0; c < cols; c += step) {
        var xb = edge[Math.min(c + step, cols)], i1 = i0, d0 = i0 > 0 ? DT.lo[i0 - 1] : 0;
        while (i1 < pr.length && pr[i1] <= xb) i1++;
        out[0] = d0; out[1] = d0;
        if (i1 > i0) query(DT, i0, i1 - 1, out);
        for (var j = c; j < c + step && j < cols; j++) { dc.lo[j] = out[0]; dc.hi[j] = out[1]; }
        i0 = i1;
      }
      dc.key = key;
      return dc;
    }
    var DASH = [null, [10, 6], [5, 2]];
    function drawClasses(q, alpha, labels) {
      var C = CLS[q], ch = sweep(q, key), nc = C.a.length, b = up.box, ends = [], ng = 0, nb = 0;
      for (var k = 0; k < nc; k++) {
        var dash = DASH[C.sq[k] ? nb++ : ng++], color = C.sq[k] ? 'blue' : 'gold';
        up.columns(function (xa, xb, o, c) {                 // a dashed class skips columns: dash = [period, drawn]
          if (dash && c % dash[0] >= dash[1]) return;
          o[0] = ch.lo[c * nc + k]; o[1] = ch.hi[c * nc + k];
        }, { color: color, width: 1.8, alpha: alpha });
        var last = (Math.floor(b.w) - 1) * nc + k;
        ends.push({ y: up.Y((ch.lo[last] + ch.hi[last]) / 2), text: C.a[k] + ' mod ' + q, color: color });
      }
      if (!labels) return;
      ends.sort(function (p, r) { return p.y - r.y; });
      for (var i = 1; i < ends.length; i++) ends[i].y = Math.max(ends[i].y, ends[i - 1].y + 14);
      ends.forEach(function (e) { fig.text(e.text, b.r + 6, Kit.clamp(e.y, b.t, b.b + 4), { color: e.color, size: 11.5, baseline: 'middle', alpha: alpha }); });
    }
    var key = '';

    return function draw() {
      var q = Number(qSel.value);
      if (q !== lastQ) { prevQ = lastQ; lastQ = q; }
      var u0 = c0.to(Math.log10(from.value)).value, u1 = c1.to(Math.log10(to.value)).value;
      up.view.x0 = lo.view.x0 = Math.pow(10, u0); up.view.x1 = lo.view.x1 = Math.pow(10, Math.max(u1, u0 + 0.5));
      up.update(); lo.update();
      var gliding = c0.active || c1.active;
      key = up.v.x0.toPrecision(9) + '|' + up.v.x1.toPrecision(9) + '|' + Math.floor(up.box.w) + '|' + (gliding ? 2 : 1);
      var b = up.box, l = lo.box, narrow = fig.w < 520;
      if (ready) {                                            // windows that follow the data in view
        if (CLS[q].cache.key !== key || dc.key !== key || (prevQ !== q && mix.value < 1 && CLS[prevQ].cache.key !== key)) edges(key, gliding ? 2 : 1);
        var ch = sweep(q, key), n = Math.floor(b.w) * CLS[q].a.length, mn = 0, mx = 0, dmin = 0, dmax = 1, i;
        for (i = 0; i < n; i++) { mn = Math.min(mn, ch.lo[i]); mx = Math.max(mx, ch.hi[i]); }
        sweepDelta(key);
        for (i = 0; i < Math.floor(l.w); i++) { dmin = Math.min(dmin, dc.lo[i]); dmax = Math.max(dmax, dc.hi[i]); }
        if (showS.value) dmax = Math.max(dmax, Math.sqrt(lo.v.x1) / Math.log(lo.v.x1));
        var pu = 0.1 * (mx - mn), pl = 0.08 * (dmax - dmin);
        up.view.y0 = yu0.to(mn - pu).value; up.view.y1 = yu1.to(mx + pu).value;
        lo.view.y0 = yl0.to(dmin - pl).value; lo.view.y1 = yl1.to(dmax + pl).value;
        up.update(); lo.update();
      }

      up.grid(); up.axes({ edge: true, x: false });
      up.hline(0, { color: 'muted', width: 1.2 });
      fig.label('u', b.l + 4, b.t - 4, { anchor: 'sw', color: 'muted', size: narrow ? 11 : 12.5 });
      lo.grid(); lo.axes({ edge: true, xLabel: 'x' });
      lo.hline(0, { color: 'muted', width: 1 });
      if (!ready) { fig.text('counting primes…', b.r - 8, b.b - 10, { color: 'muted', align: 'right', size: 12 }); return; }

      if (mix.value < 1 && prevQ !== q) drawClasses(prevQ, 1 - mix.value, false);
      drawClasses(q, mix.value, true);
      if (!narrow) fig.legend([{ color: 'gold', text: 'non-squares mod ' + q }, { color: 'blue', text: 'squares mod ' + q }],
        { plane: up, dir: 'row', size: 12.5, prefer: ['se', 'sw', 'ne'] });

      // Lower panel: the stretches with Delta < 0, the scale, the lead.
      var first = null;
      runs.forEach(function (r) {
        var x0 = lo.X(r[0]), x1 = Math.max(lo.X(r[1]), x0 + 2);
        if (x1 < l.l || x0 > l.r) return;
        fig.rect(x0 - 0.5, l.t, x1 - x0 + 1, l.h, { fill: 'red', alpha: 0.35 });
        if (!first) first = r;
      });
      if (showS.value) lo.plot(function (x) { return Math.sqrt(x) / Math.log(x); }, { color: 'blue', width: 2 });
      lo.columns(function (xa, xb, o, c) { o[0] = dc.lo[c]; o[1] = dc.hi[c]; }, { color: 'gold', width: 1.8 });
      lo.columns(function (xa, xb, o, c) { if (dc.lo[c] < 0) { o[0] = dc.lo[c]; o[1] = Math.min(dc.hi[c], 0); } }, { color: 'red', width: 2.4 });
      if (first) {
        var fx = lo.X(first[0]), right = fx < l.l + 0.6 * l.w;
        fig.text((narrow ? 'Δ < 0 at ' : 'Δ < 0 from x = ') + fmt(first[0]), fx + (right ? 6 : -6), l.t - 6, { color: 'red', size: narrow ? 11 : 12, align: right ? 'left' : 'right' });
      }
      fig.legend([{ color: 'gold', tex: narrow ? 'Dx' : 'D' }, showS.value && { color: 'blue', tex: 's' }],
        { plane: lo, id: 'lower', dir: 'col', size: narrow ? 11.5 : 12.5, at: 'nw' });
    };
  }
});
