import { LionFieldset } from '@lion/fieldset';

export class LionCheckboxGroup extends LionFieldset {
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
