/* eslint-disable class-methods-use-this, camelcase, no-param-reassign, max-classes-per-file */

import { dedupeMixin, SlotMixin } from '@lion/core';
import { localize } from '@lion/localize';
import { Unparseable } from './Unparseable.js';
// import { debounce } from './utils/debounce.js';
import { pascalCase } from './utils/pascal-case.js';

import { Required } from './validators/Required.js';
import { ResultValidator } from './ResultValidator.js';
import { SyncUpdatableMixin } from './utils/SyncUpdatableMixin.js';

// TODO: move all feedback interaction to a different layer (?)
import '../lion-validation-feedback.js';

/**
 * @event error-state-changed fires when FormControl goes from non-error to error state and vice versa
 * @event error-changed fires when the Validator(s) leading to the error state, change
 */
export const ValidateMixin = dedupeMixin(
  superclass =>
    // eslint-disable-next-line no-unused-vars, no-shadow
    class ValidateMixin extends SyncUpdatableMixin(SlotMixin(superclass)) {
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

          /**
           * @desc value that al validation revolves around: once changed, will
           * automatically trigger validation
           */
          modelValue: Object,

          defaultValidators: Array,
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

      /**
       * @abstract
       * get _inputNode()
       */

      get _feedbackNode() {
        return this.querySelector('[slot=feedback]');
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

        this.validators = [];
        this.defaultValidators = [];

        this.hasErrorVisible = false;

        // Subclassers can enable this to show multiple feedback messages at the same time
        this._hasAllFeedbackVisible = false;
      }

      get _allValidators() {
        return [...this.validators, ...this.defaultValidators];
      }

      connectedCallback() {
        super.connectedCallback();
        // TODO: move to extending layer
        localize.addEventListener('localeChanged', this._renderFeedback);
      }

      firstUpdated(c) {
        super.firstUpdated(c);
        this.__validateInitialized = true;
        this.validate();
        this.__handleA11yErrorVisible();
      }

      disconnectedCallback() {
        super.disconnectedCallback();
        // TODO: move to extending layer
        localize.removeEventListener('localeChanged', this._renderFeedback);
      }

      updateSync(name, oldValue) {
        super.updateSync(name, oldValue);
        console.log('updateSync', name, oldValue);
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

        if (c.has('hasErrorVisible')) {
          this.__handleA11yErrorVisible();
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
       * @desc step 1-3
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
       * @desc step 2, calls __finishValidation
       * @param {Validator[]} syncValidators
       */
      __executeSyncValidators(syncValidators, value, { hasAsync }) {
        if (syncValidators.length) {
          this.__syncValidationResult = syncValidators.filter(v => v.execute(value, v.param));
        }
        this.__finishValidation({ source: 'sync', hasAsync });
      }

      /**
       * @desc step 3, calls __finishValidation
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
       * @desc step 4, called by __finishValidation
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
       *
       * @param {object} options
       * @param {'sync'|'async'} options.source
       * @param {boolean} [options.hasAsync] whether async validators are configured in this run.
       * If not, we have nothing left to wait for.
       */
      __finishValidation({ source, hasAsync }) {
        /** @typedef {Validator[]} RegularValidationResult */
        const syncAndAsyncOutcome = [
          ...this.__syncValidationResult,
          ...this.__asyncValidationResult,
        ];
        // if we have any ResultValidators left, now is the time to run them...
        const resultOutCome = this.__executeResultValidators(syncAndAsyncOutcome);

        /** @typedef {Validator[]} TotalValidationResult */
        this.__validationResult = [...resultOutCome, ...syncAndAsyncOutcome];
        this._storeResultsOnInstance(this.__validationResult);

        /** private event that should be listened to by LionFieldSet */
        this.dispatchEvent(new Event('validate-performed', { bubbles: true, composed: true }));

        if (source === 'async' || !hasAsync) {
          this.__validateCompleteResolve();
        }

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
        console.log('__setupValidators');
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
       * @param {Validator[]} validators list of objects having a .getMessage method
       * @return {Feedback[]}
       */
      async __getMessageMap(validators) {
        return Promise.all(
          validators.map(async validator => {
            const message = await validator._getMessage({
              validatorParams: validator.param,
              modelValue: this.modelValue,
              formControl: this,
            });
            return { message, type: validator.type, validator };
          }),
        );
      }

      /**
       * @desc Responsible for retrieving messages from Validators and
       * (delegation of) rendering them.
       *
       * For`._feedbackNode` (extension of LionValidationFeedback):
       * - retrieve messages from highest prio Validators
       * - provide the result to custom feedback node and let the
       * custom node decide on their renderings
       *
       * In both cases:
       * - we compute the 'show' flag (like 'hasErrorVisible') for all types
       * - we set the customValidity message of the highest prio Validator
       * - we set aria-invalid="true" in case hasErrorVisible is true
       */
      async _renderFeedback() {
        let feedbackCompleteResolve;
        this.feedbackComplete = new Promise(resolve => {
          feedbackCompleteResolve = resolve;
        });

        /** @type {Validator[]} */
        this.__prioritizedResult = this._prioritizeAndFilterFeedback({
          validationResult: this.__validationResult,
        });

        // Will be used for synchronization with "._inputNode"
        this._validationMessage = '';
        const messageMap = await this.__getMessageMap(this.__prioritizedResult);

        if (messageMap.length) {
          this._validationMessage = messageMap[0].message;
          // Set type, message, validator
          this._feedbackNode.feedbackData = messageMap;
        } else {
          this._feedbackNode.feedbackData = undefined;
        }
        this.__storeTypeVisibilityOnInstance(this.__prioritizedResult);
        feedbackCompleteResolve();
      }

      __storeTypeVisibilityOnInstance(prioritizedValidators) {
        const result = {};
        this.__validatorTypeHistoryCache.forEach(previouslyStoredType => {
          result[`has${pascalCase(previouslyStoredType)}Visible`] = false;
        });

        prioritizedValidators.forEach(v => {
          result[`has${pascalCase(v.type)}Visible`] = true;
        });

        Object.assign(this, result);
      }

      /**
       * Orders all active validators in this.__validationResult. Can
       * also filter out occurrences (based on interaction states)
       * @overridable
       * @returns {Validator[]} ordered list of Validators with feedback messages visible to the
       * end user
       */
      _prioritizeAndFilterFeedback({ validationResult }) {
        const types = this.constructor.validationTypes;
        // Sort all validators based on the type provided.
        const res = validationResult.sort((a, b) => types.indexOf(a.type) - types.indexOf(b.type));
        if (this._hasAllFeedbackVisible) {
          // If a Subclasser configured this, show all the ordered messages
          return res;
        }
        // By default, just like the platform, only show one message with highest prio.
        return res.slice(0,1);
      }

      __handleA11yErrorVisible() {
        // Screen reader output should be in sync with visibility of error messages
        if (this._inputNode) {
          this._inputNode.setAttribute('aria-invalid', this.hasErrorVisible);
          // this._inputNode.setCustomValidity(this._validationMessage || '');
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
