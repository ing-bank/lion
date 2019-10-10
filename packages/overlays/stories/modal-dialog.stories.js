import { storiesOf, html } from '@open-wc/demoing-storybook';
import { fixtureSync } from '@open-wc/testing-helpers';
import { css } from '@lion/core';
import { OverlayController, withModalDialogConfig } from '../index.js';

const modalDialogDemoStyle = css`
  .demo-overlay {
    background-color: white;
    width: 200px;
    border: 1px solid lightgrey;
  }
`;

storiesOf('Global Overlay System|Modal Dialog', module)
  .add('Default', () => {
    const nestedDialogCtrl = new OverlayController({
      ...withModalDialogConfig(),
      contentNode: fixtureSync(html`
        <div class="demo-overlay" style="margin-top: -100px;">
          <p>Nested modal dialog</p>
          <button @click="${() => nestedDialogCtrl.hide()}">Close</button>
        </div>
      `),
    });

    const dialogCtrl = new OverlayController({
      ...withModalDialogConfig(),
      contentNode: fixtureSync(html`
        <div class="demo-overlay">
          <p>Modal dialog</p>
          <button @click="${() => dialogCtrl.hide()}">Close</button>
          <button
            @click="${event => nestedDialogCtrl.show(event.target)}"
            aria-haspopup="dialog"
            aria-expanded="false"
          >
            Open nested dialog
          </button>
        </div>
      `),
    });

    return html`
      <style>
        ${modalDialogDemoStyle}
      </style>
      <a href="#">Anchor 1</a>
      <button
        @click="${event => dialogCtrl.show(event.target)}"
        aria-haspopup="dialog"
        aria-expanded="false"
      >
        Open dialog
      </button>
      <a href="#">Anchor 2</a>
      ${Array(50).fill(
        html`
          <p>Lorem ipsum</p>
        `,
      )}
    `;
  })
  .add('Option "isBlocking"', () => {
    const blockingDialogCtrl = new OverlayController({
      ...withModalDialogConfig(),
      isBlocking: true,
      viewportConfig: {
        placement: 'top',
      },
      contentNode: fixtureSync(html`
        <div class="demo-overlay demo-overlay--2">
          <p>Hides other dialogs</p>
          <button @click="${() => blockingDialogCtrl.hide()}">Close</button>
        </div>
      `),
    });

    const normalDialogCtrl = new OverlayController({
      ...withModalDialogConfig(),
      contentNode: fixtureSync(html`
        <div class="demo-overlay">
          <p>Normal dialog</p>
          <button
            @click="${event => blockingDialogCtrl.show(event.target)}"
            aria-haspopup="dialog"
            aria-expanded="false"
          >
            Open blocking dialog
          </button>
          <button @click="${() => normalDialogCtrl.hide()}">Close</button>
        </div>
      `),
    });

    return html`
      <style>
        ${modalDialogDemoStyle}
      </style>
      <button
        @click="${event => normalDialogCtrl.show(event.target)}"
        aria-haspopup="dialog"
        aria-expanded="false"
      >
        Open dialog
      </button>
    `;
  });
