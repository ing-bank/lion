/**
 * Fixture repos for the lockfile-interop tests, built in a temp directory on demand.
 *
 * Why generated and not committed: a lock-shaped mock in the repository is read by external security
 * scanners as a real dependency set — names that are not on the registry look like typosquats and
 * integrity hashes that do not match the registry look like tampering. Nothing here lands in git, so
 * there is nothing to scan, and the data cannot go stale.
 *
 * Why this shape: it is the smallest tree that pins the behaviours that are easy to get wrong in a
 * pnpm-to-npm comparison —
 *   - two versions of `ansi-styles`, one at the top level and one nested under `chalk`;
 *   - a private workspace member (`@fixture/lib-a`) reached through a local `link:` edge;
 *   - a peer-suffixed snapshot key (`chalk@4.1.2(peer@1.0.0)`), which the parser must normalise away.
 *
 * Every registry package named here exists, with its real `sha512` value, so the fixtures are
 * reproducible and truthful even though they are temporary.
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { stringifyJson } from '../src/json-notation.js';

/** Real `sha512` values, read out of an installed lock for real registry packages. */
export const REAL_INTEGRITIES = {
  'ansi-styles@3.2.1':
    'sha512-VT0ZI6kZRdTh8YyJw3SMbYm/u+NqfsAxEpWO0Pf9sq8/e94WxxOpPKx9FR1FlyCtOVDNOQ+8ntlqFxiRc+r5qA==',
  'ansi-styles@4.3.0':
    'sha512-zbB9rCJAT1rbjiVDb2hqKFHNYLxgtk8NURxZ3IZwD3F6NtxbXZQCnnSi1Lkx+IDohdPlFp222wVALIheZJQSEg==',
  'chalk@4.1.2':
    'sha512-oKnbhFyRIXpUuez8iBMmyEa4nbj4IOQyuhc/wy9kY7/WVPcwIO9VA668Pu8RkO7+0G76SLROeyw9CpQ061i4mA==',
  'color-convert@1.9.3':
    'sha512-QfAUtd+vFdAtFQcC8CCyYt1fYWxSqAiK2cSD6zDB8N3cpsEBAvRxp9zOGg6G/SHHJYAT88/az/IuDGALsNVbGg==',
  'color-convert@2.0.1':
    'sha512-RRECPsj7iu/xb5oKYcsFHSppFNnsj/52OVTRKb4zP5onXwVF3zVmmToNcOfGC+CRDpfK/U584fMg38ZHCaElKQ==',
  'color-name@1.1.3':
    'sha512-72fSenhMw2HZMTVHeCA9KCmpEIbzWiQsjN+BHcBbS9vr1mtt+vJjPdksIBNUmKAW8TFUDPJK5SUU3QhE9NEXDw==',
  'color-name@1.1.4':
    'sha512-dOy+3AuW3a2wNbZHIuMZpTcgjGuLU/uBL/ubcZF9OXbDo8ff4O8yVp5Bf0efS8uEoYo5q4Fx7dY9OgQGXgAsQA==',
  'has-flag@4.0.0':
    'sha512-EykJT/Q1KjTWctppgIAgfSO0tKVuZUjhgMr17kqTumMl6Afv3EISleU7qZUzoXDFTAHTDC4NOoG/ZxU3EvlMPQ==',
  'semver@6.3.0':
    'sha512-b39TBaTSfV6yBrapU89p5fKekE2m/NwnDocOVruQFS1/veMgdzuPcnOM34M6CwxW8jH/lxEa5rBoDeUwu5HHTw==',
  'semver@6.3.1':
    'sha512-BR7VvDCVHO+q2xBEWskxS6DJE1qRnb7DxzUrogb71CWoSficBxYsiAGd+Kl0mmq/MprG9yArRkyrQxTO6XjMzA==',
  'supports-color@7.2.0':
    'sha512-qpCAvRl9stuOHveKsn7HncJRvv501qIacKzQlO/+Lwxc9+0q2wLyv4Dfvt80/DPn2pqOBsJdDiogXGR9+OvwRw==',
};

