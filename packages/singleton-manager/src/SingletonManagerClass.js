const sym = Symbol.for('lion::SingletonManagerClassStorage');

/**
 * Allow compatibility with node-js (for ssr).
 * In the future, we can just use globalThis directly
 * (for now, we're backwards compatible with browsers that still only use window, since we don't know all contexts singleton-manager is used in).
 */
// eslint-disable-next-line no-undef
const globalThisOrWindow = globalThis || window;
export class SingletonManagerClass {
  constructor() {
    /** @protected */
    this._map = globalThisOrWindow[sym]
      ? globalThisOrWindow[sym]
      : (globalThisOrWindow[sym] = new Map());
  }

  /**
   * Ignores already existing keys (e.g. it will not override)
   *
   * @param {string} key
   * @param {any} value
   */
  set(key, value) {
    if (!this.has(key)) {
      this._map.set(key, value);
    }
  }

  /**
   * @param {string} key
   * @returns
   */
  get(key) {
    return this._map.get(key);
  }

  /**
   * @param {string} key
   */
  has(key) {
    return this._map.has(key);
  }
}
