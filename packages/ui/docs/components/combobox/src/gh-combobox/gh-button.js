import { css, html } from 'lit';
import { LionButton } from '@lion/ui/button.js';

export class GhButton extends LionButton {
  static get properties() {
    return {
      value: String,
    };
  }

  static get styles() {
    return css`
      :host {
        outline: none;
        position: relative;
        display: inline-flex;
        align-items: center;
        padding: 5px 16px;
        font-size: 14px;
        font-weight: 500;
        line-height: 20px;
        white-space: nowrap;
        vertical-align: middle;
        cursor: pointer;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        border: 1px solid;
        border-radius: 6px;
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;

        color: #24292e;
        background-color: #fafbfc;
        border-color: rgba(27, 31, 35, 0.15);
        box-shadow: 0 1px 0 rgba(27, 31, 35, 0.04), inset 0 1px 0 hsla(0, 0%, 100%, 0.25);
        transition: background-color 0.2s cubic-bezier(0.3, 0, 0.5, 1);
      }

      :host(:hover) {
        background-color: #f3f4f6;
        transition-duration: 0.1s;
      }

      :host ::slotted([slot='before']) {
        margin-right: 4px;
      }

      /**
       * TODO: this doesn't have to be light dom anymore in LionButton,
       * just spawning a hidden native button on submit would be enough
       */
      :host ::slotted(button) {
        position: absolute;
        opacity: 0;
      }
    `;
  }

  render() {
    return html` <slot name="before"></slot>
      ${this.value}
      <slot name="after"></slot>
      <slot name="_button"></slot>`;
  }
}
customElements.define('gh-button', GhButton);
