/* The sizes of a rational number x = a/b, one per place: a bar of height log|x|_v at infinity (blue) and at each
   prime (gold). The bars always sum to 0, which is the product formula. All sizes are exact fractions of integers:
   a and b are factored by trial division, and |x|_p = p^(-v_p(x)). Primes above 23 that divide x get their own bar;
   every other prime has size 1 and sits in the muted "others" slot. */
Kit.register('rational-sizes', {
  tex: { logv: '\\log\\abs{x}_v', absv: '\\abs{x}_v', prod: '\\abs{x}_\\infty\\prod_p\\abs{x}_p' },
  init: function (fig) {
    var fmt = Kit.fmt, MINUS = fmt.minus, BASE = [2, 3, 5, 7, 11, 13, 17, 19, 23], A0 = -45, B0 = 28;
    function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var r = a % b; a = b; b = r; } return a; }
    function num(n) { return fmt(n, { sep: false }); }
    function frac(n, d) { return d === 1 ? num(n) : num(n) + '/' + num(d); }
    /* Adds sign * (exponent of p in n) to into[p] for every prime p dividing n. */
    function factor(n, sign, into) {
      for (var p = 2; p * p <= n; p++) while (n % p === 0) { n /= p; into[p] = (into[p] || 0) + sign; }
      if (n > 1) into[n] = (into[n] || 0) + sign;
      return into;
    }
    function analyze(a, b) {
      var g = gcd(a, b); a /= g; b /= g;
      var v = factor(b, -1, factor(Math.abs(a), 1, {}));
      var ps = Object.keys(v).map(Number).sort(function (s, t) { return s - t; });
      return { a: a, b: b, v: v, ps: ps, extra: ps.filter(function (p) { return p > 23; }) };
    }
    /* |x|_v as an exact pair [numerator, denominator]; v is 'inf' or a prime. */
    function size(X, v) {
      if (v === 'inf') return [Math.abs(X.a), X.b];
      var e = X.v[v] || 0;
      return e >= 0 ? [1, Math.pow(v, e)] : [Math.pow(v, -e), 1];
    }
    function logSize(X, v) { var s = size(X, v); return Math.log(s[0]) - Math.log(s[1]); }
    /* The product of all sizes, multiplied and reduced one place at a time. */
    function product(X) {
      var n = 1, d = 1;
      ['inf'].concat(X.ps).forEach(function (v) { var s = size(X, v); n *= s[0]; d *= s[1]; var g = gcd(n, d); n /= g; d /= g; });
      return frac(n, d);
    }
    function factorization(X) {
      var parts = X.a < 0 ? [MINUS + '1'] : [];
      X.ps.forEach(function (p) { parts.push(X.v[p] === 1 ? String(p) : p + fmt.sup(X.v[p])); });
      return frac(X.a, X.b) + ' = ' + (parts.length ? parts.join(' · ') : '1');
    }

    var cur = analyze(A0, B0), prev = cur, lastA = A0;
    var grow = fig.tween(1);
    function setX(a, b) { prev = cur; cur = analyze(a, b); grow.set(0); grow.to(1, 250, 'outCubic'); }
    var A = fig.slider({ label: 'Numerator', min: -5000, max: 5000, step: 1, value: A0, format: function (v) { return 'a = ' + num(v); },
      onInput: function (v) { if (v === 0) A.set(lastA > 0 ? -1 : 1); lastA = A.value; setX(A.value, B.value); } });
    var B = fig.slider({ label: 'Denominator', min: 1, max: 5000, step: 1, value: B0, format: function (v) { return 'b = ' + num(v); },
      onInput: function () { setX(A.value, B.value); } });
    [[600, 1, '600'], [7, 12, '7/12'], [-45, 28, MINUS + '45/28'], [1, 1024, '1/1024'], [1024, 729, '1024/729'], [97, 1, '97']].forEach(function (q) {
      fig.button({ label: q[2], onClick: function () { A.set(q[0]); B.set(q[1]); lastA = q[0]; setX(q[0], q[1]); } });
    });
    fig.onReset = function () { lastA = A.value; setX(A.value, B.value); };

    var P = fig.plane({ x: [-0.6, 12], y: [-3, 3], pad: { t: 58, r: 10, b: 26, l: 40 } });
    var H = fig.follow(3, { tau: 0.1 });
    var slots = [];                                              // the places on screen, in order
    fig.probe({ plane: P, crosshair: false,
      snap: function (x) { var i = Math.round(x); return i >= 0 && i < slots.length ? [i, height(slots[i])] : null; },
      rows: function (x) {
        var v = slots[Math.round(x)], s = size(cur, v);
        return [['x', frac(cur.a, cur.b)], ['place', v === 'inf' ? '∞' : String(v)], [{ tex: 'absv' }, frac(s[0], s[1]), v === 'inf' ? 'blue' : 'gold']];
      } });
    function height(v) { return Kit.lerp(logSize(prev, v), logSize(cur, v), grow.value); }

    /* A canvas font the kit has not prepared (kit README, "Performance rules") costs 2 to 15 ms at 4x CPU slowdown the
       first time it is used, and this figure fits its text to the slots, so its first frame met three or more. Such
       text waits: a frame that meets a cold font leaves that text out and queues the font, a job creates the queued
       fonts one per frame on the kit's measuring context, and the next frames draw the text. Widths in a cold font
       are estimated from the 12 px width; once every font is warm, sizes and widths are measured exactly. */
    var warm = {}, cold = [], warming = null, SAMPLE = '0123456789/−·∞ = sum';
    function prepared(size, weight) { return weight === 700 ? size >= 11.5 && size <= 12.5 : size >= 10.5 && size <= 13; }
    function ready(size, weight) {
      var k = size + '|' + weight;
      if (warm[k] || prepared(size, weight)) return true;
      if (!(k in warm)) { warm[k] = false; cold.push([size, weight]); }
      return false;
    }
    function width(str, size, weight) { return ready(size, weight) ? fig.measure(str, size, weight, false) : fig.measure(str, 12, weight, false) * size / 12; }
    function warmUp() {
      if (!cold.length || warming) return;
      warming = fig.job(function* () {
        while (cold.length) { var c = cold.shift(); fig.measure(SAMPLE, c[0], c[1], false); warm[c[0] + '|' + c[1]] = true; yield; }
      }, { onDone: function () { warming = null; } });
    }

    return function draw() {
      var extra = cur.extra.slice();
      if (grow.active) prev.extra.forEach(function (p) { if (extra.indexOf(p) < 0) extra.push(p); });
      extra.sort(function (s, t) { return s - t; });
      slots = ['inf'].concat(BASE, extra);
      var m = slots.length, sumAt = m + 1.4, i, top = 0, total = 0;
      for (i = 0; i < m; i++) top = Math.max(top, Math.abs(logSize(cur, slots[i])));
      var ym = H.to(Math.max(2.2, 1.18 * top)).value;
      P.view.x0 = -0.6; P.view.x1 = sumAt + 0.7; P.view.y0 = -ym; P.view.y1 = ym; P.update();
      var b = P.box, slot = P.X(1) - P.X(0), bw = Math.min(46, 0.64 * slot), y0 = P.Y(0);

      P.axes({ x: false, yAt: 'left', yLabel: 'logv' });
      P.hline(0, { color: 'muted', width: 1 });
      // Sizes snap down to half pixels: every distinct canvas font costs several ms the first time it is used.
      var fit = function (str, max) { return Math.floor(2 * Kit.clamp(max * (slot - 3) / width(str, max, 600), 7.5, max)) / 2; };
      for (i = 0; i <= m; i++) {
        var v = slots[i], px = P.X(i);
        if (i === m) {
          // The "others" slot is marked by three dots drawn as small pixel-aligned rectangles, as the glyph '⋯' renders
          // at this size: the character is outside the page's text fonts and cost about 70 ms of font fallback at 4x
          // CPU slowdown on first use.
          var ds = Kit.clamp((slot - 3) / 12, 0.625, 1), dotY = Math.round(b.b + 12.5 + 4 * (1 - ds));
          for (var k = -1; k <= 1; k++) fig.rect(Math.round(px + 4 * ds * k), dotY, 2 * ds, 1.2 * ds, { fill: 'muted' });
          fig.line(px - bw / 2, y0, px + bw / 2, y0, { color: 'muted', width: 2.5 });
          continue;
        }
        var name = v === 'inf' ? '∞' : String(v), ns = fit(name, v === 'inf' ? 15 : 12);
        if (ready(ns, 600)) fig.text(name, px, b.b + 17, { color: v === 'inf' ? 'blue' : 'gold', size: ns, align: 'center', weight: 600 });
        var h = height(v), yh = P.Y(h);
        total += h;
        if (Math.abs(yh - y0) > 0.5) fig.rect(px - bw / 2, Math.min(y0, yh), bw, Math.abs(yh - y0), { fill: v === 'inf' ? 'blue' : 'gold', alpha: 0.88 });
        else fig.line(px - bw / 2, y0, px + bw / 2, y0, { color: v === 'inf' ? 'blue' : 'gold', width: 2.5 });
        var s = size(cur, v), txt = frac(s[0], s[1]), ts = fit(txt, 11.5);
        if (!grow.active && txt !== '1' && width(txt, ts, 600) < slot - 2 && ready(ts, 600)) {
          fig.text(txt, px, h > 0 ? yh - 6 : yh + ts + 4, { color: v === 'inf' ? 'blue' : 'gold', size: ts, weight: 600, align: 'center' });
        }
      }
      // the sum of all the log-sizes, which is 0 for every x
      var sx = P.X(sumAt);
      fig.line(sx - bw / 2 - 4, y0, sx + bw / 2 + 4, y0, { color: 'red', width: 3 });
      fig.text('sum = ' + (Math.abs(total) < 1e-9 ? '0' : fmt(total, 3)), Math.min(sx, fig.w - 34), y0 - 9, { color: 'red', size: 12, weight: 600, align: 'center' });
      fig.line(P.X(m + 0.7), b.t, P.X(m + 0.7), b.b, { color: 'muted', width: 1, dash: [3, 4], alpha: 0.6 });

      // readout: the factorization of x and the exact product of its sizes
      var line = factorization(cur), fs = 14.5;
      while (fs > 9 && ready(fs, 500) && fig.measure(line, fs, 500, false) > fig.w - 16) fs -= 0.5;
      if (ready(fs, 500)) fig.text(line, 8, 20, { color: 'fg', size: fs });
      if (ready(14, 500)) fig.mathText([{ tex: 'prod' }, ' = ' + product(cur)], 8, 42, { size: 14 });
      warmUp();
    };
  }
});
