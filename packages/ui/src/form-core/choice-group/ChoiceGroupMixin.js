import { dedupeMixin } from '@open-wc/dedupe-mixin';
import { FormRegistrarMixin } from '../registration/FormRegistrarMixin.js';
import { InteractionStateMixin } from '../InteractionStateMixin.js';

/**
 * @typedef {import('../../types/choice-group/ChoiceGroupMixinTypes').ChoiceGroupMixin} ChoiceGroupMixin
 * @typedef {import('../../types/FormControlMixinTypes').FormControlHost} FormControlHost
 * @typedef {import('../../types/registration/FormRegistrarMixinTypes').ElementWithParentFormGroup} ElementWithParentFormGroup
 * @typedef {import('../../types/form-group/FormGroupMixinTypes').FormControl} FormControl
 * @typedef {import('../../types/choice-group/ChoiceInputMixinTypes').ChoiceInputHost} ChoiceInputHost
 */

/**
 * ChoiceGroupMixin applies on both Fields (listbox/select-rich/combobox)  and FormGroups
 * (radio-group, checkbox-group)
 * TODO: Ideally, the ChoiceGroupMixin should not depend on InteractionStateMixin, which is only
 * designed for usage with Fields, in other words: their interaction states are not derived from
 * children events, like in FormGroups
 *
 * @type {ChoiceGroupMixin}
 * @param {import('@open-wc/dedupe-mixin').Constructor<import('@lion/core').LitElement>} superclass
 */
const ChoiceGroupMixinImplementation = superclass =>
  // @ts-ignore https://github.com/microsoft/TypeScript/issues/36821#issuecomment-588375051
  class ChoiceGroupMixin extends FormRegistrarMixin(InteractionStateMixin(superclass)) {
    /** @type {any} */
    static get properties() {
      return {
        multipleChoice: { type: Boolean, attribute: 'multiple-choice' },
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
        this.registrationComplete.then(() => {
          this.__isInitialModelValue = false;
          this._setCheckedElements(value, checkCondition);
          this.requestUpdate('modelValue', this._oldModelValue);
        });
      } else {
        this._setCheckedElements(value, checkCondition);
        this.requestUpdate('modelValue', this._oldModelValue);
      }
      this._oldModelValue = this.modelValue;
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
        this.registrationComplete.then(() => {
          this.__isInitialSerializedValue = false;
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
        this.registrationComplete.then(() => {
          this.__isInitialFormattedValue = false;
          this._setCheckedElements(value, checkCondition);
        });
      } else {
        this._setCheckedElements(value, checkCondition);
      }
    }

    constructor() {
      super();

      /**
       * When false (default), modelValue and serializedValue will reflect the
       * currently selected choice (usually a string). When true, modelValue will and
       * serializedValue will be an array of strings.
       * @type {boolean}
       */
      this.multipleChoice = false;

      /**
       * @type {'child'|'choice-group'|'fieldset'}
       * @configure FormControlMixin event propagation
       * @protected
       */
      this._repropagationRole = 'choice-group';
      /** @private */
      this.__isInitialModelValue = true;
      /** @private */
      this.__isInitialSerializedValue = true;
      /** @private */
      this.__isInitialFormattedValue = true;
    }

    connectedCallback() {
      super.connectedCallback();

      this.registrationComplete.then(() => {
        this.__isInitialModelValue = false;
        this.__isInitialSerializedValue = false;
        this.__isInitialFormattedValue = false;
      });
    }

    /**
     * @enhance FormRegistrarMixin: we need one extra microtask to complete
     */
    _completeRegistration() {
      // Double microtask queue to account for Webkit race condition
      Promise.resolve().then(() => super._completeRegistration());
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

    /**
     * @enhance FormRegistrarMixin
     * @param {FormControl} child
     * @param {number} indexToInsertAt
     */
    addFormElement(child, indexToInsertAt) {
      this._throwWhenInvalidChildModelValue(child);
      // eslint-disable-next-line no-param-reassign
      child.name = this.name;
      super.addFormElement(child, indexToInsertAt);
    }

    clear() {
      if (this.multipleChoice) {
        this.modelValue = [];
      } else {
        this.modelValue = '';
      }
    }

    /**
     * @override from FormControlMixin
     * @protected
     */
    _triggerInitialModelValueChangedEvent() {
      this.registrationComplete.then(() => {
        this._dispatchInitialModelValueChangedEvent();
      });
    }

    /**
     * A filter function which will exclude a form field when returning false
     * By default, exclude form fields which are disabled
     *
     * The type is be passed as well for more fine grained control, e.g.
     * distinguish the filter when fetching modelValue versus serializedValue
     *
     * @param {FormControl} el
     * @param {string} type
     * @returns {boolean}
     */
    // eslint-disable-next-line class-methods-use-this, no-unused-vars
    _getFromAllFormElementsFilter(el, type) {
      return true;
    }

    /**
     * Implicit :( @override for FormGroupMixin, as choice fields "fieldsets"
     * will always implement both mixins
     *
     * TODO: Consider making this explicit by extracting this method to its own mixin and
     * using it in both FormGroupMixin and ChoiceGroupMixin, then override it here
     * This also makes it more DRY as we have same method with similar implementation
     * in FormGroupMixin. I (@jorenbroekema) think the abstraction is worth it here..
     *
     * @param {string} property
     * @param {(el: FormControl, property?: string) => boolean} [filterFn]
     * @returns {{[name:string]: any}}
     * @protected
     */
    _getFromAllFormElements(property, filterFn) {
      // Prioritizes imperatively passed filter function over the protected method
      const _filterFn = filterFn || this._getFromAllFormElementsFilter;

      // For modelValue, serializedValue and formattedValue, an exception should be made,
      // The reset can be requested from children
      if (
        property === 'modelValue' ||
        property === 'serializedValue' ||
        property === 'formattedValue'
      ) {
        return this[property];
      }
      return this.formElements.filter(el => _filterFn(el, property)).map(el => el.property);
    }

    /**
     * @param {FormControl} child
     * @protected
     */
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

    /**
     * @protected
     */
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
     * @protected
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

    /**
     * @protected
     */
    _getCheckedElements() {
      // We want to filter out disabled values by default
      return this.formElements.filter(el => el.checked && !el.disabled);
    }

    /**
     * @param {string | any[]} value
     * @param {Function} check
     * @protected
     */
    _setCheckedElements(value, check) {
      if (value === null || value === undefined) {
        // Uncheck all
        // eslint-disable-next-line no-return-assign, no-param-reassign
        this.formElements.forEach(fe => (fe.checked = false));
        return;
      }
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

    /**
     * @private
     */
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
     * @protected
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
      this.requestUpdate('modelValue', this._oldModelValue);
      this._oldModelValue = this.modelValue;
    }

    /**
     * @param {FormControlHost & ChoiceInputHost} target
     * @protected
     * @configure FormControlMixin: don't repropagate unchecked single choice choiceInputs
     */
    _repropagationCondition(target) {
      return !(
        this._repropagationRole === 'choice-group' &&
        !this.multipleChoice &&
        !target.checked
      );
    }
  };

export const ChoiceGroupMixin = dedupeMixin(ChoiceGroupMixinImplementation);
