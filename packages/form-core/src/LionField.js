import { LitElement, SlotMixin } from '@lion/core';
import { ValidateMixin } from './validate/ValidateMixin.js';
import { FocusMixin } from './FocusMixin.js';
import { FormatMixin } from './FormatMixin.js';
import { FormControlMixin } from './FormControlMixin.js';
import { InteractionStateMixin } from './InteractionStateMixin.js'; // applies FocusMixin

/**
 * `LionField`: wraps <input>, <textarea>, <select> and other interactable elements.
 * Also it would follow a nice hierarchy: lion-form -> lion-fieldset -> lion-field
 *
 * Note: We don't support placeholders, because we have a helper text and
 * placeholders confuse the user with accessibility needs.
 *
 * Please see the docs for in depth information.
 *
 * @example
 * <lion-field name="myName">
 *   <label slot="label">My Input</label>
 *   <input type="text" slot="input">
 * </lion-field>
 *
 * @customElement lion-field
 */
// @ts-expect-error base constructors same return type
export class LionField extends FormControlMixin(
  InteractionStateMixin(FocusMixin(FormatMixin(ValidateMixin(SlotMixin(LitElement))))),
) {
  static get properties() {
    return {
      autocomplete: {
        type: String,
        reflect: true,
      },
      value: {
        type: String,
      },
    };
  }

  constructor() {
    super();
    this.name = '';
    /** @type {string | undefined} */
    this.autocomplete = undefined;
  }

  /**
   * @param {import('lit-element').PropertyValues } changedProperties
   */
  firstUpdated(changedProperties) {
    super.firstUpdated(changedProperties);
    /** @type {any} */
    this._initialModelValue = this.modelValue;
  }

  /**
   * @param {import('lit-element').PropertyValues } changedProperties
   */
  updated(changedProperties) {
    super.updated(changedProperties);

    if (changedProperties.has('submitted')) {
      this.__hasUserJustSubmitted = true;
      this._reflectBackFormattedValueToUser();
      this.__hasUserJustSubmitted = false;
    }
  }

  connectedCallback() {
    super.connectedCallback();
    this._onChange = this._onChange.bind(this);
    this._inputNode.addEventListener('change', this._onChange);
    this.classList.add('form-field'); // eslint-disable-line
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._inputNode.removeEventListener('change', this._onChange);
  }

  resetInteractionState() {
    super.resetInteractionState();
    this.submitted = false;
  }

  reset() {
    this.modelValue = this._initialModelValue;
    this.resetInteractionState();
  }

  /**
   * Clears modelValue.
   * Interaction states are not cleared (use resetInteractionState for this)
   */
  clear() {
    // TODO: set to undefined in next breaking release, will be fixed via formatter
    this.modelValue = ''; // can't set undefined here, because IE11 treats it as a string
  }

  _onChange() {
    this.dispatchEvent(
      new CustomEvent('user-input-changed', {
        bubbles: true,
      }),
    );
  }

  /**
   * @enhance FormatMixin
   */
  _reflectBackOn() {
    return super._reflectBackOn() || this.__hasUserJustSubmitted;
  }
}
