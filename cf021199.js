import"./24f95583.js";import{x as o}from"./b4be29f1.js";import"./05905ff1.js";import"./828a75da.js";import"./44105dd4.js";import"./ec06148e.js";import"./c6fab747.js";import"./dc2f5f5a.js";import"./d45984a3.js";import"./4afec9a2.js";import"./11b71ee2.js";import"./4cc99b59.js";import"./19d2607c.js";import"./afb8834e.js";import"./143fde17.js";import"./bfba5e5f.js";import"./4dc0ac82.js";import"./ad6a1a36.js";import"./c2aef983.js";import"./7077221a.js";import"./f12ecf0e.js";const e=()=>o`
  <lion-radio-group name="dinos" label="What are your favourite dinosaurs?">
    <lion-radio label="allosaurus" .choiceValue="${"allosaurus"}"></lion-radio>
    <lion-radio label="brontosaurus" .choiceValue="${"brontosaurus"}"></lion-radio>
    <lion-radio label="diplodocus" .choiceValue="${"diplodocus"}"></lion-radio>
  </lion-radio-group>
`,s=document,r=[{key:"main",story:e}];let i=!1;for(const o of r){const e=s.querySelector(`[mdjs-story-name="${o.key}"]`);e&&(e.story=o.story,e.key=o.key,i=!0,Object.assign(e,{simulatorUrl:"/simulator/",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}i&&(customElements.get("mdjs-preview")||import("./a7b4f51b.js"),customElements.get("mdjs-story")||import("./cddf006a.js"));export{e as main};
