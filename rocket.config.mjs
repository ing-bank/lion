import { rocketLaunch } from '@rocket/launch';
import { rocketSearch } from '@rocket/search';
import { rocketBlog } from '@rocket/blog';
import { adjustPluginOptions } from 'plugins-manager';

export default {
  presets: [rocketLaunch(), rocketSearch(), rocketBlog()],
  setupBuildPlugins: [
    adjustPluginOptions('copy', config => {
      config.patterns = [...config.patterns, 'docs/**/assets/**'];
      return config;
    }),
  ],
};
