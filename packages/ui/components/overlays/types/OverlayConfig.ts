import { Options } from '@popperjs/core';

export type ViewportPlacement =
  | 'center'
  | 'top-left'
  | 'top'
  | 'top-right'
  | 'right'
  | 'bottom-right'
  | 'bottom'
  | 'bottom-left'
  | 'left';


export interface ViewportConfig {
  placement: ViewportPlacement;
}
export interface OverlayConfig {
  // Positioning

  /** Determines the positioning anchore (viewport vs invokerNode/referenceNode). */
  placementMode?: 'global' | 'local' | undefined;
  /** Popper configuration. Will be used when placementMode is 'local' */
  popperConfig?: Partial<Options>;
  /** Viewport positioning configuration. Will be used when placementMode is 'global' */
  viewportConfig?: ViewportConfig;
  /** Hides other overlays when multiple are opened (currently exclusive to globalOverlayController) */
  isBlocking?: boolean;
  /** Will align contentNode with referenceNode (invokerNode by default) for local overlays. Usually needed for dropdowns. 'max' will prevent contentNode from exceeding width of referenceNode, 'min' guarantees that contentNode will be at least as wide as referenceNode. 'full' will make sure that the invoker width always is the same. */
  inheritsReferenceWidth?: 'max' | 'full' | 'min' | 'none';
  /** Change the default of 9999 */
  zIndex?: number;

  // Elements

  /** The interactive element (usually a button) invoking the dialog or tooltip */
  invokerNode?: HTMLElement;
  /** The element that is used to position the overlay content relative to. Usually, this is the same element as invokerNode. Should only be provided when invokerNode should not be positioned against */
  referenceNode?: HTMLElement | undefined;
  /** The most important element: the overlay itself */
  contentNode?: HTMLElement;
  /** The wrapper element of contentNode, used to supply inline positioning styles. When a Popper arrow is needed, it acts as parent of the arrow node. Will be automatically created for global and non projected contentNodes. Required when used in shadow dom mode or when Popper arrow is supplied. Essential for allowing webcomponents to style their projected contentNodes */
  contentWrapperNode?: HTMLElement;
  /** The element that is placed behin the contentNode. When not provided and `hasBackdrop` is true, a backdropNode will be automatically created */
  backdropNode?: HTMLElement;
  /** The element that should be called `.focus()` on after dialog closes */
  elementToFocusAfterHide?: HTMLElement;

  // Backdrop

  /** Whether it should have a backdrop (currently exclusive to globalOverlayController) */
  hasBackdrop?: boolean;

  // User interaction

  /** Prevents scrolling body content when overlay opened (currently exclusive to globalOverlayController) */
  preventsScroll?: boolean;
  /** Rotates tab, implicitly set when 'isModal' */
  trapsKeyboardFocus?: boolean;
  /** Hides the overlay when pressing [ esc ] */
  hidesOnEsc?: boolean;
  /** Hides the overlay when clicking next to it, exluding invoker */
  hidesOnOutsideClick?: boolean;
  /** Hides the overlay when pressing esc, even when contentNode has no focus */
  hidesOnOutsideEsc?: boolean;

  // Accessibility

  /**
   *  For non `isTooltip`:
   *  - sets aria-expanded="true/false" and aria-haspopup="true" on invokerNode
   *  - sets aria-controls on invokerNode
   *  - returns focus to invokerNode on hide
   *  - sets focus to overlay content(?)
   *
   * For `isTooltip`:
   *  - sets role="tooltip" and aria-labelledby/aria-describedby on the content
   */
  handlesAccessibility?: boolean;

  // Tooltip

  /** Has a totally different interaction- and accessibility pattern from all other overlays. Will behave as role="tooltip" element instead of a role="dialog" element */
  isTooltip?: boolean;
  /** By default, the tooltip content is a 'description' for the invoker (uses aria-describedby) Setting this property to 'label' makes the content function as a label (via aria-labelledby) */
  invokerRelation?: 'label' | 'description';

  /** render a div instead of dialog */
  _noDialogEl?: Boolean;

  /**
   * Determines the conditions hiding/showing should be based on. It gets the OverlayController as input and returns an object with
   * functions with Overlay phases as keys
   */
  visibilityTriggerFunction?: Function;
}


