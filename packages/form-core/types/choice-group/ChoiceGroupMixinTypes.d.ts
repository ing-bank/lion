import { Constructor } from '@open-wc/dedupe-mixin';
import { LitElement } from '@lion/core';
import { FormControlHost } from '../FormControlMixinTypes';
import { FormRegistrarHost } from '../registration/FormRegistrarMixinTypes';
import { InteractionStateHost } from '../InteractionStateMixinTypes';

export declare class ChoiceGroupHost {
  multipleChoice: boolean;

  connectedCallback(): void;
  disconnectedCallback(): void;

  get modelValue(): any;

  set modelValue(value: any);

  get serializedValue(): string;

  set serializedValue(value: string);

  get formattedValue(): string;

  set formattedValue(value: string);

  connectedCallback(): void;

  disconnectedCallback(): void;

  addFormElement(child: FormControlHost, indexToInsertAt: number): void;

  clear(): void;

  protected _triggerInitialModelValueChangedEvent(): void;

  _getFromAllFormElements(property: string, filterCondition: Function): void;

  _throwWhenInvalidChildModelValue(child: FormControlHost): void;

  protected _isEmpty(): void;

  _checkSingleChoiceElements(ev: Event): void;

  protected _getCheckedElements(): void;

  _setCheckedElements(value: any, check: boolean): void;

  __setChoiceGroupTouched(): void;

  __delegateNameAttribute(child: FormControlHost): void;

  protected _onBeforeRepropagateChildrenValues(ev: Event): void;
  __oldModelValue: any;
}

export declare function ChoiceGroupImplementation<T extends Constructor<LitElement>>(
  superclass: T,
): T &
  Constructor<ChoiceGroupHost> &
  Pick<typeof ChoiceGroupHost, keyof typeof ChoiceGroupHost> &
  Constructor<FormRegistrarHost> &
  Pick<typeof FormRegistrarHost, keyof typeof FormRegistrarHost> &
  Constructor<InteractionStateHost> &
  Pick<typeof InteractionStateHost, keyof typeof InteractionStateHost> &
  Pick<typeof LitElement, keyof typeof LitElement>;

export type ChoiceGroupMixin = typeof ChoiceGroupImplementation;
