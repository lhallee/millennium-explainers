/* The zeros 2 pi i k / log p of the Euler factors 1 - p^{-s} on the imaginary axis, one column per selected prime
   (all on Re s = 0, drawn side by side). They meet only at s = 0. The closest pair of zeros of different primes in view
   is joined in red, and an inset magnifies it so that the gap, too small to see at full scale, is visible. */
Kit.register('pc-euler-zeros', {
  tex: { im: '\\operatorname{Im} s', s0: 's=0' },
  init: function (fig) {
    var fmt = Kit.fmt, PR = [2, 3, 5, 7, 11, 13], TWO_PI = 2 * Math.PI;
    var on = PR.map(function (p) { return fig.toggle({ label: 'p = ' + p, value: p === 2 || p === 3 }); });
    var Hs = fig.slider({ label: 'Height', min: 20, max: 2000, scale: 'log', step: 1, value: 120, marks: [120, 480, 1320],
      format: function (v) { return '|Im s| ≤ ' + fmt(v); } });
    var cam = fig.follow(Math.log(120), { tau: 0.12 });
    var mainR = function (w) { return w < 560 ? w : Math.round(0.66 * w); };
    var P = fig.plane({ x: [0, 1], y: [-120, 120], pad: { t: 26, r: 10, b: 12, l: 54 }, box: function (w, h) { return [0, 0, mainR(w), h]; } });
    var Z = fig.plane({ x: [0, 1], y: [-1, 1], pad: { t: 30, r: 16, b: 34, l: 16 }, box: function (w, h) { return [mainR(w), 0, w, h]; } });
    var best = null, bestKey = '';

    /* Closest pair (smallest height difference) of positive zeros of different selected primes up to height H. */
    function closest(sel, H) {
      var key = sel.join(',') + '|' + Math.round(H * 100);
      if (key === bestKey) return best;
      bestKey = key; best = null;
      for (var a = 0; a < sel.length; a++) for (var b = a + 1; b < sel.length; b++) {
        var Lp = Math.log(sel[a]), Lq = Math.log(sel[b]);
        for (var k = 1; TWO_PI * k / Lp <= H; k++) {
          var hp = TWO_PI * k / Lp, k2 = Math.round(hp * Lq / TWO_PI);
          if (k2 < 1 || TWO_PI * k2 / Lq > H) continue;
          var hq = TWO_PI * k2 / Lq, d = Math.abs(hp - hq);
          if (!best || d < best.gap) best = { gap: d, p: sel[a], k: k, hp: hp, q: sel[b], k2: k2, hq: hq };
        }
      }
      return best;
    }

    return function draw() {
      var ctx = fig.ctx, sel = PR.filter(function (p, i) { return on[i].value; }), n = sel.length, narrow = fig.w < 560;
      var H = Math.exp(cam.to(Math.log(Hs.value)).value);
      P.view.y0 = -H; P.view.y1 = H; P.update();
      // on a phone the columns keep to the left so the readout on the right covers none of them
      var b = P.box, sp = Math.min(54, (narrow ? 0.55 : 1) * b.w / (n + 1)), mx = narrow ? b.l + sp * Math.max(n - 1, 0) / 2 + 22 : (b.l + b.r) / 2, x0 = mx - sp * (n - 1) / 2;
      var colX = function (p) { return x0 + sp * sel.indexOf(p); };
      P.grid({ xStep: 10 });
      P.axes({ edge: true, x: false, size: 11 });
      fig.label('im', b.l - 6, b.t - 14, { anchor: 'e', color: 'muted', size: 12 });
      fig.line(mx, b.t, mx, b.b, { color: 'muted', width: 1, alpha: 0.35 });

      // One column per prime: dots at 2 pi k / log p, a solid band once they are closer than a pixel and a half.
      var pxPer = b.h / (2 * H);
      for (var c = 0; c < n; c++) {
        var p = sel[c], step = TWO_PI / Math.log(p), x = x0 + sp * c, gpx = step * pxPer, kM = Math.floor(H / step);
        fig.text(String(p), x, b.t - 12, { color: 'teal', size: 12, weight: 700, align: 'center', baseline: 'middle' });
        if (gpx < 1.5) { fig.line(x, b.t, x, b.b, { color: 'teal', width: 2.2, alpha: 0.35 + 0.4 * gpx / 1.5 }); continue; }
        var r = Kit.clamp(0.3 * gpx, 1, 3.6);
        ctx.fillStyle = fig.color('teal');
        ctx.beginPath();
        for (var k = -kM; k <= kM; k++) { if (k === 0) continue; var y = P.Y(k * step); ctx.moveTo(x + r, y); ctx.arc(x, y, r, 0, TWO_PI); }
        ctx.fill();
      }

      // s = 0: the one zero every factor shares.
      if (n) {
        var y0 = P.Y(0), half = sp * (n - 1) / 2 + 12;
        for (var j = 0; j < n; j++) fig.circle(x0 + sp * j, y0, 3.6, { fill: 'teal' });
        ctx.beginPath(); ctx.ellipse(mx, y0, half, 11, 0, 0, TWO_PI);
        fig.stroke({ color: 'red', width: 2 }); ctx.stroke();
        var lx = mx + half + 8, room = b.r - lx;
        if (room > 150) {
          fig.label('s0', lx, y0, { anchor: 'w', color: 'red', size: 12 });
          fig.text(', shared by every prime', lx + fig.labelSize('s0', 12).w, y0, { color: 'red', size: 12, baseline: 'middle' });
        }
        else fig.label('s0', mx, y0 + 14, { anchor: 'n', color: 'red', size: 11.5 });
      }

      // The closest pair in view, joined in red, with a magnified view of it beside the plot.
      var pr = n > 1 ? closest(sel, H) : null;
      if (pr) {
        var ya = P.Y(pr.hp), yb = P.Y(pr.hq), xa = colX(pr.p), xb = colX(pr.q);
        fig.line(xa, ya, xb, yb, { color: 'red', width: 2 });
        fig.circle(xa, ya, 5, { fill: false, ring: 'red', ringWidth: 1.6 }); fig.circle(xb, yb, 5, { fill: false, ring: 'red', ringWidth: 1.6 });
        fig.rect(Math.max(xa, xb) + 7, (ya + yb) / 2 - 9, fig.measure(fmt(pr.gap, 4), 12, 600, true) + 6, 18, { fill: 'stage', alpha: 0.85 });
        fig.text(fmt(pr.gap, 4), Math.max(xa, xb) + 10, (ya + yb) / 2, { color: 'red', size: 12, weight: 600, baseline: 'middle', mono: true });
      }
      if (!narrow) {
        var zb = Z.box, zx = (zb.l + zb.r) / 2;
        if (!pr) fig.text(n > 1 ? 'no pair in view' : 'select two primes', zx, (zb.t + zb.b) / 2, { color: 'muted', size: 12, align: 'center' });
        else {
          var mid = (pr.hp + pr.hq) / 2, span = 1.6 * pr.gap, Yz = function (h) { return (zb.t + zb.b) / 2 - (h - mid) / span * zb.h / 2; };
          var xl = zx - 0.22 * zb.w, xr = zx + 0.22 * zb.w;
          fig.rect(zb.l, zb.t, zb.w, zb.h, { color: 'muted', width: 1, alpha: 0.5 });
          fig.text('magnified ×' + fmt.sig((zb.h / span) / (b.h / H)), zb.l, zb.t - 12, { color: 'muted', size: 11.5, baseline: 'middle' });
          fig.line(xl, Yz(pr.hp), xr, Yz(pr.hp), { color: 'teal', width: 1, alpha: 0.5, dash: [3, 4] });
          fig.line(xl, Yz(pr.hq), xr, Yz(pr.hq), { color: 'teal', width: 1, alpha: 0.5, dash: [3, 4] });
          fig.arrow(zx, Yz(pr.hq), zx, Yz(pr.hp), { color: 'red', width: 1.6, head: 7 });
          fig.arrow(zx, Yz(pr.hp), zx, Yz(pr.hq), { color: 'red', width: 1.6, head: 7 });
          fig.circle(xl, Yz(pr.hp), 5, { fill: 'teal', ring: 'stage' }); fig.circle(xr, Yz(pr.hq), 5, { fill: 'teal', ring: 'stage' });
          fig.text(pr.p + ': ' + fmt(pr.hp, 4), xl, Yz(pr.hp) + (pr.hp > pr.hq ? -12 : 18), { color: 'teal', size: 11.5, align: 'center', mono: true });
          fig.text(pr.q + ': ' + fmt(pr.hq, 4), xr, Yz(pr.hq) + (pr.hq > pr.hp ? -12 : 18), { color: 'teal', size: 11.5, align: 'center', mono: true });
        }
      }
      fig.panel(pr ? (narrow ? [['height', fmt(pr.hp, 4)], ['gap', fmt(pr.gap, 4), 'red']] : [['p, k', pr.p + ', ' + pr.k], ["q, k'", pr.q + ', ' + pr.k2], ['height', fmt(pr.hp, 4)], ['gap', fmt(pr.gap, 4), 'red']])
        : [['closest pair', n > 1 ? 'none' : 'select two']], { plane: narrow ? P : Z, at: narrow ? (pr && pr.hp > 0.2 * H ? 'se' : 'ne') : 's', hint: 'closest pair in view' });
    };
  }
});
