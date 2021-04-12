import { Constructor } from '@open-wc/dedupe-mixin';
import { LitElement } from '@lion/core';
import { DisabledHost } from '@lion/core/types/DisabledMixinTypes';
import { SlotHost } from '@lion/core/types/SlotMixinTypes';
import { FormControlHost } from '../FormControlMixinTypes';
import { FormRegistrarHost } from '../registration/FormRegistrarMixinTypes';
import { ValidateHost } from '../validate/ValidateMixinTypes';

export declare class FormGroupHost {
  prefilled: boolean;
  touched: boolean;
  dirty: boolean;
  submitted: boolean;
  serializedValue: { [key: string]: any };
  formattedValue: string;
  children: Array<HTMLElement & FormControlHost>;
  get modelValue(): { [x: string]: any };
  set modelValue(value: { [x: string]: any });
  resetInteractionState(): void;
  clearGroup(): void;
  submitGroup(): void;
  resetGroup(): void;

  protected _initialModelValue: { [x: string]: any };
  protected get _inputNode(): HTMLElement;
  protected static _addDescriptionElementIdsToField(): void;
  protected _setValueForAllFormElements(property: string, value: any): void;

  private __descriptionElementsInParentChain: Set<HTMLElement>;
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
