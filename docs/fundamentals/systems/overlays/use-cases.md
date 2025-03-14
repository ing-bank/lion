---
parts:
  - Use Cases
  - Overlays
  - Systems
title: 'Overlays: Use Cases'
eleventyNavigation:
  key: Systems >> Overlays >> Use Cases
  title: Use Cases
  order: 20
  parent: Systems >> Overlays
---

# Systems >> Overlays >> Use Cases ||20

```js script
import { html, render, LitElement } from '@mdjs/mdjs-preview';
import { renderLitAsNode } from '@lion/ui/helpers.js';
import {
  ArrowMixin,
  OverlayMixin,
  withBottomSheetConfig,
  withDropdownConfig,
  withModalDialogConfig,
} from '@lion/ui/overlays.js';

import './assets/demo-el-using-overlaymixin.mjs';
import './assets/demo-overlay-backdrop.mjs';
import './assets/applyDemoOverlayStyles.mjs';
import { ref, createRef } from 'lit/directives/ref.js';
```

The overlay system allows to create different types of overlays like dialogs, toasts, tooltips, dropdown, etc.
It's designed to be highly flexible, while still delivering sensible defaults.
On top of this, the system was built having accessibility in mind.

For a detailed rationale, please consult [Rationale](./rationale.md).

```js preview-story
export const main = () => html`
  <demo-el-using-overlaymixin>
    <button slot="invoker">Click me to open the overlay!</button>
    <div slot="content" class="demo-overlay">
      Hello! You can close this notification here:
      <button
        @click="${e => e.target.dispatchEvent(new Event('close-overlay', { bubbles: true }))}"
      >
        ⨯
      </button>
    </div>
  </demo-el-using-overlaymixin>
`;
```

## OverlayController

OverlayController is the single class we instantiate whenever creating an overlay instance.
Based on provided config, it will handle:

- DOM position (local vs global)
- positioning logic
- accessibility
- interaction patterns

and has the following public functions:

- **show()**, to show the overlay
- **hide()**, to hide the overlay
- **toggle()**, to toggle between show and hide

All overlays contain an invokerNode and a contentNode

- **contentNode**, the toggleable content of the overlay.
- **invokerNode**, the element toggles the visibility of the content. For local overlays, this is the relative element the content is positioned to

> Make sure you pass a DOM-connected contentNode, an offline rendered (e.g. with just `document.createElement` or `renderLitAsNode`) will not work, because then we cannot determine the renderTarget to render the content to.

For DOM position, local refers to overlays where the content is positioned next to the invokers they are related to, DOM-wise.
Global refers to overlays where the content is positioned in a global root node at the bottom of `<body>`.

## Configuration

Overlays can be configured in many ways to suit your needs. We go in-depth into each option in the Overlay System - Configuration chapter.

We also export a few [preset configuration objects](./configuration.md).

- withModalDialogConfig
- withDropdownConfig
- withBottomSheetConfig

You import these using ES Modules, and then simply call them inside your `OverlayController` instantiation:

```js
const ctrl = new OverlayController({
  ...withModalDialogConfig(),
  invokerNode,
  contentNode,
});
```

or in your Web Component with `OverlayMixin`, make sure you override these methods to:

- Define configuration
- Handle setting up event listeners of toggling the opened state of your overlay
- Handle the tearing down of those event listeners
- Define a template which includes:
  - invoker slot for your user to provide the invoker node (the element that invokes the overlay content)
  - content slot for your user to provide the content that shows when the overlay is opened,
    make sure to put it inside a div with id `overlay-content-node-wrapper` which is necessary for positioning logic to work properly.

```js
_defineOverlayConfig() {
  return {
    ...withModalDialogConfig
  };
}

_setupOpenCloseListeners() {
  super._setupOpenCloseListeners();
  this.__toggle = () => {
    this.opened = !this.opened;
  };

  if (this._overlayInvokerNode) {
    this._overlayInvokerNode.addEventListener('click', this.__toggle);
  }
}

_teardownOpenCloseListeners() {
  super._teardownOpenCloseListeners();

  if (this._overlayInvokerNode) {
    this._overlayInvokerNode.removeEventListener('click', this.__toggle);
  }
}

render() {
  return html`
    <slot name="invoker"></slot>
    <div id="overlay-content-node-wrapper">
      <slot name="content"></slot>
    </div>
  `;
}
```

or declaratively in your template with the `.config` property

