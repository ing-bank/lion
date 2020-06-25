/* eslint-disable import/no-extraneous-dependencies */
const fs = require('fs');
const pathLib = require('path');
const { performance } = require('perf_hooks');

const { providence } = require('../program/providence.js');
const { QueryService } = require('../program/services/QueryService.js');
const { LogService } = require('../program/services/LogService.js');

async function launchProvidenceWithExtendDocs(referencePaths, prefixObj, outputFolder) {
  const t0 = performance.now();

  const results = await providence(
    QueryService.getQueryConfigFromAnalyzer('match-paths', { prefix: prefixObj }),
    {
      gatherFilesConfig: {
        extensions: ['.js', '.html'],
        excludeFolders: ['coverage', 'test'],
      },
      queryMethod: 'ast',
      report: false,
      targetProjectPaths: [pathLib.resolve(process.cwd())],
      referenceProjectPaths: referencePaths,
    },
  );

  const outputFilePath = pathLib.join(outputFolder, 'providence-extend-docs-data.json');
  const queryOutputs = results.map(result => result.queryOutput).flat();
  if (fs.existsSync(outputFilePath)) {
    fs.unlinkSync(outputFilePath);
  }
  fs.writeFile(outputFilePath, JSON.stringify(queryOutputs), err => {
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
