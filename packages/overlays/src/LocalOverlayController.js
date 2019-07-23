import { render, html } from '@lion/core';
import { containFocus } from './utils/contain-focus.js';
import { keyCodes } from './utils/key-codes.js';

async function __preloadPopper() {
  return import('popper.js/dist/esm/popper.min.js');
}
export class LocalOverlayController {
  constructor(params = {}) {
    this.__fakeExtendsEventTarget();

    // TODO: Instead of in constructor, prefetch it or use a preloader-manager to load it during idle time
    this.constructor.popperModule = __preloadPopper();
    this.__mergePopperConfigs(params.popperConfig || {});

    this.inheritsReferenceObjectWidth = params.inheritsReferenceObjectWidth;
    this.hidesOnEsc = params.hidesOnEsc;
    this.hidesOnOutsideClick = params.hidesOnOutsideClick;
    this.trapsKeyboardFocus = params.trapsKeyboardFocus;

    /**
     * A wrapper to render into the invokerTemplate
     *
     * @property {HTMLElement}
     */
    this.invoker = document.createElement('div');
    this.invoker.style.display = 'inline-block';
    this.invokerTemplate = params.invokerTemplate;

    /**
     * The actual invoker element we work with - it get's all the events and a11y
     *
     * @property {HTMLElement}
     */
    this.invokerNode = this.invoker;
    if (params.invokerNode) {
      this.invokerNode = params.invokerNode;
      this.invoker = this.invokerNode;
    }

    /**
     * A wrapper the contentTemplate renders into
     *
     * @property {HTMLElement}
     */
    this.content = document.createElement('div');
    this.content.style.display = 'inline-block';
    this.contentTemplate = params.contentTemplate;
    this.contentNode = this.content;
    if (params.contentNode) {
      this.contentNode = params.contentNode;
      this.content = this.contentNode;
    }

    this.contentId = `overlay-content-${Math.random()
      .toString(36)
      .substr(2, 10)}`;
    this._contentData = {};
    this.syncInvoker();
    this._updateContent();
    this._prevShown = false;
    this._prevData = {};
    this.__boundEscKeyHandler = this.__escKeyHandler.bind(this);
  }

  get isShown() {
    return this.contentTemplate
      ? Boolean(this.content.children.length)
      : Boolean(this.contentNode.style.display === 'inline-block');
  }

  /**
   * Syncs shown state and data for content.
   * @param {object} options
   * @param {boolean} [options.isShown] whether the overlay should be shown
   * @param {object} [options.data] overlay data to pass to the content template function
   */
  sync({ isShown, data } = {}) {
    this._createOrUpdateOverlay(isShown, data);
  }

  /**
   * Syncs data for invoker.
   * @param {object} options
   * @param {object} [options.data] overlay data to pass to the invoker template function
   */
  syncInvoker({ data } = {}) {
    if (this.invokerTemplate) {
      render(this.invokerTemplate(data), this.invoker);
      this.invokerNode = this.invoker.firstElementChild;
    }

    this.invokerNode.setAttribute('aria-expanded', this.isShown);
    this.invokerNode.setAttribute('aria-controls', this.contentId);
    this.invokerNode.setAttribute('aria-describedby', this.contentId);
  }

