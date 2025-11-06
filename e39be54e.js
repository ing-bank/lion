import{i as e,a as t,x as s}from"./b4be29f1.js";import{u as i}from"./24f95583.js";function n(e){e.removeAttribute("selected")}function d(e){e.removeAttribute("selected"),e.setAttribute("aria-selected","false"),e.setAttribute("tabindex","-1")}function r(e){const t=e;switch(t.key){case"ArrowDown":case"ArrowRight":case"ArrowUp":case"ArrowLeft":case"Home":case"End":t.preventDefault()}}class a extends e{static get properties(){return{selectedIndex:{type:Number,attribute:"selected-index",reflect:!0}}}static get styles(){return[t`
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
      `]}render(){return s`
      <div class="tabs__tab-group" role="tablist">
        <slot name="tab"></slot>
      </div>
      <div class="tabs__panels">
        <slot name="panel"></slot>
      </div>
    `}constructor(){super(),this.selectedIndex=0}firstUpdated(e){super.firstUpdated(e),this.__setupSlots(),this.tabs[0]?.disabled&&(this.selectedIndex=this.tabs.findIndex(e=>!e.disabled))}get tabs(){return Array.from(this.children).filter(e=>"tab"===e.slot)}get panels(){return Array.from(this.children).filter(e=>"panel"===e.slot)}static enabledWarnings=super.enabledWarnings?.filter(e=>"change-in-update"!==e)||[];__setupSlots(){if(this.shadowRoot){const e=this.shadowRoot.querySelector("slot[name=tab]"),t=()=>{this.__cleanStore(),this.__setupStore(),this.__updateSelected(!1)};e&&e.addEventListener("slotchange",t)}}__setupStore(){this.__store=[],this.tabs.length!==this.panels.length&&console.warn(`The amount of tabs (${this.tabs.length}) doesn't match the amount of panels (${this.panels.length}).`),this.tabs.forEach((e,t)=>{const s={uid:i(),el:e,button:e,panel:this.panels[t],clickHandler:this.__createButtonClickHandler(t),keydownHandler:r.bind(this),keyupHandler:this.__handleButtonKeyup.bind(this)};!function({el:e,uid:t}){e.setAttribute("id",`panel-${t}`),e.setAttribute("role","tabpanel"),e.setAttribute("aria-labelledby",`button-${t}`),e.hasAttribute("tabindex")||e.setAttribute("tabindex","0")}({...s,el:s.panel}),function({el:e,uid:t,clickHandler:s,keydownHandler:i,keyupHandler:n}){e.setAttribute("id",`button-${t}`),e.setAttribute("role","tab"),e.setAttribute("aria-controls",`panel-${t}`),e.addEventListener("click",s),e.addEventListener("keyup",n),e.addEventListener("keydown",i)}(s),n(s.panel),d(s.button),this.__store&&this.__store.push(s)})}__cleanStore(){this.__store&&(this.__store.forEach(e=>{!function({el:e,clickHandler:t,keydownHandler:s,keyupHandler:i}){e.removeAttribute("id"),e.removeAttribute("role"),e.removeAttribute("aria-controls"),e.removeEventListener("click",t),e.removeEventListener("keyup",i),e.removeEventListener("keydown",s)}(e)}),this.__store=[])}__getNextNotDisabledTab(e,t,s){let i=[];const n=e.filter((e,t)=>!e.disabled&&t>this.selectedIndex),d=e.filter((e,t)=>!e.disabled&&t<this.selectedIndex);return i="right"===s?[...n,...d]:[...d.reverse(),...n.reverse()],i[0]}__getNextAvailableIndex(e,t){const s=this.tabs[this.selectedIndex];if(this.tabs.every(e=>!e.disabled))return e;if("ArrowRight"===t||"ArrowDown"===t){const e=this.__getNextNotDisabledTab(this.tabs,s,"right");return this.tabs.findIndex(t=>e===t)}if("ArrowLeft"===t||"ArrowUp"===t){const e=this.__getNextNotDisabledTab(this.tabs,s,"left");return this.tabs.findIndex(t=>e===t)}if("Home"===t)return this.tabs.findIndex(e=>!e.disabled);if("End"===t){const e=this.tabs.map((e,t)=>({disabled:e.disabled,index:t})).filter(e=>!e.disabled);return e[e.length-1].index}return-1}__createButtonClickHandler(e){return()=>{this._setSelectedIndexWithFocus(e)}}__handleButtonKeyup(e){const t=e;if("number"==typeof this.selectedIndex)switch(t.key){case"ArrowDown":case"ArrowRight":this.selectedIndex+1>=this._pairCount?this._setSelectedIndexWithFocus(this.__getNextAvailableIndex(0,t.key)):this._setSelectedIndexWithFocus(this.__getNextAvailableIndex(this.selectedIndex+1,t.key));break;case"ArrowUp":case"ArrowLeft":this.selectedIndex<=0?this._setSelectedIndexWithFocus(this.__getNextAvailableIndex(this._pairCount-1,t.key)):this._setSelectedIndexWithFocus(this.__getNextAvailableIndex(this.selectedIndex-1,t.key));break;case"Home":this._setSelectedIndexWithFocus(this.__getNextAvailableIndex(0,t.key));break;case"End":this._setSelectedIndexWithFocus(this.__getNextAvailableIndex(this._pairCount-1,t.key))}}get selectedIndex(){return this.__selectedIndex||0}set selectedIndex(e){if(e===this.__selectedIndex)return;const t=this.__selectedIndex;this.__selectedIndex=e,this.__updateSelected(!1),this.dispatchEvent(new Event("selected-changed")),this.requestUpdate("selectedIndex",t)}_setSelectedIndexWithFocus(e){if(-1===e)return;const t=this.__selectedIndex;this.__selectedIndex=e,this.__updateSelected(!0),this.dispatchEvent(new Event("selected-changed")),this.requestUpdate("selectedIndex",t)}get _pairCount(){return this.__store&&this.__store.length||0}__updateSelected(e=!1){if(!this.__store||"number"!=typeof this.selectedIndex||!this.__store[this.selectedIndex])return;const t=this.tabs.find(e=>e.hasAttribute("selected")),s=this.panels.find(e=>e.hasAttribute("selected"));t&&d(t),s&&n(s);const{button:i,panel:r}=this.__store[this.selectedIndex];i&&function(e,t=!1){t&&e.focus(),e.setAttribute("selected","true"),e.setAttribute("aria-selected","true"),e.setAttribute("tabindex","0")}(i,e),r&&r.setAttribute("selected","true")}}export{a as L};
