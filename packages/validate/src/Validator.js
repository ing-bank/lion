import { fakeExtendsEventTarget } from './utils/fake-extends-event-target.js';

export class Validator {
  constructor(param, config) {
    fakeExtendsEventTarget(this);

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
  execute(/* modelValue, param */) {
    if (!this.name) {
      throw new Error('You must provide a name like "this.name = \'IsCat\'" for your Validator');
    }
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
   * @overridable
   * @param {object} data
   * @param {*} data.modelValue
   * @param {string} data.fieldName
   * @param {*} data.params
   * @param {string} data.type
   * @returns {string|Node|Promise<stringOrNode>|() => stringOrNode)}
   */
  async _getMessage(data) {
    const composedData = {
      name: this.name,
      type: this.type,
      params: this.param,
      config: this.config,
      ...data,
    };
    if (this.config.getMessage) {
      if (typeof this.config.getMessage === 'function') {
        return this.config.getMessage(composedData);
      }
      throw new Error(
        `You must provide a value for getMessage of type 'function', you provided a value of type: ${typeof this
          .config.getMessage}`,
      );
    }
    return this.constructor.getMessage(composedData);
  }

  /**
   * @overridable
   * @param {object} data
   * @param {*} data.modelValue
   * @param {string} data.fieldName
   * @param {*} data.params
   * @param {string} data.type
   * @returns {string|Node|Promise<stringOrNode>|() => stringOrNode)}
   */
  static async getMessage(/* data */) {
    return `Please configure an error message for "${this.name}" by overriding "static async getMessage()"`;
  }

  /**
   * @param {FormControl} formControl
   */
  onFormControlConnect(formControl) {} // eslint-disable-line

  /**
   * @param {FormControl} formControl
   */
  onFormControlDisconnect(formControl) {} // eslint-disable-line

  /**
   * @desc Used on async Validators, makes it able to do perf optimizations when there are
   * pending "execute" calls with outdated values.
   * ValidateMixin calls Validator.abortExecution() an async Validator can act accordingly,
   * depending on its implementation of the "execute" function.
   * - For instance, when fetch was called:
   * https://stackoverflow.com/questions/31061838/how-do-i-cancel-an-http-fetch-request
   * - Or, when a webworker was started, its process could be aborted and then restarted.
   */
  abortExecution() {} // eslint-disable-line
}

// For simplicity, a default validator only handles one state:
// it can either be true or false an it will only have one message.
// In more advanced cases (think of the feedback mechanism for the maximum number of
// characters in Twitter), more states are needed. The alternative of
// having multiple distinct validators would be cumbersome to create and maintain,
// also because the validations would tie too much into each others logic.
