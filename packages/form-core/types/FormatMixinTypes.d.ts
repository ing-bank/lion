import { Constructor } from '@open-wc/dedupe-mixin';
import { LitElement } from '@lion/core';
import { FormatNumberOptions } from '@lion/localize/types/LocalizeMixinTypes';
import { ValidateHost } from './validate/ValidateMixinTypes';
import { FormControlHost } from './FormControlMixinTypes';

export declare class FormatHost {
  constructor(...args: any[]);
  formattedValue: string;
  serializedValue: string;
  formatOn: string;
  formatOptions: FormatNumberOptions;
  __preventRecursiveTrigger: boolean;
  __isHandlingUserInput: boolean;

  parser(v: string, opts: FormatNumberOptions): unknown;
  formatter(v: unknown, opts: FormatNumberOptions): string;
  serializer(v: unknown): string;
  deserializer(v: string): unknown;

  get value(): string;
  set value(value: string);

  _calculateValues(opts: { source: 'model' | 'serialized' | 'formatted' | null }): void;
  __callParser(value: string | undefined): object;
  __callFormatter(): string;
  _onModelValueChanged(arg: { modelValue: unknown }): void;
  _dispatchModelValueChangedEvent(): void;
  _syncValueUpwards(): void;
  _reflectBackFormattedValueToUser(): void;
  _reflectBackFormattedValueDebounced(): void;
  _reflectBackOn(): boolean;
  _proxyInputEvent(): void;
  _onUserInputChanged(): void;

  connectedCallback(): void;
  disconnectedCallback(): void;
}

export declare function FormatImplementation<T extends Constructor<LitElement>>(
  superclass: T,
): T &
  Constructor<FormatHost> &
  FormatHost &
  Constructor<ValidateHost> &
  typeof ValidateHost &
  Constructor<FormControlHost> &
  typeof FormControlHost;

export type FormatMixin = typeof FormatImplementation;
