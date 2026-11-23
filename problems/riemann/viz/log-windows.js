/* Windows of scales on the logarithmic axis u = log x. The wave of one hypothetical pair beta +- i gamma, divided by
   the allowance e^(alpha u), is v(u) = e^((beta - alpha)(u - u0)) cos(gamma u) (u0 = 40 puts the envelope at 1 there),
   clipped to [-3, 3]. The windows [U_j, (1 + delta) U_j], U_j = 5 s^j, are shaded; the wave is faint outside them
   because the proof knows nothing there, and red dots mark the crests inside a window that rise above the allowance.
   Crests are the maxima of v: gamma u = atan((beta - alpha) / gamma) + 2 pi m. */
Kit.register('log-windows', {
  tex: { u: 'u', x: 'x', win: '[U,(1+\\delta)U]', allow: '\\text{allowance}' },
  init: function (fig) {
    var fmt = Kit.fmt, U1 = 80, CL = 3.3, NS = 9000, TAU = 2 * Math.PI;
    var gS = fig.slider({ label: 'Height', min: 1, max: 40, step: 0.1, value: 2, format: function (v) { return 'γ = ' + v.toFixed(1); } });
    var dS = fig.slider({ label: 'Lead', min: 0.01, max: 0.4, step: 0.01, value: 0.1, format: function (v) { return 'β − α = ' + v.toFixed(2); } });
    var wS = fig.slider({ label: 'Window length', min: 0.05, max: 1, step: 0.01, value: 0.5,
      marks: [{ at: 0.5, color: 'muted', title: 'the proof: [Y, Y^(3/2)]' }], format: function (v) { return 'δ = ' + v.toFixed(2); } });
    var sS = fig.slider({ label: 'Spacing', min: 1.6, max: 4, step: 0.1, value: 1.8, format: function (v) { return 'U grows ×' + v.toFixed(1); } });
    var P = fig.plane({ x: [0, U1], y: [-3.2, 3.2], pad: { t: 10, r: 14, b: 46, l: 30 } });

    // How many crests of cos(gamma u) lie in a window: for gamma = 14 and Y = 10^10 the chapter says about 25.
    function crestsIn(lo, hi, g, a) {
      var ph = Math.atan(a / g);
      return Math.floor((g * hi - ph) / TAU) - Math.ceil((g * lo - ph) / TAU) + 1;
    }
    var c25 = crestsIn(10 * Math.LN10, 15 * Math.LN10, 14, 0);
    if (c25 !== 25) console.error('log-windows: a window [10^10, 10^15] holds ' + c25 + ' crests for gamma = 14, the chapter says about 25');

    var us = new Float64Array(NS), vs = new Float64Array(NS), n = 0, key = '', wins = [], dots = [], info = null;
    function update(g, a, d, s) {
      var k = g + ',' + a + ',' + d + ',' + s;
      if (k === key) return; key = k;
      n = Kit.clamp(Math.ceil(U1 * g / TAU * 12), 600, NS);
      for (var i = 0; i < n; i++) {
        var u = U1 * i / (n - 1);
        us[i] = u; vs[i] = Kit.clamp(Math.exp(a * (u - 40)) * Math.cos(g * u), -CL, CL);
      }
      wins.length = 0; dots.length = 0; info = null;
      var ph = Math.atan(a / g);
      for (var U = 5; U < U1; U *= s) {
        var hi = Math.min((1 + d) * U, U1), above = 0;
        for (var m = Math.ceil((g * U - ph) / TAU); ; m++) {
          var uc = (ph + TAU * m) / g;
          if (uc > hi) break;
          var vc = Math.exp(a * (uc - 40)) * Math.cos(g * uc);
          if (vc > 1) { above++; dots.push(uc, Math.min(vc, 3.08)); }
        }
        wins.push([U, hi, above]);
        if (above && !info) info = { U: U, above: above, cut: hi < (1 + d) * U };
      }
      if (!info) info = { U: NaN };
    }

    return function draw() {
      var g = gS.value, a = dS.value, d = wS.value, s = sS.value, narrow = fig.w < 560, b = P.box, i;
      update(g, a, d, s);
      P.grid({ xStep: 10, yStep: 1 });
      P.axes({ origin: [0, 0], x: false, yStep: 1, size: narrow ? 10.5 : 11.5 });

      // the windows, then the wave: faint everywhere, full strength inside each window
      for (i = 0; i < wins.length; i++) {
        P.fillBetween(3.2, -3.2, wins[i][0], wins[i][1], { color: 'muted', alpha: 0.13 });
        P.vline(wins[i][0], { color: 'muted', width: 1, alpha: 0.7 });
        P.vline(wins[i][1], { color: 'muted', width: 1, alpha: 0.7 });
      }
      P.hline(0, { color: 'muted', width: 1 });
      P.path(us.subarray(0, n), vs.subarray(0, n), { color: 'red', width: 1.3, alpha: 0.3 });
      for (i = 0; i < wins.length; i++) {
        var i0 = Math.floor(wins[i][0] / U1 * (n - 1)), i1 = Math.min(n - 1, Math.ceil(wins[i][1] / U1 * (n - 1)));
        P.path(us.subarray(i0, i1 + 1), vs.subarray(i0, i1 + 1), { color: 'red', width: 1.6 });
      }
      P.hline(1, { color: 'blue', width: 2, dash: [7, 5] });
      for (i = 0; i < dots.length; i += 2) P.point(dots[i], dots[i + 1], { color: 'red', r: narrow ? 2.6 : 3.4 });

      // two rows of ticks: u, and x = e^u at powers of ten
      for (var t = narrow ? 20 : 10; t <= U1; t += narrow ? 20 : 10) fig.text(String(t), P.X(t), b.b + 14, { color: 'muted', size: 11, align: 'center' });
      for (var e = 10; e * Math.LN10 <= U1; e += narrow ? 20 : 10) {
        var px = P.X(e * Math.LN10);
        fig.line(px, b.b + 20, px, b.b + 25, { color: 'muted', width: 1 });
        fig.text(fmt.pow10(e), px, b.b + 38, { color: 'muted', size: 11, align: 'center' });
      }
      fig.label('u', b.l - 4, b.b + 13, { anchor: 'e', color: 'muted', size: 11.5 });
      fig.label('x', b.l - 4, b.b + 33, { anchor: 'e', color: 'muted', size: 11.5 });

      fig.legend([
        { color: 'red', text: narrow ? 'hypothetical wave ÷ allowance' : 'wave of a hypothetical zero, divided by the allowance', width: 1.6 },
        { color: 'blue', tex: 'allow', dash: [7, 5], width: 2 },
        { color: 'muted', fill: true, alpha: 0.3, tex: 'win' }
      ], { plane: P, at: 'nw', size: narrow ? 11.5 : 13 });
      var Y = info.U === info.U ? info.U / Math.LN10 : NaN;
      fig.panel(narrow ? [
        ['first window above', Y === Y ? 'U = ' + fmt(info.U, 1) : 'none', 'red'],
        Y === Y ? ['crests above', String(info.above), 'red'] : null
      ] : [
        ['crest spacing 2π/γ', fmt(TAU / g, 3)],
        ['first window with a crest above', Y === Y ? 'U = ' + fmt(info.U, 1) : 'none for u ≤ 80', 'red'],
        Y === Y ? ['that is Y', '≈ 10' + fmt.sup(Math.round(Y))] : null,
        Y === Y ? ['crests above in it', String(info.above) + (info.cut ? ' (in view)' : ''), 'red'] : null,
        ['a period fits once U >', fmt(TAU / (g * d), 2)]
      ], { plane: P, at: 'sw', id: 'read' });
    };
  }
});
