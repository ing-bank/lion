/* eslint-disable class-methods-use-this, camelcase, no-param-reassign, max-classes-per-file */

import { dedupeMixin, SlotMixin } from '@lion/core';
import { localize } from '@lion/localize';
import { Unparseable } from './Unparseable.js';
// import { debounce } from './utils/debounce.js';
import { pascalCase } from './utils/pascal-case.js';

import { Required } from './validators.js';
// import { Validator } from './Validator.js';
import { ResultValidator } from './ResultValidator.js';
import { SyncUpdatableMixin } from './utils/SyncUpdatableMixin.js';
import './validation-feedback/lion-validation-feedback.js';

/**
 * @event error-state-changed fires when FormControl goes from non-error to error state and vice versa
 * @event error-changed fires when the Validator(s) leading to the error state, change
 */
export const ValidateCoreMixin = dedupeMixin(
  superclass =>
    // eslint-disable-next-line no-unused-vars, no-shadow
    class ValidateCoreMixin extends SyncUpdatableMixin(SlotMixin(superclass)) {
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
           * @desc Derived from the result of _prioritizeAndFilterFeedback
           * @type {boolean}
           * @example
           * FormControl.hasError; // => true
           * FormControl.hasErrorVisible; // => false
           * // Interaction state changes (for instance: user blurs the field)
           * FormControl.hasErrorVisible; // => true
           */
          hasErrorVisible: {
            type: Boolean,
            attribute: 'has-error-visible',
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
          feedback: () => document.createElement('lion-validation-feedback'),
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
        this.constructor.validationTypes.forEach(t => this.__validatorTypeHistoryCache.add(t));

        this.__onValidatorUpdated = this.__onValidatorUpdated.bind(this);

        this.__validators = [];
        this._defaultValidators = [];
      }

      set validators(v) {
        const oldValue = this.validators;
        this.__validators = v;
        this.requestUpdate('validators', oldValue);
      }

      get validators() {
        return [...this.__validators, ...this._defaultValidators];
      }

      connectedCallback() {
        super.connectedCallback();
        localize.addEventListener('localeChanged', this._renderFeedback);
      }

      disconnectedCallback() {
        super.disconnectedCallback();
        localize.removeEventListener('localeChanged', this._renderFeedback);
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
              new Event(`${type}-states-changed`, { bubbles: true, composed: true })
            );
          }

          if (c.has(`has${pascalCase(type)}`)) {
            this.dispatchEvent(
              new Event(`has-${type}-changed`, { bubbles: true, composed: true }),
            );
          }
        });

        if (c.has('hasErrorVisible')) {
          this.__handleA11yErrorVisible();
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
        console.log('validate ', this.modelValue);

        // TODO: find a better way to do this. It might block required validation.
        // Also, we should think about falsy values like '' and null (see __isEmpty and __isRequired)
        if (this.modelValue === undefined) {
          this.__resetInstanceValidationStates();
          return;
        }
        this.__storePrevResult();
        if (clearCurrentResult) {
          // Clear ('invalidate') all pending and existing validation results.
          // This is needed because we have async (pending) validators whose results
          // need to be merged with those of sync validators and vice versa.
          this.__clearValidationResults();
        }
        this.__executeValidators();
      }

      __storePrevResult() {
        this.__prevValidationResult = this.__validationResult;
      }

      async __executeValidators() {
        console.log('__executeValidators');

        // When the modelValue can't be created by FormatMixin.parser, still allow all validators
        // to give valuable feedback to the user based on the current viewValue.
        const value =
          this.modelValue instanceof Unparseable ? this.modelValue.viewValue : this.modelValue;

        /** @type {Validator} */
        const requiredValidator = this.validators.find(v => v instanceof Required);

        /**
         * 1. Handle the 'exceptional' Required validator:
         * - the validatity is dependent on the formControl type and therefore determined
         * by the formControl.__isRequired method. Basically, the Required Validator is a means
         * to trigger formControl.__isRequired.
         * - when __isRequired returns false, the input was empty. This means we need to stop
         * validation here, because all Validators' execute functions assume the
         * value is not empty (there would be nothing to validate).
         */
        const isEmpty = this.__isEmpty(value);
        if (isEmpty) {
          if (requiredValidator) {
            this.__syncValidationResult = [requiredValidator];
          }
          this.__finishValidation();
          return;
        }

        const filteredValidators =
          this.validators.filter(v => !(v instanceof ResultValidator) && !(v instanceof Required));

        /**
         * 2. Synchronous validators
         */
        /** @type {Validator[]} */
        const syncValidators = filteredValidators.filter(v => !v.async);

        if (syncValidators.length) {
          this.__syncValidationResult = syncValidators.filter(v => v.execute(value, v.param));
          this.__finishValidation();
        }

        /**
         * 3. Asynchronous validators
         */
        const /** @type {Validator[]} */ asyncValidators = filteredValidators.filter(v => v.async);

        if (asyncValidators.length) {
          this.isPending = true;
          const resultPromises = asyncValidators.map(v => v.execute(value, v.param));
          const results = await Promise.all(resultPromises);
          this.__asyncValidationResult = results
            .map((r, i) => asyncValidators[i])
            .filter((v, i) => results[i]);
          this.__finishValidation();
          this.isPending = false;
        }
      }

      __executeResultValidators(regularValidationResult) {
        /** @type {ResultValidator[]} */
        const resultValidators = this.validators
          .filter(v => !v.async && v instanceof ResultValidator);

        return resultValidators.filter(v => v.executeOnResults({
          regularValidationResult,
          prevValidationResult: this.__prevValidationResult,
          validator: this.validators,
        }));
      }

      __finishValidation() {
        /** @typedef {Validator[]} RegularValidationResult */
        const combinedResult = [...this.__syncValidationResult, ...this.__asyncValidationResult];
        // if we have any ResultValidators left, now is the time to run them...
        const holisticResult = this.__executeResultValidators(combinedResult);

        /** @typedef {Validator[]} TotalValidationResult */
        this.__validationResult = [
          ...holisticResult,
          ...this.__syncValidationResult,
          ...this.__asyncValidationResult
        ];

        this._storeResultsOnInstance(this.__validationResult);
        /** @event validation-done inform the outside world (LionFieldset amongst others) */
        this.dispatchEvent(new Event('validation-done', { bubbles: true, composed: true }));
        this._renderFeedback();
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
        console.log('_storeResultsOnInstance ');
        const instanceResult = {};
        this.__resetInstanceValidationStates();

        valResult.forEach(validator => {
          // By default, this will be reflected to attr 'error-state' in case of
          // 'error' type. Subclassers supporting different types need to
          // configure attribute reflection themselves.
          instanceResult[`has${pascalCase(validator.type)}`] = true;
          instanceResult[`${validator.type}States`] = instanceResult[`${validator.type}States`] || {};
          instanceResult[`${validator.type}States`][validator.name] = true;
          this.__validatorTypeHistoryCache.add(validator.type);
        });
        Object.assign(this, instanceResult);
      }

      __resetInstanceValidationStates() {
        this.__validatorTypeHistoryCache.forEach(previouslyStoredType => {
          this[`has${pascalCase(previouslyStoredType)}`] = false;
          this[`${previouslyStoredType}States`] = {};
        });
      }

      __clearValidationResults() {
        this.__syncValidationResult = [];
        this.__asyncValidationResult = [];
        // this._storeResultsOnInstance();
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
       * @type {Element} FeedbackNode:
       * Gets a `FeedbackData` object as its input.
       * This element can be a custom made (web) component that renders messages in accordance with
       * the implemented Design System. For instance, it could add an icon in front of a message.
       * The FeedbackNode is only responsible for the visual rendering part, it should NOT contain
       * state. All state will be determined by the outcome of `FormControl.filterFeeback()`.
       * FormControl delegates to individual sub elements and decides who renders what.
       * For instance, FormControl itself is responsible for reflecting error-state and error-show
       * to its host element.
       * This means filtering out messages should happen in FormControl and NOT in `FeedbackNode`
       *
       * - gets a FeedbackData object as input
       * - should know about the FeedbackMessage types('error', 'success' etc.) that the FormControl
       * (having ValidateMixin applied) returns
       * -
       *
       */

      /**
       * @typedef {object} FeedbackMessage
       * @property {string} message this
       * @property {string} type will be 'error' for messages from default Validators. Could be
       * 'warning', 'info' etc. for Validators with custom types. Needed as a directive for
       * feedbackNode how to render a message of a certain type
       * @property {Validator} [validator] when the message is directly coupled to a Validator
       * (in most cases), this property is filled. When a message is not coupled to a Validator
       * (in case of success feedback which is based on a diff or current and previous validation
       * results), this property can be left empty.
       */

      /**
       * @typedef FeedbackData
       * @property {FeedbackMessage[]} messages
       * @property {FeedbackMeta} meta
       */

      /**
       * @param {Validator[]} validators list of object having a .getMessage method (could
       * either be Validators or objects returned )
       * @return {FeedbackMessage[]}
       */
      async __getMessageMap(validators) {
        return Promise.all(
          validators.map(async (validator) => {
            const message = await validator.getMessage({
              fieldName: this.getFieldName(validator.config),
              validatorParams: validator.param,
              modelValue: this.modelValue,
            });
            return { message, type: validator.type, validator };
          }),
        );
      }

      /**
       * @desc Responsible for retrieving messages from Validators and
       * (delegation of) rendering them.
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
        /** @type {Validator[]} */
        this.__prioritizedResult = this._prioritizeAndFilterFeedback();
        // Will be used for synchronization with "._inputNode"
        this._validationMessage = '';
        const messageMap = await this.__getMessageMap(this.__prioritizedResult);

        if (messageMap.length) {
          this._validationMessage = messageMap[0].message;

          // Set type, message, validator
          Object.assign(this._feedbackNode, messageMap[0]);
        }

        // const hasCustomFeedbackNode = typeof this._feedbackNode.renderFeedback === 'function';
        // if (!hasCustomFeedbackNode) {
        //   // Just like the platform, show one message at a time
        //   this.__storeTypeVisibilityOnInstance(this.__prioritizedResult.slice(0,1));
        //   this._feedbackNode.textContent = this._validationMessage;
        // } else {
        //   // Show multiple messages, depending on the outcome of _prioritizeAndFilterFeedback
        //   this.__storeTypeVisibilityOnInstance(this.__prioritizedResult);
        //   this._feedbackNode.renderFeedback(messageMap);
        // }
      }

      __storeTypeVisibilityOnInstance(prioritizedValidators) {
        const result = {};
        this.__validatorTypeHistoryCache.forEach(previouslyStoredType => {
          result[`has${pascalCase(previouslyStoredType)}Visible`] = false;
        });

        // console.log('__storeTypeVisibilityOnInstance', prioritizedValidators);
        prioritizedValidators.forEach(v => {
          result[`has${pascalCase(v.type)}Visible`] = true;
        });

        Object.assign(result, this);
      }

      /**
       * Orders all active validators in this.__validationResult. Can
       * also filter out occurrences (based on interaction states)
       * @overridable
       * @returns {Validator[]}
       */
      _prioritizeAndFilterFeedback({ validationResult } = { validationResult: this.__validationResult}) {
        const types = this.constructor.validationTypes;
        return validationResult.sort((a, b) => types.indexOf(b.type) - types.indexOf(a.type));
      }

      __handleA11yErrorVisible() {
        // Screen reader output should be in sync with visibility of error messages
        if (this.inputElement) {
          this.inputElement.setAttribute('aria-invalid', this.hasErrorVisible);
          // this.inputElement.setCustomValidity(this._validationMessage || '');
        }
      }

      __handleA11yPendingValidator() {
        if (this.inputElement) {
          this.inputElement.setAttribute('aria-busy', this.isPending);
        }
      }

      static _hasObjectChanged(result, prevResult) {
        if (!prevResult) return true;
        return Object.keys(result).join('') !== Object.keys(prevResult).join('');
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
