/* f = g ⊗ (product of the indicators of Z_p) restricted to Q: every rational in [-4, 4] with denominator at most 12
   is a stick of height g(x) = exp(-pi x^2 / 4). Turning on the indicator at p drops every stick whose reduced
   denominator is divisible by p; with all of them on only the integers remain, and the sum of their heights is
   sum over n of g(n). Swapping 1_{Z_p} for 1_{Z_p^x} then also drops the integers divisible by p (red). */
Kit.register('adelic-filter', {
  tex: { g: 'g(x)=e^{-\\pi x^2/4}', i2: '\\mathbf 1_{\\ZZ_2}', i3: '\\mathbf 1_{\\ZZ_3}', i5: '\\mathbf 1_{\\ZZ_5}', i7: '\\mathbf 1_{\\ZZ_7}',
    i11: '\\mathbf 1_{\\ZZ_{11}}', sumZ: '\\textstyle\\sum_{n\\in\\ZZ}g(n)', sumU: '\\textstyle\\sum_{n\\in\\ZZ,\\ p\\,\\nmid\\, n}g(n)' },
  init: function (fig) {
    var fmt = Kit.fmt, PR = [2, 3, 5, 7, 11], DEL = [2, 3, 5], QMAX = 12, XMAX = 4;
    function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var r = a % b; a = b; b = r; } return a; }
    function g(x) { return Math.exp(-Math.PI * x * x / 4); }

    // every reduced fraction n/q in [-4, 4] with q <= 12
    var nums = [], dens = [];
    for (var q = 1; q <= QMAX; q++) for (var n = -XMAX * q; n <= XMAX * q; n++) if (gcd(n, q) === 1) { nums.push(n); dens.push(q); }
    var N = nums.length, xs = new Float64Array(N), gx = new Float64Array(N), f = new Float32Array(N), tgt = new Float32Array(N), why = new Uint8Array(N);
    for (var i = 0; i < N; i++) { xs[i] = nums[i] / dens[i]; gx[i] = g(xs[i]); f[i] = 1; tgt[i] = 1; }
    var theta = 0, left = N, hold = 0;

    var chips = PR.map(function (p) { return fig.toggle({ tex: 'i' + p, value: true, onInput: sync }); });
    var all = fig.toggle({ label: 'All primes', value: true, onInput: function (v) { chips.forEach(function (c) { c.set(v); }); sync(); } });
    var dels = DEL.map(function (p) { return fig.toggle({ label: 'Delete multiples of ' + p, value: false, onInput: retarget }); });
    /* The default state has every indicator on; the figure opens with all sticks up and drops them after a pause. */
    function intro() { f.fill(1); hold = Kit.reducedMotion ? 0 : 1; sync(); }
    fig.onReset = intro;
    /* Keeps "all primes" in step with the chips, and the deletions off unless every chip is on. */
    function sync() {
      all.set(chips.every(function (c) { return c.value; }));
      if (!all.value) dels.forEach(function (d) { d.set(false); });
      retarget();
    }
    function retarget() {
      var on = PR.filter(function (p, k) { return chips[k].value; }), del = DEL.filter(function (p, k) { return dels[k].value; });
      left = 0;
      for (var i = 0; i < N; i++) {
        var byDen = on.some(function (p) { return dens[i] % p === 0; }), byDel = dens[i] === 1 && del.some(function (p) { return nums[i] % p === 0; });
        why[i] = byDel ? 2 : byDen ? 1 : 0; tgt[i] = why[i] ? 0 : 1; left += tgt[i];
      }
      theta = 0;                                                 // sum over all integers, |n| <= 40 is exact to 1e-300
      for (var n = -40; n <= 40; n++) if (!del.some(function (p) { return n % p === 0; })) theta += g(n);
      key = '';
      fig.redraw();
    }

    function narrow() { return fig.w < 560; }
    var P = fig.plane({ x: [-4.3, 4.3], y: [0, 1.12], pad: { t: 14, r: 16, b: 28, l: 40 },
      box: function (w, h) { return [0, narrow() ? 46 : 0, w, h]; } });
    var paths = null, dots = null, key = '', sum = 0;
    intro();

    return function draw() {
      var ctx = fig.ctx, b = P.box, y0 = P.Y(0), step = Kit.reducedMotion ? 1 : fig.dt / 0.3, moving = false, i;
      P.grid({ xStep: 1, yStep: 0.5 });
      P.axes({ edge: true, xStep: 1, yTicks: [0, 0.5, 1] });
      P.plot(g, { color: 'blue', width: 2, alpha: 0.9 });
      P.label('g', 1.55, g(1.55), { anchor: 'sw', color: 'blue', dx: 6, dy: -2, size: 13.5 });

      // sticks, grouped by look: gold, gold integers (thick), muted (filtered out), red (deleted integers);
      // the paths are rebuilt only while sticks move or when the plot changes size
      if (hold > 0) { hold -= fig.dt; fig.more(); }
      else for (i = 0; i < N; i++) if (f[i] !== tgt[i]) { f[i] = tgt[i] > f[i] ? Math.min(tgt[i], f[i] + step) : Math.max(tgt[i], f[i] - step); moving = true; }
      var now = b.l + ',' + b.b + ',' + b.w + ',' + b.h;
      if (moving || now !== key) build(y0);
      key = moving ? '' : now;
      if (moving) fig.more();
      var looks = [['gold', 1, 0.75], ['gold', 3, 1], ['muted', 1, 0.6], ['red', 3, 1]];
      P.clip(function () {
        for (var k = 0; k < 4; k++) { fig.stroke({ color: looks[k][0], width: looks[k][1], alpha: looks[k][2] }); ctx.stroke(paths[k]); }
        ctx.fillStyle = fig.color('red'); ctx.fill(dots);
      });

      var del = DEL.filter(function (p, k) { return dels[k].value; });
      dels.forEach(function (d) { d.enable(all.value); });
      var nar = narrow();
      fig.panel([
        nar ? null : ['rationals left', fmt(left)],
        [nar ? 'sum over remaining' : 'sum over the remaining rationals', fmt(sum, 7), 'gold'],
        all.value ? [{ tex: del.length ? 'sumU' : 'sumZ' }, fmt(theta, 7), 'blue'] : null,
        all.value && del.length && !nar ? ['for p in', del.join(', ')] : null
      ], nar ? { plane: P, x: 6, y: 2, id: 'sums' } : { plane: P, at: 'ne', id: 'sums' });
    };

    function build(y0) {
      paths = [new Path2D(), new Path2D(), new Path2D(), new Path2D()]; dots = new Path2D(); sum = 0;
      for (var i = 0; i < N; i++) {
        var e = f[i] * f[i] * (3 - 2 * f[i]), px = P.X(xs[i]), grp = tgt[i] ? (dens[i] === 1 ? 1 : 0) : why[i] === 2 ? 3 : 2;
        sum += gx[i] * e;
        if (e > 0) { paths[grp].moveTo(px, y0); paths[grp].lineTo(px, P.Y(gx[i] * e)); }
        else if (why[i] === 2) { dots.moveTo(px + 3, y0); dots.arc(px, y0, 3, 0, 2 * Math.PI); }
        else { paths[2].moveTo(px, y0); paths[2].lineTo(px, y0 - 3); }
      }
    }
  }
});
