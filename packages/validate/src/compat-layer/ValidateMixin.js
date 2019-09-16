import { dedupeMixin } from '@lion/core';
import { ValidateCoreMixin } from '../ValidateCoreMixin.js';
import { fromValidatorClass, toValidatorClass } from './compat-utils.js';
import { DefaultSuccess } from '../validators.js';

/**
 * @event warning-state-changed fires when FormControl goes from non-warning to warning state
 * @event warning-changed fires when the active Validator(s) triggering the warning state change
 * @event info-state-changed fires when FormControl goes from non-info to info state
 * @event info-changed fires when the active Validator(s) triggering the info state change
 * @event success-state-changed fires when FormControl goes from non-info to info state
 * @event success-changed fires when the active Validator(s) triggering the info state change
 */
export const ValidateMixin =
// eslint-disable-next-line
dedupeMixin((superclass) => class ValidateMixin extends ValidateCoreMixin(superclass) {
  static get properties() {
    return {
      error: Object,
      errorState: {
        type: Boolean,
        attribute: 'error-state',
        reflect: true,
      },
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
      /**
       * @desc This state is always in sync with 'errorState'. It aligns more
       * with the vocabularity of the platform (aria-invalid) and will be set exclusively
       * for Validators with a blocking type (which means only for Validators of type 'error').
       * @deprecated use errorState
       */
      invalid: {
        type: Boolean,
        reflect: true,
      },
    };
  }

  constructor() {
    super();
    const ctor = this.constructor;
    const valForTypes = [];
    ctor.validationTypes.forEach((type) => {
      (this.getValidatorsForType(type) || []).forEach((v) => {
        valForTypes.push(toValidatorClass(v, type));
      });
    });
    this._defaultValidators = [...this._defaultValidators, ...valForTypes];
    this._defaultValidators.push(new DefaultSuccess());
  }

  /**
   * @deprecated use `this._defaultValidators.push(MyValidator)` instead
   * @override
   */
  getValidatorsForType() { // eslint-disable-line class-methods-use-this
    return [];
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
   * @deprecated old name, content still overridable
   */
  get _feedbackElement() {
    return this.querySelector('[slot=feedback]');
  }

  get _feedbackNode() {
    return this._feedbackElement;
  }
});
