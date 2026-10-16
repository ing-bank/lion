import{i as l,a as u}from"./lit-element.jD9bOQKo.js";import{x as h}from"./lit-html.DtZEZPQ5.js";import{u as _}from"./uuid.DjYKNjre.js";class k extends l{static get properties(){return{focusedIndex:{type:Number},expanded:{type:Array},exclusive:{type:Boolean}}}static get styles(){return[u`
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
      `]}set focusedIndex(e){const t=this.__focusedIndex;this.__focusedIndex=e,this.__updateFocused(),this.dispatchEvent(new Event("focused-changed")),this.requestUpdate("focusedIndex",t)}get focusedIndex(){return this.__focusedIndex}set expanded(e){const t=this.__expanded;this.__expanded=e,this.__updateExpanded(),this.dispatchEvent(new Event("expanded-changed")),this.requestUpdate("expanded",t)}get expanded(){return this.__expanded}__focusedIndex=-1;__expanded=[];__store;constructor(){super(),this.styles={},this.exclusive=!1,this.__store=[]}firstUpdated(e){super.firstUpdated(e),this.__setupSlots()}render(){return h`
      <div class="accordion">
        <slot name="invoker"></slot>
        <slot name="content"></slot>
        <slot name="_accordion"></slot>
      </div>
    `}__setupSlots(){const e=this.shadowRoot?.querySelector("slot[name=invoker]"),t=()=>{e.assignedNodes().length>0&&(this.__cleanStore(),this.__setupStore(),this.__updateFocused(),this.__updateExpanded())};e&&e.addEventListener("slotchange",t)}__setupStore(){const e=this.shadowRoot?.querySelector("slot[name=_accordion]"),t=e?e.assignedElements().filter(o=>o.classList.contains("invoker")):[],n=e?e.assignedElements().filter(o=>o.classList.contains("content")):[],s=[...Array.from(t),...Array.from(this.querySelectorAll(':scope > [slot="invoker"]'))],r=[...Array.from(n),...Array.from(this.querySelectorAll(':scope > [slot="content"]'))];s.length!==r.length&&console.warn(`The amount of invokers (${s.length}) doesn't match the amount of contents (${r.length}).`),s.forEach((o,d)=>{const i=_(),a=r[d],c={uid:i,index:d,invoker:o,content:a,clickHandler:this.__createInvokerClickHandler(d),keydownHandler:this.__handleInvokerKeydown.bind(this),focusHandler:this.__createInvokerFocusHandler(d)};this._setupContent(c),this._setupInvoker(c),this._unfocusInvoker(c),this._collapse(c),this.__store.push(c)}),this.__rearrangeInvokersAndContent()}__rearrangeInvokersAndContent(){const e=Array.from(this.children).filter(s=>s.slot==="invoker"),t=Array.from(this.children).filter(s=>s.slot==="content");this.shadowRoot?.querySelector("slot[name=_accordion]")&&e.forEach((s,r)=>{s.classList.add("invoker"),s.slot="_accordion",t[r].classList.add("content"),t[r].slot="_accordion"})}__createInvokerClickHandler(e){return()=>{this.focusedIndex=e,this.__toggleExpanded(e)}}__createInvokerFocusHandler(e){return()=>{e!==this.focusedIndex&&(this.focusedIndex=e)}}__handleInvokerKeydown(e){const t=e;switch(t.key){case"ArrowDown":case"ArrowRight":t.preventDefault(),this.focusedIndex+2<=this._pairCount&&(this.focusedIndex+=1);break;case"ArrowUp":case"ArrowLeft":t.preventDefault(),this.focusedIndex>=1&&(this.focusedIndex-=1);break;case"Home":t.preventDefault(),this.focusedIndex=0;break;case"End":t.preventDefault(),this.focusedIndex=this._pairCount-1;break}}get _pairCount(){return this.__store.length}_setupContent(e){const{content:t,index:n,uid:s}=e;t.style.setProperty("order",`${n+1}`),t.setAttribute("id",`content-${s}`),t.setAttribute("aria-labelledby",`invoker-${s}`)}_setupInvoker(e){const{invoker:t,uid:n,index:s,clickHandler:r,keydownHandler:o,focusHandler:d}=e;t.style.setProperty("order",`${s+1}`);const i=t.firstElementChild;i&&(i.setAttribute("id",`invoker-${n}`),i.setAttribute("aria-controls",`content-${n}`),i.addEventListener("click",r),i.addEventListener("keydown",o),i.addEventListener("focusin",d))}_cleanInvoker(e){const{invoker:t,clickHandler:n,keydownHandler:s,focusHandler:r}=e,o=t.firstElementChild;o&&(o.removeAttribute("id"),o.removeAttribute("aria-controls"),o.removeEventListener("click",n),o.removeEventListener("keydown",s),o.removeEventListener("focusin",r))}_focusInvoker(e){const{invoker:t}=e,n=t.firstElementChild;n&&(n.focus(),n.setAttribute("focused","true"))}_unfocusInvoker(e){const{invoker:t}=e,n=t.firstElementChild;n&&n.removeAttribute("focused")}_collapse(e){const{content:t,invoker:n}=e;t.removeAttribute("expanded"),n.removeAttribute("expanded");const s=n.firstElementChild;s&&(s.removeAttribute("expanded"),s.setAttribute("aria-expanded","false"))}_expand(e){const{content:t,invoker:n}=e;t.setAttribute("expanded","true"),n.setAttribute("expanded","true");const s=n.firstElementChild;s&&(s.setAttribute("expanded","true"),s.setAttribute("aria-expanded","true"))}__updateFocused(){const e=this.__store[this.focusedIndex],t=Array.from(this.__store).find(n=>n.invoker&&n.invoker.firstElementChild?.hasAttribute("focused"));t&&this._unfocusInvoker(t),e&&this._focusInvoker(e)}__updateExpanded(){this.__store&&this.__store.forEach((e,t)=>{this.expanded.indexOf(t)!==-1?this._expand(e):this._collapse(e)})}__toggleExpanded(e){const t=this.expanded.indexOf(e),n=this.exclusive?[]:[...this.expanded];t===-1?n.push(e):n.splice(t,1),this.expanded=n}__cleanStore(){this.__store&&(this.__store.forEach(e=>{this._cleanInvoker(e)}),this.__store=[])}}export{k as L};
