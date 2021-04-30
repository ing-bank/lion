/* eslint-disable max-classes-per-file */
import { LionField } from '@lion/form-core';

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
    return /** @type {HTMLSelectElement} */ (Array.from(this.children).find(
      el => el.slot === 'input',
    ));
  }
}

/**
 * LionSelectNative: wraps the native HTML element select
 *
 * <lion-select-native>
 *   <label slot="label">My Input</label>
 *   <select slot="input">
 *    <option value="top">top</option>
 *    <option value="bottom">bottom</option>
 *   </select>
 * </lion-select-native>
 *
 * You can preselect an option by setting the property modelValue.
 *   Example:
 *     <lion-select-native modelValue="${'<value of option 2>'}">
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

  // FIXME: For some reason we have to override this FormatMixin getter/setter pair for the tests to pass
  get value() {
    return (this._inputNode && this._inputNode.value) || this.__value || '';
  }

  // We don't delegate, because we want to preserve caret position via _setValueAndPreserveCaret
  /** @type {string} */
  set value(value) {
    // if not yet connected to dom can't change the value
    if (this._inputNode) {
      this._inputNode.value = value;
      /** @type {string | undefined} */
      this.__value = undefined;
    } else {
      this.__value = value;
    }
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
