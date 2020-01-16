const path = require('path');

const { createConvertLionModulesMiddleware } = require('../../index.js');

const supportedPackages = ['button'];

const stories = ['../../../{calendar,button,form-system}/stories/*.stories.mdx'];

module.exports = {
  stories,
  esDevServer: {
    nodeResolve: true,
    watch: true,
    open: true,
    responseTransformers: [
      createConvertLionModulesMiddleware({
        stories,
        mainJsDir: __dirname,
        rootDir: path.resolve(__dirname, '../../../../'),
        findPackageRegex: '/packages/(.*?)/.*',
        outPrefix: 'wolf',
        getIndexClassImportPath: ({ outPackageName, originalPath }) => {
          if (supportedPackages.includes(outPackageName)) {
            return `../../../../packages/convert-lion-modules/demo/index.js`;
          }
          return originalPath;
        },
        getTagImportPath: ({ outPackageName, outTagName, originalPath }) => {
          if (supportedPackages.includes(outPackageName)) {
            return `../../../../packages/convert-lion-modules/demo/${outTagName}.js`;
          }
          return originalPath;
        },
        shouldReplaceTagGlobally: ({ outPackageName }) => {
          return supportedPackages.includes(outPackageName);
        },
        shouldReplaceClassGlobally: ({ outPackageName }) => {
          return supportedPackages.includes(outPackageName);
        },
      }),
    ],
  },
};
