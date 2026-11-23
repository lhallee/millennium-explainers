/* Which primes survive the vanishing of orbital traces. One row per prime p <= 53, with the orbit points u = k log p
   (k = -6..6, k != 0) on the axis u = log t from -log 60 to log 60, and the support window (-log Y, log Y) shaded.
   A point inside the open window is gold; a row with one is lit. The point u = 0 is phi(1) = 0 in every row. */
Kit.register('pc-orbits', {
  tex: { phi1: '\\varphi(1)=0', Y: 'Y' },
  init: function (fig) {
    var fmt = Kit.fmt, PR = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53], NR = PR.length;
    var UM = Math.log(60), YMIN = 1.2, YMAX = 60;
    var Ys = fig.slider({ label: 'Support bound', tex: 'Y', min: YMIN, max: YMAX, scale: 'log', step: 0.01, value: 4.5,
      marks: PR.map(function (p) { return { at: p, color: 'gold', title: 'p = ' + p }; }),
      format: function (v) { return 'Y = ' + fmt(v, 2); } });
    var P = fig.plane({ x: [-UM, UM], y: [-0.9, NR - 0.3], pad: { t: 26, r: 16, b: 28, l: 34 } });
    var edge = function (sign) {
      return fig.drag({ plane: P, x: sign * Math.log(4.5), y: -0.45, r: 6.5, color: 'blue',
        constrain: function (x) { return [sign * Kit.clamp(sign * x, Math.log(YMIN), Math.log(YMAX)), -0.45]; },
        onDrag: function (x) { Ys.set(Math.exp(Math.abs(x))); } });
    };
    var hL = edge(-1), hR = edge(1);
    var rowY = function (i) { return NR - 1 - i; };            // p = 2 on top

    return function draw() {
      var Y = Ys.value, lY = Math.log(Y), b = P.box, narrow = fig.w < 560, rh = P.Y(0) - P.Y(1);
      hL.x = -lY; hR.x = lY;
      var dr = Kit.clamp(rh * 0.24, 2.2, 4.2), fs = narrow ? 10 : 11.5;

      // The support window and its edges.
      var wl = P.X(-lY), wr = P.X(lY);
      fig.rect(wl, b.t, wr - wl, b.h, { fill: 'blue', alpha: 0.12 });
      fig.line(wl, b.t, wl, b.b, { color: 'blue', width: 1.5 }); fig.line(wr, b.t, wr, b.b, { color: 'blue', width: 1.5 });
      fig.line(P.X(0), b.t, P.X(0), b.b, { color: 'muted', width: 1, alpha: 0.4, dash: [2, 4] });
      P.axes({ edge: true, y: false, size: 11,
        xTicks: [[-Math.log(50), '1/50'], [-Math.log(10), '1/10'], [-Math.log(3), '1/3'], [Math.log(3), '3'], [Math.log(10), '10'], [Math.log(50), '50']] });
      fig.label('phi1', P.X(0), b.b + 15, { anchor: 'c', color: 'red', size: narrow ? 11 : 12 });

      // One row per prime: orbit points inside the window are gold, outside hollow and muted.
      // Drawn in four batched paths (row lines, hollow dots, gold dots, crosses) to keep the frame cheap.
      var lit = [], ctx = fig.ctx, gold = new Path2D(), hollow = new Path2D(), dark = new Path2D(), lite = new Path2D(), xs = new Path2D();
      var rg = dr * 1.15, rh0 = dr * 0.85, c0 = P.X(0), cr = dr * 0.85;
      for (var i = 0; i < NR; i++) {
        var p = PR[i], lp = Math.log(p), y = P.Y(rowY(i)), on = lp < lY;   // k = +-1 is the innermost pair
        if (on) lit.push(p);
        (on ? lite : dark).moveTo(b.l, y); (on ? lite : dark).lineTo(b.r, y);
        for (var k = -6; k <= 6; k++) {
          var u = k * lp, x = P.X(u);
          if (k === 0 || Math.abs(u) > UM) continue;
          if (Math.abs(u) < lY) { gold.moveTo(x + rg, y); gold.arc(x, y, rg, 0, 2 * Math.PI); }
          else { hollow.moveTo(x + rh0, y); hollow.arc(x, y, rh0, 0, 2 * Math.PI); }
        }
        xs.moveTo(c0 - cr, y - cr); xs.lineTo(c0 + cr, y + cr); xs.moveTo(c0 - cr, y + cr); xs.lineTo(c0 + cr, y - cr);
      }
      for (var t = 0; t < NR; t++) {                              // grouped by style, so the font is set twice and not 16 times
        var lt = t < lit.length;
        fig.text(String(PR[t]), b.l - 8, P.Y(rowY(t)), { color: lt ? 'gold' : 'muted', size: fs, weight: lt ? 700 : 500, align: 'right', baseline: 'middle', mono: true });
      }
      fig.stroke({ color: 'grid', width: 1 }); ctx.stroke(lite);
      fig.stroke({ color: 'muted', width: 1, alpha: 0.5 }); ctx.stroke(dark);
      ctx.fillStyle = fig.color('stage'); ctx.fill(hollow);
      fig.stroke({ color: 'muted', width: 1.2 }); ctx.stroke(hollow);
      ctx.fillStyle = fig.color('gold'); ctx.fill(gold);
      fig.stroke({ color: 'red', width: 1.8 }); ctx.stroke(xs);

      // Readout across the top: how many primes are lit, and which.
      var head = 'lit primes: ' + lit.length + (lit.length ? '   ' : ''), list = lit.join(', ');
      var room = b.w - fig.measure(head, fs + 1, 600) - 4;
      if (fig.measure(list, fs + 1, 600) > room) {
        var cut = lit.slice(0, 2).concat(['…'], lit.slice(-2));
        list = cut.join(', ');
      }
      fig.text(head, b.l, b.t - 12, { color: 'fg', size: fs + 1, weight: 600, baseline: 'middle' });
      fig.text(list, b.l + fig.measure(head, fs + 1, 600), b.t - 12, { color: 'gold', size: fs + 1, weight: 600, baseline: 'middle' });
      if (!narrow) fig.text('window 1/Y < t < Y,  Y = ' + fmt(Y, 2), b.r, b.t - 12, { align: 'right', size: 12, color: 'blue', mono: true, baseline: 'middle' });
    };
  }
});
