import path from 'path';
import { fileURLToPath } from 'url';
import { addPlugin } from 'plugins-manager';
// @ts-ignore
import remarkExtendPkg from 'remark-extend';
// eslint-disable-next-line import/no-extraneous-dependencies
import markdownPkg from 'remark-parse';
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
      addPlugin(
        remarkUrlToLocal,
        // the page object gets injected globally
        // @ts-ignore
        {
          gitHubUrl: 'https://github.com/ing-bank/lion/',
          rootDir: _rootDir,
        },
        {
          location: markdownPkg,
        },
      ),
      addPlugin(
        remarkExtendLionDocsTransformJs,
        // those types will need to be better specified
        // @ts-ignore
        { extendDocsConfig },
        {
          location: remarkUrlToLocal,
        },
      ),
      addPlugin(
        remarkExtendPkg.remarkExtend,
        { globalReplaceFunction },
        {
          location: remarkUrlToLocal,
        },
      ),
    ],
  };
}
