import { isFocusingInputField } from './shared/isFocusingInputField.js';
import { hasPressedInside } from './shared/hasPressedInside.js';

/**
 * @typedef {import('@lion/ui/types/overlays.js').OverlayConfig} OverlayConfig
 * @typedef {import('@lion/ui/overlays.js').OverlayController} OverlayController
 */

/**
 * @param {{ config: OverlayConfig, controller: OverlayController, invoker: HTMLElement, content: HTMLElement }} visibilityToggleContext
 */
export function closeOnOutsideEscHandler({ controller, invoker, content }) {
  /**
   * @param {KeyboardEvent} event
   * @returns {void}
   */
  const outsideEscKeyHandler = event => {
    if (
      event.key !== 'Escape' ||
      isFocusingInputField(event) ||
      hasPressedInside(event, { controller })
    ) {
      return;
    }
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
