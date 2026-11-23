/* The sieve of Eratosthenes on 1..120 beside the same sieve on the monic polynomials over F_q of degree 1..D, then the
   counts I_n against q^n/n. Factoring runs once per q (to degree 10 for q = 2, 6 for q = 3) as a job: in pass order (by
   degree, then by coefficient string) each irreducible P of degree at most D/2 strikes every product P g, g monic of
   degree >= 1, multiplied coefficient by coefficient mod q, and each chip records the first pass that strikes it. Row n
   is settled once every pass of degree <= n/2 is done; its survivors are the irreducibles. The job checks n I_n against
   sum_{d|n} mu(d) q^(n/d) for every row and throws on a mismatch. Step k of the player runs integer pass k (primes 2, 3,
   5, 7, whose squares are at most 120) and polynomial pass k together. */
Kit.register('poly-sieve', {
  tex: { F2: '\\FF_2[T]', F3: '\\FF_3[T]', ratio: 'I_n/(q^n/n)', one: 'q^n/n', band: '1 \\pm 2q^{-n/2}' },
  init: function (fig) {
    var M = Kit.math, fmt = Kit.fmt, DMAX = { 2: 10, 3: 6 }, data = {}, jobs = {};
    var IP = [2, 3, 5, 7], SQ = [4, 9, 25, 49, 121], strikeInt = new Int8Array(121), decInt = new Int8Array(121);
    for (var m = 2; m <= 120; m++) {
      for (var k = 0; k < 4; k++) if (m % IP[k] === 0 && m !== IP[k]) { strikeInt[m] = k + 1; break; }
      while (SQ[decInt[m]] <= m) decInt[m]++;                       // settled after this many passes
    }

    function digits(v, n, q, out) { for (var i = 0; i < n; i++) { out[i] = v % q; v = (v - out[i]) / q; } out[n] = 1; }
    function* factor(q) {
      var D = DMAX[q], off = [0, 0], n, i, j, t, u, v;
      for (n = 1; n <= D; n++) off[n + 1] = off[n] + Math.pow(q, n);
      var strike = new Int16Array(off[D + 1]), passes = [], last = [0], I = [0];
      var a = new Int8Array(D + 1), b = new Int8Array(D + 1), c = new Int8Array(D + 1);
      for (n = 1; n <= D; n++) {
        var cnt = 0, want = 0;
        for (i = 0; i < Math.pow(q, n); i++) {
          if (strike[off[n] + i]) continue;
          cnt++;
          if (2 * n > D) continue;
          passes.push(off[n] + i);
          digits(i, n, q, a);
          for (var mm = 1; n + mm <= D; mm++) for (j = 0; j < Math.pow(q, mm); j++) {
            digits(j, mm, q, b);
            for (t = 0; t <= n + mm; t++) c[t] = 0;
            for (u = 0; u <= n; u++) if (a[u]) for (v = 0; v <= mm; v++) c[u + v] = (c[u + v] + a[u] * b[v]) % q;
            var id = 0;
            for (t = n + mm - 1; t >= 0; t--) id = id * q + c[t];
            if (!strike[off[n + mm] + id]) strike[off[n + mm] + id] = passes.length;
            if ((j & 127) === 127) yield n / D;
          }
          yield n / D;
        }
        for (var d = 1; d <= n; d++) if (n % d === 0) want += M.mobius(d) * Math.pow(q, n / d);
        if (cnt * n !== want) throw new Error('poly-sieve: sieve finds ' + cnt + ' irreducibles of degree ' + n + ' over F_' + q + ', formula ' + want / n);
        I[n] = cnt; last[n] = passes.length;
      }
      return { D: D, off: off, strike: strike, passes: passes, last: last, I: I };
    }
    function need(q) { if (!jobs[q]) jobs[q] = fig.job(function () { return factor(q); }, { onDone: function (r) { data[q] = r; } }); }
    var OFF = { 2: [0, 0], 3: [0, 0] }, ROW = {};                   // ROW[q][id]: the degree of chip id
    [2, 3].forEach(function (q) {
      for (var n = 1; n <= DMAX[q]; n++) OFF[q][n + 1] = OFF[q][n] + Math.pow(q, n);
      ROW[q] = new Uint8Array(OFF[q][DMAX[q] + 1]);
      for (n = 1; n <= DMAX[q]; n++) ROW[q].fill(n, OFF[q][n], OFF[q][n + 1]);
    });
    function rowOf(q, id) { return ROW[q][id]; }
    function polyStr(q, n, idx) {                                    // T³ + 2T + 1
      var dg = new Int8Array(n + 1), s = [];
      digits(idx, n, q, dg);
      for (var e = n; e >= 0; e--) if (dg[e]) s.push((dg[e] > 1 || e === 0 ? dg[e] : '') + (e ? 'T' + (e > 1 ? fmt.sup(e) : '') : ''));
      return s.join(' + ');
    }

    var Q = fig.select({ label: 'Field', options: [['2', 'q = 2'], ['3', 'q = 3']], value: '2', onInput: function () { restart(); } });
    var D2 = fig.slider({ label: 'Largest degree', min: 1, max: 10, step: 1, value: 8, onInput: function () { restart(); } });
    var D3 = fig.slider({ label: 'Largest degree', min: 1, max: 6, step: 1, value: 5, onInput: function () { restart(); } });
    var play = fig.player({ label: 'Sieve', duration: 9, reduced: 1 });
    function restart() { play.set(0); if (Kit.reducedMotion) play.set(1); else play.play(); }
    // The factoring job for the field shown starts in the first draw (need), so that it runs from the second frame.

    /* Layout in pixels: integers in 12 columns beside the polynomials, or on a narrow stage in a strip of 30 columns
       above them, where the cells are too small for numbers. */
    function geom(W, H) {
      var wide = W >= 700, top = 18, ic = wide ? 12 : 30, ir = 120 / ic;
      var cell = wide ? Math.min(0.3 * W / ic, (H - top - 8) / ir) : Math.min((W - 16) / ic, 13);
      var px0 = wide ? 8 + ic * cell + 28 : 8, py0 = wide ? top + 4 : top + 4 + ir * cell + 8 + top, barH = wide ? Math.max(70, 0.36 * (H - py0)) : Math.max(100, 0.42 * (H - py0));
      return { wide: wide, top: top, ic: ic, ir: ir, cell: cell, ix0: 8, iy0: top + 4, px0: px0, py0: py0, pw: W - 8 - px0, barH: barH,
        R: { l: px0, t: py0, w: W - 8 - px0, h: H - py0 - barH - 10 } };
    }
    var bars = fig.plane({ x: [0.3, 8.7], y: [0, 2.5], pad: { t: 30, r: 10, b: 20, l: 30 },
      box: function (w, h) { var g = geom(w, h); return [g.px0 - (g.wide ? 26 : 8), h - g.barH, w, h]; } });
    var chipP = fig.plane({ x: [0, 1], y: [0, 1], pad: 0, box: function (w, h) { var R = geom(w, h).R; return [R.l, R.t, R.l + R.w, R.t + R.h]; } });
    var IXS = new Float32Array(120), IYS = new Float32Array(120), lay = { key: '' }, cx = new Float32Array(2046), cy = new Float32Array(2046), bucket = new Uint8Array(2046);
    function steps() { var r = data[+Q.value], D = (+Q.value === 2 ? D2 : D3).value; return Math.max(4, r ? r.last[Math.floor(D / 2)] : 4); }

    /* Chips in rows by degree, wrapped to the region; the largest cell that fits, with labels when they fit. */
    function layout(q, D, R) {
      var key = [q, D, R.l, R.t, R.w, R.h].join(), n, i, cell, cw, ch, cols, lines, gap = R.h < 160 ? 2 : 4, G = 20;
      if (key === lay.key) return lay;
      var fit = function (cw, ch) { cols = Math.max(1, Math.floor((R.w - G) / cw)); lines = 0; for (n = 1; n <= D; n++) lines += Math.ceil(Math.pow(q, n) / cols); return lines * ch + (D - 1) * gap <= R.h; };
      var lw = fig.measure('0'.repeat(D + 1), 10, 500, true) + 8, labels = fit(lw, 17);
      if (labels) { cw = lw; ch = 17; } else { for (cell = 16; cell > 2 && !fit(cell, cell); cell -= 0.25); cw = ch = cell; fit(cw, ch); }
      var y = R.t, id = 0, rowY = [];
      for (n = 1; n <= D; n++) {
        var cnt = Math.pow(q, n);
        rowY[n] = y;
        for (i = 0; i < cnt; i++, id++) { cx[id] = R.l + G + (i % cols) * cw; cy[id] = y + Math.floor(i / cols) * ch; }
        y += Math.ceil(cnt / cols) * ch + gap;
      }
      lay = { key: key, cw: cw, ch: ch, cols: cols, labels: labels, rowY: rowY, count: id, G: G, R: R };
      return lay;
    }
    fig.probe({ plane: chipP, crosshair: false, marker: false,
      snap: function (x, y) {
        var px = chipP.X(x), py = chipP.Y(y), L = lay;
        for (var id = 0; id < L.count; id++) if (px >= cx[id] && px < cx[id] + L.cw && py >= cy[id] && py < cy[id] + L.ch) { var w = chipP.toWorld(cx[id] + L.cw / 2, cy[id] + L.ch / 2); return [w[0], w[1], id]; }
        return null;
      },
      rows: function (x, y, pr) {
        var q = +Q.value, r = data[q], L = lay, px = chipP.X(x), py = chipP.Y(y);
        if (!r || !pr.snapped) return null;
        for (var id = 0; id < L.count; id++) if (Math.abs(cx[id] + L.cw / 2 - px) < 0.5 && Math.abs(cy[id] + L.ch / 2 - py) < 0.5) break;
        var n = rowOf(q, id), k = r.strike[id], P = k ? r.passes[k - 1] : 0, nP = k ? rowOf(q, P) : 0;
        return [['f', polyStr(q, n, id - OFF[q][n])], k ? ['', 'multiple of ' + polyStr(q, nP, P - OFF[q][nP]), 'muted'] : ['', 'irreducible', 'gold']];
      } });

    var STATE = [['fg', 0.42], ['muted', 0.16], ['red', 1], ['gold', 1], ['gold', 1]];  // waiting, struck, being struck, prime, turning prime
    function fillCells(n, x, y, w, h, alphaOf, inset) {
      var ctx = fig.ctx;
      for (var st = 0; st < 5; st++) {
        var a = alphaOf(st);
        if (a <= 0) continue;
        ctx.fillStyle = fig.color(STATE[st][0], a);
        for (var i = 0; i < n; i++) if (bucket[i] === st) ctx.fillRect(x[i] + inset, y[i] + inset, w - 2 * inset, h - 2 * inset);
      }
    }
    /* Text centered in each cell, one font and one color per state, since setting a canvas font is slow. */
    function cellText(n, x, y, w, h, size, str, alphaOf) {
      var ctx = fig.ctx;
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      for (var st = 0; st < 5; st++) {
        if (st === 0 || st === 3) ctx.font = fig.font(size, st ? 700 : 500, true);
        ctx.fillStyle = fig.color(STATE[st][0], st === 0 ? 0.85 : st === 1 ? 0.32 : alphaOf(st));
        for (var i = 0; i < n; i++) if (bucket[i] === st) ctx.fillText(str(i), x[i] + w / 2, y[i] + h / 2 + 0.5);
      }
    }
    /* The integers' numbers are monospace text in a size set by the cell, in two weights the kit does not prepare.
       Creating those fonts and shaping 120 numbers in each made up most of a first frame of 50 to 110 ms at 4x CPU
       slowdown. So the first frames draw the cells alone, and a job creates the fonts and shapes the numbers on the
       kit's measuring context, a slice per frame; the numbers are drawn once it is done. A later size (a resize)
       is drawn at once, as before. */
    var numJob = null;
    function numbersReady(size) {
      if (!numJob) numJob = fig.job(function* () {
        for (var wt = 500; wt <= 700; wt += 200) {
          fig.measure('0123456789', size, wt, true);
          yield;
          for (var j = 1; j <= 120; j++) { fig.measure(String(j), size, wt, true); if (j % 30 === 0) yield; }
        }
      });
      return numJob.done;
    }

    return function draw() {
      var q = +Q.value, r = data[q], Dsl = q === 2 ? D2 : D3, D = Dsl.value, S = steps(), s = play.value * S;
      D2.show(q === 2); D3.show(q === 3); need(q);
      var hit = function (k) { return Kit.clamp((s - (k - 1)) / 0.55, 0, 1); };          // fade of the chips struck by pass k
      var rise = function (k) { return k <= 0 ? 1 : Kit.clamp((s - k + 0.45) / 0.45, 0, 1); };  // rows settled by pass k turn gold
      var cur = Math.ceil(s - 1e-9), fHit = hit(cur), fRise = rise(cur);
      var state = function (strike, dec) { return strike ? (strike < cur || fHit >= 1 ? 1 : strike > cur || fHit <= 0 ? 0 : 2) : (dec < cur || fRise >= 1 ? 3 : dec > cur || fRise <= 0 ? 0 : 4); };
      var alphaOf = function (st) { return st === 2 ? 0.16 + 0.84 * (1 - fHit) : st === 4 ? fRise : STATE[st][1]; };
      var G = geom(fig.w, fig.h), top = G.top, ic = G.ic, cell = G.cell, ix0 = G.ix0, iy0 = G.iy0;

      // Integers 1..120.
      var ixs = IXS, iys = IYS;
      for (var j = 0; j < 120; j++) { ixs[j] = ix0 + (j % ic) * cell; iys[j] = iy0 + Math.floor(j / ic) * cell; bucket[j] = j === 0 ? 1 : state(strikeInt[j + 1], decInt[j + 1]); }
      fillCells(120, ixs, iys, cell, cell, function (st) { return 0.13 * alphaOf(st); }, 1);
      if (cell >= 16 && numbersReady(Math.min(13, cell * 0.42))) cellText(120, ixs, iys, cell, cell, Math.min(13, cell * 0.42), function (j) { return String(j + 1); }, alphaOf);
      var pNow = cur >= 1 && s < 4 ? IP[cur - 1] : 0;
      if (pNow) fig.rect(ixs[pNow - 1] + 1, iys[pNow - 1] + 1, cell - 2, cell - 2, { color: 'fg', width: 1.5 });
      var lead = G.wide ? 'striking multiples of ' : 'integers to 120: multiples of ';
      fig.text(pNow ? lead + pNow : s >= 4 ? (G.wide ? '' : 'integers to 120: ') + 'survivors are the primes' : 'integers to 120', ix0, top - 4, { size: 12, color: pNow ? 'red' : s >= 4 ? 'gold' : 'muted' });

      // Polynomials: a header, the chips, and the bars.
      var px0 = G.px0, pw = G.pw, L = layout(q, D, G.R), Pnow = r && cur >= 1 && s < S && cur <= r.last[Math.floor(D / 2)] ? r.passes[cur - 1] : -1, n;
      var head = Pnow >= 0 ? (G.wide ? 'striking ' : '') + 'multiples of ' + polyStr(q, rowOf(q, Pnow), Pnow - OFF[q][rowOf(q, Pnow)]) : !r ? 'factoring ' + Math.round(100 * (jobs[q].progress || 0)) + '%' : s >= S ? 'survivors are the irreducibles' : '';
      var hy = G.wide ? top - 4 : G.py0 - 10, hw = fig.mathText(['monic in ', { tex: 'F' + q }], px0, hy - 4, { size: 12, color: 'muted' });
      fig.text(head, Math.max(px0 + hw + 12, px0 + pw - fig.measure(head, 12)), hy, { size: 12, color: Pnow >= 0 ? 'red' : 'gold' });
      for (var id = 0; id < L.count; id++) { n = rowOf(q, id); bucket[id] = r ? state(r.strike[id], r.last[Math.floor(n / 2)]) : 0; }
      fillCells(L.count, cx, cy, L.cw, L.ch, function (st) { return (L.labels ? 0.16 : 1) * alphaOf(st); }, Math.min(1.5, L.ch * 0.14));
      if (L.labels) cellText(L.count, cx, cy, L.cw, L.ch, 10, function (id) {
        var n = rowOf(q, id), dg = new Int8Array(n + 1), str = '';
        digits(id - OFF[q][n], n, q, dg);
        for (var e = n; e >= 0; e--) str += dg[e];
        return str;
      }, alphaOf);
      if (Pnow >= 0) fig.rect(cx[Pnow] - 1, cy[Pnow] - 1, L.cw + 2, L.ch + 2, { color: 'fg', width: 1.5 });
      var ly = -1e9;
      for (n = 1; n <= D; n++) if (L.rowY[n] - ly >= 10) { ly = L.rowY[n]; fig.text(String(n), L.R.l + L.G - 6, ly + Math.min(L.ch, 14) / 2 + 0.5, { size: L.ch < 6 ? 9.5 : 10.5, color: 'muted', align: 'right', baseline: 'middle' }); }

      // Bars: I_n / (q^n / n) against 1 and the band 1 +- 2 q^(-n/2); a row's bar rises when the row is settled.
      bars.view.x1 = D + 0.7; bars.update();
      var bw = Math.min(0.5, 30 / (bars.box.w / D));
      bars.grid({ yStep: 1 });
      bars.axes({ edge: true, xTicks: Array.from({ length: D }, function (_, i) { return i + 1; }), yTicks: [0, 1, 2], size: 10.5 });
      for (n = 1; n <= D; n++) {
        var eps = 2 * Math.pow(q, -n / 2), lo = Math.max(0, 1 - eps);
        bars.fillBetween(1 + eps, lo, n - 0.38, n + 0.38, { color: 'blue', alpha: 0.16 });
        if (!r) continue;
        var g = rise(r.last[Math.floor(n / 2)]), ratio = r.I[n] * n / Math.pow(q, n);
        if (g > 0) bars.fillBetween(ratio * g, 0, n - bw / 2, n + bw / 2, { color: 'gold', alpha: 0.9 });
        if (g >= 1 && bars.box.w / D > 22 && ratio >= 0.3) bars.text(fmt(r.I[n]), n, 0, { size: 10, weight: 700, color: 'stage', align: 'center', dy: -5 });
        bars.segment(n - 0.38, 1, n + 0.38, 1, { color: 'blue', width: 2 });
      }
      fig.legend([{ color: 'gold', fill: true, alpha: 0.9, tex: 'ratio' }, { color: 'blue', tex: 'one' }, { color: 'blue', fill: true, alpha: 0.16, tex: 'band' }],
        { plane: bars, dir: 'row', size: fig.w < 500 ? 11 : 12, bg: false, x: bars.box.l, y: bars.box.t - 30 });
    };
  }
});
