import { Constructor } from '@open-wc/dedupe-mixin';
import { LitElement } from '@lion/core';

export declare class DisclosureHost {
  public opened: Boolean;

  protected get _invokerNode(): HTMLElement;

  protected get _contentNode(): HTMLElement;

  public toggle(): void;

  public open(): void;

  public close(): void;

  protected async _onOpenedChanged(): void;

  protected _onDisclosureShow(): void;

  protected _onDisclosureHide(): void;

  protected async _showAnimation(cfg: object): void;

  protected async _hideAnimation(cfg: object): void;

  protected _refreshAnimateCompletePromise(): void;

  protected _setupOpenCloseListeners(): void;

  protected _teardownOpenCloseListeners(): void;

  private __setupAnimation(): void;

  private __teardownAnimation(): void;

  private __handeAnimateComplete(): void;
}

export declare function DisclosureImplementation<T extends Constructor<LitElement>>(
  superclass: T,
): T & Constructor<DisclosureHost> & DisclosureHost;

export type DisclosureMixin = typeof DisclosureImplementation;
