/* The argument principle. Left, a circle in the z-plane (drag its center and its rim) over the zeros (teal) and poles
   (red) of the chosen f. Right, the image curve f(circle) in the w-plane. Play walks a marker once around the circle
   and its image together; the hand from 0 to the image marker counts the turns. At the end of the lap the turns equal
   the number of zeros minus poles inside. The w window is symmetric about 0 and fits most of the image curve. */
Kit.register('winding-count', {
  tex: { z: 'z', w: 'w = f(z)', wn: 'w', Z: 'Z', P: 'P', ZP: 'Z - P' },
  init: function (fig) {
    var fmt = Kit.fmt, N = 1024, TAU = 2 * Math.PI;
    var FN = {
      a: function (x, y, w) {   // (z^2 - 1) / (z - i/2)
        var a = x * x - y * y - 1, b = 2 * x * y, c = x, d = y - 0.5, q = c * c + d * d;
        w[0] = (a * c + b * d) / q; w[1] = (b * c - a * d) / q;
      },
      z3: function (x, y, w) { var a = x * x - y * y, b = 2 * x * y; w[0] = a * x - b * y; w[1] = a * y + b * x; },
      inv: function (x, y, w) { var q = x * x + y * y; w[0] = x / q; w[1] = -y / q; },
      b: function (x, y, w) {   // (z^2 + 1) / (z^2 - 1/4)
        var a = x * x - y * y + 1, b = 2 * x * y, c = x * x - y * y - 0.25, q = c * c + b * b;
        w[0] = (a * c + b * b) / q; w[1] = (b * c - a * b) / q;
      },
      e: function (x, y, w) { var ex = Math.exp(x); w[0] = ex * Math.cos(y) - 1; w[1] = ex * Math.sin(y); }
    };
    // zeros (order > 0) and poles (order < 0) that a circle in this window can reach
    var ZP = { a: [[1, 0, 1], [-1, 0, 1], [0, 0.5, -1]], z3: [[0, 0, 3]], inv: [[0, 0, -1]], b: [[0, 1, 1], [0, -1, 1], [0.5, 0, -1], [-0.5, 0, -1]], e: [[0, 0, 1]] };
    var fsel = fig.select({ label: 'Function', value: 'a', options: [['a', '(z² − 1)/(z − i/2)'], ['z3', 'z³'], ['inv', '1/z'],
      ['b', '(z² + 1)/(z² − 1/4)'], ['e', 'eᶻ − 1']] });
    var walk = fig.player({ label: 'Walk', duration: 6, value: 0, reduced: 1 });

    var split = function (w) { return Math.round(w / 2); };
    var Z = fig.plane({ x: [-2.5, 2.5], y: [-2.5, 2.5], equal: true, pad: { t: 10, r: 10, b: 24, l: 30 }, box: function (w, h) { return [0, 0, split(w), h]; } });
    var Wp = fig.plane({ x: [-1, 1], y: [-1, 1], equal: true, pad: { t: 10, r: 10, b: 24, l: 34 }, box: function (w, h) { return [split(w), 0, w, h]; } });
    var r = 1.5, phi = 0;
    var C = fig.drag({ plane: Z, x: 0, y: 0, r: 6, color: 'fg', constrain: function (x, y) { return [Kit.clamp(x, -2.5, 2.5), Kit.clamp(y, -2.5, 2.5)]; } });
    var Rh = fig.drag({ plane: Z, x: r, y: 0, r: 5, color: 'fg',
      constrain: function (x, y) {
        var dx = x - C.x, dy = y - C.y, d = Math.hypot(dx, dy) || 1, rr = Kit.clamp(d, 0.15, 2.5);
        return [C.x + rr * dx / d, C.y + rr * dy / d];
      },
      onDrag: function (x, y) { r = Math.hypot(x - C.x, y - C.y); phi = Math.atan2(y - C.y, x - C.x); } });
    fig.onReset = function () { r = 1.5; phi = 0; };

    var ZX = new Float64Array(N + 1), ZY = new Float64Array(N + 1), WX = new Float64Array(N + 1), WY = new Float64Array(N + 1);
    var DX = new Float64Array(N + 1), DY = new Float64Array(N + 1), CUM = new Float64Array(N + 1), MAG = new Float64Array(N + 1);
    var w = [0, 0], sig = '', touching = false, zIn = 0, pIn = 0, fitR = 1, cam = fig.follow(0, { tau: 0.15 });

    /* Sample the circle and its image from angle 0, unwrap arg f, count zeros and poles inside, and fit the window. */
    function measure(f, cx, cy) {
      for (var i = 0; i <= N; i++) {
        var a = TAU * i / N;
        ZX[i] = cx + r * Math.cos(a); ZY[i] = cy + r * Math.sin(a);
        f(ZX[i], ZY[i], w); WX[i] = w[0]; WY[i] = w[1]; MAG[i] = Math.hypot(w[0], w[1]);
        if (!(MAG[i] < Infinity)) MAG[i] = Infinity;   // exactly on a pole: 0/0 is NaN
        var g = Math.atan2(w[1], w[0]);
        if (i === 0) CUM[0] = g; else { var d = g - Math.atan2(WY[i - 1], WX[i - 1]); d -= TAU * Math.round(d / TAU); CUM[i] = CUM[i - 1] + d; }
      }
      touching = false; zIn = 0; pIn = 0;
      ZP[fsel.value].forEach(function (p) {
        var dist = Math.hypot(p[0] - cx, p[1] - cy);
        if (Math.abs(dist - r) < 0.04) touching = true;
        else if (dist < r) { if (p[2] > 0) zIn += p[2]; else pIn -= p[2]; }
      });
      var s = Float64Array.from(MAG).sort();   // the whole curve, unless a near pole flings it far out
      fitR = Math.max(1e-3, 1.12 * Math.min(s[N], 3 * s[N >> 1]));
    }

    return function draw() {
      var f = FN[fsel.value], cx = C.x, cy = C.y, u = walk.value, narrow = fig.w < 560;
      Rh.x = cx + r * Math.cos(phi); Rh.y = cy + r * Math.sin(phi);
      var key = fsel.value + '|' + cx + '|' + cy + '|' + r;
      if (key !== sig) { sig = key; measure(f, cx, cy); }
      var i0 = Math.min(N - 1, Math.floor(u * N)), fr = u * N - i0;
      var at = function (A) { return A[i0] + fr * (A[i0 + 1] - A[i0]); };

      // The z-plane: zeros, poles, the circle, the walked part, the marker.
      Z.grid({ xStep: 1, yStep: 1 });
      Z.axes({ xStep: 1, yStep: 1 });
      Z.path(ZX, ZY, { color: 'fg', width: 1.4, alpha: 0.5 });
      var n = Math.max(1, Math.round(u * N));
      Z.path(ZX.subarray(0, n + 1), ZY.subarray(0, n + 1), { color: 'fg', width: 2.6 });
      var ax = Z.X(cx), ay = Z.Y(cy - r);   // a direction arrow at the bottom of the circle, pointing right
      fig.arrow(ax - 8, ay, ax + 5, ay, { color: 'fg', width: 2, head: 9 });
      ZP[fsel.value].forEach(function (p) {
        var px = Z.X(p[0]), py = Z.Y(p[1]);
        if (!Z.inside(px, py)) return;
        if (p[2] > 0) fig.circle(px, py, 5, { fill: 'teal', ring: 'stage', ringWidth: 2 });
        else { fig.line(px - 5, py - 5, px + 5, py + 5, { color: 'red', width: 2.6 }); fig.line(px - 5, py + 5, px + 5, py - 5, { color: 'red', width: 2.6 }); }
        if (Math.abs(p[2]) > 1) fig.text('×' + Math.abs(p[2]), px + 8, py - 7, { color: p[2] > 0 ? 'teal' : 'red', size: 12, weight: 600 });
      });
      fig.circle(Z.X(at(ZX)), Z.Y(at(ZY)), 4.5, { fill: 'gold', ring: 'stage', ringWidth: 2 });
      fig.label('z', Z.box.r - 4, Z.box.b - 4, { anchor: 'se', color: 'muted', size: 14 });

      // The w-plane: the image curve, the hand from 0 to the image of the marker.
      var R = Math.exp(cam.to(Math.log(fitR)).value), cap = 1e3 * R;
      Wp.view.x0 = -R; Wp.view.x1 = R; Wp.view.y0 = -R; Wp.view.y1 = R; Wp.update();
      for (var i = 0; i <= N; i++) { var k = MAG[i] > cap ? cap / MAG[i] : 1; DX[i] = WX[i] * k; DY[i] = WY[i] * k; }
      Wp.grid();
      Wp.axes({ size: 11 });
      Wp.path(DX, DY, { color: 'gold', width: 1.5, alpha: 0.4 });
      Wp.path(DX.subarray(0, n + 1), DY.subarray(0, n + 1), { color: 'gold', width: 2.6 });
      var mx = at(DX), my = at(DY);
      Wp.clip(function () { fig.line(Wp.X(0), Wp.Y(0), Wp.X(mx), Wp.Y(my), { color: 'fg', width: 1.4, alpha: 0.8 }); });
      fig.circle(Wp.X(0), Wp.Y(0), 4, { fill: 'stage', ring: 'fg', ringWidth: 2 });
      Wp.point(mx, my, { color: 'gold', r: 4.5, ringWidth: 2 });
      fig.label(narrow ? 'wn' : 'w', Wp.box.r - 4, Wp.box.b - 4, { anchor: 'se', color: 'muted', size: 14 });

      // The counts.
      var turns = (at(CUM) - CUM[0]) / TAU, wind = Math.round((CUM[N] - CUM[0]) / TAU), ok = !touching, agree = ok ? 'teal' : 'red';
      fig.panel([[narrow ? 'so far' : 'turns so far', ok ? fmt(turns, { digits: 2, sign: true }) : 'undefined', ok ? 'gold' : 'red']],
        { plane: Wp, at: 'nw', id: 'run' });
      fig.panel([
        [narrow ? { tex: 'Z' } : 'zeros inside', ok ? String(zIn) : '?', ok ? 'teal' : 'red'],
        [narrow ? { tex: 'P' } : 'poles inside', ok ? String(pIn) : '?', ok ? 'red' : 'red'],
        [narrow ? { tex: 'ZP' } : 'zeros − poles', ok ? fmt(zIn - pIn) : 'undefined', agree],
        [narrow ? 'wind' : 'winding of image', ok ? fmt(wind) : 'undefined', agree]
      ], { plane: Z, at: 'auto', id: 'count', prefer: ['nw', 'sw', 'ne', 'se'], hint: ok ? 'drag the center or the rim' : 'the circle runs through a zero or a pole' });
    };
  }
});
