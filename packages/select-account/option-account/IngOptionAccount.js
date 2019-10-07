// TODO: Consider moving option to a seperate folder, so it can be used inside
// the (to be made) ing-listbox as well

import { html } from '@lion/core';
import { LionOption } from '@lion/option/index.js';
import { optionAccountStyles } from './optionAccountStyles.js';
import { optionAccountTemplate } from './optionAccountTemplate.js';

/**
 * # <ing-option-account> webcomponent
 *
 * @customElement ing-option-account
 * @extends LionOption
 */
export class IngOptionAccount extends LionOption {
  static get styles() {
    return [
      super.styles,
      optionAccountStyles,
    ];
  }

  render() {
    return html`
      <div class="choice-field__label">
        ${optionAccountTemplate(this.modelValue.value)}
      </div>
    `;
  }
}
