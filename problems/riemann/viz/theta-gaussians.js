/* Poisson summation on one Gaussian. Top: g(x) = exp(-pi t x^2) and its samples at the integers, which add up to
   theta(t). Bottom: the Fourier transform ghat(y) = t^{-1/2} exp(-pi y^2 / t) and its samples, which add up to
   t^{-1/2} theta(1/t). Both panels share one vertical scale, so a wide curve with many tall bars faces a narrow one
   with a single bar, and the two totals agree. The sums run over all integers (until a term is below 1e-18), and
   only |n| <= 6 is drawn. */
Kit.register('theta-gaussians', {
  tex: { g: 'g(x)=e^{-\\pi t x^2}', gh: '\\hat g(y)=t^{-1/2}e^{-\\pi y^2/t}', th: '\\theta(t)', thd: 't^{-1/2}\\,\\theta(1/t)',
    t: 't', x: 'x', y: 'y' },
  init: function (fig) {
    var fmt = Kit.fmt, R = 6, T0 = 0.25;
    var logT = fig.tween(Math.log(T0)), swapping = false;
    var T = fig.slider({ label: 'Parameter', tex: 't', min: 0.05, max: 20, scale: 'log', value: T0, marks: [0.25, 1, 4],
      snap: [0.25, 1, 4], format: function (v) { return fmt(v, v < 1 ? 3 : 2); },
      onInput: function (v) { swapping = false; logT.set(Math.log(v)); } });
    fig.button({ label: 'Swap t and 1/t', onClick: function () { swapping = true; logT.set(Math.log(T.value)); logT.to(-Math.log(T.value), 900); } });
    var nums = fig.toggle({ label: 'Show bar heights', value: false });
    fig.onReset = function () { swapping = false; logT.set(Math.log(T0)); };
    var pad = { t: 30, r: 16, b: 22, l: 44 };
    var top = fig.plane({ x: [-6.6, 6.6], y: [0, 1.1], pad: pad, box: [0, 0, 1, '50% - 12px'] });
    var bot = fig.plane({ x: [-6.6, 6.6], y: [0, 1.1], pad: pad, box: [0, '50% + 12px', 1, 1] });
    var ymax = fig.follow(1.12);

    /* Sum of exp(-pi a n^2) over all integers n. */
    function theta(a) {
      var sum = 1;
      for (var n = 1; ; n++) { var e = Math.exp(-Math.PI * n * n * a); sum += 2 * e; if (e < 1e-18) return sum; }
    }

    /* One panel: the curve f, bars at the integers, and the bar values for |n| <= 3 when asked. */
    function panel(P, f, curve, word, total, sumKey) {
      var b = P.box, narrow = b.w < 520;
      P.view.y1 = ymax.value; P.update();
      P.grid({ xStep: 1, yStep: P.v.y1 > 3 ? 1 : 0.5 });
      P.axes({ edge: true, xStep: 1, yStep: P.v.y1 > 3 ? 1 : 0.5, size: 11 });
      var bw = Kit.clamp(0.22 * P.sx, 3, 12);
      for (var n = -R; n <= R; n++) {
        var v = f(n), px = P.X(n);
        fig.rect(px - bw / 2, P.Y(v), bw, P.Y(0) - P.Y(v), { fill: 'gold', alpha: 0.85 });
        if (nums.value && Math.abs(n) <= (narrow ? 1 : 3)) fig.text(fmt(v, narrow ? 2 : 4), px, P.Y(v) - 6, { color: 'gold', size: narrow ? 10 : 11, align: 'center', mono: true });
      }
      P.plot(f, { color: 'blue', width: 2.2 });
      var lx = b.l + 8;
      if (!narrow) { fig.text(word, lx, b.t - 12, { color: 'muted', size: 12, baseline: 'middle' }); lx += fig.measure(word, 12) + 10; }
      fig.label(curve, lx, b.t - 12, { anchor: 'w', color: 'blue', size: narrow ? 12 : 13 });
      fig.mathText([{ tex: sumKey }, ' = ' + fmt(total, 9)], b.r, b.t - 12, { align: 'right', size: narrow ? 11.5 : 12.5, mono: true, color: 'gold' });
    }

    return function draw() {
      if (swapping) { T.set(Math.exp(logT.value)); if (!logT.active) swapping = false; }
      var t = swapping ? Math.exp(logT.value) : T.value, rt = Math.sqrt(t);
      ymax.to(1.12 * Math.max(1, 1 / rt));
      var a = theta(t), b = theta(1 / t) / rt;
      panel(top, function (x) { return Math.exp(-Math.PI * t * x * x); }, 'g', 'positions', a, 'th');
      panel(bot, function (y) { return Math.exp(-Math.PI * y * y / t) / rt; }, 'gh', 'frequencies', b, 'thd');

      // between the panels: the two totals are equal
      var gy = (top.outer.b + bot.outer.t) / 2 + 2, cxm = fig.w / 2, diff = Math.abs(a - b);
      fig.text('=', cxm, gy, { color: 'fg', size: 26, weight: 600, align: 'center', baseline: 'middle' });
      if (fig.w > 480) fig.text((diff === 0 ? 'equal in every digit computed' : 'equal up to rounding, a difference of ' + fmt.sci(diff, 0)), cxm + 20, gy, { color: 'muted', size: 11.5, baseline: 'middle' });
    };
  }
});
