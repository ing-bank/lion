/* eslint-disable import/no-extraneous-dependencies */
import path from 'path';
import url from 'url';
import { expect } from 'chai';
import { it } from 'mocha';
import { providence } from '../../../../src/program/providence.js';
import { QueryService } from '../../../../src/program/core/QueryService.js';
import { ReportService } from '../../../../src/program/core/ReportService.js';
import { memoize } from '../../../../src/program/utils/memoize.js';
import { setupAnalyzerTest } from '../../../../test-helpers/setup-analyzer-test.js';
import {
  MatchImportsAnalyzer,
  FindExportsAnalyzer,
  FindImportsAnalyzer,
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

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

/**
 * @param {{parser: 'oxc'|'swc'}} opts
 */
function runE2eSuite({ parser }) {
  setupAnalyzerTest();

  describe('Analyzers file-system integration', () => {
    /**
     * Flag to enable mode that generates e2e mocks.
     * We 'abuse' this test file for that purpose for ease of maintenance
     * @type {boolean}
     */
    const generateE2eMode = process.argv.includes('--generate-e2e-mode');

    const targetPath = path.resolve(
      __dirname,
      '../../../../test-helpers/project-mocks/importing-target-project',
    );
    const referencePath = path.resolve(
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
      ReportService.outputPath = path.resolve(
        __dirname,
        '../../../../test-helpers/project-mocks-analyzer-outputs',
      );
      // @ts-expect-error
      // eslint-disable-next-line func-names
      ReportService._getResultFileNameAndPath = function (name) {
        return path.join(this.outputPath, `${name}.json`);
      };
    } else {
      ReportService.outputPath = path.join(__dirname, '__providence-output'); // prevents cache to fail the test
      // @ts-ignore
      ReportService.getCachedResult = () => undefined;
    }
    const analyzers = [
      {
        providenceConfig: {
          targetProjectPaths: [targetPath],
          parser,
        },
        ctor: FindCustomelementsAnalyzer,
      },
      {
        providenceConfig: {
          targetProjectPaths: [targetPath],
          parser,
        },
        ctor: FindImportsAnalyzer,
      },
      {
        providenceConfig: {
          targetProjectPaths: [referencePath],
          parser,
        },
        ctor: FindExportsAnalyzer,
      },
      {
        providenceConfig: {
          targetProjectPaths: [targetPath],
          parser,
        },
        ctor: FindClassesAnalyzer,
      },
      {
        providenceConfig: {
          targetProjectPaths: [targetPath],
          referenceProjectPaths: [referencePath],
          parser,
        },
        ctor: MatchImportsAnalyzer,
      },
      {
        providenceConfig: {
          targetProjectPaths: [targetPath],
          referenceProjectPaths: [referencePath],
          parser,
        },
        ctor: MatchSubclassesAnalyzer,
      },
      {
        providenceConfig: {
          targetProjectPaths: [targetPath],
          referenceProjectPaths: [referencePath],
          parser,
        },
        ctor: MatchPathsAnalyzer,
      },
    ];

    for (const { ctor, providenceConfig } of analyzers) {
      it(`"${ctor.analyzerName}" analyzer (${parser})`, async () => {
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
            path.resolve(
              __dirname,
              `../../../../test-helpers/project-mocks-analyzer-outputs/${ctor.analyzerName}.json`,
            ),
            'utf8',
          ),
        );
        const { queryOutput } = JSON.parse(JSON.stringify(queryResults[0]));
        // expect(queryOutput).not.to.deep.equal([]);
        expect(queryOutput).to.deep.equal(expectedOutput.queryOutput);
      });
    }
  });
}

// TODO: find out why order matters here...
runE2eSuite({ parser: 'swc' });
runE2eSuite({ parser: 'oxc' });
