/**
 * On-disk memoisation of the selection, so every tool that asks in parallel (lint, node tests,
 * browser tests, screen reader tests) reuses the result of the computation that already happened.
 *
 * The key is a content hash: the base revision, every file that was touched *and its bytes*, the
 * semantic lockfile changes, the test globs and the version of this logic. Not the git status - the
 * same content after an edit must hit, and a touched file that is byte-identical must not miss.
 * A key that cannot be computed (unreadable file, no git) simply means "no cache", never a stale
 * answer.
 *
 * Writing is atomic (temporary file + rename) and reading tolerates anything broken, so two tools
 * that start at the same time can both compute and both write without corrupting the other; the last
 * rename wins and both results are valid for the same key.
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { hashFiles, hashValue } from './hashing.js';

/** Bump when the selection's meaning changes; it invalidates every stored result. */
export const CACHE_VERSION = '1';

/** How many results to keep around (one per state of the working tree). */
const KEEP = 24;

/**
 * @param {string} root
 * @param {string | undefined} override
 * @returns {string}
 */
export function cacheDirFor(root, override) {
  if (override) {
    return override;
  }
  const insideNodeModules = path.join(root, 'node_modules');
  if (fs.existsSync(insideNodeModules)) {
    return path.join(insideNodeModules, '.cache', 'change-graph');
  }
  // A pristine checkout has no node_modules: keep the cache outside the repository so it is never
  // committed and never mistaken for a source file.
  return path.join(os.tmpdir(), 'change-graph-cache', hashValue(root).slice(0, 16));
}

/**
 * @param {string} root the repository root
 * @param {{ files?: string[] } & Record<string, unknown>} parts everything the result depends on
 * @returns {Promise<string | null>} null when a key cannot be built (then do not cache)
 */
export async function cacheKeyFor(root, parts) {
  try {
    const { files: touched = [], ...rest } = parts;
    const files = touched
      .map(file => path.resolve(root, file))
      .filter(file => fs.existsSync(file) && fs.statSync(file).isFile());
    const content = await hashFiles(files, { root });
    return hashValue({ version: CACHE_VERSION, ...rest, content });
  } catch {
    return null;
  }
}

/**
 * @param {string} dir
 * @param {string} key
 * @returns {Record<string, any> | null}
 */
export function readCache(dir, key) {
  try {
    const file = path.join(dir, `${key}.json`);
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return null;
  }
}

/** A lock older than this belongs to a process that is gone. */
const LOCK_STALE_MS = 10_000;

/**
 * Claim the right to compute this key. The first tool takes it, the others wait for its result
 * instead of each building the import graph themselves; a claim that is too old to be alive is
 * taken over.
 *
 * @param {string} dir
 * @param {string} key
 * @returns {boolean} true when this process should compute
 */
export function acquireLock(dir, key) {
  const file = path.join(dir, `${key}.lock`);
  try {
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(file, String(process.pid), { flag: 'wx' });
    return true;
  } catch {
    try {
      const { mtimeMs } = fs.statSync(file);
      if (Date.now() - mtimeMs > LOCK_STALE_MS) {
        fs.rmSync(file, { force: true });
        fs.writeFileSync(file, String(process.pid), { flag: 'wx' });
        return true;
      }
    } catch {
      // the lock disappeared between the two attempts: try once more
      try {
        fs.writeFileSync(file, String(process.pid), { flag: 'wx' });
        return true;
      } catch {
        return false;
      }
    }
    return false;
  }
}

/**
 * @param {string} dir
 * @param {string} key
 */
export function releaseLock(dir, key) {
  try {
    fs.rmSync(path.join(dir, `${key}.lock`), { force: true });
  } catch {
    // nothing to release
  }
}

/**
 * Wait for the tool that holds the lock to publish its result. Never waits forever, and never
 * throws: a result that does not arrive means "compute it yourself".
 *
 * @param {string} dir
 * @param {string} key
 * @param {number} timeoutMs
 * @returns {Promise<Record<string, any> | null>}
 */
export async function waitForCache(dir, key, timeoutMs) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    const cached = readCache(dir, key);
    if (cached) {
      return cached;
    }
    await new Promise(resolve => {
      setTimeout(resolve, 25);
    });
  }
  return readCache(dir, key);
}

/**
 * @param {string} dir
 */
function prune(dir) {
  try {
    const entries = fs
      .readdirSync(dir)
      .filter(name => name.endsWith('.json'))
      .map(name => ({ name, time: fs.statSync(path.join(dir, name)).mtimeMs }))
      .sort((a, b) => b.time - a.time);
    for (const { name } of entries.slice(KEEP)) {
      fs.rmSync(path.join(dir, name), { force: true });
    }
  } catch {
    // keep the directory as it is
  }
}

/**
 * @param {string} dir
 * @param {string} key
 * @param {unknown} value
 */
export function writeCache(dir, key, value) {
  try {
    fs.mkdirSync(dir, { recursive: true });
    const file = path.join(dir, `${key}.json`);
    const temporary = `${file}.${process.pid}.tmp`;
    fs.writeFileSync(temporary, `${JSON.stringify(value)}\n`);
    fs.renameSync(temporary, file);
    prune(dir);
  } catch {
    // A cache that cannot be written is an optimisation that did not happen, not an error.
  }
}
