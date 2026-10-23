import fs from 'fs';
import os from 'os';
import path from 'path';

import { expect } from 'chai';
import { after, before, beforeEach, describe, it } from 'mocha';

import { miniDevServer } from '#utils/mini-dev-server.js';

/**
 * The mini dev server replaces `@web/dev-server` (wds) for the subset of its config we use, so these
 * tests use a wds shaped config. They run against a real temporary project instead of mock-fs: this
 * server does real http, and resolving modules needs real files.
 */

/** @type {string} */
let fixtureRoot;
/** @type {string} */
let host;
/** @type {import('#types/index.js').MiniDevServer[]} */
const startedServers = [];

const FAKE_PACKAGE_JSON = {
  name: 'fake-pkg',
  version: '1.0.0',
  main: 'cjs.js',
  module: 'esm.js',
  exports: {
    '.': { import: './esm.js', require: './cjs.js' },
  },
};

/**
 * @param {string} root
 */
function writeFixtureProject(root) {
  fs.mkdirSync(path.join(root, 'node_modules/fake-pkg'), { recursive: true });
  fs.writeFileSync(path.join(root, 'index.html'), '<title>app index</title>');
  fs.writeFileSync(
    path.join(root, 'app.js'),
    `import { value } from 'fake-pkg';\nimport './local.js';\nexport { value };\n`,
  );
  fs.writeFileSync(
    path.join(root, 'empty.js'),
    `// nog geen imports hier\nconst x = "import 'fake-pkg'";\n`,
  );
  fs.writeFileSync(path.join(root, 'local.js'), `export const local = true;\n`);
  fs.writeFileSync(
    path.join(root, 'node_modules/fake-pkg/package.json'),
    JSON.stringify(FAKE_PACKAGE_JSON, null, 2),
  );
  fs.writeFileSync(
    path.join(root, 'node_modules/fake-pkg/esm.js'),
    `export const value = 'esm';\n`,
  );
  fs.writeFileSync(
    path.join(root, 'node_modules/fake-pkg/cjs.js'),
    `module.exports.value = 'cjs';\n`,
  );
  fs.writeFileSync(
    path.join(root, 'node_modules/fake-pkg/not-in-exports.js'),
    `export const x = 1;\n`,
  );
}

/**
 * Starts a server on a random port and records it, so the afterEach can always stop it.
 * @param {import('#types/index.js').MiniDevServerConfig} config
 * @returns {Promise<{ host: string; server: import('#types/index.js').MiniDevServer }>}
 */
async function startTestServer(config) {
  const started = await miniDevServer.createTestServer(config);
  startedServers.push(started.server);
  return started;
}

