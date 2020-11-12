import { expect } from '@open-wc/testing';
import sinon from 'sinon';

import { AjaxClass } from '../src/AjaxClass.js';

describe('AjaxClass transformers', () => {
  /** @type {import('sinon').SinonFakeServer} */
  let server;

  /**
   * @param {Object} [cfg] configuration for the AjaxClass instance
   * @param {string} [cfg.jsonPrefix] prefixing the JSON string in this manner is used to help
   * prevent JSON Hijacking. The prefix renders the string syntactically invalid as a script so
   * that it cannot be hijacked. This prefix should be stripped before parsing the string as JSON.
   * @param {string} [cfg.lang] language
   * @param {boolean} [cfg.languageHeader] the Accept-Language request HTTP header advertises
   * which languages the client is able to understand, and which locale variant is preferred.
   * @param {boolean} [cfg.cancelable] if request can be canceled
   * @param {boolean} [cfg.cancelPreviousOnNewRequest] prevents concurrent requests
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
      ['requestDataTransformers', 'responseDataTransformers'].forEach(type => {
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
      ['requestDataTransformers', 'responseDataTransformers'].forEach(type => {
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
        ['requestDataTransformers', 'responseDataTransformers'].map(async type => {
          server.respondWith('GET', 'data.json', [
            200,
            { 'Content-Type': 'application/json' },
            '{}',
          ]);

          const myTransformer = sinon.spy(foo => foo);

          const ajax = getInstance();

          ajax[type].push(myTransformer);
          await ajax.get('data.json');

          ajax[type] = ajax[type].filter(/** @param {?} item */ item => item !== myTransformer);
          await ajax.get('data.json');

          expect(myTransformer.callCount).to.eql(1);
        }),
      );
    });
  });

  describe('requestDataTransformers', () => {
    it('allow to transform request data', async () => {
      server.respondWith('POST', 'data.json', [
        200,
        { 'Content-Type': 'application/json' },
        '{ "method": "post" }',
      ]);
      const addBarTransformer = /** @param {?} data */ data => ({ ...data, bar: 'bar' });
      const myAjax = getInstance();
      myAjax.requestDataTransformers.push(addBarTransformer);
      const response = await myAjax.post('data.json', { foo: 'foo' });
      expect(JSON.parse(response.config.data)).to.deep.equal({
        foo: 'foo',
        bar: 'bar',
      });
    });
  });

  describe('responseDataTransformers', () => {
    it('allow to transform response data', async () => {
      server.respondWith('GET', 'data.json', [
        200,
        { 'Content-Type': 'application/json' },
        '{ "method": "get" }',
      ]);
      const addBarTransformer = /** @param {?} data */ data => ({ ...data, bar: 'bar' });
      const myAjax = getInstance();
      myAjax.responseDataTransformers.push(addBarTransformer);
      const response = await myAjax.get('data.json');
      expect(response.data).to.deep.equal({ method: 'get', bar: 'bar' });
    });
  });
});
