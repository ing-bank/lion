const globalSettings = require('../global-settings.js');

/**
 * @param {string} text
 */
function debug(text) {
  if (globalSettings.debug) {
    // eslint-disable-next-line no-console
    console.log(text);
  }
}

module.exports = {
  debug,
};
