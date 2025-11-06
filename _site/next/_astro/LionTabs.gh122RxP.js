import{i as h,a as u}from"./lit-element.qDHKJJma.js";import{x as b}from"./lit-html.C7L4dwLU.js";import{u as _}from"./node-tools_providence-analytics_overview.LFFQBZzG.js";function p({el:t,uid:e}){t.setAttribute("id",`panel-${e}`),t.setAttribute("role","tabpanel"),t.setAttribute("aria-labelledby",`button-${e}`),t.hasAttribute("tabindex")||t.setAttribute("tabindex","0")}function f(t){t.setAttribute("selected","true")}function o(t){t.removeAttribute("selected")}function x({el:t,uid:e,clickHandler:s,keydownHandler:a,keyupHandler:i}){t.setAttribute("id",`button-${e}`),t.setAttribute("role","tab"),t.setAttribute("aria-controls",`panel-${e}`),t.addEventListener("click",s),t.addEventListener("keyup",i),t.addEventListener("keydown",a)}function I({el:t,clickHandler:e,keydownHandler:s,keyupHandler:a}){t.removeAttribute("id"),t.removeAttribute("role"),t.removeAttribute("aria-controls"),t.removeEventListener("click",e),t.removeEventListener("keyup",a),t.removeEventListener("keydown",s)}function A(t,e=!1){e&&t.focus(),t.setAttribute("selected","true"),t.setAttribute("aria-selected","true"),t.setAttribute("tabindex","0")}function c(t){t.removeAttribute("selected"),t.setAttribute("aria-selected","false"),t.setAttribute("tabindex","-1")}function v(t){const e=t;switch(e.key){case"ArrowDown":case"ArrowRight":case"ArrowUp":case"ArrowLeft":case"Home":case"End":e.preventDefault()}}class w extends h{static get properties(){return{selectedIndex:{type:Number,attribute:"selected-index",reflect:!0}}}static get styles(){return[u`
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
      `]}render(){return b`
      <div class="tabs__tab-group" role="tablist">
        <slot name="tab"></slot>
      </div>
      <div class="tabs__panels">
        <slot name="panel"></slot>
      </div>
    `}constructor(){super(),this.selectedIndex=0}firstUpdated(e){super.firstUpdated(e),this.__setupSlots(),this.tabs[0]?.disabled&&(this.selectedIndex=this.tabs.findIndex(s=>!s.disabled))}get tabs(){return Array.from(this.children).filter(e=>e.slot==="tab")}get panels(){return Array.from(this.children).filter(e=>e.slot==="panel")}static enabledWarnings=super.enabledWarnings?.filter(e=>e!=="change-in-update")||[];__setupSlots(){if(this.shadowRoot){const e=this.shadowRoot.querySelector("slot[name=tab]"),s=()=>{this.__cleanStore(),this.__setupStore(),this.__updateSelected(!1)};e&&e.addEventListener("slotchange",s)}}__setupStore(){this.__store=[],this.tabs.length!==this.panels.length&&console.warn(`The amount of tabs (${this.tabs.length}) doesn't match the amount of panels (${this.panels.length}).`),this.tabs.forEach((e,s)=>{const a=_(),i=this.panels[s],n={uid:a,el:e,button:e,panel:i,clickHandler:this.__createButtonClickHandler(s),keydownHandler:v.bind(this),keyupHandler:this.__handleButtonKeyup.bind(this)};p({...n,el:n.panel}),x(n),o(n.panel),c(n.button),this.__store&&this.__store.push(n)})}__cleanStore(){this.__store&&(this.__store.forEach(e=>{I(e)}),this.__store=[])}__getNextNotDisabledTab(e,s,a){let i=[];const n=e.filter((d,l)=>!d.disabled&&l>this.selectedIndex),r=e.filter((d,l)=>!d.disabled&&l<this.selectedIndex);return a==="right"?i=[...n,...r]:i=[...r.reverse(),...n.reverse()],i[0]}__getNextAvailableIndex(e,s){const a=this.tabs[this.selectedIndex];if(this.tabs.every(i=>!i.disabled))return e;if(s==="ArrowRight"||s==="ArrowDown"){const i=this.__getNextNotDisabledTab(this.tabs,a,"right");return this.tabs.findIndex(n=>i===n)}if(s==="ArrowLeft"||s==="ArrowUp"){const i=this.__getNextNotDisabledTab(this.tabs,a,"left");return this.tabs.findIndex(n=>i===n)}if(s==="Home")return this.tabs.findIndex(i=>!i.disabled);if(s==="End"){const i=this.tabs.map((n,r)=>({disabled:n.disabled,index:r})).filter(n=>!n.disabled);return i[i.length-1].index}return-1}__createButtonClickHandler(e){return()=>{this._setSelectedIndexWithFocus(e)}}__handleButtonKeyup(e){const s=e;if(typeof this.selectedIndex=="number")switch(s.key){case"ArrowDown":case"ArrowRight":this.selectedIndex+1>=this._pairCount?this._setSelectedIndexWithFocus(this.__getNextAvailableIndex(0,s.key)):this._setSelectedIndexWithFocus(this.__getNextAvailableIndex(this.selectedIndex+1,s.key));break;case"ArrowUp":case"ArrowLeft":this.selectedIndex<=0?this._setSelectedIndexWithFocus(this.__getNextAvailableIndex(this._pairCount-1,s.key)):this._setSelectedIndexWithFocus(this.__getNextAvailableIndex(this.selectedIndex-1,s.key));break;case"Home":this._setSelectedIndexWithFocus(this.__getNextAvailableIndex(0,s.key));break;case"End":this._setSelectedIndexWithFocus(this.__getNextAvailableIndex(this._pairCount-1,s.key));break}}get selectedIndex(){return this.__selectedIndex||0}set selectedIndex(e){if(e===this.__selectedIndex)return;const s=this.__selectedIndex;this.__selectedIndex=e,this.__updateSelected(!1),this.dispatchEvent(new Event("selected-changed")),this.requestUpdate("selectedIndex",s)}_setSelectedIndexWithFocus(e){if(e===-1)return;const s=this.__selectedIndex;this.__selectedIndex=e,this.__updateSelected(!0),this.dispatchEvent(new Event("selected-changed")),this.requestUpdate("selectedIndex",s)}get _pairCount(){return this.__store&&this.__store.length||0}__updateSelected(e=!1){if(!(this.__store&&typeof this.selectedIndex=="number"&&this.__store[this.selectedIndex]))return;const s=this.tabs.find(r=>r.hasAttribute("selected")),a=this.panels.find(r=>r.hasAttribute("selected"));s&&c(s),a&&o(a);const{button:i,panel:n}=this.__store[this.selectedIndex];i&&A(i,e),n&&f(n)}}export{w as L};
