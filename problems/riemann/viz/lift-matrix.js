/* The theta lift from the rank-one genus G_0 (classes O_E, p, pbar, weight 1/2 each) to the rank-two genus G_1
   (nine classes, weights 1/|Aut|) as a matrix (chapter 20, df-lift): g(L_j) = sum_i (1/2) f(i) K(i, j) with K the
   embedding counts, and the adjoint f'(i) = sum_j w_j g(L_j) K(i, j). The 3 x 3 matrix of L*L is
   [[2, 1/2, 1/2], [1/2, 2, 1/2], [1/2, 1/2, 2]]: eigenvalue 3 on the constant 1, 3/2 on xi and xi-bar. f is drawn
   as horizontal bars beside the rows of K (real part as length, phase on a dial), g as vertical bars under the
   columns, and L*L f as blue bars under the f bars. */
Kit.register('lift-matrix', {
  tex: { O: '\\mathcal O_E', p: '\\mathfrak p', pb: '\\bar{\\mathfrak p}', f: 'f', g: '\\mathcal L_K f', LL: '\\mathcal L_K^{*}\\mathcal L_K f' },
  init: function (fig) {
    var fmt = Kit.fmt, i, j;
    var K = [[4, 2, 2, 0, 0, 0, 0, 0, 0], [0, 2, 0, 4, 0, 2, 0, 0, 0], [0, 0, 2, 0, 4, 2, 0, 0, 0]];
    var AUT = [8, 4, 4, 8, 8, 4, 12, 12, 12], W24 = AUT.map(function (a) { return 24 / a; });
    var c3 = Math.cos(2 * Math.PI / 3), s3 = Math.sin(2 * Math.PI / 3);
    var PRE = { one: [[1, 1, 1], [0, 0, 0]], xi: [[1, c3, c3], [0, s3, -s3]], xib: [[1, c3, c3], [0, -s3, s3]] };

    function lift(fr, fi, gr, gi) { for (j = 0; j < 9; j++) { gr[j] = 0; gi[j] = 0; for (i = 0; i < 3; i++) { gr[j] += 0.5 * fr[i] * K[i][j]; gi[j] += 0.5 * fi[i] * K[i][j]; } } }
    function adj(gr, gi, hr, hi) { for (i = 0; i < 3; i++) { hr[i] = 0; hi[i] = 0; for (j = 0; j < 9; j++) { hr[i] += gr[j] * K[i][j] / AUT[j]; hi[i] += gi[j] * K[i][j] / AUT[j]; } } }

    // self-check, exact in 48ths: L*L = (1/48) K diag(24 w) K^T = [[2, 1/2, 1/2], ...]; L*1 = 3/2; L1 = (2,..,2,0,0,0);
    // and L xi = (2, e^{pi i/3}, e^{-pi i/3}, 2e^{2pi i/3}, 2e^{-2pi i/3}, -1, 0, 0, 0) with |L xi|^2 = 9/4
    var ok = true, gr = new Float64Array(9), gi = new Float64Array(9), hr = new Float64Array(3), hi = new Float64Array(3);
    for (i = 0; i < 3; i++) {
      var col = 0;
      for (var k = 0; k < 3; k++) { var m = 0; for (j = 0; j < 9; j++) m += K[i][j] * W24[j] * K[k][j]; if (m !== (i === k ? 96 : 24)) ok = false; }
      for (j = 0; j < 9; j++) col += W24[j] * K[i][j];
      if (col !== 36) ok = false;
    }
    lift(PRE.xi[0], PRE.xi[1], gr, gi);
    var want = [[2, 0], [0.5, s3], [0.5, -s3], [-1, 2 * s3], [-1, -2 * s3], [-1, 0], [0, 0], [0, 0], [0, 0]], nrm = 0;
    for (j = 0; j < 9; j++) { if (Math.abs(gr[j] - want[j][0]) + Math.abs(gi[j] - want[j][1]) > 1e-12) ok = false; nrm += (gr[j] * gr[j] + gi[j] * gi[j]) / AUT[j]; }
    if (Math.abs(nrm - 2.25) > 1e-12) ok = false;
    if (!ok) console.error('lift-matrix: the kernel no longer reproduces the chapter (L*L, L xi, or |L xi|^2)');

    var fr = PRE.xi[0].slice(), fi = PRE.xi[1].slice(), from = [[0, 0, 0], [0, 0, 0]], morph = fig.tween(1), btn = {};
    var dr = [0, 0, 0], di = [0, 0, 0];
    function preset(key) {
      from = [dr.slice(), di.slice()]; fr = PRE[key][0].slice(); fi = PRE[key][1].slice();
      morph.set(0); morph.to(1, 400, 'inOutCubic');
      Object.keys(btn).forEach(function (q) { btn[q].press(q === key); });
    }
    [['one', '1'], ['xi', 'ξ'], ['xib', 'ξ̄']].forEach(function (q) {
      btn[q[0]] = fig.button({ label: 'f = ' + q[1], pressed: q[0] === 'xi', onClick: function () { preset(q[0]); } });
    });
    fig.onReset = function () { preset('xi'); morph.set(1); };

    var lay = {};
    function layout(W, H) {
      var nar = W < 560;
      if (nar) { var t = 32, r = Kit.clamp(0.085 * H, 20, 30); lay = { nar: true, lw: 34, top: t, rh: r, mb: t + 3 * r, W: W, H: H }; }
      else { var t2 = 44, r2 = Kit.clamp(0.1 * H, 26, 46); lay = { nar: false, lw: Kit.clamp(0.34 * W, 130, 340), top: t2, rh: r2, mb: t2 + 3 * r2, W: W, H: H }; }
    }
    var F = fig.plane({ x: [-3.6, 3.6], y: [-0.5, 2.5], pad: { t: 0, r: 24, b: 0, l: 34 },
      box: function (W, H) { layout(W, H); return lay.nar ? [0, H - 70, W, H - 4] : [0, lay.top, lay.lw, lay.mb]; } });
    var G = fig.plane({ x: [0.5, 9.5], y: [-4.4, 4.4], pad: 0,
      box: function (W, H) { layout(W, H); return lay.nar ? [lay.lw + 4, lay.mb + 14, W - 8, H - 92] : [lay.lw + 8, lay.mb + 18, W - 10, H - 34]; } });
    var gmax = fig.follow(2.4, { tau: 0.1 });
    var handles = [0, 1, 2].map(function (r) {
      return fig.drag({ plane: F, x: fr[r], y: 2 - r - 0.17, r: 6, color: 'gold',
        onStart: function () { fr = dr.slice(); fi = [0, 0, 0]; di = [0, 0, 0]; morph.set(1); Object.keys(btn).forEach(function (q) { btn[q].press(false); }); },
        constrain: function (x) { return [Kit.clamp(x, -2, 2), 2 - r - 0.17]; },
        onDrag: function (x) { fr[r] = x; } });
    });
    var g2r = new Float64Array(9), g2i = new Float64Array(9), h2r = new Float64Array(3), h2i = new Float64Array(3);

    /* The column heads (weight 600 at 13.5 px, with subscript digits the text face lacks), the kernel's entries (700
       at 13 px), and the note under the columns need fonts the kit has not prepared, and creating them took a third
       of the first frame at 4x CPU slowdown. So that text waits: ready() is false for a font not yet created, and a
       job creates the queued fonts, one per frame, by measuring a sample in each. */
    var warm = {}, queue = [], warming = null;
    function ready(size, weight, sample) {
      var k = size + '|' + weight;
      if (warm[k]) return true;
      if (!(k in warm)) { warm[k] = false; queue.push([size, weight, sample]); }
      if (!warming) warming = fig.job(function* () {
        while (queue.length) { var q = queue.shift(); fig.measure(q[2], q[0], q[1]); warm[q[0] + '|' + q[1]] = true; yield; }
        warming = null;
      });
      return false;
    }

    function dial(x, y, R, re, im) {
      fig.circle(x, y, R, { fill: false, ring: 'muted', ringWidth: 1 });
      var a = Math.hypot(re, im);
      if (a < 1e-9) { fig.circle(x, y, 1.6, { fill: 'muted' }); return; }
      fig.line(x, y, x + R * re / a, y - R * im / a, { color: 'fg', width: 1.6 });
    }

    return function draw() {
      var t = morph.value, rows = ['O', 'p', 'pb'], nar = lay.nar, ts = nar ? 12 : 13.5;
      for (i = 0; i < 3; i++) { dr[i] = from[0][i] + (fr[i] - from[0][i]) * t; di[i] = from[1][i] + (fi[i] - from[1][i]) * t; }
      lift(dr, di, g2r, g2i); adj(g2r, g2i, h2r, h2i);
      var gm = 0;
      for (j = 0; j < 9; j++) gm = Math.max(gm, Math.abs(g2r[j]));
      var G1 = gmax.to(Math.max(2.4, 1.2 * gm)).value;
      G.view.y0 = -G1; G.view.y1 = G1; G.update();
      var fb = F.box, gb = G.box, cw = G.sx, rh = lay.rh, top = lay.top, H0 = lay.H;

      // column heads, weights, and the kernel as a heat map with each cell's share of the current lift
      var big = 1e-9;
      for (i = 0; i < 3; i++) for (j = 0; j < 9; j++) big = Math.max(big, Math.abs(0.5 * Math.hypot(dr[i], di[i]) * K[i][j]));
      var headsOn = ready(ts, 600, 'L₁₂₃₄₅₆₇₈₉'), vs = nar ? 11.5 : 13, valuesOn = ready(vs, 700, '0124');
      for (j = 0; j < 9; j++) {
        var cx = G.X(j + 1);
        if (headsOn) fig.text('L' + fmt.sub(j + 1), cx, nar ? 11 : 14, { color: 'fg', size: ts, align: 'center', baseline: 'middle', weight: 600 });
        fig.text('1/' + AUT[j], cx, top - (nar ? 6 : 9), { color: 'muted', size: nar ? 9.5 : 11, align: 'center', mono: true });
        for (i = 0; i < 3; i++) {
          var x0 = cx - cw / 2 + 1.5, y0 = top + i * rh + 1.5, share = Math.abs(0.5 * Math.hypot(dr[i], di[i]) * K[i][j]) / big;
          fig.rect(x0, y0, cw - 3, rh - 3, { fill: 'muted', alpha: 0.07 + 0.05 * K[i][j] });
          if (K[i][j]) fig.rect(x0, y0, cw - 3, rh - 3, { fill: 'gold', alpha: Math.round(10 * share) / 20 });
          if (valuesOn) fig.text(String(K[i][j]), cx, y0 + (rh - 3) / 2, { color: K[i][j] ? 'fg' : 'muted', alpha: K[i][j] ? 1 : 0.5, size: vs, align: 'center', baseline: 'middle', weight: K[i][j] ? 700 : 500 });
        }
        if (nar && j < 3) fig.label(rows[j], lay.lw - 6, top + j * rh + rh / 2, { anchor: 'e', color: 'fg', size: ts, id: 'hm' + j });
      }
      if (!nar) fig.text('w = 1/2', fb.l, top - 9, { color: 'muted', size: 11, mono: true });
      else fig.text('w = 1/2', 4, H0 - 75, { color: 'muted', size: 9.5, mono: true });

      // f, and L*L f under it, as horizontal bars; a phase dial at the right end of each row
      F.vline(0, { color: 'muted', width: 1 });
      var fr2 = (fb.b - fb.t) / 3;
      for (i = 0; i < 3; i++) {
        var yc = F.Y(2 - i), z = F.X(0);
        fig.label(rows[i], fb.l - 6, yc, { anchor: 'e', color: 'fg', size: ts });
        var xf = F.X(dr[i]), xh = F.X(Kit.clamp(h2r[i], -3.6, 3.6));
        fig.rect(Math.min(z, xf), yc - fr2 * 0.32, Math.abs(xf - z), fr2 * 0.28, { fill: 'gold', alpha: 0.85 });
        fig.rect(Math.min(z, xh), yc + fr2 * 0.04, Math.abs(xh - z), fr2 * 0.24, { fill: 'blue', alpha: 0.8 });
        if (Math.abs(h2r[i]) > 3.6) fig.arrow(xh - Math.sign(h2r[i]) * 8, yc + fr2 * 0.16, xh + Math.sign(h2r[i]) * 3, yc + fr2 * 0.16, { color: 'blue', width: 1.5, head: 6 });
        dial(fb.r + 13, yc, Math.min(8, fr2 * 0.3), dr[i], di[i]);
        handles[i].x = dr[i]; handles[i].y = 2 - i - 0.17;
      }

      // g = L f under the columns, each with its phase dial at the tip
      G.hline(0, { color: 'muted', width: 1 });
      var R = Math.min(7, cw * 0.24);
      for (j = 0; j < 9; j++) {
        var gx = G.X(j + 1), gy = G.Y(g2r[j]), g0 = G.Y(0), bw = Math.min(cw * 0.26, 14), up = g2r[j] >= -1e-9;
        if (Math.abs(gy - g0) > 0.5) fig.rect(gx - bw, Math.min(gy, g0), 2 * bw, Math.abs(gy - g0), { fill: 'gold', alpha: 0.85 });
        if (Math.hypot(g2r[j], g2i[j]) > 1e-9) dial(gx, gy + (up ? -(R + 4) : R + 4), R, g2r[j], g2i[j]);
        else if (!nar) fig.text('0', gx, g0 - 7, { color: 'muted', size: 11, align: 'center' });
      }
      fig.label('g', gb.l - 4, G.Y(0) - 10, { anchor: 'e', color: 'gold', size: nar ? 12 : 15 });

      // what the adjoint returns: 3 on the constant part, 3/2 on the rest
      var s = (dr[0] + dr[1] + dr[2]) / 3, si = (di[0] + di[1] + di[2]) / 3, rest = 0;
      for (i = 0; i < 3; i++) rest += Math.hypot(dr[i] - s, di[i] - si);
      var c = Math.hypot(s, si) > 1e-6, r = rest > 1e-6;
      var res = !c && !r ? ' = 0' : !r ? ' = 3 f' : !c ? ' = (3/2) f' : null;
      var ls = nar ? 11 : 13, tx = nar ? G.X(6.5) + 2 : 8, ty = nar ? gb.t + 2 : lay.mb + 14;
      var lg = fig.legend([{ color: 'gold', fill: true, alpha: 0.85, tex: 'f' }, { color: 'blue', fill: true, alpha: 0.8, tex: 'LL' }],
        { plane: F, x: tx - 6, y: ty - 4, size: ls, bg: false, id: 'key' });
      ty = lg.y + lg.h + ls;
      if (res) fig.mathText([{ tex: 'LL' }, res], tx, ty, { size: ls });
      else {
        fig.text('3 × constant part', tx, ty, { size: ls, color: 'fg', baseline: 'middle' });
        fig.text('+ (3/2) × the rest', tx, ty + ls * 1.5, { size: ls, color: 'fg', baseline: 'middle' });
      }
      if (!nar) {
        if (lay.H > 400) fig.text('drag the gold dots', 8, lay.H - 14, { size: 11.5, color: 'muted' });
        if (ready(11.5, 500, 'L₇, L₈, L₉')) fig.text('L₇, L₈, L₉ receive nothing', G.X(8), gb.t + 10, { size: 11.5, color: 'muted', align: 'center' });
      }
    };
  }
});
