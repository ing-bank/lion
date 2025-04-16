---
parts:
  - Input Amount Dropdown
  - Use Cases
title: 'Input Amount Dropdown: Use Cases'
eleventyNavigation:
  key: 'Input Amount Dropdown: Use Cases'
  order: 20
  parent: Input Amount Dropdown
  title: Use Cases
---

# Input Amount Dropdown: Use Cases

```js script
import { html } from '@mdjs/mdjs-preview';
import { loadDefaultFeedbackMessages } from '@lion/ui/validate-messages.js';
import '@lion/ui/define/lion-input-amount-dropdown.js';
```

## Input Amount Dropdown

When `.allowedCurrencies` is not configured, all currencies will be available in the dropdown
list.

```js preview-story
export const InputAmountDropdown = () => {
  loadDefaultFeedbackMessages();
  return html`
    <lion-input-amount-dropdown
      label="Select currency via dropdown"
      help-text="Shows all currencies by default"
      name="amount"
    ></lion-input-amount-dropdown>
  `;
};
```

## Allowed currencies

When `.allowedCurrencies` is configured, only those currencies will be available in the dropdown
list.

```js preview-story
export const allowedCurrencies = () => {
  loadDefaultFeedbackMessages();
  return html`
    <lion-input-amount-dropdown
      label="Select currency via dropdown"
      help-text="Shows only allowed currencies"
      name="amount"
      .allowedCurrencies=${['EUR', 'GBP']}
    ></lion-input-amount-dropdown>
  `;
};
```

## Preferred regions

When `.preferredRegions` is configured, they will show up on top of the dropdown list to enhance user experience.

```js preview-story
export const preferredRegionCodes = () => {
  loadDefaultFeedbackMessages();
  return html`
    <lion-input-amount-dropdown
      label="Select region via dropdown"
      help-text="Preferred currencies show on top"
      name="amount"
      .allowedCurrencies=${['EUR', 'GBP', 'USD', 'JPY']}
      .preferredCurrencies=${['USD', 'JPY']}
    ></lion-input-amount-dropdown>
  `;
};
```

## Suffix or prefix

`dropdown-slot` can be set to either `suffix` or `prefix`.

```js preview-story
export const suffixSlot = () => {
  loadDefaultFeedbackMessages();
  return html`
    <lion-input-amount-dropdown
      label="Select region via dropdown"
      dropdown-slot="suffix"
      help-text="the dropdown shows in the suffix slot"
      name="amount"
    ></lion-input-amount-dropdown>
  `;
};
```
