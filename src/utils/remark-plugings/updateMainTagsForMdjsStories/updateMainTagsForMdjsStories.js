// eslint-disable-next-line import/no-extraneous-dependencies
const { init, parse } = require('es-module-lexer');
const path = require('path');

let visit;
(async () => {
  // eslint-disable-next-line import/no-extraneous-dependencies
  const result = await import('unist-util-visit');
  visit = result.visit;
})();

/**
 * @param {string} code
 * @param {{type: StoryTypes}} options
 * @returns {Story}
 */
function extractStoryData(code, { type = 'js' } = { type: 'js' }) {
  const parsed = parse(code);
  const key = parsed[1][0];
  const name = key;
  return { key, name, code, type };
}

function updateMainTagsForMdjsStories() {
  let parsedPath = '';

  /**
   * @param {UnistNode} _node
   */
  const nodeCodeVisitor = _node => {
    const node = /** @type {UnistNode & {[key: string]: unknown}} */ (_node);
    if (node.lang === 'js' && node.meta === 'preview-story' && typeof node.value === 'string') {
      const storyData = extractStoryData(node.value);
      const mainTagName = storyData.name;
      let mdFileName = path.basename(parsedPath);
      mdFileName = mdFileName.replaceAll('-', '_');
      node.value = node.value.replace(mainTagName, `${mainTagName}__${mdFileName}`);
    }
  };

  /**
   * @param {Node} tree
   * @param {VFileOptions} file
   */
  async function transformer(tree, file) {
    const currentMarkdownFile = file.history[0];

    if (currentMarkdownFile) {
      const leftSideParsedPath = currentMarkdownFile.split('src/content/')[1];
      // eslint-disable-next-line prefer-destructuring
      parsedPath = leftSideParsedPath.split('.md')[0];
    }

    // unifiedjs expects node changes to be made on the given node...
    await init;
    // @ts-ignore
    visit(tree, 'code', nodeCodeVisitor);

    return tree;
  }

  return transformer;
}

module.exports = {
  updateMainTagsForMdjsStories,
};
