/**
 * @deprecated: checking whether a validator is applied will become:
 * `myFormControl.validators.find(v => v instanceof MyValidator)`
 *
 *
 * TODO: refactor validators to classes, putting needed meta info on instance.
 * Note that direct function comparison (Validator[0] === minDate) doesn't work when code
 * is transpiled
 * @param {String} name - a name like minDate, maxDate, minMaxDate
 * @param {Function} fn - the validator function to execute provided in [fn, param, config]
 * @param {Function} requiredSignature - arguments needed to execute fn without failing
 * @returns {Boolean} - whether the validator (name) is applied
 */
export function isValidatorApplied(name, fn, requiredSignature) {
  let result;
  try {
    result = Object.keys(fn(new Date(), requiredSignature))[0] === name;
  } catch (e) {
    result = false;
  }
  return result;
}
