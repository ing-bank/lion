import { EventTargetShim } from '@lion/ui/core.js';
import { adoptStyles } from 'lit';
import { overlays } from './singleton.js';
import { containFocus } from './utils/contain-focus.js';
import { overlayShadowDomStyle } from './overlayShadowDomStyle.js';
import { convertPopperToFloatingUiConfig } from './utils/convertPopperToFloatingUiConfig.js';

window.process = { env: { NODE_ENV: 'dev' } };

/**
 * @typedef {import('@lion/ui/types/overlays.js').OverlayConfig} OverlayConfig
 * @typedef {import('@lion/ui/types/overlays.js').ViewportConfig} ViewportConfig
 * @typedef {import('@popperjs/core').createPopper} Popper
 * @typedef {import('@popperjs/core').Options} PopperOptions
 * @typedef {import('@popperjs/core').Placement} Placement
 * @typedef {{ createPopper: Popper }} floatingUiModule
 *
 * @typedef {import('@floating-ui/dom')} FloatingUi
 * @typedef {'setup'|'init'|'teardown'|'before-show'|'show'|'hide'|'add'|'remove'} OverlayPhase
 */

const rootNodeStylesMap = new WeakSet();

/**
 * Returns element that adopts stylesheet
 * @param {Element} shadowOrBodyEl
 * @returns {ShadowRoot}
 */
function getRootNodeOrBodyElThatAdoptsStylesheet(shadowOrBodyEl) {
  const rootNode = /** @type {* & DocumentOrShadowRoot} */ (shadowOrBodyEl.getRootNode());
  if (rootNode === document) {
    // @ts-ignore
    return document.body;
  }
  return rootNode;
}

/**
 * From:
 * - wrappingDialogNodeL1: `<dialog role="none"/>`
 * - contentWrapperNodeL2: `<div id="content-wrapper-node"/>`
 * - contentNodeL3: `<div slot="my-content"/>`
 * To:
 * ```html
 * <dialog role="none">
 *   <div id="content-wrapper-node">
 *     <!-- this was the (slot for) original content node -->
 *     <slot name="my-content"></slot>
 *   </div>
 * </dialog>
 * ```
 *
 * `<slot name="my-content">` belonging to `<div slot="content"/>` will be wrapped with wrappingDialogNodeL1 and contentWrapperNodeL2
 * inside shadow dom. With the help of temp markers, `<slot name="my-content">`'s original position will be respected.
 *
 * @param {{ wrappingDialogNodeL1:HTMLDialogElement|HTMLDivElement; contentWrapperNodeL2:Element; contentNodeL3: Element }} opts
 */
function rearrangeNodes({ wrappingDialogNodeL1, contentWrapperNodeL2, contentNodeL3 }) {
  if (!(contentWrapperNodeL2.isConnected || contentNodeL3.isConnected)) {
    throw new Error(
      '[OverlayController] Could not find a render target, since the provided contentNode is not connected to the DOM. Make sure that it is connected, e.g. by doing "document.body.appendChild(contentNode)", before passing it on.',
    );
  }

  let parentElement;
  const tempMarker = document.createComment('tempMarker');

  if (contentWrapperNodeL2.isConnected) {
    // This is the case when contentWrapperNode (living in shadow dom, wrapping <slot name="my-content-outlet">) is already provided via controller.
    parentElement = contentWrapperNodeL2.parentElement || contentWrapperNodeL2.getRootNode();
    parentElement.insertBefore(tempMarker, contentWrapperNodeL2);
    // Wrap...
    wrappingDialogNodeL1.appendChild(contentWrapperNodeL2);
  }
  // if contentNodeL3.isConnected
  else {
    const contentIsProjected = contentNodeL3.assignedSlot;
    if (contentIsProjected) {
      parentElement =
        contentNodeL3.assignedSlot.parentElement || contentNodeL3.assignedSlot.getRootNode();
      parentElement.insertBefore(tempMarker, contentNodeL3.assignedSlot);
      wrappingDialogNodeL1.appendChild(contentWrapperNodeL2);
      // Important: we do not move around contentNodeL3, but the assigned slot
      contentWrapperNodeL2.appendChild(contentNodeL3.assignedSlot);
    } else {
      parentElement = contentNodeL3.parentElement || contentNodeL3.getRootNode();
      parentElement.insertBefore(tempMarker, contentNodeL3);
      wrappingDialogNodeL1.appendChild(contentWrapperNodeL2);
      contentWrapperNodeL2.appendChild(contentNodeL3);
    }
  }

  /**
   * From:
   * ```html
   * #shadow-root:
   * <div>
   *   <!-- tempMarker -->
   *   <slot name="x"/>
   * </div>
   * ```
   *
   * To:
   * ```html
   * #shadow-root:
   * <div>
   *   <!-- tempMarker -->
   *   <dialog role="none">
   *     <div id="content-wrapper-node">
   *       <slot name="x"/>
   *     </div>
   *   </dialog>
   * </div>
   * ```
   */
  parentElement.insertBefore(wrappingDialogNodeL1, tempMarker);
  parentElement?.removeChild(tempMarker);
}

/**
 * @returns {Promise<FloatingUi>}
 */
async function preloadFloatingUi() {
  return /** @type {Promise<FloatingUi>} */ (import('@floating-ui/dom'));
}

// @ts-expect-error [external]: CSS not yet typed
const supportsCSSTypedObject = window.CSS?.number && document.body.attributeStyleMap?.set;

/**
 * OverlayController is the fundament for every single type of overlay. With the right
 * configuration, it can be used to build (modal) dialogs, tooltips, dropdowns, popovers,
 * bottom/top/left/right sheets etc.
 *
 */
