import { defineConfig } from "astro/config";
import lit from "@astrojs/lit";
import { mdjsParse, mdjsStoryParse, mdjsSetupCode } from '@mdjs/core';
import lionIntegration from './src/utils/astrojs-integration/lion/lion-integration.js'
import { copyMdjsStories } from './src/utils/remark-plugings/copyMdjsStories/index.js';

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
    remarkPlugins: [mdjsParse, mdjsStoryParse, [mdjsSetupCode, mdjsSetupConfig], copyMdjsStories],
  }});
