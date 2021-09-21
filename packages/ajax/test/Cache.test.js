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
      requestId1: { createdAt: Date.now() - TWO_MINUTES_IN_MS, response: 'cached data 1' },
      requestId2: { createdAt: Date.now(), response: 'cached data 2' },
    };

    it('returns undefined if no cached request found for requestId', () => {
      // Given
      const maxAge = TEN_MINUTES_IN_MS;
      const expected = undefined;
      // When
      const result = cache.get('nonCachedRequestId', maxAge);
      // Then
      expect(result).to.equal(expected);
    });

    it('returns undefined if maxAge is not a number', () => {
      // Given
      const maxAge = 'some string';
      const expected = undefined;
      // When
      const result = cache.get('requestId1', maxAge);
      // Then
      expect(result).to.equal(expected);
    });

    it('returns undefined if maxAge is not finite', () => {
      // Given
      const maxAge = 1 / 0;
      const expected = undefined;
      // When
      const result = cache.get('requestId1', maxAge);
      // Then
      expect(result).to.equal(expected);
    });

    it('returns undefined if maxAge is negative', () => {
      // Given
      const maxAge = -10;
      const expected = undefined;
      // When
      const result = cache.get('requestId1', maxAge);
      // Then
      expect(result).to.equal(expected);
    });

    it('returns undefined if cached request age is not less than maxAge', () => {
      // Given
      const maxAge = A_MINUTE_IN_MS;
      const expected = undefined;
      // When
      const result = cache.get('requestId1', maxAge);
      // Then
      expect(result).to.equal(expected);
    });

    it('gets the cached request by requestId if cached request age is less than maxAge', () => {
      // Given
      const maxAge = TEN_MINUTES_IN_MS;
      const expected = cache._cachedRequests?.requestId1?.response;
      // When
      const result = cache.get('requestId1', maxAge);
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
      expect(cache.get('requestId1', maxAge)).to.equal(response1);
      expect(cache.get('requestId2', maxAge)).to.equal(response2);
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
      expect(cache.get('requestId1', maxAge)).to.equal(response);
      // When
      cache.set('requestId1', updatedResponse);
      // Then
      expect(cache.get('requestId1', maxAge)).to.equal(updatedResponse);
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
      expect(cache.get('requestId1', maxAge)).to.equal(response1);
      expect(cache.get('requestId2', maxAge)).to.equal(response2);
      // When
      cache.delete('requestId1');
      // Then
      expect(cache.get('requestId1', maxAge)).to.be.undefined;
      expect(cache.get('requestId2', maxAge)).to.equal(response2);
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
      expect(cache.get('requestId1', maxAge)).to.equal(response1);
      expect(cache.get('requestId2', maxAge)).to.equal(response2);
      expect(cache.get('anotherRequestId', maxAge)).to.equal(response3);
      // When
      cache.deleteMatching(/^requestId/);
      // Then
      expect(cache.get('requestId1', maxAge)).to.be.undefined;
      expect(cache.get('requestId2', maxAge)).to.be.undefined;
      expect(cache.get('anotherRequestId', maxAge)).to.equal(response3);
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
      cache.set('requestId1', response1);
      cache.set('requestId2', response2);
      // Then
      expect(cache.get('requestId1', maxAge)).to.equal(response1);
      expect(cache.get('requestId2', maxAge)).to.equal(response2);
      // When
      cache.reset();
      // Then
      expect(cache.get('requestId1', maxAge)).to.be.undefined;
      expect(cache.get('requestId2', maxAge)).to.be.undefined;
    });
  });
});
