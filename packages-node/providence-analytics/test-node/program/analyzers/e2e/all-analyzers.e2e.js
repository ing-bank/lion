/* eslint-disable import/no-extraneous-dependencies */
import pathLib, { dirname } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { expect } from 'chai';
import { it } from 'mocha';
import { providence } from '../../../../src/program/providence.js';
import { QueryService } from '../../../../src/program/core/QueryService.js';
import { ReportService } from '../../../../src/program/core/ReportService.js';
import { memoizeConfig } from '../../../../src/program/utils/memoize.js';
import { setupAnalyzerTest } from '../../../../test-helpers/setup-analyzer-test.js';
import {
  FindExportsAnalyzer,
  FindImportsAnalyzer,
  MatchImportsAnalyzer,
} from '../../../../src/program/analyzers/index.js';
import MatchSubclassesAnalyzer from '../../../../src/program/analyzers/match-subclasses.js';
import MatchPathsAnalyzer from '../../../../src/program/analyzers/match-paths.js';
import FindCustomelementsAnalyzer from '../../../../src/program/analyzers/find-customelements.js';
import FindClassesAnalyzer from '../../../../src/program/analyzers/find-classes.js';

/**
 * @typedef {import('../../../../types/index.js').ProvidenceConfig} ProvidenceConfig
 * @typedef {import('../../../../types/index.js').QueryResult} QueryResult
 */

const __dirname = dirname(fileURLToPath(import.meta.url));

setupAnalyzerTest();

describe('Analyzers file-system integration', () => {
  /**
   * Flag to enable mode that generates e2e mocks.
   * We 'abuse' this test file for that purpose for ease of maintenance
   * @type {boolean}
   */
  const generateE2eMode = process.argv.includes('--generate-e2e-mode');

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
    // @ts-expect-error
    // eslint-disable-next-line func-names
    ReportService._getResultFileNameAndPath = function (name) {
      return pathLib.join(this.outputPath, `${name}.json`);
    };
  } else {
    ReportService.outputPath = __dirname; // prevents cache to fail the test
  }
  const analyzers = [
    {
      providenceConfig: {
        targetProjectPaths: [targetPath],
      },
      ctor: FindCustomelementsAnalyzer,
    },
    {
      providenceConfig: {
        targetProjectPaths: [targetPath],
      },
      ctor: FindImportsAnalyzer,
    },
    {
      providenceConfig: {
        targetProjectPaths: [referencePath],
      },
      ctor: FindExportsAnalyzer,
    },
    {
      providenceConfig: {
        targetProjectPaths: [targetPath],
      },
      ctor: FindClassesAnalyzer,
    },
    {
      providenceConfig: {
        targetProjectPaths: [targetPath],
        referenceProjectPaths: [referencePath],
      },
      ctor: MatchImportsAnalyzer,
    },
    {
      providenceConfig: {
        targetProjectPaths: [targetPath],
        referenceProjectPaths: [referencePath],
      },
      ctor: MatchSubclassesAnalyzer,
    },
    {
      providenceConfig: {
        targetProjectPaths: [targetPath],
        referenceProjectPaths: [referencePath],
      },
      ctor: MatchPathsAnalyzer,
    },
  ];

  for (const { ctor, providenceConfig } of analyzers) {
    it(`"${ctor.analyzerName}" analyzer`, async () => {
      const findExportsQueryConfig = await QueryService.getQueryConfigFromAnalyzer(ctor);
      const queryResults = await providence(
        findExportsQueryConfig,
        /** @type {ProvidenceConfig} */ (providenceConfig),
      );
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
            `../../../../test-helpers/project-mocks-analyzer-outputs/${ctor.analyzerName}.json`,
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
