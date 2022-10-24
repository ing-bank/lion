import { EventTargetShim } from '@lion/ui/core.js';
import { overlays } from './singleton.js';
import { containFocus } from './utils/contain-focus.js';

/**
 * @typedef {import('../types/OverlayConfig').OverlayConfig} OverlayConfig
 * @typedef {import('../types/OverlayConfig').ViewportConfig} ViewportConfig
 * @typedef {import('@popperjs/core/lib/popper').createPopper} Popper
 * @typedef {import('@popperjs/core/lib/popper').Options} PopperOptions
 * @typedef {import('@popperjs/core/lib/enums').Placement} Placement
 * @typedef {{ createPopper: Popper }} PopperModule
 * @typedef {'setup'|'init'|'teardown'|'before-show'|'show'|'hide'|'add'|'remove'} OverlayPhase
 */

/**
 * @returns {Promise<PopperModule>}
 */
async function preloadPopper() {
  // eslint-disable-next-line import/no-extraneous-dependencies -- [external]: import complains about untyped module, but we typecast it ourselves
  return /** @type {* & Promise<PopperModule>} */ (import('@popperjs/core/dist/esm/popper.js'));
}

const GLOBAL_OVERLAYS_CONTAINER_CLASS = 'global-overlays__overlay-container';
const GLOBAL_OVERLAYS_CLASS = 'global-overlays__overlay';
// @ts-expect-error [external]: CSS not yet typed
const supportsCSSTypedObject = window.CSS?.number && document.body.attributeStyleMap?.set;

