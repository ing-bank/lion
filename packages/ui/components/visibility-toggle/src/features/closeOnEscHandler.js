/**
 * @typedef {import('@lion/ui/types/overlays.js').OverlayConfig} OverlayConfig
 * @typedef {import('@lion/ui/overlays.js').OverlayController} OverlayController
 */

import { deepContains } from '../utils/deep-contains.js';

const childDialogsClosedInEventLoopWeakmap = new WeakMap();

/**
 * @param {{ config: OverlayConfig, controller: OverlayController, invoker: HTMLElement, content: HTMLElement }} visibilityToggleContext
 */
export function closeOnEscHandler({ controller, invoker, content }) {
  let escKeyHandlerCalled = false;

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
  function escKeyHandler(event) {
    if (
      event.key !== 'Escape' ||
      childDialogsClosedInEventLoopWeakmap.has(event) ||
      (!controller.isShown && escKeyHandlerCalled)
    ) {
      return;
    }

    if (hasPressedInside(event)) {
      escKeyHandlerCalled = true;
      controller.hide();
      // We could do event.stopPropagation() here, but we don't want to hide info for
      // the outside world about user interactions. Instead, we store the event in a WeakMap
      // that will be garbage collected after the event loop.
      childDialogsClosedInEventLoopWeakmap.set(event, controller);
    }
  }

  return {
    init: () => {
      // we remove previously added (if any) event listener to guarantee
      // there is only one Escape handler added here.
      // Note `init` phase triggered on every `updateConfig` call and that
      // could happen multiple times during the component life cycle
      content.removeEventListener('keyup', escKeyHandler);
      content.addEventListener('keyup', escKeyHandler);
      invoker?.addEventListener('keyup', escKeyHandler);
    },
    show: () => {
      escKeyHandlerCalled = false;
    },
    // N.B. events are automatically cleaned as content is a proxied element handling this in main controller
  };
}
