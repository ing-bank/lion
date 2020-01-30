import { LitElement, html, css } from '@lion/core';

/**
 * # <ing-tab> webcomponent
 *
 * @customElement ing-tab
 * @extends LitElement
 */
export class MdTab extends LitElement {
  static get styles() {
    return [
      css`
        :host {
          color: #6200ee;
          white-space: nowrap;
          display: block;
          position: relative;
          white-space: nowrap;
          margin-bottom: -2px;
          cursor: pointer;
          font-size: .875rem;
          line-height: 2.25rem;
          font-weight: 500;
          letter-spacing: .0892857143em;
          text-decoration: none;
          text-transform: uppercase;
        }

        :host .tab__content {
          padding-right: 24px;
          padding-left: 24px;
        }

        :host([selected]) {
          border-bottom: 2px solid #6200ee;
        }

        :host([selected]) .tab__content {
          font-weight: normal;
        }

        :host(:focus) {
          outline: none;
          border-top: none;
          border-right: none;
          padding-right: 1px;
          z-index: 1;
        }

        :host(:focus:first-of-type) {
          border-left: none;
          padding-left: 1px;
        }

        :host(:focus) {
          border-top-right-radius: 4px;
          border-top-left-radius: 4px;
          margin-bottom: 0;
        }

        :host(:focus) .tab__content {
          padding-bottom: 7px;
        }

        :host(:hover)::before {
          position: absolute;
          pointer-events: none;
          content: '';
          opacity: .04;
          background-color: #6200ee;
          width: 100%;
          height: 100%;
        }

        :host(:hover:not([selected])) {
          margin-bottom: 0;
        }

        :host(:hover:not([selected])) .tab__content {
          padding-bottom: 8px;
        }
      `,
    ];
  }

  get tabContentWidth() {
    return this.shadowRoot.children[0].getBoundingClientRect().width;
  }

  render() {
    return html`
      <div class="tab__content">
        <slot></slot>
      </div>
    `;
  }
}
