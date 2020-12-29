import { directive } from '@lion/core';
import { OverlayController, withTooltipConfig } from '@lion/overlays';

/**
 * @typedef {import('lit-html').PropertyPart} PropertyPart
 */

/** @type {WeakSet<Element>} */
const cache = new WeakSet();

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
export const tooltip = directive(title => (/** @type {PropertyPart} */ part) => {
  if (cache.has(part.committer.element)) {
    return;
  }
  cache.add(part.committer.element);
  const invokerNode = part.committer.element;
  const contentNode = document.createElement('div');
  contentNode.textContent = title;
  contentNode.style.cssText = `
    padding: var(--tooltip-padding, 4px);
    border-radius: var(--tooltip-border-radius, 4px);
    background-color: var(--tooltip-background-color, darkgray);
    color: var(--tooltip-color, white);
  `;
  invokerNode.parentNode.insertBefore(contentNode, invokerNode);

  setTimeout(() => {
    new OverlayController({ invokerNode, contentNode, ...withTooltipConfig() });
  });
});
