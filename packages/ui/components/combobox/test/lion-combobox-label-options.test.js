import { LionOption } from '@lion/ui/listbox.js';
import { runComboboxSuite } from '@lion/ui/combobox-test-suites.js';
import { html } from 'lit';

class LabelOption extends LionOption {
  static get properties() {
    return {
      ...super.properties,
      label: { type: String },
    };
  }

  constructor() {
    super();
    this.label = '';
  }

  formatter() {
    return this.label;
  }

  render() {
    return html`<div class="choice-field__label">
      ${this.children.length ? html`<slot></slot>` : this.label}
    </div>`;
  }
}

customElements.define('label-option', LabelOption);

describe('combobox suite with label-property options', () => {
  runComboboxSuite({
    classes: { option: LabelOption },
    configureOption(option, label) {
      if (!(option instanceof LabelOption)) {
        throw new Error('Expected the configured option class.');
      }
      Object.assign(option, { label });
    },
  });
});
