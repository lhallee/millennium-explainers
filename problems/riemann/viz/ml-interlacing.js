/* The branching rule U(3) -> U(2) (t-ml-branching) in Harish-Chandra parameters. A highest weight lambda of U(3)
   becomes u = lambda + (1, 0, -1) (gold beads), a weight mu of U(2) becomes v = mu + (1/2, -1/2) (teal beads), and mu
   occurs in the restriction, once, exactly when u1 > v1 > u2 > v2 > u3; otherwise it occurs zero times. The grid on the
   right is the set of interlacing mu, mu1 from lambda2 to lambda1 and mu2 from lambda3 to lambda2, each cell carrying
   dim mu = mu1 - mu2 + 1; their sum is dim lambda from Weyl's formula. */
Kit.register('ml-interlacing', {
  tex: { l1: '\\lambda_1', l2: '\\lambda_2', l3: '\\lambda_3', mu1: '\\mu_1', mu2: '\\mu_2' },
  init: function (fig) {
    var fmt = Kit.fmt, MINUS = fmt.minus, LO = -2, HI = 4, VMIN = -2.5, VMAX = 4.5;
    function weyl(l) { return (l[0] - l[1] + 1) * (l[1] - l[2] + 1) * (l[0] - l[2] + 2) / 2; }
    function weylProduct(l) { var p = 1; for (var i = 0; i < 3; i++) for (var j = i + 1; j < 3; j++) p *= (l[i] - l[j] + j - i) / (j - i); return p; }
    function inter(l) { var out = []; for (var a = l[0]; a >= l[1]; a--) for (var b = l[1]; b >= l[2]; b--) out.push([a, b, a - b + 1]); return out; }
    function us(l) { return [l[0] + 1, l[1], l[2] - 1]; }
    function vs(m) { return [m[0] + 0.5, m[1] - 0.5]; }
    function half(v) { return Number.isInteger(v) ? fmt(v) : (v < 0 ? MINUS : '') + Math.abs(2 * v) + '/2'; }
    /* The chain u1 > v1 > u2 > v2 > u3, and the index of each link that fails. */
    function chain(l, m) { var u = us(l), v = vs(m), c = [u[0], v[0], u[1], v[1], u[2]], bad = []; for (var i = 0; i < 4; i++) if (!(c[i] > c[i + 1])) bad.push(i); return { c: c, bad: bad }; }

    // Self-checks: the chapter's example, and Weyl's formula against the sum over interlacing weights for every lambda.
    var ex = inter([2, 1, 0]);
    if (ex.map(function (q) { return q.join(','); }).join(' ') !== '2,1,2 2,0,3 1,1,1 1,0,2' || weyl([2, 1, 0]) !== 8 || us([2, 1, 0]).join() !== '3,1,-1' ||
      chain([2, 1, 0], [3, 0]).bad.join() !== '0' || vs([3, 0]).join() !== '3.5,-0.5') console.error('ml-interlacing: the example lambda = (2, 1, 0) disagrees with the chapter');
    for (var a = LO; a <= HI; a++) for (var b = LO; b <= a; b++) for (var c = LO; c <= b; c++) {
      var s = inter([a, b, c]).reduce(function (t, q) { return t + q[2]; }, 0);
      if (s !== weyl([a, b, c]) || s !== Math.round(weylProduct([a, b, c]))) console.error('ml-interlacing: branching sum fails at ' + [a, b, c]);
    }

    var mu = [2, 0];
    var L = [2, 1, 0].map(function (v, i) {
      return fig.slider({ label: '', tex: 'l' + (i + 1), min: LO, max: HI, step: 1, value: v, onInput: function (x) { order(i, x); } });
    });
    function order(i, x) {                                         // keep lambda non-increasing, pushing the others
      for (var j = i - 1; j >= 0; j--) if (L[j].value < x) L[j].set(x);
      for (j = i + 1; j < 3; j++) if (L[j].value > x) L[j].set(x);
    }
    var lam = function () { return [L[0].value, L[1].value, L[2].value]; };
    var uf = [0, 1, 2].map(function (i) { return fig.follow(us(lam())[i], { tau: 0.08 }); });
    var TOP = 30, GW = function (w) { return w < 560 ? Math.round(0.37 * w) : Kit.clamp(0.3 * w, 190, 290); };
    var N = fig.plane({ x: [-3.4, 5.4], y: [0, 1], pad: { t: 4, r: 10, b: 4, l: 10 }, box: function (w, h) { return [0, TOP, w - GW(w), h]; } });
    var G = fig.plane({ x: [-0.6, 2.6], y: [-0.6, 1.6], equal: true, pad: { t: 22, r: 24, b: 40, l: 28 }, box: function (w, h) { return [w - GW(w), TOP, w, h]; } });
    var gx0 = fig.follow(-0.6), gx1 = fig.follow(2.6), gy0 = fig.follow(-0.6), gy1 = fig.follow(1.6);
    var YU = 0.8, YV = 0.2, YA = 0.5;
    function setMu(m0, m1) { mu = [m0, m1]; fig.redraw(); }
    var dv = [0, 1].map(function (i) {
      return fig.drag({ plane: N, x: vs(mu)[i], y: YV, r: 8, color: 'teal',
        constrain: function (x) { return [Kit.clamp(Math.round(x - 0.5) + 0.5, VMIN, VMAX), YV]; },
        onDrag: function (x) {
          if (i === 0) { var m0 = x - 0.5, m1 = Math.min(mu[1], m0); if (m1 - 0.5 < VMIN) { m1 = VMIN + 0.5; m0 = Math.max(m0, m1); } setMu(m0, m1); }
          else { var n1 = x + 0.5, n0 = Math.max(mu[0], n1); if (n0 + 0.5 > VMAX) { n0 = VMAX - 0.5; n1 = Math.min(n1, n0); } setMu(n0, n1); }
        } });
    });
    fig.probe({ plane: G, crosshair: false, snap: function (x, y) {
        var l = lam(), m0 = Math.round(x), m1 = Math.round(y);
        return m0 <= l[0] && m0 >= l[1] && m1 <= l[1] && m1 >= l[2] ? [m0, m1] : null;
      },
      rows: function (x, y, pr) { return !pr.snapped ? null : [[{ tex: 'mu1' }, fmt(x)], [{ tex: 'mu2' }, fmt(y)], ['dim', fmt(x - y + 1), 'teal']]; },
      pick: function (x, y) { var l = lam(), m0 = Kit.clamp(Math.round(x), l[1], l[0]), m1 = Kit.clamp(Math.round(y), l[2], l[1]); setMu(m0, m1); } });
    fig.onReset = function () { mu = [2, 0]; };

    return function draw() {
      var l = lam(), u = us(l).map(function (t, i) { return uf[i].to(t).value; }), v = vs(mu), ch = chain(l, mu), ok = !ch.bad.length;
      var narrow = fig.w < 560, nb = N.box, ya = N.Y(YA), fs = narrow ? 11 : 12.5;
      dv[0].x = v[0]; dv[1].x = v[1];

      // the number line with integer and half-integer ticks
      fig.line(nb.l, ya, nb.r, ya, { color: 'muted', width: 1.2 });
      for (var t = -3; t <= 5; t += 0.5) {
        var px = N.X(t), whole = Number.isInteger(t);
        fig.line(px, ya - (whole ? 5 : 3), px, ya + (whole ? 5 : 3), { color: 'muted', width: 1 });
        if (whole) fig.text(fmt(t), px, ya + 17, { color: 'muted', size: narrow ? 10.5 : 11.5, align: 'center' });
      }
      // the gap each v must occupy: (u2, u1) for v1 and (u3, u2) for v2
      for (var g = 0; g < 2; g++) {
        var gl = N.X(u[g + 1]), gr = N.X(u[g]), inside = v[g] < u[g] && v[g] > u[g + 1];
        fig.rect(gl + 4, ya - 9, Math.max(0, gr - gl - 8), 18, { fill: 'teal', alpha: inside ? 0.16 : 0.07 });
        fig.line(N.X(v[g]), N.Y(YV) - 9, N.X(v[g]), ya + (narrow ? 4 : 6), { color: inside ? 'muted' : 'red', width: 1, dash: [3, 3] });
      }
      // the failing links, drawn on the line between the two parameters that are out of order
      ch.bad.forEach(function (i) {
        var p = ch.c[i], q = ch.c[i + 1], x0 = N.X(Math.min(p, q)), x1 = N.X(Math.max(p, q));
        if (x1 - x0 < 6) { x0 -= 4; x1 += 4; }
        fig.line(x0, ya, x1, ya, { color: 'red', width: 4 });
      });
      for (var i = 0; i < 3; i++) {
        fig.line(N.X(u[i]), N.Y(YU) + 9, N.X(u[i]), ya - 6, { color: 'gold', width: 1, alpha: 0.5 });
        fig.circle(N.X(u[i]), N.Y(YU), 8, { fill: 'gold', ring: 'stage', ringWidth: 2 });
        fig.text('u' + fmt.sub(i + 1) + ' = ' + half(us(l)[i]), N.X(u[i]), N.Y(YU) - 14, { color: 'gold', size: fs, align: 'center', weight: 600 });
      }
      for (i = 0; i < 2; i++) fig.text('v' + fmt.sub(i + 1) + ' = ' + half(v[i]), N.X(v[i]), N.Y(YV) + 24, { color: ch.bad.indexOf(2 * i) >= 0 || ch.bad.indexOf(2 * i + 1) >= 0 ? 'red' : 'teal', size: fs, align: 'center', weight: 600 });

      // the chain of inequalities, the failing links in red, and the multiplicity
      var names = ['u₁', 'v₁', 'u₂', 'v₂', 'u₃'], x = 8, y = 19, cs = fs;
      for (i = 0; i < 5; i++) {
        var piece = (fig.w < 760 ? '' : names[i] + ' = ') + half(ch.c[i]);
        fig.text(piece, x, y, { color: i % 2 ? 'teal' : 'gold', size: cs, weight: 600 }); x += fig.measure(piece, cs, 600);
        if (i < 4) { var rel = ch.bad.indexOf(i) >= 0 ? '  ≤  ' : '  >  '; fig.text(rel, x, y, { color: ch.bad.indexOf(i) >= 0 ? 'red' : 'fg', size: cs, weight: 600 }); x += fig.measure(rel, cs, 600); }
      }
      fig.text((narrow ? '' : 'μ = (' + fmt(mu[0]) + ', ' + fmt(mu[1]) + '): ') + 'multiplicity ' + (ok ? 1 : 0), fig.w - 8, y, { color: ok ? 'teal' : 'red', size: cs, weight: 600, align: 'right' });

      // the grid of interlacing mu with their dimensions
      var list = inter(l), lo0 = Math.min(l[1], mu[0]), hi0 = Math.max(l[0], mu[0]), lo1 = Math.min(l[2], mu[1]), hi1 = Math.max(l[1], mu[1]);
      G.view.x0 = gx0.to(lo0 - 0.6).value; G.view.x1 = gx1.to(hi0 + 0.6).value; G.view.y0 = gy0.to(lo1 - 0.6).value; G.view.y1 = gy1.to(hi1 + 0.6).value; G.update();
      var gb = G.box, cell = Math.min(G.sx, G.sy), cfs = Kit.clamp(cell * 0.42, 8.5, 14);
      G.axes({ edge: true, xStep: 1, yStep: 1, size: narrow ? 10.5 : 11.5 });
      fig.label('mu1', gb.r + 4, gb.b, { anchor: 'w', color: 'muted', size: narrow ? 11 : 12.5 });
      fig.label('mu2', gb.l - 4, gb.t - 3, { anchor: 'se', color: 'muted', size: narrow ? 11 : 12.5 });
      list.forEach(function (q) {
        var cx = G.X(q[0]), cy = G.Y(q[1]), hw = cell * 0.44;
        fig.rect(cx - hw, cy - hw, 2 * hw, 2 * hw, { fill: 'teal', alpha: 0.22, color: 'teal', width: 1 });
        if (cell >= 14) fig.text(String(q[2]), cx, cy + cfs * 0.36, { color: 'fg', size: fs, align: 'center', weight: 600 });
      });
      var mx = G.X(mu[0]), my = G.Y(mu[1]);
      fig.rect(mx - cell * 0.5, my - cell * 0.5, cell, cell, { color: ok ? 'teal' : 'red', width: 2.5 });
      var sum = list.reduce(function (s, q) { return s + q[2]; }, 0), dimL = weyl(l);
      var terms = list.length <= (narrow ? 4 : 6) ? list.map(function (q) { return q[2]; }).join(' + ') : list.length + ' weights';
      var foot = narrow ? 'sum ' + sum + ' = dim ' + dimL : terms + ' = ' + sum + ';  dim λ = ' + dimL;
      fig.text(foot, (gb.l + gb.r) / 2 - 10, gb.b + 34, { color: sum === dimL ? 'teal' : 'red', size: fs, align: 'center', weight: 600 });
    };
  }
});
