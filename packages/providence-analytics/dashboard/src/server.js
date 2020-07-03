const fs = require('fs');
const pathLib = require('path');
const { createConfig, startServer } = require('es-dev-server');
const { ReportService } = require('../../src/program/services/ReportService.js');
const { LogService } = require('../../src/program/services/LogService.js');

// eslint-disable-next-line import/no-dynamic-require
const providenceConf = require(`${pathLib.join(process.cwd(), 'providence.conf.js')}`);
let outputFilePaths;
try {
  outputFilePaths = fs.readdirSync(ReportService.outputPath);
} catch (_) {
  LogService.error(
    `Please make sure providence results can be found in ${ReportService.outputPath}`,
  );
  process.exit(1);
}

const resultFiles = {};
let searchTargetDeps;
const supportedAnalyzers = ['match-imports', 'match-subclasses'];

outputFilePaths.forEach(fileName => {
  const content = JSON.parse(
    fs.readFileSync(pathLib.join(ReportService.outputPath, fileName), 'utf-8'),
  );
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

function transformToProjectNames(collections) {
  const res = {};
  // eslint-disable-next-line array-callback-return
  Object.entries(collections).map(([key, val]) => {
    res[key] = val.map(c => pathLib.basename(c));
  });
  return res;
}

const pathFromServerRootToHere = `/${pathLib.relative(process.cwd(), __dirname)}`;

const config = createConfig({
  port: 8080,
  // appIndex: './dashboard/index.html',
  // rootDir: process.cwd(),
  nodeResolve: true,
  // moduleDirs: pathLib.resolve(process.cwd(), 'node_modules'),
  watch: false,
  open: true,
  middlewares: [
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
      } else if (ctx.url === '/providence.conf.js') {
        // We need to fetch it via server, since it's CommonJS vs es modules...
        // require("@babel/core").transform("code", {
        //   plugins: ["@babel/plugin-transform-modules-commonjs"]
        // });

        // Gives back categories from providence.conf
        ctx.body = providenceConf.metaConfig;
      } else {
        await next();
      }
    },
  ],
});

(async () => {
  await startServer(config);
})();
