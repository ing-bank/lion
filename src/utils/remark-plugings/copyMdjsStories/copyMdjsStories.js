const path = require('path');
const fs = require('fs');
const { init, parse } = require('es-module-lexer');

const nodeModulesText = '/node_modules';

function copyMdjsStories() {
  /**
   * @param {Node} tree
   * @param {VFileOptions} file
   */
  async function transformer(tree, file) {    
    console.log('99911 resolve: ', require.resolve("@lion/ui/define/lion-button.js"));
    const setupJsCode = file.data.setupJsCode;
    if (!setupJsCode) {
        return tree;
    }

    const currentMarkdownFile = file.history[0];
    const pwd = file.cwd;
    const publicDir = `${pwd}/public/mdjs-stories`
    let parsedPath = '';

    if (currentMarkdownFile) {
      const leftSideParsedPath = currentMarkdownFile.split('src/content/')[1];
      parsedPath = leftSideParsedPath.split('.md')[0];
    }

    const parsedSetupJsCode = await processImports(setupJsCode);
    const newFolder = `${publicDir}/${parsedPath}`;
    const newName = path.join(newFolder, '__mdjs-stories.js');    
    await fs.promises.mkdir(newFolder, { recursive: true });
    await fs.promises.writeFile(newName, parsedSetupJsCode, 'utf8');

    console.log('tree: ', JSON.stringify(tree, null, '\t'));

    // TODO write back to md file <script type="module" src="${scriptUrl}__mdjs-stories.js" mdjs-setup></script>

    return tree;
  }

  return transformer;
}

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

      if (importSrc.startsWith('@mdjs') || importSrc.startsWith('@lion')) {
        newSource += nodeModulesText + require.resolve(importSrc).split(nodeModulesText)[1];
      } else if (importSrc === `'@mdjs/mdjs-preview/define'`) {
        newSource += `'${nodeModulesText}/@mdjs/mdjs-preview/src/define/define.js'`;
      } else if (importSrc === `'@mdjs/mdjs-story/define'`) {
        newSource += `'${nodeModulesText}/@mdjs/mdjs-story/src/define.js'`;
      } 
      // TODO Write a parser for relative paths like "import './lion-calendar.js';"
      else {
        newSource += importSrc;
      } 

      lastPos = importObj.e;
    }
    newSource += source.substring(lastPos, source.length);
    return newSource;
  }
  
  return source;
}

module.exports = {
  copyMdjsStories,
};

