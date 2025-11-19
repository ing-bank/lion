---
title: 'Select: Use Cases'
parts:
  - Select
  - Use Cases
eleventyNavigation:
  key: 'Select: Use Cases'
  order: 20
  parent: Select
  title: Use Cases
---

# Select: Use Cases

```js script
import { html } from '@mdjs/mdjs-preview';
import { Required } from '@lion/ui/form-core.js';
import { loadDefaultFeedbackMessages } from '@lion/ui/validate-messages.js';
import '@lion/ui/define/lion-select.js';
loadDefaultFeedbackMessages();
```

## Pre-select

You can preselect an option by setting the property modelValue.

```html preview-story
<lion-select name="favoriteColor" label="Favorite color" .modelValue="${'hotpink'}">
  <select slot="input">
    <option selected value>Please select</option>
    <option value="red">Red</option>
    <option value="hotpink">Hotpink</option>
    <option value="teal">Teal</option>
  </select>
</lion-select>
```

## Disabled

You can disable an option by adding the `disabled` attribute to an option.

```html preview-story
<lion-select name="favoriteColor" label="Favorite color">
  <select slot="input">
    <option selected value>Please select</option>
    <option value="red">Red</option>
    <option value="hotpink" disabled>Hotpink</option>
    <option value="teal">Teal</option>
  </select>
</lion-select>
```

Or by setting the `disabled` attribute on the entire `lion-select` field.

```html preview-story
<lion-select name="favoriteColor" label="Favorite color" disabled>
  <select slot="input">
    <option selected value>Please select</option>
    <option value="red">Red</option>
    <option value="hotpink">Hotpink</option>
    <option value="teal">Teal</option>
  </select>
</lion-select>
```

## Validation

A validator can be used to make it e.g. `required`. If you want to know how to do that, please take a look at our [validation examples](../../fundamentals/systems/form/validate.md).

## Rendering and updating select options

A very common pattern is to keep the options in an array, and render them through a repeating template.

```js
import { html, LitElement } from 'lit';

class MyOptions extends LitElement {
  static properties = {
    colours: Array,
  };

  constructor() {
    super();

    this.colours = ['red', 'hotpink', 'teal'];
  }

  render() {
    return html`
      <lion-select name="favoriteColor" label="Favorite color" disabled>
        <select slot="input">
          <option selected value>Please select</option>
          ${this.colours.map(colour => html`<option value="${colour}">${colour}</option>`)}
        </select>
      </lion-select>
    `;
  }
}
```

Using the above method to build repeating templates is usually efficient. However, there are cases where you might want to update the list of options after an option has already been selected.

For example, if we add a button to sort the array alphabetically, pressing it would update the list. However, the selected state and index would not reset or update accordingly.

Lit is intelligent and updates the DOM with minimal effort. During a rerender, it only updates the values inside the template and doesn't check state values outside the template, such as the selected item from the parent element.

So, if the first option was selected, the newly selected option would be whatever ends up in that position after sorting. This creates a confusing user experience where a seemingly random value is selected.

The Lit `repeat` directive fixes this problem by attaching a unique ID to each DOM element using an item as the identifier, `colour` in our example. Any changes will then result in a complete rerender or reordering of the DOM nodes, rather than just changing the values of those nodes.

```js
import { repeat } from 'lit/directives/repeat.js';

render() {
  return html`
    <lion-select name="favoriteColor" label="Favorite color" disabled>
      <select slot="input">
        <option selected value>Please select</option>
        ${repeat(
          this.colours,
          (colour) => colour,
          (colour, index) => html`<option value="${colour}">${colour}</option>`
        )}
      </select>
    </lion-select>
  `;
}
```
