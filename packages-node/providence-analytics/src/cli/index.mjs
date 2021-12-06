#!/usr/bin/env node
import { cli } from './cli.mjs';
import { providenceConfUtil } from '../program/utils/providence-conf-util.mjs';

(async () => {
  // We need to provide config to cli, until whole package is rewritten as ESM.
  const { providenceConf } = await providenceConfUtil.getConf();
  cli({ providenceConf });
})();
