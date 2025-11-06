const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["_astro/iconset-portal.BDPsYAEX.js","_astro/lit-element.qDHKJJma.js","_astro/lit-html.C7L4dwLU.js"])))=>i.map(i=>d[i]);
import{i as p,a as d}from"./lit-element.qDHKJJma.js";import{x as l,E as i}from"./lit-html.C7L4dwLU.js";import{i as u}from"./lion-icon.CN7y9ybC.js";import{_ as v}from"./preload-helper.4zY6-HO4.js";import"./directive-helpers.CLllgGgm.js";import"./index.BNCfcFQh.js";import"./lazifyInstantiation.CgYLRMC3.js";class g{host;container;resizeObserver;layouts;layoutsContainer;currentLayout;constructor(t,{layouts:a,layoutsContainer:o}){(this.host=t).addController(this),!(!a||!Object.keys(a).length)&&(this.layouts=a,this.layoutsContainer=o)}hostConnected(){this.resizeObserver=new ResizeObserver(t=>{const a=t[0].contentBoxSize[0].inlineSize,n=Object.entries(this.layouts).sort((r,s)=>s[1]-r[1]).find(([,r])=>a>=r)?.[0];n!==this.currentLayout&&(this.host.setAttribute("data-layout",n),this.currentLayout=n)}),this.container=(this.layoutsContainer===globalThis?document?.body:this.layoutsContainer)||this.host,this.resizeObserver?.observe(this.container)}hostDisconnected(){this.resizeObserver?.unobserve(this.container)}}class y extends p{static styles=[];static templates={};static hasStylesAndMarkupProvided=!1;templates=this.constructor.templates;scopedElements=this.constructor.scopedElements;layouts=this.constructor.layouts;layoutsContainer=this.constructor.layoutsContainer;get templateContext(){return{templates:this.templates}}constructor(){super(),this.layoutCtrl=new g(this,{layouts:this.layouts,layoutsContainer:this.layoutsContainer})}static provideStylesAndMarkup(t){this.styles=t.styles(this.styles),this.elementStyles=this.finalizeStyles(this.styles),t.markup?.templates&&(this.templates=t.markup?.templates(this.templates)),t.markup?.scopedElements&&(this.scopedElements=t.markup?.scopedElements(this.scopedElements)),t.layouts&&(this.layouts=t.layouts(this.layouts)),t.layoutsContainer&&(this.layoutsContainer=t.layoutsContainer(this.layoutsContainer)),this.constructor.hasStylesAndMarkupProvided=!0}render(){const{templates:t}=this;return t?.main?t.main(this.templateContext):new Error("[UIBaseElement] Provide a main render function")}}function m(e,t){switch(e){case"portal":return v(()=>import("./iconset-portal.BDPsYAEX.js"),__vite__mapDeps([0,1,2])).then(a=>a[t]);default:throw new Error(`Unknown iconset ${e}`)}}let c=!1;function f(){c||(u.addIconResolver("lion-portal",m),c=!0)}const b=d`
  :host([data-layout='floating-toggle']) {
    width: 0;
  }

  :host([data-layout='floating-toggle']) .burger {
    position: absolute;
    z-index: 1000;

    display: flex;
    flex-direction: column;
    width: 32px;
    height: 32px;
    justify-content: space-around;
    cursor: pointer;
    left: 20px;
    top: 20px;
  }

  :host([data-layout='floating-toggle']) .burger span {
    height: 4px;
    background: #333;
    border-radius: 2px;
    transition: 0.3s;
    display: block;
  }

  :host([data-layout='floating-toggle']) #l1-wrapper {
    display: none;
    z-index: 100;
    background: #fff;
  }

  :host([data-layout='floating-toggle']) [data-part='level'][data-level='1'],
  :host([data-layout='floating-toggle']) [data-part='level'][data-level='2'] {
    z-index: 100;
    background: #fff;
  }

  :host([data-layout='floating-toggle']) #burger-toggle:checked ~ #l1-wrapper {
    display: flex;
    position: absolute;
  }
`;try{f()}catch{}class h extends y{static properties={navData:{type:Array,attribute:"nav-data"}};constructor(){super(),this.navData=[],this.getLink=t=>l`<a href="${t.redirect||t.url}" aria-current=${t.active?"page":""}
        >${t.name}</a
      >`}connectedCallback(){super.connectedCallback(),window&&window.setTimeout(()=>{const t=this.renderRoot.querySelectorAll('[data-part="nav"]');t.length>1&&t[1].remove()})}get templateContext(){return{...super.templateContext,data:{navData:this.navData}}}static templates={main(t){const{data:a,templates:o}=t;return l` <nav>${o.navLevel(t,{children:a.navData})}</nav> `},navLevel(t,{children:a}){const{templates:o}=t;return l`<ul>
        ${a.map(n=>l`<li>
              ${o.navItem(t,{item:n})}
              ${n.children?.length?l`<ul>
                    <li>
                      ${n.children.map(r=>l`
                          ${this.getLink(r)}
                          ${r.children?.length?l` collapsible
                                <ul>
                                  ${n.children.map(s=>l`
                                      <li>${o.navItem(t,{item:s})}</li>
                                    `)}
                                </ul>`:i}
                        `)}
                    </li>
                  </ul>`:i}
            </li>`)}
      </ul>`},navItem(t,{item:a}){return this.getLink(a)}}}const k="ui-portal-main-nav",x=d`
  * {
    box-sizing: border-box;
  }
`,$={templates:()=>({main(e){const{data:t,templates:a}=e;return l`
        <nav data-part="nav">
          <input type="checkbox" id="burger-toggle" hidden />
          <label for="burger-toggle" class="burger">
            <span></span>
            <span></span>
            <span></span>
          </label>

          <div id="l1-wrapper" data-part="l1-wrapper">
            ${a.navRootLevel(e,{children:t.navData,level:1})}
            ${a.navNestedLevel(e,{children:t.navData.find(o=>o.active)?.children,level:2})}
          </div>
        </nav>
      `},navRootLevel(e,{children:t,level:a,hasActiveChild:o=!1}){const{templates:n}=e;return l`<div
        data-part="level"
        data-level="${a}"
        data-has-active-child="${o}"
      >
        <ul data-part="list" data-level="${a}">
          ${t.map(r=>l`<li data-part="listitem" data-level="${a}" ?data-:active="${r.active}">
                ${n.navItem(e,{item:r,level:a})}
              </li>`)}
        </ul>
        <div class="nav-item-last">
          <a href="/search" data-part="anchor" data-level="${a}">
            <lion-icon
              data-part="icon"
              data-level="${a}"
              icon-id="lion-portal:portal:search"
            ></lion-icon>
            <span>Search</span>
          </a>
        </div>
      </div>`},navNestedLevel(e,{children:t,level:a,hasActiveChild:o=!1}){const{templates:n}=e;return t?.length?l`<div
        data-part="level"
        data-level="${a}"
        data-has-active-child="${o}"
      >
        <ul data-part="list" data-level="${a}">
          ${t.map(r=>l`<li data-part="listitem" data-level="${a}" ?data-:active="${r.active}">
                ${n.navItem(e,{item:r,level:a})}
                ${r.children?.length?n.navNestedLevel(e,{level:a+1,children:r.children,hasActiveChild:r.hasActiveChild}):i}
              </li>`)}
        </ul>
      </div>`:i},navItem(e,{item:t,level:a}){return l`<a
        data-part="anchor"
        data-level="${a}"
        href="${t.redirect||t.url}"
        aria-current=${t.active?"page":""}
        >${a===1?l`<lion-icon
              data-part="icon"
              data-level="${a}"
              icon-id="${t.iconId}${t.active?"Filled":""}"
            ></lion-icon>`:i}<span>${t.name}</span></a
      >`}}),scopedElements:()=>({})};h.provideStylesAndMarkup({markup:$,styles:()=>[x,b,d`
      :host {
        height: 100vh;
        /** Make this the positioning parent of l0 and l1 */
        position: relative;
        display: block;
        position: sticky;
        top: 0;
      }

      #l1-wrapper {
        display: flex;
      }

      :host [data-part='nav'] {
        height: 100%;
      }

      :host [data-part='level'][data-level='1'],
      :host [data-part='level'][data-level='2'] {
        padding-block-start: var(--size-6);
        padding-inline: var(--size-2);
        overflow-y: scroll;
        height: 100vh;
      }

      :host [data-part='level'][data-level='1'] {
        width: 160px;
        border-right: 1px solid #ccc;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      }

      :host [data-part='level'][data-level='2'] {
        width: 200px;
      }

      /**
       * When a l0 child is active, or a l1 child => open correct l1
       */
      :host
        [data-part='listitem']:not([data-\:active])
        [data-part='level'][data-level='2']:not([data-has-active-child]) {
        /** TODO: sr-only, because we want to present all links to the screen reader */
        display: none;
      }

      :host [data-part='list'] {
        list-style-type: none;
        margin: 4px;
        padding: 0;
      }

      :host [data-part='anchor'][data-level='1'] {
        display: block;
        padding-block: var(--size-6);
        padding-inline: var(--size-6);
      }

      :host [data-part='anchor'][data-level='2'] {
        display: block;
        padding-block: var(--size-3);
        padding-inline: var(--size-6);
      }

      :host [data-part='anchor'][data-level='2'][aria-current='page']:not(:last-child) {
        padding-block: var(--size-2);
      }

      :host [data-part='icon'][data-level='1'] {
        display: block;
        width: var(--size-7);
        height: var(--size-7);
        margin-bottom: var(--size-1);
      }

      :host [data-part='anchor'][data-level='1'] {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-block-end: 6px;
      }

      :host [data-part='anchor'] {
        display: block;
        color: var(--text-color);
        text-decoration: inherit;
        font-size: 1rem;
        fill: var(--primary-icon-color);
        margin-inline: var(--size-1);
        border-radius: var(--radius-4);
      }

      :host [data-part='anchor'][aria-current='page'][data-level='1'],
      :host [data-part='anchor'][aria-current='page'][data-level='3']:last-child,
      :host [data-part='anchor'][aria-current='page'][data-level='4'] {
        font-weight: bold;
        background-color: var(--secondary-color);
      }

      :host [data-part='anchor']:hover {
        text-decoration: underline;
        text-underline-offset: 0.3em;
        background-color: var(--secondary-color-lighter);
      }

      :host [data-part='anchor']:focus {
        outline: 2px solid var(--contrast-color-dark);
      }

      :host [data-part='anchor'][data-level='2']:focus,
      :host [data-part='anchor'][data-level='2']:focus {
        outline-offset: 2px;
      }

      :host [data-part='level'][data-level='2'] {
        color: var(--text-color, #333);

        /* 14px/Regular */
        font-family: 'ING Me';
        font-size: 0.875rem;
        font-style: normal;
        font-weight: 400;
        line-height: 20px; /* 142.857% */
        text-decoration: none;
      }

      :host [data-part='listitem'][data-level='2'][data-\\:active] {
        border-radius: var(--radius-4);
        background: var(--neutral-color-lightest);
        margin-block: 6px;
      }

      :host [data-part='level'][data-level='3'] {
        overflow: hidden;
        padding-block-end: 12px;
      }

      :host [data-part='anchor'][data-level='3'],
      :host [data-part='anchor'][data-level='4'] {
        /* 14px/Regular */
        font-family: 'ING Me';
        font-size: 0.875rem;
        font-style: normal;
        font-weight: 400;
        line-height: 20px; /* 142.857% */
        text-decoration: none;
        margin-left: var(--size-7);
        padding-inline: var(--size-3);
      }

      :host [data-part='anchor'][data-level='3'][aria-current='page'],
      :host [data-part='anchor'][data-level='4'][aria-current='page'] {
        font-weight: bold;
      }

      :host [data-level='2'] > [aria-current='page'] {
        background: transparent;
        font-weight: bold;
      }

      :host [data-part='list'][data-level='4'] {
        margin-left: var(--size-3);
      }
    `],layouts:()=>({"floating-toggle":0,"inline-columns":900}),layoutsContainer:()=>globalThis});customElements.define(k,h);export{h as UIPortalMainNav};
