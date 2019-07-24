# LocalOverlayPositioning

## Featuring - [Popper.js](https://popper.js.org/)

Our local overlays use the open-source Popper.js library for positioning the content relative to the reference element, which we usually refer to as the invoker, in the context of local overlays.

## Features

- Everything Popper.js!
- Currently eagerly loads popper in the constructor of LocalOverlayController. Loading during idle time / using prefetch would be better, this is still WIP.

> Popper strictly is scoped on positioning. **It does not change the dimensions of the popper element nor the reference element**. This also means that if you use the arrow feature, you are in charge of styling it properly, use the x-placement attribute for this.

## How to use

For installation, see [LocalOverlayController](./LocalOverlayController.md)'s `How to use` section.

The API for LocalOverlay without Popper looks like this (`overlays` being the OverlayManager singleton):

```js
const localOverlay = overlays.add(
  new LocalOverlayController({
    contentTemplate: () =>
      html`
        <div class="demo-popup">United Kingdom</div>
      `,
    invokerTemplate: () =>
      html`
        <button @click=${() => popupController.toggle()}>UK</button>
      `,
  });
);
```

This will use the defaults we set for Popper configuration. To override the default options, you add a `popperConfig` object to the properties of the object you pass to `the LocalOverlayController` like so:

```js
const localOverlay = overlays.add(
  new LocalOverlayController({
    contentTemplate: () =>
      html`
        <div class="demo-popup">United Kingdom</div>
      `,
    invokerTemplate: () =>
      html`
        <button @click=${() => popupController.toggle()}>UK</button>
      `,
    popperConfig: {
      /* Placement of popper element, relative to reference element */
      placement: 'bottom-start',
      positionFixed: true,
      modifiers: {
        /* Prevents detachment of content element from reference element */
        keepTogether: {
          enabled: true,
        },
        /* When enabled, adds shifting/sliding behavior on secondary axis */
        preventOverflow: {
          enabled: false,
          boundariesElement: 'viewport',
          /* When enabled, this is the <boundariesElement>-margin for the secondary axis */
          padding: 32,
        },
        /* Use to adjust flipping behavior or constrain directions */
        flip: {
          boundariesElement: 'viewport',
          /* <boundariesElement>-margin for flipping on primary axis */
          padding: 16,
        },
        /* When enabled, adds an offset to either primary or secondary axis */
        offset: {
          enabled: true,
          /* margin between popper and referenceElement */
          offset: `0, 16px`,
        },
      },
    },
  });
);
```

The popperConfig is 1 to 1 aligned with Popper.js' API. For more detailed information and more advanced options, visit the [Popper.js documentation](https://popper.js.org/popper-documentation.html) to learn about the usage.

## Future additions

- Coming soon: Webcomponent implementation of LocalOverlay with a default arrow, styled out of the box to at least have proper rotations and positions.
- Default overflow and/or max-width behavior when content is too wide or high for the viewport.
