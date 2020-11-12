const sym = Symbol.for('lion::SingletonManagerClassStorage');

export class SingletonManagerClass {
  constructor() {
    this._map = window[sym] ? window[sym] : window[sym] = new Map();
  }

  /**
   * @param {string} key
   * @param {any} value
   * @throws {Error} Will throw if the key is already defined
   */
  set(key, value) {
    if (this.has(key)) {
      throw new Error(`The key "${key}" is already defined and can not be overridden.`);
    }
    this._map.set(key, value);
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
