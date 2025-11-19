/** script code **/
import { html } from '@mdjs/mdjs-preview';
import '@lion/demo-systems/overlays/assets/demo-el-using-overlaymixin.js';
import '@lion/demo-systems/overlays/assets/applyDemoOverlayStyles.js';
import { withDropdownConfig, withModalDialogConfig, withTooltipConfig } from '@lion/ui/overlays.js';
/** stories code **/
export const placementLocal = () => {
  const placementModeLocalConfig = { ...withDropdownConfig() };
  return html`
    <style>
      .demo-overlay {
        background-color: white;
        border: 1px solid black;
      }
    </style>
    <demo-el-using-overlaymixin .config="${placementModeLocalConfig}">
      <button slot="invoker">Click me to open the local overlay!</button>
      <div slot="content" class="demo-overlay">
        Hello! You can close this notification here:
        <button
          class="close-button"
          @click="${e => e.target.dispatchEvent(new Event('close-overlay', { bubbles: true }))}"
        >
          ⨯
        </button>
      </div>
    </demo-el-using-overlaymixin>
  `;
};
export const placementGlobal = () => {
  const placementModeGlobalConfig = { placementMode: 'global' };
  return html`
    <demo-el-using-overlaymixin .config="${placementModeGlobalConfig}">
      <button slot="invoker">Click me to open the global overlay!</button>
      <div slot="content" class="demo-overlay">
        Hello! You can close this notification here:
        <button
          class="close-button"
          @click="${e => e.target.dispatchEvent(new Event('close-overlay', { bubbles: true }))}"
        >
          ⨯
        </button>
      </div>
    </demo-el-using-overlaymixin>
  `;
};
export const alertDialog = () => {
  const placementModeGlobalConfig = { ...withModalDialogConfig(), isAlertDialog: true };
  return html`
    <demo-el-using-overlaymixin .config="${placementModeGlobalConfig}">
      <button slot="invoker">Click me to open the alert dialog!</button>
      <div slot="content" class="demo-overlay">
        Are you sure you want to perform this action?
        <button
          type="button"
          @click="${ev => ev.target.dispatchEvent(new Event('close-overlay', { bubbles: true }))}"
        >
          Yes
        </button>
        <button
          type="button"
          @click="${ev => ev.target.dispatchEvent(new Event('close-overlay', { bubbles: true }))}"
        >
          No
        </button>
      </div>
    </demo-el-using-overlaymixin>
  `;
};
export const usingTooltipConfig = () => {
  const tooltipConfig = { ...withTooltipConfig() };

  return html`
    <demo-el-using-overlaymixin id="tooltip" .config="${tooltipConfig}">
      <button slot="invoker">Hover me to open the tooltip!</button>
      <div slot="content" class="demo-overlay">Hello!</div>
    </demo-el-using-overlaymixin>
  `;
};
export const trapsKeyboardFocus = () => {
  const trapsKeyboardFocusConfig = { ...withDropdownConfig(), trapsKeyboardFocus: true };
  return html`
    <demo-el-using-overlaymixin .config="${trapsKeyboardFocusConfig}">
      <button slot="invoker">Click me to open the overlay!</button>
      <div slot="content" class="demo-overlay">
        <div><a href="#">A focusable anchor</a></div>
        <div><a href="#">Another focusable anchor</a></div>
        Hello! You can close this notification here:
        <button
          class="close-button"
          @click="${e => e.target.dispatchEvent(new Event('close-overlay', { bubbles: true }))}"
        >
          ⨯
        </button>
      </div>
    </demo-el-using-overlaymixin>
  `;
};
export const hidesOnEsc = () => {
  const hidesOnEscConfig = { ...withDropdownConfig(), hidesOnEsc: true };
  return html`
    <demo-el-using-overlaymixin .config="${hidesOnEscConfig}">
      <button slot="invoker">Click me to open the overlay!</button>
      <div slot="content" class="demo-overlay">
        Hello! You can close this notification here:
        <button
          class="close-button"
          @click="${e => e.target.dispatchEvent(new Event('close-overlay', { bubbles: true }))}"
        >
          ⨯
        </button>
      </div>
    </demo-el-using-overlaymixin>
  `;
};
export const hidesOnEscFalse = () => {
  const hidesOnEscConfig = {
    ...withModalDialogConfig(),
    hidesOnEsc: false,
    hidesOnOutsideEsc: false,
  };
  return html`
    <demo-el-using-overlaymixin .config="${hidesOnEscConfig}">
      <button slot="invoker">Click me to open the overlay!</button>
      <div slot="content" class="demo-overlay">
        Hello! You can close this notification here:
        <button
          class="close-button"
          @click="${e => e.target.dispatchEvent(new Event('close-overlay', { bubbles: true }))}"
        >
          ⨯
        </button>
      </div>
    </demo-el-using-overlaymixin>
  `;
};
export const hidesOnOutsideEsc = () => {
  const hidesOnEscConfig = { ...withDropdownConfig(), hidesOnOutsideEsc: true };
  return html`
    <demo-el-using-overlaymixin .config="${hidesOnEscConfig}">
      <button slot="invoker">Click me to open the overlay!</button>
      <div slot="content" class="demo-overlay">
        Hello! You can close this notification here:
        <button
          class="close-button"
          @click="${e => e.target.dispatchEvent(new Event('close-overlay', { bubbles: true }))}"
        >
          ⨯
        </button>
      </div>
    </demo-el-using-overlaymixin>
  `;
};
export const hidesOnOutsideClick = () => {
  const hidesOnOutsideClickConfig = { ...withDropdownConfig(), hidesOnOutsideClick: true };
  return html`
    <demo-el-using-overlaymixin .config="${hidesOnOutsideClickConfig}">
      <button slot="invoker">Click me to open the overlay!</button>
      <div slot="content" class="demo-overlay">
        <label for="myInput">Clicking this label should not trigger close</label>
        <input id="myInput" />
        <button
          class="close-button"
          @click="${e => e.target.dispatchEvent(new Event('close-overlay', { bubbles: true }))}"
        >
          ⨯
        </button>
      </div>
    </demo-el-using-overlaymixin>
  `;
};
export const elementToFocusAfterHide = () => {
  const btn = document.createElement('button');
  btn.innerText = 'I should get focus';

  const elementToFocusAfterHideConfig = { ...withDropdownConfig(), elementToFocusAfterHide: btn };
  return html`
    <demo-el-using-overlaymixin .config="${elementToFocusAfterHideConfig}">
      <button slot="invoker">Click me to open the overlay!</button>
      <div slot="content" class="demo-overlay">
        Hello! You can close this notification here:
        <button
          class="close-button"
          @click="${e => e.target.dispatchEvent(new Event('close-overlay', { bubbles: true }))}"
        >
          ⨯
        </button>
      </div>
    </demo-el-using-overlaymixin>
    ${btn}
  `;
};
export const hasBackdrop = () => {
  const hasBackdropConfig = { ...withDropdownConfig(), hasBackdrop: true };
  return html`
    <demo-el-using-overlaymixin .config="${hasBackdropConfig}">
      <button slot="invoker">Click me to open the overlay!</button>
      <div slot="content" class="demo-overlay">
        Hello! You can close this notification here:
        <button
          class="close-button"
          @click="${e => e.target.dispatchEvent(new Event('close-overlay', { bubbles: true }))}"
        >
          ⨯
        </button>
      </div>
    </demo-el-using-overlaymixin>
  `;
};
export const isBlocking = () => {
  const isBlockingConfig = { ...withDropdownConfig(), hasBackdrop: true, isBlocking: true };
  return html`
    <demo-el-using-overlaymixin>
      <button slot="invoker">Overlay A: open first</button>
      <div slot="content" class="demo-overlay" style="width:200px;">
        This overlay gets closed when overlay B gets opened
        <button
          class="close-button"
          @click="${e => e.target.dispatchEvent(new Event('close-overlay', { bubbles: true }))}"
        >
          ⨯
        </button>
      </div>
    </demo-el-using-overlaymixin>
    <demo-el-using-overlaymixin .config="${isBlockingConfig}">
      <button slot="invoker">Overlay B: open second</button>
      <div slot="content" class="demo-overlay demo-overlay--blocking">
        Overlay A is hidden... now close me and see overlay A again.
        <button
          class="close-button"
          @click="${e => e.target.dispatchEvent(new Event('close-overlay', { bubbles: true }))}"
        >
          ⨯
        </button>
      </div>
    </demo-el-using-overlaymixin>
  `;
};
export const preventsScroll = () => {
  const preventsScrollConfig = { preventsScroll: true };
  return html`
    <demo-el-using-overlaymixin .config="${preventsScrollConfig}">
      <button slot="invoker">Click me to open the overlay!</button>
      <div slot="content" class="demo-overlay">
        Hello! You can close this notification here:
        <button
          class="close-button"
          @click="${e => e.target.dispatchEvent(new Event('close-overlay', { bubbles: true }))}"
        >
          ⨯
        </button>
      </div>
    </demo-el-using-overlaymixin>
  `;
};
export const viewportConfig = () => {
  const viewportConfig = {
    placementMode: 'global',
    viewportConfig: { placement: 'bottom-left' },
  };
  return html`
    <demo-el-using-overlaymixin .config="${viewportConfig}">
      <button slot="invoker">Click me to open the overlay in the bottom left corner!</button>
      <div slot="content" class="demo-overlay">
        Hello! You can close this notification here:
        <button
          class="close-button"
          @click="${e => e.target.dispatchEvent(new Event('close-overlay', { bubbles: true }))}"
        >
          ⨯
        </button>
      </div>
    </demo-el-using-overlaymixin>
  `;
};
export const popperConfig = () => {
  const popperConfig = {
    placementMode: 'local',
    popperConfig: {
      /* Placement of content node, relative to invoker node */
      placement: 'bottom-start',
      positionFixed: true,
      modifiers: [
        /* When enabled, adds shifting/sliding behavior on secondary axis */
        {
          name: 'preventOverflow',
          enabled: false,
          options: {
            boundariesElement: 'viewport',
            /* When enabled, this is the <boundariesElement>-margin for the secondary axis */
            padding: 32,
          },
        },
        /* Use to adjust flipping behavior or constrain directions */
        {
          name: 'flip',
          options: {
            boundariesElement: 'viewport',
            /* <boundariesElement>-margin for flipping on primary axis */
            padding: 16,
          },
        },
        /* When enabled, adds an offset to either primary or secondary axis */
        {
          name: 'offset',
          options: {
            /* margin between content node and invoker node */
            offset: [0, 16],
          },
        },
      ],
    },
  };
  return html`
    <style>
      .demo-overlay {
        background-color: white;
        border: 1px solid black;
      }
    </style>
    <demo-el-using-overlaymixin .config="${popperConfig}">
      <button slot="invoker">Click me to open the overlay!</button>
      <div slot="content" class="demo-overlay">
        Hello! You can close this notification here:
        <button
          class="close-button"
          @click="${e => e.target.dispatchEvent(new Event('close-overlay', { bubbles: true }))}"
        >
          ⨯
        </button>
      </div>
    </demo-el-using-overlaymixin>
  `;
};
/** stories setup code **/
const rootNode = document;
const stories = [{ key: 'placementLocal', story: placementLocal }, { key: 'placementGlobal', story: placementGlobal }, { key: 'alertDialog', story: alertDialog }, { key: 'usingTooltipConfig', story: usingTooltipConfig }, { key: 'trapsKeyboardFocus', story: trapsKeyboardFocus }, { key: 'hidesOnEsc', story: hidesOnEsc }, { key: 'hidesOnEscFalse', story: hidesOnEscFalse }, { key: 'hidesOnOutsideEsc', story: hidesOnOutsideEsc }, { key: 'hidesOnOutsideClick', story: hidesOnOutsideClick }, { key: 'elementToFocusAfterHide', story: elementToFocusAfterHide }, { key: 'hasBackdrop', story: hasBackdrop }, { key: 'isBlocking', story: isBlocking }, { key: 'preventsScroll', story: preventsScroll }, { key: 'viewportConfig', story: viewportConfig }, { key: 'popperConfig', story: popperConfig }];
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