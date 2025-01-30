import { expect } from 'chai';
import { it } from 'mocha';

import { DummyAnalyzer } from '../../../test-helpers/templates/DummyAnalyzer.js';
import FindImportsAnalyzer from '../../../src/program/analyzers/find-imports.js';
import { QueryService } from '../../../src/program/core/QueryService.js';

/**
 * @typedef {import('../../../types/index.js').PathFromSystemRoot} PathFromSystemRoot
 * @typedef {import('../../../types/index.js').Analyzer} Analyzer
 */

describe('QueryService', () => {
  describe('Methods', () => {
    describe('Retrieving QueryConfig', () => {
      describe.skip('"getQueryConfigFromAnalyzer"', () => {
        const myAnalyzerCfg = { targetProjectPath: /** @type {PathFromSystemRoot} */ ('/my/path') };
        it('accepts a constructor as first argument', async () => {
          const result = await QueryService.getQueryConfigFromAnalyzer(
            'find-imports',
            myAnalyzerCfg,
          );
          expect(result).to.deep.equal({
            type: 'ast-analyzer',
            analyzerName: 'find-imports',
            analyzerConfig: myAnalyzerCfg,
            analyzer: FindImportsAnalyzer,
          });
        });

        it('accepts a string as first argument', async () => {
          const result = await QueryService.getQueryConfigFromAnalyzer(
            /** @type {* & Analyzer} */ (DummyAnalyzer),
            myAnalyzerCfg,
          );
          expect(result).to.deep.equal({
            type: 'ast-analyzer',
            analyzerName: 'find-dummy-analyzer',
            analyzerConfig: myAnalyzerCfg,
            analyzer: DummyAnalyzer,
          });
        });
      });
    });

    // describe('QueryResults', () => {
    //   describe.skip('"grepSearch"', () => {
    //     it('with FeatureConfig', async () => {
    //       const featureCfg = QueryService.getQueryConfigFromFeatureString('tg-icon[size=xs]');
    //       const result = QueryService.grepSearch(featureCfg);
    //       expect(result).to.deep.equal({
    //         type: 'ast-analyzer',
    //         analyzerName: 'find-imports',
    //         analyzerConfig: { x: 'y' },
    //         analyzer: FindImportsAnalyzer,
    //       });
    //     });
    //   });

    //   it('"astSearch"', async () => {});
    // });

    describe('Ast retrieval', () => {
      it('"addAstToProjectsData"', async () => {});
    });
  });
});
