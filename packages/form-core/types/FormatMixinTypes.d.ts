import { Constructor } from '@open-wc/dedupe-mixin';
import { LitElement } from '@lion/core';
import { FormatNumberOptions } from '@lion/localize/types/LocalizeMixinTypes';
import { ValidateHost } from './validate/ValidateMixinTypes';
import { FormControlHost } from './FormControlMixinTypes';

export declare class FormatHost {
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
  private __callParser(value: string | undefined): object;
  __callFormatter(): string;
  protected _onModelValueChanged(arg: { modelValue: unknown }): void;
  _dispatchModelValueChangedEvent(): void;
  protected _syncValueUpwards(): void;
  _reflectBackFormattedValueToUser(): void;
  _reflectBackFormattedValueDebounced(): void;
  _reflectBackOn(): boolean;
  protected _proxyInputEvent(): void;
  _onUserInputChanged(): void;

  connectedCallback(): void;
  disconnectedCallback(): void;
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
