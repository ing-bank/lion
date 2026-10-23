import { spawn } from 'child_process';
import http from 'http';
import path from 'path';

import { parseSync } from 'oxc-parser';
import { ResolverFactory } from 'oxc-resolver';

import { fsAdapter } from '#utils/fs-adapter.js';

/**
 * A minimal development server: static files, bare specifier rewriting for the browser and
 * middleware. It is a drop-in replacement for `@web/dev-server` (wds) for the subset of its config
 * we use, so the dashboard (and our unit tests) no longer depend on a 195 entry dependency tree.
 *
 * Supported config (the wds subset): `rootDir`, `appIndex`, `nodeResolve`, `moduleDirs`,
 * `middleware`, `open`, `port`, `hostname` (and its legacy alias `host`). `watch` is accepted and
 * ignored: this server does not watch.
 *
 * Resolving bare specifiers is the one non-trivial part - it is what `nodeResolve: true` did before
 * - and it reuses the resolver the analyzer itself uses, so the browser gets the same file
 * (the `import` condition, `module` field, `.mjs`).
 */

/**
 * @typedef {import('#types/index.js').MiniDevServerConfig} MiniDevServerConfig
 * @typedef {import('#types/index.js').MiniDevServer} MiniDevServer
 * @typedef {(ctx: { url: string; type?: string; body?: unknown }, next: () => Promise<unknown>) => Promise<unknown> | undefined} Middleware
 * @typedef {{ url: string; type?: string; body?: unknown }} RequestContext
 */

const MIME_TYPES = /** @type {Record<string, string>} */ ({
  '.css': 'text/css',
  '.html': 'text/html',
  '.ico': 'image/x-icon',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.map': 'application/json',
  '.mjs': 'text/javascript',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain',
  '.wasm': 'application/wasm',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
});

const JS_EXTENSIONS = ['.js', '.mjs'];

/**
 * AST nodes that carry a module specifier. `ExportNamedDeclaration.source` is `null` for
 * `export { x }` - the value check when collecting them covers that.
 */
const SPECIFIER_NODE_KEYS = /** @type {Record<string, string>} */ ({
  ExportAllDeclaration: 'source',
  ExportNamedDeclaration: 'source',
  ImportDeclaration: 'source',
  ImportExpression: 'source',
});

/**
 * @param {string} specifier
 * @returns {boolean} true for 'lit-element', '@lion/ui/x.js', '#internal' - false for './x.js', '/x.js'
 */
function isBareSpecifier(specifier) {
  if (specifier.startsWith('.') || specifier.startsWith('/')) {
    return false;
  }
  // URL-ish (data:, http:, node:) is left alone
  return !/^[a-z][a-z0-9+.-]*:/i.test(specifier);
}

/**
 * Collects every module specifier with its position, by walking the AST. Walking the AST (instead of
 * matching a pattern) is what keeps specifier-like text inside comments, strings or `import.meta`
 * untouched.
 * @param {import('oxc-parser').Program} program
 * @returns {{ start: number; end: number; value: string }[]}
 */
function collectSpecifierNodes(program) {
  /** @type {{ start: number; end: number; value: string }[]} */
  const specifierNodes = [];

  /**
   * @param {*} node
   */
  const visit = node => {
    if (!node || typeof node !== 'object') {
      return;
    }
    if (Array.isArray(node)) {
      node.forEach(visit);
      return;
    }
    const sourceKey = SPECIFIER_NODE_KEYS[node.type];
    if (sourceKey) {
      const sourceNode = node[sourceKey];
      if (
        sourceNode &&
        typeof sourceNode.value === 'string' &&
        typeof sourceNode.start === 'number'
      ) {
        specifierNodes.push(sourceNode);
      }
    }
    Object.keys(node).forEach(key => visit(node[key]));
  };

  visit(program);
  return specifierNodes;
}

/**
 * @param {string} pathStr
 * @returns {string}
 */
function toPosixPath(pathStr) {
  return pathStr.split(path.sep).join('/');
}

/**
 * @param {MiniDevServerConfig} config
 */
function createResolver(config) {
  // `modules` mirrors the old `moduleDirs`: where to look for packages.
  return new ResolverFactory({
    modules: config.moduleDirs ? [config.moduleDirs, 'node_modules'] : ['node_modules'],
    extensions: ['.js', '.mjs', '.json'],
    conditionNames: ['import', 'module', 'default'],
    mainFields: ['module', 'main'],
  });
}

/**
 * @param {MiniDevServerConfig} config
 */
