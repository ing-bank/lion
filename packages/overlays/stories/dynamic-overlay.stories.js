import { storiesOf, html } from '@open-wc/demoing-storybook';

import { css } from '@lion/core';
import {
  GlobalOverlayController,
  LocalOverlayController,
  DynamicOverlayController,
} from '../index.js';
import { overlays } from '../src/overlays.js';

const dynamicOverlayDemoStyle = css`
  .demo-overlay {
    display: block;
    position: absolute;
    background-color: white;
    padding: 8px;
  }

  .demo-overlay__global--small {
    bottom: 0;
    left: 0;
    width: 100vw;
    height: 90%;
    background: #ccc;
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

storiesOf('Dynamic Overlay System|Switching Overlays', module)
  .add('Switch global overlays', () => {
    const invokerNode = document.createElement('button');
    invokerNode.innerHTML = 'Invoker Button';

    const ctrl = new DynamicOverlayController();

    const global1 = overlays.add(
      new GlobalOverlayController({
        contentTemplate: () => html`
          <div class="demo-overlay demo-overlay__global demo-overlay__global--small">
            <p>I am for small screens < 600px</p>
            <button @click="${() => ctrl.hide()}">Close</button>
          </div>
        `,
        invokerNode,
      }),
    );
    ctrl.add(global1);

    const global2 = overlays.add(
      new GlobalOverlayController({
        contentTemplate: () => html`
          <div class="demo-overlay demo-overlay__global demo-overlay__global--big">
            <p>I am for big screens > 600px</p>
            <button @click="${() => ctrl.hide()}">Close</button>
          </div>
        `,
        invokerNode,
      }),
    );
    ctrl.add(global2);

    invokerNode.addEventListener('click', event => {
      ctrl.show(event.target);
    });

    function switchOnMediaChange(x) {
      if (x.matches) {
        // <= 600px
        ctrl.nextOpen = global1;
      } else {
        ctrl.nextOpen = global2;
      }
    }
    const matchSmall = window.matchMedia('(max-width: 600px)');
    switchOnMediaChange(matchSmall); // call once manually to init
    matchSmall.addListener(switchOnMediaChange);

    return html`
      <style>
        ${dynamicOverlayDemoStyle}
      </style>
      <p>Shows "Bottom Sheet" for small (< 600px) screens and "Dialog" for big (> 600px) screens</p>

      ${ctrl.invokerNode}

      <p>
        You can also
        <button @click="${() => ctrl.switchTo(ctrl.active === global1 ? global2 : global1)}">
          force a switch
        </button>
        while overlay is hidden.
      </p>
    `;
  })
  .add('Switch local overlays', () => {
    const invokerNode = document.createElement('button');
    invokerNode.innerHTML = 'Invoker Button';

    const ctrl = new DynamicOverlayController();
    const local1 = new LocalOverlayController({
      contentTemplate: () => html`
        <div class="demo-overlay demo-overlay__local">
          <p>Small screen have a read more</p>
          <ul>
            <li>Red</li>
            <li>Green</li>
          </ul>
          <a href="">Read more ...</a>
          <br />
          <button @click="${() => ctrl.hide()}">Close</button>
        </div>
      `,
      invokerNode,
    });
    ctrl.add(local1);

    const local2 = new LocalOverlayController({
      contentTemplate: () => html`
        <div class="demo-overlay demo-overlay__local">
          <p>Big screens see all</p>
          <ul>
            <li>Red</li>
            <li>Green</li>
            <li>Ornage</li>
            <li>Blue</li>
            <li>Yellow</li>
            <li>Pink</li>
          </ul>
          <button @click="${() => ctrl.hide()}">Close</button>
        </div>
      `,
      invokerNode,
    });
    ctrl.add(local2);

    invokerNode.addEventListener('click', () => {
      ctrl.toggle();
    });

    function switchOnMediaChange(x) {
      if (x.matches) {
        // <= 600px
        ctrl.nextOpen = local1;
      } else {
        ctrl.nextOpen = local2;
      }
    }
    const matchSmall = window.matchMedia('(max-width: 600px)');
    switchOnMediaChange(matchSmall); // call once manually to init
    matchSmall.addListener(switchOnMediaChange);

    return html`
      <style>
        ${dynamicOverlayDemoStyle}
      </style>
      <p>Shows "read me..." for small (< 600px) screens and all for big (> 600px) screens</p>

      ${ctrl.invokerNode}${ctrl.content}

      <p>
        You can also
        <button @click="${() => ctrl.switchTo(ctrl.active === local1 ? local2 : local1)}">
          force a switch
        </button>
        while overlay is hidden.
      </p>
    `;
  })
  .add('Global & Local', () => {
    const invokerNode = document.createElement('button');
    invokerNode.innerHTML = 'Invoker Button';
    const ctrl = new DynamicOverlayController();

    const local = new LocalOverlayController({
      contentTemplate: () => html`
        <div class="demo-overlay demo-overlay__local">
          <p>My Local Overlay</p>
          <button @click="${() => ctrl.hide()}">Close</button>
        </div>
      `,
      invokerNode,
    });
    ctrl.add(local);

    const global = overlays.add(
      new GlobalOverlayController({
        contentTemplate: () => html`
          <div class="demo-overlay demo-overlay__global demo-overlay__global--small">
            <p>My Global Overlay</p>
            <button @click="${() => ctrl.hide()}">Close</button>
          </div>
        `,
        invokerNode,
      }),
    );
    ctrl.add(global);

    invokerNode.addEventListener('click', () => {
      ctrl.toggle();
    });

    function switchOnMediaChange(x) {
      if (x.matches) {
        // <= 600px
        console.log('settig', global);
        ctrl.nextOpen = global;
      } else {
        ctrl.nextOpen = local;
      }
    }
    const matchSmall = window.matchMedia('(max-width: 600px)');
    switchOnMediaChange(matchSmall); // call once manually to init
    matchSmall.addListener(switchOnMediaChange);

    return html`
      <style>
        ${dynamicOverlayDemoStyle}
      </style>

      <p>
        Shows "Buttom Sheet" for small (< 600px) screens and "Dropdown" for big (> 600px) screens
      </p>

      <p>
        This button is indented to show the local positioning ${ctrl.invokerNode}${ctrl.content}
      </p>

      <p>
        You can also
        <button @click="${() => ctrl.switchTo(ctrl.active === global ? local : global)}">
          force a switch
        </button>
        while overlay is hidden.
      </p>
    `;
  });
