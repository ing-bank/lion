import { execFileSync } from 'node:child_process';
import { promises as fs } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { expect } from 'chai';

import { changedPackagesInLockfile, packageNameOfLockKey } from '../src/lockfile.js';
import { listTestFiles, packageOf, selectTests } from '../src/select.js';

/**
 * A tiny repository: two components that share a file, both with a test, and a lockfile.
 */
async function createFixture() {
  // realpath: on Windows `os.tmpdir()` can hand out the short (8.3) form while git reports long
  // paths, and then `path.relative` between the two is nonsense.
  const root = await fs.realpath(await fs.mkdtemp(path.join(os.tmpdir(), 'change-graph-')));
  const files = {
    'package.json': JSON.stringify({ name: 'fixture', private: true, workspaces: ['packages/*'] }),
    'package-lock.json': JSON.stringify({
      lockfileVersion: 3,
      packages: {
        'node_modules/lit': {
          version: '3.3.3',
          resolved: 'https://registry.npmjs.org/lit/-/lit-3.3.3.tgz',
        },
        'node_modules/@scope/tool': { version: '1.0.0', dev: true },
      },
    }),
    'packages/a/src/a.js': "import './shared.js';\nexport const a = 1;\n",
    'packages/a/src/shared.js': 'export const shared = 1;\n',
    'packages/a/test/a.test.js': "import '../src/a.js';\n",
    'packages/a/test/a.sr.test.js': "import '../src/a.js';\n",
    'packages/b/src/b.js': "import '../../a/src/shared.js';\nexport const b = 1;\n",
    'packages/b/test/b.test.js': "import '../src/b.js';\n",
    'packages/b/test/other.test.js': "import '../src/b.js';\n",
  };
  for (const [file, content] of Object.entries(files)) {
    const full = path.join(root, file);
    await fs.mkdir(path.dirname(full), { recursive: true });
    await fs.writeFile(full, content);
  }
  execFileSync('git', ['init', '-q'], { cwd: root });
  execFileSync('git', ['add', '.'], { cwd: root });
  execFileSync(
    'git',
    ['-c', 'user.name=t', '-c', 'user.email=t@example.com', 'commit', '-qm', 'fixture'],
    { cwd: root },
  );
  return root;
}

