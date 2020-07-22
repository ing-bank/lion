/**
 * @type {Object.<string, Object>}
 */
let fakeImports = {};

/**
 * @param {string} path
 * @param {Object} data
 */
export function setupFakeImport(path, data) {
  const fakeExports = { ...data };
  Object.defineProperty(fakeExports, '__esModule', { value: true });
  fakeImports[path] = fakeExports;
}

/**
 * @param {Array<string>} namespaces
 * @param {Array<string>} locales
 */
export function setupEmptyFakeImportsFor(namespaces, locales) {
  namespaces.forEach(namespace => {
    locales.forEach(locale => {
      setupFakeImport(`./${namespace}/${locale}.js`, {
        default: {},
      });
    });
  });
}

export function resetFakeImport() {
  fakeImports = {};
}

/**
 * @param {Object} result
 * @param {Function} resolve
 * @param {Function} reject
 */
function resolveOrReject(result, resolve, reject) {
  if (result) {
    resolve(result);
  } else {
    reject();
  }
}

/**
 * @param {string} path
 * @param {number} [ms=0]
 * @returns {Promise<Object>}
 */
export async function fakeImport(path, ms = 0) {
  const result = fakeImports[path];
  if (ms > 0) {
    return new Promise((resolve, reject) => {
      setTimeout(() => resolveOrReject(result, resolve, reject), ms);
    });
  }
  return new Promise((resolve, reject) => resolveOrReject(result, resolve, reject));
}
