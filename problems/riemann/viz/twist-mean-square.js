/* Prime sums twisted by Legendre symbols of many auxiliary primes. Left: S_q(y) / sqrt(y), with
   S_q(y) = sum_{n <= y} Lambda(n) (n/q), for each of the 221 primes q = 3 mod 8 in [100,000, 110,000], on 100 <= y <= 5,000
   (log axis); the selected q in gold, the band |S| <= 4 sqrt(y) in blue. The 221 curves are rasterized once per box
   size into an offscreen image whose opacity counts how many curves cross each pixel, so dragging costs one drawImage.
   Right: the histogram of S_q(y0) / sqrt(y0) over the 221 primes at the cursor, with the normal curve of the same root
   mean square. The untwisted psi(y) / sqrt(y), about sqrt(y), is off the scale and is printed at the top. The symbols
   (p/q) of the 669 primes p <= 5,000 (so of all 711 prime powers, by multiplicativity) are computed in a job; the
   chapter's statistics are then compared and a mismatch is logged. */
Kit.register('twist-mean-square', {
  tex: { y: 'y', Sq: 'S_{\\mathsf q}(y)/\\sqrt{y}', band: '\\lvert S_{\\mathsf q}\\rvert\\le 4\\sqrt{y}', psi: '\\psi(y)/\\sqrt{y}', q: '\\mathsf q' },
  init: function (fig) {
    var M = Kit.math, fmt = Kit.fmt, Y0 = 100, Y1 = 5000, V = 9, QS = [], i;
    for (var q = 100003; q <= 110000; q += 8) { var ok = true; for (var d = 3; d * d <= q; d += 2) if (q % d === 0) { ok = false; break; } if (ok) QS.push(q); }
    var NQ = QS.length;
    var Y = fig.slider({ label: 'Cutoff', tex: 'y', min: Y0, max: Y1, scale: 'log', value: 1000, marks: [1000, 2000, 5000], snap: [1000, 2000, 5000],
      format: function (v) { return 'y = ' + fmt(Math.round(v)); } });
    var Q = fig.slider({ label: 'Auxiliary prime', values: QS, value: 100003, format: function (v) { return 'q = ' + fmt(v); } });

    // The data: prime powers n <= 5,000, and for each q the running sums of Lambda(n) (n/q), row by row.
    var D = null;
    function jacobi(a, n) {                                            // (a/n) for odd n > 0
      var t = 1; a %= n;
      while (a) { while (a % 2 === 0) { a /= 2; var r = n % 8; if (r === 3 || r === 5) t = -t; } var s = a; a = n; n = s; if (a % 4 === 3 && n % 4 === 3) t = -t; a %= n; }
      return n === 1 ? t : 0;
    }
    fig.job(M.sieveTask(Y1));
    var job = fig.job(function* () {
      while (M.sieveLimit() < Y1) yield 0;
      var ps = M.primes(Y1), pp = [];
      ps.forEach(function (p) { for (var k = 1, v = p; v <= Y1; v *= p, k++) pp.push([v, p, k]); });
      pp.sort(function (a, b) { return a[0] - b[0]; });
      var NP = pp.length, ns = new Float64Array(NP), lam = new Float64Array(NP), psi = new Float64Array(NP), cum = new Float64Array(NQ * NP);
      var sym = {}, j, acc = 0;
      for (j = 0; j < NP; j++) { ns[j] = pp[j][0]; lam[j] = Math.log(pp[j][1]); acc += lam[j]; psi[j] = acc; }
      for (i = 0; i < NQ; i++) {
        ps.forEach(function (p) { sym[p] = jacobi(p, QS[i]); });
        for (j = 0, acc = 0; j < NP; j++) { acc += lam[j] * (pp[j][2] % 2 ? sym[pp[j][1]] : 1); cum[i * NP + j] = acc; }
        if (i % 8 === 7) yield i / NQ;
      }
      D = { NP: NP, ns: ns, psi: psi, cum: cum };
      if (NQ !== 221 || NP !== 711) console.error('twist-mean-square: ' + NQ + ' primes q and ' + NP + ' prime powers; chapter says 221 and 711');
      [[1000, 2.648, 6.518], [2000, 2.692, 6.190], [5000, 2.655, 7.123]].forEach(function (c) {
        var s = stats(c[0]);
        if (Math.abs(s.rms - c[1]) > 6e-4 || Math.abs(s.max - c[2]) > 6e-4) console.error('twist-mean-square: at y = ' + c[0] + ' rms ' + s.rms + ' and max ' + s.max + ', chapter says ' + c[1] + ' and ' + c[2]);
        if (s.share < 0.136 - 5e-4 || s.share > 0.158 + 5e-4) console.error('twist-mean-square: share above 4 sqrt(y) at y = ' + c[0] + ' is ' + s.share);
      });
      if (Math.abs(value(0, 5000) - 4.279) > 6e-4) console.error('twist-mean-square: q = 100003 at y = 5000 gives ' + value(0, 5000) + ', chapter says 4.279');
    });
    function idx(y) { return Kit.upperBound(D.ns, y) - 1; }
    function value(qi, y) { var k = idx(y); return k < 0 ? 0 : D.cum[qi * D.NP + k] / Math.sqrt(y); }
    var vals = new Float64Array(NQ);
    function stats(y) {
      var s2 = 0, mx = 0, big = 0;
      for (var a = 0; a < NQ; a++) { var v = vals[a] = value(a, y); s2 += v * v; mx = Math.max(mx, Math.abs(v)); if (Math.abs(v) > 4) big++; }
      return { rms: Math.sqrt(s2 / NQ), max: mx, share: big / NQ };
    }

    var split = function (w) { return w < 560 ? 0.62 : 0.7; };
    var L = fig.plane({ x: [Y0, Y1], y: [-V, V], xLog: true, pad: { t: 30, r: 10, b: 26, l: 34 }, box: function (w, h) { return [0, 0, split(w) * w, h]; } });
    var H = fig.plane({ x: [0, 30], y: [-V, V], pad: { t: 30, r: 12, b: 26, l: 8 }, box: function (w, h) { return [split(w) * w, 0, w, h]; } });
    var hmax = fig.follow(20, { tau: 0.15 }), bins = new Float64Array(36);

    // The cloud of 221 curves, built a few curves per frame into ink per pixel (each curve spreads one unit over the
    // pixels it crosses in a column, so the vertical jumps at prime powers do not dominate), then painted in muted.
    var R = null, xs = new Float64Array(0), ys = new Float64Array(0), xKey = -1;
    function newRaster(bw, bh) {
      var cv = typeof OffscreenCanvas === 'function' ? new OffscreenCanvas(bw, bh) : document.createElement('canvas');
      cv.width = bw; cv.height = bh;
      var col = new Int32Array(bw), inv = new Float64Array(bw);
      for (var c = 0; c < bw; c++) { var y = L.toWorld(L.box.l + c + 0.5, 0)[0]; col[c] = idx(y); inv[c] = 1 / Math.sqrt(y); }
      return { w: bw, h: bh, cv: cv, counts: new Float32Array(bw * bh), col: col, inv: inv, next: 0, color: '', done: false };
    }
    function build(T, until) {
      while (T.next < NQ && performance.now() < until) {
        var base = T.next * D.NP, prev = -1;
        for (var c = 0; c < T.w; c++) {
          var k = T.col[c], v = k < 0 ? 0 : D.cum[base + k] * T.inv[c];
          var r = Kit.clamp(Math.round((V - v) / (2 * V) * (T.h - 1)), 0, T.h - 1), a = prev < 0 ? r : Math.min(prev, r), b = prev < 0 ? r : Math.max(prev, r);
          for (var rr = a, ink = 1 / (b - a + 1); rr <= b; rr++) T.counts[rr * T.w + c] += ink;   // one unit of ink per curve and column
          prev = r;
        }
        T.next++;
      }
      T.done = T.next >= NQ;
    }
    function paint(T) {
      var m = /^#([0-9a-f]{6})$/i.exec(fig.c.muted), hex = m ? parseInt(m[1], 16) : 0x8c97a6;
      if (!T.cv) { T.cv = typeof OffscreenCanvas === 'function' ? new OffscreenCanvas(T.w, T.h) : document.createElement('canvas'); T.cv.width = T.w; T.cv.height = T.h; }
      var ctx = T.cv.getContext('2d'), img = ctx.createImageData(T.w, T.h), px = img.data, st = parseInt((/^#([0-9a-f]{6})$/i.exec(fig.c.stage) || [0, 'fbfaf7'])[1], 16);
      var dark = (st >> 16) + ((st >> 8) & 255) + (st & 255) < 384;                 // the dark stage takes a denser cloud
      var top = dark ? 0.85 : 0.6, k = dark ? 0.5 : 0.35;
      for (var j = 0; j < T.counts.length; j++) {
        px[4 * j] = hex >> 16; px[4 * j + 1] = (hex >> 8) & 255; px[4 * j + 2] = hex & 255;
        px[4 * j + 3] = Math.round(255 * top * (1 - Math.exp(-k * T.counts[j])));
      }
      ctx.putImageData(img, 0, 0);
      T.color = fig.c.muted + fig.c.stage;
    }

    // Far from the window the kit releases the canvas; the painted image goes too, and is painted again from the
    // ink counts on return (a raster still being built is dropped and built again).
    fig.onRelease = function () { if (!R) return; if (R.pending) R.pending = null; if (R.done) { R.cv = null; R.color = ''; } else R = null; };
    return function draw() {
      var narrow = fig.w < 560, b = L.box, y0 = Y.value, qi = Kit.lowerBound(QS, Q.value), sz = narrow ? 10.5 : 11.5;
      L.grid({ yStep: 3 });
      L.fillBetween(4, -4, Y0, Y1, { color: 'blue', alpha: 0.1 });
      L.axes({ edge: true, xTicks: [100, 200, 500, 1000, 2000, 5000], yStep: 3, size: sz, xLabel: 'y' });
      L.hline(0, { color: 'muted', width: 1 });
      if (!D) { fig.text('computing Legendre symbols: ' + Math.round(100 * job.progress) + '%', b.l + 10, b.t + 18, { color: 'muted', size: 12 }); return; }

      var bw = Math.floor(b.w), bh = Math.floor(b.h);
      if (!R || ((R.w !== bw || R.h !== bh) && (!R.pending || R.pending.w !== bw || R.pending.h !== bh))) {
        var T = newRaster(bw, bh); if (R && R.done) R.pending = T; else R = T;
      }
      var work = R.pending || (R.done ? null : R);
      if (work) { build(work, performance.now() + 2); if (work.done && work === R.pending) R = work; else fig.more(); }
      if (R.done && R.color !== fig.c.muted + fig.c.stage) paint(R);
      if (R.done) { fig.ctx.imageSmoothingEnabled = true; fig.ctx.drawImage(R.cv, b.l, b.t, b.w, b.h); }
      L.hline(4, { color: 'blue', width: 1.2, alpha: 0.8 }); L.hline(-4, { color: 'blue', width: 1.2, alpha: 0.8 });

      // The selected prime as an exact curve, sampled per pixel column, and the cursor.
      if (xs.length !== bw || xKey !== b.l) {
        xs = new Float64Array(bw); ys = new Float64Array(bw); xKey = b.l;
        for (var c = 0; c < bw; c++) xs[c] = L.toWorld(b.l + c + 0.5, 0)[0];
      }
      for (c = 0; c < bw; c++) ys[c] = value(qi, xs[c]);
      L.path(xs, ys, { color: 'gold', width: 2.2 });
      L.vline(y0, { color: 'fg', width: 1, alpha: 0.5, dash: [3, 4] });
      var vq = value(qi, y0);
      L.point(y0, vq, { color: 'gold', r: 4.5 });
      var pk = idx(y0), ps = pk < 0 ? 0 : D.psi[pk] / Math.sqrt(y0);
      fig.arrow(L.X(y0), b.t + 18, L.X(y0), b.t + 3, { color: 'red', width: 1.6, head: 6 });
      fig.mathText([{ tex: 'psi', color: 'red' }, ' = ' + fmt(ps, 1) + (narrow ? '' : ' at the cursor, off the scale')], b.r, b.t - 13,
        { size: sz + 1, color: 'red', align: 'right' });
      if (!narrow) fig.label('Sq', b.l - 30, b.t - 13, { anchor: 'w', color: 'muted', size: 12.5 });
      // The histogram at y0, bins of width 0.5, the selected prime's bin in gold, the normal curve of the same rms.
      var s = stats(y0), top = 0, k;
      bins.fill(0);
      for (k = 0; k < NQ; k++) bins[Kit.clamp(Math.floor((vals[k] + V) * 2), 0, 35)]++;
      for (k = 0; k < 36; k++) top = Math.max(top, bins[k]);
      H.view.x1 = hmax.to(Math.max(10, top * 1.25)).value; H.update();
      H.fillBetween(4, -4, 0, H.v.x1, { color: 'blue', alpha: 0.1 });
      var qb = Kit.clamp(Math.floor((vq + V) * 2), 0, 35);
      for (k = 0; k < 36; k++) if (bins[k]) {
        var yt = H.Y(-V + (k + 1) / 2), yb = H.Y(-V + k / 2);
        fig.rect(H.X(0), yt + 0.5, H.X(bins[k]) - H.X(0), yb - yt - 1, { fill: k === qb ? 'gold' : 'muted', alpha: k === qb ? 0.9 : 0.55 });
      }
      fig.line(H.X(0), H.box.t, H.X(0), H.box.b, { color: 'muted', width: 1 });
      var gauss = [];
      for (k = 0; k <= 72; k++) { var v = -V + k / 4; gauss.push([NQ * 0.5 * Math.exp(-v * v / (2 * s.rms * s.rms)) / (s.rms * Math.sqrt(2 * Math.PI)), v]); }
      H.path(gauss, { color: 'blue', width: 1.6 });
      fig.panel([['rms', fmt(s.rms, 3)], ['max', fmt(s.max, 3)], narrow ? null : ['|S| > 4√y', fmt(100 * s.share, 1) + '%'], [{ tex: 'q' }, fmt(vq, 3), 'gold']],
        { plane: H, at: 'ne', compact: narrow, id: 'stats' });
    };
  }
});
