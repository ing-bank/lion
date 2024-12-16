/* eslint-disable class-methods-use-this, camelcase, no-param-reassign, max-classes-per-file */
import { SlotMixin, DisabledMixin } from '@lion/ui/core.js';
import { dedupeMixin } from '@open-wc/dedupe-mixin';
// TODO: make form-core independent from localize
import { getLocalizeManager } from '@lion/ui/localize-no-side-effects.js';
import { ScopedElementsMixin } from '../../../core/src/ScopedElementsMixin.js';
import { AsyncQueue } from '../utils/AsyncQueue.js';
import { pascalCase } from '../utils/pascalCase.js';
import { SyncUpdatableMixin } from '../utils/SyncUpdatableMixin.js';
import { LionValidationFeedback } from './LionValidationFeedback.js';
import { ResultValidator as MetaValidator } from './ResultValidator.js';
import { Unparseable } from './Unparseable.js';
import { Required } from './validators/Required.js';
import { FormControlMixin } from '../FormControlMixin.js';
// eslint-disable-next-line no-unused-vars
import { Validator } from './Validator.js';
// TODO: [v1] make all @readOnly => @readonly and actually make sure those values cannot be set

/**
 * @typedef {import('../../types/validate/ValidateMixinTypes.js').ValidateMixin} ValidateMixin
 * @typedef {import('../../types/validate/ValidateMixinTypes.js').ValidationType} ValidationType
 * @typedef {import('../../types/validate/ValidateMixinTypes.js').ValidateHost} ValidateHost
 * @typedef {import('../../types/validate/ValidateMixinTypes.js').OperationMode} OperationMode
 * @typedef {import('../../types/validate/index.js').ValidatorOutcome} ValidatorOutcome
 * @typedef {typeof import('../../types/validate/ValidateMixinTypes.js').ValidateHost} ValidateHostConstructor
 * @typedef {{validator:Validator; outcome:boolean|string}} ValidationResultEntry
 * @typedef {{[type:string]: {[validatorName:string]:boolean|string}}} ValidationStates
 */

/**
 * @param {any[]} array1
 * @param {any[]} array2
 */
function arrayDiff(array1 = [], array2 = []) {
  return array1.filter(x => !array2.includes(x)).concat(array2.filter(x => !array1.includes(x)));
}

/**
 * When the modelValue can't be created by FormatMixin.parser, still allow all validators
 * to give valuable feedback to the user based on the current viewValue.
 * @param {any} modelValue
 */
function getValueForValidators(modelValue) {
  return modelValue instanceof Unparseable ? modelValue.viewValue : modelValue;
}

/**
 * Handles all validation, based on modelValue changes. It has no knowledge about dom and
 * UI. All error visibility, dom interaction and accessibility are handled in FeedbackMixin.
 *
 * @type {ValidateMixin}
 * @param {import('@open-wc/dedupe-mixin').Constructor<import('lit').LitElement>} superclass
 */
