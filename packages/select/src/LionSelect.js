import { LionField } from '@lion/form-core';

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
 * @extends {LionField}
 */

// eslint-disable-next-line no-unused-vars
export class LionSelect extends LionField {
  connectedCallback() {
    super.connectedCallback();
    this._inputNode.addEventListener('change', this._proxyChangeEvent);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._inputNode.removeEventListener('change', this._proxyChangeEvent);
  }

  _proxyChangeEvent() {
    this.dispatchEvent(
      new CustomEvent('user-input-changed', {
        bubbles: true,
        composed: true,
      }),
    );
  }
}
