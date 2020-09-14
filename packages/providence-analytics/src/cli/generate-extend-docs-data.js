/* eslint-disable import/no-extraneous-dependencies */
const fs = require('fs');
const pathLib = require('path');
const { performance } = require('perf_hooks');
const { providence } = require('../program/providence.js');
const { QueryService } = require('../program/services/QueryService.js');
const { LogService } = require('../program/services/LogService.js');
const { flatten } = require('./cli-helpers.js');

async function launchProvidenceWithExtendDocs({
  referenceProjectPaths,
  prefixCfg,
  outputFolder,
  extensions,
  allowlist,
  allowlistReference,
}) {
  const t0 = performance.now();

  const results = await providence(
    QueryService.getQueryConfigFromAnalyzer('match-paths', { prefix: prefixCfg }),
    {
      gatherFilesConfig: {
        extensions: extensions || ['.js'],
        allowlist: allowlist || ['!coverage', '!test'],
      },
      gatherFilesConfigReference: {
        extensions: extensions || ['.js'],
        allowlist: allowlistReference || ['!coverage', '!test'],
      },
      queryMethod: 'ast',
      report: false,
      targetProjectPaths: [pathLib.resolve(process.cwd())],
      referenceProjectPaths,
    },
  );

  const outputFilePath = pathLib.join(outputFolder, 'providence-extend-docs-data.json');
  const queryOutputs = flatten(
    results.map(result => result.queryOutput).filter(o => typeof o !== 'string'), // filter out '[no-dependency]' etc.
  );
  if (fs.existsSync(outputFilePath)) {
    fs.unlinkSync(outputFilePath);
  }
  fs.writeFile(outputFilePath, JSON.stringify(queryOutputs, null, 2), err => {
    if (err) {
      throw err;
    }
  });
  const t1 = performance.now();
  LogService.info(`"extend-docs" completed in ${Math.round((t1 - t0) / 1000)} seconds`);
}

module.exports = {
  launchProvidenceWithExtendDocs,
};
