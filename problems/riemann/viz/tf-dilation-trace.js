/* The trace of the dilation U_y of the line, cut off at |x| <= R in space and |eta| <= R' in frequency. Left: the
   phase-space box with cos(2 pi c x eta), c = 1/y - 1, whose integral over the box is the trace; each cell shows its
   exact mean, a difference of Si at its corners, so dense fringes average out instead of aliasing. Right: the trace
   (2 / (pi |c|)) Si(2 pi |c| RR') against the fixed-point weight y / |1 - y|, on a log axis in y. Only RR' matters,
   so the box is drawn in the units x / R and eta / R'. */
Kit.register('tf-dilation-trace', {
  tex: {
    x: 'x', eta: '\\eta', R: 'R', mR: '-R', Rp: "R'", mRp: "-R'", RRp: "RR'", y: 'y', c: 'c', one: '1',
    tr: "\\operatorname{tr}\\,P_RU_y\\hat P_{R'}", lim: '\\dfrac{\\lvert y\\rvert}{\\lvert 1-y\\rvert}',
    trEven: "\\tfrac12\\operatorname{tr}\\,P_R(U_y+U_{-y})\\hat P_{R'}",
    limEven: '\\tfrac12\\Bigl(\\dfrac{y}{\\lvert 1-y\\rvert}+\\dfrac{y}{1+y}\\Bigr)'
  },
  init: function (fig) {
    var fmt = Kit.fmt, Y0 = 0.05, Y1 = 4, VMAX = 6;

    /* Si(v): power series below 20, asymptotic auxiliary functions f, g above; within 1e-9 of mpmath on [0, 4e4]; each costs well under a microsecond. */
    function Si(v) {
      var a = Math.abs(v), s = 0, k;
      if (a < 20) {
        for (var t = a, k2 = 0; k2 < 60; k2++) {
          var term = t / (2 * k2 + 1);
          s += k2 & 1 ? -term : term;
          if (term < 1e-14 * Math.abs(s)) break;
          t *= a * a / ((2 * k2 + 2) * (2 * k2 + 3));
        }
      } else {
        var f = 0, g = 0, inv = 1 / (a * a), tf = 1, tg = 1;
        for (k = 0; k < 40; k++) {
          var nf = k ? tf * (2 * k - 1) * (2 * k) * inv : 1, ng = k ? tg * (2 * k) * (2 * k + 1) * inv : 1;
          if (k && (nf > tf || ng > tg)) break;
          tf = nf; tg = ng; f += k & 1 ? -tf : tf; g += k & 1 ? -tg : tg;
          if (tf < 1e-14) break;
        }
        s = Math.PI / 2 - f / a * Math.cos(a) - g * inv * Math.sin(a);
      }
      return v < 0 ? -s : s;
    }
    /* The cut-off trace for the dilation with c = 1/y - 1, and its limit 1/|c|; at c = 0 the box area 4 RR'. */
    function trC(c, A) { var a = Math.abs(c); return a < 1e-12 ? 4 * A : 2 / (Math.PI * a) * Si(2 * Math.PI * a * A); }
    function trace(y, A, even) { var t = trC(1 / y - 1, A); return even ? 0.5 * (t + trC(-1 / y - 1, A)) : t; }
    function limit(y, even) { var l = y / Math.abs(1 - y); return even ? 0.5 * (l + y / (1 + y)) : l; }

    var area = fig.slider({ label: 'Cutoff area', tex: 'RRp', min: 0.3, max: 300, scale: 'log', value: 3, marks: [1, 10, 100],
      snap: [1, 3, 10, 100], format: function (v) { return fmt.sig(v); } });
    var even = fig.toggle({ label: 'Even functions', value: false });

    function side(w, h) { return Math.max(100, Math.min(h - 44, 0.36 * w - 46)); }
    var H = fig.plane({ x: [-1, 1], y: [-1, 1], equal: true, pad: { t: 14, r: 12, b: 30, l: 34 },
      box: function (w, h) { var s = side(w, h), t = Math.max(0, (h - s - 44) / 2); return [0, t, s + 46, t + s + 44]; } });
    var T = fig.plane({ x: [Y0, Y1], y: [0, VMAX], xLog: true, pad: { t: 24, r: 16, b: 30, l: 40 },
      box: function (w, h) { return [side(w, h) + 46, 0, w, h]; } });
    var dot = fig.drag({ plane: T, x: 1 / 3, y: trace(1 / 3, 3, false), r: 7, color: 'gold',
      constrain: function (x) { x = Kit.clamp(x, Y0, Y1); return [x, Math.min(trace(x, area.value, even.value), VMAX)]; } });

    // The box as an N x N image of cell means of cos(K u v) on [-1, 1]^2, K = 2 pi |c| RR'. A cell's mean is a double
    // difference of Si(K u v) at its corners; the corner values depend on |i - N/2| |j - N/2| only, so they are memoized
    // by that product. The image is drawn scaled with smoothing, translucent over the stage.
    var N = 64, H2 = N / 2, d = 2 / N, memo = new Float64Array(H2 * H2 + 1), stamp = new Float64Array(H2 * H2 + 1), gen = 0;
    var img = null, ictx = null, pix = null, imgKey = '';
    function makeImage() {
      img = typeof OffscreenCanvas === 'function' ? new OffscreenCanvas(N, N) : document.createElement('canvas');
      img.width = N; img.height = N;
      ictx = img.getContext('2d'); pix = ictx.createImageData(N, N); imgKey = '';
    }
    // Far from the window the kit releases the canvas; the image goes too and is made again on the next draw.
    fig.onRelease = function () { img = null; ictx = null; pix = null; imgKey = ''; };
    function rgb(name) {
      var m = /^#([0-9a-f]{6})$/i.exec(fig.c[name]);
      if (!m) throw new Error('tf-dilation-trace: expected a hex color for ' + name);
      var v = parseInt(m[1], 16); return [v >> 16, (v >> 8) & 255, v & 255];
    }
    function paint(K) {
      var pos = rgb('teal'), neg = rgb('red'), small = K * d * d < 1e-4, i, j, st = rgb('stage');
      var amax = st[0] + st[1] + st[2] < 384 ? 66 : 92;              // paler on the dark stage, where the hues glow
      gen++;
      var S = function (a, b) {
        var ia = a - H2, jb = b - H2, m = Math.abs(ia * jb);
        if (stamp[m] !== gen) { stamp[m] = gen; memo[m] = Si(K * m * d * d); }
        return ia * jb < 0 ? -memo[m] : memo[m];
      };
      for (i = 0; i < N; i++) for (j = 0; j < N; j++) {
        var v = small ? Math.cos(K * (-1 + (i + 0.5) * d) * (-1 + (j + 0.5) * d))
          : (S(i + 1, j + 1) - S(i + 1, j) - S(i, j + 1) + S(i, j)) / (K * d * d);
        var col = v > 0 ? pos : neg, o = 4 * ((N - 1 - j) * N + i);
        pix.data[o] = col[0]; pix.data[o + 1] = col[1]; pix.data[o + 2] = col[2]; pix.data[o + 3] = Math.round(amax * Math.min(1, Math.abs(v)));
      }
      ictx.putImageData(pix, 0, 0);
    }
    var trKey = '', lo = new Float64Array(2000), hi = new Float64Array(2000);   // per pixel column: range of the trace

    return function draw() {
      var A = area.value, ev = even.value, y = dot.x, c = 1 / y - 1, tr = trace(y, A, ev), lim = limit(y, ev);
      dot.y = Math.min(tr, VMAX);

      // left: the phase-space box
      var hb = H.box, K = 2 * Math.PI * Math.abs(c) * A, ik = K.toPrecision(7) + fig.c.teal + fig.c.red + fig.c.stage;
      if (!img) makeImage();
      if (ik !== imgKey) { imgKey = ik; paint(K); }
      fig.ctx.imageSmoothingEnabled = true;
      fig.ctx.drawImage(img, hb.l, hb.t, hb.w, hb.h);
      fig.rect(hb.l, hb.t, hb.w, hb.h, { color: 'muted', width: 1 });
      // corner ticks set inward of the corners so that the x and eta labels never meet there
      var lab = { color: 'muted', size: 12.5 }, cxm = (hb.l + hb.r) / 2, cym = (hb.t + hb.b) / 2;
      fig.line(cxm, hb.b, cxm, hb.b + 4, { color: 'muted', width: 1 }); fig.line(hb.l - 4, cym, hb.l, cym, { color: 'muted', width: 1 });
      fig.text('0', cxm, hb.b + 15, { color: 'muted', size: 11.5, align: 'center' }); fig.text('0', hb.l - 7, cym + 4, { color: 'muted', size: 11.5, align: 'right' });
      fig.label('mR', hb.l, hb.b + 3, Object.assign({ anchor: 'nw' }, lab)); fig.label('R', hb.r, hb.b + 3, Object.assign({ anchor: 'ne' }, lab));
      fig.label('mRp', hb.l - 4, hb.b, Object.assign({ anchor: 'se' }, lab)); fig.label('Rp', hb.l - 4, hb.t, Object.assign({ anchor: 'ne' }, lab));
      fig.label('x', hb.r + 3, hb.b - 1, { anchor: 'sw', color: 'muted', size: 13 });
      fig.label('eta', hb.l + 2, hb.t - 2, { anchor: 'sw', color: 'muted', size: 13 });

      // right: trace against the fixed-point weight; the trace is tabulated per pixel column (it wiggles faster
      // than the pixels near y = 1 when RR' is large) and recomputed only when RR', the mode, or the width changes
      var tb = T.box, narrow = tb.w < 300, cols = Math.min(2000, Math.floor(tb.w)), tk = A + '|' + ev + '|' + cols + '|' + tb.l;
      if (tk !== trKey) {
        trKey = tk;
        var xa = T.wx(0), prev = trace(xa, A, ev);
        for (var j = 0; j < cols; j++) {
          var xb = T.wx(j + 1), nx = trace(xb, A, ev), l = Math.min(prev, nx), u = Math.max(prev, nx);
          if (A * Math.abs(1 / xa - 1 / xb) > 0.2) for (var s = 1; s < 4; s++) { var m = trace(xa + (xb - xa) * s / 4, A, ev); l = Math.min(l, m); u = Math.max(u, m); }
          lo[j] = l; hi[j] = u; prev = nx; xa = xb;
        }
      }
      T.grid({ yStep: 1 });
      T.axes({ edge: true, yStep: tb.h < 200 ? 2 : 1, xTicks: [0.1, [1 / 3, '1/3'], 1, 2, 4], xLabel: 'y' });
      T.vline(1, { color: 'muted', width: 1.4, dash: [4, 4] });          // y = 1, every point fixed (violet is kept for the critical line)
      T.plot(function (u) { return Math.abs(u - 1) < 1e-12 ? NaN : limit(u, ev); }, { color: 'blue', width: 2.6 });
      T.columns(function (xa, xb, out, j) { if (j < cols) { out[0] = lo[j]; out[1] = hi[j]; } }, { color: 'gold', width: 2 });
      var peak = ev ? trace(1, A, true) : 4 * A, px = T.X(1);
      var ptxt = (ev ? 'peak ' : '4RR′ = ') + fmt(Math.round(peak * 100) / 100);
      if (peak > VMAX) {
        fig.arrow(px, tb.t, px, tb.t - 18, { color: 'gold', width: 1.6, head: 6 });
        var full = narrow ? ptxt : ptxt + ' at y = 1', right = px + 8 + fig.measure(full, 11.5) < fig.w - 4;
        fig.text(full, right ? px + 8 : px - 8, tb.t - 11, { color: 'gold', size: 11.5, baseline: 'middle', align: right ? 'left' : 'right' });
      } else fig.text(ptxt, px + 8, T.Y(peak) - 6, { color: 'gold', size: 11.5 });
      T.segment(y, 0, y, dot.y, { color: 'fg', width: 1, alpha: 0.4, dash: [3, 4] });

      if (!narrow) fig.legend([{ color: 'gold', tex: ev ? 'trEven' : 'tr' }, { color: 'blue', tex: ev ? 'limEven' : 'lim', width: 2.6 }], { plane: T, at: 'nw' });
      fig.panel([[{ tex: 'y' }, fmt(y, 3)], narrow ? null : [{ tex: 'c' }, fmt(c, 3)], ['trace', fmt(tr, 5), 'gold'], ['limit', fmt(lim, 5), 'blue']],
        { plane: T, at: narrow ? 'nw' : 'ne', hint: 'drag the gold dot' });
    };
  }
});
