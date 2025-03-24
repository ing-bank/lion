# Progress Indicator >> Overview ||10

A web component that implements accessibility requirements for progress indicators.

```js script
import { html } from '@mdjs/mdjs-preview';
import '@lion/ui/define/lion-progress-indicator.js';
```

```html
<lion-progress-indicator aria-label="Interest rate" value="50"></lion-progress-indicator>
```

## Features

This component is designed to be extended in order to add visuals.

- Can be indeterminate or determinate, depending on whether it has a value.
- Accessibility compliant
- Localized "Loading" label in case of an indeterminate progress-indicator
- Implementation independent of visuals
- `value`: progress value, setting this makes the progress-indicator determinate.
- `min`: progress min value
- `max`: progress max value

## Installation

```bash
npm i --save @lion/ui
```

```js
import { LionProgressIndicator } from '@lion/ui/progress-indicator.js';
// or
import '@lion/ui/define/lion-progress-indicator.js';
```
