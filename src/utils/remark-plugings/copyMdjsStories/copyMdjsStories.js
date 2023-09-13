const path = require('path');
const fs = require('fs');

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
    
    const newFolder = `${publicDir}/${parsedPath}`;
    const newName = path.join(newFolder, '__mdjs-stories.js');    
    await fs.promises.mkdir(newFolder, { recursive: true });
    await fs.promises.writeFile(newName, setupJsCode, 'utf8');

    return tree;
  }

  return transformer;
}

module.exports = {
  copyMdjsStories,
};

