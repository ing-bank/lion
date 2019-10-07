  /**
   * @typedef {object} OverlayConfig
   * @property {HTMLElement} [elementToFocusAfterHide=document.body] - the element that should be
   * called `.focus()` on after dialog closes
   * @property {boolean} [hasBackdrop=false] - whether it should have a backdrop (currently
   * exclusive to globalOverlayController)
   * @property {boolean} [isBlocking=false] - hides other overlays when mutiple are opened
   * (currently exclusive to globalOverlayController)
   * @property {boolean} [preventsScroll=false] - prevents scrolling body content when overlay
   * opened (currently exclusive to globalOverlayController)
   * @property {boolean} [trapsKeyboardFocus=false] - rotates tab, implicitly set when 'isModal'
   * @property {boolean} [hidesOnEsc=false] - hides the overlay when pressing [ esc ]
   * @property {boolean} [hidesOnOutsideClick=false] - hides the overlay when clicking next to it,
   * exluding invoker. (currently exclusive to localOverlayController)
   * https://github.com/ing-bank/lion/pull/61
   * @property {HTMLElement} invokerNode
   * @property {HTMLElement} contentNode
   * @property {boolean} [isModal=false] - sets aria-modal and/or aria-hidden="true" on siblings
   * @property {boolean} [isGlobal=false] - determines the connection point in DOM (body vs next
   * to invoker). This is what other libraries often refer to as 'portal'. TODO: rename to renderToBody?
   * @property {boolean} [isTooltip=false] - has a totally different interaction- and accessibility pattern from all other overlays, so needed for internals.
   * @property {boolean} [handlesUserInteraction] - sets toggle on click, or hover when `isTooltip`
   * @property {boolean} [handlesAccessibility] -
   *  - For non `isTooltip`:
   *    - sets aria-expanded="true/false" and aria-haspopup="true" on invokerNode
   *    - sets aria-controls on invokerNode
   *    - returns focus to invokerNode on hide
   *    - sets focus to overlay content(?)
   *  - For `isTooltip`:
   *    - sets role="tooltip" and aria-labelledby/aria-describedby on the content
   * @property {PopperConfig} popperConfig
   */
