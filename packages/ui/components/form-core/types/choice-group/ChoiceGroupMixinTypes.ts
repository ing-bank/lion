import { Constructor } from '@open-wc/dedupe-mixin';
import { LitElement } from 'lit';
import { FormControl } from '../form-group/FormGroupMixinTypes.js';
import { FormControlHost } from '../FormControlMixinTypes.js';
import { InteractionStateHost } from '../InteractionStateMixinTypes.js';
import { FormRegistrarHost } from '../registration/FormRegistrarMixinTypes.js';
import { ChoiceInputHost } from './ChoiceInputMixinTypes.js';

export declare class ChoiceGroupHost {
  multipleChoice: boolean;
  get modelValue(): any;
  set modelValue(value: any);
  get serializedValue(): string;
  set serializedValue(value: string);
  get formattedValue(): string;
  set formattedValue(value: string);
  addFormElement(child: FormControlHost, indexToInsertAt: number): void;
  clear(): void;

  protected _oldModelValue: any;
  protected _triggerInitialModelValueChangedEvent(): void;
  protected _getFromAllFormElementsFilter(el: FormControl, type: string): boolean;
  protected _getFromAllFormElements(
    property: string,
    filterFn?: (el: FormControl, property?: string) => boolean,
  ): void;
  protected _throwWhenInvalidChildModelValue(child: FormControlHost): void;
  protected _isEmpty(): void;
  protected _checkSingleChoiceElements(ev: Event): void;
  protected _getCheckedElements(): ChoiceInputHost[];
  protected _setCheckedElements(value: any, check: boolean): void;
  protected _onBeforeRepropagateChildrenValues(ev: Event): void;

  private __setChoiceGroupTouched(): void;
  private __delegateNameAttribute(child: FormControlHost): void;
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
