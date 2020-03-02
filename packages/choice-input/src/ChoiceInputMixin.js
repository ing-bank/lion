/* eslint-disable class-methods-use-this */

import { html, css, nothing } from '@lion/core';
import { FormatMixin } from '@lion/field';

export const ChoiceInputMixin = superclass =>
  // eslint-disable-next-line
  class ChoiceInputMixin extends FormatMixin(superclass) {
    static get properties() {
      return {
        /**
         * Boolean indicating whether or not this element is checked by the end user.
         */
        checked: {
          type: Boolean,
          reflect: true,
        },
        /**
         * Whereas 'normal' `.modelValue`s usually store a complex/typed version
         * of a view value, choice inputs have a slightly different approach.
         * In order to remain their Single Source of Truth characteristic, choice inputs
         * store both the value and 'checkedness', in the format { value: 'x', checked: true }
         * Different from the platform, this also allows to serialize the 'non checkedness',
         * allowing to restore form state easily and inform the server about unchecked options.
         */
        modelValue: {
          type: Object,
          hasChanged: (nw, old = {}) => nw.value !== old.value || nw.checked !== old.checked,
        },
        /**
         * The value property of the modelValue. It provides an easy interface for storing
         * (complex) values in the modelValue
         */
        choiceValue: {
          type: Object,
        },
      };
    }

    get choiceValue() {
      return this.modelValue.value;
    }

    set choiceValue(value) {
      this.requestUpdate('choiceValue', this.choiceValue);
      if (this.modelValue.value !== value) {
        this.modelValue = { value, checked: this.modelValue.checked };
      }
    }

    _requestUpdate(name, oldValue) {
      super._requestUpdate(name, oldValue);

      if (name === 'modelValue') {
        if (this.modelValue.checked !== this.checked) {
          this.__syncModelCheckedToChecked(this.modelValue.checked);
        }
      } else if (name === 'checked') {
        if (this.modelValue.checked !== this.checked) {
          this.__syncCheckedToModel(this.checked);
        }
      }
    }

    firstUpdated(c) {
      super.firstUpdated(c);
      if (c.has('checked')) {
        // Here we set the initial value for our [slot=input] content,
        // which has been set by our SlotMixin
        this.__syncCheckedToInputElement();
      }
    }

    updated(c) {
      super.updated(c);
      if (c.has('modelValue')) {
        this.__syncCheckedToInputElement();
      }
    }

    constructor() {
      super();
      this.modelValue = { value: '', checked: false };
    }

    /**
     * Styles for [input=radio] and [input=checkbox] wrappers.
     * For [role=option] extensions, please override completely
     */
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

    /**
     * Template for [input=radio] and [input=checkbox] wrappers.
     * For [role=option] extensions, please override completely
     */
    render() {
      return html`
        <slot name="input"></slot>
        <div class="choice-field__graphic-container">
          ${this._choiceGraphicTemplate()}
        </div>
        <div class="choice-field__label">
          <slot name="label"></slot>
        </div>
      `;
    }

    _choiceGraphicTemplate() {
      return nothing;
    }

    connectedCallback() {
      super.connectedCallback();
      this.addEventListener('user-input-changed', this.__toggleChecked);
    }

    disconnectedCallback() {
      super.disconnectedCallback();
      this.removeEventListener('user-input-changed', this.__toggleChecked);
    }

    __toggleChecked() {
      this.checked = !this.checked;
    }

    __syncModelCheckedToChecked(checked) {
      this.checked = checked;
    }

    __syncCheckedToModel(checked) {
      this.modelValue = { value: this.choiceValue, checked };
    }

    __syncCheckedToInputElement() {
      // ._inputNode might not be available yet(slot content)
      // or at all (no reliance on platform construct, in case of [role=option])
      if (this._inputNode) {
        this._inputNode.checked = this.checked;
      }
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
     * hasChanged is designed for async (updated) callback, also check for sync
     * (_requestUpdate) callback
     */
    _onModelValueChanged({ modelValue }, { modelValue: old }) {
      if (this.constructor._classProperties.get('modelValue').hasChanged(modelValue, old)) {
        super._onModelValueChanged({ modelValue });
      }
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
     * Used for required validator.
     */
    _isEmpty() {
      return !this.checked;
    }

    /**
     * @override
     * Overridden from FormatMixin, since a different modelValue is used for choice inputs.
     * Synchronization from user input is already arranged in this Mixin.
     */
    _syncValueUpwards() {}
  };
