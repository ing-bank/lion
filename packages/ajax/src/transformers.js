/**
 * @param {string} prefix
 */
export function jsonPrefixTransformerFactory(prefix) {
  return /** @param {string} data */ data => {
    let result = data;
    if (typeof result === 'string') {
      if (prefix.length > 0 && result.indexOf(prefix) === 0) {
        result = result.substring(prefix.length);
      }
      try {
        result = JSON.parse(result);
      } catch (e) {
        /* ignore to allow non-JSON responses */
      }
    }
    return result;
  };
}
