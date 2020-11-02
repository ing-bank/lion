import { css, html } from '@lion/core';
import { LionOption } from '@lion/listbox';
import { LionCombobox } from '../../src/LionCombobox.js';
import { LinkMixin } from '../LinkMixin.js';
import googleSearchIcon from './assets/google-search-icon.js';
import { DecorateMixin } from './util/decorate.js';

export class GoogleOptionTm extends LinkMixin(LionOption) {
  static get properties() {
    return {
      imageUrl: {
        type: String,
      },
    };
  }

  static get styles() {
    return [
      super.styles,
      css`
        :host {
          position: relative;
          padding: 8px 16px;
          display: flex;
          align-items: center;
          background: none;
        }

        :host:hover,
        :host([active]) {
          background: #eee !important;
        }

        :host([checked]) {
          background: none;
        }

        /* :host([active]) {
          color: #1867c0 !important;
          caret-color: #1867c0 !important;
        } */

        :host {
          font-weight: bold;
        }

        :host ::slotted(.google-option__highlight) {
          font-weight: normal;
        }

        .google-option__icon {
          height: 20px;
          width: 20px;
          margin-right: 12px;
          fill: var(--icon-color);
        }
      `,
    ];
  }

  /**
   * @configure
   * @param {string} currentValue
   */
  onFilterMatch(currentValue) {
    const { innerHTML } = this;
    // eslint-disable-next-line no-param-reassign
    this.__originalInnerHTML = innerHTML;
    const newInnerHTML = innerHTML.replace(
      new RegExp(`(${currentValue})`, 'i'),
      `<span class="google-option__highlight">$1</span>`,
    );
    // For Safari, we need to add a label to the element
    this.setAttribute('aria-label', this.textContent);
    this.innerHTML = newInnerHTML;
    // Alternatively, an extension can add an animation here
    this.style.display = '';
  }

  /**
   * @configure LionCombobox
   */
  onFilterUnmatch() {
    this.removeAttribute('aria-label');
    if (this.__originalInnerHTML) {
      this.innerHTML = this.__originalInnerHTML;
    }
    this.style.display = 'none';
  }

  render() {
    return html`
      ${!this.imageUrl
        ? html` <div class="google-option__icon">${googleSearchIcon}</div>`
        : html` <img class="google-option__icon" src="${this.imageUrl}" />`}
      ${super.render()}
    `;
  }
}
customElements.define('google-option-tm', GoogleOptionTm);

export class GoogleSearchTm extends DecorateMixin('google-search-tm', LionCombobox) {
  /**
   * @enhance LionCombobox - add google search buttons
   */
  _overlayListboxTemplate() {
    return html`
      <div id="overlay-content-node-wrapper" role="dialog">
        <slot name="listbox"></slot>
        <div class="google-search-report"><a href="#">Report inappropriate predictions</a></div>
      </div>
      <slot id="options-outlet"></slot>
    `;
  }

  /**
   * @enhance FormControlMixin add clear-btn
   */
  _inputGroupSuffixTemplate() {
    return html`
      <div class="input-group__suffix">
        <div class="google-search-clear-btn">
          <slot name="clear-btn"></slot>
        </div>
        <slot name="suffix"></slot>
      </div>
    `;
  }

  _googleSearchBtnsTemplate() {
    return html` <div class="google-search-btns">
      <input
        type="submit"
        class="google-search-btns__input-button"
        value="Google Search"
        aria-label="Google Search"
      />
      <input
        type="submit"
        class="google-search-btns__input-button"
        value="I'm Feeling Lucky"
        aria-label="I'm Feeling Lucky"
      />
    </div>`;
  }

  /**
   * @enhance FormControlMixin - add google search buttons
   */
  _groupTwoTemplate() {
    return html`${super._groupTwoTemplate()} ${this._googleSearchBtnsTemplate()} `;
  }

  // get slots() {
  //   return {
  //     ...super.slots,
  //     label: () => renderLitAsNode(html` <img alt="Google Search" src="${googleSearchLogoUrl}" />`),
  //     prefix: () => renderLitAsNode(html` <span>${googleSearchIcon}</span> `),
  //     suffix: () =>
  //       renderLitAsNode(
  //         html` <button aria-label="Search by voice">${googleVoiceSearchIcon}</button> `,
  //       ),
  //     'clear-btn': () =>
  //       renderLitAsNode(
  //         html`
  //           <button @click="${this.__clearText}" aria-label="Clear text">${googleClearIcon}</button>
  //         `,
  //       ),
  //   };
  // }

  /**
   * @configure OverlayMixin
   */
  get _overlayReferenceNode() {
    return /** @type {ShadowRoot} */ (this.shadowRoot).querySelector('.input-group');
  }

  constructor() {
    super();
    /** @configure LionCombobox */
    this.autocomplete = 'list';
    /** @configure LionCombobox */
    this.showAllOnEmpty = true;

    this.__resetFocus = this.__resetFocus.bind(this);
    this.__clearText = this.__clearText.bind(this);
  }

  firstUpdated(changedProperties) {
    super.firstUpdated(changedProperties);

    this._overlayContentNode.addEventListener('mouseenter', this.__resetFocus);
  }

  /**
   * @override LionCombobox - always sync textbox when selected value changes
   */
  // eslint-disable-next-line no-unused-vars
  _syncToTextboxCondition() {
    return true;
  }

  _showOverlayCondition(options) {
    return this.focused || super.showOverlayCondition(options);
  }

  __resetFocus() {
    this.activeIndex = -1;
    this.checkedIndex = -1;
  }

  __clearText() {
    this._inputNode.value = '';
  }
}
customElements.define('google-search-tm', GoogleSearchTm);
