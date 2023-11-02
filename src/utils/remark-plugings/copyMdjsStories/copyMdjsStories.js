const path = require('path');
const fs = require('fs');
// eslint-disable-next-line import/no-extraneous-dependencies
const { init, parse } = require('es-module-lexer');

let visit;
(async () => {
  // eslint-disable-next-line import/no-extraneous-dependencies
  const result = await import('unist-util-visit');
  visit = result.visit;
})();

const nodeModulesText = '/node_modules';
const mdJsStoriesFileName = '__mdjs-stories.js';

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
        // noop
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
    let pathToMdDirectoryInPublic = '';
    let currentMarkdownFile = '';

    /**
     * @param {UnistNode} _node
     */
    async function nodeCodeVisitor(_node, index, parent) {
      if (parent.type === 'heading' && parent.depth === 1) {
        const parts = pathToMdDirectoryInPublic.split('/');
        const mdFileDirectoryName = parts.pop();
        const componentDirectoryInPublic = parts.join('/');
        const commonMdjsStoriesFileName = `${componentDirectoryInPublic}/${mdJsStoriesFileName}`;
        let commonMdjsStoriesContent = '';
        try {
          commonMdjsStoriesContent = fs.readFileSync(commonMdjsStoriesFileName).toString();
        } catch (ex) {
          // noop. File is not yet created for the component
        }

        const exportCmd = `export * from './${mdFileDirectoryName}/${mdJsStoriesFileName}' \n`;

        if (commonMdjsStoriesContent.indexOf(exportCmd) === -1) {
          await fs.promises.writeFile(
            commonMdjsStoriesFileName,
            commonMdjsStoriesContent + exportCmd,
            'utf8',
          );
        }
      }
    }

    const { setupJsCode } = file.data;
    if (!setupJsCode) {
      return tree;
    }

    // eslint-disable-next-line prefer-destructuring
    currentMarkdownFile = file.history[0];
    const { cwd } = file;
    const mdJsStoriesUrlPath = '/mdjs-stories';
    const mdJsStoriesDir = `${cwd}/public${mdJsStoriesUrlPath}`;
    let parsedPath = '';

    if (currentMarkdownFile) {
      const leftSideParsedPath = currentMarkdownFile.split('src/content/')[1];
      // eslint-disable-next-line prefer-destructuring
      parsedPath = leftSideParsedPath.split('.md')[0];
    }

    const parsedSetupJsCode = await processImports(setupJsCode);
    pathToMdDirectoryInPublic = `${mdJsStoriesDir}/${parsedPath}`;
    const newName = path.join(pathToMdDirectoryInPublic, mdJsStoriesFileName);
    await fs.promises.mkdir(pathToMdDirectoryInPublic, { recursive: true });
    await fs.promises.writeFile(newName, parsedSetupJsCode, 'utf8');

    // unifiedjs expects node changes to be made on the given node...
    await init;
    visit(tree, 'text', nodeCodeVisitor);

    return tree;
  }

  return transformer;
}

module.exports = {
  copyMdjsStories,
};
