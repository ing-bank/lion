import { html, css, ifDefined, ScopedElementsMixin, ref } from '@lion/core';
import { LionInputTelDropdown } from '@lion/input-tel-dropdown';
import {
  IntlSelectRich,
  IntlOption,
  IntlSeparator,
} from '../../select-rich/src/intl-select-rich.js';

/**
 * @typedef {import('@lion/input-tel-dropdown/types').TemplateDataForDropdownInputTel}TemplateDataForDropdownInputTel
 */

// Example implementation for https://intl-tel-input.com/
export class IntlInputTelDropdown extends ScopedElementsMixin(LionInputTelDropdown) {
  /**
   * @configure LitElement
   * @enhance LionInputTelDropdown
   */
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

      :host {
        max-width: 300px;
      }

      .input-group__container {
        width: 100%;
        height: 34px;
        font-size: 14px;
        line-height: 1.42857143;
        color: #555;
        background-color: #fff;
        background-image: none;
        border: 1px solid #ccc;
        border-radius: 4px;
        -webkit-box-shadow: inset 0 1px 1px rgb(0 0 0 / 8%);
        box-shadow: inset 0 1px 1px rgb(0 0 0 / 8%);
        -webkit-transition: border-color ease-in-out 0.15s, -webkit-box-shadow ease-in-out 0.15s;
        -o-transition: border-color ease-in-out 0.15s, box-shadow ease-in-out 0.15s;
        transition: border-color ease-in-out 0.15s, box-shadow ease-in-out 0.15s;
      }

      .input-group__input {
        padding: 6px;
        box-sizing: border-box;
      }

      .input-group__input ::slotted(input) {
        border: none;
        outline: none;
      }

      :host([focused]) .input-group__container {
        border-color: #66afe9;
        outline: 0;
        -webkit-box-shadow: inset 0 1px 1px rgb(0 0 0 / 8%), 0 0 8px rgb(102 175 233 / 60%);
        box-shadow: inset 0 1px 1px rgb(0 0 0 / 8%), 0 0 8px rgb(102 175 233 / 60%);
      }
    `,
  ];

  static templates = {
    ...(super.templates || {}),
    /**
     * @param {TemplateDataForDropdownInputTel} templateDataForDropdown
     */
    dropdown: templateDataForDropdown => {
      const { refs, data } = templateDataForDropdown;
      const renderOptionWithIndex = (/** @type {RegionMeta} */ regionMeta, /** @type {Number} */ index) =>
        html`${this.templates.dropdownOption(templateDataForDropdown, regionMeta, index)} `;

      const renderOption = (/** @type {RegionMeta} */ regionMeta) =>
        html`${this.templates.dropdownOption(templateDataForDropdown, regionMeta)} `;

      // TODO: once spread directive available, use it per ref (like ref(refs?.dropdown?.ref))
      return html`
        <intl-select-rich
          ${ref(refs?.dropdown?.ref)}
          label="${refs?.dropdown?.labels?.country}"
          label-sr-only
          @model-value-changed="${refs?.dropdown?.listeners['model-value-changed']}"
          style="${refs?.dropdown?.props?.style}"
        >
          ${data?.regionMetaListPreferred?.length
            ? html` 
              ${data.regionMetaListPreferred.map(renderOptionWithIndex)}
              <intl-separator></intl-separator>`
            : ''}
          ${data?.regionMetaList?.map(renderOption)}
        </intl-select-rich>
      `;
    },
    /**
     * @param {TemplateDataForDropdownInputTel} templateDataForDropdown
     * @param {RegionMeta} regionMeta
     * @param {Number} [index]
     */
    // eslint-disable-next-line class-methods-use-this
    dropdownOption: (templateDataForDropdown, regionMeta, index) => { 
      if (index) {
        console.log('dropdownOption, index:', index);
      }
      return html`
      <intl-option .choiceValue="${regionMeta.regionCode}" .regionMeta="${regionMeta}" index="${index ? index : -1}">
      </intl-option>
    `},
  };

  /**
   * @configure ScopedElementsMixin
   */
  static scopedElements = {
    ...super.scopedElements,
    'intl-select-rich': IntlSelectRich,
    'intl-option': IntlOption,
    'intl-separator': IntlSeparator,
  };
}
customElements.define('intl-input-tel-dropdown', IntlInputTelDropdown);
