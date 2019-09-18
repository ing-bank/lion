import { storiesOf, html } from '@open-wc/demoing-storybook';
import { css } from '@lion/core';
import { LocalOverlayController } from '../src/LocalOverlayController.js';
import { overlays } from '../src/overlays.js';

let placement = 'top';
const togglePlacement = popupController => {
  const placements = [
    'top-end',
    'top',
    'top-start',
    'right-end',
    'right',
    'right-start',
    'bottom-start',
    'bottom',
    'bottom-end',
    'left-start',
    'left',
    'left-end',
  ];
  placement = placements[(placements.indexOf(placement) + 1) % placements.length];
  popupController.updatePopperConfig({ placement });
};

const popupPlacementDemoStyle = css`
  .demo-box {
    width: 40px;
    height: 40px;
    background-color: white;
    border-radius: 2px;
    border: 1px solid grey;
    margin: 120px auto 120px 360px;
    padding: 8px;
  }

  .demo-popup {
    background-color: white;
    border-radius: 2px;
    border: 1px solid grey;
    box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.12), 0 6px 6px 0 rgba(0, 0, 0, 0.24);
    padding: 8px;
  }
`;

storiesOf('Local Overlay System|Local Overlay Placement', module)
  .addParameters({ options: { selectedPanel: 'storybook/actions/actions-panel' } })
  .add('Preferred placement overlay absolute', () => {
    let popup;
    const invokerNode = document.createElement('button');
    invokerNode.innerHTML = 'UK';
    invokerNode.addEventListener('click', () => popup.toggle());

    popup = overlays.add(
      new LocalOverlayController({
        hidesOnEsc: true,
        contentTemplate: () => html`
          <div class="demo-popup">United Kingdom</div>
        `,
        invokerNode,
      }),
    );

    return html`
      <style>
        ${popupPlacementDemoStyle}
      </style>
      <button @click=${() => togglePlacement(popup)}>Toggle placement</button>
      <div class="demo-box">
        ${invokerNode} ${popup.content}
      </div>
    `;
  })
  .add('Override the popper config', () => {
    let popup;
    const invokerNode = document.createElement('button');
    invokerNode.innerHTML = 'UK';
    invokerNode.addEventListener('click', () => popup.toggle());

    popup = overlays.add(
      new LocalOverlayController({
        hidesOnEsc: true,
        popperConfig: {
          placement: 'bottom-start',
          positionFixed: true,
          modifiers: {
            keepTogether: {
              enabled: true /* Prevents detachment of content element from reference element */,
            },
            preventOverflow: {
              enabled: false /* disables shifting/sliding behavior on secondary axis */,
              boundariesElement: 'viewport',
              padding: 32 /* when enabled, this is the viewport-margin for shifting/sliding */,
            },
            flip: {
              boundariesElement: 'viewport',
              padding: 16 /* viewport-margin for flipping on primary axis */,
            },
            offset: {
              enabled: true,
              offset: `0, 16px` /* horizontal and vertical margin (distance between popper and referenceElement) */,
            },
          },
        },
        contentTemplate: () =>
          html`
            <div class="demo-popup">United Kingdom</div>
          `,
        invokerNode,
      }),
    );

    return html`
      <style>
        ${popupPlacementDemoStyle}
      </style>
      <div>
        The API is aligned with Popper.js, visit their documentation for more information:
        <a href="https://popper.js.org/popper-documentation.html">Popper.js Docs</a>
      </div>
      <button @click=${() => togglePlacement(popup)}>Toggle placement</button>
      <div class="demo-box">
        ${invokerNode} ${popup.content}
      </div>
    `;
  });
/* TODO: Add this when we have a feature in place that adds scrollbars / overflow when no space is available */
/* .add('Space not available', () => {
    let popup;
    const invokerNode = document.createElement('button');
    invokerNode.innerHTML = 'UK';
    invokerNode.addEventListener('click', () => popup.toggle());
    let popup = overlays.add(
      new LocalOverlayController({
        hidesOnEsc: true,
        contentTemplate: () => html`
            <div class="demo-popup">
              Toggle the placement of this overlay with the buttons. Since there is not enough space
              available on the vertical center or the top for this popup, the popup will get
              displayed on the available space on the bottom. Try dragging the viewport to
              increase/decrease space see the behavior of this.
            </div>
          `,
        invokerNode,
      }),
    );

    return html`
      <style>
        ${popupPlacementDemoStyle}
      </style>
      <div>
        <button @click=${() => togglePlacement(popup)}>Toggle placement</button>
        <button @click=${() => popup.hide()}>Close popup</button>
      </div>
      <div class="demo-box">
        ${invokerNode} ${popup.content}
      </div>
    `;
  }); */
