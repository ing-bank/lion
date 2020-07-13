/**
 * 'LionSingleton' provides an instance of the given class via .getInstance(foo, bar) and will
 * return the same instance if already created. It can reset its instance so a new one will be
 * created via .resetInstance() and can at any time add mixins via .addInstanceMixin().
 * It can provide new instances (with applied Mixins) via .getNewInstance().
 */
export class LionSingleton {
  /**
   * @param {function} mixin
   */
  static addInstanceMixin(mixin) {
    if (!this.__instanceMixins) {
      /** @type {function[]} */
      this.__instanceMixins = [];
    }
    this.__instanceMixins.push(mixin);
  }

  /**
   * @param {...*} args
   * @returns {LionSingleton}
   */
  static getNewInstance(...args) {
    let Klass = this;
    if (Array.isArray(this.__instanceMixins)) {
      this.__instanceMixins.forEach(mixin => {
        Klass = mixin(Klass);
      });
    }
    // Ignoring, because it's up to the extension layer to accept arguments in its constructor
    // @ts-ignore-next-line
    return new Klass(...args);
  }

  /**
   * @param {...*} args
   * @returns {*}
   */
  static getInstance(...args) {
    if (this.__instance) {
      return this.__instance;
    }

    this.__instance = this.getNewInstance(...args);
    return this.__instance;
  }

  static resetInstance() {
    this.__instance = undefined;
  }
}
