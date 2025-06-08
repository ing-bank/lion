import path from 'path';
import { fileURLToPath } from 'url';
import { addPlugin } from 'plugins-manager';
// @ts-ignore
import remarkExtendPkg from 'remark-extend';
// eslint-disable-next-line import/no-extraneous-dependencies
import markdownPkg from 'remark-parse';
import {
  remarkExtendLionDocsTransformJs,
  remarkUrlToLocal,
  generateExtendDocsConfig,
} from 'rocket-preset-extend-lion-docs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

console.log('99 extendLionDocsInhanced.js 1');

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
 * @param {function} [opts.globalReplaceFunction] a remark-extend replace function that is executed on all markdown ast nodes
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
  globalReplaceFunction,
}) {
  console.log('222 extendLionDocs called 1');
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

  console.log('222 extendLionDocs called');
  const _rootDir = rootDir || path.resolve('.');

  // Astro requires to provide plugin with options in the array as follows: [plugin, options_object]
  const remarkUrlToLocalPlugin = [
    remarkUrlToLocal,
    {
      gitHubUrl: 'https://github.com/ing-bank/lion/',
      rootDir: _rootDir,
    },
  ];

  const remarkExtendLionDocsTransformJsPlugin = [
    remarkExtendLionDocsTransformJs,
    { extendDocsConfig },
  ];

  const remarkExtendPlugin = [remarkExtendPkg.remarkExtend, { globalReplaceFunction }];

  return [remarkUrlToLocalPlugin, remarkExtendPlugin, remarkExtendLionDocsTransformJsPlugin];
}
