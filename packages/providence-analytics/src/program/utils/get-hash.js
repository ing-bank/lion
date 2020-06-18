/**
 *
 * @param {string|object} inputValue
 * @returns {number}
 */
function getHash(inputValue) {
  if (typeof inputValue === 'object') {
    // eslint-disable-next-line no-param-reassign
    inputValue = JSON.stringify(inputValue);
  }
  return inputValue.split('').reduce(
    (prevHash, currVal) =>
      // eslint-disable-next-line no-bitwise
      ((prevHash << 5) - prevHash + currVal.charCodeAt(0)) | 0,
    0,
  );
}

module.exports = getHash;
