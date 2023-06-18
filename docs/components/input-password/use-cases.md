# Input Password >> Use Cases ||20

```js script
import { html } from '@mdjs/mdjs-preview';
import { Validator } from '@lion/ui/form-core.js';
import '@lion/ui/define/lion-input-password.js';
```

## Input counter

When prefilled with input shows current input length along with specified max length.

```js preview-story
export const inputCounter = () => html`
  <lion-input-password .modelValue=${'password'} minLength=5 maxLength=20 showVisibilityControl=true label="Password"></lion-input-password>
`;
```

## No Controls

When `showVisibilityControl` and `showCharCounter` set to false: none of controls shown.

```js preview-story
export const noControls = () => html`
    <lion-input-password .modelValue=${'password phrase'} minLength=5 maxLength=20 .showVisibilityControl=false .showCharCounter=false label="Password"></lion-input-password>
  `;
```

## Type control

When type is set to `text`: password visibility changed to visible.

```js preview-story
export const typeControl = () => html`
    <lion-input-password .modelValue=${'password phrase'} type='text' minLength=5 maxLength=20 showVisibilityControl=true label="Password"></lion-input-password>
  `;
```