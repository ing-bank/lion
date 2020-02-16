import { dedupeMixin } from '@lion/core';
import { InteractionStateMixin, FormRegistrarMixin } from '@lion/field';

export const ChoiceGroupMixin = dedupeMixin(
  superclass =>
    // eslint-disable-next-line
    class ChoiceGroupMixin extends FormRegistrarMixin(InteractionStateMixin(superclass)) {
      get modelValue() {
        const elems = this._getCheckedElements();
        if (this.multipleChoice) {
          return elems.map(el => el.modelValue.value);
        }
        return elems ? elems.modelValue.value : '';
      }

      set modelValue(value) {
        this._setCheckedElements(value, (el, val) => el.modelValue.value === val);
      }

      get serializedValue() {
        const elems = this._getCheckedElements();
        if (this.multipleChoice) {
          return elems.map(el => el.serializedValue);
        }
        return elems ? elems.serializedValue : '';
      }

      set serializedValue(value) {
        this._setCheckedElements(value, (el, val) => el.serializedValue === val);
      }

      constructor() {
        super();
        this.multipleChoice = false;
      }

      connectedCallback() {
        super.connectedCallback();
        if (!this.multipleChoice) {
          this.addEventListener('model-value-changed', this._checkSingleChoiceElements);
        }
      }

      disconnectedCallback() {
        super.disconnectedCallback();
        if (!this.multipleChoice) {
          this.removeEventListener('model-value-changed', this._checkSingleChoiceElements);
        }
      }

      /**
       * @override from FormRegistrarMixin
       */
      addFormElement(child, indexToInsertAt) {
        this._throwWhenInvalidChildModelValue(child);
        // TODO: nice to have or does it have a function (since names are meant as keys for
        // formElements)?
        this.__delegateNameAttribute(child);
        super.addFormElement(child, indexToInsertAt);
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
        const value = this.modelValue;
        if (this.multipleChoice) {
          return this.modelValue.length === 0;
        }

        if (typeof value === 'string' && value === '') {
          return true;
        }
        if (value === undefined || value === null) {
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
        const filtered = this.formElements.filter(el => el.checked === true);
        if (this.multipleChoice) {
          return filtered;
        }
        return filtered.length > 0 ? filtered[0] : undefined;
      }

      async _setCheckedElements(value, check) {
        if (!this.__readyForRegistration) {
          await this.registrationReady;
        }

        for (let i = 0; i < this.formElements.length; i += 1) {
          if (this.multipleChoice) {
            this.formElements[i].checked = value.includes(this.formElements[i].value);
          } else if (check(this.formElements[i], value)) {
            // Allows checking against custom values e.g. formattedValue or serializedValue
            this.formElements[i].checked = true;
          }
        }
      }

      __triggerCheckedValueChanged() {
        const value = this.modelValue;
        if (value != null && value !== this.__previousCheckedValue) {
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
    },
);
