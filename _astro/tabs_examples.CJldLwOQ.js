const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["_astro/define.BdbiuFq9.js","_astro/MdJsPreview.3BOxlSHn.js","_astro/lit-element.jD9bOQKo.js","_astro/lit-html.DtZEZPQ5.js","_astro/lit-element.BdYmZD4s.js","_astro/define.DNIVKtom.js"])))=>i.map(i=>d[i]);
import{_ as b}from"./preload-helper.CVfkMyKi.js";import"./MdJsPreview.3BOxlSHn.js";import{i as u,a as o}from"./lit-element.jD9bOQKo.js";import{x as d}from"./lit-html.DtZEZPQ5.js";import"./unsafe-html.DgrA3nwU.js";import{u as f}from"./uuid.CpLEyVDd.js";function x({el:t,uid:e}){t.setAttribute("id",`panel-${e}`),t.setAttribute("role","tabpanel"),t.setAttribute("aria-labelledby",`button-${e}`),t.hasAttribute("tabindex")||t.setAttribute("tabindex","0")}function g(t){t.setAttribute("selected","true")}function h(t){t.removeAttribute("selected")}function m({el:t,uid:e,clickHandler:s,keydownHandler:i,keyupHandler:a}){t.setAttribute("id",`button-${e}`),t.setAttribute("role","tab"),t.setAttribute("aria-controls",`panel-${e}`),t.addEventListener("click",s),t.addEventListener("keyup",a),t.addEventListener("keydown",i)}function y({el:t,clickHandler:e,keydownHandler:s,keyupHandler:i}){t.removeAttribute("id"),t.removeAttribute("role"),t.removeAttribute("aria-controls"),t.removeEventListener("click",e),t.removeEventListener("keyup",i),t.removeEventListener("keydown",s)}function k(t,e=!1){e&&t.focus(),t.setAttribute("selected","true"),t.setAttribute("aria-selected","true"),t.setAttribute("tabindex","0")}function p(t){t.removeAttribute("selected"),t.setAttribute("aria-selected","false"),t.setAttribute("tabindex","-1")}function I(t){const e=t;switch(e.key){case"ArrowDown":case"ArrowRight":case"ArrowUp":case"ArrowLeft":case"Home":case"End":e.preventDefault()}}class v extends u{static get properties(){return{selectedIndex:{type:Number,attribute:"selected-index",reflect:!0}}}static get styles(){return[o`
        .tabs__tab-group {
          display: flex;
        }

        .tabs__tab-group ::slotted([slot='tab'][selected]) {
          font-weight: bold;
        }

        .tabs__panels ::slotted([slot='panel']) {
          visibility: hidden;
          display: none;
        }

        .tabs__panels ::slotted([slot='panel'][selected]) {
          visibility: visible;
          display: block;
        }

        .tabs__panels {
          display: block;
        }
      `]}render(){return d`
      <div class="tabs__tab-group" role="tablist">
        <slot name="tab"></slot>
      </div>
      <div class="tabs__panels">
        <slot name="panel"></slot>
      </div>
    `}constructor(){super(),this.selectedIndex=0}firstUpdated(e){super.firstUpdated(e),this.__setupSlots(),this.tabs[0]?.disabled&&(this.selectedIndex=this.tabs.findIndex(s=>!s.disabled))}get tabs(){return Array.from(this.children).filter(e=>e.slot==="tab")}get panels(){return Array.from(this.children).filter(e=>e.slot==="panel")}static enabledWarnings=super.enabledWarnings?.filter(e=>e!=="change-in-update")||[];__setupSlots(){if(this.shadowRoot){const e=this.shadowRoot.querySelector("slot[name=tab]"),s=()=>{this.__cleanStore(),this.__setupStore(),this.__updateSelected(!1)};e&&e.addEventListener("slotchange",s)}}__setupStore(){this.__store=[],this.tabs.length!==this.panels.length&&console.warn(`The amount of tabs (${this.tabs.length}) doesn't match the amount of panels (${this.panels.length}).`),this.tabs.forEach((e,s)=>{const i=f(),a=this.panels[s],n={uid:i,el:e,button:e,panel:a,clickHandler:this.__createButtonClickHandler(s),keydownHandler:I.bind(this),keyupHandler:this.__handleButtonKeyup.bind(this)};x({...n,el:n.panel}),m(n),h(n.panel),p(n.button),this.__store&&this.__store.push(n)})}__cleanStore(){this.__store&&(this.__store.forEach(e=>{y(e)}),this.__store=[])}__getNextNotDisabledTab(e,s,i){let a=[];const n=e.filter((l,c)=>!l.disabled&&c>this.selectedIndex),r=e.filter((l,c)=>!l.disabled&&c<this.selectedIndex);return i==="right"?a=[...n,...r]:a=[...r.reverse(),...n.reverse()],a[0]}__getNextAvailableIndex(e,s){const i=this.tabs[this.selectedIndex];if(this.tabs.every(a=>!a.disabled))return e;if(s==="ArrowRight"||s==="ArrowDown"){const a=this.__getNextNotDisabledTab(this.tabs,i,"right");return this.tabs.findIndex(n=>a===n)}if(s==="ArrowLeft"||s==="ArrowUp"){const a=this.__getNextNotDisabledTab(this.tabs,i,"left");return this.tabs.findIndex(n=>a===n)}if(s==="Home")return this.tabs.findIndex(a=>!a.disabled);if(s==="End"){const a=this.tabs.map((n,r)=>({disabled:n.disabled,index:r})).filter(n=>!n.disabled);return a[a.length-1].index}return-1}__createButtonClickHandler(e){return()=>{this._setSelectedIndexWithFocus(e)}}__handleButtonKeyup(e){const s=e;if(typeof this.selectedIndex=="number")switch(s.key){case"ArrowDown":case"ArrowRight":this.selectedIndex+1>=this._pairCount?this._setSelectedIndexWithFocus(this.__getNextAvailableIndex(0,s.key)):this._setSelectedIndexWithFocus(this.__getNextAvailableIndex(this.selectedIndex+1,s.key));break;case"ArrowUp":case"ArrowLeft":this.selectedIndex<=0?this._setSelectedIndexWithFocus(this.__getNextAvailableIndex(this._pairCount-1,s.key)):this._setSelectedIndexWithFocus(this.__getNextAvailableIndex(this.selectedIndex-1,s.key));break;case"Home":this._setSelectedIndexWithFocus(this.__getNextAvailableIndex(0,s.key));break;case"End":this._setSelectedIndexWithFocus(this.__getNextAvailableIndex(this._pairCount-1,s.key));break}}get selectedIndex(){return this.__selectedIndex||0}set selectedIndex(e){if(e===this.__selectedIndex)return;const s=this.__selectedIndex;this.__selectedIndex=e,this.__updateSelected(!1),this.dispatchEvent(new Event("selected-changed")),this.requestUpdate("selectedIndex",s)}_setSelectedIndexWithFocus(e){if(e===-1)return;const s=this.__selectedIndex;this.__selectedIndex=e,this.__updateSelected(!0),this.dispatchEvent(new Event("selected-changed")),this.requestUpdate("selectedIndex",s)}get _pairCount(){return this.__store&&this.__store.length||0}__updateSelected(e=!1){if(!(this.__store&&typeof this.selectedIndex=="number"&&this.__store[this.selectedIndex]))return;const s=this.tabs.find(r=>r.hasAttribute("selected")),i=this.panels.find(r=>r.hasAttribute("selected"));s&&p(s),i&&h(i);const{button:a,panel:n}=this.__store[this.selectedIndex];a&&k(a,e),n&&g(n)}}class A extends v{static get styles(){return[...super.styles,o`
        :host {
          background: #222;
          display: block;
          padding: 20px;
        }
      `]}connectedCallback(){super.connectedCallback(),this._setupFeature()}_setupFeature(){}}customElements.define("lea-tabs",A);class w extends u{static get styles(){return o`
      :host {
        box-shadow: -4px 0 0 rgba(0, 0, 0, 0.2);
        background: #ad1c1c;
        background: linear-gradient(220deg, transparent 10px, #ad1c1c 10px);
        text-shadow: 0 1px 0 rgba(0, 0, 0, 0.5);
        color: #fff;
        float: left;
        font:
          bold 12px/35px 'Lucida sans',
          Arial,
          Helvetica;
        height: 35px;
        padding: 0 30px;
        text-decoration: none;
      }

      :host(:hover) {
        background: #c93434;
        background: linear-gradient(220deg, transparent 10px, #c93434 10px);
      }

      :host(:focus) {
        border-radius: 4px;
        box-shadow:
          0 0 8px #9fcaea,
          0 0 0 1px #559bd1;

        /* outline: 0; */
      }

      :host([selected]) {
        background: #fff;
        background: linear-gradient(220deg, transparent 10px, #fff 10px);
        text-shadow: none;
        color: #333;
      }
    `}render(){return d`<slot></slot>`}}customElements.define("lea-tab",w);class E extends u{static get styles(){return o`
      :host {
        background-color: #fff;
        background-image: linear-gradient(top, #fff, #ddd);
        border-radius: 0 2px 2px 2px;
        box-shadow:
          0 2px 2px #000,
          0 -1px 0 #fff inset;
        padding: 30px;
      }
    `}render(){return d`
      <!-- dom as needed -->
      <slot></slot>
    `}}customElements.define("lea-tab-panel",E);const S=()=>d`
  <lea-tabs>
    <lea-tab slot="tab">Info</lea-tab>
    <lea-tab-panel slot="panel"> Info page with lots of information about us. </lea-tab-panel>
    <lea-tab slot="tab">Work</lea-tab>
    <lea-tab-panel slot="panel"> Work page that showcases our work. </lea-tab-panel>
  </lea-tabs>
`,N=document,L=[{key:"main",story:S}];let _=!1;for(const t of L){const e=N.querySelector(`[mdjs-story-name="${t.key}"]`);e&&(e.story=t.story,e.key=t.key,_=!0,Object.assign(e,{simulatorUrl:"/simulator",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}_&&(customElements.get("mdjs-preview")||b(()=>import("./define.BdbiuFq9.js"),__vite__mapDeps([0,1,2,3,4])),customElements.get("mdjs-story")||b(()=>import("./define.DNIVKtom.js"),__vite__mapDeps([5,2,3])));export{S as main};
