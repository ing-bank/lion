import { expect } from 'chai';
import { it } from 'mocha';
import { providence } from '../../../src/program/providence.js';
import { QueryService } from '../../../src/program/core/QueryService.js';
import { setupAnalyzerTest } from '../../../test-helpers/setup-analyzer-test.js';
import { mockProject, getEntry, getEntries } from '../../../test-helpers/mock-project-helpers.js';
import FindExportsAnalyzer from '../../../src/program/analyzers/find-exports.js';

/**
 * @typedef {import('../../../types/index.js').ProvidenceConfig} ProvidenceConfig
 */

setupAnalyzerTest();

describe('Analyzer "find-exports"', async () => {
  const findExportsQueryConfig = await QueryService.getQueryConfigFromAnalyzer(FindExportsAnalyzer);

  /** @type {Partial<ProvidenceConfig>} */
  const _providenceCfg = {
    targetProjectPaths: ['/fictional/project'], // defined in mockProject
  };

  describe('Export notations', () => {
    it(`supports "export const x = 0;" (named specifier)`, async () => {
      mockProject([`export const x = 0`]);
      const queryResults = await providence(findExportsQueryConfig, _providenceCfg);
      const firstResult = getEntry(queryResults[0]).result[0];

      expect(firstResult.exportSpecifiers).to.eql(['x']);
      expect(firstResult.source).to.be.undefined;
    });

    it(`supports "export default class X {};" (default export)`, async () => {
      mockProject([`export default class X {}`]);
      const queryResults = await providence(findExportsQueryConfig, _providenceCfg);
      const firstResult = getEntry(queryResults[0]).result[0];
      expect(firstResult.exportSpecifiers).to.eql(['[default]']);
      expect(firstResult.source).to.be.undefined;
    });

    it(`supports "export default x => x * 3;" (default function export)`, async () => {
      mockProject([`export default x => x * 3`]);
      const queryResults = await providence(findExportsQueryConfig, _providenceCfg);
      const firstResult = getEntry(queryResults[0]).result[0];

      expect(firstResult.exportSpecifiers).to.eql(['[default]']);
      expect(firstResult.source).to.be.undefined;
    });

    it(`supports "export {default as x} from 'y';" (default re-export)`, async () => {
      mockProject({
        './file-with-default-export.js': 'export default 1;',
        './file-with-default-re-export.js':
          "export { default as namedExport } from './file-with-default-export.js';",
      });

      const queryResults = await providence(findExportsQueryConfig, _providenceCfg);
      const firstResult = getEntry(queryResults[0]).result[0];
      expect(firstResult).to.eql({
        exportSpecifiers: ['[default]'],
        source: undefined,
        rootFileMap: [
          {
            currentFileSpecifier: '[default]',
            rootFile: { file: '[current]', specifier: '[default]' },
          },
        ],
      });

      const secondEntry = getEntry(queryResults[0], 1);
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

    it(`supports "import {x} from 'y'; export default x;" (named re-export as default)`, async () => {
      mockProject([`import {x} from 'y'; export default x;`]);
      const queryResults = await providence(findExportsQueryConfig, _providenceCfg);
      const firstEntry = getEntry(queryResults[0]);
      expect(firstEntry.result[0].exportSpecifiers.length).to.equal(1);
      expect(firstEntry.result[0].exportSpecifiers[0]).to.equal('[default]');
      expect(firstEntry.result[0].source).to.equal('y');
    });

    it(`supports "import x from 'y'; export default x" (default re-export as default)`, async () => {
      mockProject([`import x from 'y'; export default x;`]);
      const queryResults = await providence(findExportsQueryConfig, _providenceCfg);
      const firstEntry = getEntry(queryResults[0]);
      expect(firstEntry.result[0].exportSpecifiers.length).to.equal(1);
      expect(firstEntry.result[0].exportSpecifiers[0]).to.equal('[default]');
      expect(firstEntry.result[0].source).to.equal('y');
    });

    it(`supports "export { x } from 'my/source'" (re-export named specifier)`, async () => {
      mockProject([`export { x } from 'my/source'`]);
      const queryResults = await providence(findExportsQueryConfig, _providenceCfg);
      const firstEntry = getEntry(queryResults[0]);
      expect(firstEntry.result[0].exportSpecifiers.length).to.equal(1);
      expect(firstEntry.result[0].exportSpecifiers[0]).to.equal('x');
      expect(firstEntry.result[0].source).to.equal('my/source');
    });

    it(`supports [export { x as y } from 'my/source'] (re-export renamed specifier)`, async () => {
      mockProject([`export { x as y } from 'my/source'`]);
      const queryResults = await providence(findExportsQueryConfig, _providenceCfg);
      const firstEntry = getEntry(queryResults[0]);
      expect(firstEntry.result[0].exportSpecifiers.length).to.equal(1);
      expect(firstEntry.result[0].exportSpecifiers[0]).to.equal('y');
      expect(firstEntry.result[0].source).to.equal('my/source');
    });

    it(`supports [export styles from './styles.css' assert { type: "css" }] (import assertions)`, async () => {
      mockProject({
        './styles.css': '.block { display:block; };',
        './x.js': `export { styles as default } from './styles.css' assert { type: "css" };`,
      });
      const queryResults = await providence(findExportsQueryConfig, _providenceCfg);
      const firstEntry = getEntry(queryResults[0]);
      expect(firstEntry.result[0].exportSpecifiers.length).to.equal(1);
      expect(firstEntry.result[0].exportSpecifiers[0]).to.equal('[default]');
      expect(firstEntry.result[0].source).to.equal('./styles.css');
      expect(firstEntry.result[0].rootFileMap[0]).to.eql({
        currentFileSpecifier: '[default]',
        rootFile: {
          file: './styles.css',
          specifier: '[default]',
        },
      });
    });

    it(`supports [import styles from './styles.css' assert { type: "css" }; export default styles;] (import assertions)`, async () => {
      mockProject({
        './styles.css': '.block { display:block; };',
        './x.js': `import styles from './styles.css' assert { type: "css" }; export default styles;`,
      });
      const queryResults = await providence(findExportsQueryConfig, _providenceCfg);
      const firstEntry = getEntry(queryResults[0]);
      expect(firstEntry.result[0].exportSpecifiers.length).to.equal(1);
      expect(firstEntry.result[0].exportSpecifiers[0]).to.equal('[default]');
      expect(firstEntry.result[0].source).to.equal('./styles.css');
      expect(firstEntry.result[0].rootFileMap[0]).to.eql({
        currentFileSpecifier: '[default]',
        rootFile: {
          file: './styles.css',
          specifier: '[default]',
        },
      });
    });

    it(`stores meta info(local name) of renamed specifiers`, async () => {
      mockProject([`export { x as y } from 'my/source'`]);
      const queryResults = await providence(findExportsQueryConfig, _providenceCfg);
      const firstEntry = getEntry(queryResults[0]);
      // This info will be relevant later to identify 'transitive' relations
      expect(firstEntry.result[0].localMap).to.eql([
        {
          local: 'x',
          exported: 'y',
        },
      ]);
    });

    it(`supports "export { x, y } from 'my/source';" (multiple re-exported named specifiers)`, async () => {
      mockProject([`export { x, y } from 'my/source'`]);
      const queryResults = await providence(findExportsQueryConfig, _providenceCfg);
      const firstEntry = getEntry(queryResults[0]);
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
      const queryResults = await providence(findExportsQueryConfig, _providenceCfg);

      const firstEntry = getEntry(queryResults[0]);
      const secondEntry = getEntry(queryResults[0], 1);
      const thirdEntry = getEntry(queryResults[0], 2);

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

    it(`stores rootFileMap of an exported Identifier`, async () => {
      mockProject({
        './src/reexport.js': `
          // a direct default import
          import RefDefault from 'exporting-ref-project';

          export default RefDefault;
        `,
        './index.js': `
          import ExtendRefDefault from './src/reexport.js';

          export default ExtendRefDefault;
        `,
      });
      const queryResults = await providence(findExportsQueryConfig, _providenceCfg);
      const firstEntry = getEntry(queryResults[0]);

      expect(firstEntry.result[0].rootFileMap).to.eql([
        {
          currentFileSpecifier: '[default]',
          rootFile: {
            file: 'exporting-ref-project',
            specifier: '[default]',
          },
        },
      ]);
    });

    it(`correctly handles empty files`, async () => {
      // These can be encountered while scanning repos.. They should not break the code...
      mockProject([`// some comment here...`]);
      const queryResults = await providence(findExportsQueryConfig, _providenceCfg);
      const firstEntry = getEntry(queryResults[0]);
      expect(firstEntry.result[0].exportSpecifiers).to.eql(['[file]']);
      expect(firstEntry.result[0].source).to.equal(undefined);
    });
  });

  describe('Export variable types', () => {
    it(`classes`, async () => {
      mockProject([`export class X {}`]);
      const queryResults = await providence(findExportsQueryConfig, _providenceCfg);
      const firstEntry = getEntry(queryResults[0]);
      expect(firstEntry.result[0].exportSpecifiers.length).to.equal(1);
      expect(firstEntry.result[0].exportSpecifiers[0]).to.equal('X');
      expect(firstEntry.result[0].source).to.be.undefined;
    });

    it(`functions`, async () => {
      mockProject([`export function y() {}`]);
      const queryResults = await providence(findExportsQueryConfig, _providenceCfg);
      const firstEntry = getEntry(queryResults[0]);
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

      // const findExportsCategoryQueryObj = await QueryService.getQueryConfigFromAnalyzer(
      //   'find-exports',
      //   {
      //     metaConfig: {
      //       categoryConfig: [
      //         {
      //           project: 'my-project',
      //           categories: {
      //             fooCategory: localFilePath => localFilePath.startsWith('./foo'),
      //             barCategory: localFilePath => localFilePath.startsWith('./packages/bar'),
      //             testCategory: localFilePath => localFilePath.includes('/test/'),
      //           },
      //         },
      //       ],
      //     },
      //   },
      // );

      const queryResults = await providence(findExportsQueryConfig, _providenceCfg);
      const queryResult = queryResults[0];
      const [firstEntry, secondEntry, thirdEntry] = getEntries(queryResult);
      expect(firstEntry.meta.categories).to.eql(['fooCategory']);
      // not mutually exclusive...
      expect(secondEntry.meta.categories).to.eql(['barCategory', 'testCategory']);
      expect(thirdEntry.meta.categories).to.eql([]);
    });
  });
});
