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
        });

        expect(sourceFragment).to.equal('function myFn() {}');
      });
    });
  });
});
