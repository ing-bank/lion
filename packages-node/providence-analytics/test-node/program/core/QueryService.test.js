const { expect } = require('chai');
const { QueryService } = require('../../../src/program/core/QueryService.js');
const { DummyAnalyzer } = require('../../../test-helpers/templates/DummyAnalyzer.js');
const FindImportsAnalyzer = require('../../../src/program/analyzers/find-imports.js');

/**
 * @typedef {import('../../../src/program/types/core').Analyzer} Analyzer
 * @typedef {import('../../../src/program/types/core').PathFromSystemRoot} PathFromSystemRoot
 */

describe('QueryService', () => {
  describe('Methods', () => {
    describe('Retrieving QueryConfig', () => {
      it('"getQueryConfigFromRegexSearchString"', async () => {
        const result = QueryService.getQueryConfigFromRegexSearchString('x');
        expect(result).to.eql({ type: 'search', regexString: 'x' });

        expect(() => {
          // @ts-expect-error
          QueryService.getQueryConfigFromRegexSearchString();
        }).to.throw('[QueryService.getQueryConfigFromRegexSearchString]: provide a string');
      });

      describe('"getQueryConfigFromFeatureString"', () => {
        it('with tag, attr-key and attr-value', async () => {
          const result = QueryService.getQueryConfigFromFeatureString('tg-icon[size=xs]');
          expect(result).to.eql({
            type: 'feature',
            feature: {
              name: 'size',
              value: 'xs',
              tag: 'tg-icon',
              isAttribute: true,
              usesValueContains: false,
              usesValuePartialMatch: false,
              usesTagPartialMatch: false,
            },
          });
        });

        it('with only tag', async () => {
          const result = QueryService.getQueryConfigFromFeatureString('tg-icon');
          expect(result).to.eql({
            type: 'feature',
            feature: {
              tag: 'tg-icon',
              usesTagPartialMatch: false,
            },
          });
        });

        it('with only attr-key', async () => {
          const result = QueryService.getQueryConfigFromFeatureString('[attr]');
          expect(result).to.eql({
            type: 'feature',
            feature: {
              name: 'attr',
              value: undefined,
              tag: '',
              isAttribute: true,
              usesValueContains: false,
              usesValuePartialMatch: false,
              usesTagPartialMatch: false,
            },
          });
        });

        it('with only attr-key and attr-value', async () => {
          const result = QueryService.getQueryConfigFromFeatureString('[attr=x]');
          expect(result).to.eql({
            type: 'feature',
            feature: {
              name: 'attr',
              value: 'x',
              tag: '',
              isAttribute: true,
              usesValueContains: false,
              usesValuePartialMatch: false,
              usesTagPartialMatch: false,
            },
          });
        });

        describe('With partial value', async () => {
          it('with tag, attr-key and attr-value', async () => {
            const result = QueryService.getQueryConfigFromFeatureString('tg-icon*[size*=xs*]');
            expect(result).to.eql({
              type: 'feature',
              feature: {
                name: 'size',
                value: 'xs',
                tag: 'tg-icon',
                isAttribute: true,
                usesValueContains: true,
                usesValuePartialMatch: true,
                usesTagPartialMatch: true,
              },
            });
          });

          it('with only tag', async () => {
            const result = QueryService.getQueryConfigFromFeatureString('tg-icon*');
            expect(result).to.eql({
              type: 'feature',
              feature: {
                tag: 'tg-icon',
                usesTagPartialMatch: true,
              },
            });
          });

          it('with only attr-key', async () => {
            const result = QueryService.getQueryConfigFromFeatureString('[attr*]');
            expect(result).to.eql({
              type: 'feature',
              feature: {
                name: 'attr',
                value: undefined,
                tag: '',
                isAttribute: true,
                usesValueContains: true,
                usesValuePartialMatch: false,
                usesTagPartialMatch: false,
              },
            });
          });

          it('with only attr-key and attr-value', async () => {
            const result = QueryService.getQueryConfigFromFeatureString('[attr*=x*]');
            expect(result).to.eql({
              type: 'feature',
              feature: {
                name: 'attr',
                value: 'x',
                tag: '',
                isAttribute: true,
                usesValueContains: true,
                usesValuePartialMatch: true,
                usesTagPartialMatch: false,
              },
            });
          });
        });

        it('throws when no string provided', async () => {
          expect(() => {
            QueryService.getQueryConfigFromFeatureString();
          }).to.throw('[QueryService.getQueryConfigFromFeatureString]: provide a string');
        });
      });

      describe('"getQueryConfigFromAnalyzer"', () => {
        const myAnalyzerCfg = { targetProjectPath: /** @type {PathFromSystemRoot} */ ('/my/path') };
        it('accepts a constructor as first argument', async () => {
          const result = QueryService.getQueryConfigFromAnalyzer('find-imports', myAnalyzerCfg);
          expect(result).to.eql({
            type: 'ast-analyzer',
            analyzerName: 'find-imports',
            analyzerConfig: myAnalyzerCfg,
            analyzer: FindImportsAnalyzer,
          });
        });

        it('accepts a string as first argument', async () => {
          const result = QueryService.getQueryConfigFromAnalyzer(
            /** @type {* & Analyzer} */ (DummyAnalyzer),
            myAnalyzerCfg,
          );
          expect(result).to.eql({
            type: 'ast-analyzer',
            analyzerName: 'dummy-analyzer',
            analyzerConfig: myAnalyzerCfg,
            analyzer: DummyAnalyzer,
          });
        });
      });
    });

    describe('QueryResults', () => {
      describe('"grepSearch"', () => {
        it('with FeatureConfig', async () => {
          const featureCfg = QueryService.getQueryConfigFromFeatureString('tg-icon[size=xs]');
          const result = QueryService.grepSearch(featureCfg);
          expect(result).to.eql({
            type: 'ast-analyzer',
            analyzerName: 'find-imports',
            analyzerConfig: { x: 'y' },
            analyzer: FindImportsAnalyzer,
          });
        });
      });

      it('"astSearch"', async () => {});
    });

    describe('Ast retrieval', () => {
      // TODO: move to AST service?
      it('"addAstToProjectsData"', async () => {});
    });
  });
});
