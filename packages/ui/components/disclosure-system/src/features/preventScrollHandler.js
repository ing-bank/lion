import { cssSheet as css } from '@lion/ui/core.js';
import { _adoptStyleUtils } from '../utils/adopt-styles.js';

export const overlayDocumentStyle = css`
  body.overlays-scroll-lock {
    overflow: hidden;
  }

  body.overlays-scroll-lock-ios-fix {
    position: fixed;
    width: 100%;
  }

  html.overlays-scroll-lock-ios-fix {
    height: 100vh;
  }
`;

/**
 * @typedef {import('@lion/ui/types/overlays.js').OverlayConfig} OverlayConfig
 * @typedef {import('@lion/ui/overlays.js').OverlayController} OverlayController
 * @typedef {import('@lion/ui/overlays.js').OverlaysManager} OverlaysManager
 */

/**
 *
 * @param {{ config: OverlayConfig, controller: OverlayController, manager: OverlaysManager }} visibilityToggleContext
 */
export function preventScrollHandler({ controller, manager }) {
  if (!manager) {
    throw new Error(
      '[OverlayController] .preventsScroll is only supported when a manager is provided to the controller',
    );
  }

  /** @type {ShadowRoot} */
  let rootNode;

  return {
    init: () => {
      rootNode = /** @type {ShadowRoot} */ (controller.contentWrapperNode?.getRootNode());
      _adoptStyleUtils.adoptStyle(rootNode, overlayDocumentStyle);
    },
    'before-show': () => {
      manager.requestToKeepBodySize({ phase: 'before-show' });
    },
    show: () => {
      manager.requestToPreventScroll();
      manager.requestToKeepBodySize({ phase: 'show' });
    },
    hide: () => {
      manager.requestToEnableScroll();
      manager.requestToKeepBodySize({ phase: 'hide' });
    },
    teardown: () => {
      _adoptStyleUtils.adoptStyle(rootNode, overlayDocumentStyle, { teardown: true });

      manager.requestToEnableScroll(controller);
      if (controller.opened) {
        manager.requestToKeepBodySize({ phase: 'teardown' });
      }
    },
  };
}
