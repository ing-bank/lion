const { expect } = require('chai');
const { mock } = require('../../../test-helpers/mock-project-helpers.js');
const { getSourceCodeFragmentOfDeclaration } = require('../../../src/program/utils/index.js');

describe('getSourceCodeFragmentOfDeclaration', () => {
  describe('Named specifiers', () => {
    it('finds source code for directly declared specifiers', async () => {
      const fakeFs = {
        '/my/proj/exports/file.js': 'export const x = 0;',
      };
      mock(fakeFs);

      const { sourceFragment } = await getSourceCodeFragmentOfDeclaration({
        filePath: '/my/proj/exports/file.js',
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
      mock(fakeFs);

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
      mock(fakeFs);

      const { sourceFragment } = await getSourceCodeFragmentOfDeclaration({
        filePath: '/my/proj/exports/file.js',
        exportedIdentifier: 'myIdentifier',
      });

      expect(sourceFragment).to.equal('88');
    });

    describe('Different types of declarations', () => {
      it('handles class declarations', async () => {
        const fakeFs = {
          '/my/proj/exports/ajax.js': `
        import { AjaxClass as LionAjaxClass } from '../_legacy/ajax/index.js';

        export class AjaxClass extends LionAjaxClass {}
        `,
        };
        mock(fakeFs);

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
        mock(fakeFs);

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
      mock(fakeFs);

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
      mock(fakeFs);

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
      mock(fakeFs);

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
        mock(fakeFs);

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
        mock(fakeFs);

        const { sourceFragment } = await getSourceCodeFragmentOfDeclaration({
          filePath: '/my/proj/exports/myFn.js',
          exportedIdentifier: '[default]',
        });

        expect(sourceFragment).to.equal('function myFn() {}');
      });
    });
  });
});
