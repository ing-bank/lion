/* eslint-disable class-methods-use-this */

import { css, html, nothing } from 'lit';
import { dedupeMixin } from '@lion/components/core.js';
import { FormatMixin } from '../FormatMixin.js';

/**
 * @typedef {import('../../types/FormControlMixinTypes').FormControlHost} FormControlHost
 * @typedef {FormControlHost & HTMLElement & {_parentFormGroup?:HTMLElement, checked?:boolean}} FormControl
 * @typedef {import('../../types/choice-group/ChoiceInputMixinTypes').ChoiceInputMixin} ChoiceInputMixin
 * @typedef {import('../../types/choice-group/ChoiceInputMixinTypes').ChoiceInputModelValue} ChoiceInputModelValue
 */

/**
 * @param {ChoiceInputModelValue} nw\
 * @param {{value?:any, checked?:boolean}} old
 */
const hasChanged = (nw, old = {}) => nw.value !== old.value || nw.checked !== old.checked;

/**
 * @type {ChoiceInputMixin}
 * @param {import('@open-wc/dedupe-mixin').Constructor<import('@lion/core').LitElement>} superclass
 */
const ChoiceInputMixinImplementation = superclass =>
  // @ts-ignore https://github.com/microsoft/TypeScript/issues/36821#issuecomment-588375051
  class ChoiceInputMixin extends FormatMixin(superclass) {
    /** @type {any} */
    static get properties() {
      return {
        checked: { type: Boolean, reflect: true },
        disabled: { type: Boolean, reflect: true },
        modelValue: { type: Object, hasChanged },
        choiceValue: { type: Object },
      };
    }

    /**
     * The value that will be registered to the modelValue of the parent ChoiceGroup. Recommended
     * to be a string
     * @type {string|any}
     */
    get choiceValue() {
      return this.modelValue.value;
    }

    set choiceValue(value) {
      this.requestUpdate('choiceValue', this.choiceValue);
      if (this.modelValue.value !== value) {
        /** @type {ChoiceInputModelValue} */
        this.modelValue = { value, checked: this.modelValue.checked };
      }
    }

    /**
     * @param {string} name
     * @param {any} oldValue
     */
    requestUpdate(name, oldValue) {
      super.requestUpdate(name, oldValue);

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

    /**
     * @param {import('@lion/core').PropertyValues } changedProperties
     */
    firstUpdated(changedProperties) {
      super.firstUpdated(changedProperties);
      if (changedProperties.has('checked')) {
        // Here we set the initial value for our [slot=input] content,
        // which has been set by our SlotMixin
        this.__syncCheckedToInputElement();
      }
    }

    /**
     * @param {import('@lion/core').PropertyValues } changedProperties
     */
    updated(changedProperties) {
      super.updated(changedProperties);
      if (changedProperties.has('modelValue')) {
        this.__syncCheckedToInputElement();
      }

      if (
        changedProperties.has('name') &&
        this._parentFormGroup &&
        this._parentFormGroup.name !== this.name
      ) {
        this._syncNameToParentFormGroup();
      }
    }

    constructor() {
      super();
      /**
       * Boolean indicating whether or not this element is checked by the end user.
       */
      // TODO: [v1] this can be solved when property effects are scheduled until firstUpdated
      // this.checked = false;
      /**
       * Whereas 'normal' `.modelValue`s usually store a complex/typed version
       * of a view value, choice inputs have a slightly different approach.
       * In order to remain their Single Source of Truth characteristic, choice inputs
       * store both the value and 'checkedness', in the format { value: 'x', checked: true }
       * Different from the platform, this also allows to serialize the 'non checkedness',
       * allowing to restore form state easily and inform the server about unchecked options.
       * @type {{value:string|any,checked:boolean}}
       */
      this.modelValue = { value: '', checked: false };
      // TODO: maybe disabled is more a concern of FormControl/Field?
      /**
       * Boolean indicating whether or not this element is disabled.
       * @type {boolean}
       */
      this.disabled = false;

      /**
       * The value property of the modelValue. It provides an easy interface for storing
       * (complex) values in the modelValue
       */

      /** @protected */
      this._preventDuplicateLabelClick = this._preventDuplicateLabelClick.bind(this);
      /** @protected */
      this._toggleChecked = this._toggleChecked.bind(this);
    }

    /**
     * Styles for [input=radio] and [input=checkbox] wrappers.
     * For [role=option] extensions, please override completely
     */
    static get styles() {
      return [
        ...(super.styles || []),
        css`
          :host {
            display: flex;
            flex-wrap: wrap;
          }

          :host([hidden]) {
            display: none;
          }

          .choice-field__graphic-container {
            display: none;
          }
          .choice-field__help-text {
            display: block;
            flex-basis: 100%;
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
        <div class="choice-field__graphic-container">${this._choiceGraphicTemplate()}</div>
        <div class="choice-field__label">
          <slot name="label"></slot>
        </div>
        <small class="choice-field__help-text">
          <slot name="help-text"></slot>
        </small>
        ${this._afterTemplate()}
      `;
    }

    /**
     * @protected
     */
    _choiceGraphicTemplate() {
      return nothing;
    }

    /**
     * @protected
     */
    _afterTemplate() {
      return nothing;
    }

    connectedCallback() {
      super.connectedCallback();
      if (this._labelNode) {
        this._labelNode.addEventListener('click', this._preventDuplicateLabelClick);
      }
      this.addEventListener('user-input-changed', this._toggleChecked);
    }

    disconnectedCallback() {
      super.disconnectedCallback();
      if (this._labelNode) {
        this._labelNode.removeEventListener('click', this._preventDuplicateLabelClick);
      }
      this.removeEventListener('user-input-changed', this._toggleChecked);
    }

    /**
     * The native platform fires an event for both the click on the label, and also
     * the redispatched click on the native input element.
     * This results in two click events arriving at the host, but we only want one.
     * This method prevents the duplicate click and ensures the correct isTrusted event
     * with the correct event.target arrives at the host.
     * @param {Event} ev
     * @protected
     */
    // eslint-disable-next-line no-unused-vars
    _preventDuplicateLabelClick(ev) {
      const __inputClickHandler = /** @param {Event} _ev */ _ev => {
        _ev.stopImmediatePropagation();
        this._inputNode.removeEventListener('click', __inputClickHandler);
      };
      this._inputNode.addEventListener('click', __inputClickHandler);
    }

    /**
     * @param {Event} ev
     * @protected
     */
    // eslint-disable-next-line no-unused-vars
    _toggleChecked(ev) {
      if (this.disabled) {
        return;
      }
      this._isHandlingUserInput = true;
      this.checked = !this.checked;
      this._isHandlingUserInput = false;
    }

    // TODO: make this less fuzzy by applying these methods in LionRadio and LionCheckbox
    // via instanceof (or feat. detection for tree-shaking in case parentGroup not needed)
    /**
     * Override this in case of extending ChoiceInputMixin and requiring
     * to sync differently with parent form group name
     * Right now it checks tag name match where the parent form group tagname
     * should include the child field tagname ('checkbox' is included in 'checkbox-group')
     * @protected
     */
    _syncNameToParentFormGroup() {
      // @ts-expect-error [external]: tagName should be a prop of HTMLElement
      if (this._parentFormGroup.tagName.includes(this.tagName)) {
        this.name = this._parentFormGroup?.name || '';
      }
    }

    /**
     * @param {boolean} checked
     * @private
     */
    __syncModelCheckedToChecked(checked) {
      this.checked = checked;
    }

    /**
     * @param {any} checked
     * @private
     */
    __syncCheckedToModel(checked) {
      this.modelValue = { value: this.choiceValue, checked };
    }

    /**
     * @private
     */
    __syncCheckedToInputElement() {
      // ._inputNode might not be available yet(slot content)
      // or at all (no reliance on platform construct, in case of [role=option])
      if (this._inputNode) {
        /** @type {HTMLInputElement} */
        (this._inputNode).checked = this.checked;
      }
    }

    /**
     * @override
     * This method is overridden from FormatMixin. It originally fired the normalizing
     * 'user-input-changed' event after listening to the native 'input' event.
     * However on Chrome on Mac whenever you use the keyboard
     * it fires the input AND change event. Other Browsers only fires the change event.
     * Therefore we disable the input event here.
     * @protected
     */
    _proxyInputEvent() {}

    /**
     * @override
     * hasChanged is designed for async (updated) callback, also check for sync
     * (requestUpdate) callback
     * @param {{ modelValue:unknown }} newV
     * @param {{ modelValue:unknown }} [old]
     * @protected
     */
    _onModelValueChanged({ modelValue }, old) {
      let _old;
      if (old && old.modelValue) {
        _old = old.modelValue;
      }
      // @ts-expect-error [external]: lit private property
      if (this.constructor.elementProperties.get('modelValue').hasChanged(modelValue, _old)) {
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
     * @override Overridden from FormatMixin, since a different modelValue is used for choice inputs.
     * @param {ChoiceInputModelValue } modelValue
     */
    formatter(modelValue) {
      return modelValue && modelValue.value !== undefined ? modelValue.value : modelValue;
    }

    /**
     * @override
     * Overridden from LionField, since the modelValue should not be cleared.
     */
    // @ts-expect-error FIXME: @override gives error because LionField is not superclass type, this mixin should only allow LionField extensions
    clear() {
      this.checked = false;
    }

    /**
     * Used for required validator.
     * @protected
     */
    _isEmpty() {
      return !this.checked;
    }

    /**
     * @override
     * Overridden from FormatMixin, since a different modelValue is used for choice inputs.
     * Synchronization from user input is already arranged in this Mixin.
     * @protected
     */
    _syncValueUpwards() {}
  };

export const ChoiceInputMixin = dedupeMixin(ChoiceInputMixinImplementation);
