export class Validator extends EventTarget {
  constructor(param, config) {
    super();
    this.name = '';
    this.async = false;
    this.__param = param;
    this.__config = config || {};
    this.type = (config && config.type) || 'error'; // Default type supported by ValidateMixin
  }

  /**
   * @desc The function that returns a Boolean
   * @param {string|Date|Number|object} modelValue
   * @param {object} param
   * @returns {Boolean|Promise<Boolean>}
   */
  execute(modelValue, param) { // eslint-disable-line

  }

  set param(p) {
    this.__param = p;
    this.dispatchEvent(new Event('param-changed'));
  }

  get param() {
    return this.__param;
  }

  set config(c) {
    this.__config = c;
    this.dispatchEvent(new Event('config-changed'));
  }

  get config() {
    return this.__config;
  }

  /**
   *
   * @returns {string|Promise<string>|(data) => string}
   */
  async getMessage(data) {
    if (typeof this.config.message === 'string') {
      return this.config.message;
    }
    if (typeof this.config.message === 'function') {
      return this.config.message(data);
    }
    return this.constructor.getMessage(data);
  }

  static async getMessage(data) {} // eslint-disable-line

  /**
   * @param {FormControl} formControl
   */
  onFormControlConnect(formControl) {} // eslint-disable-line

  /**
   * @param {FormControl} formControl
   */
  onFormControlDisconnect(formControl) {} // eslint-disable-line
}

// For simplicity, a default validator only handles one state:
// it can either be true or false an it will only have one message.
// In more advanced cases (think of the feedback mechanism for the maximum number of
// characters in Twitter), more states are needed. The alternative of
// having multiple distinct validators would be cumbersome to create and maintain,
// also because the validations would tie too much into each others logic.

