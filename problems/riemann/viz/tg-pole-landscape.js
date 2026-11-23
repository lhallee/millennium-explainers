/* The pole mismatch of the endgame, in the z-plane (z = s - 1/2). Left: |-zeta'/zeta(z + 1/2)|, the prime side, which
   has a pole at every zero. Right: |1/(z - 1/2) + 1/(z + 1/2) - sum over the zeros in the strip |Re z| < a|, the strip
   side. Both are drawn as brightness (poles glow) from the partial-fraction expansion over the 200 zeros of the kit,
   with the tail of the zero sum and the digamma term of -zeta'/zeta; the error against mpmath is below 1e-3 in the
   window. A hypothetical zero at z0 = 0.3 + 25i and its mirror -0.3 + 25i (with their conjugates) is a pole on the
   left always, and on the right only while 0.3 < a. */
Kit.register('tg-pole-landscape', {
  tex: { lhs: '-\\zeta\'/\\zeta\\,\\bigl(z+\\tfrac12\\bigr)', rhs: '\\text{poles at }\\pm\\tfrac12\\text{, zeros with }\\lvert\\beta-\\tfrac12\\rvert<a',
    re: '\\Re z', im: '\\Im z', a: 'a' },
  init: function (fig) {
    var Z = Kit.zeros, NZ = Z.length, G2 = new Float64Array(NZ), fmt = Kit.fmt;
    for (var k = 0; k < NZ; k++) G2[k] = Z[k] * Z[k];
    // Tail of sum over gamma > 0 of 1/gamma^2 beyond the table: sum of 1/(1/4 + gamma^2) is 1 + gamma_E/2 - log(4 pi)/2.
    var TAIL = 1 + 0.5772156649015329 / 2 - 0.5 * Math.log(4 * Math.PI);
    for (k = 0; k < NZ; k++) TAIL -= 1 / (0.25 + G2[k]);
    var HALF_LOG_PI = 0.5 * Math.log(Math.PI), X0 = 0.3, Y0 = 25;
    var HYP = [[X0, Y0], [-X0, Y0], [X0, -Y0], [-X0, -Y0]];

    var A = fig.slider({ label: 'Strip half-width', tex: 'a', min: 0.01, max: 0.6, step: 0.01, value: 0.2,
      marks: [{ at: X0, color: 'red', title: 'real part of the hypothetical zero' }] });
    var hyp = fig.toggle({ label: 'Hypothetical zero off the line', value: true });
    var gap = function (W) { return W < 560 ? 4 : 8; };
    var PL = fig.plane({ x: [-1, 1.5], y: [0, 50], pad: { t: 36, r: 10, b: 30, l: 34 },
      box: function (W, H) { return [0, 0, W / 2 - gap(W), H]; } });
    var PR = fig.plane({ x: [-1, 1.5], y: [0, 50], pad: { t: 36, r: 10, b: 30, l: 34 },
      box: function (W, H) { return [W / 2 + gap(W), 0, W, H]; } });
    var edge = fig.drag({ plane: PR, x: A.value, y: 46.5, r: 6, color: 'fg', label: 'a', labelAnchor: 'w',
      constrain: function (x) { return [Kit.clamp(Math.round(x * 100) / 100, 0.01, 0.6), 46.5]; },
      onDrag: function (x) { A.set(x); } });
    var pulse = fig.tween(1), wasContra = false;

    /* psi(w) for Re w > 0: shift up to |w| >= 10, then the asymptotic series. Writes into o[0], o[1]. */
    function digamma(re, im, o) {
      var sr = 0, si = 0, d;
      while (re * re + im * im < 100) { d = re * re + im * im; sr -= re / d; si += im / d; re += 1; }
      d = re * re + im * im;
      var ir = re / d, ii = -im / d, i2r = ir * ir - ii * ii, i2i = 2 * ir * ii;
      var i4r = i2r * i2r - i2i * i2i, i4i = 2 * i2r * i2i, i6r = i4r * i2r - i4i * i2i, i6i = i4r * i2i + i4i * i2r;
      o[0] = 0.5 * Math.log(d) - ir / 2 - i2r / 12 + i4r / 120 - i6r / 252 + sr;
      o[1] = Math.atan2(im, re) - ii / 2 - i2i / 12 + i4i / 120 - i6i / 252 + si;
    }
    var dg = [0, 0];
    /* Either side at z = x + iy into o. left: the prime side; withHyp: include the hypothetical quartet. */
    function side(x, y, left, withHyp, o) {
      var zr = x * x - y * y, zi = 2 * x * y, re = 0, im = 0, d, dr, di, j;
      for (j = 0; j < NZ; j++) {                     // the pairs rho - 1/2 = +-i gamma: 2z / (z^2 + gamma^2)
        dr = zr + G2[j]; di = zi; d = dr * dr + di * di;
        re += 2 * (x * dr + y * di) / d; im += 2 * (y * dr - x * di) / d;
      }
      re = -re - 2 * x * TAIL; im = -im - 2 * y * TAIL;
      d = (x - 0.5) * (x - 0.5) + y * y; re += (x - 0.5) / d; im -= y / d;
      if (left) { digamma(x / 2 + 1.25, y / 2, dg); re += 0.5 * dg[0] - HALF_LOG_PI; im += 0.5 * dg[1]; }
      else { d = (x + 0.5) * (x + 0.5) + y * y; re += (x + 0.5) / d; im -= y / d; }
      if (withHyp) for (j = 0; j < 4; j++) {
        dr = x - HYP[j][0]; di = y - HYP[j][1]; d = dr * dr + di * di; re -= dr / d; im += di / d;
      }
      o[0] = re; o[1] = im;
    }
    var val = [0, 0], dark = false;
    /* The kit's domain coloring with saturation 0 paints the gray level l(m) = (0.5 + 0.42 tanh(0.7 ln m)) times a
       band factor for a value of modulus m. INV[k] is a modulus whose gray level is k / 1023 of the attainable range,
       so the figure sets the brightness directly: poles glow, on a background close to the stage, with no bands. */
    var INV = new Float64Array(1024), LMAX = 0.9;
    (function () {
      var k = 0, LN2 = Math.LN2;
      for (var i = 0; i <= 6000 && k < 1024; i++) {
        var lm = -12 + 24 * i / 6000, f = lm / LN2 - Math.floor(lm / LN2), l = (0.5 + 0.42 * Math.tanh(0.7 * lm)) * (0.86 + 0.14 * f);
        while (k < 1024 && l >= k / 1023 * LMAX) INV[k++] = Math.exp(lm);
      }
      if (k < 1024) throw new Error('tg-pole-landscape: gray table incomplete at ' + k);
    })();
    var G0 = Math.log(2.5), G1 = Math.log(100);
    function shade(left, withHyp) {
      return function (x, y, o) {
        side(x, y, left, withHyp, val);
        var g = Kit.clamp((Math.log(Math.hypot(val[0], val[1])) - G0) / (G1 - G0), 0, 1);
        var L = dark ? 0.075 + 0.82 * g : 0.9 - 0.72 * g;
        o[0] = INV[Math.round(Kit.clamp(L / LMAX, 0, 1) * 1023)]; o[1] = 0;
      };
    }
    var inRight = function () { return hyp.value && A.value > X0 + 1e-9; };
    var rows = function (x, y) {
      var L = [0, 0], R = [0, 0];
      side(x, y, true, hyp.value, L); side(x, y, false, inRight(), R);
      return [['z', fmt.complex(x, y, 2)], ['prime side', fmt.complex(L[0], L[1], 2), 'fg'], ['strip side', fmt.complex(R[0], R[1], 2), 'fg']];
    };
    fig.probe({ plane: PL, crosshair: false, rows: rows });
    fig.probe({ plane: PR, crosshair: false, rows: rows });

    function dashedRing(P, x, y, r, alpha) {
      var ctx = fig.ctx;
      ctx.beginPath(); ctx.arc(P.X(x), P.Y(y), r, 0, 2 * Math.PI);
      fig.stroke({ color: 'red', width: 1.6, dash: [3, 3], alpha: alpha }); ctx.stroke(); ctx.setLineDash([]);
    }

    return function draw() {
      var a = A.value, narrow = fig.w < 560;
      dark = parseInt(fig.c.stage.slice(1, 3), 16) < 128;
      edge.x = a;
      var contra = hyp.value && !inRight();
      if (contra && !wasContra) { pulse.set(0); pulse.to(1, 1100, 'outCubic'); }
      wasContra = contra;
      var th = dark ? 'd' : 'l';

      [PL, PR].forEach(function (P, i) {
        var left = i === 0, b = P.box;
        P.domain(shade(left, left ? hyp.value : inRight()), { rev: th + (left ? hyp.value : inRight()), saturation: 0, budget: 1 });
        if (!left) {
          P.fillBetween(50, 0, -a, a, { color: 'blue', alpha: 0.16 });                      // the strip as in chapter 14
          P.vline(a, { color: 'blue', width: 1.4, dash: [5, 4] }); P.vline(-a, { color: 'blue', width: 1.4, dash: [5, 4] });
        }
        P.vline(0, { color: 'stage', width: 4, alpha: 0.5 });
        P.vline(0, { color: 'violet', width: 1.8 });
        P.zeros({ sigma: 0, r: 4, mirror: false });
        P.point(0.5, 0, { color: 'blue', r: 5, unclipped: true });
        if (!left) P.point(-0.5, 0, { color: 'blue', r: 5, unclipped: true });
        P.axes({ edge: true, xStep: 0.5, yStep: 10, size: narrow ? 10.5 : 11.5 });
        fig.label('re', b.r, b.b + 22, { anchor: 'e', color: 'muted', size: 12, id: 're' + i });
        if (i === 0) fig.label('im', b.l - 6, b.t - 6, { anchor: 'se', color: 'muted', size: 12 });
        // header: the side's name, and on a wide stage its formula
        var hy = b.t - 19;
        fig.text(left ? 'prime side' : 'strip side', b.l, hy, { color: 'fg', size: narrow ? 11.5 : 12.5, weight: 600, baseline: 'middle' });
        if (b.w > 300) fig.label(left ? 'lhs' : 'rhs', b.l + (narrow ? 70 : 80), hy, { anchor: 'w', color: 'fg', size: 12.5 });

        if (!hyp.value) return;
        var on = left || inRight();
        for (var s = -1; s <= 1; s += 2) {
          if (on) P.point(s * X0, Y0, { color: 'red', r: 5 });
          else dashedRing(P, s * X0, Y0, 7, 0.9);
          if (contra) {
            fig.circle(P.X(s * X0), P.Y(Y0), left ? 11 : 9, { fill: false, ring: fig.color('red', left ? 0.9 : 0.5), ringWidth: 1.6 });
            if (pulse.value < 1) fig.circle(P.X(s * X0), P.Y(Y0), 11 + 26 * pulse.value, { fill: false, ring: fig.color('red', 1 - pulse.value), ringWidth: 2.2 });
          }
        }
        if (narrow) {                                          // too little room above the dot: name it beside, explain below
          fig.text('z₀', P.X(X0) + 9, P.Y(Y0), { color: 'red', size: 11, weight: 600, baseline: 'middle' });
          if (left) fig.text('z₀: hypothetical zero', b.r - 4, b.b - 10, { color: 'red', size: 11, weight: 600, align: 'right' });
          return;
        }
        var tag = left ? 'hypothetical zero z₀' : on ? 'in the strip' : 'no pole here';
        fig.text(tag, P.X(X0), P.Y(Y0) - 16, { color: 'red', size: 11.5, weight: 600, align: 'center' });
      });
      if (!narrow) fig.legend([{ color: 'teal', dot: true, text: 'zeros on the line' }, { color: 'blue', dot: true, text: 'pole terms' },
        hyp.value && { color: 'red', dot: true, text: 'hypothetical zero' }], { plane: PL, at: 'ne', size: 12 });
      if (contra) fig.text(narrow ? 'a ≤ 0.3: no pole at z₀' : 'a ≤ 0.3: the pole at z₀ has nowhere to come from', PR.box.r - 6, PR.box.b - 10,
        { color: 'red', size: 11, weight: 600, align: 'right' });
    };
  }
});
