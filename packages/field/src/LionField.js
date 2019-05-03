import { DelegateMixin, SlotMixin } from '@lion/core';
import { LionLitElement } from '@lion/core/src/LionLitElement.js';
import { ElementMixin } from '@lion/core/src/ElementMixin.js';
import { EventMixin } from '@lion/core/src/EventMixin.js';
import { ObserverMixin } from '@lion/core/src/ObserverMixin.js';
import { ValidateMixin } from '@lion/validate';

import { FormControlMixin } from './FormControlMixin.js';
import { InteractionStateMixin } from './InteractionStateMixin.js'; // applies FocusMixin
import { FormatMixin } from './FormatMixin.js';

/**
 * LionField: wraps components input, textarea and select and potentially others
 * (checkbox group, radio group)
 * Also it would follow a nice hierarchy: lion-form -> lion-fieldset -> lion-field
 *
 * <lion-field name="myName">
 *   <label slot="label">My Input</label>
 *   <input type="text" slot="input">
 * </lion-field>
 *
 * Note: We do not support placeholders, because we have a helper text and
 * placeholders confuse the user with accessibility needs.
 *
 * @customElement
 */

// TODO: Consider exporting as FieldMixin
// eslint-disable-next-line max-len, no-unused-vars
export class LionField extends FormControlMixin(
  ValidateMixin(
    InteractionStateMixin(
      FormatMixin(
        EventMixin(ElementMixin(DelegateMixin(SlotMixin(ObserverMixin(LionLitElement))))),
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
        'disabled',
        'selectionStart',
        'selectionEnd',
      ],
      attributes: [...super.delegations.attributes, 'name', 'type', 'disabled'],
    };
  }

  get events() {
    return {
      ...super.events,
      _onChange: [() => this.inputElement, 'change'],
    };
  }

  static get properties() {
    return {
      ...super.properties,
      submitted: {
        // make sure validation can be triggered based on observer
        type: Boolean,
      },
    };
  }

  static get asyncObservers() {
    return {
      ...super.asyncObservers,
      _setDisabledClass: ['disabled'],
    };
  }

  // We don't delegate, because we want to 'preprocess' via _setValueAndPreserveCaret
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

  _setDisabledClass() {
    this.classList[this.disabled ? 'add' : 'remove']('state-disabled');
  }

  resetInteractionState() {
    if (super.resetInteractionState) super.resetInteractionState();
    // TODO: add submitted prop to InteractionStateMixin ?
    this.submitted = false;
  }

  /* * * * * * * *
    Lifecycle  */
  connectedCallback() {
    super.connectedCallback();
    this._delegateInitialValueAttr(); // TODO: find a better way to do this
    this._setDisabledClass();
    this.classList.add('form-field');
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

  /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
    Public Methods (also notice delegated methods that are available on host)  */

  clear() {
    // Let validationMixin and interactionStateMixin clear their invalid and dirty/touched states
    // respectively
    if (super.clear) super.clear();
    this.value = ''; // can't set null here, because IE11 treats it as a string
  }

  /* * * * * * * * * *
    Event Handlers */

  _onChange() {
    if (super._onChange) super._onChange();
    this.dispatchEvent(
      new CustomEvent('user-input-changed', {
        bubbles: true,
      }),
    );
    this.modelValue = this.parser(this.value);
  }

  /* * * * * * * * * * * *
    Observer Handlers  */
  _onValueChanged({ value }) {
    if (super._onValueChanged) super._onValueChanged();
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
