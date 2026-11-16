/**
 * @param {unknown} amount
 * @returns {boolean}
 */
const isEmptyAmount = amount =>
  amount === undefined || amount === null || amount === '' || amount === 'undefined';

/**
 * Serializes the modelValue to the international standard notation, e.g. `EUR 123`.
 * An empty amount keeps its currency (`EUR`), so that deserializing restores it.
 * @param {import("../types/index.js").AmountDropdownModelValue} modelValue
 * @returns {string}
 */
export const serializer = modelValue => {
  if (isEmptyAmount(modelValue?.amount)) {
    return modelValue?.currency || '';
  }
  /**
   * There seems to be some debate on a common international notation vs localization.
   * The unwritten standard is, e.g: EUR 123
   */
  return `${modelValue?.currency} ${modelValue?.amount}`;
};

/**
 * Deserializes the serializedValue back to a modelValue object `{ currency, amount }`.
 * The amount is restored as a number (like the parser returns it), so that deserializing is the
 * inverse of serializing. An empty amount becomes `''`, the amount of an empty field. Values written
 * by older versions (`'EUR '`, `'EUR undefined'`) are read as an empty amount as well.
 * @param {string} serializedValue
 * @returns {import("../types/index.js").AmountDropdownModelValue}
 */
export const deserializer = serializedValue => {
  const [currency, amount] = (serializedValue || '').split(' ');
  /** @type {import("../types/index.js").AmountDropdownModelValue} */
  const modelValue = currency ? { currency } : {};
  if (isEmptyAmount(amount)) {
    return { ...modelValue, amount: '' };
  }
  const numericAmount = Number(amount);
  return { ...modelValue, amount: Number.isNaN(numericAmount) ? amount : numericAmount };
};
