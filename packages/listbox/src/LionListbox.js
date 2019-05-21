import { html, LitElement } from '@lion/core';
import { Listbox as ListboxBehavior } from './ListBoxBehavior.js';

// Wai-aria pattern: https://www.w3.org/TR/wai-aria-practices/#Listbox
// Implements ListNavigationBehavior
// SelectableBehavior (with active-descendant)
export class LionListbox extends LitElement {
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
    setTimeout(() => {
      this._listbox = new ListboxBehavior(this);
    }, 200);
  }

  render() {
    return html`
      <div>
        <slot></slot>
      </div>
    `;
  }
}
