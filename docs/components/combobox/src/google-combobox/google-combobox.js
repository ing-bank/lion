import { css, html } from 'lit';
import { LionOption } from '@lion/components/listbox.js';
import { renderLitAsNode } from '@lion/components/helpers.js';
import { LionCombobox } from '@lion/components/combobox.js';
import { LinkMixin } from '../LinkMixin.js';
import googleSearchIcon from './assets/google-search-icon.js';
import googleVoiceSearchIcon from './assets/google-voice-search-icon.js';
import googleClearIcon from './assets/google-clear-icon.js';

const googleSearchLogoUrl = new URL('./assets/googlelogo_color_272x92dp.png', import.meta.url).href;

export class GoogleOption extends LinkMixin(LionOption) {
  static get properties() {
    return {
      imageUrl: {
        type: String,
      },
    };
  }

  static get styles() {
    return [
      ...super.styles,
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
        : html` <img class="google-option__icon" src="${this.imageUrl}" alt="" />`}
      ${super.render()}
    `;
  }
}
customElements.define('google-option', GoogleOption);

export class GoogleCombobox extends LionCombobox {
  static get styles() {
    return [
      ...super.styles,
      css`
        /** @configure FormControlMixin */

        /* =======================
            block | .form-field
            ======================= */

        :host {
          font-family: arial, sans-serif;
        }

        .form-field__label {
          margin-top: 36px;
          margin-bottom: 24px;
          display: flex;
          justify-content: center;
        }

        /* ==============================
            element | .input-group
            ============================== */

        .input-group {
          margin-bottom: 16px;
          max-width: 582px;
          margin: auto;
        }

        .input-group__container {
          position: relative;
          background: #fff;
          display: flex;
          border: 1px solid #dfe1e5;
          box-shadow: none;
          border-radius: 24px;
          height: 44px;
        }

        .input-group__container:hover,
        :host([opened]) .input-group__container {
          border-color: rgba(223, 225, 229, 0);
          box-shadow: 0 1px 6px rgba(32, 33, 36, 0.28);
        }

        :host([opened]) .input-group__container {
          border-bottom-right-radius: 0;
          border-bottom-left-radius: 0;
        }

        :host([opened]) .input-group__container::before {
          content: '';
          position: absolute;
          background: white;
          left: 0;
          right: 0;
          height: 10px;
          bottom: -10px;
        }

        :host([opened]) .input-group__container::after {
          content: '';
          position: absolute;
          background: #eee;
          left: 16px;
          right: 16px;
          height: 1px;
          bottom: 0;
          z-index: 3;
        }

        .input-group__prefix,
        .input-group__suffix {
          display: block;
          fill: var(--icon-color);
          display: flex;
          place-items: center;
        }

        .input-group__input {
          flex: 1;
        }

        .input-group__input ::slotted([slot='input']) {
          border: transparent;
          width: 100%;
        }

        /** @configure LionCombobox */

        /* =======================
            block | .form-field
            ======================= */

        #overlay-content-node-wrapper {
          box-shadow: 0 4px 6px rgba(32, 33, 36, 0.28);
          border-radius: 0 0 24px 24px;
          margin-top: -2px;
          padding-top: 6px;
          background: white;
        }

        * > ::slotted([slot='listbox']) {
          margin-bottom: 8px;
          background: none;
        }

        :host {
          --icon-color: #9aa0a6;
        }

        /** @enhance LionCombobox */

        /* ===================================
            block | .google-search-clear-btn
          =================================== */

        .google-search-clear-btn {
          position: relative;
          height: 100%;
          align-items: center;
          display: none;
        }

        .google-search-clear-btn::after {
          border-left: 1px solid #dfe1e5;
          height: 65%;
          right: 0;
          content: '';
          margin-right: 10px;
          margin-left: 8px;
        }

        :host([filled]) .google-search-clear-btn {
          display: flex;
        }

        * > ::slotted([slot='suffix']),
        * > ::slotted([slot='clear-btn']) {
          font: inherit;
          margin: 0;
          border: 0;
          outline: 0;
          padding: 0;
          color: inherit;
          background-color: transparent;
          text-align: left;
          white-space: normal;
          overflow: visible;

          user-select: none;
          -moz-user-select: none;
          -webkit-user-select: none;
          -ms-user-select: none;
          -webkit-tap-highlight-color: transparent;

          width: 25px;
          height: 25px;
          cursor: pointer;
        }

        * > ::slotted([slot='suffix']) {
          margin-right: 20px;
        }

        * > ::slotted([slot='prefix']) {
          height: 20px;
          width: 20px;
          margin-left: 12px;
          margin-right: 16px;
        }

        /* =============================
            block | .google-search-btns
            ============================ */

        .google-search-btns {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .google-search-btns__input-button {
          background-image: -webkit-linear-gradient(top, #f8f9fa, #f8f9fa);
          background-color: #f8f9fa;
          border: 1px solid #f8f9fa;
          border-radius: 4px;
          color: #3c4043;
          font-family: arial, sans-serif;
          font-size: 14px;
          margin: 11px 4px;
          padding: 0 16px;
          line-height: 27px;
          height: 36px;
          min-width: 54px;
          text-align: center;
          cursor: pointer;
          user-select: none;
        }

        .google-search-btns__input-button:hover {
          box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
          background-image: -webkit-linear-gradient(top, #f8f8f8, #f1f1f1);
          background-color: #f8f8f8;
          border: 1px solid #c6c6c6;
          color: #222;
        }

        .google-search-btns__input-button:focus {
          border: 1px solid #4d90fe;
          outline: none;
        }

        /* ===============================
            block | .google-search-report
            ============================== */

        .google-search-report {
          display: flex;
          align-content: right;
          color: #70757a;
          font-style: italic;
          font-size: 8pt;
          -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
          margin-bottom: 8px;
          justify-content: flex-end;
          margin-right: 20px;
        }

        .google-search-report a {
          color: inherit;
        }
      `,
    ];
  }

  /**
   * @enhance LionCombobox - add google search buttons
   */
  _overlayListboxTemplate() {
    return html`
      <div id="overlay-content-node-wrapper" role="dialog">
        <slot name="listbox"></slot>
        ${this._googleSearchBtnsTemplate()}
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
    return html`${super._groupTwoTemplate()} ${!this.opened ? this._googleSearchBtnsTemplate() : ''} `;
  }

  get slots() {
    return {
      ...super.slots,
      label: () => renderLitAsNode(html` <img alt="Google Search" src="${googleSearchLogoUrl}" />`),
      prefix: () => renderLitAsNode(html` <span>${googleSearchIcon}</span> `),
      suffix: () =>
        renderLitAsNode(
          html` <button aria-label="Search by voice">${googleVoiceSearchIcon}</button> `,
        ),
      'clear-btn': () =>
        renderLitAsNode(
          html`
            <button @click="${this.__clearText}" aria-label="Clear text">${googleClearIcon}</button>
          `,
        ),
    };
  }

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
    return this.focused || super._showOverlayCondition(options);
  }

  __resetFocus() {
    this.activeIndex = -1;
    this.checkedIndex = -1;
  }

  __clearText() {
    this._inputNode.value = '';
  }
}
customElements.define('google-combobox', GoogleCombobox);
