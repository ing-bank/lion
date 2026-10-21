import assert from 'node:assert/strict';
import { rollup } from 'rollup';
import { nodeResolve } from '@rollup/plugin-node-resolve';

const [, , input, output] = process.argv;
assert(input && output, 'Pass packed-consumer browser entry and bundle destination.');
const bundle = await rollup({
  input,
  plugins: [nodeResolve({ browser: true })],
  onwarn(warning, warn) {
    assert.notEqual(warning.code, 'UNRESOLVED_IMPORT', warning.message);
    warn(warning);
  },
});
try {
  const result = await bundle.write({
    dir: output,
    format: 'es',
    entryFileNames: 'entry.mjs',
    chunkFileNames: '[name]-[hash].mjs',
  });
  const files = new Set(result.output.map(file => file.fileName));
  const entry = result.output.find(file => file.type === 'chunk' && file.isEntry);
  assert(entry && entry.type === 'chunk');
  assert.equal(entry.dynamicImports.length, 1, 'Preserve the lazy phone chunk');
  for (const chunk of result.output) {
    assert.equal(chunk.type, 'chunk');
    for (const imported of [...chunk.imports, ...chunk.dynamicImports]) {
      assert(files.has(imported), `Unresolved browser dependency: ${imported}`);
    }
  }
} finally {
  await bundle.close();
}
