/**
 * Regressions found by running this package against a real repository instead of the fixtures.
 *
 * Both crashed on lion's own lock, and neither is visible in a small fixture tree:
 *   - a dependency cycle nested forever (the placement rule is one copy per requirer, so a cycle adds
 *     a new path on every lap and the walk never returns);
 *   - the npm-style writer spread a child line list into `push(...)`, which overflows the argument
 *     limit once a lock is large enough to matter.
 */
import { expect } from 'chai';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { generateNpmLock } from '../src/generator.js';
import { stringifyJson } from '../src/json-notation.js';

const INTEGRITY = 'sha512-AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==';

/**
 * A repo whose only two packages require each other: `cycle-a` -> `cycle-b` -> `cycle-a`.
 *
 * @returns {string} the fixture repo root
 */
function makeCyclicRepo() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'lockfile-interop-cycle-'));
  fs.writeFileSync(
    path.join(root, 'package.json'),
    JSON.stringify({
      name: 'cycle-root',
      version: '0.0.0',
      devDependencies: { 'cycle-a': '^1.0.0' },
    }),
  );
  fs.writeFileSync(
    path.join(root, 'pnpm-lock.yaml'),
    [
      "lockfileVersion: '9.0'",
      '',
      'importers:',
      '',
      '  .:',
      '    devDependencies:',
      '      cycle-a:',
      '        specifier: ^1.0.0',
      '        version: 1.0.0',
      '',
      'packages:',
      '',
      '  cycle-a@1.0.0:',
      `    resolution: {integrity: ${INTEGRITY}}`,
      '  cycle-b@1.0.0:',
      `    resolution: {integrity: ${INTEGRITY}}`,
      '',
      'snapshots:',
      '',
      '  cycle-a@1.0.0:',
      '    dependencies:',
      '      cycle-b: 1.0.0',
      '  cycle-b@1.0.0:',
      '    dependencies:',
      '      cycle-a: 1.0.0',
      '',
    ].join('\n'),
  );
  return root;
}

describe('regressions from a real lock', () => {
  it('terminates on a dependency cycle and reports the skipped edges', () => {
    const root = makeCyclicRepo();
    try {
      const { lock, result } = generateNpmLock({ repoRoot: root });
      // `cycle-b` must not copy `cycle-a` below itself: the root copy already satisfies it.
      expect(result.cycleSkips).to.equal(1);
      expect(Object.keys(lock.packages)).to.not.include(
        'node_modules/cycle-a/node_modules/cycle-b/node_modules/cycle-a',
      );
    } finally {
      fs.rmSync(root, { recursive: true, force: true });
    }
  });

  it('writes an array large enough that push(...lines) would overflow', () => {
    const items = new Array(300000).fill(1);
    const json = stringifyJson(items);
    expect(json.length).to.be.greaterThan(items.length);
    expect(JSON.parse(json)).to.have.lengthOf(items.length);
  });
});
