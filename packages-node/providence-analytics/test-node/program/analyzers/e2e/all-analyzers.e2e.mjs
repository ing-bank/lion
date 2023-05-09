/* eslint-disable import/no-extraneous-dependencies */
import pathLib, { dirname } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { expect } from 'chai';
import { providence } from '../../../../src/program/providence.js';
import { QueryService } from '../../../../src/program/core/QueryService.js';
import { ReportService } from '../../../../src/program/core/ReportService.js';
import { memoizeConfig } from '../../../../src/program/utils/memoize.js';

import {
  mockWriteToJson,
  restoreWriteToJson,
} from '../../../../test-helpers/mock-report-service-helpers.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

describe('Analyzers file-system integration', () => {
  /**
   * Flag to enable mode that generates e2e mocks.
   * We 'abuse' this test file for that purpose for ease of maintenance
   * @type {boolean}
   */
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

  const memoizeCacheDisabledInitial = memoizeConfig.isCacheDisabled;
  memoizeConfig.isCacheDisabled = true;

  after(() => {
    ReportService._getResultFileNameAndPath = originalGetResultFileNameAndPath;
    ReportService.outputPath = originalOutputPath;
    memoizeConfig.isCacheDisabled = memoizeCacheDisabledInitial;
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
        console.info(
          'Successfully created mocks. Do not forget to rerun tests now without "--generate-e2e-mode"',
        );
        return;
      }
      const expectedOutput = JSON.parse(
        fs.readFileSync(
          pathLib.resolve(
            __dirname,
            `../../../../test-helpers/project-mocks-analyzer-outputs/${analyzerName}.json`,
          ),
          'utf8',
        ),
      );
      const { queryOutput } = JSON.parse(JSON.stringify(queryResults[0]));
      expect(queryOutput).not.to.eql([]);
      expect(queryOutput).to.eql(expectedOutput.queryOutput);
    });
  }
});
