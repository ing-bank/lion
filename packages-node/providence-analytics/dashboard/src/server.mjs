import fs from 'fs';
import pathLib, { dirname } from 'path';
import { fileURLToPath } from 'url';
import { createConfig, startServer } from 'es-dev-server';
import { ReportService } from '../../src/program/core/ReportService.js';
import { getProvidenceConf } from '../../src/program/utils/get-providence-conf.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * Gets all results found in cache folder with all results
 * @param {{ supportedAnalyzers: `match-${string}`[], resultsPath: string }} options
 */
async function getCachedProvidenceResults({
  supportedAnalyzers = ['match-imports', 'match-subclasses'],
  resultsPath = ReportService.outputPath,
} = {}) {
  /**
   * Paths of every individual cachde result
   * @type {string[]}
   */
  let outputFilePaths;
  try {
    outputFilePaths = fs.readdirSync(resultsPath);
  } catch (_) {
    throw new Error(`Please make sure providence results can be found in ${resultsPath}`);
  }

  const resultFiles = {};
  let searchTargetDeps;
  outputFilePaths.forEach(fileName => {
    const content = JSON.parse(fs.readFileSync(pathLib.join(resultsPath, fileName), 'utf-8'));
    if (fileName === 'search-target-deps-file.json') {
      searchTargetDeps = content;
    } else {
      const analyzerName = fileName.split('_-_')[0];
      if (!supportedAnalyzers.includes(analyzerName)) {
        return;
      }
      if (!resultFiles[analyzerName]) {
        resultFiles[analyzerName] = [];
      }
      resultFiles[analyzerName].push({ fileName, content });
    }
  });

  return { searchTargetDeps, resultFiles };
}

/**
 * @param {{ providenceConf: object; earchTargetDeps: object; resultFiles: string[]; }}
 */
function createMiddleWares({ providenceConf, providenceConfRaw, searchTargetDeps, resultFiles }) {
  /**
   * @param {string} projectPath
   * @returns {object|null}
   */
  function getPackageJson(projectPath) {
    try {
      const file = pathLib.resolve(projectPath, 'package.json');
      return JSON.parse(fs.readFileSync(file, 'utf8'));
    } catch (_) {
      return null;
    }
  }

  /**
   * @param {object[]} collections
   * @returns {{[keu as string]: }}
   */
  function transformToProjectNames(collections) {
    const res = {};
    // eslint-disable-next-line array-callback-return
    Object.entries(collections).map(([key, val]) => {
      res[key] = val.map(c => {
        const pkg = getPackageJson(c);
        return pkg && pkg.name;
      });
    });
    return res;
  }

  const pathFromServerRootToHere = `/${pathLib.relative(process.cwd(), __dirname)}`;

  return [
    // eslint-disable-next-line consistent-return
    async (ctx, next) => {
      // TODO: Quick and dirty solution: refactor in a nicer way
      if (ctx.url.startsWith('/app')) {
        ctx.url = `${pathFromServerRootToHere}/${ctx.url}`;
        return next();
      }
      if (ctx.url === '/') {
        ctx.url = `${pathFromServerRootToHere}/index.html`;
        return next();
      }
      if (ctx.url === '/results') {
        ctx.body = resultFiles;
      } else if (ctx.url === '/menu-data') {
        // Gathers all data that are relevant to create a configuration menu
        // at the top of the dashboard:
        // - referenceCollections as defined in providence.conf.js
        // - searchTargetCollections (aka programs) as defined in providence.conf.js
        // - searchTargetDeps as found in search-target-deps-file.json
        // Also do some processing on the presentation of a project, so that it can be easily
        // outputted in frontend
        let searchTargetCollections;
        if (providenceConf.searchTargetCollections) {
          searchTargetCollections = transformToProjectNames(providenceConf.searchTargetCollections);
        } else {
          searchTargetCollections = Object.keys(searchTargetDeps).map(d => d.split('#')[0]);
        }

        const menuData = {
          // N.B. theoratically there can be a mismatch between basename and pkgJson.name,
          // but we assume folder names and pkgJson.names to be similar
          searchTargetCollections,
          referenceCollections: transformToProjectNames(providenceConf.referenceCollections),
          searchTargetDeps,
        };
        ctx.body = menuData;
      } else if (ctx.url === '/providence-conf.js') {
        // Alloes frontend dasbboard app to find categoriesand other configs
        ctx.type = 'text/javascript';
        ctx.body = providenceConfRaw;
      } else {
        await next();
      }
    },
  ];
}

(async function main() {
  const { providenceConf, providenceConfRaw } = await getProvidenceConf();
  const { searchTargetDeps, resultFiles } = await getCachedProvidenceResults();

  // Needed for dev purposes (we call it from ./packages-node/providence-analytics/ instead of ./)
  // Allows es-dev-server to find the right moduleDirs
  const fromPackageRoot = process.argv.includes('--serve-from-package-root');
  const moduleRoot = fromPackageRoot ? pathLib.resolve(process.cwd(), '../../') : process.cwd();

  const config = createConfig({
    port: 8080,
    appIndex: pathLib.resolve(__dirname, 'index.html'),
    rootDir: moduleRoot,
    nodeResolve: true,
    moduleDirs: pathLib.resolve(moduleRoot, 'node_modules'),
    watch: false,
    open: true,
    middlewares: createMiddleWares({
      providenceConf,
      providenceConfRaw,
      searchTargetDeps,
      resultFiles,
    }),
  });

  await startServer(config);
})();
