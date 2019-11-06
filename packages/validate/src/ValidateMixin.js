/* eslint-disable class-methods-use-this, camelcase, no-param-reassign, max-classes-per-file */

import { dedupeMixin } from '@lion/core';
import { Unparseable } from './Unparseable.js';
import { pascalCase } from './utils/pascal-case.js';
import { Required } from './validators/Required.js';
import { ResultValidator } from './ResultValidator.js';
import { SyncUpdatableMixin } from './utils/SyncUpdatableMixin.js';

/**
 * @desc Handles all validation, based on modelValue changes. It has no knowledge about dom and
 * UI. All error visibility, dom interaction and accessibility are handled in FeedbackMixin.
 *
 * @event error-state-changed fires when FormControl goes from non-error to error state and vice versa
 * @event error-changed fires when the Validator(s) leading to the error state, change
 */
export const ValidateMixin = dedupeMixin(
  superclass =>
    // eslint-disable-next-line no-unused-vars, no-shadow
    class ValidateMixin extends SyncUpdatableMixin(superclass) {
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
           * FormControl.errorStates; // => { required: true, minLength: false }
           * FormControl.errorStates.required; // => true
           */
          errorStates: {
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
           * FormControl.hasError; // => true
           */
          hasError: {
            type: Boolean,
            attribute: 'has-error',
            reflect: true,
          },

          /**
           * @desc flag that indicates whether async validation is pending
           */
          isPending: {
            type: Boolean,
            attribute: 'is-pending',
            reflect: true,
          },

          /**
           * @desc value that al validation revolves around: once changed (usually triggered by
           * end user entering input), it will automatically trigger validation.
           */
          modelValue: Object,

          /**
           * @desc specialized fields (think of input-date and input-email) can have preconfigured
           * validators.
           */
          defaultValidators: Array,
        };
      }

      /**
       * @overridable
       */
      static get validationTypes() {
        return ['error'];
      }

      get _allValidators() {
        return [...this.validators, ...this.defaultValidators];
      }

      constructor() {
        super();

        this.isPending = false;
        /** @type {Validator[]} */
        this.validators = [];
        /** @type {Validator[]} */
        this.defaultValidators = [];

        /** @type {Validator[]} */
        this.__syncValidationResult = [];

        /** @type {Validator[]} */
        this.__asyncValidationResult = [];

        /**
         * @desc contains results from sync Validators, async Validators and ResultValidators
         * @type {Validator[]}
         */
        this.__validationResult = [];

        /**
         * Stores all types that have been validated. Needed for clearing
         * previously stored states on the instance
         */
        this.__validatorTypeHistoryCache = new Set();
        this.constructor.validationTypes.forEach(t => this.__validatorTypeHistoryCache.add(t));

        this.__onValidatorUpdated = this.__onValidatorUpdated.bind(this);
      }

      firstUpdated(c) {
        super.firstUpdated(c);
        this.__validateInitialized = true;
        this.validate();
      }

      updateSync(name, oldValue) {
        super.updateSync(name, oldValue);
        if (name === 'validators') {
          // trigger validation (ideally only for the new or changed validator)
          this.__setupValidators();
          this.validate();
        } else if (name === 'modelValue') {
          this.validate({ clearCurrentResult: true });
        }
      }

      updated(c) {
        super.updated(c);
        this.constructor.validationTypes.forEach(type => {
          if (c.has(`${type}States`)) {
            this.dispatchEvent(
              new Event(`${type}-states-changed`, { bubbles: true, composed: true }),
            );
          }

          if (c.has(`has${pascalCase(type)}`)) {
            this.dispatchEvent(new Event(`has-${type}-changed`, { bubbles: true, composed: true }));
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
       * - A.1 The FormControl is empty: further execution is halted. When the Required Validator
       * (being mutually exclusive to the other Validators) is applied, it will end up in the
       * validation result (as the only Validator, since further execution was halted).
       * - A.2 There are synchronous Validators: this is the most common flow. When modelValue hasn't
       * changed since last async results were generated, 'sync results' are merged with the
       * 'async results'.
       * - A.3 There are asynchronous Validators: for instance when server side evaluation is needed.
       * Executions are scheduled and awaited and the 'async results' are merged with the
       * 'sync results'.
       *
       * - B. There are ResultValidators. After steps A.1, A.2, or A.3 are finished, the holistic
       * ResultValidators (evaluating the total result of the 'regular' (A.1, A.2 and A.3) validators)
       * will be run...
       *
       * Situations A.2 and A.3 are not mutually exclusive and can be triggered within one validate()
       * call. Situation B will occur after every call.
       */
      async validate({ clearCurrentResult } = {}) {
        if (!this.__validateInitialized) {
          return;
        }

        this.__storePrevResult();
        if (clearCurrentResult) {
          // Clear ('invalidate') all pending and existing validation results.
          // This is needed because we have async (pending) validators whose results
          // need to be merged with those of sync validators and vice versa.
          this.__clearValidationResults();
        }
        await this.__executeValidators();
      }

      __storePrevResult() {
        this.__prevValidationResult = this.__validationResult;
      }

      /**
       * @desc step A1-3 + B (as explained in 'validate')
       */
      async __executeValidators() {
        this.validateComplete = new Promise(resolve => {
          this.__validateCompleteResolve = resolve;
        });

        // When the modelValue can't be created by FormatMixin.parser, still allow all validators
        // to give valuable feedback to the user based on the current viewValue.
        const value =
          this.modelValue instanceof Unparseable ? this.modelValue.viewValue : this.modelValue;

        /** @type {Validator} */
        const requiredValidator = this._allValidators.find(v => v instanceof Required);

        /**
         * 1. Handle the 'exceptional' Required validator:
         * - the validatity is dependent on the formControl type and therefore determined
         * by the formControl.__isEmpty method. Basically, the Required Validator is a means
         * to trigger formControl.__isEmpty.
         * - when __isEmpty returns false, the input was empty. This means we need to stop
         * validation here, because all other Validators' execute functions assume the
         * value is not empty (there would be nothing to validate).
         */
        const isEmpty = this.__isEmpty(value);
        if (isEmpty) {
          if (requiredValidator) {
            this.__syncValidationResult = [requiredValidator];
          }
          this.__finishValidation({ source: 'sync' });
          return;
        }

        // Separate Validators in sync and async
        const /** @type {Validator[]} */ filteredValidators = this._allValidators.filter(
            v => !(v instanceof ResultValidator) && !(v instanceof Required),
          );
        const /** @type {Validator[]} */ syncValidators = filteredValidators.filter(v => !v.async);
        const /** @type {Validator[]} */ asyncValidators = filteredValidators.filter(v => v.async);

        /**
         * 2. Synchronous validators
         */
        this.__executeSyncValidators(syncValidators, value, {
          hasAsync: Boolean(asyncValidators.length),
        });

        /**
         * 3. Asynchronous validators
         */
        await this.__executeAsyncValidators(asyncValidators, value);
      }

      /**
       * @desc step A2, calls __finishValidation
       * @param {Validator[]} syncValidators
       */
      __executeSyncValidators(syncValidators, value, { hasAsync }) {
        if (syncValidators.length) {
          this.__syncValidationResult = syncValidators.filter(v =>
            v.execute(value, v.param, { node: this }),
          );
        }
        this.__finishValidation({ source: 'sync', hasAsync });
      }

      /**
       * @desc step A3, calls __finishValidation
       * @param {Validator[]} filteredValidators all Validators except required and ResultValidators
       */
      async __executeAsyncValidators(asyncValidators, value) {
        if (asyncValidators.length) {
          this.isPending = true;
          const resultPromises = asyncValidators.map(v => v.execute(value, v.param));
          const booleanResults = await Promise.all(resultPromises);
          this.__asyncValidationResult = booleanResults
            .map((r, i) => asyncValidators[i]) // Create an array of Validators
            .filter((v, i) => booleanResults[i]); // Only leave the ones returning true
          this.__finishValidation({ source: 'async' });
          this.isPending = false;
        }
      }

      /**
       * @desc step B, called by __finishValidation
       * @param {Validator[]} regularValidationResult result of steps 1-3
       */
      __executeResultValidators(regularValidationResult) {
        /** @type {ResultValidator[]} */
        const resultValidators = this._allValidators.filter(
          v => !v.async && v instanceof ResultValidator,
        );

        return resultValidators.filter(v =>
          v.executeOnResults({
            regularValidationResult,
            prevValidationResult: this.__prevValidationResult,
          }),
        );
      }

      /**
       * @param {object} options
       * @param {'sync'|'async'} options.source
       * @param {boolean} [options.hasAsync] whether async validators are configured in this run.
       * If not, we have nothing left to wait for.
       */
      __finishValidation({ source, hasAsync }) {
        const /** @type {Validator[]} */ syncAndAsyncOutcome = [
            ...this.__syncValidationResult,
            ...this.__asyncValidationResult,
          ];
        // if we have any ResultValidators left, now is the time to run them...
        const resultOutCome = this.__executeResultValidators(syncAndAsyncOutcome);

        /** @typedef {Validator[]} TotalValidationResult */
        this.__validationResult = [...resultOutCome, ...syncAndAsyncOutcome];
        this._storeResultsOnInstance(this.__validationResult);

        /** private event that should be listened to by FeedbackMixin / LionFieldSet */
        this.dispatchEvent(new Event('validate-performed', { bubbles: true, composed: true }));
        if (source === 'async' || !hasAsync) {
          this.__validateCompleteResolve();
        }
      }

      /**
       * @desc For all results, for all types, stores results on instance.
       * For errors, this means:
       * - this.hasError = true/false;
       * - this.errorStates = {
       *  [validatorName1]: true,
       *  [validatorName2]: true,
       * }
       * Note that 'this.hasErrorVisible' won't be set here: it will be based on the outcome of
       * method `._proritizeAndFilterFeedback`.
       * @param {Validator[]} valResult
       */
      _storeResultsOnInstance(valResult) {
        const instanceResult = {};
        this.__resetInstanceValidationStates(instanceResult);

        valResult.forEach(validator => {
          // By default, this will be reflected to attr 'error-state' in case of
          // 'error' type. Subclassers supporting different types need to
          // configure attribute reflection themselves.
          instanceResult[`has${pascalCase(validator.type)}`] = true;
          instanceResult[`${validator.type}States`] =
            instanceResult[`${validator.type}States`] || {};
          instanceResult[`${validator.type}States`][validator.name] = true;
          this.__validatorTypeHistoryCache.add(validator.type);
        });
        Object.assign(this, instanceResult);
      }

      __resetInstanceValidationStates(instanceResult) {
        this.__validatorTypeHistoryCache.forEach(previouslyStoredType => {
          instanceResult[`has${pascalCase(previouslyStoredType)}`] = false;
          instanceResult[`${previouslyStoredType}States`] = {};
        });
      }

      __clearValidationResults() {
        this.__syncValidationResult = [];
        this.__asyncValidationResult = [];
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
        this._allValidators.forEach(v => {
          events.forEach(e => v.addEventListener(e, this.__onValidatorUpdated));
          v.onFormControlConnect(this);
        });
        this.__prevValidators = this._allValidators;
      }

      static _hasObjectChanged(result, prevResult) {
        return JSON.stringify(result) !== JSON.stringify(prevResult);
      }

      __isEmpty(v) {
        if (typeof this._isEmpty === 'function') {
          return this._isEmpty(v);
        }
        // // TODO: move to compat layer. Be sure to keep this, because people use this a lot
        // if (typeof this.__isRequired === 'function') {
        //   return !this.__isRequired(v);
        // }
        return v === null || typeof v === 'undefined' || v === '';
      }
    },
);
