const path = require('path');
const fs = require('fs');
// eslint-disable-next-line import/no-extraneous-dependencies
const { init, parse } = require('es-module-lexer');

const nodeModulesText = '/node_modules';

/**
 * @param {string} source
 * @param {string} inputPath
 */
async function processImports(source) {
  if (source !== '' && source.includes('import')) {
    let newSource = '';
    let lastPos = 0;
    await init;
    const [imports] = parse(source);
    for (const importObj of imports) {
      newSource += source.substring(lastPos, importObj.s);
      const importSrc = source.substring(importObj.s, importObj.e);

      if (importSrc.startsWith('.')) {
        // eslint-disable-next-line no-console
        console.error(`!!! Update md file so that it doesn't contain relative imports`);
      } else if (importSrc === `'@mdjs/mdjs-preview/define'`) {
        newSource += `'${nodeModulesText}/@mdjs/mdjs-preview/src/define/define.js'`;
      } else if (importSrc === `'@mdjs/mdjs-story/define'`) {
        newSource += `'${nodeModulesText}/@mdjs/mdjs-story/src/define.js'`;
      } else if (importSrc.startsWith('/')) {
        newSource += importSrc;
      } else {
        newSource += nodeModulesText + require.resolve(importSrc).split(nodeModulesText)[1];
      }

      lastPos = importObj.e;
    }
    newSource += source.substring(lastPos, source.length);
    return newSource;
  }

  return source;
}

function copyMdjsStories() {
  /**
   * @param {Node} tree
   * @param {VFileOptions} file
   */
  async function transformer(tree, file) {
    const { setupJsCode } = file.data;
    if (!setupJsCode) {
      return tree;
    }

    const currentMarkdownFile = file.history[0];
    const pwd = file.cwd;
    const mdJsStoriesUrlPath = '/mdjs-stories';
    const mdJsStoriesDir = `${pwd}/public${mdJsStoriesUrlPath}`;
    const mdJsStoriesFileName = '__mdjs-stories.js';
    let parsedPath = '';

    if (currentMarkdownFile) {
      const leftSideParsedPath = currentMarkdownFile.split('src/content/')[1];
      // eslint-disable-next-line prefer-destructuring
      parsedPath = leftSideParsedPath.split('.md')[0];
    }

    const parsedSetupJsCode = await processImports(setupJsCode);
    const newFolder = `${mdJsStoriesDir}/${parsedPath}`;
    const newName = path.join(newFolder, mdJsStoriesFileName);
    await fs.promises.mkdir(newFolder, { recursive: true });
    await fs.promises.writeFile(newName, parsedSetupJsCode, 'utf8');

    const mdjsStoriesJsNode = {
      type: 'html',
      value: `<script type="module" src="${mdJsStoriesUrlPath}/${parsedPath}/${mdJsStoriesFileName}" mdjs-setup></script>`,
    };
    tree.children.push(mdjsStoriesJsNode);

    return tree;
  }

  return transformer;
}

module.exports = {
  copyMdjsStories,
};
