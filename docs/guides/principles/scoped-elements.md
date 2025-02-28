---
parts:
  - Principles
  - Scoped Elements
title: 'Principles: Scoped Elements'
eleventyNavigation:
  key: 'Principles: Scoped Elements'
  order: 40
  parent: Principles
  title: Scoped Elements
---
# Principles: Scoped Elements

The [CustomElementRegistry](https://developer.mozilla.org/en-US/docs/Web/API/CustomElementRegistry) provides methods for registering custom elements. One of the limitations of working with this global registry is that multiple versions of the same element cannot co-exist. This causes bottlenecks in software delivery that should be managed by the teams and complex build systems. [Scoped Custom Element Registries](https://github.com/w3c/webcomponents/issues/716) is a proposal that will solve the problem. Since this functionality won't be available (especially not cross browser) anytime soon, we've adopted [OpenWC's Scoped Elements](https://open-wc.org/docs/development/scoped-elements/).

Whenever a lion component uses composition (meaning it uses another lion component inside), we
apply ScopedElementsMixin to make sure it uses the right version of this internal component.

```js
import { LitElement, html } from '@lion/ui/core.js';
import { ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { html, LitElement } from 'lit';

import { LionInput } from '@lion/ui/input.js';
import { LionButton } from '@lion/ui/button.js';

class MyElement extends ScopedElementsMixin(LitElement) {
  static get scopedElements() {
    return {
      'lion-input': LionInput,
      'lion-button': LionButton,
    };
  }

  render() {
    return html`
      <lion-input label="Greeting" name="greeting" .modelValue="${'Hello world'}"></lion-input>
      <lion-button>Save</lion-button>
    `;
  }
}
```

## Polyfill

This package requires use of the Scoped Custom Element Registry polyfill. Make sure to load it as the first thing in your application:

```js
import '@webcomponents/scoped-custom-element-registry';
```

If you're using `@web/rollup-plugin-polyfills-loader`, you can use it in your rollup config like this:

```js
polyfillsLoader({
  polyfills: {
    scopedCustomElementRegistry: true,
  },
});
```

If you're using `@web/dev-server` for local development, you can use the `@web/dev-server-polyfill` plugin:

```js
polyfill({
  scopedCustomElementRegistry: true,
});
```

## Edge cases

Sometimes we need to render parts of a template to light dom for [accessibility](https://wicg.github.io/aom/explainer.html). For instance we render a node via `lit-html` that we append to the host element, so it gets slotted in the right position.
In this case, we should also make sure that we also scope the rendered element.

We can do this as follows:

```js
_myLightTemplate() {
  return html`
    This template may be overridden by a Subclasser.
    Even I don't end up in shadow root, I need to be scoped to constructor.scopedElements as well.
    <div>
      <lion-button>True</lion-button>
      <lion-input label="xyz"></lion-input>
    </div>
  `;
}

__getLightDomNode() {
  const renderParent = document.createElement('div');
  this.constructor.render(this._myLightTemplate(), renderParent, {
    scopeName: this.localName,
    eventContext: this,
  });
  // this node will be appended to the host
  return renderParent.firstElementChild;
}

connectedCallback() {
  super.connectedCallback();
  this.appendChild(this.__getLightDomNode());
}
```

In a less complex case, we might just want to add a child node to the dom.

```js
import { LitElement  } from 'lit';
import { ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';

...

__getLightDomNode() {
  return document.createElement('lion-input', this.constructor.scopedElements);
}
```

We encourage you to have a look at [OpenWC's Scoped elements](https://open-wc.org/docs/development/scoped-elements/).
