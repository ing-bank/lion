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

  it('carries along js import blocks that precede the imported section, with rewritten relative paths', async () => {
    const result = await execute(
      [
        //
        '### Static Headline',
        "```js ::importBlock('./fixtures/three-sections-red-with-import.md', '## More Red')",
        '```',
      ].join('\n'),
      { shouldStringify: false },
    );

    const codeNode = result.children.find(node => node.type === 'code' && node.lang === 'js');
    expect(codeNode.value).to.equal("import { color } from './assets/color.js';");
  });

  it('dedupes the js script imports of a page that imported several sections of the same file', async () => {
    const result = await execute(
      [
        //
        "```js ::importBlock('./fixtures/tabs-with-script.md', '## More Tabs')",
        '```',
        '',
        "```js ::importBlock('./fixtures/tabs-with-script.md', '## Additional Tabs')",
        '```',
      ].join('\n'),
      { shouldStringify: false },
    );

    const scriptNodes = result.children.filter(
      node => node.type === 'code' && node.lang === 'js' && node.meta === 'script',
    );
    expect(scriptNodes.length).to.equal(1);
    expect(scriptNodes[0].value).to.equal(
      ["import { LitElement, html } from '@mdjs/mdjs-preview';", "import './assets/ref.js';"].join(
        '\n',
      ),
    );
  });

  it('dedupes only the statements the page already has, and keeps the rest of the block', async () => {
    const result = await execute(
      [
        //
        "```js ::importBlock('./fixtures/tabs-with-script.md', '## More Tabs')",
        '```',
        '',
        "```js ::importBlock('./fixtures/tabs-blue-with-script.md', '## More Tabs Blue')",
        '```',
      ].join('\n'),
      { shouldStringify: false },
    );

    const scriptNodes = result.children.filter(
      node => node.type === 'code' && node.lang === 'js' && node.meta === 'script',
    );
    expect(scriptNodes.length).to.equal(2);
    expect(scriptNodes[1].value).to.equal("import { a11yLocalized } from './assets/a11y.js';");
  });

  it('renames the later binding when a different specifier declares the same name', async () => {
    const result = await execute(
      [
        //
        "```js ::importBlock('./fixtures/tabs-with-script.md', '## More Tabs')",
        '```',
        '',
        "```js ::importBlock('./fixtures/tabs-lit-with-script.md', '## More Tabs Lit')",
        '```',
      ].join('\n'),
      { shouldStringify: false },
    );

    const scriptNodes = result.children.filter(
      node => node.type === 'code' && node.lang === 'js' && node.meta === 'script',
    );
    expect(scriptNodes.length).to.equal(2);
    expect(scriptNodes[0].value).to.equal(
      ["import { LitElement, html } from '@mdjs/mdjs-preview';", "import './assets/ref.js';"].join(
        '\n',
      ),
    );
    expect(scriptNodes[1].value).to.equal("import { html as html1 } from 'lit';");
  });

  it('rewrites the occurrences of the renamed binding in the block it renamed', async () => {
    const result = await execute(
      [
        //
        "```js ::importBlock('./fixtures/tabs-with-script.md', '## More Tabs')",
        '```',
        '',
        "```js ::importBlock('./fixtures/tabs-lit-usage-with-script.md', '## More Tabs Lit Usage')",
        '```',
      ].join('\n'),
      { shouldStringify: false },
    );

    const scriptNodes = result.children.filter(
      node => node.type === 'code' && node.lang === 'js' && node.meta === 'script',
    );
    expect(scriptNodes[1].value).to.equal(
      [
        "import { html as html1 } from 'lit';",
        '',
        '// html from lit',
        'export const litMain = () => html1`<p>html from lit</p>`;',
      ].join('\n'),
    );
  });

  it('keeps the plain name on the page itself, so other blocks keep resolving', async () => {
    const result = await execute(
      [
        // the page's own setup comes first, the imported section after it
        '```js script',
        "import { html } from '@mdjs/mdjs-preview';",
        '```',
        '',
        "```js ::importBlock('./fixtures/tabs-lit-with-script.md', '## More Tabs Lit')",
        '```',
      ].join('\n'),
      { shouldStringify: false },
    );

    const scriptNodes = result.children.filter(
      node => node.type === 'code' && node.lang === 'js' && node.meta === 'script',
    );
    expect(scriptNodes.length).to.equal(2);
    expect(scriptNodes[0].value).to.equal("import { html } from '@mdjs/mdjs-preview';");
    expect(scriptNodes[1].value).to.equal("import { html as html1 } from 'lit';");
  });

  it('renames the imported block when the page declares the name after it', async () => {
    const result = await execute(
      [
        //
        "```js ::importBlock('./fixtures/tabs-lit-with-script.md', '## More Tabs Lit')",
        '```',
        '',
        '```js script',
        "import { html } from '@mdjs/mdjs-preview';",
        '```',
      ].join('\n'),
      { shouldStringify: false },
    );

    const scriptNodes = result.children.filter(
      node => node.type === 'code' && node.lang === 'js' && node.meta === 'script',
    );
    expect(scriptNodes.length).to.equal(2);
    expect(scriptNodes[0].value).to.equal("import { html as html1 } from 'lit';");
    expect(scriptNodes[1].value).to.equal("import { html } from '@mdjs/mdjs-preview';");
  });

  it('renames the later of two blocks the page itself declares, without failing', async () => {
    const result = await execute(
      [
        '```js script',
        "import { html } from '@mdjs/mdjs-preview';",
        '```',
        '',
        '```js script',
        "import { html } from 'lit';",
        '```',
      ].join('\n'),
      { shouldStringify: false },
    );

    const scriptNodes = result.children.filter(
      node => node.type === 'code' && node.lang === 'js' && node.meta === 'script',
    );
    expect(scriptNodes.length).to.equal(2);
    expect(scriptNodes[0].value).to.equal("import { html } from '@mdjs/mdjs-preview';");
    expect(scriptNodes[1].value).to.equal("import { html as html1 } from 'lit';");
  });

  it('handles a named import spread over many lines as one statement', async () => {
    const result = await execute(
      [
        //
        "```js ::importBlock('./fixtures/tabs-with-script.md', '## More Tabs')",
        '```',
        '',
        "```js ::importBlock('./fixtures/tabs-long-with-script.md', '## More Tabs Long')",
        '```',
      ].join('\n'),
      { shouldStringify: false },
    );

    const scriptNodes = result.children.filter(
      node => node.type === 'code' && node.lang === 'js' && node.meta === 'script',
    );
    expect(scriptNodes[1].value).to.equal(
      [
        "import { html as html1, nothing, everything, something, nothingElse, everythingElse, one, two, three, four, five, six, seven } from 'lit';",
      ].join('\n'),
    );
  });

  it('keeps a statement whole when the page does not declare its bindings yet', async () => {
    const result = await execute(
      [
        //
        "```js ::importBlock('./fixtures/tabs-with-script.md', '## More Tabs')",
        '```',
        '',
        "```js ::importBlock('./fixtures/tabs-green-with-script.md', '## More Tabs Green')",
        '```',
      ].join('\n'),
      { shouldStringify: false },
    );

    const scriptNodes = result.children.filter(
      node => node.type === 'code' && node.lang === 'js' && node.meta === 'script',
    );
    expect(scriptNodes.length).to.equal(2);
    expect(scriptNodes[0].value).to.equal(
      ["import { LitElement, html } from '@mdjs/mdjs-preview';", "import './assets/ref.js';"].join(
        '\n',
      ),
    );
    expect(scriptNodes[1].value).to.equal(
      ["import { html as html1, render } from 'lit';", "import './assets/green.js';"].join('\n'),
    );
  });

  it('keeps the import of a plain js block, so its preview still shows it', async () => {
    const result = await execute(
      [
        //
        "```js ::importBlock('./fixtures/three-sections-red-with-import.md', '## More Red')",
        '```',
        '',
        "```js ::importBlock('./fixtures/three-sections-red-with-import.md', '## Additional Red')",
        '```',
      ].join('\n'),
      { shouldStringify: false },
    );

    const sampleNodes = result.children.filter(
      node => node.type === 'code' && node.lang === 'js' && !node.meta,
    );
    expect(sampleNodes.length).to.equal(2);
    expect(sampleNodes[1].value).to.equal("import { color } from './assets/color.js';");
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
