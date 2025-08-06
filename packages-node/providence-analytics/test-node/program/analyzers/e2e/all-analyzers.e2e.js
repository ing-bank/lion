/* eslint-disable import/no-extraneous-dependencies */
import pathLib, { dirname } from 'path';
import { fileURLToPath } from 'url';
import { expect } from 'chai';
import { it } from 'mocha';
import { providence } from '../../../../src/program/providence.js';
import { QueryService } from '../../../../src/program/core/QueryService.js';
import { ReportService } from '../../../../src/program/core/ReportService.js';
import { memoize } from '../../../../src/program/utils/memoize.js';
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
import { fsAdapter } from '../../../../src/program/utils/fs-adapter.js';

/**
 * @typedef {import('../../../../types/index.js').ProvidenceConfig} ProvidenceConfig
 * @typedef {import('../../../../types/index.js').QueryResult} QueryResult
 */

const __dirname = dirname(fileURLToPath(import.meta.url));

setupAnalyzerTest();

/**
 * @param {{ files: any[]; }[]} queryOutput
 */
function normalizeFileOrderToCompensateForNodeVersionDifferences(queryOutput) {
  // This is a workaround for the fact that the order of files in the output
  // can differ between Node.js versions, so we sort them to make the test stable.
  return queryOutput.map((/** @type {{ files: any[]; }} */ item) => {
    if (item.files) {
      item.files.sort();
    }
    return item;
  });
}

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

  const originalGetCachedResult = ReportService.getCachedResult;

  const memoizeCacheEnabledInitial = memoize.isCacheEnabled;
  memoize.disableCaching();

  after(() => {
    ReportService._getResultFileNameAndPath = originalGetResultFileNameAndPath;
    ReportService.getCachedResult = originalGetCachedResult;
    ReportService.outputPath = originalOutputPath;
    memoize.restoreCaching(memoizeCacheEnabledInitial);
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
    // @ts-ignore
    ReportService.getCachedResult = () => undefined;
  }
  const analyzers = [
    { providenceConfig: { targetProjectPaths: [targetPath] }, ctor: FindCustomelementsAnalyzer },
    { providenceConfig: { targetProjectPaths: [targetPath] }, ctor: FindImportsAnalyzer },
    { providenceConfig: { targetProjectPaths: [referencePath] }, ctor: FindExportsAnalyzer },
    { providenceConfig: { targetProjectPaths: [targetPath] }, ctor: FindClassesAnalyzer },
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
      const currentQueryConfig = await QueryService.getQueryConfigFromAnalyzer(ctor);
      const queryResults = await providence(
        currentQueryConfig,
        /** @type {ProvidenceConfig} */ (providenceConfig),
      );
      if (generateE2eMode) {
        console.info(
          'Successfully created mocks. Do not forget to rerun tests now without "--generate-e2e-mode"',
        );
        return;
      }
      const expectedOutput = JSON.parse(
        fsAdapter.fs.readFileSync(
          pathLib.resolve(
            __dirname,
            `../../../../test-helpers/project-mocks-analyzer-outputs/${ctor.analyzerName}.json`,
          ),
          'utf8',
        ),
      );
      const { queryOutput } = JSON.parse(JSON.stringify(queryResults[0]));
      expect(normalizeFileOrderToCompensateForNodeVersionDifferences(queryOutput)).to.deep.equal(
        normalizeFileOrderToCompensateForNodeVersionDifferences(expectedOutput.queryOutput),
      );
    });
  }
});
