[//]: # 'AUTO INSERT HEADER PREPUBLISH'

# Progress Indicator

`lion-progress-indicator` implements accessibility requirements for progress indicators.

## Features

- Accessibility compliant
- Localized "Loading" label
- Implementation independent of visuals

## How to use

### Installation

```bash
npm i --save @lion/progress-indicator
```

```js
import { LionProgressIndicator } from '@lion/progress-indicator';
// or
import '@lion/progress-indicator/lion-progress-indicator.js';
```

### Example

```html
<lion-progress-indicator></lion-progress-indicator>
```

## Basic Usage

```js preview-story
export const progressIndicator = () => html` <lion-progress-indicator></lion-progress-indicator> `;
```
