import { rocketLaunch } from '@rocket/launch';
import { rocketSearch } from '@rocket/search';
import { rocketBlog } from '@rocket/blog';
import { adjustPluginOptions } from 'plugins-manager';
import { absoluteBaseUrlNetlify } from '@rocket/core/helpers';

export default {
  presets: [rocketLaunch(), rocketSearch(), rocketBlog()],
  absoluteBaseUrl: absoluteBaseUrlNetlify('http://localhost:8080'),
  setupBuildPlugins: [
    adjustPluginOptions('copy', config => {
      config.patterns = [...config.patterns, 'docs/**/assets/**'];
      return config;
    }),
  ],
};
