import { LitElement, nothing, TemplateResult, CSSResultArray } from '@lion/core';
import { SlotHost } from '@lion/core/types/SlotMixinTypes';
import { Constructor } from '@open-wc/dedupe-mixin';
import { DisabledHost } from '@lion/core/types/DisabledMixinTypes';
import { FormRegisteringHost } from './registration/FormRegisteringMixinTypes';

import { LionValidationFeedback } from '../src/validate/LionValidationFeedback';
import { Unparseable } from '../src/validate/Unparseable.js';

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

  /**
   * Whether an element was added or removed from the form.
   */
  mutation?: 'added' | 'removed';
};

declare interface HTMLElementWithValue extends HTMLElement {
  value: string;
  selectionStart?: number;
  selectionEnd?: number;
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
   * A boolean attribute which, if present, indicates that the user should not be able to edit
   * the value of the input. The difference between disabled and readonly is that read-only
   * controls can still function, whereas disabled controls generally do not function as
   * controls until they are enabled.
   * See: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#attr-readonly
   */
  readOnly: boolean;

  /**
   * The name the element will be registered with to the .formElements collection
   * of the parent. Also, it serves as the key of key/value pairs in
   *  modelValue/serializedValue objects
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
  get modelValue(): any | Unparseable;
  set modelValue(value: any | Unparseable);

  /**
   * The label text for the input node.
   * When no light dom defined via [slot=label], this value will be used
   */
  get label(): string;
  set label(arg: string);

  /**
   * The helpt text for the input node.
   * When no light dom defined via [slot=help-text], this value will be used
   */
  get helpText(): string;
  set helpText(arg: string);

  /**
   * Will be used in validation messages to refer to the current field
   */
  set fieldName(arg: string);
  get fieldName(): string;

  /**
   * Allows to add extra element references to aria-labelledby attribute.
   */
  addToAriaLabelledBy(
    element: HTMLElement,
    customConfig?: {
      idPrefix?: string | undefined;
      reorder?: boolean | undefined;
    },
  ): void;

  /**
   * Allows to add extra element references to aria-describedby attribute.
   */
  addToAriaDescribedBy(
    element: HTMLElement,
    customConfig?: {
      idPrefix?: string | undefined;
      reorder?: boolean | undefined;
    },
  ): void;

  /**
   * Allows to remove element references from aria-labelledby attribute.
   */
  removeFromAriaLabelledBy(
    element: HTMLElement,
    customConfig?: {
      reorder?: boolean | undefined;
    },
  ): void;

  /**
   * Allows to remove element references from aria-describedby attribute.
   */
  removeFromAriaDescribedBy(
    element: HTMLElement,
    customConfig?: {
      reorder?: boolean | undefined;
    },
  ): void;

  updated(changedProperties: import('@lion/core').PropertyValues): void;

  /**
   * The interactive (form) element. Can be a native element like input/textarea/select or
   * an element with tabindex > -1
   */
  protected get _inputNode(): HTMLElementWithValue | HTMLInputElement | HTMLTextAreaElement;

  /**
   * Element where label will be rendered to
   */
  protected get _labelNode(): HTMLElement;

  /**
   * Element where help text will be rendered to
   */
  protected get _helpTextNode(): HTMLElement;

  /**
   * Element where validation feedback will be rendered to
   */
  protected get _feedbackNode(): LionValidationFeedback;

  /**
   * Unique id that can be used in all light dom
   */
  protected _inputId: string;

  /**
   * Contains all elements that should end up in aria-labelledby of `._inputNode`
   * @type {HTMLElement[]}
   */
  protected _ariaLabelledNodes: HTMLElement[];

  /**
   * Contains all elements that should end up in aria-describedby of `._inputNode`
   */
  protected _ariaDescribedNodes: HTMLElement[];

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
  protected _parentFormGroup: FormControlHost | undefined;
  protected _groupOneTemplate(): TemplateResult;
  protected _groupTwoTemplate(): TemplateResult;
  protected _labelTemplate(): TemplateResult;
  protected _helpTextTemplate(): TemplateResult;
  protected _inputGroupTemplate(): TemplateResult;
  protected _inputGroupBeforeTemplate(): TemplateResult;
  protected _inputGroupPrefixTemplate(): TemplateResult | typeof nothing;
  protected _inputGroupInputTemplate(): TemplateResult;
  protected _inputGroupSuffixTemplate(): TemplateResult | typeof nothing;
  protected _inputGroupAfterTemplate(): TemplateResult;
  protected _feedbackTemplate(): TemplateResult;
  protected _triggerInitialModelValueChangedEvent(): void;
  protected _enhanceLightDomClasses(): void;
  protected _enhanceLightDomA11y(): void;
  protected _enhanceLightDomA11yForAdditionalSlots(additionalSlots?: string[]): void;
  protected _isEmpty(modelValue?: any): boolean;
  protected _getAriaDescriptionElements(): HTMLElement[];
  protected _dispatchInitialModelValueChangedEvent(): void;
  protected _onBeforeRepropagateChildrenValues(ev: CustomEvent): void;
  protected _repropagationCondition(target: FormControlHost): boolean;

  private __helpText: string | undefined;
  private __label: string;
  private __fieldName: string | undefined;
  private __reorderAriaLabelledNodes: boolean | undefined;
  private __reflectAriaAttr(
    attrName: string,
    nodes: HTMLElement[],
    reorder: boolean | undefined,
  ): void;
  private __reorderAriaDescribedNodes: boolean | undefined;
  private __getDirectSlotChild(slotName: string): HTMLElement | undefined;
  private __repropagateChildrenInitialized: boolean | undefined;
  private __repropagateChildrenValues(ev: CustomEvent): void;
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
