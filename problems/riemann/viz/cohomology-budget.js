/* The gluing lemma error_terms_le_sqrt_exp_rpow on a log-log scale: against L = log10 x, the log10 of the exponent of
   each bound. Every bound is on a sum of logarithmic sizes, so the budget line is log10(x^eps / 2), the exponent of
   exp(x^eps / 2), which bounds the sum over l and k < x^401 of log #Sha^1. The shaded region is where the proof's
   three conditions hold, with w = x^(eps/20) and M = max(C, 1): w^11 >= 8, w^11 >= 2M, w^20/2 - w^16 >= log(4M). */
Kit.register('cohomology-budget', {
  tex: { L: 'L = \\log_{10} x', yl: '\\log_{10}(\\text{exponent})',
    bud: '\\text{budget } e^{x^{\\varepsilon}/2} \\text{ for } \\textstyle\\sum_{\\ell}\\sum_{k<x^{401}}\\log\\#\\,\\text{Sha}^1',
    two: '\\text{2-part } e^{x^{4\\varepsilon/5}}', minus: "\\text{minus part } C'e^{8x^{\\varepsilon/4}}",
    plus: '\\text{plus part } Q^C \\le e^{2Cx^{\\varepsilon/4}}',
    prod: '\\text{the budget bounds the sum of the logarithms of the orders, not their product}',
    budS: '\\textstyle\\sum_{\\ell}\\sum_{k<x^{401}}\\log\\#\\,\\text{Sha}^1 \\le e^{x^{\\varepsilon}/2}',
    eb: 'x^{\\varepsilon}/2', e2: 'x^{4\\varepsilon/5}', em: '8x^{\\varepsilon/4}', ep: '2Cx^{\\varepsilon/4}' },
  init: function (fig) {
    var fmt = Kit.fmt, LG2 = Math.log10(2), LMAX = 3000;
    var lines = function (e, C) {                                           // log10 of each exponent at L
      return [function (L) { return e * L - LG2; }, function (L) { return 0.8 * e * L; },
        function (L) { return e / 4 * L + Math.log10(8); }, function (L) { return e / 4 * L + Math.log10(2 * C); }];
    };
    /* Smallest L from which the three conditions of the proof hold. */
    function lstar(e, C) {
      var M = Math.max(C, 1), w1 = Math.pow(Math.max(8, 2 * M), 1 / 11), lo = Math.pow(2, 0.25), hi = 4;
      for (var i = 0; i < 60; i++) { var m = (lo + hi) / 2; if (Math.pow(m, 16) * (Math.pow(m, 4) / 2 - 1) < Math.log(4 * M)) lo = m; else hi = m; }
      return 20 * Math.log10(Math.max(w1, hi)) / e;
    }
    function holds(e, C, L) { var w = Math.pow(10, e * L / 20), M = Math.max(C, 1); return Math.pow(w, 11) >= Math.max(8, 2 * M) && Math.pow(w, 20) / 2 - Math.pow(w, 16) >= Math.log(4 * M); }
    (function check() {                                                     // the chapter's numbers at eps = 1/100
      var e = 0.01, f = lines(e, 1), Lc = 5 * LG2 / e, Ls = lstar(e, 1);
      if (Math.abs(f[0](Lc) - f[1](Lc)) > 1e-9 || Math.abs(Lc - 500 * LG2) > 1e-9 || Math.abs(Lc - 150.515) > 1e-3) console.error('cohomology-budget: crossing at L = ' + Lc);
      if (Math.abs(Math.pow(10, f[0](100)) - 5) > 1e-9 || Math.round(Math.exp(5)) !== 148) console.error('cohomology-budget: budget at x = 10^100 is not e^5');
      if (!holds(e, 1, Ls + 1e-6) || holds(e, 1, Ls - 0.5) || Ls < Lc) console.error('cohomology-budget: threshold L = ' + Ls);
    })();

    var Es = fig.slider({ label: 'Exponent', min: 0.002, max: 0.019, step: 0.001, value: 0.01, format: function (v) { return 'ε = ' + v.toFixed(3); } });
    var Cs = fig.slider({ label: 'Constant', min: 1, max: 100, step: 1, scale: 'log', value: 1, format: function (v) { return 'C = ' + v; } });
    var ef = fig.follow(0.01, { tau: 0.1 }), sf = fig.follow(lstar(0.01, 1), { tau: 0.1 });
    var P = fig.plane({ x: [0, LMAX], y: [-1, 60], pad: { t: 12, r: 16, b: 28, l: 40 } });
    fig.probe({ plane: P, snap: function (x) { var L = Kit.clamp(Math.round(x), 0, LMAX); return [L, lines(Es.value, Cs.value)[0](L)]; },
      rows: function (x) {
        var f = lines(Es.value, Cs.value), v = function (i) { return fmt.sig(Math.pow(10, f[i](x))); };
        return [['L', fmt(x)], [{ tex: 'eb' }, v(0), 'blue'], [{ tex: 'e2' }, v(1), 'gold'], [{ tex: 'em' }, v(2), 'teal'], [{ tex: 'ep' }, v(3), 'red']];
      } });

    return function draw() {
      var e = ef.to(Es.value).value, C = Cs.value, f = lines(e, C), b = P.box, narrow = b.w < 480;
      var Ls = sf.to(Math.min(lstar(Es.value, C), LMAX)).value, Lc = 5 * LG2 / e;
      P.grid();
      P.fillBetween(60, -1, Ls, LMAX, { color: 'blue', alpha: 0.07 });
      P.axes({ edge: true, xLabel: 'L', yLabel: narrow ? null : 'yl' });
      P.vline(Ls, { color: 'muted', width: 1.2, dash: [4, 4] });
      var tx = P.X(Ls) + 6, right = tx + 150 < b.r, ty = b.t + 0.6 * b.h, al = { color: 'muted', size: 11.5, align: right ? 'left' : 'right' };
      if (!right) tx = P.X(Ls) - 6;
      P.plot(f[3], { color: 'red', width: 2 });
      P.plot(f[2], { color: 'teal', width: 2 });
      P.plot(f[1], { color: 'gold', width: 2 });
      P.plot(f[0], { color: 'blue', width: 2.6 });
      if (Lc <= LMAX) P.point(Lc, f[1](Lc), { color: 'fg', r: 3.5 });
      var notes = ['large enough from L ≈ ' + fmt(Ls, 0), 'that is, x ≈ ' + fmt.pow10(Math.round(Ls)), '2-part crossing at L = ' + fmt(Lc, 1)];
      var nw = Math.max.apply(null, notes.map(function (t) { return fig.measure(t, 11.5, 500); }));
      fig.rect(right ? tx - 3 : tx - nw - 3, ty - 13, nw + 6, 52, { fill: 'stage', alpha: 0.85 });
      notes.forEach(function (t, i) { fig.text(t, tx, ty + 16 * i, al); });

      var lg = fig.legend(narrow ? [{ color: 'blue', text: 'budget', width: 2.6 }, { color: 'gold', text: '2-part' }, { color: 'teal', text: 'minus' }, { color: 'red', text: 'plus' }]
        : [{ color: 'blue', tex: 'bud', width: 2.6 }, { color: 'gold', tex: 'two' }, { color: 'teal', tex: 'minus' }, { color: 'red', tex: 'plus' }],
        { plane: P, x: b.l + 8, y: b.t + (narrow ? 6 : 26), dir: narrow ? 'row' : 'col', size: narrow ? 12 : 13 });
      fig.label(narrow ? 'budS' : 'prod', lg.x + 2, lg.y + lg.h + 6, { anchor: 'nw', color: narrow ? 'blue' : 'muted', size: narrow ? 11.5 : 12 });
    };
  }
});
