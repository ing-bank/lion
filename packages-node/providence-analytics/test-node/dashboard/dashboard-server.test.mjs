/* eslint-disable import/no-extraneous-dependencies */
import fs from 'fs';
import pathLib from 'path';
import { fileURLToPath } from 'url';
import { expect } from 'chai';
import fetch from 'node-fetch';
import { createTestServer } from '@web/dev-server-core/test-helpers';
import { createDashboardServerConfig } from '../../dashboard/server.mjs';
import { ReportService } from '../../src/program/core/ReportService.js';

const __dirname = pathLib.dirname(fileURLToPath(import.meta.url));

const { outputPath: reportServiceOutputPathOriginal } = ReportService;
const mockedResponsesPath = pathLib.join(__dirname, 'fixtures/dashboard-responses');
const mockedOutputPath = pathLib.join(__dirname, 'fixtures/providence-output');

/**
 * @typedef {import('@web/dev-server-core').DevServer} DevServer
 */

describe('Dashboard Server', () => {
  /** @type {string} */
  let host;
  /** @type {DevServer} */
  let server;

  before(() => {
    // N.B. don't use mock-fs, since it doesn't correctly handle dynamic imports and fs.promises
    ReportService.outputPath = mockedOutputPath;
  });

  after(() => {
    ReportService.outputPath = reportServiceOutputPathOriginal;
  });

  describe('Happy flow', () => {
    beforeEach(async () => {
      const dashboardConfig = await createDashboardServerConfig();
      ({ host, server } = await createTestServer(dashboardConfig));
    });

    afterEach(() => {
      server.stop();
    });

    describe('Index', () => {
      it(`returns an index on '/'`, async () => {
        const response = await fetch(`${host}/dashboard`);
        const responseText = await response.text();
        expect(response.status).to.equal(200);
        expect(responseText).to.include('<title>Providence dashboard</title>');
      });
    });

    describe('App assets', () => {
      it(`returns (static) js assets via app/*`, async () => {
        const response = await fetch(`${host}/dashboard/app/p-board.js`);
        expect(response.status).to.equal(200);
      });
    });

    describe('Menu data', () => {
      it(`returns json object based on output`, async () => {
        const response = await fetch(`${host}/menu-data.json`);
        expect(response.status).to.equal(200);
        const responseJSON = await response.json();
        const expectedResult = fs.readFileSync(`${mockedResponsesPath}/menu-data.json`, 'utf8');
        expect(responseJSON).to.eql(JSON.parse(expectedResult));
      });
    });

    describe('Results', () => {
      it(`returns json object based on output`, async () => {
        const response = await fetch(`${host}/results.json`);
        expect(response.status).to.equal(200);
        const responseJson = await response.json();
        const expectedResult = fs.readFileSync(`${mockedResponsesPath}/results.json`, 'utf8');
        expect(responseJson).to.eql(JSON.parse(expectedResult));
      });
    });

    describe('Config file "providence.conf.(m)js"', () => {
      it(`returns providence.conf.mjs found in cwd`, async () => {
        const response = await fetch(`${host}/providence-conf.js`);
        expect(response.status).to.equal(200);
        const responseText = await response.text();
        const expectedResult = fs.readFileSync(`${process.cwd()}/providence.conf.mjs`, 'utf8');
        expect(responseText).to.equal(expectedResult);
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
