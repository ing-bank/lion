import assert from 'node:assert/strict';
import childProcess from 'node:child_process';
import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import module from 'node:module';
import path from 'node:path';
import url from 'node:url';
import util from 'node:util';
import { rollup } from 'rollup';
import commonjs from '@rollup/plugin-commonjs';
import { verifySources } from './verify-sources.js';
import { expandClosureInputs } from './closure-inputs.js';

const execFile = util.promisify(childProcess.execFile);
const root = url.fileURLToPath(new URL('../', import.meta.url));
const require = module.createRequire(import.meta.url);
const fork = path.join(root, 'upstream/awesome-phonenumber');
const stage = path.join(root, 'build/awesome-phonenumber');
const dist = path.join(root, 'dist');
const provenance = await verifySources();
for (const [name, version] of [
  ['google-closure-compiler', provenance.closureCompilerVersion],
  ['google-closure-library', provenance.closureLibraryVersion],
  ['rollup', provenance.rollupVersion],
  ['@rollup/plugin-commonjs', provenance.commonjsPluginVersion],
]) {
  const manifestPath =
    name === '@rollup/plugin-commonjs'
      ? path.resolve(path.dirname(require.resolve(name)), '../../package.json')
      : require.resolve(`${name}/package.json`);
  const manifest = JSON.parse(await fs.readFile(manifestPath, 'utf8'));
  assert.equal(manifest.version, version, `Unexpected ${name} version`);
}

await fs.rm(stage, { recursive: true, force: true });
await fs.mkdir(path.join(stage, 'lib'), { recursive: true });
await fs.cp(path.join(fork, 'src'), path.join(stage, 'src'), { recursive: true });
await fs.copyFile(path.join(fork, 'index.js'), path.join(stage, 'index.js'));
await fs.cp(
  path.join(root, 'upstream/libphonenumber/javascript'),
  path.join(stage, 'build/libphonenumber/javascript'),
  { recursive: true },
);

// Preserve the fork's exact Closure inputs/options, without its shell/download/Gulp wrappers.
const buildScript = await fs.readFile(path.join(fork, 'build.sh'), 'utf8');
const closureLibrary = path.dirname(require.resolve('google-closure-library/package.json'));
const flags = [...buildScript.matchAll(/^\s+(--[^\r\n]+?)(?:\s+\\)?$/gm)].map(([, flag]) =>
  flag
    // eslint-disable-next-line no-template-curly-in-string
    .replaceAll('${COMPILATION_LEVEL}', 'ADVANCED')
    // eslint-disable-next-line no-template-curly-in-string
    .replaceAll('${CLOSURE_LIBRARY_DIR}', closureLibrary.replaceAll(path.sep, '/'))
    .replaceAll('"', ''),
);
assert(flags.includes('--compilation_level=ADVANCED'));
assert(flags.includes('--js_output_file=lib/index.js'));
const compiler = path.join(
  path.dirname(require.resolve('google-closure-compiler/package.json')),
  'cli.js',
);
const compilerVersion = await execFile(process.execPath, [compiler, '--version']);
assert(
  compilerVersion.stdout
    .split(/\r?\n/)
    .includes(`Version: v${provenance.closureCompilerVersion.split('.')[0]}`),
  `Unexpected compiler binary: ${compilerVersion.stdout}`,
);
const inputs = await expandClosureInputs(flags, stage);
const compiled = await execFile(process.execPath, [compiler, ...inputs], {
  cwd: stage,
  maxBuffer: 10 * 1024 * 1024,
});
if (compiled.stderr) process.stderr.write(compiled.stderr);

// Equivalent to the fork's scripts/rewrite.ts and build:esm:rewrite steps.
const compiledPath = path.join(stage, 'lib/index.js');
await fs.writeFile(
  compiledPath,
  (await fs.readFile(compiledPath, 'utf8')).replace(/\bconst /g, 'var '),
);
const bundle = await rollup({
  input: path.join(stage, 'index.js'),
  strictDeprecations: true,
  plugins: [commonjs()],
});
try {
  await bundle.write({
    file: path.join(stage, 'build/index-esm.js'),
    format: 'es',
    interop: 'auto',
    exports: 'named',
    esModule: true,
  });
} finally {
  await bundle.close();
}
const esm = (await fs.readFile(path.join(stage, 'build/index-esm.js'), 'utf8'))
  .split('\n')
  .filter(line => line !== 'export { index as default };')
  .join('\n');
const outro = await fs.readFile(path.join(fork, 'src/esm-outro.js'), 'utf8');

await fs.rm(dist, { recursive: true, force: true });
await fs.mkdir(path.join(dist, 'lib'), { recursive: true });
await fs.copyFile(compiledPath, path.join(dist, 'lib/index.js'));
await fs.copyFile(path.join(stage, 'index.js'), path.join(dist, 'index.js'));
await fs.writeFile(path.join(dist, 'index-esm.mjs'), esm + outro);
for (const file of ['index.d.ts', 'LICENSE', 'LICENSE.libphonenumber', 'LICENSE.closure-library']) {
  await fs.copyFile(path.join(fork, file), path.join(dist, file));
}
await fs.writeFile(
  path.join(dist, 'package.json'),
  `${JSON.stringify(
    {
      name: provenance.name,
      version: provenance.version,
      private: true,
      type: 'commonjs',
      license: 'MIT',
      main: './index.js',
      types: './index.d.ts',
    },
    null,
    2,
  )}\n`,
);
await fs.writeFile(path.join(dist, 'provenance.json'), `${JSON.stringify(provenance, null, 2)}\n`);
const outputs = {};
for (const file of ['index.js', 'index-esm.mjs', 'index.d.ts', 'lib/index.js']) {
  outputs[file] = crypto
    .createHash('sha256')
    .update(await fs.readFile(path.join(dist, file)))
    .digest('hex');
}
await fs.writeFile(path.join(dist, 'checksums.json'), `${JSON.stringify(outputs, null, 2)}\n`);
console.log(`Built ${provenance.name}@${provenance.version} from verified sources.`);
