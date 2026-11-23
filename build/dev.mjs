// Rebuilds a problem in draft mode whenever its folder or the shared files change.
//
//   npm run dev riemann
//
// Open docs/<problem>/index.html in a browser and reload after each rebuild.

import fs from 'node:fs';
import path from 'node:path';
import { ROOT } from './lib/problem.mjs';
import { runBuild, parseArgs } from './build.mjs';

const args = parseArgs(process.argv.slice(2));
args.draft = true;
if (!args.problems.length) throw new Error('name a problem: npm run dev riemann');
const watched = [path.join(ROOT, 'shared'), ...args.problems.map((p) => path.join(args.problemsDir, p))];

let timer = null;
const rebuild = () => {
  timer = null;
  try { runBuild(args); } catch (err) { console.error(`error: ${err.stack || err.message}`); }
};
rebuild();
for (const dir of watched) {
  fs.watch(dir, { recursive: true }, () => { clearTimeout(timer); timer = setTimeout(rebuild, 200); });
}
console.log(`watching ${watched.map((d) => path.relative(ROOT, d)).join(', ')}; Ctrl+C stops`);
