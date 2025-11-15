import"./24f95583.js";import{x as o}from"./b4be29f1.js";import"./05905ff1.js";import{l as e,a as t}from"./2758bd27.js";import"./4de68b8d.js";import"./8763e36e.js";import"./afb8834e.js";import"./19d2607c.js";import"./9b4d17c9.js";import"./4cc99b59.js";import"./d45984a3.js";import"./4afec9a2.js";import"./11b71ee2.js";import"./dc2f5f5a.js";import"./65cdf028.js";import"./acda6ea6.js";import"./0ed5d59c.js";import"./459b1eec.js";import"./4dc0ac82.js";import"./7902d8e0.js";import"./143fde17.js";import"./0bf7a48d.js";import"./48b0a907.js";import"./b494bfc1.js";import"./130d2801.js";const m=()=>o`
  <lion-combobox name="combo" label="Default">
    ${e(t.map((e,t)=>o`
          <lion-option .checked="${0===t}" .choiceValue="${e}">${e}</lion-option>
        `))}
  </lion-combobox>
`,s=document,i=[{key:"main",story:m}];let r=!1;for(const o of i){const e=s.querySelector(`[mdjs-story-name="${o.key}"]`);e&&(e.story=o.story,e.key=o.key,r=!0,Object.assign(e,{simulatorUrl:"/simulator/",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}r&&(customElements.get("mdjs-preview")||import("./a7b4f51b.js"),customElements.get("mdjs-story")||import("./cddf006a.js"));export{m as main};
