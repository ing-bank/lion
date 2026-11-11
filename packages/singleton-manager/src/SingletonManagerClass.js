const sym = Symbol.for('lion::SingletonManagerClassStorage');

/**
 * The storage lives on globalThis, so it is shared in browsers and node-js (ssr) alike.
 * @type {typeof globalThis & { [key: symbol]: any }}
 */
const globalScope = /** @type {any} */ (globalThis);
export class SingletonManagerClass {
  constructor() {
    /** @protected */
    this._map = globalScope[sym] ? globalScope[sym] : (globalScope[sym] = new Map());
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
