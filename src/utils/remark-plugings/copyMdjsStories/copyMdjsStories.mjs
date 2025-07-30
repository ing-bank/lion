import path from 'path';
import fs from 'fs';
import { init, parse } from 'es-module-lexer';
import { createRequire } from 'module';

const NODE_MODULES_PATH = '/node_modules';
const NODE_MODULES_LION_DOCS = '_lion_docs';
const require = createRequire(import.meta.url);
const DEBUG = 1;
const DEBUG_COMPONENT = 'accordion';
const SHOW_MODULE_NOT_FOUND = false;

const resolveLionImport = moduleResolvedPath => {
  const lionDirectorPackages = 'lion/packages';
  if (moduleResolvedPath.includes(lionDirectorPackages)) {
    // it can be from a local package, e.g. @lion/ui
    return `/@lion${moduleResolvedPath.split(`/${lionDirectorPackages}`)[1]}`;
  }

  const lionDirectoryDocs = 'lion/docs';
  if (moduleResolvedPath.includes(lionDirectoryDocs)) {
    // it can be from a local package, e.g. @lion/ui
    return `/${NODE_MODULES_LION_DOCS}${moduleResolvedPath.split(`/${lionDirectoryDocs}`)[1]}`;
  }

  return moduleResolvedPath.split(NODE_MODULES_PATH)[1];
};

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

  // for the debug purposes
  const log = DEBUG && inputPath.includes(DEBUG_COMPONENT) ? console.log.bind(console) : () => {};

  let newSource = '';
  let lastPos = 0;
  await init;
  const [imports] = parse(source);
  for (const importObj of imports) {
    newSource += source.substring(lastPos, importObj.s);

    const importSrc = source.substring(importObj.s, importObj.e);
    try {
      log('path to resolve', importSrc);
      let resolvedImportFullPath = importSrc;
      if (importSrc.startsWith('.')) {
        const resolvedPath = require.resolve(importSrc, { paths: [path.dirname(inputPath)] });
        const resolvedLionImport = resolveLionImport(resolvedPath);
        const relativePath = `.${NODE_MODULES_PATH}${resolvedLionImport}`;
        if (!fs.existsSync(relativePath)) {
          log('does not exist, going to create', path.dirname(relativePath));
          // to be able to serve the files from the docs folder, we need to move them to /node_modules
          await fs.promises.mkdir(path.dirname(relativePath), { recursive: true });
          await fs.promises.symlink(resolvedPath, relativePath);
        }

        resolvedImportFullPath = `${NODE_MODULES_PATH}${resolvedLionImport}`;

        log('relative', { relativePath, resolvedPath, resolvedImportFullPath });
      } else if (importSrc.startsWith('/')) {
        log('absolute', resolvedImportFullPath);
      } else {
        const isDynamicImport = importSrc.startsWith("'");
        if (isDynamicImport) {
          const resolvedPath = require.resolve(importSrc.replace(/'/g, ''));

          resolvedImportFullPath = `'${NODE_MODULES_PATH}${resolveLionImport(resolvedPath)}'`;
          log('dynamic', resolvedImportFullPath);
        } else {
          const resolvedPath = require.resolve(importSrc);

          resolvedImportFullPath = `${NODE_MODULES_PATH}${resolveLionImport(resolvedPath)}`;
          log('regular', resolvedImportFullPath);
        }
      }

      newSource += resolvedImportFullPath;
    } catch (error) {
      if (SHOW_MODULE_NOT_FOUND && error.code === 'MODULE_NOT_FOUND') {
        console.error(`Error resolving import: ${importSrc}`, error);
      }

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
    const log =
      DEBUG && file.history[0].includes(DEBUG_COMPONENT) ? console.log.bind(console) : () => {};
    log(tree, file.data.frontmatter);
    const { setupJsCode } = file.data;
    if (!setupJsCode) {
      return tree;
    }

    const currentMarkdownFile = file.history[0];
    const pwd = file.cwd;
    const mdJsStoriesUrlPath = '/mdjs-stories';
    const mdJsStoriesDir = `${pwd}/node_modules/${mdJsStoriesUrlPath}`;
    const mdJsStoriesFileName = '__mdjs-stories';
    let parsedPath = '';

    if (currentMarkdownFile) {
      const separator = ['components/', 'fundamentals/', '/guides'].find(sep =>
        currentMarkdownFile.includes(sep),
      );
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
    // const mdjsStoriesJsNode = {
    //   type: 'html',
    //   value: `<script type="module" src="/node_modules/${mdJsStoriesUrlPath}/${parsedPath}/${mdJsStoriesFileName}" mdjs-setup></script>`,
    // };
    // astro does not see this update?
    // tree.children.push(mdjsStoriesJsNode);
    if (!file.data.astro.frontmatter) {
      file.data.astro.frontmatter = {};
    }
    //file.data.astro.frontmatter.mdjsStoriesPath = `${mdJsStoriesUrlPath}/${parsedPath}/${mdJsStoriesFileName}`;
    file.data.astro.frontmatter.mdjsStoriesPath = `${parsedPath.replaceAll('/', '-')}${mdJsStoriesFileName}`;

    return tree;
  }

  return transformer;
}

// module.exports = {
//   copyMdjsStories,
// };
