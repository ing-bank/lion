import { LitElement, nothing, TemplateResult, CSSResultArray } from '@lion/core';
import { SlotsMap, SlotHost } from '@lion/core/types/SlotMixinTypes';
import { Constructor } from '@open-wc/dedupe-mixin';
import { DisabledHost } from '@lion/core/types/DisabledMixinTypes';

import { LionValidationFeedback } from '../src/validate/LionValidationFeedback';
import { FormRegisteringHost } from './registration/FormRegisteringMixinTypes';

export type ModelValueEventDetails = {
  /**
   * A list that represents the path of FormControls the model-value-changed event
   * 'traveled through'.
   * (every FormControl stops propagation of its child and sends a new event, hereby adding
   * itself to the beginning of formPath)
   */
  formPath: HTMLElement[];
  /**
   * Sometimes it can be helpful to detect whether a value change was caused by a user or
   * via a programmatical change.
   * This feature acts as a normalization layer: since we use `model-value-changed` as a single
   * source of truth event for all FormControls, there should be no use cases for
   * (inconsistently implemented (cross browser)) events
   * like 'input'/'change'/'user-input-changed' etc.)
   */
  isTriggeredByUser: boolean;
  /**
   * Whether it is the first event sent on initialization of the form (other
   * model-value-changed events are triggered imperatively or via user input (in the latter
   * case `isTriggeredByUser` is true))
   */
  initialize?: boolean;
};

declare interface HTMLElementWithValue extends HTMLElement {
  value: string;
}

export declare class FormControlHost {
  static get styles(): CSSResultArray;
  static get properties(): {
    name: {
      type: StringConstructor;
      reflect: boolean;
    };
    readOnly: {
      type: BooleanConstructor;
      attribute: string;
      reflect: boolean;
    };
    label: StringConstructor;
    helpText: {
      type: StringConstructor;
      attribute: string;
    };
    modelValue: { attribute: boolean };
    _ariaLabelledNodes: { attribute: boolean };
    _ariaDescribedNodes: { attribute: boolean };
    _repropagationRole: { attribute: boolean };
    _isRepropagationEndpoint: { attribute: boolean };
  };
  /**
   * A Boolean attribute which, if present, indicates that the user should not be able to edit
   * the value of the input. The difference between disabled and readonly is that read-only
   * controls can still function, whereas disabled controls generally do not function as
   * controls until they are enabled.
   * (From: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#attr-readonly)
   */
  public readOnly: boolean;
  /**
   * The name the element will be registered with to the .formElements collection
   * of the parent.
   */
  public name: string;
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
  public modelValue: unknown;
  /**
   * The label text for the input node.
   * When no light dom defined via [slot=label], this value will be used
   */
  public get label(): string;
  public set label(arg: string);
  __label: string | undefined;
  /**
   * The helpt text for the input node.
   * When no light dom defined via [slot=help-text], this value will be used
   */
  public get helpText(): string;
  public set helpText(arg: string);
  __helpText: string | undefined;
  public set fieldName(arg: string);
  public get fieldName(): string;
  __fieldName: string | undefined;
  public get slots(): SlotsMap;
  get _inputNode(): HTMLElementWithValue;
  get _labelNode(): HTMLElement;
  get _helpTextNode(): HTMLElement;
  get _feedbackNode(): LionValidationFeedback | undefined;
  _inputId: string;
  _ariaLabelledNodes: HTMLElement[];
  _ariaDescribedNodes: HTMLElement[];
  /**
   * Based on the role, details of handling model-value-changed repropagation differ.
   */
  protected _repropagationRole: 'child' | 'choice-group' | 'fieldset';
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
  protected _isRepropagationEndpoint: boolean;

  connectedCallback(): void;
  updated(changedProperties: import('@lion/core').PropertyValues): void;

  render(): TemplateResult;
  protected _groupOneTemplate(): TemplateResult;
  protected _groupTwoTemplate(): TemplateResult;
  _labelTemplate(): TemplateResult;
  _helpTextTemplate(): TemplateResult;
  protected _inputGroupTemplate(): TemplateResult;
  _inputGroupBeforeTemplate(): TemplateResult;
  _inputGroupPrefixTemplate(): TemplateResult | typeof nothing;
  protected _inputGroupInputTemplate(): TemplateResult;
  _inputGroupSuffixTemplate(): TemplateResult | typeof nothing;
  _inputGroupAfterTemplate(): TemplateResult;
  _feedbackTemplate(): TemplateResult;

  protected _triggerInitialModelValueChangedEvent(): void;
  _enhanceLightDomClasses(): void;
  _enhanceLightDomA11y(): void;
  _enhanceLightDomA11yForAdditionalSlots(additionalSlots?: string[]): void;
  __reflectAriaAttr(attrName: string, nodes: HTMLElement[], reorder: boolean | undefined): void;
  protected _isEmpty(modelValue?: unknown): boolean;
  _getAriaDescriptionElements(): HTMLElement[];
  public addToAriaLabelledBy(
    element: HTMLElement,
    customConfig?: {
      idPrefix?: string | undefined;
      reorder?: boolean | undefined;
    },
  ): void;
  __reorderAriaLabelledNodes: boolean | undefined;
  public addToAriaDescribedBy(
    element: HTMLElement,
    customConfig?: {
      idPrefix?: string | undefined;
      reorder?: boolean | undefined;
    },
  ): void;
  public removeFromAriaLabelledBy(
    element: HTMLElement,
    customConfig?: {
      reorder?: boolean | undefined;
    },
  ): void;
  public removeFromAriaDescribedBy(
    element: HTMLElement,
    customConfig?: {
      reorder?: boolean | undefined;
    },
  ): void;
  __reorderAriaDescribedNodes: boolean | undefined;
  __getDirectSlotChild(slotName: string): HTMLElement;
  __dispatchInitialModelValueChangedEvent(): void;
  __repropagateChildrenInitialized: boolean | undefined;
  protected _onBeforeRepropagateChildrenValues(ev: CustomEvent): void;
  __repropagateChildrenValues(ev: CustomEvent): void;
}

export declare function FormControlImplementation<T extends Constructor<LitElement>>(
  superclass: T,
): T &
  Constructor<FormControlHost> &
  Pick<typeof FormControlHost, keyof typeof FormControlHost> &
  Constructor<FormRegisteringHost> &
  Pick<typeof FormRegisteringHost, keyof typeof FormRegisteringHost> &
  Constructor<DisabledHost> &
  Pick<typeof DisabledHost, keyof typeof DisabledHost> &
  Constructor<SlotHost> &
  Pick<typeof SlotHost, keyof typeof SlotHost> &
  Pick<typeof LitElement, keyof typeof LitElement>;

export type FormControlMixin = typeof FormControlImplementation;
