import"./f1151d68.js";import{x as o}from"./b8bc2eda.js";import"./6638bb86.js";import"./0e1a6f11.js";import"./f674cc3a.js";import"./ac7779e1.js";import"./4abf0ca8.js";import"./dc2f5f5a.js";import"./7c882590.js";import"./4afec9a2.js";import"./11b71ee2.js";import"./c48d90f3.js";import"./be5f2fd3.js";import"./dcadf410.js";import"./143fde17.js";import"./6722e641.js";import"./2cefa045.js";import"./af1609b4.js";import"./18551691.js";const e=()=>o`
  <lion-listbox name="listbox" label="Default">
    <lion-option .choiceValue="${"Apple"}">Apple</lion-option>
    <lion-option checked .choiceValue="${"Artichoke"}">Artichoke</lion-option>
    <lion-option .choiceValue="${"Asparagus"}">Asparagus</lion-option>
    <lion-option .choiceValue="${"Banana"}">Banana</lion-option>
    <lion-option .choiceValue="${"Beets"}">Beets</lion-option>
  </lion-listbox>
`,t=document,i=[{key:"main",story:e}];let s=!1;for(const o of i){const e=t.querySelector(`[mdjs-story-name="${o.key}"]`);e&&(e.story=o.story,e.key=o.key,s=!0,Object.assign(e,{simulatorUrl:"/simulator/",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}s&&(customElements.get("mdjs-preview")||import("./e90784d0.js"),customElements.get("mdjs-story")||import("./0defd61d.js"));export{e as main};
