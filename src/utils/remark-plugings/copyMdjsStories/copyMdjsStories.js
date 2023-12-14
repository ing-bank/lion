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
const mdJsStoriesFileNameWithoutExtension = '__mdjs-stories';
const mdJsStoriesFileName = `${mdJsStoriesFileNameWithoutExtension}.js`;
const isDistBuild = process.env.PROD === 'true';

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
      const isDynamicImport = importObj.d > -1;

      if (
        importSrc.startsWith('.') ||
        importSrc.startsWith('/') ||
        isDynamicImport ||
        importSrc.startsWith('import.')
      ) {
        if (importSrc === `'@mdjs/mdjs-preview/define'`) {
          newSource += `'${nodeModulesText}/@mdjs/mdjs-preview/src/define/define.js'`;
        } else if (importSrc === `'@mdjs/mdjs-story/define'`) {
          newSource += `'${nodeModulesText}/@mdjs/mdjs-story/src/define.js'`;
        } else {
          newSource += importSrc;
        }
      } else {
        const resolvedPath = require.resolve(importSrc);
        const packagesPath = '/packages/';
        if (resolvedPath.includes(packagesPath)) {
          newSource += packagesPath + resolvedPath.split(packagesPath)[1];
        } else {
          newSource += nodeModulesText + require.resolve(importSrc).split(nodeModulesText)[1];
        }
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
    let currentMarkdownFileMdJsStoryName = '';

    /**
     * @param {UnistNode} _node
     */
    async function nodeCodeVisitor(_node, index, parent) {
      if (
        parent.type === 'heading' &&
        parent.depth === 1 &&
        currentMarkdownFile.includes('/components')
      ) {
        const commonMdjsStoriesFileName = `${pathToMdDirectoryInPublic}/${mdJsStoriesFileName}`;
        let commonMdjsStoriesContent = '';
        try {
          commonMdjsStoriesContent = fs.readFileSync(commonMdjsStoriesFileName).toString();
        } catch (ex) {
          // noop. File is not yet created for the component
        }

        const exportCmd = `import('./${currentMarkdownFileMdJsStoryName}');\n`;
        if (commonMdjsStoriesContent.indexOf(exportCmd) === -1) {
          fs.writeFileSync(commonMdjsStoriesFileName, commonMdjsStoriesContent + exportCmd, 'utf8');
        }
      }
    }

    let { setupJsCode } = file.data;
    if (!setupJsCode) {
      return tree;
    }

    // eslint-disable-next-line prefer-destructuring
    currentMarkdownFile = file.history[0];
    const { cwd } = file;
    const publicDir = `${cwd}/public`;
    let parsedPath = '';

    if (currentMarkdownFile) {
      const leftSideParsedPath = currentMarkdownFile.split('src/content/')[1];
      // eslint-disable-next-line prefer-destructuring
      parsedPath = path.dirname(leftSideParsedPath);
    }

    let parsedSetupJsCode;
    // This is copied from @mdjs/core/src/mdjsSetupCode.js
    const initialImprorts = `
import '@mdjs/mdjs-preview/define';
import '@mdjs/mdjs-story/define'; \n`;
    setupJsCode = initialImprorts + setupJsCode;
    if (isDistBuild) {
      parsedSetupJsCode += await setupJsCode;
    } else {
      parsedSetupJsCode += await processImports(setupJsCode);
    }
    pathToMdDirectoryInPublic = `${publicDir}/${parsedPath}`;
    currentMarkdownFileMdJsStoryName = `${mdJsStoriesFileNameWithoutExtension}--${
      path.basename(currentMarkdownFile).split('.md')[0]
    }.js`;
    const newName = path.join(pathToMdDirectoryInPublic, currentMarkdownFileMdJsStoryName);
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
