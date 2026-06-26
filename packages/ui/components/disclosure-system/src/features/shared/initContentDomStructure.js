import { css } from 'lit';
import { _adoptStyleUtils } from '../../utils/adopt-styles.js';

/**
 * @typedef {import('@lion/ui/overlays.js').OverlayController} OverlayController
 */

export const dialogWrapperStyle = css`
  dialog[data-overlay-outer-wrapper] {
    background-image: none;
    border-style: none;
    padding: 0px;
  }

  /**
   * We don't want to use pseudo el ::backdrop.
   * We have our own, that creates more flexibility wrt scrolling etc.
   */
  dialog[data-overlay-outer-wrapper]::backdrop {
    display: none;
  }
`;

/**
 * From:
 * - wrappingDialogNodeL1: `<dialog role="none"/>`
 * - contentWrapperNodeL2: `<div id="content-wrapper-node"/>`
 * - contentNodeL3: `<div slot="my-content"/>`
 * To:
 * ```html
 * <dialog role="none">
 *   <div id="content-wrapper-node">
 *     <!-- this was the (slot for) original content node -->
 *     <slot name="my-content"></slot>
 *   </div>
 * </dialog>
 * ```
 *
 * `<slot name="my-content">` belonging to `<div slot="content"/>` will be wrapped with wrappingDialogNodeL1 and contentWrapperNodeL2
 * inside shadow dom. With the help of temp markers, `<slot name="my-content">`'s original position will be respected.
 *
 * @param {{
 *  wrappingDialogNodeL1: HTMLDialogElement|HTMLDivElement;
 *  contentWrapperNodeL2:Element;
 *  contentNodeL3: Element;
 * }} opts
 */
function rearrangeNodes({ wrappingDialogNodeL1, contentWrapperNodeL2, contentNodeL3 }) {
  // if contentWrapperNode is provided by the user,
  // we assume it lives in shadow dom around a slot.
  const hasLegacyMethodOfProvidingWrapperNode = Boolean(contentWrapperNodeL2.isConnected);
  // We could be initialized via a directive (in offline dom). It's important that we know about the parents,
  // as we cannot deal with single content nodes
  const hasContentNodeAttachmentPoints = Boolean(contentNodeL3.parentNode);

  if (!hasLegacyMethodOfProvidingWrapperNode && !hasContentNodeAttachmentPoints) {
    throw new Error(
      '[OverlayController] Could not find a render target, makes sure contentNode has a parent element (or contentWrapperNode is connected)',
    );
  }

  /** @type {Node} */
  let parentElement;
  const tempMarker = document.createComment('overlay-insertion-marker');

  if (hasLegacyMethodOfProvidingWrapperNode) {
    // This is the case when contentWrapperNode (living in shadow dom, wrapping <slot name="my-content-outlet">) is already provided via controller.
    parentElement = contentWrapperNodeL2.parentElement || contentWrapperNodeL2.getRootNode();
    parentElement.insertBefore(tempMarker, contentWrapperNodeL2);
    // Wrap...
    wrappingDialogNodeL1.appendChild(contentWrapperNodeL2);
  } else {
    const contentIsProjected = !!contentNodeL3.assignedSlot;
    if (contentIsProjected) {
      parentElement =
        contentNodeL3.assignedSlot.parentElement || contentNodeL3.assignedSlot.getRootNode();
      parentElement.insertBefore(tempMarker, contentNodeL3.assignedSlot);
      wrappingDialogNodeL1.appendChild(contentWrapperNodeL2);
      // Important: we do not move around contentNodeL3, but the assigned slot
      contentWrapperNodeL2.appendChild(contentNodeL3.assignedSlot);
    } else {
      parentElement = contentNodeL3.parentElement || contentNodeL3.getRootNode();
      parentElement.insertBefore(tempMarker, contentNodeL3);
      wrappingDialogNodeL1.appendChild(contentWrapperNodeL2);
      contentWrapperNodeL2.appendChild(contentNodeL3);
    }
  }

  /**
   * From:
   * ```html
   * #shadow-root:
   * <div>
   *   <!-- tempMarker -->
   *   <slot name="x"/>
   * </div>
   * ```
   *
   * To:
   * ```html
   * #shadow-root:
   * <div>
   *   <!-- tempMarker -->
   *   <dialog role="none">
   *     <div id="content-wrapper-node">
   *       <slot name="x"/>
   *     </div>
   *   </dialog>
   * </div>
   * ```
   */
  parentElement.insertBefore(wrappingDialogNodeL1, tempMarker);

  return function cleanup() {
    if (hasLegacyMethodOfProvidingWrapperNode) {
      parentElement?.insertBefore(contentWrapperNodeL2, tempMarker);
    } else {
      parentElement?.insertBefore(contentNodeL3, tempMarker);
      if (parentElement.contains(contentWrapperNodeL2)) {
        contentWrapperNodeL2.remove();
      }
    }
    parentElement?.removeChild(tempMarker);

    if (parentElement.contains(wrappingDialogNodeL1)) {
      parentElement?.removeChild(wrappingDialogNodeL1);
    }
  };
}

