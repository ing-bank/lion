// @ts-expect-error
import { memoize } from 'providence-analytics/utils.js';
import semver from 'semver';
import path from 'path';
import fs from 'fs';

/**
 * @type {{[monoRoot:string]: string[]}}
 */

/**
 * @param {{monoRoot:string, depsToCheck:{name: string; minVersion?: string; }[];}} opts
 * @returns {Promise<string[]>}
 */
async function getMonoRootDepsUnMemoized({ monoRoot, depsToCheck }) {
  const packageJsonPath = path.join(monoRoot, 'package.json');
  if (!fs.existsSync(packageJsonPath)) {
    throw new Error(`package.json not found for ${monoRoot}. Please provide a correct monoRoot`);
  }

  const packageJson = JSON.parse((await fs.promises.readFile(packageJsonPath)).toString());
  const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };

  const foundPackages = [];
  for (const depToCheck of depsToCheck) {
    // eslint-disable-next-line no-continue
    if (!deps[depToCheck.name]) continue;

    if (depToCheck.minVersion) {
      const coercedVersionFound = /** @type {* & string} */ (semver.coerce(deps[depToCheck.name]));
      // eslint-disable-next-line no-continue
      if (semver.lt(coercedVersionFound, depToCheck.minVersion)) continue;
    }
    foundPackages.push(depToCheck.name);
  }
  return foundPackages;
}

const getMonoRootDeps = memoize(getMonoRootDepsUnMemoized, { serializeObjects: true });

/**
 * For a given set of deps, checks whether they are used in package.json
 * When a monoroot depends on package (usually via devDependencies),
 * there will be no requirement for a workspace package to depend on it as well.
 * @param {string} inputDir
 * @param {{depsToCheck:{name: string; minVersion?: string; }[];monoRoot?:string;}} opts
 * @returns {Promise<void>}
 */
// @ts-ignore
export async function verifyPackageJson(inputDir, { depsToCheck, monoRoot } = {}) {
  const isMonoRoot = inputDir === monoRoot;
  let monoRootDeps = null;
  if (!isMonoRoot) {
    monoRootDeps = monoRoot ? await getMonoRootDeps({ monoRoot, depsToCheck }) : null;
  }

  const packageJsonPath = path.join(inputDir, 'package.json');
  if (!fs.existsSync(packageJsonPath)) {
    throw new Error(
      `package.json not found for ${inputDir}. Please run this command in the root directory of your component/app.`,
    );
  }

  const packageJson = JSON.parse((await fs.promises.readFile(packageJsonPath)).toString());
  const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };

  for (const depToCheck of depsToCheck) {
    // eslint-disable-next-line no-continue
    if (monoRootDeps?.includes(depToCheck.name)) continue;

    if (!deps[depToCheck.name]) {
      throw new Error(
        `package.json of ${inputDir} does not have ${depToCheck.name} as a dependency`,
      );
    }

    if (depToCheck.minVersion) {
      const coercedVersionFound = /** @type {* & string} */ (semver.coerce(deps[depToCheck.name]));

      if (semver.lt(coercedVersionFound, depToCheck.minVersion)) {
        throw new Error(
          `package.json of ${inputDir} is using version ${
            deps[depToCheck.name]
          } of ${depToCheck.name}. You need to use at least version ${depToCheck.minVersion}`,
        );
      }
    }
  }
}
