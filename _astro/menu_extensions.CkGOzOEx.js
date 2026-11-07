const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["_astro/define.D5IFK1jp.js","_astro/MdJsPreview.B62up6PK.js","_astro/lit-element.DxRhnkit.js","_astro/lit-html.BX7rm8u-.js","_astro/dedupeMixin.6XPTJgK8.js","_astro/lit-element.BOikny4r.js","_astro/uuid.DjYKNjre.js","_astro/define.DBgp7shK.js"])))=>i.map(i=>d[i]);
import{_ as r}from"./preload-helper.CVfkMyKi.js";import"./lit-element.DxRhnkit.js";import{b as m}from"./lit-html.BX7rm8u-.js";import{a as h,i as u,b as i,A as p}from"./lit-element.BOikny4r.js";import{S as g}from"./ScopedElementsMixin.Bodi36kJ.js";import{L as k}from"./LionMenu.CWRF37WM.js";class b extends g(h){static get properties(){return{responsiveMode:{type:String,reflect:!0,attribute:"responsive-mode"},menuItems:{type:Array},menuSupportItems:{type:Array},ctaPrimary:{type:Object},ctaSecondary:{type:Object},suggestions:{type:Array},showOnMobile:{type:Array,attribute:"show-on-mobile",reflect:!0},_levelCfg:{state:!0}}}static get scopedElements(){return{"lion-menu":k}}static get styles(){return[u`
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
      `]}constructor(){super(),this.logo={type:"ing",alt:"ING homepage",href:"/"},this.menuSupportItems=[],this.ctaPrimary={},this.ctaSecondary={},this.menuItems=[],this.breakpointMin=1400,this.suggestions=[],this.prefilledSuggestion="";const t=window.matchMedia(`(width <= ${this.breakpointMin}px)`);this.responsiveMode=t.matches?"mobile":"desktop",this._levelCfg=this._getLevelCfg(this.responsiveMode),this._levelSecondaryCfg=this._getSecondaryLevelCfg(this.responsiveMode),t.addEventListener("change",()=>{this.responsiveMode=t.matches?"mobile":"desktop",this._levelCfg=this._getLevelCfg(this.responsiveMode),this._levelSecondaryCfg=this._getSecondaryLevelCfg(this.responsiveMode)}),this.#e()}_getLevelCfg(t){return t==="mobile"?{l1:{isBar:!1,openableConfig:{placementMode:"custom",isActivated:!1,hidesOnOutsideClick:!1,inheritsReferenceWidth:"none"}},l2:{openableConfig:{placementMode:"custom",hidesOnOutsideClick:!1,inheritsReferenceWidth:"none"}},l3:{openableConfig:{placementMode:"custom",hidesOnOutsideClick:!1,inheritsReferenceWidth:"none"}}}:{l1:{isBar:!0,hasFullWidthFlyout:!0,openableConfig:{placementMode:"custom",isActivated:!1,inheritsReferenceWidth:"none",elementToFocusOnShow:!0}},l2:{openableConfig:{placementMode:"custom",hidesOnOutsideClick:!0,hidesOnEscape:!0,inheritsReferenceWidth:"none",elementToFocusOnShow:!0}},l3:{openableConfig:{placementMode:"custom",inheritsReferenceWidth:"none",elementToFocusOnShow:!0,hideVisually:!0}}}}_getSecondaryLevelCfg(t){return t==="mobile"?{l1:{isBar:!0},l2:{isBar:!1}}:{l1:{isBar:!0},l2:{isBar:!1}}}#t=null;#e(){this.addEventListener("focusin",({target:t})=>{this.#t=t.id})}#i(){if(!this.#t)return;const t=this.shadowRoot?.querySelector(`#${this.#t}`);t instanceof HTMLElement&&t.focus()}_getId(t,e){if(t.id)return t.id;const s=t.title||t.label||"item";return`${Number.isInteger(e)?`l${e}-${s}`:s}-${Math.random().toString(16).slice(2)}`}updated(t){t.has("responsiveMode")&&(this._levelCfg=this._getLevelCfg(this.responsiveMode),this.#i())}render(){return i`
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
    `}_searchTemplate(t=this.suggestions,e=this.prefilledSuggestion){return i` <form role="search">
      <input
        type="search"
        list="search-list"
        placeholder="What are you looking for?"
        .value="${e}"
      />
      <datalist id="search-list">
        ${t.map(s=>i`<option value="${s}"></option>`)}
      </datalist>
      <input type="submit" value="Search" />
    </form>`}_ctasTemplate(t,e){return i`<div class="cta-items">
      ${e?.href?i`<div class="cta-secondary">
            <a id="${this._getId(e)}" href="${e.href}"
              >${e.label}
            </a>
          </div>`:""}
      ${t?.href?i`<div class="cta-primary">
            <a id="${this._getId(t)}" href="${t.href}"> ${t.label}</a>
          </div>`:""}
    </div>`}_menulevelTemplate(t,e,s="",a=!1){const o=this._levelCfg[`l${e}`];return i`<lion-menu
      ?item-wrap=${a}
      .config="${o.openableConfig||{}}"
      .bar="${o.isBar}"
      ?data-has-full-width-flyout="${o.hasFullWidthFlyout}"
      ._activeMode="${"tabbable-disclosure"}"
    >
      ${e>1&&this.responsiveMode==="mobile"?i` <div role="listitem">
            <button data-close data-level="${e}">&lt; ${s}</button>
          </div>`:""}
      ${t.map(n=>i`
          <div role="listitem">
            ${n.sub?i` <button id="${this._getId(n)}" data-invoker>${n.title}</button>
                  ${n.sub?this._menulevelTemplate(n.sub,e+1,n.title):""}`:i` <a id="${this._getId(n)}" href="${n.link||""}"
                  >${n.title}</a
                >`}
          </div>
        `)}
      ${a?i`<div slot="more-button">
            <button>More</button>
          </div>`:p}
    </lion-menu> `}}customElements.define("demo-navigation-bar",b);const f=[{title:"Products",link:"products",sub:[{title:"Payments",link:"payments-collections",sub:[{title:"Payments & Collections",link:"#"},{title:"Merchant Commerce Solutions",link:"merchant-commerce-solutions"},{title:"Instant Payments",link:"instant-payments"},{title:"SEPA Direct Debit",link:"SEPA-direct-debit"},{title:"SEPA Credit Transfer",link:"SEPA-credit-transfer"},{title:"International Credit Transfer",link:"international-credit-transfer"},{title:"Account Reporting",link:"account-deporting"}]},{title:"Savings",link:"savings-collection",sub:[{title:"Liquidity & Cash Management",link:"liquidity-cash-management"},{title:"Physcial Cash Management",link:"physcial-cash-management"},{title:"Notional Cash Management",link:"notional-cash-management"},{title:"Virtual Cash Management",link:"virtual-cash-management"},{title:"Liquidity Management",link:"liquidity-management"},{title:"Excess Cash",link:"excess-cash"}]},{title:"Investing",link:"investing-collection",sub:[{title:"Digital Banking Services",link:"home"},{title:"InsideBusiness",link:"home"},{title:"Connectivity Solutions",link:"connectivity-solutions"}]},{title:"Mortgages",link:"mortgages-collections",sub:[{title:"Payments & Collections",link:"#"},{title:"Merchant Commerce Solutions",link:"merchant-commerce-solutions"},{title:"Instant Payments",link:"instant-payments"},{title:"SEPA Direct Debit",link:"SEPA-direct-debit"},{title:"SEPA Credit Transfer",link:"SEPA-credit-transfer"},{title:"International Credit Transfer",link:"international-credit-transfer"},{title:"Account Reporting",link:"account-deporting"}]},{title:"Loans",link:"loans-collection",sub:[{title:"Liquidity & Cash Management",link:"liquidity-cash-management"},{title:"Physcial Cash Management",link:"physcial-cash-management"},{title:"Notional Cash Management",link:"notional-cash-management"},{title:"Virtual Cash Management",link:"virtual-cash-management"},{title:"Liquidity Management",link:"liquidity-management"},{title:"Excess Cash",link:"excess-cash"}]},{title:"Insurances",link:"insurances-collection",sub:[{title:"Digital Banking Services",link:"home"},{title:"InsideBusiness",link:"home"},{title:"Connectivity Solutions",link:"connectivity-solutions"}]},{title:"Digital banking",link:"digital-banking"}]},{title:"Who it's for",link:"who",sub:[{title:"Parents & kids",link:"parents-kids",sub:[{title:"Child current account",link:"#child-current"},{title:"Youth current account",link:"#youth-current"},{title:"Child savings account",link:"#child-savings"}]},{title:"Students",link:"students",sub:[{title:"Student account",link:"#student-account"},{title:"Smart payments",link:"#smart-payments"},{title:"Smart savings",link:"#smart-savings"},{title:"Smart banking",link:"#smart-banking"},{title:"Smart for now",link:"#smart-for-now"},{title:"Smart for later",link:"#smart-for-later"}]},{title:"I'm an expat",link:"expat",sub:[{title:"Open a Dutch banking account",link:"#open"},{title:"Investments",link:"#investments"},{title:"Mortgage",link:"#mortgage"},{title:"Health insurance",link:"#insurance"}]}]},{title:"Themes",link:"themes",sub:[{title:"Living",link:"living-collections",sub:[{title:"Payments & Collections",link:"#"},{title:"Merchant Commerce Solutions",link:"merchant-commerce-solutions"},{title:"Instant Payments",link:"instant-payments"},{title:"SEPA Direct Debit",link:"SEPA-direct-debit"},{title:"SEPA Credit Transfer",link:"SEPA-credit-transfer"},{title:"International Credit Transfer",link:"international-credit-transfer"},{title:"Account Reporting",link:"account-deporting"}]},{title:"Wealth",link:"wealth-collections",sub:[{title:"Liquidity & Cash Management",link:"liquidity-cash-management"},{title:"Physcial Cash Management",link:"physcial-cash-management"},{title:"Notional Cash Management",link:"notional-cash-management"},{title:"Virtual Cash Management",link:"virtual-cash-management"},{title:"Liquidity Management",link:"liquidity-management"},{title:"Excess Cash",link:"excess-cash"}]}]},{title:"Loyalty shop",link:"#points"},{title:"Make an appointment",link:"#appointment"},{title:"Products 2",link:"products-2",sub:[{title:"Payments",link:"payments-collections",sub:[{title:"Payments & Collections",link:"#"},{title:"Merchant Commerce Solutions",link:"merchant-commerce-solutions"},{title:"Instant Payments",link:"instant-payments"},{title:"SEPA Direct Debit",link:"SEPA-direct-debit"},{title:"SEPA Credit Transfer",link:"SEPA-credit-transfer"},{title:"International Credit Transfer",link:"international-credit-transfer"},{title:"Account Reporting",link:"account-deporting"}]}]},{title:"Products 3",sub:[{title:"Payments",link:"payments-collections",sub:[{title:"Payments & Collections",link:"#"},{title:"Merchant Commerce Solutions",link:"merchant-commerce-solutions"},{title:"Instant Payments",link:"instant-payments"},{title:"SEPA Direct Debit",link:"SEPA-direct-debit"},{title:"SEPA Credit Transfer",link:"SEPA-credit-transfer"},{title:"International Credit Transfer",link:"international-credit-transfer"},{title:"Account Reporting",link:"account-deporting"}]}]},{title:"Loyalty shop 2",link:"#points"},{title:"Make an appointment 2",link:"#appointment"}],v=[{title:"Back to old website",link:"https://www.ingwb.com",target:"_self",trackid:"backToOldWebsite"}],y={id:"cta-primary",label:"Log in",href:"#login"},C={id:"cta-secondary",label:"Open an account",href:"#open-account"},c=["A","B","C","D"],S=()=>m`<demo-navigation-bar
    .menuItems="${f}"
    .menuSupportItems="${v}"
    .ctaPrimary="${y}"
    .ctaSecondary="${C}"
    .suggestions="${c}"
  >
    .prefilledSuggestion="${c[0]}"</demo-navigation-bar
  >`,M=document,$=[{key:"navigationBar",story:S}];let d=!1;for(const l of $){const t=M.querySelector(`[mdjs-story-name="${l.key}"]`);t&&(t.story=l.story,t.key=l.key,d=!0,Object.assign(t,{simulatorUrl:"/simulator",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}d&&(customElements.get("mdjs-preview")||r(()=>import("./define.D5IFK1jp.js"),__vite__mapDeps([0,1,2,3,4,5,6])),customElements.get("mdjs-story")||r(()=>import("./define.DBgp7shK.js"),__vite__mapDeps([7,2,3])));export{S as navigationBar};
