/* The pigeonhole of lemma window1 on a logarithmic axis in u = log x, from U = 100 down. Each bad point a (red,
   draggable) spoils [a, B a); the recursion of the proof looks at (U'/(2B), U'], and if a point lies there it drops
   that point and restarts at U'/(2B), else it returns the window [U'/2, U']. The ladder above the axis shows each
   step; the blue band is the window [y, 2y], which every frame is checked to be clean and above the floor
   U / (2^(R+2) B^R). The left end of the axis is U / 10^4, moved further left when the floor or a point needs it. */
Kit.register('scale-window', {
  tex: { win: '[y, 2y]', Y: 'Y', Y2: 'Y^2', u: 'u', x: 'x', floor: 'U/2^{R+2}B^R',
    L0: 'U', L1: 'U/(2B)', L2: 'U/(2B)^2', L3: 'U/(2B)^3', L4: 'U/(2B)^4', L5: 'U/(2B)^5',
    winline: '[Y, Y^2] = [e^{y}, e^{2y}]',
    vw: '\\textstyle\\sum_{\\ell}\\sum_{k<x^{401}}\\log\\#\\,\\text{Sha}^1 \\le e^{x^{\\varepsilon}/2}\\ \\text{for } x \\in [Y, Y^2]',
    vwS: '\\textstyle\\sum_{\\ell,k}\\log\\#\\,\\text{Sha}^1 \\le e^{x^{\\varepsilon}/2}' },
  init: function (fig) {
    var fmt = Kit.fmt, U = 100, RMAX = 5, START = [30, 0.5, 3, 0.04, 70];
    /* The recursion of window1: the steps it takes and the window it returns. */
    function search(pts, B) {
      var rem = pts.slice(), Uc = U, steps = [];
      for (;;) {
        var hit = -1;
        for (var i = 0; i < rem.length; i++) if (rem[i] > Uc / (2 * B) && rem[i] <= Uc && (hit < 0 || rem[i] > rem[hit])) hit = i;
        steps.push({ U: Uc, a: hit >= 0 ? rem[hit] : null });
        if (hit < 0) return { y: Uc / 2, steps: steps };
        rem.splice(hit, 1); Uc /= 2 * B;
      }
    }
    (function check() {                                                    // the chapter's example
      var a = search([30, 0.5], 4).y, b = search([30, 5], 4).y;
      if (a !== 6.25 || b !== 0.78125) console.error('scale-window: windows ' + a + ' and ' + b + ', chapter says 6.25 and 0.78125');
    })();

    var Bs = fig.slider({ label: 'Ratio', min: 1, max: 16, step: 0.5, value: 4, format: function (v) { return 'B = ' + fmt(v, v % 1 ? 1 : 0); } });
    var Rs = fig.slider({ label: 'Bad points', min: 0, max: RMAX, step: 1, value: 2, format: function (v) { return 'R = ' + v; } });
    function floorOf() { return U / (Math.pow(2, Rs.value + 2) * Math.pow(Bs.value, Rs.value)); }
    function lowest() { return Math.min(U * 1e-4, floorOf() / 3); }
    var P = fig.plane({ x: [U * 1e-4, U], y: [-0.62, 4.6], xLog: true, pad: { t: 8, r: 18, b: 66, l: 40 } });
    var pts = START.map(function (v) {
      return fig.drag({ plane: P, x: v, y: 0, r: 6, color: 'red', constrain: function (x) { return [Kit.clamp(x, lowest(), U), 0]; } });
    });
    fig.button({ label: 'Worst case', onClick: function () {
      for (var i = 0; i < Rs.value; i++) pts[i].x = 0.97 * U / Math.pow(2 * Bs.value, i);
    } });
    var lo = fig.follow(Math.log10(U * 1e-4), { tau: 0.1 }), wy = fig.follow(Math.log10(6.25), { tau: 0.075 }), top = fig.follow(4.6, { tau: 0.1 });

    return function draw() {
      var B = Bs.value, R = Rs.value, i, s, bad = [], narrow = fig.w < 560;
      for (i = 0; i < RMAX; i++) { pts[i].show(i < R); if (i < R) bad.push(pts[i].x); }
      var res = search(bad, B), fl = floorOf(), y = res.y;
      if (y < fl * (1 - 1e-12)) console.error('scale-window: window below the floor');
      bad.forEach(function (a) { if (a <= 2 * y && B * a > y) console.error('scale-window: ' + a + ' spoils the window'); });
      P.view.x0 = Math.pow(10, lo.to(Math.log10(Math.min(lowest(), Math.min.apply(null, bad.concat([U])) / 1.5))).value);
      P.view.y1 = top.to(R + 2.6).value; P.update();
      var b = P.box, yw = Math.pow(10, wy.to(Math.log10(y)).value), row = function (k) { return 1.2 + (R - k); };

      // spoiled intervals [a, B a) and the window [y, 2y] on the axis
      bad.forEach(function (a) { P.clip(function () { fig.rect(P.X(a), P.Y(0.36), P.X(Math.min(B * a, U * 2)) - P.X(a), P.Y(-0.36) - P.Y(0.36), { fill: 'red', alpha: 0.17 }); }); });
      fig.rect(P.X(yw), P.Y(row(res.steps.length - 1)), P.X(2 * yw) - P.X(yw), P.Y(-0.52) - P.Y(row(res.steps.length - 1)), { fill: 'blue', alpha: 0.08 });
      fig.rect(P.X(yw), P.Y(0.52), P.X(2 * yw) - P.X(yw), P.Y(-0.52) - P.Y(0.52), { fill: 'blue', alpha: 0.3, color: 'blue', width: 1.5 });
      P.axes({ origin: [P.v.x0, 0], y: false, format: function (v) { return v >= 1 ? fmt(v, 0) : v >= 1e-3 ? String(Number(v.toPrecision(2))) : fmt.sci(v); } });
      fig.label('u', b.l - 8, P.Y(0), { anchor: 'e', color: 'muted', size: 13 });
      P.label('win', Math.sqrt(2) * yw, 0.52, { anchor: 's', color: 'blue', size: 12.5, dy: -2 });

      // the floor
      P.vline(fl, { color: 'muted', width: 1.2, dash: [4, 4] });
      var clash = Math.abs(P.X(fl) - P.X(Math.sqrt(2) * yw)) < 150;                // keep the label off the window's label
      if (!narrow) P.label('floor', fl, 0.55, { anchor: clash ? 'se' : 'sw', color: 'muted', size: 11.5, dx: clash ? -4 : 4 });

      // the ladder of the recursion
      res.steps.forEach(function (st, k) {
        var ry = row(k), last = k === res.steps.length - 1, l0 = st.U / (2 * B), c = last ? 'blue' : 'muted';
        var x0 = Math.max(P.X(l0), b.l), x1 = P.X(st.U), h = P.Y(ry - 0.27) - P.Y(ry + 0.27);
        if (last) fig.rect(P.X(st.U / 2), P.Y(ry + 0.27), P.X(st.U) - P.X(st.U / 2), h, { fill: 'blue', alpha: 0.3 });
        fig.rect(x0, P.Y(ry + 0.27), x1 - x0, h, { color: c, width: last ? 1.5 : 1 });
        fig.line(x1, P.Y(ry + 0.4), x1, P.Y(ry - 0.4), { color: 'muted', width: 1.5 });
        if (k <= 5 && x0 - 6 > b.l + 30) fig.label('L' + k, x0 - 6, P.Y(ry), { anchor: 'e', color: 'muted', size: 11.5 });
        if (st.a != null) {
          fig.line(P.X(st.a), P.Y(ry), P.X(st.a), P.Y(0), { color: 'red', width: 1, dash: [2, 3], alpha: 0.6 });
          fig.circle(P.X(st.a), P.Y(ry), 3, { fill: 'red' });
          fig.circle(P.X(st.a), P.Y(ry), 9, { fill: false, ring: 'red', ringWidth: 1.5 });
        }
      });

      // the scales x = e^u at the window ends, and what holds there
      var yl = b.b + 34;
      fig.label('x', b.l - 8, yl, { anchor: 'e', color: 'muted', size: 13 });
      fig.line(P.X(yw), P.Y(-0.52), P.X(yw), yl - 10, { color: 'blue', width: 1, alpha: 0.6 });
      fig.line(P.X(2 * yw), P.Y(-0.52), P.X(2 * yw), yl - 10, { color: 'blue', width: 1, alpha: 0.6 });
      var t1 = ' ≈ ' + fmt.sig(Math.exp(y)), t2 = ' ≈ ' + fmt.sig(Math.exp(2 * y));
      var w1 = fig.labelSize('Y', 12).w + fig.measure(t1, 12), w2 = fig.labelSize('Y2', 12).w + fig.measure(t2, 12);
      var x2 = Math.min(P.X(2 * yw) + 4, fig.w - 4 - w2), x1 = Math.max(4 + w1, Math.min(P.X(yw) - 4, x2 - 12));
      fig.mathText([{ tex: 'Y' }, t1], x1, yl, { size: 12, color: 'blue', align: 'right' });
      fig.mathText([{ tex: 'Y2' }, t2], Math.max(x2, x1 + 12), yl, { size: 12, color: 'blue' });
      var by = fig.h - 11, vk = narrow ? 'vwS' : 'vw';
      fig.label('winline', 4, by, { anchor: 'w', color: 'fg', size: 12.5 });
      fig.label(vk, fig.w - 4, by, { anchor: 'e', color: 'fg', size: 12.5 });

      fig.panel([narrow ? null : ['B', fmt(B, B % 1 ? 1 : 0)], narrow ? null : ['R', String(R)], [{ tex: 'win' }, '[' + fmt.sig(y) + ', ' + fmt.sig(2 * y) + ']', 'blue'],
        ['floor', fmt.sig(fl)], ['restarts', String(res.steps.length - 1)]], { plane: P, at: 'nw', compact: narrow ? false : undefined, size: narrow ? 10.5 : undefined });
    };
  }
});
