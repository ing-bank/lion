import { render } from '@lion/core';
import { containFocus } from './utils/contain-focus';
import { globalOverlaysStyle } from './globalOverlaysStyle.js';
import { setSiblingsInert, unsetSiblingsInert } from './utils/inert-siblings';

const isIOS = navigator.userAgent.match(/iPhone|iPad|iPod/i);

const styleTag = document.createElement('style');
styleTag.textContent = globalOverlaysStyle.cssText;

export class GlobalOverlayController {
  static _createRoot() {
    if (!this._rootNode) {
      this._rootNode = document.createElement('div');
      this._rootNode.classList.add('global-overlays');
      document.body.appendChild(this._rootNode);
      document.head.appendChild(styleTag);
    }
  }

  constructor(params) {
    const finalParams = {
      elementToFocusAfterHide: document.body,
      hasBackdrop: false,
      isBlocking: false,
      preventsScroll: false,
      trapsKeyboardFocus: false,
      hidesOnEsc: false,
      ...params,
    };

    this.elementToFocusAfterHide = finalParams.elementToFocusAfterHide;
    this.contentTemplate = finalParams.contentTemplate;
    this.hasBackdrop = finalParams.hasBackdrop;
    this.isBlocking = finalParams.isBlocking;
    this.preventsScroll = finalParams.preventsScroll;
    this.trapsKeyboardFocus = finalParams.trapsKeyboardFocus;
    this.hidesOnEsc = finalParams.hidesOnEsc;

    this._isShown = false;
    this._data = {};
    this._container = null;

    if (finalParams.invokerNodes) {
      this.addInvokerNodes(finalParams.invokerNodes);
    }
  }

  get isShown() {
    return this._isShown;
  }

  /**
   * Syncs shown state and data.
   * @param {object} options options to sync
   * @param {boolean} [options.isShown] whether the overlay should be shown
   * @param {object} [options.data] data to pass to the content template function
   * @param {HTMLElement} [options.elementToFocusAfterHide] element to return focus when hiding
   */
  sync(options) {
    if (options.elementToFocusAfterHide) {
      this.elementToFocusAfterHide = options.elementToFocusAfterHide;
    }
    this._createOrUpdateOverlay(
      typeof options.isShown !== 'undefined' ? options.isShown : this._isShown,
      typeof options.data !== 'undefined' ? options.data : this._data,
    );
  }

  /**
   * Shows the overlay.
   * @param {HTMLElement} [elementToFocusAfterHide] element to return focus when hiding
   */
  show(elementToFocusAfterHide) {
    if (elementToFocusAfterHide) {
      this.elementToFocusAfterHide = elementToFocusAfterHide;
    }
    this._createOrUpdateOverlay(true, this._data);
  }

  /**
   * Hides the overlay.
   */
  hide() {
    if (this._expandedInvokerNode) {
      this._expandedInvokerNode.setAttribute('aria-expanded', 'false');
    }
    this._createOrUpdateOverlay(false, this._data);
  }

  addInvokerNodes(nodes) {
    nodes.forEach(node => {
      node.addEventListener('click', () => {
        node.setAttribute('aria-expanded', 'true');
        this._expandedInvokerNode = node;
        this.show(node);
      });
      node.setAttribute('aria-haspopup', 'dialog');
      node.setAttribute('aria-expanded', 'false');
    });
  }

  /**
   * Updates an overlay's template. Creates a render container and appends it to the
   * overlay manager if it wasn't rendered before. Otherwise updates the data.
   *
   * Removes the overlay from the DOM if it should be hidden.
   *
   * @param {boolean} isShown whether the overlay should be shown
   * @param {object} data data to render
   */
  _createOrUpdateOverlay(isShown, data) {
    if (isShown) {
      let firstShow = false;

      if (!this.trapsKeyboardFocus && GlobalOverlayController._rootNode) {
        const siblings = Array.from(GlobalOverlayController._rootNode.children).reverse();
        const last = this._findWithFlag(siblings, 'trapsKeyboardFocus');
        if (last && last.length > 0) {
          last[0]._containFocusHandler.disconnect();
        }
      }

      if (!this._container) {
        firstShow = true;
        GlobalOverlayController._createRoot();
        this._initializeContainer();
      }

      // let lit-html manage the template and update the properties
      render(this.contentTemplate(data), this._container);

      if (firstShow) {
        this._setupFlags();
      }
    } else if (this._container) {
      GlobalOverlayController._rootNode.removeChild(this._container);
      this._cleanupFlags();
      this._container = null;

      if (this.elementToFocusAfterHide) {
        this.elementToFocusAfterHide.focus();
      }
    }
    this._isShown = isShown;
    this._data = data;
  }

  _initializeContainer() {
    const container = document.createElement('div');
    container.classList.add(`global-overlays__overlay${this.isBlocking ? '--blocking' : ''}`);
    this._container = container;
    container._overlayController = this;
    GlobalOverlayController._rootNode.appendChild(container);
  }

  /**
   * Sets up flags.
   */
  _setupFlags() {
    if (this.preventsScroll) {
      document.body.classList.add('global-overlays-scroll-lock');

      if (isIOS) {
        // iOS has issues with overlays with input fields. This is fixed by applying
        // position: fixed to the body. As a side effect, this will scroll the body to the top.
        document.body.classList.add('global-overlays-scroll-lock-ios-fix');
      }
    }

    if (this.hasBackdrop) {
      this._setupHasBackdrop();
    }
    const siblings = Array.from(GlobalOverlayController._rootNode.children).reverse();
    if (this.trapsKeyboardFocus) {
      const last = this._findWithFlag(siblings, 'trapsKeyboardFocus');
      if (last.length > 1) {
        last[1]._containFocusHandler.disconnect();
      }
      this._setupTrapsKeyboardFocus();
    }

    if (this.isBlocking) {
      GlobalOverlayController._rootNode.classList.add('global-overlays--blocking-opened');
    }

    if (this.hidesOnEsc) {
      this._setupHidesOnEsc();
    }

    this._container.firstElementChild.addEventListener('dialog-close', () => this.hide());
  }

