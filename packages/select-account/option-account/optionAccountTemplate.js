import { html } from '@lion/core';
import { friendlyFormatIBAN } from '@bundled-es-modules/ibantools';
// import { formatAmountHtml } from '../../localize/formatAmountHtml.js';
// import { addressBook } from '../../../icons/solid-form.js';
// import '../../../ing-icon.js';


export function optionAccountTemplate({ title, amount, iban } = {}) {
  return html`
    <div class="option-account">
      <div class="option-account__prefix">
        <ing-icon class="option-account__icon"></ing-icon>
      </div>
      <div class="option-account__body">
        <div class="option-account__title">
            ${title}
        </div>
        <div class="option-account__amount">
        </div>
        <div class="option-account__iban">
          ${friendlyFormatIBAN(iban || '')}
        </div>
      </div>
    </div>`;
}
