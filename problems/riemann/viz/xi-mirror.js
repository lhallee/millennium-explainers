/* The symmetries of xi(s) = s(s-1)/2 pi^{-s/2} Gamma(s/2) zeta(s). Domain coloring of xi (or of zeta, for contrast) on
   sigma in [-3, 4], |t| <= 25, a draggable point s, and rings at its three images: 1 - s (the half-turn about 1/2),
   conj s (the flip in the real axis), and 1 - conj s (the mirror in the critical line). xi is computed from its
   definition at every pixel, on both sides of the line, so the symmetry in the picture is a result and not an input.
   |xi| falls like exp(-pi |t| / 4), so the coloring shows xi(s) / E(t) with E(t) = |xi(1/2 + it) / zeta(1/2 + it)|,
   a positive factor that depends only on |t|: hue, zeros, and both symmetries are unchanged, and the shading stays
   readable at |t| = 25. The readout shows xi itself. */
Kit.register('xi-mirror', {
  tex: { s: 's', ms: '1-s', cs: '\\bar s', mcs: '1-\\bar s', line: '\\sigma=\\tfrac12',
    xs: '\\xi(s)', xms: '\\xi(1-s)', xcs: '\\xi(\\bar s)', xmcs: '\\xi(1-\\bar s)',
    zs: '\\zeta(s)', zms: '\\zeta(1-s)', zcs: '\\zeta(\\bar s)', zmcs: '\\zeta(1-\\bar s)',
    d1: '\\lvert\\xi(s)-\\xi(1-s)\\rvert', d2: '\\lvert\\xi(1-\\bar s)\\rvert-\\lvert\\xi(s)\\rvert' },
  init: function (fig) {
    var M = Kit.math, fmt = Kit.fmt, LOGPI = Math.log(Math.PI), zin = { re: 0, im: 0 }, zt = [0, 0];
    var color = fig.select({ label: 'Colors', options: [['xi', 'ξ (symmetric)'], ['zeta', 'ζ (not symmetric)']], value: 'xi' });
    var show = [['Show 1 − s', false], ['Show conj s', false], ['Show 1 − conj s', true]].map(function (o) {
      var tw = fig.tween(o[1] ? 1 : 0);
      return { tw: tw, tg: fig.toggle({ label: o[0], value: o[1], onInput: function (v) { tw.to(v ? 1 : 0, 500); } }) };
    });
    fig.onReset = function () { show.forEach(function (o) { o.tw.set(o.tg.value ? 1 : 0); }); };
    var STRIP = 56;                                                                // phone width: the readout goes under the plane
    var P = fig.plane({ x: [-3, 4], y: [-25, 25], pad: { t: 10, r: 12, b: 26, l: 38 },
      box: function (w, h) { return [0, 0, w, w < 560 ? h - STRIP : h]; } });
    var s = fig.drag({ plane: P, x: 1.4, y: 6, r: 7, color: 'fg', label: 's', labelAnchor: 'sw',
      constrain: function (x, y) {
        x = Kit.clamp(x, -3, 4); y = Kit.clamp(y, -25, 25);
        if (Math.abs(P.X(x) - P.X(0.5)) < 6) x = 0.5;                            // snap onto the critical line
        return [x, y];
      } });

    /* xi(x + iy) into out, from the definition. The poles of Gamma(s/2) at s = 0 and s = -2k meet zeros of s or of
       zeta, so at those points (and at s = 1) the value comes from the other side, xi(s) = xi(1 - s). */
    function xi(x, y, out) {
      if (y === 0 && x <= 0 && x === 2 * Math.round(x / 2)) return xi(1 - x, 0, out);
      if (y === 0 && x === 1) { out[0] = 0.5; out[1] = 0; return out; }
      var ar = 0.5 * (x * x - y * y - x), ai = y * (x - 0.5);                      // s(s-1)/2
      zin.re = x / 2; zin.im = y / 2;
      var g = M.lgamma(zin);
      var lr = 0.5 * Math.log(ar * ar + ai * ai) - 0.5 * x * LOGPI + g.re, li = Math.atan2(ai, ar) - 0.5 * y * LOGPI + g.im;
      M.zetaInto(x, y, zt);
      var e = Math.exp(lr), fr = e * Math.cos(li), fi = e * Math.sin(li);
      out[0] = fr * zt[0] - fi * zt[1]; out[1] = fr * zt[1] + fi * zt[0];
      return out;
    }
    var lastY = NaN, inv = 1;
    function xiShade(x, y, out) {
      if (y !== lastY) { lastY = y; zin.re = 0.25; zin.im = y / 2; inv = 1 / (0.5 * (0.25 + y * y) * Math.pow(Math.PI, -0.25) * Math.exp(M.lgamma(zin).re)); }
      xi(x, y, out); out[0] *= inv; out[1] *= inv;
    }
    function zeta(x, y, out) { return M.zetaInto(x, y, out); }
    var vals = [[0, 0], [0, 0], [0, 0], [0, 0]];

    /* A ring at an image of s. Each image labels on its own side (1 - s below right, conj s above right, 1 - conj s
       above left), so labels stay apart where images coincide, as they do when s is on the critical line. */
    function ring(px, py, key, id, a, anchor) {
      fig.circle(px, py, 8, { fill: false, ring: fig.color('stage', 0.9 * a), ringWidth: 5 });
      fig.circle(px, py, 8, { fill: false, ring: fig.color('fg', a), ringWidth: 2 });
      var right = anchor.indexOf('w') >= 0, up = anchor.indexOf('s') >= 0;
      if (a > 0.6) fig.label(key, px, py, { anchor: anchor, dx: right ? 9 : -9, dy: up ? -7 : 7, color: 'fg', size: 14, id: id });
    }

    return function draw() {
      var isXi = color.value === 'xi', b = P.box;
      P.domain(isXi ? xiShade : zeta, { rev: color.value, coarse: 200, finest: 3, budget: 2 });   // 2 ms of sharpening per frame keeps a frame under 4 ms
      P.hline(0, { color: 'muted', width: 1.2 });
      P.vline(0.5, { color: 'stage', width: 4, alpha: 0.6 });
      P.vline(0.5, { color: 'violet', width: 2 });
      P.axes({ edge: true, xStep: 1, yStep: 5, size: 11 });
      var ls = fig.labelSize('line', 13), lx = P.X(0.5) + 7;
      fig.rect(lx - 3, b.t + 3, ls.w + 6, ls.h + 2, { fill: 'stage', alpha: 0.85 });
      fig.label('line', lx, b.t + 4, { anchor: 'nw', color: 'violet', size: 13 });
      P.zeros({ r: 4.5, ring: 'stage', ringWidth: 2 });

      // the three images of s, each traveling from s while its toggle eases in
      var sx = s.x, sy = s.y, Sx = P.X(sx), Sy = P.Y(sy), Cx = P.X(0.5), Cy = P.Y(0);
      var a0 = show[0].tw.value, a1 = show[1].tw.value, a2 = show[2].tw.value;
      if (a0 > 0.01) {
        var ang = Math.PI * a0, c = Math.cos(ang), sn = Math.sin(ang), qx = Cx + c * (Sx - Cx) - sn * (Sy - Cy), qy = Cy + sn * (Sx - Cx) + c * (Sy - Cy);
        if (a0 > 0.99) fig.line(Sx, Sy, qx, qy, { color: 'fg', width: 1, dash: [3, 4], alpha: 0.7 });
        fig.circle(Cx, Cy, 3, { fill: 'fg', ring: 'stage', ringWidth: 1.5 });
        ring(qx, qy, 'ms', 'r0', Math.min(1, 3 * a0), 'nw');
      }
      if (a1 > 0.01) ring(Sx, P.Y(sy * (1 - 2 * a1)), 'cs', 'r1', Math.min(1, 3 * a1), 'sw');
      if (a2 > 0.01) {
        var mx = P.X(sx + a2 * (1 - 2 * sx));
        if (a2 > 0.99) fig.line(Sx, Sy, mx, Sy, { color: 'fg', width: 1, dash: [3, 4], alpha: 0.7 });
        ring(mx, Sy, 'mcs', 'r2', Math.min(1, 3 * a2), 'se');
      }

      // readout: the function at s and its three images, and the two symmetry checks
      var f = isXi ? xi : zeta, pts = [[sx, sy], [1 - sx, -sy], [sx, -sy], [1 - sx, sy]];
      for (var i = 0; i < 4; i++) f(pts[i][0], pts[i][1], vals[i]);
      var keys = isXi ? ['xs', 'xms', 'xcs', 'xmcs'] : ['zs', 'zms', 'zcs', 'zmcs'], narrow = fig.w < 560, sig = narrow ? 3 : 5;
      var d1 = Math.hypot(vals[0][0] - vals[1][0], vals[0][1] - vals[1][1]), d2 = Math.hypot(vals[3][0], vals[3][1]) - Math.hypot(vals[0][0], vals[0][1]);
      var sci = function (v) { return Math.abs(v) < 1e-300 ? '0' : fmt.sci(v, 1); };
      var cdig = function (w) { var m = Math.max(Math.abs(w[0]), Math.abs(w[1])); return fmt.complex(w[0], w[1], Kit.clamp(sig - Math.floor(Math.log10(m || 1)), 0, 12)); };
      if (narrow) {                                                                  // two lines under the plane
        var y1 = P.outer.b + 12, y2 = P.outer.b + 30, other = isXi ? 3 : 1;          // xi: s and its mirror; zeta: s and 1 - s
        fig.mathText([{ tex: keys[0] }, ' = ' + cdig(vals[0])], 8, y1, { size: 12, mono: true });
        fig.mathText([{ tex: keys[other] }, ' = ' + cdig(vals[other])], 8, y2, { size: 12, mono: true });
        if (isXi && sx === 0.5) fig.text('real on the line', fig.w - 8, y1, { color: 'violet', size: 12, align: 'right', baseline: 'middle' });
        fig.text(isXi ? 'shading: ξ divided by a factor that depends on t only' : 'ζ(s) and ζ(1 − s) differ', 8, P.outer.b + 47,
          { color: 'muted', size: 11, baseline: 'middle' });
        return;
      }
      // keep the readout off the point and its images (the kit draws the point after this, so mark it by hand)
      fig.occRect(Sx - 14, Sy - 14, 28, 28);
      if (a2 > 0.01) fig.occRect(P.X(1 - sx) - 14, Sy - 14, 28, 28);
      if (a1 > 0.01) fig.occRect(Sx - 14, P.Y(-sy) - 14, 28, 28);
      if (a0 > 0.01) fig.occRect(P.X(1 - sx) - 14, P.Y(-sy) - 14, 28, 28);
      var rows = [['s', fmt.complex(sx, sy, 2)], [{ tex: keys[0] }, cdig(vals[0])], [{ tex: keys[1] }, cdig(vals[1])],
        [{ tex: keys[2] }, cdig(vals[2])], [{ tex: keys[3] }, cdig(vals[3])]];
      if (isXi) rows.push([{ tex: 'd1' }, sci(d1), 'muted'], [{ tex: 'd2' }, sci(d2), 'muted']);
      if (isXi && sx === 0.5) rows.push(['on the line', 'ξ(s) is real', 'violet']);
      fig.panel(rows, { plane: P, at: 'auto', prefer: ['ne', 'se', 'nw', 'sw'], hint: isXi ? 'shading: ξ divided by a factor that depends on t only' : 'ζ(s) and ζ(1 − s) differ' });
    };
  }
});
