import { storiesOf, html, action } from '@open-wc/storybook';
import { css } from 'lit-element';
import { managePosition } from '../utils/manage-position.js';

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

storiesOf('Overlay System|Local/Local Overlay Placement', module)
  .addParameters({ options: { selectedPanel: 'storybook/actions/actions-panel' } })
  .add('Preferred placement overlay absolute', () => {
    const element = document.createElement('div');
    element.classList.add('demo-popup');
    element.innerText = 'Toggle the placement of this overlay with the buttons.';

    const target = document.createElement('div');
    target.id = 'target';
    target.classList.add('demo-box');

    const placements = [
      'center-of-top',
      'right-of-top',
      'top-of-right',
      'center-of-right',
      'bottom-of-right',
      'right-of-bottom',
      'center-of-bottom',
      'left-of-bottom',
      'bottom-of-left',
      'center-of-left',
      'top-of-left',
      'left-of-top',
    ];
    let placement = 'top-of-left';

    const togglePlacement = () => {
      placements.some((pos, index) => {
        if (placement === pos) {
          if (index === placements.length - 1) {
            [placement] = placements;
          } else {
            placement = placements[index + 1];
          }
          return true;
        }
        return false;
      });
      action('position: ')(placement);
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
      action('position: ')(placement);
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
