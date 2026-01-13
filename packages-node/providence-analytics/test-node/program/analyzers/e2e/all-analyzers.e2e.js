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

/**
 * Sorts the array with objects deeply.
 * 1) Sort all property names alphabetically for objects
 * 2) Sort array string literal values by value alphabetically
 */

function deepArraySort(input) {
  const sortArray = arr => {
    // eslint-disable-next-line no-use-before-define
    const sortedItems = arr.map(sortAny);
    if (sortedItems.every(x => typeof x === 'string')) {
      return sortedItems.slice().sort();
    }
    return sortedItems;
  };

  const sortAny = v => {
    // eslint-disable-next-line no-use-before-define
    if (Array.isArray(v)) return sortArray(v);
    // eslint-disable-next-line no-use-before-define
    if (typeof v === 'object' && v !== null) return sortObjectKeys(v);
    return v;
  };

  const sortObjectKeys = obj => {
    const keys = Object.keys(obj).sort();
    const out = {};
    for (const k of keys) {
      out[k] = sortAny(obj[k]);
    }
    return out;
  };

  return sortAny(input);
}

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
      expect(deepArraySort(queryOutput)).to.include.deep.members(
        deepArraySort(expectedOutput.queryOutput),
      );
    });
  }
});
