import { render, html } from '@lion/core';
import { managePosition, updatePosition } from './utils/manage-position.js';
import { containFocus } from './utils/contain-focus.js';
import { keyCodes } from './utils/key-codes.js';

export class LocalOverlayController {
  constructor(params = {}) {
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
    this.invoker = document.createElement('div');
    this.invoker.style.display = 'inline-block';
    this.content = document.createElement('div');
    this.content.style.display = 'inline-block';
    this.contentId = `overlay-content-${Math.random()
      .toString(36)
      .substr(2, 10)}`;
    this._contentData = {};
    this.invokerTemplate = finalParams.invokerTemplate;
    this.invokerNode = finalParams.invokerNode;
    this.contentTemplate = finalParams.contentTemplate;
    this.contentNode = finalParams.contentNode;
    this.syncInvoker();
    this._updateContent();
    this._prevShown = false;
    this._prevData = {};

    if (this.hidesOnEsc) this._setupHidesOnEsc();
    this._created = false;
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
  show() {
    this._createOrUpdateOverlay(true, this._prevData);
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
    /* eslint-disable-next-line no-unused-expressions */
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

      const positionParams = [
        this.contentNode,
        this.invokerNode,
        {
          placement: this._contentData.placement || this.placement,
          position: this.position,
        },
      ];

      if (!this._created) {
        managePosition(...positionParams);
        this._created = true;
      } else {
        updatePosition(...positionParams);
      }

      if (this.trapsKeyboardFocus) this._setupTrapsKeyboardFocus();
      if (this.hidesOnOutsideClick) this._setupHidesOnOutsideClick();
    } else {
      this._updateContent();
      this.invokerNode.setAttribute('aria-expanded', false);
      if (this.hidesOnOutsideClick) this._teardownHidesOnOutsideClick();
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
    this._containFocusHandler = containFocus(this.content.firstElementChild);
  }

  _setupHidesOnEsc() {
    this.content.addEventListener('keyup', event => {
      if (event.keyCode === keyCodes.escape) {
        this.hide();
      }
    });
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

    this.content.addEventListener('click', this.__preventCloseOutsideClick, true);
    this.invoker.addEventListener('click', this.__preventCloseOutsideClick, true);
    document.documentElement.addEventListener('click', this.__onCaptureHtmlClick, true);
  }

  _teardownHidesOnOutsideClick() {
    this.content.removeEventListener('click', this.__preventCloseOutsideClick, true);
    this.invoker.removeEventListener('click', this.__preventCloseOutsideClick, true);
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
}
