import"./08927fef.js";import{x as e}from"./b4be29f1.js";import"./05905ff1.js";import"./1ae2af96.js";import"./9d4fbb3c.js";import"./5c8a0a9d.js";import"./5034b8b0.js";import"./dc2f5f5a.js";import"./d45984a3.js";import"./4afec9a2.js";import"./11b71ee2.js";import"./4cc99b59.js";import"./19d2607c.js";import"./afb8834e.js";import"./143fde17.js";import"./6722e641.js";import"./ee65bf86.js";const t=()=>e` <lion-input label="Input" name="input"></lion-input> `,l=()=>e`
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
`,a=document,r=[{key:"label",story:t},{key:"labelSrOnly",story:l},{key:"helpText",story:i},{key:"prefilled",story:o},{key:"readOnly",story:n},{key:"disabled",story:s}];let m=!1;for(const e of r){const t=a.querySelector(`[mdjs-story-name="${e.key}"]`);t&&(t.story=e.story,t.key=e.key,m=!0,Object.assign(t,{simulatorUrl:"/simulator/",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}m&&(customElements.get("mdjs-preview")||import("./24735558.js"),customElements.get("mdjs-story")||import("./cddf006a.js"));export{s as disabled,i as helpText,t as label,l as labelSrOnly,o as prefilled,n as readOnly};
