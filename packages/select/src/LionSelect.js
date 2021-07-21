/* eslint-disable max-classes-per-file */
import { LionField } from '@lion/form-core';

/**
 * @typedef {import('@lion/localize/types/LocalizeMixinTypes').FormatNumberOptions} FormatOptions
 */
class LionFieldWithSelect extends LionField {
  /** @type {any} */
  static get properties() {
    return { autocomplete: { type: String } };
  }

  constructor() {
    super();

    /**
     * Delegates autocomplete to select
     * @type {string|undefined}
     */
    this.autocomplete = undefined;
  }

  /**
   * @returns {HTMLSelectElement}
   */
  get _inputNode() {
    return /** @type {HTMLSelectElement} */ (
      Array.from(this.children).find(el => el.slot === 'input')
    );
  }
}

/**
 * LionSelect: wraps the native HTML element select
 *
 * <lion-select>
 *   <label slot="label">My Input</label>
 *   <select slot="input">
 *    <option value="top">top</option>
 *    <option value="bottom">bottom</option>
 *   </select>
 * </lion-select>
 *
 * You can preselect an option by setting the property modelValue.
 *   Example:
 *     <lion-select .modelValue="${'<value of option 2>'}">
 *
 * It extends LionField so it inherits required and disabled.
 *
 * The option element needs to be a direct child of the select element.
 *
 * You cannot use interactive elements inside the options. Avoid very long names to
 * facilitate the understandability and perceivability for screen reader users. Sets of options
 * where each option name starts with the same word or phrase can also significantly degrade
 * usability for keyboard and screen reader users.
 *
 * @customElement lion-select
 */
export class LionSelect extends LionFieldWithSelect {
  connectedCallback() {
    super.connectedCallback();
    this._inputNode.addEventListener('change', this._proxyChangeEvent);
  }

  /** @param {import('@lion/core').PropertyValues } changedProperties */
  updated(changedProperties) {
    super.updated(changedProperties);
    if (changedProperties.has('disabled')) {
      this._inputNode.disabled = this.disabled;
      this.validate();
    }

    if (changedProperties.has('name')) {
      this._inputNode.name = this.name;
    }

    if (changedProperties.has('autocomplete')) {
      this._inputNode.autocomplete = /** @type {string} */ (this.autocomplete);
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._inputNode.removeEventListener('change', this._proxyChangeEvent);
  }

  /**
   * @override FormatMixin - set formattedValue to selected option text
   * @param {*} v - modelValue: can be an Object, Number, String depending on the
   * input type(date, number, email etc)
   * @returns {string} formattedValue
   */
  formatter(v) {
    // The selectedIndex is not yet updated
    const found = Array.from(this._inputNode.options).find(option => option.value === v);
    return found ? found.text : '';
  }

  /**
   * @override FormatMixin - set value equal to modelValue instead of formattedValue
   */
  _reflectBackFormattedValueToUser() {
    if (this._reflectBackOn()) {
      // Text 'undefined' should not end up in <input>
      this.value = typeof this.modelValue !== 'undefined' ? this.modelValue : '';
    }
  }

  /** @protected */
  _proxyChangeEvent() {
    this.dispatchEvent(
      new CustomEvent('user-input-changed', {
        bubbles: true,
        composed: true,
      }),
    );
  }
}
