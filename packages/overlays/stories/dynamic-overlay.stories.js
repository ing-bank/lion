import { storiesOf, html } from '@open-wc/demoing-storybook';

import { css, render } from '@lion/core';
import {
  OverlayController,
  withBottomSheetConfig,
  withModalDialogConfig,
  withDropdownConfig,
} from '../index.js';

function renderToNode(litHtmlTemplate) {
  const offlineRenderContainer = document.createElement('div');
  render(litHtmlTemplate, offlineRenderContainer);
  return offlineRenderContainer.firstElementChild;
}

const dynamicOverlayDemoStyle = css`
  .demo-overlay {
    display: block;
    position: absolute;
    background-color: white;
    padding: 8px;
  }

  .demo-overlay__global--small {
    height: 400px;
    width: 100%;
    background: #eee;
  }

  .demo-overlay__global--big {
    left: 50px;
    top: 30px;
    width: 200px;
    max-width: 250px;
    border-radius: 2px;
    box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.12), 0 6px 6px 0 rgba(0, 0, 0, 0.24);
  }

  .demo-overlay__local {
    display: block;
    position: absolute;
    max-width: 250px;
    border-radius: 2px;
    box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.12), 0 6px 6px 0 rgba(0, 0, 0, 0.24);
  }
`;

storiesOf('Dynamic Overlay System| Switching Overlays', module).add(
  'Switch overlays configuration',
  () => {
    const invokerNode = document.createElement('button');
    invokerNode.innerHTML = 'Invoker Button';

    const ctrl = new OverlayController({
      ...withBottomSheetConfig(),
      hidesOnOutsideClick: true,
      trapsKeyboardFocus: true,
      invokerNode: renderToNode(html`
        <button @click="${() => ctrl.toggle()}">
          Invoker
        </button>
      `),
      contentNode: renderToNode(html`
        <div
          style="background: #eee;"
          xclass="demo-overlay demo-overlay__global demo-overlay__global--small"
        >
          <p>type: ${ctrlType}</p>
          <button @click="${() => ctrl.hide()}">Close</button>
          <button>asdsad</button>
        </div>
      `),
    });

    let ctrlType = document.createElement('div');
    function switchTo(type) {
      ctrlType.innerHTML = type;
      switch (type) {
        case 'bottom-sheet':
          ctrl.updateConfig(withBottomSheetConfig());
          break;
        case 'dropdown':
          ctrl.updateConfig({
            ...withDropdownConfig(),
            hasBackdrop: false,
            viewportConfig: null,
          });
          break;
        default:
          ctrl.updateConfig(withModalDialogConfig());
      }
    }

    return html`
      <style>
        ${dynamicOverlayDemoStyle}
      </style>

      ${ctrl.invokerNode}

      <button @click="${() => switchTo('modal-dialog')}">
        as modal dialog
      </button>

      <button @click="${() => switchTo('bottom-sheet')}">
        as bottom sheet
      </button>

      <button @click="${() => switchTo('dropdown')}">
        as dropdown
      </button>
    `;
  },
);
