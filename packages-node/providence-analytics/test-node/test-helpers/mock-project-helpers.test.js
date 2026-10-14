import { spawnSync } from 'child_process';
import { expect } from 'chai';
import fs from 'fs';
import module from 'module';
import path from 'path';
import { fileURLToPath } from 'url';
import { it } from 'mocha';
import { mock, resolveDynamicImportsForMockFs } from '#test-helpers/mock-project-helpers.js';

const require = module.createRequire(import.meta.url);

const dynamicImports = [
  { name: 'oxc-parser', siblings: ['@oxc-parser'] },
  { name: '@babel/parser' },
];

/**
 * The node_modules dir the module loader stats for a package, walking up from this file.
 *
 * This mirrors the lookup the loader performs, which is *not* the same path as
 * `require.resolve` returns: that one has symlinks collapsed, and mock-fs keeps the loader
 * on the un-collapsed (lookup) path by patching `fs.realpathSync`.
 * @param {string} name
 * @returns {string|null}
 */
function lookupPathForPackage(name) {
  const scope = name.startsWith('@') ? name.split('/')[0] : name;
  let dir = path.dirname(fileURLToPath(import.meta.url));
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const candidate = path.join(dir, 'node_modules', scope);
    if (fs.existsSync(candidate)) {
      return candidate;
    }
    const parentDir = path.dirname(dir);
    if (parentDir === dir) {
      return null;
    }
    dir = parentDir;
  }
}

describe('resolveDynamicImportsForMockFs', () => {
  afterEach(() => {
    mock.restore();
  });

  it('returns existing node_modules roots, deduplicated', () => {
    const importablePaths = resolveDynamicImportsForMockFs();

    expect(importablePaths).to.not.be.empty;
    expect(new Set(importablePaths).size).to.equal(importablePaths.length);
    for (const importablePath of importablePaths) {
      expect(fs.existsSync(importablePath), `${importablePath} does not exist`).to.be.true;
    }
  });

  it('covers the lookup path of every dynamic import, not just its symlink target', () => {
    const importablePaths = resolveDynamicImportsForMockFs();

    for (const { name } of dynamicImports) {
      let resolvable = true;
      try {
        require.resolve(name);
      } catch {
        resolvable = false; // e.g. @babel/parser when optional deps are omitted
      }
      if (!resolvable) {
        continue; // eslint-disable-line no-continue
      }
      const lookupPath = lookupPathForPackage(name);
      expect(lookupPath, `no node_modules/${name} found next to the test file`).to.not.equal(null);
      expect(
        importablePaths,
        `${lookupPath} is not mocked; a dynamically imported ${name} cannot be found ` +
          'while the file system is mocked (symlinked node_modules, e.g. a git worktree)',
      ).to.include(lookupPath);
    }
  });

  it('resolves a lazily imported parser in a child process while the file system is mocked', () => {
    // The ESM cache makes an in-process check meaningless (other suites already imported these
    // lazily), so this asserts the real contract in a fresh process: mock the fs the way
    // `mockProject` does, then dynamically import a native dependency.
    const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
    const script = `
      import { mock, resolveDynamicImportsForMockFs } from './test-helpers/mock-project-helpers.js';
      const importablePaths = resolveDynamicImportsForMockFs();
      mock({ ...Object.fromEntries(importablePaths.map(p => [p, mock.load(p)])) });
      try {
        const oxcParser = await import('oxc-parser');
        process.stdout.write(\`OK \${typeof oxcParser.parseSync}\`);
      } catch (e) {
        process.stdout.write(\`FAIL \${e.code || e.message}\`);
      } finally {
        mock.restore();
      }
    `;
    const { stdout, status } = spawnSync(process.execPath, ['--input-type=module', '-e', script], {
      cwd: packageRoot,
      encoding: 'utf8',
    });

    expect(status, `child process exited with ${status}`).to.equal(0);
    expect(
      stdout.trim(),
      'a lazily imported native dependency must resolve inside a mocked fs (see getPackageLookupRoots)',
    ).to.equal('OK function');
  });
});
