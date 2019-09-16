import { localize } from '@lion/localize';
import { Validator } from '../Validator.js';
import { Required } from '../validators.js';
import { validateNamespace } from '../../provision-feedback-messages.js';

/**
 * Converts old Validator syntax to new class syntax
 * @param {LegacyValidator} v
 * @param {'error'|'warning'|'info'|'success'} [type='error']
 * @returns Validator
 */
export function toValidatorClass(v, type = 'error') {
  if (v instanceof Validator) {
    return v;
  }
  if (v[0] === 'required') {
    return new Required();
  }
  // change in such a way that api resembles that of Validator
  const [keyReturningFn, param, config] = v;
  // const result = { param, config, type, async: false };
  const result = new Validator(param, config);
  result.type = type;
  result.execute = (modelValue, prm) => {
    const [key, val] = Object.entries(keyReturningFn(modelValue, prm))[0];
    result.name = key;
    result.getMessage = async (data) => {
      console.log('213NDS');

      await validateNamespace;
      console.log('adadMNDS');
      return localize.msg(`lion-validate:${type}.${key}`, data);
    }
    return !val; // In our new Validators, we return true when a Validator is 'active'
  }
  return result;
}

/**
 * Converts class Validator syntax to legacy array syntax
 * @param {Validator} v
 * @returns LegacyValidator
 */
export function fromValidatorClass(v) {
  const fn = (value, p) => ({ [v.name]: !v.execute(value, p) });
  return [fn, v.param, v.config];
}
