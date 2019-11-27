import { LitElement, html, css } from '@lion/core';

export class LionTooltipArrow extends LitElement {
  static get properties() {
    return {
      placement: { type: String, reflect: true },
    };
  }

  static get styles() {
    return css`
      :host {
        position: absolute;
        --tooltip-arrow-width: 8px;
        --tooltip-arrow-height: 6px;
        width: var(--tooltip-arrow-width);
        height: var(--tooltip-arrow-height);
        background: black;
      }

      :host([placement^='top']) {
        bottom: calc(-1 * var(--tooltip-arrow-height));
      }

      :host([placement^='bottom']) {
        top: calc(-1 * var(--tooltip-arrow-height));
        transform: rotate(180deg);
      }

      :host([placement^='left']) {
        right: calc(-1 * var(--tooltip-arrow-height));
        transform: rotate(270deg);
      }

      :host([placement^='right']) {
        left: calc(-1 * var(--tooltip-arrow-height));
        transform: rotate(90deg);
      }
    `;
  }

  /* IE11 will not render the arrow without this method. */
  render() {
    return html``;
  }
}
