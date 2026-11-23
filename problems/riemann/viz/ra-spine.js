/* The spine of the formal proof (chapter 18, section ra-map): nine nodes from Main.lean down to the named inputs, with
   arrows from what is used to what uses it. Wide stage: a grid of three columns and, under it, the open node's
   sentence, Lean declarations, and chapter. Phone: one column in an order where every arrow points up, links that
   skip rows drawn as arcs on the left, inputs on the right, and the open node in a box over the map. Text with inline
   math is written as 'words $texkey$ `code`'; long code names break after a dot or an underscore. */
Kit.register('ra-spine', {
  tex: { half: '\\Re s>\\tfrac12', s1: 's=1', Cy: 'Cy^\\theta', win: '[Y,Y^{1+\\delta}]', Y: 'Y', Res: '\\Re s>\\theta', chi: '\\chi',
    eps: '\\varepsilon', Gr: 'G_r', Grb: 'G_r(x)\\le x^{1/2+9\\varepsilon}', win32: '[Y,Y^{3/2}]', x: 'x', mlen: 'x^{1/2-\\varepsilon/16}',
    GLa: '\\mathrm{GL}_a', GLn: '\\mathrm{GL}_n', ell: '\\ell', Sha: '\\text{Sha}^1', E: 'E', QZ: '\\mathbb Q_\\ell/\\mathbb Z_\\ell',
    x401: 'x^{401}', shasum: '\\textstyle\\sum\\log\\#\\text{Sha}^1\\le e^{x^\\varepsilon/2}', zeta: '\\zeta', Lschi: 'L(s,\\chi)',
    trivial: '-2,-4,-6,\\dots', halfv: '\\tfrac12', N1: 'N\\ge1', strip: '0<\\Re s<1', m: 'm' },
  init: function (fig) {
    var CH = { 18: 'this chapter', 19: 'The last mile', 20: 'Forms you can hold', 21: 'Multiplicity without derivatives', 22: 'Paying for the chain',
      23: 'The arithmetic residue', 24: 'What the proof stands on' };
    var NODES = [
      { id: 1, name: 'Final theorems', box: 'Main.lean', col: 1, row: 0, color: 'violet', ch: [18, 19], lean: '`riemannHypothesis` and four others, `Main.lean`',
        text: 'Every zero of $zeta$ other than the trivial zeros $trivial$ has real part $halfv$. For every Dirichlet character $chi$ modulo $N1$, $Lschi$ is not zero whenever $half$, except at $s1$ for the principal character, and every zero of $Lschi$ with $strip$ has real part $halfv$.' },
      { id: 2, name: 'Half-plane', box: 'EveryCharacter', col: 1, row: 1, color: 'violet', ch: [19], lean: '`UpperTheory.EveryCharacter`, proved by `UpperTheory.FinalTheorems.everyCharacter`',
        text: 'No Dirichlet L-function vanishes on $half$, except the principal character at $s1$.' },
      { id: 3, name: 'Primitive half-plane', box: 'ZeroFreeAll', col: 1, row: 2, color: 'violet', ch: [19], lean: '`Formalism.HC.ZeroFreeAll`, `UpperTheory.Top.imprimitive`',
        text: 'The same for every primitive character, from which the imprimitive case follows by the Euler factors.' },
      { id: 4, name: 'Endgame', box: 'zeroFree_of_rpow_window', col: 0, row: 3, color: 'violet', ch: [19], lean: '`Deduction.zeroFree_of_rpow_window`',
        text: 'A positive combination of smoothed prime sums bounded above by $Cy$ on windows $win$ for arbitrarily large $Y$ forces zero-freeness on $Res$.' },
      { id: 5, name: 'Inequality on windows', box: 'ChebyshevInequalityOnWindows', col: 2, row: 3, color: 'gold', ch: [19, 22], lean: '`Formalism.HC.ChebyshevInequalityOnWindows`',
        text: 'For each primitive $chi$ and small $eps$, the combination $Gr$ of chapter 19 satisfies $Grb$ on windows $win32$.' },
      { id: 6, name: 'Automorphic construction', box: 'TopG, HypsAlt', col: 0, row: 4, color: 'teal', ch: [20, 21, 22],
        lean: '`UpperTheory.Top.TopG`, from `GlobalTheory.GLq.Green` and the record `GlobalTheory.Fc.HypsAlt`, assembled in `UpperTheory.Lit.every_character_of_theta_integrals_local_matching`',
        text: 'At each scale $x$, a chain of about $mlen$ theta lifts between totally definite unitary groups, with periods, integrality, and sizes, delivers the data from which node 5 follows.' },
      { id: 8, name: 'Cohomological window', box: 'VWin', col: 2, row: 4, color: 'teal', ch: [23], lean: '`UpperTheory.Top.VWin`, proved by `UpperTheory.One.vwin_of_row`',
        text: 'On a window of scales, the locally trivial Galois cohomology groups $Sha$ of an explicit abelian CM field $E$, with coefficients in the Tate twists of $QZ$, over all primes $ell$ and all twists below $x401$, have $shasum$.' },
      { id: 9, name: 'Published inputs', box: 'OpenLiteratureStatements', col: 0, row: 5, color: 'muted', ch: [24], lean: '`UpperTheory.LiteratureTheorems.OpenLiteratureStatements` and its wrappers',
        text: 'Published theorems restated as propositions and proved in the tree, through 185 wrapper theorems.' },
      { id: 7, name: 'Galois input', box: 'Row0b', col: 1, row: 5, color: 'teal', ch: [22], lean: '`UpperTheory.GalStar.Row0b`, proved from `UpperTheory.TP.TLiftK` and `UpperTheory.Gal.Int.Geo.GeoOne`',
        text: 'Every regular algebraic polarized cuspidal automorphic representation of $GLa$ over a CM field has an $ell$-adic Galois representation with the expected local properties. `Row0b` enters twice: it fills the literature record that builds the automorphic construction, and through `vwin_of_row` it proves the cohomological window.' },
      { id: 'L', name: 'recTExists', leaf: 1, col: 0, row: 6, dx: 0, color: 'muted', ch: [24], lean: '`UpperTheory.Zero.LLC.recTExists`',
        text: 'Local Langlands for $GLn$, also proved in the tree. With `Row0b` it fills the record of published inputs.' },
      { id: 'T', name: 'TLiftK', leaf: 1, col: 1, row: 6, dx: -1, color: 'muted', ch: [20, 22], lean: '`UpperTheory.TP.TLiftK`',
        text: 'Theta lifts exist between totally definite unitary groups in a stable range of ranks. Our reading: it is used once, to raise an even rank to an odd one on the Galois side, and the $m$-fold chain goes through `chainOp` and `ColumnChain` instead.' },
      { id: 'G', name: 'GeoOne', leaf: 1, col: 1, row: 6, dx: 1, color: 'muted', ch: [22], lean: '`UpperTheory.Gal.Int.Geo.GeoOne`',
        text: 'Finds Galois representations in the cohomology of varieties with Hecke correspondences.' }
    ];
    var EDGES = [[2, 1], [3, 2], [4, 3], [5, 3], [6, 5], [8, 5], [9, 6], [7, 9], [7, 8], ['T', 7], ['G', 7], ['L', 9]];
    var SUMMARY = 'Everything flows into one half-plane statement, and the endgame needs only an upper bound on windows. The three inputs named in the code are `Row0b`, `TLiftK` with `GeoOne`, and `VWin`, and all three are proved. `Row0b` enters twice: it fills the literature record that builds the automorphic construction, and through `vwin_of_row` it proves the cohomological window.';
    var IFACE = 'What the endgame consumes (`zero_free_all_of_green_v_win`): Green\'s parametrization (`Green`), the window statement `VWinAt ψ 401` for every primitive ψ, and a record of type `HypsAlt` with `DefiniteSideCondition`.';
    var byId = {}; NODES.forEach(function (n) { byId[n.id] = n; });
    var pinned = null, G = {}, traceFrom = null, tr = fig.tween(0);
    fig.button({ label: 'Trace to Main', onClick: function () {
      traceFrom = pinned || byId[7]; pinned = traceFrom;
      var d = depth(traceFrom), mx = 0; for (var k in d) mx = Math.max(mx, d[k]);
      tr.set(0); tr.to(mx, 60 * mx + 1, 'linear');
    } });
    var iface = fig.toggle({ label: 'Show the interface', value: false });
    fig.onReset = function () { pinned = null; traceFrom = null; tr.set(0); };
    var P = fig.plane({ x: [0, 1], y: [0, 1], pad: 0 });
    var probe = fig.probe({ plane: P, crosshair: false, marker: false, pick: function (x, y) {
      var n = hitNode(P.X(x), P.Y(y)); pinned = n === pinned ? null : n; if (traceFrom && n !== traceFrom) traceFrom = null; } });
    function hitNode(px, py) {
      for (var i = 0; i < NODES.length; i++) { var g = G[NODES[i].id]; if (g && Math.abs(px - g.x) <= g.w / 2 + 3 && Math.abs(py - g.y) <= g.h / 2 + 3) return NODES[i]; }
      return null;
    }
    function depth(n) {                                          // edges from n upward: distance of each node reached
      var d = {}, queue = [n.id]; d[n.id] = 0;
      while (queue.length) { var id = queue.shift(); EDGES.forEach(function (e) { if (e[0] === id && d[e[1]] == null) { d[e[1]] = d[id] + 1; queue.push(e[1]); } }); }
      return d;
    }

    /* Rich text, as in the ledger figure: words of parts { s, mono } or { tex }, wrapped by measured width. */
    var parsed = {}, wrapped = {};
    function parse(str) {
      if (parsed[str]) return parsed[str];
      var words = [], cur = [], buf = '', mode = '', glue = false;
      function flush() { if (buf) cur.push(mode === '$' ? { tex: buf } : { s: buf, mono: mode === '`' }); buf = ''; }
      function end(g) { flush(); if (cur.length) { words.push({ parts: cur, glue: glue }); glue = g; } cur = []; }
      for (var i = 0; i < str.length; i++) {
        var ch = str[i];
        if (ch === '$' || ch === '`') { flush(); mode = mode === ch ? '' : ch; continue; }
        if (ch === ' ' && mode !== '`') { end(false); continue; }
        buf += ch;
        if (mode === '`' && (ch === '.' || ch === '_') && buf.length > 3) end(true);
      }
      end(false);
      return (parsed[str] = words);
    }
    function partW(p, size) { return p.tex ? fig.labelSize(p.tex, size).w : fig.measure(p.s, p.mono ? size - 1 : size, 500, p.mono); }
    /* Lines of runs: neighboring words of one style become one string, so a line costs a few fillText calls. */
    function wrap(str, width, size) {
      var key = str + '|' + Math.round(width) + '|' + size;
      if (wrapped[key]) return wrapped[key];
      var lines = [], line = [], x = 0, prev = null, sp = fig.measure(' ', size);
      parse(str).forEach(function (wd) {
        var ww = 0; wd.parts.forEach(function (p) { ww += partW(p, size); });
        var space = line.length > 0 && !wd.glue;
        if (line.length && x + (space ? sp : 0) + ww > width) { lines.push(line); line = []; x = 0; prev = null; space = false; }
        if (space) x += sp;
        wd.parts.forEach(function (p, i) {
          var st = p.tex ? -1 : p.mono ? 2 : 0;
          if (prev && st >= 0 && prev.st === st) prev.s += (space && i === 0 ? ' ' : '') + p.s;
          else line.push(prev = st < 0 ? { x: x, tex: p.tex, st: -1 } : { x: x, s: p.s, st: st });
          x += partW(p, size);
        });
      });
      if (line.length) lines.push(line);
      return (wrapped[key] = lines);
    }
    function drawText(lines, x, y, size, lh, color) {
      [-1, 0, 2].forEach(function (st) {
        lines.forEach(function (line, li) {
          line.forEach(function (r) {
            if (r.st !== st) return;
            if (st < 0) fig.label(r.tex, x + r.x, y + li * lh, { anchor: 'w', color: color, size: size, id: fig.autoId('rt', r.tex) });
            else fig.text(r.s, x + r.x, y + li * lh, { color: st ? 'muted' : color, size: st ? size - 1 : size, mono: st === 2, baseline: 'middle' });
          });
        });
      });
    }
    function box(g, color, width, alpha, dash) {
      var ctx = fig.ctx;
      ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(g.x - g.w / 2, g.y - g.h / 2, g.w, g.h, 6); else ctx.rect(g.x - g.w / 2, g.y - g.h / 2, g.w, g.h);
      ctx.fillStyle = fig.color('stage', 0.96); ctx.fill();
      fig.stroke({ color: color, width: width, alpha: alpha, dash: dash }); ctx.stroke(); ctx.setLineDash([]);
    }
    /* A link as in the page's other diagrams: a polyline over a stage-colored halo 4 px wider, ending in an arrowhead. */
    function poly(pts, color, width, alpha, dash, head) {
      var ctx = fig.ctx, n = pts.length;
      [[fig.color('stage'), width + 4, 1, null], [color, width, alpha, dash]].forEach(function (s) {
        fig.stroke({ color: s[0], width: s[1], alpha: s[2], dash: s[3] });
        ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]);
        for (var i = 1; i < n - 1; i++) ctx.lineTo(pts[i][0], pts[i][1]);
        ctx.stroke(); ctx.setLineDash([]);
      });
      fig.arrow(pts[n - 2][0], pts[n - 2][1], pts[n - 1][0], pts[n - 1][1], { color: color, width: width, alpha: alpha, head: head, dash: dash });
    }

    /* Grid: rows 0..6 over the map's height, three columns. */
    function gridLayout(w, mapH) {
      var pitchX = (w - 16) / 3, X = function (c) { return 8 + pitchX * (c + 0.5); }, pitchY = mapH / 7, Y = function (r) { return pitchY * (r + 0.5) + 2; };
      var nw = Math.min(250, pitchX - 18), nh = Math.min(38, pitchY - 18), lw = Math.min(110, (pitchX - 24) / 2);
      NODES.forEach(function (n) { G[n.id] = { x: X(n.col) + (n.dx || 0) * (lw / 2 + 6), y: Y(n.row), w: n.leaf ? lw : nw, h: n.leaf ? Math.min(26, nh) : nh }; });
      var g = G, T = function (id) { return g[id].y - g[id].h / 2; }, B = function (id) { return g[id].y + g[id].h / 2; };
      var Lf = function (id) { return g[id].x - g[id].w / 2; }, Rt = function (id) { return g[id].x + g[id].w / 2; }, q = nw / 4, gap45 = (B(5) + T(8)) / 2;
      return { '2-1': [[X(1), T(2)], [X(1), B(1)]], '3-2': [[X(1), T(3)], [X(1), B(2)]],
        '4-3': [[X(0), T(4)], [X(0), Y(2)], [Lf(3), Y(2)]], '5-3': [[X(2), T(5)], [X(2), Y(2)], [Rt(3), Y(2)]],
        '6-5': [[X(0) + q, T(6)], [X(0) + q, gap45], [X(2) - q, gap45], [X(2) - q, B(5)]], '8-5': [[X(2) + q, T(8)], [X(2) + q, B(5)]],
        '9-6': [[X(0), T(9)], [X(0), B(6)]], '7-9': [[Lf(7), Y(5)], [Rt(9), Y(5)]], '7-8': [[Rt(7), Y(5)], [X(2), Y(5)], [X(2), B(8)]],
        'T-7': [[g.T.x, T('T')], [g.T.x, B(7)]], 'G-7': [[g.G.x, T('G')], [g.G.x, B(7)]], 'L-9': [[X(0), T('L')], [X(0), B(9)]] };
    }
    /* Phone: one column, order 1 2 3 4 5 6 8 9 7, inputs on the right of 9 and 7. */
    function columnLayout(w, h) {
      var pitch = (h - 8) / 10, y = function (r) { return 6 + pitch * (r + 0.5); }, L = 44, lw = 82, nw = Math.min(230, w - L - lw - 22), R = L + nw;
      var rows = { 1: 0, 2: 1, 3: 2, 4: 3, 5: 4, 6: 5, 8: 6, 9: 7, 7: 8, L: 7, T: 8, G: 9 }, nh = Math.min(24, pitch - 6);
      NODES.forEach(function (n) { G[n.id] = { x: n.leaf ? w - 6 - lw / 2 : L + nw / 2, y: y(rows[n.id]), w: n.leaf ? lw : nw, h: nh }; });
      var cx = L + nw / 2, d = function (k) { return L - 6 - 12 * (k - 1); }, v = function (a, b) { return [[cx, y(a) - nh / 2], [cx, y(b) + nh / 2]]; };
      var arc = function (a, b, k) { return [[L, y(a) - 3], [d(k), y(a) - 3], [d(k), y(b) + 3], [L, y(b) + 3]]; }, LX = w - 6 - lw;
      return { '2-1': v(1, 0), '3-2': v(2, 1), '4-3': v(3, 2), '6-5': v(5, 4), '7-9': v(8, 7),
        '5-3': arc(4, 2, 1), '8-5': arc(6, 4, 2), '9-6': arc(7, 5, 1), '7-8': arc(8, 6, 3),
        'L-9': [[LX, y(7)], [R, y(7)]], 'T-7': [[LX, y(8)], [R, y(8)]], 'G-7': [[LX + 10, y(9) - nh / 2], [LX + 10, y(9) - pitch / 2], [R + 12, y(9) - pitch / 2], [R + 12, y(8) + nh / 2 - 2], [R, y(8) + nh / 2 - 2]] };
    }

    function chapters(n) { return 'Chapter' + (n.ch.length > 1 ? 's ' : ' ') + n.ch.map(function (c) { return c + ', ' + CH[c]; }).join('; '); }
    var panelFor = {};                                           // panel height that holds every node's text at this size
    function panelHeight(w, h, size, lh) {
      var key = w + 'x' + h;
      if (panelFor[key]) return panelFor[key];
      var est = function (str) { return Math.ceil(1.1 * fig.measure(str.replace(/\$|`/g, ''), size) / (w - 46)); };   // lines, from one measure
      var need = Math.max(est(SUMMARY), est(IFACE)) * lh + 30;
      NODES.forEach(function (n) { need = Math.max(need, (est(n.text) + est(n.lean)) * lh + 52); });
      return (panelFor[key] = Kit.clamp(need, 100, 0.42 * h));
    }

    return function draw() {
      var w = fig.w, h = fig.h, narrow = w < 600;
      var size = narrow ? 11.5 : 12.5, lh = narrow ? 15.5 : 18, panelH = narrow ? 0 : panelHeight(w, h, size, lh), mapH = h - panelH;
      var routes = narrow ? columnLayout(w, h) : gridLayout(w, mapH);
      var hov = probe.active ? hitNode(P.X(probe.x), P.Y(probe.y)) : null, sel = hov || pinned;
      // the selected node and what it feeds keep full strength; Trace to Main brightens that path edge by edge
      var trace = traceFrom ? depth(traceFrom) : sel ? depth(sel) : null, tv = traceFrom && !Kit.reducedMotion ? tr.value : 99;

      if (iface.value) {                                         // the interface: nodes 6 and 8
        var a = G[6], b = G[8], x0 = a.x - a.w / 2 - 7, x1 = narrow ? a.x + a.w / 2 + 7 : b.x + b.w / 2 + 7, y0 = a.y - a.h / 2 - 7, y1 = b.y + b.h / 2 + 7;
        fig.rect(x0, y0, x1 - x0, y1 - y0, { fill: 'teal', alpha: 0.06 });
        fig.rect(x0, y0, x1 - x0, y1 - y0, { color: 'teal', width: 1.3, dash: [5, 4] });
        if (!narrow) ['what the endgame consumes:', 'Green, VWin, HypsAlt'].forEach(function (s, i) {
          fig.text(s, (a.x + b.x) / 2, a.y - 7 + 15 * i, { color: 'teal', size: 11.5, weight: i ? 600 : 500, align: 'center', baseline: 'middle', mono: i === 1 });
        });
      }
      EDGES.forEach(function (e) {
        var inSet = trace && trace[e[0]] != null && trace[e[1]] != null;
        var lit = inSet && (!traceFrom || (trace[e[1]] === trace[e[0]] + 1 && tv >= trace[e[0]] + 1 - 1e-6));
        var src = byId[e[0]];
        poly(routes[e[0] + '-' + e[1]], src.color, lit ? 2.4 : 1.6, trace && !inSet ? 0.22 : 1, src.leaf ? [4, 3] : null, narrow ? 6 : 8);
      });
      var al = function (n) { return !trace || trace[n.id] != null ? 1 : 0.3; }, two = !narrow && G[1].h >= 36;
      var ns = Math.min(size, size * (G[1].w - 34) / fig.measure('Automorphic construction', size, 600));
      NODES.forEach(function (n) { box(G[n.id], n.color, sel === n ? 2.6 : n.leaf ? 1.2 : 1.7, al(n), n.leaf ? [4, 3] : null); });
      NODES.forEach(function (n) {                               // text grouped by font: numbers, names, code
        var g = G[n.id];
        if (!n.leaf) fig.text(String(n.id), g.x - g.w / 2 + 14, two ? g.y - 8 : g.y + 0.5, { color: n.color, size: ns, weight: 700, align: 'center', baseline: 'middle', alpha: al(n) });
      });
      NODES.forEach(function (n) {
        var g = G[n.id];
        if (!n.leaf) fig.text(n.name, g.x - g.w / 2 + 26, two ? g.y - 8 : g.y + 0.5, { color: 'fg', size: ns, weight: 600, baseline: 'middle', alpha: al(n) });
      });
      NODES.forEach(function (n) {
        var g = G[n.id];
        if (n.leaf) { fig.text(n.name, g.x, g.y + 0.5, { color: 'muted', size: 10.5, mono: true, align: 'center', baseline: 'middle', alpha: al(n) }); return; }
        if (!two) return;
        var bx = n.box;
        while (fig.measure(bx, 10.5, 500, true) > g.w - 36 && bx.length > 4) bx = bx.slice(0, -2);
        if (bx !== n.box) bx = bx.slice(0, -1) + '…';
        fig.text(bx, g.x - g.w / 2 + 26, g.y + 9, { color: 'muted', size: 10.5, mono: true, baseline: 'middle', alpha: al(n) });
      });

      // the open node, or the summary
      var head = sel ? (sel.leaf ? sel.name : sel.id + '  ' + sel.name) : null, hc = sel ? (sel.color === 'muted' ? 'fg' : sel.color) : 'teal';
      if (narrow) {
        var body = sel ? sel.text : iface.value ? IFACE : null;
        if (!body) return;
        var bw = w - 12, T1 = wrap(body, bw - 20, size), T2 = sel ? wrap(sel.lean, bw - 20, size) : [], T3 = sel ? wrap(chapters(sel), bw - 20, 11) : [];
        var bh = 28 + lh * (T1.length + T2.length) + 14 * T3.length + (sel ? 6 : 0), top = sel && G[sel.id].y < h / 2 ? h - bh - 4 : 4;
        box({ x: w / 2, y: top + bh / 2, w: bw, h: bh }, sel ? sel.color : 'teal', 1.5, 1);
        fig.text(head || 'The interface', 16, top + 14, { color: hc, size: 12, weight: 700, baseline: 'middle' });
        drawText(T1, 16, top + 32, size, lh, 'fg');
        if (sel) { drawText(T2, 16, top + 32 + lh * T1.length + 2, size, lh, 'muted'); drawText(T3, 16, top + 36 + lh * (T1.length + T2.length), 11, 14, 'muted'); }
        return;
      }
      var py = mapH + 4, pw = w - 16, tx = 22, ty2 = py + 16, txt = sel ? sel.text : iface.value ? IFACE : SUMMARY;
      box({ x: w / 2, y: py + (panelH - 8) / 2, w: pw, h: panelH - 8 }, sel ? sel.color : 'muted', 1.2, 0.9);
      if (head) {
        var hw = fig.measure(head, 12.5, 700), cs = chapters(sel);
        if (hw + 30 + fig.measure(cs, 12, 500) > pw - 30) cs = 'Chapter' + (sel.ch.length > 1 ? 's ' : ' ') + sel.ch.join(', ');
        fig.text(head, tx, ty2, { color: hc, size: 12.5, weight: 700, baseline: 'middle' });
        fig.text('·   ' + cs, tx + hw + 14, ty2, { color: 'muted', size: 12, baseline: 'middle' });
        ty2 += 20;
      }
      var lines = wrap(txt, pw - 30, size);
      drawText(lines, tx, ty2, size, lh, 'fg');
      if (sel) drawText(wrap(sel.lean, pw - 30, size), tx, ty2 + lh * lines.length + 2, size, lh, 'muted');
      else fig.text('Hover or tap a node to open it.', w - 22, py + panelH - 18, { color: 'muted', size: 11, align: 'right', baseline: 'middle' });
    };
  }
});
