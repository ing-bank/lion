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
import { LionInputAmountDropdown } from '@lion/ui/input-amount-dropdown.js';
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

## Preferred currencies

When `.preferredCurrencies` is configured, they will show up on top of the dropdown list to enhance user experience.

```js preview-story
export const preferredCurrencies = () => {
  loadDefaultFeedbackMessages();
  return html`
    <lion-input-amount-dropdown
      label="Select currency via dropdown"
      help-text="Preferred currencies show on top"
      name="amount"
      .allowedCurrencies=${['EUR', 'GBP', 'USD', 'JPY']}
      .preferredCurrencies=${['USD', 'JPY']}
    ></lion-input-amount-dropdown>
  `;
};
```

## Suffix or prefix

Subclassers can decide the dropdown location via `_dropdownSlot`, this can be set to either `suffix` or `prefix`.

```js preview-story
class FooBarAmountDropdown extends LionInputAmountDropdown {
  constructor() {
    super();

    this._dropdownSlot = 'suffix';
  }
}

customElements.define('foo-bar-amount-dropdown', FooBarAmountDropdown);

export const suffixSlot = () => {
  loadDefaultFeedbackMessages();
  return html`
    <foo-bar-amount-dropdown
      label="Select region via dropdown"
      help-text="the dropdown shows in the suffix slot"
      name="amount"
    ></foo-bar-amount-dropdown>
  `;
};
```
