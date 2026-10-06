import { Constructor } from '@open-wc/dedupe-mixin';
import { LitElement } from 'lit';
import { OverlayConfig } from '../../overlays/types/OverlayConfig.js';
import { DefineOverlayConfig } from '../../overlays/types/OverlayMixinTypes.js';
import { OverlayController } from '../../overlays/src/OverlayController.js';
import { InteractiveListHost } from './InteractiveListMixinTypes.js';

/**
 * The overlay side of a list host: the members `OverlayMixin` declares, on top of the list host
 * (`OverlayWithListInvokerMixin`, used by `LionMenu`).
 */
export declare class OverlayWithListInvokerHost extends InteractiveListHost {
  opened: Boolean;

  get config(): Partial<OverlayConfig>;

  set config(value: Partial<OverlayConfig>);

  open(): Promise<void>;

  close(): Promise<void>;

  toggle(): Promise<void>;

  repositionOverlay(): void;

  _onOverlayShow(): void;

  protected _overlayCtrl: OverlayController;

  protected get _overlayInvokerNode(): HTMLElement;

  protected get _overlayBackdropNode(): HTMLElement;

  protected get _overlayContentNode(): HTMLElement;

  protected get _overlayContentWrapperNode(): HTMLElement;

  protected _defineOverlay(config: DefineOverlayConfig): OverlayController;

  protected _defineOverlayConfig(): OverlayConfig;

  protected _setupOpenCloseListeners(): void;

  protected _teardownOpenCloseListeners(): void;

  protected _setupOverlayCtrl(): void;

  protected _teardownOverlayCtrl(): void;

  protected _setOpenedWithoutPropertyEffects(newOpened: Boolean): Promise<undefined>;
}

export declare function OverlayWithListInvokerImplementation<T extends Constructor<LitElement>>(
  superclass: T,
): T &
  Constructor<OverlayWithListInvokerHost> &
  Pick<typeof OverlayWithListInvokerHost, keyof typeof OverlayWithListInvokerHost> &
  Pick<typeof LitElement, keyof typeof LitElement>;

export type OverlayWithListInvokerMixin = typeof OverlayWithListInvokerImplementation;