```jsx
<demo-el-using-overlaymixin .config="${{ ...withModalDialogConfig() }}">
  <button slot="invoker">Click me to open the overlay!</button>
  <div slot="content" class="demo-overlay">
    Hello! You can close this notification here:
    <button @click="${e => e.target.dispatchEvent(new Event('close-overlay', { bubbles: true }))}">
    </button>
  </div>
</demo-el-using-overlaymixin>
```

### Backdrop

There are multiple ways to pass a backdrop node for your overlay.

The easiest way is declarative. This can be achieved by adding a `<slot name="backdrop">` to your `render` method. The component user can then insert a backdrop slottable declaratively:

```js preview-story
export const backdrop = () => {
  const responsiveModalDialogConfig = { ...withModalDialogConfig() };
  return html`
    <demo-el-using-overlaymixin .config="${responsiveModalDialogConfig}">
      <demo-overlay-backdrop slot="backdrop"></demo-overlay-backdrop>
      <button slot="invoker">Click me to open the overlay!</button>
      <div slot="content" class="demo-overlay">
        Hello! You can close this notification here:
        <button
          @click="${e => e.target.dispatchEvent(new Event('close-overlay', { bubbles: true }))}"
        >
          ⨯
        </button>
      </div>
    </demo-el-using-overlaymixin>
  `;
};
```

You can also pass a backdropNode imperatively to the OverlayConfig. Either use `hasBackdrop: true`, which will spawn a default `backdropNode`.
For more control, pass a `backdropNode` yourself, e.g. a webcomponent so you can easily encapsulate styles.

```js preview-story
export const backdropImperative = () => {
  const backdropNode = document.createElement('demo-overlay-backdrop');
  const responsiveModalDialogConfig = { ...withModalDialogConfig(), backdropNode };
  return html`
    <demo-el-using-overlaymixin .config="${responsiveModalDialogConfig}">
      <button slot="invoker">Click me to open the overlay!</button>
      <div slot="content" class="demo-overlay">
        Hello! You can close this notification here:
        <button
          @click="${e => e.target.dispatchEvent(new Event('close-overlay', { bubbles: true }))}"
        >
          ⨯
        </button>
      </div>
    </demo-el-using-overlaymixin>
  `;
};
```

#### Backdrop animation

By default our overlay system comes with a backdrop animation.
This will add `overlays__backdrop--animation-in` and `overlays__backdrop--animation-out` classes to your backdrop node.
If you have `placementMode: 'local'` it will replace those `global` strings in the CSS classes with `local`.

It expects from you that you act on these classes in your CSS with an animation. For example if you have your own backdrop webcomponent (to encapsulate styles):

```css
:host(.local-overlays__backdrop--animation-in) {
  animation: local-overlays-backdrop-fade-in 300ms;
}

:host(.local-overlays__backdrop--animation-out) {
  animation: local-overlays-backdrop-fade-out 300ms;
  opacity: 0;
}

@keyframes local-overlays-backdrop-fade-in {
  from {
    opacity: 0;
  }
}

@keyframes local-overlays-backdrop-fade-out {
  from {
    opacity: 0.3;
  }
}
```

Under the hood, the OverlayController listens to `animationend` event, only then it will remove the animation-out/animation-in classes.

> If you don't intend on having a backdrop animation at all, as a subclasser you should override `transitionHide` and `transitionShow` OverlayMixin methods.
> Otherwise the `hide` will await an `animationend` event that will never happen.

```js preview-story
export const backdropAnimation = () => {
  const responsiveModalDialogConfig = { ...withModalDialogConfig() };
  return html`
    <demo-el-using-overlaymixin .config="${responsiveModalDialogConfig}">
      <button slot="invoker">Click me to open the overlay!</button>
      <demo-overlay-backdrop slot="backdrop"></demo-overlay-backdrop>
      <div slot="content" class="demo-overlay">
        Hello! You can close this notification here:
        <button
          @click="${e => e.target.dispatchEvent(new Event('close-overlay', { bubbles: true }))}"
        >
          ⨯
        </button>
      </div>
    </demo-el-using-overlaymixin>
  `;
};
```

### Responsive switching

Currently we support switching between overlay configurations.
Keep in mind however that we do not yet support switching between overlay configurations while the content is shown.
If you try, it will close the content if it is open, and the user will need to re-open.
Will be supported in the near future.

This can be done declaratively as shown below.
Drag the viewport under 600px and open the overlay to see the `withBottomSheetConfig` applied.

