import { SlotMixin, html, LitElement } from '@lion/core';
import { DisabledMixin } from '@lion/core/src/DisabledMixin.js';
import { ObserverMixin } from '@lion/core/src/ObserverMixin.js';
import { ValidateMixin } from '@lion/validate';
import { FormControlMixin, FormRegistrarMixin } from '@lion/field';

// TODO: extract from module like import { pascalCase } from 'lion-element/CaseMapUtils.js'
const pascalCase = str => str.charAt(0).toUpperCase() + str.slice(1);

/**
 * LionFieldset: fieldset wrapper providing extra features and integration with lion-field elements.
 *
 * @customElement lion-fieldset
 * @extends LionLitElement
 */
export class LionFieldset extends FormRegistrarMixin(
  FormControlMixin(ValidateMixin(DisabledMixin(SlotMixin(ObserverMixin(LitElement))))),
) {
  static get properties() {
    return {
      name: {
        type: String,
      },
      submitted: {
        type: Boolean,
        reflect: true,
      },
      focused: {
        type: Boolean,
        reflect: true,
      },
      dirty: {
        type: Boolean,
        reflect: true,
      },
      touched: {
        type: Boolean,
        reflect: true,
      },
    };
  }

  get touched() {
    return this.__touched;
  }

  set touched(value) {
    const oldVal = this.__touched;
    this.__touched = value;
    this.requestUpdate('touched', oldVal);
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

  get prefilled() {
    return this._everyFormElementHas('prefilled');
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
    this.dirty = false;
    this.touched = false;
    this.focused = false;
    this.formElements = {};
    this.__addedSubValidators = false;
    this.__createTypeAbsenceValidators();

    this._checkForOutsideClick = this._checkForOutsideClick.bind(this);
  }

  connectedCallback() {
    // eslint-disable-next-line wc/guard-super-call
    super.connectedCallback();

    this.addEventListener('focusin', this._updateTouchedClass);
    this.addEventListener('focusout', this._onFocusOut);
    this.addEventListener('focusin', this._syncFocused);

    this.addEventListener('validation-done', this.__validate);
    this.addEventListener('dirty-changed', this._syncDirty);

    this._setRole();
    document.addEventListener('click', this._checkForOutsideClick);
  }

  _checkForOutsideClick(event) {
    const outsideGroupClicked = !this.contains(event.target);
    if (outsideGroupClicked) {
      this.touched = true;
    }
  }

  disconnectedCallback() {
    // eslint-disable-next-line wc/guard-super-call
    super.disconnectedCallback();
    this.removeEventListener('validation-done', this.__validate);
    this.removeEventListener('touched-changed', this._updateTouched);
    this.removeEventListener('dirty-changed', this._syncDirty);

    document.removeEventListener('click', this._checkForOutsideClick);
  }

  updated(changedProps) {
    super.updated(changedProps);

    if (changedProps.has('disabled')) {
      if (this.disabled) {
        this.__requestChildrenToBeDisabled();
        /** @deprecated use disabled attribute instead */
        this.classList.add('state-disabled'); // eslint-disable-line wc/no-self-class
      } else {
        this.__retractRequestChildrenToBeDisabled();
        /** @deprecated use disabled attribute instead */
        this.classList.remove('state-disabled'); // eslint-disable-line wc/no-self-class
      }
    }
    if (changedProps.has('touched')) {
      /** @deprecated use touched attribute instead */
      this.classList[this.touched ? 'add' : 'remove']('state-touched');
    }

    if (changedProps.has('dirty')) {
      /** @deprecated use dirty attribute instead */
      this.classList[this.dirty ? 'add' : 'remove']('state-dirty');
    }

    if (changedProps.has('focused')) {
      /** @deprecated use touched attribute instead */
      this.classList[this.focused ? 'add' : 'remove']('state-focused');
    }
  }

  __requestChildrenToBeDisabled() {
    this.formElementsArray.forEach(child => {
      if (child.makeRequestToBeDisabled) {
        child.makeRequestToBeDisabled();
      }
    });
  }

  __retractRequestChildrenToBeDisabled() {
    this.formElementsArray.forEach(child => {
      if (child.retractRequestToBeDisabled) {
        child.retractRequestToBeDisabled();
      }
    });
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
    this.formElementsArray.forEach(child => {
      if (typeof child.resetGroup === 'function') {
        child.resetGroup();
      } else if (typeof child.reset === 'function') {
        child.reset();
      }
    });

    this.resetInteractionState();
  }

  resetInteractionState() {
    // TODO: add submitted prop to InteractionStateMixin
    this.submitted = false;
    this.touched = false;
    this.dirty = false;
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

  _everyFormElementHas(property) {
    return Object.keys(this.formElements).every(name => {
      if (Array.isArray(this.formElements[name])) {
        return this.formElements[name].every(el => !!el[property]);
      }
      return !!this.formElements[name][property];
    });
  }

  /**
   * Gets triggered by event 'validation-done' which enabled us to handle 2 different situations
   *   - react on modelValue change, which says something about the validity as a whole
   *       (at least two checkboxes for instance) and nothing about the children's values
   *   - children validatity states have changed, so fieldset needs to update itself based on that
   */
  __validate(ev) {
    if (ev && this.isRegisteredFormElement(ev.target)) {
      this.validate();
    }
  }

  _syncFocused() {
    this.focused = this._anyFormElementHas('focused');
  }

  _onFocusOut(ev) {
    const lastEl = this.formElementsArray[this.formElementsArray.length - 1];
    if (ev.target === lastEl) {
      this.touched = true;
    }
    this.focused = false;
  }

  _syncDirty() {
    this.dirty = this._anyFormElementHas('dirty');
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

  /**
   * Adds the element to an object with the child name as a key
   * Note: this is different to the default behavior of just beeing an array
   *
   * @override
   */
  addFormElement(child) {
    const { name } = child;
    if (!name) {
      console.info('Error Node:', child); // eslint-disable-line no-console
      throw new TypeError('You need to define a name');
    }
    if (name === this.name) {
      console.info('Error Node:', child); // eslint-disable-line no-console
      throw new TypeError(`You can not have the same name "${name}" as your parent`);
    }

    if (this.disabled) {
      // eslint-disable-next-line no-param-reassign
      child.makeRequestToBeDisabled();
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
    // eslint-disable-next-line no-param-reassign
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
   * Gathers initial model values of all children. Used
   * when resetGroup() is called.
   */
  get _initialModelValue() {
    return this._getFromAllFormElements('_initialModelValue');
  }

  /** @deprecated */
  get resetModelValue() {
    return this._initialModelValue;
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
    orderedEls.forEach(el => {
      if (field.addToAriaDescription) {
        field.addToAriaDescription(el.id);
      }
    });
  }

  removeFormElement(child) {
    const { name } = child;
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
