import"./24f95583.js";import{x as o,a as t}from"./b4be29f1.js";import"./05905ff1.js";import{L as e}from"./d4f2d11b.js";import"./65cdf028.js";import"./4afec9a2.js";import"./11b71ee2.js";import"./dc2f5f5a.js";import"./5254a80b.js";import"./7be278a3.js";const i=()=>o`
    <style>
      .demo-tooltip-invoker {
        margin: 50px;
      }
    </style>
    <lion-tooltip .config="${{invokerRelation:"label"}}">
      <button slot="invoker" class="demo-tooltip-invoker">📅</button>
      <div slot="content">Agenda<div>
    </lion-tooltip>
  `,n=()=>o`
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
  `,s=()=>o`
    <style>
      .demo-tooltip-invoker {
        margin: 50px;
      }
    </style>
    <lion-tooltip .config="${{popperConfig:{placement:"bottom-start",strategy:"fixed",modifiers:[{name:"keepTogether",options:{},enabled:!0},{name:"preventOverflow",options:{boundariesElement:"viewport",padding:16},enabled:!1},{name:"flip",options:{boundariesElement:"viewport",padding:4},enabled:!0},{name:"offset",options:{offset:[0,4]},enabled:!0}]}}}">
      <button slot="invoker" class="demo-tooltip-invoker">Hover me</button>
      <div slot="content">This is a tooltip<div>
    </lion-tooltip>
  `,l=()=>o`
  <style>
    .demo-tooltip-invoker {
      margin: 50px;
    }
  </style>
  <lion-tooltip has-arrow>
    <button slot="invoker" class="demo-tooltip-invoker">Hover me</button>
    <div slot="content">This is a tooltip</div>
  </lion-tooltip>
`,r=()=>(customElements.get("custom-tooltip")||customElements.define("custom-tooltip",class extends e{static get styles(){return[...super.styles,t`
              :host {
                --tooltip-arrow-width: 20px;
                --tooltip-arrow-height: 8px;
              }
            `]}constructor(){super(),this.hasArrow=!0}_arrowTemplate(){return o`
            <svg viewBox="0 0 20 8" class="arrow__graphic">
              <path d="M 0,0 h 20 L 10,8 z"></path>
            </svg>
          `}}),o`
    <style>
      .demo-tooltip-invoker {
        margin: 50px;
      }
    </style>
    <custom-tooltip>
      <button slot="invoker" class="demo-tooltip-invoker">Hover me</button>
      <div slot="content">This is a tooltip</div>
    </custom-tooltip>
  `),p=document,a=[{key:"invokerRelation",story:i},{key:"placements",story:n},{key:"overridePopperConfig",story:s},{key:"arrow",story:l},{key:"customArrow",story:r}];let m=!1;for(const o of a){const t=p.querySelector(`[mdjs-story-name="${o.key}"]`);t&&(t.story=o.story,t.key=o.key,m=!0,Object.assign(t,{simulatorUrl:"/simulator/",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}m&&(customElements.get("mdjs-preview")||import("./a7b4f51b.js"),customElements.get("mdjs-story")||import("./cddf006a.js"));export{l as arrow,r as customArrow,i as invokerRelation,s as overridePopperConfig,n as placements};
