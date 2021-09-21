import './typedef.js';

export default class PendingRequestStore {
  constructor() {
    /**
     * @type {{ [requestId: string]: { promise: Promise<void>, resolve: (value?: any) => void } }}
     * @private
     */
    this._pendingRequests = {};
  }

  /**
   * Creates a promise for a pending request with given key
   * @param {string} requestId
   */
  set(requestId) {
    if (this._pendingRequests[requestId]) {
      return;
    }
    /** @type {(value?: any) => void } */
    let resolve;
    const promise = new Promise(_resolve => {
      resolve = _resolve;
    });
    // @ts-ignore
    this._pendingRequests[requestId] = { promise, resolve };
  }

  /**
   * Gets the promise for a pending request with given key
   * @param {string} requestId
   * @returns {Promise<void> | undefined}
   */
  get(requestId) {
    return this._pendingRequests[requestId]?.promise;
  }

  /**
   * Resolves the promise of a pending request that matches the given string
   * @param { string } requestId the requestId to resolve
   */
  resolve(requestId) {
    this._pendingRequests[requestId]?.resolve();
    delete this._pendingRequests[requestId];
  }

  /**
   * Resolves the promise of pending requests that match the given regex
   * @param { RegExp } regex an regular expression to match store entries
   */
  resolveMatching(regex) {
    Object.keys(this._pendingRequests).forEach(pendingRequestId => {
      if (regex.test(pendingRequestId)) {
        this.resolve(pendingRequestId);
      }
    });
  }

  reset() {
    this._pendingRequests = {};
  }
}
