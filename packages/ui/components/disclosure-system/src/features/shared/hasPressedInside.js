import { deepContains } from '../../utils/deep-contains.js';

/**
 * @typedef {import('@lion/ui/overlays.js').OverlayController} OverlayController
 */

/**
 * @param {KeyboardEvent} event
 * @param {{ controller: OverlayController }} options
 * @returns {boolean}
 */
export function hasPressedInside(event, { controller }) {
  return (
    event.composedPath().includes(/** @type {EventTarget} */ (controller.__wrappingDialogNode)) ||
    (controller.invokerNode && event.composedPath().includes(controller.invokerNode)) ||
    deepContains(controller.contentNode, /** @type {HTMLElement|ShadowRoot} */ (event.target))
  );
}
