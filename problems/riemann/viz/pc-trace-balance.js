/* The trace on the circle R_{>0} / lambda^Z computed twice. Top: the test function f(u) = phi(e^u), a bump of
   half-width r at c, with gold bars at the orbit points u = k log lambda (orbit side: log lambda * sum_k phi(lambda^k)).
   Bottom: the eigenvalues Re M phi(z_m) as teal stems for |m| <= 12 and the running partial sums S_N (frequency side).
   The frequency readout sums every |m| up to the point where the bump's Fourier transform is below about 1e-8 of its
   peak, so it is the full series and not S_12; the chart shows how the first terms approach it. */
Kit.register('pc-trace-balance', {
  tex: {
    f: 'f(u)=\\varphi(e^u)', u: 'u=\\log t', m: 'm', lambda: '\\lambda', r: 'r',
    stem: '\\operatorname{Re} M\\varphi(z_m)', SN: 'S_N', orbitLine: '\\log\\lambda\\textstyle\\sum_k\\varphi(\\lambda^k)',
    freq: '\\textstyle\\sum_m M\\varphi(z_m)', orbit: '\\log\\lambda\\textstyle\\sum_k\\varphi(\\lambda^k)'
  },
  init: function (fig) {
    var fmt = Kit.fmt, NM = 12, NX = 200, HX = 1 / NX, KMAX = 160, PEAK = Math.exp(-1);
    var bx = new Float64Array(NX + 1);                         // bump(x) at x = j / NX, j = 0..NX (bump is even)
    for (var j = 0; j < NX; j++) { var x = j * HX; bx[j] = Math.exp(-1 / (1 - x * x)); }
    var bump = function (x) { return Math.abs(x) < 1 ? Math.exp(-1 / (1 - x * x)) : 0; };
    var stemX = [], stemY = new Float64Array(2 * NM + 1), sumX = [], sumY = new Float64Array(NM + 1);
    for (var m = -NM; m <= NM; m++) stemX.push(m);
    for (var n = 0; n <= NM; n++) sumX.push(n);
    var res = { key: '', freq: 0, orbit: 0, terms: 0, ymax: 0.3 };

    var lam = fig.slider({ label: 'Circle period', tex: 'lambda', min: 1.3, max: 8, scale: 'log', step: 0.01, value: 2,
      marks: [2, 3, 5, 7], snap: [2, 3, 5, 7], format: function (v) { return 'λ = ' + fmt(v, 2); } });
    var rad = fig.slider({ label: 'Half-width', tex: 'r', min: 0.05, max: 2, scale: 'log', step: 0.005, value: 0.6,
      format: function (v) { return 'r = ' + fmt(v, 3); } });
    var stripH = function (w) { return w < 560 ? 38 : 28; };   // the readout strip between the two panels
    var T = fig.plane({ x: [-3, 3], y: [-0.03, 0.47], pad: { t: 16, r: 16, b: 24, l: 16 },
      box: function (w, h) { return [0, 0, w, 0.46 * h - stripH(w) / 2]; } });
    var B = fig.plane({ x: [-NM - 0.8, NM + 0.8], y: [-0.1, 0.3], pad: { t: 10, r: 16, b: 24, l: 52 },
      box: function (w, h) { return [0, 0.46 * h + stripH(w) / 2, w, h]; } });
    var hb = fig.drag({ plane: T, x: 0.5, y: PEAK, r: 7, color: 'blue',
      constrain: function (x) { return [Kit.clamp(x, -2.5, 2.5), PEAK]; } });
    var yCam = fig.follow(0.3, { tau: 0.1 });

    /* Re M phi(z_m) = integral of f(u) cos(w u) du with w = 2 pi m / log lambda. The bump is even about c, so this is
       r cos(w c) B(r w) with B(k) = integral of bump(x) cos(k x) dx, by the trapezoid rule on 401 points of [-1, 1]. */
    function reM(w, c, r) {
      var th = w * r * HX, c2 = 2 * Math.cos(th), cPrev = 1, cCur = Math.cos(th), s = bx[0];
      for (var j = 1; j < NX; j++) { s += 2 * bx[j] * cCur; var nx = c2 * cCur - cPrev; cPrev = cCur; cCur = nx; }
      return r * HX * s * Math.cos(w * c);
    }
    function compute(L, c, r) {
      var key = L + '|' + c + '|' + r;
      if (key === res.key) return;
      res.key = key;
      var w1 = 2 * Math.PI / L, ymax = 0;
      for (var m = 0; m <= NM; m++) {
        var v = reM(m * w1, c, r);
        stemY[NM + m] = v; stemY[NM - m] = v;
        sumY[m] = m === 0 ? v : sumY[m - 1] + 2 * v;
        ymax = Math.max(ymax, Math.abs(v), Math.abs(sumY[m]));
      }
      var terms = Math.max(NM, Math.min(1500, Math.ceil(KMAX / (w1 * r)))), freq = sumY[NM];
      for (var mm = NM + 1; mm <= terms; mm++) freq += 2 * reM(mm * w1, c, r);
      var orbit = 0;
      for (var k = Math.ceil((c - r) / L); k <= Math.floor((c + r) / L); k++) orbit += bump((k * L - c) / r);
      res.freq = freq; res.orbit = L * orbit; res.terms = terms; res.ymax = Math.max(ymax, Math.abs(res.orbit), 0.02);
    }

    return function draw() {
      var L = Math.log(lam.value), c = hb.x, r = rad.value;
      compute(L, c, r);
      var zero = Math.abs(res.freq) < 1e-4 && Math.abs(res.orbit) < 1e-4, narrow = fig.w < 560;
      var ym = yCam.to(res.ymax).value;
      B.view.y0 = -0.35 * ym; B.view.y1 = 1.3 * ym; B.update();

      // Orbit side: the bump on the u line, the orbit points k log lambda, and the values phi(lambda^k) on them.
      var tb = T.box, f = function (u) { return bump((u - c) / r); };
      T.axes({ origin: [0, 0], y: false, xStep: 1, size: 11 });
      var k0 = Math.ceil(-3 / L), k1 = Math.floor(3 / L), lastPx = -1e9, gap = T.X(L) - T.X(0);
      for (var k = k0; k <= k1; k++) {
        var u = k * L, px = T.X(u), v = f(u);
        fig.line(px, T.Y(0), px, tb.t + 14, { color: 'gold', width: 1, alpha: 0.35 });
        if (gap > 26 && Math.abs(k) <= 9 && px - lastPx > 26) {
          fig.text(k === 0 ? '1' : 'λ' + (k === 1 ? '' : fmt.sup(k)), px, tb.t + 2, { color: 'gold', size: 11, align: 'center', baseline: 'top' });
          lastPx = px;
        }
        if (v > 1e-12) fig.line(px, T.Y(0), px, T.Y(v), { color: 'gold', width: 4 });
      }
      T.fillBetween(f, 0, Math.max(-3, c - r), Math.min(3, c + r), { color: 'blue', alpha: 0.22 });
      T.plot(f, { color: 'blue', width: 2.2, from: Math.max(-3, c - r) - 0.02, to: Math.min(3, c + r) + 0.02 });
      for (var q = k0; q <= k1; q++) if (f(q * L) > 1e-12) T.point(q * L, f(q * L), { color: 'gold', r: 3.6 });
      T.label('f', Math.min(c + r * 0.55, 2.2), f(Math.min(c + r * 0.55, 2.2)), { anchor: 'sw', color: 'blue', dx: 6, dy: -2, size: 13 });
      fig.label('u', tb.r, tb.b + 13, { anchor: 'ne', color: 'muted', size: 12 });
      if (zero) {
        var right = T.X(Math.min(3, c + r)) + 10 + 190 < tb.r;
        fig.text('no orbit point in the support', right ? T.X(c + r) + 10 : T.X(c - r) - 10, T.Y(0.1), { color: 'red', size: 12, weight: 600, align: right ? 'left' : 'right', alpha: 1 });
      }

      // Frequency side: the eigenvalues as stems, the running partial sums, and the orbit value as a target line.
      var bb = B.box;
      B.grid({ xStep: 2 });
      B.axes({ edge: true, xStep: narrow ? 4 : 2, xFormat: function (v) { return fmt(Math.round(v)); } });
      B.hline(0, { color: 'muted', width: 1 });
      B.hline(res.orbit, { color: zero ? 'red' : 'gold', width: 1.6, dash: [6, 4] });
      B.stems(stemX, stemY, { color: 'teal', width: 2, dot: 2.8 });
      B.path(sumX, sumY, { color: 'muted', width: 1.6 });
      for (var s = 0; s <= NM; s++) B.point(s, sumY[s], { color: 'muted', r: 2.6, ring: 'stage' });
      fig.label('m', bb.r, bb.b + 13, { anchor: 'ne', color: 'muted', size: 12 });
      // Direct labels: the m = 0 stem, the end of the partial sums, and (wide) the target line.
      var ls = narrow ? 11 : 12.5;
      B.label('stem', 0, 0.55 * stemY[NM], { anchor: 'e', color: 'teal', dx: -8, size: ls });
      B.label('SN', NM, sumY[NM], { anchor: 's', color: 'muted', dy: -8, size: ls });
      if (!narrow) B.label('orbitLine', -NM - 0.6, res.orbit, { anchor: res.orbit >= 0.5 * ym ? 'nw' : 'sw', color: zero ? 'red' : 'gold', dy: res.orbit >= 0.5 * ym ? 6 : -4, size: 12 });

      // The readout strip between the panels: the orbit side and the frequency side, each in its color.
      var five = function (v) { return ' = ' + fmt(Math.abs(v) < 5e-6 ? 0 : v, 5); };
      var mid = (T.outer.b + B.outer.t) / 2, cx = fig.w / 2, sz = narrow ? 12 : 13;
      var left = [{ tex: 'orbit' }, five(res.orbit)], right = [{ tex: 'freq' }, five(res.freq), narrow ? '' : '   (|m| ≤ ' + fmt(res.terms) + ')'];
      var lo = { size: sz, mono: true, color: zero ? 'red' : 'gold' }, ro = { size: sz, mono: true, color: zero ? 'red' : 'teal' };
      if (narrow) { fig.mathText(left, cx, mid - 9, Object.assign({ align: 'center' }, lo)); fig.mathText(right, cx, mid + 10, Object.assign({ align: 'center' }, ro)); }
      else { fig.mathText(left, cx - 24, mid, Object.assign({ align: 'right' }, lo)); fig.mathText(right, cx + 24, mid, Object.assign({ align: 'left' }, ro)); }
      if (!narrow && !zero) fig.text('drag the bump', T.X(c) - 14, T.Y(PEAK) + 4, { color: 'muted', size: 11.5, align: 'right' });
    };
  }
});