export class OverlayController extends EventTargetShim {
  /**
   * @constructor
   * @param {OverlayConfig} config initial config. Will be remembered as shared config
   * when `.updateConfig()` is called.
   */
  constructor(config = {}, manager = overlays) {
    super();
    this.manager = manager;
    /** @private */
    this.__sharedConfig = config;

    /** @type {OverlayConfig} */
    this.config = {};

    /**
     * @type {OverlayConfig}
     * @protected
     */
    this._defaultConfig = {
      placementMode: undefined,
      contentNode: config.contentNode,
      contentWrapperNode: config.contentWrapperNode,
      invokerNode: config.invokerNode,
      backdropNode: config.backdropNode,
      referenceNode: undefined,
      elementToFocusAfterHide: config.invokerNode,
      inheritsReferenceWidth: 'none',
      hasBackdrop: false,
      isBlocking: false,
      preventsScroll: false,
      trapsKeyboardFocus: false,
      hidesOnEsc: false,
      hidesOnOutsideEsc: false,
      hidesOnOutsideClick: false,
      isTooltip: false,
      invokerRelation: 'description',
      handlesUserInteraction: undefined,
      handlesAccessibility: false,
      popperConfig: {
        placement: 'top',
        strategy: 'absolute',
        modifiers: [
          {
            name: 'preventOverflow',
            enabled: true,
            options: {
              boundariesElement: 'viewport',
              padding: 8, // viewport-margin for shifting/sliding
            },
          },
          {
            name: 'flip',
            options: {
              boundariesElement: 'viewport',
              padding: 16, // viewport-margin for flipping
            },
          },
          {
            name: 'offset',
            enabled: true,
            options: {
              offset: [0, 8], // horizontal and vertical margin (distance between popper and referenceElement)
            },
          },
          {
            name: 'arrow',
            enabled: false,
          },
        ],
      },
      viewportConfig: {
        placement: 'center',
      },
      zIndex: 9999,
      // _noDialogEl: true,
    };

    this.manager.add(this);
    /** @protected */
    this._contentId = `overlay-content--${Math.random().toString(36).substr(2, 10)}`;
    /** @private */
    this.__originalAttrs = new Map();
    this.updateConfig(config);
    /** @private */
    this.__hasActiveTrapsKeyboardFocus = false;
    /** @private */
    this.__hasActiveBackdrop = true;
    /** @private */
    this.__escKeyHandler = this.__escKeyHandler.bind(this);
  }

  /**
   * The invokerNode
   * @type {HTMLElement | undefined}
   */
  get invoker() {
    return this.invokerNode;
  }

  /**
   * The contentWrapperNode
   * @type {HTMLDialogElement | HTMLDivElement}
   */
  get content() {
    return /** @type {HTMLDialogElement | HTMLDivElement} */ (this.__wrappingDialogNode);
  }

  /**
   * Determines the connection point in DOM (body vs next to invoker).
   * @type {'global' | 'local' | undefined}
   */
  get placementMode() {
    return this.config?.placementMode;
  }

  /**
   * The interactive element (usually a button) invoking the dialog or tooltip
   * @type {HTMLElement | undefined}
   */
  get invokerNode() {
    return this.config?.invokerNode;
  }

  /**
   * The element that is used to position the overlay content relative to. Usually,
   * this is the same element as invokerNode. Should only be provided when invokerNode should not
   * be positioned against.
   * @type {HTMLElement}
   */
  get referenceNode() {
    return /** @type {HTMLElement} */ (this.config?.referenceNode);
  }

  /**
   * The most important element: the overlay itself
   * @type {HTMLElement}
   */
  get contentNode() {
    return /** @type {HTMLElement} */ (this.config?.contentNode);
  }

  /**
   * The wrapper element of contentNode, used to supply inline positioning styles. When a Popper
   * arrow is needed, it acts as parent of the arrow node. Will be automatically created for global
   * and non projected contentNodes. Required when used in shadow dom mode or when Popper arrow is
   * supplied. Essential for allowing webcomponents to style their projected contentNodes
   * @type {HTMLElement}
   */
  get contentWrapperNode() {
    return /** @type {HTMLElement} */ (
      this.__contentWrapperNode || this.config?.contentWrapperNode
    );
  }

  /**
   * The element that is placed behind the contentNode. When not provided and `hasBackdrop` is true,
   * a backdropNode will be automatically created
   * @type {HTMLElement}
   */
  get backdropNode() {
    return /** @type {HTMLElement} */ (this.__backdropNode || this.config?.backdropNode);
  }

  /**
   * The element that should be called `.focus()` on after dialog closes
   * @type {HTMLElement}
   */
  get elementToFocusAfterHide() {
    return /** @type {HTMLElement} */ (
      this.__elementToFocusAfterHide || this.config?.elementToFocusAfterHide
    );
  }

  /**
   * Whether it should have a backdrop (currently exclusive to globalOverlayController)
   * @type {boolean}
   */
  get hasBackdrop() {
    return /** @type {boolean} */ (!!this.backdropNode || this.config?.hasBackdrop);
  }

  /**
   * Hides other overlays when mutiple are opened (currently exclusive to globalOverlayController)
   * @type {boolean}
   */
  get isBlocking() {
    return /** @type {boolean} */ (this.config?.isBlocking);
  }

  /**
   * Hides other overlays when mutiple are opened (currently exclusive to globalOverlayController)
   * @type {boolean}
   */
  get preventsScroll() {
    return /** @type {boolean} */ (this.config?.preventsScroll);
  }

  /**
   * Rotates tab, implicitly set when 'isModal'
   * @type {boolean}
   */
  get trapsKeyboardFocus() {
    return /** @type {boolean} */ (this.config?.trapsKeyboardFocus);
  }

  /**
   * Hides the overlay when pressing [ esc ]
   * @type {boolean}
   */
  get hidesOnEsc() {
    return /** @type {boolean} */ (this.config?.hidesOnEsc);
  }

  /**
   * Hides the overlay when clicking next to it, exluding invoker
   * @type {boolean}
   */
  get hidesOnOutsideClick() {
    return /** @type {boolean} */ (this.config?.hidesOnOutsideClick);
  }

