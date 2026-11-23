/* S(x), the sum of 1/p over primes p <= x, against log log x + M on a log x axis from 2 to 10^R, with the harmonic
   sum log x + gamma_E for scale; or the difference S(x) - log log x - M inside the band +-1/log x. The primes come from
   a segmented sieve of the odd numbers up to 10^7 (32 K numbers per slice, 5 MB in all instead of the 200 MB the
   shared sieve would take at 10^7), run once as a shared task. It keeps the exact staircase for p <= 10^4 and S at
   1000 log-spaced points per decade above that; S is increasing, so a pixel column spans S at its two edges. */
Kit.register('sum-reciprocal-primes', {
  tex: {
    S: '\\textstyle\\sum_{p\\le x} 1/p', fit: '\\log\\log x+M', H: '\\textstyle\\sum_{n\\le x} 1/n\\approx\\log x+\\gamma_E', x: 'x',
    D: '\\textstyle\\sum_{p\\le x} 1/p-\\log\\log x-M', band: '\\pm 1/\\log x'
  },
  init: function (fig) {
    var fmt = Kit.fmt, MC = 0.2614972128476428, EG = 0.5772156649015329, XS = 1e4, NMAX = 1e7, PER = 1000;
    var fit = function (x) { return Math.log(Math.log(x)) + MC; };
    function* recip() {
      var G = 6 * PER + 1, gx = new Float64Array(G), gs = new Float64Array(G), i;
      for (i = 0; i < G; i++) gx[i] = Math.pow(10, 1 + i / PER);
      var sx = [2], ss = [0.5], S = 0.5, gi = 0, marks = [], need = [1, 2, 3], mi = 0;
      var RT = Math.floor(Math.sqrt(NMAX)) + 1, small = new Uint8Array(RT + 1), base = [];
      for (var a = 3; a <= RT; a += 2) if (!small[a]) { base.push(a); for (var b = a * a; b <= RT; b += 2 * a) small[b] = 1; }
      var SEG = 32768, seg = new Uint8Array(SEG);                // seg[j] stands for the odd number lo + 2j
      for (var lo = 3; lo <= NMAX; lo += 2 * SEG) {
        var hi = Math.min(NMAX, lo + 2 * SEG - 2);
        seg.fill(0);
        for (var k = 0; k < base.length; k++) {
          var p = base[k];
          if (p * p > hi) break;
          var m = Math.max(p * p, Math.ceil(lo / p) * p);
          if (m % 2 === 0) m += p;
          for (var j = (m - lo) >> 1; j < SEG; j += p) seg[j] = 1;
        }
        for (var jj = 0, v = lo; v <= hi; jj++, v += 2) {
          if (seg[jj]) continue;
          while (gi < G && gx[gi] < v) gs[gi++] = S;
          S += 1 / v;
          if (v <= XS) { sx.push(v); ss.push(S); }
          while (mi < need.length && S >= need[mi]) { marks.push([v, S]); mi++; }
        }
        yield hi / NMAX;
      }
      while (gi < G) gs[gi++] = S;
      return { sx: Float64Array.from(sx), ss: Float64Array.from(ss), gx: gx, gs: gs, marks: marks };
    }
    var data = null, reveal = fig.tween(0);
    var task = fig.job(Kit.task('recip-primes:1e7', recip), { onDone: function (r) { data = r; reveal.to(1, 1500, 'inOutSine'); } });

    var Rs = fig.slider({ label: 'Right end', min: 2, max: 7, step: 0.1, value: 7, marks: [2, 3, 4, 5, 6, 7], format: function (v) { return 'x = ' + fmt.sci(Math.pow(10, v)); } });
    var mode = fig.select({ label: 'Show', options: [['sum', 'sum and fit'], ['diff', 'difference']], value: 'sum' });
    var cam = fig.follow(Rs.value, { tau: 0.075 });
    var P = fig.plane({ x: [2, 1e7], y: [0, 4], xLog: true, pad: { t: 14, r: 18, b: 28, l: 50 } });

    var Sx = function (x) {                                       // S(x): exact up to 10^4, else at the grid point below x
      if (x <= XS) { var i = Kit.upperBound(data.sx, x) - 1; return i < 0 ? 0 : data.ss[i]; }
      return data.gs[Math.floor((Math.log10(x) - 1) * PER + 1e-9)];
    };
    var gridIdx = function (x) { return Kit.clamp((Math.log10(x) - 1) * PER, 0, 6 * PER); };
    var snapX = function (x) { return x <= XS ? Math.max(2, Math.floor(x)) : Math.floor(data.gx[Math.round(gridIdx(x))]); };
    fig.probe({ plane: P,
      snap: function (x) { if (!data) return null; var n = snapX(x), s = Sx(n); return [n, mode.value === 'diff' ? s - fit(n) : s]; },
      rows: function (x) {
        var s = Sx(x);
        return [['x', fmt(x)], ['sum of 1/p', fmt(s, 5), 'gold'], ['log log x + M', fmt(fit(x), 5), 'blue'], ['difference', fmt.signed(s - fit(x), 6), 'red']];
      } });

    return function draw() {
      var R = cam.to(Rs.value).value, x1 = Math.pow(10, R), diff = mode.value === 'diff', b = P.box;
      var xr = 2 * Math.pow(x1 / 2, reveal.value);
      P.view.x1 = x1; P.view.y0 = diff ? -0.02 : 0; P.view.y1 = diff ? 0.1 : 4; P.update();
      var dec = [[2, '2']];
      for (var k = 1; k <= Math.floor(R + 1e-9); k++) dec.push([Math.pow(10, k), k === 1 ? '10' : fmt.pow10(k)]);
      P.grid({ xTicks: dec, yStep: diff ? 0.02 : 1 });

      if (!diff) {
        [1, 2, 3].forEach(function (v) { P.hline(v, { color: 'muted', width: 1, dash: [2, 4], alpha: 0.8 }); });
        P.plot(function (x) { return Math.log(x) + EG; }, { color: 'muted', width: 1.8 });
        P.plot(fit, { color: 'blue', width: 2.2 });
      } else {
        P.fillBetween(function (x) { return 1 / Math.log(x); }, function (x) { return -1 / Math.log(x); }, 2, x1, { color: 'red', alpha: 0.08, edges: { color: 'red', width: 1, alpha: 0.55 } });
        P.hline(0, { color: 'muted', width: 1.2 });
      }

      if (data) {
        if (!diff) {
          P.stairs(data.sx, data.ss, { color: 'gold', width: 2.4, to: Math.min(XS, xr) });
          if (xr > XS) P.columns(function (xa, xb, out) {
            if (xb <= XS || xa >= xr) return;
            out[0] = data.gs[Math.floor(gridIdx(Math.max(xa, XS)))]; out[1] = data.gs[Math.ceil(gridIdx(Math.min(xb, xr)))];
          }, { color: 'gold', width: 2.4 });
        } else P.columns(function (xa, xb, out) {
          if (xa >= xr) return;
          xb = Math.min(xb, xr);
          var lo = Infinity, hi = -Infinity, d;
          if (xa < XS) {                                            // exact: D falls between primes and jumps by 1/p at each
            var i = Kit.upperBound(data.sx, xa), s = i ? data.ss[i - 1] : 0, top = Math.min(xb, XS);
            lo = hi = s - fit(xa);
            for (; i < data.sx.length && data.sx[i] <= top; i++) {
              d = s - fit(data.sx[i]); if (d < lo) lo = d;
              s = data.ss[i]; d = s - fit(data.sx[i]); if (d > hi) hi = d;
            }
            d = s - fit(top); if (d < lo) lo = d;
          }
          if (xb > XS) for (var g = Math.floor(gridIdx(Math.max(xa, XS))), g1 = Math.ceil(gridIdx(xb)); g <= g1; g++) {
            d = data.gs[g] - fit(data.gx[g]); if (d < lo) lo = d; if (d > hi) hi = d;
          }
          out[0] = lo; out[1] = hi;
        }, { color: 'gold', width: 2 });
        if (!diff) data.marks.forEach(function (mk) {
          if (mk[0] > Math.min(xr, x1)) return;
          P.point(mk[0], mk[1], { color: 'gold', r: 4.5 });
          var t = 'p = ' + fmt(mk[0]), w = fig.measure(t, 11.5, 600), px = P.X(mk[0]), py = P.Y(mk[1]) - 12;
          var left = px - w - 12 > b.l;                             // up and to the left, where the rising curve is not
          fig.rect(left ? px - w - 10 : px + 4, py - 9, w + 6, 15, { fill: 'stage', alpha: 0.8 });
          fig.text(t, left ? px - 7 : px + 7, py + 2, { color: 'gold', size: 11.5, weight: 600, align: left ? 'right' : 'left' });
        });
      } else {
        fig.text('summing 1/p over the primes up to 10⁷: ' + Math.round(100 * task.progress) + '%', b.l + b.w / 2, b.t + b.h * 0.3, { color: 'muted', size: 12.5, align: 'center' });
      }

      P.axes({ edge: true, xTicks: dec, yStep: diff ? 0.02 : 1, xLabel: 'x', yFormat: diff ? fmt.step(0.02) : null });
      fig.legend(diff ? [{ color: 'gold', tex: 'D', width: 2 }, { color: 'red', tex: 'band', fill: true, alpha: 0.25 }]
        : [{ color: 'gold', tex: 'S', width: 2.4 }, { color: 'blue', tex: 'fit', width: 2.2 }, { color: 'muted', tex: 'H', width: 1.8 }],
        { plane: P, at: diff ? 'ne' : 'se', size: 12.5 });
    };
  }
});
