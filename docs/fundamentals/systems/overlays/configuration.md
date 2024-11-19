# Systems >> Overlays >> Configuration ||40

```js script
import { html as previewHtml } from '@mdjs/mdjs-preview';
import './assets/demo-el-using-overlaymixin.mjs';
import './assets/applyDemoOverlayStyles.mjs';
import { withDropdownConfig, withModalDialogConfig, withTooltipConfig } from '@lion/ui/overlays.js';
```

The `OverlayController` has many configuration options.
Using different combinations of those properties, different components like a tooltip, popover, dialog etc. can be made.
The `OverlayMixin` exposes these options via `.config`.

## placementMode

Either `'local'` or `'global'`.
This determines the DOM position of the `contentNode`, either next to the invokerNode,
or in the `overlays` container at the bottom of the `<body>`.

### Local

```js preview-story
export const placementLocal = () => {
  const placementModeLocalConfig = { ...withDropdownConfig() };
  return html`
    <style>
      .demo-overlay {
        background-color: white;
        border: 1px solid black;
      }
    </style>
    <demo-el-using-overlaymixin .config="${placementModeLocalConfig}">
      <button slot="invoker">Click me to open the local overlay!</button>
      <div slot="content" class="demo-overlay">
        Hello! You can close this notification here:
        <button
          class="close-button"
          @click="${e => e.target.dispatchEvent(new Event('close-overlay', { bubbles: true }))}"
        >
          ⨯
        </button>
      </div>
    </demo-el-using-overlaymixin>
  `;
};
```

### Global

```js preview-story
export const placementGlobal = () => {
  const placementModeGlobalConfig = { placementMode: 'global' };
  return html`
    <demo-el-using-overlaymixin .config="${placementModeGlobalConfig}">
      <button slot="invoker">Click me to open the global overlay!</button>
      <div slot="content" class="demo-overlay">
        Hello! You can close this notification here:
        <button
          class="close-button"
          @click="${e => e.target.dispatchEvent(new Event('close-overlay', { bubbles: true }))}"
        >
          ⨯
        </button>
      </div>
    </demo-el-using-overlaymixin>
  `;
};
```

## isTooltip (placementMode: 'local')

As specified in the [overlay rationale](./rationale.md) there are only two official types of overlays: dialogs and tooltips. And their main differences are:

- Dialogs have a modal option, tooltips don’t
- Dialogs have interactive content, tooltips don’t
- Dialogs are opened via regular buttons (click/space/enter), tooltips act on focus/mouseover

Since most overlays have interactive content the default is set to dialogs. To get a tooltip, you can add `isTooltip` to the config object. This only works for local placement and it also needs to have `handlesAccessibility` activated to work.

```js preview-story
export const usingTooltipConfig = () => {
  const tooltipConfig = { ...withTooltipConfig() };

  return html`
    <demo-el-using-overlaymixin id="tooltip" .config="${tooltipConfig}">
      <button slot="invoker">Hover me to open the tooltip!</button>
      <div slot="content" class="demo-overlay">Hello!</div>
    </demo-el-using-overlaymixin>
  `;
};
```

## trapsKeyboardFocus

Boolean property. When true, the focus will rotate through the **focusable elements** inside the `contentNode`.

For Modal Dialogs this is an important feature, since these are considered "their own page",
so especially from an accessibility point of view, trapping the focus inside the dialog is crucial.

You use the feature on any type of overlay.

```js preview-story
export const trapsKeyboardFocus = () => {
  const trapsKeyboardFocusConfig = { ...withDropdownConfig(), trapsKeyboardFocus: true };
  return html`
    <demo-el-using-overlaymixin .config="${trapsKeyboardFocusConfig}">
      <button slot="invoker">Click me to open the overlay!</button>
      <div slot="content" class="demo-overlay">
        <div><a href="#">A focusable anchor</a></div>
        <div><a href="#">Another focusable anchor</a></div>
        Hello! You can close this notification here:
        <button
          class="close-button"
          @click="${e => e.target.dispatchEvent(new Event('close-overlay', { bubbles: true }))}"
        >
          ⨯
        </button>
      </div>
    </demo-el-using-overlaymixin>
  `;
};
```

## hidesOnEsc

Boolean property. Will allow closing the overlay on ESC key when enabled.