```js preview-story
export const responsiveSwitching = () => {
  const responsiveBottomSheetConfig = { ...withBottomSheetConfig() };
  return html`
    <demo-el-using-overlaymixin
      .config="${responsiveBottomSheetConfig}"
      @before-opened=${e => {
        if (window.innerWidth >= 600) {
          e.target.config = { ...withModalDialogConfig() };
        } else {
          e.target.config = { ...withBottomSheetConfig() };
        }
      }}
    >
      <button slot="invoker">Click me to open the overlay!</button>
      <div slot="content" class="demo-overlay">
        Hello! You can close this notification here:
        <button
          @click="${e => e.target.dispatchEvent(new Event('close-overlay', { bubbles: true }))}"
        >
          ⨯
        </button>
      </div>
    </demo-el-using-overlaymixin>
  `;
};
```

Alternative ways to do it is by setting the event listener manually on the `OverlayController` instance.

```js
myOverlayCtrl.addEventListener('before-show', () => {
  if (window.innerWidth >= 600) {
    ctrl.updateConfig(withModalDialogConfig());
  } else {
    ctrl.updateConfig(withBottomSheetConfig());
  }
});
```

Or inside of a Web Component that uses the `OverlayMixin`, by overriding protected method `_defineOverlay`,
where we can access the OverlayController instance and use the `updateConfig` method on the controller:

```js
_defineOverlay({ invokerNode, contentNode }) {

  // initial
  const ctrl = new OverlayController({
    ...withBottomSheetConfig(),
    hidesOnOutsideClick: true,
    invokerNode,
    contentNode,
  });

  // responsive
  ctrl.addEventListener('before-show', () => {
    if (window.innerWidth >= 600) {
      ctrl.updateConfig(withModalDialogConfig());
    } else {
      ctrl.updateConfig(withBottomSheetConfig());
    }
  });

  return ctrl;
```

Below is another demo where you can toggle between configurations using buttons.

```js preview-story
export const responsiveSwitching2 = () => {
  const overlayRef = createRef();
  const selectRef = createRef();

  const getConfig = selectValue => {
    switch (selectValue) {
      case 'modaldialog':
        return { ...withModalDialogConfig(), hasBackdrop: true };
      case 'bottomsheet':
        return { ...withBottomSheetConfig() };
      case 'dropdown':
        return { ...withDropdownConfig(), hasBackdrop: false, inheritsReferenceWidth: true };
      default:
        return { ...withModalDialogConfig(), hasBackdrop: true };
    }
  };
  const onSelectChange = e => {
    overlayRef.value.config = getConfig(e.target.value);
  };

  return html`
    <style>
      .demo-overlay {
        background-color: white;
        border: 1px solid black;
      }
    </style>
    Change config to:

    <select ${ref(selectRef)} @change="${onSelectChange}">
      <option value="modaldialog">Modal Dialog</option>
      <option value="bottomsheet">Bottom Sheet</option>
      <option value="dropdown">Dropdown</option>
    </select>

    <br />
    <demo-el-using-overlaymixin ${ref(overlayRef)} .config="${getConfig(selectRef.value?.value)}">
      <button slot="invoker">Click me to open the overlay!</button>
      <div slot="content" class="demo-overlay">
        Hello! You can close this notification here:
        <button
          @click="${e => e.target.dispatchEvent(new Event('close-overlay', { bubbles: true }))}"
        >
          ⨯
        </button>
      </div>
    </demo-el-using-overlaymixin>
  `;
};
```

## Opened state

For any overlay that implements the OverlayMixin, there is a Boolean property `opened` that reflects whether the overlay content is displayed or not.

You can also listen to the event `opened-changed` which is fired whenever `opened` is toggled. This can be useful e.g. if somewhere in your application you need to rely on this "state".

```js preview-story
export const openedState = () => {
  const appState = {
    opened: false,
  };
  const myRefs = {
    overlay: createRef(),
    openedState: createRef(),
  };
  function onOpenClosed(ev) {
    appState.opened = ev.target.opened;
    myRefs.openedState.value.innerText = appState.opened;
  }
  return html`
    appState.opened: <span ${ref(myRefs.openedState)}>${appState.opened}</span>
    <demo-el-using-overlaymixin
      ${ref(myRefs.overlay)}
      .opened="${appState.opened}"
      @opened-changed="${onOpenClosed}"
    >
      <button slot="invoker">Overlay</button>
      <div slot="content" class="demo-overlay">
        Hello! You can close this notification here:
        <button
          @click="${e => e.target.dispatchEvent(new Event('close-overlay', { bubbles: true }))}"
        >
          ⨯
        </button>
      </div>
    </demo-el-using-overlaymixin>
  `;
};
```

## Intercepting open/close

It is possible to intercept the open/close process by calling `.preventDefault()` on
the `before-closed` or `before-opened` events.

