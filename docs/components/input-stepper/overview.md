# Input Stepper >> Overview ||10

A web component that enables the user to increase and decrease a numeric value by predefined range. It is a combination of two buttons and a number input field with an optional slot `after` to suffix the extra information.

```js script
import { html } from '@mdjs/mdjs-preview';
import { loadDefaultFeedbackMessages } from '@lion/ui/validate-messages.js';
import '@lion/ui/define/lion-input-stepper.js';
loadDefaultFeedbackMessages();
```

```html preview-story
<lion-input-stepper max="5" min="0" name="count">
  <label slot="label">RSVP</label>
  <div slot="help-text">Max. 5 guests</div>
</lion-input-stepper>
```

## Features

- Based on our [input](../input/overview.md).
- Set `min` and `max` value to define the range.
- Set `step` value in integer or decimal to increase and decrease the value.
- Use `ArrowUp` or `ArrowDown` to update the value.

## Installation

```bash
npm i --save @lion/ui
```

```js
import { LionInputStepper } from '@lion/ui/input-stepper.js';
// or
import '@lion/ui/define/lion-input-stepper.js';
```
