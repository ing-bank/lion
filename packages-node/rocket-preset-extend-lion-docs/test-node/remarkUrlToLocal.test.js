/* eslint-disable import/no-extraneous-dependencies */
import path from 'path';
import { fileURLToPath } from 'url';
import chai from 'chai';
import unified from 'unified';
import markdown from 'remark-parse';
import mdStringify from 'remark-html';

import { remarkUrlToLocal } from '../src/remarkUrlToLocal.js';

const { expect } = chai;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * @param {string} input
 * @returns
 */
async function execute(input) {
  const rootDir = path.join(__dirname, '../../../');

  const parser = unified()
    //
    .use(markdown)
    .use(remarkUrlToLocal, {
      gitHubUrl: 'https://github.com/ing-bank/lion/',
      rootDir,
      page: {
        inputPath: path.join(rootDir, 'docs/components/inputs/form/overview/index.md'),
      },
    })
    .use(mdStringify);
  const result = await parser.process(input);
  return result.contents.toString().trim();
}

describe('remarkUrlToLocal', () => {
  it('convert urls to local', async () => {
    const result = await execute(
      'Since it extends from [fieldset](https://github.com/ing-bank/lion/blob/6f2b6f940a0875091f1d940f45f0cd32dffce9ac/docs/components/inputs/fieldset/overview.md)',
    );

    expect(result).to.equal(
      '<p>Since it extends from <a href="../../fieldset/overview.md">fieldset</a></p>',
    );
  });

  it('does not touch issue urls', async () => {
    const result = await execute('see [explanation](https://github.com/ing-bank/lion/issues/591)');

    expect(result).to.equal(
      '<p>see <a href="https://github.com/ing-bank/lion/issues/591">explanation</a></p>',
    );
  });

  it('does not touch urls to the repo', async () => {
    const result = await execute('see [explanation](https://github.com/ing-bank/lion/)');

    expect(result).to.equal(
      '<p>see <a href="https://github.com/ing-bank/lion/">explanation</a></p>',
    );
  });

  it('works with images', async () => {
    const result = await execute(
      `see ![Standard flow](https://github.com/ing-bank/lion/blob/6f2b6f940a0875091f1d940f45f0cd32dffce9ac/docs/docs/systems/form/assets/FormatMixinDiagram-1.svg 'Standard flow')`,
    );

    expect(result).to.equal(
      '<p>see <img src="../../../../docs/systems/form/assets/FormatMixinDiagram-1.svg" alt="Standard flow" title="Standard flow"></p>',
    );
  });
});
