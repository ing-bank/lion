# Input Tel Dropdown >> Overview ||10

Extension of Input Tel that prefixes a dropdown list that shows all possible regions / countries.

```js script
import { html } from '@mdjs/mdjs-preview';
import '@lion/ui/define/lion-input-tel-dropdown.js';
import { loadDefaultFeedbackMessages } from '@lion/ui/validate-messages.js';
```

```js preview-story
export const main = () => {
  loadDefaultFeedbackMessages();
  return html`
    <lion-input-tel-dropdown label="Telephone number" name="phoneNumber"></lion-input-tel-dropdown>
  `;
};
```

## Features

- Extends our [input-tel](../input-tel/overview.md)
- Shows dropdown list with all possible regions
- Shows only allowed regions in dropdown list when .allowedRegions is configured
- Highlights regions on top of dropdown list when .preferredRegions is configured
- Generates template meta data for advanced

## Installation

```bash
npm i --save @lion/ui
```

```js
import { LionInputTelDropdown } from '@lion/ui/input-tel-dropdown.js';
// or
import '@lion/ui/define/lion-input-tel-dropdown.js';
```
