let fakeImports = {};

export function setupFakeImport(path, data) {
  const fakeExports = { ...data };
  Object.defineProperty(fakeExports, '__esModule', { value: true });
  fakeImports[path] = fakeExports;
}

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

function resolveOrReject(result, resolve, reject) {
  if (result) {
    resolve(result);
  } else {
    reject();
  }
}

export async function fakeImport(path, ms = 0) {
  const result = fakeImports[path];
  if (ms > 0) {
    return new Promise((resolve, reject) => {
      setTimeout(() => resolveOrReject(result, resolve, reject), ms);
    });
  }
  return new Promise((resolve, reject) => resolveOrReject(result, resolve, reject));
}
