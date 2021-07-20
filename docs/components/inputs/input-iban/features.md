# Inputs >> Input Iban >> Features ||20

```js script
import { html } from '@mdjs/mdjs-preview';
import { loadDefaultFeedbackMessages } from '@lion/validate-messages';
import { IsCountryIBAN, IsNotCountryIBAN } from '@lion/input-iban';
import '@lion/input-iban/define';
```

## Prefilled

```js preview-story
export const prefilled = () => html`
  <lion-input-iban .modelValue=${'NL20INGB0001234567'} name="iban" label="IBAN"></lion-input-iban>
`;
```

## Faulty Prefilled

```js preview-story
export const faultyPrefilled = () => html`
  <lion-input-iban
    .modelValue=${'NL20INGB0001234567XXXX'}
    name="iban"
    label="IBAN"
  ></lion-input-iban>
`;
```

## Country Restrictions

By default, we validate the input to ensure the IBAN is valid.
To get the default feedback message for this default validator, use `loadDefaultFeedbackMessages` from `@lion/form-core`.

In the example below, we show how to use an additional validator that restricts the `input-iban` to IBANs from only certain countries.

```js preview-story
export const countryRestrictions = () => {
  loadDefaultFeedbackMessages();
  return html`
    <lion-input-iban
      .modelValue=${'DE89370400440532013000'}
      .validators=${[new IsCountryIBAN('NL')]}
      name="iban"
      label="IBAN"
    ></lion-input-iban>
    <br />
    <small>Demo instructions: you can use NL20 INGB 0001 2345 67</small>
  `;
};
```

You can pass a single string value, or an array of strings.
The latter may be useful, for example if you only want to allow BeNeLux IBANs.

```js preview-story
export const countryRestrictionsMultiple = () => {
  loadDefaultFeedbackMessages();
  return html`
    <lion-input-iban
      .modelValue=${'DE89370400440532013000'}
      .validators=${[new IsCountryIBAN(['BE', 'NL', 'LU'])]}
      name="iban"
      label="IBAN"
    ></lion-input-iban>
    <br />
    <small>Demo instructions: you can use:</small>
    <ul>
      <li><small>BE68 5390 0754 7034</small></li>
      <li><small>NL20 INGB 0001 2345 67</small></li>
      <li><small>LU28 0019 4006 4475 0000</small></li>
    </ul>
  `;
};
```

## Blacklisted Country

By default, we validate the input to ensure the IBAN is valid.
To get the default feedback message for this default validator, use `loadDefaultFeedbackMessages` from `@lion/form-core`.

In the example below, we show how to use an additional validator that blocks IBANs from certain countries.

You can pass a single string value, or an array of strings.

```js preview-story
export const blacklistedCountry = () => {
  loadDefaultFeedbackMessages();
  return html`
    <lion-input-iban
      .modelValue=${'DE89370400440532013000'}
      .validators=${[new IsNotCountryIBAN(['RO', 'NL'])]}
      name="iban"
      label="IBAN"
    ></lion-input-iban>
    <br />
    <small>
      Demo instructions: Try <code>RO 89 RZBR 6997 3728 4864 5577</code> and watch it fail
    </small>
  `;
};
```
