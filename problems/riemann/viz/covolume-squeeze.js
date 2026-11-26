/* Chebyshev's budget for a lattice, in the plane (figure f-rc-lattice of chapter route-a-compressed). Two integral
   vectors u and v span a parallelogram whose area |det(u, v)| is a positive integer when they are independent. If an
   integer c divides all four coordinates, u/c and v/c are integral too, so |det(u, v)| = c^2 |det(u/c, v/c)| >= c^2,
   and Hadamard's inequality caps the same area by |u| |v|. The bars show 2 log c <= log |det(u, v)| <= log |u| +
   log |v|: divisibility forces length. Left: the lattice Z^2, u and v with their parallelogram, and, when c > 1, the
   parallelogram of u/c and v/c in gold. Right: the three logarithms as bars. c is the greatest common divisor of the
   four coordinates. */
Kit.register('covolume-squeeze', {
  tex: { chain: 'c^2 \\;\\le\\; \\abs{\\det(u,v)} \\;\\le\\; \\abs{u}\\,\\abs{v}', u: 'u', v: 'v' },
  init: function (fig) {
    var R0 = 9, CAP = 64, TOP = 28, fmt = Kit.fmt, MINUS = fmt.minus;
    function gcd(p, q) { p = Math.abs(p); q = Math.abs(q); while (q) { var t = p % q; p = q; q = t; } return p; }
    function measure(u, v) {
      var c = gcd(gcd(u[0], u[1]), gcd(v[0], v[1])), det = u[0] * v[1] - u[1] * v[0];
      return { u: u, v: v, c: c, det: det, div: 2 * Math.log(c), area: det ? Math.log(Math.abs(det)) : 0,
        len: Math.log(Math.hypot(u[0], u[1])) + Math.log(Math.hypot(v[0], v[1])) };
    }
    function vec(p) { return '(' + fmt(p[0]).replace('-', MINUS) + ', ' + fmt(p[1]).replace('-', MINUS) + ')'; }

    // Self-checks: the starting values, and the squeeze c^2 <= |det| <= |u| |v| for every independent pair of
    // integral vectors in [-6, 6]^2.
    var s0 = measure([6, 3], [3, 6]);
    if (s0.c !== 3 || s0.det !== 27 || Math.abs(s0.len - Math.log(45)) > 1e-12) console.error('covolume-squeeze: (6, 3), (3, 6) should give c = 3, det = 27, |u| |v| = 45');
    fig.job(function* () {
      for (var a = -6; a <= 6; a++) {
        for (var b = -6; b <= 6; b++) {
          if (!a && !b) continue;
          for (var p = -6; p <= 6; p++) for (var q = -6; q <= 6; q++) {
            if (!p && !q) continue;
            var s = measure([a, b], [p, q]);
            if (!s.det) continue;
            if (s.c * s.c > Math.abs(s.det) || Math.abs(s.det) > Math.hypot(a, b) * Math.hypot(p, q) + 1e-9) console.error('covolume-squeeze: the squeeze fails at ' + vec([a, b]) + ', ' + vec([p, q]));
          }
        }
        yield (a + 6) / 12;
      }
    });

    var cur = s0, prev = s0, grow = fig.tween(1), dragging = false;
    function set(u, v) { prev = cur; cur = measure(u, v); grow.set(0); grow.to(1, 300, 'inOutCubic'); }
    var b2 = fig.button({ label: 'Multiply by 2', onClick: function () { set([2 * cur.u[0], 2 * cur.u[1]], [2 * cur.v[0], 2 * cur.v[1]]); } });
    var bc = fig.button({ label: 'Divide by c', onClick: function () { var c = cur.c; set([cur.u[0] / c, cur.u[1] / c], [cur.v[0] / c, cur.v[1] / c]); } });
    fig.onReset = function () { set([6, 3], [3, 6]); };

    // the bars on the right need about 360 px on a wide stage: their axis, three bars with gaps, and the value labels
    var side = function (w, h) { return w < 560 ? 0.5 * w : Math.min(h - TOP, 0.52 * w, w - 360); };
    var L = fig.plane({ x: [-R0, R0], y: [-R0, R0], equal: true, pad: { t: 6, r: 8, b: 20, l: 30 },
      box: function (w, h) { return [0, TOP, side(w, h), h]; } });
    var B = fig.plane({ x: [0, 1], y: [0, 5], pad: { t: 26, r: 6, b: 24, l: 32 },
      box: function (w, h) { return [side(w, h) + 10, TOP, w, h]; } });
    var Rf = fig.follow(R0, { tau: 0.15 }), Yf = fig.follow(5, { tau: 0.12 });
    function handle(which, x, y, key) {
      return fig.drag({ plane: L, x: x, y: y, r: 7, color: 'fg', step: 1, label: key, labelAnchor: 'sw',
        constrain: function (px, py) {
          var w = L.v, o = which ? cur.v : cur.u;
          px = Kit.clamp(Math.round(px), Math.max(-CAP, Math.ceil(w.x0)), Math.min(CAP, Math.floor(w.x1)));
          py = Kit.clamp(Math.round(py), Math.max(-CAP, Math.ceil(w.y0)), Math.min(CAP, Math.floor(w.y1)));
          return px || py ? [px, py] : [o[0], o[1]];
        },
        onStart: function () { dragging = true; }, onEnd: function () { dragging = false; },
        onDrag: function (px, py) {
          var o = which ? cur.v : cur.u;
          if (px !== o[0] || py !== o[1]) set(which ? cur.u : [px, py], which ? [px, py] : cur.v);
        } });
    }
    var hu = handle(0, 6, 3, 'u'), hv = handle(1, 3, 6, 'v');

    function quad(P, a, b, fill, alpha, stroke, dash) {
      var ctx = fig.ctx;
      ctx.beginPath(); ctx.moveTo(P.X(0), P.Y(0)); ctx.lineTo(P.X(a[0]), P.Y(a[1]));
      ctx.lineTo(P.X(a[0] + b[0]), P.Y(a[1] + b[1])); ctx.lineTo(P.X(b[0]), P.Y(b[1])); ctx.closePath();
      ctx.fillStyle = fig.color(fill, alpha); ctx.fill();
      ctx.strokeStyle = fig.color(stroke, 0.85); ctx.lineWidth = 1.2; ctx.setLineDash(dash || []); ctx.stroke(); ctx.setLineDash([]);
    }

    return function draw() {
      var ctx = fig.ctx, narrow = fig.w < 560, TS = narrow ? 10.5 : 12, t = grow.value, u = cur.u, v = cur.v, c = cur.c;
      hu.x = u[0]; hu.y = u[1]; hv.x = v[0]; hv.y = v[1];
      var big = Math.max(Math.abs(u[0]), Math.abs(u[1]), Math.abs(v[0]), Math.abs(v[1]));
      b2.enable(2 * big <= CAP);
      bc.enable(c > 1);

      // Left: the lattice, the parallelogram of u and v, and that of u/c and v/c
      var R = dragging ? Rf.value : Rf.to(Math.max(R0, 1.15 * Math.max(Math.abs(u[0] + v[0]), Math.abs(u[1] + v[1]), big))).value;
      L.view.x0 = -R; L.view.x1 = R; L.view.y0 = -R; L.view.y1 = R; L.update();
      var s = L.sx;
      if (s >= 4) {
        var w = L.v, rad = Math.min(1.6, 0.16 * s);
        ctx.fillStyle = fig.color('muted', 0.75); ctx.beginPath();
        for (var gx = Math.ceil(w.x0); gx <= w.x1; gx++) for (var gy = Math.ceil(w.y0); gy <= w.y1; gy++) {
          var px = L.X(gx), py = L.Y(gy); ctx.moveTo(px + rad, py); ctx.arc(px, py, rad, 0, 2 * Math.PI);
        }
        ctx.fill();
      } else L.grid();
      L.axes({ size: narrow ? 10.5 : 11.5 });
      L.clip(function () {
        quad(L, u, v, 'fg', 0.08, 'fg');
        if (c > 1) quad(L, [u[0] / c, u[1] / c], [v[0] / c, v[1] / c], 'gold', 0.3, 'gold', [4, 3]);
      });
      fig.line(L.X(0), L.Y(0), L.X(u[0]), L.Y(u[1]), { color: 'fg', width: 1.8 });
      fig.line(L.X(0), L.Y(0), L.X(v[0]), L.Y(v[1]), { color: 'fg', width: 1.8 });

      // Top: the two vectors, their common divisor and their area, and on wide stages the squeeze itself
      var top = 'u = ' + vec(u) + ',  v = ' + vec(v) + ',  c = ' + fmt(c) + ',  |det(u, v)| = ' + fmt(Math.abs(cur.det));
      var fs = narrow ? 12 : 14;
      while (fs > 9 && fig.measure(top, fs, 600) > (fig.w >= 760 ? fig.w - 250 : fig.w - 8)) fs -= 0.5;
      fig.text(top, 6, 19, { color: 'fg', size: fs, weight: 600 });
      if (fig.w >= 760) fig.label('chain', fig.w - 8, 16, { anchor: 'e', size: 14 });

      // Right: three bars in units of log, 2 log c <= log |det| <= log |u| + log |v|
      var bars = [
        { key: 'div', name: narrow ? '2 log c' : 'divisibility', color: 'gold', alpha: 0.85 },
        { key: 'area', name: 'area', color: 'fg', alpha: 0.35 },
        { key: 'len', name: narrow ? 'length' : 'lengths', color: 'blue', alpha: 0.85 }
      ];
      B.view.y1 = Yf.to(Math.max(5, 1.18 * cur.len)).value; B.update();
      // bar widths come from the room the axis leaves, so the last label stays inside the canvas at phone width
      var bb = B.box, GAP = narrow ? 10 : 40, x0 = bb.l + (narrow ? 8 : 28), y0 = B.Y(0);
      var BW = Kit.clamp((bb.r - x0 - 2 * GAP - (narrow ? 8 : 4)) / 3, 22, 54);
      B.axes({ x: false, yAt: 'left', size: narrow ? 10.5 : 11.5 });
      var tops = [];
      bars.forEach(function (br, i) {
        var val = Kit.lerp(prev[br.key], cur[br.key], t), xl = x0 + i * (BW + GAP), hgt = Math.max(0, val) * B.sy;
        var shown = !(br.key === 'area' && !cur.det);
        if (shown) fig.rect(xl, y0 - hgt, BW, hgt, { fill: br.color, alpha: br.alpha });
        tops.push(y0 - hgt);
        if (shown) fig.text(fmt(cur[br.key], 2), xl + BW / 2, y0 - hgt - 6, { color: br.color === 'fg' ? 'fg' : br.color, size: TS, align: 'center', weight: 600 });
        fig.text(br.name, xl + BW / 2, bb.b + 16, { color: br.color, size: TS, align: 'center', weight: 600 });
      });
      if (cur.det) {
        // each sign sits in the gap, halfway between the two value labels it compares
        for (var i = 0; i < 2; i++) fig.text('≤', x0 + (i + 1) * (BW + GAP) - GAP / 2, (tops[i] + tops[i + 1]) / 2 - 6, { color: 'fg', size: TS + 1, align: 'center', weight: 600 });
      } else {
        fig.text(narrow ? 'dependent' : 'dependent: area 0', x0 + 1.5 * BW + GAP, y0 - 10, { color: 'red', size: TS, align: 'center', weight: 600 });
      }
    };
  }
});
