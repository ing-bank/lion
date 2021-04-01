const sym = Symbol.for('lion::SingletonManagerClassStorage');

export class SingletonManagerClass {
  constructor() {
    /** protected */
    this._map = window[sym] ? window[sym] : (window[sym] = new Map());
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
