import { LitElement } from '@lion/core';
import { DisabledHost } from '@lion/core/types/DisabledMixinTypes';
import { SlotsMap, SlotHost } from '@lion/core/types/SlotMixinTypes';
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
  _visibleMessagesAmount: number;
  fieldName: string;

  static validationTypes: string[];
  slots: SlotsMap;
  _feedbackNode: LionValidationFeedback;
  _allValidators: Validator[];

  __syncValidationResult: Validator[];
  __asyncValidationResult: Validator[];
  __validationResult: Validator[];
  __prevValidationResult: Validator[];

  connectedCallback(): void;
  disconnectedCallback(): void;
  firstUpdated(changedProperties: import('@lion/core').PropertyValues): void;
  updateSync(name: string, oldValue: unknown): void;
  updated(changedProperties: import('@lion/core').PropertyValues): void;

  validate(opts?: { clearCurrentResult?: boolean }): void;
  __storePrevResult(): void;
  __executeValidators(): void;
  validateComplete: Promise<void>;
  feedbackComplete: Promise<void>;
  __validateCompleteResolve(): void;
  __executeSyncValidators(
    syncValidators: Validator[],
    value: unknown,
    opts: { hasAsync: boolean },
  ): void;
  __executeAsyncValidators(asyncValidators: Validator[], value: unknown): void;
  __executeResultValidators(regularValidationResult: Validator[]): Validator[];
  __finishValidation(options: { source: 'sync' | 'async'; hasAsync?: boolean }): void;
  __clearValidationResults(): void;
  __onValidatorUpdated(e: Event | CustomEvent): void;
  __setupValidators(): void;
  __isEmpty(v: unknown): boolean;
  __getFeedbackMessages(validators: Validator[]): Promise<FeedbackMessage[]>;
  _updateFeedbackComponent(): void;
  _showFeedbackConditionFor(type: string): boolean;
  _hasFeedbackVisibleFor(type: string): boolean;
  _updateShouldShowFeedbackFor(): void;
  _prioritizeAndFilterFeedback(opts: { validationResult: Validator[] }): Validator[];
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
