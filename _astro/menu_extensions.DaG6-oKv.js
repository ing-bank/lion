const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["_astro/define.BdbiuFq9.js","_astro/MdJsPreview.3BOxlSHn.js","_astro/lit-element.jD9bOQKo.js","_astro/lit-html.DtZEZPQ5.js","_astro/lit-element.BdYmZD4s.js","_astro/define.DNIVKtom.js"])))=>i.map(i=>d[i]);
import{_ as c}from"./preload-helper.CVfkMyKi.js";import{S as h,i as u,a as p}from"./lit-element.jD9bOQKo.js";import{x as i,E as g}from"./lit-html.DtZEZPQ5.js";import{S as f}from"./lit-element.BdYmZD4s.js";import{d as y}from"./dedupeMixin.6XPTJgK8.js";import{L as k}from"./LionMenu.CFMCOcAt.js";function r(){return!!(globalThis.ShadowRoot?.prototype.createElement&&globalThis.ShadowRoot?.prototype.importNode)}const b=a=>class extends f(a){constructor(){super()}createScopedElement(t){return(r()?this.shadowRoot:document).createElement(t)}defineScopedElement(t,n){const{registry:s}=this,l=s.get(t),o=l&&l!==n;return!r()&&o&&console.error([`You are trying to re-register the "${t}" custom element with a different class via ScopedElementsMixin.`,"This is only possible with a CustomElementRegistry.","Your browser does not support this feature so you will need to load a polyfill for it.",'Load "@webcomponents/scoped-custom-element-registry" before you register ANY web component to the global customElements registry.','e.g. add "<script src="/node_modules/@webcomponents/scoped-custom-element-registry/scoped-custom-element-registry.min.js"><\/script>" as your first script tag.',"For more details you can visit https://open-wc.org/docs/development/scoped-elements/"].join(`
`)),l?s.get(t):s.define(t,n)}attachShadow(t){const{scopedElements:n}=this.constructor;if(!this.registry||this.registry===this.constructor.__registry&&!Object.prototype.hasOwnProperty.call(this.constructor,"__registry")){this.registry=r()?new CustomElementRegistry:customElements;for(const[l,o]of Object.entries(n??{}))this.defineScopedElement(l,o)}return Element.prototype.attachShadow.call(this,{...t,customElements:this.registry,registry:this.registry})}createRenderRoot(){const{shadowRootOptions:t,elementStyles:n}=this.constructor,s=this.attachShadow(t);return r()&&(this.renderOptions.creationScope=s),s instanceof ShadowRoot&&(h(s,n),this.renderOptions.renderBefore=this.renderOptions.renderBefore||s.firstChild),s}},v=y(b);class S extends v(u){static get properties(){return{responsiveMode:{type:String,reflect:!0,attribute:"responsive-mode"},menuItems:{type:Array},menuSupportItems:{type:Array},ctaPrimary:{type:Object},ctaSecondary:{type:Object},suggestions:{type:Array},showOnMobile:{type:Array,attribute:"show-on-mobile",reflect:!0},_levelCfg:{state:!0}}}static get scopedElements(){return{"lion-menu":k}}static get styles(){return[p`
        /** specific styles */

        :host([responsive-mode='desktop']) [data-has-full-width-flyout] > [slot='list'] {
          /** make sure that we give the right styles */
          position: relative;
        }

        :host([responsive-mode='desktop'])
          [data-has-full-width-flyout]
          > [slot='list']
          [level='2']
          > [slot='list'] {
          position: absolute;
          width: 100%;
          left: 0;
          right: 0;
          min-height: 300px;
          padding: 1em;
          background-color: white;
          border: 1px solid gray;
          box-sizing: border-box;
        }

        :host([responsive-mode='desktop']) [level='3'] > [slot='list'] {
          position: absolute;
          left: 33.333%;
          width: 33.333%;
          top: 0;
          padding: 1em;
          background-color: white;
          box-sizing: border-box;
          height: 100%;
        }

        :host([responsive-mode='mobile']) nav {
          border: 1px solid black;
          display: block;
          position: fixed;
          top: 0;
          bottom: 0;
          right: 0;
          min-width: 500px;
        }

        :host([responsive-mode='mobile']) [level][opened] > [slot='list'] {
          left: 0;
          width: 100%;
          top: 0;
          box-sizing: border-box;
        }

        :host([responsive-mode='mobile']) [slot='list'] {
          position: relative;
          padding: 1em;
          background-color: white;
        }

        :host([responsive-mode='mobile']) [level='2'] > [slot='list'],
        :host([responsive-mode='mobile']) [level='3'] > [slot='list'] {
          position: absolute;
          left: 100%;
          top: 0;
          box-sizing: border-box;
          padding-bottom: 200%;
        }

        /**
        * TODO remove it. Use it now for testing More button feature
        */
        :host([responsive-mode='desktop']) [level='1'] > [slot='list'] > [role='listitem'],
        :host([responsive-mode='desktop'])
          [level='1']
          > [slot='list']
          > [data-more-button-wrapper] {
          margin-right: 180px;
        }

        :host([responsive-mode='mobile']) nav {
          display: flex;
          flex-direction: column;
          /* height: 100%;
          justify-content: space-between; */
        }

        /* :host([responsive-mode='mobile']) .cta-items {
          position: absolute;
          bottom: 0;
          width: 100%;
          padding: 1em;
          background-color: white;
          box-sizing: border-box;
        } */

        :host([responsive-mode='mobile']) .logo-and-close {
          padding: 1em;
        }
      `]}constructor(){super(),this.logo={type:"ing",alt:"ING homepage",href:"/"},this.menuSupportItems=[],this.ctaPrimary={},this.ctaSecondary={},this.menuItems=[],this.breakpointMin=1400,this.suggestions=[],this.prefilledSuggestion="";const e=window.matchMedia(`(width <= ${this.breakpointMin}px)`);this.responsiveMode=e.matches?"mobile":"desktop",this._levelCfg=this._getLevelCfg(this.responsiveMode),this._levelSecondaryCfg=this._getSecondaryLevelCfg(this.responsiveMode),e.addEventListener("change",()=>{this.responsiveMode=e.matches?"mobile":"desktop",this._levelCfg=this._getLevelCfg(this.responsiveMode),this._levelSecondaryCfg=this._getSecondaryLevelCfg(this.responsiveMode)}),this.#t()}_getLevelCfg(e){return e==="mobile"?{l1:{isBar:!1,openableConfig:{placementMode:"custom",isActivated:!1,hidesOnOutsideClick:!1,inheritsReferenceWidth:"none"}},l2:{openableConfig:{placementMode:"custom",hidesOnOutsideClick:!1,inheritsReferenceWidth:"none"}},l3:{openableConfig:{placementMode:"custom",hidesOnOutsideClick:!1,inheritsReferenceWidth:"none"}}}:{l1:{isBar:!0,hasFullWidthFlyout:!0,openableConfig:{placementMode:"custom",isActivated:!1,inheritsReferenceWidth:"none",elementToFocusOnShow:!0}},l2:{openableConfig:{placementMode:"custom",hidesOnOutsideClick:!0,hidesOnEscape:!0,inheritsReferenceWidth:"none",elementToFocusOnShow:!0}},l3:{openableConfig:{placementMode:"custom",inheritsReferenceWidth:"none",elementToFocusOnShow:!0,hideVisually:!0}}}}_getSecondaryLevelCfg(e){return e==="mobile"?{l1:{isBar:!0},l2:{isBar:!1}}:{l1:{isBar:!0},l2:{isBar:!1}}}#e=null;#t(){this.addEventListener("focusin",({target:e})=>{this.#e=e.id})}#i(){if(!this.#e)return;const e=this.shadowRoot?.querySelector(`#${this.#e}`);e instanceof HTMLElement&&e.focus()}_getId(e,t){if(e.id)return e.id;const n=e.title||e.label||"item";return`${Number.isInteger(t)?`l${t}-${n}`:n}-${Math.random().toString(16).slice(2)}`}updated(e){e.has("responsiveMode")&&(this._levelCfg=this._getLevelCfg(this.responsiveMode),this.#i())}render(){return i`
      <nav>
        <div class="nav-header">
          <div class="logo-and-close">
            <a href="${this.logo.href||"#"}">
              <img src="${this.logo.src||""}" alt="${this.logo.alt||""}" />
            </a>
            ${this.responsiveMode==="mobile"?i`<button data-close data-level="1">✖️</button>`:""}
          </div>
          ${this._searchTemplate()}
        </div>
        <div class="nav-body">
          ${this._menulevelTemplate(this.menuSupportItems,1,"")}
          ${this.responsiveMode==="desktop"?this._ctasTemplate(this.ctaPrimary,this.ctaSecondary):""}
          ${this._menulevelTemplate(this.menuItems,1,"",!0)}
        </div>
        ${this.responsiveMode==="mobile"?i`<div class="nav-footer">
              ${this._ctasTemplate(this.ctaPrimary,this.ctaSecondary)}
            </div>`:""}
      </nav>
    `}_searchTemplate(e=this.suggestions,t=this.prefilledSuggestion){return i` <form role="search">
      <input
        type="search"
        list="search-list"
        placeholder="What are you looking for?"
        .value="${t}"
      />
      <datalist id="search-list">
        ${e.map(n=>i`<option value="${n}"></option>`)}
      </datalist>
      <input type="submit" value="Search" />
    </form>`}_ctasTemplate(e,t){return i`<div class="cta-items">
      ${t?.href?i`<div class="cta-secondary">
            <a id="${this._getId(t)}" href="${t.href}"
              >${t.label}
            </a>
          </div>`:""}
      ${e?.href?i`<div class="cta-primary">
            <a id="${this._getId(e)}" href="${e.href}"> ${e.label}</a>
          </div>`:""}
    </div>`}_menulevelTemplate(e,t,n="",s=!1){const l=this._levelCfg[`l${t}`];return i`<lion-menu
      ?item-wrap=${s}
      .config="${l.openableConfig||{}}"
      .bar="${l.isBar}"
      ?data-has-full-width-flyout="${l.hasFullWidthFlyout}"
      ._activeMode="${"tabbable-disclosure"}"
    >
      ${t>1&&this.responsiveMode==="mobile"?i` <div role="listitem">
            <button data-close data-level="${t}">&lt; ${n}</button>
          </div>`:""}
      ${e.map(o=>i`
          <div role="listitem">
            ${o.sub?i` <button id="${this._getId(o)}" data-invoker>${o.title}</button>
                  ${o.sub?this._menulevelTemplate(o.sub,t+1,o.title):""}`:i` <a id="${this._getId(o)}" href="${o.link||""}"
                  >${o.title}</a
                >`}
          </div>
        `)}
      ${s?i`<div slot="more-button">
            <button>More</button>
          </div>`:g}
    </lion-menu> `}}customElements.define("demo-navigation-bar",S);const C=[{title:"Products",link:"products",sub:[{title:"Payments",link:"payments-collections",sub:[{title:"Payments & Collections",link:"#"},{title:"Merchant Commerce Solutions",link:"merchant-commerce-solutions"},{title:"Instant Payments",link:"instant-payments"},{title:"SEPA Direct Debit",link:"SEPA-direct-debit"},{title:"SEPA Credit Transfer",link:"SEPA-credit-transfer"},{title:"International Credit Transfer",link:"international-credit-transfer"},{title:"Account Reporting",link:"account-deporting"}]},{title:"Savings",link:"savings-collection",sub:[{title:"Liquidity & Cash Management",link:"liquidity-cash-management"},{title:"Physcial Cash Management",link:"physcial-cash-management"},{title:"Notional Cash Management",link:"notional-cash-management"},{title:"Virtual Cash Management",link:"virtual-cash-management"},{title:"Liquidity Management",link:"liquidity-management"},{title:"Excess Cash",link:"excess-cash"}]},{title:"Investing",link:"investing-collection",sub:[{title:"Digital Banking Services",link:"home"},{title:"InsideBusiness",link:"home"},{title:"Connectivity Solutions",link:"connectivity-solutions"}]},{title:"Mortgages",link:"mortgages-collections",sub:[{title:"Payments & Collections",link:"#"},{title:"Merchant Commerce Solutions",link:"merchant-commerce-solutions"},{title:"Instant Payments",link:"instant-payments"},{title:"SEPA Direct Debit",link:"SEPA-direct-debit"},{title:"SEPA Credit Transfer",link:"SEPA-credit-transfer"},{title:"International Credit Transfer",link:"international-credit-transfer"},{title:"Account Reporting",link:"account-deporting"}]},{title:"Loans",link:"loans-collection",sub:[{title:"Liquidity & Cash Management",link:"liquidity-cash-management"},{title:"Physcial Cash Management",link:"physcial-cash-management"},{title:"Notional Cash Management",link:"notional-cash-management"},{title:"Virtual Cash Management",link:"virtual-cash-management"},{title:"Liquidity Management",link:"liquidity-management"},{title:"Excess Cash",link:"excess-cash"}]},{title:"Insurances",link:"insurances-collection",sub:[{title:"Digital Banking Services",link:"home"},{title:"InsideBusiness",link:"home"},{title:"Connectivity Solutions",link:"connectivity-solutions"}]},{title:"Digital banking",link:"digital-banking"}]},{title:"Who it's for",link:"who",sub:[{title:"Parents & kids",link:"parents-kids",sub:[{title:"Child current account",link:"#child-current"},{title:"Youth current account",link:"#youth-current"},{title:"Child savings account",link:"#child-savings"}]},{title:"Students",link:"students",sub:[{title:"Student account",link:"#student-account"},{title:"Smart payments",link:"#smart-payments"},{title:"Smart savings",link:"#smart-savings"},{title:"Smart banking",link:"#smart-banking"},{title:"Smart for now",link:"#smart-for-now"},{title:"Smart for later",link:"#smart-for-later"}]},{title:"I'm an expat",link:"expat",sub:[{title:"Open a Dutch banking account",link:"#open"},{title:"Investments",link:"#investments"},{title:"Mortgage",link:"#mortgage"},{title:"Health insurance",link:"#insurance"}]}]},{title:"Themes",link:"themes",sub:[{title:"Living",link:"living-collections",sub:[{title:"Payments & Collections",link:"#"},{title:"Merchant Commerce Solutions",link:"merchant-commerce-solutions"},{title:"Instant Payments",link:"instant-payments"},{title:"SEPA Direct Debit",link:"SEPA-direct-debit"},{title:"SEPA Credit Transfer",link:"SEPA-credit-transfer"},{title:"International Credit Transfer",link:"international-credit-transfer"},{title:"Account Reporting",link:"account-deporting"}]},{title:"Wealth",link:"wealth-collections",sub:[{title:"Liquidity & Cash Management",link:"liquidity-cash-management"},{title:"Physcial Cash Management",link:"physcial-cash-management"},{title:"Notional Cash Management",link:"notional-cash-management"},{title:"Virtual Cash Management",link:"virtual-cash-management"},{title:"Liquidity Management",link:"liquidity-management"},{title:"Excess Cash",link:"excess-cash"}]}]},{title:"Loyalty shop",link:"#points"},{title:"Make an appointment",link:"#appointment"},{title:"Products 2",link:"products-2",sub:[{title:"Payments",link:"payments-collections",sub:[{title:"Payments & Collections",link:"#"},{title:"Merchant Commerce Solutions",link:"merchant-commerce-solutions"},{title:"Instant Payments",link:"instant-payments"},{title:"SEPA Direct Debit",link:"SEPA-direct-debit"},{title:"SEPA Credit Transfer",link:"SEPA-credit-transfer"},{title:"International Credit Transfer",link:"international-credit-transfer"},{title:"Account Reporting",link:"account-deporting"}]}]},{title:"Products 3",sub:[{title:"Payments",link:"payments-collections",sub:[{title:"Payments & Collections",link:"#"},{title:"Merchant Commerce Solutions",link:"merchant-commerce-solutions"},{title:"Instant Payments",link:"instant-payments"},{title:"SEPA Direct Debit",link:"SEPA-direct-debit"},{title:"SEPA Credit Transfer",link:"SEPA-credit-transfer"},{title:"International Credit Transfer",link:"international-credit-transfer"},{title:"Account Reporting",link:"account-deporting"}]}]},{title:"Loyalty shop 2",link:"#points"},{title:"Make an appointment 2",link:"#appointment"}],E=[{title:"Back to old website",link:"https://www.ingwb.com",target:"_self",trackid:"backToOldWebsite"}],M={id:"cta-primary",label:"Log in",href:"#login"},w={id:"cta-secondary",label:"Open an account",href:"#open-account"},d=["A","B","C","D"],$=()=>i`<demo-navigation-bar
    .menuItems="${C}"
    .menuSupportItems="${E}"
    .ctaPrimary="${M}"
    .ctaSecondary="${w}"
    .suggestions="${d}"
  >
    .prefilledSuggestion="${d[0]}"</demo-navigation-bar
  >`,_=document,P=[{key:"navigationBar",story:$}];let m=!1;for(const a of P){const e=_.querySelector(`[mdjs-story-name="${a.key}"]`);e&&(e.story=a.story,e.key=a.key,m=!0,Object.assign(e,{simulatorUrl:"/simulator",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}m&&(customElements.get("mdjs-preview")||c(()=>import("./define.BdbiuFq9.js"),__vite__mapDeps([0,1,2,3,4])),customElements.get("mdjs-story")||c(()=>import("./define.DNIVKtom.js"),__vite__mapDeps([5,2,3])));export{$ as navigationBar};