  /**
   * Shows the overlay.
   */
  async show() {
    this._createOrUpdateOverlay(true, this._prevData);
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

  /**
   * Hides the overlay.
   */
  hide() {
    this._createOrUpdateOverlay(false, this._prevData);
  }

  /**
   * Toggles the overlay.
   */
  toggle() {
    // eslint-disable-next-line no-unused-expressions
    this.isShown ? this.hide() : this.show();
  }

  // Popper does not export a nice method to update an existing instance with a new config. Therefore we recreate the instance.
  // TODO: Send a merge request to Popper to abstract their logic in the constructor to an exposed method which takes in the user config.
  async updatePopperConfig(config = {}) {
    this.__mergePopperConfigs(config);
    await this.__createPopperInstance();
    if (this.isShown) {
      this._popper.update();
    }
  }

  _createOrUpdateOverlay(shown = this._prevShown, data = this._prevData) {
    if (shown) {
      this._contentData = { ...this._contentData, ...data };

      // let lit-html manage the template and update the properties
      if (this.contentTemplate) {
        render(this.contentTemplate(this._contentData), this.content);
        this.contentNode = this.content.firstElementChild;
      }
      this.contentNode.id = this.contentId;
      this.contentNode.style.display = 'inline-block';
      /* To display on top of elements with no z-index that are appear later in the DOM */
      this.contentNode.style.zIndex = 1;
      this.invokerNode.setAttribute('aria-expanded', true);

      if (this.inheritsReferenceObjectWidth) {
        const referenceObjectWidth = `${this.invokerNode.clientWidth}px`;
        switch (this.inheritsReferenceObjectWidth) {
          case 'max':
            this.contentNode.style.maxWidth = referenceObjectWidth;
            break;
          case 'full':
            this.contentNode.style.width = referenceObjectWidth;
            break;
          default:
            this.contentNode.style.minWidth = referenceObjectWidth;
        }
      }
      if (this.trapsKeyboardFocus) this._setupTrapsKeyboardFocus();
      if (this.hidesOnOutsideClick) this._setupHidesOnOutsideClick();
      if (this.hidesOnEsc) this._setupHidesOnEsc();

      if (this._prevShown === false) {
        this.dispatchEvent(new Event('show'));
      }
    } else {
      this._updateContent();
      this.invokerNode.setAttribute('aria-expanded', false);
      if (this.hidesOnOutsideClick) this._teardownHidesOnOutsideClick();
      if (this.hidesOnEsc) this._teardownHidesOnEsc();

      if (this._prevShown === true) {
        this.dispatchEvent(new Event('hide'));
      }
    }
    this._prevShown = shown;
    this._prevData = data;
  }

  /**
   * Sets up focus containment on the given overlay. If there was focus containment set up
   * previously, it is disconnected.
   */
  _setupTrapsKeyboardFocus() {
    if (this._containFocusHandler) {
      this._containFocusHandler.disconnect();
      this._containFocusHandler = undefined; // eslint-disable-line no-param-reassign
    }
    this._containFocusHandler = containFocus(this.contentNode);
  }

  _setupHidesOnEsc() {
    this.contentNode.addEventListener('keyup', this.__boundEscKeyHandler);
  }

  _teardownHidesOnEsc() {
    this.contentNode.removeEventListener('keyup', this.__boundEscKeyHandler);
  }

  _setupHidesOnOutsideClick() {
    if (this.__preventCloseOutsideClick) {
      return;
    }

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
        if (!wasClickInside) {
          this.hide();
        }
      });
    };

    this.contentNode.addEventListener('click', this.__preventCloseOutsideClick, true);
    this.invokerNode.addEventListener('click', this.__preventCloseOutsideClick, true);
    document.documentElement.addEventListener('click', this.__onCaptureHtmlClick, true);
  }

  _teardownHidesOnOutsideClick() {
    this.contentNode.removeEventListener('click', this.__preventCloseOutsideClick, true);
    this.invokerNode.removeEventListener('click', this.__preventCloseOutsideClick, true);
    document.documentElement.removeEventListener('click', this.__onCaptureHtmlClick, true);
    this.__preventCloseOutsideClick = null;
    this.__onCaptureHtmlClick = null;
  }

  _updateContent() {
    if (this.contentTemplate) {
      render(html``, this.content);
    } else {
      this.contentNode.style.display = 'none';
    }
  }

  __escKeyHandler(e) {
    if (e.keyCode === keyCodes.escape) {
      this.hide();
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
    const mod = await this.constructor.popperModule;
    const Popper = mod.default;
    this._popper = new Popper(this.invokerNode, this.contentNode, {
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
