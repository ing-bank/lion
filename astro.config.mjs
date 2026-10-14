import lit from '@lion/astro-lit';
import { defineConfig } from 'astro/config';
import { mdjsParse, mdjsStoryParse, mdjsSetupCode } from '@mdjs/core';
import pagefind from 'astro-pagefind';
import { remarkProcessDemos } from './src/utils/remark-plugins/remark-process-demos.mjs';
import { remarkModifiedTime } from './src/utils/remark-plugins/remark-modified-time.mjs';
import { remarkRewriteMdLinks } from './src/utils/remark-plugins/remark-rewrite-md-links.mjs';

// The portal is published under a prefix: '/next' for the production site, another prefix
// for a branch preview (see scripts/deploy-portal-preview.mjs). Everything inside the portal
// resolves its urls against import.meta.env.BASE_URL, so the prefix is a build time concern.
const base = process.env.ASTRO_BASE_URL || '/next';

const mdjsSetupConfig = {
  simulationSettings: {
    simulatorUrl: `${base}/simulator`,
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
  base,
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
