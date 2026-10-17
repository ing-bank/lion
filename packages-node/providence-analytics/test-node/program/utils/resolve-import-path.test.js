import fs from 'fs';
import os from 'os';
import path from 'path';

import { expect } from 'chai';
import { it } from 'mocha';
import {
  mockProject,
  restoreMockedProjects,
  mockTargetAndReferenceProject,
} from '#test-helpers/mock-project-helpers.js';
import { useMockFsResolver, useRealFsResolver } from '#test-helpers/mock-resolver.js';
import { resolveImportPath } from '#utils/resolve-import-path.js';
import { memoize } from '#utils/memoize.js';
import { toPosixPath } from '#utils/to-posix-path.js';

/**
 * @typedef {import('../../../test-helpers/mock-project-helpers.js').MockProject} MockProject
 * @typedef {import('../../../types/index.js').PathFromSystemRoot} PathFromSystemRoot
 */

describe('resolveImportPath', () => {
  beforeEach(() => {
    memoize.disableCaching();
  });
  afterEach(() => {
    memoize.restoreCaching();
    restoreMockedProjects();
  });

  it(`resolves file in same project`, async () => {
    mockProject(
      {
        './src/declarationOfMyClass.js': `
        export class MyClass extends HTMLElement {}
      `,
        './currentFile.js': `
        import { MyClass } from './src/declarationOfMyClass';
      `,
      },
      {
        projectName: 'my-project',
        projectPath: '/my/project',
      },
    );

    const foundPath = await resolveImportPath(
      './src/declarationOfMyClass',
      '/my/project/currentFile.js',
    );
    expect(foundPath).to.equal('/my/project/src/declarationOfMyClass.js');
  });

  it(`resolves file in different projects`, async () => {
    /** @type {MockProject} */
    const targetProject = {
      path: '/target/node_modules/ref',
      name: 'ref',
      files: [
        {
          file: './index.js',
          code: `
          export const x = 10;
          `,
        },
      ],
    };
    /** @type {MockProject} */
    const referenceProject = {
      path: '/target',
      name: 'target',
      files: [
        // This file contains all 'original' exported definitions
        {
          file: './a.js',
          code: `
            import { x } from 'ref';
          `,
        },
      ],
    };

    mockTargetAndReferenceProject(targetProject, referenceProject);

    const foundPath = await resolveImportPath('ref', '/target/a.js');
    expect(foundPath).to.equal('/target/node_modules/ref/index.js');
  });

  it(`resolves export maps`, async () => {
    /** @type {MockProject} */
    const targetProject = {
      path: '/target/node_modules/ref',
      name: 'ref',
      files: [
        {
          file: './packages/x/index.js',
          code: `
          export const x = 10;
          `,
        },
        {
          file: './package.json',
          code: JSON.stringify({
            name: 'ref',
            exports: {
              './x': './packages/x/index.js',
            },
          }),
        },
      ],
    };
    /** @type {MockProject} */
    const referenceProject = {
      path: '/target',
      name: 'target',
      files: [
        // This file contains all 'original' exported definitions
        {
          file: './a.js',
          code: `
            import { x } from 'ref/x';
          `,
        },
      ],
    };

    mockTargetAndReferenceProject(targetProject, referenceProject);

    const foundPath = await resolveImportPath('ref/x', '/target/a.js');
    expect(foundPath).to.equal('/target/node_modules/ref/packages/x/index.js');
  });

  it(`resolves native node modules`, async () => {
    mockProject(
      {
        './src/someFile.js': `
       import { readFile } from 'fs';

       export const x = readFile('/path/to/someOtherFile.js');
      `,
      },
      {
        projectName: 'my-project',
        projectPath: '/my/project',
      },
    );

    const foundPath = await resolveImportPath('fs', '/my/project/someFile.js');
    expect(foundPath).to.equal('[node-builtin]');
  });

  /**
   * All edge cases are covered by https://github.com/rollup/plugins/tree/master/packages/node-resolve/test
   */
});

