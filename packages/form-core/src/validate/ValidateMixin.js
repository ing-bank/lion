/* eslint-disable class-methods-use-this, camelcase, no-param-reassign, max-classes-per-file */
import { dedupeMixin, ScopedElementsMixin, SlotMixin, DisabledMixin } from '@lion/core';
// TODO: make form-core independent from localize
import { localize } from '@lion/localize';
import { AsyncQueue } from '../utils/AsyncQueue.js';
import { pascalCase } from '../utils/pascalCase.js';
import { SyncUpdatableMixin } from '../utils/SyncUpdatableMixin.js';
import { LionValidationFeedback } from './LionValidationFeedback.js';
import { ResultValidator } from './ResultValidator.js';
import { Unparseable } from './Unparseable.js';
import { Validator } from './Validator.js';
import { Required } from './validators/Required.js';
import { FormControlMixin } from '../FormControlMixin.js';

/**
 * @typedef {import('../../types/validate/ValidateMixinTypes').ValidateMixin} ValidateMixin
 */

/**
 * @param {any[]} array1
 * @param {any[]} array2
 */
function arrayDiff(array1 = [], array2 = []) {
  return array1.filter(x => !array2.includes(x)).concat(array2.filter(x => !array1.includes(x)));
}

/**
 * @desc Handles all validation, based on modelValue changes. It has no knowledge about dom and
 * UI. All error visibility, dom interaction and accessibility are handled in FeedbackMixin.
 *
 * @type {ValidateMixin}
 * @param {import('@open-wc/dedupe-mixin').Constructor<import('@lion/core').LitElement>} superclass
 */
