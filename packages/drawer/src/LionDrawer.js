import { html, uuid } from '@lion/core';
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
      position: {
        type: String,
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

    if (!this.hasAttribute('position')) {
      this.position = 'left';
    }

    const uid = uuid();

    if (this._contentNode) {
      this._contentNode.style.setProperty('display', '');
    }

    if (this._bottomInvokerNode) {
      this._bottomInvokerNode.addEventListener('click', this.toggle);
      this._bottomInvokerNode.setAttribute('aria-expanded', `${this.opened}`);
      this._bottomInvokerNode.setAttribute('id', `collapsible-invoker-${uid}`);

      if (this._contentNode) {
        this._bottomInvokerNode.setAttribute('aria-controls', this._contentNode.id);
      }
    }

    this.__setBoundaries();
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

  __setBoundaries() {
    const host = this.shadowRoot?.host;

    if (this.position === 'top') {
      this.minHeight = host ? getComputedStyle(host).getPropertyValue('--min-height') : '0px';
      this.maxHeight = host ? getComputedStyle(host).getPropertyValue('--max-height') : '0px';
      this.minWidth = 'auto';
      this.maxWidth = 'auto';
    }

    if (this.position === 'left' || this.position === 'right') {
      this.minWidth = host ? getComputedStyle(host).getPropertyValue('--min-width') : '0px';
      this.maxWidth = host ? getComputedStyle(host).getPropertyValue('--max-width') : '0px';
      this.minHeight = 'auto';
      this.maxHeight = 'auto';
    }

    setTimeout(() => {
      const prop = this.position === 'top' ? 'width' : 'height';

      if (this.__contentNode) {
        this.__contentNode.style.setProperty(prop, '');
      }
    });
  }

  /**
   * Update aria labels on state change.
   * @param {String} position
   */
  set position(position) {
    const stale = this.position;
    this._position = position;
    this.setAttribute('position', position);

    this.__setBoundaries();
    this.requestUpdate('position', stale);
  }

  get position() {
    return this._position ?? 'left';
  }

  /**
   * Trigger show animation and wait for transition to be finished.
   * @param {Object} options - element node and its options
   * @param {HTMLElement} options.contentNode
   * @override
   */
  async _showAnimation({ contentNode }) {
    const min = this.position === 'top' ? this.minHeight : this.minWidth;
    const max = this.position === 'top' ? this.maxHeight : this.maxWidth;
    const prop = this.position === 'top' ? 'height' : 'width';

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
      ((this.position === 'left' || this.position === 'right') &&
        this._contentWidth === this.minWidth) ||
      (this.position === 'top' && this._contentHeight === this.minHeight)
    ) {
      return;
    }

    const min = this.position === 'top' ? this.minHeight : this.minWidth;
    const prop = this.position === 'top' ? 'height' : 'width';

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
  get _bottomInvokerNode() {
    return /** @type {HTMLElement[]} */ (Array.from(this.children)).find(
      child => child.slot === 'bottom-invoker',
    );
  }

  /**
   * @protected
   */
  get __contentNode() {
    return /** @type {HTMLElement} */ (this.shadowRoot?.querySelector('.container'));
  }

  get _contentWidth() {
    const size = this.__contentNode?.getBoundingClientRect().width || 0;
    return `${size}px`;
  }

  get _contentHeight() {
    const size = this.__contentNode?.getBoundingClientRect().height || 0;
    return `${size}px`;
  }

  _openedChanged() {
    this._updateContentSize();
    if (this._invokerNode) {
      this._invokerNode.setAttribute('aria-expanded', `${this.opened}`);
    }

    if (this._bottomInvokerNode) {
      this._bottomInvokerNode.setAttribute('aria-expanded', `${this.opened}`);
    }

    this.dispatchEvent(new CustomEvent('opened-changed'));
  }

  async _updateContentSize() {
    if (this.__contentNode) {
      if (this.opened) {
        await this._showAnimation({ contentNode: this.__contentNode });
      } else {
        await this._hideAnimation({ contentNode: this.__contentNode });
      }
    }
  }

  render() {
    return html`
      <div class="container">
        <div class="headline-container">
          <slot name="invoker"></slot>
          <slot name="headline"></slot>
        </div>
        <div class="content-container">
          <slot name="content"></slot>
        </div>
        <slot name="bottom-invoker"></slot>
      </div>
    `;
  }
}
