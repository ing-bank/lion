/**
 * Serializes the modelValue to the international standard notation.
 * @param {import("../types/index.js").AmountDropdownModelValue} modelValue
 * @returns {string}
 */
export const serializer = modelValue =>
  /**
   * There seems to be some debate on a common international notation vs localization.
   * The unwritten standard is, e.g: EUR 123
   */
  `${modelValue?.currency} ${modelValue?.amount}`;

/**
 * Deserializes the serializedValue back to modelValue.
 * @param {string} serializedValue
 * @returns {import("../types/index.js").AmountDropdownModelValue}
 */
export const deserializer = serializedValue => {
  const [currency, amount] = serializedValue.split(' ');
  return {
    currency,
    amount,
  };
};
