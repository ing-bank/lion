/* eslint-disable class-methods-use-this, camelcase, no-param-reassign, max-classes-per-file */

import { dedupeMixin, SlotMixin } from '@lion/core';
import { localize } from '@lion/localize';
import { Unparseable } from './Unparseable.js';
import { randomOk } from './legacy-validators.js';
// import { debounce } from './utils/debounce.js';
import { Required } from './validators.js';

/**
 * @event error-state-changed fires when FormControl goes from non-error to error state
 * @event error-changed fires when the active Validator(s) triggering the error state change
 */
export const ValidateCoreMixin = dedupeMixin(
  superclass =>
    // eslint-disable-next-line no-unused-vars, no-shadow, max-len, max-classes-per-file
    class ValidateCoreMixin extends SlotMixin(superclass) {
      static get properties() {
        return {
          /**
           * @desc List of all Validator instances applied to FormControl
           * @type {Validator[]}
           * @example
           * FormControl.validators = [new Required(), new MinLength(3, { type: 'warning' })];
           */
          validators: Array,

          /**
           * @desc Readonly validity states for all Validators of type 'error'
           * @type {ValidityStatesObject}
           * @example
           * FormControl.error; // => { required: true, minLength: false }
           * FormControl.error.required; // => true
           */
          error: {
            type: Object,
            hasChanged: this._hasObjectChanged,
          },

          /**
           * @desc Readonly state for the error type. When at least one Validator of
           * type 'error' is active (for instance required in case of an empty field),
           * this Boolean flag will be true.
           * For styling purposes, this state is reflected to an attribute
           * @type {boolean}
           * @example
           * FormControl.error; // => { required: true, minLength: false }
           * FormControl.error.required; // => true
           */
          errorState: {
            type: Boolean,
            attribute: 'error-state',
            reflect: true,
          },

          /**
           * @desc Derived from (descendant of) LionValidationFeedback, which is,
           * based on interactionStates, in control of hiding / showing validation messages.
           * For styling purposes, this state is reflected to an attribute.
           * @type {boolean}
           * @example
           * FormControl.errorState; // => true
           * FormControl.errorShow; // => false
           * // Interaction state changes (for instance: user blurs the field)
           * FormControl.errorShow; // => true
           */
          errorShow: {
            type: Boolean,
            attribute: 'error-show',
            reflect: true,
          },

          /**
           * @desc This state is always in sync with 'errorState'. It aligns more
           * with the vocabularity of the platform (aria-invalid) and will be set exclusively
           * for Validators with a blocking type (which means only for Validators of type 'error').
           * @deprecated
           */
          invalid: {
            type: Boolean,
            reflect: true,
          },

          /**
           * @desc flag that indicates whether async validation is pending
           */
          isPending: {
            type: Boolean,
            reflect: true,
            attribute: 'is-pending',
          },
        };
      }

      /**
       * @overridable
       */
      static get validationTypes() {
        return ['error'];
      }

      get slots() {
        return {
          ...super.slots,
          feedback: () => document.createElement('div'),
        };
      }

      get _feedbackNode() {
        return this.querySelector('[slot=feedback]');
      }

      /**
       * @overridable
       */
      getFieldName(validatorConfig) {
        const labelNode = this.querySelector('[slot=label]');
        const label = this.label || labelNode.textContent;

        // TODO: lowest level config should always win
        if (validatorConfig && validatorConfig.fieldName) {
          return validatorConfig.fieldName;
        }
        if (label) {
          return label;
        }
        return this.name;
      }

      constructor() {
        super();

        this.isPending = false;
        /**
         * @type {Validator[]}
         */
        this.__syncValidationResult = [];
        /**
         * @type {Validator[]}
         */
        this.__asyncValidationResult = [];
        /**
         * @type {Validator[]}
         */
        this.__validationResult = [];

        /**
         * Stores all types that have been validated. Needed to clear
         * previously stored states on the instance
         */
        this.__validatorTypeHistoryCache = new Set();
        this.__onValidatorUpdated = this.__onValidatorUpdated.bind(this);
      }

      connectedCallback() {
        super.connectedCallback();
        localize.addEventListener('localeChanged', this._renderFeedback);
        this.__connected = true;
      }

      disconnectedCallback() {
        super.disconnectedCallback();
        localize.removeEventListener('localeChanged', this._renderFeedback);
      }

      static __updateSyncHasChanged(name, oldValue) {
        const properties = this._classProperties;
        if (properties.get(name) && properties.get(name).hasChanged) {
          return properties.get(name).hasChanged(name, oldValue);
        }
        return true;
      }

      _requestUpdate(name, oldValue) {
        super._requestUpdate(name, oldValue);

        const ctor = this.constructor;
        if (!this.__connected) {
          this.__updateSyncQueue = this.__updateSyncQueue || [];
          this.__updateSyncQueue.push({ name, oldValue });
        } else if (this.__connected && !this.__isInitializedUpdateSyncQueue) {
          this.__isInitializedUpdateSyncQueue = true;
          this.__updateSyncQueue.forEach(({ name: n, oldValue: o }) => {
            if (ctor.__updateSyncHasChanged(n, o)) {
              this.updateSync(n, o);
            }
          });
        } else if (ctor.__updateSyncHasChanged(name, oldValue)) {
          this.updateSync(name, oldValue);
        }
      }

      updateSync(name) {
        // super.updateSync(name, oldValue);

        if (name === 'validators') {
          // trigger validation (ideally only for the new or changed validator)
          this.__setupValidators();
          this.validate();
        } else if (name === 'modelValue') {
          // Clear ('invalidate') all pending and existing validation results.
          // This is needed because we have async (pending) validators whose results
          // need to be merged with those of sync validators and vice versa.
          this.__clearValidationResults();
          this.validate();
        }
      }

      updated(c) {
        super.updated(c);

        this.constructor.validationTypes.forEach(type => {
          if (c.has(type)) {
            this.dispatchEvent(new Event(`${type}-changed`, { bubbles: true, composed: true }));
          }

          if (c.has(`${type}State`)) {
            this.dispatchEvent(
              new Event(`${type}-state-changed`, { bubbles: true, composed: true }),
            );
          }
        });

        if (c.has('errorShow')) {
          this.__handleA11yErrorShow();
        }

        if (c.has('isPending')) {
          this.__handleA11yPendingValidator();
        }

        if (c.has('label')) {
          // Since this can affect the outcome of `getFieldName()`, which is
          // passed down to the `getMessage` function of all Validators
          this._renderFeedback();
        }

        // TODO: Interaction state knowledge should be moved to FormControl...
        ['touched', 'dirty', 'submitted', 'prefilled'].forEach(iState => {
          if (c.has(iState)) {
            this._renderFeedback();
          }
        });
      }

      /**
       * @desc The main function of this mixin. Triggered by:
       *  - a modelValue change
       *  - a change in the 'validators' array
       * -  a change in the config of an individual Validator
       *
       * Three situations are handled:
       * 1. The Required Validator is present and the FormControl is empty: the FormControl is
       * invalid and further execution is halted.
       * 2. There are synchronous Validators: this is the most common flow. When modelValue hasn't
       * changed since last async results were generated, 'sync results' are merged with the
       * 'async results'.
       * 3. There are asynchronous Validators: for instance when server side evaluation is needed.
       * Executions are scheduled and awaited and the 'async results' are merged with the
       * 'sync results'.
       */
      async validate() {
        if (this.modelValue === undefined) {
          this.__resetInstanceValidationStates();
          return;
        }
        this.__executeValidators();
      }

      async __executeValidators() {
        this.__prevValidationResult = [
          ...this.__syncValidationResult,
          ...this.__asyncValidationResult,
        ];

        const ctor = this.constructor;
        // When the modelValue can't be created by FormatMixin.parser, still allow all validators
        // to give valuable feedback to the user based on the current viewValue.
        const value =
          this.modelValue instanceof Unparseable ? this.modelValue.viewValue : this.modelValue;

        /** @type {Validator} */
        const requiredValidator = this.validators.find(v => ctor._determineIfRequiredValidator(v));

        /**
         * 1. Handle the 'exceptional' Required validator:
         * - the validatity is dependent on the formControl type and therefore determined
         * by the formControl.__isRequired method. Basically, the Required Validator is a means
         * to trigger functionality of the FormControl instance.
         * - when __isRequired returns false, the input was empty. This means we need to stop
         * validation here, because all Validator's execute functions rely on the fact that their
         * value is not empty (since there would be nothing to validate).
         */
        const isEmpty = this.__isEmpty(value);
        if (isEmpty) {
          if (requiredValidator) {
            this.__syncValidationResult = [requiredValidator];
          }
          this.__finishValidation();
          return;
        }

        /**
         * 2. Synchronous validators
         */
        /** @type {Validator[]} */
        const syncValidators = this.validators.filter(v => !v.async && !(v instanceof Required));

        if (syncValidators.length) {
          this.__syncValidationResult = syncValidators.filter(v => !v.execute(value, v.param));
          this.__finishValidation();
        }

        /**
         * 3. Asynchronous validators
         */
        /** @type {Validator[]} */
        const asyncValidators = this.validators.filter(v => v.async && !(v instanceof Required));

        if (asyncValidators.length) {
          this.isPending = true;
          const resultPromises = asyncValidators.map(v => v.execute(value, v.param));
          const results = await Promise.all(resultPromises);
          this.__asyncValidationResult = results
            .map((r, i) => asyncValidators[i])
            .filter((v, i) => !results[i]);
          this.__finishValidation();
          this.isPending = false;
        }
      }

      __finishValidation() {
        this.__validationResult = [...this.__syncValidationResult, ...this.__asyncValidationResult];
        this._storeResultsOnInstance(this.__validationResult);
        /** @event validation-done inform the outside world (LionFieldset amongst others) */
        this.dispatchEvent(new Event('validation-done', { bubbles: true, composed: true }));
        this._renderFeedback();
      }

      /**
       * @desc For all results, for all types, stores results on instance.
       * For errors, this means:
       * this.errorState = true/false;
       * this.error = {
       *  [validatorName1]: true,
       *  [validatorName2]: true,
       * }
       * Note that 'errorShow' won't be set here: it will be based on the outcome of
       * method `showFeedbackCondition`. Also note that
       * @param {Validator[]} valResult
       */
      _storeResultsOnInstance(valResult) {
        const instanceResult = {};
        this.__resetInstanceValidationStates();

        valResult.forEach(validator => {
          // By default, this will be reflected to attr 'error-state' in case of
          // 'error' type. Subclassers supporting different types need to
          // configure attribute reflection themselves.
          instanceResult[`${validator.type}State`] = true;
          instanceResult[validator.type] = instanceResult[validator.type] || {};
          instanceResult[validator.type][validator.name] = true;
          this.__validatorTypeHistoryCache.add(validator.type);
        });
        Object.assign(this, instanceResult);
      }

      __resetInstanceValidationStates() {
        this.__validatorTypeHistoryCache.forEach(previouslyStoredType => {
          this[`${previouslyStoredType}State`] = false;
          this[previouslyStoredType] = {};
        });
      }

      __clearValidationResults() {
        this.__syncValidationResult = [];
        this.__asyncValidationResult = [];
        // this._storeResultsOnInstance();
      }

      /**
       * @overridable on compat layer
       */
      static _determineIfRequiredValidator(validator) {
        return validator instanceof Required;
      }

      __onValidatorUpdated(e) {
        if (e.type === 'param-changed' || e.type === 'config-changed') {
          this.validate();
        }
      }

      __setupValidators() {
        const events = ['param-changed', 'config-changed'];
        if (this.__prevValidators) {
          this.__prevValidators.forEach(v => {
            events.forEach(e => v.removeEventListener(e, this.__onValidatorUpdated));
            v.onFormControlDisconnect(this);
          });
        }
        this.validators.forEach(v => {
          events.forEach(e => v.addEventListener(e, this.__onValidatorUpdated));
          v.onFormControlConnect(this);
        });
        this.__prevValidators = this.validators;
      }

      /**
       * @desc Responsible for retrieving messages from Validators and
       * (delegation of) rendering of them.
       *
       * Two scenarios thinkable:
       * 1. We have no custom `._feedbackNode` defined:
       * - retrieve message from the highest prio Validator
       * - render the highest prio message to the feedback node
       * 2. We have a custom `._feedbackNode` defined:
       * - retrieve messages from highest prio Validators
       * - provide the result to custom feedback node and let the
       * custom node decide on their renderings
       *
       * In both cases:
       * - we compute the 'show' flag (like 'errorShow') for all types
       * - we set the customValidity message of the highest prio Validator
       * - we set aria-invalid="true" in case errorShow is true
       */
      async _renderFeedback() {
        const prioritizedValidators = this._prioritizeAndFilterFeedback();
        this._validationMessage = '';

        const messageMap = await Promise.all(
          prioritizedValidators.map(async validator => {
            const message = await validator.getMessage({
              fieldName: this.getFieldName(validator.config),
              validatorParams: validator.param,
              modelValue: this.modelValue,
            });
            return { message, validator };
          }),
        );

        if (messageMap.length) {
          this._validationMessage = messageMap[0].message;
        }

        this.__storeTypeShowStateOnInstance(prioritizedValidators);

        const hasCustomFeedbackNode = typeof this._feedbackNode.renderFeedback === 'function';
        if (!hasCustomFeedbackNode) {
          this._feedbackNode.textContent = this._validationMessage;
        } else {
          this._feedbackNode.renderFeedback(messageMap);
        }
      }

      __storeTypeShowStateOnInstance(prioritizedValidators) {
        const result = {};
        this.__validatorTypeHistoryCache.forEach(previouslyStoredType => {
          result[`${previouslyStoredType}Show`] = false;
        });

        prioritizedValidators.forEach(v => {
          result[`${v.type}Show`] = true;
        });

        Object.assign(result, this);
      }

      /**
       * Orders all active validators in this.__validationResult. Can
       * also filter out occurrences (based on interaction states)
       * @overridable
       * @returns {Validator[]}
       */
      _prioritizeAndFilterFeedback(validationResult = this.__validationResult) {
        const types = this.constructor.validationTypes;
        return validationResult.sort((a, b) => types.indexOf(b.type) - types.indexOf(a.type));
      }

      __handleA11yErrorShow() {
        // Screen reader output should be in sync with visibility of error messages
        if (this.inputElement) {
          this.inputElement.setAttribute('aria-invalid', this.errorShow);
          this.inputElement.setCustomValidity(this._validationMessage || '');
        }
      }

      __handleA11yPendingValidator() {
        if (this.inputElement) {
          this.inputElement.setAttribute('aria-busy', this.isPending);
        }
      }

      getValidatorsForType(type) {
        if (this.defaultSuccessFeedback && type === 'success') {
          return [[randomOk]].concat(this.successValidators || []);
        }
        return this[`${type}Validators`] || [];
      }

      static _hasObjectChanged(result, prevResult) {
        if (!prevResult) return true;
        return Object.keys(result).join('') !== Object.keys(prevResult).join('');
      }

      __isEmpty(v) {
        if (typeof this.__isRequired === 'function') {
          return !this.__isRequired(v);
        }
        return v === null || typeof v === 'undefined' || v === '';
      }
    },
);
