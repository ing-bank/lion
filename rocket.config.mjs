import { rocketLaunch } from '@rocket/launch';
import { rocketBlog } from '@rocket/blog';
import { absoluteBaseUrlNetlify } from '@rocket/core/helpers';
import { TitleMetaPlugin } from '@rocket/cli';
import { adjustPluginOptions, addPlugin, removePlugin } from 'plugins-manager';
import matter from 'gray-matter';
import { mdjsSetupCode } from '@mdjs/core';
import { copy } from '@web/rollup-plugin-copy';

/**
 * Plugin SocialMediaImagePlugin depends on titleMeta property
 * This property is wrapped into Proxy so it cannot be dynamically enhanced inside SocialMediaImagePlugin
 * It should really come from another plugin with "dataName" key eq to "titleMeta"
 */
class LionTitleMetaPlugin {
  static dataName = 'titleMeta';

  async execute(data) {
    if (data.titleMeta) {
      return data.titleMeta;
    }
    const grayMatterFile = await matter.read(data.page.inputPath);
    if (grayMatterFile.data) {
      return grayMatterFile.data;
    }

    return {};
  }
}

export default {
  presets: [rocketLaunch(), rocketBlog()],
  eleventy(eleventyConfig) {
    eleventyConfig.setUseGitIgnore(false);
  },
  checkLinks: {
    ignoreLinkPatterns: ['**/astro'],
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
  setupEleventyComputedConfig: [removePlugin(TitleMetaPlugin), addPlugin(LionTitleMetaPlugin)],
};
