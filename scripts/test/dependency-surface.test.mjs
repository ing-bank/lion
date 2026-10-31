/**
 * Protects the guarantee behind `scripts/lint-dependency-surface.mjs`: the risk it reports for a
 * declaration must be the one npm would actually install for that declaration -- resolved from the
 * declaring manifest -- and it must rank what runs code at install time above what merely weighs a
 * lot, because the count of packages is a weak proxy for risk on its own (see
 * docs/maintenance/dependency-surface.md).
 *
 * The failures this suite exists for: a declaration that runs an install script being reported as a
 * "too heavy" low-severity line, an install script npm never runs on this platform being reported as
 * surface, two incompatible copies of one package inside one declaration going unnoticed, and an
 * accepted declaration in package.json being warned about anyway (or a warning being silently
 * swallowed).
 */
import { expect } from 'chai';
import { describe, it } from 'mocha';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import {
  DEFAULT_MAX_DEPTH,
  DEFAULT_MAX_PACKAGES,
  collectManifests,
  createLockIndex,
  evaluate,
  installsEverywhere,
  isLocalSpecifier,
  main,
  render,
  severityOf,
  versionIdentity,
  weighManifest,
} from '../lint-dependency-surface.mjs';
import { cleanupFixture, recordWith, writeFixture } from './fixtures.mjs';

