/* Why evaluation right of the strip is not continuous on W_a. phi_n(t) = t^{-x0} beta(log t - n) is a normalized bump
   on log t in (n, n + 1), tilted by t^{-x0}. In u = log t the evaluation at x0 sees phi_n(e^u) e^{x0 u} = beta(u - n),
   a bump of area 1 that only slides, while the norm sees phi_n(e^u) e^{a|u|} = e^{-(x0 - a) u} beta(u - n), which
   dies exponentially. Edge mode (x0 = a) replaces the bump by the plateau B_N(u) / N, N = n + 2, whose norm decays like
   N^(-1/2). The bars are trapezoid sums on 200 intervals of (0, 1), as in the chapter's example. */
Kit.register('sp-escape', {
  tex: {
    a: 'a', x0: 'x_0', u: 'u = \\log t',
    see: '\\phi_n(e^u)\\,e^{x_0 u}', nrm: '\\phi_n(e^u)\\,e^{a\\lvert u\\rvert}', seeE: '\\phi_N(e^u)\\,e^{a u}',
    seeL: '\\phi_n(e^u)\\,e^{x_0 u}\\text{, whose area is } M\\phi_n(x_0)',
    nrmL: '\\phi_n(e^u)\\,e^{a\\lvert u\\rvert}\\text{, whose square has area } \\lVert\\phi_n\\rVert_a^2',
    seeEL: '\\phi_N(e^u)\\,e^{a u}\\text{, whose area is } M\\phi_N(a)',
    nrmEL: '\\text{the same; its square has area } \\lVert\\phi_N\\rVert_a^2',
    Mx: 'M\\phi_n(x_0)', Nn: '\\lVert\\phi_n\\rVert_a', M0: 'M\\phi_n(0)',
    MxE: 'M\\phi_N(a)', NnE: '\\lVert\\phi_N\\rVert_a', M0E: 'M\\phi_N(0)'
  },
  init: function (fig) {
    var fmt = Kit.fmt, K = 200, h = 1 / K, BARS = 104;
    // beta(v) = C exp(-1/(1 - (2v - 1)^2)) on (0, 1) with integral 1; the edge ramp is the smooth step e^{-1/v} / (e^{-1/v} + e^{-1/(1-v)}).
    var b0 = function (v) { var x = 2 * v - 1; return x > -1 && x < 1 ? Math.exp(-1 / (1 - x * x)) : 0; };
    var vs = new Float64Array(K + 1), bt = new Float64Array(K + 1), rp = new Float64Array(K + 1), tw = new Float64Array(K + 1);
    var I0 = 0, ir = 0, ir2 = 0, i;
    for (i = 0; i <= K; i++) {
      vs[i] = i * h; tw[i] = (i === 0 || i === K ? 0.5 : 1) * h;
      var f0 = i === 0 ? 0 : Math.exp(-1 / vs[i]), f1 = i === K ? 0 : Math.exp(-1 / (1 - vs[i]));
      rp[i] = f0 / (f0 + f1); bt[i] = b0(vs[i]); I0 += tw[i] * bt[i];
    }
    var C = 1 / I0, BMAX = C * Math.exp(-1);
    for (i = 0; i <= K; i++) { bt[i] *= C; ir += tw[i] * rp[i]; ir2 += tw[i] * rp[i] * rp[i]; }
    var beta = function (v) { return C * b0(v); };
    var ramp = function (v) { if (v <= 0) return 0; if (v >= 1) return 1; var f0 = Math.exp(-1 / v), f1 = Math.exp(-1 / (1 - v)); return f0 / (f0 + f1); };

    var play = fig.player({ label: 'Push out', min: 0, max: 40, duration: 6, loop: false, autoplay: true, reduced: 0.25,
      format: function (n) { var r = Math.round(n * 10) / 10; return 'n = ' + fmt(r, r % 1 ? 1 : 0); } });
    var A = fig.slider({ label: 'Strip half-width', tex: 'a', min: 0.02, max: 0.45, step: 0.01, value: 0.1,
      format: function (v) { return v.toFixed(2); }, onInput: function (v) { if (X0.value < v) X0.set(v); } });
    var X0 = fig.slider({ label: 'Evaluation point', tex: 'x0', min: 0.02, max: 0.8, step: 0.01, value: 0.3,
      format: function (v) { return v.toFixed(2); }, onInput: function (v) { if (v < A.value) X0.set(A.value); } });
    var edge = fig.toggle({ label: 'Edge mode', value: false });
    var yTop = fig.follow(2.2, { tau: 0.15 });
    var T = fig.plane({ x: [-2, 45], y: [0, 2.2], pad: { t: 10, r: 16, b: 28, l: 44 },
      box: function (w, hh) { return [0, 0, w, hh - BARS]; } });

    /* The three numbers: [M phi(x0), ||phi||_a, M phi(0)]. */
    function numbers(n, a, x0, ed, out) {
      var s0 = 0, s1 = 0, s2 = 0, j;
      if (!ed) {
        for (j = 0; j <= K; j++) {
          var u = n + vs[j];
          s0 += tw[j] * bt[j];
          s1 += tw[j] * bt[j] * bt[j] * Math.exp(-2 * (x0 - a) * u);
          s2 += tw[j] * bt[j] * Math.exp(-x0 * u);
        }
        out[0] = s0; out[1] = Math.sqrt(s1); out[2] = s2;
        return;
      }
      var N = n + 2;
      for (j = 0; j <= K; j++) s2 += tw[j] * rp[j] * (Math.exp(-a * vs[j]) + Math.exp(-a * (N - vs[j])));
      out[0] = (N - 2 + 2 * ir) / N;
      out[1] = Math.sqrt(N - 2 + 2 * ir2) / N;
      out[2] = (s2 + (Math.exp(-a) - Math.exp(-a * (N - 1))) / a) / N;
    }
    var vals = [0, 0, 0];
    var show = function (v) { return v >= 1e-3 ? fmt(v, 4) : fmt.sci(v, 2); };

    return function draw() {
      var n = play.mapped, a = A.value, ed = edge.value, x0 = ed ? a : X0.value, N = n + 2;
      X0.show(!ed);
      numbers(n, a, x0, ed, vals);
      var lift = function (u) { return Math.exp(-(x0 - a) * u) * beta(u - n); };
      var plateau = function (u) { return (u < 1 ? ramp(u) : u > N - 1 ? ramp(N - u) : 1) / N; };

      // Top: the function as the evaluation sees it (gold outline) and as the norm sees it (red fill).
      var tb = T.box, narrow = fig.w < 560, room = narrow ? 46 : 54;
      var peak = ed ? 0.5 : BMAX;
      T.view.y1 = yTop.to(peak * 1.04 * Math.max(tb.h, 60) / Math.max(40, tb.h - room)).value; T.update();
      T.grid({ xStep: 5 });
      if (!ed) {
        T.plot(function (u) { return u < 0 ? NaN : BMAX * Math.exp(-(x0 - a) * u); }, { color: 'red', width: 1.2, dash: [4, 4], alpha: 0.6 });
        T.fillBetween(lift, 0, n, n + 1, { color: 'red', alpha: 0.4, edges: { color: 'red', width: 1.6 } });
        T.plot(function (u) { return beta(u - n); }, { color: 'gold', width: 2.2, from: n, to: n + 1, step: 2 });
      } else {
        T.fillBetween(plateau, 0, 0, N, { color: 'red', alpha: 0.4, edges: { color: 'red', width: 1.6 } });
        T.plot(plateau, { color: 'gold', width: 2.2, from: 0, to: N, step: 2 });
      }
      T.axes({ edge: true, xStep: 5, xLabel: 'u' });
      if (ed) fig.text('N = n + 2 = ' + fmt(Math.round(N * 10) / 10, N % 1 > 0.05 ? 1 : 0), tb.l + 10, tb.t + 14, { color: 'muted', size: 12.5 });
      var red = { color: 'red', fill: true, alpha: 0.4 };
      red[narrow && ed ? 'text' : 'tex'] = narrow ? (ed ? 'the same, for the norm' : 'nrm') : (ed ? 'nrmEL' : 'nrmL');
      fig.legend([{ color: 'gold', tex: narrow ? (ed ? 'seeE' : 'see') : (ed ? 'seeEL' : 'seeL') }, red],
        { plane: T, dir: narrow ? 'row' : 'col', at: 'ne', size: narrow ? 11.5 : 13 });

      // Bottom: three bars on a common scale from 0 to 1.25.
      var labW = narrow ? 70 : 86, valW = narrow ? 88 : 150, bx0 = labW + 14, bx1 = fig.w - valW;
      var top = fig.h - BARS + 10, rh = (BARS - 18) / 3, sc = (bx1 - bx0) / 1.25;
      var keys = ed ? ['MxE', 'NnE', 'M0E'] : ['Mx', 'Nn', 'M0'], cols = ['gold', 'red', 'blue'];
      fig.line(bx0 + 0.5, top - 2, bx0 + 0.5, top + 3 * rh, { color: 'muted', width: 1 });
      fig.line(bx0 + sc, top - 2, bx0 + sc, top + 3 * rh, { color: 'muted', width: 1, dash: [3, 4], alpha: 0.7 });
      fig.text('1', bx0 + sc, top - 4, { color: 'muted', size: 10.5, align: 'center' });
      for (var k = 0; k < 3; k++) {
        var cy = top + rh * (k + 0.5), len = Math.max(0, Math.min(1.25, vals[k])) * sc;
        fig.label(keys[k], labW + 4, cy, { anchor: 'e', color: cols[k], size: narrow ? 12 : 13.5 });
        fig.rect(bx0 + 1, cy - rh * 0.3, len, rh * 0.6, { fill: cols[k], alpha: 0.85 });
        var txt = show(vals[k]);
        if (k === 1 && ed && !narrow) txt += '   (1/√N = ' + show(1 / Math.sqrt(N)) + ')';
        fig.text(txt, bx0 + len + 8, cy, { color: cols[k], size: narrow ? 11.5 : 12.5, baseline: 'middle', weight: 600 });
      }
    };
  }
});
