import { Constructor } from '@open-wc/dedupe-mixin';

export type NamespaceLocaleMap = {
  [key: string]: Function;
};

export declare class LocalizeMixinHost {
  constructor();

  static get localizeNamespaces(): NamespaceLocaleMap[];
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
  public msgLit(...args: string[]): void;

  private __getUniqueNamespaces(): void;
  private __localizeStartLoadingNamespaces(): void;
  private __localizeAddLocaleChangedListener(): void;
  private __localizeRemoveLocaleChangedListener(): void;
  private __localizeOnLocaleChanged(event: CustomEvent): void;
}

export declare function LocalizeMixinImplementation<T extends Constructor<HTMLElement>>(
  superclass: T,
): T & Constructor<LocalizeMixinHost>;

export type LocalizeMixin = typeof LocalizeMixinImplementation;
