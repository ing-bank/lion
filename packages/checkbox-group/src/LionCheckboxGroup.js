import { LionFieldset } from '@lion/fieldset';

export class LionCheckboxGroup extends LionFieldset {
  get checkedValues() {
    const el = this._getCheckedCheckboxElements();
    return el ? el.map(x => x.modelValue.value) : undefined;
  }

  set checkedValues(valueArray) {
    this._setCheckedCheckboxElements(valueArray, (el, val) => val.includes(el.modelValue.value));
  }

  constructor() {
    super();
    this._checkboxGroupTouched = false;
    this._setTouchedAndPrefilled = this._setTouchedAndPrefilled.bind(this);
    this._checkForOutsideClick = this._checkForOutsideClick.bind(this);
    this._checkForChildrenClick = this._checkForChildrenClick.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    // We listen for focusin(instead of foxus), because it bubbles and gives the right event order
    window.addEventListener('focusin', this._setTouchedAndPrefilled);

    document.addEventListener('click', this._checkForOutsideClick);
    this.addEventListener('click', this._checkForChildrenClick);
    this.addEventListener('model-value-changed', this._checkCheckboxElements);

    // checks for any of the children to be prefilled
    this._checkboxGroupPrefilled = super.prefilled;
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('focusin', this._setTouchedAndPrefilled);
    document.removeEventListener('click', this._checkForOutsideClick);
    this.removeEventListener('click', this._checkForChildrenClick);
    this.removeEventListener('model-value-changed', this._checkCheckboxElements);
  }

  get touched() {
    return this._checkboxGroupTouched;
  }

  /**
   * Leave event will be fired when previous document.activeElement
   * is inside group and current document.activeElement is outside.
   */
  _setTouchedAndPrefilled() {
    const groupHasFocus = this.focused;
    if (this.__groupHadFocus && !groupHasFocus) {
      this._checkboxGroupTouched = true;
      this._checkboxGroupPrefilled = super.prefilled; // right time to reconsider prefilled
      this.__checkboxGroupPrefilledHasBeenSet = true;
    }
    this.__groupHadFocus = groupHasFocus;
  }

  _checkForOutsideClick(event) {
    const outsideGroupClicked = !this.contains(event.target);
    if (outsideGroupClicked) {
      this._setTouchedAndPrefilled();
    }
  }

  // Whenever a user clicks a checkbox, error messages should become visible
  _checkForChildrenClick(event) {
    const childClicked = this._childArray.some(c => c === event.target || c.contains(event.target));

    if (childClicked) {
      this._checkboxGroupTouched = true;
    }
  }

  get _childArray() {
    // We assume here that the fieldset has one set of checkboxes/radios that are grouped via attr
    // name="groupName[]"
    const arrayKey = Object.keys(this.formElements).filter(k => k.substr(-2) === '[]')[0];
    return this.formElements[arrayKey] || [];
  }

  // eslint-disable-next-line class-methods-use-this
  __isRequired(modelValues) {
    const keys = Object.keys(modelValues);
    for (let i = 0; i < keys.length; i += 1) {
      const modelValue = modelValues[keys[i]];
      if (Array.isArray(modelValue)) {
        // grouped via myName[]
        return {
          required: modelValue.some(node => node.checked),
        };
      }
      return {
        required: modelValue.checked,
      };
    }
    return { required: false };
  }

  _checkCheckboxElements() {
    this._triggerChecked();
  }

  _triggerChecked() {
    const values = this.checkedValues;
    if (values && values !== this.__previousCheckedValues) {
      this.dispatchEvent(
        new CustomEvent('checked-value-changed', { bubbles: true, composed: true }),
      );
      this.__previousCheckedValues = values;
    }
  }

  _getCheckedCheckboxElements() {
    const filtered = this.formElementsArray.filter(el => el.checked === true);
    return filtered.length > 0 ? filtered : undefined;
  }

  _setCheckedCheckboxElements(value, check) {
    for (let i = 0; i < this.formElementsArray.length; i += 1) {
      if (check(this.formElementsArray[i], value)) {
        this.formElementsArray[i].checked = true;
      } else {
        this.formElementsArray[i].checked = false;
      }
    }
  }
}
