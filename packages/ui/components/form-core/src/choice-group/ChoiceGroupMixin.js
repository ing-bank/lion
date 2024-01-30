import { dedupeMixin } from '@open-wc/dedupe-mixin';
import { FormRegistrarMixin } from '../registration/FormRegistrarMixin.js';
import { InteractionStateMixin } from '../InteractionStateMixin.js';
import { deepEquals } from '../utils/deepEquals.js';
import { ensureArray } from '../utils/ensureArray.js';

/**
 * @typedef {import('../../types/choice-group/ChoiceGroupMixinTypes.js').ChoiceGroupMixin} ChoiceGroupMixin
 * @typedef {import('../../types/FormControlMixinTypes.js').FormControlHost} FormControlHost
 * @typedef {import('../../types/registration/FormRegistrarMixinTypes.js').ElementWithParentFormGroup} ElementWithParentFormGroup
 * @typedef {import('../../types/form-group/FormGroupMixinTypes.js').FormControl} FormControl
 * @typedef {import('../../types/choice-group/ChoiceInputMixinTypes.js').ChoiceInputHost} ChoiceInputHost
 */

/**
 * Checks if a choice value is a complex object or a string.
 * Small helper function to improve readability of code.
 * @deprecated N.B. Complex choice values are considered an anti-pattern.
 * In the future we will only support strings, like we already do in the combobox.
 * In our typings, this enforcement is already in place.
 * @param {ChoiceInputHost} el
 */
function hasComplexChoiceValue(el) {
  return typeof el.choiceValue === 'object';
}

/**
 * @param {ChoiceInputHost[]} choiceChildren
 */
function uncheckAll(choiceChildren) {
  for (const choiceChild of choiceChildren) {
    // eslint-disable-next-line no-param-reassign
    choiceChild.checked = false;
  }
}

/**
 * ChoiceGroupMixin applies on both Fields (listbox/select-rich/combobox) and FormGroups
 * (radio-group, checkbox-group).
 * > important to note here: a Field is an endpoint with serializedValue {string|string[]}
 * > and a FormGroup contains multiple Fields or FormGroups
 *
 * @type {ChoiceGroupMixin}
 * @param {import('@open-wc/dedupe-mixin').Constructor<import('lit').LitElement>} superclass
 */