```js preview-story
export const interceptingOpenClose = () => {
  // Application code
  let blockOverlay = true;
  const myRefs = {
    statusButton: createRef(),
    overlay: createRef(),
  };
  function intercept(ev) {
    if (blockOverlay) {
      ev.preventDefault();
    }
  }
  return html`
    Overlay blocked state:
    <button
      ${ref(myRefs.statusButton)}
      @click="${() => {
        blockOverlay = !blockOverlay;
        myRefs.statusButton.value.textContent = blockOverlay;
      }}"
    >
      ${blockOverlay}
    </button>
    <demo-el-using-overlaymixin
      ${ref(myRefs.overlay)}
      @before-closed="${intercept}"
      @before-opened="${intercept}"
    >
      <button
        slot="invoker"
        @click=${() =>
          console.log('blockOverlay', blockOverlay, 'opened', myRefs.overlay.value.opened)}
      >
        Overlay
      </button>
      <div slot="content" class="demo-overlay">
        Hello! You can close this notification here:
        <button @click="${() => (myRefs.overlay.value.opened = false)}">⨯</button>
      </div>
    </demo-el-using-overlaymixin>
  `;
};
```

## OverlayMixin

OverlayMixin is a mixin anyone can use to create a Web Component which has a `content node` (`slot="content"`) and `invoker node` (`slot="invoker"`).

Under the hood, the `OverlayMixin` will instantiate an OverlayController with these nodes.

By default, there are only a few `OverlayMixin` methods you need to override to create a working Web Component using an overlay:

- `render`, the template needs to include a `<slot name="invoker">` and `<slot name="content">` inside a div with id `overlay-content-node-wrapper` (for positioning).
- `_defineOverlayConfig`, in this protected method, return an object that contains the default configuration for your Web Component's overlay. See configuration section of OverlayController.
- `_setupOpenCloseListeners`, use this lifecycle hook to setup the open and close event listeners on your `_overlayInvokerNode`.
- `_teardownOpenCloseListeners`, use this lifecycle hook to ensure that the listeners are removed when the OverlayController is tearing down. For example when the Web Component is disconnected from the DOM.

```js
import { LitElement } from '@mdjs/mdjs-preview';
import { OverlayMixin } from '@lion/ui/overlays.js';

class MyOverlayWC extends OverlayMixin(LitElement) {
  _defineOverlayConfig() {
    return {
      placementMode: 'global',
      hasBackdrop: true,
    };
  }

  _setupOpenCloseListeners() {
    super._setupOpenCloseListeners();
    this.__toggle = () => {
      // opened is the public boolean property to use in the WC for opening/closing
      this.opened = !this.opened;
    };

    // Always guard this, because your user may toggle the opened state through something else (e.g. event) and not an invoker node.
    if (this._overlayInvokerNode) {
      this._overlayInvokerNode.addEventListener('click', this.__toggle);
    }
  }

  _teardownOpenCloseListeners() {
    super._teardownOpenCloseListeners();

    if (this._overlayInvokerNode) {
      this._overlayInvokerNode.removeEventListener('click', this.__toggle);
    }
  }

  render() {
    return html`
      <slot name="invoker"></slot>
      <div id="overlay-content-node-wrapper">
        <slot name="content"></slot>
      </div>
    `;
  }
}
```

## OverlaysManager

The `OverlaysManager` is a global registry keeping track of all different types of overlays. The need for a global housekeeping mainly arises when multiple overlays are opened simultaneously.

For example, you may have a modal dialog that opens another modal dialog. The second dialog needs to block the first. When the second dialog is closed, the first one is available again.

The overlay manager keeps track of all registered overlays and controls which one to show.

Below an example is shown with the `isBlocking` option, which makes use of the OverlaysManager's capabilities.

```js preview-story
export const overlayManager = () => {
  const hasBackdropConfig = { ...withModalDialogConfig(), hasBackdrop: true };
  return html`
    <demo-el-using-overlaymixin .config="${hasBackdropConfig}">
      <button slot="invoker">Click me to open the overlay!</button>
      <div slot="content" class="demo-overlay">
        Hello! You can close this notification here:
        <button
          @click="${e => e.target.dispatchEvent(new Event('close-overlay', { bubbles: true }))}"
        >
          ⨯
        </button>
        <br />
        <button @click="${e => (document.querySelector('#secondOverlay').opened = true)}">
          Click me to open another overlay which is blocking
        </button>
      </div>
    </demo-el-using-overlaymixin>
    <demo-el-using-overlaymixin
      id="secondOverlay"
      .config="${{ ...withModalDialogConfig(), hasBackdrop: true, isBlocking: true }}"
    >
      <div slot="content" class="demo-overlay demo-overlay--second">
        Hello! You can close this notification here:
        <button
          @click="${e => e.target.dispatchEvent(new Event('close-overlay', { bubbles: true }))}"
        >
          ⨯
        </button>
      </div>
    </demo-el-using-overlaymixin>
  `;
};
```

