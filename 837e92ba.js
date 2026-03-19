import"./08927fef.js";import{x as o}from"./b4be29f1.js";import"./05905ff1.js";import{l as t,a as e}from"./2758bd27.js";import"./79b4508b.js";import"./9534c2cb.js";import"./afb8834e.js";import"./19d2607c.js";import"./d6bc368c.js";import"./4cc99b59.js";import"./d45984a3.js";import"./4afec9a2.js";import"./11b71ee2.js";import"./dc2f5f5a.js";import"./9af64c94.js";import"./acda6ea6.js";import"./0ed5d59c.js";import"./b9d3bf75.js";import"./4dc0ac82.js";import"./5034b8b0.js";import"./143fde17.js";import"./6722e641.js";import"./06654559.js";import"./dc4e1be5.js";import"./0ab13f37.js";import"./06f5b106.js";const m=()=>o`
  <lion-combobox name="combo" label="Default">
    ${t(e.map((t,e)=>o`
          <lion-option .checked="${0===e}" .choiceValue="${t}">${t}</lion-option>
        `))}
  </lion-combobox>
`,s=document,i=[{key:"main",story:m}];let r=!1;for(const o of i){const t=s.querySelector(`[mdjs-story-name="${o.key}"]`);t&&(t.story=o.story,t.key=o.key,r=!0,Object.assign(t,{simulatorUrl:"/simulator/",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}r&&(customElements.get("mdjs-preview")||import("./24735558.js"),customElements.get("mdjs-story")||import("./cddf006a.js"));export{m as main};
