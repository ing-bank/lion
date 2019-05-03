import { SlotMixin, html } from '@lion/core';
import { LionLitElement } from '@lion/core/src/LionLitElement.js';
import { EventMixin } from '@lion/core/src/EventMixin.js';
import { ObserverMixin } from '@lion/core/src/ObserverMixin.js';
import { ValidateMixin } from '@lion/validate';
import { FormControlMixin } from '@lion/field';

// TODO: extract from module like import { pascalCase } from 'lion-element/CaseMapUtils.js'
const pascalCase = str => str.charAt(0).toUpperCase() + str.slice(1);

/**
 * LionFieldset: fieldset wrapper providing extra features and integration with lion-field elements.
 *
 * @customElement
 * @extends LionLitElement
 */
export class LionFieldset extends FormControlMixin(
  ValidateMixin(EventMixin(SlotMixin(ObserverMixin(LionLitElement)))),
) {
  static get properties() {
    return {
      ...super.properties,
      disabled: {
        type: Boolean,
        reflect: true,
        attribute: 'state-disabled',
      },
      name: {
        type: String,
      },
      submitted: {
        type: Boolean,
        reflect: true,
        attribute: 'state-submitted',
      },
    };
  }

  static get asyncObservers() {
    return {
      ...super.asyncObservers,
      _onDisabledChanged: ['disabled'],
    };
  }

  get events() {
    return {
      ...super.events,
      __validate: [() => this, 'validation-done'],
      _updateFocusedClass: [() => this, 'focused-changed'], // TODO: currently not available in InteractionStates
      _updateTouchedClass: [() => this, 'touched-changed'],
      _updateDirtyClass: [() => this, 'dirty-changed'],
      __onFormElementRegister: [() => this, 'form-element-register'],
      __onFormElementUnRegister: [() => this, 'form-element-unregister'],
    };
  }

  get inputElement() {
    return this;
  }

  get modelValue() {
    return this._getFromAllFormElements('modelValue');
  }

  set modelValue(values) {
    this._setValueMapForAllFormElements('modelValue', values);
  }

  get serializedValue() {
    return this._getFromAllFormElements('serializedValue');
  }

  set serializedValue(values) {
    this._setValueMapForAllFormElements('serializedValue', values);
  }

  get formattedValue() {
    return this._getFromAllFormElements('formattedValue');
  }

  set formattedValue(values) {
    this._setValueMapForAllFormElements('formattedValue', values);
  }

  get touched() {
    return this._anyFormElementHas('touched');
  }

  get dirty() {
    return this._anyFormElementHas('dirty');
  }

  get prefilled() {
    return this._anyFormElementHas('prefilled');
  }

  get focused() {
    return this._anyFormElementHas('focused');
  }

  get formElementsArray() {
    return Object.keys(this.formElements).reduce((result, name) => {
      const element = this.formElements[name];
      return result.concat(Array.isArray(element) ? element : [element]);
    }, []);
  }

  constructor() {
    super();
    this.disabled = false;
    this.submitted = false;
    this.formElements = {};
    this.__addedSubValidators = false;
    this.__createTypeAbsenceValidators();
  }

  connectedCallback() {
    // eslint-disable-next-line wc/guard-super-call
    super.connectedCallback();
    this._setRole();
  }

  disconnectedCallback() {
    // eslint-disable-next-line wc/guard-super-call
    super.disconnectedCallback();
    if (this.__parentFormGroup) {
      const event = new CustomEvent('form-element-unregister', {
        detail: { element: this },
        bubbles: true,
      });
      this.__parentFormGroup.dispatchEvent(event);
    }
  }

  isRegisteredFormElement(el) {
    return Object.keys(this.formElements).some(name => el.name === name);
  }

  // eslint-disable-next-line class-methods-use-this
  inputGroupTemplate() {
    return html`
      <div class="input-group">
        <slot></slot>
      </div>
    `;
  }

  submitGroup() {
    this.submitted = true;
    this.formElementsArray.forEach(child => {
      if (typeof child.submitGroup === 'function') {
        child.submitGroup();
      } else {
        child.submitted = true; // eslint-disable-line no-param-reassign
      }
    });
  }

  serializeGroup() {
    const childrenNames = Object.keys(this.formElements);
    const serializedValues = childrenNames.length > 0 ? {} : undefined;
    childrenNames.forEach(name => {
      const element = this.formElements[name];
      if (Array.isArray(element)) {
        serializedValues[name] = this.__serializeElements(element);
      } else {
        const serializedValue = this.__serializeElement(element);
        if (serializedValue) {
          serializedValues[name] = serializedValue;
        }
      }
    });
    return serializedValues;
  }

  resetGroup() {
    this.modelValue = this.resetModelValue;
    this.resetInteractionState();
  }

  resetInteractionState() {
    // TODO: add submitted prop to InteractionStateMixin
    this.submitted = false;
    this.formElementsArray.forEach(formElement => {
      if (typeof formElement.resetInteractionState === 'function') {
        formElement.resetInteractionState();
      }
    });
  }

  getValidatorsForType(type) {
    const validators = super.getValidatorsForType(type) || [];
    return [
      ...validators,
      [this[`__formElementsHaveNo${pascalCase(type)}`], {}, { hideFeedback: true }],
    ];
  }

  _getFromAllFormElements(property) {
    if (!this.formElements) {
      return undefined;
    }
    const childrenNames = Object.keys(this.formElements);
    const values = childrenNames.length > 0 ? {} : undefined;
    childrenNames.forEach(name => {
      if (Array.isArray(this.formElements[name])) {
        // grouped via myName[]
        values[name] = this.formElements[name].map(node => node.modelValue);
      } else {
        // not grouped
        values[name] = this.formElements[name][property];
      }
    });
    return values;
  }

  _setValueForAllFormElements(property, value) {
    this.formElementsArray.forEach(el => {
      el[property] = value; // eslint-disable-line no-param-reassign
    });
  }

  _setValueMapForAllFormElements(property, values) {
    if (values && typeof values === 'object') {
      Object.keys(values).forEach(name => {
        if (Array.isArray(this.formElements[name])) {
          this.formElements[name].forEach((el, index) => {
            el[property] = values[name][index]; // eslint-disable-line no-param-reassign
          });
        }
        this.formElements[name][property] = values[name];
      });
    }
  }

  _anyFormElementHas(property) {
    return Object.keys(this.formElements).some(name => {
      if (Array.isArray(this.formElements[name])) {
        return this.formElements[name].some(el => !!el[property]);
      }
      return !!this.formElements[name][property];
    });
  }

  /**
   * Get's triggered by event 'validatin-done' which enabled us to handle 2 different situations
   *   - react on modelValue change, which says something about the validity as a whole
   *       (at least two checkboxes for instance) and nothing about the children's values
   *   - children validatity states have changed, so fieldset needs to update itself based on that
   */
  __validate(ev) {
    if (ev && this.isRegisteredFormElement(ev.target)) {
      this.validate();
    }
  }

  _updateFocusedClass() {
    if (this.touched) {
      this.setAttribute('state-focused', '');
    } else {
      this.removeAttribute('state-focused');
    }
  }

  _updateTouchedClass() {
    if (this.touched) {
      this.setAttribute('state-touched', '');
    } else {
      this.removeAttribute('state-touched');
    }
  }

  _updateDirtyClass() {
    if (this.dirty) {
      this.setAttribute('state-dirty', '');
    } else {
      this.removeAttribute('state-touched');
    }
  }

  _onDisabledChanged({ disabled }, { disabled: oldDisabled }) {
    // do not propagate/override inital disabled value on nested form elements
    if (typeof oldDisabled !== 'undefined') {
      this._setValueForAllFormElements('disabled', disabled);
    }
  }

  _setRole(role) {
    this.setAttribute('role', role || 'group');
  }

  // eslint-disable-next-line class-methods-use-this
  __serializeElement(element) {
    if (!element.disabled) {
      if (typeof element.serializeGroup === 'function') {
        return element.serializeGroup();
      }
      return element.serializedValue;
    }
    return undefined;
  }

  __serializeElements(elements) {
    const serializedValues = [];
    elements.forEach(element => {
      const serializedValue = this.__serializeElement(element);
      if (serializedValue) {
        serializedValues.push(serializedValue);
      }
    });
    return serializedValues;
  }

  __onFormElementRegister(event) {
    const child = event.detail.element;
    if (child === this) return; // as we fire and listen - don't add ourselves

    const { name } = child;
    if (!name) {
      console.info('Error Node:', child); // eslint-disable-line no-console
      throw new TypeError('You need to define a name');
    }
    if (name === this.name) {
      console.info('Error Node:', child); // eslint-disable-line no-console
      throw new TypeError(`You can not have the same name "${name}" as your parent`);
    }
    event.stopPropagation();

    if (this.disabled) {
      child.disabled = true;
    }
    if (name.substr(-2) === '[]') {
      if (!Array.isArray(this.formElements[name])) {
        this.formElements[name] = [];
      }
      this.formElements[name].push(child);
    } else if (!this.formElements[name]) {
      this.formElements[name] = child;
    } else {
      console.info('Error Node:', child); // eslint-disable-line no-console
      throw new TypeError(
        `Name "${name}" is already registered - if you want an array add [] to the end`,
      );
    }

    // This is a way to let the child element (a lion-fieldset or lion-field) know, about its parent
    child.__parentFormGroup = this;

    // aria-describedby of (nested) children
    let parent = this;
    while (parent) {
      this.constructor._addDescriptionElementIdsToField(
        child,
        parent._getAriaDescriptionElements(),
      );
      // Also check if the newly added child needs to refer grandparents
      parent = parent.__parentFormGroup;
    }

    this.validate();
  }

  /**
   * Updates the resetModelValue of this fieldset and asks it's parent fieldset/group to also
   * update.
   * This is needed as the upgrade order is not guaranteed. We have 3 main cases:
   * 1. if `street-name` gets updated last then `address` and `details` needs to update their
   *    resetModelValue to also incorporate the correct value of `street-name`/`address`.
   * 2. If `address` get updated last then it already has the correct `street-name` so it
   *    requests an update only for `details`.
   * 3. If `details` get updated last nothing happens here as all data are up to date
   *
   * @example
   * <lion-fieldset name="details">
   *   <lion-fieldset name="address">
   *     <lion-input name="street-name" .modelValue=${'street 1'}>
   */
  _updateResetModelValue() {
    this.resetModelValue = this.modelValue;
    this._requestParentFormGroupUpdateOfResetModelValue();
  }

  /**
   * Add aria-describedby to child element(field), so that it points to feedback/help-text of
   * parent(fieldset)
   * @param {LionField} field - the child: lion-field/lion-input/lion-textarea
   * @param {array} descriptionElements  - description elements like feedback and help-text
   */
  static _addDescriptionElementIdsToField(field, descriptionElements) {
    // TODO: make clear in documentation that help-text and feedback slot should be appended by now
    // and dynamically appending (or dom-ifs etc) doesn't work
    // TODO: we can cache this on constructor level for perf, but changing template via providers
    // might go wrong then when dom order changes per instance. Although we could check if
    // 'provision' has taken place or not
    const orderedEls = this._getAriaElementsInRightDomOrder(descriptionElements);
    orderedEls.forEach(el => field.addToAriaDescription(el.id));
  }

  __onFormElementUnRegister(event) {
    const child = event.detail.element;
    const { name } = child;
    if (child === this) {
      return;
    } // as we fire and listen - don't add ourself

    event.stopPropagation();

    if (name.substr(-2) === '[]' && this.formElements[name]) {
      const index = this.formElements[name].indexOf(child);
      if (index > -1) {
        this.formElements[name].splice(index, 1);
      }
    } else if (this.formElements[name]) {
      delete this.formElements[name];
    }

    // TODO: Clean up aria references of elements that were ancestors of child.
    // For this, it would be better if LionField._ariaDescribedby would be an element array from
    // which you can delete all elems that are not child.contains(descriptionEl), so that the
    // resulting array can be serialized into a string of ids.

    this.validate();
  }

  /**
   * Creates a validator for every type indicating whether all of the children formElements
   * are not in the condition of {type} : i.e. __formElementsHaveNoError would be true if
   * none of the children of the fieldset is in error state.
   */
  __createTypeAbsenceValidators() {
    this.constructor.validationTypes.forEach(type => {
      this[`__formElementsHaveNo${pascalCase(type)}`] = () => ({
        [`formElementsHaveNo${pascalCase(type)}`]: !this._anyFormElementHas(`${type}State`),
      });
    });
  }

  // eslint-disable-next-line class-methods-use-this
  __isRequired() {
    // eslint-disable-next-line no-console
    console.warn(`Default "required" validator is not supported on fieldsets. If you have a valid
      use case please let us know.`);
  }
}
