/* Weil's explicit formula as a balance. Top: a smooth bump f(e^u) = phi((u - m)/w) on the axis u = log x, and the
   prime powers it weighs: Lambda(n) f(n) at log n and Lambda(n) f(1/n)/n at -log n. Bottom: the zero side
   Z_N = 2 sum_{k <= N} Re Mf(1/2 + i gamma_k) against Weil's functional W(f); the beam is level when they agree.
   Transforms use the trapezoid rule on 1,200 nodes, which is spectrally accurate for a bump that vanishes to all
   orders at its ends; the integral in W_inf uses Simpson's rule on 2,048 intervals with one Richardson step.
   Checked against mpmath: m = 0, w = log 10 gives W = 0.0070064592 and Z_1 = 0.0094732, as in the chapter. */
Kit.register('explicit-balance', {
  tex: { f: 'f(e^{u})', pn: '\\Lambda(n)\\,f(n)', pr: '\\Lambda(n)\\,f(1/n)/n', x: 'x', u: 'u', ZN: 'Z_N', W: 'W(f)',
    M0: '\\mathcal M f(0)', M1: '\\mathcal M f(1)', P: '-\\Sigma_p\\, W_p(f)', Wi: '-W_\\infty(f)' },
  init: function (fig) {
    var M = Kit.math, fmt = Kit.fmt, Z = Kit.zeros, NZ = Z.length, LOG10 = Math.log(10), U = 6, EG = 0.5772156649015329;
    var NQ = 1200, HQ = 2 / NQ, VQ = new Float64Array(NQ + 1), PH = new Float64Array(NQ + 1), Q = new Float64Array(NQ + 1);
    var phi = function (v) { return Math.abs(v) < 1 ? Math.exp(1 - 1 / (1 - v * v)) : 0; };
    for (var i = 0; i <= NQ; i++) { VQ[i] = -1 + i * HQ; PH[i] = phi(VQ[i]); }
    var PN = [], PU = [], PL = [];                                // prime powers n <= e^6 with log n and Lambda(n)
    for (var n = 2; Math.log(n) <= U; n++) { var l = M.vonMangoldt(n); if (l) { PN.push(n); PU.push(Math.log(n)); PL.push(l); } }
    var BR = new Float64Array(NZ), BI = new Float64Array(NZ), bw = -1, kDone = 0;   // int phi(v) e^{wv/2} e^{i gamma w v} dv
    var S = null, sKey = '', labW = {}, HP = new Float64Array(PN.length), HR = new Float64Array(PN.length);

    var Wd = fig.slider({ label: 'Half-width', min: 0.4, max: 3, step: 0.01, value: LOG10, snap: [LOG10],
      format: function (v) { return 'w = ' + v.toFixed(2); } });
    var Ns = fig.slider({ label: 'Zero pairs', min: 1, max: 200, step: 1, scale: 'log', value: 100, marks: [1, 10, 100],
      format: function (v) { return 'N = ' + v; }, onInput: function () { running = false; } });
    var run = fig.tween(0), running = false;
    var sweep = function () { running = true; run.set(0); Ns.set(1); run.to(Math.log(100), 5000, 'inOutSine'); };
    fig.button({ label: 'Add zeros one by one', onClick: sweep });
    fig.onReset = function () { running = false; };
    if (!Kit.reducedMotion) sweep();

    var T = fig.plane({ x: [-U, U], y: [0, 1.3], pad: { t: 12, r: 14, b: 42, l: 40 }, box: function (w, h) { return [0, 0, w, Math.round(h * 0.56)]; } });
    var B = fig.plane({ x: [0, 1], y: [0, 1], pad: 0, box: function (w, h) { return [0, Math.round(h * 0.56), w, h]; } });
    var ctr = fig.drag({ plane: T, x: 0, y: 1, r: 7, color: 'fg', constrain: function (x) { return [Kit.clamp(x, -3, 3), 1]; } });
    var edge = fig.drag({ plane: T, x: LOG10, y: 0, r: 6, color: 'fg', constrain: function (x) { return [x, 0]; },
      onDrag: function (x) { Wd.set(Kit.clamp(x - ctr.x, 0.4, 3)); } });
    var ycam = fig.follow(1.3), tilt = fig.follow(0, { tau: 0.16 });
    var rows = null, wide = false;
    fig.probe({ plane: B, crosshair: false, marker: false, rows: function () { return wide ? null : rows; } });

    /* The prime side, the poles, and the term at infinity for the bump with center m and half-width w. */
    function sides(m, w) {
      var F = function (u) { return phi((u - m) / w); }, f1 = F(0), s0 = 0, s1 = 0, pr = 0, j;
      for (j = 0; j <= NQ; j++) { s0 += PH[j]; s1 += PH[j] * Math.exp(w * VQ[j]); }
      for (j = 0; j < PN.length; j++) pr += PL[j] * (F(PU[j]) + F(-PU[j]) / PN[j]);
      var g = function (u) { if (u === 0) return f1 / 2; var e = Math.exp(u); return (e * F(u) + F(-u) - 2 * f1) / (e - 1 / e); };
      var R = Math.abs(m) + w, K = 2048, h = R / K, ends = g(0) + g(R), odd = 0, e2 = 0, e4 = 0;
      for (j = 1; j < K; j++) { var v = g(j * h); if (j & 1) odd += v; else if (j & 2) e2 += v; else e4 += v; }
      var I = (16 * h / 3 * (ends + 4 * odd + 2 * (e2 + e4)) - 2 * h / 3 * (ends + 4 * e2 + 2 * e4)) / 15 - 2 * f1 * Math.atanh(Math.exp(-R));
      var o = { M0: w * HQ * s0, M1: w * HQ * s1 * Math.exp(m), P: pr, Wi: (Math.log(4 * Math.PI) + EG) * f1 + I };
      o.W = o.M0 + o.M1 - o.P - o.Wi;
      return o;
    }

    return function draw() {
      if (running) { Ns.set(Math.round(Math.exp(run.value))); if (!run.active) running = false; }
      var m = ctr.x, w = Wd.value, N = Ns.value, F = function (u) { return phi((u - m) / w); };
      edge.x = m + w; edge.y = 0;
      if (sKey !== m + ',' + w) { sKey = m + ',' + w; S = sides(m, w); }
      if (w !== bw) { bw = w; kDone = 0; for (var q = 0; q <= NQ; q++) Q[q] = PH[q] * Math.exp(0.5 * w * VQ[q]) * HQ; }
      for (var stop = Math.min(N, kDone + 40); kDone < stop; kDone++) {         // at most 40 zeros per frame
        var gw = Z[kDone] * w, cr = Math.cos(gw * HQ), sr = Math.sin(gw * HQ), zr = Math.cos(gw), zi = -Math.sin(gw), ar = 0, ai = 0;
        for (var r = 0; r <= NQ; r++) { ar += Q[r] * zr; ai += Q[r] * zi; var t = zr * cr - zi * sr; zi = zr * sr + zi * cr; zr = t; }
        BR[kDone] = ar; BI[kDone] = ai;
      }
      if (kDone < N) fig.more();
      var Zs = 0, have = Math.min(N, kDone), amp = 2 * w * Math.exp(m / 2);
      for (var k = 0; k < have; k++) Zs += amp * (Math.cos(Z[k] * m) * BR[k] - Math.sin(Z[k] * m) * BI[k]);

      // Top: the bump and the prime powers it weighs.
      var hmax = 0, j, hp = HP, hr = HR;
      for (j = 0; j < PN.length; j++) { hp[j] = PL[j] * F(PU[j]); hr[j] = PL[j] * F(-PU[j]) / PN[j]; hmax = Math.max(hmax, hp[j]); }
      T.view.y1 = ycam.to(Math.max(1.3, 1.12 * hmax)).value; T.update();
      var b = T.box, yl1 = b.b + 15, yl2 = b.b + 32;
      T.grid({ xStep: 1 });
      T.axes({ x: false, origin: [-U, 0] });
      T.fillBetween(F, 0, m - w, m + w, { color: 'blue', alpha: 0.22 });
      T.plot(F, { color: 'blue', width: 2.2, from: Math.max(-U, m - w), to: Math.min(U, m + w) });
      T.hline(0, { color: 'muted', width: 1 });
      var reachR = T.X(0) + 5, reachL = T.X(0) - 5, sz = fig.w < 560 ? 10 : 10.5, ctx = fig.ctx;
      if (labW.sz !== sz) { labW.sz = sz; for (j = 0; j < PN.length; j++) { labW[2 * j] = fig.measure(String(PN[j]), sz) / 2; labW[2 * j + 1] = fig.measure('1/' + PN[j], sz) / 2; } }
      fig.text('1', T.X(0), yl1, { color: 'muted', size: sz, align: 'center' });
      fig.stroke({ color: 'muted', width: 1, alpha: 0.6 }); ctx.beginPath();
      for (j = 0; j < PN.length; j++) { ctx.moveTo(T.X(PU[j]), b.b); ctx.lineTo(T.X(PU[j]), b.b - 4); ctx.moveTo(T.X(-PU[j]), b.b); ctx.lineTo(T.X(-PU[j]), b.b - 4); }
      ctx.stroke();
      for (j = 0; j < PN.length; j++) {
        var px = T.X(PU[j]), qx = T.X(-PU[j]), onP = hp[j] > 2e-3 * T.view.y1, onR = hr[j] > 2e-3 * T.view.y1, half = labW[2 * j], halfR = labW[2 * j + 1];
        if (onP) { T.segment(PU[j], 0, PU[j], hp[j], { color: 'gold', width: 2.6 }); T.point(PU[j], hp[j], { color: 'gold', r: 2.6 }); }
        if (onR) { T.segment(-PU[j], 0, -PU[j], hr[j], { color: 'gold', width: 2, alpha: 0.65 }); T.point(-PU[j], hr[j], { color: 'gold', r: 2.4 }); }
        if (px - half > reachR + 4 && px + half < fig.w - 2) { fig.text(String(PN[j]), px, yl1, { color: onP ? 'gold' : 'muted', size: sz, align: 'center' }); reachR = px + half; }
        if (PN[j] <= 60 && qx + halfR < reachL - 4 && qx - halfR > b.l - 4) { fig.text('1/' + PN[j], qx, yl1, { color: onR ? 'gold' : 'muted', size: sz, align: 'center' }); reachL = qx - halfR; }
      }
      for (var u = -U; u <= U; u++) fig.text(fmt(u), T.X(u), yl2, { color: 'muted', size: 11, align: 'center' });
      fig.label('x', b.l - 14, yl1 - 4, { anchor: 'e', color: 'muted', size: 12.5 });
      fig.label('u', b.l - 14, yl2 - 4, { anchor: 'e', color: 'muted', size: 12.5 });
      fig.legend([{ color: 'blue', fill: true, tex: 'f' }, { color: 'gold', tex: 'pn', width: 2.6 }, { color: 'gold', tex: 'pr', width: 2, alpha: 0.65 }],
        { plane: T, prefer: ['nw', 'ne'], size: fig.w < 560 ? 11.5 : 13 });

      // Bottom: the balance. Z_N on the left pan, W(f) on the right; the heavier side goes down.
      wide = fig.w >= 720;
      rows = [[{ tex: 'M0' }, fmt(S.M0, 6), 'blue'], [{ tex: 'M1' }, fmt(S.M1, 6), 'blue'], [{ tex: 'P' }, fmt(-S.P, 6), 'gold'],
        [{ tex: 'Wi' }, fmt(-S.Wi, 6)], [{ tex: 'W' }, fmt(S.W, 8), 'gold']];
      var y0 = B.box.t + 6, y1 = fig.h - 4, cx = wide ? (fig.w - 250) / 2 : fig.w / 2;
      var L = wide ? Math.min(0.3 * (fig.w - 250), 220) : Math.min(0.34 * fig.w, 200);
      var py = y0 + 36, hang = Kit.clamp((y1 - py) * 0.55, 30, 80), room = Math.max(8, y1 - py - hang - 26);
      var rel = 100 * (Zs - S.W) / (Math.abs(S.W) + 0.01), th = Math.min(0.3, Math.asin(Math.min(1, room / L)));
      var a = th * tilt.to(Math.atan(rel) * 2 / Math.PI).value, ca = Math.cos(a), sa = Math.sin(a);
      var scale = Math.max(Math.abs(Zs), Math.abs(S.W), 1e-12), barMax = 0.62 * hang;
      [[-1, Zs, 'teal', 'ZN'], [1, S.W, 'gold', 'W']].forEach(function (s) {
        var ex = cx + s[0] * L * ca, ey = py - s[0] * L * sa, pan = ey + hang, hb = barMax * Math.abs(s[1]) / scale;
        fig.line(ex, ey, ex - 30, pan, { color: 'muted', width: 1 }); fig.line(ex, ey, ex + 30, pan, { color: 'muted', width: 1 });
        fig.line(ex - 34, pan, ex + 34, pan, { color: 'fg', width: 3 });
        if (s[1] >= 0) fig.rect(ex - 10, pan - 1.5 - hb, 20, hb, { fill: s[2], alpha: 0.9 });
        else fig.rect(ex - 10, pan - 1.5 - hb, 20, hb, { fill: s[2], alpha: 0.25, color: s[2], width: 1.5, dash: [3, 3] });
        var parts = [{ tex: s[3] }, ' = ' + fmt(s[1], 8)], tw = fig.measure(parts[1], 12.5, 500, true) + fig.labelSize(s[3], 12.5).w;
        fig.mathText(parts, Kit.clamp(cx + s[0] * L, tw / 2 + 6, fig.w - tw / 2 - 6), y0 + 10, { align: 'center', color: s[2], mono: true });
      });
      fig.line(cx - L * ca, py + L * sa, cx + L * ca, py - L * sa, { color: 'fg', width: 3 });
      fig.ctx.beginPath(); fig.ctx.moveTo(cx, py); fig.ctx.lineTo(cx - 15, y1 - 20); fig.ctx.lineTo(cx + 15, y1 - 20); fig.ctx.closePath();
      fig.ctx.fillStyle = fig.color('muted', 0.45); fig.ctx.fill();
      fig.circle(cx, py, 4, { fill: 'fg', ring: 'stage', ringWidth: 1.5 });
      var d = Zs - S.W, off = Math.abs(rel) > 0.5, ds = Math.abs(d) < 5e-11 ? '0 to 10 decimals' : (d > 0 ? '+' : '') + fmt.sci(d, 1);
      fig.mathText([{ tex: 'ZN' }, ' − ', { tex: 'W' }, ' = ' + ds], cx, y1 - 8, { align: 'center', color: off ? 'red' : 'muted', size: 12 });
      if (have < N) fig.text('summing zeros ' + have + ' of ' + N, cx, py + 18, { color: 'muted', size: 11, align: 'center' });
      var hint = wide ? 'drag the bump or its edge' : 'tap the balance for the terms', hs = wide ? 11 : 10, hw = fig.measure(hint, hs);
      fig.rect(b.r - hw - 8, b.t - 2, hw + 8, hs + 6, { fill: 'stage', alpha: 0.85 });
      fig.text(hint, b.r - 4, b.t + 8, { color: 'muted', size: hs, align: 'right' });
      if (!wide) return;
      var px0 = fig.w - 236, rh = 23, pt = B.box.t + Math.max(8, (B.box.h - 5 * rh - 14) / 2);       // the terms of W(f), summed
      fig.rect(px0, pt, 224, 5 * rh + 14, { fill: 'stage', alpha: 0.88 });
      for (var ri = 0; ri < 5; ri++) {
        var ry = pt + 7 + rh * (ri + 0.5) + (ri === 4 ? 4 : 0);
        fig.label(rows[ri][0].tex, px0 + 10, ry, { anchor: 'w', color: rows[ri][2] || 'fg', size: 14, id: 'row' + ri });
        fig.text(rows[ri][1], px0 + 214, ry, { color: rows[ri][2] || 'fg', size: 12.5, mono: true, align: 'right', baseline: 'middle' });
      }
      fig.line(px0 + 10, pt + 7 + 4 * rh + 2, px0 + 214, pt + 7 + 4 * rh + 2, { color: 'muted', width: 1 });
    };
  }
});
