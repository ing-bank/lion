import { LitElement } from 'lit';
import { Constructor } from '@open-wc/dedupe-mixin';
import { ScopedElementsHost } from '@open-wc/scoped-elements/types.js';

import { DisabledHost } from '../../../core/types/DisabledMixinTypes.js';
import { SlotHost } from '../../../core/types/SlotMixinTypes.js';

import { FormControlHost } from '../FormControlMixinTypes.js';
import { SyncUpdatableHost } from '../utils/SyncUpdatableMixinTypes.js';
import { Validator } from '../../src/validate/Validator.js';

type FeedbackMessage = {
  message: string | Node;
  type: string;
  validator?: Validator;
};

export type ValidationType = 'error' | 'warning' | 'info' | 'success' | string;

export declare class ValidateHost {
  /**
   * Used by Application Developers to add Validators to a FormControl.
   * @example
   * ```html
   * <form-control .validators="${[new Required(), new MinLength(4, {type: 'warning'})]}">
   * </form-control>
   * ```
   */
  validators: Validator[];

  /**
   * As soon as validation happens (after modelValue/validators/validator param change), this
   * array is updated with the active ValidationTypes ('error'|'warning'|'success'|'info' etc.).
   * Notice the difference with `.showsFeedbackFor`, which filters `.hasFeedbackFor` based on
   * `.feedbackCondition()`.
   *
   * For styling purposes, will be reflected to [has-feedback-for="error warning"]. This can
   * be useful for subtle visual feedback on keyup, like a red/green border around an input.
   *
   * @readOnly
   * @example
   * ```css
   * :host([has-feedback-for~="error"]) .input-group__container {
   *   border: 1px solid red;
   * }
   * ```
   */
  hasFeedbackFor: ValidationType[];

  /**
   * Based on outcome of feedbackCondition, this array decides what ValidationTypes should be
   * shown in validationFeedback, based on meta data like interaction states.
   *
   * For styling purposes, it reflects it `[shows-feedback-for="error warning"]`
   * @readOnly
   * @example
   * ```css
   * :host([shows-feedback-for~="success"]) .form-field__feedback {
   *   transform: scaleY(1);
   * }
   * ```
   */
  showsFeedbackFor: ValidationType[];

  /**
   * A temporary storage to transition from hasFeedbackFor to showsFeedbackFor
   * @type {ValidationType[]}
   * @readOnly
   * @private
   */
  private shouldShowFeedbackFor: ValidationType[];

  /**
   * The outcome of a validation 'round'. Keyed by ValidationType and Validator name
   * @readOnly
   */
  validationStates: { [key: string]: { [key: string]: Object } };

  /**
   * Flag indicating whether async validation is pending.
   * Creates attribute [is-pending] as a styling hook
   */
  isPending: boolean;

  /**
   * Used by Subclassers to add default Validators to a particular FormControl.
   * A date input for instance, always needs the isDate validator.
   * @example
   * ```js
   * this.defaultValidators.push(new IsDate());
   * ```
   */
  defaultValidators: Validator[];
  fieldName: string;
  validateComplete: Promise<void>;
  feedbackComplete: Promise<void>;

  static validationTypes: string[];

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
   * - b) there are ResultValidators. After steps a1, a2, or a3 are finished, the holistic
   * ResultValidators (evaluating the total result of the 'regular' (a1, a2 and a3) validators)
   * will be run...
   *
   * Situations a2 and a3 are not mutually exclusive and can be triggered within one `validate()`
   * call. Situation b will occur after every call.
   *
   * @param {{ clearCurrentResult?: boolean }} [opts]
   */
  validate(opts?: { clearCurrentResult?: boolean }): void;

  /**
   * The amount of feedback messages that will visible in LionValidationFeedback
   */
  protected _visibleMessagesAmount: number;

  /**
   * Combination of validators provided by Application Developer and the default validators
   */
  protected _allValidators: Validator[];

  /**
   * Allows Subclassers to add meta info for feedbackCondition
   */
  protected get _feedbackConditionMeta(): object;

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
   */
  protected _updateFeedbackComponent(): void;

  /**
   * Default feedbackCondition condition, used by Subclassers, that will be used when
   * `feedbackCondition()` is not overridden by Application Developer.
   * Show the validity feedback when returning true, don't show when false
   * @param {string} type could be 'error', 'warning', 'info', 'success' or any other custom
   * Validator type
   * @param {object} meta meta info (interaction states etc)
   */
  protected _showFeedbackConditionFor(type: string, meta: object): boolean;

  /**
   * Used to translate `.hasFeedbackFor` and `.shouldShowFeedbackFor` to `.showsFeedbackFor`
   */
  protected _hasFeedbackVisibleFor(type: string): boolean;
  protected _updateShouldShowFeedbackFor(): void;

  /**
   * Orders all active validators in this.__validationResult. Can also filter out occurrences
   * (based on interaction states).
   *
   * @example
   * ```js
   * _prioritizeAndFilterFeedback({ validationResult }) {
   *   // Put info messages on top; no limitation by `._visibleMessagesAmount`
   *   const meta = this._feedbackConditionMeta;
   *   return validationResult.filter(v =>
   *     this.feedbackCondition(v.type, meta, this._showFeedbackConditionFor.bind(this))
   *   ).sort((a, b) => a.type === 'info' ? 1 : 0);
   * }
   * ```
   */
  protected _prioritizeAndFilterFeedback(opts: { validationResult: Validator[] }): Validator[];

  private __syncValidationResult: Validator[];
  private __asyncValidationResult: Validator[];
  private __validationResult: Validator[];
  private __prevValidationResult: Validator[];
  private __prevShownValidationResult: Validator[];
  private __childModelValueChanged: boolean;

  private __storePrevResult(): void;
  private __executeValidators(): void;
  private __validateCompleteResolve(): void;
  private __executeSyncValidators(
    syncValidators: Validator[],
    value: unknown,
    opts: { hasAsync: boolean },
  ): void;
  private __executeAsyncValidators(asyncValidators: Validator[], value: unknown): void;
  private __executeResultValidators(regularValidationResult: Validator[]): Validator[];
  private __finishValidation(options: { source: 'sync' | 'async'; hasAsync?: boolean }): void;
  private __clearValidationResults(): void;
  private __onValidatorUpdated(e: Event | CustomEvent): void;
  private __setupValidators(): void;
  private __isEmpty(v: unknown): boolean;
  private __getFeedbackMessages(validators: Validator[]): Promise<FeedbackMessage[]>;
}

export declare function ValidateImplementation<T extends Constructor<LitElement>>(
  superclass: T,
): T &
  Constructor<ValidateHost> &
  Pick<typeof ValidateHost, keyof typeof ValidateHost> &
  Constructor<FormControlHost> &
  Pick<typeof FormControlHost, keyof typeof FormControlHost> &
  Constructor<SyncUpdatableHost> &
  Pick<typeof SyncUpdatableHost, keyof typeof SyncUpdatableHost> &
  Constructor<DisabledHost> &
  Pick<typeof DisabledHost, keyof typeof DisabledHost> &
  Constructor<SlotHost> &
  Pick<typeof SlotHost, keyof typeof SlotHost> &
  Constructor<ScopedElementsHost> &
  Pick<typeof ScopedElementsHost, keyof typeof ScopedElementsHost> &
  Pick<typeof LitElement, keyof typeof LitElement>;

export type ValidateMixin = typeof ValidateImplementation;
