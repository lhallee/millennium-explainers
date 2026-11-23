/* Stepanov's proof for curves beside the formal proof over the integers, role by role (chapter 18, section ra-idea).
   Wide stage: a two-column ledger of seven rows, each row's tag on the link between its cards, and, under it, the
   selected row's sentence from the chapter when it fits. Narrow
   stage: a strip of seven numbered rows and the selected row opened, its two cards stacked. Text with inline math is
   written as 'words $texkey$ `code` **bold**' and wrapped by measured width. */
Kit.register('ra-ledger', {
  tex: { Fq: '\\mathbb F_q', Z: '\\mathbb Z', N1: 'N_1', Lschi: 'L(s,\\chi)', Grx: 'G_r(x)', F: 'F', P0: 'P_0', pmu: 'p^\\mu=\\sqrt q',
    m: 'm', mrange: '\\sqrt{x^{1-\\varepsilon/8}}\\le m\\le 2\\sqrt{x^{1-\\varepsilon/8}}', ell: '\\ell', p: 'p',
    pibox: '\\pi\\mapsto\\pi\\boxplus\\mu_j[t]', Fqn: '\\mathbb F_{q^n}', sqrtq: '\\sqrt q', xb: 'x^{1/2+9\\varepsilon}',
    half9: '\\tfrac12+9\\varepsilon', epsto0: '\\varepsilon\\to0', Gr: 'G_r', d1: '\\delta_1=x^{-\\varepsilon/8}', mlo: 'x^{1/2-\\varepsilon/16}',
    X: 'X', x: 'x', eps: '\\varepsilon', D: 'D', pi: '\\pi', muj: '\\mu_j[t]', nu2: '2^{\\nu+2}', nu: '2^\\nu', x28: 'x^{2+8\\varepsilon}',
    Cy: 'Cy^\\theta', win: '[Y,Y^{1+\\delta}]', Res: '\\Re s>\\theta', theta: '\\theta=\\tfrac12+9\\varepsilon' },
  init: function (fig) {
    var ROWS = [
      ['What is counted', 'rational points $N1$ of a curve', 'Zeros of $Lschi$, seen through the smoothed prime sum $Grx$', 1,
        'The combination $Gr$ is `Level.Gm`. The bound is one-sided: the code proves an upper bound on these sums and never states the positivity of Weil\'s functional of which the note speaks.'],
      ['Auxiliary object', 'a function $F$ on the curve with poles only at $P0$', 'Automorphic forms on totally definite unitary groups: functions on finite sets of lattice classes', 1,
        'An automorphic form of fixed level is a function on a finite set of lattice classes, so a theta lift between two such groups is a finite matrix and a chain of $m$ lifts is a product of $m$ matrices.'],
      ['Multiplicity', '$F$ vanishes to order $pmu$ at every rational point other than $P0$', 'A chain of $m$ theta lifts, $mrange$ (`RankVal`), measured by $ell$-adic divisibility (`ThmP`)', 0,
        'With $d1$, $m$ is between $mlo$ and twice that. Taking the note\'s $X$ to be this scale $x$ makes $m$ the note\'s square root with an $eps$ of room, and that identification is our reading. The code names neither $D$ nor multiplicity.'],
      ['Why multiplicity is free', '$p$-th powers are invisible to derivatives', 'No derivative on $Z$: each lift adds one block $pibox$ to the parameter', 0,
        'There is no derivative to make an integer vanish twice. In the note\'s step 8 each lift sends $pi$ to $pibox$; the ranks in the code grow by `R.t + 1` per step, which we could not reconcile with $muj$.'],
      ['Degree budget', 'Riemann and Roch, a nonzero $F$ has as many zeros as poles', 'Product formula: a nonzero algebraic number is not divisible beyond its archimedean size (`norm_height_bound`)', 0,
        'The degree budget on the spine is the product formula for a nonzero algebraic number, which says that it cannot be divisible by more prime powers than its archimedean size allows (`norm_height_bound`).'],
      ['Extensions', 'pass to $Fqn$ and use twists for the lower bound', 'A 2-adic cyclotomic tower, and windows of scales found by a pigeonhole (`VWin`)', 0,
        'The field of `VWin` uses the layer $nu2$ of the 2-adic cyclotomic tower with $nu$ about $x28$ (`IsChiField`, `PageN`), and a pigeonhole over scales (`window1`) finds the window.'],
      ['Conclusion', 'every inverse root has absolute value $sqrtq$', 'A bound $xb$ on windows forbids zeros with real part above $half9$, then $epsto0$', 1,
        'An upper bound $Cy$ on windows $win$ forces zero-freeness on $Res$ (`Deduction.zeroFree_of_rpow_window`), here with $theta$. The functional equation then gives the line.']
    ];
    var sel = 0, hover = -1, grow = fig.tween(1), hit = [], lettered = 0;   // rows whose text is drawn: a few more per frame at first, to keep the first frame short
    function choose(i) { if (i < 0 || i > 6 || i === sel) return; sel = i; grow.set(0); grow.to(1, 250, 'outCubic'); }
    fig.button({ label: 'Previous', onClick: function () { choose(sel - 1); } });
    fig.button({ label: 'Next', onClick: function () { choose(sel + 1); } });
    var only = fig.toggle({ label: 'Show only what the code states', value: false });
    fig.onReset = function () { sel = 0; grow.set(1); };
    var P = fig.plane({ x: [0, 1], y: [0, 1], pad: 0 });
    var probe = fig.probe({ plane: P, crosshair: false, marker: false, pick: function (x, y) { var i = hitAt(P.X(x), P.Y(y)); if (i >= 0) choose(i); } });
    function hitAt(px, py) { for (var i = 0; i < hit.length; i++) { var r = hit[i]; if (px >= r[1] && px <= r[3] && py >= r[2] && py <= r[4]) return r[0]; } return -1; }

    /* Rich text: words of parts { s, mono, bold } or { tex }, wrapped to a width; cached by text, width, and size. */
    var parsed = {}, wrapped = {};
    function parse(str) {
      if (parsed[str]) return parsed[str];
      var words = [], cur = [], buf = '', mode = '', i, ch;
      function flush() { if (buf) cur.push(mode === '$' ? { tex: buf } : { s: buf, mono: mode === '`', bold: mode === '*' }); buf = ''; }
      for (i = 0; i < str.length; i++) {
        ch = str[i];
        if (ch === '$' || ch === '`') { flush(); mode = mode === ch ? '' : ch; continue; }
        if (ch === '*' && str[i + 1] === '*') { flush(); mode = mode === '*' ? '' : '*'; i++; continue; }
        if (ch === ' ' && mode !== '`') { flush(); if (cur.length) words.push(cur); cur = []; continue; }
        buf += ch;
      }
      flush(); if (cur.length) words.push(cur);
      return (parsed[str] = words);
    }
    function partW(p, size) { return p.tex ? fig.labelSize(p.tex, size).w : fig.measure(p.s, p.mono ? size - 0.5 : size, p.bold ? 700 : 500, p.mono); }
    /* Lines of runs: neighbouring words of one style become one string, so a line costs a few fillText calls. */
    function wrap(str, width, size) {
      var key = str + '|' + Math.round(width) + '|' + size;
      if (wrapped[key]) return wrapped[key];
      var lines = [], line = [], x = 0, prev = null, sp = fig.measure(' ', size);
      parse(str).forEach(function (wd) {
        var ww = 0; wd.forEach(function (p) { ww += partW(p, size); });
        if (line.length && x + sp + ww > width) { lines.push(line); line = []; x = 0; prev = null; }
        var space = line.length > 0;
        if (space) x += sp;
        wd.forEach(function (p, i) {
          var st = p.tex ? -1 : p.mono ? 2 : p.bold ? 1 : 0;
          if (prev && st >= 0 && prev.st === st) prev.s += (space && i === 0 ? ' ' : '') + p.s;
          else line.push(prev = st < 0 ? { x: x, tex: p.tex, st: -1 } : { x: x, s: p.s, st: st });
          x += partW(p, size);
        });
      });
      if (line.length) lines.push(line);
      return (wrapped[key] = lines);
    }
    function drawText(lines, x, y, size, lh, color, alpha) {
      for (var st = -1; st < 3; st++) lines.forEach(function (line, li) {
        line.forEach(function (r) {
          if (r.st !== st) return;
          if (st < 0) fig.label(r.tex, x + r.x, y + li * lh, { anchor: 'w', color: color, size: size, alpha: alpha, id: fig.autoId('rt', r.tex) });
          else fig.text(r.s, x + r.x, y + li * lh, { color: st === 2 ? 'muted' : color, size: st === 2 ? size - 0.5 : size, weight: st === 1 ? 700 : 500, mono: st === 2, baseline: 'middle', alpha: alpha });
        });
      });
    }
    function card(x, y, w, h, color, width, alpha) {
      var ctx = fig.ctx;
      ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(x, y, w, h, 6); else ctx.rect(x, y, w, h);
      ctx.fillStyle = fig.color('stage', 0.96); ctx.fill();
      fig.stroke({ color: color, width: width, alpha: alpha }); ctx.stroke();
    }
    function chip(code, xr, cy, alpha, size) {
      var label = code ? 'in the code' : 'our reading', cw = fig.measure(label, size, 600) + 12, ch = size + 7;
      if (code) fig.rect(xr - cw, cy - ch / 2, cw, ch, { fill: 'teal', alpha: 0.9 * alpha });
      else fig.rect(xr - cw, cy - ch / 2, cw, ch, { color: 'red', width: 1.2, alpha: alpha });
      fig.text(label, xr - cw / 2, cy + 0.5, { color: code ? 'stage' : 'red', size: size, weight: 600, align: 'center', baseline: 'middle', alpha: alpha });
      return cw;
    }
    function header(which, x, y, size, alpha) {
      return fig.mathText([which ? 'The formal proof, over ' : 'Stepanov, over ', { tex: which ? 'Z' : 'Fq' }], x, y, { size: size, color: 'muted', weight: 600, alpha: alpha });
    }

    /* The tag of a row as in the narrow strip: a teal disc for "in the code", a red ring for "our reading". */
    function tagDot(code, cx, cy, r, on, alpha) {
      fig.circle(cx, cy, r, { fill: code ? 'teal' : 'stage', alpha: code ? 0.9 * alpha : alpha, ring: on ? 'fg' : code ? null : 'red', ringWidth: on ? 2.4 : 1.5 });
    }
    /* Wide: all rows side by side, the tag on the link between the cards, and the selected row's sentence below when
       it fits. Returns false if the rows do not fit. */
    function wide(w, h) {
      var m = 10, gap = 34, size = 12.5, lh = 17, cw = (w - 2 * m - gap) / 2, rows = [], y = 32, i;
      var est = function (str, width) { return Math.ceil(1.1 * fig.measure(str.replace(/\*\*|\$|`/g, ''), size) / width); }, ey = 32;
      for (i = 0; i < 7; i++) ey += Math.max(est(ROWS[i][0] + ': ' + ROWS[i][1], cw - 20), est(ROWS[i][2], cw - 20)) * lh + 16;
      if (ey > h) return false;      // cheap test before any wrapping
      for (i = 0; i < 7; i++) {
        var L = wrap('**' + ROWS[i][0] + ':** ' + ROWS[i][1], cw - 20, size), R = wrap(ROWS[i][2], cw - 20, size);
        var rh = Math.max(L.length, R.length) * lh + 11;
        rows.push({ L: L, R: R, y: y, h: rh }); y += rh + 5;
      }
      if (y > h) return false;
      var D = wrap(ROWS[sel][4], w - 2 * m - 24, size), dh = D.length * lh + 36, xr = m + cw + gap;
      // the key of the tags, at the right end of the header line
      var hw = fig.measure('The formal proof, over ', 12.5, 600) + fig.labelSize('Z', 12.5).w;
      var k1 = fig.measure('in the code', 11.5, 500), k2 = fig.measure('our reading', 11.5, 500), kx = w - m - 2 - k2;
      if (kx - 41 - k1 < xr + hw + 12) return false;
      header(0, m + 2, 14, 12.5, 1); header(1, xr + 2, 14, 12.5, 1);
      fig.text('our reading', kx, 14, { color: 'red', size: 11.5, baseline: 'middle' }); tagDot(false, kx - 11, 14, 5, false, 1);
      kx -= 30 + k1;
      fig.text('in the code', kx, 14, { color: 'teal', size: 11.5, baseline: 'middle' }); tagDot(true, kx - 11, 14, 5, false, 1);
      hit = [];
      if (lettered < 7) { lettered += 2; fig.more(); }
      for (i = 0; i < 7; i++) {
        var r = rows[i], code = ROWS[i][3], a = only.value && !code ? 0.28 : 1, on = i === sel, hv = i === hover;
        var cyMid = r.y + r.h / 2, k = on ? grow.value : 1;
        card(m, r.y, cw, r.h, 'blue', on ? 2.6 : hv ? 2 : 1.3, a);
        card(xr, r.y, cw, r.h, 'gold', on ? 2.6 : hv ? 2 : 1.3, a);
        fig.line(m + cw, cyMid, m + cw + gap * k, cyMid, { color: on ? 'fg' : 'muted', width: on ? 2 : 1.2, alpha: a });
        tagDot(code, m + cw + gap / 2, cyMid, on ? 7 : 6, on, a);
        hit.push([i, m, r.y, w - m, r.y + r.h]);
        if (i >= lettered) continue;
        drawText(r.L, m + 10, cyMid - (r.L.length - 1) * lh / 2, size, lh, 'fg', a);
        drawText(r.R, xr + 10, cyMid - (r.R.length - 1) * lh / 2, size, lh, 'fg', a);
      }
      var dy = y + 4, code0 = ROWS[sel][3];
      if (dy + dh + 4 > h) return true;      // no room for the sentence: the rows alone
      card(m, dy, w - 2 * m, Math.min(h - dy - 4, dh + 8), code0 ? 'teal' : 'red', 1.2, 0.8);
      fig.text('Row ' + (sel + 1) + ' of 7  ·  ' + ROWS[sel][0] + '  ·  ' + (code0 ? 'in the code' : 'our reading'), m + 12, dy + 16, { color: code0 ? 'teal' : 'red', size: 12, weight: 700, baseline: 'middle' });
      drawText(D, m + 12, dy + 33 + (1 - grow.value) * 6, size, lh, 'fg', grow.value);
      return true;
    }
    /* Narrow: a strip of the seven rows, and the selected row opened with its cards stacked. */
    function narrowLayout(w, h) {
      var m = 8, size = w < 420 ? 11.5 : 12, lh = size + 5, pitch = (w - 2 * m) / 7, i, k = grow.value, code = ROWS[sel][3];
      hit = [];
      for (i = 0; i < 7; i++) {
        var cx = m + pitch * (i + 0.5), c = ROWS[i][3], a = only.value && !c ? 0.3 : 1, on = i === sel;
        if (i < 6) fig.line(cx + 12, 16, cx + pitch - 12, 16, { color: 'muted', width: 1, alpha: 0.5 });
        tagDot(c, cx, 16, on ? 12 : 10, on, a);
        fig.text(String(i + 1), cx, 16.5, { color: c ? 'stage' : 'red', size: 11.5, weight: 700, align: 'center', baseline: 'middle', alpha: a });
        hit.push([i, cx - pitch / 2, 0, cx + pitch / 2, 34]);
      }
      var a0 = only.value && !code ? 0.3 : 1, y = 40;
      fig.text((sel + 1) + '  ' + ROWS[sel][0], m, y, { color: 'fg', size: 13, weight: 700, baseline: 'middle', alpha: a0 });
      var cw = w - 2 * m, L = wrap(ROWS[sel][1], cw - 16, size), R = wrap(ROWS[sel][2], cw - 16, size), off = (1 - k) * 10;
      var lhgt = L.length * lh + 30, rhgt = R.length * lh + 30, ly = y + 12 + off;
      card(m, ly, cw, lhgt, 'blue', 2, a0 * (0.4 + 0.6 * k));
      header(0, m + 8, ly + 12, 11, a0); drawText(L, m + 8, ly + 30, size, lh, 'fg', a0 * k);
      var ry = ly + lhgt + 16;
      fig.arrow(w / 2, ly + lhgt + 1, w / 2, ry - 1, { color: 'fg', width: 1.6, head: 6, alpha: a0 * k });
      card(m, ry, cw, rhgt, 'gold', 2, a0 * (0.4 + 0.6 * k));
      header(1, m + 8, ry + 12, 11, a0); chip(code, m + cw - 6, ry + 12, a0, 10);
      drawText(R, m + 8, ry + 30, size, lh, 'fg', a0 * k);
      var dy = ry + rhgt + 14, D = wrap(ROWS[sel][4], cw - 4, size - 0.5);
      var fit = Math.floor((h - dy) / (lh - 0.5));
      if (fit >= 2) drawText(D.length > fit ? D.slice(0, fit) : D, m + 2, dy + 4, size - 0.5, lh - 0.5, 'muted', k);
      if (fit >= 2 && D.length > fit) fig.text('…', w - m - 4, dy + 4 + (fit - 1) * (lh - 0.5), { color: 'muted', size: size, align: 'right', baseline: 'middle' });
    }

    return function draw() {
      hover = probe.active ? hitAt(P.X(probe.x), P.Y(probe.y)) : -1;
      if (fig.w < 620 || !wide(fig.w, fig.h)) narrowLayout(fig.w, fig.h);
    };
  }
});
