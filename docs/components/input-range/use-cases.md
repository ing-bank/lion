---
title: 'Input Range: Use Cases'
parts:
  - Input Range
  - Use Cases
eleventyNavigation:
  key: 'Input Range: Use Cases'
  order: 20
  parent: Input Range
  title: Use Cases
---

# Input Range: Use Cases

```js script
import { html } from '@mdjs/mdjs-preview';
import '@lion/ui/define/lion-input-range.js';
```

## Units

```html preview-story
<style>
  lion-input-range {
    max-width: 400px;
  }
</style>
<lion-input-range
  min="0"
  max="100"
  .modelValue="${50}"
  unit="%"
  label="Percentage"
></lion-input-range>
```

## Steps

```html preview-story
<lion-input-range
  style="max-width: 400px;"
  min="200"
  max="500"
  step="50"
  .modelValue="${300}"
  label="Input range"
  help-text="This slider uses increments of 50"
></lion-input-range>
```

## Without Min Max Labels

```html preview-story
<lion-input-range
  style="max-width: 400px;"
  no-min-max-labels
  min="0"
  max="100"
  label="Input range"
></lion-input-range>
```

## Disabled

```html preview-story
<lion-input-range
  style="max-width: 400px;"
  disabled
  min="200"
  max="500"
  .modelValue="${300}"
  label="Input range"
></lion-input-range>
```

## Range Styles

Often, you will style your own range input by changing the pseudo-elements for the slider track and thumb.

These pseudo-elements do not play nice with `::slotted`.

As per [specification](https://drafts.csswg.org/css-scoping/#slotted-pseudo):

> The ::slotted() pseudo-element can be followed by a tree-abiding pseudo-element,
> like ::slotted()::before, representing the appropriate pseudo-element of the elements
> represented by the ::slotted() pseudo-element.

The pseudo-elements associated with the slider track/thumb are not tree-abiding, so you can't do:

```css
::slotted(.form-control)::-webkit-slider-runnable-track
```

This means you will need to style the slotted native input from the LightDOM,
and for this we added added our ScopedStylesController as a controller to `LionInputRange`.
This controller inserts a `<style>` element
that emulates scoping by generating a uniquely generated class on the LionInputRange component.
This prevents the styling from conflicting with other elements on the page.

To use it when extending, override `static scopedStyles(scope)`:

```js
class MyInputRange extends LionInputRange {
  static scopedStyles(scope) {
    return css`
      .${scope} .form-control::-webkit-slider-runnable-track {
        background-color: lightgreen;
      }
    `;
  }
}
```
