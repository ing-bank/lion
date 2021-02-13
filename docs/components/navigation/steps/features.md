# Navigation >> Steps >> Features || 20

```js script
import { html } from '@lion/core';
import '@lion/steps/lion-step.js';
import '@lion/steps/lion-steps.js';
```

```js preview-story
export const main = () => html`
  <lion-steps>
    <lion-step initial-step>
      <p>Welcome</p>
      <button disabled>previous</button> &nbsp;
      <button type="button" @click=${ev => ev.target.parentElement.controller.next()}>Next</button>
    </lion-step>
    <lion-step>
      <p>Are you single?</p>
      <button
        type="button"
        @click=${ev => {
          ev.target.parentElement.controller.data.isSingle = true;
          ev.target.parentElement.controller.next();
        }}
      >
        Yes
      </button>
      &nbsp;
      <button
        type="button"
        @click=${ev => {
          ev.target.parentElement.controller.data.isSingle = false;
          ev.target.parentElement.controller.next();
        }}
      >
        No
      </button>
      <br /><br />
      <button type="button" @click=${ev => ev.target.parentElement.controller.previous()}>
        Previous
      </button>
    </lion-step>
    <lion-step id="is-single" .condition="${data => data.isSingle}">
      <p>You are single</p>
      <button type="button" @click=${ev => ev.target.parentElement.controller.previous()}>
        Previous
      </button>
      &nbsp;
      <button type="button" @click=${ev => ev.target.parentElement.controller.next()}>Next</button>
    </lion-step>
    <lion-step id="is-not-single" .condition="${data => data.isSingle}" invert-condition>
      <p>You are NOT single.</p>
      <button type="button" @click=${ev => ev.target.parentElement.controller.previous()}>
        Previous
      </button>
      &nbsp;
      <button type="button" @click=${ev => ev.target.parentElement.controller.next()}>Next</button>
    </lion-step>
    <lion-step>
      <p>Finish</p>
      <button type="button" @click=${ev => ev.target.parentElement.controller.previous()}>
        Previous
      </button>
    </lion-step>
  </lion-steps>
`;
```

## Define steps

We provide two components: `lion-steps` and `lion-step`. Steps need to be direct children of `lion-steps`.

```html
<lion-steps>
  <lion-step initial-step>Step 1</lion-step>
  <lion-step>Step 2</lion-step>
  <lion-step>......</lion-step>
  <lion-step>Step N</lion-step>
</lion-steps>
```

The first step needs to be explicitly set via `initial-step` so that it get status `entered`, while others are `untouched` by default. You can navigate between steps using `next()` and `previous()` methods, so that next step gets `entered` status, while previous one becomes `left`:

```js
next() {
  return this.shadowRoot.getElementById('steps').next();
}

previous() {
  return this.shadowRoot.getElementById('steps').previous();
}
```

## Conditions

You can provide a condition to a step (with or without `invert-condition` emulating if-else flow):

```html
<lion-steps data="[[data]]">
  <lion-step>...</lion-step>
  <lion-step>step where `data.smth` is set</lion-step>
  <lion-step condition="myConditionFunc">if</lion-step>
  <lion-step condition="myConditionFunc" invert-condition>else</lion-step>
  <lion-step>...</lion-step>
</lion-steps>

<script>
  // you have `data` property defined in the scope
  ...
  myConditionFunc(data) {
    return data.smth === "what-you-need";
  }
  ...
</script>
```

If a condition was not met a step gets a status `skipped`.

## Forward only steps

If you have an intermediate step loading data via AJAX request and then automatically calling `next()`, you can flag it as `forward-only`. This will ensure that navigation to previous step is possible and does not lead to another AJAX request which leads to next step again breaking flow for a user.

```html
<lion-steps>
  <lion-step>preliminary step</lion-step>
  <lion-step forward-only>data is loaded and next() is called automatically afterwards</lion-step>
  <!-- user decides to go to previous step here -->
  <lion-step>do smth with data</lion-step>
</lion-steps>
```

## Events

If you need to be notified when transition between steps happens use `transition` event providing steps data:

```html
<lion-steps @transition="${onTransition}">
  <lion-step>Step 1</lion-step>
  <lion-step>Step 2</lion-step>
  <lion-step>Step 3</lion-step>
</lion-steps>

<script>
  ...
  onTransition(event) {
    console.log(event.detail.fromStep.number); // Number
    console.log(event.detail.fromStep.element); // <lion-step>
    console.log(event.detail.toStep.number); // Number
    console.log(event.detail.toStep.element); // <lion-step>
  }
  ...
</script>
```

For notifications about specific step status change you can use individual events like this:

```html
<lion-steps>
  <lion-step @leave="${onLeave}">Step 1</lion-step>
  <lion-step @skip="${onSkip}">Step 2</lion-step>
  <lion-step @enter="${onEnter}">Step 3</lion-step>
</lion-steps>
```
