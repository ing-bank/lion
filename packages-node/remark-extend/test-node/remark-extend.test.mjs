import path from 'path';
import url from 'url';
import { expect } from 'chai';
import unified from 'unified';
import markdown from 'remark-parse';
import mdStringify from 'remark-html';
import gfm from 'remark-gfm';

import { remarkExtend } from '../src/remarkExtend.js';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

/**
 * @param {function} method
 * @param {object} options
 * @param {string} [options.errorMatch]
 * @param {string} [options.errorMessage]
 */
async function expectThrowsAsync(method, { errorMatch, errorMessage } = {}) {
  let error = null;
  try {
    await method();
  } catch (err) {
    error = err;
  }

  expect(error).to.be.an('Error', 'No error was thrown');
  if (errorMatch) {
    expect(error.message).to.match(errorMatch);
  }
  if (errorMessage) {
    expect(error.message).to.equal(errorMessage);
  }
}

/**
 *
 * @param {string} input
 * @param {{shouldStringify?: boolean; globalReplaceFunction?: Function;}} param1
 */
async function execute(input, { shouldStringify = true, globalReplaceFunction } = {}) {
  const parser = unified()
    //
    .use(markdown)
    .use(gfm)
    .use(remarkExtend, {
      rootDir: __dirname,
      page: { inputPath: 'test-file.md' },
      globalReplaceFunction,
    });

  if (shouldStringify) {
    parser.use(mdStringify);
    const result = await parser.process(input);
    return result.contents;
  }

  let tree;
  parser
    .use(() => _tree => {
      tree = _tree;
    })
    // @ts-expect-error
    .use(function plugin() {
      this.Compiler = () => '';
    });

  await parser.process(input);
  return tree;
}

