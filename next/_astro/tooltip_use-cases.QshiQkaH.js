const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["_astro/define.DSVRgKCR.js","_astro/node-tools_providence-analytics_overview.BxIihMx7.js","_astro/lit-element.jD9bOQKo.js","_astro/lit-html.DtZEZPQ5.js","_astro/unsafe-html.DgrA3nwU.js","_astro/directive.BO6BEpVC.js","_astro/define.DNIVKtom.js"])))=>i.map(i=>d[i]);
import{_ as n}from"./preload-helper.Cj2JEybs.js";import"./node-tools_providence-analytics_overview.BxIihMx7.js";import{a as l}from"./lit-element.jD9bOQKo.js";import{x as t}from"./lit-html.DtZEZPQ5.js";import"./unsafe-html.DgrA3nwU.js";import{L as s}from"./lion-tooltip.DcSM22i4.js";const r=()=>t`
    <style>
      .demo-tooltip-invoker {
        margin: 50px;
      }
    </style>
    <lion-tooltip .config="${{invokerRelation:"label"}}">
      <button slot="invoker" class="demo-tooltip-invoker">📅</button>
      <div slot="content">Agenda<div>
    </lion-tooltip>
  `,p=()=>t`
    <style>
      button[slot='invoker'] {
        margin: 50px;
      }
      div[slot='content'] {
        background-color: white;
        padding: 4px;
      }
    </style>
    <div class="demo-box-placements">
      <lion-tooltip has-arrow .config="${{popperConfig:{placement:"top"}}}">
        <button slot="invoker">Top</button>
        <div slot="content">Top placement</div>
      </lion-tooltip>
      <lion-tooltip has-arrow .config="${{popperConfig:{placement:"right"}}}">
        <button slot="invoker">Right</button>
        <div slot="content">Right placement</div>
      </lion-tooltip>
      <lion-tooltip has-arrow .config="${{popperConfig:{placement:"bottom"}}}">
        <button slot="invoker">Bottom</button>
        <div slot="content">Bottom placement</div>
      </lion-tooltip>
      <lion-tooltip has-arrow .config="${{popperConfig:{placement:"left"}}}">
        <button slot="invoker">Left</button>
        <div slot="content">Left placement</div>
      </lion-tooltip>
    </div>
  `,a=()=>t`
    <style>
      .demo-tooltip-invoker {
        margin: 50px;
      }
    </style>
    <lion-tooltip .config="${{popperConfig:{placement:"bottom-start",strategy:"fixed",modifiers:[{name:"keepTogether",options:{},enabled:!0},{name:"preventOverflow",options:{boundariesElement:"viewport",padding:16},enabled:!1},{name:"flip",options:{boundariesElement:"viewport",padding:4},enabled:!0},{name:"offset",options:{offset:[0,4]},enabled:!0}]}}}">
      <button slot="invoker" class="demo-tooltip-invoker">Hover me</button>
      <div slot="content">This is a tooltip<div>
    </lion-tooltip>
  `,m=()=>t`
  <style>
    .demo-tooltip-invoker {
      margin: 50px;
    }
  </style>
  <lion-tooltip has-arrow>
    <button slot="invoker" class="demo-tooltip-invoker">
      Hover (desktop) / long-press 500ms (touch)
    </button>
    <div slot="content">Tooltip content</div>
  </lion-tooltip>
`,c=()=>t`
  <style>
    .demo-tooltip-invoker {
      margin: 50px;
    }
  </style>
  <lion-tooltip has-arrow>
    <button
      slot="invoker"
      class="demo-tooltip-invoker"
      @click="${o=>o.target.closest("lion-tooltip").nextElementSibling.showModal()}"
    >
      Tap opens dialog /</br> Long-press shows tooltip
    </button>
    <div slot="content">Tooltip content</div>
  </lion-tooltip>
  <dialog>
    <p>Dialog opened by tap</p>
    <button @click="${o=>o.target.closest("dialog").close()}">Close</button>
  </dialog>
`,d=()=>t`
  <style>
    .demo-tooltip-invoker {
      margin: 50px;
    }
  </style>
  <lion-tooltip has-arrow>
    <button slot="invoker" class="demo-tooltip-invoker">Hover me</button>
    <div slot="content">This is a tooltip</div>
  </lion-tooltip>
`,g=()=>(customElements.get("custom-tooltip")||customElements.define("custom-tooltip",class extends s{static get styles(){return[...super.styles,l`
              :host {
                --tooltip-arrow-width: 20px;
                --tooltip-arrow-height: 8px;
              }
            `]}constructor(){super(),this.hasArrow=!0}_arrowTemplate(){return t`
            <svg viewBox="0 0 20 8" class="arrow__graphic">
              <path d="M 0,0 h 20 L 10,8 z"></path>
            </svg>
          `}}),t`
    <style>
      .demo-tooltip-invoker {
        margin: 50px;
      }
    </style>
    <custom-tooltip>
      <button slot="invoker" class="demo-tooltip-invoker">Hover me</button>
      <div slot="content">This is a tooltip</div>
    </custom-tooltip>
  `),v=document,u=[{key:"invokerRelation",story:r},{key:"placements",story:p},{key:"overridePopperConfig",story:a},{key:"longpress",story:m},{key:"overlayAndLongpress",story:c},{key:"arrow",story:d},{key:"customArrow",story:g}];let i=!1;for(const o of u){const e=v.querySelector(`[mdjs-story-name="${o.key}"]`);e&&(e.story=o.story,e.key=o.key,i=!0,Object.assign(e,{simulatorUrl:"/next/simulator",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}i&&(customElements.get("mdjs-preview")||n(()=>import("./define.DSVRgKCR.js"),__vite__mapDeps([0,1,2,3,4,5])),customElements.get("mdjs-story")||n(()=>import("./define.DNIVKtom.js"),__vite__mapDeps([6,2,3])));export{d as arrow,g as customArrow,r as invokerRelation,m as longpress,c as overlayAndLongpress,a as overridePopperConfig,p as placements};