const ChoiceGroupMixinImplementation = superclass =>
  // @ts-ignore https://github.com/microsoft/TypeScript/issues/36821#issuecomment-588375051
  class ChoiceGroupMixin extends FormRegistrarMixin(InteractionStateMixin(superclass)) {
    /** @type {any} */
    static properties = {
      multipleChoice: { type: Boolean, attribute: 'multiple-choice' },
      allowCustomChoice: { type: Boolean, attribute: 'allow-custom-choice' },
    };

    /**
     * @type {string[]|string}
     * The modelValue of a choice group is a (multipleChoice) or an array of strings, representing the values
     * (normally there's one strict type per component for modelValue, but we want to reach parity with native select apis)
     */
    get modelValue() {
      return this.__getChoicesFrom(this.__getChoiceGroupValue('modelValue', this._isSingleChoice));
    }

    set modelValue(valueOrValues) {
      this.__setChoiceGroupValue('modelValue', valueOrValues, '_oldModelValue');
      this.__setChoiceGroupValueWithCustomAllowed(valueOrValues, 'modelValue');
    }

    /**
     * @type {string[]|string}
     * Given that children of a choice group should have just string values (without an individial serializer),
     * the serializedValue should be the same as modelValue
     */
    get serializedValue() {
      return this.__getChoicesFrom(
        this.__getChoiceGroupValue('serializedValue', this._isSingleChoice),
      );
    }

    set serializedValue(valueOrValues) {
      this.__setChoiceGroupValue('serializedValue', valueOrValues, '_oldSerializedValue');
      this.__setChoiceGroupValueWithCustomAllowed(valueOrValues, 'serializedValue');
    }

    /**
     * @type {string[]|string}
     * Given that children of a choice group should have just string values (without an individial formatter),
     * the formattedValue should be the same as modelValue
     */
    get formattedValue() {
      return this.__getChoicesFrom(
        this.__getChoiceGroupValue('formattedValue', this._isSingleChoice),
      );
    }

    set formattedValue(valueOrValues) {
      this.__setChoiceGroupValue('formattedValue', valueOrValues, '_oldFormattedValue');
      this.__setChoiceGroupValueWithCustomAllowed(valueOrValues, 'formattedValue');
    }

    /**
     * Simple inverse of multipleChoice flag for code readability
     * @protected
     */
    get _isSingleChoice() {
      return !this.multipleChoice;
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

      /**
       * Whether the user can enter custom values.
       * Think of a combobox with a textbox or a radiogroup with an "other" option.
       */
      this.allowCustomChoice = false;

      /**
       * @type {Set<unknown>}
       * @protected
       */
      this._customChoices = new Set();
    }

    /**
     * @enhance FormRegistrarMixin: we need one extra microtask to complete
     */
    _completeRegistration() {
      // Double microtask queue to account for Webkit race condition
      Promise.resolve().then(() => super._completeRegistration());
    }

    /** @param {import('lit').PropertyValues} changedProperties */
    updated(changedProperties) {
      super.updated(changedProperties);

      if (changedProperties.has('name')) {
        for (const choiceChild of this.formElements) {
          // eslint-disable-next-line no-param-reassign
          choiceChild.name = this.name;
        }
      }
    }

    /**
     * @enhance FormRegistrarMixin
     * @param {FormControl} choiceChild
     * @param {number} indexToInsertAt
     */
    addFormElement(choiceChild, indexToInsertAt) {
      this._throwWhenInvalidChildModelValue(choiceChild);
      // eslint-disable-next-line no-param-reassign
      choiceChild.name = this.name;
      super.addFormElement(choiceChild, indexToInsertAt);
    }

    clear() {
      this._customChoices = new Set();

      if (this._isSingleChoice) {
        this.modelValue = '';
      } else {
        this.modelValue = [];
      }
    }

    /**
     * @override FormControlMixin
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
     * Implicit :( override for FormGroupMixin, as choice fields "fieldsets"
     * will always implement both mixins
     *
     * TODO: Consider making this explicit by extracting this method to its own mixin and
     * using it in both FormGroupMixin and ChoiceGroupMixin, then override it here
     * This also makes it more DRY as we have same method with similar implementation
     * in FormGroupMixin. I (@jorenbroekema) think the abstraction is worth it here..
     *
     * @param {string} propName
     * @param {(el: FormControl, property?: string) => boolean} [filterFn]
     * @returns {{[name:string]: any}}
     * @protected
     */
    _getFromAllFormElements(propName, filterFn) {
      // Prioritizes imperatively passed filter function over the protected method
      const _filterFn = filterFn || this._getFromAllFormElementsFilter;

      // For modelValue, serializedValue and formattedValue, an exception should be made,
      // The reset can be requested from children
      if (['modelValue', 'serializedValue', 'formattedValue'].includes(propName)) {
        return this[propName];
      }
      return this.formElements.filter(el => _filterFn(el, propName)).map(el => el[propName]);
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
     * @enhance FormControlMixin
     * @protected
     */
    _isEmpty() {
      if (this._customChoices.size > 0) {
        return false;
      }

      if (this._isSingleChoice) {
        return this.modelValue === '' || this.modelValue === undefined || this.modelValue === null;
      }
      return this.modelValue.length === 0;
    }

    /**
     * @param {CustomEvent & {target:FormControl}} ev
     * @protected
     */
    _checkSingleChoiceElements(ev) {
      const { target } = ev;
      if (target.checked === false) return;

      const groupName = target.name;

      for (const choiceChild of this.formElements) {
        if (choiceChild.name === groupName && choiceChild !== target) {
          choiceChild.checked = false; // eslint-disable-line no-param-reassign
        }
      }
      // this.__triggerCheckedValueChanged();
    }

    /**
     * Gets all the
     * @protected
     * @returns {ChoiceInputHost[]}
     */
    _getCheckedElements() {
      // We want to filter out disabled values by default
      return this.formElements.filter(choiceChild => choiceChild.checked && !choiceChild.disabled);
    }

    /**
     * @param {string | string[]} value
     * @param {(el: ChoiceInputHost, val: string|object) => boolean} isChecked
     * @protected
     */
    _setCheckedElements(value, isChecked) {
      if (value === null || value === undefined) {
        uncheckAll(this.formElements);
        return;
      }
      for (let i = 0; i < this.formElements.length; i += 1) {
        const choiceChild = this.formElements[i];
        if (this._isSingleChoice) {
          // Allows checking against custom values e.g. formattedValue or serializedValue
          choiceChild.checked = isChecked(choiceChild, value);
        } else {
          const valueArray = /** @type {string[]} */ (value);
          // For complex values (deprecated), we need to stringify them to be able to compare
          if (hasComplexChoiceValue(choiceChild)) {
            choiceChild.checked = /** @type {any[]} */ (valueArray)
              .map(/** @param {Object} v */ v => JSON.stringify(v))
              .includes(JSON.stringify(choiceChild.choiceValue));
          } else {
            choiceChild.checked = valueArray.includes(choiceChild.choiceValue);
          }
        }
      }
    }

    /**
     * @private
     */
    __setChoiceGroupTouched() {
      const value = this.modelValue;
      if (value !== null && value !== this.__previousCheckedValue) {
        // TODO: what happens here exactly? Needs to be based on user interaction (?)
        this.touched = true;
        // @ts-ignore
        this.__previousCheckedValue = value;
      }
    }

    /**
     * @configure FormControlMixin
     * @param {CustomEvent} ev
     * @protected
     */
    _onBeforeRepropagateChildrenValues(ev) {
      // Normalize target, since we might receive 'portal events' (from children in a modal,
      // see select-rich)
      const target = ev.detail?.element || ev.target;
      if (this.multipleChoice || !target.checked) {
        return;
      }

      for (const choiceChild of this.formElements) {
        if (target.choiceValue !== choiceChild.choiceValue) {
          choiceChild.checked = false; // eslint-disable-line no-param-reassign
        }
      }

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
      const isUncheckedChildOfSingleChoiceGroup =
        this._repropagationRole === 'choice-group' && this._isSingleChoice && !target.checked;
      return !isUncheckedChildOfSingleChoiceGroup;
    }

    /**
     * @param {string} propName like 'modelValue'
     * @param {boolean} isSingleChoice
     */
    __getChoiceGroupValue(propName, isSingleChoice) {
      const elems = this._getCheckedElements();
      const getValueForProp = (/** @type {ChoiceInputHost} */ choiceChild) =>
        choiceChild[propName].value || choiceChild.choiceValue;
      if (isSingleChoice) {
        return elems[0] ? getValueForProp(elems[0]) : '';
      }
      return elems.map(choiceChild => getValueForProp(choiceChild));
    }

    /**
     * @param {string} propName like 'modelValue'
     * @param {string|string[]} newValue
     * @param {string} oldPropName like '_oldModelValue'
     */
    __setChoiceGroupValue(propName, newValue, oldPropName) {
      /**
       * @param {ChoiceInputHost} choiceChild
       * @param {string|object} val
       */
      const isChecked = (choiceChild, val) =>
        hasComplexChoiceValue(choiceChild)
          ? // @ts-ignore
            deepEquals(choiceChild.choiceValue, val)
          : choiceChild.choiceValue === val;

      const setNewValue = () => {
        this._setCheckedElements(newValue, isChecked);
        this.requestUpdate(propName, this[oldPropName]);
      };

      // @ts-ignore
      if (!this.registrationComplete.done) {
        this.registrationComplete.then(setNewValue);
      } else {
        setNewValue();
      }

      // Updates _oldModelValue
      this[oldPropName] = this[propName];
    }

    /**
     * @param {string|string[]} valueOrValues
     * @param {'modelValue'|'formattedValue'|'serializedValue'} propName
     * @private
     */
    __setChoiceGroupValueWithCustomAllowed(valueOrValues, propName) {
      if (!valueOrValues) {
        this._customChoices = new Set();
      } else if (this.allowCustomChoice) {
        const old = this.modelValue;
        this._customChoices =
          propName === 'modelValue'
            ? new Set(ensureArray(valueOrValues))
            : new Set(
                ensureArray(valueOrValues).map(
                  val => this.formElements.find(el => el[propName] === val)?.modelValue || val,
                ),
              );
        this.requestUpdate('modelValue', old);
      }
    }

    /**
     * @param {string|string[]} value
     * @returns {*}
     */
    parser(value) {
      if (this.allowCustomChoice && Array.isArray(value)) {
        return value.filter(v => v.trim() !== '');
      }

      return value;
    }

    /**
     * Custom choices that
     */
    // @ts-ignore
    get customChoices() {
      if (!this.allowCustomChoice) {
        return [];
      }

      const elems = this._getCheckedElements();
      return Array.from(this._customChoices).filter(
        choice => !elems.some(elem => elem.choiceValue === choice),
      );
    }

    /**
     * @private
     * @returns {string|string[]}
     */
    // @ts-ignore
    __getChoicesFrom(valueOrValues) {
      if (!this.allowCustomChoice) {
        return valueOrValues;
      }

      if (this.multipleChoice) {
        return [...ensureArray(valueOrValues), ...this.customChoices];
      }

      if (valueOrValues === '') {
        return this._customChoices.values().next().value || '';
      }

      return valueOrValues;
    }
  };

export const ChoiceGroupMixin = dedupeMixin(ChoiceGroupMixinImplementation);
