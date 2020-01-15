const { createConvertLionModulesMiddleware } = require('../../index.js');

module.exports = {
  stories: ['../../../{calendar,input}/stories/*.stories.mdx'],
  esDevServer: {
    nodeResolve: true,
    watch: true,
    open: true,
    responseTransformers: [
      createConvertLionModulesMiddleware({
        outPrefix: 'demo',
        getIndexClassImportPath: ({ outPackageName, originalPath }) => {
          if (outPackageName === 'calendar') {
            return `../../../../packages/convert-lion-modules/demo/index.js`;
          }
          return originalPath;
        },
        getTagImportPath: ({ outPackageName, outTagName, originalPath }) => {
          if (outPackageName === 'calendar') {
            return `../../../../packages/convert-lion-modules/demo/${outTagName}.js`;
          }
          return originalPath;
        },
      }),
    ],
  },
};
