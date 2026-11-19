/**
 * Sharing a demo as a link, and rendering a shared demo inside a fence.
 *
 * A share link carries the demo's files in the url fragment, so the code travels with the link and
 * never reaches a server. What arrives is somebody else's code, which is a different risk than the
 * ide running your own: the fence renders it in an opaque origin, where it cannot read this origin's
 * cookies or storage, cannot touch the parent document, cannot open popups, cannot navigate the top
 * frame, and cannot use the service worker api. Measured on a built deploy (Chromium):
 *
 *   origin: null   cookie: unreadable   parent dom: SecurityError   localStorage: SecurityError
 *   navigator.serviceWorker: disabled   window.open: null           top navigation: SecurityError
 *
 * Two things make the fence work at all despite the opaque origin:
 *  - modules are imported from this origin by *absolute* url, which is a cross-origin script load and
 *    passes because the deploy answers with `access-control-allow-origin: *`;
 *  - a demo's own data files (json, images, css) become blob urls created *inside* the sandbox, since
 *    a blob url belonging to another origin is unreadable (blob urls are origin-keyed).
 *
 * The service worker based preview cannot do this: an opaque origin has the service worker api
 * disabled, so it can never be a controlled client and nothing would be served.
 */

/**
 * Content Security Policy for the fenced document.
 *
 * `connect-src blob:` rather than `'none'`: a demo still reads its own data fixtures, but a blob url
 * created inside the sandbox is the only thing it can reach — no network egress. Module loads are
 * governed by `script-src`, not `connect-src`, so imports keep working.
 *
 * The host origin is named without a path on purpose: a source expression with a path but no trailing
 * slash matches that exact path only, which silently blocks every module under it.
 *
 * @param {string} assetsOrigin
 * @returns {string}
 */
export function getFencedDocumentPolicy(assetsOrigin) {
  return [
    "default-src 'none'",
    `script-src 'unsafe-inline' blob: ${assetsOrigin}`,
    `style-src 'unsafe-inline' blob: ${assetsOrigin}`,
    `img-src blob: data: ${assetsOrigin}`,
    `font-src blob: data: ${assetsOrigin}`,
    'connect-src blob:',
  ].join('; ');
}

/**
 * Turns the generated per-package import map into a browser import map, the way `setupIde` does:
 * `'@lion/ui'` + `'./button.js'` becomes `'@lion/ui/button.js'`, and a package's `'.'` entry becomes
 * the bare package name.
 * @param {{[packageName: string]: {[exposedPath: string]: string}}} importMapPerPackage
 * @param {(repoRelativePath: string) => string} toAssetUrl
 * @returns {{imports: {[specifier: string]: string}}}
 */
export function flattenImportMapPerPackage(importMapPerPackage, toAssetUrl) {
  const imports = {};
  for (const [packageName, entries] of Object.entries(importMapPerPackage)) {
    for (const [entry, repoRelativePath] of Object.entries(entries)) {
      const specifier = `${packageName}/${entry.replace(/^\.\/?/, '')}`.replace(/\/$/, '');
      imports[specifier] = toAssetUrl(repoRelativePath);
    }
  }
  return { imports };
}

/**
 * @param {string} text
 * @returns {string} base64url, no padding
 */
