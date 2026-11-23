/* The nearest pole sets the growth of the Taylor coefficients. Left: the s-plane near z = sigma + i gamma_z (equal
   scales), the critical line, the zeros of zeta, a draggable hypothetical zero rho*, the line Re s = alpha, and circles
   about z through rho*, through the nearest zero, and of radius sigma - alpha. Right: log10 of the chapter's functional
   N_k = (sigma - alpha)^k (|b_k(z)| + b_k(sigma)), with b_k from the zero formula
     b_k(z) = log(2 pi) / z^(k+1) - sum_rho 1 / (rho (rho - 1) (z - rho)^(k+1)) - sum_m 1 / (2m (2m + 1) (z + 2m)^(k+1)),
   over the kit's 200 zero pairs (1,000 pairs change no printed digit), m <= 200, plus rho* and its conjugate. Each pole
   p with residue c adds c w^k / (z - p), w = (sigma - alpha) / (z - p), summed by recurrence until it is negligible.
   Compared at startup with the chapter's table of N_k for k up to 320. */
Kit.register('nearest-pole', {
  tex: { rho: '\\rho^*', z: 'z', al: '\\alpha', N: '\\mathcal N_k', rate: '(\\sigma-\\alpha)^{-k}', k: 'k', re: '\\Re s',
    dS: '\\lvert z-\\rho^*\\rvert', dR: '\\sigma-\\alpha', dZ: '\\min_\\rho\\lvert z-\\rho\\rvert' },
  init: function (fig) {
    var fmt = Kit.fmt, Z = Kit.zeros, K = 320, MT = 200, L2P = Math.log(2 * Math.PI);
    var TAB = [0, 10, 20, 40, 80, 160, 320], T0 = [0.796, 0.0487, 3.89e-3, 3.05e-4, 3.44e-5, 4.74e-7, 9.0e-11],
      T1 = [0.796, 0.0575, 0.0309, 0.256, 21.9, 1.60e5, 8.59e12];
    // the poles of the true transform: p = 0 (residue log 2 pi), the zero pairs (residue 1/(1/4 + gamma^2) each), -2m
    var NP = 1 + 2 * Z.length + MT, pr = new Float64Array(NP), pi = new Float64Array(NP), cr = new Float64Array(NP);
    pr[0] = 0; pi[0] = 0; cr[0] = L2P;
    for (var j = 0; j < Z.length; j++) {
      pr[1 + 2 * j] = pr[2 + 2 * j] = 0.5; pi[1 + 2 * j] = Z[j]; pi[2 + 2 * j] = -Z[j];
      cr[1 + 2 * j] = cr[2 + 2 * j] = 1 / (0.25 + Z[j] * Z[j]);
    }
    for (var m = 1; m <= MT; m++) { pr[2 * Z.length + m] = -2 * m; pi[2 * Z.length + m] = 0; cr[2 * Z.length + m] = -1 / (2 * m * (2 * m + 1)); }

    /* Adds sum_k c (R/(z - p))^k / (z - p) into (outR, outI) for k = 0..K; c = cRe + i cIm. */
    function addPole(zr, zi, p0, p1, cRe, cIm, R, outR, outI) {
      var dr = zr - p0, di = zi - p1, d2 = dr * dr + di * di, ir = dr / d2, ii = -di / d2;   // 1/(z - p)
      var wr = R * ir, wi = R * ii, tr = cRe * ir - cIm * ii, ti = cRe * ii + cIm * ir, aw = Math.hypot(wr, wi);
      for (var k = 0; k <= K; k++) {
        outR[k] += tr; outI[k] += ti;
        var nr = tr * wr - ti * wi; ti = tr * wi + ti * wr; tr = nr;
        if (aw < 1 && Math.abs(tr) + Math.abs(ti) < 1e-60) break;
      }
    }
    function hypRes(b, g) {   // residue -1/(rho (rho - 1)) of rho* = b + ig
      var re = b * b - b - g * g, im = 2 * b * g - g, d = re * re + im * im;
      return [-re / d, im / d];
    }
    var bzR = new Float64Array(K + 1), bzI = new Float64Array(K + 1), bsR = new Float64Array(K + 1), bsI = new Float64Array(K + 1);
    var hzR = new Float64Array(K + 1), hzI = new Float64Array(K + 1), hsR = new Float64Array(K + 1), hsI = new Float64Array(K + 1);
    var n0 = new Float64Array(K + 1), n1 = new Float64Array(K + 1), n2 = new Float64Array(K + 1), ks = new Float64Array(K + 1);
    for (var k = 0; k <= K; k++) ks[k] = k;
    var trueKey = '', hypKey = '';
    function compute(sig, al, gz, hb, hg, on) {
      var R = sig - al, tk = sig + ',' + al + ',' + gz, hk = tk + ',' + hb + ',' + hg + ',' + on, i;
      if (tk !== trueKey) {
        trueKey = tk; bzR.fill(0); bzI.fill(0); bsR.fill(0); bsI.fill(0);
        for (i = 0; i < NP; i++) { addPole(sig, gz, pr[i], pi[i], cr[i], 0, R, bzR, bzI); addPole(sig, 0, pr[i], pi[i], cr[i], 0, R, bsR, bsI); }
      }
      if (hk === hypKey) return; hypKey = hk;
      hzR.fill(0); hzI.fill(0); hsR.fill(0); hsI.fill(0);
      if (on) {
        if (hg === 0) {                      // a single real zero: residue 1/(beta (1 - beta)) > 0
          var c0 = 1 / (hb * (1 - hb));
          addPole(sig, gz, hb, 0, c0, 0, R, hzR, hzI); addPole(sig, 0, hb, 0, c0, 0, R, hsR, hsI);
        } else {
          var c = hypRes(hb, hg);
          addPole(sig, gz, hb, hg, c[0], c[1], R, hzR, hzI); addPole(sig, gz, hb, -hg, c[0], -c[1], R, hzR, hzI);
          addPole(sig, 0, hb, hg, c[0], c[1], R, hsR, hsI); addPole(sig, 0, hb, -hg, c[0], -c[1], R, hsR, hsI);
        }
      }
      for (k = 0; k <= K; k++) {
        var a = Math.hypot(bzR[k], bzI[k]) + bsR[k], b = Math.hypot(bzR[k] + hzR[k], bzI[k] + hzI[k]) + bsR[k] + hsR[k];
        n0[k] = a > 0 ? Math.log10(a) : NaN; n1[k] = b > 0 ? Math.log10(b) : NaN; n2[k] = Math.log10(Math.hypot(hzR[k], hzI[k]));
      }
    }
    // The startup comparison with the chapter's table runs after the first frame, at the chapter's parameters. A job
    // started in init runs in the first frame, so the first draw starts it (startCheck) and it runs in the second.
    var checkJob = null;
    function startCheck() { if (!checkJob) checkJob = fig.job(checkTable); }
    function* checkTable() {
      trueKey = hypKey = '';
      compute(2.5, 0.6, 14, 0.8, 14, true);
      TAB.forEach(function (kk, i) {
        [[n0, T0], [n1, T1]].forEach(function (row) {
          var got = Math.pow(10, row[0][kk]), want = row[1][i], e = Math.floor(Math.log10(want));   // half a unit in the last printed digit
          if (!(Math.abs(got - want) <= 0.51 * Math.pow(10, e - (want === 9.0e-11 ? 1 : 2)))) console.error('nearest-pole: N_' + kk + ' = ' + got + ', the chapter prints ' + want);
        });
      });
      trueKey = hypKey = '';
    }

    var sS = fig.slider({ label: 'Real point', min: 2.1, max: 4, step: 0.01, value: 2.5, format: function (v) { return 'σ = ' + v.toFixed(2); } });
    var gS = fig.slider({ label: 'Height of z', min: 0, max: 40, step: 0.1, value: 14, format: function (v) { return 'Im z = ' + v.toFixed(1); } });
    var aS = fig.slider({ label: 'Exponent', min: 0.5, max: 0.95, step: 0.01, value: 0.6, format: function (v) { return 'α = ' + v.toFixed(2); } });
    var off = fig.toggle({ label: 'Remove the hypothetical zero', value: false });
    var split = function (W) { return Math.round(W * (W < 560 ? 0.45 : 0.4)); };
    var L = fig.plane({ x: [-0.3, 4.6], y: [11.5, 16.5], equal: true, pad: { t: 12, r: 8, b: 26, l: 34 }, box: function (W, H) { return [0, 0, split(W), H]; } });
    var Rp = fig.plane({ x: [0, K], y: [-12, 14], pad: { t: 12, r: 14, b: 26, l: 44 }, box: function (W, H) { return [split(W) + 6, 0, W, H]; } });
    var rho = fig.drag({ plane: L, x: 0.8, y: 14, r: 7, color: 'red', label: 'rho', labelAnchor: 'sw',
      constrain: function (x, y) { var yy = Kit.clamp(y, 0, 40); return [Kit.clamp(Math.round(x * 100) / 100, 0.5, 0.99), yy < 0.3 ? 0 : Math.round(yy * 100) / 100]; } });
    var yc = fig.follow(14), ylo = fig.follow(-12), yhi = fig.follow(14);

    function circle(P, x, y, r, style) {
      var ctx = fig.ctx;
      P.clip(function () { ctx.beginPath(); ctx.arc(P.X(x), P.Y(y), r * P.box.w / (P.v.x1 - P.v.x0), 0, 2 * Math.PI); fig.stroke(style); ctx.stroke(); ctx.setLineDash([]); });
    }

    return function draw() {
      var sig = sS.value, gz = gS.value, al = aS.value, on = !off.value, narrow = fig.w < 560, R = sig - al;
      compute(sig, al, gz, rho.x, rho.y, on);
      startCheck();
      var c = yc.to(gz).value, half = 2.5;
      L.view.y0 = c - half; L.view.y1 = c + half; L.update();
      var lb = L.box, rb = Rp.box, vis = rho.y >= L.v.y0 && rho.y <= L.v.y1;
      rho.show(on && vis);

      // left: the s-plane around z
      L.critical({});
      L.axes({ edge: true, xTicks: [0, 1, 2, 3], yStep: 1, size: narrow ? 10.5 : 11 });   // no tick at 4, where the axis name sits
      fig.label('re', lb.r, lb.b + 20, { anchor: 'e', color: 'muted', size: 11.5 });
      L.vline(al, { color: 'blue', width: 1.4, dash: [6, 4] });
      L.vline(sig, { color: 'muted', width: 1, dash: [2, 4] });
      fig.label('al', L.X(al) + 3, lb.t + 2, { anchor: 'nw', color: 'blue', size: 12 });
      L.zeros({ r: 4.5 });
      var dz = Infinity, gn = 0;
      for (var j = 0; j < Z.length; j++) { var dd = Math.hypot(sig - 0.5, gz - Z[j]); if (dd < dz) { dz = dd; gn = Z[j]; } }
      circle(L, sig, gz, R, { color: 'blue', width: 1.6, dash: [6, 4] });
      circle(L, sig, gz, dz, { color: 'teal', width: 1.4 });
      L.segment(sig, gz, 0.5, gn, { color: 'teal', width: 1, alpha: 0.7 });
      var ds = Math.hypot(sig - rho.x, gz - rho.y);
      if (on) {
        circle(L, sig, gz, ds, { color: 'red', width: 1.6 });
        L.segment(sig, gz, rho.x, rho.y, { color: 'red', width: 1, alpha: 0.8 });
        if (!vis) fig.text((rho.y > L.v.y1 ? '↑ ' : '↓ ') + 'ρ* = ' + fmt.complex(rho.x, rho.y, 2), lb.l + 4, rho.y > L.v.y1 ? lb.t + 12 : lb.b - 6, { color: 'red', size: 11, weight: 600 });
        else fig.text('hypothetical', L.X(rho.x) + 6, L.Y(rho.y) + (narrow ? 22 : 20), { color: 'red', size: 11, weight: 600 });
      }
      fig.circle(L.X(sig), L.Y(gz), 6, { fill: 'stage', ring: 'fg', ringWidth: 2.2 });
      fig.label('z', L.X(sig) + 8, L.Y(gz) - 6, { anchor: 'sw', color: 'fg', size: 13 });

      // right: log10 N_k against k
      var lo = Infinity, hi = -Infinity;
      for (var k = 0; k <= K; k++) {
        if (n0[k] === n0[k]) { lo = Math.min(lo, n0[k]); hi = Math.max(hi, n0[k]); }
        if (on && n1[k] === n1[k]) { lo = Math.min(lo, n1[k]); hi = Math.max(hi, n1[k]); }
      }
      Rp.view.y0 = ylo.to(Math.max(-60, Math.min(-2, lo) - 1)).value; Rp.view.y1 = yhi.to(Math.min(80, Math.max(2, hi) + 1)).value; Rp.update();
      var span = Rp.v.y1 - Rp.v.y0, step = span > 60 ? 20 : span > 30 ? 10 : 5, yt = [];
      for (var t = Math.ceil(Rp.v.y0 / step) * step; t <= Rp.v.y1; t += step) yt.push([t, t === 0 ? '1' : fmt.pow10(t)]);
      Rp.grid({ xStep: 40, yTicks: yt.map(function (q) { return q[0]; }) });
      Rp.axes({ edge: true, xStep: narrow ? 160 : 40, yTicks: yt, size: narrow ? 10 : 11 });
      fig.label('k', rb.r, rb.b + 20, { anchor: 'e', color: 'muted', size: 12 });
      fig.label('N', rb.l + 6, rb.t + 4, { anchor: 'nw', color: 'muted', size: 13 });
      Rp.hline(0, { color: 'blue', width: 1.8, dash: [7, 5] });
      Rp.path(ks, n0, { color: 'teal', width: 2.2 });
      if (on) { Rp.path(ks, n2, { color: 'red', width: 1.2, dash: [4, 4], alpha: 0.8 }); Rp.path(ks, n1, { color: 'red', width: 2.2 }); }
      var chapter = on && sig === 2.5 && al === 0.6 && gz === 14 && rho.x === 0.8 && rho.y === 14;
      if (chapter) TAB.forEach(function (kk, i) {
        fig.circle(Rp.X(kk), Rp.Y(Math.log10(T0[i])), 4, { fill: false, ring: 'fg', ringWidth: 1.4 });
        fig.circle(Rp.X(kk), Rp.Y(Math.log10(T1[i])), 4, { fill: false, ring: 'fg', ringWidth: 1.4 });
      });

      if (narrow) {
        fig.legend([{ color: 'teal', text: 'true zeros' }, on && { color: 'red', text: 'with ρ*' }],
          { plane: Rp, at: 'nw', size: 10.5 });
        // the growth factor just above the rate line at the right, the one place no curve passes
        if (on) fig.text('×' + fmt(R / ds, 3) + ' per step', rb.r - 4, Rp.Y(0) - 7, { color: R > ds ? 'red' : 'muted', size: 11, weight: 600, align: 'right' });
        return;
      }
      fig.legend([
        { color: 'teal', text: 'zeros on the line' },
        on && { color: 'red', text: 'with the hypothetical zero' },
        on && !narrow && { color: 'red', text: 'its pole term alone', dash: [4, 4], width: 1.2 },
        { color: 'blue', tex: 'rate', dash: [7, 5], width: 1.8 },
        chapter && !narrow && { color: 'fg', dot: true, text: "the chapter's table" }
      ], { plane: Rp, at: 'auto', prefer: ['nw', 'sw'], size: narrow ? 11 : 12.5 });
      fig.panel([
        on ? [{ tex: 'dS' }, fmt(ds, 4), 'red'] : null,
        [{ tex: 'dR' }, fmt(R, 4), 'blue'],
        [{ tex: 'dZ' }, fmt(dz, 4), 'teal'],
        on ? ['growth per step', '×' + fmt(R / ds, 3), R > ds ? 'red' : 'fg'] : null
      ], { plane: Rp, at: 'auto', prefer: ['sw', 'se', 'nw'], id: 'read' });
    };
  }
});
