const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["_astro/define.BWpRLYnc.js","_astro/MdJsPreview.CainKAmn.js","_astro/lit-element.B1EQMsFJ.js","_astro/lit-html.BX7rm8u-.js","_astro/dedupeMixin.6XPTJgK8.js","_astro/LionAccordion.CCw3hAmZ.js","_astro/lit-element.BOikny4r.js","_astro/uuid.DjYKNjre.js","_astro/define.BPRa0k46.js"])))=>i.map(i=>d[i]);
import{_ as i}from"./preload-helper.DOA02mLT.js";import"./MdJsPreview.CainKAmn.js";import"./lit-element.B1EQMsFJ.js";import{b as o}from"./lit-html.BX7rm8u-.js";import"./node-tools_providence-analytics_overview.BQH7j7jT.js";import{d as s}from"./demoStyle.Dk2pHI-a.js";import{a as n,i as r,b as l}from"./lit-element.BOikny4r.js";class d extends n{static get styles(){return[r`
        :host {
          background-color: #fff;
        }
        .nice {
          font-weight: bold;
          color: green;
        }
        .close-button {
          color: black;
          font-size: 28px;
          line-height: 28px;
        }
      `]}_closeOverlay(){this.dispatchEvent(new Event("close-overlay",{bubbles:!0}))}render(){return l`
      <div><p>Hello person who opened the dialog!</p></div>
      <div>
        <p>Look how nice this <span class="nice">dialog</span> looks!</p>
      </div>
      <button class="close-button" @click="${this._closeOverlay}">⨯</button>
    `}}customElements.define("styled-dialog-content",d);class g extends n{static get styles(){return[r`
        :host {
          background-color: #fff;
        }
        .actions {
          border-top: 2px solid green;
        }
      `]}_closeOverlay(){this.dispatchEvent(new Event("close-overlay",{bubbles:!0}))}render(){return l`
      <p>This content contains an actions slot</p>
      <div class="actions">
        <slot name="actions"></slot>
      </div>
      <button class="close-button" @click="${this._closeOverlay}">⨯</button>
    `}}customElements.define("slots-dialog-content",g);class u extends n{static get properties(){return{_isOpen:{state:!0}}}toggleDialog(t){return()=>this._isOpen=t}handleDialog(t){this._isOpen=t.detail.opened}render(){return l`
      <button @click=${this.toggleDialog(!0)}>Open dialog</button>
      <lion-dialog ?opened=${this._isOpen} @opened-changed=${this.handleDialog}>
        <div slot="content" class="dialog demo-box">
          Hello! You can close this notification here:
          <button class="close-button" @click=${this.toggleDialog(!1)}>⨯</button>
        </div>
      </lion-dialog>
    `}}customElements.define("dialog-trigger-demo",u);const b=()=>o`
    <style>
      ${s}
    </style>
    <lion-dialog is-alert-dialog class="dialog">
      <button type="button" slot="invoker">Reset</button>
      <div slot="content" class="demo-box">
        Are you sure you want to clear the input field?
        <button
          type="button"
          @click="${e=>e.target.dispatchEvent(new Event("close-overlay",{bubbles:!0}))}"
        >
          Yes
        </button>
        <button
          type="button"
          @click="${e=>e.target.dispatchEvent(new Event("close-overlay",{bubbles:!0}))}"
        >
          No
        </button>
      </div>
    </lion-dialog>
  `,m=()=>o`
    <style>
      ${s}
    </style>
    <div class="demo-box_placements">
      <dialog-trigger-demo></dialog-trigger-demo>
    </div>
  `,p=()=>{const e=t=>o`
      <lion-dialog .config="${{viewportConfig:{placement:t}}}">
        <button slot="invoker">Dialog ${t}</button>
        <div slot="content" class="dialog demo-box">
          Hello! You can close this notification here:
          <button
            class="close-button"
            @click="${c=>c.target.dispatchEvent(new Event("close-overlay",{bubbles:!0}))}"
          >
            ⨯
          </button>
        </div>
      </lion-dialog>
    `;return o`
    <style>
      ${s}
    </style>
    <div class="demo-box_placements">
      ${e("center")} ${e("top-left")} ${e("top-right")} ${e("bottom-left")}
      ${e("bottom-right")}
    </div>
  `},v=()=>{const e={hasBackdrop:!1,hidesOnEsc:!0,preventsScroll:!0,elementToFocusAfterHide:document.body};return o`
    <style>
      ${s}
    </style>
    <lion-dialog .config="${e}">
      <button slot="invoker">Click me to open dialog</button>
      <div slot="content" class="demo-dialog-content">
        Hello! You can close this dialog here:
        <button
          class="demo-dialog-content__close-button"
          @click="${t=>t.target.dispatchEvent(new Event("close-overlay",{bubbles:!0}))}"
        >
          ⨯
        </button>
      </div>
    </lion-dialog>
  `},y=document,h=[{key:"alertDialog",story:b},{key:"externalTrigger",story:m},{key:"placementOverrides",story:p},{key:"otherOverrides",story:v}];let a=!1;for(const e of h){const t=y.querySelector(`[mdjs-story-name="${e.key}"]`);t&&(t.story=e.story,t.key=e.key,a=!0,Object.assign(t,{simulatorUrl:"/next-preview/feat-lion-playground-rebased/simulator",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}a&&(customElements.get("mdjs-preview")||i(()=>import("./define.BWpRLYnc.js"),__vite__mapDeps([0,1,2,3,4,5,6,7])),customElements.get("mdjs-story")||i(()=>import("./define.BPRa0k46.js"),__vite__mapDeps([8,2,3])));export{b as alertDialog,m as externalTrigger,v as otherOverrides,p as placementOverrides};
