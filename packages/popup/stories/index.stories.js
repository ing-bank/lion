import { storiesOf, html } from '@open-wc/demoing-storybook';
import { css } from '@lion/core';

import '@lion/icon/lion-icon.js';
import '@lion/button/lion-button.js';
import '../lion-popup.js';

const popupDemoStyle = css`
  .demo-box {
    width: 200px;
    background-color: white;
    border-radius: 2px;
    border: 1px solid grey;
    margin: 250px;
    padding: 8px;
  }

  .demo-box_positions {
    display: flex;
    flex-direction: column;
    width: 173px;
    margin: 0 auto;
    margin-top: 68px;
  }

  lion-popup {
    padding: 10px;
  }

  .demo-box__column {
    display: flex;
    flex-direction: column;
  }

  .popup {
    display: block;
    position: absolute;
    font-size: 16px;
    color: white;
    background-color: black;
    border-radius: 4px;
    padding: 8px;
  }

  @media (max-width: 480px) {
    .popup {
      display: none;
    }
  }
`;

storiesOf('Local Overlay System|Popup', module)
  .add(
    'Button popup',
    () => html`
      <style>
        ${popupDemoStyle}
      </style>
      <div class="demo-box">
        <lion-popup position="right">
          <div slot="content" class="popup">hey there</div>
          <lion-button slot="invoker">Popup</lion-button>
        </lion-popup>
      </div>
    `,
  )
  .add(
    'positions',
    () => html`
      <style>
        ${popupDemoStyle}
      </style>
      <div class="demo-box_positions">
        <lion-popup position="top">
          <div slot="content" class="popup">Its top position</div>
          <lion-button slot="invoker">Top</lion-button>
        </lion-popup>
        <lion-popup position="right">
          <div slot="content" class="popup">Its right position</div>
          <lion-button slot="invoker">Right</lion-button>
        </lion-popup>
        <lion-popup position="bottom">
          <div slot="content" class="popup">Its bottom position</div>
          <lion-button slot="invoker">Bottom</lion-button>
        </lion-popup>
        <lion-popup position="left">
          <div slot="content" class="popup">Its left position</div>
          <lion-button slot="invoker">Left</lion-button>
        </lion-popup>
      </div>
    `,
  );
