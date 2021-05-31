---
'providence-analytics': minor
'@lion/accordion': minor
'@lion/button': minor
'@lion/calendar': minor
'@lion/checkbox-group': minor
'@lion/collapsible': minor
'@lion/combobox': minor
'@lion/core': minor
'@lion/dialog': minor
'@lion/form': minor
'@lion/form-core': minor
'@lion/form-integrations': minor
'@lion/helpers': minor
'@lion/icon': minor
'@lion/input': minor
'@lion/input-amount': minor
'@lion/input-datepicker': minor
'@lion/input-iban': minor
'@lion/input-stepper': minor
'@lion/listbox': minor
'@lion/localize': minor
'@lion/overlays': minor
'@lion/pagination': minor
'@lion/progress-indicator': minor
'@lion/radio-group': minor
'@lion/select': minor
'@lion/select-rich': minor
'@lion/steps': minor
'@lion/switch': minor
'@lion/tabs': minor
'@lion/textarea': minor
'@lion/tooltip': minor
'@lion/validate-messages': minor
---

**BREAKING** Upgrade to [lit](https://lit.dev/) version 2

This does not change any of the public APIs of lion.
It however effects you when you have your own extension layer or your own components especially when using directives.
See the [official lit upgrade guide](https://lit.dev/docs/releases/upgrade/).

**BREAKING** Upgrade to [ScopedElements](https://open-wc.org/docs/development/scoped-elements/) version 2

This version of `@open-wc/scoped-elements` is now following the [Scoped Custom Element Registries](https://github.com/WICG/webcomponents/blob/gh-pages/proposals/Scoped-Custom-Element-Registries.md) and automatically loads a polyfill [@webcomponents/scoped-custom-element-registry](https://github.com/webcomponents/polyfills/tree/master/packages/scoped-custom-element-registry).

This means tag names are no longer being rewritten with a hash.

```js
import { css, LitElement } from 'lit';
import { ScopedElementsMixin } from '@open-wc/scoped-elements';
import { MyButton } from './MyButton.js';

export class MyElement extends ScopedElementsMixin(LitElement) {
  static get scopedElements() {
    return {
      'my-button': MyButton,
    };
  }

  render() {
    return html` <my-button>click me</my-button> `;
  }
}
```

```html
<!-- before (ScopedElements 1.x) -->
<my-element>
  #shadow-root
  <my-button-23243424>click me</my-button-23243424>
</my-element>

<!-- after (ScopedElements 2.x) -->
<my-element>
  #shadow-root
  <my-button>click me</my-button>
</my-element>
```
