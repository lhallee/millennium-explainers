/* The spectral trace assembled from Jordan blocks. Left: six schematic points z_k with multiplicities (rings) in the
   z-plane and the strip |Re z| < a. Right: the matrix of convolution A(phi) on the jets, in the coordinates
   (u(z_k), u'(z_k), u''(z_k)) of the chapter: block k is lower triangular with entry binom(i, j) (M phi)^{(i-j)}(z_k)
   at row i, column j, so M on the diagonal, M' and 2M' below it, M'' in the corner. A point outside the strip owns no
   block; blocks grow and shrink with a short fade as a moves. The points off the line (z_3, z_5) are hypothetical zeros,
   so they are red and the drawing says so, as every hypothetical zero on the page is. */
Kit.register('sp-jordan', {
  tex: { a: 'a', ma: '-a', zk: 'z_k', keyN: 'M_k = M\\varphi(z_k)', re: '\\Re z', im: '\\Im z', key: 'M = M\\varphi(z_k),\\; M\' = (M\\varphi)\'(z_k),\\; M\'\' = (M\\varphi)\'\'(z_k)' },
  init: function (fig) {
    var IM = [8, 15, 22, 30, 37, 45], RE = [0, 0, 0.12, 0, -0.3, 0], MU = [1, 1, 2, 1, 1, 3], NP = 6, SUB = '₁₂₃₄₅₆';
    var A = fig.slider({ label: 'Strip half-width', tex: 'a', min: 0.02, max: 0.5, step: 0.01, value: 0.2,
      format: function (v) { return v.toFixed(2); } });
    var aF = fig.follow(A.value, { tau: 0.1 });
    var inside = RE.map(function (x) { return Math.abs(x) < A.value; });
    var vis = inside.map(function (v) { return fig.tween(v ? 1 : 0); });
    var READ = 60, leftW = function (w) { return Math.round(w * (w >= 700 ? 0.32 : 0.37)); };
    var Z = fig.plane({ x: [-0.6, 0.6], y: [0, 50], pad: { t: 22, r: 10, b: 28, l: 30 },
      box: function (w, h) { return [0, 0, leftW(w), w < 560 ? h - READ : h]; } });
    // Entry (i, j) of a block, i >= j: binom(i, j) times the (i - j)-th derivative of M phi at the block's point.
    var ENTRY = [['M'], ['M′', 'M'], ['M″', '2M′', 'M']];

    return function draw() {
      var a = aF.to(A.value).value, w = fig.w, h = fig.h, narrow = w < 560, k, i, j;
      for (k = 0; k < NP; k++) {
        var now = Math.abs(RE[k]) < a;
        if (now !== inside[k]) { inside[k] = now; vis[k].to(now ? 1 : 0, 380, 'inOutCubic'); }
      }

      // Left: the strip, the critical line, the points with their multiplicities.
      Z.grid({ xTicks: [-0.5, 0, 0.5], yStep: 10 });
      Z.fillBetween(50, 0, -a, a, { color: 'blue', alpha: 0.16 });
      Z.vline(-a, { color: 'blue', width: 1.4, dash: [5, 4] });
      Z.vline(a, { color: 'blue', width: 1.4, dash: [5, 4] });
      Z.vline(0, { color: 'stage', width: 5, alpha: 0.6 });
      Z.vline(0, { color: 'violet', width: 2 });
      Z.axes({ edge: true, xTicks: [[-0.5, Kit.fmt(-0.5, 1)], [0, '0'], [0.5, '0.5']], yStep: 10, xLabel: narrow ? null : 're', yLabel: narrow ? null : 'im' });
      fig.label('a', Z.X(a) + 3, Z.box.t - 3, { anchor: 'sw', color: 'blue', size: 12.5 });
      fig.label('ma', Z.X(-a) - 3, Z.box.t - 3, { anchor: 'se', color: 'blue', size: 12.5 });
      // a point off the line is a hypothetical zero: red, filled inside the strip and hollow outside it
      for (k = 0; k < NP; k++) {
        var px = Z.X(RE[k]), py = Z.Y(IM[k]), col = RE[k] !== 0 ? 'red' : 'teal';
        if (inside[k]) fig.circle(px, py, 3.6, { fill: col });
        for (i = 0; i < MU[k]; i++) fig.circle(px, py, 3.6 + 3.6 * i + (inside[k] ? 0 : 0.5), { fill: false, ring: i || !inside[k] ? col : 'stage', ringWidth: i ? 1.6 : 1.2 });
        var tx = px + (RE[k] < 0 ? -1 : 1) * (7 + 3.6 * MU[k]);
        fig.rect(RE[k] < 0 ? tx - 15 : tx - 2, py - 8, 17, 15, { fill: 'stage', alpha: 0.85 });
        fig.text('z' + SUB[k], tx, py + 4, { color: col, size: 12, align: RE[k] < 0 ? 'right' : 'left', weight: 600 });
      }
      var hn = narrow ? 'red: hypothetical' : 'red: hypothetical, off the line', hw = fig.measure(hn, 11, 600);
      fig.rect(Z.box.l + 2, Z.Y(3.2) - 9, hw + 6, 13, { fill: 'stage', alpha: 0.85 });
      fig.text(hn, Z.box.l + 5, Z.Y(3.2), { color: 'red', size: 11, weight: 600 });

      // Right: the matrix. Block k has m_k * vis_k cells' worth of side, so blocks grow out of the diagonal.
      var x0 = leftW(w) + (narrow ? 26 : 44), top = 14, availW = w - x0 - 12, availH = h - READ - top - 4;
      var dim = 0;
      for (k = 0; k < NP; k++) dim += MU[k] * vis[k].value;
      var c = Math.min(availW, availH) / Math.max(dim, 1), side = c * dim;
      c = Math.min(c, 56); side = c * dim;
      var mx = x0 + Math.max(0, (availW - side) / 2), my = top;
      var bounds = [0], o = 0;
      for (k = 0; k < NP; k++) for (i = 0; i < MU[k]; i++) { o += c * vis[k].value; bounds.push(o); }
      for (i = 1; i < bounds.length - 1; i++) {
        fig.line(mx + bounds[i], my, mx + bounds[i], my + side, { color: 'grid', width: 1 });
        fig.line(mx, my + bounds[i], mx + side, my + bounds[i], { color: 'grid', width: 1 });
      }
      fig.rect(mx, my, side, side, { color: 'muted', width: 1 });
      var off = 0, fs;
      for (k = 0; k < NP; k++) {
        var v = vis[k].value, cs = c * v, m = MU[k];
        if (v > 0.002) {
          fs = Math.min(13.5, cs * 0.36);
          for (i = 0; i < m; i++) for (j = 0; j <= i; j++) {
            var cx = mx + off + j * cs, cy = my + off + i * cs;
            fig.rect(cx + 1, cy + 1, cs - 2, cs - 2, { fill: i === j ? 'teal' : 'muted', alpha: (i === j ? 0.28 : 0.14) * v });
            if (fs >= 7) fig.text(ENTRY[i][j], cx + cs / 2, cy + cs / 2 + 0.5, { color: i === j ? 'teal' : 'fg', size: fs, align: 'center', baseline: 'middle', alpha: v, weight: i === j ? 700 : 500 });
          }
          fig.rect(mx + off, my + off, m * cs, m * cs, { color: 'teal', width: 1.6, alpha: v });
          fig.text('z' + SUB[k], mx - 6, my + off + m * cs / 2 + 0.5, { color: RE[k] !== 0 ? 'red' : 'teal', size: Math.min(12, 6 + 6 * v), align: 'right', baseline: 'middle', alpha: v, weight: 600 });
        }
        off += m * cs;
      }

      // Readout: the trace as the sum of the diagonals, and what each entry means.
      var terms = [], out = [];
      for (k = 0; k < NP; k++) {
        if (inside[k]) terms.push((MU[k] > 1 ? MU[k] + ' ' : '') + (narrow ? 'M' + SUB[k] : 'Mφ(z' + SUB[k] + ')'));
        else out.push('z' + SUB[k]);
      }
      var rx = narrow ? 12 : leftW(w) + 14, ry = h - READ + 12, fsz = narrow ? 11.5 : 12.5, n = Math.round(dim);
      var line = 'trace = ' + terms.join(' + ');
      if (fig.measure(line, fsz, 600) > w - rx - 8) line = 'trace = ' + terms.join(' + ').replace(/Mφ\(z(.)\)/g, 'M$1');
      fig.text(line, rx, ry, { color: 'teal', size: fsz, baseline: 'middle', weight: 600 });
      fig.text(n + ' × ' + n + ' matrix' + (out.length ? ';  no block for ' + out.join(', ') + (narrow ? '' : ', outside the strip') : ';  every point is inside the strip'),
        rx, ry + 18, { color: out.length ? 'red' : 'muted', size: fsz - 0.5, baseline: 'middle' });
      if (narrow) fig.mathText([{ tex: 'keyN' }, ';  M′, M″ are its derivatives'], rx, ry + 36, { size: fsz - 1, color: 'muted' });
      else fig.mathText(['in the block of ', { tex: 'zk' }, ':  ', { tex: 'key' }], rx, ry + 36, { size: fsz - 0.5, color: 'muted' });
    };
  }
});
