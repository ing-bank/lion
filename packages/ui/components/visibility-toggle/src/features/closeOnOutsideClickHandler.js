/**
 * @typedef {import('@lion/ui/types/overlays.js').OverlayConfig} OverlayConfig
 * @typedef {import('@lion/ui/overlays.js').OverlayController} OverlayController
 */

/**
 * @param {{ config: OverlayConfig, controller: OverlayController, invoker: HTMLElement }} visibilityToggleContext
 */
export function closeOnOutsideClickHandler({ controller, invoker }) {
  /**
   * We listen to click (more specifically mouseup and mousedown) events
   * in their capture phase (see our tests about 3rd parties stopping event propagation).
   * We define an outside click as follows:
   * - both mousedown and mouseup occur outside of content or invoker
   *
   * This means we have the following flow:
   * [1]. (optional) mousedown is triggered on content/invoker
   * [2]. mouseup is triggered on document (logic will be scheduled to step 4)
   * [3]. (optional) mouseup is triggered on content/invoker
   * [4]. mouseup logic is executed on document (its logic is inside a timeout and is thus
   * executed after 3)
   * [5]. Reset all helper variables that were considered in step [4]
   *
   */

  /** @type {boolean} */
  let wasMouseDownInside = false;
  /** @type {boolean} */
  let wasMouseUpInside = false;

  /** @type {EventListenerOrEventListenerObject} */
  const onInsideMouseDown = () => {
    // [1]. was mousedown inside content or invoker
    wasMouseDownInside = true;
  };

  const onInsideMouseUp = () => {
    // [3]. was mouseup inside content or invoker
    wasMouseUpInside = true;
  };

  /** @type {EventListenerOrEventListenerObject} */
  const onDocumentMouseUp = () => {
    // [2]. The captured mouseup goes from top of the document to bottom. We add a timeout,
    // so that [3] can be executed before [4]
    setTimeout(() => {
      // [4]. Keep open if step 1 (mousedown) or 3 (mouseup) was inside
      if (!wasMouseDownInside && !wasMouseUpInside) {
        controller.hide();
      }
      // [5]. Reset...
      wasMouseDownInside = false;
      wasMouseUpInside = false;
    });
  };

  /** @type {EventListenerOrEventListenerObject} */
  const onWindowBlur = () => {
    // When the current window loses the focus (clicking outside iframe) the overlay gets hidden
    setTimeout(() => {
      controller.hide();
    });
  };

  return {
    // N.B. we changed show/hide to init/teardown
    init: () => {
      controller.contentWrapperNode.addEventListener('mousedown', onInsideMouseDown, true);
      controller.contentWrapperNode.addEventListener('mouseup', onInsideMouseUp, true);
      // An invoker click (usually resulting in toggle) should be left to a different part of
      // the code
      invoker?.addEventListener('mousedown', onInsideMouseDown, true);
      invoker?.addEventListener('mouseup', onInsideMouseUp, true);
      document.documentElement.addEventListener('mouseup', onDocumentMouseUp, true);
      window.addEventListener('blur', onWindowBlur);
    },
    teardown: () => {
      controller.contentWrapperNode.removeEventListener('mousedown', onInsideMouseDown, true);
      controller.contentWrapperNode.removeEventListener('mouseup', onInsideMouseUp, true);
      // invoker?.removeEventListener('mousedown', onInsideMouseDown, true);
      // invoker?.removeEventListener('mouseup', onInsideMouseUp, true);
      document.documentElement.removeEventListener('mouseup', onDocumentMouseUp, true);
      window.removeEventListener('blur', onWindowBlur);
    },
  };
}
