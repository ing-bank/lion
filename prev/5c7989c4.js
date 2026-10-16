import"./f1151d68.js";import{x as o}from"./b8bc2eda.js";import"./6638bb86.js";import"./dac9b410.js";import"./4c616179.js";import"./4afec9a2.js";import"./11b71ee2.js";import"./dc2f5f5a.js";import"./1c27b902.js";import"./7be278a3.js";const t=()=>o`
  <style>
    .demo-tooltip-invoker {
      margin: 50px;
    }

    .demo-tooltip-content {
      display: block;
      font-size: 16px;
      color: white;
      background-color: black;
      border-radius: 4px;
      padding: 8px;
    }

    .demo-box-placements {
      display: flex;
      flex-direction: column;
      margin: 40px 0 0 200px;
    }

    .demo-box-placements lion-tooltip {
      margin: 20px;
    }
  </style>
  <lion-tooltip has-arrow>
    <button slot="invoker" class="demo-tooltip-invoker">Hover me</button>
    <div slot="content" class="demo-tooltip-content">This is a tooltip</div>
  </lion-tooltip>
`,e=document,s=[{key:"main",story:t}];let i=!1;for(const o of s){const t=e.querySelector(`[mdjs-story-name="${o.key}"]`);t&&(t.story=o.story,t.key=o.key,i=!0,Object.assign(t,{simulatorUrl:"/simulator/",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}i&&(customElements.get("mdjs-preview")||import("./e90784d0.js"),customElements.get("mdjs-story")||import("./0defd61d.js"));export{t as main};
