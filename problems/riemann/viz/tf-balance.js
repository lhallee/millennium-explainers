/* Both sides of the Trace Formula over Q (eq-tf-trace-formula) for phi(t) = u(1+u) bump(u/log Y), u = log t.
   Left side: the archimedean term plus the prime powers. Right side: M phi(1/2) + M phi(-1/2) minus the zero sum, over
   the first N pairs, each pair contributing 2 Re M phi(i gamma). Every term is computed here in double precision:
   phi(e^u) + phi(e^-u) = 2u^2 bump(u/L) since bump is even, so the archimedean term is
   int_0^L u^2 bump(u/L) (1/(2 sinh(u/2)) + 1/(2 cosh(u/2))) du (tanh-sinh), the zero terms are
   4 int_0^L u^2 bump(u/L) cos(gamma u) du (trapezoid on 700 steps, spectrally accurate for a bump), and the poles are
   tanh-sinh integrals. The zero sum runs over the kit's 1,500 ordinates (Kit.zeroOrdinates). With u = L x the pair
   term is 4 L^3 G(gamma L), G(w) = int_0^1 x^2 bump(x) cos(w x) dx, which mpmath puts below 1e-21 for w >= 1800, so
   zeros with gamma L > 1800 add nothing a double can hold and are skipped; the trapezoid on 700 steps in x aliases
   only from w >= 2 pi 700 - 1800 = 2598. The first 100 zeros are summed in the frame that needs them and the rest,
   150 per frame, in the frames after. At startup the figure compares Y = 8 (in its first frames) and then Y = 2 (in a job)
   with every number the chapter prints and logs an error on a mismatch. An optional hypothetical zero at
   z = 0.3 + 25i (with -0.3 + 25i and the conjugates), red, enters the trace-formula sum only when the strip
   |Re z| < a contains it, and Weil's sum over all zeros always. */
