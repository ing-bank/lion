import { htmlFragment as html, cssSheet as css } from '@lion/ui/core.js';
import { _adoptStyleUtils } from '../utils/adopt-styles.js';

/**
 * @typedef {import('@lion/ui/types/overlays.js').OverlayConfig} OverlayConfig
 * @typedef {import('@lion/ui/overlays.js').OverlayController} OverlayController
 * @typedef {import('@popperjs/core/lib/popper.js').Options} PopperOptions
 */

function defaultArrowNodeTemplate() {
  return html` <div class="arrow" aria-hidden="true" data-popper-arrow>${arrowSvgTemplate()}</div>`;
}

function arrowSvgTemplate() {
  return html`
    <svg viewBox="0 0 12 8" class="arrow__graphic">
      <path d="M 0,0 h 12 L 6,8 z"></path>
    </svg>
  `;
}

const arrowStyle = css`
  :host {
    --arrow-width: 12px;
    --arrow-height: 8px;
  }

  .arrow svg {
    display: block;
  }

  .arrow {
    position: absolute;
    width: var(--arrow-width);
    height: var(--arrow-height);
  }

  .arrow__graphic {
    display: block;
  }

  [data-popper-placement^='top'] .arrow {
    bottom: calc(-1 * var(--arrow-height));
  }

  [data-popper-placement^='bottom'] .arrow {
    top: calc(-1 * var(--arrow-height));
  }

  [data-popper-placement^='bottom'] .arrow__graphic {
    transform: rotate(180deg);
  }

  [data-popper-placement^='left'] .arrow {
    right: calc(-1 * (var(--arrow-height) + (var(--arrow-width) - var(--arrow-height)) / 2));
  }

  [data-popper-placement^='left'] .arrow__graphic {
    transform: rotate(270deg);
  }

  [data-popper-placement^='right'] .arrow {
    left: calc(-1 * (var(--arrow-height) + (var(--arrow-width) - var(--arrow-height)) / 2));
  }

  [data-popper-placement^='right'] .arrow__graphic {
    transform: rotate(90deg);
  }

  :host(:not([has-arrow])) .arrow {
    display: none;
  }
`;

/**
 * @example
 * ```js
 * const ctrl = new DisclosureController({
 *   contentNode: document.querySelector('#myContent'),
 *   arrow: true,
 * });
 * ```
 *
 * @param {{ config: OverlayConfig, controller: OverlayController; invoker: HTMLElement; content: HTMLElement; }} visibilityToggleContext
 */
export function arrowHandler({ controller }) {
  if (controller.placementMode === 'none') return;

  /** @type {ShadowRoot} */
  let rootNode;
  /** @type {HTMLElement} */
  let arrowNode;

  // /** @type {(placement: string) => void} */
  // let repositionCompleteResolver;
  // /** @type {Promise<string|undefined>} */
  // let repositionComplete;

  // /**
  //  * @param {Partial<import('@popperjs/core/lib/popper.js').State>} data
  //  */
  // function syncFromPopperState(data, { arrowNode }) {
  //   if (!data) return;

  //   if (
  //     arrowNode &&
  //     data.placement !== /** @type {Element & {placement:string}} */ (arrowNode)?.placement
  //   ) {
  //     repositionCompleteResolver(data.placement);
  //     setupRepositionCompletePromise();
  //   }
  // }

  // function setupRepositionCompletePromise() {
  //   repositionComplete = new Promise(resolve => {
  //     repositionCompleteResolver = resolve;
  //   });
  // }

  /**
   * @param {PopperOptions} popperConfigToExtendFrom
   * @param {{ arrowNode: HTMLElement }} options
   * @returns
   */
  function enhancePopperConfig(popperConfigToExtendFrom, { arrowNode }) {
    return {
      modifiers: [
        // 8px from the edges of the popper
        { name: 'arrow', enabled: true, options: { padding: 8 } },
        { name: 'offset', enabled: true, options: { offset: [0, 8] } },
        ...((popperConfigToExtendFrom && popperConfigToExtendFrom.modifiers) || []),
      ],
      // /** @param {Partial<import('@popperjs/core/lib/popper.js').State>} data */
      // onFirstUpdate: data => {
      //   syncFromPopperState(data, { arrowNode });
      // },
      // /** @param {Partial<import('@popperjs/core/lib/popper.js').State>} data */
      // afterWrite: data => {
      //   syncFromPopperState(data, { arrowNode });
      // },
    };
  }

  return {
    init: () => {
      rootNode = /** @type {ShadowRoot} */ (controller.contentWrapperNode?.getRootNode());
      _adoptStyleUtils.adoptStyle(rootNode, arrowStyle);
      arrowNode =
        (controller.arrow instanceof Element && controller.arrow) || defaultArrowNodeTemplate();
      controller.contentWrapperNode.appendChild(arrowNode);
      controller.config.popperConfig = enhancePopperConfig(controller.config.popperConfig, {
        arrowNode,
      });
    },
    teardown: () => {
      _adoptStyleUtils.adoptStyle(rootNode, arrowStyle, { teardown: true });
      arrowNode.remove();
    },
  };
}
