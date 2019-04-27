import { storiesOf, html } from '@open-wc/demoing-storybook';
import { css } from '@lion/core';
import { managePosition } from '../src/utils/manage-position.js';

const popupPlacementDemoStyle = css`
  .demo-container {
    height: 100vh;
    background-color: #ebebeb;
  }

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
    display: block;
    position: absolute;
    width: 250px;
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
    const element = document.createElement('div');
    element.classList.add('demo-popup');
    element.innerText = 'Toggle the placement of this overlay with the buttons.';

    const target = document.createElement('div');
    target.id = 'target';
    target.classList.add('demo-box');

    let placement = 'top left';
    const togglePlacement = () => {
      switch (placement) {
        case 'top left':
          placement = 'top';
          break;
        case 'top':
          placement = 'top right';
          break;
        case 'top right':
          placement = 'right';
          break;
        case 'right':
          placement = 'bottom right';
          break;
        case 'bottom right':
          placement = 'bottom';
          break;
        case 'bottom':
          placement = 'bottom left';
          break;
        case 'bottom left':
          placement = 'left';
          break;
        default:
          placement = 'top left';
      }
      managePosition(element, target, { placement, position: 'absolute' });
    };
    return html`
      <style>
        ${popupPlacementDemoStyle}
      </style>
      <div class="demo-container">
        <button @click=${() => togglePlacement()}>Toggle placement</button>
        <p>Check the action logger to see the placement changes on toggling this button.</p>
        ${target} ${element}
      </div>
    `;
  })
  .add('Space not available', () => {
    const element = document.createElement('div');
    element.classList.add('demo-popup');
    element.innerText = `
      Toggle the placement of this overlay with the buttons.
      Since there is not enough space available on the vertical center or the top for this popup,
      the popup will get displayed on the available space on the bottom.
      Try dragging the viewport to increase/decrease space see the behavior of this.
    `;

    const target = document.createElement('div');
    target.id = 'target';
    target.classList.add('demo-box');

    let placement = 'top left';
    const togglePlacement = () => {
      switch (placement) {
        case 'top left':
          placement = 'top';
          break;
        case 'top':
          placement = 'top right';
          break;
        case 'top right':
          placement = 'right';
          break;
        case 'right':
          placement = 'bottom right';
          break;
        case 'bottom right':
          placement = 'bottom';
          break;
        case 'bottom':
          placement = 'bottom left';
          break;
        case 'bottom left':
          placement = 'left';
          break;
        default:
          placement = 'top left';
      }
      managePosition(element, target, { placement, position: 'absolute' });
    };
    return html`
      <style>
        ${popupPlacementDemoStyle}
      </style>
      <div class="demo-container">
        <button @click=${() => togglePlacement()}>Toggle placement</button>
        <p>Check the action logger to see the placement changes on toggling this button.</p>
        ${target} ${element}
      </div>
    `;
  });
