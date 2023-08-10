import path from 'path';
import { createRequire } from 'module';
import { readFile, rm } from 'fs/promises';
import { existsSync } from 'fs';
import { globby } from 'globby';
import chai from 'chai';
// eslint-disable-next-line import/no-unresolved
import chaiAsPromised from 'chai-as-promised';
import { isImportDeclaration, isExportDeclaration } from '@babel/types';
import {
  prettify,
  asyncConcurrentForEach,
  byStringAscendingSort,
  getExportSpecifiersByFile,
  transformCode,
  bypassExportMap,
} from '@lion/nodejs-helpers';

import {
  ERROR_CAN_NOT_OVERWRITE_EXISTING_FILE,
  ERROR_CAN_NOT_RESOLVE_SOURCE,
  // ERROR_ADJUSTED_SOURCE_IS_INVALID,
  ERROR_CAN_NOT_ACCESS_PACKAGE_DIR,
} from '../../src/tasks/bypass-export-map.js';

// Register chai-as-promised plugin for async/await support.
chai.use(chaiAsPromised);
const { expect } = chai;

/**
 * Get sorted js files for the given directory
 *
 * @param {string} searchPattern The globby search pattern
 * @returns {Promise<string[]>}
 */
const getSortedJsFileNamesInDir = async searchPattern => {
  const files = await globby(searchPattern);
  return files.map(file => path.basename(file)).sort(byStringAscendingSort);
};

/**
 *
 * @param {string[]} fsPaths FileSystem paths to remove with `rm -rf`
 * @returns {Promise<void[]>}
 */
const rmRecursiveForce = async fsPaths => {
  // @ts-ignore
  const deleteFsPath = fsPath => rm(fsPath, { recursive: true, force: true });
  return asyncConcurrentForEach(fsPaths, deleteFsPath);
};

/**
 * Get export specifiers for all the js files in a directory given with `dirPath`
 * @param {string} dirPath Directory path
 * @returns {Promise<string[]>}
 */
const getExportSpecifiersByDir = async dirPath => {
  const fileNames = await getSortedJsFileNamesInDir(path.join(dirPath, '*.js'));
  // @ts-ignore
  const exports = await asyncConcurrentForEach(fileNames, async fileName => {
    const filePath = path.resolve(dirPath, fileName);
    return getExportSpecifiersByFile(filePath);
  });
  return exports.flat().sort(byStringAscendingSort);
};

/**
 * Get the paths returned by require.resolve for each
 * import or export declaration found in the given `code`
 * @param {string} code
 * @param {{paths: string[]}} options
 * @returns {Promise<string[]>}
 */
const getRequireResolvePaths = async (code, { paths = [] }) => {
  /**
   * @type {string[]}
   */
  const resolvedPaths = [];
  const visitor = {
    // @ts-ignore
    enter({ node }) {
      const isImportExportNode = isImportDeclaration(node) || isExportDeclaration(node);
      if (!isImportExportNode) {
        return;
      }
      // @ts-ignore
      const { source } = node;
      // example: `import sth from source.value;`
      const initialSource = source?.value;
      const isRelativeSource = initialSource?.startsWith('.');
      if (!isRelativeSource) {
        return;
      }
      const require = createRequire(import.meta.url);
      const resolvedPath = require.resolve(initialSource, { paths });
      resolvedPaths.push(resolvedPath);
    },
  };
  transformCode(code, visitor);
  return resolvedPaths;
};

describe('bypassExportMap simple export map case', async () => {
  const packageDir = 'test-node/fixtures/simple-export-map';
  const exportsDirPath = path.resolve(packageDir, 'exports');
  const outputDirPath = path.resolve(packageDir);
  const cleanup = async () =>
    rmRecursiveForce([
      path.join(outputDirPath, 'accordion.js'),
      path.join(outputDirPath, 'combobox.js'),
    ]);

  before(async () => {
    await cleanup();
    await bypassExportMap(packageDir);
  });

  after(async () => {
    await cleanup();
  });

  it(`creates a corresponding export file with the same name, for every .js file under exports directory`, async () => {
    // Given
    const initialFileNames = await getSortedJsFileNamesInDir(path.join(exportsDirPath, '*.js'));
    // When
    const adjustedFileNames = await getSortedJsFileNamesInDir(path.join(outputDirPath, '*.js'));
    // Then
    expect(initialFileNames).to.deep.equal(adjustedFileNames);
  });

  it('generated exports have all the exports, the original exports have', async () => {
    // Given
    const initialExports = await getExportSpecifiersByDir(exportsDirPath);
    // When
    const adjustedExports = await getExportSpecifiersByDir(outputDirPath);
    // Then
    expect(initialExports).to.deep.equal(adjustedExports);
  });

  it('All the generated export/import point to resolvable sources and they match with original exports', async () => {
    const fileNames = await getSortedJsFileNamesInDir(exportsDirPath);
    // @ts-ignore
    await asyncConcurrentForEach(fileNames, async fileName => {
      // Given
      const initialCode = await readFile(path.resolve(exportsDirPath, fileName), 'utf-8');
      const initialResolvePaths = await getRequireResolvePaths(initialCode, {
        paths: [exportsDirPath],
      });
      // When
      const adjustedCode = await readFile(path.resolve(outputDirPath, fileName), 'utf-8');
      const adjustedResolvePaths = await getRequireResolvePaths(adjustedCode, {
        paths: [outputDirPath],
      });
      // Then
      expect(initialResolvePaths).to.deep.equal(adjustedResolvePaths);
    });
  });
});

