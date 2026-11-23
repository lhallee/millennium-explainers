/* The arrows n^{-s} = n^{-sigma} e^{-i t log n} for n = 1..12. Left, the s-plane with a draggable s; right, the
   arrows from the origin. sigma sets the lengths and t the angles. Two picked arrows m and k show the arrow for mk:
   two spiral arcs add their angles, and a dashed copy of arrow k turned by the angle of m lies along arrow mk, which
   is that copy shrunk by the length of arrow m. */
Kit.register('complex-arrows', {
  tex: { s: 's', sigma: '\\sigma', t: 't', one: '\\sigma = 1', ns: 'n^{-s}' },
  init: function (fig) {
    var fmt = Kit.fmt, NMAX = 12, TMAX = 30, LMAX = Math.log(1 + TMAX);
    var PRIME = [false, false, true, true, false, true, false, true, false, false, false, true, false];
    var sg = 1, tt = 3, picked = [2, 3], anim = null;   // starts at 1 + 3i, where the arrows for n up to 12 are all long enough to see
    var TR = new Float64Array(NMAX + 1), TI = new Float64Array(NMAX + 1);
    var go = fig.tween(1);
    var logT = fig.toggle({ label: 'Log scale for t', value: false });
    function preset(a, b) { anim = { s0: sg, t0: tt, s1: a, t1: b }; go.set(0); go.to(1, 900); }
    fig.button({ label: 's = 2 + 3i', onClick: function () { preset(2, 3); } });
    fig.button({ label: 's = ½ + 14.13i', onClick: function () { preset(0.5, Kit.zeros[0]); } });
    fig.button({ label: 's = 3', onClick: function () { preset(3, 0); } });
    fig.onReset = function () { sg = 1; tt = 3; picked = [2, 3]; anim = null; go.set(1); };

    var uOf = function (t) { return logT.value ? Math.sign(t) * Math.log(1 + Math.abs(t)) : t; };
    var tOf = function (u) { return logT.value ? Math.sign(u) * (Math.exp(Math.abs(u)) - 1) : u; };
    var split = function (w) { return Math.round(w * 0.36); };
    var S = fig.plane({ x: [-1, 3], y: [-TMAX, TMAX], pad: { t: 12, r: 14, b: 26, l: 36 }, box: function (w, h) { return [0, 0, split(w), h]; } });
    var W = fig.plane({ x: [-1.2, 1.2], y: [-1.2, 1.2], equal: true, pad: 12, box: function (w, h) { return [split(w), 0, w, h]; } });
    var fit = Math.log(0.3), cam = fig.follow(fit, { tau: 0.15 });
    var sd = fig.drag({ plane: S, x: sg, y: tt, r: 7, color: 'fg', label: 's',
      constrain: function (x, y) { var um = logT.value ? LMAX : TMAX; return [Kit.clamp(x, -1, 3), Kit.clamp(y, -um, um)]; },
      onDrag: function (x, y) { anim = null; sg = x; tt = tOf(y); } });

    /* n^{-s} for the current s: [re, im, length, angle], the angle -t log n not reduced mod 2 pi. */
    var sig3 = function (v) { return fmt(v, Math.max(0, 2 - Math.floor(Math.log10(v)))); };   // three significant digits
    function arrow(n) { var L = Math.log(n), r = Math.exp(-sg * L), a = -tt * L; return [r * Math.cos(a), r * Math.sin(a), r, a]; }
    function nearest(x, y) {
      var best = 0, bd = 16, px = W.X(x), py = W.Y(y);
      for (var n = 2; n <= NMAX; n++) { var d = Math.hypot(W.X(TR[n]) - px, W.Y(TI[n]) - py); if (d < bd) { bd = d; best = n; } }
      return best;
    }
    fig.probe({ plane: W, crosshair: false,
      snap: function (x, y) { var n = nearest(x, y); return n ? [TR[n], TI[n]] : null; },
      rows: function (x, y, pr) {
        var n = pr.snapped ? nearest(x, y) : 0;
        if (!n) return null;
        var a = arrow(n);
        return [['n', String(n)], [{ tex: 'ns' }, fmt.complex(a[0], a[1], 4)], ['length', fmt(a[2], 4)], ['angle', fmt(a[3], 3)]];
      },
      pick: function (x, y) {
        var n = nearest(x, y);
        if (!n) return;
        var i = picked.indexOf(n);
        if (i >= 0) picked.splice(i, 1); else { picked.push(n); if (picked.length > 2) picked.shift(); }
      } });

    /* An arc from angle a0 to a1 around the origin of W, at pixel radius rho growing 5 px per turn, ending in a head. */
    function arc(a0, a1, rho, color) {
      var ctx = fig.ctx, cx = W.X(0), cy = W.Y(0), n = Math.max(2, Math.ceil(Math.abs(a1 - a0) * 16)), px = 0, py = 0, qx = 0, qy = 0;
      fig.stroke({ color: color, width: 1.6 });
      ctx.beginPath();
      for (var i = 0; i <= n; i++) {
        var a = a0 + (a1 - a0) * i / n, r = rho + 5 * Math.abs(a - a0) / (2 * Math.PI);
        qx = px; qy = py; px = cx + r * Math.cos(a); py = cy - r * Math.sin(a);
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.stroke();
      if (Math.abs(a1 - a0) > 0.15) fig.arrow(qx, qy, px, py, { color: color, width: 1.6, head: 6 });
    }

    return function draw() {
      if (anim) { sg = Kit.lerp(anim.s0, anim.s1, go.value); tt = Kit.lerp(anim.t0, anim.t1, go.value); if (!go.active) anim = null; }
      var um = logT.value ? LMAX : TMAX, narrow = fig.w < 560;
      S.view.y0 = -um; S.view.y1 = um; S.update();
      sd.x = sg; sd.y = uOf(tt);

      // The s-plane.
      var yt = logT.value ? [-30, -10, -3, -1, 0, 1, 3, 10, 30].map(function (v) { return [uOf(v), fmt(v)]; }) : null;
      S.grid({ xStep: 1, yStep: 10, yTicks: yt });
      S.axes({ xStep: 1, yStep: 10, yTicks: yt });
      fig.label('sigma', S.box.r - 2, S.Y(0) - 5, { anchor: 'se', color: 'muted', size: 13 });
      fig.label('t', S.X(0) + 7, S.box.t + 1, { anchor: 'nw', color: 'muted', size: 13 });
      S.vline(1, { color: 'muted', width: 1.5, dash: [6, 4] });
      S.label('one', 1, -um, { anchor: 'sw', dx: 5, dy: -6, color: 'muted', size: 12 });
      if (!narrow) fig.panel([['s', fmt.complex(sg, tt, 2)]], { plane: S, at: 'ne', id: 's' });

      // The arrows.
      // The window fits the arrows for n >= 2 (arrow 1 is always 1), but holds still while s is dragged, so the
      // reader sees the arrows shrink and grow; it eases to the new fit on release.
      var big = 0;
      for (var n = 1; n <= NMAX; n++) { var a = arrow(n); TR[n] = a[0]; TI[n] = a[1]; if (n > 1) big = Math.max(big, a[2]); }
      if (fig.activeDrag !== sd) fit = Math.log(1.2 * big);
      var R = Math.exp(cam.to(fit).value);
      W.view.x0 = -R; W.view.x1 = R; W.view.y0 = -R; W.view.y1 = R; W.update();
      var wst = Kit.math.niceStep(W.v.x1 - W.v.x0, W.box.w, narrow ? 80 : 120);
      W.grid({ xStep: wst, yStep: wst });
      W.axes({ color: 'muted', size: 11, xStep: wst, yStep: wst });
      W.plot(function (x) { return Math.sqrt(Math.max(0, 1 - x * x)); }, { color: 'muted', width: 1, from: -1, to: 1, alpha: 0.7 });
      W.plot(function (x) { return -Math.sqrt(Math.max(0, 1 - x * x)); }, { color: 'muted', width: 1, from: -1, to: 1, alpha: 0.7 });
      var m = picked[0] || 0, k = picked[1] || 0, mk = m && k ? m * k : 0;
      var ox = W.X(0), oy = W.Y(0), placed = [];
      var order = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].sort(function (p, q) { return (picked.indexOf(q) >= 0 || q === mk) - (picked.indexOf(p) >= 0 || p === mk); });
      for (var oi = NMAX - 1; oi >= 0; oi--) {   // lowest priority first, so the picked arrows and the product sit on top
        var j = order[oi], on = picked.indexOf(j) >= 0, hot = j === mk;
        var len = Math.hypot(W.X(TR[j]) - ox, W.Y(TI[j]) - oy), head = Math.min(9, 0.45 * len);
        var color = hot ? 'red' : j === 1 ? 'muted' : PRIME[j] ? 'gold' : 'fg';
        var style = { color: color, width: on || hot ? 3 : PRIME[j] ? 2 : 1.5, head: head, dash: PRIME[j] || j === 1 || hot || on ? null : [4, 3],
          alpha: on || hot || !mk ? 1 : 0.4 };
        if (len < 2) fig.circle(W.X(TR[j]), W.Y(TI[j]), 1.6, { fill: color, alpha: style.alpha });
        else W.clip(function () { fig.arrow(ox, oy, W.X(TR[j]), W.Y(TI[j]), style); });
        fig.occSeg(ox, oy, W.X(TR[j]), W.Y(TI[j]));
      }
      if (mk > NMAX) {   // the product lies beyond the twelve arrows: draw it too
        var pa = arrow(mk), pl = Math.hypot(W.X(pa[0]) - ox, W.Y(pa[1]) - oy);
        fig.arrow(ox, oy, W.X(pa[0]), W.Y(pa[1]), { color: 'red', width: 3, head: Math.min(9, 0.45 * pl) });
        TR[0] = pa[0]; TI[0] = pa[1];
      }
      if (m && k) {
        var am = arrow(m), ak = arrow(k), pm = arrow(mk), ghost = [ak[2] * Math.cos(am[3] + ak[3]), ak[2] * Math.sin(am[3] + ak[3])];
        W.segment(0, 0, ghost[0], ghost[1], { color: 'red', width: 1.6, dash: [5, 4], alpha: 0.8 });
        W.point(ghost[0], ghost[1], { color: 'red', r: 2.5, ring: false });
        if (Math.abs(am[3] + ak[3]) < 6 * Math.PI) { arc(0, am[3], 22, PRIME[m] ? 'gold' : 'fg'); arc(am[3], am[3] + ak[3], 36, PRIME[k] ? 'gold' : 'fg'); }
        var dg = narrow ? 2 : 3, sum = fmt(am[3], dg) + (ak[3] < 0 ? ' − ' + fmt(-ak[3], dg) : ' + ' + fmt(ak[3], dg)) + ' = ' + fmt(pm[3], dg);
        fig.panel([narrow ? ['s', fmt.complex(sg, tt, 2)] : ['arrows', m + ' and ' + k + ' make ' + mk, 'red'], ['angles', sum],
          ['lengths', sig3(am[2]) + ' × ' + sig3(ak[2]) + ' = ' + sig3(pm[2])]],
          { plane: W, id: 'prod', prefer: ['sw', 'nw', 'se', 'ne'], hint: 'click two arrows to multiply them' });
      } else {
        fig.panel([narrow ? ['s', fmt.complex(sg, tt, 2)] : null, ['picked', picked.length ? String(picked[0]) : 'none']],
          { plane: W, id: 'prod', prefer: ['sw', 'nw', 'se', 'ne'], hint: 'click two arrows to multiply them' });
      }

      // Number labels at the tips, picked and product first, skipping any that would collide.
      var tips = order.map(function (n) { return [n, TR[n], TI[n]]; });
      if (mk > NMAX) tips.unshift([mk, TR[0], TI[0]]);
      tips.forEach(function (e) {
        var px = W.X(e[1]), py = W.Y(e[2]), d = Math.hypot(px - ox, py - oy) || 1;
        var lx = px + 11 * (px - ox) / d, ly = py + 11 * (py - oy) / d;
        for (var q = 0; q < placed.length; q++) if (Math.abs(placed[q][0] - lx) < 13 && Math.abs(placed[q][1] - ly) < 12) return;
        if (!W.inside(lx, ly)) return;
        placed.push([lx, ly]);
        var hot = e[0] === mk, on = picked.indexOf(e[0]) >= 0;
        fig.text(String(e[0]), lx, ly, { color: hot ? 'red' : e[0] === 1 ? 'muted' : e[0] <= NMAX && PRIME[e[0]] ? 'gold' : 'fg', size: on || hot ? 12.5 : 11, weight: on || hot ? 700 : 500, align: 'center', baseline: 'middle' });
      });
    };
  }
});
