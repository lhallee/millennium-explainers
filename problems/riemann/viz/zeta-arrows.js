/* The arrows n^{-s} added head to tail. Left: the s-plane, where the reader drags s across the line sigma = 1. Right:
   the partial sums S_0 = 0, S_1, ..., S_N (gold), zeta(s) (blue), and the red circle of radius |N^{1-s}/(1-s)| around
   zeta(s), on which S_N sits by S_N = zeta(s) + N^{1-s}/(1-s) + O(N^{-sigma}). The sums are filled lazily, up to the
   current N and within 2 ms per frame, so a drag or a jump to N = 20,000 never stalls. */
Kit.register('zeta-arrows', {
  tex: { s: 's', zeta: '\\zeta(s)', gap: '\\lvert S_N-\\zeta(s)\\rvert', pred: '\\lvert N^{1-s}/(1-s)\\rvert',
    half: '\\tfrac12', sigma: '\\sigma' },
  init: function (fig) {
    var M = Kit.math, fmt = Kit.fmt, NMAX = 20000, ARROWS = 60, Z = Kit.zeros;
    var re = new Float64Array(NMAX + 1), im = new Float64Array(NMAX + 1);          // S_n, with S_0 = 0
    var x0 = new Float64Array(NMAX + 1), x1 = new Float64Array(NMAX + 1);          // bounding box of S_0 .. S_n
    var y0 = new Float64Array(NMAX + 1), y1 = new Float64Array(NMAX + 1);
    var filled = 0, key = '', zeta = [0, 0];
    var logN = Kit.scale('log', 1, NMAX);

    var play = fig.player({ label: 'Terms', min: 1, max: NMAX, scale: 'log', duration: 10, autoplay: true,
      reduced: logN.from(300), format: function (n) { return 'N = ' + fmt(Math.round(n)); } });
    var SP = fig.plane({ x: [0.1, 3], y: [-40, 40], pad: { t: 12, r: 10, b: 26, l: 34 },
      box: function (w, h) { return [0, 0, Kit.clamp(0.27 * w, 112, 250), h]; } });
    var ZP = fig.plane({ x: [-0.5, 1.5], y: [-1, 1], equal: true, pad: { t: 12, r: 14, b: 26, l: 46 },
      box: function (w, h) { return [Kit.clamp(0.27 * w, 112, 250), 0, w, h]; } });
    var s = fig.drag({ plane: SP, x: 2, y: 3, r: 7, color: 'fg', label: 's', labelAnchor: 'sw',
      constrain: function (x, y) {
        x = Kit.clamp(x, 0.1, 3); y = Kit.clamp(y, -40, 40);
        if (Math.abs(SP.X(x) - SP.X(1)) < 6) x = 1;                               // snap onto sigma = 1 and sigma = 1/2
        else if (Math.abs(SP.X(x) - SP.X(0.5)) < 6) {
          x = 0.5;
          for (var i = 0; i < Z.length && Z[i] < 40; i++) if (Math.abs(SP.Y(Math.abs(y)) - SP.Y(Z[i])) < 6) y = y < 0 ? -Z[i] : Z[i];
        }
        if (Math.hypot(x - 1, y) < 0.05) y = y < 0 ? -0.05 : 0.05;                 // the pole: keep |1 - s| away from 0
        return [x, y];
      } });
    function preset(label, x, y) {
      fig.button({ label: label, onClick: function () {
        s.set(x, y);
        if (Kit.reducedMotion) play.set(logN.from(300)); else { play.set(0); play.play(); }
      } });
    }
    preset('s = 2 + 3i', 2, 3); preset('s = 1 + i', 1, 1); preset('s = ½', 0.5, 0); preset('s = ½ + 14.13i', 0.5, Z[0]);
    var cx = fig.follow(0.5), cy = fig.follow(0), lw = fig.follow(0), lh = fig.follow(0);

    /* Extend the partial sums of n^{-s} from filled to N, for at most 2 ms. */
    function fill(N, sr, si) {
      var stop = performance.now() + 2;
      while (filled < N) {
        var end = Math.min(N, filled + 500);
        for (var n = filled + 1; n <= end; n++) {
          var l = Math.log(n), m = Math.exp(-sr * l), a = re[n] = re[n - 1] + m * Math.cos(si * l), b = im[n] = im[n - 1] - m * Math.sin(si * l);
          x0[n] = Math.min(x0[n - 1], a); x1[n] = Math.max(x1[n - 1], a); y0[n] = Math.min(y0[n - 1], b); y1[n] = Math.max(y1[n - 1], b);
        }
        filled = end;
        if (performance.now() > stop) { fig.more(); return; }
      }
    }

    return function draw() {
      var sr = s.x, si = s.y, k = sr + ',' + si;
      if (k !== key) { key = k; filled = 0; M.zetaInto(sr, si, zeta); }
      var N = Math.max(1, Math.round(play.mapped));
      fill(N, sr, si);
      var n = Math.min(N, filled);
      // the predicted offset N^{1-s}/(1-s) and its size
      var L = Math.log(n), mg = Math.exp((1 - sr) * L), pr = mg * Math.cos(si * L), pi = -mg * Math.sin(si * L);
      var d = (1 - sr) * (1 - sr) + si * si, offR = (pr * (1 - sr) - pi * si) / d, offI = (pi * (1 - sr) + pr * si) / d;
      var rad = Math.hypot(offR, offI), gap = Math.hypot(re[n] - zeta[0], im[n] - zeta[1]);

      // camera: fit the path, zeta(s), and the circle, with a margin
      var bx0 = Math.min(x0[n], zeta[0] - rad), bx1 = Math.max(x1[n], zeta[0] + rad);
      var by0 = Math.min(y0[n], zeta[1] - rad), by1 = Math.max(y1[n], zeta[1] + rad);
      var hw = Math.max(0.3, 0.58 * (bx1 - bx0)), hh = Math.max(0.3, 0.58 * (by1 - by0));
      var mx = cx.to((bx0 + bx1) / 2).value, my = cy.to((by0 + by1) / 2).value;
      hw = Math.exp(lw.to(Math.log(hw)).value); hh = Math.exp(lh.to(Math.log(hh)).value);
      ZP.view.x0 = mx - hw; ZP.view.x1 = mx + hw; ZP.view.y0 = my - hh; ZP.view.y1 = my + hh; ZP.update();

      // the s-plane: where the series converges, the line sigma = 1, the critical line and its zeros
      var sb = SP.box;
      SP.grid({ xStep: 0.5, yStep: 20 });
      SP.fillBetween(40, -40, 1, 3, { color: 'gold', alpha: 0.1 });
      SP.vline(1, { color: 'muted', width: 1.3, dash: [5, 4] });
      SP.vline(0.5, { color: 'violet', width: 1.6 });
      SP.hline(0, { color: 'muted', width: 1 });
      SP.zeros({ r: 2.6, ring: 'stage', ringWidth: 1 });
      SP.axes({ edge: true, xTicks: [{ at: 0.5, tex: 'half' }, [1, '1'], [2, '2']], yStep: 20, size: 11 });
      fig.label('sigma', sb.r - 2, sb.b + 14, { anchor: 'e', color: 'muted', size: 12 });
      if (sb.w > 150) fig.text('converges', SP.X(2), sb.t + 14, { color: 'gold', size: 11.5, align: 'center' });

      // the sums: grid, axes, circle, path, arrows, and the two points
      var zb = ZP.box, sc = ZP.sx;
      ZP.grid();
      ZP.axes({ size: 11 });
      ZP.clip(function () {
        if (rad * sc > 1.5) fig.circle(ZP.X(zeta[0]), ZP.Y(zeta[1]), rad * sc, { fill: false, ring: 'red', ringWidth: 1.6 });
        var ctx = fig.ctx, lx = ZP.X(re[ARROWS < n ? ARROWS : n]), ly = ZP.Y(im[ARROWS < n ? ARROWS : n]);
        if (n > ARROWS) {                                         // the tail as one thin polyline, thinned to about a pixel
          fig.stroke({ color: 'gold', width: 1.3, alpha: 0.9 });
          ctx.beginPath(); ctx.moveTo(lx, ly);
          for (var i = ARROWS + 1; i <= n; i++) {
            var px = ZP.X(re[i]), py = ZP.Y(im[i]);
            if (Math.abs(px - lx) + Math.abs(py - ly) > 0.8 || i === n) { ctx.lineTo(px, py); lx = px; ly = py; }
          }
          ctx.stroke();
        }
        for (var j = Math.min(n, ARROWS); j >= 1; j--) {           // the first arrows, fading with n
          var ax = ZP.X(re[j - 1]), ay = ZP.Y(im[j - 1]), bx = ZP.X(re[j]), by = ZP.Y(im[j]), len = Math.hypot(bx - ax, by - ay);
          var st = { color: 'gold', width: j < 10 ? 2 : 1.4, alpha: 1 - 0.5 * (j - 1) / ARROWS };
          if (len > 7) { st.head = Math.min(9, 0.4 * len); fig.arrow(ax, ay, bx, by, st); } else if (len > 0.3) fig.line(ax, ay, bx, by, st);
        }
        fig.circle(ZP.X(re[n]), ZP.Y(im[n]), 3.6, { fill: 'gold', ring: 'stage', ringWidth: 1.5 });
        fig.circle(ZP.X(zeta[0] + offR), ZP.Y(zeta[1] + offI), 5, { fill: false, ring: 'red', ringWidth: 1.5 });
      });
      ZP.point(zeta[0], zeta[1], { color: 'blue', r: 5.5 });
      ZP.label('zeta', zeta[0], zeta[1], { anchor: 'sw', color: 'blue', dx: 6, dy: -6, size: 14 });

      var regime = sr > 1 ? ['converges', 'gold'] : sr === 1 ? ['circles ζ(s)', 'red'] : ['spirals away', 'red'];
      var narrow = zb.w < 400, sig = narrow ? 3 : 5;
      var dg = function (v) { return fmt(v, Kit.clamp(sig - Math.floor(Math.log10(v || 1)), 0, 8)); };
      fig.panel(narrow ? [
        [{ tex: 'gap' }, dg(gap), 'gold'],
        [{ tex: 'pred' }, dg(rad), 'red']
      ] : [
        ['s', fmt.complex(sr, si, 2)],
        [{ tex: 'zeta' }, fmt.complex(zeta[0], zeta[1], 5), 'blue'],
        [{ tex: 'gap' }, dg(gap), 'gold'],
        [{ tex: 'pred' }, dg(rad), 'red'],
        ['series', regime[0], regime[1]]
      ], { plane: ZP, at: 'auto', prefer: ['ne', 'se', 'nw', 'sw'], hint: 'drag s, or press a preset' });
      if (filled < N) fig.text('adding terms: ' + Math.round(100 * filled / N) + '%', zb.l + 8, zb.b - 8, { color: 'muted', size: 11.5 });
    };
  }
});