  /**
   * Hides the overlay when pressing esc, even when contentNode has no focus
   * @type {boolean}
   */
  get hidesOnOutsideEsc() {
    return /** @type {boolean} */ (this.config?.hidesOnOutsideEsc);
  }

  /**
   * Will align contentNode with referenceNode (invokerNode by default) for local overlays.
   * Usually needed for dropdowns. 'max' will prevent contentNode from exceeding width of
   * referenceNode, 'min' guarantees that contentNode will be at least as wide as referenceNode.
   * 'full' will make sure that the invoker width always is the same.
   * @type {'max' | 'full' | 'min' | 'none' | undefined }
   */
  get inheritsReferenceWidth() {
    return this.config?.inheritsReferenceWidth;
  }

  /**
   * For non `isTooltip`:
   *  - sets aria-expanded="true/false" and aria-haspopup="true" on invokerNode
   *  - sets aria-controls on invokerNode
   *  - returns focus to invokerNode on hide
   *  - sets focus to overlay content(?)
   *
   * For `isTooltip`:
   *  - sets role="tooltip" and aria-labelledby/aria-describedby on the content
   *
   * @type {boolean}
   */
  get handlesAccessibility() {
    return /** @type {boolean} */ (this.config?.handlesAccessibility);
  }

  /**
   * Has a totally different interaction- and accessibility pattern from all other overlays.
   * Will behave as role="tooltip" element instead of a role="dialog" element
   * @type {boolean}
   */
  get isTooltip() {
    return /** @type {boolean} */ (this.config?.isTooltip);
  }

  /**
   * By default, the tooltip content is a 'description' for the invoker (uses aria-describedby).
   * Setting this property to 'label' makes the content function as a label (via aria-labelledby)
   * @type {'label' | 'description'| undefined}
   */
  get invokerRelation() {
    return this.config?.invokerRelation;
  }

  /**
   * Popper configuration. Will be used when placementMode is 'local'
   * @type {PopperOptions}
   */
  get popperConfig() {
    return /** @type {PopperOptions} */ (this.config?.popperConfig);
  }

  /**
   * Viewport configuration. Will be used when placementMode is 'global'
   * @type {ViewportConfig}
   */
  get viewportConfig() {
    return /** @type {ViewportConfig} */ (this.config?.viewportConfig);
  }

  get handlesUserInteraction() {
    return /** @type {function} */ (this.config?.handlesUserInteraction);
  }

  /**
   * @desc The element our local overlay will be positioned relative to.
   * @type {HTMLElement}
   * @protected
   */
  get _referenceNode() {
    return this.referenceNode || this.invokerNode;
  }

  /**
   * @param {number} value
   */
  set elevation(value) {
    // @ts-expect-error find out why config would/could be undfined
    this.__wrappingDialogNode.style.zIndex = `${this.config.zIndex + value}`;
  }

  /**
   * @type {number}
   */
  get elevation() {
    return Number(this.contentWrapperNode?.style.zIndex);
  }

  /**
   * Allows to dynamically change the overlay configuration. Needed in case the
   * presentation of the overlay changes depending on screen size.
   * Note that this method is the only allowed way to update a configuration of an
   * OverlayController instance.
   * @param { OverlayConfig } cfgToAdd
   */
  updateConfig(cfgToAdd) {
    // Teardown all previous configs
    this.teardown();

    /**
     * @type {OverlayConfig}
     * @private
     */
    this.__prevConfig = this.config;

    /** @type {OverlayConfig} */
    this.config = {
      ...this._defaultConfig, // our basic ingredients
      ...this.__sharedConfig, // the initial configured overlayController
      ...cfgToAdd, // the added config
      popperConfig: {
        ...(this._defaultConfig.popperConfig || {}),
        ...(this.__sharedConfig.popperConfig || {}),
        ...(cfgToAdd.popperConfig || {}),
        modifiers: [
          ...(this._defaultConfig.popperConfig?.modifiers || []),
          ...(this.__sharedConfig.popperConfig?.modifiers || []),
          ...(cfgToAdd.popperConfig?.modifiers || []),
        ],
      },
    };

    /** @private */
    this.__validateConfiguration(this.config);
    /** @protected */
    this._init();
    /** @private */
    this.__elementToFocusAfterHide = undefined;
  }

  /**
   * @param {OverlayConfig} newConfig
   * @private
   */
  // eslint-disable-next-line class-methods-use-this
  __validateConfiguration(newConfig) {
    if (!newConfig.placementMode) {
      throw new Error(
        '[OverlayController] You need to provide a .placementMode ("global"|"local")',
      );
    }
    if (!['global', 'local'].includes(newConfig.placementMode)) {
      throw new Error(
        `[OverlayController] "${newConfig.placementMode}" is not a valid .placementMode, use ("global"|"local")`,
      );
    }
    if (!newConfig.contentNode) {
      throw new Error('[OverlayController] You need to provide a .contentNode');
    }
    if (newConfig.isTooltip && !newConfig.handlesAccessibility) {
      throw new Error(
        '[OverlayController] .isTooltip only takes effect when .handlesAccessibility is enabled',
      );
    }
    // if (newConfig.popperConfig.modifiers.arrow && !newConfig.contentWrapperNode) {
    //   throw new Error('You need to provide a .contentWrapperNode when Popper arrow is enabled');
    // }
  }

  /**
   * @protected
   */
  _init() {
    if (!this.__contentHasBeenInitialized) {
      this.__initContentDomStructure();
      this.__contentHasBeenInitialized = true;
    }

    // Reset all positioning styles (local, c.q. Popper) and classes (global)
    this.contentWrapperNode.removeAttribute('style');
    this.contentWrapperNode.removeAttribute('class');

    if (this.placementMode === 'local') {
      // Lazily load Popper if not done yet
      if (!OverlayController.floatingUiModule) {
        OverlayController.floatingUiModule = preloadFloatingUi();
      }
    }
    this.__initOverlayStyles();
    this._handleFeatures({ phase: 'init' });
  }

