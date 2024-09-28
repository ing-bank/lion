import { html, render } from 'lit';
import { LionCombobox } from '@lion/ui/combobox.js';
import { listboxComplexData } from '@lion/root/docs/components/listbox/src/listboxData.js';
import '@lion/ui/define/lion-combobox.js';
import '@lion/ui/define/lion-option.js';
import { lazyRender } from '@lion/root/docs/components/combobox/src/lazyRender.js';
import { loadDefaultFeedbackMessages } from '@lion/ui/validate-messages.js';

loadDefaultFeedbackMessages();

class ComplexCombobox extends LionCombobox {
  _showOverlayCondition(options) {
    /**
     * Do now show dropdown until 3 symbols are typed
     * @override
     * @ts-ignore
     */
    return this.__prevCboxValueNonSelected.length > 3 && super._showOverlayCondition(options);
  }
}

customElements.define('complex-combobox', ComplexCombobox);

const template = () =>
  html` <complex-combobox name="combo" label="Display only the label once selected">
    ${lazyRender(
      listboxComplexData.map(
        entry => html`
          <lion-option .choiceValue="${entry.label}">
            <div data-key>${entry.label}</div>
            <small>${entry.description}</small>
          </lion-option>
        `,
      ),
    )}
  </complex-combobox>`;

render(template(), document.querySelector('e2e-root'));
