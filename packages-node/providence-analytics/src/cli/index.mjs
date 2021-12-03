#!/usr/bin/env node
import { cli } from './cli.mjs';
import { getProvidenceConf } from '../program/utils/get-providence-conf.mjs';

(async () => {
  // We need to provide config to cli, until whole package is rewritten as ESM.
  const { providenceConf } = await getProvidenceConf();
  cli({ providenceConf });
})();
