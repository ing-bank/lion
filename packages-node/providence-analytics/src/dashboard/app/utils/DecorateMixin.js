import { GlobalDecorator } from './GlobalDecorator.js';

/**
 * @typedef {import('lit').CSSResultGroup} CSSResultGroup
 */

// TODO: dedupe via @lion
/**
 * @type {import('./types/DecorateMixinTypes.js').DecorateMixin}
 */
export const DecorateMixin = superclass => {
  // eslint-disable-next-line no-shadow
  class DecorateMixin extends superclass {
    /**
     *
     * @param {CSSResultGroup} styles
     * @param {{ prepend?: boolean }} [opts]
     */
    static decorateStyles(styles, { prepend } = {}) {
      if (!prepend) {
        this.__decoratedStyles.push(styles);
      } else {
        this.__decoratedStylesPrepended.push(styles);
      }
    }

    /**
     * @param {string} name
     * @param {(...args: unknown[]) => void} fn
     */
    static decorateMethod(name, fn) {
      const proto = /** @type {{[key: string]: (...args: unknown[]) => unknown}} */ (
        /** @type {unknown} */ (this.prototype)
      );
      const originalMethod = proto[name];
      proto[name] = (...args) => {
        fn(originalMethod, ...args);
      };
    }

    /**
     * @returns {import('lit').CSSResultArray}
     */
    static get styles() {
      /**
       * @type {import('lit').CSSResultArray}
       */
      let superStyles = [];
      if (Array.isArray(super.styles)) {
        superStyles = super.styles;
      } else if (super.styles) {
        superStyles = [super.styles];
      }
      return [
        ...GlobalDecorator.globalDecoratedStylesPrepended,
        ...this.__decoratedStylesPrepended,
        ...superStyles,
        ...GlobalDecorator.globalDecoratedStyles,
        ...this.__decoratedStyles,
      ];
    }
  }
  /** @type {CSSResultGroup[]} */
  DecorateMixin.__decoratedStyles = [];
  /** @type {CSSResultGroup[]} */
  DecorateMixin.__decoratedStylesPrepended = [];
  return DecorateMixin;
};
