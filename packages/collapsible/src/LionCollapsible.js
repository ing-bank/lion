import { LitElement, html, css } from '@lion/core';
/**
 * Generate random UUID
 */
const uuid = () => Math.random().toString(36).substr(2, 10);
/**
 * `LionCollapsible` is a class for custom collapsible element (`<lion-collapsible>` web component).
 *
 * @customElement lion-collapsible
 * @extends LitElement
 */
export class LionCollapsible extends LitElement {
  static get styles() {
    return css`
      :host {
        display: block;
      }

      :host ::slotted([slot='content']) {
        overflow: hidden;
      }
    `;
  }

  static get properties() {
    return {
      opened: {
        type: Boolean,
        reflect: true,
      },
    };
  }

  render() {
    return html`
      <slot name="invoker"></slot>
      <slot name="content"></slot>
    `;
  }

  constructor() {
    super();
    this.opened = false;
  }

  connectedCallback() {
    if (super.connectedCallback) {
      super.connectedCallback();
    }
    const uid = uuid();
    this._invokerNode.addEventListener('click', this.toggle.bind(this));
    this.__setDefaultState();
    this._invokerNode.setAttribute('aria-expanded', this.opened);
    this._invokerNode.setAttribute('id', `collapsible-invoker-${uid}`);
    this._invokerNode.setAttribute('aria-controls', `collapsible-content-${uid}`);
    this._contentNode.setAttribute('aria-labelledby', `collapsible-invoker-${uid}`);
    this._contentNode.setAttribute('id', `collapsible-content-${uid}`);
  }

  /**
   * Update aria labels on state change.
   * @param {Object} changedProps - changed props
   */
  updated(changedProps) {
    if (changedProps.has('opened')) {
      this.__openedChanged();
    }
  }

  disconnectedCallback() {
    if (super.disconnectedCallback) {
      super.disconnectedCallback();
    }
    this._invokerNode.removeEventListener('click', this.toggle);
  }

  /**
   * Show extra content.
   * @public
   */
  show() {
    if (!this.opened) {
      this.opened = true;
    }
  }

  /**
   * Hide extra content.
   * @public
   */
  hide() {
    if (this.opened) {
      this.opened = false;
    }
  }

  /**
   * Toggle the current(opened/closed) state.
   * @public
   */
  toggle() {
    this.opened = !this.opened;
    this.requestUpdate();
  }

  /**
   * Show animation implementation in sub-classer.
   * @protected
   */
  // eslint-disable-next-line class-methods-use-this, no-empty-function
  async _showAnimation() {}

  /**
   * Hide animation implementation in sub-classer.
   * @protected
   */
  // eslint-disable-next-line class-methods-use-this, no-empty-function
  async _hideAnimation() {}

  get _invokerNode() {
    return Array.from(this.children).find(child => child.slot === 'invoker');
  }

  get _contentNode() {
    return Array.from(this.children).find(child => child.slot === 'content');
  }

  get _contentHeight() {
    const size = this._contentNode.getBoundingClientRect().height;
    return `${size}px`;
  }

  /**
   * Update content slot size and fire `opened-changed` event
   * @private
   */
  __openedChanged() {
    this.__updateContentSize();
    this._invokerNode.setAttribute('aria-expanded', this.opened);
    this.dispatchEvent(new CustomEvent('opened-changed'));
  }

  /**
   * Toggle extra content visibility on state change.
   * @private
   */
  async __updateContentSize() {
    if (this.opened) {
      this._contentNode.style.setProperty('display', '');
      await this._showAnimation({ contentNode: this._contentNode });
    } else {
      await this._hideAnimation({ contentNode: this._contentNode });
      this._contentNode.style.setProperty('display', 'none');
    }
  }

  /**
   * Set default state for content based on `opened` attr
   * @private
   */
  __setDefaultState() {
    if (!this.opened) {
      this._contentNode.style.setProperty('display', 'none');
    }
  }
}
