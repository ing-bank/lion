/**
 * The host side of the runner: build the fence document and read the engine's report back.
 *
 * The document it builds contains everything the engine needs — the policy, the import map, the
 * payload and the engine import — so execution stays inside an opaque-origin frame and the host keeps
 * the interface. That is the split the design settled on: the engine inside the fence, the filesystem
 * and the terminal in the page, one protocol between them.
 */
import { getShimImportMapEntries } from './shims/registry.js';

export const REPORT_SOURCE = 'lion-node-demo-runner';

/**
 * Content Security Policy for the fence. The same shape as the share fence: named by origin without a
 * path (a path without a trailing slash matches that exact path only) and `connect-src blob:` so a demo
 * can read data it produced itself and nothing else.
 *
 * `script-src` carries `'wasm-unsafe-eval'` and deliberately not `'unsafe-eval'`: WebAssembly compilation
 * is gated behind eval, and packages in our own tree use it (`es-module-lexer`, reached through
 * @lion/nodejs-helpers' util module), but JS eval itself stays blocked. Measured: without the wasm
 * directive a demo that touches such a module reports "Compiling or instantiating WebAssembly module
 * violates the following Content Security policy directive".
 * @param {string} assetsOrigin
 * @returns {string}
 */
export function getFencePolicy(assetsOrigin) {
  return [
    "default-src 'none'",
    `script-src 'unsafe-inline' 'wasm-unsafe-eval' blob: ${assetsOrigin}`,
    `style-src 'unsafe-inline' blob: ${assetsOrigin}`,
    `img-src blob: data: ${assetsOrigin}`,
    `font-src blob: data: ${assetsOrigin}`,
    'connect-src blob:',
  ].join('; ');
}

/**
 * JSON that is safe to embed in a `<script>` element: a demo's own file contents routinely contain
 * `</script>`, which would close the tag early and leave the rest of the document as garbage.
 * @param {unknown} value
 * @returns {string}
 */
function toEmbeddedJson(value) {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}

/**
 * The url a vendored module is reachable at.
 *
 * The vendoring step copies every import-map target's *package folder* to
 * `<destination>/node_modules/<package name>/`, so the url layout is keyed by package name — not by
 * the repo-relative path in the map. Deriving it from the repo path alone works only for packages that
 * happen to live under `packages/` and matches `node_modules/@lion/<x>`; a `packages-node/<x>` target
 * would then 404. So the package's own root is found inside the path (the shortest prefix ending in the
 * package's directory name, which is the package root in every layout in this repo) and everything
 * after it is the path inside the package.
 *
 * @param {string} repoRelativePath
 * @param {string} packageName
 * @param {string} assetsOrigin
 * @returns {string}
 */
export function toVendoredUrl(repoRelativePath, packageName, assetsOrigin) {
  const directoryName = packageName.split('/').pop();
  const segments = repoRelativePath.split('/');
  const rootIndex = segments.indexOf(directoryName);
  const insidePackage = rootIndex === -1 ? repoRelativePath : segments.slice(rootIndex + 1).join('/');
  return `${assetsOrigin}/node_modules/${packageName}${insidePackage ? `/${insidePackage}` : ''}`;
}

/**
 * @param {{importMapPerPackage: {[packageName: string]: {[exposed: string]: string}}, packageMains?: {[packageName: string]: string}}} packageMap
 * @param {string} assetsOrigin
 * @param {string} [shimBaseUrl] directory the shim files are served from. It must be the directory the
 *   engine's own `./shims/*.js` imports resolve to: a shim reached by a second url is a second module
 *   instance with its own empty filesystem, which is how a demo ends up with `ENOENT` on a file that is
 *   demonstrably there. Defaults to the assets origin, which is where a static build puts them.
 * @returns {{imports: {[specifier: string]: string}}} the map the fence document needs: the package's
 *   own modules plus a shim for every builtin the runner answers
 */
export function buildFenceImportMap(
  { importMapPerPackage, packageMains = {} },
  assetsOrigin,
  shimBaseUrl = assetsOrigin,
) {
  const imports = {};
  for (const [packageName, entries] of Object.entries(importMapPerPackage)) {
    for (const [exposed, repoRelativePath] of Object.entries(entries)) {
      const subpath = exposed.replace(/^\.\/?/, '');
      const specifier = subpath ? `${packageName}/${subpath}` : packageName;
      imports[specifier] = toVendoredUrl(repoRelativePath, packageName, assetsOrigin);
    }
  }
  // A package that declares its entry with `main`/`module` instead of `exports[".""]` — `unified`,
  // `@babel/*` — has no entry for its own name above, and in a browser there is no Node resolution to
  // fall back on, so `import "<name>"` fails outright. The CLI reads that entry from package.json,
  // because the map cannot carry it. An existing entry is kept: it came from the export map.
  for (const [packageName, repoRelativePath] of Object.entries(packageMains)) {
    if (!imports[packageName]) {
      imports[packageName] = toVendoredUrl(repoRelativePath, packageName, assetsOrigin);
    }
  }
  // The shims win over anything the package map claims for a builtin: a package must not be able to
  // shadow `fs` with a CDN-published module of the same name.
  Object.assign(imports, getShimImportMapEntries(shimBaseUrl));
  return { imports };
}

