/* The product formula of Z[i] as "zeros equal poles" (eq-ml-pf with [F:Q] = 2). Left: the Gaussian integers, the
   current x = a + bi in gold, and the circle of radius |x|. Right: two bars in units of log. "Primes" stacks one gold
   block of height log N(w) for each prime factor w of x, counted with multiplicity v_w(x), the way the budget bar of
   multiplicity-budget stacks one block per zero; "size" stacks log |sigma(x)| for the two embeddings, in blue.
   x is factored exactly: N(x) = a^2 + b^2 is factored over Z, p = 2 gives (1 + i), p = 3 mod 4 gives (p) with
   N = p^2, and a split p = pi conj(pi) is assigned by dividing x by pi in Z[i]. The buttons multiply x by a prime
   and add one to its exponent, so the factorization stays exact without factoring large norms. */
Kit.register('ml-product-budget', {
  tex: { pf: '\\textstyle\\sum_w v_w(x)\\log N(w) \\;=\\; \\sum_{\\sigma} \\log\\abs{\\sigma(x)}',
    s1: '\\log\\abs{\\sigma(x)}', s2: '\\log\\abs{\\bar\\sigma(x)}' },
  init: function (fig) {
    var fmt = Kit.fmt, MINUS = fmt.minus, R0 = 12, CAP = 1e6, DRAG_MAX = 2000, SHADES = [0.95, 0.6, 0.8, 0.48, 0.7];
    var PR = {};                                                    // canonical Gaussian primes by key
    function num(n) { return fmt(n); }
    function gname(a, b) {
      if (b === 0) return num(a);
      var bi = (Math.abs(b) === 1 ? '' : num(Math.abs(b))) + 'i';
      if (a === 0) return (b < 0 ? MINUS : '') + bi;
      return num(a) + (b > 0 ? ' + ' : ' ' + MINUS + ' ') + bi;
    }
    function prime(c, d) {
      var key = c + ',' + d;
      return PR[key] || (PR[key] = { key: key, c: c, d: d, norm: c * c + d * d, name: '(' + gname(c, d) + ')' });
    }
    function mulG(x, y) { return [x[0] * y[0] - x[1] * y[1], x[0] * y[1] + x[1] * y[0]]; }
    function divG(x, y) {                                           // x / y in Z[i], or null when y does not divide x
      var n = y[0] * y[0] + y[1] * y[1], re = x[0] * y[0] + x[1] * y[1], im = x[1] * y[0] - x[0] * y[1];
      return re % n || im % n ? null : [re / n, im / n];
    }
    function split(p) { for (var d = 1; 2 * d * d < p; d++) { var c = Math.round(Math.sqrt(p - d * d)); if (c * c + d * d === p) return [c, d]; } throw new Error('ml-product-budget: ' + p + ' does not split'); }
    /* The factorization of a + bi: { exp: { key: v_w }, unit: [re, im] } with a + bi = unit * prod w^v_w. */
    function factor(a, b) {
      var n = a * a + b * b, exp = {}, x = [a, b];
      function put(pr, e) { if (e > 0) exp[pr.key] = (exp[pr.key] || 0) + e; }
      function add(p, e) {
        if (p === 2) put(prime(1, 1), e);
        else if (p % 4 === 3) put(prime(p, 0), e / 2);
        else {
          var pi = split(p), k = 0, y = x, q;
          while (k < e && (q = divG(y, pi))) { y = q; k++; }
          put(prime(pi[0], pi[1]), k); put(prime(pi[0], -pi[1]), e - k);
        }
      }
      for (var p = 2; p * p <= n; p++) { if (n % p) continue; var e = 0; while (n % p === 0) { n /= p; e++; } add(p, e); }
      if (n > 1) add(n, 1);
      var prod = [1, 0];
      for (var k in exp) for (var j = 0; j < exp[k]; j++) prod = mulG(prod, [PR[k].c, PR[k].d]);
      return { exp: exp, unit: divG([a, b], prod) };
    }
    function total(exp) { var s = 0; for (var k in exp) s += exp[k] * Math.log(PR[k].norm); return s; }
    function factorText(st) {
      var keys = order(st.exp), u = st.unit, parts = keys.map(function (k) { return PR[k].name + (st.exp[k] > 1 ? fmt.sup(st.exp[k]) : ''); });
      var lead = u[0] === 1 ? '' : u[0] === -1 ? MINUS : u[1] === 1 ? 'i' : MINUS + 'i';
      return gname(st.x[0], st.x[1]) + ' = ' + (parts.length ? lead + (lead && lead !== MINUS ? '·' : '') + parts.join('') : gname(u[0], u[1]));
    }
    function order(exp) { return Object.keys(exp).sort(function (s, t) { return PR[s].norm - PR[t].norm || PR[t].d - PR[s].d; }); }

    // Self-checks: the chapter's two values, and the product formula and unit at every point of the base window.
    var c34 = factor(3, 4), c11 = factor(1, 1);
    if (Object.keys(c34.exp).join() !== '2,1' || c34.exp['2,1'] !== 2 || Math.abs(total(c34.exp) - 3.2189) > 1e-4) console.error('ml-product-budget: 3 + 4i is not (2 + i)^2 with height 2 log 5');
    if (Object.keys(c11.exp).join() !== '1,1' || Math.abs(total(c11.exp) - Math.log(2)) > 1e-12) console.error('ml-product-budget: 1 + i is not (1 + i) with height log 2');
    fig.job(function* () {
      for (var a0 = -R0; a0 <= R0; a0++) {
        for (var b0 = -R0; b0 <= R0; b0++) {
          if (!a0 && !b0) continue;
          var f0 = factor(a0, b0);
          if (!f0.unit || Math.abs(f0.unit[0]) + Math.abs(f0.unit[1]) !== 1 || Math.abs(total(f0.exp) - Math.log(a0 * a0 + b0 * b0)) > 1e-9) console.error('ml-product-budget: factorization of ' + a0 + ' + ' + b0 + 'i fails');
        }
        yield (a0 + R0) / (2 * R0);
      }
    });

    var cur = { x: [3, 4] }, prev, grow = fig.tween(1), dragging = false;
    function setX(a, b) { var f = factor(a, b); prev = cur; cur = { x: [a, b], exp: f.exp, unit: f.unit }; grow.set(0); grow.to(1, 300, 'inOutCubic'); }
    function multiply(pr) {
      var e = Object.assign({}, cur.exp); e[pr.key] = (e[pr.key] || 0) + 1;
      prev = cur; cur = { x: mulG(cur.x, [pr.c, pr.d]), exp: e, unit: cur.unit }; grow.set(0); grow.to(1, 300, 'inOutCubic');
    }
    var f34 = factor(3, 4); cur.exp = f34.exp; cur.unit = f34.unit; prev = cur;
    var GEN = [prime(1, 1), prime(2, 1), prime(3, 0)];
    var btns = GEN.map(function (pr) { return fig.button({ label: 'Multiply by ' + gname(pr.c, pr.d), onClick: function () { multiply(pr); } }); });
    fig.onReset = function () { setX(3, 4); };

    var TOP = 28;
    // the bars on the right need about 412 px on a wide stage: their axis, the prime labels, two bars and the gap
    // between them, and the log |sigma(x)| labels beside the second bar
    var side = function (w, h) { return w < 560 ? 0.42 * w : Math.min(h - TOP, 0.5 * w, w - 412); };
    var L = fig.plane({ x: [-R0, R0], y: [-R0, R0], equal: true, pad: { t: 6, r: 8, b: 20, l: 30 },
      box: function (w, h) { return [0, TOP, side(w, h), h]; } });
    var B = fig.plane({ x: [0, 1], y: [0, 4], pad: { t: 26, r: 6, b: 24, l: 32 },
      box: function (w, h) { return [side(w, h) + 10, TOP, w, h]; } });
    var Rf = fig.follow(R0, { tau: 0.15 }), Yf = fig.follow(4, { tau: 0.12 });
    var pt = fig.drag({ plane: L, x: 3, y: 4, r: 7, color: 'gold', step: 1,
      constrain: function (x, y) {
        var v = L.v, m = DRAG_MAX;
        x = Kit.clamp(Math.round(x), Math.max(-m, Math.ceil(v.x0)), Math.min(m, Math.floor(v.x1)));
        y = Kit.clamp(Math.round(y), Math.max(-m, Math.ceil(v.y0)), Math.min(m, Math.floor(v.y1)));
        return x || y ? [x, y] : [cur.x[0], cur.x[1]];
      },
      onStart: function () { dragging = true; }, onEnd: function () { dragging = false; },
      onDrag: function (x, y) { if (x !== cur.x[0] || y !== cur.x[1]) setX(x, y); } });

    return function draw() {
      var ctx = fig.ctx, narrow = fig.w < 560, TS = narrow ? 10.5 : 12, t = grow.value, x = cur.x, i, k;
      var r = Math.hypot(x[0], x[1]);
      for (i = 0; i < GEN.length; i++) btns[i].enable(r * Math.sqrt(GEN[i].norm) <= CAP);
      pt.x = x[0]; pt.y = x[1];

      // Left: the lattice, x, and the circle |z| = |x|
      var R = dragging ? Rf.value : Rf.to(Math.max(R0, 1.2 * Math.max(Math.abs(x[0]), Math.abs(x[1])))).value;
      L.view.x0 = -R; L.view.x1 = R; L.view.y0 = -R; L.view.y1 = R; L.update();
      var lb = L.box, s = L.sx;
      if (s >= 4) {
        var v = L.v, rad = Math.min(1.6, 0.16 * s);
        ctx.fillStyle = fig.color('muted', 0.75); ctx.beginPath();
        for (var gx = Math.ceil(v.x0); gx <= v.x1; gx++) for (var gy = Math.ceil(v.y0); gy <= v.y1; gy++) {
          var px = L.X(gx), py = L.Y(gy); ctx.moveTo(px + rad, py); ctx.arc(px, py, rad, 0, 2 * Math.PI);
        }
        ctx.fill();
      } else L.grid();
      L.axes({ size: narrow ? 10.5 : 11.5 });
      L.clip(function () {
        ctx.strokeStyle = fig.color('muted', 0.8); ctx.lineWidth = 1; ctx.setLineDash([4, 4]);
        ctx.beginPath(); ctx.arc(L.X(0), L.Y(0), r * s, 0, 2 * Math.PI); ctx.stroke(); ctx.setLineDash([]);
      });
      fig.line(L.X(0), L.Y(0), L.X(x[0]), L.Y(x[1]), { color: 'gold', width: 1.5 });
      var ang = Math.atan2(x[1], x[0]), rt = Kit.fmt(r, Number.isInteger(r) ? 0 : 2);
      var right = Math.cos(ang) < -0.3, tx = right ? Kit.clamp(L.X(x[0]) + 16 * Math.cos(ang), lb.l + 80, lb.r) : Kit.clamp(L.X(x[0]) + 16 * Math.cos(ang), lb.l, lb.r - 80), ty = Kit.clamp(L.Y(x[1]) - 16 * Math.sin(ang), lb.t + 12, lb.b - 4);
      fig.text('|x| = ' + rt, tx, ty, { color: 'gold', size: TS, weight: 600, align: right ? 'right' : 'left' });

      // Top: the factorization of x, and on wide stages the identity the bars show
      var ft = factorText(cur) + (narrow ? '' : ',   N(x) = ' + Kit.fmt(x[0] * x[0] + x[1] * x[1])), fs = narrow ? 12.5 : 14;
      while (fs > 9 && fig.measure(ft, fs, 600) > (fig.w >= 720 ? fig.w - 360 : fig.w - 8)) fs -= 0.5;
      fig.text('x = ' + ft, 6, 19, { color: 'fg', size: fs, weight: 600 });
      if (fig.w >= 720) fig.label('pf', fig.w - 8, 16, { anchor: 'e', size: 14 });

      // Right: the two bars
      var keys = order(cur.exp), pk = order(prev.exp);
      pk.forEach(function (q) { if (keys.indexOf(q) < 0) keys.push(q); });
      keys.sort(function (s1, s2) { return PR[s1].norm - PR[s2].norm || PR[s2].d - PR[s1].d; });
      var tot = Kit.lerp(total(prev.exp), total(cur.exp), t);
      B.view.y1 = Yf.to(Math.max(4, 1.15 * total(cur.exp))).value; B.update();
      var bb = B.box, LW = narrow ? 50 : 104, BW = narrow ? 34 : 54, GAP = narrow ? 30 : 64;
      var x1 = bb.l + LW, x2 = x1 + BW + GAP, y0 = B.Y(0);
      B.axes({ x: false, yAt: 'left', size: narrow ? 10.5 : 11.5 });
      var yy = y0, lastLab = Infinity;
      keys.forEach(function (q, n) {
        var e = Kit.lerp(prev.exp[q] || 0, cur.exp[q] || 0, t), hgt = Math.log(PR[q].norm) * B.sy, al = SHADES[n % SHADES.length], top0 = yy;
        for (var j = 0; j < Math.ceil(e - 1e-9); j++) {
          var hh = hgt * Math.min(1, e - j);
          fig.rect(x1, yy - hh, BW, hh, { fill: 'gold', alpha: al });
          if (j) fig.line(x1, yy, x1 + BW, yy, { color: 'stage', width: 1.5 });
          yy -= hh;
        }
        if (n) fig.line(x1, top0, x1 + BW, top0, { color: 'stage', width: 2.5 });
        var ve = cur.exp[q] || 0, mid = (top0 + yy) / 2;
        if (ve && top0 - yy >= 12 && mid + 6 < lastLab) {
          var lab = PR[q].name + (ve > 1 ? fmt.sup(ve) : '');
          if (!narrow) lab += ', N = ' + PR[q].norm;
          fig.text(lab, x1 - 6, mid + 4, { color: 'gold', size: TS, align: 'right', weight: 600 });
          lastLab = mid - 8;
        }
      });
      for (k = 0; k < 2; k++) {
        var h2 = tot / 2 * B.sy, yb = y0 - k * h2;
        fig.rect(x2, yb - h2, BW, h2, { fill: 'blue', alpha: k ? 0.62 : 0.9 });
        if (!narrow && h2 > 16) fig.label(k ? 's2' : 's1', x2 + BW + 8, yb - h2 / 2, { anchor: 'w', color: 'blue', size: 12.5 });
      }
      if (tot > 0) fig.line(x2, y0 - tot / 2 * B.sy, x2 + BW, y0 - tot / 2 * B.sy, { color: 'stage', width: 1.5 });
      var yt = y0 - tot * B.sy;
      fig.line(x1 - 4, yt, x2 + BW + 4, yt, { color: 'fg', width: 1, dash: [3, 3], alpha: 0.6 });
      fig.text(Kit.fmt(tot, 3), x1 + BW / 2, yt - 6, { color: 'gold', size: TS, align: 'center', weight: 600 });
      fig.text(Kit.fmt(tot, 3), x2 + BW / 2, yt - 6, { color: 'blue', size: TS, align: 'center', weight: 600 });
      fig.text('=', (x1 + BW + x2) / 2, yt - 6, { color: 'fg', size: TS, align: 'center', weight: 600 });
      fig.text('primes', x1 + BW / 2, bb.b + 16, { color: 'gold', size: TS, align: 'center', weight: 600 });
      fig.text('size', x2 + BW / 2, bb.b + 16, { color: 'blue', size: TS, align: 'center', weight: 600 });
    };
  }
});
