/* eslint-disable import/no-extraneous-dependencies */
import { fileURLToPath, pathToFileURL } from 'url';
import pathLib from 'path';
import sinon from 'sinon';

import { expect } from 'chai';
import { it } from 'mocha';

import { providenceConfUtil } from '#utils/providence-conf-util.js';
import { createDashboardServerConfig } from '#dashboard/server.js';
import { miniDevServer } from '#utils/mini-dev-server.js';
import { ReportService } from '#core/ReportService.js';
import { fsAdapter } from '#utils/fs-adapter.js';

/**
 * @typedef {import('#types/index.js').MiniDevServer} DevServer
 */

const __dirname = pathLib.dirname(fileURLToPath(import.meta.url));
const { outputPath: reportServiceOutputPathOriginal } = ReportService;
const fixturesPath = pathLib.join(__dirname, 'fixtures');
const mockedResponsesPath = pathLib.join(__dirname, 'fixtures/dashboard-responses');
const mockedOutputPath = pathLib.join(__dirname, 'fixtures/providence-output');

/**
 * @param {string} url
 */
async function getConf(url) {
  const { href } = pathToFileURL(url);
  const { default: providenceConf } = await import(href);
  const providenceConfRaw = fsAdapter.fs.readFileSync(url, 'utf8');
  return { providenceConf, providenceConfRaw };
}

describe('Dashboard Server', () => {
  const [nodeMajor] = process.versions.node.split('.').map(Number);

  if (nodeMajor < 18) {
    // Skipping tests for now, since nopde < 18 will be phased out and we want to use native fetch...
    return;
  }

  /** @type {string} */
  let host;
  /** @type {DevServer} */
  let server;
  /** @type {sinon.SinonStub} */
  let providenceConfStub;

  before(() => {
    // N.B. don't use mock-fs, since it doesn't correctly handle dynamic imports and fsAdapter.fs.promises
    ReportService.outputPath = mockedOutputPath;
  });

  after(() => {
    ReportService.outputPath = reportServiceOutputPathOriginal;
  });

  describe('Happy flow', () => {
    beforeEach(async () => {
      const conf = await getConf(`${fixturesPath}/providence.conf.mjs`);
      providenceConfStub = sinon.stub(providenceConfUtil, 'getConf').resolves(conf);
      // miniDevServer is a drop-in for @web/dev-server, so tests use the same config as the CLI
      ({ host, server } = await miniDevServer.createTestServer(
        await createDashboardServerConfig(),
      ));
    });

    afterEach(async () => {
      providenceConfStub.restore();
      await server.stop();
    });

    describe('Index', () => {
      it(`returns an index on '/'`, async () => {
        const response = await fetch(`${host}/src/dashboard`);
        const responseText = await response.text();
        expect(response.status).to.equal(200);
        expect(responseText).to.include('<title>Providence dashboard</title>');
      });
    });

    describe('App assets', () => {
      it(`returns (static) js assets via app/*`, async () => {
        const response = await fetch(`${host}/src/dashboard/app/p-board.js`);
        expect(response.status).to.equal(200);
      });

      it(`rewrites bare specifiers to paths the browser can fetch`, async () => {
        const response = await fetch(`${host}/src/dashboard/app/p-board.js`);
        const responseText = await response.text();

        // `import { LitElement } from 'lit-element'` becomes a servable path
        expect(responseText).to.include("from '/node_modules/lit-element/index.js'");

        const dependency = await fetch(`${host}/node_modules/lit-element/index.js`);
        expect(dependency.status).to.equal(200);
      });

      it(`returns 404 for paths outside the served root`, async () => {
        // encoded, so the url is not normalised away before it reaches the server
        const response = await fetch(`${host}/..%2f..%2fetc%2fpasswd`);
        expect(response.status).to.equal(404);
      });
    });

    describe('Menu data', () => {
      it(`returns json object based on output`, async () => {
        const response = await fetch(`${host}/menu-data.json`);
        expect(response.status).to.equal(200);
        const responseJSON = await response.json();
        const expectedResult = fsAdapter.fs.readFileSync(
          `${mockedResponsesPath}/menu-data.json`,
          'utf8',
        );
        expect(responseJSON).to.deep.equal(JSON.parse(expectedResult));
      });
    });

    describe('Results', () => {
      it(`returns json object based on output`, async () => {
        const response = await fetch(`${host}/results.json`);
        expect(response.status).to.equal(200);
        const responseJson = await response.json();
        const expectedResult = fsAdapter.fs.readFileSync(
          `${mockedResponsesPath}/results.json`,
          'utf8',
        );
        expect(responseJson).to.deep.equal(JSON.parse(expectedResult));
      });
    });

    describe('Config file "providence.conf.(m)js"', () => {
      it(`returns providence.conf.mjs found in cwd`, async () => {
        const response = await fetch(`${host}/providence-conf.js`);
        expect(response.status).to.equal(200);
        const responseText = await response.text();
        const { providenceConfRaw } = await getConf(`${fixturesPath}/providence.conf.mjs`);
        expect(responseText).to.equal(providenceConfRaw);
      });

      // Since we cannot mock dynamic imports: skip for now...
      it.skip(`returns providence.conf.js found in cwd`, async () => {});
    });
  });

  describe('Unhappy flow', () => {
    // Since we cannot mock dynamic imports: skip for now...
    describe.skip('Config file "providence.conf.(m)js"', () => {
      it(`throws when no providence.conf.(m)js found`, async () => {});

      it(`throws when providence.conf.(m)js is not an esm module`, async () => {});
    });
  });
});
