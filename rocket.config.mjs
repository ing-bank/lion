import { rocketLaunch } from '@rocket/launch';
import { rocketSearch } from '@rocket/search';
import { rocketBlog } from '@rocket/blog';
import { absoluteBaseUrlNetlify } from '@rocket/core/helpers';
import { TitleMetaPlugin } from '@rocket/cli';
import { adjustPluginOptions, removePlugin } from 'plugins-manager';
import { mdjsSetupCode } from '@mdjs/core';
import { copy } from '@web/rollup-plugin-copy';

// For playground, we need to serve all files from our own repo
// For that, we need to start from our own repo @lion/ui.
// Then we traverse its package json and identify all its prod deps
// This will result in a list of (transitive) prod deps, each with a set of exports
// These exports or export maps will need to be turned into import maps

// These import maps will then be written back to our simulator file.

// For file sharing, we do:
// https://github.com/lit/lit.dev/blob/59af2580754671ebfd2e281d6515efeca1a27eb1/packages/lit-dev-content/src/components/litdev-playground-share-button.ts
// https://github.com/lit/lit.dev/blob/59af2580754671ebfd2e281d6515efeca1a27eb1/packages/lit-dev-content/src/components/litdev-playground-share-long-url.ts
// https://github.com/lit/lit.dev/blob/59af2580754671ebfd2e281d6515efeca1a27eb1/packages/lit-dev-content/src/components/litdev-playground-page.ts#L328

// For security, we make sure the iframe can never call its parent
// This needs to be cheap and simple (no in-browser ast parsing), but solid =>
// `content.replace(/(document\.defaultView\.|window\.|\n|\r|\s)(parent|top)/g, '$1$$2');`.
// All calls to `parent` or `window.parent` for instance, will become `$parent` and `window.$parent`

//

export default {
  presets: [rocketLaunch(), rocketSearch(), rocketBlog()],
  eleventy(eleventyConfig) {
    eleventyConfig.setUseGitIgnore(false);
  },
  absoluteBaseUrl: absoluteBaseUrlNetlify('http://localhost:8080'),
  setupUnifiedPlugins: [
    adjustPluginOptions(mdjsSetupCode, {
      simulationSettings: {
        simulatorUrl: '/simulator/',
        languages: [
          { key: 'de-DE', name: 'German' },
          { key: 'en-GB', name: 'English (United Kingdom)' },
          { key: 'en-US', name: 'English (United States)' },
          { key: 'nl-NL', name: 'Dutch' },
        ],
      },
    }),
  ],
  setupBuildPlugins: [
    adjustPluginOptions(copy, config => {
      // eslint-disable-next-line no-param-reassign
      config.patterns = [...config.patterns, 'docs/**/assets/**'];
      return config;
    }),
  ],
  setupEleventyComputedConfig: [removePlugin(TitleMetaPlugin)],
};
