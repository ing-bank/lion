import { css } from '@lion/core';
import { LionSelectInvoker } from '@lion/select-rich/src/LionSelectInvoker.js';
import { optionAccountStyles } from './option-account/optionAccountStyles.js';
import { optionAccountTemplate } from './option-account/optionAccountTemplate.js';

/**
 * # <ing-select-account-invoker> web component
 *
 * @customElement ing-select-account-invoker
 * @extends LionSelectInvoker
 */
export class IngSelectAccountInvoker extends LionSelectInvoker {
  static get styles() {
    return [
      super.styles,
      optionAccountStyles,
      css`
        /* TODO: refactor LionButton css */
        #content-wrapper {
          flex: 1;
        }
      `,
    ];
  }

  get slots() {
    return {
      ...super.slots,
      after: () => {
        const chevron = document.createElement('span');
        chevron.innerText = 'dit is een chevron';
        return chevron;
        // render die mf chevron
        // return document.createElement('ing-select-account-invoker');
      },
    };
  }

  _contentTemplate() {
    const value = this.selectedElement && this.selectedElement.modelValue && this.selectedElement.modelValue.value
    return optionAccountTemplate(value || undefined);
  }
}