/**
 * @param {{importMap: {imports: {[specifier: string]: string}}, engineUrl: string, payload: unknown, assetsOrigin: string, styles?: string}} options
 * @returns {string} the srcdoc for the fence iframe
 */
export function buildFenceDocument({ importMap, engineUrl, payload, assetsOrigin, styles = '' }) {
  // A demo's own css must not be able to close the style element it is embedded in.
  const safeStyles = styles.replace(/<\/style/gi, '<\\/style');
  return `<!doctype html>
<html>
<head>
<meta charset="utf-8">
<meta http-equiv="Content-Security-Policy" content="${getFencePolicy(assetsOrigin)}">
<script type="importmap">${toEmbeddedJson(importMap)}</script>
<style>${safeStyles}</style>
</head>
<body>
<script>window.__nodeDemoRunnerPayload = ${toEmbeddedJson(payload)};</script>
<script type="module">
// Lion needs the scoped custom element registry when it runs in an opaque origin: the native one is not
// available there, and without the polyfill a component never upgrades.
import '${assetsOrigin}/node_modules/@webcomponents/scoped-custom-element-registry/scoped-custom-element-registry.min.js';
import ${JSON.stringify(engineUrl)};
</script>
</body>
</html>`;
}

/**
 * Mounts the fence and resolves with the engine's first report.
 * @param {{container: HTMLElement, payload: unknown, importMapPerPackage: {[packageName: string]: {[exposed: string]: string}}, packageMains?: {[packageName: string]: string}, assetsOrigin: string, engineUrl: string, timeoutMs?: number}} options
 * @returns {Promise<{log: {stream: string, text: string}[], exitCode: number, files: {[pathname: string]: string}}>}
 */
export function runDemoInFence({
  container,
  payload,
  importMapPerPackage,
  packageMains = {},
  assetsOrigin,
  engineUrl,
  styles = '',
  timeoutMs = 30000,
}) {
  const iframe = document.createElement('iframe');
  iframe.setAttribute('sandbox', 'allow-scripts');
  iframe.setAttribute('title', 'Node package demo');
  iframe.style.cssText = 'width:100%;height:100%;border:0;background:transparent';
  iframe.srcdoc = buildFenceDocument({
    // The shims are reached through the engine's own directory, so the demo's `import 'fs'` and the
    // engine's `./shims/fs.js` are the same module: two urls would mean two module instances, each with
    // its own filesystem. The engine url is resolved against the document first, because `new URL` needs
    // an absolute base and a page may well pass a root-relative one.
    importMap: buildFenceImportMap(
      { importMapPerPackage, packageMains },
      assetsOrigin,
      new URL('./shims', new URL(engineUrl, document.baseURI)).href,
    ),
    engineUrl,
    payload,
    assetsOrigin,
    styles,
  });
  container.appendChild(iframe);

  return new Promise((resolve, reject) => {
    const onMessage = event => {
      if (event.source !== iframe.contentWindow) return;
      const data = event.data;
      if (!data || data.source !== REPORT_SOURCE) return;
      clearTimeout(timer);
      window.removeEventListener('message', onMessage);
      resolve({ log: data.log, exitCode: data.exitCode, files: data.files });
    };
    const timer = setTimeout(() => {
      window.removeEventListener('message', onMessage);
      reject(new Error(`The demo did not report back within ${timeoutMs}ms`));
    }, timeoutMs);
    window.addEventListener('message', onMessage);
  });
}

/**
 * Asks a mounted fence to run again. The host keeps the frame, so editing a demo does not need a
 * reload — the filesystem is reset and the payload is re-read from the document.
 * @param {HTMLIFrameElement} iframe
 * @param {unknown} payload
 */
export function requestRerun(iframe, payload) {
  iframe.contentWindow.postMessage(
    { source: `${REPORT_SOURCE}-request`, payload },
    '*',
  );
}

export default {
  getFencePolicy,
  toVendoredUrl,
  buildFenceImportMap,
  buildFenceDocument,
  runDemoInFence,
  requestRerun,
};
