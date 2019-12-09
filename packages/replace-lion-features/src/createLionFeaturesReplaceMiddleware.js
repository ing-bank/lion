const { replaceLionFeatures } = require('./replaceLionFeatures.js');

function createLionFeaturesReplaceMiddleware(userOptions) {
  return async function lionFeaturesReplaceMiddleware({ url, status, contentType, body }) {
    if (url === '/packages/calendar/stories/index.stories.mdx') {
      const options = {
        ...userOptions,
        currentPackage: 'calendar',
      };
      const html = replaceLionFeatures(body, options);
      return {
        body: html,
        contentType: 'text/html',
      };
    }
    return undefined;
  };
}

module.exports = {
  createLionFeaturesReplaceMiddleware,
};
