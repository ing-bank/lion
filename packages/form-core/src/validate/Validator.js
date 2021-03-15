/**
 * @typedef {object} MessageData
 * @property {*} [MessageData.modelValue]
 * @property {string} [MessageData.fieldName]
 * @property {HTMLElement} [MessageData.formControl]
 * @property {string} [MessageData.type]
 * @property {Object.<string,?>} [MessageData.config]
 * @property {string} [MessageData.name]
 */

export class Validator {
  /**
   *
   * @param {?} [param]
   * @param {Object.<string,?>} [config]
   */
  constructor(param, config) {
    this.__fakeExtendsEventTarget();

    /** @type {?} */
    this.__param = param;

    /** @type {Object.<string,?>} */
    this.__config = config || {};
    this.type = (config && config.type) || 'error'; // Default type supported by ValidateMixin
  }

  static get validatorName() {
    return '';
  }

  static get async() {
    return false;
  }

  /**
   * @desc The function that returns a Boolean
   * @param {?} [modelValue]
   * @param {?} [param]
   * @param {{}} [config]
   * @returns {Boolean|Promise<Boolean>}
   */
  // eslint-disable-next-line no-unused-vars, class-methods-use-this
  execute(modelValue, param, config) {
    const ctor = /** @type {typeof Validator} */ (this.constructor);
    if (!ctor.validatorName) {
      throw new Error(
        'A validator needs to have a name! Please set it via "static get validatorName() { return \'IsCat\'; }"',
      );
    }
    return true;
  }

  set param(p) {
    this.__param = p;
    if (this.dispatchEvent) {
      this.dispatchEvent(new Event('param-changed'));
    }
  }

  get param() {
    return this.__param;
  }

  set config(c) {
    this.__config = c;
    if (this.dispatchEvent) {
      this.dispatchEvent(new Event('config-changed'));
    }
  }

  get config() {
    return this.__config;
  }

  /**
   * @overridable
   * @param {MessageData} [data]
   * @returns {Promise<string|Node>}
   * @protected
   */
  async _getMessage(data) {
    const ctor = /** @type {typeof Validator} */ (this.constructor);
    const composedData = {
      name: ctor.validatorName,
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
    return ctor.getMessage(composedData);
  }

  /**
   * @overridable
   * @param {MessageData} [data]
   * @returns {Promise<string|Node>}
   */
  // eslint-disable-next-line no-unused-vars
  static async getMessage(data) {
    return `Please configure an error message for "${this.name}" by overriding "static async getMessage()"`;
  }

  /**
   * @param {HTMLElement} formControl
   */
  onFormControlConnect(formControl) {} // eslint-disable-line

  /**
   * @param {HTMLElement} formControl
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

  /**
   * @private
   */
  __fakeExtendsEventTarget() {
    const delegate = document.createDocumentFragment();

    /**
     *
     * @param {string} type
     * @param {EventListener} listener
     * @param {Object} [opts]
     */
    const delegatedAddEventListener = (type, listener, opts) =>
      delegate.addEventListener(type, listener, opts);

    /**
     * @param {string} type
     * @param {EventListener} listener
     * @param {Object} [opts]
     */
    const delegatedRemoveEventListener = (type, listener, opts) =>
      delegate.removeEventListener(type, listener, opts);

    /**
     * @param {Event|CustomEvent} event
     */
    const delegatedDispatchEvent = event => delegate.dispatchEvent(event);

    this.addEventListener = delegatedAddEventListener;

    this.removeEventListener = delegatedRemoveEventListener;

    this.dispatchEvent = delegatedDispatchEvent;
  }
}

// For simplicity, a default validator only handles one state:
// it can either be true or false an it will only have one message.
// In more advanced cases (think of the feedback mechanism for the maximum number of
// characters in Twitter), more states are needed. The alternative of
// having multiple distinct validators would be cumbersome to create and maintain,
// also because the validations would tie too much into each others logic.
