import '@lion/core/src/differentKeyEventNamesShimIE.js';
import { overlays } from './overlays.js';
import { containFocus } from './utils/contain-focus.js';
import './utils/typedef.js';

async function preloadPopper() {
  return import('popper.js/dist/esm/popper.min.js');
}

const GLOBAL_OVERLAYS_CONTAINER_CLASS = 'global-overlays__overlay-container';
const GLOBAL_OVERLAYS_CLASS = 'global-overlays__overlay';
const supportsCSSTypedObject = window.CSS && CSS.number;

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
 * always configure as if it was a local overlay.
 *
 */

export class OverlayController {
  /**
   * @constructor
   * @param {OverlayConfig} config initial config. Will be remembered as shared config
   * when `.updateConfig()` is called.
   */
  constructor(config = {}, manager = overlays) {
    this.__fakeExtendsEventTarget();
    this.manager = manager;
    this.__sharedConfig = config;

    /** @type {OverlayConfig} */
    this._defaultConfig = {
      placementMode: null,
      contentNode: config.contentNode,
      contentWrapperNode: config.contentWrapperNode,
      invokerNode: config.invokerNode,
      backdropNode: config.backdropNode,
      referenceNode: null,
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
      handlesUserInteraction: false,
      handlesAccessibility: false,
      popperConfig: {
        placement: 'top',
        positionFixed: false,
        modifiers: {
          keepTogether: {
            enabled: false,
          },
          preventOverflow: {
            enabled: true,
            boundariesElement: 'viewport',
            padding: 8, // viewport-margin for shifting/sliding
          },
          flip: {
            boundariesElement: 'viewport',
            padding: 16, // viewport-margin for flipping
          },
          offset: {
            enabled: true,
            offset: `0, 8px`, // horizontal and vertical margin (distance between popper and referenceElement)
          },
          arrow: {
            enabled: false,
          },
        },
      },
      viewportConfig: {
        placement: 'center',
      },
    };

    this.manager.add(this);
    this._contentId = `overlay-content--${Math.random().toString(36).substr(2, 10)}`;
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
    this.__hasActiveTrapsKeyboardFocus = false;
    this.__hasActiveBackdrop = true;
  }

  get invoker() {
    return this.invokerNode;
  }

  get content() {
    return this._contentWrapperNode;
  }

  /**
   * @desc Usually the parent node of contentWrapperNode that either exists locally or globally.
   * When a responsive scenario is created (in which we switch from global to local or vice versa)
   * we need to know where we should reappend contentWrapperNode (or contentNode in case it's
   * projected).
   * @type {HTMLElement}
   */
  get _renderTarget() {
    /** config [g1] */
    if (this.placementMode === 'global') {
      return this.manager.globalRootNode;
    }
    /** config [l2] or [l4] */
    if (this.__isContentNodeProjected) {
      return this.__originalContentParent.getRootNode().host;
    }
    /** config [l1] or [l3] */
    return this.__originalContentParent;
  }

  /**
   * @desc The element our local overlay will be positioned relative to.
   * @type {HTMLElement}
   */
  get _referenceNode() {
    return this.referenceNode || this.invokerNode;
  }

  set elevation(value) {
    if (this._contentWrapperNode) {
      this._contentWrapperNode.style.zIndex = value;
    }
    if (this.backdropNode) {
      this.backdropNode.style.zIndex = value;
    }
  }

  get elevation() {
    return this._contentWrapperNode.zIndex;
  }

