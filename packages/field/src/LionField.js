import { DelegateMixin, SlotMixin, LitElement } from '@lion/core';
import { ElementMixin } from '@lion/core/src/ElementMixin.js';
import { DisabledMixin } from '@lion/core/src/DisabledMixin.js';
import { ObserverMixin } from '@lion/core/src/ObserverMixin.js';
import { ValidateMixin } from '@lion/validate';
import { FormControlMixin } from './FormControlMixin.js';
import { InteractionStateMixin } from './InteractionStateMixin.js'; // applies FocusMixin
import { FormatMixin } from './FormatMixin.js';
import { FocusMixin } from './FocusMixin.js';

/* eslint-disable wc/guard-super-call */

// TODO:
// - Consider exporting as FieldMixin
// - Add submitted prop to InteractionStateMixin
// - Find a better way to do value delegation via attr

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
 * @customElement
 */
export class LionField extends FormControlMixin(
  InteractionStateMixin(
    FocusMixin(
      FormatMixin(
        ValidateMixin(
          DisabledMixin(ElementMixin(DelegateMixin(SlotMixin(ObserverMixin(LitElement))))),
        ),
      ),
    ),
  ),
) {
  get delegations() {
    return {
      ...super.delegations,
      target: () => this.inputElement,
      properties: [
        ...super.delegations.properties,
        'name',
        'type',
        'selectionStart',
        'selectionEnd',
      ],
      attributes: [...super.delegations.attributes, 'name', 'type'],
    };
  }

  static get properties() {
    return {
      submitted: {
        // make sure validation can be triggered based on observer
        type: Boolean,
      },
    };
  }

  // We don't delegate, because we want to preserve caret position via _setValueAndPreserveCaret
  set value(value) {
    // if not yet connected to dom can't change the value
    if (this.inputElement) {
      this._setValueAndPreserveCaret(value);
    }
    this._onValueChanged({ value });
  }

  get value() {
    return (this.inputElement && this.inputElement.value) || '';
  }

  connectedCallback() {
    super.connectedCallback();

    this._onChange = this._onChange.bind(this);
    this.inputElement.addEventListener('change', this._onChange);
    this._delegateInitialValueAttr();
    this.classList.add('form-field'); // eslint-disable-line
  }

  disconnectedCallback() {
    super.disconnectedCallback();

    if (this.__parentFormGroup) {
      const event = new CustomEvent('form-element-unregister', {
        detail: { element: this },
        bubbles: true,
      });
      this.__parentFormGroup.dispatchEvent(event);
    }
    this.inputElement.removeEventListener('change', this._onChange);
  }

  updated(changedProps) {
    super.updated(changedProps);

    if (changedProps.has('disabled')) {
      if (this.disabled) {
        this.inputElement.disabled = true;
        this.classList.add('state-disabled'); // eslint-disable-line wc/no-self-class
      } else {
        this.inputElement.disabled = false;
        this.classList.remove('state-disabled'); // eslint-disable-line wc/no-self-class
      }
    }
  }

  /**
   * This is not done via 'get delegations', because this.inputElement.setAttribute('value')
   * does not trigger a value change
   */
  _delegateInitialValueAttr() {
    const valueAttr = this.getAttribute('value');
    if (valueAttr !== null) {
      this.value = valueAttr;
    }
  }

  resetInteractionState() {
    if (super.resetInteractionState) {
      super.resetInteractionState();
    }
    this.submitted = false;
  }

  clear() {
    if (super.clear) {
      // Let validationMixin and interactionStateMixin clear their
      // invalid and dirty/touched states respectively
      super.clear();
    }
    this.value = ''; // can't set null here, because IE11 treats it as a string
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

  _onValueChanged({ value }) {
    if (super._onValueChanged) {
      super._onValueChanged();
    }
    // For styling purposes, make it known the input field is not empty
    this.classList[value ? 'add' : 'remove']('state-filled');
  }

  /**
   * Copied from Polymer team. TODO: add license
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
        const start = this.inputElement.selectionStart;
        this.inputElement.value = newValue;
        // The cursor automatically jumps to the end after re-setting the value,
        // so restore it to its original position.
        this.inputElement.selectionStart = start;
        this.inputElement.selectionEnd = start;
      } catch (error) {
        // Just set the value and give up on the caret.
        this.inputElement.value = newValue;
      }
    } else {
      this.inputElement.value = newValue;
    }
  }

  // eslint-disable-next-line class-methods-use-this
  __isRequired(modelValue) {
    return {
      required:
        (typeof modelValue === 'string' && modelValue !== '') ||
        (typeof modelValue !== 'string' && typeof modelValue !== 'undefined'), // TODO: && modelValue !== null ?
    };
  }
}
