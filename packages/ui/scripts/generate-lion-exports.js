#!/usr/bin/env node
/**
 * This script aims to bypass the requirement of package export support,
 * by expanding export map manually, and shipping along with the distributed release
 */
import path from 'path';
// eslint-disable-next-line import/no-extraneous-dependencies
import { bypassImportMap, bypassExportMap } from '@lion/nodejs-helpers';

// relative to process.cwd(), aka directory where the script is running from
const packageDir = path.resolve(process.env.PACKAGE_DIR || '.');
await bypassImportMap(packageDir, { ignoredDirs: ['node_modules', 'scripts', 'docs'] });
await bypassExportMap(packageDir, { ignoredExportMapKeys: ['./docs/*'] });
