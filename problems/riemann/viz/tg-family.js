/* The endgame family on a log t axis. Blue: the sharp family phi_z(t) = t^(-z) for t > 1 (real part solid, imaginary
   part dashed), with the value 1/2 at t = 1. Gold: the test function that replaces it. In our version it is
   phi_{R,z} = h0(t) kappa(t/R) t^(-z), with h0 a smooth step from 0 at 3/2 to 1 at 2 and kappa(t/R) a smooth cutoff
   from 1 at R to 0 at 2R (both steps in log t, as in the chapter's example). In the source's version it is
   h(t) (J_eps * phi_z)(t), where h rises from 0 at 1 + delta to 1 at 1 + 2 delta and J_eps is a bump of width eps in
   log t. Gold dots: the values at the prime powers, which are all the prime side sees. The panel gives the prime side
   at this R, its limit -zeta'/zeta(z + 1/2), and the archimedean term, which stays bounded with h0 and grows like
   log(1/delta) in the source's version. */
Kit.register('tg-family', {
  tex: { phi: '\\varphi_z', phiR: '\\varphi_{R,z}', phiH: 'h\\,(J_\\varepsilon*\\varphi_z)',
    t: 't', z: 'z', R: 'R', delta: '\\delta', eps: '\\varepsilon' },
  init: function (fig) {
    var M = Kit.math, fmt = Kit.fmt, PP = [], LAM = [];       // prime powers up to 1,100 and their Lambda(n)
    fig.job(M.sieveTask(1100), { onDone: function () {
      for (var n = 2; n <= 1100; n++) { var l = M.vonMangoldt(n); if (l > 0) { PP.push(n); LAM.push(l); } }
    } });
    var mode = fig.select({ label: 'Version', options: [['ours', 'fixed cutoff (ours)'], ['source', 'source: mollifier and bump']], value: 'ours' });
    var Re = fig.slider({ label: 'Re', tex: 'z', min: 0.6, max: 3, step: 0.01, value: 0.8 });
    var Im = fig.slider({ label: 'Im', tex: 'z', min: -10, max: 10, step: 0.1, value: 6 });
    var Rs = fig.slider({ label: 'Cutoff', tex: 'R', min: 4, max: 400, scale: 'log', step: 0.1, value: 10, marks: [10, 100] });
    var Ds = fig.slider({ label: 'Left edge', tex: 'delta', min: 0.001, max: 0.4, scale: 'log', value: 0.1,
      format: function (v) { return 'δ = ' + fmt.sig(v); } });
    var Es = fig.slider({ label: 'Mollifier width', tex: 'eps', min: 0.01, max: 0.3, step: 0.01, value: 0.08 });
    var P = fig.plane({ x: [0.5, 30], y: [-1.2, 1.2], xLog: true, pad: { t: 12, r: 14, b: 28, l: 40 } });
    var cam = fig.follow(Math.log10(30), { tau: 0.15 });

    var S = function (x) {                                      // smooth step, 0 for x <= 0 and 1 for x >= 1
      if (x <= 0) return 0; if (x >= 1) return 1;
      var a = Math.exp(-1 / x), b = Math.exp(-1 / (1 - x)); return a / (a + b);
    };
    var L32 = Math.log(1.5), L43 = Math.log(4 / 3), LN2 = Math.log(2);
    var h0 = function (t) { return S((Math.log(t) - L32) / L43); };
    var kap = function (x) { return 1 - S(Math.log(x) / LN2); };   // 1 on (0, 1], 0 on [2, infinity)
    // Mollifier: j(u) = c exp(-1/(1 - (u/eps)^2)) on |u| < eps. C(v) = integral of j(u) e^{zu} over u < v, tabulated.
    var NC = 128, Cre = new Float64Array(NC + 1), Cim = new Float64Array(NC + 1), cKey = '';
    function mollify(zr, zi, eps) {
      var key = zr + ',' + zi + ',' + eps; if (key === cKey) return; cKey = key;
      var du = 2 * eps / NC, sr = 0, si = 0, mass = 0, pr = 0, pi = 0, pj = 0;
      Cre[0] = Cim[0] = 0;
      for (var k = 1; k <= NC; k++) {
        var u = -eps + k * du, x = u / eps, j = Math.abs(x) < 1 ? Math.exp(-1 / (1 - x * x)) : 0;
        var e = Math.exp(zr * u), cr = j * e * Math.cos(zi * u), ci = j * e * Math.sin(zi * u);
        sr += (cr + pr) * du / 2; si += (ci + pi) * du / 2; mass += (j + pj) * du / 2;
        Cre[k] = sr; Cim[k] = si; pr = cr; pi = ci; pj = j;
      }
      for (k = 0; k <= NC; k++) { Cre[k] /= mass; Cim[k] /= mass; }
    }
    var tmp = [0, 0];
    /* The gold test function at t into o (both modes); and the sharp family. */
    function gold(t, src, o) {
      var zr = Re.value, zi = Im.value, R = Rs.value, lt = Math.log(t), m = Math.exp(-zr * lt), w, cr = 1, ci = 0;
      if (src) {
        var d = Ds.value, e = Es.value;
        w = S((lt - Math.log(1 + d)) / (Math.log(1 + 2 * d) - Math.log(1 + d))) * kap(t / R);
        var q = (lt + e) / (2 * e) * NC;
        if (q <= 0) { o[0] = o[1] = 0; return; }
        if (q >= NC) { cr = Cre[NC]; ci = Cim[NC]; }
        else { var k = Math.floor(q), f = q - k; cr = Cre[k] + f * (Cre[k + 1] - Cre[k]); ci = Cim[k] + f * (Cim[k + 1] - Cim[k]); }
      } else w = h0(t) * kap(t / R);
      var pr = m * Math.cos(zi * lt), pi = -m * Math.sin(zi * lt);   // t^(-z)
      o[0] = w * (pr * cr - pi * ci); o[1] = w * (pr * ci + pi * cr);
    }
    /* The archimedean term: (1/2) int phi t^(1/2) (1/(t-1) + 1/(t+1)) dt/t, with t = 1 + e^v it is int phi t^(1/2)/(t+1) dv. */
    function arch(src) {
      var lo = src ? Math.log(Ds.value) : Math.log(0.5), hi = Math.log(2 * Rs.value - 1), N = 400, dv = (hi - lo) / N, sr = 0, si = 0;
      for (var k = 0; k <= N; k++) {
        var t = 1 + Math.exp(lo + k * dv), wgt = (k === 0 || k === N ? 1 : k % 2 ? 4 : 2) * dv / 3, g = Math.sqrt(t) / (t + 1);
        gold(t, src, tmp); sr += wgt * g * tmp[0]; si += wgt * g * tmp[1];
      }
      return [sr, si];
    }
    function primeSide(src) {
      var sr = 0, si = 0;
      for (var i = 0; i < PP.length && PP[i] < 2 * Rs.value; i++) { gold(PP[i], src, tmp); var c = LAM[i] / Math.sqrt(PP[i]); sr += c * tmp[0]; si += c * tmp[1]; }
      return [sr, si];
    }
    function logDeriv() {                                       // -zeta'/zeta(z + 1/2) by a central difference
      var s = Re.value + 0.5, t = Im.value, h = 1e-5, a = M.zeta(s + h, t), b = M.zeta(s - h, t), z = M.zeta(s, t);
      var d = M.div(M.C((a.re - b.re) / (2 * h), (a.im - b.im) / (2 * h)), z); return [-d.re, -d.im];
    }
    var key = '', vals = null, curveKey = '', NS = 420;
    var ts = new Float64Array(NS), gRe = new Float64Array(NS), gIm = new Float64Array(NS), jRe = new Float64Array(NS);
    var bt = new Float64Array(NS), bRe = new Float64Array(NS), bIm = new Float64Array(NS);
    /* Tabulate the curves on a grid uniform in log t (gold and the mollified step from 0.5, blue from just above 1). */
    function tabulate(src, x1) {
      var k = [src, Re.value, Im.value, Rs.value, Ds.value, Es.value, x1].join(); if (k === curveKey) return; curveKey = k;
      var zr = Re.value, zi = Im.value, l0 = Math.log(0.5), lb = Math.log(1.0001), l1 = Math.log(x1);
      for (var i = 0; i < NS; i++) {
        var t = Math.exp(l0 + (l1 - l0) * i / (NS - 1)); ts[i] = t; gold(t, src, tmp); gRe[i] = tmp[0]; gIm[i] = tmp[1];
        if (src) {
          var lt = Math.log(t), e = Es.value, q = (lt + e) / (2 * e) * NC, j = Kit.clamp(Math.floor(q), 0, NC - 1), f = Kit.clamp(q - j, 0, 1);
          var cr = q <= 0 ? 0 : Cre[j] + f * (Cre[j + 1] - Cre[j]), ci = q <= 0 ? 0 : Cim[j] + f * (Cim[j + 1] - Cim[j]);
          jRe[i] = Math.pow(t, -zr) * (Math.cos(zi * lt) * cr + Math.sin(zi * lt) * ci);
        }
        var u = lb + (l1 - lb) * i / (NS - 1), m = Math.exp(-zr * u); bt[i] = Math.exp(u); bRe[i] = m * Math.cos(zi * u); bIm[i] = -m * Math.sin(zi * u);
      }
    }

    return function draw() {
      var src = mode.value === 'source', zr = Re.value, zi = Im.value, R = Rs.value, b = P.box, narrow = fig.w < 560;
      Ds.show(src); Es.show(src);
      mollify(zr, zi, Es.value);
      P.view.x1 = Math.pow(10, cam.to(Math.log10(Math.max(30, 2.6 * R))).value); P.update();
      var x1 = P.v.x1;

      var gapText = narrow ? ['no prime', 'power here'] : ['no prime power here'];   // muted: violet is kept for the critical line
      P.fillBetween(1.2, -1.2, 1, 2, { color: 'muted', alpha: 0.12 });
      gapText.forEach(function (s, i) { fig.text(s, P.X(narrow ? 1.55 : Math.SQRT2), b.t + 14 + 13 * i, { color: 'muted', size: 11, align: 'center', weight: 600 }); });
      P.grid({ yStep: 0.5 });
      P.axes({ edge: true, yStep: 0.5, xLabel: 't' });
      P.hline(0, { color: 'muted', width: 1 });

      // the sharp family (blue): zero below 1, t^(-z) above, value 1/2 at 1
      tabulate(src, x1);
      P.segment(0.5, 0, 1, 0, { color: 'blue', width: 2 });
      P.path(bt, bRe, { color: 'blue', width: 2 });
      P.path(bt, bIm, { color: 'blue', width: 1.6, dash: [5, 4] });
      P.point(1, 0, { color: 'stage', ring: 'blue', ringWidth: 1.6, r: 3.5 });
      P.point(1, 1, { color: 'stage', ring: 'blue', ringWidth: 1.6, r: 3.5 });
      P.point(1, 0.5, { color: 'blue', r: 4 });

      // the test function (gold), and in the source's version the mollified step before the bump
      if (src) {
        P.path(ts, jRe, { color: 'gold', width: 1.4, alpha: 0.5 });
        P.vline(1 + Ds.value, { color: 'red', width: 1.2, dash: [3, 3] });
        fig.text('1 + δ', P.X(1 + Ds.value) + 4, b.b - 12, { color: 'red', size: 11 });
      }
      P.path(ts, gRe, { color: 'gold', width: 2.6 });
      P.path(ts, gIm, { color: 'gold', width: 1.8, dash: [5, 4] });
      if (R * 2 < x1) { P.vline(R, { color: 'muted', width: 1, dash: [2, 4] }); fig.text('R', P.X(R), b.t + 12, { color: 'muted', size: 11.5, align: 'center' }); }

      // the prime powers: ticks on the axis, dots at the values the prime side uses
      var ctx = fig.ctx, i;
      fig.stroke({ color: 'gold', width: 1.5 }); ctx.beginPath();
      for (i = 0; i < PP.length && PP[i] <= x1; i++) { var px = P.X(PP[i]); ctx.moveTo(px, b.b); ctx.lineTo(px, b.b - 7); }
      ctx.stroke();
      for (i = 0; i < PP.length && PP[i] <= Math.min(x1, 200); i++) {
        gold(PP[i], src, tmp);
        P.point(PP[i], tmp[0], { color: 'gold', r: 3.2, ringWidth: 1 });
        if (zi !== 0) P.point(PP[i], tmp[1], { color: 'stage', ring: 'gold', r: 2.6, ringWidth: 1.2 });
      }

      var k2 = [src, zr, zi, R, Ds.value, Es.value, PP.length].join();
      if (k2 !== key && PP.length) { key = k2; vals = { p: primeSide(src), l: logDeriv(), a: arch(src) }; }
      fig.legend([{ color: 'blue', tex: 'phi' }, { color: 'gold', tex: src ? 'phiH' : 'phiR', width: 2.6 },
        !narrow && { color: 'muted', dash: [5, 4], width: 1.6, text: 'imaginary part' }], { plane: P, at: 'ne', size: narrow ? 12 : 13, dir: narrow ? 'row' : 'col' });
      if (vals) fig.panel([[narrow ? 'primes' : 'prime side at R', fmt.complex(vals.p[0], vals.p[1], 3), 'gold'], [narrow ? 'limit' : 'limit −ζ′/ζ(z + ½)', fmt.complex(vals.l[0], vals.l[1], 3), 'fg'],
        ['archimedean', fmt.complex(vals.a[0], vals.a[1], 3), src ? 'red' : 'fg'], src ? ['log(1/δ)', fmt(Math.log(1 / Ds.value), 2), 'muted'] : null],
        { plane: P, at: 'se' });
    };
  }
});
