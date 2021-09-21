// @ts-nocheck
import { expect } from '@open-wc/testing';
import * as sinon from 'sinon';
import {
  ajaxCache,
  pendingRequestStore,
  resetCacheSession,
  extendCacheOptions,
  validateCacheOptions,
  invalidateMatchingCache,
  isCurrentSessionId,
} from '../src/cacheManager.js';
import Cache from '../src/Cache.js';
import PendingRequestStore from '../src/PendingRequestStore.js';

describe('cacheManager', () => {
  describe('ajaxCache', () => {
    it('is an instance of the Cache class', () => {
      expect(ajaxCache).to.be.instanceOf(Cache);
    });
  });

  describe('pendingRequestStore', () => {
    it('is an instance of the PendingRequestStore class', () => {
      expect(pendingRequestStore).to.be.instanceOf(PendingRequestStore);
    });
  });

  describe('resetCacheSession', () => {
    let ajaxCacheSpy;
    let pendingRequestStoreSpy;

    beforeEach(() => {
      ajaxCacheSpy = sinon.spy(ajaxCache, 'reset');
      pendingRequestStoreSpy = sinon.spy(pendingRequestStore, 'reset');
    });

    afterEach(() => {
      ajaxCacheSpy.restore();
      pendingRequestStoreSpy.restore();
    });

    it('throws an Error when no cacheId is passed', () => {
      try {
        resetCacheSession();
      } catch (e) {
        expect(e).to.be.an.instanceOf(Error);
      }
    });

    it('assigns the passed cacheId to the cacheSessionId', () => {
      // Arrange
      const cacheId = 'a-new-cache-id';
      // Act
      resetCacheSession(cacheId);
      // Assert
      expect(ajaxCacheSpy.calledOnce).to.be.true;
      expect(pendingRequestStoreSpy.calledOnce).to.be.true;
    });
  });

  describe('extendCacheOptions', () => {
    // Arrange
    const DEFAULT_MAX_AGE = 1000 * 60 * 60;
    const invalidateUrls = ['https://f00.bar/', 'https://share.ware/'];
    const invalidateUrlsRegex = /f00/;

    it('returns object with default values', () => {
      // Act
      const {
        useCache,
        methods,
        maxAge,
        requestIdFunction,
        invalidateUrls: invalidateUrlsResult,
        invalidateUrlsRegex: invalidateUrlsRegexResult,
      } = extendCacheOptions({ invalidateUrls, invalidateUrlsRegex });
      // Assert
      expect(useCache).to.be.false;
      expect(methods).to.eql(['get']);
      expect(maxAge).to.equal(DEFAULT_MAX_AGE);
      expect(typeof requestIdFunction).to.eql('function');
      expect(invalidateUrlsResult).to.equal(invalidateUrls);
      expect(invalidateUrlsRegexResult).to.equal(invalidateUrlsRegex);
    });

    it('the DEFAULT_GET_REQUEST_ID function throws when called with no arguments', () => {
      // Arrange
      const { requestIdFunction } = extendCacheOptions({
        invalidateUrls,
        invalidateUrlsRegex,
      });
      // Act
      expect(requestIdFunction).to.throw(TypeError);
    });

    it('the DEFAULT_GET_REQUEST_ID function returns a url when URLSearchParams cannot be serialized', () => {
      // Arrange
      const { requestIdFunction } = extendCacheOptions({
        invalidateUrls,
        invalidateUrlsRegex,
      });
      // Act
      const formattedUrl = requestIdFunction({
        url: 'http://f00.bar/',
        params: {},
      });
      // Assert
      expect(formattedUrl).to.equal('http://f00.bar/');
    });

    it('the DEFAULT_GET_REQUEST_ID function returns a correctly formatted url with URLSearchParams', () => {
      // Arrange
      const { requestIdFunction } = extendCacheOptions({
        invalidateUrls,
        invalidateUrlsRegex,
      });
      // Act
      const formattedUrl = requestIdFunction({
        url: 'http://f00.bar/',
        params: { f00: 'bar', bar: 'f00' },
      });
      // Assert
      expect(formattedUrl).to.equal('http://f00.bar/?f00=bar&bar=f00');
    });
  });

  describe('validateCacheOptions', () => {
    it('does not accept null as argument', () => {
      expect(() => validateCacheOptions(null)).to.throw(TypeError);
    });
    it('accepts an empty object', () => {
      expect(() => validateCacheOptions({})).not.to.throw(
        'Property `useCache` must be a `boolean`',
      );
    });
    describe('the useCache property', () => {
      it('accepts a boolean', () => {
        expect(() => validateCacheOptions({ useCache: false })).not.to.throw;
      });
      it('accepts undefined', () => {
        expect(() => validateCacheOptions({ useCache: undefined })).not.to.throw;
      });
      it('does not accept anything else', () => {
        // @ts-ignore
        expect(() => validateCacheOptions({ useCache: '' })).to.throw(
          'Property `useCache` must be a `boolean`',
        );
      });
    });
    describe('the methods property', () => {
      it('accepts an array with the value `get`', () => {
        expect(() => validateCacheOptions({ methods: ['get'] })).not.to.throw;
      });
      it('accepts undefined', () => {
        expect(() => validateCacheOptions({ methods: undefined })).not.to.throw;
      });
      it('does not accept anything else', () => {
        expect(() => validateCacheOptions({ methods: [] })).to.throw(
          'Cache can only be utilized with `GET` method',
        );
        expect(() => validateCacheOptions({ methods: ['post'] })).to.throw(
          'Cache can only be utilized with `GET` method',
        );
        expect(() => validateCacheOptions({ methods: ['get', 'post'] })).to.throw(
          'Cache can only be utilized with `GET` method',
        );
      });
    });
    describe('the maxAge property', () => {
      it('accepts a finite number', () => {
        expect(() => validateCacheOptions({ maxAge: 42 })).not.to.throw;
      });
      it('accepts undefined', () => {
        expect(() => validateCacheOptions({ maxAge: undefined })).not.to.throw;
      });
      it('does not accept anything else', () => {
        // @ts-ignore
        expect(() => validateCacheOptions({ maxAge: 'string' })).to.throw(
          'Property `maxAge` must be a finite `number`',
        );
        expect(() => validateCacheOptions({ maxAge: Infinity })).to.throw(
          'Property `maxAge` must be a finite `number`',
        );
      });
    });
    describe('the invalidateUrls property', () => {
      it('accepts an array', () => {
        // @ts-ignore Typescript requires this to be an array of string, but this is not checked by validateCacheOptions
        expect(() =>
          validateCacheOptions({ invalidateUrls: [6, 'elements', 'in', 1, true, Array] }),
        ).not.to.throw;
      });
      it('accepts undefined', () => {
        expect(() => validateCacheOptions({ invalidateUrls: undefined })).not.to.throw;
      });
      it('does not accept anything else', () => {
        // @ts-ignore
        expect(() => validateCacheOptions({ invalidateUrls: 'not-an-array' })).to.throw(
          'Property `invalidateUrls` must be an `Array` or `falsy`',
        );
      });
    });
    describe('the invalidateUrlsRegex property', () => {
      it('accepts a regular expression', () => {
        expect(() => validateCacheOptions({ invalidateUrlsRegex: /this is a very picky regex/ }))
          .not.to.throw;
      });
      it('accepts undefined', () => {
        expect(() => validateCacheOptions({ invalidateUrlsRegex: undefined })).not.to.throw;
      });
      it('does not accept anything else', () => {
        // @ts-ignore
        expect(() =>
          validateCacheOptions({ invalidateUrlsRegex: 'a string is not a regex' }),
        ).to.throw('Property `invalidateUrlsRegex` must be a `RegExp` or `falsy`');
      });
    });
    describe('the requestIdFunction property', () => {
      it('accepts a function', () => {
        // @ts-ignore Typescript requires the requestIdFunction to return a string, but this is not checked by validateCacheOptions
        expect(() =>
          validateCacheOptions({ requestIdFunction: () => ['this-is-ok-outside-typescript'] }),
        ).not.to.throw;
      });
      it('accepts undefined', () => {
        expect(() => validateCacheOptions({ requestIdFunction: undefined })).not.to.throw;
      });
      it('does not accept anything else', () => {
        // @ts-ignore
        expect(() => validateCacheOptions({ requestIdFunction: 'not a function' })).to.throw(
          'Property `requestIdFunction` must be a `function`',
        );
      });
    });
  });

  describe('invalidateMatchingCache', () => {
    beforeEach(() => {
      sinon.spy(ajaxCache, 'delete');
      sinon.spy(ajaxCache, 'deleteMatching');
      sinon.spy(pendingRequestStore, 'resolve');
      sinon.spy(pendingRequestStore, 'resolveMatching');
    });

    afterEach(() => {
      sinon.restore();
    });

    it('calls delete on the ajaxCache and calls resolve on the pendingRequestStore', () => {
      // Arrange
      const requestId = 'request-id';
      // Act
      invalidateMatchingCache(requestId, {});
      // Assert
      expect(ajaxCache.delete).to.have.been.calledOnce;
      expect(pendingRequestStore.resolve.calledOnce).to.be.true;

      expect(ajaxCache.delete.calledWith(requestId)).to.be.true;
      expect(pendingRequestStore.resolve.calledWith(requestId)).to.be.true;
    });

    it('calls invalidateMatching for all URL items in the invalidateUrls argument', () => {
      // Arrange
      const requestId = 'request-id';
      const invalidateUrls = ['https://f00.bar/'];
      // Act
      invalidateMatchingCache(requestId, { invalidateUrls });
      // Assert
      expect(ajaxCache.delete.calledTwice).to.be.true;
      expect(pendingRequestStore.resolve.calledTwice).to.be.true;

      expect(ajaxCache.delete.calledWith(requestId)).to.be.true;
      expect(pendingRequestStore.resolve.calledWith(requestId)).to.be.true;

      expect(ajaxCache.delete.calledWith('https://f00.bar/')).to.be.true;
      expect(pendingRequestStore.resolve.calledWith('https://f00.bar/')).to.be.true;
    });

    it('calls invalidateMatching when the invalidateUrlsRegex argument is passed', () => {
      // Arrange
      const requestId = 'request-id';
      const invalidateUrlsRegex = 'f00';
      // Act
      invalidateMatchingCache(requestId, { invalidateUrlsRegex });
      // Assert
      expect(ajaxCache.delete.calledOnce).to.be.true;
      expect(ajaxCache.deleteMatching.calledOnce).to.be.true;
      expect(pendingRequestStore.resolve.calledOnce).to.be.true;
      expect(pendingRequestStore.resolveMatching.calledOnce).to.be.true;

      expect(ajaxCache.delete.calledWith(requestId)).to.be.true;
      expect(pendingRequestStore.resolve.calledWith(requestId)).to.be.true;

      expect(ajaxCache.deleteMatching.calledWith('f00')).to.be.true;
      expect(pendingRequestStore.resolveMatching.calledWith('f00')).to.be.true;
    });
  });

  describe('isCurrentSessionId', () => {
    it('returns true for the current session id', () => {
      resetCacheSession('the-id');

      expect(isCurrentSessionId('the-id')).to.equal(true);
    });

    it('returns true for the current session id', () => {
      resetCacheSession('the-id');

      expect(isCurrentSessionId('a-different-id')).to.equal(false);
    });
  });
});
