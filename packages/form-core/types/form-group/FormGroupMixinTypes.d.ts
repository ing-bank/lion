import { Constructor } from '@open-wc/dedupe-mixin';
import { LitElement } from '@lion/core';
import { DisabledHost } from '@lion/core/types/DisabledMixinTypes';
import { SlotHost } from '@lion/core/types/SlotMixinTypes';
import { FormControlHost } from '../FormControlMixinTypes';
import { FormRegistrarHost } from '../registration/FormRegistrarMixinTypes';
import { ValidateHost } from '../validate/ValidateMixinTypes';

export declare class FormGroupHost {
  protected static _addDescriptionElementIdsToField(): void;
  get _inputNode(): HTMLElement;
  resetGroup(): void;
  prefilled: boolean;
  touched: boolean;
  dirty: boolean;
  submitted: boolean;
  serializedValue: string;
  modelValue: { [x: string]: any };
  formattedValue: string;
  children: Array<HTMLElement & FormControlHost>;
  _initialModelValue: { [x: string]: any };
  _setValueForAllFormElements(property: string, value: any): void;
  resetInteractionState(): void;
  clearGroup(): void;
}

export declare function FormGroupImplementation<T extends Constructor<LitElement>>(
  superclass: T,
): T &
  Constructor<FormGroupHost> &
  FormGroupHost &
  Constructor<FormRegistrarHost> &
  typeof FormRegistrarHost &
  Constructor<FormControlHost> &
  typeof FormControlHost &
  Constructor<ValidateHost> &
  typeof ValidateHost &
  Constructor<DisabledHost> &
  typeof DisabledHost &
  Constructor<SlotHost> &
  typeof SlotHost;

export type FormGroupMixin = typeof FormGroupImplementation;
