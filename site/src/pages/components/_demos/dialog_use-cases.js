/** script code **/
import { html } from '@mdjs/mdjs-preview';
import '@lion/ui/define/lion-dialog.js';
import { demoStyle } from '/node_modules/_lion_docs/components/dialog/src/demoStyle.js';
import '/node_modules/_lion_docs/components/dialog/src/styled-dialog-content.js';
import '/node_modules/_lion_docs/components/dialog/src/slots-dialog-content.js';
import '/node_modules/_lion_docs/components/dialog/src/external-dialog.js';
/** stories code **/
export const alertDialog = () => {
  return html`
    <style>
      ${demoStyle}
    </style>
    <lion-dialog is-alert-dialog class="dialog">
      <button type="button" slot="invoker">Reset</button>
      <div slot="content" class="demo-box">
        Are you sure you want to clear the input field?
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
    </lion-dialog>
  `;
};
export const externalTrigger = () => {
  const externalTriggerDialog = () => {
    class DialogTriggerDemo extends LitElement {
      static get properties() {
        return {
          _isOpen: { state: true },
        };
      }

      toggleDialog(open) {
        return () => (this._isOpen = open);
      }

      handleDialog(e) {
        this._isOpen = e.detail.opened;
      }

      render() {
        return html`
          <button @click=${this.toggleDialog(true)}>Open dialog</button>
          <lion-dialog ?opened=${this._isOpen} @opened-changed=${this.handleDialog}>
            <div slot="content" class="dialog demo-box">
              Hello! You can close this notification here:
              <button class="close-button" @click=${this.toggleDialog(false)}>⨯</button>
            </div>
          </lion-dialog>
        `;
      }
    }
  };

  return html`
    <style>
      ${demoStyle}
    </style>
    <div class="demo-box_placements">
      <dialog-trigger-demo></dialog-trigger-demo>
    </div>
  `;
};
export const placementOverrides = () => {
  const dialog = placement => {
    const cfg = { viewportConfig: { placement } };
    return html`
      <lion-dialog .config="${cfg}">
        <button slot="invoker">Dialog ${placement}</button>
        <div slot="content" class="dialog demo-box">
          Hello! You can close this notification here:
          <button
            class="close-button"
            @click="${e => e.target.dispatchEvent(new Event('close-overlay', { bubbles: true }))}"
          >
            ⨯
          </button>
        </div>
      </lion-dialog>
    `;
  };
  return html`
    <style>
      ${demoStyle}
    </style>
    <div class="demo-box_placements">
      ${dialog('center')} ${dialog('top-left')} ${dialog('top-right')} ${dialog('bottom-left')}
      ${dialog('bottom-right')}
    </div>
  `;
};
export const otherOverrides = () => {
  const cfg = {
    hasBackdrop: false,
    hidesOnEsc: true,
    preventsScroll: true,
    elementToFocusAfterHide: document.body,
  };

  return html`
    <style>
      ${demoStyle}
    </style>
    <lion-dialog .config="${cfg}">
      <button slot="invoker">Click me to open dialog</button>
      <div slot="content" class="demo-dialog-content">
        Hello! You can close this dialog here:
        <button
          class="demo-dialog-content__close-button"
          @click="${e => e.target.dispatchEvent(new Event('close-overlay', { bubbles: true }))}"
        >
          ⨯
        </button>
      </div>
    </lion-dialog>
  `;
};
/** stories setup code **/
const rootNode = document;
const stories = [{ key: 'alertDialog', story: alertDialog }, { key: 'externalTrigger', story: externalTrigger }, { key: 'placementOverrides', story: placementOverrides }, { key: 'otherOverrides', story: otherOverrides }];
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