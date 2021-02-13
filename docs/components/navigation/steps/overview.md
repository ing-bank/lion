# Navigation >> Steps >> Overview || 10

`lion-steps` breaks a single goal down into dependable sub-tasks.

```js script
import { html } from '@lion/core';
import '@lion/steps/lion-step.js';
import '@lion/steps/lion-steps.js';
```

```js preview-story
export const main = () => html`
  <lion-steps>
    <lion-step initial-step>
      Step 1
      <button type="button" @click=${ev => ev.target.parentElement.controller.next()}>Next</button>
    </lion-step>
    <lion-step>
      <button type="button" @click=${ev => ev.target.parentElement.controller.previous()}>
        Previous
      </button>
      Step 2
      <button type="button" @click=${ev => ev.target.parentElement.controller.next()}>
        Next
      </button></lion-step
    >
    <lion-step>
      <button type="button" @click=${ev => ev.target.parentElement.controller.previous()}>
        Previous
      </button>
      Step 3
    </lion-step>
  </lion-steps>
`;
```

## Features

- navigate between different steps with 'previous' and 'next' functions.
- keeps status of each step
  - untouched
  - entered
  - left
  - skipped
- options
  - **initial-step**: Set to the first step of the flow, blocks calling `previous` function.
  - **condition**: Dynamic condition, when true the step is added to the flow.
  - **invert-condition**: Inverts the condition set.

In many application you build multi-step workflows like multi-step forms where you want to split a long process into smaller steps making easier user's perception of it and making easier filling in data. The idea of this component is to provide a simple way to define such steps and transition from one to another while saving data between them and conditionally skip some steps based on the data.

## How to use

### Installation

```bash
npm i --save @lion/steps
```

```js
import { LionSteps, LionStep } from '@lion/steps';
// or
import '@lion/steps/lion-steps.js';
import '@lion/steps/lion-step.js';
```
