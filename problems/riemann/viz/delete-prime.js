/* Removing one prime p, three ways. Left: the sticks g(nt), n = 1..40, of a theta sum, for the wide Gaussian
   g(x) = exp(-pi x^2 / 4); the sticks at multiples of p turn red and drop, which leaves D_p Theta_g(t) =
   Theta_g(t) - Theta_g(pt). Right: the s-plane with the zeros 2 pi i m / log p of the Euler factor 1 - p^{-s} that
   the deletion multiplies the Mellin transform by, and the local integrals of 1_{Z_p} and 1_{Z_p^x} at s = 2. */
Kit.register('delete-prime', {
  tex: { g: 'g(x)=e^{-\\pi x^2/4}', x: 'x', t: 't', p: 'p', re: '\\Re s', im: '\\Im s',
    Th: '\\Theta_g(t)', Thp: '\\Theta_g(pt)', diff: '\\Theta_g(t)-\\Theta_g(pt)',
    Dp: 'D_p\\Theta_g(t)=2\\textstyle\\sum_{p\\nmid n}g(nt)', DpS: '2\\textstyle\\sum_{p\\nmid n}g(nt)',
    gap: '2\\pi/\\log p', zf: '1-p^{-s}=0',
    li1: '\\textstyle\\int\\mathbf 1_{\\ZZ_p}(x)\\lvert x\\rvert_p^{2}\\,d^\\times x', li2: '\\textstyle\\int\\mathbf 1_{\\ZZ_p^\\times}(x)\\lvert x\\rvert_p^{2}\\,d^\\times x' },
  init: function (fig) {
    var PI = Math.PI, fmt = Kit.fmt, XMAX = 4;
    var g = function (x) { return Math.exp(-PI * x * x / 4); };
    function theta(t) { var s = 0; for (var n = 1; n * t < 12; n++) s += g(n * t); return 2 * s; }
    function thetaPrime(t, p) { var s = 0; for (var n = 1; n * t < 12; n++) if (n % p) s += g(n * t); return 2 * s; }

    var sel = fig.select({ label: 'Prime', tex: 'p', value: '3', options: [['2', '2'], ['3', '3'], ['5', '5'], ['7', '7']] });
    var del = fig.toggle({ label: 'Delete multiples of p', value: true });
    var S = fig.slider({ label: 'Lattice spacing', tex: 't', min: 0.1, max: 2, scale: 'log', value: 0.4, format: function (v) { return fmt(v, 2); } });
    var drop = fig.tween(1), cam = fig.follow(Math.log(0.4), { tau: 0.12 }), fgap = fig.follow(2 * PI / Math.log(3), { tau: 0.15 });
    var lastP = '3', lastDel = true;
    fig.onReset = function () { lastP = sel.value; lastDel = del.value; drop.set(1); };
    var split = function (w) { return Math.round(w * (w < 560 ? 0.6 : 0.62)); };
    var L = fig.plane({ x: [0, XMAX], y: [-0.08, 1.14], pad: { t: 12, r: 12, b: 26, l: 40 }, box: function (w, h) { return [0, 0, split(w), h]; } });
    var R = fig.plane({ x: [-0.8, 2], y: [-40, 40], pad: { t: 12, r: 12, b: 26, l: 36 }, box: function (w, h) { return [split(w), 0, w, h]; } });

    return function draw() {
      var p = Number(sel.value), t = Math.exp(cam.to(Math.log(S.value)).value), narrow = fig.w < 560;
      if (sel.value !== lastP) { lastP = sel.value; if (del.value) { drop.set(0); drop.to(1, 300, 'inOutQuad'); } }
      if (del.value !== lastDel) { lastDel = del.value; drop.to(del.value ? 1 : 0, 300, 'inOutQuad'); }
      var d = drop.value, gap = fgap.to(2 * PI / Math.log(p)).value;
      L.view.y1 = narrow ? 1.6 : 1.14; L.update();

      // Left: g and its lattice sticks; the multiples of p turn red and fall to the axis.
      L.grid({ xStep: 0.5 });
      L.axes({ edge: true, xStep: narrow ? 1 : 0.5, xLabel: 'x' });
      L.plot(g, { color: 'blue', width: 2 });
      L.label('g', 1.15, g(1.15), { anchor: 'sw', color: 'blue', dx: 6, dy: -2, size: 13 });
      for (var n = 1; n <= 40 && n * t <= XMAX; n++) {
        var x = n * t, y = g(x), px = L.X(x), mult = n % p === 0;
        if (mult && d > 0) {
          fig.line(px, L.Y(0), px, L.Y(y), { color: 'red', width: 1, dash: [2, 3], alpha: 0.45 * d });
          var yy = y * (1 - d);
          fig.line(px, L.Y(0), px, L.Y(yy), { color: 'red', width: 2 });
          fig.circle(px, L.Y(yy), 3, { fill: 'red', ring: 'stage', ringWidth: 1 });
        } else {
          fig.line(px, L.Y(0), px, L.Y(y), { color: 'gold', width: 2 });
          fig.circle(px, L.Y(y), 2.6, { fill: 'gold' });
        }
      }
      var Th = theta(t), Thp = theta(p * t), Dp = thetaPrime(t, p);
      fig.panel(narrow ? [[{ tex: 'diff' }, fmt(Th - Thp, 6)], [{ tex: 'DpS' }, fmt(Dp, 6), 'gold']]
        : [[{ tex: 'Th' }, fmt(Th, 6)], [{ tex: 'Thp' }, fmt(Thp, 6), 'red'], [{ tex: 'diff' }, fmt(Th - Thp, 6)], [{ tex: 'Dp' }, fmt(Dp, 6), 'gold']],
        { plane: L, at: 'ne', id: 'sums' });

      // Right: the zeros of 1 - p^{-s}, evenly spaced on Re s = 0.
      var rb = R.box;
      R.grid({ xStep: 1, yStep: 10 });
      R.axes({ origin: [0, 0], xStep: 1, yStep: 20, color: 'muted' });
      if (!narrow) fig.label('re', rb.r - 2, R.Y(0) - 4, { anchor: 'se', color: 'muted', size: 12 });
      fig.label('im', R.X(0) + 6, rb.t + 2, { anchor: 'nw', color: 'muted', size: 12 });
      var a = 0.3 + 0.7 * d;
      for (var m = -Math.floor(40 / gap); m * gap <= 40; m++) fig.circle(R.X(0), R.Y(m * gap), 4, { fill: 'teal', alpha: a, ring: 'stage', ringWidth: 1.2 });
      var bx = R.X(0.42), y0 = R.Y(0), y1 = R.Y(gap);
      fig.line(bx, y0, bx, y1, { color: 'teal', width: 1.4, alpha: a });
      fig.line(bx - 4, y0, bx + 4, y0, { color: 'teal', width: 1.4, alpha: a });
      fig.line(bx - 4, y1, bx + 4, y1, { color: 'teal', width: 1.4, alpha: a });
      if (narrow) fig.text(fmt(gap, 2), bx + 6, (y0 + y1) / 2 + 4, { size: 11.5, color: 'teal', mono: true });
      else {
        fig.mathText([{ tex: 'gap' }, ' = ' + fmt(gap, 2)], bx + 8, (y0 + y1) / 2, { size: 12, color: 'teal' });
        fig.legend([{ color: 'teal', dot: true, tex: 'zf' }], { plane: R, at: 'ne', size: 12 });
      }
      if (!narrow) fig.panel([[{ tex: 'li1' }, fmt(1 / (1 - Math.pow(p, -2)), 4)], [{ tex: 'li2' }, '1']],
        { plane: R, at: 'se', id: 'local', hint: 'at s = 2' });
    };
  }
});
