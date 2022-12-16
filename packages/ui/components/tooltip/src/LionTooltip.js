import { css, LitElement } from 'lit';
import { ArrowMixin, OverlayMixin, withTooltipConfig } from '@lion/ui/overlays.js';

/**
 * @typedef {import('@lion/ui/types/overlays.js').OverlayConfig} OverlayConfig
 * @typedef {import('lit').CSSResult} CSSResult
 * @typedef {import('lit').CSSResultArray} CSSResultArray
 */

/**
 * @customElement lion-tooltip
 */
export class LionTooltip extends ArrowMixin(OverlayMixin(LitElement)) {
  /** @type {any} */
  static get properties() {
    return {
      invokerRelation: {
        type: String,
        attribute: 'invoker-relation',
      },
    };
  }

  static get styles() {
    return [
      ...super.styles,
      css`
        :host {
          display: inline-block;
        }

        :host([hidden]) {
          display: none;
        }

        ::slotted([slot='content']) {
          width: max-content;
        }
      `,
    ];
  }

  constructor() {
    super();
    /**
     * Whether an arrow should be displayed
     * @type {boolean}
     */
    this.hasArrow = false;
    /**
     * Decides whether the tooltip invoker text should be considered a description
     * (sets aria-describedby) or a label (sets aria-labelledby).
     * @type {'label'|'description'}
     */
    this.invokerRelation = 'description';
  }

  /** @protected */
  // eslint-disable-next-line class-methods-use-this
  _defineOverlayConfig() {
    const superCfg = super._defineOverlayConfig();
    const tooltipCfg = withTooltipConfig({ invokerRelation: this.invokerRelation });
    return /** @type {OverlayConfig} */ ({
      ...superCfg,
      ...tooltipCfg,
      popperConfig: {
        ...(superCfg.popperConfig || {}),
        ...(tooltipCfg.popperConfig || {}),
        modifiers: [
          ...(superCfg.popperConfig?.modifiers || []),
          ...(tooltipCfg.popperConfig?.modifiers || []),
        ],
      },
    });
  }
}
