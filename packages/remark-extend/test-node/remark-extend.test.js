const { expect } = require('chai');

const unified = require('unified');
const markdown = require('remark-parse');
const mdStringify = require('remark-html');

const { remarkExtend } = require('../src/remarkExtend.js');

async function expectThrowsAsync(method, errorMessage) {
  let error = null;
  try {
    await method();
  } catch (err) {
    error = err;
  }
  expect(error).to.be.an('Error', 'No error was thrown');
  if (errorMessage) {
    expect(error.message).to.equal(errorMessage);
  }
}

describe('remarkExtend', () => {
  it('does no modifications if no action is found', async () => {
    const input = [
      '### Red',
      '',
      'red is the fire',
      '',
      '#### More Red',
      '',
      'the sun can get red',
    ].join('\n');
    const extendMd = '';
    const output = [
      '<h3>Red</h3>',
      '<p>red is the fire</p>',
      '<h4>More Red</h4>',
      '<p>the sun can get red</p>',
      '',
    ].join('\n');

    const parser = unified()
      //
      .use(markdown)
      .use(remarkExtend, { extendMd })
      .use(mdStringify);
    const result = await parser.process(input);

    expect(result.contents).to.equal(output);
  });

  it('can do replacements on the full file', async () => {
    const input = [
      '### Red', // <-- start
      '',
      'red is the fire',
      '',
      '#### More Red',
      '',
      'the sun can get red',
    ].join('\n');
    const extendMd = [
      //
      "```js ::replaceFrom(':root')",
      'module.exports.replaceSection = (node) => {',
      '  if (node.value) {',
      "     node.value = node.value.replace(/red/g, 'green').replace(/Red/g, 'Green');",
      '  }',
      '  return node;',
      '};',
      '```',
    ].join('\n');
    const output = [
      '<h3>Green</h3>', // <-- start
      '<p>green is the fire</p>',
      '<h4>More Green</h4>',
      '<p>the sun can get green</p>',
      '',
    ].join('\n');

    const parser = unified()
      //
      .use(markdown)
      .use(remarkExtend, { extendMd })
      .use(mdStringify);
    const result = await parser.process(input);

    expect(result.contents).to.equal(output);
  });

  it('does replacements in order of extendMd', async () => {
    const input = [
      '### Red', // <-- start
      '',
      'red is the fire',
    ].join('\n');
    const extendMd = [
      "```js ::replaceFrom(':root')",
      'module.exports.replaceSection = (node) => {',
      '  if (node.value) {',
      "     node.value = node.value.replace(/red/g, 'green').replace(/Red/g, 'Green');",
      '  }',
      '  return node;',
      '};',
      '```',
      "```js ::replaceFrom(':root')",
      'module.exports.replaceSection = (node) => {',
      '  if (node.value) {',
      "     node.value = node.value.replace(/green/g, 'yellow').replace(/Green/g, 'Yellow');",
      '  }',
      '  return node;',
      '};',
      '```',
    ].join('\n');
    const output = [
      '<h3>Yellow</h3>', // <-- start
      '<p>yellow is the fire</p>',
      '',
    ].join('\n');

    const parser = unified()
      //
      .use(markdown)
      .use(remarkExtend, { extendMd })
      .use(mdStringify);
    const result = await parser.process(input);

    expect(result.contents).to.equal(output);
  });

  it('can replace from a starting point downward', async () => {
    const input = [
      '### Red',
      '',
      'red is the fire',
      '',
      '### More Red', // <-- start
      '',
      'the sun can get red',
    ].join('\n');
    const extendMd = [
      "```js ::replaceFrom('heading[depth=3]:has([value=More Red])')",
      'module.exports.replaceSection = (node) => {',
      '  if (node.value) {',
      "     node.value = node.value.replace(/red/g, 'green').replace(/Red/g, 'Green');",
      '  }',
      '  return node;',
      '};',
      '```',
    ].join('\n');
    const output = [
      '<h3>Red</h3>',
      '<p>red is the fire</p>',
      '<h3>More Green</h3>', // <-- start
      '<p>the sun can get green</p>',
      '',
    ].join('\n');

    const parser = unified()
      //
      .use(markdown)
      .use(remarkExtend, { extendMd })
      .use(mdStringify);
    const result = await parser.process(input);

    expect(result.contents).to.equal(output);
  });

  it('throws if a start selector is not found', async () => {
    const input = [
      //
      '### Red',
    ].join('\n');
    const extendMd = [
      "```js ::replaceFrom('heading:has([value=More Red])')",
      'module.exports.replaceSection = (node) => {}',
      '```',
    ].join('\n');

    const parser = unified()
      //
      .use(markdown)
      .use(remarkExtend, { extendMd })
      .use(mdStringify);

    await expectThrowsAsync(
      () => parser.process(input),
      'The start selector "heading:has([value=More Red])" could not find a matching node.',
    );
  });

  it('can replace within a range (start point included, endpoint not)', async () => {
    const input = [
      '### Red',
      '',
      'red is the fire',
      '',
      'red is the cross', // <-- start
      '',
      'red is the flag',
      '',
      '#### More Red',
      '',
      'the sun can get red',
    ].join('\n');
    const extendMd = [
      "```js ::replaceBetween('heading:has([value=Red]) ~ paragraph:nth-of-type(2)', 'heading:has([value=More Red])')",
      'module.exports.replaceSection = (node) => {',
      '  if (node.value) {',
      "     node.value = node.value.replace(/red/g, 'green').replace(/Red/g, 'Green');",
      '  }',
      '  return node',
      '};',
    ].join('\n');
    const output = [
      '<h3>Red</h3>',
      '<p>red is the fire</p>',
      '<p>green is the cross</p>', // <-- start
      '<p>green is the flag</p>',
      '<h4>More Red</h4>', // <-- end
      '<p>the sun can get red</p>',
      '',
    ].join('\n');
    const parser = unified()
      //
      .use(markdown)
      .use(remarkExtend, { extendMd })
      .use(mdStringify);
    const result = await parser.process(input);

    expect(result.contents).to.equal(output);
  });

  it('throws if a end selector is not found', async () => {
    const input = [
      //
      '### Red',
    ].join('\n');
    const extendMd = [
      "```js ::replaceBetween('heading:has([value=Red])', 'heading:has([value=Red2])')",
      'module.exports.replaceSection = (node) => {}',
      '```',
    ].join('\n');

    const parser = unified()
      .use(markdown)
      .use(remarkExtend, { extendMd })
      .use(mdStringify);

    await expectThrowsAsync(
      () => parser.process(input),
      'The end selector "heading:has([value=Red2])" could not find a matching node.',
    );
  });

  it('replaces a single node if replacing between the start and end of the same node', async () => {
    const input = [
      //
      '### Red',
      'red',
      '### Red',
    ].join('\n');
    const extendMd = [
      "```js ::replaceBetween('heading:has([value=Red]) > text', 'heading:has([value=Red]) > text')",
      'module.exports.replaceSection = (node) => {',
      '  if (node.value) {',
      "     node.value = node.value.replace(/red/g, 'green').replace(/Red/g, 'Green');",
      '  }',
      '  return node',
      '};',
      '```',
    ].join('\n');
    const output = [
      '<h3>Green</h3>', // text node "Green" == start == end
      '<p>red</p>',
      '<h3>Red</h3>',
      '',
    ].join('\n');

    const parser = unified()
      //
      .use(markdown)
      .use(remarkExtend, { extendMd })
      .use(mdStringify);

    const result = await parser.process(input);

    expect(result.contents).to.equal(output);
  });

  it('can put something after via "::addMdAfter"', async () => {
    const input = [
      //
      '### Red',
      '',
      'red is the fire',
    ].join('\n');
    const extendMd = [
      '```',
      "::addMdAfter('heading:has([value=Red])')",
      '```',
      '',
      'the ocean is blue',
    ].join('\n');
    const output = [
      //
      '<h3>Red</h3>',
      '<p>the ocean is blue</p>',
      '<p>red is the fire</p>',
      '',
    ].join('\n');
    const parser = unified()
      //
      .use(markdown)
      .use(remarkExtend, { extendMd })
      .use(mdStringify);
    const result = await parser.process(input);

    expect(result.contents).to.equal(output);
  });

  it('adding stops at the next ::[action]', async () => {
    const input = [
      //
      '### Red',
      '',
      'red is the fire',
      '',
      '### More Red',
    ].join('\n');
    const extendMd = [
      '```',
      "::addMdAfter('heading:has([value=Red])')",
      '```',
      '',
      'the ocean is blue',
      '',
      '```',
      "::addMdAfter('heading:has([value=More Red])')",
      '```',
      '',
      'as in the sun is the ultimate red',
      '',
      "```js ::replaceBetween('heading:has([value=Red])', 'heading:has([value=Red])')",
      'module.exports.replaceSection = (node) => {}',
      '```',
      'content not part of an add so it gets ignored',
    ].join('\n');
    const output = [
      //
      '<h3>Red</h3>',
      '<p>the ocean is blue</p>',
      '<p>red is the fire</p>',
      '<h3>More Red</h3>',
      '<p>as in the sun is the ultimate red</p>',
      '',
    ].join('\n');
    const parser = unified()
      //
      .use(markdown)
      .use(remarkExtend, { extendMd })
      .use(mdStringify);
    const result = await parser.process(input);

    expect(result.contents).to.equal(output);
  });

  it('will throw if trying to immediate run replacements of added content', async () => {
    const input = [
      //
      '### Red',
      '',
    ].join('\n');
    const extendMd = [
      '```',
      "::addMdAfter('heading:has([value=Red])')",
      '```',
      '',
      '## Blue',
      '',
      "```js ::replaceFrom('heading:has([value=Blue])')",
      'module.exports.replaceSection = (node) => {',
      '  if (node.value) {',
      "     node.value = node.value.replace(/Blue/g, 'Yellow');",
      '  }',
      '  return node',
      '}',
      '```',
    ].join('\n');
    const parser = unified()
      //
      .use(markdown)
      .use(remarkExtend, { extendMd })
      .use(mdStringify);

    await expectThrowsAsync(
      () => parser.process(input),
      'The start selector "heading:has([value=Blue])" could not find a matching node.',
    );
  });

  it(`can put something right at the top via "::addMdAfter(':root')"`, async () => {
    const input = [
      //
      '### Red',
    ].join('\n');
    const extendMd = [
      //
      '```',
      "::addMdAfter(':root')",
      '```',
      '',
      '# New Headline',
    ].join('\n');
    const output = [
      //
      '<h1>New Headline</h1>',
      '<h3>Red</h3>',
      '',
    ].join('\n');
    const parser = unified()
      //
      .use(markdown)
      .use(remarkExtend, { extendMd })
      .use(mdStringify);
    const result = await parser.process(input);

    expect(result.contents).to.equal(output);
  });

  it(`can put something right at the bottom via "::addMdAfter(':scope:last-child')"`, async () => {
    const input = [
      //
      '### Red',
      '',
      'red is the fire',
    ].join('\n');
    const extendMd = [
      //
      '```',
      "::addMdAfter(':scope:last-child')",
      '```',
      '',
      'extra text',
    ].join('\n');
    const output = [
      //
      '<h3>Red</h3>',
      '<p>red is the fire</p>',
      '<p>extra text</p>',
      '',
    ].join('\n');
    const parser = unified()
      //
      .use(markdown)
      .use(remarkExtend, { extendMd })
      .use(mdStringify);
    const result = await parser.process(input);

    expect(result.contents).to.equal(output);
  });

  it('can put something before via "::addMdBefore"', async () => {
    const input = [
      //
      '### Red',
      '',
      'red is the fire',
      '',
      '### Blue',
    ].join('\n');
    const extendMd = [
      '```',
      "::addMdBefore('heading:has([value=Blue])')",
      '```',
      '',
      'the ocean is blue',
    ].join('\n');
    const output = [
      //
      '<h3>Red</h3>',
      '<p>red is the fire</p>',
      '<p>the ocean is blue</p>',
      '<h3>Blue</h3>',
      '',
    ].join('\n');
    const parser = unified()
      //
      .use(markdown)
      .use(remarkExtend, { extendMd })
      .use(mdStringify);
    const result = await parser.process(input);

    expect(result.contents).to.equal(output);
  });

  it(`can put something at the end of a "section" via "::addMdBefore('heading:has([value=Red]) ~ heading[depth=3]')"`, async () => {
    const input = [
      //
      '### Red',
      '',
      'red is the fire',
      '',
      '### Blue',
    ].join('\n');
    const extendMd = [
      '```',
      "::addMdBefore('heading:has([value=Red]) ~ heading[depth=3]')",
      '```',
      '',
      'the sun will be red',
    ].join('\n');
    const output = [
      //
      '<h3>Red</h3>',
      '<p>red is the fire</p>',
      '<p>the sun will be red</p>',
      '<h3>Blue</h3>',
      '',
    ].join('\n');
    const parser = unified()
      //
      .use(markdown)
      .use(remarkExtend, { extendMd })
      .use(mdStringify);
    const result = await parser.process(input);

    expect(result.contents).to.equal(output);
  });

  it(`can put something at the top of the file via '::addMdBefore(":root")'`, async () => {
    const input = [
      //
      '### Red',
      '',
      'red is the fire',
      '',
      '### Blue',
    ].join('\n');
    const extendMd = [
      //
      '```',
      "::addMdBefore(':root')",
      '```',
      '',
      'the ocean is blue',
    ].join('\n');
    const output = [
      //
      '<p>the ocean is blue</p>',
      '<h3>Red</h3>',
      '<p>red is the fire</p>',
      '<h3>Blue</h3>',
      '',
    ].join('\n');
    const parser = unified()
      //
      .use(markdown)
      .use(remarkExtend, { extendMd })
      .use(mdStringify);
    const result = await parser.process(input);

    expect(result.contents).to.equal(output);
  });

  it('can remove from a starting point downward', async () => {
    const input = [
      '### Red',
      '',
      'red is the fire',
      '',
      '### More Red', // <-- start
      '',
      'the sun can get red',
    ].join('\n');
    const extendMd = [
      //
      '```',
      "::removeFrom('heading:has([value=More Red])')",
      '```',
    ].join('\n');
    const output = [
      //
      '<h3>Red</h3>',
      '<p>red is the fire</p>',
      '',
    ].join('\n');

    const parser = unified()
      //
      .use(markdown)
      .use(remarkExtend, { extendMd })
      .use(mdStringify);
    const result = await parser.process(input);

    expect(result.contents).to.equal(output);
  });

  it('can remove a range (start point included, endpoint not)', async () => {
    const input = [
      '### Red', // <-- start
      '',
      'red is the fire',
      '',
      '### More Red', // <-- end
      '',
      'the sun can get red',
    ].join('\n');
    const extendMd = [
      '```',
      `::removeBetween('heading:has([value=Red])', 'heading:has([value=Red]) ~ heading[depth=3]')`,
      '```',
    ].join('\n');
    const output = [
      '<h3>More Red</h3>', // <-- end
      '<p>the sun can get red</p>',
      '',
    ].join('\n');
    const parser = unified()
      //
      .use(markdown)
      .use(remarkExtend, { extendMd })
      .use(mdStringify);
    const result = await parser.process(input);

    expect(result.contents).to.equal(output);
  });
});
