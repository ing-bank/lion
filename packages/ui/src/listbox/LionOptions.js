import { LitElement } from 'lit';
import { FormRegistrarPortalMixin } from '@lion/ui/form-core.js';

/**
 * LionOptions
 */
export class LionOptions extends FormRegistrarPortalMixin(LitElement) {
  static get properties() {
    return {
      role: {
        type: String,
        reflect: true,
      },
      tabIndex: {
        type: Number,
        reflect: true,
        attribute: 'tabindex',
      },
    };
  }

  constructor() {
    super();
    this.role = 'listbox';
    this.tabIndex = 0;
  }

  createRenderRoot() {
    return this;
  }
}
