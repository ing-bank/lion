import { expect } from 'chai';
import { it } from 'mocha';
import { providence } from '../../../src/program/providence.js';
import { QueryService } from '../../../src/program/core/QueryService.js';
import FindExportsAnalyzer from '../../../src/program/analyzers/find-exports.js';
import FindImportsAnalyzer from '../../../src/program/analyzers/find-imports.js';
import { setupAnalyzerTest } from '../../../test-helpers/setup-analyzer-test.js';
import { mockTargetAndReferenceProject } from '../../../test-helpers/mock-project-helpers.js';
import MatchImportsAnalyzer from '../../../src/program/analyzers/match-imports.js';

/**
 * @typedef {import('../../../types/index.js').ProvidenceConfig} ProvidenceConfig
 */

/**
 * @param {{parser: 'oxc'|'swc'}} opts
 */
async function runMatchImportsSuite({ parser }) {
  setupAnalyzerTest();
  const matchImportsQueryConfig =
    await QueryService.getQueryConfigFromAnalyzer(MatchImportsAnalyzer);
  /** @type {Partial<ProvidenceConfig>} */
  const _providenceCfg = {
    targetProjectPaths: ['/importing/target/project'],
    referenceProjectPaths: ['/importing/target/project/node_modules/exporting-ref-project'],
    parser,
  };

  // 1. Reference input data
  const referenceProject = {
    path: '/importing/target/project/node_modules/exporting-ref-project',
    name: 'exporting-ref-project',
    files: [
      // This file contains all 'original' exported definitions
      {
        file: './ref-src/core.js',
        code: `
    // named specifier
    export class RefClass extends HTMLElement {};

    // default specifier
    export default class OtherClass {};
  `,
      },
      // This file is used to test file system 'resolvements' -> importing repos using
      // `import 'exporting-ref-project/ref-src/folder'` should be pointed to this index.js file
      {
        file: './ref-src/folder/index.js',
        code: `
    // this file (and thus this export) should be resolved via
    // [import 'exporting-ref-project/ref-src/folder']
    export const resolvePathCorrect = null;
  `,
      },
      {
        file: './ref-component.js',
        code: `
    // global effects
    import { RefClass } from './ref-src/core.js';
    customElements.define('ref-component', RefClass);
  `,
      },
      {
        file: './not-imported.js',
        code: `
    // this file will not be included by "importing-target-project" defined below
    export const notImported = null;
  `,
      },
      // This file re-exports everything from 'ref-src/core.js'
      {
        file: './index.js',
        // Default export, renamed export
        // export default class X
        code: `
    // re-exported specifier
    export { RefClass } from './ref-src/core.js';

    // renamed re-exported specifier
    export { RefClass as RefRenamedClass } from './ref-src/core.js';

    // re-exported default specifier
    import refConstImported from './ref-src/core.js';
    export default refConstImported;
  `,
      },
      {
        file: './export-namespaced.js',
        code: `
  // This file will test if all its exported specifiers are catched via "import * as"
  // (namespaced)
  export const a = 4;
  export default class B {};
`,
      },
    ],
  };

  const searchTargetProject = {
    path: '/importing/target/project',
    name: 'importing-target-project',
    files: [
      {
        file: './target-src/indirect-imports.js',
        code: `
  // named import (indirect, needs transitivity check)
  import { RefClass } from 'exporting-ref-project';

  // renamed import (indirect, needs transitivity check)
  import { RefRenamedClass } from 'exporting-ref-project';

  // default (indirect, needs transitivity check)
  import refConstImported from 'exporting-ref-project';

  // should not be found
  import { nonMatched } from 'unknown-project';
`,
      },
      {
        file: './target-src/direct-imports.js',
        code: `
  // a direct named import
  import { RefClass } from 'exporting-ref-project/ref-src/core.js';

  // a direct default import
  import refConst from 'exporting-ref-project/ref-src/core.js';

  // should not be found
  import { nonMatched } from 'unknown-project/xyz.js';

  /**
   * Examples below should be resolved to the proper filepath (filename + extension)
   * (direct or indirect is not relevant in this case, it is about the source and not the
   * specifier)
   */

  // Two things:
  // - a file with side effects
  // - should resolve "as file", to 'exporting-ref-project/ref-component.js'
  import 'exporting-ref-project/ref-component';

  // - should resolve "as folder", to 'exporting-ref-project/ref-src/folder/index.js'
  import { resolvePathCorrect } from 'exporting-ref-project/ref-src/folder';
`,
      },
      {
        file: './import-namespaced.js',
        code: `
  // should return a match for every export in reference source
  import * as namespace from 'exporting-ref-project/export-namespaced.js';
  `,
      },

      /**
       * Possible other checks (although already tested in unit tests of find-import/find-exports):
       * - dynamic imports
       * - default and named specifiers in one declaration
       * - renamed imports
       * - ...?
       */
    ],
  };

  // 2. Based on the example reference and target projects, we expect the following
  // extracted specifiers to be found...
  const expectedExportIdsIndirect = [
    'RefClass::./index.js::exporting-ref-project',
    'RefRenamedClass::./index.js::exporting-ref-project',
    '[default]::./index.js::exporting-ref-project',
  ];

  const expectedExportIdsDirect = [
    'RefClass::./ref-src/core.js::exporting-ref-project',
    '[default]::./ref-src/core.js::exporting-ref-project',
    'resolvePathCorrect::./ref-src/folder/index.js::exporting-ref-project',
  ];

  const expectedExportIdsNamespaced = [
    'a::./export-namespaced.js::exporting-ref-project',
    '[default]::./export-namespaced.js::exporting-ref-project',
  ];

  // eslint-disable-next-line no-unused-vars
  const expectedExportIds = [
    ...expectedExportIdsIndirect,
    ...expectedExportIdsDirect,
    ...expectedExportIdsNamespaced,
  ];

  // 3. The AnalyzerQueryResult generated by "match-imports"
  // eslint-disable-next-line no-unused-vars
  const expectedMatchesOutput = [
    {
      exportSpecifier: {
        name: 'RefClass',
        project: 'exporting-ref-project', // name under which it is registered in npm ("name" attr in package.json)
        filePath: './ref-src/core.js',
        id: 'RefClass::./ref-src/core.js::exporting-ref-project',
      },
      // All the matched targets (files importing the specifier), ordered per project
      matchesPerProject: [
        {
          project: 'importing-target-project',
          files: [
            './target-src/indirect-imports.js',
            // ...
          ],
        },
        // ...
      ],
    },
  ];

  function testMatchedEntry(targetExportedId, queryResult, importedByFiles = []) {
    const matchedEntry = queryResult.queryOutput.find(
      r => r.exportSpecifier.id === targetExportedId,
    );

    const [name, filePath, project] = targetExportedId.split('::');
    expect(matchedEntry.exportSpecifier).to.deep.equal({
      name,
      filePath,
      project,
      id: targetExportedId,
    });
    expect(matchedEntry.matchesPerProject[0].project).to.equal('importing-target-project');
    expect(matchedEntry.matchesPerProject[0].files).to.deep.equal(importedByFiles);
  }

  describe(`Analyzer "match-imports" (${parser})`, async () => {
    describe('Extracting exports', () => {
      it(`identifies all direct export specifiers consumed by target`, async () => {
        const refProject = {
          path: '/target/node_modules/ref',
          name: 'ref',
          files: [{ file: './direct.js', code: `export default function x() {};` }],
        };
        const targetProject = {
          path: '/target',
          name: 'target',
          files: [{ file: './index.js', code: `import myFn from 'ref/direct.js';` }],
        };
        mockTargetAndReferenceProject(targetProject, refProject);

        const queryResults = await providence(matchImportsQueryConfig, {
          targetProjectPaths: [targetProject.path],
          referenceProjectPaths: [refProject.path],
        });
        const queryResult = queryResults[0];
        expect(queryResult.queryOutput).eql([
          {
            exportSpecifier: {
              filePath: './direct.js',
              id: '[default]::./direct.js::ref',
              name: '[default]',
              project: 'ref',
            },
            matchesPerProject: [{ files: ['./index.js'], project: 'target' }],
          },
        ]);
      });

      it(`identifies all indirect (transitive) export specifiers consumed by target`, async () => {
        const refProject = {
          path: '/target/node_modules/ref',
          name: 'ref',
          files: [
            { file: './direct.js', code: `export function x() {};` },
            { file: './indirect.js', code: `export { x } from './direct.js';` },
          ],
        };
        const targetProject = {
          path: '/target',
          name: 'target',
          files: [{ file: './index.js', code: `import { x } from 'ref/indirect.js';` }],
        };
        mockTargetAndReferenceProject(targetProject, refProject);
        const queryResults = await providence(matchImportsQueryConfig, {
          targetProjectPaths: [targetProject.path],
          referenceProjectPaths: [refProject.path],
        });
        const queryResult = queryResults[0];
        expect(queryResult.queryOutput).eql([
          {
            exportSpecifier: {
              filePath: './indirect.js',
              id: 'x::./indirect.js::ref',
              name: 'x',
              project: 'ref',
            },
            matchesPerProject: [{ files: ['./index.js'], project: 'target' }],
          },
        ]);
      });

      it(`matches namespaced specifiers consumed by target`, async () => {
        const refProject = {
          path: '/target/node_modules/ref',
          name: 'ref',
          files: [
            { file: './namespaced.js', code: `export function x() {}; export function y() {};` },
          ],
        };
        const targetProject = {
          path: '/target',
          name: 'target',
          files: [{ file: './index.js', code: `import * as xy from 'ref/namespaced.js';` }],
        };
        mockTargetAndReferenceProject(targetProject, refProject);
        const queryResults = await providence(matchImportsQueryConfig, {
          targetProjectPaths: [targetProject.path],
          referenceProjectPaths: [refProject.path],
        });
        const queryResult = queryResults[0];
        expect(queryResult.queryOutput).eql([
          {
            exportSpecifier: {
              filePath: './namespaced.js',
              id: 'x::./namespaced.js::ref',
              name: 'x',
              project: 'ref',
            },
            matchesPerProject: [{ files: ['./index.js'], project: 'target' }],
          },
          {
            exportSpecifier: {
              filePath: './namespaced.js',
              id: 'y::./namespaced.js::ref',
              name: 'y',
              project: 'ref',
            },
            matchesPerProject: [{ files: ['./index.js'], project: 'target' }],
          },
          {
            exportSpecifier: {
              filePath: './namespaced.js',
              id: '[file]::./namespaced.js::ref',
              name: '[file]',
              project: 'ref',
            },
            matchesPerProject: [{ files: ['./index.js'], project: 'target' }],
          },
        ]);
      });

      describe('Inside small example project', () => {
        it(`identifies all direct export specifiers consumed by "importing-target-project"`, async () => {
          mockTargetAndReferenceProject(searchTargetProject, referenceProject);
          const queryResults = await providence(matchImportsQueryConfig, _providenceCfg);
          const queryResult = queryResults[0];
          expectedExportIdsDirect.forEach(directId => {
            expect(
              queryResult.queryOutput.find(
                exportMatchResult => exportMatchResult.exportSpecifier.id === directId,
              ),
            ).not.to.equal(undefined, `id '${directId}' not found`);
          });
        });

        it(`identifies all indirect export specifiers consumed by "importing-target-project"`, async () => {
          mockTargetAndReferenceProject(searchTargetProject, referenceProject);
          const queryResults = await providence(matchImportsQueryConfig, _providenceCfg);
          const queryResult = queryResults[0];
          expectedExportIdsIndirect.forEach(indirectId => {
            expect(
              queryResult.queryOutput.find(
                exportMatchResult => exportMatchResult.exportSpecifier.id === indirectId,
              ),
            ).not.to.equal(undefined, `id '${indirectId}' not found`);
          });
        });

        it(`matches namespaced specifiers consumed by "importing-target-project"`, async () => {
          mockTargetAndReferenceProject(searchTargetProject, referenceProject);
          const queryResults = await providence(matchImportsQueryConfig, _providenceCfg);
          const queryResult = queryResults[0];
          expectedExportIdsNamespaced.forEach(exportedSpecifierId => {
            expect(
              queryResult.queryOutput.find(
                exportMatchResult => exportMatchResult.exportSpecifier.id === exportedSpecifierId,
              ),
            ).not.to.equal(undefined, `id '${exportedSpecifierId}' not found`);
          });
        });
      });
    });

    describe('Matching', () => {
      it(`produces a list of all matches, sorted by project`, async () => {
        /**
         * N.B. output structure could be simplified, since there is no need to order results by
         * target project (there's only one target project per run).
         * For now we keep it, so integration with dashboard stays intact.
         * TODO:
         * - write tests for dashboard transform logic
         * - simplify output for match-* analyzers
         * - adjust dashboard transfrom logic
         */
        const refProject = {
          path: '/target/node_modules/ref',
          name: 'ref',
          files: [{ file: './direct.js', code: `export default function x() {};` }],
        };
        const targetProject = {
          path: '/target',
          name: 'target',
          files: [{ file: './index.js', code: `import myFn from 'ref/direct.js';` }],
        };
        mockTargetAndReferenceProject(targetProject, refProject);
        const queryResults = await providence(matchImportsQueryConfig, {
          targetProjectPaths: [targetProject.path],
          referenceProjectPaths: [refProject.path],
        });
        const queryResult = queryResults[0];
        expect(queryResult.queryOutput[0].matchesPerProject).eql([
          { files: ['./index.js'], project: 'target' },
        ]);
      });

      it(`correctly merges/dedupes double found exports`, async () => {
        const refProject = {
          path: '/target/node_modules/ref',
          name: 'ref',
          files: [{ file: './index.js', code: `export default function x() {};` }],
        };
        const targetProject = {
          path: '/target',
          name: 'target',
          files: [
            { file: './importDefault1.js', code: `import myFn1 from 'ref/index.js';` },
            { file: './importDefault2.js', code: `import myFn2 from 'ref/index.js';` },
          ],
        };
        mockTargetAndReferenceProject(targetProject, refProject);
        const queryResults = await providence(matchImportsQueryConfig, {
          targetProjectPaths: [targetProject.path],
          referenceProjectPaths: [refProject.path],
        });
        const queryResult = queryResults[0];
        expect(queryResult.queryOutput[0].exportSpecifier.name).to.equal('[default]');
        expect(queryResult.queryOutput[0].matchesPerProject).to.deep.equal([
          { files: ['./importDefault1.js', './importDefault2.js'], project: 'target' },
        ]);
      });

      it(`correctly merges/dedupes double found file matches when imported in different ways`, async () => {
        const refProject = {
          path: '/target/node_modules/ref',
          name: 'ref',
          files: [
            {
              file: './src/core.js',
              code: `
            export default function x() {};
            export class RefClass extends HTMLElement {}
            `,
            },
          ],
        };
        const targetProject = {
          path: '/target',
          name: 'target',
          files: [
            {
              file: './deep-imports.js',
              code: `
            import myFn1 from 'ref/src/core.js';
            import { RefClass } from 'ref/src/core.js';

            import * as all from 'ref/src/core.js';
            `,
            },
          ],
        };
        mockTargetAndReferenceProject(targetProject, refProject);
        const queryResults = await providence(matchImportsQueryConfig, {
          targetProjectPaths: [targetProject.path],
          referenceProjectPaths: [refProject.path],
        });
        const queryResult = queryResults[0];
        expect(queryResult.queryOutput[0].exportSpecifier.name).to.equal('[default]');
        expect(queryResult.queryOutput[0].matchesPerProject).to.deep.equal([
          { files: ['./deep-imports.js'], project: 'target' },
        ]);
        expect(queryResult.queryOutput[1].exportSpecifier.name).to.equal('RefClass');
        expect(queryResult.queryOutput[1].matchesPerProject).to.deep.equal([
          { files: ['./deep-imports.js'], project: 'target' },
        ]);
      });

      describe('Inside small example project', () => {
        it(`produces a list of all matches, sorted by project`, async () => {
          mockTargetAndReferenceProject(searchTargetProject, referenceProject);
          const queryResults = await providence(matchImportsQueryConfig, _providenceCfg);
          const queryResult = queryResults[0];

          expectedExportIdsDirect.forEach(targetId => {
            testMatchedEntry(targetId, queryResult, ['./target-src/direct-imports.js']);
          });

          expectedExportIdsIndirect.forEach(targetId => {
            testMatchedEntry(targetId, queryResult, ['./target-src/indirect-imports.js']);
          });
        });
      });
    });

    describe('Configuration', () => {
      it(`allows to provide results of FindExportsAnalyzer and FindImportsAnalyzer`, async () => {
        mockTargetAndReferenceProject(searchTargetProject, referenceProject);
        const findImportsResult = await new FindImportsAnalyzer().execute({
          targetProjectPath: searchTargetProject.path,
        });
        const findExportsResult = await new FindExportsAnalyzer().execute({
          targetProjectPath: referenceProject.path,
        });

        const matchImportsQueryConfigExt = await QueryService.getQueryConfigFromAnalyzer(
          MatchImportsAnalyzer,
          {
            targetProjectResult: findImportsResult,
            referenceProjectResult: findExportsResult,
          },
        );
        const queryResults = await providence(matchImportsQueryConfigExt, _providenceCfg);
        const queryResult = queryResults[0];

        expectedExportIdsDirect.forEach(targetId => {
          testMatchedEntry(targetId, queryResult, ['./target-src/direct-imports.js']);
        });

        expectedExportIdsIndirect.forEach(targetId => {
          testMatchedEntry(targetId, queryResult, ['./target-src/indirect-imports.js']);
        });
      });

      // TODO: Test this unwind functionality in a generic MatchAnalyzer test
      it.skip(`allows to provide results of FindExportsAnalyzer and FindImportsAnalyzer from external jsons`, async () => {});
    });
  });
}

runMatchImportsSuite({ parser: 'oxc' });
runMatchImportsSuite({ parser: 'swc' });