  __initOverlayStyles() {
    const rootNode = getRootNodeOrBodyElThatAdoptsStylesheet(this.contentWrapperNode);
    if (!rootNodeStylesMap.has(rootNode)) {
      // TODO: ideally we should also support a teardown
      adoptStyles(rootNode, [...(rootNode.adoptedStyleSheets || []), overlayShadowDomStyle]);
      rootNodeStylesMap.add(rootNode);
    }
  }

  /**
   * Here we arrange our content node via:
   * 1. HTMLDialogElement: the content will always be painted to the browser's top layer
   *   - no matter what context the contentNode lives in, the overlay will be painted correctly via the <dialog> element,
   *     even if 'overflow:hidden' or a css transform is applied in its parent hierarchy.
   *   - the dialog element will be unstyled, but will span the whole screen
   *   - a backdrop element will be a child of the dialog element, so it leverages the capabilities of the parent
   *     (filling the whole screen if wanted an always painted to top layer)
   * 2. ContentWrapper: the content receives the right positioning styles in a clean/non conflicting way:
   *  - local positioning: receive inline (position) styling that can never conflict with the already existing computed styles
   *  - global positioning: receive flex (child) classes that position the content correctly relative to the viewport
   *
   * The resulting structure that will be created looks like this:
   *
   * ...
   * <dialog role="none">
   *   <div id="optional-backdrop"></div>
   *   <div id="content-wrapper-node">
   *     <!-- this was the (slot for) original content node -->
   *     <slot name="content"></slot>
   *   </div>
   * </dialog>
   * ...
   *
   * @private
   */
  __initContentDomStructure() {
    const wrappingDialogElement = document.createElement(
      this.config?._noDialogEl ? 'div' : 'dialog',
    );
    // We use a dialog for its visual capabilities: it renders to the top layer.
    // A11y will depend on the type of overlay and is arranged on contentNode level.
    // Also see: https://www.scottohara.me/blog/2019/03/05/open-dialog.html
    wrappingDialogElement.setAttribute('role', 'none');
    wrappingDialogElement.setAttribute('data-overlay-id', 'outer-wrapper');
    // N.B. position: fixed is needed to escape out of 'overflow: hidden'
    // We give a high z-index for non-modal dialogs, so that we at least win from all siblings of our
    // parent stacking context
    wrappingDialogElement.style.cssText = `display:none; z-index: ${this.config.zIndex};`;
    this.__wrappingDialogNode = wrappingDialogElement;

    /**
     * Based on the configuration of the developer, multiple scenarios are accounted for
     * A. We already have a contentWrapperNode ()
     */
    if (!this.config?.contentWrapperNode) {
      this.__contentWrapperNode = document.createElement('div');
    }
    this.contentWrapperNode.setAttribute('data-overlay-id', 'content-wrapper');
    this.contentWrapperNode.style.zIndex = '1';
    // Prepare contentWrapperNode: https://floating-ui.com/docs/computePosition
    this.contentWrapperNode.style.cssText = `
      /* Float on top of the UI */
      position: ${this.config.popperConfig?.strategy};

      /* Avoid layout interference */
      width: max-content;
      top: 0;
      left: 0;`;

    rearrangeNodes({
      wrappingDialogNodeL1: wrappingDialogElement,
      contentWrapperNodeL2: this.contentWrapperNode,
      contentNodeL3: this.contentNode,
    });
    // @ts-ignore
    wrappingDialogElement.open = true;

    this.__wrappingDialogNode.style.display = 'none';

    if (getComputedStyle(this.contentNode).position === 'absolute') {
      // Having a _contWrapperNode and a contentNode with 'position:absolute' results in
      // computed height of 0...
      this.contentNode.style.position = 'static';
    }
  }

  /**
   * Display local overlays on top of elements with no z-index that appear later in the DOM
   * @param {{ phase: OverlayPhase }} config
   * @protected
   */
  _handleZIndex({ phase }) {
    if (this.placementMode !== 'local') {
      return;
    }

    if (phase === 'setup') {
      const zIndexNumber = Number(getComputedStyle(this.contentNode).zIndex);
      if (zIndexNumber < 1 || Number.isNaN(zIndexNumber)) {
        this.contentNode.style.zIndex = '1';
      }
    }
  }

  /**
   * @param {{ phase: OverlayPhase }} config
   * @private
   */
  __setupTeardownAccessibility({ phase }) {
    if (phase === 'init') {
      this.__storeOriginalAttrs(this.contentNode, ['role', 'id']);

      if (this.invokerNode) {
        this.__storeOriginalAttrs(this.invokerNode, [
          'aria-expanded',
          'aria-labelledby',
          'aria-describedby',
        ]);
      }

      if (!this.contentNode.id) {
        this.contentNode.setAttribute('id', this._contentId);
      }
      if (this.isTooltip) {
        if (this.invokerNode) {
          this.invokerNode.setAttribute(
            this.invokerRelation === 'label' ? 'aria-labelledby' : 'aria-describedby',
            this._contentId,
          );
        }
        this.contentNode.setAttribute('role', 'tooltip');
      } else {
        if (this.invokerNode) {
          this.invokerNode.setAttribute('aria-expanded', `${this.isShown}`);
        }
        if (!this.contentNode.getAttribute('role')) {
          this.contentNode.setAttribute('role', 'dialog');
        }
      }
    } else if (phase === 'teardown') {
      this.__restoreOriginalAttrs();
    }
  }

  /**
   * @param {HTMLElement} node
   * @param {string[]} attrs
   * @private
   */
  __storeOriginalAttrs(node, attrs) {
    const attrMap = {};
    attrs.forEach(attrName => {
      attrMap[attrName] = node.getAttribute(attrName);
    });
    this.__originalAttrs.set(node, attrMap);
  }

