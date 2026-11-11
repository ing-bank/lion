/**
 * @param {unknown} amount
 * @returns {boolean}
 */
const isEmptyAmount = amount => amount === undefined || amount === null || amount === '';

/**
 * Serializes the modelValue to the international standard notation.
 * An empty amount serializes to an empty string, like the serializedValue of any empty field.
 * @param {import("../types/index.js").AmountDropdownModelValue} modelValue
 * @returns {string}
 */
export const serializer = modelValue => {
  if (isEmptyAmount(modelValue?.amount)) {
    return '';
  }
  /**
   * There seems to be some debate on a common international notation vs localization.
   * The unwritten standard is, e.g: EUR 123
   */
  return `${modelValue?.currency} ${modelValue?.amount}`;
};

/**
 * Deserializes the serializedValue back to modelValue.
 * The amount is restored as a number, so that deserializing is the inverse of serializing.
 * An empty serializedValue gives an undefined modelValue, which the `modelValue` setter turns
 * into an empty amount for the active currency.
 * @param {string} serializedValue
 * @returns {import("../types/index.js").AmountDropdownModelValue | undefined}
 */
export const deserializer = serializedValue => {
  if (!serializedValue) {
    return undefined;
  }
  const [currency, amount] = serializedValue.split(' ');
  if (isEmptyAmount(amount)) {
    return { currency, amount: '' };
  }
  const numericAmount = Number(amount);
  return {
    currency,
    amount: Number.isNaN(numericAmount) ? amount : numericAmount,
  };
};
