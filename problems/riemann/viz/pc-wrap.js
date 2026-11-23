/* Wrapping the theta sum of g_star onto the circle R_{>0} / p^Z. Left: the graph of Theta(t) over u = log t on a straight
   baseline bends, with a constant curvature that grows with the wrap parameter w, until each segment of length log p
   is one turn of a circle whose circumference is proportional to log p; while it bends the turns sit on a spiral that
   closes up at w = 1, where the copies fade into their sum P(x) = sum_k Theta(p^k x), drawn radially. Right: |c_m|
   of P for m = 0..6 on a log scale, from the chapter's closed form c_m = (2 / log p) xi(1 + 2 pi i m / log p)
   (eq-pc-unfold, eq-pc-gstar), with xi from the kit's zeta and log Gamma: about 13 correct digits even where |c_m| is
   near 1e-15, where a DFT of samples would be at the edge of double precision. The DFT of 256 samples over one period
   stays as a check: it must agree to 1e-6 wherever |c_m| > 1e-11, and |c_0|, |c_1| must match the spec's values. */
Kit.register('pc-wrap', {
  tex: { theta: '\\Theta_{g_\\star}(t)', per: '\\Phi_p\\Theta_{g_\\star}', cm: '\\lvert c_m\\rvert', m: 'm', p: 'p', u: 'u=\\log t' },
  init: function (fig) {
    var fmt = Kit.fmt, PI = Math.PI, U = 2.5, NU = 500, NP = 256, PR = [2, 3, 5, 7], FLOOR = 1e-16;
    var g = function (x) { var x2 = x * x; return (4 * PI * PI * x2 * x2 - 6 * PI * x2) * Math.exp(-PI * x2); };
    /* Theta(t) = 2 sum_{n <= 60} g(n t); for t < 1 the functional equation Theta(t) = Theta(1/t) / t avoids cancellation. */
    function theta(t) {
      if (t < 0.12 || t > 10) return 0;
      if (t < 1) return theta(1 / t) / t;
      var s = 0;
      for (var n = 1; n <= 60 && n * t < 7; n++) s += g(n * t);
      return 2 * s;
    }
    /* |c_m| = (2 / L) |xi(1 + i tau)|, tau = 2 pi m / L, with |xi(s)| = |s (s - 1)| / 2 pi^(-1/2) |Gamma(s / 2)| |zeta(s)| on Re s = 1;
       c_0 = 2 xi(1) / L = 1 / L. */
    function cm(m, L) {
      if (m === 0) return 1 / L;
      var tau = 2 * PI * m / L, z = Kit.math.zeta(1, tau), lg = Kit.math.lgamma(Kit.math.C(0.5, tau / 2)).re;
      return (2 / L) * 0.5 * tau * Math.sqrt(1 + tau * tau) * Math.exp(lg - 0.5 * Math.log(PI)) * Math.hypot(z.re, z.im);
    }
    var lineU = new Float64Array(NU + 1), lineV = new Float64Array(NU + 1), data = [];
    for (var i = 0; i <= NU; i++) lineU[i] = -U + 2 * U * i / NU;
    /* About 3 ms of work, so it runs as a job: the theta graph, then per prime P on one period and |c_m| for m = 0..6. */
    var job = fig.job(function* () {
      for (var i = 0; i <= NU; i++) lineV[i] = theta(Math.exp(lineU[i]));
      yield 0.2;
      for (var pi = 0; pi < PR.length; pi++) {
        var p = PR[pi], L = Math.log(p), P = new Float64Array(NP), c = new Float64Array(7);
        for (var j = 0; j < NP; j++) {
          var x = Math.exp(L * j / NP), s = 0;
          for (var k = -12; k <= 12; k++) s += theta(Math.pow(p, k) * x);
          P[j] = s;
        }
        yield 0.2 + 0.2 * pi;
        for (var m = 0; m <= 6; m++) {
          var re = 0, im = 0;
          for (var q = 0; q < NP; q++) { re += P[q] * Math.cos(2 * PI * m * q / NP); im -= P[q] * Math.sin(2 * PI * m * q / NP); }
          var dft = Math.hypot(re, im) / NP;
          c[m] = cm(m, L);
          if (c[m] > 1e-11 && Math.abs(dft - c[m]) > 1e-6 * c[m]) console.error('pc-wrap: |c_' + m + '| at p = ' + p + ' is ' + c[m] + ' in closed form, ' + dft + ' by DFT');
        }
        var spec = { 2: [1.4427, 0.1844], 3: [0.9102, 0.4188] }[p];
        if (spec && (Math.abs(c[0] - spec[0]) > 6e-5 || Math.abs(c[1] - spec[1]) > 6e-5)) console.error('pc-wrap: |c_0|, |c_1| at p = ' + p + ' are ' + c[0] + ', ' + c[1]);
        data.push({ L: L, P: P, c: c });
        yield 0.3 + 0.2 * pi;
      }
    }, { onDone: function () { bars.forEach(function (b, m) { b.set(Math.log10(data[PR.indexOf(pS.value)].c[m])); }); } });

    var pS = fig.slider({ label: 'Prime', tex: 'p', values: PR, value: 2, format: function (v) { return 'p = ' + v; } });
    var play = fig.player({ label: 'Wrap', duration: 3, value: 0, reduced: 1, format: function (v) { return 'w = ' + fmt(v, 2); } });
    var Lcam = fig.follow(Math.log(2), { tau: 0.15 });
    var bars = [0, 1, 2, 3, 4, 5, 6].map(function (m) { return fig.follow(-16, { tau: 0.12 }); });
    var split = function (w) { return Math.round(w * (w < 560 ? 0.6 : 0.64)); };
    var BP = fig.plane({ x: [-0.7, 6.7], y: [FLOOR, 10], yLog: true, pad: { t: 22, r: 14, b: 26, l: 46 },
      box: function (w, h) { return [split(w), 0, w, h]; } });
    var probe = fig.probe({ plane: BP, crosshair: false, snap: function (x) { var m = Kit.clamp(Math.round(x), 0, 6); return [m, Math.pow(10, bars[m].value)]; },
      rows: function (x) { var m = Math.round(x), d = data[PR.indexOf(pS.value)]; return [['m', String(m)], d ? [{ tex: 'cm' }, fmt.sci(d.c[m]), 'teal'] : null]; } });

    var pts = new Float64Array(2 * (NU + 1));
    return function draw() {
      var d = data[PR.indexOf(pS.value)], w = play.value, e = Kit.ease.inOutCubic(w), L = Lcam.to(Math.log(pS.value)).value;
      var lw = split(fig.w), H = fig.h, cx = lw / 2, cy = H / 2 + 4, avail = Math.min(lw, H) / 2 - 10, ctx = fig.ctx;
      var R0 = 0.5 * avail * L / Math.log(7), hS = 0.5 * avail / 1.9;
      var sLine = (lw - 36) / (2 * U), sCirc = R0 * 2 * PI / L, s = Kit.lerp(sLine, sCirc, e);
      var kap = e * 2 * PI / L, ax = cx, ay = Kit.lerp(cy + 0.9 * hS, cy - R0, e), spiral = Math.sin(PI * e) * 0.3 * hS / L;
      /* Screen point at parameter u with offset h (px) along the outward normal, written into out[0], out[1]. */
      function at(u, h, out, o) {
        var off = h + spiral * u;
        if (kap < 1e-6) { out[o] = ax + s * u; out[o + 1] = ay - off; return; }
        var Rc = s / kap, th = kap * u, sn = Math.sin(th), cs = Math.cos(th);
        out[o] = ax + (Rc + off) * sn; out[o + 1] = ay + Rc - (Rc + off) * cs;
      }
      function stroke(n, style) {
        fig.stroke(style); ctx.beginPath(); ctx.moveTo(pts[0], pts[1]);
        for (var i = 1; i < n; i++) ctx.lineTo(pts[2 * i], pts[2 * i + 1]);
        ctx.stroke(); ctx.setLineDash([]);
      }

      // The baseline (one spiral turn per segment of length log p), its ticks at u = k log p, and the theta graph.
      for (var i = 0; i <= NU; i++) at(lineU[i], 0, pts, 2 * i);
      stroke(NU + 1, { color: 'muted', width: 1.4 });
      var tk = [0, 0, 0, 0], kMax = Math.floor(U / L);
      for (var k = -kMax; k <= kMax; k++) {
        at(k * L, -5, tk, 0); at(k * L, 5, tk, 2);
        fig.line(tk[0], tk[1], tk[2], tk[3], { color: 'muted', width: 1.4 });
        if (e < 0.6 && Math.abs(k) <= 4) fig.text(k === 0 ? '1' : 'p' + (k === 1 ? '' : fmt.sup(k)), tk[0], tk[1] + 14, { color: 'muted', size: 11, align: 'center', alpha: 1 - e / 0.6 });
      }
      var fade = Kit.clamp((w - 0.75) / 0.25, 0, 1);
      for (var j = 0; j <= NU; j++) at(lineU[j], hS * lineV[j], pts, 2 * j);
      stroke(NU + 1, { color: 'gold', width: 2.2, alpha: 1 - 0.75 * fade });
      if (e < 0.5) { at(0.45, hS * theta(Math.exp(0.45)), tk, 0); fig.label('theta', tk[0] + 8, tk[1] - 6, { anchor: 'sw', color: 'gold', size: 13 }); }
      if (e < 0.3) fig.label('u', lw - 10, ay - 8, { anchor: 'se', color: 'muted', size: 12 });

      // The periodization P on the closed circle, with spokes from the circle: the copies above add up to it.
      if (fade > 0 && d) {
        var Rn = s / Math.max(kap, 1e-6), ccy = ay + Rn;
        for (var q = 0; q <= NP; q++) {
          var th = 2 * PI * q / NP, rr = Rn + hS * d.P[q % NP];
          pts[2 * q] = ax + rr * Math.sin(th); pts[2 * q + 1] = ccy - rr * Math.cos(th);
        }
        fig.stroke({ color: 'gold', width: 1, alpha: 0.3 * fade }); ctx.beginPath();
        for (var sp = 0; sp < NP; sp += 8) { var ts = 2 * PI * sp / NP; ctx.moveTo(ax + Rn * Math.sin(ts), ccy - Rn * Math.cos(ts)); ctx.lineTo(pts[2 * sp], pts[2 * sp + 1]); }
        ctx.stroke();
        stroke(NP + 1, { color: 'gold', width: 2.8, alpha: fade });
        var qa = NP / 8;
        fig.label('per', pts[2 * qa] + 6, pts[2 * qa + 1] - 4, { anchor: 'sw', color: 'gold', size: 13 });
        fig.text('one turn = log p = ' + fmt(d.L, 3), ax, Math.min(H - 8, ccy + Rn + hS * 1.3 + 14), { color: 'muted', size: 11.5, align: 'center', alpha: fade });
      }

      // Fourier coefficients of P: none is zero.
      var bb = BP.box, bw = Math.min(26, 0.55 * (BP.X(1) - BP.X(0))), curM = probe.active ? Math.round(probe.x) : -1;
      BP.grid({ xStep: 1 });
      BP.axes({ edge: true, xTicks: [0, 1, 2, 3, 4, 5, 6], size: 10.5 });
      if (!d) fig.text('computing: ' + Math.round(100 * job.progress) + '%', (bb.l + bb.r) / 2, (bb.t + bb.b) / 2, { color: 'muted', size: 12, align: 'center' });
      for (var m = 0; d && m <= 6; m++) {
        var top = BP.Y(Math.pow(10, bars[m].to(Math.log10(d.c[m])).value)), x0 = BP.X(m) - bw / 2;
        fig.rect(x0, top, bw, bb.b - top, { fill: 'teal', alpha: m === curM ? 1 : 0.85 });
        if (bb.w > 260) fig.text(fmt.sig(d.c[m]), BP.X(m), top - 5, { color: 'teal', size: 10, align: 'center' });
      }
      fig.label('cm', bb.l - 4, bb.t - 6, { anchor: 'se', color: 'muted', size: 12 });
      fig.label('m', bb.r, bb.b + 13, { anchor: 'ne', color: 'muted', size: 12 });
    };
  }
});
