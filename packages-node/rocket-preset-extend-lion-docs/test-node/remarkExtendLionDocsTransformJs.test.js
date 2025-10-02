/* eslint-disable import/no-extraneous-dependencies */
import path from 'path';
import { fileURLToPath } from 'url';
import { expect } from 'chai';
// we need to have "defaultMetaPlugins" because node can install
// packages as sub node_modules
// in this case, even if the version is the same (which is not in our case)
// it won't be able to detect plugin
// accessing the plugins by index is dangerous
// @mdjs/core needs to export all the package it uses as plugins
import { mdjsProcess, defaultMetaPlugins } from '@mdjs/core';
import { addPlugin } from 'plugins-manager';

import { remarkExtendLionDocsTransformJs } from '../src/remarkExtendLionDocsTransformJs.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * @param {string} input
 */
async function execute(input) {
  const rootDir = path.join(__dirname, '../../../');

  const extendDocsConfig = {
    rootPath: rootDir,
    __filePath: 'fake',
    changes: [
      {
        name: '@lion/accordion - LionAccordion',
        variable: {
          from: 'LionAccordion',
          to: 'IngAccordion',
          paths: [
            {
              from: '@lion/accordion',
              to: 'ing-web/accordion',
            },
          ],
        },
      },
      {
        name: '@lion/accordion/define',
        tag: {
          from: 'lion-accordion',
          to: 'ing-accordion',
          paths: [
            {
              from: '@lion/accordion/define',
              to: '#accordion/define',
            },
          ],
        },
      },
    ],
  };

  const result = await mdjsProcess(input, {
    setupUnifiedPlugins: [
      addPlugin(
        remarkExtendLionDocsTransformJs,
        // those types will need to be better specified
        // @ts-ignore
        { extendDocsConfig },
        {
          location: defaultMetaPlugins[0].plugin,
        },
      ),
    ],
  });

  return result;
}

describe('remarkExtendLionDocsTransformJs', () => {
  it('processes all instance of code and code snippets', async () => {
    const result = await execute(
      [
        '',
        '```js script',
        "import { html } from '@lion/core';",
        "import '@lion/accordion/define';",
        '```',
        '',
        '```js preview-story',
        'export const main = () => html`',
        '  <lion-accordion></lion-accordion>',
        '`;',
        '```',
      ].join('\n'),
    );

    expect(result.html).to.include('ing-accordion');
    expect(result.html).to.equal(
      [
        '<mdjs-preview mdjs-story-name="main">\n' +
          '\n' +
          '\n' +
          '\n' +
          '<pre class="language-js"><code class="language-js code-highlight"><span class="code-line"><span class="token keyword module">export</span> <span class="token keyword">const</span> <span class="token function-variable function">main</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> html<span class="token template-string"><span class="token template-punctuation string">`</span><span class="token html language-html">\n' +
          '</span></span></span><span class="code-line"><span class="token template-string"><span class="token html language-html">  <span class="token tag"><span class="token tag"><span class="token punctuation">&#x3C;</span>ing-accordion</span><span class="token punctuation">></span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&#x3C;/</span>ing-accordion</span><span class="token punctuation">></span></span>\n' +
          '</span></span></span><span class="code-line"><span class="token template-string"><span class="token html language-html"></span><span class="token template-punctuation string">`</span></span><span class="token punctuation">;</span>\n' +
          '</span></code></pre>\n' +
          '\n' +
          '\n' +
          '\n' +
          '</mdjs-preview>',
      ].join('\n'),
    );

    expect(result.jsCode).to.include('ing-accordion');
    expect(result.jsCode).to.include('#accordion/define');
    expect(result.jsCode).to.equal(
      [
        '/** script code **/',
        'import { html } from "@lion/core";',
        'import "#accordion/define";',
        '/** stories code **/',
        'export const main = () => html`',
        '  <ing-accordion></ing-accordion>',
        '`;',
        '/** stories setup code **/',
        'const rootNode = document;',
        "const stories = [{ key: 'main', story: main }];",
        'let needsMdjsElements = false;',
        'for (const story of stories) {',
        // eslint-disable-next-line no-template-curly-in-string
        '  const storyEl = rootNode.querySelector(`[mdjs-story-name="${story.key}"]`);',
        '  if (storyEl) {',
        '    storyEl.story = story.story;',
        '    storyEl.key = story.key;',
        '    needsMdjsElements = true;',
        '    Object.assign(storyEl, {});',
        '  }',
        '};',
        'if (needsMdjsElements) {',
        "  if (!customElements.get('mdjs-preview')) { import('@mdjs/mdjs-preview/define'); }",
        "  if (!customElements.get('mdjs-story')) { import('@mdjs/mdjs-story/define'); }",
        '}',
      ].join('\n'),
    );
  });

  it('processes html stories', async () => {
    const result = await execute(
      ['', '```html preview-story', '<lion-accordion></lion-accordion>', '```'].join('\n'),
    );

    expect(result.html).to.include('ing-accordion');
  });

  it('keeps import assertions in tact', async () => {
    const result = await execute(
      [
        '',
        '```js script',
        "import style from '@lion/core/style' assert { type: 'css' };",
        "import { LionInput } from '@lion/core';",
        '```',
        '',
      ].join('\n'),
    );

    expect(result.jsCode).to.equal(
      [
        'import style from "@lion/core/style" assert { type: \'css\' };',
        'import { LionInput } from "@lion/core";',
      ].join('\n'),
    );
  });
});
