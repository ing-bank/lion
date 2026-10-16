import{i as I,r as w,a as y,y as R}from"./lit-element.jD9bOQKo.js";import{x as u,E as k}from"./lit-html.DtZEZPQ5.js";import{f as O}from"./async-directive.D1sG2PVh.js";import{d as D}from"./dedupeMixin.6XPTJgK8.js";import{v as C,a as T,s as B,r as M}from"./styles.DJ5TZieB.js";import{b as H}from"./browserDetection.Q_TJsMHE.js";class F extends O{render(){throw new Error("Method not implemented.")}host;#t=!1;parts={root:{optional:!1,role:"presentation"}};setupFunctions={};updateFunctions={};update(t,[e,a,r]){if(!Object.keys(this.parts).includes(a))throw new Error(`[UIPartDirective setup] Unknown part ${a}`);this.host=t.options?.host,this.#t||(t.element.setAttribute("data-part",a),e.registerRef(a,t.element),this.setupFunctions[a]&&this.setupFunctions[a](t,{context:e,localContext:r}),this.#t=!0),this.updateFunctions[a]?.(t,{context:e,localContext:r})}}function N(s,t){return(e,a)=>({_$litDirective$:s,values:[t,e,a]})}const z=globalThis.ShadowRoot&&(globalThis.ShadyCSS===void 0||globalThis.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype;function x(s,t){if(z&&s.adoptedStyleSheets)s.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const e of t){const a=document.createElement("style"),r=globalThis.litNonce;r!==void 0&&a.setAttribute("nonce",r),a.textContent=e.cssText,s.appendChild(a)}}class j{host;registry;supportsScopedRegistry=!1;constructor({host:t,scopedElements:e}){if((this.host=t).addController(this),!(e&&Object.keys(e).length))return;if(!this.supportsScopedRegistry){const i=(c,p)=>c!==p;for(const[c,p]of Object.entries(e)){const l=customElements.get(c);if(!l)customElements.define(c,p);else if(i(l,p))throw new Error([`Trying to register multiple classes under name "${c}".`,"Load scoped-custom-element-registry polyfill: https://www.npmjs.com/package/@webcomponents/scoped-custom-element-registry"].join(`
`))}return}this.registry=new CustomElementRegistry;for(const[i,c]of Object.entries(e))this.registry.define(i,c);const r=t.constructor,o=r.prototype.attachShadow;if(r.prototype.attachShadow=function(...i){return o.call(this,{...i[0],customElements:this.registry,registry:this.registry},...i.slice(1))},!(t instanceof R))return;const n=r.prototype.createRenderRoot;r.prototype.createRenderRoot=function(...i){n.call(this,...i);const{shadowRootOptions:c,elementStyles:p}=this.constructor,l=this.shadowRoot||this.attachShadow(c);return this.renderOptions.creationScope=l,x(l,p),this.renderOptions.renderBefore??=l.firstChild,l}}}function _(s){return Number(s.replace(/[^-\d.]/g,""))}class U{host;container;resizeObserver;dynamicLayouts;currentLayout;onLayoutChange;constructor({host:t,dynamicLayouts:e,onLayoutChange:a}){(this.host=t).addController(this),!(!e||!Object.keys(e).length)&&(this.dynamicLayouts=e,this.onLayoutChange=a,this.host.setAttribute("data-layout-cloak",""))}hostConnected(){this.dynamicLayouts&&(this.container=document.body,this.resizeObserver=new ResizeObserver(t=>{this.setNewLayout({newWidth:t[0].contentBoxSize[0].inlineSize}),this.host.removeAttribute("data-layout-cloak")}),this.resizeObserver?.observe(this.container))}hostDisconnected(){this.resizeObserver?.unobserve(this.container)}#t(){return Object.entries(this.dynamicLayouts).sort(([,t],[,e])=>_(e.breakpoint)-_(t.breakpoint))}setNewLayout({newWidth:t}){const a=this.#t().find(r=>t>=_(r[1].breakpoint))?.[0];a!==this.currentLayout&&(this.host.setAttribute("data-layout",a),this.currentLayout=a,this.onLayoutChange?.(this.dynamicLayouts[a]))}}const V=s=>class extends s{labels=[];static styles=[];static lightStyles=[];static templates={};static templateContextProcessor;templates=this.constructor.templates;scopedElements=this.constructor.scopedElements;dynamicLayouts=this.constructor.dynamicLayouts;templateContextProcessor=this.constructor.templateContextProcessor;dynamicLayoutCtrl;scopedRegistryCtrl;#t={};refs={};static contextStore=new WeakMap;static _instances=[];static _partDirective;static properties={_rerenderToggle:{type:Boolean,state:!0,attribute:!1}};get templateContext(){return{templates:this.templates,data:{},set:(e,a)=>{e in this.templateContext.data&&(this[e]=a,this.requestUpdate(e))},registerRef:(e,a,{isPartOfCollection:r=!1}={})=>{r?(this.refs[e]=this.refs[e]||[],this.refs[e].push(a)):this.refs[e]=a,this.#t[e]?.forEach(o=>o(a))},onRegisterRef:(e,a)=>{this.refs[e]?a(this.refs[e]):(this.#t[e]=this.#t[e]||[],this.#t[e].push(a))},refs:this.refs}}constructor(){super(),this.dynamicLayoutCtrl=new U({host:this,dynamicLayouts:this.constructor.dynamicLayouts,onLayoutChange:()=>{this._forceRerender()}}),this.scopedRegistryCtrl=new j({host:this,scopedElements:this.scopedElements}),this.constructor._instances.push(this)}static _extractDataFromProvider(e){const a=[],r=[];let o,n,i;e.styles&&a.push(...e.styles(this.styles)),e.lightStyles&&r.push(...e.lightStyles(this.lightStyles));const{templateContextProcessor:c}=e;if(e.templates&&(o=e.templates(this.templates)),e.scopedElements&&(n=e.scopedElements(this.scopedElements)),e.dynamicLayouts){i=e.dynamicLayouts(this.dynamicLayouts);const p=Object.entries(i);for(let l=0;l<p.length;l+=1){const[f,{styles:d,breakpoint:h,container:m,templateContextProcessor:at}]=p[l],[rt,S]=p[l+1]||[],$=m===globalThis?"media":"container";for(const P of d||[])a.push(y`
              @${w($)} (${w(h)} <= width ${w(S?.breakpoint?`<= ${S?.breakpoint}`:"")}) {
                ${P}
              }
            `)}}return{templateContextProcessor:c,lightStylesFromProvider:r,stylesFromProvider:a,scopedElements:n,dynamicLayouts:i,templates:o}}static _initInstanceDesign(e,a,r){e.shadowRoot?.querySelectorAll("style").forEach(o=>o.remove()),x(e.shadowRoot,a),r&&x(e,r),e._forceRerender()}static provideDesign(e){const a=this,{templateContextProcessor:r,lightStylesFromProvider:o,stylesFromProvider:n,scopedElements:i,dynamicLayouts:c,templates:p}=a._extractDataFromProvider(e);a.templates=p||a.templates,Object.defineProperty(a,"scopedElements",{value:i||a.scopedElements}),a.templateContextProcessor=r,a.dynamicLayouts=c,a.elementStyles=a.finalizeStyles([...n]),Object.defineProperty(a,"styles",{value:a.elementStyles});for(const l of Array.from(a._instances))a._initInstanceDesign(l,a.elementStyles,o)}_partDirective;provideDesign(e){const a=this.constructor,{templateContextProcessor:r,lightStylesFromProvider:o,stylesFromProvider:n,scopedElements:i,dynamicLayouts:c,templates:p}=a._extractDataFromProvider(e);this.templates=p||this.templates,this.scopedElements=i||this.scopedElements,this.templateContextProcessor=r,this.dynamicLayouts=c;const l=a.finalizeStyles([...a.styles,...n]);a._initInstanceDesign(this,l,o)}_forceRerender(){this._rerenderToggle=!this._rerenderToggle}render(){const{templates:e}=this;let{templateContext:a}=this;const{currentLayout:r}=this.dynamicLayoutCtrl;this.templateContextProcessor&&(a=this.templateContextProcessor(a)),this.constructor.dynamicLayouts?.[r]?.templateContextProcessor&&(a=this.dynamicLayouts[r]?.templateContextProcessor(a));const o=this._partDirective||this.constructor._partDirective;return o&&(a.part=N(o,a)),e?.root?e.root(a):new Error("[UIBaseElement] Provide a root render function")}#e=!1;onSetup(){}onTeardown(){}connectedCallback(){super.connectedCallback(),this.updateComplete.then(()=>{this.#e||(this.onSetup(),this.#e=!0,this.#a())})}#a(){window.setTimeout(()=>{if(!this.shadowRoot?.adoptedStyleSheets?.length)return;const a=this.shadowRoot?.querySelector("style"),r=Array.from(this.shadowRoot?.childNodes||[]),o=r.indexOf(a);(o!==-1?r.slice(o+1):[]).forEach(i=>i.remove())})}async disconnectedCallback(){super.disconnectedCallback(),await this.#r()&&(this.onTeardown(),this.#e=!1)}async#r(){return await this.updateComplete,!this.isConnected}exposedPrivateMembers={}},W=D(V);class q extends W(I){}function E(s,{activePath:t,activeItem:e,shouldReset:a=!1}={}){const r=new WeakMap;let o=a,n=!t&&!e,i=null,c=null;const p=(f,{action:d})=>{const h=r.get(f);if(h){if(d==="activate")h.hasActiveChild=!0;else if(d==="reset"){if(delete h.hasActiveChild,i===h)return}else throw new Error(`[UIMainNav]: Unknown action ${d}`);p(h,{action:d})}},l=f=>{for(const d of f.items){if(r.set(d,c),o&&d.active&&(delete d.active,p(d,{action:"reset"}),o=!1),(t&&d.url===t||e&&d===e)&&(d.active=!0,p(d,{action:"activate"}),n=!0,i=d),n&&!o)break;d.nextLevel&&(c=d,l(d.nextLevel))}};l(s)}class A{constructor(t){this.el=t,this._listeners=[],this._attrs=new Set}setAttribute(...t){this._attrs.add(t),this.el.setAttribute(...t)}toggleAttribute(...t){!!t[1]?this.setAttribute(t[0],""):this.removeAttribute(t[0])}removeAttribute(t){this._attrs.delete(t),this.el.removeAttribute?.(t)}addEventListener(...t){this._listeners.push(t),this.el.addEventListener(...t)}reset(){for(const t of Array.from(this._attrs))this.el.removeAttribute(t[0]);for(const t of this._listeners)this.el.removeEventListener(...t)}}function K(){return Object.prototype.hasOwnProperty.call(HTMLElement.prototype,"popover")}function Z(s){return s.disabled||s.hasAttribute?.("disabled")||s.hasAttribute?.("aria-disabled")}class b{host;level;invoker;target;open=!1;visuallyHidden=!1;usesPopover=!1;_rInvoker;_rTarget;static _hasScrollLockStyles=!1;static handleScrollLock({isOpen:t}){const{isIOS:e,isMacSafari:a}=H;document.body.toggleAttribute("data-scroll-lock",t),(e||a)&&document.body.toggleAttribute("data-scroll-lock-ios-fix",t),e&&document.documentElement.toggleAttribute("data-scroll-lock-ios-fix",t)}constructor(t,e){(this.host=t).addController(this);const{invoker:a,target:r,level:o,initialOpen:n,visuallyHidden:i,mode:c,omitStyleDependecyCheck:p,shouldHandleScrollLock:l}=e;if(!a)throw new Error("[VisibilityToggleCtrl]: Missing invoker");if(!r)throw new Error("[VisibilityToggleCtrl]: Missing target");if(p&&!this.host.constructor.elementStyles.includes(C))throw new Error("[VisibilityToggleCtrl]: Missing `visibilityStyle` that provides [hidden] and [data-visually-hidden] rules");if(!this._hasScrollLockStyles){const h=document.createElement("style");h.setAttribute("data-scroll-lock-styles",""),h.textContent=T.cssText,document.head.appendChild(h),this._hasScrollLockStyles=!0}this.level=o,this.invoker=a,this.target=r,this._rInvoker=new A(a),this._rTarget=new A(r),this.shouldHandleScrollLock=l;const f=t.shadowRoot||r.getRootNode?.();this.visuallyHidden=i,this.usesPopover=K()&&c==="popover";const d=this.target?.getAttribute?.("id")||Math.random().toString(36).substr(2,9);this.usesPopover&&(this._rInvoker.setAttribute("popovertarget",d),this._rTarget.setAttribute("popover",""),this._rTarget.setAttribute("id",d),this._rTarget.addEventListener?.("beforetoggle",h=>{this.__wasInternalPopoverSync||h.target===this.target&&h.newState==="open"&&this._set({open:!0,syncsFromPopover:!0})}),this._rTarget.addEventListener?.("toggle",h=>{this.__wasInternalPopoverSync||h.target===this.target&&h.newState!=="open"&&this._set({open:!1,syncsFromPopover:!0})})),this._rInvoker.setAttribute("aria-controls",d),this.usesPopover||this._rInvoker.addEventListener?.("click",h=>{h.button===0&&this._set({open:"toggle"})}),this._set({open:!!n,isInitialRender:!0}),this.visuallyHidden&&(this._rTarget.addEventListener?.("focusin",async()=>{await this.host.updateComplete,!(this.__wasInternalPopoverSync||!this.visuallyHidden||this.open)&&this._set({open:!0})}),this._rTarget.addEventListener?.("focusout",async h=>{await this.host.updateComplete,!(this.__wasInternalPopoverSync||r.contains(f.activeElement)||r.contains(h.relatedTarget))&&this._set({open:!1})}))}async _set({open:t,isInitialRender:e=!1,syncsFromPopover:a=!1}){if(Z(this.invoker)||!e&&t===this.open)return;const{usesPopover:r,visuallyHidden:o}=this;if(this.open=!!(t==="toggle"?!this.open:t),this._rTarget.toggleAttribute?.("data-open",this.open),r?a||(this.__wasInternalPopoverSync=!0,this.open?this.target.showPopover?.():this.target.hidePopover?.(),this.__wasInternalPopoverSync=!1):this._rInvoker.setAttribute("aria-expanded",`${this.open}`),!e)try{await Promise.all(this.target.getAnimations().map(n=>n.finished))}catch(n){console.warn(n)}this._rTarget.toggleAttribute?.(o?"data-visually-hidden":"hidden",!this.open),this.shouldHandleScrollLock&&this.constructor.handleScrollLock({isOpen:this.open})}toggle(){this._set({open:"toggle"})}show(){this._set({open:!0})}hide(){this._set({open:!1})}teardown(){this._rInvoker.reset(),this._rTarget.reset(),this.host.removeController(this)}}function G(s,t){let e=t;for(;e;){if(e.constructor.name===s)return!0;e=Object.getPrototypeOf(e)}return!1}function X(s){if(!(s.tagName==="NAV"||s.getAttribute("role")==="navigation"))throw new Error('Please apply to HTMLNavElement (`<nav>`) | `[role="navigation"]`')}function J(s){if(!(s.tagName==="UL"||s.tagName==="OL"))throw new Error("Please apply to HTMLUListElement (`<ul>`) | HTMLOListElement (`<ol>`)");if(s.getAttribute("role")!=="list")throw new Error('Please apply to [role="list"]. See https://www.scottohara.me/blog/2019/01/12/lists-and-safari.html')}function Q(s){if(s.tagName!=="LI")throw new Error("Please apply to HTMLLIElement (`<li>`)")}function Y(s){if(s.tagName!=="A")throw new Error("Please apply to HTMLAnchorElement (`<a>`)")}function g(s){if(!(s.tagName==="BUTTON"||G("LionButton",s)||s.getAttribute("role")==="button"))throw new Error("Please apply to HTMLButtonElement (`<button>`) | LionButton | `[role=button]`")}const tt={"lion:portal:search":u`
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
      viewBox="-1.5 -1.5 27 27"
      data-filled="true"
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
  </svg>`};class v extends F{parts={root:{role:"presentation"},nav:{role:"nav",description:"Main navigation landmark for the page. All navigation items are inside"},"l1-invoker":{role:"button",optional:!0,description:"Button (usually hamburger icon) that is responsible for toggling l1 nav. Common on mobile layouts"},level:{role:"presentation",description:"This marks the difference between different navigation levels (l1, l2, l3 etc.). Commonly bound to disclosure patterns like collapsibles, dropdowns and fly-outs"},"level-back-btn":{role:"button",optional:!0,description:"In mobile fly-out menus, this is used to go back to the previous level"},list:{role:"list",description:"Necessary semantics for screen readers. Each level contains at least 1 list"},listitem:{role:"listitem",description:"Neccessary semantics. A list item wraps a an anchor, command-invoker or, level-invoker"},anchor:{role:"link",description:"Most navigation items are anchors with an href. Up to the app to handle them in a SPA or MPA."},"level-invoker":{role:"button",description:""},"command-invoker":{role:"button",description:"Sends an event up, that can be handlded by the parent. For instance, a search modal that is opened",optional:!0},icon:{name:"icon",role:"img",optional:!0}};setupFunctions={nav:({element:t})=>{X(t)},"l1-invoker":({element:t,options:e},{context:a,localContext:r})=>{g(t),t.setAttribute("aria-label",a.translations.l1Invoker)},level:({element:t,options:e},{context:a,localContext:r})=>{const{level:o,isToggleTarget:n,levelConfig:i}=r;v.setLevel(t,o);const c=i?.key?`level-${o}-${i.key}`:`level-${o}`;t.setAttribute("id",c),a.registerRef(c,t);const{showVia:p="disclosure",initialOpen:l,visuallyHidden:f=!1}=i||{},d=o===1?"l1-invoker":`level-invoker-l${o}${i?.key?`-${i.key}`:""}`;if(!n||i?.hideToggle)return;const h=m=>{if(m){if(o===1){new b(e?.host,{visuallyHidden:!1,initialOpen:!1,target:t,mode:"popover",invoker:m,level:1});return}new b(e?.host,{target:t,visuallyHidden:f,mode:p,initialOpen:l,invoker:m,level:o})}};a.refs[d]?h(a.refs[d]):a.onRegisterRef(d,h)},"level-back-btn":({element:t},{context:e,localContext:a})=>{g(t),v.setLevel(t,a.level),t.setAttribute("type","button"),t.addEventListener("click",({})=>{t.parentElement?.hidePopover()}),e.registerRef(`level-back-btn-l${a.level}`,t)},list:({element:t},{context:e,localContext:a})=>{t.setAttribute("role","list"),J(t),v.setLevel(t,a.level),e.registerRef(`list-${a.level}`,t)},listitem:({element:t},{context:e,localContext:a})=>{Q(t),t.setAttribute("data-part","listitem"),v.setLevel(t,a.level),e.registerRef(`listitem-l${a.level}`,t,{isPartOfCollection:!0})},anchor:({element:t},{context:e,localContext:a})=>{v.setLevel(t,a.level),Y(t),t.setAttribute("data-part","anchor"),a.item?.overview&&t.setAttribute("data-overview",""),t.setAttribute("href",a.item.url),a.item.target&&t.setAttribute("target",a.item.target),a.item.rel&&t.setAttribute("rel",a.item.rel),e.registerRef(`anchor-l${a.level}`,t,{isPartOfCollection:!0}),a.item.active&&t.setAttribute("aria-current","page")},"level-invoker":({element:t},{context:e,localContext:a})=>{g(t),v.setLevel(t,a.level),t.setAttribute("data-part","level-invoker");const r=a.item?.nextLevel?.key,o=r?`-${r}`:"";a.item?.nextLevel?.showVia==="popover"&&t.setAttribute("popovertarget",`level-${a.level+1}${o}`),t.setAttribute("type","button"),a.item?.name&&t.setAttribute("aria-label",`Show ${a.item.name}`),e.registerRef(`level-invoker-l${a.level+1}${o}`,t),t.addEventListener("click",async n=>{n.button===0&&(E(e.data.navData,{activeItem:a.item,shouldReset:!0}),n.stopPropagation())})},"command-invoker":({element:t,options:e},{localContext:a})=>{g(t),v.setLevel(t,a.level),t.addEventListener("click",()=>{e.host.dispatchEvent(new CustomEvent(a.item.command))})},icon:({element:t},{context:e,localContext:a})=>{v.setLevel(t,a.level),t.setAttribute("data-part","icon"),e.registerRef(`icon-l${a.level}`,t)}};updateFunctions={root:(t,e)=>this.constructor._updateRoot(t,e),"l1-invoker":(t,e)=>this.constructor._updateL1Invoker(t,e),listitem:(t,e)=>this.constructor._updateListItem(t,e),icon:(t,e)=>this.constructor._updateIcon(t,e)};static setLevel(t,e){if(typeof e!="number")throw new Error("[UIMainNavPartDirective]: Please provide a level in localContext");t.setAttribute("data-level",e)}static getVisibilityToggleCtrlForInvoker({invoker:t,host:e}){return this.__controllers&&Array.from(this.__controllers)?.find(a=>a.invoker===t)}static _updateRoot({element:t},{context:e}){e.data.hasL1Open?t.setAttribute("data-has-l1-open",""):t.removeAttribute?.("data-has-l1-open")}static _updateL1Invoker({element:t,options:e},{context:a,localContext:r}){if(a.data.navData.hideToggle){t.setAttribute("hidden","");const o=this.getVisibilityToggleCtrlForInvoker({host:e.host,invoker:t});o?o?.teardown():a.onRegisterRef("level-1",n=>{n.removeAttribute?.("hidden"),n.removeAttribute?.("popover"),n.removeAttribute?.("data-visually-hidden")});return}t.removeAttribute?.("hidden"),a.onRegisterRef("level-1",o=>{new b(e.host,{invoker:t,target:o,level:1,mode:"popover",initialOpen:!1,shouldHandleScrollLock:r.levelConfig.shouldHandleScrollLock})})}static _updateListItem({element:t},{localContext:e}){e.item.active&&t.setAttribute("data-active",""),e.item.hasActiveChild&&t.setAttribute("data-has-active-child","")}static _updateIcon({element:t},{localContext:{item:e}}){t.setAttribute("icon-id",(e.active||e.hasActiveChild)&&e.iconActiveId||e.iconId)}}class L extends q{static properties={navData:{type:Array,attribute:"nav-data"}};_partDirective=v;static tagName="ui-main-nav";constructor(){super(),this.navData=[]}get templateContext(){return{...super.templateContext,data:{navData:this.navData,iconIds:tt},translations:{l1Invoker:"Main menu",levelBackBtn:"Back"},fns:{closeMenu:({shouldPreventAnimations:t})=>{t&&this.setAttribute("data-prevent-animations","");const e=Array.from(this.__controllers||[])||[];for(const a of e||[])a instanceof b&&a.hide();t&&this.removeAttribute("data-prevent-animations")},updateNavData:E}}}static templates={root(t){const{data:e,templates:a,part:r}=t;return u`
        <div ${r("root")}>
          <nav ${r("nav")}>
            ${a.navLevel0?.(t,{levelConfig:e.navData})}
            ${a.navLevel(t,{levelConfig:e.navData,level:1,isToggleTarget:!0})}
          </nav>
        </div>
      `},navLevel(t,{levelConfig:e,level:a,isToggleTarget:r,hasActiveChild:o}){const{templates:n,part:i,translations:c}=t,p=r&&a>1&&e?.showVia==="popover";return u`<!-- -->
        <div ${i("level",{levelConfig:e,level:a,isToggleTarget:r,hasActiveChild:o})}>
          ${p?u`<!-- -->
                <button ${i("level-back-btn",{level:a})}>
                  <span data-part="back-chevron" aria-hidden="true"></span>
                  ${c.levelBackBtn}
                </button>`:k}
          <ul ${i("list",{level:a})}>
            ${e.items.map(l=>u`<!-- -->
                  <li ${i("listitem",{item:l,level:a})}>
                    ${n.navItem(t,{item:l,level:a})}
                    ${l.nextLevel?n.navLevel(t,{hasActiveChild:l.hasActiveChild,levelConfig:l.nextLevel,isToggleTarget:!0,level:a+1}):k}
                  </li>`)}
          </ul>
        </div>`},navItem(t,{item:e,level:a}){const{part:r,templates:o}=t;return e.url&&e.nextLevel?u`<!-- -->
          <a ${r("anchor",{item:e,level:a})}>
            ${o.icon(t,{item:e,level:a})}<span>${e.name}</span>
          </a>
          <button ${r("level-invoker",{item:e,level:a})}></button>`:e.url?u`<!-- -->
          <a ${r("anchor",{item:e,level:a})}>
            ${o.icon(t,{item:e,level:a})}<span>${e.name}</span>
          </a>`:e.nextLevel?u`<!-- -->
          <button ${r("level-invoker",{item:e,level:a})}>
            ${o.icon(t,{item:e,level:a})}<span>${e.name}</span>
          </button>`:u`<!-- -->
        <button ${r("command-invoker",{item:e,level:a})}>
          ${o.icon(t,{item:e,level:a})}<span>${e.name}</span>
        </button>`},navLevel0(t,{levelConfig:e}){const{data:a,part:r,templates:o}=t;return u`<!-- -->
        <div ${r("level",{level:0})}>
          <div data-part="l0-before"><slot name="l0-before"></slot></div>
          <button ${r("l1-invoker",{levelConfig:e})}>
            ${o.icon(t,{level:0,item:{iconId:"lion:portal:l1Invoker"}})}
          </button>
          <div data-part="l0-after"><slot name="l0-after"></slot></div>
        </div>`},icon(t,{item:e,level:a}){const r=t.data.iconIds[e.iconId];return r?u`<span data-part="icon" data-level="${a}">${r}</span>`:k}}}L.provideDesign({styles:()=>[B,M,C,T,y`
      :host([data-layout-cloak]) {
        visibility: hidden;
      }

      [data-part='root'] {
        color: var(--text-secondary);
      }

      /*
       * The burger is the mobile counterpart of the theme switch labels: the same 32px box, the same
       * circle and the same hover treatment, so the two controls read as one group on the right of
       * the bar instead of a small icon pressed against the switch. Measured before: the burger box
       * was 20x26 and its left edge sat exactly on the switch's right edge (0px apart).
       */
      [data-part='l1-invoker'] {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        /* border-box: the global reset in styles.css does not reach into the shadow root, so without
         * this the 1px border made the burger 34px against the switch labels' 32px. */
        box-sizing: border-box;
        width: 2rem;
        height: 2rem;
        padding: 0;
        border: 1px solid transparent;
        border-radius: 50%;
        background: transparent;
        color: var(--text-secondary);
        cursor: pointer;
        transition:
          color 0.2s,
          background-color 0.2s;
      }

      [data-part='l1-invoker']:hover {
        color: var(--text-primary);
        background: var(--overlay-subtle);
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

      /*
       * A filled glyph must not be stroked: the rule above doubles the ink of a solid path, which
       * measured 24 x 23.4 inside the 24 x 24 viewBox - about 17% larger than the stroked icons next
       * to it, so the octocat read as oddly scaled. Its viewBox carries the optical margin instead.
       */
      [data-part='icon'] svg[data-filled] {
        stroke: none;
      }

      [data-part='command-invoker']:hover,
      [data-part='level-invoker']:hover,
      [data-part='anchor']:hover {
        color: var(--secondary-text);
        text-decoration: none;
      }

      [data-part='anchor'][data-level='1'][aria-current='page'],
      [data-part='anchor'][data-level='1'][aria-current='page']:hover {
        /* Outline treatment: the accent cannot be the ink on a light surface, so the current page
         * is marked by a yellow outline around readable text. */
        color: var(--accent-on-surface);
        outline: 2px solid var(--accent-yellow);
        outline-offset: 2px;
        border-radius: 4px;
        font-weight: 500;
      }

      /*
       * The burger is mirrored. Its three lines are drawn 24, 16 and 22 units long, all anchored to
       * the left edge, so the original leans left; flipping it horizontally puts the longest line at
       * the outer edge of the bar.
       */
      [data-part='l1-invoker'] [data-part='icon'] {
        transform: scaleX(-1);
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
    `],dynamicLayouts:()=>({mobile:{styles:[y`
          /* :host {
            --_width: 400px;
            --_bg-color: transparent;
            --_anim-factor: 1;
            --_anim-speed: 0.25s;
            --_anim-delay: 0.05s;
          }

          [data-level='1'][popover]::backdrop {
            background: rgba(0, 0, 0, 0.5);
          }

          @media (prefers-reduced-motion) {
            :host {
              --_anim-factor: 0;
            }
          }

          :host(:not([data-prevent-animations])) [popover]:popover-open {
            @starting-style {
              translate: var(--_width) 0;
              opacity: 0;
            }
          }

          :host(:not([data-prevent-animations])) [popover]:popover-open {
            translate: 0 0;
            opacity: 1;
          }

          :host(:not([data-prevent-animations])) [popover]:popover-open::backdrop {
            opacity: 1;
          }

          :host(:not([data-prevent-animations])) [popover] {
            transition:
              translate calc(var(--_anim-factor) * var(--_anim-speed)) ease-out,
              opacity calc(var(--_anim-factor) * var(--_anim-speed)) ease-out,
              overlay calc(var(--_anim-factor) * var(--_anim-speed)) ease-out allow-discrete,
              display calc(var(--_anim-factor) * var(--_anim-speed)) ease-out allow-discrete;
            transition-delay: calc(var(--_anim-factor) * var(--_anim-delay));
            translate: calc(-1 * var(--_width)) 0;
            opacity: 0;
          }

          :host(:not([data-prevent-animations])) [popover]::backdrop {
            @starting-style {
              opacity: 0;
            }

            transition: opacity calc(var(--_anim-factor) * var(--_anim-speed)) ease-out
              allow-discrete;
            transition-delay: calc(var(--_anim-factor) * var(--_anim-delay));
            opacity: 0;
          }
          */

          /*
           * Spacing: one rhythm for the whole fly-out. The rows are 0.25rem apart, the row itself
           * carries its padding (0.6rem 0.75rem) and bleeds 0.75rem into the panel's own 1.5rem
           * padding, so the label stays on the 24px gutter while a hover or current state covers the
           * full width of the panel instead of only the text.
           */
          [data-part='list'] {
            flex-direction: column;
            /* The UA gives a <ul> padding-inline-start: 40px, which held the fly-out items 40px away
             * from the panel edge (measured: items at x=104 with a 64px panel padding, i.e. the text
             * sat too close to the 283px panel's right edge). */
            padding: 0;
            gap: 0.25rem;
          }

          /*
           * Full bleed, once: the top-level row spans the panel edge to edge, so a hover or current
           * state covers the whole width instead of stopping at the gutter, and its own padding keeps
           * the label on the 24px line.
           *
           * Only level 1 carries the negative margin. A deeper row lives inside a level that is
           * already edge to edge, so bleeding it again added another 24px per level - measured row
           * widths 367, 415 and 463px inside a 320px panel, with the rows starting 24, 48 and 72px
           * left of the panel. Deeper rows bleed nothing and take their indent from their padding.
           */
          [data-part='listitem'] {
            border-radius: 8px;
          }

          [data-part='listitem'][data-level='1'] {
            margin-inline: -1.5rem;
          }

          /*
           * The "overview" entry: the section's own page, which the toggle above it moved down here.
           * It is a label for the level rather than one more item, so it reads like a muted
           * small-caps heading and carries its own space below - the level's items start after it.
           */
          [data-part='anchor'][data-overview] {
            color: var(--text-secondary);
            font-size: 0.78rem;
            font-weight: 600;
            letter-spacing: 0.08em;
            text-transform: uppercase;
          }

          [data-part='listitem']:has(> [data-part='anchor'][data-overview]) {
            margin-bottom: 0.5rem;
            border-bottom: 1px solid var(--border-color);
          }

          /* A collapsed branch that holds the current page: the toggle carries the accent, because the
           * current entry itself is a level down and out of sight. */
          [data-part='listitem'][data-has-active-child] > [data-part='level-invoker'] {
            color: var(--accent-on-surface);
          }

          [data-part='listitem'] > [data-part='anchor'],
          [data-part='listitem'] > [data-part='command-invoker'],
          [data-part='listitem'] > [data-part='level-invoker'] {
            padding: 0.6rem 1.5rem;
            border-radius: 8px;
          }

          /* The selection states are the row's, not the text's: hover, focus and the current page
           * fill the whole width between the panel's gutters. */
          [data-part='listitem']:hover,
          [data-part='listitem']:focus-within {
            background-color: var(--overlay-subtle);
          }

          /*
           * The row that holds the current page: an item with its own page reports it on the anchor
           * (aria-current), a top-level row that is now a toggle carries data-active from the nav data
           * instead.
           */
          [data-part='listitem']:has(> [data-part='anchor'][aria-current='page']),
          [data-part='listitem'][data-active] {
            background-color: color-mix(in srgb, var(--accent-yellow) 16%, transparent);
            box-shadow: inset 3px 0 0 0 var(--accent-yellow);
          }

          [data-part='listitem']:has(> [data-part='anchor'][aria-current='page'])
            > [data-part='anchor'] {
            box-shadow: none;
            outline: none;
            text-decoration: none;
            font-weight: 600;
          }

          /*
           * Fly-out animation: a fade with a small scale, not a slide. The panel is anchored to the
           * left edge, so it settles from 0.97 into place from that edge (transform-origin) instead of
           * travelling sideways - a slide out of an off-screen edge left nothing to see while the
           * backdrop faded, and the reverse read as a jump rather than a recede.
           *
           * Only the entry is animated. Closing has no duration at all (see --_flyout-duration-out),
           * so going back out of the menu is a state change rather than a movement that has to finish
           * first; the two states therefore do not need mirrored transitions.
           */
          :host {
            --_flyout-duration-in: 0.24s;
            /* Deliberately 0s: the panel and its backdrop are gone in the frame the close lands in. */
            --_flyout-duration-out: 0s;
            --_flyout-ease-in: cubic-bezier(0.2, 0, 0.2, 1);
            --_flyout-ease-out: cubic-bezier(0.2, 0, 0.2, 1);
            /* Only the entry moves: coming in the panel settles out of the edge (0.97 -> 1). */
            --_flyout-scale-in: 0.97;
            --_flyout-scale-out: 1;
          }

          @media (prefers-reduced-motion: reduce) {
            :host {
              --_flyout-duration-in: 0.01s;
              --_flyout-scale-in: 1;
              --_flyout-scale-out: 1;
            }
          }

          :host(:not([data-prevent-animations])) [popover] {
            transition:
              opacity var(--_flyout-duration-out) var(--_flyout-ease-out),
              scale var(--_flyout-duration-out) var(--_flyout-ease-out),
              overlay var(--_flyout-duration-out) allow-discrete,
              display var(--_flyout-duration-out) allow-discrete;
            opacity: 0;
            scale: var(--_flyout-scale-out);
          }

          :host(:not([data-prevent-animations])) [popover]:popover-open {
            transition:
              opacity var(--_flyout-duration-in) var(--_flyout-ease-in),
              scale var(--_flyout-duration-in) var(--_flyout-ease-in),
              overlay var(--_flyout-duration-in) allow-discrete,
              display var(--_flyout-duration-in) allow-discrete;
            /* The panel grows out of the edge it is attached to. */
            transform-origin: left center;
            opacity: 1;
            scale: 1;

            @starting-style {
              opacity: 0;
              scale: var(--_flyout-scale-in);
            }
          }

          [popover]::backdrop {
            background: light-dark(rgba(0, 0, 0, 0.28), rgba(0, 0, 0, 0.5));
            opacity: 0;
            transition: opacity var(--_flyout-duration-out) var(--_flyout-ease-out) allow-discrete;

            @starting-style {
              opacity: 0;
            }
          }

          [popover]:popover-open::backdrop {
            opacity: 1;
          }

          [data-level='1'][data-open] {
            /*
             * Was background-color: black — the dark theme's surface spelled as a colour literal:
             * in light mode the fly-out stayed black while its own ink stayed dark, so the panel
             * rendered dark-on-dark (panel colour rgb(0,0,0) on rgb(0,0,0) = 1.00:1, its links
             * rgb(90,90,90) on rgb(0,0,0) = 3.04:1, both below AA).
             */
            background-color: var(--bg-color);
            color: var(--text-primary);
            border-right: 1px solid var(--border-color);
            position: fixed;
            height: 100vh;
            /* A drawer reads better at a fixed share of the viewport, capped so it does not swallow a
             * tablet screen. Was content-sized (163px), then min-width 15rem, then min(20rem, 88vw). */
            width: min(22rem, 90vw);
            padding: 2rem 1.5rem;
            overflow-y: auto;
          }

          /*
           * Levels deeper than the first unfold *downward*, in place: no extra panel, no scroll
           * jump, no covering the parent. Level 0 (the hamburger's own wrapper) and level 1 (the
           * fly-out) must stay out of this: level 0 is not a panel and went invisible (opacity 0)
           * when these rules caught it. Closed, a level carries the hidden attribute, so the
           * opening is a
           * grid-rows transition from 0fr, which is the one way to animate to an unknown height.
           *
           * Only the unfolding is animated. Collapsing runs on --_flyout-duration-out (0s, see the
           * fly-out above), so going back with the back-chevron folds the level away in the frame it
           * is clicked: a transition is read from the state an element moves *into*, which is why the
           * entry duration lives on the [data-open] rule below.
           */
          [data-part='level']:not([data-level='0']):not([data-level='1']) {
            display: grid;
            grid-template-rows: 0fr;
            position: static;
            width: auto;
            height: auto;
            padding: 0;
            border: none;
            background: none;
            overflow: hidden;
            opacity: 0;
            transition:
              grid-template-rows var(--_flyout-duration-out) var(--_flyout-ease-out),
              opacity var(--_flyout-duration-out) var(--_flyout-ease-out),
              display var(--_flyout-duration-out) var(--_flyout-ease-out) allow-discrete;
          }

          [data-part='level']:not([data-level='0']):not([data-level='1'])[data-open] {
            grid-template-rows: 1fr;
            opacity: 1;
            transition:
              grid-template-rows var(--_flyout-duration-in) var(--_flyout-ease-in),
              opacity var(--_flyout-duration-in) var(--_flyout-ease-in),
              display var(--_flyout-duration-in) var(--_flyout-ease-in) allow-discrete;

            @starting-style {
              grid-template-rows: 0fr;
              opacity: 0;
            }
          }

          /* The grid row needs to be allowed to be shorter than its content. */
          [data-part='level']:not([data-level='0']):not([data-level='1']) > [data-part='list'] {
            min-height: 0;
          }

          /*
           * Levels inside a level. The indent is *not* a padding on the nested list: the rows bleed
           * the panel's 1.5rem padding to be full width (see [data-part='listitem'] below), so
           * padding the list made every level's rows 1.25rem wider than the one above it - measured
           * 347, 375 and 403px inside a 320px panel, i.e. the deepest labels ran out of the panel.
           *
           * The list stays flush and the indent is added to the row's own padding per depth, so a
           * deeper label starts further in while every row keeps the panel's width.
           */
          [data-part='list'] [data-part='list'] {
            padding-left: 0;
            margin-top: 0.25rem;
            gap: 0.15rem;
          }

          [data-part='listitem'][data-level='2'] > [data-part='anchor'],
          [data-part='listitem'][data-level='2'] > [data-part='command-invoker'],
          [data-part='listitem'][data-level='2'] > [data-part='level-invoker'] {
            padding-left: 2.75rem;
          }

          [data-part='listitem'][data-level='3'] > [data-part='anchor'],
          [data-part='listitem'][data-level='3'] > [data-part='command-invoker'],
          [data-part='listitem'][data-level='3'] > [data-part='level-invoker'] {
            padding-left: 4rem;
          }

          [data-part='listitem'][data-level='4'] > [data-part='anchor'],
          [data-part='listitem'][data-level='4'] > [data-part='command-invoker'],
          [data-part='listitem'][data-level='4'] > [data-part='level-invoker'] {
            padding-left: 5.25rem;
          }

          [data-part='level-invoker'] {
            justify-content: flex-start;
            width: auto;
            flex: 0 0 auto;
          }

          /*
           * A row: the label (anchor or toggle button) takes the line, the expander chevron sits at
           * the end of it. Without this the empty chevron button wrapped onto its own line under
           * every item that has children.
           */
          [data-part='listitem'] {
            display: flex;
            align-items: center;
            flex-wrap: wrap;
            gap: 0.25rem;
          }

          /* The nested level takes its own line, full width: without this it sits in the same flex
           * row as the label and squeezes the chevron away from the right edge. */
          [data-part='level']:not([data-level='0']):not([data-level='1']) {
            flex: 1 0 100%;
          }

          [data-part='listitem'] > [data-part='anchor'],
          [data-part='listitem'] > [data-part='command-invoker'],
          [data-part='listitem'] > [data-part='level-invoker'] {
            flex: 0 1 auto;
          }

          [data-part='listitem'] > [data-part='anchor'] {
            flex: 1 1 auto;
          }

          /* An item that is only a toggle (a folder without its own page) keeps the whole line. */
          [data-part='listitem']:not(:has(> [data-part='anchor'])) > [data-part='level-invoker'],
          [data-part='listitem']:not(:has(> [data-part='anchor'])) > [data-part='command-invoker'] {
            flex: 1 1 auto;
          }

          [data-part='level-invoker']::after {
            content: '';
            width: 0.45rem;
            height: 0.45rem;
            margin-left: auto;
            border-right: 1.5px solid currentColor;
            border-bottom: 1.5px solid currentColor;
            transform: rotate(-45deg);
            transition: transform var(--_flyout-duration-in) var(--_flyout-ease-in);
          }

          [data-part='listitem']:has(> [data-part='level'][data-open])
            [data-part='level-invoker']::after {
            transform: rotate(45deg);
          }

          /* The back chevron is drawn here (the portal iconset has no chevronLeft, so the button
           * used to render an empty icon slot next to its label). */
          [data-part='back-chevron'] {
            width: 0.45rem;
            height: 0.45rem;
            border-left: 1.5px solid currentColor;
            border-bottom: 1.5px solid currentColor;
            transform: rotate(45deg);
          }

          [data-part='level-back-btn'] {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            margin-bottom: 1rem;
            padding: 0.5rem 0;
            border: none;
            background: transparent;
            color: var(--text-secondary);
            font: inherit;
            cursor: pointer;
            text-transform: capitalize;
          }

          [data-part='level-back-btn']:hover {
            color: var(--text-primary);
          }
        `],breakpoint:"0px",container:globalThis,templateContextProcessor:s=>{const t={...s.data.navData,hideToggle:!1,shouldHandleScrollLock:!0};return s.fns.updateNavData(t,{shouldReset:!0}),s.fns.closeMenu({shouldPreventAnimations:!0}),{...s,data:{...s.data,navData:t}}}},desktop:{styles:[y`
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

          [data-part='anchor'][aria-current='page'] {
            color: var(--accent-on-surface);
            text-decoration: underline;
            text-decoration-color: var(--accent-yellow);
            text-decoration-thickness: 2px;
            text-underline-offset: 3px;
          }
        `],breakpoint:"1024px",container:globalThis,templateContextProcessor:s=>{const t=e=>e.map(({nextLevel:a,...r})=>{const[o]=a?.items??[];return o?.overview&&o.url?{...r,url:o.url}:r});return{...s,data:{...s.data,navData:{...s.data.navData,items:t(s.data.navData.items),hideToggle:!0,shouldHandleScrollLock:!1}}}}}})});const et=L.tagName;customElements.define(et,L);export{L as UIMainNav,et as tagName};
