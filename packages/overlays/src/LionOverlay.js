import { LitElement, html } from '@lion/core';
import { OverlayMixin } from './OverlayMixin.js';
import { OverlayController } from './OverlayController.js';

export class LionOverlay extends OverlayMixin(LitElement) {
  static get properties() {
    return {
      config: {
        type: Object,
      },
    };
  }

  constructor() {
    super();
    this.config = {};
  }

  get config() {
    return this._config;
  }

  set config(value) {
    if (this._overlayCtrl) {
      this._overlayCtrl.updateConfig(value);
    }
    this._config = value;
  }

  render() {
    return html`
      <slot name="invoker"></slot>
      <slot name="content"></slot>
    `;
  }

  // FIXME: This should be refactored to Array.from(this.children).find(child => child.slot === 'content')
  // When this issue is fixed https://github.com/ing-bank/lion/issues/382
  /**
   * @override
   * Overrides OverlayMixin
   * Important to use this override, so that later, contentTemplates can also be accepted
   */
  get _overlayContentNode() {
    const contentNode = this.querySelector('[slot=content]');
    if (contentNode) {
      this._cachedOverlayContentNode = contentNode;
    }
    return contentNode || this._cachedOverlayContentNode;
  }

  /**
   * @override
   * Overrides OverlayMixin
   */
  get _overlayInvokerNode() {
    return Array.from(this.children).find(child => child.slot === 'invoker');
  }

  // eslint-disable-next-line class-methods-use-this
  _defineOverlay({ contentNode, invokerNode }) {
    return new OverlayController({
      placementMode: 'global', // have to set a default
      contentNode,
      invokerNode,
      ...this.config,
    });
  }

  _setupShowHideListeners() {
    this.__close = () => {
      this.opened = false;
    };
    this.__toggle = () => {
      this.opened = !this.opened;
    };
    this._overlayCtrl.invokerNode.addEventListener('click', this.__toggle);
    this._overlayCtrl.contentNode.addEventListener('close', this.__close);
  }

  _teardownShowHideListeners() {
    this._overlayCtrl.invokerNode.removeEventListener('click', this.__toggle);
    this._overlayCtrl.contentNode.removeEventListener('close', this.__close);
  }

  connectedCallback() {
    super.connectedCallback();
    this._setupShowHideListeners();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._teardownShowHideListeners();
  }
}
