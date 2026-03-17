import lit from '@astrojs/lit';
import { defineConfig } from 'astro/config';
import { mdjsParse, mdjsStoryParse, mdjsSetupCode } from '@mdjs/core';
import pagefind from 'astro-pagefind';
import { remarkProcessDemos } from './src/utils/remark-plugins/remark-process-demos.mjs';
import { remarkModifiedTime } from './src/utils/remark-plugins/remark-modified-time.mjs';
import { remarkRewriteMdLinks } from './src/utils/remark-plugins/remark-rewrite-md-links.mjs';

const mdjsSetupConfig = {
  simulationSettings: {
    simulatorUrl: '/next/simulator',
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
      mdjsParse,
      mdjsStoryParse,
      [mdjsSetupCode, mdjsSetupConfig],
      remarkProcessDemos,
      remarkModifiedTime,
      remarkRewriteMdLinks,
    ],
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
    },
  },
});
