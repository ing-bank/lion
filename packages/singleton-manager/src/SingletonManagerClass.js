export class SingletonManagerClass {
  constructor() {
    this._map = new Map();
  }

  set(key, value) {
    if (this.has(key)) {
      throw new Error(`The key "${key}" is already defined and can not be overridden.`);
    }
    this._map.set(key, value);
  }

  get(key) {
    return this._map.get(key);
  }

  has(key) {
    return this._map.has(key);
  }
}
