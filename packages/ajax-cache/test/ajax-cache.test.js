import { expect } from '@open-wc/testing';
import sinon, { spy } from 'sinon';
import { ajax } from '../../ajax/index.js';
import '../src/typedef.js';

import {
  lionCacheRequestInterceptorFactory,
  lionCacheResponseInterceptorFactory,
  validateOptions,
} from '../index.js';

describe('lion-lib-cache', function describeLionLibCache() {
  /** @type {number | undefined} */
  let cacheId;
  /** @type {import('sinon').SinonFakeServer} */
  let server;
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
   * @param {GlobalCacheOptions} options
   */
  const addCacheInterceptors = (ajaxInstance, options) => {
    const requestInterceptorIndex =
      ajaxInstance.requestInterceptors.push(
        lionCacheRequestInterceptorFactory(getCacheIdentifier, options),
      ) - 1;

    const responseInterceptorIndex =
      ajaxInstance.responseInterceptors.push(
        lionCacheResponseInterceptorFactory(getCacheIdentifier, options),
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
    ajaxInstance.requestInterceptors.splice(requestInterceptorIndex, 1);
    ajaxInstance.responseInterceptors.splice(responseInterceptorIndex, 1);
  };

  beforeEach(() => {
    getCacheIdentifier = () => String(cacheId);
    server = sinon.fakeServer.create({ autoRespond: true });

    server.respondWith(/\/test/, [
      200,
      { 'Content-Type': 'application/json' },
      JSON.stringify({ some: 'data' }),
    ]);
  });

  afterEach(() => {
    server.restore();
  });

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
        useCache: 'always',
        // @ts-ignore needed for test
        timeToLive: '',
      });
      removeCacheInterceptors(ajax, indexes);
    }).to.throw();
  });

  it('validates cache identifier function', () => {
    // @ts-ignore needed for test
    cacheId = '';

    const indexes = addCacheInterceptors(ajax, { useCache: 'always' });

    return ajax.get('/test').catch(
      /** @param {Error} err */ err => {
        expect(err.message).to.equal('getCacheIdentifier returns falsy');

        removeCacheInterceptors(ajax, indexes);
      },
    );
  });

  //--

  it("throws when using methods other than `['get']`", () => {
    newCacheId();

    expect(() => {
      const indexes = addCacheInterceptors(ajax, {
        useCache: 'always',
        methods: ['get', 'post'],
      });
      removeCacheInterceptors(ajax, indexes);
    }).to.throw(/not yet supported/);
  });

  it('creates a wrapped ajax object', () => {
    newCacheId();

    const indexes = addCacheInterceptors(ajax, { useCache: 'always' });

    ['delete', 'get', 'head', 'options', 'post', 'put', 'patch'].forEach(method => {
      expect(ajax[method]).to.be.ok;
    });
    removeCacheInterceptors(ajax, indexes);
  });

  it('preserves ajax configuration', () => {
    newCacheId();

    /** @type {GlobalCacheOptions} */
    const cacheParams = {
      useCache: 'always',
      methods: ['get'],
      timeToLive: 3600001,
      requestIdentificationFn: () => '',
    };
    const indexes = addCacheInterceptors(ajax, cacheParams);
    const ajaxOptions = ajax.options;
    const ajaxProxyGetSpy = spy(ajax.proxy, 'get');

    return ajax
      .get('/test')
      .then(() => {
        const configArg = ajaxProxyGetSpy.args[0][1];
        expect(ajaxProxyGetSpy).to.be.calledOnceWith('/test');
        expect(JSON.stringify(configArg)).to.be.equal(
          JSON.stringify({
            ...ajaxOptions,
          }),
        );
      })
      .finally(() => {
        ajaxProxyGetSpy.restore();
        removeCacheInterceptors(ajax, indexes);
      });
  });

  it("returns the cached object on second call with `useCache: 'always'`", () => {
    newCacheId();

    const indexes = addCacheInterceptors(ajax, {
      useCache: 'always',
      timeToLive: 100,
    });
    const ajaxGetSpy = sinon.spy(ajax, 'get');

    return ajax
      .get('/test')
      .then(() => {
        expect(ajaxGetSpy.calledOnce).to.be.true;
        expect(ajaxGetSpy.calledWith('/test')).to.be.true;
      })
      .then(() => ajax.get('/test'))
      .then(() => {
        expect(server.requests.length).to.equal(1);
      })
      .finally(() => {
        ajaxGetSpy.restore();
        removeCacheInterceptors(ajax, indexes);
      });
  });

  it('all calls with non-default `timeToLive` are cached proactively', () => {
    newCacheId();

    const indexes = addCacheInterceptors(ajax, {
      useCache: 'never',
      timeToLive: 100,
    });
    const ajaxGetSpy = sinon.spy(ajax, 'get');

    return ajax
      .get('/test')
      .then(() => {
        expect(ajaxGetSpy.calledOnce).to.be.true;
        expect(ajaxGetSpy.calledWith('/test')).to.be.true;
      })
      .then(() => {
        expect(server.requests.length).to.equal(1);
      })
      .then(() => ajax.get('/test'))
      .then(() => {
        expect(server.requests.length).to.equal(2);
      })
      .then(() =>
        ajax.get('/test', {
          lionCacheOptions: {
            useCache: 'always',
          },
        }),
      )
      .then(() => {
        expect(server.requests.length).to.equal(2);
      })
      .finally(() => {
        ajaxGetSpy.restore();
        removeCacheInterceptors(ajax, indexes);
      });
  });

  it('previously cached data has to be invalidated when regex invalidation rule triggered', () => {
    newCacheId();

    const indexes = addCacheInterceptors(ajax, {
      useCache: 'always',
      timeToLive: 1000,
    });

    server.respondWith(/\/foo-request-1/, xhr => {
      xhr.respond(200, { 'Content-Type': 'application/json' }, '{}');
    });

    server.respondWith(/\/foo-request-2/, xhr => {
      xhr.respond(200, { 'Content-Type': 'application/json' }, '{}');
    });

    const actionConfig = {
      lionCacheOptions: {
        invalidateUrlsRegex: /foo/gi,
      },
    };

    return ajax
      .get('/test', actionConfig)
      .then(() => ajax.get('/test'))
      .then(() => {
        expect(server.requests.length).to.equal(1);
      })
      .then(() => ajax.get('/foo-request-1'))
      .then(() => {
        expect(server.requests.length).to.equal(2);
      })
      .then(() => ajax.get('/foo-request-1'))
      .then(() => {
        expect(server.requests.length).to.equal(2);
      })
      .then(() => ajax.get('/foo-request-2'))
      .then(() => {
        expect(server.requests.length).to.equal(3);
      })
      .then(() => ajax.get('/foo-request-2'))
      .then(() => {
        expect(server.requests.length).to.equal(3);
      })
      .then(() => ajax.post('/test', {}, actionConfig))
      .then(() => {
        expect(server.requests.length).to.equal(4);
      })
      .then(() => ajax.get('/foo-request-1'))
      .then(() => {
        expect(server.requests.length).to.equal(5);
      })
      .then(() => ajax.get('/foo-request-2'))
      .then(() => {
        expect(server.requests.length).to.equal(5);
      })
      .finally(() => {
        removeCacheInterceptors(ajax, indexes);
      });
  });

  it('previously cached data has to be invalidated when regex invalidation rule triggered and urls are nested', () => {
    newCacheId();

    const indexes = addCacheInterceptors(ajax, {
      useCache: 'always',
      timeToLive: 1000,
    });

    server.respondWith(/^\/posts$/, xhr => {
      xhr.respond(200, { 'Content-Type': 'application/json' }, '{}');
    });

    server.respondWith(/^\/posts\/1$/, xhr => {
      xhr.respond(200, { 'Content-Type': 'application/json' }, '{}');
    });

    const actionConfig = {
      lionCacheOptions: {
        invalidateUrlsRegex: /posts/gi,
      },
    };

    return ajax
      .get('/test', actionConfig)
      .then(() => ajax.get('/test'))
      .then(() => {
        expect(server.requests.length).to.equal(1);
      })
      .then(() => ajax.get('/posts'))
      .then(() => {
        expect(server.requests.length).to.equal(2);
      })
      .then(() => ajax.get('/posts'))
      .then(() => {
        expect(server.requests.length).to.equal(2);
      })
      .then(() => ajax.get('/posts/1'))
      .then(() => {
        expect(server.requests.length).to.equal(3);
      })
      .then(() => ajax.get('/posts/1'))
      .then(() => {
        expect(server.requests.length).to.equal(3);
      })
      .then(() => ajax.post('/test', {}, actionConfig))
      .then(() => {
        expect(server.requests.length).to.equal(4);
      })
      .then(() => ajax.get('/posts'))
      .then(() => {
        expect(server.requests.length).to.equal(5);
      })
      .then(() => ajax.get('/posts/1'))
      .then(() => {
        expect(server.requests.length).to.equal(5);
      })
      .finally(() => {
        removeCacheInterceptors(ajax, indexes);
      });
  });

  it('does not returns the cached object on second call default timeToLive`', () => {
    newCacheId();

    const indexes = addCacheInterceptors(ajax, {
      useCache: 'always',
      timeToLive: 0,
    });

    const ajaxGetSpy = sinon.spy(ajax, 'get');

    return ajax
      .get('/test')
      .then(() => {
        const clock = sinon.useFakeTimers();
        expect(ajaxGetSpy.calledOnce).to.be.true;
        expect(ajaxGetSpy.calledWith('/test')).to.be.true;
        clock.tick(1);
        clock.restore();
      })
      .then(() => ajax.get('/test'))
      .then(() => {
        expect(server.requests.length).to.equal(2);
      })
      .finally(() => {
        ajaxGetSpy.restore();
        removeCacheInterceptors(ajax, indexes);
      });
  });

  it("returns the cached object on second call with `useCache: 'always'`, with querystring parameters", () => {
    newCacheId();

    const indexes = addCacheInterceptors(ajax, {
      useCache: 'always',
      timeToLive: 100,
    });

    const ajaxGetSpy = sinon.spy(ajax, 'get');

    return ajax
      .get('/test', {
        params: {
          q: 'test',
          page: 1,
        },
      })
      .then(() => {
        expect(ajaxGetSpy.calledOnce).to.be.true;
        expect(ajaxGetSpy.calledWith('/test')).to.be.true;
      })
      .then(() =>
        ajax.get('/test', {
          params: {
            q: 'test',
            page: 1,
          },
        }),
      )
      .then(() => {
        expect(server.requests.length).to.equal(1);
      })
      .finally(() => {
        ajaxGetSpy.restore();
        removeCacheInterceptors(ajax, indexes);
      });
  });

  it("makes two requests when using `useCache: 'never'` in the action", () => {
    newCacheId();
    getCacheIdentifier = () => 'cacheIdentifier2';

    const ajaxAlwaysGetSpy = sinon.spy(ajax, 'get');
    const indexes = addCacheInterceptors(ajax, { useCache: 'always' });

    return ajax
      .get('/test')
      .then(() => {
        expect(ajaxAlwaysGetSpy.calledOnce, 'calledOnce').to.be.true;
        expect(ajaxAlwaysGetSpy.calledWith('/test'));
      })
      .then(() => ajax.get('/test', { lionCacheOptions: { useCache: 'never' } }))
      .then(() => {
        expect(server.requests.length).to.equal(2);
      })
      .finally(() => {
        ajaxAlwaysGetSpy.restore();
        removeCacheInterceptors(ajax, indexes);
      });
  });

  it('allows direct ajax calls without cache interceptors configured', () => {
    return ajax
      .get('/test')
      .then(() => {
        expect(server.requests.length).to.equal(1);
      })
      .then(() => ajax.get('/test'))
      .then(() => {
        expect(server.requests.length).to.equal(2);
      });
  });

  it('uses cache when inside `timeToLive: 5000` window', () => {
    newCacheId();
    const clock = sinon.useFakeTimers({
      shouldAdvanceTime: true,
    });

    const indexes = addCacheInterceptors(ajax, {
      useCache: 'always',
      timeToLive: 5000,
    });
    const ajaxGetSpy = sinon.spy(ajax, 'get');

    server.respondWith(/\/test-ttl-5000/, [
      200,
      { 'Content-Type': 'application/json' },
      JSON.stringify({ some: 'data-ttl-5000' }),
    ]);

    return ajax
      .get('/test-ttl-5000')
      .then(() => {
        expect(ajaxGetSpy.calledOnce).to.be.true;
        expect(ajaxGetSpy.calledWith('/test-ttl-5000')).to.be.true;
        expect(server.requests.length).to.equal(1);
      })
      .then(() => {
        clock.tick(4900);
      })
      .then(() => ajax.get('/test-ttl-5000'))
      .then(() => {
        expect(server.requests.length).to.equal(1);
        clock.tick(5100);
      })
      .then(() => ajax.get('/test-ttl-5000'))
      .then(() => {
        expect(server.requests.length).to.equal(2);
      })
      .finally(() => {
        ajaxGetSpy.restore();
        clock.restore();
        removeCacheInterceptors(ajax, indexes);
      });
  });

  it('deletes cache after one hour', () => {
    newCacheId();
    const clock = sinon.useFakeTimers({
      shouldAdvanceTime: true,
    });

    const ajaxGetSpy = sinon.spy(ajax, 'get');
    const indexes = addCacheInterceptors(ajax, {
      useCache: 'always',
      timeToLive: 1000 * 60 * 60,
    });

    server.respondWith(/\/test-hour/, [
      200,
      { 'Content-Type': 'application/json' },
      JSON.stringify({ some: 'data-hour' }),
    ]);

    return ajax
      .get('/test-hour')
      .then(() => {
        expect(ajaxGetSpy.calledOnce).to.be.true;
        expect(ajaxGetSpy.calledWith('/test-hour')).to.be.true;
        expect(server.requests.length).to.equal(1);
      })
      .then(() => {
        clock.tick(1000 * 60 * 59); // 0:59 hour
      })
      .then(() => ajax.get('/test-hour'))
      .then(() => {
        expect(server.requests.length).to.equal(1);
        clock.tick(1000 * 60 * 61); // 1:01 hour
      })
      .then(() => ajax.get('/test-hour'))
      .then(() => {
        expect(server.requests.length).to.equal(2);
      })
      .finally(() => {
        ajaxGetSpy.restore();
        clock.restore();
        removeCacheInterceptors(ajax, indexes);
      });
  });

  it('invalidates invalidateUrls endpoints', () => {
    newCacheId();

    const indexes = addCacheInterceptors(ajax, {
      useCache: 'always',
      timeToLive: 500,
    });
    const ajaxGetSpy = sinon.spy(ajax, 'get');
    const ajaxPostSpy = sinon.spy(ajax, 'post');

    server.respondWith(/\/test-valid-url/, xhr => {
      xhr.respond(
        200,
        { 'Content-Type': 'application/json' },
        JSON.stringify({ some: 'data-valid-url' }),
      );
    });

    server.respondWith(/\/test-invalid-url/, xhr => {
      xhr.respond(
        200,
        { 'Content-Type': 'application/json' },
        JSON.stringify({ some: 'data-invalid-url' }),
      );
    });
    const actionConfig = {
      lionCacheOptions: {
        invalidateUrls: ['/test-invalid-url'],
      },
    };

    return ajax
      .get('/test-valid-url', actionConfig)
      .then(() => {
        expect(ajaxGetSpy.calledOnce).to.be.true;
        expect(ajaxGetSpy.calledWith('/test-valid-url')).to.be.true;
        expect(server.requests.length).to.equal(1);
      })
      .then(() => ajax.get('/test-invalid-url'))
      .then(() => {
        expect(server.requests.length).to.equal(2);
      })
      .then(() => ajax.post('/test-valid-url', {}, actionConfig))
      .then(() => {
        expect(ajaxPostSpy.calledOnce).to.be.true;
        expect(ajaxPostSpy.calledWith('/test-valid-url')).to.be.true;
        expect(server.requests.length).to.equal(3);
      })
      .then(() => ajax.get('/test-invalid-url'))
      .then(() => {
        expect(server.requests.length).to.equal(4);
      })
      .finally(() => {
        ajaxGetSpy.restore();
        ajaxPostSpy.restore();
        removeCacheInterceptors(ajax, indexes);
      });
  });

  it('throws error when invalidateUrls is not an array', () => {
    newCacheId();

    const indexes = addCacheInterceptors(ajax, {
      useCache: 'always',
    });
    expect(() => {
      ajax.get('/test', {
        lionCacheOptions: validateOptions({
          // @ts-ignore needed for test
          invalidateUrls: 'not an array',
        }),
      });
    }).to.throw(/Property `invalidateUrls` must be of type `Array` or `falsy`/);
    removeCacheInterceptors(ajax, indexes);
  });

  it('throws error when invalidateUrls is applied to global config', () => {
    newCacheId();

    expect(() => {
      const indexes = addCacheInterceptors(ajax, {
        useCache: 'always',
        // @ts-ignore needed for test
        invalidateUrls: 'not an array',
      });
      removeCacheInterceptors(ajax, indexes);
    }).to.throw(
      /Property `invalidateUrls` can be applied only to config per action \(get, post etc\)/,
    );
  });

  it('invalidates cache on a post', () => {
    newCacheId();

    const indexes = addCacheInterceptors(ajax, {
      useCache: 'always',
      timeToLive: 100,
    });
    const ajaxGetSpy = sinon.spy(ajax, 'get');
    const ajaxPostSpy = sinon.spy(ajax, 'post');

    server.respondWith(/\/test-post/, [
      200,
      { 'Content-Type': 'application/json' },
      JSON.stringify({ some: 'data-post' }),
    ]);

    return ajax
      .get('/test-post')
      .then(() => {
        expect(ajaxGetSpy.calledOnce).to.be.true;
        expect(ajaxGetSpy.calledWith('/test-post')).to.be.true;
        expect(server.requests.length).to.equal(1);
      })
      .then(() => ajax.post('/test-post', { some: 'data-post' }))
      .then(() => {
        expect(ajaxPostSpy.calledOnce).to.be.true;
        expect(ajaxPostSpy.calledWith('/test-post')).to.be.true;
        expect(server.requests.length).to.equal(2);
      })
      .then(() => ajax.get('/test-post'))
      .then(() => {
        expect(server.requests.length).to.equal(3);
      })
      .finally(() => {
        ajaxGetSpy.restore();
        ajaxPostSpy.restore();
        removeCacheInterceptors(ajax, indexes);
      });
  });

  it('throws error when requestIdentificationFn is not a function', () => {
    newCacheId();

    expect(() => {
      const indexes = addCacheInterceptors(ajax, {
        useCache: 'always',
        // @ts-ignore needed for test
        requestIdentificationFn: 'not a function',
      });
      removeCacheInterceptors(ajax, indexes);
    }).to.throw(/Property `requestIdentificationFn` must be of type `function` or `falsy`/);
  });

  it('uses custom requestIdentificationFn when passed', () => {
    newCacheId();

    const customRequestIdFn = /** @type {RequestIdentificationFn} */ (request, serializer) => {
      return `${request.url}-${request.headers['x-id']}?${serializer(request.params)}`;
    };
    const reqIdSpy = sinon.spy(customRequestIdFn);
    const indexes = addCacheInterceptors(ajax, {
      useCache: 'always',
      requestIdentificationFn: reqIdSpy,
    });

    return ajax
      .get('/test', { headers: { 'x-id': '1' } })
      .then(() => {
        expect(reqIdSpy.calledOnce);
        expect(reqIdSpy.returnValues[0]).to.equal(`/test-1?`);
      })
      .finally(() => {
        removeCacheInterceptors(ajax, indexes);
      });
  });
});
