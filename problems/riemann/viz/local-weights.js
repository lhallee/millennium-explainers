/* The local weights -L_v'/L_v on the half-line u = log x > 0. A finite prime p puts a point mass log p at each
   u = k log p; the infinite place spreads the density 1 / (1 - e^{-2u}) against du (Gauss's integral), cut at
   height 4 near u = 0, where the formula subtracts a constant to tame it. "Weigh by x^(-1/2)" multiplies every
   height by e^{-u/2}: masses log p * p^(-k/2) and density e^{-u/2} / (1 - e^{-2u}). */
Kit.register('local-weights', {
  tex: { inf: '-L_\\infty\'/L_\\infty', fin: '-L_p\'/L_p', all: '\\Lambda(n),\\ p \\le 50', u: 'u', x: 'x', xh: 'x^{-1/2}', eu: 'e^{-u/2}' },
  init: function (fig) {
    var M = Kit.math, fmt = Kit.fmt, U1 = 6, CL = 4, PR = [2, 3, 5, 7, 11, 13];
    var PN = [], PU = [], PL = [];                               // prime powers n <= e^6 whose prime is at most 50
    for (var n = 2; Math.log(n) <= U1; n++) {
      var l = M.vonMangoldt(n);
      if (l && Math.exp(l) <= 50.5) { PN.push(n); PU.push(Math.log(n)); PL.push(l); }
    }
    var grow = PR.map(function (p) { return fig.tween(p <= 3 ? 1 : 0); });
    var togg = PR.map(function (p, i) {
      return fig.toggle({ label: 'p = ' + p, value: p <= 3, onInput: function (v) { grow[i].to(v ? 1 : 0, 550, 'outCubic'); } });
    });
    var allT = fig.tween(0), lamT = fig.tween(0);
    var all = fig.toggle({ label: 'All primes up to 50', value: false, onInput: function (v) { allT.to(v ? 1 : 0, 450); } });
    var half = fig.toggle({ label: 'Weigh by', tex: 'xh', value: false, onInput: function (v) { lamT.to(v ? 1 : 0, 700); } });
    fig.onReset = function () { for (var i = 0; i < PR.length; i++) grow[i].set(togg[i].value ? 1 : 0); allT.set(0); lamT.set(0); };

    var P = fig.plane({ x: [0, U1], y: [0, 4.6], pad: { t: 14, r: 14, b: 44, l: 36 } });
    var lam = 0;
    var dens = function (u) { return u <= 0 ? Infinity : Math.exp(-lam * u / 2) / (1 - Math.exp(-2 * u)); };
    var uAt = function (y) { var lo = 1e-4, hi = 1; for (var it = 0; it < 40; it++) { var mid = (lo + hi) / 2; if (dens(mid) > y) lo = mid; else hi = mid; } return hi; };
    var cut = { lam: -1, uc: 0, ut: 0 }, widths = {};
    fig.probe({ plane: P, crosshair: 'x',
      snap: function (u) { u = Kit.clamp(u, 0.02, U1); return [u, Math.min(dens(u), CL)]; },
      rows: function (u) {
        var r = [[{ tex: 'u' }, fmt(u, 2)], [{ tex: 'x' }, fmt.sig(Math.exp(u))], [{ tex: 'inf' }, fmt(dens(u), 3), 'blue']];
        var best = -1, bd = 6 / P.box.w * 6;                     // a spike within 6 px
        for (var j = 0; j < PN.length; j++) if (Math.abs(PU[j] - u) < bd) { bd = Math.abs(PU[j] - u); best = j; }
        if (best >= 0) r.push(['n = ' + PN[best], fmt(PL[best] * Math.exp(-lam * PU[best] / 2), 3), 'gold']);
        return r;
      } });

    return function draw() {
      lam = lamT.value;
      if (cut.lam !== lam) { cut.lam = lam; cut.uc = uAt(CL); cut.ut = uAt(1.2 * P.v.y1); }
      var b = P.box, uc = cut.uc;
      P.grid({ xStep: 1, yStep: 1 });
      P.axes({ x: false, origin: [0, 0], yStep: 1 });
      P.hline(0, { color: 'muted', width: 1 });
      for (var k = 0; k <= U1; k++) fig.text(String(k), P.X(k), b.b + 15, { color: 'muted', size: 11.5, align: 'center' });
      [2, 10, 100, 400].forEach(function (v) {
        fig.line(P.X(Math.log(v)), b.b + 21, P.X(Math.log(v)), b.b + 26, { color: 'muted', width: 1 });
        fig.text(fmt(v), P.X(Math.log(v)), b.b + 38, { color: 'muted', size: 11.5, align: 'center' });
      });
      fig.label('u', b.l - 10, b.b + 11, { anchor: 'e', color: 'muted', size: 13 });
      fig.label('x', b.l - 10, b.b + 34, { anchor: 'e', color: 'muted', size: 13 });

      // The infinite place: a density, cut at height CL where it diverges.
      P.fillBetween(function (u) { return Math.min(CL, dens(u)); }, 0, 0, U1, { color: 'blue', alpha: 0.2 });
      P.plot(dens, { color: 'blue', width: 2.2, from: uc, to: U1 });
      P.plot(dens, { color: 'blue', width: 1.4, dash: [4, 4], from: cut.ut, to: uc });
      P.segment(0, CL, uc, CL, { color: 'blue', width: 1.4, dash: [4, 4] });
      P.text('renormalized', uc + 0.08, CL + 0.12, { color: 'blue', size: 11, baseline: 'bottom' });

      // All prime powers with p <= 50, faint, then the chosen primes with their labels.
      var ga = allT.value, j, i;
      if (ga > 0) for (j = 0; j < PN.length; j++) P.segment(PU[j], 0, PU[j], ga * PL[j] * Math.exp(-lam * PU[j] / 2), { color: 'gold', width: 1.5, alpha: 0.45 });
      var reach = [];
      for (i = 0; i < PR.length; i++) {
        var g = grow[i].value, p = PR[i], lp = Math.log(p);
        if (g <= 0) continue;
        for (k = 1; k * lp <= U1 + 1e-9; k++) {
          var h = g * lp * Math.pow(p, -lam * k / 2), u = k * lp, px = P.X(u), py = P.Y(h);
          P.segment(u, 0, u, h, { color: 'gold', width: 2.6 });
          fig.circle(px, py, 3, { fill: 'gold', ring: 'stage', ringWidth: 1.5 });
          var name = p + (k > 1 ? fmt.sup(k) : ''), wv = widths[name] || (widths[name] = fig.measure(name, 10.5) / 2 + 2), free = true;
          for (var q = 0; q < reach.length; q++) if (Math.abs(reach[q][0] - px) < reach[q][2] + wv && Math.abs(reach[q][1] - py) < 13) free = false;
          if (free && g > 0.6) { fig.text(name, px, py - 7, { color: 'gold', size: 10.5, align: 'center', alpha: (g - 0.6) / 0.4 }); reach.push([px, py, wv]); }
        }
      }
      var lg = fig.legend([{ color: 'blue', fill: true, tex: 'inf' }, { color: 'gold', tex: 'fin', width: 2.6 }, ga > 0 && { color: 'gold', tex: 'all', width: 1.5, alpha: 0.45 }],
        { plane: P, prefer: ['ne', 'se'], size: fig.w < 560 ? 12 : 13 });
      if (lam > 0) fig.mathText(['heights × ', { tex: 'eu' }], lg.x + lg.w - 6, lg.y + lg.h + 10, { align: 'right', color: 'muted', size: 11.5, alpha: lam });
    };
  }
});
