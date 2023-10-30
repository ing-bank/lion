import path from 'path';
import fs from 'fs';
import { init, parse } from 'es-module-lexer';

const nodeModulesText = '/node_modules';

export function copyMdjsStories({ mode } = {}) {
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
    const mdJsStoriesUrlPath = '/mdjs-stories';
    const mdJsStoriesDir = `${pwd}/public${mdJsStoriesUrlPath}`;
    const mdJsStoriesFileName = '__mdjs-stories.js';
    let parsedPath = '';

    if (currentMarkdownFile) {
      const leftSideParsedPath = currentMarkdownFile.split('src/content/')[1];
      parsedPath = leftSideParsedPath.split('.md')[0];
    }

    const parsedSetupJsCode = await processImports(setupJsCode, mode);
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

/**
 * @param {string} source
 * @param {string} inputPath
 */
async function processImports(source, mode) {
  if (mode !== 'developmen') return source;

  // return source;
  if (source !== '' && source.includes('import')) {
    let newSource = '';
    let lastPos = 0;
    await init;
    const [imports] = parse(source);
    for (const importObj of imports) {
      newSource += source.substring(lastPos, importObj.s);
      const importSrc = source.substring(importObj.s, importObj.e);
      // strip quotes

      if (importSrc.startsWith('.')) {
        // TODO: maybe we can resolve those relative to the current file?
        console.error(`!!! Update md file so that it doesn't contain relative imports`);
        // } else if (importSrc === `'@mdjs/mdjs-preview/define'`) {
        //   newSource += `'${nodeModulesText}/@mdjs/mdjs-preview/src/define/define.js'`;
        // } else if (importSrc === `'@mdjs/mdjs-story/define'`) {
        //   newSource += `'${nodeModulesText}/@mdjs/mdjs-story/src/define.js'`;
      } else if (importSrc.startsWith('/')) {
        console.log('importSrc: ', importSrc);
        newSource += importSrc;
      } else {
        const isDynamicImport = importSrc.startsWith("'");
        if (isDynamicImport) {
          newSource +=
            "'" +
            nodeModulesText +
            require.resolve(importSrc.replace(/'/g, '')).split(nodeModulesText)[1] +
            "'";
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

// module.exports = {
//   copyMdjsStories,
// };
