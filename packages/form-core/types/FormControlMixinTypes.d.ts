import { CSSResult, LitElement, nothing, TemplateResult } from '@lion/core';
import { SlotsMap, SlotHost } from '@lion/core/types/SlotMixinTypes';
import { Constructor } from '@open-wc/dedupe-mixin';
import { DisabledHost } from '@lion/core/types/DisabledMixinTypes';

import { LionValidationFeedback } from '../src/validate/LionValidationFeedback';
import { FormRegisteringHost } from './registration/FormRegisteringMixinTypes';

export class FormControlHost {
  static get styles(): CSSResult | CSSResult[];

  name: string;
  modelValue: unknown;
  set label(arg: string);
  get label(): string;
  __label: string | undefined;
  set helpText(arg: string);
  get helpText(): string;
  __helpText: string | undefined;
  set fieldName(arg: string);
  get fieldName(): string;
  __fieldName: string | undefined;
  get slots(): SlotsMap;
  get _inputNode(): HTMLElement;
  get _labelNode(): HTMLElement;
  get _helpTextNode(): HTMLElement;
  get _feedbackNode(): LionValidationFeedback | undefined;
  _inputId: string;
  _ariaLabelledNodes: HTMLElement[];
  _ariaDescribedNodes: HTMLElement[];
  _repropagationRole: string; // 'child' | 'choice-group' | 'fieldset';
  _isRepropagationEndpoint: boolean;

  connectedCallback(): void;
  updated(changedProperties: import('lit-element').PropertyValues): void;

  render(): TemplateResult;
  _groupOneTemplate(): TemplateResult;
  _groupTwoTemplate(): TemplateResult;
  _labelTemplate(): TemplateResult;
  _helpTextTemplate(): TemplateResult;
  _inputGroupTemplate(): TemplateResult;
  _inputGroupBeforeTemplate(): TemplateResult;
  _inputGroupPrefixTemplate(): TemplateResult | typeof nothing;
  _inputGroupInputTemplate(): TemplateResult;
  _inputGroupSuffixTemplate(): TemplateResult | typeof nothing;
  _inputGroupAfterTemplate(): TemplateResult;
  _feedbackTemplate(): TemplateResult;

  _triggerInitialModelValueChangedEvent(): void;
  _enhanceLightDomClasses(): void;
  _enhanceLightDomA11y(): void;
  _enhanceLightDomA11yForAdditionalSlots(additionalSlots?: string[]): void;
  __reflectAriaAttr(attrName: string, nodes: HTMLElement[], reorder: boolean | undefined): void;
  _onLabelChanged({ label }: { label: string }): void;
  _onHelpTextChanged({ helpText }: { helpText: string }): void;
  _isEmpty(modelValue?: unknown): boolean;
  _getAriaDescriptionElements(): HTMLElement[];
  addToAriaLabelledBy(
    element: HTMLElement,
    customConfig?: {
      idPrefix?: string | undefined;
      reorder?: boolean | undefined;
    },
  ): void;
  __reorderAriaLabelledNodes: boolean | undefined;
  addToAriaDescribedBy(
    element: HTMLElement,
    customConfig?: {
      idPrefix?: string | undefined;
      reorder?: boolean | undefined;
    },
  ): void;
  __reorderAriaDescribedNodes: boolean | undefined;
  __getDirectSlotChild(slotName: string): HTMLElement;
  __dispatchInitialModelValueChangedEvent(): void;
  __repropagateChildrenInitialized: boolean | undefined;
  _onBeforeRepropagateChildrenValues(ev: CustomEvent): void;
  __repropagateChildrenValues(ev: CustomEvent): void;
}

export declare function FormControlImplementation<T extends Constructor<LitElement>>(
  superclass: T,
): T &
  Constructor<FormControlHost> &
  FormControlHost &
  Constructor<FormRegisteringHost> &
  typeof FormRegisteringHost &
  Constructor<DisabledHost> &
  typeof DisabledHost &
  Constructor<SlotHost> &
  typeof SlotHost;

export type FormControlMixin = typeof FormControlImplementation;
