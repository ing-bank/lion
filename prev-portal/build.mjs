/**
 * Runs the frozen legacy rocket build (the site published under /prev).
 *
 * The rocket cli needs two things from the repository root, which is why this wrapper exists and
 * why the package itself lives outside the workspace:
 *  - its cwd: the pages it builds are the repository's own `docs/` tree, and the url/data files
 *    that root generates (`.eleventyignore`, `CNAME`, `docs/_merged_*`) are all cwd relative;
 *  - NODE_PATH: the `.11tydata.cjs` files inside `docs/` and the `docs/_merged_data/*.cjs` files
 *    rocket writes there `require('@rocket/cli')`, and a CommonJS require only walks up the
 *    directory tree, so from `docs/` it would never look in this package's node_modules.
 */
import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const packageDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(packageDir, '..');
const rocketBin = path.join(
  packageDir,
  'node_modules',
  '.bin',
  process.platform === 'win32' ? 'rocket.cmd' : 'rocket',
);

const [command = 'build'] = process.argv.slice(2);

const child = spawn(rocketBin, ['-c', 'prev-portal/rocket.config.mjs', command], {
  cwd: repoRoot,
  stdio: 'inherit',
  env: { ...process.env, NODE_PATH: path.join(packageDir, 'node_modules') },
});

child.on('exit', code => {
  process.exit(code ?? 1);
});
