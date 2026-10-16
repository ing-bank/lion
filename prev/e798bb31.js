import"./f1151d68.js";import{x as t}from"./b8bc2eda.js";import"./6638bb86.js";import"./dac9b410.js";import"./4c616179.js";import"./4afec9a2.js";import"./11b71ee2.js";import"./dc2f5f5a.js";import"./1c27b902.js";import"./7be278a3.js";const o=()=>t`
  <style>
    .demo-tooltip-invoker {
      margin: 50px;
    }
  </style>
  <lion-tooltip has-arrow>
    <button slot="invoker" class="demo-tooltip-invoker">Hover me</button>
    <div slot="content">This is a tooltip</div>
  </lion-tooltip>
`,e=document,s=[{key:"main",story:o}];let i=!1;for(const t of s){const o=e.querySelector(`[mdjs-story-name="${t.key}"]`);o&&(o.story=t.story,o.key=t.key,i=!0,Object.assign(o,{simulatorUrl:"/simulator/",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}i&&(customElements.get("mdjs-preview")||import("./e90784d0.js"),customElements.get("mdjs-story")||import("./0defd61d.js"));export{o as main};