  /**
   * Sets up backdrop on the given overlay. If there was a backdrop on another element
   * it is removed. Otherwise this is the first time displaying a backdrop, so a fade-in
   * animation is played.
   * @param {OverlayController} overlay the overlay
   * @param {boolean} noAnimation prevent an animatin from being displayed
   */
  _setupHasBackdrop(overlay = this, noAnimation) {
    const prevWithBackdrop = GlobalOverlayController._rootNode.querySelector(
      '.global-overlays__backdrop',
    );
    if (prevWithBackdrop) {
      prevWithBackdrop.classList.remove('global-overlays__backdrop');
      prevWithBackdrop.classList.remove('global-overlays__backdrop--fade-in');
    } else if (!noAnimation) {
      overlay._container.classList.add('global-overlays__backdrop--fade-in');
    }
    overlay._container.classList.add('global-overlays__backdrop');
  }

  /**
   * Sets up focus containment on the given overlay. If there was focus containment set up
   * previously, it is disconnected. Otherwise this is the first time containing focus, so
   * the overlay manager's siblings are set inert for accessibility.
   * @param {OverlayController} overlay the overlay
   */
  _setupTrapsKeyboardFocus(overlay = this) {
    if (overlay._containFocusHandler) {
      overlay._containFocusHandler.disconnect();
      overlay._containFocusHandler = undefined; // eslint-disable-line no-param-reassign
    } else {
      // TODO: this shouldmonly be done when modal option is true?
      setSiblingsInert(GlobalOverlayController._rootNode);
    }
    // eslint-disable-next-line no-param-reassign
    overlay._containFocusHandler = containFocus(overlay._container.firstElementChild);
  }

  _setupHidesOnEsc(overlay = this) {
    // TODO: add check if we have focus first? Since, theoratically we can have many overlays
    // opened and we probably don't want to close them all
    overlay._container.addEventListener('keyup', event => {
      if (event.keyCode === 27) {
        // Escape
        overlay.hide();
      }
    });
  }

  /**
   * Cleans up flags.
   */
  _cleanupFlags() {
    if (this.preventsScroll) {
      document.body.classList.remove('global-overlays-scroll-lock');
      if (isIOS) {
        document.body.classList.remove('global-overlays-scroll-lock-ios-fix');
      }
    }

    // iterate siblings in reverse order, as that is the order of importance
    const siblings = Array.from(GlobalOverlayController._rootNode.children).reverse();
    const overlays = this._findOverlays(siblings);
    const nextTrapsKeyboardFocus = this._findNextWithFlag(siblings, 'trapsKeyboardFocus');
    const nextHasTrapsKeyboardFocus = nextTrapsKeyboardFocus === overlays[0];

    if (this.hasBackdrop) {
      const next = this._findNextWithFlag(siblings, 'hasBackdrop');

      // if there is another overlay which requires a backdrop, move it there
      // otherwise, play a fade-out animation
      if (next) {
        this._setupHasBackdrop(next, true);
      } else {
        this._fadeOutBackdrop();
      }
    }

    if (this.trapsKeyboardFocus || nextHasTrapsKeyboardFocus) {
      // if there is another overlay which requires contain focus, set it up
      // otherwise disconnect and removed inert from siblings
      if (nextTrapsKeyboardFocus && nextHasTrapsKeyboardFocus) {
        if (this._containFocusHandler) {
          this._containFocusHandler.disconnect();
        }
        this._setupTrapsKeyboardFocus(nextTrapsKeyboardFocus);
      } else {
        if (this._containFocusHandler) {
          this._containFocusHandler.disconnect();
          this._containFocusHandler = undefined;
        }
        unsetSiblingsInert(GlobalOverlayController._rootNode);
      }
    }

    if (this.isBlocking) {
      const next = this._findNextWithFlag(siblings, 'isBlocking');

      // if there are no other blocking overlays remaning, stop hiding regular overlays
      if (!next) {
        GlobalOverlayController._rootNode.classList.remove('global-overlays--blocking-opened');
      }
    }
  }

  /**
   * Finds all overlays.
   * @param {HTMLElement[]} containers
   * @returns {[OverlayController] | []}
   */
  // eslint-disable-next-line class-methods-use-this
  _findOverlays(containers) {
    return containers.map(container => container._overlayController);
  }

  /**
   * Finds the overlay which has the given option enabled.
   * @param {HTMLElement[]} containers
   * @param {string} option
   * @returns {[OverlayController] | []}
   */
  _findWithFlag(containers, option) {
    return this._findOverlays(containers).filter(container => container[option]);
  }

  /**
   * Finds the next overlay which has the given option enabled.
   * @param {HTMLElement[]} containers
   * @param {string} option
   * @returns {OverlayController | null}
   */
  _findNextWithFlag(containers, option) {
    return this._findOverlays(containers).find(controller => controller[option]);
  }

  /**
   * Plays a backdrop fade out animation. This is applied to the overlay container as the
   * overlay which had a backdrop is already removed at this point.
   */
  // eslint-disable-next-line class-methods-use-this
  _fadeOutBackdrop() {
    GlobalOverlayController._rootNode.classList.add('global-overlays--backdrop-fade-out');
    // a new overlay could be opened within 600ms, but it is only an animation
    setTimeout(() => {
      GlobalOverlayController._rootNode.classList.remove('global-overlays--backdrop-fade-out');
    }, 600);
  }
}