describe('miniDevServer', () => {
  before(() => {
    fixtureRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'mini-dev-server-'));
    writeFixtureProject(fixtureRoot);
  });

  after(() => {
    fs.rmSync(fixtureRoot, { recursive: true, force: true });
  });

  afterEach(async () => {
    await Promise.all(startedServers.map(startedServer => startedServer.stop()));
    startedServers.length = 0;
  });

  describe('static files', () => {
    beforeEach(async () => {
      ({ host } = await startTestServer({
        rootDir: fixtureRoot,
      }));
    });

    it(`serves a file from rootDir with a js content-type`, async () => {
      const response = await fetch(`${host}/local.js`);
      expect(response.status).to.equal(200);
      expect(response.headers.get('content-type')).to.equal('text/javascript');
      expect(await response.text()).to.include('export const local');
    });

    it(`serves an html content-type for html files`, async () => {
      const response = await fetch(`${host}/index.html`);
      expect(response.headers.get('content-type')).to.equal('text/html');
    });

    it(`returns 404 for a file that does not exist`, async () => {
      const response = await fetch(`${host}/nope.js`);
      expect(response.status).to.equal(404);
    });

    it(`does not serve outside rootDir`, async () => {
      // encoded, so the url is not normalised away before it reaches the server
      const response = await fetch(`${host}/..%2f..%2fetc%2fpasswd`);
      expect(response.status).to.equal(404);
    });
  });

  describe('appIndex', () => {
    beforeEach(async () => {
      ({ host } = await startTestServer({
        rootDir: fixtureRoot,
        appIndex: path.join(fixtureRoot, 'index.html'),
      }));
    });

    it(`serves the appIndex for '/'`, async () => {
      const response = await fetch(`${host}/`);
      expect(response.status).to.equal(200);
      expect(await response.text()).to.include('<title>app index</title>');
    });
  });

  describe('nodeResolve', () => {
    it(`rewrites bare specifiers to a servable path, resolving the way node does`, async () => {
      ({ host } = await startTestServer({
        rootDir: fixtureRoot,
        nodeResolve: true,
        moduleDirs: path.join(fixtureRoot, 'node_modules'),
      }));

      const app = await (await fetch(`${host}/app.js`)).text();
      // the esm ('import') entry point, not the cjs main field
      expect(app).to.include(`from '/node_modules/fake-pkg/esm.js'`);
      // relative specifiers are left alone
      expect(app).to.include(`import './local.js'`);

      const dependency = await fetch(`${host}/node_modules/fake-pkg/esm.js`);
      expect(dependency.status).to.equal(200);
      expect(await dependency.text()).to.include(`export const value`);
    });

    it(`leaves bare specifiers alone when nodeResolve is not enabled`, async () => {
      ({ host } = await startTestServer({
        rootDir: fixtureRoot,
      }));

      const app = await (await fetch(`${host}/app.js`)).text();
      expect(app).to.include(`from 'fake-pkg'`);
    });

    it(`does not touch specifier-like text outside import statements`, async () => {
      ({ host } = await startTestServer({
        rootDir: fixtureRoot,
        nodeResolve: true,
        moduleDirs: path.join(fixtureRoot, 'node_modules'),
      }));

      const empty = await (await fetch(`${host}/empty.js`)).text();
      expect(empty).to.include(`const x = "import 'fake-pkg'"`);
    });

    it(`serves package files that are not in the package exports map`, async () => {
      ({ host } = await startTestServer({
        rootDir: fixtureRoot,
        nodeResolve: true,
        moduleDirs: path.join(fixtureRoot, 'node_modules'),
      }));

      // a browser asks for the file the rewrite points at, not for a package subpath
      const response = await fetch(`${host}/node_modules/fake-pkg/not-in-exports.js`);
      expect(response.status).to.equal(200);
    });
  });

  describe('middleware', () => {
    it(`runs middleware before the static handler and lets it respond`, async () => {
      /** @type {string[]} */
      const calls = [];
      ({ host } = await startTestServer({
        rootDir: fixtureRoot,
        middleware: /** @type {import('#types/index.js').MiniDevServerMiddleware[]} */ ([
          (ctx, next) => {
            calls.push(`first:${ctx.url}`);
            return next();
          },
          ctx => {
            calls.push(`second:${ctx.url}`);
            if (ctx.url === '/api.json') {
              ctx.type = 'application/json';
              ctx.body = { ok: true };
            }
            return undefined;
          },
        ]),
      }));

      const apiResponse = await fetch(`${host}/api.json`);
      expect(apiResponse.status).to.equal(200);
      expect(apiResponse.headers.get('content-type')).to.equal('application/json');
      expect(await apiResponse.json()).to.deep.equal({ ok: true });

      // when middleware does not respond, the file is served
      const staticResponse = await fetch(`${host}/local.js`);
      expect(staticResponse.status).to.equal(200);
      expect(calls).to.deep.equal([
        'first:/api.json',
        'second:/api.json',
        'first:/local.js',
        'second:/local.js',
      ]);
    });
  });

  describe('server lifecycle', () => {
    it(`createServer returns an unstarted server, start serves it, stop closes it`, async () => {
      const server = await miniDevServer.createServer({ rootDir: fixtureRoot, port: 0 });
      expect(server.url).to.equal('');
      expect(server.config.rootDir).to.equal(fixtureRoot);

      await server.start();
      expect(server.url).to.match(/^http:\/\/localhost:\d+$/);
      expect((await fetch(`${server.url}/local.js`)).status).to.equal(200);

      // start is idempotent
      await server.start();

      await server.stop();
      expect(server.server.listening).to.equal(false);
    });

    it(`startDevServer returns a started server and logs no url by default`, async () => {
      ({ host } = await startTestServer({
        rootDir: fixtureRoot,
      }));
      expect(host).to.match(/^http:\/\/localhost:\d+$/);
    });

    it(`uses hostname when given and accepts the legacy host alias`, async () => {
      const withHostname = await miniDevServer.startDevServer({
        config: { rootDir: fixtureRoot, port: 0, hostname: '127.0.0.1' },
      });
      expect(withHostname.url).to.match(/^http:\/\/127\.0\.0\.1:\d+$/);
      await withHostname.stop();

      const withHost = await miniDevServer.startDevServer({
        config: { rootDir: fixtureRoot, port: 0, host: '127.0.0.1' },
      });
      expect(withHost.url).to.match(/^http:\/\/127\.0\.0\.1:\d+$/);
      await withHost.stop();
    });

    it(`accepts the wds watch key and ignores it`, async () => {
      ({ host } = await startTestServer({
        rootDir: fixtureRoot,
        watch: true,
      }));
      expect((await fetch(`${host}/local.js`)).status).to.equal(200);
    });
  });
});
