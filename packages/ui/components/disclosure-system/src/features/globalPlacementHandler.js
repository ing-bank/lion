import { cssSheet as css } from '@lion/ui/core.js';
import { _adoptStyleUtils } from '../utils/adopt-styles.js';
import { initContentDomStructure } from './shared/initContentDomStructure.js';

export const overlayViewportStyle = css`
  .overlays {
    position: fixed;
    z-index: 200;
  }

  .overlays__overlay-container {
    display: flex;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
  }

  .overlays__overlay-container--top-left {
    justify-content: flex-start;
    align-items: flex-start;
  }

  .overlays__overlay-container--top {
    justify-content: center;
    align-items: flex-start;
  }

  .overlays__overlay-container--top-right {
    justify-content: flex-end;
    align-items: flex-start;
  }

  .overlays__overlay-container--right {
    justify-content: flex-end;
    align-items: center;
  }

  .overlays__overlay-container--bottom-left {
    justify-content: flex-start;
    align-items: flex-end;
  }

  .overlays__overlay-container--bottom {
    justify-content: center;
    align-items: flex-end;
  }

  .overlays__overlay-container--bottom-right {
    justify-content: flex-end;
    align-items: flex-end;
  }

  .overlays__overlay-container--left {
    justify-content: flex-start;
    align-items: center;
  }

  .overlays__overlay-container--center {
    justify-content: center;
    align-items: center;
  }

  .overlays__overlay--bottom-sheet {
    width: 100%;
  }

  ::slotted(.overlays__overlay),
  .overlays__overlay {
    pointer-events: auto;
  }

  .overlays__overlay-container::backdrop {
    display: none;
  }

  .overlays__backdrop {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    background-color: #333333;
    display: none;
  }

  .overlays__backdrop--visible {
    display: block;
  }

  .overlays__backdrop--animation-in {
    animation: overlays-backdrop-fade-in 300ms;
    opacity: 0.3;
  }

  .overlays__backdrop--animation-out {
    animation: overlays-backdrop-fade-out 300ms;
    opacity: 0;
  }

  @keyframes overlays-backdrop-fade-in {
    from {
      opacity: 0;
    }
  }

  @keyframes overlays-backdrop-fade-out {
    from {
      opacity: 0.3;
    }
  }

  @media screen and (prefers-reduced-motion: reduce) {
    .overlays__backdrop--animation-in {
      animation: overlays-backdrop-fade-in 1ms;
    }

    .overlays__backdrop--animation-out {
      animation: overlays-backdrop-fade-out 1ms;
    }
  }
`;

/**
 * @typedef {import('@lion/ui/types/overlays.js').OverlayPhase} OverlayPhase
 * @typedef {import('@lion/ui/overlays.js').OverlayConfig} OverlayConfig
 * @typedef {import('@lion/ui/overlays.js').OverlayController} OverlayController
 * @typedef {import('@popperjs/core').Options} PopperOptions
 * @typedef {import('@popperjs/core').Placement} Placement
 * @typedef {import('@popperjs/core').createPopper} Popper
 * @typedef {{ createPopper: Popper }} PopperModule
 */

/**
 * @param {{ config: OverlayConfig, controller: OverlayController }} visibilityToggleContext
 */
export function globalPlacementHandler({ controller }) {
  const placementClass = `overlays__overlay-container--${controller.viewportConfig.placement}`;

  /** @type {() => void} */
  let cleanupContentDomStructure;

  /** @type {ShadowRoot} */
  let rootNode;

  return {
    init: () => {
      cleanupContentDomStructure = initContentDomStructure({ controller });
      rootNode = /** @type {ShadowRoot} */ (controller.contentWrapperNode?.getRootNode());
      _adoptStyleUtils.adoptStyle(rootNode, overlayViewportStyle);
    },
    show: async () => {
      // TODO: move to init?
      // TODO2: use data attributes for functional styling
      controller.contentWrapperNode.classList.add('overlays__overlay-container');
      controller.contentWrapperNode.classList.add(placementClass);
      controller.contentNode.classList.add('overlays__overlay');
    },
    hide: () => {
      controller.contentWrapperNode.classList.remove('overlays__overlay-container');
      controller.contentWrapperNode.classList.remove(placementClass);
      controller.contentNode.classList.remove('overlays__overlay');
    },
    teardown: () => {
      _adoptStyleUtils.adoptStyle(rootNode, overlayViewportStyle, { teardown: true });

      const shouldWeCleanupCustomStyles = controller.contentWrapperNode !== controller.contentNode;
      if (!shouldWeCleanupCustomStyles) return;

      cleanupContentDomStructure?.();
    },
  };
}
