/* The path t -> zeta(sigma + it), 0 <= t <= T, in the plane of values. On sigma = 1/2 it runs through the origin at
   every zero ordinate; off the line the same loops miss it, and the red segment shows the closest approach. The
   path for each sigma is computed once, in slices, from t = 0 upward; while a new sigma is computing, the old path
   fills in beyond the computed part, so the curve sweeps into its new shape. */
Kit.register('zeta-path', {
  tex: { re: '\\Re\\zeta', im: '\\Im\\zeta', path: '\\zeta(\\sigma+it),\\ 0\\le t\\le T', sigma: '\\sigma', T: 'T',
    miss: '\\min\\lvert\\zeta\\rvert' },
  init: function (fig) {
    var M = Kit.math, fmt = Kit.fmt, Z = Kit.zeros, TMAX = 60, DENS = 60, NS = TMAX * DENS, TRAIL = 3;
    var play = fig.player({ label: 'Largest t', min: 0, max: TMAX, value: 0.5, autoplay: false, duration: 14,
      format: function (v) { return 'T = ' + fmt(v, 1); } });
    var sig = fig.slider({ label: 'Real part', tex: 'sigma', min: 0.3, max: 0.7, step: 0.01, value: 0.5, snap: [0.5],
      marks: [{ at: 0.5, color: 'violet', title: 'critical line' }], format: function (v) { return fmt(v, 2); } });
    // equal axes in a box no wider than 1.7 times its height, centered, so the path is not lost in empty grid
    var P = fig.plane({ x: [-3, 4.2], y: [-3, 3], equal: true, pad: { t: 10, r: 12, b: 10, l: 12 },
      box: function (w, h) { var bw = Math.min(w, 1.7 * h); return [(w - bw) / 2, 0, (w + bw) / 2, h]; } });

    // cache[k] holds the path for sigma = k / 100 at t = i / DENS, i < n; one job fills the wanted key, then stops
    var cache = {}, want = -1, shown = -1, busy = false;
    function entry(k) { return cache[k] || (cache[k] = { re: new Float64Array(NS + 1), im: new Float64Array(NS + 1), n: 0 }); }
    function ensure(k) {
      want = k; entry(k);
      if (busy || cache[k].n > NS) return;
      busy = true;
      fig.job(function* () {
        var out = [0, 0];
        for (;;) {
          var c = cache[want], s = want / 100;
          if (c.n > NS) break;
          for (var j = 0; j < 40 && c.n <= NS; j++, c.n++) { M.zetaInto(s, c.n / DENS, out); c.re[c.n] = out[0]; c.im[c.n] = out[1]; }
          yield c.n / NS;
        }
        busy = false;
      }, { budget: 2 });
    }
    var pulse = fig.tween(1), lastT = play.mapped, best = [0, 0, 0];

    /* Closest point to the origin on the polyline (re, im)[i0..i1], into best = [distance, x, y]. */
    function closest(re, im, i0, i1) {
      for (var i = Math.max(1, i0); i <= i1; i++) {
        var ax = re[i - 1], ay = im[i - 1], dx = re[i] - ax, dy = im[i] - ay, L2 = dx * dx + dy * dy;
        var u = L2 > 0 ? Kit.clamp(-(ax * dx + ay * dy) / L2, 0, 1) : 0, px = ax + u * dx, py = ay + u * dy, d = Math.hypot(px, py);
        if (d < best[0]) { best[0] = d; best[1] = px; best[2] = py; }
      }
    }

    return function draw() {
      var k = Math.round(sig.value * 100), T = play.mapped, nT = Math.min(NS, Math.floor(T * DENS));
      ensure(k);
      var cur = cache[k], old = shown >= 0 && shown !== k ? cache[shown] : null;
      if (cur.n > nT) shown = k;

      // a short flash at the origin as T passes a zero ordinate on the critical line
      if (k === 50 && T > lastT && T - lastT < 2) {
        for (var z = Kit.upperBound(Z, lastT); z < Z.length && Z[z] <= T; z++) { pulse.set(0); pulse.to(1, 700, 'outCubic'); }
      }
      lastT = T;

      P.grid({ xStep: 1, yStep: 1 });
      P.axes({ xStep: 1, yStep: 1, xLabel: 're', yLabel: 'im', size: 11 });

      var m = Math.min(cur.n - 1, nT);                     // the part of the new path that is ready
      best[0] = Infinity;
      if (m > 0) closest(cur.re, cur.im, 0, m);
      if (old && old.n > nT && m < nT) closest(old.re, old.im, m, nT);
      var tail = Math.max(0, nT - TRAIL * DENS);
      [[cur, 0, m], [old && old.n > nT ? old : null, Math.max(0, m), nT]].forEach(function (seg) {
        var c = seg[0], a = seg[1], e = seg[2];
        if (!c || e <= a) return;
        var split = Kit.clamp(tail, a, e);
        if (split > a) P.path(c.re.subarray(a, split + 1), c.im.subarray(a, split + 1), { color: 'teal', width: 1.6, alpha: 0.55 });
        if (e > split) P.path(c.re.subarray(split, e + 1), c.im.subarray(split, e + 1), { color: 'teal', width: 2.6 });
      });

      var miss = best[0], off = miss > 0.01;
      if (isFinite(miss) && off) {
        P.segment(0, 0, best[1], best[2], { color: 'red', width: 2 });
        P.point(best[1], best[2], { color: 'red', r: 3.2 });
      }
      if (pulse.value < 1) fig.circle(P.X(0), P.Y(0), 6 + 24 * pulse.value, { fill: false, ring: fig.color('teal', 1 - pulse.value), ringWidth: 2.5 });
      P.point(0, 0, { color: 'gold', r: 4 });
      var src = cur.n > nT ? cur : old && old.n > nT ? old : null;
      if (src && nT > 0) P.point(src.re[nT], src.im[nT], { color: 'fg', r: 4.5, ring: false });

      if (fig.w >= 560) fig.legend([{ color: 'teal', tex: 'path', width: 2.4 }], { plane: P, prefer: ['sw', 'nw', 'ne', 'se'], size: 12.5 });
      fig.panel([[{ tex: 'sigma' }, fmt(sig.value, 2), sig.value === 0.5 ? 'violet' : 'fg'], [{ tex: 'T' }, fmt(T, 2)],
        [{ tex: 'miss' }, isFinite(miss) ? fmt(miss, 4) : '…', off ? 'red' : 'teal']], { plane: P, prefer: ['se', 'sw', 'ne', 'nw'], id: 'read' });
    };
  }
});
