import { LionFieldset } from '@lion/fieldset';

/* eslint-disable no-underscore-dangle */
/**
 * LionRadioGroup: extends the lion-fieldset
 *
 * <lion-radio-group>
 *   <label slot="label">My Radio</label>
 *   <lion-radio name="name[]">
 *     <label slot="label">Male</label>
 *   </lion-radio>
 *   <lion-radio name="name[]">
 *     <label slot="label">Female</label>
 *   </lion-radio>
 * </lion-radio-group>
 *
 * You can preselect an option by setting marking an lion-radio checked.
 *   Example:
 *   <lion-radio name="name[]" checked>
 *
 * It extends LionFieldset so it inherits it's features.
 *
 *
 * @customElement
 * @extends LionFieldset
 */

export class LionRadioGroup extends LionFieldset {
  get events() {
    return {
      ...super.events,
      _checkRadioElements: [() => this, 'model-value-changed'],
    };
  }

  get checkedValue() {
    const el = this._getCheckedRadioElement();
    return el ? el.modelValue.value : '';
  }

  set checkedValue(value) {
    this._setCheckedRadioElement(value, (el, val) => el.modelValue.value === val);
  }

  get serializedValue() {
    return this._getCheckedRadioElement().serializedValue;
  }

  set serializedValue(value) {
    this._setCheckedRadioElement(value, (el, val) => el.serializedValue === val);
  }

  get formattedValue() {
    return this._getCheckedRadioElement().formattedValue;
  }

  set formattedValue(value) {
    this._setCheckedRadioElement(value, (el, val) => el.formattedValue === val);
  }

  connectedCallback() {
    super.connectedCallback();
    this._setRole('radiogroup');
  }

  _checkRadioElements(ev) {
    const { target } = ev;
    if (target.type !== 'radio' || target.choiceChecked === false) return;

    const groupName = target.name;
    this.formElementsArray
      .filter(i => i.name === groupName)
      .forEach(radio => {
        if (radio !== target) {
          radio.choiceChecked = false; // eslint-disable-line no-param-reassign
        }
      });
    this.__triggerCheckedValueChanged();
  }

  _getCheckedRadioElement() {
    const filtered = this.formElementsArray.filter(el => el.choiceChecked === true);
    return filtered.length > 0 ? filtered[0] : undefined;
  }

  _setCheckedRadioElement(value, check) {
    for (let i = 0; i < this.formElementsArray.length; i += 1) {
      if (check(this.formElementsArray[i], value)) {
        this.formElementsArray[i].choiceChecked = true;
        return;
      }
    }
  }

  __triggerCheckedValueChanged() {
    const value = this.checkedValue;
    if (value && value !== this.__previousCheckedValue) {
      this.dispatchEvent(
        new CustomEvent('checked-value-changed', { bubbles: true, composed: true }),
      );
      this.__previousCheckedValue = value;
    }
  }

  // eslint-disable-next-line class-methods-use-this
  __isRequired(modelValue) {
    const groupName = Object.keys(modelValue)[0];
    const filtered = modelValue[groupName].filter(node => node.checked === true);
    const value = filtered.length > 0 ? filtered[0] : undefined;
    return {
      required:
        (typeof value === 'string' && value !== '') ||
        (typeof value !== 'string' && typeof value !== 'undefined'), // TODO: && value !== null ?
    };
  }
}
