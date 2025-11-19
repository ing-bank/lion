/** script code **/
import { html, render, LitElement } from '@mdjs/mdjs-preview';
import { renderLitAsNode } from '@lion/ui/helpers.js';
import {
  ArrowMixin,
  OverlayMixin,
  withBottomSheetConfig,
  withDropdownConfig,
  withModalDialogConfig,
} from '@lion/ui/overlays.js';

import '@lion/demo-systems/overlays/assets/demo-el-using-overlaymixin.js';
import '@lion/demo-systems/overlays/assets/demo-overlay-backdrop.js';
import '@lion/demo-systems/overlays/assets/applyDemoOverlayStyles.js';
import { ref, createRef } from 'lit/directives/ref.js';
/** stories code **/
export const main = () => html`
  <demo-el-using-overlaymixin>
    <button slot="invoker">Click me to open the overlay!</button>
    <div slot="content" class="demo-overlay">
      Hello! You can close this notification here:
      <button
        @click="${e => e.target.dispatchEvent(new Event('close-overlay', { bubbles: true }))}"
      >
        ⨯
      </button>
    </div>
  </demo-el-using-overlaymixin>
`;
export const backdrop = () => {
  const responsiveModalDialogConfig = { ...withModalDialogConfig() };
  return html`
    <demo-el-using-overlaymixin .config="${responsiveModalDialogConfig}">
      <demo-overlay-backdrop slot="backdrop"></demo-overlay-backdrop>
      <button slot="invoker">Click me to open the overlay!</button>
      <div slot="content" class="demo-overlay">
        Hello! You can close this notification here:
        <button
          @click="${e => e.target.dispatchEvent(new Event('close-overlay', { bubbles: true }))}"
        >
          ⨯
        </button>
      </div>
    </demo-el-using-overlaymixin>
  `;
};
export const backdropImperative = () => {
  const backdropNode = document.createElement('demo-overlay-backdrop');
  const responsiveModalDialogConfig = { ...withModalDialogConfig(), backdropNode };
  return html`
    <demo-el-using-overlaymixin .config="${responsiveModalDialogConfig}">
      <button slot="invoker">Click me to open the overlay!</button>
      <div slot="content" class="demo-overlay">
        Hello! You can close this notification here:
        <button
          @click="${e => e.target.dispatchEvent(new Event('close-overlay', { bubbles: true }))}"
        >
          ⨯
        </button>
      </div>
    </demo-el-using-overlaymixin>
  `;
};
export const backdropAnimation = () => {
  const responsiveModalDialogConfig = { ...withModalDialogConfig() };
  return html`
    <demo-el-using-overlaymixin .config="${responsiveModalDialogConfig}">
      <button slot="invoker">Click me to open the overlay!</button>
      <demo-overlay-backdrop slot="backdrop"></demo-overlay-backdrop>
      <div slot="content" class="demo-overlay">
        Hello! You can close this notification here:
        <button
          @click="${e => e.target.dispatchEvent(new Event('close-overlay', { bubbles: true }))}"
        >
          ⨯
        </button>
      </div>
    </demo-el-using-overlaymixin>
  `;
};
export const responsiveSwitching = () => {
  const responsiveBottomSheetConfig = { ...withBottomSheetConfig() };
  return html`
    <demo-el-using-overlaymixin
      .config="${responsiveBottomSheetConfig}"
      @before-opened=${e => {
        if (window.innerWidth >= 600) {
          e.target.config = { ...withModalDialogConfig() };
        } else {
          e.target.config = { ...withBottomSheetConfig() };
        }
      }}
    >
      <button slot="invoker">Click me to open the overlay!</button>
      <div slot="content" class="demo-overlay">
        Hello! You can close this notification here:
        <button
          @click="${e => e.target.dispatchEvent(new Event('close-overlay', { bubbles: true }))}"
        >
          ⨯
        </button>
      </div>
    </demo-el-using-overlaymixin>
  `;
};
export const responsiveSwitching2 = () => {
  const overlayRef = createRef();
  const selectRef = createRef();

  const getConfig = selectValue => {
    switch (selectValue) {
      case 'modaldialog':
        return { ...withModalDialogConfig(), hasBackdrop: true };
      case 'bottomsheet':
        return { ...withBottomSheetConfig() };
      case 'dropdown':
        return { ...withDropdownConfig(), hasBackdrop: false, inheritsReferenceWidth: true };
      default:
        return { ...withModalDialogConfig(), hasBackdrop: true };
    }
  };
  const onSelectChange = e => {
    overlayRef.value.config = getConfig(e.target.value);
  };

  return html`
    <style>
      .demo-overlay {
        background-color: white;
        border: 1px solid black;
      }
    </style>
    Change config to:

    <select ${ref(selectRef)} @change="${onSelectChange}">
      <option value="modaldialog">Modal Dialog</option>
      <option value="bottomsheet">Bottom Sheet</option>
      <option value="dropdown">Dropdown</option>
    </select>

    <br />
    <demo-el-using-overlaymixin ${ref(overlayRef)} .config="${getConfig(selectRef.value?.value)}">
      <button slot="invoker">Click me to open the overlay!</button>
      <div slot="content" class="demo-overlay">
        Hello! You can close this notification here:
        <button
          @click="${e => e.target.dispatchEvent(new Event('close-overlay', { bubbles: true }))}"
        >
          ⨯
        </button>
      </div>
    </demo-el-using-overlaymixin>
  `;
};
export const openedState = () => {
  const appState = {
    opened: false,
  };
  const myRefs = {
    overlay: createRef(),
    openedState: createRef(),
  };
  function onOpenClosed(ev) {
    appState.opened = ev.target.opened;
    myRefs.openedState.value.innerText = appState.opened;
  }
  return html`
    appState.opened: <span ${ref(myRefs.openedState)}>${appState.opened}</span>
    <demo-el-using-overlaymixin
      ${ref(myRefs.overlay)}
      .opened="${appState.opened}"
      @opened-changed="${onOpenClosed}"
    >
      <button slot="invoker">Overlay</button>
      <div slot="content" class="demo-overlay">
        Hello! You can close this notification here:
        <button
          @click="${e => e.target.dispatchEvent(new Event('close-overlay', { bubbles: true }))}"
        >
          ⨯
        </button>
      </div>
    </demo-el-using-overlaymixin>
  `;
};
export const interceptingOpenClose = () => {
  // Application code
  let blockOverlay = true;
  const myRefs = {
    statusButton: createRef(),
    overlay: createRef(),
  };
  function intercept(ev) {
    if (blockOverlay) {
      ev.preventDefault();
    }
  }
  return html`
    Overlay blocked state:
    <button
      ${ref(myRefs.statusButton)}
      @click="${() => {
        blockOverlay = !blockOverlay;
        myRefs.statusButton.value.textContent = blockOverlay;
      }}"
    >
      ${blockOverlay}
    </button>
    <demo-el-using-overlaymixin
      ${ref(myRefs.overlay)}
      @before-closed="${intercept}"
      @before-opened="${intercept}"
    >
      <button
        slot="invoker"
        @click=${() =>
          console.log('blockOverlay', blockOverlay, 'opened', myRefs.overlay.value.opened)}
      >
        Overlay
      </button>
      <div slot="content" class="demo-overlay">
        Hello! You can close this notification here:
        <button @click="${() => (myRefs.overlay.value.opened = false)}">⨯</button>
      </div>
    </demo-el-using-overlaymixin>
  `;
};
export const overlayManager = () => {
  const hasBackdropConfig = { ...withModalDialogConfig(), hasBackdrop: true };
  return html`
    <demo-el-using-overlaymixin .config="${hasBackdropConfig}">
      <button slot="invoker">Click me to open the overlay!</button>
      <div slot="content" class="demo-overlay">
        Hello! You can close this notification here:
        <button
          @click="${e => e.target.dispatchEvent(new Event('close-overlay', { bubbles: true }))}"
        >
          ⨯
        </button>
        <br />
        <button @click="${e => (document.querySelector('#secondOverlay').opened = true)}">
          Click me to open another overlay which is blocking
        </button>
      </div>
    </demo-el-using-overlaymixin>
    <demo-el-using-overlaymixin
      id="secondOverlay"
      .config="${{ ...withModalDialogConfig(), hasBackdrop: true, isBlocking: true }}"
    >
      <div slot="content" class="demo-overlay demo-overlay--second">
        Hello! You can close this notification here:
        <button
          @click="${e => e.target.dispatchEvent(new Event('close-overlay', { bubbles: true }))}"
        >
          ⨯
        </button>
      </div>
    </demo-el-using-overlaymixin>
  `;
};
export const localBackdrop = () => {
  const localBackdropConfig = { ...withDropdownConfig() };
  return html`
    <demo-el-using-overlaymixin .config="${localBackdropConfig}">
      <demo-overlay-backdrop slot="backdrop"></demo-overlay-backdrop>
      <button slot="invoker">Click me to open the overlay!</button>
      <div slot="content" class="demo-overlay">
        Hello! You can close this notification here:
        <button
          @click="${e => e.target.dispatchEvent(new Event('close-overlay', { bubbles: true }))}"
        >
          ⨯
        </button>
      </div>
    </demo-el-using-overlaymixin>
  `;
};
export const nestedOverlays = () => {
  return html`
    <demo-el-using-overlaymixin .config="${withModalDialogConfig()}">
      <div slot="content" id="mainContent" class="demo-overlay">
        open nested overlay:
        <demo-el-using-overlaymixin .config="${withModalDialogConfig()}">
          <div slot="content" id="nestedContent" class="demo-overlay">
            Nested content
            <button
              @click="${e => e.target.dispatchEvent(new Event('close-overlay', { bubbles: true }))}"
            >
              ⨯
            </button>
          </div>
          <button slot="invoker" id="nestedInvoker">nested invoker button</button>
        </demo-el-using-overlaymixin>
        <button
          @click="${e => e.target.dispatchEvent(new Event('close-overlay', { bubbles: true }))}"
        >
          ⨯
        </button>
      </div>
      <button slot="invoker" id="mainInvoker">invoker button</button>
    </demo-el-using-overlaymixin>
  `;
};
export const LocalWithArrow = () => {
  const placementRightConfig = { popperConfig: { placement: 'right' } };
  const placementBottomConfig = { popperConfig: { placement: 'bottom' } };
  const placementLeftConfig = { popperConfig: { placement: 'left' } };
  class ArrowExample extends ArrowMixin(OverlayMixin(LitElement)) {
    _defineOverlayConfig() {
      return {
        ...super._defineOverlayConfig(),
        popperConfig: {
          ...super._defineOverlayConfig().popperConfig,
          placement: 'top',
        },
      };
    }

    _setupOpenCloseListeners() {
      super._setupOpenCloseListeners();
      if (this._overlayInvokerNode) {
        this._overlayInvokerNode.addEventListener('click', this.toggle);
      }
    }

    _teardownOpenCloseListeners() {
      super._teardownOpenCloseListeners();
      if (this._overlayInvokerNode) {
        this._overlayInvokerNode.removeEventListener('click', this.toggle);
      }
    }
  }
  if (!customElements.get('arrow-example')) {
    customElements.define('arrow-example', ArrowExample);
  }
  return html`
    <style>
      .demo-box-placements {
        display: flex;
        flex-direction: column;
        margin: 40px 0 0 200px;
      }
      .demo-box-placements arrow-example {
        margin: 20px;
      }
    </style>
    <div class="demo-box-placements">
      <arrow-example>
        <button slot="invoker">Top</button>
        <div slot="content">This is a tooltip with an arrow</div>
      </arrow-example>
      <arrow-example .config="${placementRightConfig}">
        <button slot="invoker">Right</button>
        <div slot="content">This is a tooltip with an arrow</div>
      </arrow-example>
      <arrow-example .config="${placementBottomConfig}">
        <button slot="invoker">Bottom</button>
        <div slot="content">This is a tooltip with an arrow</div>
      </arrow-example>
      <arrow-example .config="${placementLeftConfig}">
        <button slot="invoker">Left</button>
        <div slot="content">This is a tooltip with an arrow</div>
      </arrow-example>
    </div>
  `;
};
/** stories setup code **/
const rootNode = document;
const stories = [{ key: 'main', story: main }, { key: 'backdrop', story: backdrop }, { key: 'backdropImperative', story: backdropImperative }, { key: 'backdropAnimation', story: backdropAnimation }, { key: 'responsiveSwitching', story: responsiveSwitching }, { key: 'responsiveSwitching2', story: responsiveSwitching2 }, { key: 'openedState', story: openedState }, { key: 'interceptingOpenClose', story: interceptingOpenClose }, { key: 'overlayManager', story: overlayManager }, { key: 'localBackdrop', story: localBackdrop }, { key: 'nestedOverlays', story: nestedOverlays }, { key: 'LocalWithArrow', story: LocalWithArrow }];
let needsMdjsElements = false;
for (const story of stories) {
  const storyEl = rootNode.querySelector(`[mdjs-story-name="${story.key}"]`);
  if (storyEl) {
    storyEl.story = story.story;
    storyEl.key = story.key;
    needsMdjsElements = true;
    Object.assign(storyEl, {"simulatorUrl":"/next/simulator/","languages":[{"key":"de-DE","name":"German"},{"key":"en-GB","name":"English (United Kingdom)"},{"key":"en-US","name":"English (United States)"},{"key":"nl-NL","name":"Dutch"}]});
  }
};
if (needsMdjsElements) {
  if (!customElements.get('mdjs-preview')) { import('/node_modules/@mdjs/mdjs-preview/src/define/define.js'); }
  if (!customElements.get('mdjs-story')) { import('/node_modules/@mdjs/mdjs-story/src/define.js'); }
}