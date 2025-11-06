import"./24f95583.js";import{x as o}from"./b4be29f1.js";import"./05905ff1.js";import{l as t,a as e}from"./2758bd27.js";import"./b72424c3.js";import"./969ba121.js";import"./afb8834e.js";import"./19d2607c.js";import"./ac41bbf8.js";import"./4cc99b59.js";import"./d45984a3.js";import"./4afec9a2.js";import"./11b71ee2.js";import"./dc2f5f5a.js";import"./65cdf028.js";import"./acda6ea6.js";import"./0ed5d59c.js";import"./3599da39.js";import"./4dc0ac82.js";import"./c6fab747.js";import"./143fde17.js";import"./44105dd4.js";import"./ec06148e.js";import"./0fc7fbf3.js";import"./ad6a1a36.js";const m=()=>o`
  <lion-combobox name="combo" label="Default">
    ${t(e.map((t,e)=>o`
          <lion-option .checked="${0===e}" .choiceValue="${t}">${t}</lion-option>
        `))}
  </lion-combobox>
`,s=document,i=[{key:"main",story:m}];let r=!1;for(const o of i){const t=s.querySelector(`[mdjs-story-name="${o.key}"]`);t&&(t.story=o.story,t.key=o.key,r=!0,Object.assign(t,{simulatorUrl:"/simulator/",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}r&&(customElements.get("mdjs-preview")||import("./a7b4f51b.js"),customElements.get("mdjs-story")||import("./cddf006a.js"));export{m as main};
