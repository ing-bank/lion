import { LitElement, html, css } from '@lion/core';

const uuid = () => Math.random().toString(36).substr(2, 10);
/**
 * # <lion-collapsible> webcomponent
 *
 * @customElement lion-collapsible
 * @extends LitElement
 */
export class LionCollapsible extends LitElement {
  static get properties() {
    return {
      expanded: {
        type: Boolean,
        reflect: true,
      },
      transitioning: {
        type: Boolean,
        reflect: true,
      },
    };
  }

  constructor() {
    super();
    this.expanded = false;
    this.transitioning = false;
  }

  static get styles() {
    return [
      css`
        :host {
          --animation: opacity 0.3s ease-out, max-height 0.3s ease-out;
          display: block;
        }

        :host ::slotted([slot='content']) {
          transition: var(--animation);
          max-height: 0;
          opacity: 0;
          overflow: hidden;
        }

        :host([expanded]) ::slotted([slot='content']) {
          max-height: 100vh;
          opacity: 1;
          overflow: auto;
        }
      `,
    ];
  }

  connectedCallback() {
    if (super.connectedCallback) {
      super.connectedCallback();
    }
    this._setup();
  }

  disconnectedCallback() {
    this._invokerNode.removeEventListener('click', this.__toggle);
    this._contentNode.removeEventListener('transitionend', this.__animation);
  }

  render() {
    return html`
      <slot name="invoker"></slot>
      <slot name="content"></slot>
    `;
  }

  updated(changedProps) {
    if (changedProps.has('expanded')) {
      this.__setCommonAriaAttributes(this.expanded);
    }
  }

  get _invokerNode() {
    return Array.from(this.children).find(child => child.slot === 'invoker');
  }

  get _contentNode() {
    return Array.from(this.children).find(child => child.slot === 'content');
  }

  _setup() {
    const invokerNode = this._invokerNode;
    if (invokerNode) {
      const uid = uuid();
      this._setupExpandCollapseListeners();
      this._setupTransitionListener();
      this.__setCommonAriaAttributes(this.expanded);
      invokerNode.setAttribute('id', `collapsible-invoker-${uid}`);
      invokerNode.setAttribute('aria-controls', `collapsible-content-${uid}`);
      this._contentNode.setAttribute('aria-labelledby', `collapsible-invoker-${uid}`);
      this._contentNode.setAttribute('id', `collapsible-content-${uid}`);
      this.setAttribute('aria-labelledby', `collapsible-invoker-${uid}`);
      this.setAttribute('aria-describedby', `collapsible-content-${uid}`);
    }
  }

  _setupExpandCollapseListeners() {
    this.__toggle = async () => {
      if (this.transitioning) {
        return; // if it is still being expaned, do nothing.
      }
      await new Promise(resolve => requestAnimationFrame(() => resolve()));
      this.expanded = !this.expanded;
      this.transitioning = true;
    };

    this._invokerNode.addEventListener('click', this.__toggle);
  }

  _setupTransitionListener() {
    this.__animation = () => {
      this.transitioning = false;
    };
    this._contentNode.addEventListener('transitionend', this.__animation);
  }

  __setCommonAriaAttributes(expanded) {
    this._invokerNode.setAttribute('aria-expanded', expanded);
    this._contentNode.setAttribute('aria-hidden', !expanded);
  }
}
