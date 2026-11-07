const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["_astro/define.D5IFK1jp.js","_astro/MdJsPreview.B62up6PK.js","_astro/lit-element.DxRhnkit.js","_astro/lit-html.BX7rm8u-.js","_astro/dedupeMixin.6XPTJgK8.js","_astro/lit-element.BOikny4r.js","_astro/uuid.DjYKNjre.js","_astro/define.DBgp7shK.js"])))=>i.map(i=>d[i]);
import{_ as i}from"./preload-helper.CVfkMyKi.js";import"./MdJsPreview.B62up6PK.js";import"./lit-element.DxRhnkit.js";import{b as o}from"./lit-html.BX7rm8u-.js";import"./unsafe-html.FHlAasnX.js";import{d as s}from"./demoStyle.Bc8IqpUo.js";import{a as n,i as r,b as l}from"./lit-element.BOikny4r.js";class d extends n{static get styles(){return[r`
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
    `}}customElements.define("slots-dialog-content",g);class u extends n{static get properties(){return{_isOpen:{state:!0}}}toggleDialog(e){return()=>this._isOpen=e}handleDialog(e){this._isOpen=e.detail.opened}render(){return l`
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
  `,p=()=>{const t=e=>o`
      <lion-dialog .config="${{viewportConfig:{placement:e}}}">
        <button slot="invoker">Dialog ${e}</button>
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
      ${t("center")} ${t("top-left")} ${t("top-right")} ${t("bottom-left")}
      ${t("bottom-right")}
    </div>
  `},v=()=>{const t={hasBackdrop:!1,hidesOnEsc:!0,preventsScroll:!0,elementToFocusAfterHide:document.body};return o`
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
  `},y=document,h=[{key:"alertDialog",story:b},{key:"externalTrigger",story:m},{key:"placementOverrides",story:p},{key:"otherOverrides",story:v}];let a=!1;for(const t of h){const e=y.querySelector(`[mdjs-story-name="${t.key}"]`);e&&(e.story=t.story,e.key=t.key,a=!0,Object.assign(e,{simulatorUrl:"/simulator",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}a&&(customElements.get("mdjs-preview")||i(()=>import("./define.D5IFK1jp.js"),__vite__mapDeps([0,1,2,3,4,5,6])),customElements.get("mdjs-story")||i(()=>import("./define.DBgp7shK.js"),__vite__mapDeps([7,2,3])));export{b as alertDialog,m as externalTrigger,v as otherOverrides,p as placementOverrides};
