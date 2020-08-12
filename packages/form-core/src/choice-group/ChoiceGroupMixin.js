import { dedupeMixin } from '@lion/core';
import { FormRegistrarMixin } from '../registration/FormRegistrarMixin.js';
import { InteractionStateMixin } from '../InteractionStateMixin.js';

export const ChoiceGroupMixin = dedupeMixin(
  superclass =>
    // eslint-disable-next-line
    class ChoiceGroupMixin extends FormRegistrarMixin(InteractionStateMixin(superclass)) {
      static get properties() {
        return {
          /**
           * @desc When false (default), modelValue and serializedValue will reflect the
           * currently selected choice (usually a string). When true, modelValue will and
           * serializedValue will be an array of strings.
           * @type {boolean}
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
          return elems.map(el => el.modelValue.value);
        }
        return elems[0] ? elems[0].modelValue.value : '';
      }

      set modelValue(value) {
        if (this.__isInitialModelValue) {
          this.__isInitialModelValue = false;
          this.registrationComplete.then(() => {
            this._setCheckedElements(value, (el, val) => el.modelValue.value === val);
          });
        } else {
          this._setCheckedElements(value, (el, val) => el.modelValue.value === val);
        }
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
        if (this.__isInitialSerializedValue) {
          this.__isInitialSerializedValue = false;
          this.registrationComplete.then(() => {
            this._setCheckedElements(value, (el, val) => el.serializedValue.value === val);
          });
        } else {
          this._setCheckedElements(value, (el, val) => el.serializedValue.value === val);
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
        if (this.__isInitialFormattedValue) {
          this.__isInitialFormattedValue = false;
          this.registrationComplete.then(() => {
            this._setCheckedElements(value, (el, val) => el.formattedValue === val);
          });
        } else {
          this._setCheckedElements(value, (el, val) => el.formattedValue === val);
        }
      }

      constructor() {
        super();
        this.multipleChoice = false;
        this._repropagationRole = 'choice-group'; // configures event propagation logic of FormControlMixin

        this.__isInitialModelValue = true;
        this.__isInitialSerializedValue = true;
        this.__isInitialFormattedValue = true;
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
        Promise.resolve().then(() => this.__resolveRegistrationComplete());

        this.registrationComplete.then(() => {
          this.__isInitialModelValue = false;
          this.__isInitialSerializedValue = false;
          this.__isInitialFormattedValue = false;
        });
      }

      disconnectedCallback() {
        if (super.disconnectedCallback) {
          super.disconnectedCallback();
        }

        if (this.registrationComplete.done === false) {
          this.__rejectRegistrationComplete();
        }
      }

      /**
       * @override from FormRegistrarMixin
       */
      addFormElement(child, indexToInsertAt) {
        this._throwWhenInvalidChildModelValue(child);
        this.__delegateNameAttribute(child);
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
       */
      _getFromAllFormElements(property, filterCondition = () => true) {
        // For modelValue and serializedValue, an exception should be made,
        // The reset can be requested from children
        if (property === 'modelValue' || property === 'serializedValue') {
          return this[property];
        }
        return this.formElements.filter(filterCondition).map(el => el.property);
      }

      _throwWhenInvalidChildModelValue(child) {
        if (
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
        this.__triggerCheckedValueChanged();
      }

      _getCheckedElements() {
        // We want to filter out disabled values out by default
        return this.formElements.filter(el => el.checked && !el.disabled);
      }

      _setCheckedElements(value, check) {
        for (let i = 0; i < this.formElements.length; i += 1) {
          if (this.multipleChoice) {
            this.formElements[i].checked = value.includes(this.formElements[i].value);
          } else if (check(this.formElements[i], value)) {
            // Allows checking against custom values e.g. formattedValue or serializedValue
            this.formElements[i].checked = true;
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

      __delegateNameAttribute(child) {
        if (!child.name || child.name === this.name) {
          // eslint-disable-next-line no-param-reassign
          child.name = this.name;
        } else {
          throw new Error(
            `The ${this.tagName.toLowerCase()} name="${
              this.name
            }" does not allow to register ${child.tagName.toLowerCase()} with custom names (name="${
              child.name
            }" given)`,
          );
        }
      }

      /**
       * @override FormControlMixin
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
        this.requestUpdate('modelValue');
      }
    },
);
