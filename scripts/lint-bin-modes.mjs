#!/usr/bin/env node
// @ts-check
/* eslint-disable no-console -- a gate's output is its interface */
/**
 * Every file that a package.json declares as `bin` must be executable *in the git index*.
 *
 * Why the index and not the filesystem: npm chmods the target of a bin when it links the package
 * into `node_modules/.bin`. If the committed mode is 100644, an install turns it into 100755 and the
 * working tree is dirty afterwards - which makes `changesets/action` abort its
 * `git checkout changeset-release/master` step with "Your local changes to the following files would
 * be overwritten by checkout", and takes the whole Release job down with it.
 *
 * Reading `fs.stat` instead would report false failures: a checkout under a restrictive umask lands
 * as 0600 for a file whose index mode is 100755.
 *
 * Usage: node ./scripts/lint-bin-modes.mjs [--json]
 */
import { execFileSync } from 'node:child_process';
import { readFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = fileURLToPath(new URL('../', import.meta.url));
const jsonOutput = process.argv.includes('--json');

/** @returns {Map<string, string>} repo-relative path -> index mode */
function readIndexModes() {
  const out = execFileSync('git', ['ls-files', '-s'], { cwd: rootDir, encoding: 'utf8' });
  return new Map(
    out
      .split('\n')
      .filter(line => line.trim())
      .map(line => {
        const [meta, filePath] = line.split('\t');
        const [mode] = meta.split(' ');
        return [filePath, mode];
      }),
  );
}

/**
 * @param {Map<string,string>} index
 * @returns {Array<{pkg: string, bin: string, target: string}>}
 */
function collectBinTargets(index) {
  return [...index.keys()]
    .filter(filePath => filePath.endsWith('package.json'))
    .filter(filePath => !filePath.includes('node_modules/') && !filePath.includes('/fixtures/'))
    .flatMap(filePath => {
      const { bin } = JSON.parse(readFileSync(path.join(rootDir, filePath), 'utf8'));
      if (!bin || typeof bin !== 'object') {
        return [];
      }
      return Object.entries(bin)
        .map(([binName, binTarget]) => {
          const abs = path.resolve(path.dirname(path.join(rootDir, filePath)), String(binTarget));
          return { pkg: filePath, bin: binName, target: path.relative(rootDir, abs) };
        })
        .filter(({ target }) => existsSync(path.join(rootDir, target)));
    })
    .map(({ pkg, bin, target }) => ({ pkg, bin, target, mode: index.get(target) }));
}

const index = readIndexModes();
const targets = collectBinTargets(index);
const offenders = targets.filter(({ mode }) => mode !== '100755');

if (jsonOutput) {
  console.log(JSON.stringify({ checked: targets.length, offenders }, null, 2));
} else if (offenders.length) {
  console.error('Bin targets that are not executable in the git index:\n');
  offenders.forEach(({ mode, target, bin, pkg }) => {
    console.error(`  ${mode ?? '??'}  ${target}   (bin "${bin}" of ${pkg})`);
  });
  console.error(
    `\n${offenders.length} of ${targets.length} bin targets would be chmodded by an install and` +
      ' leave the working tree dirty. Fix with:\n' +
      `  git update-index --chmod=+x ${offenders.map(({ target }) => target).join(' ')}\n`,
  );
}

process.exit(offenders.length ? 1 : 0);
