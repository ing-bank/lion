/* eslint-env mocha */
import { expect } from '@open-wc/testing';
import sinon from 'sinon';

import { ajax } from '../src/ajax.js';

describe('ajax', () => {
  let server;

  beforeEach(() => {
    server = sinon.fakeServer.create({ autoRespond: true });
  });

  afterEach(() => {
    server.restore();
  });

  it('interprets Content-Type of the response by default', async () => {
    server.respondWith('GET', '/path/to/data/', [
      200,
      { 'Content-Type': 'application/json' },
      '{ "json": "yes" }',
    ]);

    const response = await ajax.get('/path/to/data/');
    expect(response.status).to.equal(200);
    expect(response.data).to.deep.equal({ json: 'yes' });
  });

  it('supports signature (url[, config]) for get(), request(), delete(), head()', async () => {
    server.respondWith('data.json', [
      200,
      { 'Content-Type': 'application/json' },
      '{"success": true}',
    ]);
    const makeRequest = async method => {
      const response = await ajax[method]('data.json', { foo: 'bar' });
      expect(response.status).to.equal(200);
      expect(response.data).to.deep.equal({ success: true });
    };
    await Promise.all(['get', 'request', 'delete', 'head'].map(m => makeRequest(m)));
  });

  it('supports signature (url[, data[, config]]) for post(), put(), patch()', async () => {
    server.respondWith('data.json', [
      200,
      { 'Content-Type': 'application/json' },
      '{"success": true}',
    ]);
    const makeRequest = async method => {
      const response = await ajax[method]('data.json', { data: 'foobar' }, { foo: 'bar' });
      expect(response.status).to.equal(200);
      expect(response.data).to.deep.equal({ success: true });
    };
    await Promise.all(['post', 'put', 'patch'].map(m => makeRequest(m)));
  });

  it('supports GET, POST, PUT, DELETE, REQUEST, PATCH and HEAD methods with XSRF token', async () => {
    document.cookie = 'XSRF-TOKEN=test; ';
    server.respondWith('data.json', [
      200,
      { 'Content-Type': 'application/json' },
      '{"success": true}',
    ]);

    const makeRequest = async method => {
      const response = await ajax[method]('data.json');
      expect(response.config.headers['X-XSRF-TOKEN']).to.equal('test');
      expect(response.status).to.equal(200);
      expect(response.data).to.deep.equal({ success: true });
    };

    await Promise.all(
      ['get', 'post', 'put', 'delete', 'request', 'patch', 'head'].map(m => makeRequest(m)),
    );
  });

  it('supports GET, POST, PUT, DELETE, REQUEST, PATCH and HEAD methods without XSRF token', async () => {
    document.cookie = 'XSRF-TOKEN=; ';
    server.respondWith('data.json', [
      200,
      { 'Content-Type': 'application/json' },
      '{"success": true}',
    ]);

    const makeRequest = async method => {
      const response = await ajax[method]('data.json');
      expect(response.config.headers['X-XSRF-TOKEN']).to.equal(undefined);
      expect(response.status).to.equal(200);
      expect(response.data).to.deep.equal({ success: true });
    };

    await Promise.all(
      ['get', 'post', 'put', 'delete', 'request', 'patch', 'head'].map(m => makeRequest(m)),
    );
  });

  it('supports empty responses', async () => {
    server.respondWith('GET', 'data.json', [200, { 'Content-Type': 'application/json' }, '']);

    const response = await ajax.get('data.json');
    expect(response.status).to.equal(200);
    expect(response.data).to.equal('');
  });

  it('supports error responses', async () => {
    server.respondWith('GET', 'data.json', [500, { 'Content-Type': 'application/json' }, '']);

    try {
      await ajax.get('data.json');
      throw new Error('error is not handled');
    } catch (error) {
      expect(error).to.be.an.instanceof(Error);
      expect(error.response.status).to.equal(500);
    }
  });

  it('supports non-JSON responses', async () => {
    server.respondWith('GET', 'data.txt', [200, { 'Content-Type': 'text/plain' }, 'some text']);

    const response = await ajax.get('data.txt');
    expect(response.status).to.equal(200);
    expect(response.data).to.equal('some text');
  });
});
