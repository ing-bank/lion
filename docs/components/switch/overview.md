# Switch >> Overview ||10

<p class="lion-paragraph--emphasis">The Switch is used to toggle a property or feature on or off.</p>

```js script
import { html as previewHtml } from '@mdjs/mdjs-preview';
import '@lion/switch/define-switch';
```

```js preview-story
import { html, LitElement, ScopedElementsMixin } from '@lion/core';
import { LionSwitch } from '@lion/switch';

class MyComponent extends ScopedElementsMixin(LitElement) {
  static get scopedElements() {
    return { 'lion-switch': LionSwitch };
  }
  render() {
    return html`<lion-switch label="Label" help-text="Help text"></lion-switch>`;
  }
}
customElements.define('my-component', MyComponent);

export const main = () => previewHtml`<my-component></my-component>`;
```

## When to use

- Toggling the component on or off has an immediate action (no confirmation by the user required).
- The Switch is typically used in setting applications.
- The Switch is not a Checkbox in disguise and can not be used as part of a form.

## Features

- Get or set the checked state (boolean) - `checked` boolean attribute
- Pre-select an option by setting the `checked` boolean attribute
- Get or set the value of the choice - `choiceValue()`

## How to use

### Code

1. Install

```bash
npm i --save @lion/switch
```

2. Use scoped registry

```js
import { html, LitElement, ScopedElementsMixin } from '@lion/core';
import { LionSwitch } from '@lion/switch';

class MyComponent extends ScopedElementsMixin(LitElement) {
  static get scopedElements() {
    return { 'lion-switch': LionSwitch };
  }
  render() {
    return html`<lion-switch></lion-switch>`;
  }
}
```

3. Use html

```html
<script type="module">
  import '@lion/switch/define-switch';
</script>

<lion-switch></lion-switch>
```