```js preview-story
export const hidesOnEsc = () => {
  const hidesOnEscConfig = { ...withDropdownConfig(), hidesOnEsc: true };
  return html`
    <demo-el-using-overlaymixin .config="${hidesOnEscConfig}">
      <button slot="invoker">Click me to open the overlay!</button>
      <div slot="content" class="demo-overlay">
        Hello! You can close this notification here:
        <button
          class="close-button"
          @click="${e => e.target.dispatchEvent(new Event('close-overlay', { bubbles: true }))}"
        >
          ⨯
        </button>
      </div>
    </demo-el-using-overlaymixin>
  `;
};
```

And how it works if `hidesOnEsc` is disabled. In most cases `hidesOnOutsideEsc` needs also to be set to `false`.

```js preview-story
export const hidesOnEscFalse = () => {
  const hidesOnEscConfig = {
    ...withModalDialogConfig(),
    hidesOnEsc: false,
    hidesOnOutsideEsc: false,
  };
  return html`
    <demo-el-using-overlaymixin .config="${hidesOnEscConfig}">
      <button slot="invoker">Click me to open the overlay!</button>
      <div slot="content" class="demo-overlay">
        Hello! You can close this notification here:
        <button
          class="close-button"
          @click="${e => e.target.dispatchEvent(new Event('close-overlay', { bubbles: true }))}"
        >
          ⨯
        </button>
      </div>
    </demo-el-using-overlaymixin>
  `;
};
```

## hidesOnOutsideEsc

Boolean property. When enabled allows closing the overlay on ESC key, even when contentNode has no focus.

```js preview-story
export const hidesOnOutsideEsc = () => {
  const hidesOnEscConfig = { ...withDropdownConfig(), hidesOnOutsideEsc: true };
  return html`
    <demo-el-using-overlaymixin .config="${hidesOnEscConfig}">
      <button slot="invoker">Click me to open the overlay!</button>
      <div slot="content" class="demo-overlay">
        Hello! You can close this notification here:
        <button
          class="close-button"
          @click="${e => e.target.dispatchEvent(new Event('close-overlay', { bubbles: true }))}"
        >
          ⨯
        </button>
      </div>
    </demo-el-using-overlaymixin>
  `;
};
```

## hidesOnOutsideClick

Boolean property. Will allow closing the overlay by clicking outside the `contentNode`.

```js preview-story
export const hidesOnOutsideClick = () => {
  const hidesOnOutsideClickConfig = { ...withDropdownConfig(), hidesOnOutsideClick: true };
  return html`
    <demo-el-using-overlaymixin .config="${hidesOnOutsideClickConfig}">
      <button slot="invoker">Click me to open the overlay!</button>
      <div slot="content" class="demo-overlay">
        <label for="myInput">Clicking this label should not trigger close</label>
        <input id="myInput" />
        <button
          class="close-button"
          @click="${e => e.target.dispatchEvent(new Event('close-overlay', { bubbles: true }))}"
        >
          ⨯
        </button>
      </div>
    </demo-el-using-overlaymixin>
  `;
};
```

## contentElementToFocus

In case of an sticky element inside an overlay with a lot of content you can set `contentElementToFocus` to make sure the scrollable element gets focused.

