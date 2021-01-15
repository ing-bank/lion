import { expect } from '@open-wc/testing';
import { spy, stub, useFakeTimers } from 'sinon';
import '../src/typedef.js';

import { cacheRequestInterceptorFactory, cacheResponseInterceptorFactory, ajax } from '../index.js';

describe('ajax cache', function describeLibCache() {
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
    const requestInterceptorIndex =
      ajaxInstance._requestInterceptors.push(
        cacheRequestInterceptorFactory(getCacheIdentifier, options),
      ) - 1;

    const responseInterceptorIndex =
      ajaxInstance._responseInterceptors.push(
        cacheResponseInterceptorFactory(getCacheIdentifier, options),
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
    it('allows direct ajax calls without cache interceptors configured', () => {
      return ajax
        .request('/test')
        .then(() => {
          expect(fetchStub.callCount).to.equal(1);
        })
        .then(() => ajax.request('/test'))
        .then(() => {
          expect(fetchStub.callCount).to.equal(2);
        });
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

      return ajax.request('/test').catch(
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
      }).to.throw(/Property `requestIdentificationFn` must be of type `function` or `falsy`/);
    });
  });

  describe('Cached responses', () => {
    it('returns the cached object on second call with `useCache: true`', () => {
      newCacheId();

      const indexes = addCacheInterceptors(ajax, {
        useCache: true,
        timeToLive: 100,
      });
      const ajaxRequestSpy = spy(ajax, 'request');

      return ajax
        .request('/test')
        .then(() => {
          expect(ajaxRequestSpy.calledOnce).to.be.true;
          expect(ajaxRequestSpy.calledWith('/test')).to.be.true;
        })
        .then(() => ajax.request('/test'))
        .then(() => {
          expect(fetchStub.callCount).to.equal(1);
        })
        .finally(() => {
          ajaxRequestSpy.restore();
          removeCacheInterceptors(ajax, indexes);
        });
    });

    it('all calls with non-default `timeToLive` are cached proactively', () => {
      newCacheId();

      const indexes = addCacheInterceptors(ajax, {
        useCache: false,
        timeToLive: 100,
      });
      const ajaxRequestSpy = spy(ajax, 'request');

      return ajax
        .request('/test')
        .then(() => {
          expect(ajaxRequestSpy.calledOnce).to.be.true;
          expect(ajaxRequestSpy.calledWith('/test')).to.be.true;
        })
        .then(() => {
          expect(fetchStub.callCount).to.equal(1);
        })
        .then(() => ajax.request('/test'))
        .then(() => {
          expect(fetchStub.callCount).to.equal(2);
        })
        .then(() =>
          ajax.request('/test', {
            cacheOptions: {
              useCache: true,
            },
          }),
        )
        .then(() => {
          expect(fetchStub.callCount).to.equal(2);
        })
        .finally(() => {
          ajaxRequestSpy.restore();
          removeCacheInterceptors(ajax, indexes);
        });
    });

    it('returns the cached object on second call with `useCache: true`, with querystring parameters', () => {
      newCacheId();

      const indexes = addCacheInterceptors(ajax, {
        useCache: true,
        timeToLive: 100,
      });

      const ajaxRequestSpy = spy(ajax, 'request');

      return ajax
        .request('/test', {
          params: {
            q: 'test',
            page: 1,
          },
        })
        .then(() => {
          expect(ajaxRequestSpy.calledOnce).to.be.true;
          expect(ajaxRequestSpy.calledWith('/test')).to.be.true;
        })
        .then(() =>
          ajax.request('/test', {
            params: {
              q: 'test',
              page: 1,
            },
          }),
        )
        .then(() => {
          expect(fetchStub.callCount).to.equal(1);
        })
        .then(() =>
          // a request with different param should not be cached
          ajax.request('/test', {
            params: {
              q: 'test',
              page: 2,
            },
          }),
        )
        .then(() => {
          expect(fetchStub.callCount).to.equal(2);
        })
        .finally(() => {
          ajaxRequestSpy.restore();
          removeCacheInterceptors(ajax, indexes);
        });
    });

    it('uses cache when inside `timeToLive: 5000` window', () => {
      newCacheId();
      const clock = useFakeTimers({
        shouldAdvanceTime: true,
      });

      const indexes = addCacheInterceptors(ajax, {
        useCache: true,
        timeToLive: 5000,
      });
      const ajaxRequestSpy = spy(ajax, 'request');

      return ajax
        .request('/test')
        .then(() => {
          expect(ajaxRequestSpy.calledOnce).to.be.true;
          expect(ajaxRequestSpy.calledWith('/test')).to.be.true;
          expect(fetchStub.callCount).to.equal(1);
        })
        .then(() => {
          clock.tick(4900);
        })
        .then(() => ajax.request('/test'))
        .then(() => {
          expect(fetchStub.callCount).to.equal(1);
          clock.tick(5100);
        })
        .then(() => ajax.request('/test'))
        .then(() => {
          expect(fetchStub.callCount).to.equal(2);
        })
        .finally(() => {
          ajaxRequestSpy.restore();
          clock.restore();
          removeCacheInterceptors(ajax, indexes);
        });
    });

    it('uses custom requestIdentificationFn when passed', () => {
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

      return ajax
        .request('/test', { headers: { 'x-id': '1' } })
        .then(() => {
          expect(reqIdSpy.calledOnce);
          expect(reqIdSpy.returnValues[0]).to.equal(`/test-1`);
        })
        .finally(() => {
          removeCacheInterceptors(ajax, indexes);
        });
    });
  });

  describe('Cache invalidation', () => {
    it('previously cached data has to be invalidated when regex invalidation rule triggered', () => {
      newCacheId();

      const indexes = addCacheInterceptors(ajax, {
        useCache: true,
        timeToLive: 1000,
        invalidateUrlsRegex: /foo/gi,
      });

      return ajax
        .request('/test')
        .then(() => ajax.request('/test'))
        .then(() => {
          expect(fetchStub.callCount).to.equal(1);
        })
        .then(() => ajax.request('/foo-request-1'))
        .then(() => {
          expect(fetchStub.callCount).to.equal(2);
        })
        .then(() => ajax.request('/foo-request-1'))
        .then(() => {
          expect(fetchStub.callCount).to.equal(2);
        })
        .then(() => ajax.request('/foo-request-2'))
        .then(() => {
          expect(fetchStub.callCount).to.equal(3);
        })
        .then(() => ajax.request('/foo-request-2'))
        .then(() => {
          expect(fetchStub.callCount).to.equal(3);
        })
        .then(() => ajax.request('/test', { method: 'POST' }))
        .then(() => {
          expect(fetchStub.callCount).to.equal(4);
        })
        .then(() => ajax.request('/foo-request-1'))
        .then(() => {
          expect(fetchStub.callCount).to.equal(5);
        })
        .then(() => ajax.request('/foo-request-2'))
        .then(() => {
          expect(fetchStub.callCount).to.equal(6);
        })
        .finally(() => {
          removeCacheInterceptors(ajax, indexes);
        });
    });

    it('previously cached data has to be invalidated when regex invalidation rule triggered and urls are nested', () => {
      newCacheId();

      const indexes = addCacheInterceptors(ajax, {
        useCache: true,
        timeToLive: 1000,
        invalidateUrlsRegex: /posts/gi,
      });

      return ajax
        .request('/test')
        .then(() => ajax.request('/test'))
        .then(() => {
          expect(fetchStub.callCount).to.equal(1);
        })
        .then(() => ajax.request('/posts'))
        .then(() => {
          expect(fetchStub.callCount).to.equal(2);
        })
        .then(() => ajax.request('/posts'))
        .then(() => {
          // no new requests, cached
          expect(fetchStub.callCount).to.equal(2);
        })
        .then(() => ajax.request('/posts/1'))
        .then(() => {
          expect(fetchStub.callCount).to.equal(3);
        })
        .then(() => ajax.request('/posts/1'))
        .then(() => {
          // no new requests, cached
          expect(fetchStub.callCount).to.equal(3);
        })
        .then(() =>
          // cleans cache for defined urls
          ajax.request('/test', { method: 'POST' }),
        )
        .then(() => {
          expect(fetchStub.callCount).to.equal(4);
        })
        .then(() => ajax.request('/posts'))
        .then(() => {
          // new requests, cache is cleaned
          expect(fetchStub.callCount).to.equal(5);
        })
        .then(() => ajax.request('/posts/1'))
        .then(() => {
          // new requests, cache is cleaned
          expect(fetchStub.callCount).to.equal(6);
        })
        .finally(() => {
          removeCacheInterceptors(ajax, indexes);
        });
    });

    it('deletes cache after one hour', () => {
      newCacheId();
      const clock = useFakeTimers({
        shouldAdvanceTime: true,
      });

      const ajaxRequestSpy = spy(ajax, 'request');
      const indexes = addCacheInterceptors(ajax, {
        useCache: true,
        timeToLive: 1000 * 60 * 60,
      });

      return ajax
        .request('/test-hour')
        .then(() => {
          expect(ajaxRequestSpy.calledOnce).to.be.true;
          expect(ajaxRequestSpy.calledWith('/test-hour')).to.be.true;
          expect(fetchStub.callCount).to.equal(1);
        })
        .then(() => {
          clock.tick(1000 * 60 * 59); // 0:59 hour
        })
        .then(() => ajax.request('/test-hour'))
        .then(() => {
          expect(fetchStub.callCount).to.equal(1);
          clock.tick(1000 * 60 * 61); // 1:01 hour
        })
        .then(() => ajax.request('/test-hour'))
        .then(() => {
          expect(fetchStub.callCount).to.equal(2);
        })
        .finally(() => {
          ajaxRequestSpy.restore();
          clock.restore();
          removeCacheInterceptors(ajax, indexes);
        });
    });

    it('invalidates invalidateUrls endpoints', () => {
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

      return ajax
        .request('/test-valid-url', { ...actionConfig })
        .then(() => {
          expect(fetchStub.callCount).to.equal(1);
        })
        .then(() => ajax.request('/test-invalid-url'))
        .then(() => {
          expect(fetchStub.callCount).to.equal(2);
        })
        .then(() =>
          // 'post' will invalidate 'own' cache and the one mentioned in config
          ajax.request('/test-valid-url', { ...actionConfig, method: 'POST' }),
        )
        .then(() => {
          expect(fetchStub.callCount).to.equal(3);
        })
        .then(() => ajax.request('/test-invalid-url'))
        .then(() => {
          // indicates that 'test-invalid-url' cache was removed
          // because the server registered new request
          expect(fetchStub.callCount).to.equal(4);
        })
        .finally(() => {
          removeCacheInterceptors(ajax, indexes);
        });
    });

    it('invalidates cache on a post', () => {
      newCacheId();

      const indexes = addCacheInterceptors(ajax, {
        useCache: true,
        timeToLive: 100,
      });
      const ajaxRequestSpy = spy(ajax, 'request');

      return ajax
        .request('/test-post')
        .then(() => {
          expect(ajaxRequestSpy.calledOnce).to.be.true;
          expect(ajaxRequestSpy.calledWith('/test-post')).to.be.true;
          expect(fetchStub.callCount).to.equal(1);
        })
        .then(() => ajax.request('/test-post', { method: 'POST', body: 'data-post' }))
        .then(() => {
          expect(ajaxRequestSpy.calledTwice).to.be.true;
          expect(ajaxRequestSpy.calledWith('/test-post')).to.be.true;
          expect(fetchStub.callCount).to.equal(2);
        })
        .then(() => ajax.request('/test-post'))
        .then(() => {
          expect(fetchStub.callCount).to.equal(3);
        })
        .finally(() => {
          ajaxRequestSpy.restore();
          removeCacheInterceptors(ajax, indexes);
        });
    });

    it('caches response but does not return it when expiration time is 0', () => {
      newCacheId();

      const indexes = addCacheInterceptors(ajax, {
        useCache: true,
        timeToLive: 0,
      });

      const ajaxRequestSpy = spy(ajax, 'request');

      return ajax
        .request('/test')
        .then(() => {
          const clock = useFakeTimers();
          expect(ajaxRequestSpy.calledOnce).to.be.true;
          expect(ajaxRequestSpy.calledWith('/test')).to.be.true;
          clock.tick(1);
          clock.restore();
        })
        .then(() => ajax.request('/test'))
        .then(() => {
          expect(fetchStub.callCount).to.equal(2);
        })
        .finally(() => {
          ajaxRequestSpy.restore();
          removeCacheInterceptors(ajax, indexes);
        });
    });

    it('does not use cache when `useCache: false` in the action', () => {
      newCacheId();
      getCacheIdentifier = () => 'cacheIdentifier2';

      const ajaxAlwaysRequestSpy = spy(ajax, 'request');
      const indexes = addCacheInterceptors(ajax, { useCache: true });

      return ajax
        .request('/test')
        .then(() => {
          expect(ajaxAlwaysRequestSpy.calledOnce, 'calledOnce').to.be.true;
          expect(ajaxAlwaysRequestSpy.calledWith('/test'));
        })
        .then(() => ajax.request('/test', { cacheOptions: { useCache: false } }))
        .then(() => {
          expect(fetchStub.callCount).to.equal(2);
        })
        .finally(() => {
          ajaxAlwaysRequestSpy.restore();
          removeCacheInterceptors(ajax, indexes);
        });
    });
  });
});
