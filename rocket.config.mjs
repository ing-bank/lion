import { rocketLaunch } from '@rocket/launch';
import { rocketSearch } from '@rocket/search';
import { rocketBlog } from '@rocket/blog';
import { absoluteBaseUrlNetlify } from '@rocket/core/helpers';
import { adjustPluginOptions } from 'plugins-manager';
import { mdjsSetupCode } from '@mdjs/core';
import { copy } from '@web/rollup-plugin-copy';
import { esbuildPlugin } from '@web/dev-server-esbuild';
import { fileURLToPath } from 'url';

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
  devServer: {
    plugins: [
      esbuildPlugin({
        ts: true,
        js: true,
        target: 'auto',
        forceTsLoader: true,
        tsconfig: fileURLToPath(new URL('./tsconfig.json', import.meta.url)),
      }),
    ],
  },
};