```js preview-story
import { css, html, LitElement } from 'lit';
import { uuid } from '@lion/ui/core.js';
import { OverlayMixin } from '@lion/ui/overlays.js';

class MyOverlayFrame extends LitElement {
  static get styles() {
    return css`
      :host {
        display: flex;
        flex-direction: column;
        max-width: 600px;
        max-height: 600px;
        overflow: hidden;
        background-color: white;
        border: 1px solid black;
      }
      .header {
        display: flex;
        justify-content: space-between;
        padding: 10px;
      }
      :host ::slotted([slot='frame-content']) {
        overflow-y: auto;
        padding: 10px;
      }
    `;
  }

  get headerNode() {
    return this.querySelector('[slot="frame-header"]');
  }

  get bodyNode() {
    return this.querySelector('[slot="frame-content"]');
  }

  connectedCallback() {
    super.connectedCallback();
    const frameId = uuid();
    this.headerNode.setAttribute('id', `frame-header-${frameId}`);
    this.bodyNode.setAttribute('id', `frame-body-${frameId}`);
    this.bodyNode.setAttribute('aria-labelledby', `frame-header-${frameId}`);
    this.bodyNode.setAttribute('aria-describedby', `frame-body-${frameId}`);
  }

  render() {
    return html`
      <h1 class="header">
        <slot name="frame-header"></slot>
        <button type="button" @click="${() => this.dispatchEvent(new Event('close-overlay'))}">
          ⨯
        </button>
      </h1>
      <slot name="frame-content"></slot>
    `;
  }
}

class MyOverlay extends OverlayMixin(LitElement) {
  _defineOverlayConfig() {
    return {
      ...withModalDialogConfig(),
      contentElementToFocus: this._overlayContentNode?.bodyNode,
    };
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
customElements.define('my-overlay-frame', MyOverlayFrame);
customElements.define('my-overlay', MyOverlay);

export const contentElementToFocus = () => {
  return previewHtml`
    <my-overlay>
      <button slot="invoker">Click me to open the overlay!</button>
      <my-overlay-frame slot="content">
        <span slot="frame-header">Heading</span>
        <div slot="frame-content">
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua. Pulvinar mattis nunc sed blandit. Tellus
            elementum sagittis vitae et. Orci sagittis eu volutpat odio facilisis mauris sit amet
            massa. Scelerisque in dictum non consectetur a erat. In mollis nunc sed id semper risus
            in. Ac ut consequat semper viverra. Dignissim cras tincidunt lobortis feugiat vivamus at
            augue eget. Ultrices neque ornare aenean euismod elementum nisi. Lorem sed risus
            ultricies tristique nulla aliquet enim tortor at. Rhoncus est pellentesque elit
            ullamcorper dignissim cras tincidunt lobortis feugiat.
          </p>
          <p>
            Sagittis id consectetur purus ut faucibus pulvinar elementum integer. Ante in nibh
            mauris cursus. Et netus et malesuada fames ac turpis. Id eu nisl nunc mi ipsum. Sagittis
            orci a scelerisque purus. Placerat vestibulum lectus mauris ultrices eros in. In est
            ante in nibh mauris cursus mattis. Sem viverra aliquet eget sit. Vulputate ut pharetra
            sit amet aliquam id. Eu facilisis sed odio morbi quis commodo.
          </p>
          <p>
            Semper eget duis at tellus at urna. Diam quis enim lobortis scelerisque fermentum dui
            faucibus in. Risus in hendrerit gravida rutrum quisque non tellus orci. Est ante in nibh
            mauris cursus mattis molestie a iaculis. Semper quis lectus nulla at volutpat diam ut.
            At auctor urna nunc id cursus metus aliquam eleifend. Dui faucibus in ornare quam
            viverra. Netus et malesuada fames ac turpis egestas. Placerat in egestas erat imperdiet
            sed euismod nisi porta. Volutpat lacus laoreet non curabitur gravida arcu ac tortor.
            Donec et odio pellentesque diam volutpat commodo. In tellus integer feugiat scelerisque
            varius morbi enim. Rhoncus mattis rhoncus urna neque viverra justo nec ultrices dui. A
            cras semper auctor neque vitae tempus quam. Ipsum a arcu cursus vitae congue mauris.
            Commodo ullamcorper a lacus vestibulum.
          </p>
          <p>
            Vulputate ut pharetra sit amet aliquam. Neque laoreet suspendisse interdum consectetur
            libero id. Amet commodo nulla facilisi nullam vehicula ipsum a arcu. Risus viverra
            adipiscing at in tellus. Cum sociis natoque penatibus et. Morbi tempus iaculis urna id
            volutpat lacus. Integer enim neque volutpat ac tincidunt vitae semper quis. Elementum
            sagittis vitae et leo duis ut diam quam nulla. Magna sit amet purus gravida quis blandit
            turpis cursus. Maecenas pharetra convallis posuere morbi leo urna. Quis imperdiet massa
            tincidunt nunc pulvinar sapien et ligula ullamcorper. Ullamcorper a lacus vestibulum sed
            arcu non.
          </p>
          <p>
            Donec massa sapien faucibus et. Sed pulvinar proin gravida hendrerit lectus. Odio
            facilisis mauris sit amet massa vitae tortor. Pharetra convallis posuere morbi leo urna
            molestie at. Volutpat odio facilisis mauris sit amet massa vitae tortor condimentum.
            Lobortis feugiat vivamus at augue eget arcu dictum. Morbi enim nunc faucibus a
            pellentesque sit amet porttitor. Duis convallis convallis tellus id interdum velit
            laoreet id donec. Montes nascetur ridiculus mus mauris. Et netus et malesuada fames ac
            turpis egestas. Lacus sed turpis tincidunt id aliquet risus feugiat in. Sem integer
            vitae justo eget magna fermentum. Purus in massa tempor nec. Elementum curabitur vitae
            nunc sed velit dignissim. Felis imperdiet proin fermentum leo vel orci porta non.
          </p>
        </div>
      </my-overlay-frame>
    </my-overlay>
  `;
};
```

