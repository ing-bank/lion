# Tooltip >> Use Cases ||20

```js script
import { css, html } from '@mdjs/mdjs-preview';
import { LionTooltip } from '@lion/tooltip';
import '@lion/tooltip/define';
```

## invokerRelation

There is a difference between tooltips used as a primary label or as a description. In most cases a button will already have its own label, so the tooltip will be used as a description with extra information, which is already set as default. Only in case of icon buttons you want to use the tooltip as the primary label. To do so you need to set the `invokerRelation` to `label`.

> For detailed information please read: [inclusive tooltips](https://inclusive-components.design/tooltips-toggletips/#inclusivetooltips).

```js preview-story
export const invokerRelation = () => {
  const invokerRelationConfig = { invokerRelation: 'label' };
  return html`
    <style>
      .demo-tooltip-invoker {
        margin: 50px;
      }
    </style>
    <lion-tooltip .config=${invokerRelationConfig}>
      <button slot="invoker" class="demo-tooltip-invoker">📅</button>
      <div slot="content">Agenda<div>
    </lion-tooltip>
  `;
};
```

## Placements

You can easily change the placement of the content node relative to the invoker, by adjusting the `placement` inside the `popperConfig`.

```js preview-story
export const placements = () => {
  const placementTopConfig = { popperConfig: { placement: 'top' } };
  const placementRightConfig = { popperConfig: { placement: 'right' } };
  const placementBottomConfig = { popperConfig: { placement: 'bottom' } };
  const placementLeftConfig = { popperConfig: { placement: 'left' } };
  return html`
    <style>
      button[slot='invoker'] {
        margin: 50px;
      }
      div[slot='content'] {
        background-color: white;
        padding: 4px;
      }
    </style>
    <div class="demo-box-placements">
      <lion-tooltip has-arrow .config=${placementTopConfig}>
        <button slot="invoker">Top</button>
        <div slot="content">Top placement</div>
      </lion-tooltip>
      <lion-tooltip has-arrow .config=${placementRightConfig}>
        <button slot="invoker">Right</button>
        <div slot="content">Right placement</div>
      </lion-tooltip>
      <lion-tooltip has-arrow .config=${placementBottomConfig}>
        <button slot="invoker">Bottom</button>
        <div slot="content">Bottom placement</div>
      </lion-tooltip>
      <lion-tooltip has-arrow .config=${placementLeftConfig}>
        <button slot="invoker">Left</button>
        <div slot="content">Left placement</div>
      </lion-tooltip>
    </div>
  `;
};
```

## Override Popper configuration

You can override the Popper configuration, the API is one to one with Popper's API, and includes modifiers.

```js preview-story
export const overridePopperConfig = () => {
  const overridePopperConfig = {
    popperConfig: {
      placement: 'bottom-start',
      strategy: 'fixed',
      modifiers: [
        {
          name: 'keepTogether',
          options: {},
          enabled: true,
        },
        {
          name: 'preventOverflow',
          options: {
            boundariesElement: 'viewport',
            padding: 16,
          },
          enabled: false,
        },
        {
          name: 'flip',
          options: {
            boundariesElement: 'viewport',
            padding: 4,
          },
          enabled: true,
        },
        {
          name: 'offset',
          options: {
            // Note the different offset notation
            offset: [0, 4],
          },
          enabled: true,
        },
      ],
    },
  };
  return html`
    <style>
      .demo-tooltip-invoker {
        margin: 50px;
      }
    </style>
    <lion-tooltip .config=${overridePopperConfig}>
      <button slot="invoker" class="demo-tooltip-invoker">Hover me</button>
      <div slot="content">This is a tooltip<div>
    </lion-tooltip>
  `;
};
```

Modifier explanations:

- keepTogether: prevents detachment of content element from reference element, which could happen if the invoker is not in the viewport any more. If this is disabled, the content will always be in view.
- preventOverflow: enables shifting and sliding behavior on the secondary axis (e.g. if top placement, this is horizontal shifting and sliding). The padding property defines the margin with the boundariesElement, which is usually the viewport.
- flip: enables flipping behavior on the primary axis (e.g. if top placement, flipping to bottom if there is not enough space on the top). The padding property defines the margin with the boundariesElement, which is usually the viewport.
- offset: enables an offset between the content node and the invoker node. First argument is horizontal margin, second argument is vertical margin.

## Arrow

By default, the arrow is disabled for our tooltip. Via the `has-arrow` property it can be enabled.

> As a Subclasser, you can decide to turn the arrow on by default if this fits your Design System, by setting `this.hasArrow = true;` in the constructor.

```js preview-story
export const arrow = () => html`
  <style>
    .demo-tooltip-invoker {
      margin: 50px;
    }
  </style>
  <lion-tooltip has-arrow>
    <button slot="invoker" class="demo-tooltip-invoker">Hover me</button>
    <div slot="content">This is a tooltip</div>
  </lion-tooltip>
`;
```

### Use a custom arrow

If you plan on providing a custom arrow, you can extend the `lion-tooltip`.

All you need to do is override the `_arrowTemplate` method to pass your own SVG, and extend the styles to pass the proper dimensions of your arrow.
The rest of the work is done by Popper.js (for positioning) and the `lion-tooltip-arrow` (arrow dimensions, rotation, etc.).

```js preview-story
export const customArrow = () => {
  if (!customElements.get('custom-tooltip')) {
    customElements.define(
      'custom-tooltip',
      class extends LionTooltip {
        static get styles() {
          return [
            ...super.styles,
            css`
              :host {
                --tooltip-arrow-width: 20px;
                --tooltip-arrow-height: 8px;
              }
            `,
          ];
        }
        constructor() {
          super();
          this.hasArrow = true;
        }
        _arrowTemplate() {
          return html`
            <svg viewBox="0 0 20 8" class="arrow__graphic">
              <path d="M 0,0 h 20 L 10,8 z"></path>
            </svg>
          `;
        }
      },
    );
  }
  return html`
    <style>
      .demo-tooltip-invoker {
        margin: 50px;
      }
    </style>
    <custom-tooltip>
      <button slot="invoker" class="demo-tooltip-invoker">Hover me</button>
      <div slot="content">This is a tooltip</div>
    </custom-tooltip>
  `;
};
```
