/* Lambda as stems, psi as their running total hugging y = x, theta (primes only) beneath it, and the dictionary that
   rebuilds pi from psi. Everything is exact on the integers up to 1000. Between integers psi is constant, so the integral
   in R(x) = psi(x)/log x + int_2^x psi(t)/(t log^2 t) dt is a sum of terms psi(n) (1/log n - 1/log (n+1)), and R is
   constant on each [n, n+1), equal to J there. The tables are built in a job (after the shared sieve), which checks
   that |J - R| < 1e-9 at every integer and throws otherwise; until it is done the figure draws its axes. */
Kit.register('chebyshev-psi', {
  tex: {
    Lam: '\\Lambda(n)', psi: '\\psi(x)', theta: '\\vartheta(x)', line: 'y = x', band: '\\pm\\sqrt{x}',
    pi: '\\pi(x)', J: 'J(x)', R: 'R(x)',
    Jlong: 'J(x)=\\pi(x)+\\tfrac12\\pi(x^{1/2})+\\tfrac13\\pi(x^{1/3})+\\cdots',
    Rlong: 'R(x)=\\dfrac{\\psi(x)}{\\log x}+\\displaystyle\\int_2^x\\dfrac{\\psi(t)}{t\\log^2 t}\\,\\mathrm{d}t'
  },
  init: function (fig) {
    var M = Kit.math, LIM = 1000, SUP = '⁰¹²³⁴⁵⁶⁷⁸⁹';
    var ready = false, psiS, piS, thX, thY, pw, pk, pp, xi, Jn, Rn, runMax;
    function* tables() {
      psiS = M.psiSteps(LIM); piS = M.piSteps(LIM);
      var th = [], acc = 0, ps = M.primes(LIM);
      for (var i = 0; i < ps.length; i++) th.push(acc += Math.log(ps[i]));
      thX = Float64Array.from(ps); thY = Float64Array.from(th);
      yield 0.1;

      // prime powers n = p^k, with k, for the stems and their labels
      pw = []; pk = {}; pp = {};
      for (var n = 2; n <= LIM; n++) {
        if (M.vonMangoldt(n) === 0) continue;
        var p = 2; while (n % p) p++;
        var kk = 0, q = n; while (q % p === 0) { q /= p; kk++; }
        pw.push(n); pk[n] = kk; pp[n] = p;
        if (n % 100 === 0) yield 0.1 + 0.3 * n / LIM;
      }
      // J(x) as a sum of pi(x^(1/k)) / k, and R(x) from psi; both on the integers
      function iroot(x, k) { var r = Math.floor(Math.pow(x, 1 / k) + 1e-9); while (Math.pow(r + 1, k) <= x) r++; while (Math.pow(r, k) > x) r--; return r; }
      xi = new Float64Array(LIM - 1); Jn = new Float64Array(LIM - 1); Rn = new Float64Array(LIM - 1); runMax = new Float64Array(LIM + 1);
      var G = 0, worst = 0;
      for (var m = 2; m <= LIM; m++) {
        var J = 0; for (var k = 1; Math.pow(2, k) <= m; k++) J += M.pi(iroot(m, k)) / k;
        var R = M.psi(m) / Math.log(m) + G;
        xi[m - 2] = m; Jn[m - 2] = J; Rn[m - 2] = R;
        worst = Math.max(worst, Math.abs(J - R)); runMax[m] = worst;
        G += M.psi(m) * (1 / Math.log(m) - 1 / Math.log(m + 1));
        if (m % 100 === 0) yield 0.4 + 0.6 * m / LIM;
      }
      if (!(worst < 1e-9)) throw new Error('chebyshev-psi: J and R differ by ' + worst);
    }
    fig.job(M.sieveTask(LIM), { onDone: function () { fig.job(tables, { onDone: function () { ready = true; } }); } });

    var mode = fig.select({ label: 'Show', options: [['psi', 'ψ and the weights Λ'], ['theta', 'ψ against ϑ (primes only)'], ['dict', 'Rebuild π from ψ']], value: 'psi' });
    var N0 = function (v) { return 10 * Math.pow(100, v); };
    var play = fig.player({ duration: 16, label: 'Up to N', reduced: 0.5, autoplay: false, format: function (v) { return String(Math.round(N0(v))); } });
    play.set(0.5);
    fig.onReset = function () { play.set(0.5); };

    var top = fig.plane({ x: [0, 100], y: [0, 5], box: [0, 0, 1, 0.3], pad: { t: 8, r: 16, b: 6, l: 52 } });
    var bot = fig.plane({ x: [0, 100], y: [0, 108], box: [0, 0.33, 1, 1], pad: { t: 6, r: 16, b: 30, l: 52 } });
    var one = fig.plane({ x: [0, 100], y: [0, 100], pad: { t: 14, r: 16, b: 30, l: 52 } });
    var Nnow = 100;
    var cur = fig.drag({ plane: bot, x: 49, y: 0, r: 6, color: 'fg',
      constrain: function (x) { return [Kit.clamp(Math.round(x), 2, Math.floor(Nnow + 1e-9)), 0]; } });
    var fmtN = function (v) { return Kit.fmt(Math.round(v)); };
    var f2 = function (v, d) { return (v < 0 ? '−' : v > 0 ? '+' : '') + Math.abs(v).toFixed(d); };

    function box(rows, hint, B) {       // readout panel in the lower right of plane box B
      var narrow = fig.w < 600, w = narrow ? 156 : 190, rh = narrow ? 14 : 15, bh = 12 + rh * rows.length + (hint && !narrow ? 15 : 0);
      var bx = B.r - w - 6, by = B.b - bh - 8;
      fig.rect(bx, by, w, bh, { fill: 'stage', alpha: 0.88 });
      for (var r = 0; r < rows.length; r++) {
        fig.text(rows[r][0], bx + 10, by + 18 + rh * r, { color: 'muted', size: 11.5, mono: true });
        fig.text(rows[r][1], bx + w - 10, by + 18 + rh * r, { color: rows[r][2] || 'fg', size: 11.5, mono: true, align: 'right' });
      }
      if (hint && !narrow) fig.text('drag the dot', bx + 10, by + 18 + rh * rows.length - 1, { color: 'muted', size: 10.5 });
    }

    function drawPsi(N, g, nNew, theta, ctx) {
      var B = bot.box, T = top.box, n = cur.x;
      top.view.x1 = bot.view.x1 = N + 0.6; top.view.y1 = 1.15 * Math.log(Math.max(N, 10)); bot.view.y1 = 1.08 * N;
      top.update(); bot.update();
      var xs = M.niceStep(N, B.w, 90);
      top.grid({ xStep: xs }); top.axes({ x: false, yStep: T.h < 90 ? 2 : 1 }); bot.grid({ xStep: xs }); bot.axes({ x: true, origin: [0, 0], xStep: xs, format: fmtN });
      fig.line(T.l, T.b, T.r, T.b, { color: 'muted', width: 1 });
      // stems: primes solid, higher prime powers lighter; the newest one grows in while playing
      var spacing = T.w / (N + 1), wd = Kit.clamp(spacing * 0.55, 1.1, 2.6), placed = [];
      for (var pass = 0; pass < 2; pass++) {
        fig.stroke({ color: 'gold', width: wd, alpha: pass ? 0.4 : 1 });
        ctx.beginPath();
        for (var i = 0; i < pw.length && pw[i] <= N + 1e-9; i++) {
          var q = pw[i];
          if ((pk[q] > 1) !== (pass === 1)) continue;
          var h = M.vonMangoldt(q) * (q === nNew ? g : 1), sx = Math.round(top.X(q)) + 0.5;
          ctx.moveTo(sx, T.b); ctx.lineTo(sx, top.Y(h));
          if (pass === 1 && N <= 100) {                          // p^k over its stem, or one line higher, never over another label
            var lab = pp[q] + SUP[pk[q]], lx = top.X(q), half = 3.4 + 3.2 * lab.length;
            for (var lift = 0; lift < 2; lift++) {
              var ly = top.Y(h) - 4 - 11 * lift, free = true;
              for (var pi2 = 0; pi2 < placed.length && free; pi2++) free = Math.abs(placed[pi2][0] - lx) > placed[pi2][2] + half + 2 || Math.abs(placed[pi2][1] - ly) > 11;
              if (free) { fig.text(lab, lx, ly, { color: 'gold', size: 10.5, align: 'center', alpha: 0.8 }); placed.push([lx, ly, half]); break; }
            }
          }
        }
        ctx.stroke();
      }
      if (M.vonMangoldt(n) > 0) top.segment(n, 0, n, M.vonMangoldt(n), { color: 'fg', width: wd + 1.4 });
      fig.label('Lam', T.l + 10, T.t + 4, { anchor: 'nw', color: 'gold' });

      // psi (and theta), then the line y = x with its sqrt(x) band
      bot.fillBetween(function (x) { return x + Math.sqrt(x); }, function (x) { return x - Math.sqrt(x); }, 0, N + 0.6, { color: 'muted', alpha: 0.2 });
      bot.plot(function (x) { return x; }, { color: 'blue', width: 1.8 });
      if (theta) bot.stairs(thX, thY, { color: 'red', width: 2, to: N });
      var partial = g < 1 && M.vonMangoldt(nNew) > 0;
      bot.stairs(psiS.xs, psiS.ys, { color: 'gold', width: 2.4, to: partial ? nNew - 1e-6 : N });
      if (partial) {
        var y0 = M.psi(nNew - 1), y1 = y0 + g * M.vonMangoldt(nNew);
        bot.segment(nNew, y0, nNew, y1, { color: 'gold', width: 2.4 }); bot.segment(nNew, y1, N, y1, { color: 'gold', width: 2.4 });
      }
      bot.label('line', N * 0.92, N * 0.92, { anchor: 'se', color: 'blue', dx: -4, dy: -12 });
      bot.label('psi', N * 0.42, M.psi(N * 0.42), { anchor: 'se', color: 'gold', dx: -6, dy: -8 });
      if (fig.w < 600) bot.label('band', N * 0.7, N * 0.7 - Math.sqrt(N * 0.7), { anchor: 'nw', color: 'muted', dx: 4, dy: 2 });   // on a phone, clear of the psi label
      else bot.label('band', N * 0.2, N * 0.2 + Math.sqrt(N * 0.2), { anchor: 'sw', color: 'muted', dx: -4, dy: -4 });
      if (theta) bot.label('theta', N * 0.84, thY[M.pi(N * 0.84) - 1], { anchor: 'n', color: 'red', dy: 14 });

      cur.plane = bot; cur.y = M.psi(n);
      fig.line(bot.X(n), T.t, bot.X(n), B.b, { color: 'fg', width: 1, alpha: 0.4, dash: [3, 4] });
      if (M.vonMangoldt(n) > 0) bot.segment(n, M.psi(n - 1), n, M.psi(n), { color: 'fg', width: 3 });
      var L = M.vonMangoldt(n), narrow = fig.w < 600, rows = [['n', String(n) + (pk[n] > 1 ? ' = ' + pp[n] + SUP[pk[n]] : '')],
        ['Λ(n)', L > 0 ? 'log ' + pp[n] + ' = ' + L.toFixed(narrow ? 2 : 3) : '0'], ['ψ(n)', M.psi(n).toFixed(2)], ['ψ(n) − n', f2(M.psi(n) - n, 2), 'gold']];
      if (theta) rows.push(['ϑ(n) − n', f2(thY[M.pi(n) - 1] - n, 2), 'red']);
      if (narrow) rows.splice(2, 1);                                // on a phone the panel must stay under the dot: psi(n) - n says it
      box(rows, true, B);
    }

    function drawDict(N, g, nNew, ctx) {
      var B = one.box, n = cur.x;
      one.view.x1 = N + 0.6; one.view.y1 = M.Li(N) * 1.14; one.update();
      var xs = M.niceStep(N, B.w, 90);
      one.grid({ xStep: xs }); one.axes({ origin: [0, 0], xStep: xs, format: fmtN });
      one.stairs(xi, Rn, { color: 'blue', width: 4, alpha: 0.85, to: N });
      one.stairs(xi, Jn, { color: 'gold', width: 1.4, dash: [5, 4], to: N });
      one.stairs(piS.xs, piS.ys, { color: 'gold', width: 2.4, to: N });
      var wide = fig.w >= 600, rows = [['gold', 'pi', null, 2.4], ['gold', wide ? 'Jlong' : 'J', [5, 4], 1.4], ['blue', wide ? 'Rlong' : 'R', null, 4]];
      var ly = B.t + 16;
      for (var i = 0; i < rows.length; i++) {
        fig.line(B.l + 12, ly, B.l + 38, ly, { color: rows[i][0], width: rows[i][3], dash: rows[i][2] });
        fig.label(rows[i][1], B.l + 48, ly, { anchor: 'w', color: 'fg' });
        ly += i === 0 ? 28 : (wide ? 42 : 26);
      }
      cur.plane = one; cur.y = Jn[n - 2];
      one.segment(n, 0, n, Jn[n - 2], { color: 'fg', width: 1, alpha: 0.4, dash: [3, 4] });
      var d = Jn[n - 2] - Rn[n - 2];
      var dr = [['x', String(n)], ['π(x)', String(M.pi(n)), 'gold'], ['J(x)', Jn[n - 2].toFixed(4), 'gold'], ['R(x)', Rn[n - 2].toFixed(4), 'blue'],
        ['J − R', d.toExponential(1), 'fg'], ['max |J−R|', runMax[n].toExponential(1), 'muted']];
      box(fig.w < 600 ? [['x', n + '  π=' + M.pi(n)], dr[2], dr[3], dr[4]] : dr, true, B);
    }

    return function draw() {
      var ctx = fig.ctx, raw = N0(play.value), N = play.playing ? raw : Math.round(raw);
      Nnow = N;
      var nNew = Math.floor(N + 1e-9), g = N - nNew < 1e-9 ? 1 : N - nNew;
      cur.x = Kit.clamp(cur.x, 2, nNew);
      if (!ready) {
        var B = one.box;
        one.view.x1 = N + 0.6; one.view.y1 = 1.08 * N; one.update();
        one.grid(); one.axes({ origin: [0, 0], format: fmtN });
        fig.text('counting primes', B.l + B.w / 2, B.t + B.h / 2, { color: 'muted', size: 12.5, align: 'center' });
        cur.plane = one; cur.y = 0;
        return;
      }
      if (mode.value === 'dict') drawDict(N, g, nNew, ctx); else drawPsi(N, g, nNew, mode.value === 'theta', ctx);
    };
  }
});
