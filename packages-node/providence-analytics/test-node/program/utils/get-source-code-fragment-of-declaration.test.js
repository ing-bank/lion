import { expect } from 'chai';
import { it } from 'mocha';

import { getSourceCodeFragmentOfDeclaration } from '../../../src/program/utils/index.js';
import { mockProject } from '../../../test-helpers/mock-project-helpers.js';
import { memoize } from '../../../src/program/utils/memoize.js';

/**
 * @typedef {import('../../../types/index.js').PathFromSystemRoot} PathFromSystemRoot
 */

describe('getSourceCodeFragmentOfDeclaration', () => {
  const initialMemoizeCacheEnabled = memoize.isCacheEnabled;
  before(() => {
    memoize.disableCaching();
  });
  after(() => {
    memoize.restoreCaching(initialMemoizeCacheEnabled);
  });

  describe('Named specifiers', () => {
    it('finds source code for directly declared specifiers', async () => {
      const fakeFs = {
        '/my/proj/exports/file.js': 'export const x = 0;',
      };
      mockProject(fakeFs);

      const { sourceFragment } = await getSourceCodeFragmentOfDeclaration({
        filePath: /** @type {PathFromSystemRoot} */ ('/my/proj/exports/file.js'),
        exportedIdentifier: 'x',
        projectRootPath: /** @type {PathFromSystemRoot} */ ('/my/proj'),
      });

      expect(sourceFragment).to.equal('0');
    });

    it('finds source code for referenced specifiers', async () => {
      const fakeFs = {
        '/my/proj/exports/file.js': `
            const y = 0;
            export const x = y;
          `,
      };
      mockProject(fakeFs);

      const { sourceFragment } = await getSourceCodeFragmentOfDeclaration({
        filePath: '/my/proj/exports/file.js',
        exportedIdentifier: 'x',
        projectRootPath: '/my/proj',
      });

      expect(sourceFragment).to.equal('0');
    });

    it('finds source code for rereferenced specifiers', async () => {
      const fakeFs = {
        '/my/proj/exports/file.js': `
            const x = 88;
            const y = x;
            export const myIdentifier = y;
          `,
      };
      mockProject(fakeFs);

      const { sourceFragment } = await getSourceCodeFragmentOfDeclaration({
        filePath: '/my/proj/exports/file.js',
        exportedIdentifier: 'myIdentifier',
        projectRootPath: '/my/proj',
      });

      expect(sourceFragment).to.equal('88');
    });

    it('finds source code for imported referenced specifiers', async () => {
      const fakeFs = {
        '/my/proj/exports/file-1.js': `
        export const black59 = '#aaa';
        `,
        '/my/proj/exports/file-2.js': `
        import { black59 } from './file-1.js';
        export const black67 = black59;
        `,
      };
      mockProject(fakeFs);

      const { sourceFragment } = await getSourceCodeFragmentOfDeclaration({
        filePath: '/my/proj/exports/file-2.js',
        exportedIdentifier: 'black67',
        projectRootPath: '/my/proj',
      });

      expect(sourceFragment).to.equal("'#aaa'");
    });

    it('finds source code for (rereferenced) identifiers with expressions', async () => {
      const fakeFs = {
        '/my/proj/exports/file-1.js': `
        const x = 88 + 2;
        const y = x;
        `,
      };
      mockProject(fakeFs);

      const { sourceFragment } = await getSourceCodeFragmentOfDeclaration({
        filePath: '/my/proj/exports/file-1.js',
        exportedIdentifier: 'x',
        projectRootPath: '/my/proj',
      });

      expect(sourceFragment).to.equal('88 + 2');

      const { sourceFragment: sourceFragment2 } = await getSourceCodeFragmentOfDeclaration({
        filePath: '/my/proj/exports/file-1.js',
        exportedIdentifier: 'y',
        projectRootPath: '/my/proj',
      });

      expect(sourceFragment2).to.equal('x');
    });

    it('finds source code for (rereferenced) identifiers not in root scope', async () => {
      const fakeFs = {
        '/my/proj/exports/file-1.js': `
        function getColor() {
          const color = '#aaa';
          function innerScopeFn() {
            const gray = '#ccc';
            const black59 = color + 'eee';
            return black59;
          }
          return innerScopeFn();
        }
        `,
      };
      mockProject(fakeFs);

      const { sourceFragment } = await getSourceCodeFragmentOfDeclaration({
        filePath: '/my/proj/exports/file-1.js',
        exportedIdentifier: 'gray',
        projectRootPath: '/my/proj',
      });

      expect(sourceFragment).to.equal("'#ccc'");

      const { sourceFragment: sourceFragment2 } = await getSourceCodeFragmentOfDeclaration({
        filePath: '/my/proj/exports/file-1.js',
        exportedIdentifier: 'black59',
        projectRootPath: '/my/proj',
      });

      expect(sourceFragment2).to.equal("color + 'eee'");
    });

    describe('Different types of declarations', () => {
      it('handles class declarations', async () => {
        const fakeFs = {
          '/my/proj/exports/ajax.js': `
        import { AjaxClass as LionAjaxClass } from 'some-external-package';
        export class AjaxClass extends LionAjaxClass {}
        `,
        };
        mockProject(fakeFs);

        const { sourceFragment } = await getSourceCodeFragmentOfDeclaration({
          filePath: '/my/proj/exports/ajax.js',
          exportedIdentifier: 'AjaxClass',
          projectRootPath: '/my/proj',
        });

        expect(sourceFragment).to.equal('class AjaxClass extends LionAjaxClass {}');
      });

      it('handles function declarations', async () => {
        const fakeFs = {
          '/my/proj/exports/myFn.js': `
        export function myFn() {}
        `,
        };
        mockProject(fakeFs);

        const { sourceFragment } = await getSourceCodeFragmentOfDeclaration({
          filePath: '/my/proj/exports/myFn.js',
          exportedIdentifier: 'myFn',
          projectRootPath: '/my/proj',
        });

        expect(sourceFragment).to.equal('function myFn() {}');
      });
    });
  });

  describe('[default] specifiers', () => {
    it('finds source code for directly declared specifiers', async () => {
      const fakeFs = {
        '/my/proj/exports/file.js': 'export default class {};',
      };
      mockProject(fakeFs);

      const { sourceFragment } = await getSourceCodeFragmentOfDeclaration({
        filePath: '/my/proj/exports/file.js',
        exportedIdentifier: '[default]',
        projectRootPath: '/my/proj',
      });

      expect(sourceFragment).to.equal('class {}');
    });

    it('finds source code for referenced specifiers', async () => {
      const fakeFs = {
        '/my/proj/exports/file.js': `
              const myIdentifier = 0;
              export default myIdentifier;
            `,
      };
      mockProject(fakeFs);

      const { sourceFragment } = await getSourceCodeFragmentOfDeclaration({
        filePath: '/my/proj/exports/file.js',
        exportedIdentifier: '[default]',
        projectRootPath: '/my/proj',
      });

      expect(sourceFragment).to.equal('0');
    });

    it('finds source code for rereferenced specifiers', async () => {
      const fakeFs = {
        '/my/proj/exports/file.js': `
              const x = 88;
              const myIdentifier = x;
              export default myIdentifier;
            `,
      };
      mockProject(fakeFs);

      const { sourceFragment } = await getSourceCodeFragmentOfDeclaration({
        filePath: '/my/proj/exports/file.js',
        exportedIdentifier: '[default]',
        projectRootPath: '/my/proj',
      });

      expect(sourceFragment).to.equal('88');
    });

    describe('Different types of declarations', () => {
      it('handles class declarations', async () => {
        const fakeFs = {
          '/my/proj/exports/ajax.js': `
        import { AjaxClass as LionAjaxClass } from '../_legacy/ajax/index.js';

        export default class AjaxClass extends LionAjaxClass {}
        `,
        };
        mockProject(fakeFs);

        const { sourceFragment } = await getSourceCodeFragmentOfDeclaration({
          filePath: '/my/proj/exports/ajax.js',
          exportedIdentifier: '[default]',
          projectRootPath: '/my/proj',
        });

        expect(sourceFragment).to.equal('class AjaxClass extends LionAjaxClass {}');
      });

      it('handles function declarations', async () => {
        const fakeFs = {
          '/my/proj/exports/myFn.js': `
        export default function myFn() {}
        `,
        };
        mockProject(fakeFs);

        const { sourceFragment } = await getSourceCodeFragmentOfDeclaration({
          filePath: '/my/proj/exports/myFn.js',
          exportedIdentifier: '[default]',
          projectRootPath: '/my/proj',
        });

        expect(sourceFragment).to.equal('function myFn() {}');
      });
    });
  });

  describe('sourceNodeType', () => {
    it('returns correct node type for variable declarations', async () => {
      const fakeFs = {
        '/my/proj/exports/file.js': 'export const x = 42;',
      };
      mockProject(fakeFs);

      const { sourceNodeType, sourceFragment } = await getSourceCodeFragmentOfDeclaration({
        filePath: /** @type {PathFromSystemRoot} */ ('/my/proj/exports/file.js'),
        exportedIdentifier: 'x',
        projectRootPath: /** @type {PathFromSystemRoot} */ ('/my/proj'),
      });

      expect(sourceNodeType).to.equal('Literal');
      expect(sourceFragment).to.equal('42');
    });

    it('returns correct node type for string literals', async () => {
      const fakeFs = {
        '/my/proj/exports/file.js': 'export const greeting = "hello";',
      };
      mockProject(fakeFs);

      const { sourceNodeType, sourceFragment } = await getSourceCodeFragmentOfDeclaration({
        filePath: /** @type {PathFromSystemRoot} */ ('/my/proj/exports/file.js'),
        exportedIdentifier: 'greeting',
        projectRootPath: /** @type {PathFromSystemRoot} */ ('/my/proj'),
      });

      expect(sourceNodeType).to.equal('Literal');
      expect(sourceFragment).to.equal('"hello"');
    });

    it('returns correct node type for class declarations', async () => {
      const fakeFs = {
        '/my/proj/exports/file.js': 'export class MyClass { constructor() {} }',
      };
      mockProject(fakeFs);

      const { sourceNodeType, sourceFragment } = await getSourceCodeFragmentOfDeclaration({
        filePath: /** @type {PathFromSystemRoot} */ ('/my/proj/exports/file.js'),
        exportedIdentifier: 'MyClass',
        projectRootPath: /** @type {PathFromSystemRoot} */ ('/my/proj'),
      });

      expect(sourceNodeType).to.equal('ClassDeclaration');
      expect(sourceFragment).to.equal('class MyClass { constructor() {} }');
    });

    it('returns correct node type for function declarations', async () => {
      const fakeFs = {
        '/my/proj/exports/file.js': 'export function myFn() { return 123; }',
      };
      mockProject(fakeFs);

      const { sourceNodeType, sourceFragment } = await getSourceCodeFragmentOfDeclaration({
        filePath: /** @type {PathFromSystemRoot} */ ('/my/proj/exports/file.js'),
        exportedIdentifier: 'myFn',
        projectRootPath: /** @type {PathFromSystemRoot} */ ('/my/proj'),
      });

      expect(sourceNodeType).to.equal('FunctionDeclaration');
      expect(sourceFragment).to.equal('function myFn() { return 123; }');
    });

    it('returns correct node type for object expressions', async () => {
      const fakeFs = {
        '/my/proj/exports/file.js': 'export const config = { port: 3000, host: "localhost" };',
      };
      mockProject(fakeFs);

      const { sourceNodeType, sourceFragment } = await getSourceCodeFragmentOfDeclaration({
        filePath: /** @type {PathFromSystemRoot} */ ('/my/proj/exports/file.js'),
        exportedIdentifier: 'config',
        projectRootPath: /** @type {PathFromSystemRoot} */ ('/my/proj'),
      });

      expect(sourceNodeType).to.equal('ObjectExpression');
      expect(sourceFragment).to.equal('{ port: 3000, host: "localhost" }');
    });

    it('returns correct node type for array expressions', async () => {
      const fakeFs = {
        '/my/proj/exports/file.js': 'export const items = [1, 2, 3];',
      };
      mockProject(fakeFs);

      const { sourceNodeType, sourceFragment } = await getSourceCodeFragmentOfDeclaration({
        filePath: /** @type {PathFromSystemRoot} */ ('/my/proj/exports/file.js'),
        exportedIdentifier: 'items',
        projectRootPath: /** @type {PathFromSystemRoot} */ ('/my/proj'),
      });

      expect(sourceNodeType).to.equal('ArrayExpression');
      expect(sourceFragment).to.equal('[1, 2, 3]');
    });

    it('returns correct node type for arrow functions', async () => {
      const fakeFs = {
        '/my/proj/exports/file.js': 'export const add = (a, b) => a + b;',
      };
      mockProject(fakeFs);

      const { sourceNodeType, sourceFragment } = await getSourceCodeFragmentOfDeclaration({
        filePath: /** @type {PathFromSystemRoot} */ ('/my/proj/exports/file.js'),
        exportedIdentifier: 'add',
        projectRootPath: /** @type {PathFromSystemRoot} */ ('/my/proj'),
      });

      expect(sourceNodeType).to.equal('ArrowFunctionExpression');
      expect(sourceFragment).to.equal('(a, b) => a + b');
    });

    it('returns correct node type for identifiers', async () => {
      const fakeFs = {
        '/my/proj/exports/file.js': `
          const value = 42;
          export const exported = value;
        `,
      };
      mockProject(fakeFs);

      const { sourceNodeType, sourceFragment } = await getSourceCodeFragmentOfDeclaration({
        filePath: /** @type {PathFromSystemRoot} */ ('/my/proj/exports/file.js'),
        exportedIdentifier: 'exported',
        projectRootPath: /** @type {PathFromSystemRoot} */ ('/my/proj'),
      });

      expect(sourceNodeType).to.equal('Literal');
      expect(sourceFragment).to.equal('42');
    });
  });

  describe('Memory usage', () => {
    it('does not retain AST paths when sourceNodeType is returned', async () => {
      const fakeFs = {
        '/my/proj/exports/file.js': 'export const test = { value: 42 };',
      };
      mockProject(fakeFs);

      // Run multiple times to check for memory leaks
      const results = [];
      for (let iteration = 0; iteration < 10; iteration += 1) {
        const result = await getSourceCodeFragmentOfDeclaration({
          filePath: /** @type {PathFromSystemRoot} */ ('/my/proj/exports/file.js'),
          exportedIdentifier: 'test',
          projectRootPath: /** @type {PathFromSystemRoot} */ ('/my/proj'),
        });
        results.push(result);
      }

      // Verify all results contain sourceNodeType but not sourceNodePath
      results.forEach(result => {
        expect(result.sourceNodeType).to.equal('ObjectExpression');
        expect(result.sourceFragment).to.equal('{ value: 42 }');
        expect(result).to.not.have.property('sourceNodePath'); // No path should be retained
      });

      // Results should be primitive data only, no object references
      const firstResult = results[0];
      expect(typeof firstResult.sourceNodeType).to.equal('string');
      expect(typeof firstResult.sourceFragment).to.equal('string');
    });
  });
});
