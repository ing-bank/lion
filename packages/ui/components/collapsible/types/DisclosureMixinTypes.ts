import { Constructor } from '@open-wc/dedupe-mixin';
import { LitElement } from 'lit';

export declare class DisclosureHost {
  public opened: Boolean;

  protected get _invokerNode(): HTMLElement;

  protected get _contentNode(): HTMLElement;

  public toggle(): void;

  public open(): void;

  public close(): void;

  protected _onOpenedChanged(): Promise<void>;

  protected _onDisclosureShow(): void;

  protected _onDisclosureHide(): void;

  protected _showAnimation(cfg: object): Promise<void>;

  protected _hideAnimation(cfg: object): Promise<void>;

  protected _refreshAnimateCompletePromise(): void;

  protected _setupOpenCloseListeners(): void;

  protected _teardownOpenCloseListeners(): void;

  private __setupAnimation(): void;

  private __teardownAnimation(): void;

  private __handleAnimateComplete(): void;
}

export declare function DisclosureImplementation<T extends Constructor<LitElement>>(
  superclass: T,
): T &
  Constructor<DisclosureHost> &
  DisclosureHost &
  Pick<typeof DisclosureHost, keyof typeof DisclosureHost> &
  Pick<typeof LitElement, keyof typeof LitElement>;

export type DisclosureMixin = typeof DisclosureImplementation;
