import path from 'path';
import { fileURLToPath } from 'url';
import { globby } from 'globby';
import lit from '@astrojs/lit';
import { defineConfig } from 'astro/config';
import { mdjsParse, mdjsStoryParse, mdjsSetupCode } from '@mdjs/core';
import { copyMdjsStories } from './src/utils/remark-plugings/copyMdjsStories/index.js';


const publicJsFiles = await globby('public/**/*.js');
const publicMdFilesObj = Object.fromEntries(
  publicJsFiles.map(file => [
    // This remove `src/` as well as the file extension from each
    // file, so e.g. src/nested/foo.js becomes nested/foo
    path.relative('public', file.slice(0, file.length - path.extname(file).length)),
    // This expands the relative paths to absolute paths, so e.g.
    // src/nested/foo becomes /project/src/nested/foo.js
    fileURLToPath(new URL(file, import.meta.url)),
  ]),
);

console.log('publicMdFilesObj: ', publicMdFilesObj);

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

console.log('mode', import.meta.env.MODE);

// https://astro.build/config
export default defineConfig({
  // redirect /components/accordion to /components/accordion/overview
  // this is done in Lion via index.md: -> go to Overview
  redirects: {
    '/components/[component]': '/components/[component]/overview',
  },
  integrations: [lit()],
  markdown: {
    // ing-web
    remarkPlugins: [
      /*...extendLionDocsInstance,*/ mdjsParse,
      mdjsStoryParse,
      [mdjsSetupCode, mdjsSetupConfig],
      [copyMdjsStories, { mode: import.meta.env.MODE }],
      // cleanRocketMarkdown,
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

    build: {
      rollupOptions: {
        input: publicMdFilesObj,
        // output: {
        //   dir: 'kist',
        //   format: 'esm',
        //   entryFileNames: '[name]/__mdjs-stories.js',
        // },
        plugins: [
          {
            name: 'q-d',
            resolveId: importee => {
              console.log('importee: ', importee);
              return null;
            },
            load(id) {
              console.log('id: ', id);

              if (id === 'virtual-module') {
                // the source code for "virtual-module"
                return 'export default "This is virtual!"';
              }
              return null; // other ids should be handled as usually
            },
          },
        ],
      },
    },
  },
});
