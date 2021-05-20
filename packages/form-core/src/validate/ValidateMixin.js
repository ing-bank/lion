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

// TODO: [v1] make all @readOnly => @readonly and actually make sure those values cannot be set

/**
 * @typedef {import('../../types/validate/ValidateMixinTypes').ValidateMixin} ValidateMixin
 * @typedef {import('../../types/validate/ValidateMixinTypes').ValidationType} ValidationType
 */

/**
 * @param {any[]} array1
 * @param {any[]} array2
 */
function arrayDiff(array1 = [], array2 = []) {
  return array1.filter(x => !array2.includes(x)).concat(array2.filter(x => !array1.includes(x)));
}

/**
 * Handles all validation, based on modelValue changes. It has no knowledge about dom and
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
      const scopedElementsCtor =
        /** @type {typeof import('@open-wc/scoped-elements/src/types').ScopedElementsHost} */ (
          super.constructor
        );
      return {
        ...scopedElementsCtor.scopedElements,
        'lion-validation-feedback': LionValidationFeedback,
      };
    }

    /** @type {any} */
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
        isPending: {
          type: Boolean,
          attribute: 'is-pending',
          reflect: true,
        },
        defaultValidators: { attribute: false },
        _visibleMessagesAmount: { attribute: false },
        __childModelValueChanged: { attribute: false },
      };
    }

    /**
     * Types of validation supported by this FormControl (for instance 'error'|'warning'|'info')
     * @overridable
     * @type {ValidationType[]}
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
        feedback: () => {
          const feedbackEl = document.createElement(
            ctor.getScopedTagName('lion-validation-feedback'),
          );
          feedbackEl.setAttribute('data-tag-name', 'lion-validation-feedback');
          return feedbackEl;
        },
      };
    }

    /**
     * Combination of validators provided by Application Developer and the default validators
     * @type {Validator[]}
     * @protected
     */
    get _allValidators() {
      return [...this.validators, ...this.defaultValidators];
    }

    constructor() {
      super();

      /**
       * As soon as validation happens (after modelValue/validators/validator param change), this
       * array is updated with the active ValidationTypes ('error'|'warning'|'success'|'info' etc.).
       * Notice the difference with `.showsFeedbackFor`, which filters `.hasFeedbackFor` based on
       * `.feedbackCondition()`.
       *
       * For styling purposes, will be reflected to [has-feedback-for="error warning"]. This can
       * be useful for subtle visual feedback on keyup, like a red/green border around an input.
       *
       * @example
       * ```css
       * :host([has-feedback-for~="error"]) .input-group__container {
       *   border: 1px solid red;
       * }
       * ```
       * @type {ValidationType[]}
       * @readOnly
       */
      this.hasFeedbackFor = [];

      /**
       * Based on outcome of feedbackCondition, this array decides what ValidationTypes should be
       * shown in validationFeedback, based on meta data like interaction states.
       *
       * For styling purposes, it reflects it `[shows-feedback-for="error warning"]`
       * @type {ValidationType[]}
       * @readOnly
       * @example
       * ```css
       * :host([shows-feedback-for~="success"]) .form-field__feedback {
       *   transform: scaleY(1);
       * }
       * ```
       */
      this.showsFeedbackFor = [];

      // TODO: [v1] make this fully private (preifix __)?
      /**
       * A temporary storage to transition from hasFeedbackFor to showsFeedbackFor
       * @type {ValidationType[]}
       * @readOnly
       * @private
       */
      this.shouldShowFeedbackFor = [];

      /**
       * The outcome of a validation 'round'. Keyed by ValidationType and Validator name
       * @readOnly
       * @type {Object.<string, Object.<string, boolean>>}
       */
      this.validationStates = {};

      /**
       * Flag indicating whether async validation is pending.
       * Creates attribute [is-pending] as a styling hook
       * @type {boolean}
       */
      this.isPending = false;

      /**
       * Used by Application Developers to add Validators to a FormControl.
       * @example
       * ```html
       * <form-control .validators="${[new Required(), new MinLength(4, {type: 'warning'})]}">
       * </form-control>
       * ```
       * @type {Validator[]}
       */
      this.validators = [];

      /**
       * Used by Subclassers to add default Validators to a particular FormControl.
       * A date input for instance, always needs the isDate validator.
       * @example
       * ```js
       * this.defaultValidators.push(new IsDate());
       * ```
       * @type {Validator[]}
       */
      this.defaultValidators = [];

      /**
       * The amount of feedback messages that will visible in LionValidationFeedback
       * @protected
       */
      this._visibleMessagesAmount = 1;

      /**
       * @type {Validator[]}
       * @private
       */
      this.__syncValidationResult = [];

      /**
       * @type {Validator[]}
       * @private
       */
      this.__asyncValidationResult = [];

      /**
       * Aggregated result from sync Validators, async Validators and ResultValidators
       * @type {Validator[]}
       * @private
       */
      this.__validationResult = [];

      /**
       * @type {Validator[]}
       * @private
       */
      this.__prevValidationResult = [];

      /**
       * @type {Validator[]}
       * @private
       */
      this.__prevShownValidationResult = [];

      /**
       * The updated children validity affects the validity of the parent. Helper to recompute
       * validatity of parent FormGroup
       * @private
       */
      this.__childModelValueChanged = false;

      /** @private */
      this.__onValidatorUpdated = this.__onValidatorUpdated.bind(this);
      /** @protected */
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
     * @param {import('@lion/core').PropertyValues} changedProperties
     */
    firstUpdated(changedProperties) {
      super.firstUpdated(changedProperties);
      this.__validateInitialized = true;
      this.validate();
      if (this._repropagationRole !== 'child') {
        this.addEventListener('model-value-changed', () => {
          this.__childModelValueChanged = true;
        });
      }
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

      if (
        [
          'touched',
          'dirty',
          'prefilled',
          'focused',
          'submitted',
          'hasFeedbackFor',
          'filled',
        ].includes(name)
      ) {
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
     * Triggered by:
     *  - modelValue change
     *  - change in the 'validators' array
     * -  change in the config of an individual Validator
     *
     * Three situations are handled:
     * - a1) the FormControl is empty: further execution is halted. When the Required Validator
     * (being mutually exclusive to the other Validators) is applied, it will end up in the
     * validation result (as the only Validator, since further execution was halted).
     * - a2) there are synchronous Validators: this is the most common flow. When modelValue hasn't
     * changed since last async results were generated, 'sync results' are merged with the
     * 'async results'.
     * - a3) there are asynchronous Validators: for instance when server side evaluation is needed.
     * Executions are scheduled and awaited and the 'async results' are merged with the
     * 'sync results'.
     *
     * - b) there are ResultValidators. After steps a1, a2, or a3 are finished, the holistic
     * ResultValidators (evaluating the total result of the 'regular' (a1, a2 and a3) validators)
     * will be run...
     *
     * Situations a2 and a3 are not mutually exclusive and can be triggered within one `validate()`
     * call. Situation b will occur after every call.
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

      this.__prevValidationResult = this.__validationResult;
      if (clearCurrentResult) {
        // Clear ('invalidate') all pending and existing validation results.
        // This is needed because we have async (pending) validators whose results
        // need to be merged with those of sync validators and vice versa.
        this.__clearValidationResults();
      }
      await this.__executeValidators();
    }

    /**
     * @desc step a1-3 + b (as explained in `validate()`)
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
     * step a2 (as explained in `validate()`): calls `__finishValidation`
     * @param {Validator[]} syncValidators
     * @param {unknown} value
     * @param {{ hasAsync: boolean }} opts
     * @private
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
     * step a3 (as explained in `validate()`), calls __finishValidation
     * @param {Validator[]} asyncValidators all Validators except required and ResultValidators
     * @param {?} value
     * @private
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
     * step b (as explained in `validate()`), called by __finishValidation
     * @param {Validator[]} regularValidationResult result of steps 1-3
     * @private
     */
    __executeResultValidators(regularValidationResult) {
      const resultValidators = /** @type {ResultValidator[]} */ (
        this._allValidators.filter(v => {
          const vCtor = /** @type {typeof Validator} */ (v.constructor);
          return !vCtor.async && v instanceof ResultValidator;
        })
      );

      return resultValidators.filter(v =>
        v.executeOnResults({
          regularValidationResult,
          prevValidationResult: this.__prevValidationResult,
          prevShownValidationResult: this.__prevShownValidationResult,
        }),
      );
    }

    /**
     * @param {object} options
     * @param {'sync'|'async'} options.source
     * @param {boolean} [options.hasAsync] whether async validators are configured in this run.
     * @private
     * If not, we have nothing left to wait for.
     */
    __finishValidation({ source, hasAsync }) {
      const syncAndAsyncOutcome = [...this.__syncValidationResult, ...this.__asyncValidationResult];
      // if we have any ResultValidators left, now is the time to run them...
      const resultOutCome = this.__executeResultValidators(syncAndAsyncOutcome);

      this.__validationResult = [...resultOutCome, ...syncAndAsyncOutcome];
      // this._storeResultsOnInstance(this.__validationResult);

      const ctor =
        /** @type {typeof import('../../types/validate/ValidateMixinTypes').ValidateHost} */ (
          this.constructor
        );

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
          // @ts-ignore [allow-private]
          this.__validateCompleteResolve();
        }
      }
    }

    /**
     * @private
     */
    __clearValidationResults() {
      this.__syncValidationResult = [];
      this.__asyncValidationResult = [];
    }

    /**
     * @param {Event|CustomEvent} e
     * @private
     */
    __onValidatorUpdated(e) {
      if (e.type === 'param-changed' || e.type === 'config-changed') {
        this.validate();
      }
    }

    /**
     * @private
     */
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
          const errorMessage = `Validators array only accepts class instances of Validator. Type "${errorType}" found. This may be caused by having multiple installations of @lion/form-core.`;
          // eslint-disable-next-line no-console
          console.error(errorMessage, this);
          throw new Error(errorMessage);
        }
        const ctor =
          /** @type {typeof import('../../types/validate/ValidateMixinTypes').ValidateHost} */ (
            this.constructor
          );
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
     * Helper method for the mutually exclusive Required Validator
     * @param {?} v
     * @private
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
     * @private
     */
    async __getFeedbackMessages(validators) {
      let fieldName = await this.fieldName;
      return Promise.all(
        validators.map(async validator => {
          if (validator.config.fieldName) {
            fieldName = await validator.config.fieldName;
          }
          // @ts-ignore [allow-protected]
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
     * Responsible for retrieving messages from Validators and
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
     * @protected
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

          if (this.__prioritizedResult.length > 0) {
            this.__prevShownValidationResult = this.__prioritizedResult;
          }

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
     * Default feedbackCondition condition, used by Subclassers, that will be used when
     * `feedbackCondition()` is not overridden by Application Developer.
     * Show the validity feedback when returning true, don't show when false
     * @param {string} type could be 'error', 'warning', 'info', 'success' or any other custom
     * Validator type
     * @param {object} meta meta info (interaction states etc)
     * @protected
     */
    // eslint-disable-next-line no-unused-vars
    _showFeedbackConditionFor(type, meta) {
      return true;
    }

    /**
     * Allows Subclassers to add meta info for feedbackCondition
     * @configurable
     */
    get _feedbackConditionMeta() {
      return { modelValue: this.modelValue, el: this };
    }

    /**
     * Allows the end user to specify when a feedback message should be shown
     * @example
     * ```js
     * feedbackCondition(type, meta, defaultCondition) {
     *   if (type === 'info') {
     *     return return;
     *   } else if (type === 'prefilledOnly') {
     *     return meta.prefilled;
     *   }
     *   return defaultCondition(type, meta);
     * }
     * ```
     * @overridable
     * @param {string} type could be 'error', 'warning', 'info', 'success' or any other custom
     * Validator type
     * @param {object} meta meta info (interaction states etc)
     * @param {((type: string, meta: object) => boolean)} currentCondition this is the _showFeedbackConditionFor
     * that can be used if a developer wants to override for a certain type, but wants to fallback
     * for other types
     * @returns {boolean}
     */
    feedbackCondition(
      type,
      meta = this._feedbackConditionMeta,
      currentCondition = this._showFeedbackConditionFor.bind(this),
    ) {
      return currentCondition(type, meta);
    }

    /**
     * Used to translate `.hasFeedbackFor` and `.shouldShowFeedbackFor` to `.showsFeedbackFor`
     * @param {string} type
     * @protected
     */
    _hasFeedbackVisibleFor(type) {
      return (
        this.hasFeedbackFor &&
        this.hasFeedbackFor.includes(type) &&
        this.shouldShowFeedbackFor &&
        this.shouldShowFeedbackFor.includes(type)
      );
    }

    /** @param {import('@lion/core').PropertyValues} changedProperties */
    updated(changedProperties) {
      super.updated(changedProperties);

      if (
        changedProperties.has('shouldShowFeedbackFor') ||
        changedProperties.has('hasFeedbackFor')
      ) {
        const ctor =
          /** @type {typeof import('../../types/validate/ValidateMixinTypes').ValidateHost} */ (
            this.constructor
          );
        // Necessary typecast because types aren't smart enough to understand that we filter out undefined
        this.showsFeedbackFor = /** @type {string[]} */ (
          ctor.validationTypes
            .map(type => (this._hasFeedbackVisibleFor(type) ? type : undefined))
            .filter(Boolean)
        );
        this._updateFeedbackComponent();
      }

      if (changedProperties.has('__childModelValueChanged') && this.__childModelValueChanged) {
        this.validate({ clearCurrentResult: true });
        this.__childModelValueChanged = false;
      }

      if (changedProperties.has('validationStates')) {
        const prevStates = /** @type {{[key: string]: object;}} */ (
          changedProperties.get('validationStates')
        );
        if (prevStates) {
          Object.entries(this.validationStates).forEach(([type, feedbackObj]) => {
            if (
              prevStates[type] &&
              JSON.stringify(feedbackObj) !== JSON.stringify(prevStates[type])
            ) {
              this.dispatchEvent(new CustomEvent(`${type}StateChanged`, { detail: feedbackObj }));
            }
          });
        }
      }
    }

    /**
     * @protected
     */
    _updateShouldShowFeedbackFor() {
      const ctor =
        /** @type {typeof import('../../types/validate/ValidateMixinTypes').ValidateHost} */ (
          this.constructor
        );

      // Necessary typecast because types aren't smart enough to understand that we filter out undefined
      const newShouldShowFeedbackFor = /** @type {string[]} */ (
        ctor.validationTypes
          .map(type =>
            this.feedbackCondition(
              type,
              this._feedbackConditionMeta,
              this._showFeedbackConditionFor.bind(this),
            )
              ? type
              : undefined,
          )
          .filter(Boolean)
      );

      if (JSON.stringify(this.shouldShowFeedbackFor) !== JSON.stringify(newShouldShowFeedbackFor)) {
        this.shouldShowFeedbackFor = newShouldShowFeedbackFor;
      }
    }

    /**
     * Orders all active validators in this.__validationResult. Can
     * also filter out occurrences (based on interaction states)
     * @overridable
     * @param {{ validationResult: Validator[] }} opts
     * @return {Validator[]} ordered list of Validators with feedback messages visible to the end user
     * @protected
     */
    _prioritizeAndFilterFeedback({ validationResult }) {
      const ctor =
        /** @type {typeof import('../../types/validate/ValidateMixinTypes').ValidateHost} */ (
          this.constructor
        );
      const types = ctor.validationTypes;
      // Sort all validators based on the type provided.
      const res = validationResult
        .filter(v =>
          this.feedbackCondition(
            v.type,
            this._feedbackConditionMeta,
            this._showFeedbackConditionFor.bind(this),
          ),
        )
        .sort((a, b) => types.indexOf(a.type) - types.indexOf(b.type));
      return res.slice(0, this._visibleMessagesAmount);
    }
  };

export const ValidateMixin = dedupeMixin(ValidateMixinImplementation);
