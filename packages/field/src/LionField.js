import { DelegateMixin, SlotMixin } from '@lion/core';
import { LionLitElement } from '@lion/core/src/LionLitElement.js';
import { ElementMixin } from '@lion/core/src/ElementMixin.js';
import { CssClassMixin } from '@lion/core/src/CssClassMixin.js';
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
  InteractionStateMixin(
    FormatMixin(
      ValidateMixin(
        CssClassMixin(ElementMixin(DelegateMixin(SlotMixin(ObserverMixin(LionLitElement))))),
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
    this._onChange = this._onChange.bind(this);
    this.inputElement.addEventListener('change', this._onChange);
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
    this.inputElement.removeEventListener('change', this._onChange);
  }

  /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
    Public Methods (also notice delegated methods that are available on host)  */

  clear() {
    // Let validationMixin and interactionStateMixin clear their invalid and dirty/touched states
    // respectively
    if (super.clear) super.clear();
    this.value = ''; // can't set null here, because IE11 treats it as a string
  }

  // eslint-disable-next-line class-methods-use-this
  __isRequired(modelValue) {
    return {
      required:
        (typeof modelValue === 'string' && modelValue !== '') ||
        (typeof modelValue !== 'string' && modelValue !== undefined), // TODO: && modelValue !== null ?
    };
  }
}
