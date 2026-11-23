/* The eigenspaces A(omega^i), i = 0..p-2, of the p-part of the class group of Q(zeta_p): odd i on an outer ring
   (the minus part), even i on an inner ring (the plus part), and under them one chip per Bernoulli number B_k,
   k = 2, 4, ..., p-3. A chip is gold when p divides the numerator of B_k, and it lights the odd eigenspace
   i = 1 - k mod p-1 (Herbrand and Ribet). At phone width the rings become two strips.
   Everything shown is computed here and compared with the chapter at startup: B_k mod p for every prime below 200
   (recurrence sum_{j<=n} C(n+1, j) B_j = 0, exact in Z/p since no denominator of B_j, j <= p-3, is divisible by p),
   B_32 as a BigInt fraction, and h^- = 2p prod over odd characters of (-B_{1,xi}/2) for p <= 67, in floating point
   (at most about 10^14 before the factor 2p, so double precision rounds it exactly). */
Kit.register('cyclotomic-eigenspaces', {
  tex: {
    Am: '\\mathcal A^- = \\textstyle\\bigoplus_{i\\ \\mathrm{odd}}\\mathcal A(\\omega^i)',
    Ap: '\\mathcal A^+ = \\textstyle\\bigoplus_{i\\ \\mathrm{even}}\\mathcal A(\\omega^i)',
    AmS: '\\mathcal A^-', ApS: '\\mathcal A^+', Bk: 'B_k,\\ k = 2, 4, \\dots, p-3', hm: 'h^-', pdiv: 'p \\mid h^-',
    lgB: 'p \\mid B_k', lgA: '\\mathcal A(\\omega^{1-k}) \\ne 0',
    w5: '\\mathcal A(\\omega^{5})', w15: '\\mathcal A(\\omega^{15})', w9: '\\mathcal A(\\omega^{9})', w33: '\\mathcal A(\\omega^{33})',
    w79: '\\mathcal A(\\omega^{79})', w109: '\\mathcal A(\\omega^{109})', w19: '\\mathcal A(\\omega^{19})', w95: '\\mathcal A(\\omega^{95})',
    w47: '\\mathcal A(\\omega^{47})',
    B32: 'B_{32}', B44: 'B_{44}', B58: 'B_{58}', B68: 'B_{68}', B24: 'B_{24}', B22: 'B_{22}', B130: 'B_{130}', B62: 'B_{62}', B110: 'B_{110}'
  },
  init: function (fig) {
    var fmt = Kit.fmt;
    var PS = [23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 101, 103, 131, 149, 157];
    // The chapter's data, compared at startup with what is computed below.
    var PAIRS = { 37: [32], 59: [44], 67: [58], 101: [68], 103: [24], 131: [22], 149: [130], 157: [62, 110] };
    var LIT = { 37: [5], 59: [15], 67: [9], 101: [33], 103: [79], 131: [109], 149: [19], 157: [95, 47] };
    var HM = { 23: 3, 29: 8, 31: 9, 37: 37, 41: 121, 43: 211, 47: 695, 53: 4889, 59: 41241, 61: 76301, 67: 853513 };
    var IRREGULAR = [37, 59, 67, 101, 103, 131, 149, 157];

    function mod(a, m) { return ((a % m) + m) % m; }
    function powmod(a, e, m) { var r = 1; a %= m; while (e) { if (e & 1) r = r * a % m; a = a * a % m; e >>= 1; } return r; }
    function isPrime(n) { for (var d = 2; d * d <= n; d++) if (n % d === 0) return false; return n > 1; }
    function factor(n) { var out = []; for (var d = 2; d * d <= n; d++) { var e = 0; while (n % d === 0) { n /= d; e++; } if (e) out.push([d, e]); } if (n > 1) out.push([n, 1]); return out; }
    /* Even k in [2, p-3] with B_k = 0 mod p. */
    function bernoulliZeros(p) {
      var B = new Int32Array(p), C = new Int32Array(p), ks = [], n, j;
      B[0] = 1; C[0] = 1; C[1] = 1;                                            // C holds the row C(n+1, .) mod p
      for (n = 1; n <= p - 3; n++) {
        for (j = n + 1; j >= 1; j--) C[j] = (C[j] + C[j - 1]) % p;
        var s = 0;
        for (j = 0; j < n; j++) s = (s + C[j] * B[j]) % p;
        B[n] = (p - s) % p * powmod(n + 1, p - 2, p) % p;
        if (n % 2 === 0 && B[n] === 0) ks.push(n);
      }
      return ks;
    }
    /* h^- of Q(zeta_p) from the analytic class number formula; returns [rounded, distance to that integer]. */
    function hMinus(p) {
      var g = 2, n = p - 1, i, j;
      while (powmod(g, n / 2, p) === 1 || factor(n).some(function (f) { return powmod(g, n / f[0], p) === 1; })) g++;
      var pw = new Float64Array(n), re = 1, im = 0;
      for (i = 0; i < n; i++) pw[i] = powmod(g, i, p);
      for (j = 1; j < n; j += 2) {                                            // xi(g) = exp(2 pi i j / (p-1)), j odd
        var sr = 0, si = 0;
        for (i = 0; i < n; i++) { var t = 2 * Math.PI * ((i * j) % n) / n; sr += pw[i] * Math.cos(t); si += pw[i] * Math.sin(t); }
        sr *= -0.5 / p; si *= -0.5 / p;                                       // -B_{1,xi} / 2
        var r2 = re * sr - im * si; im = re * si + im * sr; re = r2;
      }
      re *= 2 * p; im *= 2 * p;
      return [Math.round(re), Math.max(Math.abs(re - Math.round(re)), Math.abs(im))];
    }
    /* B_32 exactly, as a reduced BigInt fraction. */
    function bernoulliExact(N) {
      var num = [1n], den = [1n], C = [1n, 1n];
      function gcd(a, b) { a = a < 0n ? -a : a; while (b) { var t = a % b; a = b; b = t; } return a; }
      for (var n = 1; n <= N; n++) {
        for (var j = n + 1; j >= 1; j--) C[j] = (C[j] || 0n) + C[j - 1];
        var sn = 0n, sd = 1n;
        for (j = 0; j < n; j++) { sn = sn * den[j] + C[j] * num[j] * sd; sd *= den[j]; var g = gcd(sn, sd); sn /= g; sd /= g; }
        sd *= BigInt(n + 1);
        var g2 = gcd(sn, sd); num[n] = -sn / g2; den[n] = sd / g2;
      }
      return [num[N], den[N]];
    }
    var fail = function (msg) { console.error('cyclotomic-eigenspaces: ' + msg); };

    var job = fig.job(function* () {
      var ks = {}, irr = [], hm = {}, p;
      for (p = 5; p < 200; p++) {
        if (!isPrime(p)) continue;
        ks[p] = bernoulliZeros(p);
        if (ks[p].length) irr.push(p);
        if (p <= 67) hm[p] = hMinus(p);
        yield p / 200;
      }
      if (irr.join() !== IRREGULAR.join()) fail('irregular primes below 200 are ' + irr.join(', '));
      PS.forEach(function (q) {
        if (ks[q].join() !== (PAIRS[q] || []).join()) fail('p = ' + q + ': p | B_k for k = ' + ks[q].join(', '));
        if (ks[q].map(function (k) { return mod(1 - k, q - 1); }).join() !== (LIT[q] || []).join()) fail('p = ' + q + ': lit eigenspaces differ');
        if (HM[q]) {
          if (hm[q][0] !== HM[q] || hm[q][1] > 1e-3) fail('h^- of p = ' + q + ' computed as ' + hm[q][0]);
          if ((HM[q] % q === 0) !== (ks[q].length > 0)) fail('p = ' + q + ': p | h^- disagrees with Kummer');
        }
      });
      for (p = 3; p <= 19; p += 2) if (isPrime(p) && hMinus(p)[0] !== 1) fail('h^- of p = ' + p + ' is not 1');
      var b32 = bernoulliExact(32);
      if (b32[0] !== -7709321041217n || b32[1] !== 510n || 37n * 683n * 305065927n !== 7709321041217n) fail('B_32 = ' + b32[0] + '/' + b32[1]);
      return { ks: ks, hm: hm };
    });

    var fade = fig.tween(1);
    var sel = fig.select({ label: 'Prime', options: PS.map(function (q) { return [String(q), 'p = ' + q]; }), value: '37',
      onInput: function () { fade.set(0); fade.to(1, 200, 'outQuad'); } });
    var S = fig.plane({ x: [0, 1], y: [0, 1], pad: 0 });                     // only for placing the panel and legend

    /* An annular sector at angle th, half-width dh, radii r0 < r1, added to the current path. */
    function sector(ctx, cx, cy, r0, r1, th, dh) { ctx.moveTo(cx + r1 * Math.cos(th - dh), cy + r1 * Math.sin(th - dh)); ctx.arc(cx, cy, r1, th - dh, th + dh); ctx.arc(cx, cy, r0, th + dh, th - dh, true); ctx.closePath(); }
    /* Label every sixth index, or every twelfth, ..., so that labels of width up to that of p - 2 do not touch. */
    function labelStep(gap, p) { var need = fig.measure(String(p - 2), 10.5, 500, true) + 6, k = 6; while (k * gap < need) k += 6; return k; }
    /* Whether index i is within r indices of a lit eigenspace, whose label would cover its index label. */
    function near(i, lit, n, r) { for (var t = 0; t < lit.length; t++) { var d = mod(i - lit[t], n); if (d <= r || d >= n - r) return true; } return false; }

    return function draw() {
      var ctx = fig.ctx, p = Number(sel.value), n = p - 1, a = fade.value, W = fig.w, H = fig.h, strip = W < 640 || H < 300, i, t;
      var res = job.done ? job.result : null, ks = res ? res.ks[p] : [], lit = ks.map(function (k) { return mod(1 - k, n); });
      var cellPos = new Array(n);                                            // where an arc ends for each cell: [x, y]

      // the chips B_2, B_4, ..., B_(p-3)
      var nc = (p - 3) / 2, yChip = strip ? Math.max(150, H - 62) : H - 46, cx = 0, cy = 0, Ro = 0;
      if (!strip) { Ro = Math.min(150, (yChip - 30) / 2 - 26); cy = 38 + Ro; cx = Math.max(Ro + 54, Math.min(0.42 * W, W - 260 - Ro)); }
      var avail = W - 72, cw = Math.min(16, avail / nc), rowW = cw * nc, x0 = Kit.clamp((strip ? W / 2 : cx) - rowW / 2, 36, W - 36 - rowW);
      var gap = cw > 6 ? 2 : cw > 3 ? 1 : 0;

      if (!strip) {
        // two rings: odd i outside (minus part), even i inside (plus part); cell i sits at angle -pi/2 + 2 pi i / n
        var dh = 2 * Math.PI / n * 0.88, every = labelStep(2 * Math.PI * (Ro + 13) / n, p);
        ctx.beginPath();
        for (i = 0; i < n; i++) if (lit.indexOf(i) < 0) sector(ctx, cx, cy, i % 2 ? Ro - 16 : Ro - 34, i % 2 ? Ro : Ro - 18, -Math.PI / 2 + 2 * Math.PI * i / n, dh);
        ctx.fillStyle = fig.color('muted', 0.2 * a); ctx.fill();
        fig.stroke({ color: 'muted', width: 1, alpha: 0.55 * a }); ctx.stroke();
        ctx.beginPath();
        lit.forEach(function (j) { sector(ctx, cx, cy, Ro - 16, Ro, -Math.PI / 2 + 2 * Math.PI * j / n, dh); });
        ctx.fillStyle = fig.color('teal', a); ctx.fill();
        for (i = 0; i < n; i++) {
          var th = -Math.PI / 2 + 2 * Math.PI * i / n, c = Math.cos(th), s = Math.sin(th);
          cellPos[i] = [cx + (Ro + 4) * c, cy + (Ro + 4) * s, th];
          if (i % every === 0 && !near(i, lit, n, Math.max(2, Math.ceil(40 / (2 * Math.PI * (Ro + 13) / n))))) fig.text(String(i), cx + (Ro + 13) * c, cy + (Ro + 13) * s, { color: 'muted', size: 10.5, mono: true, align: 'center', baseline: 'middle', alpha: a });
        }
        fig.label('Am', cx, cy - 12, { anchor: 's', color: 'fg', size: 13, alpha: a });
        fig.label('Ap', cx, cy + 12, { anchor: 'n', color: 'muted', size: 13, alpha: a });
        lit.forEach(function (j) {
          var th2 = cellPos[j][2], c2 = Math.cos(th2), s2 = Math.sin(th2), ax = cx + (Ro + 12) * c2, ay = cy + (Ro + 12) * s2;
          var anc = Math.abs(c2) > Math.abs(s2) ? (c2 > 0 ? 'w' : 'e') : (s2 < 0 ? 's' : 'n');
          if (fig.tex['w' + j]) fig.label('w' + j, ax, ay, { anchor: anc, color: 'teal', size: 13, alpha: a });
        });
      } else {
        // two strips: the plus part on top, the minus part next to the chips
        var sx0 = 44, sw = W - 10 - sx0, yP = 66, yM = 86, ch = 15, cwS = sw / n * 2, everyS = labelStep(sw / n, p);
        fig.label('ApS', sx0 - 8, yP + ch / 2, { anchor: 'e', color: 'muted', size: 13, alpha: a });
        fig.label('AmS', sx0 - 8, yM + ch / 2, { anchor: 'e', color: 'fg', size: 13, alpha: a });
        for (i = 0; i < n; i++) {
          var xi = sx0 + sw * (i + 0.5) / n, on = lit.indexOf(i) >= 0;
          fig.rect(xi - cwS * 0.44, i % 2 ? yM : yP, cwS * 0.88, ch, { fill: on ? 'teal' : 'muted', alpha: (on ? 1 : 0.22) * a });
          cellPos[i] = [xi, yM + ch];
          if (i % everyS === 0 && !near(i, lit, n, Math.max(2, Math.ceil(36 / (sw / n))))) fig.text(String(i), xi, yM + ch + 13, { color: 'muted', size: 10, mono: true, align: 'center', alpha: a });
        }
        lit.forEach(function (j) { if (fig.tex['w' + j]) fig.label('w' + j, cellPos[j][0], yM + ch + 19, { anchor: 'n', color: 'teal', size: 12.5, alpha: a }); });
      }

      // arcs from each gold chip to its eigenspace, then the chips over them
      ks.forEach(function (k) {
        var xc = x0 + cw * ((k - 2) / 2 + 0.5), e = cellPos[mod(1 - k, n)];
        fig.stroke({ color: 'muted', width: 1.3, alpha: 0.9 * a }); ctx.beginPath(); ctx.moveTo(xc, yChip - 2);
        if (strip) ctx.bezierCurveTo(xc, yChip - 30, e[0], e[1] + 40, e[0], e[1] + 1);
        else {
          var rg = Ro + 4, f0 = Math.atan2(yChip - cy, xc - cx), d = mod(e[2] - f0 + Math.PI, 2 * Math.PI) - Math.PI;
          ctx.lineTo(cx + rg * Math.cos(f0), cy + rg * Math.sin(f0)); ctx.arc(cx, cy, rg, f0, f0 + d, d < 0);
        }
        ctx.stroke();
      });
      ctx.beginPath();
      for (t = 0; t < nc; t++) if (ks.indexOf(2 + 2 * t) < 0) ctx.rect(x0 + cw * t + gap / 2, yChip, cw - gap, 12);
      ctx.fillStyle = fig.color('muted', 0.3 * a); ctx.fill();
      ks.forEach(function (k) {
        var xc = x0 + cw * ((k - 2) / 2 + 0.5);
        fig.rect(xc - cw / 2 + gap / 2 - (cw < 5 ? 1 : 0), yChip, Math.max(cw - gap, 3), 12, { fill: 'gold', alpha: a });
        if (fig.tex['B' + k]) fig.label('B' + k, xc, yChip + 15, { anchor: 'n', color: 'gold', size: 12.5, alpha: a });
      });
      fig.label('Bk', x0, yChip - 5, { anchor: 'sw', color: 'muted', size: 12, alpha: a });
      fig.text('2', x0 - 5, yChip + 6, { color: 'muted', size: 10, mono: true, align: 'right', baseline: 'middle', alpha: a });
      fig.text(String(p - 3), x0 + rowW + 5, yChip + 6, { color: 'muted', size: 10, mono: true, baseline: 'middle', alpha: a });
      if (!res) fig.text('computing Bernoulli numbers mod p: ' + Math.round(100 * job.progress) + '%', 16, H - 8, { color: 'muted', size: 11.5 });

      // readout, legend, and where Vandiver's conjecture sits
      var h = res && res.hm[p] ? res.hm[p][0] : null, fac = h ? factor(h).map(function (f) { return f[0] + (f[1] > 1 ? fmt.sup(f[1]) : ''); }).join(' · ') : '';
      var rows = [['p', String(p)], ['gold chips', String(ks.length)],
        h ? [{ tex: 'hm' }, fmt(h)] : null, h && !strip ? ['factored', fac] : null, h ? [{ tex: 'pdiv' }, h % p === 0 ? 'yes' : 'no'] : null];
      var pan = fig.panel(rows, strip ? { plane: S, x: 8, y: 6, compact: true } : { plane: S, at: 'ne' });
      var note = 'plus part: zero for every p below ' + fmt.sci(1.63e8, 2) + ' (Buhler and Harvey)';
      if (strip) fig.text(note, 8, H - 8, { color: 'muted', size: 11 });
      else {
        var lgW = 40 + Math.max(fig.labelSize('lgB', 13).w, fig.labelSize('lgA', 13).w);
        var lg = fig.legend([{ color: 'gold', fill: true, alpha: 1, tex: 'lgB' }, { color: 'teal', fill: true, alpha: 1, tex: 'lgA' }],
          { plane: S, x: Math.min(pan.x, W - 8 - lgW), y: pan.y + pan.h + 8 });
        var l1 = 'plus part (inner ring): zero for', l2 = 'every p below ' + fmt.sci(1.63e8, 2), l3 = '(Buhler and Harvey)';
        var tw = Math.max(fig.measure(l1, 11.5, 500), fig.measure(l2, 11.5, 500)), tx = Math.min(lg.x, W - 8 - tw);
        [l1, l2, l3].forEach(function (l, j) { fig.text(l, tx, lg.y + lg.h + 18 + 16 * j, { color: 'muted', size: 11.5 }); });
      }
    };
  }
});
