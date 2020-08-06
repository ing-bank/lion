import { LitElement, SlotMixin } from '@lion/core';
import { DisabledMixin } from '@lion/core/src/DisabledMixin.js';
import { ValidateMixin } from './validate/ValidateMixin.js';
import { FocusMixin } from './FocusMixin.js';
import { FormatMixin } from './FormatMixin.js';
import { FormControlMixin } from './FormControlMixin.js';
import { InteractionStateMixin } from './InteractionStateMixin.js'; // applies FocusMixin

/* eslint-disable wc/guard-super-call */

// TODO: Add submitted prop to InteractionStateMixin.
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
export class LionField extends FormControlMixin(
  InteractionStateMixin(
    FocusMixin(FormatMixin(ValidateMixin(DisabledMixin(SlotMixin(LitElement))))),
  ),
) {
  static get properties() {
    return {
      submitted: {
        // make sure validation can be triggered based on observer
        type: Boolean,
      },
      autocomplete: {
        type: String,
        reflect: true,
      },
      value: {
        type: String,
      },
    };
  }

  /** @type {number} */
  get selectionStart() {
    const native = this._inputNode;
    if (native && native.selectionStart) {
      return native.selectionStart;
    }
    return 0;
  }

  set selectionStart(value) {
    const native = this._inputNode;
    if (native && native.selectionStart) {
      native.selectionStart = value;
    }
  }

  /** @type {number} */
  get selectionEnd() {
    const native = this._inputNode;
    if (native && native.selectionEnd) {
      return native.selectionEnd;
    }
    return 0;
  }

  set selectionEnd(value) {
    const native = this._inputNode;
    if (native && native.selectionEnd) {
      native.selectionEnd = value;
    }
  }

  // We don't delegate, because we want to preserve caret position via _setValueAndPreserveCaret
  /** @type {string} */
  set value(value) {
    // if not yet connected to dom can't change the value
    if (this._inputNode) {
      this._setValueAndPreserveCaret(value);
      this.__value = undefined;
    } else {
      this.__value = value;
    }
  }

  get value() {
    return (this._inputNode && this._inputNode.value) || this.__value || '';
  }

  constructor() {
    super();
    this.name = '';
    this.submitted = false;
  }

  firstUpdated(changedProperties) {
    super.firstUpdated(changedProperties);
    this._initialModelValue = this.modelValue;
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
      this._inputNode.autocomplete = this.autocomplete;
    }
  }

  resetInteractionState() {
    if (super.resetInteractionState) {
      super.resetInteractionState();
    }
    this.submitted = false;
  }

  reset() {
    this.modelValue = this._initialModelValue;
    this.resetInteractionState();
  }

  clear() {
    if (super.clear) {
      // Let validationMixin and interactionStateMixin clear their
      // invalid and dirty/touched states respectively
      super.clear();
    }
    this.modelValue = ''; // can't set null here, because IE11 treats it as a string
  }

  _onChange() {
    if (super._onChange) {
      super._onChange();
    }
    this.dispatchEvent(
      new CustomEvent('user-input-changed', {
        bubbles: true,
      }),
    );
  }

  /**
   * Restores the cursor to its original position after updating the value.
   * @param {string} newValue The value that should be saved.
   */
  _setValueAndPreserveCaret(newValue) {
    // Only preserve caret if focused (changing selectionStart will move focus in Safari)
    if (this.focused) {
      // Not all elements might have selection, and even if they have the
      // right properties, accessing them might throw an exception (like for
      // <input type=number>)
      try {
        const start = this._inputNode.selectionStart;
        this._inputNode.value = newValue;
        // The cursor automatically jumps to the end after re-setting the value,
        // so restore it to its original position.
        this._inputNode.selectionStart = start;
        this._inputNode.selectionEnd = start;
      } catch (error) {
        // Just set the value and give up on the caret.
        this._inputNode.value = newValue;
      }
    } else {
      this._inputNode.value = newValue;
    }
  }
}
