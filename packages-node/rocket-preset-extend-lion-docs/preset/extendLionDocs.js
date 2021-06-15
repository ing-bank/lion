import path from 'path';
import { fileURLToPath } from 'url';

import { addPlugin } from 'plugins-manager';
// @ts-ignore
import remarkExtendPkg from 'remark-extend';
import { remarkExtendLionDocsTransformJs } from '../src/remarkExtendLionDocsTransformJs.js';
import { remarkUrlToLocal } from '../src/remarkUrlToLocal.js';
import { generateExtendDocsConfig } from '../src/generateExtendDocsConfig.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * @param {object} opts
 * @param {string} [opts.rootDir]
 * @param {string} [opts.nodeModulesDir]
 * @param {string} [opts.npmScope]
 * @param {string} opts.classPrefix
 * @param {string} opts.classBareImport
 * @param {string} opts.tagPrefix
 * @param {string} opts.tagBareImport
 * @param {string} opts.tagBareImport
 * @param {string} [opts.exportsMapJsonFileName]
 * @returns
 */
export async function extendLionDocs({
  rootDir,
  nodeModulesDir,
  npmScope,
  classPrefix,
  classBareImport,
  tagPrefix,
  tagBareImport,
  exportsMapJsonFileName,
}) {
  const changes = await generateExtendDocsConfig({
    nodeModulesDir,
    npmScope,
    classPrefix,
    classBareImport,
    tagPrefix,
    tagBareImport,
    exportsMapJsonFileName,
  });
  const extendDocsConfig = {
    changes,
  };

  const _rootDir = rootDir || path.resolve('.');

  return {
    path: path.resolve(__dirname),
    setupUnifiedPlugins: [
      addPlugin({
        name: 'remark-extend',
        plugin: remarkExtendPkg.remarkExtend,
        location: 'markdown',
      }),
      addPlugin({
        name: 'github-urls-to-local',
        plugin: remarkUrlToLocal,
        location: 'remark-extend',
        options: {
          gitHubUrl: 'https://github.com/ing-bank/lion/',
          rootDir: _rootDir,
        },
      }),
      addPlugin({
        name: 'remark-extend-lion-docs-transform-js',
        plugin: remarkExtendLionDocsTransformJs,
        location: 'remark-extend',
        options: { extendDocsConfig },
      }),
    ],
  };
}
