import { aTimeout, expect } from '@open-wc/testing';
import { spy, stub, useFakeTimers } from 'sinon';
import '../src/typedef.js';
import { acceptLanguageRequestInterceptor } from '../src/interceptors/acceptLanguageHeader.js';
import { createXsrfRequestInterceptor, getCookie } from '../src/interceptors/xsrfHeader.js';
import { createCacheInterceptors } from '../src/interceptors/cacheInterceptors.js';
import { Ajax } from '../index.js';

const ajax = new Ajax();

describe('interceptors', () => {
  describe('getCookie()', () => {
    it('returns the cookie value', () => {
      expect(getCookie('foo', { cookie: 'foo=bar' })).to.equal('bar');
    });

    it('returns the cookie value when there are multiple cookies', () => {
      expect(getCookie('foo', { cookie: 'foo=bar; bar=foo;lorem=ipsum' })).to.equal('bar');
    });

    it('returns null when the cookie cannot be found', () => {
      expect(getCookie('foo', { cookie: 'bar=foo;lorem=ipsum' })).to.equal(null);
    });

    it('decodes the cookie vaue', () => {
      expect(getCookie('foo', { cookie: `foo=${decodeURIComponent('/foo/ bar "')}` })).to.equal(
        '/foo/ bar "',
      );
    });
  });

  describe('acceptLanguageRequestInterceptor()', () => {
    it('adds the locale as accept-language header', () => {
      const request = new Request('/foo/');
      acceptLanguageRequestInterceptor(request);
      expect(request.headers.get('accept-language')).to.equal('en');
    });

    it('does not change an existing accept-language header', () => {
      const request = new Request('/foo/', { headers: { 'accept-language': 'my-accept' } });
      acceptLanguageRequestInterceptor(request);
      expect(request.headers.get('accept-language')).to.equal('my-accept');
    });
  });

  describe('createXsrfRequestInterceptor()', () => {
    it('adds the xsrf token header to the request', () => {
      const interceptor = createXsrfRequestInterceptor('XSRF-TOKEN', 'X-XSRF-TOKEN', {
        cookie: 'XSRF-TOKEN=foo',
      });
      const request = new Request('/foo/');
      interceptor(request);
      expect(request.headers.get('X-XSRF-TOKEN')).to.equal('foo');
    });

    it('does not set anything if the cookie is not there', () => {
      const interceptor = createXsrfRequestInterceptor('XSRF-TOKEN', 'X-XSRF-TOKEN', {
        cookie: 'XXSRF-TOKEN=foo',
      });
      const request = new Request('/foo/');
      interceptor(request);
      expect(request.headers.get('X-XSRF-TOKEN')).to.equal(null);
    });
  });

  describe('cache interceptors', () => {
    /** @type {number | undefined} */
    let cacheId;
    /** @type {import('sinon').SinonStub} */
    let fetchStub;
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

    /**
     * @param {ajax} ajaxInstance
     * @param {CacheOptions} options
     */
    const addCacheInterceptors = (ajaxInstance, options) => {
      const [cacheRequestInterceptor, cacheResponseInterceptor] = createCacheInterceptors(
        getCacheIdentifier,
        options,
      );

      const requestInterceptorIndex =
        ajaxInstance._requestInterceptors.push(
          /** @type {RequestInterceptor} */ (cacheRequestInterceptor),
        ) - 1;

      const responseInterceptorIndex =
        ajaxInstance._responseInterceptors.push(
          /** @type {ResponseInterceptor} */ (cacheResponseInterceptor),
        ) - 1;

      return {
        requestInterceptorIndex,
        responseInterceptorIndex,
      };
    };

    /**
     * @param {ajax} ajaxInstance
     * @param {{requestInterceptorIndex: number, responseInterceptorIndex: number}} indexes
     */
    const removeCacheInterceptors = (
      ajaxInstance,
      { requestInterceptorIndex, responseInterceptorIndex },
    ) => {
      ajaxInstance._requestInterceptors.splice(requestInterceptorIndex, 1);
      ajaxInstance._responseInterceptors.splice(responseInterceptorIndex, 1);
    };

    beforeEach(() => {
      getCacheIdentifier = () => String(cacheId);
      fetchStub = stub(window, 'fetch');
      fetchStub.returns(Promise.resolve(new Response('mock response')));
    });

    afterEach(() => {
      fetchStub.restore();
    });

    describe('Original ajax instance', () => {
      it('allows direct ajax calls without cache interceptors configured', async () => {
        await ajax.fetch('/test');
        expect(fetchStub.callCount).to.equal(1);
        await ajax.fetch('/test');
        expect(fetchStub.callCount).to.equal(2);
      });
    });

    describe('Cache config validation', () => {
      it('validates `useCache`', () => {
        newCacheId();
        const test = () => {
          const indexes = addCacheInterceptors(ajax, {
            // @ts-ignore needed for test
            useCache: 'fakeUseCacheType',
          });
          removeCacheInterceptors(ajax, indexes);
        };
        expect(test).to.throw();
      });

      it('validates property `timeToLive` throws if not type `number`', () => {
        newCacheId();
        expect(() => {
          const indexes = addCacheInterceptors(ajax, {
            useCache: true,
            // @ts-ignore needed for test
            timeToLive: '',
          });
          removeCacheInterceptors(ajax, indexes);
        }).to.throw();
      });

      it('validates cache identifier function', () => {
        // @ts-ignore needed for test
        cacheId = '';

        const indexes = addCacheInterceptors(ajax, { useCache: true });

        return ajax.fetch('/test').catch(
          /** @param {Error} err */ err => {
            expect(err.message).to.equal('getCacheIdentifier returns falsy');

            removeCacheInterceptors(ajax, indexes);
          },
        );
      });

      it("throws when using methods other than `['get']`", () => {
        newCacheId();

        expect(() => {
          const indexes = addCacheInterceptors(ajax, {
            useCache: true,
            methods: ['get', 'post'],
          });
          removeCacheInterceptors(ajax, indexes);
        }).to.throw(/not yet supported/);
      });

      it('throws error when requestIdentificationFn is not a function', () => {
        newCacheId();

        expect(() => {
          const indexes = addCacheInterceptors(ajax, {
            useCache: true,
            // @ts-ignore needed for test
            requestIdentificationFn: 'not a function',
          });
          removeCacheInterceptors(ajax, indexes);
        }).to.throw(/Property `requestIdentificationFn` must be of type `function`/);
      });
    });

    describe('Cached responses', () => {
      it('returns the cached object on second call with `useCache: true`', async () => {
        newCacheId();

        const indexes = addCacheInterceptors(ajax, {
          useCache: true,
          timeToLive: 100,
        });
        const ajaxRequestSpy = spy(ajax, 'fetch');

        await ajax.fetch('/test');
        expect(ajaxRequestSpy.calledOnce).to.be.true;
        expect(ajaxRequestSpy.calledWith('/test')).to.be.true;
        await ajax.fetch('/test');
        expect(fetchStub.callCount).to.equal(1);

        ajaxRequestSpy.restore();
        removeCacheInterceptors(ajax, indexes);
      });

      it('all calls with non-default `timeToLive` are cached proactively', async () => {
        newCacheId();

        const indexes = addCacheInterceptors(ajax, {
          useCache: false,
          timeToLive: 100,
        });
        const ajaxRequestSpy = spy(ajax, 'fetch');

        await ajax.fetch('/test');
        expect(ajaxRequestSpy.calledOnce).to.be.true;
        expect(ajaxRequestSpy.calledWith('/test')).to.be.true;
        expect(fetchStub.callCount).to.equal(1);
        await ajax.fetch('/test');
        expect(fetchStub.callCount).to.equal(2);
        await ajax.fetch('/test', {
          cacheOptions: {
            useCache: true,
          },
        });
        expect(fetchStub.callCount).to.equal(2);
        ajaxRequestSpy.restore();
        removeCacheInterceptors(ajax, indexes);
      });

      it('returns the cached object on second call with `useCache: true`, with querystring parameters', async () => {
        newCacheId();

        const indexes = addCacheInterceptors(ajax, {
          useCache: true,
          timeToLive: 100,
        });

        const ajaxRequestSpy = spy(ajax, 'fetch');

        await ajax.fetch('/test', {
          params: {
            q: 'test',
            page: 1,
          },
        });
        expect(ajaxRequestSpy.calledOnce).to.be.true;
        expect(ajaxRequestSpy.calledWith('/test')).to.be.true;
        await ajax.fetch('/test', {
          params: {
            q: 'test',
            page: 1,
          },
        });
        expect(fetchStub.callCount).to.equal(1);
        // a request with different param should not be cached
        await ajax.fetch('/test', {
          params: {
            q: 'test',
            page: 2,
          },
        });
        expect(fetchStub.callCount).to.equal(2);
        ajaxRequestSpy.restore();
        removeCacheInterceptors(ajax, indexes);
      });

      it('uses cache when inside `timeToLive: 5000` window', async () => {
        newCacheId();
        const clock = useFakeTimers({
          shouldAdvanceTime: true,
        });

        const indexes = addCacheInterceptors(ajax, {
          useCache: true,
          timeToLive: 5000,
        });
        const ajaxRequestSpy = spy(ajax, 'fetch');

        await ajax.fetch('/test');
        expect(ajaxRequestSpy.calledOnce).to.be.true;
        expect(ajaxRequestSpy.calledWith('/test')).to.be.true;
        expect(fetchStub.callCount).to.equal(1);
        clock.tick(4900);
        await ajax.fetch('/test');
        expect(fetchStub.callCount).to.equal(1);
        clock.tick(5100);
        await ajax.fetch('/test');
        expect(fetchStub.callCount).to.equal(2);
        ajaxRequestSpy.restore();
        clock.restore();
        removeCacheInterceptors(ajax, indexes);
      });

      it('uses custom requestIdentificationFn when passed', async () => {
        newCacheId();

        const customRequestIdFn = /** @type {RequestIdentificationFn} */ (request, serializer) => {
          let serializedRequestParams = '';
          if (request.params) {
            serializedRequestParams = `?${serializer(request.params)}`;
          }
          return `${new URL(/** @type {string} */ (request.url)).pathname}-${request.headers?.get(
            'x-id',
          )}${serializedRequestParams}`;
        };
        const reqIdSpy = spy(customRequestIdFn);
        const indexes = addCacheInterceptors(ajax, {
          useCache: true,
          requestIdentificationFn: reqIdSpy,
        });

        await ajax.fetch('/test', { headers: { 'x-id': '1' } });
        expect(reqIdSpy.calledOnce);
        expect(reqIdSpy.returnValues[0]).to.equal(`/test-1`);
        removeCacheInterceptors(ajax, indexes);
      });
    });

    describe('Cache invalidation', () => {
      it('previously cached data has to be invalidated when regex invalidation rule triggered', async () => {
        newCacheId();

        const indexes = addCacheInterceptors(ajax, {
          useCache: true,
          timeToLive: 1000,
          invalidateUrlsRegex: /foo/gi,
        });

        await ajax.fetch('/test'); // new url
        expect(fetchStub.callCount).to.equal(1);
        await ajax.fetch('/test'); // cached
        expect(fetchStub.callCount).to.equal(1);

        await ajax.fetch('/foo-request-1'); // new url
        expect(fetchStub.callCount).to.equal(2);
        await ajax.fetch('/foo-request-1'); // cached
        expect(fetchStub.callCount).to.equal(2);

        await ajax.fetch('/foo-request-3'); // new url
        expect(fetchStub.callCount).to.equal(3);

        await ajax.fetch('/test', { method: 'POST' }); // clear cache
        expect(fetchStub.callCount).to.equal(4);
        await ajax.fetch('/foo-request-1'); // not cached anymore
        expect(fetchStub.callCount).to.equal(5);
        await ajax.fetch('/foo-request-2'); // not cached anymore
        expect(fetchStub.callCount).to.equal(6);

        removeCacheInterceptors(ajax, indexes);
      });

      it('previously cached data has to be invalidated when regex invalidation rule triggered and urls are nested', async () => {
        newCacheId();

        const indexes = addCacheInterceptors(ajax, {
          useCache: true,
          timeToLive: 1000,
          invalidateUrlsRegex: /posts/gi,
        });

        await ajax.fetch('/test');
        await ajax.fetch('/test'); // cached
        expect(fetchStub.callCount).to.equal(1);
        await ajax.fetch('/posts');
        expect(fetchStub.callCount).to.equal(2);
        await ajax.fetch('/posts'); // cached
        expect(fetchStub.callCount).to.equal(2);
        await ajax.fetch('/posts/1');
        expect(fetchStub.callCount).to.equal(3);
        await ajax.fetch('/posts/1'); // cached
        expect(fetchStub.callCount).to.equal(3);
        // cleans cache for defined urls
        await ajax.fetch('/test', { method: 'POST' });
        expect(fetchStub.callCount).to.equal(4);
        await ajax.fetch('/posts'); // no longer cached => new request
        expect(fetchStub.callCount).to.equal(5);
        await ajax.fetch('/posts/1'); // no longer cached => new request
        expect(fetchStub.callCount).to.equal(6);

        removeCacheInterceptors(ajax, indexes);
      });

      it('deletes cache after one hour', async () => {
        newCacheId();
        const clock = useFakeTimers({
          shouldAdvanceTime: true,
        });

        const ajaxRequestSpy = spy(ajax, 'fetch');
        const indexes = addCacheInterceptors(ajax, {
          useCache: true,
          timeToLive: 1000 * 60 * 60,
        });

        await ajax.fetch('/test-hour');
        expect(ajaxRequestSpy.calledOnce).to.be.true;
        expect(ajaxRequestSpy.calledWith('/test-hour')).to.be.true;
        expect(fetchStub.callCount).to.equal(1);
        clock.tick(1000 * 60 * 59); // 0:59 hour
        await ajax.fetch('/test-hour');
        expect(fetchStub.callCount).to.equal(1);
        clock.tick(1000 * 60 * 2); // +2 minutes => 1:01 hour
        await ajax.fetch('/test-hour');
        expect(fetchStub.callCount).to.equal(2);
        ajaxRequestSpy.restore();
        clock.restore();
        removeCacheInterceptors(ajax, indexes);
      });

      it('invalidates invalidateUrls endpoints', async () => {
        newCacheId();

        const indexes = addCacheInterceptors(ajax, {
          useCache: true,
          timeToLive: 500,
        });

        const actionConfig = {
          cacheOptions: {
            invalidateUrls: ['/test-invalid-url'],
          },
        };

        await ajax.fetch('/test-valid-url', { ...actionConfig });
        expect(fetchStub.callCount).to.equal(1);
        await ajax.fetch('/test-invalid-url');
        expect(fetchStub.callCount).to.equal(2);
        // 'post' will invalidate 'own' cache and the one mentioned in config
        await ajax.fetch('/test-valid-url', { ...actionConfig, method: 'POST' });
        expect(fetchStub.callCount).to.equal(3);
        await ajax.fetch('/test-invalid-url');
        // indicates that 'test-invalid-url' cache was removed
        // because the server registered new request
        expect(fetchStub.callCount).to.equal(4);
        removeCacheInterceptors(ajax, indexes);
      });

      it('invalidates cache on a post', async () => {
        newCacheId();

        const indexes = addCacheInterceptors(ajax, {
          useCache: true,
          timeToLive: 100,
        });
        const ajaxRequestSpy = spy(ajax, 'fetch');

        await ajax.fetch('/test-post');
        expect(ajaxRequestSpy.calledOnce).to.be.true;
        expect(ajaxRequestSpy.calledWith('/test-post')).to.be.true;
        expect(fetchStub.callCount).to.equal(1);
        await ajax.fetch('/test-post', { method: 'POST', body: 'data-post' });
        expect(ajaxRequestSpy.calledTwice).to.be.true;
        expect(ajaxRequestSpy.calledWith('/test-post')).to.be.true;
        expect(fetchStub.callCount).to.equal(2);
        await ajax.fetch('/test-post');
        expect(fetchStub.callCount).to.equal(3);
        ajaxRequestSpy.restore();
        removeCacheInterceptors(ajax, indexes);
      });

      it('caches response but does not return it when expiration time is 0', async () => {
        newCacheId();

        const indexes = addCacheInterceptors(ajax, {
          useCache: true,
          timeToLive: 0,
        });

        const ajaxRequestSpy = spy(ajax, 'fetch');

        await ajax.fetch('/test');
        const clock = useFakeTimers();
        expect(ajaxRequestSpy.calledOnce).to.be.true;
        expect(ajaxRequestSpy.calledWith('/test')).to.be.true;
        clock.tick(1);
        clock.restore();
        await ajax.fetch('/test');
        expect(fetchStub.callCount).to.equal(2);
        ajaxRequestSpy.restore();
        removeCacheInterceptors(ajax, indexes);
      });

      it('does not use cache when `useCache: false` in the action', async () => {
        newCacheId();
        getCacheIdentifier = () => 'cacheIdentifier2';

        const ajaxAlwaysRequestSpy = spy(ajax, 'fetch');
        const indexes = addCacheInterceptors(ajax, { useCache: true });

        await ajax.fetch('/test');
        expect(ajaxAlwaysRequestSpy.calledOnce, 'calledOnce').to.be.true;
        expect(ajaxAlwaysRequestSpy.calledWith('/test'));
        await ajax.fetch('/test', { cacheOptions: { useCache: false } });
        expect(fetchStub.callCount).to.equal(2);
        ajaxAlwaysRequestSpy.restore();
        removeCacheInterceptors(ajax, indexes);
      });

      it('caches concurrent requests', async () => {
        newCacheId();

        let i = 0;
        fetchStub.returns(
          new Promise(resolve => {
            i += 1;
            setTimeout(() => {
              resolve(new Response(`mock response ${i}`));
            }, 5);
          }),
        );

        const indexes = addCacheInterceptors(ajax, {
          useCache: true,
          timeToLive: 100,
        });
        const ajaxRequestSpy = spy(ajax, 'fetch');

        const request1 = ajax.fetch('/test');
        const request2 = ajax.fetch('/test');
        await aTimeout(1);
        const request3 = ajax.fetch('/test');
        await aTimeout(3);
        const request4 = ajax.fetch('/test');
        const responses = await Promise.all([request1, request2, request3, request4]);
        expect(fetchStub.callCount).to.equal(1);
        const responseTexts = await Promise.all(responses.map(r => r.text()));
        expect(responseTexts).to.eql([
          'mock response 1',
          'mock response 1',
          'mock response 1',
          'mock response 1',
        ]);

        ajaxRequestSpy.restore();
        removeCacheInterceptors(ajax, indexes);
      });

      it('preserves status and headers when returning cached response', async () => {
        newCacheId();
        fetchStub.returns(
          Promise.resolve(
            new Response('mock response', { status: 206, headers: { 'x-foo': 'x-bar' } }),
          ),
        );

        const indexes = addCacheInterceptors(ajax, {
          useCache: true,
          timeToLive: 100,
        });
        const ajaxRequestSpy = spy(ajax, 'fetch');

        const response1 = await ajax.fetch('/test');
        const response2 = await ajax.fetch('/test');
        expect(fetchStub.callCount).to.equal(1);
        expect(response1.status).to.equal(206);
        expect(response1.headers.get('x-foo')).to.equal('x-bar');
        expect(response2.status).to.equal(206);
        expect(response2.headers.get('x-foo')).to.equal('x-bar');

        ajaxRequestSpy.restore();
        removeCacheInterceptors(ajax, indexes);
      });
    });
  });
});
