/* Zeros of the reciprocal Euler factors on the line Re s = 0, one column per factor. Left: 1 - p^(-s) for the first few
   primes, zeros 2 pi i k / log p; the only point shared by all is s = 0 (red ring), because the log p are linearly
   independent over Q. Right: 1 - q^(-d s) for closed points of degree d = 1..D over F_q, zeros 2 pi i k / (d log q);
   every point 2 pi i k / log q is shared by all factors (red rings). Far right: the annulus 1/q <= |w| <= 1, the image
   of the strip 0 <= Re s <= 1 under w = q^(-s); the zeros land on the d-th roots of unity, and every shared point
   lands on w = 1, whose red dot grows with the number of factors that vanish there. The zeros are teal, as the same
   columns are in chapter 13 (pc-euler-zeros); the column labels p and d stay gold. */
Kit.register('tg-strip-annulus', {
  tex: { p: 'p', d: 'd', q: 'q', nf: '\\text{number field: }1-p^{-s}', ff: '\\text{function field: }1-q^{-ds}', an: '\\text{annulus of }w=q^{-s}',
    nfS: '\\text{over }\\QQ', ffS: '\\text{over }\\FF_q', anS: 'w=q^{-s}' },
  init: function (fig) {
    var PR = [2, 3, 5, 7, 11], TAU = 2 * Math.PI;
    var np = fig.slider({ label: 'Primes', values: [1, 2, 3, 4, 5], value: 5, format: function (n) { return PR.slice(0, n).join(', '); } });
    var qs = fig.slider({ label: 'Field size', tex: 'q', values: [2, 3, 4, 5, 7, 8, 9], value: 2, format: function (v) { return 'q = ' + v; } });
    var ds = fig.slider({ label: 'Largest degree', tex: 'd', min: 1, max: 12, step: 1, value: 6 });
    var hs = fig.slider({ label: 'Height', min: 10, max: 120, step: 1, value: 40, format: function (v) { return '|Im s| ≤ ' + v; } });
    var cam = fig.follow(40, { tau: 0.12 });
    // three panels side by side: number field, function field, annulus
    var split = function (W) { var a = W < 560 ? 0.3 : 0.29, b = W < 560 ? 0.66 : 0.62; return [W * a, W * b]; };
    var pad = { t: 34, r: 6, b: 38, l: 36 };
    var NF = fig.plane({ x: [0, 1], y: [-40, 40], pad: pad, box: function (W, H) { return [0, 0, split(W)[0], H]; } });
    var FF = fig.plane({ x: [0, 1], y: [-40, 40], pad: pad, box: function (W, H) { var s = split(W); return [s[0] + 4, 0, s[1], H]; } });
    var AN = fig.plane({ x: [-1.25, 1.25], y: [-1.25, 1.25], equal: true, pad: { t: 40, r: 6, b: 64, l: 6 },
      box: function (W, H) { return [split(W)[1] + 4, 0, W, H]; } });

    /* One column of dots at heights 2 pi k / L for |height| <= H, in column c of n. */
    function column(P, c, n, L, H, color) {
      var x = (c + 0.5) / n, kmax = Math.floor(H * L / TAU), r = Kit.clamp(Math.min(P.box.h / (2 * H) * TAU / L, P.box.w / n) * 0.3, 1.4, fig.w < 560 ? 2.8 : 3.6);
      for (var k = -kmax; k <= kmax; k++) P.point(x, TAU * k / L, { color: color, r: r, ring: false });
    }
    function rowRing(P, y, n, alpha) {
      var b = P.box, py = P.Y(y), ctx = fig.ctx;
      ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(b.l + 2, py - 7, b.w - 4, 14, 7); else ctx.rect(b.l + 2, py - 7, b.w - 4, 14);
      fig.stroke({ color: 'red', width: 1.8, alpha: alpha }); ctx.stroke();
    }
    function frame(P, title, n, names, key, note) {
      var b = P.box, narrow = fig.w < 560;
      P.grid({ yStep: 10, xStep: 2 });
      P.axes({ edge: true, x: false, yStep: H() > 60 ? 20 : 10, size: 10.5 });
      fig.label(narrow ? title + 'S' : title, (b.l + b.r) / 2, 15, { anchor: 'c', color: 'fg', size: narrow ? 11.5 : 12.5 });
      for (var c = 0; c < n; c++) fig.text(names[c], b.l + (c + 0.5) / n * b.w, b.b + 15, { color: 'gold', size: n > 8 && fig.w < 560 ? 9 : 10.5, align: 'center' });
      fig.label(key, b.l - 4, b.b + 15, { anchor: 'e', color: 'muted', size: 11, id: 'k' + title });
      fig.text(note, (b.l + b.r) / 2, b.b + 32, { color: 'red', size: narrow ? 11 : 11.5, weight: 600, align: 'center' });
      if (!narrow) fig.text('Im s', b.l - 6, b.t - 8, { color: 'muted', size: 11, align: 'right' });
    }
    var H = function () { return cam.value; };

    return function draw() {
      var n = np.value, q = qs.value, D = ds.value, Hv = cam.to(hs.value).value, lq = Math.log(q), narrow = fig.w < 560;
      NF.view.y0 = FF.view.y0 = -Hv; NF.view.y1 = FF.view.y1 = Hv; NF.update(); FF.update();

      // number field: one column per prime
      frame(NF, 'nf', n, PR.slice(0, n), 'p', narrow ? 'shared: s = 0' : 'shared by all: only s = 0');
      NF.hline(0, { color: 'muted', width: 1, alpha: 0.6 });
      for (var c = 0; c < n; c++) column(NF, c, n, Math.log(PR[c]), Hv, 'teal');
      rowRing(NF, 0, n, 1);

      // function field: one column per degree
      var names = []; for (var d = 1; d <= D; d++) names.push(String(d));
      var kmax = Math.floor(Hv * lq / TAU), shared = 2 * kmax + 1;
      frame(FF, 'ff', D, names, 'd', narrow ? 'shared: ' + shared : 'shared by all: ' + shared + ' points in view');
      FF.hline(0, { color: 'muted', width: 1, alpha: 0.6 });
      for (var k = -kmax; k <= kmax; k++) rowRing(FF, TAU * k / lq, D, 1);
      for (c = 0; c < D; c++) column(FF, c, D, (c + 1) * lq, Hv, 'teal');

      // the annulus of w = q^(-s): the strip 0 <= Re s <= 1 maps onto 1/q <= |w| <= 1
      var A = AN, cx = A.X(0), cy = A.Y(0), r1 = A.X(1) - cx, r0 = r1 / q, ctx = fig.ctx;
      ctx.beginPath(); ctx.arc(cx, cy, r1, 0, TAU); ctx.arc(cx, cy, r0, 0, TAU, true);
      ctx.fillStyle = fig.color('muted', 0.12); ctx.fill();
      fig.circle(cx, cy, r1, { fill: false, ring: fig.color('muted'), ringWidth: 1.4 });
      fig.circle(cx, cy, r0, { fill: false, ring: fig.color('muted', 0.7), ringWidth: 1 });
      fig.label(narrow ? 'anS' : 'an', (A.box.l + A.box.r) / 2, 15, { anchor: 'c', color: 'fg', size: narrow ? 11.5 : 12.5 });
      var seen = {};
      for (d = 1; d <= D; d++) for (var j = 1; j < d; j++) {
        var g = (function gcd(a, b) { return b ? gcd(b, a % b) : a; })(j, d), key2 = (j / g) + '/' + (d / g);
        if (seen[key2]) continue; seen[key2] = 1;
        fig.circle(cx + r1 * Math.cos(-TAU * j / d), cy - r1 * Math.sin(-TAU * j / d), 3, { fill: 'teal', ring: 'stage', ringWidth: 1 });
      }
      var rr = 3 + 0.9 * D;
      fig.circle(cx + r1, cy, rr, { fill: 'red', ring: 'stage', ringWidth: 1.5 });
      if (!narrow) {
        fig.text('w = 1', cx + r1 - rr - 5, cy, { color: 'red', size: 11, align: 'right', baseline: 'middle', weight: 600 });
        fig.text('Re s = 0', cx, cy - r1 - 6, { color: 'muted', size: 10.5, align: 'center' });
        fig.text('Re s = 1', cx, cy - r0 - 6, { color: 'muted', size: 10.5, align: 'center' });
      }
      var lines = narrow ? ['all ' + shared + ' land', 'on w = 1'] : ['all ' + shared + ' shared points land on w = 1;', 'the zeros of degree d sit at', 'the d-th roots of unity'];
      var ob = A.outer.b, mid = (A.outer.l + A.outer.r) / 2;
      lines.forEach(function (s, i) { fig.text(s, mid, ob - 10 - (lines.length - 1 - i) * 14, { color: i < 1 || narrow ? 'red' : 'muted', size: 11, align: 'center', weight: i < 1 || narrow ? 600 : 500 }); });
    };
  }
});
