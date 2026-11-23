/* The sizes of the formal proof's chain against the scale x (chapter 20, df-code, from RankVal): the chain length m
   from x^(1/2 - eps/16) to twice that, the frame order n from x^(2 + 8 eps), the rank N_0 of X_0 from
   x^(9/2 + 10 eps), each to twice its lower end; the rank step c + 1 = 40 n^2 N_0^4 x^(377 + 2 eps) / m at the lower
   ends, about x^(398.5 + 58 eps); and the top rank N_m = N_0 + m (c + 1), about x^(399 + 58 eps). The vertical
   axis is the number of decimal digits of each size on a logarithmic scale, so 10^1 to 10^10000 fit on one plot. */
Kit.register('chain-scale', {
  tex: { m: 'm', n: 'n', N0: 'N_0', c1: 'c+1', Nm: 'N_m', sx: '\\sqrt x', x: 'x', step: 'c+1 \\approx x^{398.5+58\\varepsilon}',
    top: 'N_m \\approx x^{399+58\\varepsilon}' },
  init: function (fig) {
    var fmt = Kit.fmt, L2 = Math.log10(2), L40 = Math.log10(40), U0 = 2, U1 = 12;
    var eps = fig.slider({ label: 'Exponent ε', min: 0.001, max: 0.019, step: 0.0005, value: 0.01, format: function (v) { return 'ε = ' + v.toFixed(4); } });
    var Q = {   // decimal digits (log10) of each lower end, as functions of u = log10 x
      m: function (u, e) { return u * (0.5 - e / 16); },
      n: function (u, e) { return u * (2 + 8 * e); },
      N0: function (u, e) { return u * (4.5 + 10 * e); },
      step: function (u, e) { return L40 + 2 * Q.n(u, e) + 4 * Q.N0(u, e) + u * (377 + 2 * e) - Q.m(u, e); },
      top: function (u, e) { var a = Q.m(u, e) + Q.step(u, e), b = Q.N0(u, e); return a + Math.log10(1 + Math.pow(10, b - a)); },
      sx: function (u) { return u / 2; }
    };
    var sci = function (D) {   // a size given by its log10, as plain digits below 10^6 and as a x 10^k above
      if (D < 6) return fmt(Math.round(Math.pow(10, D)));
      var k = Math.floor(D), mant = Math.pow(10, D - k);
      if (mant >= 9.995) { mant = 1; k++; }
      return mant.toFixed(2) + '×10' + fmt.sup(k);
    };
    // self-check against the chapter's example (chapter 21, ml-scales) at eps = 0.01, x = 10^6: m in [991.4, 1982.8],
    // N_0 about 10^27.6, n about 10^12.5; and the slopes 398.5 + 58 eps and 399 + 58 eps up to eps / 16
    var e0 = 0.01, mlo = Math.pow(10, Q.m(6, e0));
    var bad = Math.abs(mlo - 991.4) > 0.05 || Math.abs(2 * mlo - 1982.8) > 0.1 || Math.abs(Q.N0(6, e0) - 27.6) > 1e-9 || Math.abs(Q.n(6, e0) - 12.48) > 1e-9 ||
      Math.abs(Q.step(11, e0) - Q.step(10, e0) - (398.5 + 58 * e0)) > e0 / 16 + 1e-9 || Math.abs(Q.top(11, e0) - Q.top(10, e0) - (399 + 58 * e0)) > e0 / 16 + 1e-9;
    if (bad) console.error('chain-scale: the sizes no longer match the chapter (m at x = 10^6, or the exponents 398.5 + 58 eps, 399 + 58 eps)');

    var wide = function (W) { return W >= 720; };
    var P = fig.plane({ x: [U0, U1], y: [0.6, 3e4], yLog: true, pad: { t: 12, r: 16, b: 30, l: 62 },
      box: function (W, H) { return wide(W) ? [0, 0, W - 222, H] : [0, 0, W, H - 66]; } });
    var cur = fig.drag({ plane: P, x: 6, y: 0.6, r: 7, color: 'fg',
      constrain: function (x) { return [Kit.clamp(Math.round(x * 20) / 20, U0, U1), lift()]; } });
    function lift() { return P.toWorld(0, P.box.b - 11)[1]; }   // the handle sits just above the axis, clear of its labels

    return function draw() {
      var e = eps.value, narrow = !wide(fig.w), u = cur.x;
      P.pad.r = narrow ? 34 : 16; P.update();
      var b = P.box;
      cur.y = lift();
      P.grid();
      P.axes({ edge: true, xStep: 2, xFormat: function (v) { return fmt.pow10(Math.round(v)); }, yFormat: function (v) { return fmt.pow10(Math.round(v)); }, xLabel: 'x' });
      var band = function (key, color) {
        P.fillBetween(function (v) { return Q[key](v, e) + L2; }, function (v) { return Q[key](v, e); }, U0, U1,
          { color: color, alpha: 0.3, edges: { color: color, width: 1.2 } });
      };
      band('m', 'teal'); band('n', 'muted'); band('N0', 'blue');
      P.plot(function (v) { return Q.sx(v); }, { color: 'fg', width: 1, dash: [3, 4], alpha: 0.8 });
      P.plot(function (v) { return Q.top(v, e); }, { color: 'gold', width: 5, alpha: 0.4 });
      P.plot(function (v) { return Q.step(v, e); }, { color: 'gold', width: 1.8, dash: [7, 5] });

      // labels at the right end (the step and the top rank share a line on this scale)
      var ur = U1 - 0.25, ls = narrow ? 12.5 : 14;
      if (narrow) {   // on a phone the bands are a few pixels apart: labels in the right margin, spread to stay apart
        var last = Infinity;
        [['sx', Q.sx(U1) - L2, 'fg'], ['m', Q.m(U1, e), 'teal'], ['n', Q.n(U1, e), 'muted'], ['N0', Q.N0(U1, e), 'blue']].forEach(function (q) {
          var y = Math.min(P.Y(q[1] + L2 / 2), last - 15); last = y; fig.label(q[0], b.r + 5, y, { anchor: 'w', color: q[2], size: ls, id: 'r' + q[0] });
        });
      } else {
        P.label('m', ur, Q.m(ur, e) + L2, { anchor: 's', color: 'teal', dy: -3, size: ls });
        P.label('n', ur, Q.n(ur, e) + L2, { anchor: 's', color: 'muted', dy: -3, size: ls });
        P.label('N0', ur, Q.N0(ur, e) + L2, { anchor: 's', color: 'blue', dy: -3, size: ls });
      }
      var uc = narrow ? 9.2 : ur - 0.3;
      P.label('Nm', uc, Q.top(uc, e), { anchor: 's', color: 'gold', dy: -6, size: ls });
      P.label('c1', uc, Q.step(uc, e), { anchor: 'n', color: 'gold', dy: 6, size: ls });
      if (!narrow) P.label('sx', U0 + 1.1, Q.sx(U0 + 1.1), { anchor: 'n', color: 'fg', dy: 7, size: ls - 1 });

      // the cursor
      P.vline(u, { color: 'fg', width: 1, alpha: 0.45, dash: [3, 4] });
      [['m', 'teal'], ['n', 'muted'], ['N0', 'blue'], ['top', 'gold']].forEach(function (q) { P.point(u, Q[q[0]](u, e), { color: q[1], r: 3.5 }); });
      var xs = Math.abs(u - Math.round(u)) < 1e-9 ? fmt.pow10(Math.round(u)) : sci(u);
      var rows = [[{ tex: 'x' }, xs], [{ tex: 'm' }, sci(Q.m(u, e)), 'teal'], [{ tex: 'n' }, sci(Q.n(u, e))], [{ tex: 'N0' }, sci(Q.N0(u, e)), 'blue'],
        [{ tex: 'c1' }, sci(Q.step(u, e)), 'gold'], [{ tex: 'Nm' }, sci(Q.top(u, e)), 'gold']];
      if (narrow) fig.panel(rows, { x: 8, y: fig.h - 62, compact: true, id: 'read' });
      else {
        var px = fig.w - 214, pr = fig.panel(rows, { x: px, y: 10, compact: false, id: 'read', hint: 'lower ends; drag the dot' });
        var ty = pr.y + pr.h + 24;
        fig.mathText([{ tex: 'step' }], px + 4, ty, { size: 12.5 });
        fig.text('exponent ' + fmt(398.5 + 58 * e, 2), px + 4, ty + 22, { size: 12, color: 'muted' });
        fig.mathText([{ tex: 'top' }], px + 4, ty + 50, { size: 12.5 });
        fig.text('exponent ' + fmt(399 + 58 * e, 2), px + 4, ty + 72, { size: 12, color: 'muted' });
        fig.text('from one labeled line to the next', px + 4, ty + 104, { size: 11.5, color: 'muted' });
        fig.text('the number of digits grows tenfold', px + 4, ty + 120, { size: 11.5, color: 'muted' });
      }
    };
  }
});
