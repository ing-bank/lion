const { convertLionModules } = require('./convertLionModules.js');

function createConvertLionModulesMiddleware(userOptions) {
  // eslint-disable-next-line no-unused-vars
  return async function convertLionModulesMiddleware({ url, status, contentType, body }) {
    if (url === '/packages/calendar/stories/index.stories.mdx') {
      const options = {
        ...userOptions,
        currentPackage: 'calendar',
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
