/* The zeros 1/2 + i gamma of zeta, L(s, chi_4), and L(s, chi_{5,2}) as ticks on three copies of the critical line,
   and on a fourth line the zeros of the Dedekind zeta function of the chosen field, which are the union of its
   factors' zeros: zeta_Q = zeta, zeta_Q(i) = zeta L(s, chi_4), zeta_Q(sqrt 5) = zeta L(s, chi_{5,2}). Changing the
   field slides copies of the factors' ticks down onto the fourth line. "Show spacing" draws each gap between
   neighboring zeros as a step at height proportional to the gap, against the mean gap 2 pi / log(q gamma / 2 pi)
   (for a product, the densities add). The L-function ordinates were found as sign changes of the real function
   xi(1/2 + it, chi) with mpmath and agree with the chapter to six decimals. */
Kit.register('zero-ladder', {
  tex: { z: '\\zeta(s)', L4: 'L(s,\\chi_4)', L5: 'L(s,\\chi_{5,2})', gamma: '\\gamma',
    K0: '\\zeta_{\\mathbb{Q}}(s)=\\zeta(s)', K1: '\\zeta_{\\mathbb{Q}(i)}(s)=\\zeta(s)\\,L(s,\\chi_4)', K2: '\\zeta_{\\mathbb{Q}(\\sqrt5)}(s)=\\zeta(s)\\,L(s,\\chi_{5,2})' },
  init: function (fig) {
    var G1 = 40;
    var CHI4 = [6.020949, 10.243770, 12.988098, 16.342607, 18.291993, 21.450611, 23.278377, 25.728756, 28.359634, 29.656384,
      32.592187, 34.199958, 36.142880, 38.511923];
    var CHI5 = [6.648453, 9.831444, 11.958846, 16.033821, 17.566994, 19.540733, 22.227405, 24.588466, 26.776096, 28.461035,
      29.707909, 33.000456, 34.728813, 35.868638, 38.129185, 39.560573];
    var ZETA = Kit.zeros.slice(0, Kit.upperBound(Kit.zeros, G1));
    var ROWS = [{ z: ZETA, q: 1, color: 'teal', tex: 'z' }, { z: CHI4, q: 4, color: 'blue', tex: 'L4' }, { z: CHI5, q: 5, color: 'gold', tex: 'L5' }];   // not red: red means error or hypothetical on this page
    var FIELDS = { Q: { rows: [0], tex: 'K0' }, Qi: { rows: [0, 1], tex: 'K1' }, Q5: { rows: [0, 2], tex: 'K2' } };
    var RY = [3.55, 2.55, 1.55, 0.35], GSCALE = 0.06;         // row baselines; world height per unit of gap

    var field = fig.select({ label: 'Field', options: [['Q', 'ℚ'], ['Qi', 'ℚ(i)'], ['Q5', 'ℚ(√5)']], value: 'Qi',
      onInput: function (v) { prev = shown; shown = v; slide.set(0); slide.to(1, 900, 'inOutCubic'); } });
    var gmax = fig.slider({ label: 'Height up to', tex: 'gamma', min: 10, max: G1, step: 0.5, value: G1 });
    var spacing = fig.toggle({ label: 'Show spacing', value: false });
    var shown = 'Qi', prev = 'Qi', slide = fig.tween(1), cam = fig.follow(G1);
    fig.onReset = function () { shown = prev = 'Qi'; slide.set(1); };

    var P = fig.plane({ x: [0, G1], y: [0, 4.35], pad: { t: 6, r: 14, b: 26, l: 14 } });

    function ticks(list, y, color, alpha, h) {               // h: half-height in pixels
      fig.stroke({ color: color, width: 2, alpha: alpha });
      fig.ctx.beginPath();
      for (var i = 0; i < list.length && list[i] <= P.v.x1; i++) {
        var px = Math.round(P.X(list[i])) + 0.5;
        fig.ctx.moveTo(px, P.Y(y) + h); fig.ctx.lineTo(px, P.Y(y) - h);
      }
      fig.ctx.lineCap = 'butt';
      P.clip(function () { fig.ctx.stroke(); });
      fig.ctx.lineCap = 'round';
    }
    function gaps(list, y, color, alpha) {                   // each gap as a step of height gap * GSCALE above the line
      var xs = [], ys = [];
      for (var i = 0; i + 1 < list.length && list[i] <= P.v.x1; i++) {
        var g = list[i + 1] - list[i];
        xs.push(list[i], list[i + 1]); ys.push(y + GSCALE * g, y + GSCALE * g);
        if (i + 2 < list.length && list[i + 1] <= P.v.x1) { xs.push(list[i + 1]); ys.push(y + GSCALE * (list[i + 2] - list[i + 1])); }
      }
      if (xs.length) P.path(xs, ys, { color: color, width: 1.4, alpha: alpha });
    }
    function mean(qs, y, from) {                             // 2 pi / (sum of log(q gamma / 2 pi)), from the first zero on
      P.plot(function (g) {
        var d = 0;
        for (var i = 0; i < qs.length; i++) d += Math.log(qs[i] * g / (2 * Math.PI));
        var m = 2 * Math.PI / d;
        return d > 0 && m < 8 ? y + GSCALE * m : NaN;
      }, { color: 'fg', width: 1.2, dash: [5, 4], alpha: 0.7, from: from });
    }
    function merged(key) {                                   // the zeros of zeta_K with the row each came from
      var out = [];
      FIELDS[key].rows.forEach(function (r) { ROWS[r].z.forEach(function (g) { out.push([g, r]); }); });
      return out.sort(function (a, b) { return a[0] - b[0]; });
    }

    return function draw() {
      P.view.x1 = cam.to(gmax.value).value; P.update();
      var b = P.box, narrow = fig.w < 520, F = FIELDS[shown], m = slide.value, unit = P.Y(0) - P.Y(1);
      var h = Kit.clamp((spacing.value ? 0.12 : 0.2) * unit, 5, 16), ly = Kit.clamp((spacing.value ? 0.7 : 0.42) * unit, 18, 34);   // tick half-height, label rise
      var count = function (n, tex, y, alpha, out) {          // "n zeros" just after a row's label; out: not a factor of zeta_K
        var size = narrow ? 12 : 13.5;
        fig.text(n + ' zeros' + (out ? (narrow ? ', not a factor' : ', not a factor for this field') : ''), b.l + 14 + fig.labelSize(tex, size).w, y, { color: 'muted', size: size - 2, baseline: 'middle', alpha: alpha });
      };
      P.grid({ yStep: 100 });
      P.axes({ edge: true, y: false, xLabel: 'gamma' });

      for (var r = 0; r < 4; r++) P.segment(0, RY[r], P.v.x1, RY[r], { color: 'violet', width: 1.6, alpha: 0.85 });
      ROWS.forEach(function (row, r) {
        var on = F.rows.indexOf(r) >= 0 ? 1 : 0.4;
        ticks(row.z, RY[r], row.color, on, h);
        if (spacing.value) { gaps(row.z, RY[r], row.color, 0.8 * on); mean([row.q], RY[r], row.z[0]); }
        fig.label(row.tex, b.l + 4, P.Y(RY[r]) - ly, { anchor: 'w', color: on === 1 ? row.color : 'muted', size: narrow ? 12 : 13.5 });
        count(Kit.upperBound(row.z, P.v.x1), row.tex, P.Y(RY[r]) - ly, Math.max(on, 0.7), on < 1);
      });

      // The fourth line: the old union fades while copies of the new factors' ticks slide down onto it.
      var y4 = RY[3], all = merged(shown);
      if (m < 1 && prev !== shown) merged(prev).forEach(function (z) { ticks([z[0]], y4, ROWS[z[1]].color, 1 - m, h); });
      var e = Kit.ease.inOutCubic(m);
      F.rows.forEach(function (r) { ticks(ROWS[r].z, Kit.lerp(RY[r], y4, e), ROWS[r].color, m < 1 ? 0.9 : 1, h); });
      if (spacing.value && m >= 1) { gaps(all.map(function (z) { return z[0]; }), y4, 'fg', 0.75); mean(F.rows.map(function (r) { return ROWS[r].q; }), y4, all[0][0]); }
      fig.label(F.tex, b.l + 4, P.Y(y4) - ly, { anchor: 'w', color: 'fg', size: narrow ? 12 : 13.5 });
      count(Kit.upperBound(all.map(function (z) { return z[0]; }), P.v.x1), F.tex, P.Y(y4) - ly, 1);
    };
  }
});
