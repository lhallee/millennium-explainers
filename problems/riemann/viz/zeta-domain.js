/* Domain coloring of zeta on sigma in [-8, 4], t in [-3, 36], with pan and zoom. A draggable probe s carries a small
   loop (a circle of fixed screen radius); the readout gives zeta(s) and the winding number of zeta around the loop, the
   change of arg zeta along it divided by 2 pi, which counts zeros minus poles inside (argument principle). Hovering a
   feature names it. Toggles tint the half-plane where the series converges and the critical strip. */
Kit.register('zeta-domain', {
  tex: { s: 's', zs: '\\zeta(s)', half: '\\sigma=\\tfrac12' },
  init: function (fig) {
    var M = Kit.math, fmt = Kit.fmt, Z = Kit.zeros, K = 96, LOOP = 26;
    fig.toggle({ label: 'Where the series converges', value: false, onInput: function (v) { ca.to(v ? 1 : 0, 300); } });
    fig.toggle({ label: 'Critical strip', value: false, onInput: function (v) { sa.to(v ? 1 : 0, 300); } });
    var ca = fig.tween(0), sa = fig.tween(0);
    fig.onReset = function () { ca.set(0); sa.set(0); };
    var P = fig.plane({ x: [-8, 4], y: [-3, 36], panZoom: true, pad: { t: 10, r: 12, b: 26, l: 38 },
      box: function (w, h) { return [0, 0, w, w < 560 ? h - 24 : h]; } });           // phone width: the readout goes under the plane
    var s = fig.drag({ plane: P, x: 0.62, y: 14.8, r: 6, color: 'fg', label: 's', labelAnchor: 'sw' });
    var val = [0, 0], w = [0, 0], key = '', wind = 0;
    var zeta = function (x, y, out) { M.zetaInto(x, y, out); };

    /* The named features near a screen point: the pole, a trivial zero, or a nontrivial zero, within 14 px. */
    function feature(x, y) {
      var best = null, bd = 14, v = P.v;
      function consider(fx, fy, name, where) { var d = Math.hypot(P.X(fx) - P.X(x), P.Y(fy) - P.Y(y)); if (d < bd) { bd = d; best = [fx, fy, name, where]; } }
      consider(1, 0, 'pole', 'residue 1 at s = 1');
      for (var k = 2; -k >= v.x0 - 1; k += 2) if (-k <= v.x1 + 1) consider(-k, 0, 'trivial zero', 's = ' + fmt(-k));
      var lo = Kit.lowerBound(Z, Math.max(0, Math.min(Math.abs(v.y0), Math.abs(v.y1)) - 1));
      for (var i = lo; i < Z.length && Z[i] <= Math.max(Math.abs(v.y0), Math.abs(v.y1)) + 1; i++) {
        consider(0.5, Z[i], 'nontrivial zero', '½ + ' + Z[i].toFixed(4) + 'i');
        consider(0.5, -Z[i], 'nontrivial zero', '½ − ' + Z[i].toFixed(4) + 'i');
      }
      return best;
    }
    var hover = null;
    fig.probe({ plane: P, crosshair: false,
      snap: function (x, y) { hover = feature(x, y); return hover ? [hover[0], hover[1]] : null; },
      rows: function () { return hover ? [[hover[2], hover[3]]] : null; } });

    return function draw() {
      var b = P.box, v = P.v;
      P.domain(zeta, { rev: 'zeta', coarse: 240, finest: 3, budget: 2 });   // 2 ms of sharpening per frame keeps a frame under 4 ms
      if (ca.value > 0.01 && v.x1 > 1) P.fillBetween(v.y1, v.y0, 1, v.x1, { color: 'gold', alpha: 0.45 * ca.value });
      if (sa.value > 0.01) P.fillBetween(v.y1, v.y0, 0, 1, { color: 'violet', alpha: 0.4 * sa.value });
      P.hline(0, { color: 'muted', width: 1.2 });
      P.vline(1, { color: 'stage', width: 3.5, alpha: 0.5 });
      P.vline(1, { color: 'fg', width: 1.2, dash: [5, 4] });
      P.vline(0.5, { color: 'stage', width: 3.5, alpha: 0.6 });
      P.vline(0.5, { color: 'violet', width: 1.8 });
      P.zeros({ r: 3.6, ring: 'stage', ringWidth: 1.5 });
      for (var k = 2; -k >= v.x0; k += 2) if (-k <= v.x1) fig.circle(P.X(-k), P.Y(0), 4.5, { fill: false, ring: 'teal', ringWidth: 2 });
      P.axes({ edge: true, size: 11 });
      var taken = -1e9;                                                              // right edge of the last tag, to stack the next one under it
      var tag = function (text, x, color, a) {
        var tw = fig.measure(text, 11.5) + 10, px = Kit.clamp(P.X(x), b.l + tw / 2 + 2, b.r - tw / 2 - 2), y = b.t + 6;
        if (px - tw / 2 < taken + 4) y += 22;
        taken = px + tw / 2;
        fig.rect(px - tw / 2, y, tw, 18, { fill: 'stage', alpha: 0.85 * a });
        fig.text(text, px, y + 13, { color: color, size: 11.5, align: 'center', alpha: a });
      };
      if (sa.value > 0.01 && v.x0 < 0.5 && v.x1 > 0.5) tag('critical strip', 0.5, 'violet', sa.value);
      if (ca.value > 0.01 && v.x1 > 1.5) tag('series converges', (Math.max(1, v.x0) + v.x1) / 2, 'gold', ca.value);
      if (v.x0 < 1 && v.x1 > 1) fig.circle(P.X(1), P.Y(0), 5, { fill: false, ring: 'fg', ringWidth: 1.8 });
      if (sa.value < 0.01 && v.x0 < 0.5 && v.x1 > 0.5) {
        var ls = fig.labelSize('half', 12.5), lx = P.X(0.5) - 7 - ls.w;
        fig.rect(lx - 3, b.t + 3, ls.w + 6, ls.h + 2, { fill: 'stage', alpha: 0.85 });
        fig.label('half', lx, b.t + 4, { anchor: 'nw', color: 'violet', size: 12.5 });
      }

      // the loop around s and its winding number, recomputed only when s or the window moves
      var px = P.X(s.x), py = P.Y(s.y), k2 = [s.x, s.y, v.x0, v.x1, v.y0, v.y1, b.w, b.h].join(',');
      if (k2 !== key) {
        key = k2; M.zetaInto(s.x, s.y, val);
        var total = 0, prev = null;
        for (var i = 0; i <= K; i++) {
          var q = P.toWorld(px + LOOP * Math.cos(2 * Math.PI * i / K), py - LOOP * Math.sin(2 * Math.PI * i / K));
          M.zetaInto(q[0], q[1], w);
          var arg = Math.atan2(w[1], w[0]);
          if (prev !== null) { var da = arg - prev; total += da - 2 * Math.PI * Math.round(da / (2 * Math.PI)); }
          prev = arg;
        }
        wind = Math.round(total / (2 * Math.PI));
      }
      fig.circle(px, py, LOOP, { fill: false, ring: fig.color('stage', 0.8), ringWidth: 4 });
      fig.circle(px, py, LOOP, { fill: false, ring: wind ? 'fg' : fig.color('fg', 0.75), ringWidth: wind ? 2.2 : 1.4 });
      var m = Math.max(Math.abs(val[0]), Math.abs(val[1]));
      var meaning = wind === 1 ? 'one zero inside' : wind === -1 ? 'the pole inside' : wind === 0 ? 'no zero or pole inside' : fmt(wind) + ' zeros minus poles';
      var zval = fmt.complex(val[0], val[1], Kit.clamp((fig.w < 560 ? 3 : 5) - Math.floor(Math.log10(m || 1)), 0, 9));
      var wcol = wind > 0 ? 'teal' : wind < 0 ? 'red' : 'fg';
      if (fig.w < 560) {                                                             // one line under the plane
        var yy = P.outer.b + 12;
        fig.mathText([{ tex: 'zs' }, ' = ' + zval], 8, yy, { size: 12, mono: true });
        fig.text('winding ' + fmt(wind, { sign: wind !== 0 }), fig.w - 8, yy, { color: wcol, size: 12, mono: true, align: 'right', baseline: 'middle' });
        return;
      }
      fig.panel([
        ['s', fmt.complex(s.x, s.y, 3)],
        [{ tex: 'zs' }, zval],
        ['winding', fmt(wind, { sign: wind !== 0 }), wcol],
        ['', meaning, 'muted']
      ], { plane: P, at: 'auto', prefer: ['ne', 'nw', 'se', 'sw'], hint: 'drag s; drag the picture to pan' });
    };
  }
});
