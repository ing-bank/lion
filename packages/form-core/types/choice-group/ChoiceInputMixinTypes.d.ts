import { Constructor } from '@open-wc/dedupe-mixin';
import { LitElement, TemplateResult } from '@lion/core';
import { CSSResultArray } from '@lion/core';
import { FormatHost } from '../FormatMixinTypes';

export interface ChoiceInputModelValue {
  checked: boolean;
  value: any;
}

/** TODO: legacy code: serialization should happen on choice-group level */
export interface ChoiceInputSerializedValue {
  checked: boolean;
  value: string;
}

export declare class ChoiceInputHost {
  type: string;
  serializedValue: ChoiceInputSerializedValue;
  checked: boolean;
  get modelValue(): ChoiceInputModelValue;
  set modelValue(value: ChoiceInputModelValue);
  /**
   * The value that will be registered to the modelValue of the parent ChoiceGroup. Recommended
   * to be a string
   */
  get choiceValue(): any;
  set choiceValue(value: any);
  static get styles(): CSSResultArray;
  parser(): any;
  formatter(modelValue: ChoiceInputModelValue): string;

  protected _isHandlingUserInput: boolean;
  protected get _inputNode(): HTMLElement;

  protected _proxyInputEvent(): void;
  protected requestUpdateInternal(name: string, oldValue: any): void;
  protected _choiceGraphicTemplate(): TemplateResult;
  protected _afterTemplate(): TemplateResult;
  protected _preventDuplicateLabelClick(ev: Event): void;
  protected _syncNameToParentFormGroup(): void;
  protected _toggleChecked(ev: Event): void;
  protected _onModelValueChanged(
    newV: { modelValue: ChoiceInputModelValue },
    oldV: { modelValue: ChoiceInputModelValue },
  ): void;
  protected _isEmpty(): void;
  protected _syncValueUpwards(): void;

  private __syncModelCheckedToChecked(checked: boolean): void;
  private __syncCheckedToModel(checked: boolean): void;
  private __syncCheckedToInputElement(): void;
}

export declare function ChoiceInputImplementation<T extends Constructor<LitElement>>(
  superclass: T,
): T &
  Constructor<ChoiceInputHost> &
  Pick<typeof ChoiceInputHost, keyof typeof ChoiceInputHost> &
  Constructor<FormatHost> &
  Pick<typeof FormatHost, keyof typeof FormatHost> &
  Pick<typeof LitElement, keyof typeof LitElement>;

export type ChoiceInputMixin = typeof ChoiceInputImplementation;
