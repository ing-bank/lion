/**
 * Very lightweight message formatter.
 * It supports 'key replacement' formatting
 */
export class MessageFormatLite {
  constructor(message) {
    this.message = message;
  }

  /**
   * @desc key replacement formatter (supports nested keys)
   * - from:
   *   - message: 'replace {key} to {obj.k}'
   *   - vars: {key: 'val' obj: {k: 'nestedVal'}}
   * - to: 'replace val to nestedVal'
   * @param {object} vars key value map of variables to be replaced
   */
  format(vars) {
    if (!vars) {
      return this.message;
    }
    let result = this.message;
    const varsKeys = Object.keys(vars);
    const messageKeys = this.message.match(/\{.*?\}/gm) || []; // gets ['{key}', '{obj.k}']
    messageKeys.forEach(keyWithAccolades => {
      const k = keyWithAccolades.slice(1, -1);
      if (varsKeys.includes(k)) {
        // if '{key}'
        result = result.replace(`${keyWithAccolades}`, vars[k]);
      } else if (k.includes('.')) {
        // if '{obj.k}'
        const pathKeys = k.split('.');
        const /** @type {string} */ replacement = pathKeys.reduce((res, acc) => res[acc], vars);
        result = result.replace(`${keyWithAccolades}`, replacement);
      }
    });
    return result;
  }
}
