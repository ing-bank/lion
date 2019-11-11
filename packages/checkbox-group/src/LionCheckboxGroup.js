import { LionFieldset } from '@lion/fieldset';

export class LionCheckboxGroup extends LionFieldset {
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
}
