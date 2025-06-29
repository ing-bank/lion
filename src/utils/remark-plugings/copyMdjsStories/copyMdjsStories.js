import path from 'path';
import fs from 'fs';
import { init, parse } from 'es-module-lexer';
import { createRequire } from 'module';

const nodeModulesText = '/node_modules';
const require = createRequire(import.meta.url);

/**
 * @param {string} source
 * @param {string} mode
 * @param {string} inputPath
 */
async function processImports(source, mode, inputPath) {
  if (mode !== 'development') return source;

  // return source;
  if (!source || !source.includes('import')) {
    return source;
  }

  let newSource = '';
  let lastPos = 0;
  await init;
  const [imports] = parse(source);
  for (const importObj of imports) {
    newSource += source.substring(lastPos, importObj.s);

    const importSrc = source.substring(importObj.s, importObj.e);
    try {
      if (importSrc.startsWith('.')) {
        newSource +=
          nodeModulesText +
          require
            .resolve(importSrc, { paths: [path.dirname(inputPath)] })
            .split(nodeModulesText)[1];
      } else if (importSrc.startsWith('/')) {
        newSource += importSrc;
      } else {
        const isDynamicImport = importSrc.startsWith("'");
        if (isDynamicImport) {
          newSource += `'${nodeModulesText}${
            require.resolve(importSrc.replace(/'/g, '')).split(nodeModulesText)[1]
          }'`;
        } else {
          newSource += nodeModulesText + require.resolve(importSrc).split(nodeModulesText)[1];
        }
      }
    } catch (error) {
      console.error(`Error resolving import: ${importSrc}`, error);
      newSource += importSrc; // Fallback to original import if resolution fails
    }

    lastPos = importObj.e;
  }

  newSource += source.substring(lastPos, source.length);

  return newSource;
}

export function copyMdjsStories({ mode } = {}) {
  /**
   * @param {Node} tree
   * @param {VFileOptions} file
   */
  async function transformer(tree, file) {
    const { setupJsCode } = file.data;
    if (!setupJsCode) {
      return tree;
    }
    // console.log(file);
    const currentMarkdownFile = file.history[0];
    const pwd = file.cwd;
    const mdJsStoriesUrlPath = '/mdjs-stories';
    const mdJsStoriesDir = `${pwd}/public${mdJsStoriesUrlPath}`;
    const mdJsStoriesFileName = '__mdjs-stories.js';
    let parsedPath = '';

    if (currentMarkdownFile) {
      const separator = currentMarkdownFile.includes('components/')
        ? 'components/'
        : 'fundamentals/';
      const rightSideParsedPath = currentMarkdownFile.split(separator)[1];
      // console.log(currentMarkdownFile, leftSideParsedPath);
      [parsedPath] = rightSideParsedPath.split('.md');
    }

    const parsedSetupJsCode = await processImports(setupJsCode, mode, currentMarkdownFile);
    // console.log({ parsedSetupJsCode });
    const newFolder = `${mdJsStoriesDir}/${parsedPath}`;
    const newName = path.join(newFolder, mdJsStoriesFileName);
    await fs.promises.mkdir(newFolder, { recursive: true });
    await fs.promises.writeFile(newName, parsedSetupJsCode, 'utf8');

    // const mdjsStoriesJsNode = {
    //   type: 'html',
    //   value: `<script type="module" mdjs-setup>${parsedSetupJsCode}</script>`,
    // };
    const mdjsStoriesJsNode = {
      type: 'html',
      value: `<script type="module" src="${mdJsStoriesUrlPath}/${parsedPath}/${mdJsStoriesFileName}" mdjs-setup></script>`,
    };
    // astro does not see this update?
    tree.children.push(mdjsStoriesJsNode);

    return tree;
  }

  return transformer;
}

// module.exports = {
//   copyMdjsStories,
// };
