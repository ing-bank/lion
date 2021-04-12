import { LitElement } from '@lion/core';
import { DisabledHost } from '@lion/core/types/DisabledMixinTypes';
import { SlotHost } from '@lion/core/types/SlotMixinTypes';
import { Constructor } from '@open-wc/dedupe-mixin';
import { ScopedElementsHost } from '@open-wc/scoped-elements/src/types';
import { FormControlHost } from '../FormControlMixinTypes';
import { LionValidationFeedback } from '../../src/validate/LionValidationFeedback';
import { SyncUpdatableHost } from '../utils/SyncUpdatableMixinTypes';
import { Validator } from '../../src/validate/Validator';

type ScopedElementsMap = {
  [key: string]: typeof HTMLElement;
};

type FeedbackMessage = {
  message: string | Node;
  type: string;
  validator?: Validator;
};

export declare class ValidateHost {
  validators: Validator[];
  hasFeedbackFor: string[];
  shouldShowFeedbackFor: string[];
  showsFeedbackFor: string[];
  validationStates: { [key: string]: { [key: string]: Object } };
  isPending: boolean;
  defaultValidators: Validator[];
  fieldName: string;
  validateComplete: Promise<void>;
  feedbackComplete: Promise<void>;

  static validationTypes: string[];

  validate(opts?: { clearCurrentResult?: boolean }): void;

  protected _visibleMessagesAmount: number;
  protected _allValidators: Validator[];
  protected get _feedbackNode(): LionValidationFeedback;

  protected _updateFeedbackComponent(): void;
  protected _showFeedbackConditionFor(type: string, meta: object): boolean;
  protected _hasFeedbackVisibleFor(type: string): boolean;
  protected _updateShouldShowFeedbackFor(): void;
  protected _prioritizeAndFilterFeedback(opts: { validationResult: Validator[] }): Validator[];
  protected updateSync(name: string, oldValue: unknown): void;

  private __syncValidationResult: Validator[];
  private __asyncValidationResult: Validator[];
  private __validationResult: Validator[];
  private __prevValidationResult: Validator[];
  private __prevShownValidationResult: Validator[];

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
