/* The parity trick of TwoUp as a multiset intersection. The form U has n Satake parameters (gold); each lift U_i adds
   t character values (blue). The part common to the two lifts is the form's parameters plus every value the two
   families share; it equals the form exactly when the families are disjoint, and a shared value (red) makes it too
   big, so the subtraction fails. Drag a value from the bottom row onto a character of a lift to replace it. */
Kit.register('parity-subtraction', {
  tex: { U: 'U', U1: 'U_1', U2: 'U_2' },
  init: function (fig) {
    var SETS = {
      2: { form: ['−1+i', '−1−i'], pal: [2, 3, 5, 7, 11, 13, 17, 19], fam: [[2, 3, 5], [7, 11, 13]] },
      4: { form: ['a', 'b', 'c', 'd'], pal: [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37], fam: [[2, 3, 5, 7, 11], [13, 17, 19, 23, 29]] }
    };
    var rank = fig.select({ label: 'Rank of the form', options: [['2', 'n = 2, t = 3'], ['4', 'n = 4, t = 5']], value: '2',
      onInput: function () { restart(); } });
    fig.button({ label: 'Reuse a character', onClick: function () {
      var f = fam[1]; if (common().extra.length === 0) { f[f.length - 1] = fam[0][fam[0].length - 1]; fig.redraw(); }
    } });
    var fam = null, prevKeys = '', prevExtra = [], slide = fig.tween(1), born = {}, target = null;
    function set() { return SETS[rank.value]; }
    function restart() { fam = set().fam.map(function (r) { return r.slice(); }); prevKeys = ''; prevExtra = []; born = {}; fig.redraw(); }
    restart();
    fig.onReset = restart;

    // The common part: the form's parameters, then the multiset intersection of the two families.
    function common() {
      var left = fam[1].slice(), extra = [], src = [];
      fam[0].forEach(function (v, i) { var j = left.indexOf(v); if (j >= 0) { left[j] = null; extra.push(v); src.push([i, j]); } });
      return { extra: extra, src: src };
    }

    var P = fig.plane({ x: [0, 1], y: [0, 1], pad: 0 });
    function lay() {
      var w = fig.w, h = fig.h, narrow = w < 560, m = set().form.length + set().fam[0].length;
      var step = narrow ? Math.min(42, (w - 78) / (m + 1)) : Math.min(64, (w - 200) / 9), lab = narrow ? 50 : 96;
      var np = set().pal.length, pstep = narrow ? Math.min(step, (w - 86) / (np - 1)) : step * (m === 5 ? 1 : 0.75);
      var block = lab + 20 + Math.max(np * pstep, m * step);
      var L = (narrow ? 8 : Math.max(16, (w - block) / 2)) + lab, r = narrow ? 6.5 : 9;
      var rows = [0.09, 0.24, 0.39, 0.56].map(function (f) { return f * h; }), fb = rows[3] + r + 22;
      return { narrow: narrow, L: L, lab: lab, step: step, pstep: pstep, r: r, m: m, rows: rows, fb: fb, status: fb + 18, pal: h - 28 };
    }
    function slotX(g, i) { return g.L + 20 + i * g.step; }
    var handles = [];
    for (var k = 0; k < 12; k++) (function (k) {
      handles.push(fig.drag({ plane: P, x: 0, y: 0, r: 7, color: 'fg',
        onDrag: function (x, y) { target = nearest(P.X(x), P.Y(y)); },
        onEnd: function () { if (target) fam[target[0]][target[1]] = set().pal[k]; target = null; } }));
    })(k);
    function nearest(px, py) {
      var g = lay(), n = set().form.length, best = null, bd = 26;
      for (var r = 0; r < 2; r++) for (var i = 0; i < fam[r].length; i++) {
        var d = Math.hypot(px - slotX(g, n + i), py - g.rows[r + 1]);
        if (d < bd) { bd = d; best = [r, i]; }
      }
      return best;
    }

    function item(x, y, r, color, text, g, alpha) {
      fig.circle(x, y, r, { fill: color, ring: 'stage', ringWidth: 1.5, alpha: alpha });
      fig.text(text, x, y + r + (g.narrow ? 10 : 13), { color: color, size: g.narrow ? 10.5 : 12.5, align: 'center', mono: true, alpha: alpha });
    }

    return function draw() {
      var g = lay(), S = set(), n = S.form.length, C = common(), i, r;
      var shared = {}; C.extra.forEach(function (v) { shared[v] = true; });
      var keys = 'g' + n + ':' + C.extra.join(',');
      if (keys !== prevKeys) {                                        // newly common items slide down into the panel
        var nb = {}, old = prevExtra.slice();
        if (!prevKeys) for (i = 0; i < n; i++) nb['g' + i] = true;
        C.extra.forEach(function (v, j) { var o = old.indexOf(v); if (o >= 0) old[o] = null; else nb['c' + j] = true; });
        born = nb; prevKeys = keys; prevExtra = C.extra.slice(); slide.set(0); slide.to(1, 300, 'inOutCubic');
      }

      // Row names and the frame of the common part.
      var names = g.narrow ? [[{ tex: 'U' }], [{ tex: 'U1' }], [{ tex: 'U2' }], ['common']] :
        [['form ', { tex: 'U' }], ['lift 1 ', { tex: 'U1' }], ['lift 2 ', { tex: 'U2' }], ['common']];
      for (r = 0; r < 4; r++) fig.mathText(names[r], g.L - g.lab, g.rows[r], { size: g.narrow ? 11.5 : 13, color: 'muted' });
      var right = Math.min(fig.w - 4, slotX(g, g.m - 1) + g.step / 2 + 4);
      fig.rect(g.L, g.rows[3] - g.r - 10, right - g.L, g.fb - g.rows[3] + g.r + 10, { color: 'muted', alpha: 0.6 });

      // The form and the two lifts.
      for (i = 0; i < n; i++) for (r = 0; r < 3; r++) item(slotX(g, i), g.rows[r], g.r, 'gold', S.form[i], g);
      for (r = 0; r < 2; r++) for (i = 0; i < fam[r].length; i++) {
        var v = fam[r][i], x = slotX(g, n + i), y = g.rows[r + 1];
        if (target && target[0] === r && target[1] === i) fig.circle(x, y, g.r + 6, { fill: 'fg', alpha: 0.15 });
        item(x, y, g.r, shared[v] ? 'red' : 'blue', String(v), g);
      }

      // The common part: gold parameters, then shared values in red, sliding down from lift 2 when they appear.
      var u = slide.value;
      for (i = 0; i < n; i++) {
        var yy = born['g' + i] ? Kit.lerp(g.rows[2], g.rows[3], u) : g.rows[3];
        item(slotX(g, i), yy, g.r, 'gold', S.form[i], g, born['g' + i] ? 0.4 + 0.6 * u : 1);
      }
      C.extra.forEach(function (v, j) {
        var x0 = slotX(g, n + C.src[j][1]), x1 = slotX(g, n + j), a = born['c' + j] ? u : 1;
        item(Kit.lerp(x0, x1, a), Kit.lerp(g.rows[2], g.rows[3], a), g.r, 'red', String(v), g);
      });
      var size = n + C.extra.length, ok = size === n;
      var msg = ok ? (g.narrow ? ['common part ' + size + ' = rank: the form'] : ['common part has ' + size + ' parameters = rank of the form:', 'subtracting the rest recovers the form'])
        : (g.narrow ? ['common part ' + size + ' > rank ' + n + ': fails'] : ['common part has ' + size + ' parameters > rank ' + n + ':', 'a shared character is mistaken for part of the form']);
      var ms = { color: ok ? 'fg' : 'red', size: g.narrow ? 11.5 : 13, weight: ok ? 500 : 600 }, one = msg.join(' ');
      if (fig.measure(one, ms.size, ms.weight) < fig.w - g.L - 12) fig.text(one, g.L + 4, g.status, ms);
      else msg.forEach(function (s, j) { fig.text(s, g.L + 4, g.status + 17 * j, ms); });

      // The palette of values: each one a handle that can be dropped on a character of a lift.
      if (g.narrow) fig.text('drag', g.L - g.lab, g.pal, { color: 'muted', size: 11, baseline: 'middle' });
      else fig.text('drag a value onto a character of a lift', g.L + 20 - 7, g.pal - 30, { color: 'muted', size: 12, baseline: 'middle' });
      for (k = 0; k < handles.length; k++) {
        var h = handles[k], on = k < S.pal.length;
        h.show(on); if (!on) continue;
        var hx = slotX(g, 0) + k * g.pstep, hy = g.pal - 6;
        if (fig.activeDrag !== h) { var wv = P.toWorld(hx, hy); h.x = wv[0]; h.y = wv[1]; }
        else fig.circle(hx, hy, 7, { fill: false, ring: 'muted', ringWidth: 1.5 });
        fig.text(String(S.pal[k]), P.X(h.x), P.Y(h.y) + 18, { color: 'fg', size: g.narrow ? 10.5 : 12, align: 'center', mono: true });
      }
    };
  }
});
