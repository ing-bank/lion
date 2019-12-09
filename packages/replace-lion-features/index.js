const { replaceLionFeatures } = require('./src/replaceLionFeatures.js');
const { replaceComponent } = require('./src/replaceComponent.js');
const {
  createLionFeaturesReplaceMiddleware,
} = require('./src/createLionFeaturesReplaceMiddleware.js');

module.exports = {
  replaceComponent,
  replaceLionFeatures,
  createLionFeaturesReplaceMiddleware,
};
