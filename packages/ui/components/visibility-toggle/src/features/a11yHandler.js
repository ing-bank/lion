/**
 * @typedef {import('@lion/ui/types/overlays.js').OverlayConfig} OverlayConfig
 * @typedef {import('@lion/ui/overlays.js').OverlayController} OverlayController
 */

/**
 * @param {{controller: OverlayController; content: HTMLElement}} cfg
 * @returns {string}
 */
function computeRole({ controller, content }) {
  if (controller.config.isAlertDialog) {
    return 'alertdialog';
  }

  if (controller.config.isTooltip) {
    return 'tooltip';
  }

  const hasUserDefinedRole = content.hasAttribute('role');
  if (hasUserDefinedRole) {
    return /** @type {string} */ (content.getAttribute('role'));
  }

  const isOverlay = controller.config.placementMode !== 'none';
  if (isOverlay) {
    return 'dialog';
  }

  return '';
}

/**
 * @param {{ config: OverlayConfig, controller: OverlayController; invoker: HTMLElement; content: HTMLElement; }} visibilityToggleContext
 */
export function a11yHandler({ controller, invoker, content }) {
  const isModal = controller.config.trapsKeyboardFocus;
  const role = computeRole({ controller, content });
  const isExpandable = !isModal && invoker && !['tooltip'].includes(role);

  // TODO: consider aria-details for content that is not a direct sibling...
  // See https://hidde.blog/popover-accessibility/

  const isDirectSibling =
    invoker?.nextElementSibling === content ||
    controller.__wrappingDialogNode?.nextElementSibling === content;

  return {
    init: () => {
      // @ts-expect-error
      content.setAttribute('id', content.id || controller._contentId);

      if (isExpandable) {
        invoker?.setAttribute('aria-expanded', `${controller.isShown}`);
      }

      if (!isDirectSibling) {
        invoker?.setAttribute('aria-details', content.id);
      }

      // TODO: add tests
      // See https://adrianroselli.com/2019/06/link-disclosure-widget-navigation.html
      if (['menu', 'listbox', 'tree', 'grid'].includes(role)) {
        invoker?.setAttribute('aria-haspopup', role);
      }

      switch (role) {
        case 'alertdialog':
          content.setAttribute('role', 'alertdialog');
          break;
        case 'dialog':
          content.setAttribute('role', 'dialog');
          break;
        case 'tooltip':
          content.setAttribute('role', 'tooltip');
          invoker.setAttribute(
            controller.invokerRelation === 'label' ? 'aria-labelledby' : 'aria-describedby',
            content.id,
          );
          break;
      }
    },
    show: () => {
      if (!isExpandable) return;

      invoker?.setAttribute('aria-expanded', 'true');
    },
    hide: () => {
      if (!isExpandable) return;

      invoker?.setAttribute('aria-expanded', 'false');
    },
  };
}
