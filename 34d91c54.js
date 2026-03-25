import{i as e,a as t,x as s}from"./b8bc2eda.js";import{u as n}from"./6722e641.js";class o extends e{static get properties(){return{focusedIndex:{type:Number},expanded:{type:Array},exclusive:{type:Boolean}}}static get styles(){return[t`
        .accordion {
          display: flex;
          flex-direction: column;
        }

        .accordion ::slotted(.invoker) {
          margin: 0;
        }

        .accordion ::slotted(.invoker)[expanded] {
          font-weight: bold;
        }

        .accordion ::slotted(.content) {
          margin: 0;
          visibility: hidden;
          display: none;
        }

        .accordion ::slotted(.content[expanded]) {
          visibility: visible;
          display: block;
        }
      `]}set focusedIndex(e){const t=this.__focusedIndex;this.__focusedIndex=e,this.__updateFocused(),this.dispatchEvent(new Event("focused-changed")),this.requestUpdate("focusedIndex",t)}get focusedIndex(){return this.__focusedIndex}set expanded(e){const t=this.__expanded;this.__expanded=e,this.__updateExpanded(),this.dispatchEvent(new Event("expanded-changed")),this.requestUpdate("expanded",t)}get expanded(){return this.__expanded}constructor(){super(),this.styles={},this.exclusive=!1,this.__store=[],this.__focusedIndex=-1,this.__expanded=[]}firstUpdated(e){super.firstUpdated(e),this.__setupSlots()}render(){return s`
      <div class="accordion">
        <slot name="invoker"></slot>
        <slot name="content"></slot>
        <slot name="_accordion"></slot>
      </div>
    `}__setupSlots(){const e=this.shadowRoot?.querySelector("slot[name=invoker]"),t=()=>{e.assignedNodes().length>0&&(this.__cleanStore(),this.__setupStore(),this.__updateFocused(),this.__updateExpanded())};e&&e.addEventListener("slotchange",t)}__setupStore(){const e=this.shadowRoot?.querySelector("slot[name=_accordion]"),t=e?e.assignedElements().filter(e=>e.classList.contains("invoker")):[],s=e?e.assignedElements().filter(e=>e.classList.contains("content")):[],o=[...Array.from(t),...Array.from(this.querySelectorAll(':scope > [slot="invoker"]'))],r=[...Array.from(s),...Array.from(this.querySelectorAll(':scope > [slot="content"]'))];o.length!==r.length&&console.warn(`The amount of invokers (${o.length}) doesn't match the amount of contents (${r.length}).`),o.forEach((e,t)=>{const s={uid:n(),index:t,invoker:e,content:r[t],clickHandler:this.__createInvokerClickHandler(t),keydownHandler:this.__handleInvokerKeydown.bind(this),focusHandler:this.__createInvokerFocusHandler(t)};this._setupContent(s),this._setupInvoker(s),this._unfocusInvoker(s),this._collapse(s),this.__store.push(s)}),this.__rearrangeInvokersAndContent()}__rearrangeInvokersAndContent(){const e=Array.from(this.children).filter(e=>"invoker"===e.slot),t=Array.from(this.children).filter(e=>"content"===e.slot),s=this.shadowRoot?.querySelector("slot[name=_accordion]");s&&e.forEach((e,s)=>{e.classList.add("invoker"),e.slot="_accordion",t[s].classList.add("content"),t[s].slot="_accordion"})}__createInvokerClickHandler(e){return()=>{this.focusedIndex=e,this.__toggleExpanded(e)}}__createInvokerFocusHandler(e){return()=>{e!==this.focusedIndex&&(this.focusedIndex=e)}}__handleInvokerKeydown(e){const t=e;switch(t.key){case"ArrowDown":case"ArrowRight":t.preventDefault(),this.focusedIndex+2<=this._pairCount&&(this.focusedIndex+=1);break;case"ArrowUp":case"ArrowLeft":t.preventDefault(),this.focusedIndex>=1&&(this.focusedIndex-=1);break;case"Home":t.preventDefault(),this.focusedIndex=0;break;case"End":t.preventDefault(),this.focusedIndex=this._pairCount-1}}get _pairCount(){return this.__store.length}_setupContent(e){const{content:t,index:s,uid:n}=e;t.style.setProperty("order",`${s+1}`),t.setAttribute("id",`content-${n}`),t.setAttribute("aria-labelledby",`invoker-${n}`)}_setupInvoker(e){const{invoker:t,uid:s,index:n,clickHandler:o,keydownHandler:r,focusHandler:i}=e;t.style.setProperty("order",`${n+1}`);const d=t.firstElementChild;d&&(d.setAttribute("id",`invoker-${s}`),d.setAttribute("aria-controls",`content-${s}`),d.addEventListener("click",o),d.addEventListener("keydown",r),d.addEventListener("focusin",i))}_cleanInvoker(e){const{invoker:t,clickHandler:s,keydownHandler:n,focusHandler:o}=e,r=t.firstElementChild;r&&(r.removeAttribute("id"),r.removeAttribute("aria-controls"),r.removeEventListener("click",s),r.removeEventListener("keydown",n),r.removeEventListener("focusin",o))}_focusInvoker(e){const{invoker:t}=e,s=t.firstElementChild;s&&(s.focus(),s.setAttribute("focused","true"))}_unfocusInvoker(e){const{invoker:t}=e,s=t.firstElementChild;s&&s.removeAttribute("focused")}_collapse(e){const{content:t,invoker:s}=e;t.removeAttribute("expanded"),s.removeAttribute("expanded");const n=s.firstElementChild;n&&(n.removeAttribute("expanded"),n.setAttribute("aria-expanded","false"))}_expand(e){const{content:t,invoker:s}=e;t.setAttribute("expanded","true"),s.setAttribute("expanded","true");const n=s.firstElementChild;n&&(n.setAttribute("expanded","true"),n.setAttribute("aria-expanded","true"))}__updateFocused(){const e=this.__store[this.focusedIndex],t=Array.from(this.__store).find(e=>e.invoker&&e.invoker.firstElementChild?.hasAttribute("focused"));t&&this._unfocusInvoker(t),e&&this._focusInvoker(e)}__updateExpanded(){this.__store&&this.__store.forEach((e,t)=>{-1!==this.expanded.indexOf(t)?this._expand(e):this._collapse(e)})}__toggleExpanded(e){const t=this.expanded.indexOf(e),s=this.exclusive?[]:[...this.expanded];-1===t?s.push(e):s.splice(t,1),this.expanded=s}__cleanStore(){this.__store&&(this.__store.forEach(e=>{this._cleanInvoker(e)}),this.__store=[])}}export{o as L};
