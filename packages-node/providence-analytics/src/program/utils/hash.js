/**
 * @param {string|object} inputValue
 * @returns {string}
 */
export function hash(inputValue) {
  if (typeof inputValue === 'object') {
    // eslint-disable-next-line no-param-reassign
    inputValue = JSON.stringify(inputValue);
  }
  return String(
    inputValue.split('').reduce(
      (prevHash, currVal) =>
        // eslint-disable-next-line no-bitwise
        ((prevHash << 5) - prevHash + currVal.charCodeAt(0)) | 0,
      0,
    ),
  );
}