describe('remarkExtend', () => {
  it('does no modifications if no action is found', async () => {
    const result = await execute(
      ['### Red', 'red is the fire', '#### More Red', 'the sun can get red'].join('\n'),
    );

    expect(result).to.equal(
      [
        '<h3>Red</h3>',
        '<p>red is the fire</p>',
        '<h4>More Red</h4>',
        '<p>the sun can get red</p>',
        '',
      ].join('\n'),
    );
  });

  it('can import another file', async () => {
    const result = await execute(
      [
        //
        '### Red',
        "```js ::import('./fixtures/import-me.md')",
        '```',
      ].join('\n'),
    );

    expect(result).to.equal(['<h3>Red</h3>', '<h1>import me headline</h1>', ''].join('\n'));
  });

  it('will rewrite image urls/paths but not links', async () => {
    const result = await execute(
      [
        //
        '### Static Headline',
        "```js ::import('./fixtures/import-with-image.md')",
        '```',
      ].join('\n'),
    );

    expect(result.replace('\r', '')).to.equal(
      [
        '<h3>Static Headline</h3>',
        '<h1>import me headline</h1>',
        '<p><img src="./my.svg" alt="my image">',
        '<a href="./import-me.md">link to</a></p>',
        '',
      ].join('\n'),
    );
  });

  it('can import another file from a start point', async () => {
    const result = await execute(
      [
        //
        '# Static Headline',
        "```js ::import('./fixtures/three-sections-red.md', 'heading:has([value=More Red])')",
        '```',
      ].join('\n'),
    );

    expect(result).to.equal(
      [
        '<h1>Static Headline</h1>',
        '<h2>More Red</h2>',
        '<p>the sun can get red</p>',
        '<h2>Additional Red</h2>',
        '<p>the red sea</p>',
        '',
      ].join('\n'),
    );
  });

  it('can import another file from a start to an end point', async () => {
    const result = await execute(
      [
        //
        '# Red',
        "```js ::import('./fixtures/three-sections-red.md', 'heading:has([value=More Red])', 'heading:has([value=More Red]) ~ heading[depth=2]')",
        '```',
      ].join('\n'),
    );

    expect(result).to.equal(
      ['<h1>Red</h1>', '<h2>More Red</h2>', '<p>the sun can get red</p>', ''].join('\n'),
    );
  });

  it('can do replacements on imports', async () => {
    const result = await execute(
      [
        //
        '# Red',
        "```js ::import('./fixtures/three-sections-red.md', 'heading:has([value=More Red])', 'heading:has([value=More Red]) ~ heading[depth=2]')",
        'module.exports.replaceSection = (node) => {',
        '  if (node.value) {',
        "     node.value = node.value.replace(/red/g, 'green').replace(/Red/g, 'Green');",
        '  }',
        '  return node;',
        '};',
        '```',
      ].join('\n'),
    );

    expect(result).to.equal(
      ['<h1>Red</h1>', '<h2>More Green</h2>', '<p>the sun can get green</p>', ''].join('\n'),
    );
  });

  it('can do global replacements, that run before local replacements', async () => {
    const result = await execute(
      [
        //
        '# Red',
        "```js ::import('./fixtures/three-sections-red.md', 'heading:has([value=More Red])', 'heading:has([value=More Red]) ~ heading[depth=2]')",
        'module.exports.replaceSection = (node) => {',
        '  if (node.value) {',
        "     node.value = node.value.replace(/green/g, 'blue').replace(/Red/g, 'Blue');",
        '  }',
        '  return node;',
        '};',
        '```',
      ].join('\n'),
      {
        globalReplaceFunction: node => {
          if (node.value) {
            // eslint-disable-next-line no-param-reassign
            node.value = node.value.replace(/red/g, 'green');
          }
          return node;
        },
      },
    );

    expect(result).to.equal(
      ['<h1>Red</h1>', '<h2>More Blue</h2>', '<p>the sun can get blue</p>', ''].join('\n'),
    );
  });

  it('throws if an import file does not exist', async () => {
    await expectThrowsAsync(() => execute("```js ::import('./fixtures/not-available.md')\n```"), {
      errorMatch:
        /The import "\.\/fixtures\/not-available.md" in "test-file.md" does not exist\. Resolved to ".*"\.$/,
    });
  });

  it('throws if an start selector can not be found', async () => {
    const input =
      "```js ::import('./fixtures/three-sections-red.md', 'heading:has([value=Does not exit])')\n```";
    await expectThrowsAsync(() => execute(input), {
      errorMatch:
        /The start selector "heading:has\(\[value=Does not exit\]\)", imported in ".*", could not find a matching node in ".*"\.$/,
    });
  });

  it('throws if an end selector can not be found', async () => {
    const input =
      "```js ::import('./fixtures/three-sections-red.md', 'heading:has([value=More Red])', 'heading:has([value=Does not exit])')\n```";
    await expectThrowsAsync(() => execute(input), {
      errorMatch:
        /The end selector "heading:has\(\[value=Does not exit\]\)", imported in ".*", could not find a matching node in ".*"\./,
    });
  });

  it('can import a block (from start headline to next headline same level)', async () => {
    const result = await execute(
      [
        //
        '### Static Headline',
        "```js ::importBlock('./fixtures/three-sections-red.md', '## More Red')",
        '```',
      ].join('\n'),
    );

    expect(result).to.equal(
      [
        //
        '<h3>Static Headline</h3>',
        '<h2>More Red</h2>',
        '<p>the sun can get red</p>',
        '',
      ].join('\n'),
    );
  });

  it('can import the last block (from start headline to end of file)', async () => {
    const result = await execute(
      [
        //
        '### Static Headline',
        "```js ::importBlock('./fixtures/three-sections-red.md', '## Additional Red')",
        '```',
      ].join('\n'),
    );

    expect(result).to.equal(
      [
        //
        '<h3>Static Headline</h3>',
        '<h2>Additional Red</h2>',
        '<p>the red sea</p>',
        '',
      ].join('\n'),
    );
  });

  it('can import a block content (from start headline (excluding) to next headline same level)', async () => {
    const result = await execute(
      [
        //
        '### Static Headline',
        "```js ::importBlockContent('./fixtures/three-sections-red.md', '## More Red')",
        '```',
      ].join('\n'),
    );

    expect(result).to.equal(
      [
        //
        '<h3>Static Headline</h3>',
        '<p>the sun can get red</p>',
        '',
      ].join('\n'),
    );
  });

  it('can import a small block (from start headline to next headline of any level)', async () => {
    const result = await execute(
      [
        //
        '### Static Headline',
        "```js ::importSmallBlock('./fixtures/three-sections-red.md', '# Red')",
        '```',
      ].join('\n'),
    );

    expect(result).to.equal(
      [
        //
        '<h3>Static Headline</h3>',
        '<h1>Red</h1>',
        '<p>red is the fire</p>',
        '',
      ].join('\n'),
    );
  });

  it('can import a small block content (from start headline (excluding) to next headline of any level)', async () => {
    const result = await execute(
      [
        //
        '### Static Headline',
        "```js ::importSmallBlockContent('./fixtures/three-sections-red.md', '# Red')",
        '```',
      ].join('\n'),
    );

    expect(result).to.equal(
      [
        //
        '<h3>Static Headline</h3>',
        '<p>red is the fire</p>',
        '',
      ].join('\n'),
    );
  });

  it('resolves imports via node resolution', async () => {
    const result = await execute(
      [
        //
        '### Static Headline',
        "```js ::importBlock('remark-extend/docs/test.md', '## Test')",
        '```',
      ].join('\n'),
    );

    expect(result).to.equal(
      [
        '<h3>Static Headline</h3>',
        '<h2>Test</h2>',
        '<p><img src="./some-image.svg" alt="some image" title="with alt"></p>',
        '',
      ].join('\n'),
    );
  });

  it('throws if importBlock is used not with headlines', async () => {
    const input =
      "```js ::importBlock('./fixtures/three-sections-red.md', 'heading:has([value=More Red])')\n```";
    await expectThrowsAsync(() => execute(input), {
      errorMessage:
        '::importBlock only works for headlines like "## My Headline" but "heading:has([value=More Red])" was given',
    });
  });

  it('can import multiple files', async () => {
    const result = await execute(
      [
        //
        '### Static Headline',
        "```js ::importBlock('./fixtures/three-sections-red.md', '## More Red')",
        '```',
        '### Another Static Headline',
        "```js ::import('./fixtures/import-me.md')",
        '```',
      ].join('\n'),
    );

    expect(result).to.equal(
      [
        //
        '<h3>Static Headline</h3>',
        '<h2>More Red</h2>',
        '<p>the sun can get red</p>',
        '<h3>Another Static Headline</h3>',
        '<h1>import me headline</h1>',
        '',
      ].join('\n'),
    );
  });

  it('can import files with a table', async () => {
    const result = await execute(
      [
        //
        '### Static Headline',
        "```js ::importBlock('./fixtures/import-table.md', '## Currencies')",
        '```',
      ].join('\n'),
    );

    expect(result).to.equal(
      [
        //
        '<h3>Static Headline</h3>',
        '<h2>Currencies</h2>',
        '<table>',
        '<thead>',
        '<tr>',
        '<th>Sign</th>',
        '<th>Name</th>',
        '</tr>',
        '</thead>',
        '<tbody>',
        '<tr>',
        '<td>$</td>',
        '<td>Dollar</td>',
        '</tr>',
        '<tr>',
        '<td>€</td>',
        '<td>Euro</td>',
        '</tr>',
        '</tbody>',
        '</table>',
        '',
      ].join('\n'),
    );
  });

  it('supports files with frontmatter', async () => {
    const result = await execute(
      [
        //
        '### Static Headline',
        "```js ::importBlock('./fixtures/three-sections-red-with-frontmatter.md', '## More Red')",
        '```',
      ].join('\n'),
    );

    expect(result).to.equal(
      [
        //
        '<h3>Static Headline</h3>',
        '<h2>More Red</h2>',
        '<p>the sun can get red</p>',
        '',
      ].join('\n'),
    );
  });
});
