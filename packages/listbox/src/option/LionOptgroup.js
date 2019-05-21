import { html, css, LitElement, SlotMixin } from '@lion/core';

/**
 * Presentational component
 * Controls disabled state of all it's children
 */
export class LionOptgroup extends SlotMixin(LitElement) {
  static get properties() {
    return {
      /**
       * The name of the group of options, which the browser can use when labeling the options in
       * the user interface. This attribute is mandatory if this element is used.
       * (From: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/optgroup)
       */
      label: { type: String },
      /**
       * If this Boolean attribute is set, none of the items in this option group is selectable.
       * Often browsers grey out such control and it won't receive any browsing events, like mouse
       * clicks or focus-related ones.
       * (From: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/optgroup)
       */
      disabled: { type: Boolean, reflect: true },
    };
  }

  static get styles() {
    return [
      css`
        :host {
          display: block;
          margin-top: 4px;
          margin-bottom: 4px;
        }

        .c-optgroup__label {
          border-bottom: 1px solid lightgray;
          margin-bottom: 4px;
          font-weight: bold;
          padding: 4px;
        }
      `,
    ];
  }

  get slots() {
    return {
      ...super.slots,
      label: () => {
        const label = document.createElement('label');
        label.textContent = this.label;
        return label;
      },
    };
  }

  constructor() {
    super();
    this.__optionElements = [];
  }

  connectedCallback() {
    super.connectedCallback();
    // Don't set a role: will break VoiceOver
    // this.setAttribute('role', 'group');
    // TODO: see if label can be linked to child options via aria-labelledby
    this.hierarchyLevel = this.hierarchyLevel || 0;
    this.addEventListener('option-register', ({ target }) => {
      target.hierarchyLevel = this.hierarchyLevel + 1; // eslint-disable-line
      target._parentOptGroup = this; // eslint-disable-line
      this.__optionElements.push(target);
    });
    // Delegate disabled state to children... See if logic from fieldset can be isolated and
    // reused for this...
  }

  _requestUpdate(name, oldValue) {
    super._requestUpdate(name, oldValue);

    if (name === 'disabled') {
      this.__optionElements.forEach(optionEl => {
        optionEl.disabled = this.disabled; // eslint-disable-line
      });
    }
  }

  render() {
    return html`
      <div class="c-optgroup">
        <div class="c-optgroup__label">
          <slot name="label"></slot>
        </div>
        <div class="c-optgroup__list">
          <slot></slot>
        </div>
      </div>
    `;
  }
}
