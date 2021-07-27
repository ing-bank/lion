import { Constructor } from '@open-wc/dedupe-mixin';
import { LitElement } from '@lion/core';
import { DisabledHost } from '@lion/core/types/DisabledMixinTypes';
import { SlotHost } from '@lion/core/types/SlotMixinTypes';
import { FormControlHost } from '../FormControlMixinTypes';
import { FormRegistrarHost } from '../registration/FormRegistrarMixinTypes';
import { ValidateHost } from '../validate/ValidateMixinTypes';

export declare type FormControl = FormControlHost &
  HTMLElement & {
    _parentFormGroup?: HTMLElement;
    checked?: boolean;
    disabled: boolean;
    hasFeedbackFor: string[];
    makeRequestToBeDisabled: Function;
  };

export declare class FormGroupHost {
  /**
   * Disables all formElements in group
   */
  disabled: boolean;

  /**
   * True when all of the children are prefilled (see InteractionStateMixin for more details.)
   */
  prefilled: boolean;

  /**
   * True when the group as a whole is blurred (see InteractionStateMixin for more details.)
   */
  touched: boolean;

  /**
   * True when any of the children is dirty (see InteractionStateMixin for more details.)
   */
  dirty: boolean;

  /**
   * True when parent form is submitted
   */
  submitted: boolean;

  /**
   * Object keyed by formElements names, containing formElements' serializedValues
   */
  serializedValue: { [key: string]: any };

  /**
   * Object keyed by formElements names, containing formElements' formattedValues
   */
  formattedValue: string;

  /**
   * Object keyed by formElements names, containing formElements' modelValues
   */
  get modelValue(): { [x: string]: any };
  set modelValue(value: { [x: string]: any });

  /**
   * Resets all interaction states for all formElements
   */
  resetInteractionState(): void;

  /**
   * Clears all values and resets all interaction states of all FormControls in group,
   */
  clearGroup(): void;

  /**
   * Handles interaction state 'submitted'.
   * This allows children to enable visibility of validation feedback
   */
  submitGroup(): void;

  /**
   * Resets to initial/prefilled values and interaction states of all FormControls in group,
   */
  resetGroup(): void;

  /**
   * Gathers initial model values of all children. Used when resetGroup() is called.
   */
  protected _initialModelValue: { [x: string]: any };

  /**
   * The host element with role group (or radigroup or form) containing neccessary aria attributes
   */
  protected get _inputNode(): HTMLElement;

  /**
   * Gets a keyed be name object for requested property (like modelValue/serializedValue)
   */
  protected _getFromAllFormElements(
    property: string,
    filterFn?: (el: FormControl, property?: string) => boolean,
  ): { [name: string]: any };

  /**
   * A filter function which will exclude a form field when returning false
   * By default, exclude form fields which are disabled
   *
   * The type is be passed as well for more fine grained control, e.g.
   * distinguish the filter when fetching modelValue versus serializedValue
   */
  protected _getFromAllFormElementsFilter(el: FormControl, type: string): boolean;

  /**
   * Allows to set formElements values via a keyed object structure
   */
  protected _setValueMapForAllFormElements(property: string, values: { [x: string]: any }): void;

  /**
   * Sets the same value for requested property in all formElements
   */
  protected _setValueForAllFormElements(property: string, value: any): void;

  /**
   * Returns true when one of the formElements has requested property
   */
  protected _anyFormElementHas(prop: string): boolean;

  /**
   * Returns true when all of the formElements have requested property
   */
  protected _everyFormElementHas(prop: string): boolean;

  /**
   * Returns true when all of the formElements have requested property
   */
  protected _anyFormElementHasFeedbackFor(prop: string): boolean;
  protected _checkForOutsideClick(): void;
  protected _triggerInitialModelValueChangedEvent(): void;
  protected _syncDirty(): void;
  protected _onFocusOut(): void;
  protected _syncFocused(): void;

  private __descriptionElementsInParentChain: Set<HTMLElement>;
  private __addedSubValidators: boolean;
  private __isInitialModelValue: boolean;
  private __isInitialSerializedValue: boolean;
  private __pendingValues: {
    modelValue?: { [key: string]: any };
    serializedValue?: { [key: string]: any };
  };
  private __initInteractionStates(): void;
  private __setupOutsideClickHandling(): void;
  private __requestChildrenToBeDisabled(): void;
  private __retractRequestChildrenToBeDisabled(): void;
  private __linkParentMessages(): void;
  private __unlinkParentMessages(): void;
  private __storeAllDescriptionElementsInParentChain(): void;
  private __onChildValidatePerformed(e: Event): void;
}

export declare function FormGroupImplementation<T extends Constructor<LitElement>>(
  superclass: T,
): T &
  Constructor<FormGroupHost> &
  Pick<typeof FormGroupHost, keyof typeof FormGroupHost> &
  Constructor<FormRegistrarHost> &
  Pick<typeof FormRegistrarHost, keyof typeof FormRegistrarHost> &
  Constructor<FormControlHost> &
  Pick<typeof FormControlHost, keyof typeof FormControlHost> &
  Constructor<ValidateHost> &
  Pick<typeof ValidateHost, keyof typeof ValidateHost> &
  Constructor<DisabledHost> &
  Pick<typeof DisabledHost, keyof typeof DisabledHost> &
  Constructor<SlotHost> &
  Pick<typeof SlotHost, keyof typeof SlotHost> &
  Pick<typeof LitElement, keyof typeof LitElement>;

export type FormGroupMixin = typeof FormGroupImplementation;