describe('change-graph selection', () => {
  /** @type {string} */
  let root;

  before(async () => {
    root = await createFixture();
  });

  after(async () => {
    await fs.rm(root, { recursive: true, force: true });
  });

  it('lists the test files once, and keeps the screen reader tests out of the browser set', () => {
    // Overlapping globs must not hand the runner the same file twice.
    const testFiles = listTestFiles(
      root,
      ['packages/*/test/*.test.js', 'packages/*/test/*.test.js'],
      ['**/*.sr.test.js'],
    );
    expect(testFiles).to.deep.equal([
      path.normalize('packages/a/test/a.test.js'),
      path.normalize('packages/b/test/b.test.js'),
      path.normalize('packages/b/test/other.test.js'),
    ]);
    expect(listTestFiles(root, ['packages/*/test/*.sr.test.js'])).to.deep.equal([
      path.normalize('packages/a/test/a.sr.test.js'),
    ]);
  });

  it('adds the screen reader tests only when they are asked for', async () => {
    const without = await selectTests({ cwd: root, changedFiles: ['packages/a/src/a.js'] });
    expect(without.testFiles).to.not.include(path.normalize('packages/a/test/a.sr.test.js'));
    const withSr = await selectTests({
      cwd: root,
      changedFiles: ['packages/a/src/a.js'],
      includeSr: true,
    });
    expect(withSr.testFiles).to.include(path.normalize('packages/a/test/a.sr.test.js'));
  });

  it('does not spend a full run on documentation inside an always-full directory', async () => {
    const selection = await selectTests({
      cwd: root,
      changedFiles: ['packages-node/test-runner-screenreader/README.md'],
    });
    expect(selection.full).to.equal(false);
  });

  it('runs everything when the screen reader test runner itself changed', async () => {
    const selection = await selectTests({
      cwd: root,
      changedFiles: ['packages-node/test-runner-screenreader/src/commands.js'],
    });
    expect(selection.full).to.equal(true);
  });

  it('selects every unit that reaches a changed file', async () => {
    const selection = await selectTests({
      cwd: root,
      changedFiles: ['packages/a/src/shared.js'],
    });
    expect(selection.full).to.equal(false);
    expect(selection.units).to.deep.equal([
      path.normalize('packages/a/test'),
      path.normalize('packages/b/test'),
    ]);
    expect(selection.testFiles).to.have.length(3);
  });

  it('selects one unit for a change only that unit reaches', async () => {
    const selection = await selectTests({ cwd: root, changedFiles: ['packages/a/src/a.js'] });
    expect(selection.units).to.deep.equal([path.normalize('packages/a/test')]);
    expect(selection.testFiles).to.deep.equal([path.normalize('packages/a/test/a.test.js')]);
  });

  it('selects the unit of a changed test file itself', async () => {
    const selection = await selectTests({
      cwd: root,
      changedFiles: ['packages/b/test/other.test.js'],
    });
    expect(selection.units).to.deep.equal([path.normalize('packages/b/test')]);
  });

  it('does not silently skip a change nothing can reach', async () => {
    const selection = await selectTests({ cwd: root, changedFiles: ['README.md'] });
    expect(selection.full).to.equal(false);
    expect(selection.units).to.deep.equal([]);
    expect(selection.reasons.join(' ')).to.include('not in the graph');
  });

  it('runs everything when a file that changes how tests run changed', async () => {
    const selection = await selectTests({ cwd: root, changedFiles: ['package-lock.json'] });
    expect(selection.full).to.equal(true);
    expect(selection.reasons.join(' ')).to.include('run everything');
    expect(selection.testFiles).to.have.length(3);
  });

  it('runs everything when the working tree changes the lockfile', async () => {
    const lockPath = path.join(root, 'package-lock.json');
    const original = await fs.readFile(lockPath, 'utf8');
    try {
      await fs.writeFile(
        lockPath,
        JSON.stringify({
          lockfileVersion: 3,
          packages: {
            'node_modules/lit': {
              version: '3.4.0',
              resolved: 'https://registry.npmjs.org/lit/-/lit-3.4.0.tgz',
            },
            'node_modules/@scope/tool': { version: '1.0.0', devOptional: true },
          },
        }),
      );
      const selection = await selectTests({ cwd: root });
      expect(selection.changedDependencies).to.include('lit');
      // The dev/devOptional flags of an entry say nothing about what a test consumes.
      expect(selection.changedDependencies).to.not.include('@scope/tool');
    } finally {
      await fs.writeFile(lockPath, original);
    }
  });

  it('runs everything when the target branch has no merge base', async () => {
    const selection = await selectTests({ cwd: root, mode: 'pr', base: 'no-such-branch' });
    expect(selection.full).to.equal(true);
    expect(selection.reasons.join(' ')).to.include('no merge base');
  });
});

describe('change-graph lockfiles', () => {
  it('reads the package name out of npm and pnpm lock keys', () => {
    expect(packageNameOfLockKey('node_modules/@scope/name')).to.equal('@scope/name');
    expect(packageNameOfLockKey('node_modules/@scope/name/node_modules/other')).to.equal('other');
    expect(packageNameOfLockKey('@scope/name@1.2.3')).to.equal('@scope/name');
    expect(packageNameOfLockKey('/@scope/name@1.2.3(peer@1.0.0)')).to.equal('@scope/name');
    expect(packageNameOfLockKey('plain@2.0.0')).to.equal('plain');
  });

  it('sees a version change, and ignores a flag-only rewrite', () => {
    const before = {
      packages: {
        'node_modules/lit': { version: '3.3.3', integrity: 'sha512-a' },
        'node_modules/eslint': { version: '9.0.0' },
      },
    };
    const after = {
      packages: {
        'node_modules/lit': { version: '3.4.0', integrity: 'sha512-a' },
        'node_modules/eslint': { version: '9.0.0', dev: true },
      },
    };
    const changed = changedPackagesInLockfile('npm', JSON.stringify(before), JSON.stringify(after));
    expect([...changed.keys()]).to.deep.equal(['lit']);
  });

  it('reads a pnpm lockfile', () => {
    const before = `
lockfileVersion: '9.0'
packages:
  '@scope/name@1.0.0':
    resolution: {integrity: sha512-a}
snapshots:
  '@scope/name@1.0.0': {}
`;
    const after = `
lockfileVersion: '9.0'
packages:
  '@scope/name@1.1.0':
    resolution: {integrity: sha512-b}
snapshots:
  '@scope/name@1.1.0': {}
`;
    const changed = changedPackagesInLockfile('pnpm', before, after);
    expect([...changed.keys()]).to.deep.equal(['@scope/name']);
  });

  it('maps a module request to its package', () => {
    expect(packageOf('@lion/ui/define/lion-input-iban.js')).to.equal('@lion/ui');
    expect(packageOf('lit/decorators.js')).to.equal('lit');
    expect(packageOf('./local.js')).to.equal('');
    expect(packageOf('#internal/alias.js')).to.equal('');
  });
});
