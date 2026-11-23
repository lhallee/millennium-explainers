/* Route M as a dependency map. On a wide stage: three lanes, the spectral path (teal) above, the geometric path (gold)
   below, the chain in the middle, meeting once at the Trace Formula; classical inputs in gray in the outer bands. On a
   phone: one column in the order of the links, with the links that skip rows drawn as arcs on the left and the
   classical inputs in a gray column on the right. Hovering or tapping a link shows its one-sentence content and
   chapter, and highlights the path from it to the conclusion. "Shorter route" draws the direct link from Weil's
   explicit formula to the endgame and fades the steps it makes unnecessary. */
Kit.register('tg-route-map', {
  init: function (fig) {
    var NODES = [
      { id: 1, name: 'Adeles', kind: 'start', ch: '11', col: 0, lane: 2, text: 'Every completion of Q at once: the adeles, the ideles, and the idele class group, on which a function of the norm is a function on the positive reals.' },
      { id: 2, name: 'Theta sums and zeta', kind: 'spec', ch: '12', col: 1, lane: 2, text: 'Theta sums have Mellin transforms ξ(z + ½) times entire functions, and modulo theta sums convolution by φ acts on the zeros with eigenvalues Mφ(ρ − ½).' },
      { id: 3, name: 'Primes as circles', kind: 'geom', ch: '13', col: 2, lane: 3, text: 'Deleting the multiples of p leaves functions on a circle of length log p, where the trace of convolution sees φ only at the powers of p, and different primes do not interfere.' },
      { id: 4, name: 'Strip topology', kind: 'spec', ch: '14', col: 2, lane: 1, text: 'In the strip topology, evaluating a Mellin transform is continuous exactly inside |Re z| < a, so only the zeros with |β − ½| < a survive in the spectral trace.' },
      { id: 5, name: 'Kernel and diagonal', kind: 'spec', ch: '15', col: 3, lane: 1, text: 'The kernel φ(x/y) splits into spectral and geometric parts, and the diagonal mass of the geometric part is minus the spectral trace.' },
      { id: 6, name: 'Sieve', kind: 'geom', ch: '15', col: 3, lane: 3, text: 'Lifted to the ideles, the geometric kernel is cut along the primes one at a time; every slice for p > Y has trace 0, which leaves an S-local kernel.' },
      { id: 7, name: 'S-local trace', kind: 'geom', ch: '16', col: 4, lane: 3, text: 'By Connes\'s computation the S-local diagonal mass is the sum of Weil\'s local terms at the places of S, with the weight ½ forced by the measures.' },
      { id: 8, name: 'Trace Formula', kind: 'end', ch: '16', col: 5, lane: 2, text: 'Weil\'s prime sum plus the archimedean term equals the pole terms minus the zeros in the strip, for every φ with φ(1) = 0 and every a > 0.' },
      { id: 9, name: 'Endgame', kind: 'end', ch: '17', col: 6, lane: 2, text: 'The family h₀(t) times t to the power −z turns the prime side into −ζ′/ζ(z + ½), which has a pole at every zero, while the other side has poles only at the zeros in the strip.',
        short: 'Subtracting the Trace Formula from Weil\'s explicit formula leaves the zeros outside the strip summing to zero against every test function, which forces them to be absent.' },
      { id: 10, name: 'Conclusion', kind: 'end', ch: '17', col: 7, lane: 2, text: 'No zero lies outside any strip of positive width around the critical line, so every nontrivial zero of ζ has real part ½, and so does every zero of a Hecke L-function.' },
      { id: 'W', name: 'Weil\'s explicit formula', short: 'explicit formula', kind: 'side', ch: '8', col: 5.5, lane: 0, text: 'The same left side as the Trace Formula with the sum over all zeros: it identifies the prime side, and the shorter route subtracts one formula from the other.' },
      { id: 'F', name: 'Functional equation', short: 'functional eq.', kind: 'side', ch: '4', col: 7, lane: 0, text: 'ξ(s) = ξ(1 − s) reflects the zeros, so none lies left of the line either. The shorter route needs no separate appeal to it.' },
      { id: 'Z', name: 'Zero count, no zeros on Re s = 1', short: 'zero count', kind: 'side', ch: '5', col: 2, lane: 4, text: 'N(T) = O(T log T) makes the zero sums converge, and the absence of zeros on Re s = 1 carries S-local statements to global ones.' },
      { id: 'C', name: 'Connes\'s local computation', short: 'Connes', kind: 'side', ch: '16', col: 4, lane: 4, text: 'The trace of a dilation cut off in space and frequency, computed by A. Connes in 1998, which gives Weil\'s local terms place by place.' }
    ];
    var EDGES = [[1, 2], [2, 4], [2, 3], [4, 5], [3, 6], [5, 6], [6, 7], [7, 8], [4, 8], [8, 9], [9, 10],
      ['W', 8], ['W', 9], ['F', 9], ['Z', 3], ['Z', 9], ['C', 7]];
    var COLOR = { start: 'fg', spec: 'teal', geom: 'gold', end: 'violet', side: 'muted' };
    var byId = {}; NODES.forEach(function (n) { byId[n.id] = n; });
    var shorter = fig.toggle({ label: 'Shorter route', value: false });
    var P = fig.plane({ x: [0, 1], y: [0, 1], pad: 0 });
    var pinned = null;
    var probe = fig.probe({ plane: P, crosshair: false, marker: false, pick: function (x, y) { var n = hitNode(P.X(x), P.Y(y)); pinned = n === pinned ? null : n; } });
    var G = {};                                                // node geometry of this frame: { x, y, w, h }

    function hitNode(px, py) {
      for (var i = 0; i < NODES.length; i++) { var g = G[NODES[i].id]; if (g && Math.abs(px - g.x) <= g.w / 2 + 3 && Math.abs(py - g.y) <= g.h / 2 + 3) return NODES[i]; }
      return null;
    }
    function edgeOn(e) { return e[0] === 'W' && e[1] === 9 ? shorter.value : true; }
    function downstream(n) {                                    // the node, and everything its links lead to
      var set = {}, stack = [n.id];
      while (stack.length) { var id = stack.pop(); if (set[id]) continue; set[id] = 1;
        EDGES.forEach(function (e) { if (e[0] === id && edgeOn(e)) stack.push(e[1]); }); }
      return set;
    }
    var wrapped = {};                                          // line breaks, cached by text, width, and size
    function wrap(str, width, size, weight) {
      var key = str + '|' + Math.round(width) + '|' + size + '|' + weight;
      if (wrapped[key]) return wrapped[key];
      var words = str.split(' '), lines = [], cur = '';
      words.forEach(function (w) { var t = cur ? cur + ' ' + w : w; if (cur && fig.measure(t, size, weight) > width) { lines.push(cur); cur = w; } else cur = t; });
      if (cur) lines.push(cur); return (wrapped[key] = lines);
    }
    function box(g, style) {
      var ctx = fig.ctx;
      ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(g.x - g.w / 2, g.y - g.h / 2, g.w, g.h, 6); else ctx.rect(g.x - g.w / 2, g.y - g.h / 2, g.w, g.h);
      ctx.fillStyle = fig.color('stage', 0.96); ctx.fill();
      fig.stroke(style); ctx.stroke(); ctx.setLineDash([]);
    }
    function poly(pts, style, head) {
      var ctx = fig.ctx, n = pts.length;
      [[fig.color('stage'), (style.width || 1.6) + 4, 1, null], [style.color, style.width || 1.6, style.alpha, style.dash]].forEach(function (s) {
        fig.stroke({ color: s[0], width: s[1], alpha: s[2], dash: s[3] });
        ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]);
        for (var i = 1; i < n - 1; i++) ctx.lineTo(pts[i][0], pts[i][1]);
        ctx.stroke();
      });
      fig.arrow(pts[n - 2][0], pts[n - 2][1], pts[n - 1][0], pts[n - 1][1], { color: style.color, width: style.width || 1.6, alpha: style.alpha, head: head, dash: style.dash });
    }

    /* Wide layout: columns 0..7, lanes 0 (top band) to 4 (bottom band). */
    function wideLayout(w, h) {
      var m = 8, pitch = (w - 2 * m) / 8, nw = Math.min(128, pitch - 10), Y = [0.12, 0.34, 0.54, 0.74, 0.91].map(function (f) { return f * h; });
      var X = function (c) { return m + (c + 0.5) * pitch; };
      // a node is as tall as its wrapped name (and, for the endgame, its two sub-lines) needs
      NODES.forEach(function (n) {
        var side = n.kind === 'side', bw = side ? Math.min(150, pitch + 12) : nw, k = wrap((side ? '' : n.id + '  ') + n.name, bw - 14, side ? 11 : 12, 600).length;
        G[n.id] = { x: X(n.col), y: Y[n.lane], w: bw, h: n.id === 9 ? 15 * k + 40 : Math.max(38, 15 * k + 9) };
      });
      var g = function (id) { return G[id]; }, T = function (id) { return g(id).y - g(id).h / 2; }, B = function (id) { return g(id).y + g(id).h / 2; };
      var Lf = function (id) { return g(id).x - g(id).w / 2; }, Rt = function (id) { return g(id).x + g(id).w / 2; };
      var mx = (X(1) + X(2)) / 2, yA = (Y[0] + Y[1]) / 2 + 8, yB = (Y[3] + Y[4]) / 2;
      return {
        '1-2': [[Rt(1), Y[2]], [Lf(2), Y[2]]], '2-4': [[Rt(2), Y[2] - 6], [mx, Y[2] - 6], [mx, Y[1]], [Lf(4), Y[1]]],
        '2-3': [[Rt(2), Y[2] + 6], [mx, Y[2] + 6], [mx, Y[3]], [Lf(3), Y[3]]], '4-5': [[Rt(4), Y[1]], [Lf(5), Y[1]]],
        '3-6': [[Rt(3), Y[3]], [Lf(6), Y[3]]], '5-6': [[X(3), B(5)], [X(3), T(6)]], '6-7': [[Rt(6), Y[3]], [Lf(7), Y[3]]],
        '7-8': [[X(4), T(7)], [X(4), Y[2]], [Lf(8), Y[2]]], '4-8': [[X(2), T(4)], [X(2), yA], [X(5) - 20, yA], [X(5) - 20, T(8)]],
        '8-9': [[Rt(8), Y[2]], [Lf(9), Y[2]]], '9-10': [[Rt(9), Y[2]], [Lf(10), Y[2]]],
        'W-8': [[X(5) + 20, B('W')], [X(5) + 20, T(8)]], 'W-9': [[X(6) - 20, B('W')], [X(6) - 20, T(9)]],
        'F-9': [[Lf('F'), Y[0]], [X(6) + 20, Y[0]], [X(6) + 20, T(9)]], 'C-7': [[X(4), T('C')], [X(4), B(7)]],
        'Z-3': [[X(2), T('Z')], [X(2), B(3)]], 'Z-9': [[Rt('Z'), Y[4]], [X(3), Y[4]], [X(3), yB], [X(6), yB], [X(6), B(9)]]
      };
    }
    /* Phone layout: one column of links, arcs on the left, inputs on the right. */
    function narrowLayout(w, h) {
      var pitch = (h - 24) / 9, y = function (r) { return 12 + r * pitch; }, L = 44, nw = Math.min(200, 0.56 * w), R = L + nw, S0 = R + 16, sw = w - 12 - S0;
      var rows = { 1: 0, 2: 1, 3: 2, 4: 3, 5: 4, 6: 5, 7: 6, 8: 7, 9: 8, 10: 9, W: 7.5, F: 9, Z: 2, C: 6 }, nh = Math.min(20, pitch - 5);
      NODES.forEach(function (n) { var s = n.kind === 'side'; G[n.id] = { x: s ? S0 + sw / 2 : L + nw / 2, y: y(rows[n.id]), w: s ? sw : nw, h: nh }; });
      var cx = L + nw / 2, d = function (k) { return L - 8 - 11 * (k - 1); }, v = function (a, b) { return [[cx, y(a) + nh / 2], [cx, y(b) - nh / 2]]; };
      return {
        '1-2': v(0, 1), '2-3': v(1, 2), '4-5': v(3, 4), '5-6': v(4, 5), '6-7': v(5, 6), '7-8': v(6, 7), '8-9': v(7, 8), '9-10': v(8, 9),
        '2-4': [[L, y(1) + 4], [d(1), y(1) + 4], [d(1), y(3) - 4], [L, y(3) - 4]], '3-6': [[L, y(2) + 4], [d(2), y(2) + 4], [d(2), y(5)], [L, y(5)]],
        '4-8': [[L, y(3) + 4], [d(3), y(3) + 4], [d(3), y(7)], [L, y(7)]],
        'Z-3': [[S0, y(2)], [R, y(2)]], 'Z-9': [[S0 + sw, y(2)], [w - 5, y(2)], [w - 5, y(8)], [R, y(8)]], 'C-7': [[S0, y(6)], [R, y(6)]],
        'W-8': [[S0, y(7.5)], [R + 8, y(7.5)], [R + 8, y(7)], [R, y(7)]], 'W-9': [[S0, y(7.5)], [R + 8, y(7.5)], [R + 8, y(8) - 6], [R, y(8) - 6]],
        'F-9': [[S0, y(9)], [R + 8, y(9)], [R + 8, y(8) + 6], [R, y(8) + 6]]
      };
    }

    return function draw() {
      var w = fig.w, h = fig.h, narrow = w < 640, sh = shorter.value;
      var routes = narrow ? narrowLayout(w, h) : wideLayout(w, h);
      var sel = probe.active ? hitNode(P.X(probe.x), P.Y(probe.y)) : null;
      sel = sel || pinned;
      var lit = sel ? downstream(sel) : null;
      var faded = function (id) { return sh && id === 'F'; };

      EDGES.forEach(function (e) {
        if (!edgeOn(e)) return;
        var src = byId[e[0]], on = !lit || (lit[e[0]] && lit[e[1]]), off = faded(e[0]);
        var color = e[0] === 'W' && e[1] === 9 ? 'violet' : e[0] === 2 && e[1] === 3 ? 'gold' : COLOR[src.kind];
        poly(routes[e[0] + '-' + e[1]], { color: color, width: on && lit ? 2.4 : 1.6, alpha: off ? 0.3 : on ? 1 : 0.22, dash: src.kind === 'side' ? [4, 3] : null }, narrow ? 6 : 8);
      });
      NODES.forEach(function (n) {
        var g = G[n.id], on = !lit || lit[n.id], col = COLOR[n.kind], a = faded(n.id) ? 0.35 : on ? 1 : 0.3, side = n.kind === 'side';
        box(g, { color: col, width: sel === n ? 2.6 : side ? 1.2 : 1.7, alpha: a, dash: side ? [4, 3] : null });
        var size = narrow ? 11 : 12, label = side ? (narrow ? n.short : n.name) : n.name;
        if (narrow) {
          var t = side ? label : label + (n.id === 9 && sh ? ' by subtraction' : '');
          fig.text(t, side ? g.x : g.x - g.w / 2 + 26, g.y + 0.5, { color: side ? 'muted' : 'fg', size: side ? 10.5 : size, weight: side ? 500 : 600, baseline: 'middle', align: side ? 'center' : 'left', alpha: a });
          if (!side) fig.text(String(n.id), g.x - g.w / 2 + 16, g.y + 0.5, { color: col, size: size, weight: 700, baseline: 'middle', align: 'center', alpha: a });
          return;
        }
        var lines = wrap((side ? '' : n.id + '  ') + label, g.w - 14, side ? 11 : size, 600), top = n.id === 9 ? g.y - g.h / 2 + 13 : g.y - (lines.length - 1) * 7.5;
        lines.forEach(function (s, i) { fig.text(s, g.x, top + 15 * i, { color: side ? 'muted' : 'fg', size: side ? 11 : size, weight: side ? 500 : 600, align: 'center', baseline: 'middle', alpha: a }); });
        var subs = fig.measure('archimedean limit', 10.5, 500) > g.w - 8 ? ['prime side', 'archimedean'] : ['prime-side limit', 'archimedean limit'];
        if (n.id === 9) subs.forEach(function (s, i) {
          var yy = top + 15 * lines.length - 2 + 13 * i, tw = fig.measure(s, 10.5, 500);
          fig.text(s, g.x, yy, { color: 'muted', size: 10.5, align: 'center', baseline: 'middle', alpha: sh ? 0.4 * a : a });
          if (sh) fig.line(g.x - tw / 2 - 2, yy, g.x + tw / 2 + 2, yy, { color: 'muted', width: 1.2, alpha: 0.7 * a });
        });
      });

      // the content of the selected link, or the hint
      var head = sel ? (sel.kind === 'side' ? sel.name : sel.id + '  ' + sel.name) + '  ·  chapter ' + sel.ch : null;
      var body = sel ? (sel.id === 9 && sh ? sel.short : sel.text) : 'Hover or tap a link to read it. The spectral path (teal) and the geometric path (gold) meet once, in the Trace Formula.';
      if (narrow) {
        if (!sel) return;
        var bw = w - 16, ls = wrap(body, bw - 20, 11.5, 500), bh = 30 + 15 * ls.length, by = G[sel.id].y < h / 2 ? h - bh - 6 : 6;
        box({ x: w / 2, y: by + bh / 2, w: bw, h: bh }, { color: COLOR[sel.kind], width: 1.4 });
        fig.text(head, 18, by + 15, { color: COLOR[sel.kind] === 'fg' ? 'fg' : COLOR[sel.kind], size: 11.5, weight: 700, baseline: 'middle' });
        ls.forEach(function (s, i) { fig.text(s, 18, by + 32 + 15 * i, { color: 'fg', size: 11.5, baseline: 'middle' }); });
      } else {
        var iw = G['W'].x - G['W'].w / 2 - 24, ly = 16;
        if (head) { fig.text(head, 12, ly, { color: COLOR[sel.kind], size: 12.5, weight: 700, baseline: 'middle' }); ly += 18; }
        wrap(body, iw, 12.5, 500).slice(0, 3).forEach(function (s, i) { fig.text(s, 12, ly + 16 * i, { color: sel ? 'fg' : 'muted', size: 12.5, baseline: 'middle' }); });
      }
    };
  }
});
