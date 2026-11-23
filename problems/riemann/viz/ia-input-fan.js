/* The published theorems under the assembly theorem. Boxes: EveryCharacter, the assembly theorem
   every_character_of_literature_of_vWin and its argument O, the seven arguments it hands on (P, F, ThetaIntegralsAgree,
   LocalMatching, CovolumeBoundOfX, RecTExists, VWin), and Row0b with TLiftK and GeoOne. Blue circles: the published
   theorems of chapter 24's table, area proportional to the lines (or files) of their dependency cones. Arrows run from
   what is used to what uses it. Wide stage: layered top to bottom; phone: one row per argument, theorems to the right. */
Kit.register('ia-input-fan', {
  init: function (fig) {
    var fmt = Kit.fmt;
    var BOXES = [
      ['EC', ['EveryCharacter'], 'violet', ['EveryCharacter', 'L(s, χ) ≠ 0 for Re s > ½ and every Dirichlet character χ, except s = 1 for trivial χ. Main.lean turns it into the five theorems.']],
      ['A', ['every_character_of_literature_of_vWin'], 'violet', ['The assembly theorem (line 810)', 'From O and hV it builds seven arguments and calls every_character_of_theta_integrals_local_matching.']],
      ['O', ['OpenLiteratureStatements'], 'muted', ['O : OpenLiteratureStatements', 'A record of Row0b (fields 1 and 3) and RecTExists (field 2), filled as ⟨h, recTExists, h⟩.']],
      ['P', ['P', '60 results'], 'muted', ['P : UnitaryGroupThirdPlaceHypotheses', 'A record of 60 published results, built by published_results_eigen.'], 'P · 60 published results'],
      ['F', ['F', '53 results'], 'muted', ['F : ThetaLocalInputs', 'A record of 53 published results, built by published_results_first.'], 'F · 53 published results'],
      ['TIA', ['ThetaIntegrals', 'Agree'], 'muted', ['hA : ThetaIntegralsAgree', 'From theoremK_head2 applied to EisBL and SiegelWeilStd.'], 'ThetaIntegralsAgree'],
      ['LM', ['Local', 'Matching'], 'muted', ['hM : LocalMatching', 'From theoremK_head2 applied to EisBL and SiegelWeilStd.'], 'LocalMatching'],
      ['X', ['CovolumeBound', 'OfX'], 'muted', ['hX : CovolumeBoundOfX', 'From topCovolSlim2_use_alt_alt and its 15 geometric inputs, one of them the 28-field record PublishedHodgeBundleTheorems.'], 'CovolumeBoundOfX'],
      ['L', ['RecTExists'], 'muted', ['hL : RecTExists, local Langlands in a weak form', 'Proved by recTExists, whose cone has 1,790 files and 236,746 lines.']],
      ['V', ['VWin'], 'teal', ['hV : VWin, the window bound', 'Proved from Row0b by vwin_of_row.']],
      ['R', ['Row0b'], 'teal', ['Row0b', 'Galois representations for polarized cuspidal representations over CM fields, proved from TLiftK and GeoOne.']],
      ['G1', ['GeoOne'], 'muted', ['GeoOne', 'Galois representations from geometry, proved with the holomorphic Lefschetz formula.']],
      ['TL', ['TLiftK'], 'muted', ['TLiftK', 'Theta lifts exist.']]
    ].map(function (b) { return { id: b[0], lines: b[1], color: b[2], info: b[3], one: b[4] || b[1].join('') }; });
    // [id, short label, usual name, Lean name, cone files, cone lines, parents, role, note]
    var LEAVES = [
      ['res', 'Resolution', 'Resolution in characteristic 0 (Hironaka)', 'ResolutionCharZero', 467, 134960, ['X'], 'Input 1 of the covolume theorem'],
      ['prin', 'Principalization', 'Principalization of ideals (Hironaka)', 'PrincipalisationCharZero', 393, 114992, ['X'], 'Input 2 of the covolume theorem'],
      ['nad', 'Nadel', 'Nadel vanishing, with point separation', 'NadelVanishingAndNonKltDivisor', 1518, 240897, ['X'], 'Gives PointSeparationPair, input 12, and a field of the Hodge-bundle record'],
      ['kv', 'Kawamata', 'Kawamata and Viehweg vanishing', 'KawamataViehweg', 137, 46073, ['X'], 'A field of the Hodge-bundle record, derived from the Nadel pair', 'given Nadel'],
      ['pl', 'Poincaré–Lelong', 'Poincaré and Lelong formula', 'PoincareLelongInv', 889, 108474, ['X'], 'Input 3 of the covolume theorem'],
      ['mor', 'Bigness', 'Arithmetic bigness (the code\'s name: Moriwaki)', 'MoriwakiBigStatement', 2985, 479232, ['X'], 'Input 5 of the covolume theorem'],
      ['ahs', 'Hilbert–Samuel', 'Arithmetic Hilbert and Samuel formula', 'ArithHilbertSamuel', 1457, 163762, ['X'], 'A field of the Hodge-bundle record'],
      ['cyc', 'Heights', 'Heights of cycles', 'CycleHeights', 1194, 181377, ['X'], 'A field of the Hodge-bundle record'],
      ['tor', 'Toroidal', 'Toroidal compactification of Shimura varieties', 'ToroidalCompactification', 10289, 1051258, ['X'], 'A field of the Hodge-bundle record and inputs 9 and 10', 'at least; the tool stopped at its cap'],
      ['far', 'Fargues', 'Exactness of the Hodge and Tate sequence (Fargues)', 'FarguesExact', 702, 54462, ['X'], 'Input 6 of the covolume theorem'],
      ['zar', 'Zarhin', 'Zarhin\'s trick', 'ZarhinStatement', 808, 145999, ['X'], 'Input 7 of the covolume theorem'],
      ['gm', 'Grothendieck–Messing', 'Grothendieck and Messing deformation theory', 'GrothendieckDeformation', 2234, 231458, ['X'], 'Input 15 of the covolume theorem', 'through AbelianLifting'],
      ['fa', 'Existence', 'Grothendieck\'s existence theorem', 'FormalAlgebraisation', 486, 77826, ['X'], 'A field of the Hodge-bundle record'],
      ['sw', 'Siegel–Weil', 'Siegel and Weil formula, definite case', 'SiegelWeilStd', 3333, 397791, ['TIA', 'LM'], 'With EisBL, proves ThetaIntegralsAgree and LocalMatching'],
      ['eis', 'EisBL', 'Continuation of the Siegel Eisenstein series', 'EisBL', 385, 58584, ['TIA', 'LM'], 'With SiegelWeilStd, proves ThetaIntegralsAgree and LocalMatching'],
      ['art', 'Artin', 'Artin reciprocity', 'GlobalArtinReciprocity', 235, 50213, ['L'], 'Local Artin maps for the weak local Langlands map'],
      ['chv', 'Chevalley', 'Chevalley\'s theorem on units', 'ChevalleyUnits', 73, 7151, ['L'], 'Injectivity of the local-to-global Artin map'],
      ['bra', 'Brauer', 'Brauer induction, degree-zero form', 'BrauerDegreeZero', 61, 4332, ['L'], 'Used to build the local Langlands map'],
      ['grn', 'Green', 'Cuspidal characters of finite general linear groups (Green)', 'Green', 224, 17396, ['L'], 'The type law of the weak local Langlands map'],
      ['lc', 'Classification', 'Langlands classification', 'LanglandsExhaustionGL', 24, 1381, ['L'], 'Extends the map from cuspidal to all representations', 'size of the proof folder, not a cone'],
      ['chb', 'Chebotarev', 'Chebotarev, one degree-one prime', 'ChebotarevDegreeOne', 66, 6536, ['P'], 'A field of P: auxiliary primes'],
      ['gcu', 'Green', 'Cuspidal characters of finite general linear groups (Green)', 'GreenCuspidal', 224, 17396, ['P'], 'Through the field greenRegularCharacters of P, the first hypothesis of every_character_of_green_v_win'],
      ['wsu', 'Unitary Siegel–Weil', 'Siegel and Weil formula, convergent range for unitary groups', 'WeilSiegelFormulaUnitary', 0, 0, ['P', 'F'], 'Fields of both bundles', 'not measured'],
      ['hk', 'Hecke L', 'Hecke L-functions are entire and nonzero at 1', 'HeckeLEntireAndNonzeroAtOne', 59, 8678, ['F'], 'A field of F: Dirichlet-type primes in number fields'],
      ['lin', 'Linnik', 'Linnik\'s theorem', 'Linnik', 101, 14814, ['F'], 'A field of F: least auxiliary primes in progressions'],
      ['lef', 'Lefschetz', 'Holomorphic Lefschetz formula (Atiyah and Bott)', 'HolomorphicLefschetzFormula', 524, 82938, ['G1'], 'Proves GeoOne, hence the Galois representations of Row0b']
    ].map(function (l) { return { id: l[0], short: l[1], name: l[2], lean: l[3], v: [l[4], l[5]], parents: l[6], role: l[7], note: l[8], leaf: true }; });
    var EDGES = [['P', 'A'], ['F', 'A'], ['TIA', 'A'], ['LM', 'A'], ['X', 'A'], ['L', 'A'], ['V', 'A'], ['O', 'A'], ['A', 'EC'], ['R', 'V'], ['R', 'O'], ['G1', 'R'], ['TL', 'R']];
    LEAVES.forEach(function (l) { l.parents.forEach(function (p) { EDGES.push([l.id, p]); }); });
    var G = {}, ALL = BOXES.concat(LEAVES);                    // geometry of this frame: boxes { x, y, w, h }, leaves { x, y, r }
    var byId = {};
    ALL.forEach(function (n) { G[n.id] = {}; byId[n.id] = n; });
    var VMAX = [10289, 1051258], GROUPS = [['P', 'F'], ['TIA', 'LM'], ['L'], ['X']];

    var mode = 1, mix = fig.tween(1);                           // 1: lines, 0: files
    var bl = fig.button({ label: 'Area: lines', pressed: true, onClick: function () { setMode(1); } });
    var bf = fig.button({ label: 'Area: files', pressed: false, onClick: function () { setMode(0); } });
    function setMode(m) { if (m === mode) return; mode = m; bl.press(m === 1); bf.press(m === 0); mix.to(m, 350, 'inOutCubic'); }
    fig.onReset = function () { pinned = null; setMode(1); };
    var P = fig.plane({ x: [0, 1], y: [0, 1], pad: 0 }), pinned = null;
    var probe = fig.probe({ plane: P, crosshair: false, marker: false, pick: function (x, y) { var n = hit(P.X(x), P.Y(y)); pinned = n === pinned ? null : n; } });
    function hit(px, py) {
      for (var i = 0; i < ALL.length; i++) {
        var n = ALL[i], g = G[n.id];
        if (n.leaf ? Math.hypot(px - g.x, py - g.y) <= Math.max(g.r, 7) + 2 : Math.abs(px - g.x) <= g.w / 2 + 2 && Math.abs(py - g.y) <= g.h / 2 + 2) return n;
      }
      return null;
    }
    function radius(l, rmax) {
      if (!l.v[1]) return 4;
      var m = mix.value, a = rmax * Math.sqrt(l.v[1] / VMAX[1]), b = rmax * Math.sqrt(l.v[0] / VMAX[0]);
      return Math.max(2.5, b + (a - b) * m);
    }
    /* A canvas font the kit has not prepared (kit README, "Performance rules") costs 2 to 20 ms at 4x CPU slowdown the
       first time it is used: the bold monospace of EveryCharacter was a third of the first frame. Such text waits:
       a frame that meets a cold font leaves that text out and queues the font, a job creates the queued fonts one per
       frame on the kit's measuring context, and the next frames draw the text. Widths in a cold font are estimated
       from the 12 px width at weight 500; once every font is warm, they are measured exactly. */
    var warm = {}, cold = [], warming = null;
    function ready(size, weight, mono) {
      var k = fig.font(size, weight, mono);
      if (warm[k] || (mono ? weight === 500 && size >= 11 && size <= 12.5 : weight === 700 ? size >= 11.5 && size <= 12.5 : size >= 10.5 && size <= 13)) return true;
      if (!(k in warm)) { warm[k] = false; cold.push([size, weight, mono]); }
      return false;
    }
    function width(str, size, weight, mono) { return ready(size, weight, mono) ? fig.measure(str, size, weight, mono) : fig.measure(str, 12, 500, mono) * size / 12; }
    function warmUp() {
      if (!cold.length || warming) return;
      warming = fig.job(function* () {
        while (cold.length) { var c = cold.shift(); fig.measure('EveryCharacter_0123456789', c[0], c[1], c[2]); warm[fig.font(c[0], c[1], c[2])] = true; yield; }
      }, { onDone: function () { warming = null; } });
    }
    var wrapped = {};
    function wrap(str, width, size, weight) {
      weight = weight || 500;
      var key = str + '|' + Math.round(width) + '|' + size + '|' + weight;
      if (wrapped[key]) return wrapped[key];
      var out = [], cur = '', cw = 0, sp = fig.measure(' ', size, weight);   // words measured once each, not every prefix
      str.split(' ').forEach(function (wd) { var ww = fig.measure(wd, size, weight); if (cur && cw + sp + ww > width) { out.push(cur); cur = wd; cw = ww; } else { cur = cur ? cur + ' ' + wd : wd; cw += (cw ? sp : 0) + ww; } });
      if (cur) out.push(cur);
      return (wrapped[key] = out);
    }
    /* A link between two boxes runs over a stage-colored halo 4 px wider, as in the page's other diagrams: the same
       path as the link itself, drawn once more under it. */
    function halo(a, b, e) {
      var hs = { color: 'stage', width: 5.6 }, narrowNow = fig.w < 640;
      if (narrowNow) {
        if (e[1] === 'A' && e[0] !== 'EC') { fig.line(a.x - a.w / 2, a.y, 9, a.y, hs); fig.line(9, a.y, 9, b.y, hs); }
        else if (e[1] === 'EC') fig.line(b.x, a.y - a.h / 2, b.x, b.y + b.h / 2, hs);
        else if (e[0] === 'R' && e[1] === 'V') { var xr = a.x + a.w / 2 + 8; fig.line(a.x + a.w / 2, a.y, xr, a.y, hs); fig.line(xr, a.y, xr, b.y, hs); fig.line(xr, b.y, b.x + b.w / 2, b.y, hs); }
        else fig.line(a.x, a.y - a.h / 2, e[1] === 'R' ? a.x : b.x, b.y + b.h / 2, hs);
      } else if (e[0] === 'O' || (e[0] === 'R' && e[1] === 'V')) fig.line(a.x - a.w / 2, a.y, b.x + b.w / 2, b.y, hs);
      else if (e[0] === 'R') fig.line(a.x, a.y - a.h / 2, a.x, G.O.y + G.O.h / 2, hs);
      else if (e[1] === 'A') { var k = ['P', 'F', 'TIA', 'LM', 'L', 'X', 'V'].indexOf(e[0]); fig.line(a.x, a.y - a.h / 2, b.x - b.w / 2 + (k + 0.5) / 7 * b.w, b.y + b.h / 2, hs); }
      else fig.line(a.x, a.y - a.h / 2, b.x, b.y + b.h / 2, hs);
    }
    function setBox(id, x, y, w, h) { var g = G[id]; g.x = x; g.y = y; g.w = w; g.h = h; }

    function wideLayout(w, h, fs) {
      var pc = (w - 16) / 8, bw = pc - 10, y2 = 0.35 * h, yA = 0.18 * h, oW = width(BOXES[2].lines[0], fs, 500, true) + 18;
      var aW = width(BOXES[1].lines[0], fs, 500, true) + 18;
      ['P', 'F', 'TIA', 'LM', 'L', 'X', 'V', 'R'].forEach(function (id, i) { setBox(id, 8 + (i + 0.5) * pc, y2, bw, 36); });
      var ox = Math.min(G.R.x, w - 8 - oW / 2); setBox('O', ox, yA, oW, 26);
      var ax = Math.min(w / 2, ox - oW / 2 - 16 - aW / 2); setBox('A', ax, yA, aW, 26);
      setBox('EC', ax, 26, width('EveryCharacter', fs, 700, true) + 22, 28);
      var gw = Math.max(width('GeoOne', fs, 500, true), width('TLiftK', fs, 500, true)) + 14, gx = Math.min(G.R.x, w - 8 - gw - 3);
      setBox('G1', gx - gw / 2 - 3, y2 + 62, gw, 24); setBox('TL', gx + gw / 2 + 3, y2 + 62, gw, 24);
      var top = y2 + 18 + 22, rmax = Kit.clamp(Math.min(0.068 * w, (h - top - 40) / 3.6), 14, 54), clusters = [];
      GROUPS.forEach(function (grp) {                          // shelf-pack each group's theorems, largest first
        var items = LEAVES.filter(function (l) { return grp.indexOf(l.parents[0]) >= 0; }).sort(function (a, b) { return b.v[1] - a.v[1]; });
        var maxW = grp[0] === 'X' ? 0.4 * w : 0.17 * w, rows = [[]], rw = 0;
        items.forEach(function (l) { var d = 2 * radius(l, rmax); if (rw + d > maxW && rows[rows.length - 1].length) { rows.push([]); rw = 0; } rows[rows.length - 1].push(l); rw += d + 7; });
        var width = Math.max.apply(null, rows.map(function (r) { return r.reduce(function (s, l) { return s + 2 * radius(l, rmax) + 7; }, -7); }));
        var cx = grp.reduce(function (s, id) { return s + G[id].x; }, 0) / grp.length;
        clusters.push({ rows: rows, w: width, x0: cx - width / 2 });
      });
      var lim = Math.min(G.R.x - pc / 2 - 4, gx - gw - 3 - 10);
      for (var i = 0; i < clusters.length; i++) clusters[i].x0 = Math.max(clusters[i].x0, i ? clusters[i - 1].x0 + clusters[i - 1].w + 14 : 10);
      for (i = clusters.length - 1; i >= 0; i--) clusters[i].x0 = Math.min(clusters[i].x0, i < clusters.length - 1 ? clusters[i + 1].x0 - 14 - clusters[i].w : lim - clusters[i].w);
      clusters.forEach(function (c) {
        var y = top;
        c.rows.forEach(function (row) {
          var rm = Math.max.apply(null, row.map(function (l) { return radius(l, rmax); })), x = c.x0 + (c.w - row.reduce(function (s, l) { return s + 2 * radius(l, rmax) + 7; }, -7)) / 2;
          row.forEach(function (l) { var r = radius(l, rmax); G[l.id].x = x + r; G[l.id].y = y + rm; G[l.id].r = r; x += 2 * r + 7; });
          y += 2 * rm + 22;
        });
      });
      var rl = radius(LEAVES[25], rmax); G.lef.x = G.G1.x; G.lef.y = G.G1.y + 12 + 20 + rl; G.lef.r = rl;
    }
    function narrowLayout(w, h, fs) {
      var pitch = (h - 8) / 12, bh = Math.min(20, pitch - 5), L = 20, bw = Math.min(190, 0.44 * w), y = function (r) { return 4 + (r + 0.5) * pitch; };
      var ROWS = { EC: 0, A: 1, P: 2, F: 3, TIA: 4, LM: 5, X: 6, L: 7, V: 8, O: 9, R: 10 };
      Object.keys(ROWS).forEach(function (id) {
        var tw = width(id === 'EC' ? 'EveryCharacter' : id === 'A' ? BOXES[1].lines[0] : BOXES.filter(function (b) { return b.id === id; })[0].one, fs, 500, true);
        setBox(id, L + Math.max(bw, id === 'A' ? tw + 14 : 0) / 2, y(ROWS[id]), id === 'A' ? Math.max(bw, tw + 14) : id === 'EC' ? tw + 20 : bw, bh);
        if (id === 'EC') G.EC.x = L + G.EC.w / 2;
      });
      var gw = (bw - 8) / 2; setBox('TL', L + gw / 2, y(11), gw, bh); setBox('G1', L + gw + 8 + gw / 2, y(11), gw, bh);
      var rmax = Math.min(11, pitch / 2 - 1.5), x0 = L + bw + 10, ends = {};
      LEAVES.slice().sort(function (a, b) { return b.v[1] - a.v[1]; }).forEach(function (l) {
        var two = l.parents.length === 2, key = l.parents.join('+'), r = radius(l, rmax);
        var start = ends[key] != null ? ends[key] : two ? Math.max(ends[l.parents[0]] || x0, ends[l.parents[1]] || x0) + 4 : x0;
        G[l.id].x = start + r; G[l.id].r = r;
        G[l.id].y = two ? (G[l.parents[0]].y + G[l.parents[1]].y) / 2 : G[l.parents[0]].y;
        ends[key] = start + 2 * r + 3;
      });
    }

    return function draw() {
      var w = fig.w, h = fig.h, narrow = w < 640, fs = narrow ? 10.5 : 11.5, ctx = fig.ctx;
      if (narrow) narrowLayout(w, h, fs); else wideLayout(w, h, fs);
      var hov = probe.active ? hit(P.X(probe.x), P.Y(probe.y)) : null, sel = hov || pinned, lit = null;
      if (sel) { lit = {}; var stack = [sel.id]; while (stack.length) { var id = stack.pop(); if (lit[id]) continue; lit[id] = 1; EDGES.forEach(function (e) { if (e[0] === id) stack.push(e[1]); }); } }
      var on = function (id) { return !lit || lit[id]; };
      function bot(id) { return G[id].y + G[id].h / 2; }
      function topY(id) { return G[id].y - G[id].h / 2; }

      // edges, under the nodes
      EDGES.forEach(function (e) {
        var a = G[e[0]], b = G[e[1]], src = byId[e[0]], live = on(e[0]) && on(e[1]);
        var st = { color: src.leaf ? 'blue' : src.color === 'muted' ? 'muted' : src.color, width: lit && live ? (src.leaf ? 2 : 2.4) : src.leaf ? 1 : 1.6, alpha: live ? (src.leaf ? 0.55 : 1) : 0.22, head: narrow ? 6 : 8 };
        if (!src.leaf) halo(a, b, e);
        if (src.leaf) {
          if (narrow) fig.line(a.x - a.r, a.y, b.x + b.w / 2, b.y, st);
          else fig.line(a.x, a.y - a.r, b.x, bot(e[1]), st);
        } else if (narrow) {
          if (e[1] === 'A' && e[0] !== 'EC') { fig.line(G[e[0]].x - G[e[0]].w / 2, a.y, 9, a.y, st); fig.line(9, a.y, 9, b.y, st); }
          else if (e[1] === 'EC') fig.arrow(b.x, topY('A'), b.x, bot('EC') + 1, st);
          else if (e[0] === 'R' && e[1] === 'V') { var xr = a.x + a.w / 2 + 8; fig.line(a.x + a.w / 2, a.y, xr, a.y, st); fig.line(xr, a.y, xr, b.y, st); fig.arrow(xr, b.y, b.x + b.w / 2 + 1, b.y, st); }
          else fig.arrow(a.x, topY(e[0]), e[1] === 'R' ? a.x : b.x, bot(e[1]) + 1, st);
        } else if (e[0] === 'O') fig.arrow(a.x - a.w / 2, a.y, b.x + b.w / 2 + 1, b.y, st);
        else if (e[0] === 'R' && e[1] === 'V') fig.arrow(a.x - a.w / 2, a.y, b.x + b.w / 2 + 1, b.y, st);
        else if (e[0] === 'R') fig.arrow(a.x, topY('R'), a.x, bot('O') + 1, st);
        else if (e[1] === 'A') { var k = ['P', 'F', 'TIA', 'LM', 'L', 'X', 'V'].indexOf(e[0]); fig.arrow(a.x, topY(e[0]), b.x - b.w / 2 + (k + 0.5) / 7 * b.w, bot('A') + 1, st); }
        else fig.arrow(a.x, topY(e[0]), b.x, bot(e[1]) + 1, st);
      });
      if (narrow) fig.arrow(9, G.A.y, G.A.x - G.A.w / 2 - 1, G.A.y, { color: 'muted', width: 1.4, alpha: !lit || lit.A ? 0.9 : 0.15, head: 5 });

      // boxes
      BOXES.forEach(function (n) {
        var g = G[n.id], a = on(n.id) ? 1 : 0.3, x0 = g.x - g.w / 2, y0 = g.y - g.h / 2;
        ctx.beginPath(); if (ctx.roundRect) ctx.roundRect(x0, y0, g.w, g.h, 6); else ctx.rect(x0, y0, g.w, g.h);
        ctx.globalAlpha = 1; ctx.fillStyle = fig.color('stage', 0.96); ctx.fill();
        if (n.id === 'EC') { ctx.fillStyle = fig.color('violet', 0.16); ctx.fill(); }
        fig.stroke({ color: n.color, width: sel === n ? 2.6 : n.color === 'muted' ? 1.2 : 1.8, alpha: a }); ctx.stroke(); ctx.globalAlpha = 1;
        var ls = narrow ? [n.one] : n.lines, tc = n.color === 'muted' ? 'fg' : n.color;
        ls.forEach(function (s, i) {
          var wt = n.id === 'EC' ? 700 : 500, mono = width(s, fs, 500, true) < g.w - 6;
          if (ready(fs, wt, mono)) fig.text(s, g.x, g.y + (i - (ls.length - 1) / 2) * (fs + 3) + 0.5, { color: tc, size: fs, weight: wt, mono: mono, align: 'center', baseline: 'middle', alpha: a });
        });
      });
      warmUp();

      // theorems: circles, with short names where they fit
      var placed = [];
      LEAVES.forEach(function (l) {
        var g = G[l.id], a = on(l.id) ? 1 : 0.3;
        if (!l.v[1]) fig.circle(g.x, g.y, g.r, { fill: false, ring: 'blue', ringWidth: 1.4 });
        else fig.circle(g.x, g.y, g.r, { fill: fig.color('blue', 0.55 * a + 0.1), ring: sel === l ? 'fg' : 'stage', ringWidth: sel === l ? 2.4 : 1.2 });
        if (l.note === 'at least; the tool stopped at its cap' && mix.value > 0.5) fig.circle(g.x, g.y, g.r + 3, { fill: false, ring: 'blue', ringWidth: 1 });
        placed.push([g.x - g.r, g.y - g.r, 2 * g.r, 2 * g.r]);
      });
      if (!narrow) LEAVES.slice().sort(function (a, b) { return b.v[1] - a.v[1]; }).forEach(function (l) {
        var g = G[l.id], tw = fig.measure(l.short, 11.5, 500), r = [g.x - tw / 2 - 2, g.y + g.r + 2, tw + 4, 13];
        if (r[0] < 2 || r[0] + r[2] > w - 2 || placed.some(function (q) { return r[0] < q[0] + q[2] && q[0] < r[0] + r[2] && r[1] < q[1] + q[3] && q[1] < r[1] + r[3]; })) return;
        placed.push(r); fig.text(l.short, g.x, g.y + g.r + 12, { color: 'blue', size: 11.5, align: 'center', alpha: on(l.id) ? 1 : 0.35 });
      });

      // what the selection is
      var head = sel ? (sel.leaf ? sel.name : sel.info[0]) : null, lines = [];
      if (sel && sel.leaf) {
        lines = [[sel.lean, 'muted', true], [sel.role + '.', 'fg']];
        lines.push([sel.v[1] ? 'Cone: ' + fmt(sel.v[0]) + ' files, ' + fmt(sel.v[1]) + ' lines' + (sel.note ? ' (' + sel.note + ')' : '') : 'Cone: not measured', 'blue']);
      } else if (sel) lines = [[sel.info[1], 'fg']];
      else lines = [['Blue circles: published theorems, with area proportional to the lines of each proof\'s dependency cone (cones overlap and do not add). Hover or tap one to trace its path to the top.', 'muted']];
      var iw = narrow ? w - 36 : G.A.x - G.A.w / 2 - 24, isz = 11.5, out = [];                 // few canvas fonts: sans 11, sans 11 bold, and the boxes' mono
      if (head) wrap(head, iw, isz, 700).forEach(function (s) { out.push([s, sel.leaf ? 'blue' : sel.color === 'muted' ? 'fg' : sel.color, false, 700]); });
      lines.forEach(function (q) { wrap(q[0], iw, isz).forEach(function (s) { out.push([s, q[1], q[2], 500]); }); });
      if (narrow && !sel) { fig.text('tap a circle or box', w - 10, G.EC.y, { color: 'muted', size: 11.5, align: 'right', baseline: 'middle' }); return; }
      var lh = isz + 4, bh = out.length * lh + 14, by = narrow ? (G[sel.id].y < h / 2 ? h - bh - 6 : 6) : 10, bx = narrow ? 10 : 8;
      if (!narrow) fig.rect(bx - 4, by - 2, iw + 12, bh, { fill: 'stage', alpha: 0.9 });
      if (narrow) { fig.rect(bx, by, w - 20, bh, { fill: 'stage', alpha: 0.96 }); fig.rect(bx, by, w - 20, bh, { color: sel.leaf ? 'blue' : sel.color, width: 1.2 }); }
      out.forEach(function (q, i) { fig.text(q[0], bx + 8, by + 7 + lh * (i + 0.5), { color: q[1], size: q[2] ? fs : isz, mono: q[2], weight: q[3], baseline: 'middle' }); });
    };
  }
});
