const { expect } = require('chai');
const { providence } = require('../../../src/program/providence.js');
const { QueryService } = require('../../../src/program/services/QueryService.js');
const {
  mockProject,
  restoreMockedProjects,
  getEntry,
  getEntries,
} = require('../../../test-helpers/mock-project-helpers.js');
const {
  mockWriteToJson,
  restoreWriteToJson,
} = require('../../../test-helpers/mock-report-service-helpers.js');
const {
  suppressNonCriticalLogs,
  restoreSuppressNonCriticalLogs,
} = require('../../../test-helpers/mock-log-service-helpers.js');

const findExportsQueryConfig = QueryService.getQueryConfigFromAnalyzer('find-exports');

describe('Analyzer "find-exports"', () => {
  const queryResults = [];
  const _providenceCfg = {
    targetProjectPaths: ['/fictional/project'], // defined in mockProject
  };

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
    restoreWriteToJson(queryResults);
    restoreMockedProjects();
  });

  describe('Export notations', () => {
    it(`supports [export const x = 0] (named specifier)`, async () => {
      mockProject([`export const x = 0`]);
      await providence(findExportsQueryConfig, _providenceCfg);
      const queryResult = queryResults[0];
      const firstEntry = getEntry(queryResult);
      expect(firstEntry.result[0].exportSpecifiers.length).to.equal(1);
      expect(firstEntry.result[0].exportSpecifiers[0]).to.equal('x');
      expect(firstEntry.result[0].source).to.be.undefined;
    });

    it(`supports [export default class X {}] (default export)`, async () => {
      mockProject([`export default class X {}`]);
      await providence(findExportsQueryConfig, _providenceCfg);
      const queryResult = queryResults[0];
      const firstEntry = getEntry(queryResult);
      expect(firstEntry.result[0].exportSpecifiers.length).to.equal(1);
      expect(firstEntry.result[0].exportSpecifiers[0]).to.equal('[default]');
      expect(firstEntry.result[0].source).to.equal(undefined);
    });

    it(`supports [export {default as x} from 'y'] (default re-export)`, async () => {
      mockProject({
        './file-with-default-export.js': 'export default 1;',
        './file-with-default-re-export.js':
          "export { default as namedExport } from './file-with-default-export.js';",
      });

      await providence(findExportsQueryConfig, _providenceCfg);
      const queryResult = queryResults[0];
      const firstEntry = getEntry(queryResult);
      expect(firstEntry.result[0]).to.eql({
        exportSpecifiers: ['[default]'],
        source: undefined,
        rootFileMap: [
          {
            currentFileSpecifier: '[default]',
            rootFile: { file: '[current]', specifier: '[default]' },
          },
        ],
      });

      const secondEntry = getEntry(queryResult, 1);
      expect(secondEntry.result[0].exportSpecifiers.length).to.equal(1);
      expect(secondEntry.result[0].exportSpecifiers[0]).to.equal('namedExport');
      expect(secondEntry.result[0].source).to.equal('./file-with-default-export.js');
      expect(secondEntry.result[0]).to.eql({
        exportSpecifiers: ['namedExport'],
        source: './file-with-default-export.js',
        localMap: [{ exported: 'namedExport', local: '[default]' }],
        normalizedSource: './file-with-default-export.js',
        rootFileMap: [
          {
            currentFileSpecifier: 'namedExport',
            rootFile: { file: './file-with-default-export.js', specifier: '[default]' },
          },
        ],
      });
    });

    it(`supports [export { x } from 'my/source'] (re-export named specifier)`, async () => {
      mockProject([`export { x } from 'my/source'`]);
      await providence(findExportsQueryConfig, _providenceCfg);
      const queryResult = queryResults[0];
      const firstEntry = getEntry(queryResult);
      expect(firstEntry.result[0].exportSpecifiers.length).to.equal(1);
      expect(firstEntry.result[0].exportSpecifiers[0]).to.equal('x');
      expect(firstEntry.result[0].source).to.equal('my/source');
    });

    it(`supports [export { x as y } from 'my/source'] (re-export renamed specifier)`, async () => {
      mockProject([`export { x as y } from 'my/source'`]);
      await providence(findExportsQueryConfig, _providenceCfg);
      const queryResult = queryResults[0];
      const firstEntry = getEntry(queryResult);
      expect(firstEntry.result[0].exportSpecifiers.length).to.equal(1);
      expect(firstEntry.result[0].exportSpecifiers[0]).to.equal('y');
      expect(firstEntry.result[0].source).to.equal('my/source');
    });

    it(`stores meta info(local name) of renamed specifiers`, async () => {
      mockProject([`export { x as y } from 'my/source'`]);
      await providence(findExportsQueryConfig, _providenceCfg);
      const queryResult = queryResults[0];
      const firstEntry = getEntry(queryResult);
      // This info will be relevant later to identify 'transitive' relations
      expect(firstEntry.result[0].localMap).to.eql([
        {
          local: 'x',
          exported: 'y',
        },
      ]);
    });

    it(`supports [export { x, y } from 'my/source'] (multiple re-exported named specifiers)`, async () => {
      mockProject([`export { x, y } from 'my/source'`]);
      await providence(findExportsQueryConfig, _providenceCfg);
      const queryResult = queryResults[0];
      const firstEntry = getEntry(queryResult);
      expect(firstEntry.result[0].exportSpecifiers.length).to.equal(2);
      expect(firstEntry.result[0].exportSpecifiers).to.eql(['x', 'y']);
      expect(firstEntry.result[0].source).to.equal('my/source');
    });

    it(`stores rootFileMap of an exported Identifier`, async () => {
      mockProject({
        './src/OriginalComp.js': `export class OriginalComp {}`,
        './src/inbetween.js': `export { OriginalComp as InBetweenComp } from './OriginalComp.js'`,
        './index.js': `export { InBetweenComp as MyComp } from './src/inbetween.js'`,
      });
      await providence(findExportsQueryConfig, _providenceCfg);
      const queryResult = queryResults[0];

      const firstEntry = getEntry(queryResult);
      const secondEntry = getEntry(queryResult, 1);
      const thirdEntry = getEntry(queryResult, 2);

      expect(firstEntry.result[0].rootFileMap).to.eql([
        {
          currentFileSpecifier: 'MyComp', // this is the local name in the file we track from
          rootFile: {
            file: './src/OriginalComp.js', // the file containing declaration
            specifier: 'OriginalComp', // the specifier that was exported in file
          },
        },
      ]);
      expect(secondEntry.result[0].rootFileMap).to.eql([
        {
          currentFileSpecifier: 'InBetweenComp',
          rootFile: {
            file: './src/OriginalComp.js',
            specifier: 'OriginalComp',
          },
        },
      ]);
      expect(thirdEntry.result[0].rootFileMap).to.eql([
        {
          currentFileSpecifier: 'OriginalComp',
          rootFile: {
            file: '[current]',
            specifier: 'OriginalComp',
          },
        },
      ]);
    });

    // TODO: myabe in the future: This experimental syntax requires enabling the parser plugin: 'exportDefaultFrom'
    it.skip(`stores rootFileMap of an exported Identifier`, async () => {
      mockProject({
        './src/reexport.js': `
          // a direct default import
          import RefDefault from 'exporting-ref-project';

          export RefDefault;
        `,
        './index.js': `
          export { ExtendRefDefault } from './src/reexport.js';
        `,
      });
      await providence(findExportsQueryConfig, _providenceCfg);
      const queryResult = queryResults[0];
      const firstEntry = getEntry(queryResult);

      expect(firstEntry.result[0].rootFileMap).to.eql([
        {
          currentFileSpecifier: 'ExtendRefDefault',
          rootFile: {
            file: 'exporting-ref-project',
            specifier: '[default]',
          },
        },
      ]);
    });
  });

  describe('Export variable types', () => {
    it(`classes`, async () => {
      mockProject([`export class X {}`]);
      await providence(findExportsQueryConfig, _providenceCfg);
      const queryResult = queryResults[0];
      const firstEntry = getEntry(queryResult);
      expect(firstEntry.result[0].exportSpecifiers.length).to.equal(1);
      expect(firstEntry.result[0].exportSpecifiers[0]).to.equal('X');
      expect(firstEntry.result[0].source).to.be.undefined;
    });

    it(`functions`, async () => {
      mockProject([`export function y() {}`]);
      await providence(findExportsQueryConfig, _providenceCfg);
      const queryResult = queryResults[0];
      const firstEntry = getEntry(queryResult);
      expect(firstEntry.result[0].exportSpecifiers.length).to.equal(1);
      expect(firstEntry.result[0].exportSpecifiers[0]).to.equal('y');
      expect(firstEntry.result[0].source).to.be.undefined;
    });

    // ...etc?
    // ...TODO: create custom hooks to store meta info about types etc.
  });

  describe('Default post processing', () => {
    // onlyInternalSources: false,
    // keepOriginalSourcePaths: false,
    // filterSpecifier: null,
  });

  describe('Options', () => {
    // TODO: Move to dashboard
    it.skip(`"metaConfig.categoryConfig"`, async () => {
      mockProject(
        [
          `export const foo = null`, // firstEntry
          `export const bar = null`, // secondEntry
          `export const baz = null`, // thirdEntry
        ],
        {
          projectName: 'my-project',
          filePaths: ['./foo.js', './packages/bar/test/bar.test.js', './temp/baz.js'],
        },
      );

      const findExportsCategoryQueryObj = QueryService.getQueryConfigFromAnalyzer('find-exports', {
        metaConfig: {
          categoryConfig: [
            {
              project: 'my-project',
              categories: {
                fooCategory: localFilePath => localFilePath.startsWith('./foo'),
                barCategory: localFilePath => localFilePath.startsWith('./packages/bar'),
                testCategory: localFilePath => localFilePath.includes('/test/'),
              },
            },
          ],
        },
      });

      await providence(findExportsCategoryQueryObj, _providenceCfg);
      const queryResult = queryResults[0];
      const [firstEntry, secondEntry, thirdEntry] = getEntries(queryResult);
      expect(firstEntry.meta.categories).to.eql(['fooCategory']);
      // not mutually exclusive...
      expect(secondEntry.meta.categories).to.eql(['barCategory', 'testCategory']);
      expect(thirdEntry.meta.categories).to.eql([]);
    });
  });
});
