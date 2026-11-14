---
title: 'Examples'
parts:
  - Progress Indicator
  - Examples
eleventyNavigation:
  key: 'Progress Indicator: Examples'
  order: 30
  parent: Progress Indicator
  title: Examples
---

# Examples

```js script
import { html } from '@mdjs/mdjs-preview';
import '@lion/ui/define/lion-progress-indicator.js';
import './assets/my-indeterminate-progress-spinner.js';
import './assets/my-determinate-progress-bar.js';

const changeProgress = () => {
  const progressBar = document.getElementsByName('my-bar')[0];
  progressBar.value = Math.floor(Math.random() * 101);
};
```

## Showing progress without extending

You do not have to extend `LionProgressIndicator` to show progress. The element renders the accessible
progressbar itself — role, `aria-valuenow`/`aria-valuemin`/`aria-valuemax`, and a localized "Loading"
label while it is indeterminate — and reads its value from the `value`, `min` and `max` attributes.
Use the plain element when the built-in behaviour is enough, and reach for an extended class (below)
only when you need custom visuals.

```js preview-story
export const plainDeterminate = () => html`
  <lion-progress-indicator aria-label="Interest rate" value="50"></lion-progress-indicator>
`;

export const plainIndeterminate = () => html`
  <lion-progress-indicator aria-label="Loading"></lion-progress-indicator>
`;
```

See `extensions.md` for the styled examples: those extend `LionProgressIndicator`, which is a different job from showing progress as a consumer.
