import { LionFieldset } from '@lion/fieldset';

export class LionCheckboxGroup extends LionFieldset {
  get checkedValue() {
    return this.serializedValue;
  }

  set checkedValue(values) {
    this.serializedValue = values;
  }

  get serializedValue() {
    return this._getCheckedCheckboxElements().map(x => x.modelValue.value);
  }

  set serializedValue(values) {
    this._setCheckedCheckboxElements(values);
  }

  _getCheckedCheckboxElements() {
    return this.formElementsArray.filter(el => el.checked);
  }

  _setCheckedCheckboxElements(values) {
    this.formElementsArray.forEach(element => {
      /* eslint-disable-next-line no-param-reassign */
      element.checked = values.includes(element.modelValue.value);
    });
  }

  // eslint-disable-next-line class-methods-use-this
  _isEmpty(modelValues) {
    const keys = Object.keys(modelValues);
    for (let i = 0; i < keys.length; i += 1) {
      const modelValue = modelValues[keys[i]];
      if (Array.isArray(modelValue)) {
        // grouped via myName[]
        return !modelValue.some(node => node.checked);
      }
      return !modelValue.checked;
    }
    return true;
  }
}
