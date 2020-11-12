import { expect } from '@open-wc/testing';
import sinon from 'sinon';

import { AjaxClass } from '../src/AjaxClass.js';

describe('AjaxClass interceptors', () => {
  /** @type {import('sinon').SinonFakeServer} */
  let server;

  /**
   * @param {Object} [cfg] configuration for the AjaxClass instance
   * @param {string} cfg.jsonPrefix prefixing the JSON string in this manner is used to help
   * prevent JSON Hijacking. The prefix renders the string syntactically invalid as a script so
   * that it cannot be hijacked. This prefix should be stripped before parsing the string as JSON.
   * @param {string} cfg.lang language
   * @param {boolean} cfg.languageHeader the Accept-Language request HTTP header advertises
   * which languages the client is able to understand, and which locale variant is preferred.
   * @param {boolean} cfg.cancelable if request can be canceled
   * @param {boolean} cfg.cancelPreviousOnNewRequest prevents concurrent requests
   */
  function getInstance(cfg) {
    return new AjaxClass(cfg);
  }

  beforeEach(() => {
    server = sinon.fakeServer.create({ autoRespond: true });
  });

  afterEach(() => {
    server.restore();
  });

  describe('use cases', () => {
    it('can be added on a class for all instances', () => {
      ['requestInterceptors', 'responseInterceptors'].forEach(type => {
        const myInterceptor = () => {};
        class MyApi extends AjaxClass {
          constructor() {
            super();
            this[type] = [...this[type], myInterceptor];
          }
        }
        const ajaxWithout = getInstance();
        const ajaxWith = new MyApi();
        expect(ajaxWithout[type]).to.not.include(myInterceptor);
        expect(ajaxWith[type]).to.include(myInterceptor);
      });
    });

    it('can be added per instance without changing the class', () => {
      ['requestInterceptors', 'responseInterceptors'].forEach(type => {
        const myInterceptor = () => {};
        const ajaxWithout = getInstance();
        const ajaxWith = getInstance();
        ajaxWith[type].push(myInterceptor);
        expect(ajaxWithout[type]).to.not.include(myInterceptor);
        expect(ajaxWith[type]).to.include(myInterceptor);
      });
    });

    it('can be removed after request', async () => {
      await Promise.all(
        ['requestInterceptors', 'responseInterceptors'].map(async type => {
          server.respondWith('GET', 'data.json', [
            200,
            { 'Content-Type': 'application/json' },
            '{}',
          ]);

          const myInterceptor = sinon.spy(foo => foo);

          const ajax = getInstance();

          ajax[type].push(myInterceptor);
          await ajax.get('data.json');

          ajax[type] = ajax[type].filter(/** @param {?} item */ item => item !== myInterceptor);
          await ajax.get('data.json');

          expect(myInterceptor.callCount).to.eql(1);
        }),
      );
    });

    it('has access to provided instance config(options) on requestInterceptors', async () => {
      server.respondWith('GET', 'data.json', [200, { 'Content-Type': 'application/json' }, '{}']);
      const ajax = getInstance();
      // @ts-ignore setting a prop that isn't existing on options
      ajax.options.myCustomValue = 'foo';
      let customValueAccess = false;
      const myInterceptor = /** @param {{[key: string]: ?}} config */ config => {
        customValueAccess = config.myCustomValue === 'foo';
        return config;
      };
      // @ts-ignore butchered something here..
      ajax.requestInterceptors.push(myInterceptor);
      await ajax.get('data.json');
      expect(customValueAccess).to.eql(true);
    });
  });

  describe('requestInterceptors', () => {
    it('allow to intercept request to change config', async () => {
      server.respondWith('POST', 'data.json', [
        200,
        { 'Content-Type': 'application/json' },
        '{ "method": "post" }',
      ]);
      server.respondWith('PUT', 'data.json', [
        200,
        { 'Content-Type': 'application/json' },
        '{ "method": "put" }',
      ]);
      const enforcePutInterceptor = /** @param {{[key: string]: ?}} config */ config => ({
        ...config,
        method: 'PUT',
      });
      const myAjax = getInstance();
      // @ts-ignore butchered something here..
      myAjax.requestInterceptors.push(enforcePutInterceptor);
      const response = await myAjax.post('data.json');
      expect(response.data).to.deep.equal({ method: 'put' });
    });
  });

  describe('responseInterceptors', () => {
    it('allow to intercept response to change data', async () => {
      server.respondWith('GET', 'data.json', [
        200,
        { 'Content-Type': 'application/json' },
        '{ "method": "get" }',
      ]);
      const addDataInterceptor = /** @param {{[key: string]: ?}} config */ config => ({
        ...config,
        data: { ...config.data, foo: 'bar' },
      });
      const myAjax = getInstance();
      // @ts-ignore I probably butchered the types here or adding data like above is simply not allowed in Response objects
      myAjax.responseInterceptors.push(addDataInterceptor);
      const response = await myAjax.get('data.json');
      expect(response.data).to.deep.equal({ method: 'get', foo: 'bar' });
    });
  });
});
