/* The error of the prime count in units of sqrt(x), on a log x axis up to 10^6: (psi(x) - x) / sqrt(x) in gold, the
   optional M(x) / sqrt(x) in teal, a seeded fair coin walk S_N / sqrt(N) in ink, the guides +-1, and Schoenfeld's
   envelope +-log^2(x) / (8 pi) (proved for x >= 74, so drawn from there). Every series is drawn exactly, one stroke
   per pixel column from its lowest to its highest value there: each series keeps its minima and maxima per block of
   16 and of 256 integers, so a column costs a few block lookups. (psi(x) - x) / sqrt(x) falls between prime powers
   and jumps up at each, so a column's maximum is at a jump and its minimum just before one. The coin walk appears on
   request (the first one grows at two decades per second) and Reset removes it. */
Kit.register('error-band', {
  tex: { E: '(\\psi(x)-x)/\\sqrt{x}', M: 'M(x)/\\sqrt{x}', env: '\\pm\\log^2 x/(8\\pi)', x: 'x',
    pe: '\\psi(x)-x', pl: '\\pi(x)-\\Li(x)', Mx: 'M(x)' },
  init: function (fig) {
    var M = Kit.math, fmt = Kit.fmt, LIM = 1000000, NB = Math.ceil((LIM + 1) / 16), NC = Math.ceil((LIM + 1) / 256);
    var Mint = null, Sw = new Int16Array(LIM + 1);              // the Mertens function M(n), and the coin walk S_n
    // A series: its value at the integer n (hi), the value just before n where it jumps (lo), and the extremes of
    // each block of 16 integers (f) and of 256 (c).
    function series(hi, lo) {
      return { hi: hi, lo: lo || hi, fmin: new Float32Array(NB), fmax: new Float32Array(NB), cmin: new Float32Array(NC), cmax: new Float32Array(NC),
        key: '', cLo: new Float32Array(0), cHi: new Float32Array(0) };
    }
    var E = series(function (n) { return (M.psi(n) - n) / Math.sqrt(n); }, function (n) { return (M.psi(n - 1) - n) / Math.sqrt(n); });
    var Mu = series(function (n) { return Mint[n] / Math.sqrt(n); });
    var W = series(function (n) { return Sw[n] / Math.sqrt(n); });
    function block(s, k) {                                   // fine block k, and its coarse block once that is complete
      var lo = Infinity, hi = -Infinity, end = Math.min(LIM + 1, 16 * k + 16), i;
      for (i = Math.max(2, 16 * k); i < end; i++) { var h = s.hi(i), l = s.lo(i); if (h > hi) hi = h; if (l < lo) lo = l; }
      s.fmin[k] = lo; s.fmax[k] = hi;
      if ((k & 15) !== 15 && k !== NB - 1) return;
      lo = Infinity; hi = -Infinity;
      for (i = k & ~15; i <= k; i++) { if (s.fmax[i] > hi) hi = s.fmax[i]; if (s.fmin[i] < lo) lo = s.fmin[i]; }
      s.cmin[k >> 4] = lo; s.cmax[k >> 4] = hi;
    }
    function range(s, a, b, out) {                           // extremes over the integers a..b, folded into out
      var i = a, h, l, k;
      for (; i <= b && i & 15; i++) { h = s.hi(i); l = s.lo(i); if (h > out[1]) out[1] = h; if (l < out[0]) out[0] = l; }
      for (; i + 15 <= b && i & 255; i += 16) { k = i >> 4; if (s.fmax[k] > out[1]) out[1] = s.fmax[k]; if (s.fmin[k] < out[0]) out[0] = s.fmin[k]; }
      for (; i + 255 <= b; i += 256) { k = i >> 8; if (s.cmax[k] > out[1]) out[1] = s.cmax[k]; if (s.cmin[k] < out[0]) out[0] = s.cmin[k]; }
      for (; i + 15 <= b; i += 16) { k = i >> 4; if (s.fmax[k] > out[1]) out[1] = s.fmax[k]; if (s.fmin[k] < out[0]) out[0] = s.fmin[k]; }
      for (; i <= b; i++) { h = s.hi(i); l = s.lo(i); if (h > out[1]) out[1] = h; if (l < out[0]) out[0] = l; }
    }

    // Tables, one job after another so that a frame carries one slice at a time, each slice well under a millisecond:
    // psi from the shared sieve, then the kit's shared Mertens table; the coin walk needs neither.
    var eReady = false, mReady = false, eProg = 0, seed = 1, token = 0, built = 0;
    var sieve = fig.job(M.sieveTask(LIM), { onDone: function () {
      fig.job(function* () {
        for (var k = 0; k < NB; k++) { block(E, k); if ((k & 255) === 255) { eProg = k / NB; yield; } }
        eReady = true;
      }, { onDone: function () {
        fig.job(M.mertensTask(LIM), { onDone: function (res) {
          Mint = res.M;
          fig.job(function* () { for (var k = 0; k < NB; k++) { block(Mu, k); if ((k & 255) === 255) yield; } mReady = true; });
        } });
      } });
    } });
    function newWalk() {
      var my = ++token, st = (seed++ * 2654435761) >>> 0;
      built = 0; W.key = '';
      fig.job(function* () {                                  // mulberry32, one fair +-1 per step
        for (var n = 1, S = 0; n <= LIM; n++) {
          if (my !== token) return;
          st = (st + 0x6D2B79F5) >>> 0;
          var t = Math.imul(st ^ (st >>> 15), 1 | st);
          t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
          Sw[n] = S += ((t ^ (t >>> 14)) >>> 0) & 1 ? 1 : -1;
          if ((n & 15) === 15) { block(W, n >> 4); built = n; if ((n & 4095) === 4095) yield; }
        }
        block(W, NB - 1); built = LIM;
      });
      if (grow.value === 0) grow.to(6, 3000, 'linear');         // the first walk grows at two decades per second
    }

    var from = fig.slider({ label: 'From x', min: 10, max: 1e5, scale: 'log', value: 10, snap: [10, 100, 1e3, 1e4, 1e5],
      onInput: function (v) { if (to.value < 10 * v) to.set(10 * v); } });
    var to = fig.slider({ label: 'To x', min: 100, max: LIM, scale: 'log', value: LIM, snap: [100, 1e3, 1e4, 1e5, 1e6],
      onInput: function (v) { if (from.value > v / 10) from.set(v / 10); } });
    var showM = fig.toggle({ label: 'Show M(x)/√x', value: false });
    var grow = fig.tween(0);
    fig.button({ label: 'New coin walk', onClick: newWalk });
    var c0 = fig.follow(1), c1 = fig.follow(6);
    fig.onReset = function () { c0.set(1); c1.set(6); token++; built = 0; grow.set(0); };   // Reset also removes the walk

    var P = fig.plane({ x: [10, LIM], y: [-3, 3], xLog: true, pad: { t: 10, r: 16, b: 26, l: 40 } });
    fig.probe({ plane: P, snap: function (x) { var n = Math.round(x); return eReady && n >= 2 ? [n, E.hi(n)] : null; },
      rows: function (x) {
        var n = Math.round(x);
        if (!eReady) return [[{ tex: 'x' }, fmt(n)]];
        return [[{ tex: 'x' }, fmt(n)], [{ tex: 'pe' }, fmt.signed(M.psi(n) - n, 2), 'gold'],
          [{ tex: 'pl' }, fmt.signed(M.pi(n) - M.Li(n), 2), 'gold'], mReady ? [{ tex: 'Mx' }, fmt(Mint[n]), 'teal'] : null];
      } });

    /* Column extremes up to x = limit, cached; when only the limit grew (the walk being drawn), only the columns from
       the old limit on are computed again. Then one stroke per column. */
    function columns(s, base, limit, style) {
      var cols = Math.floor(P.box.w), key = base + '|' + limit, c = 0;
      if (s.key !== key) {
        if (s.cLo.length < cols) { s.cLo = new Float32Array(cols); s.cHi = new Float32Array(cols); s.base = ''; }
        if (s.base === base && limit >= s.lim) c = Kit.clamp(Math.floor(P.X(s.lim) - P.box.l), 0, cols);
        var out = [0, 0], xa = P.wx(c);
        for (; c < cols; c++) {
          var xb = Math.min(P.wx(c + 1), limit);
          if (xa >= limit) { s.cLo[c] = NaN; xa = xb; continue; }
          // between integers a series is monotone, so the extremes are at the column's ends or its integers
          var na = Math.floor(xa), nb = Math.floor(xb), ya = s === E ? (M.psi(na) - xa) / Math.sqrt(xa) : s.hi(na);
          var yb = s === E ? (M.psi(nb) - xb) / Math.sqrt(xb) : s.hi(nb);
          out[0] = Math.min(ya, yb); out[1] = Math.max(ya, yb);
          if (nb > na) range(s, na + 1, nb, out);
          s.cLo[c] = out[0]; s.cHi[c] = out[1]; xa = xb;
        }
        s.key = key; s.base = base; s.lim = limit;
      }
      P.columns(function (xa, xb, o, c) { if (s.cLo[c] === s.cLo[c]) { o[0] = s.cLo[c]; o[1] = s.cHi[c]; } }, style);
    }
    var env = function (x) { var l = Math.log(x); return l * l / (8 * Math.PI); };

    return function draw() {
      var u0 = c0.to(Math.log10(from.value)).value, u1 = c1.to(Math.log10(to.value)).value;
      P.view.x0 = Math.pow(10, u0); P.view.x1 = Math.pow(10, Math.max(u1, u0 + 0.5)); P.update();
      var b = P.box, key = P.v.x0.toPrecision(9) + '|' + P.v.x1.toPrecision(9) + '|' + Math.floor(b.w), narrow = fig.w < 520;
      P.grid({ yStep: 1 });
      P.axes({ edge: true, yStep: 1, xLabel: 'x' });
      P.hline(0, { color: 'muted', width: 1 });
      [1, -1].forEach(function (s) {
        P.hline(s, { color: 'muted', width: 1.2, dash: [6, 5], alpha: 0.9 });
        P.plot(function (x) { return s * env(x); }, { color: 'red', width: 1.6, dash: [7, 5], from: 74 });
      });
      var reach = Math.floor(Math.min(Math.pow(10, grow.value), built));
      if (reach >= 2) columns(W, key + '|' + token, reach + 0.999, { color: 'fg', width: 1.3, alpha: 0.45 });
      if (showM.value && mReady) columns(Mu, key, LIM, { color: 'teal', width: 1.4, alpha: 0.85 });
      if (eReady) columns(E, key, LIM, { color: 'gold', width: 1.7 });
      else fig.text('counting primes: ' + Math.round(100 * (sieve.done ? 0.7 + 0.3 * eProg : 0.7 * sieve.progress)) + '%', b.r - 8, b.t + 14, { color: 'muted', align: 'right', size: 12 });
      if (showM.value && !mReady && eReady) fig.text('computing μ(n)…', b.r - 8, b.t + 14, { color: 'muted', align: 'right', size: 12 });
      fig.legend([{ color: 'gold', tex: 'E' }, showM.value && { color: 'teal', tex: 'M' }, reach >= 2 && { color: 'fg', alpha: 0.6, text: 'fair coin walk' },
        { color: 'red', dash: [7, 5], width: 1.6, tex: 'env' }],
        { plane: P, dir: narrow ? 'row' : 'col', size: narrow ? 11.5 : 13, prefer: ['nw', 'sw', 'ne', 'se'] });
    };
  }
});
