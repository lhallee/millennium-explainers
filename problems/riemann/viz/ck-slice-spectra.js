/* Where the slices' spectra sit, and why each slice trace vanishes. Left: the z-plane with the strip |Re z| < a, the
   zeros rho - 1/2 on Re z = 0, and for each removed prime p the points z_m = -1/2 + 2 pi i m / log p (columns offset
   to the left of Re z = -1/2 so they can be told apart). Right: phi, the bump on (1.2, Y), against log t with the
   powers p^k marked, and a table of both sides of the slice trace. The eigenvalue side sums M phi(z_m) over
   |m| <= M as one integral of h(u) = phi(e^u) e^{-u/2} against the Dirichlet kernel; M is chosen per prime so that
   the frequency 2 pi M / log p reaches 200 / r, which leaves a tail under 3e-7 (checked against mpmath, which also
   gives 0.0597468 for p = 5, Y = 6 on both sides). The prime-power side is log p sum_k p^{-k/2} phi(p^k). */
Kit.register('ck-slice-spectra', {
  tex: {
    a: 'a', strip: '\\lvert\\Re z\\rvert<a', half: '\\Re z=-\\tfrac12', zr: '\\rho-\\tfrac12', zm: 'z_m', phi: '\\varphi(t)', logt: '\\log t',
    logY: '\\log Y', p: 'p', M: 'M', hS: '\\textstyle\\sum_{\\lvert m\\rvert\\le M}M\\varphi(z_m)', hG: '\\log p\\textstyle\\sum_{k}p^{-k/2}\\varphi(p^k)',
    hSn: '\\textstyle\\sum_{m}', hGn: '\\textstyle\\sum_{k}'
  },
  init: function (fig) {
    var fmt = Kit.fmt, T1 = 1.2, MAXP = 4, START = [5, 7, 11], NQ = 500;
    var bump = function (x) { return Math.abs(x) < 1 ? Math.exp(-1 / (1 - x * x)) : 0; };
    var isPrime = function (n) { for (var d = 2; d * d <= n; d++) if (n % d === 0) return false; return n > 1; };
    var A = fig.slider({ label: 'Strip half-width', tex: 'a', min: 0.05, max: 0.45, step: 0.01, value: 0.2 });
    var Ysl = fig.slider({ label: 'Support (1.2, Y), Y', min: 2, max: 12, step: 0.05, value: 3, marks: [5, 7, 11] });
    var removed = [], fades = [], cache = {};
    for (var q = 0; q < MAXP; q++) fades.push(fig.tween(1));
    function add(p) { fades[removed.length].set(0); fades[removed.length].to(1, 300, 'outCubic'); removed.push(p); }
    function nextPrime() { var n = Math.floor(Ysl.value) + 1; while (!isPrime(n) || removed.indexOf(n) >= 0) n++; return n; }
    var btn = fig.button({ label: 'Remove next prime', onClick: function () { if (removed.length < MAXP) add(nextPrime()); } });
    function start() { removed = START.slice(); fades.forEach(function (f) { f.set(1); }); }
    start();
    fig.onReset = start;

    // both sides of the slice trace at p for the support (1.2, Y); cached by (p, Y)
    function sides(p, Y) {
      var key = p + ':' + Y;
      if (cache[key]) return cache[key];
      var lo = Math.log(T1), hi = Math.log(Y), c = (lo + hi) / 2, r = (hi - lo) / 2, L = Math.log(p);
      var m = Math.ceil(200 / r * L / (2 * Math.PI)), du = 2 * r / NQ, s = 0;
      for (var i = 1; i < NQ; i++) {
        var u = lo + i * du, h = bump((u - c) / r) * Math.exp(-u / 2), d = Math.sin(Math.PI * u / L);
        s += h * (Math.abs(d) < 1e-12 ? 2 * m + 1 : Math.sin((2 * m + 1) * Math.PI * u / L) / d);
      }
      var g = 0;
      for (var k = 1; Math.pow(p, k) < Y; k++) g += Math.pow(p, -k / 2) * bump((k * L - c) / r);
      return (cache[key] = { M: m, spec: s * du, geom: L * g });
    }
    var show = function (v) { return Math.abs(v) < 5e-7 ? '0.000000' : fmt(v, 6); };

    var wide = function (w) { return w >= 560; };
    var Z = fig.plane({ x: [-0.8, 0.8], y: [-30, 30], pad: { t: 32, r: 10, b: 26, l: 34 },
      box: function (w, h) { return [0, 0, wide(w) ? 0.42 * w : 0.44 * w, h]; } });
    var F = fig.plane({ x: [0, 3.5], y: [0, 0.42], pad: { t: 26, r: 14, b: 26, l: 14 },
      box: function (w, h) { var l = (wide(w) ? 0.42 : 0.44) * w + 6; return [l, 0, w, wide(w) ? 0.56 * h : 0.52 * h]; } });

    return function draw() {
      var a = A.value, Y = Ysl.value, zb = Z.box, nar = !wide(fig.w), i, k;
      btn.enable(removed.length < MAXP);
      // the z-plane: strip, critical line, zeros, and one column of slice eigenvalue points per removed prime
      // the strip |Re z| < a as in chapter 14: blue, dashed edges; violet is the critical line alone
      Z.fillBetween(30, -30, -a, a, { color: 'blue', alpha: 0.16 });
      Z.vline(-a, { color: 'blue', width: 1.4, dash: [5, 4] }); Z.vline(a, { color: 'blue', width: 1.4, dash: [5, 4] });
      Z.grid({ xStep: 0.5, yStep: 10 });
      Z.vline(-0.5, { color: 'muted', width: 1, dash: [3, 4] });
      Z.vline(0, { color: 'stage', width: 5, alpha: 0.6 });
      Z.vline(0, { color: 'violet', width: 2 });
      Z.axes({ edge: true, xTicks: [[-0.5, '−½'], [0, '0'], [0.5, '½']], yStep: 10 });
      Z.zeros({ count: 10, sigma: 0, r: 4 });
      // columns step left from Re z = -1/2 by 0.03 (at least 7 px); their labels alternate between two rows
      var gap = Math.max(0.03, 7 / Z.sx);
      for (i = 0; i < removed.length; i++) {
        var p = removed[i], x = -0.5 - gap * i, step = 2 * Math.PI / Math.log(p), al = fades[i].value;
        var bad = sides(p, Y).geom > 5e-7;
        for (var m = -Math.floor(30 / step); m <= Math.floor(30 / step); m++) Z.point(x, m * step, { color: bad ? 'red' : 'gold', r: 2.6, alpha: al, ringWidth: 0.8 });
        fig.text(String(p), Z.X(x), zb.t - 5 - 12 * (i % 2), { color: bad ? 'red' : 'gold', size: 10.5, align: 'center', alpha: al });
      }
      var items = [{ color: 'teal', dot: true, tex: 'zr' }, { color: 'gold', dot: true, tex: 'zm' }, { color: 'blue', fill: true, tex: 'strip', alpha: 0.25 }];
      Z.label('half', -0.5, -30, { anchor: 'sw', color: 'muted', dx: 3, dy: -4, size: nar ? 11 : 12.5 });

      // phi against log t, the support shaded, and the powers p^k as ticks (red where they land in the support)
      var lo = Math.log(T1), hi = Math.log(Y), c = (lo + hi) / 2, r = (hi - lo) / 2, fb = F.box;
      F.fillBetween(0.42, 0, lo, hi, { color: 'muted', alpha: 0.12 });
      F.grid({ xStep: 0.5, yStep: 0.1 });
      F.axes({ xAt: 'bottom', y: false, xStep: 0.5, xLabel: 'logt' });
      F.vline(hi, { color: 'muted', width: 1, dash: [4, 4] });
      F.label('logY', hi, 0.06, { anchor: 'w', color: 'muted', dx: 4, size: 11.5 });
      F.plot(function (u) { return bump((u - c) / r); }, { color: 'gold', width: 2.2 });
      var ticks = [];
      for (i = 0; i < removed.length; i++) for (k = 1; Math.pow(removed[i], k) < Math.exp(3.5); k++) ticks.push([k * Math.log(removed[i]), Math.pow(removed[i], k), i]);
      ticks.sort(function (x, y) { return x[0] - y[0]; });
      var reach = [-1e9, -1e9];
      for (k = 0; k < ticks.length; k++) {
        var u = ticks[k][0], inside = u > lo && u < hi, tx = F.X(u), al = fades[ticks[k][2]].value, rw = tx - 9 > reach[0] ? 0 : tx - 9 > reach[1] ? 1 : 0;
        F.segment(u, 0, u, 0.34, { color: inside ? 'red' : 'gold', width: inside ? 2 : 1.4, alpha: al });
        if (inside) F.point(u, bump((u - c) / r), { color: 'red', r: 4 });
        fig.text(String(ticks[k][1]), tx, F.Y(0.34) - 4 - 11 * rw, { color: inside ? 'red' : 'gold', size: 10.5, align: 'center', alpha: al });
        reach[rw] = tx + 9;
      }
      // name phi on its left flank, or on its right flank when the left one is too close to the edge (on a phone the
      // legend names it)
      var left = F.X(c - 0.6 * r) - fig.labelSize('phi', 12.5).w - 8 > fb.l;
      if (!nar) F.label('phi', c + (left ? -0.6 : 0.6) * r, bump(0.6), { anchor: left ? 'e' : 'w', color: 'gold', dx: left ? -6 : 6, size: 12.5 });

      // the table: one row per removed prime, the eigenvalue side and the prime-power side
      // columns by their right edges: p, M (wide only), the eigenvalue side, the prime-power side
      var size = nar ? 10.5 : 11.5, ts = size + 1.5, rh = nar ? 14 : 18, x0 = fb.l + 4, y = fb.b + (nar ? 34 : 38);
      // the last column ends on the plane's right edge, so nothing leaves the stage
      var xM = x0 + 64, xG = fb.r - 4, xS = nar ? x0 + 96 : Math.min(xM + 190, xG - fig.labelSize('hG', ts).w - 16), tn = nar;
      if (!tn && xS - fig.labelSize('hS', ts).w < xM + 8) { tn = true; xS = x0 + 96; }   // too narrow for the full headers
      var cell = function (str, x, yy, color, alpha) { fig.text(str, x, yy, { size: size, mono: true, align: 'right', baseline: 'middle', color: color, alpha: alpha }); };
      fig.label('p', x0, y, { anchor: 'w', color: 'muted', size: ts });
      if (!tn) fig.label('M', xM, y, { anchor: 'e', color: 'muted', size: ts });
      fig.label(tn ? 'hSn' : 'hS', xS, y, { anchor: 'e', color: 'muted', size: ts });
      fig.label(tn ? 'hGn' : 'hG', xG, y, { anchor: 'e', color: 'muted', size: ts });
      fig.line(x0, y + 13, xG, y + 13, { color: 'muted', width: 1, alpha: 0.5 });
      for (i = 0; i < removed.length; i++) {
        var sd = sides(removed[i], Y), yy = y + 13 + rh * (i + 0.6), col = sd.geom > 5e-7 ? 'red' : 'fg', al = fades[i].value;
        fig.text(String(removed[i]), x0, yy, { size: size, mono: true, baseline: 'middle', color: 'gold', alpha: al });
        if (!tn) cell(String(sd.M), xM, yy, 'muted', al);
        cell(show(sd.spec), xS, yy, col, al);
        cell(show(sd.geom), xG, yy, col, al);
      }
      if (nar) fig.legend(items.concat([{ color: 'gold', tex: 'phi' }]), { plane: F, x: x0 - 6, y: y + 15 + rh * MAXP, dir: 'row', size: 10.5, bg: false });
      else fig.legend(items, { plane: Z, at: 'ne', size: 12.5 });
    };
  }
});
