import"./08927fef.js";import{x as e}from"./b4be29f1.js";import"./05905ff1.js";import"./4d71ac72.js";import"./dfa58534.js";import"./4cc99b59.js";import"./19d2607c.js";import"./afb8834e.js";import"./d45984a3.js";import"./4afec9a2.js";import"./11b71ee2.js";import"./dc2f5f5a.js";import"./88185952.js";import"./24c57689.js";import"./10e1d49e.js";import"./9d4fbb3c.js";import"./5c8a0a9d.js";import"./5034b8b0.js";import"./143fde17.js";import"./6722e641.js";import"./ee65bf86.js";import"./e49751c9.js";import"./4dc0ac82.js";function t(e){return e.replace(/[^0-9,. ]/g,"")}const o=()=>e`
  <lion-input-amount label="Amount" .modelValue="${-123456.78}"></lion-input-amount>
`,n=()=>e`
  <lion-input-amount label="Price" currency="USD" .modelValue="${123456.78}"></lion-input-amount>
`,i=()=>e`
    <lion-input-amount
      label="Price"
      currency="JOD"
      .locale="nl-NL"
      .modelValue="${123456.78}"
    ></lion-input-amount>
  `,r=()=>e`
  <lion-input-amount label="Amount" .preprocessor="${t}"></lion-input-amount>
`,m=()=>e`
  <lion-input-amount
    label="Amount"
    help-text="Faulty prefilled input will cause error feedback"
    .modelValue="${"foo"}"
  ></lion-input-amount>
`,l=()=>e`
  <lion-input-amount
    label="Amount"
    help-text="Prefilled and formatted"
    .formatOptions="$"
    .modelValue="${20}"
  >
  </lion-input-amount>
`,s=document,a=[{key:"negativeNumber",story:o},{key:"currencySuffix",story:n},{key:"forceLocale",story:i},{key:"forceDigits",story:r},{key:"faultyPrefilled",story:m},{key:"noDecimals",story:l}];let u=!1;for(const e of a){const t=s.querySelector(`[mdjs-story-name="${e.key}"]`);t&&(t.story=e.story,t.key=e.key,u=!0,Object.assign(t,{simulatorUrl:"/simulator/",languages:[{key:"de-DE",name:"German"},{key:"en-GB",name:"English (United Kingdom)"},{key:"en-US",name:"English (United States)"},{key:"nl-NL",name:"Dutch"}]}))}u&&(customElements.get("mdjs-preview")||import("./24735558.js"),customElements.get("mdjs-story")||import("./cddf006a.js"));export{n as currencySuffix,m as faultyPrefilled,r as forceDigits,i as forceLocale,o as negativeNumber,l as noDecimals};