/**
 * @desc OverlayController is the fundament for every single type of overlay. With the right
 * configuration, it can be used to build (modal) dialogs, tooltips, dropdowns, popovers,
 * bottom/top/left/right sheets etc.
 *
 * ### About contentNode, contentWrapperNode and renderTarget.
 *
 * #### contentNode
 * Node containing actual overlay contents.
 * It will not be touched by the OverlayController, it will only set attributes needed
 * for accessibility.
 *
 * #### contentWrapperNode
 * The 'positioning' element.
 * For local overlays, this node will be provided to Popper and all
 * inline positioning styles will be added here. It will also act as the container of an arrow
 * element (the arrow needs to be a sibling of contentNode for Popper to work correctly).
 * When projecting a contentNode from a shadowRoot, it is essential to have the wrapper in
 * shadow dom, so that contentNode can be styled via `::slotted` from the shadow root.
 * The Popper arrow can then be styled from that same shadow root as well.
 * For global overlays, the contentWrapperNode will be appended to the globalRootNode structure.
 *
 * #### renderTarget
 * Usually the parent node of contentWrapperNode that either exists locally or globally.
 * When a responsive scenario is created (in which we switch from global to local or vice versa)
 * we need to know where we should reappend contentWrapperNode (or contentNode in case it's projected)
 *
 * So a regular flow can be summarized as follows:
 * 1. Application Developer spawns an OverlayController with a contentNode reference
 * 2. OverlayController will create a contentWrapperNode around contentNode (or consumes when provided)
 * 3. contentWrapperNode will be appended to the right renderTarget
 *
 * There are subtle differences depending on the following factors:
 * - whether in global/local placement mode
 * - whether contentNode projected
 * - whether an arrow is provided
 *
 * This leads to the following possible combinations:
 * - [l1]. local + no content projection + no arrow
 * - [l2]. local +    content projection + no arrow
 * - [l3]. local + no content projection +    arrow
 * - [l4]. local +    content projection +    arrow
 * - [g1]. global
 *
 * #### html structure for a content projected node
 * <div id="contentWrapperNode">
 *  <slot name="contentNode"></slot>
 *  <div x-arrow></div>
 * </div>
 *
 * Structure above depicts [l4]
 * So in case of [l1] and [l3], the <slot> element would be a regular element
 * In case of [l1] and [l2], there would be no arrow.
 * Note that a contentWrapperNode should be provided for [l2], [l3] and [l4]
 * In case of a global overlay ([g1]), it's enough to provide just the contentNode.
 * In case of a local overlay or a responsive overlay switching from placementMode, one should
 * always configure as if it were a local overlay.
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
      // handlesUserInteraction: false,
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
    };

    this.manager.add(this);
    /** @protected */
    this._contentId = `overlay-content--${Math.random().toString(36).substr(2, 10)}`;
    /** @private */
    this.__originalAttrs = new Map();
    if (this._defaultConfig.contentNode) {
      if (!this._defaultConfig.contentNode.isConnected) {
        throw new Error(
          '[OverlayController] Could not find a render target, since the provided contentNode is not connected to the DOM. Make sure that it is connected, e.g. by doing "document.body.appendChild(contentNode)", before passing it on.',
        );
      }
      this.__isContentNodeProjected = Boolean(this._defaultConfig.contentNode.assignedSlot);
    }
    this.updateConfig(config);
    /** @private */
    this.__hasActiveTrapsKeyboardFocus = false;
    /** @private */
    this.__hasActiveBackdrop = true;
    /**
     * @type {HTMLElement | undefined}
     * @private
     */
    this.__backdropNodeToBeTornDown = undefined;

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
   * @type {HTMLElement}
   */
  get content() {
    return /** @type {HTMLElement} */ (this.contentWrapperNode);
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

  /**
   * Usually the parent node of contentWrapperNode that either exists locally or globally.
   * When a responsive scenario is created (in which we switch from global to local or vice versa)
   * we need to know where we should reappend contentWrapperNode (or contentNode in case it's
   * projected).
   * @type {HTMLElement}
   * @protected
   */
  get _renderTarget() {
    /** config [g1] */
    if (this.placementMode === 'global') {
      return this.manager.globalRootNode;
    }
    /** config [l2] or [l4] */
    if (this.__isContentNodeProjected) {
      // @ts-expect-error [external]: fix Node types
      return this.__originalContentParent?.getRootNode().host;
    }
    /** config [l1] or [l3] */
    return /** @type {HTMLElement} */ (this.__originalContentParent);
  }

  /**
   * @desc The element our local overlay will be positioned relative to.
   * @type {HTMLElement | undefined}
   * @protected
   */
  get _referenceNode() {
    return this.referenceNode || this.invokerNode;
  }

  /**
   * @param {number} value
   */
  set elevation(value) {
    if (this.contentWrapperNode) {
      this.contentWrapperNode.style.zIndex = `${value}`;
    }
    if (this.backdropNode) {
      this.backdropNode.style.zIndex = `${value}`;
    }
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
    this.__prevConfig = this.config || {};

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
          ...((this._defaultConfig.popperConfig && this._defaultConfig.popperConfig.modifiers) ||
            []),
          ...((this.__sharedConfig.popperConfig && this.__sharedConfig.popperConfig.modifiers) ||
            []),
          ...((cfgToAdd.popperConfig && cfgToAdd.popperConfig.modifiers) || []),
        ],
      },
    };

    /** @private */
    this.__validateConfiguration(/** @type {OverlayConfig} */ (this.config));
    /** @protected */
    this._init({ cfgToAdd });
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
    if (this.__isContentNodeProjected && !newConfig.contentWrapperNode) {
      throw new Error(
        '[OverlayController] You need to provide a .contentWrapperNode when .contentNode is projected',
      );
    }
    if (newConfig.isTooltip && newConfig.placementMode !== 'local') {
      throw new Error(
        '[OverlayController] .isTooltip should be configured with .placementMode "local"',
      );
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
   * @param {{ cfgToAdd: OverlayConfig }} options
   * @protected
   */
  _init({ cfgToAdd }) {
    this.__initContentWrapperNode({ cfgToAdd });
    this.__initConnectionTarget();

    if (this.placementMode === 'local') {
      // Lazily load Popper if not done yet
      if (!OverlayController.popperModule) {
        // a@ts-expect-error FIXME: for some reason createPopper is missing here
        OverlayController.popperModule = preloadPopper();
      }
    }
    this._handleFeatures({ phase: 'init' });
  }

  /** @private */
  __initConnectionTarget() {
    // Now, add our node to the right place in dom (renderTarget)
    if (this.contentWrapperNode !== this.__prevConfig?.contentWrapperNode) {
      if (this.config?.placementMode === 'global' || !this.__isContentNodeProjected) {
        /** @type {HTMLElement} */
        (this.contentWrapperNode).appendChild(this.contentNode);
      }
    }

    if (!this._renderTarget) {
      return;
    }

    if (this.__isContentNodeProjected && this.placementMode === 'local') {
      // We add the contentNode in its slot, so that it will be projected by contentWrapperNode
      this._renderTarget.appendChild(this.contentNode);
    } else {
      const isInsideRenderTarget = this._renderTarget === this.contentWrapperNode.parentNode;
      const nodeContainsTarget = this.contentWrapperNode.contains(this._renderTarget);
      if (!isInsideRenderTarget && !nodeContainsTarget) {
        // contentWrapperNode becomes the direct (non projected) parent of contentNode
        this._renderTarget.appendChild(this.contentWrapperNode);
      }
    }
  }

  /**
   * Cleanup ._contentWrapperNode. We do this, because creating a fresh wrapper
   * can lead to problems with event listeners...
   * @param {{ cfgToAdd: OverlayConfig }} options
   * @private
   */
  __initContentWrapperNode({ cfgToAdd }) {
    if (this.config?.contentWrapperNode && this.placementMode === 'local') {
      /** config [l2],[l3],[l4] */
      this.__contentWrapperNode = this.config.contentWrapperNode;
    } else {
      /** config [l1],[g1] */
      this.__contentWrapperNode = document.createElement('div');
    }

    this.contentWrapperNode.style.cssText = '';
    this.contentWrapperNode.style.display = 'none';

    if (getComputedStyle(this.contentNode).position === 'absolute') {
      // Having a _contWrapperNode and a contentNode with 'position:absolute' results in
      // computed height of 0...
      this.contentNode.style.position = 'static';
    }

    if (this.__isContentNodeProjected && this.contentWrapperNode.isConnected) {
      // We need to keep track of the original local context.
      /** config [l2], [l4] */
      this.__originalContentParent = /** @type {HTMLElement} */ (
        this.contentWrapperNode.parentNode
      );
    } else if (cfgToAdd.contentNode && cfgToAdd.contentNode.isConnected) {
      // We need to keep track of the original local context.
      /** config [l1], [l3], [g1] */
      this.__originalContentParent = /** @type {HTMLElement} */ (this.contentNode?.parentNode);
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
        this.contentWrapperNode.style.zIndex = '1';
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
    return Boolean(this.contentWrapperNode.style.display !== 'none');
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
      this.contentWrapperNode.style.display = '';
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
    if (this.placementMode === 'global') {
      const addOrRemove = phase === 'show' ? 'add' : 'remove';
      const placementClass = `${GLOBAL_OVERLAYS_CONTAINER_CLASS}--${this.viewportConfig.placement}`;
      this.contentWrapperNode.classList[addOrRemove](GLOBAL_OVERLAYS_CONTAINER_CLASS);
      this.contentWrapperNode.classList[addOrRemove](placementClass);
      this.contentNode.classList[addOrRemove](GLOBAL_OVERLAYS_CLASS);
    } else if (this.placementMode === 'local' && phase === 'show') {
      /**
       * Popper is weird about properly positioning the popper element when it is recreated so
       * we just recreate the popper instance to make it behave like it should.
       * Probably related to this issue: https://github.com/FezVrasta/popper.js/issues/796
       * calling just the .update() function on the popper instance sadly does not resolve this.
       * This is however necessary for initial placement.
       */
      await this.__createPopperInstance();
      /** @type {Popper} */ (this._popper).forceUpdate();
    }
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

      this.contentWrapperNode.style.display = 'none';
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
  // eslint-disable-next-line class-methods-use-this, no-empty-function, no-unused-vars
  async transitionHide(hideConfig) {}

  /**
   * @param {{backdropNode:HTMLElement, contentNode:HTMLElement}} hideConfig
   * @protected
   */
  // eslint-disable-next-line class-methods-use-this, no-empty-function, no-unused-vars
  async _transitionHide(hideConfig) {
    // `this.transitionHide` is a hook for our users
    await this.transitionHide({ backdropNode: this.backdropNode, contentNode: this.contentNode });

    if (hideConfig.backdropNode) {
      hideConfig.backdropNode.classList.remove(
        `${this.placementMode}-overlays__backdrop--animation-in`,
      );
      /** @type {() => void} */
      let afterFadeOut = () => {};
      hideConfig.backdropNode.classList.add(
        `${this.placementMode}-overlays__backdrop--animation-out`,
      );
      this.__backdropAnimation = new Promise(resolve => {
        afterFadeOut = () => {
          if (hideConfig.backdropNode) {
            hideConfig.backdropNode.classList.remove(
              `${this.placementMode}-overlays__backdrop--animation-out`,
            );
            hideConfig.backdropNode.classList.remove(
              `${this.placementMode}-overlays__backdrop--visible`,
            );
            hideConfig.backdropNode.removeEventListener('animationend', afterFadeOut);
          }
          resolve(undefined);
        };
      });

      hideConfig.backdropNode.addEventListener('animationend', afterFadeOut);
    }
  }

  /**
   * To be overridden by subclassers
   *
   * @param {{backdropNode:HTMLElement, contentNode:HTMLElement}} showConfig
   */
  // eslint-disable-next-line class-methods-use-this, no-empty-function, no-unused-vars
  async transitionShow(showConfig) {}

  /**
   * @param {{backdropNode:HTMLElement, contentNode:HTMLElement}} showConfig
   */
  // eslint-disable-next-line class-methods-use-this, no-empty-function, no-unused-vars
  async _transitionShow(showConfig) {
    // `this.transitionShow` is a hook for our users
    await this.transitionShow({ backdropNode: this.backdropNode, contentNode: this.contentNode });

    if (showConfig.backdropNode) {
      showConfig.backdropNode.classList.add(
        `${this.placementMode}-overlays__backdrop--animation-in`,
      );
    }
  }

  /** @protected */
  _restoreFocus() {
    const { activeElement } = /** @type {* & ShadowRoot} */ (
      this.__contentWrapperNode
    ).getRootNode();
    // We only are allowed to move focus if we (still) 'own' it.
    // Otherwise we assume the 'outside world' has, purposefully, taken over
    if (
      activeElement &&
      /** @type {HTMLElement} */ (this.__contentWrapperNode).contains(activeElement)
    ) {
      if (this.elementToFocusAfterHide) {
        this.elementToFocusAfterHide.focus();
      } else {
        activeElement.blur();
      }
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
    switch (phase) {
      case 'init': {
        if (!this.backdropNode) {
          this.__backdropNode = document.createElement('div');
          /** @type {HTMLElement} */
          (this.backdropNode).slot = 'backdrop';
          /** @type {HTMLElement} */
          (this.backdropNode).classList.add(`${this.placementMode}-overlays__backdrop`);
        }

        let insertionAnchor = /** @type {HTMLElement} */ (this.contentNode.parentNode);
        let insertionBefore = this.contentNode;
        if (this.placementMode === 'global') {
          insertionAnchor = /** @type {HTMLElement} */ (this.contentWrapperNode.parentElement);
          insertionBefore = this.contentWrapperNode;
        }
        insertionAnchor.insertBefore(this.backdropNode, insertionBefore);
        break;
      }
      case 'show':
        this.backdropNode.classList.add(`${this.placementMode}-overlays__backdrop--visible`);
        this.__hasActiveBackdrop = true;
        break;
      case 'hide':
        if (!this.backdropNode) {
          return;
        }
        this.__hasActiveBackdrop = false;
        break;
      case 'teardown':
        if (!this.backdropNode || !this.backdropNode.parentNode) {
          return;
        }
        if (this.__backdropAnimation) {
          this.__backdropNodeToBeTornDown = this.backdropNode;

          this.__backdropAnimation.then(() => {
            if (this.__backdropNodeToBeTornDown && this.__backdropNodeToBeTornDown.parentNode) {
              this.__backdropNodeToBeTornDown.parentNode.removeChild(
                this.__backdropNodeToBeTornDown,
              );
            }
          });
        } else {
          this.backdropNode.parentNode.removeChild(this.backdropNode);
        }
        this.__backdropNode = undefined;
        break;
      /* no default */
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
      this.enableTrapsKeyboardFocus();
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

    if (this.placementMode === 'global' && this.__isContentNodeProjected) {
      /** @type {HTMLElement} */ (this.__originalContentParent).appendChild(this.contentNode);
    }

    // Remove the content node wrapper from the global rootnode
    this._teardownContentWrapperNode();
  }

  /** @protected */
  _teardownContentWrapperNode() {
    if (
      this.placementMode === 'global' &&
      this.contentWrapperNode &&
      this.contentWrapperNode.parentNode
    ) {
      this.contentWrapperNode.parentNode.removeChild(this.contentWrapperNode);
    }
  }

  /** @private */
  async __createPopperInstance() {
    if (this._popper) {
      this._popper.destroy();
      this._popper = undefined;
    }

    if (OverlayController.popperModule !== undefined) {
      const { createPopper } = await OverlayController.popperModule;
      this._popper = createPopper(this._referenceNode, this.contentWrapperNode, {
        ...this.config?.popperConfig,
      });
    }
  }
}
/** @type {Promise<PopperModule> | undefined} */
OverlayController.popperModule = undefined;
