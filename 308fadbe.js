import"./24f95583.js";import{x as o}from"./b4be29f1.js";import"./05905ff1.js";import"./b57227cf.js";import"./0bf7a48d.js";import"./48b0a907.js";import"./7902d8e0.js";import"./dc2f5f5a.js";import"./d45984a3.js";import"./4afec9a2.js";import"./11b71ee2.js";import"./4cc99b59.js";import"./19d2607c.js";import"./afb8834e.js";import"./143fde17.js";import"./788d808c.js";import"./4dc0ac82.js";import"./130d2801.js";import"./4a239ef1.js";import"./9157d4cc.js";import"./298b3bc0.js";const s=()=>o`
  <lion-radio-group name="dinos" label="What are your favourite dinosaurs?">
    <lion-radio label="allosaurus" .choiceValue="${"allosaurus"}"></lion-radio>
    <lion-radio label="brontosaurus" .choiceValue="${"brontosaurus"}"></lion-radio>
    <lion-radio label="diplodocus" .choiceValue="${"diplodocus"}"></lion-radio>
  </lion-radio-group>
`,r=document,e=[{key:"main",story:s}];let i=!1;for(const o of e){const s=r.querySelector(`[mdjs-story-name="${o.key}"]`);s&&(s.story=o.story,s.key=o.key,i=!0,Object.assign(s,{simulatorUrl:"/simulator/",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}i&&(customElements.get("mdjs-preview")||import("./a7b4f51b.js"),customElements.get("mdjs-story")||import("./cddf006a.js"));export{s as main};
