# Systems >> Overlays >> Configuration ||40

```js script
import { html } from '@lion/core';
import './assets/demo-overlay-system.js';
import './assets/applyDemoOverlayStyles.js';
```

The `OverlayController` has many configuration options.
Using different combinations of those properties, different components like a tooltip, popover, dialog etc. can be made.
The `OverlayMixin` exposes these options via `.config`.

## placementMode

Either `'local'` or `'global'`.
This determines the DOM position of the `contentNode`, either next to the invokerNode,
or in the `global-overlays` container at the bottom of the `<body>`.

### Local

```js preview-story
export const placementLocal = () => {
  const placementModeLocalConfig = { placementMode: 'local' };
  return html`
    <style>
      .demo-overlay {
        background-color: white;
        border: 1px solid black;
      }
    </style>
    <demo-overlay-system .config=${placementModeLocalConfig}>
      <button slot="invoker">Click me to open the local overlay!</button>
      <div slot="content" class="demo-overlay">
        Hello! You can close this notification here:
        <button
          class="close-button"
          @click=${e => e.target.dispatchEvent(new Event('close-overlay', { bubbles: true }))}
        >
          ⨯
        </button>
      </div>
    </demo-overlay-system>
  `;
};
```

### Global

```js preview-story
export const placementGlobal = () => {
  const placementModeGlobalConfig = { placementMode: 'global' };
  return html`
    <demo-overlay-system .config=${placementModeGlobalConfig}>
      <button slot="invoker">Click me to open the global overlay!</button>
      <div slot="content" class="demo-overlay">
        Hello! You can close this notification here:
        <button
          class="close-button"
          @click=${e => e.target.dispatchEvent(new Event('close-overlay', { bubbles: true }))}
        >
          ⨯
        </button>
      </div>
    </demo-overlay-system>
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
export const isTooltip = () => {
  function showTooltip() {
    const tooltip = document.querySelector('#tooltip');
    tooltip.opened = true;
  }

  function hideTooltip() {
    const tooltip = document.querySelector('#tooltip');
    tooltip.opened = false;
  }

  const tooltipConfig = { placementMode: 'local', isTooltip: true, handlesAccessibility: true };

  return html`
    <demo-overlay-system id="tooltip" .config=${tooltipConfig}>
      <button slot="invoker" @mouseenter=${showTooltip} @mouseleave=${hideTooltip}>
        Hover me to open the tooltip!
      </button>
      <div slot="content" class="demo-overlay">Hello!</div>
    </demo-overlay-system>
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
  const trapsKeyboardFocusConfig = { trapsKeyboardFocus: true };
  return html`
    <demo-overlay-system .config=${trapsKeyboardFocusConfig}>
      <button slot="invoker">Click me to open the overlay!</button>
      <div slot="content" class="demo-overlay">
        <div><a href="#">A focusable anchor</a></div>
        <div><a href="#">Another focusable anchor</a></div>
        Hello! You can close this notification here:
        <button
          class="close-button"
          @click=${e => e.target.dispatchEvent(new Event('close-overlay', { bubbles: true }))}
        >
          ⨯
        </button>
      </div>
    </demo-overlay-system>
  `;
};
```

## hidesOnEsc

Boolean property. Will allow closing the overlay on ESC key when enabled.

```js preview-story
export const hidesOnEsc = () => {
  const hidesOnEscConfig = { hidesOnEsc: true };
  return html`
    <demo-overlay-system .config=${hidesOnEscConfig}>
      <button slot="invoker">Click me to open the overlay!</button>
      <div slot="content" class="demo-overlay">
        Hello! You can close this notification here:
        <button
          class="close-button"
          @click=${e => e.target.dispatchEvent(new Event('close-overlay', { bubbles: true }))}
        >
          ⨯
        </button>
      </div>
    </demo-overlay-system>
  `;
};
```

## hidesOnOutsideClick

Boolean property. Will allow closing the overlay by clicking outside the `contentNode`.

```js preview-story
export const hidesOnOutsideClick = () => {
  const hidesOnOutsideClickConfig = { hidesOnOutsideClick: true };
  return html`
    <demo-overlay-system .config=${hidesOnOutsideClickConfig}>
      <button slot="invoker">Click me to open the overlay!</button>
      <div slot="content" class="demo-overlay">
        <label for="myInput">Clicking this label should not trigger close</label>
        <input id="myInput" />
        <button
          class="close-button"
          @click=${e => e.target.dispatchEvent(new Event('close-overlay', { bubbles: true }))}
        >
          ⨯
        </button>
      </div>
    </demo-overlay-system>
  `;
};
```

## elementToFocusAfterHide

HTMLElement. Will `.focus()` the HTMLElement passed to this property. By default, this is the `invokerNode`.

In the example, we focus the body instead of the `invokerNode`.

```js preview-story
export const elementToFocusAfterHide = () => {
  const elementToFocusAfterHideConfig = { elementToFocusAfterHide: document.body };
  return html`
    <demo-overlay-system .config=${elementToFocusAfterHideConfig}>
      <button slot="invoker">Click me to open the overlay!</button>
      <div slot="content" class="demo-overlay">
        Hello! You can close this notification here:
        <button
          class="close-button"
          @click=${e => e.target.dispatchEvent(new Event('close-overlay', { bubbles: true }))}
        >
          ⨯
        </button>
      </div>
    </demo-overlay-system>
  `;
};
```

## hasBackdrop

Boolean property. When true, will add a backdrop when the overlay is opened.

> Backdrops will overlay each other if you open nested overlays with enabled backdrops.
> If this is not what you intend, you can make the overlays not nested, where opening one, closes the other.
> Fortunately, we also have a configuration option that simulates that behavior in the next section `isBlocking`.

The backdrop styling can be configured by targeting the `.global-overlays .global-overlays__backdrop` css selector.

The backdrop animation can be configured by targeting the
`.global-overlays .global-overlays__backdrop--animation-in` and
`.global-overlays .global-overlays__backdrop--animation-out` css selector.
This currently only supports CSS Animations, because it relies on the `animationend` event to add/remove classes.

```js preview-story
export const hasBackdrop = () => {
  const hasBackdropConfig = { hasBackdrop: true };
  return html`
    <demo-overlay-system .config=${hasBackdropConfig}>
      <button slot="invoker">Click me to open the overlay!</button>
      <div slot="content" class="demo-overlay">
        Hello! You can close this notification here:
        <button
          class="close-button"
          @click=${e => e.target.dispatchEvent(new Event('close-overlay', { bubbles: true }))}
        >
          ⨯
        </button>
      </div>
    </demo-overlay-system>
  `;
};
```

## isBlocking

Boolean property. When true, will block other overlays.

```js preview-story
export const isBlocking = () => {
  const isBlockingConfig = { hasBackdrop: true, isBlocking: true };
  return html`
    <demo-overlay-system>
      <button slot="invoker">Click me to open the overlay!</button>
      <div slot="content" class="demo-overlay">
        <div>
          <demo-overlay-system .config=${isBlockingConfig}>
            <button slot="invoker">Click me to open another overlay which is blocking</button>
            <div slot="content" class="demo-overlay demo-overlay--blocking">
              Hello! You can close this notification here:
              <button
                class="close-button"
                @click=${e => e.target.dispatchEvent(new Event('close-overlay', { bubbles: true }))}
              >
                ⨯
              </button>
            </div>
          </demo-overlay-system>
        </div>
        Hello! You can close this notification here:
        <button
          class="close-button"
          @click=${e => e.target.dispatchEvent(new Event('close-overlay', { bubbles: true }))}
        >
          ⨯
        </button>
      </div>
    </demo-overlay-system>
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
    <demo-overlay-system .config=${preventsScrollConfig}>
      <button slot="invoker">Click me to open the overlay!</button>
      <div slot="content" class="demo-overlay">
        Hello! You can close this notification here:
        <button
          class="close-button"
          @click=${e => e.target.dispatchEvent(new Event('close-overlay', { bubbles: true }))}
        >
          ⨯
        </button>
      </div>
    </demo-overlay-system>
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
    viewportConfig: { placement: 'top-left' },
  };
  return html`
    <demo-overlay-system .config=${viewportConfig}>
      <button slot="invoker">Click me to open the overlay in the top left corner!</button>
      <div slot="content" class="demo-overlay">
        Hello! You can close this notification here:
        <button
          class="close-button"
          @click=${e => e.target.dispatchEvent(new Event('close-overlay', { bubbles: true }))}
        >
          ⨯
        </button>
      </div>
    </demo-overlay-system>
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
> An example implementation can be found in [lion-tooltip](../../../components/interaction/tooltip/overview.md), where an arrow is set by default.

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
    <demo-overlay-system .config=${popperConfig}>
      <button slot="invoker">Click me to open the overlay!</button>
      <div slot="content" class="demo-overlay">
        Hello! You can close this notification here:
        <button
          class="close-button"
          @click=${e => e.target.dispatchEvent(new Event('close-overlay', { bubbles: true }))}
        >
          ⨯
        </button>
      </div>
    </demo-overlay-system>
  `;
};
```

> Note: popperConfig reflects [Popper API](https://popper.js.org/docs/v2/)
