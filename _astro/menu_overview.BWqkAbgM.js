const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["_astro/define.BdbiuFq9.js","_astro/MdJsPreview.3BOxlSHn.js","_astro/lit-element.jD9bOQKo.js","_astro/lit-html.DtZEZPQ5.js","_astro/lit-element.BdYmZD4s.js","_astro/define.DNIVKtom.js"])))=>i.map(i=>d[i]);
import{_ as I}from"./preload-helper.CVfkMyKi.js";import{a as p,i as g}from"./lit-element.jD9bOQKo.js";import{B as x,x as d}from"./lit-html.DtZEZPQ5.js";import{L as N,a as B}from"./applyMenuDemoStyles.jUPZfHbP.js";import{d as f}from"./dedupeMixin.6XPTJgK8.js";import{e as D}from"./directive-helpers.BRNYV8Fp.js";import{L as O}from"./LionMenu.CFMCOcAt.js";customElements.define("lion-menuitem",N);const P=(r=>class extends r{static get properties(){return{disabled:{type:Boolean,reflect:!0}}}constructor(...o){super(...o),this._requestedToBeDisabled=!1,this.__isUserSettingDisabled=!0,this.__restoreDisabledTo=!1,this.disabled=!1}makeRequestToBeDisabled(){this._requestedToBeDisabled===!1&&(this._requestedToBeDisabled=!0,this.__restoreDisabledTo=this.disabled,this.__internalSetDisabled(!0))}retractRequestToBeDisabled(){this._requestedToBeDisabled===!0&&(this._requestedToBeDisabled=!1,this.__internalSetDisabled(this.__restoreDisabledTo))}__internalSetDisabled(o){this.__isUserSettingDisabled=!1,this.disabled=o,this.__isUserSettingDisabled=!0}requestUpdate(o,e,t){super.requestUpdate(o,e,t),o==="disabled"&&(this.__isUserSettingDisabled&&(this.__restoreDisabledTo=this.disabled),this.disabled===!1&&this._requestedToBeDisabled===!0&&this.__internalSetDisabled(!0))}click(){this.disabled||super.click()}}),R=f(P);function F(r){return r instanceof Node?"node":D(r)?"template-result":!Array.isArray(r)&&typeof r=="object"&&"template"in r?"slot-rerender-object":null}const U=(r=>class extends r{get slots(){return{}}constructor(...e){super(...e),this.__renderMetaPerSlot=new Map,this.__slotsThatNeedRerender=new Set,this.__slotsProvidedByUserOnFirstConnected=new Set,this.__privateSlots=new Set}connectedCallback(){super.connectedCallback(),this._connectSlotMixin()}__rerenderSlot(e){const t=this.slots[e]();this.__renderTemplateInScopedContext({renderAsDirectHostChild:t.renderAsDirectHostChild,template:t.template,slotName:e}),t.afterRender?.()}update(e){super.update(e);for(const t of this.__slotsThatNeedRerender)this.__rerenderSlot(t)}__renderTemplateInScopedContext({template:e,slotName:t,renderAsDirectHostChild:s}){if(!this.__renderMetaPerSlot.has(t)){const S=!!ShadowRoot.prototype.createElement;this.shadowRoot||console.error("[SlotMixin] No shadowRoot was found");const h=(S?this.shadowRoot:document).createElement("div"),C=document.createComment(`_start_slot_${t}_`),b=document.createComment(`_end_slot_${t}_`);h.appendChild(C),h.appendChild(b);const{creationScope:T,host:E}=this.renderOptions;if(x(e,h,{renderBefore:b,creationScope:T,host:E}),s){const L=Array.from(h.childNodes);this.__appendNodes({nodes:L,renderParent:this,slotName:t})}else h.slot=t,this.appendChild(h);this.__renderMetaPerSlot.set(t,{renderTargetThatRespectsShadowRootScoping:h,renderBefore:b});return}const{renderBefore:n,renderTargetThatRespectsShadowRootScoping:a}=this.__renderMetaPerSlot.get(t),l=s?this:a,{creationScope:c,host:k}=this.renderOptions;x(e,l,{creationScope:c,host:k,renderBefore:n}),s&&n.previousElementSibling&&!n.previousElementSibling.slot&&(n.previousElementSibling.slot=t)}__appendNodes({nodes:e,renderParent:t=this,slotName:s}){for(const i of e)i instanceof Element&&s&&s!==""&&i.setAttribute("slot",s),t.appendChild(i)}__initSlots(e){for(const t of e){if(this.__slotsProvidedByUserOnFirstConnected.has(t))continue;const s=this.slots[t]();if(s===void 0)continue;switch(this.__isConnectedSlotMixin||this.__privateSlots.add(t),F(s)){case"template-result":this.__renderTemplateInScopedContext({template:s,renderAsDirectHostChild:!0,slotName:t});break;case"node":this.__appendNodes({nodes:[s],renderParent:this,slotName:t});break;case"slot-rerender-object":this.__slotsThatNeedRerender.add(t),s.firstRenderOnConnected&&this.__rerenderSlot(t);break;default:throw new Error(`Slot "${t}" configured inside "get slots()" (in prototype) of ${this.constructor.name} may return these types: TemplateResult | Node | {template:TemplateResult, afterRender?:function} | undefined.
              You provided: ${s}`)}}}_connectSlotMixin(){if(this.__isConnectedSlotMixin)return;const e=Object.keys(this.slots);for(const t of e)(t===""?Array.from(this.children).find(i=>!i.hasAttribute("slot")):Array.from(this.children).find(i=>i.slot===t))&&this.__slotsProvidedByUserOnFirstConnected.add(t);this.__initSlots(e),this.__isConnectedSlotMixin=!0}_isPrivateSlot(e){return this.__privateSlots.has(e)}}),W=f(U);function H(r=""){return`${r.length>0?`${r}-`:""}${Math.random().toString(36).substr(2,10)}`}const $=p`
  /** More button is hidden by default */
  [data-more-button-wrapper] {
    display: none;
  }

  [data-more-button-menu][data-open]:not(:has([role='listitem'] [aria-expanded='true'])) {
    position: absolute;
    overflow: visible;
    height: auto;
    width: auto;
    top: 100%;
  }

  /** N.B. this is a simplified version of sr-only. when we move to overlayctrl, we should build this into overlayctrl */
  [data-more-button-menu] {
    overflow: hidden;
    height: 0;
    width: 0;
  }

  [role='list']:has(> [data-more-button-wrapper]) > [role='listitem'] > :is(button, a) {
    white-space: nowrap;
  }
`,q=(r=>class extends r{constructor(...e){super(...e),this.__resizeTimeout=null,this.isMoreButtonShown=null,this.handleResize=this.handleResize.bind(this)}disconnectedCallback(){window.removeEventListener("resize",this.handleResize),this.__resizeTimeout&&clearTimeout(this.__resizeTimeout),super.disconnectedCallback?.()}_initMoreButtonMenu(){this._createMoreButtonWrapper(),window.addEventListener("resize",this.handleResize),this.handleResize()}_getDeepActiveElement(){let e=document.activeElement||document.body;for(;e?.shadowRoot?.activeElement;)e=e.shadowRoot.activeElement;return e}_createMoreButtonWrapper(){const e=document.createElement("div"),t=document.createElement("style");t.textContent=$.cssText,e.appendChild(t),e.setAttribute("data-more-button-wrapper",""),[...this.getMoreButtonSlotProjection()?.childNodes??[]].forEach(a=>e.appendChild(a));const s=e.querySelector("button");s?.setAttribute("data-more-button",""),s?.setAttribute("tabindex","-1"),s?.setAttribute("aria-expanded","false");const i=document.createElement("div");i.setAttribute("data-more-button-menu",""),i.setAttribute("tabindex","-1"),e.appendChild(i),this._listNode.appendChild(e);const n=a=>this.listItems.includes(a)&&i.contains(a)||a===i;i.addEventListener("focusin",a=>{const l=a?.target;n(l)&&(this.querySelector('[level="2"]:has([data-open])')?._overlayCtrl?.hide(),l?.getAttribute("aria-expanded")==="true"&&l?.click(),s?.setAttribute("aria-expanded","true"),i.setAttribute("data-open",""))}),i.addEventListener("focusout",()=>{setTimeout(()=>{n(this._getDeepActiveElement())||(s?.setAttribute("aria-expanded","false"),i.removeAttribute("data-open"))},100)}),s?.addEventListener("click",()=>{i.getAttribute("data-open")===null&&(i?.focus({preventScroll:!0}),i.setAttribute("data-open",""))})}getMoreButtonSlotProjection(){return this.querySelector('[slot="more-button"]')}getMoreButtonMenu(){return this.querySelector("[data-more-button-menu]")}getMoreButtonMenuWrapper(){return this.querySelector("[data-more-button-wrapper]")}displayMoreButton(){const e=this.getMoreButtonMenuWrapper();e&&(e.style.display="block",this.isMoreButtonShown=!0)}hideMoreButton(){const e=this.getMoreButtonMenuWrapper();e&&(e.style.display="none",this.isMoreButtonShown=!1)}doItemsFit(){this.style.display="none";const e=this.parentElement.clientWidth;return this.style.display="",this._listNode.scrollWidth===this._listNode.clientWidth&&this._listNode.scrollWidth<=e}getListItems(){const e=this._listNode;return Array.from(e.querySelectorAll(':scope > [role="listitem"]'))}getListItemWithAdjacentNodes=e=>{const t=this.nodeType&&Node.COMMENT_NODE,s=m=>m?.nodeType===t&&m?.nodeValue==="",i=[];let{previousSibling:n}=e;for(;n&&!(n.nodeType===Node.ELEMENT_NODE||(i.unshift(n),s(n)));)({previousSibling:n}=n);const a=[];let{nextSibling:l}=e;for(;l&&!(l.nodeType===Node.ELEMENT_NODE||(a.push(l),s(l)));)({nextSibling:l}=l);const c=document.createDocumentFragment();return[...i,e,...a].forEach(m=>c.appendChild(m)),c};moveItemToMoreButtonMenuFromMainMenu({moreButtonMenuElement:e,listItem:t}){const s=this.getListItemWithAdjacentNodes(t);e.prepend(s),t.style.display="",this.displayMoreButton()}moveAllItemsToMainMenuFromMoreButtonMenu(){const e=this.getMoreButtonMenu(),t=this.getMoreButtonMenuWrapper();!e||!t||e.childNodes.length!==0&&[...e.childNodes].forEach(s=>{t.before(s)})}renderAllItemsInMainMenu(){this.moveAllItemsToMainMenuFromMoreButtonMenu()}hideItemsOneByOneInMainMenuUntilTheyFit(){let e=0;const t=this.getListItems();for(let s=t.length-1;s>=0&&!this.doItemsFit();s-=1)t[s].style.display="none",e+=1;return e}moveHiddenItemsFromMainMenuToMoreButtonMenu(e){const t=this.getMoreButtonMenu(),s=this._listNode.querySelectorAll(':scope > [role="listitem"]');for(let i=0;i<e;i+=1){const n=s[s.length-1-i];this.moveItemToMoreButtonMenuFromMainMenu({moreButtonMenuElement:t,listItem:n})}}handleResize(){this.__resizeTimeout||(this.style.visibility="hidden",this.__resizeTimeout=setTimeout(()=>{if(this.__resizeTimeout=null,this.renderAllItemsInMainMenu(),this.hideMoreButton(),this.doItemsFit()){this.style.visibility="";return}this.style.visibility="hidden",this.displayMoreButton();const e=this.hideItemsOneByOneInMainMenuUntilTheyFit();this.moveHiddenItemsFromMainMenuToMoreButtonMenu(e),this.style.visibility=""},50))}});function K(r,o,e=!1){const t=r.scrollTop,s=t+r.clientHeight,i=o.offsetTop,n=i+o.clientHeight,a=i>=t&&n<=s;let l;return e===!0?l=i<t&&n>t||n>s&&i<s:typeof e=="number"&&(i<t&&n>t?l=(n-t)*100/o.clientHeight>e:n>s&&i<s&&(l=(s-i)*100/o.clientHeight>e)),a||l}function _(r){return r.hasAttribute("disabled")||r.getAttribute("aria-disabled")==="true"}function v(r){return r.hasAttribute("checked")}function u(r,o=!1){const e=r.getAttribute("role");let t="current";e?.endsWith("checkbox")||e?.endsWith("radio")?t="checked":(e==="option"||e==="treeitem")&&(t="selected");let s;r.href&&(s="page"),r.mixedState&&(s="mixed"),o?(r.removeAttribute("checked"),r.setAttribute(`aria-${t}`,"false")):(r.setAttribute("checked",""),r.setAttribute(`aria-${t}`,s||"true"))}function A(r){const o=v(r);u(r,o)}function j(r){return r.hasAttribute("active")}function M(r,o=!1){o?r.removeAttribute("active"):r.setAttribute("active","")}function z(r){return Array.from(r.childNodes).filter(o=>o.nodeName==="#text").map(o=>o.textContent).join("").trim()}function G(r){return r.choiceValue||r.value||r.getAttribute("value")||r.getAttribute("data-value")||z(r)}function y(r){return r&&(r.hasAttribute("tabindex")||["BUTTON","A"].includes(r.tagName))}class Ie extends g{static get properties(){return{type:{type:String}}}get _invokerNode(){return Array.from(this.children).find(o=>o.slot==="invoker")}static styles=[p`
      :host {
        display: block;
      }
    `];constructor(){super(),this.type=""}connectedCallback(){super.connectedCallback(),this._computedType||(this._computedType=this.type||"listitem"),this._invokerNode?this._invokerNode.setAttribute("role",this._computedType):this.setAttribute("role",this._computedType)}render(){return d`
      <slot name="invoker"></slot>
      <slot></slot>
    `}}const V=(r=>class extends R(W(q(r))){static styles=[p`
        :host {
          display: block;
        }

        :host([hidden]) {
          display: none;
        }

        :host([disabled]) {
          color: #adadad;
        }

        :host([axis='inline']) ::slotted([slot='list']) {
          display: flex;
        }
      `];render(){return d`
        <slot name="list"></slot>
        <slot></slot>
      `}static get properties(){return{axis:{type:String,reflect:!0},multiple:{type:Boolean,attribute:"multiple"},selectionFollowsFocus:{type:Boolean,attribute:"selection-follows-focus"},wrap:{type:Boolean,attribute:"wrap"},hasNoDefaultSelected:{type:Boolean,reflect:!0,attribute:"has-no-default-selected"},itemWrap:{type:Boolean,attribute:"item-wrap"},_activateOnTypedChars:{type:Boolean},_hasSmartListItems:{type:Boolean},_activeMode:{type:String}}}get slots(){return{...super.slots,list:()=>document.createElement("div")}}get _listNode(){return Array.from(this.children).find(e=>e.slot==="list")}get _scrollTargetNode(){return this}get _listItemsSlot(){return Array.from(this.shadowRoot.querySelectorAll("slot")).find(t=>!t.name)}get listItems(){return this.__listItems||this.formElements}get _childrenRoles(){return[...this._interactiveChildrenRoles,"listitem","group"]}get _interactiveChildrenRoles(){return["menuitem","menuitemcheckbox","menuitemradio","option","treeitem"]}get activeIndex(){return this.listItems.findIndex(e=>j(e))}set activeIndex(e){if(!this.listItems[e])return;const s=this.activeItem,i=this.listItems[e];this.listItems.forEach(l=>{M(l,!0)}),M(i);let n,a;this._activeMode==="activedescendant"?(n=i,a=s):(n=y(i)?i:i.firstElementChild,a=s&&(y(s)?s:s.firstElementChild)),n&&(this._activeMode==="activedescendant"?this._listNode.setAttribute("aria-activedescendant",n.id):(this._activeMode==="roving-tabindex"||this._activeMode==="tabbable-disclosure")&&n.focus(),this.axis==="block"&&!K(this._scrollTargetNode,n)&&n.scrollIntoView({behavior:"smooth",block:"nearest"}),this._activeMode==="roving-tabindex"&&(a&&a.setAttribute("tabindex","-1"),n.setAttribute("tabindex","0")))}get activeItem(){return this.listItems[this.activeIndex]}get checkedIndex(){return this.multiple?this.listItems.filter(e=>v(e)).map(e=>this.listItems.indexOf(e)):this.listItems.findIndex(e=>v(e))}set checkedIndex(e){this.setCheckedIndex(e)}setCheckedIndex(e){this.listItems[e]&&(this.multiple?A(this.listItems[e]):(this.listItems.forEach(s=>{u(s,!0)}),u(this.listItems[e])))}get isInteractiveList(){return!0}constructor(){super(),this.axis="block",this.multiple=!1,this.selectionFollowsFocus=!1,this.wrap=!1,this.hasNoDefaultSelected=!1,this._activeMode="activedescendant",this._hasSmartChildren=!1,this._listRole="menu",this.__listItems=[],this._activateOnTypedChars=!1,this._activateOnCharTimeout=2e3,this.__typedChars=[],this._onListClick=this._onListClick.bind(this),this._onListKeyUp=this._onListKeyUp.bind(this),this._onListKeyDown=this._onListKeyDown.bind(this),this._onListFocusIn=this._onListFocusIn.bind(this)}connectedCallback(){super.connectedCallback(),window.addEventListener("popstate",this._onPopState)}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("popstate",this._onPopState)}firstUpdated(e){super.firstUpdated(e),this._setupList()}#e(e){const t=(i,{newItems:n,level:a=1})=>{if(a===1&&(this._listNode.appendChild(i),this._hasSmartChildren||!(i instanceof Element)))return;if(i.getAttribute("role")==="group"){for(const c of i.children)t(c,{newItems:n,level:a+1});return}const l=Array.from(i.children).filter(c=>y(c));if(l.length)for(const c of l)n.push(c);else n.push(i)},s=[];e.forEach(i=>{t(i,{newItems:s})}),this.itemWrap&&e.length&&this._initMoreButtonMenu(),s.forEach(i=>{this.__listItems.includes(i)||this.__listItems.push(i)}),this._initListItems(s)}_setupList(){this._listItemsSlot.addEventListener("slotchange",()=>{const e=Array.from((this._listItemsSlot.assignedSlot||this).childNodes||[]).filter(t=>!t.slot);this.#e(e)}),this._listNode.setAttribute("role",this._listRole),this._listNode.setAttribute("tabindex",this._activeMode==="tabbable-disclosure"?"-1":"0"),this._listNode.addEventListener("click",this._onListClick),this._listNode.addEventListener("keyup",this._onListKeyUp),this._listNode.addEventListener("keydown",this._onListKeyDown),this._listNode.addEventListener("focusin",this._onListFocusIn)}_initListItems(e){this._activeMode==="roving-tabindex"?e.forEach(t=>t.setAttribute?.("tabindex","-1")):this._activeMode==="activedescendant"&&e.forEach(t=>{t.id=t.id||`${this.localName}-item-${H()}`}),!this.hasNoDefaultSelected&&this.checkedIndex===-1&&(this.checkedIndex=0),e.forEach(t=>{t.hasAttribute("checked")?u(t):u(t,!0)}),this._syncCurrentPageWithLocationHref(window.location)}_onListKeyDown(e){if(_(this)||this.__onKeydownActivateTypedChars(e))return;const{key:s}=e;switch(s){case"Enter":case" ":e.preventDefault(),this.setCheckedIndex(this.activeIndex);break;case"ArrowUp":e.preventDefault(),(this.axis==="block"||this._activeMode==="tabbable-disclosure")&&(this.activeIndex=this._getPreviousEnabledOption(this.activeIndex));break;case"ArrowLeft":(this.axis==="inline"||this._activeMode==="tabbable-disclosure")&&(this.activeIndex=this._getPreviousEnabledOption(this.activeIndex));break;case"ArrowDown":e.preventDefault(),(this.axis==="block"||this._activeMode==="tabbable-disclosure")&&(this.activeIndex=this._getNextEnabledOption(this.activeIndex));break;case"ArrowRight":(this.axis==="inline"||this._activeMode==="tabbable-disclosure")&&(this.activeIndex=this._getNextEnabledOption(this.activeIndex));break;case"Home":e.preventDefault(),this.activeIndex=this._getNextEnabledOption(0,0);break;case"End":e.preventDefault(),this.activeIndex=this._getPreviousEnabledOption(this.listItems.length-1,0);break}["ArrowUp","ArrowDown","Home","End"].includes(s)&&this.selectionFollowsFocus&&!this.multiple&&this.setCheckedIndex(this.activeIndex)}__onKeydownActivateTypedChars(e){if(!this._activateOnTypedChars)return!1;const{key:t,code:s}=e;if(s.startsWith("Key")||s.startsWith("Digit")||s.startsWith("Numpad")){this.__typedChars.push(t);const i=this.__typedChars.join(""),n=this.listItems.find(a=>this._matchCharsAgainstItem({chars:[i],item:a}));return this.activeIndex=this.listItems.indexOf(n),typeof this.__clearCharTimeout=="function"&&this.__clearCharTimeout(),this.__clearCharTimeout=setTimeout(()=>{this.__typedChars=[]},this._activateOnCharTimeout),!0}return!1}_matchCharsAgainstItem({chars:e,item:t}){return G(t).toLowerCase().startsWith(e)}__preventScrollingWithArrowKeys(e){if(this.disabled)return;const{key:t}=e;switch(t){case"ArrowUp":case"ArrowDown":case"Home":case"End":e.preventDefault()}}_onListFocusIn(e){const{target:t}=e,s=this.listItems.indexOf(t);s>-1&&s!==this.activeIndex&&(this.activeIndex=s)}_onListClick(e){const{target:t}=e,s=t.closest("[role]"),i=this.listItems.indexOf(s);i>-1&&(this.activeIndex=i,this.setCheckedIndex(i))}_onListKeyUp(e){if(this.disabled)return;const{key:t}=e;switch(t){case"ArrowUp":case"ArrowDown":case"Home":case"End":case" ":case"Enter":e.preventDefault()}}__getNextOption(e,t){const s=i=>t===1?i<this.listItems.length:i>=0;for(let i=e+t;s(i);i+=t)if(this.listItems[i]&&!_(this.listItems[i]))return i;if(this.wrap){const i=t===-1?this.listItems.length-1:0;for(let n=i;s(n);n+=1)if(this.listItems[n]&&!_(this.listItems[n]))return n}return e}_getNextEnabledOption(e,t=1){return this.__getNextOption(e,t)}_getPreviousEnabledOption(e,t=-1){return this.__getNextOption(e,t)}_syncCurrentPageWithLocationHref(e){this.listItems.forEach(t=>{t.href&&((e.href.endsWith("/")?e.href.substring(0,e.href.length-1):e.href)===t.href?u(t):u(t,!0))})}_onPopState=()=>{this._syncCurrentPageWithLocationHref(document.location)}}),Z=f(V),Y=(r=>class extends Z(r){render(){return d`
        <slot name="invoker"></slot>
        <slot name="list"></slot>
        <slot id="list-items-outlet"></slot>
      `}static get properties(){return{invokerNode:{type:Object},behaveAsAccordion:{type:Boolean,attribute:"behave-as-accordion"},level:{type:Number,reflect:!0}}}get _invokerNode(){const e=this.constructor;return e._getFocusableInvokerEl&&this.invokerNode?e._getFocusableInvokerEl(this.invokerNode):super._invokerNode}get _contentNode(){return this._listNode}constructor(){super(),this.invokerNode=void 0,this.handleFocus=!0,this.parentList=void 0,this.behaveAsAccordion=!1,this.level=1,this.hasNoDefaultSelected=!0,this._activeMode="roving-tabindex",this._subListMap=new Map}static _getSubInteractiveList(e){if(e.nextElementSibling?.isInteractiveList)return e.nextElementSibling;if(e.getAttribute?.("role")==="listitem"||e.hasAttribute?.("data-item"))return Array.from(e.children).find(i=>i.isInteractiveList)}_initListItems(e){super._initListItems(e);const t=this.constructor;e.forEach(s=>{const i=t._getSubInteractiveList(s);i&&(this._subListMap.set(s,i),i.level=this.level+1,i.parentList=this,i.invokerNode=s,i.invokerInteraction=this.invokerInteraction,i._activeMode=this._activeMode)})}toggle(e){e&&this._listNode.contains(e.target)||super.toggle()}_onListKeyDown(e){if(Array.from(this._subListMap).find(([,a])=>a===e.target||a.contains(e.target)))return;super._onListKeyDown(e);const s=this._subListMap.get(this.activeItem),i=this.parentList,{key:n}=e;switch(n==="Escape"&&i&&e.stopPropagation(),n){case"Enter":case" ":this.activeItem?.click();break;case"ArrowDown":this.axis==="inline"&&s&&this._activeMode!=="tabbable-disclosure"&&this.activeItem.click();break;case"ArrowRight":this.axis==="block"&&s&&this.activeItem.click();break;case"ArrowUp":this.axis==="inline"&&i&&(this.close(),i._onOverlayShow&&i._onOverlayShow());break;case"ArrowLeft":this.axis==="block"&&i&&(this.close(),i._onOverlayShow&&i._onOverlayShow());break}}_syncCurrentPageWithLocationHref(e){super._syncCurrentPageWithLocationHref(e),this._subListMap.forEach(t=>{t.listItems.forEach(s=>{v(s)&&t._invokerNode&&u(t._invokerNode)})})}}),J=f(Y);class Q extends J(g){constructor(){super(),this._listRole="tree",this._activateOnTypedChars=!0,this.invokerInteraction="click"}updated(o){super.updated(o),o.has("level")&&(this.level>1&&this._listNode.setAttribute("role","group"),this.__setAriaLevelForListItems())}_initListItems(o){super._initListItems(o),this.__setAriaLevelForListItems(),o.forEach((e,t)=>{e.setAttribute("aria-posinset",`${t+1}`),e.setAttribute("aria-setsize",`${this.listItems.length}`)})}__setAriaLevelForListItems(){this.listItems.forEach(o=>{o.setAttribute?.("aria-level",`${this.level+1}`)})}}customElements.define("demo-tree",Q);class X extends O{constructor(){super(),this._listRole="toolbar",this.bar=!0}setCheckedIndex(o){const e=this.listItems[o];if(e){const t=e.getAttribute("role");let s=this.listItems,{multiple:i}=this;if(t==="radio"||t==="checkbox"){let n;t==="radio"?n=e.closest('[role="radiogroup"]'):t==="checkbox"&&(n=e.closest('[role="checkboxgroup"]'));const a=n&&this.contains(n)?n:this;s=this.listItems.filter(l=>a.contains(l)),i=t==="checkbox"}i?A(this.listItems[o]):(s.forEach(n=>{u(n,!0)}),u(this.listItems[o]))}}_initListItems(o){super._initListItems(o),o.forEach(e=>{if(e.getAttribute("role")==="button"||e.tagName==="BUTTON"&&!e.hasAttribute("role")){const t=e.getAttribute("aria-pressed");e.setAttribute("aria-pressed",t||"false"),e.addEventListener("click",()=>{const s=e.getAttribute("aria-pressed")==="true";e.setAttribute("aria-pressed",`${!s}`)})}})}}customElements.define("demo-toolbar",X);class ee extends g{static get properties(){return{now:{type:Number},min:{type:Number},max:{type:Number},unit:{type:String},step:{type:Number}}}get _decreaseNode(){return this.shadowRoot?.querySelector("[data-ref=decrease]")}get _increaseNode(){return this.shadowRoot?.querySelector("[data-ref=increase]")}static get styles(){return p`
      :host {
        display: flex;
        align-items: center;
        cursor: default;
      }
    `}render(){return this._mainTemplate({ariaText:this._getAriaText()})}_mainTemplate({ariaText:o}){return d`${o}${this._decreaseBtnTemplate()}${this._increaseBtnTemplate()}`}_decreaseBtnTemplate(){return d`<span data-ref="decrease">▼</span>`}_increaseBtnTemplate(){return d`<span data-ref="increase">▲</span>`}constructor(){super(),this.unit="",this.step=1,this.__decrease=this.__decrease.bind(this),this.__increase=this.__increase.bind(this)}connectedCallback(){super.connectedCallback(),!this.__isSetup&&(this.setAttribute("tabindex","0"),this.__isSetup=!0)}firstUpdated(o){super.firstUpdated(o),this._decreaseNode?.addEventListener("mousedown",this.__decrease),this._increaseNode?.addEventListener("mousedown",this.__increase),this.addEventListener("keydown",this._onKeydown),this.addEventListener("mousedown",()=>{this.__isMousedown=!0}),this.addEventListener("mouseup",()=>{this.__isMousedown=!1})}updated(o){super.updated(o),o.has("now")&&this.setAttribute("aria-valuenow",`${this.now}`),(o.has("now")||o.has("unit"))&&this.setAttribute("aria-valuetext",this._getAriaText()),o.has("min")&&this.setAttribute("aria-valuemin",`${this.min}`),o.has("max")&&this.setAttribute("aria-valuemax",`${this.max}`)}_getAriaText(){return`${this.now}${this.unit?this.unit:""}`}__decrease(o,e=this.step,t=100){this.min!==void 0&&this.now-1>=this.min&&(this.now-=1),o.type==="mousedown"&&setTimeout(()=>{this.__isMousedown&&this.__decrease(o,e,t/1.3)},t)}__increase(o,e=this.step,t=100){this.max!==void 0&&this.now+1<=this.max&&(this.now+=1),o.type==="mousedown"&&setTimeout(()=>{this.__isMousedown&&this.__increase(o,e,t/1.3)},t)}_onKeydown(o){const{key:e}=o;switch(e){case"ArrowDown":o.stopPropagation(),o.preventDefault(),this.__decrease();break;case"ArrowUp":o.stopPropagation(),o.preventDefault(),this.__increase();break;case"Home":o.stopPropagation(),o.preventDefault(),this.min!==void 0&&(this.now=this.min);break;case"End":o.stopPropagation(),o.preventDefault(),this.max!==void 0&&(this.now=this.max);break;case"PageDown":this.__decrease(null,this.step*2);break;case"PageUp":this.__increase(null,this.step*2);break}}}customElements.define("demo-spin-button",ee);B();const te=()=>d`
  <nav>
    <button data-invoker>Open menu</button>
    <lion-menu>
      <div role="menuitem">Go to Definition</div>
      <div role="menuitem">Go to Type Definition</div>
      <div>
        <button role="menuitem" data-invoker>Peek</button>
        <lion-menu>
          <div role="menuitem">Peek Call Hierarchy</div>
          <div role="separator"></div>
          <div role="menuitem">Peek Definition</div>
        </lion-menu>
      </div>
      <div role="separator"></div>
      <div role="menuitem">Find all References</div>
    </lion-menu>
  </nav>
`,ie=()=>d`
  <nav>
    <button data-invoker for="menu">Open menu</button>
    <lion-menu id="menu">
      <lion-menuitem> Go to Definition </lion-menuitem>
      <lion-menuitem> Go to Type Definition </lion-menuitem>
      <lion-menuitem>
        <button slot="invoker">Peek</button>
        <lion-menu>
          <lion-menuitem type="radio"> Peek Call Hierarchy </lion-menuitem>
          <div role="separator"></div>
          <lion-menuitem type="radio"> Peek Definition </lion-menuitem>
        </lion-menu>
      </lion-menuitem>
      <div role="separator"></div>
      <lion-menuitem type="checkbox"> Find all References </lion-menuitem>
    </lion-menu>
  </nav>
`,se=()=>d`
  <lion-menu bar invoker-interaction="hover">
    <div>
      <div role="menuitem">Font</div>
      <lion-menu aria-label="Font">
        <div role="menuitemradio">Sans-serif</div>
        <div role="menuitemradio">Serif</div>
        <div role="menuitemradio">Monospace</div>
        <div role="menuitemradio">Fantasy</div>
      </lion-menu>
    </div>
    <div>
      <div role="menuitem">Style/Color</div>
      <lion-menu aria-label="Style/Color">
        <div role="menuitemcheckbox" aria-checked="true">Bold</div>
        <div role="menuitemcheckbox" aria-checked="true">Italic</div>
        <div role="separator"></div>
        <div role="group" aria-label="Text Color">
          <div role="menuitemradio" aria-checked="false">Black</div>
          <div role="menuitemradio" aria-checked="false">Blue</div>
          <div role="menuitemradio" aria-checked="true">Red</div>
          <div role="menuitemradio" aria-checked="false">Green</div>
        </div>
        <div role="separator"></div>
        <div role="group" aria-label="Text Decoration">
          <div role="menuitemradio" aria-checked="true">None</div>
          <div role="menuitemradio" aria-checked="false">Overline</div>
          <div role="menuitemradio" aria-checked="false">Line-through</div>
          <div role="menuitemradio" aria-checked="false">Underline</div>
        </div>
      </lion-menu>
    </div>
  </lion-menu>
`,oe=()=>d`
  <demo-tree>
    <div role="treeitem">Fruits</div>
    <demo-tree>
      <div role="treeitem">Peek Call Hierarchy</div>
      <div role="treeitem">Peek Definition</div>
    </demo-tree>
    <div role="treeitem">Vegetables</div>
    <demo-tree>
      <div role="treeitem">Peek Call Hierarchy</div>
      <div>
        <div role="treeitem">Peek</div>
        <demo-tree>
          <div role="treeitem">Peek Call Hierarchy</div>
          <div role="treeitem">Peek Definition</div>
        </demo-tree>
      </div>
    </demo-tree>
    <div role="treeitem">Grains</div>
    <demo-tree>
      <div role="treeitem">Peek Call Hierarchy</div>
      <div role="treeitem">Peek Definition</div>
    </demo-tree>
  </demo-tree>
`,re=()=>d`
  <nav aria-label="Mythical University">
    <lion-menu bar ._activeMode="${"tabbable-disclosure"}">
      <div role="listitem">
        <button data-invoker>About</button>
        <lion-menu>
          <div role="listitem">
            <a href="/about/overview">Overview</a>
          </div>
          <div role="listitem">
            <a href="/about/administration">Administration</a>
          </div>
          <div role="listitem">
            <a href="/about/facts">Facts</a>
          </div>
          <div role="listitem">
            <a href="/about/campus-tours">Campus Tours</a>
          </div>
        </lion-menu>
      </div>
      <div role="listitem">
        <button data-invoker>Admissions</button>
        <lion-menu id="id_admissions_menu">
          <div role="listitem">
            <a href="/admissions/apply">Apply</a>
          </div>
          <div role="listitem">
            <a href="/admissions/tuition">Tuition</a>
          </div>
          <div role="listitem">
            <a href="/admissions/sign-up">Sign Up</a>
          </div>
          <div role="listitem">
            <a href="/admissions/visit">Visit</a>
          </div>
          <div role="listitem">
            <a href="/admissions/photo-tour">Photo Tour</a>
          </div>
          <div role="listitem">
            <a href="/admissions/connect">Connect</a>
          </div>
        </lion-menu>
      </div>
      <div role="listitem">
        <button data-invoker>Academics</button>
        <lion-menu>
          <div role="listitem">
            <a href="/academics/colleges-and-schools">Colleges & Schools</a>
          </div>
          <div role="listitem">
            <a href="/academics/programs-of-study">Programs of Study</a>
          </div>
          <div role="listitem">
            <a href="/academics/honors-programs">Honors Programs</a>
          </div>
          <div role="listitem">
            <a href="/academics/online-courses">Online Courses</a>
          </div>
          <div role="listitem">
            <a href="/academics/course-explorer">Course Explorer</a>
          </div>
          <div role="listitem">
            <a href="/academics/register-for-class">Register for Class</a>
          </div>
          <div role="listitem">
            <a href="/academics/academic-calendar">Academic Calendar</a>
          </div>
          <div role="listitem">
            <a href="/academics/transcripts">Transcripts</a>
          </div>
        </lion-menu>
      </div>
    </lion-menu>
  </nav>
`,ne=()=>d`
 <nav aria-label="Mythical University">
   <lion-menu bar ._activeMode="${"tabbable-disclosure"}">
    <div role="listitem">
      <a href="/about">About</a>
      <button data-invoker aria-label="More About Pages">▼</button>
      <lion-menu>
        <div role="listitem">
          <a href="/about/overview">Overview</a>
        </div>
        <div role="listitem">
          <a href="/about/administration">Administration</a>
        </div>
        <div role="listitem">
          <a href="/about/facts">Facts</a>
        </div>
        <div role="listitem">
          <a href="/about/campus-tours">Campus Tours</a>
        </div>
      </lion-menu>
    </div>
    <div role="listitem">
      <a href="/admissions">Admissions</a>
      <button data-invoker aria-label="More Admissions Pages">
        ▼
      </button>
      <lion-menu id="id_admissions_menu">
        <div role="listitem">
          <a href="/admissions/apply">Apply</a>
        </div>
        <div role="listitem">
          <a href="/admissions/tuition">Tuition</a>
        </div>
        <div role="listitem">
          <a href="/admissions/sign-up">Sign Up</a>
        </div>
        <div role="listitem">
          <a href="/admissions/visit">Visit</a>
        </div>
        <div role="listitem">
          <a href="/admissions/photo-tour">Photo Tour</a>
        </div>
        <div role="listitem">
          <a href="/admissions/connect">Connect</a>
        </div>
      </lion-menu>
    </div>
    <div role="listitem">
      <a href="/academics">Academics</a>
      <button data-invoker aria-label="More Academics Pages">▼</button>
      <lion-menu>
        <div role="listitem">
          <a href="/academics/colleges-and-schools">Colleges & Schools</a>
        </div>
        <div role="listitem">
          <a href="/academics/programs-of-study">Programs of Study</a>
        </div>
        <div role="listitem">
          <a href="/academics/honors-programs">Honors Programs</a>
        </div>
        <div role="listitem">
          <a href="/academics/online-courses">Online Courses</a>
        </div>
        <div role="listitem">
          <a href="/academics/course-explorer">Course Explorer</a>
        </div>
        <div role="listitem">
          <a href="/academics/register-for-class">Register for Class</a>
        </div>
        <div role="listitem">
          <a href="/academics/academic-calendar">Academic Calendar</a>
        </div>
        <div role="listitem">
          <a href="/academics/transcripts">Transcripts</a>
        </div>
      </lion-menu>
    </div>
  </ul>
</nav>
`,ae=()=>d`
  <demo-toolbar>
    <div>
      <button data-item title="bold" aria-label="Bold">
        <span class="fas fa-bold" aria-hidden="true"></span>
      </button>
      <button data-item title="italic" aria-label="Italic">
        <span class="fas fa-italic" aria-hidden="true"></span>
      </button>
      <button data-item title="underline" aria-label="Underline">
        <span class="fas fa-underline" aria-hidden="true"></span>
      </button>
    </div>
    <div role="separator"></div>
    <div role="radiogroup" aria-label="Text Alignment">
      <button data-item role="radio" aria-label="Text Align Left">
        <span class="fas fa-align-left" aria-hidden="true"></span>
      </button>
      <button data-item role="radio" aria-label="Text Align Center">
        <span class="fas fa-align-center" aria-hidden="true"></span>
      </button>
      <button data-item role="radio" aria-label="Text Align Right">
        <span class="fas fa-align-right" aria-hidden="true"></span>
      </button>
    </div>
    <div role="separator"></div>

    <demo-spin-button data-item now="20" min="12" max="40" unit="px"></demo-spin-button>
    <div role="separator"></div>

    <div>
      <div role="menuitem">Font</div>
      <lion-menu aria-label="Font">
        <div role="menuitemradio">Sans-serif</div>
        <div role="menuitemradio">Serif</div>
        <div role="menuitemradio">Monospace</div>
        <div role="menuitemradio">Fantasy</div>
      </lion-menu>
    </div>
    <div>
      <div role="menuitem">Style/Color</div>
      <lion-menu aria-label="Style/Color">
        <div role="menuitemcheckbox" aria-checked="true">Bold</div>
        <div role="menuitemcheckbox" aria-checked="true">Italic</div>
        <div role="separator"></div>
        <div role="group" aria-label="Text Color">
          <div role="menuitemradio" aria-checked="false">Black</div>
          <div role="menuitemradio" aria-checked="false">Blue</div>
          <div role="menuitemradio" aria-checked="true">Red</div>
          <div role="menuitemradio" aria-checked="false">Green</div>
        </div>
        <div role="separator"></div>
        <div role="group" aria-label="Text Decoration">
          <div role="menuitemradio" aria-checked="true">None</div>
          <div role="menuitemradio" aria-checked="false">Overline</div>
          <div role="menuitemradio" aria-checked="false">Line-through</div>
          <div role="menuitemradio" aria-checked="false">Underline</div>
        </div>
      </lion-menu>
    </div>
  </demo-toolbar>
`,le=()=>d`
  <demo-tree>
    <lion-item>
      <div>Fruits</div>
      <demo-tree>
        <lion-item>Peek Call Hierarchy</lion-item>
        <lion-item>Peek Definition</lion-item>
      </demo-tree>
    </lion-item>
    <lion-item>
      <div>Vegetables</div>
      <demo-tree>
        <lion-item>Peek Call Hierarchy</lion-item>
        <lion-item>
          <div>Peek</div>
          <demo-tree>
            <lion-item>Peek Call Hierarchy</lion-item>
            <lion-item>Peek Definition</lion-item>
          </demo-tree>
        </lion-item>
      </demo-tree>
    </lion-item>
    <lion-item>
      <div>Grains</div>
      <demo-tree>
        <lion-item>Peek Call Hierarchy</lion-item>
        <lion-item>Peek Definition</lion-item>
      </demo-tree>
    </lion-item>
  </demo-tree>
`,de=document,ce=[{key:"menuButton",story:te},{key:"menuButtonZ",story:ie},{key:"groups",story:se},{key:"tree",story:oe},{key:"disclosureMenu",story:re},{key:"disclosureMenuWithAnchorsOnL1",story:ne},{key:"toolbar",story:ae},{key:"treeItem",story:le}];let w=!1;for(const r of ce){const o=de.querySelector(`[mdjs-story-name="${r.key}"]`);o&&(o.story=r.story,o.key=r.key,w=!0,Object.assign(o,{simulatorUrl:"/simulator",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}w&&(customElements.get("mdjs-preview")||I(()=>import("./define.BdbiuFq9.js"),__vite__mapDeps([0,1,2,3,4])),customElements.get("mdjs-story")||I(()=>import("./define.DNIVKtom.js"),__vite__mapDeps([5,2,3])));export{re as disclosureMenu,ne as disclosureMenuWithAnchorsOnL1,se as groups,te as menuButton,ie as menuButtonZ,ae as toolbar,oe as tree,le as treeItem};
