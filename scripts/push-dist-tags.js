const globby = require('globby');
const path = require('path');
const { exec } = require('child_process');

/**
 * Post publish script on mono-level to update lit-legacy dist-tag
 * to latest lit-legacy versions for lion.
 *
 * TODO: https://github.com/atlassian/changesets/issues/249
 * use changeset publish --tag once it is implemented
 */
(async () => {
  // Get all paths to @lion package.jsons inside our monorepo
  let pkgJsonPaths = await globby('packages/*/package.json');
  pkgJsonPaths = pkgJsonPaths.filter(p => !p.startsWith('packages/singleton-manager'));

  for (const pkgJsonPath of pkgJsonPaths) {
    // eslint-disable-next-line import/no-dynamic-require, global-require
    const json = require(path.resolve(pkgJsonPath));
    const { name, version } = json;

    exec(
      `npm dist-tag add ${name}@${version} lit-legacy`,
      { env: { ...process.env } },
      (err, out) => {
        if (err) {
          console.error(err);
        }
        if (out) {
          console.log(out);
        }
      },
    );
  }
})();
