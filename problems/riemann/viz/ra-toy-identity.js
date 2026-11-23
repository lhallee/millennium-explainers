/* The toy identity qN = M^k + R of chapter 18 over F_q, for the path quadric Q_k = x1 x2 + ... + x_{k-1} x_k.
   N is exact: a recursion along the path over (last coordinate, partial value of Q_k), run modulo 2^46 and 2^46 - 1 in
   doubles (the weights are -1, 0, 1, so every step is a sum of at most q residues) and joined by the Chinese remainder
   theorem in BigInt. Each mode S_h, h != 0, is a vector chain in floating point, so R = sum S_h is computed
   independently of N. Bars on a signed log scale; at the right, |S_h| against its Parseval bound. */
Kit.register('ra-toy-identity', {
  tex: { qN: 'qN', Mk: 'M^k', Rs: '\\textstyle R=\\sum_{h\\ne0}S_h', diff: 'qN-M^k', ident: 'qN=M^k+R', Sh: '\\lvert S_h\\rvert',
    h: 'h', q: 'q', k: 'k', t: 't', R: 'R' },
  init: function (fig) {
    var PRIMES = [5, 7, 11, 13, 37, 101], P1 = 70368744177664, P2 = P1 - 1, big = BigInt;
    var qS = fig.slider({ label: 'Prime', tex: 'q', values: PRIMES, value: 101, format: function (v) { return String(v); } });
    var kS = fig.slider({ label: 'Path length', tex: 'k', min: 2, max: 8, step: 1, value: 4 });
    var wS = fig.select({ label: 'Weight', tex: 't', options: [['leg', 'Legendre symbol of x³ + x + 1'], ['one', 't = 1']], value: 'leg' });
    var cache = {}, want = null, busy = false, shown = null, progress = 0;
    var CHECKS = [['5|4|leg', 3, '105', '81', '24', 224], ['7|4|leg', -3, '371', '81', '290', 778], ['11|4|leg', 2, '-792', '16', '-808', 3648],
      ['13|4|leg', 4, '52', '256', '-204', 6750], ['37|4|leg', 10, '-2812', '10000', '-12812', 291681], ['101|4|leg', 3, '-169175', '81', '-169256', 1.025e7],
      ['37|12|leg', 10, '1007583904577', '1000000000000', null, 5.47e11], ['5|4|one', 5, '725', '625', '100', null], ['101|2|leg', 3, '505', '9', '496', 1.015e5]];

    function weights(q, w) {
      var t = new Int8Array(q);
      for (var x = 0; x < q; x++) {
        var f = (x * x % q * x + x + 1) % q, e = 1, b = f, n = (q - 1) / 2;
        if (w === 'one') { t[x] = 1; continue; }
        for (; n > 0; n >>= 1) { if (n & 1) e = e * b % q; b = b * b % q; }      // Euler's criterion
        t[x] = f === 0 ? 0 : e === 1 ? 1 : -1;
      }
      return t;
    }
    /* The inner loops live in plain functions, which the engine optimizes; the generator only sequences them. */
    function dpRow(dp, nd, t, q, y2, P) {                       // new last coordinate y2: sum over the old one, reduce mod P
      var row = y2 * q, y, s, r;
      for (y = 0; y < q; y++) {
        var off = y * y2 % q, src = y * q, cut = q - off;
        for (s = 0; s < cut; s++) nd[row + s + off] += dp[src + s];
        for (s = cut; s < q; s++) nd[row + s - cut] += dp[src + s];
      }
      for (s = 0; s < q; s++) { r = nd[row + s] % P; nd[row + s] = t[y2] < 0 && r ? P - r : r; }
    }
    function mode(h, k, q, t, co, si, V, out) {                 // S_h by the vector chain; V holds four work vectors
      var vr = V[0], vi = V[1], wr = V[2], wi = V[3], x, y, j, u;
      for (x = 0; x < q; x++) { vr[x] = t[x]; vi[x] = 0; }
      for (j = 1; j < k; j++) {
        for (y = 0; y < q; y++) {
          var st = h * y % q, idx = 0, sr = 0, sim = 0;
          if (t[y]) for (x = 0; x < q; x++) { sr += vr[x] * co[idx] - vi[x] * si[idx]; sim += vr[x] * si[idx] + vi[x] * co[idx]; idx += st; if (idx >= q) idx -= q; }
          wr[y] = t[y] * sr; wi[y] = t[y] * sim;
        }
        u = vr; vr = wr; wr = u; u = vi; vi = wi; wi = u;
      }
      var Sr = 0, Si = 0;
      for (y = 0; y < q; y++) { Sr += vr[y]; Si += vi[y]; }
      out[0] = Sr; out[1] = Si;
    }
    /* One case: exact M, N, qN, M^k, the modes S_h, and the bound. */
    function* compute(key) {
      var a = key.split('|'), q = +a[0], k = +a[1], t = weights(q, a[2]), M = 0, T2 = 0, x, y, h, res = [0, 0];
      for (x = 0; x < q; x++) { M += t[x]; T2 += t[x] * t[x]; }
      for (var mi = 0; mi < 2; mi++) {
        var P = mi ? P2 : P1, dp = new Float64Array(q * q), nd = new Float64Array(q * q);
        for (y = 0; y < q; y++) dp[y * q] = (t[y] + P) % P;
        for (var step = 1; step < k; step++) {
          nd.fill(0);
          for (var y2 = 0; y2 < q; y2++) { if (t[y2] !== 0) { dpRow(dp, nd, t, q, y2, P); yield; } }
          var sw = dp; dp = nd; nd = sw;
        }
        var acc = 0;
        for (y = 0; y < q; y++) acc = (acc + dp[y * q]) % P;
        res[mi] = acc;
      }
      var c = ((big(res[1]) - big(res[0])) % big(P1) + big(P1)) % big(P1), PP = big(P1) * big(P2);
      var N = big(res[1]) + big(P2) * c;
      if (N > PP / 2n) N -= PP;
      var co = new Float64Array(q), si = new Float64Array(q), V = [0, 1, 2, 3].map(function () { return new Float64Array(q); }), out = new Float64Array(2);
      for (x = 0; x < q; x++) { co[x] = Math.cos(2 * Math.PI * x / q); si[x] = Math.sin(2 * Math.PI * x / q); }
      var absS = new Float64Array(q), Rm = 0, sumAbs = 0;
      for (h = 1; h < q; h++) {
        mode(h, k, q, t, co, si, V, out);
        absS[h] = Math.hypot(out[0], out[1]); Rm += out[0]; sumAbs += absS[h];
        yield;
      }
      var qN = big(q) * N, Mk = big(M) ** big(k), R = qN - Mk, perMode = Math.pow(q, (k - 1) / 2) * T2;
      return { q: q, k: k, M: M, N: N, qN: qN, Mk: Mk, R: R, Rm: Rm, absS: absS, perMode: perMode, B: (q - 1) * perMode,
        rel: Math.abs(Rm - Number(R)) / Math.max(1, sumAbs) };
    }
    function selfCheck(c, k) {
      var e = CHECKS.filter(function (r) { return r[0] === k; })[0];
      if (!e) return;
      var ok = c.M === e[1] && String(c.qN) === e[2] && String(c.Mk) === e[3] && (e[4] == null || String(c.R) === e[4]) && c.rel < 1e-9 &&
        (e[5] == null || Math.abs(c.B - e[5]) <= 0.0015 * e[5] + 0.5);
      if (!ok) console.error('ra-toy-identity: case ' + k + ' does not match chapter 18: M = ' + c.M + ', qN = ' + c.qN + ', M^k = ' + c.Mk + ', R = ' + c.R + ', bound = ' + c.B);
    }
    /* One job serves the reader's latest request first, then the chapter's check cases; a stale request is dropped. */
    function* worker() {
      for (;;) {
        var key = want && !cache[want] ? want : CHECKS.map(function (r) { return r[0]; }).filter(function (k) { return !cache[k]; })[0];
        if (!key) { busy = false; return; }
        var it = compute(key), r, n = 0, kq = key.split('|'), steps = (2 * (+kq[1] - 1) + 1) * +kq[0];
        while (!(r = it.next()).done) { n++; if (key === want) progress = Math.min(0.99, n / steps); if (want && want !== key && !cache[want]) break; yield; }
        if (r.done) { cache[key] = r.value; selfCheck(r.value, key); }
        yield;
      }
    }
    function request() {
      var key = qS.value + '|' + kS.value + '|' + wS.value;
      want = key; progress = 0;
      if (!cache[key] && !busy) { busy = true; fig.job(worker, { budget: 2 }); }
    }
    var lastQ = 0;
    var bars = [0, 1, 2, 3].map(function () { return fig.follow(0, { tau: 0.075 }); });
    var yr = fig.follow(6, { tau: 0.09 });
    var B = fig.plane({ x: [0, 4], y: [-6, 6], pad: { t: 22, r: 10, b: 52, l: 46 } });
    var S = fig.plane({ x: [0, 102], y: [1, 1e6], yLog: true, pad: { t: 16, r: 14, b: 30, l: 50 } });
    function slog(v) { return v === 0 ? 0 : Math.sign(v) * Math.log10(1 + Math.abs(v)); }
    function fmtBig(v, maxDigits) {
      var neg = v < 0n, s = (neg ? -v : v).toString();
      if (s.length > maxDigits) {
        var m = (Number(s.slice(0, 4)) / 1000).toFixed(2);
        if (m === '10.00') { m = '1.00'; s += '0'; }
        return (neg ? '−' : '') + m + '×10' + Kit.fmt.sup(s.length - 1);
      }
      return (neg ? '−' : '') + s.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    return function draw() {
      if (qS.value !== lastQ) { lastQ = qS.value; kS.setRange(2, lastQ === 101 ? 8 : 12, 1); }
      var key = qS.value + '|' + kS.value + '|' + wS.value;
      if (key !== want) request();
      if (cache[key]) shown = cache[key];
      var w = fig.w, h = fig.h, narrow = w < 560, c = shown;
      var sh = narrow ? Math.max(112, 0.4 * h) : 0;
      B.setBox(narrow ? [0, 0, 1, '-' + sh + 'px'] : [0, 0, 0.6, 1]);
      S.setBox(narrow ? [0, '-' + sh + 'px', 1, 1] : [0.6, 0, 1, 1]);
      if (!c) { fig.text('computing the first case: ' + Math.round(100 * progress) + '%', w / 2, h / 2, { color: 'muted', align: 'center' }); fig.more(); return; }

      // bars: q N, M^k, R from the modes, q N - M^k exact
      var vals = [Number(c.qN), Number(c.Mk), c.Rm, Number(c.R)], top = slog(c.B);
      for (var i = 0; i < 4; i++) top = Math.max(top, Math.abs(slog(vals[i])));
      var ym = yr.to(Math.max(3, Math.ceil(top * 1.15))).value;
      B.view.y0 = -ym; B.view.y1 = ym; B.update();
      var bb = B.box, stepY = ym <= 7 ? 1 : ym <= 14 ? 2 : ym <= 22 ? 4 : 5, ticks = [];
      for (var v = -Math.floor(ym / stepY) * stepY; v <= ym; v += stepY) ticks.push([v, v === 0 ? '0' : (v < 0 ? '−' : '') + Kit.fmt.pow10(Math.abs(v))]);
      B.grid({ yTicks: ticks.map(function (tk) { return tk[0]; }), xStep: 100 });
      B.axes({ x: false, yTicks: ticks, edge: true });
      var bl = slog(c.B);
      B.fillBetween(bl, -bl, 0, 4, { color: 'muted', alpha: 0.08 });
      B.hline(bl, { color: 'muted', width: 1.2, dash: [5, 4] }); B.hline(-bl, { color: 'muted', width: 1.2, dash: [5, 4] });
      fig.text('Parseval bound', bb.r - 4, B.Y(bl) - 5, { color: 'muted', size: 11, align: 'right' });
      B.hline(0, { color: 'muted', width: 1 });
      var cols = ['gold', 'blue', 'red', 'red'], keys = ['qN', 'Mk', 'Rs', 'diff'], nums = [c.qN, c.Mk, big(Math.round(c.Rm)), c.R];
      var pitch = bb.w / 4, bw = Math.min(56, pitch * 0.46), ctx = fig.ctx, fs = narrow ? 10.5 : 11.5, dig = narrow ? 8 : 12;
      for (i = 0; i < 4; i++) {
        var cx = bb.l + pitch * (i + 0.5), hv = bars[i].to(slog(vals[i])).value, y0 = B.Y(0), y1 = B.Y(hv);
        fig.rect(cx - bw / 2, Math.min(y0, y1), bw, Math.abs(y1 - y0), { fill: cols[i], alpha: i === 3 ? 0.18 : 0.8, color: cols[i], width: 1.5 });
        if (i === 3) B.clip(function () {
          ctx.save(); ctx.beginPath(); ctx.rect(cx - bw / 2, Math.min(y0, y1), bw, Math.abs(y1 - y0)); ctx.clip();
          for (var d = -bw; d < Math.abs(y1 - y0) + bw; d += 7) fig.line(cx - bw / 2, Math.min(y0, y1) + d, cx + bw / 2, Math.min(y0, y1) + d - bw, { color: 'red', width: 1.2, alpha: 0.75 });
          ctx.restore();
        });
        // the value at the bar's end; on a phone, just across the zero line from the bar, clear of the bound lines
        var up = hv >= 0, ty = narrow ? (up ? y0 + 13 : y0 - 6) : up ? Math.min(y1, y0) - 6 : Math.max(y1, y0) + 13;
        fig.text(fmtBig(nums[i], dig), cx, Kit.clamp(ty, bb.t - 8, bb.b + 2), { color: cols[i], size: fs, mono: true, align: 'center', weight: 600 });
        fig.label(narrow && i === 2 ? 'R' : keys[i], cx, bb.b + 15, { anchor: 'c', color: cols[i], size: narrow ? 12 : 14 });
      }
      var holds = c.rel < 1e-9, sign = c.qN > 0n ? 'positive' : c.qN < 0n ? 'negative' : 'zero';
      var line = [{ tex: 'ident' }, ' holds: ' + (holds ? 'yes' : 'no'), narrow ? null : '   ·   ', narrow ? null : { tex: 'qN' }, narrow ? null : ' is ' + sign];
      fig.mathText(line, bb.l + bb.w / 2, bb.b + 38, { size: narrow ? 11.5 : 12.5, align: 'center', color: holds ? 'fg' : 'red' });
      if (want !== key || !cache[key]) fig.text('computing ' + Math.round(100 * progress) + '%', bb.l + 6, bb.t - 8, { color: 'muted', size: 11 });

      // modes |S_h| against the per-mode bound
      var hi = c.perMode * 2.2, lo = hi, absS = c.absS;
      for (i = 1; i < c.q; i++) if (absS[i] > 1e-9) lo = Math.min(lo, absS[i]);
      lo = Math.max(lo / 2, hi * 1e-7, 0.5);
      S.view.x0 = 0; S.view.x1 = c.q; S.view.y0 = lo; S.view.y1 = hi; S.update();
      S.grid(); S.axes({ edge: true, xStep: c.q > 50 ? 25 : c.q > 12 ? 10 : 2, xLabel: 'h' });
      S.hline(c.perMode, { color: 'muted', width: 1.4, dash: [5, 4] });
      var rr = c.q > 50 ? 2.2 : 3.2;                            // one path for all the dots
      ctx.beginPath();
      for (i = 1; i < c.q; i++) { var dx = S.X(i), dy = S.Y(Math.max(absS[i], lo)); ctx.moveTo(dx + rr, dy); ctx.arc(dx, dy, rr, 0, 2 * Math.PI); }
      ctx.fillStyle = fig.color('red'); ctx.fill();
      if (narrow) fig.label('Sh', S.box.l + 6, S.box.t - 1, { anchor: 'sw', color: 'red', size: 12 });
      else S.label('Sh', 0.5, hi, { anchor: 'nw', color: 'red', dx: 6, dy: 2, size: 13 });
      fig.text('bound per mode', S.box.r - 4, S.Y(c.perMode) - 5, { color: 'muted', size: 11, align: 'right' });
      if (want !== key || !cache[key]) fig.more();
    };
  }
});
