/* eslint-disable import/no-extraneous-dependencies */
module.exports = {
  '*.js': ['eslint --fix', 'prettier --write'],
  '*.md': [
    'prettier --write',
    "markdownlint --ignore '{.github/**/*.md,.changeset/*.md,**/CHANGELOG.md,packages/ui/_legacy-changelogs/*.md}'",
  ],
  'package-lock.json': ['node ./scripts/lock-scan.mjs'],
  '*package.json': absolutePaths => {
    const sortPackages = [];
    absolutePaths.forEach(p => {
      sortPackages.push(`node ./scripts/sort-package-json.js ${p}`);
    });
    return [...sortPackages, `node ./scripts/lint-versions.js`];
  },
};
