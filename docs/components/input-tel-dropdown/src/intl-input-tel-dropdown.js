import { ScopedElementsMixin } from '@lion/components/core.js';
import { html, css } from 'lit';
import { ref } from 'lit/directives/ref.js';
import { repeat } from 'lit/directives/repeat.js';
import { LionInputTelDropdown } from '@lion/components/input-tel-dropdown.js';
import {
  IntlSelectRich,
  IntlOption,
  IntlSeparator,
} from '../../select-rich/src/intl-select-rich.js';

/**
 * @typedef {import('@lion/components/input-tel-dropdown/types.js').TemplateDataForDropdownInputTel}TemplateDataForDropdownInputTel
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
            ? html` ${repeat(
                  data.regionMetaListPreferred,
                  regionMeta => regionMeta.regionCode,
                  regionMeta =>
                    html`${this.templates.dropdownOption(templateDataForDropdown, regionMeta)} `,
                )}<intl-separator></intl-separator>`
            : ''}
          ${repeat(
            data.regionMetaList,
            regionMeta => regionMeta.regionCode,
            regionMeta =>
              html`${this.templates.dropdownOption(templateDataForDropdown, regionMeta)} `,
          )}
        </intl-select-rich>
      `;
    },
    /**
     * @param {TemplateDataForDropdownInputTel} templateDataForDropdown
     * @param {RegionMeta} regionMeta
     */
    // eslint-disable-next-line class-methods-use-this
    dropdownOption: (templateDataForDropdown, regionMeta) => html`
      <intl-option .choiceValue="${regionMeta.regionCode}" .regionMeta="${regionMeta}">
      </intl-option>
    `,
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
