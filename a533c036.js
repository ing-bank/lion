import"./24f95583.js";import{x as e}from"./b4be29f1.js";import"./05905ff1.js";import"./d5d7e9e8.js";import"./ebf3d6e7.js";import{l as o}from"./c85cfbca.js";import{P as t}from"./a06c5caf.js";import"./1fe9105d.js";import"./4cc99b59.js";import"./19d2607c.js";import"./afb8834e.js";import"./d45984a3.js";import"./4afec9a2.js";import"./11b71ee2.js";import"./dc2f5f5a.js";import"./9a16257f.js";import"./4a239ef1.js";import"./9157d4cc.js";import"./7902d8e0.js";import"./143fde17.js";import"./298b3bc0.js";import"./9e1b447d.js";import"./788d808c.js";import"./48b0a907.js";import"./4dc0ac82.js";import"./459b1eec.js";import"./cc85a6f4.js";import"./48ac1cb5.js";import"./e49751c9.js";import"./b7f85193.js";import"./622cc741.js";const s=()=>(o(),e`
    <lion-input-tel
      .modelValue="${"+639921343959"}"
      live-format
      label="Telephone number"
      name="phoneNumber"
    ></lion-input-tel>
    <h-output
      .show="${["activeRegion",{name:"all or allowed regions",processor:e=>JSON.stringify(e._allowedOrAllRegions)},"modelValue"]}" 'modelValue']}"
      .readyPromise="${t.loadComplete}"
    ></h-output>
  `),m=document,r=[{key:"main",story:s}];let i=!1;for(const e of r){const o=m.querySelector(`[mdjs-story-name="${e.key}"]`);o&&(o.story=e.story,o.key=e.key,i=!0,Object.assign(o,{simulatorUrl:"/simulator/",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}i&&(customElements.get("mdjs-preview")||import("./a7b4f51b.js"),customElements.get("mdjs-story")||import("./cddf006a.js"));export{s as main};