describe('dependency surface of declared dependencies', () => {
  it('counts distinct packages, not lock paths, for one declaration', () => {
    const dir = writeFixture({
      entries: {
        'node_modules/alpha': recordWith('chai', {
          dependencies: { beta: '^1.0.0', 'type-detect': '^4.0.0' },
        }),
        'node_modules/alpha/node_modules/beta': recordWith('chai', {
          dependencies: { 'type-detect': '^4.0.0' },
        }),
        'node_modules/type-detect': recordWith('type-detect', {}, '4.0.8'),
        'node_modules/alpha/node_modules/beta/node_modules/type-detect': recordWith(
          'type-detect',
          {},
          '4.1.0',
        ),
      },
      manifests: {
        'packages/app/package.json': {
          name: '@fixture/app',
          version: '0.0.0',
          dependencies: { alpha: '^1.0.0' },
        },
      },
    });
    try {
      const lock = JSON.parse(readFileSync(path.join(dir, 'package-lock.json'), 'utf8'));
      const pkg = JSON.parse(readFileSync(path.join(dir, 'packages/app/package.json'), 'utf8'));
      const { rows } = weighManifest({
        index: createLockIndex(lock),
        pkg,
        manifestPath: path.join(dir, 'packages/app/package.json'),
        dir: 'packages/app',
        maxPackages: DEFAULT_MAX_PACKAGES,
        maxDepth: DEFAULT_MAX_DEPTH,
      });

      expect(rows.length).to.equal(1);
      // alpha, beta, type-detect 4.0.8 and type-detect 4.1.0 sit on four lock paths but are 3 names
      expect(rows[0].packages).to.equal(3);
      expect(rows[0].lockPaths).to.equal(4);
      // both copies are the same generation, so this is not a duplicated stack
      expect(rows[0].duplicateNames).to.deep.equal([]);
    } finally {
      cleanupFixture(dir);
    }
  });

  it('resolves a dependency from the declaring directory, walking up node_modules levels', () => {
    const dir = writeFixture({
      entries: {
        'node_modules/type-detect': recordWith('type-detect', {}, '4.0.8'),
        'packages/app/node_modules/type-detect': recordWith('type-detect', {}, '4.1.0'),
      },
      manifests: {
        'packages/app/package.json': {
          name: '@fixture/app',
          version: '0.0.0',
          dependencies: { 'type-detect': '^4.1.0' },
        },
      },
    });
    try {
      const lock = JSON.parse(readFileSync(path.join(dir, 'package-lock.json'), 'utf8'));
      const index = createLockIndex(lock);

      expect(index.resolve('type-detect', 'packages/app').record.version).to.equal('4.1.0');
      expect(index.resolve('type-detect', '').record.version).to.equal('4.0.8');
    } finally {
      cleanupFixture(dir);
    }
  });

  it('follows a workspace link entry to the packages it declares', () => {
    const dir = writeFixture({
      entries: {
        'node_modules/@lion/ui': { resolved: 'packages/@lion/ui', link: true },
        'packages/@lion/ui': {
          name: '@lion/ui',
          version: '0.0.0',
          dependencies: { 'type-detect': '^4.0.8' },
        },
        'node_modules/type-detect': recordWith('type-detect', {}, '4.0.8'),
      },
      manifests: {
        'packages/app/package.json': {
          name: '@fixture/app',
          version: '0.0.0',
          dependencies: { '@lion/ui': '*' },
        },
      },
    });
    try {
      const lock = JSON.parse(readFileSync(path.join(dir, 'package-lock.json'), 'utf8'));
      const closure = createLockIndex(lock).closure('@lion/ui', 'packages/app');

      expect(closure.names).to.include('type-detect');
      // the workspace directory itself is not an npm package
      expect(closure.names).to.not.include('packages/@lion/ui');
    } finally {
      cleanupFixture(dir);
    }
  });

  it('skips specifiers npm never resolves through the lock', () => {
    const dir = writeFixture({
      entries: {
        'node_modules/type-detect': recordWith('type-detect', {}, '4.0.8'),
      },
      manifests: {
        'packages/app/package.json': {
          name: '@fixture/app',
          version: '0.0.0',
          dependencies: { 'type-detect': '^4.0.8' },
          devDependencies: { 'local-tool': 'file:../../tools/local-tool', inline: 'workspace:*' },
        },
      },
    });
    try {
      const lock = JSON.parse(readFileSync(path.join(dir, 'package-lock.json'), 'utf8'));
      const pkg = JSON.parse(readFileSync(path.join(dir, 'packages/app/package.json'), 'utf8'));
      const { rows } = weighManifest({
        index: createLockIndex(lock),
        pkg,
        manifestPath: path.join(dir, 'packages/app/package.json'),
        dir: 'packages/app',
        maxPackages: DEFAULT_MAX_PACKAGES,
        maxDepth: DEFAULT_MAX_DEPTH,
      });

      expect(rows.map(row => row.name)).to.deep.equal(['type-detect']);
      expect(isLocalSpecifier('file:../x')).to.equal(true);
      expect(isLocalSpecifier('workspace:*')).to.equal(true);
      expect(isLocalSpecifier('^4.0.8')).to.equal(false);
    } finally {
      cleanupFixture(dir);
    }
  });

  it('reports a declaration with no lock entry instead of counting it as surface', () => {
    const dir = writeFixture({
      entries: {
        'node_modules/type-detect': recordWith('type-detect', {}, '4.0.8'),
      },
      manifests: {
        'packages/app/package.json': {
          name: '@fixture/app',
          version: '0.0.0',
          dependencies: { 'not-installed-yet': '^1.0.0' },
        },
      },
    });
    try {
      const report = evaluate({
        cwd: dir,
        maxPackages: DEFAULT_MAX_PACKAGES,
        maxDepth: DEFAULT_MAX_DEPTH,
        only: ['packages/app/package.json'],
      });

      expect(report.totals.uninstalled).to.equal(1);
      expect(report.totals.warnings).to.equal(0);
      expect(report.results[0].rows[0].installed).to.equal(false);
    } finally {
      cleanupFixture(dir);
    }
  });

  it('separates what only this declaration brings from what a sibling also reaches', () => {
    const dir = writeFixture({
      entries: {
        'node_modules/alpha': recordWith('chai', { dependencies: { 'type-detect': '^4.0.0' } }),
        'node_modules/beta': recordWith('chai', { dependencies: { 'type-detect': '^4.0.0' } }),
        'node_modules/type-detect': recordWith('type-detect', {}, '4.0.8'),
      },
      manifests: {
        'packages/app/package.json': {
          name: '@fixture/app',
          version: '0.0.0',
          dependencies: { alpha: '^1.0.0', beta: '^1.0.0' },
        },
      },
    });
    try {
      const report = evaluate({
        cwd: dir,
        maxPackages: DEFAULT_MAX_PACKAGES,
        maxDepth: DEFAULT_MAX_DEPTH,
        only: ['packages/app/package.json'],
      });
      const alpha = report.results[0].rows.find(row => row.name === 'alpha');

      // both declarations reach type-detect, so neither may claim it as its own
      expect(alpha.packages).to.equal(2);
      expect(alpha.exclusive).to.equal(1);
    } finally {
      cleanupFixture(dir);
    }
  });

  it('collects the root manifest plus every workspace glob', () => {
    const dir = writeFixture({
      entries: {},
      manifests: {
        'packages/app/package.json': { name: '@fixture/app', version: '0.0.0' },
        'packages-node/tool/package.json': { name: '@fixture/tool', version: '0.0.0' },
        'test/typescript-legacy/package.json': { name: '@fixture/legacy', version: '0.0.0' },
      },
      workspaces: ['packages/*', 'packages-node/*', 'test/typescript-legacy'],
    });
    try {
      const manifests = collectManifests(dir);

      expect(manifests).to.have.lengthOf(4);
      expect(manifests.map(entry => entry.dir).sort()).to.deep.equal([
        '',
        'packages-node/tool',
        'packages/app',
        'test/typescript-legacy',
      ]);
    } finally {
      cleanupFixture(dir);
    }
  });
});

