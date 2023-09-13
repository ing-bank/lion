import * as path from 'path';
import * as fs from 'fs';

function copyMdjsStories() {

  /**
   * @param {Node} tree
   * @param {VFileOptions} file
   */
  async function transformer(tree, file) {    
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

export default copyMdjsStories;
