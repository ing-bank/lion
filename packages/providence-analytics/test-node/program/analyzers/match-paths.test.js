const { expect } = require('chai');
const { providence } = require('../../../src/program/providence.js');
const { QueryService } = require('../../../src/program/services/QueryService.js');
const { InputDataService } = require('../../../src/program/services/InputDataService.js');
const {
  mockTargetAndReferenceProject,
  restoreMockedProjects,
} = require('../../../test-helpers/mock-project-helpers.js');
const {
  mockWriteToJson,
  restoreWriteToJson,
} = require('../../../test-helpers/mock-report-service-helpers.js');
const {
  suppressNonCriticalLogs,
  restoreSuppressNonCriticalLogs,
} = require('../../../test-helpers/mock-log-service-helpers.js');

const matchPathsQueryConfig = QueryService.getQueryConfigFromAnalyzer('match-paths');
const _providenceCfg = {
  targetProjectPaths: ['/importing/target/project'],
  referenceProjectPaths: ['/exporting/ref/project'],
};

describe('Analyzer "match-paths"', () => {
  const originalReferenceProjectPaths = InputDataService.referenceProjectPaths;
  const queryResults = [];
  const cacheDisabledInitialValue = QueryService.cacheDisabled;

  before(() => {
    QueryService.cacheDisabled = true;
    suppressNonCriticalLogs();
  });

  after(() => {
    QueryService.cacheDisabled = cacheDisabledInitialValue;
    restoreSuppressNonCriticalLogs();
  });

  beforeEach(() => {
    InputDataService.referenceProjectPaths = [];
    mockWriteToJson(queryResults);
  });

  afterEach(() => {
    InputDataService.referenceProjectPaths = originalReferenceProjectPaths;
    restoreWriteToJson(queryResults);
    restoreMockedProjects();
  });

  const referenceProject = {
    path: '/exporting/ref/project',
    name: 'exporting-ref-project',
    files: [
      {
        file: './ref-src/core.js',
        code: `
      // named specifier
      export class RefClass extends HTMLElement {};

      // default specifier
      export default class OtherClass {};
    `,
      },
      {
        file: './reexport.js',
        code: `
      export { RefClass as RefRenamedClass } from './ref-src/core.js';

      // re-exported default specifier
      import refConstImported from './ref-src/core.js';
      export default refConstImported;

      export const Mixin = superclass => class MyMixin extends superclass {}
    `,
      },
      {
        file: './importRefClass.js',
        code: `
      import { RefClass } from './ref-src/core.js';
    `,
      },
    ],
  };

  const searchTargetProject = {
    path: '/importing/target/project',
    name: 'importing-target-project',
    files: [
      {
        file: './target-src/ExtendRefRenamedClass.js',
        code: `
      // renamed import (indirect, needs transitivity check)
      import { RefRenamedClass } from 'exporting-ref-project/reexport.js';
      import defaultExport from 'exporting-ref-project/reexport.js';

      /**
       * This should result in:
       * {
       *   from: "RefRenamedClass", // should this point to same RefClass? For now, it doesn't
       *   to: "ExtendRefRenamedClass",
       *   paths: []
       * }
       * In other words, it won't end up in the Anlyzer output, because RefRenamedClass
       * is nowhere imported internally inside reference project.
       */
      export class ExtendRefRenamedClass extends RefRenamedClass {}
  `,
      },
      {
        file: './target-src/direct-imports.js',
        code: `
      // a direct named import
      import { RefClass } from 'exporting-ref-project/ref-src/core.js';

      // a direct default import
      import RefDefault from 'exporting-ref-project/reexport.js';

      /**
       * This should result in:
       * {
       *   from: "[default]",
       *   to: "ExtendRefClass",
       *   paths: [{ from: "./index.js", to: "./target-src/direct-imports.js" }]
       * }
       */
      export class ExtendRefClass extends RefClass {}

      /**
       * For result, see './index.js'
       */
      export class ExtendRefDefault extends RefDefault {}
  `,
      },
      {
        file: './index.js',
        code: `
      /**
       * This should result in:
       * {
       *   from: "[default]",
       *   to: "ExtendRefDefault",
       *   paths: [{ from: "./index.js", to: "./index.js" }]
       * }
       */
      export { ExtendRefDefault } from './target-src/direct-imports.js';
    `,
      },
    ],
  };

  describe('Variables', () => {
    const expectedMatches = [
      {
        name: 'RefRenamedClass',
        variable: {
          from: 'RefRenamedClass',
          to: 'ExtendRefRenamedClass',
          paths: [
            {
              from: './reexport.js',
              to: './target-src/ExtendRefRenamedClass.js',
            },
            {
              from: 'exporting-ref-project/reexport.js',
              to: './target-src/ExtendRefRenamedClass.js',
            },
          ],
        },
      },
      {
        name: '[default]',
        variable: {
          from: '[default]',
          to: 'ExtendRefDefault',
          paths: [
            {
              from: './reexport.js',
              to: './index.js',
            },
            {
              from: './ref-src/core.js',
              to: './index.js',
            },
            {
              from: 'exporting-ref-project/reexport.js',
              to: './index.js',
            },
            {
              from: 'exporting-ref-project/ref-src/core.js',
              to: './index.js',
            },
          ],
        },
      },
      {
        name: 'RefClass',
        variable: {
          from: 'RefClass',
          to: 'ExtendRefClass',
          paths: [
            {
              from: './ref-src/core.js',
              to: './target-src/direct-imports.js',
            },
            {
              from: 'exporting-ref-project/ref-src/core.js',
              to: './target-src/direct-imports.js',
            },
          ],
        },
      },
    ];

    it(`outputs an array result with from/to classes and paths`, async () => {
      mockTargetAndReferenceProject(searchTargetProject, referenceProject);
      await providence(matchPathsQueryConfig, _providenceCfg);
      const queryResult = queryResults[0];
      expect(queryResult.queryOutput).to.eql(expectedMatches);
    });

    describe('Features', () => {
      const refProj = {
        path: '/exporting/ref/project',
        name: 'reference-project',
        files: [
          {
            file: './index.js',
            code: `
            export class RefClass extends HTMLElement {}
          `,
          },
          {
            file: './src/importInternally.js',
            code: `
            import { RefClass } from '../index.js';
          `,
          },
        ],
      };

      const targetProj = {
        path: '/importing/target/project',
        name: 'importing-target-project',
        files: [
          {
            file: './target-src/TargetClass.js',
            // Indirect (via project root) imports
            code: `
            import { RefClass } from 'reference-project';

            export class TargetClass extends RefClass {}
          `,
          },
        ],
      };

      it(`identifies all "from" and "to" classes`, async () => {
        mockTargetAndReferenceProject(targetProj, refProj);
        await providence(matchPathsQueryConfig, _providenceCfg);
        const queryResult = queryResults[0];
        expect(queryResult.queryOutput[0].variable.from).to.equal('RefClass');
        expect(queryResult.queryOutput[0].variable.to).to.equal('TargetClass');
      });

      it(`identifies all "from" and "to" paths`, async () => {
        mockTargetAndReferenceProject(targetProj, refProj);
        await providence(matchPathsQueryConfig, _providenceCfg);
        const queryResult = queryResults[0];
        expect(queryResult.queryOutput[0].variable.paths[0]).to.eql({
          from: './index.js',
          to: './target-src/TargetClass.js',
        });
      });

      describe('"to" path of target project', () => {
        const targetProjWithMultipleExports = {
          ...targetProj,
          files: [
            ...targetProj.files,
            {
              file: './reexportFromRoot.js',
              code: `
              export { TargetClass } from './target-src/TargetClass.js';
            `,
            },
          ],
        };

        it(`gives back "to" path closest to root`, async () => {
          mockTargetAndReferenceProject(targetProjWithMultipleExports, refProj);
          await providence(matchPathsQueryConfig, _providenceCfg);
          const queryResult = queryResults[0];
          expect(queryResult.queryOutput[0].variable.paths[0]).to.eql({
            from: './index.js',
            to: './reexportFromRoot.js',
          });
        });

        it(`gives back "to" path that matches mainEntry if found`, async () => {
          const targetProjWithMultipleExportsAndMainEntry = {
            ...targetProjWithMultipleExports,
            files: [
              ...targetProjWithMultipleExports.files,
              {
                file: './target-src/mainEntry.js',
                code: `
              export { TargetClass } from './TargetClass.js';
            `,
              },
              {
                file: './package.json',
                code: `{
                "name": "${targetProjWithMultipleExports.name}",
                "main": "./target-src/mainEntry.js",
                "dependencies": {
                  "reference-project": "1.0.0"
                }
              }
            `,
              },
            ],
          };
          mockTargetAndReferenceProject(targetProjWithMultipleExportsAndMainEntry, refProj);
          await providence(matchPathsQueryConfig, _providenceCfg);
          const queryResult = queryResults[0];
          expect(queryResult.queryOutput[0].variable.paths[0]).to.eql({
            from: './index.js',
            to: './target-src/mainEntry.js',
          });
        });
      });

      it(`prefixes project paths`, async () => {
        mockTargetAndReferenceProject(targetProj, refProj);
        await providence(matchPathsQueryConfig, _providenceCfg);
        const queryResult = queryResults[0];
        const unprefixedPaths = queryResult.queryOutput[0].variable.paths[0];
        expect(unprefixedPaths).to.eql({ from: './index.js', to: './target-src/TargetClass.js' });
        expect(queryResult.queryOutput[0].variable.paths[1]).to.eql({
          from: `${refProj.name}/${unprefixedPaths.from.slice(2)}`,
          to: unprefixedPaths.to,
        });
      });

      it(`allows duplicate reference extensions (like "WolfRadio extends LionRadio" and
        "WolfChip extends LionRadio")`, async () => {
        const targetProjMultipleTargetExtensions = {
          ...targetProj,
          files: [
            {
              file: './target-src/TargetSomething.js',
              code: `
                import { RefClass } from 'reference-project';

                // in this case, we have TargetClass and TargetSomething => Class wins,
                // because of its name resemblance to RefClass
                export class TargetSomething extends RefClass {}
              `,
            },
            ...targetProj.files,
          ],
        };
        mockTargetAndReferenceProject(targetProjMultipleTargetExtensions, refProj);
        await providence(matchPathsQueryConfig, _providenceCfg);
        const queryResult = queryResults[0];
        expect(queryResult.queryOutput[0].variable.paths[0]).to.eql({
          from: './index.js',
          to: './target-src/TargetClass.js',
        });
        expect(queryResult.queryOutput[1].variable.paths[0]).to.eql({
          from: './index.js',
          to: './target-src/TargetSomething.js',
        });
      });
    });

    describe('Options', () => {
      const refProj = {
        path: '/exporting/ref/project',
        name: 'reference-project',
        files: [
          {
            file: './index.js',
            code: `
            export class RefClass extends HTMLElement {}
          `,
          },
          {
            file: './src/importInternally.js',
            code: `
            import { RefClass } from '../index.js';
          `,
          },
        ],
      };

      const targetProj = {
        path: '/importing/target/project',
        name: 'importing-target-project',
        files: [
          {
            file: './target-src/TargetClass.js',
            // Indirect (via project root) imports
            code: `
            import { RefClass } from 'reference-project';

            export class TargetClass extends RefClass {}
          `,
          },
        ],
      };

      it(`filters out duplicates based on prefixes (so "WolfRadio extends LionRadio"
        is kept, "WolfChip extends LionRadio" is removed)`, async () => {
        const targetProjMultipleTargetExtensions = {
          ...targetProj,
          files: [
            {
              file: './target-src/TargetSomething.js',
              code: `
                import { RefClass } from 'reference-project';

                // in this case, we have TargetClass and TargetSomething => Class wins,
                // because of its name resemblance to RefClass
                export class TargetSomething extends RefClass {}
              `,
            },
            ...targetProj.files,
          ],
        };
        mockTargetAndReferenceProject(targetProjMultipleTargetExtensions, refProj);
        const matchPathsQueryConfigFilter = QueryService.getQueryConfigFromAnalyzer('match-paths', {
          prefix: { from: 'ref', to: 'target' },
        });
        await providence(matchPathsQueryConfigFilter, _providenceCfg);
        const queryResult = queryResults[0];
        expect(queryResult.queryOutput[0].variable.paths[0]).to.eql({
          from: './index.js',
          to: './target-src/TargetClass.js',
        });
        expect(queryResult.queryOutput[1]).to.equal(undefined);
      });
    });
  });

  describe('Tags', () => {
    // eslint-disable-next-line no-shadow
    const referenceProject = {
      path: '/exporting/ref/project',
      name: 'exporting-ref-project',
      files: [
        {
          file: './customelementDefinitions.js',
          code: `
            // => need to be replaced to imports of target project
            export { El1, El2 } from './classDefinitions.js';

            customElements.define('el-1', El1);
            customElements.define('el-2', El2);
          `,
        },
        {
          file: './classDefinitions.js',
          code: `
            export class El1 extends HTMLElement {};
            export class El2 extends HTMLElement {};
          `,
        },
        {
          file: './import.js',
          code: `
            import './customelementDefinitions.js';
          `,
        },
      ],
    };

    // eslint-disable-next-line no-shadow
    const searchTargetProject = {
      path: '/importing/target/project',
      name: 'importing-target-project',
      files: [
        {
          file: './extendedCustomelementDefinitions.js',
          code: `
            import { ExtendedEl1 } from './extendedClassDefinitions.js';
            import { ExtendedEl2 } from './reexportedExtendedClassDefinitions.js';

            customElements.define('extended-el-1', ExtendedEl1);
            customElements.define('extended-el-2', ExtendedEl2);
          `,
        },
        {
          file: './extendedClassDefinitions.js',
          code: `
            export { El1, El2 } from 'exporting-ref-project/classDefinitions.js';

            export class ExtendedEl1 extends El1 {}
        `,
        },
        {
          file: './reexportedExtendedClassDefinitions.js',
          code: `
            export { El2 } from './extendedClassDefinitions.js';

            export class ExtendedEl2 extends El2 {}
          `,
        },
      ],
    };

    // 2. Extracted specifiers (by find-exports analyzer)
    const expectedMatches = [
      {
        from: 'el-1',
        to: 'extended-el-1',
        paths: [
          { from: './customelementDefinitions.js', to: './extendedCustomelementDefinitions.js' },
          {
            from: 'exporting-ref-project/customelementDefinitions.js',
            to: './extendedCustomelementDefinitions.js',
          },
        ],
      },
      {
        from: 'el-2',
        to: 'extended-el-2',
        paths: [
          { from: './customelementDefinitions.js', to: './extendedCustomelementDefinitions.js' },
          {
            from: 'exporting-ref-project/customelementDefinitions.js',
            to: './extendedCustomelementDefinitions.js',
          },
        ],
      },
    ];

    it(`outputs an array result with from/to tag names and paths`, async () => {
      mockTargetAndReferenceProject(searchTargetProject, referenceProject);
      await providence(matchPathsQueryConfig, _providenceCfg);
      const queryResult = queryResults[0];
      expect(queryResult.queryOutput[0].tag).to.eql(expectedMatches[0]);
      expect(queryResult.queryOutput[1].tag).to.eql(expectedMatches[1]);
    });

    describe('Features', () => {
      it(`identifies all "from" and "to" tagnames`, async () => {
        mockTargetAndReferenceProject(searchTargetProject, referenceProject);
        await providence(matchPathsQueryConfig, _providenceCfg);
        const queryResult = queryResults[0];
        expect(queryResult.queryOutput[0].tag.from).to.equal('el-1');
        expect(queryResult.queryOutput[0].tag.to).to.equal('extended-el-1');
      });

      it(`identifies all "from" and "to" paths`, async () => {
        mockTargetAndReferenceProject(searchTargetProject, referenceProject);
        await providence(matchPathsQueryConfig, _providenceCfg);
        const queryResult = queryResults[0];
        expect(queryResult.queryOutput[0].tag.paths[0]).to.eql({
          from: './customelementDefinitions.js',
          to: './extendedCustomelementDefinitions.js',
        });
      });

      it(`prefixes project paths`, async () => {
        mockTargetAndReferenceProject(searchTargetProject, referenceProject);
        await providence(matchPathsQueryConfig, _providenceCfg);
        const queryResult = queryResults[0];
        expect(queryResult.queryOutput[0].tag.paths[1]).to.eql({
          from: 'exporting-ref-project/customelementDefinitions.js',
          to: './extendedCustomelementDefinitions.js',
        });
      });
    });
  });

  describe('Full structure', () => {
    const referenceProjectFull = {
      ...referenceProject,
      files: [
        {
          file: './tag.js',
          code: `
            import { RefClass } from './ref-src/core.js';

            customElements.define('ref-class', RefClass);
          `,
        },
        ...referenceProject.files,
      ],
    };

    const searchTargetProjectFull = {
      ...searchTargetProject,
      files: [
        {
          file: './tag-extended.js',
          code: `
            import { ExtendRefClass } from './target-src/direct-imports';

            customElements.define('tag-extended', ExtendRefClass);
          `,
        },
        ...searchTargetProject.files,
      ],
    };

    const expectedMatchesFull = [
      {
        name: 'RefRenamedClass',
        variable: {
          from: 'RefRenamedClass',
          to: 'ExtendRefRenamedClass',
          paths: [
            {
              from: './reexport.js',
              to: './target-src/ExtendRefRenamedClass.js',
            },
            {
              from: 'exporting-ref-project/reexport.js',
              to: './target-src/ExtendRefRenamedClass.js',
            },
          ],
        },
      },
      {
        name: '[default]',
        variable: {
          from: '[default]',
          to: 'ExtendRefDefault',
          paths: [
            {
              from: './reexport.js',
              to: './index.js',
            },
            {
              from: './ref-src/core.js',
              to: './index.js',
            },
            {
              from: 'exporting-ref-project/reexport.js',
              to: './index.js',
            },
            {
              from: 'exporting-ref-project/ref-src/core.js',
              to: './index.js',
            },
          ],
        },
      },
      {
        name: 'RefClass',
        variable: {
          from: 'RefClass',
          to: 'ExtendRefClass',
          paths: [
            {
              from: './ref-src/core.js',
              to: './target-src/direct-imports.js',
            },
            {
              from: 'exporting-ref-project/ref-src/core.js',
              to: './target-src/direct-imports.js',
            },
          ],
        },
        tag: {
          from: 'ref-class',
          to: 'tag-extended',
          paths: [
            {
              from: './tag.js',
              to: './tag-extended.js',
            },
            {
              from: 'exporting-ref-project/tag.js',
              to: './tag-extended.js',
            },
          ],
        },
      },
    ];

    it(`outputs a "name", "variable" and "tag" entry`, async () => {
      mockTargetAndReferenceProject(searchTargetProjectFull, referenceProjectFull);
      await providence(matchPathsQueryConfig, _providenceCfg);
      const queryResult = queryResults[0];
      expect(queryResult.queryOutput).to.eql(expectedMatchesFull);
    });
  });
});
