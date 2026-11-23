// Builds explainer pages.
//
//   node build/build.mjs                 every problem whose folder does not start with "_"
//   node build/build.mjs riemann _demo   the named problems
//   --draft                              a missing figure or chapter becomes a placeholder, listed at the end
//   --problems <dir> --out <dir>         read problems from and write pages to other folders (for stress tests)
//
// Output: <out>/<problem>/index.html, one self-contained file, and <out>/index.html, a landing page. The build
// prints every error with its file and line and exits with status 1 if there is any, or if a page exceeds 6 MB.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildProblem, ROOT } from './lib/problem.mjs';
import { landingPage } from './lib/page.mjs';
import * as yaml from 'js-yaml';

export const SIZE_LIMIT = 6_000_000;

export function parseArgs(argv) {
  const args = { problems: [], draft: process.env.npm_config_draft === 'true', problemsDir: path.join(ROOT, 'problems'), outDir: path.join(ROOT, 'docs'), quiet: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--draft') args.draft = true;
    else if (a === '--quiet') args.quiet = true;
    else if (a === '--problems') args.problemsDir = path.resolve(argv[++i]);
    else if (a === '--out') args.outDir = path.resolve(argv[++i]);
    else if (a.startsWith('--')) throw new Error(`unknown option ${a}`);
    else args.problems.push(a);
  }
  return args;
}

const mb = (n) => `${(n / 1e6).toFixed(2)} MB`;
const kb = (n) => `${(n / 1e3).toFixed(1)} kB`;

export function runBuild(args) {
  const started = Date.now();
  let names = args.problems;
  if (!names.length) {
    names = fs.readdirSync(args.problemsDir).filter((d) => !d.startsWith('_') && fs.existsSync(path.join(args.problemsDir, d, 'problem.yml')));
  }
  let failed = false;
  for (const name of names) {
    const problemDir = path.join(args.problemsDir, name);
    if (!fs.existsSync(problemDir)) { console.error(`error: no problem folder ${problemDir}`); failed = true; continue; }
    const t0 = Date.now();
    const result = buildProblem({ problemDir, draft: args.draft });
    for (const w of result.warnings) console.warn(`warning: ${w.file}${w.line ? `:${w.line}` : ''}: ${w.msg}`);
    if (result.missingFigures && result.missingFigures.length) {
      console.warn(`\nDraft: ${result.missingFigures.length} figure(s) not written yet:`);
      for (const f of result.missingFigures) console.warn(`  ${f.name}  (${f.file}:${f.line})`);
    }
    if (result.errors.length) {
      console.error(`\n${name}: ${result.errors.length} error(s)`);
      for (const e of result.errors) console.error(`error: ${e.file}${e.line ? `:${e.line}` : ''}: ${e.msg}`);
      failed = true;
      continue;
    }
    const outFile = path.join(args.outDir, name, 'index.html');
    fs.mkdirSync(path.dirname(outFile), { recursive: true });
    fs.writeFileSync(outFile, result.html);
    const s = result.sizes;
    const st = result.stats;
    console.log(`${name}: wrote ${path.relative(ROOT, outFile) || outFile} in ${Date.now() - t0} ms`);
    console.log(`  size ${mb(s.total)} (${s.total.toLocaleString('en-US')} bytes): text markup ${kb(s.prose - s.references)} (with the formulas' TeX), references ${kb(s.references)}, formula table ${kb(s.tablePacked)} packed (${kb(s.tableRaw)} raw, ${s.formulas} distinct formulas in ${s.chunks} chunks), fonts ${kb(s.fonts)} (${s.fontFiles.length} KaTeX faces), styles ${kb(s.styles)}, glossary ${kb(s.glossary)}, runtime ${kb(s.runtime)}`);
    if (s.viz.kitRaw) console.log(`  figures: kit ${kb(s.viz.kit)} packed (${kb(s.viz.kitRaw)} raw), modules ${kb(s.viz.modules)} packed (${kb(s.viz.modulesRaw)} raw), math labels ${kb(s.viz.labels)} packed (${kb(s.viz.labelsRaw)} raw)`);
    console.log(`  ${st.chapters} chapters, ${st.formulas} formulas, ${st.figures} figure modules, ${st.terms} glossary terms, ${st.references} references`);
    if (s.total > SIZE_LIMIT) {
      console.error(`error: ${name} is ${mb(s.total)}, above the limit of ${mb(SIZE_LIMIT)}`);
      failed = true;
    }
  }

  if (args.outDir === path.join(ROOT, 'docs')) {
    const listed = fs.readdirSync(args.problemsDir)
      .filter((d) => !d.startsWith('_') && fs.existsSync(path.join(args.problemsDir, d, 'problem.yml')))
      .map((d) => {
        const p = yaml.load(fs.readFileSync(path.join(args.problemsDir, d, 'problem.yml'), 'utf8')) || {};
        return { id: d, title: p.title || d, subtitle: p.subtitle || '' };
      });
    fs.mkdirSync(args.outDir, { recursive: true });
    fs.writeFileSync(path.join(args.outDir, 'index.html'), landingPage(listed, path.join(ROOT, 'shared')));
  }
  if (!args.quiet) console.log(`done in ${Date.now() - started} ms${failed ? ', with errors' : ''}`);
  return !failed;
}

const invokedDirectly = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (invokedDirectly) {
  let ok = false;
  try {
    ok = runBuild(parseArgs(process.argv.slice(2)));
  } catch (err) {
    console.error(`error: ${err.stack || err.message}`);
  }
  process.exit(ok ? 0 : 1);
}
