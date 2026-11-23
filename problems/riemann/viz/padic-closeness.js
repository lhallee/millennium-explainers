/* Lemma near1 on the l-adic tree. Levels 0..D with D = floor(log_l Z) + 1; a node at depth j is a residue class mod
   l^j, placed as in padic-tree (chapter 11): the digits a_0 a_1 ... read with a_0 most significant, so a subtree is
   an interval. The teal path is the first D digits of s, and the gold leaf at its end is the ball |t - s| < l^-(D-1).
   Under the band of leaves sit the integers k in [1, Z], each in its own leaf because Z < l^D, so the gold leaf holds
   at most one of them. Digits are exact: s = n/d reduced modulo l^9 with a modular inverse of d. */
Kit.register('padic-closeness', {
  tex: { Z2: '\\ZZ_2', Z3: '\\ZZ_3', Z5: '\\ZZ_5' },
  init: function (fig) {
    var fmt = Kit.fmt, MINUS = fmt.minus, DMAX = 8;
    var PRESETS = [[1, 2], [-1, 1], [7, 1]], ALT = [1, 3];                  // 1/2 is not in Z_2, so l = 2 uses 1/3
    function mod(a, m) { return ((a % m) + m) % m; }
    function inverse(a, m) {
      var r0 = m, r1 = a, t0 = 0, t1 = 1;
      while (r1) { var q = Math.floor(r0 / r1), r = r0 - q * r1, t = t0 - q * t1; r0 = r1; r1 = r; t0 = t1; t1 = t; }
      if (r0 !== 1) throw new Error('padic-closeness: ' + a + ' is not invertible mod ' + m);
      return mod(t0, m);
    }
    /* The first DMAX + 1 digits of n/d in Z_l, lowest first. */
    function digits(n, d, l) {
      var m = Math.pow(l, DMAX + 1), r = mod(n, m) * inverse(mod(d, m), m) % m, out = [];
      for (var j = 0; j <= DMAX; j++) { out.push(r % l); r = Math.floor(r / l); }
      return out;
    }
    function depthOf(l, Z) { var n = 0; while (Math.pow(l, n + 1) <= Z) n++; return n + 1; }
    function value(a, l, D) { var r = 0; for (var j = D - 1; j >= 0; j--) r = r * l + a[j]; return r; }   // s mod l^D
    function index(a, l, k) { var i = 0; for (var j = 0; j < k; j++) i = i * l + a[j]; return i; }       // node on the path
    function leafOf(k, l, D) { var i = 0; for (var j = 0; j < D; j++) { i = i * l + k % l; k = Math.floor(k / l); } return i; }
    /* The integers k in [1, Z] with k = s mod l^D, by brute force. */
    function within(a, l, D, Z) { var m = Math.pow(l, D), r = value(a, l, D), out = []; for (var k = 1; k <= Z; k++) if (k % m === r) out.push(k); return out; }
    (function check() {                                                     // the chapter's example and its spec check
      var h = digits(1, 2, 3), w50 = within(h, 3, depthOf(3, 50), 50), w30 = within(h, 3, depthOf(3, 30), 30);
      if (h.slice(0, 4).join() !== '2,1,1,1' || depthOf(3, 50) !== 4 || depthOf(3, 30) !== 4 || w50.join() !== '41' || w30.length)
        console.error('padic-closeness: l = 3, s = 1/2 gives digits ' + h.slice(0, 4) + ', Z = 50 lights ' + w50 + ', Z = 30 lights ' + w30);
    })();

    var preset = 0, sd = digits(1, 2, 3), sdL = 3;                          // s: a preset or chosen digits, for the prime sdL
    var from = null, path = new Float64Array(DMAX + 1), shown = new Float64Array(DMAX + 1), move = fig.tween(1);
    function retarget() { from = Float64Array.from(shown); move.set(0); move.to(1, 650, 'inOutCubic'); }
    function setPreset(i) { preset = i; sdL = Number(Ls.value); var q = i === 0 && sdL === 2 ? ALT : PRESETS[i]; sd = digits(q[0], q[1], sdL); }
    var Ls = fig.select({ label: 'Prime', options: [['2', 'ℓ = 2'], ['3', 'ℓ = 3'], ['5', 'ℓ = 5']], value: '3',
      onInput: function () { from = null; } });
    var Zs = fig.slider({ label: 'Range', min: 4, max: 250, step: 1, scale: 'log', value: 50, format: function (v) { return 'Z = ' + v; } });
    var btn = [0, 1, 2].map(function (i) { return fig.button({ label: ['s = 1/2', 's = ' + MINUS + '1', 's = 7'][i], onClick: function () { setPreset(i); retarget(); } }); });
    var depth = fig.follow(4, { tau: 0.1 });
    fig.onReset = function () { from = null; move.set(1); setPreset(0); depth.set(depthOf(3, 50)); };

    var P = fig.plane({ x: [0, 1], y: [-4, 0], pad: { t: 56, r: 14, b: 46, l: 62 } });
    fig.probe({ plane: P, crosshair: false,
      snap: function (x, y) { var j = Kit.clamp(Math.round(-y), 1, depthOf(Number(Ls.value), Zs.value)), n = Math.pow(Number(Ls.value), j); return [(Kit.clamp(Math.floor(x * n), 0, n - 1) + 0.5) / n, -j]; },
      rows: function (x, y) {
        var l = Number(Ls.value), j = -y, n = Math.pow(l, j), i = Math.floor(x * n), r = 0;
        for (var t = j - 1; t >= 0; t--) { r += (i % l) * Math.pow(l, t); i = Math.floor(i / l); }
        return [['click: s ≡', r + ' mod ' + fmt(n)]];
      },
      pick: function (x, y) {
        var l = Number(Ls.value), j = Kit.clamp(Math.round(-y), 1, depthOf(l, Zs.value)), i = Kit.clamp(Math.floor(x * Math.pow(l, j)), 0, Math.pow(l, j) - 1);
        for (var t = j - 1; t >= 0; t--) { sd[t] = i % l; i = Math.floor(i / l); }
        preset = -1; retarget();
      } });

    return function draw() {
      var ctx = fig.ctx, l = Number(Ls.value), Z = Zs.value, D = depthOf(l, Z), Dsh = depth.to(D).value, b = P.box, i, j, lv;
      if (sdL !== l) setPreset(Math.max(preset, 0));                       // the prime changed: digits of the preset for the new prime
      btn[0].setLabel(l === 2 ? 's = 1/3' : 's = 1/2');
      P.view.y0 = -Dsh; P.update();
      var X = function (u) { return b.l + u * b.w; }, alphaOf = function (k) { return Kit.clamp(1 - (k - Dsh), 0, 1); };
      var Lmax = Math.max(D, Math.ceil(Dsh - 1e-3)), bandH = Kit.clamp(b.h * 0.07, 9, 15), yBand = P.Y(-D), bt = yBand - bandH / 2, bb = yBand + bandH / 2;

      // edges level by level: lines while children are at least 3 px apart, filled fans below that
      for (lv = 0; lv < Lmax; lv++) {
        var nPar = Math.pow(l, lv), gap = b.w / (nPar * l), y0 = P.Y(-lv), y1 = lv + 1 === D ? bt : P.Y(-lv - 1), al = alphaOf(lv + 1);
        if (al <= 0) continue;
        ctx.beginPath();
        for (i = 0; i < nPar; i++) {
          var px = X((i + 0.5) / nPar);
          if (gap >= 3) for (j = 0; j < l; j++) { ctx.moveTo(px, y0); ctx.lineTo(X((i * l + j + 0.5) / (nPar * l)), y1); }
          else { ctx.moveTo(px, y0); ctx.lineTo(X((i + 0.04) / nPar), y1); ctx.lineTo(X((i + 0.96) / nPar), y1); ctx.closePath(); }
        }
        if (gap >= 3) { fig.stroke({ color: 'muted', width: 1, alpha: 0.75 * al }); ctx.stroke(); }
        else { ctx.fillStyle = fig.color('muted', 0.28 * al); ctx.fill(); }
      }
      // nodes, and their residues at depths 1 to 3 where they fit
      for (lv = 0; lv < D; lv++) {
        var n = Math.pow(l, lv), sp = b.w / n;
        if (sp < 6) break;
        ctx.beginPath();
        for (i = 0; i < n; i++) { ctx.moveTo(X((i + 0.5) / n) + 3, P.Y(-lv)); ctx.arc(X((i + 0.5) / n), P.Y(-lv), 3, 0, 2 * Math.PI); }
        ctx.fillStyle = fig.color('muted', alphaOf(lv)); ctx.fill();
        if (lv >= 1 && lv <= 3 && sp >= fig.measure(String(n - 1), 10.5, 500, true) + 10) {
          for (i = 0; i < n; i++) {
            var r = 0, ii = i;
            for (j = lv - 1; j >= 0; j--) { r += (ii % l) * Math.pow(l, j); ii = Math.floor(ii / l); }
            var tw = fig.measure(String(r), 10.5, 500, true), cx = X((i + 0.5) / n) + 5, cy = P.Y(-lv) - 7;
            fig.rect(cx - 1, cy - 9, tw + 2, 11, { fill: 'stage', alpha: 0.85 });
            fig.text(String(r), cx, cy, { color: 'fg', size: 10.5, mono: true, alpha: alphaOf(lv) });
          }
        }
      }
      // row names
      fig.label('Z' + l, b.l - 10, P.Y(0), { anchor: 'e', color: 'fg', size: 14 });
      for (lv = 1; lv <= Lmax; lv++) {
        var yy = lv === D ? yBand : P.Y(-lv), lab = (b.l > 50 ? 'mod ' : '') + fmt(Math.pow(l, lv), { sep: false });
        fig.text(lab, b.l - 10, yy + 4, { color: 'muted', size: 10.5, align: 'right', alpha: alphaOf(lv) });
      }

      // the band of leaves: the l^D balls of radius l^-(D-1)
      var cells = Math.pow(l, D), cw = b.w / cells;
      fig.rect(b.l, bt, b.w, bandH, { fill: 'muted', alpha: 0.18, color: 'muted', width: 1 });
      if (cw >= 3) { ctx.beginPath(); for (i = 1; i < cells; i++) { ctx.moveTo(X(i / cells), bt); ctx.lineTo(X(i / cells), bb); } fig.stroke({ color: 'muted', width: 1, alpha: 0.6 }); ctx.stroke(); }

      // the integers 1..Z, each under its own leaf
      // (horizontal where a leaf is wide enough, else upright, else a tick)
      var lit = within(sd, l, D, Z), sLeaf = leafOf(value(sd, l, D), l, D);
      var mode = cw >= fig.measure(String(Z), 10, 500, true) + 3 ? 'wide' : cw >= 10 ? 'rot' : 'tick';
      if (lit.length > 1) console.error('padic-closeness: ' + lit.length + ' integers within the radius');
      // one font and one rotation for all of them; in the rotated frame, screen (x, y) is (-y, x)
      var rot = mode === 'rot', fs = rot ? 9.5 : 10, ux = function (kx) { return rot ? -(bb + 4) : kx; }, uy = function (kx) { return rot ? kx : bb + 13; };
      ctx.save();
      if (rot) ctx.rotate(-Math.PI / 2);
      ctx.textAlign = rot ? 'right' : 'center'; ctx.textBaseline = rot ? 'middle' : 'alphabetic';
      fig.setFont(fig.font(fs, 500, true)); ctx.fillStyle = fig.color('muted');
      ctx.beginPath();
      for (var k = 1; k <= Z; k++) {
        if (k === lit[0]) continue;
        var kx = X((leafOf(k, l, D) + 0.5) / cells);
        if (mode === 'tick') { ctx.moveTo(kx, bb + 2); ctx.lineTo(kx, bb + 8); } else ctx.fillText(String(k), ux(kx), uy(kx));
      }
      if (mode === 'tick') { fig.stroke({ color: 'muted', width: 1, alpha: 0.8 }); ctx.stroke(); }
      else if (lit.length) {
        var lx = X((leafOf(lit[0], l, D) + 0.5) / cells);
        fig.setFont(fig.font(fs, 700, true)); ctx.fillStyle = fig.color('gold'); ctx.fillText(String(lit[0]), ux(lx), uy(lx));
      }
      ctx.restore();

      // the teal path of s, sliding level by level when s changes, and the gold leaf at its end
      for (lv = 0; lv <= DMAX; lv++) {
        path[lv] = (index(sd, l, lv) + 0.5) / Math.pow(l, lv);
        shown[lv] = from ? Kit.lerp(from[lv], path[lv], Kit.clamp(move.value * 1.6 - lv * 0.12, 0, 1)) : path[lv];
      }
      ctx.beginPath();
      for (lv = 0; lv <= D; lv++) ctx[lv ? 'lineTo' : 'moveTo'](X(shown[lv]), lv === D ? bt : P.Y(-lv));
      fig.stroke({ color: 'teal', width: 3 }); ctx.stroke();
      for (lv = 0; lv < D; lv++) fig.circle(X(shown[lv]), P.Y(-lv), 4.5, { fill: 'teal', ring: 'stage', ringWidth: 1.5 });
      var gx = X((sLeaf + 0.5) / cells);
      fig.rect(gx - Math.max(cw, 4) / 2, bt - 1, Math.max(cw, 4), bandH + 2, { fill: 'gold' });
      if (lit.length && mode === 'tick') {
        fig.line(gx, bb + 1, gx, bb + 9, { color: 'gold', width: 2 });
        fig.text(String(lit[0]), gx, bb + 22, { color: 'gold', size: 12, weight: 700, mono: true, align: 'center' });
      }

      // readout
      var name = preset < 0 ? 'chosen s' : 's = ' + (preset === 0 ? (l === 2 ? '1/3' : '1/2') : preset === 1 ? MINUS + '1' : '7');
      var w1 = fig.mathText([name + ' in ', { tex: 'Z' + l }, ':  ' + sd.slice(0, D).join(' ') + ' …'], 8, 16, { size: 13, mono: true });
      fig.text('digits lowest first', 8 + w1 + 12, 20, { color: 'muted', size: 11.5, alpha: fig.w > 520 ? 1 : 0 });
      var line = 'Z = ' + Z + '  D = ' + D + '  radius ' + l + fmt.sup(-(D - 1)), ans = lit.length ? '1 integer: ' + lit[0] : '0 integers';
      fig.text(line, 8, 42, { color: 'fg', size: 12.5, mono: true });
      fig.text(ans, Math.max(8 + fig.measure(line, 12.5, 500, true) + 16, fig.w - 8 - fig.measure(ans, 12.5, 700, true)), 42,
        { color: lit.length ? 'gold' : 'muted', size: 12.5, weight: 700, mono: true });
    };
  }
});