export const ValidateMixinImplementation = superclass =>
  // @ts-ignore https://github.com/microsoft/TypeScript/issues/36821#issuecomment-588375051
  class extends FormControlMixin(
    SyncUpdatableMixin(DisabledMixin(SlotMixin(ScopedElementsMixin(superclass)))),
  ) {
    static get scopedElements() {
      return {
        // @ts-ignore
        ...super.scopedElements,
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
     * Types of input interaction of the FormControl (for instance 'enter'|'select'|'upload')
     * @overridable
     * @type {OperationMode}
     */
    get operationMode() {
      return 'enter';
    }

    /**
     * Adds "._feedbackNode" as described below
     * @public
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
      return {
        ...super.slots,
        feedback: () => {
          const feedbackEl = this.createScopedElement('lion-validation-feedback');
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

      // TODO: [v1] make this fully private (prefix __)?
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
       * @type {ValidationStates}
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
       * @configurable
       * @protected
       */
      this._visibleMessagesAmount = 1;

      /**
       * @type {ValidationResultEntry[]}
       * @private
       */
      this.__syncValidationResult = [];

      /**
       * @type {ValidationResultEntry[]}
       * @private
       */
      this.__asyncValidationResult = [];

      /**
       * Aggregated result from sync Validators, async Validators and MetaValidators
       * @type {ValidationResultEntry[]}
       * @private
       */
      this.__validationResult = [];

      /**
       * @type {ValidationResultEntry[]}
       * @private
       */
      this.__prevValidationResult = [];

      /**
       * The shown validation result depends on the visibility of the feedback messages
       * @type {ValidationResultEntry[]}
       * @private
       */
      this.__prevShownValidationResult = [];

      /**
       * The updated children validity affects the validity of the parent. Helper to recompute
       * validity of parent FormGroup
       * @private
       */
      this.__childModelValueChanged = false;

      /** @protected */
      this._onValidatorUpdated = this._onValidatorUpdated.bind(this);
      /** @protected */
      this._updateFeedbackComponent = this._updateFeedbackComponent.bind(this);
    }

    connectedCallback() {
      super.connectedCallback();

      const localizeManager = getLocalizeManager();
      localizeManager.addEventListener('localeChanged', this._updateFeedbackComponent);
    }

    disconnectedCallback() {
      super.disconnectedCallback();

      const localizeManager = getLocalizeManager();
      localizeManager.removeEventListener('localeChanged', this._updateFeedbackComponent);
    }

    /**
     * @param {import('lit').PropertyValues} changedProperties
     */
    firstUpdated(changedProperties) {
      super.firstUpdated(changedProperties);
      this.__isValidateInitialized = true;
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
     *  - change in the config of an individual Validator
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
     * - b) there are MetaValidators. After steps a1, a2, or a3 are finished, the holistic
     * MetaValidators (evaluating the total result of the 'regular' (a1, a2 and a3) validators)
     * will be run...
     *
     * Situations a2 and a3 are not mutually exclusive and can be triggered within one `validate()`
     * call. Situation b will occur after every call.
     *
     * @param {{ clearCurrentResult?: boolean }} opts
     */
    async validate({ clearCurrentResult = false } = {}) {
      /**
       * Allows Application Developer to wait for (async) validation
       * @example
       * ```js
       * await el.validateComplete;
       * ```
       * @type {Promise<boolean>}
       */
      this.validateComplete = new Promise(resolve => {
        this.__validateCompleteResolve = resolve;
      });

      if (this.disabled) {
        this.__clearValidationResults();
        this.__finishValidationPass();
        this._updateFeedbackComponent();
        return;
      }
      // We don't validate before firstUpdated has run
      if (!this.__isValidateInitialized) {
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
      const value = getValueForValidators(this.modelValue);

      /**
       * Handle the 'mutually exclusive' Required validator:
       *
       * About the Required Validator:
       * - the validity is dependent on the formControls' modelValue and therefore determined
       * by the formControl._isEmpty method. Basically, the Required Validator is a means
       * to trigger formControl._isEmpty().
       *
       * About the empty state:
       * - when _isEmpty returns true, the modelValue is considered empty. This means we need to stop
       * validation here, because all other Validators' execute functions assume the
       * value is not empty (there would be nothing to validate).
       *
       */

      const isEmpty = this.__isEmpty(value);
      this.__syncValidationResult = [];

      /**
       * So we can have the following scenarios:
       * - we're empty
       *   - we have a single value (we are an 'endpoint') => we want to halt execution, because validation only makes sense when we have a value
       *     - 1. we have Required => we fill .__syncValidationResult and finish validation, because we have a value to validate
       *     - 2. we don't have Required => we stop validation
       *   - we have a group of values (object/array) => we want to continue execution, because the constellation of the object (even though the individual endpoints are empty) might be interesting for validation.
       *     - 3. we have Required => we fill .__syncValidationResult and continue validation (so we can add more to .__syncValidationResult)
       *     - 4. we don't have Required => we continue validation
       *  - we're not empty
       *    - we have a single value or group of values
       *     - 5. we may have Required, but if we have it will not be 'active' => we continue execution, because we have a value to validate
       */

      if (isEmpty) {
        const hasSingleValue = !(/** @type {*  & ValidateHost} */ (this)._isFormOrFieldset);
        const requiredValidator = this._allValidators.find(
          v => /** @type {typeof Validator} */ (v.constructor)?.validatorName === 'Required',
        );
        if (requiredValidator) {
          this.__syncValidationResult = [{ validator: requiredValidator, outcome: true }];
        }

        if (hasSingleValue) {
          this.__finishValidationPass({
            syncValidationResult: this.__syncValidationResult,
          });
          return;
        }
      }

      const metaValidators = /** @type {MetaValidator[]} */ [];
      const syncValidators = /** @type {Validator[]} */ [];
      const asyncValidators = /** @type {Validator[]} */ [];

      for (const v of this._allValidators) {
        if (v instanceof MetaValidator) {
          metaValidators.push(v);
        } else if (v instanceof Required) {
          // Required validator was already handled
        } else if (/** @type {typeof Validator} */ (v.constructor).async) {
          asyncValidators.push(v);
        } else {
          syncValidators.push(v);
        }
      }

      const hasAsync = Boolean(asyncValidators.length);

      /**
       * 2. Synchronous validators
       */

      this.__syncValidationResult = [
        // This could eventually contain the Required Validator
        ...this.__syncValidationResult,
        ...this.__executeSyncValidators(syncValidators, value),
      ];
      // Finish the first (synchronous) pass
      this.__finishValidationPass({
        syncValidationResult: this.__syncValidationResult,
        metaValidators,
      });

      /**
       * 3. Asynchronous validators
       */
      if (hasAsync) {
        // Add a hint in the ui that we're waiting for async validation
        this.isPending = true;
        this.__asyncValidationResult = await this.__executeAsyncValidators(asyncValidators, value);
        this.isPending = false;
        // Now finish the second (asynchronous) pass (including both sync and async results)
        this.__finishValidationPass({
          syncValidationResult: this.__syncValidationResult,
          asyncValidationResult: this.__asyncValidationResult,
          metaValidators,
        });
        this.__validateCompleteResolve?.(true);
      } else {
        this.__validateCompleteResolve?.(true);
      }
    }

    /**
     * step a2 (as explained in `validate()`): calls `__finishValidationPass`
     * @param {Validator[]} syncValidators
     * @param {unknown} value
     * @private
     */
    __executeSyncValidators(syncValidators, value) {
      return syncValidators
        .map(v => ({
          validator: v,
          // TODO: fix this type - ts things this is not a FormControlHost?
          // @ts-ignore
          outcome: /** @type {boolean|string} */ (v.execute(value, v.param, { node: this })),
        }))
        .filter(v => Boolean(v.outcome));
    }

    /**
     * step a3 (as explained in `validate()`), calls __finishValidationPass
     * @param {Validator[]} asyncValidators all Validators except required and MetaValidators
     * @param {?} value
     * @private
     */
    async __executeAsyncValidators(asyncValidators, value) {
      const outcomePromises = asyncValidators.map(v => v.execute(value, v.param, { node: this }));
      const asyncExecutionResults = await Promise.all(outcomePromises);

      return asyncExecutionResults
        .map((r, i) => ({
          validator: asyncValidators[i],
          outcome: /** @type {boolean|string} */ (asyncExecutionResults[i]),
        }))
        .filter(v => Boolean(v.outcome));
    }

    /**
     * step b (as explained in `validate()`), called by __finishValidationPass
     * @param {{validator: Validator;outcome: boolean | string;}[]} regularValidationResult result of steps 1-3
     * @param {MetaValidator[]} metaValidators
     * @private
     */
    __executeMetaValidators(regularValidationResult, metaValidators) {
      if (!metaValidators.length) {
        return [];
      }

      // If empty, do not show the ResulValidation message (e.g. Correct!)
      if (this._isEmpty(this.modelValue)) {
        this.__prevShownValidationResult = [];
        return [];
      }

      // Map everything to Validator[] for backwards compatibility
      return metaValidators
        .map(v => ({
          validator: v,
          outcome: /** @type {boolean|string} */ (
            v.executeOnResults({
              regularValidationResult: regularValidationResult.map(entry => entry.validator),
              prevValidationResult: this.__prevValidationResult.map(entry => entry.validator),
              prevShownValidationResult: this.__prevShownValidationResult.map(
                entry => entry.validator,
              ),
            })
          ),
        }))
        .filter(v => Boolean(v.outcome));
    }

    /**
     * A 'pass' is a single run of the validation process, which will be triggered in these cases:
     * - on clear or disable
     * - on sync validation
     * - on async validation (can depend on server response)
     *
     * This method inishes a pass by adding the properties to the instance:
     * - validationStates
     * - hasFeedbackFor
     *
     * It sends a private event validate-performed, which is received by parent Formgroups.
     *
     * @param {object} options
     * @param {ValidationResultEntry[]} [options.syncValidationResult]
     * @param {ValidationResultEntry[]} [options.asyncValidationResult]
     * @param {MetaValidator[]} [options.metaValidators] MetaValidators to be executed
     * @private
     * If not, we have nothing left to wait for.
     */
    __finishValidationPass({
      syncValidationResult = [],
      asyncValidationResult = [],
      metaValidators = [],
    } = {}) {
      const syncAndAsyncOutcome = [...syncValidationResult, ...asyncValidationResult];
      // if we have any MetaValidators left, now is the time to run them...
      const metaOutCome = /** @type {ValidationResultEntry[]} */ (
        this.__executeMetaValidators(syncAndAsyncOutcome, metaValidators)
      );
      this.__validationResult = [...metaOutCome, ...syncAndAsyncOutcome];

      const ctor = /** @type {ValidateHostConstructor} */ (this.constructor);

      /** @type {ValidationStates} */
      const validationStates = ctor.validationTypes.reduce(
        (acc, type) => ({ ...acc, [type]: {} }),
        {},
      );
      for (const { validator, outcome } of this.__validationResult) {
        if (!validationStates[validator.type]) {
          validationStates[validator.type] = {};
        }
        const vCtor = /** @type {typeof Validator} */ (validator.constructor);
        validationStates[validator.type][vCtor.validatorName] = outcome;
      }
      this.validationStates = validationStates;

      this.hasFeedbackFor = [
        ...new Set(this.__validationResult.map(({ validator }) => validator.type)),
      ];
      /** private event that should be listened to by LionFieldSet */
      this.dispatchEvent(new Event('validate-performed', { bubbles: true }));
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
     * @protected
     */
    _onValidatorUpdated(e) {
      if (e.type === 'param-changed' || e.type === 'config-changed') {
        this.validate();
      }
    }

    /**
     * @private
     */
    __setupValidators() {
      const events = ['param-changed', 'config-changed'];

      for (const validatorToCleanup of this.__prevValidators || []) {
        for (const eventToCleanup of events) {
          validatorToCleanup.removeEventListener?.(eventToCleanup, this._onValidatorUpdated);
        }
        validatorToCleanup.onFormControlDisconnect(
          /** @type {import('../../types/FormControlMixinTypes.js').FormControlHost} */ (
            /** @type {unknown} */ (this)
          ),
        );
      }

      for (const validatorToSetup of this._allValidators) {
        // disable dot notation to avoid the renaming for the prop during build/minification
        const validatorCtor = /** @type {typeof Validator}  */ (validatorToSetup.constructor);
        // eslint-disable-next-line dot-notation
        if (validatorCtor['_$isValidator$'] === undefined) {
          // throws in constructor are not visible to end user so we do both
          const errorType = Array.isArray(validatorToSetup) ? 'array' : typeof validatorToSetup;
          const errorMessage = `Validators array only accepts class instances of Validator. Type "${errorType}" found. This may be caused by having multiple installations of "@lion/ui/form-core.js".`;
          // eslint-disable-next-line no-console
          console.error(errorMessage, this);
          throw new Error(errorMessage);
        }
        const ctor = /** @type {ValidateHostConstructor} */ (this.constructor);
        const vCtor = /** @type {typeof Validator} */ (validatorToSetup.constructor);
        if (ctor.validationTypes.indexOf(validatorToSetup.type) === -1) {
          // throws in constructor are not visible to end user so we do both
          const errorMessage = `This component does not support the validator type "${validatorToSetup.type}" used in "${vCtor.validatorName}". You may change your validators type or add it to the components "static get validationTypes() {}".`;
          // eslint-disable-next-line no-console
          console.error(errorMessage, this);
          throw new Error(errorMessage);
        }

        /**
         * Updated the code to fix issue #1607 to sync the calendar date with validators params
         * Here _onValidatorUpdated is responsible for responding to the event
         */
        for (const eventToSetup of events) {
          validatorToSetup.addEventListener?.(eventToSetup, e => {
            // @ts-ignore for making validator param dynamic
            this._onValidatorUpdated(e, { validator: validatorToSetup });
          });
        }
        validatorToSetup.onFormControlConnect(this);
      }
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
     * @param {ValidationResultEntry[]} validationResults list of objects having a .getMessage method
     * @return {Promise.<FeedbackMessage[]>}
     * @private
     */
    async __getFeedbackMessages(validationResults) {
      let fieldName = await this.fieldName;
      return Promise.all(
        validationResults.map(async ({ validator, outcome }) => {
          if (validator.config.fieldName) {
            fieldName = await validator.config.fieldName;
          }
          // @ts-ignore [allow-protected]
          const message = await validator._getMessage({
            modelValue: this.modelValue,
            formControl: this,
            fieldName,
            outcome,
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
          const prioritizedValidators = this._prioritizeAndFilterFeedback({
            validationResult: this.__validationResult.map(entry => entry.validator),
          });

          this.__prioritizedResult = prioritizedValidators
            .map(v => {
              const found = /** @type {ValidationResultEntry} */ (
                this.__validationResult.find(r => v === r.validator)
              );
              return found;
            })
            .filter(Boolean);

          if (this.__prioritizedResult.length > 0) {
            this.__prevShownValidationResult = this.__prioritizedResult;
          }

          const messageMap = await this.__getFeedbackMessages(this.__prioritizedResult);
          _feedbackNode.feedbackData = messageMap || [];
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
     * Allows the Application Developer to specify when a feedback message should be shown
     * @example
     * ```js
     * feedbackCondition(type, meta, defaultCondition) {
     *   if (type === 'info') {
     *     return true;
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
      return this.hasFeedbackFor?.includes(type) && this.shouldShowFeedbackFor?.includes(type);
    }

    /**
     * @param {import('lit').PropertyValues} changedProperties
     */
    updated(changedProperties) {
      super.updated(changedProperties);

      if (
        changedProperties.has('shouldShowFeedbackFor') ||
        changedProperties.has('hasFeedbackFor')
      ) {
        const ctor = /** @type {ValidateHostConstructor} */ (this.constructor);
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
      const ctor = /** @type {ValidateHostConstructor} */ (this.constructor);

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
     * Orders all active validators in this.__validationResult.
     * Can also filter out occurrences (based on interaction states)
     * @overridable
     * @param {{ validationResult: Validator[] }} opts
     * @return {Validator[]} ordered list of Validators with feedback messages visible to the end user
     * @protected
     */
    _prioritizeAndFilterFeedback({ validationResult }) {
      const ctor = /** @type {ValidateHostConstructor} */ (this.constructor);
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