function createBareSpecifierRewriter(config) {
  const resolver = createResolver(config);

  /**
   * Serves a package file as `/node_modules/<name>/<file>`. The resolver tells us the real path (it
   * may go through a symlinked or hoisted node_modules, as npm, yarn and pnpm all do), the served
   * url only needs the part below node_modules - the static handler resolves it back per request.
   * @param {string} resolvedPath
   * @returns {string | undefined}
   */
  function toServedUrl(resolvedPath) {
    const modulesSegment = `${path.sep}node_modules${path.sep}`;
    const modulesIndex = resolvedPath.lastIndexOf(modulesSegment);
    if (modulesIndex !== -1) {
      const innerPath = resolvedPath.slice(modulesIndex + modulesSegment.length);
      if (fsAdapter.fs.existsSync(resolvedPath)) {
        return `/node_modules/${toPosixPath(innerPath)}`;
      }
    }
    const relativePath = path.relative(config.rootDir, resolvedPath);
    if (relativePath.startsWith('..')) {
      return undefined;
    }
    return `/${toPosixPath(relativePath)}`;
  }

  /**
   * @param {string} code
   * @param {string} filePath
   * @returns {string}
   */
  return function rewriteBareSpecifiers(code, filePath) {
    const parsed = parseSync(filePath, code);
    if (parsed.errors && parsed.errors.length) {
      // Not something a browser could run as a module anyway
      return code;
    }

    /**
     * @param {{ start: number; end: number; value: string }} specifierNode
     * @returns {{ start: number; end: number; text: string } | undefined}
     */
    function getReplacement(specifierNode) {
      const rawSpecifier = code.slice(specifierNode.start, specifierNode.end);
      const quote = rawSpecifier[0];
      // Sanity check: when the offsets do not line up with the source, we leave the file untouched
      if (quote !== "'" && quote !== '"') {
        return undefined;
      }
      if (rawSpecifier.slice(1, -1) !== specifierNode.value) {
        return undefined;
      }
      if (!isBareSpecifier(specifierNode.value)) {
        return undefined;
      }
      const result = resolver.sync(path.dirname(filePath), specifierNode.value);
      if (!result || result.error || !result.path) {
        return undefined;
      }
      const servedUrl = toServedUrl(result.path);
      if (!servedUrl) {
        return undefined;
      }
      return { start: specifierNode.start + 1, end: specifierNode.end - 1, text: servedUrl };
    }

    const replacements = /** @type {{ start: number; end: number; text: string }[]} */ (
      collectSpecifierNodes(parsed.program).map(getReplacement).filter(Boolean)
    );

    return replacements.reduceRight(
      (result, { start, end, text }) => `${result.slice(0, start)}${text}${result.slice(end)}`,
      code,
    );
  };
}

/**
 * @param {MiniDevServerConfig} config
 * @param {*} ctx
 */
function getResponseBodyForMiddlewareResult(config, ctx) {
  if (ctx.body === undefined) {
    return undefined;
  }
  const body = typeof ctx.body === 'string' ? ctx.body : JSON.stringify(ctx.body);
  return { contentType: ctx.type || 'text/plain', body };
}

/**
 * Serves `/node_modules/<name>/<file>` by resolving the *package* and then appending the file path.
 * Resolving the whole url as one specifier would go through the package's `exports` map, which
 * usually does not expose files like `./index.js` - the browser asks for them anyway.
 * @param {MiniDevServerConfig} config
 * @param {string} urlPath
 * @returns {string | undefined} absolute path on disk
 */