## elementToFocusAfterHide

HTMLElement. Will `.focus()` the HTMLElement passed to this property. By default, this is the `invokerNode`.

In the example, we focus the body instead of the `invokerNode`.

```js preview-story
export const elementToFocusAfterHide = () => {
  const btn = document.createElement('button');
  btn.innerText = 'I should get focus';

  const elementToFocusAfterHideConfig = { ...withDropdownConfig(), elementToFocusAfterHide: btn };
  return html`
    <demo-el-using-overlaymixin .config="${elementToFocusAfterHideConfig}">
      <button slot="invoker">Click me to open the overlay!</button>
      <div slot="content" class="demo-overlay">
        Hello! You can close this notification here:
        <button
          class="close-button"
          @click="${e => e.target.dispatchEvent(new Event('close-overlay', { bubbles: true }))}"
        >
          ⨯
        </button>
      </div>
    </demo-el-using-overlaymixin>
    ${btn}
  `;
};
```

## hasBackdrop

Boolean property. When true, will add a backdrop when the overlay is opened.

> Backdrops will overlay each other if you open nested overlays with enabled backdrops.
> If this is not what you intend, you can make the overlays not nested, where opening one, closes the other.
> Fortunately, we also have a configuration option that simulates that behavior in the next section `isBlocking`.

The backdrop styling can be configured by targeting the `.overlays .overlays__backdrop` css selector.

The backdrop animation can be configured by targeting the
`.overlays .overlays__backdrop--animation-in` and
`.overlays .overlays__backdrop--animation-out` css selector.
This currently only supports CSS Animations, because it relies on the `animationend` event to add/remove classes.

```js preview-story
export const hasBackdrop = () => {
  const hasBackdropConfig = { ...withDropdownConfig(), hasBackdrop: true };
  return html`
    <demo-el-using-overlaymixin .config="${hasBackdropConfig}">
      <button slot="invoker">Click me to open the overlay!</button>
      <div slot="content" class="demo-overlay">
        Hello! You can close this notification here:
        <button
          class="close-button"
          @click="${e => e.target.dispatchEvent(new Event('close-overlay', { bubbles: true }))}"
        >
          ⨯
        </button>
      </div>
    </demo-el-using-overlaymixin>
  `;
};
```

## isBlocking

Boolean property. When true, will block other overlays.

```js preview-story
export const isBlocking = () => {
  const isBlockingConfig = { ...withDropdownConfig(), hasBackdrop: true, isBlocking: true };
  return html`
    <demo-el-using-overlaymixin>
      <button slot="invoker">Overlay A: open first</button>
      <div slot="content" class="demo-overlay" style="width:200px;">
        This overlay gets closed when overlay B gets opened
        <button
          class="close-button"
          @click="${e => e.target.dispatchEvent(new Event('close-overlay', { bubbles: true }))}"
        >
          ⨯
        </button>
      </div>
    </demo-el-using-overlaymixin>
    <demo-el-using-overlaymixin .config="${isBlockingConfig}">
      <button slot="invoker">Overlay B: open second</button>
      <div slot="content" class="demo-overlay demo-overlay--blocking">
        Overlay A is hidden... now close me and see overlay A again.
        <button
          class="close-button"
          @click="${e => e.target.dispatchEvent(new Event('close-overlay', { bubbles: true }))}"
        >
          ⨯
        </button>
      </div>
    </demo-el-using-overlaymixin>
  `;
};
```

This example shows nested overlays, but they don't have to be. For example, they could be siblings, or completely unrelated.
When an overlay with `isBlocking` is opened, all other overlays are hidden by the `OverlaysManager`, which, as a global registry, is aware of all active overlays on the page.

