# Systems >> Overlays >> Positioning ||10

```js script
import { html, render, LitElement } from '@mdjs/mdjs-preview';
import { ref, createRef } from 'lit/directives/ref.js';
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

## Notorious edge cases

These edge cases are not so much related to the edges of the viewport or the anchor, but more with the difficulties involved with the dom context of the overlay.
That is:

- a parent that has `overflow: hidden` applied
- a surrounding stacking context that does not allow to paint on top
- a transform applied to a parent

Note that our overlay uses the `<dialog>` element under the hood. It paints to the [top layer](https://github.com/whatwg/html/issues/4633) when it is configured as a modal overlay (that is, it uses `.showModal()` to open the dialog.)

### Overflow

A positioned parent with `overflow: hidden` can cause the overlay to be invisible. This can mainly occur in non-modal overlays being absolutely
positioned relative to their anchor.

See [css-tricks: popping-hidden-overflow](https://css-tricks.com/popping-hidden-overflow/#aa-the-solution)

#### Overflow: the problem

```js preview-story
export const edgeCaseOverflowProblem = () =>
  html`
    <div style="padding: 54px 24px 36px;">
      <div
        style="overflow: hidden; border: 1px black dashed; padding-top: 44px; padding-bottom: 16px;"
      >
        <div style="display: flex; justify-content: space-evenly; position: relative;">
          <demo-overlay-el opened use-absolute>
            <button slot="invoker" aria-label="local, non modal"></button>
            <div slot="content">absolute (for&nbsp;demo)</div>
          </demo-overlay-el>
        </div>
      </div>
    </div>
  `;
```

#### Overflow: the solution

Two solutions are thinkable:

- use a modal overlay
- use the fixed positioning strategy for the non-modal overlay

Our overlay system makes sure that there's always a fixed layer that pops out of the hidden parent.

```js preview-story
export const edgeCaseOverflowSolution = () =>
  html`
    <div style="padding: 54px 24px 36px;">
      <div
        style="overflow: hidden; border: 1px black dashed; padding-top: 36px; padding-bottom: 16px;"
      >
        <div style="display: flex; justify-content: space-evenly; position: relative;">
          <demo-overlay-el
            opened
            .config="${{ placementMode: 'local', trapsKeyboardFocus: false }}"
          >
            <button slot="invoker" aria-label="local, non modal"></button>
            <div slot="content">no matter</div>
          </demo-overlay-el>

          <demo-overlay-el opened .config="${{ placementMode: 'local', trapsKeyboardFocus: true }}">
            <button slot="invoker" aria-label="local, modal"></button>
            <div slot="content">what configuration</div>
          </demo-overlay-el>

          <demo-overlay-el
            opened
            .config="${{ placementMode: 'local', popperConfig: { strategy: 'absolute' } }}"
          >
            <button slot="invoker" aria-label="local, absolute"></button>
            <div slot="content">...it</div>
          </demo-overlay-el>

          <demo-overlay-el
            opened
            .config="${{ placementMode: 'local', popperConfig: { strategy: 'fixed' } }}"
          >
            <button slot="invoker" aria-label="local, fixed"></button>
            <div slot="content">just</div>
          </demo-overlay-el>

          <demo-overlay-el opened .config="${{ placementMode: 'global' }}">
            <button slot="invoker" aria-label="global"></button>
            <div slot="content">works</div>
          </demo-overlay-el>
        </div>
      </div>
    </div>
  `;
```

### Stacking context

When using non modal overlays, always make sure that the surrounding [stacking context](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Positioning/Understanding_z_index/The_stacking_context) does not paint on top of your overlay.  
The example below shows the difference between a modal and non-modal overlay placed in a stacking context with a lower priority than its parent/sibling contexts.

#### Stacking context: the problem

```js preview-story
export const edgeCaseStackProblem = () =>
  html`
    <div style="width: 300px; height: 300px; position: relative;">
      <div
        id="stacking-context-a"
        style="position: absolute; z-index: 2; top: 0; width: 100px; height: 200px;"
      >
        I am on top and I don't care about your 9999
      </div>

      <div
        id="stacking-context-b"
        style="position: absolute; z-index: 1; top: 0; width: 200px; height: 200px;"
      >
        <demo-overlay-el no-dialog-el style="overflow:hidden; position: relative;">
          <button slot="invoker">invoke</button>
          <div slot="content">
            The overlay can never be in front, since the parent stacking context has a lower
            priority than its sibling.
            <div id="stacking-context-b-inner" style="position: absolute; z-index: 9999;">
              So, even if we add a new stacking context in our overlay with z-index 9999, it will
              never be painted on top.
            </div>
          </div>
        </demo-overlay-el>
      </div>
    </div>
  `;
```
