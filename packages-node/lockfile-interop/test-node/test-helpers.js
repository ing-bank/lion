/**
 * Shared plumbing for the lockfile-interop tests.
 *
 * The fixture repos are temporary by design (see `fixtures.js`), so every test needs the same
 * create-run-delete wrapper; keeping it here means a failing test can never leave a repo behind in the
 * temp directory, even when an assertion throws.
 */
import { makeFixtureRepo } from './fixtures.js';

/**
 * Runs `fn` against a repo built by `makeRepo` and always cleans it up afterwards.
 *
 * @template T
 * @param {() => { root: string, cleanup: () => void }} makeRepo
 * @param {(repo: { root: string }) => T | Promise<T>} fn
 * @returns {Promise<T>}
 */
export async function withRepo(makeRepo, fn) {
  const repo = makeRepo();
  try {
    return await fn(repo);
  } finally {
    repo.cleanup();
  }
}

/**
 * Runs `fn` against a freshly generated fixture repo and always cleans it up afterwards.
 *
 * @template T
 * @param {Parameters<typeof makeFixtureRepo>[0]} [options]
 * @param {(repo: { root: string }) => T | Promise<T>} fn
 * @returns {Promise<T>}
 */
export async function withFixtureRepo(options, fn) {
  return withRepo(() => makeFixtureRepo(options), fn);
}
