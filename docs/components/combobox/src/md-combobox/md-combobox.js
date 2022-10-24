import { css, html } from 'lit';
import { LionOption } from '@lion/ui/listbox.js';
import { LionCombobox } from '@lion/ui/combobox.js';
import { MdFieldMixin } from './MdFieldMixin.js';
import './style/md-ripple.js';
import './style/load-roboto.js';

// TODO: insert ink wc here
export class MdOption extends LionOption {
  static get styles() {
    return [
      ...super.styles,
      css`
        :host {
          position: relative;
          padding: 8px;
        }

        :host([focused]) {
          background: lightgray;
        }

        :host([active]) {
          color: #1867c0 !important;
          caret-color: #1867c0 !important;
        }

        :host ::slotted(.md-highlight) {
          color: rgba(0, 0, 0, 0.38);
          background: #eee;
        }
      `,
    ];
  }

  /**
   * @override
   * @param {string} matchingString
   */
  onFilterMatch(matchingString) {
    const { innerHTML } = this;
    this.__originalInnerHTML = innerHTML;
    this.innerHTML = innerHTML.replace(
      new RegExp(`(${matchingString})`, 'i'),
      `<span class="md-highlight">$1</span>`,
    );
    this.style.display = '';
  }

  /**
   * @override
   */
  onFilterUnmatch() {
    if (this.__originalInnerHTML) {
      this.innerHTML = this.__originalInnerHTML;
    }
    this.style.display = 'none';
  }

  render() {
    return html`
      ${super.render()}
      <md-ripple></md-ripple>
    `;
  }
}
customElements.define('md-option', MdOption);

export class MdCombobox extends MdFieldMixin(LionCombobox) {
  static get styles() {
    return [
      ...super.styles,
      css`
        .input-group__container {
          display: flex;
          border-bottom: none;
        }

        * > ::slotted([role='listbox']) {
          box-shadow: 0 4px 6px 0 rgba(32, 33, 36, 0.28);
          padding-top: 8px;
          padding-bottom: 8px;
          top: 2px;
        }
      `,
    ];
  }
}
customElements.define('md-combobox', MdCombobox);
