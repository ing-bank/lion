import { defineConfig } from "astro/config";
import lit from "@astrojs/lit";
import { remarkExtend } from 'remark-extend';
import { mdjsParse, mdjsStoryParse, mdjsSetupCode } from '@mdjs/core';
import lionIntegration from './src/utils/astrojs-integration/lion/lion-integration.js'
import { copyMdjsStories } from './src/utils/remark-plugings/copyMdjsStories/index.js';
//console.log('111 before extendLionDocsInstance');
//import { extendLionDocsInstance } from './src/utils/remark-plugings/wrapper-for-rocket-preset-extend-lion-docs/wrapper.js';
//console.log('11 extendLionDocsInstance: ', extendLionDocsInstance)

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
    //remarkPlugins: [...extendLionDocsInstance, mdjsParse, mdjsStoryParse, [mdjsSetupCode, mdjsSetupConfig], copyMdjsStories],
    remarkPlugins: [remarkExtend, mdjsParse, mdjsStoryParse, [mdjsSetupCode, mdjsSetupConfig], copyMdjsStories],
  },
  // the fix is copied from https://github.com/withastro/astro/issues/5517#issuecomment-1337328843.
  // This allows to import rocket-preset-extend-lion-docs. The following error pops up otherwise:
  // ```
  // [ERROR] Top-level await is not available in the configured target environment ("chrome87", "edge88", "es2020", "firefox78", "safari14" + 2 overrides)
  // node_modules/rocket-preset-extend-lion-docs/src/getPublicApiOfPkg.js:6:0:
  // 6 │ await init;
  // ```
  vite: {
    optimizeDeps: {
      exclude: ['rocket-preset-extend-lion-docs']
    }
  },
});
