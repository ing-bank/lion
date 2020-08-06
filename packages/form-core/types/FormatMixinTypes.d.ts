import { Constructor } from '@open-wc/dedupe-mixin';
import { LitElement } from '@lion/core';

export declare interface FormatOptions {
  locale?: string;
  decimalSeparator?: string;
}

export declare class FormatHost {
  static properties: {
    modelValue: { attribute: false };
    formattedValue: { attribute: false };
    serializedValue: { attribute: false };
    formatOn: { attribute: false };
    formatOptions: { attribute: false };
  };

  modelValue: unknown;
  formattedValue: string;
  serializedValue: string;
  formatOn: string;
  formatOptions: FormatOptions;
  value: string;
  __preventRecursiveTrigger: boolean;
  __isHandlingUserInput: boolean;

  parser(v: string, opts: FormatOptions): unknown;
  formatter(v: unknown, opts: FormatOptions): string;
  serializer(v: unknown): string;
  deserializer(v: unknown): unknown;

  _calculateValues(opts: { source: 'model' | 'serialized' | 'formatted' | null }): void;
  __callParser(value: string | undefined): object;
  __callFormatter(): string;
  _onModelValueChanged(args: { modelValue: unknown }[]): void;
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
): T & Constructor<FormatHost> & FormatHost;

export type FormatMixin = typeof FormatImplementation;
