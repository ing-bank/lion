import { render } from '@lion/core';
import { BaseOverlayController } from './BaseOverlayController.js';

async function __preloadPopper() {
  return import('popper.js/dist/esm/popper.min.js');
}
export class LocalOverlayController extends BaseOverlayController {
  constructor(params = {}) {
    super(params);

    this.__hasActiveHidesOnOutsideClick = false;

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
     * @deprecated - please use .invokerNode instead
     *
     * @property {HTMLElement}
     */
    this.invoker = document.createElement('div');
    this.invoker.style.display = 'inline-block';

    /**
     * @deprecated - please use .invokerNode instead
     */
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

    this.contentId = `overlay-content-${Math.random()
      .toString(36)
      .substr(2, 10)}`;
    this.syncInvoker();
  }

  /**
   * Syncs shown state and data for content.
   * @param {object} options
   * @param {boolean} [options.isShown] whether the overlay should be shown
   * @param {object} [options.data] overlay data to pass to the content template function
   */
  async sync({ isShown, data } = {}) {
    if (data) {
      this.contentData = data;
    }

    if (isShown === true) {
      await this.show();
    } else if (isShown === false) {
      await this.hide();
    }
  }

  /**
   * Syncs data for invoker.
   *
   * @deprecated please use .invokerNode instead
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
    const oldIsShown = this.isShown;
    await super.show();
    if (oldIsShown === true) {
      return;
    }
    /* To display on top of elements with no z-index that are appear later in the DOM */
    this.contentNode.style.zIndex = 1;
    /**
     * Popper is weird about properly positioning the popper element when it is recreated so
     * we just recreate the popper instance to make it behave like it should.
     * Probably related to this issue: https://github.com/FezVrasta/popper.js/issues/796
     * calling just the .update() function on the popper instance sadly does not resolve this.
     * This is however necessary for initial placement.
     */
    if (this.invokerNode && this.contentNode) {
      await this.__createPopperInstance();
      this._popper.update();
    }

    this.__enableFeatures();
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

    this.__disableFeatures();
  }

  __enableFeatures() {
    super.__enableFeatures();

    this.invokerNode.setAttribute('aria-expanded', 'true');
    if (this.inheritsReferenceObjectWidth) {
      this.enableInheritsReferenceObjectWidth();
    }
    if (this.hidesOnOutsideClick) {
      this.enableHidesOnOutsideClick();
    }
  }

  __disableFeatures() {
    super.__disableFeatures();

    this.invokerNode.setAttribute('aria-expanded', 'false');
    if (this.hidesOnOutsideClick) {
      this.disableHidesOnOutsideClick();
    }
  }

  enableInheritsReferenceObjectWidth() {
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
    const mod = await this.constructor.popperModule;
    const Popper = mod.default;
    this._popper = new Popper(this.invokerNode, this.contentNode, {
      ...this.popperConfig,
    });
  }

  get contentTemplate() {
    return super.contentTemplate;
  }

  set contentTemplate(value) {
    super.contentTemplate = value;
    if (this.contentNode && this.invokerNode) {
      this.disableHidesOnOutsideClick();
      this.enableHidesOnOutsideClick();
    }
  }

  // **********************************************************************************************
  // FEATURE - hidesOnOutsideClick
  // **********************************************************************************************
  get hasActiveHidesOnOutsideClick() {
    return this.__hasActiveHidesOnOutsideClick;
  }

  enableHidesOnOutsideClick() {
    if (this.hasActiveHidesOnOutsideClick === true) {
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
        if (wasClickInside === false) {
          this.hide();
        }
      });
    };

    this.contentNode.addEventListener('click', this.__preventCloseOutsideClick, true);
    this.invokerNode.addEventListener('click', this.__preventCloseOutsideClick, true);
    document.documentElement.addEventListener('click', this.__onCaptureHtmlClick, true);

    this.__hasActiveHidesOnOutsideClick = true;
  }

  disableHidesOnOutsideClick() {
    if (this.hasActiveHidesOnOutsideClick === false) {
      return;
    }

    if (this.contentNode) {
      this.contentNode.removeEventListener('click', this.__preventCloseOutsideClick, true);
    }
    this.invokerNode.removeEventListener('click', this.__preventCloseOutsideClick, true);
    document.documentElement.removeEventListener('click', this.__onCaptureHtmlClick, true);
    this.__preventCloseOutsideClick = null;
    this.__onCaptureHtmlClick = null;

    this.__hasActiveHidesOnOutsideClick = false;
  }
}
