#!/usr/bin/env node

import { existsSync } from 'fs';
import path from 'path';
import { MigrateCli } from './MigrateCli.js';

const cli = new MigrateCli();

const cwd = process.cwd();
const configFiles = [
  path.join('config', 'migrate-cli.config.js'),
  path.join('config', 'migrate-cli.config.mjs'),
  'migrate-cli.config.js',
  'migrate-cli.config.mjs',
];

for (const configFile of configFiles) {
  const configFilePath = path.join(cwd, configFile);
  if (existsSync(configFilePath)) {
    cli.options.configFile = configFilePath;
    break;
  }
}

await cli.start();
