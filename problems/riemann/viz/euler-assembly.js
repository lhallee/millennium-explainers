/* The Euler product assembled prime by prime. Cell n of the grid 1..120 is lit once every prime factor of n has been
   multiplied in, that is once its largest prime factor is among the first k primes; the bar fills to
   Pi_N(s) = prod over those primes of 1/(1 - p^-s) out of zeta(s). Lit cells glow with n^-s on a compressed scale
   (alpha grows with n^(-s/2)) so that every lit cell stays visible. */
Kit.register('euler-assembly', {
  tex: { Pi: '\\Pi_N(s)', zeta: '\\zeta(s)', pi26: '\\;=\\;\\pi^2/6', fac: '1/(1-p^{-s})', gap: '\\zeta(s)-\\Pi_N(s)', s: 's', nms: 'n^{-s}' },
  init: function (fig) {
    var M = Kit.math, fmt = Kit.fmt, NMAX = 120, PR = [], i, j;
    for (i = 2; i <= 113; i++) { for (j = 0; j < PR.length && i % PR[j]; j++); if (j === PR.length) PR.push(i); }
    var NP = PR.length, rank = new Int32Array(NMAX + 1), lpf = new Int32Array(NMAX + 1), facStr = ['', 'empty product'];
    rank[1] = -1; lpf[1] = 1;
    for (var n = 2; n <= NMAX; n++) {
      var q = n, parts = [];
      for (j = 0; j < NP && q > 1; j++) {
        var e = 0; while (q % PR[j] === 0) { q /= PR[j]; e++; }
        if (e) { parts.push(PR[j] + (e > 1 ? fmt.sup(e) : '')); rank[n] = j; lpf[n] = PR[j]; }
      }
      facStr[n] = parts.join(' × ');
    }

    var play = fig.player({ label: 'Primes multiplied in', min: 0, max: NP, duration: 0.7 * NP, autoplay: false, value: 3 / NP, reduced: 3 / NP,
      format: function (v) { var k = Math.floor(v + 1e-9); return k ? 'p ≤ ' + PR[k - 1] : 'none'; } });
    var kNow = function () { return Kit.clamp(Math.floor(play.mapped + 1e-9), 0, NP); };
    fig.button({ label: 'Back', onClick: function () { play.pause(); play.seek(Math.max(0, kNow() - 1)); } });
    fig.button({ label: 'Multiply in the next prime', onClick: function () { play.pause(); play.seek(Math.min(NP, kNow() + 1)); } });
    var S = fig.slider({ label: 'Exponent', tex: 's', min: 1.2, max: 4, step: 0.01, value: 2 });
    var bar = fig.follow(1.5625, { tau: 0.08 }), flash = fig.tween(1), lastK = -1, fLo = 0, fHi = 0;
    var cellX = new Float64Array(NMAX + 1), cellY = new Float64Array(NMAX + 1), NUM = [], still = null, stillKey = '';
    for (i = 0; i <= NMAX; i++) NUM.push(String(i));
    /* The grid into the context c (fig.ctx points at c meanwhile), in batches: fills by globalAlpha, outlines as one
       path per style, numbers in two fonts. */
    function paintGrid(c, k, s, hover, wd, ht, fs) {
      var CX = cellX, CY = cellY, n;
      c.fillStyle = fig.c.gold;
      for (n = 1; n <= NMAX; n++) if (rank[n] < k) { c.globalAlpha = 0.1 + 0.55 * Math.pow(n, -s / 2); c.fillRect(CX[n], CY[n], wd, ht); }
      c.globalAlpha = 1;
      var outline = function (color, alpha, width, test) {
        fig.stroke({ color: color, alpha: alpha, width: width });
        c.beginPath();
        for (var m = 1; m <= NMAX; m++) if (test(m)) c.rect(CX[m] + 0.5, CY[m] + 0.5, wd - 1, ht - 1);
        c.stroke();
      };
      outline('gold', 0.4, 1, function (m) { return rank[m] < k && !(k > 0 && rank[m] === k - 1); });
      if (k > 0) outline('gold', 0.95, 2, function (m) { return rank[m] === k - 1; });
      outline('fg', 0.7, 1.2, function (m) { return rank[m] >= k && lpf[m] === m; });
      if (hover) fig.rect(CX[hover] - 0.5, CY[hover] - 0.5, wd + 1, ht + 1, { color: 'fg', width: 2 });
      for (var pass = 0; pass < 2; pass++) {
        var first = true;
        for (n = 1; n <= NMAX; n++) {
          if ((rank[n] < k) !== (pass === 0)) continue;
          if (first) { fig.text(NUM[n], CX[n] + wd / 2, CY[n] + ht / 2 + 0.5, { size: fs, align: 'center', baseline: 'middle', color: pass ? 'muted' : 'fg', alpha: pass ? 0.55 : 1, weight: pass ? 500 : 600 }); first = false; }
          else c.fillText(NUM[n], CX[n] + wd / 2, CY[n] + ht / 2 + 0.5);
        }
      }
    }

    // layout: the grid, then the bar (with the readout beside it when wide), then the chips
    /* The bar's ticks and labels and the prime chips into the context c (fig.ctx points at c meanwhile). */
    function paintRest(c, L, k, hv, gap) {
      var bb = B.box, yB = bb.b, gapText = 'gap ' + fmt(gap, 4), gw = fig.measure(gapText, 11.5, 600), j;
      fig.line(B.X(1), yB, B.X(1), yB + 4, { color: 'muted', width: 1 });
      fig.line(bb.l + 0.5, yB, bb.l + 0.5, yB + 4, { color: 'muted', width: 1 });
      fig.text('0', bb.l, yB + 15, { color: 'muted', size: 11.5 });
      if (B.X(1) + 6 < bb.r - gw - 8) fig.text('1', B.X(1), yB + 15, { color: 'muted', size: 11.5, align: 'center' });
      fig.text(gapText, bb.r, yB + 15, { color: 'red', size: 11.5, weight: 600, align: 'right' });
      var cb = C.box, pw = cb.w / L.perRow;
      var chipX = function (q) { return cb.l + (q % L.perRow) * pw + 2; }, chipY = function (q) { return cb.t + Math.floor(q / L.perRow) * (L.chipH + 4); };
      for (j = 0; j < NP; j++) {
        fig.rect(chipX(j), chipY(j), pw - 4, L.chipH, j < k ? { fill: 'gold', alpha: 0.9 } : { color: 'muted', alpha: 0.6, width: 1 });
        if (j === k - 1 || j === hv) fig.rect(chipX(j) - 1.5, chipY(j) - 1.5, pw - 1, L.chipH + 3, { color: 'fg', width: 1.6 });
      }
      for (j = 0; j < NP; j++) {                                  // one font: the kit's call sets it, fillText does the rest
        var tx = chipX(j) + (pw - 4) / 2, ty = chipY(j) + L.chipH / 2 + 0.5;
        if (j === 0) fig.text(NUM[PR[j]], tx, ty, { size: L.narrow ? 10 : 11.5, align: 'center', baseline: 'middle', color: j < k ? 'stage' : 'muted', weight: 600 });
        else { c.fillStyle = j < k ? fig.c.stage : fig.c.muted; c.fillText(NUM[PR[j]], tx, ty); }
      }
    }

    var lay = { w: -1 };
    function layout(w, h) {
      if (lay.w === w && lay.h === h) return lay;
      var narrow = w < 600, cols = narrow ? 15 : 20, perRow = narrow ? 15 : NP, chipH = narrow ? 18 : 24;
      var chipBlock = Math.ceil(NP / perRow) * (chipH + 4), barBlock = narrow ? 54 : 96, m = 8;
      var gh = h - m - barBlock - chipBlock - 2 * m;
      lay = { w: w, h: h, narrow: narrow, cols: cols, rows: NMAX / cols, perRow: perRow, chipH: chipH,
        // the readout beside the bar is about 280 px wide (its widest row, "1.00000 (p = 113)"), 28 px from the bar
        grid: [m, m, w - m, m + gh], bar: [m, m + gh + m, narrow ? w - m : Math.min(0.64 * w, w - 316), m + gh + m + barBlock],
        chips: [m, h - chipBlock - 2, w - m, h - 2] };
      return lay;
    }
    var G = fig.plane({ x: [0, 20], y: [0, 6], pad: 0, box: function (w, h) { return layout(w, h).grid; } });
    var B = fig.plane({ x: [0, 1.6449], y: [0, 1], pad: { t: 26, r: 6, b: 22, l: 6 }, box: function (w, h) { return layout(w, h).bar; } });
    var C = fig.plane({ x: [0, NP], y: [0, 2], pad: 0, box: function (w, h) { return layout(w, h).chips; } });
    var cellAt = function (x, y) { var L = lay, c = Kit.clamp(Math.floor(x), 0, L.cols - 1), r = Kit.clamp(Math.floor(L.rows - y), 0, L.rows - 1); return r * L.cols + c + 1; };
    var chipAt = function (x, y) { var L = lay, rows = Math.ceil(NP / L.perRow); return Kit.clamp(Math.floor(rows - y) * L.perRow + Math.floor(x), 0, NP - 1); };
    var gp = fig.probe({ plane: G, crosshair: false, marker: false,
      rows: function (x, y) {
        var n = cellAt(x, y), s = S.value, k = kNow();
        return [[n + ' =', facStr[n]], [rank[n] < k ? 'lit by' : 'lights at', n === 1 ? 'always' : 'p = ' + lpf[n]], [{ tex: 'nms' }, fmt(Math.pow(n, -s), 5)]];
      } });
    var cp = fig.probe({ plane: C, crosshair: false, marker: false,
      rows: function (x, y) { var p = PR[chipAt(x, y)]; return [['p', String(p)], [{ tex: 'fac' }, fmt(1 / (1 - Math.pow(p, -S.value)), 5)]]; },
      pick: function (x, y) { play.pause(); play.seek(chipAt(x, y) + 1); } });

    // Far from the window the kit releases the canvas; the still copy goes too and is painted again on return.
    fig.onRelease = function () { still = null; stillKey = ''; };
    return function draw() {
      var L = layout(fig.w, fig.h), s = S.value, k = kNow(), ctx = fig.ctx;
      if (k !== lastK) {
        if (lastK >= 0 && k > lastK) { fLo = lastK; fHi = k; flash.set(0); flash.to(1, 900, 'outCubic'); } else if (k < lastK) flash.set(1);
        lastK = k;
      }
      var Pi = 1, litSum = 0;
      for (j = 0; j < k; j++) Pi /= 1 - Math.pow(PR[j], -s);
      var z = M.zeta(s, 0).re, shown = bar.to(Pi).value;
      G.view.x1 = L.cols; G.view.y1 = L.rows; C.view.y1 = Math.ceil(NP / L.perRow); C.view.x1 = L.perRow; B.view.x1 = z;
      G.update(); C.update(); B.update();

      // the grid of integers
      var g = G.box, cw = g.w / L.cols, ch = g.h / L.rows, fs = Math.min(13, Math.max(9.5, Math.min(cw * 0.42, ch * 0.5)));
      // Everything but the bar's fill and the readouts changes only with k, s, the hovered cell or chip, the size, and
      // the theme, so it is painted into an offscreen canvas when one of those changes and copied in every other frame.
      // A steady frame then sets no canvas font, and so forces no style recalculation of the page while the player's
      // controls change, and skips 150 numbers. The flash of newly lit cells goes on top of the copy.
      var hover = gp.active ? cellAt(gp.x, gp.y) : 0, hv = cp.active ? chipAt(cp.x, cp.y) : -1, wd = cw - 3, ht = ch - 3, n;
      for (n = 1; n <= NMAX; n++) { cellX[n] = g.l + ((n - 1) % L.cols) * cw + 1.5; cellY[n] = g.t + Math.floor((n - 1) / L.cols) * ch + 1.5; }
      for (n = 1; n <= NMAX; n++) if (rank[n] < k) litSum += Math.pow(n, -s);
      var dpr = ctx.getTransform().a, bb = B.box;
      var key = [k, s, hover, hv, fig.w, fig.h, dpr, fs, fig.c.fg, fig.c.gold, fig.c.muted, fig.c.red].join('|');
      if (key !== stillKey) {
        stillKey = key;
        if (!still) still = document.createElement('canvas');
        var SW = Math.ceil(fig.w * dpr), SH = Math.ceil(fig.h * dpr);
        if (still.width !== SW || still.height !== SH) { still.width = SW; still.height = SH; }
        var c2 = still.getContext('2d');
        c2.setTransform(dpr, 0, 0, dpr, 0, 0); c2.clearRect(0, 0, fig.w, fig.h);
        fig.ctx = c2;
        try { paintGrid(c2, k, s, hover, wd, ht, fs); paintRest(c2, L, k, hv, z - Pi); } finally { fig.ctx = ctx; }
      }
      ctx.drawImage(still, 0, 0, still.width / dpr, still.height / dpr);
      if (flash.value < 1) {
        ctx.fillStyle = fig.c.fg; ctx.globalAlpha = 0.8 * (1 - flash.value);
        for (n = 1; n <= NMAX; n++) if (rank[n] < k && rank[n] >= fLo && rank[n] < fHi) ctx.fillRect(cellX[n], cellY[n], wd, ht);
        ctx.globalAlpha = 1;
      }
      fig.occRect(g.l, g.t, g.w, g.h);

      // the bar: Pi_N(s) out of zeta(s), the gap in red; the readouts all in the panel's font (11.5 px monospace)
      var x1 = B.X(Math.min(shown, z)), yT = bb.t, yB = bb.b;
      fig.rect(bb.l, yT, x1 - bb.l, yB - yT, { fill: 'gold', alpha: 0.85 });
      fig.rect(x1, yT, bb.r - x1, yB - yT, { fill: 'red', alpha: 0.16 });
      fig.rect(x1 + 0.5, yT + 0.5, Math.max(0, bb.r - x1 - 1), yB - yT - 1, { color: 'red', width: 1.4 });
      var eq = Math.abs(s - 2) < 1e-9;
      var zw = fig.labelSize('zeta', 11.5).w + (eq ? fig.labelSize('pi26', 11.5).w : 0) + fig.measure(' = ' + fmt(z, 4), 11.5, 500, true);
      fig.mathText([{ tex: 'zeta' }, eq ? { tex: 'pi26' } : null, ' = ' + fmt(z, 4)], bb.r, yT - 11, { size: 11.5, mono: true, align: 'right' });
      if (bb.l + fig.labelSize('Pi', 11.5).w + 84 < bb.r - zw - 12) fig.mathText([{ tex: 'Pi' }, ' = ' + fmt(Pi, 4)], bb.l, yT - 11, { size: 11.5, mono: true, color: 'gold' });
      if (!L.narrow) {
        var p = k ? PR[k - 1] : 0;
        fig.panel([
          [{ tex: 'fac' }, k ? fmt(1 / (1 - Math.pow(p, -s)), 5) + ' (p = ' + p + ')' : 'none yet'],
          [{ tex: 'Pi' }, fmt(Pi, 5), 'gold'],
          [{ tex: 'gap' }, fmt(z - Pi, 5), 'red'],
          ['lit cells, n ≤ 120', fmt(litSum, 5), 'gold']
        ], { x: bb.r + 28, y: B.outer.t + 2, id: 'read' });
      }
      ctx.globalAlpha = 1;
    };
  }
});