describe('risk ranking', () => {
  it('ranks an install script above a duplicated stack above plain weight', () => {
    const base = { installScripts: [], duplicateNames: [], maxDepth: 1, packages: 21 };
    const budgets = { maxPackages: 20, maxDepth: 8 };

    expect(severityOf(base, budgets).severity).to.equal('low');
    expect(
      severityOf({ ...base, duplicateNames: [{ name: 'debug', identities: ['3', '4'] }] }, budgets)
        .severity,
    ).to.equal('medium');
    expect(
      severityOf(
        { ...base, installScripts: [{ name: 'rs-module-lexer', installsEverywhere: true }] },
        budgets,
      ).severity,
    ).to.equal('high');
    // depth is surface too: a chain nobody chose
    expect(severityOf({ ...base, maxDepth: 9 }, budgets).severity).to.equal('medium');
    // a declaration inside every budget has nothing to report
    expect(severityOf({ ...base, packages: 20 }, budgets).reasons).to.deep.equal([]);
  });

  it('does not treat an install script npm skips on other platforms as surface', () => {
    const dir = writeFixture({
      entries: {
        'node_modules/gated': recordWith('fsevents', { hasInstallScript: true, os: ['darwin'] }),
        'node_modules/everywhere': recordWith('rs-module-lexer', {
          hasInstallScript: true,
          os: undefined,
          dependencies: {},
          optionalDependencies: {},
        }),
      },
      manifests: {
        'packages/app/package.json': {
          name: '@fixture/app',
          version: '0.0.0',
          dependencies: { gated: '^2.3.3', everywhere: '^2.8.0' },
        },
      },
    });
    try {
      const report = evaluate({
        cwd: dir,
        maxPackages: DEFAULT_MAX_PACKAGES,
        maxDepth: DEFAULT_MAX_DEPTH,
        only: ['packages/app/package.json'],
      });
      const gated = report.results[0].rows.find(row => row.name === 'gated');
      const everywhere = report.results[0].rows.find(row => row.name === 'everywhere');

      expect(gated.severity).to.equal('low');
      expect(gated.reasons).to.deep.equal([]);
      expect(everywhere.severity).to.equal('high');
      expect(everywhere.reasons[0]).to.include('everywhere@2.8.0');
      expect(installsEverywhere({ os: ['darwin'] })).to.equal(false);
      expect(installsEverywhere({})).to.equal(true);
    } finally {
      cleanupFixture(dir);
    }
  });

  it('reads the generation of a version the way semver does for 0.x releases', () => {
    expect(versionIdentity('4.3.7')).to.equal('4');
    expect(versionIdentity('4.1.0')).to.equal('4');
    expect(versionIdentity('0.6.6')).to.equal('0.6');
    expect(versionIdentity('0.9.0')).to.equal('0.9');
  });

  it('flags two generations of the same package inside one declaration', () => {
    const dir = writeFixture({
      entries: {
        'node_modules/alpha': recordWith('chai', {
          dependencies: { debug: '^3.0.0', gamma: '^1.0.0' },
        }),
        'node_modules/alpha/node_modules/debug': recordWith('debug', {}, '3.2.7'),
        'node_modules/gamma': recordWith('chai', { dependencies: { debug: '^4.0.0' } }),
        'node_modules/debug': recordWith('debug', {}, '4.3.7'),
      },
      manifests: {
        'packages/app/package.json': {
          name: '@fixture/app',
          version: '0.0.0',
          dependencies: { alpha: '^1.0.0' },
        },
      },
    });
    try {
      const report = evaluate({
        cwd: dir,
        maxPackages: DEFAULT_MAX_PACKAGES,
        maxDepth: DEFAULT_MAX_DEPTH,
        only: ['packages/app/package.json'],
      });
      const alpha = report.results[0].rows.find(row => row.name === 'alpha');

      expect(alpha.duplicateNames.map(dup => dup.name)).to.deep.equal(['debug']);
      expect(alpha.duplicateNames[0].identities).to.deep.equal(['3', '4']);
      expect(alpha.severity).to.equal('medium');
      expect(report.totals.medium).to.equal(1);
    } finally {
      cleanupFixture(dir);
    }
  });
});

