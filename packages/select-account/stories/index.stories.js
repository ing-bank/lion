import { storiesOf, html } from '@open-wc/demoing-storybook';

import '@lion/select-rich/lion-select-rich.js';
import '@lion/select-rich/lion-options.js';
import '@lion/option/lion-option.js';

import '../../../ing-select-account.js';
import '../../../ing-option-account.js';
import '../../../ing-select-options.js';

console.log('HWYYYY');

{/* <lion-select-rich label="Favorite color" name="color">
<lion-options slot="input">
  <lion-option .modelValue=${{ value: 'red', checked: false }}>Red</lion-option>
  <lion-option .modelValue=${{ value: 'hotpink', checked: true }}>Hotpink</lion-option>
  <lion-option .modelValue=${{ value: 'teal', checked: false }}>Teal</lion-option>
</lion-options>
</lion-select-rich> */}

{/* <ing-select-account name="foo"
.contentTemplate="${() => html`
<ing-select-options slot="input">
  ${accounts.map(account => html`
    <ing-option-account .modelValue="${account}"></ing-option-account>
  `)}
</ing-select-options>`}">
</ing-select-account> */}

storiesOf('Form | Select Account', module)
  .add('Basic', () => {

    const div = document.createElement('div');
    setInterval(() => {
      div.innerText = Math.random();
      // console.log(div);
    }, 2000);

    const accounts = [
      {
        value: {
          title: 'ING Savings Account',
          amount: 2040,
          currency: 'EUR',
          iban: 'DE89370400440532013000',
          // bankIcon: IngLogo,
        },
        checked: false,
      },
      {
        value: {
          title: 'ING Debit Account',
          amount: 1236,
          currency: 'EUR',
          iban: 'BE68539007547034',
          // bankIcon: IngLogo,
        },
        checked: false,
      }
    ]

    return html`


<ing-select-account name="foo">
<ing-select-options slot="input">
  ${accounts.map(account => html`
    <ing-option-account .modelValue="${account}"></ing-option-account>
  `)}
</ing-select-options>
</ing-select-account>



    `;
  });
