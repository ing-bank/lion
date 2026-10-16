import"./f1151d68.js";import{x as t}from"./b8bc2eda.js";import"./6638bb86.js";import"./379e808f.js";import"./21260aea.js";import"./6722e641.js";const o=()=>t`
  <lion-tabs>
    <button slot="tab">Info</button>
    <p slot="panel">Info page with lots of information about us.</p>
    <button slot="tab">Work</button>
    <p slot="panel">Work page that showcases our work.</p>
  </lion-tabs>
`,e=document,s=[{key:"main",story:o}];let n=!1;for(const t of s){const o=e.querySelector(`[mdjs-story-name="${t.key}"]`);o&&(o.story=t.story,o.key=t.key,n=!0,Object.assign(o,{simulatorUrl:"/simulator/",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}n&&(customElements.get("mdjs-preview")||import("./e90784d0.js"),customElements.get("mdjs-story")||import("./0defd61d.js"));export{o as main};
