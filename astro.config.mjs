import { defineConfig } from "astro/config";
import lit from "@astrojs/lit";
import { mdjsParse, mdjsStoryParse, mdjsSetupCode } from '@mdjs/core';
import lionIntegration from './src/utils/astrojs-integration/lion/lion-integration.js'
import { copyMdjsStories } from './src/utils/remark-plugings/copyMdjsStories/index.js';

// https://astro.build/config
export default defineConfig({
  integrations: [lit(), lionIntegration()],
  markdown: {
    remarkPlugins: [mdjsParse, mdjsStoryParse, mdjsSetupCode, copyMdjsStories],
  }});
