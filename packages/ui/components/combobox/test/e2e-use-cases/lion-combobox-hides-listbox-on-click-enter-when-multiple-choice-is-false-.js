import { html, render } from 'lit';
import '@lion/ui/define/lion-combobox.js';
import '@lion/ui/define/lion-option.js';
import { loadDefaultFeedbackMessages } from '@lion/ui/validate-messages.js';

loadDefaultFeedbackMessages();

const template = () =>
  html` 
    <lion-combobox name="foo">
      <lion-option .choiceValue="${'Artichoke'}">Artichoke</lion-option>
      <lion-option .choiceValue="${'Chard'}">Chard</lion-option>
      <lion-option .choiceValue="${'Chicory'}">Chicory</lion-option>
      <lion-option .choiceValue="${'Victoria Plum'}">Victoria Plum</lion-option>
    </lion-combobox>
  `;

render(template(), document.querySelector('e2e-root'));
