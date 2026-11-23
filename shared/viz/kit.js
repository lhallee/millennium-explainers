/* Figure kit for the explainers: lazy lifecycle, one shared animation loop, a 2D plane with drawing helpers, math
   labels rendered by KaTeX at build time, accessible controls, draggable points, domain coloring, and the math the
   figures need (complex arithmetic, primes, li, Gamma, zeta, the Riemann-Siegel Z function, the zero table).
   The interface is documented in shared/viz/README.md. The math part has no DOM dependency, so the build and the
   tests can run it in Node. */
(function (global) {
  'use strict';
  var Kit = global.Kit = global.Kit || {};
  var modules = Kit.modules = Kit.modules || {};

  /* A module registers once at its top level and does nothing else until the kit calls init(fig). */
  Kit.register = function (name, spec) {
    if (typeof name !== 'string' || !name) throw new Error('Kit.register needs a figure name');
    if (modules[name]) throw new Error('figure "' + name + '" is registered twice');
    if (!spec || typeof spec.init !== 'function') throw new Error('figure "' + name + '" needs an init(fig) function');
    modules[name] = spec;
  };

  var clamp = Kit.clamp = function (v, lo, hi) { return v < lo ? lo : v > hi ? hi : v; };
  Kit.lerp = function (a, b, t) { return a + (b - a) * t; };
  Kit.ease = {
    linear: function (t) { return t; },
    inQuad: function (t) { return t * t; },
    outQuad: function (t) { return t * (2 - t); },
    inOutQuad: function (t) { return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t; },
    inOutCubic: function (t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; },
    outCubic: function (t) { return 1 - Math.pow(1 - t, 3); },
    inOutSine: function (t) { return -(Math.cos(Math.PI * t) - 1) / 2; },
    smooth: function (t) { return t * t * (3 - 2 * t); }
  };

  /* ------------------------------------------------------------------------------------------------------------
     Math */

  var M = Kit.math = {};
  var LOG2PI_HALF = 0.5 * Math.log(2 * Math.PI);
  var LOGPI = Math.log(Math.PI);
  var LOG2 = Math.LN2;

  /* Complex numbers are plain objects {re, im}. */
  function C(re, im) { return { re: re, im: im || 0 }; }
  M.C = C;
  M.add = function (a, b) { return C(a.re + b.re, a.im + b.im); };
  M.sub = function (a, b) { return C(a.re - b.re, a.im - b.im); };
  M.mul = function (a, b) { return C(a.re * b.re - a.im * b.im, a.re * b.im + a.im * b.re); };
  M.div = function (a, b) {
    var d = b.re * b.re + b.im * b.im;
    return C((a.re * b.re + a.im * b.im) / d, (a.im * b.re - a.re * b.im) / d);
  };
  M.scale = function (a, k) { return C(a.re * k, a.im * k); };
  M.conj = function (a) { return C(a.re, -a.im); };
  M.abs = function (a) { return Math.hypot(a.re, a.im); };
  M.arg = function (a) { return Math.atan2(a.im, a.re); };
  M.exp = function (a) { var e = Math.exp(a.re); return C(e * Math.cos(a.im), e * Math.sin(a.im)); };
  M.log = function (a) { return C(Math.log(Math.hypot(a.re, a.im)), Math.atan2(a.im, a.re)); };
  M.pow = function (a, b) {
    if (a.re === 0 && a.im === 0) return (b.re === 0 && b.im === 0) ? C(1, 0) : C(0, 0);
    return M.exp(M.mul(b, M.log(a)));
  };
  M.sqrt = function (a) { var r = Math.hypot(a.re, a.im); var x = Math.sqrt((r + a.re) / 2); var y = Math.sqrt((r - a.re) / 2); return C(x, a.im < 0 ? -y : y); };
  M.sin = function (a) { return C(Math.sin(a.re) * Math.cosh(a.im), Math.cos(a.re) * Math.sinh(a.im)); };
  M.cos = function (a) { return C(Math.cos(a.re) * Math.cosh(a.im), -Math.sin(a.re) * Math.sinh(a.im)); };
  M.polar = function (r, theta) { return C(r * Math.cos(theta), r * Math.sin(theta)); };

  /* Primes. The sieve grows on demand and is shared by every figure. */
  var sieveLimit = 0;
  var isPrimeArr = new Uint8Array(0);
  var primeList = new Int32Array(0);
  var piPrefix = new Int32Array(0);
  var psiPrefix = new Float64Array(0);
  var lambdaArr = new Float64Array(0);
  function growSieve(n) {
    n = Math.max(Math.ceil(n), 100);
    if (n <= sieveLimit) return;
    n = Math.max(n, sieveLimit * 2);
    var isP = new Uint8Array(n + 1);
    isP.fill(1, 2);
    for (var i = 2; i * i <= n; i++) if (isP[i]) for (var j = i * i; j <= n; j += i) isP[j] = 0;
    isPrimeArr = isP;
    piPrefix = new Int32Array(n + 1);
    lambdaArr = new Float64Array(n + 1);
    psiPrefix = new Float64Array(n + 1);
    var count = 0;
    for (var k = 2; k <= n; k++) piPrefix[k] = count += isP[k];
    primeList = new Int32Array(count);
    for (var k2 = 2, c = 0; k2 <= n; k2++) {
      if (!isP[k2]) continue;
      primeList[c++] = k2;
      var lp = Math.log(k2);
      for (var q = k2; q <= n; q *= k2) lambdaArr[q] = lp;
    }
    var acc = 0;
    for (var m = 1; m <= n; m++) { acc += lambdaArr[m]; psiPrefix[m] = acc; }
    sieveLimit = n;
  }
  M.sieve = function (n) { growSieve(n); return isPrimeArr; };
  M.isPrime = function (n) { n = Math.floor(n); if (n < 2) return false; growSieve(n); return isPrimeArr[n] === 1; };
  M.primes = function (n) {
    if (n < 2) return primeList.subarray(0, 0);
    growSieve(n);
    return primeList.subarray(0, piPrefix[Math.floor(n)]);
  };
  M.pi = function (x) { if (x < 2) return 0; growSieve(x); return piPrefix[Math.floor(x)]; };
  M.vonMangoldt = function (n) { n = Math.floor(n); if (n < 2) return 0; growSieve(n); return lambdaArr[n]; };
  M.psi = function (x) { if (x < 2) return 0; growSieve(x); return psiPrefix[Math.floor(x)]; };
  M.mobius = function (n) {
    n = Math.floor(n);
    if (n < 1) return 0;
    var r = 1;
    for (var p = 2; p * p <= n; p++) {
      if (n % p === 0) { n /= p; if (n % p === 0) return 0; r = -r; }
    }
    return n > 1 ? -r : r;
  };
  /* Jump points of a staircase: xs[i] is where the count steps up to ys[i]. */
  M.psiSteps = function (X) {
    growSieve(X);
    var xs = [], ys = [];
    for (var n = 2; n <= X; n++) if (lambdaArr[n] > 0) { xs.push(n); ys.push(psiPrefix[n]); }
    return { xs: Float64Array.from(xs), ys: Float64Array.from(ys) };
  };
  M.piSteps = function (X) {
    var ps = M.primes(X);
    var xs = new Float64Array(ps.length), ys = new Float64Array(ps.length);
    for (var i = 0; i < ps.length; i++) { xs[i] = ps[i]; ys[i] = i + 1; }
    return { xs: xs, ys: ys };
  };

  /* Logarithmic integral li(x) by Ramanujan's series, for x > 0 and x != 1; Li(x) = li(x) - li(2). */
  var EULER_GAMMA = 0.5772156649015329;
  M.li = function (x) {
    if (x === 1) return -Infinity;
    if (x <= 0) return NaN;
    var L = Math.log(x);
    var sum = 0, term = 1, inner = 0, p2 = 1;   // p2 = 2^(n - 1)
    for (var n = 1; n < 400; n++) {
      term *= L / n;
      if ((n - 1) % 2 === 0) inner += 1 / (n);
      var add = (n % 2 === 1 ? 1 : -1) * term / p2 * inner;
      p2 *= 2;
      sum += add;
      if (Math.abs(add) < 1e-17 * Math.abs(sum) && n > L) break;
    }
    return EULER_GAMMA + Math.log(Math.abs(L)) + Math.sqrt(x) * sum;
  };
  var LI2 = M.li(2);
  M.Li = function (x) { return M.li(x) - LI2; };

  /* log Gamma for complex z. Re z < 0 uses reflection; otherwise z is shifted until |z| >= 15 and Stirling's series
     with eight terms finishes, which gives about 15 digits. For Re z >= 0 the result is the continuous branch, so its
     imaginary part can be used for the Riemann-Siegel theta function. */
  var STIRLING = [1 / 12, -1 / 360, 1 / 1260, -1 / 1680, 1 / 1188, -691 / 360360, 1 / 156, -3617 / 122400];
  function lgammaInto(x, y, out) {
    if (x < 0) {
      // log Gamma(z) = log pi - log sin(pi z) - log Gamma(1 - z)
      lgammaInto(1 - x, -y, out);
      var lr = out[0], li = out[1];
      logSinInto(Math.PI * x, Math.PI * y, out);
      out[0] = LOGPI - out[0] - lr;
      out[1] = -out[1] - li;
      return out;
    }
    var accRe = 0, accIm = 0;
    while (x * x + y * y < 225) {
      accRe += 0.5 * Math.log(x * x + y * y);
      accIm += Math.atan2(y, x);
      x += 1;
    }
    // (z - 1/2) log z - z + log(2 pi)/2 + sum c_k / z^(2k-1)
    var lr2 = 0.5 * Math.log(x * x + y * y), la = Math.atan2(y, x);
    var re = (x - 0.5) * lr2 - y * la - x + LOG2PI_HALF;
    var im = (x - 0.5) * la + y * lr2 - y;
    var d = x * x + y * y;
    var ir = x / d, ii = -y / d;             // 1/z
    var z2r = ir * ir - ii * ii, z2i = 2 * ir * ii; // 1/z^2
    var pr = ir, pi = ii;
    for (var k = 0; k < STIRLING.length; k++) {
      re += STIRLING[k] * pr; im += STIRLING[k] * pi;
      var nr = pr * z2r - pi * z2i; pi = pr * z2i + pi * z2r; pr = nr;
    }
    out[0] = re - accRe; out[1] = im - accIm;
    return out;
  }
  /* log sin(z), stable for large |Im z|. */
  function logSinInto(x, y, out) {
    if (Math.abs(y) < 20) {
      var sr = Math.sin(x) * Math.cosh(y), si = Math.cos(x) * Math.sinh(y);
      out[0] = 0.5 * Math.log(sr * sr + si * si); out[1] = Math.atan2(si, sr);
      return out;
    }
    // y > 0: sin z = (i/2) e^{-iz} (1 - e^{2iz}); y < 0: sin z = (-i/2) e^{iz} (1 - e^{-2iz}); the last factor is 1 here.
    if (y > 0) { out[0] = y - LOG2; out[1] = Math.PI / 2 - x; }
    else { out[0] = -y - LOG2; out[1] = -Math.PI / 2 + x; }
    return out;
  }
  var tmpA = [0, 0];
  M.lgamma = function (z) { lgammaInto(z.re, z.im, tmpA); return C(tmpA[0], tmpA[1]); };
  /* log Gamma(re + i im) written into out[0], out[1], with no allocation, for loops over pixels. */
  M.lgammaInto = function (re, im, out) { return lgammaInto(re, im, out); };
  M.gamma = function (z) {
    if (z.im === 0 && z.re <= 0 && z.re === Math.floor(z.re)) return C(NaN, NaN);
    lgammaInto(z.re, z.im, tmpA);
    var e = Math.exp(tmpA[0]);
    return C(e * Math.cos(tmpA[1]), e * Math.sin(tmpA[1]));
  };

  /* Riemann zeta. For Re s >= 1/2 (or |s| < 1/2): Euler-Maclaurin summation with N = ceil((|s| + 24) / 2.2) terms
     and twelve Bernoulli corrections, so each correction shrinks by (|s| + 24)/(2 pi N) <= 0.35 squared. For
     Re s < 1/2: the functional equation zeta(s) = 2^s pi^(s-1) sin(pi s / 2) Gamma(1 - s) zeta(1 - s), with the factor
     computed in logarithms. Accuracy against mpmath is in README.md. */
  var BERN = [1 / 6, -1 / 30, 1 / 42, -1 / 30, 5 / 66, -691 / 2730, 7 / 6, -3617 / 510, 43867 / 798, -174611 / 330, 854513 / 138, -236364091 / 2730];
  var EM = [];
  (function () { var f = 1; for (var k = 1; k <= BERN.length; k++) { f *= (2 * k - 1) * (2 * k); EM.push(BERN[k - 1] / f); } })();
  function zetaEM(sr, si, out) {
    var modS = Math.hypot(sr, si);
    var N = Math.max(6, Math.ceil((modS + 24) / 2.2));
    var re = 0, im = 0;
    for (var n = 1; n < N; n++) {
      var ln = Math.log(n);
      var mag = Math.exp(-sr * ln), ph = -si * ln;
      re += mag * Math.cos(ph); im += mag * Math.sin(ph);
    }
    var lnN = Math.log(N);
    var nm = Math.exp(-sr * lnN), nph = -si * lnN;
    var Ns_r = nm * Math.cos(nph), Ns_i = nm * Math.sin(nph); // N^-s
    // N^(1-s) / (s - 1)
    var a_r = N * Ns_r, a_i = N * Ns_i;
    var b_r = sr - 1, b_i = si;
    var d = b_r * b_r + b_i * b_i;
    re += (a_r * b_r + a_i * b_i) / d; im += (a_i * b_r - a_r * b_i) / d;
    re += 0.5 * Ns_r; im += 0.5 * Ns_i;
    // corrections: EM[k] * s (s+1) ... (s+2k-2) * N^(-s-2k+1)
    var pr = sr / N, pi = si / N; // s * N^-1, times N^-s below
    var invN2 = 1 / (N * N);
    for (var k = 0; k < EM.length; k++) {
      var tr = pr * Ns_r - pi * Ns_i, ti = pr * Ns_i + pi * Ns_r;
      re += EM[k] * tr; im += EM[k] * ti;
      // multiply p by (s + 2k + 1)(s + 2k + 2) / N^2
      var c1r = sr + 2 * k + 1, c2r = sr + 2 * k + 2;
      var qr = c1r * c2r - si * si, qi = si * (c1r + c2r);
      var npr = (pr * qr - pi * qi) * invN2; pi = (pr * qi + pi * qr) * invN2; pr = npr;
    }
    out[0] = re; out[1] = im;
    return out;
  }
  var tmpZ = [0, 0], tmpG = [0, 0], tmpS = [0, 0];
  function zetaInto(sr, si, out) {
    if (sr === 1 && si === 0) { out[0] = Infinity; out[1] = 0; return out; }
    if (sr >= 0.5 || Math.hypot(sr, si) < 0.5) return zetaEM(sr, si, out);
    // Trivial zeros: zeta(-2k) = 0 exactly.
    if (si === 0 && sr < 0 && sr % 2 === 0) { out[0] = 0; out[1] = 0; return out; }
    zetaEM(1 - sr, -si, tmpZ);
    var zr = tmpZ[0], zi = tmpZ[1];
    lgammaInto(1 - sr, -si, tmpG);
    logSinInto(Math.PI * sr / 2, Math.PI * si / 2, tmpS);
    // log of 2^s pi^(s-1) sin(pi s/2) Gamma(1-s)
    var lr = sr * LOG2 + (sr - 1) * LOGPI + tmpS[0] + tmpG[0];
    var lim = si * LOG2 + si * LOGPI + tmpS[1] + tmpG[1];
    var e = Math.exp(lr), fr = e * Math.cos(lim), fi = e * Math.sin(lim);
    out[0] = fr * zr - fi * zi; out[1] = fr * zi + fi * zr;
    return out;
  }
  M.zetaInto = zetaInto;
  M.zeta = function (s, t) {
    if (typeof s === 'number') { zetaInto(s, t || 0, tmpZ); return C(tmpZ[0], tmpZ[1]); }
    var o = [0, 0]; zetaInto(s.re, s.im, o); return C(o[0], o[1]);
  };
  /* Riemann-Siegel theta(t) = Im log Gamma(1/4 + it/2) - (t/2) log pi, continuous in t, and
     Z(t) = e^{i theta(t)} zeta(1/2 + it), which is real. */
  M.rsTheta = function (t) { lgammaInto(0.25, t / 2, tmpG); return tmpG[1] - t / 2 * LOGPI; };
  M.Z = function (t) {
    var th = M.rsTheta(t);
    var o = [0, 0]; zetaInto(0.5, t, o);
    return Math.cos(th) * o[0] - Math.sin(th) * o[1];
  };
  /* Chebyshev psi rebuilt from the first N pairs of zeros by von Mangoldt's explicit formula:
     psi0(x) = x - sum over |gamma| <= gamma_N of x^rho / rho - log(2 pi) - log(1 - x^-2) / 2. */
  M.explicitPsi = function (x, N) {
    var zs = Kit.zeros;
    if (!zs) throw new Error('Kit.zeros is missing: zeros.js must be inlined after kit.js');
    var L = Math.log(x), sx = Math.sqrt(x), sum = 0;
    var n = Math.min(N, zs.length);
    for (var k = 0; k < n; k++) {
      var g = zs[k], gl = g * L;
      sum += (0.5 * Math.cos(gl) + g * Math.sin(gl)) / (0.25 + g * g);
    }
    return x - 2 * sx * sum - Math.log(2 * Math.PI) - 0.5 * Math.log(1 - 1 / (x * x));
  };
  /* Nice tick spacing for a range drawn over a number of pixels. */
  M.niceStep = function (range, pixels, target) {
    var raw = range / Math.max(1, pixels / (target || 80));
    var p = Math.pow(10, Math.floor(Math.log10(raw)));
    var f = raw / p;
    return (f < 1.5 ? 1 : f < 3.5 ? 2 : f < 7.5 ? 5 : 10) * p;
  };

  /* Number formatting for canvas text, tick labels, and control readouts: thousands separators, the true minus
     sign U+2212, and powers of ten with superscript digits. */
  var MINUS = '−';
  var SUP = { '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹', '-': '⁻', '+': '⁺' };
  var SUB = { '0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄', '5': '₅', '6': '₆', '7': '₇', '8': '₈', '9': '₉', '-': '₋', '+': '₊' };
  function mapChars(s, table) {
    var out = '';
    for (var i = 0; i < s.length; i++) {
      var c = table[s[i]];
      if (c == null) throw new Error('no superscript or subscript form for "' + s[i] + '" in "' + s + '"');
      out += c;
    }
    return out;
  }
  function group(digits) { return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  /* Kit.fmt(v, digits) or Kit.fmt(v, { digits, sign, sep }): fixed decimals (default 0 for integers, else 2),
     thousands separators (sep: false drops them), a leading + for positives with sign: true. */
  var fmt = Kit.fmt = function (v, opts) {
    var o = typeof opts === 'number' ? { digits: opts } : opts || {};
    if (v !== v) return 'NaN';
    if (!isFinite(v)) return (v < 0 ? MINUS : o.sign ? '+' : '') + '∞';
    var d = o.digits == null ? (Math.round(v) === v ? 0 : 2) : o.digits;
    var s = Math.abs(v).toFixed(d);
    if (o.sep !== false) { var dot = s.indexOf('.'); s = dot < 0 ? group(s) : group(s.slice(0, dot)) + s.slice(dot); }
    var zero = Number(s.replace(/,/g, '')) === 0;
    return (zero ? '' : v < 0 ? MINUS : o.sign ? '+' : '') + s;
  };
  fmt.minus = MINUS;
  fmt.sup = function (n) { return mapChars(String(n).replace(MINUS, '-'), SUP); };
  fmt.sub = function (n) { return mapChars(String(n).replace(MINUS, '-'), SUB); };
  fmt.signed = function (v, digits) { return fmt(v, { digits: digits, sign: true }); };
  fmt.pow10 = function (k) { return '10' + fmt.sup(k); };
  /* 1.5×10⁶; a mantissa of 1 prints as 10⁶. */
  fmt.sci = function (v, digits) {
    if (v === 0) return '0';
    var d = digits == null ? 1 : digits;
    var k = Math.floor(Math.log10(Math.abs(v)));
    var m = Math.abs(v) / Math.pow(10, k);
    if (Number(m.toFixed(d)) >= 10) { k++; m /= 10; }
    var ms = m.toFixed(d);
    var sign = v < 0 ? MINUS : '';
    return Number(ms) === 1 ? sign + fmt.pow10(k) : sign + ms + '×10' + fmt.sup(k);
  };
  /* Plain digits between 0.001 and 100,000, powers of ten outside. */
  fmt.compact = function (v, digits) {
    var a = Math.abs(v);
    if (a === 0 || (a >= 1e-3 && a < 1e5)) return fmt(v, digits == null ? (a >= 1 || a === 0 ? (Math.round(v) === v ? 0 : 2) : Math.min(6, 1 - Math.floor(Math.log10(a)))) : digits);
    return fmt.sci(v, digits == null ? 1 : digits);
  };
  /* About three significant digits: 1,127, 45.3, 0.123, 0.0278, 1.13×10⁵; below 0.01 and from 100,000 on, powers of
     ten. A value that rounds up to the next power of ten keeps three digits: 9.996 gives 10.0, 0.09996 gives 0.100. */
  fmt.sig = function (v) {
    var a = Math.abs(v);
    if (a === 0) return '0';
    if (!isFinite(a)) return fmt(v);
    if (a < 0.01) return fmt.sci(v, 2);
    var k = Math.floor(Math.log10(a));
    var d = Math.max(0, 2 - k);
    if (Math.abs(Number(a.toFixed(d))) >= Math.pow(10, k + 1)) d = Math.max(0, d - 1);
    if (Number(a.toFixed(d)) >= 1e5) return fmt.sci(v, 2);
    return fmt(v, d);
  };
  /* A formatter for numbers spaced step apart: as many decimals as the step needs. Axes use it by default. */
  fmt.step = function (step) {
    // As many decimals as the step has: 0.25 needs two, 0.5 one, 2 none (at most six).
    var d = 0;
    while (d < 6 && Math.abs(Math.round(step * Math.pow(10, d)) - step * Math.pow(10, d)) > 1e-9 * Math.max(1, step * Math.pow(10, d))) d++;
    return function (v) { return fmt(Math.abs(v) < step * 1e-9 ? 0 : v, d); };
  };
  /* 0.50 + 14.13i; with digits 'sig', each part to about three significant digits (fmt.sig): 0.0278 − 1.13×10⁵i. */
  fmt.complex = function (re, im, digits) {
    if (digits === 'sig') {
      var a = fmt.sig(Math.abs(im));
      return fmt.sig(re) + (im < 0 && a !== '0' ? ' ' + MINUS + ' ' : ' + ') + a + 'i';
    }
    var d = digits == null ? 2 : digits;
    return fmt(re, d) + (im < 0 && Number(Math.abs(im).toFixed(d)) !== 0 ? ' ' + MINUS + ' ' : ' + ') + fmt(Math.abs(im), d) + 'i';
  };

  /* A map between a position u in [0, 1] (a slider's or a player's) and a value in [min, max]. spec is 'linear'
     (default), 'log' (min > 0), 'sqrt', or { to: function (u) { return value; }, from: function (value) { return u; } }. */
  Kit.scale = function (spec, min, max) {
    spec = spec || 'linear';
    if (spec === 'linear') return { to: function (u) { return min + (max - min) * u; }, from: function (v) { return (v - min) / (max - min); } };
    if (spec === 'log') {
      if (!(min > 0 && max > min)) throw new Error('a log scale needs 0 < min < max, got ' + min + ', ' + max);
      var L = Math.log(max / min);
      return { to: function (u) { return min * Math.exp(L * u); }, from: function (v) { return Math.log(v / min) / L; } };
    }
    if (spec === 'sqrt') return { to: function (u) { return min + (max - min) * u * u; }, from: function (v) { return Math.sqrt(Math.max(0, (v - min) / (max - min))); } };
    if (typeof spec.to !== 'function' || typeof spec.from !== 'function') throw new Error('a custom scale needs to(u) and from(value) functions');
    return spec;
  };

  /* First index i with a[i] >= x (lowerBound) or a[i] > x (upperBound), for an ascending array. */
  function lowerBound(a, x) { var lo = 0, hi = a.length; while (lo < hi) { var m = (lo + hi) >> 1; if (a[m] < x) lo = m + 1; else hi = m; } return lo; }
  function upperBound(a, x) { var lo = 0, hi = a.length; while (lo < hi) { var m = (lo + hi) >> 1; if (a[m] <= x) lo = m + 1; else hi = m; } return lo; }
  Kit.lowerBound = lowerBound;
  Kit.upperBound = upperBound;
  function pow10(u) { return Math.pow(10, u); }


  /* A task is work cut into slices: a generator function that yields now and then (optionally a progress number in
     [0, 1]) and returns its result. Kit.task(key, gen) makes one shared by every figure (same key, same task);
     fig.job(task or gen) runs it inside this figure's frames, within budget ms per frame, only while the figure is
     on screen, and redraws when it finishes. */
  var tasks = {};
  function makeTask(gen) {
    var it = null;
    return {
      done: false, progress: 0, result: undefined,
      step: function (ms) {
        if (this.done) return true;
        if (!it) it = gen();
        var deadline = performance.now() + ms;
        do {
          var r = it.next();
          if (r.done) { this.done = true; this.progress = 1; this.result = r.value; return true; }
          if (typeof r.value === 'number') this.progress = r.value;
        } while (performance.now() < deadline);
        return false;
      }
    };
  }
  Kit.task = function (key, gen) {
    if (typeof gen !== 'function') throw new Error('Kit.task("' + key + '") needs a generator function');
    return tasks[key] || (tasks[key] = makeTask(gen));
  };
  /* The shared sieve grown to n as a task (see Kit.task), in slices of a few milliseconds, so a figure that needs
     primes up to 10^6 or more can draw at once and wait for them: fig.job(Kit.math.sieveTask(1e6)). */
  M.sieveTask = function (n) {
    n = Math.max(Math.ceil(n), 100);
    return Kit.task('sieve:' + n, function* () {
      if (n <= sieveLimit) return n;
      var isP = new Uint8Array(n + 1), i, k;
      isP.fill(1, 2);
      yield 0;
      for (i = 2; i * i <= n; i++) if (isP[i]) { for (var j = i * i; j <= n; j += i) isP[j] = 0; yield 0.4 * i * i / n; }
      var pre = new Int32Array(n + 1), count = 0;
      yield 0.4;
      for (k = 2; k <= n; k++) { pre[k] = count += isP[k]; if ((k & 65535) === 0) yield 0.4 + 0.1 * k / n; }
      var list = new Int32Array(count), c = 0;
      yield 0.5;
      var lam = new Float64Array(n + 1);
      yield 0.5;
      for (k = 2; k <= n; k++) {
        if (!isP[k]) continue;
        list[c++] = k;
        var lp = Math.log(k);
        for (var q = k; q <= n; q *= k) lam[q] = lp;
        if ((c & 8191) === 0) yield 0.5 + 0.3 * k / n;
      }
      var ps = new Float64Array(n + 1), acc = 0;
      yield 0.8;
      for (var m = 1; m <= n; m++) { acc += lam[m]; ps[m] = acc; if ((m & 65535) === 0) yield 0.8 + 0.2 * m / n; }
      if (n > sieveLimit) { isPrimeArr = isP; piPrefix = pre; primeList = list; lambdaArr = lam; psiPrefix = ps; sieveLimit = n; }
      return n;
    });
  };
  M.sieveLimit = function () { return sieveLimit; };
  /* The Moebius function and its running sum, the Mertens function M(x), up to n as one shared task (see Kit.task):
     its result is { mu: Int8Array, M: Int32Array } with mu[k] = mu(k) and M[x] = mu(1) + ... + mu(x), index 0 unused.
     fig.job(Kit.math.mertensTask(1e6), { onDone: function (r) { table = r.M; } }). */
  M.mertensTask = function (n) {
    n = Math.max(Math.ceil(n), 10);
    return Kit.task('mertens:' + n, function* () {
      var mu = new Int8Array(n + 1), comp = new Uint8Array(n + 1), primes = new Int32Array(Math.max(16, Math.ceil(1.3 * n / Math.log(n)))), np = 0;
      mu[1] = 1;
      for (var i = 2; i <= n; i++) {
        if (!comp[i]) { primes[np++] = i; mu[i] = -1; }
        for (var j = 0; j < np; j++) {
          var q = i * primes[j];
          if (q > n) break;
          comp[q] = 1;
          if (i % primes[j] === 0) { mu[q] = 0; break; }
          mu[q] = -mu[i];
        }
        if ((i & 32767) === 0) yield 0.8 * i / n;
      }
      var Mx = new Int32Array(n + 1), acc = 0;
      for (var k = 1; k <= n; k++) { acc += mu[k]; Mx[k] = acc; if ((k & 262143) === 0) yield 0.8 + 0.2 * k / n; }
      return { mu: mu, M: Mx };
    });
  };

  if (typeof document === 'undefined') return;

  /* ------------------------------------------------------------------------------------------------------------
     Browser part: lifecycle, the shared loop, drawing, labels, controls, dragging. */

  var root = document.documentElement;
  var reducedQuery = matchMedia('(prefers-reduced-motion: reduce)');
  Kit.reducedMotion = reducedQuery.matches;
  var figs = [];
  Kit.figures = figs;
  var texData = null;
  /* Modules stored packed in the page (script elements of type application/x-mx-viz with data-viz, labels of type
     application/x-mx-viz-tex) are unpacked by the runtime's MX.unpack when their figure first comes near, run, and
     must register themselves. A module inlined as a plain script is registered already. */
  var texCache = {};
  var moduleLoads = {};
  function loadModule(name) {
    if (modules[name]) return Promise.resolve();
    if (moduleLoads[name]) return moduleLoads[name];
    var codeEl = document.querySelector('script[type="application/x-mx-viz"][data-viz="' + name + '"]');
    if (!codeEl) return Promise.reject(new Error('figure module "' + name + '" is not registered and not on the page'));
    var texEl = document.querySelector('script[type="application/x-mx-viz-tex"][data-viz-tex="' + name + '"]');
    var unpack = global.MX && global.MX.unpack;
    if (!unpack) return Promise.reject(new Error('the page runtime cannot unpack figure module "' + name + '"'));
    moduleLoads[name] = Promise.all([unpack(codeEl), texEl ? unpack(texEl) : null]).then(function (r) {
      if (r[1] != null) texCache[name] = JSON.parse(r[1]);
      if (!modules[name]) {
        var s = document.createElement('script');
        s.textContent = r[0];
        document.head.appendChild(s);
      }
      if (!modules[name]) throw new Error('figure module "' + name + '" did not register');
    });
    return moduleLoads[name];
  }
  /* Page-wide setup that the first figure would otherwise pay (reading the palette), in ms; done in idle time. */
  Kit.pageSetupMs = 0;
  /* Canvas text widths for every figure, cached by font and string (up to 5,000 entries, then the cache starts again).
     They are measured on an OffscreenCanvas: its font is resolved without the document, so measuring never makes the
     browser bring the page's style up to date, which an attached canvas does when its font changes. */
  var textWidths = new Map();
  var measureCtx = null, measureFont = '';
  function measureContext() {
    if (measureCtx === null) measureCtx = typeof OffscreenCanvas === 'function' ? new OffscreenCanvas(1200, 24).getContext('2d') : false;
    return measureCtx;
  }
  /* Text in a font the page has not used yet costs 1 to 4 ms at full speed per font (the browser creates the font
     and the metrics of its glyphs): about 11 of the 17 ms of a text-heavy figure's first frame, four times that at
     4x CPU slowdown. In idle time after the page loads, the kit measures and draws the printable ASCII characters
     and the common symbols in the 25 sizes, weights, and faces figures use most, most used first, about 200 ms at
     full speed, each font only in an idle period with room for it; the page's canvases then find these fonts ready. Kit.warmMs is the
     time spent, and Kit.warmed is true when it is done. */
  Kit.warmMs = 0;
  Kit.warmed = false;
  var WARM_TEXT = ' !"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~' +
    '−×·…≤≥→πσγρζθλμΛΣ∞′°±½–—';
  function warmSpecs() {
    var list = [];
    [12, 11.5, 12.5, 11, 13, 10.5].forEach(function (sz) { list.push('500 ' + sz + 'px ' + fontFamily, '600 ' + sz + 'px ' + fontFamily); });
    [12, 11.5, 12.5, 11].forEach(function (sz) { list.push('500 ' + sz + 'px ' + monoFamily); });
    [12, 12.5, 11.5].forEach(function (sz) { list.push('700 ' + sz + 'px ' + fontFamily); });
    return list;
  }
  /* The warm-up measures and draws on the kit's measuring context (see textWidths), which then holds these fonts
     too; the page's attached canvases share the fonts the browser created. */
  function warmFonts() {
    var ctx = measureContext(), specs = null, k = 0, cost = 8;
    if (!ctx) return;
    var idle = window.requestIdleCallback || function (fn) { return setTimeout(function () { fn({ timeRemaining: function () { return 20; } }); }, 200); };
    function slice(deadline) {
      if (!palette) { idle(slice); return; }
      if (!specs) specs = warmSpecs();
      while (k < specs.length && deadline.timeRemaining() > cost) {
        var t = performance.now();
        ctx.font = specs[k];
        measureFont = specs[k];
        ctx.measureText(WARM_TEXT);
        ctx.fillText(WARM_TEXT, 0, 18);
        k++;
        cost = Math.max(2, performance.now() - t);
        Kit.warmMs += cost;
      }
      if (k < specs.length) idle(slice); else Kit.warmed = true;
    }
    idle(slice);
  }
  /* The math labels of one module: a JSON script element per module (data-viz-tex), parsed when its figure starts.
     Older pages hold one table for every module (#viz-tex). */
  function texOf(name) {
    if (texCache[name]) return texCache[name];
    var node = document.querySelector('script[type="application/json"][data-viz-tex="' + name + '"]');
    if (node) return JSON.parse(node.textContent);
    if (!texData) {
      var all = document.getElementById('viz-tex');
      texData = all ? JSON.parse(all.textContent) : {};
    }
    return texData[name] || {};
  }
  var palette = null;
  var fontFamily = 'system-ui, sans-serif';
  var monoFamily = 'ui-monospace, Consolas, monospace';
  var PALETTE_NAMES = ['stage', 'fg', 'muted', 'grid', 'gold', 'blue', 'teal', 'red', 'violet'];

  function readPalette() {
    var cs = getComputedStyle(root);
    var p = {};
    for (var i = 0; i < PALETTE_NAMES.length; i++) {
      var v = cs.getPropertyValue('--viz-' + PALETTE_NAMES[i]).trim();
      if (!v) throw new Error('the page style lacks --viz-' + PALETTE_NAMES[i]);
      p[PALETTE_NAMES[i]] = v;
    }
    p.bg = p.stage;
    var bs = getComputedStyle(document.body);
    fontFamily = bs.fontFamily || fontFamily;
    var m = cs.getPropertyValue('--mono').trim();
    if (m) monoFamily = m;
    palette = p;
    rgbaCache = {};
  }
  var rgbaCache = {};
  function rgba(color, alpha) {
    var key = color + '|' + alpha;
    var hit = rgbaCache[key];
    if (hit) return hit;
    var r, g, b, m;
    if ((m = /^#([0-9a-f]{6})$/i.exec(color))) {
      var n = parseInt(m[1], 16); r = n >> 16; g = (n >> 8) & 255; b = n & 255;
    } else if ((m = /^rgba?\(([^)]+)\)$/.exec(color))) {
      var parts = m[1].split(',').map(parseFloat); r = parts[0]; g = parts[1]; b = parts[2]; alpha *= parts.length > 3 ? parts[3] : 1;
    } else return (rgbaCache[key] = color);
    return (rgbaCache[key] = 'rgba(' + r + ',' + g + ',' + b + ',' + alpha + ')');
  }

  var raf = 0;
  function schedule() { if (!raf && !document.hidden) raf = requestAnimationFrame(tick); }
  function tick(now) {
    raf = 0;
    var more = false;
    for (var i = 0; i < figs.length; i++) {
      var f = figs[i];
      if (!f.ready || !f.visible) continue;
      if (f.needsFrame()) {
        f.frame(now);
        if (f.needsFrame()) more = true; else f.lastNow = 0;
      }
    }
    if (more) schedule();
  }
  Kit.schedule = schedule;

  /* The styles of the kit's controls are in shared/style.css. Adding a style element when the first figure starts
     made the browser recompute the style of the whole page, about 150 ms at 4x CPU slowdown. */

  /* ---------------- Figure ---------------- */

  function Figure(el) {
    this.el = el;
    this.name = el.getAttribute('data-viz');
    this.id = (el.closest('figure') || el).id || this.name;
    this.spec = modules[this.name];
    this.controlsEl = el.nextElementSibling && el.nextElementSibling.classList.contains('viz-controls') ? el.nextElementSibling : null;
    this.ready = false;
    this.visible = false;
    this.dirty = true;
    this.wantMore = false;
    this.continuous = false;
    this.lastNow = 0;
    this.t = 0;
    this.dt = 0;
    this.w = 0; this.h = 0; this.dpr = 1;
    this.controls = [];
    this.players = [];
    this.tweens = [];
    this.drags = [];
    this.planes = [];
    this.labelMap = {};
    this.labelList = [];
    /* Timing. init is the module's init(fig); first is the first frame after init. Steady frames (every later
       frame except one right after a resize or a restore) go into a ring of the last 256 for medians. */
    this.stats = { frames: 0, total: 0, max: 0, prepare: 0, init: 0, first: 0, ring: new Float64Array(256), n: 0 };
    this.prepared = false;
    this.settling = true;
    this.activeDrag = null;
    this.onReset = null;
    this.onRelease = null;
    this.onRestore = null;
    this.probes = [];
    this.jobs = [];
    this.texSize = {};
    this.textW = textWidths;
    this.fontNorm = {};
    this.labelUnit = null;
    this.autoCount = {};
    this.places = {};
    this.panelW = {};
    this.occ = null;
  }
  var FP = Figure.prototype;

  /* Setup runs as two tasks, so that neither blocks scrolling for long: prepare (the canvas, the label layer, and
     the module's math labels, laid out once off screen to measure them) and init (the module's own init). With
     done, the labels are measured by a ResizeObserver when the browser next lays out the page, and done runs after;
     a synchronous measurement would make the browser lay out every pending change on the page at once. */
  FP.prepare = function (done) {
    var t0 = performance.now();
    if (!this.spec) throw new Error('figure module "' + this.name + '" is not registered');
    if (!palette) { var tp = performance.now(); readPalette(); Kit.pageSetupMs += performance.now() - tp; }
    this.tex = texOf(this.name);
    var canvas = this.canvas = document.createElement('canvas');
    canvas.setAttribute('role', 'img');
    var cap = this.el.parentElement.querySelector('figcaption');
    canvas.setAttribute('aria-label', cap ? cap.textContent.replace(/\s+/g, ' ').trim() : this.name);
    this.el.appendChild(canvas);
    this.labelsEl = document.createElement('div');
    this.labelsEl.className = 'viz-labels';
    this.labelsEl.setAttribute('aria-hidden', 'true');
    this.el.appendChild(this.labelsEl);
    this.prepared = true;
    if (!done || typeof ResizeObserver !== 'function' || !Object.keys(this.tex).length) {
      this.measureLabels();
      this.stats.prepare = performance.now() - t0;
      if (done) done();
      return;
    }
    var self = this, m = this.labelBox();
    var ro = new ResizeObserver(function () {
      ro.disconnect();
      var t1 = performance.now();
      self.readLabelBox(m);
      self.stats.prepare += performance.now() - t1;
      done();
    });
    for (var i = 0; i < m.els.length; i++) ro.observe(m.els[i]);
    this.stats.prepare = performance.now() - t0;
  };
  FP.init = function () {
    if (!this.prepared) this.prepare();
    var t0 = performance.now();
    var canvas = this.canvas;
    this.ctx = canvas.getContext('2d');
    this.c = palette;
    this.resize(this.el.clientWidth, this.el.clientHeight);
    var draw = this.spec.init(this);
    if (typeof draw !== 'function') throw new Error('figure "' + this.name + '": init(fig) must return its draw function');
    this.drawFn = draw;
    if (this.spec.reset !== false && (this.controls.length || this.drags.length || this.planes.some(function (p) { return p.panZoom; }))) this.addReset();
    if (this.drags.length || this.probes.length || this.planes.some(function (p) { return p.panZoom; })) this.bindPointer();
    this.ready = true;
    this.el.setAttribute('data-state', 'ready');
    this.stats.init = performance.now() - t0;
  };

  FP.resize = function (w, h) {
    var dpr = Math.min(2, global.devicePixelRatio || 1);
    if (w === this.w && h === this.h && dpr === this.dpr) return;
    this.panelW = {};
    this.w = w; this.h = h; this.dpr = dpr;
    this.canvas.width = Math.max(1, Math.round(w * dpr));
    this.canvas.height = Math.max(1, Math.round(h * dpr));
    this.dirty = true;
    this.settling = true;
  };

  /* Far from the window a figure gives back its canvas memory and its domain-coloring caches; its own state stays.
     It gets them back the next time it is on screen. */
  FP.release = function () {
    if (this.released || !this.ready) return;
    this.released = true;
    this.canvas.width = 1;
    this.canvas.height = 1;
    this.w = -1;
    this.h = -1;
    for (var i = 0; i < this.planes.length; i++) this.planes[i].domainCache = {};
    if (this.onRelease) this.onRelease();
  };
  FP.restore = function () {
    if (!this.released) return;
    this.released = false;
    var r = this.el.getBoundingClientRect();
    this.resize(r.width, r.height);
    if (this.onRestore) this.onRestore();
  };

  FP.needsFrame = function () {
    if (this.dirty || this.wantMore) return true;
    if (this.continuous && !Kit.reducedMotion) return true;
    for (var i = 0; i < this.players.length; i++) if (this.players[i].playing) return true;
    for (var j = 0; j < this.tweens.length; j++) if (this.tweens[j].active) return true;
    return false;
  };

  FP.frame = function (now) {
    var t0 = performance.now();
    var dt = this.lastNow ? Math.min(0.05, (now - this.lastNow) / 1000) : 0;
    this.lastNow = now;
    this.dt = dt;
    var moving = this.continuous && !Kit.reducedMotion;
    for (var i = 0; i < this.players.length; i++) if (this.players[i].advance(dt)) moving = true;
    for (var j = 0; j < this.tweens.length; j++) if (this.tweens[j].advance(dt)) moving = true;
    if (moving) this.t += dt;
    this.dirty = false;
    this.wantMore = false;
    var ctx = this.ctx;
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    ctx.clearRect(0, 0, this.w, this.h);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    this.occReset();
    this.autoCount = {};
    if (this.jobs.length) this.runJobs();
    for (var p = 0; p < this.planes.length; p++) this.planes[p].update();
    if (this.probes.length) this.resolveProbes();
    for (var l = 0; l < this.labelList.length; l++) this.labelList[l].used = false;
    // Draggable points count as drawn, so legends and panels placed automatically keep clear of them.
    for (var d = 0; d < this.drags.length; d++) {
      var dh = this.drags[d];
      if (!dh.hidden) this.occRect(dh.plane.X(dh.x) - dh.r - 4, dh.plane.Y(dh.y) - dh.r - 4, 2 * dh.r + 8, 2 * dh.r + 8);
    }
    this.drawFn(this);
    if (this.probes.length) this.drawProbes();
    this.drawHandles();
    this.writeLabels();
    for (var q = 0; q < this.players.length; q++) if (this.players[q].needSync) { this.players[q].needSync = false; this.players[q].sync(); }
    var ms = performance.now() - t0;
    var st = this.stats;
    st.frames++;
    st.total += ms;
    if (ms > st.max) st.max = ms;
    if (st.frames === 1) st.first = ms;
    else if (!this.settling) { st.ring[st.n % st.ring.length] = ms; st.n++; }
    this.settling = false;
  };

  /* Ask for frames: once (redraw) or continuously while on screen (animate). */
  FP.redraw = function () { this.dirty = true; schedule(); };
  FP.animate = function (on) { this.continuous = on !== false; schedule(); };
  FP.more = function () { this.wantMore = true; };

  /* ---------------- Colors and canvas helpers (screen coordinates, CSS pixels) ---------------- */

  FP.color = function (name, alpha) {
    var c = (palette && palette[name]) || name;
    return alpha == null || alpha === 1 ? c : rgba(c, alpha);
  };
  FP.font = function (size, weight, mono) { return (weight || 500) + ' ' + (size || 12) + 'px ' + (mono ? monoFamily : fontFamily); };
  /* Every assignment to ctx.font makes the browser bring the canvas element's style up to date, which costs a style
     recalculation of the page whenever anything on it changed. So the kit sets a font only when the context holds
     another one (read back through ctx.font, so a module's own assignments are seen). */
  FP.setFont = function (f) {
    var ctx = this.ctx, norm = this.fontNorm[f];
    if (norm !== undefined && ctx.font === norm) return;
    ctx.font = f;
    this.fontNorm[f] = ctx.font;
  };
  FP.stroke = function (style) {
    var ctx = this.ctx;
    ctx.strokeStyle = this.color(style.color || 'fg', style.alpha);
    ctx.lineWidth = style.width || 2;
    ctx.setLineDash(style.dash || []);
  };
  FP.line = function (x0, y0, x1, y1, style) {
    style = style || {};
    var ctx = this.ctx;
    this.stroke(style);
    ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke();
    ctx.setLineDash([]);
  };
  FP.circle = function (x, y, r, style) {
    style = style || {};
    var ctx = this.ctx;
    ctx.beginPath(); ctx.arc(x, y, r, 0, 2 * Math.PI);
    if (style.fill !== false) { ctx.fillStyle = this.color(style.fill || style.color || 'fg', style.alpha); ctx.fill(); }
    if (style.ring) { ctx.lineWidth = style.ringWidth || 2; ctx.strokeStyle = this.color(style.ring); ctx.setLineDash([]); ctx.stroke(); }
  };
  FP.rect = function (x, y, w, h, style) {
    style = style || {};
    var ctx = this.ctx;
    if (style.fill) { ctx.fillStyle = this.color(style.fill, style.alpha); ctx.fillRect(x, y, w, h); }
    if (style.color) { this.stroke(style); ctx.strokeRect(x, y, w, h); ctx.setLineDash([]); }
  };
  /* Characters canvas text may use: those of the page's own text fonts that the kit prepares (printable ASCII,
     Latin-1, Greek, punctuation, arrows, super- and subscripts, and the common operators of WARM_TEXT). Any other
     character sends the browser looking through the system's fonts on first use, about 70 ms at 4x CPU slowdown;
     such symbols belong in math labels. The kit warns once per character. */
  var SAFE_TEXT = /^[\u0020-\u007e\u00a0-\u00ff\u0391-\u03c9\u03d1\u03d5\u03f5\u2010-\u2027\u2030-\u203a\u2070-\u209c\u2190-\u2194\u2032\u2033\u2212\u2213\u2248\u2260\u2264\u2265\u221e\u221a\u2211\u220f\u222b\u2202\u2208\u2209]*$/;
  var warnedChars = {};
  function checkText(fig, str) {
    if (SAFE_TEXT.test(str)) return;
    for (var ch of str) {
      if (SAFE_TEXT.test(ch) || warnedChars[ch]) continue;
      warnedChars[ch] = true;
      console.warn('figure "' + fig.name + '": canvas text uses "' + ch + '" (U+' + ch.codePointAt(0).toString(16).toUpperCase() + '), outside the text fonts of the page; the browser searches the system fonts for it on first use. Put symbols in math labels (tex).');
    }
  }
  FP.text = function (str, x, y, style) {
    style = style || {};
    var ctx = this.ctx;
    if (typeof str === 'string') checkText(this, str);
    var size = style.size || 12, weight = style.weight || 500;
    this.setFont(this.font(size, weight, style.mono));
    ctx.fillStyle = this.color(style.color || 'fg', style.alpha);
    ctx.textAlign = style.align || 'left';
    ctx.textBaseline = style.baseline || 'alphabetic';
    if (style.mono && SCRIPT_RE.test(str)) this.scriptText(String(str), x, y, size, weight);
    else ctx.fillText(str, x, y);
  };
  /* Monospace faces (Cascadia Mono, Consolas) lack most superscript and subscript digits, and the browser takes them
     from another face with other metrics. So in monospace text the kit draws them itself: the plain digit, smaller,
     raised or lowered. fig.measure gives the same width. */
  var SCRIPT_RE = /[⁰¹²³⁴-⁻₀-₋]/;
  var SCRIPT_OF = {};
  (function () {
    var k;
    for (k in SUP) SCRIPT_OF[SUP[k]] = [k, 1];
    for (k in SUB) SCRIPT_OF[SUB[k]] = [k, -1];
  })();
  function scriptRuns(str) {
    var runs = [], cur = '', kind = 0;
    for (var i = 0; i < str.length; i++) {
      var m = SCRIPT_OF[str[i]], k = m ? m[1] : 0, ch = m ? m[0] : str[i];
      if (k !== kind && cur) { runs.push([cur, kind]); cur = ''; }
      kind = k;
      cur += ch;
    }
    if (cur) runs.push([cur, kind]);
    return runs;
  }
  var SCRIPT_SCALE = 0.72;
  FP.scriptWidth = function (runs, size, weight) {
    var mc = measureContext(), w = 0;
    for (var i = 0; i < runs.length; i++) {
      var f = this.font(runs[i][1] ? size * SCRIPT_SCALE : size, weight, true);
      if (mc) { if (measureFont !== f) { mc.font = f; measureFont = f; } w += mc.measureText(runs[i][0]).width; }
      else { this.setFont(f); w += this.ctx.measureText(runs[i][0]).width; }
    }
    if (!mc) this.setFont(this.font(size, weight, true));
    return w;
  };
  FP.scriptText = function (str, x, y, size, weight) {
    var ctx = this.ctx, runs = scriptRuns(str), align = ctx.textAlign, base = ctx.textBaseline;
    var w = this.scriptWidth(runs, size, weight);
    var x0 = align === 'right' || align === 'end' ? x - w : align === 'center' ? x - w / 2 : x;
    // The alphabetic baseline of the text, from the requested baseline.
    var a1 = ctx.measureText('0').actualBoundingBoxAscent;
    ctx.textBaseline = 'alphabetic';
    var ya = y + ctx.measureText('0').actualBoundingBoxAscent - a1;
    ctx.textAlign = 'left';
    for (var i = 0; i < runs.length; i++) {
      var k = runs[i][1];
      this.setFont(this.font(k ? size * SCRIPT_SCALE : size, weight, true));
      ctx.fillText(runs[i][0], x0, k > 0 ? ya - 0.36 * size : k < 0 ? ya + 0.16 * size : ya);
      x0 += ctx.measureText(runs[i][0]).width;
    }
    this.setFont(this.font(size, weight, true));
    ctx.textAlign = align;
    ctx.textBaseline = base;
  };
  FP.arrow = function (x0, y0, x1, y1, style) {
    style = style || {};
    var ctx = this.ctx;
    var head = style.head || 9;
    var dx = x1 - x0, dy = y1 - y0, len = Math.hypot(dx, dy);
    if (len < 0.5) return;
    var ux = dx / len, uy = dy / len;
    var bx = x1 - ux * head * 0.9, by = y1 - uy * head * 0.9;
    this.line(x0, y0, bx, by, style);
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x1 - ux * head - uy * head * 0.45, y1 - uy * head + ux * head * 0.45);
    ctx.lineTo(x1 - ux * head + uy * head * 0.45, y1 - uy * head - ux * head * 0.45);
    ctx.closePath();
    ctx.fillStyle = this.color(style.color || 'fg', style.alpha);
    ctx.fill();
  };

  /* Math label: a KaTeX rendering of the module's tex[key], placed as an HTML overlay. anchor names the side of the
     label that sits at (x, y): 'c', 'n', 's', 'e', 'w', 'ne', 'nw', 'se', 'sw'. */
  var AX = { c: -50, n: -50, s: -50, e: -100, w: 0, ne: -100, nw: 0, se: -100, sw: 0 };
  var AY = { c: -50, n: 0, s: -100, e: -50, w: -50, ne: 0, nw: 0, se: -100, sw: -100 };
  FP.label = function (key, x, y, opts) {
    opts = opts || {};
    var id = opts.id || key;
    var lab = this.labelMap[id];
    if (!lab) {
      var html = this.tex[key];
      if (html == null) throw new Error('figure "' + this.name + '" has no tex.' + key);
      var el = document.createElement('div');
      el.className = 'viz-label';
      el.innerHTML = html;
      el.hidden = true;
      this.labelsEl.appendChild(el);
      lab = { el: el, used: false, shown: false, tf: '', color: '', size: '', alpha: '' };
      this.labelMap[id] = lab;
      this.labelList.push(lab);
    }
    lab.used = true;
    // The label's style is written after draw returns (writeLabels), so no DOM write falls between canvas calls.
    var a = opts.anchor || 'c';
    lab.nTf = 'translate(' + Math.round((x + (opts.dx || 0)) * 2) / 2 + 'px,' + Math.round((y + (opts.dy || 0)) * 2) / 2 + 'px) translate(' + AX[a] + '%,' + AY[a] + '%)';
    lab.nColor = opts.color ? (PALETTE_NAMES.indexOf(opts.color) >= 0 ? 'var(--viz-' + opts.color + ')' : opts.color) : '';
    lab.nSize = opts.size ? opts.size + 'px' : '';
    lab.nAlpha = opts.alpha == null || opts.alpha >= 1 ? '' : String(Math.max(0, opts.alpha));
  };
  FP.writeLabels = function () {
    for (var k = 0; k < this.labelList.length; k++) {
      var lab = this.labelList[k], st = lab.el.style;
      if (lab.used) {
        if (lab.nTf !== lab.tf) { st.transform = lab.nTf; lab.tf = lab.nTf; }
        if (lab.nColor !== lab.color) { st.color = lab.nColor; lab.color = lab.nColor; }
        if (lab.nSize !== lab.size) { st.fontSize = lab.nSize; lab.size = lab.nSize; }
        if (lab.nAlpha !== lab.alpha) { st.opacity = lab.nAlpha; lab.alpha = lab.nAlpha; }
      }
      if (lab.used !== lab.shown) { lab.el.hidden = !lab.used; lab.shown = lab.used; }
    }
  };

  /* ---------------- Plane: world coordinates on a rectangle of the stage ---------------- */

  /* A box edge is a number (a fraction of the stage) or a string: '48px' from the left or top, '-48px' from the
     right or bottom, '50%', '50% + 10px', '100% - 44px'. */
  var edgeCache = {};
  function edgeAt(e, size) {
    if (typeof e === 'number') return e * size;
    var p = edgeCache[e];
    if (!p) {
      var m = /^\s*(?:(-?\d*\.?\d+)%)?\s*(?:([+-])?\s*(\d*\.?\d+)px)?\s*$/.exec(e);
      if (!m || (m[1] == null && m[3] == null)) throw new Error('bad plane box edge "' + e + '"');
      p = edgeCache[e] = [m[1] == null ? (m[2] === '-' ? 1 : 0) : Number(m[1]) / 100, m[3] == null ? 0 : Number(m[3]) * (m[2] === '-' ? -1 : 1)];
    }
    return p[0] * size + p[1];
  }
  function Plane(fig, opts) {
    this.fig = fig;
    var pad = opts.pad == null ? { t: 14, r: 16, b: 28, l: 44 } : typeof opts.pad === 'number' ? { t: opts.pad, r: opts.pad, b: opts.pad, l: opts.pad } : opts.pad;
    this.pad = { t: pad.t || 0, r: pad.r || 0, b: pad.b || 0, l: pad.l || 0 };
    this.frac = opts.box || null;
    this.xlog = Boolean(opts.xLog);
    this.ylog = Boolean(opts.yLog);
    if ((this.xlog && !(opts.x[0] > 0)) || (this.ylog && !(opts.y[0] > 0))) throw new Error('figure "' + fig.name + '": a log axis needs a window above 0');
    if (opts.equal && (this.xlog || this.ylog)) throw new Error('figure "' + fig.name + '": equal and a log axis do not mix');
    this.init = { x0: opts.x[0], x1: opts.x[1], y0: opts.y[0], y1: opts.y[1] };
    this.view = { x0: opts.x[0], x1: opts.x[1], y0: opts.y[0], y1: opts.y[1] };
    this.equal = Boolean(opts.equal);
    this.panZoom = Boolean(opts.panZoom);
    this.box = { l: 0, t: 0, r: 0, b: 0, w: 0, h: 0 };
    this.outer = { l: 0, t: 0, r: 0, b: 0, w: 0, h: 0 };
    this.sx = 1; this.sy = 1;
    this.u0 = 0; this.w0 = 0;   // the window's left and bottom in axis units (log10 of the value on a log axis)
    this.v = { x0: 0, x1: 0, y0: 0, y1: 0 };
    this.domainCache = {};
    this.update();
  }
  var PP = Plane.prototype;
  PP.setBox = function (box) { this.frac = box; this.update(); return this; };
  PP.update = function () {
    var f = this.fig, fr = this.frac, L, T, R, B;
    if (!fr) { L = 0; T = 0; R = f.w; B = f.h; }
    else if (typeof fr === 'function') { var q = fr(f.w, f.h); L = q[0]; T = q[1]; R = q[2]; B = q[3]; }
    else { L = edgeAt(fr[0], f.w); T = edgeAt(fr[1], f.h); R = edgeAt(fr[2], f.w); B = edgeAt(fr[3], f.h); }
    var o = this.outer;
    o.l = L; o.t = T; o.r = R; o.b = B; o.w = R - L; o.h = B - T;
    var b = this.box;
    b.l = L + this.pad.l; b.t = T + this.pad.t; b.r = R - this.pad.r; b.b = B - this.pad.b;
    b.w = Math.max(1, b.r - b.l); b.h = Math.max(1, b.b - b.t);
    var v = this.v, vw = this.view;
    v.x0 = vw.x0; v.x1 = vw.x1; v.y0 = vw.y0; v.y1 = vw.y1;
    if (this.equal) {
      var sx = b.w / (v.x1 - v.x0), sy = b.h / (v.y1 - v.y0);
      if (sx > sy) { var cx = (v.x0 + v.x1) / 2, hw = b.w / sy / 2; v.x0 = cx - hw; v.x1 = cx + hw; }
      else { var cy = (v.y0 + v.y1) / 2, hh = b.h / sx / 2; v.y0 = cy - hh; v.y1 = cy + hh; }
    }
    var X0 = this.xlog ? Math.log10(v.x0) : v.x0, X1 = this.xlog ? Math.log10(v.x1) : v.x1;
    var Y0 = this.ylog ? Math.log10(v.y0) : v.y0, Y1 = this.ylog ? Math.log10(v.y1) : v.y1;
    this.u0 = X0; this.w0 = Y0;
    this.sx = b.w / (X1 - X0);
    this.sy = b.h / (Y1 - Y0);
  };
  PP.X = function (x) { return this.box.l + ((this.xlog ? Math.log10(x) : x) - this.u0) * this.sx; };
  PP.Y = function (y) { return this.box.b - ((this.ylog ? Math.log10(y) : y) - this.w0) * this.sy; };
  PP.toWorld = function (px, py) {
    var u = this.u0 + (px - this.box.l) / this.sx, w = this.w0 + (this.box.b - py) / this.sy;
    return [this.xlog ? pow10(u) : u, this.ylog ? pow10(w) : w];
  };
  /* World x at d pixels right of the box's left edge. */
  PP.wx = function (d) { var u = this.u0 + d / this.sx; return this.xlog ? pow10(u) : u; };
  PP.inside = function (px, py) { var b = this.box; return px >= b.l && px <= b.r && py >= b.t && py <= b.b; };
  /* Runs fn clipped to the plane's box. The clip region is its own Path2D, so the path being built survives. */
  PP.clip = function (fn) {
    var ctx = this.fig.ctx, b = this.box;
    var r = new Path2D();
    r.rect(b.l, b.t, b.w, b.h);
    ctx.save(); ctx.clip(r);
    try { fn(); } finally { ctx.restore(); }
  };
  function ticks(lo, hi, step) {
    var out = [];
    if (!(step > 0) || (hi - lo) / step > 5000) throw new Error('tick step ' + step + ' does not fit the range [' + lo + ', ' + hi + ']');
    var start = Math.ceil(lo / step - 1e-9) * step;
    for (var v = start; v <= hi + step * 1e-9; v += step) out.push(Math.abs(v) < step * 1e-9 ? 0 : v);
    return out;
  }
  /* Log ticks: decades always; 2 and 5 (or every digit) when a decade is wide; every n-th decade when it is narrow.
     Ticks that are not labeled are minor. */
  function logTicks(lo, hi, ppd, format, noText) {
    var out = [];
    var k0 = Math.floor(Math.log10(lo) - 1e-9), k1 = Math.ceil(Math.log10(hi) + 1e-9);
    if (k1 - k0 > 400) throw new Error('log axis spans ' + (k1 - k0) + ' decades');
    var labeled = ppd >= 220 ? [1, 2, 5] : ppd >= 120 ? [1, 3] : [1];
    var every = ppd >= 26 ? 1 : Math.ceil(26 / ppd);
    for (var k = k0; k <= k1; k++) {
      var p = Math.pow(10, Math.abs(k));
      for (var m = 1; m <= 9; m++) {
        var x = k < 0 ? m / p : m * p;
        if (x < lo * (1 - 1e-9) || x > hi * (1 + 1e-9)) continue;
        var major = m === 1 ? ((k % every) + every) % every === 0 : every === 1 && labeled.indexOf(m) >= 0;
        if (!major && ppd < 40) continue;
        out.push({ at: x, minor: !major, text: major && !noText ? (format ? format(x) : fmt.compact(x)) : null });
      }
    }
    return out;
  }
  PP.xStep = function (target) { return M.niceStep(this.v.x1 - this.v.x0, this.box.w, target || 90); };
  PP.yStep = function (target) { return M.niceStep(this.v.y1 - this.v.y0, this.box.h, target || 60); };
  /* The ticks of one axis as a list of { at, text, tex, minor }: custom ticks (numbers, [value, 'text'], or
     { at, text } or { at, tex }), log ticks, or nice linear steps. */
  PP.tickList = function (axis, opts, noText) {
    opts = opts || {};
    var isX = axis === 'x', v = this.v;
    var lo = Math.min(isX ? v.x0 : v.y0, isX ? v.x1 : v.y1), hi = Math.max(isX ? v.x0 : v.y0, isX ? v.x1 : v.y1);
    var custom = isX ? opts.xTicks : opts.yTicks;
    var format = (isX ? opts.xFormat : opts.yFormat) || opts.format;
    var out = [], i;
    if (custom) {
      var tol = (hi - lo) * 1e-9;
      for (i = 0; i < custom.length; i++) {
        var c = custom[i], t = typeof c === 'number' ? { at: c } : Array.isArray(c) ? { at: c[0], text: c[1] } : c;
        if (!(t.at >= lo - tol && t.at <= hi + tol)) continue;
        if (t.text == null && t.tex == null && !noText) t = { at: t.at, text: format ? format(t.at) : fmt.compact(t.at), minor: t.minor };
        out.push(t);
      }
      return out;
    }
    if (isX ? this.xlog : this.ylog) return logTicks(lo, hi, isX ? this.sx : this.sy, format, noText);
    var step = (isX ? opts.xStep : opts.yStep) || (isX ? this.xStep() : this.yStep());
    var vals = ticks(lo, hi, step), f = noText ? null : format ? function (x) { return format(x, step); } : fmt.step(step);
    for (i = 0; i < vals.length; i++) out.push({ at: vals[i], text: f ? f(vals[i]) : null });
    return out;
  };
  PP.grid = function (opts) {
    opts = opts || {};
    var f = this.fig, ctx = f.ctx, b = this.box;
    var xs = this.tickList('x', opts, true), ys = this.tickList('y', opts, true);
    ctx.lineWidth = 1;
    ctx.setLineDash([]);
    for (var pass = 0; pass < 2; pass++) {
      var minor = pass === 1, any = false;
      ctx.strokeStyle = f.color(opts.color || 'grid', (opts.alpha == null ? 1 : opts.alpha) * (minor ? 0.5 : 1));
      ctx.beginPath();
      for (var i = 0; i < xs.length; i++) if (Boolean(xs[i].minor) === minor) { var px = Math.round(this.X(xs[i].at)) + 0.5; ctx.moveTo(px, b.t); ctx.lineTo(px, b.b); any = true; }
      for (var j = 0; j < ys.length; j++) if (Boolean(ys[j].minor) === minor) { var py = Math.round(this.Y(ys[j].at)) + 0.5; ctx.moveTo(b.l, py); ctx.lineTo(b.r, py); any = true; }
      if (any) ctx.stroke();
    }
  };
  /* Axes cross at origin (default (0, 0), held inside the view), or sit on the box's edges: edge: true for both,
     or xAt: 'bottom', yAt: 'left' for one. Tick labels are canvas text (or math labels for { at, tex } ticks); a
     label that would overlap its neighbor or leave the stage is moved inside or skipped. */
  PP.axes = function (opts) {
    opts = opts || {};
    var f = this.fig, ctx = f.ctx, b = this.box, v = this.v;
    var yRight = opts.yAt === 'right';
    var xEdge = opts.edge || opts.xAt === 'bottom', yEdge = !yRight && (opts.edge || opts.yAt === 'left');
    var ox = opts.origin ? opts.origin[0] : this.xlog ? v.x0 : 0, oy = opts.origin ? opts.origin[1] : this.ylog ? v.y0 : 0;
    var ax = clamp(ox, v.x0, v.x1), ay = clamp(oy, v.y0, v.y1);
    var px = yRight ? Math.round(b.r) + 0.5 : yEdge ? Math.round(b.l) - 0.5 : Math.round(this.X(ax)) + 0.5, py = xEdge ? Math.round(b.b) + 0.5 : Math.round(this.Y(ay)) + 0.5;
    var cname = opts.color || 'muted', col = f.color(cname);
    ctx.strokeStyle = col; ctx.lineWidth = 1; ctx.setLineDash([]);
    ctx.beginPath();
    if (opts.x !== false) { ctx.moveTo(b.l, py); ctx.lineTo(b.r, py); }
    if (opts.y !== false) { ctx.moveTo(px, b.t); ctx.lineTo(px, b.b); }
    ctx.stroke();
    var size = opts.size || 11.5;
    if (opts.xLabel) {
      var xs = f.labelSize(opts.xLabel, size + 1.5);
      f.label(opts.xLabel, b.r - 2, py - 5, { anchor: 'se', color: cname, size: size + 1.5, id: f.autoId('ax', opts.xLabel) });
      f.occRect(b.r - 2 - xs.w, py - 5 - xs.h, xs.w, xs.h);
    }
    if (opts.yLabel) {
      var ys = f.labelSize(opts.yLabel, size + 1.5);
      if (yRight) {
        f.label(opts.yLabel, px - 7, b.t + 1, { anchor: 'ne', color: cname, size: size + 1.5, id: f.autoId('ax', opts.yLabel) });
        f.occRect(px - 7 - ys.w, b.t + 1, ys.w, ys.h);
      } else {
        f.label(opts.yLabel, px + 7, b.t + 1, { anchor: 'nw', color: cname, size: size + 1.5, id: f.autoId('ax', opts.yLabel) });
        f.occRect(px + 7, b.t + 1, ys.w, ys.h);
      }
    }
    if (opts.ticks === false) return;
    var corner = false, i, t;
    f.setFont(f.font(size, 500));
    if (opts.y !== false) {
      var yt = this.tickList('y', opts);
      var left = !yRight && (yEdge || px - 6 >= 22), outside = yEdge || yRight;
      ctx.beginPath();
      for (i = 0; i < yt.length; i++) {
        var ty = Math.round(this.Y(yt[i].at)) + 0.5, len = yt[i].minor ? 2 : 3;
        if (yRight) { ctx.moveTo(px, ty); ctx.lineTo(px + len + 1, ty); }
        else if (yEdge) { ctx.moveTo(px - len - 1, ty); ctx.lineTo(px, ty); } else { ctx.moveTo(px - len, ty); ctx.lineTo(px + len, ty); }
      }
      ctx.stroke();
      ctx.fillStyle = col; ctx.textAlign = left ? 'right' : 'left'; ctx.textBaseline = 'middle';
      var lastY = Infinity;
      for (i = 0; i < yt.length; i++) {
        t = yt[i];
        if (t.minor) continue;
        if (!outside && opts.x !== false && t.at === ay && opts.skipOrigin !== false) continue;
        var ly = this.Y(t.at);
        if (outside ? (ly < b.t - 1 || ly > b.b + 1) : (ly < b.t + 4 || ly > b.b - 4)) continue;
        if (Math.abs(lastY - ly) < size + 2) continue;
        var lx = left ? px - 6 : px + 6;
        if (t.tex) f.label(t.tex, lx, ly, { anchor: left ? 'e' : 'w', color: cname, size: size + 1.5, id: f.autoId('tk', t.tex) });
        else ctx.fillText(t.text, lx, ly);
        lastY = ly;
        if (yEdge && ly > b.b - size) corner = true;
      }
    }
    if (opts.x !== false) {
      var xt = this.tickList('x', opts);
      var below = xEdge || py + 4 + size <= f.h;
      ctx.strokeStyle = col;
      ctx.beginPath();
      for (i = 0; i < xt.length; i++) {
        var tx = Math.round(this.X(xt[i].at)) + 0.5, l2 = xt[i].minor ? 2 : 3;
        if (xEdge) { ctx.moveTo(tx, py); ctx.lineTo(tx, py + l2 + 1); } else { ctx.moveTo(tx, py - l2); ctx.lineTo(tx, py + l2); }
      }
      ctx.stroke();
      f.setFont(f.font(size, 500));
      ctx.fillStyle = col; ctx.textAlign = 'center'; ctx.textBaseline = below ? 'top' : 'bottom';
      var reach = corner ? px : -Infinity;
      for (i = 0; i < xt.length; i++) {
        t = xt[i];
        if (t.minor) continue;
        if (!xEdge && opts.y !== false && t.at === ax && opts.skipOrigin !== false) continue;
        var cx = this.X(t.at);
        if (cx < b.l - 1 || cx > b.r + 1) continue;
        if (!xEdge && cx < b.l + 4 && t.at !== v.x0) continue;
        var half = (t.tex ? f.labelSize(t.tex, size + 1.5).w : ctx.measureText(t.text).width) / 2;
        cx = clamp(cx, half + 2, f.w - half - 2);
        if (cx - half < reach + 6) continue;
        var yy = below ? py + 5 : py - 5;
        if (t.tex) f.label(t.tex, cx, yy, { anchor: below ? 'n' : 's', color: cname, size: size + 1.5, id: f.autoId('tk', t.tex) });
        else ctx.fillText(t.text, cx, yy);
        reach = cx + half;
      }
    }
  };
  /* A function y = f(x), sampled adaptively: each piece is split while its midpoint is more than half a pixel off
     the chord, up to six times. Non-finite values break the curve. On a log x axis the samples are even in log x. */
  PP.plot = function (fn, style) {
    style = style || {};
    var f = this.fig, ctx = f.ctx, self = this, lx = this.xlog;
    var a = Math.max(style.from == null ? -Infinity : style.from, this.v.x0);
    var b = Math.min(style.to == null ? Infinity : style.to, this.v.x1);
    if (!(b > a)) return;
    var ua = lx ? Math.log10(a) : a, ub = lx ? Math.log10(b) : b;
    var n = Math.max(8, Math.ceil((ub - ua) * this.sx / (style.step || 5)));
    var maxDepth = style.depth == null ? 6 : style.depth;
    var lim = 4 * (f.h + f.w);
    var penDown = false, lastX = 0, lastY = 0, bl = this.box.l, u0 = this.u0, sx = this.sx;
    var at = lx ? pow10 : function (u) { return u; };
    f.stroke(style);
    ctx.beginPath();
    function put(u, y) {
      if (!isFinite(y)) { penDown = false; return; }
      var px = bl + (u - u0) * sx, py = clamp(self.Y(y), -lim, lim);
      if (penDown) { ctx.lineTo(px, py); f.occSeg(lastX, lastY, px, py); } else { ctx.moveTo(px, py); penDown = true; }
      lastX = px; lastY = py;
    }
    function seg(x0, y0, x1, y1, depth) {
      var xm = (x0 + x1) / 2, ym = fn(at(xm));
      if (depth < maxDepth) {
        var bad = !isFinite(y0) || !isFinite(y1) || !isFinite(ym);
        var off = bad ? Infinity : Math.abs((ym - (y0 + y1) / 2) * self.sy);
        if (off > 0.5 && (x1 - x0) * self.sx > 0.25) {
          seg(x0, y0, xm, ym, depth + 1);
          seg(xm, ym, x1, y1, depth + 1);
          return;
        }
      }
      put(x1, y1);
    }
    var x0 = ua, y0 = fn(a);
    put(x0, y0);
    for (var i = 1; i <= n; i++) {
      var x1 = ua + (ub - ua) * i / n, y1 = fn(at(x1));
      seg(x0, y0, x1, y1, 0);
      x0 = x1; y0 = y1;
    }
    this.clip(function () { ctx.stroke(); });
    ctx.setLineDash([]);
  };
  /* A polyline through points: an array of [x, y] pairs, or two arrays xs and ys. */
  PP.path = function (xs, ys, style) {
    if (!Array.isArray(ys) && !(ys && ys.length != null)) { style = ys; ys = null; }
    style = style || {};
    var f = this.fig, ctx = f.ctx;
    var n = xs.length, lastX = 0, lastY = 0;
    f.stroke(style);
    ctx.beginPath();
    for (var i = 0; i < n; i++) {
      var px = this.X(ys ? xs[i] : xs[i][0]), py = this.Y(ys ? ys[i] : xs[i][1]);
      if (i === 0) ctx.moveTo(px, py); else { ctx.lineTo(px, py); f.occSeg(lastX, lastY, px, py); }
      lastX = px; lastY = py;
    }
    if (style.close) ctx.closePath();
    var self = this;
    if (style.fill) { ctx.fillStyle = f.color(style.fill, style.fillAlpha == null ? 0.2 : style.fillAlpha); this.clip(function () { ctx.fill(); }); }
    if (style.color !== null) this.clip(function () { ctx.stroke(); });
    ctx.setLineDash([]);
    return self;
  };
  /* A staircase: value ys[i] from xs[i] to xs[i + 1], starting at y0 before xs[0]. xs is ascending. When more
     steps are in view than 1.5 per pixel (or columns: true), it draws one vertical stroke per pixel column from
     the lowest to the highest value in that column, which looks the same and costs one stroke per column. */
  PP.stairs = function (xs, ys, style) {
    style = style || {};
    var f = this.fig, ctx = f.ctx, v = this.v;
    var from = Math.max(v.x0, style.from == null ? -Infinity : style.from), to = Math.min(v.x1, style.to == null ? Infinity : style.to);
    var i0 = lowerBound(xs, from), i1 = upperBound(xs, to);
    var y = i0 > 0 ? ys[i0 - 1] : style.y0 || 0;
    f.stroke(style);
    ctx.beginPath();
    if (style.columns === true || (style.columns !== false && i1 - i0 > 1.5 * this.box.w)) {
      var b = this.box, w = style.width || 2;
      var c0 = Math.max(0, Math.floor(this.X(from) - b.l)), c1 = Math.min(Math.ceil(b.w), Math.ceil(this.X(to) - b.l));
      var i = i0;
      for (var c = c0; c < c1; c++) {
        var xb = this.wx(c + 1), lo = y, hi = y;
        while (i < i1 && xs[i] < xb) { y = ys[i]; if (y < lo) lo = y; if (y > hi) hi = y; i++; }
        var yl = this.Y(lo), yh = this.Y(hi);
        if (yl - yh < w) { var mid = (yl + yh) / 2; yl = mid + w / 2; yh = mid - w / 2; }
        ctx.moveTo(b.l + c + 0.5, yl); ctx.lineTo(b.l + c + 0.5, yh);
        f.occSeg(b.l + c, yl, b.l + c, yh);
      }
      ctx.lineCap = 'butt';
      this.clip(function () { ctx.stroke(); });
      ctx.lineCap = 'round';
      ctx.setLineDash([]);
      return this;
    }
    var lastX = this.X(from), lastY = this.Y(y);
    ctx.moveTo(lastX, lastY);
    for (var k = i0; k < i1; k++) {
      var px = this.X(xs[k]), pa = this.Y(y);
      ctx.lineTo(px, pa);
      y = ys[k];
      var pb = this.Y(y);
      ctx.lineTo(px, pb);
      f.occSeg(lastX, lastY, px, pa); f.occSeg(px, pa, px, pb);
      lastX = px; lastY = pb;
    }
    ctx.lineTo(this.X(to), this.Y(y));
    f.occSeg(lastX, lastY, this.X(to), lastY);
    this.clip(function () { ctx.stroke(); });
    ctx.setLineDash([]);
    return this;
  };
  /* One vertical stroke per pixel column of the box: fn(xa, xb, out, c) writes the lowest and highest value over
     [xa, xb] into out[0] and out[1] (leave NaN to skip the column). For any function too dense to draw as a line. */
  PP.columns = function (fn, style) {
    style = style || {};
    var f = this.fig, ctx = f.ctx, b = this.box, out = this.colOut || (this.colOut = [0, 0]);
    var w = style.width || 1.5, cols = Math.floor(b.w), xa = this.wx(0);
    f.stroke(style);
    ctx.beginPath();
    for (var c = 0; c < cols; c++) {
      var xb = this.wx(c + 1);
      out[0] = NaN; out[1] = NaN;
      fn(xa, xb, out, c);
      xa = xb;
      if (out[0] !== out[0] || out[1] !== out[1]) continue;
      var yl = this.Y(out[0]), yh = this.Y(out[1]);
      if (yl < yh) { var s = yl; yl = yh; yh = s; }
      if (yl - yh < w) { var mid = (yl + yh) / 2; yl = mid + w / 2; yh = mid - w / 2; }
      ctx.moveTo(b.l + c + 0.5, yl); ctx.lineTo(b.l + c + 0.5, yh);
      f.occSeg(b.l + c, yl, b.l + c, yh);
    }
    ctx.lineCap = 'butt';
    this.clip(function () { ctx.stroke(); });
    ctx.lineCap = 'round';
    ctx.setLineDash([]);
  };
  /* Stems of a discrete function: a line from y = base (default 0) to ys[i] at each xs[i] (ascending); ys may be a
     function of x. dot: r adds a dot at each tip. */
  PP.stems = function (xs, ys, style) {
    style = style || {};
    var f = this.fig, ctx = f.ctx, v = this.v, fnY = typeof ys === 'function';
    var i0 = lowerBound(xs, Math.max(v.x0, style.from == null ? -Infinity : style.from));
    var i1 = upperBound(xs, Math.min(v.x1, style.to == null ? Infinity : style.to));
    var yb = this.Y(style.base || 0), i, px, py;
    f.stroke(style);
    ctx.beginPath();
    for (i = i0; i < i1; i++) {
      px = this.X(xs[i]); py = this.Y(fnY ? ys(xs[i]) : ys[i]);
      ctx.moveTo(px, yb); ctx.lineTo(px, py);
      f.occSeg(px, yb, px, py);
    }
    this.clip(function () { ctx.stroke(); });
    ctx.setLineDash([]);
    if (style.dot) {
      ctx.beginPath();
      for (i = i0; i < i1; i++) {
        px = this.X(xs[i]); py = this.Y(fnY ? ys(xs[i]) : ys[i]);
        ctx.moveTo(px + style.dot, py); ctx.arc(px, py, style.dot, 0, 2 * Math.PI);
      }
      ctx.fillStyle = f.color(style.color || 'fg', style.alpha);
      this.clip(function () { ctx.fill(); });
    }
  };
  /* A rug or spectrum: a short vertical tick at each value of an ascending list (zero ordinates, primes), over the
     box's height or from y0 to y1 (world). start and end pick an index range, for example the first N. */
  PP.rug = function (values, style) {
    style = style || {};
    var f = this.fig, ctx = f.ctx, v = this.v, b = this.box;
    var i0 = Math.max(style.start || 0, lowerBound(values, Math.min(v.x0, v.x1)));
    var i1 = Math.min(style.end == null ? values.length : style.end, upperBound(values, Math.max(v.x0, v.x1)));
    var ya = style.y0 == null ? b.b : this.Y(style.y0), yb = style.y1 == null ? b.t : this.Y(style.y1);
    f.stroke({ color: style.color || 'teal', width: style.width || 1.4, alpha: style.alpha });
    ctx.beginPath();
    for (var i = i0; i < i1; i++) {
      var px = Math.round(this.X(values[i])) + 0.5;
      ctx.moveTo(px, ya); ctx.lineTo(px, yb);
      f.occSeg(px, ya, px, yb);
    }
    ctx.lineCap = 'butt';
    this.clip(function () { ctx.stroke(); });
    ctx.lineCap = 'round';
  };
  /* Shaded region between two functions (numbers or functions) on [a, b]; edges: true (or a style) also strokes
     both boundaries. */
  PP.fillBetween = function (fTop, fBottom, a, b, style) {
    style = style || {};
    var f = this.fig, ctx = f.ctx, lx = this.xlog;
    var top = typeof fTop === 'function' ? fTop : function () { return fTop; };
    var bot = typeof fBottom === 'function' ? fBottom : function () { return fBottom; };
    a = Math.max(a, this.v.x0); b = Math.min(b, this.v.x1);
    if (!(b > a)) return;
    var ua = lx ? Math.log10(a) : a, ub = lx ? Math.log10(b) : b;
    var n = Math.max(8, Math.ceil((ub - ua) * this.sx / 3)), i, x, y;
    var at = function (k) { var u = ua + (ub - ua) * k / n; return lx ? pow10(u) : u; };
    var tops = this.fbTop && this.fbTop.length > n ? this.fbTop : (this.fbTop = new Float64Array(n + 1));
    var bots = this.fbBot && this.fbBot.length > n ? this.fbBot : (this.fbBot = new Float64Array(n + 1));
    ctx.beginPath();
    for (i = 0; i <= n; i++) { x = at(i); y = top(x); tops[i] = this.Y(isFinite(y) ? y : 0); ctx[i ? 'lineTo' : 'moveTo'](this.X(x), tops[i]); }
    for (i = n; i >= 0; i--) { x = at(i); y = bot(x); bots[i] = this.Y(isFinite(y) ? y : 0); ctx.lineTo(this.X(x), bots[i]); }
    ctx.closePath();
    ctx.fillStyle = f.color(style.color || 'blue', style.alpha == null ? 0.18 : style.alpha);
    this.clip(function () { ctx.fill(); });
    for (i = 1; i <= n; i++) { var p0 = this.X(at(i - 1)), p1 = this.X(at(i)); f.occSeg(p0, tops[i - 1], p1, tops[i]); f.occSeg(p0, bots[i - 1], p1, bots[i]); }
    if (style.edges) {
      var es = typeof style.edges === 'object' ? style.edges : { color: style.color || 'blue', width: 1, alpha: 0.7 };
      f.stroke(es);
      ctx.beginPath();
      for (i = 0; i <= n; i++) ctx[i ? 'lineTo' : 'moveTo'](this.X(at(i)), tops[i]);
      for (i = 0; i <= n; i++) ctx[i ? 'lineTo' : 'moveTo'](this.X(at(i)), bots[i]);
      this.clip(function () { ctx.stroke(); });
      ctx.setLineDash([]);
    }
  };
  PP.segment = function (x0, y0, x1, y1, style) {
    var f = this.fig, a = this.X(x0), b = this.Y(y0), c = this.X(x1), d = this.Y(y1);
    this.clip(function () { f.line(a, b, c, d, style || {}); });
    f.occSeg(a, b, c, d);
  };
  PP.vline = function (x, style) { this.segment(x, this.v.y0, x, this.v.y1, style); };
  PP.hline = function (y, style) { this.segment(this.v.x0, y, this.v.x1, y, style); };
  PP.arrow = function (x0, y0, x1, y1, style) { this.fig.arrow(this.X(x0), this.Y(y0), this.X(x1), this.Y(y1), style); };
  PP.point = function (x, y, style) {
    style = style || {};
    var px = this.X(x), py = this.Y(y);
    if (!this.inside(px, py) && !style.unclipped) return;
    this.fig.circle(px, py, style.r || 4, { fill: style.color || 'fg', alpha: style.alpha, ring: style.ring === false ? null : (style.ring || 'stage'), ringWidth: style.ringWidth || 1.5 });
    this.fig.occSeg(px, py, px, py);
  };
  PP.text = function (str, x, y, style) { style = style || {}; this.fig.text(str, this.X(x) + (style.dx || 0), this.Y(y) + (style.dy || 0), style); };
  PP.label = function (key, x, y, opts) { this.fig.label(key, this.X(x), this.Y(y), opts); };
  /* A background and border for the plane's whole box, padding included: an inset panel over another plane. */
  PP.frame = function (style) {
    style = style || {};
    var f = this.fig, ctx = f.ctx, o = this.outer;
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(o.l + 0.5, o.t + 0.5, o.w - 1, o.h - 1, style.radius == null ? 4 : style.radius); else ctx.rect(o.l + 0.5, o.t + 0.5, o.w - 1, o.h - 1);
    ctx.fillStyle = f.color(style.fill || 'stage', style.alpha == null ? 0.94 : style.alpha);
    ctx.fill();
    if (style.color !== null) { f.stroke({ color: style.color || 'muted', width: style.width || 1, alpha: style.borderAlpha == null ? 0.55 : style.borderAlpha }); ctx.stroke(); }
    f.occRect(o.l, o.t, o.w, o.h);
  };
  /* The critical strip 0 < Re s < 1, lightly shaded with dashed edges, and the critical line Re s = 1/2 in violet
     over a stage-colored halo. opts: strip, line (false hides one), label (a tex key placed at the line's top). */
  PP.critical = function (opts) {
    opts = opts || {};
    var f = this.fig, ctx = f.ctx, b = this.box;
    if (opts.strip !== false) {
      var x0 = this.X(0), x1 = this.X(1);
      ctx.fillStyle = f.color('muted', opts.stripAlpha == null ? 0.1 : opts.stripAlpha);
      this.clip(function () { ctx.fillRect(x0, b.t, x1 - x0, b.h); });
      this.vline(0, { color: 'muted', width: 1, dash: [3, 4], alpha: 0.7 });
      this.vline(1, { color: 'muted', width: 1, dash: [3, 4], alpha: 0.7 });
    }
    if (opts.line !== false) {
      this.vline(0.5, { color: 'stage', width: (opts.width || 2) + 3, alpha: 0.6 });
      this.vline(0.5, { color: 'violet', width: opts.width || 2, dash: opts.dash });
      if (opts.label) this.label(opts.label, 0.5, this.v.y1, { anchor: 'nw', dx: 6, dy: 4, color: 'violet', id: f.autoId('cl', opts.label) });
    }
  };
  /* The nontrivial zeros 1/2 + i gamma from Kit.zeros inside the window (and their conjugates below 0 unless
     mirror: false). count: how many from the start of the list; sigma moves them off the line. */
  PP.zeros = function (opts) {
    opts = opts || {};
    var zs = Kit.zeros, v = this.v, i;
    var n = Math.min(opts.count == null ? zs.length : opts.count, zs.length), sigma = opts.sigma == null ? 0.5 : opts.sigma;
    var lo = Math.min(v.y0, v.y1), hi = Math.max(v.y0, v.y1);
    var style = { color: opts.color || 'teal', r: opts.r || 4, ring: opts.ring, ringWidth: opts.ringWidth || 1.5, alpha: opts.alpha };
    for (i = lowerBound(zs, Math.max(0, lo)); i < n && zs[i] <= hi; i++) this.point(sigma, zs[i], style);
    if (opts.mirror !== false && lo < 0) for (i = lowerBound(zs, Math.max(0, -hi)); i < n && zs[i] <= -lo; i++) this.point(sigma, -zs[i], style);
  };

  /* Domain coloring of a complex function w = f(z): hue is arg w, lightness is 0.5 + 0.42 tanh(0.7 log |w|) (zeros
     black, poles white, |w| = 1 at mid lightness), with faint bands at each doubling of |w|. The image is computed into cached offscreen canvases from a
     coarse grid of at most opts.coarse (default 400) samples down to opts.finest (default 2 CSS px), a few rows per frame within opts.budget ms (default 2.5), so a change
     shows at once and sharpens over the next frames. fn(x, y, out) writes Re w to out[0] and Im w to out[1].
     opts.rev is any value that changes when fn changes. */
  var HUE = (function () {
    var n = 1024, lut = new Float32Array(n * 3);
    for (var i = 0; i < n; i++) {
      var h = i / n * 6, k = Math.floor(h), f = h - k, r, g, b;
      switch (k) { case 0: r = 1; g = f; b = 0; break; case 1: r = 1 - f; g = 1; b = 0; break; case 2: r = 0; g = 1; b = f; break;
        case 3: r = 0; g = 1 - f; b = 1; break; case 4: r = f; g = 0; b = 1; break; default: r = 1; g = 0; b = 1 - f; }
      lut[3 * i] = r; lut[3 * i + 1] = g; lut[3 * i + 2] = b;
    }
    return lut;
  })();
  var INV_TAU = 1 / (2 * Math.PI);
  function domainColor(u, v, data, o, sat) {
    var m = Math.hypot(u, v);
    if (!isFinite(m)) { data[o] = data[o + 1] = data[o + 2] = 245; data[o + 3] = 255; return; }
    var a = Math.atan2(v, u) * INV_TAU; if (a < 0) a += 1;
    var hi = (a * 1024 | 0) % 1024 * 3;
    var lm = Math.log(m + 1e-300);
    var band = lm * 1.4426950408889634; band -= Math.floor(band);
    var l = (0.5 + 0.42 * Math.tanh(0.7 * lm)) * (0.86 + 0.14 * band);
    if (sat < 0) { data[o] = data[o + 1] = data[o + 2] = l * 255; data[o + 3] = 255; return; }
    var r = HUE[hi], g = HUE[hi + 1], b = HUE[hi + 2];
    r = 0.5 + (r - 0.5) * sat; g = 0.5 + (g - 0.5) * sat; b = 0.5 + (b - 0.5) * sat;
    if (l < 0.5) { var k = 2 * l; r *= k; g *= k; b *= k; }
    else { var k2 = 2 * l - 1; r += (1 - r) * k2; g += (1 - g) * k2; b += (1 - b) * k2; }
    data[o] = r * 255; data[o + 1] = g * 255; data[o + 2] = b * 255; data[o + 3] = 255;
  }
  PP.domain = function (fn, opts) {
    opts = opts || {};
    var f = this.fig, ctx = f.ctx, b = this.box, v = this.v;
    if (this.xlog || this.ylog) throw new Error('figure "' + f.name + '": domain coloring needs linear axes');
    var key = opts.key || 'main';
    var cache = this.domainCache[key] || (this.domainCache[key] = { sig: '', levels: [] });
    var finest = opts.finest || 2;
    var steps = [];
    var first = 8;
    while ((b.w / first) * (b.h / first) > (opts.coarse || 400)) first *= 2;
    for (var s = first; s > finest; s /= 2) steps.push(s);
    steps.push(finest);
    var sig = [opts.rev, v.x0, v.x1, v.y0, v.y1, Math.round(b.w), Math.round(b.h), finest, opts.mode, opts.saturation].join('|');
    if (sig !== cache.sig) {
      cache.sig = sig;
      cache.levels = steps.map(function (step) {
        var cols = Math.ceil(b.w / step), rows = Math.ceil(b.h / step);
        var cv = document.createElement('canvas'); cv.width = cols; cv.height = rows;
        var cx = cv.getContext('2d');
        return { step: step, cols: cols, rows: rows, canvas: cv, ctx: cx, img: cx.createImageData(cols, rows), row: 0, done: false, flushed: 0 };
      });
      cache.li = 0;
    }
    var budget = opts.budget || 2.5;
    var deadline = performance.now() + budget;
    var out = [0, 0];
    // mode: 'modulus' draws the lightness of |w| alone, in grey (sat < 0 tells domainColor).
    var sat = opts.mode === 'modulus' ? -1 : opts.saturation == null ? 0.82 : opts.saturation;
    while (cache.li < cache.levels.length) {
      var lv = cache.levels[cache.li];
      var data = lv.img.data;
      var dx = (v.x1 - v.x0) / lv.cols * (lv.cols * lv.step / b.w), dy = (v.y1 - v.y0) / lv.rows * (lv.rows * lv.step / b.h);
      while (lv.row < lv.rows) {
        var y = v.y1 - (lv.row + 0.5) * dy;
        var o = lv.row * lv.cols * 4;
        for (var c = 0; c < lv.cols; c++, o += 4) {
          fn(v.x0 + (c + 0.5) * dx, y, out);
          domainColor(out[0], out[1], data, o, sat);
        }
        lv.row++;
        if (cache.li > 0 && performance.now() > deadline) break;
      }
      if (lv.row < lv.rows) break;
      lv.done = true;
      cache.li++;
      if (performance.now() > deadline) break;
    }
    // Draw the finest finished level, then the rows of the level in progress over it. A translucent image would
    // be darker where the two overlap, so with alpha below 1 only the finished level is drawn.
    var alpha = opts.alpha == null ? 1 : opts.alpha;
    ctx.save();
    ctx.beginPath(); ctx.rect(b.l, b.t, b.w, b.h); ctx.clip();
    ctx.imageSmoothingEnabled = true;
    ctx.globalAlpha = alpha;
    for (var i = cache.levels.length - 1; i >= 0; i--) {
      var done = cache.levels[i];
      if (!done.done) continue;
      if (done.flushed < done.rows) { done.ctx.putImageData(done.img, 0, 0); done.flushed = done.rows; }
      ctx.drawImage(done.canvas, 0, 0, done.cols, done.rows, b.l, b.t, done.cols * done.step, done.rows * done.step);
      break;
    }
    var cur = cache.levels[cache.li];
    if (cur && cur.row > 0 && alpha >= 1) {
      cur.ctx.putImageData(cur.img, 0, 0, 0, cur.flushed, cur.cols, cur.row - cur.flushed);
      cur.flushed = cur.row;
      ctx.drawImage(cur.canvas, 0, 0, cur.cols, cur.row, b.l, b.t, cur.cols * cur.step, cur.row * cur.step);
    }
    ctx.restore();
    if (cache.li < cache.levels.length) f.more();
  };

  FP.plane = function (opts) {
    var p = new Plane(this, opts);
    this.planes.push(p);
    if (p.panZoom) {
      var self = this;
      this.button({ label: 'Zoom in', onClick: function () { p.zoom(0.7); } });
      this.button({ label: 'Zoom out', onClick: function () { p.zoom(1 / 0.7); } });
    }
    return p;
  };
  /* Zoom by k about a world point (default the window's center); on a log axis the zoom is in log units. */
  PP.zoom = function (k, cx, cy) {
    var vw = this.view, lx = this.xlog, ly = this.ylog;
    var a = function (v, lg) { return lg ? Math.log10(v) : v; }, z = function (u, lg) { return lg ? pow10(u) : u; };
    var x0 = a(vw.x0, lx), x1 = a(vw.x1, lx), y0 = a(vw.y0, ly), y1 = a(vw.y1, ly);
    var ux = cx == null ? (x0 + x1) / 2 : a(cx, lx), uy = cy == null ? (y0 + y1) / 2 : a(cy, ly);
    vw.x0 = z(ux + (x0 - ux) * k, lx); vw.x1 = z(ux + (x1 - ux) * k, lx);
    vw.y0 = z(uy + (y0 - uy) * k, ly); vw.y1 = z(uy + (y1 - uy) * k, ly);
    this.fig.redraw();
  };
  /* Shift the window by a drag of (dpx, dpy) screen pixels. */
  PP.pan = function (dpx, dpy) {
    var vw = this.view, du = dpx / this.sx, dw = dpy / this.sy;
    if (this.xlog) { var kx = pow10(-du); vw.x0 *= kx; vw.x1 *= kx; } else { vw.x0 -= du; vw.x1 -= du; }
    if (this.ylog) { var ky = pow10(dw); vw.y0 *= ky; vw.y1 *= ky; } else { vw.y0 += dw; vw.y1 += dw; }
    this.fig.redraw();
  };
  PP.reset = function () { var i = this.init, vw = this.view; vw.x0 = i.x0; vw.x1 = i.x1; vw.y0 = i.y0; vw.y1 = i.y1; };

  /* ---------------- Tweens, follows, and jobs ---------------- */

  FP.tween = function (value, opts) {
    opts = opts || {};
    var fig = this;
    var tw = {
      value: value, from: value, target: value, ms: 0, elapsed: 0, active: false, ease: Kit.ease[opts.ease || 'inOutCubic'],
      to: function (target, ms, ease) {
        this.from = this.value; this.target = target; this.ms = ms == null ? 600 : ms; this.elapsed = 0;
        if (ease) this.ease = Kit.ease[ease] || ease;
        if (Kit.reducedMotion || this.ms <= 0) { this.value = target; this.active = false; fig.redraw(); return this; }
        this.active = true; schedule(); return this;
      },
      set: function (v) { this.value = this.from = this.target = v; this.active = false; fig.redraw(); return this; },
      advance: function (dt) {
        if (!this.active) return false;
        this.elapsed += dt * 1000;
        var t = Math.min(1, this.elapsed / this.ms);
        this.value = this.from + (this.target - this.from) * this.ease(t);
        if (t >= 1) this.active = false;
        return true;
      }
    };
    this.tweens.push(tw);
    return tw;
  };

  /* A critically damped follower: to(target) retargets from the current value and velocity, so a value chased by
     a slider or a drag moves smoothly however often the target changes. tau (seconds) sets the pace: the value
     covers about 90% of a jump in 4 tau. Calling to() with an unchanged target costs nothing. */
  FP.follow = function (value, opts) {
    opts = opts || {};
    var fig = this;
    var fl = {
      value: value, target: value, velocity: 0, tau: opts.tau || 0.12, active: false, eps: 0,
      to: function (target) {
        if (target === this.target && (this.active || this.value === target)) return this;
        this.eps = Math.max(Math.abs(target - this.value) * 1e-3, Math.abs(target) * 1e-12, 1e-12);
        this.target = target;
        if (Kit.reducedMotion) { this.value = target; this.velocity = 0; this.active = false; fig.redraw(); return this; }
        this.active = true; schedule(); return this;
      },
      set: function (v) { this.value = this.target = v; this.velocity = 0; this.active = false; fig.redraw(); return this; },
      advance: function (dt) {
        if (!this.active) return false;
        var w = 1 / this.tau, e = this.value - this.target, v = this.velocity, k = Math.exp(-w * dt), c = v + w * e;
        e = (e + c * dt) * k;
        this.velocity = (v - w * c * dt) * k;
        this.value = this.target + e;
        if (Math.abs(e) < this.eps && Math.abs(this.velocity) * this.tau < this.eps) { this.value = this.target; this.velocity = 0; this.active = false; }
        return true;
      }
    };
    this.tweens.push(fl);
    return fl;
  };

  FP.job = function (work, opts) {
    opts = opts || {};
    var task = typeof work === 'function' ? makeTask(work) : work;
    if (!task || typeof task.step !== 'function') throw new Error('figure "' + this.name + '": job needs a task or a generator function');
    this.jobs.push({ task: task, budget: opts.budget || 3, onDone: opts.onDone || null, finished: false });
    this.redraw();
    return task;
  };
  FP.runJobs = function () {
    var left = false;
    for (var i = 0; i < this.jobs.length; i++) {
      var j = this.jobs[i];
      if (j.finished) continue;
      if (j.task.step(j.budget)) { j.finished = true; if (j.onDone) j.onDone(j.task.result); } else left = true;
    }
    if (left) this.wantMore = true;
    else if (this.jobs.length) this.jobs = this.jobs.filter(function (q) { return !q.finished; });
  };

  /* ---------------- Controls ---------------- */

  var SVG_PLAY = '<svg class="i-play" viewBox="0 0 16 16" aria-hidden="true"><path d="M4 2.5v11l9.5-5.5z"/></svg>';
  var SVG_PAUSE = '<svg class="i-pause" viewBox="0 0 16 16" aria-hidden="true"><path d="M3.5 2.5h3v11h-3zM9.5 2.5h3v11h-3z"/></svg>';

  /* Every control gets show(on) and enable(on), which cost nothing when nothing changes, so draw may call them. */
  function addShowEnable(c, el, inputs) {
    c.el = el;
    c.show = function (on) { on = on !== false; if (el.hidden === on) el.hidden = !on; return c; };
    c.enable = function (on) {
      on = on !== false;
      if (el.classList.contains('vc-off') !== !on) { el.classList.toggle('vc-off', !on); for (var i = 0; i < inputs.length; i++) inputs[i].disabled = !on; }
      return c;
    };
  }
  function paletteVar(name) { return PALETTE_NAMES.indexOf(name) >= 0 ? 'var(--viz-' + name + ')' : name; }
  function nearestIndex(list, v) {
    var i = lowerBound(list, v);
    if (i >= list.length) return list.length - 1;
    if (i > 0 && v - list[i - 1] <= list[i] - v) return i - 1;
    return i;
  }

  /* Play and pause with a scrubber. value is the position, from 0 to 1 over duration seconds while playing and on
     screen. With min and max (and scale), mapped is the value the position stands for and format receives it.
     pace(u, mapped) gives a relative speed; the total time stays duration. */
  FP.player = function (opts) {
    opts = opts || {};
    var fig = this;
    var duration = opts.duration || 6;
    var autoplay = opts.autoplay !== false;
    var start = opts.value == null ? 0 : opts.value;
    var reducedValue = opts.reduced != null ? opts.reduced : opts.value != null ? opts.value : 1;
    var sc = opts.min != null || opts.scale ? Kit.scale(opts.scale, opts.min == null ? 0 : opts.min, opts.max == null ? 1 : opts.max) : null;
    var format = opts.format || (sc ? function (v) { return fmt.compact(v); } : function (v) { return Math.round(v * 100) + '%'; });
    var paceNorm = 1;
    if (opts.pace) {
      var I = 0, K = 256;
      for (var k = 0; k < K; k++) {
        var u = (k + 0.5) / K, s = opts.pace(u, sc ? sc.to(u) : u);
        if (!(s > 0)) throw new Error('figure "' + fig.name + '": player pace must be positive, got ' + s + ' at ' + u);
        I += 1 / s;
      }
      paceNorm = I / K;
    }
    var wrap = document.createElement('div');
    wrap.className = 'vc vc-player';
    var btn = document.createElement('button');
    btn.type = 'button'; btn.className = 'vc-btn vc-play';
    btn.innerHTML = SVG_PLAY + SVG_PAUSE;
    var scrubWrap = document.createElement('label');
    scrubWrap.className = 'vc vc-scrub';
    var name = document.createElement('span'); name.className = 'vc-name'; name.textContent = opts.label || 'Time';
    var range = document.createElement('input');
    range.type = 'range'; range.min = '0'; range.max = '1000'; range.step = '1';
    var out = document.createElement('output');
    scrubWrap.appendChild(name); scrubWrap.appendChild(range); scrubWrap.appendChild(out);
    wrap.appendChild(btn); wrap.appendChild(scrubWrap);
    fig.addControl(wrap);
    var p = {
      value: start, mapped: sc ? sc.to(start) : start, playing: false, loop: Boolean(opts.loop), shownAt: -1, shownValue: NaN, shownPlaying: null, shownText: null,
      /* The DOM is written only when what it shows changes: the button when playing starts or stops, the scrubber
         when it moves by a step, the readout when its text changes. */
      sync: function () {
        this.mapped = sc ? sc.to(this.value) : this.value;
        if (this.playing !== this.shownPlaying) {
          btn.setAttribute('aria-pressed', String(this.playing));
          btn.setAttribute('aria-label', this.playing ? 'Pause' : 'Play');
          this.shownPlaying = this.playing;
        }
        var r = Math.round(this.value * 1000);
        if (r !== this.shownAt) { range.value = String(r); this.shownAt = r; }
        // The readout follows the value itself: keyed on the scrubber step, it kept the text of 0.9996 at the end.
        if (this.value !== this.shownValue) {
          this.shownValue = this.value;
          var text = format(sc ? this.mapped : this.value);
          if (text !== this.shownText) { out.textContent = text; range.setAttribute('aria-valuetext', text); this.shownText = text; }
        }
      },
      play: function () { if (this.value >= 1 && !this.loop) this.value = 0; this.playing = true; this.sync(); fig.lastNow = 0; schedule(); },
      pause: function () { this.playing = false; this.sync(); },
      set: function (v) { this.value = clamp(v, 0, 1); this.sync(); fig.redraw(); },
      seek: function (mapped) {
        if (!sc) throw new Error('figure "' + fig.name + '": seek needs a player with min and max');
        this.set(sc.from(mapped));
      },
      reset: function () { this.value = Kit.reducedMotion ? reducedValue : start; this.playing = autoplay && !Kit.reducedMotion; this.sync(); },
      advance: function (dt) {
        if (!this.playing) return false;
        this.value += dt / duration * (opts.pace ? opts.pace(this.value, this.mapped) * paceNorm : 1);
        if (this.value >= 1) { if (this.loop) this.value -= 1; else { this.value = 1; this.playing = false; } }
        // The scrubber and readout are written after the frame is drawn (frame calls sync): a DOM write before the
        // draw made the first canvas text of every frame wait for a style update of the page, 1 to 2 ms.
        this.mapped = sc ? sc.to(this.value) : this.value;
        this.needSync = true;
        return true;
      }
    };
    addShowEnable(p, wrap, [btn, range]);
    btn.addEventListener('click', function () { if (p.playing) p.pause(); else p.play(); });
    range.addEventListener('input', function () { p.playing = false; p.value = Number(range.value) / 1000; p.sync(); fig.redraw(); });
    p.reset();
    this.players.push(p);
    this.controls.push(p);
    return p;
  };

  FP.addControl = function (el) {
    if (!this.controlsEl) throw new Error('figure "' + this.name + '" has no controls row');
    this.controlsEl.appendChild(el);
  };
  function nameSpan(fig, opts) {
    var s = document.createElement('span');
    s.className = 'vc-name';
    if (opts.label) s.appendChild(document.createTextNode(opts.label + (opts.tex ? ' ' : '')));
    if (opts.tex) {
      var html = fig.tex[opts.tex];
      if (html == null) throw new Error('figure "' + fig.name + '" has no tex.' + opts.tex);
      var t = document.createElement('span'); t.innerHTML = html; s.appendChild(t);
    }
    return s;
  }
  /* A slider. Linear by default; scale: 'log' | 'sqrt' | { to, from } maps the track to [min, max]; values: [list]
     makes it step through a list; snap: [list] pulls a dragged value onto a nearby entry; marks: [v or
     { at, color, title }] draws ticks under the track. */
  FP.slider = function (opts) {
    var fig = this;
    var list = opts.values || null;
    if (list && !list.length) throw new Error('figure "' + fig.name + '": slider values is empty');
    var min = list ? list[0] : opts.min, max = list ? list[list.length - 1] : opts.max;
    var linear = !list && (!opts.scale || opts.scale === 'linear');
    var step = opts.step == null ? (linear ? (max - min) / 100 : 0) : opts.step;
    var sc = list ? null : Kit.scale(opts.scale, min, max);
    var RES = 1000;
    var format = opts.format || (linear || step ? fmt.step(step) : fmt.sig);
    var wrap = document.createElement('label'); wrap.className = 'vc vc-slider';
    var input = document.createElement('input');
    input.type = 'range';
    if (linear) { input.min = String(min); input.max = String(max); input.step = String(step); }
    else { input.min = '0'; input.max = String(list ? list.length - 1 : RES); input.step = '1'; }
    function frac(v) { return list ? (list.length > 1 ? nearestIndex(list, v) / (list.length - 1) : 0) : linear ? (v - min) / (max - min) : sc.from(v); }
    function posOf(v) { return linear ? v : list ? nearestIndex(list, v) : Math.round(clamp(sc.from(v), 0, 1) * RES); }
    function valueOf(pos) {
      if (linear) return Number(pos);
      if (list) return list[Number(pos)];
      var v = sc.to(Number(pos) / RES);
      if (step) v = Math.round(v / step) * step;
      return clamp(v, Math.min(min, max), Math.max(min, max));
    }
    var out = document.createElement('output');
    var track = input;
    var markEls = [];
    function placeMark(e, at) { e.style.left = 'calc(8px + (100% - 16px) * ' + clamp(frac(at), 0, 1).toFixed(5) + ')'; }
    if (opts.marks && opts.marks.length) {
      track = document.createElement('span'); track.className = 'vc-track';
      track.appendChild(input);
      opts.marks.forEach(function (m) {
        var mk = typeof m === 'number' ? { at: m } : m;
        var e = document.createElement('i'); e.className = 'vc-mark';
        placeMark(e, mk.at);
        if (mk.color) e.style.background = paletteVar(mk.color);
        if (mk.title) e.title = mk.title;
        track.appendChild(e);
        markEls.push([e, mk.at]);
      });
    }
    wrap.appendChild(nameSpan(fig, opts)); wrap.appendChild(track); wrap.appendChild(out);
    fig.addControl(wrap);
    function show() { out.textContent = format(c.value); input.setAttribute('aria-valuetext', out.textContent); }
    var initial = opts.value == null ? min : opts.value;
    var c = {
      value: initial, initial: initial,
      set: function (v) { this.value = list ? list[nearestIndex(list, v)] : clamp(v, Math.min(min, max), Math.max(min, max)); input.value = String(posOf(this.value)); show(); fig.redraw(); },
      reset: function () { this.set(this.initial); },
      /* A new range (and optionally a new step) for a slider made with min and max; the value is kept, clamped to
         the new range. Marks move with the range; a slider made with values has no range to change. */
      setRange: function (lo, hi, st) {
        if (list) throw new Error('figure "' + fig.name + '": setRange needs a slider made with min and max, not values');
        if (!(hi > lo)) throw new Error('figure "' + fig.name + '": setRange needs min < max, got ' + lo + ', ' + hi);
        if (lo === min && hi === max && (st == null || st === step)) return this;
        min = lo; max = hi;
        if (st != null) step = st; else if (opts.step == null) step = linear ? (max - min) / 100 : 0;
        sc = Kit.scale(opts.scale, min, max);
        if (!opts.format) format = linear || step ? fmt.step(step) : fmt.sig;
        if (linear) { input.min = String(min); input.max = String(max); input.step = String(step); }
        for (var i = 0; i < markEls.length; i++) placeMark(markEls[i][0], markEls[i][1]);
        this.value = clamp(this.value, min, max);
        input.value = String(posOf(this.value));
        show();
        fig.redraw();
        return this;
      }
    };
    addShowEnable(c, wrap, [input]);
    var viaKey = false;
    input.addEventListener('keydown', function (e) {
      viaKey = true;
      if (linear || list) return;
      var d = { ArrowRight: 1, ArrowUp: 1, ArrowLeft: -1, ArrowDown: -1 }[e.key];
      if (!d) return;
      e.preventDefault();
      input.value = String(clamp(Number(input.value) + d * (e.shiftKey ? 50 : 10), 0, RES));
      input.dispatchEvent(new Event('input'));
    });
    input.addEventListener('pointerdown', function () { viaKey = false; });
    input.addEventListener('input', function () {
      var v = valueOf(input.value);
      if (opts.snap && !viaKey) {
        var u = frac(v), best = null, bd = opts.snapWithin || 0.015;
        for (var i = 0; i < opts.snap.length; i++) { var d = Math.abs(frac(opts.snap[i]) - u); if (d <= bd) { bd = d; best = opts.snap[i]; } }
        if (best != null) v = best;
      }
      c.value = v;
      show();
      if (opts.onInput) opts.onInput(c.value);
      fig.redraw();
    });
    input.value = String(posOf(c.value)); show();
    this.controls.push(c);
    return c;
  };
  FP.toggle = function (opts) {
    var fig = this;
    var wrap = document.createElement('label'); wrap.className = 'vc vc-toggle';
    var input = document.createElement('input'); input.type = 'checkbox'; input.checked = Boolean(opts.value);
    wrap.appendChild(input); wrap.appendChild(nameSpan(fig, opts));
    fig.addControl(wrap);
    var c = {
      value: Boolean(opts.value), initial: Boolean(opts.value),
      set: function (v) { this.value = Boolean(v); input.checked = this.value; fig.redraw(); },
      reset: function () { this.set(this.initial); }
    };
    addShowEnable(c, wrap, [input]);
    input.addEventListener('change', function () { c.value = input.checked; if (opts.onInput) opts.onInput(c.value); fig.redraw(); });
    this.controls.push(c);
    return c;
  };
  FP.select = function (opts) {
    var fig = this;
    var wrap = document.createElement('label'); wrap.className = 'vc vc-select';
    var sel = document.createElement('select');
    (opts.options || []).forEach(function (o) {
      var op = document.createElement('option');
      op.value = Array.isArray(o) ? o[0] : o; op.textContent = Array.isArray(o) ? o[1] : o;
      sel.appendChild(op);
    });
    wrap.appendChild(nameSpan(fig, opts)); wrap.appendChild(sel);
    fig.addControl(wrap);
    var first = opts.options && opts.options.length ? (Array.isArray(opts.options[0]) ? opts.options[0][0] : opts.options[0]) : '';
    var c = {
      value: opts.value == null ? first : opts.value, initial: opts.value == null ? first : opts.value,
      set: function (v) { this.value = v; sel.value = v; fig.redraw(); },
      reset: function () { this.set(this.initial); }
    };
    addShowEnable(c, wrap, [sel]);
    sel.value = c.value;
    sel.addEventListener('change', function () { c.value = sel.value; if (opts.onInput) opts.onInput(c.value); fig.redraw(); });
    this.controls.push(c);
    return c;
  };
  /* A button. b.setLabel(text) changes its text; with pressed: true or false it is a toggle button (aria-pressed),
     b.press(on) sets the state and b.pressed reads it, so a group of buttons can act as a selector. */
  FP.button = function (opts) {
    var fig = this;
    var b = document.createElement('button'); b.type = 'button'; b.className = 'vc vc-btn';
    b.textContent = opts.label;
    b.addEventListener('click', function () { opts.onClick(); fig.redraw(); });
    fig.addControl(b);
    addShowEnable(b, b, [b]);
    b.setLabel = function (text) { text = String(text); if (b.textContent !== text) b.textContent = text; return b; };
    b.press = function (on) {
      var v = String(on !== false);
      if (b.getAttribute('aria-pressed') !== v) b.setAttribute('aria-pressed', v);
      return b;
    };
    Object.defineProperty(b, 'pressed', { get: function () { return b.getAttribute('aria-pressed') === 'true'; } });
    if (opts.pressed != null) b.press(Boolean(opts.pressed));
    return b;
  };
  FP.addReset = function () {
    var fig = this;
    var b = document.createElement('button'); b.type = 'button'; b.className = 'vc vc-btn vc-reset';
    b.textContent = 'Reset';
    b.addEventListener('click', function () { fig.reset(); });
    fig.addControl(b);
  };
  FP.reset = function () {
    for (var i = 0; i < this.controls.length; i++) this.controls[i].reset();
    for (var j = 0; j < this.drags.length; j++) this.drags[j].reset();
    for (var k = 0; k < this.planes.length; k++) this.planes[k].reset();
    if (this.onReset) this.onReset();
    this.lastNow = 0;
    this.redraw();
  };

  /* ---------------- Overlays: measured text, mixed math and numbers, panels, legends ---------------- */

  function fontsReady() { return !document.fonts || document.fonts.status === 'loaded'; }
  /* Width and height in CSS pixels of the math label tex[key] at a font size. Every label of the module is measured
     at once, at the labels' own font size, in one layout: when the figure starts (its init runs after the browser's
     layout, so that layout covers the labels alone), and again after the page's fonts change. KaTeX sizes everything
     in em, so a label's size at another font size is in proportion. */
  FP.labelBox = function () {
    var keys = Object.keys(this.tex), els = [];
    var box = document.createElement('div');
    box.style.cssText = 'position:absolute;left:0;top:0;visibility:hidden';
    for (var i = 0; i < keys.length; i++) {
      var el = document.createElement('div');
      el.className = 'viz-label';
      el.innerHTML = this.tex[keys[i]];
      box.appendChild(el);
      els.push(el);
    }
    this.labelsEl.appendChild(box);
    return { keys: keys, els: els, box: box };
  };
  FP.readLabelBox = function (m) {
    var base = parseFloat(getComputedStyle(m.box.firstChild || m.box).fontSize) || 16;
    var unit = {};
    for (var i = 0; i < m.keys.length; i++) { var r = m.els[i].getBoundingClientRect(); unit[m.keys[i]] = { w: r.width / base, h: r.height / base }; }
    this.labelsEl.removeChild(m.box);
    this.labelBase = base;
    this.labelUnit = unit;
    this.labelFontsReady = fontsReady();
  };
  FP.measureLabels = function () { this.readLabelBox(this.labelBox()); };
  FP.labelSize = function (key, size) {
    var k = key + '|' + (size || '');
    var hit = this.texSize[k];
    if (hit) return hit;
    if (this.tex[key] == null) throw new Error('figure "' + this.name + '" has no tex.' + key);
    if (!this.labelUnit || !this.labelFontsReady) this.measureLabels();
    var u = this.labelUnit[key], f = size || this.labelBase;
    var s = { w: u.w * f, h: u.h * f };
    this.texSize[k] = s;
    return s;
  };
  /* Canvas text widths, cached for the page by font and string (see textWidths). */
  FP.measure = function (str, size, weight, mono) {
    str = String(str);
    var font = this.font(size || 12, weight || 500, mono), key = font + '\u0002' + str;
    var hit = textWidths.get(key);
    if (hit !== undefined) return hit;
    checkText(this, str);
    var w, mc;
    if (mono && SCRIPT_RE.test(str)) w = this.scriptWidth(scriptRuns(str), size || 12, weight || 500);
    else if ((mc = measureContext())) { if (measureFont !== font) { mc.font = font; measureFont = font; } w = mc.measureText(str).width; }
    else { this.setFont(font); w = this.ctx.measureText(str).width; }
    if (textWidths.size >= 5000) textWidths.clear();
    textWidths.set(key, w);
    return w;
  };
  /* Word wrap of canvas text to a width in CSS pixels: an array of lines. Words are measured once each (fig.measure);
     a word wider than the width gets a line of its own; '\n' breaks a line. Cached per figure by text, width, and
     font, so calling it in every frame costs a lookup. */
  FP.wrap = function (str, width, size, weight, mono) {
    str = String(str);
    size = size || 12; weight = weight || 500;
    var key = str + '\u0002' + Math.round(width) + '|' + size + '|' + weight + '|' + (mono ? 1 : 0);
    var cache = this.wrapCache || (this.wrapCache = new Map());
    var hit = cache.get(key);
    if (hit) return hit;
    var out = [], sp = this.measure(' ', size, weight, mono), paras = str.split('\n');
    for (var i = 0; i < paras.length; i++) {
      var words = paras[i].split(' '), cur = '', cw = 0;
      for (var j = 0; j < words.length; j++) {
        var wd = words[j];
        if (!wd) continue;
        var ww = this.measure(wd, size, weight, mono);
        if (cur && cw + sp + ww > width) { out.push(cur); cur = wd; cw = ww; } else { cur = cur ? cur + ' ' + wd : wd; cw += (cw ? sp : 0) + ww; }
      }
      out.push(cur);
    }
    if (cache.size >= 500) cache.clear();
    cache.set(key, out);
    return out;
  };
  /* Word wrap of a run of text and math labels, the parts of fig.mathText: strings break at spaces, a { tex: key }
     part never breaks. Returns an array of lines, each an array of parts to draw with fig.mathText(line, x, y, opts).
     opts as for mathText: size (default 12.5), weight, mono. Not cached: wrap once when the width changes. */
  FP.wrapParts = function (parts, width, opts) {
    opts = opts || {};
    var size = opts.size || 12.5, sp = this.measure(' ', size, opts.weight, opts.mono), lines = [], line = [], lw = 0, gap = false;
    var self = this;
    function push(part, w, spaced) {
      var add = (spaced && line.length ? sp : 0) + w;
      if (line.length && lw + add > width) { lines.push(line); line = []; lw = 0; add = w; spaced = false; }
      if (spaced && line.length) {
        var prev = line[line.length - 1];
        if (typeof prev === 'string') line[line.length - 1] = prev + ' '; else line.push(' ');
      }
      var last = line[line.length - 1];
      if (typeof part === 'string' && typeof last === 'string') line[line.length - 1] = last + part; else line.push(part);
      lw += add;
    }
    for (var i = 0; i < parts.length; i++) {
      var p = parts[i];
      if (p == null || p === '') continue;
      if (typeof p === 'string') {
        var words = p.split(' ');
        for (var j = 0; j < words.length; j++) {
          if (!words[j]) { gap = true; continue; }
          push(words[j], self.measure(words[j], size, opts.weight, opts.mono), gap || j > 0);
          gap = false;
        }
        gap = p.charAt(p.length - 1) === ' ';
      } else {
        push(p, self.labelSize(p.tex, p.size || size).w, gap);
        gap = false;
      }
    }
    if (line.length) lines.push(line);
    return lines;
  };
  /* Scroll the page to the element with this id (a section, figure, equation, or result), as a link to it does. */
  FP.goTo = function (id, push) {
    if (!global.MX || !global.MX.goTo) throw new Error('figure "' + this.name + '": the page runtime is missing, so goTo cannot scroll');
    if (!global.MX.goTo(id, push !== false)) throw new Error('figure "' + this.name + '": goTo found no element with id "' + id + '"');
  };
  /* A stable label id for overlays that place one tex key more than once per frame. */
  FP.autoId = function (prefix, key) {
    var k = prefix + ':' + key, n = this.autoCount[k] = (this.autoCount[k] || 0) + 1;
    return '\u0001' + k + '#' + n;
  };
  /* A run of canvas text and math labels on one line: parts are strings and { tex: key, color, size } items, for
     example [{ tex: 'gN' }, ' = ' + Kit.fmt(g, 2)]. align: 'left' (default), 'center', 'right'; y is the line's middle.
     Returns the width. */
  FP.mathText = function (parts, x, y, opts) {
    opts = opts || {};
    var size = opts.size || 12.5, i, p, total = 0, widths = [];
    for (i = 0; i < parts.length; i++) {
      p = parts[i];
      if (p == null || p === '') { widths.push(0); continue; }
      var w = typeof p === 'string' ? this.measure(p, size, opts.weight, opts.mono) : this.labelSize(p.tex, p.size || size).w;
      widths.push(w); total += w;
    }
    var cx = opts.align === 'right' ? x - total : opts.align === 'center' ? x - total / 2 : x;
    for (i = 0; i < parts.length; i++) {
      p = parts[i];
      if (p == null || p === '') continue;
      if (typeof p === 'string') this.text(p, cx, y, { size: size, color: opts.color, weight: opts.weight, mono: opts.mono, baseline: 'middle', alpha: opts.alpha });
      else this.label(p.tex, cx, y, { anchor: 'w', color: p.color || opts.color || 'fg', size: p.size || size, alpha: p.alpha != null ? p.alpha : opts.alpha, id: this.autoId('mt', p.tex) });
      cx += widths[i];
    }
    this.occRect(cx - total, y - size * 0.7, total, size * 1.4);
    return total;
  };

  /* Occupancy: a coarse grid of the stage marking where curves and panels were drawn this frame, so a legend or a
     panel with at: 'auto' can take the corner that covers the least. */
  var CELL = 16;
  FP.occReset = function () {
    var cols = Math.max(1, Math.ceil(this.w / CELL)), rows = Math.max(1, Math.ceil(this.h / CELL));
    if (!this.occ || this.occCols !== cols || this.occRows !== rows) { this.occ = new Uint8Array(cols * rows); this.occCols = cols; this.occRows = rows; }
    else this.occ.fill(0);
  };
  FP.occSeg = function (x0, y0, x1, y1) {
    var occ = this.occ;
    if (!occ) return;
    var C = this.occCols, R = this.occRows;
    var n = Math.min(400, Math.ceil(Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0)) / CELL));
    for (var i = 0; i <= n; i++) {
      var t = n ? i / n : 0, cx = (x0 + (x1 - x0) * t) / CELL, cy = (y0 + (y1 - y0) * t) / CELL;
      if (cx >= 0 && cx < C && cy >= 0 && cy < R) occ[(cy | 0) * C + (cx | 0)] = 1;
    }
  };
  FP.occRect = function (x, y, w, h) {
    if (!this.occ) return;
    var C = this.occCols, R = this.occRows;
    var c0 = Math.max(0, Math.floor(x / CELL)), c1 = Math.min(C - 1, Math.floor((x + w) / CELL));
    var r0 = Math.max(0, Math.floor(y / CELL)), r1 = Math.min(R - 1, Math.floor((y + h) / CELL));
    for (var r = r0; r <= r1; r++) for (var c = c0; c <= c1; c++) this.occ[r * C + c] = 1;
  };
  FP.occScore = function (x, y, w, h) {
    if (!this.occ) return 0;
    var C = this.occCols, R = this.occRows, s = 0;
    var c0 = Math.max(0, Math.floor(x / CELL)), c1 = Math.min(C - 1, Math.floor((x + w) / CELL));
    var r0 = Math.max(0, Math.floor(y / CELL)), r1 = Math.min(R - 1, Math.floor((y + h) / CELL));
    for (var r = r0; r <= r1; r++) for (var c = c0; c <= c1; c++) s += this.occ[r * C + c];
    return s;
  };
  /* Where a w x h overlay goes: opts.x and opts.y (its top left), opts.near ([px, py], beside a point and kept on
     the stage), or opts.at, a corner or side of the plane's box ('nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w') or
     'auto' (default): the corner of opts.prefer (default ne, nw, se, sw) whose area holds the least drawn data, kept
     until another corner is clearly better. */
  var CORNERS = ['ne', 'nw', 'se', 'sw'];
  FP.place = function (w, h, opts, key) {
    var P = opts.plane || this.planes[0];
    var B = P ? P.box : { l: 0, t: 0, r: this.w, b: this.h }, m = opts.margin == null ? 8 : opts.margin;
    if (opts.x != null) return { x: opts.x, y: opts.y };
    if (opts.near) {
      // beside the point: up and to the right if it fits on the stage and covers nothing, else the least covered
      var qx = opts.near[0], qy = opts.near[1], bestN = null, bestNS = Infinity;
      var cands = [[qx + 14, qy - h - 12], [qx - 14 - w, qy - h - 12], [qx + 14, qy + 14], [qx - 14 - w, qy + 14]];
      for (var j = 0; j < 4; j++) {
        var cx = clamp(cands[j][0], 2, Math.max(2, this.w - w - 2)), cy = clamp(cands[j][1], 2, Math.max(2, this.h - h - 2));
        var off = Math.abs(cx - cands[j][0]) + Math.abs(cy - cands[j][1]);
        var sc = this.occScore(cx, cy, w, h) * 4 + off + (cx < qx && cx + w > qx && cy < qy && cy + h > qy ? 1000 : 0);
        if (sc < bestNS) { bestNS = sc; bestN = { x: cx, y: cy }; }
      }
      return bestN;
    }
    function pos(c) {
      return {
        x: c.indexOf('w') >= 0 ? B.l + m : c.indexOf('e') >= 0 ? B.r - m - w : (B.l + B.r - w) / 2,
        y: c.indexOf('n') >= 0 ? B.t + m : c.indexOf('s') >= 0 ? B.b - m - h : (B.t + B.b - h) / 2
      };
    }
    var at = opts.at || 'auto';
    if (at !== 'auto') return pos(at);
    var spots = opts.prefer || CORNERS, prev = this.places[key], best = spots[0], bestS = Infinity, prevS = Infinity;
    for (var i = 0; i < spots.length; i++) {
      var p = pos(spots[i]), s = this.occScore(p.x, p.y, w, h);
      if (s < bestS) { bestS = s; best = spots[i]; }
      if (spots[i] === prev) prevS = s;
    }
    var choice = prev && prevS <= bestS + 2 ? prev : best;
    this.places[key] = choice;
    return pos(choice);
  };
  /* A readout panel: rows of [label, value, color], label a string or { tex: key }, value a string; null rows are
     skipped. Compact (default when the plane is under 480 px wide) uses a smaller font and two columns of rows.
     Placement as in place(); the value column keeps its widest width so the panel does not jitter. */
  FP.panel = function (rows, opts) {
    opts = opts || {};
    var P = opts.plane || this.planes[0], key = opts.id || 'panel';
    var list = [], i, r;
    for (i = 0; i < rows.length; i++) if (rows[i]) list.push(rows[i]);
    var compact = opts.compact == null ? (P ? P.box.w : this.w) < 480 : opts.compact;
    var size = opts.size || (compact ? 10.5 : 11.5), rh = Math.round(size * (compact ? 1.35 : 1.42)), pad = compact ? 6 : 9;
    var cols = compact && list.length > 3 ? 2 : 1, per = Math.ceil(list.length / cols);
    var lw = 0, vw = 0, texSize = size + 1.5;
    // A row is as tall as its math label needs (a fraction, a superscript on a tall base), at least rh.
    var heights = [];
    for (i = 0; i < per; i++) heights.push(rh);
    for (i = 0; i < list.length; i++) {
      r = list[i];
      if (typeof r[0] === 'object' && r[0]) {
        var ls = this.labelSize(r[0].tex, texSize);
        lw = Math.max(lw, ls.w);
        heights[i % per] = Math.max(heights[i % per], Math.ceil(ls.h) + 2);
      } else lw = Math.max(lw, this.measure(String(r[0]), size, 500, true));
      vw = Math.max(vw, this.measure(String(r[1]), size, 500, true));
    }
    var tops = [], sumH = 0;
    for (i = 0; i < per; i++) { tops.push(sumH); sumH += heights[i]; }
    var st = this.panelW[key];
    if (st && st.fw === this.w && st.n === list.length) vw = Math.max(vw, st.vw);
    this.panelW[key] = { vw: vw, fw: this.w, n: list.length };
    var gapIn = compact ? 6 : 14, gapCol = 14, cellW = lw + gapIn + vw;
    var hint = opts.hint && !compact ? opts.hint : null;
    var w = Math.ceil(2 * pad + Math.max(cols * cellW + (cols - 1) * gapCol, hint ? this.measure(hint, size - 1, 500) : 0));
    var h = Math.ceil(2 * pad + sumH + (hint ? rh : 0) - (rh - size) + 2);
    var at = this.place(w, h, opts, key);
    this.rect(at.x, at.y, w, h, { fill: 'stage', alpha: opts.alpha == null ? 0.88 : opts.alpha });
    for (i = 0; i < list.length; i++) {
      r = list[i];
      var col = Math.floor(i / per), row = i % per;
      var x0 = at.x + pad + col * (cellW + gapCol), y = at.y + pad + size / 2 + 1 + tops[row] + (heights[row] - rh) / 2;
      if (typeof r[0] === 'object' && r[0]) this.label(r[0].tex, x0, y, { anchor: 'w', color: r[2] || 'fg', size: texSize, id: this.autoId('pn', r[0].tex) });
      else this.text(String(r[0]), x0, y, { color: 'muted', size: size, mono: true, baseline: 'middle' });
      this.text(String(r[1]), x0 + cellW, y, { color: r[2] || 'fg', size: size, mono: true, align: 'right', baseline: 'middle' });
    }
    if (hint) this.text(hint, at.x + pad, at.y + pad + size / 2 + 1 + sumH, { color: 'muted', size: size - 1, baseline: 'middle' });
    this.occRect(at.x, at.y, w, h);
    return { x: at.x, y: at.y, w: w, h: h };
  };
  /* A legend: items { color, tex or text, line (default), dot, fill, width, dash, alpha }, falsy items skipped.
     dir: 'col' (default) or 'row', which wraps to the plane's width. Placement as in place(). */
  FP.legend = function (items, opts) {
    opts = opts || {};
    var P = opts.plane || this.planes[0], key = opts.id || 'legend';
    var B = P ? P.box : { l: 0, t: 0, r: this.w, b: this.h };
    var size = opts.size || 13, sw = 22, gap = 7, rowH = Math.max(18, Math.round(size * 1.5)), pad = 7, sp = 16;
    var list = [], i, it;
    for (i = 0; i < items.length; i++) if (items[i]) list.push(items[i]);
    var maxW = Math.max(80, B.r - B.l - 2 * (opts.margin == null ? 8 : opts.margin) - 2 * pad);
    var lay = [], x = 0, row = 0, wMax = 0;
    for (i = 0; i < list.length; i++) {
      it = list[i];
      var lw = it.tex ? this.labelSize(it.tex, size).w : this.measure(it.text, size - 1, 500);
      var iw = sw + gap + lw;
      if (opts.dir === 'row') { if (x > 0 && x + iw > maxW) { x = 0; row++; } }
      else if (i > 0) { x = 0; row++; }
      lay.push({ x: x, row: row, w: iw });
      x += iw + sp;
      wMax = Math.max(wMax, x - sp);
    }
    var w = Math.ceil(wMax + 2 * pad), h = (row + 1) * rowH + 2 * pad - 4;
    var at = this.place(w, h, opts, key);
    if (opts.bg !== false) this.rect(at.x, at.y, w, h, { fill: 'stage', alpha: opts.alpha == null ? 0.85 : opts.alpha });
    for (i = 0; i < list.length; i++) {
      it = list[i];
      var ix = at.x + pad + lay[i].x, cy = at.y + pad - 2 + rowH / 2 + lay[i].row * rowH, c = it.color || 'fg';
      if (it.dot) this.circle(ix + sw / 2, cy, it.r || 4, { fill: c, alpha: it.alpha, ring: 'stage', ringWidth: 1.5 });
      else if (it.fill) this.rect(ix, cy - 5, sw, 10, { fill: c, alpha: it.alpha == null ? 0.3 : it.alpha });
      else this.line(ix, cy, ix + sw, cy, { color: c, width: it.width || 2.2, dash: it.dash, alpha: it.alpha });
      if (it.tex) this.label(it.tex, ix + sw + gap, cy, { anchor: 'w', color: it.labelColor || c, size: size, id: this.autoId('lg', it.tex) });
      else this.text(it.text, ix + sw + gap, cy, { color: it.labelColor || c, size: size - 1, baseline: 'middle' });
    }
    this.occRect(at.x, at.y, w, h);
    return { x: at.x, y: at.y, w: w, h: h };
  };

  /* ---------------- Probe: a readout that follows the pointer over a plane ---------------- */

  FP.probe = function (opts) {
    if (!opts || !opts.plane) throw new Error('figure "' + this.name + '": probe needs a plane');
    var fig = this;
    var pr = {
      plane: opts.plane, opts: opts, active: false, snapped: false, x: 0, y: 0, px: 0, py: 0, touch: false,
      hide: function () { if (this.active) { this.active = false; fig.redraw(); } }
    };
    this.probes.push(pr);
    return pr;
  };
  /* World coordinates of each active probe, from the pointer position, before draw. */
  FP.resolveProbes = function () {
    for (var i = 0; i < this.probes.length; i++) {
      var pr = this.probes[i];
      if (!pr.active) continue;
      var w = pr.plane.toWorld(pr.px, pr.py);
      pr.x = w[0]; pr.y = w[1]; pr.snapped = false;
      if (pr.opts.snap) {
        var s = pr.opts.snap(w[0], w[1]);
        if (s) { pr.x = s[0]; pr.y = s[1]; pr.snapped = true; }
      }
    }
  };
  FP.drawProbes = function () {
    for (var i = 0; i < this.probes.length; i++) {
      var pr = this.probes[i];
      if (!pr.active || this.activeDrag) continue;
      var o = pr.opts, P = pr.plane, b = P.box, px = P.X(pr.x), py = P.Y(pr.y);
      var ch = o.crosshair == null ? 'x' : o.crosshair, st = { color: o.color || 'fg', width: 1, alpha: 0.45, dash: [3, 4] };
      if ((ch === 'x' || ch === 'both') && px >= b.l && px <= b.r) this.line(px, b.t, px, b.b, st);
      if ((ch === 'y' || ch === 'both') && py >= b.t && py <= b.b) this.line(b.l, py, b.r, py, st);
      if (pr.snapped && o.marker !== false && P.inside(px, py)) this.circle(px, py, 4.5, { fill: o.color || 'fg', ring: 'stage', ringWidth: 2 });
      if (o.rows) {
        var rows = o.rows(pr.x, pr.y, pr);
        if (rows && rows.length) this.panel(rows, { plane: P, id: '\u0001probe' + i, near: o.panel ? null : [px, py], at: o.panel, compact: o.compact });
      }
    }
  };

  /* ---------------- Draggable points ---------------- */

  FP.drag = function (opts) {
    var fig = this;
    if (!opts.plane) throw new Error('figure "' + this.name + '": drag needs a plane');
    var step = opts.step == null ? [0, 0] : typeof opts.step === 'number' ? [opts.step, opts.step] : opts.step;
    var h = {
      plane: opts.plane, x: opts.x, y: opts.y, x0: opts.x, y0: opts.y, r: opts.r || 7, color: opts.color || 'gold',
      label: opts.label || null, labelAnchor: opts.labelAnchor || 'sw', constrain: opts.constrain || null, onDrag: opts.onDrag || null,
      onStart: opts.onStart || null, onEnd: opts.onEnd || null,
      stepX: step[0] || 0, stepY: step[1] || 0, hover: false, hidden: false, disabled: false,
      /* Like the controls: show(on) hides the point (not drawn, not draggable), enable(on) greys it and stops dragging;
         both cost nothing when nothing changes, so draw may call them every frame. */
      show: function (on) {
        on = on !== false;
        if (this.hidden !== on) return this;
        this.hidden = !on;
        if (!on) this.hover = false;
        fig.redraw();
        return this;
      },
      enable: function (on) {
        on = on !== false;
        if (this.disabled !== on) return this;
        this.disabled = !on;
        if (!on) this.hover = false;
        fig.redraw();
        return this;
      },
      set: function (x, y) {
        if (this.stepX) x = Math.round(x / this.stepX) * this.stepX;
        if (this.stepY) y = Math.round(y / this.stepY) * this.stepY;
        if (this.constrain) { var c = this.constrain(x, y); x = c[0]; y = c[1]; }
        this.x = x; this.y = y;
        if (this.onDrag) this.onDrag(x, y);
        fig.redraw();
      },
      reset: function () { this.x = this.x0; this.y = this.y0; }
    };
    this.drags.push(h);
    return h;
  };
  FP.drawHandles = function () {
    for (var i = 0; i < this.drags.length; i++) {
      var h = this.drags[i], P = h.plane;
      if (h.hidden) continue;
      var px = P.X(h.x), py = P.Y(h.y);
      var active = !h.disabled && (h === this.activeDrag || h.hover);
      if (active) this.circle(px, py, h.r + 6, { fill: h.color, alpha: 0.22 });
      this.circle(px, py, h.r, { fill: h.color, alpha: h.disabled ? 0.45 : 1, ring: 'stage', ringWidth: 2 });
      if (h.label) this.label(h.label, px, py, { anchor: h.labelAnchor, dx: h.labelAnchor.indexOf('w') >= 0 ? h.r + 3 : -h.r - 3, dy: h.labelAnchor.indexOf('s') >= 0 ? -h.r - 2 : h.r + 2, color: h.color, id: '__drag' + i });
    }
  };
  FP.hit = function (px, py) {
    var best = null, bestD = Infinity;
    for (var i = 0; i < this.drags.length; i++) {
      var h = this.drags[i];
      if (h.hidden || h.disabled) continue;
      var d = Math.hypot(h.plane.X(h.x) - px, h.plane.Y(h.y) - py);
      if (d <= h.r + 12 && d < bestD) { best = h; bestD = d; }
    }
    return best;
  };
  FP.bindPointer = function () {
    var fig = this, canvas = this.canvas;
    var panning = null, down = null;
    /* offsetX is relative to the canvas, so it stays right after the page scrolls under a resting pointer. */
    function local(e) { return [e.offsetX, e.offsetY]; }
    function panAt(p) { return fig.planes.filter(function (P) { return P.panZoom && P.inside(p[0], p[1]); })[0]; }
    function probesAt(p, touch) {
      var changed = false, any = false;
      for (var i = 0; i < fig.probes.length; i++) {
        var pr = fig.probes[i], on = Boolean(p) && pr.plane.inside(p[0], p[1]);
        if (on) { pr.px = p[0]; pr.py = p[1]; pr.active = true; pr.touch = touch; changed = true; any = true; }
        else if (pr.active && (!touch || p)) { pr.active = false; changed = true; }
      }
      canvas.classList.toggle('probe', any);
      return changed;
    }
    if (this.drags.length || this.planes.some(function (P) { return P.panZoom; })) {
      canvas.tabIndex = 0;
      if (this.drags.length) canvas.setAttribute('aria-label', canvas.getAttribute('aria-label') + ' Use the arrow keys to move the point.');
    }
    canvas.addEventListener('pointerdown', function (e) {
      var p = local(e);
      var h = fig.hit(p[0], p[1]);
      down = { x: p[0], y: p[1], h: h };
      if (h) {
        fig.activeDrag = h; fig.keyDrag = h;
        if (h.onStart) h.onStart(h.x, h.y);
        canvas.setPointerCapture(e.pointerId);
        canvas.classList.add('grabbing');
        e.preventDefault();
        canvas.focus({ preventScroll: true });
        fig.redraw();
        return;
      }
      var pz = panAt(p);
      if (pz) { panning = { plane: pz, x: p[0], y: p[1] }; canvas.setPointerCapture(e.pointerId); canvas.classList.add('grabbing'); e.preventDefault(); canvas.focus({ preventScroll: true }); }
      if (fig.probes.length && probesAt(p, e.pointerType === 'touch')) fig.redraw();
    });
    canvas.addEventListener('pointermove', function (e) {
      var p = local(e);
      if (fig.activeDrag) {
        var w = fig.activeDrag.plane.toWorld(p[0], p[1]);
        fig.activeDrag.set(w[0], w[1]);
        return;
      }
      if (panning) {
        panning.plane.pan(p[0] - panning.x, p[1] - panning.y);
        panning.x = p[0]; panning.y = p[1];
        return;
      }
      var h = fig.hit(p[0], p[1]);
      var changed = false;
      for (var i = 0; i < fig.drags.length; i++) { var on = fig.drags[i] === h; if (fig.drags[i].hover !== on) { fig.drags[i].hover = on; changed = true; } }
      canvas.classList.toggle('grab', Boolean(h) || Boolean(panAt(p)));
      if (fig.probes.length && probesAt(h ? null : p, e.pointerType === 'touch')) changed = true;
      if (changed) fig.redraw();
    });
    function end(e) {
      if (down && !down.h && e && e.type === 'pointerup' && Math.hypot(e.offsetX - down.x, e.offsetY - down.y) < 6) {
        for (var i = 0; i < fig.probes.length; i++) {
          var pr = fig.probes[i];
          if (!pr.opts.pick || !pr.plane.inside(down.x, down.y)) continue;
          pr.px = down.x; pr.py = down.y; pr.active = true;
          fig.resolveProbes();
          pr.opts.pick(pr.x, pr.y);
          fig.redraw();
        }
      }
      down = null;
      if (fig.activeDrag || panning) {
        var ended = fig.activeDrag;
        fig.activeDrag = null; panning = null; canvas.classList.remove('grabbing');
        if (ended && ended.onEnd) ended.onEnd(ended.x, ended.y);
        fig.redraw();
      }
    }
    canvas.addEventListener('pointerup', end);
    canvas.addEventListener('pointercancel', function () { down = null; end(null); });
    canvas.addEventListener('pointerleave', function (e) {
      var changed = false;
      for (var i = 0; i < fig.drags.length; i++) if (fig.drags[i].hover) { fig.drags[i].hover = false; changed = true; }
      if (e.pointerType !== 'touch' && !fig.activeDrag) for (var j = 0; j < fig.probes.length; j++) if (fig.probes[j].active) { fig.probes[j].active = false; changed = true; }
      if (changed) fig.redraw();
    });
    /* On touch screens the page scrolls unless the touch starts on a handle or inside a pan-and-zoom plane. */
    canvas.addEventListener('touchstart', function (e) {
      if (e.touches.length !== 1) return;
      var r = canvas.getBoundingClientRect(), t = e.touches[0], p = [t.clientX - r.left, t.clientY - r.top];
      if (fig.hit(p[0], p[1]) || panAt(p)) e.preventDefault();
    }, { passive: false });
    if (fig.planes.some(function (P) { return P.panZoom; })) {
      canvas.addEventListener('wheel', function (e) {
        if (!e.ctrlKey && !e.metaKey) return;
        var p = local(e);
        var P = panAt(p);
        if (!P) return;
        e.preventDefault();
        var w = P.toWorld(p[0], p[1]);
        P.zoom(e.deltaY > 0 ? 1.15 : 1 / 1.15, w[0], w[1]);
      }, { passive: false });
    }
    canvas.addEventListener('keydown', function (e) {
      var h = fig.keyDrag && !fig.keyDrag.hidden && !fig.keyDrag.disabled ? fig.keyDrag : fig.drags.filter(function (q) { return !q.hidden && !q.disabled; })[0];
      if (!h) return;
      var P = h.plane, k = e.shiftKey ? 0.05 : 0.01, many = e.shiftKey ? 10 : 1;
      var dir = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, 1], ArrowDown: [0, -1] }[e.key];
      if (!dir) return;
      e.preventDefault();
      var x = h.x, y = h.y;
      if (dir[0]) {
        if (h.stepX) x += dir[0] * h.stepX * many;
        else if (P.xlog) x = P.toWorld(P.X(x) + dir[0] * P.box.w * k, 0)[0];
        else x += dir[0] * (P.v.x1 - P.v.x0) * k;
      }
      if (dir[1]) {
        if (h.stepY) y += dir[1] * h.stepY * many;
        else if (P.ylog) y = P.toWorld(0, P.Y(y) - dir[1] * P.box.h * k)[1];
        else y += dir[1] * (P.v.y1 - P.v.y0) * k;
      }
      h.set(x, y);
    });
  };

  /* ---------------- Lifecycle ---------------- */

  /* Per figure: prepareMs (its canvas and math labels), initMs (its module's init), firstMs (its first frame), each
     one task, and the steady frames: steadyN of them, with
     median and 95th percentile (frames since the last Kit.resetStats, at most the last 256). frames, avgMs, and maxMs
     count every frame, setup included. pageSetupMs is the kit's one-time page setup. */
  function quantile(sorted, q) { return sorted.length ? sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * q))] : 0; }
  Kit.stats = function () {
    return figs.map(function (f) {
      var st = f.stats, k = Math.min(st.n, st.ring.length), list = Array.prototype.slice.call(st.ring, 0, k).sort(function (a, b) { return a - b; });
      return { name: f.name, id: f.id, ready: f.ready, released: Boolean(f.released), canvasPx: f.canvas ? f.canvas.width * f.canvas.height : 0,
        frames: st.frames, avgMs: st.frames ? st.total / st.frames : 0, maxMs: st.max, prepareMs: st.prepare, initMs: st.init, firstMs: st.first,
        steadyN: k, medianMs: quantile(list, 0.5), p95Ms: quantile(list, 0.95), steadyMaxMs: k ? list[k - 1] : 0, pageSetupMs: Kit.pageSetupMs };
    });
  };
  Kit.resetStats = function () { figs.forEach(function (f) { f.stats.n = 0; }); };

  function start() {
    var els = document.querySelectorAll('.viz[data-viz]');
    if (!els.length) return;
    els.forEach(function (el) { figs.push(new Figure(el)); });
    var byEl = new Map();
    figs.forEach(function (f) { byEl.set(f.el, f); });
    var ro = new ResizeObserver(function (entries) {
      for (var i = 0; i < entries.length; i++) {
        var f = byEl.get(entries[i].target);
        if (!f || !f.ready || f.released) continue;
        var cr = entries[i].contentRect;
        f.resize(cr.width, cr.height);
      }
      schedule();
    });
    var onScreen = new IntersectionObserver(function (entries) {
      for (var i = 0; i < entries.length; i++) {
        var f = byEl.get(entries[i].target);
        f.visible = entries[i].isIntersecting;
        if (f.visible) f.restore();
        f.lastNow = 0;
      }
      schedule();
    });
    var far = new IntersectionObserver(function (entries) {
      for (var i = 0; i < entries.length; i++) if (!entries[i].isIntersecting) byEl.get(entries[i].target).release();
    }, { rootMargin: '700% 0px' });
    var post = global.scheduler && global.scheduler.postTask ? function (fn) { global.scheduler.postTask(fn, { priority: 'user-visible' }); } : function (fn) { setTimeout(fn, 0); };
    function fail(f, err) {
      f.el.setAttribute('data-state', 'error');
      console.error('figure "' + f.name + '" failed: ' + (err && err.stack || err));
    }
    function begin(f) {
      try {
        f.spec = modules[f.name];
        f.prepare(function () {
          post(function () {
            try {
              f.init();
            } catch (err) { fail(f, err); return; }
            ro.observe(f.el);
            onScreen.observe(f.el);
            far.observe(f.el);
          });
        });
      } catch (err) { fail(f, err); }
    }
    function startFigure(f) {
      pending.delete(f);
      near.unobserve(f.el);
      if (modules[f.name]) { begin(f); return; }
      f.el.setAttribute('data-state', 'loading');
      loadModule(f.name).then(begin.bind(null, f), function (err) {
        f.el.setAttribute('data-state', 'error');
        console.error('figure "' + f.name + '" failed to load: ' + (err && err.stack || err));
      });
    }
    /* A figure near the window starts (its module, labels, init, and first frame) only once the reader slows down
       near it: when it has been near for DWELL ms and the page has scrolled slower than SLOW px/s over the last
       SPAN ms, or has not moved for CALM ms. Read at 1,500 px/s, a figure crosses the window in under a second and
       nobody can use it, and its setup would only cost frames. The page position is sampled once per animation frame
       while a figure waits, so a frame the browser was slow to draw does not look like a pause. A jump to an anchor
       (the runtime's mx:land event) starts every figure that comes near in the next LAND ms at once. Until it
       starts, a figure shows its empty stage at its final size. */
    var DWELL = 150, SLOW = 600, SPAN = 250, CALM = 120, LAND = 1500;
    var pending = new Set(), waitRaf = 0, landUntil = 0, samples = [], stillSince = 0, lastY = NaN;
    function waitFrame(now) {
      waitRaf = 0;
      var y = global.scrollY;
      if (y !== lastY) { lastY = y; stillSince = now; }
      samples.push([now, y]);
      while (samples.length > 2 && now - samples[1][0] >= SPAN) samples.shift();
      var span = now - samples[0][0];
      var slow = samples.length >= 4 && span >= SPAN * 0.8 && Math.abs(y - samples[0][1]) * 1000 / span < SLOW;
      var calm = slow || (samples.length >= 4 && now - stillSince >= CALM);
      var landing = performance.now() < landUntil;
      pending.forEach(function (f) { if (landing || (calm && now - f.nearAt >= DWELL)) startFigure(f); });
      if (pending.size) waitRaf = requestAnimationFrame(waitFrame);
      else samples.length = 0;
    }
    function wantPoll() { if (!waitRaf && pending.size) waitRaf = requestAnimationFrame(waitFrame); }
    document.addEventListener('mx:land', function () { landUntil = performance.now() + LAND; wantPoll(); });
    var near = new IntersectionObserver(function (entries) {
      for (var i = 0; i < entries.length; i++) {
        var f = byEl.get(entries[i].target);
        if (!entries[i].isIntersecting) { pending.delete(f); continue; }
        f.nearAt = performance.now();
        pending.add(f);
      }
      wantPoll();
    }, { rootMargin: '600px 0px' });
    figs.forEach(function (f) { near.observe(f.el); });
    /* Read the palette in idle time, before any figure comes near. */
    var idle = window.requestIdleCallback || function (fn) { return setTimeout(fn, 300); };
    idle(function () { if (!palette) { var tp = performance.now(); readPalette(); Kit.pageSetupMs += performance.now() - tp; } }, { timeout: 3000 });
    warmFonts();

    function retheme() {
      readPalette();
      figs.forEach(function (f) { if (f.ready) { f.c = palette; f.dirty = true; } });
      schedule();
    }
    document.addEventListener('mx:theme', retheme);
    if (document.fonts) document.fonts.addEventListener('loadingdone', function () {
      textWidths.clear();
      figs.forEach(function (f) { if (f.ready) { f.texSize = {}; f.labelUnit = null; f.panelW = {}; f.dirty = true; } });
      schedule();
    });
    matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function () { if (!root.hasAttribute('data-theme')) retheme(); });
    reducedQuery.addEventListener('change', function () {
      Kit.reducedMotion = reducedQuery.matches;
      figs.forEach(function (f) { if (f.ready) { f.players.forEach(function (p) { if (Kit.reducedMotion) p.pause(); }); f.dirty = true; } });
      schedule();
    });
    document.addEventListener('visibilitychange', function () {
      if (!document.hidden) { figs.forEach(function (f) { f.lastNow = 0; }); schedule(); }
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})(typeof window !== 'undefined' ? window : globalThis);
