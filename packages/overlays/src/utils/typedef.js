/**
 * @typedef {object} OverlayConfig
 * @property {HTMLElement} [elementToFocusAfterHide=document.body] the element that should be
 * called `.focus()` on after dialog closes
 * @property {boolean} [hasBackdrop=false] whether it should have a backdrop (currently
 * exclusive to globalOverlayController)
 * @property {boolean} [isBlocking=false] hides other overlays when mutiple are opened
 * (currently exclusive to globalOverlayController)
 * @property {boolean} [preventsScroll=false] prevents scrolling body content when overlay
 * opened (currently exclusive to globalOverlayController)
 * @property {boolean} [trapsKeyboardFocus=false] rotates tab, implicitly set when 'isModal'
 * @property {boolean} [hidesOnEsc=false] hides the overlay when pressing [ esc ]
 * @property {boolean} [hidesOnOutsideClick=false] hides the overlay when clicking next to it,
 * exluding invoker. (currently exclusive to localOverlayController)
 * https://github.com/ing-bank/lion/pull/61
 * @property {'max'|'full'|'min'|'none'} [inheritsReferenceWidth='none'] will align contentNode
 * with referenceNode (invokerNode by default) for local overlays. Usually needed for dropdowns.
 * 'max' will prevent contentNode from exceeding width
 * of referenceNode, 'min' guarantees that contentNode will be at least as wide as referenceNode.
 * 'full' will make sure that the invoker width always is the same.
 * @property {HTMLElement} invokerNode the interactive element (usually a button) invoking the
 * dialog or tooltip
 * @property {HTMLElement} [referenceNode] the element that is used to position the overlay content
 * relative to. Usually, this is the same element as invokerNode. Should only be provided whne
 * @property {HTMLElement} contentNode the most important element: the overlay itself.
 * @property {HTMLElement} [contentWrapperNode] the wrapper element of contentNode, used to supply
 * inline positioning styles. When a Popper arrow is needed, it acts as parent of the arrow node.
 * Will be automatically created for global and non projected contentNodes.
 * Required when used in shadow dom mode or when Popper arrow is supplied. Essential for allowing
 * webcomponents to style their projected contentNodes.
 * @property {HTMLElement} [backdropNode] the element that is placed behin the contentNode. When
 * not provided and `hasBackdrop` is true, a backdropNode will be automatically created
 * @property {'global'|'local'} placementMode determines the connection point in DOM (body vs next
 * to invoker).
 * @property {boolean} [isTooltip=false] has a totally different interaction- and accessibility
 * pattern from all other overlays. Will behave as role="tooltip" element instead of a role="dialog"
 * element.
 * @property {'label'|'description'} [invokerRelation='description']
 * @property {boolean} [handlesAccessibility]
 *  For non `isTooltip`:
 *    - sets aria-expanded="true/false" and aria-haspopup="true" on invokerNode
 *    - sets aria-controls on invokerNode
 *    - returns focus to invokerNode on hide
 *    - sets focus to overlay content(?)
 *
 * For `isTooltip`:
 *    - sets role="tooltip" and aria-labelledby/aria-describedby on the content
 * @property {object} popperConfig popper configuration. Will be used when placementMode is 'local'
 * @property {object} viewportConfig viewport configuration. Will be used when placementMode is
 * 'global'
 */
