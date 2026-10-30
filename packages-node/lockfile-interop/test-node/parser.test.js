/**
 * Proves that both lockfiles are read into the form the comparison needs.
 *
 * The pnpm lockfile is the awkward one: version 9 splits resolution metadata (`packages`) from resolved
 * edges (`snapshots`), and snapshot keys plus importer versions may carry peer suffixes such as
 * `chalk@4.1.2(peer@1.0.0)`. A parser that keeps those suffixes invents packages that do not exist, and
 * one that reads `link:` as a version invents versions that do not exist — both would show up as drift
 * in a repo that is fine.
 */
import { expect } from 'chai';
import { readNpmLock, readPnpmLock } from '../src/index.js';
import { entryName, npmVersionSet } from '../src/npm-lock.js';
import { baseKey, edgeVersion, pnpmVersionSet, splitNameVersion } from '../src/pnpm-lock.js';
import { withFixtureRepo } from './test-helpers.js';

describe('lockfile parsing', () => {
  it('normalises peer suffixes in snapshot keys and importer versions', async () => {
    await withFixtureRepo({}, repo => {
      const lock = readPnpmLock(repo.root);
      expect(baseKey('chalk@4.1.2(peer@1.0.0)')).to.equal('chalk@4.1.2');
      expect(edgeVersion('4.3.0(peer@1)')).to.equal('4.3.0');
      expect(edgeVersion('/@fixture/lib-a@1.0.0(peer@1)')).to.equal('1.0.0');
      expect(edgeVersion('1.0.0')).to.equal('1.0.0');

      const set = pnpmVersionSet(lock);
      expect([...set].some(id => id.includes('('))).to.equal(false);
      expect(set.has('chalk@4.1.2')).to.equal(true);
    });
  });

  it('splits scoped and unscoped name@version keys the same way', () => {
    expect(splitNameVersion('@fixture/lib-a@1.0.0')).to.deep.equal(['@fixture/lib-a', '1.0.0']);
    expect(splitNameVersion('chalk@4.1.2')).to.deep.equal(['chalk', '4.1.2']);
  });

  it('does not report a local link dependency as a resolved version', async () => {
    await withFixtureRepo({}, repo => {
      const set = pnpmVersionSet(readPnpmLock(repo.root));
      expect([...set].some(id => id.startsWith('@fixture/lib-a@link'))).to.equal(false);
    });
  });

  it('keeps both versions of a package that is installed twice', async () => {
    await withFixtureRepo({}, repo => {
      const lock = readPnpmLock(repo.root);
      const set = pnpmVersionSet(lock);
      expect(set.has('ansi-styles@3.2.1')).to.equal(true);
      expect(set.has('ansi-styles@4.3.0')).to.equal(true);
      expect(lock.packages.has('ansi-styles@4.3.0')).to.equal(true);
    });
  });

  it('reads npm lock entries by their path and skips link entries', async () => {
    await withFixtureRepo({}, repo => {
      const lock = readNpmLock(repo.root);
      expect(entryName('pkgs/lib-b/node_modules/chalk/node_modules/ansi-styles')).to.equal(
        'ansi-styles',
      );
      expect(entryName('node_modules/@fixture/lib-a')).to.equal('@fixture/lib-a');

      const set = npmVersionSet(lock);
      expect([...set].some(id => id.startsWith('@fixture/lib-a@'))).to.equal(false);
      expect(set.has('ansi-styles@4.3.0')).to.equal(true);
    });
  });

  it('does not treat a workspace project entry as an installed dependency', async () => {
    await withFixtureRepo({}, repo => {
      const set = npmVersionSet(readNpmLock(repo.root));
      // `pkgs/lib-a` is a project entry: it repeats the manifest ranges, it does not install anything
      expect([...set].some(id => id.startsWith('pkgs/lib-a@'))).to.equal(false);
    });
  });
});
