/* Analytic continuation of 1/(1 - z) as a chain of power series. Each disc has center c and radius |c - 1|, the
   distance to the pole, and carries the series sum_k (z - c)^k / (1 - c)^(k+1). On first view the chain of the
   chapter's example (centers 0, 0.8i, 1 + i, 1.6 + 0.5i) grows around the pole to the target T = 2. "Add disc" steps
   from the last center toward T along a logarithmic spiral about the pole, by at most 85% of the last radius, so each
   new center lies inside the previous disc and the chain bends around the pole instead of running into it. */
Kit.register('continuation-discs', {
  tex: { val: '1/(1-T)', T: 'T' },
  init: function (fig) {
    var M = Kit.math, fmt = Kit.fmt, MAXD = 14, STEP = 0.85;
    var BOOK = [M.C(0, 0.8), M.C(1, 1), M.C(1.6, 0.5)];
    var discs = [], auto = 0, grows = [];
    for (var g = 0; g < MAXD; g++) grows.push(fig.tween(0));
    function disc(c) {
      var d = { c: c, r: M.abs(M.sub(c, M.C(1, 0))), grow: grows[discs.length] };
      d.grow.set(0); d.grow.to(1, 400, 'outCubic'); discs.push(d); return d;
    }
    function start() {
      discs = []; disc(M.C(0, 0)).grow.set(1); auto = 0;
      if (Kit.reducedMotion) { BOOK.forEach(disc); auto = -1; }
    }
    function last() { return discs[discs.length - 1]; }
    function covers(d, z) { return M.abs(M.sub(z, d.c)) < d.r; }

    /* The next center: (c - 1) e^{lambda D}, with D = log(T - 1) - log(c - 1) on the branch through the shorter way
       around the pole, and lambda in (0, 1] the largest with |step| <= STEP |c - 1|. */
    function next(c, z) {
      var a = M.sub(c, M.C(1, 0)), D = M.sub(M.log(M.sub(z, M.C(1, 0))), M.log(a));
      D.im -= 2 * Math.PI * Math.round(D.im / (2 * Math.PI));
      var lo = 0, hi = 1, len = function (l) { return M.abs(M.sub(M.mul(a, M.exp(M.scale(D, l))), a)); };
      if (len(1) <= STEP * M.abs(a)) lo = 1;
      else for (var k = 0; k < 40; k++) { var mid = (lo + hi) / 2; if (len(mid) <= STEP * M.abs(a)) lo = mid; else hi = mid; }
      return M.add(M.C(1, 0), M.mul(a, M.exp(M.scale(D, lo))));
    }

    var P = fig.plane({ x: [-3, 3], y: [-1.5, 2.5], equal: true, pad: { t: 10, r: 10, b: 24, l: 30 } });
    var T = fig.drag({ plane: P, x: 2, y: 0, r: 7, color: 'gold', label: 'T', labelAnchor: 'sw',
      constrain: function (x, y) {
        x = Kit.clamp(x, P.v.x0, P.v.x1); y = Kit.clamp(y, P.v.y0, P.v.y1);
        var d = Math.hypot(x - 1, y);
        return d < 0.08 ? [1 + 0.08 * (x - 1) / (d || 1), 0.08 * y / (d || 1)] : [x, y];
      },
      onDrag: function () { auto = -1; } });
    var add = fig.button({ label: 'Add disc', onClick: function () { auto = -1; disc(next(last().c, M.C(T.x, T.y))); } });
    var sums = fig.toggle({ label: 'Show partial sums', value: false });
    fig.onReset = start;
    start();

    return function draw() {
      var z = M.C(T.x, T.y), L = last();
      if (auto >= 0 && !L.grow.active) {
        if (auto < BOOK.length) disc(BOOK[auto++]); else auto = -1;
        L = last();
      }
      add.enable(auto < 0 && discs.length < MAXD && !covers(L, z));
      var narrow = fig.w < 560;

      P.grid({ xStep: 1, yStep: 1 });
      P.axes({ xStep: 1, yStep: 1 });
      var b = P.box, ppu = P.sx, ctx = fig.ctx;
      P.clip(function () {
        discs.forEach(function (d, i) {
          var cur = i === discs.length - 1, rr = d.r * ppu * d.grow.value;
          ctx.beginPath(); ctx.arc(P.X(d.c.re), P.Y(d.c.im), Math.max(0, rr), 0, 2 * Math.PI);
          ctx.fillStyle = fig.color('blue', cur ? 0.16 : i === 0 ? 0.1 : 0.04); ctx.fill();
          fig.stroke({ color: 'blue', width: cur ? 2 : 1.2, alpha: cur ? 1 : 0.45 }); ctx.stroke();
        });
      });
      for (var i = 1; i < discs.length; i++) P.segment(discs[i - 1].c.re, discs[i - 1].c.im, discs[i].c.re, discs[i].c.im, { color: 'blue', width: 1.2, alpha: 0.6, dash: [3, 3] });
      discs.forEach(function (d, i) { P.point(d.c.re, d.c.im, { color: 'blue', r: i === discs.length - 1 ? 3.5 : 2.5 }); });

      // The pole, a red cross that every circle touches.
      var px = P.X(1), py = P.Y(0);
      fig.line(px - 6, py - 6, px + 6, py + 6, { color: 'red', width: 2.6 });
      fig.line(px - 6, py + 6, px + 6, py - 6, { color: 'red', width: 2.6 });
      fig.rect(px + 6, py + 9, 28, 15, { fill: 'stage', alpha: 0.8 });
      fig.text('pole', px + 8, py + 21, { color: 'red', size: 12, align: 'left' });

      // Readouts: the exact value, and the last disc's series at T.
      var v = M.div(M.C(1, 0), M.sub(M.C(1, 0), z)), c = L.c, q = M.abs(M.sub(z, c)) / L.r, inside = q < 1;
      var rows = [[{ tex: 'T' }, fmt.complex(z.re, z.im, 2), 'gold'], [{ tex: 'val' }, fmt.complex(v.re, v.im, 3)],
        narrow ? null : ['discs', String(discs.length)], narrow ? null : ['center c', fmt.complex(c.re, c.im, 2)],
        [narrow ? '|T−c|/|1−c|' : 'ratio |T − c| / |1 − c|', fmt(q, 3), inside ? 'blue' : 'red']];
      if (sums.value) {
        var term = M.div(M.C(1, 0), M.sub(M.C(1, 0), c)), rat = M.div(M.sub(z, c), M.sub(M.C(1, 0), c)), S = M.C(0, 0);
        for (var k = 0; k < 6; k++) { S = M.add(S, term); term = M.mul(term, rat); rows.push(['S' + Kit.fmt.sub(k), fmt.complex(S.re, S.im, 3), inside ? 'fg' : 'red']); }
      }
      fig.panel(rows, { plane: P, at: narrow ? 'sw' : 'nw', id: 'read', hint: inside ? 'T lies in the last disc: its series converges there' : 'T lies outside the last disc: its series diverges there' });
      if (!narrow) fig.legend([{ color: 'blue', fill: true, text: 'disc of a power series' }, { color: 'red', text: 'pole at 1', width: 2.6 }], { plane: P, at: 'se', id: 'lg' });
    };
  }
});