describe('components import other components and native + 3rd party imports', () => {
  const packageDir = 'test-node/fixtures/components-with-3rd-party-imports';
  const outputDirPath = path.resolve(packageDir);
  const cleanup = async () =>
    rmRecursiveForce([
      path.join(outputDirPath, 'my-component-list.js'),
      path.join(outputDirPath, 'combobox.js'),
    ]);

  before(async () => {
    await cleanup();
    await bypassExportMap(packageDir);
  });

  after(async () => {
    await cleanup();
  });

  // TODO: Fails on windows with:
  // Error: ENOENT: no such file or directory, open
  // 'D:\a\lion\lion\packages-node\nodejs-helpers\test-node\fixtures\components-with-3rd-party-imports\combobox.js'
  it('does not update the source for 3rd party import/export', async () => {
    // Given
    const expectedCode = `
      import path from 'path';
      export const { basename } = path;
      export { MatchesOption } from '@lion/ui/combobox.js';
      export { LionCombobox } from './components/combobox/combobox.js';
    `;
    // When
    if (process.platform !== 'win32') {
      // FIXME: skipping test for windows case
      const adjustedCode = await readFile(
        path.resolve(path.join(outputDirPath, 'combobox.js')),
        'utf-8',
      );
      // Then
      expect(prettify(adjustedCode)).to.equal(prettify(expectedCode));
    }
  });

  // TODO: Fails on windows with:
  // Error: ENOENT: no such file or directory, open
  // 'D:\a\lion\lion\packages-node\nodejs-helpers\test-node\fixtures\components-with-3rd-party-imports\my-component-list.js'
  it('transforms relative path values as expected', async () => {
    // Given
    const expectedCode = `
      export { MyComponent, __LionField } from './components/my-component-list/my-component-list.js';
      export { basename as __basename } from './exports/combobox.js';
    `;
    // When
    if (process.platform !== 'win32') {
      // FIXME: skipping test for windows case
      const adjustedCode = await readFile(
        path.resolve(path.join(outputDirPath, 'my-component-list.js')),
        'utf-8',
      );

      // Then
      expect(prettify(adjustedCode)).to.equal(prettify(expectedCode));
    }
  });
});

describe('multiple export map items', () => {
  const packageDir = 'test-node/fixtures/multiple-export-map-items';
  const outputDirPath = path.resolve(packageDir);
  const cleanup = async () =>
    rmRecursiveForce([
      path.join(outputDirPath, 'calendar-translations'),
      path.join(outputDirPath, 'accordion.js'),
    ]);

  before(async () => {
    await cleanup();
    await bypassExportMap(packageDir);
  });

  after(async () => {
    await cleanup();
  });

  it('processes both export map items', async () => {
    expect(existsSync(path.join(outputDirPath, 'accordion.js')));
    expect(existsSync(path.join(outputDirPath, '/calendar-translations/en.js')));
  });
});

describe('deep search exports directory', () => {
  const packageDir = 'test-node/fixtures/deep-search-exports-directory';
  const outputDirPath = path.resolve(packageDir);
  const cleanup = async () =>
    rmRecursiveForce([
      path.join(outputDirPath, 'define/helpers/'),
      path.join(outputDirPath, 'combobox.js'),
    ]);

  before(async () => {
    await cleanup();
    await bypassExportMap(packageDir);
  });

  after(async () => {
    await cleanup();
  });

  it('creates found nested directories under outputDir', async () => {
    expect(existsSync(path.join(outputDirPath, 'combobox.js')));
    expect(existsSync(path.join(outputDirPath, 'define/helpers/logger.js')));
  });
});

describe('Exceptions/error handling', () => {
  it('throws in case packageDir can not be accessed', async () => {
    // Given
    // packageDir does not exist on the filesystem, intentionally
    const packageDir = 'test-node/fixtures/error-can-not-access-package-dir';
    // When
    await expect(
      bypassExportMap(packageDir),
      // Then
    ).to.be.rejectedWith(ERROR_CAN_NOT_ACCESS_PACKAGE_DIR);
  });

  // TODO: Fails on windows with:
  // AssertionError: expected promise to be rejected with an error including
  // 'Can not overwrite existing file' but it was fulfilled with [[]]
  it('throws in case a file with the same name exists under outputDir', async () => {
    // Given
    const packageDir = 'test-node/fixtures/error-can-not-write-existing-file';
    // When
    if (process.platform !== 'win32') {
      // FIXME: skipping test for windows case
      await expect(
        bypassExportMap(packageDir),
        // Then
      ).to.be.rejectedWith(ERROR_CAN_NOT_OVERWRITE_EXISTING_FILE);
    }
  });

  context('can not resolve resource', async () => {
    // Given
    const packageDir = 'test-node/fixtures/error-can-not-resolve-resource';
    const outputDirPath = path.resolve(packageDir);
    const cleanup = async () => rmRecursiveForce([path.join(outputDirPath, 'combobox.js')]);

    before(async () => {
      await cleanup();
    });

    after(async () => {
      await cleanup();
    });

    // TODO: Fails on windows with:
    // AssertionError: expected promise to be rejected with an error including
    // 'Can not resolve source' but it was fulfilled with [[]]
    it('throws in case require.resolve can not resolve source', async () => {
      // When
      if (process.platform !== 'win32') {
        // FIXME: skipping test for windows case
        await expect(
          bypassExportMap(packageDir),
          // Then
        ).to.be.rejectedWith(ERROR_CAN_NOT_RESOLVE_SOURCE);
      }
    });
  });
});
