class DesignManager {
  constructor() {
    this._designs = {};
  }

  /**
   * @param {string} name
   * @returns
   */
  getDesignFor(name) {
    if (!this._designs[name]) {
      throw new Error(`Design for '${name}' not registered`);
    } else {
      return this._designs[name];
    }
  }

  registerDesignFor(name, obj) {
    this._designs[name] = obj;
  }
}
export const designManager = new DesignManager();