export const ValidateMixinImplementation = superclass =>
  class extends FormControlMixin(
    SyncUpdatableMixin(DisabledMixin(SlotMixin(ScopedElementsMixin(superclass)))),
  ) {
    static get scopedElements() {
      const scopedElementsCtor = /** @type {typeof import('@open-wc/scoped-elements/src/types').ScopedElementsHost} */ (super
        .constructor);
      return {
        ...scopedElementsCtor.scopedElements,
        'lion-validation-feedback': LionValidationFeedback,
      };
    }

    static get properties() {
      return {
        validators: { attribute: false },

        hasFeedbackFor: { attribute: false },

        shouldShowFeedbackFor: { attribute: false },

        showsFeedbackFor: {
          type: Array,
          attribute: 'shows-feedback-for',
          reflect: true,
          converter: {
            fromAttribute: /** @param {string} value */ value => value.split(','),
            toAttribute: /** @param {[]} value */ value => value.join(','),
          },
        },

        validationStates: { attribute: false },

        /**
         * @desc flag that indicates whether async validation is pending
         */
        isPending: {
          type: Boolean,
          attribute: 'is-pending',
          reflect: true,
        },

        /**
         * @desc specialized fields (think of input-date and input-email) can have preconfigured
         * validators.
         */
        defaultValidators: { attribute: false },

        /**
         * Subclassers can enable this to show multiple feedback messages at the same time
         * By default, just like the platform, only one message (with highest prio) is visible.
         */
        _visibleMessagesAmount: { attribute: false },
      };
    }

    /**
     * @overridable
     */
    static get validationTypes() {
      return ['error'];
    }

    /**
     * @overridable
     * Adds "._feedbackNode" as described below
     */
    get slots() {
      /**
       * FIXME: Ugly workaround https://github.com/microsoft/TypeScript/issues/40110
       * @callback getScopedTagName
       * @param {string} tagName
       * @returns {string}
       *
       * @typedef {Object} ScopedElementsObj
       * @property {getScopedTagName} getScopedTagName
       */
      const ctor = /** @type {typeof ValidateMixin & ScopedElementsObj} */ (this.constructor);
      return {
        ...super.slots,
        feedback: () => document.createElement(ctor.getScopedTagName('lion-validation-feedback')),
      };
    }

    get _allValidators() {
      return [...this.validators, ...this.defaultValidators];
    }

    constructor() {
      super();

      /** @type {string[]} */
      this.hasFeedbackFor = [];

      /** @type {string[]} */
      this.shouldShowFeedbackFor = [];

      /** @type {string[]} */
      this.showsFeedbackFor = [];

      /** @type {Object.<string, Object.<string, boolean>>} */
      this.validationStates = {};

      this._visibleMessagesAmount = 1;

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

      this.__onValidatorUpdated = this.__onValidatorUpdated.bind(this);
      this._updateFeedbackComponent = this._updateFeedbackComponent.bind(this);
    }

    connectedCallback() {
      super.connectedCallback();
      localize.addEventListener('localeChanged', this._updateFeedbackComponent);
    }

    disconnectedCallback() {
      super.disconnectedCallback();
      localize.removeEventListener('localeChanged', this._updateFeedbackComponent);
    }

    /**
     * @param {import('lit-element').PropertyValues} changedProperties
     */
    firstUpdated(changedProperties) {
      super.firstUpdated(changedProperties);
      this.__validateInitialized = true;
      this.validate();
    }

    /**
     * @param {string} name
     * @param {?} oldValue
     */
    updateSync(name, oldValue) {
      super.updateSync(name, oldValue);
      if (name === 'validators') {
        // trigger validation (ideally only for the new or changed validator)
        this.__setupValidators();
        this.validate({ clearCurrentResult: true });
      } else if (name === 'modelValue') {
        this.validate({ clearCurrentResult: true });
      }

      if (['touched', 'dirty', 'prefilled', 'submitted', 'hasFeedbackFor'].includes(name)) {
        this._updateShouldShowFeedbackFor();
      }

      if (name === 'showsFeedbackFor') {
        // This can't be reflected asynchronously in Safari
        // Screen reader output should be in sync with visibility of error messages
        if (this._inputNode) {
          this._inputNode.setAttribute('aria-invalid', `${this._hasFeedbackVisibleFor('error')}`);
          // this._inputNode.setCustomValidity(this._validationMessage || '');
        }

        const diff = arrayDiff(this.showsFeedbackFor, oldValue);
        if (diff.length > 0) {
          this.dispatchEvent(new Event(`showsFeedbackForChanged`, { bubbles: true }));
        }
        diff.forEach(type => {
          this.dispatchEvent(
            new Event(`showsFeedbackFor${pascalCase(type)}Changed`, { bubbles: true }),
          );
        });
      }

      if (name === 'shouldShowFeedbackFor') {
        const diff = arrayDiff(this.shouldShowFeedbackFor, oldValue);
        if (diff.length > 0) {
          this.dispatchEvent(new Event(`shouldShowFeedbackForChanged`, { bubbles: true }));
        }
      }
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
     *
     * @param {{ clearCurrentResult?: boolean }} [opts]
     */
    async validate({ clearCurrentResult } = {}) {
      if (this.disabled) {
        this.__clearValidationResults();
        this.__finishValidation({ source: 'sync', hasAsync: true });
        this._updateFeedbackComponent();
        return;
      }
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

      /** @type {Validator | undefined} */
      const requiredValidator = this._allValidators.find(v => v instanceof Required);

      /**
       * 1. Handle the 'exceptional' Required validator:
       * - the validatity is dependent on the formControl type and therefore determined
       * by the formControl.__isEmpty method. Basically, the Required Validator is a means
       * to trigger formControl.__isEmpty.
       * - when __isEmpty returns true, the input was empty. This means we need to stop
       * validation here, because all other Validators' execute functions assume the
       * value is not empty (there would be nothing to validate).
       */
      // TODO: Try to remove this when we have a single lion form core package, because then we can
      // depend on FormControlMixin directly, and _isEmpty will always be an existing method on the prototype then
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
      const /** @type {Validator[]} */ syncValidators = filteredValidators.filter(v => {
          const vCtor = /** @type {typeof Validator} */ (v.constructor);
          return !vCtor.async;
        });
      const /** @type {Validator[]} */ asyncValidators = filteredValidators.filter(v => {
          const vCtor = /** @type {typeof Validator} */ (v.constructor);
          return vCtor.async;
        });

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
     * @param {unknown} value
     * @param {{ hasAsync: boolean }} opts
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
     * @param {Validator[]} asyncValidators all Validators except required and ResultValidators
     * @param {?} value
     */
    async __executeAsyncValidators(asyncValidators, value) {
      if (asyncValidators.length) {
        this.isPending = true;
        const resultPromises = asyncValidators.map(v => v.execute(value, v.param, { node: this }));
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
      const resultValidators = /** @type {ResultValidator[]} */ (this._allValidators.filter(v => {
        const vCtor = /** @type {typeof Validator} */ (v.constructor);
        return !vCtor.async && v instanceof ResultValidator;
      }));

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
      const syncAndAsyncOutcome = [...this.__syncValidationResult, ...this.__asyncValidationResult];
      // if we have any ResultValidators left, now is the time to run them...
      const resultOutCome = this.__executeResultValidators(syncAndAsyncOutcome);

      this.__validationResult = [...resultOutCome, ...syncAndAsyncOutcome];
      // this._storeResultsOnInstance(this.__validationResult);

      const ctor = /** @type {typeof import('../../types/validate/ValidateMixinTypes').ValidateHost} */ (this
        .constructor);

      /** @type {Object.<string, Object.<string, boolean>>} */
      const validationStates = ctor.validationTypes.reduce(
        (acc, type) => ({ ...acc, [type]: {} }),
        {},
      );
      this.__validationResult.forEach(v => {
        if (!validationStates[v.type]) {
          validationStates[v.type] = {};
        }
        const vCtor = /** @type {typeof Validator} */ (v.constructor);
        validationStates[v.type][vCtor.validatorName] = true;
      });
      this.validationStates = validationStates;

      this.hasFeedbackFor = [...new Set(this.__validationResult.map(v => v.type))];

      /** private event that should be listened to by LionFieldSet */
      this.dispatchEvent(new Event('validate-performed', { bubbles: true }));
      if (source === 'async' || !hasAsync) {
        if (this.__validateCompleteResolve) {
          this.__validateCompleteResolve();
        }
      }
    }

    __clearValidationResults() {
      this.__syncValidationResult = [];
      this.__asyncValidationResult = [];
    }

    /**
     * @param {Event|CustomEvent} e
     */
    __onValidatorUpdated(e) {
      if (e.type === 'param-changed' || e.type === 'config-changed') {
        this.validate();
      }
    }

    __setupValidators() {
      const events = ['param-changed', 'config-changed'];
      if (this.__prevValidators) {
        this.__prevValidators.forEach(v => {
          events.forEach(e => {
            if (v.removeEventListener) {
              v.removeEventListener(e, this.__onValidatorUpdated);
            }
          });
          v.onFormControlDisconnect(this);
        });
      }
      this._allValidators.forEach(v => {
        if (!(v instanceof Validator)) {
          // throws in constructor are not visible to end user so we do both
          const errorType = Array.isArray(v) ? 'array' : typeof v;
          const errorMessage = `Validators array only accepts class instances of Validator. Type "${errorType}" found.`;
          // eslint-disable-next-line no-console
          console.error(errorMessage, this);
          throw new Error(errorMessage);
        }
        const ctor = /** @type {typeof import('../../types/validate/ValidateMixinTypes').ValidateHost} */ (this
          .constructor);
        if (ctor.validationTypes.indexOf(v.type) === -1) {
          const vCtor = /** @type {typeof Validator} */ (v.constructor);
          // throws in constructor are not visible to end user so we do both
          const errorMessage = `This component does not support the validator type "${v.type}" used in "${vCtor.validatorName}". You may change your validators type or add it to the components "static get validationTypes() {}".`;
          // eslint-disable-next-line no-console
          console.error(errorMessage, this);
          throw new Error(errorMessage);
        }
        events.forEach(e => {
          if (v.addEventListener) {
            v.addEventListener(e, this.__onValidatorUpdated);
          }
        });
        v.onFormControlConnect(this);
      });
      this.__prevValidators = this._allValidators;
    }

    /**
     * @param {?} v
     */
    __isEmpty(v) {
      if (typeof this._isEmpty === 'function') {
        return this._isEmpty(v);
      }
      return (
        this.modelValue === null || typeof this.modelValue === 'undefined' || this.modelValue === ''
      );
    }

    // ------------------------------------------------------------------------------------------
    // -- Feedback specifics --------------------------------------------------------------------
    // ------------------------------------------------------------------------------------------

    /**
     * @typedef {object} FeedbackMessage
     * @property {string | Node} message this
     * @property {string} type will be 'error' for messages from default Validators. Could be
     * 'warning', 'info' etc. for Validators with custom types. Needed as a directive for
     * feedbackNode how to render a message of a certain type
     * @property {Validator} [validator] when the message is directly coupled to a Validator
     * (in most cases), this property is filled. When a message is not coupled to a Validator
     * (in case of success feedback which is based on a diff or current and previous validation
     * results), this property can be left empty.
     */

    /**
     * @param {Validator[]} validators list of objects having a .getMessage method
     * @return {Promise.<FeedbackMessage[]>}
     */
    async __getFeedbackMessages(validators) {
      let fieldName = await this.fieldName;
      return Promise.all(
        validators.map(async validator => {
          if (validator.config.fieldName) {
            fieldName = await validator.config.fieldName;
          }
          const message = await validator._getMessage({
            modelValue: this.modelValue,
            formControl: this,
            fieldName,
          });
          return { message, type: validator.type, validator };
        }),
      );
    }

    /**
     * @desc Responsible for retrieving messages from Validators and
     * (delegation of) rendering them.
     *
     * For `._feedbackNode` (extension of LionValidationFeedback):
     * - retrieve messages from highest prio Validators
     * - provide the result to custom feedback node and let the
     * custom node decide on their renderings
     *
     * In both cases:
     * - we compute the 'show' flag (like 'hasErrorVisible') for all types
     * - we set the customValidity message of the highest prio Validator
     * - we set aria-invalid="true" in case hasErrorVisible is true
     */
    _updateFeedbackComponent() {
      const { _feedbackNode } = this;
      if (!_feedbackNode) {
        return;
      }

      if (!this.__feedbackQueue) {
        this.__feedbackQueue = new AsyncQueue();
      }

      if (this.showsFeedbackFor.length > 0) {
        this.__feedbackQueue.add(async () => {
          /** @type {Validator[]} */
          this.__prioritizedResult = this._prioritizeAndFilterFeedback({
            validationResult: this.__validationResult,
          });
          const messageMap = await this.__getFeedbackMessages(this.__prioritizedResult);

          _feedbackNode.feedbackData = messageMap.length ? messageMap : [];
        });
      } else {
        this.__feedbackQueue.add(async () => {
          _feedbackNode.feedbackData = [];
        });
      }
      this.feedbackComplete = this.__feedbackQueue.complete;
    }

    /**
     * Show the validity feedback when returning true, don't show when false
     *  @param {string} type
     */
    // eslint-disable-next-line no-unused-vars
    _showFeedbackConditionFor(type) {
      return true;
    }

    /**
     * @param {string} type
     */
    _hasFeedbackVisibleFor(type) {
      return (
        this.hasFeedbackFor &&
        this.hasFeedbackFor.includes(type) &&
        this.shouldShowFeedbackFor &&
        this.shouldShowFeedbackFor.includes(type)
      );
    }

    /** @param {import('lit-element').PropertyValues} changedProperties */
    updated(changedProperties) {
      super.updated(changedProperties);

      if (
        changedProperties.has('shouldShowFeedbackFor') ||
        changedProperties.has('hasFeedbackFor')
      ) {
        const ctor = /** @type {typeof import('../../types/validate/ValidateMixinTypes').ValidateHost} */ (this
          .constructor);
        // Necessary typecast because types aren't smart enough to understand that we filter out undefined
        this.showsFeedbackFor = /** @type {string[]} */ (ctor.validationTypes
          .map(type => (this._hasFeedbackVisibleFor(type) ? type : undefined))
          .filter(_ => !!_));
        this._updateFeedbackComponent();
      }
    }

    _updateShouldShowFeedbackFor() {
      const ctor = /** @type {typeof import('../../types/validate/ValidateMixinTypes').ValidateHost} */ (this
        .constructor);
      // Necessary typecast because types aren't smart enough to understand that we filter out undefined
      this.shouldShowFeedbackFor = /** @type {string[]} */ (ctor.validationTypes
        .map(type => (this._showFeedbackConditionFor(type) ? type : undefined))
        .filter(_ => !!_));
    }

    /**
     * @overridable
     * @desc Orders all active validators in this.__validationResult. Can
     * also filter out occurrences (based on interaction states)
     * @param {{ validationResult: Validator[] }} opts
     * @return {Validator[]} ordered list of Validators with feedback messages visible to the
     * end user
     */
    _prioritizeAndFilterFeedback({ validationResult }) {
      const ctor = /** @type {typeof import('../../types/validate/ValidateMixinTypes').ValidateHost} */ (this
        .constructor);
      const types = ctor.validationTypes;
      // Sort all validators based on the type provided.
      const res = validationResult.sort((a, b) => types.indexOf(a.type) - types.indexOf(b.type));
      return res.slice(0, this._visibleMessagesAmount);
    }
  };

export const ValidateMixin = dedupeMixin(ValidateMixinImplementation);