function toBase64Url(text) {
  return btoa(String.fromCharCode(...new TextEncoder().encode(text)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

/**
 * @param {string} base64Url
 * @returns {string}
 */
function fromBase64Url(base64Url) {
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const binary = atob(base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '='));
  return new TextDecoder().decode(Uint8Array.from(binary, char => char.charCodeAt(0)));
}

/**
 * @param {Uint8Array} bytes
 * @param {'compress' | 'decompress' | 'none'} mode
 * @returns {Promise<Uint8Array>}
 */
async function transformBytes(bytes, mode) {
  let stream = new Blob([bytes]).stream();
  if (mode === 'compress') stream = stream.pipeThrough(new CompressionStream('deflate-raw'));
  if (mode === 'decompress') stream = stream.pipeThrough(new DecompressionStream('deflate-raw'));
  return new Uint8Array(await new Response(stream).arrayBuffer());
}

/**
 * @typedef {{content: string; contentType?: string}} SharedFile
 * @typedef {{version?: number; entry: string; htmlFile: string; files: {[name: string]: SharedFile}}} SharedDemo
 */

/**
 * Serializes a demo for a url fragment. Decompressed JSON is compressed with `deflate-raw`, then
 * base64url encoded, so links stay short enough to paste and the code never leaves the browser.
 * @param {SharedDemo} demo
 * @returns {Promise<string>}
 */
export async function encodeSharedDemo(demo) {
  const json = JSON.stringify({ version: 1, ...demo });
  const compressed = await transformBytes(new TextEncoder().encode(json), 'compress');
  return toBase64Url(String.fromCharCode(...compressed));
}

/**
 * @param {string} encoded
 * @returns {Promise<SharedDemo>}
 */
export async function decodeSharedDemo(encoded) {
  const bytes = Uint8Array.from(fromBase64Url(encoded), char => char.charCodeAt(0));
  const json = new TextDecoder().decode(await transformBytes(bytes, 'decompress'));
  const demo = JSON.parse(json);
  if (!demo.files || !demo.entry) {
    throw new Error('Incomplete shared demo');
  }
  return demo;
}

/**
 * The markup a demo file wants in its body: the generated `index.html` minus its hide comments and
 * its script, which the fence replaces (it imports the registry and the demo itself).
 * @param {string} html
 * @returns {string}
 */
function extractBodyMarkup(html) {
  return html
    .replace(/<!--\s*playground-hide[\s\S]*?-->/g, '')
    .replace(/<!--\s*playground-hide-end\s*-->/g, '')
    .replace(/<script[\s\S]*?<\/script>/g, '')
    .replace(/<\/?body[^>]*>/g, '')
    .replace(/<\/?html[^>]*>/g, '')
    .replace(/<head[\s\S]*?<\/head>/g, '')
    .trim();
}

/**
 * @param {string} name
 * @returns {string} the mime type a sandbox blob needs for this file
 */
function mimeTypeForFile(name) {
  if (name.endsWith('.json')) return 'application/json';
  if (name.endsWith('.css')) return 'text/css';
  if (name.endsWith('.svg')) return 'image/svg+xml';
  if (name.endsWith('.html')) return 'text/html';
  return 'text/javascript';
}

/**
 * JSON that is safe to embed in a `<script>` element. A demo's own markup contains `</script>`, which
 * would close the tag early and leave the rest of the document as garbage.
 * @param {unknown} value
 * @returns {string}
 */
function toEmbeddedJson(value) {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}

/**
 * Builds the document that goes into the fenced iframe.
 *
 * The demo's files are embedded as text and turned into blob urls by a bootstrap script *inside* the
 * sandbox, with relative imports between them rewritten to those blob urls — that is what replaces
 * the service worker's virtual filesystem.
 *
 * @param {SharedDemo} demo
 * @param {{importMap: {imports: {[specifier: string]: string}}; assetsOrigin: string}} opts
 * @returns {string}
 */
export function buildFencedDocument(demo, { importMap, assetsOrigin }) {
  const registryUrl = `${assetsOrigin}/node_modules/@webcomponents/scoped-custom-element-registry/scoped-custom-element-registry.min.js`;
  const htmlFile = demo.htmlFile && demo.files[demo.htmlFile];
  const bodyMarkup = htmlFile ? extractBodyMarkup(htmlFile.content) : '';
  const files = Object.fromEntries(
    Object.entries(demo.files).map(([name, file]) => [
      name,
      { content: file.content, type: mimeTypeForFile(name) },
    ]),
  );

  return `<!doctype html>
<html>
<head>
<meta charset="utf-8">
<meta http-equiv="Content-Security-Policy" content="${getFencedDocumentPolicy(assetsOrigin)}">
<script type="importmap">${toEmbeddedJson(importMap)}</script>
</head>
<body>
${bodyMarkup}
<script type="module">
import '${registryUrl}';
const files = ${toEmbeddedJson(files)};
const urls = {};
const inProgress = new Set();
function blobUrlFor(name) {
  if (urls[name]) return urls[name];
  if (inProgress.has(name)) throw new Error('Circular import in shared demo: ' + name);
  inProgress.add(name);
  const file = files[name];
  if (!file) throw new Error('Shared demo is missing file: ' + name);
  const content = file.type === 'text/javascript'
    ? rewriteRelativeImports(file.content, name)
    : file.content;
  const url = URL.createObjectURL(new Blob([content], { type: file.type }));
  urls[name] = url;
  inProgress.delete(name);
  return url;
}
function rewriteRelativeImports(code, name) {
  const base = name.includes('/') ? name.replace(/[^/]+$/, '') : '';
  return code.replace(
    /(from\\s*|import\\s*)['"](\\.\\/?)([^'"]+)['"]/g,
    (match, prefix, _dots, specifier) => prefix + JSON.stringify(blobUrlFor(base + specifier)),
  );
}
await import(blobUrlFor(${toEmbeddedJson(demo.entry)}));
</script>
</body>
</html>`;
}

/**
 * The same demo as a `playground-ide` config, so a shared demo can be opened in the editor.
 *
 * N.B. this is where a shared demo leaves the fence: the ide's preview runs demos same-origin with
 * the host page (playground-elements creates that iframe without a `sandbox` attribute), so the code
 * then has the origin's privileges. It is therefore an explicit action by the recipient — the same
 * thing as pasting the code in — and the reason the fenced render is the default view.
 * @param {SharedDemo} demo
 * @param {{importMapPerPackage: {[packageName: string]: {[exposedPath: string]: string}}; toAssetUrl: (repoRelativePath: string) => string}} opts
 * @returns {object} an `ide.config` value
 */
export function toIdeConfig(demo, { importMapPerPackage, toAssetUrl }) {
  const importMap = flattenImportMapPerPackage(importMapPerPackage, toAssetUrl);
  // The import map has to be *in the document*, not only in the project config: the config drives
  // playground-elements' own rewriting of project files, while the packages those files import keep
  // their bare specifiers and need the document's map. Share links drop it from the payload to stay
  // short, so it is rebuilt here.
  const importMapScript = `<script type="importmap">${JSON.stringify(importMap).replace(/</g, '\\u003c')}</script>`;
  const files = Object.fromEntries(
    Object.entries(demo.files).map(([name, file]) => [
      name,
      {
        filename: name,
        contentType: file.contentType || 'sample/js',
        content:
          file.content.includes('type="importmap"') || !file.content.includes('<script type="module">')
            ? file.content
            : file.content.replace('<script type="module">', `${importMapScript}\n<script type="module">`),
      },
    ]),
  );
  return { importMap, files };
}

/**
 * Renders a shared demo inside an opaque-origin sandbox. The containment comes from the iframe's
 * `sandbox` attribute (no `allow-same-origin`), not from the host page or the deploy.
 * @param {HTMLElement} container
 * @param {SharedDemo} demo
 * @param {{importMapPerPackage: {[packageName: string]: {[exposedPath: string]: string}}; toAssetUrl: (repoRelativePath: string) => string}} opts
 * @returns {HTMLIFrameElement}
 */
export function renderSharedDemo(container, demo, { importMapPerPackage, toAssetUrl }) {
  const assetsOrigin = new URL(toAssetUrl('')).origin;
  const iframe = document.createElement('iframe');
  iframe.setAttribute('sandbox', 'allow-scripts');
  iframe.setAttribute('title', 'Shared demo');
  iframe.style.cssText = 'width:100%;height:100%;border:0;background:transparent';
  iframe.srcdoc = buildFencedDocument(demo, {
    importMap: flattenImportMapPerPackage(importMapPerPackage, toAssetUrl),
    assetsOrigin,
  });
  container.appendChild(iframe);
  return iframe;
}
