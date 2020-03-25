const { mdjsTransformer } = require('@mdjs/core');

module.exports = {
  nodeResolve: true,
  // open: 'packages/button/README.md',
  watch: true,
  responseTransformers: [mdjsTransformer],
};
