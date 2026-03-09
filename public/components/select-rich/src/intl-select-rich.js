import { html, css, LitElement } from 'lit';
import { LionSelectRich, LionSelectInvoker } from '@lion/ui/select-rich.js';
import { LionOption } from '@lion/ui/listbox.js';
import { flagStyles } from './flagStyles.js';

/**
 * @typedef {import('@lion/ui/core.js').RenderOptions} RenderOptions
 * @typedef {import('@lion/ui/input-tel/types/types.js').RegionAndCountryCode} RegionAndCountryCode
 * @typedef {import('@lion/ui/input-tel/types/types.js').TemplateDataForDropdownInputTel} TemplateDataForDropdownInputTel
 * @typedef {{countryCode: string; regionCode: string; nameForRegion: string; nameForLocale: string}} RegionMetaList
 * @typedef {TemplateDataForDropdownInputTel & {data: {regionMetaList:RegionMetaList}}} TemplateDataForIntlInputTel
 */

export class IntlOption extends LionOption {
  static properties = { regionMeta: { type: Object } };

  static styles = [
    super.styles,
    flagStyles,
    css`
      :host {
        padding: 5px 10px;
        outline: none;
      }

      :host(:hover),
      :host([active]),
      :host([checked]) {
        background-color: rgba(0, 0, 0, 0.05);
      }
    `,
  ];

  get _regionCode() {
    return this.choiceValue?.toUpperCase();
  }

  render() {
    const ctor = /** @type {typeof IntlOption} */ (this.constructor);
    return ctor._contentTemplate({
      data: this.regionMeta,
    });
  }

  static _contentTemplate({ data: { regionCode, countryCode, nameForLocale, nameForRegion } }) {
    return html`
      <div class="iti__flag-box">
        <div class="iti__flag iti__${regionCode?.toLowerCase()}"></div>
      </div>
      <span class="iti__country-name"> ${nameForLocale} (${nameForRegion}) </span>
      <span class="iti__dial-code">+${countryCode}</span>
    `;
  }
}
customElements.define('intl-option', IntlOption);

class IntlSelectInvoker extends LionSelectInvoker {
  /**
   * @configure LitElement
   * @enhance LionSelectInvoker
   */
  static styles = [
    super.styles,
    flagStyles,
    css`
      :host {
        /** TODO: avoid importants; should actually be configured in overlay */
        width: auto !important;
        background-color: transparent;
        border-top-left-radius: 3px;
        border-bottom-left-radius: 3px;
      }

      #content-wrapper {
        display: flex;
        align-items: center;
      }
    `,
  ];

  /**
   * @configure SlotMixin
   * @override LionSelectInvoker
   */
  get slots() {
    return {};
  }

  /**
   * @override LionSelectInvoker
   */
  render() {
    const ctor = /** @type {typeof LionSelectInvoker} */ (this.constructor);
    return ctor._mainTemplate(this._templateData);
  }

  get _templateData() {
    return {
      data: { selectedElement: this.selectedElement, hostElement: this.hostElement },
    };
  }

  static _mainTemplate(templateData) {
    return html` <div id="content-wrapper">${this._contentTemplate(templateData)}</div> `;
  }

  static _contentTemplate({ data: { selectedElement, hostElement } }) {
    if (!selectedElement) {
      return ``;
    }
    return html`
      <div class="iti__flag iti__${selectedElement.regionMeta.regionCode?.toLowerCase()}"></div>
      <div class="iti__arrow iti__arrow--${hostElement.opened ? 'up' : 'down'}"></div>
    `;
  }
}
customElements.define('intl-select-invoker', IntlSelectInvoker);

export class IntlSeparator extends LitElement {
  static styles = [
    css`
      :host {
        display: block;
        padding-bottom: 5px;
        margin-bottom: 5px;
        border-bottom: 1px solid #ccc;
      }
    `,
  ];

  /**
   * @lifecycle platform
   */
  connectedCallback() {
    super.connectedCallback();
    this.setAttribute('role', 'separator');
  }
}
customElements.define('intl-separator', IntlSeparator);

export class IntlSelectRich extends LionSelectRich {
  static styles = [
    super.styles,
    css`
      :host,
      ::slotted(*) {
        font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
        font-size: 14px;
        line-height: 1.42857143;
        color: #333;
      }

      ::slotted([role='listbox']) {
        margin-left: -3px;
        display: block;
        white-space: nowrap;
        max-height: 200px;
        overflow-y: scroll;
        position: absolute;
        z-index: 2;
        list-style: none;
        text-align: left;
        padding: 0;
        margin: 0 0 0 -1px;
        box-shadow: 1px 1px 4px rgb(0 0 0 / 20%);
        background-color: white;
        border: 1px solid #ccc;
        -webkit-overflow-scrolling: touch;
        outline: none;
      }

      .form-field__group-two,
      .input-group,
      .input-group__container,
      .input-group__input {
        height: 100%;
      }
    `,
  ];

  /**
   * @configure ScopedElementsMixin
   */
  static scopedElements = { 'intl-select-invoker': IntlSelectInvoker };

  /**
   * @configure SlotMixin
   */
  slots = {
    ...super.slots,
    invoker: () => html`<intl-select-invoker></intl-select-invoker>`,
  };
}
customElements.define('intl-select-rich', IntlSelectRich);
