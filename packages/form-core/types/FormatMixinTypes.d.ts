import { Constructor } from '@open-wc/dedupe-mixin';
import { LitElement } from '@lion/core';
import { FormatNumberOptions } from '@lion/localize/types/LocalizeMixinTypes';
import { ValidateHost } from './validate/ValidateMixinTypes';
import { FormControlHost } from './FormControlMixinTypes';

export declare class FormatHost {
  parser(v: string, opts: FormatNumberOptions): unknown;
  formatter(v: unknown, opts?: FormatNumberOptions): string;
  serializer(v: unknown): string;
  deserializer(v: string): unknown;
  preprocessor(v: string): string;
  formattedValue: string;
  serializedValue: string;
  formatOn: string;
  formatOptions: FormatNumberOptions;
  get value(): string;
  set value(value: string);

  protected _isHandlingUserInput: boolean;
  protected _calculateValues(opts: { source: 'model' | 'serialized' | 'formatted' | null }): void;
  protected _onModelValueChanged(arg: { modelValue: unknown }): void;
  protected _dispatchModelValueChangedEvent(): void;
  protected _syncValueUpwards(): void;
  protected _reflectBackFormattedValueToUser(): void;
  protected _reflectBackFormattedValueDebounced(): void;
  protected _reflectBackOn(): boolean;
  protected _proxyInputEvent(): void;
  protected _onUserInputChanged(): void;
  protected _callParser(value: string | undefined): object;
  protected _callFormatter(): string;

  private __preventRecursiveTrigger: boolean;
}

export declare function FormatImplementation<T extends Constructor<LitElement>>(
  superclass: T,
): T &
  Constructor<FormatHost> &
  Pick<typeof FormatHost, keyof typeof FormatHost> &
  Constructor<ValidateHost> &
  Pick<typeof ValidateHost, keyof typeof ValidateHost> &
  Constructor<FormControlHost> &
  Pick<typeof FormControlHost, keyof typeof FormControlHost> &
  Pick<typeof LitElement, keyof typeof LitElement>;

export type FormatMixin = typeof FormatImplementation;
