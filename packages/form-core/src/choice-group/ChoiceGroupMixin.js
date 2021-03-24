import { dedupeMixin } from '@lion/core';
import { FormRegistrarMixin } from '../registration/FormRegistrarMixin.js';
import { InteractionStateMixin } from '../InteractionStateMixin.js';

/**
 * @typedef {import('../../types/choice-group/ChoiceGroupMixinTypes').ChoiceGroupMixin} ChoiceGroupMixin
 * @typedef {import('../../types/FormControlMixinTypes').FormControlHost} FormControlHost
 * @typedef {import('../../types/registration/FormRegistrarMixinTypes').ElementWithParentFormGroup} ElementWithParentFormGroup
 * @typedef {FormControlHost & HTMLElement & {_parentFormGroup?:HTMLElement, checked?:boolean}} FormControl
 * @typedef {import('../../types/choice-group/ChoiceInputMixinTypes').ChoiceInputHost} ChoiceInputHost
 */

/**
 * @type {ChoiceGroupMixin}
 * @param {import('@open-wc/dedupe-mixin').Constructor<import('@lion/core').LitElement>} superclass
 */
const ChoiceGroupMixinImplementation = superclass =>
  class ChoiceGroupMixin extends FormRegistrarMixin(InteractionStateMixin(superclass)) {
    /** @type {any} */
    static get properties() {
      return {
        /**
         * @desc When false (default), modelValue and serializedValue will reflect the
         * currently selected choice (usually a string). When true, modelValue will and
         * serializedValue will be an array of strings.
         */
        multipleChoice: {
          type: Boolean,
          attribute: 'multiple-choice',
        },
      };
    }

    get modelValue() {
      const elems = this._getCheckedElements();
      if (this.multipleChoice) {
        return elems.map(el => el.choiceValue);
      }
      return elems[0] ? elems[0].choiceValue : '';
    }

    set modelValue(value) {
      /**
       * @param {ChoiceInputHost} el
       * @param {any} val
       */
      const checkCondition = (el, val) => {
        if (typeof el.choiceValue === 'object') {
          return JSON.stringify(el.choiceValue) === JSON.stringify(value);
        }
        return el.choiceValue === val;
      };

      if (this.__isInitialModelValue) {
        this.__isInitialModelValue = false;
        this.registrationComplete.then(() => {
          this._setCheckedElements(value, checkCondition);
          this.requestUpdate('modelValue', this.__oldModelValue);
        });
      } else {
        this._setCheckedElements(value, checkCondition);
        this.requestUpdate('modelValue', this.__oldModelValue);
      }
      this.__oldModelValue = this.modelValue;
    }

    get serializedValue() {
      // We want to filter out disabled values out by default:
      // The goal of serializing values could either be submitting state to a backend
      // ot storing state in a backend. For this, only values that are entered by the end
      // user are relevant, choice values are always defined by the Application Developer
      // and known by the backend.

      // Assuming values are always defined as strings, modelValues and serializedValues
      // are the same.
      const elems = this._getCheckedElements();
      if (this.multipleChoice) {
        return elems.map(el => el.serializedValue.value);
      }
      return elems[0] ? elems[0].serializedValue.value : '';
    }

    set serializedValue(value) {
      /**
       * @param {ChoiceInputHost} el
       * @param {string} val
       */
      const checkCondition = (el, val) => el.serializedValue.value === val;

      if (this.__isInitialSerializedValue) {
        this.__isInitialSerializedValue = false;
        this.registrationComplete.then(() => {
          this._setCheckedElements(value, checkCondition);
          this.requestUpdate('serializedValue');
        });
      } else {
        this._setCheckedElements(value, checkCondition);
        this.requestUpdate('serializedValue');
      }
    }

    get formattedValue() {
      const elems = this._getCheckedElements();
      if (this.multipleChoice) {
        return elems.map(el => el.formattedValue);
      }
      return elems[0] ? elems[0].formattedValue : '';
    }

    set formattedValue(value) {
      /**
       * @param {{ formattedValue: string }} el
       * @param {string} val
       */
      const checkCondition = (el, val) => el.formattedValue === val;

      if (this.__isInitialFormattedValue) {
        this.__isInitialFormattedValue = false;
        this.registrationComplete.then(() => {
          this._setCheckedElements(value, checkCondition);
        });
      } else {
        this._setCheckedElements(value, checkCondition);
      }
    }

    constructor() {
      super();
      this.multipleChoice = false;
      /** @type {'child'|'choice-group'|'fieldset'} */
      this._repropagationRole = 'choice-group'; // configures event propagation logic of FormControlMixin

      this.__isInitialModelValue = true;
      this.__isInitialSerializedValue = true;
      this.__isInitialFormattedValue = true;
      /** @type {Promise<any> & {done?:boolean}} */
      this.registrationComplete = new Promise((resolve, reject) => {
        this.__resolveRegistrationComplete = resolve;
        this.__rejectRegistrationComplete = reject;
      });
      this.registrationComplete.done = false;
      this.registrationComplete.then(
        () => {
          this.registrationComplete.done = true;
        },
        () => {
          this.registrationComplete.done = true;
          throw new Error(
            'Registration could not finish. Please use await el.registrationComplete;',
          );
        },
      );
    }

    connectedCallback() {
      super.connectedCallback();
      // Double microtask queue to account for Webkit race condition
      Promise.resolve().then(() =>
        Promise.resolve().then(() => this.__resolveRegistrationComplete()),
      );

      this.registrationComplete.then(() => {
        this.__isInitialModelValue = false;
        this.__isInitialSerializedValue = false;
        this.__isInitialFormattedValue = false;
      });
    }

    /** @param {import('@lion/core').PropertyValues} changedProperties */
    updated(changedProperties) {
      super.updated(changedProperties);
      if (changedProperties.has('name') && this.name !== changedProperties.get('name')) {
        this.formElements.forEach(child => {
          // eslint-disable-next-line no-param-reassign
          child.name = this.name;
        });
      }
    }

    disconnectedCallback() {
      super.disconnectedCallback();

      if (this.registrationComplete.done === false) {
        Promise.resolve().then(() => {
          Promise.resolve().then(() => {
            this.__rejectRegistrationComplete();
          });
        });
      }
    }

    /**
     * @override from FormRegistrarMixin
     * @param {FormControl} child
     * @param {number} indexToInsertAt
     */
    addFormElement(child, indexToInsertAt) {
      this._throwWhenInvalidChildModelValue(child);
      // eslint-disable-next-line no-param-reassign
      child.name = this.name;
      super.addFormElement(child, indexToInsertAt);
    }

    /**
     * @override from FormControlMixin
     */
    _triggerInitialModelValueChangedEvent() {
      this.registrationComplete.then(() => {
        this.__dispatchInitialModelValueChangedEvent();
      });
    }

    /**
     * @override
     * @param {string} property
     */
    _getFromAllFormElements(property, filterCondition = () => true) {
      // For modelValue, serializedValue and formattedValue, an exception should be made,
      // The reset can be requested from children
      if (
        property === 'modelValue' ||
        property === 'serializedValue' ||
        property === 'formattedValue'
      ) {
        return this[property];
      }
      return this.formElements.filter(filterCondition).map(el => el.property);
    }

    /**
     * @param {FormControl} child
     */
    _throwWhenInvalidChildModelValue(child) {
      if (
        // @ts-expect-error
        typeof child.modelValue.checked !== 'boolean' ||
        !Object.prototype.hasOwnProperty.call(child.modelValue, 'value')
      ) {
        throw new Error(
          `The ${this.tagName.toLowerCase()} name="${
            this.name
          }" does not allow to register ${child.tagName.toLowerCase()} with .modelValue="${
            child.modelValue
          }" - The modelValue should represent an Object { value: "foo", checked: false }`,
        );
      }
    }

    _isEmpty() {
      if (this.multipleChoice) {
        return this.modelValue.length === 0;
      }

      if (typeof this.modelValue === 'string' && this.modelValue === '') {
        return true;
      }
      if (this.modelValue === undefined || this.modelValue === null) {
        return true;
      }
      return false;
    }

    /**
     * @param {CustomEvent & {target:FormControl}} ev
     */
    _checkSingleChoiceElements(ev) {
      const { target } = ev;
      if (target.checked === false) return;

      const groupName = target.name;
      this.formElements
        .filter(i => i.name === groupName)
        .forEach(choice => {
          if (choice !== target) {
            choice.checked = false; // eslint-disable-line no-param-reassign
          }
        });
      // this.__triggerCheckedValueChanged();
    }

    _getCheckedElements() {
      // We want to filter out disabled values by default
      return this.formElements.filter(el => el.checked && !el.disabled);
    }

    /**
     * @param {string | any[]} value
     * @param {Function} check
     */
    _setCheckedElements(value, check) {
      for (let i = 0; i < this.formElements.length; i += 1) {
        if (this.multipleChoice) {
          let valueIsIncluded = value.includes(this.formElements[i].modelValue.value);

          // For complex values, do a JSON Stringified includes check, because [{ v: 'foo'}].includes({ v: 'foo' }) => false
          if (typeof this.formElements[i].modelValue.value === 'object') {
            valueIsIncluded = /** @type {any[]} */ (value)
              .map(/** @param {Object} v */ v => JSON.stringify(v))
              .includes(JSON.stringify(this.formElements[i].modelValue.value));
          }

          this.formElements[i].checked = valueIsIncluded;
        } else if (check(this.formElements[i], value)) {
          // Allows checking against custom values e.g. formattedValue or serializedValue
          this.formElements[i].checked = true;
        } else {
          this.formElements[i].checked = false;
        }
      }
    }

    __setChoiceGroupTouched() {
      const value = this.modelValue;
      if (value != null && value !== this.__previousCheckedValue) {
        // TODO: what happens here exactly? Needs to be based on user interaction (?)
        this.touched = true;
        this.__previousCheckedValue = value;
      }
    }

    /**
     * @override FormControlMixin
     * @param {CustomEvent} ev
     */
    _onBeforeRepropagateChildrenValues(ev) {
      // Normalize target, since we might receive 'portal events' (from children in a modal,
      // see select-rich)
      const target = (ev.detail && ev.detail.element) || ev.target;
      if (this.multipleChoice || !target.checked) {
        return;
      }
      this.formElements.forEach(option => {
        if (target.choiceValue !== option.choiceValue) {
          option.checked = false; // eslint-disable-line no-param-reassign
        }
      });
      this.__setChoiceGroupTouched();
      this.requestUpdate('modelValue', this.__oldModelValue);
      this.__oldModelValue = this.modelValue;
    }
  };

export const ChoiceGroupMixin = dedupeMixin(ChoiceGroupMixinImplementation);
