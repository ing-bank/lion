/**
 * Proves the gate in the mode this repository runs: pnpm installs *from* the committed npm lock
 * (`pnpm import`), so npm keeps duplicate versions its tree placement needs and pnpm dedupes them.
 *
 * What has to fail is the drift that matters - a declared dependency pnpm would install at a version the
 * committed package-lock.json does not record, or a declared dependency the committed lock never resolved -
 * because external tooling reads that lock to decide versions (shared singletons in a microfrontend setup,
 * scanners, SBOM). Transitive tails npm keeps for other requirers are not drift.
 */
import { expect } from 'chai';
import { check, declaredDrift, formatReport, readNpmLock, readPnpmLock } from '../src/index.js';
import { withFixtureRepo } from './test-helpers.js';

describe('check in declared mode', () => {
  it('passes when every declared dependency resolves to a version the npm lock records', async () => {
    await withFixtureRepo({}, repo => {
      const result = check({ repoRoot: repo.root, mode: 'declared' });
      expect(result.declared).to.deep.equal([]);
      expect(result.missingDeclarations).to.deep.equal([]);
      expect(result.ok).to.equal(true);
      expect(formatReport(result)).to.contain('no drift');
    });
  });

  it('accepts an npm-only record no manifest declares (the strict mode reports it)', async () => {
    // has-flag is only reachable through chalk -> supports-color; dropping that copy leaves pnpm's record
    // without an npm counterpart, which the full record-set comparison calls drift and this mode does not
    await withFixtureRepo(
      { npmLockDropped: ['pkgs/lib-b/node_modules/chalk/node_modules/has-flag'] },
      repo => {
        const declared = check({ repoRoot: repo.root, mode: 'declared' });
        expect(declared.ok).to.equal(true);
        expect(declared.declared).to.deep.equal([]);

        const strict = check({ repoRoot: repo.root, mode: 'strict' });
        expect(strict.ok).to.equal(false);
        expect(strict.onlyPnpm).to.deep.equal(['has-flag@4.0.0']);
      },
    );
  });

  it('reports a declared dependency pnpm resolves to a version the npm lock does not record', async () => {
    await withFixtureRepo({ semverLockVersion: '6.3.0' }, repo => {
      const result = check({ repoRoot: repo.root, mode: 'declared' });
      expect(result.ok).to.equal(false);
      expect(result.declared).to.deep.equal([
        { dir: 'pkgs/lib-a', name: 'semver', resolved: '6.3.1', npmVersion: '6.3.0' },
      ]);
      const report = formatReport(result);
      expect(report).to.contain('pkgs/lib-a: semver -> pnpm 6.3.1 | npm 6.3.0');
    });
  });

  it('reports a declared dependency the lock never resolved', async () => {
    await withFixtureRepo({ rootDependencies: ['ansi-regex'] }, repo => {
      const result = check({ repoRoot: repo.root, mode: 'declared' });
      expect(result.ok).to.equal(false);
      expect(result.missingDeclarations).to.have.length(1);
      expect(result.missingDeclarations[0]).to.contain('ansi-regex');
    });
  });

  it('ignores local link edges, which carry no version', async () => {
    await withFixtureRepo({}, repo => {
      const pnpm = readPnpmLock(repo.root);
      const npm = readNpmLock(repo.root);
      expect(npm).to.not.equal(null);
      const drift = declaredDrift(
        pnpm,
        /** @type {import('../src/npm-lock.js').NpmLock} */ (npm),
        new Map([['pkgs/lib-b', new Set(['@fixture/lib-a'])]]),
      );
      expect(drift).to.deep.equal([]);
    });
  });

  it('still compares when the npm lock records the name at another version only', async () => {
    await withFixtureRepo({ npmLockDropped: ['node_modules/ansi-styles'] }, repo => {
      const result = check({ repoRoot: repo.root, mode: 'declared' });
      // ansi-styles is declared by the root manifest (^3.2.1); after dropping that copy the npm lock only
      // records the 4.3.0 chalk needs, so the root's own edge has no npm resolution at all
      expect(result.declared).to.deep.equal([
        { dir: '.', name: 'ansi-styles', resolved: '3.2.1', npmVersion: null },
      ]);
      expect(result.ok).to.equal(false);
    });
  });

  it('reports an edge pnpm resolves elsewhere even when the npm lock records that version for another requirer', async () => {
    // the blind spot the first version of this check had: npm's lock records several versions of a name, so
    // "is the resolved version somewhere in the npm lock" accepts a resolution npm never installs for that
    // edge. `@mdjs/mdjs-preview` hit it for real: pnpm resolved the root's ^0.6.0 to 0.5.9, the loose rule
    // stayed green, and patches/@mdjs+mdjs-preview+0.6.0.patch then failed to apply.
    await withFixtureRepo(
      { semverLockVersion: '6.3.0', npmExtraPackages: { 'node_modules/semver': 'semver@6.3.1' } },
      repo => {
        const result = check({ repoRoot: repo.root, mode: 'declared' });
        expect(result.declared).to.deep.equal([
          { dir: 'pkgs/lib-a', name: 'semver', resolved: '6.3.1', npmVersion: '6.3.0' },
        ]);
        expect(result.ok).to.equal(false);
      },
    );
  });
});
