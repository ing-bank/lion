import { html, LitElement, css } from '@lion/core';

/**
 * https://developer.mozilla.org/en-US/docs/Web/HTML/Element/option
 * Can be a child of datalist/select, or role="listbox"
 *
 * Element gets state supplied externally, reflects this to attributes,
 * enabling Subclassers to style based on those states
 */
export class LionOption extends LitElement {
  static get properties() {
    return {
      /**
       * The content of this attribute represents the value to be submitted with the form, should
       * this option be selected. If this attribute is omitted, the value is taken from the text
       * content of the option element.
       */
      value: { type: String },
      /**
       * If this Boolean attribute is set, this option is not checkable. Often browsers grey out
       * such control and it won't receive any browsing event, like mouse clicks or focus-related
       * ones. If this attribute is not set, the element can still be disabled if one of its
       * ancestors is a disabled <optgroup> element.
       * (From: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/option)
       */
      disabled: { type: Boolean, reflect: true },
      // /**
      //  * This attribute is text for the label indicating the meaning of the option. If the label
      //  * attribute isn't defined, its value is that of the element text content.
      //  */
      // label: { type: String },

      focused: { type: Boolean, reflect: true },
      selected: { type: Boolean, reflect: true },

      hierarchyLevel: { type: Number, reflect: true, attribute: 'hierarchy-level' },
    };
  }

  static get styles() {
    return [
      css`
        :host {
          display: block;
          padding: 4px;
        }

        :host([focused]) {
          background: lightblue;
        }

        :host([disabled]) {
          color: lightgray;
        }

        :host([hierarchy-level='1']) {
          padding-left: 8px;
        }
      `,
    ];
  }

  connectedCallback() {
    super.connectedCallback();
    this.setAttribute('role', 'option');

    // Register or mutation observer in parent.
    // Wait for shady poyfill (after render);
    this.updateComplete.then(() => {
      this.dispatchEvent(
        new CustomEvent('option-register', { bubbles: true, detail: { element: this } }),
      );
    });
  }

  disconnectedCallback() {
    // this._parentOptGroup.dispatchEvent(new CustomEvent('option-unregister', { bubbles: true, details: { element: this } }));
    // this._parentListbox.dispatchEvent(new CustomEvent('option-unregister', { bubbles: true, details: { element: this } }));
  }

  render() {
    return html`
      <div class="c-option">
        <slot></slot>
      </div>
    `;
  }
}
