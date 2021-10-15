import { rocketLaunch } from '@rocket/launch';
import { rocketSearch } from '@rocket/search';
import { rocketBlog } from '@rocket/blog';
import { absoluteBaseUrlNetlify } from '@rocket/core/helpers';
import { adjustPluginOptions } from 'plugins-manager';
import { mdjsSetupCode } from '@mdjs/core';
import { copy } from '@web/rollup-plugin-copy';

export default {
  presets: [rocketLaunch(), rocketSearch(), rocketBlog()],
  absoluteBaseUrl: absoluteBaseUrlNetlify('http://localhost:8080'),
  setupUnifiedPlugins: [
    adjustPluginOptions(mdjsSetupCode, {
      simulationSettings: {
        simulatorUrl: '/simulator/',
        languages: [
          { key: 'en-US', name: 'English (United States)' },
          { key: 'en-US', name: 'English (United Kingdom)' },
          { key: 'de-DE', name: 'German' },
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
};
