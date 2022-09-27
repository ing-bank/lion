const { expect } = require('chai');
const { providence } = require('../../../src/program/providence.js');
const { QueryService } = require('../../../src/program/services/QueryService.js');
const {
  mockProject,
  restoreMockedProjects,
  getEntry,
} = require('../../../test-helpers/mock-project-helpers.js');
const {
  mockWriteToJson,
  restoreWriteToJson,
} = require('../../../test-helpers/mock-report-service-helpers.js');
const {
  suppressNonCriticalLogs,
  restoreSuppressNonCriticalLogs,
} = require('../../../test-helpers/mock-log-service-helpers.js');

const findImportsQueryConfig = QueryService.getQueryConfigFromAnalyzer('find-imports');
const _providenceCfg = {
  targetProjectPaths: ['/fictional/project'], // defined in mockProject
};

describe('Analyzer "find-imports"', () => {
  const queryResults = [];
  const cacheDisabledInitialValue = QueryService.cacheDisabled;

  before(() => {
    QueryService.cacheDisabled = true;
  });

  after(() => {
    QueryService.cacheDisabled = cacheDisabledInitialValue;
  });

  beforeEach(() => {
    suppressNonCriticalLogs();
    mockWriteToJson(queryResults);
  });

  afterEach(() => {
    restoreSuppressNonCriticalLogs();
    restoreMockedProjects();
    restoreWriteToJson(queryResults);
  });

  describe('Import notations', () => {
    it(`supports [import 'imported/source'] (no specifiers)`, async () => {
      mockProject([`import 'imported/source'`]);
      await providence(findImportsQueryConfig, _providenceCfg);
      const queryResult = queryResults[0];
      const firstEntry = getEntry(queryResult);
      expect(firstEntry.result[0].importSpecifiers).to.eql(['[file]']);
      expect(firstEntry.result[0].source).to.equal('imported/source');
    });

    it(`supports [import x from 'imported/source'] (default specifier)`, async () => {
      mockProject([`import x from 'imported/source'`]);
      await providence(findImportsQueryConfig, _providenceCfg);
      const queryResult = queryResults[0];
      const firstEntry = getEntry(queryResult);
      expect(firstEntry.result[0].importSpecifiers[0]).to.equal('[default]');
      expect(firstEntry.result[0].source).to.equal('imported/source');
    });

    it(`supports [import { x } from 'imported/source'] (named specifier)`, async () => {
      mockProject([`import { x } from 'imported/source'`]);
      await providence(findImportsQueryConfig, _providenceCfg);
      const queryResult = queryResults[0];
      const firstEntry = getEntry(queryResult);
      expect(firstEntry.result[0].importSpecifiers[0]).to.equal('x');
      expect(firstEntry.result[0].importSpecifiers[1]).to.equal(undefined);
      expect(firstEntry.result[0].source).to.equal('imported/source');
    });

    it(`supports [import { x, y } from 'imported/source'] (multiple named specifiers)`, async () => {
      mockProject([`import { x, y } from 'imported/source'`]);
      await providence(findImportsQueryConfig, _providenceCfg);
      const queryResult = queryResults[0];
      const firstEntry = getEntry(queryResult);
      expect(firstEntry.result[0].importSpecifiers[0]).to.equal('x');
      expect(firstEntry.result[0].importSpecifiers[1]).to.equal('y');
      expect(firstEntry.result[0].importSpecifiers[2]).to.equal(undefined);
      expect(firstEntry.result[0].source).to.equal('imported/source');
    });

    it(`supports [import x, { y, z } from 'imported/source'] (default and named specifiers)`, async () => {
      mockProject([`import x, { y, z } from 'imported/source'`]);
      await providence(findImportsQueryConfig, _providenceCfg);
      const queryResult = queryResults[0];
      const firstEntry = getEntry(queryResult);
      expect(firstEntry.result[0].importSpecifiers[0]).to.equal('[default]');
      expect(firstEntry.result[0].importSpecifiers[1]).to.equal('y');
      expect(firstEntry.result[0].importSpecifiers[2]).to.equal('z');
      expect(firstEntry.result[0].source).to.equal('imported/source');
    });

    it(`supports [import { x as y } from 'imported/source'] (renamed specifiers)`, async () => {
      mockProject([`import { x as y } from 'imported/source'`]);
      await providence(findImportsQueryConfig, _providenceCfg);
      const queryResult = queryResults[0];
      const firstEntry = getEntry(queryResult);
      expect(firstEntry.result[0].importSpecifiers[0]).to.equal('x');
    });

    it(`supports [import * as all from 'imported/source'] (namespace specifiers)`, async () => {
      mockProject([`import * as all from 'imported/source'`]);
      await providence(findImportsQueryConfig, _providenceCfg);
      const queryResult = queryResults[0];
      const firstEntry = getEntry(queryResult);
      expect(firstEntry.result[0].importSpecifiers[0]).to.equal('[*]');
    });

    describe('Reexports', () => {
      it(`supports [export { x } from 'imported/source'] (reexported named specifiers)`, async () => {
        mockProject([`export { x } from 'imported/source'`]);
        await providence(findImportsQueryConfig, _providenceCfg);
        const queryResult = queryResults[0];
        const firstEntry = getEntry(queryResult);
        expect(firstEntry.result[0].importSpecifiers[0]).to.equal('x');
      });

      it(`supports [export { x  as y } from 'imported/source'] (reexported renamed specifiers)`, async () => {
        mockProject([`export { x as y } from 'imported/source'`]);
        await providence(findImportsQueryConfig, _providenceCfg);
        const queryResult = queryResults[0];
        const firstEntry = getEntry(queryResult);
        expect(firstEntry.result[0].importSpecifiers[0]).to.equal('x');
      });

      // maybe in the future... needs experimental babel flag "exportDefaultFrom"
      it.skip(`supports [export x from 'imported/source'] (reexported default specifiers)`, async () => {
        mockProject([`export x from 'imported/source'`]);
        await providence(findImportsQueryConfig, _providenceCfg);
        const queryResult = queryResults[0];
        const firstEntry = getEntry(queryResult);
        expect(firstEntry.result[0].importSpecifiers[0]).to.equal('x');
      });

      it(`supports [export * as x from 'imported/source'] (reexported namespace specifiers)`, async () => {
        mockProject([`export * as x from 'imported/source'`]);
        await providence(findImportsQueryConfig, _providenceCfg);
        const queryResult = queryResults[0];
        const firstEntry = getEntry(queryResult);
        expect(firstEntry.result[0].importSpecifiers[0]).to.equal('[*]');
      });
    });

    // Currently only supported for find-exports. For now not needed...
    it.skip(`stores meta info(local name) of renamed specifiers`, async () => {
      mockProject([`import { x as y } from 'imported/source'`]);
      await providence(findImportsQueryConfig, _providenceCfg);
      const queryResult = queryResults[0];
      const firstEntry = getEntry(queryResult);
      // This info will be relevant later to identify transitive relations
      expect(firstEntry.result[0].localMap[0]).to.eql({
        local: 'y',
        imported: 'x',
      });
    });

    it(`supports [import('my/source')] (dynamic imports)`, async () => {
      mockProject([`import('my/source')`]);
      await providence(findImportsQueryConfig, _providenceCfg);
      const queryResult = queryResults[0];
      const firstEntry = getEntry(queryResult);
      expect(firstEntry.result[0].importSpecifiers[0]).to.equal('[default]');
      // TODO: somehow mark as dynamic??
      expect(firstEntry.result[0].source).to.equal('my/source');
    });

    // TODO: we can track [variable] down via trackdownId + getSourceCodeFragmentOfDeclaration
    it(`supports [import(pathReference)] (dynamic imports with variable source)`, async () => {
      mockProject([
        `
        const pathReference = 'my/source';
        import(pathReference);
        `,
      ]);
      await providence(findImportsQueryConfig, _providenceCfg);
      const queryResult = queryResults[0];
      const firstEntry = getEntry(queryResult);
      expect(firstEntry.result[0].importSpecifiers[0]).to.equal('[default]');
      // TODO: somehow mark as dynamic??
      expect(firstEntry.result[0].source).to.equal('[variable]');
    });

    // import styles from "./styles.css" assert { type: "css" };
    it(`supports [import styles from "@css/lib/styles.css" assert { type: "css" }] (import assertions)`, async () => {
      mockProject([`import styles from "@css/lib/styles.css" assert { type: "css" };`]);
      await providence(findImportsQueryConfig, _providenceCfg);
      const queryResult = queryResults[0];
      const firstEntry = getEntry(queryResult);
      console.log({ firstEntry });
      expect(firstEntry.result[0].importSpecifiers[0]).to.equal('[default]');
      expect(firstEntry.result[0].source).to.equal('@css/lib/styles.css');
      expect(firstEntry.result[0].assertionType).to.equal('css');
    });

    it(`supports [export styles from "@css/lib/styles.css" assert { type: "css" }] (import assertions)`, async () => {
      mockProject([`export styles from "@css/lib/styles.css" assert { type: "css" };`]);
      await providence(findImportsQueryConfig, _providenceCfg);
      const queryResult = queryResults[0];
      const firstEntry = getEntry(queryResult);
      console.log({ firstEntry });
      expect(firstEntry.result[0].importSpecifiers[0]).to.equal('[default]');
      expect(firstEntry.result[0].source).to.equal('@css/lib/styles.css');
      expect(firstEntry.result[0].assertionType).to.equal('css');
    });

    describe('Filter out false positives', () => {
      it(`doesn't support [object.import('my/source')] (import method members)`, async () => {
        mockProject([`object.import('my/source')`]);
        await providence(findImportsQueryConfig, {
          targetProjectPaths: ['/fictional/project'], // defined in mockProject
        });
        const queryResult = queryResults[0];
        const firstEntry = getEntry(queryResult);
        expect(firstEntry).to.equal(undefined);
      });
    });

    /**
     * Not in scope:
     * - dynamic imports containing variables
     * - tracking of specifier usage for default (dynamic or not) imports
     */
  });

  describe('Default post processing', () => {
    it('only stores external sources', async () => {
      mockProject([
        `
        import '@external/source';
        import 'external/source';
        import './internal/source';
        import '../internal/source';
        import '../../internal/source';
      `,
      ]);
      await providence(findImportsQueryConfig, { ..._providenceCfg });
      const queryResult = queryResults[0];
      const firstEntry = getEntry(queryResult);
      expect(firstEntry.result[0].importSpecifiers.length).to.equal(1);
      expect(firstEntry.result[0].source).to.equal('@external/source');
      expect(firstEntry.result[1].source).to.equal('external/source');
      expect(firstEntry.result[2]).to.equal(undefined);
    });

    it('normalizes source paths', async () => {
      const queryConfig = QueryService.getQueryConfigFromAnalyzer('find-imports', {
        keepInternalSources: true,
      });
      mockProject({
        './internal/file-imports.js': `
                                      import '@external/source';
                                      import 'external/source';
                                      import './source/x'; // auto resolve filename
                                      import '../'; // auto resolve root
                                    `,
        './internal/source/x.js': '',
        './index.js': '',
      });
      await providence(queryConfig, _providenceCfg);
      const queryResult = queryResults[0];
      const firstEntry = getEntry(queryResult);
      expect(firstEntry.result[0].importSpecifiers.length).to.equal(1);
      expect(firstEntry.result[0].normalizedSource).to.equal('@external/source');
      // expect(firstEntry.result[0].fullSource).to.equal('@external/source');
      expect(firstEntry.result[1].normalizedSource).to.equal('external/source');
      // expect(firstEntry.result[1].fullSource).to.equal('external/source');
      expect(firstEntry.result[2].normalizedSource).to.equal('./source/x.js');
      // expect(firstEntry.result[2].fullSource).to.equal('./internal/source/x.js');
      expect(firstEntry.result[3].normalizedSource).to.equal('../index.js');
      // expect(firstEntry.result[3].fullSource).to.equal('./index.js');
      expect(firstEntry.result[4]).to.equal(undefined);
    });
  });

  describe('Options', () => {
    it('"keepInternalSources"', async () => {
      const queryConfig = QueryService.getQueryConfigFromAnalyzer('find-imports', {
        keepInternalSources: true,
      });
      mockProject([
        `
        import '@external/source';
        import 'external/source';
        import './internal/source';
        import '../internal/source';
        import '../../internal/source';
      `,
      ]);
      await providence(queryConfig, _providenceCfg);
      const queryResult = queryResults[0];

      const firstEntry = getEntry(queryResult);
      expect(firstEntry.result[0].importSpecifiers.length).to.equal(1);
      expect(firstEntry.result[0].source).to.equal('@external/source');
      expect(firstEntry.result[1].source).to.equal('external/source');
      expect(firstEntry.result[2].source).to.equal('./internal/source');
      expect(firstEntry.result[3].source).to.equal('../internal/source');
      expect(firstEntry.result[4].source).to.equal('../../internal/source');
      expect(firstEntry.result[5]).to.equal(undefined);
    });

    // Post processors for whole result
    it('"keepOriginalSourceExtensions"', async () => {
      const queryConfig = QueryService.getQueryConfigFromAnalyzer('find-imports', {
        keepOriginalSourceExtensions: true,
      });
      mockProject([`import '@external/source.js'`, `import '@external/source';`]);
      await providence(queryConfig, _providenceCfg);
      const queryResult = queryResults[0];

      const firstEntry = getEntry(queryResult);
      const secondEntry = getEntry(queryResult, 1);

      expect(firstEntry.result[0].normalizedSource).to.equal('@external/source.js');
      expect(secondEntry.result[0].normalizedSource).to.equal('@external/source');
    });

    // TODO: currently disabled. Might become default later (increased readability of json reports)
    // but only without loss of information and once depending analyzers (match-imports and
    // match-subclasses) are made compatible.
    it.skip('"sortBySpecifier"', async () => {
      const queryConfig = QueryService.getQueryConfigFromAnalyzer('find-imports', {
        sortBySpecifier: true,
      });
      mockProject(
        [
          `import { x, y } from '@external/source.js'`,
          `import { x, y, z } from '@external/source.js'`,
        ],
        { filePaths: ['./file1.js', './file2.js'] },
      );
      await providence(queryConfig, _providenceCfg);
      const queryResult = queryResults[0];

      /**
       * Output will be in the format of:
       *
       * "queryOutput": [
       *  {
       *    "specifier": "LitElement",
       *    "source": "lion-based-ui/core",
       *    "id": "LitElement::lion-based-ui/core",
       *    "dependents": [
       *      "my-app-using-lion-based-ui/src/x.js",
       *      "my-app-using-lion-based-ui/src/y/z.js", *
       *    ...
       */

      expect(queryResult.queryOutput[0].specifier).to.equal('x');
      // Should be normalized source...?
      expect(queryResult.queryOutput[0].source).to.equal('@external/source.js');
      expect(queryResult.queryOutput[0].id).to.equal('x::@external/source.js');
      expect(queryResult.queryOutput[0].dependents).to.eql([
        'fictional-project/file1.js',
        'fictional-project/file2.js',
      ]);
    });
  });
});