  /**
   * @desc Allows to dynamically change the overlay configuration. Needed in case the
   * presentation of the overlay changes depending on screen size.
   * Note that this method is the only allowed way to update a configuration of an
   * OverlayController instance.
   * @param { OverlayConfig } cfgToAdd
   */
  updateConfig(cfgToAdd) {
    // Teardown all previous configs
    this._handleFeatures({ phase: 'teardown' });

    this.__prevConfig = this.config || {};

    this.config = {
      ...this._defaultConfig, // our basic ingredients
      ...this.__sharedConfig, // the initial configured overlayController
      ...cfgToAdd, // the added config
      popperConfig: {
        ...(this._defaultConfig.popperConfig || {}),
        ...(this.__sharedConfig.popperConfig || {}),
        ...(cfgToAdd.popperConfig || {}),
        modifiers: {
          ...((this._defaultConfig.popperConfig && this._defaultConfig.popperConfig.modifiers) ||
            {}),
          ...((this.__sharedConfig.popperConfig && this.__sharedConfig.popperConfig.modifiers) ||
            {}),
          ...((cfgToAdd.popperConfig && cfgToAdd.popperConfig.modifiers) || {}),
        },
      },
    };

    this.__validateConfiguration(this.config);
    Object.assign(this, this.config);
    this._init({ cfgToAdd });
  }

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

  async _init({ cfgToAdd }) {
    this.__initcontentWrapperNode({ cfgToAdd });
    this.__initConnectionTarget();

    if (this.placementMode === 'local') {
      // Lazily load Popper if not done yet
      if (!this.constructor.popperModule) {
        this.constructor.popperModule = preloadPopper();
      }
    }
    this._handleFeatures({ phase: 'init' });
  }

  __initConnectionTarget() {
    // Now, add our node to the right place in dom (renderTarget)
    if (this._contentWrapperNode !== this.__prevConfig._contentWrapperNode) {
      if (this.config.placementMode === 'global' || !this.__isContentNodeProjected) {
        this._contentWrapperNode.appendChild(this.contentNode);
      }
    }

    if (!this._renderTarget) {
      return;
    }

    if (this.__isContentNodeProjected && this.placementMode === 'local') {
      // We add the contentNode in its slot, so that it will be projected by contentWrapperNode
      this._renderTarget.appendChild(this.contentNode);
    } else {
      const isInsideRenderTarget = this._renderTarget === this._contentWrapperNode.parentNode;
      if (!isInsideRenderTarget) {
        // contentWrapperNode becomes the direct (non projected) parent of contentNode
        this._renderTarget.appendChild(this._contentWrapperNode);
      }
    }
  }

  /**
   * @desc Cleanup ._contentWrapperNode. We do this, because creating a fresh wrapper
   * can lead to problems with event listeners...
   */
  __initcontentWrapperNode({ cfgToAdd }) {
    if (this.config.contentWrapperNode && this.placementMode === 'local') {
      /** config [l2],[l3],[l4] */
      this._contentWrapperNode = this.config.contentWrapperNode;
    } else {
      /** config [l1],[g1] */
      this._contentWrapperNode = document.createElement('div');
    }

    this._contentWrapperNode.style.cssText = null;
    this._contentWrapperNode.style.display = 'none';

    if (getComputedStyle(this.contentNode).position === 'absolute') {
      // Having a _contWrapperNode and a contentNode with 'position:absolute' results in
      // computed height of 0...
      this.contentNode.style.position = 'static';
    }

    if (this.__isContentNodeProjected && this._contentWrapperNode.isConnected) {
      // We need to keep track of the original local context.
      /** config [l2], [l4] */
      this.__originalContentParent = this._contentWrapperNode.parentNode;
    } else if (cfgToAdd.contentNode && cfgToAdd.contentNode.isConnected) {
      // We need to keep track of the original local context.
      /** config [l1], [l3], [g1] */
      this.__originalContentParent = this.contentNode.parentNode;
    }
  }

  /**
   * @desc Display local overlays on top of elements with no z-index that appear later in the DOM
   */
  _handleZIndex({ phase }) {
    if (this.placementMode !== 'local') {
      return;
    }

    if (phase === 'setup') {
      const zIndexNumber = Number(getComputedStyle(this.contentNode).zIndex);
      if (zIndexNumber < 1 || Number.isNaN(zIndexNumber)) {
        this._contentWrapperNode.style.zIndex = 1;
      }
    }
  }

