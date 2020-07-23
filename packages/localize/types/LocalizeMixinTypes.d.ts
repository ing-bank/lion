import { Constructor } from '@open-wc/dedupe-mixin';
import { StringToFunctionMap, PromiseOfObject, PromiseOfVoid } from './localizeTypes';

declare class LocalizeMixinHost {
  constructor();

  // FIXME: return value type check doesn't seem to be `working!
  static get localizeNamespaces(): StringToFunctionMap[];

  static get waitForLocalizeNamespaces(): boolean;

  public localizeNamespacesLoaded(): PromiseOfObject;

  /**
   * Hook into LitElement to only render once all translations are loaded
   */
  public performUpdate(): PromiseOfVoid;

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

declare function LocalizeMixinImplementation<T extends Constructor<HTMLElement>>(
  superclass: T,
): T & Constructor<LocalizeMixinHost>;

export type LocalizeMixin = typeof LocalizeMixinImplementation;
