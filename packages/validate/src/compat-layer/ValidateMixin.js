import { dedupeMixin } from '@lion/core';
import { ValidateCoreMixin } from '../ValidateCoreMixin.js';
import { fromValidatorClass, toValidatorClass } from './compat-utils.js';

/**
 * @event warning-state-changed fires when FormControl goes from non-warning to warning state
 * @event warning-changed fires when the active Validator(s) triggering the warning state change
 * @event info-state-changed fires when FormControl goes from non-info to info state
 * @event info-changed fires when the active Validator(s) triggering the info state change
 * @event success-state-changed fires when FormControl goes from non-info to info state
 * @event success-changed fires when the active Validator(s) triggering the info state change
 */
// eslint-disable-next-line
export const ValidateMixin = dedupeMixin((superclass) => class ValidateMixin extends ValidateCoreMixin(superclass) {
  static get properties() {
    return {
      errorValidators: Array,
      warningValidators: Array,
      warning: Object,
      warningState: {
        type: Boolean,
        attribute: 'warning-state',
        reflect: true,
      },
      warningShow: {
        type: Boolean,
        attribute: 'warning-show',
        reflect: true,
      },
      infoValidators: Array,
      info: Object,
      infoState: {
        type: Boolean,
        attribute: 'info-state',
        reflect: true,
      },
      infoShow: {
        type: Boolean,
        attribute: 'info-show',
        reflect: true,
      },
      successValidators: Array,
      success: Object,
      successState: {
        type: Boolean,
        attribute: 'success-state',
        reflect: true,
      },
      successShow: {
        type: Boolean,
        attribute: 'success-show',
        reflect: true,
      },
      defaultSuccessFeedback: Boolean,
    };
  }

  constructor() {
    super();
    this.validators = [];
  }

  static get validationTypes() {
    return ['error', 'warning', 'info', 'success'];
  }

  __validatorsWithout(type) {
    return this.validators.filter((v) => v.type !== type);
  }

  set errorValidators(valArray) {
    this.__setTypeValidators(valArray, 'error');
  }

  set warningValidators(valArray) {
    this.__setTypeValidators(valArray, 'warning');
  }

  set infoValidators(valArray) {
    this.__setTypeValidators(valArray, 'info');
  }

  set successValidators(valArray) {
    this.__setTypeValidators(valArray, 'success');
  }

  __setTypeValidators(valArray, type) {
    const oldValue = this[`${type}Validators`];
    this.validators = [
      ...this.__validatorsWithout(type),
      ...this.constructor.__toValidatorClasses(valArray, type),
    ];
    this.requestUpdate(`${type}Validators`, oldValue);
  }

  get errorValidators() {
    return this.__filterValidatorType('error');
  }

  get warningValidators() {
    return this.__filterValidatorType('warning');
  }

  get infoValidators() {
    return this.__filterValidatorType('info');
  }

  get successValidators() {
    return this.__filterValidatorType('success');
  }

  static __toValidatorClasses(valArray, type) {
    return valArray.map((v) => toValidatorClass(v, type));
  }

  __filterValidatorType(type) {
    if (!this.validators) {
      return undefined;
    }
    return this.validators.filter((v) => v.type === type).map((v) => fromValidatorClass(v));
  }

  static _determineIfRequiredValidator(validator) {
    return super._determineIfRequiredValidator(validator) ||
      (typeof validator === 'string' && validator === 'required');
  }

  __isEmpty(v) {
    if (typeof this.__isRequired === 'function') {
      return !Object.values(this.__isRequired(v))[0];
    }
    return super.__isEmpty(v);
  }

  updated(changedProperties) {
    super.updated(changedProperties);

    // @deprecated adding css classes for backwards compatibility
    this.constructor.validationTypes.forEach((type) => {
      if (changedProperties.has(`${type}State`)) {
        this.classList[this[`${type}State`] ? 'add' : 'remove'](`state-${type}`);
      }
      if (changedProperties.has(`${type}Show`)) {
        this.classList[this[`${type}Show`] ? 'add' : 'remove'](`state-${type}-show`);
      }
    });
    if (changedProperties.has('invalid')) {
      this.classList[this.invalid ? 'add' : 'remove'](`state-invalid`);
    }
  }

  /**
   * Special case for ok validators starting with 'random'. Example for randomOk:
   *   - will fetch translation for randomOk (should contain multiple translations keys)
   *   - split by ',' and then use one of those keys
   *   - will remember last random choice so it does not change on key stroke
   *   - remembering can be reset with this.__lastGetSuccessResult = false;
   */
  getSuccessTranslationsKeys(data) {
    let key = `success.${data.validatorName}`;
    if (this.__lastGetSuccessResult && data.validatorName.indexOf('random') === 0) {
      return this.__lastGetSuccessResult;
    }
    if (data.validatorName.indexOf('random') === 0) {
      const getKeys = this.constructor.__getLocalizeKeys(key, data.validatorName);
      const keysToConsider = this.translateMessage(getKeys); // eslint-disable-line max-len
      if (keysToConsider) {
        const randomKeys = keysToConsider.split(',');
        key = randomKeys[Math.floor(Math.random() * randomKeys.length)].trim();
      }
    }
    const result = this.constructor.__getLocalizeKeys(key, data.validatorName);
    this.__lastGetSuccessResult = result;
    return result;
  }

  /**
   * old name, content still overridable
   */
  get _feedbackElement() {
    return this.querySelector('[slot=feedback]');
  }

  get _feedbackNode() {
    return this._feedbackElement;
  }
});
