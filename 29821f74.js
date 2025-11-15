import"./24f95583.js";import{x as e}from"./b4be29f1.js";import"./05905ff1.js";import"./f5e3cf69.js";import"./4a239ef1.js";import"./9157d4cc.js";import"./7902d8e0.js";import"./dc2f5f5a.js";import"./d45984a3.js";import"./4afec9a2.js";import"./11b71ee2.js";import"./4cc99b59.js";import"./19d2607c.js";import"./afb8834e.js";import"./143fde17.js";import"./298b3bc0.js";const l=()=>e` <lion-input label="Input" name="input"></lion-input> `,t=()=>e`
  <lion-input label-sr-only label="Input" name="input"></lion-input>
`,i=()=>e`
  <lion-input>
    <label slot="label">Label</label>
    <div slot="help-text">
      Help text using <a href="https://example.com/" target="_blank">html</a>
    </div>
  </lion-input>
`,o=()=>e`
  <lion-input .modelValue="${"Prefilled value"}" label="Prefilled"></lion-input>
`,n=()=>e`
  <lion-input readonly .modelValue="${"This is read only"}" label="Read only"></lion-input>
`,s=()=>e`
  <lion-input disabled .modelValue="${"This is disabled"}" label="Disabled"></lion-input>
`,a=document,r=[{key:"label",story:l},{key:"labelSrOnly",story:t},{key:"helpText",story:i},{key:"prefilled",story:o},{key:"readOnly",story:n},{key:"disabled",story:s}];let m=!1;for(const e of r){const l=a.querySelector(`[mdjs-story-name="${e.key}"]`);l&&(l.story=e.story,l.key=e.key,m=!0,Object.assign(l,{simulatorUrl:"/simulator/",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}m&&(customElements.get("mdjs-preview")||import("./a7b4f51b.js"),customElements.get("mdjs-story")||import("./cddf006a.js"));export{s as disabled,i as helpText,l as label,t as labelSrOnly,o as prefilled,n as readOnly};
