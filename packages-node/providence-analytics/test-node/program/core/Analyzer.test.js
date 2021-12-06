const { expect } = require('chai');
const {
  mockProject,
  restoreMockedProjects,
} = require('../../../test-helpers/mock-project-helpers.js');
const { setupAnalyzerTest } = require('../../../test-helpers/setup-analyzer-test.js');
const { QueryService } = require('../../../src/program/core/QueryService.js');
const { providence } = require('../../../src/program/providence.js');
const { DummyAnalyzer } = require('../../../test-helpers/templates/DummyAnalyzer.js');

/**
 * @typedef {import('../../../src/program/types/core').ProvidenceConfig} ProvidenceConfig
 */

describe('Analyzer', () => {
  const dummyAnalyzer = new DummyAnalyzer();
  const queryResults = setupAnalyzerTest();

  describe('Public api', () => {
    it('has a "name" string', async () => {
      expect(typeof dummyAnalyzer.name).to.equal('string');
    });

    it('has an "execute" function', async () => {
      expect(typeof dummyAnalyzer.execute).to.equal('function');
    });

    it('has a "requiredAst" string', async () => {
      expect(typeof dummyAnalyzer.requiredAst).to.equal('string');
      const allowedAsts = ['babel'];
      expect(allowedAsts).to.include(dummyAnalyzer.requiredAst);
    });

    it('has a "requiresReference" boolean', async () => {
      expect(typeof DummyAnalyzer.requiresReference).to.equal('boolean');
    });
  });

  describe('Find Analyzers', async () => {
    afterEach(() => {
      restoreMockedProjects();
    });

    const myQueryConfigObject = QueryService.getQueryConfigFromAnalyzer(DummyAnalyzer);
    /** @type {Partial<ProvidenceConfig>} */
    const _providenceCfg = {
      targetProjectPaths: ['/fictional/project'],
    };

    describe('Prepare phase', () => {
      it('looks for a cached result', async () => {
        // Our configuration object
        mockProject([`const validJs = true;`, `let invalidJs = false;`]);
        await providence(myQueryConfigObject, _providenceCfg);
      });

      it('exposes a ".targetMeta" object', async () => {});

      it('exposes a ".targetData" object', async () => {});

      it('exposes a ".identifier" string', async () => {});
    });

    describe('Traverse phase', () => {
      it('schedules a Babel visitor', async () => {});
      it('merges multiple Babel visitors for performance', async () => {});
      it('traverses Babel visitor and stores traversal result', async () => {});
    });

    describe('Postprocess phase', () => {
      it('optionally post processes traversal result', async () => {});
    });

    describe('Performance', () => {
      it('memoizes execute functions', async () => {});
    });

    describe('Finalize phase', () => {
      it('returns an AnalyzerQueryResult', async () => {
        await providence(myQueryConfigObject, _providenceCfg);

        const queryResult = queryResults[0];
        const { queryOutput, meta } = queryResult;

        expect(queryOutput[0]).to.eql({
          file: './test-file-0.js',
          meta: {},
          result: [{ matched: 'entry' }],
        });
        expect(queryOutput[1]).to.eql({
          file: './test-file2.js',
          meta: {},
          result: [{ matched: 'entry' }],
        });
        // Local machine info needs to be deleted, so that results are always 'machine agnostic'
        // (which is needed to share cached json results via git)
        expect(meta).to.eql({
          searchType: 'ast-analyzer',
          analyzerMeta: {
            name: 'my-analyzer',
            requiredAst: 'babel',
            identifier: 'my-project_0.1.0-mock__542516121',
            targetProject: {
              name: 'my-project',
              commitHash: '[not-a-git-repo]',
              version: '0.1.0-mock',
            },
            configuration: {
              targetProjectPaths: null,
              optionA: false,
              optionB: '',
              debugEnabled: false,
              gatherFilesConfig: {},
            },
          },
        });
      });
    });

    // TODO: think of exposing the ast traversal part in a distinct method "traverse", so we can
    // create integrations with (a local version of) https://astexplorer.net
  });

  // describe.skip('Match Analyzers', () => {
  //   const referenceProject = {
  //     path: '/exporting/ref/project',
  //     name: 'exporting-ref-project',
  //     files: [
  //       {
  //         file: './package.json',
  //         code: `{
  //           "name": "importing-target-project",
  //           "version": "2.20.3",
  //           "dependencies": {
  //             "exporting-ref-project": "^2.3.0"
  //           }
  //         }`,
  //       },
  //     ],
  //   };

  //   const matchingTargetProject = {
  //     path: '/importing/target/project/v10',
  //     files: [
  //       {
  //         file: './package.json',
  //         code: `{
  //           "name": "importing-target-project",
  //           "version": "10.1.2",
  //           "dependencies": {
  //             "exporting-ref-project": "^2.3.0"
  //           }
  //         }`,
  //       },
  //     ],
  //   };

  //   const matchingDevDepTargetProject = {
  //     path: '/importing/target/project/v10',
  //     files: [
  //       {
  //         file: './package.json',
  //         code: `{
  //           "name": "importing-target-project",
  //           "version": "10.1.2",
  //           "devDependencies": {
  //             "exporting-ref-project": "^2.3.0"
  //           }
  //         }`,
  //       },
  //     ],
  //   };

  //   // A previous version that does not match our reference version
  //   const nonMatchingVersionTargetProject = {
  //     path: '/importing/target/project/v8',
  //     files: [
  //       {
  //         file: './package.json',
  //         code: `{
  //           "name": "importing-target-project",
  //           "version": "8.1.2",
  //           "dependencies": {
  //             "exporting-ref-project": "^1.9.0"
  //           }
  //         }`,
  //       },
  //     ],
  //   };

  //   const nonMatchingDepTargetProject = {
  //     path: '/importing/target/project/v8',
  //     files: [
  //       {
  //         file: './package.json',
  //         code: `{
  //               "name": "importing-target-project",
  //               "version": "8.1.2",
  //               "dependencies": {
  //                 "some-other-project": "^0.1.0"
  //               }
  //             }`,
  //       },
  //     ],
  //   };

  //   it('has a "requiresReference" boolean', async () => {
  //     expect(dummyAnalyzer.requiresReference).to.equal(true);
  //   });

  //   describe('Prepare phase', () => {
  //     it('halts non-compatible reference + target combinations', async () => {
  //       mockTargetAndReferenceProject(referenceProject, nonMatchingVersionTargetProject);
  //       // Check stubbed LogService.info with reason 'no-matched-version'
  //       mockTargetAndReferenceProject(referenceProject, nonMatchingDepTargetProject);
  //       // Check stubbed LogService.info with reason 'no-dependency'
  //     });

  //     it('starts analysis for compatible reference + target combinations', async () => {
  //       mockTargetAndReferenceProject(referenceProject, matchingTargetProject);
  //       mockTargetAndReferenceProject(referenceProject, matchingDevDepTargetProject);
  //       // _prepare: startAnalysis: true
  //     });
  //   });
  // });
});

describe('FindAnalyzer', () => {});

describe('MatchAnalyzer', () => {});
