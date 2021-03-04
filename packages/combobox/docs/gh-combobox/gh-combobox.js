import { css, html } from '@lion/core';
import { LionOption } from '@lion/listbox';
import { renderLitAsNode } from '@lion/helpers';
// import { withModalDialogConfig } from '@lion/overlays';
import { LionCombobox } from '../../src/LionCombobox.js';
import './gh-button.js';

export class GhOption extends LionOption {
  static get properties() {
    return {
      category: String,
      default: { type: Boolean, reflect: true },
    };
  }

  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: flex;
          align-items: center;
          width: 100%;
          padding: 16px;
          overflow: hidden;
          color: #24292e;
          text-align: left;
          cursor: pointer;
          background-color: #fff;
          border: 0;
          border-bottom: 1px solid #eaecef;
          box-sizing: border-box;
          display: flex;
          align-items: center;
        }

        @media (min-width: 544px) {
          :host {
            padding-top: 7px;
            padding-bottom: 7px;
          }
        }

        :host([checked]) {
          background-color: white;
        }

        :host(:hover),
        :host([active]),
        :host([focused]) {
          background-color: #f6f8fa;
        }

        .gh-check-icon {
          visibility: hidden;
          margin-right: 4px;
        }

        :host([checked]) .gh-check-icon {
          visibility: visible;
        }

        .gh-default-badge {
          visibility: hidden;

          display: inline-block;
          padding: 0 7px;
          font-size: 12px;
          font-weight: 500;
          line-height: 18px;
          border-radius: 2em;
          background-color: initial !important;
          border: 1px solid #e1e4e8;
          color: #586069;
          border-color: #e1e4e8;
        }

        :host([default]) .gh-default-badge {
          visibility: visible;
        }

        .gh-content {
          flex: 1;
        }
      `,
    ];
  }

  render() {
    return html`
      <svg
        class="gh-check-icon"
        viewBox="0 0 16 16"
        version="1.1"
        width="16"
        height="16"
        aria-hidden="true"
      >
        <path
          fill-rule="evenodd"
          d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z"
        ></path>
      </svg>
      <span class="gh-content"><slot></slot></span>
      <span class="gh-default-badge">default</span>
    `;
  }
}
customElements.define('gh-option', GhOption);

export class GhCombobox extends LionCombobox {
  static get properties() {
    return {
      category: { type: String },
      isDesktop: { type: Boolean, reflect: true, attribute: 'is-desktop' },
    };
  }

  static get styles() {
    return [
      super.styles,
      css`
        /** @configure LionCombobox */

        :host {
          font-family: apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial, sans-serif,
            Apple Color Emoji, Segoe UI Emoji;
          font-size: 14px;
        }

        .input-group__container {
          display: flex;
          border-bottom: none;
        }

        * > ::slotted([role='listbox']) {
          max-height: none;
        }

        * > ::slotted([slot='input']) {
          padding: 5px 12px;
          font-size: 14px;
          line-height: 20px;
          color: #24292e;
          vertical-align: middle;
          background-color: #fff;
          background-repeat: no-repeat;
          background-position: right 8px center;
          border: 1px solid #e1e4e8;
          border-radius: 6px;
          outline: none;
          box-shadow: inset 0 1px 0 rgba(225, 228, 232, 0.2);
        }

        :host([is-desktop]) {
          font-size: 12px;
        }

        :host([is-desktop]) ::slotted([slot='input']) {
          font-size: 14px;
        }

        :host([focused]) ::slotted([slot='input']) {
          border-color: #0366d6;
          outline: none;
          box-shadow: 0 0 0 3px rgba(3, 102, 214, 0.3);
        }

        .gh-combobox {
          height: auto;
          max-height: 480px;
          margin-top: 8px;

          position: relative;
          z-index: 99;
          display: flex;
          max-height: 66%;
          margin: auto 0;
          overflow: hidden;
          pointer-events: auto;
          flex-direction: column;
          background-color: #fff;
          border-radius: 12px;
          box-shadow: 0 0 18px rgba(27, 31, 35, 0.4);
          /* animation: SelectMenu-modal-animation 0.12s cubic-bezier(0, 0.1, 0.1, 1) backwards; */
        }

        :host([is-desktop]) .gh-combobox {
          width: 300px;
          height: auto;
          max-height: 480px;
          margin: 8px 0 16px;
          font-size: 12px;
          border: 1px solid #e1e4e8;
          border-radius: 6px;
          box-shadow: 0 8px 24px rgba(149, 157, 165, 0.2);
          /* animation-name: SelectMenu-modal-animation--sm; */
        }

        .form-field__label {
          font-weight: bold;
        }

        /** @enhance LionCombobox */

        .gh-categories {
          display: flex;
          flex-shrink: 0;
          overflow-x: auto;
          overflow-y: hidden;
          box-shadow: inset 0 -1px 0 #eaecef;
          -webkit-overflow-scrolling: touch;
        }

        :host([is-desktop]) .gh-categories {
          padding: 8px 8px 0;
        }

        .gh-categories__btn {
          flex: 1;
          padding: 8px 16px;
          font-size: 12px;
          font-weight: 500;
          color: #6a737d;
          text-align: center;
          background-color: initial;
          border: 0;
          box-shadow: inset 0 -1px 0 #eaecef;

          border-radius: 0;
          font-family: inherit;
          font-size: inherit;
          line-height: inherit;
          outline: none;

          cursor: pointer;
        }

        .gh-categories__btn:focus {
          background-color: #dbedff;
        }

        :host([is-desktop]) .gh-categories__btn {
          flex: none;
          padding: 4px 16px;
          border: solid transparent;
          border-width: 1px 1px 0;
          border-top-left-radius: 6px;
          border-top-right-radius: 6px;
        }

        .gh-categories__btn[aria-pressed='true'] {
          z-index: 1;
          color: #24292e;
          cursor: default;
          box-shadow: 0 0 0 1px #eaecef;
          cursor: default;
        }

        :host([is-desktop]) .gh-categories__btn {
          flex: none;
        }
        :host([is-desktop]) .gh-categories__btn[aria-pressed='true'] {
          border-color: #eaecef;
          box-shadow: none;
        }

        .gh-section-wrapper {
          padding: 16px;
          margin: 0;
          border-bottom: 1px solid #eaecef;
        }

        :host([is-desktop]) .gh-section-wrapper {
          padding: 8px;
        }
      `,
    ];
  }

  /**
   * @override LionCombobox put all content in an overlay
   */
  // eslint-disable-next-line class-methods-use-this
  render() {
    return html`
      <slot name="selection-display"></slot>
      <div id="overlay-content-node-wrapper" role="dialog">
        <div class="gh-combobox">
          <div class="form-field__group-one">
            <div class="gh-section-wrapper">${this._groupOneTemplate()}</div>
          </div>
          <div class="form-field__group-two">
            <div class="gh-section-wrapper">${this._groupTwoTemplate()}</div>
            <div
              class="gh-categories"
              @click="${this.__handleCategory}"
              @keydown="${this.__handleCategory}"
            >
              <button type="button" data-category="branches" class="gh-categories__btn">
                Branches
              </button>
              <button type="button" data-category="tags" class="gh-categories__btn">Tags</button>
            </div>
            <slot name="listbox"></slot>
          </div>
        </div>
      </div>
      <slot id="options-outlet"></slot>
    `;
  }

  /**
   * Wrapper with combobox role for the text input that the end user controls the listbox with.
   * @type {HTMLElement}
   */
  get _comboboxNode() {
    if (this.__comboboxNode) {
      return this.__comboboxNode;
    }
    const slot = this.querySelector('[slot="input"]');
    if (slot) {
      this.__comboboxNode = slot;
      return slot;
    }
    const slot2 = this._overlayCtrl?.contentWrapperNode.querySelector('[slot="input"]');
    if (slot2) {
      this.__comboboxNode = slot2;
      return slot2;
    }
    return null;
  }

  /**
   * @override LionCombobox: remove selection-display (place it higher up)
   */
  // eslint-disable-next-line class-methods-use-this
  _inputGroupInputTemplate() {
    return html`
      <div class="input-group__input">
        <slot name="input"></slot>
      </div>
    `;
  }

  /**
   * @override LionCombobox: restore to values FormControlMixin
   */
  // eslint-disable-next-line class-methods-use-this
  _groupTwoTemplate() {
    return html` ${this._inputGroupTemplate()} ${this._feedbackTemplate()} `;
  }

  get slots() {
    return {
      ...super.slots,
      'selection-display': () =>
        renderLitAsNode(html`
          <gh-button>
            <svg
              slot="before"
              text="gray"
              height="16"
              class="octicon octicon-git-branch text-gray"
              viewBox="0 0 16 16"
              version="1.1"
              width="16"
              aria-hidden="true"
            >
              <path
                fill-rule="evenodd"
                d="M11.75 2.5a.75.75 0 100 1.5.75.75 0 000-1.5zm-2.25.75a2.25 2.25 0 113 2.122V6A2.5 2.5 0 0110 8.5H6a1 1 0 00-1 1v1.128a2.251 2.251 0 11-1.5 0V5.372a2.25 2.25 0 111.5 0v1.836A2.492 2.492 0 016 7h4a1 1 0 001-1v-.628A2.25 2.25 0 019.5 3.25zM4.25 12a.75.75 0 100 1.5.75.75 0 000-1.5zM3.5 3.25a.75.75 0 111.5 0 .75.75 0 01-1.5 0z"
              ></path>
            </svg>

            <span slot="after"> </span>
          </gh-button>
        `),
    };
  }

  get _overlayInvokerNode() {
    return this.querySelector('[slot="selection-display"]');
  }

  get _overlayReferenceNode() {
    return this._overlayInvokerNode;
  }

  get _categoryButtons() {
    return Array.from(this.shadowRoot.querySelectorAll('.gh-categories__btn[data-category]'));
  }

  constructor() {
    super();

    this.showAllOnEmpty = true;

    /** @type {'branches'|'tags'} */
    this.category = 'branches';

    this.selectionFollowsFocus = false;

    // Capture mobile OverlayConfig
    this.__mobileDropdownComboConfig = this.config;
  }

  firstUpdated(changedProperties) {
    super.firstUpdated(changedProperties);

    const mql = window.matchMedia('(min-width: 544px)');
    this.isDesktop = mql.matches;
    mql.addListener(({ matches }) => {
      this.isDesktop = matches;
    });
  }

  updated(changedProperties) {
    super.updated(changedProperties);

    if (changedProperties.has('category')) {
      const cat = this.category;
      this._categoryButtons.forEach(btn => {
        btn.setAttribute(
          'aria-pressed',
          btn.getAttribute('data-category') === cat ? 'true' : 'false',
        );
      });

      this._inputNode.placeholder =
        cat === 'branches' ? 'Find or create a branch...' : 'Find a tag';

      this._handleAutocompletion();
    }

    if (changedProperties.has('opened')) {
      // eslint-disable-next-line no-shadow
      this._selectionDisplayNode.value = this.modelValue || 'Choose a value...';

      if (this.opened) {
        setTimeout(() => {
          this._inputNode.focus();
        });
      } else {
        setTimeout(() => {
          this._selectionDisplayNode.focus();
        }, 100);
      }
    }

    if (changedProperties.has('isDesktop')) {
      // this.config = this.isDesktop ? this.__mobileDropdownComboConfig : withModalDialogConfig();
    }
  }

  // /**
  //  * @enhance LionCombobox
  //  * @param {*} option
  //  * @param  {...any} args
  //  */
  // matchCondition(option, ...args) {
  //   return super.matchCondition(option, ...args) && option.category === this.category;
  // }

  // _defineOverlayConfig() {
  //   // temp
  //   return { ...super._defineOverlayConfig(), hidesOnOutsideClick: false };
  // }

  __handleCategory(ev) {
    this.category = ev.target.getAttribute('data-category');
  }

  // TODO: overrides below are not safe for override and should be made configurable in Combobox
  // basically it should be possible te create a combobox without an overlay

  /**
   * @override
   */
  _textboxOnKeydown() {
    // if (ev.key === 'Tab') {
    //   this.opened = false;
    // }
    this.__hasSelection = this._inputNode.value.length !== this._inputNode.selectionStart;
  }

  /**
   * @enhance OverlayMixin
   */
  _setupOpenCloseListeners() {
    super._setupOpenCloseListeners();
    this.__toggleOverlay = this.__toggleOverlay.bind(this);
    this._overlayInvokerNode.addEventListener('click', this.__toggleOverlay);
  }

  __toggleOverlay() {
    this.opened = !this.opened;
  }

  /**
   * @enhance OverlayMixin
   */
  _teardownOpenCloseListeners() {
    super._teardownOpenCloseListeners();
    this._overlayInvokerNode.removeEventListener('click', this.__toggleOverlay);
  }
}
customElements.define('gh-combobox', GhCombobox);
