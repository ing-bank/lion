import { LitElement } from '@lion/core';
import { FormRegistrarPortalMixin } from '@lion/form-core';

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
