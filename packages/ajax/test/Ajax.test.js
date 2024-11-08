import { expect } from '@open-wc/testing';
import { stub, useFakeTimers } from 'sinon';
import { Ajax, AjaxFetchError } from '@lion/ajax';

describe('Ajax', () => {
  /** @type {import('sinon').SinonStub} */
  let fetchStub;
  /** @type {Ajax} */
  let ajax;

  let responseId = 1;

  const responseInit = () => ({
    headers: {
      // eslint-disable-next-line no-plusplus
      'x-request-id': `${responseId++}`,
      'content-type': 'application/json',
      'x-custom-header': 'y-custom-value',
    },
  });

  beforeEach(() => {
    fetchStub = stub(window, 'fetch');
    fetchStub.callsFake(() => Promise.resolve(new Response('mock response', responseInit())));
    ajax = new Ajax();
  });

  afterEach(() => {
    fetchStub.restore();
  });

  describe('options', () => {
    it('creates options object by expanding cacheOptions', async () => {
      // Given
      const getCacheIdentifier = () => '_DEFAULT_CACHE_ID';
      const config = {
        jsonPrefix: ")]}',",
        cacheOptions: {
          useCache: true,
          maxAge: 1000 * 60 * 5, // 5 minutes
          getCacheIdentifier,
        },
      };
      const expected = {
        addAcceptLanguage: true,
        addCaching: false,
        xsrfCookieName: 'XSRF-TOKEN',
        xsrfHeaderName: 'X-XSRF-TOKEN',
        xsrfTrustedOrigins: [],
        jsonPrefix: ")]}',",
        cacheOptions: {
          useCache: true,
          maxAge: 300000,
          getCacheIdentifier,
        },
      };
      // When
      const ajax1 = new Ajax(config);
      const result = ajax1.options;
      // Then
      expect(result).to.deep.equal(expected);
    });

    it('has default getCacheIdentifier function when cacheOptions does not provide one', async () => {
      // Given
      const config = {
        cacheOptions: {
          useCache: true,
          maxAge: 1000 * 60 * 5, // 5 minutes
        },
      };
      // When
      // TODO: fix AjaxConfig types => e.g. create FullAjaxConfig with everything "mandatory" and then AjaxConfig (= Partial of it) for user
      // @ts-ignore
      const ajax1 = new Ajax(config);

      const defaultCacheIdentifierFunction = /** @type {() =>  void} */ (
        ajax1.options?.cacheOptions?.getCacheIdentifier
      );
      // Then
      expect(defaultCacheIdentifierFunction).not.to.be.undefined;
      expect(defaultCacheIdentifierFunction).to.be.a('function');
      expect(defaultCacheIdentifierFunction()).to.equal('_default');
    });

    it('can set options through a setter after the object has been created', () => {
      // Given
      const ajax1 = new Ajax({ jsonPrefix: 'prefix1' });
      expect(ajax1.options.jsonPrefix).to.equal('prefix1');

      // When
      ajax1.options = { ...ajax1.options, jsonPrefix: 'prefix2' };

      // Then
      expect(ajax1.options.jsonPrefix).to.equal('prefix2');
    });
  });

  describe('fetch()', () => {
    it('calls fetch with the given args, returning the result', async () => {
      const response = await ajax.fetch('/foo', { method: 'POST' });
      const responseText = await response.text();

      expect(fetchStub).to.have.been.calledOnce;
      const request = fetchStub.getCall(0).args[0];
      expect(request.url).to.equal(`${window.location.origin}/foo`);
      expect(request.method).to.equal('POST');
      expect(responseText).to.equal('mock response');
      expect(response.headers.get('Content-Type')).to.equal('application/json');
      expect(response.headers.get('X-Custom-Header')).to.equal('y-custom-value');
    });

    it('throws on 4xx responses', async () => {
      fetchStub.returns(Promise.resolve(new Response('', { status: 400 })));

      let thrown = false;
      try {
        await ajax.fetch('/foo');
      } catch (e) {
        // https://github.com/microsoft/TypeScript/issues/20024 open issue, can't type catch clause in param
        const _e = /** @type {AjaxFetchError} */ (e);
        expect(_e).to.be.an.instanceOf(AjaxFetchError);
        expect(_e.request).to.be.an.instanceOf(Request);
        expect(_e.response).to.be.an.instanceOf(Response);
        thrown = true;
      }
      expect(thrown).to.be.true;
    });

    it('throws on 5xx responses', async () => {
      fetchStub.returns(Promise.resolve(new Response('', { status: 599 })));

      let thrown = false;
      try {
        await ajax.fetch('/foo');
      } catch (e) {
        // https://github.com/microsoft/TypeScript/issues/20024 open issue, can't type catch clause in param
        const _e = /** @type {AjaxFetchError} */ (e);
        expect(_e).to.be.an.instanceOf(AjaxFetchError);
        expect(_e.request).to.be.an.instanceOf(Request);
        expect(_e.response).to.be.an.instanceOf(Response);
        thrown = true;
      }
      expect(thrown).to.be.true;
    });

    it('throws on 4xx responses, will allow parsing response manually', async () => {
      ajax.addRequestInterceptor(async () => new Response('my response', { status: 400 }));

      let thrown = false;
      try {
        await ajax.fetch('/foo');
      } catch (e) {
        // https://github.com/microsoft/TypeScript/issues/20024 open issue, can't type catch clause in param
        const _e = /** @type {AjaxFetchError} */ (e);
        expect(_e).to.be.an.instanceOf(AjaxFetchError);
        expect(_e.request).to.be.an.instanceOf(Request);
        expect(_e.response).to.be.an.instanceOf(Response);
        const body = await _e.response.text();
        expect(body).to.equal('my response');
        thrown = true;
      }
      expect(thrown).to.be.true;
    });
  });

  describe('fetchJson', () => {
    beforeEach(() => {
      fetchStub.returns(Promise.resolve(new Response('{}')));
    });

    it('sets json accept header', async () => {
      await ajax.fetchJson('/foo');
      const request = fetchStub.getCall(0).args[0];
      expect(request.headers.get('accept')).to.equal('application/json');
    });

    it('decodes response from json', async () => {
      fetchStub.returns(Promise.resolve(new Response('{"a":1,"b":2}', responseInit())));
      const response = await ajax.fetchJson('/foo');
      expect(response.body).to.eql({ a: 1, b: 2 });
      expect(response.response.headers.get('Content-Type')).to.equal('application/json');
      expect(response.response.headers.get('X-Custom-Header')).to.equal('y-custom-value');
    });

    it('handles non-json responses', async () => {
      fetchStub.returns(Promise.resolve(new Response('!@#$')));
      const response = await ajax.fetchJson('/foo');
      expect(response.body).to.eql('!@#$');
    });

    it('tries to parse Response body as JSON if the content-type header is missing', async () => {
      fetchStub.restore();
      fetchStub = stub(window, 'fetch');
      fetchStub.callsFake(() => {
        const resp = new Response('{"a":1,"b":2}', {
          headers: {
            // eslint-disable-next-line no-plusplus
            'x-request-id': `${responseId++}`,
          },
        });
        resp.headers.delete('content-type');
        return Promise.resolve(resp);
      });
      const response = await ajax.fetchJson('/foo');
      expect(response.body).to.eql({ a: 1, b: 2 });
    });

    it('throws on 4xx responses, but still attempts parsing response body when using fetchJson', async () => {
      ajax.addRequestInterceptor(async () => new Response('my response', { status: 400 }));

      let thrown = false;
      try {
        await ajax.fetchJson('/foo');
      } catch (e) {
        // https://github.com/microsoft/TypeScript/issues/20024 open issue, can't type catch clause in param
        const _e = /** @type {AjaxFetchError} */ (e);
        expect(_e).to.be.an.instanceOf(AjaxFetchError);
        expect(_e.request).to.be.an.instanceOf(Request);
        expect(_e.response).to.be.an.instanceOf(Response);
        expect(_e.body).to.equal('my response');
        const bodyFromResponse = await _e.response.text();
        expect(bodyFromResponse).to.equal('my response');
        thrown = true;
      }
      expect(thrown).to.be.true;
    });

    describe('given a request body', () => {
      it('encodes the request body as json', async () => {
        await ajax.fetchJson('/foo', { method: 'POST', body: { a: 1, b: 2 } });
        const request = fetchStub.getCall(0).args[0];
        expect(await request.text()).to.equal('{"a":1,"b":2}');
      });

      it('sets json content-type header', async () => {
        await ajax.fetchJson('/foo', { method: 'POST', body: { a: 1, b: 2 } });
        const request = fetchStub.getCall(0).args[0];
        expect(request.headers.get('content-type')).to.equal('application/json');
      });
    });

    describe('given a json prefix', () => {
      it('strips json prefix from response before decoding', async () => {
        const localAjax = new Ajax({ jsonPrefix: '//.,!' });
        fetchStub.returns(Promise.resolve(new Response('//.,!{"a":1,"b":2}', responseInit())));
        const response = await localAjax.fetchJson('/foo');
        expect(response.body).to.eql({ a: 1, b: 2 });
      });
    });

    it('throws on invalid JSON responses', async () => {
      fetchStub.returns(Promise.resolve(new Response('invalid-json', responseInit())));

      let thrown = false;
      try {
        await ajax.fetchJson('/foo');
      } catch (e) {
        // https://github.com/microsoft/TypeScript/issues/20024 open issue, can't type catch clause in param
        const _e = /** @type {Error} */ (e);
        expect(_e).to.be.an.instanceOf(Error);
        expect(_e.message).to.equal('Failed to parse response from  as JSON.');
        thrown = true;
      }
      expect(thrown).to.be.true;
    });

    it('doesnt throw on empty response', async () => {
      fetchStub.returns(Promise.resolve(new Response('', responseInit())));

      const { response } = await ajax.fetchJson('/foo');
      expect(response.ok);
    });

    describe('addResponseJsonInterceptor', () => {
      it('adds a function which intercepts the parsed response body JSON object', async () => {
        ajax.addResponseJsonInterceptor(async jsonObject => ({
          ...jsonObject,
          intercepted: true,
        }));
        fetchStub.returns(Promise.resolve(new Response('{"a":1,"b":2}', responseInit())));

        const response = await ajax.fetchJson('/foo');

        expect(response.body).to.eql({ a: 1, b: 2, intercepted: true });
      });

      it('does not serialize/deserialize the JSON object after intercepting', async () => {
        let interceptorJsonObject;
        ajax.addResponseJsonInterceptor(async jsonObject => {
          interceptorJsonObject = {
            ...jsonObject,
          };
          return interceptorJsonObject;
        });
        fetchStub.returns(Promise.resolve(new Response('{"a":1,"b":2}', responseInit())));

        const response = await ajax.fetchJson('/foo');

        expect(response.body).to.equal(interceptorJsonObject);
      });

      it('provides response object to the interceptor', async () => {
        let interceptorResponse;
        ajax.addResponseJsonInterceptor(async (jsonObject, response) => {
          interceptorResponse = response;
          return jsonObject;
        });
        const mockedResponse = new Response('{"a":1,"b":2}', responseInit());
        fetchStub.returns(Promise.resolve(mockedResponse));

        await ajax.fetchJson('/foo');

        expect(interceptorResponse).to.equal(mockedResponse);
      });
    });
  });

  describe('request and response interceptors', () => {
    it('addRequestInterceptor() adds a function which intercepts the request', async () => {
      ajax.addRequestInterceptor(async r => new Request(`${r.url}/intercepted-1`));
      ajax.addRequestInterceptor(async r => new Request(`${r.url}/intercepted-2`));

      await ajax.fetch('/foo', { method: 'POST' });

      const request = fetchStub.getCall(0).args[0];
      expect(request.url).to.equal(`${window.location.origin}/foo/intercepted-1/intercepted-2`);
    });

    it('addResponseInterceptor() adds a function which intercepts the response', async () => {
      ajax.addResponseInterceptor(async r => {
        const { status, statusText, headers } = r;
        const body = await r.text();
        return new Response(`${body} intercepted-1`, { status, statusText, headers });
      });

      ajax.addResponseInterceptor(async r => {
        const { status, statusText, headers } = r;
        const body = await r.text();
        return new Response(`${body} intercepted-2`, { status, statusText, headers });
      });

      const response = await (await ajax.fetch('/foo', { method: 'POST' })).text();
      expect(response).to.equal('mock response intercepted-1 intercepted-2');
    });

    it('removeRequestInterceptor() removes a request interceptor', async () => {
      const interceptor1 = /** @param {Request} r */ async r =>
        new Request(`${r.url}/intercepted-1`);
      const interceptor2 = /** @param {Request} r */ async r =>
        new Request(`${r.url}/intercepted-2`);
      const interceptor3 = /** @param {Request} r */ async r =>
        new Request(`${r.url}/intercepted-3`);

      ajax.addRequestInterceptor(interceptor1);
      ajax.addRequestInterceptor(interceptor2);
      ajax.addRequestInterceptor(interceptor3);
      ajax.removeRequestInterceptor(interceptor1);

      await ajax.fetch('/foo', { method: 'POST' });

      const request = fetchStub.getCall(0).args[0];
      expect(request.url).to.equal(`${window.location.origin}/foo/intercepted-2/intercepted-3`);
    });

    it('removeResponseInterceptor() removes a request interceptor', async () => {
      const interceptor = /** @param {Response} r */ r => `${r} intercepted-1`;
      // @ts-expect-error we're mocking the response as a simple promise which returns a string
      ajax.addResponseInterceptor(interceptor);
      // @ts-expect-error we're mocking the response as a simple promise which returns a string
      ajax.removeResponseInterceptor(interceptor);

      const response = await ajax.fetch('/foo', { method: 'POST' });
      const text = await response.text();
      expect(text).to.equal('mock response');
    });

    it('returns the original request object', async () => {
      ajax.addRequestInterceptor(async () => new Response('my response', { status: 200 }));

      const response = /** @type {import('../types/types.js').CacheResponse} */ (
        await await ajax.fetch('/foo')
      );
      expect(response.request).to.be.an.instanceOf(Request);
    });

    it('throws on 4xx responses returned from request interceptor', async () => {
      ajax.addRequestInterceptor(async () => new Response('my response', { status: 400 }));

      let thrown = false;
      try {
        await ajax.fetch('/foo');
      } catch (e) {
        // https://github.com/microsoft/TypeScript/issues/20024 open issue, can't type catch clause in param
        const _e = /** @type {AjaxFetchError} */ (e);
        expect(_e).to.be.an.instanceOf(AjaxFetchError);
        expect(_e.request).to.be.an.instanceOf(Request);
        expect(_e.response).to.be.an.instanceOf(Response);
        thrown = true;
      }
      expect(thrown).to.be.true;
    });
  });

  describe('accept-language header', () => {
    it('is set by default based on localize.locale', async () => {
      await ajax.fetch('/foo');
      const request = fetchStub.getCall(0).args[0];
      expect(request.headers.get('accept-language')).to.equal('en');
    });

    it('can be disabled', async () => {
      const customAjax = new Ajax({ addAcceptLanguage: false });
      await customAjax.fetch('/foo');
      const request = fetchStub.getCall(0).args[0];
      expect(request.headers.has('accept-language')).to.be.false;
    });
  });

  describe('XSRF token', () => {
    /** @type {import('sinon').SinonStub} */
    let cookieStub;
    beforeEach(() => {
      cookieStub = stub(document, 'cookie');
      cookieStub.get(() => 'foo=bar;XSRF-TOKEN=1234; CSRF-TOKEN=5678;lorem=ipsum;');
    });

    afterEach(() => {
      cookieStub.restore();
    });

    it('XSRF token header is set based on cookie', async () => {
      await ajax.fetch('/foo', { method: 'POST' });

      const request = fetchStub.getCall(0).args[0];
      expect(request.headers.get('X-XSRF-TOKEN')).to.equal('1234');
    });

    it('XSRF behavior can be disabled', async () => {
      const customAjax = new Ajax({ xsrfCookieName: null, xsrfHeaderName: null });
      await customAjax.fetch('/foo', { method: 'POST' });
      await ajax.fetch('/foo');

      const request = fetchStub.getCall(0).args[0];
      expect(request.headers.has('X-XSRF-TOKEN')).to.be.false;
    });

    it('XSRF token header and cookie can be customized', async () => {
      const customAjax = new Ajax({
        xsrfCookieName: 'CSRF-TOKEN',
        xsrfHeaderName: 'X-CSRF-TOKEN',
      });
      await customAjax.fetch('/foo', { method: 'POST' });

      const request = fetchStub.getCall(0).args[0];
      expect(request.headers.get('X-CSRF-TOKEN')).to.equal('5678');
    });

    it('should not set the XSRF header when a non updating method is used', async () => {
      await ajax.fetch('/foo', { method: 'GET' });

      const request = fetchStub.getCall(0).args[0];
      expect(request.headers.get('X-XSRF-TOKEN')).to.be.null;
    });

    it('should not set the XSRF header if the url is from a different origin', async () => {
      await ajax.fetch('https://api.localhost:8000/foo', { method: 'POST' });

      const request = fetchStub.getCall(0).args[0];
      expect(request.headers.get('X-XSRF-TOKEN')).to.be.null;
    });

    it('should set the XSRF header if origin is the same', async () => {
      await ajax.fetch('/foo', { method: 'POST' });

      const request = fetchStub.getCall(0).args[0];
      expect(request.headers.get('X-XSRF-TOKEN')).to.equal('1234');
    });

    it('should set the XSRF header if origin is in the trusted origin list', async () => {
      const customAjax = new Ajax({
        xsrfTrustedOrigins: ['https://api.localhost'],
      });

      await customAjax.fetch('https://api.localhost/foo', { method: 'POST' });

      const request = fetchStub.getCall(0).args[0];
      expect(request.headers.get('X-XSRF-TOKEN')).to.equal('1234');
    });
  });

  describe('Caching', () => {
    /** @type {number | undefined} */
    let cacheId;
    /** @type {() => string} */
    let getCacheIdentifier;
    /** @type {() => Promise<string>} */
    let getCacheIdentifierAsync;

    const newCacheId = () => {
      if (!cacheId) {
        cacheId = 1;
      } else {
        cacheId += 1;
      }
      return cacheId;
    };

    beforeEach(() => {
      getCacheIdentifier = () => String(cacheId);
      getCacheIdentifierAsync = () => Promise.resolve(String(cacheId));
    });

    it('does not add cache interceptors when useCache is turned off', () => {
      const customAjax = new Ajax({
        cacheOptions: {
          maxAge: 100,
          getCacheIdentifier,
        },
      });

      expect(customAjax._requestInterceptors.length).to.equal(2);
      expect(customAjax._responseInterceptors.length).to.equal(0);
    });

    it('adds cache interceptors when useCache is turned on', () => {
      const customAjax = new Ajax({
        cacheOptions: {
          useCache: true,
          maxAge: 100,
          getCacheIdentifier,
        },
      });

      expect(customAjax._requestInterceptors.length).to.equal(3);
      expect(customAjax._responseInterceptors.length).to.equal(1);
    });

    it('adds cache interceptors when addCaching is turned on', () => {
      const customAjax = new Ajax({
        addCaching: true,
        cacheOptions: {
          maxAge: 100,
          getCacheIdentifier,
        },
      });

      expect(customAjax._requestInterceptors.length).to.equal(3);
      expect(customAjax._responseInterceptors.length).to.equal(1);
    });

    const cachingTests = {};
    cachingTests.works = async (/** @type {Ajax} */ customAjax) => {
      await customAjax.fetch('/foo');

      const secondResponse = await customAjax.fetch('/foo');
      expect(fetchStub.callCount).to.equal(1);
      expect(await secondResponse.text()).to.equal('mock response');
      expect(secondResponse.headers.get('X-Custom-Header')).to.equal('y-custom-value');
      expect(secondResponse.headers.get('Content-Type')).to.equal('application/json');
    };

    cachingTests.resetOnCacheIDChange = async (/** @type {Ajax} */ customAjax) => {
      /* Three calls to the same endpoint should result in a 
        single fetchStubCall due to caching */
      await customAjax.fetch('/foo');
      await customAjax.fetch('/foo');
      await customAjax.fetch('/foo');
      expect(fetchStub.callCount).to.equal(1);

      newCacheId();
      await customAjax.fetch('/foo');

      /* The newCacheId call should reset the cache, thereby adding an
      extra call to the fetchStub call count. */
      expect(fetchStub.callCount).to.equal(2);
    };

    cachingTests.completePendingOnCacheIDChange = async (/** @type {Ajax} */ customAjax) => {
      const requestOne = customAjax.fetch('/foo').then(() => 'completedRequestOne');
      newCacheId();
      const requestTwo = customAjax.fetch('/foo').then(() => 'completedRequestTwo');
      expect(await requestOne).to.equal('completedRequestOne');
      expect(await requestTwo).to.equal('completedRequestTwo');
    };

    cachingTests.worksWithFetchJson = async (/** @type {Ajax} */ customAjax) => {
      fetchStub.returns(Promise.resolve(new Response('{"a":1,"b":2}', responseInit())));

      const firstResponse = await customAjax.fetchJson('/foo');
      expect(firstResponse.body).to.deep.equal({ a: 1, b: 2 });
      expect(firstResponse.response.headers.get('X-Custom-Header')).to.equal('y-custom-value');
      expect(firstResponse.response.headers.get('Content-Type')).to.equal('application/json');

      const secondResponse = await customAjax.fetchJson('/foo');
      expect(fetchStub.callCount).to.equal(1);
      expect(secondResponse.body).to.deep.equal({ a: 1, b: 2 });
      expect(secondResponse.response.headers.get('X-Custom-Header')).to.equal('y-custom-value');
      expect(secondResponse.response.headers.get('Content-Type')).to.equal('application/json');
    };

    cachingTests.invalidatesOnNonGetMethod = async (/** @type {Ajax} */ customAjax) => {
      await customAjax.fetch('/foo');

      const secondResponse = await customAjax.fetch('/foo', { method: 'POST' });
      expect(fetchStub.callCount).to.equal(2);
      expect(await secondResponse.text()).to.equal('mock response');
      expect(secondResponse.headers.get('X-Custom-Header')).to.equal('y-custom-value');
      expect(secondResponse.headers.get('Content-Type')).to.equal('application/json');

      const thirdResponse = await customAjax.fetch('/foo');
      expect(fetchStub.callCount).to.equal(3);
      expect(await thirdResponse.text()).to.equal('mock response');
      expect(thirdResponse.headers.get('X-Custom-Header')).to.equal('y-custom-value');
      expect(thirdResponse.headers.get('Content-Type')).to.equal('application/json');
    };

    cachingTests.invalidatesOnTTLPassed = async (/** @type {Ajax} */ customAjax) => {
      const clock = useFakeTimers({
        shouldAdvanceTime: true,
      });

      await customAjax.fetch('/foo');

      const secondResponse = await customAjax.fetch('/foo');
      expect(fetchStub.callCount).to.equal(1);
      expect(await secondResponse.text()).to.equal('mock response');
      expect(secondResponse.headers.get('X-Custom-Header')).to.equal('y-custom-value');
      expect(secondResponse.headers.get('Content-Type')).to.equal('application/json');

      clock.tick(101);

      const thirdResponse = await customAjax.fetch('/foo');
      expect(fetchStub.callCount).to.equal(2);
      expect(await thirdResponse.text()).to.equal('mock response');
      expect(thirdResponse.headers.get('X-Custom-Header')).to.equal('y-custom-value');
      expect(thirdResponse.headers.get('Content-Type')).to.equal('application/json');

      clock.restore();
    };

    describe('Caching interceptors: cache tests with synchronous getCacheIdentifier', async () => {
      /**
       * @type {Ajax}
       */
      let customAjax;

      beforeEach(async () => {
        newCacheId();
        customAjax = new Ajax({
          cacheOptions: {
            useCache: true,
            maxAge: 100,
            getCacheIdentifier,
          },
        });
      });

      it('works', async () => {
        await cachingTests.works(customAjax);
      });

      it('resets the cache if the cache ID changes', async () => {
        await cachingTests.resetOnCacheIDChange(customAjax);
      });

      it('Completes pending requests when the cache ID changes', async () => {
        await cachingTests.completePendingOnCacheIDChange(customAjax);
      });

      it('works with fetchJson', async () => {
        await cachingTests.worksWithFetchJson(customAjax);
      });

      it('is invalidated on non-get method', async () => {
        await cachingTests.invalidatesOnNonGetMethod(customAjax);
      });

      it('is invalidated after TTL has passed', async () => {
        await cachingTests.invalidatesOnTTLPassed(customAjax);
      });
    });

    describe('Caching interceptors: cache tests with asynchronous getCacheIdentifier', async () => {
      /**
       * @type {Ajax}
       */
      let customAjax;

      beforeEach(async () => {
        newCacheId();
        customAjax = new Ajax({
          cacheOptions: {
            useCache: true,
            maxAge: 100,
            getCacheIdentifier: getCacheIdentifierAsync,
          },
        });
      });

      it('works', async () => {
        await cachingTests.works(customAjax);
      });

      it('resets the cache if the cache ID changes', async () => {
        await cachingTests.resetOnCacheIDChange(customAjax);
      });

      it('Completes pending requests when the cache ID changes', async () => {
        await cachingTests.completePendingOnCacheIDChange(customAjax);
      });

      it('works with fetchJson', async () => {
        await cachingTests.worksWithFetchJson(customAjax);
      });

      it('is invalidated on non-get method', async () => {
        await cachingTests.invalidatesOnNonGetMethod(customAjax);
      });

      it('is invalidated after TTL has passed', async () => {
        await cachingTests.invalidatesOnTTLPassed(customAjax);
      });
    });
  });

  describe('Abort', () => {
    it('support aborting requests with AbortController', async () => {
      fetchStub.restore();
      let err;
      const controller = new AbortController();
      const { signal } = controller;
      // Have to do a "real" request to be able to abort it and verify that this throws
      const req = ajax.fetch(new URL('./foo.json', import.meta.url).pathname, {
        method: 'GET',
        signal,
      });
      controller.abort();

      try {
        await req;
      } catch (e) {
        err = e;
      }

      const errors = [
        "Failed to execute 'fetch' on 'Window': The user aborted a request.", // chromium
        'signal is aborted without reason', // newer chromium (?)
        'The operation was aborted. ', // firefox
        'Request signal is aborted', // webkit
        'The operation was aborted.', // newer webkit
      ];

      expect(errors.includes(/** @type {Error} */ (err).message)).to.be.true;
    });
  });

  describe('AjaxFetchError', () => {
    it('has the name AjaxFetchError', () => {
      const error = new AjaxFetchError(new Request('/foobar'), new Response('foobar'), 'foobar');

      expect(error.name).to.be.equal('AjaxFetchError');
    });

    it("displays the request failure text in it's message", () => {
      const error = new AjaxFetchError(
        new Request('/foobar'),
        new Response('foobar', { status: 418, statusText: "I'm a teapot" }),
        'foobar',
      );

      expect(/http:\/\/localhost:\d*\/foobar/.test(error.message)).to.be.true;
      expect(error.message).to.include('418');
      expect(error.message).to.include("I'm a teapot");
    });
  });
});
