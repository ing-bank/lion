/**
 * Proves the pnpm `readPackage` hook that makes a local pnpm install follow the committed package-lock.json.
 *
 * Without it `pnpm import` / `pnpm install` re-resolve every range to the newest registry match, so the pnpm
 * tree drifted from the npm lock as soon as a dependency published (measured: 22 declared edges, e.g.
 * `mocha ^10` -> pnpm 10.8.2 | npm 10.7.3). With it, every registry range is the exact version npm installs
 * for that same edge, so the same package-lock.json always yields the same pnpm tree.
 */
import { mkdtempSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { expect } from 'chai';

const require = createRequire(import.meta.url);
const { createHooks, resolveFrom } = require('../src/pin-to-npm-lock.cjs');

const lock = {
  lockfileVersion: 3,
  packages: {
    '': {
      name: '@fixture/root',
      devDependencies: { mocha: '^10.0.0', '@fixture/member': '^1.0.0' },
    },
    'packages/member': {
      version: '1.0.0',
      dependencies: { parse5: '^8.0.0', local: 'file:../local' },
    },
    'node_modules/@fixture/member': { resolved: 'packages/member', link: true },
    'node_modules/mocha': { version: '10.7.3', dependencies: { debug: '^4.3.5' } },
    'node_modules/debug': { version: '4.3.7' },
    'node_modules/mocha/node_modules/debug': { version: '4.3.4' },
    'node_modules/parse5': { version: '8.0.0' },
    'node_modules/a': { version: '1.0.0', dependencies: { ms: '^2.0.0' } },
    'node_modules/a/node_modules/ms': { version: '2.0.0' },
    'node_modules/b/node_modules/a': { version: '1.0.0', dependencies: { ms: '^2.0.0' } },
    'node_modules/ms': { version: '2.1.3' },
  },
};

function hooksFor(fixture) {
  const dir = mkdtempSync(path.join(tmpdir(), 'pin-to-npm-lock-'));
  writeFileSync(path.join(dir, 'package-lock.json'), JSON.stringify(fixture));
  return createHooks(dir);
}

describe('pin-to-npm-lock', () => {
  it('resolves an edge from the requirer path the way Node walks node_modules', () => {
    expect(resolveFrom(lock.packages, 'node_modules/mocha', 'debug')).to.equal('4.3.4');
    expect(resolveFrom(lock.packages, 'node_modules/parse5', 'debug')).to.equal('4.3.7');
    expect(resolveFrom(lock.packages, 'packages/member', 'parse5')).to.equal('8.0.0');
  });

  it('pins registry ranges of a dependency to the version npm installs for that edge', () => {
    const { hooks } = hooksFor(lock);
    const mocha = hooks.readPackage({
      name: 'mocha',
      version: '10.7.3',
      dependencies: { debug: '^4.3.5' },
    });
    expect(mocha.dependencies.debug).to.equal('4.3.4');
  });

  it('pins the root and workspace members, which npm records without a name', () => {
    const { hooks } = hooksFor(lock);
    const root = hooks.readPackage({
      name: '@fixture/root',
      devDependencies: { mocha: '^10.0.0' },
    });
    expect(root.devDependencies.mocha).to.equal('10.7.3');
    const member = hooks.readPackage({
      name: '@fixture/member',
      version: '1.0.0',
      dependencies: { parse5: '^8.0.0', local: 'file:../local' },
    });
    expect(member.dependencies).to.deep.equal({ parse5: '8.0.0', local: 'file:../local' });
  });

  it('keeps the range when copies of one requirer resolve a dependency differently', () => {
    const { hooks, stats } = hooksFor(lock);
    const a = hooks.readPackage({ name: 'a', version: '1.0.0', dependencies: { ms: '^2.0.0' } });
    expect(a.dependencies.ms).to.equal('^2.0.0');
    expect(stats().ambiguous).to.equal(1);
  });

  it('leaves packages the npm lock does not know untouched', () => {
    const { hooks } = hooksFor(lock);
    const pkg = { name: 'new-dep', version: '1.0.0', dependencies: { x: '^1.0.0' } };
    expect(hooks.readPackage(pkg).dependencies.x).to.equal('^1.0.0');
  });
});
