/**
 * Proves the generator terminates on dependency cycles and does not blow up on a large tree.
 *
 * npm's own tree truncates a cyclic edge: a package that is already an ancestor of itself is not placed
 * again below itself, because resolution walks back up to the ancestor copy. The pnpm lock of a real
 * monorepo does contain cycles (`@mdjs/mdjs-preview` -> `@lion/ui`, and workspace self-references), so a
 * generate that recurses per declared edge without that truncation never returns — it dies with
 * `RangeError: Maximum call stack size exceeded` on the real lock, while every acyclic test fixture passes.
 */
import { expect } from 'chai';
import { generateInMemory } from '../src/index.js';
import { makeCyclicFixtureRepo, makeLargeTreeFixtureRepo } from './fixtures.js';
import { withRepo } from './test-helpers.js';

describe('generate on cyclic locks', () => {
  it('terminates on a two-node cycle and a self-reference', async () => {
    await withRepo(makeCyclicFixtureRepo, repo => {
      const { lock } = generateInMemory({ repoRoot: repo.root });
      expect(lock.packages['node_modules/@fixture/cycle-a'].version).to.equal('1.0.0');
      // cycle-b is only reachable through cycle-a, so it lives under it
      expect(
        lock.packages['node_modules/@fixture/cycle-a/node_modules/@fixture/cycle-b'].version,
      ).to.equal('1.0.0');
      expect(lock.packages['node_modules/@fixture/self'].version).to.equal('1.0.0');
    });
  });

  it('truncates the cyclic edge like npm, leaving resolution to walk up to the ancestor copy', async () => {
    await withRepo(makeCyclicFixtureRepo, repo => {
      const { lock } = generateInMemory({ repoRoot: repo.root });
      // the edge is kept, so the requirer still resolves to the ancestor copy…
      expect(lock.packages['node_modules/@fixture/cycle-a'].dependencies).to.deep.equal({
        '@fixture/cycle-b': '1.0.0',
      });
      // …but it is not placed a second time below itself: no copy at ever-deeper paths
      expect(lock.packages).to.not.have.property(
        'node_modules/@fixture/cycle-a/node_modules/@fixture/cycle-b/node_modules/@fixture/cycle-a',
      );
      expect(lock.packages).to.not.have.property(
        'node_modules/@fixture/self/node_modules/@fixture/self',
      );
      expect(Object.keys(lock.packages).length).to.be.lessThan(10);
    });
  });

  it('normalises a peer-suffixed importer version out of the lock path', async () => {
    await withRepo(makeCyclicFixtureRepo, repo => {
      const { lock } = generateInMemory({ repoRoot: repo.root });
      expect(lock.packages['node_modules/@fixture/peer-host'].version).to.equal('1.0.0');
      // a peer or patch_hash suffix must never end up inside a path: `node_modules/@open-wc/eslint-config@…(...)`
      expect(Object.keys(lock.packages).some(key => key.includes('('))).to.equal(false);
    });
  });

  it('is still deterministic on cyclic input', async () => {
    await withRepo(makeCyclicFixtureRepo, repo => {
      const first = JSON.stringify(generateInMemory({ repoRoot: repo.root }).lock);
      const second = JSON.stringify(generateInMemory({ repoRoot: repo.root }).lock);
      expect(first).to.equal(second);
    });
  });
});

describe('generate on a large tree', () => {
  it('stays linear in the tree size instead of blowing up', async () => {
    const count = 1200;
    await withRepo(
      () => makeLargeTreeFixtureRepo({ count }),
      repo => {
        const started = Date.now();
        const { lock } = generateInMemory({ repoRoot: repo.root });
        const elapsed = Date.now() - started;
        const entries = Object.keys(lock.packages).length;
        // one copy of each chain package plus the shared tail under every requirer — bounded, not exponential
        expect(entries).to.be.lessThan(count * 4);
        expect(elapsed, `generate took ${elapsed}ms`).to.be.lessThan(10000);
        // the cycle at the end of the chain did not recurse forever
        expect(lock.packages).to.not.have.property(
          `node_modules/big-0/node_modules/big-1/node_modules/big-${count - 1}/node_modules/big-0`,
        );
      },
    );
  });

  it('produces the same bytes on every run of a large tree', async () => {
    await withRepo(
      () => makeLargeTreeFixtureRepo({ count: 1200 }),
      repo => {
        const first = JSON.stringify(generateInMemory({ repoRoot: repo.root }).lock);
        const second = JSON.stringify(generateInMemory({ repoRoot: repo.root }).lock);
        expect(first).to.equal(second);
      },
    );
  });
});
