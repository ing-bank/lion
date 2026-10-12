#!/usr/bin/env node
import { cli } from '#cli/cli.js';
import { providenceConfUtil } from '#utils/providence-conf-util.js';

(async () => {
  // We need to provide config to cli, until whole package is rewritten as ESM.
  const { providenceConf } = (await providenceConfUtil.getConf()) || {};
  cli({ providenceConf });
})();
