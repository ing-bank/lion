/**
 * Proves where the gate looks for the repo, because getting it wrong is invisible: the gate reported
 * "no pnpm-lock.yaml in this repo — nothing to guard" and exit 0 for every CI run while it was wired as
 * `npm run lockfile:check --workspace @lion/lockfile-interop` (npm and pnpm both run a workspace script with
 * the *package's* directory as cwd). A gate that never compares anything is worse than no gate.
 *
 * So the root is the enclosing git work tree, which is where the locks are, and the CLI is exercised the way
 * the workspace script invokes it - from inside the package directory.
 */
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { expect } from 'chai';
import { resolveRepoRoot } from '../src/repo-root.js';
import { withFixtureRepo } from './test-helpers.js';

describe('resolveRepoRoot', () => {
  it('resolves the enclosing git work tree from a nested directory', async () => {
    await withFixtureRepo({}, repo => {
      execFileSync('git', ['init', '-q'], { cwd: repo.root });
      const nested = path.join(repo.root, 'packages-node', 'some-package');
      fs.mkdirSync(nested, { recursive: true });
      expect(resolveRepoRoot(nested)).to.equal(fs.realpathSync(repo.root));
    });
  });

  it('falls back to the directory itself outside a git work tree', () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'lockfile-interop-nogit-'));
    try {
      expect(resolveRepoRoot(dir)).to.equal(fs.realpathSync(dir));
    } finally {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  });
});

describe('the gate when it is run from a workspace package directory', () => {
  it('compares the repo locks instead of reporting that there is nothing to guard', async () => {
    await withFixtureRepo({ semverLockVersion: '6.3.0' }, repo => {
      execFileSync('git', ['init', '-q'], { cwd: repo.root });
      // tracked, or the CLI would also report the untracked workspace file and muddle the assertion
      execFileSync('git', ['add', '-A'], { cwd: repo.root });
      const pkgDir = path.join(repo.root, 'pkgs', 'lib-a');
      const cli = new URL('../src/cli.js', import.meta.url).pathname;
      /** @type {{status: number, stdout: string, stderr: string}} */
      let result;
      try {
        const stdout = execFileSync(process.execPath, [cli, 'check', '--declared'], {
          cwd: pkgDir,
          encoding: 'utf8',
        });
        result = { status: 0, stdout, stderr: '' };
      } catch (error) {
        const err = /** @type {import('node:child_process').ExecFileSyncError} */ (error);
        result = { status: err.status ?? 1, stdout: err.stdout ?? '', stderr: err.stderr ?? '' };
      }
      expect(result.status).to.equal(
        1,
        `expected drift to fail, got ${result.stdout}${result.stderr}`,
      );
      expect(result.stdout).to.contain('semver -> pnpm 6.3.1 | npm 6.3.0');
      expect(result.stdout).to.not.contain('nothing to guard');
    });
  });
});
