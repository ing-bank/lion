import path from 'path';
import fs from 'fs';
import { init, parse } from 'es-module-lexer';
import { createRequire } from 'module';

const NODE_MODULES_PATH = '/node_modules';
const NODE_MODULES_LION_DOCS = '_lion_docs';
const require = createRequire(import.meta.url);
const DEBUG = 1;
const DEBUG_COMPONENTS = ['extend-a-native-input', 'combobox/overview'];
const SHOW_MODULE_NOT_FOUND = false;
const ROOT_DIR = path.basename(path.resolve(import.meta.dirname, '..', '..', '..'));

const resolveLionImport = moduleResolvedPath => {
  const lionDirectorPackages = path.join(ROOT_DIR, 'packages');
  if (moduleResolvedPath.includes(lionDirectorPackages)) {
    // it can be from a local package, e.g. @lion/ui
    return `/@lion${moduleResolvedPath.split(`/${lionDirectorPackages}`)[1]}`;
  }

  const lionDirectoryDocs = path.join(ROOT_DIR, 'docs');
  if (moduleResolvedPath.includes(lionDirectoryDocs)) {
    // it can be from a local package, e.g. @lion/ui
    return `/${NODE_MODULES_LION_DOCS}${moduleResolvedPath.split(`/${lionDirectoryDocs}`)[1]}`;
  }

  return moduleResolvedPath.split(NODE_MODULES_PATH)[1];
};

const getLog = input =>
  DEBUG && DEBUG_COMPONENTS.some(DEBUG_COMPONENT => input.includes(DEBUG_COMPONENT))
    ? console.log.bind(console)
    : () => {};

/**
 * @param {string} source
 * @param {string} inputPath
 */
async function processImports(source, inputPath) {
  if (!source || !source.includes('import')) {
    return source;
  }

  // for the debug purposes
  const log = getLog(inputPath);
  log('*** input path', inputPath);
  let newSource = '';
  let lastPos = 0;
  await init;
  const [imports] = parse(source);
  for (const importObj of imports) {
    newSource += source.substring(lastPos, importObj.s);

    const importSrc = source.substring(importObj.s, importObj.e);
    try {
      log('*** path to resolve', importSrc);
      let resolvedImportFullPath = importSrc;
      if (importSrc.startsWith('.')) {
        const resolvedPath = require.resolve(importSrc, { paths: [path.dirname(inputPath)] });
        const resolvedLionImport = resolveLionImport(resolvedPath);
        const relativePath = `.${NODE_MODULES_PATH}${resolvedLionImport}`;
        if (!fs.existsSync(relativePath)) {
          log('does not exist, going to create', path.dirname(relativePath));
          // to be able to serve the files from the docs folder, we need to move them to /node_modules
          try {
            await fs.promises.mkdir(path.dirname(relativePath), { recursive: true });
            await fs.promises.symlink(resolvedPath, relativePath);
          } catch (err) {
            // symlink can already be there, do nothing
          }
        }

        resolvedImportFullPath = `${NODE_MODULES_PATH}${resolvedLionImport}`;

        log('relative', { relativePath, resolvedPath, resolvedImportFullPath });
      } else if (importSrc.startsWith('/')) {
        log('absolute', resolvedImportFullPath);
      } else {
        const isDynamicImport = importSrc.startsWith("'");
        if (isDynamicImport) {
          const resolvedPath = require.resolve(importSrc.replace(/'/g, ''), {
            paths: [path.dirname(inputPath)],
          });

          resolvedImportFullPath = `'${NODE_MODULES_PATH}${resolveLionImport(resolvedPath)}'`;
          log('dynamic', resolvedImportFullPath);
        } else {
          // const resolvedPath = require.resolve(importSrc);
          //
          // resolvedImportFullPath = `${NODE_MODULES_PATH}${resolveLionImport(resolvedPath)}`;
          // log('regular', resolvedImportFullPath);
        }
      }

      newSource += resolvedImportFullPath;
    } catch (error) {
      console.error(error);
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

export function remarkProcessDemos() {
  /**
   * @param {Node} tree
   * @param {VFileOptions} file
   */
  async function transformer(tree, file) {
    // throw new Error('no transformer');
    const log = getLog(file.history[0]);

    log(tree, file.data.frontmatter);
    const { setupJsCode } = file.data;
    if (!setupJsCode) {
      return tree;
    }

    const currentMarkdownFile = file.history[0];
    const separator = ['components', 'fundamentals', 'guides'].find(sep =>
      currentMarkdownFile.includes(sep),
    );

    const pwd = file.cwd;
    const PATHS = {
      MDJS_STORIES: path.join(pwd, 'src', 'pages', separator, '_demos'),
    };

    let parsedPath = '';

    if (currentMarkdownFile) {
      const rightSideParsedPath = currentMarkdownFile.split(`${separator}${path.sep}`)[1];
      parsedPath = rightSideParsedPath.split('.md')[0].replaceAll(path.sep, '_');
    }

    // in theory, processing imports is not needed anymore, but it also does symlinks
    // for the relative files and these symlinks we do need
    const parsedSetupJsCode = await processImports(setupJsCode, currentMarkdownFile);
    await fs.promises.mkdir(PATHS.MDJS_STORIES, { recursive: true });
    await fs.promises.writeFile(
      path.join(PATHS.MDJS_STORIES, `${parsedPath}.js`),
      parsedSetupJsCode,
      'utf8',
    );

    if (!file.data.astro.frontmatter) {
      file.data.astro.frontmatter = {};
    }

    file.data.astro.frontmatter.mdjsStoriesPath = parsedPath;

    return tree;
  }

  return transformer;
}
