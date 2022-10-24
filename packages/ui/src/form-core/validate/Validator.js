/**
 * @typedef {import('../../types/validate').FeedbackMessageData} FeedbackMessageData
 * @typedef {import('../../types/validate').ValidatorParam} ValidatorParam
 * @typedef {import('../../types/validate').ValidatorConfig} ValidatorConfig
 * @typedef {import('../../types/validate').ValidatorOutcome} ValidatorOutcome
 * @typedef {import('../../types/validate').ValidatorName} ValidatorName
 * @typedef {import('../../types/validate').ValidationType} ValidationType
 * @typedef {import('../FormControlMixin').FormControlHost} FormControlHost
 */

// TODO: support attribute validators like <my-el my-validator=${dynamicParam}></my-el> =>
// register in a ValidateService that is read by Validator and adds these attrs in properties
// object.
// They would become like configurable
// [global attributes](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes)
// for FormControls.

export class Validator extends EventTarget {
  /**
   * @param {ValidatorParam} [param]
   * @param {ValidatorConfig} [config]
   */
  constructor(param, config) {
    super();

    /** @type {ValidatorParam} */
    this.__param = param;
    /** @type {ValidatorConfig} */
    this.__config = config || {};
    /** @type {ValidationType} */
    this.type = config?.type || 'error'; // Default type supported by ValidateMixin
  }

  /**
   * The name under which validation results get registered. For convience and predictability, this
   * should always be the same as the constructor name (since it will be obfuscated in js builds,
   * we need to provide it separately).
   * @type {ValidatorName}
   */
  static validatorName = '';

  /**
   * Whether the validator is asynchronous or not. When true., this means execute function returns
   * a Promise. This can be handy for:
   * - server side calls
   * - validations that are dependent on lazy loaded resources (they can be async until the dependency
   * is loaded)
   * @type {boolean}
   */
  static async = false;

  /**
   * The function that returns a validity outcome. When we need to show feedback,
   * it should return true, otherwise false. So when an error\info|warning|success message
   * needs to be shown, return true. For async Validators, the function can return a Promise.
   * It's also possible to return an enum. Let's say that a phone number can have multiple
   * states: 'invalid-country-code' | 'too-long' | 'too-short'
   * Those states can be retrieved in the getMessage
   * @param {any} modelValue
   * @param {ValidatorParam} [param]
   * @param {ValidatorConfig} [config]
   * @returns {ValidatorOutcome|Promise<ValidatorOutcome>}
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

  /**
   * The first argument of the constructor, for instance 3 in `new MinLength(3)`. Will
   * be stored on Validator instance and passed to `execute` function
   * @example
   * ```js
   *  // Store reference to Validator instance
   *  const myValidatorInstance = new MyValidator(1);
   *  // Use this instance initially on a FormControl (that uses ValidateMixin)
   *  render(html`<validatable-element .validators="${[myValidatorInstance]}"></validatable-element>`, document.body);
   *  // Based on some event, we need to change the param
   *  myValidatorInstance.param = 2;
   * ```
   * @property {ValidatorParam}
   */
  set param(p) {
    this.__param = p;
    /**
     * This event is listened for by ValidateMixin. Whenever the validation parameter has
     * changed, the FormControl will revalidate itself
     */
    this.dispatchEvent(new Event('param-changed'));
  }

  get param() {
    return this.__param;
  }

  /**
   * The second argument of the constructor, for instance
   * `new MinLength(3, {getFeedMessage: async () => 'too long'})`.
   * Will be stored on Validator instance and passed to `execute` function.
   * @example
   * ```js
   *  // Store reference to Validator instance
   *  const myValidatorInstance = new MyValidator(1, {getMessage() => 'x'});
   *  // Use this instance initially on a FormControl (that uses ValidateMixin)
   *  render(html`<validatable-element .validators="${[myValidatorInstance]}"></validatable-element>`, document.body);
   *  // Based on some event, we need to change the param
   *  myValidatorInstance.config = {getMessage() => 'y'};
   * ```
   * @property {ValidatorConfig}
   */
  set config(c) {
    this.__config = c;
    /**
     * This event is listened for by ValidateMixin. Whenever the validation config has
     * changed, the FormControl will revalidate itself
     */
    this.dispatchEvent(new Event('config-changed'));
  }

  get config() {
    return this.__config;
  }

  /**
   * This is a protected method that usually should not be overridden. It is called by ValidateMixin
   * and it gathers data to be passed to getMessage functions found:
   * - `this.config.getMessage`, locally provided by consumers of the Validator (overrides global getMessage)
   * - `MyValidator.getMessage`, globally provided by creators or consumers of the Validator
   *
   * Confusion can arise because of similarities with former mentioned methods. In that regard, a
   * better name for this function would have been _pepareDataAndCallHighestPrioGetMessage.
   * @example
   * ```js
   * class MyValidator extends Validator {
   *   // ...
   *   // 1. globally defined
   *   static async getMessage() {
   *     return 'lowest prio, defined globally by Validator author'
   *   }
   * }
   * // 2. globally overridden
   * MyValidator.getMessage = async() => 'overrides already configured message';
   * // 3. locally overridden
   * new MyValidator(myParam, { getMessage: async() => 'locally defined, always wins' });
   * ```
   * @param {Partial<FeedbackMessageData>} [data]
   * @returns {Promise<string|Element>}
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
   * Called inside Validator.prototype._getMessage (see explanation).
   * @example
   * ```js
   * class MyValidator extends Validator {
   *   static async getMessage() {
   *     return 'lowest prio, defined globally by Validator author'
   *   }
   * }
   * // globally overridden
   * MyValidator.getMessage = async() => 'overrides already configured message';
   * ```
   * @overridable
   * @param {Partial<FeedbackMessageData>} [data]
   * @returns {Promise<string|Element>}
   */
  // eslint-disable-next-line no-unused-vars
  static async getMessage(data) {
    return `Please configure an error message for "${this.name}" by overriding "static async getMessage()"`;
  }

  /**
   * Validators are allowed to have knowledge about FormControls.
   * In some cases (in case of the Required Validator) we wanted to enhance accessibility by
   * adding [aria-required]. Also, it would be possible to write an advanced MinLength
   * Validator that adds a .preprocessor that restricts from typing too many characters
   * (like the native [minlength] validator).
   * Will be called when Validator is added to FormControl.validators.
   * @example
   * ```js
   * onFormControlConnect(formControl) {
   *   if(formControl.inputNode) {
   *     inputNode.setAttribute('aria-required', 'true');
   *   }
   * }
   *
   * ```
   * @configurable
   * @param {FormControlHost} formControl
   */
  onFormControlConnect(formControl) {} // eslint-disable-line

  /**
   * Also see `onFormControlConnect`.
   * Will be called when Validator is removed from FormControl.validators.
   * @example
   * ```js
   * onFormControlDisconnect(formControl) {
   *   if(formControl.inputNode) {
   *     inputNode.removeAttribute('aria-required');
   *   }
   * }
   * @configurable
   * @param {FormControlHost} formControl
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
