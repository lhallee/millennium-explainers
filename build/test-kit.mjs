// Tests the figure kit's math helpers against mpmath reference values (build/kit-reference.json, written by
// build/gen_kit_data.py). Prints one line per point and exits with status 1 if any error exceeds its tolerance.
//
//   node build/test-kit.mjs

import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
// The kit attaches itself to globalThis when there is no window. It runs in this context, not a vm sandbox, so that
// the speed measurement below is not slowed by sandboxed global lookups.
for (const f of ['shared/viz/kit.js', 'shared/viz/zeros.js']) vm.runInThisContext(fs.readFileSync(path.join(ROOT, f), 'utf8'), { filename: f });
const { Kit } = globalThis;
const M = Kit.math;
const ref = JSON.parse(fs.readFileSync(path.join(ROOT, 'build', 'kit-reference.json'), 'utf8'));

let failed = 0;
// Relative error, or absolute error where the true value is below 1e-6 (near a zero, relative error means nothing).
function err(got, want) {
  const d = Math.hypot(got[0] - want[0], got[1] - want[1]);
  const m = Math.hypot(want[0], want[1]);
  return m < 1e-6 ? { e: d, kind: 'abs' } : { e: d / m, kind: 'rel' };
}
function line(label, e, tol) {
  const ok = e.e <= tol;
  if (!ok) failed++;
  console.log(`${ok ? 'ok  ' : 'FAIL'} ${label.padEnd(26)} ${e.kind} error ${e.e.toExponential(2)}`);
}

console.log('zeta(s), Euler-Maclaurin for Re s >= 1/2, functional equation below');
for (const { s, value } of ref.zeta) {
  const z = M.zeta(s[0], s[1]);
  line(`s = ${s[0]} ${s[1] < 0 ? '-' : '+'} ${Math.abs(s[1])}i`, err([z.re, z.im], value), 1e-6);
}
console.log('Gamma(z)');
for (const { z, value } of ref.gamma) {
  const g = M.gamma(M.C(z[0], z[1]));
  line(`z = ${z[0]} ${z[1] < 0 ? '-' : '+'} ${Math.abs(z[1])}i`, err([g.re, g.im], value), 1e-10);
}
console.log('Riemann-Siegel Z(t)');
for (const { t, value } of ref.Z) line(`t = ${t}`, err([M.Z(t), 0], [value, 0]), 1e-6);
console.log('li(x)');
for (const { x, value } of ref.li) line(`x = ${x}`, err([M.li(x), 0], [value, 0]), 1e-12);
console.log('zero table');
for (let i = 0; i < 3; i++) line(`gamma_${i + 1}`, err([Kit.zeros[i], 0], [ref.zeros_first_three[i], 0]), 1e-10);
const expected = [14.134725, 21.022040, 25.010858];
for (let i = 0; i < 3; i++) if (Kit.zeros[i].toFixed(6) !== expected[i].toFixed(6)) { console.log(`FAIL zero ${i + 1} is ${Kit.zeros[i]}`); failed++; }
if (Kit.zeros.length !== 200) { console.log(`FAIL zero table has ${Kit.zeros.length} entries`); failed++; }
console.log('primes');
const checks = [[M.pi(100), 25], [M.pi(1e5), 9592], [M.primes(30).length, 10], [M.vonMangoldt(8), Math.log(2)], [M.vonMangoldt(12), 0], [M.mobius(30), -1], [M.mobius(12), 0]];
for (const [got, want] of checks) line(`${want}`, err([got, 0], [want, 0]), 1e-12);
let psi100 = 0;
for (let n = 2; n <= 100; n++) {
  let m = n, p = 2;
  while (m % p !== 0) p++;
  while (m % p === 0) m /= p;
  if (m === 1) psi100 += Math.log(p);
}
line('psi(100)', err([M.psi(100), 0], [psi100, 0]), 1e-12);

