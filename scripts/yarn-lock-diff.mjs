import { exec } from 'child_process';
import fs from 'fs';
// eslint-disable-next-line import/no-extraneous-dependencies
import lockfile from '@yarnpkg/lockfile';

/**
 * === Generic Helpers ===
 */

const execPromise = cmd =>
  new Promise(resolve => exec(cmd, { maxBuffer: 200000000 }, (err, stdout) => resolve(stdout)));

const arrDiff = (arrA, arrB, eq = (a, b) => a === b) =>
  arrA.filter(a => arrB.every(b => !eq(a, b)));

/**
 * === yarn-lock-diff ===
 */

function groupByPackageName(obj) {
  const packages = [];
  Object.keys(obj.object).forEach(key => {
    const names = key.split('@');
    let name = names[0];
    if (name === '') {
      // handle scoped packages
      name = `@${names[1]}`;
    }
    const { version } = obj.object[key];
    const found = packages.find(p => p.name === name);
    if (found) {
      found.versions.push(version);
    } else {
      packages.push({
        name,
        versions: [version],
      });
    }
  });
  return packages;
}

function yarnLockDiff(prevLockContents, curLockContents) {
  const previous = lockfile.parse(prevLockContents);
  const current = lockfile.parse(curLockContents);

  const previousPackages = groupByPackageName(previous);
  const currentPackages = groupByPackageName(current);

  const removedResult = [];
  const changedResult = [];

  previousPackages.forEach(prevPkg => {
    const foundCurPkg = currentPackages.find(curPkg => curPkg.name === prevPkg.name);
    if (!foundCurPkg) {
      removedResult.push(prevPkg);
    } else {
      const diff = arrDiff(foundCurPkg.versions, prevPkg.versions);
      if (diff.length) {
        changedResult.push({
          name: prevPkg.name,
          previousVersions: Array.from(new Set(prevPkg.versions)),
          currentVersions: Array.from(new Set(foundCurPkg.versions)),
          diff,
        });
      }
    }
  });
  return { removed: removedResult, changed: changedResult };
}

/**
 * === cli ===
 */

function getArgs() {
  const idx = process.argv.findIndex(a => a === '--versions-back');
  let versionsBack;
  if (idx > 0) {
    versionsBack = Number(process.argv[idx + 1]);
    if (Number.isNaN(versionsBack)) {
      throw new Error('Please provide a number for --versions-back');
    }
  } else {
    versionsBack = 1;
  }
  return { versionsBack };
}

async function main() {
  const { versionsBack } = getArgs();
  const changeHistory = await execPromise(`git log yarn.lock`);
  const commits = changeHistory
    .match(/commit (.*)\n/g)
    .map(c => c.replace('commit ', '').replace('\n', ''));

  // For now, we pick latest commit. When needed in the future, allow '--age 2-months' or smth
  const prevLockContents = await execPromise(`git show ${commits[versionsBack - 1]}:yarn.lock`);
  const curLockContents = await fs.promises.readFile('yarn.lock', 'utf8');

  // eslint-disable-next-line no-console
  console.log(JSON.stringify(yarnLockDiff(prevLockContents, curLockContents), null, 2));
}

main();
