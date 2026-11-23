/* An idele x, drawn as its components: x_inf on a real line and x_p for p = 2, 3, 5, 7 in a "shells" diagram of
   Q_p^x (ring m is p^m Z_p^x; larger rings are larger |x_p|_p; the unit ring m = 0 is blue). The unit part of x_p
   is fixed to that of the chapter's example (x_2 = 2^v * 3, x_3 = 3^v * 5, x_5 = 5^v, x_7 = 7^v) and its angle
   shows its residue mod p (mod 4 at p = 2). "Divide by xi" multiplies by 1/xi, xi = sgn(x_inf) prod p^v_p, with
   exact fractions: every x_p lands on its unit ring and x_inf on t = |x| > 0. On the right, C_Q = R_>0 x Zhat^x
   as a log t axis with schematic fibers of units, cut by residues mod 4, 3, 5; the class is a gold point. */
Kit.register('idele-class', {
  tex: { xinf: 'x_\\infty', x2: 'x_2', x3: 'x_3', x5: 'x_5', x7: 'x_7', xp: 'x_p', xi: '\\xi', t: 't', norm: '\\abs{x}', logt: '\\log t',
    fiber: '\\hat\\ZZ^\\times', CQ: 'C_\\QQ' },
  init: function (fig) {
    var fmt = Kit.fmt, MINUS = fmt.minus, PR = [2, 3, 5, 7], U0 = [3, 5, 1, 1], V0 = [2, -2, -1, 0], X0 = -3.5;
    var val = V0.slice(), xinf = X0, reduced = false;
    function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var r = a % b; a = b; b = r; } return a; }
    function frac(n, d) { var g = gcd(n, d); n /= g; d /= g; return fmt(n, { sep: false }) + (d === 1 ? '' : '/' + fmt(d, { sep: false })); }
    function dec(v) {
      if (Math.abs(v) < 1e-3 || Math.abs(v) >= 1e7) return fmt.sci(v, 3);
      var s = fmt(v, Kit.clamp(4 - Math.floor(Math.log10(Math.abs(v))), 0, 5));
      return s.indexOf('.') < 0 ? s : s.replace(/0+$/, '').replace(/\.$/, '');
    }
    function mod(a, m) { return ((a % m) + m) % m; }
    function inverse(a, m) { for (var y = 1; y < m; y++) if (a * y % m === 1) return y; throw new Error('idele-class: no inverse of ' + a + ' mod ' + m); }
    /* xi = sgn(x_inf) * prod p^v_p as [sign, numerator, denominator]. */
    function xi() {
      var n = 1, d = 1;
      PR.forEach(function (p, k) { if (val[k] > 0) n *= Math.pow(p, val[k]); else d *= Math.pow(p, -val[k]); });
      return [xinf < 0 ? -1 : 1, n, d];
    }
    /* The component at PR[k] as [numerator, denominator], before (s = 0) or after (s = 1) dividing by xi. */
    function comp(k, after) {
      var v = val[k], p = PR[k], n = U0[k] * (v > 0 ? Math.pow(p, v) : 1), d = v < 0 ? Math.pow(p, -v) : 1;
      if (!after) return [n, d];
      var z = xi(); n *= z[0] * z[2]; d *= z[1];
      var g = gcd(n, d); return [n / g, d / g];
    }
    /* Which residue class mod p (mod 4 at p = 2) the unit part of a component lies in, and how many classes there are. */
    function unitClass(k, after) {
      var c = comp(k, after), p = PR[k], m = p === 2 ? 4 : p;
      while (c[0] % p === 0) c[0] /= p;
      while (c[1] % p === 0) c[1] /= p;
      var r = mod(c[0], m) * inverse(mod(c[1], m), m) % m;
      return p === 2 ? [(r - 1) / 2, 2] : [r - 1, p - 1];
    }
    function angle(k, after) { var u = unitClass(k, after); return -Math.PI / 2 + 2 * Math.PI * (u[0] + 0.5) / u[1]; }
    function ring(m) { return (4 - m) / 7; }                    // radius of the shell p^m Z_p^x

    var s = fig.tween(0);
    function hold(q) { return q < 0.4 ? 0 : Kit.ease.inOutCubic((q - 0.4) / 0.6); }
    /* The default plays the division once, after a pause in which the idele is shown as given. */
    function intro() { val = V0.slice(); xinf = X0; reduced = true; s.set(0); s.to(1, 2400, hold); }
    function unreduce() { if (reduced) { reduced = false; s.to(0, 250, 'outCubic'); } }
    var btn = fig.button({ label: 'Divide by ξ', onClick: function () { reduced = true; s.to(1, 1200, 'inOutCubic'); } });
    var undo = fig.button({ label: 'Undo', onClick: unreduce });
    fig.onReset = intro;
    intro();

    // the fiber Zhat^x, cut into 2 x 2 x 4 pieces by the unit residues mod 4, mod 3, and mod 5
    var pieces = [[0, 1]];
    [2, 2, 4].forEach(function (n) {
      var out = [];
      pieces.forEach(function (iv) { var L = iv[1] - iv[0], gap = 0.3 * L / n, pl = (L - (n - 1) * gap) / n; for (var j = 0; j < n; j++) out.push([iv[0] + j * (pl + gap), iv[0] + j * (pl + gap) + pl]); });
      pieces = out;
    });

    function wide() { return fig.w >= 640; }
    function leftW() { return Math.min(0.46 * fig.w, 440); }
    var R = fig.plane({ x: [-50, 50], y: [-1, 1], pad: { t: 26, r: 18, b: 22, l: 44 },
      box: function (w, h) { return wide() ? [0, 0, leftW(), 70] : [0, 0, w, 54]; } });
    var shells = PR.map(function (p, k) {
      return fig.plane({ x: [-1.06, 1.06], y: [-1.06, 1.06], equal: true, pad: { t: 22, r: 4, b: 4, l: 4 },
        box: function (w, h) {
          if (!wide()) { var cw = w / 4; return [k * cw, 54, (k + 1) * cw, 54 + Math.min(cw + 10, 0.36 * h)]; }
          var lw = leftW(), ch = (h - 96) / 2; return [(k % 2) * lw / 2, 70 + Math.floor(k / 2) * ch, (k % 2 + 1) * lw / 2, 70 + (Math.floor(k / 2) + 1) * ch];
        } });
    });
    var C = fig.plane({ x: [-5, 5], y: [0, 1], pad: { t: 14, r: 18, b: 26, l: 18 },
      box: function (w, h) { if (wide()) return [leftW() + 16, 0, w, h]; return [0, 54 + Math.min(w / 4 + 10, 0.36 * h), w, h]; } });
    var probes = shells.map(function (S, k) {
      return fig.probe({ plane: S, crosshair: false, marker: false,
        pick: function (x, y) { val[k] = Kit.clamp(Math.round(4 - 7 * Math.hypot(x, y)), -3, 3); unreduce(); } });
    });
    var hand = fig.drag({ plane: R, x: X0, y: 0, r: 7, color: 'fg',
      constrain: function (x) { x = Math.round(Kit.clamp(x, -50, 50) * 10) / 10; return [x === 0 ? (xinf > 0 ? -0.1 : 0.1) : x, 0]; },
      onDrag: function (x) { xinf = x; unreduce(); } });
    var W = fig.follow(50), lo = fig.follow(-5), hi = fig.follow(5);

    return function draw() {
      var z = xi(), t = Math.abs(xinf) * z[2] / z[1], u = s.value, ctx = fig.ctx, k, m;
      var norm = Math.abs(xinf), parts = [dec(Math.abs(xinf))];
      PR.forEach(function (p, k) { var v = val[k]; norm *= Math.pow(p, -v); parts.push(v > 0 ? '1/' + Math.pow(p, v) : String(Math.pow(p, -v))); });
      btn.enable(!reduced); undo.enable(reduced);

      // the real component
      var xr = Kit.lerp(xinf, t, u);
      R.view.x1 = W.to(Math.max(50, 1.1 * Math.abs(reduced ? t : xinf))).value; R.view.x0 = -R.view.x1; R.update();
      R.axes({ y: false, xAt: 'bottom' });
      R.segment(R.v.x0, 0, R.v.x1, 0, { color: 'muted', width: 1.5 });
      R.segment(0, 0, R.v.x1, 0, { color: 'blue', width: 4, alpha: 0.35 });
      hand.x = xr;
      R.text(dec(xr), xr, 0, { dy: -13, color: 'fg', size: 12, align: 'center', mono: true });
      fig.label('xinf', R.box.l - 8, R.Y(0), { anchor: 'e', color: 'fg', size: 14 });

      // the p-adic components on their shells
      shells.forEach(function (S, k) {
        var b = S.box, cx = S.X(0), cy = S.Y(0), sc = S.X(1) - cx, pr = probes[k];
        var hov = pr.active ? Kit.clamp(Math.round(4 - 7 * Math.hypot(pr.x, pr.y)), -3, 3) : null;
        for (m = -3; m <= 3; m++) {
          if (m === 0) { fig.circle(cx, cy, ring(0) * sc, { fill: false, ring: fig.color('blue', 0.3), ringWidth: 6 }); fig.circle(cx, cy, ring(0) * sc, { fill: false, ring: 'blue', ringWidth: 1.5 }); }
          else fig.circle(cx, cy, ring(m) * sc, { fill: false, ring: fig.color('muted', m === hov ? 0.95 : 0.5), ringWidth: m === hov ? 2 : 1 });
        }
        var sp = sc / 7, lab = sp >= 11 ? [-3, -2, -1, 0, 1, 2, 3] : sp >= 8 ? [-3, 0, 3] : [];   // no ring numbers too small to read
        lab.forEach(function (m) { fig.text(fmt(m), cx, cy + ring(m) * sc + 3.5, { color: m === 0 ? 'blue' : 'muted', size: Math.min(10, sp), align: 'center', baseline: 'middle', weight: 600 }); });
        var a0 = angle(k, false), a1 = angle(k, true), da = a1 - a0;
        da = da > Math.PI ? da - 2 * Math.PI : da < -Math.PI ? da + 2 * Math.PI : da;
        var rr = Kit.lerp(ring(val[k]), ring(0), u), aa = a0 + da * u;
        fig.circle(cx + rr * sc * Math.cos(aa), cy - rr * sc * Math.sin(aa), 5.5, { fill: 'fg', ring: 'stage', ringWidth: 2 });
        var c = comp(k, u > 0.5);
        fig.mathText([{ tex: 'x' + PR[k] }, ' = ' + frac(c[0], c[1])], b.l + 2, S.outer.t + 11, { size: wide() ? 12.5 : 11, mono: true });
      });
      if (wide()) {
        var c7 = z[0] * z[2], ly = fig.h - 12;
        fig.mathText(['p ≥ 11:  ', { tex: 'xp' }, ' = 1' + (u > 0.5 ? '  →  1/ξ = ' + frac(c7, z[1]) : '')], 6, ly, { size: 11.5, mono: true, color: 'muted' });
      }

      // C_Q: a log t axis with a fiber of units over each point
      var Lt = Math.log(t);
      C.view.x0 = lo.to(Math.min(-5, Lt - 1.5)).value; C.view.x1 = hi.to(Math.max(5, Lt + 1.5)).value; C.update();
      // on a phone the fibers take the lower half of the plane, so the readout above them covers nothing
      var cb = C.box, nar = !wide(), f0 = nar ? 0.06 : 0.16, f1 = nar ? 0.5 : 0.84, stp = Kit.math.niceStep(C.v.x1 - C.v.x0, cb.w, 46);
      var pAt = Lt > (C.v.x0 + C.v.x1) / 2 ? 'nw' : 'ne';
      C.axes({ y: false, xAt: 'bottom', xLabel: 'logt' });
      ctx.beginPath();
      for (var x = Math.ceil(C.v.x0 / stp) * stp; x <= C.v.x1; x += stp) {
        var px = C.X(x);
        for (var j = 0; j < pieces.length; j++) { ctx.moveTo(px, C.Y(f0 + (f1 - f0) * pieces[j][0])); ctx.lineTo(px, C.Y(f0 + (f1 - f0) * pieces[j][1])); }
      }
      fig.stroke({ color: 'muted', width: 2, alpha: 0.45 }); ctx.stroke();
      if (nar) C.label('fiber', pAt === 'nw' ? C.v.x1 : C.v.x0, f1, { anchor: pAt === 'nw' ? 'se' : 'sw', color: 'muted', dy: -3, size: 12 });
      else C.label('fiber', Math.round((C.v.x0 + C.v.x1) / 2 / stp) * stp, f1, { anchor: 's', color: 'muted', dy: -3, size: 12.5 });
      if (wide()) C.label('CQ', C.v.x1, 0.06, { anchor: 'se', color: 'muted', dy: -4, size: 13 });
      var show = Kit.clamp((u - 0.75) / 0.25, 0, 1);
      if (show > 0) {
        var u2 = unitClass(0, true)[0], u3 = unitClass(1, true)[0], u5 = unitClass(2, true)[0], pc = pieces[(u2 * 2 + u3) * 4 + u5], gx = C.X(Lt);
        C.segment(Lt, f0, Lt, f1, { color: 'gold', width: 1, alpha: 0.5 * show });
        fig.line(gx, C.Y(f0 + (f1 - f0) * pc[0]), gx, C.Y(f0 + (f1 - f0) * pc[1]), { color: 'gold', width: 6, alpha: show });
        fig.circle(gx, C.Y(0), 6.5, { fill: 'gold', ring: 'stage', ringWidth: 2, alpha: show });
      }

      fig.panel([
        u > 0.5 && !nar ? [{ tex: 'xi' }, (z[0] < 0 ? MINUS : '') + frac(z[1], z[2])] : null,
        u > 0.5 ? [{ tex: 't' }, dec(t), 'gold'] : null,
        [{ tex: 'norm' }, parts.join(wide() ? ' · ' : '·') + ' = ' + dec(norm)]
      ], { plane: C, at: pAt, id: 'readout', hint: reduced ? null : 'press Divide by ξ' });
    };
  }
});
