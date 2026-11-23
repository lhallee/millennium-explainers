/* Domain coloring of a choice of f on [-2, 2]^2, with a draggable circle. A marker rides once around the circle, and
   an arrow on the color wheel beside the plane points at the hue of f under the marker. The wheel's arrow turns once
   for every zero inside the circle and back once for every pole, so the count of turns read off at the end of the
   lap is zeros minus poles inside. */
Kit.register('domain-coloring', {
  tex: { z: 'z', fz: 'f(z)', one: '1', i: 'i', mone: '-1', mi: '-i' },
  init: function (fig) {
    var fmt = Kit.fmt, N = 720, TAU = 2 * Math.PI;
    /* Each f writes Re and Im of f(x + iy) into w; ZP lists its zeros (order > 0) and poles (order < 0) that a
       circle in this window can reach. */
    var FN = {
      z: function (x, y, w) { w[0] = x; w[1] = y; },
      z2: function (x, y, w) { w[0] = x * x - y * y; w[1] = 2 * x * y; },
      z3: function (x, y, w) { var a = x * x - y * y, b = 2 * x * y; w[0] = a * x - b * y; w[1] = a * y + b * x; },
      inv: function (x, y, w) { var d = x * x + y * y; w[0] = x / d; w[1] = -y / d; },
      exp: function (x, y, w) { var e = Math.exp(x); w[0] = e * Math.cos(y); w[1] = e * Math.sin(y); },
      rat: function (x, y, w) {
        var a = x * x - y * y - 1, b = 2 * x * y, c = x * x - y * y + 1, d = c * c + b * b;
        w[0] = (a * c + b * b) / d; w[1] = (b * c - a * b) / d;
      },
      sin: function (x, y, w) { var e = Math.exp(y), ch = (e + 1 / e) / 2, sh = (e - 1 / e) / 2; w[0] = Math.sin(x) * ch; w[1] = Math.cos(x) * sh; }
    };
    var ZP = { z: [[0, 0, 1]], z2: [[0, 0, 2]], z3: [[0, 0, 3]], inv: [[0, 0, -1]], exp: [],
      rat: [[1, 0, 1], [-1, 0, 1], [0, 1, -1], [0, -1, -1]], sin: [[0, 0, 1], [Math.PI, 0, 1], [-Math.PI, 0, 1]] };
    var fsel = fig.select({ label: 'Function', value: 'z2', options: [['z', 'z'], ['z2', 'z²'], ['z3', 'z³'], ['inv', '1/z'], ['exp', 'eᶻ'],
      ['rat', '(z² − 1)/(z² + 1)'], ['sin', 'sin z']] });
    var rad = fig.slider({ label: 'Radius', min: 0.1, max: 1.5, step: 0.01, value: 0.7 });
    var lap = fig.player({ label: 'Lap', duration: 6, value: 0, reduced: 1 });

    var side = function (w) { return w < 560 ? 104 : 190; };
    var P = fig.plane({ x: [-2, 2], y: [-2, 2], equal: true, pad: { t: 8, r: 8, b: 22, l: 26 },
      box: function (w, h) { var sd = side(w), s = Math.min(h, w - sd), l = Math.max(0, (w - sd - s) / 2); return [l, 0, l + s, h]; } });
    var K = fig.plane({ x: [-1, 1], y: [-1, 1], equal: true, pad: 0,
      box: function (w, h) {
        var sd = side(w), s = Math.min(h, w - sd), l = Math.max(0, (w - sd - s) / 2) + s, d = Math.min(sd - 34, 0.42 * h, 130);
        var cx = l + sd / 2, top = Math.max(22, 0.5 * h - d - 20);
        return [cx - d / 2, top, cx + d / 2, top + d];
      } });
    var ctr = fig.drag({ plane: P, x: 0, y: 0, r: 6, color: 'fg', constrain: function (x, y) { return [Kit.clamp(x, -2, 2), Kit.clamp(y, -2, 2)]; } });
    fig.probe({ plane: P, crosshair: false, rows: function (x, y) {
      var w = [0, 0]; FN[fsel.value](x, y, w);
      return [[{ tex: 'z' }, fmt.complex(x, y, 2)], [{ tex: 'fz' }, isFinite(w[0]) ? fmt.complex(w[0], w[1], 3) : '∞']];
    } });

    var cum = new Float64Array(N + 1), sig = '', touching = false, inside = 0, w = [0, 0];
    // the wheel's color at modulus 1.1, clear of the kit's banding step at |w| = 1, where rounding would speckle it
    var unit = function (x, y, out) { var m = (Math.hypot(x, y) || 1) / 1.1; out[0] = x / m; out[1] = y / m; };

    /* Unwrapped arg f along the circle, sampled at N + 1 points from angle 0, and zeros minus poles inside. */
    function measure(f, cx, cy, r) {
      var prev = 0;
      for (var i = 0; i <= N; i++) {
        var a = TAU * i / N;
        f(cx + r * Math.cos(a), cy + r * Math.sin(a), w);
        var g = Math.atan2(w[1], w[0]);
        if (i === 0) cum[0] = g; else { var d = g - prev; d -= TAU * Math.round(d / TAU); cum[i] = cum[i - 1] + d; }
        prev = g;
      }
      touching = false; inside = 0;
      ZP[fsel.value].forEach(function (p) {
        var dist = Math.hypot(p[0] - cx, p[1] - cy);
        if (Math.abs(dist - r) < 0.03) touching = true; else if (dist < r) inside += p[2];
      });
    }

    return function draw() {
      var f = FN[fsel.value], cx = ctr.x, cy = ctr.y, r = rad.value, u = lap.value, narrow = fig.w < 560;
      var key = fsel.value + '|' + cx + '|' + cy + '|' + r;
      if (key !== sig) { sig = key; measure(f, cx, cy, r); }

      P.domain(f, { rev: fsel.value });
      P.grid({ xStep: 1, yStep: 1, color: 'stage', alpha: 0.35 });
      P.axes({ edge: true, xStep: 1, yStep: 1 });

      // The circle, the part already walked, and the rider with its direction.
      var b = P.box, ppx = P.sx, X0 = P.X(cx), Y0 = P.Y(cy), rp = r * ppx, ctx = fig.ctx, a = TAU * u;
      fig.circle(X0, Y0, rp, { fill: false, ring: 'stage', ringWidth: 4.5 });
      fig.circle(X0, Y0, rp, { fill: false, ring: fig.color('fg', 0.55), ringWidth: 1.5 });
      if (u > 0) {
        fig.stroke({ color: 'fg', width: 2.8 });
        ctx.beginPath(); ctx.arc(X0, Y0, rp, 0, -a, true); ctx.stroke();
      }
      var mx = X0 + rp * Math.cos(a), my = Y0 - rp * Math.sin(a);
      var ox = 11 * Math.cos(a), oy = -11 * Math.sin(a);   // the rider's arrow runs just outside the circle
      fig.arrow(mx + ox + 9 * Math.sin(a), my + oy + 9 * Math.cos(a), mx + ox - 9 * Math.sin(a), my + oy - 9 * Math.cos(a), { color: 'stage', width: 5, head: 12 });
      fig.arrow(mx + ox + 8 * Math.sin(a), my + oy + 8 * Math.cos(a), mx + ox - 8 * Math.sin(a), my + oy - 8 * Math.cos(a), { color: 'fg', width: 2, head: 9 });
      fig.circle(mx, my, 4, { fill: 'fg', ring: 'stage', ringWidth: 1.5 });

      // The wheel: hue for each direction of f, with an arrow at the direction of f under the rider.
      var kb = K.box, kc = [(kb.l + kb.r) / 2, (kb.t + kb.b) / 2], kr = kb.w / 2;
      ctx.save(); ctx.beginPath(); ctx.arc(kc[0], kc[1], kr, 0, TAU); ctx.arc(kc[0], kc[1], 0.62 * kr, 0, TAU, true); ctx.clip();
      K.domain(unit, { rev: 'wheel', key: 'wheel', finest: 2 });
      ctx.restore();
      var i0 = Math.min(N - 1, Math.floor(u * N)), fr = u * N - i0, g = cum[i0] + fr * (cum[i0 + 1] - cum[i0]);
      fig.arrow(kc[0], kc[1], kc[0] + 0.9 * kr * Math.cos(g), kc[1] - 0.9 * kr * Math.sin(g), { color: 'fg', width: 2.4, head: 10 });
      fig.circle(kc[0], kc[1], 3, { fill: 'fg' });
      var off = kr + 9;
      fig.label('one', kc[0] + off, kc[1], { anchor: 'w', color: 'muted', size: 12 });
      fig.label('i', kc[0], kc[1] - off, { anchor: 's', color: 'muted', size: 12 });
      fig.label('mone', kc[0] - off, kc[1], { anchor: 'e', color: 'muted', size: 12 });
      fig.label('mi', kc[0], kc[1] + off, { anchor: 'n', color: 'muted', size: 12 });

      // The count.
      var turns = (g - cum[0]) / TAU, ok = !touching;
      // on a phone 'net order', not Z − P: the chapter defines Z and P only after this figure
      var rows = [['turns', ok ? fmt(turns, { digits: 2, sign: true }) : 'undefined', ok ? 'fg' : 'red'],
        [narrow ? 'net order' : 'zeros − poles', ok ? fmt(inside, { sign: true }) : 'on the loop', ok ? 'teal' : 'red']];
      var pw = side(fig.w) - 8;
      fig.panel(rows, { x: kc[0] - pw / 2, y: kb.b + 22, id: 'count', compact: narrow });
    };
  }
});
