import lit from '@lion/astro-lit';
import { defineConfig } from 'astro/config';
import { mdjsParse, mdjsStoryParse, mdjsSetupCode } from '@mdjs/core';
import pagefind from 'astro-pagefind';
import { remarkProcessDemos } from './src/utils/remark-plugins/remark-process-demos.mjs';
import { remarkModifiedTime } from './src/utils/remark-plugins/remark-modified-time.mjs';
import { remarkRewriteMdLinks } from './src/utils/remark-plugins/remark-rewrite-md-links.mjs';

// The portal is published under a prefix: '/' for the production site (astro owns the site root,
// the legacy rocket site moved to '/prev'), and another prefix for a branch preview (see
// scripts/deploy-portal-preview.mjs). Everything inside the portal resolves its urls against
// import.meta.env.BASE_URL, so the prefix is a build time concern.
// Astro keeps BASE_URL as given, which is '/' at the root and '/next-preview/<branch>' (no
// trailing slash) for a preview, so every join below is written as `${base.replace(/\/$/, '')}/x`
// to be correct for both.
const base = process.env.ASTRO_BASE_URL || '/';

const mdjsSetupConfig = {
  simulationSettings: {
    simulatorUrl: `${base.replace(/\/$/, '')}/simulator`,
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
  // The portal is its own (non-workspace) package, yet it renders the repository's own site:
  // the pages are the library's `docs/` tree (see src/content.config.ts) and the built site lands
  // in the repository root, where the root deploy and the preview script expect it.
  outDir: '../_site',
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
