import"./08927fef.js";import{x as t}from"./b4be29f1.js";import"./05905ff1.js";import"./451f9027.js";import"./9af64c94.js";import"./4afec9a2.js";import"./11b71ee2.js";import"./dc2f5f5a.js";import"./3371a831.js";import"./7be278a3.js";const o=()=>t`
  <style>
    .demo-tooltip-invoker {
      margin: 50px;
    }
  </style>
  <lion-tooltip has-arrow>
    <button slot="invoker" class="demo-tooltip-invoker">Hover me</button>
    <div slot="content">This is a tooltip</div>
  </lion-tooltip>
`,e=document,s=[{key:"main",story:o}];let i=!1;for(const t of s){const o=e.querySelector(`[mdjs-story-name="${t.key}"]`);o&&(o.story=t.story,o.key=t.key,i=!0,Object.assign(o,{simulatorUrl:"/simulator/",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}i&&(customElements.get("mdjs-preview")||import("./24735558.js"),customElements.get("mdjs-story")||import("./cddf006a.js"));export{o as main};
