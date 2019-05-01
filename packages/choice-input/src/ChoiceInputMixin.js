/* eslint-disable class-methods-use-this */

import { html, css, nothing } from '@lion/core';
import { FormatMixin } from '@lion/field';

export const ChoiceInputMixin = superclass =>
  // eslint-disable-next-line
  class ChoiceInputMixin extends FormatMixin(superclass) {
    get delegations() {
      return {
        ...super.delegations,
        target: () => this.inputElement,
        properties: [...super.delegations.properties, 'checked'],
        attributes: [...super.delegations.attributes, 'checked'],
      };
    }

    get events() {
      return {
        ...super.events,
        _toggleChecked: [() => this, 'user-input-changed'],
      };
    }

    _requestUpdate(name, oldValue) {
      super._requestUpdate(name, oldValue);
      if (name === 'modelValue' && typeof oldValue !== 'undefined') {
        this._syncModelValueToChecked({
          modelValue: {
            value: oldValue.value,
            checked: oldValue.checked,
          },
        });
      }
    }

    updated(changedProperties) {
      super.updated(changedProperties);
      if (changedProperties.has('modelValue')) {
        this._reflectCheckedToCssClass();
      }
    }

    get choiceChecked() {
      return this.modelValue.checked;
    }

    set choiceChecked(checked) {
      if (this.modelValue.checked !== checked) {
        this.modelValue = { value: this.modelValue.value, checked };
      }
    }

    get choiceValue() {
      return this.modelValue.value;
    }

    set choiceValue(value) {
      if (this.modelValue.value !== value) {
        this.modelValue = { value, checked: this.modelValue.checked };
      }
    }

    constructor() {
      super();
      this.modelValue = { value: '', checked: false };
    }

    /**
     * @override
     * Override InteractionStateMixin
     * 'prefilled' should be false when modelValue is { checked: false }, which would return
     * true in original method (since non-empty objects are considered prefilled by default).
     */
    static _isPrefilled(modelValue) {
      return modelValue.checked;
    }

    static get styles() {
      return [
        css`
          :host {
            display: flex;
          }

          .choice-field__graphic-container {
            display: none;
          }
        `,
      ];
    }

    render() {
      return html`
        <slot name="input"></slot>
        <div class="choice-field__graphic-container">
          ${this.choiceGraphicTemplate()}
        </div>
        <div class="choice-field__label">
          <slot name="label"></slot>
        </div>
      `;
    }

    choiceGraphicTemplate() {
      return nothing;
    }

    connectedCallback() {
      if (super.connectedCallback) super.connectedCallback();
      this._reflectCheckedToCssClass();
    }

    _toggleChecked() {
      this.choiceChecked = !this.choiceChecked;
    }

    _syncModelValueToChecked({ modelValue }) {
      this.checked = !!modelValue.checked;
    }

    /**
     * @override
     * This method is overridden from FormatMixin. It originally fired the normalizing
     * 'user-input-changed' event after listening to the native 'input' event.
     * However on Chrome on Mac whenever you use the keyboard
     * it fires the input AND change event. Other Browsers only fires the change event.
     * Therefore we disable the input event here.
     */
    _proxyInputEvent() {}

    /**
     * @override
     * Override FormatMixin default dispatching of model-value-changed as it only does a simple
     * comparision which is not enough in js because
     * { value: 'foo', checked: true } !== { value: 'foo', checked: true }
     * We do our own "deep" comparision.
     *
     * @param {object} modelValue
     * @param {object} modelValue the old one
     */
    // TODO: consider making a generic option inside FormatMixin for deep object comparisons when
    // modelValue is an object
    _dispatchModelValueChangedEvent({ modelValue }, { modelValue: old }) {
      let changed = true;
      if (old) {
        changed = modelValue.value !== old.value || modelValue.checked !== old.checked;
      }
      if (changed) {
        this.dispatchEvent(
          new CustomEvent('model-value-changed', { bubbles: true, composed: true }),
        );
      }
    }

    _reflectCheckedToCssClass() {
      this.classList[this.choiceChecked ? 'add' : 'remove']('state-checked');
    }

    /**
     * @override
     * Overridden from FormatMixin, since a different modelValue is used for choice inputs.
     * Sets modelValue based on checked state (instead of value), so that changes will be detected.
     */
    parser() {
      return this.modelValue;
    }

    /**
     * @override
     * Overridden from FormatMixin, since a different modelValue is used for choice inputs.
     */
    formatter(modelValue) {
      return modelValue && modelValue.value !== undefined ? modelValue.value : modelValue;
    }

    /**
     * @override
     * Overridden from ValidateMixin, since a different modelValue is used for choice inputs.
     */
    __isRequired(modelValue) {
      return {
        required: !!modelValue.checked,
      };
    }
  };