  /** @private */
  __restoreOriginalAttrs() {
    for (const [node, attrMap] of this.__originalAttrs) {
      Object.entries(attrMap).forEach(([attrName, value]) => {
        if (value !== null) {
          node.setAttribute(attrName, value);
        } else {
          node.removeAttribute(attrName);
        }
      });
    }
    this.__originalAttrs.clear();
  }

  get isShown() {
    return Boolean(this.__wrappingDialogNode?.style.display !== 'none');
  }

  /**
   * @event before-show right before the overlay shows. Used for animations and switching overlays
   * @event show right after the overlay is shown
   * @param {HTMLElement} elementToFocusAfterHide
   */
  async show(elementToFocusAfterHide = this.elementToFocusAfterHide) {
    // Subsequent shows could happen, make sure we await it first.
    // Otherwise it gets replaced before getting resolved, and places awaiting it will time out.
    if (this._showComplete) {
      await this._showComplete;
    }
    this._showComplete = new Promise(resolve => {
      this._showResolve = resolve;
    });

    if (this.manager) {
      this.manager.show(this);
    }

    if (this.isShown) {
      /** @type {function} */
      (this._showResolve)();
      return;
    }

    const event = new CustomEvent('before-show', { cancelable: true });
    this.dispatchEvent(event);
    if (!event.defaultPrevented) {
      if (this.__wrappingDialogNode instanceof HTMLDialogElement) {
        this.__wrappingDialogNode.open = true;
      }
      // @ts-ignore
      this.__wrappingDialogNode.style.display = '';
      this._keepBodySize({ phase: 'before-show' });
      await this._handleFeatures({ phase: 'show' });
      this._keepBodySize({ phase: 'show' });
      await this._handlePosition({ phase: 'show' });
      this.__elementToFocusAfterHide = elementToFocusAfterHide;
      this.dispatchEvent(new Event('show'));
      await this._transitionShow({
        backdropNode: this.backdropNode,
        contentNode: this.contentNode,
      });
    }
    /** @type {function} */
    (this._showResolve)();
  }

  /**
   * @param {{ phase: OverlayPhase }} config
   * @protected
   */
  async _handlePosition({ phase }) {
    switch (this.placementMode) {
      case 'global':
        await this._handlePositionGlobal({
          phase,
          contentNode: this.contentNode,
          contentWrapperNode: this.contentWrapperNode,
          viewportPlacement: this.config.viewportConfig?.placement,
        });
        break;
      case 'local':
        await this._handlePositionLocal({ phase });
        break;
      default:
        break;
    }
  }

  /**
   * @param {{ phase: OverlayPhase; contentNode: HTMLElement; contentWrapperNode: HTMLElement; viewportPlacement: import('../types/OverlayConfig.js').ViewportPlacement }} config
   * @protected
   */
  // eslint-disable-next-line class-methods-use-this
  async _handlePositionGlobal({ phase, contentNode, contentWrapperNode, viewportPlacement }) {
    const placementClass = `overlays__overlay-container--${viewportPlacement}`;

    if (phase === 'show') {
      contentWrapperNode.classList.add('overlays__overlay-container');
      contentWrapperNode.classList.add(placementClass);
      contentNode.classList.add('overlays__overlay');
    } else if (phase === 'hide') {
      contentWrapperNode.classList.remove('overlays__overlay-container');
      contentWrapperNode.classList.remove(placementClass);
      contentNode.classList.remove('overlays__overlay');
    }
  }

  /**
   * @param {{ phase: OverlayPhase }} config
   * @protected
   */
  async _handlePositionLocal({ phase }) {
    const floatingUi = /** @type {FloatingUi} */ (await OverlayController.floatingUiModule);

    switch (phase) {
      case 'show':
        this.__clearAutoUpdate = floatingUi.autoUpdate(
          this._referenceNode,
          this.contentWrapperNode,
          () =>
            this.__updateLocalPosition({
              floatingUi,
              popperConfig: this.config?.popperConfig,
              referenceNode: this._referenceNode,
              contentWrapperNode: this.contentWrapperNode,
              arrowNode: this._arrowNode,
              adjustWidthFn: () => this._handleInheritsReferenceWidth(),
            }),
        );
        break;
      case 'hide':
      case 'teardown':
        this.__clearAutoUpdate?.();
        break;
      default:
        break;
    }
  }

  get _arrowNode() {
    return this.config?.arrowNode || this.contentWrapperNode.querySelector('[data-popper-arrow]');
  }

  /**
   * @param {{floatingUi:FloatingUi; popperConfig: PopperOptions; referenceNode: Element; contentWrapperNode: HTMLElement; arrowNode: HTMLElement; adjustWidthFn?: Function }} opts
   */
  // eslint-disable-next-line class-methods-use-this
  async __updateLocalPosition({
    floatingUi,
    popperConfig,
    referenceNode,
    contentWrapperNode,
    arrowNode,
    adjustWidthFn,
  }) {
    const floatingUiConfig = await convertPopperToFloatingUiConfig(popperConfig, {
      floatingUi,
      arrowEl: arrowNode,
    });

    // Prepare contentWrapperNode: https://floating-ui.com/docs/computePosition
    // eslint-disable-next-line no-param-reassign
    contentWrapperNode.style.cssText = `
      position: ${floatingUiConfig.strategy};
      width: max-content;
      top: 0;
      left: 0;`;
    adjustWidthFn?.();

    const { x, y, middlewareData } = await floatingUi.computePosition(
      referenceNode,
      contentWrapperNode,
      {
        placement: floatingUiConfig.placement,
        strategy: floatingUiConfig.strategy,
        middleware: floatingUiConfig.middleware,
      },
    );

    // Since `computePosition` removes inline style, we need to add the
    // reference width styles again...
    // eslint-disable-next-line no-param-reassign
    contentWrapperNode.style.cssText = `
      position: ${floatingUiConfig.strategy};
      width: max-content;
      transform: translate3d(${Math.round(x)}px,${Math.round(y)}px,0);`;
    adjustWidthFn?.();

    if (!middlewareData.arrow) {
      return;
    }

    const { x: arrowX, y: arrowY, centerOffset } = middlewareData.arrow;

    Object.assign(arrowNode.style, {
      position: 'absolute',
      left: `${arrowX}px`,
      top: `${arrowY}px`,
    });
  }

