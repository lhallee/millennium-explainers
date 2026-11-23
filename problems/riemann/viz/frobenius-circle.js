/* The inverse roots alpha_i of a curve's L-polynomial on the circle |alpha| = sqrt(q) (left), the vectors alpha_i^n /
   q^(n/2) laid tip to tail with their sum S_n / q^(n/2) (right, in units of q^(n/2)), and the normalized error
   (N_n - q^n - 1) / q^(n/2) = -S_n / q^(n/2) for n = 1..40 against the band [-2g, 2g] (below). The alpha_i are the roots
   of x^(2g) L(1/x), found by Durand-Kerner; init checks that each has |alpha| = sqrt(q). The exact counts N_n come from
   Newton's identities in BigInt arithmetic, and init checks them against the chapter's direct counts. Between steps
   the exponent n runs continuously, alpha^t = |alpha|^t e^(i t arg alpha), so the arrows turn. "Move a root off the
   circle" scales one root by 1.2 and puts its functional-equation partner at q / (1.2 alpha). That pair is no longer
   closed under conjugation, so S_n leaves the real axis, and the strip plots the real part of -S_n / q^(n/2). */
Kit.register('frobenius-circle', {
  tex: { a1: '\\alpha_1', a2: '\\alpha_2', a3: '\\alpha_3', a4: '\\alpha_4', circ: '\\lvert\\alpha\\rvert=\\sqrt{q}', one: 'q^{n/2}',
    bound: '2g\\,q^{n/2}', S: 'S_n', E: '(N_n-q^n-1)/q^{n/2}', N: 'N_n', band: '\\pm 2g' },
  init: function (fig) {
    var fmt = Kit.fmt, M = Kit.math, NMAX = 40;
    var CURVES = {
      A: { q: 5, g: 1, L: [1, 3, 5], check: [9, 27, 108, 675, 3069, 15552] },
      B: { q: 7, g: 2, L: [1, -1, 0, -7, 49], check: [7, 49, 322, 2569] }
    };
    Object.keys(CURVES).forEach(function (k) {
      var c = CURVES[k], m = c.L.length - 1, sq = Math.sqrt(c.q), z = [], i, it, j;
      for (i = 0; i < m; i++) z.push(M.polar(sq, 0.4 + 2 * Math.PI * i / m));   // Durand-Kerner on x^m + L1 x^(m-1) + ... + Lm
      for (it = 0; it < 200; it++) for (i = 0; i < m; i++) {
        var num = M.C(1, 0), den = M.C(1, 0);
        for (j = 1; j <= m; j++) num = M.add(M.mul(num, z[i]), M.C(c.L[j], 0));
        for (j = 0; j < m; j++) if (j !== i) den = M.mul(den, M.sub(z[i], z[j]));
        z[i] = M.sub(z[i], M.div(num, den));
      }
      z.forEach(function (a) { if (Math.abs(M.abs(a) - sq) > 1e-9) throw new Error('frobenius-circle: curve ' + k + ' has a root of modulus ' + M.abs(a)); });
      c.roots = z.sort(function (a, b) { return M.arg(b) - M.arg(a); });
      var S = [0n], Q = BigInt(c.q), Lb = c.L.map(BigInt);                      // Newton: S_n = -(L1 S_(n-1) + ... ) - n L_n
      c.N = [0n]; c.E = new Float64Array(NMAX + 1);
      for (var n = 1; n <= NMAX; n++) {
        var s = n <= m ? -BigInt(n) * Lb[n] : 0n;
        for (j = 1; j <= Math.min(n - 1, m); j++) s -= Lb[j] * S[n - j];
        S[n] = s; c.N[n] = Q ** BigInt(n) + 1n - s;
        c.E[n] = -Number(s) / Math.pow(c.q, n / 2);
      }
      c.check.forEach(function (v, i) { if (c.N[i + 1] !== BigInt(v)) throw new Error('frobenius-circle: curve ' + k + ' N_' + (i + 1) + ' = ' + c.N[i + 1] + ', chapter says ' + v); });
    });

    var pick = fig.select({ label: 'Curve', options: [['A', 'y² = x³ + x + 1 over 𝔽₅, genus 1'], ['B', 'y² = x⁵ − x + 1 over 𝔽₇, genus 2']], value: 'A' });
    var play = fig.player({ label: 'n', min: 1, max: NMAX, duration: 0.6 * (NMAX - 1), reduced: 11 / (NMAX - 1), format: function (v) { return String(Math.round(tOf(v))); } });
    function tOf(mp) { var n0 = Math.floor(mp + 1e-9); return Math.min(NMAX, n0 + Kit.ease.smooth(Math.min(1, (mp - n0) / 0.4))); }   // turn, then rest
    var fake = fig.toggle({ label: 'Move a root off the circle', value: false });
    var kf = fig.tween(1), lastFake = false, view = fig.follow(2.4, { tau: 0.15 }), yv = fig.follow(2.6, { tau: 0.15 });
    fig.onReset = function () { kf.set(1); lastFake = false; };

    var split = function (w, h) { return Math.round(h * (w < 640 ? 0.6 : 0.64)); };
    var Lp = fig.plane({ x: [-3, 3], y: [-3, 3], equal: true, pad: 10, box: function (w, h) { return [0, 0, w / 2, split(w, h)]; } });
    var Rp = fig.plane({ x: [-3, 3], y: [-3, 3], equal: true, pad: 10, box: function (w, h) { return [w / 2, 0, w, split(w, h)]; } });
    var Sp = fig.plane({ x: [0.5, NMAX + 0.5], y: [-2.6, 2.6], pad: { t: 44, r: 14, b: 22, l: 40 }, box: function (w, h) { return [0, split(w, h), w, h]; } });
    var re = new Float64Array(4), im = new Float64Array(4), mod = new Float64Array(4), ang = new Float64Array(4), Ecur = new Float64Array(NMAX + 1);

    function circle(P, r, style) { fig.stroke(style); fig.ctx.beginPath(); fig.ctx.arc(P.X(0), P.Y(0), Math.abs(P.X(r) - P.X(0)), 0, 2 * Math.PI); fig.ctx.stroke(); fig.ctx.setLineDash([]); }

    return function draw() {
      var c = CURVES[pick.value], q = c.q, g = c.g, sq = Math.sqrt(q), m = 2 * g, i;
      if (fake.value !== lastFake) { lastFake = fake.value; kf.to(fake.value ? 1.2 : 1, 500, 'inOutCubic'); }
      var k = kf.value, t = tOf(play.mapped), n = Math.round(t), narrow = fig.w < 640;

      // The roots, with root 0 scaled by k and its partner (the conjugate) moved to q / (k alpha_0).
      var a0 = c.roots[0], partner = m - 1;
      for (i = 0; i < m; i++) { mod[i] = M.abs(c.roots[i]); ang[i] = M.arg(c.roots[i]); }
      mod[0] *= k; mod[partner] /= k;
      for (i = 0; i < m; i++) { re[i] = mod[i] * Math.cos(ang[i]); im[i] = mod[i] * Math.sin(ang[i]); }
      var off = k > 1.0001, maxE = 0;
      for (var j = 1; j <= NMAX; j++) {
        if (!off) Ecur[j] = c.E[j];
        else { var e = 0; for (i = 0; i < m; i++) e -= Math.pow(mod[i] / sq, j) * Math.cos(j * ang[i]); Ecur[j] = e; }
        if (j <= n) maxE = Math.max(maxE, Math.abs(Ecur[j]));
      }

      // Left: the complex plane, the circle |alpha| = sqrt(q), and the roots.
      var lim = 1.42 * sq;
      Lp.view.x0 = Lp.view.y0 = -lim; Lp.view.x1 = Lp.view.y1 = lim; Lp.update();
      Lp.hline(0, { color: 'muted', width: 1, alpha: 0.6 }); Lp.vline(0, { color: 'muted', width: 1, alpha: 0.6 });
      circle(Lp, sq, { color: 'violet', width: 2 });
      fig.label('circ', Lp.X(sq * 0.72), Lp.Y(sq * 0.72), { anchor: 'sw', color: 'violet', size: 13, dx: 4, dy: -2 });
      for (i = 0; i < m; i++) {
        var bad = Math.abs(mod[i] - sq) > 1e-6;
        Lp.segment(0, 0, re[i], im[i], { color: 'teal', width: 1, alpha: 0.35 });
        Lp.point(re[i], im[i], { color: bad ? 'red' : 'teal', r: 5.5 });
        var lx = re[i] / mod[i], ly = im[i] / mod[i];
        fig.label('a' + (i + 1), Lp.X(re[i]) + 15 * lx, Lp.Y(im[i]) - 15 * ly, { anchor: 'c', color: bad ? 'red' : 'teal', size: 13 });
      }
      if (off) fig.text(narrow ? 'red: hypothetical' : 'red: hypothetical roots, off the circle',Lp.box.l + 2, Lp.box.b - 4, { color: 'red', size: 11, weight: 600, alpha: Math.min(1, (k - 1) / 0.1) });

      // Right: the vectors alpha_i^t / q^(t/2) tip to tail, and their sum, in units of q^(t/2).
      var x = 0, y = 0, ext = 2 * g + 0.4, tips = [];
      for (i = 0; i < m; i++) {
        var r = Math.pow(mod[i] / sq, t), th = t * ang[i], nx = x + r * Math.cos(th), ny = y + r * Math.sin(th);
        tips.push([x, y, nx, ny]); x = nx; y = ny; ext = Math.max(ext, 1.1 * Math.hypot(x, y), 1.1 * Math.hypot(nx, ny));
      }
      var R = view.to(ext).value;
      Rp.view.x0 = Rp.view.y0 = -R; Rp.view.x1 = Rp.view.y1 = R; Rp.update();
      Rp.hline(0, { color: 'muted', width: 1, alpha: 0.6 }); Rp.vline(0, { color: 'muted', width: 1, alpha: 0.6 });
      circle(Rp, 2 * g, { color: 'blue', width: 1.4, dash: [5, 4] });
      circle(Rp, 1, { color: 'violet', width: 1.6 });
      for (i = 0; i < m; i++) Rp.arrow(tips[i][0], tips[i][1], tips[i][2], tips[i][3], { color: 'teal', width: 2.2, head: 8 });
      if (Math.hypot(x, y) > 1e-9) Rp.arrow(0, 0, x, y, { color: 'red', width: 2.8, head: 10 });
      fig.label('S', Rp.X(x), Rp.Y(y), { anchor: y > 0.05 * R ? 's' : 'n', color: 'red', size: 13, dy: y > 0.05 * R ? -6 : 6 });
      var rpx = Rp.X(1) - Rp.X(0);                                     // the circle labels only while the circles are large enough to carry them
      if (rpx * 2 * g > 50) fig.label('bound', Rp.X(2 * g * 0.71), Rp.Y(-2 * g * 0.71), { anchor: 'nw', color: 'blue', size: 12, dx: 2, dy: 2 });
      if (rpx > 30) fig.label('one', Rp.X(-0.71), Rp.Y(-0.71), { anchor: 'ne', color: 'violet', size: 12, dx: -2, dy: 2 });

      // Below: the normalized error for 1..n against the band [-2g, 2g].
      var Y = yv.to(Math.max(2 * g + 0.6, 1.12 * maxE)).value;
      Sp.view.y0 = -Y; Sp.view.y1 = Y; Sp.update();
      Sp.fillBetween(2 * g, -2 * g, 0.5, NMAX + 0.5, { color: 'blue', alpha: 0.13, edges: { color: 'blue', width: 1.2, alpha: 0.8 } });
      Sp.axes({ edge: true, xTicks: [1, 10, 20, 30, 40], yTicks: Y > 8 * g ? [0, -Math.round(Y * 0.8), Math.round(Y * 0.8)] : [-2 * g, 0, 2 * g], size: 10.5 });
      Sp.hline(0, { color: 'muted', width: 1, alpha: 0.5 });
      for (j = 1; j <= n; j++) Sp.point(j, Ecur[j], { color: Math.abs(Ecur[j]) > 2 * g + 1e-9 ? 'red' : 'gold', r: j === n ? 4.5 : 3 });
      var N = c.N[n], Ns = N < 1000000000000n ? fmt(Number(N)) : fmt.sci(Number(N), 3), ty = Sp.box.t - (narrow ? 33 : 22);
      fig.mathText([{ tex: 'E', color: 'gold' }, ' = ' + fmt(Ecur[n], 3)], Sp.box.l + 2, ty, { size: 12.5, mono: true, color: Math.abs(Ecur[n]) > 2 * g + 1e-9 ? 'red' : 'fg' });
      fig.mathText(off ? ['n = ' + n] : ['n = ' + n + ',  ', { tex: 'N', color: 'gold' }, ' = ' + Ns], Sp.box.r, narrow ? ty + 19 : ty, { size: 12.5, mono: true, align: 'right' });
    };
  }
});
