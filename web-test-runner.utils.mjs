/**
 * Scans for test groups in the project.
 * Uses getGroupName and hasTestFiles helpers.
 * @returns {Promise<Array<{name: string, files: string}>>}
 */
export async function getTestGroups() {
  const { glob } = await import('node:fs/promises');
  // node:fs/promises glob returns an async iterable, not an array
  const allDirs = [];
  for (const pattern of ['packages/*/test', 'packages/ui/components/**/test']) {
    const dirs = await glob(pattern);
    for await (const d of dirs) allDirs.push(d);
  }

  // Build group objects for directories that have test files and valid names
  const groupPromises = allDirs.map(async dir => {
    const name = getGroupName(dir);
    if (!name) return null;
    const pattern = `${dir}/**/*.test.js`;
    if (await hasTestFiles(pattern)) {
      return { name, files: pattern };
    }
    return null;
  });

  function isTestGroup(g) {
    return g && typeof g.name === 'string' && typeof g.files === 'string';
  }
  const groups = await Promise.all(groupPromises);
  return groups.filter(isTestGroup);
}

/**
 * Extracts the group name from a directory path.
 * E.g. 'packages/foo/test' => 'foo'
 * @param {string} dir
 * @returns {string|null}
 */
export function getGroupName(dir) {
  const parts = dir.split('/');
  const name = parts.length >= 2 ? parts[parts.length - 2] : null;
  return name;
}

/**
 * Checks if a directory contains any test files matching the pattern.
 * @param {string} pattern
 * @returns {Promise<boolean>}
 */
export async function hasTestFiles(pattern) {
  try {
    const { glob } = await import('glob');
    const files = await glob(pattern, { nodir: true });
    // glob from 'glob' returns an array, so .length is valid
    return Array.isArray(files) && files.length > 0;
  } catch {
    return false;
  }
}
