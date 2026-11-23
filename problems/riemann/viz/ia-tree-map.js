/* The Lean tree as a squarified treemap: the ten top-level folders with area proportional to files, lines, or
   declarations, and their larger subfolders inside them (the rest of a folder is "other"). The folder that holds
   the final assembly (CharacterBoxes) is outlined in gold, the one that holds PublishedTheorems in blue. Clicking a
   folder zooms into it; the layout morphs when the measure changes. Counts are the chapter's table. */
Kit.register('ia-tree-map', {
  init: function (fig) {
    var fmt = Kit.fmt, MET = ['files', 'lines', 'declarations'], TOTAL = [175187, 17374215, 1061425];
    var TOP = [
      ['Development', 141928, 12232663, 692993, [['AbelianVarietyTheory', 99187, 8142960, 457031], ['AutomorphicArithmetic', 18431, 1776375, 91512],
        ['AutomorphicSpectrum', 15147, 1195844, 69254], ['WeilBound', 7051, 848547, 55463], ['EtaleCohomology', 1398, 104525, 10302],
        ['ResolutionOfSingularities', 499, 140709, 8050], ['DiscreteGroups', 215, 23703, 1381]]],
      ['Formalism', 18254, 3200748, 240099, [['LocalToGlobal', 5501, 955843, 73273], ['PeriodIntegrals', 4350, 451856, 32699],
        ['SharpRestriction', 3093, 709436, 54648], ['HermitianCurvature', 1922, 460802, 35958], ['GL3MeanSquares', 440, 78320, 4153]]],
      ['GroundTheory', 8507, 1119138, 75102, [['HeightsAndTheta', 6410, 641322, 37829], ['AutomorphicForms', 542, 150005, 10968],
        ['ProfiniteCohomology', 450, 84902, 6262], ['GlobalFields', 384, 72305, 5830], ['PAdicHodge', 226, 64317, 5360]]],
      ['ReciprocityTheory', 3845, 563016, 36446, [['ReductiveGroups', 2799, 409976, 26331], ['L2DbarEstimates', 227, 33734, 1877], ['AnalyticForms', 192, 36680, 2328]]],
      ['CompanionTheory', 2027, 194218, 11775, [['SpectralGeometry', 1254, 105437, 5870], ['AutomorphicTheory', 457, 47957, 2806]]],
      ['PositivityTheory', 449, 55130, 4746], ['Lemmata', 167, 9232, 251], ['BuildAid', 5, 20, 0], ['Supplements', 3, 22, 4], ['root', 2, 28, 9]
    ];
    var NODES = [], byId = {};                               // { id, name, v: [files, lines, decls], parent, kids }
    TOP.forEach(function (t) {
      var n = { id: t[0], name: t[0], v: [t[1], t[2], t[3]], parent: null, kids: [] };
      NODES.push(n); byId[n.id] = n;
      if (!t[4]) return;
      var rest = n.v.slice();
      t[4].forEach(function (c) {
        var k = { id: t[0] + '/' + c[0], name: c[0], v: [c[1], c[2], c[3]], parent: n }; n.kids.push(k);
        for (var m = 0; m < 3; m++) rest[m] -= k.v[m];
      });
      if (rest.some(function (r) { return r < 0; })) console.error('ia-tree-map: subfolders exceed ' + n.id);
      n.kids.push({ id: t[0] + '/other', name: 'other', v: rest, parent: n, other: true });
      n.kids.forEach(function (k) { NODES.push(k); byId[k.id] = k; });
    });
    for (var m = 0; m < 3; m++) if (TOP.reduce(function (s, t) { return s + t[m + 1]; }, 0) !== TOTAL[m]) console.error('ia-tree-map: totals differ from chapter 24');
    var GOLD = 'Development/AutomorphicArithmetic', BLUE = 'Development/AbelianVarietyTheory';

    /* Squarified layout (Bruls, Huizing, van Wijk) of items into the rectangle r = [x, y, w, h]; writes out[id]. */
    function squarify(items, metric, r, out) {
      var list = items.slice().sort(function (a, b) { return b.v[metric] - a.v[metric]; });
      var total = list.reduce(function (s, it) { return s + it.v[metric]; }, 0), x = r[0], y = r[1], w = r[2], h = r[3];
      var scale = total > 0 ? w * h / total : 0, i = 0;
      while (i < list.length) {
        if (list[i].v[metric] <= 0 || w <= 0 || h <= 0) { out[list[i].id] = [x + w, y + h, 0, 0]; i++; continue; }
        var side = Math.min(w, h), j = i, sum = 0, best = Infinity;
        while (j < list.length && list[j].v[metric] > 0) {
          var s = sum + list[j].v[metric] * scale, a0 = list[i].v[metric] * scale, a1 = list[j].v[metric] * scale;
          var worst = Math.max(side * side * a0 / (s * s), s * s / (side * side * a1));
          if (worst > best) break;
          best = worst; sum = s; j++;
        }
        var thick = sum / side, off = 0;
        for (var k = i; k < j; k++) {
          var len = list[k].v[metric] * scale / thick;
          out[list[k].id] = w >= h ? [x, y + off, thick, len] : [x + off, y, len, thick];
          off += len;
        }
        if (w >= h) { x += thick; w -= thick; } else { y += thick; h -= thick; }
        i = j;
      }
    }
    var cache = {};
    function layout(metric, W, H) {                           // normalized rectangles, computed at the stage's aspect
      var key = metric + '|' + Math.round(W) + '|' + Math.round(H);
      if (cache[key]) return cache[key];
      var px = {}, out = {};
      squarify(NODES.filter(function (n) { return !n.parent; }), metric, [0, 0, W, H], px);
      NODES.forEach(function (n) { if (n.kids && n.kids.length) squarify(n.kids, metric, px[n.id], px); });
      NODES.forEach(function (n) { var q = px[n.id]; out[n.id] = [q[0] / W, q[1] / H, q[2] / W, q[3] / H]; });
      return (cache[key] = out);
    }

    var metric = 1, zoom = null, from = null, to = null, camFrom = [0, 0, 1, 1], camTo = [0, 0, 1, 1], cur = {}, cam = [0, 0, 1, 1];
    var mix = fig.tween(1);
    function retarget() { from = {}; NODES.forEach(function (n) { from[n.id] = (cur[n.id] || [0, 0, 0, 0]).slice(); }); camFrom = cam.slice(); to = null; mix.set(0); mix.to(1, 400, 'inOutCubic'); }
    var btns = MET.map(function (name, k) {
      return fig.button({ label: name.charAt(0).toUpperCase() + name.slice(1), pressed: k === metric, onClick: function () { setMetric(k); } });
    });
    function setMetric(k) { metric = k; btns.forEach(function (b, i) { b.press(i === k); }); retarget(); }
    var back = fig.button({ label: 'Back to the whole tree', onClick: function () { zoom = null; retarget(); } });
    fig.onReset = function () { zoom = null; pinned = null; setMetric(1); };

    var P = fig.plane({ x: [0, 1], y: [0, 1], pad: 0, box: function (w, h) { return [0, 0, w, h - (w < 560 ? 52 : 42)]; } });
    var pinned = null;
    function hit(px, py) {                                    // the deepest rectangle under a screen point
      var b = P.box, found = null;
      NODES.forEach(function (n) {
        var r = screen(n.id, b);
        if (r[2] > 0.5 && r[3] > 0.5 && px >= r[0] && px <= r[0] + r[2] && py >= r[1] && py <= r[1] + r[3]) if (!found || n.parent) found = n;
      });
      return found;
    }
    var probe = fig.probe({ plane: P, crosshair: false, marker: false, pick: function (x, y) {
      var n = hit(P.X(x), P.Y(y)); if (!n) return;
      var top = n.parent || n;
      if (!zoom && top.kids.length) { zoom = top.id; pinned = null; retarget(); } else pinned = n === pinned ? null : n;
    } });
    function screen(id, b) { var r = cur[id]; return [b.l + (r[0] - cam[0]) / cam[2] * b.w, b.t + (r[1] - cam[1]) / cam[3] * b.h, r[2] / cam[2] * b.w, r[3] / cam[3] * b.h]; }
    function share(n) { return (100 * n.v[metric] / TOTAL[metric]).toFixed(1) + '% of the ' + MET[metric]; }

    return function draw() {
      var w = fig.w, h = fig.h, b = P.box, narrow = w < 560, e = mix.value;
      to = layout(metric, b.w, b.h);
      if (!from) { from = to; }
      var target = zoom ? to[zoom] : [0, 0, 1, 1];
      for (var c = 0; c < 4; c++) cam[c] = Kit.lerp(camFrom[c], target[c], e);
      NODES.forEach(function (n) { var a = from[n.id], z = to[n.id], r = cur[n.id] || (cur[n.id] = [0, 0, 0, 0]); for (var c = 0; c < 4; c++) r[c] = Kit.lerp(a[c], z[c], e); });
      back.show(zoom !== null);
      var hov = probe.active ? hit(P.X(probe.x), P.Y(probe.y)) : null, sel = hov || pinned;

      var ctx = fig.ctx; ctx.save(); ctx.beginPath(); ctx.rect(b.l, b.t, b.w, b.h); ctx.clip();
      var labels = [];
      NODES.forEach(function (n) {                            // top-level folders are separated by a 3 px gap
        var r = screen(n.id, b); if (r[2] < 0.5 || r[3] < 0.5) return;
        var lvl1 = !n.parent, inset = lvl1 ? 1.5 : 0.5, on = sel === n, hue = n.id === GOLD ? 'gold' : n.id === BLUE ? 'blue' : null;
        fig.rect(r[0] + inset, r[1] + inset, r[2] - 2 * inset, r[3] - 2 * inset, { fill: hue || (on ? 'fg' : 'muted'), alpha: hue ? (on ? 0.3 : 0.16) : on ? 0.16 : lvl1 ? 0.1 : n.other ? 0.02 : 0.08 });
        fig.rect(r[0] + inset, r[1] + inset, r[2] - 2 * inset, r[3] - 2 * inset, { color: 'muted', width: lvl1 ? 1.4 : 0.8, alpha: lvl1 ? 0.95 : 0.55 });
        if (lvl1 || n.parent.id === zoom || r[2] * r[3] > 1200) labels.push([n, r]);
      });
      [BLUE, GOLD].forEach(function (id) { var r = screen(id, b); if (r[2] > 4) fig.rect(r[0] + 2.5, r[1] + 2.5, r[2] - 5, r[3] - 5, { color: id === GOLD ? 'gold' : 'blue', width: 2.4 }); });
      if (sel) { var rs = screen(sel.id, b); fig.rect(rs[0] + 1, rs[1] + 1, rs[2] - 2, rs[3] - 2, { color: 'fg', width: 2 }); }
      var texts = [];                                         // drawn after the loop, grouped by font
      labels.forEach(function (q) {                           // top-level names at the top left, subfolders at the bottom left
        var n = q[0], r = q[1], lvl1 = !n.parent, size = 11.5, val = fmt(n.v[metric]);   // two canvas fonts in all: 11.5, and 11.5 bold
        var name = n.name, tw = fig.measure(name, size, lvl1 ? 700 : 500), vw = fig.measure(val, 11.5, 500);
        var color = n.id === GOLD ? 'gold' : n.id === BLUE ? 'blue' : lvl1 ? 'fg' : 'muted';
        if (r[2] < tw + 10 || r[3] < (lvl1 ? 20 : 36)) return;
        var x = r[0] + 6, y = lvl1 ? r[1] + 6 + size : r[1] + r[3] - 7, two = r[2] < tw + vw + 18;
        if (two && r[3] < (lvl1 ? 38 : 52)) { texts.push([name, x, y, { color: color, size: size, weight: lvl1 ? 700 : 500 }]); return; }
        if (!lvl1 && two) y -= size + 3;
        if (lvl1) fig.rect(x - 4, y - size - 2, (two ? Math.max(tw, vw) : tw + vw + 8) + 8, (two ? 2 * size + 5 : size + 6), { fill: 'stage', alpha: 0.8 });
        texts.push([name, x, y, { color: color, size: size, weight: lvl1 ? 700 : 500 }]);
        texts.push([val, two ? x : x + tw + 8, two ? y + size + 3 : y, { color: 'muted', size: 11.5 }]);
      });
      var fk = function (t) { return t[3].size + (t[3].weight || 500) / 1000 + (t[3].mono ? 100 : 0); };
      texts.sort(function (a, b) { return fk(a) - fk(b); }).forEach(function (t) { fig.text(t[0], t[1], t[2], t[3]); });
      ctx.restore();

      // readout and key under the map
      var y0 = b.b + (narrow ? 15 : 17), size = 11.5, dev = byId.Development, aa = byId[GOLD];
      if (sel) {
        var path = sel.parent ? sel.parent.name + '/' + sel.name : sel.name;
        var nums = fmt(sel.v[0]) + ' files, ' + fmt(sel.v[1]) + ' lines, ' + fmt(sel.v[2]) + ' declarations';
        if (narrow) { fig.text(path + ': ' + share(sel), 10, y0, { color: 'fg', size: size, weight: 700 }); fig.text(nums, 10, y0 + 15, { color: 'fg', size: 11.5 }); }
        else fig.text(path + ': ' + nums + ', ' + share(sel), 10, y0, { color: 'fg', size: size, weight: 700 });
      } else if (narrow) {
        fig.text('Development: ' + share(dev), 10, y0, { color: 'fg', size: size, weight: 700 });
        fig.text('…/AutomorphicArithmetic: ' + share(aa), 10, y0 + 15, { color: 'fg', size: size, weight: 700 });
      } else {
        fig.text('Development holds ' + share(dev) + '; Development/AutomorphicArithmetic, with the final assembly, holds ' + (100 * aa.v[metric] / TOTAL[metric]).toFixed(1) + '%.', 10, y0, { color: 'fg', size: size, weight: 700 });
      }
      var ky = narrow ? y0 + 31 : y0 + 18, kx = 10;
      [['gold', narrow ? 'final assembly' : 'holds CharacterBoxes, the final assembly'], ['blue', narrow ? 'PublishedTheorems' : 'holds PublishedTheorems']].forEach(function (k) {
        fig.rect(kx, ky - 8, 14, 9, { color: k[0], width: 2 });
        fig.text(k[1], kx + 20, ky, { color: 'muted', size: 11.5 });
        kx += 32 + fig.measure(k[1], 11.5, 500);
      });
      if (!narrow) fig.text(zoom ? 'click a subfolder to pin it' : 'click a folder to zoom in', w - 10, ky, { color: 'muted', size: 11.5, align: 'right' });
    };
  }
});