  /**
   * @param {{ phase: OverlayPhase }} config
   * @protected
   */
  _keepBodySize({ phase }) {
    switch (phase) {
      case 'before-show':
        this.__bodyClientWidth = document.body.clientWidth;
        this.__bodyClientHeight = document.body.clientHeight;
        this.__bodyMarginRightInline = document.body.style.marginRight;
        this.__bodyMarginBottomInline = document.body.style.marginBottom;
        break;
      case 'show': {
        if (window.getComputedStyle) {
          const bodyStyle = window.getComputedStyle(document.body);
          this.__bodyMarginRight = parseInt(bodyStyle.getPropertyValue('margin-right'), 10);
          this.__bodyMarginBottom = parseInt(bodyStyle.getPropertyValue('margin-bottom'), 10);
        } else {
          this.__bodyMarginRight = 0;
          this.__bodyMarginBottom = 0;
        }
        const scrollbarWidth =
          document.body.clientWidth - /** @type {number} */ (this.__bodyClientWidth);
        const scrollbarHeight =
          document.body.clientHeight - /** @type {number} */ (this.__bodyClientHeight);
        const newMarginRight = this.__bodyMarginRight + scrollbarWidth;
        const newMarginBottom = this.__bodyMarginBottom + scrollbarHeight;
        if (supportsCSSTypedObject) {
          // @ts-expect-error [external]: types attributeStyleMap + CSS.px not available yet
          document.body.attributeStyleMap.set('margin-right', CSS.px(newMarginRight));
          // @ts-expect-error [external]: types attributeStyleMap + CSS.px not available yet
          document.body.attributeStyleMap.set('margin-bottom', CSS.px(newMarginBottom));
        } else {
          document.body.style.marginRight = `${newMarginRight}px`;
          document.body.style.marginBottom = `${newMarginBottom}px`;
        }
        break;
      }
      case 'hide':
        document.body.style.marginRight = this.__bodyMarginRightInline || '';
        document.body.style.marginBottom = this.__bodyMarginBottomInline || '';
        break;
      /* no default */
    }
  }

  /**
   * @event before-hide right before the overlay hides. Used for animations and switching overlays
   * @event hide right after the overlay is hidden
   */
  async hide() {
    this._hideComplete = new Promise(resolve => {
      this._hideResolve = resolve;
    });

    if (this.manager) {
      this.manager.hide(this);
    }

    if (!this.isShown) {
      /** @type {function} */ (this._hideResolve)();
      return;
    }

    const event = new CustomEvent('before-hide', { cancelable: true });
    this.dispatchEvent(event);
    if (!event.defaultPrevented) {
      await this._transitionHide({
        backdropNode: this.backdropNode,
        contentNode: this.contentNode,
      });

      if (this.__wrappingDialogNode instanceof HTMLDialogElement) {
        this.__wrappingDialogNode.close();
      }
      // @ts-ignore
      this.__wrappingDialogNode.style.display = 'none';
      this._handleFeatures({ phase: 'hide' });
      this._keepBodySize({ phase: 'hide' });
      this.dispatchEvent(new Event('hide'));
      this._restoreFocus();
    }
    /** @type {function} */ (this._hideResolve)();
  }

  /**
   * Method to be overriden by subclassers
   *
   * @param {{backdropNode:HTMLElement, contentNode:HTMLElement}} hideConfig
   */
  // @ts-ignore
  // eslint-disable-next-line class-methods-use-this, no-empty-function, no-unused-vars
  async transitionHide(hideConfig) {}

  /**
   * @param {{backdropNode:HTMLElement, contentNode:HTMLElement}} hideConfig
   * @protected
   */
  // eslint-disable-next-line class-methods-use-this, no-empty-function, no-unused-vars
  async _transitionHide({ backdropNode, contentNode }) {
    // `this.transitionHide` is a hook for our users
    await this.transitionHide({ backdropNode, contentNode });
    this._handlePosition({ phase: 'hide' });
    if (!backdropNode) {
      return;
    }
    backdropNode.classList.remove(`overlays__backdrop--animation-in`);
  }

  /**
   * To be overridden by subclassers
   *
   * @param {{backdropNode:HTMLElement; contentNode:HTMLElement}} showConfig
   */
  // @ts-ignore
  // eslint-disable-next-line class-methods-use-this, no-empty-function, no-unused-vars
  async transitionShow(showConfig) {}

  /**
   * @param {{backdropNode:HTMLElement; contentNode:HTMLElement}} showConfig
   */
  // eslint-disable-next-line class-methods-use-this, no-empty-function, no-unused-vars
  async _transitionShow(showConfig) {
    // `this.transitionShow` is a hook for our users
    await this.transitionShow({ backdropNode: this.backdropNode, contentNode: this.contentNode });

    if (showConfig.backdropNode) {
      showConfig.backdropNode.classList.add(`overlays__backdrop--animation-in`);
    }
  }

  /** @protected */
  _restoreFocus() {
    // We only are allowed to move focus if we (still) 'own' the active element.
    // Otherwise we assume the 'outside world' has purposefully taken over
    const { activeElement } = /** @type {ShadowRoot} */ (this.contentNode.getRootNode());
    const weStillOwnActiveElement =
      activeElement instanceof HTMLElement && this.contentNode.contains(activeElement);
    if (!weStillOwnActiveElement) {
      return;
    }

    if (this.elementToFocusAfterHide) {
      this.elementToFocusAfterHide.focus();
    } else {
      activeElement.blur();
    }
  }

