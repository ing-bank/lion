---
title: 'Examples'
parts:
  - Select Rich
  - Examples
eleventyNavigation:
  key: 'Select Rich: Examples'
  order: 30
  parent: Select Rich
  title: Examples
---

# Examples

```js script
import { html } from '@mdjs/mdjs-preview';
import '@lion/ui/define/lion-select-rich.js';
import '@lion/ui/define/lion-option.js';
```

## Plain select-rich

You do not have to extend `LionSelectRich` to use it: the element renders the invoker and the option
list itself. Put `<lion-option>` elements in the light DOM and it behaves like a native `<select>`
with fully customizable options and invoker.

```html preview-story
<lion-select-rich name="favoriteColor" label="Favorite color">
  <lion-option .choiceValue="${'red'}">Red</lion-option>
  <lion-option .choiceValue="${'hotpink'}">Hotpink</lion-option>
  <lion-option .choiceValue="${'blue'}">Blue</lion-option>
</lion-select-rich>
```

See `extensions.md` for the international example: that one extends `LionSelectRich`, which is a
different job from using select-rich as a consumer.
