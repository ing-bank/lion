import { expect } from '@open-wc/testing';
import { stub } from 'sinon';
import { AjaxClient, AjaxClientFetchError } from '@lion/ajax';

describe('AjaxClient', () => {
  /** @type {import('sinon').SinonStub} */
  let fetchStub;
  /** @type {AjaxClient} */
  let ajax;

  beforeEach(() => {
    fetchStub = stub(window, 'fetch');
    fetchStub.returns(Promise.resolve(new Response('mock response')));
    ajax = new AjaxClient();
  });

  afterEach(() => {
    fetchStub.restore();
  });

  describe('request()', () => {
    it('calls fetch with the given args, returning the result', async () => {
      const response = await (await ajax.request('/foo', { method: 'POST' })).text();

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
        await ajax.request('/foo');
      } catch (e) {
        expect(e).to.be.an.instanceOf(AjaxClientFetchError);
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
        await ajax.request('/foo');
      } catch (e) {
        expect(e).to.be.an.instanceOf(AjaxClientFetchError);
        expect(e.request).to.be.an.instanceOf(Request);
        expect(e.response).to.be.an.instanceOf(Response);
        thrown = true;
      }
      expect(thrown).to.be.true;
    });
  });

  describe('requestJson', () => {
    beforeEach(() => {
      fetchStub.returns(Promise.resolve(new Response('{}')));
    });

    it('sets json accept header', async () => {
      await ajax.requestJson('/foo');
      const request = fetchStub.getCall(0).args[0];
      expect(request.headers.get('accept')).to.equal('application/json');
    });

    it('decodes response from json', async () => {
      fetchStub.returns(Promise.resolve(new Response('{"a":1,"b":2}')));
      const response = await ajax.requestJson('/foo');
      expect(response.body).to.eql({ a: 1, b: 2 });
    });

    describe('given a request body', () => {
      it('encodes the request body as json', async () => {
        await ajax.requestJson('/foo', { method: 'POST', body: { a: 1, b: 2 } });
        const request = fetchStub.getCall(0).args[0];
        expect(await request.text()).to.equal('{"a":1,"b":2}');
      });

      it('sets json content-type header', async () => {
        await ajax.requestJson('/foo', { method: 'POST', body: { a: 1, b: 2 } });
        const request = fetchStub.getCall(0).args[0];
        expect(request.headers.get('content-type')).to.equal('application/json');
      });
    });

    describe('given a json prefix', () => {
      it('strips json prefix from response before decoding', async () => {
        const localAjax = new AjaxClient({ jsonPrefix: '//.,!' });
        fetchStub.returns(Promise.resolve(new Response('//.,!{"a":1,"b":2}')));
        const response = await localAjax.requestJson('/foo');
        expect(response.body).to.eql({ a: 1, b: 2 });
      });
    });
  });

  describe('request and response interceptors', () => {
    it('addRequestInterceptor() adds a function which intercepts the request', async () => {
      ajax.addRequestInterceptor(async r => {
        return new Request(`${r.url}/intercepted-1`);
      });
      ajax.addRequestInterceptor(async r => new Request(`${r.url}/intercepted-2`));

      await ajax.request('/foo', { method: 'POST' });

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

      const response = await (await ajax.request('/foo', { method: 'POST' })).text();
      expect(response).to.equal('mock response intercepted-1 intercepted-2');
    });

    it('removeRequestInterceptor() removes a request interceptor', async () => {
      const interceptor = /** @param {Request} r */ async r =>
        new Request(`${r.url}/intercepted-1`);
      ajax.addRequestInterceptor(interceptor);
      ajax.removeRequestInterceptor(interceptor);

      await ajax.request('/foo', { method: 'POST' });

      const request = fetchStub.getCall(0).args[0];
      expect(request.url).to.equal(`${window.location.origin}/foo`);
    });

    it('removeResponseInterceptor() removes a request interceptor', async () => {
      const interceptor = /** @param {Response} r */ r => `${r} intercepted-1`;
      // @ts-expect-error we're mocking the response as a simple promise which returns a string
      ajax.addResponseInterceptor(interceptor);
      // @ts-expect-error we're mocking the response as a simple promise which returns a string
      ajax.removeResponseInterceptor(interceptor);

      const response = await (await ajax.request('/foo', { method: 'POST' })).text();
      expect(response).to.equal('mock response');
    });
  });

  describe('accept-language header', () => {
    it('is set by default based on localize.locale', async () => {
      await ajax.request('/foo');
      const request = fetchStub.getCall(0).args[0];
      expect(request.headers.get('accept-language')).to.equal('en');
    });

    it('can be disabled', async () => {
      const customAjax = new AjaxClient({ addAcceptLanguage: false });
      await customAjax.request('/foo');
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
      await ajax.request('/foo');

      const request = fetchStub.getCall(0).args[0];
      expect(request.headers.get('X-XSRF-TOKEN')).to.equal('1234');
    });

    it('XSRF behavior can be disabled', async () => {
      const customAjax = new AjaxClient({ xsrfCookieName: null, xsrfHeaderName: null });
      await customAjax.request('/foo');
      await ajax.request('/foo');

      const request = fetchStub.getCall(0).args[0];
      expect(request.headers.has('X-XSRF-TOKEN')).to.be.false;
    });

    it('XSRF token header and cookie can be customized', async () => {
      const customAjax = new AjaxClient({
        xsrfCookieName: 'CSRF-TOKEN',
        xsrfHeaderName: 'X-CSRF-TOKEN',
      });
      await customAjax.request('/foo');

      const request = fetchStub.getCall(0).args[0];
      expect(request.headers.get('X-CSRF-TOKEN')).to.equal('5678');
    });
  });

  describe('Abort', () => {
    it('support aborting requests with AbortController', async () => {
      fetchStub.restore();
      let err;
      const controller = new AbortController();
      const { signal } = controller;
      // Have to do a "real" request to be able to abort it and verify that this throws
      const req = ajax.request(new URL('./foo.json', import.meta.url).pathname, {
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
