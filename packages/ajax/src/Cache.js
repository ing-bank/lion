import './typedef.js';

export default class Cache {
  constructor() {
    /**
     * @type CachedRequests
     * @private
     */
    this._cachedRequests = {};

    /**
     * @type {number}
     * @private
     */
    this._size = 0;
  }

  /**
   * Store an item in the cache
   * @param {string} requestId key by which the request is stored
   * @param {CacheResponse} response the cached response
   * @param {number} size the response size
   */
  set(requestId, response, size = 0) {
    if (this._cachedRequests[requestId]) {
      this.delete(requestId);
    }

    this._cachedRequests[requestId] = {
      createdAt: Date.now(),
      size,
      response,
    };

    this._size += size;
  }

  /**
   * Retrieve an item from the cache
   * @param {string} requestId key by which the cache is stored
   * @param {object} options
   * @param {number} [options.maxAge] maximum age of a cached request to serve from cache, in milliseconds
   * @param {number} [options.maxResponseSize] maximum size of a cached request to serve from cache, in bytes
   * @returns {CacheResponse | undefined}
   */
  get(requestId, { maxAge = Infinity, maxResponseSize = Infinity } = {}) {
    const isNumber = (/** @type any */ num) => Number(num) === num;

    const cachedRequest = this._cachedRequests[requestId];
    if (!cachedRequest) {
      return undefined;
    }

    // maxAge and maxResponseSize should both be numbers
    if (!isNumber(maxAge)) {
      return undefined;
    }

    if (!isNumber(maxResponseSize)) {
      return undefined;
    }

    if (Date.now() >= cachedRequest.createdAt + maxAge) {
      return undefined;
    }

    if (cachedRequest.size > maxResponseSize) {
      return undefined;
    }

    return cachedRequest.response;
  }

  /**
   * Delete the item with the given requestId from the cache
   * @param {string } requestId the request id to delete from the cache
   */
  delete(requestId) {
    const cachedRequest = this._cachedRequests[requestId];

    if (!cachedRequest) {
      return;
    }

    this._size -= cachedRequest.size;
    delete this._cachedRequests[requestId];
  }

  /**
   * Delete all items from the cache that match given regex
   * @param {RegExp} regex a regular expression to match cache entries
   */
  deleteMatching(regex) {
    Object.keys(this._cachedRequests).forEach(requestId => {
      if (new RegExp(regex).test(requestId)) {
        this.delete(requestId);
      }
    });
  }

  /**
   * Truncate the cache to the given size, according to a First-In-First-Out (FIFO) policy
   *
   * @param {number} maxAllowedCacheSize
   */
  truncateTo(maxAllowedCacheSize) {
    if (this._size <= maxAllowedCacheSize) return;

    const requests = this._cachedRequests;

    const sortedRequestIds = Object.keys(requests).sort(
      (a, b) => requests[a].createdAt - requests[b].createdAt,
    );

    for (const requestId of sortedRequestIds) {
      this.delete(requestId);
      if (this._size <= maxAllowedCacheSize) return;
    }
  }

  reset() {
    this._cachedRequests = {};
    this._size = 0;
  }
}
