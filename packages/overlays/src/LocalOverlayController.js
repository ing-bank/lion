import { render, html } from '@lion/core';
import { managePosition } from './utils/manage-position.js';
import { containFocus } from './utils/contain-focus.js';
import { keyCodes } from './utils/key-codes.js';

export class LocalOverlayController {
  constructor(params = {}) {
    this._fakeExtendsEventTarget();

    const finalParams = {
      placement: 'top',
      position: 'absolute',
      ...params,
    };
    this.hidesOnEsc = finalParams.hidesOnEsc;
    this.hidesOnOutsideClick = finalParams.hidesOnOutsideClick;
    this.trapsKeyboardFocus = finalParams.trapsKeyboardFocus;
    this.placement = finalParams.placement;
    this.position = finalParams.position;
    /**
     * A wrapper to render into the invokerTemplate
     *
     * @property {HTMLElement}
     */
    this.invoker = document.createElement('div');
    this.invoker.style.display = 'inline-block';
    this.invokerTemplate = finalParams.invokerTemplate;
    /**
     * The actual invoker element we work with - it get's all the events and a11y
     *
     * @property {HTMLElement}
     */
    this.invokerNode = this.invoker;
    if (finalParams.invokerNode) {
      this.invokerNode = finalParams.invokerNode;
      this.invoker = this.invokerNode;
    }

    /**
     * A wrapper the contentTemplate renders into
     *
     * @property {HTMLElement}
     */
    this.content = document.createElement('div');
    this.content.style.display = 'inline-block';
    this.contentTemplate = finalParams.contentTemplate;
    this.contentNode = this.content;
    if (finalParams.contentNode) {
      this.contentNode = finalParams.contentNode;
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
    // [a11y] TODO: this is only needed for tooltips, I assume?
    // Also, we should allow to configure tooltips in such a way that we can use
    // aria-labelledby instead: https://inclusive-components.design/tooltips-toggletips/
    this.invokerNode.setAttribute('aria-describedby', this.contentId);
    // Also, we should add role="tooltip" on this.contentNode ?
  }

  /**
   * Shows the overlay.
   */
  show() {
    this._createOrUpdateOverlay(true, this._prevData);
    this.dispatchEvent(new Event('show'));
  }

  /**
   * Hides the overlay.
   */
  hide() {
    this._createOrUpdateOverlay(false, this._prevData);
    this.dispatchEvent(new Event('hide'));
  }

  /**
   * Toggles the overlay.
   */
  toggle() {
    // eslint-disable-next-line no-unused-expressions
    this.isShown ? this.hide() : this.show();
  }

  _createOrUpdateOverlay(shown = this._prevShown, data = this._prevData) {
    if (shown) {
      this._contentData = { ...this._contentData, ...data };

      // let lit-html manage the template and update the properties
      if (this.contentTemplate) {
        render(this.contentTemplate(this._contentData), this.content);
        this.contentNode = this.content.firstElementChild;
      }
      this.contentNode.style.display = 'inline-block';
      this.contentNode.id = this.contentId;
      this.invokerNode.setAttribute('aria-expanded', true);

      managePosition(this.contentNode, this.invokerNode, {
        placement: this.placement,
        position: this.position,
      });

      if (this.trapsKeyboardFocus) this._setupTrapsKeyboardFocus();
      if (this.hidesOnOutsideClick) this._setupHidesOnOutsideClick();
      if (this.hidesOnEsc) this._setupHidesOnEsc();
    } else {
      this._updateContent();
      this.invokerNode.setAttribute('aria-expanded', false);
      if (this.hidesOnOutsideClick) this._teardownHidesOnOutsideClick();
      if (this.hidesOnEsc) this._teardownHidesOnEsc();
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

  // TODO: this method has to be removed when EventTarget polyfill is available on IE11
  // issue: https://gitlab.ing.net/TheGuideComponents/lion-element/issues/12
  _fakeExtendsEventTarget() {
    const delegate = document.createDocumentFragment();
    ['addEventListener', 'dispatchEvent', 'removeEventListener'].forEach(funcName => {
      this[funcName] = (...args) => delegate[funcName](...args);
    });
  }
}
