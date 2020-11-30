import { css, html, dedupeMixin } from '@lion/core';
import { OverlayMixin } from './OverlayMixin.js';

/**
 * @typedef {import('../types/OverlayConfig').OverlayConfig} OverlayConfig
 * @typedef {import('../types/ArrowMixinTypes').ArrowMixin} ArrowMixin
 * @typedef {import('@popperjs/core/lib/popper').Options} PopperOptions
 * @typedef {import('@popperjs/core/lib/enums').Placement} Placement
 */

/**
 * @type {ArrowMixin}
 * @param {import('@open-wc/dedupe-mixin').Constructor<import('@lion/core').LitElement>} superclass
 */
export const ArrowMixinImplementation = superclass =>
  class ArrowMixin extends OverlayMixin(superclass) {
    static get properties() {
      return {
        hasArrow: {
          type: Boolean,
          reflect: true,
          attribute: 'has-arrow',
        },
      };
    }

    static get styles() {
      const superCtor = /** @type {typeof import('@lion/core').LitElement} */ (super.constructor);
      return [
        superCtor.styles ? superCtor.styles : [],
        css`
          .arrow svg {
            display: block;
          }

          .arrow {
            position: absolute;
            --tooltip-arrow-width: 12px;
            --tooltip-arrow-height: 8px;
            width: var(--tooltip-arrow-width);
            height: var(--tooltip-arrow-height);
          }

          .arrow__graphic {
            display: block;
          }

          [data-popper-placement^='bottom'] .arrow {
            top: calc(-1 * var(--tooltip-arrow-height));
          }

          [data-popper-placement^='bottom'] .arrow__graphic {
            transform: rotate(180deg);
          }

          [data-popper-placement^='left'] .arrow {
            right: calc(
              -1 * (var(--tooltip-arrow-height) +
                    (var(--tooltip-arrow-width) - var(--tooltip-arrow-height)) / 2)
            );
          }

          [data-popper-placement^='left'] .arrow__graphic {
            transform: rotate(270deg);
          }

          [data-popper-placement^='right'] .arrow {
            left: calc(
              -1 * (var(--tooltip-arrow-height) +
                    (var(--tooltip-arrow-width) - var(--tooltip-arrow-height)) / 2)
            );
          }

          [data-popper-placement^='right'] .arrow__graphic {
            transform: rotate(90deg);
          }
        `,
      ];
    }

    constructor() {
      super();
      this.hasArrow = true;
      this.__setupRepositionCompletePromise();
    }

    render() {
      return html`
        <slot name="invoker"></slot>
        <div id="overlay-content-node-wrapper">
          <slot name="content"></slot>
          ${this._arrowNodeTemplate()}
        </div>
      `;
    }

    _arrowNodeTemplate() {
      return html` <div class="arrow" data-popper-arrow>${this._arrowTemplate()}</div> `;
    }

    // eslint-disable-next-line class-methods-use-this
    _arrowTemplate() {
      return html`
        <svg viewBox="0 0 12 8" class="arrow__graphic">
          <path d="M 0,0 h 12 L 6,8 z"></path>
        </svg>
      `;
    }

    /**
     * @overridable method `_defineOverlay`
     * @desc Overrides arrow and keepTogether modifier to be enabled,
     * and adds onCreate and onUpdate hooks to sync from popper state
     * @returns {OverlayConfig}
     */
    // eslint-disable-next-line
    _defineOverlayConfig() {
      const superConfig = super._defineOverlayConfig() || {};
      if (!this.hasArrow) {
        return superConfig;
      }
      return {
        ...superConfig,
        popperConfig: {
          ...this._getPopperArrowConfig(superConfig.popperConfig),
        },
      };
    }

    /**
     * @param {PopperOptions} popperConfigToExtendFrom
     * @returns {PopperOptions}
     */
    _getPopperArrowConfig(popperConfigToExtendFrom = {}) {
      /** @type {PopperOptions & { afterWrite: (arg0: Partial<import('@popperjs/core/lib/popper').State>) => void }} */
      const popperCfg = {
        ...popperConfigToExtendFrom,
        placement: /** @type {Placement} */ ('top'),
        /** @param {Partial<import('@popperjs/core/lib/popper').State>} data */
        onFirstUpdate: data => {
          this.__syncFromPopperState(data);
        },
        /** @param {Partial<import('@popperjs/core/lib/popper').State>} data */
        afterWrite: data => {
          this.__syncFromPopperState(data);
        },
      };

      // TODO: Fix modifiers merging logic, right now we don't merge existing modifiers
      popperCfg.modifiers = [
        ...(popperCfg.modifiers || []),
        { name: 'arrow', enabled: true },
        { name: 'offset', enabled: true, options: { offset: [0, 8] } },
      ];
      return popperCfg;
    }

    __setupRepositionCompletePromise() {
      this.repositionComplete = new Promise(resolve => {
        this.__repositionCompleteResolver = resolve;
      });
    }

    get _arrowNode() {
      return /** @type {ShadowRoot} */ (this.shadowRoot).querySelector('[data-popper-arrow]');
    }

    /**
     * @param {Partial<import('@popperjs/core/lib/popper').State>} data
     */
    __syncFromPopperState(data) {
      if (!data) {
        return;
      }
      if (
        this._arrowNode &&
        data.placement !== /** @type {Element & {placement:string}} */ (this._arrowNode).placement
      ) {
        /** @type {function} */ (this.__repositionCompleteResolver)(data.placement);
        this.__setupRepositionCompletePromise();
      }
    }
  };

export const ArrowMixin = dedupeMixin(ArrowMixinImplementation);
