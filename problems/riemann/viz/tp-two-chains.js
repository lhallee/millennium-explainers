/* The two proofs as parallel chains. Route M's links are the chain of chapter 17 (s-tg-route), links 1 to 9, and its
   link 10 is the shared conclusion; Route A's links are the spine of chapter 18 (ra-map) read from the leaves up,
   nodes 9, 7, 8, 6, 5, 4, 3, 2, with node 1, the five theorems, as the shared conclusion. The explicit formula sits on
   top, and dashed rails mark where it enters each chain (Weil's form at Route M's links 8 and 9, the smoothed sum's
   at Route A's endgame). Red dotted lines are the contacts of chapter 25's section tp-share. Route M alone continues
   to every Hecke L-function. Hover or tap a link to read it; a click pins it, and the button jumps to its section. */
Kit.register('tp-two-chains', {
  init: function (fig) {
    var TITLE = { 6: 'The explicit formula', 11: 'The adeles', 12: 'Tate\'s thesis as theta and zeta', 13: 'Primes as circles',
      14: 'Choosing the topology', 15: 'Cutting the kernel along the primes', 16: 'The local trace and the Trace Formula',
      17: 'From the Trace Formula to the hypothesis', 18: 'Stepanov over the integers', 19: 'The last mile', 20: 'Forms you can hold',
      22: 'Paying for the chain', 23: 'The arithmetic residue', 24: 'What the proof stands on' };
    var NODES = [
      { id: 'M1', name: 'Adeles', ch: 11, a: 'adeles', text: 'Every completion of Q at once: the adeles, the ideles, and the idele class group, on which a function of the norm is a function on the positive reals.' },
      { id: 'M2', name: 'Theta sums and zeta', ch: 12, a: 't-tt-divisor', text: 'Theta sums have Mellin transform 2ζ(s)Mg(s), and modulo the weighted theta sums, convolution by φ acts on the jets at the zeros with eigenvalues Mφ(ρ − ½).' },
      { id: 'M3', name: 'Primes as circles', ch: 13, a: 't-pc-orbital-trace', text: 'Deleting the multiples of p leaves functions on a circle of length log p, where the trace of convolution is log p times the sum of φ over the powers of p, so 0 when p is beyond the support of φ.' },
      { id: 'M4', name: 'Strip topology', ch: 14, a: 't-sp-spectral-trace', text: 'In the strip topology, evaluating a Mellin transform is continuous exactly inside |Re z| < a, so only the zeros with |β − ½| < a survive, and the spectral trace sums over those alone.' },
      { id: 'M5', name: 'Kernel and diagonal', ch: 15, a: 't-ck-proto', text: 'The kernel φ(x/y) splits into spectral and geometric parts, and the diagonal mass of the geometric part is minus the spectral trace.' },
      { id: 'M6', name: 'Sieve', ch: 15, a: 't-ck-slices-vanish', text: 'Lifted to the ideles, the geometric kernel is cut along the primes one at a time; every slice for p > Y has trace 0, which leaves an S-local kernel.' },
      { id: 'M7', name: 'S-local trace', ch: 16, a: 's-tf-half', text: 'By Connes\'s computation the S-local diagonal mass is the sum of Weil\'s local terms at the places of S, with the weight ½ forced by the match of additive and multiplicative measures.' },
      { id: 'M8', name: 'Trace Formula', ch: 16, a: 't-tf-trace-formula', text: 'Weil\'s prime sum plus the archimedean term equals the pole terms minus the zeros in the strip, for every test function with φ(1) = 0 and every a > 0.' },
      { id: 'M9', name: 'Endgame', ch: 17, a: 't-tg-rh', text: 'The family h₀(t) times t to the power −z turns the prime side into −ζ′/ζ(z + ½), with a pole at every zero, while the other side has poles only in the strip; or, in our shorter route, the zeros off the strip sum to zero against every test function and so are absent.' },
      { id: 'A1', name: 'Published inputs', ch: 24, a: 's-ia-table', text: 'Published theorems restated as propositions and proved in the tree, through 185 wrapper theorems.' },
      { id: 'A2', name: 'Galois input', ch: 22, a: 't-ig-row0b', text: 'Row0b: every regular algebraic polarized cuspidal automorphic representation of a general linear group over a CM field has an ℓ-adic Galois representation with the expected local properties. The tree proves it from TLiftK and GeoOne.' },
      { id: 'A3', name: 'Cohomological window', ch: 23, a: 't-cw-vwin', text: 'VWin: on a window of scales, the locally trivial Galois cohomology Sha¹ of an explicit abelian CM field, over all primes ℓ and all Tate twists below x⁴⁰¹, is small.' },
      { id: 'A4', name: 'Automorphic construction', short: 'Automorphic chain', ch: '20 to 22', a: 'definite-forms', text: 'At each scale x, a chain of between x^(1/2 − ε/16) and twice that many theta lifts between totally definite unitary groups, with periods, integrality, and sizes, delivers the data from which the inequality follows.' },
      { id: 'A5', name: 'Inequality on windows', ch: 19, a: 't-le-interface', text: 'For each primitive χ and small ε, the combination of smoothed prime sums is at most x^(1/2 + 9ε) on windows [Y, Y^(3/2)].' },
      { id: 'A6', name: 'Endgame', ch: 19, a: 't-le-windowed', text: 'A positive combination of smoothed prime sums bounded above by C y^θ on windows [Y, Y^(1 + δ)] for arbitrarily large Y forces zero-freeness on Re s > θ.' },
      { id: 'A7', name: 'Primitive half-plane', ch: 19, a: 't-le-contract', text: 'One application per ε, with no bootstrap, gives every half-plane Re s > ½ + 9ε, so no primitive L-function vanishes to the right of ½.' },
      { id: 'A8', name: 'Half-plane', ch: 19, a: 't-le-five', text: 'No Dirichlet L-function vanishes on Re s > ½, except the principal character at s = 1: the imprimitive case follows by the Euler factors, and the functional equation reflects the half-plane onto the line.' },
      { id: 'T', name: 'Explicit formula: primes on one side, zeros on the other', short: 'Explicit formula: primes and zeros', ch: 6, a: 'explicit-formula', text: 'Each zero is a wave in the count of primes. Route M compares Weil\'s form of it with the Trace Formula (dashed rail into links 8 and 9); Route A reads the explicit formula of the smoothed prime sum in its endgame (rail into A6).' },
      { id: 'B', name: 'Every nontrivial zero of ζ and of every Dirichlet L-function has real part ½', short: 'Zeros of ζ and every Dirichlet L: real part ½', ch: '17 and 18', a: 't-ra-main', text: 'Route M: no zero lies outside any strip of positive width around the critical line. Route A: the five theorems of Main.lean, with no hypotheses.' },
      { id: 'H', name: 'and every L-function of a unitary Hecke character of every number field', short: 'and every Hecke L-function', ch: 17, a: 's-tg-general', text: 'Route M only: for a number field F and a unitary Hecke character χ the endgame is the same with three changes, so L(s, χ) has no zero off the line.' }
    ];
    var CONTACTS = [['M2', 'A1', 'Tate\'s thesis'], ['M6', 'A6', 'test functions on one side of 1'], ['M9', 'A6', 'zeros as poles'], ['M9', 'A8', 'functional equation']];
    var byId = {}, touched = { T: 1, B: 1 };
    NODES.forEach(function (n) { byId[n.id] = n; n.route = n.id.length === 2 ? n.id[0] : ''; n.i = n.route ? +n.id[1] - 1 : 0; n.title = TITLE[n.ch] || ''; });
    CONTACTS.forEach(function (c) { touched[c[0]] = touched[c[1]] = 1; });

    var showC = fig.toggle({ label: 'Show contacts', value: true });
    var shared = fig.toggle({ label: 'Only what the two share', value: false });
    var pinned = null;
    var go = fig.button({ label: 'Go to the pinned link', onClick: function () { if (pinned && window.MX && window.MX.goTo) window.MX.goTo(pinned.a, true); } });
    fig.onReset = function () { pinned = null; };
    var P = fig.plane({ x: [0, 1], y: [0, 1], pad: 0 });
    var probe = fig.probe({ plane: P, crosshair: false, marker: false, pick: function (x, y) { var n = hit(P.X(x), P.Y(y)); pinned = n === pinned ? null : n; } });
    var reveal = fig.tween(Kit.reducedMotion ? 1 : 0), started = false, hinted = false, G = {};

    function hit(px, py) {
      for (var i = 0; i < NODES.length; i++) { var g = G[NODES[i].id]; if (g && Math.abs(px - g.x) <= g.w / 2 + 3 && Math.abs(py - g.y) <= g.h / 2 + 3) return NODES[i]; }
      return null;
    }
    function lit(n) {                                    // the node and everything after it on the way to the conclusion
      var s = {}; if (!n) return null;
      if (n.id === 'T') { NODES.forEach(function (m) { s[m.id] = 1; }); return s; }
      s[n.id] = 1;
      if (n.route) { NODES.forEach(function (m) { if (m.route === n.route && m.i >= n.i) s[m.id] = 1; }); s.B = 1; if (n.route === 'M') s.H = 1; }
      return s;
    }
    var wrapped = {};
    function wrap(str, width, size, weight) {
      var key = str + '|' + Math.round(width) + '|' + size;
      if (wrapped[key]) return wrapped[key];
      var lines = [], cur = '';
      str.split(' ').forEach(function (w) { var t = cur ? cur + ' ' + w : w; if (cur && fig.measure(t, size, weight) > width) { lines.push(cur); cur = w; } else cur = t; });
      if (cur) lines.push(cur);
      return (wrapped[key] = lines);
    }
    function box(g, style) {
      var ctx = fig.ctx;
      ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(g.x - g.w / 2, g.y - g.h / 2, g.w, g.h, 6); else ctx.rect(g.x - g.w / 2, g.y - g.h / 2, g.w, g.h);
      ctx.fillStyle = fig.color('stage', 0.96); ctx.fill();
      fig.stroke(style); ctx.stroke(); ctx.setLineDash([]);
    }
    function poly(pts, style) {                          // a polyline over a stage halo 4 px wider, its last segment ending in an arrowhead
      var ctx = fig.ctx, n = pts.length;
      fig.stroke({ color: 'stage', width: style.width + 4, alpha: style.alpha });
      ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]); for (var j = 1; j < n; j++) ctx.lineTo(pts[j][0], pts[j][1]); ctx.stroke();
      if (n > 2) { fig.stroke(style); ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]); for (var i = 1; i < n - 1; i++) ctx.lineTo(pts[i][0], pts[i][1]); ctx.stroke(); ctx.setLineDash([]); }
      fig.arrow(pts[n - 2][0], pts[n - 2][1], pts[n - 1][0], pts[n - 1][1], { color: style.color, width: style.width, alpha: style.alpha, dash: style.dash, head: style.head });
    }

    function layout(W, H, wide) {
      var c0 = wide ? 30 : 13, gap = wide ? Math.max(150, 0.27 * W) : 24, cw = (W - 2 * c0 - gap) / 2;
      var xM = c0 + cw / 2, xA = W - c0 - cw / 2, topH = wide ? 32 : 22, botH = wide ? 32 : 22, heH = wide ? 28 : 20;
      var topY = 4 + topH / 2, heY, botY;
      if (wide) { heY = H - 78 - heH / 2; botY = heY - heH / 2 - 20 - botH / 2; }
      else { heY = H - 60 + heH / 2; botY = H - 60 - 8 - botH / 2; }
      var y1 = topY + topH / 2 + (wide ? 44 : 20), y9 = botY - botH / 2 - (wide ? 26 : 18), p = (y9 - y1) / 8, nh = Math.min(wide ? 28 : 20, p - 6);
      NODES.forEach(function (n) {
        if (n.route) G[n.id] = { x: n.route === 'M' ? xM : xA, y: n.route === 'M' ? y1 + n.i * p : y1 + n.i * (y9 - y1) / 7, w: cw, h: nh };
      });
      G.T = { x: W / 2, y: topY, w: W - 2 * c0, h: topH };
      G.B = { x: W / 2, y: botY, w: W - 2 * c0, h: botH };
      G.H = { x: xM, y: heY, w: cw, h: heH };
      return { c0: c0, cw: cw, xM: xM, xA: xA, y1: y1, nh: nh, rail: wide ? 15 : 5 };
    }

    return function draw() {
      var W = fig.w, H = fig.h, wide = W >= 640, L = layout(W, H, wide);
      if (!started) { started = true; reveal.to(1, 1650, 'linear'); }
      var sel = (probe.active ? hit(P.X(probe.x), P.Y(probe.y)) : null) || pinned, on = lit(sel), sc = showC.value || shared.value;
      var vis = function (n) { return n.id === 'T' ? 1 : Kit.clamp(reveal.value * 11 - (n.id === 'B' ? 9 : n.id === 'H' ? 10 : n.i), 0, 1); };
      var alpha = function (id) { var a = vis(byId[id]); if (shared.value && !touched[id]) a *= 0.28; else if (on && !on[id]) a *= 0.3; return a; };
      go.enable(!!pinned); go.setLabel(pinned ? 'Go to ' + (pinned.route ? pinned.id : 'it') + ' in chapter ' + pinned.ch : 'Go to the pinned link');

      // rails: where the explicit formula enters each chain
      var T = G.T, rl = L.rail, rr = W - L.rail, ra = function (id) { return Math.min(alpha('T'), alpha(id)); };
      var rs = { color: 'muted', width: 1.6, dash: [4, 3], head: wide ? 8 : 6 };
      [['M8', rl, -1], ['M9', rl, -1], ['A6', rr, 1]].forEach(function (r) {
        var g = G[r[0]], ex = g.x - r[2] * g.w / 2;
        rs.alpha = ra(r[0]);
        poly([[T.x + r[2] * T.w / 2, T.y], [r[1], T.y], [r[1], g.y], [ex, g.y]], rs);
      });
      // chain arrows, the two arrows into the conclusion, and Route M's continuation
      var cs = function (a, b) {                          // a link has its source's color; on a selected path 2.4 px, off it faded
        var hl = on && on[a] && on[b], al = Math.min(alpha(a), alpha(b));
        return { color: 'fg', width: hl ? 2.4 : 1.6, alpha: on && !hl ? Math.min(al, 0.22) : al, head: wide ? 8 : 6 };
      };
      NODES.forEach(function (n) {
        if (!n.route) return;
        var next = byId[n.route + (n.i + 2)] ? n.route + (n.i + 2) : 'B', g = G[n.id], t = next === 'B' ? G.B.y - G.B.h / 2 : G[next].y - G[next].h / 2;
        poly([[g.x, g.y + g.h / 2], [g.x, t]], cs(n.id, next));
      });
      var hs = cs('B', 'H'); hs.color = 'violet'; hs.dash = [5, 4];
      poly([[G.H.x, G.B.y + G.B.h / 2], [G.H.x, G.H.y - G.H.h / 2]], hs);
      if (wide) fig.text('Route M only', G.H.x + 10, (G.B.y + G.B.h / 2 + G.H.y - G.H.h / 2) / 2, { color: 'violet', size: 11, baseline: 'middle', alpha: hs.alpha });

      // contacts
      if (sc) CONTACTS.forEach(function (c, k) {
        var a = G[c[0]], b = G[c[1]], x0 = a.x + a.w / 2, x1 = b.x - b.w / 2, al = Math.min(alpha(c[0]), alpha(c[1]), Kit.clamp(reveal.value * 11 - 10, 0, 1));
        if (al <= 0) return;
        fig.line(x0, a.y, x1, b.y, { color: 'red', width: 1.6, dash: [2, 4], alpha: al });
        fig.circle(x0, a.y, 2.5, { fill: 'red', alpha: al }); fig.circle(x1, b.y, 2.5, { fill: 'red', alpha: al });
        var mx = (x0 + x1) / 2, my = (a.y + b.y) / 2;
        if (wide) {                                      // wrapped to the gap between the columns, at most two lines
          var gapW = (L.xA - L.cw / 2) - (L.xM + L.cw / 2) - 16, ls = wrap(c[2], gapW, 12, 600).slice(0, 2);
          var tw = Math.max.apply(null, ls.map(function (s) { return fig.measure(s, 12, 600); })) + 12, th = 6 + 15 * ls.length;
          fig.rect(mx - tw / 2, my - th / 2, tw, th, { fill: 'stage', alpha: 0.92 * al });
          ls.forEach(function (s, i) { fig.text(s, mx, my + 0.5 + 15 * (i - (ls.length - 1) / 2), { color: 'red', size: 12, weight: 600, align: 'center', baseline: 'middle', alpha: al }); });
        } else {
          fig.circle(mx, my, 7, { fill: 'stage', ring: 'red', ringWidth: 1.4 });
          fig.text(String(k + 1), mx, my + 0.5, { color: 'red', size: 10.5, weight: 700, align: 'center', baseline: 'middle', alpha: al });
        }
      });

      // nodes, drawn in passes that each keep one font, since every change of canvas font costs a style update
      var fs = wide ? 12.5 : 10.5, shown = NODES.filter(function (n) { n.al = alpha(n.id); return n.al > 0; });
      shown.forEach(function (n) {
        var col = n.id === 'T' ? 'muted' : n.id === 'B' || n.id === 'H' ? 'violet' : 'fg';
        box(G[n.id], { color: col, width: sel === n ? 2.6 : 1.7, alpha: n.al, dash: n.id === 'H' ? [5, 4] : null });
      });
      var tagOf = function (n) { return wide ? String(n.i + 1) : n.id; }, lx = function (n) { return G[n.id].x - G[n.id].w / 2 + (wide ? 10 : 6); };
      shown.forEach(function (n) { if (n.route) fig.text(tagOf(n), lx(n), G[n.id].y + 0.5, { color: 'muted', size: fs, weight: 700, baseline: 'middle', alpha: n.al }); });
      var chOf = function (n) { return 'ch. ' + String(n.ch).replace(' to ', '–'); };
      shown.forEach(function (n) {
        var g = G[n.id];
        if (n.route) {                                   // the short name where the full one would run into the chapter
          var nx = lx(n) + fig.measure(tagOf(n), fs, 700) + (wide ? 8 : 5), nm = wide || !n.short ? n.name : n.short;
          if (wide && n.short && nx + fig.measure(n.name, fs, 600) > g.x + g.w / 2 - 18 - fig.measure(chOf(n), 11, 500)) nm = n.short;
          fig.text(nm, nx, g.y + 0.5, { color: 'fg', size: fs, weight: 600, baseline: 'middle', alpha: n.al });
        }
        else fig.text(!wide || fig.measure(n.name, fs, 600) > g.w - 20 ? n.short : n.name, g.x, g.y + 0.5, { color: 'fg', size: fs, weight: 600, align: 'center', baseline: 'middle', alpha: n.al });
      });
      if (wide) shown.forEach(function (n) {
        var g = G[n.id];
        if (n.route) fig.text(chOf(n), g.x + g.w / 2 - 10, g.y + 0.5, { color: 'muted', size: 11, align: 'right', baseline: 'middle', alpha: n.al });
      });
      if (wide) [['Route M', G.M1], ['Route A', G.A1]].forEach(function (h) {
        fig.text(h[0], h[1].x, h[1].y - h[1].h / 2 - 12, { color: 'muted', size: 12.5, weight: 700, align: 'center', baseline: 'middle', alpha: vis(byId.M1) });
      });

      // the reading of the selected link
      var head = sel ? (sel.route ? sel.id + '  ' + sel.name : sel.short) + '  ·  chapter ' + sel.ch + (sel.title ? ', ' + sel.title : '') : null;
      var cn = sel ? CONTACTS.filter(function (c) { return c[0] === sel.id || c[1] === sel.id; }) : [];
      var body = sel ? sel.text + (cn.length ? ' Contact' + (cn.length > 1 ? 's' : '') + ' with Route ' + (sel.route === 'M' ? 'A' : 'M') + ': ' +
        cn.map(function (c) { return c[2] + ' (' + (c[0] === sel.id ? c[1] : c[0]) + ')'; }).join('; ') + '.' : '') : null;
      if (wide) {
        var py = H - 64;
        fig.line(L.c0, py - 8, W - L.c0, py - 8, { color: 'grid', width: 1 });
        if (!sel) {
          if (!hinted) { hinted = true; fig.more(); return; }   // the hint is wrapped one frame later, to keep the first frame short
          wrap('Hover or tap a link to read it, and click it to pin it. Dashed rails mark where the explicit formula enters each chain; red dotted lines join the places where the two proofs touch.', W - 2 * L.c0, 12.5, 500)
            .slice(0, 3).forEach(function (s, i) { fig.text(s, L.c0, py + 8 + 17 * i, { color: 'muted', size: 12.5, baseline: 'middle' }); });
          return;
        }
        fig.text(head, L.c0, py + 6, { color: 'fg', size: 12.5, weight: 700, baseline: 'middle' });
        wrap(body, W - 2 * L.c0, 12.5, 500).slice(0, 3).forEach(function (s, i) { fig.text(s, L.c0, py + 24 + 16 * i, { color: 'fg', size: 12.5, baseline: 'middle' }); });
        return;
      }
      if (sc) {                                          // the contact key under the right column
        var kx = L.xA - L.cw / 2 - 20, ky = H - 52;      // starts in the gap between the columns, so 11 px text fits
        CONTACTS.forEach(function (c, k) {
          fig.text(String(k + 1), kx + 4, ky + 13 * k, { color: 'red', size: 11, weight: 700, align: 'center', baseline: 'middle' });
          fig.text(c[2], kx + 13, ky + 13 * k, { color: 'fg', size: 11, baseline: 'middle' });
        });
      }
      if (!sel) return;
      var bw = W - 12, ls = wrap(body, bw - 20, 11.5, 500), hl = wrap(head, bw - 20, 11.5, 700), bh = 14 + 15 * (hl.length + ls.length), by = G[sel.id].y < H / 2 ? H - bh - 4 : 4;
      box({ x: W / 2, y: by + bh / 2, w: bw, h: bh }, { color: sel.id === 'B' || sel.id === 'H' ? 'violet' : 'fg', width: 1.4 });
      hl.forEach(function (s, i) { fig.text(s, 16, by + 14 + 15 * i, { color: 'fg', size: 11.5, weight: 700, baseline: 'middle' }); });
      ls.forEach(function (s, i) { fig.text(s, 16, by + 14 + 15 * (hl.length + i), { color: 'fg', size: 11.5, baseline: 'middle' }); });
    };
  }
});
