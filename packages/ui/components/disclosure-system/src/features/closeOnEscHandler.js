import { isFocusingInputField } from './shared/isFocusingInputField.js';
import { hasPressedInside } from './shared/hasPressedInside.js';

/**
 * @typedef {import('@lion/ui/types/overlays.js').OverlayConfig} OverlayConfig
 * @typedef {import('@lion/ui/overlays.js').OverlayController} OverlayController
 */

const childDialogsClosedInEventLoopWeakmap = new WeakMap();

/**
 * @param {{ config: OverlayConfig, controller: OverlayController, invoker: HTMLElement, content: HTMLElement }} visibilityToggleContext
 */
export function closeOnEscHandler({ controller, invoker, content }) {
  let isEscKeyHandlerCalled = false;

  /**
   * @param {KeyboardEvent} event
   * @returns {void}
   */
  function escKeyHandler(event) {
    if (
      event.key !== 'Escape' ||
      isFocusingInputField(event) ||
      childDialogsClosedInEventLoopWeakmap.has(event) ||
      (!controller.opened && isEscKeyHandlerCalled)
    ) {
      return;
    }

    if (hasPressedInside(event, { controller })) {
      isEscKeyHandlerCalled = true;
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
      // content.removeEventListener('keyup', escKeyHandler);
      content.addEventListener('keyup', escKeyHandler);
      invoker?.addEventListener('keyup', escKeyHandler);
    },
    show: () => {
      isEscKeyHandlerCalled = false;
    },
    // N.B. events are automatically cleaned as content is a proxied element handling this in main controller
  };
}
