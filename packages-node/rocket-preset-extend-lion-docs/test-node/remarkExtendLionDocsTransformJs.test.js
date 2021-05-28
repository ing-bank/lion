/* eslint-disable import/no-extraneous-dependencies */
import path from 'path';
import { fileURLToPath } from 'url';
import chai from 'chai';
import { mdjsProcess } from '@mdjs/core';
import { addPlugin } from 'plugins-manager';

import { remarkExtendLionDocsTransformJs } from '../src/remarkExtendLionDocsTransformJs.js';

const { expect } = chai;
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

  // @ts-ignore
  const result = await mdjsProcess(input, {
    setupUnifiedPlugins: [
      addPlugin({
        name: 'remark-extend-lion-docs-transform-js',
        plugin: remarkExtendLionDocsTransformJs,
        location: 'markdown',
        options: { extendDocsConfig },
      }),
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
        '<mdjs-preview mdjs-story-name="main">',
        '',
        '',
        '',
        '<pre class="language-js"><code class="language-js"><span class="token keyword module">export</span> <span class="token keyword">const</span> <span class="token function-variable function">main</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token arrow operator">=></span> html<span class="token template-string"><span class="token template-punctuation string">`</span><span class="token html language-html">',
        '  <span class="token tag"><span class="token tag"><span class="token punctuation">&#x3C;</span>ing-accordion</span><span class="token punctuation">></span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&#x3C;/</span>ing-accordion</span><span class="token punctuation">></span></span>',
        '</span><span class="token template-punctuation string">`</span></span><span class="token punctuation">;</span>',
        '</code></pre>',
        '',
        '',
        '',
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
});
