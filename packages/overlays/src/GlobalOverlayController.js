import { BaseOverlayController } from './BaseOverlayController.js';

const isIOS = navigator.userAgent.match(/iPhone|iPad|iPod/i);

export class GlobalOverlayController extends BaseOverlayController {
  constructor(params = {}) {
    super(params);

    const finalParams = {
      elementToFocusAfterHide: document.body,
      hasBackdrop: false,
      isBlocking: false,
      preventsScroll: false,
      trapsKeyboardFocus: false,
      hidesOnEsc: false,
      ...params,
    };

    this.__hasActiveBackdrop = false;
    this.__hasActiveTrapsKeyboardFocus = false;

    this.elementToFocusAfterHide = finalParams.elementToFocusAfterHide;
    this.hasBackdrop = finalParams.hasBackdrop;
    this.isBlocking = finalParams.isBlocking;
    this.preventsScroll = finalParams.preventsScroll;
    this.trapsKeyboardFocus = finalParams.trapsKeyboardFocus;
    this.hidesOnEsc = finalParams.hidesOnEsc;
    this.invokerNode = finalParams.invokerNode;
  }

  /**
   * Syncs shown state and data.
   *
   * @param {object} options optioons to sync
   * @param {boolean} [options.isShown] whether the overlay should be shown
   * @param {object} [options.data] data to pass to the content template function
   * @param {HTMLElement} [options.elementToFocusAfterHide] element to return focus when hiding
   */
  async sync(options) {
    if (options.elementToFocusAfterHide) {
      this.elementToFocusAfterHide = options.elementToFocusAfterHide;
    }

    if (options.data) {
      this.contentData = options.data;
    }

    if (options.isShown === true) {
      await this.show();
    } else if (options.isShown === false) {
      await this.hide();
    }
  }

  /**
   * Shows the overlay.
   * @param {HTMLElement} [elementToFocusAfterHide] element to return focus when hiding
   */
  async show(elementToFocusAfterHide) {
    if (!this.manager) {
      throw new Error(
        'Could not find a manger did you use "overlays.add(new GlobalOverlayController())"?',
      );
    }

    const oldIsShown = this.isShown;
    await super.show();
    if (oldIsShown === true) {
      return;
    }
    if (!this.content.isConnected) {
      this.manager.globalRootNode.appendChild(this.content);
    }

    if (elementToFocusAfterHide) {
      this.elementToFocusAfterHide = elementToFocusAfterHide;
    }
    this.__enableFeatures();
  }

  contentTemplateUpdated() {
    this.contentNode.classList.add('global-overlays__overlay');
  }

  /**
   * Hides the overlay.
   */
  async hide() {
    const oldIsShown = this.isShown;
    await super.hide();
    if (oldIsShown === false) {
      return;
    }

    if (this.elementToFocusAfterHide) {
      this.elementToFocusAfterHide.focus();
    }
    this.__disableFeatures();

    this.hideDone();
    if (this.contentTemplate) {
      this.manager.globalRootNode.removeChild(this.content);
    }
  }

  hideDone() {
    this.defaultHideDone();
  }

  /**
   * Sets up flags.
   */
  __enableFeatures() {
    super.__enableFeatures();

    if (this.preventsScroll) {
      document.body.classList.add('global-overlays-scroll-lock');

      if (isIOS) {
        // iOS has issues with overlays with input fields. This is fixed by applying
        // position: fixed to the body. As a side effect, this will scroll the body to the top.
        document.body.classList.add('global-overlays-scroll-lock-ios-fix');
      }
    }

    if (this.hasBackdrop) {
      this.enableBackdrop();
    }

    if (this.isBlocking) {
      this.enableBlocking();
    }
  }

  /**
   * Cleans up flags.
   */
  __disableFeatures() {
    super.__disableFeatures();

    if (this.preventsScroll) {
      document.body.classList.remove('global-overlays-scroll-lock');
      if (isIOS) {
        document.body.classList.remove('global-overlays-scroll-lock-ios-fix');
      }
    }

    if (this.hasBackdrop) {
      this.disableBackdrop();
    }

    if (this.isBlocking) {
      this.disableBlocking();
    }
  }

  // **********************************************************************************************
  // FEATURE - isBlocking
  // **********************************************************************************************
  get hasActiveBlocking() {
    return this.__hasActiveBlocking;
  }

  enableBlocking() {
    if (this.__hasActiveBlocking === true) {
      return;
    }

    this.contentNode.classList.remove('global-overlays__overlay');
    this.contentNode.classList.add('global-overlays__overlay--blocking');
    if (this.backdropNode) {
      this.backdropNode.classList.remove('global-overlays__backdrop');
      this.backdropNode.classList.add('global-overlays__backdrop--blocking');
    }

    this.manager.globalRootNode.classList.add('global-overlays--blocking-opened');

    this.__hasActiveBlocking = true;
  }

  disableBlocking() {
    if (this.__hasActiveBlocking === false) {
      return;
    }

    const blockingContoller = this.manager.shownList.find(
      ctrl => ctrl !== this && ctrl.isBlocking === true,
    );
    // if there are no other blocking overlays remaning, stop hiding regular overlays
    if (!blockingContoller) {
      this.manager.globalRootNode.classList.remove('global-overlays--blocking-opened');
    }

    this.__hasActiveBlocking = false;
  }

  // **********************************************************************************************
  // FEATURE - hasBackdrop
  // **********************************************************************************************
  get hasActiveBackdrop() {
    return this.__hasActiveBackdrop;
  }

  /**
   * Sets up backdrop on the given overlay. If there was a backdrop on another element
   * it is removed. Otherwise this is the first time displaying a backdrop, so a fade-in
   * animation is played.
   * @param {OverlayController} overlay the overlay
   * @param {boolean} noAnimation prevent an animatin from being displayed
   */
  enableBackdrop({ animation = true } = {}) {
    if (this.__hasActiveBackdrop === true) {
      return;
    }

    this.backdropNode = document.createElement('div');
    this.backdropNode.classList.add('global-overlays__backdrop');
    this.content.parentNode.insertBefore(this.backdropNode, this.content);

    if (animation === true) {
      this.backdropNode.classList.add('global-overlays__backdrop--fade-in');
    }
    this.__hasActiveBackdrop = true;
  }

  disableBackdrop({ animation = true } = {}) {
    if (this.__hasActiveBackdrop === false) {
      return;
    }

    if (animation) {
      const { backdropNode } = this;
      this.__removeFadeOut = () => {
        backdropNode.classList.remove('global-overlays__backdrop--fade-out');
        backdropNode.removeEventListener('animationend', this.__removeFadeOut);
        backdropNode.parentNode.removeChild(backdropNode);
      };
      backdropNode.addEventListener('animationend', this.__removeFadeOut);

      backdropNode.classList.remove('global-overlays__backdrop--fade-in');
      backdropNode.classList.add('global-overlays__backdrop--fade-out');
    }

    this.__hasActiveBackdrop = false;
  }
}
