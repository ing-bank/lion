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
   * The size of the cache
   * @returns {number}
   */
  get size() {
    return this._size;
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
   * @param {number|undefined} [options.maxAge] maximum age of a cached request to serve from cache, in milliseconds
   * @param {number|undefined} [options.maxResponseSize] maximum size of a cached request to serve from cache, in bytes
   * @returns {CacheResponse | undefined}
   */
  get(requestId, { maxAge = 0, maxResponseSize = 0 }) {
    const cachedRequest = this._cachedRequests[requestId];
    if (!cachedRequest) {
      return undefined;
    }

    if (!Number.isFinite(maxAge)) {
      return undefined;
    }

    const cachedRequestAge = Date.now() - cachedRequest.createdAt;
    if (cachedRequestAge >= Number(maxAge)) {
      return undefined;
    }

    if (maxResponseSize && cachedRequest.size > Number(maxResponseSize)) {
      return undefined;
    }

    return cachedRequest.response;
  }

  /**
   * Delete the item with the given requestId from the cache
   * @param {string } requestId the request id to delete from the cache
   */
  delete(requestId) {
    if (this._cachedRequests[requestId]) {
      this._size -= this._cachedRequests[requestId].size;
    }

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

  reset() {
    this._cachedRequests = {};
    this._size = 0;
  }
}
