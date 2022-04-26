import { dedupeMixin, ScopedElementsMixin } from '../../core/index.js.js.js';

/**
 * @typedef {import('../../core').LitElement} LitElement
 * @typedef {import('@open-wc/scoped-elements/types/src/types').ScopedElementsMixin} ScopedElementsMixin1
 * @typedef {import('@open-wc/scoped-elements/types/src/types').ScopedElementsHost} ScopedElementsHost1
 */

/**
 * @type {ScopedElementsHost1 & {createScopedElement: (e:string) => HTMLElement}}
 * @param {import('@open-wc/dedupe-mixin').Constructor<LitElement>} superclass
 */
// @ts-expect-error
const Lit1HybridScopedElementsMixinImplementation = superclass => {
  class Lit1HybridScopedElementsHost extends ScopedElementsMixin(superclass) {
    /**
     * @param {string} elementName 'my-element' or 'my-element-1234' (for optimal compatibility after running codemod)
     * @returns {HTMLElement}
     */
    createScopedElement(elementName) {
      // @ts-expect-error
      const ctor = /** @type {typeof ScopedElementsHost1} */ (this.constructor);
      const tagNames = Object.keys(ctor.scopedElements);
      const tagName = tagNames.includes(elementName)
        ? this.getScopedTagName(elementName)
        : elementName;
      return document.createElement(tagName);
    }
  }
  return Lit1HybridScopedElementsHost;
};

export const Lit1HybridScopedElementsMixin = dedupeMixin(
  // @ts-expect-error
  Lit1HybridScopedElementsMixinImplementation,
);
