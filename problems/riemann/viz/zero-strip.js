/* The zero set and its two mirrors. The half planes sigma < 0 and sigma > 1 hold no nontrivial zero (red); the first
   zeros sit on the critical line at 1/2 +- i gamma (teal). A draggable probe s carries its three mirror images
   (conj s, 1 - conj s, 1 - s) as a dashed rectangle that collapses to a segment on the critical line. An optional
   landscape paints the strip by |zeta(s)| (dark where small), so the zeros show as pits on the violet line. */
Kit.register('zero-strip', {
  tex: { sigma: '\\sigma', t: 't', crit: '\\sigma=\\tfrac12', absz: '\\lvert\\zeta(s)\\rvert', s: 's' },
  init: function (fig) {
    var M = Kit.math, fmt = Kit.fmt, Z = Kit.zeros, X0 = -2.5, X1 = 3.5, TM = 55, SNAP = 7;
    var images = fig.toggle({ label: 'Show images', value: true });
    var land = fig.toggle({ label: '|ζ| landscape', value: false });
    var P = fig.plane({ x: [X0, X1], y: [-TM, TM], pad: { t: 12, r: 14, b: 28, l: 40 } });
    // the landscape covers exactly the strip 0 <= sigma <= 1 of the main plane
    var L = fig.plane({ x: [0, 1], y: [-TM, TM], pad: 0, box: function () { return [P.X(0), P.box.t, P.X(1), P.box.b]; } });
    // gray by |zeta|: the kit's lightness of w = (|zeta| / 0.6)^2 is dark below |zeta| = 0.3 and light above 1
    function absZeta(x, y, w) { M.zetaInto(x, y, w); var a = Math.hypot(w[0], w[1]) / 0.6; w[0] = a * a; w[1] = 0; }

    /* Nearest zero ordinate to |y| (with the sign of y), or null when it is more than SNAP pixels away. */
    function snapT(y) {
      var a = Math.abs(y), i = Kit.lowerBound(Z, a), best = null;
      [i - 1, i].forEach(function (k) { if (k >= 0 && k < Z.length && Math.abs(P.Y(Z[k]) - P.Y(a)) < SNAP && (best === null || Math.abs(Z[k] - a) < Math.abs(best - a))) best = Z[k]; });
      return best === null ? null : (y < 0 ? -best : best);
    }
    var probe = fig.drag({ plane: P, x: 0.5, y: Z[0], r: 7, color: 'gold', label: 's', labelAnchor: 'sw',
      constrain: function (x, y) {
        x = Kit.clamp(x, X0 + 0.1, X1 - 0.1); y = Kit.clamp(y, -TM + 1, TM - 1);
        if (Math.abs(P.X(x) - P.X(0.5)) < SNAP) x = 0.5;
        var g = snapT(y);
        return [x, g === null ? y : g];
      } });
    var zv = [0, 0], intro = fig.tween(0), introOn = !Kit.reducedMotion;
    if (introOn) intro.to(1, 3600, 'linear');               // once: s glides off the line and back, opening the rectangle

    return function draw() {
      var b = P.box, sg = probe.x, t = probe.y;
      var held = fig.activeDrag === probe;
      probe.color = held || probe.hover ? 'gold' : 'fg';
      if (held) introOn = false;
      if (introOn) { sg = probe.x = 0.5 + 0.3 * Math.sin(Math.PI * Kit.ease.inOutSine(intro.value)); t = probe.y = Z[0]; if (!intro.active) introOn = false; }
      P.grid({ xStep: 1, yStep: 20 });

      // where no nontrivial zero can be: sigma < 0 and sigma > 1
      P.fillBetween(TM, -TM, X0, 0, { color: 'red', alpha: 0.08 });
      P.fillBetween(TM, -TM, 1, X1, { color: 'red', alpha: 0.08 });
      var small = b.w < 420, ls = small ? 10.5 : 11.5;
      [X0 / 2, (1 + X1) / 2].forEach(function (x) {
        if (small) { fig.text('no nontrivial', P.X(x), b.t + 30, { color: 'red', size: ls, align: 'center', weight: 600 }); fig.text('zeros', P.X(x), b.t + 43, { color: 'red', size: ls, align: 'center', weight: 600 }); }
        else fig.text('no nontrivial zeros', P.X(x), b.t + 16, { color: 'red', size: ls, align: 'center', weight: 600 });
      });

      var dark = parseInt(fig.c.stage.slice(1, 3), 16) < 128;
      if (land.value) L.domain(absZeta, { rev: 'abs2', finest: 3, saturation: 0, alpha: dark ? 0.5 : 0.8 });
      P.critical({ stripAlpha: land.value ? 0 : 0.1, label: 'crit' });
      P.hline(0, { color: 'muted', width: 1.2 });
      P.axes({ edge: true, xStep: 1, yStep: 20, xLabel: 'sigma', yLabel: 't' });

      // the trivial zero at -2 (the others, -4, -6, ..., lie off to the left)
      P.point(-2, 0, { color: 'stage', ring: 'muted', r: 4.5, ringWidth: 2 });
      P.text('trivial zero', -2, 0, { color: 'muted', size: 10.5, align: 'center', dy: -11 });
      P.text('← −4, −6, …', X0, 0, { color: 'muted', size: 10.5, align: 'left', dx: 4, dy: 15 });
      P.zeros({ count: 20, r: land.value ? 2.4 : 3.6, ringWidth: land.value ? 1 : 1.5 });

      // the three mirror images of the probe, and the rectangle they span
      // off the line the images are where a hypothetical zero's partners would have to be, so they are red and say so;
      // on the line they are the zero's true partner, in teal
      if (images.value) {
        var xs = [sg, 1 - sg], ys = [t, -t];
        var flat = Kit.clamp(Math.abs(P.X(sg) - P.X(1 - sg)) / 24, 0, 1), ic = sg === 0.5 ? 'teal' : 'red';
        var dash = { color: ic, width: 1.3, dash: [4, 4] };
        P.segment(xs[0], ys[0], xs[0], ys[1], dash);
        P.segment(xs[1], ys[0], xs[1], ys[1], dash);
        if (flat > 0) {
          P.segment(xs[0], ys[0], xs[1], ys[0], { color: ic, width: 1.3, dash: [4, 4], alpha: flat });
          P.segment(xs[0], ys[1], xs[1], ys[1], { color: ic, width: 1.3, dash: [4, 4], alpha: flat });
          // beside the lower corners: left of the left one, or right of the right one when there is no room
          var lab = small ? 'hypothetical' : 'hypothetical partner zeros', lw = fig.measure(lab, 10.5, 600);
          var xl = P.X(Math.min(sg, 1 - sg)) - 11, left = xl - lw > b.l + 2;
          fig.text(lab, left ? xl : P.X(Math.max(sg, 1 - sg)) + 11, P.Y(-t), { color: 'red', size: 10.5, weight: 600,
            align: left ? 'right' : 'left', baseline: 'middle', alpha: flat });
        }
        [[1 - sg, t], [sg, -t], [1 - sg, -t]].forEach(function (q) {
          fig.circle(P.X(q[0]), P.Y(q[1]), 6, { fill: 'stage', ring: ic, ringWidth: 2.2, alpha: 0.9 });
        });
      }

      M.zetaInto(sg, t, zv);
      var az = Math.hypot(zv[0], zv[1]);
      fig.panel([['s', fmt.complex(sg, t, 2)], [{ tex: 'absz' }, fmt(az, 4), az < 5e-5 ? 'teal' : 'fg'],
        small ? null : ['images', images.value ? (sg === 0.5 ? '1 other point' : '3 other points') : 'hidden']],
        { plane: P, at: small ? 'sw' : 'se', hint: 'drag s' });
    };
  }
});