/** @param {string} key `name@version` @returns {string} the registry tarball URL for that record */
export const registryTarball = key => {
  const at = key.lastIndexOf('@');
  const name = key.slice(0, at);
  const version = key.slice(at + 1);
  return `https://registry.npmjs.org/${name}/-/${name}-${version}.tgz`;
};

/** @type {Record<string, number>} */
let counter = 0;

/**
 * @param {{ semverVersion: string }} options
 * @returns {string}
 */
function pnpmLock({ semverVersion }) {
  const records = [
    'ansi-styles@3.2.1',
    'ansi-styles@4.3.0',
    'chalk@4.1.2',
    'color-convert@1.9.3',
    'color-convert@2.0.1',
    'color-name@1.1.3',
    'color-name@1.1.4',
    'has-flag@4.0.0',
    `semver@${semverVersion}`,
    'supports-color@7.2.0',
  ];
  const lines = [
    "lockfileVersion: '9.0'",
    '',
    'importers:',
    '',
    '  .:',
    '    dependencies:',
    '      ansi-styles:',
    '        specifier: ^3.2.1',
    '        version: 3.2.1',
    '',
    '  pkgs/lib-a:',
    '    dependencies:',
    '      semver:',
    '        specifier: ^6.3.1',
    `        version: ${semverVersion}`,
    '',
    '  pkgs/lib-b:',
    '    dependencies:',
    "      '@fixture/lib-a':",
    '        specifier: ^1.0.0',
    '        version: link:../lib-a',
    '      chalk:',
    '        specifier: ^4.1.2',
    '        version: 4.1.2',
    '',
    'packages:',
    '',
  ];
  for (const key of [...records].sort()) {
    lines.push(`  ${key}:`, `    resolution: {integrity: ${REAL_INTEGRITIES[key]}}`, '');
  }
  lines.push(
    'snapshots:',
    '',
    '  ansi-styles@3.2.1:',
    '    dependencies:',
    '      color-convert: 1.9.3',
    '',
    '  ansi-styles@4.3.0:',
    '    dependencies:',
    '      color-convert: 2.0.1',
    '',
    '  chalk@4.1.2:',
    '    dependencies:',
    '      ansi-styles: 4.3.0',
    '      supports-color: 7.2.0',
    '',
    '  color-convert@1.9.3:',
    '    dependencies:',
    '      color-name: 1.1.3',
    '',
    '  color-convert@2.0.1:',
    '    dependencies:',
    '      color-name: 1.1.4',
    '',
    '  color-name@1.1.3: {}',
    '  color-name@1.1.4: {}',
    '  has-flag@4.0.0: {}',
    `  semver@${semverVersion}: {}`,
    '  supports-color@7.2.0:',
    '    dependencies:',
    '      has-flag: 4.0.0',
    '',
    // a peer-suffixed snapshot key, which the parser has to normalise away
    '  chalk@4.1.2(peer@1.0.0):',
    '    dependencies:',
    '      ansi-styles: 4.3.0',
    '',
  );
  return lines.join('\n');
}

/**
 * The npm side of the fixture: what `npm install` would have written for the same manifests.
 *
 * @param {{ semverLockVersion: string, rootDependencies: string[] }} options
 * @returns {Record<string, unknown>}
 */
