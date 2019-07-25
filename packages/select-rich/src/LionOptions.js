import { LitElement } from '@lion/core';

/**
 * LionOptions
 *
 * @customElement
 * @extends LitElement
 */
export class LionOptions extends LitElement {
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