## preventsScroll

Boolean property. When true, prevents scrolling content that is outside of the `contentNode`.

```js preview-story
export const preventsScroll = () => {
  const preventsScrollConfig = { preventsScroll: true };
  return html`
    <demo-el-using-overlaymixin .config="${preventsScrollConfig}">
      <button slot="invoker">Click me to open the overlay!</button>
      <div slot="content" class="demo-overlay">
        Hello! You can close this notification here:
        <button
          class="close-button"
          @click="${e => e.target.dispatchEvent(new Event('close-overlay', { bubbles: true }))}"
        >
          ⨯
        </button>
      </div>
    </demo-el-using-overlaymixin>
  `;
};
```

## viewportConfig

Determines where the overlay is placed relative to the viewport. This can only be used in combination with a 'global' `placementMode`.

Options:

- 'top-left'
- 'top'
- 'top-right'
- 'right'
- 'bottom-left'
- 'bottom'
- 'bottom-right'
- 'left'
- 'center'

```js preview-story
export const viewportConfig = () => {
  const viewportConfig = {
    placementMode: 'global',
    viewportConfig: { placement: 'bottom-left' },
  };
  return html`
    <demo-el-using-overlaymixin .config="${viewportConfig}">
      <button slot="invoker">Click me to open the overlay in the bottom left corner!</button>
      <div slot="content" class="demo-overlay">
        Hello! You can close this notification here:
        <button
          class="close-button"
          @click="${e => e.target.dispatchEvent(new Event('close-overlay', { bubbles: true }))}"
        >
          ⨯
        </button>
      </div>
    </demo-el-using-overlaymixin>
  `;
};
```

## popperConfig for local overlays (placementMode: 'local')

For locally DOM positioned overlays that position themselves relative to their invoker, we use [Popper.js](https://popper.js.org/) for positioning.

> In Popper, `contentNode` is often referred to as `popperElement`, and `invokerNode` is often referred to as the `referenceElement`.

Features:

- Everything Popper features!
- Currently eagerly loads popper if mode is local, in the constructor. Loading during idle time / using prefetch would be better, this is still WIP. PRs are welcome!

> Popper strictly is scoped on positioning. **It does not change the dimensions of the content node nor the invoker node**.
> This also means that if you use the arrow feature, you are in charge of styling it properly, use the data-popper-placement attribute for this.
> An example implementation can be found in [lion-tooltip](../../../components/tooltip/overview.md), where an arrow is set by default.

To override the default options we set for local mode, you add a `popperConfig` object to the config passed to the OverlayController.
Here's a succinct overview of some often used popper properties:

```js preview-story
export const popperConfig = () => {
  const popperConfig = {
    placementMode: 'local',
    popperConfig: {
      /* Placement of content node, relative to invoker node */
      placement: 'bottom-start',
      positionFixed: true,
      modifiers: [
        /* When enabled, adds shifting/sliding behavior on secondary axis */
        {
          name: 'preventOverflow',
          enabled: false,
          options: {
            boundariesElement: 'viewport',
            /* When enabled, this is the <boundariesElement>-margin for the secondary axis */
            padding: 32,
          },
        },
        /* Use to adjust flipping behavior or constrain directions */
        {
          name: 'flip',
          options: {
            boundariesElement: 'viewport',
            /* <boundariesElement>-margin for flipping on primary axis */
            padding: 16,
          },
        },
        /* When enabled, adds an offset to either primary or secondary axis */
        {
          name: 'offset',
          options: {
            /* margin between content node and invoker node */
            offset: [0, 16],
          },
        },
      ],
    },
  };
  return html`
    <style>
      .demo-overlay {
        background-color: white;
        border: 1px solid black;
      }
    </style>
    <demo-el-using-overlaymixin .config="${popperConfig}">
      <button slot="invoker">Click me to open the overlay!</button>
      <div slot="content" class="demo-overlay">
        Hello! You can close this notification here:
        <button
          class="close-button"
          @click="${e => e.target.dispatchEvent(new Event('close-overlay', { bubbles: true }))}"
        >
          ⨯
        </button>
      </div>
    </demo-el-using-overlaymixin>
  `;
};
```

> Note: popperConfig reflects [Popper API](https://popper.js.org/docs/v2/)
