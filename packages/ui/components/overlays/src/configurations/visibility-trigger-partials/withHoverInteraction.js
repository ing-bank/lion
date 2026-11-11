/**
 * @typedef {import('@lion/ui/types/overlays.js').OverlayConfig} OverlayConfig
 * @typedef {import('@lion/ui/overlays.js').OverlayController} OverlayController
 */

// N.B. Below logic is tested in LionTooltip

// TODO: this is copied from menu system. Move them to common ancestor entrypoint (maybe a core entrypoint for all interactive controls)
/**
 * @param {HTMLElement|undefined} item
 */
export function isDisabled(item) {
  return item && (item.hasAttribute('disabled') || item.getAttribute('aria-disabled') === 'true');
}

/**
 * Use for tooltips and [flyout menus](https://www.w3.org/WAI/tutorials/menus/flyout/).
 * Note that it handles both mouse hover and focus interaction.
 * Provide delayIn and delayOut when the content needs a small delay before being showed
 * @param {{ isHoverSupported?: boolean, longpressDuration?: number, delayIn?: number, delayOut?: number  }} options
 * @returns {Partial<OverlayConfig>}
 */
export function withHoverInteraction({
  isHoverSupported = window.matchMedia('(hover: hover)').matches,
  longpressDuration = 500,
  delayOut = 300,
  delayIn = 0,
} = {}) {
  return {
    visibilityTriggerFunction: (
      /** @type {{ controller: OverlayController }} */ { controller },
    ) => {
      let isFocused = false;
      let isHovered = false;
      /** @type {NodeJS.Timeout} */
      let pendingDelayTimeout;
      /** @type {NodeJS.Timeout} */
      let pendingLongpressTimeout;
      let longpressCompleted = false;
      // A tap fires pointerdown → pointerup → focusin because the browser moves keyboard focus to
      // the tapped element. We only want focusin to open the tooltip when triggered by keyboard (Tab),
      // not by tap. isLastPointerTouch marks that the preceding pointer event was a touch so the
      // focusin handler can skip it.
      let isLastPointerTouch = false;
      // A tap fires the full mouse compatibility sequence: pointerdown → pointerup → mousedown → mouseup → click.
      // Browsers generate these compatibility events automatically so touch works with mouse-only code.
      // After a longpress the same click fires, which would trigger any click handler on the invoker
      // e.g. opening a dialog alongside the tooltip. We register a capture-phase listener at longpress
      // completion to intercept it, as capture runs before bubble so we stop it regardless of registration order.
      /** @type {((e: Event) => void) | null} */
      let pendingClickSuppressor = null;

      function resetActive() {
        isFocused = false;
        isHovered = false;
        longpressCompleted = false;
        if (pendingClickSuppressor) {
          controller.invokerNode?.removeEventListener('click', pendingClickSuppressor, {
            capture: true,
          });
          pendingClickSuppressor = null;
        }
      }

      /**
       * @param {{ shouldOpen: boolean, openTimeout?: number, closeTimeout?: number }} cfg
       */
      function openClose({ shouldOpen, openTimeout = 0, closeTimeout = 0 }) {
        clearTimeout(pendingDelayTimeout);
        if (shouldOpen && !isDisabled(controller.invokerNode)) {
          pendingDelayTimeout = setTimeout(() => controller.show(), openTimeout);
        } else {
          pendingDelayTimeout = setTimeout(() => controller.hide(), closeTimeout);
        }
      }

      /**
       * @param {Event|PointerEvent} event
       */
      function handleHoverAndFocus(event) {
        const { type } = event;
        isFocused = type === 'focusout' ? false : isFocused || type === 'focusin';
        isHovered = type === 'mouseleave' ? false : isHovered || type === 'mouseenter';
        if (!isHoverSupported && type === 'focusin') {
          if (isLastPointerTouch) {
            isLastPointerTouch = false;
            return;
          }
          if (!controller.invokerNode?.matches(':focus-visible')) return;
        }
        const shouldOpen = isFocused || isHovered;
        openClose({ shouldOpen, openTimeout: delayIn, closeTimeout: delayOut });
      }

      /** @param {Event} e */
      function preventContextMenu(e) {
        e.preventDefault();
      }

      /** @param {PointerEvent} event */
      function handleLongpress(event) {
        clearTimeout(pendingLongpressTimeout);
        if (event.pointerType !== 'touch') return;
        const { type } = event;

        if (type === 'pointerdown') {
          longpressCompleted = false;
          isLastPointerTouch = true;
          pendingLongpressTimeout = setTimeout(() => {
            longpressCompleted = true;
            // Intercept the compatibility click the browser generates at the end of the touch sequence.
            // Capture phase ensures we run before any bubble-phase handler (e.g. a dialog opener).
            pendingClickSuppressor = e => e.stopImmediatePropagation();
            controller.invokerNode?.addEventListener('click', pendingClickSuppressor, {
              once: true, // auto-removes after first click
              capture: true,
            });
            openClose({ shouldOpen: true });
          }, longpressDuration);
        } else {
          openClose({
            shouldOpen: false,
            closeTimeout: longpressCompleted ? longpressDuration : 0,
          });
        }
      }

      return {
        init: () => {
          controller.addEventListener('hide', resetActive);

          controller.invokerNode?.addEventListener('focusin', handleHoverAndFocus);
          controller.invokerNode?.addEventListener('focusout', handleHoverAndFocus);

          if (isHoverSupported) {
            controller.contentNode?.addEventListener('mouseenter', handleHoverAndFocus);
            controller.contentNode?.addEventListener('mouseleave', handleHoverAndFocus);
            controller.invokerNode?.addEventListener('mouseenter', handleHoverAndFocus);
            controller.invokerNode?.addEventListener('mouseleave', handleHoverAndFocus);
          } else {
            controller.invokerNode?.style.setProperty('-webkit-touch-callout', 'none');
            controller.invokerNode?.style.setProperty('user-select', 'none');
            controller.invokerNode?.style.setProperty('-webkit-user-select', 'none');
            controller.invokerNode?.addEventListener('contextmenu', preventContextMenu);
            controller.invokerNode?.addEventListener('pointerdown', handleLongpress);
            controller.invokerNode?.addEventListener('pointerup', handleLongpress);
            controller.invokerNode?.addEventListener('pointerleave', handleLongpress);
          }
        },
        teardown: () => {
          controller.removeEventListener('hide', resetActive);

          controller.invokerNode?.removeEventListener('focusin', handleHoverAndFocus);
          controller.invokerNode?.removeEventListener('focusout', handleHoverAndFocus);

          if (isHoverSupported) {
            controller.contentNode?.removeEventListener('mouseenter', handleHoverAndFocus);
            controller.contentNode?.removeEventListener('mouseleave', handleHoverAndFocus);
            controller.invokerNode?.removeEventListener('mouseenter', handleHoverAndFocus);
            controller.invokerNode?.removeEventListener('mouseleave', handleHoverAndFocus);
          } else {
            controller.invokerNode?.style.removeProperty('-webkit-touch-callout');
            controller.invokerNode?.style.removeProperty('user-select');
            controller.invokerNode?.style.removeProperty('-webkit-user-select');
            controller.invokerNode?.removeEventListener('contextmenu', preventContextMenu);
            controller.invokerNode?.removeEventListener('pointerdown', handleLongpress);
            controller.invokerNode?.removeEventListener('pointerup', handleLongpress);
            controller.invokerNode?.removeEventListener('pointerleave', handleLongpress);
            if (pendingClickSuppressor) {
              controller.invokerNode?.removeEventListener('click', pendingClickSuppressor, {
                capture: true,
              });
              pendingClickSuppressor = null;
            }
          }
        },
      };
    },
  };
}
