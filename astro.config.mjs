import lit from '@astrojs/lit';
import { defineConfig } from 'astro/config';
import { mdjsParse, mdjsStoryParse, mdjsSetupCode } from '@mdjs/core';
import pagefind from 'astro-pagefind';
import { copyMdjsStories } from './src/utils/remark-plugings/copyMdjsStories/index.js';
import { remarkModifiedTime } from './src/utils/remark-plugings/remark-modified-time.mjs';

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
  base: '/next',
  trailingSlash: 'never',
  integrations: [lit(), pagefind()],
  markdown: {
    // ing-web
    remarkPlugins: [
      // todo: not clear why these plugins are not applied during build
      // todo: because of this mdjsStoriesPath is not present in the templates
      mdjsParse,
      mdjsStoryParse,
      [mdjsSetupCode, mdjsSetupConfig],
      [copyMdjsStories, { mode: import.meta.env.MODE }],
      remarkModifiedTime,
    ],
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
    },
    // lion
    //remarkPlugins: [mdjsParse, mdjsStoryParse, [mdjsSetupCode, mdjsSetupConfig], copyMdjsStories],
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
      // exclude: ['rocket-preset-extend-lion-docs'],
      noDiscovery: true,
      include: [],
    },
  },
});