/**
 * `resolveImportPath` returns posix style paths on every platform (`toPosixPath`), while the
 * expectations below are built with `path.join` and are therefore native - on Windows they would
 * compare `C:\Users\...` against `/Users/...`.
 * @param {string|null} expected
 * @returns {string|null}
 */
function asResolvedPath(expected) {
  if (!expected || expected === '[node-builtin]') {
    return expected;
  }
  return toPosixPath(expected);
}

/**
 * @param {string} pathFromSystemRoot
 * @returns {PathFromSystemRoot}
 */
function systemPath(pathFromSystemRoot) {
  return /** @type {PathFromSystemRoot} */ (pathFromSystemRoot);
}

describe('resolveImportPath with the oxc resolver (real file system)', () => {
  // The suites above run against mock-fs, which the native oxc-resolver cannot see; that is why
  // test-helpers swaps in a JS resolver. This block asserts the production resolver itself, and
  // that both resolvers agree on the same tree.
  /** @type {string} */
  let root;
  /** @type {string} */
  let projectPath;
  /** @type {string} */
  let targetPath;
  /** @type {{ importee: string; from: PathFromSystemRoot; expected: string|null }[]} */
  let cases;

  /**
   * @param {string} filePath
   * @param {string} code
   */
  function write(filePath, code) {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, code);
  }

  before(() => {
    root = fs.mkdtempSync(path.join(os.tmpdir(), 'providence-resolve-'));
    projectPath = path.join(root, 'my-project');
    targetPath = path.join(root, 'target');
    const modulesPath = path.join(targetPath, 'node_modules');

    write(path.join(projectPath, 'package.json'), '{"name":"my-project","version":"0.1.0"}');
    write(path.join(projectPath, 'src/declarationOfMyClass.js'), 'export class MyClass {}');
    write(path.join(projectPath, 'ext/thing.mjs'), 'export const t = 1;');
    write(path.join(projectPath, 'ext/folder/index.js'), 'export const f = 1;');

    write(path.join(targetPath, 'package.json'), '{"name":"target","version":"0.1.0"}');
    write(path.join(modulesPath, 'ref/package.json'), '{"name":"ref","version":"1.0.0"}');
    write(path.join(modulesPath, 'ref/index.js'), 'export const x = 10;');
    write(path.join(modulesPath, 'ref/x/index.js'), 'export const x = 10;');
    write(
      path.join(modulesPath, 'ref-exports/package.json'),
      JSON.stringify({
        name: 'ref-exports',
        version: '1.0.0',
        exports: { './x': './packages/x/index.js' },
      }),
    );
    write(path.join(modulesPath, 'ref-exports/packages/x/index.js'), 'export const x = 10;');
    write(
      path.join(modulesPath, 'esmonly/package.json'),
      JSON.stringify({
        name: 'esmonly',
        version: '1.0.0',
        exports: { '.': { import: './esm/index.js', require: './cjs/index.cjs' } },
      }),
    );
    write(path.join(modulesPath, 'esmonly/esm/index.js'), 'export const a = 1;');
    write(path.join(modulesPath, 'esmonly/cjs/index.cjs'), 'module.exports = {};');
    write(
      path.join(modulesPath, 'imponly/package.json'),
      JSON.stringify({
        name: 'imponly',
        version: '1.0.0',
        type: 'module',
        exports: { '.': { import: './only-import.js' } },
      }),
    );
    write(path.join(modulesPath, 'imponly/only-import.js'), 'export const a = 1;');
    write(
      path.join(modulesPath, 'dual/package.json'),
      JSON.stringify({
        name: 'dual',
        version: '1.0.0',
        main: './main.cjs',
        module: './esm.js',
      }),
    );
    write(path.join(modulesPath, 'dual/main.cjs'), 'module.exports = {};');
    write(path.join(modulesPath, 'dual/esm.js'), 'export const a = 1;');
    write(
      path.join(modulesPath, 'main-extless/package.json'),
      JSON.stringify({ name: 'main-extless', main: './lib/entry' }),
    );
    write(path.join(modulesPath, 'main-extless/lib/entry.js'), 'module.exports = 1;');

    const fromProject = systemPath(path.join(projectPath, 'currentFile.js'));
    const fromTarget = systemPath(path.join(targetPath, 'a.js'));
    cases = [
      {
        importee: './src/declarationOfMyClass',
        from: fromProject,
        expected: path.join(projectPath, 'src/declarationOfMyClass.js'),
      },
      {
        importee: './ext/thing',
        from: fromProject,
        expected: path.join(projectPath, 'ext/thing.mjs'),
      },
      {
        importee: './ext/folder',
        from: fromProject,
        expected: path.join(projectPath, 'ext/folder/index.js'),
      },
      { importee: 'fs', from: fromProject, expected: '[node-builtin]' },
      { importee: 'ref', from: fromTarget, expected: path.join(modulesPath, 'ref/index.js') },
      { importee: 'ref/x', from: fromTarget, expected: path.join(modulesPath, 'ref/x/index.js') },
      {
        importee: 'ref-exports/x',
        from: fromTarget,
        expected: path.join(modulesPath, 'ref-exports/packages/x/index.js'),
      },
      // ESM (`import`) condition wins over the CJS one
      {
        importee: 'esmonly',
        from: fromTarget,
        expected: path.join(modulesPath, 'esmonly/esm/index.js'),
      },
      // import-only `exports`, which a CommonJS resolver rejects
      {
        importee: 'imponly',
        from: fromTarget,
        expected: path.join(modulesPath, 'imponly/only-import.js'),
      },
      // `module` is preferred over `main`
      { importee: 'dual', from: fromTarget, expected: path.join(modulesPath, 'dual/esm.js') },
      {
        importee: 'main-extless',
        from: fromTarget,
        expected: path.join(modulesPath, 'main-extless/lib/entry.js'),
      },
      { importee: 'nope-not-there', from: fromTarget, expected: null },
    ];
  });

  after(() => {
    useMockFsResolver();
    fs.rmSync(root, { recursive: true, force: true });
  });

  beforeEach(() => {
    memoize.disableCaching();
    useRealFsResolver();
  });
  afterEach(() => {
    useMockFsResolver();
    memoize.restoreCaching();
  });

  it(`resolves the same paths as the JS resolver`, async () => {
    /** @type {(string|null)[]} */
    const withOxc = [];
    for (const testCase of cases) {
      withOxc.push(await resolveImportPath(testCase.importee, testCase.from));
    }

    useMockFsResolver();
    /** @type {(string|null)[]} */
    const withNodeResolve = [];
    for (const testCase of cases) {
      withNodeResolve.push(await resolveImportPath(testCase.importee, testCase.from));
    }

    expect(withOxc).to.deep.equal(withNodeResolve);
    expect(withOxc).to.deep.equal(cases.map(c => asResolvedPath(c.expected)));
  });

  it(`resolves relative and bare specifiers, exports maps and builtins`, async () => {
    for (const testCase of cases) {
      const found = await resolveImportPath(testCase.importee, testCase.from);
      expect(found, `${testCase.importee} from ${testCase.from}`).to.equal(
        asResolvedPath(testCase.expected),
      );
    }
  });

  it(`supports the modulePaths option`, async () => {
    const modulesPath = path.join(targetPath, 'node_modules');
    const expected = path.join(modulesPath, 'ref/index.js');

    const withOxc = await resolveImportPath('ref', systemPath(path.join(root, 'elsewhere/a.js')), {
      modulePaths: [modulesPath],
    });

    useMockFsResolver();
    const withNodeResolve = await resolveImportPath(
      'ref',
      systemPath(path.join(root, 'elsewhere/a.js')),
      {
        modulePaths: [modulesPath],
      },
    );

    expect(withOxc).to.equal(asResolvedPath(expected));
    expect(withNodeResolve).to.equal(asResolvedPath(expected));
  });
});