function resolveServedModulePath(config, urlPath) {
  const innerPath = decodeURIComponent(urlPath.replace(/^\/node_modules\//, '').split('?')[0]);
  const [firstSegment, ...remainingSegments] = innerPath.split('/');
  const packageName = firstSegment.startsWith('@')
    ? [firstSegment, remainingSegments.shift()].join('/')
    : firstSegment;

  const resolvedPackage = createResolver(config).sync(config.rootDir, packageName);
  if (!resolvedPackage || resolvedPackage.error || !resolvedPackage.path) {
    return undefined;
  }

  const packageSegment = `${path.sep}node_modules${path.sep}${packageName}`;
  const packageIndex = resolvedPackage.path.indexOf(packageSegment);
  if (packageIndex === -1) {
    return undefined;
  }
  const packageDir = resolvedPackage.path.slice(0, packageIndex + packageSegment.length);
  const filePath = path.join(packageDir, ...remainingSegments);

  // Never serve outside the package directory
  const relativePath = path.relative(packageDir, filePath);
  if (relativePath.startsWith('..') || !fsAdapter.fs.existsSync(filePath)) {
    return undefined;
  }
  return filePath;
}

/**
 * @param {MiniDevServerConfig} config
 * @param {RequestContext} ctx
 * @returns {{ contentType: string; body: string } | null}
 */
function serveStaticFile(config, ctx) {
  const urlPath = decodeURIComponent((ctx.url || '/').split('?')[0]);
  let filePath;

  if (config.appIndex && (urlPath === '/' || urlPath === '')) {
    filePath = config.appIndex;
  } else if (urlPath.startsWith('/node_modules/')) {
    filePath = resolveServedModulePath(config, urlPath);
    if (!filePath) {
      return null;
    }
  } else {
    filePath = path.resolve(config.rootDir, `.${urlPath}`);

    // Never serve outside rootDir
    const relativePath = path.relative(config.rootDir, filePath);
    if (relativePath.startsWith('..') || !fsAdapter.fs.existsSync(filePath)) {
      return null;
    }
  }

  if (fsAdapter.fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, 'index.html');
    if (!fsAdapter.fs.existsSync(filePath)) {
      return null;
    }
  }

  const extension = path.extname(filePath);
  const contentType = MIME_TYPES[extension] || 'application/octet-stream';
  const content = fsAdapter.fs.readFileSync(filePath, 'utf8');

  if (config.nodeResolve && JS_EXTENSIONS.includes(extension)) {
    return {
      contentType,
      body: createBareSpecifierRewriter(config)(content, filePath),
    };
  }
  return { contentType, body: content };
}

/**
 * Runs the middlewares the way connect/koa do, with the static file handler as the last step.
 * @param {MiniDevServerConfig} config
 * @param {RequestContext} ctx
 */
async function runRequest(config, ctx) {
  const middlewares = (config.middleware || []).filter(Boolean);

  /**
   * @param {number} index
   * @returns {Promise<{ contentType: string; body: string } | null>}
   */
  async function next(index) {
    const middleware = middlewares[index];
    if (!middleware) {
      return serveStaticFile(config, ctx);
    }
    await middleware(ctx, () => next(index + 1));
    return getResponseBodyForMiddlewareResult(config, ctx) || serveStaticFile(config, ctx);
  }

  return next(0);
}

/**
 * Opens a url in the default browser. Never fatal: a missing opener is not an error.
 * @param {string} url
 */
function openInBrowser(url) {
  let command = 'xdg-open';
  if (process.platform === 'darwin') {
    command = 'open';
  } else if (process.platform === 'win32') {
    command = 'start';
  }
  try {
    const child = spawn(command, [url], {
      detached: true,
      stdio: 'ignore',
      shell: process.platform === 'win32',
    });
    child.on('error', () => {});
    child.unref();
  } catch (_) {
    // ignore
  }
}

/**
 * Creates the development server, not started yet (like wds's `createServer`).
 * @param {MiniDevServerConfig} config
 * @returns {Promise<MiniDevServer>}
 */
async function createServer(config) {
  const port = config.port === undefined ? 8000 : config.port;
  const hostname = config.hostname || config.host || 'localhost';

  const server = http.createServer((req, res) => {
    /** @type {RequestContext} */
    const ctx = { url: req.url || '/' };
    runRequest(config, ctx)
      .then(result => {
        if (!result) {
          res.writeHead(404, { 'content-type': 'text/plain' });
          res.end(`Not found: ${ctx.url}`);
          return;
        }
        res.writeHead(200, { 'content-type': result.contentType });
        res.end(result.body);
      })
      .catch(error => {
        res.writeHead(500, { 'content-type': 'text/plain' });
        res.end(`Error while serving ${ctx.url}: ${error && error.message}`);
      });
  });

  /** @type {MiniDevServer} */
  const devServer = {
    config,
    server,
    url: '',

    start: async () => {
      if (!server.listening) {
        await new Promise(resolve => {
          server.listen(port, hostname, () => resolve(undefined));
        });
        const address = /** @type {{ port: number }} */ (server.address());
        devServer.url = `http://${hostname}:${address.port}`;
        if (config.open) {
          openInBrowser(devServer.url);
        }
      }
      return devServer;
    },

    stop: async () => {
      if (server.listening) {
        // keep-alive sockets (a browser or fetch pool) would keep the process alive otherwise
        server.closeAllConnections();
        await new Promise(resolve => {
          server.close(() => resolve(undefined));
        });
      }
    },
  };

  return devServer;
}

/**
 * @param {{ config: MiniDevServerConfig }} options
 * @returns {Promise<MiniDevServer>} a started server, like wds's `startDevServer`
 */
async function startDevServer({ config }) {
  const devServer = await createServer(config);
  return devServer.start();
}

/**
 * Starts a server on a random free port, for tests: `{ host, server }`, like the wds test helpers.
 * @param {MiniDevServerConfig} config
 * @returns {Promise<{ host: string; server: MiniDevServer }>}
 */
async function createTestServer(config) {
  const devServer = await startDevServer({ config: { port: 0, ...config } });
  return { host: devServer.url, server: devServer };
}

/**
 * The subset of `@web/dev-server` that providence uses: static files with `rootDir`/`appIndex`,
 * bare specifier rewriting (`nodeResolve`/`moduleDirs`), `middleware`, `port`/`hostname` and `open`.
 * `watch` is accepted for compatibility and ignored.
 */
export const miniDevServer = { createServer, startDevServer, createTestServer };
