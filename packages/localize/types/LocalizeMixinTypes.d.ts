import { Constructor } from '@open-wc/dedupe-mixin';
import { LitElement } from '@lion/core';

export interface FormatNumberPart {
  type: string;
  value: string;
}

declare function DatePostProcessorImplementation(date: string): string;

export type DatePostProcessor = typeof DatePostProcessorImplementation;

// Take the DateTimeFormat and add the missing resolved options as well as optionals
export declare interface FormatDateOptions extends Intl.DateTimeFormatOptions {
  locale?: string;
  calendar?: string;
  numberingSystem?: string;
  timeZone?: string;

  roundMode?: string;
  returnIfNaN?: string;
  mode?: 'pasted' | 'auto';

  postProcessors?: Map<string, DatePostProcessor>;
}

declare function NumberPostProcessorImplementation(number: string): string;

export type NumberPostProcessor = typeof NumberPostProcessorImplementation;

// Take the DateTimeFormat and add the missing resolved options as well as optionals, and our own
export declare interface FormatNumberOptions extends Intl.NumberFormatOptions {
  locale?: string;
  numberingSystem?: string;
  roundMode?: string;
  returnIfNaN?: string;
  // https://en.wikipedia.org/wiki/Decimal_separator#Current_standards
  decimalSeparator?: ',' | '.';
  // https://en.wikipedia.org/wiki/Decimal_separator#Digit_grouping
  // note the half space in there as well
  groupSeparator?: ',' | '.' | ' ' | '_' | ' ' | "'";
  mode?: 'pasted' | 'auto';

  postProcessors?: Map<string, NumberPostProcessor>;
}

interface StringToFunctionMap {
  [key: string]: Function;
}

export type NamespaceObject = StringToFunctionMap | string;

interface msgVariables {
  [key: string]: unknown;
}

interface msgOptions {
  locale?: string;
}

declare class LocalizeMixinHost {
  static get localizeNamespaces(): StringToFunctionMap[];

  static get waitForLocalizeNamespaces(): boolean;

  public localizeNamespacesLoaded: Promise<Object> | undefined;

  /**
   * Hook into LitElement to only render once all translations are loaded
   */
  public performUpdate(): Promise<void>;

  public onLocaleReady(): void;
  public onLocaleChanged(newLocale: string, oldLocale: string): void;
  public onLocaleUpdated(): void;
  public connectedCallback(): void;
  public disconnectedCallback(): void;
  public msgLit(keys: string | string[], variables?: msgVariables, options?: msgOptions): void;

  private __boundLocalizeOnLocaleChanged(...args: Object[]): void;
  private __boundLocalizeOnLocaleChanging(...args: Object[]): void;
  private __getUniqueNamespaces(): string[];
  private __localizeOnLocaleChanged(event: CustomEvent): void;
  private __localizeMessageSync: boolean;
  private __localizeStartLoadingNamespaces(): void;
  private __localizeOnLocaleChanging(): void;
}

declare function LocalizeMixinImplementation<T extends Constructor<LitElement>>(
  superclass: T,
): T &
  Constructor<LocalizeMixinHost> &
  Pick<typeof LocalizeMixinHost, keyof typeof LocalizeMixinHost> &
  Pick<typeof LitElement, keyof typeof LitElement>;

export type LocalizeMixin = typeof LocalizeMixinImplementation;
