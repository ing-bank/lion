const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["_astro/define.DYUong5B.js","_astro/node-tools_providence-analytics_overview.LFFQBZzG.js","_astro/lit-element.qDHKJJma.js","_astro/lit-html.C7L4dwLU.js","_astro/unsafe-html.J0GGe2Q7.js","_astro/directive.CGE4aKEl.js","_astro/define.m2CvvXyF.js"])))=>i.map(i=>d[i]);
import{_ as n}from"./preload-helper.4zY6-HO4.js";import"./node-tools_providence-analytics_overview.LFFQBZzG.js";import{a as r}from"./lit-element.qDHKJJma.js";import{x as t}from"./lit-html.C7L4dwLU.js";import"./unsafe-html.J0GGe2Q7.js";import{L as s}from"./lion-tooltip.RSPdOyti.js";import"./directive.CGE4aKEl.js";import"./OverlayMixin.yM-HkbSu.js";import"./index.BNCfcFQh.js";import"./lazifyInstantiation.CgYLRMC3.js";import"./dedupeMixin.6XPTJgK8.js";import"./ArrowMixin.HbYR3IvJ.js";import"./withTooltipConfig.CUfiDvGe.js";const l=()=>t`
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
    <button slot="invoker" class="demo-tooltip-invoker">Hover me</button>
    <div slot="content">This is a tooltip</div>
  </lion-tooltip>
`,c=()=>(customElements.get("custom-tooltip")||customElements.define("custom-tooltip",class extends s{static get styles(){return[...super.styles,r`
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
  `),d=document,v=[{key:"invokerRelation",story:l},{key:"placements",story:p},{key:"overridePopperConfig",story:a},{key:"arrow",story:m},{key:"customArrow",story:c}];let i=!1;for(const o of v){const e=d.querySelector(`[mdjs-story-name="${o.key}"]`);e&&(e.story=o.story,e.key=o.key,i=!0,Object.assign(e,{simulatorUrl:"/next/simulator/",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}i&&(customElements.get("mdjs-preview")||n(()=>import("./define.DYUong5B.js"),__vite__mapDeps([0,1,2,3,4,5])),customElements.get("mdjs-story")||n(()=>import("./define.m2CvvXyF.js"),__vite__mapDeps([6,2,3])));export{m as arrow,c as customArrow,l as invokerRelation,a as overridePopperConfig,p as placements};
