import { LitElement, html, css } from 'lit';
import { uuid } from '@lion/ui/core.js';
/**
 * `LionCollapsible` is a class for custom collapsible element (`<lion-collapsible>` web component).
 *
 * @customElement lion-collapsible
 * @extends LitElement
 */
export class LionCollapsible extends LitElement {
  static get styles() {
    return [
      css`
        :host {
          display: block;
        }

        :host ::slotted([slot='content']) {
          overflow: hidden;
        }
      `,
    ];
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
    this.toggle = this.toggle.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();

    const uid = uuid();

    if (this._invokerNode) {
      this._invokerNode.addEventListener('click', this.toggle);
      this._invokerNode.setAttribute('aria-expanded', `${this.opened}`);
      this._invokerNode.setAttribute('id', `collapsible-invoker-${uid}`);
      this._invokerNode.setAttribute('aria-controls', `collapsible-content-${uid}`);
    }

    if (this._contentNode) {
      this._contentNode.setAttribute('aria-labelledby', `collapsible-invoker-${uid}`);
      this._contentNode.setAttribute('id', `collapsible-content-${uid}`);
    }

    this.__setDefaultState();
  }

  /**
   * Update aria labels on state change.
   * @param {import('@lion/core').PropertyValues } changedProperties
   */
  updated(changedProperties) {
    if (changedProperties.has('opened')) {
      this.__openedChanged();
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this._invokerNode) {
      this._invokerNode.removeEventListener('click', this.toggle);
    }
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
   * @param {Object} opts
   * @protected
   */
  // eslint-disable-next-line class-methods-use-this, no-empty-function, no-unused-vars
  async _showAnimation(opts) {}

  /**
   * Hide animation implementation in sub-classer.
   * @param {Object} opts
   * @protected
   */
  // eslint-disable-next-line class-methods-use-this, no-empty-function, no-unused-vars
  async _hideAnimation(opts) {}

  /**
   * @protected
   */
  get _invokerNode() {
    return /** @type {HTMLElement[]} */ (Array.from(this.children)).find(
      child => child.slot === 'invoker',
    );
  }

  /**
   * @protected
   */
  get _contentNode() {
    return /** @type {HTMLElement[]} */ (Array.from(this.children)).find(
      child => child.slot === 'content',
    );
  }

  /**
   * @protected
   */
  get _contentHeight() {
    const size = this._contentNode?.getBoundingClientRect().height || 0;
    return `${size}px`;
  }

  /**
   * Update content slot size and fire `opened-changed` event
   * @private
   */
  __openedChanged() {
    this.__updateContentSize();
    if (this._invokerNode) {
      this._invokerNode.setAttribute('aria-expanded', `${this.opened}`);
    }
    this.dispatchEvent(new CustomEvent('opened-changed'));
  }

  /**
   * Toggle extra content visibility on state change.
   * @private
   */
  async __updateContentSize() {
    if (this._contentNode) {
      if (this.opened) {
        this._contentNode.style.setProperty('display', '');
        await this._showAnimation({ contentNode: this._contentNode });
      } else {
        await this._hideAnimation({ contentNode: this._contentNode });
        this._contentNode.style.setProperty('display', 'none');
      }
    }
  }

  /**
   * Set default state for content based on `opened` attr
   * @private
   */
  __setDefaultState() {
    if (!this.opened && this._contentNode) {
      this._contentNode.style.setProperty('display', 'none');
    }
  }
}
