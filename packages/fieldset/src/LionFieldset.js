import { SlotMixin, html, LitElement } from '@lion/core';
import { DisabledMixin } from '@lion/core/src/DisabledMixin.js';
import { ValidateMixin } from '@lion/validate';
import { FormControlMixin, FormRegistrarMixin } from '@lion/field';
import { getAriaElementsInRightDomOrder } from '@lion/field/src/utils/getAriaElementsInRightDomOrder.js';
import { FormElementsHaveNoError } from './FormElementsHaveNoError.js';

/**
 * LionFieldset: fieldset wrapper providing extra features and integration with lion-field elements.
 *
 * @customElement lion-fieldset
 * @extends {LitElement}
 */
export class LionFieldset extends FormRegistrarMixin(
  FormControlMixin(ValidateMixin(DisabledMixin(SlotMixin(LitElement)))),
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

  get _inputNode() {
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

  set fieldName(value) {
    this.__fieldName = value;
  }

  get fieldName() {
    const label =
      this.label ||
      (this.querySelector('[slot=label]') && this.querySelector('[slot=label]').textContent);
    return this.__fieldName || label || this.name;
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

    this._checkForOutsideClick = this._checkForOutsideClick.bind(this);

    this.addEventListener('focusin', this._syncFocused);
    this.addEventListener('focusout', this._onFocusOut);
    this.addEventListener('dirty-changed', this._syncDirty);
    this.addEventListener('validate-performed', this.__validate);

    this.defaultValidators = [new FormElementsHaveNoError()];
  }

  connectedCallback() {
    // eslint-disable-next-line wc/guard-super-call
    super.connectedCallback();
    this._setRole();
  }

  disconnectedCallback() {
    super.disconnectedCallback(); // eslint-disable-line wc/guard-super-call

    if (this.__hasActiveOutsideClickHandling) {
      document.removeEventListener('click', this._checkForOutsideClick);
      this.__hasActiveOutsideClickHandling = false;
    }
  }

  updated(changedProps) {
    super.updated(changedProps);

    if (changedProps.has('disabled')) {
      if (this.disabled) {
        this.__requestChildrenToBeDisabled();
      } else {
        this.__retractRequestChildrenToBeDisabled();
      }
    }

    if (changedProps.has('focused')) {
      if (this.focused === true) {
        this.__setupOutsideClickHandling();
      }
    }
  }

  __setupOutsideClickHandling() {
    if (!this.__hasActiveOutsideClickHandling) {
      document.addEventListener('click', this._checkForOutsideClick);
      this.__hasActiveOutsideClickHandling = true;
    }
  }

  _checkForOutsideClick(event) {
    const outsideGroupClicked = !this.contains(event.target);
    if (outsideGroupClicked) {
      this.touched = true;
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
        if (serializedValue || serializedValue === 0) {
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

  _getFromAllFormElements(property) {
    if (!this.formElements) {
      return undefined;
    }
    const childrenNames = Object.keys(this.formElements);
    const values = {};
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

  async _setValueMapForAllFormElements(property, values) {
    if (!this.__readyForRegistration) {
      await this.registrationReady;
    }

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

  _anyFormElementHasFeedbackFor(state) {
    return Object.keys(this.formElements).some(name => {
      if (Array.isArray(this.formElements[name])) {
        return this.formElements[name].some(el => !!el.hasFeedbackFor.includes(state));
      }
      return !!this.formElements[name].hasFeedbackFor.includes(state);
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
   * Gets triggered by event 'validate-performed' which enabled us to handle 2 different situations
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
      if (serializedValue || serializedValue === 0) {
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

  /**
   * Add aria-describedby to child element(field), so that it points to feedback/help-text of
   * parent(fieldset)
   * @param {LionField} field - the child: lion-field/lion-input/lion-textarea
   * @param {array} descriptionElements  - description elements like feedback and help-text
   */
  static _addDescriptionElementIdsToField(field, descriptionElements) {
    const orderedEls = getAriaElementsInRightDomOrder(descriptionElements, { reverse: true });
    orderedEls.forEach(el => {
      if (field.addToAriaDescribedBy) {
        field.addToAriaDescribedBy(el, { reorder: false });
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
}
