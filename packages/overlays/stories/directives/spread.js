import { directive } from '@lion/core';

const elementCache = new WeakMap();
const objCache = new WeakMap();

/**
 * @desc Allows to spread an object of properties onto a DOM element.
 *
 * @example
 * ```js
 * const obj = {
 *   propA: true,
 *   propB: 10,
 *   propC: 'text',
 * };
 * ```
 * ```html
 * <my-element ...=${spread(obj)}></my-element>
 *```
 *
 * @param {object} obj the object that will be merged with the target element
 */
export const spread = directive(obj => part => {
  const { element } = part.committer;
  if (elementCache.has(element) && objCache.has(obj)) {
    return;
  }
  elementCache.set(element);
  objCache.set(obj);
  Object.assign(element, obj);
});
