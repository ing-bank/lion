# Principles >> Scoped Elements ||40

The [CustomElementRegistry](https://developer.mozilla.org/en-US/docs/Web/API/CustomElementRegistry) provides methods for registering custom elements. One of the limitations of working with this global registry is that multiple versions of the same element cannot co-exist. This causes bottlenecks in software delivery that should be managed by the teams and complex build systems. [Scoped Custom Element Registries](https://github.com/w3c/webcomponents/issues/716) is a proposal that will solve the problem. Since this functionality won't be available (especially not cross browser) anytime soon, we've adopted [OpenWC's Scoped Elements](https://open-wc.org/docs/development/scoped-elements/).

Whenever a lion component uses composition (meaning it uses another lion component inside), we
apply ScopedElementsMixin to make sure it uses the right version of this internal component.

```js
import { ScopedElementsMixin, LitElement, html } from '@lion/core';

import { LionInput } from '@lion/input';
import { LionButton } from '@lion/button';

class MyElement extends ScopedElementsMixin(LitElement) {
  static get scopedElements() {
    return {
      'lion-input': LionInput,
      'lion-button': LionButton,
    };
  }

  render() {
    return html`
      <lion-input label="Greeting" name="greeting" .modelValue=${'Hello world'}></lion-input>
      <lion-button>Save</lion-button>
    `;
  }
}
```

## Query selectors

Since Scoped Elements changes tagnames under the hood, a tagname querySelector should be written like this:

```js
this.querySelector(
  this.constructor.getScopedTagName('lion-input', this.constructor.scopedElements),
);
```

## CSS selectors

Avoid tagname css selectors.
We already avoid query selectors internally in lion, but just be aware that a selector like

```css
lion-input {
  padding: 20px;
}
```

will stop working.

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
import { ScopedElementsMixin, LitElement, getScopedTagNamegetScopedTagName  } from '@lion/core';

...

__getLightDomNode() {
  return document.createElement(getScopedTagName('lion-input', this.constructor.scopedElements));
}
```

We encourage you to have a look at [OpenWC's Scoped elements](https://open-wc.org/docs/development/scoped-elements/).
