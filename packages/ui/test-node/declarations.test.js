import assert from 'node:assert/strict';
import childProcess from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';
import url from 'node:url';
import util from 'node:util';

const execFile = util.promisify(childProcess.execFile);
const packageRoot = new URL('../', import.meta.url);

test('declaration postprocessing preserves consumer fixes and is idempotent', async () => {
  const scratchRoot = url.fileURLToPath(new URL('../../../.tmp/', import.meta.url));
  await fs.mkdir(scratchRoot, { recursive: true });
  const fixture = await fs.mkdtemp(path.join(scratchRoot, 'declaration-postprocess-'));
  try {
    const relative = 'components/select-rich/src/LionSelectRich';
    const declaration = path.join(fixture, `dist-types/${relative}.d.ts`);
    const script = path.join(fixture, 'scripts/postprocess-declarations.js');
    await fs.mkdir(path.dirname(declaration), { recursive: true });
    await fs.mkdir(path.dirname(script), { recursive: true });
    await fs.mkdir(path.dirname(path.join(fixture, relative)), { recursive: true });
    await fs.writeFile(path.join(fixture, `${relative}.js`), '');
    await fs.writeFile(path.join(fixture, 'package.json'), '{"type":"module"}');
    await fs.copyFile(new URL('scripts/postprocess-declarations.js', packageRoot), script);
    await fs.writeFile(
      declaration,
      [
        'export declare class LionSelectRich {',
        '    /** @private */',
        '    __state;',
        '    /**',
        '     * @protected',
        '     */',
        '    _state: string;',
        '    get _focusableNode(): HTMLElement;',
        '    /** @type {SlotsMap} */',
        '    get slots(): SlotsMap;',
        '}',
        'export type Options = {',
        '    /** @protected */',
        '    name: string;',
        '};',
      ].join('\n'),
    );
    await execFile(process.execPath, [script]);
    const normalized = await fs.readFile(declaration, 'utf8');
    assert.match(normalized, /private __state;/);
    assert.match(normalized, /protected _state: string;/);
    assert.match(normalized, /\n {4}get _focusableNode\(\)/);
    assert.doesNotMatch(normalized, /get slots\(\)/);
    assert.doesNotMatch(normalized, /protected name/);
    await execFile(process.execPath, [script]);
    assert.equal(await fs.readFile(declaration, 'utf8'), normalized);
    await fs.writeFile(declaration, 'export declare class LionSelectRich { get slots(): Other; }');
    await assert.rejects(execFile(process.execPath, [script]), /Unexpected LionSelectRich slots/);
  } finally {
    await fs.rm(fixture, { recursive: true, force: true });
  }
});
