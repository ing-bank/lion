/**
 * Proves the package-lock.json this package can write from a pnpm lock, without running npm.
 *
 * It exists for repos that need an npm lock but cannot run an npm resolve (a data artifact for external
 * tooling). The placement choice — one copy per requirer — is what makes it correct by construction:
 * resolution walks up from every requirer, so no requirer can end up on the wrong version. The price is
 * a larger file, which is why the check, not the generated file, is the normal gate.
 */
import { expect } from 'chai';
import { generateInMemory } from '../src/index.js';
import { withFixtureRepo } from './test-helpers.js';

describe('generate', () => {
  it('writes a lockfileVersion 3 lock whose keys are real install paths', async () => {
    await withFixtureRepo({}, repo => {
      const { lock } = generateInMemory({ repoRoot: repo.root });
      expect(lock.lockfileVersion).to.equal(3);
      const keys = Object.keys(lock.packages);
      expect(keys).to.include('node_modules/ansi-styles');
      expect(keys).to.include('pkgs/lib-b/node_modules/chalk');
      expect(keys).to.include('pkgs/lib-b/node_modules/chalk/node_modules/ansi-styles');
      for (const [key, entry] of Object.entries(lock.packages)) {
        // root and workspace project entries are not installs
        if (key !== '' && !entry.link && !entry.name) {
          expect(key, 'lock path must be a real path').to.contain('node_modules/');
          expect(entry.version, 'entry needs a version').to.be.a('string');
        }
      }
    });
  });

  it('links workspace members instead of copying them', async () => {
    await withFixtureRepo({}, repo => {
      const { lock, result } = generateInMemory({ repoRoot: repo.root });
      expect(lock.packages['node_modules/@fixture/lib-a'].link).to.equal(true);
      expect(lock.packages['pkgs/lib-a'].name).to.equal('@fixture/lib-a');
      expect(result.skippedLocalLinks).to.be.greaterThan(0);
    });
  });

  it('never writes a link: string into a version field', async () => {
    await withFixtureRepo({}, repo => {
      const { lock } = generateInMemory({ repoRoot: repo.root });
      expect(JSON.stringify(lock)).to.not.contain('"version":"link:');
    });
  });

  it('resolves the versions the pnpm lock pinned, including the nested duplicate', async () => {
    await withFixtureRepo({}, repo => {
      const { lock } = generateInMemory({ repoRoot: repo.root });
      expect(lock.packages['node_modules/ansi-styles'].version).to.equal('3.2.1');
      expect(
        lock.packages['pkgs/lib-b/node_modules/chalk/node_modules/ansi-styles'].version,
      ).to.equal('4.3.0');
      expect(lock.packages['pkgs/lib-a/node_modules/semver'].version).to.equal('6.3.1');
    });
  });

  it('produces the same bytes on every run', async () => {
    await withFixtureRepo({}, repo => {
      const first = JSON.stringify(generateInMemory({ repoRoot: repo.root }).lock);
      const second = JSON.stringify(generateInMemory({ repoRoot: repo.root }).lock);
      expect(first).to.equal(second);
    });
  });
});
