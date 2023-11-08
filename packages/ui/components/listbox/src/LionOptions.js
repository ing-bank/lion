import { LitElement } from 'lit';
import { FormRegistrarPortalMixin } from '@lion/ui/form-core.js';

/**
 * LionOptions
 */
export class LionOptions extends FormRegistrarPortalMixin(LitElement) {
  static get properties() {
    return {
      tabIndex: {
        type: Number,
        reflect: true,
        attribute: 'tabindex',
      },
    };
  }

  constructor() {
    super();
    this.tabIndex = 0;
  }

  connectedCallback() {
    super.connectedCallback();
    this.setAttribute('role', 'listbox');
  }

  createRenderRoot() {
    return this;
  }
}