describe('dependency-surface lint CLI', () => {
  /** run `main` in `dir`, capturing stdout */
  function runIn(dir, argv) {
    const cwd = process.cwd();
    const logged = [];
    const originalLog = console.log;
    console.log = (...args) => logged.push(args.join(' '));
    try {
      process.chdir(dir);
      const code = main(argv);
      return { code, output: logged.join('\n') };
    } finally {
      process.chdir(cwd);
      console.log = originalLog;
    }
  }

  /** a tree whose one declaration is over the package budget and nothing else */
  function weightFixture({ dependencySurface } = {}) {
    return writeFixture({
      dependencySurface,
      entries: {
        'node_modules/alpha': recordWith('chai', { dependencies: { 'type-detect': '^4.0.0' } }),
        'node_modules/type-detect': recordWith('type-detect', {}, '4.0.8'),
      },
      manifests: {
        'packages/app/package.json': {
          name: '@fixture/app',
          version: '0.0.0',
          dependencies: { alpha: '^1.0.0' },
        },
      },
    });
  }

  it('exits 0 with warnings by default and 1 under --strict', () => {
    const dir = weightFixture();
    try {
      const warning = runIn(dir, ['--max=1']);
      const strict = runIn(dir, ['--max=1', '--strict']);
      const clean = runIn(dir, ['--max=10', '--strict']);

      expect(warning.code).to.equal(0);
      expect(warning.output).to.include('low');
      expect(warning.output).to.include('1 declarations flagged');
      expect(strict.code).to.equal(1);
      expect(clean.code).to.equal(0);
      expect(clean.output).to.include('0 declarations flagged');
    } finally {
      cleanupFixture(dir);
    }
  });

  it('names the manifest line the declaration sits on, and what is wrong with it', () => {
    const dir = weightFixture();
    try {
      const { output } = runIn(dir, ['--max=1']);
      const line = output.split('\n').find(entry => entry.includes('low '));

      expect(line).to.include('packages/app/package.json:');
      expect(line).to.include('alpha');
      expect(line).to.include('depth 1');
      expect(output).to.include('weight 2 > 1');
    } finally {
      cleanupFixture(dir);
    }
  });

  it('emits the same findings as JSON, and rejects a non-numeric budget', () => {
    const dir = weightFixture();
    try {
      const parsed = JSON.parse(runIn(dir, ['--max=1', '--json']).output);

      expect(parsed.budgets).to.deep.equal({ packages: 1, depth: DEFAULT_MAX_DEPTH });
      expect(parsed.warnings).to.have.lengthOf(1);
      expect(parsed.warnings[0].name).to.equal('alpha');
      expect(parsed.warnings[0].manifest).to.equal('packages/app/package.json');
      expect(runIn(dir, ['--max=twenty']).code).to.equal(1);
      expect(runIn(dir, ['--depth=x']).code).to.equal(1);
      expect(runIn(dir, ['--help']).code).to.equal(0);
    } finally {
      cleanupFixture(dir);
    }
  });

  it('takes an accepted declaration out of the warnings, and keeps it visible', () => {
    const dir = weightFixture({
      dependencySurface: {
        allow: { 'packages/app/package.json': { alpha: 'fixture: accepted on purpose' } },
      },
    });
    try {
      const accepted = runIn(dir, ['--max=1']);
      const shown = runIn(dir, ['--max=1', '--show-allowed']);
      const strict = runIn(dir, ['--max=1', '--strict']);

      expect(accepted.output).to.include('0 declarations flagged');
      expect(accepted.output).to.include('1 allowed in package.json');
      expect(shown.output).to.include('allowed: fixture: accepted on purpose');
      expect(strict.code).to.equal(0);
    } finally {
      cleanupFixture(dir);
    }
  });

  it('renders nothing but the summary for a manifest without findings', () => {
    const dir = weightFixture();
    try {
      const report = evaluate({
        cwd: dir,
        maxPackages: DEFAULT_MAX_PACKAGES,
        maxDepth: DEFAULT_MAX_DEPTH,
        only: ['packages/app/package.json'],
      });
      const lines = render(report, {
        maxPackages: DEFAULT_MAX_PACKAGES,
        maxDepth: DEFAULT_MAX_DEPTH,
        cwd: dir,
      });

      expect(lines).to.have.lengthOf(2);
      expect(lines[1]).to.include('0 declarations flagged (0 high, 0 medium, 0 low)');
    } finally {
      cleanupFixture(dir);
    }
  });
});
