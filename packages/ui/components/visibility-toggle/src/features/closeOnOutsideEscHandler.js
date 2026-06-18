/**
 * @typedef {import('@lion/ui/types/overlays.js').OverlayConfig} OverlayConfig
 * @typedef {import('@lion/ui/overlays.js').OverlayController} OverlayController
 */

import { deepContains } from '../utils/deep-contains.js';

/**
 * @param {{ config: OverlayConfig, controller: OverlayController, invoker: HTMLElement, content: HTMLElement }} visibilityToggleContext
 */
export function closeOnOutsideEscHandler({ controller, invoker, content }) {
  /**
   * @param {KeyboardEvent} event
   * @returns {boolean}
   */
  const hasPressedInside = event =>
    event.composedPath().includes(/** @type {EventTarget} */ (controller.__wrappingDialogNode)) ||
    (invoker && event.composedPath().includes(invoker)) ||
    deepContains(content, /** @type {HTMLElement|ShadowRoot} */ (event.target));

  /**
   * @param {KeyboardEvent} event
   * @returns {void}
   */
  const outsideEscKeyHandler = event => {
    if (event.key !== 'Escape' || hasPressedInside(event)) return;
    controller.hide();
  };

  return {
    init: () => {
      document.removeEventListener('keyup', outsideEscKeyHandler);
      document.addEventListener('keyup', outsideEscKeyHandler);
    },
    teardown: () => {
      document.removeEventListener('keyup', outsideEscKeyHandler);
    },
  };
}
