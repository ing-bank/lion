const storiesPatternsToFiles = require('@open-wc/demoing-storybook/src/shared/storiesPatternsToFiles.js');

const { convertLionModules } = require('./convertLionModules.js');

function createConvertLionModulesMiddleware(userOptions) {
  // eslint-disable-next-line no-unused-vars
  return async function convertLionModulesMiddleware({ url, status, contentType, body }) {
    const storyFiles = await storiesPatternsToFiles(userOptions.stories, userOptions.mainJsDir);
    const storyUrlsForServer = storyFiles.map(file => file.replace(userOptions.rootDir, ''));

    const findPackageRegex = new RegExp(
      userOptions.findPackageRegex || '/node_modules/@lion/(.*?)/.*',
    );
    const matches = url.match(findPackageRegex);
    const lionPackageName = matches && matches[1];

    if (lionPackageName && storyUrlsForServer.includes(url)) {
      const options = {
        ...userOptions,
        currentPackage: lionPackageName,
      };
      const html = convertLionModules(body, options);
      return {
        body: html,
        contentType: 'text/html',
      };
    }
    return undefined;
  };
}

module.exports = {
  createConvertLionModulesMiddleware,
};
