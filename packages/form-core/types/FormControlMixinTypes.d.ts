import { CSSResult, LitElement, nothing, TemplateResult } from '@lion/core';
import { SlotsMap, SlotHost } from '@lion/core/types/SlotMixinTypes';
import { Constructor } from '@open-wc/dedupe-mixin';
import { DisabledHost } from '@lion/core/types/DisabledMixinTypes';

import { LionValidationFeedback } from '../src/validate/LionValidationFeedback';
import { FormRegisteringHost } from './registration/FormRegisteringMixinTypes';

export class FormControlHost {
  static get styles(): CSSResult | CSSResult[];
  /**
   * A Boolean attribute which, if present, indicates that the user should not be able to edit
   * the value of the input. The difference between disabled and readonly is that read-only
   * controls can still function, whereas disabled controls generally do not function as
   * controls until they are enabled.
   * (From: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#attr-readonly)
   */
  readOnly: boolean;
  /**
   * The name the element will be registered on to the .formElements collection
   * of the parent.
   */
  name: string;
  /**
   * The model value is the result of the parser function(when available).
   * It should be considered as the internal value used for validation and reasoning/logic.
   * The model value is 'ready for consumption' by the outside world (think of a Date
   * object or a float). The modelValue can(and is recommended to) be used as both input
   * value and output value of the `LionField`.
   *
   * Examples:
   * - For a date input: a String '20/01/1999' will be converted to new Date('1999/01/20')
   * - For a number input: a formatted String '1.234,56' will be converted to a Number:
   *   1234.56
   */
  modelValue: unknown;
  /**
   * The label text for the input node.
   * When no light dom defined via [slot=label], this value will be used
   */
  get label(): string;
  set label(arg: string);
  __label: string | undefined;
  /**
   * The helpt text for the input node.
   * When no light dom defined via [slot=help-text], this value will be used
   */
  get helpText(): string;
  set helpText(arg: string);
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
  /**
   * Based on the role, details of handling model-value-changed repropagation differ.
   */
  _repropagationRole: 'child' | 'choice-group' | 'fieldset';
  /**
   * By default, a field with _repropagationRole 'choice-group' will act as an
   * 'endpoint'. This means it will be considered as an individual field: for
   * a select, individual options will not be part of the formPath. They
   * will.
   * Similarly, components that (a11y wise) need to be fieldsets, but 'interaction wise'
   * (from Application Developer perspective) need to be more like fields
   * (think of an amount-input with a currency select box next to it), can set this
   * to true to hide private internals in the formPath.
   */
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