/**
 * Here we arrange our content node via:
 * 1. HTMLDialogElement: the content will always be painted to the browser's top layer
 *   - no matter what context the contentNode lives in, the overlay will be painted correctly via the <dialog> element,
 *     even if 'overflow:hidden' or a css transform is applied in its parent hierarchy.
 *   - the dialog element will be unstyled, but will span the whole screen
 *   - a backdrop element will be a child of the dialog element, so it leverages the capabilities of the parent
 *     (filling the whole screen if wanted an always painted to top layer)
 * 2. ContentWrapper: the content receives the right positioning styles in a clean/non conflicting way:
 *  - local positioning: receive inline (position) styling that can never conflict with the already existing computed styles
 *  - global positioning: receive flex (child) classes that position the content correctly relative to the viewport
 *
 * The resulting structure that will be created looks like this:
 *
 * ...
 * <dialog role="none">
 *   <div id="optional-backdrop"></div>
 *   <div id="content-wrapper-node">
 *     <!-- this was the (slot for) original content node -->
 *     <slot name="content"></slot>
 *   </div>
 * </dialog>
 * ...
 *
 * @private
 *
 * @param {{controller: OverlayController;}} cfg
 * @returns {() => void}
 */
export function initContentDomStructure({ controller }) {
  let cleanup = () => {};

  const wrappingDialogElement = document.createElement('dialog');
  // We use a dialog for its visual capabilities: it renders to the top layer.
  // A11y will depend on the type of overlay and is arranged on contentNode level.
  // Also see: https://www.scottohara.me/blog/2019/03/05/open-dialog.html
  //
  // The role="dialog" is set on the contentNode (or another role), so role="none"
  // is valid here, although AXE complains about this setup.
  // For now we need to add `ignoredRules: ['aria-allowed-role']` in your AXE tests.
  // see: https://lion.js.org/fundamentals/systems/overlays/rationale/#considerations
  wrappingDialogElement.setAttribute('role', 'none');
  wrappingDialogElement.setAttribute('data-overlay-outer-wrapper', '');
  // N.B. position: fixed is needed to escape out of 'overflow: hidden'
  // We give a high z-index for non-modal dialogs, so that we at least win from all siblings of our
  // parent stacking context
  // padding reset so we don't get a weird dialog visual square showing up
  wrappingDialogElement.style.cssText = `display:none; z-index: ${controller.config.zIndex}; padding: 0;`;
  if (controller.config.placementMode === 'none') {
    // The user should have full freedom to control the content node, so its wrapper nodes should remain neutral.
    wrappingDialogElement.style.cssText += 'position: static;';
  }
  controller.__wrappingDialogNode = wrappingDialogElement;

  /**
   * Based on the configuration of the developer, multiple scenarios are accounted for
   * A. We already have a contentWrapperNode ()
   */
  if (!controller.config?.contentWrapperNode) {
    controller.__contentWrapperNode = document.createElement('div');
  }
  controller.contentWrapperNode.setAttribute('data-id', 'content-wrapper');
  // 'hack' that makes sure popperjs (that is applied one level lower) works correctly in deeply nested shadow roots
  controller.contentWrapperNode.style.transform = 'translateZ(0px)';

  cleanup = rearrangeNodes({
    wrappingDialogNodeL1: wrappingDialogElement,
    contentWrapperNodeL2: controller.contentWrapperNode,
    contentNodeL3: controller.contentNode,
  });
  wrappingDialogElement.open = true;

  if (controller.isTooltip) {
    // needed to prevent tooltip getting focus in Safari and Firefox
    wrappingDialogElement.setAttribute('tabindex', '-1');
  }
  controller.contentWrapperNode.style.zIndex = '1';
  if (getComputedStyle(controller.contentNode).position === 'absolute') {
    // Having a _contWrapperNode and a contentNode with 'position:absolute' results in
    // computed height of 0...
    controller.contentNode.style.position = 'static';
  }

  // Here we prevent any interference of the native <dialog> element with the keyboard behavior
  // as defined by the OverlayController. This is needed until we can configure `closedby="none"`
  // on the native dialog for all browsers: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog#closedby
  const hasClosedBySupport = HTMLDialogElement && 'closedBy' in HTMLDialogElement.prototype;
  if (hasClosedBySupport) {
    wrappingDialogElement.closedBy = 'none';
  } else {
    wrappingDialogElement.addEventListener('keydown', (/** @type {* & KeyboardEvent} */ event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
      }
    });
    wrappingDialogElement.addEventListener('keyup', (/** @type {* & KeyboardEvent} */ event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
      }
    });
    wrappingDialogElement.addEventListener('cancel', event => {
      event.stopPropagation();
    });
    wrappingDialogElement.addEventListener('close', event => {
      event.stopPropagation();
    });
  }

  const rootNode = /** @type {ShadowRoot} */ (controller.contentWrapperNode?.getRootNode());
  _adoptStyleUtils.adoptStyle(rootNode, dialogWrapperStyle, { teardown: false });

  return () => {
    cleanup();
    controller.contentWrapperNode.removeAttribute('style');
    controller.contentWrapperNode.removeAttribute('class');
    _adoptStyleUtils.adoptStyle(rootNode, dialogWrapperStyle, { teardown: true });
  };
}