Kit.register('tf-balance', {
  tex: {
    phi: '\\varphi(t)', Y: 'Y', a: 'a', N: 'N', Mp: 'M\\varphi(\\tfrac12)', Mm: 'M\\varphi(-\\tfrac12)', rez: '\\Re z', imz: '\\Im z',
    zs: '\\textstyle\\sum_{\\lvert\\beta-1/2\\rvert<a}m_\\rho M\\varphi(\\rho-\\tfrac12)', ws: '\\textstyle\\sum_{\\text{all }\\rho}m_\\rho M\\varphi(\\rho-\\tfrac12)'
  },
  init: function (fig) {
    var fmt = Kit.fmt, Z = Kit.zeroOrdinates(1500), NZ = Z.length, NT = 700, OMEGA = 1800, FIRST = 100, CHUNK = 150, U = 2.5, HYP = [0.3, 25];
    function bump(x) { return Math.abs(x) < 1 ? Math.exp(-1 / (1 - x * x)) : 0; }
    // tanh-sinh nodes on [0, 1], step 1/32: the two sides then agree to 1e-15 (step 1/16 left 1e-13 of quadrature error)
    var TX = [], TW = [];
    for (var t = -3.5; t <= 3.5 + 1e-9; t += 1 / 32) {
      var sh = Math.PI / 2 * Math.sinh(t), ch = Math.cosh(sh);
      TX.push(0.5 * (1 + Math.tanh(sh))); TW.push(Math.PI / 128 * Math.cosh(t) / (ch * ch));
    }
    function ts(f, a, b) { var s = 0; for (var i = 0; i < TX.length; i++) s += TW[i] * f(a + (b - a) * TX[i]); return (b - a) * s; }
    function vonMangoldt(n) { for (var p = 2; p <= n; p++) if (n % p === 0) { var q = n; while (q % p === 0) q /= p; return q === 1 ? Math.log(p) : 0; } return 0; }

    var D = null, xs = new Float64Array(NZ), ys = new Float64Array(NZ), k;
    for (k = 0; k < NZ; k++) xs[k] = k + 1;
    /* Everything but the zero sum, for support bound Y; f and partial are reused buffers. */
    function make(Y, f, partial) {
      var L = Math.log(Y), h = L / NT, j, phiU = function (u) { return u * (1 + u) * bump(u / L); };
      var arch = ts(function (u) { return u > 0 ? u * bump(u / L) * (u / (2 * Math.sinh(u / 2)) + u / (2 * Math.cosh(u / 2))) : 0; }, 0, L);
      var Mp = ts(function (u) { return phiU(u) * Math.exp(u / 2); }, -L, L), Mm = ts(function (u) { return phiU(u) * Math.exp(-u / 2); }, -L, L);
      var primes = [], P = 0;
      for (var n = 2; n < Y; n++) { var lam = vonMangoldt(n); if (lam) { var u = Math.log(n), v = lam / Math.sqrt(n) * 2 * u * u * bump(u / L); primes.push({ n: n, v: v }); P += v; } }
      for (j = 0; j <= NT; j++) f[j] = (j * h) * (j * h) * bump(j * h / L) * (j === 0 || j === NT ? 0.5 : 1);
      var H = 0;
      for (j = 0; j <= NT; j++) H += f[j] * Math.cosh(HYP[0] * j * h) * Math.cos(HYP[1] * j * h);
      return { Y: Y, L: L, h: h, f: f, partial: partial, nk: 0, S: 0, phiU: phiU, arch: arch, Mp: Mp, Mm: Mm, primes: primes, P: P, lhs: arch + P, H: 8 * h * H };
    }
    /* Adds the pair terms of zeros d.nk .. d.nk + count - 1 to the running zero sum. */
    function advance(d, count) {
      var end = Math.min(NZ, d.nk + count), f = d.f, h = d.h, j;
      for (var k = d.nk; k < end; k++) {
        if (Z[k] * d.L > OMEGA) { for (; k < NZ; k++) d.partial[k] = d.S; end = NZ; break; }
        var cr = Math.cos(Z[k] * h), ci = Math.sin(Z[k] * h), re = 1, im = 0, acc = 0;
        for (j = 0; j <= NT; j++) { acc += f[j] * re; var r2 = re * cr - im * ci; im = re * ci + im * cr; re = r2; }
        d.S += 4 * h * acc; d.partial[k] = d.S;
      }
      d.nk = end;
    }
    var fBuf = new Float64Array(NT + 1), pBuf = new Float64Array(NZ);
    /* The chapter's numbers (section s-tf-numbers), each to the digits printed. */
    function check(d, want) {
      var bad = [];
      Object.keys(want).forEach(function (key) {
        var got = key.charAt(0) === 'N' ? d.partial[+key.slice(1) - 1] : key === 'diff' ? d.lhs - (d.Mp + d.Mm - d.partial[NZ - 1]) : d[key], w = want[key];
        if (!(Math.abs(got - w[0]) <= w[1])) bad.push(key + ' = ' + got + ', chapter ' + w[0]);
      });
      if (bad.length) console.error('tf-balance: Y = ' + d.Y + ' disagrees with the chapter: ' + bad.join('; '));
    }
    var E10 = 0.6e-10, checked8 = false;
    var WANT8 = { arch: [0.4404763838, E10], P: [1.0652276403, E10], lhs: [1.5057040241, E10], Mp: [1.0852426053, E10], Mm: [0.4149972171, E10],
      N1: [-0.0062873666, E10], N10: [-0.0054637958, E10], N100: [-0.0054642018, E10], N500: [-0.0054642016, E10], N1500: [-0.0054642016, E10], diff: [0, 1e-12] };
    function checkY2() {                                                    // started once Y = 8 is complete
      fig.job(function* () {
        var d = make(2, new Float64Array(NT + 1), new Float64Array(NZ));
        while (d.nk < NZ) { advance(d, 50); yield d.nk / NZ; }
        check(d, { lhs: [0.0412165516, E10], Mp: [0.0356193861, E10], Mm: [0.0120833266, E10], N1500: [0.0064861611, E10], diff: [0, 5e-15] });   // the chapter prints this sum with its minus sign
      }, { budget: 1.5 });
    }

    var Ys = fig.slider({ label: 'Support', tex: 'Y', min: 1.2, max: 12, step: 0.01, value: 8, snap: [2, 3, 4, 5, 7, 8, 9, 11], marks: [2, 3, 4, 5, 7, 8, 9, 11] });
    var As = fig.slider({ label: 'Strip half-width', tex: 'a', min: 0.01, max: 0.5, step: 0.01, value: 0.2, marks: [{ at: 0.3, color: 'red', title: 'Re z of the hypothetical zero' }] });
    var Ns = fig.slider({ label: 'Zero pairs', tex: 'N', min: 1, max: NZ, scale: 'log', step: 1, value: NZ, marks: [10, 100, 1000], snap: [1, 10, 100, 500, NZ] });
    var hyp = fig.toggle({ label: 'Hypothetical zero at z = 0.3 + 25i', value: false });

    function iw(w) { return Kit.clamp(0.18 * w, 84, 170); }
    function mainR(w) { return w - iw(w) - 6; }
    function barH(h) { return Kit.clamp(0.04 * h, 8, 18); }                 // the balance bars: two rows and three text lines
    function balTop(h) { return 0.26 * h; }
    function balBot(h) { return balTop(h) + 2 * barH(h) + 52; }
    var F = fig.plane({ x: [-U, U], y: [-0.2, 1], pad: { t: 8, r: 10, b: 18, l: 58 }, box: function (w, h) { return [0, 0, mainR(w), balTop(h)]; } });
    var Bp = fig.plane({ x: [0, 1], y: [0, 1], pad: { t: 4, r: 10, b: 4, l: 58 }, box: function (w, h) { return [0, balTop(h), mainR(w), balBot(h)]; } });
    var Sp = fig.plane({ x: [1, NZ], y: [-0.007, -0.004], xLog: true, pad: { t: 8, r: 10, b: 24, l: 58 }, box: function (w, h) { return [0, balBot(h), mainR(w), h]; } });
    var Zp = fig.plane({ x: [-0.55, 0.55], y: [0, 60], pad: { t: 22, r: 8, b: 34, l: 28 }, box: function (w, h) { return [w - iw(w), 0, w, h]; } });
    var y0f = fig.follow(-0.007, { tau: 0.1 }), y1f = fig.follow(-0.004, { tau: 0.1 });
    var segs = [];
    fig.probe({ plane: F, crosshair: false,
      snap: function (x) {
        if (!D || !D.primes.length) return null;
        var best = null; D.primes.forEach(function (q) { var u = Math.log(q.n) * (x < 0 ? -1 : 1); if (!best || Math.abs(u - x) < Math.abs(best[0] - x)) best = [u, D.phiU(u), q]; });
        return Math.abs(F.X(best[0]) - F.X(x)) < 14 ? [best[0], best[1]] : null;
      },
      rows: function (x) {
        var n = Math.round(Math.exp(Math.abs(x))), q = D.primes.filter(function (r) { return r.n === n; })[0];
        if (!q) return null;
        var u = Math.log(n);
        return [['n', String(n)], ['φ(n)', fmt(D.phiU(u), 7)], ['φ(1/n)', fmt(D.phiU(-u), 7)], ['term', fmt(q.v, 7), 'gold']];
      } });
    fig.probe({ plane: Bp, crosshair: false, marker: false,
      rows: function (x, y) {
        var row = y > 0.5 ? 0 : 1, s = segs.filter(function (g) { return g.row === row && x >= Math.min(g.a, g.b) && x <= Math.max(g.a, g.b); })[0];
        return s ? [[s.name, fmt(s.v, 10), s.color]] : null;
      } });

    /* The prime-power labels (10 px) and the labels inside the bars (10 px, weight 700) use fonts the kit has not
       prepared, and creating them took a large part of the first frame at 4x CPU slowdown. So those labels wait:
       ready() is false for a font not yet created, and a job creates the queued fonts, one per frame. */
    var warm = {}, queue = [], warming = null;
    function ready(size, weight, sample) {
      var k = size + '|' + weight;
      if (warm[k]) return true;
      if (!(k in warm)) { warm[k] = false; queue.push([size, weight, sample]); }
      if (!warming) warming = fig.job(function* () {
        while (queue.length) { var q = queue.shift(); fig.measure(q[2], q[0], q[1]); warm[q[0] + '|' + q[1]] = true; yield; }
        warming = null;
      });
      return false;
    }

    function zeroSum(N, inStrip) { return D.partial[N - 1] + (hyp.value && inStrip ? D.H : 0); }

    return function draw() {
      if (!D || D.Y !== Ys.value) D = make(Ys.value, fBuf, pBuf);
      if (D.nk < NZ) { advance(D, D.nk < FIRST ? FIRST - D.nk : CHUNK); if (D.nk < NZ) fig.more(); }
      if (!checked8 && D.Y === 8 && D.nk === NZ) { checked8 = true; check(D, WANT8); checkY2(); }
      var a = As.value, N = Math.min(Math.round(Ns.value), D.nk), hypIn = hyp.value && a > HYP[0], ctx = fig.ctx, nk = D.nk, partial = D.partial;
      var zs = zeroSum(N, hypIn), ws = zeroSum(N, true), poles = D.Mp + D.Mm, rhs = poles - zs, diff = D.lhs - rhs, wdiff = D.lhs - (poles - ws);
      var narrow = fig.w < 560;

      // top: the test function, with the prime powers n and 1/n it reaches
      var fmax = 0.02, fmin = -0.02;
      for (k = 0; k <= 100; k++) { var vv = D.phiU(-D.L + 2 * D.L * k / 100); fmax = Math.max(fmax, vv); fmin = Math.min(fmin, vv); }
      F.view.y0 = fmin - 0.15 * (fmax - fmin); F.view.y1 = fmax + 0.12 * (fmax - fmin); F.update();
      var fb = F.box;
      F.hline(0, { color: 'muted', width: 1 });
      F.vline(-D.L, { color: 'muted', width: 1, dash: [3, 4] }); F.vline(D.L, { color: 'muted', width: 1, dash: [3, 4] });
      F.plot(D.phiU, { color: 'gold', width: 2.2 });
      var x1 = F.X(0), reachR = x1 + 6, reachL = x1 - 6;            // labels outward from t = 1, skipping any that would touch
      var labOn = ready(10, 500, '1/0123456789');
      if (labOn) fig.text('1', x1, fb.b + 11, { color: 'muted', size: 10, align: 'center' });
      D.primes.forEach(function (q) {
        [1, -1].forEach(function (sg) {
          var u = sg * Math.log(q.n), x = F.X(u), lab = sg > 0 ? String(q.n) : '1/' + q.n;
          fig.line(x, fb.b, x, fb.b - 6, { color: 'gold', width: 1.5 });
          F.point(u, D.phiU(u), { color: 'gold', r: 2.6 });
          if (!labOn) return;
          var half = fig.measure(lab, 10) / 2;
          if (sg > 0 && x - half > reachR + 2) { fig.text(lab, x, fb.b + 11, { color: 'gold', size: 10, align: 'center' }); reachR = x + half; }
          if (sg < 0 && x + half < reachL - 2) { fig.text(lab, x, fb.b + 11, { color: 'gold', size: 10, align: 'center' }); reachL = x - half; }
        });
      });
      fig.label('phi', fb.l - 8, (fb.t + fb.b) / 2, { anchor: 'e', color: 'gold', size: 12 });

      // middle: the two sides as stacked bars on one scale
      var bb = Bp.box, total = Math.max(D.lhs, rhs, poles, poles - ws) * 1.0, sx = bb.w / total, bh = barH(fig.h);
      var rows = [
        { y: bb.t + 13, title: narrow ? 'prime side' : 'archimedean term + prime powers', tot: D.lhs,
          parts: [{ name: 'archimedean', v: D.arch, color: 'blue', lab: 'arch' }].concat(D.primes.map(function (q) { return { name: 'n = ' + q.n, v: q.v, color: 'gold', lab: String(q.n) }; })) },
        { y: bb.t + 13 + bh + 17, title: narrow ? 'pole side' : 'pole terms − zero sum (strip)', tot: rhs,
          parts: [{ name: 'Mφ(1/2)', v: D.Mp, color: 'blue', lab: 'Mφ(½)' }, { name: 'Mφ(−1/2)', v: D.Mm, color: 'blue', lab: 'Mφ(−½)' }, { name: '− zero sum', v: -zs, color: 'teal', lab: 'zeros' }] }
      ];
      segs = [];
      var barOn = ready(10, 700, 'arch0123456789 Mφ(½−)zeros');
      rows.forEach(function (r, ri) {
        fig.text(r.title, bb.l, r.y, { color: 'muted', size: 11 });
        fig.text(fmt(r.tot, 10), bb.r, r.y, { color: 'fg', size: 11.5, mono: true, align: 'right' });
        var cum = 0, top = r.y + 4, used = [];                          // label spans drawn in this row: a negative part overlaps the one before it
        r.parts.forEach(function (p, pi) {
          var x0 = bb.l + cum * sx, x1 = bb.l + (cum + p.v) * sx, lft = Math.min(x0, x1), wd = Math.abs(x1 - x0);
          if (p.v >= 0) fig.rect(lft, top, Math.max(1, wd), bh, { fill: p.color, alpha: pi % 2 ? 0.7 : 0.9 });
          else fig.rect(lft, top, Math.max(1, wd), bh, { color: p.color, width: 1.5 });
          if (pi) fig.line(x0, top, x0, top + bh, { color: 'stage', width: 1 });
          var tw = barOn ? fig.measure(p.lab, 10, 700) : 0;
          var lc = lft + wd / 2, free = used.every(function (s) { return lc + tw / 2 + 3 < s[0] || lc - tw / 2 - 3 > s[1]; });
          if (barOn && wd > tw + 6 && free) { fig.text(p.lab, lc, top + bh / 2 + 0.5, { color: 'stage', size: 10, weight: 700, align: 'center', baseline: 'middle' }); used.push([lc - tw / 2, lc + tw / 2]); }
          segs.push({ row: ri, a: cum, b: cum + p.v, v: p.v, name: p.name, color: p.color });
          cum += p.v;
        });
      });
      var endY = rows[1].y + 4 + bh + 13;
      fig.text('left − right  ' + (Math.abs(diff) < 5e-15 ? '0' : fmt.sci(diff, 1)), bb.r, endY, { color: 'red', size: 11.5, mono: true, align: 'right' });
      if (nk < NZ) fig.text('summing zeros: ' + fmt(nk) + ' of ' + fmt(NZ), bb.l, endY, { color: 'muted', size: 11 });
      else if (!narrow) fig.text('hover a segment for its value', bb.l, endY, { color: 'muted', size: 10.5 });

      // bottom: partial zero sums against N, and the value the primes require
      var target = poles - D.lhs, lo = Math.min(target, zs), hi = Math.max(target, zs);
      for (k = 0; k < nk; k++) { var p0 = partial[k] + (hypIn ? D.H : 0); lo = Math.min(lo, p0); hi = Math.max(hi, p0); if (hyp.value && !hypIn) { lo = Math.min(lo, p0 + D.H); hi = Math.max(hi, p0 + D.H); } }
      var pad = 0.12 * (hi - lo || 1e-6);
      Sp.view.y0 = y0f.to(lo - pad).value; Sp.view.y1 = y1f.to(hi + pad).value; Sp.update();
      Sp.grid({ xTicks: [1, 10, 100, 1000] });
      Sp.axes({ edge: true, xTicks: [1, 2, 5, 10, 20, 50, 100, 200, 500, 1500], xLabel: 'N' });
      Sp.hline(target, { color: 'gold', width: 1.6, dash: [6, 4] });
      for (k = 0; k < nk; k++) ys[k] = partial[k] + (hypIn ? D.H : 0);
      Sp.stairs(xs, ys, { color: 'teal', width: 2.2, to: nk });
      if (hyp.value && !hypIn) { for (k = 0; k < nk; k++) ys[k] = partial[k] + D.H; Sp.stairs(xs, ys, { color: 'red', width: 1.4, dash: [4, 4], alpha: 0.8, to: nk }); }
      Sp.vline(N, { color: 'fg', width: 1, alpha: 0.4, dash: [3, 4] });
      Sp.point(N, zs, { color: 'teal', r: 4 });
      fig.legend([narrow ? { color: 'teal', text: 'zeros in the strip' } : { color: 'teal', tex: 'zs' },
        hyp.value && !hypIn && (narrow ? { color: 'red', text: 'with the hypothetical zero', dash: [4, 4], width: 1.4 } : { color: 'red', tex: 'ws', dash: [4, 4], width: 1.4 }),
        { color: 'gold', text: narrow ? 'poles − prime side' : 'poles minus the prime side', dash: [6, 4], width: 1.6 }],
        { plane: Sp, prefer: narrow ? ['se', 'ne', 'sw'] : ['nw', 'sw', 'ne'], size: narrow ? 10.5 : 12, bg: true });
      if (!narrow) fig.panel([['N', String(N)], ['zero sum', fmt(zs, 10), 'teal'], ['left − right', Math.abs(diff) < 5e-15 ? '0' : fmt.sci(diff, 1), 'red'],
        hyp.value ? ['Weil, all zeros', fmt(ws, 10), 'red'] : null, hyp.value ? ['Weil: left − right', fmt.sci(wdiff, 1), 'red'] : null],
        { plane: Sp, prefer: ['se', 'ne', 'sw'], id: 'zs' });

      // inset: the strip |Re z| < a in the z-plane (drawn as in chapter 14), the critical line, and the zeros up to height 60
      var zb = Zp.box;
      ctx.fillStyle = fig.color('blue', 0.16);
      ctx.fillRect(Zp.X(-a), zb.t, Zp.X(a) - Zp.X(-a), zb.h);
      Zp.vline(-a, { color: 'blue', width: 1.4, dash: [5, 4] }); Zp.vline(a, { color: 'blue', width: 1.4, dash: [5, 4] });
      Zp.vline(0, { color: 'stage', width: 5, alpha: 0.6 });
      Zp.vline(0, { color: 'violet', width: 2 });
      for (k = 0; k < NZ && Z[k] <= 60; k++) Zp.point(0, Z[k], { color: k < N ? 'teal' : 'muted', r: 3.2, alpha: k < N ? 1 : 0.5 });
      if (hyp.value) {
        [-HYP[0], HYP[0]].forEach(function (x) {
          if (hypIn) Zp.point(x, HYP[1], { color: 'red', r: 4 });
          else fig.circle(Zp.X(x), Zp.Y(HYP[1]), 4, { fill: 'stage', ring: 'red', ringWidth: 2 });
        });
        var hw = fig.measure('hypothetical', 11, 600);
        fig.rect(Zp.X(0) - hw / 2 - 2, Zp.Y(HYP[1]) - 19, hw + 4, 13, { fill: 'stage', alpha: 0.85 });
        fig.text('hypothetical', Zp.X(0), Zp.Y(HYP[1]) - 9, { color: 'red', size: 11, weight: 600, align: 'center' });
      }
      Zp.axes({ edge: true, xTicks: [[-0.5, '−½'], [0, '0'], [0.5, '½']], yTicks: [20, 40, 60], size: 10.5 });
      fig.label('imz', zb.l, zb.t - 6, { anchor: 's', color: 'muted', size: 12 });
      fig.label('rez', (zb.l + zb.r) / 2, zb.b + 30, { anchor: 's', color: 'muted', size: 12 });
    };
  }
});
