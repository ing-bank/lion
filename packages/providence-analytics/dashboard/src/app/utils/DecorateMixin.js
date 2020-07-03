import { GlobalDecorator } from './GlobalDecorator.js';

// TODO: dedupe via @lion
export const DecorateMixin = superclass => {
  // eslint-disable-next-line no-shadow
  class DecorateMixin extends superclass {
    /**
     *
     * @param {CssResult[]} styles
     * @param {boolean} prepend
     */
    static decorateStyles(styles, { prepend } = {}) {
      if (!prepend) {
        this.__decoratedStyles.push(styles);
      } else {
        this.__decoratedStylesPrepended.push(styles);
      }
    }

    static decorateMethod(name, fn) {
      const originalMethod = this.prototype[name];
      this.prototype[name] = (...args) => {
        fn(originalMethod, ...args);
      };
    }

    static get styles() {
      return [
        ...GlobalDecorator.globalDecoratedStylesPrepended,
        ...this.__decoratedStylesPrepended,
        ...(super.styles || []),
        ...GlobalDecorator.globalDecoratedStyles,
        ...this.__decoratedStyles,
      ];
    }
  }
  DecorateMixin.__decoratedStyles = [];
  DecorateMixin.__decoratedStylesPrepended = [];
  return DecorateMixin;
};
