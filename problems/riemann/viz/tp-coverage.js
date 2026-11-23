/* How far the page took each proof. The rows are the two tables of chapter 25's section tp-ledger, row for row,
   followed by the items of the paragraph after each table that the page did not unfold. Each row's status is read
   from the table's "On this page" column: "Proved" (filled), proved in part and stated in part (half filled),
   "Stated" (outline), not unfolded (red dashed). A star marks a row whose proof on the page is one of the
   compressions the section lists as ours. Wide: two columns. Phone: one route at a time. */
Kit.register('tp-coverage', {
  init: function (fig) {
    var TITLE = { 11: 'The adeles', 12: 'Tate\'s thesis as theta and zeta', 13: 'Primes as circles', 14: 'Choosing the topology',
      15: 'Cutting the kernel along the primes', 16: 'The local trace and the Trace Formula', 17: 'From the Trace Formula to the hypothesis',
      19: 'The last mile', 20: 'Forms you can hold', 21: 'Multiplicity without derivatives', 22: 'Paying for the chain',
      23: 'The arithmetic residue', 24: 'What the proof stands on', 25: 'Two proofs, one theorem' };
    // [label, short label, status p | h | s | n, star, chapter, anchor, what the chapter says]
    var M = [
      ['Adeles, the product formula, the idele class group of Q', 'Adeles, product formula, class group', 'h', 0, 11, 'adeles', 'Product formula proved; Poisson summation on the adeles and the structure of the class group stated, after Tate and the source.'],
      ['Theta sums, their Mellin transform, the functional equation', 'Theta sums and their Mellin transform', 'p', 0, 12, 'tate-theta', 'Proved.'],
      ['The converse theorem over Q', '', 'p', 1, 12, 't-tt-converse', 'Proved, by a proof of ours.'],
      ['The divisor exact sequence and convolution on the quotient', 'Divisor sequence, convolution', 'p', 0, 12, 't-tt-divisor', 'Proved.'],
      ['The trace on a circle, and the orbital trace beyond the support', 'Circle trace, orbital trace', 'p', 0, 13, 't-pc-circle-trace', 'Proved.'],
      ['The orbital quotient is a circle, through strong coprimality', 'Orbital quotient is a circle', 's', 0, 13, 't-pc-orbital-circle', 'Stated, after the source\'s Theorem 7.5.0.1.'],
      ['Evaluation is continuous exactly inside the strip', 'Evaluation exactly inside the strip', 'p', 1, 14, 't-sp-evaluation', 'Proved, with proofs of ours.'],
      ['The strip quotient and the spectral trace', 'Strip quotient, spectral trace', 's', 0, 14, 't-sp-quotient', 'Stated, after the source\'s Ch. 10.'],
      ['Proto-trace formula, sieve, vanishing slices, shell limit, S-local remnant', 'Sieve, vanishing slices, remnant', 'h', 0, 15, 'cutting-the-kernel', 'Proved, except that identifying each slice\'s trace with its diagonal mass is stated.'],
      ['The skewered diagonals on the ideles', 'Skewered diagonals', 's', 0, 15, 't-ck-skewered', 'Stated.'],
      ['Connes\'s S-local trace and the weight one half', 'Connes\'s S-local trace, weight ½', 's', 0, 16, 't-tf-s-local', 'Stated, after Connes and the source\'s Theorem 12.4.1.1; the one-place case computed.'],
      ['The Trace Formula over Q', '', 'p', 0, 16, 't-tf-trace-formula', 'Proved from the above, with the extension of the support written out by us.'],
      ['The endgame', '', 'p', 1, 17, 't-tg-rh', 'Proved twice: the source\'s argument with a repaired step, and a subtraction of our own.'],
      ['Number fields and Hecke characters', 'Number fields, Hecke characters', 's', 0, 17, 's-tg-general', 'Stated, in each chapter\'s "what changes in general".'],
      ['The five Structure Theorems of the source\'s Ch. 5 and 6', 'Structure Theorems (Ch. 5, 6)', 'n', 0, 25, 'tp-ledger', 'Not unfolded; stated in one sentence over Q.'],
      ['Nuclear and LF spaces, Markushevich bases, Paley and Wiener levels', 'Nuclear spaces, bases, levels', 'n', 0, 25, 'tp-ledger', 'Not unfolded: what makes each step legitimate in the coarse space.'],
      ['Lebesgue differentiation on locally compact groups', 'Lebesgue differentiation', 'n', 0, 25, 'tp-ledger', 'Not unfolded.'],
      ['The periodic orbits of the source\'s Ch. 8', 'Periodic orbits (Ch. 8)', 'n', 0, 25, 'tp-ledger', 'Not unfolded.'],
      ['The edge terms at a positive Sobolev degree', 'Edge terms, positive Sobolev degree', 'n', 0, 25, 'tp-ledger', 'Not unfolded.']
    ];
    var A = [
      ['From the half-plane statement to the five theorems', 'Half-plane to the five theorems', 'p', 0, 19, 't-le-five', 'Proved.'],
      ['The smoothed sums as zero noise', '', 'p', 1, 19, 't-le-twisted', 'Proved for G₀; for the twisted sums by a formula of ours.'],
      ['Landau\'s theorem, classical form', 'Classical Landau theorem', 's', 0, 19, 't-le-landau-classical', 'Stated.'],
      ['The windowed Landau theorem and the contract', 'Windowed Landau theorem, contract', 'p', 1, 19, 't-le-windowed', 'Proved, in our reconstruction of the code\'s proof.'],
      ['Definite forms as vectors, lifts as matrices, the chain as a product', 'Forms as vectors, chain as product', 'h', 0, 20, 't-df-chain', 'Proved, with one genus worked in full; finiteness and the Siegel and Weil formula stated.'],
      ['The product formula as degree budget; the seesaw', 'Degree budget, seesaw', 'p', 0, 21, 't-ml-height', 'Proved.'],
      ['Branching, iterated Bessel periods, divisibility of jets (ThmP)', 'Branching, Bessel periods, ThmP', 's', 0, 21, 't-ml-branching', 'Stated.'],
      ['Row0b and its derivation from GeoOne and TLiftK', 'Row0b and its derivation', 's', 0, 22, 't-ig-row0b', 'The theorem stated; the derivation traced step by step.'],
      ['The finite-group explicit formula and the bound on the count', 'Finite-group explicit formula, bound', 'h', 0, 22, 't-ig-balance', 'The identity proved; the bound traced through the code\'s proof, given the chain\'s conditions CoreAtH, with two of its lemmas read as statements.'],
      ['Square-root bounds for the twists', 'Square-root bounds for twists', 's', 0, 22, 't-ig-pairex', 'Stated.'],
      ['VWin', '', 'h', 0, 23, 't-cw-vwin', 'Stated; the pigeonhole and the final sum proved.'],
      ['Published inputs and the assembly', 'Published inputs, assembly', 's', 0, 24, 's-ia-table', 'Inputs stated with their usual names; the assembly traced.'],
      ['The fields of HypsAlt and DefiniteSideCondition', 'HypsAlt, DefiniteSideCondition', 'n', 0, 21, 'ml-gaps', 'Not unfolded: the roughly 45 fields through which the chain\'s data are shown to satisfy the inequalities that bound the count.'],
      ['How divisibility and integrality feed the inequality DIV', 'Divisibility feeding DIV', 'n', 0, 21, 'ml-gaps', 'Not unfolded: how ThmP, DGam, chain_ge, PeriodClassSumWeyl, and the exponents of LeafDepthGood feed DIV.'],
      ['The kernel ColumnChain.unf as theta coefficients', 'Kernel unf as theta coefficients', 'n', 0, 21, 'ml-gaps', 'Not unfolded: the identification of the chain\'s kernel with theta coefficients between lattice classes.'],
      ['Where the rank condition RKC is proved for the datum', 'Where RKC is proved', 'n', 0, 21, 'ml-gaps', 'Not unfolded.'],
      ['The plus part of VWin, through Euler systems and automorphy', 'Plus part of VWin', 'n', 0, 24, 's-ia-coverage', 'Not unfolded.'],
      ['LemmaK', '', 'n', 0, 24, 's-ia-coverage', 'Not unfolded.'],
      ['The proofs behind the square-root bounds for twists', 'Proofs of the twist bounds', 'n', 0, 24, 's-ia-coverage', 'Not unfolded.'],
      ['The covolume bound CovolumeBoundOfX and its fifteen geometric inputs', 'CovolumeBoundOfX', 'n', 0, 24, 's-ia-coverage', 'Not unfolded.']
    ];
    var table = function (R) { return R.filter(function (r) { return r[2] !== 'n'; }).length; };
    if (table(M) !== 14 || table(A) !== 12) console.error('tp-coverage: the tables of tp-ledger have 14 and 12 rows');
    var ROWS = M.map(function (r) { return { r: r, route: 'M' }; }).concat(A.map(function (r) { return { r: r, route: 'A' }; }));
    ROWS.forEach(function (o, k) { o.alpha = 1; o.k = k; });
    var lettered = 0;                                  // rows whose text is drawn: 10 more per frame at first, to keep the first frame short
    var NAME = { p: 'proved on this page', h: 'partly proved, partly stated', s: 'stated with a pointer', n: 'not unfolded' };
    var SHORT = { p: 'proved', h: 'partly proved', s: 'stated', n: 'not unfolded' };   // the legend on a phone

    var showP = fig.toggle({ label: 'Proved', value: true });
    var showS = fig.toggle({ label: 'Stated', value: true });
    var showN = fig.toggle({ label: 'Not unfolded', value: true });
    var stars = fig.toggle({ label: 'Only our compressions', value: false });
    var bM = fig.button({ label: 'Route M', pressed: true, onClick: function () { bM.press(true); bA.press(false); } });
    var bA = fig.button({ label: 'Route A', pressed: false, onClick: function () { bA.press(true); bM.press(false); } });
    var pinned = null;
    var go = fig.button({ label: 'Go to the pinned row', onClick: function () { if (pinned && window.MX && window.MX.goTo) window.MX.goTo(pinned.r[5], true); } });
    fig.onReset = function () { pinned = null; bM.press(true); bA.press(false); };
    var P = fig.plane({ x: [0, 1], y: [0, 1], pad: 0 });
    var probe = fig.probe({ plane: P, crosshair: false, marker: false, pick: function (x, y) { var o = hit(P.X(x), P.Y(y)); pinned = o === pinned ? null : o; } });

    function shown(o) {
      var s = o.r[2], ok = s === 'p' ? showP.value : s === 's' ? showS.value : s === 'n' ? showN.value : showP.value || showS.value;
      return ok && (!stars.value || o.r[3]);
    }
    // A row owns its whole pitch, with no gap to the next, so a tap on a phone always lands on the nearest row.
    function hit(px, py) {
      for (var i = 0; i < ROWS.length; i++) { var g = ROWS[i].g; if (g && ROWS[i].alpha > 0.5 && px >= g.x - 2 && px <= g.x + g.w + 2 && Math.abs(py - g.y) <= g.p / 2) return ROWS[i]; }
      return null;
    }
    function rr(x, y, w, h) { var ctx = fig.ctx; ctx.beginPath(); if (ctx.roundRect) ctx.roundRect(x, y, w, h, 5); else ctx.rect(x, y, w, h); }
    function chip(s, x, y, w, h, a, bold) {             // the status style, as a bar or as a small sample
      var ctx = fig.ctx;
      if (s === 'p' || s === 'h') { ctx.save(); rr(x, y, w, h); ctx.clip(); fig.rect(x, y, s === 'p' ? w : w / 2, h, { fill: 'fg', alpha: (w < 30 ? 0.5 : 0.17) * a }); ctx.restore(); }
      rr(x, y, w, h);
      fig.stroke({ color: s === 'n' ? 'red' : s === 's' ? 'muted' : 'fg', width: bold ? 2.4 : s === 's' ? 1.3 : 1.5, alpha: a, dash: s === 'n' ? [4, 3] : null });
      ctx.stroke(); ctx.setLineDash([]);
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

    return function draw() {
      var W = fig.w, H = fig.h, wide = W >= 640, fs = wide ? 12.5 : 11, moving = false, step = Kit.reducedMotion ? 1 : fig.dt / 0.15;
      bM.show(!wide); bA.show(!wide);
      var sel = (probe.active ? hit(P.X(probe.x), P.Y(probe.y)) : null) || pinned;
      go.enable(!!pinned); go.setLabel(pinned ? 'Go to chapter ' + pinned.r[4] : 'Go to the pinned row');

      // legend
      var lx = 10, ly = 14, items = ['p', 'h', 's', 'n'];
      items.forEach(function (s) {
        var t = wide ? NAME[s] : SHORT[s], tw = fig.measure(t, fs, 500) + 34;
        if (lx + tw > W - 8) { lx = 10; ly += 18; }
        chip(s, lx, ly - 6, 22, 12, 1);
        fig.text(t, lx + 28, ly + 0.5, { color: 'fg', size: fs, baseline: 'middle' }); lx += tw + 10;
      });
      var st = wide ? '★ a compression of ours' : '★ ours', sw = fig.measure(st, fs, 500);
      if (lx + sw > W - 8) { lx = 10; ly += 18; }
      fig.text(st, lx, ly + 0.5, { color: 'fg', size: fs, baseline: 'middle' });
      // on a phone the route's name ends the legend's last line, and the rows start right under it
      if (!wide) fig.text('Route ' + (bA.pressed ? 'A' : 'M'), W - 10, ly + 0.5, { color: 'muted', size: 12.5, weight: 700, align: 'right', baseline: 'middle' });

      // rows
      var top = ly + (wide ? 36 : 14), bottom = H - (wide ? 58 : 4), cols = wide ? ['M', 'A'] : [bA.pressed ? 'A' : 'M'];
      var colW = (W - 20 - (cols.length - 1) * 24) / cols.length, vis = [];
      ROWS.forEach(function (o) { o.g = null; });
      cols.forEach(function (route, ci) {
        var list = ROWS.filter(function (o) { return o.route === route; }), x0 = 10 + ci * (colW + 24);
        var pitch = Math.min(30, (bottom - top) / Math.max(list.length, 20)), bh = Math.min(22, pitch - 3);
        list.forEach(function (o, i) {
          var target = shown(o) ? 1 : 0.1, r = o.r;
          if (o.alpha !== target) { o.alpha = o.alpha < target ? Math.min(target, o.alpha + step) : Math.max(target, o.alpha - step); moving = true; }
          o.g = { x: x0, y: top + pitch * (i + 0.5), w: colW, h: bh, p: pitch, tx: wide ? x0 + 9 : x0 + 26 };
          var room = Math.round(x0 + colW - o.g.tx - (r[3] ? 22 : 8));
          if (o.room !== room) {                        // the full label, else the short one, else a cut one
            var label = r[0];                           // a label well under the room at 0.62 em per character fits unmeasured
            if (label.length * 0.62 * fs < room) { o.room = room; o.lab = label; vis.push(o); return; }
            if (fig.measure(label, fs, 500) > room && r[1]) label = r[1];
            while (fig.measure(label, fs, 500) > room && label.length > 4) label = label.slice(0, -2) + '…';
            o.room = room; o.lab = label;
          }
          vis.push(o);
        });
      });
      // drawn in passes that each keep one font, since every change of canvas font costs a style update
      vis.forEach(function (o) {
        var g = o.g;
        if (wide) chip(o.r[2], g.x, g.y - g.h / 2, g.w, g.h, o.alpha, sel === o);
        else chip(o.r[2], g.x, g.y - 5, 18, 10, o.alpha, sel === o);
      });
      if (lettered < ROWS.length) { lettered += 10; fig.more(); }
      vis = vis.filter(function (o) { return o.k < lettered || sel === o; });
      vis.forEach(function (o) { if (sel !== o) fig.text(o.lab, o.g.tx, o.g.y + 0.5, { color: 'fg', size: fs, baseline: 'middle', alpha: o.alpha }); });
      if (sel && sel.g) fig.text(sel.lab, sel.g.tx, sel.g.y + 0.5, { color: 'fg', size: fs, weight: 700, baseline: 'middle', alpha: sel.alpha });
      vis.forEach(function (o) { if (o.r[3]) fig.text('★', o.g.x + o.g.w - 8, o.g.y + 0.5, { color: 'fg', size: fs, align: 'right', baseline: 'middle', alpha: o.alpha }); });
      if (wide) cols.forEach(function (route, ci) {
        var x0 = 10 + ci * (colW + 24);
        fig.text('Route ' + route, x0, top - 14, { color: 'muted', size: 12.5, weight: 700, baseline: 'middle' });
        if (route === 'A') fig.text('The tree was not built for this page.', x0 + colW, top - 14, { color: 'muted', size: 11, align: 'right', baseline: 'middle' });
      });
      if (moving) fig.more();

      // the reading of the selected row, or the counts
      var head = sel ? 'Route ' + sel.route + ' · ' + sel.r[0] : null;
      var body = sel ? NAME[sel.r[2]].charAt(0).toUpperCase() + NAME[sel.r[2]].slice(1) + (sel.r[3] ? ', by a compression of ours' : '') + '. The chapter: ' + sel.r[6] +
        ' Chapter ' + sel.r[4] + ', ' + TITLE[sel.r[4]] + '.' : null;
      if (wide) {
        var py = H - 46;
        fig.line(10, py - 10, W - 10, py - 10, { color: 'grid', width: 1 });
        if (!sel) {
          var count = function (R, s) { return R.filter(function (r) { return r[2] === s; }).length; };
          var line = function (n, R) { return n + ': ' + count(R, 'p') + ' proved, ' + count(R, 'h') + ' partly, ' + count(R, 's') + ' stated, ' + count(R, 'n') + ' not unfolded'; };
          fig.text(line('Route M', M) + '.   ' + line('Route A', A) + '.', 10, py + 4, { color: 'muted', size: 12.5, baseline: 'middle' });
          fig.text('Hover or tap a row to read what the chapter says of it; click to pin it.', 10, py + 24, { color: 'muted', size: 12.5, baseline: 'middle' });
          return;
        }
        fig.text(head, 10, py + 4, { color: 'fg', size: 12.5, weight: 700, baseline: 'middle' });
        wrap(body, W - 20, 12.5, 500).slice(0, 2).forEach(function (s, i) { fig.text(s, 10, py + 22 + 16 * i, { color: 'fg', size: 12.5, baseline: 'middle' }); });
        return;
      }
      if (!sel) return;
      var bw = W - 12, hl = wrap(head, bw - 20, 11.5, 700), ls = wrap(body, bw - 20, 11.5, 500), bh2 = 14 + 15 * (hl.length + ls.length);
      var by = sel.g && sel.g.y < H / 2 ? H - bh2 - 4 : 4, ctx = fig.ctx;
      rr(6, by, bw, bh2); ctx.fillStyle = fig.color('stage', 0.97); ctx.fill(); fig.stroke({ color: 'fg', width: 1.4 }); ctx.stroke();
      hl.forEach(function (s, i) { fig.text(s, 16, by + 14 + 15 * i, { color: 'fg', size: 11.5, weight: 700, baseline: 'middle' }); });
      ls.forEach(function (s, i) { fig.text(s, 16, by + 14 + 15 * (hl.length + i), { color: 'fg', size: 11.5, baseline: 'middle' }); });
    };
  }
});
