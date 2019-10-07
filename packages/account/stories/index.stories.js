/* eslint-disable */
import { storiesOf, html } from '@open-wc/demoing-storybook';
import { render, css } from '@lion/core';
import '@lion/select-rich/lion-options.js';
import '@lion/select-rich/lion-select-rich.js';
import '@lion/option/lion-option.js';

import '../lion-account-option.js';
import '../lion-account-options.js';
import '../lion-account-select.js';

storiesOf('Account|Select', module).add('Used on its own', () => {
  const demoStyles = css`
    .demo-area {
      margin: 40px auto;
      width: 580px;
    }
  `;

  const accounts = [
    {
      value: {
        alias: 'ING Savings Account',
        currencyAmount: 2040,
        currency: 'EUR',
        iban: 'DE89370400440532013000',
        // bankIcon: IngLogo,
      },
      checked: false,
    },
    {
      value: {
        alias: 'ING Debit Account',
        currencyAmount: 1236,
        currency: 'EUR',
        iban: 'BE68539007547034',
        // bankIcon: IngLogo,
      },
      checked: false,
    },
    {
      value: {
        alias: 'ING Debit Account 2',
        currencyAmount: 845,
        currency: 'USD',
        iban: 'BE68539007547034',
        // bankIcon: IngLogo,
      },
      checked: false,
    },
    {
      value: {
        alias: "ING Look At Me I'm Rich",
        currencyAmount: 2381238,
        currency: 'EUR',
        iban: 'BE68539007547034',
        // bankIcon: IngLogo,
      },
      checked: false,
    },
  ];

  const data = {
    myVar: 'foo',
  };

  let count = 0;

  const updateTemplate = () => {
    count++;
    data.myVar = `foo: ${count}`;
    if (count > 2) {
      data.bar = {
        value: {
          alias: 'OMG Magic',
          currencyAmount: 'WOW LOOK EVERYTHING CHANGED',
          currency: 'EUR',
          iban: 'BE68539007547034',
        },
        checked: false,
      };
    }
    render(template(data), document.querySelector('#myContainer'));
  };

  const template = html`
    <style>
      ${demoStyles}
    </style>
    <div class="demo-area">
      <lion-account-select label="Account" name="color">
        <lion-account-options
          @model-value-changed=${() => console.log('model value changed')}
          slot="input"
        >
          ${accounts.map(
            account => html`
              <lion-account-option
                .modelValue=${data.bar || { value: account.value, checked: false }}
                >${data.bar ? data.bar.value.alias : account.value.alias}</lion-account-option
              >
            `,
          )}
          <lion-account-option @click=${() => updateTemplate()}>${data.myVar} </lion-account-option>
        </lion-account-options>
      </lion-account-select>
    </div>

    <div class="demo-area">
      <lion-select-rich label="Favorite color" name="color">
        <lion-options slot="input">
          <lion-option .modelValue=${{ value: 'red', checked: false }}>Red</lion-option>
          <lion-option .modelValue=${{ value: 'hotpink', checked: true }}>Hotpink</lion-option>
          <lion-option .modelValue=${{ value: 'teal', checked: false }}>Teal</lion-option>
        </lion-options>
      </lion-select-rich>
    </div>
  `;

  // updateTemplate();

  return template;
});
