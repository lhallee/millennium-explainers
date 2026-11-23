/* The kernel phi(x/y) of multiplicative convolution, drawn in u = log x, v = log y, where it is phi(e^(u - v)): constant
   along every line parallel to the diagonal u = v. phi is the bump on the support (e^a, e^b), with
   phi(e^w) = bump((w - c)/r), c = (a + b)/2, r = (b - a)/2. Its value on the diagonal is phi(1) = bump(-c/r), which is
   0 exactly when the support misses t = 1. The band is one linear gradient across the diagonal direction. */
Kit.register('ck-kernel-band', {
  tex: {
    u: 'u=\\log x', v: 'v=\\log y', w: 'w=\\log t', k: '\\varphi(x/y)', phiw: '\\varphi(e^{w})', phi1: '\\varphi(1)',
    t1: 't=1', a: 'a', b: 'b'
  },
  init: function (fig) {
    var fmt = Kit.fmt, E1 = Math.exp(-1), STOPS = 40;
    var bump = function (x) { return Math.abs(x) < 1 ? Math.exp(-1 / (1 - x * x)) : 0; };
    // the support in log units is (a, b), with b at least a + 0.1: moving one end pushes the other
    var A = fig.slider({ label: 'Left end of support', min: -1.5, max: 1.5, step: 0.01, value: 0.3, format: function (v) { return 'a = ' + fmt(v, 2); },
      onInput: function (v) { if (B.value < v + 0.1) B.set(v + 0.1); } });
    var B = fig.slider({ label: 'Right end', min: -1, max: 2, step: 0.01, value: 1.1, format: function (v) { return 'b = ' + fmt(v, 2); },
      onInput: function (v) { if (v < A.value + 0.1) A.set(v - 0.1); } });
    var round = function (x) { return Math.round(x * 100) / 100; };

    // the square heat map, and the profile phi(e^w) to its right; the pair is centered on the stage
    function layout(w, h) {
      var side = Math.max(120, Math.min(h - 54, 0.56 * w - 50)), total = side + 50 + 16 + Math.min(440, w - side - 66);
      var x0 = Math.max(0, (w - total) / 2), top = Math.max(0, (h - side - 54) / 2);
      return { side: side, x0: x0, top: top, right: x0 + total };
    }
    var K = fig.plane({ x: [-2.5, 2.5], y: [-2.5, 2.5], pad: { t: 22, r: 6, b: 30, l: 44 },
      box: function (w, h) { var L = layout(w, h); return [L.x0, L.top, L.x0 + L.side + 50, L.top + L.side + 52]; } });
    var F = fig.plane({ x: [-2.5, 2.5], y: [0, 0.44], pad: { t: 48, r: 12, b: 26, l: 10 },
      box: function (w, h) { var L = layout(w, h); return [L.x0 + L.side + 62, 0.16 * h, L.right, 0.84 * h]; } });
    var onAxis = function (x) { return [Kit.clamp(x, -2.4, 2.4), 0]; };
    var dA = fig.drag({ plane: F, x: A.value, y: 0, r: 6, color: 'fg', constrain: onAxis,
      onDrag: function (x) { A.set(Kit.clamp(round(x), -1.5, 1.5)); if (B.value < A.value + 0.1) B.set(A.value + 0.1); } });
    var dB = fig.drag({ plane: F, x: B.value, y: 0, r: 6, color: 'fg', constrain: onAxis,
      onDrag: function (x) { B.set(Kit.clamp(round(x), -1, 2)); if (B.value < A.value + 0.1) A.set(B.value - 0.1); } });

    return function draw() {
      var a = A.value, b = B.value, c = (a + b) / 2, r = (b - a) / 2, ctx = fig.ctx;
      var prof = function (w) { return bump((w - c) / r); }, at1 = prof(0), hits = at1 > 0;
      dA.x = a; dB.x = b;

      // heat map: lines u - v = const are parallel to the diagonal, so one gradient across them draws the band
      var kb = K.box;
      var g0x = K.X((c - r) / 2), g0y = K.Y(-(c - r) / 2), g1x = K.X((c + r) / 2), g1y = K.Y(-(c + r) / 2);
      var grad = ctx.createLinearGradient(g0x, g0y, g1x, g1y);
      for (var i = 0; i <= STOPS; i++) grad.addColorStop(i / STOPS, fig.color('gold', 0.88 * bump(2 * i / STOPS - 1) / E1));
      K.clip(function () { ctx.fillStyle = grad; ctx.fillRect(kb.l, kb.t, kb.w, kb.h); });
      K.grid({ xStep: 1, yStep: 1, alpha: 0.6 });
      [a, b].forEach(function (e) { K.segment(e - 6, -6, e + 6, 6, { color: 'muted', width: 1, dash: [4, 4], alpha: 0.8 }); });
      K.segment(-2.5, -2.5, 2.5, 2.5, { color: 'red', width: hits ? 2.6 : 1.6 });
      K.axes({ edge: true, xStep: 1, yStep: 1 });
      fig.label('u', kb.r, kb.b + 18, { anchor: 'ne', color: 'muted', size: 12.5 });
      fig.label('v', kb.l - 4, kb.t - 4, { anchor: 'sw', color: 'muted', size: 12.5 });
      // name the band just outside its far edge, away from the diagonal
      // (the point slides along the line u - v = e so that the whole label stays inside the square)
      var ks = fig.labelSize('k', 14), kw = ks.w / K.sx, kh = ks.h / K.sy, e = c >= 0 ? b + 0.2 : a - 0.2;
      var s1 = c >= 0 ? Math.min(1, 2.45 - kw - e / 2) : Math.max(-1, -2.45 + kw - e / 2), lx = e / 2 + s1, ly = -e / 2 + s1;
      var fits = c >= 0 ? lx > -2.5 && lx + kw < 2.5 && ly < 2.5 && ly - kh > -2.5 : lx - kw > -2.5 && lx < 2.5 && ly + kh < 2.5 && ly > -2.5;
      if (fits) K.label('k', lx, ly, { anchor: c >= 0 ? 'nw' : 'se', color: 'gold', size: 14 });
      // the value on the diagonal, in the corner on the far side of the red line from the default band
      fig.mathText([{ tex: 'phi1', color: 'red' }, ' = ' + fmt(at1, 3)], K.X(-2.35), K.Y(2.05), { size: 13, mono: true, color: hits ? 'red' : 'fg', weight: hits ? 700 : 500 });

      // profile of phi against w = log t, with the support shaded and t = 1 marked
      var fb = F.box;
      F.fillBetween(0.44, 0, a, b, { color: 'muted', alpha: 0.14 });
      F.grid({ xStep: 1, yStep: 0.1, alpha: 0.6 });
      // on a phone the profile is small: the handles, the red dot, and the line above carry its labels
      var nar = fig.w < 560;
      F.axes({ xAt: 'bottom', y: false, xStep: 1, xLabel: nar ? null : 'w' });
      F.plot(prof, { color: 'gold', width: 2.4 });
      F.vline(0, { color: 'red', width: 1, dash: [3, 4], alpha: 0.7 });
      F.point(0, at1, { color: 'red', r: 5 });
      if (!nar) {
        F.label('t1', 0, 0.43, { anchor: 'ne', color: 'red', dx: -4, size: 12.5 });
        F.label('phiw', c + 0.6 * r, prof(c + 0.6 * r), { anchor: 'w', color: 'gold', dx: 8, size: 13 });
        F.label('a', a, 0, { anchor: 'se', color: 'muted', dx: -6, dy: -6, size: 12 });
        F.label('b', b, 0, { anchor: 'sw', color: 'muted', dx: 6, dy: -6, size: 12 });
      }
      var say = { size: nar ? 11.5 : 13, align: 'center', color: hits ? 'red' : 'fg' }, mid = (fb.l + fb.r) / 2;
      if (nar) {
        fig.text('kernel on the diagonal', mid, fb.t - 30, { size: 11.5, align: 'center', color: say.color, baseline: 'middle' });
        fig.mathText(['= ', { tex: 'phi1' }, ' = ' + fmt(at1, 3)], mid, fb.t - 13, say);
      } else fig.mathText(['kernel on the diagonal = ', { tex: 'phi1' }, ' = ' + fmt(at1, 3)], mid, fb.t - 22, say);
    };
  }
});
