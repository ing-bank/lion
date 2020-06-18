const pathLib = require('path');
const { expect } = require('chai');
const { providence } = require('../../../../src/program/providence.js');
const { QueryService } = require('../../../../src/program/services/QueryService.js');
const { ReportService } = require('../../../../src/program/services/ReportService.js');
const { LogService } = require('../../../../src/program/services/LogService.js');

const {
  mockWriteToJson,
  restoreWriteToJson,
} = require('../../../../test-helpers/mock-report-service-helpers.js');
const {
  suppressNonCriticalLogs,
  restoreSuppressNonCriticalLogs,
} = require('../../../../test-helpers/mock-log-service-helpers.js');

describe('Analyzers file-system integration', () => {
  before(() => {
    suppressNonCriticalLogs();
  });

  after(() => {
    restoreSuppressNonCriticalLogs();
  });

  const generateE2eMode = process.argv.includes('--generate-e2e-mode');

  const queryResults = [];
  const targetPath = pathLib.resolve(
    __dirname,
    '../../../../test-helpers/project-mocks/importing-target-project',
  );
  const referencePath = pathLib.resolve(
    __dirname,
    `../../../../test-helpers/project-mocks/importing-target-project/node_modules/exporting-ref-project`,
  );

  const originalGetResultFileNameAndPath = ReportService._getResultFileNameAndPath;
  const originalOutputPath = ReportService.outputPath;

  after(() => {
    ReportService._getResultFileNameAndPath = originalGetResultFileNameAndPath;
    ReportService.outputPath = originalOutputPath;
  });

  if (generateE2eMode) {
    ReportService.outputPath = pathLib.resolve(
      __dirname,
      '../../../../test-helpers/project-mocks-analyzer-outputs',
    );
    // eslint-disable-next-line func-names
    ReportService._getResultFileNameAndPath = function (name) {
      return pathLib.join(this.outputPath, `${name}.json`);
    };
  } else {
    ReportService.outputPath = __dirname; // prevents cache to fail the test

    beforeEach(() => {
      mockWriteToJson(queryResults);
    });

    afterEach(() => {
      restoreWriteToJson(queryResults);
    });
  }
  const analyzers = [
    {
      analyzerName: 'find-customelements',
      providenceConfig: {
        targetProjectPaths: [targetPath],
      },
    },
    {
      analyzerName: 'find-imports',
      providenceConfig: {
        targetProjectPaths: [targetPath],
      },
    },
    {
      analyzerName: 'find-exports',
      providenceConfig: {
        targetProjectPaths: [referencePath],
      },
    },
    {
      analyzerName: 'find-classes',
      providenceConfig: {
        targetProjectPaths: [targetPath],
      },
    },
    {
      analyzerName: 'match-imports',
      providenceConfig: {
        targetProjectPaths: [targetPath],
        referenceProjectPaths: [referencePath],
      },
    },
    {
      analyzerName: 'match-subclasses',
      providenceConfig: {
        targetProjectPaths: [targetPath],
        referenceProjectPaths: [referencePath],
      },
    },
    {
      analyzerName: 'match-paths',
      providenceConfig: {
        targetProjectPaths: [targetPath],
        referenceProjectPaths: [referencePath],
      },
    },
  ];

  for (const { analyzerName, providenceConfig } of analyzers) {
    it(`"${analyzerName}" analyzer`, async () => {
      const findExportsQueryConfig = QueryService.getQueryConfigFromAnalyzer(analyzerName);
      await providence(findExportsQueryConfig, providenceConfig);
      if (generateE2eMode) {
        LogService.info(
          'Successfully created mocks. Do not forget to rerun tests now without "--generate-e2e-mode"',
        );
        return;
      }
      // eslint-disable-next-line import/no-dynamic-require, global-require
      const expectedOutput = require(`../../../../test-helpers/project-mocks-analyzer-outputs/${analyzerName}.json`);
      const queryResult = JSON.parse(JSON.stringify(queryResults[0])).queryOutput;
      expect(queryResult).to.eql(expectedOutput.queryOutput);
    });
  }
});
