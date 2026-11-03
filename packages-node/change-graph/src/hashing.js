import { createHash } from 'crypto';
import { promises as fs } from 'fs';
import path from 'path';
import { deflateRawSync, inflateRawSync } from 'zlib';

/**
 * Content hash of files (path relative to `root` + bytes), independent of git state,
 * so uncommitted changes are included.
 * @param {string[]} filePaths
 * @param {{ root?: string }} [options]
 */
export async function hashFiles(filePaths, { root = process.cwd() } = {}) {
  const hash = createHash('sha256');
  for (const filePath of [...new Set(filePaths)].sort()) {
    hash.update(path.relative(root, filePath).split(path.sep).join('/'));
    hash.update('\0');
    hash.update(await fs.readFile(filePath));
    hash.update('\0');
  }
  return hash.digest('hex');
}

/** @param {unknown} value */
export function hashValue(value) {
  return createHash('sha256').update(JSON.stringify(value)).digest('hex');
}

/** @param {unknown[]} values */
export function encodeValues(values) {
  return deflateRawSync(JSON.stringify(values)).toString('base64');
}

/** @param {unknown} encoded */
export function decodeValues(encoded) {
  if (Array.isArray(encoded)) return encoded;
  if (typeof encoded !== 'string') return null;
  return JSON.parse(inflateRawSync(Buffer.from(encoded, 'base64')).toString('utf8'));
}