function npmLockPackages({ semverLockVersion, rootDependencies }) {
  /** @param {string} name @param {string} version */
  const entry = (name, version) => ({
    version,
    resolved: registryTarball(`${name}@${version}`),
    integrity: REAL_INTEGRITIES[`${name}@${version}`],
  });
  return {
    '': {
      name: 'fixture-root',
      version: '1.0.0',
      dependencies: {
        'ansi-styles': '^3.2.1',
        ...Object.fromEntries(rootDependencies.map(dep => [dep, '^1.0.0'])),
      },
    },
    'node_modules/@fixture/lib-a': { resolved: 'pkgs/lib-a', link: true },
    'node_modules/@fixture/lib-b': { resolved: 'pkgs/lib-b', link: true },
    'node_modules/ansi-styles': {
      ...entry('ansi-styles', '3.2.1'),
      dependencies: { 'color-convert': '1.9.3' },
    },
    'node_modules/color-convert': {
      ...entry('color-convert', '1.9.3'),
      dependencies: { 'color-name': '1.1.3' },
    },
    'node_modules/color-name': entry('color-name', '1.1.3'),
    'pkgs/lib-a': { name: '@fixture/lib-a', version: '1.0.0', dependencies: { semver: '^6.3.1' } },
    'pkgs/lib-a/node_modules/semver': entry('semver', semverLockVersion),
    'pkgs/lib-b': {
      name: '@fixture/lib-b',
      version: '1.0.0',
      dependencies: { '@fixture/lib-a': '^1.0.0', chalk: '^4.1.2' },
    },
    'pkgs/lib-b/node_modules/chalk': {
      ...entry('chalk', '4.1.2'),
      dependencies: { 'ansi-styles': '4.3.0', 'supports-color': '7.2.0' },
    },
    'pkgs/lib-b/node_modules/chalk/node_modules/ansi-styles': {
      ...entry('ansi-styles', '4.3.0'),
      dependencies: { 'color-convert': '2.0.1' },
    },
    'pkgs/lib-b/node_modules/chalk/node_modules/color-convert': {
      ...entry('color-convert', '2.0.1'),
      dependencies: { 'color-name': '1.1.4' },
    },
    'pkgs/lib-b/node_modules/chalk/node_modules/color-name': entry('color-name', '1.1.4'),
    'pkgs/lib-b/node_modules/chalk/node_modules/supports-color': {
      ...entry('supports-color', '7.2.0'),
      dependencies: { 'has-flag': '4.0.0' },
    },
    'pkgs/lib-b/node_modules/chalk/node_modules/has-flag': entry('has-flag', '4.0.0'),
  };
}

/**
 * Writes a fixture repo into a fresh temp directory.
 *
 * @param {object} [options]
 * @param {string} [options.semverVersion] version the pnpm lock resolves for `semver`
 * @param {string} [options.semverLockVersion] version the npm lock carries for `semver`
 * @param {string[]} [options.npmLockDropped] lock paths to omit from the npm lock
 * @param {string[]} [options.rootDependencies] extra root dependencies declared in package.json
 * @param {boolean} [options.withPnpmLock] write a pnpm lock at all
 * @returns {{ root: string, cleanup: () => void }}
 */
export function makeFixtureRepo(options = {}) {
  const {
    semverVersion = '6.3.1',
    semverLockVersion = semverVersion,
    npmLockDropped = [],
    rootDependencies = [],
    withPnpmLock = true,
  } = options;

  counter += 1;
  const root = fs.mkdtempSync(path.join(os.tmpdir(), `lockfile-interop-${counter}-`));
  /** @param {string} rel @param {unknown} content */
  const write = (rel, content) => {
    const target = path.join(root, rel);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, typeof content === 'string' ? content : stringifyJson(content));
  };

  const rootManifest = {
    name: 'fixture-root',
    version: '1.0.0',
    private: true,
    workspaces: ['pkgs/*'],
    dependencies: {
      'ansi-styles': '^3.2.1',
      ...Object.fromEntries(rootDependencies.map(dep => [dep, '^1.0.0'])),
    },
  };
  write('package.json', rootManifest);
  write('pnpm-workspace.yaml', 'packages:\n  - "pkgs/*"\n');
  write('pkgs/lib-a/package.json', {
    name: '@fixture/lib-a',
    version: '1.0.0',
    private: true,
    main: 'index.js',
    dependencies: { semver: '^6.3.1' },
  });
  write('pkgs/lib-b/package.json', {
    name: '@fixture/lib-b',
    version: '1.0.0',
    private: true,
    main: 'index.js',
    dependencies: { '@fixture/lib-a': '^1.0.0', chalk: '^4.1.2' },
  });

  if (withPnpmLock) {
    write('pnpm-lock.yaml', pnpmLock({ semverVersion }));
  }

  const packages = npmLockPackages({ semverLockVersion, rootDependencies });
  for (const dropped of npmLockDropped) delete packages[dropped];
  write('package-lock.json', {
    name: 'fixture-root',
    version: '1.0.0',
    lockfileVersion: 3,
    requires: true,
    packages,
  });

  return { root, cleanup: () => fs.rmSync(root, { recursive: true, force: true }) };
}
