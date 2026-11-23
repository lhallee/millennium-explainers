/* The true prime count divided by three estimates, on a log axis. Exact from a sieve up to 10^6; at 10^7, 10^8, 10^9
   the counts come from the chapter's table and the curves are joined by straight lines. The shared sieve and then the
   curve table are built in jobs; until they are done the figure draws its axes and the progress. */
Kit.register('prime-ratio', {
  tex: {
    x: 'x', p: '\\pi(x)', r1: '\\pi/(x/\\log x)', r2: '\\pi/\\operatorname{Li}',
    r3: '\\pi/[\\,x/(\\log x-1.08366)\\,]', r3s: '\\pi/\\text{Legendre}'
  },
  init: function (fig) {
    var M = Kit.math, LEG = 1.08366;
    var TABLE = { 7: 664579, 8: 5761455, 9: 50847534 };          // pi(10^k), from the chapter's table
    var SUP = ['', '10', '10²', '10³', '10⁴', '10⁵', '10⁶', '10⁷', '10⁸', '10⁹'];
    var LX = null, Q = null;

    // Curves as arrays over log10 x. Below 2000 every integer gets a vertical jump (two points); above, 600 points
    // per decade; then the three table points.
    function* table() {
      var lx = [], q1 = [], q2 = [], q3 = [];
      function add(l, x, p, li) {
        var L = Math.log(x);
        lx.push(l); q1.push(p * L / x); q2.push(p / li); q3.push(p * (L - LEG) / x);
      }
      for (var n = 10; n <= 2000; n++) {
        var li = M.Li(n), l = Math.log10(n);
        add(l, n, M.pi(n - 1), li); add(l, n, M.pi(n), li);
        if (n % 200 === 0) yield n / 4400;
      }
      for (var l2 = Math.log10(2000), c = 0; l2 < 6; l2 += 1 / 600) {
        var x2 = Math.pow(10, l2); add(l2, x2, M.pi(x2), M.Li(x2));
        if (++c % 200 === 0) yield (2000 + c) / 4400;
      }
      add(6, 1e6, M.pi(1e6), M.Li(1e6));
      for (var k = 7; k <= 9; k++) add(k, Math.pow(10, k), TABLE[k], M.Li(Math.pow(10, k)));
      return { LX: Float64Array.from(lx), Q: [Float64Array.from(q1), Float64Array.from(q2), Float64Array.from(q3)] };
    }
    var tableTask = null;
    var sieve = fig.job(M.sieveTask(1000000), { onDone: function () {
      tableTask = fig.job(table, { onDone: function (r) { LX = r.LX; Q = r.Q; } });
    } });

    var cam = fig.tween(9), zoom = fig.tween(0);
    var End = fig.slider({ label: 'Right end', min: 2, max: 9, step: 1, value: 9,
      format: function (v) { return Kit.fmt.pow10(v); }, onInput: function (v) { cam.to(v, 300); } });
    var showLeg = fig.toggle({ label: 'Show Legendre’s guess', value: false });
    var close = fig.toggle({ label: 'Close-up on 1', value: false, onInput: function (v) { zoom.to(v ? 1 : 0, 400); } });
    fig.onReset = function () { cam.set(End.value); zoom.set(0); };

    var P = fig.plane({ x: [1, 9], y: [0.7, 1.25], pad: { t: 14, r: 16, b: 32, l: 52 } });
    var cur = fig.drag({ plane: P, x: 6, y: 1, r: 6, color: 'fg',
      constrain: function (x) {
        x = Kit.clamp(x, 1, Math.min(9, Math.max(2, P.v.x1)));
        x = x <= 6 ? Math.log10(Math.max(10, Math.round(Math.pow(10, x)))) : Kit.clamp(Math.round(x), 6, 9);
        return [x, 1];
      } });
    var f5 = function (v) { return v.toFixed(5); };

    return function draw() {
      var xr = cam.value, m = zoom.value, b = P.box;
      var yc = Kit.lerp(0.975, 1, m), half = Math.exp(Kit.lerp(Math.log(0.275), Math.log(0.02), m));
      P.view.x1 = xr; P.view.y0 = yc - half; P.view.y1 = yc + half; P.update();
      P.grid({ xStep: 1 });
      P.axes({ x: false });
      fig.line(b.l, b.b + 0.5, b.r, b.b + 0.5, { color: 'muted', width: 1 });
      for (var t = 1; t <= xr + 1e-9; t++) {
        var tx = Math.round(P.X(t)) + 0.5;
        fig.line(tx, b.b - 3, tx, b.b + 3, { color: 'muted', width: 1 });
        fig.text(SUP[t], tx, b.b + 17, { color: 'muted', size: 11.5, align: 'center' });
      }
      P.hline(1, { color: 'muted', width: 1.5 });
      if (!LX) {
        var done = sieve.done ? 0.5 + 0.5 * (tableTask ? tableTask.progress : 0) : 0.5 * sieve.progress;
        fig.text('counting primes: ' + Math.round(100 * done) + '%', b.l + b.w / 2, b.t + b.h / 2 - 12, { color: 'muted', size: 12.5, align: 'center' });
        return;
      }

      // only the part of each curve inside the window is drawn
      var hi = 0, lo = LX.length;
      while (hi < lo) { var mid = (hi + lo) >> 1; if (LX[mid] <= xr) hi = mid + 1; else lo = mid; }
      hi = Math.min(LX.length, hi + 1);
      var xs = LX.subarray(0, hi);
      if (showLeg.value) P.path(xs, Q[2].subarray(0, hi), { color: 'muted', width: 2, dash: [6, 4] });
      P.path(xs, Q[0].subarray(0, hi), { color: 'red', width: 2.2 });
      P.path(xs, Q[1].subarray(0, hi), { color: 'blue', width: 2.2 });
      for (var j = 7; j <= 9 && j <= xr + 1e-9; j++) {
        for (var c = 0; c < 2; c++) P.point(j, Q[c][LX.length - 10 + j], { color: c ? 'blue' : 'red', r: 3.5 });
      }

      // cursor and readout
      cur.x = Math.min(cur.x, End.value); cur.y = 1;
      var near = cur.x > 6.000001 ? Math.pow(10, Math.round(cur.x)) : Math.round(Math.pow(10, cur.x));
      var p = cur.x > 6.000001 ? TABLE[Math.round(cur.x)] : M.pi(near);
      var L = Math.log(near), li2 = M.Li(near), ratio = [p * L / near, p / li2, p * (L - LEG) / near];
      P.segment(cur.x, P.v.y0, cur.x, P.v.y1, { color: 'fg', width: 1, alpha: 0.4, dash: [3, 4] });
      for (var q = 0; q < 3; q++) if (q < 2 || showLeg.value) P.point(cur.x, ratio[q], { color: ['red', 'blue', 'muted'][q], r: 4 });
      var wide = fig.w >= 560, lines = [['x', Kit.fmt(near), null, 'x']];
      if (wide) lines.push(['π(x)', Kit.fmt(p), null, 'p']);
      lines.push(['', f5(ratio[0]), 'red', 'r1'], ['', f5(ratio[1]), 'blue', 'r2']);
      if (showLeg.value) lines.push(['', f5(ratio[2]), 'muted', wide ? 'r3' : 'r3s']);
      var bw = showLeg.value && wide ? 262 : wide ? 216 : 190, rh = wide ? 17 : 15, bh = 12 + rh * lines.length + (wide ? 16 : 0), bx = b.r - bw - 6, by = b.b - bh - 10;
      fig.rect(bx, by, bw, bh, { fill: 'stage', alpha: 0.9 });
      for (var r = 0; r < lines.length; r++) {
        var ry = by + 17 + rh * r, col = lines[r][2];
        if (col) fig.line(bx + 8, ry, bx + 26, ry, { color: col, width: 2.2, dash: col === 'muted' ? [4, 3] : null });
        fig.label(lines[r][3], bx + (col ? 32 : 10), ry, { anchor: 'w', color: col === 'muted' ? 'fg' : (col || 'fg'), size: 13 });
        fig.text(lines[r][1], bx + bw - 10, ry, { color: col === 'muted' ? 'fg' : (col || 'fg'), size: 11.5, mono: true, align: 'right', baseline: 'middle' });
      }
      if (wide) fig.text('drag the dot along y = 1', bx + 10, by + bh - 9, { color: 'muted', size: 10.5 });
    };
  }
});