  async toggle() {
    return this.isShown ? this.hide() : this.show();
  }

  /**
   * All features are handled here.
   * @param {{ phase: OverlayPhase }} config
   * @protected
   */
  _handleFeatures({ phase }) {
    this._handleZIndex({ phase });

    if (this.preventsScroll) {
      this._handlePreventsScroll({ phase });
    }
    if (this.isBlocking) {
      this._handleBlocking({ phase });
    }
    if (this.hasBackdrop) {
      this._handleBackdrop({ phase });
    }
    if (this.trapsKeyboardFocus) {
      this._handleTrapsKeyboardFocus({ phase });
    }
    if (this.hidesOnEsc) {
      this._handleHidesOnEsc({ phase });
    }
    if (this.hidesOnOutsideEsc) {
      this._handleHidesOnOutsideEsc({ phase });
    }
    if (this.hidesOnOutsideClick) {
      this._handleHidesOnOutsideClick({ phase });
    }
    if (this.handlesAccessibility) {
      this._handleAccessibility({ phase });
    }
    if (this.inheritsReferenceWidth) {
      this._handleInheritsReferenceWidth();
    }

    if (this.handlesUserInteraction) {
      this._handleUserInteraction({ phase });
    }
  }

  /**
   * @param {{ phase: OverlayPhase }} config
   */
  _handleUserInteraction({ phase }) {
    if (typeof this.handlesUserInteraction === 'function') {
      if (phase === 'init') {
        this.__userInteractionHandler = this.handlesUserInteraction({ phase, controller: this });
      }
      if (this.__userInteractionHandler[phase]) {
        this.__userInteractionHandler[phase]();
      }
    }
  }

  /**
   * @param {{ phase: OverlayPhase }} config
   * @protected
   */
  _handlePreventsScroll({ phase }) {
    switch (phase) {
      case 'show':
        this.manager.requestToPreventScroll();
        break;
      case 'hide':
        this.manager.requestToEnableScroll();
        break;
      /* no default */
    }
  }

  /**
   * @param {{ phase: OverlayPhase }} config
   * @protected
   */
  _handleBlocking({ phase }) {
    switch (phase) {
      case 'show':
        this.manager.requestToShowOnly(this);
        break;
      case 'hide':
        this.manager.retractRequestToShowOnly(this);
        break;
      /* no default */
    }
  }

  get hasActiveBackdrop() {
    return this.__hasActiveBackdrop;
  }

  /**
   * Sets up backdrop on the given overlay. If there was a backdrop on another element
   * it is removed. Otherwise this is the first time displaying a backdrop, so a animation-in
   * animation is played.
   * @param {{ animation?: boolean, phase: OverlayPhase }} config
   * @protected
   */
  _handleBackdrop({ phase }) {
    // eslint-disable-next-line default-case
    switch (phase) {
      case 'init': {
        if (!this.__backdropInitialized) {
          if (!this.config?.backdropNode) {
            this.__backdropNode = document.createElement('div');
            // If backdropNode existed in config, styles are applied by implementing party
            this.__backdropNode.classList.add(`overlays__backdrop`);
          }
          // @ts-ignore
          this.__wrappingDialogNode.prepend(this.backdropNode);
          this.__backdropInitialized = true;
        }
        break;
      }
      case 'show':
        this.backdropNode.classList.add(`overlays__backdrop--visible`);
        this.__hasActiveBackdrop = true;
        break;
      case 'hide':
        this.__hasActiveBackdrop = false;
        break;
    }
  }

  get hasActiveTrapsKeyboardFocus() {
    return this.__hasActiveTrapsKeyboardFocus;
  }

  /**
   * @param {{ phase: OverlayPhase }} config
   * @protected
   */
  _handleTrapsKeyboardFocus({ phase }) {
    if (phase === 'show') {
      // @ts-ignore
      if ('showModal' in this.__wrappingDialogNode) {
        // @ts-ignore
        this.__wrappingDialogNode.close();
        // @ts-ignore
        this.__wrappingDialogNode.showModal();
      }
      // else {
      this.enableTrapsKeyboardFocus();
      // }
    } else if (phase === 'hide' || phase === 'teardown') {
      this.disableTrapsKeyboardFocus();
    }
  }

  enableTrapsKeyboardFocus() {
    if (this.__hasActiveTrapsKeyboardFocus) {
      return;
    }
    if (this.manager) {
      this.manager.disableTrapsKeyboardFocusForAll();
    }
    this._containFocusHandler = containFocus(this.contentNode);
    this.__hasActiveTrapsKeyboardFocus = true;
    if (this.manager) {
      this.manager.informTrapsKeyboardFocusGotEnabled(this.placementMode);
    }
  }

  disableTrapsKeyboardFocus({ findNewTrap = true } = {}) {
    if (!this.__hasActiveTrapsKeyboardFocus) {
      return;
    }
    if (this._containFocusHandler) {
      this._containFocusHandler.disconnect();
      this._containFocusHandler = undefined;
    }
    this.__hasActiveTrapsKeyboardFocus = false;
    if (this.manager) {
      this.manager.informTrapsKeyboardFocusGotDisabled({ disabledCtrl: this, findNewTrap });
    }
  }

  /** @private */
  __escKeyHandler(/** @type {KeyboardEvent} */ ev) {
    return ev.key === 'Escape' && this.hide();
  }

  /**
   * @param {{ phase: OverlayPhase }} config
   * @protected
   */
  _handleHidesOnEsc({ phase }) {
    if (phase === 'show') {
      this.contentNode.addEventListener('keyup', this.__escKeyHandler);
      if (this.invokerNode) {
        this.invokerNode.addEventListener('keyup', this.__escKeyHandler);
      }
    } else if (phase === 'hide') {
      this.contentNode.removeEventListener('keyup', this.__escKeyHandler);
      if (this.invokerNode) {
        this.invokerNode.removeEventListener('keyup', this.__escKeyHandler);
      }
    }
  }

