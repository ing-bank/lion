import"./f1151d68.js";import{x as o}from"./b8bc2eda.js";import"./6638bb86.js";import{l as e,a as t}from"./ab83db9b.js";import"./b54e7655.js";import"./f674cc3a.js";import"./dcadf410.js";import"./be5f2fd3.js";import"./777b51e0.js";import"./c48d90f3.js";import"./7c882590.js";import"./4afec9a2.js";import"./11b71ee2.js";import"./dc2f5f5a.js";import"./4c616179.js";import"./acda6ea6.js";import"./0ed5d59c.js";import"./d924b319.js";import"./4dc0ac82.js";import"./4abf0ca8.js";import"./143fde17.js";import"./6722e641.js";import"./2cefa045.js";import"./af1609b4.js";import"./ac7779e1.js";import"./18551691.js";const m=()=>o`
  <lion-combobox name="combo" label="Default">
    ${e(t.map((e,t)=>o`
          <lion-option .checked="${0===t}" .choiceValue="${e}">${e}</lion-option>
        `))}
  </lion-combobox>
`,s=document,i=[{key:"main",story:m}];let r=!1;for(const o of i){const e=s.querySelector(`[mdjs-story-name="${o.key}"]`);e&&(e.story=o.story,e.key=o.key,r=!0,Object.assign(e,{simulatorUrl:"/simulator/",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}r&&(customElements.get("mdjs-preview")||import("./e90784d0.js"),customElements.get("mdjs-story")||import("./0defd61d.js"));export{m as main};
