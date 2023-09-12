import { defineConfig } from "astro/config";
import lit from "@astrojs/lit";
import { mdjsParse, mdjsStoryParse, mdjsSetupCode } from '@mdjs/core';
import lionIntegration from './src/components/utils/lion-integration.js'

// https://astro.build/config
export default defineConfig({
  integrations: [lit(), lionIntegration()],
  markdown: {
    remarkPlugins: [mdjsParse, mdjsStoryParse, mdjsSetupCode],
  }});
