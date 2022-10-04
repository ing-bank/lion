import { html } from '@lion/core';
import { LionCollapsible } from '@lion/collapsible';
import { drawerStyle } from './drawerStyle.js';

const EVENT = {
  TRANSITION_END: 'transitionend',
  TRANSITION_START: 'transitionstart',
};

export class LionDrawer extends LionCollapsible {
  static get properties() {
    return {
      transitioning: {
        type: Boolean,
        reflect: true,
      },
      opened: {
        type: Boolean,
        reflect: true,
      },
    };
  }

  constructor() {
    super();

    /** @private */
    this.__toggle = () => {
      this.opened = !this.opened;
    };
  }

  connectedCallback() {
    super.connectedCallback();

    // this._contentNode?.style.setProperty(
    //   'transition',
    //   'max-width 0.35s, padding 0.35s',
    // );
    const setBoundaries = () => {
      const host = this.shadowRoot?.host;

      if (this.orientation === 'top') {
        this.minHeight = host ? getComputedStyle(host).getPropertyValue('--min-height') : '0px';
        this.maxHeight = host ? getComputedStyle(host).getPropertyValue('--max-height') : '0px';
        this.minWidth = 'auto';
        this.maxWidth = 'auto';
      }

      if (this.orientation === 'left') {
        this.minWidth = host ? getComputedStyle(host).getPropertyValue('--min-width') : '0px';
        this.maxWidth = host ? getComputedStyle(host).getPropertyValue('--max-width') : '0px';
        this.minHeight = 'auto';
        this.maxHeight = 'auto';
      }

      setTimeout(() => {
        const prop = this.orientation === 'left' ? 'height' : 'width';
        this._contentNode.style.setProperty(prop, '');
      });
    };

    const mediaQuery = window.matchMedia('(min-width: 640px)');
    this.orientation = mediaQuery.matches ? 'left' : 'top';

    mediaQuery.addEventListener('change', e => {
      this.orientation = e.matches ? 'left' : 'top';

      setBoundaries();
    });

    setBoundaries();
  }

  /**
   * Update aria labels on state change.
   * @param {import('@lion/core').PropertyValues } changedProperties
   */
  updated(changedProperties) {
    if (changedProperties.has('opened')) {
      this._openedChanged();
    }
  }

  static get styles() {
    return [drawerStyle];
  }

  /**
   * Trigger show animation and wait for transition to be finished.
   * @param {Object} options - element node and its options
   * @param {HTMLElement} options.contentNode
   * @override
   */
  async _showAnimation({ contentNode }) {
    const min = this.orientation === 'left' ? this.minWidth : this.minHeight;
    const max = this.orientation === 'left' ? this.maxWidth : this.maxHeight;
    const prop = this.orientation === 'left' ? 'width' : 'height';

    contentNode.style.setProperty(prop, /** @type {string} */ (min));
    await new Promise(resolve => requestAnimationFrame(() => resolve(true)));
    contentNode.style.setProperty(prop, /** @type {string} */ (max));
    await this._waitForTransition({ contentNode });
  }

  /**
   * Trigger hide animation and wait for transition to be finished.
   * @param {Object} options - element node and its options
   * @param {HTMLElement} options.contentNode
   * @override
   */
  async _hideAnimation({ contentNode }) {
    if (
      (this.orientation === 'left' && this._contentWidth === this.minWidth) ||
      (this.orientation === 'top' && this._contentHeight === this.minHeight)
    ) {
      return;
    }

    const min = this.orientation === 'left' ? this.minWidth : this.minHeight;
    const prop = this.orientation === 'left' ? 'width' : 'height';

    contentNode.style.setProperty(prop, /** @type {string} */ (min));
    await this._waitForTransition({ contentNode });
  }

  /**
   *  Wait until the transition event is finished.
   * @param {Object} options - element node and its options
   * @param {HTMLElement} options.contentNode
   * @returns {Promise<void>} transition event
   */
  _waitForTransition({ contentNode }) {
    return new Promise(resolve => {
      const transitionStarted = () => {
        contentNode.removeEventListener(EVENT.TRANSITION_START, transitionStarted);
        this.transitioning = true;
      };
      contentNode.addEventListener(EVENT.TRANSITION_START, transitionStarted);

      const transitionEnded = () => {
        contentNode.removeEventListener(EVENT.TRANSITION_END, transitionEnded);
        this.transitioning = false;
        resolve();
      };
      contentNode.addEventListener(EVENT.TRANSITION_END, transitionEnded);
    });
  }

  /**
   * @protected
   */
  get _contentNode() {
    return /** @type {HTMLElement} */ (this.shadowRoot?.querySelector('#container'));
  }

  get _contentWidth() {
    const size = this._contentNode?.getBoundingClientRect().width || 0;
    return `${size}px`;
  }

  get _contentHeight() {
    const size = this._contentNode?.getBoundingClientRect().height || 0;
    return `${size}px`;
  }

  _openedChanged() {
    this._updateContentSize();
    if (this._invokerNode) {
      this._invokerNode.setAttribute('aria-expanded', `${this.opened}`);
    }
    this.dispatchEvent(new CustomEvent('opened-changed'));
  }

  async _updateContentSize() {
    if (this._contentNode) {
      if (this.opened) {
        await this._showAnimation({ contentNode: this._contentNode });
      } else {
        await this._hideAnimation({ contentNode: this._contentNode });
      }
    }
  }

  render() {
    return html`
      <div id="container">
        <div id="headline-container">
          <slot name="invoker"></slot>
          <slot name="headline"></slot>
        </div>
        <div id="content-container">
          <slot name="content"></slot>
        </div>
      </div>
    `;
  }
}
