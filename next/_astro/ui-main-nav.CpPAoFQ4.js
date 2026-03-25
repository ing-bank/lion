import{i as $,r as b,a as f,y as x}from"./lit-element.jD9bOQKo.js";import{x as u,E as k}from"./lit-html.DtZEZPQ5.js";import"./unsafe-html.DgrA3nwU.js";import{f as R}from"./async-directive.D1sG2PVh.js";import{d as D}from"./dedupeMixin.6XPTJgK8.js";import{v as C,a as P,s as M,r as B}from"./styles.CzFqDnY5.js";import{b as O}from"./browserDetection.Q_TJsMHE.js";class N extends R{host;#t=!1;parts={root:{required:!0,role:"presentation"}};setupFunctions={};updateFunctions={};update(t,[e,s,r]){if(!Object.keys(this.parts).includes(s))throw new Error(`[UIPartDirective setup] Unknown part ${s}`);this.host=t.options.host,this.#t||(t.element.setAttribute("data-part",s),e.registerRef(s,t.element),this.setupFunctions[s]&&this.setupFunctions[s](t,{context:e,localContext:r}),this.#t=!0),this.updateFunctions[s]?.(t,{context:e,localContext:r})}}const H=(o,t)=>(...e)=>({_$litDirective$:o,values:[t,...e]}),F=globalThis.ShadowRoot&&(globalThis.ShadyCSS===void 0||globalThis.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype;function L(o,t){if(F&&o.adoptedStyleSheets)o.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const e of t){const s=document.createElement("style"),r=globalThis.litNonce;r!==void 0&&s.setAttribute("nonce",r),s.textContent=e.cssText,o.appendChild(s)}}class z{host;registry;supportsScopedRegistry=!1;constructor({host:t,scopedElements:e}){if((this.host=t).addController(this),!(e&&Object.keys(e).length))return;if(!this.supportsScopedRegistry){const n=(c,d)=>c!==d;for(const[c,d]of Object.entries(e)){const a=customElements.get(c);if(!a)customElements.define(c,d);else if(n(a,d))throw new Error([`Trying to register multiple classes under name "${c}".`,"Load scoped-custom-element-registry polyfill: https://www.npmjs.com/package/@webcomponents/scoped-custom-element-registry"].join(`
`))}return}this.registry=new CustomElementRegistry;for(const[n,c]of Object.entries(e))this.registry.define(n,c);const r=t.constructor,i=r.prototype.attachShadow;if(r.prototype.attachShadow=function(...n){return i.call(this,{...n[0],customElements:this.registry,registry:this.registry},...n.slice(1))},!(t instanceof x))return;const l=r.prototype.createRenderRoot;r.prototype.createRenderRoot=function(...n){l.call(this,...n);const{shadowRootOptions:c,elementStyles:d}=this.constructor,a=this.shadowRoot||this.attachShadow(c);return this.renderOptions.creationScope=a,L(a,d),this.renderOptions.renderBefore??=a.firstChild,a}}}function w(o){return Number(o.replace(/[^-\d.]/g,""))}class U{host;container;resizeObserver;dynamicLayouts;currentLayout;onLayoutChange;constructor({host:t,dynamicLayouts:e,onLayoutChange:s}){(this.host=t).addController(this),!(!e||!Object.keys(e).length)&&(this.dynamicLayouts=e,this.onLayoutChange=s,this.host.setAttribute("data-layout-cloak",""))}hostConnected(){this.dynamicLayouts&&(this.container=document.body,this.resizeObserver=new ResizeObserver(t=>{this.setNewLayout({newWidth:t[0].contentBoxSize[0].inlineSize}),this.host.removeAttribute("data-layout-cloak")}),this.resizeObserver?.observe(this.container))}hostDisconnected(){this.resizeObserver?.unobserve(this.container)}#t(){return Object.entries(this.dynamicLayouts).sort(([,t],[,e])=>w(e.breakpoint)-w(t.breakpoint))}setNewLayout({newWidth:t}){const s=this.#t().find(r=>t>=w(r[1].breakpoint))?.[0];s!==this.currentLayout&&(this.host.setAttribute("data-layout",s),this.currentLayout=s,this.onLayoutChange?.(this.dynamicLayouts[s]))}}const j=o=>class extends o{labels=[];static styles=[];static lightStyles=[];static templates={};static templateContextProcessor;templates=this.constructor.templates;scopedElements=this.constructor.scopedElements;dynamicLayouts=this.constructor.dynamicLayouts;templateContextProcessor=this.constructor.templateContextProcessor;dynamicLayoutCtrl;scopedRegistryCtrl;#t={};refs={};static contextStore=new WeakMap;static _instances=[];static _partDirective;static properties={_rerenderToggle:{type:Boolean,state:!0,attribute:!1}};get templateContext(){return{templates:this.templates,data:{},set:(e,s)=>{e in this.templateContext.data&&(this[e]=s,this.requestUpdate(e))},registerRef:(e,s,{isPartOfCollection:r=!1}={})=>{r?(this.refs[e]=this.refs[e]||[],this.refs[e].push(s)):this.refs[e]=s,this.#t[e]?.forEach(i=>i(s))},onRegisterRef:(e,s)=>{this.refs[e]?s(this.refs[e]):(this.#t[e]=this.#t[e]||[],this.#t[e].push(s))},refs:this.refs}}constructor(){super(),this.dynamicLayoutCtrl=new U({host:this,dynamicLayouts:this.constructor.dynamicLayouts,onLayoutChange:()=>{this._forceRerender()}}),this.scopedRegistryCtrl=new z({host:this,scopedElements:this.scopedElements}),this.constructor._instances.push(this)}static _extractDataFromProvider(e){const s=[],r=[];let i,l,n;e.styles&&s.push(...e.styles(this.styles)),e.lightStyles&&r.push(...e.lightStyles(this.lightStyles));const{templateContextProcessor:c}=e;if(e.templates&&(i=e.templates(this.templates)),e.scopedElements&&(l=e.scopedElements(this.scopedElements)),e.dynamicLayouts){n=e.dynamicLayouts(this.dynamicLayouts);const d=Object.entries(n);for(let a=0;a<d.length;a+=1){const[v,{styles:h,breakpoint:p,container:y,templateContextProcessor:st}]=d[a],[rt,S]=d[a+1]||[],I=y===globalThis?"media":"container";for(const T of h||[])s.push(f`
              @${b(I)} (${b(p)} <= width ${b(S?.breakpoint?`<= ${S?.breakpoint}`:"")}) {
                ${T}
              }
            `)}}return{templateContextProcessor:c,lightStylesFromProvider:r,stylesFromProvider:s,scopedElements:l,dynamicLayouts:n,templates:i}}static _initInstanceDesign(e,s,r){e.shadowRoot?.querySelectorAll("style").forEach(i=>i.remove()),L(e.shadowRoot,s),r&&L(e,r),e._forceRerender()}static provideDesign(e){const s=this,{templateContextProcessor:r,lightStylesFromProvider:i,stylesFromProvider:l,scopedElements:n,dynamicLayouts:c,templates:d}=s._extractDataFromProvider(e);s.templates=d||s.templates,Object.defineProperty(s,"scopedElements",{value:n||s.scopedElements}),s.templateContextProcessor=r,s.dynamicLayouts=c,s.elementStyles=s.finalizeStyles([...l]),Object.defineProperty(s,"styles",{value:s.elementStyles});for(const a of Array.from(s._instances))s._initInstanceDesign(a,s.elementStyles,i)}provideDesign(e){const s=this.constructor,{templateContextProcessor:r,lightStylesFromProvider:i,stylesFromProvider:l,scopedElements:n,dynamicLayouts:c,templates:d}=s._extractDataFromProvider(e);this.templates=d||this.templates,this.scopedElements=n||this.scopedElements,this.templateContextProcessor=r,this.dynamicLayouts=c;const a=s.finalizeStyles([...s.styles,...l]);s._initInstanceDesign(this,a,i)}_forceRerender(){this._rerenderToggle=!this._rerenderToggle}render(){const{templates:e}=this;let{templateContext:s}=this;const{currentLayout:r}=this.dynamicLayoutCtrl;this.templateContextProcessor&&(s=this.templateContextProcessor(s)),this.constructor.dynamicLayouts?.[r]?.templateContextProcessor&&(s=this.dynamicLayouts[r]?.templateContextProcessor(s));const i=this.constructor._partDirective;return i&&(s.part=H(i,s)),e?.root?e.root(s):new Error("[UIBaseElement] Provide a root render function")}#e=!1;onSetup(){}onTeardown(){}connectedCallback(){super.connectedCallback(),this.updateComplete.then(()=>{this.#e||(this.onSetup(),this.#e=!0)})}async disconnectedCallback(){super.disconnectedCallback(),await this.#s()&&(this.onTeardown(),this.#e=!1)}async#s(){return await this.updateComplete,!this.isConnected}exposedPrivateMembers={}},V=D(j);class q extends V($){}function E(o,{activePath:t,activeItem:e,shouldReset:s=!1}={}){const r=new WeakMap;let i=s,l=!t&&!e,n=null,c=null;const d=(v,{action:h})=>{const p=r.get(v);if(p){if(h==="activate")p.hasActiveChild=!0;else if(h==="reset"){if(delete p.hasActiveChild,n===p)return}else throw new Error(`[UIMainNav]: Unknown action ${h}`);d(p,{action:h})}},a=v=>{for(const h of v.items){if(r.set(h,c),i&&h.active&&(delete h.active,d(h,{action:"reset"}),i=!1),(t&&h.url===t||e&&h===e)&&(h.active=!0,d(h,{action:"activate"}),l=!0,n=h),l&&!i)break;h.nextLevel&&(c=h,a(h.nextLevel))}};a(o)}class A{constructor(t){this.el=t,this._listeners=[],this._attrs=new Set}setAttribute(...t){this._attrs.add(t),this.el.setAttribute(...t)}toggleAttribute(...t){!!t[1]?this.setAttribute(t[0],""):this.removeAttribute(t[0])}removeAttribute(t){this._attrs.delete(t),this.el.removeAttribute?.(t)}addEventListener(...t){this._listeners.push(t),this.el.addEventListener(...t)}reset(){for(const t of Array.from(this._attrs))this.el.removeAttribute(t[0]);for(const t of this._listeners)this.el.removeEventListener(...t)}}function W(){return Object.prototype.hasOwnProperty.call(HTMLElement.prototype,"popover")}function Z(o){return o.disabled||o.hasAttribute?.("disabled")||o.hasAttribute?.("aria-disabled")}class m{host;level;invoker;target;open=!1;visuallyHidden=!1;usesPopover=!1;_rInvoker;_rTarget;static _hasScrollLockStyles=!1;static handleScrollLock({isOpen:t}){const{isIOS:e,isMacSafari:s}=O;document.body.toggleAttribute("data-scroll-lock",t),(e||s)&&document.body.toggleAttribute("data-scroll-lock-ios-fix",t),e&&document.documentElement.toggleAttribute("data-scroll-lock-ios-fix",t)}constructor(t,e){(this.host=t).addController(this);const{invoker:s,target:r,level:i,initialOpen:l,visuallyHidden:n,mode:c,omitStyleDependecyCheck:d,shouldHandleScrollLock:a}=e;if(!s)throw new Error("[VisibilityToggleCtrl]: Missing invoker");if(!r)throw new Error("[VisibilityToggleCtrl]: Missing target");if(d&&!this.host.constructor.elementStyles.includes(C))throw new Error("[VisibilityToggleCtrl]: Missing `visibilityStyle` that provides [hidden] and [data-visually-hidden] rules");if(!this._hasScrollLockStyles){const p=document.createElement("style");p.setAttribute("data-scroll-lock-styles",""),p.textContent=P.cssText,document.head.appendChild(p),this._hasScrollLockStyles=!0}this.level=i,this.invoker=s,this.target=r,this._rInvoker=new A(s),this._rTarget=new A(r),this.shouldHandleScrollLock=a;const v=t.shadowRoot||r.getRootNode?.();this.visuallyHidden=n,this.usesPopover=W()&&c==="popover";const h=this.target?.getAttribute?.("id")||Math.random().toString(36).substr(2,9);this.usesPopover&&(this._rInvoker.setAttribute("popovertarget",h),this._rTarget.setAttribute("popover",""),this._rTarget.setAttribute("id",h),this._rTarget.addEventListener?.("beforetoggle",p=>{this.__wasInternalPopoverSync||p.target===this.target&&p.newState==="open"&&this._set({open:!0,syncsFromPopover:!0})}),this._rTarget.addEventListener?.("toggle",p=>{this.__wasInternalPopoverSync||p.target===this.target&&p.newState!=="open"&&this._set({open:!1,syncsFromPopover:!0})})),this._rInvoker.setAttribute("aria-controls",h),this.usesPopover||this._rInvoker.addEventListener?.("click",p=>{p.button===0&&this._set({open:"toggle"})}),this._set({open:!!l,isInitialRender:!0}),this.visuallyHidden&&(this._rTarget.addEventListener?.("focusin",async()=>{await this.host.updateComplete,!(this.__wasInternalPopoverSync||!this.visuallyHidden||this.open)&&this._set({open:!0})}),this._rTarget.addEventListener?.("focusout",async p=>{await this.host.updateComplete,!(this.__wasInternalPopoverSync||r.contains(v.activeElement)||r.contains(p.relatedTarget))&&this._set({open:!1})}))}async _set({open:t,isInitialRender:e=!1,syncsFromPopover:s=!1}){if(Z(this.invoker)||!e&&t===this.open)return;const{usesPopover:r,visuallyHidden:i}=this;if(this.open=!!(t==="toggle"?!this.open:t),this._rTarget.toggleAttribute?.("data-open",this.open),r?s||(this.__wasInternalPopoverSync=!0,this.open?this.target.showPopover?.():this.target.hidePopover?.(),this.__wasInternalPopoverSync=!1):this._rInvoker.setAttribute("aria-expanded",`${this.open}`),!e)try{await Promise.all(this.target.getAnimations().map(l=>l.finished))}catch(l){console.warn(l)}this._rTarget.toggleAttribute?.(i?"data-visually-hidden":"hidden",!this.open),this.shouldHandleScrollLock&&this.constructor.handleScrollLock({isOpen:this.open})}toggle(){this._set({open:"toggle"})}show(){this._set({open:!0})}hide(){this._set({open:!1})}teardown(){this._rInvoker.reset(),this._rTarget.reset(),this.host.removeController(this)}}function G(o,t){let e=t;for(;e;){if(e.constructor.name===o)return!0;e=Object.getPrototypeOf(e)}return!1}function J(o){if(!(o.tagName==="NAV"||o.getAttribute("role")==="navigation"))throw new Error('Please apply to HTMLNavElement (`<nav>`) | `[role="navigation"]`')}function K(o){if(!(o.tagName==="UL"||o.tagName==="OL"))throw new Error("Please apply to HTMLUListElement (`<ul>`) | HTMLOListElement (`<ol>`)");if(o.getAttribute("role")!=="list")throw new Error('Please apply to [role="list"]. See https://www.scottohara.me/blog/2019/01/12/lists-and-safari.html')}function Q(o){if(o.tagName!=="LI")throw new Error("Please apply to HTMLLIElement (`<li>`)")}function X(o){if(o.tagName!=="A")throw new Error("Please apply to HTMLAnchorElement (`<a>`)")}function g(o){if(!(o.tagName==="BUTTON"||G("LionButton",o)||o.getAttribute("role")==="button"))throw new Error("Please apply to HTMLButtonElement (`<button>`) | LionButton | `[role=button]`")}const Y={"lion:portal:search":u`
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <circle cx="11" cy="11" r="8"></circle>
      <path d="m21 21-4.35-4.35"></path>
    </svg>
  `,"lion:portal:github":u`
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="currentColor"
      stroke="none"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path
        d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v 3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
      />
    </svg>
  `,"lion:portal:l1Invoker":u`<svg
    width="800"
    height="800"
    viewBox="0 0 28 28"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M4 7C4 6.44771 4.44772 6 5 6H24C24.5523 6 25 6.44771 25 7C25 7.55229 24.5523 8 24 8H5C4.44772 8 4 7.55229 4 7Z"
    />
    <path
      d="M4 13.9998C4 13.4475 4.44772 12.9997 5 12.9997L16 13C16.5523 13 17 13.4477 17 14C17 14.5523 16.5523 15 16 15L5 14.9998C4.44772 14.9998 4 14.552 4 13.9998Z"
    />
    <path
      d="M5 19.9998C4.44772 19.9998 4 20.4475 4 20.9998C4 21.552 4.44772 21.9997 5 21.9997H22C22.5523 21.9997 23 21.552 23 20.9998C23 20.4475 22.5523 19.9998 22 19.9998H5Z"
    />
  </svg>`};class tt extends N{parts={root:{role:"presentation"},nav:{role:"nav",description:"Main navigation landmark for the page. All navigation items are inside"},"l1-invoker":{role:"button",optional:!0,description:"Button (usually hamburger icon) that is responsible for toggling l1 nav. Common on mobile layouts"},level:{role:"presentation",description:"This marks the difference between different navigation levels (l1, l2, l3 etc.). Commonly bound to disclosure patterns like collapsibles, dropdowns and fly-outs"},"level-back-btn":{role:"button",optional:!0,description:"In mobile fly-out menus, this is used to go back to the previous level"},list:{role:"list",description:"Necessary semantics for screen readers. Each level contains at least 1 list"},listitem:{role:"listitem",description:"Neccessary semantics. A list item wraps a an anchor, command-invoker or, level-invoker"},anchor:{role:"link",description:"Most navigation items are anchors with an href. Up to the app to handle them in a SPA or MPA."},"level-invoker":{role:"button",description:""},"command-invoker":{role:"button",description:"Sends an event up, that can be handlded by the parent. For instance, a search modal that is opened",optional:!0},icon:{name:"icon",role:"img",optional:!0}};setupFunctions={nav:(t,e)=>this.constructor._setupNav(t,e),"l1-invoker":(t,e)=>this.constructor._setupL1Invoker(t,e),level:(t,e)=>this.constructor._setupLevel(t,e),"level-back-btn":(t,e)=>this.constructor._setupLevelBackBtn(t,e),list:(t,e)=>this.constructor._setupList(t,e),listitem:(t,e)=>this.constructor._setupListitem(t,e),anchor:(t,e)=>this.constructor._setupAnchor(t,e),"level-invoker":(t,e)=>this.constructor._setupInvokerForLevel(t,e),"command-invoker":(t,e)=>this.constructor._setupCommandInvoker(t,e),icon:(t,e)=>this.constructor._setupIcon(t,e)};updateFunctions={root:(t,e)=>this.constructor._updateRoot(t,e),"l1-invoker":(t,e)=>this.constructor._updateL1Invoker(t,e),listitem:(t,e)=>this.constructor._updateListItem(t,e),icon:(t,e)=>this.constructor._updateIcon(t,e)};static setLevel(t,e){if(typeof e!="number")throw new Error("[UIMainNavPartDirective]: Please provide a level in localContext");t.setAttribute("data-level",e)}static getVisibilityToggleCtrlForInvoker({invoker:t,host:e}){return this.__controllers&&Array.from(this.__controllers)?.find(s=>s.invoker===t)}static _updateRoot({element:t},{context:e}){e.data.hasL1Open?t.setAttribute("data-has-l1-open",""):t.removeAttribute?.("data-has-l1-open")}static _setupNav({element:t}){J(t)}static _setupL1Invoker({element:t,options:e},{context:s,localContext:r}){g(t),t.setAttribute("aria-label",s.translations.l1Invoker)}static _updateL1Invoker({element:t,options:e},{context:s,localContext:r}){if(s.data.navData.hideToggle){t.setAttribute("hidden","");const i=this.getVisibilityToggleCtrlForInvoker({host:e.host,invoker:t});i?i?.teardown():s.onRegisterRef("level-1",l=>{l.removeAttribute?.("hidden"),l.removeAttribute?.("popover"),l.removeAttribute?.("data-visually-hidden")});return}t.removeAttribute?.("hidden"),s.onRegisterRef("level-1",i=>{new m(e.host,{invoker:t,target:i,level:1,mode:"popover",initialOpen:!1,shouldHandleScrollLock:r.levelConfig.shouldHandleScrollLock})})}static _setupLevel({element:t,options:e},{context:s,localContext:r}){const{level:i,isToggleTarget:l,levelConfig:n}=r;this.setLevel(t,i),t.setAttribute("id",`level-${i}`),s.registerRef(`level-${i}`,t);const{showVia:c="disclosure",initialOpen:d,visuallyHidden:a=!1}=n||{},v=s.refs[i===1?"l1-invoker":`level-invoker-l${i}`];if(l&&v&&!r.levelConfig.hideToggle){if(i===1){new m(e.host,{visuallyHidden:!1,initialOpen:!1,target:t,mode:"popover",invoker:v,level:1});return}new m(e.host,{target:t,visuallyHidden:a,mode:c,initialOpen:d,invoker:v,level:i})}}static _setupLevelBackBtn({element:t},{context:e,localContext:s}){g(t),this.setLevel(t,s.level),t.setAttribute("type","button"),t.addEventListener("click",({})=>{t.parentElement.hidePopover()}),e.registerRef(`level-back-btn-l${s.level}`,t)}static _setupList({element:t},{context:e,localContext:s}){t.setAttribute("role","list"),K(t),this.setLevel(t,s.level),t.setAttribute("data-part","list"),e.registerRef(`list-${s.level}`,t)}static _setupListitem({element:t},{context:e,localContext:s}){Q(t),t.setAttribute("data-part","listitem"),this.setLevel(t,s.level),e.registerRef(`list-item-l${s.level}`,t,{isPartOfCollection:!0})}static _updateListItem({element:t},{localContext:e}){e.item.active&&t.setAttribute("data-active",""),e.item.hasActiveChild&&t.setAttribute("data-has-active-child","")}static _setupAnchor({element:t},{context:e,localContext:s}){this.setLevel(t,s.level),X(t),t.setAttribute("data-part","anchor"),t.setAttribute("href",s.item.url),s.item.target&&t.setAttribute("target",s.item.target),s.item.rel&&t.setAttribute("rel",s.item.rel),e.registerRef(`anchor-l${s.level}`,t,{isPartOfCollection:!0}),s.item.active&&t.setAttribute("aria-current","page")}static _setupInvokerForLevel({element:t},{context:e,localContext:s}){g(t),this.setLevel(t,s.level),t.setAttribute("data-part","level-invoker"),t.setAttribute("popovertarget",`level-${s.level+1}`),t.setAttribute("type","button"),e.registerRef(`level-invoker-l${s.level+1}`,t),t.addEventListener("click",async r=>{r.button===0&&(E(e.data.navData,{activeItem:s.item,shouldReset:!0}),r.stopPropagation())})}static _setupIcon({element:t},{context:e,localContext:s}){this.setLevel(t,s.level),t.setAttribute("data-part","icon"),e.registerRef(`icon-l${s.level}`,t)}static _updateIcon({element:t},{localContext:{item:e}}){t.setAttribute("icon-id",(e.active||e.hasActiveChild)&&e.iconActiveId||e.iconId)}static _setupCommandInvoker({element:t,options:e},{localContext:s}){g(t),this.setLevel(t,s.level),t.addEventListener("click",()=>{e.host.dispatchEvent(new CustomEvent(s.item.command))})}}class _ extends q{static properties={navData:{type:Array,attribute:"nav-data"}};static _partDirective=tt;static tagName="ui-main-nav";constructor(){super(),this.navData=[]}get templateContext(){return{...super.templateContext,data:{navData:this.navData,iconIds:Y},translations:{l1Invoker:"Main menu",levelBackBtn:"Back"},fns:{closeMenu:({shouldPreventAnimations:t})=>{t&&this.setAttribute("data-prevent-animations","");const e=Array.from(this.__controllers||[])||[];for(const s of e||[])s instanceof m&&s.hide();t&&this.removeAttribute("data-prevent-animations")},updateNavData:E}}}static templates={root(t){const{data:e,templates:s,part:r}=t;return u`
        <div ${r("root")}>
          <nav ${r("nav")}>
            ${s.navLevel0?.(t,{levelConfig:e.navData})}
            ${s.navLevel(t,{levelConfig:e.navData,level:1,isToggleTarget:!0})}
          </nav>
        </div>
      `},navLevel(t,{levelConfig:e,level:s,isToggleTarget:r,hasActiveChild:i}){const{templates:l,part:n,translations:c}=t,d=r&&s>1;return u` <div ${n("level",{levelConfig:e,level:s,isToggleTarget:r,hasActiveChild:i})}>
        ${d?u`<!-- -->
              <button ${n("level-back-btn",{level:s})}>
                ${l.icon(t,{item:{iconId:"lion:portal:chevronLeft"},level:0})}
                ${c.levelBackBtn}
              </button>`:k}
        <ul ${n("list",{level:s})}>
          ${e.items.map(a=>u`<!-- -->
                <li ${n("listitem",{item:a,level:s})}>
                  ${l.navItem(t,{item:a,level:s})}
                  ${a.nextLevel?l.navLevel(t,{hasActiveChild:a.hasActiveChild,levelConfig:a.nextLevel,isToggleTarget:!a.url,level:s+1}):k}
                </li>`)}
        </ul>
      </div>`},navItem(t,{item:e,level:s}){const{part:r,templates:i}=t;return e.url?u` <a ${r("anchor",{item:e,level:s})}>
          ${i.icon(t,{item:e,level:s})}<span>${e.name}</span>
        </a>`:e.nextLevel?u`<!-- -->
          <button ${r("level-invoker",{item:e,level:s})}>
            ${i.icon(t,{item:e,level:s})}<span>${e.name}</span>
          </button>`:u`<!-- -->
        <button ${r("command-invoker",{item:e,level:s})}>
          ${i.icon(t,{item:e,level:s})}<span>${e.name}</span>
        </button>`},navLevel0(t,{levelConfig:e}){const{data:s,part:r,templates:i}=t;return u`<!-- -->
        <div ${r("level",{level:0})}>
          <div data-part="l0-before"><slot name="l0-before"></slot></div>
          <button ${r("l1-invoker",{levelConfig:e})}>
            ${i.icon(t,{level:0,item:{iconId:"lion:portal:l1Invoker"}})}
          </button>
          <div data-part="l0-after"><slot name="l0-after"></slot></div>
        </div>`},icon(t,{item:e,level:s}){const r=t.data.iconIds[e.iconId];return r?u`<span data-part="icon" data-level="${s}">${r}</span>`:k}}}f`
  /**
   * Hide until hydration on mobile (to prevent flash of unstyled content of desktop render)
   */
  :host(:not([data-layout])) {
    display: none;
  }

  :host(:not([data-prevent-animations])) [popover]:popover-open {
    @starting-style {
      translate: var(--_width) 0;
    }
  }

  :host(:not([data-prevent-animations])) [popover]:popover-open {
    translate: 0 0;
  }

  :host(:not([data-prevent-animations])) [popover] {
    transition:
      translate calc(var(--_anim-factor) * var(--_anim-speed)) ease-out,
      overlay calc(var(--_anim-factor) * var(--_anim-speed)) ease-out allow-discrete,
      display calc(var(--_anim-factor) * var(--_anim-speed)) ease-out allow-discrete;
    translate: calc(-1 * var(--_width)) 0;
  }

  [data-level='1'][popover]::backdrop {
    background: rgba(0, 0, 0, 0.3);
  }

  /* ----------------------------
   * part: root
   */

  @media (prefers-reduced-motion) {
    :host {
      --_anim-factor: 0;
    }
  }

  :host {
    --_width: 400px;
    --_bg-color: white;
    --_anim-factor: 1;
    --_anim-speed: 0.25s;
  }

  /* ----------------------------
   * part: nav
   */

  [data-part='nav'] {
    height: 100%;
  }

  /* ----------------------------
   * part: l1-wrapper
   */

  [data-part='level'][data-level='0'] {
    position: fixed;
    background: var(--_bg-color);
  }

  [data-part='l1-invoker'] {
    padding: var(--size-2);
  }

  [data-part='level'][data-level='1'] {
    height: 100%;
    width: var(--_width);
    position: fixed;
  }

  [data-part='level']:not([data-level='0']) {
    left: 0;
    top: 0;
    background-color: var(--_bg-color);
    width: var(--_width);
    height: 100%;
  }

  [data-part='list'] {
    list-style-type: none;
    margin: 0;
    padding: 0;
  }

  [data-part='listitem'] {
    display: block;
    padding: var(--size-6);
  }

  [data-part='anchor'],
  [data-part='invoker-for-level'],
  [data-part='level-back-btn'] {
    display: flex;
    flex-direction: row;
    align-items: center;
    color: inherit;
    text-decoration: inherit;
    font-size: 0.875rem;
    fill: #666666;
    gap: var(--size-2);
  }

  [data-part='anchor']:hover,
  [data-part='invoker-for-level']:hover,
  [data-part='level-back-btn']:hover {
    text-decoration: underline;
    text-underline-offset: 0.3em;
  }

  [data-part='level-back-btn'] {
    display: flex;
    padding: var(--size-6);
    font-size: 0.875rem;
    width: 100%;
  }

  [data-part='icon'] {
    display: block;
    width: var(--size-5);
    height: var(--size-5);
  }

  [data-part='logo'] {
    display: none;
  }
`;_.provideDesign({styles:()=>[M,B,C,P,f`
      :host([data-layout-cloak]) {
        visibility: hidden;
      }

      [data-part='root'] {
        color: var(--text-secondary);
      }

      [data-part='icon'] {
        width: 1.25rem;
        height: 1.25rem;
        display: block;
      }

      [data-part='icon'] svg {
        width: 100%;
        height: 100%;
        /* fill: currentColor; */
        stroke: currentColor;
      }

      [data-part='command-invoker']:hover,
      [data-part='level-invoker']:hover,
      [data-part='anchor']:hover {
        color: var(--secondary-text);
        text-decoration: none;
      }

      [data-part='anchor'][data-level='1'][aria-current='page'] {
        color: var(--highlight-color);
        font-weight: 500;
      }

      [data-part='anchor'][data-level='1'][aria-current='page']:hover {
        color: var(--highlight-color);
      }

      [data-part='icon'][data-level='1'] + span {
        clip: rect(0 0 0 0);
        clip-path: inset(50%);
        height: 1px;
        overflow: hidden;
        position: absolute;
        white-space: nowrap;
        width: 1px;
      }

      [data-part='command-invoker'],
      [data-part='level-invoker'],
      [data-part='anchor'] {
        color: var(--text-secondary);
        text-decoration: none;
        font-size: 1rem;
      }

      [data-part='command-invoker'][data-level='1'],
      [data-part='level-invoker'][data-level='1'],
      [data-part='anchor'][data-level='1'] {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem;
        color: var(--text-secondary);
        font-size: 0.9rem;
        font-weight: 400;
        border-radius: 0;
        margin: 0;
        white-space: nowrap;
        height: auto;
        border: none;
        background: transparent;
        cursor: pointer;
        transition: color 0.2s ease;
        box-sizing: border-box;
        line-height: 1.5;
        text-transform: capitalize;
      }

      [data-part='list'] {
        list-style: none;
        display: flex;
        gap: 2rem;
        margin: 0;
      }
    `],dynamicLayouts:()=>({mobile:{styles:[f`
          [data-part='list'] {
            flex-direction: column;
          }

          [data-level][data-open] {
            background-color: black;
            position: fixed;
            height: 100vh;
            padding: 4rem;
          }
        `],breakpoint:"0px",container:globalThis,templateContextProcessor:o=>{const t={...o.data.navData,hideToggle:!1,shouldHandleScrollLock:!0};return o.fns.updateNavData(t,{shouldReset:!0}),o.fns.closeMenu({shouldPreventAnimations:!0}),{...o,data:{...o.data,navData:t}}}},desktop:{styles:[f`
          [data-part='root'] {
            color: var(--text-secondary);
          }

          [data-part='level'][data-level='1'] {
            display: flex;
          }

          [data-part='list'] {
            list-style: none;
            display: flex;
            gap: 2rem;
            margin: 0;
          }

          :host([variant='l1-blog']) [data-part='command-invoker'],
          :host([variant='l1-blog']) [data-part='level-invoker'],
          :host([variant='l1-blog']) [data-part='anchor'] {
            color: white;
          }

          [data-part='anchor'][aria-current='page'] {
            color: var(--highlight-color);
          }
        `],breakpoint:"1024px",container:globalThis,templateContextProcessor:o=>({...o,data:{...o.data,navData:{...o.data.navData,hideToggle:!0,shouldHandleScrollLock:!1}}})}})});const et=_.tagName;customElements.define(et,_);export{_ as UIMainNav,et as tagName};
