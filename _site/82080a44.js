import"./24f95583.js";import{i as t,a as e,x as o}from"./b4be29f1.js";import"./05905ff1.js";import{d as s}from"./f97918e5.js";import"./65cdf028.js";import"./4afec9a2.js";import"./11b71ee2.js";import"./dc2f5f5a.js";import"./c84885cc.js";import"./0ed5d59c.js";customElements.define("styled-dialog-content",class extends t{static get styles(){return[e`
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
    `}});customElements.define("slots-dialog-content",class extends t{static get styles(){return[e`
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
    `}});customElements.define("dialog-trigger-demo",class extends t{static get properties(){return{_isOpen:{state:!0}}}toggleDialog(t){return()=>this._isOpen=t}handleDialog(t){this._isOpen=t.detail.opened}render(){return o`
      <button @click=${this.toggleDialog(!0)}>Open dialog</button>
      <lion-dialog ?opened=${this._isOpen} @opened-changed=${this.handleDialog}>
        <div slot="content" class="dialog demo-box">
          Hello! You can close this notification here:
          <button class="close-button" @click=${this.toggleDialog(!1)}>⨯</button>
        </div>
      </lion-dialog>
    `}});const n=()=>o`
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
  `,l=()=>o`
    <style>
      ${s}
    </style>
    <div class="demo-box_placements">
      <dialog-trigger-demo></dialog-trigger-demo>
    </div>
  `,i=()=>{const t=t=>o`
      <lion-dialog .config="${{viewportConfig:{placement:t}}}">
        <button slot="invoker">Dialog ${t}</button>
        <div slot="content" class="dialog demo-box">
          Hello! You can close this notification here:
          <button
            class="close-button"
            @click="${t=>t.target.dispatchEvent(new Event("close-overlay",{bubbles:!0}))}"
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
  `},c=()=>{const t={hasBackdrop:!1,hidesOnEsc:!0,preventsScroll:!0,elementToFocusAfterHide:document.body};return o`
    <style>
      ${s}
    </style>
    <lion-dialog .config="${t}">
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
  `},a=document,r=[{key:"alertDialog",story:n},{key:"externalTrigger",story:l},{key:"placementOverrides",story:i},{key:"otherOverrides",story:c}];let d=!1;for(const t of r){const e=a.querySelector(`[mdjs-story-name="${t.key}"]`);e&&(e.story=t.story,e.key=t.key,d=!0,Object.assign(e,{simulatorUrl:"/simulator/",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}d&&(customElements.get("mdjs-preview")||import("./a7b4f51b.js"),customElements.get("mdjs-story")||import("./cddf006a.js"));export{n as alertDialog,l as externalTrigger,c as otherOverrides,i as placementOverrides};
