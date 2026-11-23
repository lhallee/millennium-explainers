/* The wave of one zero rho = beta + i gamma: W(x) = -(2 x^beta / |rho|) cos(gamma log x - arg rho), drawn in u = log x
   against the critical-line envelope 2 sqrt(x) / |rho|. Where beta > 1/2 the wave's envelope leaves that envelope (red).
   A strip under the plot is a second handle for gamma that snaps to the zero ordinates. */
Kit.register('zero-wave', {
  tex: { wave: 'W_\\rho(x)', crit: '2\\sqrt{x}/\\lvert\\rho\\rvert', env: '2x^{\\beta}/\\lvert\\rho\\rvert', mirror: 'W_{1-\\bar\\rho}(x)',
    u: '\\log x', x: 'x', gamma: '\\gamma' },
  init: function (fig) {
    var U0 = 0.5, U1 = 8, G0 = 5, G1 = 80, YCAP = 60;
    var beta = fig.slider({ label: 'Real part', min: 0.3, max: 0.9, step: 0.01, value: 0.5, format: function (v) { return 'β = ' + v.toFixed(2); } });
    var gam = fig.slider({ label: 'Height', min: G0, max: G1, step: 0.05, value: Kit.zeros[0], format: function (v) { return 'γ = ' + v.toFixed(2); } });
    var mirror = fig.toggle({ label: 'Show mirror zero 1 − β', value: false });
    var P = fig.plane({ x: [U0, U1], y: [-8, 8], pad: { t: 10, r: 14, b: 46, l: 50 } });
    var S = fig.plane({ x: [G0, G1], y: [0, 1], pad: { t: 4, r: 14, b: 14, l: 50 } });
    var handle = fig.drag({ plane: S, x: gam.value, y: 0.5, r: 6, color: 'teal',
      constrain: function (x) {
        x = Kit.clamp(x, G0, G1);
        for (var i = 0; i < Kit.zeros.length && Kit.zeros[i] <= G1; i++) if (Math.abs(S.X(Kit.zeros[i]) - S.X(x)) < 5) return [Kit.zeros[i], 0.5];
        return [x, 0.5];
      },
      onDrag: function (x) { gam.set(x); } });
    var yRange = fig.tween(8), lastTarget = 0;
    var us = new Float64Array(3200), w1 = new Float64Array(3200), w2 = new Float64Array(3200);

    /* Wave of beta + i gamma sampled on the grid us[0..n). */
    function wave(out, n, b, g) {
      var r = Math.hypot(b, g), ph = Math.atan2(g, b);
      for (var i = 0; i < n; i++) out[i] = -2 * Math.exp(b * us[i]) / r * Math.cos(g * us[i] - ph);
    }

    return function draw() {
      var b = beta.value, g = gam.value, r = Math.hypot(b, g), r2 = Math.hypot(1 - b, g);
      var env = function (bb, rr) { return function (u) { return 2 * Math.exp(bb * u) / rr; }; };
      var target = Kit.clamp(1.12 * Math.max(env(b, r)(U1), env(0.5, r)(U1), mirror.value ? env(1 - b, r2)(U1) : 0), 1, YCAP);
      if (target !== lastTarget) { lastTarget = target; yRange.to(target, 260, 'outCubic'); }
      var ym = yRange.value;
      var sH = Kit.clamp(fig.h * 0.13, 34, 52);
      P.frac = [0, 0, 1, 1 - sH / fig.h]; S.frac = [0, 1 - sH / fig.h, 1, 1];
      P.view.y0 = -ym; P.view.y1 = ym; P.update(); S.update();
      handle.x = g;
      var n = Kit.clamp(Math.ceil(g * (U1 - U0) / (2 * Math.PI) * 14), 300, 3200);
      for (var i = 0; i < n; i++) us[i] = U0 + (U1 - U0) * i / (n - 1);

      var bx = P.box;
      P.grid({ xStep: 1 });
      P.axes({ origin: [U0, 0], x: false });
      P.hline(0, { color: 'muted', width: 1 });
      for (var k = 1; k <= 8; k++) fig.text(String(k), P.X(k), bx.b + 14, { color: 'muted', size: 11.5, align: 'center' });
      [2, 10, 100, 1000].forEach(function (v) {
        fig.line(P.X(Math.log(v)), bx.b + 20, P.X(Math.log(v)), bx.b + 25, { color: 'muted', width: 1 });
        fig.text(String(v), P.X(Math.log(v)), bx.b + 37, { color: 'muted', size: 11.5, align: 'center' });
      });
      fig.label('u', bx.l - 8, bx.b + 12, { anchor: 'e', color: 'muted', size: 13 });
      fig.label('x', bx.l - 8, bx.b + 32, { anchor: 'e', color: 'muted', size: 13 });

      if (b > 0.5) {
        P.fillBetween(env(b, r), env(0.5, r), U0, U1, { color: 'red', alpha: 0.2 });
        P.fillBetween(function (u) { return -env(0.5, r)(u); }, function (u) { return -env(b, r)(u); }, U0, U1, { color: 'red', alpha: 0.2 });
      }
      [1, -1].forEach(function (s) {
        P.plot(function (u) { return s * env(0.5, r)(u); }, { color: 'violet', width: 1.6 });
        P.plot(function (u) { return s * env(b, r)(u); }, { color: 'teal', width: 1.2, dash: [5, 4] });
      });
      if (mirror.value) { wave(w2, n, 1 - b, g); P.path(us.subarray(0, n), w2.subarray(0, n), { color: 'fg', width: 1.5, alpha: 0.9 }); }
      wave(w1, n, b, g);
      P.path(us.subarray(0, n), w1.subarray(0, n), { color: 'teal', width: 2.3 });

      var lx = bx.l + 12, ly = bx.t + 14;
      [['teal', 'wave', null, 2.3], ['teal', 'env', [5, 4], 1.2], ['violet', 'crit', null, 1.6], ['fg', 'mirror', null, 1.5]].forEach(function (e, i) {
        if (e[1] === 'mirror' && !mirror.value) return;
        fig.line(lx, ly + 20 * i, lx + 22, ly + 20 * i, { color: e[0], width: e[3], dash: e[2] });
        fig.label(e[1], lx + 28, ly + 20 * i, { anchor: 'w', color: e[0], size: 13 });
      });
      if (bx.h > 260) fig.text('crests every ×' + Math.exp(2 * Math.PI / g).toFixed(2) + ' in x', bx.l + 12, bx.t + 14 + 20 * (mirror.value ? 4 : 3) + 4, { size: 12, color: 'muted' });
      if (bx.h > 260) fig.text('vs √x envelope at x = 1000: ×' + Math.pow(1000, b - 0.5).toFixed(2), bx.l + 12, bx.t + 14 + 20 * (mirror.value ? 4 : 3) + 20, { size: 12, color: b > 0.5 ? 'red' : 'muted', weight: b > 0.5 ? 700 : 500 });

      var sb = S.box, mid = S.Y(0.5);
      fig.line(sb.l, mid, sb.r, mid, { color: 'muted', width: 1 });
      for (var j = 0; j < Kit.zeros.length && Kit.zeros[j] <= G1; j++) fig.line(S.X(Kit.zeros[j]), mid - 7, S.X(Kit.zeros[j]), mid + 7, { color: 'teal', width: 1.5, alpha: 0.8 });
      [20, 40, 60, 80].forEach(function (v) { fig.text(String(v), S.X(v), sb.b + 12, { color: 'muted', size: 11, align: 'center' }); });
      fig.label('gamma', sb.l - 10, mid, { anchor: 'e', color: 'muted', size: 13 });
    };
  }
});