  /**
   * @param {{ phase: OverlayPhase }} config
   * @protected
   */
  _handleHidesOnOutsideEsc({ phase }) {
    if (phase === 'show') {
      this.__escKeyHandler = (/** @type {KeyboardEvent} */ ev) =>
        ev.key === 'Escape' && this.hide();
      document.addEventListener('keyup', this.__escKeyHandler);
    } else if (phase === 'hide') {
      document.removeEventListener('keyup', this.__escKeyHandler);
    }
  }

  /** @protected */
  _handleInheritsReferenceWidth() {
    if (!this._referenceNode || this.placementMode === 'global') {
      return;
    }
    const referenceWidth = `${this._referenceNode.getBoundingClientRect().width}px`;
    switch (this.inheritsReferenceWidth) {
      case 'max':
        this.contentWrapperNode.style.maxWidth = referenceWidth;
        break;
      case 'full':
        this.contentWrapperNode.style.width = referenceWidth;
        break;
      case 'min':
        this.contentWrapperNode.style.minWidth = referenceWidth;
        this.contentWrapperNode.style.width = 'auto';
        break;
      /* no default */
    }
  }

  /**
   * @param {{ phase: OverlayPhase }} config
   * @protected
   */
  _handleHidesOnOutsideClick({ phase }) {
    const addOrRemoveListener = phase === 'show' ? 'addEventListener' : 'removeEventListener';

    if (phase === 'show') {
      /**
       * We listen to click (more specifically mouseup and mousedown) events
       * in their capture phase (see our tests about 3rd parties stopping event propagation).
       * We define an outside click as follows:
       * - both mousedown and mouseup occur outside of content or invoker
       *
       * This means we have the following flow:
       * [1]. (optional) mousedown is triggered on content/invoker
       * [2]. mouseup is triggered on document (logic will be scheduled to step 4)
       * [3]. (optional) mouseup is triggered on content/invoker
       * [4]. mouseup logic is executed on document (its logic is inside a timeout and is thus
       * executed after 3)
       * [5]. Reset all helper variables that were considered in step [4]
       *
       */

      /** @type {boolean} */
      let wasMouseDownInside = false;
      /** @type {boolean} */
      let wasMouseUpInside = false;

      /** @type {EventListenerOrEventListenerObject} */
      this.__onInsideMouseDown = () => {
        // [1]. was mousedown inside content or invoker
        wasMouseDownInside = true;
      };

      this.__onInsideMouseUp = () => {
        // [3]. was mouseup inside content or invoker
        wasMouseUpInside = true;
      };

      /** @type {EventListenerOrEventListenerObject} */
      this.__onDocumentMouseUp = () => {
        // [2]. The captured mouseup goes from top of the document to bottom. We add a timeout,
        // so that [3] can be executed before [4]
        setTimeout(() => {
          // [4]. Keep open if step 1 (mousedown) or 3 (mouseup) was inside
          if (!wasMouseDownInside && !wasMouseUpInside) {
            this.hide();
          }
          // [5]. Reset...
          wasMouseDownInside = false;
          wasMouseUpInside = false;
        });
      };
    }

    this.contentWrapperNode[addOrRemoveListener](
      'mousedown',
      /** @type {EventListenerOrEventListenerObject} */
      (this.__onInsideMouseDown),
      true,
    );
    this.contentWrapperNode[addOrRemoveListener](
      'mouseup',
      /** @type {EventListenerOrEventListenerObject} */
      (this.__onInsideMouseUp),
      true,
    );
    if (this.invokerNode) {
      // An invoker click (usually resulting in toggle) should be left to a different part of
      // the code
      this.invokerNode[addOrRemoveListener](
        'mousedown',
        /** @type {EventListenerOrEventListenerObject} */
        (this.__onInsideMouseDown),
        true,
      );
      this.invokerNode[addOrRemoveListener](
        'mouseup',
        /** @type {EventListenerOrEventListenerObject} */
        (this.__onInsideMouseUp),
        true,
      );
    }
    document.documentElement[addOrRemoveListener](
      'mouseup',
      /** @type {EventListenerOrEventListenerObject} */
      (this.__onDocumentMouseUp),
      true,
    );
  }

  /**
   * @param {{ phase: OverlayPhase }} config
   * @protected
   */
  _handleAccessibility({ phase }) {
    if (phase === 'init' || phase === 'teardown') {
      this.__setupTeardownAccessibility({ phase });
    }
    if (this.invokerNode && !this.isTooltip) {
      this.invokerNode.setAttribute('aria-expanded', `${phase === 'show'}`);
    }
  }

  teardown() {
    this._handleFeatures({ phase: 'teardown' });
  }

  /** @private */
  async __createPopperInstance() {
    // if (this._popper) {
    //   this._popper.destroy();
    //   this._popper = undefined;
    // }
    // if (OverlayController.floatingUiModule !== undefined) {
    //   const { computePosition } = await OverlayController.floatingUiModule;
    //   // this._popper = createPopper(this._referenceNode, this.contentWrapperNode, {
    //   //   ...this.config?.popperConfig,
    //   // });
    //   computePosition(this._referenceNode, this.contentWrapperNode, {
    //     ...this.config?.popperConfig,
    //   });
    // }
  }

  _hasDisabledInvoker() {
    if (this.invokerNode) {
      return (
        /** @type {HTMLElement & { disabled: boolean }} */ (this.invokerNode).disabled ||
        this.invokerNode.getAttribute('aria-disabled') === 'true'
      );
    }
    return false;
  }
}
/** @type {Promise<FloatingUi> | undefined} */
OverlayController.floatingUiModule = undefined;
