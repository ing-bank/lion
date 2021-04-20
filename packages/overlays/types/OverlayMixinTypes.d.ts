import { Constructor } from '@open-wc/dedupe-mixin';
import { LitElement } from '@lion/core';
import { OverlayConfig } from './OverlayConfig.js';
import { OverlayController } from '../src/OverlayController.js';

export interface DefineOverlayConfig {
  /** The interactive element (usually a button) invoking the dialog or tooltip */
  invokerNode: HTMLElement;
  /** The element that is used to position the overlay content relative to. Usually, this is the same element as invokerNode. Should only be provided when invokerNode should not be positioned against */
  referenceNode?: HTMLElement;
  /** The most important element: the overlay itself */
  contentNode: HTMLElement;
  /** The wrapper element of contentNode, used to supply inline positioning styles. When a Popper arrow is needed, it acts as parent of the arrow node. Will be automatically created for global and non projected contentNodes. Required when used in shadow dom mode or when Popper arrow is supplied. Essential for allowing webcomponents to style their projected contentNodes */
  contentWrapperNode?: HTMLElement;
  /** The element that is placed behin the contentNode. When not provided and `hasBackdrop` is true, a backdropNode will be automatically created */
  backdropNode?: HTMLElement;
}

export declare class OverlayHost {
  opened: Boolean;
  get config(): OverlayConfig;
  set config(value: OverlayConfig);

  open(): void;
  close(): void;
  toggle(): void;
  /**
   * Sometimes it's needed to recompute Popper position of an overlay, for instance when we have
   * an opened combobox and the surrounding context changes (the space consumed by the textbox
   * increases vertically)
   */
  repositionOverlay(): void;

  protected _overlayCtrl: OverlayController;

  protected get _overlayInvokerNode(): HTMLElement;

  protected get _overlayBackdropNode(): HTMLElement;

  protected get _overlayContentNode(): HTMLElement;

  protected get _overlayContentWrapperNode(): HTMLElement;

  /**
   * returns an instance of a (dynamic) overlay controller
   * In case overriding _defineOverlayConfig is not enough
   */
  protected _defineOverlay(config: DefineOverlayConfig): OverlayController;
  protected _defineOverlayConfig(): OverlayConfig;

  protected _setupOpenCloseListeners(): void;

  protected _teardownOpenCloseListeners(): void;

  protected _setupOverlayCtrl(): void;

  protected _teardownOverlayCtrl(): void;

  /**
   * When the opened state is changed by an Application Developer,cthe OverlayController is
   * requested to show/hide. It might happen that this request is not honoured
   * (intercepted in before-hide for instance), so that we need to sync the controller state
   * to this webcomponent again, preventing eternal loops.
   */
  protected _setOpenedWithoutPropertyEffects(newOpened: Boolean): Promise<undefined>;

  private __setupSyncFromOverlayController(): void;
  private __teardownSyncFromOverlayController(): void;
  private __syncToOverlayController(): void;
}

export declare function OverlayImplementation<T extends Constructor<LitElement>>(
  superclass: T,
): T &
  Constructor<OverlayHost> &
  Pick<typeof OverlayHost, keyof typeof OverlayHost> &
  Pick<typeof LitElement, keyof typeof LitElement>;

export type OverlayMixin = typeof OverlayImplementation;
