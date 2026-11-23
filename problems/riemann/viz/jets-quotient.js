/* Functions modulo theta sums. Left: the log-Gaussian u(t) = u_sigma(t / c) and, in blue, u + lambda V_{g_star} +
   mu V_{g_c}, on a log t axis. Right: one small complex plane per zero gamma_k (k = 1..10), with the teal arrow
   Mu(i gamma_k) = c^{i gamma_k} exp(-sigma^2 gamma_k^2 / 2) and the blue arrow of the perturbed function on top.
   The radius is logarithmic (1 at the rim, 10^-8 at the center) so that all ten values show; angles are exact.
   The blue arrows are computed, not copied: 2 xi(1/2 + i gamma) from the kit's Gamma and Z, and
   M V_{g_c}(i gamma) = -2 zeta(s) (1/4 + gamma^2) M bump(s) from the kit's zeta and M bump(s) from mpmath. */
Kit.register('jets-quotient', {
  tex: { t: 't', sig: '\\sigma', logc: '\\log c', lam: '\\lambda', u: 'u(t)=u_\\sigma(t/c)', up: 'u+\\lambda V_{g_\\star}+\\mu V_{g_c}',
    Mu: 'Mu(i\\gamma_k)', MupS: '\\text{perturbed}', Mup:'M(u+\\lambda V_{g_\\star}+\\mu V_{g_c})(i\\gamma_k)' },
  init: function (fig) {
    var M = Kit.math, fmt = Kit.fmt, Z = Kit.zeros, PI = Math.PI, NZ = 10, NT = 401, U = 2, DEC = 8;
    // M bump(1/2 + i gamma_k), k = 1..10, from mpmath at 20 digits.
    var MB = [[0.00040134408176994795, 0.0027445633761089432], [0.0007607737333537567, 0.0004982038719779666], [0.0005216097288873946, 8.23666729779845e-05],
      [0.00025524471503257326, -9.754844576233326e-05], [0.00017129755248880722, -0.00011483496460540124], [6.977280357003592e-05, -0.00010544500907705495],
      [2.8309832728382085e-05, -8.65038709983705e-05], [9.344321097362536e-06, -7.18729973449991e-05], [-1.0343039144196122e-05, -4.6387265936565746e-05],
      [-1.3854095446152346e-05, -3.8348689285513045e-05]];
    var xiK = [], gcK = [];                                       // M V_{g_star} and M V_{g_c} at i gamma_k: zero up to rounding
    for (var k = 0; k < NZ; k++) {
      var g = Z[k], q = 0.25 + g * g, z = M.zeta(0.5, g);
      xiK.push(-q * Math.pow(PI, -0.25) * Math.exp(M.lgamma(M.C(0.25, g / 2)).re) * M.Z(g));
      gcK.push(M.scale(M.mul(z, M.C(MB[k][0], MB[k][1])), -2 * q));
    }
    var ts = new Float64Array(NT), Vs = new Float64Array(NT), Vc = new Float64Array(NT), u0 = new Float64Array(NT), u1 = new Float64Array(NT);
    for (var i = 0; i < NT; i++) ts[i] = Math.exp(-U + 2 * U * i / (NT - 1));
    var tables = fig.job(function* () {                           // the two theta sums on the t grid
      for (var i = 0; i < NT; i++) {
        var t = ts[i], s1 = 0, s2 = 0, n;
        for (n = 1; n * t < 7; n++) { var a = PI * n * n * t * t; s1 += (4 * a * a - 6 * a) * Math.exp(-a); }
        for (n = 1; n * t < 1; n++) { var x2 = n * n * t * t, r = 1 - x2; s2 += 2 * x2 * (x2 * x2 + 4 * x2 - 3) / (r * r * r * r) * Math.exp(-1 / r); }
        Vs[i] = 2 * Math.sqrt(t) * s1; Vc[i] = 2 * Math.sqrt(t) * s2;
        if (i % 50 === 49) yield i / NT;
      }
    });

    var sig = fig.slider({ label: 'Width', tex: 'sig', min: 0.05, max: 0.25, step: 0.01, value: 0.1 });
    var lc = fig.slider({ label: 'Center', tex: 'logc', min: -1, max: 1, step: 0.01, value: 0 });
    // the default already adds a theta sum, so the two different curves and their equal jets show without interaction
    var MU0 = 0.5, lam = fig.slider({ label: 'Multiple of V of g⋆', tex: 'lam', min: -5, max: 5, step: 0.05, value: 2 });
    var muT = MU0, lf = fig.follow(2, { tau: 0.15 }), mf = fig.follow(MU0, { tau: 0.15 }), ly0 = fig.follow(-0.5), ly1 = fig.follow(4.6);
    fig.button({ label: 'Add a random theta sum', onClick: function () {
      var sgn = function () { return Math.random() < 0.5 ? -1 : 1; };
      lam.set(Math.round(sgn() * (1.5 + 3.5 * Math.random()) * 20) / 20);
      muT = sgn() * (0.3 + 0.7 * Math.random());
    } });
    fig.onReset = function () { muT = MU0; };
    var side = function (w, h) { return w < 560 ? [0, Math.round(0.5 * h), w, h] : [Math.round(0.42 * w) + 8, 0, w, h]; };
    var Lp = fig.plane({ x: [Math.exp(-U), Math.exp(U)], y: [-0.5, 4.6], xLog: true, pad: { t: 12, r: 12, b: 24, l: 40 },
      box: function (w, h) { return w < 560 ? [0, 0, w, Math.round(0.5 * h)] : [0, 0, Math.round(0.42 * w), h]; } });
    var Rg = fig.plane({ x: [0, 1], y: [0, 1], pad: { t: 4, r: 8, b: 4, l: 4 }, box: side });

    return function draw() {
      var s = sig.value, c = lc.value, l = lf.to(lam.value).value, mu = mf.to(muT).value, narrow = fig.w < 560, i, k;
      var moved = tables.done && (Math.abs(l) > 1e-3 || Math.abs(mu) > 1e-3);
      var lo = Infinity, hi = -Infinity, nrm = 1 / (s * Math.sqrt(2 * PI));
      for (i = 0; i < NT; i++) {
        var d = Math.log(ts[i]) - c;
        u0[i] = nrm * Math.exp(-d * d / (2 * s * s)); u1[i] = u0[i] + l * Vs[i] + mu * Vc[i];
        lo = Math.min(lo, u0[i], u1[i]); hi = Math.max(hi, u0[i], u1[i]);
      }
      var pad = 0.08 * (hi - lo);
      Lp.view.y0 = ly0.to(lo - pad).value; Lp.view.y1 = ly1.to(hi + pad + 0.22 * (hi - lo)).value; Lp.update();
      Lp.grid({ xTicks: [0.2, 0.5, 1, 2, 5] });
      Lp.hline(0, { color: 'muted', width: 1 });
      Lp.axes({ edge: true, xTicks: [0.2, 0.5, 1, 2, 5], xLabel: 't', xFormat: String });
      
      if (moved) Lp.path(ts, u1, { color: 'blue', width: 2 });
      Lp.path(ts, u0, { color: 'gold', width: 2.4 });
      fig.legend([{ color: 'gold', tex: 'u' }, moved && { color: 'blue', tex: 'up' }], { plane: Lp, at: 'nw', size: narrow ? 10.5 : 12.5 });

      // Right: ten complex planes, one per zero, with a logarithmic radius.
      var rb = Rg.box, lgH = narrow ? 20 : 28, foot = 16, cols = 5, rows = 2;
      var cw = rb.w / cols, ch = (rb.h - lgH - foot) / rows, R = Math.max(8, Math.min(cw - 6, ch - (narrow ? 20 : 26)) / 2 - 2), worst = 0;
      fig.legend([{ color: 'teal', tex: 'Mu', width: 4.2, alpha: 0.8 }, moved && { color: 'blue', tex: narrow ? 'MupS' : 'Mup', width: 1.8 }],
        { plane: Rg, x: rb.l, y: rb.t, dir: 'row', size: narrow ? 11 : 12.5, bg: false });
      for (k = 0; k < NZ; k++) {
        var g = Z[k], cx = rb.l + (k % cols + 0.5) * cw, cy = rb.t + lgH + (Math.floor(k / cols) + 0.5) * ch - 6;
        var mod = Math.exp(-s * s * g * g / 2), ang = g * c, w0 = M.polar(mod, ang);
        var w1 = M.add(w0, M.add(M.C(l * xiK[k], 0), M.scale(gcK[k], mu)));
        worst = Math.max(worst, M.abs(M.sub(w1, w0)));
        fig.circle(cx, cy, R, { fill: false, ring: 'grid', ringWidth: 1 });
        fig.circle(cx, cy, R / 2, { fill: false, ring: 'grid', ringWidth: 1 });
        fig.line(cx - R - 3, cy, cx + R + 3, cy, { color: 'muted', width: 1, alpha: 0.6 });
        fig.line(cx, cy - R - 3, cx, cy + R + 3, { color: 'muted', width: 1, alpha: 0.6 });
        [[w0, 'teal', 4.2, 0.8, 11], moved && [w1, 'blue', 1.8, 1, 8]].forEach(function (e) {
          if (!e) return;
          var m = M.abs(e[0]), rr = R * Math.max(0, 1 + Math.log10(Math.max(m, 1e-300)) / DEC), a2 = M.arg(e[0]);
          if (rr > 1.5) fig.arrow(cx, cy, cx + rr * Math.cos(a2), cy - rr * Math.sin(a2), { color: e[1], width: e[2], alpha: e[3], head: Math.min(e[4], rr * 0.6) });
          else fig.circle(cx, cy, 2.5, { fill: e[1] });
        });
        fig.text('γ' + fmt.sub(k + 1), cx - cw / 2 + 4, cy - ch / 2 + (narrow ? 12 : 16), { color: 'teal', size: narrow ? 11 : 12, weight: 600 });
        var ms = narrow ? (mod >= 0.1 ? fmt(mod, 2) : fmt.sci(mod, 1)) : mod >= 1e-3 ? fmt(mod, Math.max(0, 3 - Math.floor(Math.log10(mod)))) : fmt.sci(mod, 2);
        fig.text(ms, cx, cy + R + (narrow ? 11 : 16), { color: 'fg', size: narrow ? 11 : 11.5, mono: true, align: 'center' });
      }
      var note = 'radius: log scale, 1 at the rim, 10⁻⁸ at the center' + (moved ? '   ·   largest change at a zero: ' + fmt.sci(worst, 1) : '');
      if (narrow) note = moved ? 'change at the zeros ≤ ' + fmt.sci(worst, 1) : 'log radius: 1 at the rim, 10⁻⁸ at the center';
      fig.text(note, rb.l + 2, rb.b - 3, { color: 'muted', size: 11 });
    };
  }
});
