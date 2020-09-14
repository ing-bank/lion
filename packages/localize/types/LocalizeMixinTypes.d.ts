import { Constructor } from '@open-wc/dedupe-mixin';

export interface FormatNumberPart {
  type: string;
  value: string;
}

// Take the DateTimeFormat and add the missing resolved options as well as optionals
export declare interface FormatDateOptions extends Intl.DateTimeFormatOptions {
  locale?: string;
  calendar?: string;
  numberingSystem?: string;
  timeZone?: string;

  roundMode?: string;
  returnIfNaN?: string;
  decimalSeparator?: string;
  mode?: 'pasted' | 'auto';
}

// Take the DateTimeFormat and add the missing resolved options as well as optionals, and our own
export declare interface FormatNumberOptions extends Intl.NumberFormatOptions {
  locale?: string;
  numberingSystem?: string;
  roundMode?: string;
  returnIfNaN?: string;
  decimalSeparator?: string;
  mode?: 'pasted' | 'auto';
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
  // FIXME: return value type check doesn't seem to be `working!
  static get localizeNamespaces(): StringToFunctionMap[];

  static get waitForLocalizeNamespaces(): boolean;

  public localizeNamespacesLoaded(): Promise<Object>;

  /**
   * Hook into LitElement to only render once all translations are loaded
   */
  public performUpdate(): Promise<void>;

  public onLocaleReady(): void;
  public onLocaleChanged(): void;
  public onLocaleUpdated(): void;
  public connectedCallback(): void;
  public disconnectedCallback(): void;
  public msgLit(keys: string | string[], variables?: msgVariables, options?: msgOptions): void;

  private __getUniqueNamespaces(): void;
  private __localizeAddLocaleChangedListener(): void;
  private __localizeRemoveLocaleChangedListener(): void;
  private __localizeOnLocaleChanged(event: CustomEvent): void;
}

declare function LocalizeMixinImplementation<T extends Constructor<HTMLElement>>(
  superclass: T,
): T & Constructor<LocalizeMixinHost> & typeof LocalizeMixinHost;

export type LocalizeMixin = typeof LocalizeMixinImplementation;
