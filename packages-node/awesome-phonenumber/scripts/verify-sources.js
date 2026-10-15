import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import url from 'node:url';

const root = url.fileURLToPath(new URL('../', import.meta.url));

export async function verifySources() {
  const checksums = JSON.parse(await fs.readFile(path.join(root, 'source-checksums.json'), 'utf8'));
  const provenance = JSON.parse(await fs.readFile(path.join(root, 'provenance.json'), 'utf8'));
  const manifest = JSON.parse(await fs.readFile(path.join(root, 'package.json'), 'utf8'));
  async function walk(directory, prefix = '') {
    const files = [];
    for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
      const relative = `${prefix}${entry.name}`;
      const absolute = path.join(directory, entry.name);
      if (entry.isDirectory()) {
        files.push(...(await walk(absolute, `${relative}/`)));
      } else {
        assert(entry.isFile(), `Unexpected source entry: ${relative}`);
        const sha256 = crypto
          .createHash('sha256')
          .update(await fs.readFile(absolute))
          .digest('hex');
        assert.equal(sha256, checksums[relative], `Source checksum mismatch: ${relative}`);
        files.push(relative);
      }
    }
    return files;
  }
  assert.deepEqual((await walk(path.join(root, 'upstream'))).sort(), Object.keys(checksums).sort());
  assert.equal(manifest.private, true);
  assert.equal(manifest.version, provenance.version);
  assert.equal(
    (
      await fs.readFile(
        path.join(root, 'upstream/awesome-phonenumber/libphonenumber.version'),
        'utf8',
      )
    ).trim(),
    provenance.libphonenumberVersion,
  );
  return provenance;
}
