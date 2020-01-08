import { directive } from '@lion/core';

const cache = new WeakMap();

/**
 * @desc Allows to have references to different parts of your lit template.
 * Without it, seperate renders to different nodes would have been needed, leading to more verbose,
 * less readable and less performant code.
 * Inspired by Angular template refeference variables:
 * https://angular.io/guide/template-syntax#ref-vars
 *
 * @example
 * ```js
 * const refObj = {};
 * ```
 * ```html
 * <my-element #myElement=${ref(refObj)}>
 *   <button @click=${() => refObj.myElement.publicMethod()}>click</button>
 * </my-element>
 *```
 *
 * @param {object} refObj will be used to store reference to attribute names like #myElement
 */
export const ref = directive(refObj => part => {
  if (cache.has(part.committer.element)) {
    return;
  }
  cache.set(part.committer.element);
  const attrName = part.committer.name;
  const key = attrName.replace(/^#/, '');
  // eslint-disable-next-line no-param-reassign
  refObj[key] = part.committer.element;
});
