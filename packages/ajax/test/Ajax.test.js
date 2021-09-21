import { expect } from '@open-wc/testing';
import { stub, useFakeTimers } from 'sinon';
import { Ajax, AjaxFetchError } from '@lion/ajax';

describe('Ajax', () => {
  /** @type {import('sinon').SinonStub} */
  let fetchStub;
  /** @type {Ajax} */
  let ajax;

  beforeEach(() => {
    fetchStub = stub(window, 'fetch');
    fetchStub.returns(Promise.resolve(new Response('mock response')));
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
        xsrfCookieName: 'XSRF-TOKEN',
        xsrfHeaderName: 'X-XSRF-TOKEN',
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
      // @ts-expect-error
      const ajax1 = new Ajax(config);
      const result = ajax1.options?.cacheOptions?.getCacheIdentifier;
      // Then
      expect(result).not.to.be.undefined;
      expect(result).to.be.a('function');
    });
  });

  describe('fetch()', () => {
    it('calls fetch with the given args, returning the result', async () => {
      const response = await (await ajax.fetch('/foo', { method: 'POST' })).text();

      expect(fetchStub).to.have.been.calledOnce;
      const request = fetchStub.getCall(0).args[0];
      expect(request.url).to.equal(`${window.location.origin}/foo`);
      expect(request.method).to.equal('POST');
      expect(response).to.equal('mock response');
    });

    it('throws on 4xx responses', async () => {
      fetchStub.returns(Promise.resolve(new Response('', { status: 400 })));

      let thrown = false;
      try {
        await ajax.fetch('/foo');
      } catch (e) {
        expect(e).to.be.an.instanceOf(AjaxFetchError);
        expect(e.request).to.be.an.instanceOf(Request);
        expect(e.response).to.be.an.instanceOf(Response);
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
        expect(e).to.be.an.instanceOf(AjaxFetchError);
        expect(e.request).to.be.an.instanceOf(Request);
        expect(e.response).to.be.an.instanceOf(Response);
        thrown = true;
      }
      expect(thrown).to.be.true;
    });
  });

  describe('fetchtJson', () => {
    beforeEach(() => {
      fetchStub.returns(Promise.resolve(new Response('{}')));
    });

    it('sets json accept header', async () => {
      await ajax.fetchJson('/foo');
      const request = fetchStub.getCall(0).args[0];
      expect(request.headers.get('accept')).to.equal('application/json');
    });

    it('decodes response from json', async () => {
      fetchStub.returns(Promise.resolve(new Response('{"a":1,"b":2}')));
      const response = await ajax.fetchJson('/foo');
      expect(response.body).to.eql({ a: 1, b: 2 });
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
        fetchStub.returns(Promise.resolve(new Response('//.,!{"a":1,"b":2}')));
        const response = await localAjax.fetchJson('/foo');
        expect(response.body).to.eql({ a: 1, b: 2 });
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
      await ajax.fetch('/foo');

      const request = fetchStub.getCall(0).args[0];
      expect(request.headers.get('X-XSRF-TOKEN')).to.equal('1234');
    });

    it('XSRF behavior can be disabled', async () => {
      const customAjax = new Ajax({ xsrfCookieName: null, xsrfHeaderName: null });
      await customAjax.fetch('/foo');
      await ajax.fetch('/foo');

      const request = fetchStub.getCall(0).args[0];
      expect(request.headers.has('X-XSRF-TOKEN')).to.be.false;
    });

    it('XSRF token header and cookie can be customized', async () => {
      const customAjax = new Ajax({
        xsrfCookieName: 'CSRF-TOKEN',
        xsrfHeaderName: 'X-CSRF-TOKEN',
      });
      await customAjax.fetch('/foo');

      const request = fetchStub.getCall(0).args[0];
      expect(request.headers.get('X-CSRF-TOKEN')).to.equal('5678');
    });
  });

  describe('Caching', () => {
    /** @type {number | undefined} */
    let cacheId;
    /** @type {() => string} */
    let getCacheIdentifier;

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
    });

    it('allows configuring cache interceptors on the Ajax config', async () => {
      newCacheId();
      const customAjax = new Ajax({
        cacheOptions: {
          useCache: true,
          maxAge: 100,
          getCacheIdentifier,
        },
      });

      const clock = useFakeTimers({
        shouldAdvanceTime: true,
      });

      // Smoke test 1: verify caching works
      await customAjax.fetch('/foo');
      expect(fetchStub.callCount).to.equal(1);
      await customAjax.fetch('/foo');
      expect(fetchStub.callCount).to.equal(1);

      // Smoke test 2: verify caching is invalidated on non-get method
      await customAjax.fetch('/foo', { method: 'POST' });
      expect(fetchStub.callCount).to.equal(2);
      await customAjax.fetch('/foo');
      expect(fetchStub.callCount).to.equal(3);

      // Smoke test 3: verify caching is invalidated after TTL has passed
      await customAjax.fetch('/foo');
      expect(fetchStub.callCount).to.equal(3);
      clock.tick(101);
      await customAjax.fetch('/foo');
      expect(fetchStub.callCount).to.equal(4);
      clock.restore();
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
        'The operation was aborted. ', // firefox
        'Request signal is aborted', // webkit
      ];

      expect(errors.includes(err.message)).to.be.true;
    });
  });
});
