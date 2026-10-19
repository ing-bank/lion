import assert from 'node:assert/strict';
import childProcess from 'node:child_process';
import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import module from 'node:module';
import path from 'node:path';
import test from 'node:test';
import url from 'node:url';
import util from 'node:util';
import { expandClosureInputs } from '@lion/awesome-phonenumber/scripts/closure-inputs.js';

const execFile = util.promisify(childProcess.execFile);
const packageRoot = url.fileURLToPath(new URL('../', import.meta.url));
const repoRoot = path.resolve(packageRoot, '../..');
const sourceRoot = path.join(repoRoot, 'packages-node/awesome-phonenumber');
const version = '7.9.0-tlouisse.libphonenumber-9.0.41';

test('Closure receives explicit production inputs with identical Windows and POSIX exclusions', async () => {
  const directory = path.join(sourceRoot, 'upstream/libphonenumber/javascript/i18n/phonenumbers');
  const prefix = 'build/libphonenumber/javascript/i18n/phonenumbers';
  const flags = [
    '--compilation_level=ADVANCED',
    '--js=closure/base.js',
    `--js=${prefix}/**.js`,
    `--js=!${prefix}/**_test.js`,
    `--js=!${prefix}/demo*.js`,
    `--js=!${prefix}/metadatafortesting.js`,
    `--js=!${prefix}/metadatalite.js`,
    `--js=!${prefix}/regioncodefortesting.js`,
    '--js=src/index.js',
  ];
  const forkScript = await fs.readFile(
    path.join(sourceRoot, 'upstream/awesome-phonenumber/build.sh'),
    'utf8',
  );
  const forkPatterns = [...forkScript.matchAll(/--js="([^"]+)"/g)].map(
    ([, pattern]) => `--js=${pattern}`,
  );
  assert.deepEqual(flags.slice(2, -1), forkPatterns);
  const entries = [
    ...(await fs.readdir(directory)),
    'demo.js',
    'demo-compiled.js',
    'extra_test.js',
  ].reverse();
  const readDirectory = async () => entries;
  const expected = [
    '--compilation_level=ADVANCED',
    '--js=closure/base.js',
    ...[
      'asyoutypeformatter.js',
      'metadata.js',
      'phonemetadata.pb.js',
      'phonenumber.pb.js',
      'phonenumberutil.js',
      'shortnumberinfo.js',
      'shortnumbermetadata.js',
    ].map(file => `--js=${prefix}/${file}`),
    '--js=src/index.js',
  ];
  assert.deepEqual(await expandClosureInputs(flags, sourceRoot, readDirectory), expected);
  assert.deepEqual(
    await expandClosureInputs(
      flags.map(flag => flag.replaceAll('/', '\\')),
      sourceRoot,
      readDirectory,
    ),
    expected,
  );
});
const legacyTsc = module
  .createRequire(path.join(repoRoot, 'test/typescript-legacy/package.json'))
  .resolve('typescript/bin/tsc');

async function runNpm(args, cwd) {
  const npmCli = process.env.npm_execpath;
  assert(npmCli, 'Run these packaging tests through npm so npm_execpath is available.');
  const { stdout } = await execFile(process.execPath, [npmCli, ...args], {
    cwd,
    maxBuffer: 10 * 1024 * 1024,
  });
  return stdout;
}

