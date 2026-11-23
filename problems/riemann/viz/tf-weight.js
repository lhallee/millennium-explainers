/* Why the weight is one half, twice. Top: with the weight |x|^w on functions, the multiplicative measure carries the
   density x^(2w) dx/x = x^(2w-1) dx against the additive measure dx (equation tf-unitary); the two agree only at
   w = 1/2. Bottom: the local factor t^(1-w)/|1-t| that the fixed-point weight gives, and its image t^w/|1-t| under
   t -> 1/t, on a log axis in t; they coincide only at w = 1/2. The red shading is the mismatch in each panel. */
Kit.register('tf-weight', {
  tex: {
    dens: 'x^{2w}\\,\\dd x/x=x^{2w-1}\\,\\dd x', add: '\\dd x', x: 'x', t: 't', w: 'w', half: 'w=\\tfrac12',
    F: 't^{1-w}/\\lvert 1-t\\rvert', Fm: 't^{w}/\\lvert 1-t\\rvert\\quad(\\text{image under }t\\mapsto 1/t)', FmShort: 't^{w}/\\lvert 1-t\\rvert',
    t10: '\\tfrac1{10}', t3: '\\tfrac13'
  },
  init: function (fig) {
    var U = 2.5;
    var w = fig.slider({ label: 'Weight', tex: 'w', min: 0, max: 1, step: 0.01, value: 0.3, snap: [0.5],
      marks: [{ at: 0.5, color: 'violet', title: 'w = 1/2' }],
      format: function (v) { return Math.abs(v - 0.5) < 1e-9 ? '1/2' : v.toFixed(2); } });
    var cam = fig.follow(w.value, { tau: 0.08 });
    var top = fig.plane({ x: [0, 4], y: [0, 3], box: [0, 0, 1, 0.47], pad: { t: 12, r: 16, b: 24, l: 40 } });
    var bot = fig.plane({ x: [-U, U], y: [0, 4], box: [0, 0.53, 1, 1], pad: { t: 8, r: 16, b: 26, l: 40 } });

    return function draw() {
      var ww = cam.to(w.value).value, at = Math.abs(w.value - 0.5) < 1e-9 && Math.abs(ww - 0.5) < 1e-3;
      var dens = function (x) { return Math.pow(x, 2 * ww - 1); };
      var F = function (u) { var t = Math.exp(u); return Math.pow(t, 1 - ww) / Math.abs(1 - t); };
      var Fm = function (u) { var t = Math.exp(u); return Math.pow(t, ww) / Math.abs(1 - t); };

      // top: the two measures as densities against dx
      top.grid({ xStep: 1, yStep: 1 });
      top.axes({ edge: true, xStep: 1, yStep: 1, xLabel: 'x' });
      top.fillBetween(dens, 1, 1e-4, 4, { color: 'red', alpha: 0.16 });
      top.plot(dens, { color: 'gold', width: 2.6, from: 1e-4 });
      top.plot(function () { return 1; }, { color: 'blue', width: 2.2, dash: [7, 5] });
      fig.legend([{ color: 'gold', tex: 'dens', width: 2.6 }, { color: 'blue', tex: 'add', dash: [7, 5] }], { plane: top, at: 'ne', size: top.box.w < 420 ? 11.5 : 13 });

      // bottom: the local factor and its mirror under t -> 1/t
      var bb = bot.box;
      bot.grid({ yStep: 1, xTicks: [] });
      bot.axes({ edge: true, yStep: 1, xTicks: [{ at: -Math.log(10), tex: 't10' }, { at: -Math.log(3), tex: 't3' }, [0, '1'], [Math.log(3), '3'], [Math.log(10), '10']], xLabel: 't' });
      bot.fillBetween(F, Fm, -U, -1e-3, { color: 'red', alpha: 0.16 });
      bot.fillBetween(F, Fm, 1e-3, U, { color: 'red', alpha: 0.16 });
      bot.vline(0, { color: 'muted', width: 1.4, dash: [4, 4] });        // t = 1; violet is kept for the critical line
      bot.plot(function (u) { return u === 0 ? NaN : Fm(u); }, { color: 'blue', width: 2.2 });
      bot.plot(function (u) { return u === 0 ? NaN : F(u); }, { color: 'gold', width: 2.6, dash: at ? [8, 6] : null });
      fig.legend([{ color: 'gold', tex: 'F', width: 2.6 }, { color: 'blue', tex: bb.w < 420 ? 'FmShort' : 'Fm', width: 2.2 }], { plane: bot, at: 'nw', size: bb.w < 420 ? 11.5 : 13 });

      if (at) fig.label('half', top.X(2.2), top.Y(1) - 8, { anchor: 's', color: 'violet', size: 15 });
    };
  }
});
