/* The error E_pi(x) = pi(x) - Li(x) against the scale sqrt(x), raw or divided by sqrt(x). The error is drawn exactly:
   it falls with slope -1/log x between primes and jumps up by 1 at each prime, so its extremes in a pixel column are
   found among the primes in the column. Li is tabulated at the primes once (Simpson's rule on each gap), in a job
   after the shared sieve; until both are done the figure draws its bands and the progress. */
Kit.register('prime-error', {
  tex: { E: 'E_\\pi(x)', En: 'E_\\pi(x)/\\sqrt{x}', sx: '\\sqrt{x}', slx: '\\sqrt{x}/\\log x', sqrtx: '\\sqrt{x}', Er: 'E_\\pi(x)\\log x/\\sqrt{x}' },
  init: function (fig) {
    var M = Kit.math, LIM = 1000000;
    var pr = null, np = 0, LiP = null, liTask = null;
    var inv = function (t) { return 1 / Math.log(t); };
    function simpson(a, b, n) {                                  // integral of 1 / log t on [a, b], n panels
      var h = (b - a) / (2 * n), s = inv(a) + inv(b);
      for (var i = 1; i < 2 * n; i++) s += (i % 2 ? 4 : 2) * inv(a + i * h);
      return s * h / 3;
    }
    function* liTable() {                                        // Li at each prime
      var ps = M.primes(LIM), L = new Float64Array(ps.length);
      for (var k = 1, fa = inv(2); k < ps.length; k++) {
        var a = ps[k - 1], b = ps[k], fb = inv(b);
        L[k] = L[k - 1] + (b < 1000 ? simpson(a, b, 8) : (b - a) / 6 * (fa + 4 * inv((a + b) / 2) + fb));
        fa = fb;
        if ((k & 2047) === 0) yield k / ps.length;
      }
      return { pr: ps, LiP: L };
    }
    var sieve = fig.job(M.sieveTask(LIM), { onDone: function () {
      liTask = fig.job(liTable, { onDone: function (r) { pr = r.pr; np = pr.length; LiP = r.LiP; } });
    } });
    function LiAt(t) {                                           // Li(t), t >= 2: table at the last prime, then a short integral
      var j = M.pi(t) - 1;
      return LiP[j] + (t > pr[j] ? simpson(pr[j], t, t - pr[j] <= 8 ? 4 : 1) : 0);
    }
    // at most two decimals, trailing zeros dropped; Kit.fmt rather than toLocaleString, whose first use builds ICU tables
    var fmt = function (v) { return (v < 0 ? '−' : '') + Kit.fmt(Math.abs(v), 2).replace(/\.?0+$/, ''); };
    var xmaxOf = function (t) { return 100 * Math.pow(10000, t); };
    var frac = 0.6, envKey = '', envLo = new Float64Array(1100), envHi = new Float64Array(1100), envC = 0, envJ = 0, envS = 1;

    var cam = fig.tween(1), mix = fig.tween(0);                  // range shown, and raw (0) to divided by sqrt(x) (1)
    var S = fig.slider({ label: 'Largest x', min: 0, max: 1, step: 0.001, value: 1,
      format: function (t) { return fmt(Math.round(xmaxOf(t))); }, onInput: function (t) { cam.to(t, 300); } });
    fig.toggle({ label: 'Divide by', tex: 'sqrtx', value: false, onInput: function (v) { mix.to(v ? 1 : 0, 400); } });
    fig.onReset = function () { cam.set(S.value); mix.set(0); frac = 0.6; };

    var P = fig.plane({ x: [0, 1000], y: [-1, 1], pad: { t: 14, r: 16, b: 34, l: 58 } });
    var cur = fig.drag({ plane: P, x: 1000, y: 0, r: 6, color: 'fg',
      constrain: function (x) { x = Kit.clamp(Math.round(x), 2, Math.floor(P.v.x1)); return [x, 0]; },
      onDrag: function (x) { frac = x / P.v.x1; } });

    return function draw() {
      var xmax = xmaxOf(cam.value), m = mix.value, ctx = fig.ctx, b = P.box;
      var A = Math.exp(Kit.lerp(Math.log(3 * Math.sqrt(xmax) / Math.log(xmax)), Math.log(1.15), m));
      P.view.x1 = xmax; P.view.y0 = -A; P.view.y1 = A; P.update();
      var wInv = function (x) { return m === 0 ? 1 : Math.pow(x, -m / 2); };      // 1 / sqrt(x)^m
      var bandA = function (x) { return Math.sqrt(x) * wInv(x); };
      var bandB = function (x) { return Math.sqrt(x) / Math.log(x) * wInv(x); };
      var negA = function (x) { return -bandA(x); }, negB = function (x) { return -bandB(x); };

      P.grid({ xStep: M.niceStep(xmax, b.w, 90) });
      P.axes({ x: false, ticks: m === 0 || m === 1, format: fmt });
      var step = M.niceStep(xmax, b.w, 90);
      fig.line(b.l, b.b + 0.5, b.r, b.b + 0.5, { color: 'muted', width: 1 });
      for (var v = step, edge = -1e9; v <= xmax * 1.0001; v += step) {
        var px = Math.round(P.X(v)) + 0.5, name = fmt(v), half = 3.3 * name.length, nx = Math.min(px, fig.w - 4 - half);
        fig.line(px, b.b - 3, px, b.b + 3, { color: 'muted', width: 1 });
        if (nx - half > edge + 6) { fig.text(name, nx, b.b + 17, { color: 'muted', size: 11.5, align: 'center' }); edge = nx + half; }
      }
      P.fillBetween(bandA, negA, 2, xmax, { color: 'muted', alpha: 0.1 });
      P.fillBetween(bandB, negB, 2, xmax, { color: 'muted', alpha: 0.22 });
      P.plot(bandA, { color: 'muted', width: 1, alpha: 0.6, from: 2 }); P.plot(negA, { color: 'muted', width: 1, alpha: 0.6, from: 2 });
      P.plot(bandB, { color: 'muted', width: 1.2, alpha: 0.9, from: 2 }); P.plot(negB, { color: 'muted', width: 1.2, alpha: 0.9, from: 2 });
      P.hline(0, { color: 'muted', width: 1.2 });

      // the error, one vertical stroke per pixel column from its lowest to its highest value; the extremes depend only
      // on the range and the width, so they are kept between frames (a drag, a toggle, or a tween of the mix reuses them).
      // A new range is filled at most about 2.5 ms per frame, left to right, so a slow machine never stalls on it.
      var cols = Math.floor(b.w), key = xmax + '|' + cols;
      if (LiP && key !== envKey) {
        if (cols > envLo.length) { envLo = new Float64Array(cols); envHi = new Float64Array(cols); }
        envKey = key; envC = 0; envJ = 0; envS = 1;              // envS starts at E(2) = pi(2) - Li(2)
      }
      if (LiP && envC < cols) {
        var t0 = performance.now(), j = envJ, s = envS, c = envC;
        for (; c < cols; c++) {
          if ((c & 31) === 31 && performance.now() - t0 > 2.5) break;
          var hiX = xmax * (c + 1) / cols;
          if (hiX <= 2) { envLo[c] = NaN; continue; }
          var lo = s, hi = s;
          while (j < np && pr[j] < hiX) {
            var before = j - LiP[j];
            if (before < lo) lo = before;
            if (before + 1 > hi) hi = before + 1;
            j++;
          }
          var LiB = LiAt(hiX), end = j - LiB;
          envLo[c] = Math.min(lo, end); envHi[c] = Math.max(hi, end);
          s = M.pi(hiX) - LiB;
        }
        envC = c; envJ = j; envS = s;
        if (envC < cols) fig.more();
      }
      if (LiP) {
        fig.stroke({ color: 'red', width: 1.7 });
        ctx.lineCap = 'butt';
        ctx.beginPath();
        for (var c2 = 0; c2 < envC; c2++) {
          if (envLo[c2] !== envLo[c2]) continue;
          var k2 = wInv(xmax * (c2 + 0.5) / cols), yl = P.Y(envLo[c2] * k2), yh = P.Y(envHi[c2] * k2);
          if (yl - yh < 1) { yl += 0.5; yh -= 0.5; }
          ctx.moveTo(b.l + c2 + 0.5, yl); ctx.lineTo(b.l + c2 + 0.5, yh);
        }
        P.clip(function () { ctx.stroke(); });
        ctx.lineCap = 'round';
      }

      // labels: the error, and the two bands wherever they are on screen
      var nearTop = function (f) { var x = xmax * 0.25; while (f(x) > 0.9 * A && x > 4) x *= 0.8; return f(x) > 0.9 * A || x < 0.04 * xmax ? -1 : x; };
      var xa = nearTop(bandA), xb = nearTop(bandB);
      if (xa > 0) P.label('sx', xa, bandA(xa), { anchor: 'sw', color: 'muted', dx: 4, dy: -3 });
      if (xb > 0) P.label('slx', xb, bandB(xb), { anchor: 'sw', color: 'muted', dx: 4, dy: -3 });
      fig.label(m < 0.5 ? 'E' : 'En', b.l + 56, b.b - 10, { anchor: 'sw', color: 'red', id: m < 0.5 ? 'axisE' : 'axisEn' });

      // cursor and readout
      cur.x = Math.max(2, Math.round(frac * xmax));
      if (!LiP) {
        var done = sieve.done ? 0.5 + 0.5 * (liTask ? liTask.progress : 0) : 0.5 * sieve.progress;
        fig.text('counting primes: ' + Math.round(100 * done) + '%', b.l + b.w / 2, b.t + b.h / 2 - 14, { color: 'muted', size: 12.5, align: 'center' });
        cur.y = 0;
        return;
      }
      var E = M.pi(cur.x) - M.Li(cur.x), sq = Math.sqrt(cur.x);
      cur.y = E * wInv(cur.x);
      P.segment(cur.x, P.v.y0, cur.x, P.v.y1, { color: 'fg', width: 1, alpha: 0.4, dash: [3, 4] });
      var wide = fig.w >= 560;
      fig.panel([['x', Kit.fmt(cur.x)], [{ tex: 'E' }, Kit.fmt(E, 2), 'red'], [{ tex: 'En' }, Kit.fmt(E / sq, 3), 'red'],
        wide ? [{ tex: 'Er' }, Kit.fmt(E / sq * Math.log(cur.x), 2), 'red'] : null], { plane: P, at: 'ne', hint: 'drag the dot', id: 'read' });
    };
  }
});
