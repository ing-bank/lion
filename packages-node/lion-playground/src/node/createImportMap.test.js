/* eslint-disable import/no-extraneous-dependencies */
import { globby } from 'globby';
import { expect } from 'chai';
import sinon from 'sinon';
import path from 'path';
// @ts-expect-error
import mockFs from 'mock-fs';
import { getPackageJson, resolveExportMap, createImportMap } from './createImportMap.js';

beforeEach(() => {
  mockFs({
    '/monoroot/packages/my-pkg': {
      'package.json':
        '{"name": "test-package", "exports": {"./index.js": "./src/index.js"}, "dependencies": {"dep-package": "1.0.0"} }',

      src: {
        'index.js': '',
        'a.js': '',
        'b.js': '',
      },
    },
    // node_modules hoisted in mono root
    '/monoroot/node_modules': {
      'dep-package': {
        'package.json': '{"name": "dep-package", "exports": {"./dep.js": "./lib/dep.js"} }',
        lib: {
          'dep.js': '',
        },
      },
    },
    '/monoroot/package.json': '{"name": "mono-root", "private": true}',
  });
});

afterEach(() => {
  sinon.restore();
  mockFs.restore();
});

describe('createImportMap.js', () => {
  describe('getPackageJson', () => {
    it('reads and parses package.json', async () => {
      const result = await getPackageJson('/monoroot/packages/my-pkg');
      expect(result).to.deep.equal({
        name: 'test-package',
        exports: {
          './index.js': './src/index.js',
        },
        dependencies: {
          'dep-package': '1.0.0',
        },
      });
    });

    it('falls back to package.mock.json if package.json is missing', async () => {
      mockFs({
        '/monoroot/packages/my-pkg': {
          'package.mock.json': '{"name": "mock-package"}',
        },
      });

      const result = await getPackageJson('/monoroot/packages/my-pkg');
      expect(result).to.deep.equal({ name: 'mock-package' });
    });

    it('returns undefined if both files are missing', async () => {
      mockFs({
        '/monoroot/packages/my-pkg': {},
      });

      const result = await getPackageJson('/monoroot/packages/my-pkg');
      // eslint-disable-next-line no-unused-expressions
      expect(result).to.be.undefined;
    });
  });

  describe('resolveExportMap', () => {
    it('resolves export map entries without wildcards', async () => {
      const exports = { './index.js': './src/index.js' };

      const result = await resolveExportMap(exports, {
        nodeResolveMode: 'default',
        packageRootPath: '/monoroot/packages/my-pkg',
      });

      expect(result).to.deep.equal([{ internal: './src/index.js', exposed: './index.js' }]);
    });

    it('resolves export map entries with wildcards', async () => {
      const exports = { './*.js': './src/*.js' };
      const files = await globby('src/*.js', { cwd: '/monoroot/packages/my-pkg' });

      const result = await resolveExportMap(exports, {
        nodeResolveMode: 'default',
        packageRootPath: '/monoroot/packages/my-pkg',
      });

      expect(result).to.deep.equal(
        files.map(file => ({
          internal: `./${file}`,
          exposed: `./${path.basename(file)}`,
        })),
      );
    });
  });

  describe('createImportMap', () => {
    it('creates an import map for a package', async () => {
      const result = await createImportMap(['/monoroot/packages/my-pkg'], { cwd: '/monoroot' });

      expect(result).to.deep.equal({
        'test-package': {
          './index.js': 'packages/my-pkg/src/index.js',
        },
      });
    });

    it('includes dependencies in the import map', async () => {
      const result = await createImportMap(['/monoroot/packages/my-pkg'], {
        packagesToTraceDepsFor: ['test-package'],
        cwd: '/monoroot',
      });

      expect(result).to.deep.equal({
        'test-package': {
          './index.js': 'packages/my-pkg/src/index.js',
        },
        'dep-package': {
          './dep.js': 'node_modules/dep-package/lib/dep.js',
        },
      });
    });

    it('handles packages without exports in package.json', async () => {
      mockFs({
        '/monoroot/packages/no-exports-pkg': {
          'package.json': '{"name": "no-exports-package"}',
          'index.js': '',
          'README.md': '',
        },
      });

      const result = await createImportMap(['/monoroot/packages/no-exports-pkg'], {
        cwd: '/monoroot',
      });

      expect(result).to.deep.equal({
        'no-exports-package': {
          './index.js': 'packages/no-exports-pkg/index.js',
        },
      });
    });
  });
});