// Exact checks: strings, indices, and tables that must match bit for bit.
function same(label, got, want) {
  const ok = got === want;
  if (!ok) failed++;
  console.log(`${ok ? 'ok  ' : 'FAIL'} ${label.padEnd(26)} ${JSON.stringify(got)}${ok ? '' : ` (want ${JSON.stringify(want)})`}`);
}
console.log('number formats');
const F = Kit.fmt;
same('fmt int', F(1234567), '1,234,567');
same('fmt negative, 2 digits', F(-1234.567, 2), '−1,234.57');
same('fmt default decimals', F(0.5), '0.50');
same('fmt negative zero', F(-0.001, 2), '0.00');
same('fmt sep: false', F(12345.6, { digits: 1, sep: false }), '12345.6');
same('signed', F.signed(3.25, 1), '+3.3');
same('signed zero', F.signed(0, 1), '0.0');
same('sci', F.sci(1500000), '1.5×10⁶');
same('sci mantissa 1', F.sci(1e6, 1), '10⁶');
same('sci rounds up', F.sci(9.96e4, 1), '10⁵');
same('sci negative small', F.sci(-2.5e-7, 2), '−2.50×10⁻⁷');
same('pow10', F.pow10(-3), '10⁻³');
same('compact plain', F.compact(12345), '12,345');
same('compact small', F.compact(0.0123), '0.012');
same('compact large', F.compact(1e6), '10⁶');
same('step 0.5', F.step(0.5)(-1), '−1.0');
same('step 1000', F.step(1000)(20000), '20,000');
same('step zero', F.step(0.1)(-1e-17), '0.0');
same('complex', F.complex(0.5, -14.134725), '0.50 − 14.13i');
same('sig', [F.sig(1127.197), F.sig(45.31), F.sig(0.1234), F.sig(112700), F.sig(0)].join(' '), '1,127 45.3 0.123 1.13×10⁵ 0');
same('sig below 1', [F.sig(0.0278), F.sig(-0.0278), F.sig(0.5), F.sig(0.0099)].join(' '), '0.0278 −0.0278 0.500 9.90×10⁻³');
same('sig near a power of 10', [F.sig(9.996), F.sig(0.09996), F.sig(99.97), F.sig(99999.6)].join(' '), '10.0 0.100 100 10⁵');
same('step 0.25', [F.step(0.25)(0.75), F.step(0.25)(-0.25), F.step(0.125)(0.375), F.step(2.5)(7.5)].join(' '), '0.75 −0.25 0.375 7.5');
same('complex sig', F.complex(0.0278, -112700, 'sig'), '0.0278 − 1.13×10⁵i');
same('sub', F.sub(12), '₁₂');
same('infinity', F(-Infinity), '−∞');
let threw = false;
try { F.sup('a'); } catch (e) { threw = true; }
same('sup rejects letters', threw, true);
console.log('scales and search');
const lg = Kit.scale('log', 100, 1e6);
line('log scale to(0.5)', err([lg.to(0.5), 0], [1e4, 0]), 1e-12);
line('log scale from(1e5)', err([lg.from(1e5), 0], [0.75, 0]), 1e-12);
const sq = Kit.scale('sqrt', 0, 200);
line('sqrt scale round trip', err([sq.from(sq.to(0.3)), 0], [0.3, 0]), 1e-12);
const arr = [1, 3, 3, 7];
same('lowerBound', Kit.lowerBound(arr, 3), 1);
same('upperBound', Kit.upperBound(arr, 3), 3);
same('upperBound past end', Kit.upperBound(arr, 9), 4);
same('zeros below 100', Kit.upperBound(Kit.zeros, 100), 29);
const long = Kit.zeroOrdinates();
same('long zero table length', long.length, 1500);
same('long table agrees with the 200', Kit.zeros.every((z, i) => Math.abs(long[i] - z) < 6e-11), true);
same('long table increases', long.every((z, i) => i === 0 || z > long[i - 1]), true);
line('gamma_1 at full precision', err([long[0], 0], [ref.zeros_first_three[0], 0]), 1e-15);
same('zeroOrdinates(10) length', Kit.zeroOrdinates(10).length, 10);
const mt = M.mertensTask(100000);
while (!mt.done) mt.step(50);
same('Mertens M(10), M(1000), M(1e5)', [mt.result.M[10], mt.result.M[1000], mt.result.M[100000]].join(' '), '-1 2 -48');
same('Moebius from the task', [2, 4, 6, 30, 97, 100].map((n) => mt.result.mu[n]).join(' '), [2, 4, 6, 30, 97, 100].map((n) => M.mobius(n)).join(' '));
console.log('sliced sieve');
// The sieve built as a task must equal the synchronous sieve and must yield often. step(0) runs exactly one piece
// between yields, so the count of pieces does not depend on the machine's speed.
const task = M.sieveTask(2_000_000);
let pieces = 0, longest = 0;
while (!task.done) { const t0 = performance.now(); task.step(0); longest = Math.max(longest, performance.now() - t0); pieces++; }
same('task limit', M.sieveLimit(), 2_000_000);
same('pi(2e6)', M.pi(2e6), 148933);
same('primes(2e6) length', M.primes(2e6).length, 148933);
line('psi(2e6) vs pi-free sum', err([M.psi(2e6), 0], [M.primes(2e6).reduce((s, p) => { let q = p, k = 0; while (q <= 2e6) { q *= p; k++; } return s + k * Math.log(p); }, 0), 0]), 1e-12);
same('task shared by key', M.sieveTask(2_000_000), task);
same('sieve yields at least 100 times', pieces >= 100, true);
console.log(`     sieve to 2e6 in ${pieces} pieces, longest ${longest.toFixed(1)} ms`);

// Speed of one zeta evaluation, which sets the cost of domain coloring.
for (const t of [20, 60, 200]) {
  const n = 20000;
  const out = [0, 0];
  const t0 = performance.now();
  for (let i = 0; i < n; i++) M.zetaInto(0.3 + (i % 7) * 0.1, t + (i % 13) * 0.01, out);
  console.log(`speed: zeta at |t| near ${t}: ${((performance.now() - t0) * 1000 / n).toFixed(2)} microseconds per value`);
}

console.log(failed ? `${failed} failure(s)` : 'all passed');
process.exit(failed ? 1 : 0);
