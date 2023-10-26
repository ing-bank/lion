import { defineConfig } from "astro/config";
import lit from "@astrojs/lit";
import { mdjsParse, mdjsStoryParse, mdjsSetupCode } from '@mdjs/core';
import lionIntegration from './src/utils/astrojs-integration/lion/lion-integration.mjs'
import { copyMdjsStories } from './src/utils/remark-plugings/copyMdjsStories/index.js';
import { updateMainTagsForMdjsStories } from './src/utils/remark-plugings/updateMainTagsForMdjsStories/index.js';

const mdjsSetupConfig = {
  simulationSettings: {
    simulatorUrl: '/simulator/',
    languages: [
      { key: 'de-DE', name: 'German' },
      { key: 'en-GB', name: 'English (United Kingdom)' },
      { key: 'en-US', name: 'English (United States)' },
      { key: 'nl-NL', name: 'Dutch' },
    ],
  },
};

// https://astro.build/config
export default defineConfig({
  integrations: [lit(), lionIntegration()],
  markdown: {  
    remarkPlugins: [updateMainTagsForMdjsStories, mdjsParse, mdjsStoryParse, [mdjsSetupCode, mdjsSetupConfig], copyMdjsStories],
  },
  vite: {
    // the fix is copied from https://github.com/withastro/astro/issues/5517#issuecomment-1337328843.
    // This allows to import rocket-preset-extend-lion-docs. The following error pops up otherwise:
    // ```
    // [ERROR] Top-level await is not available in the configured target environment ("chrome87", "edge88", "es2020", "firefox78", "safari14" + 2 overrides)
    // node_modules/rocket-preset-extend-lion-docs/src/getPublicApiOfPkg.js:6:0:
    // 6 │ await init;
    // ```
    optimizeDeps: {
      exclude: ['rocket-preset-extend-lion-docs']
    },
    // Fix taken from https://github.com/vitejs/vite/issues/6985#issuecomment-1044375490.
    // It throws an error otherwise:
    // ```
    // astro-poc2/node_modules/vite/dist/node/chunks/dep-df561101.js:43799
    // const err = new Error('The server is being restarted or closed. Request is outdated');
    // ```
    // Note, if this erorr is still present, as a workaround try adding 'esnext' to node_modules/vite/dist/node/constants.js -> ESBUILD_MODULES_TARGET
    // build: {
    //   target: 'esnext'
    // },
  },
});
