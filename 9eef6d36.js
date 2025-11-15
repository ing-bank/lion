import"./24f95583.js";import{x as o}from"./b4be29f1.js";import"./05905ff1.js";import"./58700fdc.js";import"./8763e36e.js";import"./b494bfc1.js";import"./7902d8e0.js";import"./dc2f5f5a.js";import"./d45984a3.js";import"./4afec9a2.js";import"./11b71ee2.js";import"./4cc99b59.js";import"./19d2607c.js";import"./afb8834e.js";import"./143fde17.js";import"./0bf7a48d.js";import"./48b0a907.js";import"./130d2801.js";const e=()=>o`
  <lion-listbox name="listbox" label="Default">
    <lion-option .choiceValue="${"Apple"}">Apple</lion-option>
    <lion-option checked .choiceValue="${"Artichoke"}">Artichoke</lion-option>
    <lion-option .choiceValue="${"Asparagus"}">Asparagus</lion-option>
    <lion-option .choiceValue="${"Banana"}">Banana</lion-option>
    <lion-option .choiceValue="${"Beets"}">Beets</lion-option>
  </lion-listbox>
`,t=document,i=[{key:"main",story:e}];let s=!1;for(const o of i){const e=t.querySelector(`[mdjs-story-name="${o.key}"]`);e&&(e.story=o.story,e.key=o.key,s=!0,Object.assign(e,{simulatorUrl:"/simulator/",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}s&&(customElements.get("mdjs-preview")||import("./a7b4f51b.js"),customElements.get("mdjs-story")||import("./cddf006a.js"));export{e as main};
