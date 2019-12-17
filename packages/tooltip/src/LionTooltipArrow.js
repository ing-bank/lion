import { css, html, LitElement } from '@lion/core';

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
        --tooltip-arrow-width: 12px;
        --tooltip-arrow-height: 8px;
        width: var(--tooltip-arrow-width);
        height: var(--tooltip-arrow-height);
      }

      :host svg {
        display: block;
      }

      :host([placement^='bottom']) {
        top: calc(-1 * var(--tooltip-arrow-height));
        transform: rotate(180deg);
      }

      :host([placement^='left']) {
        right: calc(
          -1 * (var(--tooltip-arrow-height) +
                (var(--tooltip-arrow-width) - var(--tooltip-arrow-height)) / 2)
        );
        transform: rotate(270deg);
      }

      :host([placement^='right']) {
        left: calc(
          -1 * (var(--tooltip-arrow-height) +
                (var(--tooltip-arrow-width) - var(--tooltip-arrow-height)) / 2)
        );
        transform: rotate(90deg);
      }
    `;
  }

  /* IE11 will not render the arrow without this method. */
  render() {
    return html`
      <svg viewBox="0 0 12 8">
        <path d="M 0,0 h 12 L 6,8 z"></path>
      </svg>
    `;
  }
}
