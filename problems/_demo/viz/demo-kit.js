/* A test of every kit helper added after the pilots: pi(x) on a logarithmic x axis (a sieve built as a job, a
   staircase drawn per pixel column when dense, a band, a legend, a probe with click-to-place), a strip of fixed
   pixel height under it (a rug of zero ordinates, or stems of Lambda(n)), an inset complex plane with the critical
   strip and the zeros, and the new controls (a log slider with marks and snapping, a slider snapping to zero
   heights, a mapped player with a pace, a control hidden in one mode). */
Kit.register('demo-kit', {
  tex: {
    x: 'x', pi: '\\pi(x)', Li: '\\Li(x)', band: '\\Li(x)\\pm\\sqrt{x}', diff: '\\Li - \\pi', gN: '\\gamma_N',
    gamma: '\\gamma', half: '\\tfrac12', n: 'n', Lam: '\\Lambda(n)', T: 'T'
  },
  init: function (fig) {
    var M = Kit.math, fmt = Kit.fmt, Z = Kit.zeros, LIM = 1e6;
    var below100 = Kit.upperBound(Z, 100);                      // 29 zeros up to height 100
    var steps = null, cursor = 0;
    var sieve = fig.job(M.sieveTask(LIM), { onDone: function () { steps = M.piSteps(LIM); } });

    var X = fig.slider({ label: 'Largest x', min: 100, max: LIM, scale: 'log', value: 1e4,
      marks: [1e3, 1e4, 1e5], snap: [100, 1e3, 1e4, 1e5, 1e6] });
    var T = fig.slider({ label: 'Height', tex: 'T', min: 10, max: 100, step: 0.01, value: 60,
      marks: Array.prototype.slice.call(Z, 0, below100).map(function (g) { return { at: g, color: 'teal' }; }),
      snap: Array.prototype.slice.call(Z, 0, below100), format: function (v) { return fmt(v, 2); } });
    var play = fig.player({ label: 'Zeros', min: 0, max: below100, value: 0.3, duration: 8,
      pace: function (u, N) { return 0.4 + N / 10; }, format: function (N) { return String(Math.round(N)); } });
    var band = fig.toggle({ label: 'Band', value: true });
    var mode = fig.select({ label: 'Strip', options: [['zeros', 'zero heights'], ['stems', 'Λ(n)']], value: 'zeros' });
    var cam = fig.follow(Math.log10(X.value), { tau: 0.1 });

    var main = fig.plane({ x: [2, X.value], y: [0, 1], xLog: true, box: [0, 0, 1, '-60px'], pad: { t: 10, r: 16, b: 26, l: 52 } });
    var strip = fig.plane({ x: [0, 60], y: [0, 1], box: [0, '-60px', 1, 1], pad: { t: 18, r: 16, b: 20, l: 52 } });
    var inset = fig.plane({ x: [-0.5, 1.5], y: [0, 60], pad: { t: 6, r: 6, b: 18, l: 26 },
      box: function (w, h) { var l = 60, t = 16; return [l, t, l + Math.min(180, 0.3 * w), t + Math.min(150, 0.38 * h)]; } });
    var lamX = [], lamY = [];
    for (var n = 2; n <= 60; n++) if (M.vonMangoldt(n) > 0) { lamX.push(n); lamY.push(M.vonMangoldt(n)); }
    fig.probe({ plane: main,
      snap: function (x) { var k = Math.max(2, Math.round(x)); return [k, sieve.done ? M.pi(k) : M.Li(k)]; },
      pick: function (x) { cursor = x; },
      rows: function (x) {
        if (!sieve.done) return [[{ tex: 'x' }, fmt(x)], [{ tex: 'Li' }, fmt(M.Li(x), 1), 'blue']];
        return [[{ tex: 'x' }, fmt(x)], [{ tex: 'pi' }, fmt(M.pi(x)), 'gold'], [{ tex: 'Li' }, fmt(M.Li(x), 1), 'blue'],
          [{ tex: 'diff' }, fmt.signed(M.Li(x) - M.pi(x), 1), 'red']];
      } });

    return function draw() {
      var xmax = Math.pow(10, cam.to(Math.log10(X.value)).value), N = Math.round(play.mapped), zeros = mode.value === 'zeros';
      T.show(zeros);
      play.enable(zeros);
      main.view.x1 = xmax; main.view.y1 = 1.08 * (M.Li(xmax) + (band.value ? Math.sqrt(xmax) : 0)); main.update();

      main.grid();
      main.axes({ edge: true, xLabel: 'x' });
      if (band.value) main.fillBetween(function (x) { return M.Li(x) + Math.sqrt(x); }, function (x) { return Math.max(0, M.Li(x) - Math.sqrt(x)); }, 2, xmax, { color: 'muted', alpha: 0.16, edges: { color: 'muted', width: 1, alpha: 0.5 } });
      main.plot(function (x) { return M.Li(x); }, { color: 'blue', width: 2.2, from: 2 });
      if (steps) main.stairs(steps.xs, steps.ys, { color: 'gold', width: 2 });
      else fig.text('sieving to 10⁶: ' + Math.round(100 * sieve.progress) + '%', main.box.r - 8, main.box.b - 10, { color: 'muted', align: 'right', size: 12 });
      if (cursor) main.vline(cursor, { color: 'red', width: 1.5, dash: [5, 4] });
      fig.legend([{ color: 'gold', tex: 'pi' }, { color: 'blue', tex: 'Li' }, band.value && { color: 'muted', fill: true, tex: 'band' }], { plane: main, prefer: ['se', 'ne', 'sw'] });

      // The strip: zero ordinates up to T (the first N lit, the N-th in red), or the stems of Lambda(n).
      var s = strip.box;
      if (zeros) {
        strip.view.x1 = T.value; strip.view.y1 = 1; strip.update();
        strip.rug(Z, { color: 'muted', alpha: 0.6, width: 1 });
        strip.rug(Z, { color: 'teal', end: N, width: 1.6 });
        if (N > 0) strip.rug(Z, { color: 'red', start: N - 1, end: N, width: 2.6 });
        strip.axes({ xAt: 'bottom', y: false });
        fig.mathText(N > 0 ? ['N = ' + N + ',  ', { tex: 'gN' }, ' = ' + fmt(Z[N - 1], 2)] : ['N = 0'], s.r, s.t - 9, { align: 'right', size: 12, mono: true });
        fig.label('gamma', s.l - 10, (s.t + s.b) / 2, { anchor: 'e', color: 'muted', size: 13 });
      } else {
        strip.view.x1 = 60; strip.view.y1 = 4.3; strip.update();
        strip.stems(lamX, lamY, { color: 'gold', width: 1.6, dot: 2.2 });
        strip.axes({ xAt: 'bottom', y: false, xTicks: [2, 10, 20, 30, 40, 50, 60] });
        fig.label('Lam', s.l - 10, (s.t + s.b) / 2, { anchor: 'e', color: 'muted', size: 12 });
      }

      // The inset: the critical strip up to height T with the first N zeros.
      inset.view.y1 = T.value; inset.update();
      inset.frame();
      inset.critical();
      inset.zeros({ count: zeros ? N : 0, r: 3, ringWidth: 1 });
      inset.axes({ edge: true, xTicks: [[0, '0'], { at: 0.5, tex: 'half' }, [1, '1']], yTicks: [0, Math.round(T.value)], size: 10.5 });

      fig.panel([['x ≤', fmt.compact(xmax, xmax >= 1e5 ? 2 : 0)], sieve.done ? [{ tex: 'pi' }, fmt(M.pi(xmax)), 'gold'] : null,
        [{ tex: 'Li' }, fmt(M.Li(xmax), 1), 'blue']], { plane: main, id: 'totals', hint: 'click to mark an x' });
    };
  }
});
