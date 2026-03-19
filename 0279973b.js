import"./08927fef.js";import{x as o}from"./b4be29f1.js";import"./05905ff1.js";import"./cd88d4d9.js";import"./9534c2cb.js";import"./0ab13f37.js";import"./5034b8b0.js";import"./dc2f5f5a.js";import"./d45984a3.js";import"./4afec9a2.js";import"./11b71ee2.js";import"./4cc99b59.js";import"./19d2607c.js";import"./afb8834e.js";import"./143fde17.js";import"./6722e641.js";import"./06654559.js";import"./dc4e1be5.js";import"./06f5b106.js";const e=()=>o`
  <lion-listbox name="listbox" label="Default">
    <lion-option .choiceValue="${"Apple"}">Apple</lion-option>
    <lion-option checked .choiceValue="${"Artichoke"}">Artichoke</lion-option>
    <lion-option .choiceValue="${"Asparagus"}">Asparagus</lion-option>
    <lion-option .choiceValue="${"Banana"}">Banana</lion-option>
    <lion-option .choiceValue="${"Beets"}">Beets</lion-option>
  </lion-listbox>
`,t=document,i=[{key:"main",story:e}];let s=!1;for(const o of i){const e=t.querySelector(`[mdjs-story-name="${o.key}"]`);e&&(e.story=o.story,e.key=o.key,s=!0,Object.assign(e,{simulatorUrl:"/simulator/",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}s&&(customElements.get("mdjs-preview")||import("./24735558.js"),customElements.get("mdjs-story")||import("./cddf006a.js"));export{e as main};
