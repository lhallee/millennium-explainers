/* Chebotarev for x^3 - 2 over Q. Left: the primes 5 <= p < B as tiles colored by the number of roots of x^3 - 2
   mod p (3 gold, 1 blue, 0 teal), the first 200 when there are more. Right: the share of each class against the
   share of the matching conjugacy class of S_3 (1/6, 1/2, 1/3). The roots are exact: p = 2 mod 3 has one root,
   and p = 1 mod 3 has three when 2^((p-1)/3) = 1 mod p, else none (products below 10^12 are exact in doubles). */
Kit.register('ia-chebotarev-split', {
  tex: { t3: '\\dfrac16', t1: '\\dfrac12', t0: '\\dfrac13' },
  init: function (fig) {
    var M = Kit.math, fmt = Kit.fmt, LIM = 1000000, MAXT = 200;
    var COLORS = ['gold', 'blue', 'teal'], NAMES = ['3 roots', '1 root', 'no root'], SHORT = ['3 roots', '1 root', 'none'], TEX = ['t3', 't1', 't0'], TARGET = [1 / 6, 1 / 2, 1 / 3];
    var ps = null, cls = null, cum = null, ready = 0;        // primes >= 5, class index (0: 3 roots, 1: one, 2: none), prefix counts
    var T3 = [1, 0, 1, 0, 1, 0, 1, 1, 3, 0, 1, 3, 1, 1, 1];   // the chapter's table, 5 <= p < 60
    var CHECK = [13032, 39265, 26199];                       // the chapter's counts below 10^6

    function powmod(b, e, m) { var r = 1; b %= m; while (e > 0) { if (e & 1) r = (r * b) % m; b = (b * b) % m; e = Math.floor(e / 2); } return r; }
    function classOf(p) { return p % 3 === 2 ? 1 : powmod(2, (p - 1) / 3, p) === 1 ? 0 : 2; }
    function rootsDirect(p) { var n = 0; for (var x = 0; x < p; x++) if ((x * x * x - 2) % p === 0) n++; return n; }

    fig.job(M.sieveTask(LIM), { onDone: function () {
      var all = M.primes(LIM - 1), n = all.length - 2;
      ps = new Int32Array(n); cls = new Uint8Array(n); cum = new Int32Array(3 * (n + 1));
      for (var i = 0; i < n; i++) ps[i] = all[i + 2];
      fig.job(function* () {
        for (var i = 0; i < n; i++) {
          var c = classOf(ps[i]); cls[i] = c;
          for (var k = 0; k < 3; k++) cum[3 * (i + 1) + k] = cum[3 * i + k] + (k === c ? 1 : 0);
          ready = i + 1;
          if ((i & 1023) === 1023) yield i / n;
        }
        var bad = n !== 78496 || CHECK.some(function (v, k) { return cum[3 * n + k] !== v; });
        for (var j = 0; ps[j] < 60; j++) if ([3, 1, 0][cls[j]] !== T3[j] || rootsDirect(ps[j]) !== T3[j]) bad = true;
        if (bad) console.error('ia-chebotarev-split: counts differ from chapter 24');
      }, { budget: 2 });
    } });

    var B = fig.player({ label: 'Bound B', min: 10, max: LIM, scale: 'log', duration: 6, autoplay: true, value: 0, reduced: 1,
      format: function (v) { return 'B = ' + fmt(Math.round(v)); } });
    var split = fig.toggle({ label: 'Split by p mod 3', value: false });
    var P = fig.plane({ x: [0, 3], y: [0, 0.7], pad: { t: 26, r: 30, b: 40, l: 36 },
      box: function (w, h) { return [w < 560 ? 0.47 * w : 0.56 * w, 0, w, h]; } });

    function hatch(x0, y0, x1, y1, color) {               // diagonal lines over a bar segment
      var ctx = fig.ctx; ctx.save(); ctx.beginPath(); ctx.rect(x0, y0, x1 - x0, y1 - y0); ctx.clip();
      for (var d = -(y1 - y0); d < x1 - x0; d += 6) fig.line(x0 + d, y1, x0 + d + (y1 - y0), y0, { color: 'stage', width: 1.6, alpha: 0.9 });
      ctx.restore();
    }

    return function draw() {
      var w = fig.w, h = fig.h, narrow = w < 560, b = P.box, bound = B.mapped;
      var n = ps ? Kit.lowerBound(ps, Math.round(bound)) : 0, have = Math.min(n, ready), short = ps && have < n;
      var counts = cum ? [cum[3 * have], cum[3 * have + 1], cum[3 * have + 2]] : [0, 0, 0], tot = have;

      // tiles: the first primes of [5, B), as large as the area allows
      var gx = 10, gy = 12, gw = b.l - 40 - gx - (narrow ? -16 : 0), gh = h - gy - 34, nt = Math.min(have, MAXT), s = 46, cols = 1;
      while (s > 6) { cols = Math.max(1, Math.floor(gw / s)); if (Math.ceil(nt / cols) * s <= gh) break; s -= 1; }
      var ctx = fig.ctx;
      for (var k = 0; k < 3; k++) {                          // one path per class: fills, then outlines
        ctx.beginPath();
        for (var i = 0; i < nt; i++) if (cls[i] === k) ctx.rect(gx + (i % cols) * s + 1.5, gy + Math.floor(i / cols) * s + 1.5, s - 3, s - 3);
        ctx.globalAlpha = 0.28; ctx.fillStyle = fig.color(COLORS[k]); ctx.fill();
        ctx.globalAlpha = 1; fig.stroke({ color: COLORS[k], width: 1.2 }); ctx.stroke();
        if (split.value && k === 1) { ctx.beginPath(); for (i = 0; i < nt; i++) if (cls[i] === 1) { var hx = gx + (i % cols) * s, hy = gy + Math.floor(i / cols) * s; ctx.moveTo(hx + 3, hy + s - 3); ctx.lineTo(hx + s - 3, hy + 3); } fig.stroke({ color: 'blue', width: 1, alpha: 0.7 }); ctx.stroke(); }
      }
      ctx.globalAlpha = 1;
      var note = !ps ? 'counting primes: ' + Math.round(100 * M.sieveLimit() / LIM) + '%'
        : short ? 'classifying primes: ' + fmt(ready) + ' of ' + fmt(ps.length)
        : (have > MAXT ? 'first ' + MAXT + ' of ' + fmt(have) + ' primes' : fmt(have) + (have === 1 ? ' prime' : ' primes')) + ', 5 ≤ p < ' + fmt(Math.round(bound));

      // bars: observed shares against the shares of the conjugacy classes
      P.grid({ yStep: 0.1, xTicks: [] });
      P.axes({ edge: true, x: false, yStep: 0.1, format: function (v) { return v.toFixed(1); } });
      fig.line(b.l, b.b + 0.5, b.r, b.b + 0.5, { color: 'muted', width: 1 });
      var X0 = [], X1 = [], YV = [], F = [];
      for (k = 0; k < 3; k++) {
        F[k] = tot ? counts[k] / tot : 0; X0[k] = P.X(k + (narrow ? 0.1 : 0.2)); X1[k] = P.X(k + (narrow ? 0.7 : 0.8));
        var yt = P.Y(F[k]), yg = P.Y(TARGET[k]); YV[k] = Math.min(yt, yg) - 7;
        if (tot) { fig.rect(X0[k], yt, X1[k] - X0[k], b.b - yt, { fill: COLORS[k], alpha: 0.85 }); if (split.value && k === 1) hatch(X0[k], yt, X1[k], b.b); }
        fig.line(X0[k] - 4, yg, X1[k] + 4, yg, { color: 'fg', width: 2, dash: [5, 3] });
        fig.label(TEX[k], X1[k] + (narrow ? 5 : 7), yg, { anchor: 'w', color: 'fg', size: narrow ? 11 : 13 });
      }
      // text grouped by font: each change of canvas font costs a style recalculation of the page
      var T = 11.5;                                         // the axes' font: one canvas font for all text while the player runs
      fig.text(note, gx + 1, h - 14, { color: 'muted', size: T });
      for (k = 0; k < 3; k++) {
        var cx = (X0[k] + X1[k]) / 2;
        fig.text((narrow ? SHORT : NAMES)[k], cx, b.b + 15, { color: COLORS[k], size: T, align: 'center' });
        if (!narrow) fig.text(fmt(counts[k]), cx, b.b + 31, { color: 'muted', size: T, align: 'center' });
        if (split.value) fig.text((k === 1 ? 'p ≡ 2' : 'p ≡ 1') + (narrow ? '' : ' mod 3'), cx, narrow ? b.b + 29 : b.t - 12, { color: 'fg', size: T, align: 'center' });
      }
      if (!narrow && !split.value) fig.text('dashed: share in S₃', b.r, b.t - 12, { color: 'muted', size: T, align: 'right' });
      if (tot) for (k = 0; k < 3; k++) fig.text(F[k].toFixed(narrow ? 2 : 4), (X0[k] + X1[k]) / 2, YV[k], { color: COLORS[k], size: T, align: 'center', mono: false });
      if (s >= 25) {                                         // one font for every tile: fig.text per tile costs a font check each
        fig.setFont(fig.font(s >= 34 ? 12 : s >= 29 ? 10.5 : 9.5, 500, true));
        ctx.fillStyle = fig.color('fg'); ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        for (i = 0; i < nt; i++) ctx.fillText(String(ps[i]), gx + (i % cols) * s + s / 2, gy + Math.floor(i / cols) * s + s / 2 + 0.5);
      }
    };
  }
});
