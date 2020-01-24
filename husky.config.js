module.exports = {
  hooks: {
    'pre-commit': 'lint-staged && node ./scripts/yarn-lock-scan.js',
    'commit-msg': 'commitlint -E HUSKY_GIT_PARAMS',
  },
};
