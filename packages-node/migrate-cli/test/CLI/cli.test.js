import { expect } from 'chai';
import { setupTestCli } from '../../test-helpers/test-helpers.js';
import {
  createTempProjectFixture,
  restoreTempProjectFixture,
} from '../../test-helpers/mock-helpers.js';

// TODO: for some reason tests are failing until path is changed or ran in isolation
describe('cli upgrade function (using verifyPackageJson with workspaceMeta)', () => {
  after(() => {
    restoreTempProjectFixture();
  });

  it('works on monorepos', async () => {
    const monoRepo = {
      'upgrade/index.js': `
        import { executeJsCodeShiftTransforms } from '../../../../src/migrate-helpers/executeJsCodeShiftTransforms.js';
        import { verifyPackageJson } from '../../../../src/migrate-helpers/verifyPackageJson.js';

        export async function upgrade({ inputDir, jscsOpts }, workspaceMeta) {
          await verifyPackageJson(inputDir, {
            depsToCheck: [{ name: 'dep-foo', minVersion: '1.0.0' }],
            monoRoot: workspaceMeta.monoRoot,
          });

          await executeJsCodeShiftTransforms(
            inputDir,
            new URL('./jscodeshift/', import.meta.url),
            {...jscsOpts, includeTs: true},
            { workspaceMeta },
          );
        }

        export const _mockable = { upgrade };
      `,
      'upgrade/jscodeshift/write_-_cjs-export.cjs': `module.exports = async function transformerWrapper(file, api, options) {
        return 'export const updated = true';
      };`,
      'package.json': JSON.stringify({
        version: '1.0.0',
        type: 'module',
        name: 'mono-root',
        workspaces: ['packages/*'],
      }),
      // is considered, bc dep
      'packages/pkg-a/package.json': JSON.stringify({
        version: '1.0.0',
        type: 'module',
        name: 'pkg-a',
        dependencies: { 'dep-foo': '2.0.0' },
      }),
      'packages/pkg-a/file.js': ['export const updated = false'].join('\n'),
      'packages/pkg-a/tsfile.ts': ['export const updated = false'].join('\n'),
      // is considered, bc devDep
      'packages/pkg-b/package.json': JSON.stringify({
        version: '1.0.0',
        type: 'module',
        name: 'pkg-b',
        devDependencies: { 'dep-foo': '2.0.0' },
      }),
      'packages/pkg-b/file.js': ['export const updated = false'].join('\n'),
      // is not considered, bc no dep
      'packages/pkg-c/package.json': JSON.stringify({
        version: '1.0.0',
        type: 'module',
        name: 'pkg-c',
      }),
      'packages/pkg-c/file.js': ['export const updated = false'].join('\n'),
      // is not considered, bc no workspace
      'not-workspace/pkg-dpackage.json': JSON.stringify({
        type: 'module',
        name: 'pkg-d',
      }),
      'not-workspace/pkg-d/file.js': ['export const updated = false'].join('\n'),
    };

    const projectPath = await createTempProjectFixture(monoRepo, {
      projectName: 'monoRepo',
    });

    const { start, backupOrRestoreSource, restoreSource, readSource } = await setupTestCli(
      projectPath,
      {
        cliArgv: ['upgrade', '-t', '_test-via-url', '--include-ts'],
        testOptions: { captureLogs: true },
        cliOptions: { upgradeTaskUrl: `${projectPath}/upgrade/index.js` },
      },
    );
    await backupOrRestoreSource();
    await start();

    const pkgA = await readSource('packages/pkg-a/file.js');
    const pkgAts = await readSource('packages/pkg-a/tsfile.ts');
    const pkgB = await readSource('packages/pkg-b/file.js');
    const pkgC = await readSource('packages/pkg-c/file.js');
    const pkgD = await readSource('not-workspace/pkg-d/file.js');

    await restoreSource();

    expect(pkgA).to.equal('export const updated = true;');
    expect(pkgAts).to.equal('export const updated = true');
    expect(pkgB).to.equal('export const updated = true;');
    expect(pkgC).to.equal('export const updated = false;');
    expect(pkgD).to.equal('export const updated = false;');
  });

  it('works when monoroot has dep, but child has not', async () => {
    const monoRepo = {
      'upgrade/index.mjs': `
        import { executeJsCodeShiftTransforms } from '../../../../src/migrate-helpers/executeJsCodeShiftTransforms.js';
        import { verifyPackageJson } from '../../../../src/migrate-helpers/verifyPackageJson.js';

        export async function upgrade({ inputDir, jscsOpts }, workspaceMeta) {
          await verifyPackageJson(inputDir, {
            depsToCheck: [{ name: 'dep-foo', minVersion: '2.0.0' }],
            monoRoot: workspaceMeta.monoRoot,
          });

          await executeJsCodeShiftTransforms(
            inputDir,
            new URL('./jscodeshift/', import.meta.url),
            {...jscsOpts, includeTs: true},
            { workspaceMeta },
          );
        }

        export const _mockable = { upgrade };
      `,
      'upgrade/jscodeshift/write_-_cjs-export.cjs': `module.exports = async function transformerWrapper(file, api, options) {
        return 'export const updated = true';
      };`,
      'package.json': JSON.stringify({
        name: 'mono-root',
        devDependencies: { 'dep-foo': '2.0.0' },
        workspaces: ['packages/*'],
      }),
      // is considered, bc mono has dep
      'packages/pkg-a/package.json': JSON.stringify({
        name: 'pkg-a',
      }),
      'packages/pkg-a/file.js': ['export const updated = false'].join('\n'),
      'packages/pkg-a/tsfile.ts': ['export const updated = false'].join('\n'),
      // is considered, bc (dev)Dep (and mono has dep)
      'packages/pkg-b/package.json': JSON.stringify({
        name: 'pkg-b',
        devDependencies: { 'dep-foo': '2.0.0' },
      }),
      'packages/pkg-b/file.js': ['export const updated = false'].join('\n'),
      // is considered, bc mono has dep
      'not-workspace/pkg-dpackage.json': JSON.stringify({
        name: 'pkg-d',
      }),
      'not-workspace/pkg-d/file.js': ['export const updated = false'].join('\n'),
    };

    const projectPath = await createTempProjectFixture(monoRepo, {
      projectName: 'monoRepo2',
    });

    const { start, backupOrRestoreSource, restoreSource, readSource } = await setupTestCli(
      projectPath,
      {
        cliArgv: ['upgrade', '-t', '_test-via-url', '--include-ts'],
        testOptions: { captureLogs: true },
        cliOptions: { upgradeTaskUrl: `${projectPath}/upgrade/index.mjs` },
      },
    );
    await backupOrRestoreSource();
    await start();

    const pkgA = await readSource('packages/pkg-a/file.js');
    const pkgAts = await readSource('packages/pkg-a/tsfile.ts');
    const pkgB = await readSource('packages/pkg-b/file.js');
    const pkgD = await readSource('not-workspace/pkg-d/file.js');

    await restoreSource();

    expect(pkgA).to.equal('export const updated = true;');
    expect(pkgAts).to.equal('export const updated = true');
    expect(pkgB).to.equal('export const updated = true;');
    expect(pkgD).to.equal('export const updated = true;');
  });

  it('works with typescript files when includeTs is passed', async () => {
    const monoRepo = {
      'upgrade/index.mjs': `
        import { executeJsCodeShiftTransforms } from '../../../../src/migrate-helpers/executeJsCodeShiftTransforms.js';
        import { verifyPackageJson } from '../../../../src/migrate-helpers/verifyPackageJson.js';

        export async function upgrade({ inputDir, jscsOpts }, workspaceMeta) {
          await verifyPackageJson(inputDir, {
            depsToCheck: [{ name: 'dep-foo', minVersion: '2.0.0' }],
            monoRoot: workspaceMeta.monoRoot,
          });

          await executeJsCodeShiftTransforms(
            inputDir,
            new URL('./jscodeshift/', import.meta.url),
            {...jscsOpts, includeTs: true},
            { workspaceMeta },
          );
        }

        export const _mockable = { upgrade };
      `,
      'upgrade/jscodeshift/write_-_cjs-export.cjs': `module.exports = async function transformerWrapper(file, api, options) {
        return 'export const updated = true';
      };`,
      'package.json': JSON.stringify({
        name: 'mono-root',
        devDependencies: { 'dep-foo': '2.0.0' },
        workspaces: ['packages/*'],
      }),
      // is considered, bc mono has dep
      'packages/pkg-a/package.json': JSON.stringify({
        name: 'pkg-a',
      }),
      'packages/pkg-a/file.ts': ['export const updated = false'].join('\n'),
      // is considered, bc (dev)Dep (and mono has dep)
      'packages/pkg-b/package.json': JSON.stringify({
        name: 'pkg-b',
        devDependencies: { 'dep-foo': '2.0.0' },
      }),
      'packages/pkg-b/file.ts': ['export const updated = false'].join('\n'),
    };

    const projectPath = await createTempProjectFixture(monoRepo, {
      projectName: 'monoRepo3',
    });

    const { start, backupOrRestoreSource, restoreSource, readSource } = await setupTestCli(
      projectPath,
      {
        cliArgv: ['upgrade', '-t', '_test-via-url', '--include-ts'],
        testOptions: { captureLogs: true },
        cliOptions: { upgradeTaskUrl: `${projectPath}/upgrade/index.mjs` },
      },
    );
    await backupOrRestoreSource();
    await start();

    const pkgA = await readSource('packages/pkg-a/file.ts');
    const pkgB = await readSource('packages/pkg-b/file.ts');

    await restoreSource();

    expect(pkgA).to.equal('export const updated = true');
    expect(pkgB).to.equal('export const updated = true');
  });

  it('does not work with typescript files when includeTs is not passed', async () => {
    const monoRepo = {
      'upgrade/index.mjs': `
        import { executeJsCodeShiftTransforms } from '../../../../src/migrate-helpers/executeJsCodeShiftTransforms.js';
        import { verifyPackageJson } from '../../../../src/migrate-helpers/verifyPackageJson.js';

        export async function upgrade({ inputDir, jscsOpts }, workspaceMeta) {
          await verifyPackageJson(inputDir, {
            depsToCheck: [{ name: 'dep-foo', minVersion: '2.0.0' }],
            monoRoot: workspaceMeta.monoRoot,
          });

          await executeJsCodeShiftTransforms(
            inputDir,
            new URL('./jscodeshift/', import.meta.url),
            // no includeTs
            {...jscsOpts },
            { workspaceMeta },
          );
        }

        export const _mockable = { upgrade };
      `,
      'upgrade/jscodeshift/write_-_cjs-export.cjs': `module.exports = async function transformerWrapper(file, api, options) {
        return 'export const updated = true';
      };`,
      'package.json': JSON.stringify({
        name: 'mono-root',
        devDependencies: { 'dep-foo': '2.0.0' },
        workspaces: ['packages/*'],
      }),
      // is considered, bc mono has dep
      'packages/pkg-a/package.json': JSON.stringify({
        name: 'pkg-a',
      }),
      'packages/pkg-a/file.ts': ['export const updated = false'].join('\n'),
      // is considered, bc (dev)Dep (and mono has dep)
      'packages/pkg-b/package.json': JSON.stringify({
        name: 'pkg-b',
        devDependencies: { 'dep-foo': '2.0.0' },
      }),
      'packages/pkg-b/file.ts': ['export const updated = false'].join('\n'),
    };

    const projectPath = await createTempProjectFixture(monoRepo, {
      projectName: 'monoRepo4',
    });

    const { start, backupOrRestoreSource, restoreSource, readSource } = await setupTestCli(
      projectPath,
      {
        cliArgv: ['upgrade', '-t', '_test-via-url'],
        testOptions: { captureLogs: true },
        cliOptions: { upgradeTaskUrl: `${projectPath}/upgrade/index.mjs` },
      },
    );
    await backupOrRestoreSource();
    await start();

    const pkgA = await readSource('packages/pkg-a/file.ts');
    const pkgB = await readSource('packages/pkg-b/file.ts');

    await restoreSource();

    expect(pkgA).to.equal('export const updated = false');
    expect(pkgB).to.equal('export const updated = false');
  });
});
