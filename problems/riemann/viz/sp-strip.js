/* The weight of W_a and the strip it buys. Left, in u = log t: the weight w = max(t^{2a}, t^{-2a}) = e^{2a|u|}, and
   the Cauchy-Schwarz integrand t^{2 x0} / w, whose total area is the squared norm of evaluation at z0 = x0 + i y0.
   Right, the z-plane: the strip |Re z| < a, the critical line Re z = 0 with the first zeros at z = i gamma, and a
   draggable z0. The readout is ||delta_z0|| = sqrt(a / (a^2 - x0^2)) inside the strip, and "not continuous" outside. */
Kit.register('sp-strip', {
  tex: {
    a: 'a', z0: 'z_0', x0: 'x_0 = \\Re z_0', y0: 'y_0', u: 'u = \\log t', re: '\\Re z', im: '\\Im z', ma: '-a',
    w: 'w(t) = \\max(t^{2a}, t^{-2a})', wS: 'w(t)', g: 't^{2x_0}/w(t)',
    dn: '\\lVert\\delta_{z_0}\\rVert = \\sqrt{a/(a^2 - x_0^2)}', Wa: 'W_a'
  },
  init: function (fig) {
    var fmt = Kit.fmt, BAND = 48;
    var A = fig.slider({ label: 'Strip half-width', tex: 'a', min: 0.02, max: 0.5, step: 0.01, value: 0.25,
      format: function (v) { return v.toFixed(2); } });
    var aF = fig.follow(A.value, { tau: 0.1 });
    var split = function (w) { return Math.round(w * (w >= 700 ? 0.56 : 0.5)); };
    var L = fig.plane({ x: [-4, 4], y: [0, 10], pad: { t: 12, r: 12, b: 40, l: 34 },
      box: function (w, h) { return [0, 0, split(w), h - BAND]; } });
    var Z = fig.plane({ x: [-0.6, 0.6], y: [-40, 40], pad: { t: 22, r: 14, b: 28, l: 38 },
      box: function (w, h) { return [split(w), 0, w, h - BAND]; } });
    var z0 = fig.drag({ plane: Z, x: 0.2, y: 20, r: 7, color: 'fg', label: 'z0', labelAnchor: 'sw',
      constrain: function (x, y) { return [Kit.clamp(x, -0.58, 0.58), Kit.clamp(y, -38, 38)]; } });

    return function draw() {
      var a = aF.to(A.value).value, aExact = A.value, x0 = z0.x;
      var inside = Math.abs(x0) < aExact, col = inside ? 'teal' : 'red';
      z0.color = inside ? 'fg' : 'red';
      var wt = function (u) { return Math.exp(2 * a * Math.abs(u)); };
      var gi = function (u) { return Math.exp(2 * x0 * u - 2 * a * Math.abs(u)); };

      // Left: the weight and the integrand whose area is the squared norm of evaluation at z0.
      L.grid({ xStep: 1, yStep: 2 });
      L.fillBetween(wt, 0, -4, 4, { color: 'blue', alpha: 0.1 });
      L.fillBetween(gi, 0, -4, 4, { color: col, alpha: 0.22 });
      L.plot(wt, { color: 'blue', width: 2.4 });
      L.plot(gi, { color: col, width: 2 });
      var lb = L.box, narrow = lb.w < 260, ls = narrow ? 11.5 : 13.5;
      L.axes({ edge: true, xStep: narrow ? 2 : 1, yStep: 2 });
      fig.label('u', (lb.l + lb.r) / 2, lb.b + 22, { anchor: 'n', color: 'muted', size: 12.5 });
      fig.legend([{ color: 'blue', tex: narrow ? 'wS' : 'w', width: 2.4 }, { color: col, tex: 'g' }], { plane: L, at: 'n', size: ls, margin: 4 });

      // Right: the strip of half-width a, the critical line, the zeros, and z0.
      var zb = Z.box;
      Z.grid({ xTicks: [-0.5, 0, 0.5], yStep: 20 });
      Z.fillBetween(40, -40, -a, a, { color: 'blue', alpha: 0.16 });
      Z.vline(-a, { color: 'blue', width: 1.4, dash: [5, 4] });
      Z.vline(a, { color: 'blue', width: 1.4, dash: [5, 4] });
      Z.vline(0, { color: 'stage', width: 5, alpha: 0.6 });
      Z.vline(0, { color: 'violet', width: 2 });
      Z.zeros({ count: 12, sigma: 0, r: 3.4, ringWidth: 1.2 });
      Z.axes({ edge: true, xTicks: [[-0.5, fmt(-0.5, 1)], [0, '0'], [0.5, '0.5']], yStep: 20, xLabel: 're', yLabel: 'im' });
      fig.label('a', Z.X(a) + 3, zb.t - 3, { anchor: 'sw', color: 'blue', size: 12.5 });
      fig.label('ma', Z.X(-a) - 3, zb.t - 3, { anchor: 'se', color: 'blue', size: 12.5 });
      Z.segment(0, z0.y, x0, z0.y, { color: col, width: 1.4, dash: [3, 3] });

      // Readout band: where z0 is, then the norm of evaluation at z0 (its square is the whole area under the integrand).
      var y1 = fig.h - BAND + 13, y2 = fig.h - BAND + 34, x = 12, wide = fig.w >= 560, size = wide ? 12.5 : 11.5;
      var hw = fig.mathText([{ tex: 'x0' }, ' = ' + fmt(x0, 3) + (wide ? ',  ' : '')].concat(wide ? [{ tex: 'y0' }, ' = ' + fmt(z0.y, 1)] : []),
        x, y1, { size: size, color: 'muted' });
      if (inside) {
        var nrm = Math.sqrt(aExact / (aExact * aExact - x0 * x0));
        fig.mathText(['evaluation at ', { tex: 'z0' }, ' is continuous'], x + hw + 16, y1, { size: size, color: 'teal' });
        var nw = fig.mathText([{ tex: 'dn' }, ' = ' + fmt(nrm, 3)], x, y2, { size: size + 0.5, color: 'teal', weight: 600 });
        if (wide) fig.text('its square, ' + fmt(nrm * nrm, 3) + ', is the whole area under the teal curve', x + nw + 16, y2, { color: 'muted', size: size, baseline: 'middle' });
      } else {
        fig.mathText(['evaluation at ', { tex: 'z0', color: 'red' }, ' is not continuous on ', { tex: 'Wa', color: 'red' }, wide ? ': the red area is infinite' : ''],
          x, y2, { size: size + 0.5, color: 'red', weight: 600 });
      }
    };
  }
});
