---
title: 'Extensions'
parts:
  - Input Range
  - Extensions
eleventyNavigation:
  key: 'Input Range: Extensions'
  order: 40
  parent: Input Range
  title: Extensions
---

# Extensions

This page is the **extension surface**: adding your own tag name, branding or styling, or overriding
a protected hook. An app developer composing `lion-input-range` in the regular consumption flow does
not need any of it.

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
