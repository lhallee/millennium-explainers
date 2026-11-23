/* The Lean tree of the second proof as a squarified treemap (chapter 18, section ra-map): the top-level folders, with
   Development split into its seven children, by files or by lines. Every rectangle is teal because every file is
   imported by Main. The three tiny groups (Main.lean and Statements.lean at the root, Supplements, BuildAid) are one
   sliver with a leader line to its label. The measure morphs between the two layouts. */
Kit.register('ra-tree-size', {
  init: function (fig) {
    var TOTAL = [175187, 17374215];
    var DEV = [['AbelianVarietyTheory', 99187, 8142960], ['AutomorphicArithmetic', 18431, 1776375], ['AutomorphicSpectrum', 15147, 1195844],
      ['WeilBound', 7051, 848547], ['EtaleCohomology', 1398, 104525], ['ResolutionOfSingularities', 499, 140709], ['DiscreteGroups', 215, 23703]];
    var TOP = [['Development', 141928, 12232663], ['Formalism', 18254, 3200748], ['GroundTheory', 8507, 1119138], ['ReciprocityTheory', 3845, 563016],
      ['CompanionTheory', 2027, 194218], ['PositivityTheory', 449, 55130], ['Lemmata', 167, 9232], ['Main.lean, Statements.lean, Supplements, BuildAid', 10, 70]];
    var sum = function (list, j) { return list.reduce(function (s, r) { return s + r[j]; }, 0); };
    if (sum(TOP, 1) !== TOTAL[0] || sum(TOP, 2) !== TOTAL[1] || sum(DEV, 1) !== TOP[0][1] || sum(DEV, 2) !== TOP[0][2])
      console.error('ra-tree-size: folder counts do not add up to the totals chapter 18 prints (175,187 files, 17,374,215 lines)');

    var measure = fig.select({ label: 'Area by', options: [['files', 'files'], ['lines', 'lines']], value: 'files' });
    var mix = fig.tween(0), lastM = 'files';
    var P = fig.plane({ x: [0, 1], y: [0, 1], pad: 0 });
    var rects = [], probe = fig.probe({ plane: P, crosshair: false, marker: false, rows: function (x, y) {
      var r = at(P.X(x), P.Y(y));
      if (!r) return null;
      return [[r.dev ? 'Development/' + r.name : r.name, ''], ['files', Kit.fmt(r.f) + '  (' + pct(r.f, 0) + ')'], ['lines', Kit.fmt(r.l) + '  (' + pct(r.l, 1) + ')']];
    }, pick: function () {} });
    function pct(v, j) { var p = 100 * v / TOTAL[j]; return (p < 0.1 ? p.toFixed(3) : p.toFixed(1)) + '%'; }
    function at(px, py) { for (var i = rects.length - 1; i >= 0; i--) { var r = rects[i]; if (px >= r.x && px <= r.x + r.w && py >= r.y && py <= r.y + r.h) return r; } return null; }

    /* Squarified treemap: values (in order) into the rectangle [x, y, w, h]; returns [x, y, w, h] per value. */
    function squarify(vals, x, y, w, h) {
      var out = [], total = vals.reduce(function (s, v) { return s + v; }, 0), scale = w * h / total, i = 0;
      while (i < vals.length) {
        var side = Math.min(w, h), row = [], rs = 0, best = Infinity;
        for (var j = i; j < vals.length; j++) {
          var a = vals[j] * scale, s2 = rs + a, lo = Math.min(a, row.length ? Math.min.apply(null, row) : a), hi = Math.max(a, row.length ? Math.max.apply(null, row) : a);
          var worst = Math.max(side * side * hi / (s2 * s2), s2 * s2 / (side * side * lo));
          if (worst > best) break;
          best = worst; row.push(a); rs = s2;
        }
        var thick = rs / side, pos = 0;
        row.forEach(function (a) {
          var len = a / thick;
          out.push(w >= h ? [x, y + pos, thick, len] : [x + pos, y, len, thick]);
          pos += len;
        });
        if (w >= h) { x += thick; w -= thick; } else { y += thick; h -= thick; }
        i += row.length;
      }
      return out;
    }
    var cacheKey = '', layouts = null;
    function layout(x, y, w, h, head) {
      return [1, 2].map(function (j) {
        var top = squarify(TOP.map(function (r) { return r[j]; }), x, y, w, h), d = top[0];
        var dev = squarify(DEV.map(function (r) { return r[j]; }), d[0] + 2, d[1] + head, d[2] - 4, d[3] - head - 2);
        return top.concat(dev);
      });
    }

    return function draw() {
      var w = fig.w, h = fig.h, narrow = w < 560, band = narrow ? 54 : 40, head = 20, m = 6;
      if (measure.value !== lastM) { lastM = measure.value; mix.to(lastM === 'lines' ? 1 : 0, 400, 'inOutCubic'); }
      var key = w + 'x' + h;
      if (key !== cacheKey) { cacheKey = key; layouts = layout(m, m, w - 2 * m, h - band - m, head); }
      var u = mix.value, j = u > 0.5 ? 2 : 1;
      var hot = probe.active ? at(P.X(probe.x), P.Y(probe.y)) : null;
      rects = [];
      var all = TOP.map(function (r, i) { return { name: r[0], f: r[1], l: r[2], i: i, dev: false }; })
        .concat(DEV.map(function (r, i) { return { name: r[0], f: r[1], l: r[2], i: TOP.length + i, dev: true }; }));
      all.forEach(function (r) {
        var A = layouts[0][r.i], B = layouts[1][r.i];
        r.x = Kit.lerp(A[0], B[0], u); r.y = Kit.lerp(A[1], B[1], u); r.w = Kit.lerp(A[2], B[2], u); r.h = Kit.lerp(A[3], B[3], u);
      });
      all.forEach(function (r, k) {
        if (k === TOP.length - 1) return;                     // the sliver is marked below
        var isDev = r.i === 0, on = Boolean(hot) && hot.i === r.i;
        if (!isDev) fig.rect(r.x + 1, r.y + 1, r.w - 2, r.h - 2, { fill: 'teal', alpha: on ? 0.55 : 0.35 });
        fig.rect(r.x + 1, r.y + 1, r.w - 2, r.h - 2, { color: on ? 'fg' : isDev ? 'fg' : 'muted', width: on ? 2 : isDev ? 1.6 : 1, alpha: isDev && !on ? 0.7 : 1 });
        rects.push(r);
      });
      all.forEach(function (r, k) {                           // labels where they fit
        if (k === TOP.length - 1) return;
        var share = pct(j === 1 ? r.f : r.l, j - 1), isDev = r.i === 0, size = narrow ? 11 : 12.5;
        if (isDev) {
          var t = 'Development  ' + share + ' of ' + (j === 1 ? 'files' : 'lines');
          if (fig.measure(t, size, 650) > r.w - 12) t = 'Development  ' + share;
          fig.text(t, r.x + 7, r.y + head / 2 + 2, { color: 'fg', size: size, weight: 650, baseline: 'middle' });
          return;
        }
        var nm = r.name, wN = fig.measure(nm, size, 600);
        if (r.w - 12 < wN || r.h < 2.2 * size + 8) {
          if (r.w - 12 >= fig.measure(share, size - 1, 500) && r.h >= size + 8) fig.text(share, r.x + 6, r.y + size / 2 + 6, { color: 'fg', size: size - 1, baseline: 'middle' });
          return;
        }
        fig.text(nm, r.x + 7, r.y + size / 2 + 7, { color: 'fg', size: size, weight: 600, baseline: 'middle' });
        var cnt = Kit.fmt(j === 1 ? r.f : r.l) + (r.h >= 3.4 * size + 10 && r.w >= 110 ? (j === 1 ? ' files' : ' lines') : '');
        var l2 = share + '  ·  ' + cnt;
        if (fig.measure(l2, size - 1.5, 500) > r.w - 12) l2 = share;
        fig.text(l2, r.x + 7, r.y + 1.6 * size + 9, { color: 'fg', size: size - 1.5, baseline: 'middle', alpha: 0.85 });
      });
      // the sliver of tiny groups: a marker at its place and a leader line to its label
      var s = all[TOP.length - 1], sx = s.x + s.w / 2, sy = s.y + s.h / 2, ly = h - band + 14;
      fig.circle(sx, sy, 2.5, { fill: 'teal', ring: 'fg', ringWidth: 1 });
      var lab = narrow ? 'Main.lean, Statements.lean, 2 small folders: 10 files' : 'Main.lean, Statements.lean, Supplements, BuildAid: 10 files, 70 lines';
      var lw = fig.measure(lab, 11, 500), lx = Math.max(m, Math.min(sx - lw + 6, w - m - lw));
      fig.line(sx, sy + 3, sx, ly - 7, { color: 'muted', width: 1 });
      fig.text(lab, lx, ly, { color: 'muted', size: 11, baseline: 'middle' });
      var note = 'All 175,187 files are imported by Main, within at most 43 import steps. No sorry, no axiom.';
      if (narrow) {
        fig.text('All 175,187 files are imported by Main,', m, ly + 15, { color: 'fg', size: 11, baseline: 'middle' });
        fig.text('within at most 43 import steps. No sorry, no axiom.', m, ly + 29, { color: 'fg', size: 11, baseline: 'middle' });
      } else fig.text(note, m, ly + 16, { color: 'fg', size: 11.5, baseline: 'middle' });
    };
  }
});
