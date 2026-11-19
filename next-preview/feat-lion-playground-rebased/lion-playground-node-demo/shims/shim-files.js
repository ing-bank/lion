/**
 * Which Node builtins the runner answers, as data.
 *
 * This lives in its own module so the shim layer and the registry can share one list without importing each other:
 * the registry imports every shim to expose them, and `worker_threads` needs the same map to rewrite the specifiers
 * inside a worker it starts — a worker created from a url does not inherit the document's import map, so its imports
 * have to be resolved before it runs.
 */

/** @type {Record<string, string>} specifier -> shim module file, next to this one */
export const SHIM_FILES = {
  fs: 'fs.js',
  'fs/promises': 'fs-promises.js',
  path: 'path.js',
  process: 'process.js',
  os: 'os.js',
  util: 'util.js',
  events: 'events.js',
  url: 'url.js',
  worker_threads: 'worker-threads.js',
};

export default { SHIM_FILES };
