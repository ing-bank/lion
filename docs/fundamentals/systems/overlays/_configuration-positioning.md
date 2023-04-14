---
eleventyExcludeFromCollections: true
---

# Systems >> Overlays >> Configuration >> Positioning ||40

```js script
import { html, render, LitElement } from '@mdjs/mdjs-preview';
import { ref, createRef } from 'lit/directives/ref.js';
import './assets/demo-el-using-overlaymixin.mjs';
import './assets/applyDemoOverlayStyles.mjs';
import './assets/demo-overlay-positioning.mjs';
```

Overlays can have two different placement modes: relative to their anchor element and relative to the viewport.
Depending on screen size and viewing device, one placement mode might be suited better than the other.

> Note that, the placementMode option has the values 'local' (anchor) and 'global' (viewport). These refer to their
> legacy position in dom (global overlays were put in the body of the page). Since overlays are built with the native `<dialog>` element,
> no content is moved around anymore, so their names are a bit less intuitive.

## Relative to anchor

An anchor is usually the invoker button, it can also be a non interactive reference element.
Anchor placement uses Popper under the hood. It supports 9 positions:
`top-start`, `top`, `top-end`, `right-start`, `right`, `right-end`, `bottom-start`, `bottom`, `bottom-end`, `left-start`,`left`,`left-end`

```js story
export const localPositioning = () => html`<demo-overlay-positioning></demo-overlay-positioning>`;
```

## Relative to viewport

Viewport placement uses the flexbox layout mode, leveraging the best browser capabilities when
the content or screen size updates.
Supported modes:
`center`, `top-left`, `top`, `top-right`, `right`, `bottom-right`, `bottom`, `bottom-left`, `left`

```js story
export const globalPositioning = () =>
  html`<demo-overlay-positioning
    placement-mode="global"
    simulate-viewport
  ></demo-overlay-positioning>`;
```

## placementMode

The `placementMode` property determines the positioning of the `contentNode`:

- next to its reference node: `local`
- relative to the viewport: `global`

### Local

<!-- By default, the [`referenceNode`](./configuration-elements#referencenode) is the [invokerNode](/configuration-elements#invokernode). -->

```js story
export const placementLocal = () => {
  const placementModeLocalConfig = { placementMode: 'local' };
  return html`
    <demo-el-using-overlaymixin .config=${placementModeLocalConfig}>
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
    </demo-el-using-overlaymixin>
  `;
};
```

### Global

```js story
export const placementGlobal = () => {
  const placementModeGlobalConfig = { placementMode: 'global' };
  return html`
    <demo-el-using-overlaymixin .config=${placementModeGlobalConfig}>
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
    </demo-el-using-overlaymixin>
  `;
};
```

## popperConfig

/** Viewport configuration. Will be used when placementMode is 'global' \*/
viewportConfig?: ViewportConfig;
/** Hides other overlays when multiple are opened (currently exclusive to globalOverlayController) _/
isBlocking?: boolean;
/\*\* Will align contentNode with referenceNode (invokerNode by default) for local overlays. Usually needed for dropdowns. 'max' will prevent contentNode from exceeding width of referenceNode, 'min' guarantees that contentNode will be at least as wide as referenceNode. 'full' will make sure that the invoker width always is the same. _/
inheritsReferenceWidth?: 'max' | 'full' | 'min' | 'none';
/\*_ Change the default of 9999 _/
zIndex?: number;

| Prop                   | Description                                                                                                                                                                                                                                                                                                     | Type                               |     |     |     |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------- | --- | --- | --- |
| placementMode          | Determines the positioning anchor (viewport vs invokerNode/referenceNode)                                                                                                                                                                                                                                       | 'global'\|'local'                  |     |     |     |
| viewportConfig         | Viewport positioning configuration. Will be used when placementMode is 'global'                                                                                                                                                                                                                                 | {placement: ViewportPlacement}     |     |     |     |
| popperConfig           | Anchor positioning configuration. Will be used when placementMode is 'local'                                                                                                                                                                                                                                    |                                    |     |     |     |
| inheritsReferenceWidth | Will align contentNode with referenceNode for local overlays. Usually needed for dropdowns. 'max' will prevent contentNode from exceeding width of referenceNode, 'min' guarantees that contentNode will be at least as wide as referenceNode. 'full' will make sure that the invoker width always is the same. | 'max' \| 'full' \| 'min' \| 'none' |     |     |     |
