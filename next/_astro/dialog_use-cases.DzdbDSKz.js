const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["_astro/define.DYUong5B.js","_astro/node-tools_providence-analytics_overview.LFFQBZzG.js","_astro/lit-element.qDHKJJma.js","_astro/lit-html.C7L4dwLU.js","_astro/unsafe-html.J0GGe2Q7.js","_astro/directive.CGE4aKEl.js","_astro/define.m2CvvXyF.js"])))=>i.map(i=>d[i]);
import{_ as l}from"./preload-helper.4zY6-HO4.js";import"./node-tools_providence-analytics_overview.LFFQBZzG.js";import{i as n,a as i}from"./lit-element.qDHKJJma.js";import{x as o}from"./lit-html.C7L4dwLU.js";import"./unsafe-html.J0GGe2Q7.js";import{d as s}from"./demoStyle.D0judq0C.js";import"./directive.CGE4aKEl.js";import"./OverlayMixin.yM-HkbSu.js";import"./index.BNCfcFQh.js";import"./lazifyInstantiation.CgYLRMC3.js";import"./dedupeMixin.6XPTJgK8.js";import"./withModalDialogConfig.CPyLhuB7.js";import"./withClickInteraction.B1DPetIk.js";class c extends n{static get styles(){return[i`
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
      `]}_closeOverlay(){this.dispatchEvent(new Event("close-overlay",{bubbles:!0}))}render(){return o`
      <div><p>Hello person who opened the dialog!</p></div>
      <div>
        <p>Look how nice this <span class="nice">dialog</span> looks!</p>
      </div>
      <button class="close-button" @click="${this._closeOverlay}">⨯</button>
    `}}customElements.define("styled-dialog-content",c);class d extends n{static get styles(){return[i`
        :host {
          background-color: #fff;
        }
        .actions {
          border-top: 2px solid green;
        }
      `]}_closeOverlay(){this.dispatchEvent(new Event("close-overlay",{bubbles:!0}))}render(){return o`
      <p>This content contains an actions slot</p>
      <div class="actions">
        <slot name="actions"></slot>
      </div>
      <button class="close-button" @click="${this._closeOverlay}">⨯</button>
    `}}customElements.define("slots-dialog-content",d);class g extends n{static get properties(){return{_isOpen:{state:!0}}}toggleDialog(e){return()=>this._isOpen=e}handleDialog(e){this._isOpen=e.detail.opened}render(){return o`
      <button @click=${this.toggleDialog(!0)}>Open dialog</button>
      <lion-dialog ?opened=${this._isOpen} @opened-changed=${this.handleDialog}>
        <div slot="content" class="dialog demo-box">
          Hello! You can close this notification here:
          <button class="close-button" @click=${this.toggleDialog(!1)}>⨯</button>
        </div>
      </lion-dialog>
    `}}customElements.define("dialog-trigger-demo",g);const u=()=>o`
    <style>
      ${s}
    </style>
    <lion-dialog is-alert-dialog class="dialog">
      <button type="button" slot="invoker">Reset</button>
      <div slot="content" class="demo-box">
        Are you sure you want to clear the input field?
        <button
          type="button"
          @click="${t=>t.target.dispatchEvent(new Event("close-overlay",{bubbles:!0}))}"
        >
          Yes
        </button>
        <button
          type="button"
          @click="${t=>t.target.dispatchEvent(new Event("close-overlay",{bubbles:!0}))}"
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
  `,b=()=>{const t=e=>o`
      <lion-dialog .config="${{viewportConfig:{placement:e}}}">
        <button slot="invoker">Dialog ${e}</button>
        <div slot="content" class="dialog demo-box">
          Hello! You can close this notification here:
          <button
            class="close-button"
            @click="${a=>a.target.dispatchEvent(new Event("close-overlay",{bubbles:!0}))}"
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
      ${t("center")} ${t("top-left")} ${t("top-right")} ${t("bottom-left")}
      ${t("bottom-right")}
    </div>
  `},p=()=>{const t={hasBackdrop:!1,hidesOnEsc:!0,preventsScroll:!0,elementToFocusAfterHide:document.body};return o`
    <style>
      ${s}
    </style>
    <lion-dialog .config="${t}">
      <button slot="invoker">Click me to open dialog</button>
      <div slot="content" class="demo-dialog-content">
        Hello! You can close this dialog here:
        <button
          class="demo-dialog-content__close-button"
          @click="${e=>e.target.dispatchEvent(new Event("close-overlay",{bubbles:!0}))}"
        >
          ⨯
        </button>
      </div>
    </lion-dialog>
  `},v=document,y=[{key:"alertDialog",story:u},{key:"externalTrigger",story:m},{key:"placementOverrides",story:b},{key:"otherOverrides",story:p}];let r=!1;for(const t of y){const e=v.querySelector(`[mdjs-story-name="${t.key}"]`);e&&(e.story=t.story,e.key=t.key,r=!0,Object.assign(e,{simulatorUrl:"/next/simulator/",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}r&&(customElements.get("mdjs-preview")||l(()=>import("./define.DYUong5B.js"),__vite__mapDeps([0,1,2,3,4,5])),customElements.get("mdjs-story")||l(()=>import("./define.m2CvvXyF.js"),__vite__mapDeps([6,2,3])));export{u as alertDialog,m as externalTrigger,p as otherOverrides,b as placementOverrides};
