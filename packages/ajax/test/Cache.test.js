// @ts-nocheck
import { expect } from '@open-wc/testing';
import Cache from '../src/Cache.js';

const A_MINUTE_IN_MS = 60 * 1000;
const TWO_MINUTES_IN_MS = 2 * A_MINUTE_IN_MS;
const TEN_MINUTES_IN_MS = 10 * A_MINUTE_IN_MS;

describe('Cache', () => {
  describe('public interface', () => {
    const cache = new Cache();

    it('Cache has `set` method', () => {
      expect(cache.set).to.exist;
    });

    it('Cache has `get` method', () => {
      expect(cache.get).to.exist;
    });

    it('Cache has `delete` method', () => {
      expect(cache.delete).to.exist;
    });

    it('Cache has `reset` method', () => {
      expect(cache.reset).to.exist;
    });
  });

  describe('cache.get', () => {
    // Mock cache data
    const cache = new Cache();

    cache._cachedRequests = {
      requestId1: {
        createdAt: Date.now() - TWO_MINUTES_IN_MS,
        response: 'cached data 1',
        size: 1000,
      },
      requestId2: { createdAt: Date.now(), response: 'cached data 2', size: 100 },
    };

    it('returns undefined if no cached request found for requestId', () => {
      // Given
      const maxAge = TEN_MINUTES_IN_MS;
      const expected = undefined;
      // When
      const result = cache.get('nonCachedRequestId', { maxAge });
      // Then
      expect(result).to.equal(expected);
    });

    it('returns undefined if maxAge is not a number', () => {
      // Given
      const maxAge = 'some string';
      const expected = undefined;
      // When
      const result = cache.get('requestId1', { maxAge });
      // Then
      expect(result).to.equal(expected);
    });

    it('returns undefined if maxAge is negative', () => {
      // Given
      const maxAge = -10;
      const expected = undefined;
      // When
      const result = cache.get('requestId1', { maxAge });
      // Then
      expect(result).to.equal(expected);
    });

    it('returns undefined if cached request age is not less than maxAge', () => {
      // Given
      const maxAge = A_MINUTE_IN_MS;
      const expected = undefined;
      // When
      const result = cache.get('requestId1', { maxAge });
      // Then
      expect(result).to.equal(expected);
    });

    it('gets the cached request by requestId if cached request age is less than maxAge', () => {
      // Given
      const maxAge = TEN_MINUTES_IN_MS;
      const expected = cache._cachedRequests?.requestId1?.response;
      // When
      const result = cache.get('requestId1', { maxAge });
      // Then
      expect(result).to.deep.equal(expected);
    });

    it('returns the cached value if maxAge is Infinity', () => {
      // Given
      const maxAge = 1 / 0;
      const expected = 'cached data 1';
      // When
      const result = cache.get('requestId1', { maxAge });
      // Then
      expect(result).to.equal(expected);
    });

    it('returns the cached value if neither maxAge nor maxSize is specified', () => {
      // Given
      const expected = 'cached data 1';
      // When
      const result = cache.get('requestId1');
      // Then
      expect(result).to.equal(expected);
    });

    it('returns undefined if maxResponseSize is set and is smaller than the recorded size of the cache item', () => {
      // Given
      const maxAge = TEN_MINUTES_IN_MS;
      const maxResponseSize = 100;
      const expected = undefined;
      // When
      const result = cache.get('requestId1', { maxAge, maxResponseSize });
      // Then
      expect(result).to.equal(expected);
    });

    it('returns undefined if maxResponseSize is set and is not a number', () => {
      // Given
      const maxAge = TEN_MINUTES_IN_MS;
      const maxResponseSize = 'nine thousand';
      const expected = undefined;
      // When
      const result = cache.get('requestId1', { maxAge, maxResponseSize });
      // Then
      expect(result).to.equal(expected);
    });

    it('gets the cached request by requestId if maxResponseSize is set and is greater than the recorded size of the cache item', () => {
      // Given
      const maxAge = TEN_MINUTES_IN_MS;
      const maxResponseSize = 10000;
      const expected = cache._cachedRequests?.requestId1?.response;
      // When
      const result = cache.get('requestId1', { maxAge, maxResponseSize });
      // Then
      expect(result).to.deep.equal(expected);
    });
  });

  describe('cache.set', () => {
    it('stores the `response` for the given `requestId`', () => {
      // Given
      const cache = new Cache();
      const maxAge = TEN_MINUTES_IN_MS;
      const response1 = 'response of request1';
      const response2 = 'response of request2';
      // When
      cache.set('requestId1', response1);
      cache.set('requestId2', response2);
      // Then
      expect(cache.get('requestId1', { maxAge })).to.equal(response1);
      expect(cache.get('requestId2', { maxAge })).to.equal(response2);
    });

    it('updates the `response` for the given `requestId`, if already cached', () => {
      // Given
      const cache = new Cache();
      const maxAge = TEN_MINUTES_IN_MS;
      const response = 'response of request1';
      const updatedResponse = 'updated response of request1';
      // When
      cache.set('requestId1', response);
      // Then
      expect(cache.get('requestId1', { maxAge })).to.equal(response);
      // When
      cache.set('requestId1', updatedResponse);
      // Then
      expect(cache.get('requestId1', { maxAge })).to.equal(updatedResponse);
    });
  });

  describe('cache.delete', () => {
    it('deletes cache by `requestId`', () => {
      // Given
      const cache = new Cache();
      const maxAge = TEN_MINUTES_IN_MS;
      const response1 = 'response of request1';
      const response2 = 'response of request2';
      // When
      cache.set('requestId1', response1);
      cache.set('requestId2', response2);
      // Then
      expect(cache.get('requestId1', { maxAge })).to.equal(response1);
      expect(cache.get('requestId2', { maxAge })).to.equal(response2);
      // When
      cache.delete('requestId1');
      // Then
      expect(cache.get('requestId1', { maxAge })).to.be.undefined;
      expect(cache.get('requestId2', { maxAge })).to.equal(response2);
    });

    it('deletes cache by regex', () => {
      // Given
      const cache = new Cache();
      const maxAge = TEN_MINUTES_IN_MS;
      const response1 = 'response of request1';
      const response2 = 'response of request2';
      const response3 = 'response of request3';
      // When
      cache.set('requestId1', response1);
      cache.set('requestId2', response2);
      cache.set('anotherRequestId', response3);
      // Then
      expect(cache.get('requestId1', { maxAge })).to.equal(response1);
      expect(cache.get('requestId2', { maxAge })).to.equal(response2);
      expect(cache.get('anotherRequestId', { maxAge })).to.equal(response3);
      // When
      cache.deleteMatching(/^requestId/);
      // Then
      expect(cache.get('requestId1', { maxAge })).to.be.undefined;
      expect(cache.get('requestId2', { maxAge })).to.be.undefined;
      expect(cache.get('anotherRequestId', { maxAge })).to.equal(response3);
    });
  });

  describe('cache.reset', () => {
    it('resets the cache', () => {
      // Given
      const cache = new Cache();
      const maxAge = TEN_MINUTES_IN_MS;
      const response1 = 'response of request1';
      const response2 = 'response of request2';
      // When
      cache.set('requestId1', response1, { maxAge: 1 });
      cache.set('requestId2', response2, { maxAge: 2 });
      // Then
      expect(cache.get('requestId1', { maxAge })).to.equal(response1, 3);
      expect(cache.get('requestId2', { maxAge })).to.equal(response2, 4);
      // When
      cache.reset();
      // Then
      expect(cache.get('requestId1', { maxAge })).to.be.undefined;
      expect(cache.get('requestId2', { maxAge })).to.be.undefined;
    });
  });

  describe('cache.truncateTo', () => {
    let cache;

    beforeEach(() => {
      cache = new Cache();

      cache.set('requestId1', 'response1', 123);
      cache.set('requestId2', 'response2', 321);
      cache.set('requestId3', 'response3', 111);

      expect(cache._size).to.equal(555);
    });

    it('removes the oldest item if the cache is too large', () => {
      cache.truncateTo(500);

      expect(cache._size).to.equal(432);
    });

    it('removes items until the specified size is reached', () => {
      cache.truncateTo(200);

      expect(cache._size).to.equal(111);
    });

    it('removes everything if the size is smaller than the newest thing', () => {
      cache.truncateTo(100);

      expect(cache._size).to.equal(0);
    });

    it('does nothing when the size is larger than the current size', () => {
      cache.truncateTo(600);

      expect(cache._size).to.equal(555);
    });
  });
});
