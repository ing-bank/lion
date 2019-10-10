import { LitElement } from '@lion/core';
import { FormRegistrarPortalMixin } from '@lion/field';

/**
 * LionOptions
 *
 * @customElement lion-options
 * @extends LitElement
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
    // we made it a Lit-Element property because of this
    // eslint-disable-next-line wc/no-constructor-attributes
    this.tabIndex = 0;
  }

  createRenderRoot() {
    return this;
  }
}