## Local Backdrop

We provide a possibility to add a backdrop to a locally placed overlay.
You can pass your backdropNode as a configuration parameter and control its styling reacting upon OverlayController events.
Here is the example below

```js preview-story
export const localBackdrop = () => {
  const localBackdropConfig = { ...withDropdownConfig() };
  return html`
    <demo-el-using-overlaymixin .config="${localBackdropConfig}">
      <demo-overlay-backdrop slot="backdrop"></demo-overlay-backdrop>
      <button slot="invoker">Click me to open the overlay!</button>
      <div slot="content" class="demo-overlay">
        Hello! You can close this notification here:
        <button
          @click="${e => e.target.dispatchEvent(new Event('close-overlay', { bubbles: true }))}"
        >
          ⨯
        </button>
      </div>
    </demo-el-using-overlaymixin>
  `;
};
```

### Nested Overlays

Overlays can be nested, as the demo below shows.
It's also possible to compose a nested construction by moving around dom nodes.

```js preview-story
export const nestedOverlays = () => {
  return html`
    <demo-el-using-overlaymixin .config="${withModalDialogConfig()}">
      <div slot="content" id="mainContent" class="demo-overlay">
        open nested overlay:
        <demo-el-using-overlaymixin .config="${withModalDialogConfig()}">
          <div slot="content" id="nestedContent" class="demo-overlay">
            Nested content
            <button
              @click="${e => e.target.dispatchEvent(new Event('close-overlay', { bubbles: true }))}"
            >
              ⨯
            </button>
          </div>
          <button slot="invoker" id="nestedInvoker">nested invoker button</button>
        </demo-el-using-overlaymixin>
        <button
          @click="${e => e.target.dispatchEvent(new Event('close-overlay', { bubbles: true }))}"
        >
          ⨯
        </button>
      </div>
      <button slot="invoker" id="mainInvoker">invoker button</button>
    </demo-el-using-overlaymixin>
  `;
};
```

## Local overlay with an arrow

To add an arrow to the localOverlay you can add `ArrowMixin` to your component.
And add the `arrowPopperConfig` to the `_defineOverlayConfig`.

```js preview-story
export const LocalWithArrow = () => {
  const placementRightConfig = { popperConfig: { placement: 'right' } };
  const placementBottomConfig = { popperConfig: { placement: 'bottom' } };
  const placementLeftConfig = { popperConfig: { placement: 'left' } };
  class ArrowExample extends ArrowMixin(OverlayMixin(LitElement)) {
    _defineOverlayConfig() {
      return {
        ...super._defineOverlayConfig(),
        popperConfig: {
          ...super._defineOverlayConfig().popperConfig,
          placement: 'top',
        },
      };
    }

    _setupOpenCloseListeners() {
      super._setupOpenCloseListeners();
      if (this._overlayInvokerNode) {
        this._overlayInvokerNode.addEventListener('click', this.toggle);
      }
    }

    _teardownOpenCloseListeners() {
      super._teardownOpenCloseListeners();
      if (this._overlayInvokerNode) {
        this._overlayInvokerNode.removeEventListener('click', this.toggle);
      }
    }
  }
  if (!customElements.get('arrow-example')) {
    customElements.define('arrow-example', ArrowExample);
  }
  return html`
    <style>
      .demo-box-placements {
        display: flex;
        flex-direction: column;
        margin: 40px 0 0 200px;
      }
      .demo-box-placements arrow-example {
        margin: 20px;
      }
    </style>
    <div class="demo-box-placements">
      <arrow-example>
        <button slot="invoker">Top</button>
        <div slot="content">This is a tooltip with an arrow</div>
      </arrow-example>
      <arrow-example .config="${placementRightConfig}">
        <button slot="invoker">Right</button>
        <div slot="content">This is a tooltip with an arrow</div>
      </arrow-example>
      <arrow-example .config="${placementBottomConfig}">
        <button slot="invoker">Bottom</button>
        <div slot="content">This is a tooltip with an arrow</div>
      </arrow-example>
      <arrow-example .config="${placementLeftConfig}">
        <button slot="invoker">Left</button>
        <div slot="content">This is a tooltip with an arrow</div>
      </arrow-example>
    </div>
  `;
};
```
