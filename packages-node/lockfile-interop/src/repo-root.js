// @ts-check
import { execFileSync } from 'node:child_process';
import path from 'node:path';

/**
 * The repo the locks belong to, resolved the way the gate is actually invoked: `pnpm run` executes a
 * workspace script with the *package's* directory as cwd (npm does the same), so a gate that defaults to
 * `process.cwd()` compares nothing and reports success - it silently skipped every run while it was wired
 * as `npm run lockfile:check --workspace @lion/lockfile-interop`.
 *
 * So: an explicit `--root` wins, then the enclosing git work tree (which is where the locks are), and only
 * then the current directory (outside a git repo, e.g. in the package's own tests).
 *
 * @param {string} startDir
 * @returns {string}
 */
export function resolveRepoRoot(startDir) {
  try {
    const top = execFileSync('git', ['rev-parse', '--show-toplevel'], {
      cwd: startDir,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
    if (top) return path.resolve(top);
  } catch {
    // not a git work tree — fall through to the current directory
  }
  return path.resolve(startDir);
}
