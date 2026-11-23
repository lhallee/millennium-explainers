/* The push of one hypothetical zero on G_0, against a ceiling C X^alpha. Every curve is divided by sqrt(X) and drawn
   on the symmetric log scale y = asinh(v / 0.05) over log10 X in [1, 16]. Gold: (G_0(X) - log 2 pi) / sqrt(X) from a
   sieve up to 10^6, G_0(X) = X sum_{n <= X} Lambda(n)/n - psi(X) - X log X + (1 + gamma_E) X; beyond 10^6 the band
   +-c0 that the zeros on the line allow. Red: the wave w(X) = 2 Re(c X^rho), c = -1/(rho (rho - 1)), of a pair
   rho = beta +- i gamma, or w(X) = X^beta / (beta (1 - beta)) for a single real zero (gamma = 0). Blue dashed: the
   ceiling C X^alpha. Red dots: crests of the wave above the ceiling. Checked against the chapter at startup. */
Kit.register('zero-push', {
  tex: { G0: 'G_0(X)-\\log 2\\pi', band: '\\pm c_0\\sqrt X', ceil: 'CX^{\\alpha}', X: 'X', ylab: '\\div\\sqrt X', rho: '\\rho' },
  init: function (fig) {
    var M = Kit.math, fmt = Kit.fmt, EG = 0.5772156649015329, L2P = Math.log(2 * Math.PI), C0 = 0.0461914, S0 = 0.05;
    var LIM = 1e6, NG = 1500, U0 = Math.log(10), U1 = 16 * Math.LN10;
    var T = function (v) { return Math.asinh(v / S0); };
    var err = function (msg) { console.error('zero-push: ' + msg); };

    var bS = fig.slider({ label: 'Real part', min: 0.5, max: 0.99, step: 0.01, value: 0.8, format: function (v) { return 'β = ' + v.toFixed(2); } });
    var gS = fig.slider({ label: 'Height', min: 0, max: 40, step: 0.1, value: 14,
      format: function (v) { return v === 0 ? 'γ = 0, real' : 'γ = ' + v.toFixed(1); } });
    var aS = fig.slider({ label: 'Ceiling exponent', min: 0.5, max: 0.95, step: 0.01, value: 0.6, format: function (v) { return 'α = ' + v.toFixed(2); } });
    var cS = fig.slider({ label: 'Ceiling constant', min: 0.01, max: 100, scale: 'log', value: 1, marks: [1],
      format: function (v) { return 'C = ' + fmt.sig(v); } });

    var P = fig.plane({ x: [1, 16], y: [-10, 10], pad: { t: 22, r: 14, b: 30, l: 50 } });
    var yCam = fig.follow(10, { tau: 0.1 }), yLo = fig.follow(10, { tau: 0.1 });

    // (G_0(X) - log 2 pi) / sqrt(X) on a log grid from 10 to 10^6, in one pass over n once the shared sieve is ready.
    var gx = new Float64Array(NG), gy = new Float64Array(NG), gReady = false, G6 = NaN;
    for (var i = 0; i < NG; i++) gx[i] = 1 + 5 * i / (NG - 1);
    fig.job(M.sieveTask(LIM), { onDone: function () {
      fig.job(function* () {
        var A = 0, comp = 0, psi = 0, n = 2;
        for (var j = 0; j < NG; j++) {
          var X = j === NG - 1 ? LIM : Math.pow(10, gx[j]);
          for (; n <= X; n++) {
            var L = M.vonMangoldt(n);
            if (L) { var y = L / n - comp, t = A + y; comp = (t - A) - y; A = t; psi += L; }   // Kahan sum of Lambda(n)/n
          }
          var G = X * A - psi - X * Math.log(X) + (1 + EG) * X;
          gy[j] = T((G - L2P) / Math.sqrt(X));
          if (j === NG - 1) G6 = G;
          if ((j & 31) === 31) yield j / NG;
        }
        if (!(Math.abs(G6 - 11.040436) < 1e-3)) err('G_0(10^6) = ' + G6 + ', the chapter prints 11.040436');
        gReady = true;
      });
    } });

    /* The wave's parameters: amplitude A and phase th with w(X) = A X^beta cos(gamma u + th), u = log X (real zero: th = 0). */
    function wave(b, g) {
      if (g === 0) return { A: 1 / (b * (1 - b)), th: 0, real: true };
      var re = b * b - b - g * g, im = 2 * b * g - g, d = re * re + im * im;      // rho (rho - 1)
      var cr = -re / d, ci = im / d;                                             // c = -1 / (rho (rho - 1))
      return { A: 2 * Math.hypot(cr, ci), th: Math.atan2(ci, cr), real: false };
    }
    var w0 = wave(0.8, 14), xEnv0 = Math.pow(1 / w0.A, 1 / 0.2);
    if (Math.abs(w0.A - 0.010186) > 5e-7) err('amplitude for 0.8 + 14i is ' + w0.A + ', the chapter prints 0.010186');
    if (Math.abs(xEnv0 / 9.1e9 - 1) > 0.006) err('envelope crossing is ' + xEnv0 + ', the chapter prints 9.1e9');
    if (Math.abs(wave(0.8, 0).A - 6.25) > 1e-12) err('real zero at 0.8 does not give 6.25 X^0.8');

    var NS = 9000, wu = new Float64Array(NS), wv = new Float64Array(NS), crx = [], cry = [], key = '', st = null;
    function update(b, g, a, C) {
      var k = b + ',' + g + ',' + a + ',' + C;
      if (k === key) return; key = k;
      var w = wave(b, g), n = Kit.clamp(Math.ceil((U1 - U0) * Math.max(g, 1) / (2 * Math.PI) * 14), 800, NS), ymax = T(C * Math.pow(1e16, a - 0.5));
      for (var i = 0; i < n; i++) {
        var u = U0 + (U1 - U0) * i / (n - 1), v = w.A * Math.exp((b - 0.5) * u) * (w.real ? 1 : Math.cos(g * u + w.th));
        wu[i] = u / Math.LN10; wv[i] = T(v); ymax = Math.max(ymax, Math.abs(wv[i]));
      }
      // First violation: the first u where w(X) > C X^alpha. f is largest in each period at a crest of
      // e^((beta - alpha) u) cos(gamma u + th); the first crest with f > 0 is found, then the crossing before it by bisection.
      var f = function (u) { return w.A * Math.exp((b - a) * u) * (w.real ? 1 : Math.cos(g * u + w.th)) - C; };
      var bisect = function (lo, hi) { for (var r = 0; r < 50; r++) { var m = (lo + hi) / 2; if (f(m) > 0) hi = m; else lo = m; } return hi; };
      var first = NaN;
      if (f(U0) > 0) first = U0;
      else if (w.real) { if (b > a && f(U1) > 0) first = bisect(U0, U1); }
      else {
        var pf = Math.atan((b - a) / g) - w.th;
        for (var mf = Math.ceil((g * U0 - pf) / (2 * Math.PI)); ; mf++) {
          var uf = (pf + 2 * Math.PI * mf) / g;
          if (uf > U1) { if (f(U1) > 0) first = bisect(Math.max(U0, uf - Math.PI / g), U1); break; }
          if (f(uf) > 0) { first = bisect(Math.max(U0, uf - Math.PI / g), uf); break; }
        }
      }
      // Crests of the plotted curve (extrema of X^(beta - 1/2) cos(gamma u + th)) where the wave is above the ceiling.
      crx.length = 0; cry.length = 0;
      if (!w.real) {
        var ph = Math.atan((b - 0.5) / g) - w.th, m0 = Math.ceil((g * U0 - ph) / (2 * Math.PI));
        for (var mm = m0; ; mm++) {
          var uc = (ph + 2 * Math.PI * mm) / g;
          if (uc > U1) break;
          if (f(uc) > 0) { crx.push(uc / Math.LN10); cry.push(T(w.A * Math.exp((b - 0.5) * uc) * Math.cos(g * uc + w.th))); }
        }
      }
      var env = b > a ? Math.pow(C / w.A, 1 / (b - a)) : NaN;
      st = { n: n, w: w, first: first, env: env, ymax: Kit.clamp(ymax * 1.06, T(5), 30) };
    }

    function tickText(v) {
      var a = Math.abs(v), s = a < 1 ? a.toFixed(a < 0.1 ? 2 : 1) : a < 1e5 ? fmt(a) : fmt.sci(a, 0);
      return (v < 0 ? '−' : '') + s;
    }
    function xText(X) { return X < 10.5 ? 'from the start' : 'X = ' + fmt.sci(X, 1); }

    return function draw() {
      var b = bS.value, g = gS.value, a = aS.value, C = cS.value, narrow = fig.w < 560;
      update(b, g, a, C);
      // a real zero's wave is positive, so the lower half only needs room for the band
      var ym = yCam.to(st.ymax).value, yl = yLo.to(st.w.real ? T(50) : st.ymax).value;
      P.view.y0 = -yl; P.view.y1 = ym; P.update();

      var yt = [[0, '0']];
      for (var v = S0; T(v) < Math.max(ym, yl); v *= 10) { if (T(v) < ym) yt.push([T(v), tickText(v)]); if (T(v) < yl) yt.push([T(-v), tickText(-v)]); }
      var xt = [], xs = narrow ? 3 : 1;
      for (var k = 1; k <= 16; k += xs) xt.push([k, k === 1 ? '10' : fmt.pow10(k)]);
      P.grid({ xTicks: xt.map(function (t) { return t[0]; }), yTicks: yt.map(function (t) { return t[0]; }) });
      P.axes({ edge: true, xTicks: xt, yTicks: yt, size: narrow ? 10.5 : 11.5 });
      P.hline(0, { color: 'muted', width: 1 });
      fig.label('X', P.box.r, P.box.b + 22, { anchor: 'e', color: 'muted', size: 12.5 });
      fig.label('ylab', P.box.l - 8, P.box.t - 3, { anchor: 'se', color: 'muted', size: 12 });

      // the true G_0 from primes, then the band the zeros on the line allow
      P.fillBetween(T(C0), T(-C0), 6, 16, { color: 'gold', alpha: 0.16 });
      if (gReady) P.path(gx, gy, { color: 'gold', width: 2 });
      else P.text('summing primes to 10⁶', 3.5, T(0.3), { color: 'muted', size: 11.5, align: 'center' });

      P.plot(function (x) { return T(C * Math.pow(10, x * (a - 0.5))); }, { color: 'blue', width: 2, dash: [7, 5] });
      P.path(wu.subarray(0, st.n), wv.subarray(0, st.n), { color: 'red', width: 1.6 });
      for (var j = 0; j < crx.length; j++) P.point(crx[j], cry[j], { color: 'red', r: 3.2 });
      if (st.w.real && st.first === st.first) P.point(st.first / Math.LN10, T(st.w.A * Math.exp((b - 0.5) * st.first)), { color: 'red', r: 4.5 });

      fig.legend([
        { color: 'gold', tex: 'G0', width: 2 },
        !narrow && { color: 'gold', fill: true, alpha: 0.3, tex: 'band' },
        { color: 'red', text: narrow ? 'hypothetical zero' : 'wave of a hypothetical zero', width: 1.6 },
        { color: 'blue', tex: 'ceil', dash: [7, 5], width: 2 }
      ], { plane: P, at: 'auto', prefer: ['nw', 'sw'], size: narrow ? 11.5 : 13 });
      var rhoTxt = st.w.real ? fmt(b, 2) + ', real' : fmt.complex(b, g, 2);
      var envTxt = st.env === st.env ? (st.env > 1e16 ? 'beyond 10¹⁶' : xText(st.env)) : 'never, β ≤ α';
      var firstTxt = st.first === st.first ? xText(Math.exp(st.first)) : 'none below 10¹⁶';
      fig.panel(narrow ? [[{ tex: 'rho' }, rhoTxt, 'red'], ['first violation', firstTxt, 'red']] : [
        [{ tex: 'rho' }, rhoTxt, 'red'],
        ['amplitude', st.w.real ? fmt(st.w.A, 3) : fmt(st.w.A, 6)],
        ['envelope passes ceiling', envTxt],
        ['first violation', firstTxt, 'red']
      ], { plane: P, at: 'auto', prefer: ['nw', 'sw'], id: 'read' });
    };
  }
});
