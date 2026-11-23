/* A theta sum Theta_g(t) = sum over n != 0 of g(nt). The top plane shows g with a gold stick at every lattice point
   nt (n = -40..40); the bottom plane shows the weighted sum V_g(t) = t^{1/2} Theta_g(t) on a log t axis, with the
   dual side of Riemann-Roch, V_ghat(1/t) + t^{-1/2} ghat(0) - t^{1/2} g(0), dashed on top of it. For g0 and g_star,
   ghat = g. For g_c the transform has no closed form, so only V_g is drawn; it is exactly 0 for t >= 1. */
Kit.register('theta-sum-lattice', {
  tex: { g: 'g(x)', x: 'x', t: 't', inv: '1/t', Theta: '\\Theta_g(t)=\\textstyle\\sum_{n\\ne0}g(nt)', Th: '\\Theta_g(t)', V: 'V_g(t)', omit: 'n=0',
    dual: 'V_{\\hat g}(1/t)+t^{-1/2}\\hat g(0)-t^{1/2}g(0)', dualS: 'V_{\\hat g}(1/t)+\\ldots' },
  init: function (fig) {
    var PI = Math.PI, fmt = Kit.fmt, NT = 601, U = 3;
    function gc(x) {
      var x2 = x * x;
      if (x2 >= 1) return 0;
      var q = 1 - x2;
      return 2 * x2 * (x2 * x2 + 4 * x2 - 3) / (q * q * q * q) * Math.exp(-1 / q);
    }
    /* X: the sum stops once nt >= X (g is below 1e-20 there, or 0); g0, gh0: g(0) and ghat(0); dual: ghat = g. */
    var G = {
      g0: { f: function (x) { return Math.exp(-PI * x * x); }, X: 6.5, g0: 1, gh0: 1, dual: true, xw: 4, gy: [-0.15, 1.18], vy: [-0.35, 4.75], lab: [-1.7, 'sw'] },
      gs: { f: function (x) { var q = PI * x * x; return (4 * q * q - 6 * q) * Math.exp(-q); }, X: 7, g0: 0, gh0: 0, dual: true, xw: 4, gy: [-1.42, 1.1], vy: [-0.22, 2.08], lab: [-3, 'sw'] },
      gc: { f: gc, X: 1, g0: 0, gh0: 0, dual: false, xw: 1.3, gy: [-2, 6.4], vy: [-3.3, 12.2], lab: [-0.45, 'nw'] }
    };
    function theta(g, t) {
      var s = 0;
      for (var n = 1; n * t < g.X; n++) s += g.f(n * t);
      return 2 * s;
    }
    /* Theta_g(t) for the readout: below t = 1 a self-dual g uses Riemann-Roch, which avoids the rounding noise of a
       long direct sum of a tiny value; the curves below are drawn from the direct sums on both sides. */
    function thetaRead(g, t) { return g.dual && t < 1 ? (theta(g, 1 / t) + g.gh0) / t - g.g0 : theta(g, t); }
    var ts = new Float64Array(NT), tables = {};
    for (var i = 0; i < NT; i++) ts[i] = Math.exp(-U + 2 * U * i / (NT - 1));
    fig.job(function* () {                                       // V_g and its dual on the t grid, the default g first
      var keys = ['gs', 'g0', 'gc'];
      for (var j = 0; j < keys.length; j++) {
        var g = G[keys[j]], V = new Float64Array(NT), D = g.dual ? new Float64Array(NT) : null;
        for (var k = 0; k < NT; k++) {
          var t = ts[k], r = Math.sqrt(t);
          V[k] = r * theta(g, t);
          if (D) D[k] = theta(g, 1 / t) / r + g.gh0 / r - r * g.g0;
          if (k % 40 === 39) yield (j + k / NT) / keys.length;
        }
        tables[keys[j]] = { V: V, D: D };
      }
    }, { budget: 2 });

    var sel = fig.select({ label: 'Function g', value: 'gs', options: [['g0', 'Gaussian g₀'], ['gs', 'g⋆, with g(0) = ∫g = 0'], ['gc', 'compact support (bump)']] });
    var S = fig.slider({ label: 'Lattice spacing', tex: 't', min: 0.05, max: 20, scale: 'log', value: 0.6, marks: [1],
      format: function (v) { return Kit.fmt.sig(v); } });
    fig.button({ label: 't → 1/t', onClick: function () { S.set(1 / S.value); } });
    var cam = fig.follow(Math.log(S.value), { tau: 0.14 });
    var fx = fig.follow(4), fy0 = fig.follow(G.gs.gy[0]), fy1 = fig.follow(G.gs.gy[1]), fv0 = fig.follow(G.gs.vy[0]), fv1 = fig.follow(G.gs.vy[1]);
    var top = fig.plane({ x: [-4, 4], y: G.gs.gy, box: [0, 0, 1, '50%'], pad: { t: 10, r: 16, b: 22, l: 46 } });
    var bot = fig.plane({ x: [Math.exp(-U), Math.exp(U)], y: G.gs.vy, xLog: true, box: [0, '50%', 1, 1], pad: { t: 14, r: 16, b: 26, l: 46 } });
    function f6(v, exact) { var a = Math.abs(v); return v === 0 ? (exact ? '0' : '< 10⁻³⁰⁰') : a >= 1e-3 ? fmt(v, 6) : fmt.sci(v, 3); }

    return function draw() {
      var key = sel.value, g = G[key], tab = tables[key], t = Math.exp(cam.to(Math.log(S.value)).value), ti = 1 / t, nar = fig.w < 560;
      var xw = fx.to(g.xw).value;
      top.view.x0 = -xw; top.view.x1 = xw; top.view.y0 = fy0.to(g.gy[0]).value; top.view.y1 = fy1.to(g.gy[1] + (nar ? 0.45 * (g.gy[1] - g.gy[0]) : 0)).value; top.update();
      bot.view.y0 = fv0.to(g.vy[0]).value; bot.view.y1 = fv1.to(g.vy[1] + (nar ? 0.6 * (g.vy[1] - g.vy[0]) : 0)).value; bot.update();

      // Top: g and the lattice sticks.
      top.grid();
      top.axes({ yAt: 'left', xLabel: 'x', xStep: xw > 2 ? 1 : 0.5 });
      top.plot(g.f, { color: 'blue', width: 2 });
      for (var n = -40; n <= 40; n++) {
        var x = n * t;
        if (n === 0 || x < -xw || x > xw) continue;
        var y = g.f(x), px = top.X(x);
        fig.line(px, top.Y(0), px, top.Y(y), { color: 'gold', width: 2 });
        fig.circle(px, top.Y(y), 2.4, { fill: 'gold' });
      }
      var oy = top.Y(g.g0), ox = top.X(0);
      if (g.g0) fig.line(ox, top.Y(0), ox, oy, { color: 'muted', width: 1, dash: [2, 3] });
      fig.circle(ox, oy, 4.5, { fill: 'stage', ring: 'muted', ringWidth: 1.6 });
      fig.label('omit', ox + 6, oy - 4, { anchor: 'sw', color: 'muted', size: 12 });
      var Th = thetaRead(g, t);
      var pr = fig.panel([[{ tex: nar ? 'Th' : 'Theta' }, f6(Th, key === 'gc'), 'gold'], [{ tex: 'V' }, f6(Math.sqrt(t) * Th, key === 'gc'), 'gold']],
        { plane: top, prefer: ['ne', 'nw'] });
      // name g on its left flank, or on the mirror-image flank (g is even) when the readout covers the left one
      var lx = top.X(g.lab[0]), ly = top.Y(g.f(g.lab[0])), hit = lx < pr.x + pr.w + 4 && lx + 40 > pr.x && ly > pr.y - 8 && ly - 24 < pr.y + pr.h;
      var anc = hit ? g.lab[1].replace('w', 'e') : g.lab[1];
      top.label('g', hit ? -g.lab[0] : g.lab[0], g.f(g.lab[0]), { anchor: anc, dx: hit ? -4 : 4, dy: g.lab[1] === 'sw' ? -4 : 6, color: 'blue', size: 13 });

      // Bottom: V_g(t) and the dual side, with markers at t and 1/t.
      bot.grid({ xTicks: [0.05, 0.1, 0.2, 0.5, 1, 2, 5, 10, 20] });
      bot.hline(0, { color: 'muted', width: 1 });
      bot.axes({ edge: true, xTicks: [0.05, 0.1, 0.2, 0.5, 1, 2, 5, 10, 20], xLabel: 't', xFormat: String });
      if (tab) {
        bot.path(ts, tab.V, { color: 'gold', width: 3 });
        if (tab.D) bot.path(ts, tab.D, { color: 'blue', width: 1.8, dash: [7, 5] });
      }
      if (key === 'gc') bot.text('exactly 0 for t ≥ 1', 19, 0, { color: 'muted', size: 12, align: 'right', dy: -9 });
      var b = bot.box, Vt = Math.sqrt(t) * thetaRead(g, t), Vi = Math.sqrt(ti) * thetaRead(g, ti);
      bot.vline(t, { color: 'fg', width: 1, alpha: 0.5, dash: [3, 4] });
      bot.vline(ti, { color: 'muted', width: 1, dash: [3, 4] });
      bot.segment(t, Vt, ti, Vi, { color: 'muted', width: 1, dash: [2, 3] });
      fig.circle(bot.X(ti), bot.Y(Vi), 4.5, { fill: 'stage', ring: 'gold', ringWidth: 2 });
      fig.circle(bot.X(t), bot.Y(Vt), 5, { fill: 'gold', ring: 'stage', ringWidth: 2 });
      fig.label('t', bot.X(t), b.t + 1, { anchor: 'n', color: 'fg', size: 12, id: 'mk-t' });
      if (Math.abs(Math.log(t)) > 0.12) fig.label('inv', bot.X(ti), b.t + 1, { anchor: 'n', color: 'muted', size: 12, id: 'mk-inv' });
      fig.legend([{ color: 'gold', tex: 'V', width: 3 }, g.dual && { color: 'blue', tex: nar ? 'dualS' : 'dual', dash: [7, 5], width: 1.8 }],
        { plane: bot, prefer: ['ne', 'nw'], size: nar ? 11 : 12.5 });
    };
  }
});
