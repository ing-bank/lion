import{a as b,i as x}from"./lit-element.jD9bOQKo.js";import{x as h,B as w}from"./lit-html.DtZEZPQ5.js";import{O as A}from"./OverlayMixin.O51_OAHT.js";import{w as L}from"./withDropdownConfig.mpS2_Nd0.js";import{d as v}from"./dedupeMixin.6XPTJgK8.js";import{D as C}from"./DisabledMixin._mLN-GN2.js";import{S as E}from"./SlotMixin.DX3mwGiD.js";import{u as N}from"./uuid.DjYKNjre.js";const O=b`
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
`,T=(n=>class extends n{constructor(...e){super(...e),this.__resizeTimeout=null,this.isMoreButtonShown=null,this.handleResize=this.handleResize.bind(this)}disconnectedCallback(){window.removeEventListener("resize",this.handleResize),this.__resizeTimeout&&clearTimeout(this.__resizeTimeout),super.disconnectedCallback?.()}_initMoreButtonMenu(){this._createMoreButtonWrapper(),window.addEventListener("resize",this.handleResize),this.handleResize()}_getDeepActiveElement(){let e=document.activeElement||document.body;for(;e?.shadowRoot?.activeElement;)e=e.shadowRoot.activeElement;return e}_createMoreButtonWrapper(){const e=document.createElement("div"),t=document.createElement("style");t.textContent=O.cssText,e.appendChild(t),e.setAttribute("data-more-button-wrapper",""),[...this.getMoreButtonSlotProjection()?.childNodes??[]].forEach(a=>e.appendChild(a));const s=e.querySelector("button");s?.setAttribute("data-more-button",""),s?.setAttribute("tabindex","-1"),s?.setAttribute("aria-expanded","false");const i=document.createElement("div");i.setAttribute("data-more-button-menu",""),i.setAttribute("tabindex","-1"),e.appendChild(i),this._listNode.appendChild(e);const o=a=>this.listItems.includes(a)&&i.contains(a)||a===i;i.addEventListener("focusin",a=>{const l=a?.target;o(l)&&(this.querySelector('[level="2"]:has([data-open])')?._overlayCtrl?.hide(),l?.getAttribute("aria-expanded")==="true"&&l?.click(),s?.setAttribute("aria-expanded","true"),i.setAttribute("data-open",""))}),i.addEventListener("focusout",()=>{setTimeout(()=>{o(this._getDeepActiveElement())||(s?.setAttribute("aria-expanded","false"),i.removeAttribute("data-open"))},100)}),s?.addEventListener("click",()=>{i.getAttribute("data-open")===null&&(i?.focus({preventScroll:!0}),i.setAttribute("data-open",""))})}getMoreButtonSlotProjection(){return this.querySelector('[slot="more-button"]')}getMoreButtonMenu(){return this.querySelector("[data-more-button-menu]")}getMoreButtonMenuWrapper(){return this.querySelector("[data-more-button-wrapper]")}displayMoreButton(){const e=this.getMoreButtonMenuWrapper();e&&(e.style.display="block",this.isMoreButtonShown=!0)}hideMoreButton(){const e=this.getMoreButtonMenuWrapper();e&&(e.style.display="none",this.isMoreButtonShown=!1)}doItemsFit(){this.style.display="none";const e=this.parentElement.clientWidth;return this.style.display="",this._listNode.scrollWidth===this._listNode.clientWidth&&this._listNode.scrollWidth<=e}getListItems(){const e=this._listNode;return Array.from(e.querySelectorAll(':scope > [role="listitem"]'))}getListItemWithAdjacentNodes=e=>{const t=this.nodeType&&Node.COMMENT_NODE,s=u=>u?.nodeType===t&&u?.nodeValue==="",i=[];let{previousSibling:o}=e;for(;o&&!(o.nodeType===Node.ELEMENT_NODE||(i.unshift(o),s(o)));)({previousSibling:o}=o);const a=[];let{nextSibling:l}=e;for(;l&&!(l.nodeType===Node.ELEMENT_NODE||(a.push(l),s(l)));)({nextSibling:l}=l);const c=document.createDocumentFragment();return[...i,e,...a].forEach(u=>c.appendChild(u)),c};moveItemToMoreButtonMenuFromMainMenu({moreButtonMenuElement:e,listItem:t}){const s=this.getListItemWithAdjacentNodes(t);e.prepend(s),t.style.display="",this.displayMoreButton()}moveAllItemsToMainMenuFromMoreButtonMenu(){const e=this.getMoreButtonMenu(),t=this.getMoreButtonMenuWrapper();!e||!t||e.childNodes.length!==0&&[...e.childNodes].forEach(s=>{t.before(s)})}renderAllItemsInMainMenu(){this.moveAllItemsToMainMenuFromMoreButtonMenu()}hideItemsOneByOneInMainMenuUntilTheyFit(){let e=0;const t=this.getListItems();for(let s=t.length-1;s>=0&&!this.doItemsFit();s-=1)t[s].style.display="none",e+=1;return e}moveHiddenItemsFromMainMenuToMoreButtonMenu(e){const t=this.getMoreButtonMenu(),s=this._listNode.querySelectorAll(':scope > [role="listitem"]');for(let i=0;i<e;i+=1){const o=s[s.length-1-i];this.moveItemToMoreButtonMenuFromMainMenu({moreButtonMenuElement:t,listItem:o})}}handleResize(){this.__resizeTimeout||(this.style.visibility="hidden",this.__resizeTimeout=setTimeout(()=>{if(this.__resizeTimeout=null,this.renderAllItemsInMainMenu(),this.hideMoreButton(),this.doItemsFit()){this.style.visibility="";return}this.style.visibility="hidden",this.displayMoreButton();const e=this.hideItemsOneByOneInMainMenuUntilTheyFit();this.moveHiddenItemsFromMainMenuToMoreButtonMenu(e),this.style.visibility=""},50))}});function S(n,r,e=!1){const t=n.scrollTop,s=t+n.clientHeight,i=r.offsetTop,o=i+r.clientHeight,a=i>=t&&o<=s;let l;return e===!0?l=i<t&&o>t||o>s&&i<s:typeof e=="number"&&(i<t&&o>t?l=(o-t)*100/r.clientHeight>e:o>s&&i<s&&(l=(s-i)*100/r.clientHeight>e)),a||l}function m(n){return n.hasAttribute("disabled")||n.getAttribute("aria-disabled")==="true"}function p(n){return n.hasAttribute("checked")}function d(n,r=!1){const e=n.getAttribute("role");let t="current";e?.endsWith("checkbox")||e?.endsWith("radio")?t="checked":(e==="option"||e==="treeitem")&&(t="selected");let s;n.href&&(s="page"),n.mixedState&&(s="mixed"),r?(n.removeAttribute("checked"),n.setAttribute(`aria-${t}`,"false")):(n.setAttribute("checked",""),n.setAttribute(`aria-${t}`,s||"true"))}function I(n){const r=p(n);d(n,r)}function B(n){return n.hasAttribute("active")}function _(n,r=!1){r?n.removeAttribute("active"):n.setAttribute("active","")}function W(n){return Array.from(n.childNodes).filter(r=>r.nodeName==="#text").map(r=>r.textContent).join("").trim()}function D(n){return n.choiceValue||n.value||n.getAttribute("value")||n.getAttribute("data-value")||W(n)}function f(n){return n&&(n.hasAttribute("tabindex")||["BUTTON","A"].includes(n.tagName))}class k extends x{static get properties(){return{type:{type:String}}}get _invokerNode(){return Array.from(this.children).find(r=>r.slot==="invoker")}static styles=[b`
      :host {
        display: block;
      }
    `];constructor(){super(),this.type=""}connectedCallback(){super.connectedCallback(),this._computedType||(this._computedType=this.type||"listitem"),this._invokerNode?this._invokerNode.setAttribute("role",this._computedType):this.setAttribute("role",this._computedType)}render(){return h`
      <slot name="invoker"></slot>
      <slot></slot>
    `}}class ee extends k{connectedCallback(){this._computedType=`menuitem${this.type}`,super.connectedCallback()}}const F=(n=>class extends C(E(T(n))){static styles=[b`
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
      `];render(){return h`
        <slot name="list"></slot>
        <slot></slot>
      `}static get properties(){return{axis:{type:String,reflect:!0},multiple:{type:Boolean,attribute:"multiple"},selectionFollowsFocus:{type:Boolean,attribute:"selection-follows-focus"},wrap:{type:Boolean,attribute:"wrap"},hasNoDefaultSelected:{type:Boolean,reflect:!0,attribute:"has-no-default-selected"},itemWrap:{type:Boolean,attribute:"item-wrap"},_activateOnTypedChars:{type:Boolean},_hasSmartListItems:{type:Boolean},_activeMode:{type:String}}}get slots(){return{...super.slots,list:()=>document.createElement("div")}}get _listNode(){return Array.from(this.children).find(e=>e.slot==="list")}get _scrollTargetNode(){return this}get _listItemsSlot(){return Array.from(this.shadowRoot.querySelectorAll("slot")).find(t=>!t.name)}get listItems(){return this.__listItems||this.formElements}get _childrenRoles(){return[...this._interactiveChildrenRoles,"listitem","group"]}get _interactiveChildrenRoles(){return["menuitem","menuitemcheckbox","menuitemradio","option","treeitem"]}get activeIndex(){return this.listItems.findIndex(e=>B(e))}set activeIndex(e){if(!this.listItems[e])return;const s=this.activeItem,i=this.listItems[e];this.listItems.forEach(l=>{_(l,!0)}),_(i);let o,a;this._activeMode==="activedescendant"?(o=i,a=s):(o=f(i)?i:i.firstElementChild,a=s&&(f(s)?s:s.firstElementChild)),o&&(this._activeMode==="activedescendant"?this._listNode.setAttribute("aria-activedescendant",o.id):(this._activeMode==="roving-tabindex"||this._activeMode==="tabbable-disclosure")&&o.focus(),this.axis==="block"&&!S(this._scrollTargetNode,o)&&o.scrollIntoView({behavior:"smooth",block:"nearest"}),this._activeMode==="roving-tabindex"&&(a&&a.setAttribute("tabindex","-1"),o.setAttribute("tabindex","0")))}get activeItem(){return this.listItems[this.activeIndex]}get checkedIndex(){return this.multiple?this.listItems.filter(e=>p(e)).map(e=>this.listItems.indexOf(e)):this.listItems.findIndex(e=>p(e))}set checkedIndex(e){this.setCheckedIndex(e)}setCheckedIndex(e){this.listItems[e]&&(this.multiple?I(this.listItems[e]):(this.listItems.forEach(s=>{d(s,!0)}),d(this.listItems[e])))}get isInteractiveList(){return!0}constructor(){super(),this.axis="block",this.multiple=!1,this.selectionFollowsFocus=!1,this.wrap=!1,this.hasNoDefaultSelected=!1,this._activeMode="activedescendant",this._hasSmartChildren=!1,this._listRole="menu",this.__listItems=[],this._activateOnTypedChars=!1,this._activateOnCharTimeout=2e3,this.__typedChars=[],this._onListClick=this._onListClick.bind(this),this._onListKeyUp=this._onListKeyUp.bind(this),this._onListKeyDown=this._onListKeyDown.bind(this),this._onListFocusIn=this._onListFocusIn.bind(this)}connectedCallback(){super.connectedCallback(),window.addEventListener("popstate",this._onPopState)}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("popstate",this._onPopState)}firstUpdated(e){super.firstUpdated(e),this._setupList()}#e(e){const t=(i,{newItems:o,level:a=1})=>{if(a===1&&(this._listNode.appendChild(i),this._hasSmartChildren||!(i instanceof Element)))return;if(i.getAttribute("role")==="group"){for(const c of i.children)t(c,{newItems:o,level:a+1});return}const l=Array.from(i.children).filter(c=>f(c));if(l.length)for(const c of l)o.push(c);else o.push(i)},s=[];e.forEach(i=>{t(i,{newItems:s})}),this.itemWrap&&e.length&&this._initMoreButtonMenu(),s.forEach(i=>{this.__listItems.includes(i)||this.__listItems.push(i)}),this._initListItems(s)}_setupList(){this._listItemsSlot.addEventListener("slotchange",()=>{const e=Array.from((this._listItemsSlot.assignedSlot||this).childNodes||[]).filter(t=>!t.slot);this.#e(e)}),this._listNode.setAttribute("role",this._listRole),this._listNode.setAttribute("tabindex",this._activeMode==="tabbable-disclosure"?"-1":"0"),this._listNode.addEventListener("click",this._onListClick),this._listNode.addEventListener("keyup",this._onListKeyUp),this._listNode.addEventListener("keydown",this._onListKeyDown),this._listNode.addEventListener("focusin",this._onListFocusIn)}_initListItems(e){this._activeMode==="roving-tabindex"?e.forEach(t=>t.setAttribute?.("tabindex","-1")):this._activeMode==="activedescendant"&&e.forEach(t=>{t.id=t.id||`${this.localName}-item-${N()}`}),!this.hasNoDefaultSelected&&this.checkedIndex===-1&&(this.checkedIndex=0),e.forEach(t=>{t.hasAttribute("checked")?d(t):d(t,!0)}),this._syncCurrentPageWithLocationHref(window.location)}_onListKeyDown(e){if(m(this)||this.__onKeydownActivateTypedChars(e))return;const{key:s}=e;switch(s){case"Enter":case" ":e.preventDefault(),this.setCheckedIndex(this.activeIndex);break;case"ArrowUp":e.preventDefault(),(this.axis==="block"||this._activeMode==="tabbable-disclosure")&&(this.activeIndex=this._getPreviousEnabledOption(this.activeIndex));break;case"ArrowLeft":(this.axis==="inline"||this._activeMode==="tabbable-disclosure")&&(this.activeIndex=this._getPreviousEnabledOption(this.activeIndex));break;case"ArrowDown":e.preventDefault(),(this.axis==="block"||this._activeMode==="tabbable-disclosure")&&(this.activeIndex=this._getNextEnabledOption(this.activeIndex));break;case"ArrowRight":(this.axis==="inline"||this._activeMode==="tabbable-disclosure")&&(this.activeIndex=this._getNextEnabledOption(this.activeIndex));break;case"Home":e.preventDefault(),this.activeIndex=this._getNextEnabledOption(0,0);break;case"End":e.preventDefault(),this.activeIndex=this._getPreviousEnabledOption(this.listItems.length-1,0);break}["ArrowUp","ArrowDown","Home","End"].includes(s)&&this.selectionFollowsFocus&&!this.multiple&&this.setCheckedIndex(this.activeIndex)}__onKeydownActivateTypedChars(e){if(!this._activateOnTypedChars)return!1;const{key:t,code:s}=e;if(s.startsWith("Key")||s.startsWith("Digit")||s.startsWith("Numpad")){this.__typedChars.push(t);const i=this.__typedChars.join(""),o=this.listItems.find(a=>this._matchCharsAgainstItem({chars:[i],item:a}));return this.activeIndex=this.listItems.indexOf(o),typeof this.__clearCharTimeout=="function"&&this.__clearCharTimeout(),this.__clearCharTimeout=setTimeout(()=>{this.__typedChars=[]},this._activateOnCharTimeout),!0}return!1}_matchCharsAgainstItem({chars:e,item:t}){return D(t).toLowerCase().startsWith(e)}__preventScrollingWithArrowKeys(e){if(this.disabled)return;const{key:t}=e;switch(t){case"ArrowUp":case"ArrowDown":case"Home":case"End":e.preventDefault()}}_onListFocusIn(e){const{target:t}=e,s=this.listItems.indexOf(t);s>-1&&s!==this.activeIndex&&(this.activeIndex=s)}_onListClick(e){const{target:t}=e,s=t.closest("[role]"),i=this.listItems.indexOf(s);i>-1&&(this.activeIndex=i,this.setCheckedIndex(i))}_onListKeyUp(e){if(this.disabled)return;const{key:t}=e;switch(t){case"ArrowUp":case"ArrowDown":case"Home":case"End":case" ":case"Enter":e.preventDefault()}}__getNextOption(e,t){const s=i=>t===1?i<this.listItems.length:i>=0;for(let i=e+t;s(i);i+=t)if(this.listItems[i]&&!m(this.listItems[i]))return i;if(this.wrap){const i=t===-1?this.listItems.length-1:0;for(let o=i;s(o);o+=1)if(this.listItems[o]&&!m(this.listItems[o]))return o}return e}_getNextEnabledOption(e,t=1){return this.__getNextOption(e,t)}_getPreviousEnabledOption(e,t=-1){return this.__getNextOption(e,t)}_syncCurrentPageWithLocationHref(e){this.listItems.forEach(t=>{t.href&&((e.href.endsWith("/")?e.href.substring(0,e.href.length-1):e.href)===t.href?d(t):d(t,!0))})}_onPopState=()=>{this._syncCurrentPageWithLocationHref(document.location)}}),M=v(F),R=(n=>class extends M(n){render(){return h`
        <slot name="invoker"></slot>
        <slot name="list"></slot>
        <slot id="list-items-outlet"></slot>
      `}static get properties(){return{invokerNode:{type:Object},behaveAsAccordion:{type:Boolean,attribute:"behave-as-accordion"},level:{type:Number,reflect:!0}}}get _invokerNode(){const e=this.constructor;return e._getFocusableInvokerEl&&this.invokerNode?e._getFocusableInvokerEl(this.invokerNode):super._invokerNode}get _contentNode(){return this._listNode}constructor(){super(),this.invokerNode=void 0,this.handleFocus=!0,this.parentList=void 0,this.behaveAsAccordion=!1,this.level=1,this.hasNoDefaultSelected=!0,this._activeMode="roving-tabindex",this._subListMap=new Map}static _getSubInteractiveList(e){if(e.nextElementSibling?.isInteractiveList)return e.nextElementSibling;if(e.getAttribute?.("role")==="listitem"||e.hasAttribute?.("data-item"))return Array.from(e.children).find(i=>i.isInteractiveList)}_initListItems(e){super._initListItems(e);const t=this.constructor;e.forEach(s=>{const i=t._getSubInteractiveList(s);i&&(this._subListMap.set(s,i),i.level=this.level+1,i.parentList=this,i.invokerNode=s,i.invokerInteraction=this.invokerInteraction,i._activeMode=this._activeMode)})}toggle(e){e&&this._listNode.contains(e.target)||super.toggle()}_onListKeyDown(e){if(Array.from(this._subListMap).find(([,a])=>a===e.target||a.contains(e.target)))return;super._onListKeyDown(e);const s=this._subListMap.get(this.activeItem),i=this.parentList,{key:o}=e;switch(o==="Escape"&&i&&e.stopPropagation(),o){case"Enter":case" ":this.activeItem?.click();break;case"ArrowDown":this.axis==="inline"&&s&&this._activeMode!=="tabbable-disclosure"&&this.activeItem.click();break;case"ArrowRight":this.axis==="block"&&s&&this.activeItem.click();break;case"ArrowUp":this.axis==="inline"&&i&&(this.close(),i._onOverlayShow&&i._onOverlayShow());break;case"ArrowLeft":this.axis==="block"&&i&&(this.close(),i._onOverlayShow&&i._onOverlayShow());break}}_syncCurrentPageWithLocationHref(e){super._syncCurrentPageWithLocationHref(e),this._subListMap.forEach(t=>{t.listItems.forEach(s=>{p(s)&&t._invokerNode&&d(t._invokerNode)})})}}),U=v(R);class H extends U(x){static get properties(){return{bar:{type:Boolean}}}setCheckedIndex(r){const e=this.listItems[r];if(!e)return;const t=e.getAttribute("role");let s=this.listItems,{multiple:i}=this;if(t==="menuitemradio"||t==="menuitemcheckbox"){const o=e.closest('[role="group"]'),a=o&&this.contains(o)?o:this;s=this.listItems.filter(l=>a.contains(l)),i=t==="menuitemcheckbox"}i?I(this.listItems[r]):(s.forEach(o=>{d(o,!0)}),d(this.listItems[r]))}constructor(){super(),this.bar=!1,this.behaveAsAccordion=!0,this._listRole="menu",this._activateOnTypedChars=!0,this.invokerInteraction="click"}firstUpdated(r){super.firstUpdated(r),this._activeMode==="tabbable-disclosure"&&(this._listRole="list"),this._listNode.setAttribute("role",this._listRole),this.dataset.menu=""}updated(r){super.updated(r),r.has("bar")&&(this.bar?(this.axis="inline",this._listRole==="menu"&&(this._listRole="menubar")):(this.axis="block",this._listRole==="menubar"&&(this._listRole="menu")))}}const z=(n=>class extends A(M(n)){_onOverlayShow=()=>{this.checkedIndex!=null&&(this.activeIndex=this.checkedIndex)};_setupOverlayCtrl(){super._setupOverlayCtrl(),this._overlayCtrl&&this._overlayCtrl.addEventListener("show",this._onOverlayShow)}_teardownOverlayCtrl(){super._teardownOverlayCtrl(),this._overlayCtrl&&this._overlayCtrl.removeEventListener("show",this._onOverlayShow)}get _overlayContentNode(){return this._contentNode}get _overlayInvokerNode(){return this._invokerNode}}),K=v(z);class P extends K(H){static get properties(){return{openableMode:{type:String,attribute:"openable-mode"}}}constructor(){super(),this.openableMode="disclosure",this._shouldSetupOverlay=!1}updated(r){super.updated(r),r.has("openableMode")&&(this.openableMode==="overlay"?(this._shouldSetupOverlay=!0,this._setupOverlayCtrl()):this._teardownOverlayCtrl())}render(){return h`
      <slot name="invoker"></slot>
      <div id="overlay-content-node-wrapper">
        <slot name="list"></slot>
      </div>
      <slot id="list-items-outlet"></slot>
    `}_defineOverlayConfig(){const{parentList:r}=this;let e="bottom-start";r?.axis!=="inline"&&(e="right-start");const t=L();return{...t,hidesOnEsc:!0,popperConfig:{...t.popperConfig,placement:e,strategy:"absolute",modifiers:[{name:"offset",enabled:!0,options:{offset:[0,0]}}]}}}_onListKeyUp(r){super._onListKeyUp(r);const{key:e}=r;e==="Escape"&&r.stopPropagation()}}customElements.define("lion-item",k);customElements.define("lion-menu",P);function y(n){const r=document.createElement("div");return w(n,r),r.firstElementChild}let g=!1;function ne(){if(g)return;const n=h`<link
    rel="stylesheet"
    href="https://use.fontawesome.com/releases/v5.1.0/css/all.css"
    integrity="sha384-lKuwvrZot6UHsBSfcMvOkWwlCMgc0TaWr+30HWe3a4ltaBwTZhyTEggF5tJv8tbt"
    crossorigin="anonymous"
  />`;document.head.appendChild(y(n));const r=h` <style>
    [role='menu']:focus {
      outline: none;
    }

    [role='toolbar'],
    [role='tree'],
    [role='menubar'],
    [role='menu'] {
      background: white;
      font-family: sans-serif;
      font-size: 12px;
    }

    [level] > [role='menu'] {
      border: 1px solid black;
    }

    [role='treeitem']:not([aria-expanded]),
    [role='treeitem'][aria-expanded],
    [role^='menuitem']:not([aria-expanded]),
    [role^='menuitem'][aria-expanded] {
      all: unset;
      display: block;
      width: 100%;
      position: relative;
      box-sizing: border-box;
      padding: 4px 24px 4px 8px;
    }

    [role='treeitem']:not([aria-expanded]),
    [role='treeitem'][aria-expanded] {
      padding-left: 16px;
    }

    [role='treeitem'][active]:not([aria-expanded]),
    [role='treeitem'][active][aria-expanded],
    [role^='menuitem'][active]:not([aria-expanded]),
    [role^='menuitem'][active][aria-expanded] {
      background: lightgrey;
    }

    [role^='menuitem'][checked]:not([aria-expanded]),
    [role^='menuitem'][checked][aria-expanded] {
      background: #eee;
    }

    [role='treeitem'],
    [role^='menuitem'] {
      position: relative;
      cursor: default;
    }

    [role='treeitem']::after,
    [role^='menuitem']::after {
      position: absolute;
      top: 5px;
      font-size: 10px;
    }

    [role^='menuitem']::after {
      right: 4px;
    }

    [role^='treeitem']::after {
      left: 4px;
    }

    [role^='menuitem'][aria-expanded]::after {
      content: '▶';
    }

    [role^='menuitem'][aria-expanded='true']::after {
      content: '▼';
    }

    [axis='inline'] [role^='menuitem'][aria-expanded]::after {
      content: '▼';
    }

    [role='menuitemcheckbox'][aria-checked='true']::after {
      content: '🗹';
    }

    [role='menuitemradio'][aria-checked='true']::after {
      content: '◉';
    }

    [role='separator'] {
      border-bottom: 1px solid gray;
    }

    [role='treeitem'][aria-expanded]::after {
      content: '+';
    }

    demo-tree[level='1'] [role='treeitem']:not([aria-expanded]),
    demo-tree[level='1'] [role='treeitem'][aria-expanded] {
      padding-left: 24px;
    }

    lion-menu[level='1'] [role^='menuitem']:not([aria-expanded]),
    lion-menu[level='1'] [role^='menuitem'][aria-expanded] {
      padding-left: 16px;
    }

    demo-tree[level='2'] [role='treeitem']:not([aria-expanded]),
    demo-tree[level='2'] [role='treeitem'][aria-expanded] {
      padding-left: 32px;
    }
    lion-menu[level='2'] [role^='menuitem']:not([aria-expanded]),
    lion-menu[level='2'] [role^='menuitem'][aria-expanded] {
      padding-left: 24px;
    }

    [role='toolbar'] {
      padding: 8px;
      background: #eee;
    }
    [role='toolbar'] button {
      background: none;
      padding: 4px 8px;
      border: 1px transparent;
    }
    [role='toolbar'] button[aria-pressed='true'],
    [role='toolbar'] button[aria-checked='true'] {
      background: white;
      border: 1px black;
    }

    [role='toolbar'] > div[role='separator'] {
      margin-left: 8px;
      margin-right: 8px;
      border-left: 1px solid lightgray;
    }

    button[slot='invoker'] {
      background: none;
      color: inherit;
      border: none;
      padding: 0;
      font: inherit;
      display: block;
      width: 100%;
      text-align: left;
    }
  </style>`;document.head.appendChild(y(r)),g=!0}export{ee as L,ne as a};
