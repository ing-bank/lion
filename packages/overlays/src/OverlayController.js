import '@lion/core/src/differentKeyEventNamesShimIE.js';
import './utils/typedef.js';
import { overlays } from './overlays.js';
import { containFocus } from './utils/contain-focus.js';

async function preloadPopper() {
  return import('popper.js/dist/esm/popper.min.js');
}

const GLOBAL_OVERLAYS_CONTAINER_CLASS = 'global-overlays__overlay-container';
const GLOBAL_OVERLAYS_CLASS = 'global-overlays__overlay';
const isIOS = navigator.userAgent.match(/iPhone|iPad|iPod/i);

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
    this._defaultConfig = {
      placementMode: null,
      contentNode: config.contentNode,
      invokerNode: config.invokerNode,
      referenceNode: null,
      elementToFocusAfterHide: document.body,
      inheritsReferenceWidth: 'min',
      hasBackdrop: false,
      isBlocking: false,
      preventsScroll: false,
      trapsKeyboardFocus: false,
      hidesOnEsc: false,
      hidesOnOutsideClick: false,
      isTooltip: false,
      handlesUserInteraction: false,
      handlesAccessibility: false,
      popperConfig: null,
      viewportConfig: {
        placement: 'center',
      },
    };

    this.manager.add(this);

    this._contentNodeWrapper = document.createElement('div');
    this._contentId = `overlay-content--${Math.random()
      .toString(36)
      .substr(2, 10)}`;

    this.updateConfig(config);

    this.__hasActiveTrapsKeyboardFocus = false;
    this.__hasActiveBackdrop = true;
  }

  get content() {
    return this._contentNodeWrapper;
  }

  /**
   * @desc The element ._contentNodeWrapper will be appended to.
   * If viewportConfig is configured, this will be OverlayManager.globalRootNode
   * If popperConfig is configured, this will be a sibling node of invokerNode
   */
  get _renderTarget() {
    if (this.placementMode === 'global') {
      return this.manager.globalRootNode;
    }
    return this.__originalContentParent;
  }

  /**
   * @desc The element our local overlay will be positioned relative to.
   */
  get _referenceNode() {
    return this.referenceNode || this.invokerNode;
  }

  /**
   * @desc Allows to dynamically change the overlay configuration. Needed in case the
   * presentation of the overlay changes depending on screen size.
   * Note that this method is the only allowed way to update a configuration of an
   * OverlayController instance.
   * @param {OverlayConfig} cfgToAdd
   */
  updateConfig(cfgToAdd) {
    // Teardown all previous configs
    this._handleFeatures({ phase: 'teardown' });

    if (cfgToAdd.contentNode && cfgToAdd.contentNode.isConnected) {
      // We need to keep track of the original local context.
      this.__originalContentParent = cfgToAdd.contentNode.parentElement;
    }
    this.__prevConfig = this.config || {};

    this.config = {
      ...this._defaultConfig, // our basic ingredients
      ...this.__sharedConfig, // the initial configured overlayController
      ...cfgToAdd, // the added config
    };

    this.__validateConfiguration(this.config);
    Object.assign(this, this.config);
    this._init({ cfgToAdd });
  }

  // eslint-disable-next-line class-methods-use-this
  __validateConfiguration(newConfig) {
    if (!newConfig.placementMode) {
      throw new Error('You need to provide a .placementMode ("global"|"local")');
    }
    if (!['global', 'local'].includes(newConfig.placementMode)) {
      throw new Error(
        `"${newConfig.placementMode}" is not a valid .placementMode, use ("global"|"local")`,
      );
    }
    if (!newConfig.contentNode) {
      throw new Error('You need to provide a .contentNode');
    }
  }

  async _init({ cfgToAdd }) {
    this.__initContentNodeWrapper();
    this.__initConnectionTarget();
    if (this.handlesAccessibility) {
      this.__initAccessibility({ cfgToAdd });
    }

    if (this.placementMode === 'local') {
      // Now, it's time to lazily load Popper if not done yet
      // Do we really want to add display: inline or is this up to user?
      if (!this.constructor.popperModule) {
        // TODO: Instead, prefetch it or use a preloader-manager to load it during idle time
        this.constructor.popperModule = preloadPopper();
      }
      this.__mergePopperConfigs(this.popperConfig || {});
    }
  }

  __initConnectionTarget() {
    // Now, add our node to the right place in dom (rendeTarget)
    if (this.contentNode !== this.__prevConfig.contentNode) {
      this._contentNodeWrapper.appendChild(this.contentNode);
    }
    if (this._renderTarget && this._renderTarget !== this._contentNodeWrapper.parentNode) {
      this._renderTarget.appendChild(this._contentNodeWrapper);
    }
  }

  /**
   * @desc Cleanup ._contentNodeWrapper. We do this, because creating a fresh wrapper
   * can lead to problems with event listeners...
   */
  __initContentNodeWrapper() {
    Array.from(this._contentNodeWrapper.attributes).forEach(attrObj => {
      this._contentNodeWrapper.removeAttribute(attrObj.name);
    });
    this._contentNodeWrapper.style.cssText = null;
    this._contentNodeWrapper.style.display = 'none';

    // Make sure that your shadow dom contains this outlet, when we are adding to light dom
    this._contentNodeWrapper.slot = '_overlay-shadow-outlet';

    if (getComputedStyle(this.contentNode).position === 'absolute') {
      // Having a _contWrapperNode and a contentNode with 'position:absolute' results in
      // computed height of 0...
      this.contentNode.style.position = 'static';
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
        this._contentNodeWrapper.style.zIndex = 1;
      }
    }
  }

  __initAccessibility() {
    // TODO: add setup props in object and restore on teardown
    if (!this.contentNode.id) {
      this.contentNode.setAttribute('id', this._contentId);
    }
    if (this.isTooltip) {
      // TODO: this could also be labelledby
      if (this.invokerNode) {
        this.invokerNode.setAttribute('aria-describedby', this._contentId);
      }
      this.contentNode.setAttribute('role', 'tooltip');
    } else {
      if (this.invokerNode) {
        this.invokerNode.setAttribute('aria-expanded', this.isShown);
      }
      if (!this.contentNode.hasAttribute('role')) {
        this.contentNode.setAttribute('role', 'dialog');
      }
    }
  }

  get isShown() {
    return Boolean(this._contentNodeWrapper.style.display !== 'none');
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
    this.dispatchEvent(new Event('before-show'));
    this._contentNodeWrapper.style.display = this.placementMode === 'local' ? 'inline-block' : '';
    await this._handleFeatures({ phase: 'setup' });
    await this._handlePosition({ phase: 'setup' });
    this.elementToFocusAfterHide = elementToFocusAfterHide;
    this.dispatchEvent(new Event('show'));
  }

  async _handlePosition({ phase }) {
    if (this.placementMode === 'global') {
      const addOrRemove = phase === 'setup' ? 'add' : 'remove';
      const placementClass = `${GLOBAL_OVERLAYS_CONTAINER_CLASS}--${this.viewportConfig.placement}`;
      this._contentNodeWrapper.classList[addOrRemove](GLOBAL_OVERLAYS_CONTAINER_CLASS);
      this._contentNodeWrapper.classList[addOrRemove](placementClass);
      this.contentNode.classList[addOrRemove](GLOBAL_OVERLAYS_CLASS);
    } else if (this.placementMode === 'local' && phase === 'setup') {
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

    this.dispatchEvent(new Event('before-hide'));
    // await this.transitionHide({ backdropNode: this.backdropNode, conentNode: this.contentNode });
    this._contentNodeWrapper.style.display = 'none';
    this._handleFeatures({ phase: 'teardown' });
    this.dispatchEvent(new Event('hide'));
    this._restoreFocus();
  }

  // eslint-disable-next-line class-methods-use-this, no-empty-function, no-unused-vars
  async transitionHide({ backdropNode, contentNode }) {}

  _restoreFocus() {
    // We only are allowed to move focus if we (still) 'own' it.
    // Otherwise we assume the 'outside world' has, purposefully, taken over
    // if (this._contentNodeWrapper.activeElement) {
    this.elementToFocusAfterHide.focus();
    // }
  }

  async toggle() {
    return this.isShown ? this.hide() : this.show();
  }

  /**
   * @desc All features are handled here. Every feature is set up on show
   * and torn
   * @param {object} config
   * @param {'setup'|'teardown'} config.phase
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

  // eslint-disable-next-line class-methods-use-this
  _handlePreventsScroll({ phase }) {
    const addOrRemove = phase === 'setup' ? 'add' : 'remove';
    document.body.classList[addOrRemove]('global-overlays-scroll-lock');
    if (isIOS) {
      // iOS has issues with overlays with input fields. This is fixed by applying
      // position: fixed to the body. As a side effect, this will scroll the body to the top.
      document.body.classList[addOrRemove]('global-overlays-scroll-lock-ios-fix');
    }
  }

  _handleBlocking({ phase }) {
    const addOrRemove = phase === 'setup' ? 'add' : 'remove';
    this._contentNodeWrapper.classList[addOrRemove]('global-overlays__overlay--blocking');
    if (this.backdropNode) {
      this.backdropNode.classList[addOrRemove]('global-overlays__backdrop--blocking');
    }

    if (phase === 'setup') {
      this.manager.globalRootNode.classList.add('global-overlays--blocking-opened');
    } else if (phase === 'teardown') {
      const blockingController = this.manager.shownList.find(
        ctrl => ctrl !== this && ctrl.isBlocking === true,
      );
      // If there are no other blocking overlays remaining, stop hiding regular overlays
      if (!blockingController) {
        this.manager.globalRootNode.classList.remove('global-overlays--blocking-opened');
      }
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
      return; // coming soon...
    }

    if (phase === 'setup') {
      this.backdropNode = document.createElement('div');
      this.backdropNode.classList.add('global-overlays__backdrop');
      this.backdropNode.slot = '_overlay-shadow-outlet';
      this._contentNodeWrapper.parentElement.insertBefore(
        this.backdropNode,
        this._contentNodeWrapper,
      );

      if (animation === true) {
        this.backdropNode.classList.add('global-overlays__backdrop--fade-in');
      }
      this.__hasActiveBackdrop = true;
    } else if (phase === 'teardown') {
      const { backdropNode } = this;
      if (!backdropNode) {
        return;
      }

      if (animation) {
        this.__removeFadeOut = () => {
          backdropNode.classList.remove('global-overlays__backdrop--fade-out');
          backdropNode.removeEventListener('animationend', this.__removeFadeOut);
          backdropNode.parentNode.removeChild(backdropNode);
        };
        backdropNode.addEventListener('animationend', this.__removeFadeOut);
      }
      backdropNode.classList.remove('global-overlays__backdrop--fade-in');
      backdropNode.classList.add('global-overlays__backdrop--fade-out');
      this.__hasActiveBackdrop = false;
    }
  }

  get hasActiveTrapsKeyboardFocus() {
    return this.__hasActiveTrapsKeyboardFocus;
  }

  _handleTrapsKeyboardFocus({ phase }) {
    if (phase === 'setup') {
      this.enableTrapsKeyboardFocus();
    } else if (phase === 'teardown') {
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
    if (phase === 'setup') {
      this.__escKeyHandler = ev => ev.key === 'Escape' && this.hide();
      this.contentNode.addEventListener('keyup', this.__escKeyHandler);
    } else if (phase === 'teardown') {
      this.contentNode.removeEventListener('keyup', this.__escKeyHandler);
    }
  }

  _handleInheritsReferenceWidth() {
    if (!this._referenceNode) {
      return;
    }

    const referenceWidth = `${this._referenceNode.clientWidth}px`;
    switch (this.inheritsReferenceWidth) {
      case 'max':
        this._contentNodeWrapper.style.maxWidth = referenceWidth;
        break;
      case 'full':
        this._contentNodeWrapper.style.width = referenceWidth;
        break;
      default:
        this._contentNodeWrapper.style.minWidth = referenceWidth;
    }
  }

  _handleHidesOnOutsideClick({ phase }) {
    const addOrRemoveListener = phase === 'setup' ? 'addEventListener' : 'removeEventListener';

    if (phase === 'setup') {
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

    this._contentNodeWrapper[addOrRemoveListener]('click', this.__preventCloseOutsideClick, true);
    if (this.invokerNode) {
      this.invokerNode[addOrRemoveListener]('click', this.__preventCloseOutsideClick, true);
    }
    document.documentElement[addOrRemoveListener]('click', this.__onCaptureHtmlClick, true);
  }

  _handleAccessibility({ phase }) {
    if (this.invokerNode && !this.isTooltip) {
      this.invokerNode.setAttribute('aria-expanded', phase === 'setup');
    }
  }

  // Popper does not export a nice method to update an existing instance with a new config. Therefore we recreate the instance.
  // TODO: Send a merge request to Popper to abstract their logic in the constructor to an exposed method which takes in the user config.
  async updatePopperConfig(config = {}) {
    this.__mergePopperConfigs(config);
    if (this.isShown) {
      await this.__createPopperInstance();
      this._popper.update();
    }
  }

  /**
   * Merges the default config with the current config, and finally with the user supplied config
   * @param {Object} config user supplied configuration
   */
  __mergePopperConfigs(config = {}) {
    const defaultConfig = {
      placement: 'top',
      positionFixed: false,
      modifiers: {
        keepTogether: {
          enabled: false,
        },
        preventOverflow: {
          enabled: true,
          boundariesElement: 'viewport',
          padding: 16, // viewport-margin for shifting/sliding
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
    };

    // Deep merging default config, previously configured user config, new user config
    this.popperConfig = {
      ...defaultConfig,
      ...(this.popperConfig || {}),
      ...(config || {}),
      modifiers: {
        ...defaultConfig.modifiers,
        ...((this.popperConfig && this.popperConfig.modifiers) || {}),
        ...((config && config.modifiers) || {}),
      },
    };
  }

  async __createPopperInstance() {
    if (this._popper) {
      this._popper.destroy();
      this._popper = null;
    }
    const { default: Popper } = await this.constructor.popperModule;
    this._popper = new Popper(this._referenceNode, this._contentNodeWrapper, {
      ...this.popperConfig,
    });
  }

  // TODO: this method has to be removed when EventTarget polyfill is available on IE11
  __fakeExtendsEventTarget() {
    const delegate = document.createDocumentFragment();
    ['addEventListener', 'dispatchEvent', 'removeEventListener'].forEach(funcName => {
      this[funcName] = (...args) => delegate[funcName](...args);
    });
  }
}
