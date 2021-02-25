import { rocketLaunch } from '@rocket/launch';
import { rocketSearch } from '@rocket/search';
import { rocketBlog } from '@rocket/blog';

export default {
  presets: [rocketLaunch(), rocketSearch(), rocketBlog()],
  devServer: {
    nodeResolve: {
      exportConditions: ['development'],
      // dedupe: true,
    }
  }
};