test(
  'npm pack rebuilds and ships a package-private phone library with no phone dependency',
  { timeout: 600000 },
  async () => {
    const fixture = await fs.mkdtemp(path.resolve(repoRoot, '../lion-phone-packaging-'));
    try {
      // Prepack must recreate missing assets; stale local bundles cannot satisfy the consumer.
      await fs.rm(path.join(packageRoot, 'generated/awesome-phonenumber'), {
        recursive: true,
        force: true,
      });
      const [packed] = JSON.parse(
        await runNpm(
          ['pack', '--workspace', '@lion/ui', '--json', '--pack-destination', fixture],
          repoRoot,
        ),
      );
      assert.deepEqual(packed.bundled, []);
      const files = new Set(packed.files.map(file => file.path));
      assert(
        ![...files].some(file => file.includes('restorePhoneUtilManagerLive')),
        'Live-state cleanup must remain test-only, including generated declarations',
      );
      assert(
        ![...files].some(file => /(^|\/)scripts\//.test(file)),
        'Build-only scripts must not be published',
      );
      const shipped = [
        'index.js',
        'index-esm.mjs',
        'index.d.ts',
        'lib/index.js',
        'package.json',
        'LICENSE',
        'LICENSE.libphonenumber',
        'LICENSE.closure-library',
        'provenance.json',
        'checksums.json',
      ];
      for (const file of shipped) {
        assert(files.has(`generated/awesome-phonenumber/${file}`), `Missing generated ${file}`);
      }
      assert(
        ![...files].some(
          file =>
            file.startsWith('node_modules/') || file.startsWith('vendor/') || file.endsWith('.tgz'),
        ),
      );
      await fs.writeFile(
        path.join(fixture, 'package.json'),
        JSON.stringify({ private: true, type: 'module' }),
      );
      await runNpm(
        ['install', '--no-audit', '--no-fund', path.join(fixture, packed.filename)],
        fixture,
      );
      const installedRoot = path.join(fixture, 'node_modules/@lion/ui');
      const helperDeclaration = await fs.readFile(
        path.join(
          installedRoot,
          'dist-types/components/input-tel/test-helpers/mockPhoneUtilManager.d.ts',
        ),
        'utf8',
      );
      assert.match(helperDeclaration, /function restorePhoneUtilManager\(\): void;/);
      for (const suite of [
        'components/input-tel/test-suites/LionInputTel.suite.js',
        'components/input-tel-dropdown/test-suites/LionInputTelDropdown.suite.js',
        'exports/input-tel-test-helpers.js',
      ]) {
        const source = await fs.readFile(path.join(installedRoot, suite), 'utf8');
        assert.doesNotMatch(source, /restorePhoneUtilManagerLive|loadedState/);
      }
      const manifest = JSON.parse(
        await fs.readFile(path.join(installedRoot, 'package.json'), 'utf8'),
      );
      for (const hook of ['preinstall', 'install', 'postinstall', 'prepare']) {
        assert.equal(manifest.scripts[hook], undefined, `${hook} must not need build-only scripts`);
      }
      for (const component of ['listbox', 'select-rich']) {
        const name = component === 'listbox' ? 'LionListbox' : 'LionSelectRich';
        const declaration = await fs.readFile(
          path.join(installedRoot, `dist-types/components/${component}/src/${name}.d.ts`),
          'utf8',
        );
        assert.match(declaration, /\n {4}get _focusableNode\(\)/);
        if (component === 'select-rich') assert.doesNotMatch(declaration, /get slots\(\)/);
      }
      assert.equal(manifest.dependencies['awesome-phonenumber'], undefined);
      assert.equal(manifest.bundledDependencies, undefined);
      assert.equal(manifest.bundleDependencies, undefined);
      assert.equal(
        manifest.imports['#awesome-phonenumber'].types,
        './generated/awesome-phonenumber/index.d.ts',
      );
      assert.equal(
        JSON.parse(await fs.readFile(path.join(fixture, 'package.json'), 'utf8')).overrides,
        undefined,
      );
      const generatedRoot = path.join(installedRoot, 'generated/awesome-phonenumber');
      for (const file of shipped) {
        assert.deepEqual(
          await fs.readFile(path.join(generatedRoot, file)),
          await fs.readFile(path.join(sourceRoot, 'dist', file)),
          `Installed build differs: ${file}`,
        );
      }
      for (const file of [
        'LICENSE',
        'LICENSE.libphonenumber',
        'LICENSE.closure-library',
        'index.d.ts',
      ]) {
        assert.deepEqual(
          await fs.readFile(path.join(generatedRoot, file)),
          await fs.readFile(path.join(sourceRoot, 'upstream/awesome-phonenumber', file)),
        );
      }
      const provenance = JSON.parse(
        await fs.readFile(path.join(generatedRoot, 'provenance.json'), 'utf8'),
      );
      assert.equal(provenance.version, version);
      assert.equal(provenance.sourceCommit, 'b4b6439136053624351f1c0fd8eb200ee867f37f');
      assert.equal(provenance.libphonenumberVersion, 'v9.0.41');
      const lock = JSON.parse(await fs.readFile(path.join(fixture, 'package-lock.json'), 'utf8'));
      assert(!Object.keys(lock.packages).some(file => file.endsWith('/awesome-phonenumber')));
      for (const file of [
        'phone-consumer.mjs',
        'phone-consumer.mts',
        'phone-consumer.cts',
        'phone-browser.mjs',
      ]) {
        await fs.copyFile(
          path.join(packageRoot, 'test-node/fixtures', file),
          path.join(installedRoot, file),
        );
      }
      await execFile(process.execPath, [path.join(installedRoot, 'phone-consumer.mjs')], {
        cwd: fixture,
      });
      const browserBundle = path.join(fixture, 'phone-browser-bundle');
      await execFile(
        process.execPath,
        [
          path.join(sourceRoot, 'scripts/check-browser-bundle.js'),
          path.join(installedRoot, 'phone-browser.mjs'),
          browserBundle,
        ],
        { cwd: fixture },
      );
      await execFile(process.execPath, [path.join(browserBundle, 'entry.mjs')], { cwd: fixture });
      await fs.writeFile(
        path.join(fixture, 'tsconfig.json'),
        JSON.stringify({
          compilerOptions: {
            target: 'ES2022',
            module: 'NodeNext',
            moduleResolution: 'NodeNext',
            strict: true,
            skipLibCheck: false,
            noEmit: true,
            types: [],
          },
          files: [
            'node_modules/@lion/ui/phone-consumer.mts',
            'node_modules/@lion/ui/phone-consumer.cts',
          ],
        }),
      );
      for (const tsc of [path.join(repoRoot, 'node_modules/typescript/bin/tsc'), legacyTsc]) {
        await execFile(process.execPath, [tsc, '-p', fixture], { cwd: fixture });
      }
    } finally {
      await fs.rm(fixture, { recursive: true, force: true });
    }
  },
);

test('source-only rebuild is deterministic', { timeout: 180000 }, async () => {
  const build = path.join(sourceRoot, 'scripts/build.js');
  const results = [];
  for (let attempt = 0; attempt < 2; attempt += 1) {
    // The build removes its staging directory and never reads a committed distribution.
    await execFile(process.execPath, [build], { cwd: sourceRoot, maxBuffer: 10 * 1024 * 1024 });
    const checksums = JSON.parse(
      await fs.readFile(path.join(sourceRoot, 'dist/checksums.json'), 'utf8'),
    );
    for (const [file, expected] of Object.entries(checksums)) {
      assert.equal(
        crypto
          .createHash('sha256')
          .update(await fs.readFile(path.join(sourceRoot, 'dist', file)))
          .digest('hex'),
        expected,
      );
    }
    results.push(checksums);
  }
  assert.deepEqual(results[0], results[1]);
});

test('source build rejects modified upstream inputs before compiling', async () => {
  const scratchRoot = path.join(repoRoot, '.tmp');
  await fs.mkdir(scratchRoot, { recursive: true });
  const fixture = await fs.mkdtemp(path.join(scratchRoot, 'phone-source-checksum-'));
  try {
    for (const file of [
      'scripts',
      'upstream',
      'source-checksums.json',
      'provenance.json',
      'package.json',
    ]) {
      await fs.cp(path.join(sourceRoot, file), path.join(fixture, file), { recursive: true });
    }
    await fs.appendFile(
      path.join(fixture, 'upstream/awesome-phonenumber/src/index.js'),
      '\n// modified\n',
    );
    await assert.rejects(
      execFile(process.execPath, [path.join(fixture, 'scripts/build.js')]),
      /Source checksum mismatch: awesome-phonenumber\/src\/index.js/,
    );
    await assert.rejects(fs.stat(path.join(fixture, 'dist')), { code: 'ENOENT' });
  } finally {
    await fs.rm(fixture, { recursive: true, force: true });
  }
});
