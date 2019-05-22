import { html, css, LitElement } from '@lion/core';
import { ListboxBehavior } from './ListBoxBehavior.js';

// Wai-aria pattern: https://www.w3.org/TR/wai-aria-practices/#Listbox
// Implements ListNavigationBehavior
// SelectableBehavior (with active-descendant)
export class LionListbox extends LitElement {
  static get styles() {
    return [
      css`
        :host {
          display: block;
        }
      `,
    ];
  }

  static get properties() {
    return {
      multi: { type: Boolean, reflect: true },
      value: { type: Object }, // if multi -> Array, if !multi -> String
    };
  }

  constructor() {
    super();
    this.__optionElements = [];
  }

  connectedCallback() {
    super.connectedCallback();

    this.role = 'listbox';
    this.tabIndex = -1;
    if (this.multi) {
      this.setAttribute('aria-multiselectable', '');
    }

    this.addEventListener('option-register', ({ target: el }) => {
      el._parentListbox = this; // eslint-disable-line
      this.__optionElements.push(el);
      const ctor = this.constructor;
      ctor._count = ctor._count ? ctor._count + 1 : 0;
      el.id = el.id || `${this.localName}-option-${ctor._count}-${this.__optionElements.length}`; // eslint-disable-line
    });

    // TODO: loose the fuzzyiness here
    requestAnimationFrame(() => {
      this._listbox = new ListboxBehavior(this);
    });
  }

  render() {
    return html`
      <slot></slot>
    `;
  }
}
