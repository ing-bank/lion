import assert from 'node:assert/strict';
import module from 'node:module';
import path from 'node:path';
import { PhoneUtilManager } from './components/input-tel/src/PhoneUtilManager.js';
import { parsePhoneNumber } from './components/input-tel/src/parsers.js';

const require = module.createRequire(import.meta.url);
const cjs = require('#awesome-phonenumber');
const manifest = require('./generated/awesome-phonenumber/package.json');

assert.equal(manifest.version, '7.9.0-tlouisse.libphonenumber-9.0.41');
assert.equal(manifest.license, 'MIT');
assert.equal(manifest.main, './index.js');
assert.equal(manifest.types, './index.d.ts');
assert(
  import.meta
    .resolve('#awesome-phonenumber')
    .endsWith('/generated/awesome-phonenumber/index-esm.mjs'),
);
assert.equal(path.basename(require.resolve('#awesome-phonenumber')), 'index.js');
assert.equal(PhoneUtilManager.isLoaded, false);

await PhoneUtilManager.loadComplete;
const esm = await import('#awesome-phonenumber');
await assert.rejects(import('awesome-phonenumber'), { code: 'ERR_MODULE_NOT_FOUND' });
for (const api of [esm, cjs, PhoneUtilManager.PhoneUtil]) {
  const parsed = api.parsePhoneNumber('+594890123456');
  assert.equal(parsed.valid, true);
  assert.equal(parsed.regionCode, 'GF');
  assert.equal(parsed.type, 'premium-rate');
  assert.equal(parsed.number.e164, '+594890123456');
}
assert.equal(parsePhoneNumber('0890123456', { regionCode: 'GF' }), '+594890123456');
