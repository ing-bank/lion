import { expect } from '@open-wc/testing';
import sinon from 'sinon';

import { AjaxClass } from '../src/AjaxClass.js';
import { ajax } from '../src/ajax.js';

describe('AjaxClass', () => {
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

  it('sets content type json if passed an object', async () => {
    const myAjax = getInstance();
    server.respondWith('POST', /\/api\/foo/, [200, { 'Content-Type': 'application/json' }, '']);
    await myAjax.post('/api/foo', { a: 1, b: 2 });
    expect(server.requests[0].requestHeaders['Content-Type']).to.include('application/json');
  });

  describe('AjaxClass({ jsonPrefix: "%prefix%" })', () => {
    it('adds new transformer to responseDataTransformers', () => {
      const myAjaxWithout = getInstance({ jsonPrefix: '' });
      const myAjaxWith = getInstance({ jsonPrefix: 'prefix' });
      const lengthWithout = myAjaxWithout.responseDataTransformers.length;
      const lengthWith = myAjaxWith.responseDataTransformers.length;
      expect(lengthWith - lengthWithout).to.eql(1);
    });

    it('allows to customize anti-XSSI prefix', async () => {
      server.respondWith('GET', 'data.json', [
        200,
        { 'Content-Type': 'application/json' },
        'for(;;);{"success":true}',
      ]);

      const myAjax = getInstance({ jsonPrefix: 'for(;;);' });
      const response = await myAjax.get('data.json');
      expect(response.status).to.equal(200);
      expect(response.data.success).to.equal(true);
    });

    it('works with non-JSON responses', async () => {
      server.respondWith('GET', 'data.txt', [200, { 'Content-Type': 'text/plain' }, 'some text']);

      const myAjax = getInstance({ jsonPrefix: 'for(;;);' });
      const response = await myAjax.get('data.txt');
      expect(response.status).to.equal(200);
      expect(response.data).to.equal('some text');
    });
  });

  describe('AjaxClass({ cancelable: true })', () => {
    it('adds new interceptor to requestInterceptors', () => {
      const myAjaxWithout = getInstance();
      const myAjaxWith = getInstance({ cancelable: true });
      const lengthWithout = myAjaxWithout.requestInterceptors.length;
      const lengthWith = myAjaxWith.requestInterceptors.length;
      expect(lengthWith - lengthWithout).to.eql(1);
    });

    it('allows to cancel single running requests', async () => {
      const myAjax = getInstance({ cancelable: true });

      setTimeout(() => {
        myAjax.cancel('is cancelled');
      });

      try {
        await myAjax.get('data.json');
        throw new Error('is not cancelled');
      } catch (error) {
        expect(error.message).to.equal('is cancelled');
      }
    });

    it('allows to cancel multiple running requests', async () => {
      const myAjax = getInstance({ cancelable: true });
      let cancelCount = 0;

      setTimeout(() => {
        myAjax.cancel('is cancelled');
      });

      const makeRequest = async () => {
        try {
          await myAjax.get('data.json');
          throw new Error('is not cancelled');
        } catch (error) {
          expect(error.message).to.equal('is cancelled');
          cancelCount += 1;
        }
      };

      await Promise.all([makeRequest(), makeRequest(), makeRequest()]);

      expect(cancelCount).to.equal(3);
    });

    it('does not cancel resolved requests', async () => {
      const myAjax = getInstance({ cancelable: true });
      server.respondWith('GET', 'data.json', [
        200,
        { 'Content-Type': 'application/json' },
        '{ "method": "get" }',
      ]);

      try {
        const response = await myAjax.get('data.json');
        expect(response.data).to.deep.equal({ method: 'get' });
        myAjax.cancel('is cancelled');
      } catch (error) {
        throw new Error('is cancelled');
      }
    });
  });

  describe('AjaxClass({ cancelPreviousOnNewRequest: true })', () => {
    it('adds new interceptor to requestInterceptors', () => {
      const myAjaxWithout = getInstance();
      const myAjaxWith = getInstance({ cancelPreviousOnNewRequest: true });
      const lengthWithout = myAjaxWithout.requestInterceptors.length;
      const lengthWith = myAjaxWith.requestInterceptors.length;
      expect(lengthWith - lengthWithout).to.eql(1);
    });

    it('automatically cancels previous running request', async () => {
      const myAjax = getInstance({ cancelPreviousOnNewRequest: true });
      server.respondWith('GET', 'data.json', [
        200,
        { 'Content-Type': 'application/json' },
        '{ "method": "get" }',
      ]);

      await Promise.all([
        (async () => {
          try {
            await myAjax.get('data.json');
            throw new Error('is resolved');
          } catch (error) {
            expect(error.message).to.equal('Concurrent requests not allowed.');
          }
        })(),
        (async () => {
          try {
            const response = await myAjax.get('data.json');
            expect(response.data).to.deep.equal({ method: 'get' });
          } catch (error) {
            throw new Error('is not resolved');
          }
        })(),
      ]);
    });

    it('automatically cancels multiple previous requests to the same endpoint', async () => {
      const myAjax = getInstance({ cancelPreviousOnNewRequest: true });
      server.respondWith('GET', 'data.json', [
        200,
        { 'Content-Type': 'application/json' },
        '{ "method": "get" }',
      ]);

      const makeRequest = async () => {
        try {
          await myAjax.get('data.json');
          throw new Error('is resolved');
        } catch (error) {
          expect(error.message).to.equal('Concurrent requests not allowed.');
        }
      };

      await Promise.all([
        makeRequest(),
        makeRequest(),
        makeRequest(),
        (async () => {
          try {
            const response = await myAjax.get('data.json');
            expect(response.data).to.deep.equal({ method: 'get' });
          } catch (error) {
            throw new Error('is not resolved');
          }
        })(),
      ]);
    });

    it('automatically cancels multiple previous requests to different endpoints', async () => {
      const myAjax = getInstance({ cancelPreviousOnNewRequest: true });
      server.respondWith('GET', 'data.json', [
        200,
        { 'Content-Type': 'application/json' },
        '{ "method": "get" }',
      ]);

      const makeRequest = /** @param {string} url */ async url => {
        try {
          await myAjax.get(url);
          throw new Error('is resolved');
        } catch (error) {
          expect(error.message).to.equal('Concurrent requests not allowed.');
        }
      };

      await Promise.all([
        makeRequest('data1.json'),
        makeRequest('data2.json'),
        makeRequest('data3.json'),
        (async () => {
          try {
            const response = await myAjax.get('data.json');
            expect(response.data).to.deep.equal({ method: 'get' });
          } catch (error) {
            throw new Error('is not resolved');
          }
        })(),
      ]);
    });

    it('does not automatically cancel requests made via generic ajax', async () => {
      const myAjax = getInstance({ cancelPreviousOnNewRequest: true });
      server.respondWith('GET', 'data.json', [
        200,
        { 'Content-Type': 'application/json' },
        '{ "method": "get" }',
      ]);

      await Promise.all([
        (async () => {
          try {
            await myAjax.get('data.json');
            throw new Error('is resolved');
          } catch (error) {
            expect(error.message).to.equal('Concurrent requests not allowed.');
          }
        })(),
        (async () => {
          try {
            const response = await myAjax.get('data.json');
            expect(response.data).to.deep.equal({ method: 'get' });
          } catch (error) {
            throw new Error('is not resolved');
          }
        })(),
        (async () => {
          try {
            const response = await ajax.get('data.json');
            expect(response.data).to.deep.equal({ method: 'get' });
          } catch (error) {
            throw new Error('is not resolved');
          }
        })(),
      ]);
    });

    it('does not automatically cancel requests made via other instances', async () => {
      const myAjax1 = getInstance({ cancelPreviousOnNewRequest: true });
      const myAjax2 = getInstance({ cancelPreviousOnNewRequest: true });
      server.respondWith('GET', 'data.json', [
        200,
        { 'Content-Type': 'application/json' },
        '{ "method": "get" }',
      ]);

      await Promise.all([
        (async () => {
          try {
            await myAjax1.get('data.json');
            throw new Error('is resolved');
          } catch (error) {
            expect(error.message).to.equal('Concurrent requests not allowed.');
          }
        })(),
        (async () => {
          try {
            const response = await myAjax2.get('data.json');
            expect(response.data).to.deep.equal({ method: 'get' });
          } catch (error) {
            throw new Error('is not resolved');
          }
        })(),
        (async () => {
          try {
            const response = await myAjax1.get('data.json');
            expect(response.data).to.deep.equal({ method: 'get' });
          } catch (error) {
            throw new Error('is not resolved');
          }
        })(),
      ]);
    });
  });
});
