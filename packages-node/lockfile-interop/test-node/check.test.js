/**
 * Proves the gate itself: what it accepts, what it rejects, and what it says when it rejects.
 *
 * The failure this protects against is silent — external tooling reads `package-lock.json` to decide
 * versions (shared singletons in a microfrontend setup, scanners, SBOM tooling) while the install comes
 * from `pnpm-lock.yaml`. A lock that is one dependency behind means the tooling decides on a version the
 * app never loads, so every divergence has to be a non-zero exit with the packages named.
 */
import { expect } from 'chai';
import { check, formatReport } from '../src/index.js';
import { withFixtureRepo } from './test-helpers.js';

describe('check', () => {
  it('passes when both locks resolve the same versions', async () => {
    await withFixtureRepo({}, repo => {
      const result = check({ repoRoot: repo.root });
      expect(result.noNpmLock).to.equal(false);
      expect(result.onlyPnpm).to.deep.equal([]);
      expect(result.onlyNpm).to.deep.equal([]);
      expect(result.versionMismatches).to.deep.equal([]);
      expect(result.missingDeclarations).to.deep.equal([]);
      expect(result.ok).to.equal(true);
      expect(result.pnpmRecords).to.equal(result.npmRecords);
    });
  });

  it('reports a version the npm lock never resolved', async () => {
    await withFixtureRepo(
      { npmLockDropped: ['pkgs/lib-b/node_modules/chalk/node_modules/ansi-styles'] },
      repo => {
        const result = check({ repoRoot: repo.root });
        expect(result.ok).to.equal(false);
        expect(result.onlyPnpm).to.deep.equal(['ansi-styles@4.3.0']);
        expect(result.onlyNpm).to.deep.equal([]);
        expect(formatReport(result)).to.contain('only in pnpm-lock.yaml');
      },
    );
  });

  it('reports the same package installed at different versions', async () => {
    await withFixtureRepo({ semverLockVersion: '6.3.0' }, repo => {
      const result = check({ repoRoot: repo.root });
      expect(result.ok).to.equal(false);
      expect(result.versionMismatches).to.have.length(1);
      expect(result.versionMismatches[0]).to.deep.equal({
        name: 'semver',
        pnpm: ['6.3.1'],
        npm: ['6.3.0'],
      });
    });
  });

  it('reports a dependency that a manifest declares but the lock never resolved', async () => {
    await withFixtureRepo({ rootDependencies: ['ansi-regex'] }, repo => {
      const result = check({ repoRoot: repo.root });
      expect(result.ok).to.equal(false);
      expect(result.missingDeclarations).to.have.length(1);
      expect(result.missingDeclarations[0]).to.contain('ansi-regex');
    });
  });

  it('is a no-op in a repo that does not install with pnpm', async () => {
    await withFixtureRepo({ withPnpmLock: false }, repo => {
      const result = check({ repoRoot: repo.root });
      expect(result.noPnpmLock).to.equal(true);
      // absence of a pnpm lock must not fail the gate by itself: the guard applies only after the switch
      expect(result.ok).to.equal(true);
    });
  });

  it('formats the drift summary with counts and package names', async () => {
    await withFixtureRepo({ semverLockVersion: '6.3.0' }, repo => {
      const report = formatReport(check({ repoRoot: repo.root }));
      expect(report).to.contain('pnpm-lock records:');
      expect(report).to.contain('semver: pnpm 6.3.1 | npm 6.3.0');
    });
  });
});