  __setupTeardownAccessibility({ phase }) {
    if (phase === 'init') {
      this.__storeOriginalAttrs(this.contentNode, ['role', 'id']);
      this.__storeOriginalAttrs(this.invokerNode, [
        'aria-expanded',
        'aria-labelledby',
        'aria-describedby',
      ]);

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
          this.invokerNode.setAttribute('aria-expanded', this.isShown);
        }
        if (!this.contentNode.role) {
          this.contentNode.setAttribute('role', 'dialog');
        }
      }
    } else if (phase === 'teardown') {
      this.__restorOriginalAttrs();
    }
  }

  __storeOriginalAttrs(node, attrs) {
    const attrMap = {};
    attrs.forEach(attrName => {
      attrMap[attrName] = node.getAttribute(attrName);
    });
    this.__originalAttrs.set(node, attrMap);
  }

  __restorOriginalAttrs() {
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
    return Boolean(this._contentWrapperNode.style.display !== 'none');
  }

  /**
   * @event before-show right before the overlay shows. Used for animations and switching overlays
   * @event show right after the overlay is shown
   * @param {HTMLElement} elementToFocusAfterHide
   */
  async show(elementToFocusAfterHide = this.elementToFocusAfterHide) {
    if (this.manager) {
      this.manager.show(this);
    }

    if (this.isShown) {
      return;
    }

    const event = new CustomEvent('before-show', { cancelable: true });
    this.dispatchEvent(event);
    if (!event.defaultPrevented) {
      this._contentWrapperNode.style.display = '';
      this._keepBodySize({ phase: 'before-show' });
      await this._handleFeatures({ phase: 'show' });
      this._keepBodySize({ phase: 'show' });
      await this._handlePosition({ phase: 'show' });
      this.elementToFocusAfterHide = elementToFocusAfterHide;
      this.dispatchEvent(new Event('show'));
    }
  }

  async _handlePosition({ phase }) {
    if (this.placementMode === 'global') {
      const addOrRemove = phase === 'show' ? 'add' : 'remove';
      const placementClass = `${GLOBAL_OVERLAYS_CONTAINER_CLASS}--${this.viewportConfig.placement}`;
      this._contentWrapperNode.classList[addOrRemove](GLOBAL_OVERLAYS_CONTAINER_CLASS);
      this._contentWrapperNode.classList[addOrRemove](placementClass);
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
      this._popper.update();
    }
  }

  _keepBodySize({ phase }) {
    switch (phase) {
      case 'before-show':
        this.__bodyClientWidth = document.body.clientWidth;
        this.__bodyClientHeight = document.body.clientHeight;
        this.__bodyMarginRight = 0;
        this.__bodyMarginBottom = 0;
        break;
      case 'show': {
        if (supportsCSSTypedObject) {
          this.__bodyMarginRight = document.body.computedStyleMap().get('margin-right').value;
          this.__bodyMarginBottom = document.body.computedStyleMap().get('margin-bottom').value;
        } else if (window.getComputedStyle) {
          const bodyStyle = window.getComputedStyle(document.body);
          if (bodyStyle) {
            this.__bodyMarginRight = parseInt(bodyStyle.getPropertyValue('margin-right'), 10);
            this.__bodyMarginBottom = parseInt(bodyStyle.getPropertyValue('margin-bottom'), 10);
          }
        }
        const scrollbarWidth = document.body.clientWidth - this.__bodyClientWidth;
        const scrollbarHeight = document.body.clientHeight - this.__bodyClientHeight;
        const newMarginRight = this.__bodyMarginRight + scrollbarWidth;
        const newMarginBottom = this.__bodyMarginBottom + scrollbarHeight;
        if (supportsCSSTypedObject) {
          document.body.attributeStyleMap.set('margin-right', CSS.px(newMarginRight));
          document.body.attributeStyleMap.set('margin-bottom', CSS.px(newMarginBottom));
        } else {
          document.body.style.marginRight = `${newMarginRight}px`;
          document.body.style.marginBottom = `${newMarginBottom}px`;
        }
        break;
      }
      case 'hide':
        if (supportsCSSTypedObject) {
          document.body.attributeStyleMap.set('margin-right', CSS.px(this.__bodyMarginRight));
          document.body.attributeStyleMap.set('margin-bottom', CSS.px(this.__bodyMarginBottom));
        } else {
          document.body.style.marginRight = `${this.__bodyMarginRight}px`;
          document.body.style.marginBottom = `${this.__bodyMarginBottom}px`;
        }
        break;
      /* no default */
    }
  }

  /**
   * @event before-hide right before the overlay hides. Used for animations and switching overlays
   * @event hide right after the overlay is hidden
   */
  async hide() {
    if (this.manager) {
      this.manager.hide(this);
    }

    if (!this.isShown) {
      return;
    }

    const event = new CustomEvent('before-hide', { cancelable: true });
    this.dispatchEvent(event);
    if (!event.defaultPrevented) {
      // await this.transitionHide({ backdropNode: this.backdropNode, contentNode: this.contentNode });
      this._contentWrapperNode.style.display = 'none';
      this._handleFeatures({ phase: 'hide' });
      this._keepBodySize({ phase: 'hide' });
      this.dispatchEvent(new Event('hide'));
      this._restoreFocus();
    }
  }

  // eslint-disable-next-line class-methods-use-this, no-empty-function, no-unused-vars
  async transitionHide({ backdropNode, contentNode }) {}

  _restoreFocus() {
    // We only are allowed to move focus if we (still) 'own' it.
    // Otherwise we assume the 'outside world' has, purposefully, taken over
    // if (this._contentWrapperNode.activeElement) {
    if (this.elementToFocusAfterHide) {
      this.elementToFocusAfterHide.focus();
    }
    // }
  }

  async toggle() {
    return this.isShown ? this.hide() : this.show();
  }

  /**
   * @desc All features are handled here. Every feature is set up on show
   * and torn
   * @param {object} config
   * @param {'init'|'show'|'hide'|'teardown'} config.phase
   */
  async _handleFeatures({ phase }) {
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
   * @desc Sets up backdrop on the given overlay. If there was a backdrop on another element
   * it is removed. Otherwise this is the first time displaying a backdrop, so a fade-in
   * animation is played.
   */
  _handleBackdrop({ animation = true, phase }) {
    if (this.placementMode === 'local') {
      switch (phase) {
        case 'init':
          if (!this.backdropNode) {
            this.backdropNode = document.createElement('div');
            this.backdropNode.classList.add('local-overlays__backdrop');
          }
          this.backdropNode.slot = '_overlay-shadow-outlet';
          this.contentNode.parentNode.insertBefore(this.backdropNode, this.contentNode);
          break;
        case 'show':
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
          this.backdropNode.parentNode.removeChild(this.backdropNode);
          break;
        /* no default */
      }
      return;
    }
    const { backdropNode } = this;
    switch (phase) {
      case 'init':
        this.backdropNode = document.createElement('div');
        this.backdropNode.classList.add('global-overlays__backdrop');
        this._contentWrapperNode.parentElement.insertBefore(
          this.backdropNode,
          this._contentWrapperNode,
        );
        break;
      case 'show':
        backdropNode.classList.add('global-overlays__backdrop--visible');
        if (animation === true) {
          backdropNode.classList.add('global-overlays__backdrop--fade-in');
        }
        this.__hasActiveBackdrop = true;
        break;
      case 'hide':
        if (!backdropNode) {
          return;
        }
        backdropNode.classList.remove('global-overlays__backdrop--fade-in');

        if (animation) {
          let afterFadeOut;
          backdropNode.classList.add('global-overlays__backdrop--fade-out');
          this.__backDropAnimation = new Promise(resolve => {
            afterFadeOut = () => {
              backdropNode.classList.remove('global-overlays__backdrop--fade-out');
              backdropNode.classList.remove('global-overlays__backdrop--visible');
              backdropNode.removeEventListener('animationend', afterFadeOut);
              resolve();
            };
          });
          backdropNode.addEventListener('animationend', afterFadeOut);
        } else {
          backdropNode.classList.remove('global-overlays__backdrop--visible');
        }
        this.__hasActiveBackdrop = false;
        break;
      case 'teardown':
        if (!backdropNode || !backdropNode.parentNode) {
          return;
        }
        if (animation && this.__backDropAnimation) {
          this.__backDropAnimation.then(() => {
            backdropNode.parentNode.removeChild(backdropNode);
          });
        } else {
          backdropNode.parentNode.removeChild(backdropNode);
        }
        break;
      /* no default */
    }
  }

  get hasActiveTrapsKeyboardFocus() {
    return this.__hasActiveTrapsKeyboardFocus;
  }

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
      this.manager.informTrapsKeyboardFocusGotEnabled();
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

  _handleHidesOnEsc({ phase }) {
    if (phase === 'show') {
      this.__escKeyHandler = ev => ev.key === 'Escape' && this.hide();
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

  _handleHidesOnOutsideEsc({ phase }) {
    if (phase === 'show') {
      this.__escKeyHandler = ev => ev.key === 'Escape' && this.hide();
      document.addEventListener('keyup', this.__escKeyHandler);
    } else if (phase === 'hide') {
      document.removeEventListener('keyup', this.__escKeyHandler);
    }
  }

  _handleInheritsReferenceWidth() {
    if (!this._referenceNode || this.placementMode === 'global') {
      return;
    }

    const referenceWidth = `${this._referenceNode.clientWidth}px`;
    switch (this.inheritsReferenceWidth) {
      case 'max':
        this._contentWrapperNode.style.maxWidth = referenceWidth;
        break;
      case 'full':
        this._contentWrapperNode.style.width = referenceWidth;
        break;
      case 'min':
        this._contentWrapperNode.style.minWidth = referenceWidth;
        this._contentWrapperNode.style.width = 'auto';
        break;
      /* no default */
    }
  }

  _handleHidesOnOutsideClick({ phase }) {
    const addOrRemoveListener = phase === 'show' ? 'addEventListener' : 'removeEventListener';

    if (phase === 'show') {
      let wasClickInside = false;
      // handle on capture phase and remember till the next task that there was an inside click
      this.__preventCloseOutsideClick = () => {
        wasClickInside = true;
        setTimeout(() => {
          wasClickInside = false;
        });
      };
      // handle on capture phase and schedule the hide if needed
      this.__onCaptureHtmlClick = () => {
        setTimeout(() => {
          if (wasClickInside === false) {
            this.hide();
          }
        });
      };
    }

    this._contentWrapperNode[addOrRemoveListener]('click', this.__preventCloseOutsideClick, true);
    if (this.invokerNode) {
      this.invokerNode[addOrRemoveListener]('click', this.__preventCloseOutsideClick, true);
    }
    document.documentElement[addOrRemoveListener]('click', this.__onCaptureHtmlClick, true);
  }

  _handleAccessibility({ phase }) {
    if (phase === 'init' || phase === 'teardown') {
      this.__setupTeardownAccessibility({ phase });
    }
    if (this.invokerNode && !this.isTooltip) {
      this.invokerNode.setAttribute('aria-expanded', phase === 'show');
    }
  }

  teardown() {
    this._handleFeatures({ phase: 'teardown' });

    // Remove the content node wrapper from the global rootnode
    this._teardowncontentWrapperNode();
  }

  _teardowncontentWrapperNode() {
    if (
      this.placementMode === 'global' &&
      this._contentWrapperNode &&
      this._contentWrapperNode.parentNode
    ) {
      this._contentWrapperNode.parentNode.removeChild(this._contentWrapperNode);
    }
  }

  async __createPopperInstance() {
    if (this._popper) {
      this._popper.destroy();
      this._popper = null;
    }
    const { default: Popper } = await this.constructor.popperModule;
    this._popper = new Popper(this._referenceNode, this._contentWrapperNode, {
      ...this.config.popperConfig,
    });
  }

  __fakeExtendsEventTarget() {
    const delegate = document.createDocumentFragment();
    ['addEventListener', 'dispatchEvent', 'removeEventListener'].forEach(funcName => {
      this[funcName] = (...args) => delegate[funcName](...args);
    });
  }
}
