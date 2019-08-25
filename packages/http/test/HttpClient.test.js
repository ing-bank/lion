import { expect } from '@open-wc/testing';
import { stub } from 'sinon';
import { localize } from '@lion/localize';
import { HttpClient } from '../src/HttpClient.js';
import { HttpClientFetchError } from '../src/HttpClientFetchError.js';

describe('HttpClient', () => {
  /** @type {import('sinon').SinonStub} */
  let fetchStub;
  /** @type {HttpClient} */
  let http;

  beforeEach(() => {
    fetchStub = stub(window, 'fetch');
    fetchStub.returns(Promise.resolve('mock response'));
    http = new HttpClient();
  });

  afterEach(() => {
    fetchStub.restore();
  });

  describe('request()', () => {
    it('calls fetch with the given args, returning the result', async () => {
      const response = await http.request('/foo', { method: 'POST' });

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
        await http.request('/foo');
      } catch (e) {
        expect(e).to.be.an.instanceOf(HttpClientFetchError);
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
        await http.request('/foo');
      } catch (e) {
        expect(e).to.be.an.instanceOf(HttpClientFetchError);
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
      await http.requestJson('/foo');
      const request = fetchStub.getCall(0).args[0];
      expect(request.headers.get('accept')).to.equal('application/json');
    });

    it('decodes response from json', async () => {
      fetchStub.returns(Promise.resolve(new Response('{"a":1,"b":2}')));
      const response = await http.requestJson('/foo');
      expect(response.body).to.eql({ a: 1, b: 2 });
    });

    describe('given a request body', () => {
      it('encodes the request body as json', async () => {
        await http.requestJson('/foo', { method: 'POST', body: { a: 1, b: 2 } });
        const request = fetchStub.getCall(0).args[0];
        expect(await request.text()).to.equal('{"a":1,"b":2}');
      });

      it('sets json content-type header', async () => {
        await http.requestJson('/foo', { method: 'POST', body: { a: 1, b: 2 } });
        const request = fetchStub.getCall(0).args[0];
        expect(request.headers.get('content-type')).to.equal('application/json');
      });
    });

    describe('given a json prefix', () => {
      it('strips json prefix from response before decoding', async () => {
        const localHttp = new HttpClient({ jsonPrefix: '//.,!' });
        fetchStub.returns(Promise.resolve(new Response('//.,!{"a":1,"b":2}')));
        const response = await localHttp.requestJson('/foo');
        expect(response.body).to.eql({ a: 1, b: 2 });
      });
    });
  });

  describe('request and response transformers', () => {
    it('addRequestTransformer() adds a function which transforms the request', async () => {
      http.addRequestTransformer(r => new Request(`${r.url}/transformed-1`));
      http.addRequestTransformer(r => new Request(`${r.url}/transformed-2`));

      await http.request('/foo', { method: 'POST' });

      const request = fetchStub.getCall(0).args[0];
      expect(request.url).to.equal(`${window.location.origin}/foo/transformed-1/transformed-2`);
    });

    it('addResponseTransformer() adds a function which transforms the response', async () => {
      http.addResponseTransformer(r => `${r} transformed-1`);
      http.addResponseTransformer(r => `${r} transformed-2`);

      const response = await http.request('/foo', { method: 'POST' });
      expect(response).to.equal('mock response transformed-1 transformed-2');
    });

    it('removeRequestTransformer() removes a request transformer', async () => {
      const transformer = r => new Request(`${r.url}/transformed-1`);
      http.addRequestTransformer(transformer);
      http.removeRequestTransformer(transformer);

      await http.request('/foo', { method: 'POST' });

      const request = fetchStub.getCall(0).args[0];
      expect(request.url).to.equal(`${window.location.origin}/foo`);
    });

    it('removeResponseTransformer() removes a request transformer', async () => {
      const transformer = r => `${r} transformed-1`;
      http.addResponseTransformer(transformer);
      http.removeResponseTransformer(transformer);

      const response = await http.request('/foo', { method: 'POST' });
      expect(response).to.equal('mock response');
    });
  });

  describe('accept-language header', () => {
    it('is set by default based on localize.locale', async () => {
      await http.request('/foo');
      const request = fetchStub.getCall(0).args[0];
      expect(request.headers.get('accept-language')).to.equal(localize.locale);
    });

    it('can be disabled', async () => {
      const customHttp = new HttpClient({ addAcceptLanguage: false });
      await customHttp.request('/foo');
      const request = fetchStub.getCall(0).args[0];
      expect(request.headers.has('accept-language')).to.be.false;
    });
  });

  describe('XSRF token', () => {
    let cookieStub;
    beforeEach(() => {
      cookieStub = stub(document, 'cookie');
      cookieStub.get(() => 'foo=bar;XSRF-TOKEN=1234; CSRF-TOKEN=5678;lorem=ipsum;');
    });

    afterEach(() => {
      cookieStub.restore();
    });

    it('XSRF token header is set based on cookie', async () => {
      await http.request('/foo');

      const request = fetchStub.getCall(0).args[0];
      expect(request.headers.get('X-XSRF-TOKEN')).to.equal('1234');
    });

    it('XSRF behavior can be disabled', async () => {
      const customHttp = new HttpClient({ xsrfCookieName: null, xsrfHeaderName: null });
      await customHttp.request('/foo');
      await http.request('/foo');

      const request = fetchStub.getCall(0).args[0];
      expect(request.headers.has('X-XSRF-TOKEN')).to.be.false;
    });

    it('XSRF token header and cookie can be customized', async () => {
      const customHttp = new HttpClient({
        xsrfCookieName: 'CSRF-TOKEN',
        xsrfHeaderName: 'X-CSRF-TOKEN',
      });
      await customHttp.request('/foo');

      const request = fetchStub.getCall(0).args[0];
      expect(request.headers.get('X-CSRF-TOKEN')).to.equal('5678');
    });
  });
});
